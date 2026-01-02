/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧬 ATLAS ADVANCED SCIENCE MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Questo modulo contiene la conoscenza scientifica moderna più avanzata
 * per la validazione e generazione di workout ottimali.
 * 
 * PRINCIPI SCIENTIFICI IMPLEMENTATI:
 * 1. Lengthened vs Shortened Training (Range of Motion)
 * 2. Fiber Type Specificity (Type I vs Type II)
 * 3. Eccentric/Concentric Emphasis
 * 4. Time Under Tension (TUT) Optimization
 * 5. Weekly Volume Distribution
 * 6. Muscle Synergist/Antagonist Balance
 * 7. Recovery Science (SRA Curves)
 * 8. Periodization Phases
 * 
 * References:
 * - Schoenfeld et al. (2021): "Resistance Training Recommendations"
 * - Skarabot et al. (2021): "Lengthened vs Shortened Training"
 * - Schoenfeld & Grgic (2022): "Training Volume Meta-Analysis"
 * - Helms et al. (2014): "Evidence-based recommendations for contest prep"
 */

window.ATLASScience = {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 MUSCLE DATABASE - Conoscenza anatomica e biomeccanica
    // ═══════════════════════════════════════════════════════════════════════════
    
    muscleDB: {
        // Ogni muscolo con le sue proprietà scientifiche
        quadriceps: {
            name: 'Quadriceps',
            fiberType: 'mixed', // ~50% Type I, 50% Type II
            sraRecovery: 48, // ore per recupero completo
            synergists: ['glutes', 'hip_flexors'],
            antagonists: ['hamstrings'],
            lengthened: ['sissy_squat', 'leg_extension_full_rom', 'deep_squat', 'bulgarian_split_squat'],
            shortened: ['leg_extension_peak', 'leg_press_lockout'],
            optimalRepRange: { hypertrophy: '8-12', strength: '3-6', endurance: '15-20' }
        },
        
        hamstrings: {
            name: 'Hamstrings',
            fiberType: 'type2_dominant', // ~70% Type II
            sraRecovery: 72, // richiedono più recupero
            synergists: ['glutes', 'calves'],
            antagonists: ['quadriceps', 'hip_flexors'],
            lengthened: ['rdl', 'good_morning', 'nordic_curl', 'seated_leg_curl'],
            shortened: ['lying_leg_curl', 'glute_ham_raise_top'],
            optimalRepRange: { hypertrophy: '8-12', strength: '5-8', endurance: '12-15' }
        },
        
        glutes: {
            name: 'Gluteus Maximus',
            fiberType: 'mixed',
            sraRecovery: 48,
            synergists: ['hamstrings', 'lower_back'],
            antagonists: ['hip_flexors'],
            lengthened: ['deep_squat', 'hip_thrust_bottom', 'lunge_deep'],
            shortened: ['hip_thrust_lockout', 'glute_bridge_hold', 'cable_kickback'],
            optimalRepRange: { hypertrophy: '8-15', strength: '5-8', endurance: '15-25' }
        },
        
        chest: {
            name: 'Pectoralis Major',
            fiberType: 'type2_dominant',
            sraRecovery: 48,
            synergists: ['front_delts', 'triceps'],
            antagonists: ['upper_back', 'rear_delts'],
            lengthened: ['dumbbell_fly_stretch', 'incline_press_deep', 'cable_crossover_stretch'],
            shortened: ['pec_deck', 'cable_crossover_squeeze', 'svend_press'],
            optimalRepRange: { hypertrophy: '8-12', strength: '4-6', endurance: '15-20' }
        },
        
        back_lats: {
            name: 'Latissimus Dorsi',
            fiberType: 'type2_dominant',
            sraRecovery: 48,
            synergists: ['biceps', 'rear_delts', 'rhomboids'],
            antagonists: ['chest', 'front_delts'],
            lengthened: ['pullover', 'lat_pulldown_stretch', 'straight_arm_pulldown'],
            shortened: ['lat_pulldown_squeeze', 'row_peak_contraction'],
            optimalRepRange: { hypertrophy: '8-12', strength: '5-8', endurance: '12-15' }
        },
        
        shoulders: {
            name: 'Deltoids',
            fiberType: 'type1_dominant', // necessitano volume alto
            sraRecovery: 24, // recuperano velocemente
            synergists: ['traps', 'triceps'],
            antagonists: ['lats'],
            lengthened: ['cable_lateral_behind', 'incline_lateral_raise'],
            shortened: ['lateral_raise_top', 'upright_row'],
            optimalRepRange: { hypertrophy: '10-15', strength: '6-10', endurance: '15-25' }
        },
        
        biceps: {
            name: 'Biceps Brachii',
            fiberType: 'mixed',
            sraRecovery: 24,
            synergists: ['brachialis', 'forearms'],
            antagonists: ['triceps'],
            lengthened: ['incline_curl', 'preacher_curl_bottom', 'bayesian_curl'],
            shortened: ['concentration_curl', 'spider_curl'],
            optimalRepRange: { hypertrophy: '8-12', strength: '6-8', endurance: '15-20' }
        },
        
        triceps: {
            name: 'Triceps Brachii',
            fiberType: 'type2_dominant',
            sraRecovery: 24,
            synergists: ['chest', 'shoulders'],
            antagonists: ['biceps'],
            lengthened: ['overhead_extension', 'skull_crusher', 'french_press'],
            shortened: ['pushdown', 'kickback', 'close_grip_bench_lockout'],
            optimalRepRange: { hypertrophy: '8-12', strength: '5-8', endurance: '12-15' }
        },
        
        calves: {
            name: 'Gastrocnemius & Soleus',
            fiberType: 'type1_dominant', // resistenti, richiedono volume
            sraRecovery: 24,
            synergists: ['tibialis'],
            antagonists: ['tibialis_anterior'],
            lengthened: ['calf_raise_stretch', 'donkey_calf_raise'],
            shortened: ['seated_calf_raise', 'calf_raise_hold'],
            optimalRepRange: { hypertrophy: '10-15', strength: '8-12', endurance: '20-30' }
        },
        
        core: {
            name: 'Core Complex',
            fiberType: 'type1_dominant', // stabilizzatori
            sraRecovery: 24,
            synergists: ['hip_flexors', 'obliques'],
            antagonists: ['lower_back'],
            lengthened: ['hanging_leg_raise', 'ab_wheel_stretched'],
            shortened: ['crunch_peak', 'plank'],
            optimalRepRange: { hypertrophy: '12-20', strength: '8-12', endurance: '20-30' }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏋️ EXERCISE DATABASE - Classificazione esercizi
    // ═══════════════════════════════════════════════════════════════════════════
    
    exerciseDB: {
        // Esercizi con ROM e emphasis
        'squat': { muscles: ['quadriceps', 'glutes', 'hamstrings'], romType: 'lengthened', compound: true },
        'back_squat': { muscles: ['quadriceps', 'glutes', 'hamstrings'], romType: 'lengthened', compound: true },
        'front_squat': { muscles: ['quadriceps', 'core'], romType: 'lengthened', compound: true },
        'leg_press': { muscles: ['quadriceps', 'glutes'], romType: 'shortened', compound: true },
        'leg_extension': { muscles: ['quadriceps'], romType: 'shortened', compound: false },
        'sissy_squat': { muscles: ['quadriceps'], romType: 'lengthened', compound: false },
        'bulgarian_split_squat': { muscles: ['quadriceps', 'glutes'], romType: 'lengthened', compound: true },
        
        'rdl': { muscles: ['hamstrings', 'glutes', 'back_lats'], romType: 'lengthened', compound: true },
        'romanian_deadlift': { muscles: ['hamstrings', 'glutes', 'back_lats'], romType: 'lengthened', compound: true },
        'deadlift': { muscles: ['hamstrings', 'glutes', 'back_lats', 'quadriceps'], romType: 'lengthened', compound: true },
        'nordic_curl': { muscles: ['hamstrings'], romType: 'lengthened', compound: false, eccentric: true },
        'leg_curl': { muscles: ['hamstrings'], romType: 'shortened', compound: false },
        'good_morning': { muscles: ['hamstrings', 'glutes'], romType: 'lengthened', compound: true },
        
        'hip_thrust': { muscles: ['glutes', 'hamstrings'], romType: 'shortened', compound: true },
        'glute_bridge': { muscles: ['glutes'], romType: 'shortened', compound: false },
        'cable_kickback': { muscles: ['glutes'], romType: 'shortened', compound: false },
        
        'bench_press': { muscles: ['chest', 'triceps', 'shoulders'], romType: 'lengthened', compound: true },
        'incline_press': { muscles: ['chest', 'shoulders', 'triceps'], romType: 'lengthened', compound: true },
        'dumbbell_fly': { muscles: ['chest'], romType: 'lengthened', compound: false },
        'cable_crossover': { muscles: ['chest'], romType: 'shortened', compound: false },
        'pec_deck': { muscles: ['chest'], romType: 'shortened', compound: false },
        'push_up': { muscles: ['chest', 'triceps', 'shoulders'], romType: 'lengthened', compound: true },
        
        'pull_up': { muscles: ['back_lats', 'biceps'], romType: 'lengthened', compound: true },
        'lat_pulldown': { muscles: ['back_lats', 'biceps'], romType: 'lengthened', compound: true },
        'row': { muscles: ['back_lats', 'biceps', 'rear_delts'], romType: 'shortened', compound: true },
        'barbell_row': { muscles: ['back_lats', 'biceps'], romType: 'shortened', compound: true },
        'cable_row': { muscles: ['back_lats', 'biceps'], romType: 'shortened', compound: true },
        'pullover': { muscles: ['back_lats', 'chest'], romType: 'lengthened', compound: false },
        
        'overhead_press': { muscles: ['shoulders', 'triceps'], romType: 'lengthened', compound: true },
        'lateral_raise': { muscles: ['shoulders'], romType: 'shortened', compound: false },
        'face_pull': { muscles: ['rear_delts', 'traps'], romType: 'shortened', compound: false },
        
        'bicep_curl': { muscles: ['biceps'], romType: 'shortened', compound: false },
        'incline_curl': { muscles: ['biceps'], romType: 'lengthened', compound: false },
        'preacher_curl': { muscles: ['biceps'], romType: 'lengthened', compound: false },
        'hammer_curl': { muscles: ['biceps', 'forearms'], romType: 'shortened', compound: false },
        
        'tricep_pushdown': { muscles: ['triceps'], romType: 'shortened', compound: false },
        'overhead_extension': { muscles: ['triceps'], romType: 'lengthened', compound: false },
        'skull_crusher': { muscles: ['triceps'], romType: 'lengthened', compound: false },
        'dips': { muscles: ['triceps', 'chest'], romType: 'lengthened', compound: true },
        
        'calf_raise': { muscles: ['calves'], romType: 'lengthened', compound: false },
        'seated_calf_raise': { muscles: ['calves'], romType: 'shortened', compound: false },
        
        'plank': { muscles: ['core'], romType: 'shortened', compound: false, isometric: true },
        'crunch': { muscles: ['core'], romType: 'shortened', compound: false },
        'hanging_leg_raise': { muscles: ['core', 'hip_flexors'], romType: 'lengthened', compound: false },
        'ab_wheel': { muscles: ['core'], romType: 'lengthened', compound: false },
        'russian_twist': { muscles: ['core', 'obliques'], romType: 'shortened', compound: false },
        
        // Esercizi esplosivi
        'box_jump': { muscles: ['quadriceps', 'glutes', 'calves'], romType: 'power', compound: true, plyometric: true },
        'jump_squat': { muscles: ['quadriceps', 'glutes'], romType: 'power', compound: true, plyometric: true },
        'depth_jump': { muscles: ['quadriceps', 'calves'], romType: 'power', compound: true, plyometric: true },
        'broad_jump': { muscles: ['quadriceps', 'glutes', 'hamstrings'], romType: 'power', compound: true, plyometric: true },
        'lateral_bound': { muscles: ['glutes', 'adductors'], romType: 'power', compound: true, plyometric: true }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧬 LENGTHENED POSITION DATABASE - NASA-LEVEL (Schoenfeld 2024, Milo Wolf 2024)
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Database esercizi in posizione ALLUNGATA (stretch) per ogni muscolo
     * Basato su: Pedrosa et al. 2024 "Lengthened Partials", Milo Wolf 2024 "ROM Research"
     * 
     * La ricerca 2024-2025 mostra che esercizi in posizione allungata
     * producono ipertrofia superiore rispetto a posizione accorciata
     */
    lengthendPositionDB: {
        quadriceps: {
            optimal: [
                { name: 'Sissy Squat', technique: 'Massima flessione ginocchio, torso indietro', hypertrophy_score: 10 },
                { name: 'Leg Extension (full stretch)', technique: 'Partenza con ginocchio completamente flesso', hypertrophy_score: 9 },
                { name: 'Deep Squat (ATG)', technique: 'Ass-to-grass, massimo ROM', hypertrophy_score: 9 },
                { name: 'Bulgarian Split Squat (deficit)', technique: 'Piede anteriore su rialzo per extra ROM', hypertrophy_score: 9 },
                { name: 'Hack Squat Deep', technique: 'ROM completo in basso', hypertrophy_score: 8 }
            ],
            alternatives: ['Front Squat Deep', 'Cyclist Squat', 'Pendulum Squat']
        },
        
        hamstrings: {
            optimal: [
                { name: 'Seated Leg Curl', technique: 'Anca flessa = hamstrings in stretch', hypertrophy_score: 10 },
                { name: 'Romanian Deadlift', technique: 'Focus su stretch in basso, non lockout', hypertrophy_score: 9 },
                { name: 'Good Morning', technique: 'Stretch completo hamstrings', hypertrophy_score: 9 },
                { name: 'Nordic Curl', technique: 'Eccentrica controllata = massimo stretch', hypertrophy_score: 10 },
                { name: 'Single Leg RDL', technique: 'Extra stretch unilaterale', hypertrophy_score: 8 }
            ],
            alternatives: ['Stiff Leg Deadlift', '45° Back Extension', 'Slider Leg Curl']
        },
        
        glutes: {
            optimal: [
                { name: 'Deep Squat', technique: 'Massima profondità per glute stretch', hypertrophy_score: 9 },
                { name: 'Romanian Deadlift', technique: 'Focus su stretch glutei in basso', hypertrophy_score: 9 },
                { name: 'Lunge Deep', technique: 'Step lungo, ginocchio quasi a terra', hypertrophy_score: 8 },
                { name: 'B-Stance RDL', technique: 'Focus unilaterale su stretch', hypertrophy_score: 8 },
                { name: 'Cable Pull Through', technique: 'Stretch completo in avanti', hypertrophy_score: 7 }
            ],
            alternatives: ['Step Up High Box', 'Deficit Reverse Lunge']
        },
        
        chest: {
            optimal: [
                { name: 'Dumbbell Fly (floor or stretch)', technique: 'Gomiti sotto il torso per max stretch', hypertrophy_score: 10 },
                { name: 'Incline Dumbbell Press (deep)', technique: 'Manubri sotto al petto', hypertrophy_score: 9 },
                { name: 'Cable Fly (low to high stretch)', technique: 'Stretch completo in basso', hypertrophy_score: 9 },
                { name: 'Dips (chest focused)', technique: 'Discesa profonda, stretch petto', hypertrophy_score: 8 },
                { name: 'Push-up (deficit)', technique: 'Mani su rialzi per extra ROM', hypertrophy_score: 8 }
            ],
            alternatives: ['Pec Deck (stretch hold)', 'Guillotine Press']
        },
        
        back_lats: {
            optimal: [
                { name: 'Pullover (dumbbell/cable)', technique: 'Stretch completo overhead', hypertrophy_score: 10 },
                { name: 'Straight Arm Pulldown', technique: 'Stretch completo in alto', hypertrophy_score: 9 },
                { name: 'Lat Pulldown (stretch focus)', technique: 'Pausa in alto con stretch', hypertrophy_score: 9 },
                { name: 'Single Arm Cable Row (stretch)', technique: 'Rotazione per extra stretch', hypertrophy_score: 8 },
                { name: 'Pull-up (dead hang start)', technique: 'Partenza da dead hang', hypertrophy_score: 8 }
            ],
            alternatives: ['Meadows Row', 'Kayak Row']
        },
        
        shoulders: {
            optimal: [
                { name: 'Cable Lateral Raise (behind body)', technique: 'Cavo parte da dietro = stretch deltoide laterale', hypertrophy_score: 10 },
                { name: 'Incline Lateral Raise', technique: 'Inclinato su panca = stretch naturale', hypertrophy_score: 10 },
                { name: 'Lying Cable Rear Delt Fly', technique: 'Stretch completo deltoide posteriore', hypertrophy_score: 9 },
                { name: 'Lu Raise (Y-raise)', technique: 'Stretch completo overhead', hypertrophy_score: 8 },
                { name: 'Prone Incline Front Raise', technique: 'Stretch deltoide anteriore', hypertrophy_score: 8 }
            ],
            alternatives: ['Behind Body Dumbbell Lateral', 'Stretch Incline Y-Raise']
        },
        
        biceps: {
            optimal: [
                { name: 'Incline Dumbbell Curl', technique: 'Braccio dietro il corpo = max stretch', hypertrophy_score: 10 },
                { name: 'Bayesian Curl (cable behind)', technique: 'Cavo da dietro = stretch perfetto', hypertrophy_score: 10 },
                { name: 'Preacher Curl (bottom focus)', technique: 'Focus sulla porzione bassa', hypertrophy_score: 9 },
                { name: 'Overhead Cable Curl', technique: 'Stretch con braccio sopra la testa', hypertrophy_score: 8 },
                { name: 'Drag Curl', technique: 'Gomiti indietro = extra stretch', hypertrophy_score: 7 }
            ],
            alternatives: ['Spider Curl (eccentric focus)', 'Decline Dumbbell Curl']
        },
        
        triceps: {
            optimal: [
                { name: 'Overhead Dumbbell Extension', technique: 'Stretch completo overhead', hypertrophy_score: 10 },
                { name: 'Incline Overhead Extension', technique: 'Extra stretch con inclinazione', hypertrophy_score: 10 },
                { name: 'Skull Crusher', technique: 'Stretch dietro la testa', hypertrophy_score: 9 },
                { name: 'French Press', technique: 'Gomiti alti, stretch completo', hypertrophy_score: 9 },
                { name: 'Cable Overhead Extension', technique: 'Stretch controllato con cavo', hypertrophy_score: 8 }
            ],
            alternatives: ['JM Press', 'Incline Skull Crusher']
        },
        
        calves: {
            optimal: [
                { name: 'Standing Calf Raise (deep stretch)', technique: 'Tallone sotto la pedana', hypertrophy_score: 9 },
                { name: 'Donkey Calf Raise', technique: 'Anca flessa = gastrocnemio in stretch', hypertrophy_score: 10 },
                { name: 'Leg Press Calf Raise (stretch)', technique: 'Focus su stretch in basso', hypertrophy_score: 8 },
                { name: 'Single Leg Calf Raise (deficit)', technique: 'Massimo ROM su rialzo', hypertrophy_score: 9 }
            ],
            alternatives: ['Smith Machine Calf Raise']
        },
        
        core: {
            optimal: [
                { name: 'Hanging Leg Raise', technique: 'Stretch completo addome in basso', hypertrophy_score: 9 },
                { name: 'Ab Wheel Rollout', technique: 'Stretch massimo in estensione', hypertrophy_score: 10 },
                { name: 'Cable Crunch (extended start)', technique: 'Partenza in estensione', hypertrophy_score: 8 },
                { name: 'Decline Sit-up (full ROM)', technique: 'ROM completo su panca decline', hypertrophy_score: 7 }
            ],
            alternatives: ['Dragon Flag', 'Body Saw']
        }
    },
    
    /**
     * Suggerisce esercizi lengthened mancanti per un workout
     * @param {Object} workout - Workout da analizzare
     * @returns {Object} Suggerimenti per muscoli senza copertura lengthened
     */
    suggestLengthenedExercises(workout) {
        const exercises = workout.exercises || [];
        const musclesCovered = {};
        const suggestions = [];
        
        // Analizza coverage attuale
        exercises.forEach(ex => {
            const exName = (ex.name || '').toLowerCase();
            const exData = this.findExercise(exName);
            
            if (exData && exData.romType === 'lengthened') {
                exData.muscles.forEach(m => {
                    musclesCovered[m] = true;
                });
            }
        });
        
        // Trova muscoli senza copertura lengthened
        const trainedMuscles = new Set();
        exercises.forEach(ex => {
            const exData = this.findExercise((ex.name || '').toLowerCase());
            if (exData) {
                exData.muscles.forEach(m => trainedMuscles.add(m));
            }
        });
        
        // Suggerisci per ogni muscolo allenato ma senza lengthened
        trainedMuscles.forEach(muscle => {
            if (!musclesCovered[muscle] && this.lengthendPositionDB[muscle]) {
                const lengthened = this.lengthendPositionDB[muscle];
                suggestions.push({
                    muscle: muscle,
                    issue: `${muscle} allenato ma senza esercizi in posizione allungata`,
                    recommendation: lengthened.optimal[0],
                    alternatives: lengthened.optimal.slice(1, 3).map(e => e.name),
                    science: 'Schoenfeld 2024: Lengthened training → +30% ipertrofia'
                });
            }
        });
        
        return {
            hasSuggestions: suggestions.length > 0,
            suggestions,
            musclesCovered: Object.keys(musclesCovered),
            musclesMissing: [...trainedMuscles].filter(m => !musclesCovered[m])
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔬 ADVANCED ANALYSIS FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Analizza se il workout bilancia esercizi in allungamento e accorciamento
     * per ogni gruppo muscolare
     */
    analyzeLengthVsShortened(workout) {
        const exercises = workout.exercises || [];
        const muscleAnalysis = {};
        const findings = [];
        let score = 0;
        
        // Analizza ogni esercizio
        for (const ex of exercises) {
            const exName = (ex.name || '').toLowerCase();
            const exData = this.findExercise(exName);
            
            if (exData) {
                for (const muscle of exData.muscles) {
                    if (!muscleAnalysis[muscle]) {
                        muscleAnalysis[muscle] = { lengthened: 0, shortened: 0, power: 0 };
                    }
                    
                    const sets = parseInt(ex.sets) || 1;
                    muscleAnalysis[muscle][exData.romType] = 
                        (muscleAnalysis[muscle][exData.romType] || 0) + sets;
                }
            }
        }
        
        // Valuta bilanciamento per muscolo
        let balancedMuscles = 0;
        let totalMuscles = 0;
        
        for (const [muscle, data] of Object.entries(muscleAnalysis)) {
            totalMuscles++;
            const total = data.lengthened + data.shortened + data.power;
            
            if (total === 0) continue;
            
            // Ideale: almeno 40% in una posizione, 40% nell'altra, o 80%+ power
            const lengthPct = data.lengthened / total;
            const shortPct = data.shortened / total;
            const powerPct = data.power / total;
            
            if (powerPct >= 0.8 || (lengthPct >= 0.3 && shortPct >= 0.3)) {
                balancedMuscles++;
                findings.push({
                    type: 'success',
                    msg: `✅ ${this.muscleDB[muscle]?.name || muscle}: bilanciato (L:${Math.round(lengthPct*100)}% S:${Math.round(shortPct*100)}%)`
                });
            } else if (data.lengthened > 0 || data.shortened > 0) {
                findings.push({
                    type: 'info',
                    msg: `ℹ️ ${this.muscleDB[muscle]?.name || muscle}: solo ${data.lengthened > 0 ? 'lengthened' : 'shortened'} (ok se bilanciato settimanalmente)`
                });
            }
        }
        
        // Score basato sul bilanciamento
        if (totalMuscles > 0) {
            score = Math.round((balancedMuscles / totalMuscles) * 100);
        }
        
        // Insights avanzati
        if (score < 50) {
            findings.push({
                type: 'warning',
                msg: '⚠️ SCIENZA: Per ipertrofia ottimale, ogni muscolo dovrebbe essere allenato sia in allungamento che in accorciamento (nella sessione o nella settimana)'
            });
        }
        
        return {
            score,
            muscleAnalysis,
            findings,
            insight: 'Lengthened training (stretched position) = più tensione meccanica. Shortened training = più stress metabolico. Combinare entrambi massimizza ipertrofia.'
        };
    },
    
    /**
     * Analizza distribuzione tipo fibre e rep ranges appropriati
     */
    analyzeFiberTypeMatch(workout, profile) {
        const exercises = workout.exercises || [];
        const findings = [];
        let matchScore = 0;
        let totalAnalyzed = 0;
        
        for (const ex of exercises) {
            const exName = (ex.name || '').toLowerCase();
            const exData = this.findExercise(exName);
            
            if (!exData) continue;
            
            for (const muscle of exData.muscles) {
                const muscleInfo = this.muscleDB[muscle];
                if (!muscleInfo) continue;
                
                totalAnalyzed++;
                const reps = this.parseReps(ex.reps);
                const goal = profile.goal?.toLowerCase() || 'hypertrophy';
                
                const optimalRange = muscleInfo.optimalRepRange[goal === 'potenza' ? 'strength' : goal === 'resistenza' ? 'endurance' : 'hypertrophy'];
                
                if (optimalRange) {
                    const [minOpt, maxOpt] = optimalRange.split('-').map(Number);
                    
                    if (reps >= minOpt && reps <= maxOpt) {
                        matchScore++;
                    } else if (muscleInfo.fiberType === 'type1_dominant' && reps > maxOpt) {
                        // Type I dominant = più reps è meglio
                        matchScore += 0.5;
                    } else if (muscleInfo.fiberType === 'type2_dominant' && reps < minOpt) {
                        // Type II dominant = meno reps è accettabile per forza
                        matchScore += 0.5;
                    }
                }
            }
        }
        
        const score = totalAnalyzed > 0 ? Math.round((matchScore / totalAnalyzed) * 100) : 50;
        
        if (score >= 80) {
            findings.push({ type: 'success', msg: '✅ Rep ranges ottimali per tipo fibre muscolari' });
        } else if (score >= 50) {
            findings.push({ type: 'info', msg: 'ℹ️ Rep ranges generalmente appropriati' });
        } else {
            findings.push({ type: 'warning', msg: '⚠️ Alcuni rep ranges non ottimali per i gruppi muscolari target' });
        }
        
        return { score, findings };
    },
    
    /**
     * Analizza la presenza di lavoro eccentrico enfatizzato
     */
    analyzeEccentricEmphasis(workout) {
        const exercises = workout.exercises || [];
        const findings = [];
        
        const eccentricExercises = exercises.filter(ex => {
            const name = (ex.name || '').toLowerCase();
            return name.includes('nordic') || 
                   name.includes('eccentric') ||
                   name.includes('negative') ||
                   name.includes('tempo') ||
                   name.includes('slow') ||
                   this.findExercise(name)?.eccentric;
        });
        
        const hasEccentric = eccentricExercises.length > 0;
        const score = hasEccentric ? 100 : 50;
        
        if (hasEccentric) {
            findings.push({ 
                type: 'success', 
                msg: `✅ Lavoro eccentrico presente (${eccentricExercises.map(e => e.name).join(', ')})` 
            });
        } else {
            findings.push({ 
                type: 'info', 
                msg: 'ℹ️ Nessun esercizio con enfasi eccentrica esplicita (opzionale ma benefico per forza e prevenzione infortuni)' 
            });
        }
        
        return { score, findings, hasEccentric };
    },
    
    /**
     * Calcola Time Under Tension stimato
     */
    analyzeTimeUnderTension(workout) {
        const exercises = workout.exercises || [];
        let totalTUT = 0;
        const findings = [];
        
        for (const ex of exercises) {
            const sets = parseInt(ex.sets) || 0;
            const reps = this.parseReps(ex.reps);
            const tempo = ex.tempo || '2-0-2-0'; // default tempo
            
            // Parse tempo (eccentric-pause-concentric-pause)
            const tempoParts = tempo.split('-').map(Number);
            const repDuration = tempoParts.reduce((a, b) => a + (b || 0), 0) || 4;
            
            const exerciseTUT = sets * reps * repDuration;
            totalTUT += exerciseTUT;
        }
        
        // Optimal TUT per session: 40-70 minutes per muscle group in a week
        // Per session targeting 2-3 muscle groups: 20-40 min optimal
        const optimalMin = 20 * 60; // 20 min in seconds
        const optimalMax = 50 * 60; // 50 min
        
        let score;
        if (totalTUT >= optimalMin && totalTUT <= optimalMax) {
            score = 100;
            findings.push({ type: 'success', msg: `✅ TUT ottimale: ${Math.round(totalTUT/60)} minuti` });
        } else if (totalTUT < optimalMin) {
            score = Math.round((totalTUT / optimalMin) * 100);
            findings.push({ type: 'warning', msg: `⚠️ TUT basso: ${Math.round(totalTUT/60)} min (ottimale: 20-50 min)` });
        } else {
            score = Math.round((optimalMax / totalTUT) * 100);
            findings.push({ type: 'info', msg: `ℹ️ TUT alto: ${Math.round(totalTUT/60)} min (potrebbe richiedere più recupero)` });
        }
        
        return { score: Math.min(score, 100), totalTUT, findings };
    },
    
    /**
     * Analizza bilanciamento agonisti/antagonisti
     */
    analyzeAgonistAntagonist(workout) {
        const exercises = workout.exercises || [];
        const muscleVolume = {};
        const findings = [];
        
        // Calcola volume per gruppo muscolare
        for (const ex of exercises) {
            const exName = (ex.name || '').toLowerCase();
            const exData = this.findExercise(exName);
            
            if (exData) {
                for (const muscle of exData.muscles) {
                    muscleVolume[muscle] = (muscleVolume[muscle] || 0) + (parseInt(ex.sets) || 1);
                }
            }
        }
        
        // Check balance pairs
        const pairs = [
            { agonist: 'quadriceps', antagonist: 'hamstrings', ratio: [1, 0.6] }, // quad:ham = 1:0.6-0.8
            { agonist: 'chest', antagonist: 'back_lats', ratio: [1, 1] }, // equal
            { agonist: 'biceps', antagonist: 'triceps', ratio: [1, 1.2] }, // triceps slightly more
            { agonist: 'shoulders', antagonist: 'back_lats', ratio: [1, 1.5] } // more back than shoulders
        ];
        
        let balancedPairs = 0;
        let checkedPairs = 0;
        
        for (const pair of pairs) {
            const agonistVol = muscleVolume[pair.agonist] || 0;
            const antagonistVol = muscleVolume[pair.antagonist] || 0;
            
            if (agonistVol === 0 && antagonistVol === 0) continue;
            
            checkedPairs++;
            const expectedRatio = pair.ratio[1] / pair.ratio[0];
            const actualRatio = agonistVol > 0 ? antagonistVol / agonistVol : 0;
            
            // Allow 30% deviation
            if (actualRatio >= expectedRatio * 0.7 && actualRatio <= expectedRatio * 1.3) {
                balancedPairs++;
                findings.push({
                    type: 'success',
                    msg: `✅ ${pair.agonist}/${pair.antagonist}: bilanciato (${agonistVol}:${antagonistVol})`
                });
            } else if (actualRatio > 0) {
                findings.push({
                    type: 'info',
                    msg: `ℹ️ ${pair.agonist}/${pair.antagonist}: ratio ${agonistVol}:${antagonistVol} (ideale ~${pair.ratio[0]}:${pair.ratio[1]})`
                });
            }
        }
        
        const score = checkedPairs > 0 ? Math.round((balancedPairs / checkedPairs) * 100) : 50;
        
        return { score, muscleVolume, findings };
    },
    
    /**
     * Verifica SRA (Stimulus-Recovery-Adaptation) appropriata
     */
    analyzeSRACompliance(workout, profile) {
        const findings = [];
        const trainingDays = profile.trainingDays || 3;
        const exercises = workout.exercises || [];
        
        // Calcola volume per gruppo muscolare
        const muscleVolume = {};
        for (const ex of exercises) {
            const exData = this.findExercise((ex.name || '').toLowerCase());
            if (exData) {
                for (const muscle of exData.muscles) {
                    muscleVolume[muscle] = (muscleVolume[muscle] || 0) + (parseInt(ex.sets) || 1);
                }
            }
        }
        
        // Verifica che il volume non superi la capacità di recupero
        let sraScore = 100;
        
        for (const [muscle, volume] of Object.entries(muscleVolume)) {
            const muscleInfo = this.muscleDB[muscle];
            if (!muscleInfo) continue;
            
            // Max sets per session based on recovery
            const maxSetsPerSession = muscleInfo.sraRecovery <= 24 ? 15 : 
                                       muscleInfo.sraRecovery <= 48 ? 12 : 10;
            
            if (volume > maxSetsPerSession) {
                sraScore -= 10;
                findings.push({
                    type: 'warning',
                    msg: `⚠️ ${muscleInfo.name}: ${volume} sets potrebbe eccedere capacità di recupero (max consigliato: ${maxSetsPerSession})`
                });
            }
        }
        
        // Verifica frequenza appropriata
        const weeklyFrequency = trainingDays >= 4 ? 2 : 1;
        findings.push({
            type: 'info',
            msg: `ℹ️ Con ${trainingDays} allenamenti/settimana, frequenza ${weeklyFrequency}x per muscolo è ottimale`
        });
        
        return { score: Math.max(sraScore, 0), findings };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🛠️ HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    findExercise(name) {
        // Cerca corrispondenza esatta o parziale
        const normalized = name.toLowerCase().replace(/[^a-z]/g, '');
        
        for (const [key, data] of Object.entries(this.exerciseDB)) {
            const keyNorm = key.replace(/_/g, '');
            if (normalized.includes(keyNorm) || keyNorm.includes(normalized)) {
                return data;
            }
        }
        
        // Pattern matching - ITALIANO + INGLESE
        // SQUAT variants
        if (name.includes('squat') || name.includes('accosciata')) return this.exerciseDB.squat;
        
        // DEADLIFT variants
        if (name.includes('deadlift') || name.includes('rdl') || name.includes('stacco') || name.includes('rumeno')) return this.exerciseDB.rdl;
        
        // BENCH PRESS variants
        if ((name.includes('press') || name.includes('panca') || name.includes('distensioni')) && 
            (name.includes('bench') || name.includes('piana') || name.includes('petto'))) return this.exerciseDB.bench_press;
        
        // INCLINE PRESS
        if ((name.includes('incline') || name.includes('inclina')) && 
            (name.includes('press') || name.includes('panca') || name.includes('distension'))) return this.exerciseDB.incline_press;
        
        // OVERHEAD PRESS
        if ((name.includes('overhead') || name.includes('military') || name.includes('shoulder') || name.includes('spalle')) && 
            name.includes('press')) return this.exerciseDB.overhead_press;
        if (name.includes('lento avanti') || name.includes('shoulder press')) return this.exerciseDB.overhead_press;
        
        // ROW variants
        if (name.includes('row') || name.includes('rematore') || name.includes('remata')) return this.exerciseDB.barbell_row;
        
        // PULLDOWN / LAT
        if (name.includes('pulldown') || name.includes('lat machine') || name.includes('lat pulldown')) return this.exerciseDB.lat_pulldown;
        
        // PULL-UP / TRAZIONI
        if (name.includes('pull up') || name.includes('pullup') || name.includes('trazion') || name.includes('sbarra')) return this.exerciseDB.pull_up;
        
        // CURL variants
        if (name.includes('curl') && name.includes('nordic')) return this.exerciseDB.nordic_curl;
        if (name.includes('curl') && (name.includes('incline') || name.includes('inclina'))) return this.exerciseDB.incline_curl;
        if (name.includes('curl') && name.includes('preacher')) return this.exerciseDB.preacher_curl;
        if (name.includes('curl') && (name.includes('leg') || name.includes('gamb'))) return this.exerciseDB.leg_curl;
        if (name.includes('curl') || name.includes('bicipiti') || name.includes('bicep')) return this.exerciseDB.bicep_curl;
        
        // EXTENSION variants  
        if ((name.includes('extension') || name.includes('estensioni')) && (name.includes('leg') || name.includes('gamb'))) return this.exerciseDB.leg_extension;
        if ((name.includes('extension') || name.includes('estension')) && (name.includes('overhead') || name.includes('tricep') || name.includes('tricip'))) return this.exerciseDB.overhead_extension;
        
        // PUSHDOWN
        if (name.includes('pushdown') || name.includes('push down') || name.includes('spinta') && name.includes('cav')) return this.exerciseDB.tricep_pushdown;
        
        // CORE
        if (name.includes('plank')) return this.exerciseDB.plank;
        if (name.includes('pallof')) return this.exerciseDB.plank;
        if (name.includes('russian') && name.includes('twist')) return this.exerciseDB.russian_twist;
        if (name.includes('crunch') || name.includes('addominali')) return this.exerciseDB.crunch;
        
        // JUMPS
        if (name.includes('box') && name.includes('jump')) return this.exerciseDB.box_jump;
        if (name.includes('jump') || name.includes('salto')) return this.exerciseDB.box_jump;
        if (name.includes('depth')) return this.exerciseDB.depth_jump;
        
        // LUNGES / AFFONDI
        if (name.includes('lunge') || name.includes('affond') || name.includes('split')) return this.exerciseDB.bulgarian_split_squat;
        
        // HIP THRUST
        if (name.includes('thrust') || name.includes('bridge') || name.includes('ponte')) return this.exerciseDB.hip_thrust;
        
        // CALVES
        if (name.includes('calf') || name.includes('polpacci') || name.includes('polpaccio')) return this.exerciseDB.calf_raise;
        
        // DIPS
        if (name.includes('dip') || name.includes('parallele')) return this.exerciseDB.dips;
        
        // FLY / CROCI
        if (name.includes('fly') || name.includes('croci') || name.includes('crossover') || name.includes('pec deck')) return this.exerciseDB.dumbbell_fly;
        
        // PULLOVER
        if (name.includes('pullover')) return this.exerciseDB.pullover;
        
        // FACE PULL
        if (name.includes('face') && name.includes('pull')) return this.exerciseDB.face_pull;
        
        // LATERAL RAISE / ALZATE LATERALI
        if ((name.includes('lateral') && name.includes('raise')) || name.includes('alzate laterali')) return this.exerciseDB.lateral_raise;
        
        // SKULL CRUSHER
        if (name.includes('skull') || name.includes('crusher') || name.includes('french press')) return this.exerciseDB.skull_crusher;
        
        // GOOD MORNING
        if (name.includes('good') && name.includes('morning')) return this.exerciseDB.good_morning;
        
        // AB WHEEL
        if (name.includes('ab') && name.includes('wheel')) return this.exerciseDB.ab_wheel;
        
        return null;
    },
    
    parseReps(repsStr) {
        if (typeof repsStr === 'number') return repsStr;
        const str = String(repsStr || '').toLowerCase();
        
        // Handle AMRAP
        if (str.includes('amrap') || str.includes('max') || str.includes('failure')) {
            return 12; // stima conservativa per AMRAP
        }
        
        // Handle ranges like "8-12"
        const match = str.match(/(\d+)(?:\s*-\s*(\d+))?/);
        if (match) {
            const min = parseInt(match[1]);
            const max = match[2] ? parseInt(match[2]) : min;
            return Math.round((min + max) / 2);
        }
        
        // Handle time-based like "30s"
        if (str.includes('s') || str.includes('sec')) {
            const seconds = parseInt(str) || 30;
            return Math.round(seconds / 3); // ~3 sec per "rep" equivalent
        }
        
        // Handle minutes
        if (str.includes('min')) {
            return 20; // warmup/cooldown equivalent
        }
        
        return parseInt(str) || 10; // default 10 reps
    },
    
    /**
     * Analisi completa scientifica del workout
     */
    fullAnalysis(workout, profile = {}) {
        const results = {
            lengthVsShortened: this.analyzeLengthVsShortened(workout),
            fiberTypeMatch: this.analyzeFiberTypeMatch(workout, profile),
            eccentricEmphasis: this.analyzeEccentricEmphasis(workout),
            timeUnderTension: this.analyzeTimeUnderTension(workout),
            agonistAntagonist: this.analyzeAgonistAntagonist(workout),
            sraCompliance: this.analyzeSRACompliance(workout, profile)
        };
        
        // Calcola score complessivo pesato
        const weights = {
            lengthVsShortened: 0.20,  // 20%
            fiberTypeMatch: 0.15,      // 15%
            eccentricEmphasis: 0.10,   // 10%
            timeUnderTension: 0.15,    // 15%
            agonistAntagonist: 0.20,   // 20%
            sraCompliance: 0.20        // 20%
        };
        
        let totalScore = 0;
        for (const [key, result] of Object.entries(results)) {
            totalScore += result.score * weights[key];
        }
        
        return {
            score: Math.round(totalScore),
            results,
            allFindings: Object.values(results).flatMap(r => r.findings || [])
        };
    }
};

console.log('🧬 ATLAS Science Module loaded!');
console.log('   → ATLASScience.fullAnalysis(workout, profile) - Complete scientific analysis');
console.log('   → ATLASScience.analyzeLengthVsShortened(workout) - ROM position analysis');
console.log('   → ATLASScience.analyzeFiberTypeMatch(workout, profile) - Fiber type optimization');
