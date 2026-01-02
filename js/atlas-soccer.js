/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ⚽ ATLAS SOCCER MODULE v1.0
 * NASA-Level Football/Soccer Training Intelligence
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Modulo specifico per il calcio basato su:
 * - Repeated Sprint Ability (RSA)
 * - Change of Direction Speed (CODS)
 * - Injury Prevention (ACL, Hamstring, Groin)
 * - In-season vs Off-season periodization
 * - Match Day -1, -2, -3 protocols
 * 
 * METODOLOGIE EVIDENCE-BASED:
 * - FIFA 11+ Injury Prevention
 * - Yo-Yo Intermittent Recovery Test protocols
 * - Nordic Hamstring Protocol
 * - ACL Prevention Programs
 */

window.ATLASSoccer = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧬 SCIENTIFIC FOUNDATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    science: {
        // Richieste fisiologiche del calcio (90 min match)
        matchDemands: {
            totalDistance: '10-13 km',
            highIntensityRunning: '1.5-2.5 km (>19.8 km/h)',
            sprints: '200-350m totali (>25.2 km/h)',
            accelerations: '40-60 (>2.5 m/s²)',
            decelerations: '40-60 (<-2.5 m/s²)',
            jumps: '10-20',
            duels: '15-30'
        },
        
        // Sistemi energetici
        energySystems: {
            aerobic: 0.65,          // 65% - recupero tra sprint
            anaerobic_lactic: 0.25, // 25% - azioni intense ripetute
            anaerobic_alactic: 0.10 // 10% - sprint singoli, salti
        },
        
        // Infortuni più comuni (% di tutti gli infortuni)
        injuryRisk: {
            hamstring: 0.22,    // 22% - strain muscolare
            groin: 0.18,        // 18% - adduttori
            ankle: 0.15,        // 15% - distorsioni
            knee_acl: 0.08,     // 8% - rottura LCA
            knee_mcl: 0.06,     // 6% - collaterale mediale
            quadriceps: 0.08,   // 8% - strain
            calf: 0.07          // 7% - strain gastrocnemio
        },
        
        // Fattori di rischio modificabili
        riskFactors: [
            'Debolezza hamstring eccentrica',
            'Squilibrio H:Q ratio (<0.6)',
            'Deficit forza adduttori',
            'Scarsa stabilità core',
            'Fatica neuromuscolare',
            'Scarso controllo atterraggio'
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 💪 EXERCISE DATABASE
    // ═══════════════════════════════════════════════════════════════════════════
    
    exercises: {
        
        // FIFA 11+ WARMUP (Evidence-based injury prevention)
        fifa11plus: [
            { 
                name: 'Running Straight Ahead', 
                sets: 2, reps: '20m', 
                type: 'warmup',
                notes: 'Corsa leggera, braccia coordinate',
                cues: ['Postura eretta', 'Appoggio mesopiede']
            },
            { 
                name: 'Running Hip Out', 
                sets: 2, reps: '20m', 
                type: 'warmup',
                notes: 'Rotazione anca esterna durante corsa',
                cues: ['Ginocchio alto', 'Ruota fuori', 'Core attivo']
            },
            { 
                name: 'Running Hip In', 
                sets: 2, reps: '20m', 
                type: 'warmup',
                notes: 'Rotazione anca interna durante corsa',
                cues: ['Ginocchio alto', 'Ruota dentro', 'Equilibrio']
            },
            { 
                name: 'Running Circling Partner', 
                sets: 2, reps: '20m', 
                type: 'warmup',
                notes: 'Corsa con cambio direzione attorno partner',
                cues: ['90° shuffle', 'Baricentro basso', 'Contatto visivo']
            },
            { 
                name: 'Running Shoulder Contact', 
                sets: 2, reps: '20m', 
                type: 'warmup',
                notes: 'Contatto spalla con partner durante corsa',
                cues: ['Braccio protettivo', 'Core braced', 'Equilibrio']
            },
            { 
                name: 'Running Quick Forwards & Backwards', 
                sets: 2, reps: '20m', 
                type: 'warmup',
                notes: 'Sprint avanti 5m, indietro 2m',
                cues: ['Reattività', 'Baricentro basso', 'Piedi veloci']
            }
        ],
        
        // STRENGTH - Lower Body
        strengthLower: [
            { 
                name: 'Back Squat', 
                sets: 4, reps: '5-6', 
                type: 'strength',
                rest: '180s',
                notes: 'Forza base gambe. 80-85% 1RM',
                cues: ['Petto alto', 'Ginocchia fuori', 'Profondità parallelo']
            },
            { 
                name: 'Romanian Deadlift', 
                sets: 3, reps: '8-10', 
                type: 'strength',
                rest: '120s',
                notes: 'Posterior chain. Stretch eccentrico hamstring',
                cues: ['Schiena neutra', 'Anca indietro', 'Barra vicino cosce']
            },
            { 
                name: 'Bulgarian Split Squat', 
                sets: 3, reps: '8 per side', 
                type: 'strength',
                rest: '90s',
                notes: 'Forza unilaterale + stabilità',
                cues: ['90° ginocchio', 'Busto verticale', 'Non inclinare']
            },
            { 
                name: 'Hip Thrust', 
                sets: 3, reps: '10-12', 
                type: 'strength',
                rest: '90s',
                notes: 'Forza glutei per accelerazione',
                cues: ['Squeeze in alto', 'Chin tucked', 'No iperestensione lombare']
            },
            { 
                name: 'Single Leg Press', 
                sets: 3, reps: '10 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Volume unilaterale',
                cues: ['Full ROM', 'Controllo eccentrico', 'Piede alto']
            }
        ],
        
        // STRENGTH - Upper Body (funzionale per calcio)
        strengthUpper: [
            { 
                name: 'Push-up', 
                sets: 3, reps: '15-20', 
                type: 'strength',
                rest: '60s',
                notes: 'Forza push per contrasti',
                cues: ['Core tight', 'Petto a terra', 'Gomiti 45°']
            },
            { 
                name: 'Inverted Row', 
                sets: 3, reps: '12-15', 
                type: 'strength',
                rest: '60s',
                notes: 'Forza pull per equilibrio',
                cues: ['Corpo rigido', 'Petto al bar', 'Squeeze scapole']
            },
            { 
                name: 'Pallof Press', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '45s',
                notes: 'Anti-rotation per protezione schiena',
                cues: ['Resisti rotazione', 'Core braced', 'Braccia dritte']
            },
            { 
                name: 'Medicine Ball Chest Pass', 
                sets: 3, reps: '10', 
                type: 'power',
                rest: '60s',
                notes: 'Potenza upper body per rimesse',
                cues: ['Esplodi dal petto', 'Follow through', 'Core attivo']
            }
        ],
        
        // POWER & PLYOMETRICS
        power: [
            { 
                name: 'Box Jump', 
                sets: 3, reps: '5', 
                type: 'power',
                rest: '90s',
                notes: 'Potenza verticale per colpi di testa',
                cues: ['Carica braccia', 'Atterraggio soft', 'Step down']
            },
            { 
                name: 'Broad Jump', 
                sets: 3, reps: '5', 
                type: 'power',
                rest: '90s',
                notes: 'Potenza orizzontale per accelerazione',
                cues: ['Carica profonda', 'Drive braccia', 'Atterraggio stabile']
            },
            { 
                name: 'Single Leg Hop', 
                sets: 3, reps: '6 per side', 
                type: 'power',
                rest: '60s',
                notes: 'Potenza unilaterale, simula calcio',
                cues: ['Stick landing', 'Ginocchio stabile', 'Equilibrio']
            },
            { 
                name: 'Lateral Bound', 
                sets: 3, reps: '6 per side', 
                type: 'power',
                rest: '60s',
                notes: 'Potenza laterale per cambi direzione',
                cues: ['Push laterale', 'Atterraggio soft', 'Reazione rapida']
            },
            { 
                name: 'Drop Jump', 
                sets: 3, reps: '5', 
                type: 'power',
                rest: '90s',
                notes: 'Reattività muscolare (SSC)',
                cues: ['Minimo contatto', 'Esplodi subito', 'Gambe rigide']
            },
            { 
                name: 'Medicine Ball Slam', 
                sets: 3, reps: '8', 
                type: 'power',
                rest: '60s',
                notes: 'Potenza full body',
                cues: ['Overhead', 'Sbatti con forza', 'Usa tutto corpo']
            }
        ],
        
        // SPEED & AGILITY
        speed: [
            { 
                name: 'Sprint 10-20-30m', 
                sets: 4, reps: '1 each', 
                type: 'speed',
                rest: '120s',
                notes: 'Accelerazione lineare',
                cues: ['Drive iniziale', 'Braccia potenti', 'Lean forward']
            },
            { 
                name: 'Flying Sprint 20m', 
                sets: 4, reps: '20m', 
                type: 'speed',
                rest: '180s',
                notes: 'Velocità massima (dopo 10m build-up)',
                cues: ['Max velocity', 'Rilassato', 'Frequenza alta']
            },
            { 
                name: '5-10-5 Pro Agility', 
                sets: 4, reps: '1', 
                type: 'agility',
                rest: '90s',
                notes: 'Change of direction speed',
                cues: ['Baricentro basso', 'Plant e push', 'Occhi avanti']
            },
            { 
                name: 'T-Drill', 
                sets: 3, reps: '1', 
                type: 'agility',
                rest: '90s',
                notes: 'Agilità multidirezionale',
                cues: ['Shuffle laterale', 'Backpedal', 'Sprint finale']
            },
            { 
                name: 'Illinois Agility Test', 
                sets: 2, reps: '1', 
                type: 'agility',
                rest: '180s',
                notes: 'Agilità complessa con slalom',
                cues: ['Curve strette', 'Baricentro basso', 'Accelera in uscita']
            },
            { 
                name: 'Ladder Drills', 
                sets: 3, reps: '30s', 
                type: 'agility',
                rest: '30s',
                notes: 'Coordinazione piedi',
                cues: ['Sulle punte', 'Braccia coordinate', 'Velocità max']
            }
        ],
        
        // INJURY PREVENTION
        prevention: [
            { 
                name: 'Nordic Curl', 
                sets: 3, reps: '5-6', 
                type: 'prevention',
                rest: '90s',
                notes: 'GOLD STANDARD hamstring prevention. Eccentrico 3-4 sec',
                cues: ['Corpo rigido', 'Controllo discesa', 'Partner blocca piedi']
            },
            { 
                name: 'Copenhagen Plank', 
                sets: 3, reps: '30s per side', 
                type: 'prevention',
                rest: '45s',
                notes: 'Forza adduttori. Riduce infortuni groin 40%',
                cues: ['Allinea corpo', 'Adduttore attivo', 'Non ruotare']
            },
            { 
                name: 'Single Leg Romanian Deadlift', 
                sets: 3, reps: '8 per side', 
                type: 'prevention',
                rest: '60s',
                notes: 'Stabilità + forza hamstring',
                cues: ['Gamba dritta dietro', 'Anca square', 'Equilibrio']
            },
            { 
                name: 'Glute Bridge March', 
                sets: 3, reps: '10 per side', 
                type: 'prevention',
                rest: '45s',
                notes: 'Attivazione glutei + hip stability',
                cues: ['Anca alta', 'Alterna gambe', 'Core attivo']
            },
            { 
                name: 'Single Leg Balance (Eyes Closed)', 
                sets: 3, reps: '30s per side', 
                type: 'prevention',
                rest: '30s',
                notes: 'Propriocezione caviglia',
                cues: ['Occhi chiusi', 'Micro-aggiustamenti', 'Relax']
            },
            { 
                name: 'Eccentric Calf Raise', 
                sets: 3, reps: '12', 
                type: 'prevention',
                rest: '45s',
                notes: 'Prevenzione strain polpaccio',
                cues: ['Su bilaterale', 'Giù unilaterale 3 sec', 'Full ROM']
            }
        ],
        
        // CONDITIONING
        conditioning: [
            { 
                name: 'Yo-Yo Intermittent Recovery Test', 
                sets: 1, reps: 'To exhaustion', 
                type: 'conditioning',
                rest: 'N/A',
                notes: 'Test capacità recupero (Level 1 o 2)',
                cues: ['Ritmo beep', '10s active rest', 'Max effort']
            },
            { 
                name: '4x4 High Intensity Intervals', 
                sets: 4, reps: '4 min @ 90-95% HRmax', 
                type: 'conditioning',
                rest: '3 min active',
                notes: 'VO2max development. Metodo norvegese',
                cues: ['90-95% max HR', 'Recupero attivo', 'Consistenza']
            },
            { 
                name: '30-15 Intermittent Fitness Test', 
                sets: 1, reps: 'To exhaustion', 
                type: 'conditioning',
                rest: 'N/A',
                notes: 'Test VamEval con pause',
                cues: ['30s run', '15s walk', 'Incrementa velocità']
            },
            { 
                name: 'Small Sided Games (3v3, 4v4)', 
                sets: 4, reps: '4 min', 
                type: 'conditioning',
                rest: '2 min',
                notes: 'Conditioning sport-specifico',
                cues: ['Alta intensità', 'Palla sempre', 'Transizioni rapide']
            },
            { 
                name: 'Repeat Sprint Ability (RSA)', 
                sets: 6, reps: '40m sprint', 
                type: 'conditioning',
                rest: '20s',
                notes: 'Capacità sprint ripetuti',
                cues: ['Max ogni sprint', '20s passivo', 'Mantieni velocità']
            }
        ],
        
        // CORE STABILITY
        core: [
            { 
                name: 'Dead Bug', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '30s',
                notes: 'Anti-estensione lombare',
                cues: ['Lombare a terra', 'Respira fuori', 'Controllo']
            },
            { 
                name: 'Bird Dog', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '30s',
                notes: 'Anti-rotation + anti-estensione',
                cues: ['Allinea spina', 'Non ruotare', 'Estendi opposti']
            },
            { 
                name: 'Side Plank', 
                sets: 3, reps: '30s per side', 
                type: 'core',
                rest: '30s',
                notes: 'Anti-lateral flexion',
                cues: ['Corpo allineato', 'Anca alta', 'Squeeze gluteo']
            },
            { 
                name: 'Pallof Press', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '45s',
                notes: 'Anti-rotation dinamico',
                cues: ['Resisti rotazione', 'Spinta lenta', 'Core braced']
            },
            { 
                name: 'Landmine Rotation', 
                sets: 3, reps: '8 per side', 
                type: 'core',
                rest: '60s',
                notes: 'Potenza rotazionale per tiri',
                cues: ['Forza dai fianchi', 'Braccia dritte', 'Controllo']
            }
        ],
        
        // MATCH DAY PROTOCOLS
        matchDay: {
            minus3: {
                name: 'Match Day -3',
                type: 'strength_session',
                exercises: [
                    { name: 'Dynamic Warm-up', sets: 1, reps: '10 min' },
                    { name: 'Back Squat', sets: 4, reps: '5 @ 80%' },
                    { name: 'Romanian Deadlift', sets: 3, reps: '8' },
                    { name: 'Box Jump', sets: 3, reps: '5' },
                    { name: 'Nordic Curl', sets: 3, reps: '5' }
                ],
                notes: 'Ultimo giorno di carico pesante prima partita'
            },
            minus2: {
                name: 'Match Day -2',
                type: 'speed_session',
                exercises: [
                    { name: 'FIFA 11+ Warm-up', sets: 1, reps: '15 min' },
                    { name: 'Sprint 10-20m', sets: 4, reps: '2 each' },
                    { name: 'Agility Ladder', sets: 3, reps: '30s' },
                    { name: 'Light Plyometrics', sets: 2, reps: '5' }
                ],
                notes: 'Mantenimento velocità, basso volume'
            },
            minus1: {
                name: 'Match Day -1',
                type: 'activation',
                exercises: [
                    { name: 'Light Jog', sets: 1, reps: '5 min' },
                    { name: 'Dynamic Stretching', sets: 1, reps: '5 min' },
                    { name: 'Technical Drills', sets: 2, reps: '10 min' },
                    { name: 'Rondos', sets: 2, reps: '5 min' }
                ],
                notes: 'Attivazione leggera, focus tattico'
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 WORKOUT TEMPLATES
    // ═══════════════════════════════════════════════════════════════════════════
    
    templates: {
        
        strength: {
            name: 'Soccer Strength Session',
            duration: 60,
            type: 'strength',
            structure: [
                { from: 'fifa11plus', count: 3, phase: 'warmup' },
                { from: 'strengthLower', count: 3, phase: 'main' },
                { from: 'strengthUpper', count: 2, phase: 'main' },
                { from: 'core', count: 2, phase: 'main' },
                { from: 'prevention', count: 2, phase: 'finisher' }
            ]
        },
        
        power: {
            name: 'Soccer Power Session',
            duration: 55,
            type: 'power',
            structure: [
                { from: 'fifa11plus', count: 3, phase: 'warmup' },
                { from: 'power', count: 4, phase: 'main' },
                { from: 'strengthLower', count: 2, phase: 'main' },
                { from: 'core', count: 2, phase: 'main' },
                { from: 'prevention', count: 1, phase: 'finisher' }
            ]
        },
        
        speed: {
            name: 'Soccer Speed & Agility',
            duration: 50,
            type: 'speed',
            structure: [
                { from: 'fifa11plus', count: 4, phase: 'warmup' },
                { from: 'speed', count: 4, phase: 'main' },
                { from: 'power', count: 2, phase: 'main' },
                { from: 'core', count: 2, phase: 'main' }
            ]
        },
        
        conditioning: {
            name: 'Soccer Conditioning',
            duration: 45,
            type: 'conditioning',
            structure: [
                { from: 'fifa11plus', count: 3, phase: 'warmup' },
                { from: 'conditioning', count: 2, phase: 'main' },
                { from: 'core', count: 2, phase: 'main' },
                { from: 'prevention', count: 2, phase: 'finisher' }
            ]
        },
        
        prevention: {
            name: 'Soccer Prevention Focus',
            duration: 40,
            type: 'prevention',
            structure: [
                { from: 'fifa11plus', count: 4, phase: 'warmup' },
                { from: 'prevention', count: 4, phase: 'main' },
                { from: 'core', count: 3, phase: 'main' }
            ]
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏗️ WORKOUT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Genera workout calcio
     */
    generateWorkout(profile, sessionType = 'strength') {
        const template = this.templates[sessionType] || this.templates.strength;
        
        console.log(`⚽ Generating Soccer Workout: ${template.name}`);
        
        const workout = {
            name: template.name,
            type: 'soccer',
            sessionType: sessionType,
            duration: template.duration,
            sport: 'calcio',
            exercises: [],
            metadata: {
                generatedAt: new Date().toISOString(),
                module: 'ATLASSoccer v' + this.version,
                science: this.science.matchDemands
            }
        };
        
        // Costruisci workout da template
        template.structure.forEach(item => {
            const exercisePool = this.exercises[item.from];
            if (exercisePool) {
                const shuffled = Array.isArray(exercisePool) 
                    ? [...exercisePool].sort(() => Math.random() - 0.5)
                    : [exercisePool];
                const selected = shuffled.slice(0, item.count);
                selected.forEach(ex => {
                    workout.exercises.push({ ...ex, phase: item.phase });
                });
            }
        });
        
        // Aggiungi cooldown
        workout.exercises.push({
            name: 'Stretching & Foam Rolling',
            sets: 1,
            reps: '5-10 min',
            type: 'cooldown',
            phase: 'cooldown',
            notes: 'Focus hamstring, hip flexor, quads'
        });
        
        return workout;
    },
    
    /**
     * Ottieni split settimanale
     */
    getSplit(daysPerWeek) {
        const splits = {
            2: {
                name: 'Soccer 2-Day Gym Split',
                sessions: [
                    { name: 'Strength + Power', type: 'strength', sessionType: 'strength' },
                    { name: 'Speed + Prevention', type: 'speed', sessionType: 'speed' }
                ]
            },
            3: {
                name: 'Soccer 3-Day Split',
                sessions: [
                    { name: 'Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Power & Speed', type: 'power', sessionType: 'power' },
                    { name: 'Conditioning', type: 'conditioning', sessionType: 'conditioning' }
                ]
            },
            4: {
                name: 'Soccer 4-Day Split',
                sessions: [
                    { name: 'Max Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Speed & Agility', type: 'speed', sessionType: 'speed' },
                    { name: 'Power', type: 'power', sessionType: 'power' },
                    { name: 'Conditioning + Prevention', type: 'conditioning', sessionType: 'conditioning' }
                ]
            }
        };
        
        return splits[daysPerWeek] || splits[3];
    },
    
    /**
     * Adatta workout a calendario partite
     */
    adaptToMatchSchedule(workout, daysToMatch) {
        // Riduci volume/intensità vicino alla partita
        if (daysToMatch <= 1) {
            workout.exercises = workout.exercises.filter(ex => 
                ex.type === 'warmup' || ex.type === 'activation'
            );
            workout.name = 'Match Day -1: Activation';
        } else if (daysToMatch === 2) {
            workout.exercises.forEach(ex => {
                if (ex.sets) ex.sets = Math.max(2, ex.sets - 1);
            });
            workout.name = 'Match Day -2: Speed Focus';
        }
        // MD-3 può essere ancora abbastanza intenso
        
        return workout;
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('⚽ ATLAS Soccer Module v1.0 loaded!');
console.log('   → FIFA 11+ Injury Prevention integrated');
console.log('   → Nordic Hamstring Protocol included');
console.log('   → Match Day -1/-2/-3 protocols ready');
console.log('   → ATLASSoccer.generateWorkout(profile, type) - Generate soccer workout');
