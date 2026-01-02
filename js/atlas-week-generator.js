// ═══════════════════════════════════════════════════════════════════════════════════
// 🔄 ATLAS WEEK GENERATOR - Generazione Settimana Adattiva
// ═══════════════════════════════════════════════════════════════════════════════════
//
// Responsabilità:
// - Genera struttura settimanale basata su fase macro-plan
// - Integra feedback atleta per adattamenti real-time
// - Applica recovery model per scheduling ottimale
// - Seleziona metodologie appropriate per la fase
//
// Input: Fase corrente + Feedback atleta + Recovery status
// Output: Struttura settimana con parametri per AI generation
// ═══════════════════════════════════════════════════════════════════════════════════

const AtlasWeekGenerator = {

    // ═══════════════════════════════════════════════════════════════════════════
    // 📅 TEMPLATE STRUTTURE SETTIMANALI
    // ═══════════════════════════════════════════════════════════════════════════

    weekStructures: {
        
        /**
         * 3 sessioni/settimana - Full Body
         */
        fullbody_3: {
            name: "Full Body 3x",
            sessions_per_week: 3,
            days: ['monday', 'wednesday', 'friday'],
            structure: [
                {
                    day: 1,
                    name: "Full Body A",
                    focus: ["lower_push", "upper_push", "posterior"],
                    primary_patterns: ["squat", "horizontal_push", "hip_hinge"],
                    volume_distribution: 0.35
                },
                {
                    day: 2,
                    name: "Full Body B", 
                    focus: ["upper_pull", "lower_pull", "core"],
                    primary_patterns: ["vertical_pull", "lunge", "horizontal_pull"],
                    volume_distribution: 0.35
                },
                {
                    day: 3,
                    name: "Full Body C",
                    focus: ["power", "compound", "accessories"],
                    primary_patterns: ["explosive", "squat", "horizontal_push"],
                    volume_distribution: 0.30
                }
            ],
            recovery_days: 1, // giorni tra sessioni
            ideal_for: ["beginner", "busy_schedule", "general_fitness"]
        },

        /**
         * 4 sessioni/settimana - Upper/Lower
         */
        upper_lower_4: {
            name: "Upper/Lower 4x",
            sessions_per_week: 4,
            days: ['monday', 'tuesday', 'thursday', 'friday'],
            structure: [
                {
                    day: 1,
                    name: "Upper Strength",
                    focus: ["chest", "back", "shoulders"],
                    primary_patterns: ["horizontal_push", "horizontal_pull", "vertical_push"],
                    secondary: ["biceps", "triceps"],
                    volume_distribution: 0.28,
                    intensity_modifier: 1.05 // leggermente più intenso
                },
                {
                    day: 2,
                    name: "Lower Strength",
                    focus: ["quadriceps", "hamstrings", "glutes"],
                    primary_patterns: ["squat", "hip_hinge", "lunge"],
                    secondary: ["calves", "core"],
                    volume_distribution: 0.28,
                    intensity_modifier: 1.05
                },
                {
                    day: 3,
                    name: "Upper Volume",
                    focus: ["back", "chest", "arms"],
                    primary_patterns: ["vertical_pull", "horizontal_push", "isolation"],
                    secondary: ["rear_delts", "biceps", "triceps"],
                    volume_distribution: 0.22,
                    intensity_modifier: 0.90 // meno intenso, più volume
                },
                {
                    day: 4,
                    name: "Lower Volume",
                    focus: ["glutes", "hamstrings", "quadriceps"],
                    primary_patterns: ["hip_hinge", "unilateral", "isolation"],
                    secondary: ["adductors", "calves"],
                    volume_distribution: 0.22,
                    intensity_modifier: 0.90
                }
            ],
            recovery_days: 0.5, // alcuni giorni consecutivi
            ideal_for: ["intermediate", "hypertrophy", "strength"]
        },

        /**
         * 5 sessioni/settimana - Push/Pull/Legs
         */
        ppl_5: {
            name: "Push/Pull/Legs 5x",
            sessions_per_week: 5,
            days: ['monday', 'tuesday', 'wednesday', 'friday', 'saturday'],
            structure: [
                {
                    day: 1,
                    name: "Push (Chest Focus)",
                    focus: ["chest", "front_delts", "triceps"],
                    primary_patterns: ["horizontal_push", "incline_push", "overhead"],
                    volume_distribution: 0.22
                },
                {
                    day: 2,
                    name: "Pull (Back Focus)",
                    focus: ["lats", "upper_back", "biceps", "rear_delts"],
                    primary_patterns: ["vertical_pull", "horizontal_pull", "face_pull"],
                    volume_distribution: 0.22
                },
                {
                    day: 3,
                    name: "Legs (Quad Focus)",
                    focus: ["quadriceps", "glutes", "calves"],
                    primary_patterns: ["squat", "lunge", "leg_press"],
                    volume_distribution: 0.22
                },
                {
                    day: 4,
                    name: "Push (Shoulder Focus)",
                    focus: ["shoulders", "chest", "triceps"],
                    primary_patterns: ["overhead", "lateral_raise", "horizontal_push"],
                    volume_distribution: 0.17
                },
                {
                    day: 5,
                    name: "Pull + Posterior",
                    focus: ["back", "hamstrings", "glutes"],
                    primary_patterns: ["hip_hinge", "row", "curl"],
                    volume_distribution: 0.17
                }
            ],
            recovery_days: 0.4,
            ideal_for: ["intermediate", "advanced", "hypertrophy", "bodybuilding"]
        },

        /**
         * 6 sessioni/settimana - Push/Pull/Legs x2
         */
        ppl_6: {
            name: "PPL 6x (Arnold)",
            sessions_per_week: 6,
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            structure: [
                { day: 1, name: "Push 1", focus: ["chest", "shoulders", "triceps"], volume_distribution: 0.18 },
                { day: 2, name: "Pull 1", focus: ["back", "biceps", "rear_delts"], volume_distribution: 0.18 },
                { day: 3, name: "Legs 1", focus: ["quadriceps", "hamstrings", "calves"], volume_distribution: 0.18 },
                { day: 4, name: "Push 2", focus: ["shoulders", "chest", "triceps"], volume_distribution: 0.15 },
                { day: 5, name: "Pull 2", focus: ["back", "biceps", "forearms"], volume_distribution: 0.15 },
                { day: 6, name: "Legs 2", focus: ["glutes", "hamstrings", "calves"], volume_distribution: 0.16 }
            ],
            recovery_days: 0.15,
            ideal_for: ["advanced", "high_volume", "competition_prep"]
        },

        /**
         * 4 sessioni/settimana - Forza (Powerlifting style)
         */
        strength_4: {
            name: "Strength Focus 4x",
            sessions_per_week: 4,
            days: ['monday', 'wednesday', 'friday', 'saturday'],
            structure: [
                {
                    day: 1,
                    name: "Squat Day",
                    focus: ["quadriceps", "core", "back"],
                    primary_lift: "squat",
                    accessories: ["leg_press", "core", "upper_back"],
                    volume_distribution: 0.28
                },
                {
                    day: 2,
                    name: "Bench Day",
                    focus: ["chest", "triceps", "shoulders"],
                    primary_lift: "bench_press",
                    accessories: ["ohp", "triceps", "chest"],
                    volume_distribution: 0.26
                },
                {
                    day: 3,
                    name: "Deadlift Day",
                    focus: ["posterior_chain", "back", "grip"],
                    primary_lift: "deadlift",
                    accessories: ["rdl", "rows", "core"],
                    volume_distribution: 0.28
                },
                {
                    day: 4,
                    name: "Accessory Day",
                    focus: ["weak_points", "hypertrophy", "prehab"],
                    accessories: ["all"],
                    volume_distribution: 0.18,
                    intensity_modifier: 0.75
                }
            ],
            recovery_days: 0.5,
            ideal_for: ["strength", "powerlifting", "intermediate", "advanced"]
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🧠 LOGICA DI GENERAZIONE SETTIMANA
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Genera struttura settimana completa
     */
    generateWeek(params) {
        const {
            athlete,
            weekParams,      // da MacroPlanner.generateWeekParameters()
            recoveryStatus,  // da AtlasRecovery
            cnsStatus,       // da AtlasRecovery.cnsRecoveryModel
            progressSummary  // da ProgressTracker.getProgressSummary()
        } = params;

        // 1. Seleziona struttura base
        const structure = this.selectWeekStructure(athlete, weekParams);
        
        // 2. Adatta per recovery
        const adaptedStructure = this.adaptForRecovery(structure, recoveryStatus, cnsStatus);
        
        // 3. Calcola volumi per giorno
        const volumeDistribution = this.calculateVolumeDistribution(
            adaptedStructure, 
            weekParams.volume_modifier,
            athlete
        );
        
        // 4. Seleziona metodologie per sessione
        const methodsPerSession = this.assignMethods(
            adaptedStructure, 
            weekParams.priority_methods,
            athlete
        );
        
        // 5. Genera parametri per ogni sessione
        const sessions = this.generateSessionParams(
            adaptedStructure,
            weekParams,
            volumeDistribution,
            methodsPerSession,
            athlete
        );
        
        // 6. Aggiungi raccomandazioni
        const recommendations = this.generateRecommendations(
            progressSummary,
            weekParams,
            cnsStatus
        );

        return {
            week_number: weekParams.week_number,
            phase: weekParams.phase_name,
            structure_name: structure.name,
            sessions_count: sessions.length,
            sessions,
            recommendations,
            volume_modifier: weekParams.volume_modifier,
            intensity_target: weekParams.intensity_target,
            methods_used: weekParams.priority_methods
        };
    },

    /**
     * Seleziona struttura settimanale appropriata
     */
    selectWeekStructure(athlete, weekParams) {
        const { experience, available_days, goal, current_split } = athlete;
        
        // Se atleta ha già una split preferita, usa quella
        if (current_split && this.weekStructures[current_split]) {
            return this.weekStructures[current_split];
        }
        
        // Selezione basata su giorni disponibili
        const availableDays = available_days || 4;
        
        if (availableDays <= 3) {
            return this.weekStructures.fullbody_3;
        } else if (availableDays === 4) {
            // Forza = strength_4, Altro = upper_lower_4
            if (goal === 'forza' || goal === 'forza_massimale') {
                return this.weekStructures.strength_4;
            }
            return this.weekStructures.upper_lower_4;
        } else if (availableDays === 5) {
            return this.weekStructures.ppl_5;
        } else {
            // Solo advanced con 6 giorni
            if (experience === 'advanced') {
                return this.weekStructures.ppl_6;
            }
            return this.weekStructures.ppl_5;
        }
    },

    /**
     * Adatta struttura per recovery status
     */
    adaptForRecovery(structure, recoveryStatus, cnsStatus) {
        const adapted = JSON.parse(JSON.stringify(structure)); // deep copy
        
        // CNS affaticato → riduci sessioni intense consecutive
        if (cnsStatus && cnsStatus.status === 'fatigued') {
            // Aggiungi giorno extra di riposo se possibile
            if (adapted.sessions_per_week > 3) {
                adapted.recovery_note = "CNS affaticato: considera riposo extra";
            }
        }
        
        // Muscoli non recuperati → evita overlap
        if (recoveryStatus) {
            const notRecovered = Object.entries(recoveryStatus)
                .filter(([muscle, status]) => status.recovery_percentage < 80)
                .map(([muscle]) => muscle);
            
            if (notRecovered.length > 0) {
                adapted.avoid_muscles = notRecovered;
                adapted.recovery_warning = `Muscoli non recuperati: ${notRecovered.join(', ')}`;
            }
        }
        
        return adapted;
    },

    /**
     * Calcola distribuzione volume per sessione
     */
    calculateVolumeDistribution(structure, volumeModifier, athlete) {
        const baseWeeklyVolume = this.getBaseWeeklyVolume(athlete);
        const adjustedVolume = baseWeeklyVolume * volumeModifier;
        
        return structure.structure.map(session => ({
            day: session.day,
            name: session.name,
            sets: Math.round(adjustedVolume * session.volume_distribution),
            intensity_modifier: session.intensity_modifier || 1.0
        }));
    },

    /**
     * Volume base settimanale per esperienza
     */
    getBaseWeeklyVolume(athlete) {
        const volumeByExperience = {
            beginner: 40,     // ~40 serie/settimana
            intermediate: 60, // ~60 serie/settimana
            advanced: 80      // ~80 serie/settimana
        };
        
        return volumeByExperience[athlete.experience] || 60;
    },

    /**
     * Assegna metodologie alle sessioni
     */
    assignMethods(structure, priorityMethods, athlete) {
        const sessions = structure.structure;
        const methodsPerSession = {};
        
        // Distribuisci metodologie tra sessioni
        let methodIndex = 0;
        
        for (const session of sessions) {
            const sessionMethods = [];
            
            // Sessioni più intense → metodologie più intense
            if (session.intensity_modifier && session.intensity_modifier >= 1.0) {
                // Assegna 1-2 metodologie intense
                if (priorityMethods[methodIndex]) {
                    sessionMethods.push(priorityMethods[methodIndex]);
                    methodIndex = (methodIndex + 1) % priorityMethods.length;
                }
            }
            
            // Ogni sessione ha almeno 1 metodologia
            if (sessionMethods.length === 0 && priorityMethods.length > 0) {
                sessionMethods.push(priorityMethods[0]);
            }
            
            methodsPerSession[session.day] = sessionMethods;
        }
        
        return methodsPerSession;
    },

    /**
     * Genera parametri dettagliati per ogni sessione
     */
    generateSessionParams(structure, weekParams, volumeDist, methods, athlete) {
        const sessions = [];
        
        for (let i = 0; i < structure.structure.length; i++) {
            const sessionTemplate = structure.structure[i];
            const volumeInfo = volumeDist[i];
            const sessionMethods = methods[sessionTemplate.day] || [];
            
            // Calcola intensità specifica per sessione
            const sessionIntensity = Math.round(
                weekParams.intensity_target * (volumeInfo.intensity_modifier || 1.0)
            );
            
            const session = {
                day: sessionTemplate.day,
                name: sessionTemplate.name,
                
                // Focus
                focus_muscles: sessionTemplate.focus,
                movement_patterns: sessionTemplate.primary_patterns,
                secondary_muscles: sessionTemplate.secondary || [],
                
                // Volume
                total_sets: volumeInfo.sets,
                sets_per_muscle: Math.round(volumeInfo.sets / sessionTemplate.focus.length),
                
                // Intensità
                intensity_percent: sessionIntensity,
                rpe_target: weekParams.rpe_target,
                
                // Ripetizioni e recupero
                rep_range: weekParams.rep_range,
                rest_seconds: weekParams.rest_range,
                
                // Metodologie
                methods: sessionMethods,
                methods_mandatory: sessionMethods.length > 0,
                
                // Tempo totale stimato
                estimated_duration: this.estimateSessionDuration(volumeInfo.sets, weekParams.rest_range),
                
                // Note fase
                phase_characteristics: weekParams.characteristics,
                
                // Warning recovery
                avoid_muscles: structure.avoid_muscles || [],
                recovery_warning: structure.recovery_warning || null
            };
            
            sessions.push(session);
        }
        
        return sessions;
    },

    /**
     * Stima durata sessione
     */
    estimateSessionDuration(sets, restRange) {
        const avgRestSeconds = (restRange.min + restRange.max) / 2;
        const setDurationSeconds = 45; // tempo medio per eseguire una serie
        const totalSeconds = sets * (setDurationSeconds + avgRestSeconds);
        return Math.round(totalSeconds / 60); // minuti
    },

    /**
     * Genera raccomandazioni per la settimana
     */
    generateRecommendations(progressSummary, weekParams, cnsStatus) {
        const recommendations = [];
        
        // Basate su trend progressi
        if (progressSummary?.trend?.recommendation) {
            recommendations.push({
                type: 'progress',
                priority: progressSummary.trend.recommendation.urgency,
                message: progressSummary.trend.recommendation.message
            });
        }
        
        // Basate su CNS
        if (cnsStatus?.status === 'fatigued') {
            recommendations.push({
                type: 'cns',
                priority: 'high',
                message: 'CNS affaticato: evita esercizi ad alto impatto CNS (deadlift pesanti, clean, snatch)'
            });
        }
        
        // Basate su fase
        if (weekParams.characteristics?.metabolic_stress === 'very_high') {
            recommendations.push({
                type: 'phase',
                priority: 'medium',
                message: 'Fase metabolica: priorità a superset e circuiti per massimo pump'
            });
        }
        
        if (weekParams.characteristics?.technique_priority === 'absolute') {
            recommendations.push({
                type: 'phase',
                priority: 'high',
                message: 'Focus tecnica: usa carichi conservativi, mai sacrificare la forma'
            });
        }
        
        // Deload specifico
        if (weekParams.phase_name.toLowerCase().includes('deload')) {
            recommendations.push({
                type: 'deload',
                priority: 'high',
                message: 'Settimana di scarico: non superare RPE 6, volume ridotto del 50%'
            });
        }
        
        return recommendations;
    },

    /**
     * Genera prompt completo per AI con struttura settimana
     */
    generateWeekPrompt(weekPlan) {
        let prompt = `\n\n🗓️ STRUTTURA SETTIMANA ${weekPlan.week_number} (${weekPlan.phase}):\n`;
        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        prompt += `Split: ${weekPlan.structure_name}\n`;
        prompt += `Sessioni: ${weekPlan.sessions_count}\n`;
        prompt += `Volume: ${Math.round(weekPlan.volume_modifier * 100)}% | Intensità target: ${weekPlan.intensity_target}%\n\n`;
        
        for (const session of weekPlan.sessions) {
            prompt += `📍 GIORNO ${session.day}: ${session.name}\n`;
            prompt += `   Focus: ${session.focus_muscles.join(', ')}\n`;
            prompt += `   Serie totali: ${session.total_sets} (~${session.sets_per_muscle}/muscolo)\n`;
            prompt += `   Intensità: ${session.intensity_percent}% | RPE: ${session.rpe_target}\n`;
            prompt += `   Reps: ${session.rep_range.min}-${session.rep_range.max} | Riposo: ${session.rest_seconds.min}-${session.rest_seconds.max}s\n`;
            
            if (session.methods.length > 0) {
                prompt += `   Metodologie: ${session.methods.join(', ')}\n`;
            }
            
            if (session.recovery_warning) {
                prompt += `   ⚠️ ${session.recovery_warning}\n`;
            }
            
            prompt += `   Durata stimata: ~${session.estimated_duration} min\n\n`;
        }
        
        if (weekPlan.recommendations.length > 0) {
            prompt += `📝 RACCOMANDAZIONI SETTIMANA:\n`;
            for (const rec of weekPlan.recommendations) {
                const icon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
                prompt += `${icon} ${rec.message}\n`;
            }
        }
        
        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        
        return prompt;
    },

    /**
     * Genera singola sessione come prompt AI
     */
    generateSessionPrompt(session) {
        let prompt = `\n\n🏋️ GENERA WORKOUT: ${session.name}\n`;
        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        prompt += `PARAMETRI OBBLIGATORI:\n`;
        prompt += `• Muscoli focus: ${session.focus_muscles.join(', ')}\n`;
        prompt += `• Pattern movimento: ${session.movement_patterns.join(', ')}\n`;
        prompt += `• Serie totali: ${session.total_sets}\n`;
        prompt += `• Ripetizioni: ${session.rep_range.min}-${session.rep_range.max}\n`;
        prompt += `• Intensità: ${session.intensity_percent}%\n`;
        prompt += `• RPE target: ${session.rpe_target}\n`;
        prompt += `• Riposo: ${session.rest_seconds.min}-${session.rest_seconds.max}s\n\n`;
        
        if (session.methods_mandatory && session.methods.length > 0) {
            prompt += `METODOLOGIE (usa almeno 1):\n`;
            for (const method of session.methods) {
                prompt += `• ${method.replace(/_/g, ' ')}\n`;
            }
            prompt += '\n';
        }
        
        if (session.secondary_muscles.length > 0) {
            prompt += `Muscoli secondari (opzionale): ${session.secondary_muscles.join(', ')}\n\n`;
        }
        
        if (session.avoid_muscles.length > 0) {
            prompt += `⛔ EVITA questi muscoli (non recuperati): ${session.avoid_muscles.join(', ')}\n\n`;
        }
        
        prompt += `Durata target: ${session.estimated_duration} minuti\n`;
        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        
        return prompt;
    }
};

// Export per browser
window.AtlasWeekGenerator = AtlasWeekGenerator;
