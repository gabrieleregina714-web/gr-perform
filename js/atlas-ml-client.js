/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 ATLAS ML CLIENT v1.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * JavaScript client for communicating with ATLAS ML Engine
 * Handles clustering, predictions, and overtraining detection
 */

window.ATLASMLClient = {
    
    VERSION: '1.0',
    
    // ML Engine endpoint (configurable)
    endpoint: window.ATLAS_ML_ENDPOINT || 'http://localhost:8000',
    
    // Cache for reducing API calls
    cache: new Map(),
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    
    /**
     * Configure the ML client
     */
    configure(options = {}) {
        if (options.endpoint) this.endpoint = options.endpoint;
        if (options.cacheTimeout) this.cacheTimeout = options.cacheTimeout;
        console.log(`🧠 ATLAS ML Client configured: ${this.endpoint}`);
    },
    
    /**
     * Check if ML service is available
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.endpoint}/health`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                return {
                    available: true,
                    ...data
                };
            }
            return { available: false, error: 'Service unavailable' };
        } catch (error) {
            console.log('ML Service not available, using fallback mode');
            return { available: false, error: error.message };
        }
    },
    
    /**
     * Classify an athlete into a response cluster
     * @param {Object} athleteData - Athlete features
     */
    async classifyAthlete(athleteData) {
        const cacheKey = `cluster_${JSON.stringify(athleteData)}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;
        
        try {
            const response = await fetch(`${this.endpoint}/cluster`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.normalizeAthleteData(athleteData))
            });
            
            if (response.ok) {
                const result = await response.json();
                this.setCache(cacheKey, result);
                return result;
            }
            
            throw new Error('Classification failed');
        } catch (error) {
            console.warn('ML classification failed, using fallback:', error.message);
            return this.fallbackClassification(athleteData);
        }
    },
    
    /**
     * Predict strength progression
     * @param {Object} params - Prediction parameters
     */
    async predictProgression(params) {
        const { athleteId, exercise, current1RM, trainingWeeks = 12, weeklyVolume = 15, avgIntensity = 75, athleteData } = params;
        
        try {
            const response = await fetch(`${this.endpoint}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    athlete_id: athleteId,
                    current_1rm: current1RM,
                    exercise: exercise,
                    training_weeks: trainingWeeks,
                    weekly_volume: weeklyVolume,
                    avg_intensity: avgIntensity,
                    athlete: this.normalizeAthleteData(athleteData)
                })
            });
            
            if (response.ok) {
                return await response.json();
            }
            
            throw new Error('Prediction failed');
        } catch (error) {
            console.warn('ML prediction failed, using fallback:', error.message);
            return this.fallbackPrediction(params);
        }
    },
    
    /**
     * Check for overtraining risk
     * @param {Object} metrics - Time series of metrics (hrv, sleep, resting_hr, performance)
     */
    async checkOvertraining(metrics) {
        try {
            const response = await fetch(`${this.endpoint}/overtraining`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hrv: metrics.hrv || [],
                    sleep_quality: metrics.sleepQuality || [],
                    resting_hr: metrics.restingHR || [],
                    performance: metrics.performance || []
                })
            });
            
            if (response.ok) {
                return await response.json();
            }
            
            throw new Error('Overtraining check failed');
        } catch (error) {
            console.warn('ML overtraining check failed, using fallback:', error.message);
            return this.fallbackOvertrainingCheck(metrics);
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // FALLBACK IMPLEMENTATIONS (When ML service is unavailable)
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Fallback classification using heuristics
     */
    fallbackClassification(data) {
        let cluster = 'moderate_responder';
        let confidence = 0.6;
        
        const { progressionRate = 1, avgRecovery = 75, avgHrv = 55, weeklyVolume = 20, avgIntensity = 75 } = data;
        
        if (progressionRate > 1.5 && avgRecovery > 80) {
            cluster = 'high_responder';
            confidence = 0.75;
        } else if (avgHrv > 70 && weeklyVolume > 25) {
            cluster = 'volume_sensitive';
            confidence = 0.7;
        } else if (avgIntensity > 82) {
            cluster = 'intensity_thrives';
            confidence = 0.7;
        } else if (avgRecovery > 80 && avgHrv < 50) {
            cluster = 'recovery_dependent';
            confidence = 0.72;
        } else if (progressionRate < 0.5) {
            cluster = 'low_responder';
            confidence = 0.65;
        }
        
        return {
            cluster: cluster,
            details: { confidence, source: 'fallback' },
            description: this.getClusterDescription(cluster)
        };
    },
    
    /**
     * Fallback prediction using known formulas
     */
    fallbackPrediction(params) {
        const { current1RM, trainingWeeks = 12, athleteData = {} } = params;
        const trainingAge = athleteData.trainingAge || 2;
        const adherence = athleteData.adherenceRate || 85;
        const recovery = athleteData.avgRecovery || 75;
        
        // Base progression rate (decreases with experience)
        let weeklyRate;
        if (trainingAge < 1) {
            weeklyRate = 0.015; // 1.5% per week
        } else if (trainingAge < 3) {
            weeklyRate = 0.008; // 0.8% per week
        } else if (trainingAge < 5) {
            weeklyRate = 0.004; // 0.4% per week
        } else {
            weeklyRate = 0.002; // 0.2% per week
        }
        
        // Adjust for recovery and adherence
        const modifier = (recovery / 100) * (adherence / 100);
        const totalGain = current1RM * weeklyRate * trainingWeeks * modifier;
        const predicted = current1RM + totalGain;
        
        // Simple confidence interval
        const variance = 0.05 * predicted;
        
        return {
            exercise: params.exercise,
            current_1rm: current1RM,
            predicted_1rm: Math.round(predicted * 10) / 10,
            gain_kg: Math.round(totalGain * 10) / 10,
            gain_percent: Math.round((totalGain / current1RM) * 100 * 10) / 10,
            confidence_interval: [
                Math.round((predicted - variance) * 10) / 10,
                Math.round((predicted + variance) * 10) / 10
            ],
            risk_factors: this.assessRiskFactors(athleteData),
            recommendations: this.generateRecommendations(athleteData, params),
            source: 'fallback'
        };
    },
    
    /**
     * Fallback overtraining check
     */
    fallbackOvertrainingCheck(metrics) {
        const warnings = [];
        let riskScore = 0;
        
        // Analyze HRV trend
        if (metrics.hrv && metrics.hrv.length >= 4) {
            const trend = this.analyzeTrend(metrics.hrv);
            if (trend.direction === 'declining') {
                warnings.push('HRV declining - possible overreaching');
                riskScore += 25;
            }
        }
        
        // Analyze sleep
        if (metrics.sleepQuality && metrics.sleepQuality.length >= 4) {
            const trend = this.analyzeTrend(metrics.sleepQuality);
            if (trend.direction === 'declining') {
                warnings.push('Sleep quality decreasing');
                riskScore += 20;
            }
        }
        
        // Analyze resting HR (increasing is bad)
        if (metrics.restingHR && metrics.restingHR.length >= 4) {
            const trend = this.analyzeTrend(metrics.restingHR);
            if (trend.direction === 'increasing') {
                warnings.push('Resting heart rate increasing');
                riskScore += 25;
            }
        }
        
        // Analyze performance
        if (metrics.performance && metrics.performance.length >= 4) {
            const trend = this.analyzeTrend(metrics.performance);
            if (trend.direction === 'declining') {
                warnings.push('Performance declining despite training');
                riskScore += 30;
            } else if (trend.direction === 'stable' && trend.slope < 0.5) {
                warnings.push('Performance plateaued');
                riskScore += 10;
            }
        }
        
        let riskLevel, recommendation;
        if (riskScore >= 60) {
            riskLevel = 'high';
            recommendation = 'Recommend deload week or active recovery';
        } else if (riskScore >= 30) {
            riskLevel = 'moderate';
            recommendation = 'Monitor closely, consider reducing volume';
        } else {
            riskLevel = 'low';
            recommendation = 'Continue current program';
        }
        
        return {
            risk_level: riskLevel,
            risk_score: riskScore,
            warnings: warnings,
            recommendation: recommendation,
            source: 'fallback'
        };
    },
    
    /**
     * Analyze trend in time series
     */
    analyzeTrend(values) {
        if (values.length < 2) return { direction: 'stable', slope: 0 };
        
        const first = values.slice(0, Math.ceil(values.length / 3));
        const last = values.slice(-Math.ceil(values.length / 3));
        
        const avgFirst = first.reduce((a, b) => a + b, 0) / first.length;
        const avgLast = last.reduce((a, b) => a + b, 0) / last.length;
        
        const change = avgLast - avgFirst;
        const percentChange = (change / avgFirst) * 100;
        
        let direction;
        if (Math.abs(percentChange) < 3) {
            direction = 'stable';
        } else if (change > 0) {
            direction = 'increasing';
        } else {
            direction = 'declining';
        }
        
        return {
            direction,
            slope: change / values.length,
            percentChange
        };
    },
    
    /**
     * Assess risk factors from athlete data
     */
    assessRiskFactors(data) {
        const risks = [];
        
        if (data.avgHrv && data.avgHrv < 40) {
            risks.push('Low HRV indicates poor recovery capacity');
        }
        if (data.sleepQuality && data.sleepQuality < 60) {
            risks.push('Sleep quality below optimal');
        }
        if (data.stressLevel && data.stressLevel > 7) {
            risks.push('High stress may impair recovery');
        }
        if (data.weeklyVolume && data.weeklyVolume > 25) {
            risks.push('High training volume');
        }
        if (data.avgIntensity && data.avgIntensity > 85) {
            risks.push('Sustained high intensity');
        }
        if (data.adherenceRate && data.adherenceRate < 70) {
            risks.push('Low adherence');
        }
        
        return risks;
    },
    
    /**
     * Generate recommendations
     */
    generateRecommendations(athleteData, params) {
        const recs = [];
        
        if (athleteData.avgHrv && athleteData.avgHrv < 50) {
            recs.push('Prioritize recovery: sleep, nutrition, stress management');
        }
        
        if (athleteData.trainingAge && athleteData.trainingAge > 5) {
            recs.push('Focus on technique refinement and weak points');
        }
        
        if (athleteData.progressionRate && athleteData.progressionRate < 0.5) {
            recs.push('Try periodization variation (DUP, block, conjugate)');
        }
        
        if (params.avgIntensity && params.avgIntensity > 82) {
            recs.push('Include more submaximal volume work');
        }
        
        return recs;
    },
    
    /**
     * Get cluster description
     */
    getClusterDescription(cluster) {
        const descriptions = {
            high_responder: {
                title: 'High Responder',
                description: 'You adapt quickly to training stimulus',
                training_focus: 'Can handle higher volume and frequency',
                recommendations: ['Push training volume when recovery allows', 'Track metrics to avoid overreaching']
            },
            moderate_responder: {
                title: 'Moderate Responder',
                description: 'Average response to training with balanced recovery',
                training_focus: 'Standard periodization works well',
                recommendations: ['Follow proven programming principles', 'Prioritize consistency']
            },
            low_responder: {
                title: 'Low Responder',
                description: 'Slower adaptation rate',
                training_focus: 'Quality over quantity',
                recommendations: ['Focus on sleep and nutrition', 'Consider lower volume, higher intensity']
            },
            recovery_dependent: {
                title: 'Recovery Dependent',
                description: 'Progress heavily influenced by recovery quality',
                training_focus: 'Optimize recovery between sessions',
                recommendations: ['Prioritize 7-9 hours of sleep', 'Use readiness-based training']
            },
            volume_sensitive: {
                title: 'Volume Sensitive',
                description: 'Responds best to higher training volume',
                training_focus: 'More sets and reps, moderate intensity',
                recommendations: ['Higher set counts', 'DUP or high-frequency programs']
            },
            intensity_thrives: {
                title: 'Intensity Thrives',
                description: 'Responds best to heavy lifting',
                training_focus: 'Heavier loads, fewer sets',
                recommendations: ['Lower rep ranges (1-5)', 'Higher intensity (80-95% 1RM)']
            }
        };
        
        return descriptions[cluster] || descriptions.moderate_responder;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Normalize athlete data for API
     */
    normalizeAthleteData(data) {
        return {
            age: data.age || 25,
            training_age: data.trainingAge || data.training_age || 2,
            body_weight: data.weight || data.body_weight || 75,
            height: data.height || 175,
            body_fat_percentage: data.bodyFat || data.body_fat_percentage || 15,
            avg_hrv: data.avgHrv || data.avg_hrv || 55,
            avg_sleep_quality: data.sleepQuality || data.avg_sleep_quality || 75,
            avg_recovery_score: data.avgRecovery || data.avg_recovery_score || 75,
            weekly_training_volume: data.weeklyVolume || data.weekly_training_volume || 20,
            avg_intensity: data.avgIntensity || data.avg_intensity || 75,
            strength_ratio: data.strengthRatio || data.strength_ratio || 1.5,
            progression_rate: data.progressionRate || data.progression_rate || 1.0,
            adherence_rate: data.adherenceRate || data.adherence_rate || 85,
            injury_history: data.injuryHistory || data.injury_history || 0,
            stress_level: data.stressLevel || data.stress_level || 5
        };
    },
    
    /**
     * Cache management
     */
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    },
    
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    },
    
    clearCache() {
        this.cache.clear();
    }
};

console.log('🧠 ATLAS ML Client v1.0 loaded!');
console.log('   → ATLASMLClient.classifyAthlete(data)');
console.log('   → ATLASMLClient.predictProgression(params)');
console.log('   → ATLASMLClient.checkOvertraining(metrics)');
