// ═══════════════════════════════════════════════════════════════════════════
// ATLAS TEMPORAL - Long-Term Program Intelligence
// Valuta la PROGRAMMAZIONE, non solo la singola sessione
// Microciclo → Mesociclo → Macrociclo → Career
// ═══════════════════════════════════════════════════════════════════════════

const ATLASTemporal = {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🗓️ TIMEFRAMES - Definizioni temporali
    // ═══════════════════════════════════════════════════════════════════════════
    
    timeframes: {
        session: { days: 1, description: 'Singola sessione' },
        microcycle: { days: 7, description: 'Settimana di allenamento' },
        mesocycle: { days: 28, description: 'Blocco di 4 settimane' },
        macrocycle: { days: 84, description: 'Trimestre (12 settimane)' },
        annual: { days: 365, description: 'Piano annuale' }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📈 PERIODIZATION PATTERNS
    // ═══════════════════════════════════════════════════════════════════════════
    
    periodizationModels: {
        
        linear: {
            name: 'Periodizzazione Lineare',
            description: 'Volume ↓ Intensità ↑ nel tempo',
            suitable: ['principiante', 'intermedio'],
            phases: [
                { name: 'Anatomical Adaptation', weeks: 4, volume: 'high', intensity: 'low' },
                { name: 'Hypertrophy', weeks: 4, volume: 'high', intensity: 'medium' },
                { name: 'Strength', weeks: 4, volume: 'medium', intensity: 'high' },
                { name: 'Power', weeks: 2, volume: 'low', intensity: 'max' },
                { name: 'Peaking', weeks: 1, volume: 'very_low', intensity: 'max' },
                { name: 'Deload', weeks: 1, volume: 'low', intensity: 'low' }
            ]
        },
        
        undulating: {
            name: 'Periodizzazione Ondulata',
            description: 'Varia volume/intensità OGNI sessione',
            suitable: ['intermedio', 'avanzato'],
            weekPattern: [
                { day: 1, focus: 'power', reps: '3-5', intensity: 'high' },
                { day: 2, focus: 'hypertrophy', reps: '8-12', intensity: 'medium' },
                { day: 3, focus: 'strength', reps: '5-8', intensity: 'high' },
                { day: 4, focus: 'endurance', reps: '15-20', intensity: 'low' }
            ]
        },
        
        block: {
            name: 'Periodizzazione a Blocchi',
            description: 'Focus concentrato per 2-4 settimane',
            suitable: ['avanzato', 'elite'],
            blocks: [
                { name: 'Accumulation', weeks: 4, focus: 'volume', sets: '20-30/session' },
                { name: 'Transmutation', weeks: 3, focus: 'intensity', sets: '15-20/session' },
                { name: 'Realization', weeks: 2, focus: 'peaking', sets: '8-15/session' }
            ]
        },
        
        conjugate: {
            name: 'Metodo Coniugato',
            description: 'Max Effort + Dynamic Effort + Repeated Effort',
            suitable: ['avanzato', 'elite'],
            weekPattern: [
                { day: 1, type: 'max_effort_upper', focus: 'max strength' },
                { day: 2, type: 'dynamic_effort_lower', focus: 'speed-strength' },
                { day: 3, type: 'max_effort_lower', focus: 'max strength' },
                { day: 4, type: 'dynamic_effort_upper', focus: 'speed-strength' }
            ]
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔍 ANALYSIS - Analizza programmazione
    // ═══════════════════════════════════════════════════════════════════════════
    
    analyzeMicrocycle(sessions) {
        // Analizza 1 settimana
        if (!sessions || sessions.length === 0) {
            return { error: 'No sessions to analyze' };
        }
        
        const analysis = {
            timeframe: 'microcycle',
            sessionCount: sessions.length,
            
            // Volume totale
            totalVolume: sessions.reduce((sum, s) => 
                sum + (s.exercises || []).reduce((eSum, e) => eSum + (parseInt(e.sets) || 0), 0), 0
            ),
            
            // Distribuzione pattern
            patternDistribution: this.analyzePatternDistribution(sessions),
            
            // Frequenza muscolare
            muscleFrequency: this.analyzeMuscleFrequency(sessions),
            
            // Recovery check
            recoveryAdequate: this.checkRecoveryWindows(sessions),
            
            // Variety score
            varietyScore: this.calculateVariety(sessions),
            
            // Recommendations
            recommendations: []
        };
        
        // Generate recommendations
        this.generateMicrocycleRecommendations(analysis);
        
        return analysis;
    },
    
    analyzeMesocycle(sessions) {
        // Analizza 4 settimane
        if (!sessions || sessions.length < 4) {
            return { error: 'Need at least 4 sessions for mesocycle analysis' };
        }
        
        // Divide in settimane
        const weeks = this.splitIntoWeeks(sessions);
        
        const analysis = {
            timeframe: 'mesocycle',
            weekCount: weeks.length,
            sessionCount: sessions.length,
            
            // Volume progression
            volumeProgression: weeks.map(w => ({
                totalSets: w.reduce((sum, s) => 
                    sum + (s.exercises || []).reduce((eSum, e) => eSum + (parseInt(e.sets) || 0), 0), 0
                ),
                avgSets: 0
            })),
            
            // Intensity progression (proxy: avg rep range)
            intensityProgression: weeks.map(w => this.estimateIntensity(w)),
            
            // Periodization detection
            detectedPeriodization: this.detectPeriodization(weeks),
            
            // All patterns covered?
            patternCoverage: this.analyzePatternCoverage(sessions),
            
            // Deload present?
            hasDeload: this.detectDeload(weeks),
            
            recommendations: []
        };
        
        // Calculate avg
        analysis.volumeProgression.forEach(w => {
            w.avgSets = w.totalSets; // Simplified
        });
        
        this.generateMesocycleRecommendations(analysis);
        
        return analysis;
    },
    
    analyzeMacrocycle(sessions, goals) {
        // Analizza 12+ settimane
        const mesocycles = this.splitIntoMesocycles(sessions);
        
        return {
            timeframe: 'macrocycle',
            mesocycleCount: mesocycles.length,
            totalSessions: sessions.length,
            
            // Phase progression
            phases: mesocycles.map((m, i) => ({
                mesocycle: i + 1,
                avgVolume: this.calculateAvgVolume(m),
                avgIntensity: this.estimateIntensity(m),
                focus: this.detectFocus(m)
            })),
            
            // Goal alignment
            goalAlignment: this.analyzeGoalAlignment(sessions, goals),
            
            // Overtraining risk
            overtrainingRisk: this.assessOvertrainingRisk(sessions),
            
            // Predicted adaptation
            predictedAdaptation: this.predictAdaptation(sessions, goals)
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 HELPER METHODS
    // ═══════════════════════════════════════════════════════════════════════════
    
    analyzePatternDistribution(sessions) {
        const patterns = {
            squat: 0, hinge: 0, push: 0, pull: 0,
            core: 0, carry: 0, power: 0, conditioning: 0
        };
        
        sessions.forEach(s => {
            (s.exercises || []).forEach(e => {
                const name = (e.name || '').toLowerCase();
                if (/squat|leg.*press|lunge/i.test(name)) patterns.squat++;
                else if (/deadlift|rdl|hinge|bridge|nordic/i.test(name)) patterns.hinge++;
                else if (/push|press|bench|dip/i.test(name)) patterns.push++;
                else if (/pull|row|lat|chin/i.test(name)) patterns.pull++;
                else if (/core|plank|crunch|twist|pallof/i.test(name)) patterns.core++;
                else if (/carry|walk|farmer/i.test(name)) patterns.carry++;
                else if (/jump|throw|plyo|explosive/i.test(name)) patterns.power++;
                else if (/run|bike|hiit|circuit/i.test(name)) patterns.conditioning++;
            });
        });
        
        return patterns;
    },
    
    analyzeMuscleFrequency(sessions) {
        // Conta quante volte ogni gruppo è allenato
        const frequency = {
            chest: 0, back: 0, shoulders: 0,
            biceps: 0, triceps: 0,
            quadriceps: 0, hamstrings: 0, glutes: 0, calves: 0,
            core: 0
        };
        
        sessions.forEach(s => {
            const musclesHit = new Set();
            
            (s.exercises || []).forEach(e => {
                const name = (e.name || '').toLowerCase();
                
                if (/bench|push.*up|fly|chest/i.test(name)) musclesHit.add('chest');
                if (/row|pull|lat|chin|back/i.test(name)) musclesHit.add('back');
                if (/press|lateral|shoulder|delt/i.test(name)) musclesHit.add('shoulders');
                if (/curl|bicep/i.test(name)) musclesHit.add('biceps');
                if (/extension|tricep|dip/i.test(name)) musclesHit.add('triceps');
                if (/squat|leg.*press|lunge|quad/i.test(name)) musclesHit.add('quadriceps');
                if (/deadlift|rdl|curl|nordic|hamstring/i.test(name)) musclesHit.add('hamstrings');
                if (/glute|bridge|hip.*thrust/i.test(name)) musclesHit.add('glutes');
                if (/calf|raise/i.test(name)) musclesHit.add('calves');
                if (/core|plank|crunch|twist/i.test(name)) musclesHit.add('core');
            });
            
            musclesHit.forEach(m => frequency[m]++);
        });
        
        return frequency;
    },
    
    checkRecoveryWindows(sessions) {
        // Verifica che lo stesso gruppo non sia allenato troppo ravvicinato
        // Simplified: assume sessions sono in ordine cronologico
        // Idealmente: 48-72h tra sessioni same muscle
        return { adequate: true, note: 'Need timestamp data for accurate check' };
    },
    
    calculateVariety(sessions) {
        // Quanti esercizi DIVERSI sono usati?
        const allExercises = new Set();
        sessions.forEach(s => {
            (s.exercises || []).forEach(e => {
                allExercises.add((e.name || '').toLowerCase().trim());
            });
        });
        
        const uniqueCount = allExercises.size;
        const totalExercises = sessions.reduce((sum, s) => sum + (s.exercises?.length || 0), 0);
        
        return {
            uniqueExercises: uniqueCount,
            totalExercises,
            varietyRatio: totalExercises > 0 ? (uniqueCount / totalExercises).toFixed(2) : 0
        };
    },
    
    splitIntoWeeks(sessions) {
        // Simplified: divide evenly
        const weeksCount = Math.ceil(sessions.length / 4);
        const weeks = [];
        for (let i = 0; i < weeksCount; i++) {
            weeks.push(sessions.slice(i * 4, (i + 1) * 4));
        }
        return weeks.filter(w => w.length > 0);
    },
    
    splitIntoMesocycles(sessions) {
        // 4 settimane = 1 mesociclo
        const mesocycleSize = 16; // ~4 weeks x 4 sessions
        const mesocycles = [];
        for (let i = 0; i < sessions.length; i += mesocycleSize) {
            mesocycles.push(sessions.slice(i, i + mesocycleSize));
        }
        return mesocycles.filter(m => m.length > 0);
    },
    
    estimateIntensity(sessions) {
        // Stima intensità basata su rep range medio
        let totalReps = 0;
        let count = 0;
        
        sessions.forEach(s => {
            (s.exercises || []).forEach(e => {
                const reps = this.parseReps(e.reps);
                if (reps > 0) {
                    totalReps += reps;
                    count++;
                }
            });
        });
        
        const avgReps = count > 0 ? totalReps / count : 10;
        
        // Lower reps = higher intensity
        if (avgReps <= 5) return 'very_high';
        if (avgReps <= 8) return 'high';
        if (avgReps <= 12) return 'moderate';
        return 'low';
    },
    
    parseReps(repsStr) {
        if (!repsStr) return 0;
        const str = String(repsStr);
        const match = str.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    },
    
    detectPeriodization(weeks) {
        // Analizza pattern di volume/intensità per rilevare tipo di periodizzazione
        if (weeks.length < 3) return 'insufficient_data';
        
        const volumes = weeks.map(w => 
            w.reduce((sum, s) => sum + (s.exercises || []).reduce((eSum, e) => eSum + (parseInt(e.sets) || 0), 0), 0)
        );
        
        // Check if volume decreases (linear)
        let increasing = 0, decreasing = 0;
        for (let i = 1; i < volumes.length; i++) {
            if (volumes[i] > volumes[i-1]) increasing++;
            else if (volumes[i] < volumes[i-1]) decreasing++;
        }
        
        if (decreasing > increasing * 2) return 'linear_taper';
        if (increasing > decreasing * 2) return 'accumulation';
        return 'undulating';
    },
    
    analyzePatternCoverage(sessions) {
        const patterns = this.analyzePatternDistribution(sessions);
        const missing = [];
        
        // Ogni pattern dovrebbe avere almeno alcune istanze
        Object.entries(patterns).forEach(([pattern, count]) => {
            if (count === 0 && ['squat', 'hinge', 'push', 'pull'].includes(pattern)) {
                missing.push(pattern);
            }
        });
        
        return {
            patterns,
            missing,
            complete: missing.length === 0
        };
    },
    
    detectDeload(weeks) {
        if (weeks.length < 4) return false;
        
        // Check if last week has significantly lower volume
        const lastWeekVolume = weeks[weeks.length - 1].reduce((sum, s) => 
            sum + (s.exercises || []).reduce((eSum, e) => eSum + (parseInt(e.sets) || 0), 0), 0
        );
        
        const previousWeekVolume = weeks[weeks.length - 2].reduce((sum, s) => 
            sum + (s.exercises || []).reduce((eSum, e) => eSum + (parseInt(e.sets) || 0), 0), 0
        );
        
        return lastWeekVolume < previousWeekVolume * 0.6;
    },
    
    calculateAvgVolume(sessions) {
        const total = sessions.reduce((sum, s) => 
            sum + (s.exercises || []).reduce((eSum, e) => eSum + (parseInt(e.sets) || 0), 0), 0
        );
        return sessions.length > 0 ? Math.round(total / sessions.length) : 0;
    },
    
    detectFocus(sessions) {
        const patterns = this.analyzePatternDistribution(sessions);
        const sorted = Object.entries(patterns).sort((a, b) => b[1] - a[1]);
        return sorted[0] ? sorted[0][0] : 'general';
    },
    
    analyzeGoalAlignment(sessions, goals) {
        // Check if training aligns with stated goals
        const patterns = this.analyzePatternDistribution(sessions);
        const alignment = [];
        
        (goals || []).forEach(goal => {
            const goalLower = goal.toLowerCase();
            
            if (/jump|vertical|explosive/i.test(goalLower)) {
                alignment.push({
                    goal,
                    aligned: patterns.power > 0 && patterns.squat > 0,
                    note: patterns.power > 0 ? '✅ Power work present' : '❌ Need more power/plyometric work'
                });
            } else if (/strength|force/i.test(goalLower)) {
                alignment.push({
                    goal,
                    aligned: (patterns.squat + patterns.hinge + patterns.push + patterns.pull) > sessions.length,
                    note: '✅ Compound movements present'
                });
            } else if (/endurance|stamina/i.test(goalLower)) {
                alignment.push({
                    goal,
                    aligned: patterns.conditioning > 0,
                    note: patterns.conditioning > 0 ? '✅ Conditioning present' : '❌ Add more conditioning'
                });
            }
        });
        
        return alignment;
    },
    
    assessOvertrainingRisk(sessions) {
        // Simplified overtraining risk assessment
        const avgVolume = this.calculateAvgVolume(sessions);
        
        if (avgVolume > 30) return { risk: 'high', note: 'Volume molto alto, considera deload' };
        if (avgVolume > 25) return { risk: 'moderate', note: 'Volume alto, monitora recovery' };
        return { risk: 'low', note: 'Volume appropriato' };
    },
    
    predictAdaptation(sessions, goals) {
        // Usa SAID per predire adattamenti
        const patterns = this.analyzePatternDistribution(sessions);
        const predictions = [];
        
        if (patterns.power > sessions.length * 0.3) {
            predictions.push('Miglioramento potenza/esplosività atteso');
        }
        if (patterns.squat + patterns.hinge > sessions.length * 0.5) {
            predictions.push('Miglioramento forza lower body atteso');
        }
        if (patterns.conditioning > sessions.length * 0.2) {
            predictions.push('Miglioramento capacità aerobica atteso');
        }
        
        return predictions;
    },
    
    generateMicrocycleRecommendations(analysis) {
        // Push/Pull balance
        if (analysis.patternDistribution.push > analysis.patternDistribution.pull * 1.5) {
            analysis.recommendations.push({
                type: 'balance',
                priority: 'high',
                message: 'Aggiungi più lavoro di trazione (pull) per bilanciare push'
            });
        }
        
        // Hinge pattern
        if (analysis.patternDistribution.hinge === 0) {
            analysis.recommendations.push({
                type: 'missing_pattern',
                priority: 'high',
                message: 'Manca lavoro di hinge (deadlift, RDL, bridge) - rischio squilibri'
            });
        }
        
        // Volume
        if (analysis.totalVolume < 40) {
            analysis.recommendations.push({
                type: 'volume',
                priority: 'medium',
                message: 'Volume settimanale basso - considera aumentare se obiettivo è ipertrofia/forza'
            });
        }
    },
    
    generateMesocycleRecommendations(analysis) {
        // Deload check
        if (!analysis.hasDeload && analysis.weekCount >= 4) {
            analysis.recommendations.push({
                type: 'recovery',
                priority: 'high',
                message: 'Considera inserire settimana di deload ogni 4-6 settimane'
            });
        }
        
        // Pattern coverage
        if (!analysis.patternCoverage.complete) {
            analysis.recommendations.push({
                type: 'missing_pattern',
                priority: 'high',
                message: `Pattern mancanti nel mesociclo: ${analysis.patternCoverage.missing.join(', ')}`
            });
        }
        
        // Volume progression
        const volumes = analysis.volumeProgression.map(w => w.avgSets);
        const allSame = volumes.every(v => Math.abs(v - volumes[0]) < 3);
        if (allSame) {
            analysis.recommendations.push({
                type: 'progression',
                priority: 'medium',
                message: 'Volume stabile - considera progressione per stimolare adattamento'
            });
        }
    }
};

window.ATLASTemporal = ATLASTemporal;
console.log('🗓️ ATLAS Temporal loaded - Long-term program intelligence');
console.log('   → ATLASTemporal.analyzeMicrocycle(sessions) - Analyze 1 week');
console.log('   → ATLASTemporal.analyzeMesocycle(sessions) - Analyze 4 weeks');
console.log('   → ATLASTemporal.analyzeMacrocycle(sessions, goals) - Analyze 12+ weeks');
