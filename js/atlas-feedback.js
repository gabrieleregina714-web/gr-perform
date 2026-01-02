/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔄 ATLAS FEEDBACK LOOP v1.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sistema di feedback intelligente che:
 * 1. Raccoglie feedback post-sessione dall'atleta
 * 2. Analizza pattern nei feedback (troppo facile, troppo difficile, dolori)
 * 3. Aggiusta automaticamente i parametri del prossimo workout
 * 
 * OBIETTIVO: +5% qualità sistema → verso il 90%
 */

window.ATLASFeedback = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 FEEDBACK SCHEMA
    // ═══════════════════════════════════════════════════════════════════════════
    
    feedbackSchema: {
        // Percezione difficoltà (1-10)
        perceivedDifficulty: {
            1: 'Troppo facile - dormivo',
            2: 'Molto facile',
            3: 'Facile',
            4: 'Leggermente facile',
            5: 'Giusto',
            6: 'Leggermente difficile',
            7: 'Difficile',
            8: 'Molto difficile',
            9: 'Quasi impossibile',
            10: 'Non sono riuscito a finire'
        },
        
        // RPE medio sessione
        sessionRPE: {
            min: 1,
            max: 10,
            ideal: { potenza: 7, forza: 8, ipertrofia: 7 }
        },
        
        // Energia post-workout
        energyLevel: {
            1: 'Distrutto - non mi reggo in piedi',
            2: 'Molto stanco',
            3: 'Stanco ma soddisfatto',
            4: 'Bene, potevo fare di più',
            5: 'Fresco - troppo poco'
        },
        
        // Dolori/Fastidi
        painPoints: [
            'lower_back', 'upper_back', 'neck',
            'left_shoulder', 'right_shoulder',
            'left_elbow', 'right_elbow',
            'left_wrist', 'right_wrist',
            'left_hip', 'right_hip',
            'left_knee', 'right_knee',
            'left_ankle', 'right_ankle'
        ],
        
        painIntensity: {
            0: 'Nessun dolore',
            1: 'Fastidio leggero',
            2: 'Dolore moderato',
            3: 'Dolore significativo',
            4: 'Dolore forte - ho dovuto modificare',
            5: 'Dolore intenso - ho dovuto fermarmi'
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📝 REGISTRAZIONE FEEDBACK
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Registra feedback completo post-sessione
     */
    recordFeedback(workoutId, athleteId, feedback) {
        const record = {
            workoutId,
            athleteId,
            timestamp: new Date().toISOString(),
            
            // Core metrics
            perceivedDifficulty: feedback.difficulty || 5,
            sessionRPE: feedback.rpe || 7,
            energyLevel: feedback.energy || 3,
            completionRate: feedback.completionRate || 100, // % esercizi completati
            
            // Pain tracking
            painPoints: feedback.painPoints || [], // [{area: 'left_knee', intensity: 2}]
            
            // Esercizi specifici
            exerciseFeedback: feedback.exercises || [], // [{name: 'Squat', tooHard: true, pain: false}]
            
            // Note libere
            notes: feedback.notes || '',
            
            // Metriche calcolate
            adjustmentNeeded: this.calculateAdjustment(feedback)
        };
        
        // Salva in localStorage per ora (poi Supabase)
        this.saveFeedback(record);
        
        return record;
    },
    
    /**
     * Calcola adjustment necessario basato su feedback
     */
    calculateAdjustment(feedback) {
        const diff = feedback.difficulty || 5;
        const rpe = feedback.rpe || 7;
        const energy = feedback.energy || 3;
        
        // Score combinato: -3 (troppo facile) a +3 (troppo difficile)
        let score = 0;
        
        // Difficulty: 5 = perfetto, <5 = troppo facile, >5 = troppo difficile
        score += (diff - 5) * 0.4;
        
        // RPE: 7-8 ideale, sotto = facile, sopra = difficile
        if (rpe < 6) score -= 1;
        if (rpe > 8) score += 1;
        if (rpe > 9) score += 1;
        
        // Energy: 3 = perfetto, 4-5 = troppo facile, 1-2 = troppo difficile
        if (energy >= 4) score -= 0.5;
        if (energy <= 2) score += 0.5;
        
        // Pain penalty
        const painCount = (feedback.painPoints || []).filter(p => p.intensity >= 2).length;
        if (painCount > 0) score += painCount * 0.3;
        
        return {
            score: Math.max(-3, Math.min(3, score)),
            direction: score > 0.5 ? 'easier' : (score < -0.5 ? 'harder' : 'maintain'),
            volumeAdjust: score > 0.5 ? -10 : (score < -0.5 ? 10 : 0), // % volume
            intensityAdjust: score > 0.5 ? -5 : (score < -0.5 ? 5 : 0), // % intensity
            needsReview: Math.abs(score) > 2 || painCount > 2
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📈 ANALISI PATTERN
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Analizza ultimi N feedback per trovare pattern
     */
    analyzePatterns(athleteId, limit = 10) {
        const feedbacks = this.getFeedbackHistory(athleteId, limit);
        
        if (feedbacks.length < 3) {
            return {
                hasEnoughData: false,
                recommendation: 'Servono almeno 3 sessioni per analisi pattern'
            };
        }
        
        // Trend difficoltà
        const difficultyTrend = this.calculateTrend(feedbacks.map(f => f.perceivedDifficulty));
        
        // Pattern dolori ricorrenti
        const painPatterns = this.findPainPatterns(feedbacks);
        
        // Esercizi problematici
        const problematicExercises = this.findProblematicExercises(feedbacks);
        
        // Trend RPE
        const rpeTrend = this.calculateTrend(feedbacks.map(f => f.sessionRPE));
        
        // Calcola raccomandazioni
        const recommendations = [];
        
        if (difficultyTrend.direction === 'increasing' && difficultyTrend.magnitude > 0.5) {
            recommendations.push({
                type: 'volume',
                action: 'reduce',
                reason: 'Difficoltà in aumento costante',
                adjustment: -15
            });
        }
        
        if (difficultyTrend.direction === 'decreasing' && difficultyTrend.magnitude > 0.5) {
            recommendations.push({
                type: 'progression',
                action: 'increase',
                reason: 'Atleta si sta adattando bene',
                adjustment: 10
            });
        }
        
        if (painPatterns.length > 0) {
            painPatterns.forEach(pattern => {
                recommendations.push({
                    type: 'avoid',
                    action: 'modify',
                    reason: `Dolore ricorrente: ${pattern.area}`,
                    exercises: pattern.relatedExercises
                });
            });
        }
        
        if (problematicExercises.length > 0) {
            recommendations.push({
                type: 'substitute',
                action: 'replace',
                reason: 'Esercizi con feedback negativo costante',
                exercises: problematicExercises
            });
        }
        
        return {
            hasEnoughData: true,
            sessionsAnalyzed: feedbacks.length,
            trends: {
                difficulty: difficultyTrend,
                rpe: rpeTrend
            },
            painPatterns,
            problematicExercises,
            recommendations,
            overallAdjustment: this.calculateOverallAdjustment(feedbacks)
        };
    },
    
    /**
     * Calcola trend da array di valori
     */
    calculateTrend(values) {
        if (values.length < 2) return { direction: 'stable', magnitude: 0 };
        
        const recent = values.slice(0, Math.ceil(values.length / 2));
        const older = values.slice(Math.ceil(values.length / 2));
        
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
        
        const diff = recentAvg - olderAvg;
        
        return {
            direction: diff > 0.3 ? 'increasing' : (diff < -0.3 ? 'decreasing' : 'stable'),
            magnitude: Math.abs(diff),
            recentAverage: recentAvg,
            historicalAverage: olderAvg
        };
    },
    
    /**
     * Trova pattern di dolori ricorrenti
     */
    findPainPatterns(feedbacks) {
        const painCounts = {};
        
        feedbacks.forEach(f => {
            (f.painPoints || []).forEach(pain => {
                if (pain.intensity >= 2) {
                    painCounts[pain.area] = (painCounts[pain.area] || 0) + 1;
                }
            });
        });
        
        // Pattern = dolore in 30%+ delle sessioni
        const threshold = feedbacks.length * 0.3;
        const patterns = [];
        
        Object.entries(painCounts).forEach(([area, count]) => {
            if (count >= threshold) {
                patterns.push({
                    area,
                    frequency: count / feedbacks.length,
                    relatedExercises: this.getExercisesForPainArea(area)
                });
            }
        });
        
        return patterns;
    },
    
    /**
     * Mappa aree dolore -> esercizi da evitare/modificare
     */
    getExercisesForPainArea(area) {
        const mapping = {
            'lower_back': ['Deadlift', 'Good Morning', 'Barbell Row', 'Back Extension'],
            'upper_back': ['Pull-up', 'Lat Pulldown', 'Barbell Row'],
            'neck': ['Overhead Press', 'Shrugs', 'Upright Row'],
            'left_shoulder': ['Bench Press', 'Overhead Press', 'Lateral Raise', 'Dip'],
            'right_shoulder': ['Bench Press', 'Overhead Press', 'Lateral Raise', 'Dip'],
            'left_knee': ['Squat', 'Leg Press', 'Lunge', 'Leg Extension'],
            'right_knee': ['Squat', 'Leg Press', 'Lunge', 'Leg Extension'],
            'left_hip': ['Squat', 'Deadlift', 'Lunge', 'Hip Thrust'],
            'right_hip': ['Squat', 'Deadlift', 'Lunge', 'Hip Thrust'],
            'left_elbow': ['Tricep Extension', 'Skull Crusher', 'Dip', 'Bench Press'],
            'right_elbow': ['Tricep Extension', 'Skull Crusher', 'Dip', 'Bench Press']
        };
        
        return mapping[area] || [];
    },
    
    /**
     * Trova esercizi con feedback negativo costante
     */
    findProblematicExercises(feedbacks) {
        const exerciseIssues = {};
        
        feedbacks.forEach(f => {
            (f.exerciseFeedback || []).forEach(ex => {
                if (ex.tooHard || ex.pain || ex.skipped) {
                    const key = ex.name.toLowerCase();
                    exerciseIssues[key] = exerciseIssues[key] || { name: ex.name, issues: 0 };
                    exerciseIssues[key].issues++;
                }
            });
        });
        
        // Problematico = issue in 40%+ delle sessioni che lo includevano
        return Object.values(exerciseIssues)
            .filter(ex => ex.issues >= 2)
            .map(ex => ex.name);
    },
    
    /**
     * Calcola adjustment complessivo da storico feedback
     */
    calculateOverallAdjustment(feedbacks) {
        const adjustments = feedbacks.map(f => f.adjustmentNeeded);
        
        const avgScore = adjustments.reduce((a, b) => a + (b?.score || 0), 0) / adjustments.length;
        const avgVolume = adjustments.reduce((a, b) => a + (b?.volumeAdjust || 0), 0) / adjustments.length;
        const avgIntensity = adjustments.reduce((a, b) => a + (b?.intensityAdjust || 0), 0) / adjustments.length;
        
        return {
            score: avgScore,
            volumeAdjust: Math.round(avgVolume),
            intensityAdjust: Math.round(avgIntensity),
            direction: avgScore > 0.3 ? 'easier' : (avgScore < -0.3 ? 'harder' : 'maintain')
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 APPLICAZIONE ADJUSTMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Applica adjustments al workout basandosi su analisi feedback
     */
    applyAdjustments(workout, athleteId) {
        const analysis = this.analyzePatterns(athleteId);
        
        if (!analysis.hasEnoughData) {
            console.log('📊 Feedback: dati insufficienti, nessun adjustment');
            return { workout, adjustments: [] };
        }
        
        const adjustments = [];
        let adjustedWorkout = JSON.parse(JSON.stringify(workout));
        
        // 1. Applica adjustment volume/intensità
        if (analysis.overallAdjustment.direction !== 'maintain') {
            adjustedWorkout = this.adjustVolumeIntensity(
                adjustedWorkout, 
                analysis.overallAdjustment
            );
            adjustments.push({
                type: 'global',
                action: analysis.overallAdjustment.direction,
                volumeChange: analysis.overallAdjustment.volumeAdjust,
                intensityChange: analysis.overallAdjustment.intensityAdjust
            });
        }
        
        // 2. Sostituisci esercizi problematici
        if (analysis.problematicExercises.length > 0) {
            adjustedWorkout = this.substituteProblematicExercises(
                adjustedWorkout,
                analysis.problematicExercises
            );
            adjustments.push({
                type: 'substitution',
                exercises: analysis.problematicExercises
            });
        }
        
        // 3. Applica raccomandazioni per pattern dolore
        analysis.painPatterns.forEach(pattern => {
            adjustedWorkout = this.modifyForPainArea(adjustedWorkout, pattern.area);
            adjustments.push({
                type: 'pain_prevention',
                area: pattern.area
            });
        });
        
        console.log(`📊 Feedback Analysis: ${adjustments.length} adjustments applicati`);
        
        return {
            workout: adjustedWorkout,
            adjustments,
            analysis
        };
    },
    
    /**
     * Aggiusta volume e intensità globalmente
     */
    adjustVolumeIntensity(workout, adjustment) {
        const exercises = workout.exercises || [];
        
        const volumeFactor = 1 + (adjustment.volumeAdjust / 100);
        const intensityFactor = 1 + (adjustment.intensityAdjust / 100);
        
        const processExercise = (ex) => {
            const adjusted = { ...ex };
            
            // Adjust sets (volume)
            if (adjusted.sets && adjustment.volumeAdjust !== 0) {
                const newSets = Math.round(adjusted.sets * volumeFactor);
                adjusted.sets = Math.max(1, Math.min(6, newSets));
                if (adjusted.sets !== ex.sets) {
                    adjusted.feedbackAdjusted = true;
                    adjusted.adjustmentReason = adjustment.volumeAdjust > 0 ? 
                        'Volume aumentato da feedback' : 'Volume ridotto da feedback';
                }
            }
            
            // Adjust reps range based on intensity
            if (adjusted.reps && adjustment.intensityAdjust !== 0) {
                // Parse reps range (e.g., "8-10" or "10")
                const repsMatch = String(adjusted.reps).match(/(\d+)(?:-(\d+))?/);
                if (repsMatch) {
                    let minReps = parseInt(repsMatch[1]);
                    let maxReps = repsMatch[2] ? parseInt(repsMatch[2]) : minReps;
                    
                    // Higher intensity = lower reps, lower intensity = higher reps
                    if (adjustment.intensityAdjust > 0) {
                        minReps = Math.max(1, minReps - 2);
                        maxReps = Math.max(minReps, maxReps - 2);
                    } else {
                        minReps = Math.min(20, minReps + 2);
                        maxReps = Math.min(20, maxReps + 2);
                    }
                    
                    adjusted.reps = minReps === maxReps ? `${minReps}` : `${minReps}-${maxReps}`;
                }
            }
            
            return adjusted;
        };
        
        // Handle both array and object structure
        if (Array.isArray(exercises)) {
            workout.exercises = exercises.map(processExercise);
        } else {
            ['warmup', 'main', 'accessory', 'cooldown', 'rehab'].forEach(section => {
                if (exercises[section]) {
                    workout.exercises[section] = exercises[section].map(processExercise);
                }
            });
        }
        
        return workout;
    },
    
    /**
     * Sostituisci esercizi problematici con alternative
     */
    substituteProblematicExercises(workout, problematicList) {
        const substitutions = {
            'squat': ['Leg Press', 'Goblet Squat', 'Box Squat'],
            'back squat': ['Front Squat', 'Leg Press', 'Safety Bar Squat'],
            'deadlift': ['Trap Bar Deadlift', 'Romanian Deadlift', 'Hip Thrust'],
            'bench press': ['Dumbbell Bench Press', 'Push-up', 'Floor Press'],
            'overhead press': ['Landmine Press', 'Dumbbell Press', 'Push Press'],
            'pull-up': ['Lat Pulldown', 'Assisted Pull-up', 'Inverted Row'],
            'barbell row': ['Dumbbell Row', 'Cable Row', 'T-Bar Row'],
            'lunge': ['Split Squat', 'Step-up', 'Leg Press Single Leg']
        };
        
        const problematicLower = problematicList.map(e => e.toLowerCase());
        
        const substituteExercise = (ex) => {
            const nameLower = (ex.name || ex.exercise || '').toLowerCase();
            
            if (problematicLower.includes(nameLower)) {
                const alternatives = substitutions[nameLower] || [];
                if (alternatives.length > 0) {
                    return {
                        ...ex,
                        name: alternatives[0],
                        originalExercise: ex.name || ex.exercise,
                        substitutedDueToFeedback: true,
                        feedbackAdjusted: true,
                        adjustmentReason: 'Sostituito per feedback negativo'
                    };
                }
            }
            return ex;
        };
        
        const exercises = workout.exercises || [];
        
        if (Array.isArray(exercises)) {
            workout.exercises = exercises.map(substituteExercise);
        } else {
            ['warmup', 'main', 'accessory', 'cooldown', 'rehab'].forEach(section => {
                if (exercises[section]) {
                    workout.exercises[section] = exercises[section].map(substituteExercise);
                }
            });
        }
        
        return workout;
    },
    
    /**
     * Modifica workout per evitare stress su area dolorante
     */
    modifyForPainArea(workout, painArea) {
        const areaExercises = this.getExercisesForPainArea(painArea);
        
        const modifyExercise = (ex) => {
            const nameLower = (ex.name || ex.exercise || '').toLowerCase();
            
            for (const problematic of areaExercises) {
                if (nameLower.includes(problematic.toLowerCase())) {
                    return {
                        ...ex,
                        sets: Math.max(1, (ex.sets || 3) - 1),
                        notes: `⚠️ Volume ridotto per dolore ${painArea}`,
                        feedbackAdjusted: true,
                        adjustmentReason: `Ridotto per pattern dolore ${painArea}`
                    };
                }
            }
            return ex;
        };
        
        const exercises = workout.exercises || [];
        
        if (Array.isArray(exercises)) {
            workout.exercises = exercises.map(modifyExercise);
        } else {
            ['warmup', 'main', 'accessory', 'cooldown', 'rehab'].forEach(section => {
                if (exercises[section]) {
                    workout.exercises[section] = exercises[section].map(modifyExercise);
                }
            });
        }
        
        return workout;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 STORAGE
    // ═══════════════════════════════════════════════════════════════════════════
    
    saveFeedback(record) {
        const key = `atlas_feedback_${record.athleteId}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.unshift(record);
        
        // Keep last 50 feedbacks
        const limited = existing.slice(0, 50);
        localStorage.setItem(key, JSON.stringify(limited));
        
        console.log(`📝 Feedback salvato per atleta ${record.athleteId}`);
    },
    
    getFeedbackHistory(athleteId, limit = 10) {
        const key = `atlas_feedback_${athleteId}`;
        const all = JSON.parse(localStorage.getItem(key) || '[]');
        return all.slice(0, limit);
    },
    
    getLastFeedback(athleteId) {
        const history = this.getFeedbackHistory(athleteId, 1);
        return history[0] || null;
    },
    
    clearFeedback(athleteId) {
        const key = `atlas_feedback_${athleteId}`;
        localStorage.removeItem(key);
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 STATS
    // ═══════════════════════════════════════════════════════════════════════════
    
    getStats(athleteId) {
        const history = this.getFeedbackHistory(athleteId, 50);
        
        if (history.length === 0) {
            return { feedbackCount: 0, hasData: false };
        }
        
        const avgDifficulty = history.reduce((a, b) => a + b.perceivedDifficulty, 0) / history.length;
        const avgRPE = history.reduce((a, b) => a + b.sessionRPE, 0) / history.length;
        const avgCompletion = history.reduce((a, b) => a + b.completionRate, 0) / history.length;
        
        const painSessions = history.filter(f => (f.painPoints || []).length > 0).length;
        
        return {
            feedbackCount: history.length,
            hasData: true,
            averages: {
                difficulty: avgDifficulty.toFixed(1),
                rpe: avgRPE.toFixed(1),
                completionRate: avgCompletion.toFixed(0) + '%'
            },
            painFrequency: ((painSessions / history.length) * 100).toFixed(0) + '%',
            trend: this.calculateTrend(history.map(f => f.perceivedDifficulty))
        };
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🔄 ATLAS Feedback Loop v1.0 loaded!');
console.log('   → ATLASFeedback.recordFeedback(workoutId, athleteId, feedback) - Record session feedback');
console.log('   → ATLASFeedback.analyzePatterns(athleteId) - Analyze feedback patterns');
console.log('   → ATLASFeedback.applyAdjustments(workout, athleteId) - Apply adjustments to workout');
console.log('   → ATLASFeedback.getStats(athleteId) - Get athlete feedback stats');
