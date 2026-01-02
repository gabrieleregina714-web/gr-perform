// GR Perform - Workout History System
// Salva e carica storico workout per progressione

const WorkoutHistory = {

    STORAGE_KEY: 'gr_perform_workout_history',
    WEEK_DATA_KEY: 'gr_perform_week_data',
    MAX_HISTORY_PER_ATHLETE: 52, // 1 anno di settimane

    /**
     * Salva un workout generato
     */
    save(athleteId, weekNumber, workout) {
        const history = this.getAll();
        
        if (!history[athleteId]) {
            history[athleteId] = [];
        }
        
        // Check if already exists for this week
        const existingIndex = history[athleteId].findIndex(w => w.weekNumber === weekNumber);
        
        const entry = {
            weekNumber,
            timestamp: new Date().toISOString(),
            workout: JSON.parse(JSON.stringify(workout))
        };
        
        if (existingIndex >= 0) {
            history[athleteId][existingIndex] = entry;
        } else {
            history[athleteId].push(entry);
        }
        
        // Trim to max history
        if (history[athleteId].length > this.MAX_HISTORY_PER_ATHLETE) {
            history[athleteId] = history[athleteId]
                .sort((a, b) => b.weekNumber - a.weekNumber)
                .slice(0, this.MAX_HISTORY_PER_ATHLETE);
        }
        
        this.saveAll(history);
        console.log(`📚 Salvato workout settimana ${weekNumber} per atleta ${athleteId}`);
    },

    /**
     * Salva dati settimanali (RPE, compliance, HRV, ecc.) per periodizzazione
     */
    saveWeekData(athleteId, weekNumber, data) {
        const weekData = this.getWeekDataAll();
        
        if (!weekData[athleteId]) {
            weekData[athleteId] = [];
        }
        
        const existingIndex = weekData[athleteId].findIndex(w => w.weekNumber === weekNumber);
        
        const entry = {
            weekNumber,
            timestamp: new Date().toISOString(),
            avgRpe: data.avgRpe || 0,
            compliance: data.compliance || 100,
            hrv: data.hrv || 0,
            sleep: data.sleep || 0,
            readiness: data.readiness || 0,
            phase: data.phase || '',
            volumePct: data.volumePct || 100,
            intensityPct: data.intensityPct || 70,
            notes: data.notes || ''
        };
        
        if (existingIndex >= 0) {
            weekData[athleteId][existingIndex] = entry;
        } else {
            weekData[athleteId].push(entry);
        }
        
        // Trim to max
        if (weekData[athleteId].length > this.MAX_HISTORY_PER_ATHLETE) {
            weekData[athleteId] = weekData[athleteId]
                .sort((a, b) => b.weekNumber - a.weekNumber)
                .slice(0, this.MAX_HISTORY_PER_ATHLETE);
        }
        
        this.saveWeekDataAll(weekData);
        console.log(`📊 Salvati dati settimana ${weekNumber} per atleta ${athleteId}:`, entry);
    },

    /**
     * Ottiene dati settimanali per un atleta
     */
    getWeekData(athleteId) {
        const weekData = this.getWeekDataAll();
        return weekData[athleteId] || [];
    },

    /**
     * Ottiene ultime N settimane di dati per check deload
     */
    getRecentWeekData(athleteId, n = 4) {
        const data = this.getWeekData(athleteId);
        return data
            .sort((a, b) => b.weekNumber - a.weekNumber)
            .slice(0, n);
    },

    /**
     * Calcola se serve deload basandosi sui dati storici
     */
    checkNeedsDeload(athleteId) {
        const recentData = this.getRecentWeekData(athleteId, 4);
        
        if (recentData.length < 3) return { needs: false, reason: null };
        
        // Check 1: RPE alto per 2+ settimane
        const highRpeWeeks = recentData.filter(w => w.avgRpe > 8.5).length;
        if (highRpeWeeks >= 2) {
            return { needs: true, reason: `RPE > 8.5 per ${highRpeWeeks} settimane` };
        }
        
        // Check 2: Compliance bassa per 2+ settimane
        const lowComplianceWeeks = recentData.filter(w => w.compliance < 60).length;
        if (lowComplianceWeeks >= 2) {
            return { needs: true, reason: `Compliance < 60% per ${lowComplianceWeeks} settimane` };
        }
        
        // Check 3: 4 settimane senza deload
        const lastDeloadWeek = recentData.find(w => w.phase === 'deload');
        if (!lastDeloadWeek && recentData.length >= 4) {
            return { needs: true, reason: '4+ settimane senza deload' };
        }
        
        // Check 4: HRV in calo costante
        if (recentData.length >= 3) {
            const hrvValues = recentData.map(w => w.hrv).filter(v => v > 0);
            if (hrvValues.length >= 3) {
                const trend = this.calculateTrend(hrvValues);
                if (trend < -0.15) {
                    return { needs: true, reason: 'HRV in calo costante' };
                }
            }
        }
        
        return { needs: false, reason: null };
    },

    /**
     * Calcola trend di una serie di valori (positivo = crescita, negativo = calo)
     */
    calculateTrend(values) {
        if (values.length < 2) return 0;
        const diffs = [];
        for (let i = 1; i < values.length; i++) {
            if (values[i-1] !== 0) {
                diffs.push((values[i] - values[i-1]) / values[i-1]);
            }
        }
        if (diffs.length === 0) return 0;
        return diffs.reduce((a, b) => a + b, 0) / diffs.length;
    },

    getWeekDataAll() {
        try {
            const data = localStorage.getItem(this.WEEK_DATA_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Errore lettura week data:', e);
            return {};
        }
    },

    saveWeekDataAll(data) {
        try {
            localStorage.setItem(this.WEEK_DATA_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Errore salvataggio week data:', e);
        }
    },

    /**
     * Carica ultimo workout per atleta
     */
    getLatest(athleteId) {
        const history = this.getAll();
        if (!history[athleteId] || history[athleteId].length === 0) return null;
        
        return history[athleteId]
            .sort((a, b) => b.weekNumber - a.weekNumber)[0];
    },

    /**
     * Carica workout di settimana specifica
     */
    getByWeek(athleteId, weekNumber) {
        const history = this.getAll();
        if (!history[athleteId]) return null;
        
        return history[athleteId].find(w => w.weekNumber === weekNumber) || null;
    },

    /**
     * Carica ultime N settimane
     */
    getLastN(athleteId, n = 4) {
        const history = this.getAll();
        if (!history[athleteId]) return [];
        
        return history[athleteId]
            .sort((a, b) => b.weekNumber - a.weekNumber)
            .slice(0, n);
    },

    /**
     * Genera context per prompt AI
     */
    generateProgressionContext(athleteId, currentWeek) {
        const lastWorkouts = this.getLastN(athleteId, 3);
        
        if (lastWorkouts.length === 0) {
            return `\n📈 STORICO: Nessun workout precedente - questa è la prima settimana.\n`;
        }
        
        let text = `\n📈 STORICO WORKOUT PRECEDENTI (per progressione):\n`;
        
        for (const entry of lastWorkouts) {
            text += `\n--- Settimana ${entry.weekNumber} ---\n`;
            
            if (entry.workout && entry.workout.exercises) {
                for (const ex of entry.workout.exercises.slice(0, 6)) { // Max 6 per brevità
                    text += `• ${ex.name} (${ex.sets}x${ex.reps})\n`;
                }
                if (entry.workout.exercises.length > 6) {
                    text += `  ... e altri ${entry.workout.exercises.length - 6} esercizi\n`;
                }
            }
        }
        
        text += `\n⚠️ IMPORTANTE: Progredisci da questi workout! Non ripetere identico.\n`;
        text += `Opzioni progressione:\n`;
        text += `• +1-2 reps su esercizi esistenti\n`;
        text += `• +1 set su esercizi chiave\n`;
        text += `• Aumenta intensità (RPE) mantenendo volume\n`;
        text += `• Introduci varianti più difficili degli stessi movimenti\n`;
        
        return text;
    },

    /**
     * Calcola progressione automatica
     */
    suggestProgression(athleteId, currentWeek) {
        const lastWorkout = this.getLatest(athleteId);
        
        if (!lastWorkout || !lastWorkout.workout) {
            return { type: 'first', suggestion: 'Prima settimana - inizia con volumi moderati' };
        }
        
        const weeksDiff = currentWeek - lastWorkout.weekNumber;
        
        if (weeksDiff === 1) {
            // Settimana consecutiva - progressione normale
            return { 
                type: 'progressive', 
                suggestion: '+5-10% volume o intensità rispetto a settimana scorsa',
                lastWorkout: lastWorkout.workout
            };
        } else if (weeksDiff > 4) {
            // Gap lungo - soft restart
            return {
                type: 'restart',
                suggestion: 'Gap lungo - riparti con volumi moderati (~80% ultimo workout)',
                lastWorkout: lastWorkout.workout
            };
        } else {
            // Gap moderato
            return {
                type: 'maintain',
                suggestion: 'Mantieni o leggera progressione rispetto a ultimo workout',
                lastWorkout: lastWorkout.workout
            };
        }
    },

    /**
     * Get all history
     */
    getAll() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Errore lettura history:', e);
            return {};
        }
    },

    /**
     * Save all history
     */
    saveAll(history) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
            console.error('Errore salvataggio history:', e);
        }
    },

    /**
     * Clear history for athlete
     */
    clearForAthlete(athleteId) {
        const history = this.getAll();
        delete history[athleteId];
        this.saveAll(history);
    },

    /**
     * Clear all history
     */
    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    /**
     * Export history (for backup)
     */
    export() {
        return JSON.stringify(this.getAll(), null, 2);
    },

    /**
     * Import history (from backup)
     */
    import(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.saveAll(data);
            return true;
        } catch (e) {
            console.error('Errore import:', e);
            return false;
        }
    },

    /**
     * Stats for debugging
     */
    getStats() {
        const history = this.getAll();
        const stats = {
            totalAthletes: Object.keys(history).length,
            totalWorkouts: 0,
            athleteStats: {}
        };
        
        for (const [athleteId, workouts] of Object.entries(history)) {
            stats.totalWorkouts += workouts.length;
            stats.athleteStats[athleteId] = {
                workoutCount: workouts.length,
                weeks: workouts.map(w => w.weekNumber).sort((a,b) => a-b)
            };
        }
        
        return stats;
    }
};

// Export
window.WorkoutHistory = WorkoutHistory;
