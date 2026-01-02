/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧠 ATLAS NEURAL CORTEX v1.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sistema cerebrale centrale che orchestra TUTTI i moduli ATLAS.
 * Replica il pensiero umano con 7 aree specializzate interconnesse.
 * 
 * ARCHITETTURA:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  SENSORY INPUT → PROCESSING CENTERS → MOTOR OUTPUT                 │
 * │       ↑              ↕                    ↓                         │
 * │  ┌─────────────────────────────────────────────────────────────┐   │
 * │  │              MEMORY SYSTEMS (Learning)                       │   │
 * │  └─────────────────────────────────────────────────────────────┘   │
 * └─────────────────────────────────────────────────────────────────────┘
 * 
 * Autore: GR Perform AI Team
 * Versione: 1.0.0 NASA-Level
 * Data: 2024-2025
 */

window.ATLASNeuralCortex = (function() {
    'use strict';

    const VERSION = '1.0.0';
    const DEBUG = true;

    // ═══════════════════════════════════════════════════════════════════════════
    // 📥 SENSORY INPUT - Raccolta dati completa
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Costruisce lo stato completo dell'atleta da tutte le fonti
     * Come i sensi che raccolgono informazioni dall'ambiente
     */
    const SensoryInput = {
        
        /**
         * Raccoglie TUTTI i dati disponibili sull'atleta
         * @param {Object} profile - Profilo atleta
         * @param {Object} options - Opzioni aggiuntive (history, calendar, etc.)
         * @returns {Object} Stato completo dell'atleta
         */
        gatherState(profile, options = {}) {
            const state = {
                timestamp: new Date().toISOString(),
                confidence: 1.0,
                dataSources: [],
                
                // Core athlete data
                athlete: this.processAthleteProfile(profile),
                
                // Recovery systems
                recovery: this.processRecoveryState(profile, options.history),
                
                // Fatigue metrics
                fatigue: this.processFatigueState(profile, options.history),
                
                // Calendar context
                calendar: this.processCalendarContext(profile, options.targetDay),
                
                // Physical constraints
                constraints: this.processConstraints(profile, options),
                
                // Historical patterns
                patterns: this.processHistoricalPatterns(options.history),
                
                // Current session goals
                goals: this.processSessionGoals(profile, options)
            };
            
            // Calcola confidence basata su dati disponibili
            state.confidence = this.calculateDataConfidence(state);
            
            if (DEBUG) {
                console.log('🧠 SensoryInput: State gathered', {
                    confidence: state.confidence,
                    dataSources: state.dataSources.length
                });
            }
            
            return state;
        },
        
        /**
         * Processa profilo atleta
         */
        processAthleteProfile(profile) {
            if (!profile) return { valid: false };
            
            this.dataSources = this.dataSources || [];
            this.dataSources.push('profile');
            
            return {
                valid: true,
                name: profile.name || 'Atleta',
                sport: profile.sport || 'palestra',
                experience: profile.experience || 'intermediate',
                goal: profile.goal || 'forza',
                age: profile.age || 30,
                weight: profile.weight || 75,
                height: profile.height || 175,
                trainingDays: profile.training_days || 4,
                sessionDuration: profile.session_duration || 60,
                
                // Anamnesi
                injuries: profile.injuries || [],
                limitations: profile.limitations || [],
                preferences: profile.preferences || {},
                
                // Sport-specific
                role: profile.role || null,
                competitionLevel: profile.competition_level || 'amateur'
            };
        },
        
        /**
         * Processa stato di recupero da tutti i sistemi
         */
        processRecoveryState(profile, history) {
            const recovery = {
                muscular: {},
                cns: 100,
                systemic: 100,
                readiness: 100
            };
            
            // Usa ATLASRecovery se disponibile
            if (window.ATLASRecovery && history && history.length > 0) {
                try {
                    const recoveryState = ATLASRecovery.calculateRecoveryState(history, profile);
                    
                    // Estrai recupero muscolare
                    if (recoveryState.muscleRecovery) {
                        recovery.muscular = recoveryState.muscleRecovery;
                    }
                    
                    // Estrai CNS
                    if (recoveryState.cnsState) {
                        recovery.cns = recoveryState.cnsState.percentage || 100;
                    }
                    
                    // Readiness
                    if (recoveryState.readiness) {
                        recovery.readiness = recoveryState.readiness;
                    }
                    
                    this.dataSources = this.dataSources || [];
                    this.dataSources.push('recovery_calculated');
                } catch (e) {
                    console.warn('Recovery calculation failed:', e);
                }
            }
            
            // Usa dati quick check se disponibili
            if (profile.quickCheck) {
                recovery.subjective = {
                    energy: profile.quickCheck.energy || 7,
                    soreness: profile.quickCheck.soreness || 3,
                    motivation: profile.quickCheck.motivation || 7,
                    sleep: profile.quickCheck.sleep || 7
                };
                
                // Aggiusta readiness basato su quick check
                const avgQuick = (
                    recovery.subjective.energy + 
                    (10 - recovery.subjective.soreness) + 
                    recovery.subjective.motivation + 
                    recovery.subjective.sleep
                ) / 4;
                
                recovery.readiness = Math.round(avgQuick * 10);
                this.dataSources = this.dataSources || [];
                this.dataSources.push('quick_check');
            }
            
            return recovery;
        },
        
        /**
         * Processa stato di fatica (acuta e cronica)
         */
        processFatigueState(profile, history) {
            const fatigue = {
                acute: 5,       // Fatica oggi (1-10)
                chronic: 5,     // Fatica trend settimanale (1-10)
                ratio: 1.0,     // Acute:Chronic ratio (TSB)
                trend: 'stable' // increasing, decreasing, stable
            };
            
            if (!history || history.length === 0) {
                return fatigue;
            }
            
            // Calcola fatica acuta (ultimi 3 giorni)
            const now = Date.now();
            const threeDaysAgo = now - (3 * 24 * 60 * 60 * 1000);
            const recentWorkouts = history.filter(w => 
                new Date(w.date || w.timestamp).getTime() > threeDaysAgo
            );
            
            if (recentWorkouts.length > 0) {
                // Stima fatica basata su volume e intensità recenti
                let totalLoad = 0;
                recentWorkouts.forEach(w => {
                    const exercises = w.exercises || [];
                    exercises.forEach(ex => {
                        const sets = parseInt(ex.sets) || 3;
                        const reps = parseInt(String(ex.reps).replace(/\D/g, '')) || 8;
                        totalLoad += sets * reps;
                    });
                });
                
                // Normalizza su scala 1-10
                fatigue.acute = Math.min(10, Math.round(totalLoad / 50));
            }
            
            // Calcola fatica cronica (ultime 3 settimane)
            const threeWeeksAgo = now - (21 * 24 * 60 * 60 * 1000);
            const chronicWorkouts = history.filter(w =>
                new Date(w.date || w.timestamp).getTime() > threeWeeksAgo
            );
            
            if (chronicWorkouts.length > 0) {
                fatigue.chronic = Math.min(10, Math.round(chronicWorkouts.length / 3));
            }
            
            // TSB (Training Stress Balance)
            if (fatigue.chronic > 0) {
                fatigue.ratio = fatigue.acute / fatigue.chronic;
            }
            
            // Trend
            if (fatigue.ratio > 1.3) {
                fatigue.trend = 'increasing';
            } else if (fatigue.ratio < 0.7) {
                fatigue.trend = 'decreasing';
            }
            
            return fatigue;
        },
        
        /**
         * Processa contesto calendario
         */
        processCalendarContext(profile, targetDay) {
            const calendar = {
                today: this.getDayName(new Date().getDay()),
                targetDay: targetDay || this.getDayName(new Date().getDay()),
                daysToMatch: null,
                daysFromLastHeavy: null,
                weekSchedule: profile.weekly_schedule || {},
                externalLoad: null
            };
            
            // Cerca prossima partita/gara
            if (profile.weekly_schedule) {
                const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                const todayIdx = days.indexOf(calendar.today.toLowerCase());
                
                for (let i = 1; i <= 7; i++) {
                    const checkIdx = (todayIdx + i) % 7;
                    const dayActivity = profile.weekly_schedule[days[checkIdx]];
                    
                    if (dayActivity && /match|partita|gara/i.test(String(dayActivity))) {
                        calendar.daysToMatch = i;
                        break;
                    }
                }
                
                // Attività domani
                const tomorrowIdx = (todayIdx + 1) % 7;
                calendar.externalLoad = profile.weekly_schedule[days[tomorrowIdx]] || null;
            }
            
            return calendar;
        },
        
        /**
         * Processa vincoli fisici e logistici
         */
        processConstraints(profile, options) {
            return {
                time: profile.session_duration || options.timeAvailable || 60,
                equipment: profile.equipment || ['full_gym'],
                injuries: profile.injuries || [],
                painAreas: profile.pain_areas || [],
                space: profile.training_space || 'gym',
                noiseLimit: profile.noise_limit || false
            };
        },
        
        /**
         * Analizza pattern storici
         */
        processHistoricalPatterns(history) {
            const patterns = {
                preferredExercises: [],
                avoidedExercises: [],
                bestMethods: [],
                worstMethods: [],
                averageVolume: 0,
                averageRPE: 7,
                responseToHeavy: 'normal',
                recoverySpeed: 'normal'
            };
            
            if (!history || history.length < 5) {
                return patterns;
            }
            
            // Analisi base - può essere espansa con ML
            const exerciseCounts = {};
            let totalVolume = 0;
            let rpeSum = 0;
            let rpeCount = 0;
            
            history.forEach(workout => {
                const exercises = workout.exercises || [];
                exercises.forEach(ex => {
                    const name = (ex.name || '').toLowerCase();
                    exerciseCounts[name] = (exerciseCounts[name] || 0) + 1;
                    totalVolume += (parseInt(ex.sets) || 3) * (parseInt(String(ex.reps).replace(/\D/g, '')) || 8);
                    
                    if (workout.feedback?.rpe) {
                        rpeSum += workout.feedback.rpe;
                        rpeCount++;
                    }
                });
            });
            
            patterns.averageVolume = Math.round(totalVolume / history.length);
            if (rpeCount > 0) {
                patterns.averageRPE = Math.round(rpeSum / rpeCount * 10) / 10;
            }
            
            return patterns;
        },
        
        /**
         * Processa obiettivi della sessione
         */
        processSessionGoals(profile, options) {
            return {
                primary: profile.goal || 'forza',
                phase: profile.phase || options.phase || 'accumulo',
                focus: options.focus || null,
                mustInclude: options.mustInclude || [],
                mustAvoid: options.mustAvoid || []
            };
        },
        
        /**
         * Calcola confidenza nei dati raccolti
         */
        calculateDataConfidence(state) {
            let confidence = 0.5; // Base
            
            if (state.athlete?.valid) confidence += 0.15;
            if (state.recovery?.muscular && Object.keys(state.recovery.muscular).length > 0) confidence += 0.15;
            if (state.fatigue?.acute !== 5) confidence += 0.1;
            if (state.patterns?.averageVolume > 0) confidence += 0.1;
            
            return Math.min(1.0, confidence);
        },
        
        /**
         * Helper per nome giorno
         */
        getDayName(dayNum) {
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            return days[dayNum] || 'monday';
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🧠 PROCESSING CENTERS - Le 7 aree cerebrali
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * PREFRONTAL CORTEX - Decisioni strategiche di alto livello
     * Decide COSA fare oggi (tipo di workout, intensità generale)
     */
    const PrefrontalCortex = {
        name: 'Prefrontal Cortex',
        role: 'Strategic Decision Making',
        
        /**
         * Decisione strategica principale
         * @param {Object} state - Stato completo dell'atleta
         * @returns {Object} Decisione strategica
         */
        process(state) {
            const decision = {
                area: this.name,
                action: 'NORMAL_WORKOUT',
                intensity: 'moderate',
                volume: 'normal',
                reasoning: [],
                confidence: 0.8,
                vetoes: [],
                suggestions: []
            };
            
            // ══════════════════════════════════════════════════════════════
            // REGOLA 1: Pre-partita (1-2 giorni)
            // ══════════════════════════════════════════════════════════════
            if (state.calendar.daysToMatch !== null && state.calendar.daysToMatch <= 2) {
                decision.action = 'PRE_COMPETITION';
                decision.intensity = 'low';
                decision.volume = 'minimal';
                decision.reasoning.push(`Partita tra ${state.calendar.daysToMatch} giorni - preservare freschezza`);
                decision.vetoes.push('heavy_compound', 'high_volume', 'new_exercises');
            }
            
            // ══════════════════════════════════════════════════════════════
            // REGOLA 2: Post-partita (giorno dopo)
            // ══════════════════════════════════════════════════════════════
            else if (state.calendar.externalLoad && /match|partita|gara/i.test(String(state.calendar.externalLoad))) {
                // Domani c'è partita = oggi deve essere leggero
                decision.intensity = 'light';
                decision.volume = 'reduced';
                decision.reasoning.push('Partita domani - solo attivazione');
            }
            
            // ══════════════════════════════════════════════════════════════
            // REGOLA 3: CNS basso (< 60%)
            // ══════════════════════════════════════════════════════════════
            if (state.recovery.cns < 60) {
                decision.action = 'RECOVERY_FOCUS';
                decision.intensity = 'light';
                decision.reasoning.push(`CNS al ${state.recovery.cns}% - evitare sovraccarico neurale`);
                decision.vetoes.push('heavy_singles', 'explosive_work', 'max_effort');
            }
            
            // ══════════════════════════════════════════════════════════════
            // REGOLA 4: Readiness basso (< 50%)
            // ══════════════════════════════════════════════════════════════
            if (state.recovery.readiness < 50) {
                decision.action = 'REST_DAY';
                decision.intensity = 'none';
                decision.volume = 'none';
                decision.reasoning.push(`Readiness al ${state.recovery.readiness}% - giorno di riposo consigliato`);
            }
            
            // ══════════════════════════════════════════════════════════════
            // REGOLA 5: Fatica acuta alta + trend crescente
            // ══════════════════════════════════════════════════════════════
            if (state.fatigue.acute >= 8 && state.fatigue.trend === 'increasing') {
                decision.action = 'DELOAD';
                decision.intensity = 'light';
                decision.volume = 'reduced';
                decision.reasoning.push('Fatica accumulata in aumento - deload necessario');
            }
            
            // ══════════════════════════════════════════════════════════════
            // REGOLA 6: Tutto ok - workout normale
            // ══════════════════════════════════════════════════════════════
            if (decision.action === 'NORMAL_WORKOUT') {
                // Determina intensità ottimale
                if (state.recovery.cns > 85 && state.recovery.readiness > 80) {
                    decision.intensity = 'high';
                    decision.reasoning.push('CNS e readiness ottimali - via libera per intensità');
                } else if (state.recovery.cns > 70) {
                    decision.intensity = 'moderate';
                }
                
                // Volume basato su goal
                if (state.goals.phase === 'accumulo') {
                    decision.volume = 'high';
                } else if (state.goals.phase === 'intensificazione') {
                    decision.volume = 'moderate';
                } else if (state.goals.phase === 'peaking') {
                    decision.volume = 'low';
                }
            }
            
            if (DEBUG) {
                console.log('🧠 PrefrontalCortex:', decision.action, decision.reasoning);
            }
            
            return decision;
        }
    };

    /**
     * MOTOR CORTEX - Selezione esercizi e movimenti
     * Decide QUALI esercizi fare e in che ordine
     */
    const MotorCortex = {
        name: 'Motor Cortex',
        role: 'Exercise Selection & Sequencing',
        
        /**
         * Selezione esercizi basata su stato e decisione strategica
         */
        process(state, strategicDecision) {
            const selection = {
                area: this.name,
                exerciseCategories: [],
                sequenceRules: [],
                muscleTargets: [],
                avoidMuscles: [],
                reasoning: []
            };
            
            // Identifica muscoli da evitare (recupero < 60%)
            if (state.recovery.muscular) {
                for (const [muscle, data] of Object.entries(state.recovery.muscular)) {
                    const pct = typeof data === 'object' ? data.percentage : data;
                    if (pct < 60) {
                        selection.avoidMuscles.push({
                            muscle,
                            recovery: pct,
                            reason: `${muscle} solo ${pct}% recuperato`
                        });
                    }
                }
            }
            
            // Categorie esercizi basate su intensità decisa
            if (strategicDecision.intensity === 'high') {
                selection.exerciseCategories = ['compound_heavy', 'compound_moderate', 'accessory'];
                selection.sequenceRules.push('Start with heaviest compound');
            } else if (strategicDecision.intensity === 'moderate') {
                selection.exerciseCategories = ['compound_moderate', 'accessory', 'isolation'];
            } else if (strategicDecision.intensity === 'light') {
                selection.exerciseCategories = ['activation', 'mobility', 'light_pump'];
            }
            
            // Target muscoli basato su goal e split
            if (state.goals.focus) {
                selection.muscleTargets = this.getMusclesForFocus(state.goals.focus);
            } else {
                // Auto-seleziona muscoli più recuperati
                selection.muscleTargets = this.selectRecoveredMuscles(state.recovery.muscular);
            }
            
            // ══════════════════════════════════════════════════════════════
            // STRUCTURAL BALANCE INTEGRATION
            // Prioritizza muscoli deboli se ci sono squilibri
            // ══════════════════════════════════════════════════════════════
            if (typeof AtlasStructuralBalance !== 'undefined' && state.athlete?.id) {
                try {
                    const analysis = AtlasStructuralBalance.getFullAnalysis(state.athlete.id, state.athlete);
                    const issues = analysis?.analysis?.issues || [];
                    
                    // Aggiungi muscoli deboli come priorità
                    issues.forEach(issue => {
                        if (issue.ratio === 'hamstring_quad' && issue.type === 'critical') {
                            if (!selection.muscleTargets.includes('hamstrings')) {
                                selection.muscleTargets.unshift('hamstrings');
                                selection.reasoning.push('⚖️ Priorità hamstrings per squilibrio H/Q');
                            }
                            selection.correctiveExercises = selection.correctiveExercises || [];
                            selection.correctiveExercises.push(
                                { name: 'Romanian Deadlift', sets: 3, reps: '10-12', priority: 'high' },
                                { name: 'Leg Curl', sets: 3, reps: '12-15', priority: 'medium' }
                            );
                        }
                        if (issue.ratio === 'pull_push' && issue.type === 'critical') {
                            if (!selection.muscleTargets.includes('back')) {
                                selection.muscleTargets.unshift('back');
                                selection.reasoning.push('⚖️ Priorità back per squilibrio Pull/Push');
                            }
                            selection.correctiveExercises = selection.correctiveExercises || [];
                            selection.correctiveExercises.push(
                                { name: 'Face Pull', sets: 3, reps: '15-20', priority: 'high' },
                                { name: 'Band Pull Apart', sets: 2, reps: '20', priority: 'medium' }
                            );
                        }
                    });
                    
                    if (selection.correctiveExercises?.length > 0) {
                        selection.reasoning.push(`⚖️ ${selection.correctiveExercises.length} esercizi correttivi aggiunti`);
                    }
                } catch (e) {
                    console.warn('MotorCortex structural balance check failed:', e);
                }
            }
            
            // Aggiungi reasoning
            if (selection.avoidMuscles.length > 0) {
                selection.reasoning.push(
                    `Evitare: ${selection.avoidMuscles.map(m => m.muscle).join(', ')} (recupero insufficiente)`
                );
            }
            
            if (DEBUG) {
                console.log('🧠 MotorCortex:', selection);
            }
            
            return selection;
        },
        
        getMusclesForFocus(focus) {
            const focusMap = {
                'upper': ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
                'lower': ['quadriceps', 'hamstrings', 'glutes', 'calves'],
                'push': ['chest', 'shoulders', 'triceps'],
                'pull': ['back', 'biceps', 'rear_delts'],
                'full_body': ['quadriceps', 'chest', 'back', 'shoulders'],
                'posterior_chain': ['hamstrings', 'glutes', 'back', 'calves']
            };
            return focusMap[focus] || ['quadriceps', 'chest', 'back'];
        },
        
        selectRecoveredMuscles(muscularRecovery) {
            if (!muscularRecovery || Object.keys(muscularRecovery).length === 0) {
                return ['quadriceps', 'chest', 'back'];
            }
            
            // Ordina per recupero e prendi top 4
            return Object.entries(muscularRecovery)
                .map(([muscle, data]) => ({
                    muscle,
                    pct: typeof data === 'object' ? data.percentage : data
                }))
                .sort((a, b) => b.pct - a.pct)
                .slice(0, 4)
                .map(m => m.muscle);
        }
    };

    /**
     * LIMBIC SYSTEM - Gestione fatica, motivazione, stress
     * Regola intensità sostenibile basata su stato emotivo/energetico
     * 
     * v1.1: Ora con RPE ADATTIVO basato su ATLASAthleteLearning
     */
    const LimbicSystem = {
        name: 'Limbic System',
        role: 'Fatigue & Motivation Management',
        
        process(state, strategicDecision) {
            const output = {
                area: this.name,
                sustainableRPE: 7,
                motivationFactor: 1.0,
                stressLevel: 'normal',
                adjustments: [],
                reasoning: [],
                // NUOVO: dati RPE personalizzati
                rpeCalibration: null
            };
            
            // ══════════════════════════════════════════════════════════════
            // NUOVO: Integrazione con ATLASAthleteLearning per RPE adattivo
            // ══════════════════════════════════════════════════════════════
            let rpeAdjustment = 0;
            
            if (window.ATLASAthleteLearning && state.athlete?.id) {
                try {
                    const model = ATLASAthleteLearning.getModel(state.athlete.id);
                    
                    if (model.sessionsAnalyzed >= 3 && model.rpeCalibration.confidence > 0.2) {
                        const bias = model.rpeCalibration.bias;
                        const goal = (state.goals.primary || 'forza').toLowerCase();
                        
                        output.rpeCalibration = {
                            bias: bias,
                            confidence: model.rpeCalibration.confidence,
                            adjustedTargets: model.rpeCalibration.adjustedTargets
                        };
                        
                        // Se l'atleta tende a sovra-stimare (bias > 0), alziamo il target
                        // Se l'atleta tende a sotto-stimare (bias < 0), abbassiamo il target
                        if (Math.abs(bias) > 0.5) {
                            rpeAdjustment = -Math.round(bias);
                            output.reasoning.push(
                                `RPE calibrato: ${bias > 0 ? 'atleta sovra-stima' : 'atleta sotto-stima'} → ${rpeAdjustment > 0 ? '+' : ''}${rpeAdjustment} RPE`
                            );
                        }
                        
                        // Usa target adattato se disponibile
                        if (model.rpeCalibration.adjustedTargets[goal]) {
                            output.sustainableRPE = model.rpeCalibration.adjustedTargets[goal];
                        }
                    }
                    
                    // Usa anche moltiplicatore intensità dal learning
                    if (model.sessionsAnalyzed >= 3 && model.intensityProfile.confidence > 0.3) {
                        const intMult = model.intensityProfile.globalMultiplier;
                        
                        if (intMult > 1.1) {
                            // Atleta vuole più intensità
                            rpeAdjustment += 0.5;
                            output.reasoning.push('Learning: atleta preferisce intensità alte');
                        } else if (intMult < 0.9) {
                            // Atleta preferisce meno intensità
                            rpeAdjustment -= 0.5;
                            output.reasoning.push('Learning: atleta preferisce intensità moderate');
                        }
                    }
                } catch (e) {
                    console.warn('LimbicSystem: Error loading learning model', e);
                }
            }
            
            // ══════════════════════════════════════════════════════════════
            // RPE base basato su fatica
            // ══════════════════════════════════════════════════════════════
            if (state.fatigue.acute >= 8) {
                output.sustainableRPE = 6;
                output.adjustments.push({ type: 'reduce_rpe', from: 8, to: 6 });
                output.reasoning.push('Fatica acuta alta - RPE massimo 6');
            } else if (state.fatigue.acute >= 6) {
                output.sustainableRPE = 7;
            } else {
                output.sustainableRPE = 8;
            }
            
            // Applica adjustment da learning
            if (rpeAdjustment !== 0) {
                const oldRPE = output.sustainableRPE;
                output.sustainableRPE = Math.max(5, Math.min(10, 
                    output.sustainableRPE + rpeAdjustment
                ));
                
                if (oldRPE !== output.sustainableRPE) {
                    output.adjustments.push({
                        type: 'learning_rpe_adjust',
                        from: oldRPE,
                        to: output.sustainableRPE,
                        reason: 'adaptive_rpe'
                    });
                }
            }
            
            // ══════════════════════════════════════════════════════════════
            // Motivazione da quick check
            // ══════════════════════════════════════════════════════════════
            if (state.recovery.subjective?.motivation) {
                const mot = state.recovery.subjective.motivation;
                if (mot <= 4) {
                    output.motivationFactor = 0.8;
                    output.reasoning.push('Motivazione bassa - volume ridotto 20%');
                } else if (mot >= 8) {
                    output.motivationFactor = 1.1;
                    output.reasoning.push('Alta motivazione - possibile extra set');
                }
            }
            
            // ══════════════════════════════════════════════════════════════
            // Stress da sleep
            // ══════════════════════════════════════════════════════════════
            if (state.recovery.subjective?.sleep && state.recovery.subjective.sleep <= 4) {
                output.stressLevel = 'high';
                output.sustainableRPE = Math.min(output.sustainableRPE, 6);
                output.reasoning.push('Sonno scarso - priorità recupero');
            }
            
            if (DEBUG) console.log('🧠 LimbicSystem:', output);
            return output;
        }
    };

    /**
     * CEREBELLUM - Timing, coordinazione, rest periods
     * Ottimizza i tempi di recupero e la struttura delle serie
     */
    const Cerebellum = {
        name: 'Cerebellum',
        role: 'Timing & Rest Period Optimization',
        
        // Rest periods per sistema energetico
        restRules: {
            'ATP-PC': { min: 180, optimal: 240, max: 300 },      // Forza max
            'glycolytic': { min: 60, optimal: 90, max: 120 },    // Ipertrofia
            'oxidative': { min: 30, optimal: 45, max: 60 }       // Conditioning
        },
        
        process(state, strategicDecision, motorSelection) {
            const output = {
                area: this.name,
                restPeriods: {},
                tempoRecommendations: {},
                sessionPacing: 'normal',
                reasoning: []
            };
            
            // Rest basato su intensità
            if (strategicDecision.intensity === 'high') {
                output.restPeriods = {
                    compound: '180-240s',
                    accessory: '90-120s',
                    isolation: '60-90s'
                };
                output.sessionPacing = 'slow';
                output.reasoning.push('Intensità alta: rest completi per ATP-PC');
            } else if (strategicDecision.intensity === 'moderate') {
                output.restPeriods = {
                    compound: '90-120s',
                    accessory: '60-90s',
                    isolation: '45-60s'
                };
            } else {
                output.restPeriods = {
                    compound: '60-90s',
                    accessory: '45-60s',
                    isolation: '30-45s'
                };
                output.sessionPacing = 'fast';
            }
            
            // Tempo per goal
            if (state.goals.primary === 'ipertrofia' || state.goals.primary === 'massa') {
                output.tempoRecommendations = {
                    eccentric: '3-4s',
                    concentric: '1-2s',
                    pause: '1s'
                };
                output.reasoning.push('Obiettivo ipertrofia: tempo controllato per TUT');
            } else if (state.goals.primary === 'forza') {
                output.tempoRecommendations = {
                    eccentric: '2s',
                    concentric: 'explosive',
                    pause: '0-1s'
                };
            }
            
            // Aggiusta per tempo disponibile
            if (state.constraints.time < 45) {
                output.restPeriods = {
                    compound: '60-90s',
                    accessory: '45-60s',
                    isolation: '30s'
                };
                output.sessionPacing = 'fast';
                output.reasoning.push(`Solo ${state.constraints.time}min: rest abbreviati`);
            }
            
            if (DEBUG) console.log('🧠 Cerebellum:', output);
            return output;
        }
    };

    /**
     * HIPPOCAMPUS - Memoria workout passati + ATHLETE LEARNING
     * Cosa ha funzionato, cosa evitare, pattern personali
     * ORA USA DATI REALI DA ATLASAthleteLearning
     */
    const Hippocampus = {
        name: 'Hippocampus',
        role: 'Workout Memory & Pattern Recognition',
        
        process(state) {
            const output = {
                area: this.name,
                successfulPatterns: [],
                failedPatterns: [],
                personalBests: {},
                avoidanceList: [],
                suggestions: [],
                reasoning: [],
                // NUOVO: dati dal Learning Model
                learningModel: null,
                personalizedMultipliers: null
            };
            
            // ══════════════════════════════════════════════════════════════
            // NUOVO: Integrazione con ATLASAthleteLearning
            // ══════════════════════════════════════════════════════════════
            if (window.ATLASAthleteLearning && state.athlete.id) {
                try {
                    const model = ATLASAthleteLearning.getModel(state.athlete.id);
                    
                    if (model.sessionsAnalyzed >= 3) {
                        output.learningModel = {
                            sessions: model.sessionsAnalyzed,
                            intensityMult: model.intensityProfile.globalMultiplier,
                            volumeMult: model.volumeProfile.globalMultiplier,
                            recoveryMult: model.recoveryProfile.globalRecoveryMultiplier,
                            confidence: Math.min(
                                model.intensityProfile.confidence,
                                model.volumeProfile.confidence
                            )
                        };
                        
                        output.personalizedMultipliers = {
                            intensity: model.intensityProfile.globalMultiplier,
                            volume: model.volumeProfile.globalMultiplier,
                            recovery: model.recoveryProfile.globalRecoveryMultiplier
                        };
                        
                        // Esercizi preferiti → pattern di successo
                        if (model.exerciseProfile.favorites.length > 0) {
                            output.successfulPatterns = model.exerciseProfile.favorites
                                .sort((a, b) => b.score - a.score)
                                .slice(0, 5)
                                .map(f => f.name);
                            output.reasoning.push(`Esercizi preferiti: ${output.successfulPatterns.slice(0, 3).join(', ')}`);
                        }
                        
                        // Esercizi bannati → evitare
                        if (model.exerciseProfile.banned.length > 0) {
                            output.avoidanceList.push(...model.exerciseProfile.banned);
                            output.reasoning.push(`Esercizi da evitare: ${model.exerciseProfile.banned.join(', ')}`);
                        }
                        
                        // Esercizi problematici → warning
                        if (model.exerciseProfile.problematic.length > 0) {
                            output.failedPatterns = model.exerciseProfile.problematic.map(p => p.name);
                        }
                        
                        // Aree dolore cronico
                        if (model.painHistory.chronicAreas.length > 0) {
                            model.painHistory.chronicAreas.forEach(area => {
                                output.avoidanceList.push(`pain_area:${area.area}`);
                                output.reasoning.push(`⚠️ Area sensibile: ${area.area} (${area.occurrences}x)`);
                            });
                        }
                        
                        // Suggerimenti basati su learning
                        if (model.intensityProfile.globalMultiplier > 1.1) {
                            output.suggestions.push('Atleta risponde bene a intensità alte');
                        } else if (model.intensityProfile.globalMultiplier < 0.9) {
                            output.suggestions.push('Atleta preferisce intensità moderate');
                        }
                        
                        if (model.volumeProfile.globalMultiplier > 1.15) {
                            output.suggestions.push('Tollera bene volumi elevati');
                        } else if (model.volumeProfile.globalMultiplier < 0.85) {
                            output.suggestions.push('Preferisce volumi ridotti');
                        }
                        
                        if (model.recoveryProfile.globalRecoveryMultiplier > 1.2) {
                            output.suggestions.push('Recupero più lento - distanziare sessioni intense');
                        }
                        
                        output.reasoning.push(`📊 Learning model: ${model.sessionsAnalyzed} sessioni analizzate`);
                    } else {
                        output.reasoning.push(`Learning model: solo ${model.sessionsAnalyzed} sessioni (minimo 3)`);
                    }
                } catch (e) {
                    console.warn('Hippocampus: Error loading learning model', e);
                }
            }
            
            // ══════════════════════════════════════════════════════════════
            // LEGACY: Pattern da state (per retrocompatibilità)
            // ══════════════════════════════════════════════════════════════
            if (state.patterns) {
                if (state.patterns.bestMethods && state.patterns.bestMethods.length > 0) {
                    // Merge con learning model
                    output.successfulPatterns = [
                        ...new Set([...output.successfulPatterns, ...state.patterns.bestMethods])
                    ];
                }
                
                if (state.patterns.worstMethods && state.patterns.worstMethods.length > 0) {
                    output.failedPatterns = [
                        ...new Set([...output.failedPatterns, ...state.patterns.worstMethods])
                    ];
                    output.avoidanceList.push(...state.patterns.worstMethods);
                }
                
                // RPE storico
                if (state.patterns.averageRPE > 8.5) {
                    output.reasoning.push('Storico: tendenza a spingersi troppo - moderare');
                    output.suggestions.push('Considera RPE target inferiore');
                }
            }
            
            // Evitare esercizi correlati a infortuni
            if (state.athlete.injuries && state.athlete.injuries.length > 0) {
                output.avoidanceList.push(...state.athlete.injuries.map(i => `injury:${i}`));
                output.reasoning.push(`Infortuni storici: ${state.athlete.injuries.join(', ')}`);
            }
            
            if (DEBUG) console.log('🧠 Hippocampus:', output);
            return output;
        }
    };

    /**
     * AMYGDALA - Risk assessment, protezione infortuni
     * Valuta rischi e blocca azioni pericolose
     */
    const Amygdala = {
        name: 'Amygdala',
        role: 'Risk Assessment & Injury Prevention',
        
        // Soglie di rischio
        riskThresholds: {
            injury_imminent: 0.8,
            injury_high: 0.6,
            injury_moderate: 0.4,
            injury_low: 0.2
        },
        
        process(state, allPreviousOutputs) {
            const output = {
                area: this.name,
                overallRisk: 0,
                riskFactors: [],
                absoluteVetoes: [],
                warnings: [],
                greenLights: [],
                reasoning: []
            };
            
            let riskScore = 0;
            
            // ══════════════════════════════════════════════════════════════
            // RISK FACTOR 1: Infortuni attivi
            // ══════════════════════════════════════════════════════════════
            if (state.constraints.injuries && state.constraints.injuries.length > 0) {
                riskScore += 0.3;
                output.riskFactors.push({
                    factor: 'active_injuries',
                    severity: 'high',
                    items: state.constraints.injuries
                });
                
                // Veto assoluto per esercizi che coinvolgono area infortunata
                state.constraints.injuries.forEach(injury => {
                    output.absoluteVetoes.push({
                        type: 'exercise_pattern',
                        pattern: this.getInjuryExercisePattern(injury),
                        reason: `Infortunio attivo: ${injury}`
                    });
                });
            }
            
            // ══════════════════════════════════════════════════════════════
            // RISK FACTOR 2: CNS depleto + intensità alta richiesta
            // ══════════════════════════════════════════════════════════════
            if (state.recovery.cns < 50) {
                riskScore += 0.25;
                output.riskFactors.push({
                    factor: 'cns_depleted',
                    severity: 'high',
                    value: state.recovery.cns
                });
                output.absoluteVetoes.push({
                    type: 'intensity',
                    pattern: 'max_effort',
                    reason: `CNS al ${state.recovery.cns}% - rischio coordinazione compromessa`
                });
            }
            
            // ══════════════════════════════════════════════════════════════
            // RISK FACTOR 3: Muscoli non recuperati
            // ══════════════════════════════════════════════════════════════
            if (allPreviousOutputs?.motor?.avoidMuscles?.length > 0) {
                const severelyFatigued = allPreviousOutputs.motor.avoidMuscles.filter(m => m.recovery < 40);
                if (severelyFatigued.length > 0) {
                    riskScore += 0.2;
                    output.riskFactors.push({
                        factor: 'muscle_fatigue',
                        severity: 'medium',
                        muscles: severelyFatigued
                    });
                    
                    severelyFatigued.forEach(m => {
                        output.absoluteVetoes.push({
                            type: 'muscle_target',
                            muscle: m.muscle,
                            reason: `${m.muscle} al ${m.recovery}% - rischio strain`
                        });
                    });
                }
            }
            
            // ══════════════════════════════════════════════════════════════
            // RISK FACTOR 4: Esperienza insufficiente per metodi avanzati
            // ══════════════════════════════════════════════════════════════
            if (state.athlete.experience === 'beginner') {
                output.absoluteVetoes.push(
                    // Metodi intensità avanzata
                    { type: 'method', pattern: 'cluster_set', reason: 'Beginner: metodo troppo avanzato' },
                    { type: 'method', pattern: 'rest_pause', reason: 'Beginner: richiede esperienza gestione fatica' },
                    { type: 'method', pattern: 'eccentric_overload', reason: 'Beginner: rischio elevato per tendini' },
                    { type: 'method', pattern: 'myo_reps', reason: 'Beginner: richiede calibrazione RPE' },
                    { type: 'method', pattern: 'drop_set', reason: 'Beginner: troppo stress metabolico' },
                    // Metodi potenza/esplosività
                    { type: 'method', pattern: 'contrast_method', reason: 'Beginner: richiede base di forza' },
                    { type: 'method', pattern: 'complex_training', reason: 'Beginner: troppo avanzato' },
                    { type: 'method', pattern: 'plyometric', reason: 'Beginner: costruire prima forza base' },
                    // Metodi volume estremo
                    { type: 'method', pattern: 'giant_set', reason: 'Beginner: volume eccessivo' },
                    { type: 'method', pattern: 'gvt', reason: 'Beginner: 10x10 troppo impegnativo' }
                );
                output.reasoning.push('Principiante: esclusi metodi avanzati per sicurezza');
            }
            
            // Intermediate: alcuni metodi ancora rischiosi
            if (state.athlete.experience === 'intermediate') {
                output.absoluteVetoes.push(
                    { type: 'method', pattern: 'eccentric_overload', reason: 'Intermediate: richiede esperienza avanzata' },
                    { type: 'method', pattern: 'vbt', reason: 'Intermediate: richiede attrezzatura e calibrazione' }
                );
            }
            
            // ══════════════════════════════════════════════════════════════
            // GREEN LIGHTS - Cose sicure da fare
            // ══════════════════════════════════════════════════════════════
            if (riskScore < 0.2 && state.recovery.readiness > 80) {
                output.greenLights.push('heavy_compound', 'new_exercises', 'intensity_methods');
                output.reasoning.push('Condizioni ottimali - via libera per workout impegnativo');
            }
            
            if (state.athlete.experience === 'advanced' && riskScore < 0.4) {
                output.greenLights.push('advanced_methods', 'eccentric_work');
            }
            
            // ══════════════════════════════════════════════════════════════
            // RISK FACTOR 5: Structural Balance Imbalances
            // ══════════════════════════════════════════════════════════════
            if (typeof AtlasStructuralBalance !== 'undefined' && state.athlete?.id) {
                try {
                    const structuralRisks = AtlasStructuralBalance.getRiskFactors(
                        state.athlete.id, 
                        state.athlete
                    );
                    
                    if (structuralRisks && structuralRisks.length > 0) {
                        structuralRisks.forEach(risk => {
                            riskScore += risk.severity * 0.15;
                            output.riskFactors.push({
                                factor: 'structural_imbalance',
                                severity: risk.severity > 0.5 ? 'high' : 'medium',
                                description: risk.risk,
                                ratio: risk.ratio
                            });
                            
                            output.warnings.push({
                                type: 'structural',
                                message: risk.risk,
                                correction: risk.correction
                            });
                            
                            output.reasoning.push(`⚖️ Squilibrio strutturale: ${risk.name} - ${risk.correction}`);
                        });
                    }
                } catch (e) {
                    console.warn('Structural balance check failed:', e);
                }
            }
            
            output.overallRisk = Math.min(1, riskScore);
            
            // Classificazione rischio
            if (output.overallRisk >= this.riskThresholds.injury_imminent) {
                output.warnings.push({
                    level: 'CRITICAL',
                    message: 'RISCHIO INFORTUNIO IMMINENTE - Solo mobilità/recupero'
                });
            } else if (output.overallRisk >= this.riskThresholds.injury_high) {
                output.warnings.push({
                    level: 'HIGH',
                    message: 'Rischio elevato - Ridurre significativamente intensità'
                });
            }
            
            if (DEBUG) console.log('🧠 Amygdala:', output);
            return output;
        },
        
        getInjuryExercisePattern(injury) {
            const patterns = {
                'shoulder': /press|fly|raise|pull.*up|dip/i,
                'knee': /squat|lunge|leg.*press|extension/i,
                'back': /deadlift|row|good.*morning|hyperextension/i,
                'wrist': /curl|press|push.*up/i,
                'ankle': /calf|jump|run|sprint/i,
                'hip': /squat|deadlift|lunge|hip/i,
                'elbow': /curl|extension|press|dip/i
            };
            return patterns[injury.toLowerCase()] || new RegExp(injury, 'i');
        }
    };

    /**
     * BASAL GANGLIA - Pattern abituali, metodologie preferite
     * Scorciatoie consolidate, routine efficaci
     */
    const BasalGanglia = {
        name: 'Basal Ganglia',
        role: 'Habitual Patterns & Method Selection',
        
        process(state, allPreviousOutputs) {
            const output = {
                area: this.name,
                recommendedMethods: [],
                avoidMethods: [],
                routinePatterns: {},
                reasoning: []
            };
            
            // Usa MethodSelector se disponibile
            if (window.MethodSelector) {
                const context = {
                    goal: this.mapGoal(state.goals.primary),
                    phase: state.goals.phase,
                    experience: state.athlete.experience,
                    fatigue: state.fatigue.acute,
                    time_available: state.constraints.time,
                    equipment: state.constraints.equipment,
                    sport: state.athlete.sport,
                    pain_areas: state.constraints.painAreas,
                    rpe_tolerance: allPreviousOutputs?.limbic?.sustainableRPE || 7
                };
                
                try {
                    const methods = MethodSelector.selectMethods(context);
                    output.recommendedMethods = methods.slice(0, 3);
                    output.reasoning.push(`Top metodi: ${methods.slice(0, 3).map(m => m.method.name).join(', ')}`);
                } catch (e) {
                    console.warn('MethodSelector failed:', e);
                }
            }
            
            // Filtra metodi vetati da Amygdala
            if (allPreviousOutputs?.amygdala?.absoluteVetoes) {
                const methodVetoes = allPreviousOutputs.amygdala.absoluteVetoes
                    .filter(v => v.type === 'method')
                    .map(v => v.pattern);
                
                output.recommendedMethods = output.recommendedMethods.filter(m => 
                    !methodVetoes.some(veto => m.key.includes(veto))
                );
                
                output.avoidMethods = methodVetoes;
            }
            
            // Pattern di routine per sport
            output.routinePatterns = this.getSportRoutine(state.athlete.sport);
            
            if (DEBUG) console.log('🧠 BasalGanglia:', output);
            return output;
        },
        
        mapGoal(goal) {
            const map = {
                'forza': 'forza',
                'strength': 'forza',
                'massa': 'massa',
                'ipertrofia': 'massa',
                'hypertrophy': 'massa',
                'definizione': 'definizione',
                'conditioning': 'definizione',
                'potenza': 'performance',
                'power': 'performance',
                'performance': 'performance'
            };
            return map[(goal || '').toLowerCase()] || 'forza';
        },
        
        getSportRoutine(sport) {
            const routines = {
                'calcio': {
                    warmup: 'dynamic_mobility',
                    main: 'power_then_strength',
                    finish: 'conditioning_circuit',
                    must_include: ['hip_mobility', 'hamstring_work', 'core']
                },
                'basket': {
                    warmup: 'plyometric_activation',
                    main: 'vertical_power',
                    finish: 'agility_work',
                    must_include: ['jump_training', 'lateral_movement']
                },
                'boxe': {
                    warmup: 'shadow_activation',
                    main: 'power_endurance',
                    finish: 'core_intensive',
                    must_include: ['rotational_power', 'neck_work', 'conditioning']
                },
                'palestra': {
                    warmup: 'movement_prep',
                    main: 'goal_specific',
                    finish: 'weak_point',
                    must_include: ['compound_movement']
                }
            };
            return routines[sport] || routines['palestra'];
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔌 API PUBBLICA COMPLETA
    // ═══════════════════════════════════════════════════════════════════════════

    return {
        VERSION,
        
        // Tutte le aree cerebrali
        areas: {
            SensoryInput,
            PrefrontalCortex,
            MotorCortex,
            LimbicSystem,
            Cerebellum,
            Hippocampus,
            Amygdala,
            BasalGanglia
        },
        
        /**
         * PROCESSO COMPLETO - Esegue tutte le aree in sequenza
         * @param {Object} profile - Profilo atleta
         * @param {Object} options - Opzioni (history, targetDay, etc.)
         * @returns {Object} Decisione completa con reasoning
         */
        process(profile, options = {}) {
            console.log('🧠 ATLAS Neural Cortex - Full Processing Started');
            const startTime = Date.now();
            
            // 1. Raccolta dati
            const state = SensoryInput.gatherState(profile, options);
            
            // 2. Decisione strategica (Prefrontal)
            const strategic = PrefrontalCortex.process(state);
            
            // 3. Selezione movimenti (Motor)
            const motor = MotorCortex.process(state, strategic);
            
            // 4. Gestione fatica (Limbic)
            const limbic = LimbicSystem.process(state, strategic);
            
            // 5. Timing ottimale (Cerebellum)
            const timing = Cerebellum.process(state, strategic, motor);
            
            // 6. Memoria pattern (Hippocampus)
            const memory = Hippocampus.process(state);
            
            // 7. Risk assessment (Amygdala)
            const risk = Amygdala.process(state, { motor, limbic });
            
            // 8. Selezione metodi (Basal Ganglia)
            const methods = BasalGanglia.process(state, { limbic, amygdala: risk });
            
            // Compila decisione finale
            const decision = {
                timestamp: new Date().toISOString(),
                processingTime: Date.now() - startTime,
                confidence: this.calculateOverallConfidence(state, risk),
                
                // Decisione principale
                action: strategic.action,
                intensity: strategic.intensity,
                volume: strategic.volume,
                
                // Parametri dettagliati
                parameters: {
                    targetRPE: limbic.sustainableRPE,
                    restPeriods: timing.restPeriods,
                    tempo: timing.tempoRecommendations,
                    methods: methods.recommendedMethods.slice(0, 2)
                },
                
                // Target e vincoli
                targets: {
                    muscles: motor.muscleTargets,
                    avoidMuscles: motor.avoidMuscles.map(m => m.muscle)
                },
                
                // Rischio
                risk: {
                    level: risk.overallRisk,
                    vetoes: risk.absoluteVetoes,
                    greenLights: risk.greenLights
                },
                
                // Reasoning completo
                reasoning: [
                    ...strategic.reasoning,
                    ...motor.reasoning,
                    ...limbic.reasoning,
                    ...timing.reasoning,
                    ...memory.reasoning,
                    ...risk.reasoning,
                    ...methods.reasoning
                ],
                
                // Output grezzi per debug
                rawOutputs: {
                    state,
                    strategic,
                    motor,
                    limbic,
                    timing,
                    memory,
                    risk,
                    methods
                }
            };
            
            console.log(`🧠 Neural Cortex completed in ${decision.processingTime}ms`);
            console.log('   Action:', decision.action);
            console.log('   Confidence:', Math.round(decision.confidence * 100) + '%');
            console.log('   Risk:', Math.round(decision.risk.level * 100) + '%');
            
            return decision;
        },
        
        /**
         * Calcola confidenza complessiva
         */
        calculateOverallConfidence(state, riskOutput) {
            let confidence = state.confidence;
            
            // Riduci per rischio
            confidence -= riskOutput.overallRisk * 0.3;
            
            // Riduci per dati mancanti
            if (!state.recovery.subjective) confidence -= 0.1;
            if (state.fatigue.acute === 5 && state.fatigue.chronic === 5) confidence -= 0.1;
            
            return Math.max(0.3, Math.min(1.0, confidence));
        },
        
        /**
         * Quick test
         */
        test() {
            const mockProfile = {
                name: 'Test Athlete',
                sport: 'calcio',
                goal: 'forza',
                experience: 'intermediate',
                session_duration: 60,
                quickCheck: {
                    energy: 7,
                    soreness: 4,
                    motivation: 8,
                    sleep: 6
                }
            };
            
            return this.process(mockProfile, { targetDay: 'tuesday' });
        }
    };

})();

console.log('🧠 ATLAS Neural Cortex v1.0 COMPLETE loaded!');
console.log('   → ATLASNeuralCortex.process(profile, options) - Full brain processing');
console.log('   → ATLASNeuralCortex.test() - Quick test');
