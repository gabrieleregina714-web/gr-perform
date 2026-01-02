/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔮 ATLAS PREDICTIVE ENGINE v1.1
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sistema predittivo che anticipa conseguenze delle decisioni.
 * Permette "what-if" analysis prima di eseguire il workout.
 * 
 * v1.1: RECOVERY PERSONALIZZATO per età, livello e learning model
 * 
 * Funzionalità:
 * - Predizione stato post-workout (CNS, muscoli, fatica)
 * - Stima DOMS e tempo recupero PERSONALIZZATI
 * - Analisi impatto su giorni successivi
 * - Raccomandazioni basate su previsioni
 * - Integrazione con ATLASAthleteLearning
 * 
 * Autore: GR Perform AI Team
 * Versione: 1.1.0
 */

window.ATLASPredictiveEngine = (function() {
    'use strict';

    const VERSION = '1.1.0';
    const DEBUG = true;

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 MODELLI PREDITTIVI
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Costanti per modelli predittivi
     */
    const MODELS = {
        // Impatto CNS per tipo di lavoro
        cnsImpact: {
            heavy_compound: 15,      // -15% CNS
            moderate_compound: 8,
            light_compound: 4,
            isolation: 2,
            conditioning: 5,
            mobility: 0,
            max_effort: 25,
            explosive: 12
        },
        
        // Tempo recupero muscolare base (ore)
        muscleRecoveryBase: {
            quadriceps: 72,
            hamstrings: 72,
            glutes: 60,
            back: 72,
            chest: 48,
            shoulders: 48,
            biceps: 48,
            triceps: 48,
            core: 24,
            calves: 24
        },
        
        // Moltiplicatori DOMS per metodologia
        domsMultiplier: {
            eccentric_focus: 2.0,
            drop_set: 1.5,
            rest_pause: 1.4,
            giant_set: 1.3,
            superset: 1.2,
            straight_sets: 1.0,
            tempo_slow: 1.3,
            cluster: 0.9  // Meno DOMS per via del rest
        },
        
        // Fattori che modificano recupero BASE
        recoveryFactors: {
            age_under_25: 0.85,
            age_25_35: 1.0,
            age_35_45: 1.15,
            age_over_45: 1.3,
            age_over_55: 1.5,
            sleep_excellent: 0.85,
            sleep_good: 1.0,
            sleep_average: 1.1,
            sleep_poor: 1.4,
            nutrition_optimal: 0.9,
            nutrition_normal: 1.0,
            nutrition_poor: 1.2,
            // NUOVO: Livello esperienza
            level_principiante: 1.3,  // Principianti recuperano più lenti (DOMS peggiore)
            level_intermedio: 1.0,
            level_avanzato: 0.9,
            level_elite: 0.85
        },
        
        // NUOVO: CNS recovery rate base per giorno (%)
        cnsRecoveryRate: {
            base: 20,  // +20% al giorno
            age_under_25: 25,
            age_25_35: 20,
            age_35_45: 17,
            age_over_45: 14,
            age_over_55: 12
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🧬 PERSONALIZZAZIONE RECUPERO
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Calcola moltiplicatore recupero personalizzato per atleta
     * @param {Object} state - Stato con dati atleta
     * @returns {Object} Moltiplicatori personalizzati
     */
    function calculatePersonalizedRecoveryFactors(state) {
        const factors = {
            global: 1.0,
            cnsRate: 20,  // % per giorno
            byMuscle: {},
            sources: []
        };
        
        const athlete = state.athlete || {};
        const age = athlete.age || 30;
        const level = (athlete.level || 'intermedio').toLowerCase();
        
        // 1. Fattore età
        let ageFactor = 1.0;
        let cnsRate = MODELS.cnsRecoveryRate.base;
        
        if (age < 25) {
            ageFactor = MODELS.recoveryFactors.age_under_25;
            cnsRate = MODELS.cnsRecoveryRate.age_under_25;
            factors.sources.push(`Età ${age}: recupero +15%`);
        } else if (age <= 35) {
            ageFactor = MODELS.recoveryFactors.age_25_35;
            cnsRate = MODELS.cnsRecoveryRate.age_25_35;
        } else if (age <= 45) {
            ageFactor = MODELS.recoveryFactors.age_35_45;
            cnsRate = MODELS.cnsRecoveryRate.age_35_45;
            factors.sources.push(`Età ${age}: recupero -13%`);
        } else if (age <= 55) {
            ageFactor = MODELS.recoveryFactors.age_over_45;
            cnsRate = MODELS.cnsRecoveryRate.age_over_45;
            factors.sources.push(`Età ${age}: recupero -23%`);
        } else {
            ageFactor = MODELS.recoveryFactors.age_over_55;
            cnsRate = MODELS.cnsRecoveryRate.age_over_55;
            factors.sources.push(`Età ${age}: recupero -33%`);
        }
        
        // 2. Fattore livello esperienza
        let levelFactor = 1.0;
        if (level.includes('principiante') || level.includes('beginner')) {
            levelFactor = MODELS.recoveryFactors.level_principiante;
            factors.sources.push('Principiante: DOMS più intensi');
        } else if (level.includes('avanzato') || level.includes('advanced')) {
            levelFactor = MODELS.recoveryFactors.level_avanzato;
            factors.sources.push('Avanzato: adattamento elevato');
        } else if (level.includes('elite') || level.includes('agonista')) {
            levelFactor = MODELS.recoveryFactors.level_elite;
            factors.sources.push('Elite: recupero ottimizzato');
        }
        
        // 3. Fattore sonno (dal quick check)
        let sleepFactor = 1.0;
        if (state.recovery?.subjective?.sleep) {
            const sleep = state.recovery.subjective.sleep;
            if (sleep >= 8) {
                sleepFactor = MODELS.recoveryFactors.sleep_excellent;
                factors.sources.push('Sonno eccellente: +15% recupero');
            } else if (sleep >= 6) {
                sleepFactor = MODELS.recoveryFactors.sleep_good;
            } else if (sleep >= 4) {
                sleepFactor = MODELS.recoveryFactors.sleep_average;
                factors.sources.push('Sonno medio: -10% recupero');
            } else {
                sleepFactor = MODELS.recoveryFactors.sleep_poor;
                factors.sources.push('Sonno scarso: -29% recupero');
            }
        }
        
        // 4. INTEGRAZIONE ATLASAthleteLearning
        let learningFactor = 1.0;
        if (window.ATLASAthleteLearning && athlete.id) {
            try {
                const model = ATLASAthleteLearning.getModel(athlete.id);
                if (model.sessionsAnalyzed >= 3 && model.recoveryProfile.confidence > 0.2) {
                    learningFactor = model.recoveryProfile.globalRecoveryMultiplier;
                    factors.sources.push(`Learning model (${model.sessionsAnalyzed} sessioni): ×${learningFactor.toFixed(2)}`);
                    
                    // Recupero per muscolo specifico
                    if (Object.keys(model.recoveryProfile.byMuscleGroup).length > 0) {
                        factors.byMuscle = { ...model.recoveryProfile.byMuscleGroup };
                    }
                }
            } catch (e) {
                console.warn('Error loading learning model for recovery:', e);
            }
        }
        
        // Calcola fattore globale
        factors.global = ageFactor * levelFactor * sleepFactor * learningFactor;
        factors.cnsRate = Math.round(cnsRate / factors.global); // CNS rate inversamente proporzionale
        
        // Clamp ragionevole
        factors.global = Math.max(0.6, Math.min(2.0, factors.global));
        factors.cnsRate = Math.max(8, Math.min(30, factors.cnsRate));
        
        if (DEBUG && factors.sources.length > 0) {
            console.log('🔮 Personalized recovery factors:', factors);
        }
        
        return factors;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔮 PREDITTORE PRINCIPALE
    // ═══════════════════════════════════════════════════════════════════════════

    const Predictor = {
        
        /**
         * Predice stato post-workout
         * @param {Object} currentState - Stato attuale
         * @param {Object} decision - Decisione del Neural Cortex
         * @param {Object} workout - Workout pianificato (opzionale)
         * @returns {Object} Stato predetto post-workout
         */
        predictPostWorkout(currentState, decision, workout = null) {
            const prediction = {
                timestamp: new Date().toISOString(),
                immediate: {},    // Subito dopo
                hours_6: {},      // 6 ore dopo
                hours_24: {},     // Domani
                hours_48: {},     // Dopodomani
                hours_72: {},     // Tra 3 giorni
                confidence: 0.7,
                personalization: null
            };
            
            // NUOVO: Calcola fattori di recupero personalizzati
            const personalFactors = calculatePersonalizedRecoveryFactors(currentState);
            prediction.personalization = {
                globalFactor: personalFactors.global,
                cnsRecoveryRate: personalFactors.cnsRate,
                sources: personalFactors.sources
            };
            
            // Calcola impatto basato su intensità e volume
            const impact = this.calculateWorkoutImpact(decision, workout);
            
            // Stato CNS - ORA PERSONALIZZATO
            const cnsRate = personalFactors.cnsRate; // % recupero per giorno
            prediction.immediate.cns = Math.max(20, currentState.recovery.cns - impact.cnsDepletion);
            prediction.hours_6.cns = prediction.immediate.cns + Math.round(cnsRate * 0.25);
            prediction.hours_24.cns = Math.min(100, prediction.immediate.cns + cnsRate);
            prediction.hours_48.cns = Math.min(100, prediction.immediate.cns + cnsRate * 2);
            prediction.hours_72.cns = Math.min(100, prediction.immediate.cns + cnsRate * 3);
            
            // DOMS prediction - ora con fattore personalizzato
            prediction.domsProfile = this.predictDOMS(decision, impact, personalFactors);
            
            // Muscoli coinvolti - ora con fattore personalizzato
            prediction.muscleRecovery = this.predictMuscleRecovery(
                decision.targets?.muscles || [],
                impact,
                currentState,
                personalFactors
            );
            
            // Readiness per giorni successivi
            prediction.readinessProjection = this.projectReadiness(prediction, currentState);
            
            // Confidence basata su dati disponibili (aumenta con learning)
            prediction.confidence = this.calculatePredictionConfidence(currentState, workout, personalFactors);
            
            // ══════════════════════════════════════════════════════════════
            // STRUCTURAL BALANCE PREDICTIONS
            // Predici rischio infortuni basato su squilibri
            // ══════════════════════════════════════════════════════════════
            prediction.structuralBalance = this.predictStructuralImpact(currentState);
            
            if (DEBUG) {
                console.log('🔮 Post-workout prediction:', prediction);
            }
            
            return prediction;
        },
        
        /**
         * Predice impatto degli squilibri strutturali
         */
        predictStructuralImpact(currentState) {
            const result = {
                hasImbalances: false,
                injuryRiskIncrease: 0,
                warnings: [],
                improvements: []
            };
            
            if (typeof AtlasStructuralBalance === 'undefined' || !currentState.athlete?.id) {
                return result;
            }
            
            try {
                const analysis = AtlasStructuralBalance.getFullAnalysis(
                    currentState.athlete.id, 
                    currentState.athlete
                );
                
                const issues = analysis?.analysis?.issues || [];
                
                if (issues.length > 0) {
                    result.hasImbalances = true;
                    
                    issues.forEach(issue => {
                        // Calcola aumento rischio
                        if (issue.type === 'critical') {
                            result.injuryRiskIncrease += 15;
                            result.warnings.push({
                                type: 'critical',
                                message: issue.message,
                                correction: issue.correction
                            });
                        } else if (issue.type === 'warning') {
                            result.injuryRiskIncrease += 5;
                            result.warnings.push({
                                type: 'warning',
                                message: issue.message
                            });
                        }
                    });
                    
                    // Predici miglioramento se seguono correzioni
                    result.improvements.push({
                        timeframe: '4-6 settimane',
                        message: 'Seguendo le correzioni, gli squilibri possono migliorare del 20-30%'
                    });
                }
                
                result.score = analysis?.analysis?.balance_score?.score || 50;
                result.dataQuality = analysis?.dataQuality || 'estimated';
                
            } catch (e) {
                console.warn('Structural prediction failed:', e);
            }
            
            return result;
        },

        /**
         * Calcola impatto del workout
         */
        calculateWorkoutImpact(decision, workout) {
            const impact = {
                cnsDepletion: 0,
                muscularDamage: 0,
                metabolicStress: 0,
                totalLoad: 0
            };
            
            // Impatto base da intensità
            const intensityImpact = {
                'high': { cns: 20, muscle: 0.8, metabolic: 0.6 },
                'moderate': { cns: 12, muscle: 0.6, metabolic: 0.7 },
                'light': { cns: 5, muscle: 0.3, metabolic: 0.4 },
                'very_low': { cns: 2, muscle: 0.1, metabolic: 0.2 }
            };
            
            const baseImpact = intensityImpact[decision.intensity] || intensityImpact.moderate;
            
            // Volume modifier
            const volumeMultiplier = {
                'high': 1.3,
                'normal': 1.0,
                'moderate': 0.9,
                'reduced': 0.7,
                'minimal': 0.4,
                'none': 0
            };
            
            const volMult = volumeMultiplier[decision.volume] || 1.0;
            
            impact.cnsDepletion = Math.round(baseImpact.cns * volMult);
            impact.muscularDamage = baseImpact.muscle * volMult;
            impact.metabolicStress = baseImpact.metabolic * volMult;
            
            // Aggiungi impatto da metodologie
            if (decision.parameters?.methods) {
                for (const method of decision.parameters.methods) {
                    const methodName = method.key || method.name || '';
                    if (methodName.includes('eccentric')) {
                        impact.muscularDamage *= 1.5;
                    }
                    if (methodName.includes('drop') || methodName.includes('rest_pause')) {
                        impact.metabolicStress *= 1.3;
                    }
                }
            }
            
            // Se abbiamo workout dettagliato, calcola più precisamente
            if (workout?.exercises) {
                const exercises = Array.isArray(workout.exercises) ? workout.exercises : [];
                let totalSets = 0;
                
                exercises.forEach(ex => {
                    const sets = parseInt(ex.sets) || 3;
                    const type = (ex.type || '').toLowerCase();
                    
                    totalSets += sets;
                    
                    if (type === 'strength' || /squat|deadlift|press/i.test(ex.name)) {
                        impact.cnsDepletion += sets * 2;
                    }
                });
                
                impact.totalLoad = totalSets;
            }
            
            return impact;
        },
        
        /**
         * Predice profilo DOMS - ORA CON FATTORI PERSONALIZZATI
         */
        predictDOMS(decision, impact, personalFactors = null) {
            const globalFactor = personalFactors?.global || 1.0;
            
            const doms = {
                onset: Math.round(12 * globalFactor),     // Ore prima che inizino
                peak: Math.round(36 * globalFactor),      // Ore al picco
                duration: Math.round(72 * globalFactor),  // Durata totale
                severity: 'moderate', // light, moderate, severe
                muscles: [],
                personalizedNote: null
            };
            
            // Severità basata su danno muscolare
            if (impact.muscularDamage > 0.7) {
                doms.severity = 'severe';
                doms.peak = Math.round(48 * globalFactor);
                doms.duration = Math.round(96 * globalFactor);
            } else if (impact.muscularDamage > 0.4) {
                doms.severity = 'moderate';
            } else {
                doms.severity = 'light';
                doms.peak = Math.round(24 * globalFactor);
                doms.duration = Math.round(48 * globalFactor);
            }
            
            // Nota personalizzazione
            if (globalFactor > 1.1) {
                doms.personalizedNote = 'DOMS prolungati per profilo atleta';
            } else if (globalFactor < 0.9) {
                doms.personalizedNote = 'Recupero rapido per profilo atleta';
            }
            
            // Muscoli che avranno DOMS
            doms.muscles = (decision.targets?.muscles || []).map(muscle => ({
                name: muscle,
                expectedSeverity: doms.severity,
                peakAt: doms.peak,
                fullRecovery: doms.duration
            }));
            
            return doms;
        },
        
        /**
         * Predice recupero per muscolo - ORA COMPLETAMENTE PERSONALIZZATO
         */
        predictMuscleRecovery(muscles, impact, currentState, personalFactors = null) {
            const recovery = {};
            const globalFactor = personalFactors?.global || 1.0;
            const byMuscle = personalFactors?.byMuscle || {};
            
            for (const muscle of muscles) {
                const baseRecovery = MODELS.muscleRecoveryBase[muscle] || 48;
                
                // Moltiplicatore specifico per muscolo dal learning
                const muscleFactor = byMuscle[muscle] || 1.0;
                
                // Modifica per impatto workout
                let modifiedRecovery = baseRecovery * (1 + impact.muscularDamage * 0.5);
                
                // Applica fattore personalizzato globale E specifico
                modifiedRecovery *= globalFactor * muscleFactor;
                
                // Calcola percentuali di recupero
                const hoursToFull = Math.round(modifiedRecovery);
                
                recovery[muscle] = {
                    hoursToFull,
                    percentAt24h: Math.round(Math.min(100, 100 * (24 / hoursToFull) * 0.8)),
                    percentAt48h: Math.round(Math.min(100, 100 * (48 / hoursToFull) * 0.9)),
                    percentAt72h: Math.round(Math.min(100, 100 * (72 / hoursToFull))),
                    personalized: muscleFactor !== 1.0 || globalFactor !== 1.0
                };
            }
            
            return recovery;
        },
        
        /**
         * Proietta readiness per giorni successivi
         */
        projectReadiness(prediction, currentState) {
            return {
                tomorrow: {
                    readiness: Math.round(prediction.hours_24.cns * 0.7 + 30),
                    suitableFor: this.getSuitableActivities(prediction.hours_24.cns),
                    warning: prediction.hours_24.cns < 60 ? 'CNS ancora in recupero' : null
                },
                in2days: {
                    readiness: Math.round(prediction.hours_48.cns * 0.8 + 20),
                    suitableFor: this.getSuitableActivities(prediction.hours_48.cns),
                    warning: null
                },
                in3days: {
                    readiness: Math.round(prediction.hours_72.cns * 0.9 + 10),
                    suitableFor: this.getSuitableActivities(prediction.hours_72.cns),
                    warning: null
                }
            };
        },
        
        getSuitableActivities(cns) {
            if (cns >= 85) return ['heavy_strength', 'power', 'skill_work'];
            if (cns >= 70) return ['moderate_strength', 'hypertrophy', 'sport_training'];
            if (cns >= 55) return ['light_strength', 'conditioning', 'skill_work'];
            if (cns >= 40) return ['mobility', 'light_cardio', 'technique'];
            return ['rest', 'stretching', 'massage'];
        },
        
        /**
         * Calcola confidence DINAMICA basata su dati disponibili
         * Più dati abbiamo, più siamo sicuri delle previsioni
         */
        calculatePredictionConfidence(currentState, workout, personalFactors = null) {
            let confidence = 0.4; // Base minima
            const sources = [];
            
            // Dati dallo stato corrente
            if (currentState.confidence > 0.7) {
                confidence += 0.1;
                sources.push('stato_atleta');
            }
            
            // Quick check soggettivo
            if (currentState.recovery?.subjective) {
                confidence += 0.1;
                sources.push('quick_check');
            }
            
            // Workout dettagliato
            if (workout?.exercises) {
                const exerciseCount = Array.isArray(workout.exercises) ? 
                    workout.exercises.length : 
                    Object.values(workout.exercises).flat().length;
                    
                if (exerciseCount > 5) {
                    confidence += 0.1;
                    sources.push('workout_dettagliato');
                }
            }
            
            // Pattern storici
            if (currentState.patterns?.averageVolume > 0) {
                confidence += 0.08;
                sources.push('pattern_storici');
            }
            
            // NUOVO: Bonus da Learning Model
            if (personalFactors?.sources && personalFactors.sources.length > 0) {
                // Ogni fonte dal learning model aumenta confidence
                const learningBonus = Math.min(0.2, personalFactors.sources.length * 0.05);
                confidence += learningBonus;
                sources.push(`learning_model(+${(learningBonus * 100).toFixed(0)}%)`);
            }
            
            // Bonus se abbiamo dati da ATLASAthleteLearning
            if (window.ATLASAthleteLearning && currentState.athlete?.id) {
                try {
                    const model = ATLASAthleteLearning.getModel(currentState.athlete.id);
                    if (model.sessionsAnalyzed >= 5) {
                        confidence += 0.1;
                        sources.push(`${model.sessionsAnalyzed}_sessioni_analizzate`);
                    }
                    if (model.sessionsAnalyzed >= 10) {
                        confidence += 0.05;
                    }
                    if (model.sessionsAnalyzed >= 20) {
                        confidence += 0.05;
                        sources.push('profilo_maturo');
                    }
                } catch (e) {
                    // Ignora errori
                }
            }
            
            // Clamp finale
            const finalConfidence = Math.min(0.95, Math.max(0.3, confidence));
            
            if (DEBUG && sources.length > 2) {
                console.log(`🔮 Prediction confidence: ${(finalConfidence * 100).toFixed(0)}% (${sources.join(', ')})`);
            }
            
            return finalConfidence;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 WHAT-IF ANALYSIS
    // ═══════════════════════════════════════════════════════════════════════════

    const WhatIfAnalysis = {
        
        /**
         * Confronta due scenari di allenamento
         */
        compare(currentState, scenario1, scenario2) {
            const pred1 = Predictor.predictPostWorkout(currentState, scenario1);
            const pred2 = Predictor.predictPostWorkout(currentState, scenario2);
            
            return {
                scenario1: {
                    name: scenario1.name || 'Opzione 1',
                    ...scenario1,
                    prediction: pred1
                },
                scenario2: {
                    name: scenario2.name || 'Opzione 2',
                    ...scenario2,
                    prediction: pred2
                },
                comparison: {
                    betterForTomorrow: pred1.readinessProjection.tomorrow.readiness > 
                                       pred2.readinessProjection.tomorrow.readiness ? 'scenario1' : 'scenario2',
                    betterForRecovery: pred1.immediate.cns > pred2.immediate.cns ? 'scenario1' : 'scenario2',
                    lessDoMS: pred1.domsProfile.severity === 'light' ? 'scenario1' : 
                              pred2.domsProfile.severity === 'light' ? 'scenario2' : 'equal'
                },
                recommendation: this.generateRecommendation(pred1, pred2, currentState)
            };
        },
        
        /**
         * Genera raccomandazione basata su confronto
         */
        generateRecommendation(pred1, pred2, state) {
            // Se c'è partita nei prossimi 3 giorni, priorità a recupero
            if (state.calendar?.daysToMatch <= 3) {
                const betterCNS = pred1.hours_24.cns > pred2.hours_24.cns ? 'scenario1' : 'scenario2';
                return {
                    choice: betterCNS,
                    reason: 'Partita vicina - priorità a minimizzare impatto CNS'
                };
            }
            
            // Altrimenti, bilancia
            const score1 = pred1.readinessProjection.tomorrow.readiness - 
                           (pred1.domsProfile.severity === 'severe' ? 20 : 0);
            const score2 = pred2.readinessProjection.tomorrow.readiness - 
                           (pred2.domsProfile.severity === 'severe' ? 20 : 0);
            
            return {
                choice: score1 >= score2 ? 'scenario1' : 'scenario2',
                reason: 'Miglior bilancio tra stimolo e recupero'
            };
        },
        
        /**
         * Simula settimana di allenamento
         */
        simulateWeek(currentState, weekPlan) {
            const simulation = [];
            let runningState = { ...currentState };
            
            for (let day = 0; day < 7; day++) {
                const dayPlan = weekPlan[day] || { action: 'REST' };
                
                if (dayPlan.action === 'REST' || dayPlan.action === 'rest') {
                    // Giorno di riposo - recupera
                    runningState = this.simulateRest(runningState);
                    simulation.push({
                        day: day + 1,
                        activity: 'Rest',
                        state: { ...runningState }
                    });
                } else {
                    // Giorno di allenamento
                    const prediction = Predictor.predictPostWorkout(runningState, dayPlan);
                    
                    simulation.push({
                        day: day + 1,
                        activity: dayPlan.action,
                        intensity: dayPlan.intensity,
                        prediction: prediction,
                        warning: prediction.immediate.cns < 50 ? 'CNS basso' : null
                    });
                    
                    // Aggiorna stato per giorno successivo
                    runningState = this.advanceState(runningState, prediction);
                }
            }
            
            return {
                days: simulation,
                summary: {
                    totalTrainingDays: simulation.filter(d => d.activity !== 'Rest').length,
                    lowestCNS: Math.min(...simulation.map(d => d.state?.recovery?.cns || d.prediction?.immediate?.cns || 100)),
                    warnings: simulation.filter(d => d.warning).length
                }
            };
        },
        
        simulateRest(state) {
            return {
                ...state,
                recovery: {
                    ...state.recovery,
                    cns: Math.min(100, (state.recovery?.cns || 70) + 15),
                    readiness: Math.min(100, (state.recovery?.readiness || 70) + 20)
                },
                fatigue: {
                    ...state.fatigue,
                    acute: Math.max(1, (state.fatigue?.acute || 5) - 2)
                }
            };
        },
        
        advanceState(state, prediction) {
            return {
                ...state,
                recovery: {
                    cns: prediction.hours_24.cns,
                    readiness: prediction.readinessProjection.tomorrow.readiness,
                    muscular: prediction.muscleRecovery
                },
                fatigue: {
                    acute: Math.min(10, (state.fatigue?.acute || 5) + 1),
                    chronic: state.fatigue?.chronic || 5
                }
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 RACCOMANDAZIONI INTELLIGENTI
    // ═══════════════════════════════════════════════════════════════════════════

    const SmartRecommendations = {
        
        /**
         * Genera raccomandazioni basate su previsioni
         */
        generate(currentState, decision, prediction) {
            const recommendations = [];
            
            // 1. Avviso CNS basso post-workout
            if (prediction.immediate.cns < 50) {
                recommendations.push({
                    type: 'warning',
                    priority: 'high',
                    message: `CNS post-workout stimato: ${prediction.immediate.cns}%. Considera ridurre intensità.`,
                    action: 'reduce_intensity'
                });
            }
            
            // 2. DOMS severi previsti
            if (prediction.domsProfile.severity === 'severe') {
                recommendations.push({
                    type: 'info',
                    priority: 'medium',
                    message: `DOMS severi previsti sui muscoli: ${prediction.domsProfile.muscles.map(m => m.name).join(', ')}`,
                    action: 'plan_recovery'
                });
            }
            
            // 3. Impatto su prossima sessione
            if (prediction.readinessProjection.tomorrow.readiness < 60) {
                recommendations.push({
                    type: 'warning',
                    priority: 'high',
                    message: `Readiness domani stimato: ${prediction.readinessProjection.tomorrow.readiness}%. ` +
                             `Adatto solo per: ${prediction.readinessProjection.tomorrow.suitableFor.join(', ')}`,
                    action: 'adjust_tomorrow'
                });
            }
            
            // 4. Conflitto con calendario
            if (currentState.calendar?.daysToMatch !== null && currentState.calendar.daysToMatch <= 3) {
                const matchDayReadiness = currentState.calendar.daysToMatch === 1 ?
                    prediction.hours_24.cns :
                    currentState.calendar.daysToMatch === 2 ?
                        prediction.hours_48.cns :
                        prediction.hours_72.cns;
                
                if (matchDayReadiness < 80) {
                    recommendations.push({
                        type: 'critical',
                        priority: 'critical',
                        message: `Partita tra ${currentState.calendar.daysToMatch} giorni! ` +
                                 `Readiness previsto: ${matchDayReadiness}% (target: 80%+)`,
                        action: 'reduce_for_match'
                    });
                }
            }
            
            // 5. Suggerimento recupero
            const slowestRecovery = Object.entries(prediction.muscleRecovery)
                .sort((a, b) => b[1].hoursToFull - a[1].hoursToFull)[0];
            
            if (slowestRecovery && slowestRecovery[1].hoursToFull > 72) {
                recommendations.push({
                    type: 'info',
                    priority: 'low',
                    message: `${slowestRecovery[0]} richiederà ${slowestRecovery[1].hoursToFull}h per recupero completo`,
                    action: 'schedule_rest'
                });
            }
            
            return recommendations.sort((a, b) => {
                const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔌 API PUBBLICA
    // ═══════════════════════════════════════════════════════════════════════════

    return {
        VERSION,
        MODELS,
        
        Predictor,
        WhatIfAnalysis,
        SmartRecommendations,
        
        /**
         * Predizione completa con raccomandazioni
         */
        predict(currentState, decision, workout = null) {
            const prediction = Predictor.predictPostWorkout(currentState, decision, workout);
            const recommendations = SmartRecommendations.generate(currentState, decision, prediction);
            
            return {
                prediction,
                recommendations,
                summary: this.generateSummary(prediction, recommendations)
            };
        },
        
        /**
         * What-if comparison
         */
        compare(currentState, scenario1, scenario2) {
            return WhatIfAnalysis.compare(currentState, scenario1, scenario2);
        },
        
        /**
         * Simulazione settimanale
         */
        simulateWeek(currentState, weekPlan) {
            return WhatIfAnalysis.simulateWeek(currentState, weekPlan);
        },
        
        /**
         * Genera summary leggibile
         */
        generateSummary(prediction, recommendations) {
            const criticalRecs = recommendations.filter(r => r.priority === 'critical');
            const highRecs = recommendations.filter(r => r.priority === 'high');
            
            let status = '🟢 Tutto ok';
            if (criticalRecs.length > 0) status = '🔴 Attenzione critica';
            else if (highRecs.length > 0) status = '🟡 Attenzione';
            
            return {
                status,
                cnsAfter: prediction.immediate.cns,
                readinessTomorrow: prediction.readinessProjection.tomorrow.readiness,
                domsExpected: prediction.domsProfile.severity,
                criticalWarnings: criticalRecs.length,
                topRecommendation: recommendations[0]?.message || 'Nessuna raccomandazione particolare'
            };
        },
        
        /**
         * Test
         */
        test() {
            const mockState = {
                recovery: { cns: 80, readiness: 75 },
                fatigue: { acute: 5 },
                athlete: { age: 30 },
                calendar: { daysToMatch: 4 }
            };
            
            const mockDecision = {
                action: 'NORMAL_WORKOUT',
                intensity: 'high',
                volume: 'normal',
                targets: { muscles: ['quadriceps', 'hamstrings', 'glutes'] }
            };
            
            return this.predict(mockState, mockDecision);
        }
    };

})();

console.log('🔮 ATLAS Predictive Engine v1.0 loaded!');
console.log('   → ATLASPredictiveEngine.predict(state, decision) - Full prediction');
console.log('   → ATLASPredictiveEngine.compare(state, s1, s2) - What-if analysis');
console.log('   → ATLASPredictiveEngine.simulateWeek(state, plan) - Week simulation');
