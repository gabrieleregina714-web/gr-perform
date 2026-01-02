-- =====================================================
-- GR PERFORM - AI PROGRAM STATE (Supabase)
-- Esegui questo SQL nel SQL Editor di Supabase
--
-- Scopo:
-- - Persistenza “memoria” per atleta (coerenza nel tempo)
-- - Tracciabilità: cosa sapeva l’AI quando ha generato
-- - Evitare ripetizioni / drift
--
-- Nota RLS:
-- In questo progetto molte pagine usano la REST API con anon key e login lato client.
-- Se hai RLS abilitata, le policy devono essere progettate in base al tuo auth reale.
-- Qui NON abilitiamo RLS per evitare di rompere l'app.
-- =====================================================

CREATE TABLE IF NOT EXISTS ai_program_state (
  athlete_id UUID PRIMARY KEY REFERENCES athletes(id) ON DELETE CASCADE,
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_program_state_updated_at ON ai_program_state(updated_at);

-- Trigger updated_at (riusa la funzione update_updated_at se esiste)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'update_updated_at'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_trigger
      WHERE tgname = 'ai_program_state_updated_at'
    ) THEN
      CREATE TRIGGER ai_program_state_updated_at
        BEFORE UPDATE ON ai_program_state
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    END IF;
  END IF;
END$$;

-- (Opzionale) Se vuoi RLS davvero, definisci prima come autentichi coach/atleti.
-- Esempio solo-atleta (NON usare se coach deve leggere/scrivere):
-- ALTER TABLE ai_program_state ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Athlete can manage own AI state" ON ai_program_state
--   FOR ALL USING (auth.uid() = athlete_id) WITH CHECK (auth.uid() = athlete_id);
