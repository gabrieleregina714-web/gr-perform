/**
 * GR Perform - Benchmark Runner (test-only)
 *
 * Esegue generazioni ripetibili su profili atleta fissi e produce report
 * usando CoachQuality / WorkoutAudit.
 */

window.BenchmarkRunner = (function () {
  'use strict';

  const VERSION = '1.0';

  const DAY_LABEL = {
    monday: 'Lunedì',
    tuesday: 'Martedì',
    wednesday: 'Mercoledì',
    thursday: 'Giovedì',
    friday: 'Venerdì',
    saturday: 'Sabato',
    sunday: 'Domenica'
  };

  const DEFAULT_DAYS_BY_FREQUENCY = {
    2: ['tuesday', 'friday'],
    3: ['monday', 'wednesday', 'friday'],
    4: ['monday', 'tuesday', 'thursday', 'friday'],
    5: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  };

  const microPeriodization = {
    2: [
      { intensity: 'ALTA', rpeRange: '8-9', volumeMod: 1.0, description: 'Sessione PESANTE' },
      { intensity: 'BASSA', rpeRange: '5-6', volumeMod: 0.7, description: 'Sessione LEGGERA' }
    ],
    3: [
      { intensity: 'ALTA', rpeRange: '8-9', volumeMod: 1.0, description: 'Sessione PESANTE' },
      { intensity: 'BASSA', rpeRange: '5-6', volumeMod: 0.6, description: 'Sessione LEGGERA' },
      { intensity: 'MEDIA', rpeRange: '7-7.5', volumeMod: 0.85, description: 'Sessione MEDIA' }
    ],
    4: [
      { intensity: 'ALTA', rpeRange: '8-9', volumeMod: 1.0, description: 'Sessione PESANTE' },
      { intensity: 'BASSA', rpeRange: '5-6', volumeMod: 0.6, description: 'Sessione LEGGERA' },
      { intensity: 'MEDIA', rpeRange: '7', volumeMod: 0.8, description: 'Sessione MEDIA' },
      { intensity: 'MEDIO-ALTA', rpeRange: '7.5-8', volumeMod: 0.9, description: 'Sessione MEDIO-ALTA' }
    ],
    5: [
      { intensity: 'ALTA', rpeRange: '8-9', volumeMod: 1.0, description: 'HEAVY' },
      { intensity: 'MEDIA', rpeRange: '7', volumeMod: 0.8, description: 'MEDIUM' },
      { intensity: 'BASSA', rpeRange: '5-6', volumeMod: 0.6, description: 'LIGHT' },
      { intensity: 'ALTA', rpeRange: '8-9', volumeMod: 1.0, description: 'HEAVY' },
      { intensity: 'MEDIA', rpeRange: '7', volumeMod: 0.8, description: 'MEDIUM' }
    ]
  };

  function getDayMicroPeriod(dayIndex, totalDays) {
    const pattern = microPeriodization[Math.min(totalDays, 5)] || microPeriodization[3];
    return pattern[dayIndex % pattern.length];
  }

  function summarizeWorkoutForContext(w) {
    try {
      const day = String(w?.day_of_week || '').toLowerCase();
      const title = String(w?.name || '').trim();
      const exs = Array.isArray(w?.exercises) ? w.exercises : [];
      const first3 = exs
        .slice(0, 3)
        .map((e) => String(e?.name || '').trim())
        .filter(Boolean);
      return `- ${DAY_LABEL[day] || day || 'Giorno'}: ${title || 'Workout'} | start: ${first3.join(' / ') || 'N/A'}`;
    } catch {
      return '- N/A';
    }
  }

  function parseWorkoutJsonOrThrow(text, label) {
    if (!text) throw new Error(`${label}: risposta vuota`);

    if (window.GR_AI_JSON?.parseFirstJson) {
      const parsed = window.GR_AI_JSON.parseFirstJson(text);
      // parseFirstJson returns { ok, value, error, jsonText }
      if (!parsed || !parsed.ok || !parsed.value) {
        throw new Error(`${label}: JSON non trovato — ${parsed?.error || 'unknown'}`);
      }
      return parsed.value; // ✅ restituisce il workout, non il wrapper
    }

    // Fallback minimale
    const m = String(text).match(/\{[\s\S]*\}/);
    if (!m) throw new Error(`${label}: JSON non trovato (fallback)`);
    return JSON.parse(m[0]);
  }

  function normalizeWorkout(w) {
    if (!w || typeof w !== 'object') return w;
    const ww = { ...w };
    ww.name = String(ww.name || '').trim();
    ww.day_of_week = String(ww.day_of_week || '').toLowerCase().trim();
    ww.estimated_duration_minutes = parseInt(ww.estimated_duration_minutes, 10) || 60;

    const exs = Array.isArray(ww.exercises) ? ww.exercises : [];
    ww.exercises = exs
      .map((e) => {
        if (!e || typeof e !== 'object') {
          return { name: String(e || ''), sets: 1, reps: 'N/A', rest: '60s', type: 'conditioning' };
        }
        const ex = { ...e };
        ex.name = String(ex.name || '').trim();
        ex.sets = parseInt(ex.sets, 10) || 1;
        ex.reps = String(ex.reps || 'N/A');
        ex.rest = String(ex.rest || '60s');
        const t = String(ex.type || '').toLowerCase().trim();
        ex.type = t === 'strength' || t === 'hypertrophy' || t === 'conditioning' ? t : 'conditioning';
        return ex;
      })
      .filter((ex) => ex.name.length > 0);

    return ww;
  }

  function buildDayPrompt({
    sportKey,
    phase,
    athleteLevel,
    sessionDuration,
    weekIndex,
    day,
    dayNumber,
    totalDays,
    workoutsSoFar
  }) {
    const micro = getDayMicroPeriod(dayNumber - 1, totalDays);

    const playbook = window.CoachPlaybook?.buildPromptSnippet
      ? window.CoachPlaybook.buildPromptSnippet({ sport: sportKey, phase, dayNumber, microPeriod: micro })
      : '';

    const weekSoFar = workoutsSoFar.length
      ? `WEEK SO FAR:\n${workoutsSoFar.map(summarizeWorkoutForContext).join('\n')}`
      : 'WEEK SO FAR: N/A';

    const essentialRules = `REGOLE OUTPUT:\n- JSON valido: {day_of_week,name,estimated_duration_minutes,exercises:[{name,sets,reps,rest,type}]}\n- MINIMO 6 esercizi (warm-up e cooldown contano)\n- type: strength|hypertrophy|conditioning (NO altri valori)\n  - boxing/sprint/agility/drills/plyo/conditioning rounds => type=conditioning\n  - warm-up / mobility / activation / prehab => type=conditioning\n- Nomi SPECIFICI (NO nomi generici)\n- Round-based: se fai round, usa SEMPRE sets=N e reps=\"3min\" (es: 6x3min => sets=6, reps=\"3min\")\n- Warm-up presente (1-2)\n- Cooldown OBBLIGATORIO (1): nome deve contenere "Cooldown" o "Stretch" o "Breathing"\n- Struttura: warmup → main → accessori → conditioning → cooldown\n- Rest realistici:\n  - strength: 90-240s\n  - hypertrophy: 45-90s\n  - conditioning: 30-120s\n- Target durata: ${sessionDuration}min (±10)\n\nIMPORTANTE:\n- Rispetta sport e fase\n- Evita ripetizioni inutili nella stessa settimana`;

    const ctx = [
      `SPORT: ${sportKey}`,
      `FASE: ${phase}`,
      `ATLETA: livello ${athleteLevel}`,
      `SETTIMANA: ${weekIndex}`,
      `GIORNO: ${DAY_LABEL[day] || day} (day_of_week=\"${day}\")`,
      `INTENSITÀ GIORNO: ${micro.intensity} (RPE ${micro.rpeRange}) — ${micro.description}`,
      weekSoFar,
      playbook,
      essentialRules,
      `OUTPUT: SOLO JSON.`
    ]
      .filter(Boolean)
      .join('\n');

    return ctx;
  }

  async function generateDayWorkout({ prompt, temperature, maxTokens }) {
    // Check which provider to use (benchmark can override)
    const provider = window.DualAI?._benchmarkProvider || 'groq';

    if (provider === 'ollama_gemini') {
      if (!window.DualAI?.callOllama) throw new Error('DualAI.callOllama non disponibile');
      if (!window.DualAI?.callGemini) throw new Error('DualAI.callGemini non disponibile');

      const gen = await window.DualAI.callOllama({
        messages: [
          { role: 'system', content: "Sei un preparatore atletico d'elite. Rispondi SOLO con JSON valido." },
          { role: 'user', content: prompt }
        ],
        model: window.DualAI._benchmarkOllamaModel || 'qwen2.5:14b',
        temperature,
        maxTokens,
        jsonMode: true
      });

      // Gemini validation/repair (best effort). If misconfigured, we fall back to Ollama output.
      try {
        const validation = await window.DualAI.callGemini({
          messages: [
            { role: 'system', content: 'Sei un validatore di workout. Rispondi SOLO con JSON valido.' },
            {
              role: 'user',
              content:
                (window.DualAI.createValidationPrompt ? window.DualAI.createValidationPrompt(prompt, gen?.content || '', prompt) :
                  `VALIDA E CORREGGI QUESTO WORKOUT.\n\nPROMPT:\n${prompt}\n\nWORKOUT:\n${gen?.content || ''}\n\nOUTPUT: SOLO JSON valido`) 
            }
          ],
          model: 'review',
          temperature: 0.1,
          maxTokens,
          jsonMode: true
        });

        return validation?.content || gen?.content || '';
      } catch {
        return gen?.content || '';
      }
    }

    if (provider === 'ollama') {
      if (!window.DualAI?.callOllama) throw new Error('DualAI.callOllama non disponibile');
      
      const res = await window.DualAI.callOllama({
        messages: [
          { role: 'system', content: "Sei un preparatore atletico d'elite. Rispondi SOLO con JSON valido." },
          { role: 'user', content: prompt }
        ],
        model: window.DualAI._benchmarkOllamaModel || 'llama3.2',
        temperature,
        maxTokens,
        jsonMode: true
      });
      return res?.content || '';
    }

    // Default: Groq
    if (!window.DualAI?.callGroq) throw new Error('DualAI non disponibile (include js/dual-ai.js)');

    const res = await window.DualAI.callGroq({
      messages: [
        { role: 'system', content: "Sei un preparatore atletico d'elite. Rispondi SOLO con JSON valido." },
        { role: 'user', content: prompt }
      ],
      model: 'balanced',
      temperature,
      maxTokens,
      jsonMode: true
    });

    return res?.content || '';
  }

  function defaultCases() {
    const sports = ['boxe', 'calcio', 'basket', 'palestra'];
    const levels = [
      { key: 'beginner', label: 'beginner' },
      { key: 'intermediate', label: 'intermediate' },
      { key: 'advanced', label: 'advanced' }
    ];

    const cases = [];
    for (const sportKey of sports) {
      for (const l of levels) {
        cases.push({
          id: `${sportKey}_${l.key}`,
          sportKey,
          phase: 'accumulo',
          athleteLevel: l.label,
          sessionDuration: 60,
          sessionsPerWeek: 3
        });
      }
    }
    return cases;
  }

  function computeTopIssues(weekResults) {
    const counts = new Map();

    for (const r of weekResults) {
      for (const msg of r?.issues || []) {
        const k = String(msg);
        counts.set(k, (counts.get(k) || 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([issue, n]) => ({ issue, n }));
  }

  async function run({
    cases = defaultCases(),
    weeksPerCase = 1,
    temperature = 0.35,
    maxTokens = 2200,
    failFastOnMisconfig = true,
    onProgress
  } = {}) {
    const startedAt = Date.now();

    const summary = {
      version: VERSION,
      startedAt: new Date().toISOString(),
      config: { weeksPerCase, temperature, maxTokens },
      totals: { cases: cases.length, weeks: 0, days: 0, failures: 0 },
      byCase: []
    };

    for (let caseIndex = 0; caseIndex < cases.length; caseIndex++) {
      const c = cases[caseIndex];
      const days = DEFAULT_DAYS_BY_FREQUENCY[c.sessionsPerWeek] || DEFAULT_DAYS_BY_FREQUENCY[3];

      const caseReport = {
        id: c.id,
        sportKey: c.sportKey,
        athleteLevel: c.athleteLevel,
        phase: c.phase,
        sessionDuration: c.sessionDuration,
        sessionsPerWeek: c.sessionsPerWeek,
        weeks: []
      };

      for (let week = 1; week <= weeksPerCase; week++) {
        const workouts = [];
        const dayReports = [];

        for (let i = 0; i < days.length; i++) {
          const day = days[i];
          const dayNumber = i + 1;

          const prompt = buildDayPrompt({
            sportKey: c.sportKey,
            phase: c.phase,
            athleteLevel: c.athleteLevel,
            sessionDuration: c.sessionDuration,
            weekIndex: week,
            day,
            dayNumber,
            totalDays: days.length,
            workoutsSoFar: workouts
          });

          onProgress?.({
            type: 'day_start',
            caseIndex,
            caseCount: cases.length,
            caseId: c.id,
            week,
            weeksPerCase,
            day,
            dayNumber
          });

          let workoutObj = null;
          let raw = '';
          let err = null;

          try {
            raw = await generateDayWorkout({ prompt, temperature, maxTokens });
            workoutObj = normalizeWorkout(parseWorkoutJsonOrThrow(raw, `${c.id} W${week} ${day}`));
            workoutObj.day_of_week = day;
          } catch (e) {
            err = String(e?.message || e);

            // Fail-fast on obvious local misconfiguration (otherwise the benchmark is meaningless).
            if (
              failFastOnMisconfig &&
              (err.includes('GROQ_API_KEY missing') || err.includes('Server misconfigured') || err.includes('GROQ_API_KEY'))
            ) {
              throw new Error('Configurazione mancante: imposta GROQ_API_KEY nel terminale prima di avviare il benchmark.');
            }

            summary.totals.failures++;

            // Fallback "decente" (>=6 esercizi) e sport-specific: utile per testare lo scorer anche offline.
            const sport = String(c.sportKey || '').toLowerCase();
            const base = [
              { name: 'Warm-up: mobilità + attivazione (8-10 min)', sets: 1, reps: '8-10 min', rest: '0s', type: 'conditioning' },
              { name: 'Main lift: Goblet Squat o Trap Bar Deadlift', sets: 4, reps: '6-8', rest: '150s', type: 'strength' },
              { name: 'Accessory: Romanian Deadlift', sets: 3, reps: '8-10', rest: '120s', type: 'strength' },
              { name: 'Upper: Row (manubri o cavo)', sets: 3, reps: '10-12', rest: '75s', type: 'hypertrophy' },
              { name: 'Core: Pallof Press', sets: 3, reps: '10/side', rest: '45s', type: 'conditioning' },
              { name: 'Cooldown: stretching + breathing (5-8 min)', sets: 1, reps: '5-8 min', rest: '0s', type: 'conditioning' }
            ];

            const sportSpecific = (() => {
              if (sport === 'boxe') {
                return [
                  { name: 'Heavy Bag: 6x3min (power combos)', sets: 6, reps: '3 min', rest: '60s', type: 'conditioning' },
                  { name: 'Prehab: Face Pull + External Rotation (superset)', sets: 3, reps: '15+15', rest: '60s', type: 'hypertrophy' }
                ];
              }
              if (sport === 'calcio') {
                return [
                  { name: 'Sprint: 8x20m (acceleration)', sets: 8, reps: '20 m', rest: '90s', type: 'conditioning' },
                  { name: 'COD: 5-10-5 Shuttle', sets: 4, reps: '1 rep', rest: '120s', type: 'conditioning' },
                  { name: 'Nordic Hamstring Curl', sets: 3, reps: '4-6', rest: '120s', type: 'strength' }
                ];
              }
              if (sport === 'basket') {
                return [
                  { name: 'Plyo: Box Jump', sets: 5, reps: '3', rest: '120s', type: 'conditioning' },
                  { name: 'Lateral: Defensive Slides (shuttles)', sets: 6, reps: '20-30s', rest: '45s', type: 'conditioning' },
                  { name: 'Ankles: Tibialis Raises', sets: 3, reps: '15-20', rest: '45s', type: 'hypertrophy' }
                ];
              }
              // palestra
              return [
                { name: 'Main lift: Bench Press', sets: 4, reps: '5-6', rest: '180s', type: 'strength' },
                { name: 'Pull: Pull-up o Lat Machine', sets: 4, reps: '6-10', rest: '120s', type: 'strength' }
              ];
            })();

            workoutObj = {
              day_of_week: day,
              name: `FALLBACK (${c.sportKey})`,
              estimated_duration_minutes: c.sessionDuration,
              exercises: [...sportSpecific, ...base]
            };
          }

          workouts.push(workoutObj);

          let qc = null;
          try {
            qc = window.CoachQuality?.scoreWorkout
              ? window.CoachQuality.scoreWorkout(workoutObj, { sportKey: c.sportKey, phase: c.phase })
              : null;
          } catch {
            qc = null;
          }

          dayReports.push({
            day,
            workoutName: workoutObj?.name,
            score: qc?.score ?? null,
            rating: qc?.rating ?? null,
            criticalIssues: qc?.criticalIssues ?? [],
            warnings: qc?.warnings ?? [],
            issues: qc?.issues ?? [],
            error: err,
            rawPreview: raw ? String(raw).slice(0, 400) : ''
          });

          summary.totals.days++;
          onProgress?.({
            type: 'day_done',
            caseId: c.id,
            week,
            day,
            score: qc?.score ?? null,
            criticalCount: (qc?.criticalIssues || []).length,
            error: err
          });
        }

        const weekScore = window.CoachQuality?.scoreWeek ? window.CoachQuality.scoreWeek(workouts, { sportKey: c.sportKey, phase: c.phase }) : null;

        const weekRecord = {
          week,
          averageScore: weekScore?.averageScore ?? null,
          overallRating: weekScore?.overallRating ?? null,
          criticalCount: weekScore?.criticalCount ?? null,
          topIssues: computeTopIssues(dayReports),
          days: dayReports
        };

        caseReport.weeks.push(weekRecord);
        summary.totals.weeks++;

        onProgress?.({
          type: 'week_done',
          caseId: c.id,
          week,
          averageScore: weekRecord.averageScore,
          criticalCount: weekRecord.criticalCount
        });
      }

      summary.byCase.push(caseReport);
      onProgress?.({ type: 'case_done', caseId: c.id });
    }

    summary.durationMs = Date.now() - startedAt;
    return summary;
  }

  console.log(`📈 BenchmarkRunner v${VERSION} loaded`);

  return {
    VERSION,
    run,
    defaultCases
  };
})();
