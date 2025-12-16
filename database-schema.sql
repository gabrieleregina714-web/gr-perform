-- =====================================================
-- GR PERFORM - DATABASE SCHEMA
-- Esegui questo SQL nel SQL Editor di Supabase
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELLA: athletes (Clienti/Atleti)
-- =====================================================
CREATE TABLE athletes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Gestito da Supabase Auth
    
    -- Dati Personali
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    gender VARCHAR(20), -- 'male', 'female', 'other'
    phone VARCHAR(20),
    
    -- Dati Fisici
    height_cm INTEGER,
    weight_kg DECIMAL(5,2),
    body_fat_percentage DECIMAL(4,1),
    
    -- Sport & Pacchetto
    sport VARCHAR(50) NOT NULL, -- 'calcio', 'basket', 'boxe', 'palestra', 'altro'
    package_type VARCHAR(50) NOT NULL, -- 'tecnica', 'performance', 'completo'
    
    -- Livello & Esperienza
    experience_level VARCHAR(30), -- 'principiante', 'intermedio', 'avanzato', 'elite'
    years_of_training INTEGER,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'cancelled'
    subscription_start DATE,
    subscription_end DATE,
    
    -- Gamification
    current_level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELLA: sport_specific_data (Dati Specifici Sport)
-- =====================================================
CREATE TABLE sport_specific_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    
    -- CALCIO
    football_role VARCHAR(50), -- 'portiere', 'difensore_centrale', 'terzino', 'centrocampista_difensivo', 'centrocampista_centrale', 'ala', 'attaccante'
    football_preferred_foot VARCHAR(20), -- 'destro', 'sinistro', 'ambidestro'
    football_team_name VARCHAR(100),
    football_team_level VARCHAR(50), -- 'amatoriale', 'dilettanti', 'giovanili_pro', 'professionista'
    football_weekly_team_sessions INTEGER, -- Quanti allenamenti con la squadra
    football_match_day VARCHAR(20), -- 'sabato', 'domenica', 'altro'
    
    -- BASKET
    basket_role VARCHAR(50), -- 'playmaker', 'guardia', 'ala_piccola', 'ala_grande', 'centro'
    basket_team_name VARCHAR(100),
    basket_team_level VARCHAR(50),
    basket_weekly_team_sessions INTEGER,
    basket_match_day VARCHAR(20),
    
    -- BOXE
    boxing_weight_class VARCHAR(50), -- 'pesi_mosca', 'pesi_leggeri', 'pesi_medi', 'pesi_massimi', ecc.
    boxing_stance VARCHAR(20), -- 'ortodosso', 'southpaw'
    boxing_style VARCHAR(50), -- 'pressore', 'contrattaccante', 'outfighter', 'brawler'
    boxing_gym_name VARCHAR(100),
    boxing_weekly_gym_sessions INTEGER,
    boxing_upcoming_fight_date DATE,
    
    -- PALESTRA (General Fitness)
    gym_primary_goal VARCHAR(50), -- 'ipertrofia', 'forza', 'dimagrimento', 'ricomposizione', 'powerbuilding', 'powerlifting'
    gym_secondary_goal VARCHAR(50),
    gym_available_days INTEGER, -- Giorni disponibili per allenarsi
    gym_session_duration INTEGER, -- Minuti per sessione
    gym_equipment_access VARCHAR(50), -- 'palestra_completa', 'home_gym_base', 'home_gym_completa', 'solo_corpo_libero'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELLA: role_specific_goals (Obiettivi per Ruolo)
-- =====================================================
CREATE TABLE role_specific_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sport VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    goal_name VARCHAR(100) NOT NULL,
    goal_description TEXT,
    goal_category VARCHAR(50), -- 'tecnica', 'fisica', 'tattica', 'mentale'
    is_primary BOOLEAN DEFAULT false,
    
    UNIQUE(sport, role, goal_name)
);

-- Inserisco obiettivi predefiniti per CALCIO
INSERT INTO role_specific_goals (sport, role, goal_name, goal_description, goal_category, is_primary) VALUES
-- Portiere
('calcio', 'portiere', 'Reattività e esplosività', 'Migliorare i tempi di reazione e la capacità di tuffarsi', 'fisica', true),
('calcio', 'portiere', 'Presa e bloccaggio', 'Tecnica di presa alta, bassa e in tuffo', 'tecnica', true),
('calcio', 'portiere', 'Gioco con i piedi', 'Costruzione dal basso e rinvii precisi', 'tecnica', false),
('calcio', 'portiere', 'Uscite alte e basse', 'Timing e coraggio nelle uscite', 'tattica', false),

-- Difensore Centrale
('calcio', 'difensore_centrale', 'Forza nei contrasti', 'Capacità di vincere duelli fisici', 'fisica', true),
('calcio', 'difensore_centrale', 'Gioco aereo', 'Dominio nei duelli aerei', 'tecnica', true),
('calcio', 'difensore_centrale', 'Lettura del gioco', 'Anticipare le giocate avversarie', 'tattica', true),
('calcio', 'difensore_centrale', 'Impostazione', 'Passaggi precisi dalla difesa', 'tecnica', false),

-- Terzino
('calcio', 'terzino', 'Resistenza aerobica', 'Coprire tutta la fascia per 90 minuti', 'fisica', true),
('calcio', 'terzino', 'Velocità e accelerazione', 'Sprint ripetuti in fase offensiva e difensiva', 'fisica', true),
('calcio', 'terzino', 'Cross e assist', 'Precisione nei cross dalla fascia', 'tecnica', true),
('calcio', 'terzino', 'Uno contro uno difensivo', 'Fermare gli esterni avversari', 'tecnica', false),

-- Centrocampista Difensivo
('calcio', 'centrocampista_difensivo', 'Copertura e intercetto', 'Leggere il gioco e recuperare palloni', 'tattica', true),
('calcio', 'centrocampista_difensivo', 'Resistenza', 'Mantenere intensità per tutta la partita', 'fisica', true),
('calcio', 'centrocampista_difensivo', 'Distribuzione', 'Smistare il pallone con precisione', 'tecnica', false),
('calcio', 'centrocampista_difensivo', 'Duelli fisici', 'Vincere i contrasti a centrocampo', 'fisica', false),

-- Centrocampista Centrale (Box-to-Box)
('calcio', 'centrocampista_centrale', 'Resistenza box-to-box', 'Coprire tutto il campo in entrambe le fasi', 'fisica', true),
('calcio', 'centrocampista_centrale', 'Inserimenti', 'Arrivare in area al momento giusto', 'tattica', true),
('calcio', 'centrocampista_centrale', 'Tiro da fuori', 'Conclusioni dalla distanza', 'tecnica', false),
('calcio', 'centrocampista_centrale', 'Cambio di ritmo', 'Accelerare il gioco quando serve', 'tattica', false),

-- Ala/Esterno Offensivo
('calcio', 'ala', 'Velocità e dribbling', 'Saltare l uomo e creare superiorità', 'tecnica', true),
('calcio', 'ala', 'Sprint ripetuti', 'Mantenere velocità per tutta la partita', 'fisica', true),
('calcio', 'ala', 'Cross e ultimo passaggio', 'Creare occasioni per i compagni', 'tecnica', true),
('calcio', 'ala', 'Rientro e tiro', 'Accentrarsi e concludere', 'tecnica', false),

-- Attaccante
('calcio', 'attaccante', 'Finalizzazione', 'Segnare in ogni situazione', 'tecnica', true),
('calcio', 'attaccante', 'Movimento senza palla', 'Creare spazi e smarcamenti', 'tattica', true),
('calcio', 'attaccante', 'Gioco spalle alla porta', 'Proteggere palla e far salire la squadra', 'tecnica', false),
('calcio', 'attaccante', 'Potenza e esplosività', 'Sprint e stacco per vincere duelli', 'fisica', true);

-- Inserisco obiettivi per BASKET
INSERT INTO role_specific_goals (sport, role, goal_name, goal_description, goal_category, is_primary) VALUES
-- Playmaker
('basket', 'playmaker', 'Ball handling', 'Controllo palla sotto pressione', 'tecnica', true),
('basket', 'playmaker', 'Visione di gioco', 'Leggere le difese e trovare i compagni', 'tattica', true),
('basket', 'playmaker', 'Tiro da 3 punti', 'Minaccia costante dall arco', 'tecnica', false),
('basket', 'playmaker', 'Agilità e rapidità', 'Cambi di direzione veloci', 'fisica', true),

-- Guardia
('basket', 'guardia', 'Tiro in sospensione', 'Concludere da ogni posizione', 'tecnica', true),
('basket', 'guardia', 'Catch and shoot', 'Tiro rapido in ricezione', 'tecnica', true),
('basket', 'guardia', 'Difesa sul perimetro', 'Contenere le guardie avversarie', 'tattica', false),

-- Ala Piccola
('basket', 'ala_piccola', 'Versatilità offensiva', 'Segnare dentro e fuori', 'tecnica', true),
('basket', 'ala_piccola', 'Atletismo', 'Dominare in transizione', 'fisica', true),
('basket', 'ala_piccola', 'Difesa su più ruoli', 'Marcare dal playmaker al centro', 'tattica', false),

-- Ala Grande
('basket', 'ala_grande', 'Post moves', 'Gioco spalle a canestro', 'tecnica', true),
('basket', 'ala_grande', 'Rimbalzo', 'Dominare a rimbalzo', 'fisica', true),
('basket', 'ala_grande', 'Tiro dalla media', 'Aprire il campo', 'tecnica', false),

-- Centro
('basket', 'centro', 'Protezione del ferro', 'Stoppate e deterrenza', 'tattica', true),
('basket', 'centro', 'Rimbalzo offensivo', 'Seconde opportunità', 'fisica', true),
('basket', 'centro', 'Pick and roll', 'Blocchi e taglio verso canestro', 'tecnica', true);

-- Inserisco obiettivi per BOXE
INSERT INTO role_specific_goals (sport, role, goal_name, goal_description, goal_category, is_primary) VALUES
-- Stili di boxe
('boxe', 'outfighter', 'Footwork e distanza', 'Controllare la distanza e muoversi', 'tecnica', true),
('boxe', 'outfighter', 'Jab preciso', 'Jab come arma principale', 'tecnica', true),
('boxe', 'outfighter', 'Resistenza aerobica', 'Mantenere ritmo per tutti i round', 'fisica', true),

('boxe', 'pressore', 'Potenza nei colpi', 'Colpi devastanti', 'fisica', true),
('boxe', 'pressore', 'Resistenza agli impatti', 'Assorbire colpi e avanzare', 'fisica', true),
('boxe', 'pressore', 'Lavoro al corpo', 'Logorare l avversario', 'tecnica', true),

('boxe', 'contrattaccante', 'Timing e riflessi', 'Colpire nelle aperture', 'tecnica', true),
('boxe', 'contrattaccante', 'Difesa e schivate', 'Evitare i colpi', 'tecnica', true),
('boxe', 'contrattaccante', 'Esplosività', 'Contrattacchi rapidi e potenti', 'fisica', true);

-- =====================================================
-- TABELLA: athlete_goals (Obiettivi scelti dall'atleta)
-- =====================================================
CREATE TABLE athlete_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES role_specific_goals(id),
    priority INTEGER, -- 1 = principale, 2 = secondario, ecc.
    current_level INTEGER DEFAULT 1, -- 1-10 autovalutazione
    target_level INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELLA: weekly_schedule (Programma settimanale)
-- =====================================================
CREATE TABLE weekly_schedule (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    
    -- Per ogni giorno: 'rest', 'team_training', 'match', 'gr_perform', 'both'
    monday VARCHAR(30) DEFAULT 'rest',
    monday_notes TEXT,
    
    tuesday VARCHAR(30) DEFAULT 'rest',
    tuesday_notes TEXT,
    
    wednesday VARCHAR(30) DEFAULT 'rest',
    wednesday_notes TEXT,
    
    thursday VARCHAR(30) DEFAULT 'rest',
    thursday_notes TEXT,
    
    friday VARCHAR(30) DEFAULT 'rest',
    friday_notes TEXT,
    
    saturday VARCHAR(30) DEFAULT 'rest',
    saturday_notes TEXT,
    
    sunday VARCHAR(30) DEFAULT 'rest',
    sunday_notes TEXT,
    
    -- Info aggiuntive
    team_training_intensity VARCHAR(20), -- 'bassa', 'media', 'alta'
    preferred_gr_session_time VARCHAR(20), -- 'mattina', 'pomeriggio', 'sera'
    max_gr_sessions_per_week INTEGER DEFAULT 3,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELLA: injuries_conditions (Infortuni e condizioni)
-- =====================================================
CREATE TABLE injuries_conditions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    
    injury_type VARCHAR(100), -- 'distorsione_caviglia', 'tendinite', 'ernia_discale', ecc.
    body_part VARCHAR(50), -- 'ginocchio_sx', 'spalla_dx', 'schiena_lombare', ecc.
    severity VARCHAR(20), -- 'lieve', 'moderata', 'grave', 'cronica'
    status VARCHAR(20), -- 'attivo', 'in_recupero', 'risolto'
    start_date DATE,
    end_date DATE,
    notes TEXT,
    
    -- Esercizi da evitare
    exercises_to_avoid TEXT[], -- Array di esercizi controindicati
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELLA: programs (Programmi/Mesocicli)
-- =====================================================
CREATE TABLE programs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    
    name VARCHAR(200) NOT NULL,
    description TEXT,
    program_type VARCHAR(50), -- 'tecnica', 'performance', 'completo'
    
    total_weeks INTEGER NOT NULL,
    current_week INTEGER DEFAULT 1,
    
    -- Periodizzazione
    periodization_type VARCHAR(50), -- 'lineare', 'ondulata', 'a_blocchi'
    phase VARCHAR(50), -- 'accumulo', 'intensificazione', 'realizzazione', 'deload'
    
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused'
    
    start_date DATE,
    end_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELLA: workouts (Singole sessioni/schede)
-- =====================================================
CREATE TABLE workouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    
    week_number INTEGER NOT NULL,
    day_of_week VARCHAR(20), -- 'monday', 'tuesday', ecc.
    workout_date DATE,
    
    name VARCHAR(200) NOT NULL, -- "SPINTA - Push Day" o "Tecnica: Dribbling e Finte"
    workout_type VARCHAR(50), -- 'performance', 'tecnica', 'misto'
    
    -- Contenuto (JSON strutturato)
    exercises JSONB NOT NULL,
    /*
    Struttura exercises:
    [
        {
            "order": 1,
            "name": "Panca Piana Bilanciere",
            "sets": [
                {"type": "warmup", "reps": 8, "rest_seconds": 90},
                {"type": "warmup", "reps": 5, "rest_seconds": 90},
                {"type": "working", "reps": 5, "rest_seconds": 180, "rir": 0},
                {"type": "working", "reps": 8, "rest_seconds": 180, "rir": 1}
            ],
            "tempo": "3211",
            "technique_notes": ["Impugnatura ampiezza spalle", "Gomiti a 45 gradi"],
            "why_this_exercise": "Pattern di spinta fondamentale...",
            "alternatives": ["Push-up zavorrati", "Panca manubri"],
            "video_url": "https://..."
        }
    ]
    */
    
    -- Metadati AI
    ai_generated BOOLEAN DEFAULT false,
    ai_model_used VARCHAR(50),
    ai_generation_prompt TEXT,
    reviewed_by_coach BOOLEAN DEFAULT false,
    coach_notes TEXT,
    
    -- Durata stimata
    estimated_duration_minutes INTEGER,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'skipped'
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELLA: workout_logs (Log completamento esercizi)
-- =====================================================
CREATE TABLE workout_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    
    exercise_name VARCHAR(200),
    exercise_order INTEGER,
    
    -- Per ogni serie completata
    sets_completed JSONB,
    /*
    [
        {"set_number": 1, "reps_done": 8, "weight_kg": 40, "rir_actual": 3, "notes": ""},
        {"set_number": 2, "reps_done": 5, "weight_kg": 50, "rir_actual": 2, "notes": ""},
        ...
    ]
    */
    
    -- Feedback atleta
    difficulty_rating INTEGER, -- 1-10
    notes TEXT,
    
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELLA: messages (Chat coach-atleta)
-- =====================================================
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    
    sender_type VARCHAR(20) NOT NULL, -- 'athlete', 'coach'
    content TEXT NOT NULL,
    
    -- Allegati opzionali
    attachments JSONB, -- [{type: 'image', url: '...'}, {type: 'video', url: '...'}]
    
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELLA: progress_metrics (Metriche progressi)
-- =====================================================
CREATE TABLE progress_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    
    metric_type VARCHAR(50), -- 'weight', 'body_fat', 'exercise_pr', 'skill_level'
    metric_name VARCHAR(100), -- 'Peso corporeo', 'Panca 1RM', 'Velocità sprint 20m'
    value DECIMAL(10,2),
    unit VARCHAR(20), -- 'kg', '%', 'seconds', 'reps'
    
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELLA: achievements (Badge/Traguardi)
-- =====================================================
CREATE TABLE achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- Nome icona FontAwesome
    xp_reward INTEGER DEFAULT 100,
    condition_type VARCHAR(50), -- 'workouts_completed', 'streak_days', 'pr_achieved'
    condition_value INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserisco achievement predefiniti
INSERT INTO achievements (name, description, icon, xp_reward, condition_type, condition_value) VALUES
('Prima Settimana', 'Hai completato la tua prima settimana di allenamento', 'fa-calendar-check', 100, 'workouts_completed', 3),
('Costanza', '7 giorni consecutivi di allenamento', 'fa-fire', 200, 'streak_days', 7),
('Mese Completo', '30 giorni di abbonamento attivo', 'fa-medal', 300, 'days_active', 30),
('PR Hunter', 'Hai battuto un tuo record personale', 'fa-trophy', 150, 'pr_achieved', 1),
('Comunicatore', 'Hai inviato 10 messaggi al coach', 'fa-comments', 50, 'messages_sent', 10),
('Dedicato', 'Hai completato 50 allenamenti', 'fa-dumbbell', 500, 'workouts_completed', 50),
('Elite', 'Hai raggiunto il livello 50', 'fa-crown', 1000, 'level_reached', 50);

-- =====================================================
-- TABELLA: athlete_achievements (Achievement sbloccati)
-- =====================================================
CREATE TABLE athlete_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(athlete_id, achievement_id)
);

-- =====================================================
-- INDICI per performance
-- =====================================================
CREATE INDEX idx_athletes_email ON athletes(email);
CREATE INDEX idx_athletes_sport ON athletes(sport);
CREATE INDEX idx_workouts_athlete ON workouts(athlete_id);
CREATE INDEX idx_workouts_date ON workouts(workout_date);
CREATE INDEX idx_messages_athlete ON messages(athlete_id);
CREATE INDEX idx_messages_unread ON messages(athlete_id, is_read) WHERE is_read = false;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sport_specific_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Gli atleti vedono solo i propri dati
CREATE POLICY "Athletes can view own data" ON athletes
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Athletes can update own data" ON athletes
    FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- FUNZIONI UTILI
-- =====================================================

-- Funzione per calcolare XP e livello
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- Formula: ogni livello richiede level * 100 XP
    RETURN FLOOR((-1 + SQRT(1 + 8 * xp / 100)) / 2) + 1;
END;
$$ LANGUAGE plpgsql;

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER athletes_updated_at
    BEFORE UPDATE ON athletes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER workouts_updated_at
    BEFORE UPDATE ON workouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
