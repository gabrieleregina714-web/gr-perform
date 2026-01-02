/**
 * GR Perform - Performance Prediction Engine
 * A5: Sistema intelligente di predizione performance
 * 
 * Funzionalità:
 * - Trend analysis dei progressi
 * - Proiezioni performance future
 * - Optimal load prediction
 * - Fatigue/readiness modeling
 * - Goal achievement prediction
 * - Benchmark comparison
 */

window.PerformancePrediction = (function() {
    'use strict';

    const VERSION = '1.0';
    const STORAGE_KEY = 'gr_performance_data';
    const BENCHMARKS_KEY = 'gr_benchmarks';

    // ═══════════════════════════════════════════════════════════════
    // BENCHMARK DATABASE (per sport/livello)
    // ═══════════════════════════════════════════════════════════════
    const BENCHMARKS = {
        general: {
            beginner: {
                squat_1rm_bw: 0.8,    // x bodyweight
                deadlift_1rm_bw: 1.0,
                bench_1rm_bw: 0.6,
                pullups: 3,
                plank_seconds: 45,
                run_5k_minutes: 35
            },
            intermediate: {
                squat_1rm_bw: 1.25,
                deadlift_1rm_bw: 1.5,
                bench_1rm_bw: 1.0,
                pullups: 10,
                plank_seconds: 90,
                run_5k_minutes: 28
            },
            advanced: {
                squat_1rm_bw: 1.75,
                deadlift_1rm_bw: 2.25,
                bench_1rm_bw: 1.4,
                pullups: 20,
                plank_seconds: 180,
                run_5k_minutes: 22
            },
            elite: {
                squat_1rm_bw: 2.5,
                deadlift_1rm_bw: 3.0,
                bench_1rm_bw: 2.0,
                pullups: 30,
                plank_seconds: 300,
                run_5k_minutes: 18
            }
        },
        boxe: {
            beginner: {
                punch_power: 200,     // kg force
                rounds_cardio: 3,     // 3min rounds
                reaction_time_ms: 350,
                core_endurance: 60    // seconds
            },
            intermediate: {
                punch_power: 350,
                rounds_cardio: 6,
                reaction_time_ms: 280,
                core_endurance: 120
            },
            advanced: {
                punch_power: 500,
                rounds_cardio: 10,
                reaction_time_ms: 220,
                core_endurance: 180
            }
        },
        calcio: {
            beginner: {
                sprint_30m: 5.5,      // seconds
                yo_yo_level: 14,
                vertical_jump_cm: 35,
                agility_t_test: 12.0
            },
            intermediate: {
                sprint_30m: 4.8,
                yo_yo_level: 17,
                vertical_jump_cm: 45,
                agility_t_test: 10.5
            },
            advanced: {
                sprint_30m: 4.2,
                yo_yo_level: 20,
                vertical_jump_cm: 55,
                agility_t_test: 9.5
            }
        },
        basket: {
            beginner: {
                vertical_jump_cm: 40,
                lane_agility: 13.0,
                sprint_20m: 3.8,
                core_endurance: 60
            },
            intermediate: {
                vertical_jump_cm: 55,
                lane_agility: 11.5,
                sprint_20m: 3.3,
                core_endurance: 120
            },
            advanced: {
                vertical_jump_cm: 70,
                lane_agility: 10.0,
                sprint_20m: 2.9,
                core_endurance: 180
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // PROGRESSION RATES (% improvement mensile atteso)
    // ═══════════════════════════════════════════════════════════════
    const PROGRESSION_RATES = {
        beginner: {
            strength: 0.08,      // 8% al mese
            endurance: 0.06,
            power: 0.05,
            skill: 0.10
        },
        intermediate: {
            strength: 0.04,
            endurance: 0.03,
            power: 0.025,
            skill: 0.05
        },
        advanced: {
            strength: 0.015,
            endurance: 0.01,
            power: 0.01,
            skill: 0.02
        },
        elite: {
            strength: 0.005,
            endurance: 0.005,
            power: 0.003,
            skill: 0.005
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // FATIGUE MODEL (Banister-based simplified)
    // ═══════════════════════════════════════════════════════════════
    const FATIGUE_MODEL = {
        // Time constants (days)
        fitness_decay: 45,      // Fitness perduta nel tempo
        fatigue_decay: 15,      // Fatica che si dissipa
        
        // Impact multipliers
        high_rpe_fatigue: 1.5,  // RPE 9+ genera più fatica
        deload_recovery: 2.0,   // Deload accelera recovery
        sleep_impact: 0.15,     // Ogni ora sotto 7h = +15% fatigue
        
        // Readiness thresholds
        optimal_readiness: 75,
        warning_readiness: 50,
        critical_readiness: 30
    };

    // ═══════════════════════════════════════════════════════════════
    // STORAGE HELPERS
    // ═══════════════════════════════════════════════════════════════
    function loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    }

    function saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function loadBenchmarks() {
        try {
            const raw = localStorage.getItem(BENCHMARKS_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    }

    function saveBenchmarks(data) {
        localStorage.setItem(BENCHMARKS_KEY, JSON.stringify(data));
    }

    // ═══════════════════════════════════════════════════════════════
    // PERFORMANCE LOGGING
    // ═══════════════════════════════════════════════════════════════
    function logPerformance(athleteId, metric, value, unit = '', notes = '') {
        const data = loadData();
        if (!data[athleteId]) data[athleteId] = { logs: [], predictions: [] };
        
        const entry = {
            id: `perf_${Date.now()}`,
            metric,
            value: Number(value),
            unit,
            notes,
            timestamp: new Date().toISOString()
        };
        
        data[athleteId].logs.push(entry);
        
        // Keep last 500 entries per athlete
        if (data[athleteId].logs.length > 500) {
            data[athleteId].logs = data[athleteId].logs.slice(-500);
        }
        
        saveData(data);
        return entry;
    }

    function getPerformanceLogs(athleteId, metric = null, days = 90) {
        const data = loadData();
        const logs = data[athleteId]?.logs || [];
        
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        
        return logs.filter(log => {
            const logDate = new Date(log.timestamp).getTime();
            const matchesTime = logDate >= cutoff;
            const matchesMetric = !metric || log.metric === metric;
            return matchesTime && matchesMetric;
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // TREND ANALYSIS
    // ═══════════════════════════════════════════════════════════════
    function analyzeTrend(athleteId, metric, days = 90) {
        const logs = getPerformanceLogs(athleteId, metric, days);
        
        if (logs.length < 2) {
            return {
                metric,
                trend: 'insufficient_data',
                dataPoints: logs.length,
                message: 'Servono almeno 2 misurazioni per calcolare il trend'
            };
        }

        // Sort by date
        logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Calculate linear regression
        const n = logs.length;
        const x = logs.map((_, i) => i);
        const y = logs.map(l => l.value);
        
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
        const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        // Calculate R² for confidence
        const yMean = sumY / n;
        const ssTot = y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0);
        const ssRes = y.reduce((acc, yi, i) => acc + Math.pow(yi - (slope * x[i] + intercept), 2), 0);
        const rSquared = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;

        // Determine trend direction
        const firstValue = logs[0].value;
        const lastValue = logs[logs.length - 1].value;
        const percentChange = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;

        let trend = 'stable';
        if (percentChange > 5) trend = 'improving';
        else if (percentChange > 2) trend = 'slightly_improving';
        else if (percentChange < -5) trend = 'declining';
        else if (percentChange < -2) trend = 'slightly_declining';

        return {
            metric,
            trend,
            slope,
            intercept,
            rSquared,
            confidence: rSquared > 0.7 ? 'high' : rSquared > 0.4 ? 'medium' : 'low',
            dataPoints: n,
            firstValue,
            lastValue,
            percentChange: Math.round(percentChange * 10) / 10,
            unit: logs[0]?.unit || '',
            period: `${days} giorni`,
            message: generateTrendMessage(trend, percentChange, metric)
        };
    }

    function generateTrendMessage(trend, percentChange, metric) {
        const metricName = metric.replace(/_/g, ' ');
        const absChange = Math.abs(percentChange).toFixed(1);
        
        switch(trend) {
            case 'improving':
                return `📈 ${metricName}: +${absChange}% - ottimo progresso!`;
            case 'slightly_improving':
                return `↗️ ${metricName}: +${absChange}% - progresso graduale`;
            case 'stable':
                return `➡️ ${metricName}: stabile (±${absChange}%)`;
            case 'slightly_declining':
                return `↘️ ${metricName}: -${absChange}% - leggero calo, monitorare`;
            case 'declining':
                return `📉 ${metricName}: -${absChange}% - attenzione, verificare cause`;
            default:
                return `${metricName}: dati insufficienti`;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // PERFORMANCE PREDICTION
    // ═══════════════════════════════════════════════════════════════
    function predictPerformance(athleteId, metric, weeksAhead = 4, athleteData = {}) {
        const trend = analyzeTrend(athleteId, metric, 90);
        
        if (trend.trend === 'insufficient_data') {
            return {
                metric,
                prediction: null,
                confidence: 'none',
                message: 'Dati insufficienti per previsione'
            };
        }

        const level = athleteData.experience_level || 'intermediate';
        const progressionRate = PROGRESSION_RATES[level] || PROGRESSION_RATES.intermediate;
        
        // Determine metric type
        let metricType = 'strength';
        if (metric.includes('run') || metric.includes('cardio') || metric.includes('yo_yo')) {
            metricType = 'endurance';
        } else if (metric.includes('jump') || metric.includes('power') || metric.includes('sprint')) {
            metricType = 'power';
        }

        const monthlyRate = progressionRate[metricType] || 0.03;
        const weeklyRate = monthlyRate / 4;

        // Project based on trend and expected progression
        const trendProjection = trend.lastValue + (trend.slope * weeksAhead);
        const expectedProgression = trend.lastValue * (1 + weeklyRate * weeksAhead);
        
        // Blend based on confidence in trend
        const blendWeight = trend.rSquared;
        const predictedValue = (trendProjection * blendWeight) + (expectedProgression * (1 - blendWeight));

        // Calculate confidence interval
        const uncertainty = (1 - trend.rSquared) * 0.15; // ±15% at low confidence
        const lowerBound = predictedValue * (1 - uncertainty);
        const upperBound = predictedValue * (1 + uncertainty);

        return {
            metric,
            currentValue: trend.lastValue,
            predictedValue: Math.round(predictedValue * 100) / 100,
            lowerBound: Math.round(lowerBound * 100) / 100,
            upperBound: Math.round(upperBound * 100) / 100,
            weeksAhead,
            confidence: trend.confidence,
            trendBased: Math.round(trendProjection * 100) / 100,
            progressionBased: Math.round(expectedProgression * 100) / 100,
            unit: trend.unit,
            message: `In ${weeksAhead} settimane: ${Math.round(predictedValue * 100) / 100} ${trend.unit} (±${Math.round(uncertainty * 100)}%)`
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // LOAD PREDICTION (1RM estimation)
    // ═══════════════════════════════════════════════════════════════
    function estimateOneRepMax(weight, reps) {
        if (reps <= 0 || weight <= 0) return 0;
        if (reps === 1) return weight;
        
        // Brzycki formula
        return Math.round(weight * (36 / (37 - reps)));
    }

    function predictOptimalLoad(athleteId, exercise, targetReps, athleteData = {}) {
        const logs = getPerformanceLogs(athleteId, `${exercise}_weight`, 60);
        const repsLogs = getPerformanceLogs(athleteId, `${exercise}_reps`, 60);
        
        if (logs.length === 0) {
            return {
                exercise,
                prediction: null,
                message: 'Nessun dato storico per questo esercizio'
            };
        }

        // Find best recent performance
        const recentPerformances = [];
        logs.forEach((weightLog, i) => {
            const repsLog = repsLogs.find(r => 
                Math.abs(new Date(r.timestamp) - new Date(weightLog.timestamp)) < 60000
            );
            if (repsLog) {
                const e1rm = estimateOneRepMax(weightLog.value, repsLog.value);
                recentPerformances.push({
                    weight: weightLog.value,
                    reps: repsLog.value,
                    e1rm,
                    date: weightLog.timestamp
                });
            }
        });

        if (recentPerformances.length === 0) {
            return {
                exercise,
                prediction: null,
                message: 'Dati peso/reps non correlabili'
            };
        }

        // Get best e1RM
        const bestE1rm = Math.max(...recentPerformances.map(p => p.e1rm));
        
        // Calculate load for target reps (inverse Brzycki)
        const targetLoad = bestE1rm * ((37 - targetReps) / 36);
        
        // Apply conservative factor for safety
        const safeLoad = targetLoad * 0.95;

        return {
            exercise,
            estimated1RM: bestE1rm,
            targetReps,
            recommendedLoad: Math.round(safeLoad / 2.5) * 2.5, // Round to nearest 2.5kg
            maxLoad: Math.round(targetLoad / 2.5) * 2.5,
            basedOn: recentPerformances.length + ' performance recenti',
            message: `Per ${targetReps} reps: ${Math.round(safeLoad / 2.5) * 2.5}kg (conservativo) - ${Math.round(targetLoad / 2.5) * 2.5}kg (max)`
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // READINESS/FATIGUE PREDICTION
    // ═══════════════════════════════════════════════════════════════
    function calculateReadiness(athleteId, feedbackAnalysis = {}, telemetry = {}) {
        let readiness = 100;
        const factors = [];

        // RPE impact
        const avgRpe = feedbackAnalysis.rpeTrend?.avgRpe || 7;
        if (avgRpe >= 9) {
            readiness -= 30;
            factors.push({ factor: 'RPE molto alto', impact: -30 });
        } else if (avgRpe >= 8) {
            readiness -= 15;
            factors.push({ factor: 'RPE elevato', impact: -15 });
        } else if (avgRpe <= 6) {
            readiness += 5;
            factors.push({ factor: 'RPE basso', impact: +5 });
        }

        // Pain impact
        const painAreas = feedbackAnalysis.pain?.bodyParts?.length || 0;
        const chronicPain = feedbackAnalysis.pain?.chronicPain?.length || 0;
        if (chronicPain > 0) {
            readiness -= chronicPain * 15;
            factors.push({ factor: `Dolori cronici (${chronicPain})`, impact: -chronicPain * 15 });
        } else if (painAreas > 0) {
            readiness -= painAreas * 8;
            factors.push({ factor: `Dolori (${painAreas})`, impact: -painAreas * 8 });
        }

        // Sleep impact
        const sleepHours = telemetry.sleep_hours || 7;
        if (sleepHours < 6) {
            readiness -= 25;
            factors.push({ factor: `Sonno insufficiente (${sleepHours}h)`, impact: -25 });
        } else if (sleepHours < 7) {
            readiness -= 10;
            factors.push({ factor: `Sonno sotto media (${sleepHours}h)`, impact: -10 });
        } else if (sleepHours >= 8) {
            readiness += 5;
            factors.push({ factor: `Buon sonno (${sleepHours}h)`, impact: +5 });
        }

        // Stress impact
        const stressLevel = telemetry.stress_level || 5;
        if (stressLevel >= 8) {
            readiness -= 20;
            factors.push({ factor: 'Stress alto', impact: -20 });
        } else if (stressLevel >= 6) {
            readiness -= 10;
            factors.push({ factor: 'Stress moderato', impact: -10 });
        }

        // HRV impact (if available)
        if (telemetry.hrv) {
            const hrvBaseline = telemetry.hrv_baseline || 50;
            const hrvDiff = telemetry.hrv - hrvBaseline;
            if (hrvDiff < -10) {
                readiness -= 15;
                factors.push({ factor: 'HRV sotto baseline', impact: -15 });
            } else if (hrvDiff > 5) {
                readiness += 5;
                factors.push({ factor: 'HRV sopra baseline', impact: +5 });
            }
        }

        // Recent workout density
        const completionRate = feedbackAnalysis.completionRate?.rate || 100;
        if (completionRate < 60) {
            readiness -= 10;
            factors.push({ factor: 'Compliance bassa', impact: -10 });
        }

        // Clamp readiness
        readiness = Math.max(0, Math.min(100, readiness));

        // Determine recommendation
        let recommendation = 'normal_training';
        let volumeMultiplier = 1.0;
        let intensityMultiplier = 1.0;

        if (readiness >= FATIGUE_MODEL.optimal_readiness) {
            recommendation = 'push_available';
            intensityMultiplier = 1.05;
        } else if (readiness < FATIGUE_MODEL.critical_readiness) {
            recommendation = 'rest_day';
            volumeMultiplier = 0;
            intensityMultiplier = 0;
        } else if (readiness < FATIGUE_MODEL.warning_readiness) {
            recommendation = 'light_session';
            volumeMultiplier = 0.5;
            intensityMultiplier = 0.7;
        }

        return {
            readiness,
            level: readiness >= 75 ? 'optimal' : readiness >= 50 ? 'moderate' : readiness >= 30 ? 'low' : 'critical',
            factors,
            recommendation,
            volumeMultiplier,
            intensityMultiplier,
            message: getReadinessMessage(readiness, recommendation)
        };
    }

    function getReadinessMessage(readiness, recommendation) {
        switch(recommendation) {
            case 'push_available':
                return `✅ Readiness ${readiness}% - Pronto per sessione intensa`;
            case 'normal_training':
                return `👍 Readiness ${readiness}% - Allenamento normale`;
            case 'light_session':
                return `⚠️ Readiness ${readiness}% - Consigliata sessione leggera`;
            case 'rest_day':
                return `🛑 Readiness ${readiness}% - Riposo consigliato`;
            default:
                return `Readiness: ${readiness}%`;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // GOAL ACHIEVEMENT PREDICTION
    // ═══════════════════════════════════════════════════════════════
    function predictGoalAchievement(athleteId, goal, athleteData = {}) {
        if (!goal || !goal.metric || !goal.target_value) {
            return { prediction: null, message: 'Goal non valido' };
        }

        const trend = analyzeTrend(athleteId, goal.metric, 90);
        const currentValue = goal.current_value || trend.lastValue || 0;
        const targetValue = goal.target_value;
        const remaining = targetValue - currentValue;

        if (remaining <= 0) {
            return {
                goal: goal.description,
                achieved: true,
                message: '🎉 Obiettivo già raggiunto!'
            };
        }

        // Calculate weekly progress rate
        const level = athleteData.experience_level || 'intermediate';
        const progressionRate = PROGRESSION_RATES[level]?.strength || 0.03;
        const weeklyProgress = currentValue * (progressionRate / 4);

        // If we have trend data, blend with actual progress
        let effectiveWeeklyProgress = weeklyProgress;
        if (trend.trend !== 'insufficient_data' && trend.slope > 0) {
            effectiveWeeklyProgress = (weeklyProgress + trend.slope) / 2;
        }

        // Estimate weeks to goal
        const weeksToGoal = effectiveWeeklyProgress > 0 
            ? Math.ceil(remaining / effectiveWeeklyProgress)
            : Infinity;

        // Calculate target date
        const targetDate = goal.deadline ? new Date(goal.deadline) : null;
        const predictedDate = new Date(Date.now() + weeksToGoal * 7 * 24 * 60 * 60 * 1000);
        
        let onTrack = true;
        let daysAhead = 0;
        if (targetDate) {
            daysAhead = Math.round((targetDate - predictedDate) / (24 * 60 * 60 * 1000));
            onTrack = daysAhead >= 0;
        }

        return {
            goal: goal.description,
            currentValue,
            targetValue,
            remaining,
            progressPct: Math.round((currentValue / targetValue) * 100),
            weeksToGoal: weeksToGoal === Infinity ? 'N/A' : weeksToGoal,
            predictedDate: predictedDate.toISOString().split('T')[0],
            targetDate: targetDate?.toISOString().split('T')[0] || null,
            onTrack,
            daysAhead: daysAhead || null,
            weeklyProgress: Math.round(effectiveWeeklyProgress * 100) / 100,
            confidence: trend.confidence || 'low',
            message: generateGoalMessage(onTrack, weeksToGoal, daysAhead, goal.description)
        };
    }

    function generateGoalMessage(onTrack, weeksToGoal, daysAhead, description) {
        if (weeksToGoal === Infinity || weeksToGoal === 'N/A') {
            return `⚠️ ${description}: progresso insufficiente per stimare`;
        }
        
        if (onTrack && daysAhead > 14) {
            return `🚀 ${description}: in anticipo di ${daysAhead} giorni!`;
        } else if (onTrack) {
            return `✅ ${description}: on track, ~${weeksToGoal} settimane`;
        } else {
            return `⚠️ ${description}: in ritardo di ${Math.abs(daysAhead)} giorni, accelerare`;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // BENCHMARK COMPARISON
    // ═══════════════════════════════════════════════════════════════
    function getBenchmarksForAthlete(athleteData) {
        const sport = String(athleteData.sport || 'general').toLowerCase();
        const level = String(athleteData.experience_level || 'intermediate').toLowerCase();
        
        const sportBenchmarks = BENCHMARKS[sport] || BENCHMARKS.general;
        return sportBenchmarks[level] || sportBenchmarks.intermediate || {};
    }

    function compareToBenchmarks(athleteId, athleteData) {
        const benchmarks = getBenchmarksForAthlete(athleteData);
        const comparison = [];

        Object.entries(benchmarks).forEach(([metric, benchmarkValue]) => {
            const logs = getPerformanceLogs(athleteId, metric, 90);
            
            if (logs.length > 0) {
                const latestValue = logs[logs.length - 1].value;
                const percentOfBenchmark = Math.round((latestValue / benchmarkValue) * 100);
                
                let status = 'below';
                if (percentOfBenchmark >= 100) status = 'at_or_above';
                else if (percentOfBenchmark >= 85) status = 'approaching';
                else if (percentOfBenchmark >= 70) status = 'developing';
                
                comparison.push({
                    metric,
                    currentValue: latestValue,
                    benchmark: benchmarkValue,
                    percentOfBenchmark,
                    status,
                    gap: Math.round((benchmarkValue - latestValue) * 100) / 100,
                    unit: logs[0].unit || ''
                });
            }
        });

        // Overall score
        const avgPercent = comparison.length > 0
            ? Math.round(comparison.reduce((sum, c) => sum + c.percentOfBenchmark, 0) / comparison.length)
            : 0;

        return {
            athleteLevel: athleteData.experience_level,
            sport: athleteData.sport,
            metrics: comparison,
            overallScore: avgPercent,
            strengths: comparison.filter(c => c.status === 'at_or_above').map(c => c.metric),
            weaknesses: comparison.filter(c => c.status === 'below').map(c => c.metric),
            message: `Performance globale: ${avgPercent}% del benchmark ${athleteData.experience_level}`
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // ATHLETE BENCHMARKS MANAGEMENT
    // ═══════════════════════════════════════════════════════════════
    function saveAthleteBenchmark(athleteId, metric, value, testDate = null) {
        const data = loadBenchmarks();
        if (!data[athleteId]) data[athleteId] = {};
        
        data[athleteId][metric] = {
            value,
            date: testDate || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        saveBenchmarks(data);
        
        // Also log as performance
        logPerformance(athleteId, metric, value, '', 'Benchmark test');
        
        return data[athleteId][metric];
    }

    function getAthleteBenchmarks(athleteId) {
        const data = loadBenchmarks();
        return data[athleteId] || {};
    }

    // ═══════════════════════════════════════════════════════════════
    // WEEKLY PERFORMANCE SUMMARY
    // ═══════════════════════════════════════════════════════════════
    function generateWeeklySummary(athleteId, athleteData = {}, feedbackAnalysis = {}, telemetry = {}) {
        const readiness = calculateReadiness(athleteId, feedbackAnalysis, telemetry);
        const benchmarkComparison = compareToBenchmarks(athleteId, athleteData);
        
        // Get all logged metrics and their trends
        const data = loadData();
        const logs = data[athleteId]?.logs || [];
        
        const metricsTracked = [...new Set(logs.map(l => l.metric))];
        const trends = metricsTracked.map(m => analyzeTrend(athleteId, m, 30)).filter(t => t.trend !== 'insufficient_data');
        
        const improving = trends.filter(t => t.trend === 'improving' || t.trend === 'slightly_improving');
        const declining = trends.filter(t => t.trend === 'declining' || t.trend === 'slightly_declining');
        const stable = trends.filter(t => t.trend === 'stable');

        return {
            readiness,
            benchmarkComparison,
            trends: {
                total: trends.length,
                improving: improving.map(t => t.metric),
                declining: declining.map(t => t.metric),
                stable: stable.map(t => t.metric)
            },
            highlights: [
                ...improving.slice(0, 2).map(t => `📈 ${t.metric}: +${t.percentChange}%`),
                ...declining.slice(0, 2).map(t => `📉 ${t.metric}: ${t.percentChange}%`)
            ],
            recommendations: generateWeeklyRecommendations(readiness, trends, feedbackAnalysis),
            timestamp: new Date().toISOString()
        };
    }

    function generateWeeklyRecommendations(readiness, trends, feedbackAnalysis) {
        const recs = [];

        // Readiness-based
        if (readiness.recommendation === 'rest_day') {
            recs.push({ priority: 'high', text: 'Giorno di riposo consigliato - recupero prioritario' });
        } else if (readiness.recommendation === 'light_session') {
            recs.push({ priority: 'medium', text: 'Sessione leggera - focus su mobilità e tecnica' });
        }

        // Trend-based
        const declining = trends.filter(t => t.trend === 'declining');
        if (declining.length > 0) {
            recs.push({ 
                priority: 'medium', 
                text: `Attenzione al calo in: ${declining.map(t => t.metric).join(', ')}` 
            });
        }

        // Pain-based (from feedback)
        if (feedbackAnalysis.pain?.chronicPain?.length > 0) {
            recs.push({ 
                priority: 'high', 
                text: `Evitare stress su: ${feedbackAnalysis.pain.chronicPain.join(', ')}` 
            });
        }

        return recs;
    }

    // ═══════════════════════════════════════════════════════════════
    // PROMPT GENERATION FOR AI
    // ═══════════════════════════════════════════════════════════════
    function generatePerformancePredictionPrompt(athleteId, athleteData, feedbackAnalysis = {}, telemetry = {}) {
        const readiness = calculateReadiness(athleteId, feedbackAnalysis, telemetry);
        const summary = generateWeeklySummary(athleteId, athleteData, feedbackAnalysis, telemetry);
        
        const lines = [
            '',
            '📊 PERFORMANCE PREDICTION - ANALISI SETTIMANALE',
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        ];

        // Readiness
        const readinessEmoji = readiness.level === 'optimal' ? '🟢' : 
                               readiness.level === 'moderate' ? '🟡' : 
                               readiness.level === 'low' ? '🟠' : '🔴';
        lines.push(`${readinessEmoji} Readiness: ${readiness.readiness}% (${readiness.level})`);
        lines.push(`   ${readiness.message}`);

        // Volume/Intensity adjustment
        if (readiness.volumeMultiplier !== 1 || readiness.intensityMultiplier !== 1) {
            lines.push(`📉 Aggiustamenti: volume ${Math.round(readiness.volumeMultiplier * 100)}%, intensità ${Math.round(readiness.intensityMultiplier * 100)}%`);
        }

        // Trends
        if (summary.trends.improving.length > 0) {
            lines.push(`📈 In miglioramento: ${summary.trends.improving.slice(0, 3).join(', ')}`);
        }
        if (summary.trends.declining.length > 0) {
            lines.push(`📉 In calo: ${summary.trends.declining.slice(0, 2).join(', ')} - attenzione`);
        }

        // Benchmark position
        if (summary.benchmarkComparison.overallScore > 0) {
            lines.push(`🎯 vs Benchmark: ${summary.benchmarkComparison.overallScore}% del livello ${athleteData.experience_level}`);
        }

        // Key recommendations
        if (summary.recommendations.length > 0) {
            lines.push(`💡 ${summary.recommendations[0].text}`);
        }

        lines.push('');

        return lines.join('\n');
    }

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════
    return {
        VERSION,
        
        // Performance logging
        logPerformance,
        getPerformanceLogs,
        
        // Trend analysis
        analyzeTrend,
        
        // Predictions
        predictPerformance,
        predictOptimalLoad,
        estimateOneRepMax,
        predictGoalAchievement,
        
        // Readiness
        calculateReadiness,
        
        // Benchmarks
        getBenchmarksForAthlete,
        compareToBenchmarks,
        saveAthleteBenchmark,
        getAthleteBenchmarks,
        
        // Summary
        generateWeeklySummary,
        
        // AI integration
        generatePerformancePredictionPrompt,
        
        // Config
        BENCHMARKS,
        PROGRESSION_RATES,
        FATIGUE_MODEL
    };
})();

console.log('📊 PerformancePrediction Engine v' + window.PerformancePrediction.VERSION + ' loaded');
