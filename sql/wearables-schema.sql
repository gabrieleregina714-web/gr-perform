-- ═══════════════════════════════════════════════════════════════════════════
-- GR PERFORM - WEARABLES & BIOMETRICS DATABASE SCHEMA
-- Supabase/PostgreSQL
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════════════════
-- ATHLETE WEARABLES - OAuth credentials storage
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS athlete_wearables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'garmin', 'whoop', 'oura', 'fitbit', 'strava'
    credentials JSONB NOT NULL, -- Encrypted tokens (access_token, refresh_token, expires_at)
    is_active BOOLEAN DEFAULT true,
    connected_at TIMESTAMPTZ DEFAULT NOW(),
    last_sync_at TIMESTAMPTZ,
    sync_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint: one connection per provider per athlete
    UNIQUE(athlete_id, provider)
);

-- Index for quick lookups
CREATE INDEX idx_athlete_wearables_athlete ON athlete_wearables(athlete_id);
CREATE INDEX idx_athlete_wearables_provider ON athlete_wearables(provider);

-- RLS (Row Level Security)
ALTER TABLE athlete_wearables ENABLE ROW LEVEL SECURITY;

-- Athletes can only see their own wearables
CREATE POLICY "Athletes can view own wearables" ON athlete_wearables
    FOR SELECT USING (auth.uid() = athlete_id);

-- Athletes can manage their own wearables
CREATE POLICY "Athletes can manage own wearables" ON athlete_wearables
    FOR ALL USING (auth.uid() = athlete_id);

-- Service role can manage all (for backend API)
CREATE POLICY "Service role full access" ON athlete_wearables
    FOR ALL USING (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════════════════════════════
-- BIOMETRIC HISTORY - Time-series data from wearables
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS biometric_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Core metrics (normalized across providers)
    hrv_rmssd DECIMAL(10,2),           -- Heart Rate Variability (ms)
    resting_heart_rate INTEGER,         -- BPM
    avg_heart_rate INTEGER,             -- BPM (daily average)
    max_heart_rate INTEGER,             -- BPM (daily max)
    
    -- Sleep metrics
    sleep_duration_minutes INTEGER,
    sleep_score INTEGER,                -- 0-100
    sleep_efficiency DECIMAL(5,2),      -- Percentage
    sleep_deep_minutes INTEGER,
    sleep_light_minutes INTEGER,
    sleep_rem_minutes INTEGER,
    sleep_awake_minutes INTEGER,
    
    -- Recovery/Readiness
    recovery_score INTEGER,             -- 0-100 (WHOOP)
    readiness_score INTEGER,            -- 0-100 (Oura)
    strain DECIMAL(5,2),                -- WHOOP strain (0-21)
    stress_score INTEGER,               -- 0-100 (Garmin)
    body_battery INTEGER,               -- 0-100 (Garmin)
    
    -- Activity
    steps INTEGER,
    calories_total INTEGER,
    calories_active INTEGER,
    active_minutes INTEGER,
    distance_meters INTEGER,
    
    -- Full raw data for debugging
    metrics JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for time-series queries
CREATE INDEX idx_biometric_athlete_date ON biometric_history(athlete_id, recorded_at DESC);
CREATE INDEX idx_biometric_provider ON biometric_history(provider);

-- Partitioning hint (for large datasets)
-- Consider partitioning by month: CREATE TABLE ... PARTITION BY RANGE (recorded_at);

-- RLS
ALTER TABLE biometric_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can view own history" ON biometric_history
    FOR SELECT USING (auth.uid() = athlete_id);

CREATE POLICY "Service role insert" ON biometric_history
    FOR INSERT WITH CHECK (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════════════════════════════
-- READINESS SCORES - Calculated daily readiness
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS readiness_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Overall score
    score INTEGER NOT NULL,             -- 0-100
    status TEXT,                        -- 'optimal', 'good', 'moderate', 'low', 'critical'
    
    -- Component scores
    hrv_score INTEGER,
    sleep_score INTEGER,
    recovery_score INTEGER,
    stress_score INTEGER,
    
    -- Weights used
    factors JSONB,                      -- { hrv: {value, score, weight}, ... }
    
    -- Recommendation
    recommendation JSONB,               -- { message, intensity_modifier, emoji }
    
    -- Sources
    sources TEXT[],                     -- ['whoop', 'oura']
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(athlete_id, date)
);

CREATE INDEX idx_readiness_athlete_date ON readiness_scores(athlete_id, date DESC);

ALTER TABLE readiness_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can view own readiness" ON readiness_scores
    FOR SELECT USING (auth.uid() = athlete_id);


-- ═══════════════════════════════════════════════════════════════════════════
-- BODY COMPOSITION - Weight, body fat, measurements
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS body_composition (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Core metrics
    weight_kg DECIMAL(5,2),
    body_fat_percentage DECIMAL(5,2),
    muscle_mass_kg DECIMAL(5,2),
    bone_mass_kg DECIMAL(5,2),
    water_percentage DECIMAL(5,2),
    
    -- Measurements (cm)
    chest_cm DECIMAL(5,1),
    waist_cm DECIMAL(5,1),
    hips_cm DECIMAL(5,1),
    arm_left_cm DECIMAL(5,1),
    arm_right_cm DECIMAL(5,1),
    thigh_left_cm DECIMAL(5,1),
    thigh_right_cm DECIMAL(5,1),
    calf_left_cm DECIMAL(5,1),
    calf_right_cm DECIMAL(5,1),
    
    -- Source
    source TEXT DEFAULT 'manual',       -- 'manual', 'smart_scale', 'dexa', 'bod_pod'
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_body_comp_athlete_date ON body_composition(athlete_id, recorded_at DESC);

ALTER TABLE body_composition ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can manage own body comp" ON body_composition
    FOR ALL USING (auth.uid() = athlete_id);


-- ═══════════════════════════════════════════════════════════════════════════
-- STRENGTH RECORDS - 1RM and PR tracking
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS strength_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    
    -- The record
    weight_kg DECIMAL(6,2),
    reps INTEGER,
    estimated_1rm DECIMAL(6,2),         -- Calculated from weight/reps
    
    -- Context
    rpe DECIMAL(3,1),
    is_competition BOOLEAN DEFAULT false,
    workout_id UUID,
    
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_strength_athlete_exercise ON strength_records(athlete_id, exercise_name);
CREATE INDEX idx_strength_athlete_date ON strength_records(athlete_id, recorded_at DESC);

ALTER TABLE strength_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can manage own records" ON strength_records
    FOR ALL USING (auth.uid() = athlete_id);


-- ═══════════════════════════════════════════════════════════════════════════
-- VIEWS FOR ANALYTICS
-- ═══════════════════════════════════════════════════════════════════════════

-- Latest biometrics per athlete
CREATE OR REPLACE VIEW latest_biometrics AS
SELECT DISTINCT ON (athlete_id) 
    athlete_id,
    provider,
    recorded_at,
    hrv_rmssd,
    resting_heart_rate,
    sleep_duration_minutes,
    sleep_score,
    recovery_score,
    readiness_score,
    strain,
    stress_score,
    body_battery,
    steps
FROM biometric_history
ORDER BY athlete_id, recorded_at DESC;

-- Weekly HRV trend
CREATE OR REPLACE VIEW hrv_weekly_trend AS
SELECT 
    athlete_id,
    date_trunc('week', recorded_at) as week,
    AVG(hrv_rmssd) as avg_hrv,
    MIN(hrv_rmssd) as min_hrv,
    MAX(hrv_rmssd) as max_hrv,
    STDDEV(hrv_rmssd) as stddev_hrv
FROM biometric_history
WHERE hrv_rmssd IS NOT NULL
GROUP BY athlete_id, date_trunc('week', recorded_at)
ORDER BY athlete_id, week DESC;

-- Sleep quality trend
CREATE OR REPLACE VIEW sleep_weekly_trend AS
SELECT 
    athlete_id,
    date_trunc('week', recorded_at) as week,
    AVG(sleep_duration_minutes) as avg_duration,
    AVG(sleep_score) as avg_score,
    AVG(sleep_efficiency) as avg_efficiency
FROM biometric_history
WHERE sleep_duration_minutes IS NOT NULL
GROUP BY athlete_id, date_trunc('week', recorded_at)
ORDER BY athlete_id, week DESC;


-- ═══════════════════════════════════════════════════════════════════════════
-- FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- Calculate estimated 1RM from weight and reps (Epley formula)
CREATE OR REPLACE FUNCTION calculate_e1rm(weight DECIMAL, reps INTEGER)
RETURNS DECIMAL AS $$
BEGIN
    IF reps = 1 THEN
        RETURN weight;
    ELSIF reps > 10 THEN
        RETURN weight * (1 + reps / 30.0);
    ELSE
        RETURN weight * (1 + reps / 30.0);
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Get athlete's PR for an exercise
CREATE OR REPLACE FUNCTION get_exercise_pr(p_athlete_id UUID, p_exercise TEXT)
RETURNS TABLE(weight_kg DECIMAL, reps INTEGER, estimated_1rm DECIMAL, recorded_at TIMESTAMPTZ) AS $$
BEGIN
    RETURN QUERY
    SELECT sr.weight_kg, sr.reps, sr.estimated_1rm, sr.recorded_at
    FROM strength_records sr
    WHERE sr.athlete_id = p_athlete_id 
      AND sr.exercise_name ILIKE p_exercise
    ORDER BY sr.estimated_1rm DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;


-- ═══════════════════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════

-- Auto-calculate e1RM on strength record insert
CREATE OR REPLACE FUNCTION auto_calculate_e1rm()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estimated_1rm IS NULL AND NEW.weight_kg IS NOT NULL AND NEW.reps IS NOT NULL THEN
        NEW.estimated_1rm := calculate_e1rm(NEW.weight_kg, NEW.reps);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_auto_e1rm
    BEFORE INSERT OR UPDATE ON strength_records
    FOR EACH ROW EXECUTE FUNCTION auto_calculate_e1rm();

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_wearables_updated
    BEFORE UPDATE ON athlete_wearables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ═══════════════════════════════════════════════════════════════════════════
-- SAMPLE DATA (for testing)
-- ═══════════════════════════════════════════════════════════════════════════

-- Uncomment to insert sample data
/*
INSERT INTO biometric_history (athlete_id, provider, hrv_rmssd, resting_heart_rate, sleep_duration_minutes, sleep_score, recovery_score)
SELECT 
    'your-athlete-uuid'::uuid,
    'whoop',
    45 + (random() * 20)::int,
    55 + (random() * 10)::int,
    420 + (random() * 120)::int,
    70 + (random() * 25)::int,
    60 + (random() * 35)::int
FROM generate_series(1, 30) as i;
*/

-- Grant permissions to authenticated users
GRANT SELECT ON latest_biometrics TO authenticated;
GRANT SELECT ON hrv_weekly_trend TO authenticated;
GRANT SELECT ON sleep_weekly_trend TO authenticated;
