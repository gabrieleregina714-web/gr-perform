/**
 * GR Perform - Recovery Prescriptor
 * 
 * SUPERA IL COACH UMANO: Prescrizioni di recupero personalizzate
 * basate su dati biometrici, storico e scienza del recupero.
 * 
 * Un coach umano dice "riposa". Questo sistema dice COME e QUANTO.
 */

window.RecoveryPrescriptor = (function() {
    'use strict';

    const VERSION = '1.0';
    const STORAGE_KEY = 'gr_recovery_prescriptor_v1';

    // Storico recupero per atleta
    // { athleteId: { recoveryEvents: [], patterns: {}, preferences: {} } }
    let recoveryHistory = {};

    // ═══════════════════════════════════════════════════════════════
    // DATABASE STRATEGIE RECUPERO
    // ═══════════════════════════════════════════════════════════════
    
    const RECOVERY_STRATEGIES = {
        // Recupero passivo
        sleep: {
            name: 'Sonno ottimizzato',
            category: 'passive',
            effectiveness: 0.95,
            duration: '7-9h',
            description: 'Il più potente strumento di recupero',
            tips: [
                'Camera a 18-20°C',
                'Niente schermi 1h prima',
                'Stesso orario ogni giorno',
                'Evita caffeina dopo le 14:00'
            ],
            conditions: { minFatigue: 0 } // Sempre utile
        },
        
        nap: {
            name: 'Power Nap',
            category: 'passive',
            effectiveness: 0.7,
            duration: '20-30min',
            description: 'Ricarica rapida senza compromettere il sonno notturno',
            tips: [
                'Ideale tra 13:00-15:00',
                'Max 30 minuti per evitare inerzia',
                'Usa maschera e tappi',
                'Caffè subito prima (coffee nap)'
            ],
            conditions: { minFatigue: 40 }
        },
        
        // Recupero attivo
        walk: {
            name: 'Camminata leggera',
            category: 'active',
            effectiveness: 0.6,
            duration: '20-40min',
            description: 'Promuove circolazione e riduce DOMS',
            tips: [
                'Ritmo conversazionale',
                'All\'aperto se possibile',
                'HR < 50% max',
                'Ideale la mattina'
            ],
            conditions: { minFatigue: 20, maxSoreness: 7 }
        },
        
        mobility: {
            name: 'Mobilità e stretching',
            category: 'active',
            effectiveness: 0.65,
            duration: '15-30min',
            description: 'Mantiene ROM e riduce rigidità',
            tips: [
                'Focus sulle aree allenate',
                'Stretching dinamico o statico leggero',
                '30-60s per posizione',
                'Respira profondamente'
            ],
            conditions: { minFatigue: 10, maxSoreness: 8 }
        },
        
        swimming: {
            name: 'Nuoto leggero',
            category: 'active',
            effectiveness: 0.75,
            duration: '20-30min',
            description: 'Scarica le articolazioni, promuove recupero muscolare',
            tips: [
                'Stile libero rilassato',
                'Non competere con te stesso',
                'Ottimo dopo lower body',
                'Acqua 26-28°C'
            ],
            conditions: { minFatigue: 30, equipment: 'pool' }
        },
        
        yoga: {
            name: 'Yoga restaurativo',
            category: 'active',
            effectiveness: 0.7,
            duration: '30-45min',
            description: 'Combina stretching, respirazione e rilassamento mentale',
            tips: [
                'Scegli pratica gentile (Yin, Restorative)',
                'Usa props (blocchi, cuscini)',
                'Focus sul respiro',
                'No posizioni impegnative'
            ],
            conditions: { minFatigue: 30 }
        },
        
        // Terapie
        massage: {
            name: 'Massaggio sportivo',
            category: 'therapy',
            effectiveness: 0.8,
            duration: '45-60min',
            description: 'Riduce tensione muscolare e migliora circolazione',
            tips: [
                'Comunica le aree dolenti',
                'Idratati dopo',
                'Evita prima di allenamenti intensi',
                'Ideale 24-48h post-allenamento'
            ],
            conditions: { minFatigue: 50, maxSoreness: 9 }
        },
        
        foam_rolling: {
            name: 'Foam Rolling / SMR',
            category: 'therapy',
            effectiveness: 0.6,
            duration: '10-15min',
            description: 'Self-myofascial release per tensioni muscolari',
            tips: [
                '30-60s per gruppo muscolare',
                'Evita articolazioni e ossa',
                'Pressione moderata (6-7/10)',
                'Respira e rilassa'
            ],
            conditions: { minFatigue: 20, equipment: 'foam_roller' }
        },
        
        cold_therapy: {
            name: 'Crioterapia / Bagno freddo',
            category: 'therapy',
            effectiveness: 0.7,
            duration: '10-15min',
            description: 'Riduce infiammazione e accelera recupero',
            tips: [
                'Acqua 10-15°C',
                'Max 15 minuti',
                'Non subito dopo strength training (può ridurre adattamenti)',
                'Ideale per sport con alto impatto'
            ],
            conditions: { minFatigue: 60, equipment: 'cold_tub' }
        },
        
        heat_therapy: {
            name: 'Sauna / Bagno caldo',
            category: 'therapy',
            effectiveness: 0.65,
            duration: '15-20min',
            description: 'Rilassa muscoli e migliora circolazione',
            tips: [
                'Sauna: 80-100°C per 15-20 min',
                'Bagno: 38-40°C',
                'Idratati molto',
                'Non se febbricitante'
            ],
            conditions: { minFatigue: 40, equipment: 'sauna' }
        },
        
        compression: {
            name: 'Compression boots / Indumenti',
            category: 'therapy',
            effectiveness: 0.6,
            duration: '20-30min',
            description: 'Migliora ritorno venoso e riduce gonfiore',
            tips: [
                'Usa dopo allenamenti intensi lower body',
                'Combina con elevazione gambe',
                'Ideale la sera',
                'Non dormire con compression'
            ],
            conditions: { minFatigue: 40, equipment: 'compression' }
        },
        
        // Nutrizione
        nutrition_recovery: {
            name: 'Nutrizione post-workout',
            category: 'nutrition',
            effectiveness: 0.85,
            duration: 'Entro 2h',
            description: 'Finestra anabolica per ricostruzione muscolare',
            tips: [
                'Proteine: 20-40g',
                'Carboidrati: 1-1.2g/kg',
                'Idratazione: 500ml + per ogni kg perso',
                'Esempio: petto pollo + riso + verdure'
            ],
            conditions: { minFatigue: 0 }
        },
        
        hydration: {
            name: 'Idratazione ottimizzata',
            category: 'nutrition',
            effectiveness: 0.75,
            duration: 'Tutto il giorno',
            description: 'Base per ogni processo di recupero',
            tips: [
                'Obiettivo: 35-40ml/kg/giorno',
                'Urina giallo chiaro = ok',
                'Elettroliti se sudorazione intensa',
                'Evita eccesso alcol'
            ],
            conditions: { minFatigue: 0 }
        },
        
        // Mentale
        meditation: {
            name: 'Meditazione / Respirazione',
            category: 'mental',
            effectiveness: 0.65,
            duration: '10-20min',
            description: 'Attiva parasimpatico, riduce cortisolo',
            tips: [
                'Box breathing: 4-4-4-4',
                'App: Headspace, Calm',
                'Ideale mattina o sera',
                'Anche 5 minuti aiutano'
            ],
            conditions: { minStress: 5 }
        },
        
        nature: {
            name: 'Tempo nella natura',
            category: 'mental',
            effectiveness: 0.7,
            duration: '30-60min',
            description: 'Riduce stress, migliora umore e recupero mentale',
            tips: [
                'Foresta > città',
                'Lascia il telefono',
                'Cammina o siediti',
                '"Forest bathing" giapponese'
            ],
            conditions: { minStress: 4 }
        },
        
        social: {
            name: 'Socializzazione positiva',
            category: 'mental',
            effectiveness: 0.6,
            duration: '1-2h',
            description: 'Connessione sociale riduce stress e migliora recupero',
            tips: [
                'Scegli persone positive',
                'Evita discussioni stressanti',
                'Ride e divertiti',
                'No parlare solo di allenamento'
            ],
            conditions: { minStress: 3 }
        }
    };

    // Template protocolli per situazioni specifiche
    const RECOVERY_PROTOCOLS = {
        high_volume_day: {
            name: 'Post-Allenamento Alto Volume',
            strategies: ['nutrition_recovery', 'hydration', 'walk', 'foam_rolling', 'sleep'],
            priority: 'high'
        },
        high_intensity_day: {
            name: 'Post-Allenamento Alta Intensità',
            strategies: ['nutrition_recovery', 'mobility', 'cold_therapy', 'sleep'],
            priority: 'high'
        },
        doms_recovery: {
            name: 'Recupero DOMS',
            strategies: ['walk', 'foam_rolling', 'mobility', 'heat_therapy', 'hydration'],
            priority: 'medium'
        },
        mental_fatigue: {
            name: 'Fatica Mentale',
            strategies: ['meditation', 'nature', 'nap', 'social', 'mobility'],
            priority: 'medium'
        },
        pre_competition: {
            name: 'Pre-Gara (24-48h)',
            strategies: ['sleep', 'nutrition_recovery', 'mobility', 'meditation'],
            priority: 'critical'
        },
        deload_week: {
            name: 'Settimana Deload',
            strategies: ['yoga', 'swimming', 'massage', 'nature', 'sleep'],
            priority: 'medium'
        },
        injury_prevention: {
            name: 'Prevenzione Infortuni',
            strategies: ['mobility', 'foam_rolling', 'sleep', 'hydration'],
            priority: 'high'
        },
        travel_recovery: {
            name: 'Recupero Viaggi/Jet Lag',
            strategies: ['hydration', 'walk', 'sleep', 'meditation', 'nature'],
            priority: 'medium'
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // INIZIALIZZAZIONE
    // ═══════════════════════════════════════════════════════════════
    
    function init() {
        loadFromStorage();
        console.log('💆 RecoveryPrescriptor initialized');
    }

    function loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                recoveryHistory = JSON.parse(stored);
            }
        } catch (e) {
            console.warn('RecoveryPrescriptor: Failed to load from storage', e);
        }
    }

    function saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recoveryHistory));
        } catch (e) {
            console.warn('RecoveryPrescriptor: Failed to save to storage', e);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // PRESCRIZIONE RECUPERO
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Genera prescrizione di recupero personalizzata
     * @param {object} context - { athleteId, fatigue, soreness, stress, sleep, readiness, equipment, ... }
     * @returns {{ prescription: [], protocol: string, urgency: string }}
     */
    function prescribe(context) {
        const {
            athleteId,
            fatigue = 50,         // 0-100
            soreness = [],        // ['legs', 'back', ...]
            stress = 5,           // 1-10
            sleep = 7,            // ore
            readiness = 70,       // 0-100
            equipment = [],       // ['pool', 'sauna', 'foam_roller', ...]
            phase = 'accumulo',   // fase allenamento
            nextWorkoutIn = 24,   // ore
            workoutType = null    // 'high_volume', 'high_intensity', etc.
        } = context;

        const sorenessAreas = Array.isArray(soreness) ? soreness : [];
        const availableEquipment = new Set(Array.isArray(equipment) ? equipment : []);
        
        // Determina urgenza
        let urgency = 'normal';
        if (fatigue > 80 || readiness < 40) urgency = 'high';
        if (fatigue > 90 || readiness < 30) urgency = 'critical';
        
        // Seleziona protocollo base
        let protocol = 'standard';
        if (workoutType === 'high_volume') protocol = 'high_volume_day';
        else if (workoutType === 'high_intensity') protocol = 'high_intensity_day';
        else if (sorenessAreas.length >= 3) protocol = 'doms_recovery';
        else if (stress >= 7) protocol = 'mental_fatigue';
        else if (phase === 'deload') protocol = 'deload_week';
        else if (nextWorkoutIn <= 48 && phase === 'peaking') protocol = 'pre_competition';
        
        // Filtra strategie applicabili
        const applicableStrategies = [];
        
        for (const [key, strategy] of Object.entries(RECOVERY_STRATEGIES)) {
            const cond = strategy.conditions || {};
            
            // Check condizioni
            let applicable = true;
            
            if (cond.minFatigue !== undefined && fatigue < cond.minFatigue) applicable = false;
            if (cond.maxSoreness !== undefined && sorenessAreas.length > cond.maxSoreness) applicable = false;
            if (cond.minStress !== undefined && stress < cond.minStress) applicable = false;
            if (cond.equipment && !availableEquipment.has(cond.equipment)) applicable = false;
            
            if (applicable) {
                applicableStrategies.push({
                    key,
                    ...strategy,
                    relevanceScore: calculateRelevance(key, context)
                });
            }
        }
        
        // Ordina per rilevanza
        applicableStrategies.sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        // Seleziona top strategie (mix di categorie)
        const prescription = [];
        const selectedCategories = new Set();
        
        // Prima le critiche dal protocollo
        const protocolStrategies = RECOVERY_PROTOCOLS[protocol]?.strategies || [];
        for (const stratKey of protocolStrategies) {
            const strat = applicableStrategies.find(s => s.key === stratKey);
            if (strat && !selectedCategories.has(strat.category)) {
                prescription.push(formatPrescriptionItem(strat, context));
                selectedCategories.add(strat.category);
                if (prescription.length >= 5) break;
            }
        }
        
        // Poi aggiungi altre rilevanti
        for (const strat of applicableStrategies) {
            if (prescription.length >= 5) break;
            if (prescription.find(p => p.key === strat.key)) continue;
            if (selectedCategories.has(strat.category) && prescription.length >= 3) continue;
            
            prescription.push(formatPrescriptionItem(strat, context));
            selectedCategories.add(strat.category);
        }
        
        // Aggiungi note personalizzate
        const notes = generatePersonalizedNotes(context, prescription);
        
        return {
            prescription,
            protocol,
            protocolName: RECOVERY_PROTOCOLS[protocol]?.name || 'Recupero Standard',
            urgency,
            notes,
            nextCheckIn: urgency === 'critical' ? '12h' : urgency === 'high' ? '24h' : '48h'
        };
    }

    /**
     * Calcola rilevanza di una strategia per il contesto
     */
    function calculateRelevance(strategyKey, context) {
        let score = RECOVERY_STRATEGIES[strategyKey].effectiveness * 100;
        
        const { fatigue = 50, soreness = [], stress = 5, sleep = 7 } = context;
        const strategy = RECOVERY_STRATEGIES[strategyKey];
        
        // Boost per categorie rilevanti
        if (strategy.category === 'passive' && fatigue > 70) score += 20;
        if (strategy.category === 'active' && fatigue >= 30 && fatigue <= 60) score += 15;
        if (strategy.category === 'therapy' && soreness.length > 0) score += 15;
        if (strategy.category === 'mental' && stress >= 6) score += 20;
        if (strategy.category === 'nutrition') score += 10; // Sempre utile
        
        // Penalità se già dormito bene
        if (strategyKey === 'sleep' && sleep >= 8) score -= 10;
        
        // Boost per DOMS
        if (soreness.length >= 2 && ['foam_rolling', 'massage', 'walk', 'cold_therapy'].includes(strategyKey)) {
            score += 15;
        }
        
        return score;
    }

    /**
     * Formatta item prescrizione
     */
    function formatPrescriptionItem(strategy, context) {
        const { fatigue = 50, soreness = [] } = context;
        
        // Personalizza durata
        let duration = strategy.duration;
        if (fatigue > 70 && strategy.category === 'active') {
            duration = 'Ridotta: ' + (strategy.duration.includes('-') 
                ? strategy.duration.split('-')[0] + 'min' 
                : strategy.duration);
        }
        
        // Seleziona tips rilevanti
        const tips = strategy.tips.slice(0, 2);
        
        // Priorità
        let priority = 'normal';
        if (strategy.effectiveness >= 0.8) priority = 'high';
        if (strategy.effectiveness >= 0.9) priority = 'essential';
        
        return {
            key: strategy.key,
            name: strategy.name,
            category: strategy.category,
            duration,
            description: strategy.description,
            tips,
            priority,
            effectiveness: Math.round(strategy.effectiveness * 100)
        };
    }

    /**
     * Genera note personalizzate
     */
    function generatePersonalizedNotes(context, prescription) {
        const notes = [];
        const { fatigue, soreness = [], stress, sleep, readiness, nextWorkoutIn } = context;
        
        if (sleep < 6) {
            notes.push({
                type: 'warning',
                text: `Solo ${sleep}h di sonno - priorità assoluta al riposo stanotte`
            });
        }
        
        if (fatigue > 80) {
            notes.push({
                type: 'warning',
                text: 'Fatica elevata - considera di posticipare il prossimo allenamento intenso'
            });
        }
        
        if (soreness.length >= 3) {
            notes.push({
                type: 'info',
                text: `DOMS diffuso (${soreness.join(', ')}) - focus su recupero attivo leggero`
            });
        }
        
        if (stress >= 8) {
            notes.push({
                type: 'info',
                text: 'Stress alto - includi almeno una attività mentale/rilassante'
            });
        }
        
        if (nextWorkoutIn <= 24 && fatigue > 60) {
            notes.push({
                type: 'warning',
                text: 'Prossimo allenamento entro 24h ma fatica alta - considera workout ridotto'
            });
        }
        
        if (readiness < 50) {
            notes.push({
                type: 'critical',
                text: 'Readiness critica - oggi priorità recupero su tutto'
            });
        }
        
        return notes;
    }

    // ═══════════════════════════════════════════════════════════════
    // TRACKING & LEARNING
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Registra strategia di recupero utilizzata
     */
    function recordRecoveryUsed(athleteId, strategyKey, feedback) {
        if (!recoveryHistory[athleteId]) {
            recoveryHistory[athleteId] = {
                events: [],
                preferences: {},
                effectiveness: {}
            };
        }
        
        const hist = recoveryHistory[athleteId];
        
        // Registra evento
        hist.events.push({
            date: new Date().toISOString(),
            strategy: strategyKey,
            feeling: feedback.feeling || null,      // 1-5
            effectiveness: feedback.effectiveness || null, // 1-5
            notes: feedback.notes || null
        });
        
        // Mantieni solo ultimi 100 eventi
        if (hist.events.length > 100) hist.events.shift();
        
        // Aggiorna efficacia personale
        if (feedback.effectiveness) {
            if (!hist.effectiveness[strategyKey]) {
                hist.effectiveness[strategyKey] = { total: 0, count: 0 };
            }
            hist.effectiveness[strategyKey].total += feedback.effectiveness;
            hist.effectiveness[strategyKey].count++;
        }
        
        saveToStorage();
    }

    /**
     * Ottieni strategie preferite dall'atleta
     */
    function getAthletePreferences(athleteId) {
        const hist = recoveryHistory[athleteId];
        if (!hist?.effectiveness) return {};
        
        const prefs = {};
        for (const [key, data] of Object.entries(hist.effectiveness)) {
            if (data.count >= 3) {
                prefs[key] = {
                    avgEffectiveness: data.total / data.count,
                    usageCount: data.count
                };
            }
        }
        
        return prefs;
    }

    // ═══════════════════════════════════════════════════════════════
    // PROMPT GENERATION
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Genera prompt section per l'AI
     */
    function generatePromptSection(athleteId, context) {
        const prescription = prescribe({ athleteId, ...context });
        
        const lines = ['═══ RECOVERY PRESCRIPTOR ═══'];
        
        lines.push(`📋 Protocollo: ${prescription.protocolName}`);
        lines.push(`⚡ Urgenza: ${prescription.urgency.toUpperCase()}`);
        
        lines.push('\n🎯 Prescrizione recupero oggi:');
        for (let i = 0; i < Math.min(prescription.prescription.length, 4); i++) {
            const item = prescription.prescription[i];
            const priority = item.priority === 'essential' ? '🔴' : item.priority === 'high' ? '🟠' : '🟢';
            lines.push(`  ${priority} ${item.name} (${item.duration})`);
        }
        
        if (prescription.notes.length > 0) {
            lines.push('\n⚠️ Note:');
            for (const note of prescription.notes) {
                lines.push(`  • ${note.text}`);
            }
        }
        
        lines.push(`\n⏰ Prossimo check: ${prescription.nextCheckIn}`);
        
        // Aggiungi preferenze atleta se disponibili
        const prefs = getAthletePreferences(athleteId);
        const topPrefs = Object.entries(prefs)
            .sort((a, b) => b[1].avgEffectiveness - a[1].avgEffectiveness)
            .slice(0, 3);
        
        if (topPrefs.length > 0) {
            lines.push('\n👤 Strategie preferite atleta:');
            for (const [key, data] of topPrefs) {
                const strat = RECOVERY_STRATEGIES[key];
                if (strat) {
                    lines.push(`  • ${strat.name} (${Math.round(data.avgEffectiveness)}/5 avg)`);
                }
            }
        }
        
        return lines.join('\n');
    }

    /**
     * Genera raccomandazione breve per UI
     */
    function getQuickRecommendation(context) {
        const prescription = prescribe(context);
        
        if (prescription.urgency === 'critical') {
            return {
                icon: '🚨',
                title: 'Recupero Critico',
                text: 'Priorità assoluta al riposo oggi',
                color: '#E63946'
            };
        }
        
        if (prescription.urgency === 'high') {
            const top = prescription.prescription[0];
            return {
                icon: '⚠️',
                title: 'Focus Recupero',
                text: `Consigliato: ${top?.name || 'riposo'}`,
                color: '#FFB300'
            };
        }
        
        const top = prescription.prescription[0];
        return {
            icon: '💆',
            title: 'Recupero Attivo',
            text: top ? `${top.name} (${top.duration})` : 'Mantieni routine',
            color: '#00D26A'
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════
    
    function getStats() {
        let totalEvents = 0;
        for (const hist of Object.values(recoveryHistory)) {
            totalEvents += hist.events?.length || 0;
        }
        
        return {
            version: VERSION,
            athletesTracked: Object.keys(recoveryHistory).length,
            totalRecoveryEvents: totalEvents,
            strategiesAvailable: Object.keys(RECOVERY_STRATEGIES).length,
            protocolsAvailable: Object.keys(RECOVERY_PROTOCOLS).length
        };
    }

    function getStrategies() {
        return RECOVERY_STRATEGIES;
    }

    function getProtocols() {
        return RECOVERY_PROTOCOLS;
    }

    // Inizializza
    init();

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════
    
    return {
        VERSION,
        
        // Prescrizione
        prescribe,
        getQuickRecommendation,
        
        // Tracking
        recordRecoveryUsed,
        getAthletePreferences,
        
        // Prompt
        generatePromptSection,
        
        // Data
        getStrategies,
        getProtocols,
        
        // Utility
        getStats
    };
})();

console.log('💆 RecoveryPrescriptor module loaded');
