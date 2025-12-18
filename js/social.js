// Friends-only social (Supabase-backed)
// This file overrides the placeholder social functions in app.js.

(function () {
    let ltSocialSchemaMissing = false;
    const LT_SOCIAL_SCHEMA_WARN_KEY = 'lt_warn_social_schema_missing';
    const LT_SOCIAL_BUCKET_WARN_KEY = 'lt_warn_social_bucket_missing';
    const LT_STORY_TTL_MS = 24 * 60 * 60 * 1000;

    let ltStoriesByUser = new Map();
    let ltStoryUsers = new Set();
    let ltProfilesById = new Map();

    function uuid() {
        try {
            if (crypto && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
        } catch (_) {}
        // Fallback (not cryptographically strong, but fine for client-side IDs)
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    function getClient() {
        return window.ltSupabase;
    }

    async function getUser() {
        try {
            const cached = typeof window.ltGetCachedUser === 'function' ? window.ltGetCachedUser() : null;
            if (cached) return cached;
        } catch (_) {}

        if (typeof window.ltGetCurrentUser === 'function') {
            return await window.ltGetCurrentUser();
        }
        return null;
    }

    function ensureLocalInviteCode() {
        try {
            if (typeof window.getMyInviteCode === 'function') return window.getMyInviteCode();
        } catch (_) {}

        let code = localStorage.getItem('lt_invite_code');
        if (!code) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            code = 'LIFE-';
            for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
            localStorage.setItem('lt_invite_code', code);
        }
        return code;
    }

    async function syncInviteCodeToProfile() {
        const user = await getUser();
        const client = getClient();
        if (!user || !client) {
            console.warn('[Social] syncInviteCode: no user or client');
            return false;
        }

        const code = ensureLocalInviteCode();
        try {
            // Try to persist code on the profile (requires `invite_code` column)
            const { error } = await client
                .from('profiles')
                .update({ invite_code: code })
                .eq('id', user.id);
            
            if (error) {
                console.error('[Social] syncInviteCode error:', error);
                return false;
            }
            console.log('[Social] Invite code synced to cloud:', code);
            return true;
        } catch (e) {
            console.error('[Social] syncInviteCode exception:', e);
            return false;
        }
    }

    async function getMyInviteCodeCloudAware() {
        const user = await getUser();
        const client = getClient();
        const local = ensureLocalInviteCode();

        if (!user || !client) return local;

        try {
            const { data, error } = await client
                .from('profiles')
                .select('invite_code')
                .eq('id', user.id)
                .single();
            if (!error && data && data.invite_code) {
                localStorage.setItem('lt_invite_code', String(data.invite_code).toUpperCase());
                return String(data.invite_code).toUpperCase();
            }
        } catch (_) {}

        await syncInviteCodeToProfile();
        return local;
    }

    function safeShowToast(message, type) {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            console.log(type ? `[${type}]` : '', message);
        }
    }

    function maybeWarnSchemaMissing(err) {
        const code = err && (err.code || err?.error?.code);
        if (code !== 'PGRST205') return false;

        const rawMsg = String(err?.message || err?.details || err?.hint || '');
        let missing = '';
        try {
            // Examples:
            // - "Could not find the table 'public.stories' in the schema cache"
            // - "Could not find the table 'stories' in the schema cache"
            const m = rawMsg.match(/could not find the table\s+'([^']+)'/i);
            if (m && m[1]) missing = m[1];
        } catch (_) {}

        ltSocialSchemaMissing = true;
        try {
            const already = localStorage.getItem(LT_SOCIAL_SCHEMA_WARN_KEY) === '1';
            if (!already) {
                localStorage.setItem(LT_SOCIAL_SCHEMA_WARN_KEY, '1');
                const extra = missing ? ` (manca: ${missing})` : '';
                safeShowToast(`Social non attivo: esegui social-schema.sql su Supabase e ricarica la pagina${extra}`, 'warning');
            }
        } catch (_) {}

        return true;
    }

    function maybeWarnBucketMissing(err) {
        const message = String(err?.message || err?.error_description || err?.error || '').toLowerCase();
        if (!message.includes('bucket not found')) return false;

        try {
            const already = localStorage.getItem(LT_SOCIAL_BUCKET_WARN_KEY) === '1';
            if (!already) {
                localStorage.setItem(LT_SOCIAL_BUCKET_WARN_KEY, '1');
                safeShowToast('Upload foto non disponibile: crea il bucket Storage "social" su Supabase (public) e ricarica', 'warning');
            }
        } catch (_) {}

        return true;
    }

    function humanizePostError(err) {
        const code = String(err?.code || '').toUpperCase();
        const msg = String(err?.message || '').toLowerCase();

        if (code === 'PGRST205' || msg.includes("could not find the table")) {
            const raw = String(err?.message || err?.details || err?.hint || '');
            const m = raw.match(/could not find the table\s+'([^']+)'/i);
            const extra = m && m[1] ? ` (manca: ${m[1]})` : '';
            return `Tabelle Social mancanti su Supabase${extra} (esegui social-schema.sql e ricarica)`;
        }
        if (msg.includes('bucket not found')) {
            return 'Bucket Storage "social" mancante su Supabase (crealo e ricarica)';
        }
        if (msg.includes('row-level security') || msg.includes('violates row level security') || msg.includes('rls')) {
            return 'Permessi (RLS) insufficienti su Supabase per post/foto';
        }
        if (msg.includes('jwt') || msg.includes('not authorized') || msg.includes('unauthorized')) {
            return 'Non autorizzato: fai logout/login e riprova';
        }

        const raw = String(err?.message || err?.details || err?.hint || '').trim();
        if (!raw) return 'Errore sconosciuto';

        // Truncate to keep toast readable
        return raw.length > 110 ? raw.slice(0, 110) + '…' : raw;
    }

    function formatTimeAgo(iso) {
        try {
            const ms = Date.now() - Date.parse(iso);
            const min = Math.floor(ms / 60000);
            if (min < 1) return 'adesso';
            if (min < 60) return `${min}m`;
            const h = Math.floor(min / 60);
            if (h < 24) return `${h}h`;
            const d = Math.floor(h / 24);
            return `${d}g`;
        } catch (_) {
            return '';
        }
    }

    function dataUrlToBlob(dataUrl) {
        const parts = dataUrl.split(',');
        const mime = (parts[0].match(/:(.*?);/) || [])[1] || 'image/jpeg';
        const binary = atob(parts[1]);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
        return new Blob([bytes], { type: mime });
    }

    async function compressToDataUrl(file) {
        return await new Promise((resolve) => {
            if (typeof window.compressImage === 'function') {
                window.compressImage(file, 1080, 0.7, (data) => resolve(data));
            } else {
                // Fallback: no compression
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            }
        });
    }

    // ---------------- Friends ----------------

    async function loadFriendsFromCloud() {
        const user = await getUser();
        const client = getClient();
        if (!user || !client) return null;

        const { data: friendships, error } = await client
            .from('friendships')
            .select('user_id, friend_id, created_at')
            .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

        if (error) throw error;

        const friendIds = (friendships || [])
            .map((f) => (f.user_id === user.id ? f.friend_id : f.user_id))
            .filter(Boolean);

        if (friendIds.length === 0) {
            localStorage.setItem('lt_friends', '[]');
            return [];
        }

        const [{ data: profiles, error: pErr }, { data: statsRows, error: sErr }] = await Promise.all([
            client.from('profiles').select('id,name,invite_code,avatar_url').in('id', friendIds),
            client.from('friend_stats').select('user_id,stats').in('user_id', friendIds)
        ]);

        if (pErr) throw pErr;
        // friend_stats may not exist yet
        if (sErr) {
            // ignore
        }

        const statsById = new Map((statsRows || []).map((r) => [r.user_id, r.stats]));

        const friends = (profiles || []).map((p) => ({
            id: p.id,
            name: p.name || 'Amico',
            code: p.invite_code || null,
            avatar_url: p.avatar_url || null,
            stats: statsById.get(p.id) || null
        }));

        localStorage.setItem('lt_friends', JSON.stringify(friends));
        return friends;
    }

    async function addFriendByInviteCode(code) {
        const user = await getUser();
        const client = getClient();
        if (!user || !client) {
            safeShowToast('Devi essere loggato per aggiungere amici', 'error');
            return { ok: false };
        }

        const cleaned = String(code || '').trim().toUpperCase();
        if (!cleaned) {
            safeShowToast('Codice non valido', 'error');
            return { ok: false };
        }

        const mine = await getMyInviteCodeCloudAware();
        if (cleaned === mine) {
            safeShowToast('Non puoi aggiungere te stesso!', 'error');
            return { ok: false };
        }

        const { data: target, error: tErr } = await client
            .from('profiles')
            .select('id,name,invite_code,avatar_url')
            .eq('invite_code', cleaned)
            .maybeSingle();

        if (tErr) throw tErr;
        if (!target) {
            safeShowToast('Codice non trovato', 'error');
            return { ok: false };
        }

        // Insert friendship (one row; policies allow both users to see it)
        const { error: fErr } = await client
            .from('friendships')
            .insert({ user_id: user.id, friend_id: target.id });

        if (fErr) {
            // Duplicate is fine
            const msg = String(fErr.message || '').toLowerCase();
            if (msg.includes('duplicate') || msg.includes('unique')) {
                safeShowToast('Amico già aggiunto!', 'warning');
                return { ok: true, already: true };
            }
            throw fErr;
        }

        safeShowToast('Amico aggiunto!', 'success');
        return { ok: true };
    }

    async function removeFriendById(friendId) {
        const user = await getUser();
        const client = getClient();
        if (!user || !client) return;

        const { error } = await client
            .from('friendships')
            .delete()
            .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`);

        if (error) throw error;
    }

    function getCachedFriends() {
        try {
            return JSON.parse(localStorage.getItem('lt_friends') || '[]');
        } catch (_) {
            return [];
        }
    }

    function computeLeaderboardRank(myStats, friends) {
        const myStreak = (myStats && myStats.streak) || 0;
        const streaks = [myStreak, ...friends.map((f) => (f.stats && f.stats.streak) || 0)];
        const sorted = [...streaks].sort((a, b) => b - a);
        const rank = sorted.indexOf(myStreak) + 1;
        return rank > 0 ? rank : '-';
    }

    function getMyLocalStatsSnapshot() {
        let streak = 0;
        try {
            if (typeof window.calculateOverallStreak === 'function') {
                streak = window.calculateOverallStreak();
            }
        } catch (_) {
            streak = 0;
        }

        let level = 1;
        try {
            const eliteUser = JSON.parse(localStorage.getItem('lt_user') || '{}');
            level = eliteUser.level || 1;
        } catch (_) {}

        return { level, streak };
    }

    function renderFriendsList(friends) {
        const container = document.getElementById('friendsList');
        if (!container) return;

        if (!Array.isArray(friends) || friends.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-group"></i>
                    <p>Nessun amico ancora</p>
                    <button class="btn btn-secondary" onclick="openModal('inviteFriendModal')">Invita amici</button>
                </div>
            `;
            return;
        }

        container.innerHTML = friends
            .map((friend, index) => {
                const streak = (friend.stats && friend.stats.streak) || 0;
                const level = (friend.stats && friend.stats.level) || 1;
                const avatar = safeImgSrc(friend.avatar_url);
                const initial = String(friend.name || 'A').charAt(0).toUpperCase();
                return `
                    <div class="friend-item">
                        <div class="friend-avatar">${avatar ? `<img src="${avatar}" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:999px;">` : initial}</div>
                        <div class="friend-info">
                            <div class="friend-name">${friend.name || 'Amico'}</div>
                            <div class="friend-stats">Livello: ${level} • Streak: ${streak} giorni</div>
                        </div>
                        <button class="friend-action" onclick="removeFriend(${index})"><i class="fas fa-times"></i></button>
                    </div>
                `;
            })
            .join('');
    }

    // ---------------- Feed ----------------

    async function fetchFeedPosts() {
        const user = await getUser();
        const client = getClient();
        if (!user || !client) return [];

        const localProfile = getLocalProfileSnapshot();

        const friends = getCachedFriends();
        const ids = [user.id, ...friends.map((f) => f.id).filter(Boolean)];
        if (ids.length === 0) return [];

        const { data: posts, error } = await client
            .from('posts')
            .select('id,user_id,body,image_url,image_path,created_at')
            .in('user_id', ids)
            .order('created_at', { ascending: false })
            .limit(30);

        if (error) throw error;

        const postIds = (posts || []).map((p) => p.id);
        if (postIds.length === 0) return [];

        const [{ data: likes }, { data: comments }, { data: authors }] = await Promise.all([
            client.from('post_likes').select('post_id,user_id').in('post_id', postIds),
            client.from('post_comments').select('id,post_id,user_id,body,created_at').in('post_id', postIds).order('created_at', { ascending: true }),
            client.from('profiles').select('id,name,avatar_url').in('id', Array.from(new Set((posts || []).map((p) => p.user_id))))
        ]);

        const authorById = new Map((authors || []).map((a) => [a.id, a.name || 'Utente']));
        const avatarById = new Map((authors || []).map((a) => [a.id, a.avatar_url || null]));
        const likesByPost = new Map();
        const likedByMe = new Set();
        (likes || []).forEach((l) => {
            likesByPost.set(l.post_id, (likesByPost.get(l.post_id) || 0) + 1);
            if (l.user_id === user.id) likedByMe.add(l.post_id);
        });

        const commentsByPost = new Map();
        (comments || []).forEach((c) => {
            const arr = commentsByPost.get(c.post_id) || [];
            arr.push(c);
            commentsByPost.set(c.post_id, arr);
        });

        return (posts || []).map((p) => {
            const isMine = p.user_id === user.id;
            const authorName = isMine
                ? (localProfile.name || authorById.get(p.user_id) || 'Tu')
                : (authorById.get(p.user_id) || 'Utente');
            return {
                ...p,
                isMine,
                authorName,
                authorPhoto: isMine ? safeImgSrc(localProfile.photo) : safeImgSrc(avatarById.get(p.user_id)),
                authorHasStory: ltStoryUsers.has(p.user_id),
                likesCount: likesByPost.get(p.id) || 0,
                likedByMe: likedByMe.has(p.id),
                comments: commentsByPost.get(p.id) || []
            };
        });
    }

    function renderFeed(posts) {
        const container = document.getElementById('socialFeed');
        if (!container) return;

        if (!Array.isArray(posts) || posts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bolt"></i>
                    <p>Nessun post ancora</p>
                    <button class="btn btn-secondary" onclick="openModal('newPostModal')">Crea il primo post</button>
                </div>
            `;
            return;
        }

        container.innerHTML = posts
            .map((p) => {
                const likeClass = p.likedByMe ? 'liked' : '';
                const time = formatTimeAgo(p.created_at);
                const image = p.image_url
                    ? `<img class="social-post-image" src="${p.image_url}" alt="Post image" loading="lazy">`
                    : '';

                const avatar = p.authorPhoto
                    ? `<img src="${p.authorPhoto}" alt="Avatar">`
                    : `<span class="social-post-avatar-fallback">${escapeHtml(String(p.authorName || 'U').charAt(0).toUpperCase())}</span>`;

                const storyClass = p.authorHasStory ? 'has-story' : '';
                const avatarClick = p.authorHasStory ? `onclick="openUserStory('${p.user_id}')"` : '';

                const comments = (p.comments || [])
                    .slice(-3)
                    .map((c) => {
                        const author = (c.user_id === p.user_id) ? p.authorName : 'Amico';
                        return `<div class="social-comment"><span class="social-comment-author">${escapeHtml(author)}:</span> ${escapeHtml(c.body || '')}</div>`;
                    })
                    .join('');

                return `
                    <div class="social-post-wrap" data-post-id="${p.id}">
                        <div class="social-post-top">
                            <div class="social-post-author-block">
                                <div class="social-post-avatar ${storyClass}" ${avatarClick}>${avatar}</div>
                                <button class="btn-text" type="button" onclick="openSocialUser('${p.user_id}')">${escapeHtml(p.authorName)}</button>
                            </div>
                            <div class="social-post-time">${time}</div>
                        </div>

                        <div class="social-post">
                            ${p.body ? `<div class="social-post-body">${escapeHtml(p.body)}</div>` : ''}
                            ${image}
                        </div>

                        <div class="social-post-actions">
                            <button class="social-action-btn ${likeClass}" onclick="toggleLike('${p.id}')"><i class="fas fa-heart"></i> <span>${p.likesCount}</span></button>
                            <button class="social-action-btn" onclick="toggleComments('${p.id}')"><i class="fas fa-comment"></i> <span>${(p.comments || []).length}</span></button>
                            <button class="social-action-btn" onclick="sharePost('${p.id}')"><i class="fas fa-paper-plane"></i></button>
                        </div>

                        <div class="social-post-comments" id="comments-${p.id}" style="display:none;">
                            <div class="social-comments-list">${comments || ''}</div>
                            <form class="social-comment-form" onsubmit="addComment(event, '${p.id}')">
                                <input class="social-comment-input" type="text" name="comment" placeholder="Scrivi un commento..." required>
                                <button class="btn btn-primary" type="submit">Invia</button>
                            </form>
                        </div>
                    </div>
                `;
            })
            .join('');
    }

    function escapeHtml(str) {
        return String(str)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function getLocalProfileSnapshot() {
        try {
            const profile = JSON.parse(localStorage.getItem('lt_profile') || '{}');
            const name = (profile && profile.name ? String(profile.name) : '').trim();
            const photo = profile && typeof profile.photo === 'string' ? profile.photo : null;
            return {
                name: name || null,
                photo: photo && photo.startsWith('data:') ? photo : null
            };
        } catch (_) {
            return { name: null, photo: null };
        }
    }

    function safeImgSrc(src) {
        const s = String(src || '').trim();
        if (!s) return null;
        if (s.startsWith('data:image/')) return s;
        if (s.startsWith('http://') || s.startsWith('https://')) return s;
        return null;
    }

    function getFirstName(full) {
        const s = String(full || '').trim();
        if (!s) return 'Utente';
        return s.split(/\s+/)[0];
    }

    async function fetchActiveStories(userIds) {
        const user = await getUser();
        const client = getClient();
        if (!user || !client) {
            ltStoriesByUser = new Map();
            ltStoryUsers = new Set();
            return;
        }

        const ids = Array.isArray(userIds) ? userIds.filter(Boolean) : [];
        if (ids.length === 0) {
            ltStoriesByUser = new Map();
            ltStoryUsers = new Set();
            return;
        }

        const nowIso = new Date().toISOString();
        const { data, error } = await client
            .from('stories')
            .select('id,user_id,image_url,image_path,created_at,expires_at')
            .in('user_id', ids)
            .gt('expires_at', nowIso)
            .order('created_at', { ascending: false })
            .limit(200);

        if (error) throw error;

        const byUser = new Map();
        (data || []).forEach((s) => {
            if (!s || !s.user_id) return;
            const arr = byUser.get(s.user_id) || [];
            arr.push(s);
            byUser.set(s.user_id, arr);
        });

        ltStoriesByUser = byUser;
        ltStoryUsers = new Set(Array.from(byUser.keys()));
    }

    function renderStoriesBar(me, friends) {
        const container = document.getElementById('socialStories');
        if (!container) return;

        const items = [];
        const myHasStory = ltStoryUsers.has(me.id);
        const myAvatar = safeImgSrc(me.avatar_url) || safeImgSrc(me.photo) || null;

        const myClick = myHasStory ? `openUserStory('${me.id}')` : 'addStory()';
        items.push(`
            <button class="story-item" type="button" onclick="${myClick}">
                <div class="story-avatar ${myHasStory ? 'has-story' : ''}">
                    <div class="story-avatar-inner">
                        ${myAvatar ? `<img src="${myAvatar}" alt="La tua storia">` : `<span class="social-post-avatar-fallback">${escapeHtml(getFirstName(me.name).charAt(0).toUpperCase())}</span>`}
                    </div>
                    <div class="story-add-badge" onclick="event.stopPropagation(); addStory();"><i class="fas fa-plus"></i></div>
                </div>
                <div class="story-label">La tua</div>
            </button>
        `);

        (friends || [])
            .filter((f) => f && f.id && ltStoryUsers.has(f.id))
            .forEach((f) => {
                const avatar = safeImgSrc(f.avatar_url);
                const label = getFirstName(f.name || 'Amico');
                items.push(`
                    <button class="story-item" type="button" onclick="openUserStory('${f.id}')">
                        <div class="story-avatar has-story">
                            <div class="story-avatar-inner">
                                ${avatar ? `<img src="${avatar}" alt="Story">` : `<span class="social-post-avatar-fallback">${escapeHtml(label.charAt(0).toUpperCase())}</span>`}
                            </div>
                        </div>
                        <div class="story-label">${escapeHtml(label)}</div>
                    </button>
                `);
            });

        container.innerHTML = items.join('');
    }

    function wireStoryInputOnce() {
        const input = document.getElementById('newStoryImage');
        if (!input || input.dataset.wired === '1') return;
        input.dataset.wired = '1';
        input.addEventListener('change', async (e) => {
            const f = e.target && e.target.files && e.target.files[0] ? e.target.files[0] : null;
            e.target.value = '';
            await createStoryFromFile(f);
        });
    }

    async function createStoryFromFile(file) {
        if (!file) return;

        const user = await getUser();
        const client = getClient();
        if (!user || !client) {
            safeShowToast('Devi essere loggato per pubblicare una storia', 'error');
            return;
        }

        try {
            const storyId = uuid();
            const dataUrl = await compressToDataUrl(file);
            const blob = dataUrlToBlob(dataUrl);
            const ext = (blob.type || 'image/jpeg').includes('png') ? 'png' : 'jpg';
            const path = `${user.id}/stories/${storyId}/${Date.now()}.${ext}`;

            const upload = await client.storage
                .from('social')
                .upload(path, blob, { contentType: blob.type, upsert: false });

            if (upload.error) {
                if (maybeWarnBucketMissing(upload.error)) throw upload.error;
                throw upload.error;
            }

            const pub = client.storage.from('social').getPublicUrl(path);
            const image_url = pub.data && pub.data.publicUrl ? pub.data.publicUrl : null;
            const expires_at = new Date(Date.now() + LT_STORY_TTL_MS).toISOString();

            const { error } = await client
                .from('stories')
                .insert({ user_id: user.id, image_path: path, image_url, expires_at });
            if (error) throw error;

            safeShowToast('Storia pubblicata!', 'success');
            await loadSocialData();
        } catch (e) {
            console.error('Create story error:', e);
            if (maybeWarnSchemaMissing(e) || maybeWarnBucketMissing(e)) {
                // already warned
            }
            safeShowToast(`Errore storia: ${humanizePostError(e)}`, 'error');
        }
    }

    async function createPostFromModal(event) {
        event.preventDefault();

        const user = await getUser();
        const client = getClient();
        if (!user || !client) {
            safeShowToast('Devi essere loggato per pubblicare', 'error');
            return;
        }

        const bodyEl = document.getElementById('newPostBody');
        const fileEl = document.getElementById('newPostImage');
        const btn = event.target.querySelector('button[type="submit"]');

        const body = (bodyEl && bodyEl.value ? bodyEl.value.trim() : '') || null;
        const file = fileEl && fileEl.files && fileEl.files[0] ? fileEl.files[0] : null;

        if (!body && !file) {
            safeShowToast('Scrivi qualcosa o carica una foto', 'warning');
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Pubblicazione...';

        try {
            let image_path = null;
            let image_url = null;

            if (file) {
                const postId = uuid();
                const dataUrl = await compressToDataUrl(file);
                const blob = dataUrlToBlob(dataUrl);
                const ext = (blob.type || 'image/jpeg').includes('png') ? 'png' : 'jpg';
                const path = `${user.id}/${postId}/${Date.now()}.${ext}`;

                const upload = await client.storage
                    .from('social')
                    .upload(path, blob, { contentType: blob.type, upsert: false });

                if (upload.error) {
                    if (maybeWarnBucketMissing(upload.error)) {
                        throw upload.error;
                    }
                    throw upload.error;
                }

                const pub = client.storage.from('social').getPublicUrl(path);
                image_path = path;
                image_url = pub.data && pub.data.publicUrl ? pub.data.publicUrl : null;
            }

            const { error } = await client
                .from('posts')
                .insert({ user_id: user.id, body, image_path, image_url });

            if (error) throw error;

            if (bodyEl) bodyEl.value = '';
            if (fileEl) fileEl.value = '';

            if (typeof window.closeModal === 'function') window.closeModal('newPostModal');

            safeShowToast('Post pubblicato!', 'success');
            await loadSocialData();
        } catch (e) {
            console.error('Create post error:', e);
            if (maybeWarnSchemaMissing(e) || maybeWarnBucketMissing(e)) {
                // already warned
            }
            safeShowToast(`Errore nella pubblicazione: ${humanizePostError(e)}`, 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'PUBBLICA';
        }
    }

    async function toggleLike(postId) {
        const user = await getUser();
        const client = getClient();
        if (!user || !client) return;

        try {
            const { data: existing } = await client
                .from('post_likes')
                .select('post_id,user_id')
                .eq('post_id', postId)
                .eq('user_id', user.id)
                .maybeSingle();

            if (existing) {
                const del = await client
                    .from('post_likes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', user.id);
                if (del.error) throw del.error;
            } else {
                const ins = await client
                    .from('post_likes')
                    .insert({ post_id: postId, user_id: user.id });
                if (ins.error) throw ins.error;
            }

            await refreshFeedOnly();
        } catch (e) {
            console.error('Like error:', e);
            safeShowToast('Errore like', 'error');
        }
    }

    function toggleComments(postId) {
        const el = document.getElementById(`comments-${postId}`);
        if (!el) return;
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }

    async function addComment(event, postId) {
        event.preventDefault();
        const user = await getUser();
        const client = getClient();
        if (!user || !client) return;

        const input = event.target.querySelector('input[name="comment"]');
        const body = input && input.value ? input.value.trim() : '';
        if (!body) return;

        try {
            const { error } = await client
                .from('post_comments')
                .insert({ post_id: postId, user_id: user.id, body });
            if (error) throw error;
            input.value = '';
            await refreshFeedOnly();
        } catch (e) {
            console.error('Comment error:', e);
            safeShowToast('Errore commento', 'error');
        }
    }

    async function refreshFeedOnly() {
        try {
            const posts = await fetchFeedPosts();
            renderFeed(posts);
        } catch (e) {
            console.warn('Feed refresh failed:', e);
        }
    }

    // ---------------- Overrides expected by app.js / index.html ----------------

    window.loadSocialData = async function loadSocialData() {
        // If schema is missing, avoid re-trying on every render.
        if (ltSocialSchemaMissing) return;

        // Invite code
        try {
            const code = await getMyInviteCodeCloudAware();
            const codeEl = document.getElementById('myInviteCode');
            if (codeEl) codeEl.textContent = code;
        } catch (_) {}

        // Friends
        let friends = getCachedFriends();
        try {
            friends = await loadFriendsFromCloud();
        } catch (e) {
            // Keep local fallback
            if (!maybeWarnSchemaMissing(e)) {
                console.warn('Friends cloud load failed:', e);
            }
        }

        const friendsCountEl = document.getElementById('friendsCount');
        if (friendsCountEl) friendsCountEl.textContent = Array.isArray(friends) ? friends.length : 0;

        // Leaderboard rank (simple: streak rank)
        const myStats = getMyLocalStatsSnapshot();
        const rankEl = document.getElementById('leaderboardRank');
        if (rankEl) rankEl.textContent = computeLeaderboardRank(myStats, Array.isArray(friends) ? friends : []);

        renderFriendsList(Array.isArray(friends) ? friends : []);

        // Cache profiles (friends)
        try {
            ltProfilesById = new Map((Array.isArray(friends) ? friends : []).map((f) => [f.id, f]));
        } catch (_) {
            ltProfilesById = new Map();
        }

        // Stories (cloud, 24h)
        try {
            wireStoryInputOnce();
            const user = await getUser();
            const meLocal = getLocalProfileSnapshot();
            if (user) {
                // Render immediately (fallback) so user always sees "La tua" + plus
                try {
                    ltStoriesByUser = new Map();
                    ltStoryUsers = new Set();
                    renderStoriesBar(
                        {
                            id: user.id,
                            name: meLocal.name || user.user_metadata?.name || user.email?.split('@')?.[0] || 'Tu',
                            photo: meLocal.photo,
                            avatar_url: null
                        },
                        Array.isArray(friends) ? friends : []
                    );
                } catch (_) {}

                const ids = [user.id, ...(Array.isArray(friends) ? friends : []).map((f) => f.id).filter(Boolean)];
                await fetchActiveStories(ids);

                // Try to use cloud avatar_url for "me" when present
                let myAvatarUrl = null;
                try {
                    const { data: meRow } = await getClient().from('profiles').select('avatar_url,name').eq('id', user.id).maybeSingle();
                    if (meRow && meRow.avatar_url) myAvatarUrl = meRow.avatar_url;
                } catch (_) {}

                renderStoriesBar(
                    {
                        id: user.id,
                        name: meLocal.name || user.user_metadata?.name || user.email?.split('@')?.[0] || 'Tu',
                        photo: meLocal.photo,
                        avatar_url: myAvatarUrl
                    },
                    Array.isArray(friends) ? friends : []
                );
            }
        } catch (e) {
            if (!maybeWarnSchemaMissing(e)) console.warn('Stories load failed:', e);
            // Keep fallback UI visible even on error
            try {
                const user = await getUser();
                const meLocal = getLocalProfileSnapshot();
                if (user) {
                    ltStoriesByUser = new Map();
                    ltStoryUsers = new Set();
                    renderStoriesBar(
                        {
                            id: user.id,
                            name: meLocal.name || user.user_metadata?.name || user.email?.split('@')?.[0] || 'Tu',
                            photo: meLocal.photo,
                            avatar_url: null
                        },
                        Array.isArray(friends) ? friends : []
                    );
                }
            } catch (_) {}
        }

        // Feed
        try {
            const posts = await fetchFeedPosts();
            renderFeed(posts);
        } catch (e) {
            if (!maybeWarnSchemaMissing(e)) {
                console.warn('Feed load failed:', e);
            }
        }
    };

    window.addStory = function addStory() {
        wireStoryInputOnce();
        const input = document.getElementById('newStoryImage');
        if (!input) {
            safeShowToast('Input storia non trovato', 'error');
            return;
        }
        input.click();
    };

    window.openUserStory = function openUserStory(userId) {
        const arr = ltStoriesByUser.get(userId) || [];
        if (arr.length === 0) return;
        const story = arr[0];
        const img = document.getElementById('storyViewerImage');
        if (img) img.src = story.image_url || '';
        if (typeof window.openModal === 'function') window.openModal('storyModal');
    };

    window.openSocialUser = async function openSocialUser(userId) {
        try {
            localStorage.setItem('lt_social_user_id', String(userId));
        } catch (_) {}

        if (typeof window.switchView === 'function') window.switchView('socialUser');
        await renderSocialUser(userId);
    };

    async function renderSocialUser(userId) {
        const user = await getUser();
        const client = getClient();
        if (!user || !client) return;

        const titleEl = document.getElementById('socialUserTitle');
        const compareEl = document.getElementById('socialCompare');
        const postsEl = document.getElementById('socialUserPosts');
        if (!compareEl || !postsEl) return;

        let targetProfile = ltProfilesById.get(userId) || null;
        if (!targetProfile) {
            try {
                const { data } = await client.from('profiles').select('id,name,avatar_url').eq('id', userId).maybeSingle();
                if (data) targetProfile = data;
            } catch (_) {}
        }

        const name = targetProfile?.name || 'Utente';
        if (titleEl) titleEl.textContent = String(name).toUpperCase();

        const myStats = getMyLocalStatsSnapshot();
        const friendStats = (getCachedFriends().find((f) => f.id === userId)?.stats) || {};

        compareEl.innerHTML = `
            <div class="social-compare-card">
                <div class="social-compare-title">TU</div>
                <div class="social-compare-metric"><span>Livello</span><span>${myStats.level || 1}</span></div>
                <div class="social-compare-metric"><span>Streak</span><span>${myStats.streak || 0}g</span></div>
            </div>
            <div class="social-compare-card">
                <div class="social-compare-title">${escapeHtml(getFirstName(name))}</div>
                <div class="social-compare-metric"><span>Livello</span><span>${friendStats.level || 1}</span></div>
                <div class="social-compare-metric"><span>Streak</span><span>${friendStats.streak || 0}g</span></div>
            </div>
        `;

        // Load posts by this user and render inside socialUserPosts
        try {
            const { data: posts, error } = await client
                .from('posts')
                .select('id,user_id,body,image_url,created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(30);
            if (error) throw error;

            if (!Array.isArray(posts) || posts.length === 0) {
                postsEl.innerHTML = `<div class="empty-state"><i class="fas fa-bolt"></i><p>Nessun post</p></div>`;
                return;
            }

            postsEl.innerHTML = posts
                .map((p) => {
                    const time = formatTimeAgo(p.created_at);
                    const image = p.image_url
                        ? `<img class="social-post-image" src="${p.image_url}" alt="Post image" loading="lazy">`
                        : '';
                    const avatar = targetProfile?.avatar_url
                        ? `<img src="${targetProfile.avatar_url}" alt="Avatar">`
                        : `<span class="social-post-avatar-fallback">${escapeHtml(String(name).charAt(0).toUpperCase())}</span>`;
                    const storyClass = ltStoryUsers.has(userId) ? 'has-story' : '';
                    const avatarClick = ltStoryUsers.has(userId) ? `onclick=\"openUserStory('${userId}')\"` : '';
                    return `
                        <div class="social-post-wrap" data-post-id="${p.id}">
                            <div class="social-post-top">
                                <div class="social-post-author-block">
                                    <div class="social-post-avatar ${storyClass}" ${avatarClick}>${avatar}</div>
                                    <div class="social-post-author">${escapeHtml(name)}</div>
                                </div>
                                <div class="social-post-time">${time}</div>
                            </div>
                            <div class="social-post">
                                ${p.body ? `<div class="social-post-body">${escapeHtml(p.body)}</div>` : ''}
                                ${image}
                            </div>
                        </div>
                    `;
                })
                .join('');
        } catch (e) {
            console.warn('User posts load failed:', e);
            postsEl.innerHTML = `<div class="empty-state"><i class="fas fa-bolt"></i><p>Impossibile caricare i post</p></div>`;
        }
    }

    async function sharePost(postId) {
        try {
            const el = document.querySelector(`.social-post-wrap[data-post-id="${postId}"]`);
            const text = el ? (el.querySelector('.social-post-body')?.textContent || '').trim() : '';
            const message = text ? `Life Tracker\n\n${text}` : 'Life Tracker';
            if (navigator.share) {
                await navigator.share({ text: message });
                return;
            }
            await navigator.clipboard.writeText(message);
            safeShowToast('Copiato negli appunti', 'success');
        } catch (e) {
            console.warn('sharePost failed:', e);
            safeShowToast('Impossibile condividere', 'error');
        }
    }

    window.addFriendByCode = async function addFriendByCode(event) {
        event.preventDefault();
        const input = document.getElementById('friendCode');
        const code = input ? input.value.trim().toUpperCase() : '';

        try {
            await syncInviteCodeToProfile();
            const res = await addFriendByInviteCode(code);
            if (!res || !res.ok) return;

            if (input) input.value = '';
            if (typeof window.closeModal === 'function') window.closeModal('inviteFriendModal');

            await window.loadSocialData();
        } catch (e) {
            console.error('Add friend error:', e);
            safeShowToast('Errore aggiunta amico', 'error');
        }
    };

    window.removeFriend = async function removeFriend(index) {
        const friends = getCachedFriends();
        const friend = friends && friends[index] ? friends[index] : null;
        if (!friend) return;

        try {
            if (friend.id) {
                await removeFriendById(friend.id);
            }

            friends.splice(index, 1);
            localStorage.setItem('lt_friends', JSON.stringify(friends));
            await window.loadSocialData();
            safeShowToast('Amico rimosso', 'warning');
        } catch (e) {
            console.error('Remove friend error:', e);
            safeShowToast('Errore rimozione amico', 'error');
        }
    };

    window.copyInviteCode = async function copyInviteCode() {
        try {
            const code = await getMyInviteCodeCloudAware();
            await navigator.clipboard.writeText(code);
            safeShowToast('Codice copiato!', 'success');
        } catch (_) {
            safeShowToast('Impossibile copiare', 'error');
        }
    };

    window.shareInvite = async function shareInvite(platform) {
        const code = await getMyInviteCodeCloudAware();
        const message = `Unisciti a me su Life Tracker! Usa il mio codice: ${code}`;
        const url = encodeURIComponent(window.location.href);

        switch (platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                break;
            case 'telegram':
                window.open(`https://t.me/share/url?url=${url}&text=${encodeURIComponent(message)}`, '_blank');
                break;
            case 'copy':
                await navigator.clipboard.writeText(message);
                safeShowToast('Link copiato!', 'success');
                break;
        }
    };

    window.createSocialPost = createPostFromModal;
    window.toggleLike = toggleLike;
    window.toggleComments = toggleComments;
    window.addComment = addComment;
    window.sharePost = sharePost;

    // Light init: keep social data in sync after login/hydration
    document.addEventListener('DOMContentLoaded', () => {
        // In case renderApp doesn't call it (it does), this is harmless.
        setTimeout(() => {
            if (typeof window.loadSocialData === 'function') {
                window.loadSocialData();
            }
        }, 600);
    });
})();
