/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ATLAS DIGITAL TWIN v1.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Modello matematico che simula la risposta dell'atleta a vari stimoli di
 * allenamento per prevedere e ottimizzare i risultati.
 * 
 * Based on:
 * - Banister Impulse-Response Model (Fitness-Fatigue)
 * - Busso's modified model
 * - General Adaptation Syndrome (GAS)
 * 
 * Features:
 * - Performance simulation over time
 * - Optimal training load calculation
 * - Peaking strategy simulation
 * - What-if scenario analysis
 */

window.ATLASDigitalTwin = {
    
    VERSION: '1.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // MODEL PARAMETERS (Calibrated per athlete)
    // ═══════════════════════════════════════════════════════════════════════════
    
    defaultParams: {
        // Fitness parameters
        tau_fit: 42,           // Fitness decay time constant (days)
        k_fit: 0.1,           // Fitness gain coefficient
        
        // Fatigue parameters
        tau_fat: 15,          // Fatigue decay time constant (days)
        k_fat: 0.2,           // Fatigue gain coefficient
        
        // Performance baseline
        p_0: 100,             // Initial performance
        
        // Training stress score weights
        volume_weight: 0.4,
        intensity_weight: 0.6,
        
        // Recovery modifiers
        sleep_modifier: 0.15,
        hrv_modifier: 0.10,
        stress_modifier: 0.10
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // CORE SIMULATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Create a new Digital Twin instance for an athlete
     */
    create(athleteProfile, trainingHistory = []) {
        const twin = {
            athlete: athleteProfile,
            params: this.calibrateParams(athleteProfile, trainingHistory),
            state: {
                fitness: 0,
                fatigue: 0,
                performance: athleteProfile.baselinePerformance || 100,
                timestamp: Date.now()
            },
            history: []
        };
        
        // Initialize from training history
        if (trainingHistory.length > 0) {
            this.initializeFromHistory(twin, trainingHistory);
        }
        
        return twin;
    },
    
    /**
     * Calibrate model parameters based on athlete characteristics
     */
    calibrateParams(athlete, history) {
        const params = { ...this.defaultParams };
        
        // Adjust based on training age
        const trainingAge = athlete.trainingAge || 2;
        if (trainingAge < 1) {
            // Beginners: faster adaptation, faster fatigue
            params.tau_fit = 35;
            params.tau_fat = 10;
            params.k_fit = 0.15;
        } else if (trainingAge > 5) {
            // Advanced: slower adaptation
            params.tau_fit = 50;
            params.tau_fat = 18;
            params.k_fit = 0.07;
        }
        
        // Adjust based on age
        const age = athlete.age || 30;
        if (age > 40) {
            params.tau_fat *= 1.2;  // Longer fatigue recovery
            params.k_fat *= 1.1;   // More fatigue from training
        }
        
        // Adjust based on recovery profile
        if (athlete.cluster === 'recovery_dependent') {
            params.tau_fat *= 1.3;
            params.sleep_modifier = 0.25;
        } else if (athlete.cluster === 'high_responder') {
            params.k_fit *= 1.2;
            params.tau_fit *= 0.9;
        }
        
        return params;
    },
    
    /**
     * Initialize state from historical training data
     */
    initializeFromHistory(twin, history) {
        // Sort by date
        const sorted = [...history].sort((a, b) => 
            new Date(a.date) - new Date(b.date));
        
        // Process each training session
        for (const session of sorted) {
            this.processTrainingSession(twin, session);
        }
    },
    
    /**
     * Calculate Training Stress Score (TSS) from workout
     */
    calculateTSS(workout, params = this.defaultParams) {
        const { volume_weight, intensity_weight } = params;
        
        // Extract metrics from workout
        const totalSets = workout.exercises?.reduce((sum, ex) => 
            sum + (ex.sets?.length || 0), 0) || 0;
        
        const avgIntensity = workout.avgIntensity || 75;
        const duration = workout.duration || 60;
        
        // Normalize components
        const volumeScore = (totalSets / 20) * 100;  // 20 sets = 100%
        const intensityScore = avgIntensity;
        const durationScore = (duration / 60) * 100;  // 60 min = 100%
        
        // Weighted TSS
        const tss = (volumeScore * volume_weight + intensityScore * intensity_weight) * 
                    (durationScore / 100);
        
        return Math.round(tss);
    },
    
    /**
     * Process a single training session
     */
    processTrainingSession(twin, session) {
        const { params, state } = twin;
        const tss = session.tss || this.calculateTSS(session, params);
        
        // Time since last update (days)
        const now = new Date(session.date || Date.now());
        const lastUpdate = new Date(state.timestamp);
        const daysDelta = (now - lastUpdate) / (1000 * 60 * 60 * 24);
        
        // Decay existing fitness and fatigue
        state.fitness *= Math.exp(-daysDelta / params.tau_fit);
        state.fatigue *= Math.exp(-daysDelta / params.tau_fat);
        
        // Add new training impulse
        state.fitness += params.k_fit * tss;
        state.fatigue += params.k_fat * tss;
        
        // Calculate performance
        state.performance = params.p_0 + state.fitness - state.fatigue;
        state.timestamp = now.getTime();
        
        // Track history
        twin.history.push({
            date: now.toISOString(),
            tss,
            fitness: state.fitness,
            fatigue: state.fatigue,
            performance: state.performance
        });
        
        return state;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // SIMULATION & PREDICTION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Simulate future performance given a training plan
     */
    simulate(twin, trainingPlan, days = 84) {
        // Clone current state
        const simState = { ...twin.state };
        const simParams = twin.params;
        const simulation = [];
        
        // Process each day
        for (let day = 1; day <= days; day++) {
            const date = new Date(Date.now() + day * 24 * 60 * 60 * 1000);
            
            // Find scheduled workout for this day
            const workout = trainingPlan.find(w => {
                const wDate = new Date(w.date);
                return wDate.toDateString() === date.toDateString();
            });
            
            // Decay
            simState.fitness *= Math.exp(-1 / simParams.tau_fit);
            simState.fatigue *= Math.exp(-1 / simParams.tau_fat);
            
            // Add training if scheduled
            if (workout) {
                const tss = workout.tss || this.calculateTSS(workout, simParams);
                simState.fitness += simParams.k_fit * tss;
                simState.fatigue += simParams.k_fat * tss;
            }
            
            // Calculate performance
            simState.performance = simParams.p_0 + simState.fitness - simState.fatigue;
            
            simulation.push({
                day,
                date: date.toISOString().split('T')[0],
                fitness: Math.round(simState.fitness * 10) / 10,
                fatigue: Math.round(simState.fatigue * 10) / 10,
                form: Math.round((simState.fitness - simState.fatigue) * 10) / 10,
                performance: Math.round(simState.performance * 10) / 10,
                hasWorkout: !!workout,
                tss: workout ? (workout.tss || this.calculateTSS(workout, simParams)) : 0
            });
        }
        
        return simulation;
    },
    
    /**
     * Find optimal peaking strategy for a target date
     */
    optimizePeaking(twin, targetDate, currentPlan = []) {
        const daysToTarget = Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysToTarget < 7) {
            return {
                status: 'too_late',
                message: 'Not enough time for effective peaking',
                recommendations: ['Focus on recovery and rest', 'Reduce volume 50%']
            };
        }
        
        // Test different taper strategies
        const strategies = [
            { name: 'Linear Taper', reduction: 'linear', duration: Math.min(14, daysToTarget) },
            { name: 'Step Taper', reduction: 'step', duration: Math.min(10, daysToTarget) },
            { name: 'Exponential Taper', reduction: 'exponential', duration: Math.min(14, daysToTarget) }
        ];
        
        const results = strategies.map(strategy => {
            const taperPlan = this.generateTaperPlan(twin, strategy, daysToTarget);
            const simulation = this.simulate(twin, taperPlan, daysToTarget);
            const peakPerformance = simulation[simulation.length - 1].performance;
            
            return {
                strategy: strategy.name,
                peakPerformance,
                form: simulation[simulation.length - 1].form,
                plan: taperPlan
            };
        });
        
        // Find best strategy
        const best = results.reduce((a, b) => 
            a.peakPerformance > b.peakPerformance ? a : b);
        
        return {
            status: 'success',
            daysToTarget,
            recommended: best.strategy,
            expectedPeakPerformance: best.peakPerformance,
            expectedForm: best.form,
            alternatives: results,
            taperPlan: best.plan
        };
    },
    
    /**
     * Generate a taper training plan
     */
    generateTaperPlan(twin, strategy, days) {
        const plan = [];
        const baseTSS = 50;  // Normal training TSS
        
        for (let day = 1; day <= days; day++) {
            const date = new Date(Date.now() + day * 24 * 60 * 60 * 1000);
            let tss = baseTSS;
            
            const taperDays = strategy.duration;
            const taperStart = days - taperDays;
            
            if (day > taperStart) {
                const taperProgress = (day - taperStart) / taperDays;
                
                switch (strategy.reduction) {
                    case 'linear':
                        tss = baseTSS * (1 - 0.6 * taperProgress);
                        break;
                    case 'step':
                        tss = taperProgress < 0.5 ? baseTSS * 0.6 : baseTSS * 0.3;
                        break;
                    case 'exponential':
                        tss = baseTSS * Math.exp(-2 * taperProgress);
                        break;
                }
            }
            
            // Rest days (every 3rd day during taper)
            if (day > taperStart && (day - taperStart) % 3 === 0) {
                tss = 0;
            }
            
            if (tss > 5) {
                plan.push({
                    date: date.toISOString(),
                    tss: Math.round(tss),
                    type: tss < 20 ? 'recovery' : (tss < 40 ? 'light' : 'normal')
                });
            }
        }
        
        return plan;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // WHAT-IF ANALYSIS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Compare different training scenarios
     */
    compareScenarios(twin, scenarios) {
        const results = scenarios.map(scenario => {
            const simulation = this.simulate(twin, scenario.plan, scenario.days || 84);
            
            // Calculate metrics
            const finalPerformance = simulation[simulation.length - 1].performance;
            const avgPerformance = simulation.reduce((sum, d) => sum + d.performance, 0) / simulation.length;
            const peakPerformance = Math.max(...simulation.map(d => d.performance));
            const avgFatigue = simulation.reduce((sum, d) => sum + d.fatigue, 0) / simulation.length;
            const totalTSS = simulation.reduce((sum, d) => sum + d.tss, 0);
            
            return {
                name: scenario.name,
                metrics: {
                    finalPerformance: Math.round(finalPerformance * 10) / 10,
                    avgPerformance: Math.round(avgPerformance * 10) / 10,
                    peakPerformance: Math.round(peakPerformance * 10) / 10,
                    avgFatigue: Math.round(avgFatigue * 10) / 10,
                    totalTrainingLoad: totalTSS,
                    efficiency: Math.round((peakPerformance / totalTSS) * 100) / 100
                },
                simulation
            };
        });
        
        // Rank scenarios
        results.sort((a, b) => b.metrics.finalPerformance - a.metrics.finalPerformance);
        
        return {
            ranked: results,
            recommendation: results[0].name,
            analysis: this.generateAnalysis(results)
        };
    },
    
    /**
     * Generate textual analysis of scenario comparison
     */
    generateAnalysis(results) {
        if (results.length < 2) return 'Need at least 2 scenarios to compare';
        
        const best = results[0];
        const worst = results[results.length - 1];
        const diff = best.metrics.finalPerformance - worst.metrics.finalPerformance;
        
        let analysis = `${best.name} produces ${diff.toFixed(1)} points higher performance than ${worst.name}. `;
        
        if (best.metrics.avgFatigue > worst.metrics.avgFatigue * 1.3) {
            analysis += 'However, it also generates more fatigue which may increase injury risk. ';
        }
        
        if (best.metrics.efficiency > worst.metrics.efficiency) {
            analysis += 'It is also more efficient in terms of training load to performance ratio.';
        }
        
        return analysis;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // RECOMMENDATIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Get current training recommendations based on state
     */
    getRecommendations(twin) {
        const { state, params } = twin;
        const form = state.fitness - state.fatigue;
        const recommendations = [];
        
        // Form-based recommendations
        if (form > 10) {
            recommendations.push({
                type: 'increase',
                message: 'Form is positive - can handle increased training load',
                action: 'Increase TSS by 10-15%'
            });
        } else if (form < -10) {
            recommendations.push({
                type: 'decrease',
                message: 'Fatigue exceeds fitness - recovery needed',
                action: 'Reduce training load by 20-30%'
            });
        }
        
        // Fatigue-based recommendations
        if (state.fatigue > state.fitness * 1.5) {
            recommendations.push({
                type: 'warning',
                message: 'High fatigue accumulation',
                action: 'Consider a deload week'
            });
        }
        
        // Fitness plateau detection
        if (twin.history.length > 7) {
            const recent = twin.history.slice(-7);
            const fitnessChange = recent[recent.length - 1].fitness - recent[0].fitness;
            
            if (Math.abs(fitnessChange) < 1) {
                recommendations.push({
                    type: 'plateau',
                    message: 'Fitness has plateaued',
                    action: 'Increase training stimulus or try different modality'
                });
            }
        }
        
        return {
            currentState: {
                fitness: Math.round(state.fitness * 10) / 10,
                fatigue: Math.round(state.fatigue * 10) / 10,
                form: Math.round(form * 10) / 10,
                performance: Math.round(state.performance * 10) / 10
            },
            status: form > 5 ? 'fresh' : (form < -5 ? 'fatigued' : 'neutral'),
            recommendations
        };
    }
};

console.log('🧬 ATLAS Digital Twin v1.0 loaded!');
console.log('   → ATLASDigitalTwin.create(athleteProfile, history)');
console.log('   → twin.simulate(trainingPlan, days)');
console.log('   → twin.optimizePeaking(targetDate)');
console.log('   → twin.compareScenarios(scenarios)');
