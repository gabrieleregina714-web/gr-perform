/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🏊 ATLAS SWIMMING MODULE v1.0
 * NASA-Level Swimming Training Intelligence
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Modulo specifico per Nuoto basato su:
 * - Stroke Technique Development
 * - Energy System Training
 * - Dryland Training for Swimmers
 * - Shoulder Injury Prevention
 * - Periodization for Meets
 * 
 * METODOLOGIE EVIDENCE-BASED:
 * - USA Swimming guidelines
 * - FINA Technical protocols
 * - Shoulder health research
 */

window.ATLASSwimming = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧬 SCIENTIFIC FOUNDATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    science: {
        // Stili e richieste
        strokeDemands: {
            freestyle: { 
                primary: ['Shoulder rotation', 'Core stability', 'Hip rotation'],
                injuryRisk: 'Moderate',
                distance: 'All distances'
            },
            backstroke: { 
                primary: ['Shoulder flexibility', 'Core strength', 'Hip rotation'],
                injuryRisk: 'Low-Moderate',
                distance: '50-200m'
            },
            breaststroke: { 
                primary: ['Hip flexibility', 'Knee stability', 'Chest strength'],
                injuryRisk: 'Knee/hip',
                distance: '50-200m'
            },
            butterfly: { 
                primary: ['Shoulder strength', 'Core power', 'Hip undulation'],
                injuryRisk: 'High (shoulder)',
                distance: '50-200m'
            }
        },
        
        // Infortuni più comuni
        injuryRisk: {
            shoulder_impingement: 0.35, // 35% - "swimmer's shoulder"
            rotator_cuff: 0.15,         // 15%
            knee_breaststroke: 0.12,    // 12%
            lower_back: 0.10,           // 10%
            neck: 0.08                  // 8%
        },
        
        // Sistemi energetici per distanza
        energySystems: {
            sprint_50: { aerobic: 0.30, anaerobic_lactic: 0.40, alactic: 0.30 },
            sprint_100: { aerobic: 0.40, anaerobic_lactic: 0.45, alactic: 0.15 },
            middle_200: { aerobic: 0.60, anaerobic_lactic: 0.35, alactic: 0.05 },
            distance_400plus: { aerobic: 0.80, anaerobic_lactic: 0.18, alactic: 0.02 }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 💪 EXERCISE DATABASE
    // ═══════════════════════════════════════════════════════════════════════════
    
    exercises: {
        
        // POOL WARMUP
        poolWarmup: [
            { 
                name: 'Easy Swim', 
                sets: 1, reps: '400m', 
                type: 'warmup',
                notes: 'Mixed strokes, comfortable pace',
                cues: ['Focus on technique', 'Long strokes', 'Relax']
            },
            { 
                name: 'Kick with Board', 
                sets: 1, reps: '200m', 
                type: 'warmup',
                notes: 'Freestyle kick',
                cues: ['From hips', 'Pointed toes', 'Steady rhythm']
            },
            { 
                name: 'Drill Work', 
                sets: 4, reps: '50m', 
                type: 'warmup',
                notes: 'Catch-up, fingertip drag, 6-3-6',
                cues: ['Focus on feel', 'Slow and deliberate', 'Perfect form']
            },
            { 
                name: 'Build 50s', 
                sets: 4, reps: '50m', 
                type: 'warmup',
                rest: '15s',
                notes: 'Progressive speed 60% → 90%',
                cues: ['Build each 50', 'Last 25 fast', 'Maintain form']
            }
        ],
        
        // POOL MAIN SETS
        poolMainSets: [
            { 
                name: 'Endurance Set', 
                sets: 1, reps: '10x100m @ 70%', 
                type: 'endurance',
                rest: '15s',
                notes: 'Aerobic base building',
                cues: ['Consistent pace', 'Focus on stroke count', 'Breathe easy']
            },
            { 
                name: 'Threshold Set', 
                sets: 1, reps: '6x200m @ 85%', 
                type: 'threshold',
                rest: '30s',
                notes: 'Lactate threshold development',
                cues: ['Challenging but sustainable', 'Even splits', 'Push last 50']
            },
            { 
                name: 'Sprint Set', 
                sets: 8, reps: '50m @ 95%', 
                type: 'sprint',
                rest: '60s',
                notes: 'Speed development',
                cues: ['Fast starts', 'Quick turnover', 'Full recovery']
            },
            { 
                name: 'IM Set', 
                sets: 4, reps: '100m IM', 
                type: 'mixed',
                rest: '20s',
                notes: 'Individual Medley: Fly-Back-Breast-Free',
                cues: ['Smooth transitions', 'Legal turns', 'Pace butterfly']
            },
            { 
                name: 'Descend Set', 
                sets: 4, reps: '4x100m descend 1-4', 
                type: 'threshold',
                rest: '20s',
                notes: 'Each 100 faster than previous',
                cues: ['#1 easy → #4 fast', '10-15s difference', 'Control early']
            },
            { 
                name: 'Broken Swim', 
                sets: 2, reps: '200m (50+50+50+50)', 
                type: 'race_pace',
                rest: '10s between 50s',
                notes: 'Race pace with short rest',
                cues: ['Race pace each 50', 'Quick wall', 'Maintain speed']
            }
        ],
        
        // DRYLAND WARMUP
        drylandWarmup: [
            { 
                name: 'Arm Circles', 
                sets: 2, reps: '20 each direction', 
                type: 'warmup',
                notes: 'Progressively larger',
                cues: ['Forward then back', 'Full ROM', 'Controlled']
            },
            { 
                name: 'Band Pull-Apart', 
                sets: 2, reps: '15', 
                type: 'warmup',
                notes: 'Scapular activation',
                cues: ['Squeeze blades', 'Straight arms', 'Controlled']
            },
            { 
                name: 'World\'s Greatest Stretch', 
                sets: 2, reps: '5 per side', 
                type: 'warmup',
                notes: 'Hip, T-spine, hamstring',
                cues: ['Lunge deep', 'Rotate open', 'Hamstring stretch']
            },
            { 
                name: 'Shoulder External Rotation', 
                sets: 2, reps: '15', 
                type: 'warmup',
                notes: 'Band or light weight',
                cues: ['Elbow at 90°', 'Rotate out', 'Controlled']
            }
        ],
        
        // DRYLAND STRENGTH
        drylandStrength: [
            { 
                name: 'Pull-up', 
                sets: 3, reps: '8-10', 
                type: 'strength',
                rest: '90s',
                notes: 'Pull pattern fondamentale',
                cues: ['Full hang', 'Chin over bar', 'Control down']
            },
            { 
                name: 'Lat Pulldown', 
                sets: 3, reps: '12', 
                type: 'strength',
                rest: '60s',
                notes: 'If pull-ups too hard',
                cues: ['Pull to chest', 'Squeeze lats', 'Lean slight back']
            },
            { 
                name: 'Dumbbell Row', 
                sets: 3, reps: '10 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Unilateral pulling',
                cues: ['Pull to hip', 'Squeeze blade', 'Flat back']
            },
            { 
                name: 'Push-up', 
                sets: 3, reps: '15', 
                type: 'strength',
                rest: '60s',
                notes: 'Push pattern per bracciata',
                cues: ['Core tight', 'Full ROM', 'Elbows 45°']
            },
            { 
                name: 'Medicine Ball Overhead Throw', 
                sets: 3, reps: '10', 
                type: 'power',
                rest: '60s',
                notes: 'Simula catch della bracciata',
                cues: ['Engage lats', 'Throw down hard', 'Catch and repeat']
            },
            { 
                name: 'Cable Straight Arm Pulldown', 
                sets: 3, reps: '12', 
                type: 'strength',
                rest: '60s',
                notes: 'Specifico per nuoto - catch phase',
                cues: ['Straight arms', 'Pull to hips', 'Squeeze lats']
            }
        ],
        
        // DRYLAND CORE
        drylandCore: [
            { 
                name: 'Plank', 
                sets: 3, reps: '45-60s', 
                type: 'core',
                rest: '30s',
                notes: 'Streamline stability',
                cues: ['Straight line', 'Engage everything', 'Breathe']
            },
            { 
                name: 'Streamline Flutter Kicks (on ground)', 
                sets: 3, reps: '30s', 
                type: 'core',
                rest: '30s',
                notes: 'Core endurance per kick',
                cues: ['Low back pressed', 'Arms overhead', 'Flutter legs']
            },
            { 
                name: 'Superman + Swimmer', 
                sets: 3, reps: '10', 
                type: 'core',
                rest: '30s',
                notes: 'Back extension + alternating arms/legs',
                cues: ['Lift all limbs', 'Alternate flutter', 'Control']
            },
            { 
                name: 'Dead Bug', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '30s',
                notes: 'Anti-extension',
                cues: ['Low back flat', 'Opposite arm/leg', 'Slow']
            },
            { 
                name: 'Russian Twist', 
                sets: 3, reps: '20 total', 
                type: 'core',
                rest: '30s',
                notes: 'Rotation per hip roll',
                cues: ['Feet up or down', 'Rotate from core', 'Light weight']
            }
        ],
        
        // SHOULDER HEALTH (Cruciale)
        shoulderHealth: [
            { 
                name: 'Band External Rotation at 90°', 
                sets: 3, reps: '15', 
                type: 'prevention',
                rest: '30s',
                notes: 'Rotator cuff #1',
                cues: ['Elbow at 90°', 'Rotate out', 'Controlled']
            },
            { 
                name: 'Band Internal Rotation at 90°', 
                sets: 3, reps: '15', 
                type: 'prevention',
                rest: '30s',
                notes: 'Balance external work',
                cues: ['Elbow at 90°', 'Rotate in', 'Controlled']
            },
            { 
                name: 'YTWL Raises', 
                sets: 2, reps: '10 each', 
                type: 'prevention',
                rest: '30s',
                notes: 'Lower trap, rhomboid',
                cues: ['Y-T-W-L pattern', 'Light weight', 'Squeeze blades']
            },
            { 
                name: 'Face Pull', 
                sets: 3, reps: '15', 
                type: 'prevention',
                rest: '30s',
                notes: 'Postura + rotator cuff',
                cues: ['Pull to face', 'External rotate', 'Squeeze']
            },
            { 
                name: 'Sleeper Stretch', 
                sets: 2, reps: '30s per side', 
                type: 'prevention',
                notes: 'Internal rotation mobility',
                cues: ['Lie on shoulder', 'Push forearm down gently', 'Never force']
            },
            { 
                name: 'Doorway Pec Stretch', 
                sets: 2, reps: '30s per side', 
                type: 'prevention',
                notes: 'Counter tight pecs from swim',
                cues: ['Elbow at 90°', 'Lean forward', 'Feel stretch chest']
            }
        ],
        
        // DRILLS (Pool)
        drills: [
            { 
                name: 'Catch-up Drill', 
                sets: 4, reps: '50m', 
                type: 'drill',
                notes: 'Timing e rotation',
                cues: ['Wait for hand', 'Rotate fully', 'Long glide']
            },
            { 
                name: 'Fingertip Drag', 
                sets: 4, reps: '50m', 
                type: 'drill',
                notes: 'High elbow recovery',
                cues: ['Drag fingers', 'Elbow high', 'Relax recovery']
            },
            { 
                name: '6-3-6 Drill', 
                sets: 4, reps: '50m', 
                type: 'drill',
                notes: 'Balance e rotation',
                cues: ['6 kicks on side', '3 strokes', 'Switch']
            },
            { 
                name: 'Fist Drill', 
                sets: 4, reps: '50m', 
                type: 'drill',
                notes: 'Forearm catch awareness',
                cues: ['Close fists', 'Feel forearm catch', 'Open for speed']
            },
            { 
                name: 'Single Arm Freestyle', 
                sets: 4, reps: '50m (25 each arm)', 
                type: 'drill',
                notes: 'Isolate each arm',
                cues: ['Other arm at side', 'Breathe to stroking side', 'Focus']
            }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 WORKOUT TEMPLATES
    // ═══════════════════════════════════════════════════════════════════════════
    
    templates: {
        
        pool_endurance: {
            name: 'Pool Endurance Session',
            duration: 60,
            type: 'pool',
            distance: '3000-4000m',
            structure: [
                { from: 'poolWarmup', count: 3, phase: 'warmup' },
                { from: 'drills', count: 2, phase: 'drill' },
                { from: 'poolMainSets', count: 1, phase: 'main', fixed: ['Endurance Set'] }
            ]
        },
        
        pool_sprint: {
            name: 'Pool Sprint Session',
            duration: 50,
            type: 'pool',
            distance: '2500-3000m',
            structure: [
                { from: 'poolWarmup', count: 4, phase: 'warmup' },
                { from: 'poolMainSets', count: 1, phase: 'main', fixed: ['Sprint Set'] }
            ]
        },
        
        dryland: {
            name: 'Dryland Strength',
            duration: 45,
            type: 'dryland',
            structure: [
                { from: 'drylandWarmup', count: 4, phase: 'warmup' },
                { from: 'drylandStrength', count: 4, phase: 'main' },
                { from: 'drylandCore', count: 3, phase: 'main' },
                { from: 'shoulderHealth', count: 3, phase: 'finisher' }
            ]
        },
        
        prevention: {
            name: 'Shoulder Prevention',
            duration: 30,
            type: 'prevention',
            structure: [
                { from: 'drylandWarmup', count: 3, phase: 'warmup' },
                { from: 'shoulderHealth', count: 6, phase: 'main' }
            ]
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏗️ WORKOUT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    generateWorkout(profile, sessionType = 'pool_endurance') {
        const template = this.templates[sessionType] || this.templates.pool_endurance;
        
        console.log(`🏊 Generating Swimming Workout: ${template.name}`);
        
        const workout = {
            name: template.name,
            type: 'swimming',
            sessionType: sessionType,
            duration: template.duration,
            sport: 'swimming',
            distance: template.distance || null,
            exercises: [],
            metadata: {
                generatedAt: new Date().toISOString(),
                module: 'ATLASSwimming v' + this.version,
                tip: this.getTip()
            }
        };
        
        // Build workout from template
        template.structure.forEach(item => {
            const pool = this.exercises[item.from];
            if (pool) {
                if (item.fixed) {
                    item.fixed.forEach(name => {
                        const ex = pool.find(e => e.name === name);
                        if (ex) workout.exercises.push({ ...ex, phase: item.phase });
                    });
                } else {
                    const shuffled = [...pool].sort(() => Math.random() - 0.5);
                    const selected = shuffled.slice(0, item.count);
                    selected.forEach(ex => {
                        workout.exercises.push({ ...ex, phase: item.phase });
                    });
                }
            }
        });
        
        // Cooldown
        if (sessionType.includes('pool')) {
            workout.exercises.push({
                name: 'Easy Cool Down Swim',
                sets: 1,
                reps: '200-400m',
                type: 'cooldown',
                phase: 'cooldown',
                notes: 'Very easy, mixed strokes'
            });
        } else {
            workout.exercises.push({
                name: 'Stretching',
                sets: 1,
                reps: '10 min',
                type: 'cooldown',
                phase: 'cooldown',
                notes: 'Focus shoulders, lats, chest'
            });
        }
        
        return workout;
    },
    
    getSplit(daysPerWeek) {
        const splits = {
            4: {
                name: 'Swimming 4-Day',
                sessions: [
                    { name: 'Pool Endurance', type: 'pool', sessionType: 'pool_endurance' },
                    { name: 'Dryland Strength', type: 'dryland', sessionType: 'dryland' },
                    { name: 'Pool Sprint', type: 'pool', sessionType: 'pool_sprint' },
                    { name: 'Pool Technique', type: 'pool', sessionType: 'pool_endurance' }
                ]
            },
            5: {
                name: 'Swimming 5-Day',
                sessions: [
                    { name: 'Pool Endurance', type: 'pool', sessionType: 'pool_endurance' },
                    { name: 'Dryland Strength', type: 'dryland', sessionType: 'dryland' },
                    { name: 'Pool Threshold', type: 'pool', sessionType: 'pool_endurance' },
                    { name: 'Pool Sprint', type: 'pool', sessionType: 'pool_sprint' },
                    { name: 'Prevention + Light Pool', type: 'prevention', sessionType: 'prevention' }
                ]
            },
            6: {
                name: 'Swimming 6-Day (Competitive)',
                sessions: [
                    { name: 'Pool AM: Endurance', type: 'pool', sessionType: 'pool_endurance' },
                    { name: 'Dryland Strength', type: 'dryland', sessionType: 'dryland' },
                    { name: 'Pool: Threshold', type: 'pool', sessionType: 'pool_endurance' },
                    { name: 'Pool: Sprint', type: 'pool', sessionType: 'pool_sprint' },
                    { name: 'Dryland + Prevention', type: 'dryland', sessionType: 'dryland' },
                    { name: 'Pool: Race Pace', type: 'pool', sessionType: 'pool_sprint' }
                ]
            }
        };
        
        return splits[daysPerWeek] || splits[5];
    },
    
    getTip() {
        const tips = [
            'La salute delle spalle è TUTTO nel nuoto. Mai saltare prehab/prevention.',
            'L\'80% dell\'allenamento dovrebbe essere a intensità moderata.',
            'Dryland non sostituisce l\'acqua, la supporta. Non invertire le priorità.',
            'Tecnica > Volume > Intensità. In quest\'ordine.',
            'Conta le bracciate per vasca. Meno = più efficienza.',
            'Recupera attivamente: nuoto leggero batte riposo completo per la rigenerazione.'
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🏊 ATLAS Swimming Module v1.0 loaded!');
console.log('   → Pool Workout Sets');
console.log('   → Dryland Training');
console.log('   → Shoulder Prevention Protocols');
console.log('   → ATLASSwimming.generateWorkout(profile, type)');
