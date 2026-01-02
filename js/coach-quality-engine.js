/**
 * GR Perform - Coach Quality Engine
 *
 * Goal: score workouts/weekly plans against a "human coach" rubric.
 * This is intentionally heuristic: it provides stable guardrails and
 * actionable issues for the existing fix loop.
 */

window.CoachQuality = (function () {
  'use strict';

  const VERSION = '1.0';

  function normSport(sport) {
    return window.CoachPlaybook?._normSport ? window.CoachPlaybook._normSport(sport) : String(sport || '').toLowerCase();
  }

  function normPhase(phase) {
    return window.CoachPlaybook?._normPhase ? window.CoachPlaybook._normPhase(phase) : String(phase || '').toLowerCase();
  }

  function normSeasonPhase(seasonPhase) {
    return window.CoachPlaybook?._normSeasonPhase ? window.CoachPlaybook._normSeasonPhase(seasonPhase) : String(seasonPhase || '').toLowerCase();
  }

  function normMatchDayType(matchDayType) {
    const s = String(matchDayType || '').toLowerCase().trim();
    if (!s) return '';
    if (s === 'md-1' || s === 'md-2' || s === 'md-3' || s === 'md0' || s === 'md+1' || s === 'md+2' || s === 'md+3') return s;
    // Common variants
    if (s.includes('md') && s.includes('-1')) return 'md-1';
    if (s.includes('md') && s.includes('+1')) return 'md+1';
    if (s.includes('match') && (s.includes('day') || s.includes('giorno')) && (s.includes('0') || s.includes('oggi'))) return 'md0';
    return s;
  }

  function isInSeason(context) {
    const sp = normSeasonPhase(context?.seasonPhase || context?.season || context?.season_phase);
    if (sp === 'in_season') return true;
    // Heuristic from macrocycle phase name (if caller passes it)
    const macroName = String(context?.macroPhaseName || context?.macro_phase_name || '').toLowerCase();
    if (macroName.includes('competition') || macroName.includes('competizione')) return true;
    return false;
  }

  function toTextList(arr, prefix = '') {
    return (Array.isArray(arr) ? arr : []).map((x) => `${prefix}${String(x || '').trim()}`).filter(Boolean);
  }

  function hasAny(exercises, regex) {
    const exs = Array.isArray(exercises) ? exercises : [];
    return exs.some((e) => regex.test(String(e?.name || '')));
  }

  function hasRoundBasedWork(exercises) {
    const exs = Array.isArray(exercises) ? exercises : [];
    // Detect explicit patterns in name/reps
    const explicit = exs.some((e) => {
      const name = String(e?.name || '');
      const reps = String(e?.reps || '');
      return /(\d+\s*x\s*\d+\s*min|\d+\s*rounds?|round\s*\d+)/i.test(name) || /(\d+\s*x\s*\d+\s*min|\d+\s*rounds?)/i.test(reps);
    });
    if (explicit) return true;

    // Heuristic: multiple sets with time-based reps implies rounds (e.g., sets=4 reps='3min')
    return exs.some((e) => {
      const sets = parseInt(e?.sets, 10) || 0;
      const reps = String(e?.reps || '').toLowerCase();
      return sets >= 4 && /min|minute/.test(reps);
    });
  }

  function getTotalSets(exercises) {
    const exs = Array.isArray(exercises) ? exercises : [];
    return exs.reduce((sum, ex) => sum + (parseInt(ex?.sets, 10) || 0), 0);
  }

  function getIssuesBase(workout, context) {
    const issues = [];
    const warnings = [];
    const suggestions = [];

    const w = workout || {};
    const exs = Array.isArray(w.exercises) ? w.exercises : [];
    const phase = normPhase(context?.phase || context?.currentPhase);

    // Use existing analyzers when available
    try {
      if (window.WorkoutAudit?.analyze) {
        const audit = window.WorkoutAudit.analyze(w);
        for (const i of audit.issues || []) issues.push(String(i));
        for (const s of audit.suggestions || []) suggestions.push(String(s));
      }
    } catch {
      // ignore
    }

    try {
      if (window.WorkoutIntelligence?.calculateMetrics) {
        const m = window.WorkoutIntelligence.calculateMetrics(w);
        // Phase-aware sanity checks (light)
        if ((phase === 'deload' || phase === 'taper') && m.totalSets > 28) {
          issues.push('❌ Deload: troppi sets totali (riduci volume ~-40%).');
        }
        if (phase === 'intensificazione' && m.totalSets > 55) {
          issues.push('❌ Intensificazione: volume eccessivo per una settimana "heavy".');
        }
        if (m.estimatedDurationMinutes && m.estimatedDurationMinutes > 90) {
          warnings.push('⚠️ Durata stimata > 90min: rischio scarsa aderenza.');
        }
      }
    } catch {
      // ignore
    }

    // Generic "coach-like" checks
    const totalSets = getTotalSets(exs);
    if (exs.length > 0 && totalSets === 0) {
      issues.push('❌ Sets mancanti o a 0 su molti esercizi.');
    }

    const hasWarm = hasAny(exs, /warm|activation|mobility|dynamic/i);
    const hasCool = hasAny(exs, /cool|stretch|recovery/i);
    if (!hasWarm) issues.push('❌ Coach standard: warm-up mancante.');
    if (!hasCool) warnings.push('⚠️ Coach standard: cooldown/stretching mancante.');

    return { issues, warnings, suggestions };
  }

  function getTeamSeasonIssues(workout, context) {
    const sport = normSport(context?.sport || context?.sportKey || context?.athleteSport);
    if (sport !== 'calcio' && sport !== 'basket') return { issues: [], warnings: [], suggestions: [] };

    if (!isInSeason(context)) return { issues: [], warnings: [], suggestions: [] };

    const exs = Array.isArray(workout?.exercises) ? workout.exercises : [];
    const issues = [];
    const warnings = [];
    const suggestions = [];

    const md = normMatchDayType(context?.matchDayType || context?.match_day_type || context?.md);

    // Only enforce hard constraints when we actually know we're close to a match.
    if (!md) {
      warnings.push('⚠️ Team sport: seasonPhase=in_season ma matchDayType non specificato (MD-1/MD0/MD+1). Controlli match-aware limitati.');
      return { issues, warnings, suggestions };
    }

    const nearMatch = md === 'md-1' || md === 'md0' || md === 'md+1';
    if (!nearMatch) return { issues, warnings, suggestions };

    const totalSets = getTotalSets(exs);
    if (totalSets > 40) {
      issues.push(`❌ Team sport ${md}: volume sets troppo alto (${totalSets}). Rischio DOMS e interferenza.`);
    }

    // Eccentric / DOMS-prone exposures near match
    const hasNordic = hasAny(exs, /(nordic)/i);
    const hasCopenhagen = hasAny(exs, /(copenhagen)/i);
    const hasHeavyLower = hasAny(exs, /(back squat|front squat|deadlift|trap bar|rdl|romanian deadlift|good morning|bulgarian split squat)/i);
    if (sport === 'calcio') {
      if (hasNordic || hasCopenhagen) {
        issues.push(`❌ Calcio ${md}: eccentrics (Nordic/Copenhagen) troppo vicino alla partita.`);
      }
      if (hasHeavyLower && totalSets > 28) {
        issues.push(`❌ Calcio ${md}: lower heavy + volume medio/alto troppo vicino alla partita.`);
      }
    }

    if (sport === 'basket') {
      const hasHighImpactPlyo = hasAny(exs, /(depth jump|drop jump|bounds?|repeated jumps?|plyo)/i);
      const hasJump = hasAny(exs, /(jump|box jump|approach jump|rim touch|landing)/i);
      if (hasHighImpactPlyo) {
        issues.push(`❌ Basket ${md}: plyo ad alto impatto troppo vicino alla gara.`);
      } else if (hasJump && totalSets > 32) {
        warnings.push(`⚠️ Basket ${md}: presenza jump vicino alla gara; mantieni volume minimo e qualità alta.`);
      }
    }

    // Suggest priming / activation near match if missing obvious cues
    const hasPriming = hasAny(exs, /(priming|activation|attivazione|mobility|dynamic|warm)/i);
    if (!hasPriming) {
      warnings.push(`⚠️ Team sport ${md}: aggiungi un blocco breve di attivazione/priming (5-10 min).`);
    }

    return { issues, warnings, suggestions };
  }

  function getMatchDayIssues(workout, context) {
    const exs = Array.isArray(workout?.exercises) ? workout.exercises : [];
    const issues = [];
    const warnings = [];
    const suggestions = [];

    const sport = normSport(context?.sport || context?.sportKey || context?.athleteSport);
    const md = normMatchDayType(context?.matchDayType || context?.match_day_type || context?.md);
    if (!md) return { issues, warnings, suggestions };

    const totalSets = getTotalSets(exs);

    const hasHeavyLower = hasAny(exs, /(back squat|front squat|deadlift|trap bar|rdl|romanian deadlift|good morning|bulgarian split squat|leg press)/i);
    const hasHighImpactPlyo = hasAny(exs, /(depth jump|drop jump|bounds?|repeated jumps?|plyo)/i);
    const hasHIIT = hasAny(exs, /(hiit|assault bike|sprint intervals|tabata|all-?out|suicide|gassers)/i);
    const hasLongConditioning = hasAny(exs, /(\bzone\s*2\b|aerobic|liss|easy run|jog|bike easy|row easy)/i);
    const hasActivation = hasAny(exs, /(activation|attivazione|priming|mobility|dynamic|warm)/i);

    // MD0: safest default. Allow only primer / very light activation.
    if (md === 'md0') {
      // Coach default is OFF; tolerate only extremely light activation.
      if (totalSets > 8) issues.push(`❌ ${md}: volume troppo alto per match-day (sets=${totalSets}). Default coach = OFF.`);
      if (hasHeavyLower) issues.push(`❌ ${md}: lower heavy vietato (rischio DOMS/interferenza).`);
      if (hasHighImpactPlyo) issues.push(`❌ ${md}: plyo ad alto impatto vietato.`);
      if (hasHIIT) issues.push(`❌ ${md}: HIIT/all-out vietato.`);
      if (!hasActivation && totalSets > 0) warnings.push(`⚠️ ${md}: se proprio fai qualcosa, deve essere solo attivazione/priming (5–10').`);

      // Boxing: match-day should not include hard rounds
      if (sport === 'boxe') {
        const hasHardRounds = hasAny(exs, /(\d+\s*x\s*\d+\s*min|\d+\s*rounds?|sparring)/i);
        if (hasHardRounds) issues.push(`❌ Boxe ${md}: no sparring/rounds duri nel giorno match.`);
      }

      return { issues, warnings, suggestions };
    }

    // MD-1 and MD+1: match-adjacent rules
    if (md === 'md-1') {
      if (totalSets > 28) issues.push(`❌ ${md}: volume troppo alto (sets=${totalSets}). Priming = volume basso.`);
      if (hasHeavyLower) issues.push(`❌ ${md}: lower heavy sconsigliato (priming solo).`);
      if (hasHighImpactPlyo) issues.push(`❌ ${md}: plyo ad alto impatto sconsigliato.`);
      if (hasHIIT) issues.push(`❌ ${md}: HIIT/all-out sconsigliato.`);
      if (!hasActivation) warnings.push(`⚠️ ${md}: aggiungi priming/attivazione breve.`);
      return { issues, warnings, suggestions };
    }

    if (md === 'md+1') {
      if (hasHeavyLower) issues.push(`❌ ${md}: evita lower heavy il giorno dopo gara.`);
      if (hasHighImpactPlyo) issues.push(`❌ ${md}: evita plyo high-impact il giorno dopo gara.`);
      if (hasHIIT) issues.push(`❌ ${md}: evita HIIT il giorno dopo gara.`);
      if (!hasLongConditioning && !hasActivation) {
        warnings.push(`⚠️ ${md}: inserisci recovery (zone2 easy/mobility) invece di lavoro intenso.`);
      }
      return { issues, warnings, suggestions };
    }

    return { issues, warnings, suggestions };
  }

  function getSportIssues(workout, context) {
    const sport = normSport(context?.sport || context?.sportKey || context?.athleteSport);
    const phase = normPhase(context?.phase || context?.currentPhase);

    const exs = Array.isArray(workout?.exercises) ? workout.exercises : [];
    const issues = [];
    const warnings = [];
    const suggestions = [];

    if (sport === 'boxe') {
      // ═══════════════════════════════════════════════════════════════
      // BOXE RULES v2.0 - Expert Coach Level
      // ═══════════════════════════════════════════════════════════════
      
      // 1. WARM-UP ADEGUATO (10-12 min, non 2-3 min)
      const warmupEx = exs.find(e => /warm|activation|mobility|dynamic/i.test(String(e?.name || '')));
      if (warmupEx) {
        const warmSets = parseInt(warmupEx.sets, 10) || 1;
        const warmReps = String(warmupEx.reps || '').toLowerCase();
        const warmMinutes = warmReps.match(/(\d+)\s*min/)?.[1] || 0;
        const estimatedWarmTime = warmMinutes > 0 ? parseInt(warmMinutes) : (warmSets * 2);
        if (estimatedWarmTime < 8) {
          issues.push(`❌ Boxe: warm-up insufficiente (~${estimatedWarmTime}min). Servono 10-12 min con mobilità dinamica, attivazione e shadow leggero.`);
        }
      }
      
      // 2. FORZA PRIMA DEL CONDITIONING (ordine corretto)
      let firstStrengthIdx = -1;
      let firstConditioningIdx = -1;
      let warmupEndIdx = -1;
      
      exs.forEach((e, idx) => {
        const name = String(e?.name || '').toLowerCase();
        const type = String(e?.type || '').toLowerCase();
        
        if (/warm|activation|mobility|dynamic/i.test(name)) {
          warmupEndIdx = idx;
        }
        if (type === 'strength' && firstStrengthIdx === -1) {
          firstStrengthIdx = idx;
        }
        // Conditioning boxe-specifico (non warm-up)
        if ((type === 'conditioning' || /shadow|bag|heavy bag|pad|circuit|boxing|round/i.test(name)) && 
            !/warm|activation|dynamic/i.test(name) && 
            firstConditioningIdx === -1) {
          firstConditioningIdx = idx;
        }
      });
      
      // Se conditioning viene prima della forza (dopo warm-up), è un errore
      if (firstStrengthIdx > -1 && firstConditioningIdx > -1 && 
          firstConditioningIdx < firstStrengthIdx && 
          firstConditioningIdx > warmupEndIdx) {
        issues.push('❌ Boxe: la forza deve venire PRIMA del conditioning boxing. Ordine: Warm-up → Forza → Conditioning → Cool-down.');
      }
      
      // 3. NECK STRENGTHENING (3x15 per direzione, NON 4x3min)
      const neckEx = exs.find(e => /neck|collo/i.test(String(e?.name || '')));
      if (neckEx) {
        const neckSets = parseInt(neckEx.sets, 10) || 0;
        const neckReps = String(neckEx.reps || '').toLowerCase();
        // Se ha minuti nelle reps, è sbagliato
        if (/\d+\s*min/i.test(neckReps)) {
          issues.push('❌ Boxe: neck strengthening NON deve essere a tempo (es. 4x3min). Usa 3x15-20 rep per direzione (flessione, estensione, laterale).');
        }
        if (neckSets > 4) {
          warnings.push('⚠️ Boxe: troppi sets per il collo. 3-4 sets x 15-20 rep per direzione sono sufficienti.');
        }
      }
      
      // 4. VOLUME CONDITIONING (max 6-8 round totali boxing-specific)
      const boxingRounds = exs.filter(e => {
        const name = String(e?.name || '').toLowerCase();
        const reps = String(e?.reps || '').toLowerCase();
        return (/shadow|bag|heavy bag|pad|circuit|boxing|sacco/i.test(name) && 
                !/warm|cool|stretch/i.test(name)) ||
               /\d+\s*min/i.test(reps);
      });
      
      let totalBoxingRounds = 0;
      boxingRounds.forEach(e => {
        const sets = parseInt(e.sets, 10) || 0;
        const reps = String(e.reps || '').toLowerCase();
        if (/min/i.test(reps)) {
          totalBoxingRounds += sets;
        }
      });
      
      if (totalBoxingRounds > 9) {
        issues.push(`❌ Boxe: troppi round di conditioning (${totalBoxingRounds}). Max 6-8 round per sessione per evitare sovrallenamento.`);
      } else if (totalBoxingRounds > 6) {
        warnings.push(`⚠️ Boxe: ${totalBoxingRounds} round di conditioning è al limite. Considera qualità vs quantità.`);
      }
      
      // 5. RECUPERI FORZA (min 120s per compound)
      const strengthExs = exs.filter(e => String(e?.type || '').toLowerCase() === 'strength');
      const shortRestStrength = strengthExs.filter(e => {
        const rest = parseInt(String(e?.rest || '0').replace(/\D/g, ''), 10) || 0;
        const name = String(e?.name || '').toLowerCase();
        // Escludi superset dove rest=0 è intenzionale (A1/A2)
        if (/^a[12]:/i.test(name) && rest < 60) return false;
        return rest > 0 && rest < 90;
      });
      
      if (shortRestStrength.length > 0) {
        warnings.push(`⚠️ Boxe: recuperi troppo corti per esercizi di forza. Compound = 120-180s, non ${shortRestStrength[0].rest}s.`);
      }
      
      // 6. VARIETÀ TRA SESSIONI (se c'è pattern ripetitivo)
      const conditioningNames = exs
        .filter(e => /shadow|bag|circuit|round/i.test(String(e?.name || '')))
        .map(e => String(e?.name || '').toLowerCase().substring(0, 20));
      const uniqueConditioning = new Set(conditioningNames);
      if (conditioningNames.length >= 3 && uniqueConditioning.size < 2) {
        warnings.push('⚠️ Boxe: poca varietà nel conditioning. Varia gli stimoli (potenza vs tecnica vs endurance).');
      }
      
      // 7. ORIGINAL RULES (manteniamo)
      const hasBoxingBlock = hasAny(exs, /(heavy bag|bag|shadow|pad|slip|footwork|sparring|rope)/i);
      if (!hasBoxingBlock) {
        issues.push('❌ Boxe: manca un blocco boxing-specific (bag/shadow/pads/footwork).');
      }
      const hasPrehab = hasAny(exs, /(face pull|pull-apart|external rotation|rotator|neck|wrist|scap|serratus|y-?t-?w)/i);
      if (!hasPrehab) {
        warnings.push('⚠️ Boxe: aggiungi 1 prehab spalla/polso/collo (3x15) per prevenzione infortuni.');
      }
      const hasRoundWork = hasRoundBasedWork(exs);
      if (!hasRoundWork) {
        warnings.push('⚠️ Boxe: manca un lavoro chiaramente round-based (es. 4-6x3min).');
      }
      if (phase === 'deload' && hasAny(exs, /(deadlift|back squat)/i) && getTotalSets(exs) > 30) {
        issues.push('❌ Boxe deload: riduci compound pesanti o sets totali.');
      }
      
      // 8. COOL-DOWN SPECIFICO
      const hasCooldown = hasAny(exs, /cool|stretch|recovery|foam roll/i);
      if (!hasCooldown) {
        warnings.push('⚠️ Boxe: aggiungi cool-down (5min walk + stretching statico quads, hamstrings, hip flexors, spalle).');
      }
    }

    if (sport === 'calcio') {
      const hasSpeed = hasAny(exs, /(sprint|acceleration|flying sprint|agility|5-10-5|t-test|change of direction|cod|ladder|speed ladder|shuttle)/i);
      if (!hasSpeed) issues.push('❌ Calcio: manca speed/COD (sprint, accelerazioni, agility).');

      const hasHamstring = hasAny(exs, /(nordic|rdl|romanian deadlift|hamstring|hip hinge)/i);
      const hasAdductor = hasAny(exs, /(copenhagen|adductor|groin|pubalgia)/i);
      if (!hasHamstring && !hasAdductor) {
        warnings.push('⚠️ Calcio: aggiungi hamstring/adductor prevention (Nordic o Copenhagen).');
      }

      if (phase === 'intensificazione' && getTotalSets(exs) > 55) {
        issues.push('❌ Calcio intensificazione: volume eccessivo, rischia interferenza con performance.');
      }
    }

    if (sport === 'basket') {
      const hasJump = hasAny(exs, /(jump|depth jump|box jump|approach jump|plyo|rim touch|landing)/i);
      if (!hasJump) warnings.push('⚠️ Basket: inserisci 1 blocco jump/landing/power.');

      const hasLateral = hasAny(exs, /(lateral|defensive slides|close-out|lane agility|shuffle|cod)/i);
      if (!hasLateral) issues.push('❌ Basket: manca lateral movement/COD.');

      const hasAnkle = hasAny(exs, /(ankle|calf|tibialis|balance|proprioception)/i);
      if (!hasAnkle) warnings.push('⚠️ Basket: aggiungi 1 micro-dose caviglia/propriocezione.');
    }

    if (sport === 'palestra') {
      const hasMain = hasAny(exs, /(squat|deadlift|bench|row|pull-?up|overhead press|leg press)/i);
      if (!hasMain) issues.push('❌ Palestra: manca un main lift chiaro (compound).');

      const tooManyIsolations = exs.filter((e) => /curl|pushdown|fly|extension|raise/i.test(String(e?.name || ''))).length;
      if (exs.length >= 6 && tooManyIsolations >= Math.ceil(exs.length * 0.6)) {
        warnings.push('⚠️ Palestra: troppi isolamenti vs compound, qualità coach-like scende.');
      }
    }

    return { issues, warnings, suggestions };
  }

  function scoreWorkout(workout, context = {}) {
    const base = getIssuesBase(workout, context);
    const sport = getSportIssues(workout, context);
    const season = getTeamSeasonIssues(workout, context);
    const matchDay = getMatchDayIssues(workout, context);

    const issues = [...toTextList(base.issues), ...toTextList(sport.issues), ...toTextList(season.issues), ...toTextList(matchDay.issues)];
    const warnings = [...toTextList(base.warnings), ...toTextList(sport.warnings), ...toTextList(season.warnings), ...toTextList(matchDay.warnings)];
    const suggestions = [...toTextList(base.suggestions), ...toTextList(sport.suggestions), ...toTextList(season.suggestions), ...toTextList(matchDay.suggestions)];

    // Simple deterministic score: start at 100
    let score = 100;
    score -= issues.filter((x) => x.startsWith('❌')).length * 12;
    score -= warnings.filter((x) => x.startsWith('⚠️')).length * 4;
    score = Math.max(0, Math.min(100, score));

    const rating = score >= 90 ? '🏆 coach-like' : score >= 75 ? '✅ buono' : score >= 60 ? '⚠️ borderline' : '❌ da sistemare';

    const criticalIssues = issues.filter((x) => x.startsWith('❌'));

    return { score, rating, issues, warnings, suggestions, criticalIssues };
  }

  function scoreWeek(workouts, context = {}) {
    const ws = Array.isArray(workouts) ? workouts : [];
    const results = ws.map((w) => ({
      day: w?.day_of_week,
      name: w?.name,
      ...scoreWorkout(w, context)
    }));

    const avg = results.length ? results.reduce((s, r) => s + r.score, 0) / results.length : 0;
    const critical = results.flatMap((r) => r.criticalIssues);

    return {
      averageScore: Math.round(avg),
      overallRating: avg >= 85 ? '✅ settimana coach-like' : avg >= 70 ? '⚠️ settimana da rifinire' : '❌ settimana non affidabile',
      criticalCount: critical.length,
      results
    };
  }

  console.log(`🧪 CoachQuality v${VERSION} loaded`);

  return {
    VERSION,
    scoreWorkout,
    scoreWeek
  };
})();
