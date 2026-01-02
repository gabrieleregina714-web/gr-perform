/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🏃 ATLAS RUNNING MODULE v1.0
 * NASA-Level Running Training Intelligence
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Modulo specifico per Running/Corsa basato su:
 * - Polarized Training (80/20 Model)
 * - Threshold Training
 * - VO2max Development
 * - Running Economy
 * - Strength for Runners
 * - Injury Prevention
 * 
 * METODOLOGIE EVIDENCE-BASED:
 * - Stephen Seiler (Polarized Training)
 * - Jack Daniels (VDOT, Training Zones)
 * - Maffetone Method
 * - Jay Dicharry (Running Rewired)
 */

window.ATLASRunning = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧬 SCIENTIFIC FOUNDATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    science: {
        // Training zones (Daniels' VDOT based)
        trainingZones: {
            zone1: { name: 'Easy/Recovery', hrPercent: '60-70%', description: 'Conversational pace' },
            zone2: { name: 'Aerobic Base', hrPercent: '70-80%', description: 'Comfortable but working' },
            zone3: { name: 'Tempo/Threshold', hrPercent: '80-90%', description: 'Comfortably hard, lactate threshold' },
            zone4: { name: 'VO2max Intervals', hrPercent: '90-95%', description: 'Hard, 3-8 min efforts' },
            zone5: { name: 'Speed/Anaerobic', hrPercent: '95-100%', description: 'Max efforts, 30s-2min' }
        },
        
        // Polarized model distribution
        polarizedDistribution: {
            lowIntensity: 0.80,  // 80% Zone 1-2
            highIntensity: 0.20  // 20% Zone 3-5
        },
        
        // Infortuni più comuni
        injuryRisk: {
            knee_runners: 0.25,     // 25% - runner's knee
            it_band: 0.15,          // 15% - IT band syndrome
            plantar_fasciitis: 0.12,// 12%
            shin_splints: 0.14,     // 14% - tibial stress
            achilles: 0.10,         // 10% - tendinopathy
            hip: 0.08,              // 8% - hip flexor, glutes
            stress_fracture: 0.05  // 5% - tibia, metatarsal
        },
        
        // Qualità fisiche chiave
        keyPerformance: [
            'VO2max',
            'Lactate Threshold',
            'Running Economy',
            'Fatigue Resistance',
            'Foot Strike Mechanics',
            'Hip Extension Strength',
            'Single Leg Stability'
        ],
        
        // Fattori running economy
        runningEconomy: [
            'Cadence (optimal 170-180 spm)',
            'Ground contact time (<250ms elite)',
            'Vertical oscillation (minimal)',
            'Hip extension ROM',
            'Ankle stiffness',
            'Arm swing efficiency'
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 💪 EXERCISE DATABASE
    // ═══════════════════════════════════════════════════════════════════════════
    
    exercises: {
        
        // WARMUP RUNNING
        warmup: [
            { 
                name: 'Easy Jog', 
                sets: 1, reps: '5-10 min', 
                type: 'warmup',
                notes: 'Riscaldamento graduale',
                cues: ['Very easy pace', 'Breathing easy', 'Relax']
            },
            { 
                name: 'Leg Swings (Front/Side)', 
                sets: 2, reps: '10 each direction', 
                type: 'warmup',
                notes: 'Mobilità anche',
                cues: ['Forward-back', 'Side-to-side', 'Controlled swing']
            },
            { 
                name: 'Walking Lunge with Twist', 
                sets: 2, reps: '8 per side', 
                type: 'warmup',
                notes: 'Attivazione hip flexor + rotation',
                cues: ['Deep lunge', 'Rotate toward front leg', 'Stand tall']
            },
            { 
                name: 'High Knees', 
                sets: 2, reps: '20m', 
                type: 'warmup',
                notes: 'Attivazione hip flexor',
                cues: ['Drive knees up', 'Quick turnover', 'Arms coordinated']
            },
            { 
                name: 'Butt Kicks', 
                sets: 2, reps: '20m', 
                type: 'warmup',
                notes: 'Attivazione hamstring',
                cues: ['Heel to glute', 'Quick', 'Stay tall']
            },
            { 
                name: 'A-Skip', 
                sets: 2, reps: '20m', 
                type: 'warmup',
                notes: 'Drill running form',
                cues: ['Drive knee up', 'Ankle dorsiflexed', 'Quick ground contact']
            },
            { 
                name: 'Strides', 
                sets: 4, reps: '80-100m', 
                type: 'warmup',
                notes: 'Accelerazioni graduate pre-workout',
                cues: ['Build to 85-90%', 'Smooth', 'Decelerate last 20m']
            }
        ],
        
        // RUNNING SESSIONS
        runningSessions: [
            { 
                name: 'Easy Run', 
                sets: 1, reps: '30-60 min', 
                type: 'aerobic',
                zone: 'Zone 1-2',
                notes: 'Base building, conversational',
                cues: ['Can hold conversation', 'Relaxed', 'Form focus']
            },
            { 
                name: 'Long Run', 
                sets: 1, reps: '60-120 min', 
                type: 'aerobic',
                zone: 'Zone 1-2',
                notes: 'Endurance foundation',
                cues: ['Slow start', 'Steady pace', 'Fuel adequately']
            },
            { 
                name: 'Tempo Run', 
                sets: 1, reps: '20-40 min', 
                type: 'threshold',
                zone: 'Zone 3',
                notes: 'Lactate threshold development',
                cues: ['Comfortably hard', 'Sustainable 60 min pace', 'Focus']
            },
            { 
                name: 'VO2max Intervals', 
                sets: 5, reps: '3-5 min @ 95% max', 
                type: 'vo2max',
                zone: 'Zone 4',
                rest: '3 min jog between',
                notes: 'Max aerobic capacity development',
                cues: ['Hard but controlled', 'Recover between', 'Maintain form']
            },
            { 
                name: 'Cruise Intervals', 
                sets: 4, reps: '8-10 min @ tempo', 
                type: 'threshold',
                zone: 'Zone 3',
                rest: '1-2 min jog',
                notes: 'Extended threshold work',
                cues: ['Just below threshold', 'Quick recovery', 'Total 30-40 min @ tempo']
            },
            { 
                name: 'Fartlek', 
                sets: 1, reps: '30-45 min', 
                type: 'mixed',
                zone: 'Zone 2-4',
                notes: 'Unstructured speed play',
                cues: ['Mix easy/hard by feel', 'Use terrain', 'Listen to body']
            },
            { 
                name: 'Hill Repeats', 
                sets: 6, reps: '60-90s uphill hard', 
                type: 'strength',
                zone: 'Zone 4',
                rest: 'Jog down recovery',
                notes: 'Forza corsa + potenza',
                cues: ['Drive knees', 'Short stride', 'Arms pump']
            },
            { 
                name: '400m Repeats', 
                sets: 8, reps: '400m @ 5K pace', 
                type: 'speed',
                zone: 'Zone 4-5',
                rest: '200m jog',
                notes: 'Speed endurance',
                cues: ['Consistent splits', 'Quick turnover', 'Relax shoulders']
            },
            { 
                name: 'Recovery Run', 
                sets: 1, reps: '20-30 min', 
                type: 'recovery',
                zone: 'Zone 1',
                notes: 'Active recovery, very easy',
                cues: ['Slower than you think', 'Could chat easily', 'Flush legs']
            }
        ],
        
        // STRENGTH FOR RUNNERS
        strengthLower: [
            { 
                name: 'Single Leg Squat', 
                sets: 3, reps: '8 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Forza unilaterale = running is one leg at a time',
                cues: ['Knee tracks toe', 'Control down', 'Drive up']
            },
            { 
                name: 'Romanian Deadlift (Single Leg)', 
                sets: 3, reps: '10 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Posterior chain unilaterale',
                cues: ['Hip hinge', 'Feel hamstring', 'Flat back']
            },
            { 
                name: 'Step-up (Explosive)', 
                sets: 3, reps: '8 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Simula propulsione',
                cues: ['Drive from front leg', 'Quick up', 'Control down']
            },
            { 
                name: 'Calf Raise (Single Leg)', 
                sets: 3, reps: '15 per side', 
                type: 'strength',
                rest: '45s',
                notes: 'Critico per propulsione + achilles health',
                cues: ['Full ROM', 'Pause at top', 'Slow eccentric']
            },
            { 
                name: 'Hip Thrust (Single Leg)', 
                sets: 3, reps: '10 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Glute drive per hip extension',
                cues: ['Squeeze glute', 'Level hips', 'Drive through heel']
            },
            { 
                name: 'Reverse Lunge', 
                sets: 3, reps: '10 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Forza + stabilità',
                cues: ['Step back', '90° front knee', 'Drive up']
            }
        ],
        
        // PLYOMETRICS
        plyometrics: [
            { 
                name: 'Pogo Jumps', 
                sets: 3, reps: '20', 
                type: 'power',
                rest: '60s',
                notes: 'Ankle stiffness, simula ground contact',
                cues: ['Minimal ground time', 'Stiff ankles', 'Quick bounce']
            },
            { 
                name: 'Single Leg Hop', 
                sets: 3, reps: '10 per side', 
                type: 'power',
                rest: '60s',
                notes: 'Reactive strength unilaterale',
                cues: ['Hop forward', 'Stick each landing', 'Drive knee']
            },
            { 
                name: 'Box Jump (Step Down)', 
                sets: 3, reps: '6', 
                type: 'power',
                rest: '60s',
                notes: 'Potenza concentrica, safe for runners',
                cues: ['Explode up', 'Land soft', 'Step down (don\'t jump)']
            },
            { 
                name: 'Bounding', 
                sets: 3, reps: '20m', 
                type: 'power',
                rest: '90s',
                notes: 'Stride power development',
                cues: ['Big steps', 'Drive off each leg', 'Arm swing']
            },
            { 
                name: 'Ankle Bounces', 
                sets: 3, reps: '30s', 
                type: 'power',
                rest: '45s',
                notes: 'Reattività caviglia',
                cues: ['Minimal knee bend', 'Quick ground contact', 'Stiff springs']
            }
        ],
        
        // CORE FOR RUNNERS
        coreRunning: [
            { 
                name: 'Plank', 
                sets: 3, reps: '45-60s', 
                type: 'core',
                rest: '30s',
                notes: 'Anti-extension base',
                cues: ['Straight line', 'No sag', 'Breathe']
            },
            { 
                name: 'Side Plank', 
                sets: 3, reps: '30s per side', 
                type: 'core',
                rest: '30s',
                notes: 'Hip drop prevention durante corsa',
                cues: ['Hips stacked', 'No rotation', 'Breathe']
            },
            { 
                name: 'Dead Bug', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '30s',
                notes: 'Core coordination',
                cues: ['Low back pressed', 'Opposite arm/leg', 'Control']
            },
            { 
                name: 'Bird Dog', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '30s',
                notes: 'Anti-rotation + extension',
                cues: ['Flat back', 'Extend opposite', 'Pause at end']
            },
            { 
                name: 'Single Leg Glute Bridge Hold', 
                sets: 3, reps: '30s per side', 
                type: 'core',
                rest: '30s',
                notes: 'Glute endurance + stability',
                cues: ['Drive hips up', 'Level pelvis', 'Squeeze glute']
            }
        ],
        
        // INJURY PREVENTION
        prevention: [
            { 
                name: 'Eccentric Calf Raise', 
                sets: 3, reps: '15 (slow 3s down)', 
                type: 'prevention',
                rest: '60s',
                notes: 'Achilles tendon health #1 exercise',
                cues: ['Quick up', 'Slow 3s down', 'Full ROM']
            },
            { 
                name: 'IT Band Foam Roll', 
                sets: 1, reps: '60-90s per side', 
                type: 'prevention',
                notes: 'Release IT band tension',
                cues: ['Roll side of thigh', 'Pause on tender spots', 'Breathe']
            },
            { 
                name: 'Clamshell', 
                sets: 3, reps: '15 per side', 
                type: 'prevention',
                rest: '30s',
                notes: 'Glute med activation - knee stability',
                cues: ['Heels together', 'Open top knee', 'Don\'t rotate pelvis']
            },
            { 
                name: 'Single Leg Balance', 
                sets: 3, reps: '30s per side', 
                type: 'prevention',
                rest: '15s',
                notes: 'Propriocezione + stabilità',
                cues: ['Eyes open → closed', 'Micro-adjustments', 'Tall posture']
            },
            { 
                name: 'Toe Yoga (Toe Spread)', 
                sets: 3, reps: '10 each foot', 
                type: 'prevention',
                rest: '15s',
                notes: 'Foot intrinsic strength - plantar fasciitis prevention',
                cues: ['Spread toes', 'Press big toe down', 'Lift others']
            },
            { 
                name: 'Tibialis Raise', 
                sets: 3, reps: '15', 
                type: 'prevention',
                rest: '30s',
                notes: 'Shin splint prevention',
                cues: ['Heels on edge of step', 'Raise toes up', 'Slow down']
            },
            { 
                name: 'Hip Flexor Stretch', 
                sets: 2, reps: '30s per side', 
                type: 'prevention',
                rest: '15s',
                notes: 'Hip extension ROM',
                cues: ['Half kneeling', 'Squeeze back glute', 'Tuck pelvis']
            }
        ],
        
        // DRILLS
        drills: [
            { 
                name: 'A-Skip', 
                sets: 3, reps: '30m', 
                type: 'drill',
                notes: 'Knee drive + quick ground contact',
                cues: ['High knee', 'Dorsiflexed foot', 'Quick down']
            },
            { 
                name: 'B-Skip', 
                sets: 3, reps: '30m', 
                type: 'drill',
                notes: 'Hamstring cycling pattern',
                cues: ['Extend from knee', 'Paw back', 'Quick cycle']
            },
            { 
                name: 'High Knees', 
                sets: 3, reps: '30m', 
                type: 'drill',
                notes: 'Cadence + hip flexor drive',
                cues: ['Quick turnover', 'Arms coordinated', 'Stay tall']
            },
            { 
                name: 'Straight Leg Run', 
                sets: 3, reps: '30m', 
                type: 'drill',
                notes: 'Hamstring activation pattern',
                cues: ['Straight legs', 'Paw ground', 'Arms opposite']
            }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 WORKOUT TEMPLATES
    // ═══════════════════════════════════════════════════════════════════════════
    
    templates: {
        
        easy: {
            name: 'Easy Run Day',
            duration: 45,
            type: 'easy',
            structure: [
                { from: 'warmup', count: 2, phase: 'warmup', fixed: ['Easy Jog'] },
                { from: 'runningSessions', count: 1, phase: 'main', fixed: ['Easy Run'] },
                { from: 'prevention', count: 2, phase: 'finisher' }
            ]
        },
        
        tempo: {
            name: 'Tempo Run Session',
            duration: 60,
            type: 'tempo',
            structure: [
                { from: 'warmup', count: 4, phase: 'warmup' },
                { from: 'runningSessions', count: 1, phase: 'main', fixed: ['Tempo Run'] },
                { from: 'prevention', count: 2, phase: 'finisher' }
            ]
        },
        
        intervals: {
            name: 'Interval Session',
            duration: 65,
            type: 'intervals',
            structure: [
                { from: 'warmup', count: 5, phase: 'warmup' },
                { from: 'runningSessions', count: 1, phase: 'main', fixed: ['VO2max Intervals'] },
                { from: 'prevention', count: 2, phase: 'finisher' }
            ]
        },
        
        strength: {
            name: 'Strength for Runners',
            duration: 50,
            type: 'strength',
            structure: [
                { from: 'warmup', count: 3, phase: 'warmup' },
                { from: 'strengthLower', count: 4, phase: 'main' },
                { from: 'coreRunning', count: 3, phase: 'main' },
                { from: 'prevention', count: 3, phase: 'finisher' }
            ]
        },
        
        long: {
            name: 'Long Run Day',
            duration: 90,
            type: 'long',
            structure: [
                { from: 'warmup', count: 3, phase: 'warmup' },
                { from: 'runningSessions', count: 1, phase: 'main', fixed: ['Long Run'] },
                { from: 'prevention', count: 3, phase: 'finisher' }
            ]
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏗️ WORKOUT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    generateWorkout(profile, sessionType = 'easy') {
        const template = this.templates[sessionType] || this.templates.easy;
        
        console.log(`🏃 Generating Running Workout: ${template.name}`);
        
        const workout = {
            name: template.name,
            type: 'running',
            sessionType: sessionType,
            duration: template.duration,
            sport: 'running',
            exercises: [],
            metadata: {
                generatedAt: new Date().toISOString(),
                module: 'ATLASRunning v' + this.version,
                tip: this.getTip()
            }
        };
        
        // Build workout from template
        template.structure.forEach(item => {
            const pool = this.exercises[item.from];
            if (pool) {
                if (item.fixed) {
                    // Fixed exercises
                    item.fixed.forEach(name => {
                        const ex = pool.find(e => e.name === name);
                        if (ex) workout.exercises.push({ ...ex, phase: item.phase });
                    });
                } else {
                    // Random selection
                    const shuffled = [...pool].sort(() => Math.random() - 0.5);
                    const selected = shuffled.slice(0, item.count);
                    selected.forEach(ex => {
                        workout.exercises.push({ ...ex, phase: item.phase });
                    });
                }
            }
        });
        
        // Cooldown
        workout.exercises.push({
            name: 'Cool Down Jog + Stretching',
            sets: 1,
            reps: '10 min jog + 5 min stretch',
            type: 'cooldown',
            phase: 'cooldown',
            notes: 'Easy jog + static stretching hips, quads, calves'
        });
        
        return workout;
    },
    
    getSplit(daysPerWeek) {
        const splits = {
            3: {
                name: 'Running 3-Day',
                sessions: [
                    { name: 'Easy Run', type: 'easy', sessionType: 'easy' },
                    { name: 'Tempo/Quality', type: 'tempo', sessionType: 'tempo' },
                    { name: 'Long Run', type: 'long', sessionType: 'long' }
                ]
            },
            4: {
                name: 'Running 4-Day',
                sessions: [
                    { name: 'Easy Run', type: 'easy', sessionType: 'easy' },
                    { name: 'Tempo', type: 'tempo', sessionType: 'tempo' },
                    { name: 'Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Long Run', type: 'long', sessionType: 'long' }
                ]
            },
            5: {
                name: 'Running 5-Day',
                sessions: [
                    { name: 'Easy Run', type: 'easy', sessionType: 'easy' },
                    { name: 'Intervals', type: 'intervals', sessionType: 'intervals' },
                    { name: 'Easy/Recovery', type: 'easy', sessionType: 'easy' },
                    { name: 'Tempo', type: 'tempo', sessionType: 'tempo' },
                    { name: 'Long Run', type: 'long', sessionType: 'long' }
                ]
            },
            6: {
                name: 'Running 6-Day (Serious)',
                sessions: [
                    { name: 'Easy Run', type: 'easy', sessionType: 'easy' },
                    { name: 'Intervals', type: 'intervals', sessionType: 'intervals' },
                    { name: 'Easy Run', type: 'easy', sessionType: 'easy' },
                    { name: 'Tempo', type: 'tempo', sessionType: 'tempo' },
                    { name: 'Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Long Run', type: 'long', sessionType: 'long' }
                ]
            }
        };
        
        return splits[daysPerWeek] || splits[4];
    },
    
    getTip() {
        const tips = [
            '80% easy, 20% hard. La maggior parte delle corse deve essere facile.',
            'La costanza batte l\'intensità. Meglio 4 corse facili che 1 corsa durissima.',
            'Forza unilaterale = meno infortuni. Non saltare mai il lavoro in palestra.',
            'Aumenta il volume max 10% a settimana. La pazienza è tutto.',
            'Il sonno è dove migliori. 8+ ore per runner seri.',
            'I polpacci forti prevengono il 70% degli infortuni ai runners. Allena eccentrici.'
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    },
    
    // Calcola zone HR in base a max HR
    calculateZones(maxHR) {
        return {
            zone1: { min: Math.round(maxHR * 0.60), max: Math.round(maxHR * 0.70) },
            zone2: { min: Math.round(maxHR * 0.70), max: Math.round(maxHR * 0.80) },
            zone3: { min: Math.round(maxHR * 0.80), max: Math.round(maxHR * 0.90) },
            zone4: { min: Math.round(maxHR * 0.90), max: Math.round(maxHR * 0.95) },
            zone5: { min: Math.round(maxHR * 0.95), max: maxHR }
        };
    },
    
    // Adatta per race week
    adaptToRace(workout, daysToRace) {
        if (daysToRace <= 2) {
            // Race day or day before: shake out only
            workout.exercises = workout.exercises.filter(ex => 
                ex.type === 'warmup' || ex.name === 'Easy Run' || ex.type === 'prevention'
            );
            workout.name = 'Pre-Race Shakeout';
            workout.notes = '20-30 min very easy + strides. Stay fresh!';
        } else if (daysToRace <= 7) {
            // Taper week: reduce volume
            workout.exercises.forEach(ex => {
                if (ex.reps && ex.reps.includes('min')) {
                    const time = parseInt(ex.reps);
                    if (time > 30) ex.reps = `${Math.floor(time * 0.6)} min`;
                }
            });
            workout.name += ' (Taper Week)';
        }
        return workout;
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🏃 ATLAS Running Module v1.0 loaded!');
console.log('   → Polarized Training (80/20)');
console.log('   → Strength for Runners');
console.log('   → Injury Prevention Protocols');
console.log('   → ATLASRunning.generateWorkout(profile, type)');
