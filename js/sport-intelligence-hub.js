/**
 * GR Perform - Sport Intelligence Hub v1.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * IL CENTRO NEVRALGICO: Unisce tutte le intelligenze in un unico sistema
 * 
 * Questo è il modulo che orchestra:
 * - ExpertKnowledgeBase (conoscenze esperte)
 * - CognitiveReasoningEngine (ragionamento)
 * - AutonomousAdaptationSystem (adattamento autonomo)
 * - Training Methods (metodologie)
 * - Injury Prevention (prevenzione)
 * - Periodization Engine (periodizzazione)
 * 
 * E genera un unico output coerente per la generazione workout
 * 
 * "L'intelligenza non è solo sapere, è sapere usare ciò che si sa"
 */

window.SportIntelligenceHub = (function() {
    'use strict';

    const VERSION = '1.0';
    const NAME = 'SportIntelligenceHub';

    // ═══════════════════════════════════════════════════════════════════════════
    // 1. SPORT-SPECIFIC INTELLIGENCE - Intelligenza per ogni sport
    // ═══════════════════════════════════════════════════════════════════════════

    const SPORT_INTELLIGENCE = {
        boxe: {
            // SESSIONE IDEALE
            idealSession: {
                warmup: {
                    duration: 12,
                    components: [
                        'jump_rope_3min',
                        'dynamic_mobility_shoulders_hips_5min',
                        'shadow_boxing_light_3min',
                        'rotator_cuff_activation_1min'
                    ]
                },
                mainWork: {
                    strength: {
                        focus: ['explosive_power', 'rotational_strength', 'anti_rotation'],
                        exercises: ['med_ball_rotational_throws', 'landmine_press', 'cable_punches', 'trap_bar_deadlift'],
                        methods: ['contrast_training', 'cluster_set', 'explosive_reps'],
                        sets: '3-4',
                        reps: '3-6'
                    },
                    conditioning: {
                        structure: 'round_based',
                        roundDuration: 180,
                        restDuration: 60,
                        totalRounds: '4-8',
                        methods: ['boxing_circuit', 'heavy_bag_intervals', 'shadow_boxing_conditioning']
                    }
                },
                essentials: {
                    neckWork: {
                        mandatory: true,
                        exercises: ['neck_harness', 'isometric_neck', 'bridging'],
                        volume: '3x15-20'
                    },
                    shoulderPrehab: {
                        mandatory: true,
                        exercises: ['band_pull_aparts', 'external_rotation', 'face_pulls'],
                        volume: '2x15'
                    },
                    coreAntiRotation: {
                        mandatory: true,
                        exercises: ['pallof_press', 'anti_rotation_hold', 'cable_rotation'],
                        volume: '3x10-12'
                    }
                },
                cooldown: {
                    duration: 8,
                    components: ['static_stretching', 'shoulder_stretches', 'hip_stretches', 'neck_stretches']
                }
            },

            // WORKOUT TEMPLATES
            templates: {
                strength_power: {
                    name: 'Boxing Strength & Power',
                    focus: 'Forza esplosiva e potenza rotatoria',
                    duration: 60,
                    structure: [
                        { phase: 'warmup', duration: 10 },
                        { phase: 'power', duration: 20, methods: ['contrast_training', 'plyo'] },
                        { phase: 'strength', duration: 20, methods: ['cluster_set'] },
                        { phase: 'essentials', duration: 8 },
                        { phase: 'cooldown', duration: 5 }
                    ]
                },
                conditioning: {
                    name: 'Boxing Conditioning',
                    focus: 'Resistenza specifica round',
                    duration: 50,
                    structure: [
                        { phase: 'warmup', duration: 10 },
                        { phase: 'circuits', duration: 30, methods: ['boxing_circuit', 'emom'] },
                        { phase: 'essentials', duration: 8 },
                        { phase: 'cooldown', duration: 5 }
                    ]
                },
                hybrid: {
                    name: 'Boxing Hybrid Session',
                    focus: 'Forza + Conditioning',
                    duration: 75,
                    structure: [
                        { phase: 'warmup', duration: 12 },
                        { phase: 'strength', duration: 25 },
                        { phase: 'conditioning', duration: 20 },
                        { phase: 'essentials', duration: 10 },
                        { phase: 'cooldown', duration: 8 }
                    ]
                }
            },

            // WEIGHT CLASS SPECIFIC
            weightClassAdjustments: {
                light: { // Fino a 60kg
                    focus: ['speed', 'endurance', 'volume'],
                    conditioning_ratio: 0.5,
                    strength_ratio: 0.3
                },
                medium: { // 60-75kg
                    focus: ['power', 'speed', 'conditioning'],
                    conditioning_ratio: 0.4,
                    strength_ratio: 0.4
                },
                heavy: { // 75-90kg
                    focus: ['power', 'strength', 'knockout_power'],
                    conditioning_ratio: 0.35,
                    strength_ratio: 0.45
                },
                super_heavy: { // 90kg+
                    focus: ['maximal_strength', 'power'],
                    conditioning_ratio: 0.3,
                    strength_ratio: 0.5
                }
            }
        },

        calcio: {
            idealSession: {
                warmup: {
                    duration: 15,
                    components: [
                        'fifa_11_warmup_part1',
                        'dynamic_mobility',
                        'activation_glutes_hamstrings',
                        'sprint_buildup'
                    ]
                },
                mainWork: {
                    strength: {
                        focus: ['lower_body_power', 'single_leg_strength', 'deceleration'],
                        exercises: ['trap_bar_deadlift', 'bulgarian_split_squat', 'hip_thrust', 'nordic_hamstring'],
                        methods: ['progressive_overload', 'unilateral_focus'],
                        sets: '3-4',
                        reps: '6-10'
                    },
                    speed: {
                        structure: 'quality_based',
                        exercises: ['acceleration_10m', 'flying_20m', 'agility_cones'],
                        rest: '60-90s per 10m',
                        maxEfforts: '10-15'
                    },
                    prevention: {
                        mandatory: true,
                        exercises: ['nordic_hamstring', 'copenhagen_adductor', 'eccentric_heel_drops'],
                        volume: '3x8-10'
                    }
                },
                cooldown: {
                    duration: 8,
                    components: ['static_stretching', 'hip_flexor_stretch', 'foam_rolling']
                }
            },

            templates: {
                strength_lower: {
                    name: 'Lower Body Strength',
                    focus: 'Forza gambe e prevenzione',
                    duration: 55,
                    structure: [
                        { phase: 'warmup', duration: 12 },
                        { phase: 'strength_compound', duration: 25 },
                        { phase: 'prevention', duration: 12 },
                        { phase: 'cooldown', duration: 6 }
                    ]
                },
                speed_power: {
                    name: 'Speed & Power',
                    focus: 'Velocità e potenza esplosiva',
                    duration: 50,
                    structure: [
                        { phase: 'warmup', duration: 12 },
                        { phase: 'speed', duration: 20 },
                        { phase: 'power', duration: 12 },
                        { phase: 'cooldown', duration: 6 }
                    ]
                },
                match_day_minus_3: {
                    name: 'MD-3 Session',
                    focus: 'Intensità alta, volume moderato',
                    duration: 45,
                    structure: [
                        { phase: 'warmup', duration: 10 },
                        { phase: 'speed_short', duration: 15 },
                        { phase: 'strength_light', duration: 15 },
                        { phase: 'cooldown', duration: 5 }
                    ],
                    notes: 'No lavoro eccentrico pesante'
                },
                match_day_minus_1: {
                    name: 'MD-1 Activation',
                    focus: 'Solo attivazione',
                    duration: 25,
                    structure: [
                        { phase: 'activation', duration: 15 },
                        { phase: 'priming', duration: 10 }
                    ],
                    notes: 'Nessun carico, solo preparazione SNC'
                }
            },

            roleSpecificTemplates: {
                goalkeeper: {
                    focus: ['reaction', 'lateral_power', 'diving'],
                    additionalExercises: ['lateral_bounds', 'diving_technique', 'reflex_training']
                },
                defender: {
                    focus: ['aerial_strength', 'deceleration', 'contact'],
                    additionalExercises: ['neck_strengthening', 'landing_mechanics', 'sprint_deceleration']
                },
                midfielder: {
                    focus: ['repeated_sprint', 'change_of_direction', 'endurance'],
                    additionalExercises: ['yo_yo_test_prep', 'agility_complex', 'tempo_runs']
                },
                forward: {
                    focus: ['acceleration', 'finishing_power', 'quick_feet'],
                    additionalExercises: ['short_sprints', 'plyometric_focused', 'change_direction']
                }
            }
        },

        basket: {
            idealSession: {
                warmup: {
                    duration: 12,
                    components: [
                        'dynamic_mobility',
                        'ankle_stability_prep',
                        'landing_mechanics_prep',
                        'court_movement_buildup'
                    ]
                },
                mainWork: {
                    strength: {
                        focus: ['vertical_power', 'single_leg_stability', 'core_strength'],
                        exercises: ['front_squat', 'trap_bar_deadlift', 'single_leg_rdl', 'anti_rotation'],
                        methods: ['progressive_overload', 'power_emphasis'],
                        sets: '3-4',
                        reps: '5-8'
                    },
                    power: {
                        structure: 'jump_focused',
                        exercises: ['box_jumps', 'approach_jumps', 'drop_jumps', 'depth_jumps'],
                        volume: 'Monitor total contacts',
                        maxContacts: '40-60 per session'
                    },
                    lateral: {
                        mandatory: true,
                        exercises: ['defensive_slides', 'lateral_bounds', 'lane_agility'],
                        duration: '10-12min'
                    }
                },
                cooldown: {
                    duration: 8,
                    components: ['static_stretching', 'ankle_mobility', 'hip_stretches']
                }
            },

            templates: {
                vertical_power: {
                    name: 'Vertical Power Development',
                    focus: 'Salto verticale e potenza',
                    duration: 55,
                    structure: [
                        { phase: 'warmup', duration: 10 },
                        { phase: 'jump_training', duration: 20 },
                        { phase: 'strength', duration: 18 },
                        { phase: 'cooldown', duration: 7 }
                    ],
                    notes: 'Monitorare contatti totali'
                },
                court_conditioning: {
                    name: 'Court Conditioning',
                    focus: 'Movimento specifico basket',
                    duration: 50,
                    structure: [
                        { phase: 'warmup', duration: 10 },
                        { phase: 'lateral_work', duration: 15 },
                        { phase: 'conditioning', duration: 18 },
                        { phase: 'cooldown', duration: 7 }
                    ]
                },
                hybrid: {
                    name: 'Complete Basketball Session',
                    focus: 'Tutto il pacchetto',
                    duration: 65,
                    structure: [
                        { phase: 'warmup', duration: 10 },
                        { phase: 'jump_power', duration: 15 },
                        { phase: 'strength', duration: 20 },
                        { phase: 'lateral', duration: 12 },
                        { phase: 'cooldown', duration: 8 }
                    ]
                }
            },

            positionAdjustments: {
                guard: {
                    jumpVolumeMultiplier: 1.1,
                    lateralFocus: 'high',
                    strengthFocus: 'moderate'
                },
                forward: {
                    jumpVolumeMultiplier: 1.0,
                    lateralFocus: 'moderate',
                    strengthFocus: 'high'
                },
                center: {
                    jumpVolumeMultiplier: 0.9,
                    lateralFocus: 'low',
                    strengthFocus: 'very_high'
                }
            }
        },

        palestra: {
            idealSession: {
                warmup: {
                    duration: 8,
                    components: [
                        'general_warmup_5min',
                        'specific_activation',
                        'warmup_sets'
                    ]
                },
                mainWork: {
                    structure: 'goal_dependent',
                    defaultOrder: ['compound_heavy', 'compound_moderate', 'accessory', 'isolation']
                },
                cooldown: {
                    duration: 5,
                    components: ['stretching', 'breathing']
                }
            },

            templates: {
                full_body: {
                    name: 'Full Body',
                    focus: 'Tutto il corpo in una sessione',
                    duration: 60,
                    structure: [
                        { phase: 'warmup', duration: 8 },
                        { phase: 'compound_main', duration: 35, exercises: ['squat', 'bench', 'row', 'ohp'] },
                        { phase: 'accessories', duration: 12 },
                        { phase: 'cooldown', duration: 5 }
                    ]
                },
                upper_body: {
                    name: 'Upper Body',
                    focus: 'Parte superiore',
                    duration: 55,
                    structure: [
                        { phase: 'warmup', duration: 6 },
                        { phase: 'push', duration: 20 },
                        { phase: 'pull', duration: 20 },
                        { phase: 'accessories', duration: 6 },
                        { phase: 'cooldown', duration: 3 }
                    ]
                },
                lower_body: {
                    name: 'Lower Body',
                    focus: 'Parte inferiore',
                    duration: 55,
                    structure: [
                        { phase: 'warmup', duration: 8 },
                        { phase: 'squat_pattern', duration: 18 },
                        { phase: 'hinge_pattern', duration: 15 },
                        { phase: 'accessories', duration: 10 },
                        { phase: 'cooldown', duration: 4 }
                    ]
                },
                push_day: {
                    name: 'Push Day',
                    focus: 'Petto, spalle, tricipiti',
                    duration: 50,
                    structure: [
                        { phase: 'warmup', duration: 5 },
                        { phase: 'chest', duration: 18 },
                        { phase: 'shoulders', duration: 14 },
                        { phase: 'triceps', duration: 10 },
                        { phase: 'cooldown', duration: 3 }
                    ]
                },
                pull_day: {
                    name: 'Pull Day',
                    focus: 'Schiena e bicipiti',
                    duration: 50,
                    structure: [
                        { phase: 'warmup', duration: 5 },
                        { phase: 'back_vertical', duration: 15 },
                        { phase: 'back_horizontal', duration: 15 },
                        { phase: 'biceps', duration: 12 },
                        { phase: 'cooldown', duration: 3 }
                    ]
                }
            },

            goalBasedTemplates: {
                hypertrophy: {
                    repRange: '8-12',
                    rest: '60-90s',
                    methods: ['drop_set', 'superset', 'tempo'],
                    volumePerMuscle: 'high'
                },
                strength: {
                    repRange: '3-6',
                    rest: '180-300s',
                    methods: ['cluster_set', 'wave_loading'],
                    volumePerMuscle: 'moderate'
                },
                fat_loss: {
                    repRange: '12-20',
                    rest: '30-60s',
                    methods: ['circuit', 'superset', 'emom'],
                    volumePerMuscle: 'moderate-high'
                },
                power: {
                    repRange: '1-5',
                    rest: '120-180s',
                    methods: ['contrast_training', 'explosive'],
                    volumePerMuscle: 'low'
                }
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. ORCHESTRATION - Orchestrazione di tutti i moduli
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Genera intelligence completa per la generazione workout
     * Orchestta tutti i moduli e produce un output unificato
     * 
     * @param {Object} profile - Profilo atleta
     * @param {Object} context - Contesto attuale
     * @param {Object} history - Storico
     * @returns {Object} Intelligence completa
     */
    function generateIntelligence(profile, context = {}, history = {}) {
        console.log(`🧠 ${NAME}: Generating comprehensive intelligence...`);
        const startTime = performance.now();
        
        const result = {
            version: VERSION,
            generatedAt: new Date().toISOString(),
            sport: profile.sport || 'palestra',
            layers: {}
        };
        
        // ═══ LAYER 1: Expert Knowledge ═══
        console.log('  Layer 1: Expert Knowledge...');
        try {
            if (window.ExpertKnowledgeBase) {
                result.layers.expertKnowledge = {
                    expertise: window.ExpertKnowledgeBase.getSportExpertise(profile.sport),
                    principles: window.ExpertKnowledgeBase.getSportPrinciples(profile.sport),
                    nonNegotiables: window.ExpertKnowledgeBase.getSportNonNegotiables(profile.sport),
                    profileAdjustments: window.ExpertKnowledgeBase.getProfileAdjustments(profile),
                    preferredMethods: window.ExpertKnowledgeBase.getPreferredMethods(profile.sport)
                };
            }
        } catch (e) {
            console.warn('  ⚠ Expert Knowledge layer failed:', e.message);
        }
        
        // ═══ LAYER 2: Cognitive Reasoning ═══
        console.log('  Layer 2: Cognitive Reasoning...');
        try {
            if (window.CognitiveReasoningEngine) {
                result.layers.cognitiveReasoning = window.CognitiveReasoningEngine.reason(profile, context, history);
            }
        } catch (e) {
            console.warn('  ⚠ Cognitive Reasoning layer failed:', e.message);
        }
        
        // ═══ LAYER 3: Autonomous Adaptation ═══
        console.log('  Layer 3: Autonomous Adaptation...');
        try {
            if (window.AutonomousAdaptationSystem) {
                const adaptationData = {
                    ...profile,
                    ...context,
                    history,
                    acwr: history?.acwr || 1.0,
                    weeksSinceDeload: history?.weeksSinceDeload || 0,
                    sleepHoursAvg: context.sleepHours || 7,
                    weeksOnSameProgram: history?.weeksOnSameProgram || 0,
                    weeksWithoutProgress: history?.weeksWithoutProgress || 0,
                    daysToMatch: context.daysToMatch
                };
                result.layers.autonomousAdaptation = window.AutonomousAdaptationSystem.analyze(adaptationData);
            }
        } catch (e) {
            console.warn('  ⚠ Autonomous Adaptation layer failed:', e.message);
        }
        
        // ═══ LAYER 4: Sport-Specific Intelligence ═══
        console.log('  Layer 4: Sport-Specific Intelligence...');
        const sportKey = String(profile.sport || 'palestra').toLowerCase();
        result.layers.sportIntelligence = SPORT_INTELLIGENCE[sportKey] || SPORT_INTELLIGENCE.palestra;
        
        // ═══ SYNTHESIS: Combina tutto in output unificato ═══
        console.log('  Synthesizing...');
        result.synthesis = synthesizeIntelligence(result.layers, profile, context);
        
        // ═══ PROMPT GENERATION ═══
        result.promptInjection = generatePromptInjection(result);
        
        const duration = performance.now() - startTime;
        result.generationTime = Math.round(duration);
        
        console.log(`  ✓ Intelligence generated in ${result.generationTime}ms`);
        
        return result;
    }

    /**
     * Sintetizza i vari layer in raccomandazioni concrete
     */
    function synthesizeIntelligence(layers, profile, context) {
        const synthesis = {
            recommendedTemplate: null,
            intensityModifier: 1.0,
            volumeModifier: 1.0,
            mandatoryComponents: [],
            forbiddenElements: [],
            preferredMethods: [],
            avoidMethods: [],
            specialInstructions: [],
            confidence: 0
        };
        
        // Determina template consigliato
        if (layers.cognitiveReasoning?.recommendedOption) {
            const option = layers.cognitiveReasoning.recommendedOption;
            if (option.type === 'rest') {
                synthesis.recommendedTemplate = 'rest_day';
            } else if (option.type === 'recovery') {
                synthesis.recommendedTemplate = 'active_recovery';
            } else {
                synthesis.recommendedTemplate = 'training';
            }
            synthesis.intensityModifier *= (option.intensity || 1);
            synthesis.volumeModifier *= (option.volume || 1);
            synthesis.confidence = layers.cognitiveReasoning.confidence;
        }
        
        // Applica aggiustamenti autonomi
        if (layers.autonomousAdaptation?.adjustments) {
            layers.autonomousAdaptation.adjustments.forEach(adj => {
                if (adj.type.includes('reduction')) {
                    const factor = adj.factor || 0.7;
                    if (adj.type.includes('volume')) synthesis.volumeModifier *= factor;
                    if (adj.type.includes('intensity')) synthesis.intensityModifier *= factor;
                }
                synthesis.specialInstructions.push(adj.reason);
            });
        }
        
        // Aggiungi componenti mandatory da sport
        if (layers.sportIntelligence?.idealSession?.essentials) {
            Object.entries(layers.sportIntelligence.idealSession.essentials).forEach(([key, val]) => {
                if (val.mandatory) {
                    synthesis.mandatoryComponents.push({
                        name: key,
                        exercises: val.exercises,
                        volume: val.volume
                    });
                }
            });
        }
        
        // Aggiungi non-negotiables
        if (layers.expertKnowledge?.nonNegotiables) {
            layers.expertKnowledge.nonNegotiables.forEach(rule => {
                if (rule.enforcement === 'BLOCKING') {
                    synthesis.specialInstructions.push(`[BLOCKING] ${rule.rule}: ${rule.reason}`);
                }
            });
        }
        
        // Metodi preferiti
        if (layers.expertKnowledge?.preferredMethods) {
            Object.values(layers.expertKnowledge.preferredMethods).forEach(methods => {
                synthesis.preferredMethods.push(...methods);
            });
            synthesis.preferredMethods = [...new Set(synthesis.preferredMethods)];
        }
        
        // Profile-based restrictions
        if (layers.expertKnowledge?.profileAdjustments?.experience?.forbiddenMethods) {
            synthesis.avoidMethods.push(...layers.expertKnowledge.profileAdjustments.experience.forbiddenMethods);
        }
        
        return synthesis;
    }

    /**
     * Genera il testo da iniettare nel prompt per l'AI
     */
    function generatePromptInjection(intelligence) {
        let prompt = '\n\n';
        prompt += '╔══════════════════════════════════════════════════════════════════════════╗\n';
        prompt += '║                    SPORT INTELLIGENCE HUB ANALYSIS                       ║\n';
        prompt += '╚══════════════════════════════════════════════════════════════════════════╝\n\n';
        
        // Sport Info
        const sport = intelligence.layers.sportIntelligence;
        prompt += `🏆 SPORT: ${intelligence.sport.toUpperCase()}\n\n`;
        
        // Principi
        if (intelligence.layers.expertKnowledge?.principles) {
            prompt += '📚 PRINCIPI FONDAMENTALI:\n';
            intelligence.layers.expertKnowledge.principles.slice(0, 5).forEach(p => {
                prompt += `  • ${p}\n`;
            });
            prompt += '\n';
        }
        
        // Alert critici
        if (intelligence.layers.autonomousAdaptation?.alerts?.length > 0) {
            const criticalAlerts = intelligence.layers.autonomousAdaptation.alerts.filter(
                a => a.level === 'critical' || a.level === 'warning'
            );
            if (criticalAlerts.length > 0) {
                prompt += '🚨 ALERT IMPORTANTI:\n';
                criticalAlerts.forEach(a => {
                    prompt += `  ${a.title}\n`;
                    prompt += `  → ${a.action}\n`;
                });
                prompt += '\n';
            }
        }
        
        // Reasoning
        if (intelligence.layers.cognitiveReasoning?.reasoning) {
            prompt += intelligence.layers.cognitiveReasoning.reasoning;
            prompt += '\n';
        }
        
        // Synthesis
        const syn = intelligence.synthesis;
        prompt += '═══════════════════════════════════════════════════════════════════════════\n';
        prompt += '                              SINTESI OPERATIVA                             \n';
        prompt += '═══════════════════════════════════════════════════════════════════════════\n\n';
        
        prompt += `📊 MODIFICATORI:\n`;
        prompt += `  • Intensità: ${Math.round(syn.intensityModifier * 100)}%\n`;
        prompt += `  • Volume: ${Math.round(syn.volumeModifier * 100)}%\n\n`;
        
        if (syn.mandatoryComponents.length > 0) {
            prompt += '✅ COMPONENTI OBBLIGATORI:\n';
            syn.mandatoryComponents.forEach(c => {
                prompt += `  • ${c.name}: ${c.exercises.join(', ')} (${c.volume})\n`;
            });
            prompt += '\n';
        }
        
        if (syn.preferredMethods.length > 0) {
            prompt += `💪 METODI CONSIGLIATI: ${syn.preferredMethods.slice(0, 5).join(', ')}\n\n`;
        }
        
        if (syn.avoidMethods.length > 0) {
            prompt += `⛔ METODI DA EVITARE: ${syn.avoidMethods.join(', ')}\n\n`;
        }
        
        if (syn.specialInstructions.length > 0) {
            prompt += '⚠️ ISTRUZIONI SPECIALI:\n';
            syn.specialInstructions.slice(0, 5).forEach(i => {
                prompt += `  • ${i}\n`;
            });
            prompt += '\n';
        }
        
        prompt += `🎯 Confidenza decisione: ${syn.confidence}%\n`;
        prompt += '\n═══════════════════════════════════════════════════════════════════════════\n';
        
        return prompt;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. QUICK ACCESS FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    function getSportTemplates(sport) {
        const key = String(sport || 'palestra').toLowerCase();
        return SPORT_INTELLIGENCE[key]?.templates || SPORT_INTELLIGENCE.palestra.templates;
    }

    function getIdealSession(sport) {
        const key = String(sport || 'palestra').toLowerCase();
        return SPORT_INTELLIGENCE[key]?.idealSession || SPORT_INTELLIGENCE.palestra.idealSession;
    }

    function getRoleAdjustments(sport, role) {
        const key = String(sport || 'palestra').toLowerCase();
        const sportData = SPORT_INTELLIGENCE[key];
        
        if (sportData?.roleSpecificTemplates?.[role]) {
            return sportData.roleSpecificTemplates[role];
        }
        if (sportData?.positionAdjustments?.[role]) {
            return sportData.positionAdjustments[role];
        }
        return null;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════════

    console.log(`🧠 ${NAME} v${VERSION} loaded - Sport Intelligence Hub ready`);

    return {
        VERSION,
        NAME,
        
        // Main function
        generateIntelligence,
        
        // Quick access
        getSportTemplates,
        getIdealSession,
        getRoleAdjustments,
        
        // Data access
        SPORT_INTELLIGENCE,
        
        // Synthesis helpers
        synthesizeIntelligence,
        generatePromptInjection
    };
})();
