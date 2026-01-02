/**
 * GR Perform - Coach Playbook (human-coach heuristics)
 *
 * Goal: encode sport-specific coaching constraints in a compact form
 * that can be injected into prompts and used for rule-based checks.
 */

window.CoachPlaybook = (function () {
  'use strict';

  const VERSION = '1.0';

  function normSport(sport) {
    const s = String(sport || '').toLowerCase().trim();
    if (s === 'boxing') return 'boxe';
    if (s === 'football') return 'calcio';
    if (s === 'basketball') return 'basket';
    if (!s) return 'palestra';
    return s;
  }

  function normPhase(phase) {
    const p = String(phase || '').toLowerCase().trim();
    // UI uses Italian labels in many places
    if (p.includes('adatt')) return 'adattamento';
    if (p.includes('accum')) return 'accumulo';
    if (p.includes('intens')) return 'intensificazione';
    if (p.includes('peak')) return 'peaking';
    if (p.includes('deload') || p.includes('scarico')) return 'deload';
    // Sport periodization engine phases
    if (p === 'gpp' || p.includes('general')) return 'gpp';
    if (p.includes('forza_base') || (p.includes('forza') && p.includes('base'))) return 'forza_base';
    if (p.includes('potenza') || p.includes('power')) return 'potenza';
    if (p.includes('specifico') || p.includes('sport-specific') || p.includes('specific')) return 'specifico';
    if (p.includes('taper')) return 'taper';
    if (p.includes('recovery') || p.includes('recupero')) return 'recovery';
    return p || 'accumulo';
  }

  function normSeasonPhase(seasonPhase) {
    const s = String(seasonPhase || '').toLowerCase().trim();
    if (!s) return '';
    if (s.includes('pre') && s.includes('season')) return 'pre_season';
    if (s.includes('preseason')) return 'pre_season';
    if ((s.includes('in') && s.includes('season')) || s.includes('competition') || s.includes('competizione')) return 'in_season';
    if (s.includes('post') && s.includes('season')) return 'post_season';
    if (s.includes('off') && s.includes('season')) return 'off_season';
    if (s === 'pre_season' || s === 'in_season' || s === 'post_season' || s === 'off_season') return s;
    return s;
  }

  function normMatchDayType(matchDayType) {
    const s = String(matchDayType || '').toLowerCase().trim();
    if (!s) return '';
    if (s === 'md-1' || s === 'md-2' || s === 'md-3' || s === 'md0' || s === 'md+1' || s === 'md+2' || s === 'md+3') return s;
    if (s.includes('md') && s.includes('-1')) return 'md-1';
    if (s.includes('md') && s.includes('+1')) return 'md+1';
    if (s.includes('match') && (s.includes('day') || s.includes('giorno')) && (s.includes('0') || s.includes('oggi'))) return 'md0';
    return s;
  }

  const PLAYBOOK = {
    boxe: {
      name: 'Boxe / Combat',
      mustHave: [
        'Almeno 1 blocco boxing specific (bag/shadow/pads/defense/footwork)',
        'Round-based coerenti (sets = rounds, reps = durata round)',
        'Prehab spalle/polsi/collo o scapole (min 1)'
      ],
      avoid: [
        'Troppa forza pesante su lombare in settimane ad alta fatica',
        'Circuiti vaghi senza dettagli (no "Boxing Circuit" generico)'
      ],
      cues: [
        'Qualità tecnica > volume caotico',
        'Alterna power / speed-technique / conditioning nella settimana',
        'Rest realistici tra round (tipico 60s)'
      ]
    },
    calcio: {
      name: 'Calcio / Team sport',
      mustHave: [
        'Almeno 1 componente speed/COD (sprint, accelerazioni, agility)',
        'Almeno 1 componente hamstring/groin prevention (Nordic/RDL/adductor)',
        'Lower body power presente almeno 1 volta/settimana'
      ],
      avoid: [
        'Volume gambe eccessivo se readiness/sonno bassi',
        'Eccentrici massacranti senza recuperi adeguati'
      ],
      cues: [
        'Qualità e recupero pieno su speed/power',
        'RSA/conditioning specifica senza distruggere il giorno dopo'
      ]
    },
    basket: {
      name: 'Basket / Court sport',
      mustHave: [
        'Almeno 1 componente jump/landing o power (plyo, trap bar, jumps)',
        'Almeno 1 componente lateral movement (slides/COD)',
        'Prehab caviglia/ginocchio/core (min 1)'
      ],
      avoid: [
        'Solo forza bilanciere senza transfer (manca court specificity)',
        'Troppe jump ad alto impatto + volume alto nello stesso giorno'
      ],
      cues: [
        'Lavoro elastico/reattivo dosato, qualità alta',
        'Caviglie e landing mechanics sempre presenti in micro-dose'
      ]
    },
    palestra: {
      name: 'Palestra / Strength-Hypertrophy',
      mustHave: [
        'Split coerente (push/pull/legs o full body), ordine logico',
        'Progressione coerente con fase (volume/intensità)',
        'Varietà pattern (squat/hinge/push/pull/carry/core)'
      ],
      avoid: [
        'Solo isolation senza main lift',
        'Rest incoerenti (strength con rest troppo bassi)'
      ],
      cues: [
        'Main lift prima, poi accessori',
        'Sets/reps realistici e coerenti con obiettivo'
      ]
    }
  };

  function getProfile(sport) {
    const key = normSport(sport);
    return PLAYBOOK[key] || PLAYBOOK.palestra;
  }

  function buildPromptSnippet({ sport, phase, seasonPhase, matchDayType, matchDay0Mode, dayNumber, microPeriod }) {
    const profile = getProfile(sport);
    const p = normPhase(phase);
    const sp = normSeasonPhase(seasonPhase);
    const md = normMatchDayType(matchDayType);
    const md0Mode = String(matchDay0Mode || '').toLowerCase().trim();

    // Keep it compact: this is injected into prompts.
    const micro = microPeriod?.intensity ? `${microPeriod.intensity} (RPE ${microPeriod.rpeRange || 'n/a'})` : '';

    const must = profile.mustHave.slice(0, 3).map((x) => `- ${x}`).join('\n');
    const avoid = profile.avoid.slice(0, 2).map((x) => `- ${x}`).join('\n');
    const cues = profile.cues.slice(0, 3).map((x) => `- ${x}`).join('\n');

    const matchRules = (() => {
      if (!md) return '';
      if (md === 'md0') {
        if (md0Mode === 'primer') {
          return [
            `MATCH-DAY: ${md}`,
            '- Modalità: MICRO-PRIMER 10–15 min (mobilità/attivazione) senza fatica.',
            '- Vietati: DOMS, plyo ad alto impatto, lower heavy, HIIT, volume alto.'
          ].join('\n');
        }
        return [
          `MATCH-DAY: ${md}`,
          '- Default coach: OFF totale da training extra.',
          '- Se richiesto: micro-primer 10–15 min (mobilità/attivazione) senza fatica.',
          '- Vietati: DOMS, plyo ad alto impatto, lower heavy, HIIT, volume alto.'
        ].join('\n');
      }
      if (md === 'md-1') {
        return [
          `MATCH-DAY: ${md}`,
          '- Priming: basso volume, alta qualità, stop prima della fatica.',
          '- Vietati: eccentrici massacranti (Nordic/Copenhagen), lower heavy + volume, plyo high-impact.'
        ].join('\n');
      }
      if (md === 'md+1') {
        return [
          `MATCH-DAY: ${md}`,
          '- Recovery: mobilità, zone2 easy, reset (no impatto alto).',
          '- Vietati: lower heavy, plyo high-impact, HIIT.'
        ].join('\n');
      }
      return `MATCH-DAY: ${md} (applica cautela volume/DOMS)`;
    })();

    return [
      `COACH PLAYBOOK (${profile.name})${dayNumber ? ` — Day ${dayNumber}` : ''}${micro ? ` — Micro: ${micro}` : ''}`,
      `Phase: ${p}${sp ? ` | Season: ${sp}` : ''}${md ? ` | ${md}` : ''}`,
      matchRules,
      'MUST-HAVE:',
      must,
      'AVOID:',
      avoid,
      'COACH CUES:',
      cues
    ].filter(Boolean).join('\n');
  }

  console.log(`🧠 CoachPlaybook v${VERSION} loaded`);

  return {
    VERSION,
    getProfile,
    buildPromptSnippet,
    _normSport: normSport,
    _normPhase: normPhase,
    _normSeasonPhase: normSeasonPhase,
    _normMatchDayType: normMatchDayType
  };
})();
