/**
 * EXERCISE MEMORY - GR Perform
 * 
 * Traccia quali esercizi sono stati usati per evitare ripetizioni eccessive.
 * Garantisce varietà nella programmazione settimanale e nel tempo.
 * 
 * @version 1.0.0
 * @date 2024-12-19
 */

window.ExerciseMemory = (function() {
    'use strict';

    const STORAGE_KEY = 'grperform_exercise_memory';
    const DEFAULT_AVOID_WINDOW = 2; // Evita ripetizioni nelle ultime N settimane

    // ============================================
    // STORAGE
    // ============================================
    
    function loadMemory() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.warn('Errore caricamento exercise memory:', e);
            return {};
        }
    }
    
    function saveMemory(memory) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
        } catch (e) {
            console.warn('Errore salvataggio exercise memory:', e);
        }
    }

    // ============================================
    // TRACKING
    // ============================================
    
    /**
     * Registra gli esercizi usati in un workout
     */
    function recordWorkout(athleteId, workoutData) {
        const { weekNumber, dayOfWeek, exercises, date } = workoutData;
        
        const memory = loadMemory();
        if (!memory[athleteId]) {
            memory[athleteId] = {
                exercises: {},
                workouts: [],
                stats: {}
            };
        }
        
        const athleteMemory = memory[athleteId];
        const workoutDate = date || new Date().toISOString().split('T')[0];
        
        // Registra ogni esercizio
        exercises.forEach(exercise => {
            const name = normalizeExerciseName(exercise.name || exercise);
            
            if (!athleteMemory.exercises[name]) {
                athleteMemory.exercises[name] = {
                    firstUsed: workoutDate,
                    lastUsed: workoutDate,
                    usageCount: 0,
                    weeklyUsage: {}
                };
            }
            
            const exData = athleteMemory.exercises[name];
            exData.lastUsed = workoutDate;
            exData.usageCount++;
            
            // Track per settimana
            const weekKey = `week_${weekNumber}`;
            if (!exData.weeklyUsage[weekKey]) {
                exData.weeklyUsage[weekKey] = 0;
            }
            exData.weeklyUsage[weekKey]++;
        });
        
        // Registra il workout
        athleteMemory.workouts.push({
            date: workoutDate,
            week: weekNumber,
            day: dayOfWeek,
            exerciseCount: exercises.length,
            exercises: exercises.map(e => normalizeExerciseName(e.name || e))
        });
        
        // Limita storico a ultimi 6 mesi (26 settimane)
        if (athleteMemory.workouts.length > 156) { // ~6 workout/settimana * 26 settimane
            athleteMemory.workouts = athleteMemory.workouts.slice(-156);
        }
        
        saveMemory(memory);
        console.log('💾 Exercise memory aggiornata:', exercises.length, 'esercizi');
        
        return { success: true };
    }

    /**
     * Normalizza il nome dell'esercizio per confronti
     */
    function normalizeExerciseName(name) {
        return String(name || '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s]/g, '');
    }

    /**
     * Ottieni esercizi da evitare (usati di recente)
     */
    function getExercisesToAvoid(athleteId, currentWeek, windowWeeks = DEFAULT_AVOID_WINDOW) {
        const memory = loadMemory();
        const athleteMemory = memory[athleteId];
        
        if (!athleteMemory) return [];
        
        const toAvoid = [];
        const minWeek = currentWeek - windowWeeks;
        
        Object.entries(athleteMemory.exercises).forEach(([name, data]) => {
            // Controlla se usato nelle settimane recenti
            let recentUsage = 0;
            for (let w = minWeek; w < currentWeek; w++) {
                const weekKey = `week_${w}`;
                if (data.weeklyUsage[weekKey]) {
                    recentUsage += data.weeklyUsage[weekKey];
                }
            }
            
            if (recentUsage >= 2) { // Se usato 2+ volte nelle ultime N settimane
                toAvoid.push({
                    name: name,
                    reason: `usato ${recentUsage}x nelle ultime ${windowWeeks} settimane`,
                    lastUsed: data.lastUsed,
                    totalUsage: data.usageCount
                });
            }
        });
        
        return toAvoid;
    }

    /**
     * Ottieni esercizi suggeriti (poco usati o mai usati)
     */
    function getSuggestedExercises(athleteId, category = null) {
        const memory = loadMemory();
        const athleteMemory = memory[athleteId];
        
        if (!athleteMemory) return [];
        
        // Ordina per uso (meno usati prima)
        const sorted = Object.entries(athleteMemory.exercises)
            .map(([name, data]) => ({
                name,
                usageCount: data.usageCount,
                lastUsed: data.lastUsed,
                daysSinceUse: Math.floor((new Date() - new Date(data.lastUsed)) / (24 * 60 * 60 * 1000))
            }))
            .sort((a, b) => {
                // Prima per giorni dall'ultimo uso (più giorni = meglio)
                const daysDiff = b.daysSinceUse - a.daysSinceUse;
                if (daysDiff !== 0) return daysDiff;
                // Poi per uso totale (meno uso = meglio)
                return a.usageCount - b.usageCount;
            });
        
        return sorted.slice(0, 10); // Top 10 suggeriti
    }

    /**
     * Genera contesto per il prompt AI
     */
    function generatePromptContext(athleteId, currentWeek, windowWeeks = DEFAULT_AVOID_WINDOW) {
        const toAvoid = getExercisesToAvoid(athleteId, currentWeek, windowWeeks);
        
        if (toAvoid.length === 0) return '';
        
        let text = '\n\n📝 MEMORIA ESERCIZI - Evita ripetizioni:';
        text += `\n   Esercizi usati frequentemente nelle ultime ${windowWeeks} settimane:`;
        
        toAvoid.slice(0, 8).forEach(ex => {
            text += `\n   - "${ex.name}" (${ex.reason})`;
        });
        
        text += '\n   → Usa varianti o esercizi alternativi per questi gruppi muscolari.';
        
        return text;
    }

    /**
     * Ottieni statistiche di varietà
     */
    function getVarietyStats(athleteId) {
        const memory = loadMemory();
        const athleteMemory = memory[athleteId];
        
        if (!athleteMemory) {
            return {
                totalExercises: 0,
                uniqueExercises: 0,
                varietyScore: 100,
                mostUsed: [],
                leastUsed: []
            };
        }
        
        const exercises = Object.entries(athleteMemory.exercises);
        const totalWorkouts = athleteMemory.workouts.length;
        const uniqueCount = exercises.length;
        
        // Calcola varietà: più esercizi unici = punteggio più alto
        const avgUsage = totalWorkouts > 0 ? 
            exercises.reduce((sum, [_, data]) => sum + data.usageCount, 0) / exercises.length : 0;
        
        const varietyScore = Math.min(100, Math.round((uniqueCount / Math.max(1, totalWorkouts)) * 100));
        
        // Top 5 più usati
        const sortedByUsage = exercises
            .map(([name, data]) => ({ name, count: data.usageCount }))
            .sort((a, b) => b.count - a.count);
        
        return {
            totalWorkouts,
            uniqueExercises: uniqueCount,
            varietyScore,
            mostUsed: sortedByUsage.slice(0, 5),
            leastUsed: sortedByUsage.slice(-5).reverse()
        };
    }

    /**
     * Pulisci memoria vecchia (oltre 6 mesi)
     */
    function cleanOldData(athleteId, monthsToKeep = 6) {
        const memory = loadMemory();
        const athleteMemory = memory[athleteId];
        
        if (!athleteMemory) return;
        
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - monthsToKeep);
        const cutoffStr = cutoffDate.toISOString().split('T')[0];
        
        // Filtra workout
        athleteMemory.workouts = athleteMemory.workouts.filter(w => w.date >= cutoffStr);
        
        // Ricalcola usage per esercizi
        const newExercises = {};
        athleteMemory.workouts.forEach(workout => {
            workout.exercises.forEach(exName => {
                if (!newExercises[exName]) {
                    newExercises[exName] = {
                        firstUsed: workout.date,
                        lastUsed: workout.date,
                        usageCount: 0,
                        weeklyUsage: {}
                    };
                }
                newExercises[exName].lastUsed = workout.date;
                newExercises[exName].usageCount++;
                
                const weekKey = `week_${workout.week}`;
                if (!newExercises[exName].weeklyUsage[weekKey]) {
                    newExercises[exName].weeklyUsage[weekKey] = 0;
                }
                newExercises[exName].weeklyUsage[weekKey]++;
            });
        });
        
        athleteMemory.exercises = newExercises;
        saveMemory(memory);
        
        console.log('🧹 Exercise memory pulita, mantenuti ultimi', monthsToKeep, 'mesi');
    }

    // ============================================
    // API PUBBLICA
    // ============================================
    
    return {
        record: recordWorkout,
        getToAvoid: getExercisesToAvoid,
        getSuggested: getSuggestedExercises,
        generatePromptContext: generatePromptContext,
        getStats: getVarietyStats,
        clean: cleanOldData,
        
        // Utility
        normalize: normalizeExerciseName,
        
        // Debug
        getAll: function(athleteId) {
            const memory = loadMemory();
            return memory[athleteId] || null;
        },
        
        clear: function(athleteId) {
            const memory = loadMemory();
            delete memory[athleteId];
            saveMemory(memory);
        }
    };
})();

console.log('📝 ExerciseMemory caricato');
