// ═══════════════════════════════════════════════════════════════════════════
// GR PERFORM - AI STRESS TEST SUITE
// Sistema di test automatizzato per verificare qualità generazione AI
// ═══════════════════════════════════════════════════════════════════════════

const AIStressTest = {
    
    // ═══════════════════════════════════════════════════════════════════════
    // PROFILI ATLETA TEST - Ogni combinazione possibile
    // ═══════════════════════════════════════════════════════════════════════
    
    testProfiles: {
        
        // ─────────────────────────────────────────────────────────────────────
        // CALCIO - Tutti i ruoli
        // ─────────────────────────────────────────────────────────────────────
        calcio: [
            {
                id: 'calcio_portiere_principiante',
                name: 'Marco Portiere',
                sport: 'calcio',
                role: 'portiere',
                level: 'principiante',
                age: 16,
                weight: 70,
                height: 180,
                experience_years: 1,
                injuries: [],
                goals: ['reattività', 'esplosività', 'flessibilità'],
                weekly_schedule: { tuesday: 'gr_available', thursday: 'gr_available', sunday: 'match' },
                stress_level: 'moderate',
                sleep_hours: '7-8',
                difficulty: 'easy'
            },
            {
                id: 'calcio_portiere_avanzato_infortunato',
                name: 'Gianluigi Pro',
                sport: 'calcio',
                role: 'portiere',
                level: 'elite',
                age: 28,
                weight: 85,
                height: 192,
                experience_years: 12,
                injuries: ['spalla destra operata 6 mesi fa', 'lombalgia cronica'],
                goals: ['prevenzione infortuni', 'mantenimento reattività'],
                weekly_schedule: { monday: 'team_training', tuesday: 'gr_available', wednesday: 'team_training', friday: 'gr_available', saturday: 'match' },
                stress_level: 'high',
                sleep_hours: '6-7',
                difficulty: 'hard'
            },
            {
                id: 'calcio_difensore_centrale',
                name: 'Giorgio Centrale',
                sport: 'calcio',
                role: 'difensore_centrale',
                level: 'intermedio',
                age: 24,
                weight: 82,
                height: 186,
                experience_years: 6,
                injuries: ['distorsione caviglia sx 3 mesi fa'],
                goals: ['forza aerea', 'velocità', 'contrasti'],
                weekly_schedule: { tuesday: 'gr_available', thursday: 'gr_available', saturday: 'match' },
                stress_level: 'moderate',
                sleep_hours: '7-8',
                difficulty: 'medium'
            },
            {
                id: 'calcio_terzino_esplosivo',
                name: 'Alex Terzino',
                sport: 'calcio',
                role: 'terzino',
                level: 'avanzato',
                age: 22,
                weight: 72,
                height: 175,
                experience_years: 5,
                injuries: [],
                goals: ['resistenza up&down', 'sprint ripetuti', 'cross potenti'],
                weekly_schedule: { monday: 'team_training', tuesday: 'gr_available', wednesday: 'team_training', thursday: 'gr_available', saturday: 'match' },
                stress_level: 'low',
                sleep_hours: '8+',
                difficulty: 'medium'
            },
            {
                id: 'calcio_centrocampista_box_to_box',
                name: 'Nicolò Mediano',
                sport: 'calcio',
                role: 'centrocampista',
                level: 'intermedio',
                age: 26,
                weight: 75,
                height: 178,
                experience_years: 8,
                injuries: ['pubalgia passata'],
                goals: ['resistenza', 'recupero', 'forza funzionale'],
                weekly_schedule: { tuesday: 'gr_available', thursday: 'gr_available', sunday: 'match' },
                stress_level: 'high',
                sleep_hours: '6-7',
                difficulty: 'medium'
            },
            {
                id: 'calcio_ala_velocista',
                name: 'Kingsley Ala',
                sport: 'calcio',
                role: 'ala',
                level: 'elite',
                age: 24,
                weight: 68,
                height: 172,
                experience_years: 7,
                injuries: ['hamstring dx - stiramento recente 1 mese fa'],
                goals: ['velocità massima', 'prevenzione hamstring', 'agilità'],
                weekly_schedule: { monday: 'team_training', wednesday: 'team_training', thursday: 'gr_available', saturday: 'match' },
                stress_level: 'moderate',
                sleep_hours: '7-8',
                difficulty: 'hard' // Infortunio recente hamstring!
            },
            {
                id: 'calcio_attaccante_fisico',
                name: 'Romelu Punta',
                sport: 'calcio',
                role: 'attaccante',
                level: 'avanzato',
                age: 29,
                weight: 95,
                height: 191,
                experience_years: 12,
                injuries: ['ginocchio dx - LCA ricostruito 2 anni fa'],
                goals: ['esplosività', 'protezione palla', 'potenza tiro'],
                weekly_schedule: { tuesday: 'gr_available', friday: 'gr_available', sunday: 'match' },
                stress_level: 'moderate',
                sleep_hours: '7-8',
                difficulty: 'hard' // LCA passato
            },
            // EDGE CASE: Giovane con poco tempo
            {
                id: 'calcio_giovane_poco_tempo',
                name: 'Luca Junior',
                sport: 'calcio',
                role: 'centrocampista',
                level: 'principiante',
                age: 14,
                weight: 55,
                height: 165,
                experience_years: 0.5,
                injuries: [],
                goals: ['crescita muscolare', 'coordinazione'],
                weekly_schedule: { wednesday: 'gr_available' }, // Solo 1 giorno!
                session_duration: 45,
                stress_level: 'high', // Scuola
                sleep_hours: '6-7',
                difficulty: 'edge_case'
            }
        ],
        
        // ─────────────────────────────────────────────────────────────────────
        // BASKET - Tutti i ruoli
        // ─────────────────────────────────────────────────────────────────────
        basket: [
            {
                id: 'basket_playmaker',
                name: 'Steph Playmaker',
                sport: 'basket',
                role: 'playmaker',
                level: 'avanzato',
                age: 25,
                weight: 78,
                height: 188,
                experience_years: 10,
                injuries: ['caviglia dx instabile'],
                goals: ['agilità', 'primo passo esplosivo', 'resistenza'],
                weekly_schedule: { monday: 'team_training', tuesday: 'gr_available', wednesday: 'team_training', friday: 'gr_available', sunday: 'match' },
                stress_level: 'moderate',
                sleep_hours: '7-8',
                difficulty: 'medium'
            },
            {
                id: 'basket_guardia',
                name: 'Klay Guardia',
                sport: 'basket',
                role: 'guardia',
                level: 'elite',
                age: 30,
                weight: 95,
                height: 198,
                experience_years: 12,
                injuries: ['ACL sx 3 anni fa', 'achille dx operato 2 anni fa'],
                goals: ['salto verticale', 'stabilità ginocchio', 'tiro'],
                weekly_schedule: { tuesday: 'gr_available', thursday: 'gr_available', saturday: 'match' },
                stress_level: 'high',
                sleep_hours: '7-8',
                difficulty: 'extreme' // Due infortuni gravi passati!
            },
            {
                id: 'basket_ala_piccola',
                name: 'LeBron Ala',
                sport: 'basket',
                role: 'ala_piccola',
                level: 'elite',
                age: 32,
                weight: 113,
                height: 206,
                experience_years: 15,
                injuries: ['inguine cronico'],
                goals: ['longevità', 'potenza', 'prevenzione'],
                weekly_schedule: { monday: 'gr_available', wednesday: 'gr_available', friday: 'gr_available', sunday: 'match' },
                stress_level: 'high',
                sleep_hours: '8+',
                difficulty: 'hard'
            },
            {
                id: 'basket_ala_grande',
                name: 'Giannis Power',
                sport: 'basket',
                role: 'ala_grande',
                level: 'avanzato',
                age: 27,
                weight: 110,
                height: 211,
                experience_years: 8,
                injuries: [],
                goals: ['dominanza fisica', 'salto', 'resistenza'],
                weekly_schedule: { tuesday: 'gr_available', thursday: 'gr_available', saturday: 'match' },
                stress_level: 'moderate',
                sleep_hours: '8+',
                difficulty: 'medium'
            },
            {
                id: 'basket_centro',
                name: 'Nikola Centro',
                sport: 'basket',
                role: 'centro',
                level: 'elite',
                age: 28,
                weight: 129,
                height: 213,
                experience_years: 10,
                injuries: ['schiena - ernia L4-L5 gestita'],
                goals: ['core stability', 'footwork', 'resistenza'],
                weekly_schedule: { monday: 'gr_available', wednesday: 'gr_available', friday: 'match' },
                stress_level: 'moderate',
                sleep_hours: '7-8',
                difficulty: 'hard' // Ernia!
            },
            // EDGE CASE: Ragazza giovane principiante
            {
                id: 'basket_donna_principiante',
                name: 'Sofia Basket',
                sport: 'basket',
                role: 'guardia',
                level: 'principiante',
                age: 17,
                weight: 62,
                height: 175,
                gender: 'female',
                experience_years: 1,
                injuries: [],
                goals: ['salto', 'forza base', 'prevenzione ACL'],
                weekly_schedule: { tuesday: 'gr_available', thursday: 'gr_available', saturday: 'match' },
                stress_level: 'moderate',
                sleep_hours: '7-8',
                difficulty: 'edge_case' // ACL prevention per donne!
            }
        ],
        
        // ─────────────────────────────────────────────────────────────────────
        // BOXE - Tutti gli stili e categorie
        // ─────────────────────────────────────────────────────────────────────
        boxe: [
            {
                id: 'boxe_peso_piuma_tecnico',
                name: 'Vasyl Tecnico',
                sport: 'boxe',
                role: 'peso_piuma',
                style: 'outboxer',
                level: 'elite',
                age: 30,
                weight: 57,
                height: 168,
                experience_years: 15,
                injuries: ['mano sx - frattura metacarpo guarita'],
                goals: ['footwork', 'resistenza round', 'velocità mani'],
                weekly_schedule: { monday: 'gr_available', wednesday: 'gr_available', friday: 'gr_available', saturday: 'sparring' },
                upcoming_fight: '2025-02-15',
                stress_level: 'high',
                sleep_hours: '7-8',
                difficulty: 'medium'
            },
            {
                id: 'boxe_peso_welter_potenza',
                name: 'Canelo Welter',
                sport: 'boxe',
                role: 'peso_welter',
                style: 'pressure_fighter',
                level: 'elite',
                age: 32,
                weight: 70,
                height: 175,
                experience_years: 18,
                injuries: ['spalla dx - tendinite cronica'],
                goals: ['potenza pugni', 'resistenza corpo a corpo', 'taglio peso'],
                weekly_schedule: { tuesday: 'gr_available', thursday: 'gr_available', saturday: 'sparring' },
                upcoming_fight: '2025-03-01',
                stress_level: 'very_high',
                sleep_hours: '6-7',
                difficulty: 'hard'
            },
            {
                id: 'boxe_peso_medio_completo',
                name: 'GGG Medio',
                sport: 'boxe',
                role: 'peso_medio',
                style: 'boxer_puncher',
                level: 'avanzato',
                age: 35,
                weight: 75,
                height: 179,
                experience_years: 20,
                injuries: ['ginocchio dx - menisco operato', 'collo rigido'],
                goals: ['mantenimento potenza', 'prevenzione', 'resistenza'],
                weekly_schedule: { monday: 'gr_available', wednesday: 'gr_available', friday: 'sparring' },
                stress_level: 'moderate',
                sleep_hours: '8+',
                difficulty: 'hard' // Età + infortuni
            },
            {
                id: 'boxe_peso_massimo_giovane',
                name: 'Tyson Massimo',
                sport: 'boxe',
                role: 'peso_massimo',
                style: 'swarmer',
                level: 'intermedio',
                age: 22,
                weight: 108,
                height: 198,
                experience_years: 4,
                injuries: [],
                goals: ['potenza esplosiva', 'resistenza', 'velocità per categoria'],
                weekly_schedule: { tuesday: 'gr_available', thursday: 'gr_available', saturday: 'gr_available' },
                stress_level: 'low',
                sleep_hours: '8+',
                difficulty: 'medium'
            },
            // EDGE CASE: Boxe amatoriale donna
            {
                id: 'boxe_donna_amatoriale',
                name: 'Katie Boxer',
                sport: 'boxe',
                role: 'peso_leggero',
                style: 'outboxer',
                level: 'principiante',
                age: 28,
                weight: 58,
                height: 165,
                gender: 'female',
                experience_years: 1,
                injuries: [],
                goals: ['tecnica base', 'condizionamento', 'self-defense'],
                weekly_schedule: { tuesday: 'gr_available', thursday: 'gr_available' },
                stress_level: 'high', // Lavora full-time
                sleep_hours: '6-7',
                difficulty: 'edge_case'
            },
            // EDGE CASE: Fight camp (settimana pre-match)
            {
                id: 'boxe_fight_week',
                name: 'Fighter PreMatch',
                sport: 'boxe',
                role: 'peso_welter',
                style: 'boxer_puncher',
                level: 'avanzato',
                age: 27,
                weight: 69,
                height: 178,
                experience_years: 8,
                injuries: [],
                goals: ['attivazione', 'peso', 'freschezza'],
                weekly_schedule: { monday: 'gr_available', wednesday: 'gr_available', saturday: 'match' },
                upcoming_fight: '2025-01-04', // 1 settimana!
                fight_week: true,
                stress_level: 'very_high',
                sleep_hours: '7-8',
                difficulty: 'extreme' // Fight week!
            }
        ],
        
        // ─────────────────────────────────────────────────────────────────────
        // PALESTRA - Tutti gli obiettivi
        // ─────────────────────────────────────────────────────────────────────
        palestra: [
            {
                id: 'palestra_ipertrofia_principiante',
                name: 'Marco Beginner',
                sport: 'palestra',
                goal: 'ipertrofia',
                level: 'principiante',
                age: 20,
                weight: 65,
                height: 175,
                experience_years: 0.5,
                injuries: [],
                goals: ['massa muscolare', 'forza base', 'tecnica'],
                weekly_schedule: { monday: 'gr_available', wednesday: 'gr_available', friday: 'gr_available' },
                equipment: 'full_gym',
                stress_level: 'low',
                sleep_hours: '8+',
                difficulty: 'easy'
            },
            {
                id: 'palestra_forza_intermedio',
                name: 'Paolo Powerlifter',
                sport: 'palestra',
                goal: 'forza',
                level: 'intermedio',
                age: 28,
                weight: 90,
                height: 180,
                experience_years: 4,
                injuries: ['lombare - protrusione L5-S1'],
                maxes: { squat: 160, bench: 120, deadlift: 200 },
                goals: ['aumentare massimali', 'prevenzione schiena'],
                weekly_schedule: { monday: 'gr_available', tuesday: 'gr_available', thursday: 'gr_available', saturday: 'gr_available' },
                equipment: 'full_gym',
                stress_level: 'moderate',
                sleep_hours: '7-8',
                difficulty: 'medium'
            },
            {
                id: 'palestra_definizione_avanzato',
                name: 'Andrea Shredded',
                sport: 'palestra',
                goal: 'definizione',
                level: 'avanzato',
                age: 32,
                weight: 85,
                height: 178,
                experience_years: 10,
                injuries: ['spalla dx - impingement'],
                goals: ['mantenere massa', 'bruciare grasso', 'condizionamento'],
                weekly_schedule: { monday: 'gr_available', tuesday: 'gr_available', wednesday: 'gr_available', thursday: 'gr_available', friday: 'gr_available' },
                equipment: 'full_gym',
                stress_level: 'high',
                sleep_hours: '6-7',
                deficit_calories: true,
                difficulty: 'hard'
            },
            {
                id: 'palestra_ricomposizione_donna',
                name: 'Giulia Fit',
                sport: 'palestra',
                goal: 'ricomposizione',
                level: 'intermedio',
                age: 26,
                weight: 62,
                height: 168,
                gender: 'female',
                experience_years: 3,
                injuries: [],
                goals: ['tonificazione', 'glutei', 'core'],
                weekly_schedule: { tuesday: 'gr_available', thursday: 'gr_available', saturday: 'gr_available' },
                equipment: 'full_gym',
                stress_level: 'moderate',
                sleep_hours: '7-8',
                difficulty: 'medium'
            },
            // EDGE CASE: Home gym limitato
            {
                id: 'palestra_home_gym_limitato',
                name: 'Luca Home',
                sport: 'palestra',
                goal: 'forza',
                level: 'intermedio',
                age: 35,
                weight: 80,
                height: 182,
                experience_years: 5,
                injuries: [],
                goals: ['forza', 'ipertrofia'],
                weekly_schedule: { monday: 'gr_available', wednesday: 'gr_available', friday: 'gr_available' },
                equipment: 'home', // Solo manubri, bilanciere, panca!
                available_equipment: ['dumbbells', 'barbell', 'bench', 'pull_up_bar'],
                stress_level: 'high',
                sleep_hours: '6-7',
                difficulty: 'edge_case'
            },
            // EDGE CASE: Over 50 con problemi
            {
                id: 'palestra_over_50',
                name: 'Roberto Senior',
                sport: 'palestra',
                goal: 'salute',
                level: 'principiante',
                age: 55,
                weight: 88,
                height: 176,
                experience_years: 1,
                injuries: ['ginocchio artrosico', 'ipertensione', 'spalla frozen'],
                goals: ['mobilità', 'forza funzionale', 'perdita peso'],
                weekly_schedule: { tuesday: 'gr_available', thursday: 'gr_available' },
                equipment: 'basic_gym',
                stress_level: 'moderate',
                sleep_hours: '6-7',
                difficulty: 'extreme' // Età + multi problemi
            },
            // EDGE CASE: Solo corpo libero
            {
                id: 'palestra_calisthenics',
                name: 'Davide Calisthenics',
                sport: 'palestra',
                goal: 'calisthenics',
                level: 'avanzato',
                age: 24,
                weight: 72,
                height: 178,
                experience_years: 5,
                injuries: ['polso sx - dolore cronico'],
                goals: ['muscle up', 'front lever', 'planche'],
                weekly_schedule: { monday: 'gr_available', wednesday: 'gr_available', friday: 'gr_available', sunday: 'gr_available' },
                equipment: 'outdoor', // Solo barre!
                stress_level: 'low',
                sleep_hours: '8+',
                difficulty: 'edge_case'
            }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // CRITERI DI VALUTAZIONE
    // ═══════════════════════════════════════════════════════════════════════
    
    evaluationCriteria: {
        // Criteri base (tutti gli sport)
        base: [
            { id: 'has_warmup', name: 'Include warm-up', weight: 10, check: (w) => w.exercises?.some(e => e.name?.toLowerCase().includes('warm') || e.type === 'warmup') },
            { id: 'has_cooldown', name: 'Include cool-down', weight: 5, check: (w) => w.exercises?.some(e => e.name?.toLowerCase().includes('cool') || e.name?.toLowerCase().includes('stretch')) },
            { id: 'exercise_count', name: 'Numero esercizi corretto (5-10)', weight: 10, check: (w) => w.exercises?.length >= 5 && w.exercises?.length <= 10 },
            { id: 'has_sets_reps', name: 'Tutti esercizi hanno sets/reps', weight: 15, check: (w) => w.exercises?.every(e => e.sets && e.reps) },
            { id: 'no_duplicates', name: 'Nessun esercizio duplicato', weight: 10, check: (w) => new Set(w.exercises?.map(e => e.name)).size === w.exercises?.length },
            { id: 'logical_order', name: 'Ordine logico (compound prima)', weight: 10, check: (w) => AIStressTest.checkExerciseOrder(w) },
        ],
        
        // Criteri infortuni
        injury: [
            { id: 'respects_injuries', name: 'Rispetta infortuni', weight: 25, check: (w, p) => AIStressTest.checkInjuryRespect(w, p) },
            { id: 'has_prehab', name: 'Include prehab se necessario', weight: 10, check: (w, p) => AIStressTest.checkPrehabInclusion(w, p) },
        ],
        
        // Criteri sport-specifici
        calcio: [
            { id: 'has_nordic', name: 'Include Nordic/prevenzione hamstring', weight: 15, check: (w) => w.exercises?.some(e => e.name?.toLowerCase().includes('nordic') || e.name?.toLowerCase().includes('hamstring')) },
            { id: 'has_plyometrics', name: 'Include pliometria appropriata', weight: 10, check: (w) => w.exercises?.some(e => e.name?.toLowerCase().includes('jump') || e.name?.toLowerCase().includes('plyo')) },
            { id: 'unilateral_work', name: 'Include lavoro monopodalico', weight: 10, check: (w) => w.exercises?.some(e => e.name?.toLowerCase().includes('single') || e.name?.toLowerCase().includes('split')) },
        ],
        
        basket: [
            { id: 'vertical_focus', name: 'Focus salto verticale', weight: 15, check: (w) => w.exercises?.some(e => e.name?.toLowerCase().includes('jump') || e.name?.toLowerCase().includes('box')) },
            { id: 'ankle_work', name: 'Include lavoro caviglie', weight: 10, check: (w) => w.exercises?.some(e => e.name?.toLowerCase().includes('ankle') || e.name?.toLowerCase().includes('calf')) },
            { id: 'lateral_movement', name: 'Include movimento laterale', weight: 10, check: (w) => w.exercises?.some(e => e.name?.toLowerCase().includes('lateral') || e.name?.toLowerCase().includes('shuffle')) },
        ],
        
        boxe: [
            { id: 'has_neck', name: 'Include neck training', weight: 10, check: (w) => w.exercises?.some(e => e.name?.toLowerCase().includes('neck')) },
            { id: 'has_core_rotation', name: 'Include core rotazionale', weight: 10, check: (w) => w.exercises?.some(e => e.name?.toLowerCase().includes('rotation') || e.name?.toLowerCase().includes('russian twist') || e.name?.toLowerCase().includes('woodchop')) },
            { id: 'conditioning_appropriate', name: 'Conditioning boxe appropriato', weight: 15, check: (w) => w.exercises?.some(e => e.name?.toLowerCase().includes('bag') || e.name?.toLowerCase().includes('shadow') || e.name?.toLowerCase().includes('round')) },
            { id: 'power_exercises', name: 'Include esercizi potenza', weight: 10, check: (w) => w.exercises?.some(e => e.name?.toLowerCase().includes('power') || e.name?.toLowerCase().includes('explosive') || e.name?.toLowerCase().includes('med ball')) },
        ],
        
        palestra: [
            { id: 'compound_first', name: 'Compound prima di isolamento', weight: 15, check: (w) => AIStressTest.checkCompoundOrder(w) },
            { id: 'balanced_push_pull', name: 'Bilanciamento push/pull', weight: 10, check: (w) => AIStressTest.checkPushPullBalance(w) },
            { id: 'appropriate_volume', name: 'Volume appropriato', weight: 10, check: (w) => AIStressTest.checkVolumeAppropriate(w) },
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // HELPER FUNCTIONS PER VALUTAZIONE
    // ═══════════════════════════════════════════════════════════════════════
    
    checkExerciseOrder(workout) {
        if (!workout.exercises || workout.exercises.length < 3) return true;
        
        const compounds = ['squat', 'deadlift', 'bench', 'row', 'press', 'pull-up', 'pullup'];
        const isolation = ['curl', 'extension', 'raise', 'fly', 'flye'];
        
        let lastCompoundIndex = -1;
        let firstIsolationIndex = workout.exercises.length;
        
        workout.exercises.forEach((ex, i) => {
            const name = ex.name?.toLowerCase() || '';
            if (compounds.some(c => name.includes(c))) lastCompoundIndex = i;
            if (isolation.some(iso => name.includes(iso)) && i < firstIsolationIndex) firstIsolationIndex = i;
        });
        
        return lastCompoundIndex < firstIsolationIndex || firstIsolationIndex === workout.exercises.length;
    },
    
    checkInjuryRespect(workout, profile) {
        if (!profile.injuries || profile.injuries.length === 0) return true;
        
        const injuries = profile.injuries.join(' ').toLowerCase();
        const dangerous = [];
        
        // Mappa infortuni -> esercizi da evitare
        const avoidMap = {
            'spalla': ['overhead press', 'military press', 'upright row', 'behind neck'],
            'schiena': ['deadlift', 'good morning', 'back extension'],
            'lombare': ['deadlift', 'good morning', 'back squat'],
            'ginocchio': ['leg extension', 'deep squat', 'jump', 'plyometric'],
            'lca': ['leg extension', 'deep squat', 'cutting'],
            'hamstring': ['sprint', 'nordic', 'deadlift'],
            'caviglia': ['jump', 'run', 'plyometric'],
            'polso': ['wrist curl', 'front squat', 'clean'],
            'collo': ['neck', 'shrug pesante'],
            'ernia': ['deadlift', 'squat pesante', 'overhead']
        };
        
        for (const [injury, exercises] of Object.entries(avoidMap)) {
            if (injuries.includes(injury)) {
                workout.exercises?.forEach(ex => {
                    const name = ex.name?.toLowerCase() || '';
                    if (exercises.some(avoid => name.includes(avoid))) {
                        dangerous.push({ injury, exercise: ex.name });
                    }
                });
            }
        }
        
        return dangerous.length === 0;
    },
    
    checkPrehabInclusion(workout, profile) {
        if (!profile.injuries || profile.injuries.length === 0) return true;
        
        const injuries = profile.injuries.join(' ').toLowerCase();
        const hasNeed = injuries.includes('spalla') || injuries.includes('ginocchio') || injuries.includes('caviglia') || injuries.includes('schiena');
        
        if (!hasNeed) return true;
        
        const prehabKeywords = ['prehab', 'mobility', 'activation', 'stability', 'band', 'foam', 'stretch'];
        return workout.exercises?.some(ex => prehabKeywords.some(k => ex.name?.toLowerCase().includes(k)));
    },
    
    checkCompoundOrder(workout) {
        return this.checkExerciseOrder(workout);
    },
    
    checkPushPullBalance(workout) {
        const pushKeywords = ['press', 'push', 'chest', 'shoulder', 'tricep', 'dip'];
        const pullKeywords = ['row', 'pull', 'back', 'bicep', 'lat', 'rear'];
        
        let pushCount = 0;
        let pullCount = 0;
        
        workout.exercises?.forEach(ex => {
            const name = ex.name?.toLowerCase() || '';
            if (pushKeywords.some(k => name.includes(k))) pushCount++;
            if (pullKeywords.some(k => name.includes(k))) pullCount++;
        });
        
        // Ratio accettabile: 0.5 - 2.0
        if (pushCount === 0 && pullCount === 0) return true;
        if (pushCount === 0 || pullCount === 0) return false;
        
        const ratio = pushCount / pullCount;
        return ratio >= 0.5 && ratio <= 2.0;
    },
    
    checkVolumeAppropriate(workout) {
        const totalSets = workout.exercises?.reduce((sum, ex) => sum + (Number(ex.sets) || 0), 0) || 0;
        return totalSets >= 15 && totalSets <= 35;
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // GENERAZIONE REPORT
    // ═══════════════════════════════════════════════════════════════════════
    
    evaluateWorkout(workout, profile) {
        const results = {
            profile: profile.id,
            sport: profile.sport,
            difficulty: profile.difficulty,
            checks: [],
            score: 0,
            maxScore: 0,
            passed: 0,
            failed: 0,
            warnings: []
        };
        
        // Criteri base
        for (const criterion of this.evaluationCriteria.base) {
            const passed = criterion.check(workout, profile);
            results.checks.push({ ...criterion, passed });
            results.maxScore += criterion.weight;
            if (passed) {
                results.score += criterion.weight;
                results.passed++;
            } else {
                results.failed++;
            }
        }
        
        // Criteri infortuni
        if (profile.injuries?.length > 0) {
            for (const criterion of this.evaluationCriteria.injury) {
                const passed = criterion.check(workout, profile);
                results.checks.push({ ...criterion, passed });
                results.maxScore += criterion.weight;
                if (passed) {
                    results.score += criterion.weight;
                    results.passed++;
                } else {
                    results.failed++;
                    results.warnings.push(`⚠️ ${criterion.name} FALLITO - Potenziale rischio infortunio!`);
                }
            }
        }
        
        // Criteri sport-specifici
        const sportCriteria = this.evaluationCriteria[profile.sport];
        if (sportCriteria) {
            for (const criterion of sportCriteria) {
                const passed = criterion.check(workout, profile);
                results.checks.push({ ...criterion, passed });
                results.maxScore += criterion.weight;
                if (passed) {
                    results.score += criterion.weight;
                    results.passed++;
                } else {
                    results.failed++;
                }
            }
        }
        
        results.percentage = Math.round((results.score / results.maxScore) * 100);
        results.grade = this.getGrade(results.percentage);
        
        return results;
    },
    
    getGrade(percentage) {
        if (percentage >= 90) return { letter: 'A', color: '#22c55e', label: 'Eccellente' };
        if (percentage >= 80) return { letter: 'B', color: '#84cc16', label: 'Buono' };
        if (percentage >= 70) return { letter: 'C', color: '#eab308', label: 'Sufficiente' };
        if (percentage >= 60) return { letter: 'D', color: '#f97316', label: 'Insufficiente' };
        return { letter: 'F', color: '#ef4444', label: 'Fallito' };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // RUNNER PRINCIPALE
    // ═══════════════════════════════════════════════════════════════════════
    
    async runFullTest(generateFn, options = {}) {
        const { sports = ['calcio', 'basket', 'boxe', 'palestra'], maxPerSport = 3 } = options;
        
        const results = {
            timestamp: new Date().toISOString(),
            totalTests: 0,
            passed: 0,
            failed: 0,
            byDifficulty: { easy: [], medium: [], hard: [], extreme: [], edge_case: [] },
            bySport: {},
            details: [],
            summary: {}
        };
        
        for (const sport of sports) {
            const profiles = this.testProfiles[sport]?.slice(0, maxPerSport) || [];
            results.bySport[sport] = { total: 0, passed: 0, avgScore: 0 };
            
            for (const profile of profiles) {
                console.log(`🧪 Testing: ${profile.id}...`);
                
                try {
                    const workout = await generateFn(profile);
                    const evaluation = this.evaluateWorkout(workout, profile);
                    
                    results.totalTests++;
                    results.bySport[sport].total++;
                    
                    if (evaluation.percentage >= 70) {
                        results.passed++;
                        results.bySport[sport].passed++;
                    } else {
                        results.failed++;
                    }
                    
                    results.byDifficulty[profile.difficulty]?.push(evaluation);
                    results.details.push({
                        profile: profile.id,
                        workout,
                        evaluation
                    });
                    
                    console.log(`   ${evaluation.grade.letter} (${evaluation.percentage}%) - ${evaluation.passed}/${evaluation.passed + evaluation.failed} checks`);
                    
                } catch (error) {
                    console.error(`   ❌ ERROR: ${error.message}`);
                    results.failed++;
                    results.details.push({
                        profile: profile.id,
                        error: error.message
                    });
                }
            }
            
            // Calcola media per sport
            const sportDetails = results.details.filter(d => d.evaluation?.sport === sport && d.evaluation?.percentage);
            if (sportDetails.length > 0) {
                results.bySport[sport].avgScore = Math.round(
                    sportDetails.reduce((sum, d) => sum + d.evaluation.percentage, 0) / sportDetails.length
                );
            }
        }
        
        // Summary
        results.summary = {
            passRate: Math.round((results.passed / results.totalTests) * 100),
            avgScore: Math.round(
                results.details.filter(d => d.evaluation?.percentage).reduce((sum, d) => sum + d.evaluation.percentage, 0) / 
                results.details.filter(d => d.evaluation?.percentage).length
            ),
            weakestSport: Object.entries(results.bySport).sort((a, b) => a[1].avgScore - b[1].avgScore)[0]?.[0],
            hardestProfiles: results.details.filter(d => d.evaluation?.percentage < 60).map(d => d.profile)
        };
        
        return results;
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // DISPLAY RESULTS
    // ═══════════════════════════════════════════════════════════════════════
    
    formatResults(results) {
        let output = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                     GR PERFORM - AI STRESS TEST RESULTS                       ║
║                           ${results.timestamp}                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  OVERALL: ${results.passed}/${results.totalTests} PASSED (${results.summary.passRate}%)                                          ║
║  AVERAGE SCORE: ${results.summary.avgScore}%                                                     ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  BY SPORT:                                                                    ║`;
        
        for (const [sport, data] of Object.entries(results.bySport)) {
            const bar = '█'.repeat(Math.round(data.avgScore / 10)) + '░'.repeat(10 - Math.round(data.avgScore / 10));
            output += `\n║    ${sport.toUpperCase().padEnd(10)} ${bar} ${data.avgScore}% (${data.passed}/${data.total})`;
        }
        
        output += `
╠══════════════════════════════════════════════════════════════════════════════╣
║  PROBLEM PROFILES:                                                           ║`;
        
        if (results.summary.hardestProfiles.length > 0) {
            for (const profile of results.summary.hardestProfiles.slice(0, 5)) {
                output += `\n║    ❌ ${profile}`;
            }
        } else {
            output += `\n║    ✅ Nessun profilo problematico!`;
        }
        
        output += `
╚══════════════════════════════════════════════════════════════════════════════╝`;
        
        return output;
    },
    
    // Quick single profile test
    async testSingleProfile(profileId, generateFn) {
        const allProfiles = [
            ...this.testProfiles.calcio,
            ...this.testProfiles.basket,
            ...this.testProfiles.boxe,
            ...this.testProfiles.palestra
        ];
        
        const profile = allProfiles.find(p => p.id === profileId);
        if (!profile) {
            console.error(`Profile ${profileId} not found`);
            return null;
        }
        
        console.log(`🧪 Testing: ${profile.name} (${profile.id})`);
        const workout = await generateFn(profile);
        const evaluation = this.evaluateWorkout(workout, profile);
        
        console.log(`\n📊 RESULT: ${evaluation.grade.letter} (${evaluation.percentage}%)`);
        console.log(`   Passed: ${evaluation.passed}, Failed: ${evaluation.failed}`);
        
        if (evaluation.warnings.length > 0) {
            console.log(`\n⚠️ WARNINGS:`);
            evaluation.warnings.forEach(w => console.log(`   ${w}`));
        }
        
        console.log(`\n📋 CHECKS:`);
        evaluation.checks.forEach(c => {
            console.log(`   ${c.passed ? '✅' : '❌'} ${c.name}`);
        });
        
        return { workout, evaluation };
    }
};

// Export
window.AIStressTest = AIStressTest;
console.log('🧪 AIStressTest loaded - Use AIStressTest.runFullTest(generateFn) to test');
