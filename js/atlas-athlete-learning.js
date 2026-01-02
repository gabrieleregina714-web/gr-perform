/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧬 ATLAS ATHLETE LEARNING MODEL v1.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sistema che IMPARA da ogni atleta e mantiene un profilo personalizzato
 * che si aggiorna automaticamente basandosi su:
 * 
 * 1. Feedback post-sessione → aggiusta intensità/volume preferiti
 * 2. Completamento esercizi → identifica punti deboli/forti
 * 3. Pattern di dolore → evita automaticamente esercizi problematici
 * 4. Velocità di recupero → calibra recupero personalizzato
 * 5. Risposta a metodologie → usa quelle che funzionano meglio
 * 
 * QUESTO È IL "CERVELLO CHE IMPARA"
 */

window.ATLASAthleteLearning = (function() {
    'use strict';

    const VERSION = '1.0.0';
    const STORAGE_KEY = 'atlas_athlete_learning_';
    const DEBUG = true;

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 MODELLO DI APPRENDIMENTO PER ATLETA
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Crea un nuovo modello vuoto per un atleta
     */
    function createEmptyModel(athleteId) {
        return {
            athleteId,
            version: VERSION,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            sessionsAnalyzed: 0,

            // ══════════════════════════════════════════════════════════════
            // PREFERENZE DI INTENSITÀ/VOLUME (si aggiornano con feedback)
            // ══════════════════════════════════════════════════════════════
            intensityProfile: {
                // Coefficiente: 1.0 = default, >1 = vuole più intensità, <1 = vuole meno
                globalMultiplier: 1.0,
                
                // Per gruppo muscolare
                byMuscleGroup: {
                    // chest: 1.1 = vuole 10% più intensità su petto
                },
                
                // Confidenza nel dato (0-1)
                confidence: 0,
                lastUpdated: null
            },

            volumeProfile: {
                globalMultiplier: 1.0,
                byMuscleGroup: {},
                confidence: 0,
                lastUpdated: null
            },

            // ══════════════════════════════════════════════════════════════
            // RECUPERO PERSONALIZZATO (impara da performance post-rest)
            // ══════════════════════════════════════════════════════════════
            recoveryProfile: {
                // Moltiplicatore: 1.0 = default, >1 = recupera più lento, <1 = più veloce
                globalRecoveryMultiplier: 1.0,
                
                // Per gruppo muscolare
                byMuscleGroup: {
                    // quadriceps: 1.2 = quadricipiti recuperano 20% più lento del default
                },
                
                // CNS recovery rate
                cnsRecoveryRate: 1.0, // 1.0 = +20%/giorno, 1.2 = +24%/giorno
                
                // Basato su età (auto-calcolato)
                ageAdjustedRate: 1.0,
                
                confidence: 0,
                lastUpdated: null
            },

            // ══════════════════════════════════════════════════════════════
            // ESERCIZI - PREFERENZE E PROBLEMI
            // ══════════════════════════════════════════════════════════════
            exerciseProfile: {
                // Esercizi che funzionano bene
                favorites: [
                    // { name: 'Romanian Deadlift', score: 8.5, timesUsed: 12 }
                ],
                
                // Esercizi problematici (dolore, troppo difficili, mai completati)
                problematic: [
                    // { name: 'Back Squat', issues: ['knee_pain', 'too_hard'], score: -3, ban: false }
                ],
                
                // Esercizi bannati (mai più proporre)
                banned: [],
                
                // Sostituzioni preferite
                preferredSubstitutions: {
                    // 'Back Squat': 'Leg Press'
                }
            },

            // ══════════════════════════════════════════════════════════════
            // METODOLOGIE - COSA FUNZIONA PER QUESTO ATLETA
            // ══════════════════════════════════════════════════════════════
            methodProfile: {
                // Score per metodologia (0-10)
                scores: {
                    // 'drop_set': 7.5,
                    // 'rest_pause': 8.2,
                    // 'straight_sets': 6.0
                },
                
                // Metodologie da evitare
                avoid: [],
                
                // Preferita per goal
                preferredByGoal: {
                    // ipertrofia: 'rest_pause',
                    // forza: 'cluster_sets'
                }
            },

            // ══════════════════════════════════════════════════════════════
            // PATTERN DI DOLORE - STORIA E PREVENZIONE
            // ══════════════════════════════════════════════════════════════
            painHistory: {
                // Aree con dolore cronico/ricorrente
                chronicAreas: [
                    // { area: 'left_knee', firstReported: '2024-01-15', occurrences: 5 }
                ],
                
                // Trigger conosciuti (esercizio → dolore)
                knownTriggers: {
                    // 'left_knee': ['Back Squat', 'Leg Extension']
                },
                
                // Esercizi sicuri per area problematica
                safeAlternatives: {
                    // 'left_knee': ['Leg Press', 'Box Squat']
                }
            },

            // ══════════════════════════════════════════════════════════════
            // RPE CALIBRATION - L'atleta sovra/sotto-stima?
            // ══════════════════════════════════════════════════════════════
            rpeCalibration: {
                // Bias: positivo = tende a sovra-stimare, negativo = sotto-stima
                bias: 0,
                
                // Target RPE corretto per questo atleta
                // Se bias = +1, quando diciamo RPE 8, lui percepisce 9
                adjustedTargets: {
                    forza: 8,
                    ipertrofia: 7,
                    potenza: 7
                },
                
                confidence: 0
            },

            // ══════════════════════════════════════════════════════════════
            // TIMING - QUANDO PERFORMA MEGLIO
            // ══════════════════════════════════════════════════════════════
            timingPreferences: {
                bestDays: [], // ['tuesday', 'thursday', 'saturday']
                worstDays: [],
                optimalSessionLength: null, // minuti
                fatigueThreshold: null // dopo quanti esercizi cala
            },

            // ══════════════════════════════════════════════════════════════
            // LEARNING LOG - Storia degli aggiornamenti
            // ══════════════════════════════════════════════════════════════
            learningLog: [
                // { timestamp, type, change, reason, confidence }
            ]
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🧠 ALGORITMI DI APPRENDIMENTO
    // ═══════════════════════════════════════════════════════════════════════════

    const LearningAlgorithms = {

        /**
         * Aggiorna profilo intensità da feedback
         * @param {Object} model - Modello atleta
         * @param {Object} feedback - Feedback sessione
         * @param {Object} workout - Workout eseguito
         */
        updateIntensityFromFeedback(model, feedback, workout) {
            const difficulty = feedback.difficulty || feedback.perceivedDifficulty || 5;
            const rpe = feedback.rpe || feedback.sessionRPE || 7;
            const energy = feedback.energy || feedback.energyLevel || 3;
            
            // Calcola quanto era giusto il workout
            // difficulty: 5 = perfetto, <5 = troppo facile, >5 = troppo difficile
            // energy: 3 = perfetto, >3 = troppo facile, <3 = troppo difficile
            
            const difficultyError = difficulty - 5; // -4 a +4
            const energySignal = 3 - energy; // -2 a +2
            
            // Combina segnali (peso maggiore a difficulty)
            const combinedSignal = (difficultyError * 0.6) + (energySignal * 0.4);
            
            // Learning rate (decresce con più dati)
            const learningRate = Math.max(0.05, 0.3 / Math.sqrt(model.sessionsAnalyzed + 1));
            
            // Aggiorna multiplier globale
            // Se combinedSignal > 0 (troppo difficile) → riduci multiplier
            // Se combinedSignal < 0 (troppo facile) → aumenta multiplier
            const oldMultiplier = model.intensityProfile.globalMultiplier;
            const adjustment = -combinedSignal * learningRate * 0.1;
            
            model.intensityProfile.globalMultiplier = Math.max(0.7, Math.min(1.3, 
                oldMultiplier + adjustment
            ));
            
            // Aggiorna confidence
            model.intensityProfile.confidence = Math.min(1, 
                model.intensityProfile.confidence + 0.05
            );
            
            model.intensityProfile.lastUpdated = new Date().toISOString();
            
            // Log
            if (Math.abs(adjustment) > 0.01) {
                model.learningLog.push({
                    timestamp: new Date().toISOString(),
                    type: 'intensity_update',
                    change: {
                        from: oldMultiplier.toFixed(3),
                        to: model.intensityProfile.globalMultiplier.toFixed(3),
                        delta: adjustment.toFixed(3)
                    },
                    reason: `Difficulty ${difficulty}/10, Energy ${energy}/5`,
                    confidence: model.intensityProfile.confidence
                });
            }
            
            if (DEBUG && Math.abs(adjustment) > 0.01) {
                console.log(`🧬 Intensity learning: ${oldMultiplier.toFixed(2)} → ${model.intensityProfile.globalMultiplier.toFixed(2)}`);
            }
            
            return model;
        },

        /**
         * Aggiorna profilo volume da feedback
         */
        updateVolumeFromFeedback(model, feedback, workout) {
            const completionRate = feedback.completionRate || 100;
            const rpe = feedback.rpe || feedback.sessionRPE || 7;
            const difficulty = feedback.difficulty || feedback.perceivedDifficulty || 5;
            
            // Segnali per volume:
            // - completionRate < 90% → troppo volume
            // - difficulty > 7 AND rpe > 8 → probabilmente troppo volume
            // - difficulty < 4 AND completionRate = 100 → poco volume
            
            let volumeSignal = 0;
            
            if (completionRate < 90) {
                volumeSignal -= (100 - completionRate) / 50; // Ridurre
            }
            
            if (difficulty > 7 && rpe > 8) {
                volumeSignal -= 0.3; // Ridurre
            }
            
            if (difficulty < 4 && completionRate >= 100) {
                volumeSignal += 0.3; // Aumentare
            }
            
            if (volumeSignal === 0) return model; // Nessun cambiamento
            
            const learningRate = Math.max(0.05, 0.25 / Math.sqrt(model.sessionsAnalyzed + 1));
            const oldMultiplier = model.volumeProfile.globalMultiplier;
            const adjustment = volumeSignal * learningRate;
            
            model.volumeProfile.globalMultiplier = Math.max(0.7, Math.min(1.4,
                oldMultiplier + adjustment
            ));
            
            model.volumeProfile.confidence = Math.min(1,
                model.volumeProfile.confidence + 0.04
            );
            
            model.volumeProfile.lastUpdated = new Date().toISOString();
            
            if (Math.abs(adjustment) > 0.01) {
                model.learningLog.push({
                    timestamp: new Date().toISOString(),
                    type: 'volume_update',
                    change: {
                        from: oldMultiplier.toFixed(3),
                        to: model.volumeProfile.globalMultiplier.toFixed(3)
                    },
                    reason: `Completion ${completionRate}%, Difficulty ${difficulty}`,
                    confidence: model.volumeProfile.confidence
                });
                
                if (DEBUG) {
                    console.log(`🧬 Volume learning: ${oldMultiplier.toFixed(2)} → ${model.volumeProfile.globalMultiplier.toFixed(2)}`);
                }
            }
            
            return model;
        },

        /**
         * Aggiorna profilo recupero
         * Chiamato quando atleta torna dopo riposo
         */
        updateRecoveryFromPerformance(model, feedback, daysSinceLastWorkout, previousWorkout) {
            if (daysSinceLastWorkout < 1) return model;
            
            const difficulty = feedback.difficulty || 5;
            const energy = feedback.energy || 3;
            
            // Se dopo X giorni di riposo l'atleta si sente:
            // - Troppo fresco (difficulty < 4, energy > 3) → recupera veloce
            // - Ancora stanco (difficulty > 6, energy < 3) → recupera lento
            
            const freshnessScore = (5 - difficulty) + (energy - 3);
            // +3 a -3: positivo = molto fresco, negativo = ancora stanco
            
            // Cosa ci aspettavamo? Dopo 2-3 giorni dovrebbe essere ~0
            const expectedFreshness = Math.min(2, daysSinceLastWorkout - 1);
            const freshnessError = freshnessScore - expectedFreshness;
            
            if (Math.abs(freshnessError) < 0.5) return model; // Entro range normale
            
            const learningRate = 0.1;
            const oldRate = model.recoveryProfile.globalRecoveryMultiplier;
            
            // freshnessError positivo = recupera più veloce del previsto → abbassa multiplier
            // freshnessError negativo = recupera più lento → alza multiplier
            const adjustment = -freshnessError * learningRate * 0.1;
            
            model.recoveryProfile.globalRecoveryMultiplier = Math.max(0.7, Math.min(1.5,
                oldRate + adjustment
            ));
            
            model.recoveryProfile.confidence = Math.min(1,
                model.recoveryProfile.confidence + 0.03
            );
            
            model.recoveryProfile.lastUpdated = new Date().toISOString();
            
            model.learningLog.push({
                timestamp: new Date().toISOString(),
                type: 'recovery_update',
                change: {
                    from: oldRate.toFixed(3),
                    to: model.recoveryProfile.globalRecoveryMultiplier.toFixed(3)
                },
                reason: `${daysSinceLastWorkout} days rest, freshness ${freshnessScore.toFixed(1)}`,
                confidence: model.recoveryProfile.confidence
            });
            
            if (DEBUG) {
                console.log(`🧬 Recovery learning: ${oldRate.toFixed(2)} → ${model.recoveryProfile.globalRecoveryMultiplier.toFixed(2)}`);
            }
            
            return model;
        },

        /**
         * Aggiorna profilo esercizi
         */
        updateExercisesFromFeedback(model, feedback, workout) {
            const exerciseFeedback = feedback.exercises || feedback.exerciseFeedback || [];
            
            exerciseFeedback.forEach(exFeedback => {
                const name = (exFeedback.name || '').toLowerCase();
                if (!name) return;
                
                // Cerca esercizio esistente nei favorites
                let favorite = model.exerciseProfile.favorites.find(f => 
                    f.name.toLowerCase() === name
                );
                
                // Calcola score per questa sessione
                let sessionScore = 5; // Neutro
                
                if (exFeedback.liked || exFeedback.feltGood) sessionScore += 2;
                if (exFeedback.tooHard) sessionScore -= 1;
                if (exFeedback.tooEasy) sessionScore -= 0.5;
                if (exFeedback.pain) sessionScore -= 3;
                if (exFeedback.skipped) sessionScore -= 2;
                
                if (!favorite && sessionScore > 5) {
                    // Nuovo favorite
                    model.exerciseProfile.favorites.push({
                        name: exFeedback.name,
                        score: sessionScore,
                        timesUsed: 1
                    });
                } else if (favorite) {
                    // Aggiorna esistente (moving average)
                    const weight = 0.3;
                    favorite.score = favorite.score * (1 - weight) + sessionScore * weight;
                    favorite.timesUsed++;
                    
                    // Se score scende troppo, rimuovi da favorites
                    if (favorite.score < 4) {
                        model.exerciseProfile.favorites = model.exerciseProfile.favorites.filter(f =>
                            f.name.toLowerCase() !== name
                        );
                    }
                }
                
                // Traccia problematici
                if (sessionScore < 4) {
                    let problematic = model.exerciseProfile.problematic.find(p =>
                        p.name.toLowerCase() === name
                    );
                    
                    if (!problematic) {
                        problematic = { name: exFeedback.name, issues: [], score: 0, occurrences: 0 };
                        model.exerciseProfile.problematic.push(problematic);
                    }
                    
                    if (exFeedback.pain) problematic.issues.push('pain');
                    if (exFeedback.tooHard) problematic.issues.push('too_hard');
                    if (exFeedback.skipped) problematic.issues.push('skipped');
                    
                    problematic.score = Math.min(problematic.score, sessionScore);
                    problematic.occurrences++;
                    
                    // Auto-ban se 3+ problemi
                    if (problematic.occurrences >= 3 && !model.exerciseProfile.banned.includes(exFeedback.name)) {
                        model.exerciseProfile.banned.push(exFeedback.name);
                        
                        model.learningLog.push({
                            timestamp: new Date().toISOString(),
                            type: 'exercise_banned',
                            change: { exercise: exFeedback.name },
                            reason: `${problematic.occurrences} problemi: ${[...new Set(problematic.issues)].join(', ')}`,
                            confidence: 0.9
                        });
                        
                        if (DEBUG) {
                            console.log(`🧬 Exercise BANNED: ${exFeedback.name}`);
                        }
                    }
                }
            });
            
            return model;
        },

        /**
         * Aggiorna profilo dolore
         */
        updatePainProfile(model, feedback) {
            const painPoints = feedback.painPoints || [];
            
            painPoints.forEach(pain => {
                if (pain.intensity < 2) return; // Ignora fastidi leggeri
                
                const area = pain.area;
                
                // Cerca area esistente
                let chronic = model.painHistory.chronicAreas.find(c => c.area === area);
                
                if (!chronic) {
                    chronic = {
                        area,
                        firstReported: new Date().toISOString(),
                        occurrences: 0,
                        lastReported: null,
                        severity: []
                    };
                    model.painHistory.chronicAreas.push(chronic);
                }
                
                chronic.occurrences++;
                chronic.lastReported = new Date().toISOString();
                chronic.severity.push(pain.intensity);
                
                // Mantieni solo ultimi 10 severity
                if (chronic.severity.length > 10) {
                    chronic.severity = chronic.severity.slice(-10);
                }
                
                // Log se diventa cronico (3+ occorrenze)
                if (chronic.occurrences === 3) {
                    model.learningLog.push({
                        timestamp: new Date().toISOString(),
                        type: 'chronic_pain_detected',
                        change: { area, occurrences: 3 },
                        reason: `Dolore ${area} riportato 3 volte`,
                        confidence: 0.8
                    });
                    
                    if (DEBUG) {
                        console.log(`🧬 CHRONIC PAIN detected: ${area}`);
                    }
                }
            });
            
            return model;
        },

        /**
         * Aggiorna calibrazione RPE
         */
        updateRPECalibration(model, feedback, targetRPE) {
            const reportedRPE = feedback.rpe || feedback.sessionRPE;
            
            if (!reportedRPE || !targetRPE) return model;
            
            // Differenza tra target e percepito
            const error = reportedRPE - targetRPE;
            
            // Aggiorna bias con moving average
            const weight = 0.2;
            model.rpeCalibration.bias = model.rpeCalibration.bias * (1 - weight) + error * weight;
            
            model.rpeCalibration.confidence = Math.min(1,
                model.rpeCalibration.confidence + 0.02
            );
            
            // Aggiusta target in base a bias
            if (Math.abs(model.rpeCalibration.bias) > 0.5) {
                const adjustment = Math.round(model.rpeCalibration.bias);
                model.rpeCalibration.adjustedTargets.forza = 8 - adjustment;
                model.rpeCalibration.adjustedTargets.ipertrofia = 7 - adjustment;
                model.rpeCalibration.adjustedTargets.potenza = 7 - adjustment;
                
                // Clamp
                Object.keys(model.rpeCalibration.adjustedTargets).forEach(key => {
                    model.rpeCalibration.adjustedTargets[key] = Math.max(5, Math.min(10,
                        model.rpeCalibration.adjustedTargets[key]
                    ));
                });
            }
            
            return model;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 API PUBBLICA
    // ═══════════════════════════════════════════════════════════════════════════

    return {
        version: VERSION,

        /**
         * Ottieni modello atleta (o creane uno nuovo)
         */
        getModel(athleteId) {
            const key = STORAGE_KEY + athleteId;
            const stored = localStorage.getItem(key);
            
            if (stored) {
                try {
                    const model = JSON.parse(stored);
                    // Migration check
                    if (model.version !== VERSION) {
                        console.log('🧬 Migrating athlete model to v' + VERSION);
                        // TODO: migration logic
                    }
                    return model;
                } catch (e) {
                    console.error('Error loading athlete model:', e);
                }
            }
            
            return createEmptyModel(athleteId);
        },

        /**
         * Salva modello atleta
         */
        saveModel(model) {
            model.updatedAt = new Date().toISOString();
            const key = STORAGE_KEY + model.athleteId;
            
            // Limita learning log
            if (model.learningLog.length > 100) {
                model.learningLog = model.learningLog.slice(-100);
            }
            
            localStorage.setItem(key, JSON.stringify(model));
            
            if (DEBUG) {
                console.log(`🧬 Model saved for athlete ${model.athleteId}`);
            }
        },

        /**
         * LEARN - Impara da una sessione completata
         * 
         * @param {string} athleteId - ID atleta
         * @param {Object} feedback - Feedback post-sessione
         * @param {Object} workout - Workout eseguito
         * @param {Object} context - Contesto (giorni riposo, target RPE, etc.)
         */
        learn(athleteId, feedback, workout, context = {}) {
            console.log('🧬 Learning from session...');
            
            let model = this.getModel(athleteId);
            const startSessions = model.sessionsAnalyzed;
            
            // Applica tutti gli algoritmi di apprendimento
            model = LearningAlgorithms.updateIntensityFromFeedback(model, feedback, workout);
            model = LearningAlgorithms.updateVolumeFromFeedback(model, feedback, workout);
            model = LearningAlgorithms.updateExercisesFromFeedback(model, feedback, workout);
            model = LearningAlgorithms.updatePainProfile(model, feedback);
            
            if (context.targetRPE) {
                model = LearningAlgorithms.updateRPECalibration(model, feedback, context.targetRPE);
            }
            
            if (context.daysSinceLastWorkout) {
                model = LearningAlgorithms.updateRecoveryFromPerformance(
                    model, feedback, context.daysSinceLastWorkout, context.previousWorkout
                );
            }
            
            // Incrementa sessioni analizzate
            model.sessionsAnalyzed++;
            
            // Salva
            this.saveModel(model);
            
            console.log(`🧬 Learning complete. Sessions: ${model.sessionsAnalyzed}`);
            console.log(`   Intensity mult: ${model.intensityProfile.globalMultiplier.toFixed(2)}`);
            console.log(`   Volume mult: ${model.volumeProfile.globalMultiplier.toFixed(2)}`);
            console.log(`   Recovery mult: ${model.recoveryProfile.globalRecoveryMultiplier.toFixed(2)}`);
            
            return {
                success: true,
                sessionsAnalyzed: model.sessionsAnalyzed,
                changes: model.learningLog.slice(-(model.sessionsAnalyzed - startSessions + 3))
            };
        },

        /**
         * APPLY - Applica apprendimenti a un workout
         * 
         * @param {string} athleteId - ID atleta
         * @param {Object} workout - Workout da modificare
         * @returns {Object} Workout modificato + spiegazione
         */
        apply(athleteId, workout) {
            const model = this.getModel(athleteId);
            
            if (model.sessionsAnalyzed < 3) {
                return {
                    workout,
                    applied: false,
                    reason: 'Dati insufficienti (< 3 sessioni)'
                };
            }
            
            const adjustments = [];
            let adjustedWorkout = JSON.parse(JSON.stringify(workout));
            
            // 1. Applica moltiplicatori intensità/volume
            if (model.intensityProfile.confidence > 0.3) {
                const intMult = model.intensityProfile.globalMultiplier;
                if (Math.abs(intMult - 1.0) > 0.05) {
                    adjustments.push({
                        type: 'intensity',
                        multiplier: intMult,
                        reason: intMult > 1 ? 'Atleta preferisce più intensità' : 'Atleta preferisce meno intensità'
                    });
                }
            }
            
            if (model.volumeProfile.confidence > 0.3) {
                const volMult = model.volumeProfile.globalMultiplier;
                if (Math.abs(volMult - 1.0) > 0.05) {
                    adjustedWorkout = this.applyVolumeMultiplier(adjustedWorkout, volMult);
                    adjustments.push({
                        type: 'volume',
                        multiplier: volMult,
                        reason: volMult > 1 ? 'Atleta gestisce più volume' : 'Atleta preferisce meno volume'
                    });
                }
            }
            
            // 2. Rimuovi/sostituisci esercizi bannati
            const banned = model.exerciseProfile.banned;
            if (banned.length > 0) {
                adjustedWorkout = this.removeBannedExercises(adjustedWorkout, banned);
                adjustments.push({
                    type: 'banned_exercises',
                    removed: banned,
                    reason: 'Esercizi con storico problematico'
                });
            }
            
            // 3. Aggiungi note per aree dolore cronico
            if (model.painHistory.chronicAreas.length > 0) {
                const chronicAreas = model.painHistory.chronicAreas.map(c => c.area);
                adjustedWorkout.warnings = adjustedWorkout.warnings || [];
                adjustedWorkout.warnings.push({
                    type: 'chronic_pain',
                    areas: chronicAreas,
                    message: `Attenzione aree sensibili: ${chronicAreas.join(', ')}`
                });
                adjustments.push({
                    type: 'pain_warning',
                    areas: chronicAreas
                });
            }
            
            // 4. Aggiungi metadati
            adjustedWorkout.learningApplied = {
                athleteId,
                sessionsAnalyzed: model.sessionsAnalyzed,
                adjustments,
                timestamp: new Date().toISOString()
            };
            
            if (DEBUG && adjustments.length > 0) {
                console.log(`🧬 Applied ${adjustments.length} learning adjustments`);
            }
            
            return {
                workout: adjustedWorkout,
                applied: adjustments.length > 0,
                adjustments,
                model: {
                    sessions: model.sessionsAnalyzed,
                    intensityMult: model.intensityProfile.globalMultiplier,
                    volumeMult: model.volumeProfile.globalMultiplier,
                    recoveryMult: model.recoveryProfile.globalRecoveryMultiplier,
                    bannedExercises: banned.length,
                    chronicPainAreas: model.painHistory.chronicAreas.length
                }
            };
        },

        /**
         * Applica moltiplicatore volume
         */
        applyVolumeMultiplier(workout, multiplier) {
            const processExercise = (ex) => {
                if (!ex.sets) return ex;
                const newSets = Math.round(ex.sets * multiplier);
                return {
                    ...ex,
                    sets: Math.max(1, Math.min(6, newSets)),
                    learningAdjusted: ex.sets !== newSets
                };
            };
            
            const exercises = workout.exercises;
            if (Array.isArray(exercises)) {
                workout.exercises = exercises.map(processExercise);
            } else if (exercises) {
                ['warmup', 'main', 'accessory', 'cooldown'].forEach(section => {
                    if (exercises[section]) {
                        workout.exercises[section] = exercises[section].map(processExercise);
                    }
                });
            }
            
            return workout;
        },

        /**
         * Rimuovi esercizi bannati
         */
        removeBannedExercises(workout, banned) {
            const bannedLower = banned.map(b => b.toLowerCase());
            
            const filterExercise = (ex) => {
                const name = (ex.name || ex.exercise || '').toLowerCase();
                return !bannedLower.some(b => name.includes(b));
            };
            
            const exercises = workout.exercises;
            if (Array.isArray(exercises)) {
                workout.exercises = exercises.filter(filterExercise);
            } else if (exercises) {
                ['warmup', 'main', 'accessory', 'cooldown'].forEach(section => {
                    if (exercises[section]) {
                        workout.exercises[section] = exercises[section].filter(filterExercise);
                    }
                });
            }
            
            return workout;
        },

        /**
         * Ottieni raccomandazioni per questo atleta
         */
        getRecommendations(athleteId) {
            const model = this.getModel(athleteId);
            const recommendations = [];
            
            if (model.sessionsAnalyzed < 3) {
                return [{
                    type: 'info',
                    message: 'Completa almeno 3 sessioni per ricevere raccomandazioni personalizzate'
                }];
            }
            
            // Intensità
            if (model.intensityProfile.globalMultiplier > 1.1) {
                recommendations.push({
                    type: 'intensity',
                    message: 'Questo atleta risponde bene a intensità più alte. Considera carichi maggiori.',
                    confidence: model.intensityProfile.confidence
                });
            } else if (model.intensityProfile.globalMultiplier < 0.9) {
                recommendations.push({
                    type: 'intensity',
                    message: 'Questo atleta preferisce intensità moderate. Evita massimali frequenti.',
                    confidence: model.intensityProfile.confidence
                });
            }
            
            // Volume
            if (model.volumeProfile.globalMultiplier > 1.15) {
                recommendations.push({
                    type: 'volume',
                    message: 'Atleta tollera bene volumi alti. Può gestire più serie per gruppo.',
                    confidence: model.volumeProfile.confidence
                });
            } else if (model.volumeProfile.globalMultiplier < 0.85) {
                recommendations.push({
                    type: 'volume',
                    message: 'Atleta risponde meglio a volumi ridotti. Qualità > quantità.',
                    confidence: model.volumeProfile.confidence
                });
            }
            
            // Recupero
            if (model.recoveryProfile.globalRecoveryMultiplier > 1.2) {
                recommendations.push({
                    type: 'recovery',
                    message: 'Recupero più lento della media. Considera più giorni tra sessioni intense.',
                    confidence: model.recoveryProfile.confidence
                });
            }
            
            // Dolori cronici
            model.painHistory.chronicAreas.forEach(area => {
                recommendations.push({
                    type: 'pain_prevention',
                    message: `Attenzione: ${area.area} è area sensibile (${area.occurrences} segnalazioni)`,
                    confidence: 0.9
                });
            });
            
            // Esercizi preferiti
            const topFavorites = model.exerciseProfile.favorites
                .sort((a, b) => b.score - a.score)
                .slice(0, 3);
            
            if (topFavorites.length > 0) {
                recommendations.push({
                    type: 'favorites',
                    message: `Esercizi preferiti: ${topFavorites.map(f => f.name).join(', ')}`,
                    confidence: 0.8
                });
            }
            
            return recommendations;
        },

        /**
         * Ottieni parametri di recupero personalizzati
         */
        getPersonalizedRecovery(athleteId, muscleGroup = null) {
            const model = this.getModel(athleteId);
            
            const baseRecovery = {
                quadriceps: 72,
                hamstrings: 72,
                glutes: 72,
                chest: 48,
                back: 72,
                shoulders: 48,
                biceps: 48,
                triceps: 48,
                core: 24
            };
            
            const globalMult = model.recoveryProfile.globalRecoveryMultiplier;
            
            const personalized = {};
            for (const [muscle, hours] of Object.entries(baseRecovery)) {
                const specificMult = model.recoveryProfile.byMuscleGroup[muscle] || 1.0;
                personalized[muscle] = Math.round(hours * globalMult * specificMult);
            }
            
            if (muscleGroup) {
                return personalized[muscleGroup] || 48;
            }
            
            return personalized;
        },

        /**
         * Reset modello atleta
         */
        reset(athleteId) {
            const key = STORAGE_KEY + athleteId;
            localStorage.removeItem(key);
            console.log(`🧬 Model reset for athlete ${athleteId}`);
        },

        /**
         * Esporta modello per debug
         */
        export(athleteId) {
            return this.getModel(athleteId);
        },

        /**
         * Stats globali
         */
        getStats(athleteId) {
            const model = this.getModel(athleteId);
            return {
                athleteId,
                sessionsAnalyzed: model.sessionsAnalyzed,
                intensityMultiplier: model.intensityProfile.globalMultiplier.toFixed(2),
                volumeMultiplier: model.volumeProfile.globalMultiplier.toFixed(2),
                recoveryMultiplier: model.recoveryProfile.globalRecoveryMultiplier.toFixed(2),
                bannedExercises: model.exerciseProfile.banned.length,
                favoriteExercises: model.exerciseProfile.favorites.length,
                chronicPainAreas: model.painHistory.chronicAreas.length,
                rpeBias: model.rpeCalibration.bias.toFixed(1),
                lastUpdated: model.updatedAt,
                recentChanges: model.learningLog.slice(-5)
            };
        }
    };

})();

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🧬 ATLAS Athlete Learning v1.0 loaded!');
console.log('   → ATLASAthleteLearning.learn(athleteId, feedback, workout) - Learn from session');
console.log('   → ATLASAthleteLearning.apply(athleteId, workout) - Apply learnings to workout');
console.log('   → ATLASAthleteLearning.getRecommendations(athleteId) - Get recommendations');
console.log('   → ATLASAthleteLearning.getStats(athleteId) - Get learning stats');
