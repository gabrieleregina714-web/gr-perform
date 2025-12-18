-- ================================================
-- LIFE TRACKER - DATABASE SCHEMA
-- Esegui questo SQL nella console di Supabase:
-- Dashboard → SQL Editor → New Query → Incolla e Run
-- ================================================

-- Tabella profili utente
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella dati utente (tutti i dati dell'app in JSON)
CREATE TABLE IF NOT EXISTS user_data (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goals TEXT DEFAULT '[]',
    history TEXT DEFAULT '[]',
    metrics TEXT DEFAULT '[]',
    metric_values TEXT DEFAULT '[]',
    documents TEXT DEFAULT '[]',
    workout_exercises TEXT DEFAULT '[]',
    runs TEXT DEFAULT '[]',
    workout_sessions TEXT DEFAULT '[]',
    profile TEXT DEFAULT '{}',
    elite_user TEXT DEFAULT '{}',
    elite_badges TEXT DEFAULT '[]',
    elite_streaks TEXT DEFAULT '{}',
    elite_moods TEXT DEFAULT '[]',
    elite_water TEXT DEFAULT '[]',
    elite_sleep TEXT DEFAULT '[]',
    elite_journal TEXT DEFAULT '[]',
    measurements TEXT DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Abilita RLS (Row Level Security) per sicurezza
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Policy: ogni utente vede solo i propri dati
CREATE POLICY "Users can view own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own data" 
    ON user_data FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" 
    ON user_data FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" 
    ON user_data FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" 
    ON user_data FOR DELETE 
    USING (auth.uid() = user_id);
