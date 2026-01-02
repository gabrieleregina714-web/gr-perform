/**
 * GR Perform - Workout Intelligence Engine
 * Sistema intelligente per validazione e ottimizzazione workout
 * 
 * Non valida su regole stupide (es. "minimo 5 esercizi")
 * Ma su metriche reali: volume, durata, intensità, varietà
 */

window.WorkoutIntelligence = (function() {
    'use strict';

    const VERSION = '1.0';

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURAZIONE INTELLIGENTE
    // ═══════════════════════════════════════════════════════════════
    
    // Tempi medi per calcolo durata (in secondi)
    const TIME_ESTIMATES = {
        // Tempo per set in base al tipo
        setDuration: {
            strength: 45,      // Set pesante con preparazione
            hypertrophy: 35,   // Set medio
            conditioning: 60,  // Circuit/cardio
            warmup: 30,
            cooldown: 30
        },
        // Rest tipici per tipo (se non specificato)
        defaultRest: {
            strength: 120,     // 2 min
            hypertrophy: 75,   // 75s
            conditioning: 45,  // 45s
            warmup: 30,
            cooldown: 0
        },
        // Overhead (transizioni, setup)
        transitionTime: 30,    // 30s tra esercizi
        warmupBase: 300,       // 5 min warmup base
        cooldownBase: 300      // 5 min cooldown base
    };

    // Range accettabili per fase
    const PHASE_PARAMETERS = {
        adattamento: {
            volumeRange: { min: 15, max: 40 },     // Sets totali - ridotto per principianti
            intensityRange: { min: 50, max: 65 },   // % 1RM
            rpeRange: { min: 5, max: 7 },
            restRange: { min: 60, max: 120 },       // Secondi
            durationRange: { min: 35, max: 55 }     // Minuti - più flessibile
        },
        accumulo: {
            volumeRange: { min: 25, max: 60 },
            intensityRange: { min: 65, max: 80 },
            rpeRange: { min: 6, max: 8 },
            restRange: { min: 60, max: 150 },
            durationRange: { min: 45, max: 70 }
        },
        intensificazione: {
            volumeRange: { min: 20, max: 45 },
            intensityRange: { min: 80, max: 95 },
            rpeRange: { min: 7, max: 9 },
            restRange: { min: 120, max: 240 },
            durationRange: { min: 45, max: 75 }
        },
        deload: {
            volumeRange: { min: 10, max: 25 },
            intensityRange: { min: 50, max: 65 },
            rpeRange: { min: 4, max: 6 },
            restRange: { min: 60, max: 90 },
            durationRange: { min: 25, max: 40 }
        },
        peaking: {
            volumeRange: { min: 12, max: 30 },
            intensityRange: { min: 90, max: 100 },
            rpeRange: { min: 8, max: 10 },
            restRange: { min: 180, max: 300 },
            durationRange: { min: 40, max: 60 }
        }
    };

    // Varietà recuperi per metodologie
    const REST_VARIETY = {
        superset: [0, 30],           // No rest tra esercizi, 30-60s tra set
        dropset: [10, 20],           // Minimo rest
        cluster: [15, 30],           // Intra-set rest
        emom: [0],                   // Rest = tempo rimanente
        tabata: [10],                // 10s fissi
        circuit: [15, 30, 45],       // Variabile
        strength: [120, 150, 180, 240], // 2-4 min
        hypertrophy: [45, 60, 75, 90],  // 45s-90s
        power: [180, 240, 300],      // 3-5 min
        endurance: [30, 45, 60]      // 30-60s
    };

    // ═══════════════════════════════════════════════════════════════
    // CALCOLO METRICHE WORKOUT
    // ═══════════════════════════════════════════════════════════════

    function parseReps(repsStr) {
        const s = String(repsStr || '').toLowerCase();
        
        // "8-10" -> media 9
        const rangeMatch = s.match(/(\d+)\s*[-–]\s*(\d+)/);
        if (rangeMatch) {
            return (parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2;
        }
        
        // "5 min" -> converti in "reps equivalenti" (1 rep = 3 sec per conditioning)
        const minMatch = s.match(/(\d+)\s*min/);
        if (minMatch) {
            return parseInt(minMatch[1]) * 20; // 1 min = ~20 reps equivalenti
        }
        
        // "30s" -> secondi
        const secMatch = s.match(/(\d+)\s*s(?:ec)?/);
        if (secMatch) {
            return parseInt(secMatch[1]) / 3; // 30s = ~10 reps equivalenti
        }
        
        // Numero semplice
        const numMatch = s.match(/(\d+)/);
        if (numMatch) {
            return parseInt(numMatch[1]);
        }
        
        return 10; // Default
    }

    function parseRest(restStr) {
        const s = String(restStr || '').toLowerCase();
        
        // "90s" o "90sec"
        const secMatch = s.match(/(\d+)\s*s(?:ec)?/);
        if (secMatch) return parseInt(secMatch[1]);
        
        // "2min" o "2 min"
        const minMatch = s.match(/(\d+)\s*min/);
        if (minMatch) return parseInt(minMatch[1]) * 60;
        
        // "1:30" formato
        const colonMatch = s.match(/(\d+):(\d+)/);
        if (colonMatch) {
            return parseInt(colonMatch[1]) * 60 + parseInt(colonMatch[2]);
        }
        
        // Numero semplice (assumiamo secondi)
        const numMatch = s.match(/(\d+)/);
        if (numMatch) return parseInt(numMatch[1]);
        
        return 90; // Default
    }

    function calculateWorkoutMetrics(workout) {
        const exercises = Array.isArray(workout?.exercises) ? workout.exercises : [];
        
        let totalSets = 0;
        let totalReps = 0;
        let totalVolume = 0;  // Sets * Reps (load-agnostic volume)
        let estimatedDuration = 0;
        let restTimes = [];
        let intensities = [];
        let methodsUsed = new Set();
        
        for (const ex of exercises) {
            const sets = parseInt(ex.sets) || 1;
            const reps = parseReps(ex.reps);
            const rest = parseRest(ex.rest);
            const type = String(ex.type || 'hypertrophy').toLowerCase();
            const name = String(ex.name || '').toLowerCase();
            const repsStr = String(ex.reps || '').toLowerCase();
            
            totalSets += sets;
            totalReps += sets * reps;
            totalVolume += sets * reps;
            
            // Calcola durata - con supporto per round-based exercises
            let setTime = TIME_ESTIMATES.setDuration[type] || 40;
            
            // Se reps contiene "min" (es. "2 min", "3min"), usa il tempo esatto
            const minMatch = repsStr.match(/(\d+)\s*min/);
            if (minMatch) {
                setTime = parseInt(minMatch[1]) * 60; // Converti minuti in secondi
            }
            
            // Se reps contiene "sec" o "s" (es. "30s", "45sec")
            const secMatch = repsStr.match(/(\d+)\s*s(?:ec)?$/);
            if (secMatch && !repsStr.includes('set')) {
                setTime = parseInt(secMatch[1]);
            }
            
            const restTime = rest || TIME_ESTIMATES.defaultRest[type] || 60;
            const exerciseTime = (sets * setTime) + ((sets - 1) * restTime) + TIME_ESTIMATES.transitionTime;
            estimatedDuration += exerciseTime;
            
            restTimes.push(restTime);
            
            // Estrai RPE/intensità se presente
            const rpeMatch = String(ex.reps || '').match(/rpe\s*(\d+)/i);
            if (rpeMatch) intensities.push(parseInt(rpeMatch[1]));
            
            // Rileva metodologie
            if (/superset|a1.*a2|b1.*b2/i.test(name)) methodsUsed.add('superset');
            if (/drop\s*set/i.test(name)) methodsUsed.add('dropset');
            if (/emom/i.test(name)) methodsUsed.add('emom');
            if (/circuit/i.test(name)) methodsUsed.add('circuit');
            if (/cluster/i.test(name)) methodsUsed.add('cluster');
            if (/tempo\s*\d/i.test(name) || /tempo\s*\d/i.test(ex.reps)) methodsUsed.add('tempo');
            if (/amrap/i.test(name)) methodsUsed.add('amrap');
            if (/tabata/i.test(name)) methodsUsed.add('tabata');
        }
        
        // Converti in minuti
        estimatedDuration = Math.round(estimatedDuration / 60);
        
        // Calcola varietà rest
        const uniqueRests = new Set(restTimes);
        const restVariety = uniqueRests.size;
        
        // Calcola RPE medio
        const avgRpe = intensities.length > 0 
            ? intensities.reduce((a, b) => a + b, 0) / intensities.length 
            : null;
        
        return {
            exerciseCount: exercises.length,
            totalSets,
            totalReps,
            totalVolume,
            estimatedDurationMinutes: estimatedDuration,
            restVariety,
            restTimes,
            avgRpe,
            methodsUsed: Array.from(methodsUsed),
            hasMethodology: methodsUsed.size > 0
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // VALIDAZIONE INTELLIGENTE
    // ═══════════════════════════════════════════════════════════════

    function validateWorkout(workout, context = {}) {
        const {
            phase = 'accumulo',
            targetDuration = 60,
            athleteLevel = 'intermediate',
            sport = 'general'
        } = context;

        const metrics = calculateWorkoutMetrics(workout);
        const phaseParams = PHASE_PARAMETERS[phase] || PHASE_PARAMETERS.accumulo;
        
        const issues = [];
        const warnings = [];
        const suggestions = [];

        // ═══════════════════════════════════════════════════════════════
        // VALIDAZIONE BASATA SU METRICHE REALI (non conteggi stupidi!)
        // ═══════════════════════════════════════════════════════════════

        // 1. VOLUME TOTALE (non numero esercizi!)
        if (metrics.totalSets < phaseParams.volumeRange.min * 0.5) {
            issues.push(`Volume troppo basso: ${metrics.totalSets} sets (minimo suggerito: ${Math.round(phaseParams.volumeRange.min * 0.7)})`);
        } else if (metrics.totalSets < phaseParams.volumeRange.min) {
            warnings.push(`Volume sotto target: ${metrics.totalSets} sets (target: ${phaseParams.volumeRange.min}-${phaseParams.volumeRange.max})`);
        }
        
        if (metrics.totalSets > phaseParams.volumeRange.max * 1.3) {
            issues.push(`Volume eccessivo: ${metrics.totalSets} sets (max suggerito: ${phaseParams.volumeRange.max})`);
        }

        // 2. DURATA STIMATA vs TARGET
        const durationDiff = Math.abs(metrics.estimatedDurationMinutes - targetDuration);
        const durationTolerance = targetDuration * 0.25; // 25% tolleranza
        
        if (durationDiff > durationTolerance) {
            if (metrics.estimatedDurationMinutes < targetDuration) {
                warnings.push(`Durata stimata (${metrics.estimatedDurationMinutes}min) sotto target (${targetDuration}min)`);
            } else {
                warnings.push(`Durata stimata (${metrics.estimatedDurationMinutes}min) sopra target (${targetDuration}min)`);
            }
        }

        // 3. VARIETÀ RECUPERI
        if (metrics.restVariety === 1 && metrics.exerciseCount > 3) {
            suggestions.push('Considera di variare i tempi di recupero in base al tipo di esercizio');
        }

        // 4. METODOLOGIE
        if (!metrics.hasMethodology && metrics.exerciseCount > 4) {
            suggestions.push('Nessuna metodologia avanzata rilevata (superset, drop set, tempo, etc.)');
        }

        // 5. WARM-UP E COOL-DOWN (suggerimenti, non errori)
        const exercises = workout?.exercises || [];
        const firstEx = String(exercises[0]?.name || '').toLowerCase();
        const lastEx = String(exercises[exercises.length - 1]?.name || '').toLowerCase();
        
        if (exercises.length > 0 && !/warm|mob|prep|activation/i.test(firstEx)) {
            suggestions.push('Considera di aggiungere un warm-up/mobilità all\'inizio');
        }
        
        if (exercises.length > 2 && !/cool|stretch|recovery/i.test(lastEx)) {
            suggestions.push('Considera di aggiungere un cool-down/stretching alla fine');
        }

        // 6. RPE COERENZA CON FASE
        if (metrics.avgRpe !== null) {
            if (metrics.avgRpe < phaseParams.rpeRange.min) {
                warnings.push(`RPE medio (${metrics.avgRpe.toFixed(1)}) sotto range fase ${phase} (${phaseParams.rpeRange.min}-${phaseParams.rpeRange.max})`);
            } else if (metrics.avgRpe > phaseParams.rpeRange.max) {
                warnings.push(`RPE medio (${metrics.avgRpe.toFixed(1)}) sopra range fase ${phase}`);
            }
        }

        return {
            isValid: issues.length === 0,
            metrics,
            issues,
            warnings,
            suggestions,
            phase,
            targetDuration
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // SUGGERIMENTI INTELLIGENTI PER REST/SETS/REPS
    // ═══════════════════════════════════════════════════════════════

    function suggestRestTime(exerciseType, methodology, phase) {
        // Priorità: metodologia > tipo > fase
        if (methodology && REST_VARIETY[methodology]) {
            const options = REST_VARIETY[methodology];
            return options[Math.floor(Math.random() * options.length)];
        }
        
        if (REST_VARIETY[exerciseType]) {
            const options = REST_VARIETY[exerciseType];
            return options[Math.floor(Math.random() * options.length)];
        }
        
        // Default basato su fase
        const phaseParams = PHASE_PARAMETERS[phase] || PHASE_PARAMETERS.accumulo;
        const min = phaseParams.restRange.min;
        const max = phaseParams.restRange.max;
        
        // Arrotonda a 15s
        return Math.round((min + Math.random() * (max - min)) / 15) * 15;
    }

    function suggestSetsReps(goal, phase, methodology) {
        const suggestions = {
            strength: {
                adattamento: { sets: [3, 4], reps: ['6-8', '8-10'] },
                accumulo: { sets: [4, 5], reps: ['5-6', '6-8'] },
                intensificazione: { sets: [5, 6], reps: ['3-5', '4-6'] },
                peaking: { sets: [3, 4, 5], reps: ['1-3', '2-4'] },
                deload: { sets: [2, 3], reps: ['6-8'] }
            },
            hypertrophy: {
                adattamento: { sets: [2, 3], reps: ['10-12', '12-15'] },
                accumulo: { sets: [3, 4], reps: ['8-12', '10-15'] },
                intensificazione: { sets: [3, 4], reps: ['6-10', '8-12'] },
                deload: { sets: [2], reps: ['12-15'] }
            },
            endurance: {
                adattamento: { sets: [2, 3], reps: ['15-20', '20-25'] },
                accumulo: { sets: [3, 4], reps: ['12-15', '15-20'] }
            },
            power: {
                accumulo: { sets: [4, 5], reps: ['3-5', '5-6'] },
                intensificazione: { sets: [5, 6], reps: ['2-3', '3-4'] },
                peaking: { sets: [3, 4], reps: ['1-2', '2-3'] }
            }
        };

        const goalSuggestions = suggestions[goal] || suggestions.hypertrophy;
        const phaseSuggestions = goalSuggestions[phase] || goalSuggestions.accumulo || { sets: [3], reps: ['10'] };
        
        const sets = phaseSuggestions.sets[Math.floor(Math.random() * phaseSuggestions.sets.length)];
        const reps = phaseSuggestions.reps[Math.floor(Math.random() * phaseSuggestions.reps.length)];
        
        return { sets, reps };
    }

    // ═══════════════════════════════════════════════════════════════
    // PROMPT ENHANCEMENT
    // ═══════════════════════════════════════════════════════════════

    function getIntelligentPromptRules(context = {}) {
        const {
            phase = 'accumulo',
            targetDuration = 60,
            athleteLevel = 'intermediate',
            sport = 'general',
            focus = {}
        } = context;

        const phaseParams = PHASE_PARAMETERS[phase] || PHASE_PARAMETERS.accumulo;

        return `
═══════════════════════════════════════════════════════════════
REGOLE INTELLIGENTI (basate su scienza, non numeri arbitrari)
═══════════════════════════════════════════════════════════════

📊 METRICHE TARGET:
- Volume totale: ${phaseParams.volumeRange.min}-${phaseParams.volumeRange.max} sets totali
- Durata sessione: ~${targetDuration} minuti
- RPE target: ${phaseParams.rpeRange.min}-${phaseParams.rpeRange.max}
- Intensità: ${phaseParams.intensityRange.min}-${phaseParams.intensityRange.max}% 1RM

⏱️ VARIETÀ RECUPERI (NON sempre 90s!):
- Forza/Power: ${REST_VARIETY.strength.join('s, ')}s
- Ipertrofia: ${REST_VARIETY.hypertrophy.join('s, ')}s  
- Conditioning: ${REST_VARIETY.endurance.join('s, ')}s
- Superset: ${REST_VARIETY.superset.join('s, ')}s tra esercizi
- Circuit: ${REST_VARIETY.circuit.join('s, ')}s tra stazioni

🎯 SETS/REPS INTELLIGENTI per fase "${phase}":
- Forza principale: 4-6 sets x 3-6 reps @ RPE ${phaseParams.rpeRange.max - 1}-${phaseParams.rpeRange.max}
- Accessori: 3-4 sets x 8-12 reps @ RPE ${phaseParams.rpeRange.min}-${phaseParams.rpeRange.min + 1}
- Conditioning: 2-4 sets x tempo/circuito

🔬 METODOLOGIE (usa ALMENO 1-2 per sessione):
- Superset antagonisti: A1/A2 con 0s rest tra, 60-90s dopo coppia
- Drop set: peso principale + 2 drop (-20% ciascuno)
- Tempo training: 3-1-2-0 (eccentric-pause-concentric-pause)
- Cluster sets: 5x2 con 15-20s intra-set rest
- EMOM: precisare ESATTAMENTE gli esercizi e rep

⚠️ EVITA:
- Sempre lo stesso rest (es. tutti 90s)
- Sempre le stesse serie (es. tutti 3 sets)
- Nomi generici senza dettagli
- Volume eccessivo per ${athleteLevel}

✅ ESEMPIO BUONO:
{
  "name": "A1: Bench Press (superset con A2)",
  "sets": 4,
  "reps": "6-8 @ RPE 7",
  "rest": "0s (poi 90s dopo A2)",
  "type": "strength"
}
`;
    }

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════

    console.log(`🧠 WorkoutIntelligence v${VERSION} loaded`);

    return {
        VERSION,
        
        // Metriche
        calculateMetrics: calculateWorkoutMetrics,
        
        // Validazione intelligente
        validate: validateWorkout,
        
        // Suggerimenti
        suggestRest: suggestRestTime,
        suggestSetsReps: suggestSetsReps,
        
        // Prompt rules
        getPromptRules: getIntelligentPromptRules,
        
        // Costanti esportate
        PHASE_PARAMETERS,
        REST_VARIETY,
        TIME_ESTIMATES
    };
})();
