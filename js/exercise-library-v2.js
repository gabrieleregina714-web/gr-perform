/**
 * GR Perform - Exercise Library v2.0
 * Libreria esercizi strutturata con metadati completi
 * 
 * Ogni esercizio ha:
 * - id: identificatore unico
 * - name: nome completo
 * - pattern: pattern di movimento (hinge, squat, push, pull, carry, rotation)
 * - muscles: muscoli primari e secondari
 * - equipment: attrezzatura necessaria
 * - difficulty: beginner, intermediate, advanced
 * - cues: indicazioni tecniche
 * - progressions: esercizi più difficili
 * - regressions: esercizi più facili
 * - contraindications: controindicazioni
 * - sports: sport dove è utile
 * - methodologies: metodologie applicabili
 */

window.ExerciseLibraryV2 = (function() {
    'use strict';

    const VERSION = '2.0';

    // ═══════════════════════════════════════════════════════════════
    // PATTERN DI MOVIMENTO
    // ═══════════════════════════════════════════════════════════════
    const PATTERNS = {
        HINGE: 'hinge',
        SQUAT: 'squat',
        PUSH_HORIZONTAL: 'push_horizontal',
        PUSH_VERTICAL: 'push_vertical',
        PULL_HORIZONTAL: 'pull_horizontal',
        PULL_VERTICAL: 'pull_vertical',
        CARRY: 'carry',
        ROTATION: 'rotation',
        ANTI_ROTATION: 'anti_rotation',
        LOCOMOTION: 'locomotion',
        PLYOMETRIC: 'plyometric',
        ISOMETRIC: 'isometric'
    };

    // ═══════════════════════════════════════════════════════════════
    // GRUPPI MUSCOLARI
    // ═══════════════════════════════════════════════════════════════
    const MUSCLES = {
        // Lower body
        GLUTES: 'glutes',
        QUADS: 'quads',
        HAMSTRINGS: 'hamstrings',
        ADDUCTORS: 'adductors',
        CALVES: 'calves',
        HIP_FLEXORS: 'hip_flexors',
        
        // Core
        RECTUS_ABDOMINIS: 'rectus_abdominis',
        OBLIQUES: 'obliques',
        TRANSVERSE: 'transverse',
        ERECTORS: 'erectors',
        
        // Upper body
        CHEST: 'chest',
        LATS: 'lats',
        TRAPS: 'traps',
        RHOMBOIDS: 'rhomboids',
        REAR_DELTS: 'rear_delts',
        FRONT_DELTS: 'front_delts',
        SIDE_DELTS: 'side_delts',
        BICEPS: 'biceps',
        TRICEPS: 'triceps',
        FOREARMS: 'forearms',
        ROTATOR_CUFF: 'rotator_cuff',
        
        // Neck
        NECK: 'neck'
    };

    // ═══════════════════════════════════════════════════════════════
    // DATABASE ESERCIZI - LOWER BODY STRENGTH
    // ═══════════════════════════════════════════════════════════════
    const LOWER_STRENGTH = [
        {
            id: 'trap-bar-deadlift',
            name: 'Trap Bar Deadlift',
            pattern: PATTERNS.HINGE,
            muscles: {
                primary: [MUSCLES.GLUTES, MUSCLES.HAMSTRINGS],
                secondary: [MUSCLES.QUADS, MUSCLES.ERECTORS, MUSCLES.TRAPS]
            },
            equipment: ['trap-bar'],
            difficulty: 'intermediate',
            cues: [
                'Piedi alla larghezza delle anche',
                'Spingi il pavimento lontano',
                'Petto alto, schiena neutra',
                'Ginocchia in fuori nella discesa',
                'Blocca anche e ginocchia insieme in alto'
            ],
            progressions: ['Deficit Trap Bar DL', 'Conventional Deadlift', 'Sumo Deadlift'],
            regressions: ['Romanian Deadlift', 'KB Deadlift', 'Hip Hinge con banda'],
            contraindications: ['acute_low_back', 'disc_herniation'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['strength', 'power', 'cluster_set'],
            tempo: { eccentric: 3, pause: 0, concentric: 1, hold: 1 },
            repRanges: { strength: '3-5', hypertrophy: '6-10', endurance: '12-15' },
            restRanges: { strength: '180-240s', hypertrophy: '90-120s', endurance: '60s' }
        },
        {
            id: 'romanian-deadlift',
            name: 'Romanian Deadlift',
            pattern: PATTERNS.HINGE,
            muscles: {
                primary: [MUSCLES.HAMSTRINGS, MUSCLES.GLUTES],
                secondary: [MUSCLES.ERECTORS, MUSCLES.LATS]
            },
            equipment: ['barbell', 'dumbbells'],
            difficulty: 'intermediate',
            cues: [
                'Leggera flessione ginocchia (costante)',
                'Spingi il sedere indietro',
                'Bilanciere vicino alle gambe',
                'Senti l\'allungamento dei femorali',
                'Non arrotondare la schiena'
            ],
            progressions: ['Stiff Leg Deadlift', 'Deficit RDL'],
            regressions: ['Single Leg RDL con supporto', 'Good Morning'],
            contraindications: ['acute_hamstring', 'acute_low_back'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['hypertrophy', 'tempo_training', 'eccentric_focus'],
            tempo: { eccentric: 4, pause: 1, concentric: 2, hold: 0 },
            repRanges: { strength: '5-6', hypertrophy: '8-12', endurance: '15-20' },
            restRanges: { strength: '150s', hypertrophy: '90s', endurance: '60s' }
        },
        {
            id: 'front-squat',
            name: 'Front Squat',
            pattern: PATTERNS.SQUAT,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.GLUTES],
                secondary: [MUSCLES.ERECTORS, MUSCLES.RECTUS_ABDOMINIS]
            },
            equipment: ['barbell'],
            difficulty: 'advanced',
            cues: [
                'Gomiti alti, paralleli al pavimento',
                'Petto alto durante tutto il movimento',
                'Ginocchia in linea con le punte',
                'Scendi fino a quando la tecnica lo permette',
                'Spingi il terreno per risalire'
            ],
            progressions: ['Pause Front Squat', 'Front Squat + Push Press'],
            regressions: ['Goblet Squat', 'Front Squat con cinghie'],
            contraindications: ['wrist_pain', 'shoulder_mobility_poor', 'knee_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['strength', 'power', 'cluster_set', 'tempo_training'],
            tempo: { eccentric: 3, pause: 1, concentric: 1, hold: 0 },
            repRanges: { strength: '3-5', hypertrophy: '6-8', endurance: '10-12' },
            restRanges: { strength: '180-240s', hypertrophy: '120s', endurance: '90s' }
        },
        {
            id: 'goblet-squat',
            name: 'Goblet Squat',
            pattern: PATTERNS.SQUAT,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.GLUTES],
                secondary: [MUSCLES.ERECTORS, MUSCLES.BICEPS]
            },
            equipment: ['kettlebell', 'dumbbell'],
            difficulty: 'beginner',
            cues: [
                'KB/DB al petto, gomiti in basso',
                'Piedi leggermente extra-ruotati',
                'Scendi tra le ginocchia',
                'Mantieni petto alto',
                'Spingi le ginocchia in fuori'
            ],
            progressions: ['Front Squat', 'Double KB Front Squat'],
            regressions: ['Box Squat', 'Squat con TRX'],
            contraindications: ['knee_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['hypertrophy', 'warmup', 'tempo_training'],
            tempo: { eccentric: 3, pause: 1, concentric: 2, hold: 0 },
            repRanges: { strength: '6-8', hypertrophy: '10-15', endurance: '20+' },
            restRanges: { strength: '120s', hypertrophy: '60-90s', endurance: '45s' }
        },
        {
            id: 'bulgarian-split-squat',
            name: 'Bulgarian Split Squat',
            pattern: PATTERNS.SQUAT,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.GLUTES],
                secondary: [MUSCLES.HAMSTRINGS, MUSCLES.HIP_FLEXORS]
            },
            equipment: ['bench', 'dumbbells'],
            difficulty: 'intermediate',
            cues: [
                'Piede posteriore su panca (collo del piede)',
                'Torso leggermente inclinato avanti',
                'Ginocchio anteriore in linea con piede',
                'Scendi finché il ginocchio posteriore quasi tocca',
                'Spingi con il tallone anteriore'
            ],
            progressions: ['Deficit BSS', 'BSS con bilanciere'],
            regressions: ['Split Squat a terra', 'Step-up basso'],
            contraindications: ['knee_acute', 'hip_flexor_strain'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['hypertrophy', 'strength', 'tempo_training'],
            tempo: { eccentric: 3, pause: 1, concentric: 2, hold: 0 },
            repRanges: { strength: '5-6 per gamba', hypertrophy: '8-12 per gamba', endurance: '15+ per gamba' },
            restRanges: { strength: '120s', hypertrophy: '90s', endurance: '60s' }
        },
        {
            id: 'hip-thrust',
            name: 'Hip Thrust',
            pattern: PATTERNS.HINGE,
            muscles: {
                primary: [MUSCLES.GLUTES],
                secondary: [MUSCLES.HAMSTRINGS, MUSCLES.ERECTORS]
            },
            equipment: ['barbell', 'bench'],
            difficulty: 'intermediate',
            cues: [
                'Scapole sulla panca',
                'Piedi alla larghezza anche',
                'Mento al petto in alto (evita iperestensione lombare)',
                'Squeeze glutei in alto',
                'Controlla la discesa'
            ],
            progressions: ['Single Leg Hip Thrust', 'Hip Thrust con banda'],
            regressions: ['Glute Bridge', 'Glute Bridge con piedi elevati'],
            contraindications: ['low_back_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['hypertrophy', 'strength', 'myo_reps'],
            tempo: { eccentric: 2, pause: 1, concentric: 1, hold: 2 },
            repRanges: { strength: '5-8', hypertrophy: '10-15', endurance: '20+' },
            restRanges: { strength: '120s', hypertrophy: '60-90s', endurance: '45s' }
        }
    ];

    // ═══════════════════════════════════════════════════════════════
    // DATABASE ESERCIZI - UPPER BODY STRENGTH
    // ═══════════════════════════════════════════════════════════════
    const UPPER_STRENGTH = [
        {
            id: 'bench-press',
            name: 'Bench Press',
            pattern: PATTERNS.PUSH_HORIZONTAL,
            muscles: {
                primary: [MUSCLES.CHEST],
                secondary: [MUSCLES.TRICEPS, MUSCLES.FRONT_DELTS]
            },
            equipment: ['barbell', 'bench'],
            difficulty: 'intermediate',
            cues: [
                'Scapole retratte e depresse',
                'Arco lombare naturale',
                'Bilanciere sopra i capezzoli',
                'Gomiti ~45-75° dal corpo',
                'Spingi verso il rack'
            ],
            progressions: ['Pause Bench', 'Larsen Press', 'Floor Press'],
            regressions: ['Push-up', 'DB Bench Press'],
            contraindications: ['shoulder_acute', 'pec_strain'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['strength', 'power', 'cluster_set', '5_3_1'],
            tempo: { eccentric: 3, pause: 1, concentric: 1, hold: 0 },
            repRanges: { strength: '3-5', hypertrophy: '8-12', endurance: '15+' },
            restRanges: { strength: '180-240s', hypertrophy: '90-120s', endurance: '60s' }
        },
        {
            id: 'incline-db-press',
            name: 'Incline Dumbbell Press',
            pattern: PATTERNS.PUSH_HORIZONTAL,
            muscles: {
                primary: [MUSCLES.CHEST, MUSCLES.FRONT_DELTS],
                secondary: [MUSCLES.TRICEPS]
            },
            equipment: ['dumbbells', 'adjustable_bench'],
            difficulty: 'intermediate',
            cues: [
                'Panca 30-45°',
                'DB sopra le spalle in alto',
                'Gomiti ~45° dal corpo',
                'Scendi fino a sentire stretch nel petto',
                'Spingi convergendo leggermente'
            ],
            progressions: ['Incline BB Press', 'Incline DB Press + Fly'],
            regressions: ['Incline Push-up', 'Landmine Press'],
            contraindications: ['shoulder_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['hypertrophy', 'drop_set', 'myo_reps'],
            tempo: { eccentric: 3, pause: 0, concentric: 2, hold: 1 },
            repRanges: { strength: '6-8', hypertrophy: '10-15', endurance: '15-20' },
            restRanges: { strength: '120s', hypertrophy: '60-90s', endurance: '45s' }
        },
        {
            id: 'pull-ups',
            name: 'Pull-ups',
            pattern: PATTERNS.PULL_VERTICAL,
            muscles: {
                primary: [MUSCLES.LATS],
                secondary: [MUSCLES.BICEPS, MUSCLES.REAR_DELTS, MUSCLES.RHOMBOIDS]
            },
            equipment: ['pull_up_bar'],
            difficulty: 'intermediate',
            cues: [
                'Presa prona, larghezza spalle+',
                'Scapole depresse all\'inizio',
                'Tira i gomiti verso i fianchi',
                'Mento sopra la sbarra',
                'Controlla la discesa'
            ],
            progressions: ['Weighted Pull-ups', 'Archer Pull-ups', 'L-sit Pull-ups'],
            regressions: ['Lat Pulldown', 'Band Assisted Pull-ups', 'Negative Pull-ups'],
            contraindications: ['shoulder_impingement', 'elbow_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['strength', 'hypertrophy', 'rest_pause', 'cluster_set'],
            tempo: { eccentric: 3, pause: 0, concentric: 2, hold: 1 },
            repRanges: { strength: '3-6', hypertrophy: '8-12', endurance: 'AMRAP' },
            restRanges: { strength: '150s', hypertrophy: '90s', endurance: '60s' }
        },
        {
            id: 'lat-pulldown',
            name: 'Lat Pulldown',
            pattern: PATTERNS.PULL_VERTICAL,
            muscles: {
                primary: [MUSCLES.LATS],
                secondary: [MUSCLES.BICEPS, MUSCLES.REAR_DELTS]
            },
            equipment: ['cable_machine'],
            difficulty: 'beginner',
            cues: [
                'Petto alto verso la barra',
                'Tira i gomiti verso i fianchi',
                'Scapole depresse e retratte',
                'Barra al petto (non dietro la testa)',
                'Estendi completamente in alto'
            ],
            progressions: ['Pull-ups', 'Single Arm Lat Pulldown'],
            regressions: ['Band Lat Pulldown', 'Straight Arm Pushdown'],
            contraindications: [],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['hypertrophy', 'drop_set', 'myo_reps'],
            tempo: { eccentric: 3, pause: 1, concentric: 2, hold: 0 },
            repRanges: { strength: '6-8', hypertrophy: '10-15', endurance: '15-20' },
            restRanges: { strength: '120s', hypertrophy: '60-90s', endurance: '45s' }
        },
        {
            id: 'seated-row',
            name: 'Seated Row',
            pattern: PATTERNS.PULL_HORIZONTAL,
            muscles: {
                primary: [MUSCLES.LATS, MUSCLES.RHOMBOIDS],
                secondary: [MUSCLES.BICEPS, MUSCLES.REAR_DELTS, MUSCLES.TRAPS]
            },
            equipment: ['cable_machine'],
            difficulty: 'beginner',
            cues: [
                'Petto alto, schiena neutra',
                'Tira verso l\'ombelico',
                'Spremi le scapole insieme',
                'Gomiti vicini al corpo',
                'Estendi completamente avanti'
            ],
            progressions: ['1-Arm Cable Row', 'Chest Supported Row'],
            regressions: ['Band Row', 'TRX Row'],
            contraindications: ['low_back_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['hypertrophy', 'superset', 'tempo_training'],
            tempo: { eccentric: 3, pause: 1, concentric: 2, hold: 0 },
            repRanges: { strength: '6-8', hypertrophy: '10-15', endurance: '15-20' },
            restRanges: { strength: '120s', hypertrophy: '60-90s', endurance: '45s' }
        },
        {
            id: 'push-up',
            name: 'Push-Up',
            pattern: PATTERNS.PUSH_HORIZONTAL,
            muscles: {
                primary: [MUSCLES.CHEST, MUSCLES.TRICEPS],
                secondary: [MUSCLES.FRONT_DELTS, MUSCLES.RECTUS_ABDOMINIS]
            },
            equipment: [],
            difficulty: 'beginner',
            cues: [
                'Corpo in linea retta (plank)',
                'Mani sotto le spalle',
                'Gomiti ~45° dal corpo',
                'Petto quasi tocca il pavimento',
                'Spingi esplosivo'
            ],
            progressions: ['Weighted Push-up', 'Diamond Push-up', 'Archer Push-up', 'Plyo Push-up'],
            regressions: ['Incline Push-up', 'Knee Push-up', 'Wall Push-up'],
            contraindications: ['wrist_acute', 'shoulder_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['hypertrophy', 'conditioning', 'amrap', 'rest_pause'],
            tempo: { eccentric: 2, pause: 0, concentric: 1, hold: 0 },
            repRanges: { strength: 'Weighted 5-8', hypertrophy: '15-25', endurance: 'AMRAP' },
            restRanges: { strength: '90s', hypertrophy: '60s', endurance: '30s' }
        }
    ];

    // ═══════════════════════════════════════════════════════════════
    // DATABASE ESERCIZI - BOXE SPECIFICI
    // ═══════════════════════════════════════════════════════════════
    const BOXE_SPECIFIC = [
        {
            id: 'shadow-boxing',
            name: 'Shadow Boxing',
            pattern: PATTERNS.ROTATION,
            muscles: {
                primary: [MUSCLES.OBLIQUES, MUSCLES.FRONT_DELTS],
                secondary: [MUSCLES.QUADS, MUSCLES.CALVES, MUSCLES.TRICEPS]
            },
            equipment: [],
            difficulty: 'beginner',
            cues: [
                'Mantieni la guardia alta',
                'Ruota i fianchi ad ogni pugno',
                'Ritorna sempre in posizione',
                'Piedi mai fermi, footwork attivo',
                'Visualizza l\'avversario'
            ],
            progressions: ['Shadow Boxing con pesi', 'Mirror Drill con focus combos'],
            regressions: ['Shadow Boxing solo jab', 'Footwork drill'],
            contraindications: [],
            sports: ['boxe'],
            methodologies: ['conditioning', 'technical', 'intervals'],
            variations: [
                { name: 'Jab only', focus: 'Tecnica base', rounds: 2 },
                { name: 'Jab-Cross', focus: 'Combinazione base', rounds: 2 },
                { name: 'Hook-Cross', focus: 'Potenza rotazionale', rounds: 2 },
                { name: 'Footwork & Defense', focus: 'Movimento e schivate', rounds: 2 },
                { name: 'Free style combos', focus: 'Creatività', rounds: 2 }
            ],
            roundStructure: { work: '2 min', rest: '30s', rounds: '6-10' }
        },
        {
            id: 'heavy-bag-intervals',
            name: 'Heavy Bag Intervals',
            pattern: PATTERNS.ROTATION,
            muscles: {
                primary: [MUSCLES.OBLIQUES, MUSCLES.FRONT_DELTS, MUSCLES.TRICEPS],
                secondary: [MUSCLES.CHEST, MUSCLES.LATS, MUSCLES.QUADS]
            },
            equipment: ['heavy_bag'],
            difficulty: 'intermediate',
            cues: [
                'Colpisci attraverso il sacco, non sopra',
                'Ruota tutto il corpo nel pugno',
                'Mantieni la guardia anche stanco',
                'Respira con ogni colpo',
                'Piedi attivi, non piatti'
            ],
            progressions: ['Power rounds (3 min)', 'Combo specifiche'],
            regressions: ['Jab only intervals', 'Light touch technique'],
            contraindications: ['wrist_acute', 'shoulder_acute'],
            sports: ['boxe'],
            methodologies: ['conditioning', 'power', 'intervals'],
            variations: [
                { name: '25s max output + 35s jab leggero', focus: 'Power endurance', difficulty: 'intermediate' },
                { name: '30s all-out + 30s rest', focus: 'Anaerobic', difficulty: 'advanced' },
                { name: '10s burst + 20s active + 30s rest', focus: 'Alactic power', difficulty: 'advanced' }
            ],
            roundStructure: { work: '3 min', rest: '1 min', rounds: '6-10' }
        },
        {
            id: 'boxing-circuit',
            name: 'Boxing Circuit',
            pattern: PATTERNS.LOCOMOTION,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.OBLIQUES, MUSCLES.FRONT_DELTS],
                secondary: [MUSCLES.CALVES, MUSCLES.RECTUS_ABDOMINIS, MUSCLES.TRICEPS]
            },
            equipment: ['heavy_bag', 'jump_rope', 'speed_bag'],
            difficulty: 'intermediate',
            cues: [
                'Transizioni rapide tra stazioni',
                'Mantieni intensità costante',
                'Recupera attivamente',
                'Focus sulla tecnica anche stanco'
            ],
            progressions: ['Circuit più lungo', 'Meno rest'],
            regressions: ['Meno stazioni', 'Più rest'],
            contraindications: ['cardiovascular_issues'],
            sports: ['boxe'],
            methodologies: ['conditioning', 'circuit', 'hiit'],
            stationTemplates: [
                'Heavy Bag jab-cross-hook power',
                'Shadow Boxing defense + slips',
                'Jump Rope intervals',
                'Speed Bag',
                'Burpees',
                'Mountain Climbers',
                'Med Ball Slams'
            ],
            roundStructure: { work: '3 min', rest: '1 min', rounds: '6' }
        },
        {
            id: 'neck-strengthening',
            name: 'Neck Strengthening',
            pattern: PATTERNS.ISOMETRIC,
            muscles: {
                primary: [MUSCLES.NECK],
                secondary: [MUSCLES.TRAPS]
            },
            equipment: [],
            difficulty: 'beginner',
            cues: [
                'SEMPRE posizioni sicure, mai carico assiale',
                'Isometriche: spingi contro resistenza, no movimento',
                '4 direzioni: front, back, left, right',
                'Mai oltre il 50% dello sforzo massimo',
                'Respira normalmente durante'
            ],
            progressions: ['Neck Curl/Extension (con cautela)', 'Band resistance'],
            regressions: ['Solo mobilità', 'Meno tempo'],
            contraindications: ['neck_acute', 'cervical_disc', 'headaches'],
            sports: ['boxe'],
            methodologies: ['prehab', 'isometric'],
            safeProtocol: {
                sets: 2,
                holdTime: '20s each direction',
                intensity: '40-50% max',
                frequency: '2-3x/week'
            }
        },
        {
            id: 'footwork-ladder',
            name: 'Footwork Ladder Drills',
            pattern: PATTERNS.LOCOMOTION,
            muscles: {
                primary: [MUSCLES.CALVES, MUSCLES.QUADS],
                secondary: [MUSCLES.HIP_FLEXORS, MUSCLES.RECTUS_ABDOMINIS]
            },
            equipment: ['agility_ladder'],
            difficulty: 'beginner',
            cues: [
                'Rimani sulle punte',
                'Contatto rapido e leggero',
                'Braccia coordinate con le gambe',
                'Sguardo avanti, non ai piedi',
                'Qualità > Velocità all\'inizio'
            ],
            progressions: ['Ladder + Shadow Boxing combo', 'Reaction drills'],
            regressions: ['Solo andata', 'Velocità ridotta'],
            contraindications: ['ankle_acute'],
            sports: ['boxe', 'calcio', 'basket'],
            methodologies: ['warmup', 'agility', 'conditioning'],
            drillVariations: [
                'In-Out (2 piedi dentro, 2 fuori)',
                'Lateral shuffle',
                'Ali Shuffle',
                'Icky Shuffle',
                'Carioca'
            ]
        },
        {
            id: 'med-ball-rotational-throw',
            name: 'Med Ball Rotational Throw',
            pattern: PATTERNS.ROTATION,
            muscles: {
                primary: [MUSCLES.OBLIQUES, MUSCLES.TRANSVERSE],
                secondary: [MUSCLES.GLUTES, MUSCLES.FRONT_DELTS, MUSCLES.LATS]
            },
            equipment: ['medicine_ball', 'wall'],
            difficulty: 'intermediate',
            cues: [
                'Piedi più larghi delle spalle',
                'Ruota dai fianchi, non dalle spalle',
                'Braccio esterno guida, interno segue',
                'Rilascia quando le mani sono davanti',
                'Decelera controllato dopo il rilascio'
            ],
            progressions: ['Palla più pesante', 'Step-behind throw'],
            regressions: ['Pallof Press', 'Cable woodchop'],
            contraindications: ['low_back_acute', 'shoulder_acute'],
            sports: ['boxe', 'calcio', 'basket'],
            methodologies: ['power', 'plyometric', 'conditioning'],
            repRanges: { power: '5-8 per lato', conditioning: '10-15 per lato' },
            restRanges: { power: '60-90s', conditioning: '30s' }
        }
    ];

    // ═══════════════════════════════════════════════════════════════
    // DATABASE ESERCIZI - ACCESSORY/PREHAB
    // ═══════════════════════════════════════════════════════════════
    const ACCESSORY = [
        {
            id: 'pallof-press',
            name: 'Pallof Press',
            pattern: PATTERNS.ANTI_ROTATION,
            muscles: {
                primary: [MUSCLES.OBLIQUES, MUSCLES.TRANSVERSE],
                secondary: [MUSCLES.RECTUS_ABDOMINIS, MUSCLES.GLUTES]
            },
            equipment: ['cable_machine', 'band'],
            difficulty: 'beginner',
            cues: [
                'Piedi alla larghezza spalle',
                'Cable/band a livello petto',
                'Premi le mani avanti, resisti alla rotazione',
                'Tieni per 2-3 secondi',
                'Non lasciare che il core ruoti'
            ],
            progressions: ['Pallof Press con step', 'Tall Kneeling Pallof'],
            regressions: ['Dead Bug', 'Plank laterale'],
            contraindications: [],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['prehab', 'core', 'warmup'],
            repRanges: { prehab: '10-12 per lato', strength: '8-10 per lato' },
            restRanges: { prehab: '30s', strength: '60s' }
        },
        {
            id: 'dead-bug',
            name: 'Dead Bug',
            pattern: PATTERNS.ANTI_ROTATION,
            muscles: {
                primary: [MUSCLES.RECTUS_ABDOMINIS, MUSCLES.TRANSVERSE],
                secondary: [MUSCLES.HIP_FLEXORS, MUSCLES.OBLIQUES]
            },
            equipment: [],
            difficulty: 'beginner',
            cues: [
                'Schiena piatta sul pavimento',
                'Braccia verticali, ginocchia a 90°',
                'Estendi braccio opposto e gamba insieme',
                'Mantieni la schiena piatta (no arco)',
                'Respira in modo controllato'
            ],
            progressions: ['Dead Bug con peso', 'Dead Bug con banda'],
            regressions: ['Solo gambe', 'Solo braccia'],
            contraindications: ['low_back_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['prehab', 'core', 'warmup'],
            repRanges: { prehab: '10-15 per lato' },
            restRanges: { prehab: '30s' }
        },
        {
            id: 'face-pull',
            name: 'Face Pull',
            pattern: PATTERNS.PULL_HORIZONTAL,
            muscles: {
                primary: [MUSCLES.REAR_DELTS, MUSCLES.RHOMBOIDS],
                secondary: [MUSCLES.ROTATOR_CUFF, MUSCLES.TRAPS]
            },
            equipment: ['cable_machine', 'band'],
            difficulty: 'beginner',
            cues: [
                'Cavo alto, corda o maniglie',
                'Tira verso il viso',
                'Apri i gomiti in fuori',
                'Spremi le scapole',
                'Ruota gli avambracci in alto a fine movimento'
            ],
            progressions: ['Face Pull con external rotation', 'Band Pull-apart'],
            regressions: ['Prone Y-T-W', 'Band pull-apart leggero'],
            contraindications: ['shoulder_impingement'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['prehab', 'hypertrophy', 'superset'],
            repRanges: { prehab: '15-20', hypertrophy: '12-15' },
            restRanges: { prehab: '30s', hypertrophy: '60s' }
        },
        {
            id: 'external-rotation-cable',
            name: 'External Rotation (Cable/Band)',
            pattern: PATTERNS.ROTATION,
            muscles: {
                primary: [MUSCLES.ROTATOR_CUFF],
                secondary: [MUSCLES.REAR_DELTS]
            },
            equipment: ['cable_machine', 'band'],
            difficulty: 'beginner',
            cues: [
                'Gomito a 90°, fisso al fianco',
                'Ruota solo l\'avambraccio verso l\'esterno',
                'Movimento lento e controllato',
                'Non usare il corpo per aiutare',
                'Tieni 2s a fine movimento'
            ],
            progressions: ['Side-lying external rotation con peso'],
            regressions: ['No resistance, solo movimento'],
            contraindications: ['rotator_cuff_tear'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['prehab', 'warmup'],
            repRanges: { prehab: '15-20' },
            restRanges: { prehab: '30s' }
        },
        {
            id: 'band-pull-apart',
            name: 'Band Pull-Apart',
            pattern: PATTERNS.PULL_HORIZONTAL,
            muscles: {
                primary: [MUSCLES.REAR_DELTS, MUSCLES.RHOMBOIDS],
                secondary: [MUSCLES.TRAPS, MUSCLES.ROTATOR_CUFF]
            },
            equipment: ['band'],
            difficulty: 'beginner',
            cues: [
                'Braccia dritte davanti a te',
                'Tira la banda verso il petto',
                'Spremi le scapole insieme',
                'Controlla il ritorno',
                'Non piegare i gomiti'
            ],
            progressions: ['Band Pull-Apart con pausa', 'Facepull'],
            regressions: ['Banda più leggera'],
            contraindications: [],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['prehab', 'warmup', 'superset'],
            repRanges: { prehab: '15-25', superset: '15-20' },
            restRanges: { prehab: '30s', superset: '0s' }
        },
        {
            id: 'prone-ytw',
            name: 'Prone Y-T-W',
            pattern: PATTERNS.PULL_HORIZONTAL,
            muscles: {
                primary: [MUSCLES.REAR_DELTS, MUSCLES.TRAPS],
                secondary: [MUSCLES.RHOMBOIDS, MUSCLES.ROTATOR_CUFF]
            },
            equipment: [],
            difficulty: 'beginner',
            cues: [
                'Pancia sul pavimento o panca',
                'Y: braccia a 45° sopra la testa',
                'T: braccia laterali',
                'W: gomiti piegati, squeeze scapole',
                '3-5 rep per ogni posizione'
            ],
            progressions: ['Y-T-W con manubri leggeri'],
            regressions: ['Solo una lettera alla volta'],
            contraindications: ['shoulder_impingement'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['prehab', 'warmup'],
            repRanges: { prehab: '5 per posizione' },
            restRanges: { prehab: '30s' }
        },
        {
            id: 'rear-delt-raise',
            name: 'Rear Delt Raise',
            pattern: PATTERNS.PULL_HORIZONTAL,
            muscles: {
                primary: [MUSCLES.REAR_DELTS],
                secondary: [MUSCLES.RHOMBOIDS, MUSCLES.TRAPS]
            },
            equipment: ['dumbbells', 'cable_machine'],
            difficulty: 'beginner',
            cues: [
                'Inclinati a 45-60°',
                'Braccia pendono verso il basso',
                'Solleva lateralmente, gomiti leggermente piegati',
                'Spremi le scapole in alto',
                'Controlla la discesa'
            ],
            progressions: ['Cable Rear Delt Fly', 'Machine Reverse Fly'],
            regressions: ['Peso più leggero'],
            contraindications: [],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['hypertrophy', 'superset'],
            repRanges: { hypertrophy: '12-15' },
            restRanges: { hypertrophy: '60s' }
        },
        {
            id: 'scapular-pushup',
            name: 'Scapular Push-Up',
            pattern: PATTERNS.PUSH_HORIZONTAL,
            muscles: {
                primary: [MUSCLES.SERRATUS],
                secondary: [MUSCLES.TRAPS, MUSCLES.RHOMBOIDS]
            },
            equipment: [],
            difficulty: 'beginner',
            cues: [
                'Posizione push-up alta',
                'Braccia dritte, non piegare i gomiti',
                'Lascia che le scapole si avvicinino',
                'Poi spingi attivamente separandole',
                'Movimento solo delle scapole'
            ],
            progressions: ['Push-Up Plus', 'Serratus Wall Slide'],
            regressions: ['Scapular Push-Up sulle ginocchia'],
            contraindications: ['wrist_injury'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['prehab', 'warmup'],
            repRanges: { prehab: '12-15' },
            restRanges: { prehab: '30s' }
        },
        {
            id: 'cuban-rotation',
            name: 'Cuban Rotation',
            pattern: PATTERNS.ROTATION,
            muscles: {
                primary: [MUSCLES.ROTATOR_CUFF, MUSCLES.REAR_DELTS],
                secondary: [MUSCLES.TRAPS]
            },
            equipment: ['dumbbells', 'band'],
            difficulty: 'intermediate',
            cues: [
                'Gomiti a 90°, braccia laterali',
                'Ruota gli avambracci verso l\'alto',
                'Poi pressa sopra la testa',
                'Inverti il movimento',
                'Peso leggero, movimento controllato'
            ],
            progressions: ['Peso maggiore', 'Tempo più lento'],
            regressions: ['Solo rotazione senza press'],
            contraindications: ['rotator_cuff_tear', 'shoulder_impingement'],
            sports: ['boxe', 'basket', 'palestra'],
            methodologies: ['prehab', 'warmup'],
            repRanges: { prehab: '10-12' },
            restRanges: { prehab: '45s' }
        }
    ];

    // ═══════════════════════════════════════════════════════════════
    // DATABASE ESERCIZI - CALCIO SPECIFICI
    // ═══════════════════════════════════════════════════════════════
    const CALCIO_SPECIFIC = [
        {
            id: 'nordic-curl',
            name: 'Nordic Hamstring Curl',
            pattern: PATTERNS.HINGE,
            muscles: {
                primary: [MUSCLES.HAMSTRINGS],
                secondary: [MUSCLES.GLUTES, MUSCLES.CALVES]
            },
            equipment: ['nordic_bench', 'partner'],
            difficulty: 'advanced',
            cues: [
                'Ginocchia fisse, corpo dritto',
                'Scendi lentamente (5+ sec)',
                'Resisti il più a lungo possibile',
                'Usa le mani per tornare su se necessario',
                'Non piegare i fianchi'
            ],
            progressions: ['Negative only → Assisted → Full'],
            regressions: ['Slider Leg Curl', 'Swiss Ball Leg Curl'],
            contraindications: ['hamstring_acute', 'knee_acute'],
            sports: ['calcio', 'basket'],
            methodologies: ['eccentric_focus', 'injury_prevention', 'strength'],
            researchNote: 'Riduce infortuni ai femorali del 51% (Petersen et al.)',
            protocol: { eccentric: '5-8s', sets: '3-4', reps: '4-6', frequency: '2x/week' }
        },
        {
            id: 'copenhagen-adductor',
            name: 'Copenhagen Adductor',
            pattern: PATTERNS.ISOMETRIC,
            muscles: {
                primary: [MUSCLES.ADDUCTORS],
                secondary: [MUSCLES.OBLIQUES, MUSCLES.GLUTES]
            },
            equipment: ['bench'],
            difficulty: 'advanced',
            cues: [
                'Gamba superiore sulla panca',
                'Solleva il corpo in plank laterale',
                'Attiva l\'interno coscia della gamba superiore',
                'Mantieni fianchi allineati',
                'Non lasciar cadere i fianchi'
            ],
            progressions: ['Copenhagen dinamico', 'Copenhagen + movimento gamba inferiore'],
            regressions: ['Isometrico sdraiato', 'Squat stance largo'],
            contraindications: ['groin_strain', 'adductor_acute'],
            sports: ['calcio', 'basket'],
            methodologies: ['injury_prevention', 'prehab', 'isometric'],
            researchNote: 'Riduce infortuni inguine del 41% (Harøy et al.)'
        },
        {
            id: 'single-leg-squat-to-box',
            name: 'Single Leg Squat to Box',
            pattern: PATTERNS.SQUAT,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.GLUTES],
                secondary: [MUSCLES.HAMSTRINGS, MUSCLES.ADDUCTORS]
            },
            equipment: ['box'],
            difficulty: 'intermediate',
            cues: [
                'Gamba libera avanti',
                'Siediti controllato sulla box',
                'Ginocchio in linea con il piede',
                'Non usare slancio per alzarti',
                'Tallone fisso a terra'
            ],
            progressions: ['Box più basso', 'Pistol Squat'],
            regressions: ['Box più alto', 'TRX assisted'],
            contraindications: ['knee_acute'],
            sports: ['calcio', 'basket', 'boxe'],
            methodologies: ['strength', 'balance', 'injury_prevention']
        },
        {
            id: 'calf-raises-eccentric',
            name: 'Eccentric Calf Raises',
            pattern: PATTERNS.ISOMETRIC,
            muscles: {
                primary: [MUSCLES.CALVES],
                secondary: []
            },
            equipment: ['step', 'dumbbells'],
            difficulty: 'beginner',
            cues: [
                'Sali su due piedi',
                'Scendi lentamente su un piede (3-5 sec)',
                'Tallone sotto il livello del gradino',
                'Controlla tutto il movimento',
                'Knee straight per gastrocnemio, bent per soleo'
            ],
            progressions: ['Single leg concentric + eccentric', 'Weighted'],
            regressions: ['Double leg eccentric'],
            contraindications: ['achilles_acute'],
            sports: ['calcio', 'basket', 'boxe', 'palestra'],
            methodologies: ['eccentric_focus', 'prehab', 'hypertrophy']
        },
        {
            id: 'agility-cone-drills',
            name: 'Agility Cone Drills',
            pattern: PATTERNS.LOCOMOTION,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.CALVES],
                secondary: [MUSCLES.GLUTES, MUSCLES.HAMSTRINGS]
            },
            equipment: ['cones'],
            difficulty: 'beginner',
            cues: [
                'Rimani basso nei cambi di direzione',
                'Pianta il piede esterno per tagliare',
                'Braccia attive per equilibrio',
                'Occhi sempre avanti',
                'Decelera prima di accelerare'
            ],
            progressions: ['React to signal', 'Ball at feet'],
            regressions: ['Slower pace', 'Fewer cones'],
            contraindications: ['ankle_acute', 'knee_acute'],
            sports: ['calcio', 'basket'],
            methodologies: ['agility', 'conditioning', 'sport_specific'],
            drillVariations: [
                'T-drill', '5-10-5 Pro Agility', 'L-drill', 'Box drill', 'Illinois Agility'
            ]
        },
        {
            id: 'sled-push',
            name: 'Sled Push',
            pattern: PATTERNS.LOCOMOTION,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.GLUTES],
                secondary: [MUSCLES.CALVES, MUSCLES.ERECTORS, MUSCLES.FRONT_DELTS]
            },
            equipment: ['sled'],
            difficulty: 'intermediate',
            cues: [
                'Inclinazione corpo 45°',
                'Braccia tese, spinta dalle gambe',
                'Passi corti e rapidi (sprint) o lunghi (forza)',
                'Guida con le anche',
                'Non alzare la testa'
            ],
            progressions: ['Heavier load', 'Sprint pace'],
            regressions: ['Lighter load', 'Walk pace'],
            contraindications: ['low_back_acute'],
            sports: ['calcio', 'basket', 'boxe', 'palestra'],
            methodologies: ['conditioning', 'power', 'gpp'],
            protocols: {
                strength: { load: 'Heavy', distance: '20-30m', rest: '2-3 min' },
                power: { load: 'Moderate', distance: '10-20m', rest: '90s' },
                conditioning: { load: 'Light-Mod', distance: '40-60m', rest: '60s' }
            }
        }
    ];

    // ═══════════════════════════════════════════════════════════════
    // DATABASE ESERCIZI - BASKET SPECIFICI
    // ═══════════════════════════════════════════════════════════════
    const BASKET_SPECIFIC = [
        {
            id: 'vertical-jump-training',
            name: 'Vertical Jump Protocol',
            pattern: PATTERNS.PLYOMETRIC,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.GLUTES, MUSCLES.CALVES],
                secondary: [MUSCLES.HAMSTRINGS, MUSCLES.ERECTORS]
            },
            equipment: [],
            difficulty: 'intermediate',
            cues: [
                'Contromovimento rapido (1/4 squat)',
                'Braccia swing aggressive',
                'Tripla estensione esplosiva',
                'Atterra morbido (ginocchia flesse)',
                'Reset completo tra i salti'
            ],
            progressions: ['Depth Jump', 'Single Leg Jump'],
            regressions: ['Squat Jump no countermovement', 'Box Jump (lower)'],
            contraindications: ['knee_acute', 'ankle_acute', 'achilles_tendinopathy'],
            sports: ['basket', 'calcio'],
            methodologies: ['plyometric', 'power'],
            protocols: {
                maxPower: { reps: '3-5', sets: '4-6', rest: '2-3 min' },
                repeatAbility: { reps: '8-10', sets: '3-4', rest: '60-90s' }
            }
        },
        {
            id: 'box-jump',
            name: 'Box Jump',
            pattern: PATTERNS.PLYOMETRIC,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.GLUTES],
                secondary: [MUSCLES.HAMSTRINGS, MUSCLES.CALVES]
            },
            equipment: ['plyo_box'],
            difficulty: 'intermediate',
            cues: [
                'Piedi larghezza anche',
                'Contromovimento veloce',
                'Salta IN ALTO, non in avanti',
                'Atterra morbido sulla box',
                'Scendi con controllo (no saltare giù)'
            ],
            progressions: ['Higher box', 'Single leg', 'Depth Jump'],
            regressions: ['Lower box', 'Step up + jump'],
            contraindications: ['knee_acute', 'ankle_acute'],
            sports: ['basket', 'calcio', 'boxe'],
            methodologies: ['plyometric', 'power', 'warmup']
        },
        {
            id: 'lateral-bound',
            name: 'Lateral Bound',
            pattern: PATTERNS.PLYOMETRIC,
            muscles: {
                primary: [MUSCLES.GLUTES, MUSCLES.QUADS],
                secondary: [MUSCLES.ADDUCTORS, MUSCLES.CALVES]
            },
            equipment: [],
            difficulty: 'intermediate',
            cues: [
                'Spingi lateralmente da una gamba',
                'Atterra sulla gamba opposta',
                'Stabilizza 2-3 sec',
                'Mantieni ginocchio allineato',
                'Usa le braccia per equilibrio'
            ],
            progressions: ['Continuous bounds', 'Bound + vertical jump'],
            regressions: ['Shorter distance', 'Hold landing longer'],
            contraindications: ['knee_acute', 'ankle_acute', 'groin_strain'],
            sports: ['basket', 'calcio'],
            methodologies: ['plyometric', 'agility', 'injury_prevention']
        },
        {
            id: 'defensive-slides',
            name: 'Defensive Slides',
            pattern: PATTERNS.LOCOMOTION,
            muscles: {
                primary: [MUSCLES.GLUTES, MUSCLES.QUADS],
                secondary: [MUSCLES.ADDUCTORS, MUSCLES.CALVES]
            },
            equipment: [],
            difficulty: 'beginner',
            cues: [
                'Posizione bassa, peso sui talloni',
                'Non incrociare mai i piedi',
                'Piedi larghi, ginocchia fuori',
                'Petto alto, mani attive',
                'Spingi con il piede opposto alla direzione'
            ],
            progressions: ['React to signal', 'With ball mirror'],
            regressions: ['Slower pace', 'Higher stance'],
            contraindications: ['knee_acute'],
            sports: ['basket'],
            methodologies: ['conditioning', 'sport_specific', 'agility']
        },
        {
            id: 'reactive-agility',
            name: 'Reactive Agility Drill',
            pattern: PATTERNS.LOCOMOTION,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.GLUTES],
                secondary: [MUSCLES.CALVES, MUSCLES.HAMSTRINGS]
            },
            equipment: ['cones'],
            difficulty: 'advanced',
            cues: [
                'Reagisci al segnale visivo/uditivo',
                'Primo passo esplosivo',
                'Decidi in movimento',
                'Mantieni centro di gravità basso',
                'Recovery rapido per la prossima reazione'
            ],
            progressions: ['More complex patterns', 'Shorter reaction time'],
            regressions: ['Pre-planned patterns', 'Longer reaction time'],
            contraindications: ['knee_acute', 'ankle_acute'],
            sports: ['basket', 'calcio'],
            methodologies: ['agility', 'sport_specific', 'cognitive']
        }
    ];

    // ═══════════════════════════════════════════════════════════════
    // DATABASE ESERCIZI - PALESTRA (BODYBUILDING/FITNESS)
    // ═══════════════════════════════════════════════════════════════
    const PALESTRA_SPECIFIC = [
        {
            id: 'back-squat',
            name: 'Back Squat',
            pattern: PATTERNS.SQUAT,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.GLUTES],
                secondary: [MUSCLES.HAMSTRINGS, MUSCLES.ERECTORS]
            },
            equipment: ['barbell', 'squat_rack'],
            difficulty: 'intermediate',
            cues: [
                'Bilanciere sulle trappole (high bar) o deltoidi posteriori (low bar)',
                'Scapole retratte, petto alto',
                'Scendi finché la mobilità lo permette',
                'Ginocchia in linea con le punte',
                'Spingi il terreno per risalire'
            ],
            progressions: ['Pause Squat', 'Tempo Squat', 'Front Squat'],
            regressions: ['Goblet Squat', 'Box Squat'],
            contraindications: ['low_back_acute', 'knee_acute'],
            sports: ['palestra', 'calcio', 'basket', 'boxe'],
            methodologies: ['strength', 'hypertrophy', '5_3_1', 'cluster_set']
        },
        {
            id: 'conventional-deadlift',
            name: 'Conventional Deadlift',
            pattern: PATTERNS.HINGE,
            muscles: {
                primary: [MUSCLES.GLUTES, MUSCLES.HAMSTRINGS, MUSCLES.ERECTORS],
                secondary: [MUSCLES.QUADS, MUSCLES.TRAPS, MUSCLES.LATS, MUSCLES.FOREARMS]
            },
            equipment: ['barbell'],
            difficulty: 'advanced',
            cues: [
                'Piedi larghezza anche, bilanciere sopra mid-foot',
                'Afferra la sbarra, scapole sopra il bilanciere',
                'Schiena neutra, petto alto',
                'Spingi il pavimento, tieni il bilanciere vicino',
                'Blocca anche e ginocchia insieme'
            ],
            progressions: ['Deficit Deadlift', 'Sumo Deadlift'],
            regressions: ['Trap Bar Deadlift', 'RDL'],
            contraindications: ['low_back_acute', 'disc_herniation'],
            sports: ['palestra', 'calcio', 'boxe'],
            methodologies: ['strength', 'power', '5_3_1']
        },
        {
            id: 'overhead-press',
            name: 'Overhead Press',
            pattern: PATTERNS.PUSH_VERTICAL,
            muscles: {
                primary: [MUSCLES.FRONT_DELTS, MUSCLES.SIDE_DELTS],
                secondary: [MUSCLES.TRICEPS, MUSCLES.TRAPS, MUSCLES.RECTUS_ABDOMINIS]
            },
            equipment: ['barbell'],
            difficulty: 'intermediate',
            cues: [
                'Piedi larghezza anche',
                'Bilanciere appoggiato sulle clavicole',
                'Spingi dritto verso l\'alto',
                'Testa indietro per far passare il bilanciere',
                'Blocca con le braccia accanto alle orecchie'
            ],
            progressions: ['Push Press', 'Strict Press deficit'],
            regressions: ['Seated Press', 'DB Press'],
            contraindications: ['shoulder_impingement', 'low_back_acute'],
            sports: ['palestra', 'boxe'],
            methodologies: ['strength', 'hypertrophy', '5_3_1']
        },
        {
            id: 'barbell-row',
            name: 'Barbell Row',
            pattern: PATTERNS.PULL_HORIZONTAL,
            muscles: {
                primary: [MUSCLES.LATS, MUSCLES.RHOMBOIDS],
                secondary: [MUSCLES.BICEPS, MUSCLES.REAR_DELTS, MUSCLES.ERECTORS]
            },
            equipment: ['barbell'],
            difficulty: 'intermediate',
            cues: [
                'Inclinazione torso 45-60°',
                'Schiena neutra, core attivo',
                'Tira verso l\'ombelico',
                'Spremi le scapole in cima',
                'Controlla la discesa'
            ],
            progressions: ['Pendlay Row', 'Meadows Row'],
            regressions: ['Chest Supported Row', 'Cable Row'],
            contraindications: ['low_back_acute'],
            sports: ['palestra', 'calcio', 'basket', 'boxe'],
            methodologies: ['hypertrophy', 'strength']
        },
        {
            id: 'dumbbell-lateral-raise',
            name: 'Dumbbell Lateral Raise',
            pattern: PATTERNS.PUSH_HORIZONTAL,
            muscles: {
                primary: [MUSCLES.SIDE_DELTS],
                secondary: [MUSCLES.TRAPS, MUSCLES.FRONT_DELTS]
            },
            equipment: ['dumbbells'],
            difficulty: 'beginner',
            cues: [
                'Leggera flessione gomiti',
                'Alza i gomiti, non le mani',
                'Ferma a livello spalle',
                'Controllo nella discesa',
                'Evita slancio con il corpo'
            ],
            progressions: ['Cable Lateral Raise', 'Leaning Lateral Raise'],
            regressions: ['Band Lateral Raise', 'Lighter weight'],
            contraindications: ['shoulder_impingement'],
            sports: ['palestra', 'boxe'],
            methodologies: ['hypertrophy', 'drop_set', 'myo_reps']
        },
        {
            id: 'leg-press',
            name: 'Leg Press',
            pattern: PATTERNS.SQUAT,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.GLUTES],
                secondary: [MUSCLES.HAMSTRINGS]
            },
            equipment: ['leg_press_machine'],
            difficulty: 'beginner',
            cues: [
                'Piedi alla larghezza spalle sulla piattaforma',
                'Scendi finché le ginocchia sono a 90°',
                'Non bloccare le ginocchia in alto',
                'Schiena sempre a contatto con lo schienale',
                'Spingi con tutta la pianta del piede'
            ],
            progressions: ['Single leg', 'Feet higher (più glutes)', 'Feet lower (più quads)'],
            regressions: ['Range ridotto', 'Meno peso'],
            contraindications: ['low_back_acute', 'knee_acute'],
            sports: ['palestra'],
            methodologies: ['hypertrophy', 'drop_set', 'rest_pause']
        },
        {
            id: 'leg-curl',
            name: 'Lying Leg Curl',
            pattern: PATTERNS.HINGE,
            muscles: {
                primary: [MUSCLES.HAMSTRINGS],
                secondary: [MUSCLES.CALVES]
            },
            equipment: ['leg_curl_machine'],
            difficulty: 'beginner',
            cues: [
                'Ginocchia allineate con il perno della macchina',
                'Curl completo verso i glutei',
                'Pausa in contrazione',
                'Discesa lenta e controllata',
                'Non sollevare i fianchi dalla panca'
            ],
            progressions: ['Single leg', 'Nordic Curl'],
            regressions: ['Seated Leg Curl', 'Swiss Ball Curl'],
            contraindications: ['hamstring_acute'],
            sports: ['palestra', 'calcio', 'basket'],
            methodologies: ['hypertrophy', 'drop_set', 'myo_reps']
        },
        {
            id: 'cable-crossover',
            name: 'Cable Crossover',
            pattern: PATTERNS.PUSH_HORIZONTAL,
            muscles: {
                primary: [MUSCLES.CHEST],
                secondary: [MUSCLES.FRONT_DELTS]
            },
            equipment: ['cable_machine'],
            difficulty: 'intermediate',
            cues: [
                'Un passo avanti dalle pulegge',
                'Leggera flessione dei gomiti (fissa)',
                'Porta le mani insieme davanti al petto',
                'Spremi il petto in contrazione',
                'Controlla il ritorno'
            ],
            progressions: ['Low to high', 'Single arm'],
            regressions: ['Pec Deck', 'DB Fly'],
            contraindications: ['shoulder_acute', 'pec_strain'],
            sports: ['palestra'],
            methodologies: ['hypertrophy', 'drop_set', 'superset']
        }
    ];

    // ═══════════════════════════════════════════════════════════════
    // DATABASE ESERCIZI - PLYOMETRICS & POWER
    // ═══════════════════════════════════════════════════════════════
    const PLYOMETRICS = [
        {
            id: 'depth-jump',
            name: 'Depth Jump',
            pattern: PATTERNS.PLYOMETRIC,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.GLUTES, MUSCLES.CALVES],
                secondary: [MUSCLES.HAMSTRINGS]
            },
            equipment: ['plyo_box'],
            difficulty: 'advanced',
            cues: [
                'Cadi dalla box (non saltare giù)',
                'Contatto col terreno brevissimo',
                'Ribalza immediatamente verso l\'alto',
                'Atterra morbido',
                'Qualità > quantità'
            ],
            progressions: ['Higher box', 'Depth Jump to target'],
            regressions: ['Box Jump', 'Countermovement Jump'],
            contraindications: ['knee_acute', 'ankle_acute', 'achilles_tendinopathy'],
            sports: ['basket', 'calcio', 'boxe'],
            methodologies: ['plyometric', 'power'],
            advancedNote: 'Solo atleti con 1.5x BW squat minimo'
        },
        {
            id: 'broad-jump',
            name: 'Broad Jump (Standing Long Jump)',
            pattern: PATTERNS.PLYOMETRIC,
            muscles: {
                primary: [MUSCLES.GLUTES, MUSCLES.QUADS],
                secondary: [MUSCLES.HAMSTRINGS, MUSCLES.CALVES]
            },
            equipment: [],
            difficulty: 'intermediate',
            cues: [
                'Piedi larghezza anche',
                'Contromovimento con braccia indietro',
                'Salta in avanti e in alto',
                'Porta le ginocchia al petto in volo',
                'Atterra morbido, ginocchia flesse'
            ],
            progressions: ['Continuous Broad Jumps', 'Single Leg Bound'],
            regressions: ['Shorter distance target', 'Jump to mark'],
            contraindications: ['knee_acute', 'ankle_acute'],
            sports: ['calcio', 'basket', 'boxe'],
            methodologies: ['plyometric', 'power', 'testing']
        },
        {
            id: 'power-clean',
            name: 'Power Clean',
            pattern: PATTERNS.HINGE,
            muscles: {
                primary: [MUSCLES.GLUTES, MUSCLES.HAMSTRINGS, MUSCLES.TRAPS],
                secondary: [MUSCLES.QUADS, MUSCLES.ERECTORS, MUSCLES.FOREARMS, MUSCLES.FRONT_DELTS]
            },
            equipment: ['barbell'],
            difficulty: 'advanced',
            cues: [
                'Setup come deadlift, spalle sopra la sbarra',
                'Prima pull: solleva fino alle ginocchia',
                'Seconda pull: estensione esplosiva delle anche',
                'Tira sotto la sbarra, gomiti in avanti',
                'Ricevi in front squat parziale'
            ],
            progressions: ['Full Clean', 'Hang Clean'],
            regressions: ['Hang Power Clean', 'High Pull', 'Jump Shrug'],
            contraindications: ['wrist_acute', 'low_back_acute', 'shoulder_acute'],
            sports: ['calcio', 'basket', 'boxe', 'palestra'],
            methodologies: ['power', 'strength', 'olympic_lifting']
        },
        {
            id: 'kettlebell-swing',
            name: 'Kettlebell Swing',
            pattern: PATTERNS.HINGE,
            muscles: {
                primary: [MUSCLES.GLUTES, MUSCLES.HAMSTRINGS],
                secondary: [MUSCLES.ERECTORS, MUSCLES.LATS, MUSCLES.FOREARMS]
            },
            equipment: ['kettlebell'],
            difficulty: 'intermediate',
            cues: [
                'Piedi leggermente più larghi delle spalle',
                'Hike il KB indietro tra le gambe',
                'Snap delle anche per proiettare il KB',
                'Braccia sono solo cavi',
                'Plank in piedi in alto'
            ],
            progressions: ['Single Arm Swing', 'American Swing', 'KB Snatch'],
            regressions: ['KB Deadlift', 'Hip Hinge drill'],
            contraindications: ['low_back_acute'],
            sports: ['calcio', 'basket', 'boxe', 'palestra'],
            methodologies: ['power', 'conditioning', 'gpp', 'intervals']
        },
        {
            id: 'jump-squat',
            name: 'Jump Squat',
            pattern: PATTERNS.PLYOMETRIC,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.GLUTES],
                secondary: [MUSCLES.CALVES, MUSCLES.HAMSTRINGS]
            },
            equipment: [],
            difficulty: 'intermediate',
            cues: [
                'Squat a 1/4-1/2 profondità',
                'Esplodi verso l\'alto',
                'Braccia sopra la testa in volo',
                'Atterra morbido',
                'Reset o continuo a seconda del protocollo'
            ],
            progressions: ['Weighted Jump Squat', 'Continuous Jump Squats'],
            regressions: ['Pause + Jump', 'Lower jump'],
            contraindications: ['knee_acute', 'ankle_acute'],
            sports: ['calcio', 'basket', 'boxe', 'palestra'],
            methodologies: ['plyometric', 'power', 'conditioning']
        }
    ];

    // ═══════════════════════════════════════════════════════════════
    // DATABASE ESERCIZI - CONDITIONING
    // ═══════════════════════════════════════════════════════════════
    const CONDITIONING = [
        {
            id: 'battle-ropes',
            name: 'Battle Ropes',
            pattern: PATTERNS.PUSH_VERTICAL,
            muscles: {
                primary: [MUSCLES.FRONT_DELTS, MUSCLES.FOREARMS],
                secondary: [MUSCLES.RECTUS_ABDOMINIS, MUSCLES.QUADS, MUSCLES.LATS]
            },
            equipment: ['battle_ropes'],
            difficulty: 'beginner',
            cues: [
                'Posizione atletica, ginocchia flesse',
                'Onde continue o alternate',
                'Core attivo per stabilità',
                'Respira ritmicamente',
                'Variazioni: waves, slams, circles'
            ],
            progressions: ['Longer intervals', 'Jump + waves'],
            regressions: ['Shorter intervals', 'Seated'],
            contraindications: ['shoulder_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['conditioning', 'hiit', 'intervals'],
            protocols: {
                intervals: { work: '20-30s', rest: '30-40s', rounds: '8-12' },
                tabata: { work: '20s', rest: '10s', rounds: '8' }
            }
        },
        {
            id: 'rowing-machine',
            name: 'Rowing Machine Intervals',
            pattern: PATTERNS.PULL_HORIZONTAL,
            muscles: {
                primary: [MUSCLES.LATS, MUSCLES.QUADS, MUSCLES.GLUTES],
                secondary: [MUSCLES.HAMSTRINGS, MUSCLES.BICEPS, MUSCLES.ERECTORS]
            },
            equipment: ['rowing_machine'],
            difficulty: 'beginner',
            cues: [
                'Sequenza: gambe → schiena → braccia',
                'Drive con le gambe prima',
                'Schiena neutra',
                'Tira verso l\'ombelico',
                'Recupero: braccia → schiena → gambe'
            ],
            progressions: ['Higher intensity', 'Longer intervals'],
            regressions: ['Lower intensity', 'Shorter intervals'],
            contraindications: ['low_back_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['conditioning', 'intervals', 'liss'],
            protocols: {
                intervals: { work: '500m', rest: '1:30', rounds: '5-8' },
                steadyState: { duration: '20-30 min', intensity: '60-70% HR max' }
            }
        },
        {
            id: 'assault-bike',
            name: 'Assault Bike Intervals',
            pattern: PATTERNS.LOCOMOTION,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.FRONT_DELTS],
                secondary: [MUSCLES.GLUTES, MUSCLES.HAMSTRINGS, MUSCLES.BICEPS, MUSCLES.TRICEPS]
            },
            equipment: ['assault_bike'],
            difficulty: 'intermediate',
            cues: [
                'Full body engagement',
                'Push and pull con le braccia',
                'Mantieni RPM costanti',
                'Respira profondamente',
                'Pacing intelligente'
            ],
            progressions: ['Longer all-out efforts', 'Shorter rest'],
            regressions: ['Lower intensity', 'Longer rest'],
            contraindications: ['cardiovascular_issues'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['conditioning', 'hiit', 'intervals'],
            protocols: {
                maxAerobic: { work: '60s', rest: '60s', rounds: '10' },
                anaerobic: { work: '20s', rest: '40s', rounds: '8' },
                echo: { work: '15 cal', rest: 'until HR <130', rounds: '5-8' }
            }
        },
        {
            id: 'burpees',
            name: 'Burpees',
            pattern: PATTERNS.LOCOMOTION,
            muscles: {
                primary: [MUSCLES.QUADS, MUSCLES.CHEST, MUSCLES.FRONT_DELTS],
                secondary: [MUSCLES.GLUTES, MUSCLES.TRICEPS, MUSCLES.RECTUS_ABDOMINIS]
            },
            equipment: [],
            difficulty: 'intermediate',
            cues: [
                'Squat giù, mani a terra',
                'Salta indietro in plank',
                'Push-up (opzionale)',
                'Salta i piedi verso le mani',
                'Salta in alto con le braccia'
            ],
            progressions: ['Burpee + Box Jump', 'Weighted Vest'],
            regressions: ['No jump', 'Step back instead of jump'],
            contraindications: ['wrist_acute', 'low_back_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['conditioning', 'hiit', 'circuit']
        },
        {
            id: 'jump-rope',
            name: 'Jump Rope',
            pattern: PATTERNS.PLYOMETRIC,
            muscles: {
                primary: [MUSCLES.CALVES],
                secondary: [MUSCLES.QUADS, MUSCLES.FOREARMS, MUSCLES.FRONT_DELTS]
            },
            equipment: ['jump_rope'],
            difficulty: 'beginner',
            cues: [
                'Rimani sulle punte',
                'Polsi fanno girare la corda, non le braccia',
                'Salti piccoli (just enough)',
                'Sguardo avanti',
                'Ritmo costante'
            ],
            progressions: ['Double Unders', 'Crossover', 'High Knees'],
            regressions: ['Slower pace', 'Single bounce'],
            contraindications: ['ankle_acute', 'achilles_tendinopathy'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['conditioning', 'warmup', 'intervals'],
            boxingProtocol: { work: '3 min', rest: '1 min', rounds: '6-10' }
        },
        {
            id: 'sprint-intervals',
            name: 'Sprint Intervals',
            pattern: PATTERNS.LOCOMOTION,
            muscles: {
                primary: [MUSCLES.GLUTES, MUSCLES.HAMSTRINGS, MUSCLES.QUADS],
                secondary: [MUSCLES.CALVES, MUSCLES.HIP_FLEXORS]
            },
            equipment: [],
            difficulty: 'intermediate',
            cues: [
                'Warmup completo prima',
                'Accelerazione progressiva',
                'Braccia potenti a 90°',
                'High knees, push del terreno',
                'Decelera gradualmente'
            ],
            progressions: ['Longer sprints', 'Hills', 'Shorter rest'],
            regressions: ['Shorter sprints', 'Longer rest', 'Tempo runs'],
            contraindications: ['hamstring_acute', 'groin_strain', 'cardiovascular_issues'],
            sports: ['calcio', 'basket', 'boxe'],
            methodologies: ['conditioning', 'intervals', 'power'],
            protocols: {
                short: { distance: '30-40m', rest: '60-90s', reps: '8-12' },
                long: { distance: '100-200m', rest: '2-3 min', reps: '4-6' },
                shuttle: { distance: '5-10-5', rest: '60s', reps: '10-12' }
            }
        }
    ];

    // ═══════════════════════════════════════════════════════════════
    // DATABASE ESERCIZI - WARMUP & MOBILITY
    // ═══════════════════════════════════════════════════════════════
    const WARMUP_MOBILITY = [
        {
            id: 'worlds-greatest-stretch',
            name: 'World\'s Greatest Stretch',
            pattern: PATTERNS.LOCOMOTION,
            muscles: {
                primary: [MUSCLES.HIP_FLEXORS, MUSCLES.HAMSTRINGS, MUSCLES.GLUTES],
                secondary: [MUSCLES.OBLIQUES, MUSCLES.QUADS, MUSCLES.ERECTORS]
            },
            equipment: [],
            difficulty: 'beginner',
            cues: [
                'Lunge profondo',
                'Gomito verso il tallone interno',
                'Ruota e apri verso il soffitto',
                'Raddrizza la gamba anteriore (hamstring stretch)',
                '3-5 reps per lato, fluido'
            ],
            progressions: ['Add thoracic rotation hold'],
            regressions: ['Knee down'],
            contraindications: ['groin_acute', 'low_back_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['warmup', 'mobility']
        },
        {
            id: '90-90-hip-stretch',
            name: '90/90 Hip Stretch',
            pattern: PATTERNS.ISOMETRIC,
            muscles: {
                primary: [MUSCLES.GLUTES, MUSCLES.HIP_FLEXORS],
                secondary: [MUSCLES.ADDUCTORS]
            },
            equipment: [],
            difficulty: 'beginner',
            cues: [
                'Entrambe le gambe a 90°',
                'Petto alto, spingi avanti',
                'Senti lo stretch nel gluteo anteriore',
                'Mantieni 30-60s per lato',
                'Respira profondamente'
            ],
            progressions: ['Active 90/90 transitions', 'Loaded 90/90'],
            regressions: ['Pigeon Stretch', 'Supine Figure 4'],
            contraindications: ['hip_acute', 'knee_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['warmup', 'mobility', 'cooldown']
        },
        {
            id: 'cat-cow',
            name: 'Cat-Cow',
            pattern: PATTERNS.LOCOMOTION,
            muscles: {
                primary: [MUSCLES.ERECTORS],
                secondary: [MUSCLES.RECTUS_ABDOMINIS, MUSCLES.TRANSVERSE]
            },
            equipment: [],
            difficulty: 'beginner',
            cues: [
                'Quadrupedia, mani sotto spalle',
                'Cat: arrotonda la schiena, mento al petto',
                'Cow: inarca, guarda in alto',
                'Movimento fluido, respira',
                '10-15 reps'
            ],
            progressions: ['Add thoracic rotation'],
            regressions: [],
            contraindications: ['wrist_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['warmup', 'mobility', 'cooldown']
        },
        {
            id: 'hip-circle',
            name: 'Hip Circles',
            pattern: PATTERNS.ROTATION,
            muscles: {
                primary: [MUSCLES.GLUTES, MUSCLES.HIP_FLEXORS],
                secondary: [MUSCLES.ADDUCTORS]
            },
            equipment: [],
            difficulty: 'beginner',
            cues: [
                'In quadrupedia o in piedi',
                'Cerchio ampio con l\'anca',
                'Controlla tutto il range',
                '10 per direzione per gamba',
                'Mantieni core stabile'
            ],
            progressions: ['Larger circles', 'Banded'],
            regressions: ['Smaller circles'],
            contraindications: ['hip_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['warmup', 'mobility']
        },
        {
            id: 'thoracic-rotation',
            name: 'Thoracic Rotation (Open Book)',
            pattern: PATTERNS.ROTATION,
            muscles: {
                primary: [MUSCLES.OBLIQUES],
                secondary: [MUSCLES.ERECTORS, MUSCLES.RHOMBOIDS]
            },
            equipment: [],
            difficulty: 'beginner',
            cues: [
                'Sdraiato sul fianco, ginocchia a 90°',
                'Ruota il braccio superiore verso l\'altro lato',
                'Segui con lo sguardo la mano',
                'Mantieni le ginocchia unite',
                'Respira all\'apertura'
            ],
            progressions: ['Quadruped T-rotation', 'Half Kneeling rotation'],
            regressions: [],
            contraindications: ['shoulder_acute'],
            sports: ['boxe', 'calcio', 'basket', 'palestra'],
            methodologies: ['warmup', 'mobility', 'cooldown']
        }
    ];

    // ═══════════════════════════════════════════════════════════════
    // FUNZIONI DI RICERCA E FILTRAGGIO
    // ═══════════════════════════════════════════════════════════════
    
    const ALL_EXERCISES = [
        ...LOWER_STRENGTH, 
        ...UPPER_STRENGTH, 
        ...BOXE_SPECIFIC, 
        ...ACCESSORY,
        ...CALCIO_SPECIFIC,
        ...BASKET_SPECIFIC,
        ...PALESTRA_SPECIFIC,
        ...PLYOMETRICS,
        ...CONDITIONING,
        ...WARMUP_MOBILITY
    ];

    function getById(id) {
        return ALL_EXERCISES.find(ex => ex.id === id) || null;
    }

    function getBySport(sport) {
        const s = String(sport || '').toLowerCase();
        return ALL_EXERCISES.filter(ex => ex.sports.includes(s));
    }

    function getByPattern(pattern) {
        return ALL_EXERCISES.filter(ex => ex.pattern === pattern);
    }

    function getByMuscle(muscle, type = 'primary') {
        return ALL_EXERCISES.filter(ex => {
            const muscles = type === 'primary' ? ex.muscles.primary : ex.muscles.secondary;
            return muscles.includes(muscle);
        });
    }

    function getByDifficulty(difficulty) {
        return ALL_EXERCISES.filter(ex => ex.difficulty === difficulty);
    }

    function getByEquipment(equipment) {
        return ALL_EXERCISES.filter(ex => ex.equipment.includes(equipment));
    }

    function getWithoutEquipment(excludeEquipment) {
        const excluded = Array.isArray(excludeEquipment) ? excludeEquipment : [excludeEquipment];
        return ALL_EXERCISES.filter(ex => {
            return !ex.equipment.some(eq => excluded.includes(eq));
        });
    }

    function getAlternatives(exerciseId) {
        const ex = getById(exerciseId);
        if (!ex) return [];
        
        // Trova esercizi con stesso pattern e muscoli primari simili
        return ALL_EXERCISES.filter(other => {
            if (other.id === exerciseId) return false;
            if (other.pattern !== ex.pattern) return false;
            
            // Almeno un muscolo primario in comune
            const commonMuscles = other.muscles.primary.filter(m => ex.muscles.primary.includes(m));
            return commonMuscles.length > 0;
        });
    }

    function getSafeFor(contraindications) {
        const issues = Array.isArray(contraindications) ? contraindications : [contraindications];
        return ALL_EXERCISES.filter(ex => {
            return !ex.contraindications.some(c => issues.includes(c));
        });
    }

    function getForMethodology(methodology) {
        return ALL_EXERCISES.filter(ex => ex.methodologies?.includes(methodology));
    }

    // ═══════════════════════════════════════════════════════════════
    // GENERAZIONE PROMPT PER AI
    // ═══════════════════════════════════════════════════════════════
    
    function generatePromptSection(sport, options = {}) {
        const exercises = getBySport(sport);
        const { maxExercises = 30, includeDetails = false } = options;
        
        const limited = exercises.slice(0, maxExercises);
        
        if (includeDetails) {
            return limited.map(ex => {
                return `• ${ex.name} [${ex.pattern}] - ${ex.muscles.primary.join(', ')} | Cues: ${ex.cues.slice(0, 2).join('; ')}`;
            }).join('\n');
        }
        
        return limited.map(ex => `• ${ex.name}`).join('\n');
    }

    // ═══════════════════════════════════════════════════════════════
    // EXPORT
    // ═══════════════════════════════════════════════════════════════

    console.log(`📚 ExerciseLibraryV2 v${VERSION} loaded - ${ALL_EXERCISES.length} exercises`);

    return {
        VERSION,
        PATTERNS,
        MUSCLES,
        
        // Database categories
        exercises: ALL_EXERCISES,
        lowerStrength: LOWER_STRENGTH,
        upperStrength: UPPER_STRENGTH,
        boxeSpecific: BOXE_SPECIFIC,
        accessory: ACCESSORY,
        calcioSpecific: CALCIO_SPECIFIC,
        basketSpecific: BASKET_SPECIFIC,
        palestraSpecific: PALESTRA_SPECIFIC,
        plyometrics: PLYOMETRICS,
        conditioning: CONDITIONING,
        warmupMobility: WARMUP_MOBILITY,
        
        // Query functions
        getById,
        getBySport,
        getByPattern,
        getByMuscle,
        getByDifficulty,
        getByEquipment,
        getWithoutEquipment,
        getAlternatives,
        getSafeFor,
        getForMethodology,
        
        // AI integration
        generatePromptSection
    };

})();
