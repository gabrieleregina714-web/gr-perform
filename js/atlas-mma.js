/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🥋 ATLAS MMA MODULE v1.0
 * NASA-Level Mixed Martial Arts Training Intelligence
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Modulo specifico per MMA/Arti Marziali Miste basato su:
 * - Striking (Muay Thai, Kickboxing base)
 * - Grappling (BJJ, Wrestling base)
 * - Clinch Work
 * - Ground & Pound
 * - Scramble Training
 * - Fight-Specific Conditioning
 * 
 * METODOLOGIE EVIDENCE-BASED:
 * - Joel Jamieson (8 Weeks Out)
 * - Strength & Conditioning for Combat Sports
 * - UFC Performance Institute protocols
 */

window.ATLASMMA = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧬 SCIENTIFIC FOUNDATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    science: {
        // Richieste fisiologiche MMA (3x5min o 5x5min)
        fightDemands: {
            roundDuration: '5 min',
            restBetweenRounds: '1 min',
            totalFightTime: '15-25 min',
            grappling_exchanges: '15-25 per round',
            striking_exchanges: '40-60 per round',
            takedown_attempts: '2-5 per round',
            scrambles: '10-15 per fight'
        },
        
        // Sistemi energetici - MMA è il più completo
        energySystems: {
            aerobic: 0.35,          // 35% - recupero tra scambi
            anaerobic_lactic: 0.40, // 40% - grappling sostenuto
            anaerobic_alactic: 0.25 // 25% - striking esplosivo, takedown
        },
        
        // Infortuni più comuni
        injuryRisk: {
            hand_wrist: 0.18,       // 18% - pugni
            shoulder: 0.12,         // 12% - submission, takedown
            knee: 0.14,             // 14% - scrambles, leg locks
            neck: 0.08,             // 8% - guillotine, wrestling
            back: 0.10,             // 10% - bridging, grappling
            ribs: 0.08,             // 8% - body shots, knee pressure
            ankle: 0.07,            // 7% - leg locks
            concussion: 0.12        // 12% - strikes
        },
        
        // Qualità fisiche chiave
        keyPerformance: [
            'Grip Endurance',
            'Hip Explosion (takedowns/escapes)',
            'Rotational Power (strikes)',
            'Neck Strength',
            'Posterior Chain Strength',
            'Scramble Speed',
            'Work Capacity (multiple rounds)'
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 💪 EXERCISE DATABASE
    // ═══════════════════════════════════════════════════════════════════════════
    
    exercises: {
        
        // WARMUP MMA
        warmup: [
            { 
                name: 'Jump Rope', 
                sets: 1, reps: '3 min', 
                type: 'warmup',
                notes: 'Riscaldamento classico combat sports',
                cues: ['Light bouncing', 'Wrist rotation', 'Breathing']
            },
            { 
                name: 'Shadow Boxing + Kicks', 
                sets: 2, reps: '2 min', 
                type: 'warmup',
                notes: 'Riscaldamento striking pattern',
                cues: ['Jab-cross-hook-kick', 'Light footwork', 'Flowing']
            },
            { 
                name: 'Hip Circles + Leg Swings', 
                sets: 2, reps: '10 each direction', 
                type: 'warmup',
                notes: 'Mobilità anche per high kicks',
                cues: ['Large circles', 'Controlled', 'Progress range']
            },
            { 
                name: 'Arm Circles + Shoulder Rolls', 
                sets: 2, reps: '10 each', 
                type: 'warmup',
                notes: 'Mobilità spalle',
                cues: ['Forward and back', 'Increasing size', 'Loose']
            },
            { 
                name: 'Neck Circles + Bridging Light', 
                sets: 2, reps: '10 each direction', 
                type: 'warmup',
                notes: 'Attivazione collo per wrestling/clinch',
                cues: ['Slow controlled circles', 'Light bridge hold', 'Never force']
            },
            { 
                name: 'Technical Stand-up Drill', 
                sets: 2, reps: '10', 
                type: 'warmup',
                notes: 'Drill base BJJ/MMA',
                cues: ['Hip escape', 'Post hand', 'Stand defensive']
            }
        ],
        
        // STRIKING POWER
        strikingPower: [
            { 
                name: 'Medicine Ball Shot Put', 
                sets: 3, reps: '6 per side', 
                type: 'power',
                rest: '60s',
                notes: 'Potenza rotazionale per cross/hook',
                cues: ['Hip rotation first', 'Follow through', 'Max intent']
            },
            { 
                name: 'Landmine Punch', 
                sets: 3, reps: '8 per side', 
                type: 'power',
                rest: '60s',
                notes: 'Simula uppercut/hook pattern',
                cues: ['Ground reaction force', 'Rotate through', 'Explosive']
            },
            { 
                name: 'Heavy Bag Rounds', 
                sets: 3, reps: '3 min', 
                type: 'striking',
                rest: '60s',
                notes: 'Power punches + kicks',
                cues: ['Mix combinations', 'Sit on punches', 'Breathe']
            },
            { 
                name: 'Plyometric Push-up', 
                sets: 3, reps: '8', 
                type: 'power',
                rest: '60s',
                notes: 'Push power per striking',
                cues: ['Explosive push', 'Hands leave ground', 'Soft landing']
            },
            { 
                name: 'Band Resisted Jab-Cross', 
                sets: 3, reps: '30s each side', 
                type: 'power',
                rest: '45s',
                notes: 'Speed-strength per punch velocity',
                cues: ['Quick retract', 'Full extension', 'Stay in stance']
            }
        ],
        
        // GRAPPLING STRENGTH
        grapplingStrength: [
            { 
                name: 'Rope Climb', 
                sets: 3, reps: '2-3 climbs', 
                type: 'strength',
                rest: '120s',
                notes: 'Grip + pulling per clinch/guard',
                cues: ['Legless if possible', 'Controlled descent', 'Grip switch']
            },
            { 
                name: 'Weighted Pull-up', 
                sets: 4, reps: '6', 
                type: 'strength',
                rest: '120s',
                notes: 'Base per trazione/controllo',
                cues: ['Full ROM', 'Controlled', 'Add weight progressive']
            },
            { 
                name: 'Farmer Walk', 
                sets: 3, reps: '40m', 
                type: 'strength',
                rest: '90s',
                notes: 'Grip endurance + core',
                cues: ['Heavy weight', 'Tight core', 'Quick steps']
            },
            { 
                name: 'Dead Hang', 
                sets: 3, reps: 'Max time', 
                type: 'strength',
                rest: '60s',
                notes: 'Grip isometrica base',
                cues: ['Full hang', 'Active shoulders', 'Breathe']
            },
            { 
                name: 'Turkish Get-up', 
                sets: 3, reps: '3 per side', 
                type: 'strength',
                rest: '90s',
                notes: 'Transizione terra-piedi, scramble strength',
                cues: ['Eyes on KB', 'Each position stable', 'Control']
            }
        ],
        
        // WRESTLING/TAKEDOWN STRENGTH
        wrestlingStrength: [
            { 
                name: 'Trap Bar Deadlift', 
                sets: 4, reps: '5', 
                type: 'strength',
                rest: '180s',
                notes: 'Potenza total body per takedown',
                cues: ['Drive through floor', 'Hip hinge', 'Lockout']
            },
            { 
                name: 'Power Clean', 
                sets: 4, reps: '3', 
                type: 'power',
                rest: '120s',
                notes: 'Triple extension = double leg drive',
                cues: ['Pull high', 'Catch in front squat', 'Explosive']
            },
            { 
                name: 'Hip Thrust (Heavy)', 
                sets: 4, reps: '8', 
                type: 'strength',
                rest: '90s',
                notes: 'Hip drive per penetration step',
                cues: ['Squeeze glutes top', 'Drive heels', 'No hyperextension']
            },
            { 
                name: 'Single Leg RDL', 
                sets: 3, reps: '8 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Posterior chain unilaterale per single leg',
                cues: ['Hip hinge', 'Flat back', 'Control']
            },
            { 
                name: 'Bulgarian Split Squat (Heavy)', 
                sets: 3, reps: '6 per side', 
                type: 'strength',
                rest: '90s',
                notes: 'Forza unilaterale per level change',
                cues: ['90° front knee', 'Drive up explosive', 'Vertical torso']
            }
        ],
        
        // NECK STRENGTH (Cruciale per MMA)
        neckStrength: [
            { 
                name: 'Neck Curl (Plate)', 
                sets: 3, reps: '12-15', 
                type: 'prevention',
                rest: '45s',
                notes: 'Flessione collo - protezione guillotine',
                cues: ['Light weight', 'Controlled', 'Full ROM']
            },
            { 
                name: 'Neck Extension (Plate)', 
                sets: 3, reps: '12-15', 
                type: 'prevention',
                rest: '45s',
                notes: 'Estensione - protezione rear naked',
                cues: ['Face down on bench', 'Extend up', 'Controlled']
            },
            { 
                name: 'Neck Lateral Flexion', 
                sets: 2, reps: '10 per side', 
                type: 'prevention',
                rest: '30s',
                notes: 'Laterale - escape crani',
                cues: ['Ear to shoulder', 'Resist if with partner', 'Slow']
            },
            { 
                name: 'Bridge (Wrestling)', 
                sets: 3, reps: '30s hold', 
                type: 'prevention',
                rest: '45s',
                notes: 'Isometrica classica wrestling',
                cues: ['Nose over bridge', 'Rotate slowly', 'Build tolerance']
            }
        ],
        
        // CORE MMA
        coreMMA: [
            { 
                name: 'Pallof Press', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '45s',
                notes: 'Anti-rotazione per clinch/grappling',
                cues: ['Resist rotation', 'Press out slow', 'Core tight']
            },
            { 
                name: 'Medicine Ball Slam', 
                sets: 3, reps: '10', 
                type: 'core',
                rest: '45s',
                notes: 'Ground and pound pattern',
                cues: ['Overhead throw', 'Hip hinge catch', 'Explosive']
            },
            { 
                name: 'Hollow Body Hold', 
                sets: 3, reps: '30s', 
                type: 'core',
                rest: '30s',
                notes: 'Core per guard/control',
                cues: ['Low back pressed', 'Legs extended', 'Breathe']
            },
            { 
                name: 'Hip Escape (Shrimping)', 
                sets: 3, reps: '10 per side', 
                type: 'technique',
                rest: '30s',
                notes: 'BJJ fundamental + core/hip mobility',
                cues: ['Frame with arm', 'Drive heel', 'Create space']
            },
            { 
                name: 'Side Plank with Hip Dip', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '30s',
                notes: 'Obliqui per scrambles',
                cues: ['Stack hips', 'Dip touch floor', 'Return straight']
            }
        ],
        
        // CONDITIONING MMA
        conditioning: [
            { 
                name: 'Grappling Intervals', 
                sets: 5, reps: '5 min on / 1 min rest', 
                type: 'conditioning',
                rest: 'As prescribed',
                notes: 'Simula round timing',
                cues: ['Drill or live roll', 'Manage pace', 'Finish strong']
            },
            { 
                name: 'Assault Bike Intervals', 
                sets: 5, reps: '30s max / 30s easy', 
                type: 'conditioning',
                rest: 'Active recovery',
                notes: 'Potenza anaerobica',
                cues: ['Max RPM', 'Arms drive', 'Stay seated']
            },
            { 
                name: 'Battling Ropes Circuit', 
                sets: 4, reps: '30s on / 30s off', 
                type: 'conditioning',
                rest: 'As prescribed',
                notes: 'Upper body conditioning',
                cues: ['Alternate waves', 'Slams', 'Stay low']
            },
            { 
                name: 'Sprawl + Burpee', 
                sets: 3, reps: '10', 
                type: 'conditioning',
                rest: '60s',
                notes: 'Takedown defense + full body',
                cues: ['Hip down sprawl', 'Jump back up', 'Explosive']
            },
            { 
                name: 'Shadow MMA Rounds', 
                sets: 3, reps: '5 min', 
                type: 'conditioning',
                rest: '60s',
                notes: 'Striking + level change + ground simulation',
                cues: ['Visualize opponent', 'Move all levels', 'Breathe']
            }
        ],
        
        // INJURY PREVENTION
        prevention: [
            { 
                name: 'Shoulder YTWL', 
                sets: 2, reps: '10 each', 
                type: 'prevention',
                rest: '30s',
                notes: 'Stabilità spalla per submission defense',
                cues: ['Light weight/band', 'Controlled', 'Full ROM']
            },
            { 
                name: 'Wrist Circles + Extensions', 
                sets: 2, reps: '15 each direction', 
                type: 'prevention',
                rest: '20s',
                notes: 'Protezione polsi per striking/posting',
                cues: ['Full circles', 'Extend fingers', 'Make fist']
            },
            { 
                name: 'Hip 90/90 Stretch', 
                sets: 2, reps: '30s per side', 
                type: 'prevention',
                rest: '15s',
                notes: 'Mobilità anche per guard/leg work',
                cues: ['90° both legs', 'Rotate between', 'Relax']
            },
            { 
                name: 'Thoracic Spine Rotation', 
                sets: 2, reps: '10 per side', 
                type: 'prevention',
                rest: '20s',
                notes: 'Rotazione per striking + scrambles',
                cues: ['Hand behind head', 'Open chest to ceiling', 'Control']
            },
            { 
                name: 'Finger Extensor Training', 
                sets: 3, reps: '15', 
                type: 'prevention',
                rest: '30s',
                notes: 'Bilancia grip work, previene tendiniti',
                cues: ['Band around fingers', 'Spread fingers', 'Hold']
            }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 WORKOUT TEMPLATES
    // ═══════════════════════════════════════════════════════════════════════════
    
    templates: {
        
        strength: {
            name: 'MMA Strength Session',
            duration: 65,
            type: 'strength',
            structure: [
                { from: 'warmup', count: 4, phase: 'warmup' },
                { from: 'wrestlingStrength', count: 3, phase: 'main' },
                { from: 'grapplingStrength', count: 2, phase: 'main' },
                { from: 'neckStrength', count: 2, phase: 'main' },
                { from: 'coreMMA', count: 2, phase: 'finisher' }
            ]
        },
        
        power: {
            name: 'MMA Power Session',
            duration: 55,
            type: 'power',
            structure: [
                { from: 'warmup', count: 4, phase: 'warmup' },
                { from: 'strikingPower', count: 3, phase: 'main' },
                { from: 'wrestlingStrength', count: 2, phase: 'main' },
                { from: 'coreMMA', count: 2, phase: 'main' }
            ]
        },
        
        conditioning: {
            name: 'MMA Conditioning',
            duration: 50,
            type: 'conditioning',
            structure: [
                { from: 'warmup', count: 3, phase: 'warmup' },
                { from: 'conditioning', count: 4, phase: 'main' },
                { from: 'prevention', count: 3, phase: 'finisher' }
            ]
        },
        
        technique: {
            name: 'MMA Technical Strength',
            duration: 60,
            type: 'technique',
            structure: [
                { from: 'warmup', count: 5, phase: 'warmup' },
                { from: 'coreMMA', count: 3, phase: 'main' },
                { from: 'neckStrength', count: 3, phase: 'main' },
                { from: 'grapplingStrength', count: 2, phase: 'main' },
                { from: 'prevention', count: 2, phase: 'finisher' }
            ]
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏗️ WORKOUT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    generateWorkout(profile, sessionType = 'strength') {
        const template = this.templates[sessionType] || this.templates.strength;
        
        console.log(`🥋 Generating MMA Workout: ${template.name}`);
        
        const workout = {
            name: template.name,
            type: 'mma',
            sessionType: sessionType,
            duration: template.duration,
            sport: 'mma',
            exercises: [],
            metadata: {
                generatedAt: new Date().toISOString(),
                module: 'ATLASMMA v' + this.version,
                tip: this.getTip()
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
            reps: '10-15 min',
            type: 'cooldown',
            phase: 'cooldown',
            notes: 'Focus hips, shoulders, neck, forearms'
        });
        
        return workout;
    },
    
    getSplit(daysPerWeek) {
        const splits = {
            2: {
                name: 'MMA 2-Day',
                sessions: [
                    { name: 'Strength + Power', type: 'strength', sessionType: 'strength' },
                    { name: 'Conditioning', type: 'conditioning', sessionType: 'conditioning' }
                ]
            },
            3: {
                name: 'MMA 3-Day',
                sessions: [
                    { name: 'Max Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Power', type: 'power', sessionType: 'power' },
                    { name: 'Conditioning', type: 'conditioning', sessionType: 'conditioning' }
                ]
            },
            4: {
                name: 'MMA 4-Day',
                sessions: [
                    { name: 'Strength Lower', type: 'strength', sessionType: 'strength' },
                    { name: 'Striking Power', type: 'power', sessionType: 'power' },
                    { name: 'Grappling Strength', type: 'technique', sessionType: 'technique' },
                    { name: 'Conditioning', type: 'conditioning', sessionType: 'conditioning' }
                ]
            },
            5: {
                name: 'MMA 5-Day (Fight Camp)',
                sessions: [
                    { name: 'Max Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Striking Power', type: 'power', sessionType: 'power' },
                    { name: 'Technical Strength', type: 'technique', sessionType: 'technique' },
                    { name: 'Fight Conditioning', type: 'conditioning', sessionType: 'conditioning' },
                    { name: 'Recovery + Prevention', type: 'prevention', sessionType: 'technique' }
                ]
            }
        };
        
        return splits[daysPerWeek] || splits[3];
    },
    
    getTip() {
        const tips = [
            'MAT TIME > GYM TIME. La sala pesi supporta, il tatami sviluppa.',
            'Il collo forte salva carriere. Non saltare mai il neck work.',
            'Grip fatica = round perso. Allena la presa come un fondamentale.',
            'La mobilità delle anche è la base di tutto: guard, kicks, takedowns.',
            'Ogni sessione di forza dovrebbe includere lavoro anti-rotazione.',
            'Il conditioning specifico batte il cardio generico. Simula i round.'
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    },
    
    // Adatta allenamento pre-fight
    adaptToFight(workout, daysToFight) {
        if (daysToFight <= 3) {
            // Fight week: solo attivazione
            workout.exercises = workout.exercises.filter(ex => 
                ex.type === 'warmup' || ex.type === 'prevention' || ex.type === 'technique'
            );
            workout.name = 'Fight Week: Activation Only';
            workout.notes = 'Mantieni freshness. Niente fatica, solo attivazione CNS.';
        } else if (daysToFight <= 7) {
            // Last week: ridurre volume
            workout.exercises.forEach(ex => {
                if (ex.sets > 2) ex.sets = Math.max(2, ex.sets - 1);
                if (typeof ex.reps === 'number' && ex.reps > 6) ex.reps = Math.floor(ex.reps * 0.7);
            });
            workout.name += ' (Taper Week)';
        }
        return workout;
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🥋 ATLAS MMA Module v1.0 loaded!');
console.log('   → Striking & Grappling Strength');
console.log('   → Neck Training Protocols');
console.log('   → Fight Camp Periodization');
console.log('   → ATLASMMA.generateWorkout(profile, type)');
