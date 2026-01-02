/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🌍 ATLAS SPORTS MASTER SYSTEM v1.0
 * NASA-Level Sport-Specific Training Intelligence
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sistema centrale che orchestra tutti i moduli sport-specifici.
 * Ogni sport ha:
 * - Metodologie scientifiche validate
 * - Esercizi specifici con video
 * - Periodizzazione sport-specific
 * - Prevenzione infortuni evidence-based
 * - Integrazione calendario squadra/gare
 * 
 * SPORTS SUPPORTATI:
 * - Boxe (ATLASBoxing) ✅
 * - Calcio (ATLASSoccer)
 * - Basket (ATLASBasketball)
 * - MMA/Arti Marziali (ATLASMMA)
 * - CrossFit/Functional (ATLASCrossFit)
 * - Tennis (ATLASTennis)
 * - Rugby (ATLASRugby)
 * - Nuoto (ATLASSwimming)
 * - Ciclismo (ATLASCycling)
 * - Running (ATLASRunning)
 * 
 * OBIETTIVO: Sostituire completamente preparatori atletici umani
 */

window.ATLASSportsMaster = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 SPORT REGISTRY
    // ═══════════════════════════════════════════════════════════════════════════
    
    sports: {
        // Combat Sports
        boxe: { module: 'ATLASBoxing', category: 'combat', hasModule: true },
        boxing: { module: 'ATLASBoxing', category: 'combat', alias: 'boxe' },
        mma: { module: 'ATLASMMA', category: 'combat', hasModule: true },
        kickboxing: { module: 'ATLASMMA', category: 'combat', alias: 'mma' },
        muay_thai: { module: 'ATLASMMA', category: 'combat', alias: 'mma' },
        jiu_jitsu: { module: 'ATLASMMA', category: 'combat', alias: 'mma' },
        wrestling: { module: 'ATLASMMA', category: 'combat', alias: 'mma' },
        
        // Team Sports
        calcio: { module: 'ATLASSoccer', category: 'team', hasModule: true },
        soccer: { module: 'ATLASSoccer', category: 'team', alias: 'calcio' },
        football: { module: 'ATLASSoccer', category: 'team', alias: 'calcio' },
        basket: { module: 'ATLASBasketball', category: 'team', hasModule: true },
        basketball: { module: 'ATLASBasketball', category: 'team', alias: 'basket' },
        pallavolo: { module: 'ATLASVolleyball', category: 'team', hasModule: true },
        volleyball: { module: 'ATLASVolleyball', category: 'team', alias: 'pallavolo' },
        rugby: { module: 'ATLASRugby', category: 'team', hasModule: true },
        
        // Racket Sports
        tennis: { module: 'ATLASTennis', category: 'racket', hasModule: true },
        padel: { module: 'ATLASTennis', category: 'racket', alias: 'tennis' },
        badminton: { module: 'ATLASTennis', category: 'racket', alias: 'tennis' },
        
        // Endurance Sports
        running: { module: 'ATLASRunning', category: 'endurance', hasModule: true },
        corsa: { module: 'ATLASRunning', category: 'endurance', alias: 'running' },
        maratona: { module: 'ATLASRunning', category: 'endurance', alias: 'running' },
        triathlon: { module: 'ATLASTriathlon', category: 'endurance', hasModule: true },
        ciclismo: { module: 'ATLASCycling', category: 'endurance', hasModule: true },
        cycling: { module: 'ATLASCycling', category: 'endurance', alias: 'ciclismo' },
        nuoto: { module: 'ATLASSwimming', category: 'endurance', hasModule: true },
        swimming: { module: 'ATLASSwimming', category: 'endurance', alias: 'nuoto' },
        
        // Strength/Fitness
        palestra: { module: 'ATLASGym', category: 'fitness', hasModule: true },
        gym: { module: 'ATLASGym', category: 'fitness', alias: 'palestra' },
        bodybuilding: { module: 'ATLASGym', category: 'fitness', alias: 'palestra' },
        powerlifting: { module: 'ATLASPowerlifting', category: 'fitness', hasModule: true },
        crossfit: { module: 'ATLASCrossFit', category: 'fitness', hasModule: true },
        functional: { module: 'ATLASCrossFit', category: 'fitness', alias: 'crossfit' },
        calisthenics: { module: 'ATLASCalisthenics', category: 'fitness', hasModule: true }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧬 SCIENTIFIC METHODOLOGY DATABASE
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Metodologie scientifiche per categoria sport
     * Basate su letteratura peer-reviewed
     */
    methodologies: {
        
        combat: {
            name: 'Combat Sports Methodology',
            principles: [
                'Power = Force × Velocity (potenza colpi)',
                'Rate of Force Development (RFD) è critico',
                'Anti-rotation core per trasferimento potenza',
                'Condizionamento round-based (3 min on, 1 min off)',
                'Technical skill > raw strength',
                'Recovery tra round simula match'
            ],
            energySystems: {
                aerobic: 0.30,      // 30% base aerobica
                anaerobic_lactic: 0.40,  // 40% lattacido
                anaerobic_alactic: 0.30  // 30% esplosività
            },
            keyMetrics: ['punch_power', 'reaction_time', 'vo2max', 'lactate_threshold'],
            injuryRisk: ['shoulders', 'wrists', 'neck', 'knees'],
            periodization: 'block' // Block periodization per peaking
        },
        
        team: {
            name: 'Team Sports Methodology',
            principles: [
                'Repeated Sprint Ability (RSA)',
                'Change of Direction Speed (CODS)',
                'Eccentric strength per decelerazione',
                'Injury prevention ACL/hamstring',
                'Game-specific conditioning',
                'Periodizzazione attorno a calendario partite'
            ],
            energySystems: {
                aerobic: 0.60,      // 60% base aerobica per recupero
                anaerobic_lactic: 0.25,  // 25% sprint ripetuti
                anaerobic_alactic: 0.15  // 15% sprint singoli
            },
            keyMetrics: ['sprint_speed', 'agility', 'vertical_jump', 'yo_yo_test'],
            injuryRisk: ['acl', 'hamstrings', 'ankles', 'groin'],
            periodization: 'undulating' // Daily undulating per stagione lunga
        },
        
        racket: {
            name: 'Racket Sports Methodology',
            principles: [
                'Rotational power (servizio, colpi)',
                'Lateral movement speed',
                'Shoulder stability e prevenzione',
                'Core anti-rotation per transfer',
                'Reaction time e anticipazione',
                'Interval training sport-specific'
            ],
            energySystems: {
                aerobic: 0.50,
                anaerobic_lactic: 0.30,
                anaerobic_alactic: 0.20
            },
            keyMetrics: ['serve_speed', 'lateral_speed', 'reaction_time', 'endurance'],
            injuryRisk: ['shoulder', 'elbow', 'wrist', 'ankle'],
            periodization: 'block'
        },
        
        endurance: {
            name: 'Endurance Sports Methodology',
            principles: [
                'Polarized training (80/20 rule)',
                'Zone 2 base building',
                'Threshold training',
                'VO2max intervals',
                'Taper e peaking per gare',
                'Strength training per economia di movimento'
            ],
            energySystems: {
                aerobic: 0.85,
                anaerobic_lactic: 0.10,
                anaerobic_alactic: 0.05
            },
            keyMetrics: ['vo2max', 'lactate_threshold', 'economy', 'ftp'],
            injuryRisk: ['knees', 'achilles', 'it_band', 'shin_splints'],
            periodization: 'linear' // Build progressivo per gare
        },
        
        fitness: {
            name: 'Fitness/Strength Methodology',
            principles: [
                'Progressive overload sistematico',
                'Specificità (SAID principle)',
                'Volume → Intensity → Peak',
                'Deload ogni 4-6 settimane',
                'Movement patterns > muscles',
                'Compound lifts foundation'
            ],
            energySystems: {
                aerobic: 0.20,
                anaerobic_lactic: 0.30,
                anaerobic_alactic: 0.50
            },
            keyMetrics: ['1rm_squat', '1rm_bench', '1rm_deadlift', 'body_composition'],
            injuryRisk: ['lower_back', 'shoulders', 'knees', 'elbows'],
            periodization: 'block' // Hypertrophy → Strength → Power
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 SPORT DETECTION & ROUTING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Rileva e normalizza lo sport
     */
    detectSport(sportInput) {
        if (!sportInput) return { sport: 'palestra', category: 'fitness' };
        
        const normalized = String(sportInput).toLowerCase().trim()
            .replace(/\s+/g, '_')
            .replace(/[àáâã]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõ]/g, 'o')
            .replace(/[ùúûü]/g, 'u');
        
        // Check diretto
        if (this.sports[normalized]) {
            const sport = this.sports[normalized];
            if (sport.alias) {
                return { 
                    sport: sport.alias, 
                    category: this.sports[sport.alias]?.category || 'fitness',
                    module: this.sports[sport.alias]?.module
                };
            }
            return { sport: normalized, category: sport.category, module: sport.module };
        }
        
        // Fuzzy match
        for (const [key, value] of Object.entries(this.sports)) {
            if (normalized.includes(key) || key.includes(normalized)) {
                if (value.alias) {
                    return { 
                        sport: value.alias, 
                        category: this.sports[value.alias]?.category || 'fitness',
                        module: this.sports[value.alias]?.module
                    };
                }
                return { sport: key, category: value.category, module: value.module };
            }
        }
        
        // Default
        return { sport: 'palestra', category: 'fitness', module: 'ATLASGym' };
    },
    
    /**
     * Ottieni il modulo sport-specifico
     */
    getModule(sport) {
        const detected = this.detectSport(sport);
        const moduleName = detected.module;
        
        // Check se il modulo esiste
        if (typeof window[moduleName] !== 'undefined') {
            return window[moduleName];
        }
        
        console.warn(`⚠️ Modulo ${moduleName} non caricato, uso fallback`);
        return null;
    },
    
    /**
     * Verifica se uno sport ha un modulo dedicato
     */
    hasModule(sport) {
        const module = this.getModule(sport);
        return module !== null;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 WORKOUT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Genera workout sport-specifico
     */
    generateWorkout(profile, sessionType = 'complete') {
        const detected = this.detectSport(profile.sport);
        const module = this.getModule(profile.sport);
        
        console.log(`🌍 Sports Master: ${detected.sport} (${detected.category})`);
        
        if (module && typeof module.generateWorkout === 'function') {
            // Usa modulo specifico
            return module.generateWorkout(profile, sessionType);
        }
        
        // Fallback: genera con metodologia categoria
        return this.generateGenericWorkout(profile, detected.category, sessionType);
    },
    
    /**
     * Genera workout generico basato su categoria
     */
    generateGenericWorkout(profile, category, sessionType) {
        const methodology = this.methodologies[category] || this.methodologies.fitness;
        
        console.log(`📋 Usando metodologia: ${methodology.name}`);
        
        // Costruisci workout base con principi della categoria
        const workout = {
            name: `${profile.sport} - ${sessionType}`,
            type: sessionType,
            sport: profile.sport,
            category: category,
            methodology: methodology.name,
            exercises: [],
            metadata: {
                generatedAt: new Date().toISOString(),
                module: 'ATLASSportsMaster',
                category: category
            }
        };
        
        // Aggiungi esercizi base per categoria
        workout.exercises = this.getExercisesForCategory(category, sessionType, profile);
        
        return workout;
    },
    
    /**
     * Ottieni esercizi per categoria
     */
    getExercisesForCategory(category, sessionType, profile) {
        const exercises = [];
        
        // Warmup universale adattato
        exercises.push({
            name: 'Dynamic Warm-up',
            sets: 1,
            reps: '5-8 min',
            type: 'warmup',
            phase: 'warmup',
            notes: 'Riscaldamento dinamico sport-specifico'
        });
        
        // Esercizi base per categoria
        const categoryExercises = {
            combat: [
                { name: 'Shadow Work', sets: 3, reps: '3 min', type: 'technique', phase: 'main' },
                { name: 'Heavy Bag', sets: 4, reps: '3 min', type: 'conditioning', phase: 'main' },
                { name: 'Medicine Ball Rotation', sets: 3, reps: '10 per side', type: 'power', phase: 'main' },
                { name: 'Push-up Explosive', sets: 3, reps: '10', type: 'power', phase: 'main' },
                { name: 'Pull-up', sets: 3, reps: '8-10', type: 'strength', phase: 'main' },
                { name: 'Pallof Press', sets: 3, reps: '10 per side', type: 'core', phase: 'main' }
            ],
            team: [
                { name: 'Sprint Intervals', sets: 6, reps: '20m', type: 'speed', phase: 'main' },
                { name: 'Agility Ladder', sets: 3, reps: '30s', type: 'agility', phase: 'main' },
                { name: 'Box Jump', sets: 3, reps: '5', type: 'power', phase: 'main' },
                { name: 'Single Leg Squat', sets: 3, reps: '8 per side', type: 'strength', phase: 'main' },
                { name: 'Nordic Curl', sets: 3, reps: '6', type: 'prevention', phase: 'main' },
                { name: 'Copenhagen Plank', sets: 3, reps: '30s per side', type: 'prevention', phase: 'main' }
            ],
            racket: [
                { name: 'Lateral Shuffle', sets: 4, reps: '30s', type: 'agility', phase: 'main' },
                { name: 'Medicine Ball Rotational Throw', sets: 3, reps: '8 per side', type: 'power', phase: 'main' },
                { name: 'Single Arm Cable Row', sets: 3, reps: '12', type: 'strength', phase: 'main' },
                { name: 'Split Squat Jump', sets: 3, reps: '6 per side', type: 'power', phase: 'main' },
                { name: 'External Rotation', sets: 3, reps: '15', type: 'prevention', phase: 'main' },
                { name: 'Plank to Push-up', sets: 3, reps: '10', type: 'core', phase: 'main' }
            ],
            endurance: [
                { name: 'Zone 2 Cardio', sets: 1, reps: '30-45 min', type: 'aerobic', phase: 'main' },
                { name: 'Tempo Intervals', sets: 4, reps: '5 min @ threshold', type: 'threshold', phase: 'main' },
                { name: 'Single Leg Deadlift', sets: 3, reps: '10', type: 'strength', phase: 'main' },
                { name: 'Calf Raise', sets: 3, reps: '15', type: 'strength', phase: 'main' },
                { name: 'Hip Flexor Stretch', sets: 2, reps: '60s per side', type: 'mobility', phase: 'main' }
            ],
            fitness: [
                { name: 'Back Squat', sets: 4, reps: '6-8', type: 'strength', phase: 'main' },
                { name: 'Bench Press', sets: 4, reps: '6-8', type: 'strength', phase: 'main' },
                { name: 'Barbell Row', sets: 4, reps: '8-10', type: 'strength', phase: 'main' },
                { name: 'Overhead Press', sets: 3, reps: '8-10', type: 'strength', phase: 'main' },
                { name: 'Romanian Deadlift', sets: 3, reps: '10', type: 'strength', phase: 'main' },
                { name: 'Plank', sets: 3, reps: '45s', type: 'core', phase: 'main' }
            ]
        };
        
        exercises.push(...(categoryExercises[category] || categoryExercises.fitness));
        
        // Cooldown
        exercises.push({
            name: 'Stretching & Cooldown',
            sets: 1,
            reps: '5 min',
            type: 'cooldown',
            phase: 'cooldown'
        });
        
        return exercises;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📅 SPLIT DETERMINATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Determina split ottimale per sport
     */
    getSplit(sport, daysPerWeek) {
        const detected = this.detectSport(sport);
        const module = this.getModule(sport);
        
        // Se il modulo ha una funzione split, usala
        if (module && typeof module.getSplit === 'function') {
            return module.getSplit(daysPerWeek);
        }
        
        // Altrimenti usa split per categoria
        return this.getCategorySplit(detected.category, daysPerWeek);
    },
    
    /**
     * Split per categoria sport
     */
    getCategorySplit(category, daysPerWeek) {
        const splits = {
            combat: {
                2: { name: 'Combat 2-Day', sessions: [
                    { name: 'Strength + Bag', type: 'strength', sessionType: 'strength' },
                    { name: 'Conditioning', type: 'conditioning', sessionType: 'conditioning' }
                ]},
                3: { name: 'Combat 3-Day', sessions: [
                    { name: 'Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Technical', type: 'technique', sessionType: 'technique' },
                    { name: 'Conditioning', type: 'conditioning', sessionType: 'conditioning' }
                ]},
                4: { name: 'Combat 4-Day', sessions: [
                    { name: 'Strength Upper', type: 'strength', sessionType: 'strength' },
                    { name: 'Technical', type: 'technique', sessionType: 'technique' },
                    { name: 'Strength Lower', type: 'strength', sessionType: 'strength' },
                    { name: 'Conditioning', type: 'conditioning', sessionType: 'conditioning' }
                ]}
            },
            team: {
                2: { name: 'Team Sport 2-Day', sessions: [
                    { name: 'Strength + Power', type: 'strength', sessionType: 'strength' },
                    { name: 'Speed + Conditioning', type: 'speed', sessionType: 'conditioning' }
                ]},
                3: { name: 'Team Sport 3-Day', sessions: [
                    { name: 'Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Speed & Agility', type: 'speed', sessionType: 'speed' },
                    { name: 'Power + Conditioning', type: 'power', sessionType: 'conditioning' }
                ]},
                4: { name: 'Team Sport 4-Day', sessions: [
                    { name: 'Max Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Speed', type: 'speed', sessionType: 'speed' },
                    { name: 'Power', type: 'power', sessionType: 'power' },
                    { name: 'Conditioning', type: 'conditioning', sessionType: 'conditioning' }
                ]}
            },
            racket: {
                2: { name: 'Racket 2-Day', sessions: [
                    { name: 'Strength + Rotation', type: 'strength', sessionType: 'strength' },
                    { name: 'Agility + Conditioning', type: 'agility', sessionType: 'conditioning' }
                ]},
                3: { name: 'Racket 3-Day', sessions: [
                    { name: 'Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Speed & Agility', type: 'speed', sessionType: 'speed' },
                    { name: 'Conditioning', type: 'conditioning', sessionType: 'conditioning' }
                ]}
            },
            endurance: {
                2: { name: 'Endurance 2-Day', sessions: [
                    { name: 'Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Intervals', type: 'intervals', sessionType: 'conditioning' }
                ]},
                3: { name: 'Endurance 3-Day', sessions: [
                    { name: 'Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Threshold', type: 'threshold', sessionType: 'threshold' },
                    { name: 'VO2max Intervals', type: 'intervals', sessionType: 'intervals' }
                ]},
                4: { name: 'Endurance 4-Day', sessions: [
                    { name: 'Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Easy/Recovery', type: 'easy', sessionType: 'easy' },
                    { name: 'Threshold', type: 'threshold', sessionType: 'threshold' },
                    { name: 'Long/Intervals', type: 'long', sessionType: 'long' }
                ]}
            },
            fitness: {
                2: { name: 'Upper/Lower', sessions: [
                    { name: 'Upper Body', type: 'upper', sessionType: 'upper' },
                    { name: 'Lower Body', type: 'lower', sessionType: 'lower' }
                ]},
                3: { name: 'Push/Pull/Legs', sessions: [
                    { name: 'Push', type: 'push', sessionType: 'push' },
                    { name: 'Pull', type: 'pull', sessionType: 'pull' },
                    { name: 'Legs', type: 'legs', sessionType: 'legs' }
                ]},
                4: { name: 'Upper/Lower x2', sessions: [
                    { name: 'Upper A', type: 'upper', sessionType: 'upper' },
                    { name: 'Lower A', type: 'lower', sessionType: 'lower' },
                    { name: 'Upper B', type: 'upper', sessionType: 'upper' },
                    { name: 'Lower B', type: 'lower', sessionType: 'lower' }
                ]},
                5: { name: 'PPL + Upper/Lower', sessions: [
                    { name: 'Push', type: 'push', sessionType: 'push' },
                    { name: 'Pull', type: 'pull', sessionType: 'pull' },
                    { name: 'Legs', type: 'legs', sessionType: 'legs' },
                    { name: 'Upper', type: 'upper', sessionType: 'upper' },
                    { name: 'Lower', type: 'lower', sessionType: 'lower' }
                ]},
                6: { name: 'PPL x2', sessions: [
                    { name: 'Push A', type: 'push', sessionType: 'push' },
                    { name: 'Pull A', type: 'pull', sessionType: 'pull' },
                    { name: 'Legs A', type: 'legs', sessionType: 'legs' },
                    { name: 'Push B', type: 'push', sessionType: 'push' },
                    { name: 'Pull B', type: 'pull', sessionType: 'pull' },
                    { name: 'Legs B', type: 'legs', sessionType: 'legs' }
                ]}
            }
        };
        
        const categorySplits = splits[category] || splits.fitness;
        return categorySplits[daysPerWeek] || categorySplits[3] || splits.fitness[3];
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏥 INJURY PREVENTION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Ottieni esercizi prevenzione infortuni per sport
     */
    getInjuryPrevention(sport) {
        const detected = this.detectSport(sport);
        const methodology = this.methodologies[detected.category];
        
        if (!methodology) return [];
        
        const preventionExercises = {
            // ACL prevention
            acl: [
                { name: 'Nordic Curl', sets: 3, reps: '6', notes: 'Eccentrico controllato' },
                { name: 'Single Leg Squat', sets: 3, reps: '8 per side', notes: 'Ginocchio stabile' },
                { name: 'Landing Mechanics Drill', sets: 3, reps: '10', notes: 'Atterraggi soft' }
            ],
            // Hamstring prevention
            hamstrings: [
                { name: 'Nordic Curl', sets: 3, reps: '6', notes: 'Eccentrico 3-4 sec' },
                { name: 'Romanian Deadlift', sets: 3, reps: '10', notes: 'Stretch sotto carico' },
                { name: 'Glute Bridge March', sets: 3, reps: '10 per side', notes: 'Hip stability' }
            ],
            // Shoulder prevention
            shoulders: [
                { name: 'Face Pull', sets: 3, reps: '15', notes: 'Squeeze finale' },
                { name: 'External Rotation', sets: 3, reps: '12', notes: 'Gomito fisso' },
                { name: 'Band Pull-Apart', sets: 3, reps: '20', notes: 'Scapole retratte' },
                { name: 'YTWL', sets: 2, reps: '10 each', notes: 'Controllo movimento' }
            ],
            // Ankle prevention
            ankles: [
                { name: 'Single Leg Balance', sets: 3, reps: '30s per side', notes: 'Occhi chiusi progression' },
                { name: 'Calf Raise', sets: 3, reps: '15', notes: 'Full ROM' },
                { name: 'Ankle Circles', sets: 2, reps: '10 each direction', notes: 'Mobilità' }
            ],
            // Lower back prevention
            lower_back: [
                { name: 'Dead Bug', sets: 3, reps: '10 per side', notes: 'Lombare a terra' },
                { name: 'Bird Dog', sets: 3, reps: '10 per side', notes: 'Controllo anti-rotation' },
                { name: 'McGill Big 3', sets: 3, reps: '10s holds', notes: 'Curl-up, Side Plank, Bird Dog' }
            ],
            // Groin prevention
            groin: [
                { name: 'Copenhagen Plank', sets: 3, reps: '30s per side', notes: 'Adduttori attivi' },
                { name: 'Lateral Lunge', sets: 3, reps: '8 per side', notes: 'Stretch dinamico' },
                { name: 'Adductor Squeeze', sets: 3, reps: '10s holds', notes: 'Isometrico' }
            ]
        };
        
        // Seleziona prevenzione basata su rischi dello sport
        const exercises = [];
        methodology.injuryRisk.forEach(risk => {
            if (preventionExercises[risk]) {
                exercises.push(...preventionExercises[risk]);
            }
        });
        
        return exercises;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 ANALYTICS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Ottieni statistiche sistema
     */
    getStats() {
        const sports = Object.keys(this.sports).filter(s => !this.sports[s].alias);
        const categories = [...new Set(Object.values(this.sports).map(s => s.category))];
        
        let modulesLoaded = 0;
        sports.forEach(sport => {
            if (this.hasModule(sport)) modulesLoaded++;
        });
        
        return {
            totalSports: sports.length,
            categories: categories.length,
            modulesLoaded: modulesLoaded,
            coverage: Math.round((modulesLoaded / sports.length) * 100) + '%'
        };
    },
    
    /**
     * Lista tutti gli sport supportati
     */
    listSports() {
        const sports = {};
        Object.entries(this.sports).forEach(([key, value]) => {
            if (!value.alias) {
                sports[key] = {
                    category: value.category,
                    hasModule: this.hasModule(key),
                    module: value.module
                };
            }
        });
        return sports;
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🌍 ATLAS Sports Master v1.0 loaded!');
console.log('   → Supported sports: ' + Object.keys(ATLASSportsMaster.sports).filter(s => !ATLASSportsMaster.sports[s].alias).length);
console.log('   → ATLASSportsMaster.detectSport(name) - Detect and normalize sport');
console.log('   → ATLASSportsMaster.generateWorkout(profile, type) - Generate sport-specific workout');
console.log('   → ATLASSportsMaster.getSplit(sport, days) - Get optimal split');
console.log('   → ATLASSportsMaster.getInjuryPrevention(sport) - Get injury prevention exercises');
