/**
 * GR Perform - Feedback Learner
 * 
 * SUPERA IL COACH UMANO: Memoria perfetta di ogni feedback,
 * pattern recognition automatico, apprendimento continuo.
 * 
 * Un coach umano dimentica. Questo sistema MAI.
 */

window.FeedbackLearner = (function() {
    'use strict';

    const VERSION = '1.0';
    const STORAGE_KEY = 'gr_feedback_learner_v1';

    // ═══════════════════════════════════════════════════════════════
    // STRUTTURA DATI IN-MEMORY (sincronizzata con localStorage + Supabase)
    // ═══════════════════════════════════════════════════════════════
    
    // Per atleta: preferenze esercizi apprese
    // { athleteId: { exerciseName: { avoid, reduceVolume, preferAlternative, successRate, lastFeedback } } }
    let exercisePreferences = {};
    
    // Per atleta: pattern temporali (quando performa meglio)
    // { athleteId: { bestDayOfWeek, bestTimeOfDay, worstConditions } }
    let temporalPatterns = {};
    
    // Per atleta: soglie personali apprese
    // { athleteId: { maxRPE, optimalVolume, recoveryNeeded, fatigueThreshold } }
    let personalThresholds = {};
    
    // Cross-athlete: pattern globali (cosa funziona per sport/livello)
    // { sport_level: { topExercises: [], avoidPatterns: [], avgRecovery } }
    let globalPatterns = {};

    // ═══════════════════════════════════════════════════════════════
    // INIZIALIZZAZIONE
    // ═══════════════════════════════════════════════════════════════
    
    function init() {
        loadFromStorage();
        console.log('🧠 FeedbackLearner initialized', {
            athletes: Object.keys(exercisePreferences).length,
            globalPatterns: Object.keys(globalPatterns).length
        });
    }

    function loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                exercisePreferences = data.exercisePreferences || {};
                temporalPatterns = data.temporalPatterns || {};
                personalThresholds = data.personalThresholds || {};
                globalPatterns = data.globalPatterns || {};
            }
        } catch (e) {
            console.warn('FeedbackLearner: Failed to load from storage', e);
        }
    }

    function saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                exercisePreferences,
                temporalPatterns,
                personalThresholds,
                globalPatterns,
                lastUpdated: new Date().toISOString()
            }));
        } catch (e) {
            console.warn('FeedbackLearner: Failed to save to storage', e);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // RECORDING: Cattura feedback dall'atleta
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Registra feedback su un singolo esercizio
     * @param {string} athleteId 
     * @param {string} exerciseName 
     * @param {object} feedback - { rpe, feeling, pain, notes, completed }
     */
    function recordExerciseFeedback(athleteId, exerciseName, feedback) {
        if (!athleteId || !exerciseName) return;
        
        const key = normalizeExerciseName(exerciseName);
        
        if (!exercisePreferences[athleteId]) {
            exercisePreferences[athleteId] = {};
        }
        
        const pref = exercisePreferences[athleteId][key] || {
            totalSessions: 0,
            successCount: 0,
            painCount: 0,
            avgRPE: 0,
            rpeHistory: [],
            painAreas: [],
            alternatives: [],
            lastFeedback: null,
            status: 'neutral' // neutral, preferred, caution, avoid
        };
        
        // Aggiorna statistiche
        pref.totalSessions++;
        
        const rpe = parseFloat(feedback.rpe) || 0;
        if (rpe > 0) {
            pref.rpeHistory.push(rpe);
            if (pref.rpeHistory.length > 20) pref.rpeHistory.shift();
            pref.avgRPE = pref.rpeHistory.reduce((a, b) => a + b, 0) / pref.rpeHistory.length;
        }
        
        // Feedback positivo
        if (feedback.feeling >= 4 || (feedback.completed && rpe <= 7)) {
            pref.successCount++;
        }
        
        // Feedback negativo (dolore)
        if (feedback.pain && feedback.pain !== 'none') {
            pref.painCount++;
            if (!pref.painAreas.includes(feedback.pain)) {
                pref.painAreas.push(feedback.pain);
            }
        }
        
        // Calcola status
        const successRate = pref.totalSessions > 0 ? pref.successCount / pref.totalSessions : 0.5;
        const painRate = pref.totalSessions > 0 ? pref.painCount / pref.totalSessions : 0;
        
        if (painRate > 0.3) {
            pref.status = 'avoid';
        } else if (painRate > 0.15 || pref.avgRPE > 8.5) {
            pref.status = 'caution';
        } else if (successRate > 0.7 && pref.avgRPE <= 7) {
            pref.status = 'preferred';
        } else {
            pref.status = 'neutral';
        }
        
        pref.lastFeedback = {
            date: new Date().toISOString(),
            ...feedback
        };
        
        exercisePreferences[athleteId][key] = pref;
        
        // Aggiorna pattern globali
        updateGlobalPatterns(athleteId, key, feedback);
        
        saveToStorage();
        
        console.log(`🧠 Learned: ${key} → ${pref.status} (success: ${Math.round(successRate * 100)}%, pain: ${Math.round(painRate * 100)}%)`);
        
        return pref;
    }

    /**
     * Registra feedback sulla sessione completa
     */
    function recordSessionFeedback(athleteId, sessionData) {
        if (!athleteId) return;
        
        const { dayOfWeek, timeOfDay, rpe, feeling, sleepHours, completed } = sessionData;
        
        if (!temporalPatterns[athleteId]) {
            temporalPatterns[athleteId] = {
                dayPerformance: {}, // { monday: { sessions: 0, avgFeeling: 0 }, ... }
                timePerformance: {}, // { morning: {...}, afternoon: {...}, evening: {...} }
                sleepCorrelation: [] // [{ sleep, feeling }, ...]
            };
        }
        
        const tp = temporalPatterns[athleteId];
        
        // Performance per giorno
        if (dayOfWeek) {
            const day = dayOfWeek.toLowerCase();
            if (!tp.dayPerformance[day]) {
                tp.dayPerformance[day] = { sessions: 0, totalFeeling: 0, totalRPE: 0 };
            }
            tp.dayPerformance[day].sessions++;
            tp.dayPerformance[day].totalFeeling += feeling || 3;
            tp.dayPerformance[day].totalRPE += rpe || 6;
        }
        
        // Performance per orario
        if (timeOfDay) {
            const time = categorizeTime(timeOfDay);
            if (!tp.timePerformance[time]) {
                tp.timePerformance[time] = { sessions: 0, totalFeeling: 0, totalRPE: 0 };
            }
            tp.timePerformance[time].sessions++;
            tp.timePerformance[time].totalFeeling += feeling || 3;
            tp.timePerformance[time].totalRPE += rpe || 6;
        }
        
        // Correlazione sonno
        if (sleepHours && feeling) {
            tp.sleepCorrelation.push({ sleep: sleepHours, feeling });
            if (tp.sleepCorrelation.length > 50) tp.sleepCorrelation.shift();
        }
        
        // Aggiorna soglie personali
        updatePersonalThresholds(athleteId, sessionData);
        
        saveToStorage();
    }

    /**
     * Registra quando l'atleta salta o modifica un esercizio
     */
    function recordExerciseSkipped(athleteId, exerciseName, reason) {
        if (!athleteId || !exerciseName) return;
        
        const key = normalizeExerciseName(exerciseName);
        
        if (!exercisePreferences[athleteId]) {
            exercisePreferences[athleteId] = {};
        }
        
        const pref = exercisePreferences[athleteId][key] || {
            totalSessions: 0,
            successCount: 0,
            skipCount: 0,
            skipReasons: [],
            status: 'neutral'
        };
        
        pref.skipCount = (pref.skipCount || 0) + 1;
        pref.skipReasons = pref.skipReasons || [];
        if (reason && !pref.skipReasons.includes(reason)) {
            pref.skipReasons.push(reason);
        }
        
        // Se skippato troppo, diventa caution
        if (pref.skipCount >= 3) {
            pref.status = 'caution';
        }
        
        exercisePreferences[athleteId][key] = pref;
        saveToStorage();
        
        console.log(`🧠 Learned: ${key} skipped (${pref.skipCount}x) - ${reason || 'no reason'}`);
    }

    // ═══════════════════════════════════════════════════════════════
    // INFERENCE: Usa le conoscenze apprese
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Ottieni modificatori per la generazione workout
     * @returns {{ exercisesToAvoid, exercisesToPrefer, volumeModifier, intensityModifier }}
     */
    function getWorkoutModifiers(athleteId) {
        const modifiers = {
            exercisesToAvoid: [],
            exercisesToCaution: [],
            exercisesToPrefer: [],
            volumeModifier: 1.0,
            intensityModifier: 1.0,
            notes: []
        };
        
        if (!athleteId) return modifiers;
        
        // Esercizi da evitare/preferire
        const prefs = exercisePreferences[athleteId] || {};
        for (const [name, pref] of Object.entries(prefs)) {
            if (pref.status === 'avoid') {
                modifiers.exercisesToAvoid.push(name);
            } else if (pref.status === 'caution') {
                modifiers.exercisesToCaution.push(name);
            } else if (pref.status === 'preferred') {
                modifiers.exercisesToPrefer.push(name);
            }
        }
        
        // Soglie personali
        const thresholds = personalThresholds[athleteId];
        if (thresholds) {
            // Se RPE medio troppo alto, riduci intensità
            if (thresholds.avgRPE > 8) {
                modifiers.intensityModifier = 0.9;
                modifiers.notes.push('RPE storico alto → intensità ridotta 10%');
            }
            
            // Se compliance bassa, riduci volume
            if (thresholds.avgCompliance < 70) {
                modifiers.volumeModifier = 0.85;
                modifiers.notes.push('Compliance storica bassa → volume ridotto 15%');
            }
            
            // Se recovery time alto, più riposo
            if (thresholds.avgRecoveryDays > 3) {
                modifiers.volumeModifier *= 0.9;
                modifiers.notes.push('Recovery lento → volume aggiuntivo -10%');
            }
        }
        
        return modifiers;
    }

    /**
     * Ottieni il giorno/orario ottimale per questo atleta
     */
    function getOptimalSchedule(athleteId) {
        const result = {
            bestDay: null,
            worstDay: null,
            bestTime: null,
            sleepRecommendation: null
        };
        
        const tp = temporalPatterns[athleteId];
        if (!tp) return result;
        
        // Trova giorno migliore/peggiore
        let bestDayScore = -Infinity;
        let worstDayScore = Infinity;
        
        for (const [day, data] of Object.entries(tp.dayPerformance || {})) {
            if (data.sessions >= 3) { // Minimo 3 sessioni per essere significativo
                const avgFeeling = data.totalFeeling / data.sessions;
                if (avgFeeling > bestDayScore) {
                    bestDayScore = avgFeeling;
                    result.bestDay = day;
                }
                if (avgFeeling < worstDayScore) {
                    worstDayScore = avgFeeling;
                    result.worstDay = day;
                }
            }
        }
        
        // Trova orario migliore
        let bestTimeScore = -Infinity;
        for (const [time, data] of Object.entries(tp.timePerformance || {})) {
            if (data.sessions >= 3) {
                const avgFeeling = data.totalFeeling / data.sessions;
                if (avgFeeling > bestTimeScore) {
                    bestTimeScore = avgFeeling;
                    result.bestTime = time;
                }
            }
        }
        
        // Correlazione sonno
        const sleepData = tp.sleepCorrelation || [];
        if (sleepData.length >= 10) {
            const goodSessions = sleepData.filter(s => s.feeling >= 4);
            if (goodSessions.length > 0) {
                const avgSleepGood = goodSessions.reduce((a, s) => a + s.sleep, 0) / goodSessions.length;
                result.sleepRecommendation = Math.round(avgSleepGood * 10) / 10;
            }
        }
        
        return result;
    }

    /**
     * Predici il feeling/RPE per una sessione futura
     */
    function predictSessionOutcome(athleteId, context) {
        const prediction = {
            expectedRPE: 6.5,
            expectedFeeling: 3.5,
            confidence: 'low',
            factors: []
        };
        
        const thresholds = personalThresholds[athleteId];
        const tp = temporalPatterns[athleteId];
        
        if (!thresholds && !tp) return prediction;
        
        let rpeBase = thresholds?.avgRPE || 6.5;
        let feelingBase = 3.5;
        let confidenceScore = 0;
        
        // Fattore: giorno della settimana
        if (context.dayOfWeek && tp?.dayPerformance) {
            const dayData = tp.dayPerformance[context.dayOfWeek.toLowerCase()];
            if (dayData?.sessions >= 3) {
                const avgFeeling = dayData.totalFeeling / dayData.sessions;
                feelingBase = avgFeeling;
                confidenceScore += 20;
                prediction.factors.push(`${context.dayOfWeek}: feeling medio ${avgFeeling.toFixed(1)}`);
            }
        }
        
        // Fattore: sonno
        if (context.sleepHours && tp?.sleepCorrelation?.length > 5) {
            const similar = tp.sleepCorrelation.filter(s => Math.abs(s.sleep - context.sleepHours) < 1);
            if (similar.length >= 3) {
                const avgFeeling = similar.reduce((a, s) => a + s.feeling, 0) / similar.length;
                feelingBase = (feelingBase + avgFeeling) / 2;
                confidenceScore += 15;
                prediction.factors.push(`Sonno ${context.sleepHours}h: feeling atteso ${avgFeeling.toFixed(1)}`);
            }
        }
        
        // Fattore: fase del mesociclo
        if (context.week && context.phase) {
            const phaseRPEMod = {
                'deload': -1.5,
                'accumulo': 0,
                'intensificazione': +0.5,
                'peaking': +1
            };
            const mod = phaseRPEMod[context.phase.toLowerCase()] || 0;
            rpeBase += mod;
            confidenceScore += 10;
            prediction.factors.push(`Fase ${context.phase}: RPE mod ${mod > 0 ? '+' : ''}${mod}`);
        }
        
        prediction.expectedRPE = Math.round(rpeBase * 10) / 10;
        prediction.expectedFeeling = Math.round(feelingBase * 10) / 10;
        prediction.confidence = confidenceScore >= 30 ? 'high' : confidenceScore >= 15 ? 'medium' : 'low';
        
        return prediction;
    }

    /**
     * Genera prompt section per l'AI basata su apprendimento
     */
    function generatePromptSection(athleteId) {
        const modifiers = getWorkoutModifiers(athleteId);
        const schedule = getOptimalSchedule(athleteId);
        
        const lines = ['═══ APPRENDIMENTO DA FEEDBACK (FeedbackLearner) ═══'];
        
        if (modifiers.exercisesToAvoid.length > 0) {
            lines.push(`⛔ EVITA questi esercizi (causano dolore/problemi): ${modifiers.exercisesToAvoid.join(', ')}`);
        }
        
        if (modifiers.exercisesToCaution.length > 0) {
            lines.push(`⚠️ USA CON CAUTELA (RPE alto o skip frequenti): ${modifiers.exercisesToCaution.join(', ')}`);
        }
        
        if (modifiers.exercisesToPrefer.length > 0) {
            lines.push(`✅ PREFERISCI questi (alto success rate): ${modifiers.exercisesToPrefer.join(', ')}`);
        }
        
        if (modifiers.volumeModifier !== 1.0 || modifiers.intensityModifier !== 1.0) {
            lines.push(`📊 Modificatori: Volume ${Math.round(modifiers.volumeModifier * 100)}% | Intensità ${Math.round(modifiers.intensityModifier * 100)}%`);
        }
        
        for (const note of modifiers.notes) {
            lines.push(`💡 ${note}`);
        }
        
        if (schedule.bestDay) {
            lines.push(`📅 Giorno migliore storico: ${schedule.bestDay}`);
        }
        
        if (schedule.sleepRecommendation) {
            lines.push(`😴 Sonno ottimale per questo atleta: ${schedule.sleepRecommendation}h`);
        }
        
        if (lines.length === 1) {
            return ''; // Nessun apprendimento ancora
        }
        
        return lines.join('\n');
    }

    // ═══════════════════════════════════════════════════════════════
    // GLOBAL PATTERNS: Apprendimento cross-atleta
    // ═══════════════════════════════════════════════════════════════
    
    function updateGlobalPatterns(athleteId, exerciseName, feedback) {
        // Per ora usiamo localStorage, ma in produzione andrebbe su Supabase
        // per aggregare da tutti gli atleti
        
        // Placeholder per pattern sport-specific
        // In futuro: query Supabase per pattern aggregati
    }

    /**
     * Ottieni esercizi più efficaci per sport/livello/fase
     */
    function getTopExercisesForContext(sport, level, phase) {
        const key = `${sport}_${level}_${phase}`.toLowerCase();
        const pattern = globalPatterns[key];
        
        if (pattern?.topExercises) {
            return pattern.topExercises;
        }
        
        // Fallback: analizza tutti gli atleti locali
        const exerciseScores = {};
        
        for (const [athleteId, prefs] of Object.entries(exercisePreferences)) {
            for (const [name, pref] of Object.entries(prefs)) {
                if (pref.status === 'preferred' || (pref.totalSessions >= 5 && pref.successCount / pref.totalSessions > 0.7)) {
                    exerciseScores[name] = (exerciseScores[name] || 0) + 1;
                }
            }
        }
        
        return Object.entries(exerciseScores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name]) => name);
    }

    // ═══════════════════════════════════════════════════════════════
    // HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════
    
    function normalizeExerciseName(name) {
        return String(name || '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[^a-z0-9 ]/g, '');
    }

    function categorizeTime(time) {
        if (!time) return 'unknown';
        const hour = parseInt(String(time).split(':')[0]) || 12;
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        return 'evening';
    }

    function updatePersonalThresholds(athleteId, sessionData) {
        if (!personalThresholds[athleteId]) {
            personalThresholds[athleteId] = {
                sessions: 0,
                totalRPE: 0,
                totalCompliance: 0,
                recoveryDays: []
            };
        }
        
        const pt = personalThresholds[athleteId];
        pt.sessions++;
        
        if (sessionData.rpe) {
            pt.totalRPE += sessionData.rpe;
            pt.avgRPE = pt.totalRPE / pt.sessions;
        }
        
        if (sessionData.compliance) {
            pt.totalCompliance += sessionData.compliance;
            pt.avgCompliance = pt.totalCompliance / pt.sessions;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // ANALYTICS: Statistiche apprendimento
    // ═══════════════════════════════════════════════════════════════
    
    function getStats() {
        let totalExercisesLearned = 0;
        let totalAthletesTracked = Object.keys(exercisePreferences).length;
        let totalAvoidances = 0;
        let totalPreferences = 0;
        
        for (const prefs of Object.values(exercisePreferences)) {
            for (const pref of Object.values(prefs)) {
                totalExercisesLearned++;
                if (pref.status === 'avoid') totalAvoidances++;
                if (pref.status === 'preferred') totalPreferences++;
            }
        }
        
        return {
            version: VERSION,
            athletesTracked: totalAthletesTracked,
            exercisesLearned: totalExercisesLearned,
            avoidances: totalAvoidances,
            preferences: totalPreferences,
            temporalPatterns: Object.keys(temporalPatterns).length,
            thresholds: Object.keys(personalThresholds).length
        };
    }

    /**
     * Export dati per debug/backup
     */
    function exportData() {
        return {
            exercisePreferences,
            temporalPatterns,
            personalThresholds,
            globalPatterns,
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Import dati (per restore)
     */
    function importData(data) {
        if (data.exercisePreferences) exercisePreferences = data.exercisePreferences;
        if (data.temporalPatterns) temporalPatterns = data.temporalPatterns;
        if (data.personalThresholds) personalThresholds = data.personalThresholds;
        if (data.globalPatterns) globalPatterns = data.globalPatterns;
        saveToStorage();
        console.log('🧠 FeedbackLearner: Data imported');
    }

    /**
     * Reset dati per un atleta
     */
    function resetAthlete(athleteId) {
        delete exercisePreferences[athleteId];
        delete temporalPatterns[athleteId];
        delete personalThresholds[athleteId];
        saveToStorage();
        console.log(`🧠 FeedbackLearner: Reset data for athlete ${athleteId}`);
    }

    // Inizializza al caricamento
    init();

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════
    
    return {
        VERSION,
        
        // Recording
        recordExerciseFeedback,
        recordSessionFeedback,
        recordExerciseSkipped,
        
        // Inference
        getWorkoutModifiers,
        getOptimalSchedule,
        predictSessionOutcome,
        generatePromptSection,
        
        // Cross-athlete
        getTopExercisesForContext,
        
        // Analytics
        getStats,
        exportData,
        importData,
        resetAthlete
    };
})();

console.log('🧠 FeedbackLearner module loaded');
