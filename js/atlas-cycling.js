/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🚴 ATLAS CYCLING MODULE v1.0
 * NASA-Level Cycling Training Intelligence
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Modulo specifico per Ciclismo basato su:
 * - FTP Training Zones
 * - Sweet Spot Training
 * - VO2max Intervals
 * - Strength for Cyclists
 * - Injury Prevention
 * 
 * METODOLOGIE EVIDENCE-BASED:
 * - Hunter Allen / Andrew Coggan (Training with Power)
 * - TrainerRoad methodology
 * - Polarized + Sweet Spot hybrid
 */

window.ATLASCycling = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧬 SCIENTIFIC FOUNDATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    science: {
        // Power Training Zones (based on FTP)
        powerZones: {
            zone1: { name: 'Active Recovery', ftpPercent: '< 55%', description: 'Very easy spinning' },
            zone2: { name: 'Endurance', ftpPercent: '56-75%', description: 'All day pace' },
            zone3: { name: 'Tempo', ftpPercent: '76-90%', description: 'Brisk group ride' },
            zone4: { name: 'Threshold', ftpPercent: '91-105%', description: 'Time trial effort' },
            zone5: { name: 'VO2max', ftpPercent: '106-120%', description: '3-8 min max efforts' },
            zone6: { name: 'Anaerobic', ftpPercent: '121-150%', description: '30s-2min efforts' },
            zone7: { name: 'Neuromuscular', ftpPercent: 'Max', description: 'Sprints < 30s' }
        },
        
        // Infortuni più comuni
        injuryRisk: {
            knee_patellofemoral: 0.30, // 30% - anterior knee pain
            lower_back: 0.25,          // 25% - posizione aerodinamica
            neck: 0.15,                // 15% - posizione testa
            saddle_issues: 0.12,       // 12% - numbness, sores
            wrist_hand: 0.08,          // 8% - nerve compression
            achilles: 0.05             // 5% - cleat position
        },
        
        // Qualità fisiche chiave
        keyPerformance: [
            'FTP (Functional Threshold Power)',
            'VO2max',
            'Anaerobic Capacity (W\')',
            'Fatigue Resistance',
            'Neuromuscular Power (sprint)',
            'Aerobic Efficiency',
            'Power to Weight Ratio'
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 💪 EXERCISE DATABASE
    // ═══════════════════════════════════════════════════════════════════════════
    
    exercises: {
        
        // WARMUP
        warmup: [
            { 
                name: 'Easy Spin', 
                sets: 1, reps: '10-15 min', 
                type: 'warmup',
                zone: 'Zone 1',
                notes: 'High cadence (90+), low power',
                cues: ['Spin easy', 'Loosen up', 'Gradual HR rise']
            },
            { 
                name: 'Cadence Build', 
                sets: 3, reps: '1 min each', 
                type: 'warmup',
                notes: '80 → 90 → 100+ RPM progressively',
                cues: ['Increase every minute', 'Stay smooth', 'No bouncing']
            },
            { 
                name: 'Openers', 
                sets: 3, reps: '30s', 
                type: 'warmup',
                zone: 'Zone 4-5',
                rest: '30s easy',
                notes: 'Short efforts to prime legs',
                cues: ['Build power', 'Seated or standing', 'Recover fully']
            }
        ],
        
        // CYCLING SESSIONS
        cyclingSessions: [
            { 
                name: 'Endurance Ride', 
                sets: 1, reps: '60-180 min', 
                type: 'endurance',
                zone: 'Zone 2',
                notes: 'Base building, fat oxidation',
                cues: ['Conversational', 'Steady power', 'Fuel well']
            },
            { 
                name: 'Sweet Spot', 
                sets: 2, reps: '20 min @ 88-94% FTP', 
                type: 'sweetspot',
                zone: 'Zone 3-4',
                rest: '5 min easy between',
                notes: 'Max aerobic gains with manageable fatigue',
                cues: ['Comfortably hard', 'Focus on power', 'Steady cadence']
            },
            { 
                name: 'FTP Intervals', 
                sets: 2, reps: '20 min @ FTP', 
                type: 'threshold',
                zone: 'Zone 4',
                rest: '10 min recovery',
                notes: 'Threshold development',
                cues: ['Right at threshold', 'Even pacing', 'Mental focus']
            },
            { 
                name: 'VO2max Intervals', 
                sets: 5, reps: '3-5 min @ 110-120% FTP', 
                type: 'vo2max',
                zone: 'Zone 5',
                rest: '3-4 min easy',
                notes: 'Max aerobic capacity',
                cues: ['Hard but sustainable', 'Breathe deeply', 'Recover well']
            },
            { 
                name: 'Over-Unders', 
                sets: 3, reps: '10 min (2 min over / 2 min under)', 
                type: 'threshold',
                zone: 'Zone 4',
                rest: '5 min easy',
                notes: 'Threshold tolerance, race simulation',
                cues: ['Over = 105% FTP', 'Under = 95% FTP', 'Don\'t fully recover']
            },
            { 
                name: 'Sprint Intervals', 
                sets: 6, reps: '15-20s max', 
                type: 'sprint',
                zone: 'Zone 7',
                rest: '3-4 min easy',
                notes: 'Neuromuscular power, sprint finish',
                cues: ['All out', 'Big gear or spin', 'Full recovery']
            },
            { 
                name: 'Tempo Ride', 
                sets: 1, reps: '45-60 min steady', 
                type: 'tempo',
                zone: 'Zone 3',
                notes: 'Sustained moderate effort',
                cues: ['Steady power', 'Focus', 'Build endurance']
            }
        ],
        
        // STRENGTH FOR CYCLISTS
        strengthLower: [
            { 
                name: 'Single Leg Press', 
                sets: 3, reps: '10 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Quad dominant for pedal stroke',
                cues: ['Full ROM', 'Drive through heel', 'Control eccentric']
            },
            { 
                name: 'Bulgarian Split Squat', 
                sets: 3, reps: '10 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Unilateral strength, hip flexor stretch',
                cues: ['Vertical torso', '90° knee', 'Push up']
            },
            { 
                name: 'Romanian Deadlift', 
                sets: 3, reps: '12', 
                type: 'strength',
                rest: '90s',
                notes: 'Posterior chain for power phase',
                cues: ['Hip hinge', 'Soft knees', 'Squeeze glutes']
            },
            { 
                name: 'Step-up', 
                sets: 3, reps: '10 per side', 
                type: 'strength',
                rest: '60s',
                notes: 'Simula pedal stroke',
                cues: ['Drive from working leg', 'No push off back foot', 'Full extension']
            },
            { 
                name: 'Leg Curl (Eccentric)', 
                sets: 3, reps: '10 (3s eccentric)', 
                type: 'strength',
                rest: '60s',
                notes: 'Hamstring for pull phase',
                cues: ['Quick concentric', 'Slow eccentric', 'Control']
            }
        ],
        
        // CORE FOR CYCLISTS
        coreCycling: [
            { 
                name: 'Plank', 
                sets: 3, reps: '60s', 
                type: 'core',
                rest: '30s',
                notes: 'Base stability per posizione',
                cues: ['Straight line', 'Engage core', 'Breathe']
            },
            { 
                name: 'Side Plank', 
                sets: 3, reps: '30s per side', 
                type: 'core',
                rest: '30s',
                notes: 'Lateral stability',
                cues: ['Hips stacked', 'No rotation', 'Breathe']
            },
            { 
                name: 'Dead Bug', 
                sets: 3, reps: '10 per side', 
                type: 'core',
                rest: '30s',
                notes: 'Pelvic stability in saddle',
                cues: ['Low back flat', 'Extend slow', 'Controlled']
            },
            { 
                name: 'Superman Hold', 
                sets: 3, reps: '30s', 
                type: 'core',
                rest: '30s',
                notes: 'Back extension endurance',
                cues: ['Arms and legs up', 'Look down', 'Squeeze glutes']
            },
            { 
                name: 'Russian Twist (Light)', 
                sets: 3, reps: '20 total', 
                type: 'core',
                rest: '30s',
                notes: 'Rotation for climbing/sprinting',
                cues: ['Feet up or down', 'Rotate from core', 'Control']
            }
        ],
        
        // PREVENTION
        prevention: [
            { 
                name: 'Hip Flexor Stretch', 
                sets: 2, reps: '60s per side', 
                type: 'prevention',
                notes: 'Counter cycling position',
                cues: ['Half kneel', 'Tuck pelvis', 'Feel stretch front hip']
            },
            { 
                name: 'Thoracic Extension', 
                sets: 2, reps: '10 reps', 
                type: 'prevention',
                notes: 'Counter aero position',
                cues: ['Foam roller at mid back', 'Extend over', 'Arms overhead']
            },
            { 
                name: 'Neck Stretch + Chin Tucks', 
                sets: 2, reps: '30s + 10 tucks', 
                type: 'prevention',
                notes: 'Posizione testa su bici',
                cues: ['Ear to shoulder', 'Tuck chin back', 'Hold']
            },
            { 
                name: 'ITB Foam Roll', 
                sets: 1, reps: '90s per side', 
                type: 'prevention',
                notes: 'Lateral knee pain prevention',
                cues: ['Roll outer thigh', 'Pause on tender spots', 'Breathe']
            },
            { 
                name: 'Glute Bridge', 
                sets: 3, reps: '15', 
                type: 'prevention',
                rest: '30s',
                notes: 'Glute activation, counter hip flexion',
                cues: ['Drive through heels', 'Squeeze glutes', 'No hyperextension']
            }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 WORKOUT TEMPLATES
    // ═══════════════════════════════════════════════════════════════════════════
    
    templates: {
        
        endurance: {
            name: 'Endurance Ride',
            duration: 90,
            type: 'endurance',
            structure: [
                { from: 'warmup', count: 2, phase: 'warmup' },
                { from: 'cyclingSessions', count: 1, phase: 'main', fixed: ['Endurance Ride'] },
                { from: 'prevention', count: 2, phase: 'finisher' }
            ]
        },
        
        sweetspot: {
            name: 'Sweet Spot Session',
            duration: 75,
            type: 'sweetspot',
            structure: [
                { from: 'warmup', count: 2, phase: 'warmup' },
                { from: 'cyclingSessions', count: 1, phase: 'main', fixed: ['Sweet Spot'] },
                { from: 'prevention', count: 2, phase: 'finisher' }
            ]
        },
        
        vo2max: {
            name: 'VO2max Intervals',
            duration: 65,
            type: 'vo2max',
            structure: [
                { from: 'warmup', count: 3, phase: 'warmup' },
                { from: 'cyclingSessions', count: 1, phase: 'main', fixed: ['VO2max Intervals'] },
                { from: 'prevention', count: 2, phase: 'finisher' }
            ]
        },
        
        strength: {
            name: 'Strength for Cyclists',
            duration: 50,
            type: 'strength',
            structure: [
                { from: 'warmup', count: 1, phase: 'warmup' },
                { from: 'strengthLower', count: 4, phase: 'main' },
                { from: 'coreCycling', count: 3, phase: 'main' },
                { from: 'prevention', count: 3, phase: 'finisher' }
            ]
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏗️ WORKOUT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    generateWorkout(profile, sessionType = 'endurance') {
        const template = this.templates[sessionType] || this.templates.endurance;
        
        console.log(`🚴 Generating Cycling Workout: ${template.name}`);
        
        const workout = {
            name: template.name,
            type: 'cycling',
            sessionType: sessionType,
            duration: template.duration,
            sport: 'cycling',
            exercises: [],
            metadata: {
                generatedAt: new Date().toISOString(),
                module: 'ATLASCycling v' + this.version,
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
        
        return workout;
    },
    
    getSplit(daysPerWeek) {
        const splits = {
            3: {
                name: 'Cycling 3-Day',
                sessions: [
                    { name: 'Sweet Spot', type: 'sweetspot', sessionType: 'sweetspot' },
                    { name: 'Endurance', type: 'endurance', sessionType: 'endurance' },
                    { name: 'Strength', type: 'strength', sessionType: 'strength' }
                ]
            },
            4: {
                name: 'Cycling 4-Day',
                sessions: [
                    { name: 'Sweet Spot', type: 'sweetspot', sessionType: 'sweetspot' },
                    { name: 'Endurance', type: 'endurance', sessionType: 'endurance' },
                    { name: 'VO2max', type: 'vo2max', sessionType: 'vo2max' },
                    { name: 'Strength', type: 'strength', sessionType: 'strength' }
                ]
            },
            5: {
                name: 'Cycling 5-Day',
                sessions: [
                    { name: 'Sweet Spot', type: 'sweetspot', sessionType: 'sweetspot' },
                    { name: 'Endurance', type: 'endurance', sessionType: 'endurance' },
                    { name: 'VO2max', type: 'vo2max', sessionType: 'vo2max' },
                    { name: 'Recovery Spin', type: 'endurance', sessionType: 'endurance' },
                    { name: 'Long Ride', type: 'endurance', sessionType: 'endurance' }
                ]
            }
        };
        
        return splits[daysPerWeek] || splits[4];
    },
    
    calculateZones(ftp) {
        return {
            zone1: { min: 0, max: Math.round(ftp * 0.55) },
            zone2: { min: Math.round(ftp * 0.56), max: Math.round(ftp * 0.75) },
            zone3: { min: Math.round(ftp * 0.76), max: Math.round(ftp * 0.90) },
            zone4: { min: Math.round(ftp * 0.91), max: Math.round(ftp * 1.05) },
            zone5: { min: Math.round(ftp * 1.06), max: Math.round(ftp * 1.20) },
            zone6: { min: Math.round(ftp * 1.21), max: Math.round(ftp * 1.50) },
            zone7: { min: Math.round(ftp * 1.50), max: 'Max' }
        };
    },
    
    getTip() {
        const tips = [
            'Il dolore alle ginocchia spesso deriva dalla posizione della sella. Controlla altezza e arretramento.',
            'Sweet spot training (88-94% FTP) massimizza i guadagni aerobici con fatica gestibile.',
            'Mobilità anche e thoracica sono cruciali per il comfort aerodinamico.',
            'La forza in palestra migliora la potenza e previene infortuni. Non saltarla.',
            'Spingi sui pedali, non appoggiarti sul manubrio. Core attivo sempre.',
            'Cadenza alta (90+) risparmia le gambe su lunghe distanze.'
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🚴 ATLAS Cycling Module v1.0 loaded!');
console.log('   → Power Zone Training');
console.log('   → Sweet Spot Methodology');
console.log('   → Strength for Cyclists');
console.log('   → ATLASCycling.generateWorkout(profile, type)');
