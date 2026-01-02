/**
 * GR Perform - Adaptive Load Optimizer
 * 
 * SUPERA IL COACH UMANO: Ottimizzazione in tempo reale del carico
 * basata su algoritmi di controllo feedback e teoria dell'allenamento.
 * 
 * Un coach umano regola a occhio. Questo sistema usa la matematica.
 */

window.AdaptiveLoadOptimizer = (function() {
    'use strict';

    const VERSION = '1.0';
    const STORAGE_KEY = 'gr_adaptive_load_v1';

    // Storico carichi per atleta
    // { athleteId: { weeklyLoads: [], acwr: [], fatigueIndex: [], performanceIndex: [] } }
    let loadHistory = {};

    // Parametri personali appresi
    // { athleteId: { optimalACWR, maxWeeklyLoad, recoveryRate, fatigueResistance } }
    let personalParameters = {};

    // ═══════════════════════════════════════════════════════════════
    // MODELLO DI CARICO
    // ═══════════════════════════════════════════════════════════════
    
    // ACWR (Acute:Chronic Workload Ratio) targets per sport
    const ACWR_TARGETS = {
        default: { optimal: { min: 0.8, max: 1.3 }, danger: { min: 0.5, max: 1.5 } },
        boxe: { optimal: { min: 0.85, max: 1.25 }, danger: { min: 0.6, max: 1.4 } },
        calcio: { optimal: { min: 0.8, max: 1.2 }, danger: { min: 0.6, max: 1.5 } },
        palestra: { optimal: { min: 0.75, max: 1.35 }, danger: { min: 0.5, max: 1.6 } },
        mma: { optimal: { min: 0.85, max: 1.25 }, danger: { min: 0.6, max: 1.4 } }
    };

    // Fattori di carico per tipo esercizio
    const LOAD_FACTORS = {
        strength: 1.5,      // Alto carico sistemico
        hypertrophy: 1.2,   // Carico moderato
        conditioning: 0.8   // Carico più leggero (relativo)
    };

    // Fattori RPE → carico
    const RPE_LOAD_MULTIPLIERS = {
        1: 0.5, 2: 0.55, 3: 0.6, 4: 0.7, 5: 0.75,
        6: 0.8, 7: 0.85, 8: 0.9, 9: 0.95, 10: 1.0
    };

    // ═══════════════════════════════════════════════════════════════
    // INIZIALIZZAZIONE
    // ═══════════════════════════════════════════════════════════════
    
    function init() {
        loadFromStorage();
        console.log('⚡ AdaptiveLoadOptimizer initialized', {
            athletesTracked: Object.keys(loadHistory).length
        });
    }

    function loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                loadHistory = data.loadHistory || {};
                personalParameters = data.personalParameters || {};
            }
        } catch (e) {
            console.warn('AdaptiveLoadOptimizer: Failed to load from storage', e);
        }
    }

    function saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                loadHistory,
                personalParameters,
                lastUpdated: new Date().toISOString()
            }));
        } catch (e) {
            console.warn('AdaptiveLoadOptimizer: Failed to save to storage', e);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // CALCOLO CARICO
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Calcola il carico di un singolo workout
     * Formula: Σ (sets × reps_equivalent × load_factor × rpe_multiplier)
     */
    function calculateWorkoutLoad(workout, rpe = 7) {
        const exercises = workout.exercises || [];
        let totalLoad = 0;
        
        for (const ex of exercises) {
            const sets = parseInt(ex.sets) || 0;
            const repsEquivalent = parseRepsToNumber(ex.reps);
            const loadFactor = LOAD_FACTORS[ex.type] || 1.0;
            const rpeMultiplier = RPE_LOAD_MULTIPLIERS[Math.round(rpe)] || 0.85;
            
            const exerciseLoad = sets * repsEquivalent * loadFactor * rpeMultiplier;
            totalLoad += exerciseLoad;
        }
        
        // Normalizza su scala 0-1000
        return Math.round(totalLoad * 10);
    }

    /**
     * Converte reps string in numero equivalente
     */
    function parseRepsToNumber(reps) {
        const str = String(reps || '').toLowerCase();
        
        // Range: "8-12" → usa media
        const rangeMatch = str.match(/(\d+)\s*-\s*(\d+)/);
        if (rangeMatch) {
            return (parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2;
        }
        
        // Tempo: "30s" o "3min"
        const timeMatch = str.match(/(\d+)\s*(s|sec|min|m)/i);
        if (timeMatch) {
            const value = parseInt(timeMatch[1]);
            const unit = timeMatch[2].toLowerCase();
            // Converti in "reps equivalenti" (1 min ≈ 15 reps di sforzo)
            if (unit === 'min' || unit === 'm') return value * 15;
            return value / 4; // 30s ≈ 7.5 reps
        }
        
        // AMRAP, EMOM
        if (/amrap|emom|circuit/i.test(str)) {
            return 15; // Stima conservativa
        }
        
        // Numero semplice
        const simple = parseInt(str);
        if (simple > 0) return simple;
        
        return 10; // Default
    }

    /**
     * Calcola ACWR (Acute:Chronic Workload Ratio)
     * Acute = carico settimana corrente
     * Chronic = media ponderata esponenziale ultime 4 settimane
     */
    function calculateACWR(athleteId, currentWeekLoad) {
        const history = loadHistory[athleteId]?.weeklyLoads || [];
        
        if (history.length < 3) {
            return {
                value: 1.0,
                confidence: 'low',
                message: 'Storico insufficiente per calcolo accurato'
            };
        }
        
        // Usa EWMA (Exponentially Weighted Moving Average) per chronic load
        // Più recente = peso maggiore
        const lambda = 0.3; // Decay factor
        let ewma = history[0]?.load || currentWeekLoad;
        
        for (let i = 1; i < Math.min(history.length, 4); i++) {
            ewma = lambda * (history[i]?.load || 0) + (1 - lambda) * ewma;
        }
        
        const chronicLoad = ewma;
        const acuteLoad = currentWeekLoad;
        
        if (chronicLoad === 0) {
            return {
                value: 1.0,
                confidence: 'low',
                message: 'Carico cronico zero'
            };
        }
        
        const acwr = acuteLoad / chronicLoad;
        
        return {
            value: Math.round(acwr * 100) / 100,
            acuteLoad,
            chronicLoad: Math.round(chronicLoad),
            confidence: history.length >= 4 ? 'high' : 'medium'
        };
    }

    /**
     * Analizza zona di rischio ACWR
     */
    function analyzeACWRZone(acwr, sport = 'default') {
        const targets = ACWR_TARGETS[sport] || ACWR_TARGETS.default;
        
        if (acwr < targets.danger.min) {
            return {
                zone: 'underload',
                risk: 'medium',
                color: '#FFB300',
                message: 'Carico troppo basso - rischio detraining',
                recommendation: 'Aumenta gradualmente il volume'
            };
        }
        
        if (acwr > targets.danger.max) {
            return {
                zone: 'danger',
                risk: 'high',
                color: '#E63946',
                message: 'Carico troppo alto - rischio infortunio!',
                recommendation: 'Riduci immediatamente volume/intensità'
            };
        }
        
        if (acwr < targets.optimal.min) {
            return {
                zone: 'low',
                risk: 'low',
                color: '#FFC107',
                message: 'Carico sotto l\'ottimale',
                recommendation: 'Puoi aumentare leggermente'
            };
        }
        
        if (acwr > targets.optimal.max) {
            return {
                zone: 'high',
                risk: 'medium',
                color: '#FF9800',
                message: 'Carico sopra l\'ottimale',
                recommendation: 'Monitora attentamente recupero'
            };
        }
        
        return {
            zone: 'optimal',
            risk: 'low',
            color: '#00D26A',
            message: 'Carico nella zona ottimale',
            recommendation: 'Mantieni questo livello'
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // OTTIMIZZAZIONE
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Suggerisci carico ottimale per la settimana
     */
    function suggestOptimalLoad(athleteId, sport, phase, context = {}) {
        const history = loadHistory[athleteId]?.weeklyLoads || [];
        const params = personalParameters[athleteId] || {};
        const targets = ACWR_TARGETS[sport] || ACWR_TARGETS.default;
        
        // Calcola carico cronico attuale
        let chronicLoad = 0;
        if (history.length >= 3) {
            const lambda = 0.3;
            let ewma = history[0]?.load || 0;
            for (let i = 1; i < Math.min(history.length, 4); i++) {
                ewma = lambda * (history[i]?.load || 0) + (1 - lambda) * ewma;
            }
            chronicLoad = ewma;
        } else {
            // Stima iniziale
            chronicLoad = 500; // Carico medio
        }
        
        // Target ACWR basato sulla fase
        let targetACWR = 1.0;
        switch (phase?.toLowerCase()) {
            case 'deload':
                targetACWR = 0.6;
                break;
            case 'adattamento':
                targetACWR = 0.85;
                break;
            case 'accumulo':
                targetACWR = 1.1;
                break;
            case 'intensificazione':
                targetACWR = 1.15;
                break;
            case 'peaking':
                targetACWR = 0.9;
                break;
            case 'realizzazione':
                targetACWR = 0.7;
                break;
            default:
                targetACWR = 1.0;
        }
        
        // Aggiusta per readiness
        if (context.readiness) {
            if (context.readiness < 60) {
                targetACWR *= 0.85;
            } else if (context.readiness > 85) {
                targetACWR *= 1.1;
            }
        }
        
        // Calcola carico target
        const targetLoad = Math.round(chronicLoad * targetACWR);
        
        // Range accettabile
        const minLoad = Math.round(chronicLoad * targets.optimal.min);
        const maxLoad = Math.round(chronicLoad * targets.optimal.max);
        
        return {
            targetLoad,
            range: { min: minLoad, max: maxLoad },
            targetACWR,
            chronicLoad: Math.round(chronicLoad),
            phase,
            confidence: history.length >= 4 ? 'high' : history.length >= 2 ? 'medium' : 'low'
        };
    }

    /**
     * Ottimizza un workout per raggiungere un carico target
     */
    function optimizeWorkoutForLoad(workout, targetLoad, currentRPE = 7) {
        const currentLoad = calculateWorkoutLoad(workout, currentRPE);
        const ratio = targetLoad / Math.max(1, currentLoad);
        
        const suggestions = [];
        
        if (ratio < 0.8) {
            // Troppo carico - riduci
            const reduction = Math.round((1 - ratio) * 100);
            suggestions.push({
                action: 'reduce',
                amount: reduction,
                options: [
                    `Riduci sets del ${Math.round(reduction * 0.7)}%`,
                    `Riduci esercizi da ${workout.exercises?.length || 0} a ${Math.max(4, Math.round((workout.exercises?.length || 6) * ratio))}`,
                    `Abbassa RPE target a ${Math.max(5, currentRPE - 1)}`
                ]
            });
        } else if (ratio > 1.2) {
            // Poco carico - aumenta
            const increase = Math.round((ratio - 1) * 100);
            suggestions.push({
                action: 'increase',
                amount: increase,
                options: [
                    `Aumenta sets del ${Math.round(increase * 0.7)}%`,
                    `Aggiungi 1-2 esercizi accessori`,
                    `Alza RPE target a ${Math.min(9, currentRPE + 1)}`
                ]
            });
        } else {
            suggestions.push({
                action: 'maintain',
                message: 'Carico già ottimale'
            });
        }
        
        return {
            currentLoad,
            targetLoad,
            ratio: Math.round(ratio * 100) / 100,
            suggestions,
            adjustmentNeeded: ratio < 0.8 || ratio > 1.2
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // RECORDING
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Registra carico settimanale
     */
    function recordWeeklyLoad(athleteId, weekNumber, totalLoad, context = {}) {
        if (!loadHistory[athleteId]) {
            loadHistory[athleteId] = {
                weeklyLoads: [],
                lastUpdated: null
            };
        }
        
        const entry = {
            week: weekNumber,
            load: totalLoad,
            rpe: context.avgRPE || null,
            compliance: context.compliance || null,
            feeling: context.feeling || null,
            sessions: context.sessions || 0,
            date: new Date().toISOString()
        };
        
        // Inserisci in ordine cronologico inverso (più recente prima)
        loadHistory[athleteId].weeklyLoads.unshift(entry);
        
        // Mantieni solo ultime 16 settimane
        if (loadHistory[athleteId].weeklyLoads.length > 16) {
            loadHistory[athleteId].weeklyLoads.pop();
        }
        
        loadHistory[athleteId].lastUpdated = new Date().toISOString();
        
        // Aggiorna parametri personali
        updatePersonalParameters(athleteId);
        
        saveToStorage();
        
        console.log(`⚡ Weekly load recorded: ${totalLoad} (week ${weekNumber})`);
        
        return entry;
    }

    /**
     * Aggiorna parametri personali basati sullo storico
     */
    function updatePersonalParameters(athleteId) {
        const history = loadHistory[athleteId]?.weeklyLoads || [];
        if (history.length < 4) return;
        
        // Calcola parametri
        const loads = history.map(h => h.load);
        const maxLoad = Math.max(...loads);
        const avgLoad = loads.reduce((a, b) => a + b, 0) / loads.length;
        
        // Trova ACWR "comfort zone" basato su feeling positivo
        const goodWeeks = history.filter(h => h.feeling && h.feeling >= 4);
        let optimalACWR = 1.0;
        if (goodWeeks.length >= 3) {
            // Calcola ACWR medio delle settimane con buon feeling
            const acwrs = [];
            for (let i = 0; i < goodWeeks.length && i < history.length - 1; i++) {
                const acute = goodWeeks[i].load;
                const chronicIdx = history.findIndex(h => h.week === goodWeeks[i].week) + 1;
                if (chronicIdx < history.length) {
                    const chronic = history.slice(chronicIdx, chronicIdx + 4)
                        .reduce((s, h) => s + h.load, 0) / Math.min(4, history.length - chronicIdx);
                    if (chronic > 0) acwrs.push(acute / chronic);
                }
            }
            if (acwrs.length > 0) {
                optimalACWR = acwrs.reduce((a, b) => a + b, 0) / acwrs.length;
            }
        }
        
        personalParameters[athleteId] = {
            maxWeeklyLoad: maxLoad,
            avgWeeklyLoad: Math.round(avgLoad),
            optimalACWR: Math.round(optimalACWR * 100) / 100,
            dataPoints: history.length,
            lastUpdated: new Date().toISOString()
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // ANALISI
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Analisi completa del carico attuale
     */
    function analyzeCurrentState(athleteId, sport, currentWeekLoad) {
        const history = loadHistory[athleteId]?.weeklyLoads || [];
        const params = personalParameters[athleteId] || {};
        
        const analysis = {
            currentLoad: currentWeekLoad,
            trend: 'stable',
            acwr: null,
            zone: null,
            fatigue: 'normal',
            recommendations: []
        };
        
        // Calcola ACWR
        const acwrResult = calculateACWR(athleteId, currentWeekLoad);
        analysis.acwr = acwrResult;
        
        // Analizza zona
        analysis.zone = analyzeACWRZone(acwrResult.value, sport);
        
        // Trend carico
        if (history.length >= 2) {
            const lastWeek = history[0]?.load || 0;
            const prevWeek = history[1]?.load || lastWeek;
            const change = (currentWeekLoad - lastWeek) / Math.max(1, lastWeek);
            
            if (change > 0.15) analysis.trend = 'increasing_fast';
            else if (change > 0.05) analysis.trend = 'increasing';
            else if (change < -0.15) analysis.trend = 'decreasing_fast';
            else if (change < -0.05) analysis.trend = 'decreasing';
        }
        
        // Stima fatica accumulata (semplificata)
        if (history.length >= 3) {
            const recentLoads = history.slice(0, 3).map(h => h.load);
            const avgRecent = recentLoads.reduce((a, b) => a + b, 0) / 3;
            const avgHistoric = params.avgWeeklyLoad || avgRecent;
            
            if (avgRecent > avgHistoric * 1.2) {
                analysis.fatigue = 'high';
            } else if (avgRecent > avgHistoric * 1.1) {
                analysis.fatigue = 'moderate';
            } else if (avgRecent < avgHistoric * 0.7) {
                analysis.fatigue = 'low';
            }
        }
        
        // Genera raccomandazioni
        if (analysis.zone.risk === 'high') {
            analysis.recommendations.push({
                priority: 'critical',
                text: analysis.zone.recommendation
            });
        }
        
        if (analysis.fatigue === 'high') {
            analysis.recommendations.push({
                priority: 'high',
                text: 'Fatica accumulata elevata - considera deload'
            });
        }
        
        if (analysis.trend === 'increasing_fast') {
            analysis.recommendations.push({
                priority: 'medium',
                text: 'Aumento rapido del carico - monitora recupero'
            });
        }
        
        return analysis;
    }

    /**
     * Genera prompt section per l'AI
     */
    function generatePromptSection(athleteId, sport, phase, plannedWorkouts = []) {
        const lines = ['═══ ADAPTIVE LOAD OPTIMIZER ═══'];
        
        // Calcola carico pianificato
        let plannedLoad = 0;
        for (const w of plannedWorkouts) {
            plannedLoad += calculateWorkoutLoad(w, 7);
        }
        
        // Suggerimento carico ottimale
        const suggestion = suggestOptimalLoad(athleteId, sport, phase);
        lines.push(`🎯 Carico target settimana: ${suggestion.targetLoad} (range: ${suggestion.range.min}-${suggestion.range.max})`);
        lines.push(`📊 Carico cronico: ${suggestion.chronicLoad} | Target ACWR: ${suggestion.targetACWR}`);
        
        // Se abbiamo workout pianificati, analizza
        if (plannedLoad > 0) {
            const optimization = optimizeWorkoutForLoad({ exercises: plannedWorkouts.flatMap(w => w.exercises || []) }, suggestion.targetLoad);
            if (optimization.adjustmentNeeded) {
                const action = optimization.suggestions[0];
                lines.push(`⚠️ Carico pianificato: ${plannedLoad} (${action.action === 'reduce' ? 'TROPPO ALTO' : 'TROPPO BASSO'})`);
                lines.push(`💡 ${action.options[0]}`);
            } else {
                lines.push(`✅ Carico pianificato: ${plannedLoad} (OTTIMALE)`);
            }
        }
        
        // Analisi stato attuale
        const history = loadHistory[athleteId]?.weeklyLoads || [];
        if (history.length >= 3) {
            const acwr = calculateACWR(athleteId, history[0]?.load || 0);
            const zone = analyzeACWRZone(acwr.value, sport);
            lines.push(`📈 ACWR attuale: ${acwr.value} (${zone.zone})`);
            if (zone.risk !== 'low') {
                lines.push(`⚠️ ${zone.message}`);
            }
        }
        
        return lines.join('\n');
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════
    
    function getStats() {
        return {
            version: VERSION,
            athletesTracked: Object.keys(loadHistory).length,
            totalWeeksRecorded: Object.values(loadHistory).reduce((s, h) => s + (h.weeklyLoads?.length || 0), 0),
            athletesWithParams: Object.keys(personalParameters).length
        };
    }

    function getAthleteHistory(athleteId) {
        return {
            weeklyLoads: loadHistory[athleteId]?.weeklyLoads || [],
            parameters: personalParameters[athleteId] || null
        };
    }

    function resetAthlete(athleteId) {
        delete loadHistory[athleteId];
        delete personalParameters[athleteId];
        saveToStorage();
        console.log(`⚡ AdaptiveLoadOptimizer: Reset data for athlete ${athleteId}`);
    }

    // Inizializza
    init();

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════
    
    return {
        VERSION,
        
        // Calcolo
        calculateWorkoutLoad,
        calculateACWR,
        analyzeACWRZone,
        
        // Ottimizzazione
        suggestOptimalLoad,
        optimizeWorkoutForLoad,
        
        // Recording
        recordWeeklyLoad,
        
        // Analisi
        analyzeCurrentState,
        
        // Prompt
        generatePromptSection,
        
        // Utility
        getStats,
        getAthleteHistory,
        resetAthlete
    };
})();

console.log('⚡ AdaptiveLoadOptimizer module loaded');
