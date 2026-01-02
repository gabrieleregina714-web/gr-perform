/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🏀 ATLAS BASKETBALL MODULE v1.0
 * NASA-Level Basketball Training Intelligence
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Modulo specifico per il basket basato su:
 * - Vertical Jump Training (VJT)
 * - Lateral Quickness & Change of Direction
 * - Repeated Jump Ability (RJA)
 * - Ankle Injury Prevention
 * - In-season Load Management
 * 
 * METODOLOGIE EVIDENCE-BASED:
 * - Depth Jump Protocols (Verkhoshansky)
 * - Contrast Training (PAP)
 * - NBA Load Management Principles
 */

window.ATLASBasketball = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧬 SCIENTIFIC FOUNDATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    science: {
        // Richieste fisiologiche basket (40 min game)
        gameDemands: {
            totalDistance: '4-6 km',
            sprints: '100-150 (>18 km/h)',
            jumps: '40-60',
            accelerations: '50-70',
            decelerations: '50-70',
            lateralMovements: '200-300',
            averagePlayDuration: '2-4 sec',
            restBetweenPlays: '20-30 sec'
        },
        
        // Sistemi energetici
        energySystems: {
            aerobic: 0.45,          // 45% - recupero tra azioni
            anaerobic_lactic: 0.30, // 30% - possessi ripetuti
            anaerobic_alactic: 0.25 // 25% - salti, sprint, tiri
        },
        
        // Infortuni più comuni
        injuryRisk: {
            ankle_sprain: 0.25,     // 25% - distorsione caviglia
            knee_acl: 0.12,         // 12% - rottura LCA
            knee_patellar: 0.10,    // 10% - tendinopatia rotulea
            hamstring: 0.08,        // 8% - strain
            back: 0.08,             // 8% - lombalgia
            finger_hand: 0.15       // 15% - dita/mano
        },
        
        // Fattori chiave performance
        keyPerformance: [
            'Vertical Jump Height',
            'Lateral Quickness',
            'First Step Explosion',
            'Repeated Jump Ability',
            'Court Vision (non allenabile con pesi)',
            'Shooting Endurance'
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 💪 EXERCISE DATABASE
    // ═══════════════════════════════════════════════════════════════════════════
    
    exercises: {
        
        // WARMUP SPECIFICO BASKET
        warmup: [
            { 
                name: 'Dynamic Jog + High Knees', 
                sets: 2, reps: 'Court length', 
                type: 'warmup',
                notes: 'Corsa leggera su e giù per il campo',
                cues: ['Ginocchia alte', 'Braccia coordinate', 'Sulle punte']
            },
            { 
                name: 'Defensive Slides', 
                sets: 2, reps: '30s', 
                type: 'warmup',
                notes: 'Scivolamenti laterali in posizione difensiva',
                cues: ['Baricentro basso', 'Non incrociare piedi', 'Braccia attive']
            },
            { 
                name: 'Karaoke/Carioca', 
                sets: 2, reps: 'Court length', 
                type: 'warmup',
                notes: 'Movimento laterale con rotazione anche',
                cues: ['Fluido', 'Coordina braccia', 'Guarda avanti']
            },
            { 
                name: 'Butt Kicks + Quad Stretch', 
                sets: 2, reps: '20m', 
                type: 'warmup',
                notes: 'Calcetti + stretch dinamico quad',
                cues: ['Tallone al gluteo', 'Core attivo', 'Postura']
            },
            { 
                name: 'Ankle Circles + Balance', 
                sets: 2, reps: '10 each direction', 
                type: 'warmup',
                notes: 'Mobilità caviglia + propriocezione',
                cues: ['Cerchi ampi', 'Controllo', 'Single leg balance']
            }
        ],
        
        // VERTICAL JUMP TRAINING
        verticalJump: [
            { 
                name: 'Depth Jump', 
                sets: 3, reps: '5', 
                type: 'power',
                rest: '120s',
                notes: 'GOLD STANDARD per reattività. Box 30-50cm',
                cues: ['Minimo contatto terra', 'Esplodi verticale', 'Land soft']
            },
            { 
                name: 'Box Jump (Max Height)', 
                sets: 4, reps: '3-4', 
                type: 'power',
                rest: '90s',
                notes: 'Salto massimale su box',
                cues: ['Carica profonda', 'Braccia drive', 'Step down']
            },
            { 
                name: 'Trap Bar Jump', 
                sets: 3, reps: '5', 
                type: 'power',
                rest: '120s',
                notes: 'Loaded jump per forza-velocità',
                cues: ['30% 1RM', 'Esplodi', 'Triple extension']
            },
            { 
                name: 'Countermovement Jump', 
                sets: 3, reps: '5', 
                type: 'power',
                rest: '90s',
                notes: 'Salto classico con contromovimento',
                cues: ['Dip veloce', 'Braccia su', 'Max height']
            },
            { 
                name: 'Single Leg Vertical Jump', 
                sets: 3, reps: '4 per side', 
                type: 'power',
                rest: '60s',
                notes: 'Simula layup, dunk approach',
                cues: ['Plant leg', 'Drive knee', 'Reach high']
            },
            { 
                name: 'Repeated Jumps (5x)', 
                sets: 3, reps: '5 jumps consecutive', 
                type: 'power',
                rest: '90s',
                notes: 'Repeated Jump Ability per rimbalzi',
                cues: ['Minimo ground contact', 'Mantieni altezza', 'Quick']
            }
        ],
        
        // STRENGTH - Lower Body
        strengthLower: [
            { 
                name: 'Back Squat', 
                sets: 4, reps: '5-6', 
                type: 'strength',
                rest: '180s',
                notes: 'Forza base. 80-85% 1RM',
                cues: ['Profondità parallelo', 'Drive talloni', 'Core braced']
            },
            { 
                name: 'Front Squat', 
                sets: 3, reps: '6-8', 
                type: 'strength',
                rest: '150s',
                notes: 'Quad dominant, simula posizione difesa',
                cues: ['Gomiti alti', 'Petto alto', 'Core attivo']
            },
            { 
                name: 'Trap Bar Deadlift', 
                sets: 4, reps: '5', 
                type: 'strength',
                rest: '180s',
                notes: 'Potenza total body, safe per schiena',
                cues: ['Neutral grip', 'Drive floor', 'Lockout']
            },
            { 
                name: 'Bulgarian Split Squat', 
                sets: 3, reps: '8 per side', 
                type: 'strength',
                rest: '90s',
                notes: 'Forza unilaterale, simula driving',
                cues: ['90° front knee', 'Busto verticale', 'Push through heel']
            },
            { 
                name: 'Step-Up (High Box)', 
                sets: 3, reps: '8 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Forza concentrica pura',
                cues: ['Drive from front leg only', 'Full extension', 'Control down']
            },
            { 
                name: 'Hip Thrust', 
                sets: 3, reps: '10-12', 
                type: 'strength',
                rest: '90s',
                notes: 'Glutei per esplosività',
                cues: ['Squeeze top', 'No hyperextension', 'Chin tucked']
            }
        ],
        
        // STRENGTH - Upper Body
        strengthUpper: [
            { 
                name: 'Bench Press', 
                sets: 4, reps: '6-8', 
                type: 'strength',
                rest: '120s',
                notes: 'Forza push per boxing out',
                cues: ['Arch back', 'Drive feet', 'Touch chest']
            },
            { 
                name: 'Pull-up', 
                sets: 3, reps: 'Max (or assisted)', 
                type: 'strength',
                rest: '90s',
                notes: 'Forza pull per finishing at rim',
                cues: ['Full hang', 'Chin over bar', 'Control down']
            },
            { 
                name: 'Dumbbell Row', 
                sets: 3, reps: '10 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Forza schiena unilaterale',
                cues: ['Pull to hip', 'Squeeze blade', 'Flat back']
            },
            { 
                name: 'Overhead Press', 
                sets: 3, reps: '8', 
                type: 'strength',
                rest: '90s',
                notes: 'Forza spalle per tiri e passaggi',
                cues: ['Core tight', 'Lockout overhead', 'No lean']
            },
            { 
                name: 'Face Pull', 
                sets: 3, reps: '15', 
                type: 'prevention',
                rest: '45s',
                notes: 'Salute spalle, bilancia push',
                cues: ['Pull to face', 'External rotate', 'Squeeze']
            }
        ],
        
        // LATERAL QUICKNESS
        lateral: [
            { 
                name: 'Defensive Slide Drill', 
                sets: 4, reps: '30s', 
                type: 'agility',
                rest: '30s',
                notes: 'Scivolamenti in posizione difensiva',
                cues: ['Stay low', 'Push off trail foot', 'Active hands']
            },
            { 
                name: 'Lateral Bound', 
                sets: 3, reps: '6 per side', 
                type: 'power',
                rest: '60s',
                notes: 'Potenza laterale',
                cues: ['Stick landing', 'Minimize ground contact', 'Stable']
            },
            { 
                name: 'Lateral Shuffle to Sprint', 
                sets: 4, reps: '10m + 10m', 
                type: 'agility',
                rest: '45s',
                notes: 'Transition da difesa a transizione',
                cues: ['Quick feet', 'Hip turn', 'Accelerate']
            },
            { 
                name: 'Mirror Drill (with partner)', 
                sets: 3, reps: '30s', 
                type: 'agility',
                rest: '30s',
                notes: 'Reattività difensiva',
                cues: ['React instantly', 'Low stance', 'Light feet']
            },
            { 
                name: 'Cone Weave', 
                sets: 3, reps: '3 each direction', 
                type: 'agility',
                rest: '45s',
                notes: 'Agilità tra coni',
                cues: ['Low hips', 'Sharp cuts', 'Outside foot push']
            }
        ],
        
        // SPEED & FIRST STEP
        speed: [
            { 
                name: 'First Step Explosion (3m)', 
                sets: 6, reps: '3m', 
                type: 'speed',
                rest: '45s',
                notes: 'Primo passo esplosivo',
                cues: ['Low start', 'Drive angle', 'Power through']
            },
            { 
                name: 'Sprint 20m', 
                sets: 4, reps: '20m', 
                type: 'speed',
                rest: '120s',
                notes: 'Accelerazione lineare',
                cues: ['Arms drive', 'Lean forward', 'Full stride']
            },
            { 
                name: 'Suicide Drill', 
                sets: 3, reps: 'Full court', 
                type: 'conditioning',
                rest: '60s',
                notes: 'Linea base → free throw → half → far free throw → far base',
                cues: ['Touch line', 'Quick turn', 'Max effort']
            },
            { 
                name: 'Lane Agility Drill', 
                sets: 3, reps: '1', 
                type: 'agility',
                rest: '90s',
                notes: 'NBA Combine test',
                cues: ['Forward → lateral → back → lateral', 'Stay low', 'Fast feet']
            }
        ],
        
        // INJURY PREVENTION
        prevention: [
            { 
                name: 'Single Leg Balance on Foam', 
                sets: 3, reps: '30s per side', 
                type: 'prevention',
                rest: '30s',
                notes: 'Propriocezione caviglia #1',
                cues: ['Unstable surface', 'Micro-adjustments', 'Eyes closed progression']
            },
            { 
                name: 'Ankle Strengthening (4-way)', 
                sets: 2, reps: '15 each direction', 
                type: 'prevention',
                rest: '30s',
                notes: 'Dorsi, plantar, inversion, eversion con banda',
                cues: ['Controlled', 'Full ROM', 'Resist band']
            },
            { 
                name: 'Landing Mechanics Drill', 
                sets: 3, reps: '10', 
                type: 'prevention',
                rest: '45s',
                notes: 'ACL prevention - soft landing',
                cues: ['Knees over toes', 'No valgus', 'Absorb with hips']
            },
            { 
                name: 'Nordic Curl', 
                sets: 3, reps: '5', 
                type: 'prevention',
                rest: '90s',
                notes: 'Hamstring prevention',
                cues: ['Controlled descent', 'Catch self', 'Push back up']
            },
            { 
                name: 'Patellar Tendon Protocol (Isometric)', 
                sets: 3, reps: '45s hold', 
                type: 'prevention',
                rest: '60s',
                notes: 'Prevenzione/rehab jumper\'s knee. Spanish squat o leg extension hold',
                cues: ['70% max effort', 'Hold mid-range', 'Breathe']
            },
            { 
                name: 'Copenhagen Plank', 
                sets: 3, reps: '20s per side', 
                type: 'prevention',
                rest: '30s',
                notes: 'Adduttori per cambi direzione',
                cues: ['Top leg on bench', 'Lift hips', 'Hold straight line']
            }
        ],
        
        // CORE STABILITY
        core: [
            { 
                name: 'Anti-Rotation Press', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '45s',
                notes: 'Core anti-rotation per contact',
                cues: ['Resist rotation', 'Slow press out', 'Return controlled']
            },
            { 
                name: 'Medicine Ball Rotational Throw', 
                sets: 3, reps: '8 per side', 
                type: 'core',
                rest: '60s',
                notes: 'Potenza rotazionale per passaggi',
                cues: ['Power from hips', 'Follow through', 'Catch and repeat']
            },
            { 
                name: 'Dead Bug', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '30s',
                notes: 'Anti-estensione',
                cues: ['Low back to floor', 'Breathe out on extension', 'Slow']
            },
            { 
                name: 'Plank to Push-up', 
                sets: 3, reps: '8', 
                type: 'core',
                rest: '45s',
                notes: 'Core + shoulder stability',
                cues: ['No hip rotation', 'Alternate lead arm', 'Tight core']
            }
        ],
        
        // CONDITIONING
        conditioning: [
            { 
                name: '17s', 
                sets: 4, reps: '17 sideline-to-sideline', 
                type: 'conditioning',
                rest: '60s',
                notes: 'Classic basketball conditioning',
                cues: ['Touch line', 'Max effort', 'Target time']
            },
            { 
                name: '300 Yard Shuttle', 
                sets: 2, reps: '25m x 12', 
                type: 'conditioning',
                rest: '3-5 min',
                notes: 'Lactate capacity',
                cues: ['Consistent pace', 'Quick turns', 'Finish strong']
            },
            { 
                name: 'Full Court Layups (Continuous)', 
                sets: 3, reps: '2 min', 
                type: 'conditioning',
                rest: '60s',
                notes: 'Sport-specific conditioning',
                cues: ['Make layups', 'Sprint both ways', 'Stay focused']
            },
            { 
                name: 'Hill Sprints', 
                sets: 6, reps: '20m uphill', 
                type: 'conditioning',
                rest: '60s walk down',
                notes: 'Power endurance, low impact',
                cues: ['Drive knees', 'Pump arms', 'Walk back']
            }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 WORKOUT TEMPLATES
    // ═══════════════════════════════════════════════════════════════════════════
    
    templates: {
        
        strength: {
            name: 'Basketball Strength Session',
            duration: 60,
            type: 'strength',
            structure: [
                { from: 'warmup', count: 3, phase: 'warmup' },
                { from: 'strengthLower', count: 3, phase: 'main' },
                { from: 'strengthUpper', count: 2, phase: 'main' },
                { from: 'core', count: 2, phase: 'main' },
                { from: 'prevention', count: 2, phase: 'finisher' }
            ]
        },
        
        power: {
            name: 'Basketball Power & Vertical',
            duration: 55,
            type: 'power',
            structure: [
                { from: 'warmup', count: 4, phase: 'warmup' },
                { from: 'verticalJump', count: 4, phase: 'main' },
                { from: 'strengthLower', count: 2, phase: 'main' },
                { from: 'core', count: 2, phase: 'main' }
            ]
        },
        
        speed: {
            name: 'Basketball Speed & Agility',
            duration: 50,
            type: 'speed',
            structure: [
                { from: 'warmup', count: 4, phase: 'warmup' },
                { from: 'speed', count: 3, phase: 'main' },
                { from: 'lateral', count: 3, phase: 'main' },
                { from: 'core', count: 2, phase: 'main' }
            ]
        },
        
        conditioning: {
            name: 'Basketball Conditioning',
            duration: 45,
            type: 'conditioning',
            structure: [
                { from: 'warmup', count: 3, phase: 'warmup' },
                { from: 'conditioning', count: 3, phase: 'main' },
                { from: 'prevention', count: 3, phase: 'finisher' }
            ]
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏗️ WORKOUT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    generateWorkout(profile, sessionType = 'strength') {
        const template = this.templates[sessionType] || this.templates.strength;
        
        console.log(`🏀 Generating Basketball Workout: ${template.name}`);
        
        const workout = {
            name: template.name,
            type: 'basketball',
            sessionType: sessionType,
            duration: template.duration,
            sport: 'basket',
            exercises: [],
            metadata: {
                generatedAt: new Date().toISOString(),
                module: 'ATLASBasketball v' + this.version
            }
        };
        
        // Build workout from template
        template.structure.forEach(item => {
            const pool = this.exercises[item.from];
            if (pool) {
                const shuffled = [...pool].sort(() => Math.random() - 0.5);
                const selected = shuffled.slice(0, item.count);
                selected.forEach(ex => {
                    workout.exercises.push({ ...ex, phase: item.phase });
                });
            }
        });
        
        // Cooldown
        workout.exercises.push({
            name: 'Stretching & Foam Rolling',
            sets: 1,
            reps: '5-10 min',
            type: 'cooldown',
            phase: 'cooldown',
            notes: 'Focus quads, hip flexors, ankles'
        });
        
        return workout;
    },
    
    getSplit(daysPerWeek) {
        const splits = {
            2: {
                name: 'Basketball 2-Day',
                sessions: [
                    { name: 'Strength + Power', type: 'strength', sessionType: 'strength' },
                    { name: 'Speed + Prevention', type: 'speed', sessionType: 'speed' }
                ]
            },
            3: {
                name: 'Basketball 3-Day',
                sessions: [
                    { name: 'Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Power & Vertical', type: 'power', sessionType: 'power' },
                    { name: 'Speed & Agility', type: 'speed', sessionType: 'speed' }
                ]
            },
            4: {
                name: 'Basketball 4-Day',
                sessions: [
                    { name: 'Max Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Vertical Jump', type: 'power', sessionType: 'power' },
                    { name: 'Speed & Lateral', type: 'speed', sessionType: 'speed' },
                    { name: 'Conditioning', type: 'conditioning', sessionType: 'conditioning' }
                ]
            }
        };
        
        return splits[daysPerWeek] || splits[3];
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🏀 ATLAS Basketball Module v1.0 loaded!');
console.log('   → Vertical Jump Training protocols');
console.log('   → Ankle Prevention programs');
console.log('   → NBA-level conditioning');
console.log('   → ATLASBasketball.generateWorkout(profile, type)');
