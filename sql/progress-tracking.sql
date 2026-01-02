-- =====================================================
-- GR PERFORM - PROGRESS TRACKING SYSTEM
-- Tabelle per PR, Obiettivi Coach, Storico Peso
-- Eseguire in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- TABELLA: personal_records (PR automatici)
-- Calcolati automaticamente dai workout completati
-- =====================================================
CREATE TABLE IF NOT EXISTS personal_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    
    -- Esercizio
    exercise_name VARCHAR(200) NOT NULL,
    exercise_category VARCHAR(50), -- 'strength', 'cardio', 'power', 'endurance'
    
    -- Record
    weight_kg DECIMAL(6,2),           -- Peso sollevato
    reps INTEGER,                      -- Ripetizioni
    estimated_1rm DECIMAL(6,2),        -- 1RM stimato (Epley formula)
    
    -- Per esercizi cardio/tempo
    time_seconds INTEGER,              -- Tempo (es: plank, sprint)
    distance_meters INTEGER,           -- Distanza (es: corsa)
    
    -- Metadata
    achieved_at DATE NOT NULL,
    workout_id UUID REFERENCES workouts(id),
    
    -- PR Type
    pr_type VARCHAR(20) DEFAULT 'weight', -- 'weight', 'reps', 'time', 'distance'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Un solo record per esercizio per atleta (si aggiorna)
    UNIQUE(athlete_id, exercise_name, pr_type)
);

-- Indici per query veloci
CREATE INDEX IF NOT EXISTS idx_pr_athlete ON personal_records(athlete_id);
CREATE INDEX IF NOT EXISTS idx_pr_exercise ON personal_records(exercise_name);

-- =====================================================
-- TABELLA: coach_goals (Obiettivi impostati dal coach)
-- Il coach imposta target, il sistema traccia progresso
-- =====================================================
CREATE TABLE IF NOT EXISTS coach_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    
    -- Obiettivo
    goal_type VARCHAR(50) NOT NULL,    -- 'workouts_month', 'weight_target', 'pr_target', 'streak', 'custom'
    goal_title VARCHAR(200) NOT NULL,   -- "Completa 20 workout a Gennaio"
    goal_description TEXT,
    
    -- Target e progresso
    target_value DECIMAL(10,2) NOT NULL,  -- Es: 20 (workout), 75 (kg peso), 100 (kg squat)
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(20),                      -- 'workout', 'kg', 'giorni', '%'
    
    -- Periodo
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active',  -- 'active', 'completed', 'failed', 'cancelled'
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Priorità e visibilità
    priority INTEGER DEFAULT 1,           -- 1 = alta, 2 = media, 3 = bassa
    show_to_athlete BOOLEAN DEFAULT true,
    
    -- Chi l'ha creato
    created_by VARCHAR(20) DEFAULT 'coach', -- 'coach', 'system', 'athlete'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goals_athlete ON coach_goals(athlete_id);
CREATE INDEX IF NOT EXISTS idx_goals_active ON coach_goals(status) WHERE status = 'active';

-- =====================================================
-- TABELLA: weight_history (Storico peso atleta)
-- L'atleta inserisce, coach e AI monitorano trend
-- =====================================================
CREATE TABLE IF NOT EXISTS weight_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    
    weight_kg DECIMAL(5,2) NOT NULL,
    recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Opzionale: altri dati
    body_fat_percentage DECIMAL(4,1),
    muscle_mass_kg DECIMAL(5,2),
    notes TEXT,
    
    -- Source
    source VARCHAR(20) DEFAULT 'manual', -- 'manual', 'smart_scale', 'coach'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Un peso per giorno per atleta
    UNIQUE(athlete_id, recorded_at)
);

CREATE INDEX IF NOT EXISTS idx_weight_athlete ON weight_history(athlete_id);
CREATE INDEX IF NOT EXISTS idx_weight_date ON weight_history(recorded_at DESC);

-- =====================================================
-- TABELLA: pr_history (Storico PR per vedere progressione)
-- Tiene traccia di TUTTI i PR, non solo l'ultimo
-- =====================================================
CREATE TABLE IF NOT EXISTS pr_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    
    exercise_name VARCHAR(200) NOT NULL,
    weight_kg DECIMAL(6,2),
    reps INTEGER,
    estimated_1rm DECIMAL(6,2),
    
    achieved_at DATE NOT NULL,
    workout_id UUID REFERENCES workouts(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pr_history_athlete ON pr_history(athlete_id);
CREATE INDEX IF NOT EXISTS idx_pr_history_exercise ON pr_history(athlete_id, exercise_name);

-- =====================================================
-- FUNCTION: Calcola 1RM stimato (Formula Epley)
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_estimated_1rm(weight DECIMAL, reps INTEGER)
RETURNS DECIMAL AS $$
BEGIN
    IF reps = 1 THEN
        RETURN weight;
    ELSIF reps > 0 AND reps <= 12 THEN
        RETURN ROUND(weight * (1 + reps / 30.0), 1);
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Aggiorna PR automaticamente
-- Da chiamare quando un workout viene completato
-- =====================================================
CREATE OR REPLACE FUNCTION update_personal_records(
    p_athlete_id UUID,
    p_exercise_name VARCHAR,
    p_weight DECIMAL,
    p_reps INTEGER,
    p_workout_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_estimated_1rm DECIMAL;
    v_current_1rm DECIMAL;
BEGIN
    -- Calcola 1RM stimato
    v_estimated_1rm := calculate_estimated_1rm(p_weight, p_reps);
    
    -- Ottieni PR attuale
    SELECT estimated_1rm INTO v_current_1rm
    FROM personal_records
    WHERE athlete_id = p_athlete_id 
      AND exercise_name = p_exercise_name
      AND pr_type = 'weight';
    
    -- Se nuovo record è migliore (o non esiste), aggiorna
    IF v_current_1rm IS NULL OR v_estimated_1rm > v_current_1rm THEN
        
        -- Salva nella history
        INSERT INTO pr_history (athlete_id, exercise_name, weight_kg, reps, estimated_1rm, achieved_at, workout_id)
        VALUES (p_athlete_id, p_exercise_name, p_weight, p_reps, v_estimated_1rm, CURRENT_DATE, p_workout_id);
        
        -- Aggiorna/inserisci PR attuale
        INSERT INTO personal_records (athlete_id, exercise_name, weight_kg, reps, estimated_1rm, achieved_at, workout_id, pr_type)
        VALUES (p_athlete_id, p_exercise_name, p_weight, p_reps, v_estimated_1rm, CURRENT_DATE, p_workout_id, 'weight')
        ON CONFLICT (athlete_id, exercise_name, pr_type)
        DO UPDATE SET
            weight_kg = p_weight,
            reps = p_reps,
            estimated_1rm = v_estimated_1rm,
            achieved_at = CURRENT_DATE,
            workout_id = p_workout_id;
        
        RETURN TRUE;  -- Nuovo PR!
    END IF;
    
    RETURN FALSE;  -- No nuovo PR
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Aggiorna progresso obiettivi automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_goal_progress(p_athlete_id UUID)
RETURNS VOID AS $$
DECLARE
    goal RECORD;
    v_current_value DECIMAL;
BEGIN
    FOR goal IN 
        SELECT * FROM coach_goals 
        WHERE athlete_id = p_athlete_id 
        AND status = 'active'
        AND end_date >= CURRENT_DATE
    LOOP
        -- Calcola progresso in base al tipo
        CASE goal.goal_type
            WHEN 'workouts_month' THEN
                SELECT COUNT(*) INTO v_current_value
                FROM workouts
                WHERE athlete_id = p_athlete_id
                AND status = 'completed'
                AND completed_at >= goal.start_date
                AND completed_at <= goal.end_date;
                
            WHEN 'streak' THEN
                SELECT streak INTO v_current_value
                FROM athletes
                WHERE id = p_athlete_id;
                
            WHEN 'weight_target' THEN
                SELECT weight_kg INTO v_current_value
                FROM weight_history
                WHERE athlete_id = p_athlete_id
                ORDER BY recorded_at DESC
                LIMIT 1;
                
            ELSE
                -- Custom goals: non aggiorniamo automaticamente
                CONTINUE;
        END CASE;
        
        -- Aggiorna valore corrente
        UPDATE coach_goals
        SET current_value = COALESCE(v_current_value, 0),
            updated_at = NOW(),
            status = CASE 
                WHEN COALESCE(v_current_value, 0) >= target_value THEN 'completed'
                WHEN end_date < CURRENT_DATE THEN 'failed'
                ELSE 'active'
            END,
            completed_at = CASE 
                WHEN COALESCE(v_current_value, 0) >= target_value AND completed_at IS NULL THEN NOW()
                ELSE completed_at
            END
        WHERE id = goal.id;
        
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEW: Riepilogo progressi atleta per AI
-- =====================================================
CREATE OR REPLACE VIEW athlete_progress_summary AS
SELECT 
    a.id as athlete_id,
    a.first_name,
    a.last_name,
    a.sport,
    
    -- Peso attuale e trend
    (SELECT weight_kg FROM weight_history WHERE athlete_id = a.id ORDER BY recorded_at DESC LIMIT 1) as current_weight,
    (SELECT weight_kg FROM weight_history WHERE athlete_id = a.id ORDER BY recorded_at DESC OFFSET 4 LIMIT 1) as weight_4_weeks_ago,
    
    -- Workout stats
    (SELECT COUNT(*) FROM workouts WHERE athlete_id = a.id AND status = 'completed') as total_workouts,
    (SELECT COUNT(*) FROM workouts WHERE athlete_id = a.id AND status = 'completed' 
     AND completed_at >= CURRENT_DATE - INTERVAL '30 days') as workouts_last_30_days,
    
    -- Obiettivi attivi
    (SELECT COUNT(*) FROM coach_goals WHERE athlete_id = a.id AND status = 'active') as active_goals,
    
    -- PR count
    (SELECT COUNT(*) FROM personal_records WHERE athlete_id = a.id) as total_prs

FROM athletes a;

-- =====================================================
-- GRANT PERMISSIONS (per Supabase)
-- =====================================================
-- Se usi RLS, aggiungi le policy appropriate

ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE pr_history ENABLE ROW LEVEL SECURITY;

-- Policy: Gli atleti possono vedere i propri dati
CREATE POLICY "Athletes can view own PRs" ON personal_records
    FOR SELECT USING (true);

CREATE POLICY "Athletes can view own goals" ON coach_goals
    FOR SELECT USING (show_to_athlete = true);

CREATE POLICY "Athletes can manage own weight" ON weight_history
    FOR ALL USING (true);

CREATE POLICY "Athletes can view own PR history" ON pr_history
    FOR SELECT USING (true);

-- =====================================================
-- DATI DI ESEMPIO (opzionale, per test)
-- =====================================================
/*
-- Esempio: Aggiungi un obiettivo per un atleta
INSERT INTO coach_goals (athlete_id, goal_type, goal_title, target_value, unit, start_date, end_date)
VALUES (
    'UUID_ATLETA', 
    'workouts_month', 
    'Completa 16 workout a Gennaio',
    16,
    'workout',
    '2025-01-01',
    '2025-01-31'
);

-- Esempio: Registra peso
INSERT INTO weight_history (athlete_id, weight_kg)
VALUES ('UUID_ATLETA', 77.5);
*/
