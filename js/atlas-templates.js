/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🏗️ ATLAS TEMPLATE ENGINE v2.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sistema deterministico per generazione workout.
 * Zero AI = Zero variabilità = 100% affidabilità
 * 
 * FEATURES:
 * - A/B/C Variation System (3 varianti per template)
 * - Sport-Specific Exercise Mapping
 * - Advanced Technique Annotations
 * - Weekly Rotation
 */

window.ATLASTemplates = {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🎲 VARIATION SYSTEM - 3 varianti per ogni categoria
    // ═══════════════════════════════════════════════════════════════════════════
    
    variations: {
        plyometrics: {
            A: [
                { name: 'Box Jump', sets: 3, reps: '4-5', type: 'power', muscles: ['quadriceps', 'glutes', 'calves'], technique: 'land soft, step down' },
                { name: 'Lateral Bound', sets: 3, reps: '5 per side', type: 'power', muscles: ['glutes', 'adductors'], technique: 'stick landing 2s' }
            ],
            B: [
                { name: 'Depth Jump', sets: 3, reps: '3-4', type: 'power', muscles: ['quadriceps', 'calves'], technique: 'minimal ground contact' },
                { name: 'Broad Jump', sets: 3, reps: '4-5', type: 'power', muscles: ['quadriceps', 'glutes', 'hamstrings'], technique: 'swing arms' }
            ],
            C: [
                { name: 'Split Squat Jump', sets: 3, reps: '5 per side', type: 'power', muscles: ['quadriceps', 'glutes'], technique: 'explosive switch' },
                { name: 'Single-Leg Hop', sets: 3, reps: '5 per side', type: 'power', muscles: ['calves', 'quadriceps'], technique: 'stick landing' }
            ]
        },
        
        compoundLower: {
            A: [
                { name: 'Back Squat', sets: 4, reps: '4-6', type: 'strength', muscles: ['quadriceps', 'glutes', 'hamstrings'], pattern: 'squat', tempo: '3-1-X-0', rest: '3-4 min' },
                { name: 'Romanian Deadlift', sets: 3, reps: '6-8', type: 'strength', muscles: ['hamstrings', 'glutes', 'back'], pattern: 'hinge', tempo: '3-0-1-1', rest: '2-3 min' }
            ],
            B: [
                { name: 'Front Squat', sets: 4, reps: '4-6', type: 'strength', muscles: ['quadriceps', 'core'], pattern: 'squat', tempo: '3-1-X-0', rest: '3-4 min' },
                { name: 'Trap Bar Deadlift', sets: 4, reps: '4-6', type: 'strength', muscles: ['quadriceps', 'glutes', 'hamstrings', 'back'], pattern: 'hinge', tempo: '2-0-X-0', rest: '3-4 min' }
            ],
            C: [
                { name: 'Pause Squat', sets: 4, reps: '3-5', type: 'strength', muscles: ['quadriceps', 'glutes'], pattern: 'squat', tempo: '3-2-X-0', rest: '3-4 min' },
                { name: 'Good Morning', sets: 3, reps: '8-10', type: 'strength', muscles: ['hamstrings', 'glutes', 'back'], pattern: 'hinge', tempo: '3-0-2-0', rest: '2 min' }
            ]
        },
        
        compoundPush: {
            A: [
                { name: 'Bench Press', sets: 4, reps: '4-6', type: 'strength', muscles: ['chest', 'triceps', 'shoulders'], pattern: 'push', tempo: '2-1-X-0', rest: '3 min' }
            ],
            B: [
                { name: 'Overhead Press', sets: 4, reps: '5-8', type: 'strength', muscles: ['shoulders', 'triceps'], pattern: 'push', tempo: '2-0-X-1', rest: '2-3 min' },
                { name: 'Dumbbell Bench Press', sets: 4, reps: '6-8', type: 'strength', muscles: ['chest', 'triceps'], pattern: 'push', tempo: '2-1-X-0', rest: '2-3 min' }
            ],
            C: [
                { name: 'Incline Bench Press', sets: 4, reps: '6-8', type: 'strength', muscles: ['chest', 'shoulders', 'triceps'], pattern: 'push', tempo: '3-1-X-0', rest: '2-3 min' }
            ]
        },
        
        compoundPull: {
            A: [
                { name: 'Weighted Pull-up', sets: 4, reps: '4-6', type: 'strength', muscles: ['back', 'biceps'], pattern: 'pull', tempo: '2-1-X-1', rest: '3 min' }
            ],
            B: [
                { name: 'Barbell Row', sets: 4, reps: '6-8', type: 'strength', muscles: ['back', 'biceps'], pattern: 'pull', tempo: '2-0-X-1', rest: '2-3 min' }
            ],
            C: [
                { name: 'Pendlay Row', sets: 4, reps: '5-6', type: 'power', muscles: ['back', 'biceps'], pattern: 'pull', tempo: 'X-0-X-0', rest: '2-3 min' }
            ]
        },
        
        unilateral: {
            A: [
                { name: 'Reverse Lunge', sets: 3, reps: '8-10 per side', type: 'strength', muscles: ['glutes', 'hamstrings', 'quadriceps'], tempo: '2-1-1-0' }
            ],
            B: [
                { name: 'Walking Lunge', sets: 3, reps: '10-12 per side', type: 'strength', muscles: ['quadriceps', 'glutes'], tempo: '2-0-1-0' }
            ],
            C: [
                { name: 'Single-Leg RDL', sets: 3, reps: '8-10 per side', type: 'strength', muscles: ['hamstrings', 'glutes'], tempo: '3-0-1-1' }
            ]
        },
        
        core: {
            A: [
                { name: 'Pallof Press', sets: 3, reps: '10-12 per side', type: 'core', muscles: ['core', 'obliques'], technique: 'anti-rotation' }
            ],
            B: [
                { name: 'Dead Bug', sets: 3, reps: '10 per side', type: 'core', muscles: ['core'], technique: 'low back pressed to floor' }
            ],
            C: [
                { name: 'Ab Wheel Rollout', sets: 3, reps: '8-10', type: 'core', muscles: ['core'], technique: 'squeeze glutes, brace abs' }
            ]
        },
        
        // CORE MULTI-PLANAR - Anti-rotation + Anti-extension + Anti-lateral
        coreMultiPlanar: {
            A: [
                { name: 'Pallof Press', sets: 3, reps: '10-12 per side', type: 'core', muscles: ['core', 'obliques'], technique: 'anti-rotation, brace hard' },
                { name: 'Dead Bug', sets: 2, reps: '8 per side', type: 'core', muscles: ['core'], technique: 'low back pressed' }
            ],
            B: [
                { name: 'Bird Dog', sets: 3, reps: '10 per side', type: 'core', muscles: ['core', 'back'], technique: 'opposite arm/leg, hold 2s' },
                { name: 'Side Plank', sets: 2, reps: '30s per side', type: 'core', muscles: ['obliques'], technique: 'hips high, stack feet' }
            ],
            C: [
                { name: 'Ab Wheel Rollout', sets: 3, reps: '8-10', type: 'core', muscles: ['core'], technique: 'anti-extension, brace abs' },
                { name: 'Pallof Press Rotation', sets: 2, reps: '8 per side', type: 'core', muscles: ['obliques'], technique: 'controlled rotation' }
            ]
        },
        
        // POSTERIOR CHAIN - Improve post/ant ratio
        posteriorChain: {
            A: [
                { name: 'Romanian Deadlift', sets: 3, reps: '8-10', type: 'strength', muscles: ['hamstrings', 'glutes', 'back'], pattern: 'hinge', tempo: '3-0-1-1' }
            ],
            B: [
                { name: 'Hip Thrust', sets: 3, reps: '10-12', type: 'strength', muscles: ['glutes', 'hamstrings'], pattern: 'hip_extension', tempo: '2-1-1-0' }
            ],
            C: [
                { name: 'Good Morning', sets: 3, reps: '10-12', type: 'strength', muscles: ['hamstrings', 'glutes', 'back'], pattern: 'hinge', tempo: '3-0-2-0' }
            ]
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏅 SPORT-SPECIFIC EXERCISE MAPPING
    // ═══════════════════════════════════════════════════════════════════════════
    
    sportMapping: {
        calcio: {
            preferredPlyometrics: ['Lateral Bound', 'Multi-directional Hop', 'Split Squat Jump'],
            avoidUpper: ['Overhead Press', 'Push Press'], // non rilevanti
            preferUpper: ['Push-up', 'Inverted Row'],
            mandatoryPrevention: [
                { name: 'Nordic Curl', sets: 3, reps: '4-6', type: 'eccentric', muscles: ['hamstrings'], technique: 'control descent 4s' },
                { name: 'Copenhagen Plank', sets: 3, reps: '8-10 per side', type: 'strength', muscles: ['adductors'], technique: 'hold 3s top' }
            ],
            coreEmphasis: ['Pallof Press', 'Anti-Rotation Chop']
        },
        basket: {
            preferredPlyometrics: ['Box Jump', 'Depth Jump', 'Vertical Jump'],
            preferUpper: ['Overhead Press', 'Pull-up'],
            mandatoryPrevention: [
                { name: 'Single-Leg Balance', sets: 3, reps: '30s per side', type: 'stability', muscles: ['ankles'], technique: 'eyes closed progression' },
                { name: 'Lateral Band Walk', sets: 3, reps: '10-12 per side', type: 'activation', muscles: ['glutes'], technique: 'stay low' }
            ],
            coreEmphasis: ['Dead Bug', 'Bird Dog']
        },
        boxe: {
            preferredPlyometrics: ['Medicine Ball Slam', 'Rotational Throw', 'Clap Push-up'],
            preferUpper: ['Push Press', 'Landmine Press'],
            mandatoryPrevention: [
                { name: 'Landmine Rotation', sets: 3, reps: '8-10 per side', type: 'power', muscles: ['core', 'shoulders'], technique: 'explosive rotation from hips' },
                { name: 'Band Pull-Apart', sets: 3, reps: '15-20', type: 'activation', muscles: ['rear_delts', 'rhomboids'], technique: 'squeeze at end range' }
            ],
            coreEmphasis: ['Russian Twist', 'Landmine Rotation', 'Pallof Press']
        },
        palestra: {
            // No specific restrictions
            mandatoryPrevention: []
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 ROTATION LOGIC - Determina quale variante usare
    // ═══════════════════════════════════════════════════════════════════════════
    
    getVariation(profile) {
        // Basato su: giorno della settimana + sessione numero
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0-6
        const weekNumber = Math.floor(today.getTime() / (7 * 24 * 60 * 60 * 1000));
        
        // Se l'utente ha un session number, usalo
        const sessionNumber = profile.sessionNumber || dayOfWeek;
        
        // Calcola variante: A(0), B(1), C(2)
        const variationIndex = (sessionNumber + weekNumber) % 3;
        const variations = ['A', 'B', 'C'];
        
        return variations[variationIndex];
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 EXERCISE DATABASE - Esercizi categorizzati
    // ═══════════════════════════════════════════════════════════════════════════
    
    exercises: {
        // PLYOMETRICS
        plyometrics: [
            { name: 'Box Jump', sets: 3, reps: '4-5', type: 'power', muscles: ['quadriceps', 'glutes', 'calves'] },
            { name: 'Depth Jump', sets: 3, reps: '3-4', type: 'power', muscles: ['quadriceps', 'calves'] },
            { name: 'Broad Jump', sets: 3, reps: '4-5', type: 'power', muscles: ['quadriceps', 'glutes', 'hamstrings'] },
            { name: 'Split Squat Jump', sets: 3, reps: '5', type: 'power', muscles: ['quadriceps', 'glutes'] },
            { name: 'Lateral Bound', sets: 3, reps: '5', type: 'power', muscles: ['glutes', 'adductors'] }
        ],
        
        // COMPOUND LOWER
        compoundLower: [
            { name: 'Back Squat', sets: 4, reps: '4-6', type: 'strength', muscles: ['quadriceps', 'glutes', 'hamstrings'], pattern: 'squat' },
            { name: 'Front Squat', sets: 4, reps: '4-6', type: 'strength', muscles: ['quadriceps', 'core'], pattern: 'squat' },
            { name: 'Trap Bar Deadlift', sets: 4, reps: '4-6', type: 'strength', muscles: ['quadriceps', 'glutes', 'hamstrings', 'back'], pattern: 'hinge' },
            { name: 'Romanian Deadlift', sets: 3, reps: '6-8', type: 'strength', muscles: ['hamstrings', 'glutes', 'back'], pattern: 'hinge' },
            { name: 'Conventional Deadlift', sets: 4, reps: '3-5', type: 'strength', muscles: ['hamstrings', 'glutes', 'back', 'quadriceps'], pattern: 'hinge' }
        ],
        
        // COMPOUND UPPER PUSH
        compoundPush: [
            { name: 'Bench Press', sets: 4, reps: '4-6', type: 'strength', muscles: ['chest', 'triceps', 'shoulders'], pattern: 'push' },
            { name: 'Overhead Press', sets: 4, reps: '5-8', type: 'strength', muscles: ['shoulders', 'triceps'], pattern: 'push' },
            { name: 'Push Press', sets: 4, reps: '4-6', type: 'power', muscles: ['shoulders', 'triceps', 'quadriceps'], pattern: 'push' },
            { name: 'Incline Bench Press', sets: 4, reps: '6-8', type: 'strength', muscles: ['chest', 'shoulders', 'triceps'], pattern: 'push' },
            { name: 'Dumbbell Bench Press', sets: 3, reps: '8-10', type: 'strength', muscles: ['chest', 'triceps'], pattern: 'push' }
        ],
        
        // COMPOUND UPPER PULL
        compoundPull: [
            { name: 'Weighted Pull-up', sets: 4, reps: '4-6', type: 'strength', muscles: ['back', 'biceps'], pattern: 'pull' },
            { name: 'Barbell Row', sets: 4, reps: '6-8', type: 'strength', muscles: ['back', 'biceps'], pattern: 'pull' },
            { name: 'Pendlay Row', sets: 4, reps: '5-6', type: 'power', muscles: ['back', 'biceps'], pattern: 'pull' },
            { name: 'Dumbbell Row', sets: 3, reps: '8-10', type: 'strength', muscles: ['back', 'biceps'], pattern: 'pull' },
            { name: 'Lat Pulldown', sets: 3, reps: '8-12', type: 'strength', muscles: ['back', 'biceps'], pattern: 'pull' }
        ],
        
        // UNILATERAL
        unilateral: [
            { name: 'Bulgarian Split Squat', sets: 3, reps: '8-10', type: 'strength', muscles: ['quadriceps', 'glutes'] },
            { name: 'Walking Lunge', sets: 3, reps: '10-12', type: 'strength', muscles: ['quadriceps', 'glutes'] },
            { name: 'Step-up', sets: 3, reps: '8-10', type: 'strength', muscles: ['quadriceps', 'glutes'] },
            { name: 'Single-Leg RDL', sets: 3, reps: '8-10', type: 'strength', muscles: ['hamstrings', 'glutes'] },
            { name: 'Rear Foot Elevated Split Squat', sets: 3, reps: '8-10', type: 'strength', muscles: ['quadriceps', 'glutes'] }
        ],
        
        // CORE
        core: [
            { name: 'Pallof Press', sets: 3, reps: '10-12', type: 'core', muscles: ['core', 'obliques'] },
            { name: 'Dead Bug', sets: 3, reps: '10', type: 'core', muscles: ['core'] },
            { name: 'Plank', sets: 3, reps: '30-45s', type: 'core', muscles: ['core'] },
            { name: 'Ab Wheel Rollout', sets: 3, reps: '8-10', type: 'core', muscles: ['core'] },
            { name: 'Bird Dog', sets: 3, reps: '10', type: 'core', muscles: ['core', 'back'] }
        ],
        
        // INJURY PREVENTION (sport-specific)
        injuryPrevention: {
            calcio: [
                { name: 'Nordic Curl', sets: 3, reps: '4-6', type: 'eccentric', muscles: ['hamstrings'] },
                { name: 'Copenhagen Plank', sets: 3, reps: '8-10', type: 'strength', muscles: ['adductors'] }
            ],
            basket: [
                { name: 'Single-Leg Balance', sets: 3, reps: '30s', type: 'stability', muscles: ['ankles'] },
                { name: 'Lateral Band Walk', sets: 3, reps: '10-12', type: 'activation', muscles: ['glutes'] }
            ],
            boxe: [
                { name: 'Face Pull', sets: 3, reps: '12-15', type: 'strength', muscles: ['rear_delts', 'rotator_cuff'] },
                { name: 'Neck Curl', sets: 2, reps: '15-20', type: 'strength', muscles: ['neck'] }
            ]
        },
        
        // ISOLATION (solo per ipertrofia) - WITH TEMPO FOR TUT
        isolation: {
            biceps: [
                { name: 'Incline Dumbbell Curl', sets: 3, reps: '10-12', type: 'hypertrophy', muscles: ['biceps'], rom: 'lengthened', tempo: '3-0-2-1', rest: '60s' },
                { name: 'Preacher Curl', sets: 3, reps: '10-12', type: 'hypertrophy', muscles: ['biceps'], rom: 'lengthened', tempo: '3-1-2-0', rest: '60s' },
                { name: 'Concentration Curl', sets: 3, reps: '12-15', type: 'hypertrophy', muscles: ['biceps'], rom: 'shortened', tempo: '2-1-2-1', rest: '45s' }
            ],
            triceps: [
                { name: 'Overhead Tricep Extension', sets: 3, reps: '10-12', type: 'hypertrophy', muscles: ['triceps'], rom: 'lengthened', tempo: '3-0-2-1', rest: '60s' },
                { name: 'Skull Crusher', sets: 3, reps: '10-12', type: 'hypertrophy', muscles: ['triceps'], rom: 'lengthened', tempo: '3-1-2-0', rest: '60s' },
                { name: 'Cable Pushdown', sets: 3, reps: '12-15', type: 'hypertrophy', muscles: ['triceps'], rom: 'shortened', tempo: '2-1-2-1', rest: '45s' }
            ],
            shoulders: [
                { name: 'Lateral Raise', sets: 4, reps: '12-15', type: 'hypertrophy', muscles: ['shoulders'], tempo: '2-1-2-0', rest: '45s' },
                { name: 'Rear Delt Fly', sets: 3, reps: '12-15', type: 'hypertrophy', muscles: ['rear_delts'], tempo: '2-1-2-1', rest: '45s' }
            ],
            chest: [
                { name: 'Cable Fly', sets: 3, reps: '12-15', type: 'hypertrophy', muscles: ['chest'], rom: 'lengthened', tempo: '3-1-2-0', rest: '60s' },
                { name: 'Pec Deck', sets: 3, reps: '12-15', type: 'hypertrophy', muscles: ['chest'], rom: 'shortened', tempo: '2-2-1-1', rest: '45s' }
            ],
            calves: [
                { name: 'Standing Calf Raise', sets: 4, reps: '12-15', type: 'hypertrophy', muscles: ['calves'], tempo: '2-2-2-0', rest: '45s' },
                { name: 'Seated Calf Raise', sets: 3, reps: '15-20', type: 'hypertrophy', muscles: ['calves'], tempo: '3-2-1-0', rest: '45s' }
            ]
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏗️ WORKOUT TEMPLATES - Strutture predefinite
    // ═══════════════════════════════════════════════════════════════════════════
    
    templates: {
        
        // POTENZA - Full Body (60 min)
        potenza_fullbody_60: {
            name: 'Power Full Body',
            duration: 60,
            goal: 'potenza',
            structure: [
                { category: 'warmup', count: 1 },
                { category: 'plyometrics', count: 1 },
                { category: 'compoundLower', count: 1 },
                { category: 'compoundPush', count: 1 },
                { category: 'compoundPull', count: 1 },
                { category: 'unilateral', count: 1 },  // ADDED: single-leg
                { category: 'coreMultiPlanar', count: 1 },  // UPGRADED: multi-planar
                { category: 'cooldown', count: 1 }
            ],
            totalExercises: 8
        },
        
        // POTENZA - Sport Specific (60 min) - ENHANCED
        potenza_sport_60: {
            name: 'Power Sport',
            duration: 60,
            goal: 'potenza',
            structure: [
                { category: 'warmup', count: 1 },
                { category: 'plyometrics', count: 1 },
                { category: 'compoundLower', count: 1 },
                { category: 'unilateral', count: 1 },  // ADDED: single-leg mandatory per sport
                { category: 'compoundPush', count: 1 },
                { category: 'compoundPull', count: 1 },
                { category: 'injuryPrevention', count: 1, sportSpecific: true },
                { category: 'coreMultiPlanar', count: 1 },  // UPGRADED
                { category: 'cooldown', count: 1 }
            ],
            totalExercises: 9
        },
        
        // IPERTROFIA - Full Body (60 min) - ENHANCED
        ipertrofia_fullbody_60: {
            name: 'Hypertrophy Full Body',
            duration: 60,
            goal: 'ipertrofia',
            structure: [
                { category: 'warmup', count: 1 },
                { category: 'compoundLower', count: 1 },
                { category: 'compoundPush', count: 1 },
                { category: 'compoundPull', count: 1 },
                { category: 'posteriorChain', count: 1 },  // Hip Thrust/RDL
                { category: 'unilateral', count: 1 },
                { category: 'isolation', count: 3, targets: ['biceps', 'triceps', 'shoulders'] },  // +1 shoulder
                { category: 'coreMultiPlanar', count: 1 },
                { category: 'cooldown', count: 1 }
            ],
            totalExercises: 12
        },
        
        // IPERTROFIA - Sport Specific (60 min) - ENHANCED
        ipertrofia_sport_60: {
            name: 'Hypertrophy Sport',
            duration: 60,
            goal: 'ipertrofia',
            structure: [
                { category: 'warmup', count: 1 },
                { category: 'plyometrics', count: 1 },  // ADDED: light plyo for sport specificity
                { category: 'compoundLower', count: 1 },
                { category: 'compoundPush', count: 1 },
                { category: 'compoundPull', count: 1 },
                { category: 'posteriorChain', count: 1 },  // Helps biomechanics balance
                { category: 'unilateral', count: 1 },
                { category: 'isolation', count: 2, targets: ['biceps', 'triceps'] },
                { category: 'injuryPrevention', count: 1, sportSpecific: true },
                { category: 'coreMultiPlanar', count: 1 },
                { category: 'cooldown', count: 1 }
            ],
            totalExercises: 13
        },
        
        // FORZA - Full Body (60 min)
        forza_fullbody_60: {
            name: 'Strength Full Body',
            duration: 60,
            goal: 'forza',
            structure: [
                { category: 'warmup', count: 1 },
                { category: 'compoundLower', count: 2 },  // squat + hinge
                { category: 'compoundPush', count: 1 },
                { category: 'compoundPull', count: 1 },
                { category: 'unilateral', count: 1 },
                { category: 'posteriorChain', count: 1 },  // ADDED
                { category: 'coreMultiPlanar', count: 1 },
                { category: 'cooldown', count: 1 }
            ],
            totalExercises: 9
        },
        
        // FORZA - Sport Specific (60 min) - ENHANCED
        forza_sport_60: {
            name: 'Strength Sport',
            duration: 60,
            goal: 'forza',
            structure: [
                { category: 'warmup', count: 1 },
                { category: 'compoundLower', count: 2 },  // Squat + Hinge heavy
                { category: 'compoundPush', count: 1 },
                { category: 'compoundPull', count: 1 },
                { category: 'unilateral', count: 1 },
                { category: 'posteriorChain', count: 1 },  // ADDED for better ratio
                { category: 'injuryPrevention', count: 1, sportSpecific: true },
                { category: 'coreMultiPlanar', count: 1 },
                { category: 'cooldown', count: 1 }
            ],
            totalExercises: 10
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🎲 EXERCISE SELECTOR - Selezione intelligente con variazioni
    // ═══════════════════════════════════════════════════════════════════════════
    
    selectExercise(category, context = {}, usedPatterns = new Set(), usedMuscles = new Set()) {
        const variation = context.variation || 'A';
        let pool = null;
        
        // Handle special categories first
        if (category === 'warmup') {
            return { name: 'Dynamic Warm-up', sets: 1, reps: '5 min', type: 'warmup' };
        }
        if (category === 'cooldown') {
            return { name: 'Stretching', sets: 1, reps: '5 min', type: 'cooldown' };
        }
        
        // Categories that return multiple exercises (array)
        if (category === 'coreMultiPlanar') {
            if (this.variations.coreMultiPlanar && this.variations.coreMultiPlanar[variation]) {
                return this.variations.coreMultiPlanar[variation].map(ex => ({ ...ex }));
            }
            return [];
        }
        
        // Check if we have variations for this category
        if (this.variations[category] && this.variations[category][variation]) {
            pool = this.variations[category][variation];
        }
        // Fall back to sport-specific prevention
        else if (category === 'injuryPrevention') {
            const sportMap = this.sportMapping[context.sport];
            if (sportMap && sportMap.mandatoryPrevention) {
                pool = sportMap.mandatoryPrevention;
            } else {
                pool = this.exercises.injuryPrevention[context.sport] || [];
            }
        } 
        // Isolation category
        else if (category === 'isolation') {
            const target = context.target || 'biceps';
            pool = this.exercises.isolation[target] || [];
        } 
        // Standard categories (arrays)
        else {
            pool = this.exercises[category];
        }
        
        if (!pool || !Array.isArray(pool) || pool.length === 0) return null;
        
        // Sport-specific filtering
        const sportMap = this.sportMapping[context.sport];
        if (sportMap && sportMap.avoidUpper && (category === 'compoundPush' || category === 'compoundPull')) {
            const filtered = pool.filter(ex => !sportMap.avoidUpper.includes(ex.name));
            // Only apply filter if we still have exercises left
            if (filtered.length > 0) {
                pool = filtered;
            }
            // Otherwise keep original pool (fallback)
        }
        
        // Filter by pattern to avoid duplicates
        let filtered = pool.filter(ex => {
            if (ex.pattern && usedPatterns.has(ex.pattern)) return false;
            return true;
        });
        
        // If all filtered out, use original pool
        if (filtered.length === 0) filtered = pool;
        
        // Safety check - ensure we have exercises
        if (!filtered || filtered.length === 0) {
            console.warn(`⚠️ No exercises found for ${category} (${context.sport}, variation ${variation})`);
            return null;
        }
        
        // Select first available (deterministic with variations)
        const selected = { ...filtered[0] };
        
        // Track pattern
        if (selected.pattern) usedPatterns.add(selected.pattern);
        
        return selected;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏋️ WORKOUT GENERATOR - Genera workout da template con variazione
    // ═══════════════════════════════════════════════════════════════════════════
    
    generate(profile) {
        const goal = (profile.goal || 'potenza').toLowerCase();
        const sport = (profile.sport || 'palestra').toLowerCase();
        const duration = profile.duration || 60;
        
        // Determina variazione (A/B/C)
        const variation = profile.variation || this.getVariation(profile);
        
        // Seleziona template
        let templateKey = `${goal}_fullbody_${duration}`;
        if (sport !== 'palestra' && this.templates[`${goal}_sport_${duration}`]) {
            templateKey = `${goal}_sport_${duration}`;
        }
        
        const template = this.templates[templateKey] || this.templates.potenza_fullbody_60;
        
        // Genera workout
        const exercises = [];
        const usedPatterns = new Set();
        const usedMuscles = new Set();
        
        // Context con variazione
        const baseContext = { ...profile, variation, sport };
        
        for (const slot of template.structure) {
            if (slot.category === 'isolation' && slot.targets) {
                // Multiple isolation exercises
                for (const target of slot.targets) {
                    const ex = this.selectExercise('isolation', { ...baseContext, target }, usedPatterns, usedMuscles);
                    if (ex) exercises.push(ex);
                }
            } else if (slot.category === 'coreMultiPlanar') {
                // Core multi-planar returns array of exercises
                const coreExercises = this.selectExercise('coreMultiPlanar', baseContext, usedPatterns, usedMuscles);
                if (Array.isArray(coreExercises)) {
                    exercises.push(...coreExercises);
                }
            } else {
                for (let i = 0; i < slot.count; i++) {
                    const context = { ...baseContext, sportSpecific: slot.sportSpecific };
                    const ex = this.selectExercise(slot.category, context, usedPatterns, usedMuscles);
                    if (ex) exercises.push(ex);
                }
            }
        }
        
        // ══════════════════════════════════════════════════════════════════════
        // AGE-ADJUSTED REPS - Over 50 usano range reps più alti per stessa stimolazione
        // Basato su: minor stress articolare con reps più alte a carichi moderati
        // ══════════════════════════════════════════════════════════════════════
        if (profile.age && profile.age >= 50) {
            exercises.forEach(ex => {
                if (ex.type === 'warmup' || ex.type === 'cooldown' || ex.type === 'mobility') return;
                
                // Parse reps se è stringa numerica
                const currentReps = parseInt(ex.reps);
                if (!isNaN(currentReps) && currentReps > 0 && currentReps <= 20) {
                    // Mapping: reps basse → range più alto
                    // 3-5 (forza) → 8-10
                    // 6-8 (forza/ipertrofia) → 10-12  
                    // 8-12 (ipertrofia) → 12-15
                    let newReps = ex.reps;
                    
                    if (currentReps <= 5) {
                        newReps = '8-10';
                        ex.notes = (ex.notes || '') + ' [Over 50: range aumentato per sicurezza articolare]';
                    } else if (currentReps <= 8) {
                        newReps = '10-12';
                        ex.notes = (ex.notes || '') + ' [Over 50: range aumentato]';
                    } else if (currentReps <= 12) {
                        newReps = '12-15';
                    }
                    // 12+ mantieni come sono
                    
                    ex.reps = newReps;
                }
            });
        }
        
        // Costruisci workout
        const workout = {
            title: `${template.name} - ${profile.level || 'Intermedio'} (${variation})`,
            focus: goal,
            sport: sport,
            duration: duration,
            variation: variation,
            exercises: exercises,
            generatedBy: 'ATLAS Template Engine v2.0',
            timestamp: new Date().toISOString()
        };
        
        return workout;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ✅ VALIDATION - Verifica workout generato
    // ═══════════════════════════════════════════════════════════════════════════
    
    validate(workout, profile) {
        const issues = [];
        
        // Check exercise count
        const goal = (profile.goal || '').toLowerCase();
        const maxExercises = goal === 'potenza' ? 12 : (goal === 'ipertrofia' ? 16 : 14);
        
        if (workout.exercises.length > maxExercises) {
            issues.push(`Troppi esercizi: ${workout.exercises.length} (max ${maxExercises})`);
        }
        
        // Check patterns
        const patterns = new Set();
        const hasWarmup = workout.exercises.some(e => e.type === 'warmup');
        const hasCooldown = workout.exercises.some(e => e.type === 'cooldown');
        const hasPush = workout.exercises.some(e => e.pattern === 'push' || e.muscles?.includes('chest'));
        const hasPull = workout.exercises.some(e => e.pattern === 'pull' || e.muscles?.includes('back'));
        
        if (!hasWarmup) issues.push('Manca warm-up');
        if (!hasCooldown) issues.push('Manca cool-down');
        if (hasPush && !hasPull) issues.push('Sbilanciamento push/pull');
        
        // Goal-specific checks
        if (goal === 'potenza') {
            const hasPlyo = workout.exercises.some(e => e.type === 'power');
            if (!hasPlyo) issues.push('Potenza: manca pliometria');
            
            const hasIsolation = workout.exercises.some(e => e.type === 'hypertrophy');
            if (hasIsolation) issues.push('Potenza: isolation non appropriato');
        }
        
        return {
            valid: issues.length === 0,
            issues,
            score: Math.max(0, 100 - (issues.length * 15))
        };
    }
};

// Quick test function
window.testTemplate = function(sport = 'palestra', goal = 'potenza', variation = null) {
    const profile = { sport, goal, level: 'intermedio', duration: 60, variation };
    const workout = window.ATLASTemplates.generate(profile);
    
    console.log(`📋 ${workout.title} (${workout.exercises.length} esercizi)`);
    workout.exercises.forEach((e, i) => {
        let details = `${e.sets}x${e.reps}`;
        if (e.tempo) details += ` tempo:${e.tempo}`;
        if (e.technique) details += ` [${e.technique}]`;
        console.log(`  ${i+1}. ${e.name} - ${details}`);
    });
    
    const validation = window.ATLASTemplates.validate(workout, profile);
    console.log(`\n✅ Validation: ${validation.valid ? 'PASSED' : 'FAILED'}`);
    if (validation.issues.length) {
        console.log('Issues:', validation.issues);
    }
    
    // Also run scientific validator
    if (window.ScientificWorkoutValidator) {
        const sciValid = window.ScientificWorkoutValidator.validate(workout, profile);
        console.log(`🔬 Scientific Score: ${sciValid.score}% (${sciValid.grade.letter})`);
    }
    
    return workout;
};

// Test all variations
window.testAllVariations = function(sport = 'palestra', goal = 'potenza') {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`🔄 TESTING ALL VARIATIONS: ${sport} / ${goal}`);
    console.log(`${'═'.repeat(60)}`);
    
    ['A', 'B', 'C'].forEach(v => {
        console.log(`\n--- VARIANTE ${v} ---`);
        testTemplate(sport, goal, v);
    });
};

// Deep analysis - mostra breakdown per categoria
window.analyzeTemplate = function(sport = 'palestra', goal = 'potenza', variation = 'A') {
    const profile = { sport, goal, level: 'intermedio', duration: 60, variation };
    const workout = window.ATLASTemplates.generate(profile);
    
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`🔬 DEEP ANALYSIS: ${sport} / ${goal} / Variante ${variation}`);
    console.log(`${'═'.repeat(70)}`);
    
    if (!window.ScientificWorkoutValidator) {
        console.error('❌ ScientificWorkoutValidator non caricato!');
        return;
    }
    
    const validation = window.ScientificWorkoutValidator.validate(workout, profile);
    
    // Mostra breakdown
    console.log(`\n📊 SCORE BREAKDOWN (Total: ${validation.score}% - ${validation.grade.letter})`);
    console.log('─'.repeat(50));
    
    const weights = {
        volume: 12, sequence: 8, biomechanics: 12, sportSpecificity: 18,
        safety: 20, context: 8, sfr: 5, advancedScience: 17
    };
    
    for (const [key, analysis] of Object.entries(validation.analyses)) {
        const weight = weights[key] || 10;
        const contribution = ((analysis.score / 100) * weight).toFixed(1);
        const bar = '█'.repeat(Math.floor(analysis.score / 10)) + '░'.repeat(10 - Math.floor(analysis.score / 10));
        console.log(`  ${key.padEnd(18)} ${bar} ${analysis.score}% (weight:${weight}, contrib:${contribution})`);
        
        // Mostra findings critici
        if (analysis.findings) {
            analysis.findings.filter(f => f.type === 'error' || f.type === 'warning').slice(0, 2).forEach(f => {
                console.log(`    └─ ${f.type === 'error' ? '❌' : '⚠️'} ${f.msg}`);
            });
        }
    }
    
    console.log('\n🎯 GAP ANALYSIS (cosa manca per 100%):');
    console.log('─'.repeat(50));
    
    for (const [key, analysis] of Object.entries(validation.analyses)) {
        if (analysis.score < 100) {
            const gap = 100 - analysis.score;
            const weight = weights[key] || 10;
            const impact = ((gap / 100) * weight).toFixed(1);
            console.log(`  ${key}: -${gap}% (impact: -${impact} punti finali)`);
        }
    }
    
    return { workout, validation };
};

// Comprehensive test - tutti sport × goal × variazioni
window.fullSystemTest = function() {
    const sports = ['palestra', 'calcio', 'basket', 'boxe'];
    const goals = ['potenza', 'ipertrofia', 'forza'];
    const variations = ['A', 'B', 'C'];
    
    const results = [];
    
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`🧪 FULL SYSTEM TEST - ${sports.length}×${goals.length}×${variations.length} = ${sports.length * goals.length * variations.length} combinazioni`);
    console.log(`${'═'.repeat(70)}\n`);
    
    for (const sport of sports) {
        for (const goal of goals) {
            for (const variation of variations) {
                const profile = { sport, goal, level: 'intermedio', duration: 60, variation };
                const workout = window.ATLASTemplates.generate(profile);
                
                let score = 0;
                let grade = 'N/A';
                
                if (window.ScientificWorkoutValidator) {
                    const validation = window.ScientificWorkoutValidator.validate(workout, profile);
                    score = validation.score;
                    grade = validation.grade.letter;
                }
                
                results.push({ sport, goal, variation, score, grade, exerciseCount: workout.exercises.length });
            }
        }
    }
    
    // Summary table
    console.log('📊 RESULTS MATRIX:');
    console.log('─'.repeat(70));
    console.log('Sport      | Goal       | A    | B    | C    | Avg  | Grade');
    console.log('─'.repeat(70));
    
    for (const sport of sports) {
        for (const goal of goals) {
            const sportGoalResults = results.filter(r => r.sport === sport && r.goal === goal);
            const scores = sportGoalResults.map(r => r.score);
            const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(0);
            const avgGrade = avg >= 90 ? 'A+' : avg >= 80 ? 'A' : avg >= 70 ? 'B' : avg >= 60 ? 'C' : 'D';
            
            console.log(`${sport.padEnd(10)} | ${goal.padEnd(10)} | ${scores[0]}% | ${scores[1]}% | ${scores[2]}% | ${avg}% | ${avgGrade}`);
        }
    }
    
    // Stats
    const allScores = results.map(r => r.score);
    const avgTotal = (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1);
    const minScore = Math.min(...allScores);
    const maxScore = Math.max(...allScores);
    
    console.log('─'.repeat(70));
    console.log(`\n📈 STATISTICS:`);
    console.log(`   Average: ${avgTotal}%`);
    console.log(`   Min: ${minScore}% | Max: ${maxScore}%`);
    console.log(`   Range: ${maxScore - minScore}%`);
    console.log(`   A+ (90%+): ${results.filter(r => r.score >= 90).length}`);
    console.log(`   A (80%+): ${results.filter(r => r.score >= 80).length}`);
    console.log(`   B (70%+): ${results.filter(r => r.score >= 70).length}`);
    console.log(`   C (60%+): ${results.filter(r => r.score >= 60 && r.score < 70).length}`);
    console.log(`   D/F (<60%): ${results.filter(r => r.score < 60).length}`);
    
    return results;
};

console.log('🏗️ ATLAS Template Engine v2.0 loaded!');
console.log('   → testTemplate("palestra", "potenza") - Test current variation');
console.log('   → testTemplate("palestra", "potenza", "A") - Test specific variation');
console.log('   → testAllVariations("palestra", "potenza") - Test A/B/C');
console.log('   → analyzeTemplate("palestra", "potenza", "A") - Deep analysis with gap');
console.log('   → fullSystemTest() - Test ALL combinations');
console.log('   → ATLASTemplates.generate(profile) - Generate workout from template');
