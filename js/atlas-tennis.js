/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🎾 ATLAS TENNIS MODULE v1.0
 * NASA-Level Tennis Training Intelligence
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Modulo specifico per Tennis basato su:
 * - Rotational Power Development
 * - Lateral Movement & Deceleration
 * - Shoulder Health & Injury Prevention
 * - Repeated Sprint Ability
 * - Tournament Load Management
 * 
 * METODOLOGIE EVIDENCE-BASED:
 * - ITF Sports Science guidelines
 * - ATP/WTA Performance Center protocols
 * - Rotator Cuff & Shoulder research
 */

window.ATLASTennis = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧬 SCIENTIFIC FOUNDATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    science: {
        // Richieste fisiologiche tennis (best of 3/5 sets)
        matchDemands: {
            matchDuration: '1-4+ hours',
            pointDuration: '5-10 sec average',
            restBetweenPoints: '20-25 sec',
            strokesPerPoint: '3-5',
            totalStrokes: '300-600 per match',
            distancePerPoint: '8-15m',
            directionChanges: '4-8 per point',
            serveSpeed: '120-230 km/h'
        },
        
        // Sistemi energetici
        energySystems: {
            aerobic: 0.50,          // 50% - recupero tra punti
            anaerobic_lactic: 0.20, // 20% - punti prolungati
            anaerobic_alactic: 0.30 // 30% - colpi esplosivi, serve
        },
        
        // Infortuni più comuni
        injuryRisk: {
            shoulder: 0.22,         // 22% - serve, overhead
            elbow_tennis: 0.18,     // 18% - tennis elbow
            wrist: 0.12,            // 12% - impatti ripetuti
            back: 0.14,             // 14% - rotazione, serve
            ankle: 0.10,            // 10% - movimenti laterali
            knee: 0.08,             // 8% - decelerazioni
            abdominal: 0.06         // 6% - serve strain
        },
        
        // Qualità fisiche chiave
        keyPerformance: [
            'Rotational Power (groundstrokes)',
            'Lateral Speed & Change of Direction',
            'First Step Quickness',
            'Shoulder Stability & Strength',
            'Core Anti-Rotation',
            'Repeated Sprint Ability',
            'Grip Endurance'
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 💪 EXERCISE DATABASE
    // ═══════════════════════════════════════════════════════════════════════════
    
    exercises: {
        
        // WARMUP TENNIS
        warmup: [
            { 
                name: 'Light Jog + Arm Circles', 
                sets: 1, reps: '3-5 min', 
                type: 'warmup',
                notes: 'Riscaldamento generale',
                cues: ['Easy pace', 'Progress arm size', 'Both directions']
            },
            { 
                name: 'Dynamic Side Shuffles', 
                sets: 2, reps: 'Baseline to baseline', 
                type: 'warmup',
                notes: 'Attivazione pattern laterale',
                cues: ['Athletic stance', 'Push off outside foot', 'Arms ready']
            },
            { 
                name: 'Walking Lunges with Rotation', 
                sets: 2, reps: '10 per side', 
                type: 'warmup',
                notes: 'Mobilità anche + rotazione',
                cues: ['Deep lunge', 'Rotate toward front leg', 'Controlled']
            },
            { 
                name: 'Shadow Swings', 
                sets: 2, reps: '10 each stroke', 
                type: 'warmup',
                notes: 'Forehand, backhand, serve motion senza racchetta',
                cues: ['Full ROM', 'Progressive intensity', 'Pattern recognition']
            },
            { 
                name: 'Shoulder Band External Rotation', 
                sets: 2, reps: '15', 
                type: 'warmup',
                notes: 'Attivazione rotator cuff pre-tennis',
                cues: ['Elbow at 90°', 'Rotate outward', 'Controlled']
            },
            { 
                name: 'Split Step Drill', 
                sets: 2, reps: '20 reps', 
                type: 'warmup',
                notes: 'Foundation del footwork tennis',
                cues: ['Light hop', 'Land on balls of feet', 'Ready position']
            }
        ],
        
        // ROTATIONAL POWER
        rotationalPower: [
            { 
                name: 'Medicine Ball Rotational Throw', 
                sets: 3, reps: '8 per side', 
                type: 'power',
                rest: '60s',
                notes: 'Simula forehand/backhand. 3-5kg ball.',
                cues: ['Hip rotation initiates', 'Follow through', 'Max intent']
            },
            { 
                name: 'Cable Woodchop (High to Low)', 
                sets: 3, reps: '10 per side', 
                type: 'power',
                rest: '45s',
                notes: 'Potenza diagonale overhead → groundstroke',
                cues: ['Rotate hips', 'Arms follow', 'Control eccentric']
            },
            { 
                name: 'Landmine Rotation', 
                sets: 3, reps: '8 per side', 
                type: 'power',
                rest: '60s',
                notes: 'Potenza rotazionale con carico',
                cues: ['Pivot feet', 'Rotate through core', 'Controlled']
            },
            { 
                name: 'Pallof Press with Rotation', 
                sets: 3, reps: '8 per side', 
                type: 'power',
                rest: '45s',
                notes: 'Anti-rotation + rotation combo',
                cues: ['Press out', 'Rotate away from cable', 'Return controlled']
            },
            { 
                name: 'Seated Med Ball Twist Throw', 
                sets: 3, reps: '10 per side', 
                type: 'power',
                rest: '45s',
                notes: 'Core rotation isolata',
                cues: ['Sit tall', 'Quick rotation', 'Catch and repeat']
            }
        ],
        
        // LATERAL SPEED
        lateralSpeed: [
            { 
                name: 'Lateral Bound (Stick)', 
                sets: 3, reps: '6 per side', 
                type: 'power',
                rest: '60s',
                notes: 'Potenza laterale + stabilizzazione',
                cues: ['Push off explosively', 'Stick landing 2-3s', 'Absorb with hip']
            },
            { 
                name: 'Skater Jump', 
                sets: 3, reps: '10 alternating', 
                type: 'power',
                rest: '45s',
                notes: 'Reactive lateral power',
                cues: ['Bound side to side', 'Swing arms', 'Quick ground contact']
            },
            { 
                name: 'Ladder Lateral Quick Feet', 
                sets: 3, reps: '3 runs through', 
                type: 'agility',
                rest: '30s',
                notes: 'Footwork speed',
                cues: ['In-out pattern', 'Stay low', 'Arms coordinated']
            },
            { 
                name: 'Side Shuffle to Sprint', 
                sets: 4, reps: '5m shuffle + 10m sprint', 
                type: 'agility',
                rest: '60s',
                notes: 'Transition baseline → approach',
                cues: ['Shuffle defensive', 'Hip turn', 'Accelerate']
            },
            { 
                name: 'Deceleration Drill', 
                sets: 3, reps: '10m sprint + stop', 
                type: 'agility',
                rest: '45s',
                notes: 'Controllo freno per colpi wide',
                cues: ['Max speed', 'Lower hips to stop', 'Absorb with legs']
            }
        ],
        
        // STRENGTH - Lower Body
        strengthLower: [
            { 
                name: 'Goblet Squat', 
                sets: 3, reps: '12', 
                type: 'strength',
                rest: '90s',
                notes: 'Base squat pattern con mobilità',
                cues: ['Elbows inside knees', 'Depth', 'Drive up']
            },
            { 
                name: 'Single Leg Squat (to Box)', 
                sets: 3, reps: '8 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Forza unilaterale per recupero',
                cues: ['Control down', 'Touch box lightly', 'Stand up']
            },
            { 
                name: 'Romanian Deadlift', 
                sets: 3, reps: '10', 
                type: 'strength',
                rest: '90s',
                notes: 'Posterior chain per frenata',
                cues: ['Hip hinge', 'Soft knees', 'Feel hamstrings']
            },
            { 
                name: 'Calf Raise (Standing)', 
                sets: 3, reps: '15', 
                type: 'strength',
                rest: '45s',
                notes: 'Propulsione + split step',
                cues: ['Full ROM', 'Pause top', 'Slow down']
            },
            { 
                name: 'Lateral Lunge', 
                sets: 3, reps: '10 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Forza laterale, simula recovery',
                cues: ['Push hips back', 'Weight in heel', 'Push back']
            }
        ],
        
        // STRENGTH - Upper Body
        strengthUpper: [
            { 
                name: 'Dumbbell Row', 
                sets: 3, reps: '10 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Bilancia pushing da colpi',
                cues: ['Pull to hip', 'Squeeze shoulder blade', 'Control down']
            },
            { 
                name: 'Push-up (Varied Grip)', 
                sets: 3, reps: '12-15', 
                type: 'strength',
                rest: '60s',
                notes: 'Forza push per serve follow through',
                cues: ['Core tight', 'Full ROM', 'Vary hand width']
            },
            { 
                name: 'Face Pull', 
                sets: 3, reps: '15', 
                type: 'prevention',
                rest: '45s',
                notes: 'Salute spalle - bilanciare pushing',
                cues: ['High pull', 'External rotate at end', 'Squeeze blades']
            },
            { 
                name: 'Forearm Roller (Pronation/Supination)', 
                sets: 3, reps: '10 each direction', 
                type: 'prevention',
                rest: '45s',
                notes: 'Forza avambraccio per grip + tennis elbow prevention',
                cues: ['Full rotation', 'Controlled', 'Light weight']
            }
        ],
        
        // ═══════════════════════════════════════════════════════════════
        // TENNIS ELBOW PREVENTION - 18% injury rate epicondilite
        // Protocollo evidence-based per prevenzione e riabilitazione
        // ═══════════════════════════════════════════════════════════════
        tennisElbowPrevention: [
            { 
                name: 'Eccentric Wrist Extension', 
                sets: 3, reps: '15 (3s eccentric)', 
                type: 'prevention',
                rest: '45s',
                notes: 'Gold standard per tennis elbow. Focus sulla fase eccentrica',
                cues: ['Palmo giù', 'Alza con altra mano', 'Abbassa lento 3s']
            },
            { 
                name: 'Tyler Twist (FlexBar)', 
                sets: 3, reps: '15 per lato', 
                type: 'prevention',
                rest: '45s',
                notes: 'Eccellente per epicondilite. Con TheraBand FlexBar',
                cues: ['Polso flesso da un lato', 'Ruota con altro', 'Rilascia lento']
            },
            { 
                name: 'Wrist Flexor Stretch', 
                sets: 2, reps: '30s per lato', 
                type: 'prevention',
                rest: '0s',
                notes: 'Stretching flessori - pre/post ogni sessione',
                cues: ['Braccio dritto', 'Palmo su', 'Tira dita verso te']
            },
            { 
                name: 'Wrist Extensor Stretch', 
                sets: 2, reps: '30s per lato', 
                type: 'prevention',
                rest: '0s',
                notes: 'Stretching estensori - fondamentale per prevenzione',
                cues: ['Braccio dritto', 'Palmo giù', 'Tira dita verso te']
            },
            { 
                name: 'Reverse Wrist Curl', 
                sets: 3, reps: '15', 
                type: 'prevention',
                rest: '45s',
                notes: 'Rinforzo estensori con peso leggero',
                cues: ['Avambraccio su panca', 'Solo polso fuori', 'Controllo']
            },
            { 
                name: 'Wrist Curl', 
                sets: 3, reps: '15', 
                type: 'prevention',
                rest: '45s',
                notes: 'Bilanciare flessori ed estensori',
                cues: ['Palmo su', 'Curl polso', 'Full ROM']
            },
            { 
                name: 'Grip Strengthening (Gripper/Ball)', 
                sets: 2, reps: '20', 
                type: 'prevention',
                rest: '30s',
                notes: 'Forza grip per ridurre stress su tendini',
                cues: ['Squeeze completo', 'Rilascia lento', 'Entrambe mani']
            },
            { 
                name: 'Finger Extensions (Rubber Band)', 
                sets: 2, reps: '20', 
                type: 'prevention',
                rest: '0s',
                notes: 'Bilanciare grip con estensione dita',
                cues: ['Elastico su dita', 'Apri completamente', 'Ripeti']
            }
        ],
        
        // SHOULDER HEALTH (Cruciale per tennis)
        shoulderHealth: [
            { 
                name: 'External Rotation at 90° (Side Lying)', 
                sets: 3, reps: '15', 
                type: 'prevention',
                rest: '45s',
                notes: 'Rotator cuff specifico per serve',
                cues: ['Elbow at 90°', 'Rotate weight up', 'Controlled']
            },
            { 
                name: 'Internal Rotation at 90°', 
                sets: 3, reps: '15', 
                type: 'prevention',
                rest: '45s',
                notes: 'Bilanciare external rotation',
                cues: ['Elbow at 90°', 'Rotate down', 'Light resistance']
            },
            { 
                name: 'YTWL Raises (Prone)', 
                sets: 2, reps: '10 each', 
                type: 'prevention',
                rest: '30s',
                notes: 'Lower trap, rhomboid activation',
                cues: ['Y-T-W-L shapes', 'Light weight or bands', 'Controlled']
            },
            { 
                name: 'Sleeper Stretch', 
                sets: 2, reps: '30s hold per side', 
                type: 'prevention',
                rest: '15s',
                notes: 'Mobilità rotazione interna',
                cues: ['Lie on shoulder', 'Push forearm down gently', 'Never force']
            },
            { 
                name: 'Shoulder Band Distraction', 
                sets: 2, reps: '30s per side', 
                type: 'prevention',
                rest: '15s',
                notes: 'Mobilità capsulare',
                cues: ['Band around wrist', 'Lean away', 'Relax into stretch']
            }
        ],
        
        // CORE TENNIS
        coreTennis: [
            { 
                name: 'Pallof Press', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '45s',
                notes: 'Anti-rotation base',
                cues: ['Press straight out', 'Resist rotation', 'Controlled']
            },
            { 
                name: 'Half-Kneeling Cable Lift', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '45s',
                notes: 'Simula forehand/backhand pattern',
                cues: ['Low to high', 'Rotate from core', 'Arms follow']
            },
            { 
                name: 'Dead Bug', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '30s',
                notes: 'Anti-estensione',
                cues: ['Low back pressed', 'Extend opposite arm/leg', 'Breathe']
            },
            { 
                name: 'Bird Dog', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '30s',
                notes: 'Stabilità + coordinazione',
                cues: ['Opposite arm/leg', 'Keep hips level', 'Slow']
            },
            { 
                name: 'Side Plank with Rotation', 
                sets: 3, reps: '8 per side', 
                type: 'core',
                rest: '45s',
                notes: 'Obliqui + rotazione',
                cues: ['Thread the needle', 'Open chest to ceiling', 'Controlled']
            }
        ],
        
        // CONDITIONING
        conditioning: [
            { 
                name: 'On-Court Point Simulation', 
                sets: 10, reps: '10s work / 20s rest', 
                type: 'conditioning',
                rest: 'As prescribed',
                notes: 'Simula timing punto',
                cues: ['Max effort 10s', 'Light feet 20s', 'Repeat']
            },
            { 
                name: 'Fan Drill (5-Point)', 
                sets: 4, reps: '1 full drill', 
                type: 'conditioning',
                rest: '45s',
                notes: 'Tocca 5 coni a ventaglio dal centro',
                cues: ['Center → cone → center', 'All 5', 'Max speed']
            },
            { 
                name: '20-20-20 Intervals', 
                sets: 6, reps: '20s sprint / 20s jog / 20s rest', 
                type: 'conditioning',
                rest: 'As prescribed',
                notes: 'Interval training tennis-specific',
                cues: ['Sprint max', 'Active recovery', 'Full rest']
            },
            { 
                name: 'Suicide Drill (Court)', 
                sets: 3, reps: 'Service line → baseline → net', 
                type: 'conditioning',
                rest: '60s',
                notes: 'Accelerazione e decelerazione',
                cues: ['Touch each line', 'Quick turn', 'Return']
            }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 WORKOUT TEMPLATES
    // ═══════════════════════════════════════════════════════════════════════════
    
    templates: {
        
        strength: {
            name: 'Tennis Strength Session',
            duration: 55,
            type: 'strength',
            structure: [
                { from: 'warmup', count: 4, phase: 'warmup' },
                { from: 'strengthLower', count: 3, phase: 'main' },
                { from: 'strengthUpper', count: 2, phase: 'main' },
                { from: 'shoulderHealth', count: 3, phase: 'finisher' }
            ]
        },
        
        power: {
            name: 'Tennis Power & Rotation',
            duration: 50,
            type: 'power',
            structure: [
                { from: 'warmup', count: 4, phase: 'warmup' },
                { from: 'rotationalPower', count: 4, phase: 'main' },
                { from: 'coreTennis', count: 3, phase: 'main' }
            ]
        },
        
        speed: {
            name: 'Tennis Speed & Agility',
            duration: 45,
            type: 'speed',
            structure: [
                { from: 'warmup', count: 5, phase: 'warmup' },
                { from: 'lateralSpeed', count: 4, phase: 'main' },
                { from: 'conditioning', count: 2, phase: 'main' }
            ]
        },
        
        prevention: {
            name: 'Tennis Prevention & Recovery',
            duration: 40,
            type: 'prevention',
            structure: [
                { from: 'warmup', count: 3, phase: 'warmup' },
                { from: 'tennisElbowPrevention', count: 4, phase: 'main' },  // Tennis elbow protocol
                { from: 'shoulderHealth', count: 4, phase: 'main' },
                { from: 'coreTennis', count: 2, phase: 'finisher' }
            ]
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏗️ WORKOUT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    generateWorkout(profile, sessionType = 'strength') {
        const template = this.templates[sessionType] || this.templates.strength;
        
        console.log(`🎾 Generating Tennis Workout: ${template.name}`);
        
        const workout = {
            name: template.name,
            type: 'tennis',
            sessionType: sessionType,
            duration: template.duration,
            sport: 'tennis',
            exercises: [],
            metadata: {
                generatedAt: new Date().toISOString(),
                module: 'ATLASTennis v' + this.version,
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
            reps: '10 min',
            type: 'cooldown',
            phase: 'cooldown',
            notes: 'Focus shoulders, hips, forearms, calves'
        });
        
        return workout;
    },
    
    getSplit(daysPerWeek) {
        const splits = {
            2: {
                name: 'Tennis 2-Day',
                sessions: [
                    { name: 'Strength + Power', type: 'strength', sessionType: 'strength' },
                    { name: 'Speed + Prevention', type: 'speed', sessionType: 'speed' }
                ]
            },
            3: {
                name: 'Tennis 3-Day',
                sessions: [
                    { name: 'Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Power & Rotation', type: 'power', sessionType: 'power' },
                    { name: 'Speed & Agility', type: 'speed', sessionType: 'speed' }
                ]
            },
            4: {
                name: 'Tennis 4-Day',
                sessions: [
                    { name: 'Strength', type: 'strength', sessionType: 'strength' },
                    { name: 'Power', type: 'power', sessionType: 'power' },
                    { name: 'Speed', type: 'speed', sessionType: 'speed' },
                    { name: 'Prevention', type: 'prevention', sessionType: 'prevention' }
                ]
            }
        };
        
        return splits[daysPerWeek] || splits[3];
    },
    
    getTip() {
        const tips = [
            'Le spalle sono tutto nel tennis. Mai saltare il lavoro di prevenzione rotator cuff.',
            'La potenza rotazionale viene dai fianchi, non dalle braccia. Focus sul core.',
            'La velocità laterale batte la velocità lineare nel tennis.',
            'Avambracci forti = meno tennis elbow. Allena grip e forearm.',
            'Dopo lunghe sessioni di gioco, fai almeno 15 min di mobilità spalle.',
            'Il split step è il fondamento: allenalo fino a renderlo automatico.'
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    },
    
    // Adatta allenamento pre-torneo
    adaptToTournament(workout, daysToTournament) {
        if (daysToTournament <= 2) {
            // Match day or day before: solo attivazione
            workout.exercises = workout.exercises.filter(ex => 
                ex.type === 'warmup' || ex.type === 'prevention'
            );
            workout.name = 'Pre-Match: Activation Only';
            workout.notes = 'Attivazione leggera. Niente fatica.';
        } else if (daysToTournament <= 5) {
            // Tournament week: ridurre volume
            workout.exercises.forEach(ex => {
                if (ex.sets > 2) ex.sets = 2;
                if (typeof ex.reps === 'number' && ex.reps > 8) ex.reps = 8;
            });
            workout.name += ' (Tournament Week)';
        }
        return workout;
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🎾 ATLAS Tennis Module v1.0 loaded!');
console.log('   → Rotational Power Training');
console.log('   → Shoulder Prevention Protocols');
console.log('   → Lateral Speed & Agility');
console.log('   → ATLASTennis.generateWorkout(profile, type)');
