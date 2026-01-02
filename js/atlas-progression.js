/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 ATLAS PROGRESSION ENGINE v1.0
 * Sistema di Progressive Overload e Tracking Automatico
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Questo modulo gestisce:
 * - Storico sessioni e performance
 * - Progressive overload automatico
 * - RPE tracking e auto-regolazione
 * - Prediction plateau e deload
 * - Analisi trend e adattamenti
 */

const ATLASProgression = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 STORAGE - Gestione dati persistenti
    // ═══════════════════════════════════════════════════════════════════════════
    
    storage: {
        PREFIX: 'atlas_progression_',
        
        save(key, data) {
            try {
                localStorage.setItem(this.PREFIX + key, JSON.stringify(data));
                return true;
            } catch (e) {
                console.error('Storage save error:', e);
                return false;
            }
        },
        
        load(key) {
            try {
                const data = localStorage.getItem(this.PREFIX + key);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                console.error('Storage load error:', e);
                return null;
            }
        },
        
        delete(key) {
            localStorage.removeItem(this.PREFIX + key);
        },
        
        clear() {
            Object.keys(localStorage)
                .filter(k => k.startsWith(this.PREFIX))
                .forEach(k => localStorage.removeItem(k));
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📝 SESSION HISTORY - Storico Allenamenti
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Registra una sessione completata
     */
    logSession(session) {
        const history = this.getSessionHistory();
        
        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            
            // Metadata
            sport: session.sport,
            goal: session.goal,
            week: session.week,
            phase: session.phase,
            
            // Workout data
            exercises: session.exercises.map(ex => ({
                name: ex.name,
                sets: ex.completedSets || ex.sets,
                reps: ex.completedReps || ex.reps,
                weight: ex.weight || null,
                rpe: ex.rpe || null,
                notes: ex.notes || null
            })),
            
            // Session metrics
            duration: session.duration || null,
            totalVolume: this.calculateVolume(session.exercises),
            averageRPE: this.calculateAverageRPE(session.exercises),
            
            // Subjective feedback
            feeling: session.feeling || null,        // 1-5
            energy: session.energy || null,          // 1-5
            soreness: session.soreness || null,      // 1-5
            sleep: session.sleepQuality || null,     // 1-5
            
            // Validation score
            validationScore: session.validationScore || null
        };
        
        history.push(entry);
        
        // Mantieni solo ultimi 365 giorni
        const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
        const filteredHistory = history.filter(h => new Date(h.date).getTime() > oneYearAgo);
        
        this.storage.save('session_history', filteredHistory);
        
        // Aggiorna PRs se necessario
        this.updatePRs(entry);
        
        console.log(`📝 Sessione registrata: ${entry.exercises.length} esercizi, Volume: ${entry.totalVolume}`);
        
        return entry;
    },
    
    /**
     * Ottiene storico sessioni
     */
    getSessionHistory(filters = {}) {
        let history = this.storage.load('session_history') || [];
        
        if (filters.sport) {
            history = history.filter(h => h.sport === filters.sport);
        }
        if (filters.goal) {
            history = history.filter(h => h.goal === filters.goal);
        }
        if (filters.days) {
            const cutoff = Date.now() - (filters.days * 24 * 60 * 60 * 1000);
            history = history.filter(h => new Date(h.date).getTime() > cutoff);
        }
        if (filters.exercise) {
            history = history.filter(h => 
                h.exercises.some(e => e.name.toLowerCase().includes(filters.exercise.toLowerCase()))
            );
        }
        
        return history;
    },
    
    /**
     * Calcola volume totale
     */
    calculateVolume(exercises) {
        return exercises.reduce((total, ex) => {
            const sets = parseInt(ex.completedSets || ex.sets) || 0;
            const reps = parseInt(String(ex.completedReps || ex.reps).split('-')[0]) || 0;
            const weight = parseFloat(ex.weight) || 1;
            return total + (sets * reps * weight);
        }, 0);
    },
    
    /**
     * Calcola RPE medio
     */
    calculateAverageRPE(exercises) {
        const rpes = exercises.filter(e => e.rpe).map(e => parseFloat(e.rpe));
        if (rpes.length === 0) return null;
        return Math.round((rpes.reduce((a, b) => a + b, 0) / rpes.length) * 10) / 10;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏆 PERSONAL RECORDS - Tracking PRs
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Aggiorna PRs se battuti
     */
    updatePRs(session) {
        const prs = this.storage.load('personal_records') || {};
        const newPRs = [];
        
        for (const exercise of session.exercises) {
            if (!exercise.weight || !exercise.reps) continue;
            
            const key = exercise.name.toLowerCase().replace(/\s+/g, '_');
            const weight = parseFloat(exercise.weight);
            const reps = parseInt(String(exercise.reps).split('-')[0]);
            
            if (!prs[key]) {
                prs[key] = { history: [] };
            }
            
            // Calcola 1RM stimato (Brzycki formula)
            const estimated1RM = weight * (36 / (37 - reps));
            
            // Check per vari rep ranges
            const repRanges = [1, 3, 5, 8, 10, 12];
            for (const targetReps of repRanges) {
                if (reps === targetReps) {
                    const prKey = `${targetReps}rm`;
                    if (!prs[key][prKey] || weight > prs[key][prKey].weight) {
                        const oldPR = prs[key][prKey]?.weight || 0;
                        prs[key][prKey] = {
                            weight,
                            date: session.date,
                            rpe: exercise.rpe
                        };
                        if (oldPR > 0) {
                            newPRs.push({
                                exercise: exercise.name,
                                type: `${targetReps}RM`,
                                old: oldPR,
                                new: weight,
                                improvement: ((weight - oldPR) / oldPR * 100).toFixed(1) + '%'
                            });
                        }
                    }
                }
            }
            
            // Estimated 1RM
            if (!prs[key].estimated1RM || estimated1RM > prs[key].estimated1RM.value) {
                prs[key].estimated1RM = {
                    value: Math.round(estimated1RM * 10) / 10,
                    basedOn: { weight, reps },
                    date: session.date
                };
            }
            
            // History per tracking trend
            prs[key].history.push({
                date: session.date,
                weight,
                reps,
                estimated1RM: Math.round(estimated1RM * 10) / 10
            });
            
            // Mantieni solo ultimi 50 entries per esercizio
            if (prs[key].history.length > 50) {
                prs[key].history = prs[key].history.slice(-50);
            }
        }
        
        this.storage.save('personal_records', prs);
        
        if (newPRs.length > 0) {
            console.log('🏆 NUOVI PERSONAL RECORDS:');
            newPRs.forEach(pr => {
                console.log(`   ${pr.exercise}: ${pr.type} ${pr.old}kg → ${pr.new}kg (+${pr.improvement})`);
            });
        }
        
        return newPRs;
    },
    
    /**
     * Ottieni PRs per un esercizio
     */
    getPRs(exerciseName) {
        const prs = this.storage.load('personal_records') || {};
        const key = exerciseName.toLowerCase().replace(/\s+/g, '_');
        return prs[key] || null;
    },
    
    /**
     * Ottieni tutti i PRs
     */
    getAllPRs() {
        return this.storage.load('personal_records') || {};
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📈 PROGRESSIVE OVERLOAD - Calcolo Progressione
    // ═══════════════════════════════════════════════════════════════════════════
    
    progressionRules: {
        // Regole per goal
        forza: {
            primaryMethod: 'weight',
            weightIncrement: { min: 2.5, max: 5, unit: 'kg' },
            repProgression: false,
            targetRPE: [7, 9],
            deloadTrigger: { failedSets: 2, highRPE: 9.5 }
        },
        ipertrofia: {
            primaryMethod: 'reps_then_weight',
            weightIncrement: { min: 2.5, max: 5, unit: 'kg' },
            repProgression: { min: 8, max: 12, resetTo: 8 },
            targetRPE: [7, 8.5],
            deloadTrigger: { failedSets: 2, highRPE: 9 }
        },
        potenza: {
            primaryMethod: 'quality',
            weightIncrement: { min: 2.5, max: 5, unit: 'kg' },
            repProgression: false,
            targetRPE: [6, 8],
            deloadTrigger: { velocityDrop: 20, highRPE: 8.5 }
        }
    },
    
    /**
     * Calcola progressione per un esercizio
     * @param {string} exerciseName - Nome esercizio
     * @param {number} currentWeight - Peso attuale
     * @param {number} currentReps - Reps attuali
     * @param {number} currentRPE - RPE attuale
     * @param {string} goal - Obiettivo (forza, ipertrofia, etc.)
     * @param {string} level - Livello atleta (beginner, intermediate, advanced)
     */
    calculateProgression(exerciseName, currentWeight, currentReps, currentRPE, goal, level = 'intermediate') {
        const rules = this.progressionRules[goal] || this.progressionRules.ipertrofia;
        const history = this.getExerciseHistory(exerciseName, 4); // Ultime 4 sessioni
        
        // Multiplier basato su livello - principianti progrediscono più velocemente
        // ma con incrementi più piccoli per sicurezza
        const levelMultipliers = {
            beginner: { progressRate: 1.5, incrementSize: 0.7, deloadThreshold: 0.9 },
            intermediate: { progressRate: 1.0, incrementSize: 1.0, deloadThreshold: 1.0 },
            advanced: { progressRate: 0.6, incrementSize: 1.2, deloadThreshold: 1.1 }
        };
        const levelMod = levelMultipliers[level] || levelMultipliers.intermediate;
        
        const result = {
            exercise: exerciseName,
            currentWeight,
            currentReps,
            currentRPE,
            level,
            recommendation: null,
            newWeight: currentWeight,
            newReps: currentReps,
            confidence: 'medium',
            reasoning: []
        };
        
        // Se non abbiamo storia, mantieni corrente
        if (history.length === 0) {
            result.recommendation = 'maintain';
            result.reasoning.push('Prima sessione - mantieni peso corrente');
            if (level === 'beginner') {
                result.reasoning.push('Principiante: focus su tecnica prima di progredire');
            }
            return result;
        }
        
        // Analizza trend RPE
        const avgRPE = history.reduce((sum, h) => sum + (h.rpe || 7), 0) / history.length;
        const lastRPE = history[history.length - 1]?.rpe || currentRPE;
        
        // Check se deload necessario
        if (lastRPE >= rules.deloadTrigger.highRPE || this.checkFailedSets(history)) {
            result.recommendation = 'deload';
            result.newWeight = Math.round(currentWeight * 0.85);
            result.reasoning.push(`RPE troppo alto (${lastRPE}) - deload 15%`);
            result.confidence = 'high';
            return result;
        }
        
        // Calcola incremento peso basato su livello
        const baseIncrement = rules.weightIncrement.min;
        const adjustedIncrement = Math.round(baseIncrement * levelMod.incrementSize * 10) / 10;
        
        // Progressione basata su goal
        if (rules.primaryMethod === 'weight') {
            // Forza: aumenta peso se RPE in range
            if (lastRPE <= rules.targetRPE[1] - 0.5) {
                result.recommendation = 'increase_weight';
                result.newWeight = currentWeight + adjustedIncrement;
                result.reasoning.push(`RPE ${lastRPE} < target ${rules.targetRPE[1]} - aumenta peso +${adjustedIncrement}kg`);
                if (level !== 'intermediate') {
                    result.reasoning.push(`Livello ${level}: incremento ${levelMod.incrementSize < 1 ? 'ridotto' : 'aumentato'}`);
                }
                result.confidence = 'high';
            } else {
                result.recommendation = 'maintain';
                result.reasoning.push(`RPE ${lastRPE} in range - mantieni`);
            }
        } else if (rules.primaryMethod === 'reps_then_weight') {
            // Ipertrofia: prima aumenta reps, poi peso
            const maxReps = rules.repProgression.max;
            const minReps = rules.repProgression.min;
            
            if (currentReps >= maxReps && lastRPE <= rules.targetRPE[1]) {
                // Hai raggiunto max reps con RPE ok → aumenta peso, resetta reps
                result.recommendation = 'increase_weight';
                result.newWeight = currentWeight + adjustedIncrement;
                result.newReps = rules.repProgression.resetTo;
                result.reasoning.push(`${currentReps} reps raggiunto → +${adjustedIncrement}kg, reset a ${result.newReps} reps`);
                if (level === 'beginner') {
                    result.reasoning.push('Principiante: incremento conservativo per sicurezza');
                }
                result.confidence = 'high';
            } else if (lastRPE <= rules.targetRPE[0]) {
                // RPE basso → aumenta reps
                result.recommendation = 'increase_reps';
                result.newReps = Math.min(currentReps + 1, maxReps);
                result.reasoning.push(`RPE ${lastRPE} basso → +1 rep`);
                result.confidence = 'medium';
            } else {
                result.recommendation = 'maintain';
                result.reasoning.push('Progressione adeguata - mantieni');
            }
        } else if (rules.primaryMethod === 'quality') {
            // Potenza: focus su qualità movimento
            if (avgRPE < rules.targetRPE[0]) {
                result.recommendation = 'increase_weight';
                result.newWeight = currentWeight + adjustedIncrement;
                result.reasoning.push('RPE basso - puoi aumentare mantenendo esplosività');
            } else {
                result.recommendation = 'maintain';
                result.reasoning.push('Focus su velocità esecuzione');
            }
        }
        
        return result;
    },
    
    /**
     * Ottieni storia di un esercizio specifico
     */
    getExerciseHistory(exerciseName, lastN = 10) {
        const history = this.getSessionHistory();
        const exerciseData = [];
        
        for (const session of history.slice(-50)) { // Ultime 50 sessioni
            const exercise = session.exercises.find(e => 
                e.name.toLowerCase() === exerciseName.toLowerCase()
            );
            if (exercise) {
                exerciseData.push({
                    date: session.date,
                    weight: exercise.weight,
                    reps: exercise.reps,
                    sets: exercise.sets,
                    rpe: exercise.rpe
                });
            }
        }
        
        return exerciseData.slice(-lastN);
    },
    
    /**
     * Check set falliti
     */
    checkFailedSets(history) {
        const recentFails = history.filter(h => h.failed || h.rpe >= 10).length;
        return recentFails >= 2;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 AUTO-REGULATION - Adattamento Giornaliero
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Calcola modificatore giornaliero basato su readiness
     */
    calculateDailyModifier(readinessData) {
        const weights = {
            sleep: 0.30,
            stress: 0.20,
            soreness: 0.20,
            energy: 0.15,
            motivation: 0.15
        };
        
        // Normalizza tutti i valori a 0-1 (assumendo input 1-5)
        const normalized = {};
        for (const [key, value] of Object.entries(readinessData)) {
            if (weights[key]) {
                normalized[key] = (value - 1) / 4; // 1-5 → 0-1
            }
        }
        
        // Calcola score pesato
        let score = 0;
        let totalWeight = 0;
        
        for (const [key, weight] of Object.entries(weights)) {
            if (normalized[key] !== undefined) {
                score += normalized[key] * weight;
                totalWeight += weight;
            }
        }
        
        // Normalizza se non tutti i dati sono presenti
        if (totalWeight > 0) {
            score = score / totalWeight;
        } else {
            score = 0.7; // Default neutro
        }
        
        // Converti in modificatore (0.7 - 1.1)
        const modifier = 0.7 + (score * 0.4);
        
        return {
            score: Math.round(score * 100),
            modifier: Math.round(modifier * 100) / 100,
            recommendation: this.getReadinessRecommendation(score),
            adjustments: this.getAdjustments(modifier)
        };
    },
    
    /**
     * Raccomandazione basata su readiness
     */
    getReadinessRecommendation(score) {
        if (score >= 0.85) {
            return {
                level: 'optimal',
                message: '🟢 Ottima condizione - vai al 100%',
                volumeMod: 1.0,
                intensityMod: 1.0
            };
        } else if (score >= 0.7) {
            return {
                level: 'good',
                message: '🟡 Buona condizione - allenamento normale',
                volumeMod: 1.0,
                intensityMod: 0.95
            };
        } else if (score >= 0.5) {
            return {
                level: 'moderate',
                message: '🟠 Condizione moderata - riduci intensità',
                volumeMod: 0.85,
                intensityMod: 0.90
            };
        } else {
            return {
                level: 'low',
                message: '🔴 Recupero insufficiente - considera rest day o light session',
                volumeMod: 0.6,
                intensityMod: 0.75
            };
        }
    },
    
    /**
     * Calcola aggiustamenti specifici
     */
    getAdjustments(modifier) {
        return {
            sets: modifier < 0.85 ? Math.round((1 - modifier) * -2) : 0, // -1 or -2 sets
            reps: 0,
            weight: `${Math.round((modifier - 1) * 100)}%`,
            rest: modifier < 0.85 ? '+30s' : '0'
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 TREND ANALYSIS - Analisi Progressi
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Analizza trend generale
     */
    analyzeTrends(days = 30) {
        const history = this.getSessionHistory({ days });
        
        if (history.length < 3) {
            return { 
                status: 'insufficient_data',
                message: 'Serve almeno 3 sessioni per analisi trend'
            };
        }
        
        // Dividi in due metà per confronto
        const mid = Math.floor(history.length / 2);
        const firstHalf = history.slice(0, mid);
        const secondHalf = history.slice(mid);
        
        // Calcola metriche per entrambe le metà
        const avgVolume1 = firstHalf.reduce((s, h) => s + h.totalVolume, 0) / firstHalf.length;
        const avgVolume2 = secondHalf.reduce((s, h) => s + h.totalVolume, 0) / secondHalf.length;
        
        const avgRPE1 = firstHalf.filter(h => h.averageRPE).reduce((s, h) => s + h.averageRPE, 0) / firstHalf.length || 0;
        const avgRPE2 = secondHalf.filter(h => h.averageRPE).reduce((s, h) => s + h.averageRPE, 0) / secondHalf.length || 0;
        
        // Calcola trend
        const volumeTrend = ((avgVolume2 - avgVolume1) / avgVolume1 * 100) || 0;
        const rpeTrend = avgRPE2 - avgRPE1;
        
        // Determina status
        let status, recommendations = [];
        
        if (volumeTrend > 5 && rpeTrend < 0.5) {
            status = 'progressing';
            recommendations.push('✅ Ottima progressione! Continua così');
        } else if (volumeTrend > 5 && rpeTrend > 1) {
            status = 'overreaching';
            recommendations.push('⚠️ Volume aumenta ma fatica alta - considera deload');
        } else if (volumeTrend < -5) {
            status = 'regressing';
            recommendations.push('🔴 Volume in calo - verifica recupero e nutrizione');
        } else if (Math.abs(volumeTrend) < 3 && history.length > 8) {
            status = 'plateau';
            recommendations.push('🟡 Possibile plateau - considera variazione stimolo');
        } else {
            status = 'maintaining';
            recommendations.push('Mantenimento - progressione stabile');
        }
        
        return {
            status,
            period: `${days} giorni`,
            sessions: history.length,
            metrics: {
                volumeTrend: `${volumeTrend > 0 ? '+' : ''}${volumeTrend.toFixed(1)}%`,
                rpeTrend: `${rpeTrend > 0 ? '+' : ''}${rpeTrend.toFixed(1)}`,
                avgVolume: Math.round(avgVolume2),
                avgRPE: avgRPE2.toFixed(1)
            },
            recommendations
        };
    },
    
    /**
     * Predice plateau
     */
    predictPlateau(exerciseName) {
        const history = this.getExerciseHistory(exerciseName, 12);
        
        if (history.length < 6) {
            return { prediction: 'insufficient_data' };
        }
        
        // Calcola trend estimated 1RM
        const e1rms = history.map(h => {
            const w = parseFloat(h.weight) || 0;
            const r = parseInt(String(h.reps).split('-')[0]) || 0;
            return w * (36 / (37 - r));
        }).filter(v => v > 0);
        
        if (e1rms.length < 4) {
            return { prediction: 'insufficient_data' };
        }
        
        // Linear regression semplice
        const n = e1rms.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = e1rms.reduce((a, b) => a + b, 0);
        const sumXY = e1rms.reduce((sum, y, x) => sum + x * y, 0);
        const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        
        // Analizza slope
        const avgE1RM = sumY / n;
        const slopePercent = (slope / avgE1RM) * 100;
        
        if (slopePercent < 0.5) {
            return {
                prediction: 'plateau_likely',
                slopePercent: slopePercent.toFixed(2),
                recommendation: 'Considera: deload, variazione esercizio, o aumento volume'
            };
        } else if (slopePercent > 2) {
            return {
                prediction: 'progressing_well',
                slopePercent: slopePercent.toFixed(2),
                recommendation: 'Continua con programma attuale'
            };
        } else {
            return {
                prediction: 'steady_progress',
                slopePercent: slopePercent.toFixed(2),
                recommendation: 'Progressione normale'
            };
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 APPLY TO WORKOUT - Applica progressione a workout
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Applica progressive overload a workout generato
     */
    applyProgression(workout, goal, readinessData = null) {
        // 1. Calcola modificatore giornaliero se abbiamo dati readiness
        let dailyMod = { modifier: 1.0 };
        if (readinessData) {
            dailyMod = this.calculateDailyModifier(readinessData);
            workout.readiness = dailyMod;
            console.log(`📊 Readiness: ${dailyMod.score}% - ${dailyMod.recommendation.message}`);
        }
        
        // 2. Applica progressione a ogni esercizio
        workout.exercises = workout.exercises.map(exercise => {
            // Skip warmup, cooldown, rehab
            if (['warmup', 'cooldown', 'rehabilitation'].includes(exercise.type)) {
                return exercise;
            }
            
            // Ottieni storia e calcola progressione
            const history = this.getExerciseHistory(exercise.name, 4);
            
            if (history.length > 0) {
                const lastSession = history[history.length - 1];
                const progression = this.calculateProgression(
                    exercise.name,
                    lastSession.weight || 0,
                    parseInt(String(lastSession.reps).split('-')[0]) || 8,
                    lastSession.rpe || 7,
                    goal
                );
                
                // Applica raccomandazione
                if (progression.recommendation === 'increase_weight') {
                    exercise.suggestedWeight = progression.newWeight;
                    exercise.progressionNote = `↑ ${progression.newWeight}kg (+${progression.newWeight - (lastSession.weight || 0)}kg)`;
                } else if (progression.recommendation === 'increase_reps') {
                    exercise.suggestedReps = progression.newReps;
                    exercise.progressionNote = `↑ ${progression.newReps} reps`;
                } else if (progression.recommendation === 'deload') {
                    exercise.suggestedWeight = progression.newWeight;
                    exercise.progressionNote = `⚠️ Deload: ${progression.newWeight}kg`;
                } else {
                    exercise.suggestedWeight = lastSession.weight;
                    exercise.progressionNote = 'Mantieni';
                }
                
                exercise.lastWeight = lastSession.weight;
                exercise.lastReps = lastSession.reps;
                exercise.lastRPE = lastSession.rpe;
            }
            
            // Applica modificatore readiness
            if (dailyMod.modifier < 1.0 && exercise.suggestedWeight) {
                exercise.adjustedWeight = Math.round(exercise.suggestedWeight * dailyMod.modifier);
                exercise.readinessAdjustment = `${Math.round((dailyMod.modifier - 1) * 100)}%`;
            }
            
            return exercise;
        });
        
        // 3. Aggiungi metadata progressione
        workout.progression = {
            applied: true,
            readinessModifier: dailyMod.modifier,
            goal,
            date: new Date().toISOString()
        };
        
        return workout;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 REPORTS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Genera report completo
     */
    generateReport(days = 30) {
        const trends = this.analyzeTrends(days);
        const prs = this.getAllPRs();
        const history = this.getSessionHistory({ days });
        
        console.log('\n' + '═'.repeat(70));
        console.log('📊 ATLAS PROGRESSION REPORT');
        console.log('═'.repeat(70));
        
        console.log(`\n📅 Periodo: ultimi ${days} giorni`);
        console.log(`📝 Sessioni totali: ${history.length}`);
        
        console.log('\n📈 TREND ANALYSIS:');
        console.log(`   Status: ${trends.status}`);
        console.log(`   Volume trend: ${trends.metrics?.volumeTrend || 'N/A'}`);
        console.log(`   RPE trend: ${trends.metrics?.rpeTrend || 'N/A'}`);
        trends.recommendations?.forEach(r => console.log(`   ${r}`));
        
        console.log('\n🏆 PERSONAL RECORDS:');
        const prCount = Object.keys(prs).length;
        console.log(`   Esercizi tracciati: ${prCount}`);
        
        // Top 5 PRs recenti
        const recentPRs = [];
        for (const [exercise, data] of Object.entries(prs)) {
            if (data.estimated1RM) {
                recentPRs.push({
                    exercise,
                    e1rm: data.estimated1RM.value,
                    date: data.estimated1RM.date
                });
            }
        }
        recentPRs.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log('\n   Top Lifts (estimated 1RM):');
        recentPRs.slice(0, 5).forEach(pr => {
            console.log(`   • ${pr.exercise}: ${pr.e1rm}kg`);
        });
        
        console.log('\n' + '═'.repeat(70));
        
        return { trends, prs: prCount, sessions: history.length };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧪 DEMO
    // ═══════════════════════════════════════════════════════════════════════════
    
    demo() {
        console.log('\n' + '█'.repeat(70));
        console.log('█  📊 ATLAS PROGRESSION ENGINE - DEMO');
        console.log('█'.repeat(70));
        
        // Simula alcune sessioni
        console.log('\n📝 Simulazione sessioni...\n');
        
        const mockSessions = [
            {
                sport: 'palestra',
                goal: 'ipertrofia',
                week: 1,
                phase: 'Accumulo',
                exercises: [
                    { name: 'Back Squat', sets: 4, reps: 8, weight: 100, rpe: 7 },
                    { name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 80, rpe: 7.5 },
                    { name: 'Leg Press', sets: 3, reps: 12, weight: 150, rpe: 7 }
                ],
                feeling: 4,
                energy: 4,
                soreness: 2
            },
            {
                sport: 'palestra',
                goal: 'ipertrofia',
                week: 2,
                phase: 'Accumulo',
                exercises: [
                    { name: 'Back Squat', sets: 4, reps: 9, weight: 100, rpe: 7.5 },
                    { name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 82.5, rpe: 7.5 },
                    { name: 'Leg Press', sets: 3, reps: 12, weight: 155, rpe: 7 }
                ],
                feeling: 4,
                energy: 3,
                soreness: 3
            },
            {
                sport: 'palestra',
                goal: 'ipertrofia',
                week: 3,
                phase: 'Accumulo',
                exercises: [
                    { name: 'Back Squat', sets: 4, reps: 10, weight: 100, rpe: 8 },
                    { name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 85, rpe: 8 },
                    { name: 'Leg Press', sets: 3, reps: 12, weight: 160, rpe: 7.5 }
                ],
                feeling: 3,
                energy: 3,
                soreness: 3
            }
        ];
        
        // Log sessioni
        mockSessions.forEach((session, i) => {
            console.log(`   Sessione ${i + 1}...`);
            this.logSession(session);
        });
        
        // Test progressione
        console.log('\n📈 CALCOLO PROGRESSIONE:\n');
        
        const progression = this.calculateProgression('Back Squat', 100, 10, 8, 'ipertrofia');
        console.log('Back Squat:', JSON.stringify(progression, null, 2));
        
        // Test readiness
        console.log('\n🎯 TEST AUTO-REGULATION:\n');
        
        const readiness = this.calculateDailyModifier({
            sleep: 4,
            stress: 2,
            soreness: 3,
            energy: 4,
            motivation: 5
        });
        console.log('Readiness:', JSON.stringify(readiness, null, 2));
        
        // Report
        this.generateReport(30);
        
        console.log('\n' + '█'.repeat(70));
        console.log('█  ✅ DEMO COMPLETATA');
        console.log('█'.repeat(70) + '\n');
        
        return { progression, readiness };
    },
    
    /**
     * Reset dati (per testing)
     */
    reset() {
        this.storage.clear();
        console.log('🗑️ Dati progression resettati');
    }
};

// Export
if (typeof window !== 'undefined') {
    window.ATLASProgression = ATLASProgression;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ATLASProgression;
}
