/**
 * GR Perform - Autonomous Adaptation System v1.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * SISTEMA AUTONOMO: Il coach che pensa, prevede e si adatta
 * 
 * Funzionalità rivoluzionarie:
 * 1. PREDICTIVE ANALYTICS - Prevede problemi prima che accadano
 * 2. PROACTIVE ADJUSTMENTS - Suggerisce modifiche autonomamente
 * 3. LEARNING FROM FEEDBACK - Impara dalle risposte dell'atleta
 * 4. PATTERN RECOGNITION - Riconosce pattern nel comportamento
 * 5. GOAL TRACKING - Monitora progresso verso obiettivi
 * 6. ALERT SYSTEM - Avvisi proattivi per coach e atleta
 * 
 * Filosofia: "Non aspettare che l'atleta ti dica che qualcosa non va"
 */

window.AutonomousAdaptationSystem = (function() {
    'use strict';

    const VERSION = '1.0';
    const NAME = 'AutonomousAdaptationSystem';

    // ═══════════════════════════════════════════════════════════════════════════
    // 1. PREDICTIVE ANALYTICS - Previsione problemi
    // ═══════════════════════════════════════════════════════════════════════════

    const PREDICTION_MODELS = {
        /**
         * Predice rischio infortunio basato su dati storici
         */
        injuryRisk: {
            name: 'Injury Risk Predictor',
            factors: {
                acwr: { weight: 0.25, thresholds: { low: 0.8, high: 1.3, critical: 1.5 } },
                monotony: { weight: 0.15, thresholds: { low: 1.5, high: 2.0, critical: 2.5 } },
                sleepAvg: { weight: 0.15, thresholds: { low: 7, high: 5, critical: 4 } },
                stressLevel: { weight: 0.15, thresholds: { low: 3, high: 6, critical: 8 } },
                previousInjuries: { weight: 0.15, thresholds: { low: 0, high: 1, critical: 2 } },
                ageCategory: { weight: 0.15, thresholds: { low: 25, high: 35, critical: 45 } }
            },
            calculate: function(data) {
                let risk = 0;
                let reasons = [];
                
                // ACWR
                if (data.acwr > this.factors.acwr.thresholds.critical) {
                    risk += 35;
                    reasons.push(`ACWR critico (${data.acwr.toFixed(2)})`);
                } else if (data.acwr > this.factors.acwr.thresholds.high) {
                    risk += 20;
                    reasons.push(`ACWR elevato (${data.acwr.toFixed(2)})`);
                } else if (data.acwr < this.factors.acwr.thresholds.low) {
                    risk += 10;
                    reasons.push('ACWR basso - detraining');
                }
                
                // Monotony
                if (data.monotony > this.factors.monotony.thresholds.critical) {
                    risk += 20;
                    reasons.push('Monotonia critica');
                } else if (data.monotony > this.factors.monotony.thresholds.high) {
                    risk += 12;
                    reasons.push('Monotonia elevata');
                }
                
                // Sleep
                const sleepAvg = data.sleepHoursAvg || 7;
                if (sleepAvg < this.factors.sleepAvg.thresholds.critical) {
                    risk += 15;
                    reasons.push(`Sonno critico (${sleepAvg}h media)`);
                } else if (sleepAvg < this.factors.sleepAvg.thresholds.high) {
                    risk += 10;
                    reasons.push(`Sonno scarso (${sleepAvg}h media)`);
                }
                
                // Previous injuries
                const injCount = data.previousInjuries || 0;
                if (injCount >= 2) {
                    risk += 15;
                    reasons.push('Storico infortuni multipli');
                } else if (injCount >= 1) {
                    risk += 8;
                    reasons.push('Storico infortunio precedente');
                }
                
                return {
                    riskScore: Math.min(100, risk),
                    riskLevel: risk > 60 ? 'critical' : risk > 40 ? 'high' : risk > 20 ? 'moderate' : 'low',
                    reasons,
                    recommendations: this.getRecommendations(risk, reasons)
                };
            },
            getRecommendations: function(risk, reasons) {
                const recs = [];
                
                if (risk > 60) {
                    recs.push({
                        priority: 'critical',
                        action: 'DELOAD_IMMEDIATE',
                        description: 'Deload immediato per almeno 5-7 giorni',
                        urgency: 'now'
                    });
                } else if (risk > 40) {
                    recs.push({
                        priority: 'high',
                        action: 'REDUCE_VOLUME',
                        description: 'Ridurre volume del 30% per la prossima settimana',
                        urgency: 'this_week'
                    });
                } else if (risk > 20) {
                    recs.push({
                        priority: 'moderate',
                        action: 'MONITOR_CLOSELY',
                        description: 'Monitorare attentamente recupero e readiness',
                        urgency: 'ongoing'
                    });
                }
                
                return recs;
            }
        },

        /**
         * Predice plateau di performance
         */
        plateauRisk: {
            name: 'Plateau Risk Predictor',
            calculate: function(data) {
                let risk = 0;
                let reasons = [];
                
                // Stagnazione pesi
                if (data.weeksWithoutProgress >= 4) {
                    risk += 40;
                    reasons.push(`${data.weeksWithoutProgress} settimane senza progressi`);
                } else if (data.weeksWithoutProgress >= 2) {
                    risk += 20;
                    reasons.push('Rallentamento progressione');
                }
                
                // Stesso programma da troppo tempo
                if (data.weeksOnSameProgram >= 8) {
                    risk += 25;
                    reasons.push('Stesso programma da 8+ settimane');
                }
                
                // Bassa variabilità
                if (data.exerciseVariety < 0.5) {
                    risk += 20;
                    reasons.push('Bassa varietà esercizi');
                }
                
                // Mancanza di deload
                if (data.weeksSinceDeload >= 6) {
                    risk += 15;
                    reasons.push('Nessun deload da 6+ settimane');
                }
                
                return {
                    riskScore: Math.min(100, risk),
                    riskLevel: risk > 50 ? 'high' : risk > 25 ? 'moderate' : 'low',
                    reasons,
                    recommendations: this.getRecommendations(risk, data)
                };
            },
            getRecommendations: function(risk, data) {
                const recs = [];
                
                if (risk > 50) {
                    recs.push({
                        priority: 'high',
                        action: 'PROGRAM_CHANGE',
                        description: 'Cambio programma o deload seguito da nuova fase',
                        urgency: 'this_week'
                    });
                    recs.push({
                        priority: 'high',
                        action: 'STIMULUS_VARIATION',
                        description: 'Introdurre nuovi esercizi o metodi di allenamento',
                        urgency: 'next_workout'
                    });
                } else if (risk > 25) {
                    recs.push({
                        priority: 'moderate',
                        action: 'ADD_VARIETY',
                        description: 'Aggiungere variazioni agli esercizi principali',
                        urgency: 'next_week'
                    });
                }
                
                return recs;
            }
        },

        /**
         * Predice burnout/overtraining
         */
        burnoutRisk: {
            name: 'Burnout Risk Predictor',
            calculate: function(data) {
                let risk = 0;
                let reasons = [];
                
                // Compliance in calo
                if (data.complianceTrend === 'decreasing') {
                    risk += 25;
                    reasons.push('Aderenza in calo');
                }
                
                // Readiness media bassa
                if (data.readinessAvg < 50) {
                    risk += 30;
                    reasons.push(`Readiness media bassa (${data.readinessAvg}%)`);
                } else if (data.readinessAvg < 65) {
                    risk += 15;
                    reasons.push(`Readiness sotto ottimale (${data.readinessAvg}%)`);
                }
                
                // RPE percepito sempre alto
                if (data.avgPerceivedRPE > 8.5) {
                    risk += 25;
                    reasons.push('RPE percepito costantemente alto');
                }
                
                // Training streak senza break
                if (data.consecutiveTrainingDays >= 12) {
                    risk += 20;
                    reasons.push(`${data.consecutiveTrainingDays} giorni consecutivi di training`);
                }
                
                return {
                    riskScore: Math.min(100, risk),
                    riskLevel: risk > 50 ? 'high' : risk > 25 ? 'moderate' : 'low',
                    reasons,
                    recommendations: this.getRecommendations(risk)
                };
            },
            getRecommendations: function(risk) {
                const recs = [];
                
                if (risk > 50) {
                    recs.push({
                        priority: 'high',
                        action: 'MANDATORY_REST',
                        description: '3-5 giorni di riposo completo o attività ricreativa',
                        urgency: 'now'
                    });
                    recs.push({
                        priority: 'high',
                        action: 'VOLUME_RESET',
                        description: 'Ricominciare da volume -40% alla ripresa',
                        urgency: 'at_restart'
                    });
                } else if (risk > 25) {
                    recs.push({
                        priority: 'moderate',
                        action: 'FUN_SESSION',
                        description: 'Inserire sessioni "per divertimento" senza obiettivi prestazionali',
                        urgency: 'this_week'
                    });
                }
                
                return recs;
            }
        }
    };

    /**
     * Esegue tutte le predizioni
     */
    function runPredictions(athleteData) {
        const predictions = {};
        
        Object.entries(PREDICTION_MODELS).forEach(([key, model]) => {
            try {
                predictions[key] = model.calculate(athleteData);
                console.log(`  ✓ ${model.name}: ${predictions[key].riskLevel}`);
            } catch (e) {
                console.warn(`  ⚠ ${model.name} failed:`, e.message);
                predictions[key] = { error: e.message };
            }
        });
        
        return predictions;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. PROACTIVE ADJUSTMENTS - Modifiche autonome
    // ═══════════════════════════════════════════════════════════════════════════

    const ADJUSTMENT_RULES = [
        {
            id: 'auto_deload',
            trigger: (data) => data.acwr > 1.4 && data.weeksSinceDeload >= 3,
            adjustment: {
                type: 'volume_reduction',
                factor: 0.5,
                duration: '1_week',
                reason: 'ACWR elevato + nessun deload recente'
            },
            priority: 'high'
        },
        {
            id: 'pre_match_taper',
            trigger: (data) => data.daysToMatch !== null && data.daysToMatch <= 4 && data.daysToMatch > 0,
            adjustment: (data) => ({
                type: 'taper',
                volumeMultiplier: 1 - (0.2 * (4 - (data.daysToMatch || 0))),
                intensityMultiplier: 0.9,
                reason: 'Avvicinamento gara - taper automatico'
            }),
            priority: 'high'
        },
        {
            id: 'poor_sleep_compensation',
            trigger: (data) => data.sleepHours && data.sleepHours < 5,
            adjustment: {
                type: 'intensity_reduction',
                factor: 0.6,
                reason: 'Sonno insufficiente - protezione SNC'
            },
            priority: 'high'
        },
        {
            id: 'high_stress_adaptation',
            trigger: (data) => data.stressLevel === 'high',
            adjustment: {
                type: 'complexity_reduction',
                maxMethods: 1,
                preferMethods: ['steady_state', 'tempo_training'],
                avoidMethods: ['hiit', 'tabata', 'max_effort'],
                reason: 'Stress alto - sessione più rilassante'
            },
            priority: 'moderate'
        },
        {
            id: 'soreness_avoidance',
            trigger: (data) => data.musclesSore && data.musclesSore.length > 0,
            adjustment: {
                type: 'muscle_avoidance',
                avoidMuscles: data => data.musclesSore,
                reason: 'Evitare muscoli con DOMS'
            },
            priority: 'moderate'
        },
        {
            id: 'progression_opportunity',
            trigger: (data) => data.readiness > 85 && data.lastWorkoutRPE < 7,
            adjustment: {
                type: 'progression_push',
                intensityBoost: 1.05,
                volumeBoost: 1.1,
                reason: 'Readiness ottimale + margine RPE = opportunità progressione'
            },
            priority: 'moderate'
        },
        {
            id: 'monday_syndrome',
            trigger: (data) => data.dayOfWeek === 'monday' && data.restDaysBeforeThis >= 2,
            adjustment: {
                type: 'warmup_extension',
                warmupMultiplier: 1.3,
                reason: 'Lunedì dopo weekend - warmup più lungo'
            },
            priority: 'low'
        },
        {
            id: 'evening_session',
            trigger: (data) => data.timeOfDay === 'evening' && data.hoursAwake > 12,
            adjustment: {
                type: 'fatigue_compensation',
                intensityMultiplier: 0.9,
                preferMethods: ['less_technical'],
                reason: 'Sessione serale dopo giornata lunga'
            },
            priority: 'low'
        }
    ];

    /**
     * Calcola aggiustamenti automatici da applicare
     */
    function calculateAdjustments(data) {
        const adjustments = [];
        
        ADJUSTMENT_RULES.forEach(rule => {
            try {
                if (rule.trigger(data)) {
                    const adjustment = typeof rule.adjustment === 'function' 
                        ? rule.adjustment(data) 
                        : { ...rule.adjustment };
                    
                    // Risolvi funzioni nei valori
                    Object.keys(adjustment).forEach(key => {
                        if (typeof adjustment[key] === 'function') {
                            adjustment[key] = adjustment[key](data);
                        }
                    });
                    
                    adjustments.push({
                        id: rule.id,
                        priority: rule.priority,
                        ...adjustment
                    });
                }
            } catch (e) {
                console.warn(`Rule ${rule.id} evaluation failed:`, e.message);
            }
        });
        
        // Ordina per priorità
        const priorityOrder = { high: 1, moderate: 2, low: 3 };
        adjustments.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        
        return adjustments;
    }

    /**
     * Applica aggiustamenti a un workout template
     */
    function applyAdjustments(workoutTemplate, adjustments) {
        let modified = { ...workoutTemplate };
        let appliedChanges = [];
        
        adjustments.forEach(adj => {
            switch (adj.type) {
                case 'volume_reduction':
                    modified.volumeMultiplier = (modified.volumeMultiplier || 1) * adj.factor;
                    appliedChanges.push(`Volume ridotto a ${Math.round(adj.factor * 100)}%`);
                    break;
                    
                case 'intensity_reduction':
                    modified.intensityMultiplier = (modified.intensityMultiplier || 1) * adj.factor;
                    appliedChanges.push(`Intensità ridotta a ${Math.round(adj.factor * 100)}%`);
                    break;
                    
                case 'taper':
                    modified.volumeMultiplier = (modified.volumeMultiplier || 1) * adj.volumeMultiplier;
                    modified.intensityMultiplier = (modified.intensityMultiplier || 1) * adj.intensityMultiplier;
                    appliedChanges.push('Taper pre-gara applicato');
                    break;
                    
                case 'complexity_reduction':
                    modified.maxMethods = adj.maxMethods;
                    modified.preferMethods = adj.preferMethods || [];
                    modified.avoidMethods = [...(modified.avoidMethods || []), ...(adj.avoidMethods || [])];
                    appliedChanges.push('Complessità ridotta');
                    break;
                    
                case 'muscle_avoidance':
                    modified.avoidMuscles = [...(modified.avoidMuscles || []), ...adj.avoidMuscles];
                    appliedChanges.push(`Evitati muscoli: ${adj.avoidMuscles.join(', ')}`);
                    break;
                    
                case 'progression_push':
                    modified.intensityMultiplier = (modified.intensityMultiplier || 1) * adj.intensityBoost;
                    modified.volumeMultiplier = (modified.volumeMultiplier || 1) * adj.volumeBoost;
                    modified.progressionPush = true;
                    appliedChanges.push('Opportunità progressione sfruttata!');
                    break;
                    
                case 'warmup_extension':
                    modified.warmupMultiplier = adj.warmupMultiplier;
                    appliedChanges.push('Warmup esteso');
                    break;
                    
                case 'fatigue_compensation':
                    modified.intensityMultiplier = (modified.intensityMultiplier || 1) * adj.intensityMultiplier;
                    modified.preferLessTechnical = true;
                    appliedChanges.push('Compensazione fatica serale');
                    break;
            }
            
            modified.adjustmentReasons = modified.adjustmentReasons || [];
            modified.adjustmentReasons.push(adj.reason);
        });
        
        modified.appliedChanges = appliedChanges;
        
        return modified;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. LEARNING FROM FEEDBACK - Apprendimento dal feedback
    // ═══════════════════════════════════════════════════════════════════════════

    const FEEDBACK_PATTERNS = {
        // Pattern: RPE riportato sempre più alto di previsto
        rpeOverestimation: {
            detect: (history) => {
                if (!history.workouts || history.workouts.length < 5) return null;
                
                const lastWorkouts = history.workouts.slice(-5);
                const overestimations = lastWorkouts.filter(w => 
                    w.actualRPE && w.expectedRPE && (w.actualRPE - w.expectedRPE > 1)
                );
                
                if (overestimations.length >= 3) {
                    return {
                        pattern: 'consistent_rpe_overestimation',
                        severity: 'moderate',
                        count: overestimations.length,
                        suggestion: 'Ridurre intensità programmata del 10%'
                    };
                }
                return null;
            }
        },
        
        // Pattern: Compliance cala nei workout lunghi
        longWorkoutAvoidance: {
            detect: (history) => {
                if (!history.workouts || history.workouts.length < 10) return null;
                
                const longWorkouts = history.workouts.filter(w => w.plannedDuration > 60);
                const shortWorkouts = history.workouts.filter(w => w.plannedDuration <= 60);
                
                const longCompliance = longWorkouts.filter(w => w.completed).length / (longWorkouts.length || 1);
                const shortCompliance = shortWorkouts.filter(w => w.completed).length / (shortWorkouts.length || 1);
                
                if (longCompliance < shortCompliance - 0.3 && longWorkouts.length >= 3) {
                    return {
                        pattern: 'long_workout_avoidance',
                        severity: 'moderate',
                        longCompliance: Math.round(longCompliance * 100),
                        shortCompliance: Math.round(shortCompliance * 100),
                        suggestion: 'Preferire sessioni più corte e intense'
                    };
                }
                return null;
            }
        },
        
        // Pattern: Skip frequente del cardio
        cardioAvoidance: {
            detect: (history) => {
                if (!history.workouts) return null;
                
                const withCardio = history.workouts.filter(w => w.hasCardio);
                if (withCardio.length < 5) return null;
                
                const skippedCardio = withCardio.filter(w => w.cardioSkipped);
                const skipRate = skippedCardio.length / withCardio.length;
                
                if (skipRate > 0.5) {
                    return {
                        pattern: 'cardio_avoidance',
                        severity: 'low',
                        skipRate: Math.round(skipRate * 100),
                        suggestion: 'Integrare cardio negli esercizi di forza (superset con active recovery)'
                    };
                }
                return null;
            }
        },
        
        // Pattern: Performance cala il lunedì
        mondayPerformanceDip: {
            detect: (history) => {
                if (!history.workouts || history.workouts.length < 12) return null;
                
                const mondayWorkouts = history.workouts.filter(w => 
                    new Date(w.date).getDay() === 1 && w.performanceRating
                );
                const otherWorkouts = history.workouts.filter(w => 
                    new Date(w.date).getDay() !== 1 && w.performanceRating
                );
                
                if (mondayWorkouts.length < 3) return null;
                
                const mondayAvg = mondayWorkouts.reduce((s, w) => s + w.performanceRating, 0) / mondayWorkouts.length;
                const otherAvg = otherWorkouts.reduce((s, w) => s + w.performanceRating, 0) / (otherWorkouts.length || 1);
                
                if (mondayAvg < otherAvg - 1) {
                    return {
                        pattern: 'monday_performance_dip',
                        severity: 'low',
                        mondayAvg: mondayAvg.toFixed(1),
                        otherAvg: otherAvg.toFixed(1),
                        suggestion: 'Iniziare settimana con sessione meno intensa o più lunga preparazione'
                    };
                }
                return null;
            }
        }
    };

    /**
     * Analizza la storia per trovare pattern
     */
    function analyzePatterns(history) {
        const detectedPatterns = [];
        
        Object.entries(FEEDBACK_PATTERNS).forEach(([key, pattern]) => {
            try {
                const result = pattern.detect(history);
                if (result) {
                    detectedPatterns.push({
                        id: key,
                        ...result
                    });
                }
            } catch (e) {
                console.warn(`Pattern ${key} detection failed:`, e.message);
            }
        });
        
        return detectedPatterns;
    }

    /**
     * Genera raccomandazioni basate sui pattern
     */
    function generatePatternBasedRecommendations(patterns) {
        return patterns.map(p => ({
            source: 'pattern_detection',
            patternId: p.id,
            severity: p.severity,
            recommendation: p.suggestion,
            evidence: p
        }));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. ALERT SYSTEM - Sistema di avvisi proattivi
    // ═══════════════════════════════════════════════════════════════════════════

    const ALERT_DEFINITIONS = {
        injury_risk_critical: {
            condition: (predictions) => predictions.injuryRisk?.riskLevel === 'critical',
            level: 'critical',
            title: '🔴 RISCHIO INFORTUNIO CRITICO',
            message: 'Il rischio infortunio ha raggiunto livelli critici. Azione immediata richiesta.',
            action: 'DELOAD o RIPOSO immediato',
            notifyCoach: true,
            notifyAthlete: true
        },
        plateau_warning: {
            condition: (predictions) => predictions.plateauRisk?.riskScore > 60,
            level: 'warning',
            title: '🟠 POSSIBILE PLATEAU',
            message: 'Rilevati segnali di stagnazione. Considera variazioni al programma.',
            action: 'Cambio stimolo o deload strategico',
            notifyCoach: true,
            notifyAthlete: false
        },
        burnout_warning: {
            condition: (predictions) => predictions.burnoutRisk?.riskScore > 50,
            level: 'warning',
            title: '🟠 RISCHIO BURNOUT',
            message: 'Segnali di sovrallenamento o esaurimento motivazionale.',
            action: 'Pausa rigenerante o sessioni "fun"',
            notifyCoach: true,
            notifyAthlete: true
        },
        match_approaching: {
            condition: (data) => data.daysToMatch === 3,
            level: 'info',
            title: '🔵 PARTITA IN 3 GIORNI',
            message: 'Inizia la fase di tapering per la gara imminente.',
            action: 'Riduzione volume automatica attivata',
            notifyCoach: true,
            notifyAthlete: true
        },
        deload_recommended: {
            condition: (data) => data.weeksSinceDeload >= 5 && data.acwr > 1.2,
            level: 'info',
            title: '🔵 DELOAD CONSIGLIATO',
            message: 'Sono passate 5+ settimane dall\'ultimo deload.',
            action: 'Pianifica settimana di scarico',
            notifyCoach: true,
            notifyAthlete: false
        },
        progress_milestone: {
            condition: (data) => data.progressMilestone === true,
            level: 'success',
            title: '🟢 TRAGUARDO RAGGIUNTO!',
            message: 'L\'atleta ha raggiunto un nuovo traguardo di performance.',
            action: 'Celebra il successo e imposta nuovo obiettivo',
            notifyCoach: true,
            notifyAthlete: true
        }
    };

    /**
     * Genera alert basati su predizioni e dati
     */
    function generateAlerts(data, predictions) {
        const alerts = [];
        
        Object.entries(ALERT_DEFINITIONS).forEach(([key, def]) => {
            try {
                // Controlla condizione con dati o predizioni
                if (def.condition(predictions) || def.condition(data)) {
                    alerts.push({
                        id: key,
                        timestamp: new Date().toISOString(),
                        level: def.level,
                        title: def.title,
                        message: def.message,
                        action: def.action,
                        notifyCoach: def.notifyCoach,
                        notifyAthlete: def.notifyAthlete
                    });
                }
            } catch (e) {
                // Condition may fail if data not available
            }
        });
        
        // Ordina per livello
        const levelOrder = { critical: 1, warning: 2, info: 3, success: 4 };
        alerts.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
        
        return alerts;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. MAIN FUNCTION - Esegue l'analisi completa
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Esegue analisi autonoma completa
     * @param {Object} athleteData - Dati atleta (profilo + contesto + storico)
     * @returns {Object} Risultato analisi completa
     */
    function analyze(athleteData) {
        console.log(`🤖 ${NAME}: Starting autonomous analysis...`);
        
        const startTime = performance.now();
        const result = {};
        
        // 1. Predizioni
        console.log('  Running predictions...');
        result.predictions = runPredictions(athleteData);
        
        // 2. Calcola aggiustamenti
        console.log('  Calculating adjustments...');
        result.adjustments = calculateAdjustments(athleteData);
        
        // 3. Analizza pattern storici
        console.log('  Analyzing patterns...');
        result.patterns = analyzePatterns(athleteData.history || {});
        result.patternRecommendations = generatePatternBasedRecommendations(result.patterns);
        
        // 4. Genera alert
        console.log('  Generating alerts...');
        result.alerts = generateAlerts(athleteData, result.predictions);
        
        // 5. Sommario
        const duration = performance.now() - startTime;
        
        result.summary = {
            duration: Math.round(duration),
            criticalIssues: result.alerts.filter(a => a.level === 'critical').length,
            warningIssues: result.alerts.filter(a => a.level === 'warning').length,
            adjustmentsCount: result.adjustments.length,
            patternsDetected: result.patterns.length,
            overallStatus: getOverallStatus(result)
        };
        
        console.log(`  ✓ Analysis complete in ${result.summary.duration}ms`);
        console.log(`    Status: ${result.summary.overallStatus}`);
        
        return result;
    }

    function getOverallStatus(result) {
        if (result.alerts.some(a => a.level === 'critical')) return 'CRITICAL_ATTENTION';
        if (result.alerts.some(a => a.level === 'warning')) return 'NEEDS_ATTENTION';
        if (result.adjustments.length > 0) return 'MINOR_ADJUSTMENTS';
        return 'OPTIMAL';
    }

    /**
     * Genera testo per iniezione nel prompt
     */
    function formatForPrompt(analysisResult) {
        let prompt = '\n═══ AUTONOMOUS ADAPTATION ANALYSIS ═══\n\n';
        
        // Status
        prompt += `📊 STATUS: ${analysisResult.summary.overallStatus}\n\n`;
        
        // Alerts
        if (analysisResult.alerts.length > 0) {
            prompt += '🚨 ALERT:\n';
            analysisResult.alerts.forEach(a => {
                prompt += `${a.title}\n`;
                prompt += `  ${a.message}\n`;
                prompt += `  Azione: ${a.action}\n\n`;
            });
        }
        
        // Predictions
        prompt += '📈 PREDIZIONI RISCHIO:\n';
        Object.entries(analysisResult.predictions).forEach(([key, pred]) => {
            if (!pred.error) {
                prompt += `• ${key}: ${pred.riskLevel} (${pred.riskScore}/100)\n`;
                if (pred.reasons.length > 0) {
                    pred.reasons.forEach(r => prompt += `  - ${r}\n`);
                }
            }
        });
        
        // Adjustments
        if (analysisResult.adjustments.length > 0) {
            prompt += '\n⚙️ AGGIUSTAMENTI AUTOMATICI:\n';
            analysisResult.adjustments.forEach(adj => {
                prompt += `• [${adj.priority}] ${adj.reason}\n`;
            });
        }
        
        // Pattern recommendations
        if (analysisResult.patternRecommendations.length > 0) {
            prompt += '\n💡 RACCOMANDAZIONI DA PATTERN:\n';
            analysisResult.patternRecommendations.forEach(rec => {
                prompt += `• ${rec.recommendation}\n`;
            });
        }
        
        return prompt;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════════

    console.log(`🤖 ${NAME} v${VERSION} loaded - Autonomous adaptation ready`);

    return {
        VERSION,
        NAME,
        
        // Main function
        analyze,
        
        // Individual components
        runPredictions,
        calculateAdjustments,
        applyAdjustments,
        analyzePatterns,
        generateAlerts,
        
        // Formatting
        formatForPrompt,
        
        // Access to models
        PREDICTION_MODELS,
        ADJUSTMENT_RULES,
        FEEDBACK_PATTERNS,
        ALERT_DEFINITIONS
    };
})();
