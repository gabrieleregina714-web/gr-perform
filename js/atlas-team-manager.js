/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 👥 ATLAS TEAM MANAGER v1.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Sistema per gestire team di atleti con:
 * - Dashboard aggregata
 * - Comparazioni tra atleti
 * - Scheduling intelligente di gruppo
 * - Analytics di team
 * - Workload monitoring multi-atleta
 */

window.ATLASTeamManager = {
    
    VERSION: '1.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // TEAM OVERVIEW
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Generate team dashboard summary
     */
    generateTeamDashboard(athletes) {
        const now = new Date();
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        
        // Calculate aggregate stats
        const dashboard = {
            totalAthletes: athletes.length,
            activeThisWeek: 0,
            avgReadiness: 0,
            avgAdherence: 0,
            atRisk: [],
            needsAttention: [],
            topPerformers: [],
            workloadDistribution: {
                overreaching: 0,
                optimal: 0,
                undertraining: 0,
                resting: 0
            }
        };
        
        let readinessSum = 0;
        let adherenceSum = 0;
        let readinessCount = 0;
        
        for (const athlete of athletes) {
            // Check activity
            if (athlete.lastWorkout && new Date(athlete.lastWorkout) > weekAgo) {
                dashboard.activeThisWeek++;
            }
            
            // Aggregate readiness
            if (athlete.readiness) {
                readinessSum += athlete.readiness;
                readinessCount++;
            }
            
            // Aggregate adherence
            if (athlete.adherence !== undefined) {
                adherenceSum += athlete.adherence;
            }
            
            // Categorize workload
            const workload = this.categorizeWorkload(athlete);
            dashboard.workloadDistribution[workload.category]++;
            
            // Flag at-risk athletes
            if (athlete.readiness && athlete.readiness < 40) {
                dashboard.atRisk.push({
                    id: athlete.id,
                    name: athlete.name,
                    reason: 'Low readiness score',
                    readiness: athlete.readiness
                });
            }
            
            // Flag athletes needing attention
            if (athlete.adherence && athlete.adherence < 60) {
                dashboard.needsAttention.push({
                    id: athlete.id,
                    name: athlete.name,
                    reason: 'Low adherence',
                    adherence: athlete.adherence
                });
            }
            
            if (athlete.daysSinceLastWorkout && athlete.daysSinceLastWorkout > 7) {
                dashboard.needsAttention.push({
                    id: athlete.id,
                    name: athlete.name,
                    reason: 'Inactive',
                    daysSinceLastWorkout: athlete.daysSinceLastWorkout
                });
            }
        }
        
        // Calculate averages
        dashboard.avgReadiness = readinessCount > 0 ? Math.round(readinessSum / readinessCount) : null;
        dashboard.avgAdherence = athletes.length > 0 ? Math.round(adherenceSum / athletes.length) : null;
        
        // Find top performers (by progression)
        dashboard.topPerformers = athletes
            .filter(a => a.progressionRate)
            .sort((a, b) => b.progressionRate - a.progressionRate)
            .slice(0, 5)
            .map(a => ({
                id: a.id,
                name: a.name,
                progressionRate: a.progressionRate
            }));
        
        return dashboard;
    },
    
    /**
     * Categorize athlete workload status
     */
    categorizeWorkload(athlete) {
        const { weeklyTSS, avgWeeklyTSS, acuteLoad, chronicLoad } = athlete;
        
        // Calculate ACWR (Acute:Chronic Workload Ratio)
        if (acuteLoad && chronicLoad && chronicLoad > 0) {
            const acwr = acuteLoad / chronicLoad;
            
            if (acwr > 1.5) {
                return { category: 'overreaching', acwr, risk: 'high' };
            } else if (acwr >= 0.8 && acwr <= 1.3) {
                return { category: 'optimal', acwr, risk: 'low' };
            } else if (acwr < 0.8 && acwr > 0) {
                return { category: 'undertraining', acwr, risk: 'medium' };
            }
        }
        
        // Fallback to simple week comparison
        if (weeklyTSS && avgWeeklyTSS) {
            const ratio = weeklyTSS / avgWeeklyTSS;
            
            if (ratio > 1.4) return { category: 'overreaching', ratio, risk: 'high' };
            if (ratio < 0.6) return { category: 'undertraining', ratio, risk: 'medium' };
            return { category: 'optimal', ratio, risk: 'low' };
        }
        
        return { category: 'resting', risk: 'low' };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ATHLETE COMPARISON
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Compare multiple athletes across metrics
     */
    compareAthletes(athletes, metrics = ['strength', 'endurance', 'recovery', 'consistency']) {
        const comparison = {
            athletes: athletes.map(a => ({ id: a.id, name: a.name })),
            metrics: {},
            rankings: {}
        };
        
        for (const metric of metrics) {
            comparison.metrics[metric] = athletes.map(a => ({
                id: a.id,
                value: this.getMetricValue(a, metric),
                normalized: 0  // Will be filled
            }));
            
            // Normalize to 0-100 scale
            const values = comparison.metrics[metric].map(m => m.value).filter(v => v !== null);
            const min = Math.min(...values);
            const max = Math.max(...values);
            const range = max - min || 1;
            
            for (const m of comparison.metrics[metric]) {
                if (m.value !== null) {
                    m.normalized = Math.round(((m.value - min) / range) * 100);
                }
            }
            
            // Generate ranking
            comparison.rankings[metric] = [...comparison.metrics[metric]]
                .sort((a, b) => b.value - a.value)
                .map((m, i) => ({ ...m, rank: i + 1 }));
        }
        
        // Calculate overall score
        comparison.overallScores = athletes.map(a => {
            const scores = metrics.map(m => {
                const metric = comparison.metrics[m].find(x => x.id === a.id);
                return metric?.normalized || 0;
            });
            
            return {
                id: a.id,
                name: a.name,
                overallScore: Math.round(scores.reduce((sum, s) => sum + s, 0) / metrics.length)
            };
        }).sort((a, b) => b.overallScore - a.overallScore);
        
        return comparison;
    },
    
    /**
     * Get specific metric value from athlete
     */
    getMetricValue(athlete, metric) {
        switch (metric) {
            case 'strength':
                return athlete.strengthRatio || athlete.totalPR || null;
            case 'endurance':
                return athlete.vo2max || athlete.enduranceScore || null;
            case 'recovery':
                return athlete.avgHRV || athlete.recoveryScore || null;
            case 'consistency':
                return athlete.adherence || athlete.workoutFrequency || null;
            case 'progression':
                return athlete.progressionRate || null;
            case 'readiness':
                return athlete.readiness || null;
            default:
                return athlete[metric] || null;
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // GROUP SCHEDULING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Generate group training sessions based on availability and needs
     */
    generateGroupSchedule(athletes, options = {}) {
        const {
            daysAhead = 7,
            preferredTimes = ['09:00', '18:00'],
            maxGroupSize = 8,
            groupByLevel = true
        } = options;
        
        const schedule = [];
        
        // Group athletes by level if requested
        let groups;
        if (groupByLevel) {
            groups = this.groupByTrainingLevel(athletes);
        } else {
            groups = [{ name: 'All Athletes', athletes }];
        }
        
        // Generate sessions for each day
        for (let day = 0; day < daysAhead; day++) {
            const date = new Date(Date.now() + day * 24 * 60 * 60 * 1000);
            const dayName = date.toLocaleDateString('it-IT', { weekday: 'long' });
            
            for (const group of groups) {
                // Check availability (placeholder - would need real availability data)
                const available = group.athletes.filter(a => 
                    !a.unavailableDays?.includes(dayName) && 
                    (!a.readiness || a.readiness > 30)
                );
                
                if (available.length > 0) {
                    for (const time of preferredTimes) {
                        // Split into smaller groups if needed
                        const subgroups = this.chunkArray(available, maxGroupSize);
                        
                        for (let i = 0; i < subgroups.length; i++) {
                            const subgroup = subgroups[i];
                            
                            // Determine session type based on group needs
                            const sessionType = this.determineGroupSessionType(subgroup);
                            
                            schedule.push({
                                date: date.toISOString().split('T')[0],
                                time,
                                group: group.name + (subgroups.length > 1 ? ` (${i + 1})` : ''),
                                athletes: subgroup.map(a => ({ id: a.id, name: a.name })),
                                sessionType,
                                estimatedDuration: this.estimateSessionDuration(sessionType, subgroup.length)
                            });
                        }
                    }
                }
            }
        }
        
        return schedule;
    },
    
    /**
     * Group athletes by training level
     */
    groupByTrainingLevel(athletes) {
        const groups = {
            beginner: [],
            intermediate: [],
            advanced: []
        };
        
        for (const athlete of athletes) {
            const level = this.determineLevel(athlete);
            groups[level].push(athlete);
        }
        
        return Object.entries(groups)
            .filter(([, athletes]) => athletes.length > 0)
            .map(([name, athletes]) => ({ 
                name: name.charAt(0).toUpperCase() + name.slice(1), 
                athletes 
            }));
    },
    
    /**
     * Determine athlete's training level
     */
    determineLevel(athlete) {
        const trainingAge = athlete.trainingAge || 0;
        
        if (trainingAge < 1) return 'beginner';
        if (trainingAge < 3) return 'intermediate';
        return 'advanced';
    },
    
    /**
     * Determine best session type for a group
     */
    determineGroupSessionType(athletes) {
        // Count focus areas needed
        const needs = {
            strength: 0,
            hypertrophy: 0,
            conditioning: 0,
            recovery: 0
        };
        
        for (const athlete of athletes) {
            if (athlete.currentPhase) {
                needs[athlete.currentPhase] = (needs[athlete.currentPhase] || 0) + 1;
            }
            
            if (athlete.readiness && athlete.readiness < 60) {
                needs.recovery++;
            }
        }
        
        // Return most common need
        return Object.entries(needs)
            .sort((a, b) => b[1] - a[1])[0][0];
    },
    
    /**
     * Estimate session duration
     */
    estimateSessionDuration(type, groupSize) {
        const baseDurations = {
            strength: 75,
            hypertrophy: 60,
            conditioning: 45,
            recovery: 40
        };
        
        // Add time for larger groups
        const groupOverhead = Math.ceil(groupSize / 4) * 10;
        
        return (baseDurations[type] || 60) + groupOverhead;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // TEAM ANALYTICS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Generate team analytics report
     */
    generateTeamReport(athletes, period = 30) {
        const report = {
            period: `Last ${period} days`,
            generatedAt: new Date().toISOString(),
            summary: {},
            trends: {},
            highlights: [],
            concerns: []
        };
        
        // Aggregate metrics
        const metrics = {
            totalWorkouts: 0,
            avgWorkoutsPerAthlete: 0,
            avgAdherence: 0,
            avgReadiness: 0,
            totalVolumeKg: 0,
            injuryCount: 0
        };
        
        for (const athlete of athletes) {
            metrics.totalWorkouts += athlete.workoutsInPeriod || 0;
            metrics.avgAdherence += athlete.adherence || 0;
            metrics.avgReadiness += athlete.readiness || 0;
            metrics.totalVolumeKg += athlete.totalVolume || 0;
            if (athlete.hasInjury) metrics.injuryCount++;
        }
        
        const n = athletes.length || 1;
        report.summary = {
            totalAthletes: n,
            totalWorkouts: metrics.totalWorkouts,
            avgWorkoutsPerAthlete: Math.round(metrics.totalWorkouts / n * 10) / 10,
            avgAdherence: Math.round(metrics.avgAdherence / n),
            avgReadiness: Math.round(metrics.avgReadiness / n),
            totalVolumeKg: Math.round(metrics.totalVolumeKg),
            injuryRate: Math.round((metrics.injuryCount / n) * 100)
        };
        
        // Identify highlights
        const topProgressors = athletes
            .filter(a => a.progressionRate && a.progressionRate > 0)
            .sort((a, b) => b.progressionRate - a.progressionRate)
            .slice(0, 3);
        
        for (const athlete of topProgressors) {
            report.highlights.push({
                type: 'progression',
                athlete: athlete.name,
                message: `${athlete.name} achieved ${athlete.progressionRate}% improvement`
            });
        }
        
        // Identify concerns
        for (const athlete of athletes) {
            if (athlete.adherence && athlete.adherence < 50) {
                report.concerns.push({
                    type: 'adherence',
                    athlete: athlete.name,
                    message: `${athlete.name} has low adherence (${athlete.adherence}%)`,
                    severity: 'high'
                });
            }
            
            if (athlete.readiness && athlete.readiness < 30) {
                report.concerns.push({
                    type: 'recovery',
                    athlete: athlete.name,
                    message: `${athlete.name} has critically low readiness`,
                    severity: 'high'
                });
            }
            
            if (athlete.daysSinceLastWorkout && athlete.daysSinceLastWorkout > 14) {
                report.concerns.push({
                    type: 'inactivity',
                    athlete: athlete.name,
                    message: `${athlete.name} hasn't trained in ${athlete.daysSinceLastWorkout} days`,
                    severity: 'medium'
                });
            }
        }
        
        return report;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Split array into chunks
     */
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
};

console.log('👥 ATLAS Team Manager v1.0 loaded!');
console.log('   → ATLASTeamManager.generateTeamDashboard(athletes)');
console.log('   → ATLASTeamManager.compareAthletes(athletes, metrics)');
console.log('   → ATLASTeamManager.generateGroupSchedule(athletes, options)');
console.log('   → ATLASTeamManager.generateTeamReport(athletes, days)');
