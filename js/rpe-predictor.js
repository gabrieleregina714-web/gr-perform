/**
 * GR Perform - RPE Predictor
 * 
 * SUPERA IL COACH UMANO: Predizione scientifica del carico
 * basata su modelli statistici e machine learning leggero.
 * 
 * Un coach umano stima a occhio. Questo sistema usa dati.
 */

window.RPEPredictor = (function() {
    'use strict';

    const VERSION = '1.0';
    const STORAGE_KEY = 'gr_rpe_predictor_v1';

    // Storico sessioni per atleta (per training del modello)
    // { athleteId: [{ date, exercises, predictedRPE, actualRPE, accuracy, context }] }
    let sessionHistory = {};

    // Coefficienti appresi per atleta (regressione semplice)
    // { athleteId: { sleepCoef, stressCoef, volumeCoef, intensityCoef, baseRPE } }
    let personalCoefficients = {};

    // ═══════════════════════════════════════════════════════════════
    // MODELLO BASE: Stima RPE senza storico personale
    // ═══════════════════════════════════════════════════════════════
    
    const BASE_MODEL = {
        // RPE base per fase (scala 1-10)
        phaseBase: {
            adattamento: 5.0,
            accumulo: 6.5,
            intensificazione: 7.5,
            peaking: 8.0,
            realizzazione: 8.5,
            deload: 4.5
        },
        
        // Modificatori per volume (sets totali)
        volumeModifiers: {
            low: { max: 15, mod: -0.5 },      // < 15 sets
            medium: { max: 25, mod: 0 },      // 15-25 sets
            high: { max: 35, mod: +0.5 },     // 25-35 sets
            extreme: { max: 999, mod: +1.0 }  // > 35 sets
        },
        
        // Modificatori per sonno
        sleepModifiers: {
            critical: { max: 5, mod: +1.5 },   // < 5h
            poor: { max: 6, mod: +1.0 },       // 5-6h
            suboptimal: { max: 7, mod: +0.5 }, // 6-7h
            normal: { max: 8, mod: 0 },        // 7-8h
            good: { max: 9, mod: -0.3 },       // 8-9h
            excellent: { max: 99, mod: -0.5 }  // > 9h
        },
        
        // Modificatori per stress
        stressModifiers: {
            low: { max: 3, mod: -0.3 },
            normal: { max: 6, mod: 0 },
            high: { max: 8, mod: +0.5 },
            extreme: { max: 10, mod: +1.0 }
        },
        
        // Modificatori per readiness
        readinessModifiers: {
            critical: { max: 40, mod: +1.5 },
            low: { max: 60, mod: +0.8 },
            medium: { max: 80, mod: 0 },
            high: { max: 100, mod: -0.5 }
        },
        
        // Modificatori per giorno della settimana
        dayModifiers: {
            monday: 0,
            tuesday: +0.2,
            wednesday: +0.3,
            thursday: +0.2,
            friday: 0,
            saturday: -0.2,
            sunday: -0.3
        },
        
        // Modificatori per tipo esercizi dominante
        exerciseTypeModifiers: {
            strength_dominant: +0.5,  // > 50% strength
            hypertrophy_dominant: 0,   // > 50% hypertrophy
            conditioning_dominant: -0.3 // > 50% conditioning
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // INIZIALIZZAZIONE
    // ═══════════════════════════════════════════════════════════════
    
    function init() {
        loadFromStorage();
        console.log('📊 RPEPredictor initialized', {
            athletesTracked: Object.keys(sessionHistory).length,
            withPersonalModels: Object.keys(personalCoefficients).length
        });
    }

    function loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                sessionHistory = data.sessionHistory || {};
                personalCoefficients = data.personalCoefficients || {};
            }
        } catch (e) {
            console.warn('RPEPredictor: Failed to load from storage', e);
        }
    }

    function saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                sessionHistory,
                personalCoefficients,
                lastUpdated: new Date().toISOString()
            }));
        } catch (e) {
            console.warn('RPEPredictor: Failed to save to storage', e);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // PREDIZIONE RPE
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Predici RPE per un workout
     * @param {object} workout - { exercises: [], phase, ... }
     * @param {object} context - { athleteId, sleep, stress, readiness, dayOfWeek, ... }
     * @returns {{ predictedRPE, confidence, range, factors, recommendation }}
     */
    function predict(workout, context) {
        const result = {
            predictedRPE: 6.5,
            confidence: 'low',
            range: { min: 5.5, max: 7.5 },
            factors: [],
            recommendation: ''
        };
        
        // Supporta sia workout object che context-only - DEFENSIVE
        const ctx = (context && typeof context === 'object') ? context : {};
        const exercises = (workout && workout.exercises) ? workout.exercises : [];
        const phase = String((workout && workout.phase) || ctx.phase || 'accumulo').toLowerCase();
        const athleteId = (ctx && ctx.athleteId) ? ctx.athleteId : null;
        
        // Se non c'è workout, usa solo i fattori dal context
        if (!workout && !exercises.length) {
            // Predizione base solo da context
            let rpe = BASE_MODEL.phaseBase[phase] || 6.5;
            result.factors.push({ name: 'Fase', value: phase, contribution: rpe, type: 'base' });
            
            // Modificatore readiness
            if (ctx.readiness !== undefined) {
                const readinessMod = ctx.readiness >= 80 ? -0.5 : ctx.readiness >= 60 ? 0 : ctx.readiness >= 40 ? 0.5 : 1.0;
                rpe += readinessMod;
                result.factors.push({ name: 'Readiness', value: `${ctx.readiness}%`, contribution: readinessMod, type: 'modifier' });
            }
            
            // Modificatore stress
            if (ctx.stressLevel) {
                const stressMod = ctx.stressLevel === 'high' ? 0.5 : ctx.stressLevel === 'low' ? -0.3 : 0;
                rpe += stressMod;
                result.factors.push({ name: 'Stress', value: ctx.stressLevel, contribution: stressMod, type: 'modifier' });
            }
            
            result.predictedRPE = Math.round(Math.max(1, Math.min(10, rpe)) * 10) / 10;
            result.range = { min: Math.max(1, result.predictedRPE - 1), max: Math.min(10, result.predictedRPE + 1) };
            result.confidence = 'low';
            result.recommendation = 'Predizione base - aggiungi workout per maggiore precisione';
            return result;
        }
        
        // Step 1: RPE base dalla fase
        let rpe = BASE_MODEL.phaseBase[phase] || 6.5;
        result.factors.push({
            name: 'Fase',
            value: phase,
            contribution: rpe,
            type: 'base'
        });
        
        // Step 2: Modificatore volume
        const totalSets = exercises.reduce((sum, ex) => sum + (parseInt(ex.sets) || 0), 0);
        let volumeMod = 0;
        for (const [level, config] of Object.entries(BASE_MODEL.volumeModifiers)) {
            if (totalSets <= config.max) {
                volumeMod = config.mod;
                result.factors.push({
                    name: 'Volume',
                    value: `${totalSets} sets (${level})`,
                    contribution: volumeMod,
                    type: 'modifier'
                });
                break;
            }
        }
        rpe += volumeMod;
        
        // Step 3: Modificatore sonno
        const sleep = parseFloat(ctx?.sleep) || 7;
        let sleepMod = 0;
        for (const [level, config] of Object.entries(BASE_MODEL.sleepModifiers)) {
            if (sleep <= config.max) {
                sleepMod = config.mod;
                result.factors.push({
                    name: 'Sonno',
                    value: `${sleep}h (${level})`,
                    contribution: sleepMod,
                    type: 'modifier'
                });
                break;
            }
        }
        rpe += sleepMod;
        
        // Step 4: Modificatore stress
        const stress = parseFloat(ctx?.stress) || 5;
        let stressMod = 0;
        for (const [level, config] of Object.entries(BASE_MODEL.stressModifiers)) {
            if (stress <= config.max) {
                stressMod = config.mod;
                result.factors.push({
                    name: 'Stress',
                    value: `${stress}/10 (${level})`,
                    contribution: stressMod,
                    type: 'modifier'
                });
                break;
            }
        }
        rpe += stressMod;
        
        // Step 5: Modificatore readiness
        if (ctx?.readiness) {
            let readinessMod = 0;
            for (const [level, config] of Object.entries(BASE_MODEL.readinessModifiers)) {
                if (ctx.readiness <= config.max) {
                    readinessMod = config.mod;
                    result.factors.push({
                        name: 'Readiness',
                        value: `${ctx.readiness}% (${level})`,
                        contribution: readinessMod,
                        type: 'modifier'
                    });
                    break;
                }
            }
            rpe += readinessMod;
        }
        
        // Step 6: Modificatore giorno
        if (ctx?.dayOfWeek) {
            const day = String(ctx.dayOfWeek).toLowerCase();
            const dayMod = BASE_MODEL.dayModifiers[day] || 0;
            if (dayMod !== 0) {
                rpe += dayMod;
                result.factors.push({
                    name: 'Giorno',
                    value: day,
                    contribution: dayMod,
                    type: 'modifier'
                });
            }
        }
        
        // Step 7: Tipo esercizi dominante
        const types = exercises.map(e => e.type || 'hypertrophy');
        const typeCount = { strength: 0, hypertrophy: 0, conditioning: 0 };
        types.forEach(t => typeCount[t] = (typeCount[t] || 0) + 1);
        const total = types.length || 1;
        
        if (typeCount.strength / total > 0.5) {
            rpe += BASE_MODEL.exerciseTypeModifiers.strength_dominant;
            result.factors.push({
                name: 'Tipo workout',
                value: 'Strength dominant',
                contribution: BASE_MODEL.exerciseTypeModifiers.strength_dominant,
                type: 'modifier'
            });
        } else if (typeCount.conditioning / total > 0.5) {
            rpe += BASE_MODEL.exerciseTypeModifiers.conditioning_dominant;
            result.factors.push({
                name: 'Tipo workout',
                value: 'Conditioning dominant',
                contribution: BASE_MODEL.exerciseTypeModifiers.conditioning_dominant,
                type: 'modifier'
            });
        }
        
        // Step 8: Coefficienti personali (se disponibili)
        const coefs = personalCoefficients[athleteId];
        if (coefs && coefs.sessions >= 10) {
            // Applica bias personale
            const personalBias = coefs.avgBias || 0;
            rpe += personalBias;
            result.factors.push({
                name: 'Bias personale',
                value: `${personalBias > 0 ? '+' : ''}${personalBias.toFixed(2)}`,
                contribution: personalBias,
                type: 'learned'
            });
        }
        
        // Clamp RPE
        rpe = Math.max(4, Math.min(10, rpe));
        rpe = Math.round(rpe * 10) / 10; // 1 decimale
        
        // Calcola range e confidence
        const history = sessionHistory[athleteId] || [];
        let confidenceScore = 0;
        let rangeWidth = 1.5; // Default ±1.5
        
        if (history.length >= 20) {
            confidenceScore = 80;
            rangeWidth = 0.7;
        } else if (history.length >= 10) {
            confidenceScore = 60;
            rangeWidth = 1.0;
        } else if (history.length >= 5) {
            confidenceScore = 40;
            rangeWidth = 1.2;
        } else {
            confidenceScore = 20;
        }
        
        // Bonus confidence per dati di contesto
        if (ctx?.sleep) confidenceScore += 5;
        if (ctx?.stress) confidenceScore += 5;
        if (ctx?.readiness) confidenceScore += 10;
        
        result.predictedRPE = rpe;
        result.confidence = confidenceScore >= 70 ? 'high' : confidenceScore >= 40 ? 'medium' : 'low';
        result.range = {
            min: Math.max(4, Math.round((rpe - rangeWidth) * 10) / 10),
            max: Math.min(10, Math.round((rpe + rangeWidth) * 10) / 10)
        };
        
        // Raccomandazione
        if (rpe >= 8.5) {
            result.recommendation = '⚠️ Carico molto alto - monitora attentamente';
        } else if (rpe >= 7.5) {
            result.recommendation = '💪 Sessione impegnativa - assicurati di essere pronto';
        } else if (rpe >= 6) {
            result.recommendation = '✅ Carico sostenibile - buon allenamento';
        } else if (rpe >= 5) {
            result.recommendation = '🌱 Sessione leggera - ottima per recupero attivo';
        } else {
            result.recommendation = '😴 Carico molto basso - considera se aumentare';
        }
        
        return result;
    }

    /**
     * Predici RPE per singolo esercizio
     */
    function predictExerciseRPE(exercise, context) {
        const baseRPE = {
            strength: 7.5,
            hypertrophy: 6.5,
            conditioning: 5.5
        };
        
        const type = exercise.type || 'hypertrophy';
        let rpe = baseRPE[type] || 6.5;
        
        // Modificatore per sets
        const sets = parseInt(exercise.sets) || 3;
        if (sets >= 5) rpe += 0.5;
        if (sets >= 7) rpe += 0.5;
        
        // Modificatore per complessità nome
        const name = String(exercise.name || '').toLowerCase();
        if (/deadlift|squat|clean|snatch|jerk/.test(name)) {
            rpe += 0.5; // Esercizi complessi
        }
        if (/plank|stretch|mobility|foam/.test(name)) {
            rpe -= 0.5; // Esercizi leggeri
        }
        
        return Math.max(4, Math.min(10, Math.round(rpe * 10) / 10));
    }

    // ═══════════════════════════════════════════════════════════════
    // LEARNING: Impara dai risultati reali
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Registra il risultato reale per migliorare il modello
     * @param {string} athleteId 
     * @param {object} session - { predictedRPE, actualRPE, workout, context }
     */
    function recordActualRPE(athleteId, session) {
        if (!athleteId || !session.actualRPE) return;
        
        if (!sessionHistory[athleteId]) {
            sessionHistory[athleteId] = [];
        }
        
        const entry = {
            date: new Date().toISOString(),
            predictedRPE: session.predictedRPE || null,
            actualRPE: parseFloat(session.actualRPE),
            error: session.predictedRPE ? parseFloat(session.actualRPE) - session.predictedRPE : null,
            context: {
                sleep: session.context?.sleep,
                stress: session.context?.stress,
                readiness: session.context?.readiness,
                phase: session.context?.phase,
                totalSets: session.workout?.exercises?.reduce((s, e) => s + (parseInt(e.sets) || 0), 0)
            }
        };
        
        sessionHistory[athleteId].push(entry);
        
        // Mantieni solo le ultime 100 sessioni
        if (sessionHistory[athleteId].length > 100) {
            sessionHistory[athleteId].shift();
        }
        
        // Ricalcola coefficienti personali
        updatePersonalCoefficients(athleteId);
        
        saveToStorage();
        
        console.log(`📊 RPE Recorded: predicted ${entry.predictedRPE?.toFixed(1) || 'N/A'} → actual ${entry.actualRPE} (error: ${entry.error?.toFixed(1) || 'N/A'})`);
        
        return entry;
    }

    /**
     * Ricalcola i coefficienti personali basati sullo storico
     */
    function updatePersonalCoefficients(athleteId) {
        const history = sessionHistory[athleteId] || [];
        if (history.length < 5) return;
        
        const withPredictions = history.filter(h => h.predictedRPE !== null && h.error !== null);
        if (withPredictions.length < 5) return;
        
        // Calcola bias medio (l'atleta tende a percepire RPE più alto/basso del previsto?)
        const avgBias = withPredictions.reduce((sum, h) => sum + h.error, 0) / withPredictions.length;
        
        // Calcola precisione media
        const avgAbsError = withPredictions.reduce((sum, h) => sum + Math.abs(h.error), 0) / withPredictions.length;
        
        // Calcola varianza per capire la consistenza dell'atleta
        const variance = withPredictions.reduce((sum, h) => sum + Math.pow(h.error - avgBias, 2), 0) / withPredictions.length;
        
        personalCoefficients[athleteId] = {
            sessions: history.length,
            avgBias: Math.round(avgBias * 100) / 100,
            avgAbsError: Math.round(avgAbsError * 100) / 100,
            variance: Math.round(variance * 100) / 100,
            lastUpdated: new Date().toISOString()
        };
        
        console.log(`📊 Personal coefficients updated for ${athleteId}:`, personalCoefficients[athleteId]);
    }

    // ═══════════════════════════════════════════════════════════════
    // ANALYTICS
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Ottieni statistiche precisione per atleta
     */
    function getAccuracyStats(athleteId) {
        const history = sessionHistory[athleteId] || [];
        const withPredictions = history.filter(h => h.predictedRPE !== null && h.error !== null);
        
        if (withPredictions.length === 0) {
            return {
                sessions: 0,
                accuracy: 0,
                avgError: 0,
                trend: 'unknown'
            };
        }
        
        const avgAbsError = withPredictions.reduce((sum, h) => sum + Math.abs(h.error), 0) / withPredictions.length;
        
        // Accuracy: 100% = errore 0, 0% = errore ≥ 3
        const accuracy = Math.max(0, Math.round((1 - avgAbsError / 3) * 100));
        
        // Trend: confronta ultimi 5 vs precedenti
        let trend = 'stable';
        if (withPredictions.length >= 10) {
            const recent = withPredictions.slice(-5);
            const older = withPredictions.slice(-10, -5);
            const recentError = recent.reduce((sum, h) => sum + Math.abs(h.error), 0) / 5;
            const olderError = older.reduce((sum, h) => sum + Math.abs(h.error), 0) / 5;
            
            if (recentError < olderError - 0.2) trend = 'improving';
            else if (recentError > olderError + 0.2) trend = 'declining';
        }
        
        return {
            sessions: withPredictions.length,
            accuracy,
            avgError: Math.round(avgAbsError * 100) / 100,
            trend
        };
    }

    /**
     * Ottieni trend RPE nel tempo
     */
    function getRPETrend(athleteId, weeks = 4) {
        const history = sessionHistory[athleteId] || [];
        const cutoff = Date.now() - (weeks * 7 * 24 * 60 * 60 * 1000);
        const recent = history.filter(h => new Date(h.date).getTime() > cutoff);
        
        if (recent.length < 3) {
            return { trend: 'insufficient_data', avgRPE: null, change: null };
        }
        
        const avgRPE = recent.reduce((sum, h) => sum + h.actualRPE, 0) / recent.length;
        
        // Confronta prima metà vs seconda metà
        const half = Math.floor(recent.length / 2);
        const firstHalf = recent.slice(0, half);
        const secondHalf = recent.slice(half);
        
        const firstAvg = firstHalf.reduce((s, h) => s + h.actualRPE, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((s, h) => s + h.actualRPE, 0) / secondHalf.length;
        
        const change = secondAvg - firstAvg;
        let trend = 'stable';
        if (change > 0.5) trend = 'increasing';
        else if (change < -0.5) trend = 'decreasing';
        
        return {
            trend,
            avgRPE: Math.round(avgRPE * 10) / 10,
            change: Math.round(change * 10) / 10,
            sessions: recent.length
        };
    }

    /**
     * Genera prompt section per l'AI
     * @param {string} athleteId 
     * @param {object} workoutOrContext - può essere workout object oppure context
     * @param {object} context - opzionale se workoutOrContext è il context
     */
    function generatePromptSection(athleteId, workoutOrContext, context) {
        // Supporta sia (athleteId, workout, context) che (athleteId, context)
        let workout = null;
        let ctx = context;
        
        if (workoutOrContext && typeof workoutOrContext === 'object') {
            if (workoutOrContext.exercises) {
                workout = workoutOrContext;
            } else {
                ctx = workoutOrContext;
            }
        }
        
        const prediction = predict(workout, ctx || {});
        const stats = getAccuracyStats(athleteId);
        const trend = getRPETrend(athleteId);
        
        const lines = ['═══ RPE PREDICTOR (Analisi Carico) ═══'];
        
        lines.push(`📊 RPE Previsto: ${prediction.predictedRPE} (range: ${prediction.range.min}-${prediction.range.max})`);
        lines.push(`🎯 Confidence: ${prediction.confidence.toUpperCase()}`);
        lines.push(`💡 ${prediction.recommendation}`);
        
        if (stats.sessions >= 5) {
            lines.push(`📈 Accuratezza modello: ${stats.accuracy}% (basato su ${stats.sessions} sessioni)`);
        }
        
        if (trend.trend !== 'insufficient_data') {
            const trendEmoji = trend.trend === 'increasing' ? '📈' : trend.trend === 'decreasing' ? '📉' : '➡️';
            lines.push(`${trendEmoji} Trend RPE: ${trend.trend} (media: ${trend.avgRPE})`);
        }
        
        // Fattori principali
        const topFactors = prediction.factors
            .filter(f => Math.abs(f.contribution) >= 0.3)
            .slice(0, 3);
        
        if (topFactors.length > 0) {
            lines.push('Fattori principali:');
            for (const f of topFactors) {
                const sign = f.contribution > 0 ? '+' : '';
                lines.push(`  • ${f.name}: ${f.value} (${sign}${f.contribution.toFixed(1)} RPE)`);
            }
        }
        
        return lines.join('\n');
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════
    
    function getStats() {
        let totalSessions = 0;
        let totalAthletes = Object.keys(sessionHistory).length;
        let athletesWithModel = 0;
        
        for (const history of Object.values(sessionHistory)) {
            totalSessions += history.length;
        }
        
        for (const coefs of Object.values(personalCoefficients)) {
            if (coefs.sessions >= 10) athletesWithModel++;
        }
        
        return {
            version: VERSION,
            totalAthletes,
            totalSessions,
            athletesWithModel,
            avgSessionsPerAthlete: totalAthletes > 0 ? Math.round(totalSessions / totalAthletes) : 0
        };
    }

    function resetAthlete(athleteId) {
        delete sessionHistory[athleteId];
        delete personalCoefficients[athleteId];
        saveToStorage();
        console.log(`📊 RPEPredictor: Reset data for athlete ${athleteId}`);
    }

    // Inizializza
    init();

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════
    
    return {
        VERSION,
        
        // Predizione
        predict,
        predictExerciseRPE,
        
        // Learning
        recordActualRPE,
        
        // Analytics
        getAccuracyStats,
        getRPETrend,
        
        // Prompt
        generatePromptSection,
        
        // Utility
        getStats,
        resetAthlete
    };
})();

console.log('📊 RPEPredictor module loaded');
