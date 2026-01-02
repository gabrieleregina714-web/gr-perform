/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ATLAS READINESS ENGINE v1.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Sistema avanzato per calcolo readiness basato su dati biometrici reali
 * 
 * Fonti dati:
 * - WHOOP: Recovery, HRV, Sleep, Strain
 * - Oura: Readiness, HRV, Sleep, Activity
 * - Garmin: HRV, Sleep, Stress, Body Battery
 * - Manual input: Sleep quality, Soreness, Energy
 * 
 * Output:
 * - Readiness Score (0-100)
 * - Training recommendation
 * - Intensity modifier
 * - Detailed breakdown
 */

window.ATLASReadiness = {
    
    VERSION: '1.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // WEIGHTS FOR READINESS CALCULATION
    // Based on sports science research (Thorpe et al., 2017; Buchheit, 2014)
    // ═══════════════════════════════════════════════════════════════════════════
    
    weights: {
        // Primary indicators (60% total)
        hrv: 25,                    // Heart Rate Variability - most reliable
        sleep_quality: 20,          // Sleep score from device or subjective
        recovery_score: 15,         // Device-specific recovery (WHOOP/Oura)
        
        // Secondary indicators (30% total)
        resting_hr: 10,             // Elevated = underrecovery
        sleep_duration: 10,         // Hours of sleep
        stress: 10,                 // Stress score (inverse)
        
        // Tertiary indicators (10% total)
        soreness: 5,                // Subjective muscle soreness
        energy: 5                   // Subjective energy level
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // NORMALIZATION FUNCTIONS
    // Convert raw values to 0-100 scores
    // ═══════════════════════════════════════════════════════════════════════════
    
    normalizers: {
        // HRV in ms (RMSSD) - athlete norms
        hrv(value, athleteBaseline = 50) {
            if (!value) return null;
            
            // Compare to personal baseline
            const percentOfBaseline = (value / athleteBaseline) * 100;
            
            // Piecewise scoring
            if (percentOfBaseline >= 115) return 100;      // Way above baseline
            if (percentOfBaseline >= 105) return 90;       // Above baseline
            if (percentOfBaseline >= 95) return 80;        // At baseline
            if (percentOfBaseline >= 85) return 65;        // Slightly below
            if (percentOfBaseline >= 75) return 50;        // Below baseline
            if (percentOfBaseline >= 65) return 35;        // Significantly below
            return 20;                                      // Critical
        },
        
        // Resting HR in BPM - lower is better for athletes
        restingHR(value, athleteBaseline = 55) {
            if (!value) return null;
            
            const deviation = value - athleteBaseline;
            
            if (deviation <= -5) return 100;    // Well below baseline
            if (deviation <= 0) return 90;      // At or below baseline
            if (deviation <= 3) return 75;      // Slightly elevated
            if (deviation <= 6) return 55;      // Elevated
            if (deviation <= 10) return 35;     // Significantly elevated
            return 20;                           // Critical elevation
        },
        
        // Sleep duration in minutes
        sleepDuration(value) {
            if (!value) return null;
            
            const hours = value / 60;
            
            if (hours >= 8.5) return 100;
            if (hours >= 8) return 95;
            if (hours >= 7.5) return 85;
            if (hours >= 7) return 75;
            if (hours >= 6.5) return 60;
            if (hours >= 6) return 45;
            if (hours >= 5) return 30;
            return 15;
        },
        
        // Sleep quality/score (already 0-100)
        sleepQuality(value) {
            if (!value) return null;
            return Math.min(100, Math.max(0, value));
        },
        
        // Recovery score from device (already 0-100)
        recoveryScore(value) {
            if (!value) return null;
            return Math.min(100, Math.max(0, value));
        },
        
        // Stress score (inverse - high stress = low readiness)
        stress(value) {
            if (value === null || value === undefined) return null;
            return 100 - Math.min(100, Math.max(0, value));
        },
        
        // Body Battery (Garmin) - already 0-100
        bodyBattery(value) {
            if (!value) return null;
            return Math.min(100, Math.max(0, value));
        },
        
        // Strain (WHOOP) - high strain yesterday = lower readiness
        strain(value) {
            if (value === null || value === undefined) return null;
            
            // WHOOP strain is 0-21
            const normalizedStrain = (value / 21) * 100;
            return 100 - normalizedStrain;
        },
        
        // Subjective soreness (1-10 scale, 1 = no soreness)
        soreness(value) {
            if (!value) return null;
            return 100 - ((value - 1) / 9) * 100;
        },
        
        // Subjective energy (1-10 scale, 10 = high energy)
        energy(value) {
            if (!value) return null;
            return ((value - 1) / 9) * 100;
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // MAIN CALCULATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Calculate unified readiness score from all available data
     * @param {Object} data - Biometric data from wearables + manual input
     * @param {Object} athleteProfile - Athlete baselines and preferences
     * @returns {Object} Readiness result with score, factors, recommendation
     */
    calculate(data, athleteProfile = {}) {
        const factors = {};
        let totalScore = 0;
        let totalWeight = 0;
        
        // Extract baselines (use defaults if not personalized)
        const baselines = {
            hrv: athleteProfile.baselineHRV || 50,
            restingHR: athleteProfile.baselineRestingHR || 55
        };
        
        // Process each factor
        const factorMappings = [
            { key: 'hrv', dataKeys: ['hrv_rmssd', 'hrv'], normalize: (v) => this.normalizers.hrv(v, baselines.hrv), weight: this.weights.hrv },
            { key: 'sleep_quality', dataKeys: ['sleep_score', 'sleep_quality'], normalize: this.normalizers.sleepQuality, weight: this.weights.sleep_quality },
            { key: 'recovery_score', dataKeys: ['recovery_score', 'readiness_score'], normalize: this.normalizers.recoveryScore, weight: this.weights.recovery_score },
            { key: 'resting_hr', dataKeys: ['resting_heart_rate', 'resting_hr'], normalize: (v) => this.normalizers.restingHR(v, baselines.restingHR), weight: this.weights.resting_hr },
            { key: 'sleep_duration', dataKeys: ['sleep_duration_minutes', 'sleep_duration'], normalize: this.normalizers.sleepDuration, weight: this.weights.sleep_duration },
            { key: 'stress', dataKeys: ['stress_score', 'stress'], normalize: this.normalizers.stress, weight: this.weights.stress },
            { key: 'soreness', dataKeys: ['soreness', 'muscle_soreness'], normalize: this.normalizers.soreness, weight: this.weights.soreness },
            { key: 'energy', dataKeys: ['energy', 'energy_level'], normalize: this.normalizers.energy, weight: this.weights.energy }
        ];
        
        for (const mapping of factorMappings) {
            // Find value from data (try each possible key)
            let rawValue = null;
            let usedKey = null;
            
            for (const key of mapping.dataKeys) {
                if (data[key] !== undefined && data[key] !== null) {
                    rawValue = data[key];
                    usedKey = key;
                    break;
                }
            }
            
            if (rawValue !== null) {
                const score = mapping.normalize(rawValue);
                
                if (score !== null) {
                    factors[mapping.key] = {
                        raw: rawValue,
                        score: Math.round(score),
                        weight: mapping.weight,
                        source: usedKey
                    };
                    
                    totalScore += score * mapping.weight;
                    totalWeight += mapping.weight;
                }
            }
        }
        
        // Calculate final score
        const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : null;
        
        // Determine status and recommendation
        const recommendation = this.getRecommendation(finalScore, factors);
        
        // Calculate confidence based on data availability
        const confidence = this.calculateConfidence(factors, totalWeight);
        
        return {
            score: finalScore,
            status: recommendation.status,
            factors: factors,
            recommendation: recommendation,
            confidence: confidence,
            timestamp: new Date().toISOString()
        };
    },
    
    /**
     * Calculate confidence in the readiness score
     */
    calculateConfidence(factors, totalWeight) {
        const maxWeight = Object.values(this.weights).reduce((a, b) => a + b, 0);
        const dataCompleteness = totalWeight / maxWeight;
        
        // Higher weight on objective measures = higher confidence
        const objectiveMeasures = ['hrv', 'resting_hr', 'recovery_score'];
        const hasObjective = objectiveMeasures.some(m => factors[m]);
        
        let confidence = dataCompleteness * 100;
        
        if (!hasObjective) {
            confidence *= 0.7; // Reduce confidence if only subjective data
        }
        
        if (factors.hrv) {
            confidence = Math.min(100, confidence * 1.2); // Boost if HRV available
        }
        
        return {
            level: confidence >= 70 ? 'high' : (confidence >= 40 ? 'medium' : 'low'),
            percentage: Math.round(confidence),
            dataPoints: Object.keys(factors).length
        };
    },
    
    /**
     * Get training recommendation based on readiness
     */
    getRecommendation(score, factors) {
        if (score === null) {
            return {
                status: 'unknown',
                message: 'Dati insufficienti per calcolare readiness',
                intensity_modifier: 1.0,
                volume_modifier: 1.0,
                emoji: '❓',
                color: '#888888',
                actions: ['Connetti un wearable o inserisci dati manuali']
            };
        }
        
        // Analyze specific factors for nuanced recommendations
        const hrvLow = factors.hrv && factors.hrv.score < 50;
        const sleepPoor = factors.sleep_duration && factors.sleep_duration.score < 50;
        const highStress = factors.stress && factors.stress.score < 50;
        
        if (score >= 85) {
            return {
                status: 'optimal',
                message: 'Condizioni ottimali! Pronto per performance massima',
                intensity_modifier: 1.1,
                volume_modifier: 1.15,
                emoji: '🚀',
                color: '#00D4AA',
                actions: [
                    'Sessione ad alta intensità consigliata',
                    'Possibile PR day',
                    'Lavoro tecnico complesso OK'
                ]
            };
        }
        
        if (score >= 70) {
            return {
                status: 'good',
                message: 'Buona readiness - allenamento standard',
                intensity_modifier: 1.0,
                volume_modifier: 1.0,
                emoji: '💪',
                color: '#4CAF50',
                actions: [
                    'Procedi con il programma pianificato',
                    'Ascolta il corpo durante warmup',
                    highStress ? 'Considera tecniche di respirazione pre-workout' : null
                ].filter(Boolean)
            };
        }
        
        if (score >= 55) {
            return {
                status: 'moderate',
                message: 'Readiness moderata - riduci intensità',
                intensity_modifier: 0.85,
                volume_modifier: 0.9,
                emoji: '👍',
                color: '#FFC107',
                actions: [
                    'Riduci carico del 10-15%',
                    'Focus su tecnica e movimento',
                    sleepPoor ? 'Prioritizza sonno stasera' : null,
                    hrvLow ? 'Evita HIIT, preferisci steady-state' : null
                ].filter(Boolean)
            };
        }
        
        if (score >= 40) {
            return {
                status: 'low',
                message: 'Readiness bassa - active recovery consigliato',
                intensity_modifier: 0.7,
                volume_modifier: 0.6,
                emoji: '🧘',
                color: '#FF9800',
                actions: [
                    'Mobilità e stretching',
                    'Camminata o nuoto leggero',
                    'Foam rolling',
                    'Niente lavoro ad alta intensità'
                ]
            };
        }
        
        return {
            status: 'critical',
            message: 'Recupero prioritario - riposo consigliato',
            intensity_modifier: 0.5,
            volume_modifier: 0.4,
            emoji: '😴',
            color: '#F44336',
            actions: [
                'Rest day fortemente consigliato',
                'Sonno extra',
                'Idratazione e nutrizione',
                'Se devi allenarti: solo mobilità leggera'
            ]
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // BASELINE LEARNING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Calculate baseline values from historical data
     * @param {Array} history - Array of biometric records
     * @returns {Object} Calculated baselines
     */
    calculateBaselines(history) {
        if (!history || history.length < 7) {
            return null; // Need at least a week of data
        }
        
        const hrvValues = history.map(h => h.hrv_rmssd).filter(v => v);
        const hrValues = history.map(h => h.resting_heart_rate).filter(v => v);
        
        // Use rolling 7-day average as baseline
        const recent = history.slice(-30); // Last 30 days
        
        return {
            baselineHRV: this.calculateRollingAverage(hrvValues),
            hrvStdDev: this.calculateStdDev(hrvValues),
            baselineRestingHR: this.calculateRollingAverage(hrValues),
            restingHRStdDev: this.calculateStdDev(hrValues),
            dataPoints: recent.length,
            updatedAt: new Date().toISOString()
        };
    },
    
    calculateRollingAverage(values) {
        if (!values.length) return null;
        return values.reduce((a, b) => a + b, 0) / values.length;
    },
    
    calculateStdDev(values) {
        if (values.length < 2) return 0;
        const mean = this.calculateRollingAverage(values);
        const squareDiffs = values.map(v => Math.pow(v - mean, 2));
        return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length);
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // TREND ANALYSIS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Analyze readiness trend over time
     * @param {Array} history - Array of readiness scores
     * @returns {Object} Trend analysis
     */
    analyzeTrend(history) {
        if (!history || history.length < 3) {
            return { trend: 'insufficient_data' };
        }
        
        const recent = history.slice(-7);
        const scores = recent.map(h => h.score).filter(s => s !== null);
        
        if (scores.length < 3) {
            return { trend: 'insufficient_data' };
        }
        
        // Calculate simple trend
        const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
        const secondHalf = scores.slice(Math.floor(scores.length / 2));
        
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        
        const change = secondAvg - firstAvg;
        
        let trend, message;
        
        if (change > 10) {
            trend = 'improving';
            message = 'Readiness in miglioramento! Continua così';
        } else if (change > 3) {
            trend = 'slightly_improving';
            message = 'Leggero miglioramento della readiness';
        } else if (change > -3) {
            trend = 'stable';
            message = 'Readiness stabile';
        } else if (change > -10) {
            trend = 'slightly_declining';
            message = 'Readiness in leggero calo - monitora recupero';
        } else {
            trend = 'declining';
            message = '⚠️ Readiness in calo significativo - considera deload';
        }
        
        return {
            trend,
            message,
            change: Math.round(change),
            average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            dataPoints: scores.length
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INTEGRATION WITH WORKOUT GENERATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Modify workout based on readiness
     * @param {Object} workout - Generated workout
     * @param {Object} readiness - Readiness calculation result
     * @returns {Object} Modified workout
     */
    applyToWorkout(workout, readiness) {
        if (!workout || !readiness || readiness.score === null) {
            return workout;
        }
        
        const { intensity_modifier, volume_modifier } = readiness.recommendation;
        
        // Clone workout
        const modified = JSON.parse(JSON.stringify(workout));
        
        // Apply modifiers to exercises
        if (modified.exercises) {
            modified.exercises = modified.exercises.map(ex => {
                const modifiedEx = { ...ex };
                
                // Adjust sets
                if (modifiedEx.sets && volume_modifier < 1) {
                    const originalSets = parseInt(modifiedEx.sets) || 3;
                    modifiedEx.sets = Math.max(1, Math.round(originalSets * volume_modifier));
                    modifiedEx._volumeAdjusted = true;
                }
                
                // Adjust intensity in notes
                if (intensity_modifier < 1 && modifiedEx.notes) {
                    modifiedEx.notes += ` (Intensità ridotta al ${Math.round(intensity_modifier * 100)}%)`;
                }
                
                return modifiedEx;
            });
        }
        
        // Add readiness info to workout
        modified.readinessApplied = {
            score: readiness.score,
            status: readiness.status,
            modifiers: { intensity_modifier, volume_modifier },
            appliedAt: new Date().toISOString()
        };
        
        console.log(`🧬 Readiness ${readiness.score}% → Intensity: ${intensity_modifier}x, Volume: ${volume_modifier}x`);
        
        return modified;
    }
};

console.log('🧬 ATLAS Readiness Engine v1.0 loaded!');
console.log('   → ATLASReadiness.calculate(data, profile) - Calculate readiness');
console.log('   → ATLASReadiness.applyToWorkout(workout, readiness) - Modify workout');
