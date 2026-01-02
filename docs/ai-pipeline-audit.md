# GR Perform — AI Pipeline Audit (2025-12-19)

Questo documento descrive **come funziona oggi** la generazione AI (coach) e **cosa migliorare** per affidabilità/qualità.

## 1) Entry-point (UI)
- Pagina: [coach-generate.html](../coach-generate.html)
- Funzione “chat” usata da tutta la pipeline:
  - `groqChat(...)` usa `window.DualAI.chat(...)` se disponibile, altrimenti fallback a `fetch('/api/ai/chat', ...)`.

## 2) Provider layer (AI)
- Client browser: [js/dual-ai.js](../js/dual-ai.js)
  - Modalità: `GROQ_ONLY`, `GEMINI_ONLY`, `GROQ_GENERATE_GEMINI_VALIDATE`, `GEMINI_GENERATE_GROQ_VALIDATE`, `PARALLEL_CONSENSUS`, `FALLBACK`.
  - **Stato attuale (fix già applicato):** nessuna API key nel browser; chiamate proxate su `/api/ai/chat`.

- Proxy serverless (per deploy):
  - [api/ai/chat.js](../api/ai/chat.js) (unificato Groq + Gemini opzionale, risposta OpenAI-like)
  - [api/ai/groq-chat.js](../api/ai/groq-chat.js) (solo Groq)

- Proxy locale dev (per sviluppo senza Vercel):
  - [dev-server.js](../dev-server.js) ora supporta `provider: gemini` e `jsonMode/response_format`.

## 3) Costruzione contesto (prompting)
La pipeline in [coach-generate.html](../coach-generate.html) costruisce un contesto multi-modulo:

- **PerformancePrediction** (readiness + prompt) se disponibile
- **PeriodizationEngine** (parametri settimana + adattamento da feedback)
- **MacrocyclePlanner / ReturnToPlay / ExerciseMemory / PreWorkoutCheck** (se presenti)
- **WeeklyLogic** (contesto “umano” giorno-per-giorno)
- **Micro-periodizzazione** (intensità e volume day-based)
- **Metodologie** (training methods + advanced methods)
- **Libreria esercizi** (ExerciseLibraryV2)

Poi crea il prompt per ogni giorno via `buildCompactPrompt(dayCtx, ...)`, con clamp di lunghezza per evitare prompt troppo lunghi.

## 4) Generazione day-by-day
Per ogni giorno:
1. Chiama `groqChat({model: GROQ_MODELS.main, ...})` con istruzione “JSON only”.
2. Parsing JSON con `parseAiJsonOrThrow` (usa `GR_AI_JSON.parseFirstJson`).
3. `normalizeWorkout` (normalizza `type`, filtra, ecc.).
4. Post-process inline “v2.1” (fix rounds/sets/rest/reps, nomi generici).
5. Fallback se `< 3` esercizi.
6. Quality gate (WorkoutIntelligence se presente) e loop fix (`fixWorkoutIfNeeded`) max 2 tentativi.
7. “Expert council” opzionale + revisione + eventuale fix.
8. Post-processing “hard” con `WorkoutPostProcessor.process(...)` + `strictValidate`.
9. Salvataggio: `WorkoutHistory.save(...)` + `saveAIProgramState(...)`.

## 5) Punti forti (oggi)
- Pipeline “a strati”: generazione → parse → normalize → guardrail (validate) → fix → council → postprocess.
- Buon uso di contesto: periodizzazione + readiness + weekly logic + micro-periodizzazione.
- Fallback sensati (sport-specific) in caso di errori API.

## 6) Failure modes osservati
### 6.1 Parsing JSON
- I modelli a volte producono JSON con piccole deviazioni (virgolette “smart”, trailing commas).
- Fix applicato: `parseAiJsonOrThrow` ora prova una riparazione minimale (sicura) prima di fallire.

### 6.2 Drift dei parametri di periodizzazione
- Prima: in alcuni punti veniva mutato `periodizationParams` in-place durante il loop dei giorni, con rischio di moltiplicare i modifier più volte.
- Fix applicato: ora si passa al post-processor una **copia per-day** con volume/intensità aggiustati.

### 6.3 Duplice post-processing
- Esiste sia un post-process inline in `coach-generate.html` sia `WorkoutPostProcessor.process(...)`.
- Non è per forza un bug, ma aumenta la possibilità di correzioni “in competizione” nel tempo.

## 7) Miglioramenti consigliati (prossimi step)
1. **Single source of truth per le correzioni**: migrare gradualmente i fix inline dentro `WorkoutPostProcessor` (o viceversa) per non duplicare regole.
2. **Schema validation** (leggera): validare campi minimi (`day_of_week`, `exercises[]`, `sets/reps/rest/type`) prima di procedere.
3. **Prompt contract più stretto**: ridurre ambiguità (es. max esercizi/set totali) e far rispettare sempre la durata target.
4. **Misure qualità riproducibili**: loggare (in dev) metrics finali + issues + numero di fix applicati, per confrontare run.

## 8) Dove guardare per “come funziona”
- Pipeline principale: [coach-generate.html](../coach-generate.html)
- Provider orchestration: [js/dual-ai.js](../js/dual-ai.js)
- JSON tooling: [js/ai-json.js](../js/ai-json.js)
- Guardrail/validazione: [js/workout-intelligence.js](../js/workout-intelligence.js)
- Correzioni hard: [js/workout-postprocessor.js](../js/workout-postprocessor.js)
- Logica settimanale: [js/weekly-logic.js](../js/weekly-logic.js)
- Periodizzazione: [js/periodization-engine.js](../js/periodization-engine.js)
