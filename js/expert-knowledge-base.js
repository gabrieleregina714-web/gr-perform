/**
 * GR Perform - Expert Knowledge Base v1.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * IL CERVELLO DEL SISTEMA: Conoscenze di un coach esperto multi-disciplinare
 * 
 * Questo modulo contiene:
 * 1. SPORT EXPERTISE - Conoscenze specifiche per ogni sport
 * 2. METHODOLOGY MASTERY - Quando e come applicare ogni metodologia
 * 3. PROFILE-BASED REASONING - Ragionamento basato sul profilo atleta
 * 4. DECISION RULES - Regole di decisione "da coach esperto"
 * 5. CONTRAINDICATIONS - Cosa NON fare e perché
 * 6. PERIODIZATION INTELLIGENCE - Periodizzazione avanzata
 * 7. INJURY PREVENTION WISDOM - Prevenzione infortuni
 * 8. ADAPTATION LOGIC - Logica di adattamento real-time
 * 
 * Filosofia: "Non basta sapere COSA fare, bisogna sapere PERCHÉ"
 */

window.ExpertKnowledgeBase = (function() {
    'use strict';

    const VERSION = '1.0';
    const NAME = 'ExpertKnowledgeBase';

    // ═══════════════════════════════════════════════════════════════════════════
    // 1. SPORT EXPERTISE - Conoscenze specifiche per sport
    // ═══════════════════════════════════════════════════════════════════════════

    const SPORT_EXPERTISE = {
        boxe: {
            name: 'Boxe / Pugilato',
            category: 'combat_sport',
            
            // PRINCIPI FONDAMENTALI
            principles: [
                'La potenza viene dalle gambe e dal core, non dalle braccia',
                'Il conditioning deve simulare i round (3min work, 1min rest)',
                'La forza deve essere esplosiva, non massimale statica',
                'La mobilità delle spalle è critica per la guardia e i colpi',
                'Il collo va allenato sempre per prevenire KO',
                'Mai DOMS prima di sparring o match',
                'La tecnica si allena fresco, il conditioning da stanchi'
            ],
            
            // RICHIESTE FISIOLOGICHE
            physiologicalDemands: {
                energySystems: { 
                    alactic: 0.3,      // Esplosività punch
                    lactic: 0.5,       // Round sostenuti
                    aerobic: 0.2       // Recovery tra round
                },
                muscleGroups: {
                    primary: ['core', 'shoulders', 'legs', 'back'],
                    secondary: ['chest', 'triceps', 'forearms'],
                    stabilizers: ['rotator_cuff', 'neck', 'hip_flexors']
                },
                movementPatterns: ['rotation', 'anti_rotation', 'hip_hinge', 'push', 'locomotion'],
                injuryRiskAreas: ['shoulder', 'wrist', 'lower_back', 'neck', 'hands']
            },
            
            // STRUTTURA SESSIONE IDEALE
            sessionStructure: {
                warmup: {
                    duration: '10-15min',
                    components: ['joint_mobility', 'dynamic_stretching', 'shadow_light', 'activation'],
                    mandatory: ['shoulder_mobility', 'hip_mobility', 'core_activation']
                },
                mainWork: {
                    order: ['technique_fresh', 'strength', 'conditioning', 'boxing_specific'],
                    rationale: 'Tecnica quando SNC è fresco, forza prima del conditioning, boxing alla fine'
                },
                cooldown: {
                    duration: '5-10min',
                    components: ['static_stretching', 'neck_work', 'breathing']
                }
            },
            
            // REGOLE NON NEGOZIABILI
            nonNegotiableRules: [
                { rule: 'Neck training every session', reason: 'Prevenzione concussioni', enforcement: 'BLOCKING' },
                { rule: 'No heavy lower 48h before sparring', reason: 'DOMS compromette footwork', enforcement: 'BLOCKING' },
                { rule: 'Strength before conditioning', reason: 'SNC fresco per qualità forza', enforcement: 'BLOCKING' },
                { rule: 'Round-based conditioning', reason: 'Specificità metabolica', enforcement: 'WARNING' },
                { rule: 'Shoulder prehab ogni sessione', reason: 'Prevenzione rotator cuff', enforcement: 'WARNING' }
            ],
            
            // PERIODIZZAZIONE SPECIFICA
            periodization: {
                offSeason: {
                    focus: ['base_strength', 'hypertrophy', 'aerobic_base'],
                    volume: 'high', intensity: 'moderate',
                    strengthRatio: 0.6, conditioningRatio: 0.3, skillRatio: 0.1
                },
                preContest: {
                    focus: ['power', 'fight_simulation', 'weight_management'],
                    volume: 'moderate', intensity: 'high',
                    strengthRatio: 0.3, conditioningRatio: 0.4, skillRatio: 0.3
                },
                fightWeek: {
                    focus: ['activation', 'weight_cut', 'mental_prep'],
                    volume: 'minimal', intensity: 'low',
                    strengthRatio: 0.1, conditioningRatio: 0.1, skillRatio: 0.2,
                    notes: 'Solo attivazione leggera, focus su peso e recupero'
                },
                postFight: {
                    focus: ['recovery', 'assessment', 'light_movement'],
                    volume: 'minimal', intensity: 'minimal',
                    notes: 'Almeno 1 settimana di recupero attivo'
                }
            },
            
            // METODOLOGIE PREFERITE
            preferredMethods: {
                strength: ['cluster_set', 'contrast_training', 'explosive_lifts'],
                conditioning: ['boxing_circuit', 'heavy_bag_intervals', 'emom', 'tabata'],
                power: ['med_ball_throws', 'plyo_pushups', 'jump_training'],
                prehab: ['shoulder_stability', 'core_anti_rotation', 'neck_strengthening']
            },
            
            // ERRORI COMUNI DA EVITARE
            commonMistakes: [
                { mistake: 'Troppo lavoro braccia/bicipiti', correction: 'Focus su gambe, core, schiena' },
                { mistake: 'Forza massimale statica', correction: 'Forza esplosiva e potenza' },
                { mistake: 'Cardio steady-state', correction: 'Interval training round-based' },
                { mistake: 'Ignorare il collo', correction: 'Neck work 3x15 ogni sessione' },
                { mistake: 'Heavy day prima sparring', correction: 'Min 48h di distanza' }
            ]
        },

        calcio: {
            name: 'Calcio / Football',
            category: 'team_sport',
            
            principles: [
                'Il calcio è uno sport intermittente ad alta intensità',
                'La prevenzione hamstring/groin è prioritaria',
                'Il carico da allenamento squadra va sempre considerato',
                'Match-day proximity determina tutto il planning',
                'La forza serve ma non deve interferire con la performance tecnica',
                'Evitare DOMS nei giorni vicini alla partita',
                'Il conditioning specifico viene dalla pratica del calcio stesso'
            ],
            
            physiologicalDemands: {
                energySystems: {
                    alactic: 0.25,     // Sprint, salti, tiri
                    lactic: 0.35,      // Repeated high-intensity
                    aerobic: 0.40      // Recupero, durata partita
                },
                muscleGroups: {
                    primary: ['quads', 'hamstrings', 'glutes', 'calves'],
                    secondary: ['core', 'hip_flexors', 'adductors'],
                    stabilizers: ['ankle', 'knee_stabilizers']
                },
                movementPatterns: ['sprint', 'deceleration', 'cutting', 'kicking', 'jumping'],
                injuryRiskAreas: ['hamstring', 'groin', 'ankle', 'knee_acl', 'hip_flexor']
            },
            
            sessionStructure: {
                warmup: {
                    duration: '12-15min',
                    components: ['fifa_11_warmup', 'dynamic_movement', 'activation'],
                    mandatory: ['hip_mobility', 'hamstring_activation', 'ankle_prep']
                },
                mainWork: {
                    order: ['speed_power', 'strength', 'prevention', 'conditioning'],
                    rationale: 'Velocità e potenza quando freschi, prevenzione sempre inclusa'
                },
                cooldown: {
                    duration: '5-10min',
                    components: ['static_stretching', 'hip_flexor_stretch', 'foam_rolling']
                }
            },
            
            // MATCH-DAY MANAGEMENT
            matchDayManagement: {
                'MD-4': { volume: 'high', intensity: 'moderate', focus: 'strength' },
                'MD-3': { volume: 'moderate', intensity: 'high', focus: 'power/speed' },
                'MD-2': { volume: 'low', intensity: 'moderate', focus: 'activation' },
                'MD-1': { volume: 'minimal', intensity: 'low', focus: 'priming' },
                'MD': { volume: 'none', intensity: 'none', focus: 'match' },
                'MD+1': { volume: 'minimal', intensity: 'minimal', focus: 'recovery' },
                'MD+2': { volume: 'low', intensity: 'low', focus: 'regeneration' }
            },
            
            nonNegotiableRules: [
                { rule: 'Nordic/Copenhagen ogni settimana', reason: 'Prevenzione hamstring/groin', enforcement: 'BLOCKING' },
                { rule: 'No heavy lower MD-1 o MD-2', reason: 'Evita DOMS e interferenza', enforcement: 'BLOCKING' },
                { rule: 'Considera carico squadra', reason: 'Evita overtraining', enforcement: 'WARNING' },
                { rule: 'Sprint training quando fresco', reason: 'Qualità > quantità', enforcement: 'WARNING' }
            ],
            
            preferredMethods: {
                strength: ['trap_bar_deadlift', 'bulgarian_split_squat', 'hip_thrust'],
                power: ['jump_training', 'sprint_training', 'med_ball'],
                prevention: ['nordic_hamstring', 'copenhagen_adductor', 'fifa_11'],
                conditioning: ['repeated_sprint_ability', 'small_sided_games']
            },
            
            roleSpecificAdjustments: {
                goalkeeper: {
                    focus: ['power', 'reaction', 'dive_mechanics'],
                    avoidMethods: ['high_volume_running'],
                    notes: 'Focus su esplosività laterale e diving'
                },
                defender: {
                    focus: ['strength', 'aerial_power', 'deceleration'],
                    notes: 'Attenzione a contrasti e duelli aerei'
                },
                midfielder: {
                    focus: ['endurance', 'repeated_sprint', 'agility'],
                    notes: 'Volume running alto, recupero fondamentale'
                },
                forward: {
                    focus: ['speed', 'power', 'finishing'],
                    notes: 'Sprint quality > quantity'
                }
            }
        },

        basket: {
            name: 'Basket / Basketball',
            category: 'team_sport',
            
            principles: [
                'Il basket è dominato da salti e atterraggi',
                'La prevenzione caviglia/ginocchio è critica',
                'Velocità laterale e cambio di direzione sono fondamentali',
                'La forza deve essere trasferita in potenza verticale',
                'Il conditioning deve essere intermittente',
                'Attenzione al volume totale di salti settimanali'
            ],
            
            physiologicalDemands: {
                energySystems: {
                    alactic: 0.35,     // Salti, sprint corti
                    lactic: 0.35,      // Azioni prolungate
                    aerobic: 0.30      // Recupero
                },
                muscleGroups: {
                    primary: ['quads', 'glutes', 'calves', 'core'],
                    secondary: ['hamstrings', 'shoulders', 'back'],
                    stabilizers: ['ankle', 'knee', 'hip']
                },
                movementPatterns: ['jumping', 'landing', 'lateral_movement', 'cutting', 'reaching'],
                injuryRiskAreas: ['ankle', 'knee_acl', 'patellar_tendon', 'lower_back']
            },
            
            sessionStructure: {
                warmup: {
                    duration: '10-12min',
                    components: ['dynamic_mobility', 'activation', 'landing_prep'],
                    mandatory: ['ankle_stability', 'hip_mobility', 'core_activation']
                },
                mainWork: {
                    order: ['jump_power', 'strength', 'lateral_movement', 'conditioning'],
                    rationale: 'Salti da fresco, forza nel mezzo, conditioning alla fine'
                },
                cooldown: {
                    duration: '5-8min',
                    components: ['static_stretching', 'hip_flexor', 'ankle_mobility']
                }
            },
            
            nonNegotiableRules: [
                { rule: 'Landing mechanics training', reason: 'Prevenzione ACL/caviglia', enforcement: 'BLOCKING' },
                { rule: 'Track weekly jump volume', reason: 'Evita overuse patellar tendon', enforcement: 'WARNING' },
                { rule: 'Lateral movement ogni sessione', reason: 'Specificità sport', enforcement: 'WARNING' },
                { rule: 'No heavy plyo day before game', reason: 'Evita affaticamento neurale', enforcement: 'BLOCKING' }
            ],
            
            preferredMethods: {
                strength: ['front_squat', 'trap_bar_deadlift', 'single_leg_work'],
                power: ['vertical_jump_training', 'approach_jumps', 'drop_jumps'],
                lateral: ['defensive_slides', 'lane_agility', 'cutting_drills'],
                prevention: ['ankle_stability', 'landing_mechanics', 'core_stability']
            },
            
            roleSpecificAdjustments: {
                point_guard: {
                    focus: ['speed', 'agility', 'court_vision_drills'],
                    notes: 'Agilità e cambio direzione prioritari'
                },
                shooting_guard: {
                    focus: ['vertical', 'lateral', 'conditioning'],
                    notes: 'Balance tra esplosività e resistenza'
                },
                small_forward: {
                    focus: ['all_around', 'versatility'],
                    notes: 'Lavoro completo su tutte le qualità'
                },
                power_forward: {
                    focus: ['strength', 'power', 'rebounding'],
                    notes: 'Forza e potenza prioritarie'
                },
                center: {
                    focus: ['strength', 'power', 'post_moves'],
                    notes: 'Forza massimale importante, meno conditioning'
                }
            }
        },

        palestra: {
            name: 'Fitness / Strength Training',
            category: 'individual_training',
            
            principles: [
                'La progressione graduale è la chiave del successo',
                'La tecnica viene prima del carico',
                'Il recupero è parte dell\'allenamento',
                'La varietà deve servire uno scopo, non essere fine a se stessa',
                'I compound movements sono la base',
                'L\'RPE guida l\'autoregolazione',
                'La consistenza batte l\'intensità occasionale'
            ],
            
            physiologicalDemands: {
                energySystems: {
                    alactic: 0.40,     // Set pesanti
                    lactic: 0.35,      // Set moderati, finishers
                    aerobic: 0.25      // Recupero
                },
                muscleGroups: {
                    primary: 'all',
                    focus: ['movement_patterns_balance']
                },
                movementPatterns: ['squat', 'hinge', 'push', 'pull', 'carry', 'rotation'],
                injuryRiskAreas: ['lower_back', 'shoulder', 'knee']
            },
            
            sessionStructure: {
                warmup: {
                    duration: '5-10min',
                    components: ['general_warmup', 'specific_activation', 'warmup_sets'],
                    mandatory: ['movement_specific_prep']
                },
                mainWork: {
                    order: ['compound_heavy', 'compound_moderate', 'accessory', 'isolation'],
                    rationale: 'Compound pesanti quando freschi, isolation alla fine'
                },
                cooldown: {
                    duration: '3-5min',
                    components: ['static_stretching', 'breathing']
                }
            },
            
            goalSpecificApproach: {
                hypertrophy: {
                    repRange: '8-12',
                    rest: '60-90s',
                    methods: ['drop_set', 'superset', 'myo_reps', 'tempo_training'],
                    volumeFocus: 'high',
                    notes: 'Volume è il driver principale'
                },
                strength: {
                    repRange: '3-6',
                    rest: '180-300s',
                    methods: ['cluster_set', 'progressive_overload', 'wave_loading'],
                    intensityFocus: 'high',
                    notes: 'Intensità è il driver principale'
                },
                fat_loss: {
                    repRange: '12-20',
                    rest: '30-60s',
                    methods: ['circuit', 'superset', 'emom', 'tabata'],
                    densityFocus: 'high',
                    notes: 'Densità e dispendio calorico'
                },
                general_fitness: {
                    repRange: '8-15',
                    rest: '60-120s',
                    methods: ['superset', 'circuit', 'progressive_overload'],
                    balanceFocus: 'high',
                    notes: 'Bilanciamento di tutte le qualità'
                }
            },
            
            splitOptions: {
                full_body: {
                    frequency: '3-4x/week',
                    bestFor: ['beginner', 'time_limited', 'general_fitness'],
                    structure: ['compound_push', 'compound_pull', 'compound_legs', 'core']
                },
                upper_lower: {
                    frequency: '4x/week',
                    bestFor: ['intermediate', 'hypertrophy', 'strength'],
                    structure: ['upper_day', 'lower_day', 'upper_day', 'lower_day']
                },
                push_pull_legs: {
                    frequency: '6x/week',
                    bestFor: ['advanced', 'hypertrophy', 'high_volume'],
                    structure: ['push', 'pull', 'legs', 'push', 'pull', 'legs']
                },
                bro_split: {
                    frequency: '5-6x/week',
                    bestFor: ['bodybuilding', 'advanced', 'isolation_focus'],
                    structure: ['chest', 'back', 'shoulders', 'legs', 'arms']
                }
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. METHODOLOGY MASTERY - Quando e come applicare ogni metodologia
    // ═══════════════════════════════════════════════════════════════════════════

    const METHODOLOGY_MASTERY = {
        // QUANDO USARE OGNI METODOLOGIA
        applicationRules: {
            drop_set: {
                when: ['accumulo', 'hypertrophy_focus', 'pump_needed', 'time_limited'],
                avoid: ['deload', 'strength_focus', 'high_fatigue', 'beginner'],
                bestAfter: 'main_compound',
                position: 'end_of_exercise',
                maxPerWorkout: 2,
                reasoning: 'Massimizza stress metabolico senza compromettere tecnica dei compound'
            },
            superset: {
                when: ['always_ok', 'time_limited', 'pump_focus', 'conditioning'],
                avoid: ['max_strength_day', 'technique_learning'],
                bestFor: ['antagonist_pairs', 'isolation_exercises'],
                position: 'mid_workout',
                maxPerWorkout: 4,
                reasoning: 'Efficienza tempo e pump senza sacrificare qualità'
            },
            cluster_set: {
                when: ['intensificazione', 'peaking', 'power_focus', 'strength_plateau'],
                avoid: ['beginner', 'fatigue_high', 'accumulo', 'time_limited'],
                bestFor: ['main_compound_only'],
                position: 'start_workout',
                maxPerWorkout: 2,
                reasoning: 'Mantiene qualità con carichi alti grazie alle micro-pause'
            },
            contrast_training: {
                when: ['power_phase', 'sport_specific', 'fresh_cns'],
                avoid: ['fatigue_high', 'beginner', 'time_limited', 'accumulo'],
                bestFor: ['lower_body_power', 'upper_body_power'],
                position: 'start_workout',
                maxPerWorkout: 2,
                reasoning: 'PAP (Post-Activation Potentiation) richiede SNC fresco'
            },
            emom: {
                when: ['conditioning', 'technique_drilling', 'work_capacity'],
                avoid: ['max_strength', 'high_fatigue'],
                bestFor: ['compound_movements', 'sport_specific'],
                position: 'end_workout',
                maxPerWorkout: 1,
                reasoning: 'Build work capacity mantenendo qualità tecnica'
            },
            tabata: {
                when: ['conditioning_finisher', 'fat_loss', 'sport_specific'],
                avoid: ['strength_day', 'recovery_day', 'beginner'],
                bestFor: ['bodyweight', 'cardio_machines', 'simple_movements'],
                position: 'end_workout',
                maxPerWorkout: 1,
                reasoning: 'Massimo stress metabolico in minimo tempo'
            },
            myo_reps: {
                when: ['time_limited', 'isolation_work', 'hypertrophy'],
                avoid: ['compound_heavy', 'beginner'],
                bestFor: ['biceps', 'triceps', 'calves', 'rear_delts'],
                position: 'end_exercise',
                maxPerWorkout: 3,
                reasoning: 'Accumula volume efficacemente su isolation'
            },
            rest_pause: {
                when: ['strength_plateau', 'intensity_focus', 'advanced'],
                avoid: ['beginner', 'fatigue_high', 'accumulo'],
                bestFor: ['compound_upper', 'compound_lower'],
                position: 'main_lift',
                maxPerWorkout: 2,
                reasoning: 'Supera plateau con stress meccanico elevato'
            },
            tempo_training: {
                when: ['technique_learning', 'hypertrophy', 'mind_muscle'],
                avoid: ['power_focus', 'sport_specific'],
                bestFor: ['all_exercises'],
                position: 'any',
                maxPerWorkout: 'unlimited',
                reasoning: 'Aumenta time under tension e controllo'
            }
        },

        // COMBINAZIONI VIETATE (con reasoning)
        forbiddenCombinations: [
            {
                combo: ['drop_set', 'gvt'],
                reason: 'Entrambi ad alto stress metabolico - overtraining garantito'
            },
            {
                combo: ['rest_pause', 'myo_reps'],
                reason: 'Entrambi a cedimento - SNC non recupera'
            },
            {
                combo: ['tabata', 'rsa'],
                reason: 'Due protocolli HIIT - troppo stress cardiovascolare'
            },
            {
                combo: ['cluster_set', 'circuit'],
                reason: 'Cluster richiede SNC fresco, circuit lo affatica'
            },
            {
                combo: ['contrast_training', 'emom'],
                reason: 'Contrast richiede recupero completo, EMOM lo nega'
            }
        ],

        // SEQUENZA OTTIMALE
        optimalSequence: [
            { phase: 'warmup', methods: ['dynamic_mobility', 'activation'] },
            { phase: 'neural', methods: ['contrast_training', 'cluster_set', 'plyo'] },
            { phase: 'strength', methods: ['progressive_overload', 'wave_loading', 'rest_pause'] },
            { phase: 'hypertrophy', methods: ['superset', 'tempo_training', 'drop_set'] },
            { phase: 'isolation', methods: ['myo_reps', 'drop_set', 'superset'] },
            { phase: 'conditioning', methods: ['circuit', 'emom', 'tabata'] },
            { phase: 'cooldown', methods: ['stretching', 'breathing'] }
        ]
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. PROFILE-BASED REASONING - Ragionamento basato sul profilo
    // ═══════════════════════════════════════════════════════════════════════════

    const PROFILE_REASONING = {
        // LIVELLO ESPERIENZA
        experienceLevel: {
            beginner: {
                maxMethods: 2,
                allowedMethods: ['superset_antagonist', 'tempo_training', 'progressive_overload'],
                forbiddenMethods: ['cluster_set', 'rest_pause', 'gvt', 'drop_set'],
                maxRpe: 7,
                volumeMultiplier: 0.7,
                intensityMultiplier: 0.7,
                focusAreas: ['technique', 'habit_building', 'base_conditioning'],
                reasoning: 'Priorità: costruire pattern motori corretti e abitudine all\'allenamento'
            },
            intermediate: {
                maxMethods: 3,
                allowedMethods: 'most',
                forbiddenMethods: ['advanced_cluster', 'max_effort'],
                maxRpe: 8.5,
                volumeMultiplier: 1.0,
                intensityMultiplier: 1.0,
                focusAreas: ['progressive_overload', 'specificity', 'periodization'],
                reasoning: 'Può gestire metodi avanzati con supervisione'
            },
            advanced: {
                maxMethods: 4,
                allowedMethods: 'all',
                forbiddenMethods: [],
                maxRpe: 10,
                volumeMultiplier: 1.2,
                intensityMultiplier: 1.1,
                focusAreas: ['specificity', 'peaking', 'weakness_targeting'],
                reasoning: 'Pieno accesso a tutti i metodi, auto-regolazione attesa'
            }
        },

        // ETÀ
        ageConsiderations: {
            youth: {   // <18
                focus: ['technique', 'fun', 'variety', 'general_athleticism'],
                avoid: ['max_effort', 'high_volume', 'isolation_heavy'],
                recovery: 'fast',
                reasoning: 'Sistema in sviluppo - evitare stress eccessivi'
            },
            prime: {   // 18-35
                focus: ['performance', 'specificity', 'progressive_overload'],
                avoid: [],
                recovery: 'normal',
                reasoning: 'Finestra ottimale per adattamenti'
            },
            master: {  // 35-50
                focus: ['mobility', 'joint_health', 'smart_loading'],
                avoid: ['extreme_plyometrics', 'max_effort_frequent'],
                recovery: 'slower',
                warmupMultiplier: 1.3,
                reasoning: 'Recupero più lento, focus su longevità'
            },
            senior: {  // 50+
                focus: ['mobility', 'functional_strength', 'balance', 'bone_health'],
                avoid: ['plyometrics', 'max_effort', 'high_impact'],
                recovery: 'slow',
                warmupMultiplier: 1.5,
                intensityMultiplier: 0.8,
                reasoning: 'Priorità: qualità di vita e prevenzione'
            }
        },

        // STORIA INFORTUNI
        injuryHistory: {
            shoulderIssues: {
                avoidMovements: ['behind_neck_press', 'upright_row', 'deep_dips'],
                modifyMovements: { 'bench_press': 'floor_press', 'overhead_press': 'landmine_press' },
                mandatoryPrehab: ['rotator_cuff', 'scapular_stability'],
                reasoning: 'Proteggere la cuffia dei rotatori'
            },
            lowerBackIssues: {
                avoidMovements: ['conventional_deadlift', 'good_morning', 'situps'],
                modifyMovements: { 'deadlift': 'trap_bar_deadlift', 'back_squat': 'front_squat' },
                mandatoryPrehab: ['mcgill_big_3', 'hip_mobility'],
                reasoning: 'Ridurre stress su colonna lombare'
            },
            kneeIssues: {
                avoidMovements: ['deep_squat', 'leg_extension_heavy', 'jumping_heavy'],
                modifyMovements: { 'squat': 'box_squat', 'lunges': 'step_ups' },
                mandatoryPrehab: ['vmo_activation', 'hip_strengthening'],
                reasoning: 'Proteggere articolazione del ginocchio'
            },
            ankleIssues: {
                avoidMovements: ['jumping', 'sprinting_max', 'calf_raise_heavy'],
                modifyMovements: { 'squat': 'heel_elevated_squat' },
                mandatoryPrehab: ['ankle_mobility', 'proprioception'],
                reasoning: 'Migliorare stabilità e mobilità caviglia'
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. DECISION RULES - Regole di decisione "da coach esperto"
    // ═══════════════════════════════════════════════════════════════════════════

    const DECISION_RULES = {
        // REGOLE IF-THEN per decisioni automatiche
        automaticDecisions: [
            {
                condition: 'ACWR > 1.5',
                decision: 'DELOAD_MANDATORY',
                reasoning: 'Rischio infortunio troppo alto, deload obbligatorio',
                override: false
            },
            {
                condition: 'daysToMatch === 1',
                decision: 'ACTIVATION_ONLY',
                reasoning: 'Giorno pre-gara: solo attivazione leggera',
                override: false
            },
            {
                condition: 'daysToMatch === 0',
                decision: 'REST_OR_PRIMER',
                reasoning: 'Match day: riposo o micro-primer 10min',
                override: false
            },
            {
                condition: 'sleepHours < 5',
                decision: 'REDUCE_INTENSITY_50',
                reasoning: 'Sonno critico: dimezza intensità o riposa',
                override: true
            },
            {
                condition: 'readiness < 40',
                decision: 'ACTIVE_RECOVERY',
                reasoning: 'Readiness troppo basso per sessione produttiva',
                override: true
            },
            {
                condition: 'activeInjury === true',
                decision: 'AVOID_AFFECTED_AREA',
                reasoning: 'Infortunio attivo: evita completamente la zona',
                override: false
            },
            {
                condition: 'compliance < 60 && weeksConsecutive >= 2',
                decision: 'REDUCE_VOLUME_30',
                reasoning: 'Bassa aderenza prolungata indica programma troppo impegnativo',
                override: true
            }
        ],

        // REGOLE DI PRIORITÀ
        priorityRules: [
            { priority: 1, rule: 'Safety first - mai compromettere la salute' },
            { priority: 2, rule: 'Specificity - allenamento deve trasferirsi allo sport' },
            { priority: 3, rule: 'Progressive overload - sempre progredire nel tempo' },
            { priority: 4, rule: 'Recovery - senza recupero non c\'è adattamento' },
            { priority: 5, rule: 'Enjoyment - l\'atleta deve poter aderire al programma' }
        ],

        // LOGICA DI ESCALATION
        escalationLogic: {
            level1: {
                trigger: 'single_warning',
                action: 'log_and_suggest',
                notify: false
            },
            level2: {
                trigger: 'multiple_warnings_or_single_blocking',
                action: 'modify_workout_automatically',
                notify: 'in_app'
            },
            level3: {
                trigger: 'critical_issue',
                action: 'block_workout_generation',
                notify: 'coach_alert'
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    function getSportExpertise(sport) {
        const key = String(sport || '').toLowerCase().trim();
        if (key === 'boxing') return SPORT_EXPERTISE.boxe;
        if (key === 'football' || key === 'soccer') return SPORT_EXPERTISE.calcio;
        if (key === 'basketball') return SPORT_EXPERTISE.basket;
        if (key === 'fitness' || key === 'gym' || key === 'strength') return SPORT_EXPERTISE.palestra;
        return SPORT_EXPERTISE[key] || SPORT_EXPERTISE.palestra;
    }

    function getMethodologyRules(methodId) {
        return METHODOLOGY_MASTERY.applicationRules[methodId] || null;
    }

    function getProfileAdjustments(profile) {
        const adjustments = {};
        
        // Experience level
        const expLevel = String(profile.experience_level || 'intermediate').toLowerCase();
        adjustments.experience = PROFILE_REASONING.experienceLevel[expLevel] || 
                                  PROFILE_REASONING.experienceLevel.intermediate;
        
        // Age
        const age = parseInt(profile.age) || 30;
        if (age < 18) adjustments.age = PROFILE_REASONING.ageConsiderations.youth;
        else if (age < 35) adjustments.age = PROFILE_REASONING.ageConsiderations.prime;
        else if (age < 50) adjustments.age = PROFILE_REASONING.ageConsiderations.master;
        else adjustments.age = PROFILE_REASONING.ageConsiderations.senior;
        
        // Injuries
        adjustments.injuries = [];
        const injuries = profile.injuries || profile.painAreas || [];
        injuries.forEach(inj => {
            const area = String(inj.location || inj).toLowerCase();
            if (area.includes('shoulder')) adjustments.injuries.push(PROFILE_REASONING.injuryHistory.shoulderIssues);
            if (area.includes('back') || area.includes('lumbar')) adjustments.injuries.push(PROFILE_REASONING.injuryHistory.lowerBackIssues);
            if (area.includes('knee')) adjustments.injuries.push(PROFILE_REASONING.injuryHistory.kneeIssues);
            if (area.includes('ankle')) adjustments.injuries.push(PROFILE_REASONING.injuryHistory.ankleIssues);
        });
        
        return adjustments;
    }

    function evaluateDecisionRules(context) {
        const triggeredRules = [];
        
        DECISION_RULES.automaticDecisions.forEach(rule => {
            let triggered = false;
            
            // Evaluate condition
            if (rule.condition === 'ACWR > 1.5' && (context.acwr > 1.5)) triggered = true;
            if (rule.condition === 'daysToMatch === 1' && context.daysToMatch === 1) triggered = true;
            if (rule.condition === 'daysToMatch === 0' && context.daysToMatch === 0) triggered = true;
            if (rule.condition === 'sleepHours < 5' && (context.sleepHours < 5)) triggered = true;
            if (rule.condition === 'readiness < 40' && (context.readiness < 40)) triggered = true;
            if (rule.condition === 'activeInjury === true' && context.activeInjury) triggered = true;
            
            if (triggered) {
                triggeredRules.push({
                    decision: rule.decision,
                    reasoning: rule.reasoning,
                    override: rule.override
                });
            }
        });
        
        return triggeredRules;
    }

    function shouldApplyMethod(methodId, context) {
        const rules = getMethodologyRules(methodId);
        if (!rules) return { apply: true, reason: 'No rules found' };
        
        // Check WHEN conditions
        const phase = String(context.phase || '').toLowerCase();
        const fatigue = context.fatigue || 'normal';
        const level = String(context.experienceLevel || 'intermediate').toLowerCase();
        
        // Check AVOID conditions
        if (rules.avoid.includes(phase)) {
            return { apply: false, reason: `${methodId} non adatto per fase ${phase}` };
        }
        if (rules.avoid.includes('beginner') && level === 'beginner') {
            return { apply: false, reason: `${methodId} troppo avanzato per principianti` };
        }
        if (rules.avoid.includes('high_fatigue') && fatigue === 'high') {
            return { apply: false, reason: `${methodId} sconsigliato con fatica alta` };
        }
        
        return { apply: true, reason: rules.reasoning };
    }

    function buildExpertPrompt(sport, profile, context) {
        const expertise = getSportExpertise(sport);
        const adjustments = getProfileAdjustments(profile);
        const triggeredRules = evaluateDecisionRules(context);
        
        let prompt = `\n═══ EXPERT KNOWLEDGE BASE ═══\n`;
        
        // Sport expertise
        prompt += `\n🏆 SPORT: ${expertise.name}\n`;
        prompt += `PRINCIPI FONDAMENTALI:\n`;
        expertise.principles.forEach(p => prompt += `• ${p}\n`);
        
        // Non-negotiable rules
        prompt += `\n⚠️ REGOLE NON NEGOZIABILI:\n`;
        expertise.nonNegotiableRules.forEach(r => {
            prompt += `• ${r.rule} (${r.enforcement}) - ${r.reason}\n`;
        });
        
        // Profile adjustments
        prompt += `\n👤 PROFILO ATLETA:\n`;
        prompt += `• Livello: ${adjustments.experience.focusAreas.join(', ')}\n`;
        prompt += `• Max RPE: ${adjustments.experience.maxRpe}\n`;
        prompt += `• Metodi vietati: ${adjustments.experience.forbiddenMethods.join(', ') || 'nessuno'}\n`;
        
        // Triggered decision rules
        if (triggeredRules.length > 0) {
            prompt += `\n🚨 REGOLE ATTIVATE:\n`;
            triggeredRules.forEach(r => {
                prompt += `• ${r.decision}: ${r.reasoning}\n`;
            });
        }
        
        // Session structure
        prompt += `\n📋 STRUTTURA SESSIONE IDEALE:\n`;
        prompt += `• Warm-up: ${expertise.sessionStructure.warmup.duration} - ${expertise.sessionStructure.warmup.mandatory.join(', ')}\n`;
        prompt += `• Main: ${expertise.sessionStructure.mainWork.order.join(' → ')}\n`;
        prompt += `• Cooldown: ${expertise.sessionStructure.cooldown.duration} - ${expertise.sessionStructure.cooldown.components.join(', ')}\n`;
        
        return prompt;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════════

    console.log(`🧠 ${NAME} v${VERSION} loaded - Expert multi-sport knowledge base ready`);

    return {
        VERSION,
        NAME,
        
        // Core data
        SPORT_EXPERTISE,
        METHODOLOGY_MASTERY,
        PROFILE_REASONING,
        DECISION_RULES,
        
        // Helper functions
        getSportExpertise,
        getMethodologyRules,
        getProfileAdjustments,
        evaluateDecisionRules,
        shouldApplyMethod,
        buildExpertPrompt,
        
        // Quick access
        getSportPrinciples: (sport) => getSportExpertise(sport)?.principles || [],
        getSportNonNegotiables: (sport) => getSportExpertise(sport)?.nonNegotiableRules || [],
        getPreferredMethods: (sport) => getSportExpertise(sport)?.preferredMethods || {},
        getCommonMistakes: (sport) => getSportExpertise(sport)?.commonMistakes || [],
        
        // Validation
        isMethodAllowedForLevel: (method, level) => {
            const exp = PROFILE_REASONING.experienceLevel[level];
            if (!exp) return true;
            return !exp.forbiddenMethods.includes(method);
        },
        
        // Combination check
        isCombinationAllowed: (method1, method2) => {
            const forbidden = METHODOLOGY_MASTERY.forbiddenCombinations.find(
                c => (c.combo.includes(method1) && c.combo.includes(method2))
            );
            return forbidden ? { allowed: false, reason: forbidden.reason } : { allowed: true };
        }
    };
})();
