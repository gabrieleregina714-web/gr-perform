-- =====================================================
-- GR PERFORM - TELEMETRY V1 (Supabase)
-- Esegui questo SQL nel SQL Editor di Supabase
--
-- Scopo:
-- - Rendere "telemetria impeccabile" canonica e queryable
-- - Evitare salvataggi su colonne non presenti (es. workouts.actual_duration_minutes)
-- - Separare:
--   1) weekly_feedback (report settimanale)
--   2) workout_session_feedback (feedback/session summary post-allenamento)
--   3) workout_logs (già presente nello schema) per log per-esercizio
--
-- Nota RLS:
-- In questo progetto molte pagine usano REST con anon key.
-- Qui NON abilitiamo RLS per evitare di rompere l'app.
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELLA: weekly_feedback (Report settimanale)
-- =====================================================
CREATE TABLE IF NOT EXISTS weekly_feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,

  week_number INTEGER,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  fatigue_level INTEGER,
  sleep_quality INTEGER,
  sleep_hours INTEGER,
  stress_level INTEGER,
  nutrition_quality INTEGER,
  motivation_level INTEGER,
  readiness_score INTEGER,

  pain_areas TEXT[],
  pain_notes TEXT,

  preferences JSONB,
  coach_notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weekly_feedback_athlete_time ON weekly_feedback(athlete_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_feedback_week ON weekly_feedback(athlete_id, week_number);

-- =====================================================
-- TABELLA: workout_session_feedback (Feedback post-allenamento)
-- =====================================================
CREATE TABLE IF NOT EXISTS workout_session_feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,

  duration_minutes INTEGER,
  feeling INTEGER,
  rpe INTEGER,
  notes TEXT,

  completed_sets INTEGER,
  total_sets INTEGER,

  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_session_feedback_athlete_time ON workout_session_feedback(athlete_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_session_feedback_workout ON workout_session_feedback(workout_id);

-- =====================================================
-- TABELLA: ai_program_state (Memoria AI per atleta)
-- Nota: aggiunta qui per avere una singola migrazione "v1" facile da rieseguire.
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_program_state (
  athlete_id UUID PRIMARY KEY REFERENCES athletes(id) ON DELETE CASCADE,
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_program_state_updated_at ON ai_program_state(updated_at);
