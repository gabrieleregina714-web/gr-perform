/**
 * MACROCYCLE PLANNER - GR Perform
 * 
 * Pianificazione a lungo termine (6+ mesi) con:
 * - Definizione obiettivo (match, gara, competizione)
 * - Data target
 * - Generazione automatica fasi: Accumulo → Intensificazione → Peaking → Taper
 * - Sincronizzazione con PeriodizationEngine
 * 
 * @version 1.0.0
 * @date 2024-12-19
 */

window.MacrocyclePlanner = (function() {
    'use strict';

    // ============================================
    // CONFIGURAZIONE FASI PER SPORT
    // ============================================
    
    const PHASE_CONFIGS = {
        // Sport da combattimento (boxe, mma, kickboxing)
        combat: {
            phases: [
                { name: 'Accumulo', code: 'accumulo', minWeeks: 4, maxWeeks: 8, volumePct: 100, intensityPct: 70, focus: 'Base aerobica, volume tecnico, forza generale' },
                { name: 'Intensificazione', code: 'intensificazione', minWeeks: 3, maxWeeks: 6, volumePct: 85, intensityPct: 85, focus: 'Potenza specifica, sparring intenso, forza esplosiva' },
                { name: 'Peaking', code: 'peaking', minWeeks: 2, maxWeeks: 3, volumePct: 70, intensityPct: 95, focus: 'Affinamento tecnico, simulazioni match, esplosività' },
                { name: 'Taper', code: 'taper', minWeeks: 1, maxWeeks: 2, volumePct: 50, intensityPct: 80, focus: 'Recupero attivo, mantenimento, peso forma' }
            ],
            deloadEvery: 4, // Deload ogni 4 settimane
            minTotalWeeks: 8,
            maxTotalWeeks: 24
        },
        
        // Sport di squadra (calcio, basket, rugby)
        team: {
            phases: [
                { name: 'Pre-Season', code: 'accumulo', minWeeks: 4, maxWeeks: 6, volumePct: 100, intensityPct: 65, focus: 'Condizionamento, base aerobica, prevenzione' },
                { name: 'Build-Up', code: 'intensificazione', minWeeks: 3, maxWeeks: 5, volumePct: 90, intensityPct: 80, focus: 'Forza, potenza, tattica di squadra' },
                { name: 'Competition', code: 'peaking', minWeeks: 2, maxWeeks: 4, volumePct: 75, intensityPct: 90, focus: 'Mantenimento, recupero partite, affinamento' },
                { name: 'Taper', code: 'taper', minWeeks: 1, maxWeeks: 1, volumePct: 60, intensityPct: 75, focus: 'Freschezza, attivazione neurale' }
            ],
            deloadEvery: 4,
            minTotalWeeks: 6,
            maxTotalWeeks: 20
        },
        
        // Sport di endurance (ciclismo, running, triathlon)
        endurance: {
            phases: [
                { name: 'Base Building', code: 'accumulo', minWeeks: 6, maxWeeks: 12, volumePct: 100, intensityPct: 60, focus: 'Volume aerobico, efficienza, economia' },
                { name: 'Build', code: 'intensificazione', minWeeks: 4, maxWeeks: 8, volumePct: 90, intensityPct: 80, focus: 'Soglia, VO2max, forza specifica' },
                { name: 'Peak', code: 'peaking', minWeeks: 2, maxWeeks: 4, volumePct: 70, intensityPct: 95, focus: 'Simulazioni gara, intensità specifica' },
                { name: 'Taper', code: 'taper', minWeeks: 1, maxWeeks: 3, volumePct: 40, intensityPct: 70, focus: 'Supercompensazione, recupero, attivazione' }
            ],
            deloadEvery: 3,
            minTotalWeeks: 10,
            maxTotalWeeks: 26
        },
        
        // Fitness/Bodybuilding
        fitness: {
            phases: [
                { name: 'Ipertrofia', code: 'accumulo', minWeeks: 6, maxWeeks: 10, volumePct: 100, intensityPct: 70, focus: 'Volume muscolare, TUT, metabolico' },
                { name: 'Forza', code: 'intensificazione', minWeeks: 4, maxWeeks: 6, volumePct: 80, intensityPct: 85, focus: 'Carichi pesanti, basse rep, CNS' },
                { name: 'Definizione', code: 'peaking', minWeeks: 4, maxWeeks: 8, volumePct: 85, intensityPct: 75, focus: 'Mantenimento massa, deficit calorico' },
                { name: 'Deload', code: 'taper', minWeeks: 1, maxWeeks: 2, volumePct: 50, intensityPct: 60, focus: 'Recupero, supercompensazione' }
            ],
            deloadEvery: 4,
            minTotalWeeks: 8,
            maxTotalWeeks: 24
        }
    };

    // Mappatura sport -> categoria
    const SPORT_CATEGORY_MAP = {
        'boxe': 'combat',
        'boxing': 'combat',
        'mma': 'combat',
        'kickboxing': 'combat',
        'muay thai': 'combat',
        'judo': 'combat',
        'wrestling': 'combat',
        'bjj': 'combat',
        
        'calcio': 'team',
        'football': 'team',
        'soccer': 'team',
        'basket': 'team',
        'basketball': 'team',
        'rugby': 'team',
        'pallavolo': 'team',
        'volleyball': 'team',
        'hockey': 'team',
        
        'ciclismo': 'endurance',
        'cycling': 'endurance',
        'running': 'endurance',
        'corsa': 'endurance',
        'triathlon': 'endurance',
        'nuoto': 'endurance',
        'swimming': 'endurance',
        'maratona': 'endurance',
        
        'fitness': 'fitness',
        'bodybuilding': 'fitness',
        'powerlifting': 'fitness',
        'crossfit': 'fitness'
    };

    // ============================================
    // STORAGE
    // ============================================
    
    const STORAGE_KEY = 'grperform_macrocycles';
    
    function loadMacrocycles() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.warn('Errore caricamento macrocicli:', e);
            return {};
        }
    }
    
    function saveMacrocycles(macrocycles) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(macrocycles));
        } catch (e) {
            console.warn('Errore salvataggio macrocicli:', e);
        }
    }

    // ============================================
    // CALCOLO FASI
    // ============================================
    
    /**
     * Calcola le settimane disponibili fino alla data target
     */
    function calculateWeeksToTarget(targetDate) {
        const now = new Date();
        const target = new Date(targetDate);
        const diffMs = target - now;
        const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
        return Math.max(0, diffWeeks);
    }
    
    /**
     * Genera il piano delle fasi basato sulle settimane disponibili
     */
    function generatePhasePlan(sport, targetDate, options = {}) {
        const sportLower = (sport || '').toLowerCase();
        const category = SPORT_CATEGORY_MAP[sportLower] || 'fitness';
        const config = PHASE_CONFIGS[category];
        
        const totalWeeks = calculateWeeksToTarget(targetDate);
        
        if (totalWeeks < config.minTotalWeeks) {
            return {
                success: false,
                error: `Servono almeno ${config.minTotalWeeks} settimane per questo sport. Hai solo ${totalWeeks} settimane.`,
                minWeeks: config.minTotalWeeks,
                availableWeeks: totalWeeks
            };
        }
        
        // Distribuisci le settimane tra le fasi
        const phases = [];
        let remainingWeeks = Math.min(totalWeeks, config.maxTotalWeeks);
        let currentDate = new Date();
        
        // Calcola proporzioni ideali
        const totalMinWeeks = config.phases.reduce((sum, p) => sum + p.minWeeks, 0);
        const totalMaxWeeks = config.phases.reduce((sum, p) => sum + p.maxWeeks, 0);
        
        config.phases.forEach((phase, index) => {
            // Proporzione di questa fase
            const proportion = (phase.minWeeks + phase.maxWeeks) / 2 / ((totalMinWeeks + totalMaxWeeks) / 2);
            let phaseWeeks = Math.round(remainingWeeks * proportion);
            
            // Limita ai bounds
            phaseWeeks = Math.max(phase.minWeeks, Math.min(phase.maxWeeks, phaseWeeks));
            
            // Assicurati che l'ultima fase (Taper) finisca esattamente alla data target
            if (index === config.phases.length - 1) {
                // Aggiusta l'ultima fase per arrivare alla data target
                const weeksUsed = phases.reduce((sum, p) => sum + p.weeks, 0);
                phaseWeeks = totalWeeks - weeksUsed;
                phaseWeeks = Math.max(phase.minWeeks, phaseWeeks);
            }
            
            const startDate = new Date(currentDate);
            const endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + (phaseWeeks * 7) - 1);
            
            phases.push({
                name: phase.name,
                code: phase.code,
                weeks: phaseWeeks,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                volume: phase.volumePct,
                intensity: phase.intensityPct,
                focus: phase.focus,
                weekNumbers: []
            });
            
            // Calcola i numeri delle settimane
            for (let w = 0; w < phaseWeeks; w++) {
                const weekNum = phases.reduce((sum, p, i) => i < phases.length - 1 ? sum + p.weeks : sum, 0) + w + 1;
                phases[phases.length - 1].weekNumbers.push(weekNum);
            }
            
            currentDate = new Date(endDate);
            currentDate.setDate(currentDate.getDate() + 1);
            remainingWeeks -= phaseWeeks;
        });
        
        // Inserisci deload ogni N settimane
        const deloads = [];
        let weekCounter = 0;
        phases.forEach(phase => {
            phase.weekNumbers.forEach((wn, idx) => {
                weekCounter++;
                if (weekCounter > 0 && weekCounter % config.deloadEvery === 0 && phase.code !== 'taper') {
                    deloads.push({
                        week: weekCounter,
                        phase: phase.name,
                        reason: `Deload programmato dopo ${config.deloadEvery} settimane`
                    });
                }
            });
        });
        
        return {
            success: true,
            sport: sport,
            category: category,
            targetDate: targetDate,
            totalWeeks: totalWeeks,
            phases: phases,
            deloads: deloads,
            createdAt: new Date().toISOString()
        };
    }

    /**
     * Ottieni la fase corrente per una data specifica
     */
    function getCurrentPhase(macrocycle, date = new Date()) {
        if (!macrocycle || !macrocycle.phases) return null;
        
        const checkDate = new Date(date);
        
        for (const phase of macrocycle.phases) {
            const start = new Date(phase.startDate);
            const end = new Date(phase.endDate);
            
            if (checkDate >= start && checkDate <= end) {
                // Calcola quale settimana della fase siamo
                const diffMs = checkDate - start;
                const weekInPhase = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
                
                return {
                    ...phase,
                    currentWeekInPhase: weekInPhase,
                    isDeloadWeek: macrocycle.deloads?.some(d => d.week === phase.weekNumbers[weekInPhase - 1])
                };
            }
        }
        
        return null;
    }

    /**
     * Calcola la settimana globale del macrociclo
     */
    function getGlobalWeek(macrocycle, date = new Date()) {
        if (!macrocycle || !macrocycle.phases || macrocycle.phases.length === 0) return 1;
        
        const checkDate = new Date(date);
        const startDate = new Date(macrocycle.phases[0].startDate);
        
        const diffMs = checkDate - startDate;
        const weekNum = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
        
        return Math.max(1, Math.min(weekNum, macrocycle.totalWeeks));
    }

    // ============================================
    // API PUBBLICA
    // ============================================
    
    return {
        /**
         * Crea un nuovo macrociclo per un atleta
         */
        create: function(athleteId, sport, targetDate, eventName = 'Obiettivo') {
            const plan = generatePhasePlan(sport, targetDate);
            
            if (!plan.success) {
                return plan;
            }
            
            plan.athleteId = athleteId;
            plan.eventName = eventName;
            plan.id = `macro_${Date.now()}`;
            
            // Salva
            const all = loadMacrocycles();
            if (!all[athleteId]) all[athleteId] = [];
            all[athleteId].push(plan);
            saveMacrocycles(all);
            
            console.log('📅 Macrociclo creato:', plan);
            return plan;
        },
        
        /**
         * Ottieni il macrociclo attivo per un atleta
         */
        getActive: function(athleteId) {
            const all = loadMacrocycles();
            const athleteMacros = all[athleteId] || [];
            
            // Trova il macrociclo con targetDate futura più vicina
            const now = new Date();
            const active = athleteMacros
                .filter(m => new Date(m.targetDate) >= now)
                .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))[0];
            
            return active || null;
        },
        
        /**
         * Ottieni tutti i macrocicli di un atleta
         */
        getAll: function(athleteId) {
            const all = loadMacrocycles();
            return all[athleteId] || [];
        },
        
        /**
         * Elimina un macrociclo
         */
        delete: function(athleteId, macroId) {
            const all = loadMacrocycles();
            if (all[athleteId]) {
                all[athleteId] = all[athleteId].filter(m => m.id !== macroId);
                saveMacrocycles(all);
            }
        },
        
        /**
         * Ottieni la fase corrente
         */
        getCurrentPhase: function(athleteId, date = new Date()) {
            const macro = this.getActive(athleteId);
            return macro ? getCurrentPhase(macro, date) : null;
        },
        
        /**
         * Ottieni la settimana globale
         */
        getGlobalWeek: function(athleteId, date = new Date()) {
            const macro = this.getActive(athleteId);
            return macro ? getGlobalWeek(macro, date) : 1;
        },
        
        /**
         * Genera testo per il prompt AI
         */
        generatePromptContext: function(athleteId, date = new Date()) {
            const macro = this.getActive(athleteId);
            if (!macro) return '';
            
            const phase = getCurrentPhase(macro, date);
            const globalWeek = getGlobalWeek(macro, date);
            
            if (!phase) return '';
            
            const daysToEvent = Math.ceil((new Date(macro.targetDate) - date) / (24 * 60 * 60 * 1000));
            
            let text = `\n📅 MACROCICLO ATTIVO: "${macro.eventName}" (${macro.targetDate})`;
            text += `\n   Settimana ${globalWeek}/${macro.totalWeeks} - Mancano ${daysToEvent} giorni all'evento`;
            text += `\n   FASE CORRENTE: ${phase.name} (settimana ${phase.currentWeekInPhase}/${phase.weeks})`;
            text += `\n   Volume target: ${phase.volume}% | Intensità target: ${phase.intensity}%`;
            text += `\n   Focus: ${phase.focus}`;
            
            if (phase.isDeloadWeek) {
                text += `\n   ⚠️ QUESTA È UNA SETTIMANA DI DELOAD - Riduci volume del 40%`;
            }
            
            // Prossime fasi
            const phaseIndex = macro.phases.findIndex(p => p.code === phase.code);
            if (phaseIndex < macro.phases.length - 1) {
                const nextPhase = macro.phases[phaseIndex + 1];
                text += `\n   Prossima fase: ${nextPhase.name} tra ${phase.weeks - phase.currentWeekInPhase + 1} settimane`;
            }
            
            return text;
        },
        
        /**
         * Ottieni parametri per PeriodizationEngine
         */
        getParametersForPeriodization: function(athleteId, date = new Date()) {
            const macro = this.getActive(athleteId);
            if (!macro) return null;
            
            const phase = getCurrentPhase(macro, date);
            if (!phase) return null;
            
            return {
                phase: phase.code,
                volume: phase.volume,
                intensity: phase.intensity,
                focus: phase.focus,
                isDeload: phase.isDeloadWeek,
                weekInPhase: phase.currentWeekInPhase,
                totalPhaseWeeks: phase.weeks,
                daysToEvent: Math.ceil((new Date(macro.targetDate) - date) / (24 * 60 * 60 * 1000))
            };
        },
        
        /**
         * Preview di un piano senza salvarlo
         */
        preview: function(sport, targetDate) {
            return generatePhasePlan(sport, targetDate);
        },
        
        /**
         * Configurazioni disponibili
         */
        getConfigs: function() {
            return { ...PHASE_CONFIGS };
        },
        
        /**
         * Sport supportati
         */
        getSupportedSports: function() {
            return Object.keys(SPORT_CATEGORY_MAP);
        }
    };
})();

console.log('📅 MacrocyclePlanner caricato');
