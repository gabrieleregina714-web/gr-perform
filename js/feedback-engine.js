// GR Perform - Feedback Engine v2.0
// Sistema completo di raccolta e analisi feedback post-workout
// Con decay temporale, threshold configurabili, sync Supabase

const FeedbackEngine = {

    STORAGE_KEY: 'gr_perform_workout_feedback',
    VERSION: '2.0',

    // ═══════════════════════════════════════════════════════════════════════════
    // CONFIGURAZIONE THRESHOLD (configurabili per sport/livello)
    // ═══════════════════════════════════════════════════════════════════════════
    
    CONFIG: {
        // RPE thresholds
        rpe: {
            critical: 9.0,
            warning: 8.0,
            elevated: 7.5,
            low: 5.5,
            optimal_min: 6.0,
            optimal_max: 8.0
        },
        // Completion thresholds
        completion: {
            excellent: 90,
            good: 75,
            moderate: 50
        },
        // Pain thresholds
        pain: {
            chronic_threshold: 3,      // 3+ occorrenze = cronico
            recent_threshold: 1,       // 1 occorrenza recente = segnalazione
            high_intensity: 6          // 6+ = dolore intenso
        },
        // Decay temporale (giorni)
        decay: {
            full_weight_days: 7,       // Ultimi 7 giorni = peso pieno
            half_weight_days: 21,      // 7-21 giorni = peso 50%
            quarter_weight_days: 42    // 21-42 giorni = peso 25%
        },
        // Modifiers reattività
        modifiers: {
            rpe_critical_volume: 0.5,
            rpe_critical_intensity: 0.6,
            rpe_warning_volume: 0.8,
            rpe_warning_intensity: 0.9,
            rpe_elevated_volume: 0.9,
            rpe_elevated_intensity: 0.95,
            rpe_low_volume: 1.1,
            rpe_low_intensity: 1.05,
            low_completion_volume: 0.7,
            pain_volume: 0.85
        }
    },

    /**
     * Configura threshold per atleta specifico
     */
    configureForAthlete(athleteContext) {
        const level = athleteContext?.experience_level || 'intermediate';
        const sport = athleteContext?.sport || 'palestra';
        
        // Principianti: threshold più bassi
        if (level === 'beginner' || level === 'principiante') {
            this.CONFIG.rpe.critical = 8.5;
            this.CONFIG.rpe.warning = 7.5;
            this.CONFIG.rpe.elevated = 7.0;
        }
        // Avanzati: threshold più alti
        else if (level === 'advanced' || level === 'avanzato') {
            this.CONFIG.rpe.critical = 9.5;
            this.CONFIG.rpe.warning = 8.5;
            this.CONFIG.rpe.elevated = 8.0;
        }
        
        // Sport specifici
        if (sport === 'boxe') {
            this.CONFIG.pain.chronic_threshold = 2; // Più sensibile ai dolori
        }
        
        return this.CONFIG;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // STRUTTURA FEEDBACK
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Crea un nuovo feedback vuoto
     */
    createFeedback(athleteId, workoutId, workoutData = {}) {
        const feedback = {
            id: this.generateId(),
            athlete_id: athleteId,
            workout_id: workoutId,
            workout_name: workoutData.name || '',
            workout_day: workoutData.day_of_week || '',
            week_number: workoutData.week_number || 1,
            
            // Timestamp
            created_at: new Date().toISOString(),
            completed_at: null,
            
            // Feedback generale
            overall_rpe: null,           // 1-10
            completion: null,            // 'full', 'partial', 'skipped'
            completion_pct: 100,         // 0-100
            energy_before: null,         // 1-5
            energy_after: null,          // 1-5
            mood: null,                  // 'great', 'good', 'ok', 'bad', 'terrible'
            
            // Feedback per esercizio
            exercise_feedback: [],       // [{exercise_name, difficulty, completed, notes, pain}]
            
            // Note e problemi
            notes: '',
            pain_areas: [],              // ['shoulder', 'knee', 'lower_back', ...]
            pain_intensity: {},          // {shoulder: 3, knee: 5, ...}
            
            // Metriche oggettive (se disponibili)
            actual_duration_minutes: null,
            heart_rate_avg: null,
            heart_rate_max: null,
            calories: null,
            
            // Confronto atteso vs reale
            expected_rpe: workoutData.expected_rpe || 7,
            rpe_delta: null,             // actual - expected (positivo = più difficile del previsto)
            
            // Status
            status: 'pending'            // 'pending', 'completed', 'skipped'
        };
        
        // SALVA IMMEDIATAMENTE
        return this.save(feedback);
    },

    /**
     * Crea feedback per singolo esercizio
     */
    createExerciseFeedback(exercise) {
        return {
            exercise_name: exercise.name || '',
            exercise_type: exercise.type || 'strength',
            prescribed_sets: exercise.sets || 0,
            prescribed_reps: exercise.reps || '',
            
            // Feedback
            completed_sets: exercise.sets || 0,
            difficulty: 'right',         // 'too_easy', 'easy', 'right', 'hard', 'too_hard'
            completed: true,
            skipped: false,
            modified: false,
            modification_notes: '',
            
            // Problemi
            pain_during: false,
            pain_area: null,
            pain_intensity: 0,           // 0-10
            form_issues: false,
            form_notes: ''
        };
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SALVATAGGIO E RECUPERO
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Salva feedback
     */
    save(feedback) {
        const all = this.getAll();
        
        if (!all[feedback.athlete_id]) {
            all[feedback.athlete_id] = [];
        }
        
        // Cerca esistente
        const existingIdx = all[feedback.athlete_id].findIndex(f => f.id === feedback.id);
        
        if (existingIdx >= 0) {
            all[feedback.athlete_id][existingIdx] = feedback;
        } else {
            all[feedback.athlete_id].push(feedback);
        }
        
        // Mantieni solo ultimi 100 feedback per atleta
        if (all[feedback.athlete_id].length > 100) {
            all[feedback.athlete_id] = all[feedback.athlete_id]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 100);
        }
        
        this.saveAll(all);
        console.log('💾 Feedback salvato:', feedback.id);
        return feedback;
    },

    /**
     * Completa feedback con dati finali
     */
    complete(feedbackId, athleteId, data) {
        const feedback = this.getById(athleteId, feedbackId);
        if (!feedback) return null;
        
        // Merge data
        Object.assign(feedback, data, {
            completed_at: new Date().toISOString(),
            status: data.completion === 'skipped' ? 'skipped' : 'completed',
            rpe_delta: (data.overall_rpe || feedback.expected_rpe) - feedback.expected_rpe
        });
        
        return this.save(feedback);
    },

    /**
     * Recupera feedback per ID
     */
    getById(athleteId, feedbackId) {
        const all = this.getAll();
        if (!all[athleteId]) return null;
        return all[athleteId].find(f => f.id === feedbackId) || null;
    },

    /**
     * Recupera ultimi N feedback per atleta
     */
    getRecent(athleteId, n = 10) {
        const all = this.getAll();
        if (!all[athleteId]) return [];
        
        return all[athleteId]
            .filter(f => f.status === 'completed')
            .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
            .slice(0, n);
    },

    /**
     * Recupera feedback per settimana
     */
    getByWeek(athleteId, weekNumber) {
        const all = this.getAll();
        if (!all[athleteId]) return [];
        
        return all[athleteId].filter(f => f.week_number === weekNumber);
    },

    /**
     * Recupera feedback pending (non completati)
     */
    getPending(athleteId) {
        const all = this.getAll();
        if (!all[athleteId]) return [];
        
        return all[athleteId]
            .filter(f => f.status === 'pending')
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // ANALISI TREND
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Analizza trend RPE (usa CONFIG per threshold)
     */
    analyzeRpeTrend(athleteId, weeks = 4) {
        const recent = this.getRecent(athleteId, weeks * 3); // ~3 workout/settimana
        
        if (recent.length < 2) {
            return { trend: 'insufficient_data', message: 'Dati insufficienti (min 2)', avgRpe: 0, suggestion: null };
        }
        
        // Calcola RPE con decay temporale
        let totalWeightedRpe = 0;
        let totalWeight = 0;
        const rpeValues = [];
        
        for (const fb of recent) {
            if (fb.overall_rpe != null) {
                const weight = this.getTemporalWeight(fb.completed_at || fb.created_at);
                totalWeightedRpe += fb.overall_rpe * weight;
                totalWeight += weight;
                rpeValues.push(fb.overall_rpe);
            }
        }
        
        const avgRpe = totalWeight > 0 ? totalWeightedRpe / totalWeight : 0;
        
        // Check trend (ultimi 3 vs precedenti)
        const recentRpe = rpeValues.slice(0, 3);
        const olderRpe = rpeValues.slice(3);
        
        const recentAvg = recentRpe.length > 0 ? recentRpe.reduce((a, b) => a + b, 0) / recentRpe.length : avgRpe;
        const olderAvg = olderRpe.length > 0 ? olderRpe.reduce((a, b) => a + b, 0) / olderRpe.length : recentAvg;
        
        const delta = recentAvg - olderAvg;
        const increasing = delta > 0.5 && rpeValues.length >= 4;
        
        // Weekly averages per trend analysis
        const weeklyAverages = this._getWeeklyRpeAverages(recent);
        
        let trend, message, suggestion, overtraining = false;
        
        // Usa threshold da CONFIG
        if (avgRpe >= this.CONFIG.rpe.critical || (increasing && recentAvg >= this.CONFIG.rpe.warning)) {
            trend = 'critical';
            message = 'RPE critico - rischio overtraining immediato';
            suggestion = 'DELOAD IMMEDIATO: volume -50%, intensità -40%';
            overtraining = true;
        } else if (avgRpe >= this.CONFIG.rpe.warning || delta > 1) {
            trend = 'warning';
            message = 'RPE in aumento - accumulo fatica significativo';
            suggestion = 'Settimana di scarico consigliata, o riduzione volume -20%';
        } else if (avgRpe >= this.CONFIG.rpe.elevated) {
            trend = 'elevated';
            message = 'RPE elevato ma gestibile';
            suggestion = 'Monitora prossime sessioni, priorità al recupero';
        } else if (avgRpe > 0 && avgRpe < this.CONFIG.rpe.low) {
            trend = 'low';
            message = 'RPE basso - possibile sottostimolo';
            suggestion = 'Considera aumento intensità +10% o volume +15%';
        } else if (avgRpe >= this.CONFIG.rpe.optimal_min && avgRpe <= this.CONFIG.rpe.optimal_max) {
            trend = 'optimal';
            message = 'RPE nella zona target - ottimo lavoro!';
            suggestion = null;
        } else {
            trend = 'stable';
            message = 'RPE stabile';
            suggestion = null;
        }
        
        return {
            trend,
            message,
            avgRpe: Math.round(avgRpe * 10) / 10,
            recentAvg: Math.round(recentAvg * 10) / 10,
            olderAvg: Math.round(olderAvg * 10) / 10,
            delta: Math.round(delta * 10) / 10,
            increasing,
            overtraining,
            suggestion,
            dataPoints: rpeValues.length,
            weeklyAverages
        };
    },

    /**
     * Calcola medie RPE settimanali
     */
    _getWeeklyRpeAverages(feedbackList) {
        const byWeek = {};
        for (const fb of feedbackList) {
            const week = fb.week_number || 1;
            if (!byWeek[week]) byWeek[week] = [];
            if (fb.overall_rpe != null) byWeek[week].push(fb.overall_rpe);
        }
        return Object.entries(byWeek).map(([week, rpes]) => ({
            week: parseInt(week),
            avg: Math.round(rpes.reduce((a, b) => a + b, 0) / rpes.length * 10) / 10,
            count: rpes.length
        })).sort((a, b) => b.week - a.week);
    },

    /**
     * Analizza completion rate
     */
    analyzeCompletionRate(athleteId, weeks = 4) {
        const recent = this.getRecent(athleteId, weeks * 3);
        
        if (recent.length < 3) {
            return { rate: 100, trend: 'insufficient_data', suggestion: null };
        }
        
        const completionPcts = recent.map(f => f.completion_pct || 100);
        const avgCompletion = completionPcts.reduce((a, b) => a + b, 0) / completionPcts.length;
        
        const fullCompletions = recent.filter(f => f.completion === 'full').length;
        const partialCompletions = recent.filter(f => f.completion === 'partial').length;
        const skipped = recent.filter(f => f.completion === 'skipped').length;
        
        let trend, suggestion;
        
        if (avgCompletion >= 90 && skipped === 0) {
            trend = 'excellent';
            suggestion = null;
        } else if (avgCompletion >= 75) {
            trend = 'good';
            suggestion = 'Considera ridurre leggermente volume per aumentare completamento';
        } else if (avgCompletion >= 50) {
            trend = 'moderate';
            suggestion = 'Volume troppo alto - riduci 20-30% per migliorare aderenza';
        } else {
            trend = 'poor';
            suggestion = 'Workout troppo impegnativi - semplifica drasticamente';
        }
        
        return {
            rate: Math.round(avgCompletion),
            fullCompletions,
            partialCompletions,
            skipped,
            total: recent.length,
            trend,
            suggestion
        };
    },

    /**
     * Calcola peso temporale del feedback (decay)
     */
    getTemporalWeight(feedbackDate) {
        const now = new Date();
        const fbDate = new Date(feedbackDate);
        const daysDiff = Math.floor((now - fbDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= this.CONFIG.decay.full_weight_days) return 1.0;
        if (daysDiff <= this.CONFIG.decay.half_weight_days) return 0.5;
        if (daysDiff <= this.CONFIG.decay.quarter_weight_days) return 0.25;
        return 0.1; // Vecchio feedback conta poco
    },

    /**
     * Analizza pattern dolore (FIX: threshold = 1 per recenti, decay temporale)
     */
    analyzePainPatterns(athleteId, weeks = 8) {
        const recent = this.getRecent(athleteId, weeks * 3);
        
        const painData = {}; // {area: {count, weightedCount, intensities, lastSeen, exercises}}
        
        for (const feedback of recent) {
            const weight = this.getTemporalWeight(feedback.completed_at || feedback.created_at);
            
            // Check feedback-level pain_areas
            for (const area of (feedback.pain_areas || [])) {
                if (!painData[area]) {
                    painData[area] = { count: 0, weightedCount: 0, intensities: [], lastSeen: null, exercises: new Set() };
                }
                painData[area].count++;
                painData[area].weightedCount += weight;
                painData[area].intensities.push(feedback.pain_intensity?.[area] || 3);
                painData[area].lastSeen = painData[area].lastSeen || feedback.completed_at;
            }
            
            // Check exercise-level pain
            for (const exFeedback of (feedback.exercise_feedback || [])) {
                if (exFeedback.pain_during && exFeedback.pain_area) {
                    const area = exFeedback.pain_area;
                    if (!painData[area]) {
                        painData[area] = { count: 0, weightedCount: 0, intensities: [], lastSeen: null, exercises: new Set() };
                    }
                    painData[area].count++;
                    painData[area].weightedCount += weight;
                    painData[area].intensities.push(exFeedback.pain_intensity || 3);
                    painData[area].lastSeen = painData[area].lastSeen || feedback.completed_at;
                    if (exFeedback.exercise_name) {
                        painData[area].exercises.add(exFeedback.exercise_name);
                    }
                }
            }
        }
        
        // Calcola aree problematiche (threshold = 1 per segnalare, 3+ per cronico)
        const problematicAreas = Object.entries(painData)
            .filter(([area, data]) => data.count >= this.CONFIG.pain.recent_threshold)
            .map(([area, data]) => {
                const avgIntensity = data.intensities.length > 0
                    ? Math.round(data.intensities.reduce((a, b) => a + b, 0) / data.intensities.length * 10) / 10
                    : 0;
                
                return {
                    area,
                    frequency: data.count,
                    weightedFrequency: Math.round(data.weightedCount * 10) / 10,
                    avgIntensity,
                    severity: data.count >= this.CONFIG.pain.chronic_threshold ? 'chronic' 
                            : avgIntensity >= this.CONFIG.pain.high_intensity ? 'acute' 
                            : 'monitored',
                    lastSeen: data.lastSeen,
                    relatedExercises: Array.from(data.exercises)
                };
            })
            .sort((a, b) => b.weightedFrequency - a.weightedFrequency);
        
        // Identifica dolori recenti (ultimi 7 giorni)
        const recentPain = problematicAreas.filter(p => {
            if (!p.lastSeen) return false;
            const daysDiff = Math.floor((new Date() - new Date(p.lastSeen)) / (1000 * 60 * 60 * 24));
            return daysDiff <= 7;
        });
        
        // Genera suggerimenti specifici
        const suggestions = problematicAreas.map(p => {
            if (p.severity === 'chronic') {
                return `⚠️ ${p.area.toUpperCase()}: dolore CRONICO (${p.frequency}x) - EVITA esercizi che stressano questa zona, consulta fisioterapista`;
            } else if (p.severity === 'acute') {
                return `🔴 ${p.area}: dolore ACUTO (intensità ${p.avgIntensity}/10) - riduci carico, considera pausa`;
            } else {
                return `🟡 ${p.area}: da monitorare (${p.frequency}x) - aggiungi prehab specifico`;
            }
        });
        
        return {
            problematicAreas,
            bodyParts: problematicAreas.map(p => p.area),
            chronicPain: problematicAreas.filter(p => p.severity === 'chronic').map(p => p.area),
            recentPain: recentPain.map(p => p.area),
            hasRecurringPain: problematicAreas.length > 0,
            suggestions
        };
    },

    /**
     * Analizza difficoltà esercizi
     */
    analyzeExerciseDifficulty(athleteId) {
        const recent = this.getRecent(athleteId, 20);
        
        const exerciseStats = {};
        
        for (const feedback of recent) {
            for (const exFeedback of (feedback.exercise_feedback || [])) {
                const name = exFeedback.exercise_name;
                if (!name) continue;
                
                if (!exerciseStats[name]) {
                    exerciseStats[name] = {
                        name,
                        count: 0,
                        difficulties: [],
                        completions: 0,
                        skips: 0,
                        painReports: 0
                    };
                }
                
                exerciseStats[name].count++;
                exerciseStats[name].difficulties.push(exFeedback.difficulty);
                if (exFeedback.completed) exerciseStats[name].completions++;
                if (exFeedback.skipped) exerciseStats[name].skips++;
                if (exFeedback.pain_during) exerciseStats[name].painReports++;
            }
        }
        
        // Calcola statistiche
        const results = Object.values(exerciseStats).map(stat => {
            const difficultyMap = { too_easy: -2, easy: -1, right: 0, hard: 1, too_hard: 2 };
            const avgDiff = stat.difficulties.reduce((sum, d) => sum + (difficultyMap[d] || 0), 0) / stat.difficulties.length;
            
            return {
                ...stat,
                avgDifficulty: avgDiff,
                difficultyLabel: avgDiff < -0.5 ? 'too_easy' : avgDiff > 0.5 ? 'too_hard' : 'appropriate',
                completionRate: Math.round(stat.completions / stat.count * 100),
                painRate: Math.round(stat.painReports / stat.count * 100)
            };
        });
        
        return {
            tooEasy: results.filter(r => r.difficultyLabel === 'too_easy'),
            appropriate: results.filter(r => r.difficultyLabel === 'appropriate'),
            tooHard: results.filter(r => r.difficultyLabel === 'too_hard'),
            problematic: results.filter(r => r.painRate > 30 || r.completionRate < 50)
        };
    },

    /**
     * Genera raccomandazioni complete
     */
    generateRecommendations(athleteId) {
        const rpeTrend = this.analyzeRpeTrend(athleteId);
        const completionRate = this.analyzeCompletionRate(athleteId);
        const painPatterns = this.analyzePainPatterns(athleteId);
        const exerciseDifficulty = this.analyzeExerciseDifficulty(athleteId);
        
        const recommendations = [];
        
        // RPE recommendations
        if (rpeTrend.suggestion) {
            recommendations.push({
                type: 'rpe',
                priority: rpeTrend.trend === 'critical' ? 'high' : 'medium',
                message: rpeTrend.suggestion
            });
        }
        
        // Completion recommendations
        if (completionRate.suggestion) {
            recommendations.push({
                type: 'completion',
                priority: completionRate.trend === 'poor' ? 'high' : 'low',
                message: completionRate.suggestion
            });
        }
        
        // Pain recommendations
        for (const suggestion of painPatterns.suggestions) {
            recommendations.push({
                type: 'pain',
                priority: 'medium',
                message: suggestion
            });
        }
        
        // Exercise-specific recommendations
        for (const ex of exerciseDifficulty.tooHard.slice(0, 3)) {
            recommendations.push({
                type: 'exercise',
                priority: 'low',
                message: `${ex.name}: troppo difficile - considera regressione o riduzione carico`
            });
        }
        
        for (const ex of exerciseDifficulty.problematic.slice(0, 2)) {
            recommendations.push({
                type: 'exercise',
                priority: 'medium',
                message: `${ex.name}: problematico (${ex.painRate}% pain, ${ex.completionRate}% completion) - valuta sostituzione`
            });
        }
        
        return {
            recommendations: recommendations.sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }),
            summary: {
                rpe: rpeTrend,
                completion: completionRate,
                pain: painPatterns,
                exercises: exerciseDifficulty
            }
        };
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // ADATTAMENTO AUTOMATICO
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Genera modificatori per prossimo workout basandosi sul feedback (V2 - più reattivo)
     */
    getWorkoutModifiers(athleteId) {
        const rpeTrend = this.analyzeRpeTrend(athleteId);
        const completionRate = this.analyzeCompletionRate(athleteId);
        const painPatterns = this.analyzePainPatterns(athleteId);
        const exerciseDifficulty = this.analyzeExerciseDifficulty(athleteId);
        
        const M = this.CONFIG.modifiers; // Shortcut
        
        const modifiers = {
            volumeMultiplier: 1.0,
            intensityMultiplier: 1.0,
            avoidExercises: [],
            avoidAreas: [],
            focusAreas: [],
            substituteExercises: {},
            suggestions: [],
            notes: [],
            forceDeload: false
        };
        
        // ═══════════════════════════════════════════════════════════════════
        // RPE-based adjustments (PIÙ REATTIVI)
        // ═══════════════════════════════════════════════════════════════════
        if (rpeTrend.trend === 'critical' || rpeTrend.overtraining) {
            modifiers.volumeMultiplier = M.rpe_critical_volume;       // 0.5
            modifiers.intensityMultiplier = M.rpe_critical_intensity; // 0.6
            modifiers.forceDeload = true;
            modifiers.notes.push('🔴 DELOAD FORZATO: overtraining rilevato');
        } else if (rpeTrend.trend === 'warning') {
            modifiers.volumeMultiplier = M.rpe_warning_volume;        // 0.8
            modifiers.intensityMultiplier = M.rpe_warning_intensity;  // 0.9
            modifiers.notes.push('🟠 Volume ridotto per fatica accumulata');
        } else if (rpeTrend.trend === 'elevated') {
            // NUOVO: anche elevated riduce leggermente
            modifiers.volumeMultiplier = M.rpe_elevated_volume;       // 0.9
            modifiers.intensityMultiplier = M.rpe_elevated_intensity; // 0.95
            modifiers.notes.push('🟡 Leggera riduzione preventiva');
        } else if (rpeTrend.trend === 'low') {
            modifiers.volumeMultiplier = M.rpe_low_volume;            // 1.1
            modifiers.intensityMultiplier = M.rpe_low_intensity;      // 1.05
            modifiers.notes.push('🟢 Volume aumentato per sottostimolo');
        }
        
        // ═══════════════════════════════════════════════════════════════════
        // Completion-based adjustments
        // ═══════════════════════════════════════════════════════════════════
        if (completionRate.trend === 'poor') {
            modifiers.volumeMultiplier *= M.low_completion_volume;    // 0.7
            modifiers.notes.push('📉 Volume ridotto: compliance troppo bassa');
        } else if (completionRate.trend === 'moderate') {
            modifiers.volumeMultiplier *= 0.9;
            modifiers.notes.push('📊 Volume leggermente ridotto per compliance');
        }
        
        // ═══════════════════════════════════════════════════════════════════
        // Pain-based adjustments (NUOVO: più dettagliato)
        // ═══════════════════════════════════════════════════════════════════
        if (painPatterns.hasRecurringPain) {
            // Riduzione volume per dolori
            modifiers.volumeMultiplier *= M.pain_volume;              // 0.85
            
            for (const area of painPatterns.problematicAreas) {
                modifiers.avoidAreas.push(area.area);
                
                if (area.severity === 'chronic') {
                    modifiers.notes.push(`⛔ EVITARE ${area.area.toUpperCase()}: dolore cronico`);
                } else if (area.severity === 'acute') {
                    modifiers.notes.push(`🔴 ${area.area}: dolore acuto - massima cautela`);
                } else {
                    modifiers.notes.push(`⚠️ ${area.area}: monitorare durante esercizi`);
                }
                
                // Aggiungi esercizi correlati da evitare
                for (const ex of area.relatedExercises || []) {
                    if (!modifiers.avoidExercises.includes(ex)) {
                        modifiers.avoidExercises.push(ex);
                    }
                }
            }
        }
        
        // ═══════════════════════════════════════════════════════════════════
        // Exercise-specific adjustments (NUOVO)
        // ═══════════════════════════════════════════════════════════════════
        for (const ex of exerciseDifficulty.problematic || []) {
            if (!modifiers.avoidExercises.includes(ex.name)) {
                modifiers.avoidExercises.push(ex.name);
                modifiers.notes.push(`🔄 ${ex.name}: problematico, considera sostituzione`);
            }
        }
        
        // Suggerimenti per esercizi troppo facili
        for (const ex of (exerciseDifficulty.tooEasy || []).slice(0, 3)) {
            modifiers.suggestions.push(`${ex.name}: troppo facile - aumenta carico o progressione`);
        }
        
        // Suggerimenti per esercizi troppo difficili
        for (const ex of (exerciseDifficulty.tooHard || []).slice(0, 3)) {
            modifiers.suggestions.push(`${ex.name}: troppo difficile - riduci carico o regressione`);
        }
        
        // ═══════════════════════════════════════════════════════════════════
        // Clamp multipliers con limiti ragionevoli
        // ═══════════════════════════════════════════════════════════════════
        modifiers.volumeMultiplier = Math.round(Math.max(0.4, Math.min(1.3, modifiers.volumeMultiplier)) * 100) / 100;
        modifiers.intensityMultiplier = Math.round(Math.max(0.5, Math.min(1.15, modifiers.intensityMultiplier)) * 100) / 100;
        
        return modifiers;
    },

    /**
     * Genera prompt section per AI con context feedback
     */
    generateFeedbackPromptSection(athleteId) {
        const recommendations = this.generateRecommendations(athleteId);
        const modifiers = this.getWorkoutModifiers(athleteId);
        
        if (recommendations.recommendations.length === 0 && modifiers.notes.length === 0) {
            return ''; // Nessun feedback significativo
        }
        
        let prompt = `\n🔄 FEEDBACK LOOP - ADATTAMENTI DA SESSIONI PRECEDENTI\n`;
        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        
        // Summary
        prompt += `📊 RPE medio: ${recommendations.summary.rpe.avgRpe}/10 (trend: ${recommendations.summary.rpe.trend})\n`;
        prompt += `✅ Completion rate: ${recommendations.summary.completion.rate}%\n`;
        
        if (recommendations.summary.pain.hasRecurringPain) {
            prompt += `⚠️ Aree doloranti ricorrenti: ${recommendations.summary.pain.problematicAreas.map(p => p.area).join(', ')}\n`;
        }
        
        prompt += `\n`;
        
        // Modifiers
        if (modifiers.volumeMultiplier !== 1.0) {
            prompt += `📉 VOLUME: ${Math.round(modifiers.volumeMultiplier * 100)}% del normale\n`;
        }
        if (modifiers.intensityMultiplier !== 1.0) {
            prompt += `💪 INTENSITÀ: ${Math.round(modifiers.intensityMultiplier * 100)}% del normale\n`;
        }
        if (modifiers.avoidAreas.length > 0) {
            prompt += `⛔ EVITA stress su: ${modifiers.avoidAreas.join(', ')}\n`;
        }
        
        // Top recommendations
        const topRecs = recommendations.recommendations.slice(0, 3);
        if (topRecs.length > 0) {
            prompt += `\n📝 RACCOMANDAZIONI:\n`;
            for (const rec of topRecs) {
                const icon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
                prompt += `   ${icon} ${rec.message}\n`;
            }
        }
        
        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        
        return prompt;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // DASHBOARD COACH
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Ottiene overview per dashboard coach
     * @param {string|string[]} athleteIdOrIds - Singolo ID o array di ID
     */
    getCoachDashboard(athleteIdOrIds) {
        // Normalizza input - supporta sia singolo ID che array
        let athleteIds = [];
        if (typeof athleteIdOrIds === 'string') {
            athleteIds = [athleteIdOrIds];
        } else if (Array.isArray(athleteIdOrIds)) {
            athleteIds = athleteIdOrIds;
        } else {
            // Se non passato nulla, prendi tutti gli atleti dal storage
            const all = this.getAll();
            athleteIds = Object.keys(all);
        }
        
        // Se chiamato con singolo atleta, ritorna formato semplificato
        if (typeof athleteIdOrIds === 'string') {
            return this._getSingleAthleteDashboard(athleteIdOrIds);
        }
        
        // Multi-atleta dashboard
        const dashboard = {
            needsAttention: [],
            recentFeedback: [],
            overallStats: {
                avgRpe: 0,
                avgCompletion: 0,
                totalFeedback: 0
            }
        };
        
        for (const athleteId of athleteIds) {
            const singleDash = this._getSingleAthleteDashboard(athleteId);
            
            if (singleDash.needsAttention) {
                dashboard.needsAttention.push({
                    athleteId,
                    reasons: singleDash.attentionReasons,
                    stats: singleDash.stats
                });
            }
            
            // Accumulate stats
            if (singleDash.stats.avgRpe > 0) {
                dashboard.overallStats.avgRpe += singleDash.stats.avgRpe;
                dashboard.overallStats.totalFeedback += singleDash.stats.totalWorkouts;
            }
            dashboard.overallStats.avgCompletion += singleDash.stats.completionRate;
        }
        
        // Finalize averages
        if (athleteIds.length > 0) {
            dashboard.overallStats.avgRpe = Math.round(dashboard.overallStats.avgRpe / athleteIds.length * 10) / 10;
            dashboard.overallStats.avgCompletion = Math.round(dashboard.overallStats.avgCompletion / athleteIds.length);
        }
        
        return dashboard;
    },

    /**
     * Dashboard per singolo atleta
     */
    _getSingleAthleteDashboard(athleteId) {
        const rpeTrend = this.analyzeRpeTrend(athleteId);
        const completionRate = this.analyzeCompletionRate(athleteId);
        const painPatterns = this.analyzePainPatterns(athleteId);
        const recommendations = this.generateRecommendations(athleteId);
        const recent = this.getRecent(athleteId, 5);
        
        // Calcola se richiede attenzione
        const attentionReasons = [];
        
        if (rpeTrend.trend === 'critical') {
            attentionReasons.push({ type: 'rpe_critical', message: 'RPE critico - rischio overtraining' });
        } else if (rpeTrend.trend === 'warning') {
            attentionReasons.push({ type: 'rpe_warning', message: 'RPE elevato - accumulo fatica' });
        }
        
        if (completionRate.rate < 70) {
            attentionReasons.push({ type: 'low_completion', message: `Compliance bassa: ${Math.round(completionRate.rate)}%` });
        }
        
        if (painPatterns.hasRecurringPain) {
            attentionReasons.push({ type: 'recurring_pain', message: `Dolori ricorrenti: ${painPatterns.problematicAreas.map(p => p.area).join(', ')}` });
        }
        
        // Stats aggregate
        const stats = {
            avgRpe: rpeTrend.avgRpe || 0,
            completionRate: completionRate.rate || 100,
            totalWorkouts: recent.length,
            trend: rpeTrend.trend,
            painAreas: painPatterns.problematicAreas?.map(p => p.area) || []
        };
        
        return {
            athleteId,
            needsAttention: attentionReasons.length > 0,
            attentionReasons,
            stats,
            recommendations: recommendations.recommendations || [],
            recentFeedback: recent.slice(0, 3)
        };
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════════════════

    generateId() {
        return `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    getAll() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Errore lettura feedback:', e);
            return {};
        }
    },

    saveAll(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Errore salvataggio feedback:', e);
        }
    },

    clearForAthlete(athleteId) {
        const all = this.getAll();
        delete all[athleteId];
        this.saveAll(all);
    },

    export(athleteId) {
        if (athleteId) {
            return JSON.stringify(this.getRecent(athleteId, 100), null, 2);
        }
        return JSON.stringify(this.getAll(), null, 2);
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SUPABASE SYNC
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Sincronizza feedback con Supabase (backup cloud)
     */
    async syncToSupabase(athleteId) {
        if (!window.supabase) {
            console.warn('Supabase client non disponibile');
            return { success: false, error: 'Supabase non disponibile' };
        }
        
        try {
            const recent = this.getRecent(athleteId, 50);
            if (recent.length === 0) return { success: true, synced: 0 };
            
            let synced = 0;
            
            for (const feedback of recent) {
                // Controlla se già esiste
                try {
                    const existing = await window.supabase.fetch(
                        'workout_feedback_history',
                        `?feedback_id=eq.${feedback.id}&athlete_id=eq.${athleteId}`
                    );
                    
                    if (existing && existing.length > 0) continue; // Già sincronizzato
                    
                    // Inserisci
                    const row = {
                        feedback_id: feedback.id,
                        athlete_id: athleteId,
                        workout_id: feedback.workout_id,
                        week_number: feedback.week_number,
                        overall_rpe: feedback.overall_rpe,
                        completion_pct: feedback.completion_pct,
                        completion_status: feedback.completion,
                        pain_areas: feedback.pain_areas || [],
                        exercise_feedback: feedback.exercise_feedback || [],
                        notes: feedback.notes,
                        mood: feedback.mood,
                        energy_after: feedback.energy_after,
                        actual_duration_minutes: feedback.actual_duration_minutes,
                        created_at: feedback.created_at,
                        completed_at: feedback.completed_at
                    };
                    
                    await window.supabase.insert('workout_feedback_history', row);
                    synced++;
                } catch (e) {
                    console.warn('Sync feedback failed:', feedback.id, e);
                }
            }
            
            console.log(`☁️ Synced ${synced} feedback to Supabase`);
            return { success: true, synced };
        } catch (e) {
            console.error('Supabase sync failed:', e);
            return { success: false, error: e.message };
        }
    },

    /**
     * Carica feedback da Supabase (restore)
     */
    async loadFromSupabase(athleteId) {
        if (!window.supabase) {
            return { success: false, error: 'Supabase non disponibile' };
        }
        
        try {
            const rows = await window.supabase.fetch(
                'workout_feedback_history',
                `?athlete_id=eq.${athleteId}&order=completed_at.desc&limit=100`
            );
            
            if (!rows || rows.length === 0) {
                return { success: true, loaded: 0 };
            }
            
            const all = this.getAll();
            if (!all[athleteId]) all[athleteId] = [];
            
            let loaded = 0;
            for (const row of rows) {
                // Controlla se già esiste localmente
                const exists = all[athleteId].some(f => f.id === row.feedback_id);
                if (exists) continue;
                
                // Ricostruisci feedback
                const feedback = {
                    id: row.feedback_id,
                    athlete_id: athleteId,
                    workout_id: row.workout_id,
                    week_number: row.week_number,
                    overall_rpe: row.overall_rpe,
                    completion_pct: row.completion_pct,
                    completion: row.completion_status,
                    pain_areas: row.pain_areas || [],
                    exercise_feedback: row.exercise_feedback || [],
                    notes: row.notes,
                    mood: row.mood,
                    energy_after: row.energy_after,
                    actual_duration_minutes: row.actual_duration_minutes,
                    created_at: row.created_at,
                    completed_at: row.completed_at,
                    status: 'completed'
                };
                
                all[athleteId].push(feedback);
                loaded++;
            }
            
            this.saveAll(all);
            console.log(`☁️ Loaded ${loaded} feedback from Supabase`);
            return { success: true, loaded };
        } catch (e) {
            console.error('Supabase load failed:', e);
            return { success: false, error: e.message };
        }
    },

    /**
     * Sync automatico al completamento feedback
     */
    async autoSync(athleteId) {
        // Sync in background senza bloccare
        setTimeout(async () => {
            try {
                await this.syncToSupabase(athleteId);
            } catch (e) {
                console.warn('Auto-sync failed:', e);
            }
        }, 1000);
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // OBIETTIVI E GOALS TRACKING
    // ═══════════════════════════════════════════════════════════════════════════

    GOALS_STORAGE_KEY: 'gr_perform_workout_goals',

    /**
     * Imposta obiettivo per atleta
     */
    setGoal(athleteId, goal) {
        const goals = this._getGoals();
        if (!goals[athleteId]) goals[athleteId] = [];
        
        const newGoal = {
            id: `goal_${Date.now()}`,
            created_at: new Date().toISOString(),
            target_date: goal.target_date || null,
            type: goal.type || 'custom',  // 'strength', 'weight', 'reps', 'frequency', 'custom'
            description: goal.description || '',
            metric: goal.metric || null,   // es: 'squat_1rm', 'body_weight', 'workouts_per_week'
            target_value: goal.target_value || null,
            current_value: goal.current_value || null,
            unit: goal.unit || '',
            status: 'active',              // 'active', 'achieved', 'abandoned'
            achieved_at: null,
            progress_history: []
        };
        
        goals[athleteId].push(newGoal);
        this._saveGoals(goals);
        return newGoal;
    },

    /**
     * Aggiorna progresso obiettivo
     */
    updateGoalProgress(athleteId, goalId, currentValue, notes = '') {
        const goals = this._getGoals();
        if (!goals[athleteId]) return null;
        
        const goal = goals[athleteId].find(g => g.id === goalId);
        if (!goal) return null;
        
        goal.current_value = currentValue;
        goal.progress_history.push({
            date: new Date().toISOString(),
            value: currentValue,
            notes
        });
        
        // Check se obiettivo raggiunto
        if (goal.target_value && currentValue >= goal.target_value) {
            goal.status = 'achieved';
            goal.achieved_at = new Date().toISOString();
        }
        
        this._saveGoals(goals);
        return goal;
    },

    /**
     * Ottieni obiettivi atleta
     */
    getGoals(athleteId, status = null) {
        const goals = this._getGoals();
        if (!goals[athleteId]) return [];
        
        let result = goals[athleteId];
        if (status) {
            result = result.filter(g => g.status === status);
        }
        return result;
    },

    /**
     * Calcola progresso obiettivi attivi
     */
    getGoalsProgress(athleteId) {
        const activeGoals = this.getGoals(athleteId, 'active');
        
        return activeGoals.map(goal => {
            let progressPct = 0;
            if (goal.target_value && goal.current_value) {
                progressPct = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
            }
            
            return {
                ...goal,
                progressPct,
                remaining: goal.target_value ? Math.max(0, goal.target_value - (goal.current_value || 0)) : null
            };
        });
    },

    _getGoals() {
        try {
            const data = localStorage.getItem(this.GOALS_STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    },

    _saveGoals(data) {
        try {
            localStorage.setItem(this.GOALS_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Errore salvataggio goals:', e);
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // ANALISI COMPLETA (analyzeAll)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Esegue tutte le analisi per un atleta
     */
    analyzeAll(athleteId) {
        return {
            rpeTrend: this.analyzeRpeTrend(athleteId),
            completionRate: this.analyzeCompletionRate(athleteId),
            pain: this.analyzePainPatterns(athleteId),
            exerciseDifficulty: this.analyzeExerciseDifficulty(athleteId),
            recommendations: this.generateRecommendations(athleteId).recommendations,
            modifiers: this.getWorkoutModifiers(athleteId),
            goals: this.getGoalsProgress(athleteId)
        };
    }
};

// Export
window.FeedbackEngine = FeedbackEngine;
