-- =====================================================
-- GR PERFORM - SUBSCRIPTION SYSTEM SCHEMA
-- DA ESEGUIRE QUANDO PRONTO PER ABBONAMENTI
-- =====================================================

-- =====================================================
-- TABELLA: subscription_plans (I tuoi 4 pacchetti)
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Identificazione
    code VARCHAR(50) UNIQUE NOT NULL, -- 'starter_16w', 'standard_4m', 'pro_12m', 'elite_12m'
    name VARCHAR(100) NOT NULL,       -- 'Starter 16 Settimane', 'Standard 4 Mesi', etc.
    
    -- Durata
    duration_weeks INTEGER NOT NULL,  -- 16, 17, 52, 52
    duration_type VARCHAR(20) NOT NULL, -- 'weeks', 'months'
    
    -- Prezzo (in centesimi per precisione)
    price_cents INTEGER NOT NULL,     -- es: 9900 = €99.00
    currency VARCHAR(3) DEFAULT 'EUR',
    
    -- Stripe (da compilare quando integri)
    stripe_price_id VARCHAR(100),     -- 'price_xxx' da Stripe
    stripe_product_id VARCHAR(100),   -- 'prod_xxx' da Stripe
    
    -- Features incluse (JSON)
    features JSONB DEFAULT '[]',
    /*
    Esempio features:
    [
        {"name": "Allenamenti AI personalizzati", "included": true},
        {"name": "Chat con coach", "included": false},
        {"name": "Analisi video", "included": false},
        {"name": "Chiamate mensili", "included": false, "quantity": 0}
    ]
    */
    
    -- Limiti
    max_workouts_per_week INTEGER DEFAULT 6,
    includes_coach_chat BOOLEAN DEFAULT false,
    includes_video_analysis BOOLEAN DEFAULT false,
    monthly_calls INTEGER DEFAULT 0,
    
    -- Stato
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserisci i 4 pacchetti
INSERT INTO subscription_plans (code, name, duration_weeks, duration_type, price_cents, features, max_workouts_per_week, includes_coach_chat, monthly_calls) VALUES
('starter_16w', 'Starter - 16 Settimane', 16, 'weeks', 14900, 
 '[{"name": "Allenamenti AI personalizzati", "included": true}, {"name": "Periodizzazione automatica", "included": true}, {"name": "Dashboard progressi", "included": true}]',
 4, false, 0),
 
('standard_4m', 'Standard - 4 Mesi', 17, 'weeks', 19900,
 '[{"name": "Allenamenti AI personalizzati", "included": true}, {"name": "Periodizzazione automatica", "included": true}, {"name": "Dashboard progressi", "included": true}, {"name": "Adattamento intelligente", "included": true}]',
 5, false, 0),
 
('pro_12m', 'Pro - 12 Mesi', 52, 'weeks', 49900,
 '[{"name": "Allenamenti AI personalizzati", "included": true}, {"name": "Periodizzazione automatica", "included": true}, {"name": "Dashboard progressi", "included": true}, {"name": "Adattamento intelligente", "included": true}, {"name": "Analisi avanzata", "included": true}]',
 6, false, 0),
 
('elite_12m', 'Elite - 12 Mesi + Coaching', 52, 'weeks', 99900,
 '[{"name": "Allenamenti AI personalizzati", "included": true}, {"name": "Periodizzazione automatica", "included": true}, {"name": "Dashboard progressi", "included": true}, {"name": "Adattamento intelligente", "included": true}, {"name": "Analisi avanzata", "included": true}, {"name": "Chat con coach", "included": true}, {"name": "Chiamate mensili", "included": true, "quantity": 2}]',
 6, true, 2)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- TABELLA: subscriptions (Abbonamenti attivi degli atleti)
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    
    -- Date
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Stato
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'cancelled', 'expired'
    
    -- Stripe (da compilare quando integri)
    stripe_subscription_id VARCHAR(100),
    stripe_customer_id VARCHAR(100),
    
    -- Pagamento
    payment_method VARCHAR(50), -- 'stripe', 'paypal', 'manual', 'free_trial'
    last_payment_at TIMESTAMP WITH TIME ZONE,
    next_payment_at TIMESTAMP WITH TIME ZONE,
    
    -- Trial
    is_trial BOOLEAN DEFAULT false,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELLA: macrocycles (Roadmap per Supabase)
-- Questo SOSTITUISCE il localStorage del MacrocyclePlanner
-- =====================================================
CREATE TABLE IF NOT EXISTS macrocycles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    
    -- Evento target
    target_event_name VARCHAR(200),
    target_event_date DATE NOT NULL,
    
    -- Sport & Configurazione
    sport VARCHAR(50) NOT NULL,
    category VARCHAR(50), -- 'combat', 'team', 'endurance', 'fitness'
    
    -- Fasi (JSON array)
    phases JSONB NOT NULL,
    /*
    Esempio phases:
    [
        {"name": "Accumulo", "code": "accumulo", "start_date": "2025-01-01", "end_date": "2025-02-15", "weeks": 6, "volume_pct": 100, "intensity_pct": 70},
        {"name": "Intensificazione", "code": "intensificazione", "start_date": "2025-02-16", "end_date": "2025-03-31", "weeks": 6, "volume_pct": 85, "intensity_pct": 85},
        ...
    ]
    */
    
    -- Progresso
    current_week INTEGER DEFAULT 1,
    current_phase VARCHAR(50),
    
    -- Stato
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'abandoned'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELLA: progress_snapshots (Foto progressi settimanali)
-- Per analisi a lungo termine
-- =====================================================
CREATE TABLE IF NOT EXISTS progress_snapshots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
    macrocycle_id UUID REFERENCES macrocycles(id),
    
    -- Quando
    week_number INTEGER NOT NULL,
    snapshot_date DATE DEFAULT CURRENT_DATE,
    
    -- Metriche fisiche
    weight_kg DECIMAL(5,2),
    body_fat_pct DECIMAL(4,1),
    
    -- Metriche performance
    avg_rpe DECIMAL(3,1),
    compliance_pct INTEGER, -- % workout completati
    total_volume INTEGER,   -- tonnellaggio totale settimana
    
    -- PRs della settimana (JSON)
    prs_achieved JSONB DEFAULT '[]',
    /*
    [{"exercise": "Back Squat", "value": 120, "unit": "kg", "type": "1RM"}]
    */
    
    -- Recovery
    avg_sleep_hours DECIMAL(3,1),
    avg_hrv INTEGER,
    avg_readiness INTEGER,
    
    -- Note
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDICI per performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_subscriptions_athlete ON subscriptions(athlete_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_macrocycles_athlete ON macrocycles(athlete_id);
CREATE INDEX IF NOT EXISTS idx_macrocycles_status ON macrocycles(status);
CREATE INDEX IF NOT EXISTS idx_progress_athlete_week ON progress_snapshots(athlete_id, week_number);

-- =====================================================
-- FUNZIONE: Calcola settimana corrente del macrociclo
-- =====================================================
CREATE OR REPLACE FUNCTION get_macrocycle_current_week(macrocycle_id UUID)
RETURNS INTEGER AS $$
DECLARE
    start_date DATE;
    current_week INTEGER;
BEGIN
    SELECT (phases->0->>'start_date')::DATE INTO start_date
    FROM macrocycles WHERE id = macrocycle_id;
    
    IF start_date IS NULL THEN
        RETURN 1;
    END IF;
    
    current_week := GREATEST(1, CEIL(EXTRACT(EPOCH FROM (CURRENT_DATE - start_date)) / (7 * 24 * 60 * 60))::INTEGER);
    RETURN current_week;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGER: Auto-update macrocycle week
-- =====================================================
CREATE OR REPLACE FUNCTION update_macrocycle_week()
RETURNS TRIGGER AS $$
BEGIN
    NEW.current_week := get_macrocycle_current_week(NEW.id);
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- RLS (Row Level Security) - Ogni atleta vede solo i suoi dati
-- =====================================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE macrocycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_snapshots ENABLE ROW LEVEL SECURITY;

-- Policy: Atleta vede solo i propri abbonamenti
CREATE POLICY subscriptions_athlete_policy ON subscriptions
    FOR ALL USING (athlete_id = auth.uid());

-- Policy: Atleta vede solo i propri macrocicli
CREATE POLICY macrocycles_athlete_policy ON macrocycles
    FOR ALL USING (athlete_id = auth.uid());

-- Policy: Atleta vede solo i propri progressi
CREATE POLICY progress_athlete_policy ON progress_snapshots
    FOR ALL USING (athlete_id = auth.uid());
