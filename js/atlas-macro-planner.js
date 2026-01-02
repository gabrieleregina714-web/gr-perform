// ═══════════════════════════════════════════════════════════════════════════════════
// 🏛️ ATLAS MACRO-PLANNER - Sistema Ibrido Periodizzazione 12 Settimane
// ═══════════════════════════════════════════════════════════════════════════════════
//
// Filosofia: MACRO-TEMPLATE + MICRO-ADATTAMENTO
// - Il Macro-Planner definisce le FASI (non gli esercizi specifici)
// - Il Week-Generator crea workout adattivi basati su fase + feedback
// - L'Auto-Adjuster sposta fasi quando necessario (malattia, plateau)
//
// Riferimenti scientifici:
// - Kiely 2024: "Flexible Periodization" 
// - Issurin 2016: "Block Periodization"
// - Helms 2019: "Scientific Principles of Hypertrophy Training"
// - NSCA 2023: "Periodization for Sport"
//
// ═══════════════════════════════════════════════════════════════════════════════════

const AtlasMacroPlanner = {

    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 TEMPLATE MACRO 12 SETTIMANE PER OBIETTIVO
    // ═══════════════════════════════════════════════════════════════════════════

    macroTemplates: {

        /**
         * TEMPLATE: MASSA MUSCOLARE / IPERTROFIA
         * Obiettivo: Massima crescita muscolare
         * Strategia: Alto volume → Intensificazione → Deload
         */
        ipertrofia: {
            name: "Ipertrofia 12 Settimane",
            goal: "massa_muscolare",
            duration_weeks: 12,
            
            phases: [
                {
                    name: "Accumulo Volumetrico",
                    weeks: [1, 2, 3, 4],
                    focus: "Volume, frequenza, pump",
                    intensity_range: "60-75%",
                    volume_modifier: 1.0, // baseline
                    rpe_target: "7-8",
                    methods_priority: ["superset", "drop_set", "lengthened_partials"],
                    rep_ranges: { min: 8, max: 15 },
                    rest_seconds: { min: 60, max: 120 },
                    frequency_modifier: 1.0,
                    characteristics: {
                        exercise_variation: "high",
                        compound_ratio: 0.5,
                        isolation_ratio: 0.5,
                        metabolic_stress: "high",
                        mechanical_tension: "moderate"
                    }
                },
                {
                    name: "Intensificazione",
                    weeks: [5, 6, 7, 8],
                    focus: "Carichi crescenti, tensione meccanica",
                    intensity_range: "75-85%",
                    volume_modifier: 0.85, // -15% volume
                    rpe_target: "8-9",
                    methods_priority: ["rest_pause", "eccentric_overload", "cluster_advanced"],
                    rep_ranges: { min: 6, max: 10 },
                    rest_seconds: { min: 90, max: 180 },
                    frequency_modifier: 0.9,
                    characteristics: {
                        exercise_variation: "moderate",
                        compound_ratio: 0.6,
                        isolation_ratio: 0.4,
                        metabolic_stress: "moderate",
                        mechanical_tension: "high"
                    }
                },
                {
                    name: "Overreaching Funzionale",
                    weeks: [9, 10],
                    focus: "Spingere oltre, preparare supercompensazione",
                    intensity_range: "80-90%",
                    volume_modifier: 1.1, // +10% volume
                    rpe_target: "9-10",
                    methods_priority: ["myo_reps", "rest_pause", "eccentric_overload"],
                    rep_ranges: { min: 5, max: 8 },
                    rest_seconds: { min: 120, max: 240 },
                    frequency_modifier: 1.0,
                    characteristics: {
                        exercise_variation: "low",
                        compound_ratio: 0.7,
                        isolation_ratio: 0.3,
                        metabolic_stress: "moderate",
                        mechanical_tension: "very_high"
                    }
                },
                {
                    name: "Deload Strategico",
                    weeks: [11, 12],
                    focus: "Recupero, supercompensazione",
                    intensity_range: "50-60%",
                    volume_modifier: 0.5, // -50% volume
                    rpe_target: "5-6",
                    methods_priority: ["blood_flow_restriction", "tempo_training"],
                    rep_ranges: { min: 12, max: 20 },
                    rest_seconds: { min: 60, max: 90 },
                    frequency_modifier: 0.7,
                    characteristics: {
                        exercise_variation: "moderate",
                        compound_ratio: 0.4,
                        isolation_ratio: 0.6,
                        metabolic_stress: "low",
                        mechanical_tension: "low"
                    }
                }
            ],
            
            progression_strategy: {
                primary: "Double progression (reps → weight)",
                secondary: "Wave loading within phase",
                weekly_load_increase: "2-5%",
                deload_trigger: "After week 10 or RPE consistently 9.5+"
            },
            
            adaptation_triggers: {
                extend_phase: "Se recupero perfetto e progressione continua",
                shorten_phase: "Se fatica > 8/10 per 3+ giorni consecutivi",
                skip_to_deload: "Se 2+ segnali overtraining (sonno, umore, performance)"
            }
        },

        /**
         * TEMPLATE: FORZA MASSIMALE
         * Obiettivo: Massima forza sui fondamentali
         * Strategia: Base → Intensità → Peak → Realizzazione
         */
        forza: {
            name: "Forza Massimale 12 Settimane",
            goal: "forza_massimale",
            duration_weeks: 12,
            
            phases: [
                {
                    name: "Base di Forza",
                    weeks: [1, 2, 3],
                    focus: "Tecnica, volume moderato, costruire base",
                    intensity_range: "65-75%",
                    volume_modifier: 1.0,
                    rpe_target: "6-7",
                    methods_priority: ["tempo_training", "pause_reps"],
                    rep_ranges: { min: 6, max: 10 },
                    rest_seconds: { min: 120, max: 180 },
                    frequency_modifier: 1.0,
                    characteristics: {
                        exercise_variation: "low",
                        compound_ratio: 0.8,
                        isolation_ratio: 0.2,
                        technique_focus: "high",
                        specificity: "high"
                    }
                },
                {
                    name: "Costruzione Forza",
                    weeks: [4, 5, 6],
                    focus: "Carichi progressivi, volume decrescente",
                    intensity_range: "75-85%",
                    volume_modifier: 0.9,
                    rpe_target: "7-8",
                    methods_priority: ["cluster_advanced", "velocity_based_training"],
                    rep_ranges: { min: 4, max: 6 },
                    rest_seconds: { min: 180, max: 300 },
                    frequency_modifier: 0.9,
                    characteristics: {
                        exercise_variation: "very_low",
                        compound_ratio: 0.85,
                        isolation_ratio: 0.15,
                        technique_focus: "high",
                        specificity: "very_high"
                    }
                },
                {
                    name: "Peak Strength",
                    weeks: [7, 8, 9],
                    focus: "Carichi massimali, basso volume",
                    intensity_range: "85-95%",
                    volume_modifier: 0.6,
                    rpe_target: "8.5-9.5",
                    methods_priority: ["velocity_based_training", "cluster_advanced", "eccentric_overload"],
                    rep_ranges: { min: 1, max: 4 },
                    rest_seconds: { min: 240, max: 420 },
                    frequency_modifier: 0.75,
                    characteristics: {
                        exercise_variation: "minimal",
                        compound_ratio: 0.9,
                        isolation_ratio: 0.1,
                        cns_demand: "very_high",
                        specificity: "maximal"
                    }
                },
                {
                    name: "Realizzazione/Taper",
                    weeks: [10, 11],
                    focus: "Mantenere intensità, tagliare volume drasticamente",
                    intensity_range: "90-100%",
                    volume_modifier: 0.3,
                    rpe_target: "9-10 solo su tentativi",
                    methods_priority: ["singles", "velocity_based_training"],
                    rep_ranges: { min: 1, max: 3 },
                    rest_seconds: { min: 300, max: 600 },
                    frequency_modifier: 0.5,
                    characteristics: {
                        exercise_variation: "minimal",
                        compound_ratio: 0.95,
                        isolation_ratio: 0.05,
                        peaking: true
                    }
                },
                {
                    name: "Deload Attivo",
                    weeks: [12],
                    focus: "Recupero completo post-ciclo",
                    intensity_range: "40-55%",
                    volume_modifier: 0.4,
                    rpe_target: "4-5",
                    methods_priority: ["blood_flow_restriction", "mobility"],
                    rep_ranges: { min: 10, max: 15 },
                    rest_seconds: { min: 60, max: 120 },
                    frequency_modifier: 0.5,
                    characteristics: {
                        recovery_focus: true,
                        active_rest: true
                    }
                }
            ],
            
            progression_strategy: {
                primary: "Linear progression in accumulo, wave in peak",
                secondary: "Daily undulation se risponde bene",
                weekly_load_increase: "2-3% or velocity-based",
                test_week: "Week 10-11 per nuovi PR"
            }
        },

        /**
         * TEMPLATE: RICOMPOSIZIONE CORPOREA / DEFINIZIONE
         * Obiettivo: Perdere grasso mantenendo muscolo
         * Strategia: Alto volume + Deficit calorico sostenibile
         */
        definizione: {
            name: "Definizione 12 Settimane",
            goal: "definizione",
            duration_weeks: 12,
            
            phases: [
                {
                    name: "Metabolic Phase",
                    weeks: [1, 2, 3, 4],
                    focus: "Alto volume, bassa densità, burn calorico",
                    intensity_range: "55-70%",
                    volume_modifier: 1.2, // +20% volume
                    rpe_target: "7-8",
                    methods_priority: ["superset", "giant_set", "circuit"],
                    rep_ranges: { min: 12, max: 20 },
                    rest_seconds: { min: 30, max: 75 },
                    frequency_modifier: 1.1,
                    characteristics: {
                        metabolic_stress: "very_high",
                        cardiovascular_component: "high",
                        density: "high",
                        muscle_preservation: "moderate"
                    }
                },
                {
                    name: "Strength Maintenance",
                    weeks: [5, 6, 7, 8],
                    focus: "Mantenere forza con carichi moderati-alti",
                    intensity_range: "70-82%",
                    volume_modifier: 0.8, // -20% per deficit calorico
                    rpe_target: "7.5-8.5",
                    methods_priority: ["rest_pause", "superset"],
                    rep_ranges: { min: 6, max: 10 },
                    rest_seconds: { min: 90, max: 150 },
                    frequency_modifier: 0.9,
                    characteristics: {
                        metabolic_stress: "moderate",
                        mechanical_tension: "high",
                        muscle_preservation: "high"
                    }
                },
                {
                    name: "Peak Definition",
                    weeks: [9, 10],
                    focus: "Massima definizione, volume medio",
                    intensity_range: "65-78%",
                    volume_modifier: 0.9,
                    rpe_target: "7-8",
                    methods_priority: ["myo_reps", "blood_flow_restriction", "drop_set"],
                    rep_ranges: { min: 10, max: 15 },
                    rest_seconds: { min: 45, max: 90 },
                    frequency_modifier: 1.0,
                    characteristics: {
                        pump_focus: true,
                        appearance_optimization: true
                    }
                },
                {
                    name: "Refeed & Deload",
                    weeks: [11, 12],
                    focus: "Recupero metabolico, refeed carbs",
                    intensity_range: "55-65%",
                    volume_modifier: 0.6,
                    rpe_target: "5-6",
                    methods_priority: ["tempo_training"],
                    rep_ranges: { min: 12, max: 18 },
                    rest_seconds: { min: 60, max: 90 },
                    frequency_modifier: 0.7,
                    characteristics: {
                        metabolic_recovery: true,
                        diet_break: true
                    }
                }
            ],
            
            nutrition_notes: {
                deficit: "-300 to -500 kcal/day",
                protein: "2.0-2.4g/kg bodyweight",
                refeed: "Week 11-12: return to maintenance or slight surplus"
            }
        },

        /**
         * TEMPLATE: PERFORMANCE SPORTIVA
         * Obiettivo: Migliorare prestazione per sport specifico
         * Strategia: GPP → SPP → Peaking
         */
        performance: {
            name: "Performance Sportiva 12 Settimane",
            goal: "performance_sportiva",
            duration_weeks: 12,
            
            phases: [
                {
                    name: "GPP (Preparazione Generale)",
                    weeks: [1, 2, 3],
                    focus: "Base aerobica, mobilità, volume lavoro",
                    intensity_range: "55-70%",
                    volume_modifier: 1.0,
                    rpe_target: "6-7",
                    methods_priority: ["circuit", "tempo_training"],
                    rep_ranges: { min: 8, max: 15 },
                    rest_seconds: { min: 60, max: 120 },
                    frequency_modifier: 1.0,
                    characteristics: {
                        general_preparation: true,
                        work_capacity: "building",
                        sport_specificity: "low"
                    }
                },
                {
                    name: "SPP (Preparazione Specifica)",
                    weeks: [4, 5, 6, 7],
                    focus: "Forza specifica, movimenti sport-specific",
                    intensity_range: "70-82%",
                    volume_modifier: 0.9,
                    rpe_target: "7-8",
                    methods_priority: ["velocity_based_training", "plyometrics", "cluster_advanced"],
                    rep_ranges: { min: 4, max: 8 },
                    rest_seconds: { min: 120, max: 240 },
                    frequency_modifier: 0.9,
                    characteristics: {
                        sport_specificity: "high",
                        power_development: true,
                        skill_transfer: "moderate"
                    }
                },
                {
                    name: "Pre-Competition",
                    weeks: [8, 9, 10],
                    focus: "Potenza, reattività, sport-specific drills",
                    intensity_range: "75-90%",
                    volume_modifier: 0.7,
                    rpe_target: "8-9",
                    methods_priority: ["velocity_based_training", "contrast_training"],
                    rep_ranges: { min: 2, max: 5 },
                    rest_seconds: { min: 180, max: 300 },
                    frequency_modifier: 0.75,
                    characteristics: {
                        sport_specificity: "very_high",
                        speed_power: "peak",
                        technical_work: "high"
                    }
                },
                {
                    name: "Taper & Competition",
                    weeks: [11, 12],
                    focus: "Freshen up, mantenere capacità, competere",
                    intensity_range: "80-95%",
                    volume_modifier: 0.4,
                    rpe_target: "Variable - low volume, high quality",
                    methods_priority: ["activation", "mobility"],
                    rep_ranges: { min: 2, max: 4 },
                    rest_seconds: { min: 180, max: 360 },
                    frequency_modifier: 0.5,
                    characteristics: {
                        competition_ready: true,
                        neural_freshness: "priority",
                        minimal_fatigue_accumulation: true
                    }
                }
            ],
            
            sport_adjustments: {
                calcio: { emphasis: "change_of_direction", injury_prevention: "high" },
                basket: { emphasis: "vertical_power", game_speed: "high" },
                boxe: { emphasis: "power_endurance", conditioning: "very_high" },
                nuoto: { emphasis: "specific_strength", mobility: "high" }
            }
        },

        /**
         * TEMPLATE: PRINCIPIANTE
         * Obiettivo: Costruire basi solide
         * Strategia: Apprendimento tecnico → Volume graduale → Primo intensificazione
         */
        principiante: {
            name: "Principiante 12 Settimane",
            goal: "base_building",
            duration_weeks: 12,
            
            phases: [
                {
                    name: "Apprendimento Motorio",
                    weeks: [1, 2, 3, 4],
                    focus: "Tecnica, pattern di movimento, connessione mente-muscolo",
                    intensity_range: "40-55%",
                    volume_modifier: 0.7, // conservativo
                    rpe_target: "5-6",
                    methods_priority: ["tempo_training", "mind_muscle"],
                    rep_ranges: { min: 10, max: 15 },
                    rest_seconds: { min: 90, max: 150 },
                    frequency_modifier: 0.8,
                    characteristics: {
                        technique_priority: "absolute",
                        injury_prevention: "very_high",
                        progression_rate: "slow_controlled"
                    }
                },
                {
                    name: "Costruzione Volume",
                    weeks: [5, 6, 7, 8],
                    focus: "Aumentare gradualmente volume e intensità",
                    intensity_range: "55-68%",
                    volume_modifier: 0.85,
                    rpe_target: "6-7",
                    methods_priority: ["superset", "tempo_training"],
                    rep_ranges: { min: 8, max: 12 },
                    rest_seconds: { min: 90, max: 120 },
                    frequency_modifier: 0.9,
                    characteristics: {
                        progression_rate: "moderate",
                        exercise_variety: "introducing"
                    }
                },
                {
                    name: "Prima Intensificazione",
                    weeks: [9, 10],
                    focus: "Testare carichi più alti, introdurre metodi",
                    intensity_range: "65-75%",
                    volume_modifier: 0.8,
                    rpe_target: "7-8",
                    methods_priority: ["rest_pause"],
                    rep_ranges: { min: 6, max: 10 },
                    rest_seconds: { min: 120, max: 180 },
                    frequency_modifier: 0.9,
                    characteristics: {
                        testing_capacity: true
                    }
                },
                {
                    name: "Consolidamento",
                    weeks: [11, 12],
                    focus: "Consolidare gains, preparare per ciclo successivo",
                    intensity_range: "55-65%",
                    volume_modifier: 0.7,
                    rpe_target: "5-6",
                    methods_priority: ["tempo_training"],
                    rep_ranges: { min: 10, max: 15 },
                    rest_seconds: { min: 90, max: 120 },
                    frequency_modifier: 0.8,
                    characteristics: {
                        deload_light: true,
                        assessment: true
                    }
                }
            ],
            
            safety_guidelines: {
                max_intensity: "Never above 75% in first 12 weeks",
                progression_rate: "No more than 5% load increase per week",
                mandatory_rest: "Minimum 2 full rest days per week",
                form_check: "Every session priority"
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🧠 LOGICA DI SELEZIONE E ADATTAMENTO MACRO
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Seleziona il template macro appropriato per l'atleta
     */
    selectMacroTemplate(athlete) {
        const { goal, experience, sport } = athlete;
        
        // Priority mapping
        const goalMapping = {
            'massa_muscolare': 'ipertrofia',
            'ipertrofia': 'ipertrofia',
            'forza': 'forza',
            'forza_massimale': 'forza',
            'definizione': 'definizione',
            'dimagrimento': 'definizione',
            'performance': 'performance',
            'sport': 'performance',
            'base': 'principiante'
        };
        
        // Principiante override
        if (experience === 'beginner' || athlete.training_age < 1) {
            return this.macroTemplates.principiante;
        }
        
        // Sport override for athletes
        if (sport && ['calcio', 'basket', 'boxe', 'rugby'].includes(sport)) {
            return this.macroTemplates.performance;
        }
        
        // Goal-based selection
        const templateKey = goalMapping[goal?.toLowerCase()] || 'ipertrofia';
        return this.macroTemplates[templateKey];
    },

    /**
     * Ottiene la fase corrente basata sulla settimana
     */
    getCurrentPhase(macroTemplate, weekNumber) {
        for (const phase of macroTemplate.phases) {
            if (phase.weeks.includes(weekNumber)) {
                return phase;
            }
        }
        // Default: ultima fase
        return macroTemplate.phases[macroTemplate.phases.length - 1];
    },

    /**
     * Genera parametri per il Week-Generator basato su fase corrente
     */
    generateWeekParameters(macroTemplate, weekNumber, athleteFeedback = {}) {
        const phase = this.getCurrentPhase(macroTemplate, weekNumber);
        
        // Calcola posizione nella fase (per progressione intra-fase)
        const phaseWeeks = phase.weeks;
        const weekInPhase = phaseWeeks.indexOf(weekNumber) + 1;
        const totalPhaseWeeks = phaseWeeks.length;
        const phaseProgress = weekInPhase / totalPhaseWeeks; // 0.25, 0.5, 0.75, 1.0
        
        // Calcola modificatori basati su feedback atleta
        const feedbackModifiers = this.calculateFeedbackModifiers(athleteFeedback);
        
        // Intensità progressiva nella fase
        const intensityParts = phase.intensity_range.split('-').map(s => parseInt(s));
        const baseIntensity = intensityParts[0];
        const peakIntensity = intensityParts[1];
        const weekIntensity = baseIntensity + (peakIntensity - baseIntensity) * phaseProgress;
        
        return {
            phase_name: phase.name,
            week_number: weekNumber,
            week_in_phase: weekInPhase,
            phase_progress: phaseProgress,
            
            // Parametri workout
            intensity_target: Math.round(weekIntensity * feedbackModifiers.intensity),
            volume_modifier: phase.volume_modifier * feedbackModifiers.volume,
            rpe_target: phase.rpe_target,
            rep_range: phase.rep_ranges,
            rest_range: phase.rest_seconds,
            
            // Metodologie
            priority_methods: phase.methods_priority,
            
            // Frequency
            sessions_modifier: phase.frequency_modifier * feedbackModifiers.frequency,
            
            // Caratteristiche fase
            characteristics: phase.characteristics,
            
            // Feedback adjustments applied
            adjustments: feedbackModifiers.reasons
        };
    },

    /**
     * Calcola modificatori basati su feedback atleta
     */
    calculateFeedbackModifiers(feedback) {
        const modifiers = {
            intensity: 1.0,
            volume: 1.0,
            frequency: 1.0,
            reasons: []
        };
        
        // Fatica alta → riduci tutto
        if (feedback.fatigue >= 8) {
            modifiers.intensity *= 0.9;
            modifiers.volume *= 0.8;
            modifiers.reasons.push("Alta fatica: -10% intensità, -20% volume");
        } else if (feedback.fatigue >= 6) {
            modifiers.volume *= 0.9;
            modifiers.reasons.push("Fatica moderata: -10% volume");
        }
        
        // Sonno scarso → riduci intensità
        if (feedback.sleep_quality === 'poor' || feedback.sleep_hours < 6) {
            modifiers.intensity *= 0.92;
            modifiers.reasons.push("Sonno insufficiente: -8% intensità");
        }
        
        // Stress alto → riduci volume
        if (feedback.stress >= 8) {
            modifiers.volume *= 0.85;
            modifiers.frequency *= 0.85;
            modifiers.reasons.push("Stress alto: -15% volume/frequenza");
        }
        
        // Recupero muscolare incompleto
        if (feedback.muscle_soreness === 'severe') {
            modifiers.volume *= 0.8;
            modifiers.reasons.push("DOMS severi: -20% volume");
        }
        
        // Motivazione bassa → riduci frequenza
        if (feedback.motivation <= 3) {
            modifiers.frequency *= 0.8;
            modifiers.reasons.push("Motivazione bassa: -20% frequenza");
        }
        
        // Progressione ottima → boost leggero
        if (feedback.last_week_performance === 'excellent') {
            modifiers.intensity *= 1.03;
            modifiers.reasons.push("Performance eccellente: +3% intensità");
        }
        
        return modifiers;
    },

    /**
     * Determina se è necessario un aggiustamento di fase
     */
    evaluatePhaseAdjustment(weekHistory, currentWeek) {
        const adjustments = {
            action: 'continue', // continue | extend | skip_to_deload | restart
            reason: null,
            new_week: currentWeek
        };
        
        if (!weekHistory || weekHistory.length < 2) {
            return adjustments;
        }
        
        // Ultimi 2-3 feedback
        const recentFeedback = weekHistory.slice(-3);
        
        // Check overtraining signals
        const highFatigueCount = recentFeedback.filter(w => w.fatigue >= 8).length;
        const performanceDropCount = recentFeedback.filter(w => w.performance === 'declining').length;
        const poorSleepCount = recentFeedback.filter(w => w.sleep_quality === 'poor').length;
        
        // SKIP TO DELOAD: 2+ segnali overtraining per 2+ settimane
        if (highFatigueCount >= 2 && (performanceDropCount >= 1 || poorSleepCount >= 2)) {
            adjustments.action = 'skip_to_deload';
            adjustments.reason = 'Segnali di overreaching: fatica cronica + calo performance/sonno';
            return adjustments;
        }
        
        // EXTEND PHASE: tutto perfetto, progressione continua
        const excellentCount = recentFeedback.filter(w => 
            w.performance === 'excellent' && w.fatigue <= 6 && w.motivation >= 7
        ).length;
        
        if (excellentCount >= 2) {
            adjustments.action = 'extend';
            adjustments.reason = 'Progressione ottimale: estendere fase corrente di 1 settimana';
            return adjustments;
        }
        
        return adjustments;
    },

    /**
     * Genera sommario del macro-plan per l'atleta
     */
    generateMacroSummary(macroTemplate) {
        const summary = {
            name: macroTemplate.name,
            goal: macroTemplate.goal,
            duration: macroTemplate.duration_weeks + " settimane",
            phases: []
        };
        
        for (const phase of macroTemplate.phases) {
            summary.phases.push({
                name: phase.name,
                weeks: `Settimane ${phase.weeks[0]}-${phase.weeks[phase.weeks.length-1]}`,
                focus: phase.focus,
                intensity: phase.intensity_range + "%",
                rpe: phase.rpe_target,
                key_methods: phase.methods_priority.slice(0, 2).join(", ")
            });
        }
        
        return summary;
    },

    /**
     * Genera prompt per AI con contesto della fase corrente
     */
    generatePhasePrompt(weekParams) {
        let prompt = `\n\n📅 CONTESTO PERIODIZZAZIONE (Settimana ${weekParams.week_number}):\n`;
        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        prompt += `FASE: ${weekParams.phase_name}\n`;
        prompt += `Progressione nella fase: ${Math.round(weekParams.phase_progress * 100)}%\n\n`;
        
        prompt += `🎯 PARAMETRI OBBLIGATORI PER QUESTA SETTIMANA:\n`;
        prompt += `- Intensità target: ${weekParams.intensity_target}%\n`;
        prompt += `- Range ripetizioni: ${weekParams.rep_range.min}-${weekParams.rep_range.max}\n`;
        prompt += `- Recupero tra serie: ${weekParams.rest_range.min}-${weekParams.rest_range.max}s\n`;
        prompt += `- RPE target: ${weekParams.rpe_target}\n`;
        prompt += `- Volume: ${Math.round(weekParams.volume_modifier * 100)}% del normale\n\n`;
        
        prompt += `💪 METODOLOGIE PRIORITARIE (usa almeno 1):\n`;
        for (const method of weekParams.priority_methods) {
            prompt += `- ${method.replace(/_/g, ' ')}\n`;
        }
        
        if (weekParams.adjustments && weekParams.adjustments.length > 0) {
            prompt += `\n⚠️ ADATTAMENTI BASATI SU FEEDBACK:\n`;
            for (const adj of weekParams.adjustments) {
                prompt += `- ${adj}\n`;
            }
        }
        
        if (weekParams.characteristics) {
            prompt += `\n📋 CARATTERISTICHE FASE:\n`;
            for (const [key, value] of Object.entries(weekParams.characteristics)) {
                if (typeof value === 'boolean' && value) {
                    prompt += `- ${key.replace(/_/g, ' ')}: SÌ\n`;
                } else if (typeof value === 'string') {
                    prompt += `- ${key.replace(/_/g, ' ')}: ${value}\n`;
                }
            }
        }
        
        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        
        return prompt;
    }
};

// Export per browser
window.AtlasMacroPlanner = AtlasMacroPlanner;
