-- Tabella per i test fisici degli atleti
CREATE TABLE IF NOT EXISTS fitness_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    sport VARCHAR(50),
    role VARCHAR(50),
    goal VARCHAR(50),
    test_category VARCHAR(50),
    test_name VARCHAR(100),
    test_label VARCHAR(100),
    value DECIMAL(10,2),
    unit VARCHAR(20),
    test_date DATE DEFAULT CURRENT_DATE,
    workout_id UUID REFERENCES workouts(id),
    notes TEXT,
    coach_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fitness_tests_athlete ON fitness_tests(athlete_id);
CREATE INDEX IF NOT EXISTS idx_fitness_tests_date ON fitness_tests(test_date);

-- Catalogo test per sport/ruolo/obiettivo
CREATE TABLE IF NOT EXISTS test_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sport VARCHAR(50),
    role VARCHAR(50),
    goal VARCHAR(50),
    test_category VARCHAR(50),
    test_name VARCHAR(100),
    test_label VARCHAR(100),
    unit VARCHAR(20),
    description TEXT,
    is_higher_better BOOLEAN DEFAULT true
);
