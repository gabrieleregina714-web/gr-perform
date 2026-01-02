/**
 * GR Perform - Boxing Rules Engine v1.0
 * 
 * Vincoli NON NEGOZIABILI per la generazione workout boxe.
 * Basato su feedback di coach esperti.
 */

window.BoxingRules = (function() {
    'use strict';
    
    const VERSION = '1.0';
    
    // ═══════════════════════════════════════════════════════════════
    // VINCOLI HARD - Non possono essere violati
    // ═══════════════════════════════════════════════════════════════
    
    const HARD_CONSTRAINTS = {
        // Ordine sessione OBBLIGATORIO
        sessionOrder: [
            'warmup',      // 10-15 min, MAI meno
            'technical',   // SE è il focus della sessione
            'strength',    // Quando CNS è fresco
            'conditioning', // Dopo la forza
            'accessories', // Core, collo, prehab
            'cooldown'     // Sempre presente
        ],
        
        // Recuperi MINIMI per tipo di lavoro (in secondi)
        minRestByType: {
            maxStrength: 150,      // 1-5 rep: minimo 2.5-3 min (150-180s)
            strengthHypertrophy: 120, // 6-8 rep: minimo 2 min
            hypertrophy: 90,       // 8-12 rep: minimo 90s
            conditioning: 60,      // Tra round: 60s (simula ring)
            accessory: 60,         // Accessori: 60s
            prehab: 30             // Prehab/collo: 30-60s
        },
        
        // Volume MASSIMO per sessione
        maxVolume: {
            boxingRounds: 10,      // Shadow + sacco + pads + sparring
            strengthExercises: 5,  // Esercizi di forza
            sessionMinutes: 90,    // Oltre questo la qualità crolla
            setsPerMuscleGroup: 12 // Per evitare junk volume
        },
        
        // Volume MINIMO per qualità
        minVolume: {
            warmupMinutes: 10,     // Mai sotto 10 min
            cooldownMinutes: 5     // Mai sotto 5 min
        },
        
        // Protocollo FISSO collo
        neckProtocol: {
            sets: 3,
            reps: '15-20',
            directions: ['flessione', 'estensione', 'laterale'],
            rest: 30,
            position: 'end',  // Sempre alla fine
            forbidden: ['rounds', 'minuti', 'time-based']
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // ERRORI BLOCCANTI - Il sistema NON può generare questi
    // ═══════════════════════════════════════════════════════════════
    
    const BLOCKING_ERRORS = [
        {
            id: 'strength_after_conditioning',
            check: (workout) => {
                const exs = workout?.exercises || [];
                let lastConditioningIdx = -1;
                let firstStrengthAfterIdx = -1;
                
                exs.forEach((e, idx) => {
                    const type = String(e?.type || '').toLowerCase();
                    const name = String(e?.name || '').toLowerCase();
                    
                    // Conditioning intenso (non warm-up)
                    if ((type === 'conditioning' || /shadow|bag|heavy bag|circuit|round|sacco/i.test(name)) &&
                        !/warm|activation|dynamic/i.test(name)) {
                        lastConditioningIdx = idx;
                    }
                    
                    // Forza dopo conditioning
                    if (type === 'strength' && lastConditioningIdx > -1 && idx > lastConditioningIdx) {
                        if (firstStrengthAfterIdx === -1) firstStrengthAfterIdx = idx;
                    }
                });
                
                return firstStrengthAfterIdx > -1;
            },
            message: '❌ BLOCCANTE: Forza dopo conditioning intenso. La forza va SEMPRE prima.',
            fix: 'Riordina: Warm-up → Forza → Conditioning → Accessori → Cool-down'
        },
        {
            id: 'too_much_lower_heavy',
            check: (workout) => {
                const exs = workout?.exercises || [];
                const heavyLower = exs.filter(e => {
                    const name = String(e?.name || '').toLowerCase();
                    const sets = parseInt(e?.sets, 10) || 0;
                    return /squat|deadlift|leg press|lunge/i.test(name) && sets >= 3;
                });
                
                // Squat pesante + Deadlift pesante + altro = troppo
                const hasHeavySquat = heavyLower.some(e => /squat/i.test(e.name));
                const hasHeavyDeadlift = heavyLower.some(e => /deadlift/i.test(e.name));
                const hasOtherHeavy = heavyLower.some(e => !/squat|deadlift/i.test(e.name));
                
                return hasHeavySquat && hasHeavyDeadlift && hasOtherHeavy;
            },
            message: '❌ BLOCCANTE: Squat pesante + Deadlift pesante + altro lower pesante nella stessa sessione.',
            fix: 'Scegli UNO tra squat o deadlift come main, riduci il resto.'
        },
        {
            id: 'too_many_boxing_rounds',
            check: (workout) => {
                const exs = workout?.exercises || [];
                let totalRounds = 0;
                
                exs.forEach(e => {
                    const name = String(e?.name || '').toLowerCase();
                    const sets = parseInt(e?.sets, 10) || 0;
                    const reps = String(e?.reps || '').toLowerCase();
                    
                    if (/shadow|bag|heavy bag|circuit|sacco|pad|round/i.test(name) && 
                        !/warm|cool/i.test(name) &&
                        /min/i.test(reps)) {
                        totalRounds += sets;
                    }
                });
                
                return totalRounds > 12;
            },
            message: '❌ BLOCCANTE: Più di 12 round di lavoro boxistico in una sessione.',
            fix: 'Riduci a max 10-12 round totali (shadow + sacco + pads + circuit).'
        },
        {
            id: 'neck_time_based',
            check: (workout) => {
                const exs = workout?.exercises || [];
                return exs.some(e => {
                    const name = String(e?.name || '').toLowerCase();
                    const reps = String(e?.reps || '').toLowerCase();
                    return /neck|collo/i.test(name) && /min/i.test(reps);
                });
            },
            message: '❌ BLOCCANTE: Collo con round a tempo. Il collo si allena con REP, non minuti.',
            fix: 'Usa 3x15-20 rep per direzione (flessione, estensione, laterale). Rest 30-60s.'
        },
        {
            id: 'short_rest_max_strength',
            check: (workout) => {
                const exs = workout?.exercises || [];
                return exs.some(e => {
                    const type = String(e?.type || '').toLowerCase();
                    const reps = parseInt(String(e?.reps || '').replace(/\D/g, ''), 10) || 0;
                    const rest = parseInt(String(e?.rest || '0').replace(/\D/g, ''), 10) || 0;
                    const name = String(e?.name || '').toLowerCase();
                    
                    // Forza massimale (1-5 rep) con rest < 120s
                    const isMaxStrength = type === 'strength' && reps >= 1 && reps <= 5;
                    const isCompound = /squat|deadlift|bench|press|row|pull/i.test(name);
                    const hasShortRest = rest > 0 && rest < 120;
                    
                    // Escludi superset intenzionali (A1/A2 con rest=0)
                    if (/^a[12]:/i.test(name) && rest === 0) return false;
                    
                    return isMaxStrength && isCompound && hasShortRest;
                });
            },
            message: '❌ BLOCCANTE: Recuperi sotto i 2 minuti per lavoro di forza massimale.',
            fix: 'Forza 1-5 rep richiede 2.5-3 minuti di recupero. Aumenta i rest.'
        },
        {
            id: 'no_warmup',
            check: (workout) => {
                const exs = workout?.exercises || [];
                if (exs.length === 0) return false;
                
                const firstEx = exs[0];
                const name = String(firstEx?.name || '').toLowerCase();
                return !/warm|activation|mobility|dynamic|prep/i.test(name);
            },
            message: '❌ BLOCCANTE: Sessione senza warm-up adeguato.',
            fix: 'Inizia con 10-15 min di warm-up: mobilità dinamica + attivazione + shadow leggero.'
        },
        {
            id: 'short_warmup',
            check: (workout) => {
                const exs = workout?.exercises || [];
                const warmup = exs.find(e => /warm|activation|mobility|dynamic/i.test(String(e?.name || '')));
                if (!warmup) return true;
                
                const reps = String(warmup.reps || '').toLowerCase();
                const minutes = parseInt(reps.match(/(\d+)/)?.[1] || '0', 10);
                const sets = parseInt(warmup.sets, 10) || 1;
                
                // Stima: se ha minuti nelle reps, usa quello. Altrimenti stima 2 min per set.
                const estimatedTime = /min/i.test(reps) ? minutes : sets * 2;
                
                return estimatedTime < 8;
            },
            message: '❌ BLOCCANTE: Warm-up sotto i 10 minuti.',
            fix: 'Il warm-up deve essere 10-15 minuti: mobilità dinamica completa, attivazione, shadow leggero 2x2min.'
        },
        {
            id: 'triple_conditioning_overload',
            check: (workout) => {
                const exs = workout?.exercises || [];
                const conditioningBlocks = exs.filter(e => {
                    const name = String(e?.name || '').toLowerCase();
                    return (/heavy bag.*interval|boxing circuit|shadow.*drill|sacco/i.test(name)) &&
                           !/warm|cool/i.test(name);
                });
                
                return conditioningBlocks.length >= 3;
            },
            message: '❌ BLOCCANTE: Heavy bag intervals + boxing circuit + shadow intenso nella stessa sessione.',
            fix: 'Scegli MAX 2 blocchi di conditioning specifico per sessione. Qualità > quantità.'
        },
        {
            id: 'too_many_exercises',
            check: (workout) => {
                const exs = workout?.exercises || [];
                // Escludi warm-up e cool-down dal conteggio
                const mainExercises = exs.filter(e => {
                    const name = String(e?.name || '').toLowerCase();
                    return !/warm|cool|stretch|mobility|activation/i.test(name);
                });
                return mainExercises.length > 10;
            },
            message: '❌ BLOCCANTE: Più di 10 esercizi (esclusi warm-up/cool-down).',
            fix: 'Riduci a max 10 esercizi principali. Qualità > quantità.'
        },
        {
            id: 'session_too_long',
            check: (workout) => {
                const duration = workout?.estimated_duration_minutes || workout?.estimatedDuration || 0;
                return duration > 90;
            },
            message: '❌ BLOCCANTE: Sessione oltre 90 minuti.',
            fix: 'Riduci volume. Sessione ideale: 60-75 min, max 90 min.'
        },
        {
            id: 'pattern_overload_squat',
            check: (workout) => {
                const exs = workout?.exercises || [];
                const squatExercises = exs.filter(e => {
                    const name = String(e?.name || '').toLowerCase();
                    return /squat|goblet|front squat|back squat|box squat/i.test(name) &&
                           !/jump squat/i.test(name); // Jump squat è conditioning, non squat pattern
                });
                return squatExercises.length > 2;
            },
            message: '❌ BLOCCANTE: Più di 2 esercizi pattern squat nella stessa sessione.',
            fix: 'Max 2 esercizi squat: 1 main (back/front squat) + 1 accessorio (goblet/split).'
        },
        {
            id: 'pattern_overload_hinge',
            check: (workout) => {
                const exs = workout?.exercises || [];
                const hingeExercises = exs.filter(e => {
                    const name = String(e?.name || '').toLowerCase();
                    return /deadlift|rdl|romanian|hip thrust|good morning|swing/i.test(name);
                });
                return hingeExercises.length > 2;
            },
            message: '❌ BLOCCANTE: Più di 2 esercizi pattern hip hinge nella stessa sessione.',
            fix: 'Max 2 esercizi hinge: 1 main (deadlift) + 1 accessorio (RDL/hip thrust).'
        },
        {
            id: 'forbidden_combo_squat_deadlift_heavy',
            check: (workout) => {
                const exs = workout?.exercises || [];
                
                // Trova squat pesante (sets >= 3, reps <= 6)
                const heavySquat = exs.find(e => {
                    const name = String(e?.name || '').toLowerCase();
                    const sets = parseInt(e?.sets, 10) || 0;
                    const reps = parseInt(String(e?.reps || '').replace(/\D/g, ''), 10) || 10;
                    return /back squat|front squat/i.test(name) && sets >= 3 && reps <= 6;
                });
                
                // Trova deadlift pesante
                const heavyDeadlift = exs.find(e => {
                    const name = String(e?.name || '').toLowerCase();
                    const sets = parseInt(e?.sets, 10) || 0;
                    const reps = parseInt(String(e?.reps || '').replace(/\D/g, ''), 10) || 10;
                    return /deadlift/i.test(name) && !/romanian|rdl/i.test(name) && sets >= 3 && reps <= 6;
                });
                
                return heavySquat && heavyDeadlift;
            },
            message: '❌ BLOCCANTE: Back/Front Squat pesante + Deadlift pesante nella stessa sessione.',
            fix: 'Scegli UNO come main lift. L\'altro giorno fai l\'altro, o usa versione leggera (RDL).'
        },
        {
            id: 'forbidden_combo_front_back_squat',
            check: (workout) => {
                const exs = workout?.exercises || [];
                const hasBackSquat = exs.some(e => /back squat/i.test(String(e?.name || '')));
                const hasFrontSquat = exs.some(e => /front squat/i.test(String(e?.name || '')));
                return hasBackSquat && hasFrontSquat;
            },
            message: '❌ BLOCCANTE: Back Squat + Front Squat nella stessa sessione.',
            fix: 'Scegli UNO. Troppo overlap per quadricipiti e core.'
        },
        {
            id: 'box_jump_time_based',
            check: (workout) => {
                const exs = workout?.exercises || [];
                return exs.some(e => {
                    const name = String(e?.name || '').toLowerCase();
                    const reps = String(e?.reps || '').toLowerCase();
                    return /box jump/i.test(name) && /min/i.test(reps);
                });
            },
            message: '❌ BLOCCANTE: Box Jump a tempo. I box jump sono esplosivi, MAI a tempo.',
            fix: 'Box Jump: 3-5 serie x 3-6 rep. Recupero 90-120s. MAI "3min work".'
        },
        {
            id: 'plank_too_long',
            check: (workout) => {
                const exs = workout?.exercises || [];
                return exs.some(e => {
                    const name = String(e?.name || '').toLowerCase();
                    const reps = String(e?.reps || '').toLowerCase();
                    if (!/plank/i.test(name)) return false;
                    
                    // Plank 3+ min è eccessivo
                    const minMatch = reps.match(/(\d+)\s*min/i);
                    if (minMatch && parseInt(minMatch[1]) >= 2) return true;
                    
                    // Plank 120+ sec è eccessivo
                    const secMatch = reps.match(/(\d+)\s*sec/i);
                    if (secMatch && parseInt(secMatch[1]) >= 120) return true;
                    
                    return false;
                });
            },
            message: '❌ BLOCCANTE: Plank oltre 2 minuti. Troppo e inefficace.',
            fix: 'Plank: 3-4 serie x 30-60 secondi. Se riesce più di 60s, aumenta difficoltà.'
        }
    ];
    
    // ═══════════════════════════════════════════════════════════════
    // BOXING MINIMUM REQUIREMENTS - Requisiti minimi per sessione boxe
    // ═══════════════════════════════════════════════════════════════
    
    const BOXING_MINIMUM_REQUIREMENTS = {
        warmup: {
            required: true,
            minDuration: 10,  // minuti
            description: 'Warm-up dinamico + attivazione'
        },
        roundBasedWork: {
            required: true,
            minRounds: 4,
            exercises: ['shadow', 'heavy bag', 'sacco', 'pad work', 'pads', 'speed bag', 'sparring'],
            description: 'Lavoro round-based specifico boxe'
        },
        neckWork: {
            required: true,
            directions: ['flexion', 'extension', 'lateral'],
            minDirections: 2,
            description: 'Lavoro collo con almeno 2 direzioni'
        },
        cooldown: {
            required: true,
            minDuration: 5,
            description: 'Cool-down con stretching'
        }
    };
    
    /**
     * Valida i requisiti minimi per sessione boxe
     * Ritorna errori BLOCCANTI se non rispettati
     */
    function validateBoxingMinimums(workout) {
        const exs = workout?.exercises || [];
        const errors = [];
        
        // 1. Check warm-up
        // Il primo esercizio deve essere un warm-up dinamico vero (no shadow boxing)
        const firstEx = exs[0];
        let warmup = null;
        if (firstEx) {
            const name = String(firstEx?.name || '').toLowerCase();
            if (/warm|activation|mobility|dynamic/i.test(name) && !/shadow/i.test(name)) {
                warmup = firstEx;
            }
        }
        if (!warmup) {
            errors.push({
                id: 'missing_true_warmup',
                message: '❌ Il primo esercizio deve essere un warm-up dinamico (no shadow boxing)',
                fix: 'Aggiungi come primo esercizio: Dynamic Warm-up 5-7 min'
            });
        } else {
            // Check durata warm-up
            const repsStr = String(warmup.reps || '').toLowerCase();
            const mins = parseInt(repsStr.match(/(\d+)/)?.[1] || '0', 10);
            const sets = parseInt(warmup.sets, 10) || 1;
            const estimatedTime = /min/i.test(repsStr) ? mins : sets * 3;
            if (estimatedTime < 5) {
                errors.push({
                    id: 'short_warmup',
                    message: `❌ Warm-up insufficiente (${estimatedTime} min, minimo 5)`,
                    fix: 'Warm-up deve essere almeno 5-7 min: mobilità + attivazione'
                });
            }
        }
        
        // 2. Check round-based work
        const roundBasedPatterns = BOXING_MINIMUM_REQUIREMENTS.roundBasedWork.exercises;
        // Nuovo: usa regex per matchare round-based anche con dettagli extra
        const roundBasedRegex = new RegExp(
            `(${roundBasedPatterns.map(p => p.replace(/ /g, '[\\s-]*')).join('|')})`,
            'i'
        );
        const roundBasedExs = exs.filter(e => {
            const name = String(e?.name || '').toLowerCase();
            // Matcha "shadow", "heavy bag", "sacco", ecc. anche con testo extra (es. tra parentesi)
            return roundBasedRegex.test(name) && !/warm|cool/i.test(name);
        });

        const totalRounds = roundBasedExs.reduce((sum, e) => sum + (parseInt(e.sets, 10) || 0), 0);

        if (totalRounds < 4) {
            errors.push({
                id: 'missing_round_based',
                message: `❌ Lavoro round-based insufficiente: ${totalRounds} round (minimo 4)`,
                fix: 'Aggiungi shadow boxing o heavy bag (es. 4x3min)'
            });
        }
        
        // 3. Check neck work
        const neckExs = exs.filter(e => /neck|collo/i.test(String(e?.name || '')));
        
        if (neckExs.length === 0) {
            errors.push({
                id: 'missing_neck',
                message: '❌ Lavoro collo mancante',
                fix: 'Aggiungi: Neck Flexion 2x15, Neck Extension 2x15, Neck Lateral 2x12/side'
            });
        } else if (neckExs.length < 2) {
            // Solo 1 esercizio collo = solo 1 direzione, ne servono almeno 2
            const name = String(neckExs[0]?.name || '').toLowerCase();
            const hasBothInName = /flexion.*extension|extension.*flexion|per direzione/i.test(name);
            if (!hasBothInName) {
                errors.push({
                    id: 'insufficient_neck',
                    message: '❌ Lavoro collo insufficiente (serve almeno 2 direzioni)',
                    fix: 'Aggiungi: Neck Extension o Neck Lateral'
                });
            }
        }
        
        // 4. Check cool-down
        const cooldown = exs.find(e => {
            const name = String(e?.name || '').toLowerCase();
            return /cool|stretch|defaticamento|recovery/i.test(name);
        });
        
        if (!cooldown) {
            errors.push({
                id: 'missing_cooldown',
                message: '❌ Cool-down mancante',
                fix: 'Aggiungi cool-down 5-10 min: camminata + stretching statico'
            });
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    // ═══════════════════════════════════════════════════════════════
    // PATTERN LIMITS - Max esercizi per pattern motorio
    // ═══════════════════════════════════════════════════════════════
    
    const PATTERN_LIMITS = {
        squat: {
            max: 2,
            patterns: [/squat/i, /goblet/i],
            excludePatterns: [/jump squat/i], // Jump squat è conditioning
            description: 'Max 2 esercizi squat pattern'
        },
        hinge: {
            max: 2,
            patterns: [/deadlift/i, /rdl/i, /romanian/i, /hip thrust/i, /good morning/i, /swing/i],
            excludePatterns: [],
            description: 'Max 2 esercizi hip hinge pattern'
        },
        push_horizontal: {
            max: 2,
            patterns: [/bench/i, /push-?up/i, /chest press/i, /floor press/i],
            excludePatterns: [],
            description: 'Max 2 esercizi push orizzontale'
        },
        push_vertical: {
            max: 2,
            patterns: [/overhead press/i, /military press/i, /shoulder press/i, /ohp/i],
            excludePatterns: [],
            description: 'Max 2 esercizi push verticale'
        },
        pull_horizontal: {
            max: 2,
            patterns: [/row/i, /cable row/i, /t-bar/i],
            excludePatterns: [],
            description: 'Max 2 esercizi pull orizzontale'
        },
        pull_vertical: {
            max: 2,
            patterns: [/pull-?up/i, /chin-?up/i, /lat pull/i],
            excludePatterns: [],
            description: 'Max 2 esercizi pull verticale'
        },
        boxing_rounds: {
            max: 10,
            patterns: [/shadow/i, /heavy bag/i, /sacco/i, /pad work/i, /speed bag/i],
            excludePatterns: [/warm/i, /cool/i],
            description: 'Max 10 round di boxing per sessione'
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // FIXED PARAMETERS - Esercizi con parametri NON negoziabili
    // ═══════════════════════════════════════════════════════════════
    
    const FIXED_PARAMETERS = {
        box_jump: {
            patterns: [/box jump/i],
            constraints: {
                reps: { min: 3, max: 8, format: 'number' },
                sets: { min: 3, max: 5 },
                rest: { min: 90, max: 180 },
                never_timed: true,
                notes: 'Esplosivo, MAI a tempo. Full recovery tra set.'
            }
        },
        depth_jump: {
            patterns: [/depth jump/i, /drop jump/i],
            constraints: {
                reps: { min: 3, max: 6, format: 'number' },
                sets: { min: 3, max: 4 },
                rest: { min: 120, max: 180 },
                never_timed: true,
                notes: 'Altamente stressante. Max 2x/settimana.'
            }
        },
        plank: {
            patterns: [/^plank$/i, /plank:/i, /side plank/i],
            constraints: {
                reps: { min: 20, max: 60, format: 'seconds' },
                sets: { min: 2, max: 4 },
                rest: { min: 30, max: 60 },
                notes: 'In secondi, non minuti. Se facile, aumenta difficoltà.'
            }
        },
        neck: {
            patterns: [/neck/i, /cervical/i],
            constraints: {
                reps: { min: 12, max: 20, format: 'number' },
                sets: { min: 2, max: 4 },
                rest: { min: 30, max: 60 },
                never_timed: true,
                notes: 'Sempre rep-based. 3x15-20 per direzione.'
            }
        },
        max_strength_compound: {
            patterns: [/back squat/i, /front squat/i, /deadlift(?!.*romanian)/i, /bench press/i],
            repsCondition: (reps) => parseInt(reps) <= 5,
            constraints: {
                rest: { min: 150, max: 300 },
                notes: 'Forza massimale richiede 2.5-5 min recupero.'
            }
        },
        jump_rope: {
            patterns: [/jump rope/i, /corda/i],
            constraints: {
                reps: { min: 1, max: 5, format: 'minutes' },
                sets: { min: 2, max: 5 },
                rest: { min: 30, max: 60 },
                notes: 'Può essere a tempo. 2-5 min per round.'
            }
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // FORBIDDEN COMBINATIONS - Mai insieme nella stessa sessione
    // ═══════════════════════════════════════════════════════════════
    
    const FORBIDDEN_COMBINATIONS = [
        {
            exercises: [/back squat/i, /front squat/i],
            reason: 'Troppo overlap su quadricipiti e core. Scegli uno.'
        },
        {
            exercises: [/conventional deadlift/i, /trap bar deadlift/i],
            reason: 'Stesso pattern, stesso stress. Scegli uno.'
        },
        {
            // Heavy squat + Heavy deadlift (entrambi con sets >= 3, reps <= 6)
            check: (exs) => {
                const heavySquat = exs.find(e => 
                    /back squat|front squat/i.test(e.name) && 
                    parseInt(e.sets) >= 3 && 
                    parseInt(String(e.reps).replace(/\D/g, '')) <= 6
                );
                const heavyDeadlift = exs.find(e => 
                    /deadlift/i.test(e.name) && 
                    !/romanian|rdl/i.test(e.name) &&
                    parseInt(e.sets) >= 3 && 
                    parseInt(String(e.reps).replace(/\D/g, '')) <= 6
                );
                return heavySquat && heavyDeadlift;
            },
            reason: 'Squat pesante + Deadlift pesante = troppo stress CNS. Uno pesante, l\'altro leggero o altro giorno.'
        }
    ];
    
    // ═══════════════════════════════════════════════════════════════
    // ROUND-BASED WHITELIST - Esercizi che possono avere "Nx3min"
    // ═══════════════════════════════════════════════════════════════
    
    const ROUND_BASED_WHITELIST = [
        'shadow boxing', 'shadow', 'heavy bag', 'sacco', 'pad work', 'pads',
        'speed bag', 'double end bag', 'sparring', 'boxing circuit',
        'jump rope', 'corda', 'battle rope', 'rowing', 'assault bike',
        'airdyne', 'ski erg', 'conditioning circuit', 'emom', 'amrap'
    ];
    
    /**
     * Verifica se un esercizio può essere round-based
     */
    function canBeRoundBased(exerciseName) {
        const name = String(exerciseName || '').toLowerCase();
        return ROUND_BASED_WHITELIST.some(pattern => name.includes(pattern));
    }
    
    const SESSION_TEMPLATES = {
        strength: {
            name: 'Sessione di Forza',
            description: 'Focus su forza/potenza con conditioning leggero come finisher',
            structure: [
                { phase: 'warmup', duration: '12 min', exercises: 1-2 },
                { phase: 'strength_main', duration: '20-25 min', exercises: 2-3, notes: '3-4 serie, rep basse, recuperi lunghi (2.5-3 min)' },
                { phase: 'strength_accessory', duration: '10-15 min', exercises: 1-2, notes: 'Volume moderato, recuperi 90-120s' },
                { phase: 'conditioning_finisher', duration: '10-12 min', exercises: 1, notes: '2-3 round leggeri O lavoro di potenza' },
                { phase: 'accessories', duration: '8-10 min', exercises: 2-3, notes: 'Core, collo (3x15-20), prehab' },
                { phase: 'cooldown', duration: '5-10 min', exercises: 1 }
            ],
            totalDuration: '65-75 min'
        },
        
        conditioning: {
            name: 'Sessione di Conditioning',
            description: 'Focus su resistenza specifica con mantenimento forza minimale',
            structure: [
                { phase: 'warmup', duration: '12-15 min', exercises: 1-2, notes: 'Include shadow leggero 2x2min' },
                { phase: 'conditioning_main', duration: '25-30 min', exercises: 2, notes: '6-10 round strutturati con focus specifico' },
                { phase: 'strength_maintenance', duration: '10 min', exercises: 1-2, notes: 'OPZIONALE: volume ridotto, recuperi normali' },
                { phase: 'accessories', duration: '8-10 min', exercises: 2, notes: 'Core, collo (3x15-20)' },
                { phase: 'cooldown', duration: '5-10 min', exercises: 1 }
            ],
            totalDuration: '60-70 min'
        },
        
        technical: {
            name: 'Sessione Tecnica',
            description: 'Focus su qualità tecnica, volume basso, intensità controllata',
            structure: [
                { phase: 'warmup', duration: '10-12 min', exercises: 1-2 },
                { phase: 'technical_main', duration: '20-25 min', exercises: 2-3, notes: 'Drills specifici, focus su correzioni' },
                { phase: 'shadow_structured', duration: '12-15 min', exercises: 1, notes: 'Shadow boxing con focus tecnico specifico per round' },
                { phase: 'bag_light', duration: '10 min', exercises: 1, notes: 'Applicazione tecnica, NON conditioning' },
                { phase: 'cooldown_mobility', duration: '10 min', exercises: 1-2, notes: 'Stretching + mobilità approfondita' }
            ],
            totalDuration: '60-70 min'
        },
        
        recovery: {
            name: 'Sessione di Recupero',
            description: 'Rigenerazione attiva, nessun carico pesante',
            structure: [
                { phase: 'mobility', duration: '15-20 min', exercises: 1, notes: 'Flow di mobilità completo' },
                { phase: 'activation_light', duration: '10 min', exercises: 2-3, notes: 'Attivazione leggera, band work' },
                { phase: 'shadow_easy', duration: '10-12 min', exercises: 1, notes: 'Shadow molto leggero, focus respiro' },
                { phase: 'stretching', duration: '15-20 min', exercises: 1, notes: 'Stretching statico approfondito' }
            ],
            totalDuration: '50-60 min'
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // RECUPERI PER TIPO DI ESERCIZIO
    // ═══════════════════════════════════════════════════════════════
    
    const REST_GUIDELINES = {
        // Per rep range
        byReps: {
            '1-3': { min: 180, recommended: 210, label: 'Forza massimale' },
            '4-5': { min: 150, recommended: 180, label: 'Forza' },
            '6-8': { min: 120, recommended: 150, label: 'Forza-Ipertrofia' },
            '8-12': { min: 90, recommended: 120, label: 'Ipertrofia' },
            '12-15': { min: 60, recommended: 90, label: 'Resistenza muscolare' },
            '15+': { min: 45, recommended: 60, label: 'Endurance' }
        },
        
        // Per tipo esercizio
        byExercise: {
            compound: { multiplier: 1.2, note: 'Compound richiedono più recupero' },
            isolation: { multiplier: 0.8, note: 'Isolamento può avere meno recupero' },
            conditioning: { fixed: 60, note: 'Simula il ring: 1 min tra round' },
            prehab: { fixed: 30, note: 'Leggero, recupero breve' }
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // FUNZIONI DI VALIDAZIONE
    // ═══════════════════════════════════════════════════════════════
    
    function validateWorkout(workout, context = {}) {
        const errors = [];
        const warnings = [];
        const suggestions = [];
        const blockingErrors = [];  // Errori che BLOCCANO la validazione
        
        // ═══════════════════════════════════════════════════════════════
        // 1. CHECK REQUISITI MINIMI BOXE (BLOCCANTI)
        // ═══════════════════════════════════════════════════════════════
        const minimumsCheck = validateBoxingMinimums(workout);
        if (!minimumsCheck.isValid) {
            for (const err of minimumsCheck.errors) {
                blockingErrors.push(err);
            }
        }
        
        // ═══════════════════════════════════════════════════════════════
        // 2. CHECK ERRORI BLOCCANTI (pattern vietati)
        // ═══════════════════════════════════════════════════════════════
        BLOCKING_ERRORS.forEach(rule => {
            try {
                if (rule.check(workout)) {
                    blockingErrors.push({
                        id: rule.id,
                        message: rule.message,
                        fix: rule.fix,
                        blocking: true
                    });
                }
            } catch (e) {
                console.warn(`BoxingRules: Error checking ${rule.id}:`, e);
            }
        });
        
        // Conta round totali
        const exs = workout?.exercises || [];
        let totalBoxingRounds = 0;
        exs.forEach(e => {
            const name = String(e?.name || '').toLowerCase();
            const sets = parseInt(e?.sets, 10) || 0;
            const reps = String(e?.reps || '').toLowerCase();
            if (/shadow|bag|circuit|sacco|pad|round/i.test(name) && 
                !/warm|cool/i.test(name) && /min/i.test(reps)) {
                totalBoxingRounds += sets;
            }
        });
        
        if (totalBoxingRounds > 10 && totalBoxingRounds <= 12) {
            warnings.push({
                message: `⚠️ ${totalBoxingRounds} round di conditioning è al limite. Max consigliato: 10.`,
                suggestion: 'Considera qualità vs quantità.'
            });
        }
        
        // Verifica cool-down
        const hasCooldown = exs.some(e => /cool|stretch|recovery/i.test(String(e?.name || '')));
        if (!hasCooldown) {
            warnings.push({
                message: '⚠️ Sessione senza cool-down.',
                suggestion: 'Aggiungi 5-10 min di cool-down: camminata + stretching statico.'
            });
        }
        
        // Verifica varietà
        const strengthExs = exs.filter(e => String(e?.type || '').toLowerCase() === 'strength');
        if (strengthExs.length > 5) {
            warnings.push({
                message: `⚠️ Troppi esercizi di forza (${strengthExs.length}). Max consigliato: 5.`,
                suggestion: 'Riduci a 4-5 esercizi di forza per sessione.'
            });
        }
        
        // isValid = true SOLO se ZERO blocking errors
        const isValid = blockingErrors.length === 0;
        
        return {
            isValid,
            status: isValid ? 'VALID' : 'BLOCKED',
            blockingErrors,  // Errori che bloccano SEMPRE
            errors,          // Altri errori
            warnings,
            suggestions,
            canOverride: false,  // MAI permettere override di BLOCKED
            stats: {
                totalBoxingRounds,
                strengthExercises: strengthExs.length,
                totalExercises: exs.length
            }
        };
    }
    
    function getRecommendedRest(exercise) {
        const name = String(exercise?.name || '').toLowerCase();
        const type = String(exercise?.type || '').toLowerCase();
        const repsStr = String(exercise?.reps || '');
        const reps = parseInt(repsStr.replace(/\D/g, ''), 10) || 0;
        
        // Conditioning: fisso 60s
        if (type === 'conditioning' || /shadow|bag|circuit|round/i.test(name)) {
            return { rest: 60, reason: 'Conditioning: simula recupero ring' };
        }
        
        // Prehab/accessori leggeri
        if (/neck|collo|face pull|band|prehab|mobility/i.test(name)) {
            return { rest: 30, reason: 'Prehab/accessori leggeri' };
        }
        
        // Forza: basato su rep range
        if (type === 'strength' || /squat|deadlift|bench|press|row|pull-?up/i.test(name)) {
            const isCompound = /squat|deadlift|bench|press|row|pull/i.test(name);
            let baseRest;
            
            if (reps <= 3) baseRest = 180;
            else if (reps <= 5) baseRest = 150;
            else if (reps <= 8) baseRest = 120;
            else baseRest = 90;
            
            // Compound: +20%
            if (isCompound) baseRest = Math.round(baseRest * 1.2);
            
            return { 
                rest: baseRest, 
                reason: `Forza ${reps} rep${isCompound ? ' (compound)' : ''}` 
            };
        }
        
        // Default ipertrofia
        if (type === 'hypertrophy') {
            return { rest: 90, reason: 'Ipertrofia standard' };
        }
        
        return { rest: 60, reason: 'Default' };
    }
    
    function getSessionTemplate(objective) {
        const obj = String(objective || '').toLowerCase();
        
        if (obj.includes('forza') || obj.includes('strength') || obj.includes('power')) {
            return SESSION_TEMPLATES.strength;
        }
        if (obj.includes('conditioning') || obj.includes('endurance') || obj.includes('resistenza')) {
            return SESSION_TEMPLATES.conditioning;
        }
        if (obj.includes('tecnic') || obj.includes('skill') || obj.includes('technical')) {
            return SESSION_TEMPLATES.technical;
        }
        if (obj.includes('recovery') || obj.includes('recupero') || obj.includes('rigenerazione')) {
            return SESSION_TEMPLATES.recovery;
        }
        
        // Default: forza per la maggior parte delle sessioni
        return SESSION_TEMPLATES.strength;
    }
    
    function generatePromptRules() {
        return `
═══════════════════════════════════════════════════════════════
🥊 VINCOLI NON NEGOZIABILI - BOXING RULES
═══════════════════════════════════════════════════════════════

ORDINE SESSIONE OBBLIGATORIO:
1. Warm-up (10-15 min) - MAI meno
2. Lavoro tecnico (SE è il focus)
3. FORZA/POTENZA (quando CNS è fresco)
4. Conditioning specifico (DOPO la forza)
5. Accessori (core, collo, prehab)
6. Cool-down (5-10 min) - SEMPRE

❌ ERRORE BLOCCANTE: Forza dopo conditioning intenso

RECUPERI MINIMI (non negoziabili):
- Forza massimale (1-5 rep): 2.5-3 minuti (150-180s)
- Forza-ipertrofia (6-8 rep): 2 minuti (120s)
- Ipertrofia (8-12 rep): 90 secondi
- Conditioning tra round: 60 secondi (simula ring)

❌ ERRORE BLOCCANTE: Squat 3x5 con 45s di recupero

VOLUME MASSIMO SESSIONE:
- Round totali boxing (shadow+sacco+pads): MAX 10-12
- Esercizi di forza: MAX 4-5
- Tempo totale: 60-90 minuti

❌ ERRORE BLOCCANTE: Heavy bag intervals + boxing circuit + shadow intenso insieme

PROTOCOLLO COLLO (FISSO):
- 3x15-20 rep per direzione (flessione, estensione, laterale)
- Rest 30-60 secondi
- SEMPRE alla fine della sessione
- MAI a tempo (no "4x3min")

❌ ERRORE BLOCCANTE: Neck strengthening 4x3min

TEMPLATE SESSIONE FORZA:
1. Warm-up (12 min): mobilità dinamica + attivazione + shadow leggero 2x2min
2. Forza principale (25 min): 2-3 esercizi, 4x5, rest 180s
3. Forza accessoria (15 min): 1-2 esercizi, 3x8-10, rest 120s
4. Conditioning finisher (10 min): 2-3 round leggeri O lavoro potenza
5. Accessori (10 min): core + collo 3x15 per direzione
6. Cool-down (5 min): walk + stretching statico

TEMPLATE SESSIONE CONDITIONING:
1. Warm-up (15 min): include shadow leggero 2x2min
2. Conditioning principale (25-30 min): 6-8 round strutturati
3. Mantenimento forza (10 min): 1-2 esercizi volume ridotto (opzionale)
4. Accessori (10 min): core + collo 3x15
5. Cool-down (5-10 min)
═══════════════════════════════════════════════════════════════`;
    }
    
    // ═══════════════════════════════════════════════════════════════
    // FIX AUTOMATICI
    // ═══════════════════════════════════════════════════════════════
    
    function autoFixWorkout(workout) {
        const exs = [...(workout?.exercises || [])];
        const fixes = [];
        
        // 1. Fix recuperi troppo corti per forza
        exs.forEach((e, idx) => {
            const type = String(e?.type || '').toLowerCase();
            const name = String(e?.name || '').toLowerCase();
            const reps = parseInt(String(e?.reps || '').replace(/\D/g, ''), 10) || 0;
            const currentRest = parseInt(String(e?.rest || '0').replace(/\D/g, ''), 10) || 0;
            
            if (type === 'strength' && /squat|deadlift|bench|press|row|pull/i.test(name)) {
                const recommended = getRecommendedRest(e);
                if (currentRest > 0 && currentRest < recommended.rest) {
                    exs[idx] = { ...e, rest: `${recommended.rest}s` };
                    fixes.push(`Fix rest: ${e.name} ${currentRest}s → ${recommended.rest}s`);
                }
            }
        });
        
        // 2. Fix collo se ha minuti
        exs.forEach((e, idx) => {
            const name = String(e?.name || '').toLowerCase();
            const reps = String(e?.reps || '').toLowerCase();
            
            if (/neck|collo/i.test(name) && /min/i.test(reps)) {
                exs[idx] = {
                    ...e,
                    sets: 3,
                    reps: '15 per direzione',
                    rest: '30s'
                };
                fixes.push(`Fix neck: da tempo a 3x15 rep per direzione`);
            }
        });
        
        // 3. Riordina se forza viene dopo conditioning
        let warmupEndIdx = -1;
        let firstCondIdx = -1;
        let strengthIdxs = [];
        
        exs.forEach((e, idx) => {
            const name = String(e?.name || '').toLowerCase();
            const type = String(e?.type || '').toLowerCase();
            
            if (/warm|activation|dynamic/i.test(name)) {
                warmupEndIdx = idx;
            }
            if ((type === 'conditioning' || /shadow|bag|circuit/i.test(name)) && 
                !/warm|activation/i.test(name) && firstCondIdx === -1) {
                firstCondIdx = idx;
            }
            if (type === 'strength') {
                strengthIdxs.push(idx);
            }
        });
        
        // Se c'è forza dopo conditioning, riordina
        const strengthAfterCond = strengthIdxs.filter(i => firstCondIdx > -1 && i > firstCondIdx);
        if (strengthAfterCond.length > 0 && warmupEndIdx > -1) {
            // Sposta la forza subito dopo il warm-up
            const reordered = [];
            const strengthExs = strengthAfterCond.map(i => exs[i]);
            
            exs.forEach((e, idx) => {
                if (idx === warmupEndIdx + 1) {
                    // Inserisci la forza qui
                    strengthExs.forEach(s => reordered.push(s));
                }
                if (!strengthAfterCond.includes(idx)) {
                    reordered.push(e);
                }
            });
            
            fixes.push(`Fix ordine: spostata forza prima del conditioning`);
            return { exercises: reordered, fixes };
        }
        
        return { exercises: exs, fixes };
    }
    
    // ═══════════════════════════════════════════════════════════════
    // DATABASE ESERCIZI CON METADATI - Per identificazione automatica
    // ═══════════════════════════════════════════════════════════════
    
    const EXERCISE_DATABASE = {
        // WARM-UP / ACTIVATION
        warmup: {
            patterns: [
                /warm/i, /activation/i, /dynamic\s*(stretch|mobility)/i,
                /joint\s*circles/i, /glute\s*bridge/i, /dead\s*bug/i,
                /bird\s*dog/i, /cat\s*cow/i, /foam\s*roll/i,
                /world'?s?\s*greatest/i, /hip\s*circle/i, /arm\s*circle/i,
                /leg\s*swing/i, /inchworm/i, /lunge\s*stretch/i
            ],
            category: 'warmup',
            order: 0,
            minDuration: 10,
            examples: [
                'Dynamic Warm-up: Joint circles + Hip openers + Arm circles (5min)',
                'Activation Circuit: Glute bridges 2x15 + Dead bugs 2x10 + Bird dogs 2x10',
                'Shadow Boxing Warm-up: 2x2min light movement, focus breathing'
            ]
        },
        
        // STRENGTH - COMPOUND LOWER
        compoundLower: {
            patterns: [
                /back\s*squat/i, /front\s*squat/i, /goblet\s*squat/i,
                /deadlift/i, /romanian/i, /rdl/i, /sumo/i,
                /hip\s*thrust/i, /barbell\s*squat/i, /trap\s*bar/i
            ],
            category: 'strength',
            order: 1,
            restMin: 150,
            restMax: 180,
            setsRange: [3, 5],
            repsRange: [3, 8],
            examples: [
                'Back Squat 4x5 @RPE 8 (180s rest)',
                'Romanian Deadlift 3x8 @RPE 7 (120s rest)',
                'Trap Bar Deadlift 4x6 @RPE 8 (180s rest)'
            ]
        },
        
        // STRENGTH - COMPOUND UPPER
        compoundUpper: {
            patterns: [
                /bench\s*press/i, /overhead\s*press/i, /military\s*press/i,
                /incline\s*press/i, /floor\s*press/i, /push\s*press/i,
                /barbell\s*row/i, /pendlay/i, /t-?bar\s*row/i
            ],
            category: 'strength',
            order: 1,
            restMin: 120,
            restMax: 150,
            setsRange: [3, 5],
            repsRange: [5, 10],
            examples: [
                'Bench Press 4x6 @RPE 8 (150s rest)',
                'Overhead Press 3x8 @RPE 7 (120s rest)',
                'Barbell Row 4x8 @RPE 7 (120s rest)'
            ]
        },
        
        // STRENGTH - VERTICAL PULL
        verticalPull: {
            patterns: [
                /pull-?up/i, /chin-?up/i, /lat\s*pull/i,
                /weighted\s*pull/i, /assisted\s*pull/i
            ],
            category: 'strength',
            order: 2,
            restMin: 90,
            restMax: 120,
            setsRange: [3, 5],
            repsRange: [5, 12],
            examples: [
                'Pull-ups 4xAMRAP (120s rest)',
                'Weighted Pull-ups 4x6 @RPE 8 (120s rest)',
                'Lat Pulldown 3x10 @RPE 7 (90s rest)'
            ]
        },
        
        // ACCESSORIES - LOWER
        accessoryLower: {
            patterns: [
                /lunge/i, /split\s*squat/i, /bulgarian/i,
                /leg\s*curl/i, /leg\s*extension/i, /calf/i,
                /step-?up/i, /glute\s*ham/i, /nordic/i,
                /single\s*leg/i
            ],
            category: 'accessory',
            order: 3,
            restMin: 60,
            restMax: 90,
            setsRange: [2, 4],
            repsRange: [8, 15],
            examples: [
                'Walking Lunges 3x12 each (60s rest)',
                'Bulgarian Split Squat 3x10 each (90s rest)',
                'Leg Curls 3x12 (60s rest)'
            ]
        },
        
        // ACCESSORIES - UPPER
        accessoryUpper: {
            patterns: [
                /dumbbell\s*row/i, /face\s*pull/i, /lateral\s*raise/i,
                /rear\s*delt/i, /tricep/i, /bicep/i, /curl/i,
                /cable\s*fly/i, /push-?up/i, /dip/i,
                /shrug/i, /upright\s*row/i
            ],
            category: 'accessory',
            order: 3,
            restMin: 45,
            restMax: 75,
            setsRange: [2, 4],
            repsRange: [10, 20],
            examples: [
                'Face Pulls 3x15 (45s rest)',
                'Lateral Raises 3x12 (45s rest)',
                'Dumbbell Row 3x10 each (60s rest)'
            ]
        },
        
        // BOXING CONDITIONING
        boxingConditioning: {
            patterns: [
                /shadow\s*box/i, /heavy\s*bag/i, /sacco/i,
                /pad\s*work/i, /focus\s*mitt/i, /speed\s*bag/i,
                /double\s*end/i, /boxing\s*circuit/i,
                /sparring/i, /round/i
            ],
            category: 'conditioning',
            order: 4,
            restMin: 60,
            restMax: 90,
            maxRoundsPerSession: 10,
            roundDuration: '3min',
            examples: [
                'Shadow Boxing 4x3min (60s rest) - Focus: jab-cross combos R1-2, defense R3, movement R4',
                'Heavy Bag Power Rounds 3x3min (90s rest) - Emphasis: power shots, full commitment',
                'Technical Pad Work 3x3min (60s rest) - With coach calls'
            ]
        },
        
        // CONDITIONING - CIRCUITS
        conditioningCircuit: {
            patterns: [
                /circuit/i, /emom/i, /amrap/i, /tabata/i,
                /interval/i, /hiit/i, /finisher/i,
                /burpee/i, /jump\s*rope/i, /battle\s*rope/i,
                /mountain\s*climber/i, /box\s*jump/i
            ],
            category: 'conditioning',
            order: 4,
            restMin: 30,
            restMax: 60,
            examples: [
                'EMOM 8min: Burpees x8 + Mountain Climbers x16',
                'Circuit 3x: Jump Rope 2min + Burpees x10 + Box Jumps x8 (60s rest between rounds)',
                'Tabata 4min: Battle Ropes 20s work / 10s rest'
            ]
        },
        
        // CORE
        core: {
            patterns: [
                /plank/i, /anti-?rotation/i, /pallof/i,
                /ab\s*wheel/i, /hollow/i, /v-?up/i,
                /russian\s*twist/i, /cable\s*crunch/i,
                /hanging\s*leg/i, /sit-?up/i, /crunch/i
            ],
            category: 'accessory',
            order: 5,
            restMin: 30,
            restMax: 60,
            setsRange: [2, 4],
            repsRange: [10, 20],
            examples: [
                'Plank Hold 3x45sec (30s rest)',
                'Pallof Press 3x12 each side (45s rest)',
                'Ab Wheel Rollouts 3x10 (45s rest)'
            ]
        },
        
        // NECK (BOXING SPECIFIC)
        neck: {
            patterns: [
                /neck/i, /cervical/i, /trap.*shrug/i,
                /head.*harness/i
            ],
            category: 'accessory',
            order: 6,
            restMin: 30,
            restMax: 60,
            FIXED_PROTOCOL: {
                sets: 3,
                reps: '15-20',
                directions: ['flexion', 'extension', 'lateral L/R'],
                rest: '30s',
                notes: 'MAI A TEMPO - sempre rep-based'
            },
            examples: [
                'Neck Flexion 3x15 (30s rest)',
                'Neck Extension 3x15 (30s rest)',
                'Neck Lateral 3x15 each side (30s rest)'
            ]
        },
        
        // COOL-DOWN
        cooldown: {
            patterns: [
                /cool\s*down/i, /static\s*stretch/i, /foam\s*roll/i,
                /breathing/i, /recovery\s*walk/i, /light\s*jog/i
            ],
            category: 'cooldown',
            order: 7,
            minDuration: 5,
            examples: [
                'Light Walk 3min + Static Stretching 5min (quads, hamstrings, hip flexors, shoulders)',
                'Foam Roll: Quads, IT Band, Lats, Thoracic (5min)',
                'Box Breathing 3min + Full body stretch routine'
            ]
        }
    };
    
    /**
     * Identifica la categoria di un esercizio dal nome
     */
    function identifyExerciseCategory(exerciseName) {
        const name = String(exerciseName || '').toLowerCase();
        
        for (const [category, data] of Object.entries(EXERCISE_DATABASE)) {
            for (const pattern of data.patterns || []) {
                if (pattern.test(name)) {
                    return {
                        category,
                        type: data.category,
                        order: data.order,
                        restMin: data.restMin,
                        restMax: data.restMax,
                        setsRange: data.setsRange,
                        repsRange: data.repsRange
                    };
                }
            }
        }
        
        return { category: 'unknown', type: 'strength', order: 3 };
    }
    
    /**
     * Suggerisce esercizi di una categoria specifica
     */
    function getExerciseExamples(category) {
        const data = EXERCISE_DATABASE[category];
        return data?.examples || [];
    }
    
    /**
     * Valida la sequenza esercizi secondo l'ordine corretto
     */
    function validateExerciseOrder(exercises) {
        const identified = exercises.map((e, idx) => ({
            ...identifyExerciseCategory(e.name),
            name: e.name,
            index: idx
        }));
        
        // Controlla che l'ordine sia crescente
        let lastOrder = -1;
        const orderViolations = [];
        
        for (const ex of identified) {
            if (ex.order < lastOrder && ex.order > 0) { // 0 = warmup può stare ovunque inizialmente
                orderViolations.push({
                    exercise: ex.name,
                    category: ex.category,
                    problem: `"${ex.name}" (${ex.category}) dovrebbe venire prima nella sessione`
                });
            }
            lastOrder = Math.max(lastOrder, ex.order);
        }
        
        return {
            isValid: orderViolations.length === 0,
            violations: orderViolations,
            identified
        };
    }
    
    console.log(`🥊 BoxingRules v${VERSION} loaded - Vincoli non negoziabili attivi`);
    
    return {
        VERSION,
        HARD_CONSTRAINTS,
        BLOCKING_ERRORS,
        BOXING_MINIMUM_REQUIREMENTS,  // NUOVO: requisiti minimi boxe
        SESSION_TEMPLATES,
        REST_GUIDELINES,
        EXERCISE_DATABASE,
        PATTERN_LIMITS,
        FIXED_PARAMETERS,
        FORBIDDEN_COMBINATIONS,
        ROUND_BASED_WHITELIST,
        validateWorkout,
        validateBoxingMinimums,  // NUOVO: check requisiti minimi
        getRecommendedRest,
        getSessionTemplate,
        generatePromptRules,
        autoFixWorkout,
        identifyExerciseCategory,
        getExerciseExamples,
        validateExerciseOrder,
        canBeRoundBased
    };
})();
