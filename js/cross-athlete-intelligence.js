/**
 * GR Perform - Cross-Athlete Intelligence
 * 
 * SUPERA IL COACH UMANO: Analizza pattern da TUTTI gli atleti
 * per suggerire cosa funziona meglio per profili simili.
 * 
 * Un coach umano ha esperienza limitata. Questo sistema
 * aggrega conoscenza da centinaia di atleti.
 */

window.CrossAthleteIntelligence = (function() {
    'use strict';

    const VERSION = '1.0';
    const STORAGE_KEY = 'gr_cross_athlete_v1';

    // Aggregati per sport/livello/obiettivo
    // { 'boxe_intermediate_forza': { topExercises: [], avgSessionDuration, successPatterns, ... } }
    let aggregates = {};

    // Workout templates che hanno funzionato
    // [{ hash, sport, phase, successRate, usageCount, exercises: [...] }]
    let successfulTemplates = [];

    // Pattern di progressione efficaci
    // { 'sport_level': { weeklyProgression: [], deloadFrequency, avgComplianceForSuccess } }
    let progressionPatterns = {};

    // ═══════════════════════════════════════════════════════════════
    // INIZIALIZZAZIONE
    // ═══════════════════════════════════════════════════════════════
    
    function init() {
        loadFromStorage();
        console.log('🌐 CrossAthleteIntelligence initialized', {
            aggregates: Object.keys(aggregates).length,
            templates: successfulTemplates.length,
            progressionPatterns: Object.keys(progressionPatterns).length
        });
    }

    function loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                aggregates = data.aggregates || {};
                successfulTemplates = data.successfulTemplates || [];
                progressionPatterns = data.progressionPatterns || {};
            }
        } catch (e) {
            console.warn('CrossAthleteIntelligence: Failed to load from storage', e);
        }
    }

    function saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                aggregates,
                successfulTemplates,
                progressionPatterns,
                lastUpdated: new Date().toISOString()
            }));
        } catch (e) {
            console.warn('CrossAthleteIntelligence: Failed to save to storage', e);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // RECORDING: Aggrega dati da ogni sessione completata
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Registra una sessione completata con successo
     */
    function recordSuccessfulSession(athleteProfile, workout, feedback) {
        const { sport, level, goal } = athleteProfile;
        if (!sport || !level) return;
        
        const key = buildAggregateKey(sport, level, goal);
        
        if (!aggregates[key]) {
            aggregates[key] = {
                sessionCount: 0,
                totalDuration: 0,
                exerciseFrequency: {},
                avgRPE: 0,
                totalRPE: 0,
                avgCompliance: 0,
                totalCompliance: 0,
                avgFeeling: 0,
                totalFeeling: 0,
                phaseDistribution: {},
                successfulCombos: []
            };
        }
        
        const agg = aggregates[key];
        agg.sessionCount++;
        
        // Durata
        if (workout.estimated_duration_minutes) {
            agg.totalDuration += workout.estimated_duration_minutes;
        }
        
        // Frequenza esercizi
        const exercises = workout.exercises || [];
        for (const ex of exercises) {
            const name = normalizeExerciseName(ex.name);
            if (!agg.exerciseFrequency[name]) {
                agg.exerciseFrequency[name] = { count: 0, avgRPE: 0, totalRPE: 0, successCount: 0 };
            }
            agg.exerciseFrequency[name].count++;
            
            // Se l'atleta ha dato feedback positivo su questo esercizio
            if (feedback.feeling >= 4 || (feedback.rpe && feedback.rpe <= 7)) {
                agg.exerciseFrequency[name].successCount++;
            }
        }
        
        // RPE medio
        if (feedback.rpe) {
            agg.totalRPE += feedback.rpe;
            agg.avgRPE = agg.totalRPE / agg.sessionCount;
        }
        
        // Compliance
        if (feedback.compliance !== undefined) {
            agg.totalCompliance += feedback.compliance;
            agg.avgCompliance = agg.totalCompliance / agg.sessionCount;
        }
        
        // Feeling
        if (feedback.feeling) {
            agg.totalFeeling += feedback.feeling;
            agg.avgFeeling = agg.totalFeeling / agg.sessionCount;
        }
        
        // Distribuzione fasi
        const phase = workout.phase || 'unknown';
        agg.phaseDistribution[phase] = (agg.phaseDistribution[phase] || 0) + 1;
        
        // Registra template se molto positivo
        if (feedback.feeling >= 4 && (!feedback.rpe || feedback.rpe <= 7.5)) {
            recordSuccessfulTemplate(athleteProfile, workout);
        }
        
        saveToStorage();
    }

    /**
     * Registra un template di workout di successo
     */
    function recordSuccessfulTemplate(athleteProfile, workout) {
        const hash = hashWorkout(workout);
        
        // Cerca se esiste già
        const existing = successfulTemplates.find(t => t.hash === hash);
        
        if (existing) {
            existing.usageCount++;
            existing.successRate = (existing.successRate * (existing.usageCount - 1) + 1) / existing.usageCount;
        } else {
            successfulTemplates.push({
                hash,
                sport: athleteProfile.sport,
                level: athleteProfile.level,
                goal: athleteProfile.goal,
                phase: workout.phase,
                usageCount: 1,
                successRate: 1,
                exerciseNames: (workout.exercises || []).map(e => normalizeExerciseName(e.name)),
                structure: analyzeWorkoutStructure(workout),
                createdAt: new Date().toISOString()
            });
            
            // Mantieni solo i top 200 templates
            if (successfulTemplates.length > 200) {
                successfulTemplates.sort((a, b) => (b.successRate * b.usageCount) - (a.successRate * a.usageCount));
                successfulTemplates = successfulTemplates.slice(0, 200);
            }
        }
    }

    /**
     * Registra pattern di progressione
     */
    function recordProgressionPattern(athleteProfile, weekData) {
        const key = `${athleteProfile.sport}_${athleteProfile.level}`;
        
        if (!progressionPatterns[key]) {
            progressionPatterns[key] = {
                weeklyData: [],
                deloadWeeks: [],
                successfulProgressions: 0,
                failedProgressions: 0
            };
        }
        
        const pp = progressionPatterns[key];
        
        pp.weeklyData.push({
            week: weekData.week,
            volume: weekData.volume,
            intensity: weekData.intensity,
            compliance: weekData.compliance,
            feeling: weekData.feeling
        });
        
        // Mantieni solo ultime 52 settimane
        if (pp.weeklyData.length > 52) {
            pp.weeklyData.shift();
        }
        
        // Traccia deload
        if (weekData.isDeload) {
            pp.deloadWeeks.push(weekData.week);
        }
        
        saveToStorage();
    }

    // ═══════════════════════════════════════════════════════════════
    // INFERENCE: Suggerimenti basati sui dati aggregati
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Ottieni esercizi più efficaci per un profilo
     */
    function getTopExercises(sport, level, goal, limit = 10) {
        const key = buildAggregateKey(sport, level, goal);
        const agg = aggregates[key];
        
        if (!agg || !agg.exerciseFrequency) {
            // Fallback: cerca profili simili
            return getTopExercisesFallback(sport, level, limit);
        }
        
        // Ordina per success rate (considerando anche frequenza)
        const exercises = Object.entries(agg.exerciseFrequency)
            .map(([name, data]) => ({
                name,
                count: data.count,
                successRate: data.successCount / Math.max(1, data.count),
                score: (data.successCount / Math.max(1, data.count)) * Math.log(data.count + 1)
            }))
            .filter(e => e.count >= 3) // Minimo 3 occorrenze
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
        
        return exercises;
    }

    /**
     * Fallback: cerca esercizi da profili simili
     */
    function getTopExercisesFallback(sport, level, limit) {
        const sportAggs = Object.entries(aggregates)
            .filter(([key]) => key.startsWith(`${sport}_`));
        
        if (sportAggs.length === 0) return [];
        
        // Combina tutti gli esercizi dello stesso sport
        const combined = {};
        for (const [, agg] of sportAggs) {
            for (const [name, data] of Object.entries(agg.exerciseFrequency || {})) {
                if (!combined[name]) {
                    combined[name] = { count: 0, successCount: 0 };
                }
                combined[name].count += data.count;
                combined[name].successCount += data.successCount;
            }
        }
        
        return Object.entries(combined)
            .map(([name, data]) => ({
                name,
                count: data.count,
                successRate: data.successCount / Math.max(1, data.count),
                score: (data.successCount / Math.max(1, data.count)) * Math.log(data.count + 1)
            }))
            .filter(e => e.count >= 3)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    /**
     * Trova template simili di successo
     */
    function findSimilarTemplates(sport, level, phase, limit = 5) {
        return successfulTemplates
            .filter(t => {
                if (t.sport !== sport) return false;
                if (phase && t.phase !== phase) return false;
                // Preferisci stesso livello ma accetta ±1
                const levelMatch = t.level === level || 
                    (level === 'intermediate' && (t.level === 'beginner' || t.level === 'advanced')) ||
                    (level === 'beginner' && t.level === 'intermediate') ||
                    (level === 'advanced' && t.level === 'intermediate');
                return levelMatch;
            })
            .sort((a, b) => (b.successRate * b.usageCount) - (a.successRate * a.usageCount))
            .slice(0, limit);
    }

    /**
     * Ottieni statistiche aggregate per un profilo
     */
    function getProfileStats(sport, level, goal) {
        const key = buildAggregateKey(sport, level, goal);
        const agg = aggregates[key];
        
        if (!agg) return null;
        
        return {
            sessionCount: agg.sessionCount,
            avgDuration: agg.sessionCount > 0 ? Math.round(agg.totalDuration / agg.sessionCount) : 60,
            avgRPE: Math.round(agg.avgRPE * 10) / 10,
            avgCompliance: Math.round(agg.avgCompliance),
            avgFeeling: Math.round(agg.avgFeeling * 10) / 10,
            topPhase: Object.entries(agg.phaseDistribution)
                .sort((a, b) => b[1] - a[1])[0]?.[0] || 'accumulo'
        };
    }

    /**
     * Suggerisci parametri ottimali basati sui dati
     */
    function suggestOptimalParameters(sport, level, phase) {
        const suggestions = {
            sessionDuration: 60,
            targetRPE: 7,
            setsRange: { min: 20, max: 30 },
            exercisesRange: { min: 6, max: 8 },
            restBetweenSets: '90s',
            confidence: 'low'
        };
        
        // Cerca dati aggregati
        const keys = Object.keys(aggregates).filter(k => k.startsWith(`${sport}_${level}`));
        
        if (keys.length === 0) return suggestions;
        
        let totalDuration = 0;
        let totalRPE = 0;
        let count = 0;
        
        for (const key of keys) {
            const agg = aggregates[key];
            if (agg.sessionCount >= 5) {
                if (agg.avgFeeling >= 3.5) { // Solo sessioni con buon feedback
                    totalDuration += agg.totalDuration / agg.sessionCount;
                    totalRPE += agg.avgRPE;
                    count++;
                }
            }
        }
        
        if (count > 0) {
            suggestions.sessionDuration = Math.round(totalDuration / count);
            suggestions.targetRPE = Math.round((totalRPE / count) * 10) / 10;
            suggestions.confidence = count >= 10 ? 'high' : count >= 5 ? 'medium' : 'low';
        }
        
        // Aggiusta per fase
        const phaseModifiers = {
            deload: { rpe: -1.5, duration: -15 },
            accumulo: { rpe: 0, duration: 0 },
            intensificazione: { rpe: +0.5, duration: -5 },
            peaking: { rpe: +1, duration: -10 }
        };
        
        const mod = phaseModifiers[phase] || { rpe: 0, duration: 0 };
        suggestions.targetRPE = Math.max(5, Math.min(9, suggestions.targetRPE + mod.rpe));
        suggestions.sessionDuration = Math.max(30, suggestions.sessionDuration + mod.duration);
        
        return suggestions;
    }

    /**
     * Confronta atleta con profili simili
     */
    function compareWithPeers(athleteId, athleteData, recentFeedback) {
        const sport = athleteData.sport;
        const level = athleteData.level || 'intermediate';
        
        const key = buildAggregateKey(sport, level, athleteData.goal);
        const agg = aggregates[key];
        
        if (!agg || agg.sessionCount < 10) {
            return {
                hasData: false,
                message: 'Dati insufficienti per confronto'
            };
        }
        
        const comparison = {
            hasData: true,
            peerCount: agg.sessionCount,
            metrics: {}
        };
        
        // Confronta RPE
        if (recentFeedback.avgRPE) {
            const diff = recentFeedback.avgRPE - agg.avgRPE;
            comparison.metrics.rpe = {
                athlete: recentFeedback.avgRPE,
                peers: Math.round(agg.avgRPE * 10) / 10,
                diff: Math.round(diff * 10) / 10,
                status: Math.abs(diff) < 0.5 ? 'normal' : diff > 0 ? 'higher' : 'lower'
            };
        }
        
        // Confronta compliance
        if (recentFeedback.avgCompliance) {
            const diff = recentFeedback.avgCompliance - agg.avgCompliance;
            comparison.metrics.compliance = {
                athlete: recentFeedback.avgCompliance,
                peers: Math.round(agg.avgCompliance),
                diff: Math.round(diff),
                status: diff >= 0 ? 'good' : diff >= -10 ? 'normal' : 'low'
            };
        }
        
        // Confronta feeling
        if (recentFeedback.avgFeeling) {
            const diff = recentFeedback.avgFeeling - agg.avgFeeling;
            comparison.metrics.feeling = {
                athlete: recentFeedback.avgFeeling,
                peers: Math.round(agg.avgFeeling * 10) / 10,
                diff: Math.round(diff * 10) / 10,
                status: diff >= 0 ? 'good' : diff >= -0.5 ? 'normal' : 'low'
            };
        }
        
        return comparison;
    }

    /**
     * Genera prompt section per l'AI
     */
    function generatePromptSection(sport, level, goal, phase) {
        const lines = ['═══ CROSS-ATHLETE INTELLIGENCE ═══'];
        
        // Top esercizi
        const topExercises = getTopExercises(sport, level, goal, 8);
        if (topExercises.length > 0) {
            lines.push(`🏆 Esercizi più efficaci per ${sport}/${level}:`);
            for (const ex of topExercises.slice(0, 5)) {
                lines.push(`  • ${ex.name} (${Math.round(ex.successRate * 100)}% success, ${ex.count} usi)`);
            }
        }
        
        // Statistiche profilo
        const stats = getProfileStats(sport, level, goal);
        if (stats) {
            lines.push(`📊 Statistiche aggregate (${stats.sessionCount} sessioni):`);
            lines.push(`  • Durata media: ${stats.avgDuration} min`);
            lines.push(`  • RPE medio: ${stats.avgRPE}`);
            lines.push(`  • Compliance media: ${stats.avgCompliance}%`);
        }
        
        // Parametri ottimali
        const optimal = suggestOptimalParameters(sport, level, phase);
        if (optimal.confidence !== 'low') {
            lines.push(`🎯 Parametri ottimali suggeriti (${optimal.confidence} confidence):`);
            lines.push(`  • Durata target: ${optimal.sessionDuration} min`);
            lines.push(`  • RPE target: ${optimal.targetRPE}`);
        }
        
        // Template simili
        const templates = findSimilarTemplates(sport, level, phase, 2);
        if (templates.length > 0) {
            lines.push(`📋 Template di successo simili:`);
            for (const t of templates) {
                lines.push(`  • [${Math.round(t.successRate * 100)}% success] ${t.exerciseNames.slice(0, 3).join(', ')}...`);
            }
        }
        
        if (lines.length === 1) return '';
        
        return lines.join('\n');
    }

    // ═══════════════════════════════════════════════════════════════
    // HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════
    
    function buildAggregateKey(sport, level, goal) {
        return `${String(sport || 'general').toLowerCase()}_${String(level || 'intermediate').toLowerCase()}_${String(goal || 'general').toLowerCase()}`;
    }

    function normalizeExerciseName(name) {
        return String(name || '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[^a-z0-9 ]/g, '')
            .replace(/\b(a1|a2|b1|b2|c1|c2)\b:?/gi, '')
            .trim();
    }

    function hashWorkout(workout) {
        const exercises = (workout.exercises || [])
            .map(e => normalizeExerciseName(e.name))
            .sort()
            .join('|');
        
        // Simple hash
        let hash = 0;
        for (let i = 0; i < exercises.length; i++) {
            const char = exercises.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    function analyzeWorkoutStructure(workout) {
        const exercises = workout.exercises || [];
        const types = exercises.map(e => e.type || 'hypertrophy');
        
        const structure = {
            totalExercises: exercises.length,
            totalSets: exercises.reduce((s, e) => s + (parseInt(e.sets) || 0), 0),
            typeDistribution: {}
        };
        
        for (const t of types) {
            structure.typeDistribution[t] = (structure.typeDistribution[t] || 0) + 1;
        }
        
        return structure;
    }

    // ═══════════════════════════════════════════════════════════════
    // ANALYTICS
    // ═══════════════════════════════════════════════════════════════
    
    function getStats() {
        return {
            version: VERSION,
            aggregateProfiles: Object.keys(aggregates).length,
            successfulTemplates: successfulTemplates.length,
            progressionPatterns: Object.keys(progressionPatterns).length,
            totalSessionsTracked: Object.values(aggregates).reduce((s, a) => s + a.sessionCount, 0)
        };
    }

    function exportData() {
        return {
            aggregates,
            successfulTemplates,
            progressionPatterns,
            exportedAt: new Date().toISOString()
        };
    }

    function importData(data) {
        if (data.aggregates) aggregates = data.aggregates;
        if (data.successfulTemplates) successfulTemplates = data.successfulTemplates;
        if (data.progressionPatterns) progressionPatterns = data.progressionPatterns;
        saveToStorage();
        console.log('🌐 CrossAthleteIntelligence: Data imported');
    }

    // Inizializza
    init();

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════
    
    return {
        VERSION,
        
        // Recording
        recordSuccessfulSession,
        recordProgressionPattern,
        
        // Inference
        getTopExercises,
        findSimilarTemplates,
        getProfileStats,
        suggestOptimalParameters,
        compareWithPeers,
        
        // Prompt
        generatePromptSection,
        
        // Analytics
        getStats,
        exportData,
        importData
    };
})();

console.log('🌐 CrossAthleteIntelligence module loaded');
