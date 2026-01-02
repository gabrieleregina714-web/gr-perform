// ═══════════════════════════════════════════════════════════════════════════
// ATLAS MEMORY - Long-Term Learning & Pattern Recognition
// Il "cervello" che ricorda, impara e predice
// ═══════════════════════════════════════════════════════════════════════════

const ATLASMemory = {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📦 STORAGE STRUCTURE
    // ═══════════════════════════════════════════════════════════════════════════
    
    storageKeys: {
        workoutHistory: 'atlas_workout_history',      // Tutti i workout generati
        athleteProgress: 'atlas_athlete_progress',    // Progressi per atleta
        patternSuccess: 'atlas_pattern_success',      // Quali pattern funzionano
        injuryCorrelations: 'atlas_injury_corr',      // Pattern → infortunio
        globalInsights: 'atlas_global_insights'       // Insights aggregati
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 PERSISTENT MEMORY
    // ═══════════════════════════════════════════════════════════════════════════
    
    memory: {
        workouts: [],
        athletes: {},
        patterns: {},
        insights: {}
    },
    
    // Carica memoria da storage
    load() {
        try {
            this.memory.workouts = JSON.parse(localStorage.getItem(this.storageKeys.workoutHistory) || '[]');
            this.memory.athletes = JSON.parse(localStorage.getItem(this.storageKeys.athleteProgress) || '{}');
            this.memory.patterns = JSON.parse(localStorage.getItem(this.storageKeys.patternSuccess) || '{}');
            this.memory.insights = JSON.parse(localStorage.getItem(this.storageKeys.globalInsights) || '{}');
            
            console.log(`📦 ATLAS Memory loaded: ${this.memory.workouts.length} workouts, ${Object.keys(this.memory.athletes).length} athletes`);
        } catch (e) {
            console.error('Failed to load ATLAS memory:', e);
        }
        return this;
    },
    
    // Salva memoria
    save() {
        try {
            localStorage.setItem(this.storageKeys.workoutHistory, JSON.stringify(this.memory.workouts.slice(-500))); // Ultimi 500
            localStorage.setItem(this.storageKeys.athleteProgress, JSON.stringify(this.memory.athletes));
            localStorage.setItem(this.storageKeys.patternSuccess, JSON.stringify(this.memory.patterns));
            localStorage.setItem(this.storageKeys.globalInsights, JSON.stringify(this.memory.insights));
        } catch (e) {
            console.error('Failed to save ATLAS memory:', e);
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📝 RECORDING - Registra ogni workout e outcome
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Registra un nuovo workout
    recordWorkout(workout, profile, metadata = {}) {
        const record = {
            id: `w_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            workout,
            profile: {
                id: profile.id,
                sport: profile.sport,
                level: profile.level,
                age: profile.age,
                injuries: profile.injuries || []
            },
            metadata,
            patterns: this.extractPatterns(workout),
            outcome: null  // Sarà riempito con feedback
        };
        
        this.memory.workouts.push(record);
        this.save();
        
        console.log(`📝 ATLAS: Recorded workout ${record.id}`);
        return record.id;
    },
    
    // Estrai pattern da workout per analisi
    extractPatterns(workout) {
        const exercises = workout.exercises || [];
        
        return {
            totalSets: exercises.reduce((s, e) => s + (parseInt(e.sets) || 0), 0),
            exerciseCount: exercises.length,
            hasWarmup: exercises.some(e => e.type === 'warmup'),
            hasCooldown: exercises.some(e => e.type === 'cooldown'),
            hasPower: exercises.some(e => e.type === 'power' || this.isPowerExercise(e.name)),
            hasHinge: exercises.some(e => this.isHingeExercise(e.name)),
            hasUnilateral: exercises.some(e => this.isUnilateral(e.name)),
            pushCount: exercises.filter(e => this.isPush(e.name)).length,
            pullCount: exercises.filter(e => this.isPull(e.name)).length,
            movementPatterns: this.categorizeMovements(exercises)
        };
    },
    
    // Helper per categorizzazione
    isPowerExercise(name) {
        return /jump|plyo|explosive|power|snatch|clean/i.test(name);
    },
    
    isHingeExercise(name) {
        return /deadlift|rdl|hip.*hinge|good.*morning|nordic|glute.*bridge/i.test(name);
    },
    
    isUnilateral(name) {
        return /single|unilateral|one.*leg|one.*arm|split|lunge|step/i.test(name);
    },
    
    isPush(name) {
        return /push|press|bench|dip|fly/i.test(name);
    },
    
    isPull(name) {
        return /pull|row|lat|chin|curl/i.test(name);
    },
    
    categorizeMovements(exercises) {
        const categories = {
            squat: 0, hinge: 0, push: 0, pull: 0, 
            core: 0, carry: 0, power: 0, conditioning: 0
        };
        
        exercises.forEach(e => {
            const name = (e.name || '').toLowerCase();
            if (/squat|leg.*press|lunge/i.test(name)) categories.squat++;
            if (/deadlift|rdl|hinge|bridge/i.test(name)) categories.hinge++;
            if (/push|press|bench|dip/i.test(name)) categories.push++;
            if (/pull|row|lat|chin/i.test(name)) categories.pull++;
            if (/core|plank|crunch|twist|pallof/i.test(name)) categories.core++;
            if (/carry|walk|farmer/i.test(name)) categories.carry++;
            if (/jump|throw|plyo|explosive/i.test(name)) categories.power++;
            if (/run|bike|row|hiit|circuit/i.test(name)) categories.conditioning++;
        });
        
        return categories;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ✅ FEEDBACK - Registra outcome
    // ═══════════════════════════════════════════════════════════════════════════
    
    recordFeedback(workoutId, feedback) {
        // feedback: { rpe, enjoyment, soreness, injury, performance, notes }
        
        const workout = this.memory.workouts.find(w => w.id === workoutId);
        if (!workout) {
            console.warn(`ATLAS: Workout ${workoutId} not found`);
            return;
        }
        
        workout.outcome = {
            ...feedback,
            recordedAt: new Date().toISOString()
        };
        
        // Update athlete progress
        this.updateAthleteProgress(workout.profile.id, workout);
        
        // Analyze pattern success
        this.analyzePatternSuccess(workout);
        
        // Check for injury correlation
        if (feedback.injury) {
            this.recordInjuryCorrelation(workout);
        }
        
        this.save();
        
        // Trigger learning
        this.learn();
    },
    
    updateAthleteProgress(athleteId, workout) {
        if (!this.memory.athletes[athleteId]) {
            this.memory.athletes[athleteId] = {
                workoutCount: 0,
                totalVolume: 0,
                avgRPE: 0,
                prs: [],
                injuries: [],
                preferredPatterns: {}
            };
        }
        
        const athlete = this.memory.athletes[athleteId];
        athlete.workoutCount++;
        athlete.totalVolume += workout.patterns.totalSets;
        
        if (workout.outcome?.rpe) {
            athlete.avgRPE = (athlete.avgRPE * (athlete.workoutCount - 1) + workout.outcome.rpe) / athlete.workoutCount;
        }
        
        // Track preferred patterns
        Object.entries(workout.patterns.movementPatterns).forEach(([pattern, count]) => {
            if (count > 0) {
                athlete.preferredPatterns[pattern] = (athlete.preferredPatterns[pattern] || 0) + count;
            }
        });
    },
    
    analyzePatternSuccess(workout) {
        const outcome = workout.outcome;
        const patterns = workout.patterns;
        
        // Score basato su outcome
        const successScore = this.calculateSuccessScore(outcome);
        
        // Registra successo per ogni pattern
        Object.entries(patterns.movementPatterns).forEach(([pattern, count]) => {
            if (count > 0) {
                if (!this.memory.patterns[pattern]) {
                    this.memory.patterns[pattern] = { uses: 0, totalSuccess: 0 };
                }
                this.memory.patterns[pattern].uses++;
                this.memory.patterns[pattern].totalSuccess += successScore;
            }
        });
    },
    
    calculateSuccessScore(outcome) {
        if (!outcome) return 0.5;
        
        let score = 0.5; // Base
        
        // RPE appropriato (6-8 è ideale)
        if (outcome.rpe >= 6 && outcome.rpe <= 8) score += 0.2;
        else if (outcome.rpe > 9) score -= 0.1;
        
        // Enjoyment
        if (outcome.enjoyment >= 4) score += 0.1;
        
        // No injury
        if (!outcome.injury) score += 0.2;
        else score -= 0.5;
        
        // Performance improvement
        if (outcome.performance === 'improved') score += 0.2;
        
        return Math.max(0, Math.min(1, score));
    },
    
    recordInjuryCorrelation(workout) {
        const key = this.storageKeys.injuryCorrelations;
        const correlations = JSON.parse(localStorage.getItem(key) || '[]');
        
        correlations.push({
            date: new Date().toISOString(),
            sport: workout.profile.sport,
            level: workout.profile.level,
            exercises: workout.workout.exercises?.map(e => e.name),
            patterns: workout.patterns,
            previousInjuries: workout.profile.injuries,
            injury: workout.outcome.injury
        });
        
        localStorage.setItem(key, JSON.stringify(correlations.slice(-100)));
        
        console.warn('⚠️ ATLAS: Injury recorded and correlated for future prevention');
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧠 LEARNING - Analizza dati e genera insights
    // ═══════════════════════════════════════════════════════════════════════════
    
    learn() {
        const workouts = this.memory.workouts.filter(w => w.outcome);
        
        if (workouts.length < 10) {
            console.log('📚 ATLAS: Need more data to learn (min 10 workouts with feedback)');
            return;
        }
        
        const insights = {
            learnedAt: new Date().toISOString(),
            dataPoints: workouts.length,
            
            // Insight 1: Volume ottimale per livello
            optimalVolume: this.learnOptimalVolume(workouts),
            
            // Insight 2: Pattern più efficaci
            effectivePatterns: this.learnEffectivePatterns(workouts),
            
            // Insight 3: Pattern da evitare
            riskPatterns: this.learnRiskPatterns(workouts),
            
            // Insight 4: Correlazioni sport-specifiche
            sportSpecific: this.learnSportSpecific(workouts)
        };
        
        this.memory.insights = insights;
        this.save();
        
        console.log('🧠 ATLAS LEARNING COMPLETE:', insights);
        return insights;
    },
    
    learnOptimalVolume(workouts) {
        const byLevel = { principiante: [], intermedio: [], avanzato: [], elite: [] };
        
        workouts.forEach(w => {
            const level = w.profile.level || 'intermedio';
            if (byLevel[level]) {
                byLevel[level].push({
                    volume: w.patterns.totalSets,
                    success: this.calculateSuccessScore(w.outcome)
                });
            }
        });
        
        const optimalByLevel = {};
        
        Object.entries(byLevel).forEach(([level, data]) => {
            if (data.length < 3) return;
            
            // Trova volume con success più alto
            const sorted = [...data].sort((a, b) => b.success - a.success);
            const topQuartile = sorted.slice(0, Math.ceil(sorted.length / 4));
            
            if (topQuartile.length > 0) {
                const avgVolume = topQuartile.reduce((s, d) => s + d.volume, 0) / topQuartile.length;
                optimalByLevel[level] = Math.round(avgVolume);
            }
        });
        
        return optimalByLevel;
    },
    
    learnEffectivePatterns(workouts) {
        const patternStats = {};
        
        workouts.forEach(w => {
            Object.entries(w.patterns.movementPatterns).forEach(([pattern, count]) => {
                if (count > 0) {
                    if (!patternStats[pattern]) {
                        patternStats[pattern] = { count: 0, totalSuccess: 0 };
                    }
                    patternStats[pattern].count++;
                    patternStats[pattern].totalSuccess += this.calculateSuccessScore(w.outcome);
                }
            });
        });
        
        // Calcola avg success per pattern
        const effectiveness = Object.entries(patternStats)
            .map(([pattern, stats]) => ({
                pattern,
                avgSuccess: stats.totalSuccess / stats.count,
                uses: stats.count
            }))
            .filter(p => p.uses >= 5) // Min 5 uses
            .sort((a, b) => b.avgSuccess - a.avgSuccess);
        
        return effectiveness;
    },
    
    learnRiskPatterns(workouts) {
        // Trova pattern correlati a injury o RPE troppo alto
        const injuries = workouts.filter(w => w.outcome?.injury);
        const highRPE = workouts.filter(w => w.outcome?.rpe >= 9);
        
        const riskPatterns = [];
        
        // Analizza pattern in workouts con injury
        injuries.forEach(w => {
            riskPatterns.push({
                type: 'injury',
                patterns: w.patterns.movementPatterns,
                sport: w.profile.sport,
                level: w.profile.level
            });
        });
        
        return riskPatterns;
    },
    
    learnSportSpecific(workouts) {
        const bySport = {};
        
        workouts.forEach(w => {
            const sport = w.profile.sport;
            if (!bySport[sport]) {
                bySport[sport] = { workouts: 0, avgSuccess: 0, topPatterns: {} };
            }
            
            bySport[sport].workouts++;
            bySport[sport].avgSuccess += this.calculateSuccessScore(w.outcome);
            
            Object.entries(w.patterns.movementPatterns).forEach(([pattern, count]) => {
                if (count > 0) {
                    bySport[sport].topPatterns[pattern] = (bySport[sport].topPatterns[pattern] || 0) + 1;
                }
            });
        });
        
        // Normalize avgSuccess
        Object.values(bySport).forEach(s => {
            s.avgSuccess = s.avgSuccess / s.workouts;
        });
        
        return bySport;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔮 RECOMMENDATIONS - Usa insights per guidare AI
    // ═══════════════════════════════════════════════════════════════════════════
    
    getRecommendations(profile) {
        const insights = this.memory.insights;
        const recommendations = [];
        
        // Volume raccomandato
        if (insights.optimalVolume?.[profile.level]) {
            recommendations.push({
                type: 'volume',
                value: insights.optimalVolume[profile.level],
                message: `Volume ottimale per ${profile.level}: ${insights.optimalVolume[profile.level]} sets`
            });
        }
        
        // Pattern efficaci
        if (insights.effectivePatterns?.length) {
            const topPatterns = insights.effectivePatterns.slice(0, 3).map(p => p.pattern);
            recommendations.push({
                type: 'patterns',
                value: topPatterns,
                message: `Pattern più efficaci: ${topPatterns.join(', ')}`
            });
        }
        
        // Pattern da evitare (se athlete ha storia di injury)
        if (profile.injuries?.length && insights.riskPatterns?.length) {
            recommendations.push({
                type: 'avoid',
                value: insights.riskPatterns,
                message: 'Evita pattern correlati a infortuni passati'
            });
        }
        
        // Sport-specific
        if (insights.sportSpecific?.[profile.sport]) {
            const sportData = insights.sportSpecific[profile.sport];
            const topPatterns = Object.entries(sportData.topPatterns)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([p]) => p);
            
            recommendations.push({
                type: 'sport',
                value: topPatterns,
                message: `Top patterns per ${profile.sport}: ${topPatterns.join(', ')}`
            });
        }
        
        return recommendations;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 STATS - Statistiche sistema
    // ═══════════════════════════════════════════════════════════════════════════
    
    getStats() {
        return {
            totalWorkouts: this.memory.workouts.length,
            workoutsWithFeedback: this.memory.workouts.filter(w => w.outcome).length,
            athletes: Object.keys(this.memory.athletes).length,
            patternsTracked: Object.keys(this.memory.patterns).length,
            hasInsights: Object.keys(this.memory.insights).length > 0,
            lastLearning: this.memory.insights.learnedAt || 'never'
        };
    }
};

// Auto-init
ATLASMemory.load();

window.ATLASMemory = ATLASMemory;
console.log('📦 ATLAS Memory loaded - Long-term learning system ready');
console.log('   → ATLASMemory.recordWorkout(workout, profile) - Record workout');
console.log('   → ATLASMemory.recordFeedback(workoutId, feedback) - Record outcome');
console.log('   → ATLASMemory.getRecommendations(profile) - Get AI recommendations');
console.log('   → ATLASMemory.learn() - Trigger learning');
console.log('   → ATLASMemory.getStats() - Get system stats');
