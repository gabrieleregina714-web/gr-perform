/**
 * ═══════════════════════════════════════════════════════════════════════════════════
 * 🛡️ ATLAS GUARDIAN v1.0 - Sistema Autonomo di Protezione e Decisione
 * ═══════════════════════════════════════════════════════════════════════════════════
 * 
 * "A PROVA DI BOMBA" - Il guardiano che non dorme mai
 * 
 * Questo modulo rappresenta il "Team di Esperti" autonomo:
 * - 🧠 NEUROSCIENTIST: Monitora CNS e fatica neurale
 * - 💪 PHYSIOLOGIST: Gestisce recupero muscolare e adattamenti
 * - 🏥 SPORTS MEDICINE: Previene infortuni e gestisce dolore
 * - 📊 DATA SCIENTIST: Analizza pattern e predice outcome
 * - 🎯 PERFORMANCE COACH: Ottimizza timing e periodizzazione
 * - ⚠️ SAFETY OFFICER: Ultimo gate prima di ogni decisione
 * 
 * PRINCIPIO GUIDA: 
 * "Mai un workout che possa danneggiare. Mai un'occasione persa per migliorare."
 * 
 * Basato su: 
 * - Kiely 2024 (Flexible Periodization)
 * - Schoenfeld 2024 (Muscle Recovery Meta-analysis)
 * - Halperin 2024 (Neural Fatigue)
 * - Kellmann 2024 (Recovery-Stress Balance)
 * ═══════════════════════════════════════════════════════════════════════════════════
 */

window.ATLASGuardian = {
    
    version: '1.0.0',
    codename: 'SENTINEL',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🚨 SOGLIE DI SICUREZZA ASSOLUTE - MAI SUPERARE
    // ═══════════════════════════════════════════════════════════════════════════
    
    ABSOLUTE_LIMITS: {
        // MAI generare workout se:
        max_consecutive_training_days: 6,     // 6 giorni consecutivi = STOP
        min_hours_between_sessions: 4,        // Almeno 4h tra sessioni
        max_weekly_volume_sets: 120,          // Max 120 set/settimana
        max_weekly_heavy_sessions: 4,         // Max 4 sessioni pesanti/sett
        max_high_rpe_consecutive: 3,          // Max 3 sessioni consecutive RPE 8+
        
        // Limiti recupero
        min_cns_recovery_percent: 40,         // Se CNS < 40% → solo mobility
        min_muscle_recovery_percent: 30,      // Se muscolo < 30% → NO quel muscolo
        
        // Limiti pain/injury
        pain_level_stop: 7,                   // Pain >= 7/10 → STOP esercizio
        recurring_pain_sessions: 3,           // Stesso dolore 3x → MODIFICA PROGRAMMA
        
        // Limiti age-specific
        over_50_max_heavy_days: 3,
        over_50_mandatory_rest_ratio: 0.4,    // 40% giorni riposo
        
        // Limiti deload
        max_weeks_without_deload: 6,
        forced_deload_after_weeks: 8
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧠 IL TEAM DI ESPERTI VIRTUALI
    // ═══════════════════════════════════════════════════════════════════════════
    
    experts: {
        
        /**
         * 🧠 NEUROSCIENTIST - Monitora sistema nervoso centrale
         */
        neuroscientist: {
            name: 'Dr. Neural',
            evaluate(athleteData, workoutPlan) {
                const signals = {
                    approval: true,
                    concerns: [],
                    modifications: [],
                    cnsStatus: 'unknown'
                };
                
                // Stima carico CNS del workout proposto
                const proposedCNSLoad = this.estimateCNSLoad(workoutPlan);
                const currentCNS = athleteData.cnsRecovery || 100;
                
                // ══════════════════════════════════════════════════════════════
                // Soglie CNS aggiustate per età
                // Il sistema nervoso di un 55enne NON recupera come un 25enne
                // ══════════════════════════════════════════════════════════════
                let cnsThresholdDepleted = 40;
                let cnsThresholdFatigued = 60;
                let cnsThresholdModerate = 80;
                
                if (athleteData.age) {
                    if (athleteData.age >= 60) {
                        cnsThresholdDepleted = 55;   // +15: soglia più conservativa
                        cnsThresholdFatigued = 70;
                        cnsThresholdModerate = 85;
                    } else if (athleteData.age >= 50) {
                        cnsThresholdDepleted = 50;   // +10
                        cnsThresholdFatigued = 65;
                        cnsThresholdModerate = 82;
                    } else if (athleteData.age >= 40) {
                        cnsThresholdDepleted = 45;   // +5
                        cnsThresholdFatigued = 62;
                        cnsThresholdModerate = 80;
                    }
                    // Under 40: usa soglie default
                }
                
                signals.cnsStatus = currentCNS >= cnsThresholdModerate ? 'fresh' : 
                                    currentCNS >= cnsThresholdFatigued ? 'moderate' : 
                                    currentCNS >= cnsThresholdDepleted ? 'fatigued' : 'depleted';
                
                // CNS depleto → NO lavoro pesante
                if (currentCNS < cnsThresholdDepleted) {
                    signals.approval = false;
                    signals.concerns.push({
                        severity: 'critical',
                        message: athleteData.age >= 50 
                            ? `CNS depleto (età ${athleteData.age}: soglia ${cnsThresholdDepleted}%) - solo mobility/stretching` 
                            : 'CNS depleto - solo mobility/stretching consentiti',
                        recommendation: 'rest_or_mobility'
                    });
                }
                // CNS affaticato → limita esplosività
                else if (currentCNS < cnsThresholdFatigued && proposedCNSLoad > 50) {
                    signals.modifications.push({
                        type: 'reduce_intensity',
                        target: 'explosive_exercises',
                        factor: athleteData.age >= 50 ? 0.6 : 0.7,  // Più conservativo per over 50
                        message: athleteData.age >= 50 
                            ? 'Over 50: Ridurre esercizi esplosivi del 40%'
                            : 'Ridurre esercizi esplosivi del 30%'
                    });
                }
                // CNS moderato → attenzione
                else if (currentCNS < cnsThresholdModerate && proposedCNSLoad > 70) {
                    signals.concerns.push({
                        severity: 'warning',
                        message: 'CNS non completamente recuperato - monitorare fatica',
                        recommendation: 'reduce_volume_10'
                    });
                }
                
                return signals;
            },
            
            estimateCNSLoad(workout) {
                if (!workout?.exercises) return 30;
                
                let load = 0;
                workout.exercises.forEach(ex => {
                    const name = (ex.name || '').toLowerCase();
                    const sets = parseInt(ex.sets) || 3;
                    
                    // Esercizi ad alto impatto CNS
                    if (/deadlift|clean|snatch|maximal|1rm|sprint/i.test(name)) {
                        load += sets * 10;
                    } else if (/squat|heavy|power|explosive/i.test(name)) {
                        load += sets * 7;
                    } else if (/bench|press|row|jump|plyometric/i.test(name)) {
                        load += sets * 5;
                    } else if (/isolation|curl|raise|machine/i.test(name)) {
                        load += sets * 2;
                    } else {
                        load += sets * 3;
                    }
                });
                
                return Math.min(100, load);
            }
        },
        
        /**
         * 💪 PHYSIOLOGIST - Gestisce recupero muscolare
         */
        physiologist: {
            name: 'Dr. Muscle',
            evaluate(athleteData, workoutPlan) {
                const signals = {
                    approval: true,
                    concerns: [],
                    modifications: [],
                    muscleStatus: {}
                };
                
                const muscleRecovery = athleteData.muscleRecovery || {};
                const targetMuscles = this.extractTargetMuscles(workoutPlan);
                
                targetMuscles.forEach(muscle => {
                    const recovery = muscleRecovery[muscle]?.recovery ?? 100;
                    signals.muscleStatus[muscle] = recovery;
                    
                    // Muscolo non recuperato
                    if (recovery < 30) {
                        signals.concerns.push({
                            severity: 'critical',
                            message: `${muscle.toUpperCase()} recuperato solo al ${recovery}% - EVITARE`,
                            recommendation: 'skip_muscle'
                        });
                        signals.modifications.push({
                            type: 'remove_muscle',
                            target: muscle,
                            message: `Rimuovere esercizi per ${muscle}`
                        });
                    } else if (recovery < 60) {
                        signals.modifications.push({
                            type: 'reduce_volume',
                            target: muscle,
                            factor: 0.5,
                            message: `Dimezzare volume per ${muscle} (${recovery}% recovery)`
                        });
                    } else if (recovery < 80) {
                        signals.concerns.push({
                            severity: 'info',
                            message: `${muscle} al ${recovery}% - volume moderato consigliato`
                        });
                    }
                });
                
                // Controllo volume totale
                const totalSets = (workoutPlan.exercises || []).reduce((sum, ex) => 
                    sum + (parseInt(ex.sets) || 3), 0);
                
                if (totalSets > 30) {
                    signals.modifications.push({
                        type: 'reduce_total_volume',
                        message: `Volume alto (${totalSets} set) - ridurre a 25-28`,
                        factor: 0.85
                    });
                }
                
                return signals;
            },
            
            extractTargetMuscles(workout) {
                if (!workout?.exercises) return [];
                
                const muscleKeywords = {
                    'chest': ['bench', 'chest', 'push-up', 'fly', 'pec'],
                    'back': ['row', 'pull-up', 'lat', 'back', 'deadlift'],
                    'shoulders': ['press', 'shoulder', 'raise', 'delt', 'lateral'],
                    'quadriceps': ['squat', 'leg press', 'lunge', 'extension'],
                    'hamstrings': ['curl', 'rdl', 'romanian', 'nordic'],
                    'glutes': ['hip', 'glute', 'thrust', 'bridge'],
                    'biceps': ['curl', 'bicep', 'chin-up'],
                    'triceps': ['tricep', 'pushdown', 'extension', 'dip'],
                    'core': ['plank', 'crunch', 'ab', 'core', 'twist']
                };
                
                const muscles = new Set();
                
                workout.exercises.forEach(ex => {
                    const name = (ex.name || '').toLowerCase();
                    Object.entries(muscleKeywords).forEach(([muscle, keywords]) => {
                        if (keywords.some(kw => name.includes(kw))) {
                            muscles.add(muscle);
                        }
                    });
                });
                
                return Array.from(muscles);
            }
        },
        
        /**
         * 🏥 SPORTS MEDICINE - Previene infortuni
         */
        sportsMedicine: {
            name: 'Dr. Prevention',
            evaluate(athleteData, workoutPlan, anamnesi = {}) {
                const signals = {
                    approval: true,
                    concerns: [],
                    modifications: [],
                    riskLevel: 'low'
                };
                
                // 1. Controlla anamnesi infortuni
                const injuries = anamnesi.injuries || [];
                const medicalConditions = anamnesi.medicalConditions || [];
                
                injuries.forEach(injury => {
                    if (injury.status === 'active' || injury.status === 'recovering') {
                        signals.concerns.push({
                            severity: injury.status === 'active' ? 'critical' : 'warning',
                            message: `Infortunio ${injury.status}: ${injury.bodyPart || injury.type}`,
                            recommendation: 'avoid_affected_area'
                        });
                        
                        signals.modifications.push({
                            type: 'avoid_body_part',
                            target: injury.bodyPart,
                            message: `Evitare esercizi che coinvolgono ${injury.bodyPart}`
                        });
                        
                        if (injury.status === 'active') {
                            signals.riskLevel = 'high';
                        }
                    }
                });
                
                // 2. Controlla dolore ricorrente da feedback
                const painHistory = athleteData.painHistory || [];
                const recurringPain = this.findRecurringPain(painHistory);
                
                recurringPain.forEach(pain => {
                    signals.concerns.push({
                        severity: 'warning',
                        message: `Dolore ricorrente: ${pain.area} (${pain.count}x nelle ultime sessioni)`,
                        recommendation: 'investigate_and_modify'
                    });
                    
                    signals.modifications.push({
                        type: 'modify_for_pain',
                        target: pain.area,
                        message: `Sostituire esercizi problematici per ${pain.area}`
                    });
                });
                
                // 3. Controlla condizioni mediche
                if (medicalConditions.includes('hypertension') || medicalConditions.includes('heart')) {
                    signals.modifications.push({
                        type: 'limit_intensity',
                        target: 'isometric_holds',
                        message: 'Limitare trattenute isometriche lunghe'
                    });
                }
                
                if (medicalConditions.includes('diabetes')) {
                    signals.concerns.push({
                        severity: 'info',
                        message: 'Monitorare glicemia durante esercizio intenso'
                    });
                }
                
                // 4. Età > 50: precauzioni extra
                if (athleteData.age > 50) {
                    signals.modifications.push({
                        type: 'warmup_extended',
                        message: 'Riscaldamento esteso (+5 min) raccomandato'
                    });
                    
                    if (athleteData.age > 60) {
                        signals.modifications.push({
                            type: 'reduce_plyometrics',
                            message: 'Limitare esercizi pliometrici ad alto impatto'
                        });
                    }
                }
                
                // Calcola risk level
                const criticalCount = signals.concerns.filter(c => c.severity === 'critical').length;
                const warningCount = signals.concerns.filter(c => c.severity === 'warning').length;
                
                if (criticalCount > 0) signals.riskLevel = 'high';
                else if (warningCount > 2) signals.riskLevel = 'medium';
                
                return signals;
            },
            
            findRecurringPain(painHistory) {
                const painCounts = {};
                painHistory.forEach(session => {
                    (session.areas || []).forEach(area => {
                        painCounts[area] = (painCounts[area] || 0) + 1;
                    });
                });
                
                return Object.entries(painCounts)
                    .filter(([_, count]) => count >= 3)
                    .map(([area, count]) => ({ area, count }));
            }
        },
        
        /**
         * 📊 DATA SCIENTIST - Analizza pattern e predice
         */
        dataScientist: {
            name: 'Dr. Analytics',
            evaluate(athleteData, workoutPlan) {
                const signals = {
                    approval: true,
                    concerns: [],
                    insights: [],
                    predictions: {}
                };
                
                const workoutHistory = athleteData.workoutHistory || [];
                const feedbackHistory = athleteData.feedbackHistory || [];
                
                // 1. Plateau Detection
                if (feedbackHistory.length >= 5) {
                    const recentRPE = feedbackHistory.slice(0, 5).map(f => f.rpe || 7);
                    const avgRPE = recentRPE.reduce((a, b) => a + b, 0) / recentRPE.length;
                    const variance = recentRPE.reduce((sum, r) => sum + Math.pow(r - avgRPE, 2), 0) / recentRPE.length;
                    
                    if (variance < 0.5 && avgRPE > 7.5) {
                        signals.predictions.plateau = {
                            likely: true,
                            confidence: 75,
                            message: 'Possibile plateau in arrivo - variare stimoli'
                        };
                        signals.insights.push({
                            type: 'plateau_warning',
                            message: 'RPE costantemente alto - consider changing stimulus'
                        });
                    }
                }
                
                // 2. Overtraining Trend
                if (workoutHistory.length >= 7) {
                    const lastWeekWorkouts = workoutHistory.filter(w => {
                        const d = new Date(w.created_at);
                        return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
                    });
                    
                    if (lastWeekWorkouts.length >= 6) {
                        signals.predictions.overtraining = {
                            likely: true,
                            confidence: 80,
                            message: `${lastWeekWorkouts.length} workout in 7 giorni - rischio overtraining`
                        };
                        signals.concerns.push({
                            severity: 'warning',
                            message: 'Volume settimanale elevato - inserire rest day'
                        });
                    }
                }
                
                // 3. Deload Timing
                const weeksSinceDeload = athleteData.weeksSinceDeload || 
                    Math.floor(workoutHistory.length / 4);
                
                if (weeksSinceDeload >= 5) {
                    signals.predictions.deload = {
                        needed: true,
                        urgency: weeksSinceDeload >= 7 ? 'immediate' : 'soon',
                        message: `${weeksSinceDeload} settimane dall'ultimo deload`
                    };
                }
                
                // 4. Performance Trend
                if (feedbackHistory.length >= 3) {
                    const recentPerf = feedbackHistory.slice(0, 3).map(f => f.performance_feeling || 5);
                    const trend = recentPerf[0] - recentPerf[2];
                    
                    signals.predictions.performance = {
                        trend: trend > 0.5 ? 'improving' : trend < -0.5 ? 'declining' : 'stable',
                        message: trend > 0.5 ? 'Performance in miglioramento' : 
                                 trend < -0.5 ? 'Performance in calo - verificare recupero' : 
                                 'Performance stabile'
                    };
                }
                
                return signals;
            }
        },
        
        /**
         * 🎯 PERFORMANCE COACH - Ottimizza timing
         */
        performanceCoach: {
            name: 'Coach Optimizer',
            evaluate(athleteData, workoutPlan, schedule = {}) {
                const signals = {
                    approval: true,
                    concerns: [],
                    modifications: [],
                    timing: {}
                };
                
                const today = new Date().getDay(); // 0=Sun, 1=Mon, ...
                const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                const todayName = dayNames[today];
                const tomorrowName = dayNames[(today + 1) % 7];
                
                // 1. Controlla cosa c'è domani
                const tomorrowActivity = schedule[tomorrowName];
                
                if (this.isMatchDay(tomorrowActivity)) {
                    signals.concerns.push({
                        severity: 'critical',
                        message: 'Partita/Gara domani - solo lavoro leggero oggi',
                        recommendation: 'pre_match'
                    });
                    signals.modifications.push({
                        type: 'pre_competition',
                        message: 'Convertire a sessione di attivazione (no fatica)'
                    });
                    signals.timing.preCompetition = true;
                }
                
                if (this.isTrainingDay(tomorrowActivity)) {
                    signals.concerns.push({
                        severity: 'warning',
                        message: 'Allenamento squadra domani - evitare lavoro gambe pesante',
                        recommendation: 'no_heavy_legs'
                    });
                    signals.modifications.push({
                        type: 'preserve_for_tomorrow',
                        target: 'legs',
                        message: 'Ridurre volume/intensità gambe'
                    });
                }
                
                // 2. Controlla cosa c'era ieri
                const yesterdayName = dayNames[(today + 6) % 7];
                const yesterdayActivity = schedule[yesterdayName];
                
                if (this.isMatchDay(yesterdayActivity)) {
                    signals.concerns.push({
                        severity: 'info',
                        message: 'Partita ieri - focus su recovery'
                    });
                    signals.modifications.push({
                        type: 'post_competition',
                        message: 'Sessione di recupero attivo'
                    });
                    signals.timing.postCompetition = true;
                }
                
                // 3. Periodization check
                const currentPhase = athleteData.phase || 'accumulo';
                const currentWeek = athleteData.currentWeek || 1;
                
                // Deload week check
                if (currentWeek % 4 === 0) {
                    signals.timing.deloadWeek = true;
                    signals.modifications.push({
                        type: 'deload',
                        message: 'Settimana di deload - 60-70% del volume normale'
                    });
                }
                
                return signals;
            },
            
            isMatchDay(activity) {
                if (!activity) return false;
                const v = String(activity).toLowerCase();
                return ['match', 'partita', 'gara', 'competition', 'fight', 'incontro'].includes(v);
            },
            
            isTrainingDay(activity) {
                if (!activity) return false;
                const v = String(activity).toLowerCase();
                return ['team_training', 'training', 'allenamento', 'pratica', 'tecnica', 'technical'].includes(v);
            }
        },
        
        /**
         * ⚠️ SAFETY OFFICER - Gate finale
         */
        safetyOfficer: {
            name: 'Safety Gate',
            
            /**
             * VETO FINALE - può bloccare tutto
             */
            finalCheck(allEvaluations, athleteData) {
                const result = {
                    approved: true,
                    vetoReasons: [],
                    overallRisk: 'low',
                    mandatoryModifications: []
                };
                
                const limits = window.ATLASGuardian.ABSOLUTE_LIMITS;
                
                // 1. Check critical concerns across all experts
                let criticalCount = 0;
                let highRiskCount = 0;
                
                Object.values(allEvaluations).forEach(evaluation => {
                    if (!evaluation) return;
                    (evaluation.concerns || []).forEach(c => {
                        if (c.severity === 'critical') criticalCount++;
                    });
                    if (evaluation.riskLevel === 'high') highRiskCount++;
                });
                
                // Troppi critical = VETO
                if (criticalCount >= 3) {
                    result.approved = false;
                    result.vetoReasons.push(`${criticalCount} problemi critici rilevati`);
                }
                
                // 2. Absolute limits check
                if (athleteData.consecutiveTrainingDays >= limits.max_consecutive_training_days) {
                    result.approved = false;
                    result.vetoReasons.push(`${athleteData.consecutiveTrainingDays} giorni consecutivi - REST OBBLIGATORIO`);
                }
                
                if (athleteData.cnsRecovery && athleteData.cnsRecovery < limits.min_cns_recovery_percent) {
                    result.mandatoryModifications.push({
                        type: 'convert_to_mobility',
                        message: 'CNS troppo basso - solo mobility consentita'
                    });
                }
                
                // 3. Injury prevention override
                if (athleteData.activeInjury) {
                    result.mandatoryModifications.push({
                        type: 'injury_protocol',
                        message: 'Protocollo infortunio attivo - modifiche obbligatorie'
                    });
                }
                
                // 4. Deload enforcement
                if (athleteData.weeksSinceDeload >= limits.forced_deload_after_weeks) {
                    result.mandatoryModifications.push({
                        type: 'forced_deload',
                        message: `${athleteData.weeksSinceDeload} settimane senza deload - DELOAD OBBLIGATORIO`
                    });
                }
                
                // 5. Overall risk
                if (criticalCount > 0 || highRiskCount > 1) {
                    result.overallRisk = 'high';
                } else if (highRiskCount === 1 || criticalCount === 0) {
                    result.overallRisk = Object.values(allEvaluations).some(e => 
                        e?.concerns?.some(c => c.severity === 'warning')) ? 'medium' : 'low';
                }
                
                return result;
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 MAIN EVALUATION PIPELINE
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Valutazione completa del workout proposto
     * Tutti gli esperti valutano, poi il Safety Officer ha l'ultima parola
     */
    evaluateWorkoutPlan(athleteData, workoutPlan, options = {}) {
        console.log('\n🛡️ ATLAS GUARDIAN - Valutazione Workout');
        console.log('═'.repeat(50));
        
        const anamnesi = options.anamnesi || athleteData.anamnesi || {};
        const schedule = options.schedule || athleteData.weeklySchedule || {};
        
        // Raccogli valutazioni da tutti gli esperti
        const evaluations = {
            neuroscientist: this.experts.neuroscientist.evaluate(athleteData, workoutPlan),
            physiologist: this.experts.physiologist.evaluate(athleteData, workoutPlan),
            sportsMedicine: this.experts.sportsMedicine.evaluate(athleteData, workoutPlan, anamnesi),
            dataScientist: this.experts.dataScientist.evaluate(athleteData, workoutPlan),
            performanceCoach: this.experts.performanceCoach.evaluate(athleteData, workoutPlan, schedule)
        };
        
        // Log valutazioni
        Object.entries(evaluations).forEach(([expert, expertEval]) => {
            const concerns = expertEval.concerns?.length || 0;
            const mods = expertEval.modifications?.length || 0;
            const status = expertEval.approval !== false ? '✅' : '❌';
            console.log(`${status} ${expert}: ${concerns} concerns, ${mods} modifications`);
        });
        
        // Safety Officer final check
        const safetyResult = this.experts.safetyOfficer.finalCheck(evaluations, athleteData);
        
        console.log('─'.repeat(50));
        console.log(`🛡️ Safety Gate: ${safetyResult.approved ? 'APPROVATO' : 'BLOCCATO'}`);
        console.log(`   Risk Level: ${safetyResult.overallRisk.toUpperCase()}`);
        if (safetyResult.vetoReasons.length > 0) {
            console.log(`   Veto Reasons: ${safetyResult.vetoReasons.join(', ')}`);
        }
        console.log('═'.repeat(50));
        
        return {
            approved: safetyResult.approved,
            overallRisk: safetyResult.overallRisk,
            vetoReasons: safetyResult.vetoReasons,
            evaluations,
            allModifications: this.collectAllModifications(evaluations, safetyResult),
            allConcerns: this.collectAllConcerns(evaluations),
            recommendations: this.generateFinalRecommendations(evaluations, safetyResult)
        };
    },
    
    collectAllModifications(evaluations, safetyResult) {
        const mods = [];
        
        Object.values(evaluations).forEach(evaluation => {
            if (evaluation?.modifications) {
                mods.push(...evaluation.modifications);
            }
        });
        
        if (safetyResult?.mandatoryModifications) {
            mods.push(...safetyResult.mandatoryModifications.map(m => ({
                ...m,
                mandatory: true
            })));
        }
        
        return mods;
    },
    
    collectAllConcerns(evaluations) {
        const concerns = [];
        
        Object.entries(evaluations).forEach(([expert, evaluation]) => {
            if (evaluation?.concerns) {
                evaluation.concerns.forEach(c => {
                    concerns.push({
                        ...c,
                        expert
                    });
                });
            }
        });
        
        // Sort by severity
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        concerns.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
        
        return concerns;
    },
    
    generateFinalRecommendations(evaluations, safetyResult) {
        const recs = [];
        
        // Da insights del data scientist
        const insights = evaluations.dataScientist?.insights || [];
        insights.forEach(i => {
            recs.push({
                type: 'insight',
                message: i.message
            });
        });
        
        // Da predictions
        const predictions = evaluations.dataScientist?.predictions || {};
        if (predictions.plateau?.likely) {
            recs.push({
                type: 'action',
                priority: 'medium',
                message: 'Variare stimoli allenamento - possibile plateau'
            });
        }
        if (predictions.deload?.needed) {
            recs.push({
                type: 'action',
                priority: predictions.deload.urgency === 'immediate' ? 'high' : 'medium',
                message: predictions.deload.message
            });
        }
        
        // Da timing del coach
        const timing = evaluations.performanceCoach?.timing || {};
        if (timing.preCompetition) {
            recs.push({
                type: 'timing',
                priority: 'high',
                message: 'Pre-gara: solo attivazione, niente fatica'
            });
        }
        if (timing.postCompetition) {
            recs.push({
                type: 'timing',
                priority: 'high',
                message: 'Post-gara: focus su recovery attivo'
            });
        }
        
        return recs;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 WORKOUT MODIFICATION ENGINE
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Applica tutte le modifiche necessarie al workout
     */
    applyModifications(workout, evaluation) {
        if (!evaluation || !workout) return workout;
        
        let modifiedWorkout = JSON.parse(JSON.stringify(workout)); // Deep clone
        const modifications = evaluation.allModifications || [];
        
        modifications.forEach(mod => {
            switch (mod.type) {
                case 'remove_muscle':
                    modifiedWorkout = this.removeMuscleExercises(modifiedWorkout, mod.target);
                    break;
                    
                case 'reduce_volume':
                    modifiedWorkout = this.reduceVolumeForMuscle(modifiedWorkout, mod.target, mod.factor);
                    break;
                    
                case 'reduce_intensity':
                    modifiedWorkout = this.reduceIntensity(modifiedWorkout, mod.target, mod.factor);
                    break;
                    
                case 'reduce_total_volume':
                    modifiedWorkout = this.reduceTotalVolume(modifiedWorkout, mod.factor);
                    break;
                    
                case 'convert_to_mobility':
                    modifiedWorkout = this.convertToMobility(modifiedWorkout);
                    break;
                    
                case 'pre_competition':
                    modifiedWorkout = this.convertToActivation(modifiedWorkout);
                    break;
                    
                case 'deload':
                case 'forced_deload':
                    modifiedWorkout = this.applyDeload(modifiedWorkout);
                    break;
                    
                case 'warmup_extended':
                    modifiedWorkout.extendedWarmup = true;
                    break;
            }
            
            // Mark modification
            modifiedWorkout.guardianModified = true;
            modifiedWorkout.modifications = modifiedWorkout.modifications || [];
            modifiedWorkout.modifications.push(mod);
        });
        
        return modifiedWorkout;
    },
    
    removeMuscleExercises(workout, muscle) {
        const muscleKeywords = {
            'chest': ['bench', 'chest', 'push-up', 'fly', 'pec'],
            'back': ['row', 'pull-up', 'lat', 'back'],
            'shoulders': ['press', 'shoulder', 'raise', 'delt'],
            'legs': ['squat', 'leg', 'lunge', 'calf', 'hamstring', 'quad'],
            'arms': ['curl', 'tricep', 'bicep'],
            'core': ['plank', 'crunch', 'ab', 'core']
        };
        
        const keywords = muscleKeywords[muscle] || [muscle];
        
        if (workout.exercises) {
            workout.exercises = workout.exercises.filter(ex => {
                const name = (ex.name || '').toLowerCase();
                return !keywords.some(kw => name.includes(kw));
            });
        }
        
        return workout;
    },
    
    reduceVolumeForMuscle(workout, muscle, factor) {
        const muscleKeywords = {
            'chest': ['bench', 'chest', 'fly', 'pec'],
            'back': ['row', 'pull', 'lat'],
            'legs': ['squat', 'leg', 'lunge'],
            'shoulders': ['press', 'shoulder', 'raise']
        };
        
        const keywords = muscleKeywords[muscle] || [muscle];
        
        if (workout.exercises) {
            workout.exercises.forEach(ex => {
                const name = (ex.name || '').toLowerCase();
                if (keywords.some(kw => name.includes(kw))) {
                    const sets = parseInt(ex.sets) || 3;
                    ex.sets = Math.max(2, Math.round(sets * factor));
                    ex.volumeReduced = true;
                    ex.adjustmentReason = `Volume ridotto per ${muscle}`;
                }
            });
        }
        
        return workout;
    },
    
    reduceIntensity(workout, target, factor) {
        if (workout.exercises) {
            workout.exercises.forEach(ex => {
                const name = (ex.name || '').toLowerCase();
                if (target === 'explosive_exercises' && 
                    /jump|plyo|explosive|power|clean|snatch/i.test(name)) {
                    ex.intensityReduced = true;
                    ex.adjustmentReason = 'Intensità ridotta (CNS)';
                    // Riduci reps o aggiungi rest
                    const reps = parseInt(ex.reps) || 8;
                    ex.reps = Math.max(3, Math.round(reps * factor));
                }
            });
        }
        return workout;
    },
    
    reduceTotalVolume(workout, factor) {
        if (workout.exercises) {
            workout.exercises.forEach(ex => {
                const sets = parseInt(ex.sets) || 3;
                ex.sets = Math.max(2, Math.round(sets * factor));
            });
        }
        return workout;
    },
    
    convertToMobility(workout) {
        // Sostituisce tutto con sessione mobility
        return {
            name: 'Recovery & Mobility Session',
            type: 'mobility',
            guardianConverted: true,
            originalType: workout.type,
            exercises: [
                { name: 'Foam Rolling - Full Body', duration: '5 min', type: 'recovery' },
                { name: 'Cat-Cow', sets: 2, reps: '10 each', type: 'mobility' },
                { name: 'World\'s Greatest Stretch', sets: 2, reps: '5 each side', type: 'mobility' },
                { name: '90/90 Hip Stretch', sets: 2, reps: '30s each side', type: 'mobility' },
                { name: 'Thread the Needle', sets: 2, reps: '8 each side', type: 'mobility' },
                { name: 'Deep Squat Hold', sets: 3, reps: '30s', type: 'mobility' },
                { name: 'Supine Twist', sets: 2, reps: '30s each side', type: 'stretching' },
                { name: 'Light Walking', duration: '10 min', type: 'cardio' }
            ]
        };
    },
    
    convertToActivation(workout) {
        // Pre-competition: solo attivazione neuromuscolare
        return {
            name: 'Pre-Competition Activation',
            type: 'activation',
            guardianConverted: true,
            originalType: workout.type,
            exercises: [
                { name: 'Light Jogging', duration: '5 min', type: 'warmup' },
                { name: 'Dynamic Stretches', duration: '5 min', type: 'warmup' },
                { name: 'Activation Drills - Sport Specific', sets: 2, reps: '30s each', type: 'activation' },
                { name: 'Explosive Primers (50% effort)', sets: 3, reps: '3', type: 'activation' },
                { name: 'Mental Visualization', duration: '5 min', type: 'mental' }
            ],
            notes: 'Sessione convertita per pre-gara. Nessuna fatica, solo attivazione.'
        };
    },
    
    applyDeload(workout) {
        // Riduce tutto al 60%
        if (workout.exercises) {
            workout.exercises = workout.exercises.map(ex => ({
                ...ex,
                sets: Math.max(2, Math.round((parseInt(ex.sets) || 3) * 0.6)),
                deload: true,
                adjustmentReason: 'Deload week'
            }));
        }
        workout.isDeload = true;
        return workout;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 QUICK READINESS CHECK
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Check rapido di readiness per decisioni immediate
     */
    quickReadinessCheck(athleteData) {
        let score = 100;
        const flags = [];
        
        // CNS
        if (athleteData.cnsRecovery !== undefined) {
            if (athleteData.cnsRecovery < 40) {
                score -= 40;
                flags.push('CNS depleto');
            } else if (athleteData.cnsRecovery < 60) {
                score -= 20;
                flags.push('CNS affaticato');
            }
        }
        
        // Sleep
        if (athleteData.lastSleepScore !== undefined) {
            if (athleteData.lastSleepScore < 5) {
                score -= 25;
                flags.push('Sonno scarso');
            } else if (athleteData.lastSleepScore < 7) {
                score -= 10;
            }
        }
        
        // Consecutive days
        if (athleteData.consecutiveTrainingDays >= 5) {
            score -= 30;
            flags.push('Troppi giorni consecutivi');
        }
        
        // Pain
        if (athleteData.currentPain && athleteData.currentPain >= 6) {
            score -= 35;
            flags.push('Dolore significativo');
        }
        
        score = Math.max(0, score);
        
        return {
            score,
            level: score >= 80 ? 'optimal' : score >= 60 ? 'good' : score >= 40 ? 'caution' : 'stop',
            flags,
            canTrain: score >= 40,
            recommendation: score >= 80 ? 'Via libera per allenamento intenso' :
                           score >= 60 ? 'Allenamento normale OK' :
                           score >= 40 ? 'Solo lavoro leggero/tecnico' :
                           'REST DAY obbligatorio'
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔌 INTEGRATION HELPERS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Helper per integrazione con ATLASComplete
     */
    async wrapWorkoutGeneration(generateFn, athleteData, options = {}) {
        // 1. Pre-check rapido
        const readiness = this.quickReadinessCheck(athleteData);
        
        if (!readiness.canTrain) {
            console.log('🛡️ Guardian: Training blocked - returning mobility session');
            return this.convertToMobility({});
        }
        
        // 2. Genera workout
        const workout = await generateFn();
        
        // 3. Valuta con tutti gli esperti
        const evaluation = this.evaluateWorkoutPlan(athleteData, workout, options);
        
        // 4. Applica modifiche se necessario
        if (evaluation.allModifications.length > 0) {
            const modifiedWorkout = this.applyModifications(workout, evaluation);
            modifiedWorkout.guardianEvaluation = {
                approved: evaluation.approved,
                risk: evaluation.overallRisk,
                modificationsApplied: evaluation.allModifications.length
            };
            return modifiedWorkout;
        }
        
        workout.guardianEvaluation = {
            approved: evaluation.approved,
            risk: evaluation.overallRisk,
            modificationsApplied: 0
        };
        
        return workout;
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.ATLASGuardian;
}

console.log('🛡️ ATLAS Guardian v1.0 loaded - Autonomous Protection System');
