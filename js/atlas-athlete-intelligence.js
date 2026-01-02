/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧠 ATLAS ATHLETE INTELLIGENCE v1.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sistema centralizzato di intelligenza atleta che unifica:
 * - CNS Recovery & Muscle Recovery (ATLASRecovery)
 * - Feedback patterns (ATLASFeedback)
 * - Long-term learning (ATLASMemory)
 * - Progression tracking (ATLASProgression)
 * - Structural balance (ATLASStructuralBalance)
 * 
 * OBIETTIVO: Dashboard 360° dell'atleta - il sistema SA TUTTO
 */

window.ATLASAthleteIntelligence = {
    
    version: '1.0.0',
    
    // Storage key
    STORAGE_KEY: 'atlas_athlete_intelligence',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 ATHLETE STATE - Stato completo atleta
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Genera report 360° completo dell'atleta
     * Unisce dati da tutti i moduli ATLAS
     */
    getFullAthleteReport(athleteId, workoutHistory = [], feedbackHistory = []) {
        console.log(`🧠 ATLAS Intelligence: Generating 360° report for athlete ${athleteId}`);
        
        const report = {
            athleteId,
            generatedAt: new Date().toISOString(),
            
            // 1. RECOVERY STATUS
            recovery: this.getRecoveryStatus(athleteId, workoutHistory),
            
            // 2. CNS STATUS
            cns: this.getCNSStatus(athleteId, workoutHistory),
            
            // 3. MUSCLE RECOVERY
            muscleRecovery: this.getMuscleRecoveryStatus(athleteId, workoutHistory),
            
            // 4. FEEDBACK PATTERNS
            feedbackPatterns: this.getFeedbackPatterns(athleteId, feedbackHistory),
            
            // 5. PROGRESSION METRICS
            progression: this.getProgressionMetrics(athleteId, workoutHistory),
            
            // 6. INJURY RISK
            injuryRisk: this.getInjuryRisk(athleteId, workoutHistory, feedbackHistory),
            
            // 7. READINESS SCORE
            readiness: this.calculateReadiness(athleteId, workoutHistory, feedbackHistory),
            
            // 8. RECOMMENDATIONS
            recommendations: this.generateRecommendations(athleteId, workoutHistory, feedbackHistory),
            
            // 9. PREDICTIONS
            predictions: this.generatePredictions(athleteId, workoutHistory, feedbackHistory)
        };
        
        // Cache report
        this.cacheReport(athleteId, report);
        
        return report;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 💪 RECOVERY STATUS
    // ═══════════════════════════════════════════════════════════════════════════
    
    getRecoveryStatus(athleteId, workoutHistory) {
        // Usa ATLASRecovery se disponibile
        if (window.ATLASRecovery) {
            try {
                const profile = this.getAthleteProfile(athleteId);
                const recovery = window.ATLASRecovery.calculateRecoveryState(workoutHistory, profile);
                return {
                    available: true,
                    ...recovery
                };
            } catch (e) {
                console.warn('ATLASRecovery error:', e);
            }
        }
        
        // Fallback: calcolo semplificato
        const lastWorkout = workoutHistory[0];
        const hoursRest = lastWorkout ? 
            (Date.now() - new Date(lastWorkout.completed_at || lastWorkout.created_at).getTime()) / (1000 * 60 * 60) : 
            48;
        
        return {
            available: false,
            hoursRest: Math.round(hoursRest),
            recoveryPercent: Math.min(100, Math.round(hoursRest / 48 * 100)),
            status: hoursRest >= 48 ? 'fully_recovered' : hoursRest >= 24 ? 'moderate' : 'low'
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧠 CNS STATUS
    // ═══════════════════════════════════════════════════════════════════════════
    
    getCNSStatus(athleteId, workoutHistory) {
        // Check if CNS model available
        if (window.ATLASRecovery?.cnsModel) {
            try {
                const recentWorkouts = workoutHistory.slice(0, 7); // Last 7 workouts
                let cnsLoad = 0;
                
                recentWorkouts.forEach((w, i) => {
                    // Peso decrescente per workout più vecchi
                    const weight = Math.pow(0.7, i);
                    const workoutLoad = this.estimateCNSLoad(w);
                    cnsLoad += workoutLoad * weight;
                });
                
                return {
                    available: true,
                    currentLoad: Math.round(cnsLoad),
                    status: cnsLoad > 80 ? 'fatigued' : cnsLoad > 50 ? 'moderate' : 'fresh',
                    recommendation: cnsLoad > 80 ? 'Evitare lavoro esplosivo/massimale' : 
                                    cnsLoad > 50 ? 'Moderare intensità' : 'Pronto per lavoro intenso'
                };
            } catch (e) {
                console.warn('CNS calculation error:', e);
            }
        }
        
        return {
            available: false,
            status: 'unknown',
            recommendation: 'Modulo CNS non caricato'
        };
    },
    
    estimateCNSLoad(workout) {
        // Stima carico CNS da workout
        let load = 0;
        const exercises = workout.exercises || [];
        
        exercises.forEach(ex => {
            const name = (ex.name || '').toLowerCase();
            const sets = parseInt(ex.sets) || 0;
            
            // Esercizi ad alto impatto CNS
            if (/deadlift|squat|clean|snatch|jump|sprint|heavy/i.test(name)) {
                load += sets * 8;
            } else if (/bench|press|row|pull/i.test(name)) {
                load += sets * 5;
            } else if (/plyo|explosive|power/i.test(name)) {
                load += sets * 7;
            } else {
                load += sets * 2;
            }
        });
        
        return Math.min(100, load);
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🦵 MUSCLE RECOVERY STATUS
    // ═══════════════════════════════════════════════════════════════════════════
    
    getMuscleRecoveryStatus(athleteId, workoutHistory) {
        const muscleGroups = {
            chest: { recovery: 100, lastTrained: null },
            back: { recovery: 100, lastTrained: null },
            shoulders: { recovery: 100, lastTrained: null },
            biceps: { recovery: 100, lastTrained: null },
            triceps: { recovery: 100, lastTrained: null },
            quads: { recovery: 100, lastTrained: null },
            hamstrings: { recovery: 100, lastTrained: null },
            glutes: { recovery: 100, lastTrained: null },
            calves: { recovery: 100, lastTrained: null },
            core: { recovery: 100, lastTrained: null }
        };
        
        // Muscle groups to exercise mapping
        const exerciseToMuscle = {
            'chest': ['bench', 'chest', 'push-up', 'fly', 'pec'],
            'back': ['row', 'pull', 'lat', 'deadlift', 'back'],
            'shoulders': ['press', 'shoulder', 'raise', 'delt'],
            'biceps': ['curl', 'bicep', 'chin'],
            'triceps': ['tricep', 'extension', 'dip', 'pushdown'],
            'quads': ['squat', 'leg press', 'lunge', 'quad', 'extension'],
            'hamstrings': ['curl', 'rdl', 'deadlift', 'hamstring', 'nordic'],
            'glutes': ['hip', 'glute', 'thrust', 'bridge'],
            'calves': ['calf', 'raise'],
            'core': ['plank', 'crunch', 'core', 'twist', 'ab']
        };
        
        // Recovery hours per muscle group
        const recoveryHours = {
            chest: 48, back: 72, shoulders: 48, biceps: 36, triceps: 36,
            quads: 72, hamstrings: 72, glutes: 48, calves: 36, core: 24
        };
        
        // Analyze workout history
        workoutHistory.forEach(workout => {
            const workoutDate = new Date(workout.completed_at || workout.created_at);
            const hoursSince = (Date.now() - workoutDate.getTime()) / (1000 * 60 * 60);
            
            (workout.exercises || []).forEach(ex => {
                const name = (ex.name || '').toLowerCase();
                
                Object.entries(exerciseToMuscle).forEach(([muscle, keywords]) => {
                    if (keywords.some(kw => name.includes(kw))) {
                        const recoveryHrs = recoveryHours[muscle];
                        const recoveryPct = Math.min(100, Math.round((hoursSince / recoveryHrs) * 100));
                        
                        // Take the lowest recovery if multiple workouts hit same muscle
                        if (muscleGroups[muscle].recovery > recoveryPct || 
                            (muscleGroups[muscle].lastTrained === null || hoursSince < muscleGroups[muscle].hoursSince)) {
                            muscleGroups[muscle].recovery = recoveryPct;
                            muscleGroups[muscle].lastTrained = workoutDate.toISOString();
                            muscleGroups[muscle].hoursSince = hoursSince;
                        }
                    }
                });
            });
        });
        
        // Calculate overall
        const values = Object.values(muscleGroups).map(m => m.recovery);
        const avgRecovery = values.reduce((a, b) => a + b, 0) / values.length;
        const minRecovery = Math.min(...values);
        const fatigued = Object.entries(muscleGroups)
            .filter(([_, m]) => m.recovery < 70)
            .map(([name, _]) => name);
        
        return {
            muscles: muscleGroups,
            averageRecovery: Math.round(avgRecovery),
            minRecovery: Math.round(minRecovery),
            fatiguedMuscles: fatigued,
            readyToTrain: fatigued.length === 0
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 FEEDBACK PATTERNS
    // ═══════════════════════════════════════════════════════════════════════════
    
    getFeedbackPatterns(athleteId, feedbackHistory) {
        // Usa ATLASFeedback se disponibile
        if (window.ATLASFeedback) {
            try {
                const patterns = window.ATLASFeedback.analyzePatterns(athleteId, 20);
                return {
                    available: true,
                    ...patterns
                };
            } catch (e) {
                console.warn('ATLASFeedback error:', e);
            }
        }
        
        // Fallback: analisi semplificata
        if (feedbackHistory.length < 3) {
            return {
                available: false,
                message: 'Servono almeno 3 feedback per analisi'
            };
        }
        
        const avgRPE = feedbackHistory.reduce((s, f) => s + (f.rpe || 7), 0) / feedbackHistory.length;
        const avgDifficulty = feedbackHistory.reduce((s, f) => s + (f.difficulty || 5), 0) / feedbackHistory.length;
        
        return {
            available: true,
            feedbackCount: feedbackHistory.length,
            averageRPE: avgRPE.toFixed(1),
            averageDifficulty: avgDifficulty.toFixed(1),
            trend: avgRPE > 8 ? 'increasing' : avgRPE < 6 ? 'decreasing' : 'stable',
            painPoints: this.extractPainPoints(feedbackHistory)
        };
    },
    
    extractPainPoints(feedbackHistory) {
        const painCounts = {};
        
        feedbackHistory.forEach(f => {
            const areas = f.pain_areas || f.painAreas || [];
            areas.forEach(area => {
                painCounts[area] = (painCounts[area] || 0) + 1;
            });
        });
        
        return Object.entries(painCounts)
            .map(([area, count]) => ({ area, count, frequency: count / feedbackHistory.length }))
            .filter(p => p.count >= 2)
            .sort((a, b) => b.count - a.count);
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📈 PROGRESSION METRICS
    // ═══════════════════════════════════════════════════════════════════════════
    
    getProgressionMetrics(athleteId, workoutHistory) {
        // Usa ATLASProgression se disponibile
        if (window.ATLASProgression) {
            try {
                const history = window.ATLASProgression.getSessionHistory(athleteId);
                if (history && history.length > 0) {
                    return {
                        available: true,
                        sessions: history.length,
                        prs: window.ATLASProgression.getAllPRs?.(athleteId) || [],
                        trends: window.ATLASProgression.getProgressionTrends?.(athleteId) || {}
                    };
                }
            } catch (e) {
                console.warn('ATLASProgression error:', e);
            }
        }
        
        // Fallback
        const completedWorkouts = workoutHistory.filter(w => w.completed || w.status === 'completed');
        const thisWeek = completedWorkouts.filter(w => {
            const d = new Date(w.completed_at || w.created_at);
            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return d >= weekAgo;
        });
        
        const lastWeek = completedWorkouts.filter(w => {
            const d = new Date(w.completed_at || w.created_at);
            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
            return d >= twoWeeksAgo && d < weekAgo;
        });
        
        return {
            available: true,
            totalWorkouts: completedWorkouts.length,
            thisWeek: thisWeek.length,
            lastWeek: lastWeek.length,
            trend: thisWeek.length > lastWeek.length ? 'up' : 
                   thisWeek.length < lastWeek.length ? 'down' : 'stable',
            consistency: completedWorkouts.length > 0 ? 
                Math.round((thisWeek.length / 3) * 100) : 0 // Assuming 3 workouts/week target
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ⚠️ INJURY RISK
    // ═══════════════════════════════════════════════════════════════════════════
    
    getInjuryRisk(athleteId, workoutHistory, feedbackHistory) {
        let riskScore = 0;
        const riskFactors = [];
        
        // Factor 1: Overtraining (too many workouts recently)
        const last7Days = workoutHistory.filter(w => {
            const d = new Date(w.completed_at || w.created_at);
            return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
        });
        
        if (last7Days.length > 5) {
            riskScore += 30;
            riskFactors.push({ factor: 'overtraining', severity: 'high', message: `${last7Days.length} workout negli ultimi 7 giorni` });
        } else if (last7Days.length > 4) {
            riskScore += 15;
            riskFactors.push({ factor: 'overtraining', severity: 'medium', message: `${last7Days.length} workout negli ultimi 7 giorni` });
        }
        
        // Factor 2: High RPE consistently
        const recentFeedback = feedbackHistory.slice(0, 5);
        const highRPECount = recentFeedback.filter(f => (f.rpe || 7) >= 9).length;
        
        if (highRPECount >= 3) {
            riskScore += 25;
            riskFactors.push({ factor: 'high_intensity', severity: 'high', message: 'RPE 9+ nelle ultime 3+ sessioni' });
        } else if (highRPECount >= 2) {
            riskScore += 10;
            riskFactors.push({ factor: 'high_intensity', severity: 'medium', message: 'RPE elevato frequente' });
        }
        
        // Factor 3: Recurring pain
        const painPoints = this.extractPainPoints(feedbackHistory);
        if (painPoints.length > 0) {
            const severePain = painPoints.filter(p => p.frequency >= 0.3);
            if (severePain.length > 0) {
                riskScore += 35;
                riskFactors.push({ 
                    factor: 'recurring_pain', 
                    severity: 'high', 
                    message: `Dolore ricorrente: ${severePain.map(p => p.area).join(', ')}`
                });
            } else {
                riskScore += 15;
                riskFactors.push({ factor: 'pain_signals', severity: 'medium', message: 'Segnali di dolore presenti' });
            }
        }
        
        // Factor 4: Muscle imbalance (consecutive same muscle training)
        const muscleFrequency = this.getMuscleFrequency(workoutHistory.slice(0, 10));
        const imbalances = Object.entries(muscleFrequency)
            .filter(([_, count]) => count > 5)
            .map(([muscle, count]) => muscle);
        
        if (imbalances.length > 0) {
            riskScore += 20;
            riskFactors.push({ 
                factor: 'muscle_imbalance', 
                severity: 'medium', 
                message: `Sovraccarico: ${imbalances.join(', ')}`
            });
        }
        
        return {
            score: Math.min(100, riskScore),
            level: riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low',
            factors: riskFactors,
            recommendation: riskScore >= 60 ? 'Considerare deload o rest day' :
                           riskScore >= 30 ? 'Monitorare e moderare intensità' :
                           'Continuare come pianificato'
        };
    },
    
    getMuscleFrequency(workouts) {
        const freq = {};
        const muscleKeywords = {
            'chest': ['bench', 'chest', 'push-up', 'fly'],
            'back': ['row', 'pull', 'lat', 'deadlift'],
            'legs': ['squat', 'leg', 'lunge', 'calf'],
            'shoulders': ['press', 'shoulder', 'raise'],
            'arms': ['curl', 'tricep', 'bicep']
        };
        
        workouts.forEach(w => {
            (w.exercises || []).forEach(ex => {
                const name = (ex.name || '').toLowerCase();
                Object.entries(muscleKeywords).forEach(([muscle, keywords]) => {
                    if (keywords.some(kw => name.includes(kw))) {
                        freq[muscle] = (freq[muscle] || 0) + 1;
                    }
                });
            });
        });
        
        return freq;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ⚡ READINESS SCORE
    // ═══════════════════════════════════════════════════════════════════════════
    
    calculateReadiness(athleteId, workoutHistory, feedbackHistory) {
        let readiness = 100;
        const factors = [];
        
        // Recovery factor (30%)
        const recovery = this.getRecoveryStatus(athleteId, workoutHistory);
        const recoveryScore = recovery.recoveryPercent || 80;
        readiness -= (100 - recoveryScore) * 0.3;
        factors.push({ name: 'Recovery', value: recoveryScore, weight: 30 });
        
        // Sleep/energy from feedback (25%)
        const recentFeedback = feedbackHistory[0];
        const sleepScore = recentFeedback?.sleep ? recentFeedback.sleep * 20 : 70;
        readiness -= (100 - sleepScore) * 0.25;
        factors.push({ name: 'Sleep/Energy', value: sleepScore, weight: 25 });
        
        // Injury risk (25%)
        const injuryRisk = this.getInjuryRisk(athleteId, workoutHistory, feedbackHistory);
        const injuryScore = 100 - injuryRisk.score;
        readiness -= (100 - injuryScore) * 0.25;
        factors.push({ name: 'Injury Risk', value: injuryScore, weight: 25 });
        
        // Muscle recovery (20%)
        const muscleRecovery = this.getMuscleRecoveryStatus(athleteId, workoutHistory);
        readiness -= (100 - muscleRecovery.averageRecovery) * 0.2;
        factors.push({ name: 'Muscle Recovery', value: muscleRecovery.averageRecovery, weight: 20 });
        
        readiness = Math.max(0, Math.min(100, Math.round(readiness)));
        
        return {
            score: readiness,
            level: readiness >= 80 ? 'optimal' : readiness >= 60 ? 'good' : readiness >= 40 ? 'moderate' : 'low',
            color: readiness >= 80 ? '#22c55e' : readiness >= 60 ? '#84cc16' : readiness >= 40 ? '#eab308' : '#ef4444',
            factors,
            recommendation: this.getReadinessRecommendation(readiness)
        };
    },
    
    getReadinessRecommendation(readiness) {
        if (readiness >= 85) return 'Pronto per allenamento ad alta intensità';
        if (readiness >= 70) return 'Buona condizione - allenamento normale';
        if (readiness >= 55) return 'Moderare volume e intensità';
        if (readiness >= 40) return 'Preferire lavoro tecnico o active recovery';
        return 'Consigliato rest day o mobility';
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 💡 RECOMMENDATIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    generateRecommendations(athleteId, workoutHistory, feedbackHistory) {
        const recommendations = [];
        
        const readiness = this.calculateReadiness(athleteId, workoutHistory, feedbackHistory);
        const injuryRisk = this.getInjuryRisk(athleteId, workoutHistory, feedbackHistory);
        const muscleRecovery = this.getMuscleRecoveryStatus(athleteId, workoutHistory);
        
        // Readiness-based recommendations
        if (readiness.score < 50) {
            recommendations.push({
                type: 'recovery',
                priority: 'high',
                title: 'Giornata di recupero',
                description: 'La tua readiness è bassa. Considera stretching, foam rolling o rest completo.'
            });
        }
        
        // Injury risk recommendations
        injuryRisk.factors.forEach(factor => {
            if (factor.severity === 'high') {
                recommendations.push({
                    type: 'warning',
                    priority: 'high',
                    title: `Attenzione: ${factor.factor}`,
                    description: factor.message
                });
            }
        });
        
        // Muscle-specific recommendations
        if (muscleRecovery.fatiguedMuscles.length > 0) {
            recommendations.push({
                type: 'training',
                priority: 'medium',
                title: 'Evita questi muscoli oggi',
                description: `Non ancora recuperati: ${muscleRecovery.fatiguedMuscles.join(', ')}`
            });
        }
        
        // Progression recommendations
        const progression = this.getProgressionMetrics(athleteId, workoutHistory);
        if (progression.trend === 'down') {
            recommendations.push({
                type: 'motivation',
                priority: 'medium',
                title: 'Consistenza in calo',
                description: 'Questa settimana meno workout della scorsa. Recupera oggi!'
            });
        }
        
        // Sort by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        
        return recommendations;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔮 PREDICTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    generatePredictions(athleteId, workoutHistory, feedbackHistory) {
        const predictions = {};
        
        // Plateau prediction
        const recentPerformance = feedbackHistory.slice(0, 10);
        const performanceTrend = recentPerformance.map(f => f.performance_feeling || f.rpe || 7);
        
        if (performanceTrend.length >= 5) {
            const recent = performanceTrend.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
            const older = performanceTrend.slice(3, 6).reduce((a, b) => a + b, 0) / 3;
            
            if (Math.abs(recent - older) < 0.3 && recent > 7) {
                predictions.plateau = {
                    likely: true,
                    message: 'Possibile plateau in arrivo - considera variare stimoli',
                    confidence: 70
                };
            }
        }
        
        // Deload prediction
        const progression = this.getProgressionMetrics(athleteId, workoutHistory);
        const injuryRisk = this.getInjuryRisk(athleteId, workoutHistory, feedbackHistory);
        
        if (progression.totalWorkouts > 0 && progression.totalWorkouts % 12 >= 10) {
            predictions.deload = {
                recommended: true,
                message: `${12 - (progression.totalWorkouts % 12)} workout al prossimo deload consigliato`,
                confidence: 80
            };
        }
        
        // Performance prediction
        const readiness = this.calculateReadiness(athleteId, workoutHistory, feedbackHistory);
        predictions.nextWorkout = {
            expectedPerformance: readiness.score >= 80 ? 'excellent' : 
                                 readiness.score >= 60 ? 'good' : 
                                 readiness.score >= 40 ? 'moderate' : 'limited',
            recommendedIntensity: Math.max(60, Math.min(100, readiness.score)),
            message: readiness.recommendation
        };
        
        return predictions;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════
    
    getAthleteProfile(athleteId) {
        // Try to get from localStorage or return default
        try {
            const stored = localStorage.getItem(`atlas_athlete_${athleteId}`);
            if (stored) return JSON.parse(stored);
        } catch (e) {}
        
        return {
            id: athleteId,
            level: 'intermediate',
            age: 25,
            injuries: []
        };
    },
    
    cacheReport(athleteId, report) {
        try {
            const key = `${this.STORAGE_KEY}_${athleteId}`;
            localStorage.setItem(key, JSON.stringify({
                ...report,
                cachedAt: new Date().toISOString()
            }));
        } catch (e) {
            console.warn('Failed to cache report:', e);
        }
    },
    
    getCachedReport(athleteId, maxAgeMinutes = 5) {
        try {
            const key = `${this.STORAGE_KEY}_${athleteId}`;
            const cached = localStorage.getItem(key);
            if (!cached) return null;
            
            const report = JSON.parse(cached);
            const age = (Date.now() - new Date(report.cachedAt).getTime()) / (1000 * 60);
            
            if (age <= maxAgeMinutes) {
                return report;
            }
        } catch (e) {}
        
        return null;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 DASHBOARD DATA FORMATTER
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Formatta i dati per la dashboard UI
     */
    formatForDashboard(report) {
        return {
            // Main stats cards
            stats: [
                {
                    id: 'readiness',
                    label: 'Readiness',
                    value: `${report.readiness.score}%`,
                    icon: 'fa-bolt',
                    color: report.readiness.color,
                    trend: report.readiness.level
                },
                {
                    id: 'recovery',
                    label: 'Recovery',
                    value: `${report.muscleRecovery.averageRecovery}%`,
                    icon: 'fa-heartbeat',
                    color: report.muscleRecovery.averageRecovery >= 80 ? '#22c55e' : 
                           report.muscleRecovery.averageRecovery >= 60 ? '#eab308' : '#ef4444',
                    trend: report.muscleRecovery.readyToTrain ? 'up' : 'down'
                },
                {
                    id: 'injuryRisk',
                    label: 'Rischio Infortunio',
                    value: report.injuryRisk.level.toUpperCase(),
                    icon: 'fa-shield-alt',
                    color: report.injuryRisk.level === 'low' ? '#22c55e' : 
                           report.injuryRisk.level === 'medium' ? '#eab308' : '#ef4444',
                    trend: report.injuryRisk.level
                },
                {
                    id: 'progression',
                    label: 'Workout Settimana',
                    value: report.progression.thisWeek,
                    icon: 'fa-dumbbell',
                    color: '#3b82f6',
                    trend: report.progression.trend
                }
            ],
            
            // Muscle recovery chart data
            muscleChart: Object.entries(report.muscleRecovery.muscles).map(([muscle, data]) => ({
                muscle: muscle.charAt(0).toUpperCase() + muscle.slice(1),
                recovery: data.recovery,
                color: data.recovery >= 80 ? '#22c55e' : data.recovery >= 60 ? '#eab308' : '#ef4444'
            })),
            
            // Recommendations
            recommendations: report.recommendations,
            
            // Predictions
            predictions: report.predictions
        };
    }
};

// Auto-init
console.log('🧠 ATLAS Athlete Intelligence v1.0 loaded!');
console.log('   → ATLASAthleteIntelligence.getFullAthleteReport(athleteId, workouts, feedback)');
console.log('   → ATLASAthleteIntelligence.formatForDashboard(report)');
