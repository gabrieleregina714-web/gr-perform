/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🏋️ ATLAS CROSSFIT MODULE v1.0
 * NASA-Level CrossFit/Functional Fitness Training Intelligence
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Modulo specifico per CrossFit basato su:
 * - GPP (General Physical Preparedness)
 * - Constantly Varied Functional Movements
 * - High Intensity
 * - Olympic Weightlifting
 * - Gymnastics Movements
 * - Metabolic Conditioning
 * 
 * METODOLOGIE EVIDENCE-BASED:
 * - CrossFit Methodology
 * - Conjugate Periodization elements
 * - Aerobic Capacity + Power development
 */

window.ATLASCrossFit = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧬 SCIENTIFIC FOUNDATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    science: {
        // Le 10 fitness domains
        fitnessDomains: [
            'Cardiovascular Endurance',
            'Stamina',
            'Strength',
            'Flexibility',
            'Power',
            'Speed',
            'Coordination',
            'Agility',
            'Balance',
            'Accuracy'
        ],
        
        // Modalità metaboliche
        metabolicPathways: {
            phosphagen: '0-10 seconds (max effort)',
            glycolytic: '10 sec - 2 min (high power)',
            oxidative: '2+ minutes (sustained work)'
        },
        
        // Tipi di allenamento CrossFit
        workoutTypes: {
            AMRAP: 'As Many Rounds/Reps As Possible',
            EMOM: 'Every Minute On the Minute',
            FOR_TIME: 'Complete work as fast as possible',
            CHIPPER: 'Series of movements in sequence',
            STRENGTH: 'Heavy lifting focus',
            SKILL: 'Gymnastics/technique practice'
        },
        
        // Infortuni più comuni
        injuryRisk: {
            shoulder: 0.25,         // 25% - overhead, kipping
            lower_back: 0.20,       // 20% - deadlifts, oly lifts
            knee: 0.15,             // 15% - squats, box jumps
            wrist: 0.10,            // 10% - front rack, handstands
            elbow: 0.08,            // 8% - muscle-ups, pressing
            ankle: 0.07             // 7% - pistols, box jumps
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 💪 EXERCISE DATABASE
    // ═══════════════════════════════════════════════════════════════════════════
    
    exercises: {
        
        // WARMUP
        warmup: [
            { 
                name: '400m Run', 
                sets: 1, reps: '400m', 
                type: 'warmup',
                notes: 'Easy jog to elevate HR',
                cues: ['Easy pace', 'Steady breathing', 'Wake up']
            },
            { 
                name: 'Jump Rope', 
                sets: 1, reps: '2 min', 
                type: 'warmup',
                notes: 'Light bouncing',
                cues: ['Double bounce', 'Wrist rotation', 'Light feet']
            },
            { 
                name: 'PVC Pass Through', 
                sets: 2, reps: '15', 
                type: 'warmup',
                notes: 'Shoulder mobility',
                cues: ['Wide grip', 'Straight arms', 'Full ROM']
            },
            { 
                name: 'Samson Stretch', 
                sets: 2, reps: '30s per side', 
                type: 'warmup',
                notes: 'Hip flexor + overhead reach',
                cues: ['Lunge deep', 'Arms overhead', 'Squeeze back glute']
            },
            { 
                name: 'Air Squat', 
                sets: 2, reps: '15', 
                type: 'warmup',
                notes: 'Pattern activation',
                cues: ['Below parallel', 'Knees out', 'Chest up']
            },
            { 
                name: 'Inchworm', 
                sets: 2, reps: '8', 
                type: 'warmup',
                notes: 'Full body activation',
                cues: ['Walk hands out', 'Walk feet to hands', 'Straight legs']
            }
        ],
        
        // OLYMPIC LIFTS
        olympicLifts: [
            { 
                name: 'Clean', 
                sets: 5, reps: '3', 
                type: 'olympic',
                rest: '120s',
                notes: 'Power or squat clean',
                cues: ['Hook grip', 'Pull high', 'Fast elbows', 'Stand strong']
            },
            { 
                name: 'Clean and Jerk', 
                sets: 5, reps: '2', 
                type: 'olympic',
                rest: '150s',
                notes: 'Full movement',
                cues: ['Clean first', 'Dip-drive', 'Catch overhead', 'Stabilize']
            },
            { 
                name: 'Snatch', 
                sets: 5, reps: '2', 
                type: 'olympic',
                rest: '150s',
                notes: 'Power or full snatch',
                cues: ['Wide grip', 'Pull under', 'Lock overhead', 'Stand']
            },
            { 
                name: 'Hang Clean', 
                sets: 4, reps: '3', 
                type: 'olympic',
                rest: '120s',
                notes: 'Start from above knee',
                cues: ['Load hips', 'Triple extension', 'Fast elbows']
            },
            { 
                name: 'Hang Snatch', 
                sets: 4, reps: '3', 
                type: 'olympic',
                rest: '120s',
                notes: 'Start from above knee',
                cues: ['Load hips', 'Explode up', 'Punch through']
            }
        ],
        
        // STRENGTH
        strength: [
            { 
                name: 'Back Squat', 
                sets: 5, reps: '5', 
                type: 'strength',
                rest: '180s',
                notes: 'Build to heavy 5',
                cues: ['Below parallel', 'Braced core', 'Drive up']
            },
            { 
                name: 'Front Squat', 
                sets: 4, reps: '5', 
                type: 'strength',
                rest: '150s',
                notes: 'Elbows high, full depth',
                cues: ['Elbows up', 'Chest tall', 'Core tight']
            },
            { 
                name: 'Deadlift', 
                sets: 5, reps: '3', 
                type: 'strength',
                rest: '180s',
                notes: 'Build to heavy 3',
                cues: ['Tight setup', 'Drive floor', 'Lockout']
            },
            { 
                name: 'Strict Press', 
                sets: 5, reps: '5', 
                type: 'strength',
                rest: '120s',
                notes: 'No leg drive',
                cues: ['Core tight', 'Head through', 'Lockout']
            },
            { 
                name: 'Push Press', 
                sets: 4, reps: '5', 
                type: 'strength',
                rest: '120s',
                notes: 'With leg drive',
                cues: ['Dip-drive', 'Aggressive', 'Lockout']
            },
            { 
                name: 'Weighted Pull-up', 
                sets: 4, reps: '5', 
                type: 'strength',
                rest: '120s',
                notes: 'Add weight progressively',
                cues: ['Full hang', 'Chin over bar', 'Control down']
            }
        ],
        
        // GYMNASTICS
        gymnastics: [
            { 
                name: 'Pull-up', 
                sets: 3, reps: '10', 
                type: 'gymnastics',
                rest: '60s',
                notes: 'Strict or kipping',
                cues: ['Full hang', 'Chin over', 'Full extension']
            },
            { 
                name: 'Muscle-up (Ring/Bar)', 
                sets: 5, reps: '3', 
                type: 'gymnastics',
                rest: '90s',
                notes: 'Scaled to progression',
                cues: ['Big kip', 'Pull high', 'Fast transition', 'Lock out']
            },
            { 
                name: 'Handstand Push-up', 
                sets: 3, reps: '8', 
                type: 'gymnastics',
                rest: '90s',
                notes: 'Strict or kipping, wall supported',
                cues: ['Head to floor', 'Press out', 'Core tight']
            },
            { 
                name: 'Handstand Hold', 
                sets: 3, reps: '30s', 
                type: 'gymnastics',
                rest: '60s',
                notes: 'Wall or freestanding',
                cues: ['Fingers spread', 'Core tight', 'Eyes between hands']
            },
            { 
                name: 'Toes-to-Bar', 
                sets: 3, reps: '12', 
                type: 'gymnastics',
                rest: '60s',
                notes: 'Kipping allowed',
                cues: ['Kip swing', 'Compress', 'Touch bar']
            },
            { 
                name: 'Ring Dip', 
                sets: 3, reps: '10', 
                type: 'gymnastics',
                rest: '60s',
                notes: 'Strict or kipping',
                cues: ['Shoulder below elbow', 'Press out', 'Lockout']
            },
            { 
                name: 'Pistol Squat', 
                sets: 3, reps: '5 per side', 
                type: 'gymnastics',
                rest: '60s',
                notes: 'Full depth single leg squat',
                cues: ['Arms forward', 'Control down', 'Stand up']
            }
        ],
        
        // METABOLIC CONDITIONING MOVEMENTS
        metcon: [
            { 
                name: 'Thruster', 
                sets: 0, reps: 'In WOD', 
                type: 'metcon',
                notes: 'Front squat + push press in one',
                cues: ['Below parallel', 'Drive up', 'Press overhead']
            },
            { 
                name: 'Wall Ball', 
                sets: 0, reps: 'In WOD', 
                type: 'metcon',
                notes: '9kg/6kg ball to 10ft/9ft target',
                cues: ['Full squat', 'Drive up', 'Throw to target', 'Catch high']
            },
            { 
                name: 'Burpee', 
                sets: 0, reps: 'In WOD', 
                type: 'metcon',
                notes: 'Full standard or scaled',
                cues: ['Chest to floor', 'Jump up', 'Clap overhead']
            },
            { 
                name: 'Box Jump', 
                sets: 0, reps: 'In WOD', 
                type: 'metcon',
                notes: '24"/20" standard',
                cues: ['Explode up', 'Land soft', 'Stand tall']
            },
            { 
                name: 'Double Under', 
                sets: 0, reps: 'In WOD', 
                type: 'metcon',
                notes: 'Rope passes twice per jump',
                cues: ['Wrist rotation', 'Small jump', 'Stay tight']
            },
            { 
                name: 'Rowing', 
                sets: 0, reps: 'In WOD', 
                type: 'metcon',
                notes: 'Concept2 or similar',
                cues: ['Legs-back-arms', 'Ratio 1:2', 'Damper 5-7']
            },
            { 
                name: 'Assault Bike', 
                sets: 0, reps: 'In WOD', 
                type: 'metcon',
                notes: 'Calories or distance',
                cues: ['Legs drive', 'Arms coordinate', 'Pace smart']
            },
            { 
                name: 'Kettlebell Swing', 
                sets: 0, reps: 'In WOD', 
                type: 'metcon',
                notes: 'American (overhead) or Russian (eye level)',
                cues: ['Hip hinge', 'Snap hips', 'Float bell']
            }
        ],
        
        // WODS (Benchmark & Famous)
        wods: [
            { 
                name: 'Fran', 
                structure: '21-15-9',
                movements: ['Thruster (43kg/30kg)', 'Pull-ups'],
                type: 'for_time',
                notes: 'Classic benchmark. Go fast.',
                cues: ['Unbroken if possible', 'Breathe', 'Sprint']
            },
            { 
                name: 'Cindy', 
                structure: 'AMRAP 20',
                movements: ['5 Pull-ups', '10 Push-ups', '15 Air Squats'],
                type: 'amrap',
                notes: 'Bodyweight benchmark',
                cues: ['Consistent pace', 'Quick transitions', 'Breathe']
            },
            { 
                name: 'Grace', 
                structure: '30 reps',
                movements: ['Clean & Jerk (61kg/43kg)'],
                type: 'for_time',
                notes: 'Touch and go or singles',
                cues: ['Efficient technique', 'Pace start', 'Finish strong']
            },
            { 
                name: 'Helen', 
                structure: '3 rounds',
                movements: ['400m Run', '21 KB Swings (24kg/16kg)', '12 Pull-ups'],
                type: 'for_time',
                notes: 'Running + pulling',
                cues: ['Run hard', 'Big sets swings', 'Smooth pull-ups']
            },
            { 
                name: 'Murph', 
                structure: 'For Time',
                movements: ['1 mile Run', '100 Pull-ups', '200 Push-ups', '300 Squats', '1 mile Run'],
                type: 'for_time',
                notes: 'Hero WOD. 20lb vest optional.',
                cues: ['Partition as needed', 'Steady pace', 'Respect the workout']
            },
            { 
                name: 'Fight Gone Bad', 
                structure: '3 rounds of 1 min each',
                movements: ['Wall Ball', 'SDHP', 'Box Jump', 'Push Press', 'Row (cals)'],
                type: 'amrap',
                notes: '1 min rest between rounds',
                cues: ['Max effort each minute', 'Quick transitions', 'Count everything']
            }
        ],
        
        // ACCESSORY
        accessory: [
            { 
                name: 'Banded Face Pull', 
                sets: 3, reps: '20', 
                type: 'accessory',
                rest: '30s',
                notes: 'Shoulder health',
                cues: ['Pull to face', 'External rotate', 'Squeeze']
            },
            { 
                name: 'GHD Hip Extension', 
                sets: 3, reps: '15', 
                type: 'accessory',
                rest: '45s',
                notes: 'Posterior chain',
                cues: ['Hinge at hip', 'Squeeze glutes', 'Control']
            },
            { 
                name: 'Hollow Rock', 
                sets: 3, reps: '20', 
                type: 'accessory',
                rest: '30s',
                notes: 'Core for gymnastics',
                cues: ['Low back pressed', 'Arms overhead', 'Rock controlled']
            },
            { 
                name: 'L-Sit Hold', 
                sets: 3, reps: '20s', 
                type: 'accessory',
                rest: '60s',
                notes: 'Core + hip flexor strength',
                cues: ['Arms straight', 'Legs parallel to floor', 'Hold']
            }
        ],
        
        // ═══════════════════════════════════════════════════════════════
        // SHOULDER HEALTH - Fondamentale per overhead work
        // 25% injury rate spalle nel CrossFit, prehab essenziale
        // ═══════════════════════════════════════════════════════════════
        shoulderHealth: [
            { 
                name: 'Banded Pass-Through', 
                sets: 2, reps: '15', 
                type: 'prehab',
                rest: '0s',
                notes: 'Shoulder mobility per snatch/overhead',
                cues: ['Wide grip', 'Straight arms', 'Full arc']
            },
            { 
                name: 'Wall Slides', 
                sets: 2, reps: '10', 
                type: 'prehab',
                rest: '30s',
                notes: 'Attivazione scapolari + mobility',
                cues: ['Schiena contro muro', 'Gomiti a 90°', 'Scivola su']
            },
            { 
                name: 'Prone YTWL', 
                sets: 2, reps: '8 per posizione', 
                type: 'prehab',
                rest: '30s',
                notes: 'Rinforzo completo cuffia rotatori',
                cues: ['Pancia su panca', 'Pollici su', 'Squeeze scapole']
            },
            { 
                name: 'Band External Rotation', 
                sets: 2, reps: '15 per lato', 
                type: 'prehab',
                rest: '30s',
                notes: 'Rotator cuff essenziale per overhead',
                cues: ['Gomito fisso', 'Ruota fuori', 'Controllo']
            },
            { 
                name: 'Band Pull-Apart', 
                sets: 2, reps: '20', 
                type: 'prehab',
                rest: '30s',
                notes: 'Rinforzo posteriore per kipping',
                cues: ['Braccia dritte', 'Squeeze scapole', 'Controllo']
            },
            { 
                name: 'Cuban Rotation', 
                sets: 2, reps: '10', 
                type: 'prehab',
                rest: '30s',
                notes: 'Progressione verso overhead stability',
                cues: ['Row alto', 'Ruota su', 'Press leggero']
            },
            { 
                name: 'Sleeper Stretch', 
                sets: 2, reps: '45s per lato', 
                type: 'prehab',
                rest: '0s',
                notes: 'Mobilità rotazione interna',
                cues: ['Su fianco', 'Gomito fisso', 'Pressa delicata']
            },
            { 
                name: 'Doorway Pec Stretch', 
                sets: 2, reps: '45s per lato', 
                type: 'prehab',
                rest: '0s',
                notes: 'Apre petto per overhead',
                cues: ['Gomito 90°', 'Ruota via', 'Senti stretch']
            },
            { 
                name: 'Wrist Circles + Extensions', 
                sets: 2, reps: '10 per direzione', 
                type: 'prehab',
                rest: '0s',
                notes: 'Prep polsi per front rack e overhead',
                cues: ['Cerchi lenti', 'Stretch estensori', 'Entrambi versi']
            }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 WORKOUT TEMPLATES
    // ═══════════════════════════════════════════════════════════════════════════
    
    templates: {
        
        strength: {
            name: 'CrossFit Strength Focus',
            duration: 60,
            type: 'strength',
            structure: [
                { from: 'warmup', count: 4, phase: 'warmup' },
                { from: 'shoulderHealth', count: 3, phase: 'prehab' },  // Shoulder prep prima di overhead
                { from: 'strength', count: 2, phase: 'main' },
                { from: 'olympicLifts', count: 1, phase: 'main' },
                { from: 'accessory', count: 2, phase: 'finisher' }
            ]
        },
        
        metcon: {
            name: 'CrossFit MetCon',
            duration: 45,
            type: 'metcon',
            structure: [
                { from: 'warmup', count: 4, phase: 'warmup' },
                { from: 'wods', count: 1, phase: 'main' },
                { from: 'accessory', count: 2, phase: 'finisher' }
            ],
            includeWOD: true
        },
        
        olympic: {
            name: 'CrossFit Olympic Lifting',
            duration: 55,
            type: 'olympic',
            structure: [
                { from: 'warmup', count: 4, phase: 'warmup' },
                { from: 'olympicLifts', count: 2, phase: 'main' },
                { from: 'strength', count: 1, phase: 'main' },
                { from: 'accessory', count: 2, phase: 'finisher' }
            ]
        },
        
        gymnastics: {
            name: 'CrossFit Gymnastics',
            duration: 50,
            type: 'gymnastics',
            structure: [
                { from: 'warmup', count: 4, phase: 'warmup' },
                { from: 'gymnastics', count: 4, phase: 'main' },
                { from: 'accessory', count: 2, phase: 'finisher' }
            ]
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏗️ WORKOUT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    generateWorkout(profile, sessionType = 'metcon') {
        const template = this.templates[sessionType] || this.templates.metcon;
        
        console.log(`🏋️ Generating CrossFit Workout: ${template.name}`);
        
        const workout = {
            name: template.name,
            type: 'crossfit',
            sessionType: sessionType,
            duration: template.duration,
            sport: 'crossfit',
            exercises: [],
            metadata: {
                generatedAt: new Date().toISOString(),
                module: 'ATLASCrossFit v' + this.version,
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
        
        // Add WOD if metcon template
        if (template.includeWOD) {
            const randomWOD = this.exercises.wods[Math.floor(Math.random() * this.exercises.wods.length)];
            workout.wod = randomWOD;
        }
        
        // Cooldown
        workout.exercises.push({
            name: 'Mobility & Foam Rolling',
            sets: 1,
            reps: '10 min',
            type: 'cooldown',
            phase: 'cooldown',
            notes: 'Focus areas worked in WOD'
        });
        
        return workout;
    },
    
    getSplit(daysPerWeek) {
        const splits = {
            3: {
                name: 'CrossFit 3-Day',
                sessions: [
                    { name: 'Strength + Short MetCon', type: 'strength', sessionType: 'strength' },
                    { name: 'MetCon Focus', type: 'metcon', sessionType: 'metcon' },
                    { name: 'Olympic/Gymnastics', type: 'olympic', sessionType: 'olympic' }
                ]
            },
            4: {
                name: 'CrossFit 4-Day',
                sessions: [
                    { name: 'Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'MetCon', type: 'metcon', sessionType: 'metcon' },
                    { name: 'Olympic Lifting', type: 'olympic', sessionType: 'olympic' },
                    { name: 'Gymnastics', type: 'gymnastics', sessionType: 'gymnastics' }
                ]
            },
            5: {
                name: 'CrossFit 5-Day',
                sessions: [
                    { name: 'Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'MetCon Short', type: 'metcon', sessionType: 'metcon' },
                    { name: 'Olympic Lifting', type: 'olympic', sessionType: 'olympic' },
                    { name: 'MetCon Long', type: 'metcon', sessionType: 'metcon' },
                    { name: 'Gymnastics', type: 'gymnastics', sessionType: 'gymnastics' }
                ]
            }
        };
        
        return splits[daysPerWeek] || splits[4];
    },
    
    generateWOD(type = 'random') {
        if (type === 'benchmark') {
            return this.exercises.wods[Math.floor(Math.random() * this.exercises.wods.length)];
        }
        
        // Generate random WOD
        const wodTypes = ['amrap', 'for_time', 'emom'];
        const randomType = wodTypes[Math.floor(Math.random() * wodTypes.length)];
        
        const movements = [...this.exercises.metcon]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(m => m.name);
        
        return {
            name: 'ATLAS WOD',
            type: randomType,
            structure: randomType === 'amrap' ? 'AMRAP 12-15' : 
                       randomType === 'for_time' ? '3-5 rounds' : 'EMOM 12-16',
            movements: movements,
            notes: 'Scale as needed. Quality over quantity.'
        };
    },
    
    getTip() {
        const tips = [
            'La tecnica viene prima dell\'intensità. Sempre.',
            'Non sacrificare mai ROM per velocità.',
            'Il warmup è parte dell\'allenamento, non opzionale.',
            'Rest days are training days. Il recupero è dove migliori.',
            'Scale smart: meglio un workout completato che uno abbandonato.',
            'Registra TUTTO. I benchmark non mentono.'
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🏋️ ATLAS CrossFit Module v1.0 loaded!');
console.log('   → Olympic Lifting Progressions');
console.log('   → Gymnastics Skills');
console.log('   → Benchmark WODs Database');
console.log('   → ATLASCrossFit.generateWorkout(profile, type)');
