// ═══════════════════════════════════════════════════════════════════════════════════
// 📊 ATLAS PROGRESS TRACKER - Sistema Tracciamento Progressi Atleta
// ═══════════════════════════════════════════════════════════════════════════════════
//
// Responsabilità:
// - Memorizza la posizione dell'atleta nel macro-plan
// - Traccia feedback settimanali e giornalieri
// - Calcola metriche di progressione
// - Fornisce dati al Week-Generator e Auto-Adjuster
//
// Storage: LocalStorage + Sync opzionale
// ═══════════════════════════════════════════════════════════════════════════════════

const AtlasProgressTracker = {

    STORAGE_KEY: 'atlas_progress_tracker',
    VERSION: '1.0.0',

    // ═══════════════════════════════════════════════════════════════════════════
    // 🗃️ STRUTTURA DATI ATLETA
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Crea nuovo profilo progressi per atleta
     */
    createAthleteProgress(athleteId, macroTemplate) {
        return {
            athlete_id: athleteId,
            version: this.VERSION,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            
            // Macro-plan status
            macro_plan: {
                template_name: macroTemplate.name,
                goal: macroTemplate.goal,
                start_date: new Date().toISOString().split('T')[0],
                current_week: 1,
                current_phase: macroTemplate.phases[0].name,
                total_weeks: macroTemplate.duration_weeks,
                status: 'active' // active | paused | completed | adjusted
            },
            
            // Storico settimane
            week_history: [],
            
            // Storico workout
            workout_history: [],
            
            // Metriche chiave (PRs, misurazioni)
            key_metrics: {
                strength_prs: {},      // { squat: 120, bench: 80, ... }
                body_measurements: [], // Array di { date, weight, bodyfat, ... }
                performance_tests: []  // Array di { date, test_name, result }
            },
            
            // Segnali di adattamento
            adaptation_signals: {
                consecutive_excellent_weeks: 0,
                consecutive_poor_weeks: 0,
                overreaching_flags: 0,
                last_deload_week: null,
                phase_extensions: 0,
                phase_skips: 0
            }
        };
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 💾 PERSISTENCE (LocalStorage)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Salva progressi atleta
     */
    save(athleteProgress) {
        athleteProgress.updated_at = new Date().toISOString();
        
        // Carica tutti i progressi esistenti
        const allProgress = this.loadAll();
        allProgress[athleteProgress.athlete_id] = athleteProgress;
        
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allProgress));
            return { success: true };
        } catch (e) {
            console.error('AtlasProgressTracker: Errore salvataggio', e);
            return { success: false, error: e.message };
        }
    },

    /**
     * Carica progressi atleta specifico
     */
    load(athleteId) {
        const allProgress = this.loadAll();
        return allProgress[athleteId] || null;
    },

    /**
     * Carica tutti i progressi
     */
    loadAll() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('AtlasProgressTracker: Errore caricamento', e);
            return {};
        }
    },

    /**
     * Inizializza nuovo atleta con macro-plan
     */
    initializeAthlete(athleteId, macroTemplate) {
        let progress = this.load(athleteId);
        
        if (!progress) {
            progress = this.createAthleteProgress(athleteId, macroTemplate);
            this.save(progress);
        }
        
        return progress;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 📅 TRACKING SETTIMANALE
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Registra feedback settimanale
     */
    recordWeeklyFeedback(athleteId, weekData) {
        const progress = this.load(athleteId);
        if (!progress) return { success: false, error: 'Atleta non trovato' };
        
        const weekRecord = {
            week_number: progress.macro_plan.current_week,
            phase: progress.macro_plan.current_phase,
            date: new Date().toISOString(),
            
            // Feedback soggettivo
            fatigue: weekData.fatigue || 5,           // 1-10
            motivation: weekData.motivation || 7,      // 1-10
            stress: weekData.stress || 5,             // 1-10
            sleep_quality: weekData.sleep_quality || 'good', // poor | average | good | excellent
            sleep_hours: weekData.sleep_hours || 7,
            muscle_soreness: weekData.muscle_soreness || 'mild', // none | mild | moderate | severe
            
            // Performance oggettiva
            performance: weekData.performance || 'stable', // declining | stable | improving | excellent
            workouts_completed: weekData.workouts_completed || 0,
            workouts_planned: weekData.workouts_planned || 0,
            adherence_rate: weekData.workouts_planned > 0 
                ? (weekData.workouts_completed / weekData.workouts_planned) 
                : 1,
            
            // PRs della settimana
            prs_achieved: weekData.prs_achieved || [],
            
            // Note
            notes: weekData.notes || ''
        };
        
        progress.week_history.push(weekRecord);
        
        // Aggiorna segnali adattamento
        this.updateAdaptationSignals(progress, weekRecord);
        
        this.save(progress);
        
        return { success: true, weekRecord };
    },

    /**
     * Aggiorna segnali di adattamento basati su feedback
     */
    updateAdaptationSignals(progress, weekRecord) {
        const signals = progress.adaptation_signals;
        
        // Settimana eccellente
        if (weekRecord.performance === 'excellent' && 
            weekRecord.fatigue <= 6 && 
            weekRecord.motivation >= 7) {
            signals.consecutive_excellent_weeks++;
            signals.consecutive_poor_weeks = 0;
        }
        // Settimana problematica
        else if (weekRecord.performance === 'declining' || 
                 weekRecord.fatigue >= 8 ||
                 weekRecord.motivation <= 4) {
            signals.consecutive_poor_weeks++;
            signals.consecutive_excellent_weeks = 0;
        }
        else {
            // Reset contatori se settimana normale
            signals.consecutive_excellent_weeks = Math.max(0, signals.consecutive_excellent_weeks - 1);
            signals.consecutive_poor_weeks = Math.max(0, signals.consecutive_poor_weeks - 1);
        }
        
        // Flag overreaching
        if (weekRecord.fatigue >= 8 && weekRecord.performance === 'declining') {
            signals.overreaching_flags++;
        }
    },

    /**
     * Avanza alla settimana successiva
     */
    advanceWeek(athleteId, macroTemplate) {
        const progress = this.load(athleteId);
        if (!progress) return { success: false, error: 'Atleta non trovato' };
        
        const currentWeek = progress.macro_plan.current_week;
        const nextWeek = currentWeek + 1;
        
        // Check se completato
        if (nextWeek > progress.macro_plan.total_weeks) {
            progress.macro_plan.status = 'completed';
            this.save(progress);
            return { 
                success: true, 
                status: 'completed',
                message: 'Macro-plan completato! È ora di iniziare un nuovo ciclo.' 
            };
        }
        
        // Trova nuova fase
        let newPhase = progress.macro_plan.current_phase;
        for (const phase of macroTemplate.phases) {
            if (phase.weeks.includes(nextWeek)) {
                newPhase = phase.name;
                break;
            }
        }
        
        const phaseChanged = newPhase !== progress.macro_plan.current_phase;
        
        progress.macro_plan.current_week = nextWeek;
        progress.macro_plan.current_phase = newPhase;
        
        this.save(progress);
        
        return {
            success: true,
            new_week: nextWeek,
            new_phase: newPhase,
            phase_changed: phaseChanged,
            message: phaseChanged 
                ? `Nuova fase iniziata: ${newPhase}` 
                : `Settimana ${nextWeek} della fase ${newPhase}`
        };
    },

    /**
     * Salta al deload (per overreaching)
     */
    skipToDeload(athleteId, macroTemplate) {
        const progress = this.load(athleteId);
        if (!progress) return { success: false, error: 'Atleta non trovato' };
        
        // Trova fase deload
        const deloadPhase = macroTemplate.phases.find(p => 
            p.name.toLowerCase().includes('deload') || 
            p.name.toLowerCase().includes('recupero') ||
            p.name.toLowerCase().includes('consolidamento')
        );
        
        if (!deloadPhase) {
            return { success: false, error: 'Fase deload non trovata nel template' };
        }
        
        const previousWeek = progress.macro_plan.current_week;
        progress.macro_plan.current_week = deloadPhase.weeks[0];
        progress.macro_plan.current_phase = deloadPhase.name;
        progress.adaptation_signals.phase_skips++;
        progress.adaptation_signals.last_deload_week = progress.macro_plan.current_week;
        
        this.save(progress);
        
        return {
            success: true,
            skipped_from: previousWeek,
            new_week: deloadPhase.weeks[0],
            new_phase: deloadPhase.name,
            message: `Saltato al deload (settimana ${deloadPhase.weeks[0]}) per segnali di overreaching`
        };
    },

    /**
     * Estendi fase corrente (se va bene)
     */
    extendCurrentPhase(athleteId) {
        const progress = this.load(athleteId);
        if (!progress) return { success: false, error: 'Atleta non trovato' };
        
        // Non avanzare settimana, ma incrementa contatore estensioni
        progress.adaptation_signals.phase_extensions++;
        
        this.save(progress);
        
        return {
            success: true,
            message: `Fase ${progress.macro_plan.current_phase} estesa. Ripeti settimana ${progress.macro_plan.current_week}.`,
            extensions_total: progress.adaptation_signals.phase_extensions
        };
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🏋️ TRACKING WORKOUT
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Registra workout completato
     */
    recordWorkout(athleteId, workoutData) {
        const progress = this.load(athleteId);
        if (!progress) return { success: false, error: 'Atleta non trovato' };
        
        const workoutRecord = {
            date: new Date().toISOString(),
            week: progress.macro_plan.current_week,
            phase: progress.macro_plan.current_phase,
            
            // Metadata workout
            workout_type: workoutData.type || 'strength',
            duration_minutes: workoutData.duration || 60,
            exercises_count: workoutData.exercises?.length || 0,
            
            // Volumi
            total_sets: workoutData.total_sets || 0,
            total_reps: workoutData.total_reps || 0,
            total_volume: workoutData.total_volume || 0, // sets x reps x weight
            
            // Intensità
            avg_rpe: workoutData.avg_rpe || 7,
            max_rpe: workoutData.max_rpe || 8,
            avg_intensity_percent: workoutData.avg_intensity || 70,
            
            // Feedback post-workout
            perceived_quality: workoutData.quality || 'good', // poor | average | good | excellent
            energy_level: workoutData.energy || 7,
            
            // PRs
            prs: workoutData.prs || [],
            
            // Esercizi principali (per tracking)
            main_exercises: workoutData.main_exercises || []
        };
        
        progress.workout_history.push(workoutRecord);
        
        // Aggiorna PRs se presenti
        if (workoutData.prs && workoutData.prs.length > 0) {
            this.updatePRs(progress, workoutData.prs);
        }
        
        this.save(progress);
        
        return { success: true, workoutRecord };
    },

    /**
     * Aggiorna PRs
     */
    updatePRs(progress, newPRs) {
        for (const pr of newPRs) {
            const current = progress.key_metrics.strength_prs[pr.exercise];
            if (!current || pr.weight > current) {
                progress.key_metrics.strength_prs[pr.exercise] = pr.weight;
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 📈 ANALYTICS & REPORTING
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Calcola statistiche della settimana corrente
     */
    getWeekStats(athleteId) {
        const progress = this.load(athleteId);
        if (!progress) return null;
        
        const currentWeek = progress.macro_plan.current_week;
        const weekWorkouts = progress.workout_history.filter(w => w.week === currentWeek);
        
        return {
            week: currentWeek,
            phase: progress.macro_plan.current_phase,
            workouts_completed: weekWorkouts.length,
            total_volume: weekWorkouts.reduce((sum, w) => sum + (w.total_volume || 0), 0),
            avg_rpe: weekWorkouts.length > 0 
                ? weekWorkouts.reduce((sum, w) => sum + (w.avg_rpe || 0), 0) / weekWorkouts.length 
                : 0,
            prs_this_week: weekWorkouts.reduce((arr, w) => [...arr, ...(w.prs || [])], [])
        };
    },

    /**
     * Calcola trend progressione
     */
    getProgressionTrend(athleteId, weeks = 4) {
        const progress = this.load(athleteId);
        if (!progress || progress.week_history.length < 2) return null;
        
        const recentWeeks = progress.week_history.slice(-weeks);
        
        // Trend fatica
        const fatigueTrend = this.calculateTrend(recentWeeks.map(w => w.fatigue));
        
        // Trend performance
        const performanceValues = recentWeeks.map(w => {
            switch(w.performance) {
                case 'declining': return 1;
                case 'stable': return 2;
                case 'improving': return 3;
                case 'excellent': return 4;
                default: return 2;
            }
        });
        const performanceTrend = this.calculateTrend(performanceValues);
        
        // Trend volume
        const weeklyVolumes = recentWeeks.map(w => {
            const weekWorkouts = progress.workout_history.filter(wo => wo.week === w.week_number);
            return weekWorkouts.reduce((sum, wo) => sum + (wo.total_volume || 0), 0);
        });
        const volumeTrend = this.calculateTrend(weeklyVolumes);
        
        return {
            fatigue: {
                trend: fatigueTrend > 0.5 ? 'increasing' : fatigueTrend < -0.5 ? 'decreasing' : 'stable',
                value: fatigueTrend,
                warning: fatigueTrend > 1.5
            },
            performance: {
                trend: performanceTrend > 0.2 ? 'improving' : performanceTrend < -0.2 ? 'declining' : 'stable',
                value: performanceTrend
            },
            volume: {
                trend: volumeTrend > 0 ? 'increasing' : volumeTrend < 0 ? 'decreasing' : 'stable',
                value: volumeTrend
            },
            recommendation: this.generateTrendRecommendation(fatigueTrend, performanceTrend, volumeTrend)
        };
    },

    /**
     * Calcola trend semplice (slope)
     */
    calculateTrend(values) {
        if (values.length < 2) return 0;
        
        const n = values.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        
        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += values[i];
            sumXY += i * values[i];
            sumXX += i * i;
        }
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope;
    },

    /**
     * Genera raccomandazione basata su trend
     */
    generateTrendRecommendation(fatigueTrend, performanceTrend, volumeTrend) {
        // Fatica in aumento + performance in calo = overreaching
        if (fatigueTrend > 1 && performanceTrend < -0.2) {
            return {
                action: 'reduce_load',
                message: 'Segnali di overreaching: considera deload anticipato',
                urgency: 'high'
            };
        }
        
        // Performance ottima + fatica bassa = push harder
        if (performanceTrend > 0.3 && fatigueTrend < 0.5) {
            return {
                action: 'increase_load',
                message: 'Ottimo adattamento: puoi aumentare intensità/volume',
                urgency: 'low'
            };
        }
        
        // Volume in calo + fatica alta = riposare
        if (volumeTrend < -0.1 && fatigueTrend > 1) {
            return {
                action: 'rest',
                message: 'Volume in calo con fatica alta: priorità al recupero',
                urgency: 'medium'
            };
        }
        
        return {
            action: 'continue',
            message: 'Progressione nella norma: continua come programmato',
            urgency: 'low'
        };
    },

    /**
     * Ottiene sommario completo progressi atleta
     */
    getProgressSummary(athleteId) {
        const progress = this.load(athleteId);
        if (!progress) return null;
        
        const weekStats = this.getWeekStats(athleteId);
        const trend = this.getProgressionTrend(athleteId);
        
        return {
            athlete_id: athleteId,
            
            // Status macro-plan
            macro_status: {
                template: progress.macro_plan.template_name,
                week: `${progress.macro_plan.current_week}/${progress.macro_plan.total_weeks}`,
                phase: progress.macro_plan.current_phase,
                progress_percent: Math.round((progress.macro_plan.current_week / progress.macro_plan.total_weeks) * 100),
                status: progress.macro_plan.status
            },
            
            // Settimana corrente
            current_week: weekStats,
            
            // Trend
            trend: trend,
            
            // Storico
            total_workouts: progress.workout_history.length,
            total_weeks_tracked: progress.week_history.length,
            
            // PRs
            current_prs: progress.key_metrics.strength_prs,
            
            // Adattamento
            adaptation: {
                excellent_streak: progress.adaptation_signals.consecutive_excellent_weeks,
                poor_streak: progress.adaptation_signals.consecutive_poor_weeks,
                overreaching_flags: progress.adaptation_signals.overreaching_flags,
                extensions_used: progress.adaptation_signals.phase_extensions
            },
            
            // Ultimo feedback
            last_feedback: progress.week_history[progress.week_history.length - 1] || null
        };
    },

    /**
     * Genera report per prompt AI
     */
    generateProgressPrompt(athleteId) {
        const summary = this.getProgressSummary(athleteId);
        if (!summary) return '';
        
        let prompt = `\n\n📊 STORICO PROGRESSI ATLETA:\n`;
        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        prompt += `Macro-plan: ${summary.macro_status.template}\n`;
        prompt += `Settimana: ${summary.macro_status.week} (${summary.macro_status.progress_percent}%)\n`;
        prompt += `Fase corrente: ${summary.macro_status.phase}\n\n`;
        
        if (summary.last_feedback) {
            prompt += `📝 Ultimo feedback:\n`;
            prompt += `- Fatica: ${summary.last_feedback.fatigue}/10\n`;
            prompt += `- Motivazione: ${summary.last_feedback.motivation}/10\n`;
            prompt += `- Performance: ${summary.last_feedback.performance}\n`;
            prompt += `- Sonno: ${summary.last_feedback.sleep_hours}h (${summary.last_feedback.sleep_quality})\n`;
        }
        
        if (summary.trend) {
            prompt += `\n📈 Trend ultime settimane:\n`;
            prompt += `- Fatica: ${summary.trend.fatigue.trend}\n`;
            prompt += `- Performance: ${summary.trend.performance.trend}\n`;
            prompt += `- Raccomandazione: ${summary.trend.recommendation.message}\n`;
        }
        
        if (Object.keys(summary.current_prs).length > 0) {
            prompt += `\n🏆 PRs attuali:\n`;
            for (const [ex, weight] of Object.entries(summary.current_prs)) {
                prompt += `- ${ex}: ${weight}kg\n`;
            }
        }
        
        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        
        return prompt;
    }
};

// Export per browser
window.AtlasProgressTracker = AtlasProgressTracker;
