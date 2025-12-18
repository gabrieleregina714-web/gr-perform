-- Social schema (friends-only)
-- Run this in Supabase SQL editor.
--
-- ATTENZIONE:
-- Nel SQL Editor di Supabase devi incollare SOLO SQL.
-- Se incolli codice JavaScript o commenti tipo "// ..." vedrai errori come:
--   syntax error at or near "//"
-- In SQL i commenti corretti sono:
--   -- commento singola riga
--   /* commento multi riga */

-- Needed for gen_random_uuid()
create extension if not exists pgcrypto;

-- 1) Profiles: invite code
alter table public.profiles
  add column if not exists invite_code text;

-- Ensure avatar_url exists for Social UI (friend-visible)
alter table public.profiles
  add column if not exists avatar_url text;

create unique index if not exists profiles_invite_code_unique
  on public.profiles (invite_code)
  where invite_code is not null;

-- 2) Friendships
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  friend_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint friendships_no_self check (user_id <> friend_id)
);

-- Prevent duplicates in either direction
create unique index if not exists friendships_pair_unique
  on public.friendships ((least(user_id, friend_id)), (greatest(user_id, friend_id)));

alter table public.friendships enable row level security;

do $$ begin
  create policy "friendships_select_participants" on public.friendships
    for select
    using (auth.uid() = user_id or auth.uid() = friend_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "friendships_insert_self" on public.friendships
    for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "friendships_delete_participants" on public.friendships
    for delete
    using (auth.uid() = user_id or auth.uid() = friend_id);
exception when duplicate_object then null; end $$;

-- Allow friends to read basic profile fields (name/avatar/invite_code)
-- Note: base schema already has "Users can view own profile".
do $$ begin
  create policy "profiles_select_owner_or_friends" on public.profiles
    for select
    using (
      auth.uid() = id
      or exists (
        select 1 from public.friendships f
        where (f.user_id = auth.uid() and f.friend_id = profiles.id)
           or (f.friend_id = auth.uid() and f.user_id = profiles.id)
      )
    );
exception when duplicate_object then null; end $$;

-- Allow users to update their own profile (name, avatar_url, invite_code)
do $$ begin
  create policy "profiles_update_owner" on public.profiles
    for update
    using (auth.uid() = id)
    with check (auth.uid() = id);
exception when duplicate_object then null; end $$;

-- 3) Friend stats snapshots (visible to friends)
create table if not exists public.friend_stats (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  stats jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.friend_stats enable row level security;

do $$ begin
  create policy "friend_stats_select_owner_or_friends" on public.friend_stats
    for select
    using (
      auth.uid() = user_id
      or exists (
        select 1 from public.friendships f
        where (f.user_id = auth.uid() and f.friend_id = friend_stats.user_id)
           or (f.friend_id = auth.uid() and f.user_id = friend_stats.user_id)
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "friend_stats_upsert_owner" on public.friend_stats
    for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "friend_stats_update_owner" on public.friend_stats
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- 4) Posts / Likes / Comments (friends-only visibility)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text,
  image_path text,
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_user_id_idx on public.posts (user_id);

alter table public.posts enable row level security;

do $$ begin
  create policy "posts_select_owner_or_friends" on public.posts
    for select
    using (
      auth.uid() = user_id
      or exists (
        select 1 from public.friendships f
        where (f.user_id = auth.uid() and f.friend_id = posts.user_id)
           or (f.friend_id = auth.uid() and f.user_id = posts.user_id)
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "posts_insert_owner" on public.posts
    for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "posts_update_owner" on public.posts
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "posts_delete_owner" on public.posts
    for delete
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists post_likes_user_id_idx on public.post_likes (user_id);

alter table public.post_likes enable row level security;

do $$ begin
  create policy "post_likes_select_if_post_visible" on public.post_likes
    for select
    using (
      exists (
        select 1 from public.posts p
        where p.id = post_likes.post_id
          and (
            p.user_id = auth.uid()
            or exists (
              select 1 from public.friendships f
              where (f.user_id = auth.uid() and f.friend_id = p.user_id)
                 or (f.friend_id = auth.uid() and f.user_id = p.user_id)
            )
          )
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "post_likes_insert_owner" on public.post_likes
    for insert
    with check (
      auth.uid() = user_id
      and exists (
        select 1 from public.posts p
        where p.id = post_likes.post_id
          and (
            p.user_id = auth.uid()
            or exists (
              select 1 from public.friendships f
              where (f.user_id = auth.uid() and f.friend_id = p.user_id)
                 or (f.friend_id = auth.uid() and f.user_id = p.user_id)
            )
          )
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "post_likes_delete_owner" on public.post_likes
    for delete
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists post_comments_post_id_idx on public.post_comments (post_id);
create index if not exists post_comments_created_at_idx on public.post_comments (created_at);

alter table public.post_comments enable row level security;

do $$ begin
  create policy "post_comments_select_if_post_visible" on public.post_comments
    for select
    using (
      exists (
        select 1 from public.posts p
        where p.id = post_comments.post_id
          and (
            p.user_id = auth.uid()
            or exists (
              select 1 from public.friendships f
              where (f.user_id = auth.uid() and f.friend_id = p.user_id)
                 or (f.friend_id = auth.uid() and f.user_id = p.user_id)
            )
          )
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "post_comments_insert_owner" on public.post_comments
    for insert
    with check (
      auth.uid() = user_id
      and exists (
        select 1 from public.posts p
        where p.id = post_comments.post_id
          and (
            p.user_id = auth.uid()
            or exists (
              select 1 from public.friendships f
              where (f.user_id = auth.uid() and f.friend_id = p.user_id)
                 or (f.friend_id = auth.uid() and f.user_id = p.user_id)
            )
          )
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "post_comments_delete_owner" on public.post_comments
    for delete
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- 5) Stories (Instagram-style, 24h)
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  image_path text,
  image_url text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);

create index if not exists stories_user_expires_idx on public.stories (user_id, expires_at desc);
create index if not exists stories_expires_idx on public.stories (expires_at desc);

alter table public.stories enable row level security;

do $$ begin
  create policy "stories_select_owner_or_friends_active" on public.stories
    for select
    using (
      expires_at > now()
      and (
        auth.uid() = user_id
        or exists (
          select 1 from public.friendships f
          where (f.user_id = auth.uid() and f.friend_id = stories.user_id)
             or (f.friend_id = auth.uid() and f.user_id = stories.user_id)
        )
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "stories_insert_owner" on public.stories
    for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "stories_delete_owner" on public.stories
    for delete
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- 6) Storage bucket for social images (optional, but recommended)
-- This creates a PUBLIC bucket. If you prefer private media, we can switch to signed URLs.
-- If you prefer, you can also create it manually from Dashboard → Storage → New bucket:
-- name: social, public: true
insert into storage.buckets (id, name, public)
values ('social', 'social', true)
on conflict (id) do nothing;

-- IMPORTANT (Storage policies)
-- On some Supabase projects, running ALTER/CREATE POLICY on storage.objects from SQL Editor
-- can fail with: "must be owner of table objects".
--
-- Recommended: create Storage policies from Dashboard → Storage → Policies.
-- Create these 3 policies on table `storage.objects`:
--
-- 1) READ (public bucket):
--    operation: SELECT
--    using: (bucket_id = 'social')
--
-- 2) INSERT (authenticated uploads, only inside their own folder):
--    operation: INSERT
--    with check: (
--      bucket_id = 'social'
--      and auth.role() = 'authenticated'
--      and (storage.foldername(name))[1] = auth.uid()::text
--    )
--
-- 3) DELETE (owner can delete their objects):
--    operation: DELETE
--    using: (bucket_id = 'social' and auth.uid() = owner)
--
-- If your SQL Editor lets you run as role `postgres`, you can also create them via SQL:
-- do $$ begin
--   create policy "social_bucket_read" on storage.objects
--     for select
--     using (bucket_id = 'social');
-- exception when duplicate_object then null; end $$;
--
-- do $$ begin
--   create policy "social_bucket_insert" on storage.objects
--     for insert
--     with check (
--       bucket_id = 'social'
--       and auth.role() = 'authenticated'
--       and (storage.foldername(name))[1] = auth.uid()::text
--     );
-- exception when duplicate_object then null; end $$;
--
-- do $$ begin
--   create policy "social_bucket_delete" on storage.objects
--     for delete
--     using (bucket_id = 'social' and auth.uid() = owner);
-- exception when duplicate_object then null; end $$;

-- If you still see PGRST205 (table not found) right after creating tables,
-- you can force PostgREST to reload the schema cache:
-- select pg_notify('pgrst', 'reload schema');
