// ============================================
// GR PERFORM - WEEK CONTEXT ENGINE v1.0
// ============================================
// Calcola automaticamente il contesto settimanale
// basandosi sulla distanza dal match (MD-x / MD+x)
// ============================================

const WeekContextEngine = {
    
    version: '1.0.0',
    name: 'WeekContextEngine',
    
    // ===========================================
    // CONFIGURAZIONE MD-x PER SPORT
    // ===========================================
    
    sportProfiles: {
        // CALCIO / FOOTBALL
        calcio: {
            typicalMatchDays: [0, 6], // Domenica e Sabato
            weekStructure: {
                'MD-5': { focus: 'recovery', intensity: 40, volume: 30, description: 'Recupero post-gara' },
                'MD-4': { focus: 'strength', intensity: 70, volume: 60, description: 'Forza submassimale' },
                'MD-3': { focus: 'power', intensity: 85, volume: 50, description: 'Potenza e velocità' },
                'MD-2': { focus: 'tactical', intensity: 75, volume: 40, description: 'Tattica + attivazione' },
                'MD-1': { focus: 'activation', intensity: 50, volume: 25, description: 'Attivazione pre-gara' },
                'MD': { focus: 'match', intensity: 100, volume: 0, description: 'GIORNO GARA' },
                'MD+1': { focus: 'active_recovery', intensity: 30, volume: 20, description: 'Recupero attivo' },
                'MD+2': { focus: 'regeneration', intensity: 45, volume: 35, description: 'Rigenerazione' }
            },
            recoveryDays: 2,
            peakDaysBefore: 3
        },
        
        // BASKET / BASKETBALL
        basket: {
            typicalMatchDays: [0, 3, 6], // Più partite a settimana
            weekStructure: {
                'MD-3': { focus: 'strength', intensity: 75, volume: 50, description: 'Forza funzionale' },
                'MD-2': { focus: 'power', intensity: 80, volume: 40, description: 'Potenza e reattività' },
                'MD-1': { focus: 'activation', intensity: 55, volume: 25, description: 'Attivazione neuromuscolare' },
                'MD': { focus: 'match', intensity: 100, volume: 0, description: 'GIORNO GARA' },
                'MD+1': { focus: 'recovery', intensity: 35, volume: 25, description: 'Recupero' }
            },
            recoveryDays: 1,
            peakDaysBefore: 2
        },
        
        // PALLAVOLO / VOLLEYBALL
        pallavolo: {
            typicalMatchDays: [0, 3, 6],
            weekStructure: {
                'MD-3': { focus: 'strength', intensity: 75, volume: 55, description: 'Forza + pliometria' },
                'MD-2': { focus: 'power', intensity: 80, volume: 45, description: 'Potenza verticale' },
                'MD-1': { focus: 'activation', intensity: 50, volume: 20, description: 'Attivazione' },
                'MD': { focus: 'match', intensity: 100, volume: 0, description: 'GIORNO GARA' },
                'MD+1': { focus: 'recovery', intensity: 35, volume: 25, description: 'Recupero' }
            },
            recoveryDays: 1,
            peakDaysBefore: 2
        },
        
        // MMA / COMBAT SPORTS
        mma: {
            typicalMatchDays: [6], // Fight night tipicamente sabato
            weekStructure: {
                'MD-14': { focus: 'strength', intensity: 85, volume: 70, description: 'Forza massimale' },
                'MD-10': { focus: 'power', intensity: 90, volume: 60, description: 'Potenza esplosiva' },
                'MD-7': { focus: 'conditioning', intensity: 80, volume: 65, description: 'Condizionamento specifico' },
                'MD-5': { focus: 'technical', intensity: 75, volume: 50, description: 'Tecnica + sparring leggero' },
                'MD-3': { focus: 'taper', intensity: 60, volume: 35, description: 'Inizio tapering' },
                'MD-2': { focus: 'activation', intensity: 50, volume: 25, description: 'Attivazione + peso' },
                'MD-1': { focus: 'rest', intensity: 20, volume: 10, description: 'Riposo + taglio peso' },
                'MD': { focus: 'fight', intensity: 100, volume: 0, description: 'FIGHT DAY' },
                'MD+1': { focus: 'recovery', intensity: 20, volume: 10, description: 'Recupero totale' },
                'MD+3': { focus: 'active_recovery', intensity: 40, volume: 30, description: 'Recupero attivo' }
            },
            recoveryDays: 5,
            peakDaysBefore: 7
        },
        
        // PUGILATO / BOXING
        boxe: {
            typicalMatchDays: [6],
            weekStructure: {
                'MD-14': { focus: 'strength', intensity: 85, volume: 70, description: 'Forza massimale' },
                'MD-10': { focus: 'power', intensity: 90, volume: 60, description: 'Potenza pugni' },
                'MD-7': { focus: 'conditioning', intensity: 85, volume: 65, description: 'Condizionamento' },
                'MD-5': { focus: 'sparring', intensity: 80, volume: 50, description: 'Sparring intenso' },
                'MD-3': { focus: 'taper', intensity: 55, volume: 35, description: 'Tapering' },
                'MD-2': { focus: 'technical', intensity: 45, volume: 25, description: 'Tecnica leggera' },
                'MD-1': { focus: 'rest', intensity: 20, volume: 10, description: 'Riposo + peso' },
                'MD': { focus: 'fight', intensity: 100, volume: 0, description: 'FIGHT NIGHT' },
                'MD+1': { focus: 'recovery', intensity: 15, volume: 5, description: 'Recupero totale' }
            },
            recoveryDays: 5,
            peakDaysBefore: 7
        },
        
        // RUGBY
        rugby: {
            typicalMatchDays: [6], // Sabato tipicamente
            weekStructure: {
                'MD-5': { focus: 'recovery', intensity: 40, volume: 30, description: 'Recupero post-gara' },
                'MD-4': { focus: 'strength', intensity: 80, volume: 65, description: 'Forza pesante' },
                'MD-3': { focus: 'power', intensity: 85, volume: 55, description: 'Potenza + velocità' },
                'MD-2': { focus: 'tactical', intensity: 70, volume: 45, description: 'Tattica + conditioning' },
                'MD-1': { focus: 'activation', intensity: 45, volume: 25, description: 'Attivazione + captain run' },
                'MD': { focus: 'match', intensity: 100, volume: 0, description: 'GIORNO GARA' },
                'MD+1': { focus: 'recovery', intensity: 25, volume: 15, description: 'Recupero + piscina' }
            },
            recoveryDays: 2,
            peakDaysBefore: 3
        },
        
        // TENNIS
        tennis: {
            typicalMatchDays: [1, 2, 3, 4, 5, 6, 0], // Torneo = tutti i giorni
            weekStructure: {
                'MD-2': { focus: 'strength', intensity: 70, volume: 45, description: 'Forza mantenimento' },
                'MD-1': { focus: 'activation', intensity: 50, volume: 30, description: 'Attivazione + pratica' },
                'MD': { focus: 'match', intensity: 100, volume: 0, description: 'GIORNO MATCH' },
                'MD+1': { focus: 'recovery', intensity: 35, volume: 25, description: 'Recupero attivo' }
            },
            recoveryDays: 1,
            peakDaysBefore: 2
        },
        
        // NUOTO / SWIMMING
        nuoto: {
            typicalMatchDays: [6, 0], // Weekend gare
            weekStructure: {
                'MD-7': { focus: 'volume', intensity: 70, volume: 85, description: 'Alto volume' },
                'MD-5': { focus: 'threshold', intensity: 80, volume: 70, description: 'Soglia + tecnica' },
                'MD-3': { focus: 'speed', intensity: 90, volume: 50, description: 'Velocità + partenze' },
                'MD-2': { focus: 'taper', intensity: 75, volume: 40, description: 'Tapering' },
                'MD-1': { focus: 'activation', intensity: 60, volume: 25, description: 'Attivazione + virate' },
                'MD': { focus: 'race', intensity: 100, volume: 0, description: 'GARA' },
                'MD+1': { focus: 'recovery', intensity: 40, volume: 30, description: 'Recupero attivo' }
            },
            recoveryDays: 1,
            peakDaysBefore: 3
        },
        
        // ATLETICA / TRACK & FIELD
        atletica: {
            typicalMatchDays: [6, 0],
            weekStructure: {
                'MD-6': { focus: 'strength', intensity: 80, volume: 60, description: 'Forza specifica' },
                'MD-4': { focus: 'speed', intensity: 95, volume: 40, description: 'Velocità massimale' },
                'MD-3': { focus: 'technical', intensity: 75, volume: 45, description: 'Tecnica di gara' },
                'MD-2': { focus: 'taper', intensity: 60, volume: 30, description: 'Tapering' },
                'MD-1': { focus: 'activation', intensity: 50, volume: 20, description: 'Attivazione CNS' },
                'MD': { focus: 'competition', intensity: 100, volume: 0, description: 'GARA' },
                'MD+1': { focus: 'recovery', intensity: 35, volume: 25, description: 'Recupero' }
            },
            recoveryDays: 2,
            peakDaysBefore: 4
        },
        
        // CROSSFIT
        crossfit: {
            typicalMatchDays: [6, 0], // Competition weekend
            weekStructure: {
                'MD-5': { focus: 'strength', intensity: 85, volume: 65, description: 'Forza pesante' },
                'MD-4': { focus: 'conditioning', intensity: 80, volume: 70, description: 'MetCon intenso' },
                'MD-3': { focus: 'skills', intensity: 70, volume: 55, description: 'Skills + tecnica' },
                'MD-2': { focus: 'taper', intensity: 60, volume: 40, description: 'Tapering' },
                'MD-1': { focus: 'activation', intensity: 50, volume: 25, description: 'Attivazione' },
                'MD': { focus: 'competition', intensity: 100, volume: 0, description: 'COMPETITION' },
                'MD+1': { focus: 'recovery', intensity: 30, volume: 20, description: 'Recupero attivo' }
            },
            recoveryDays: 2,
            peakDaysBefore: 3
        },
        
        // DEFAULT / FITNESS GENERALE
        default: {
            typicalMatchDays: [],
            weekStructure: {
                'standard': { focus: 'balanced', intensity: 70, volume: 60, description: 'Allenamento standard' }
            },
            recoveryDays: 1,
            peakDaysBefore: 0
        }
    },
    
    // ===========================================
    // CALCOLO CONTESTO SETTIMANALE
    // ===========================================
    
    async analyze(athlete, events = []) {
        console.log('📅 WeekContextEngine: Analisi contesto settimanale...');
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Trova il prossimo evento (match/fight/gara)
        const nextEvent = this.findNextEvent(events, today);
        const lastEvent = this.findLastEvent(events, today);
        
        // Determina sport e profilo
        const sport = this.normalizeSport(athlete?.sport);
        const profile = this.sportProfiles[sport] || this.sportProfiles.default;
        
        // Calcola MD-x
        const mdContext = this.calculateMDContext(today, nextEvent, lastEvent, profile);
        
        // Determina fase della settimana
        const weekPhase = this.determineWeekPhase(mdContext, profile);
        
        // Suggerimenti per l'allenamento
        const recommendations = this.generateRecommendations(mdContext, weekPhase, profile, athlete);
        
        const result = {
            // Timing
            today: today.toISOString().split('T')[0],
            dayOfWeek: this.getDayName(today),
            weekNumber: this.getWeekNumber(today),
            
            // Eventi
            nextEvent: nextEvent ? {
                name: nextEvent.name || nextEvent.title,
                date: nextEvent.date,
                type: nextEvent.type,
                daysUntil: mdContext.daysToMatch
            } : null,
            lastEvent: lastEvent ? {
                name: lastEvent.name || lastEvent.title,
                date: lastEvent.date,
                type: lastEvent.type,
                daysSince: mdContext.daysFromMatch
            } : null,
            
            // MD Context
            md: mdContext,
            
            // Fase attuale
            phase: weekPhase,
            
            // Profilo sport
            sportProfile: {
                sport: sport,
                recoveryDays: profile.recoveryDays,
                peakDaysBefore: profile.peakDaysBefore
            },
            
            // Raccomandazioni
            recommendations: recommendations,
            
            // Per il RationaleEngine
            forRationale: this.formatForRationale(mdContext, weekPhase, recommendations),
            
            // Per il prompt AI
            forPrompt: this.formatForPrompt(mdContext, weekPhase, recommendations, nextEvent, lastEvent)
        };
        
        console.log('📅 WeekContextEngine: Contesto calcolato', result);
        return result;
    },
    
    // ===========================================
    // TROVA EVENTI
    // ===========================================
    
    findNextEvent(events, today) {
        if (!events || events.length === 0) return null;
        
        const matchTypes = ['match', 'fight', 'gara', 'competition', 'partita', 'incontro'];
        
        const futureEvents = events
            .filter(e => {
                const eventDate = new Date(e.date);
                eventDate.setHours(0, 0, 0, 0);
                return eventDate >= today;
            })
            .filter(e => {
                const type = (e.type || '').toLowerCase();
                const name = (e.name || e.title || '').toLowerCase();
                return matchTypes.some(mt => type.includes(mt) || name.includes(mt));
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return futureEvents[0] || null;
    },
    
    findLastEvent(events, today) {
        if (!events || events.length === 0) return null;
        
        const matchTypes = ['match', 'fight', 'gara', 'competition', 'partita', 'incontro'];
        
        const pastEvents = events
            .filter(e => {
                const eventDate = new Date(e.date);
                eventDate.setHours(0, 0, 0, 0);
                return eventDate < today;
            })
            .filter(e => {
                const type = (e.type || '').toLowerCase();
                const name = (e.name || e.title || '').toLowerCase();
                return matchTypes.some(mt => type.includes(mt) || name.includes(mt));
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return pastEvents[0] || null;
    },
    
    // ===========================================
    // CALCOLA CONTESTO MD-x
    // ===========================================
    
    calculateMDContext(today, nextEvent, lastEvent, profile) {
        const context = {
            daysToMatch: null,
            daysFromMatch: null,
            mdLabel: null,
            mdType: 'none', // 'pre', 'match', 'post', 'none'
            intensity: 70,
            volume: 60
        };
        
        // Calcola giorni al prossimo evento
        if (nextEvent) {
            const eventDate = new Date(nextEvent.date);
            eventDate.setHours(0, 0, 0, 0);
            const diffTime = eventDate - today;
            context.daysToMatch = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (context.daysToMatch === 0) {
                context.mdLabel = 'MD';
                context.mdType = 'match';
            } else if (context.daysToMatch > 0 && context.daysToMatch <= 14) {
                context.mdLabel = `MD-${context.daysToMatch}`;
                context.mdType = 'pre';
            }
        }
        
        // Calcola giorni dall'ultimo evento
        if (lastEvent) {
            const eventDate = new Date(lastEvent.date);
            eventDate.setHours(0, 0, 0, 0);
            const diffTime = today - eventDate;
            context.daysFromMatch = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (context.daysFromMatch <= profile.recoveryDays) {
                context.mdLabel = `MD+${context.daysFromMatch}`;
                context.mdType = 'post';
            }
        }
        
        // Determina intensità/volume dal profilo
        if (context.mdLabel && profile.weekStructure[context.mdLabel]) {
            const dayProfile = profile.weekStructure[context.mdLabel];
            context.intensity = dayProfile.intensity;
            context.volume = dayProfile.volume;
            context.focus = dayProfile.focus;
            context.description = dayProfile.description;
        } else if (context.mdType === 'pre' && context.daysToMatch > 5) {
            // Giorni lontani dalla gara = allenamento normale/accumulo
            context.intensity = 75;
            context.volume = 70;
            context.focus = 'accumulation';
            context.description = 'Fase di accumulo';
        }
        
        return context;
    },
    
    // ===========================================
    // DETERMINA FASE SETTIMANALE
    // ===========================================
    
    determineWeekPhase(mdContext, profile) {
        const phases = {
            MATCH_DAY: 'match_day',
            RECOVERY: 'recovery',
            REGENERATION: 'regeneration',
            ACCUMULATION: 'accumulation',
            INTENSIFICATION: 'intensification',
            REALIZATION: 'realization',
            TAPER: 'taper',
            ACTIVATION: 'activation',
            NORMAL: 'normal'
        };
        
        // Match day
        if (mdContext.daysToMatch === 0) {
            return {
                phase: phases.MATCH_DAY,
                label: 'GIORNO GARA',
                color: 'red',
                icon: '🏆',
                priority: 'match',
                gymAllowed: false
            };
        }
        
        // Post-match recovery (MD+1, MD+2)
        if (mdContext.mdType === 'post') {
            if (mdContext.daysFromMatch === 1) {
                return {
                    phase: phases.RECOVERY,
                    label: 'RECUPERO POST-GARA',
                    color: 'cyan',
                    icon: '🧊',
                    priority: 'recovery',
                    gymAllowed: true,
                    gymFocus: 'active_recovery'
                };
            } else {
                return {
                    phase: phases.REGENERATION,
                    label: 'RIGENERAZIONE',
                    color: 'green',
                    icon: '🔄',
                    priority: 'regeneration',
                    gymAllowed: true,
                    gymFocus: 'light_strength'
                };
            }
        }
        
        // Pre-match phases
        if (mdContext.mdType === 'pre') {
            if (mdContext.daysToMatch === 1) {
                return {
                    phase: phases.ACTIVATION,
                    label: 'ATTIVAZIONE PRE-GARA',
                    color: 'orange',
                    icon: '⚡',
                    priority: 'activation',
                    gymAllowed: true,
                    gymFocus: 'neural_activation'
                };
            } else if (mdContext.daysToMatch === 2) {
                return {
                    phase: phases.TAPER,
                    label: 'TAPERING',
                    color: 'purple',
                    icon: '📉',
                    priority: 'taper',
                    gymAllowed: true,
                    gymFocus: 'maintenance'
                };
            } else if (mdContext.daysToMatch <= profile.peakDaysBefore) {
                return {
                    phase: phases.REALIZATION,
                    label: 'REALIZZAZIONE',
                    color: 'red',
                    icon: '🎯',
                    priority: 'realization',
                    gymAllowed: true,
                    gymFocus: 'power_speed'
                };
            } else if (mdContext.daysToMatch <= 5) {
                return {
                    phase: phases.INTENSIFICATION,
                    label: 'INTENSIFICAZIONE',
                    color: 'orange',
                    icon: '🔥',
                    priority: 'intensity',
                    gymAllowed: true,
                    gymFocus: 'strength_power'
                };
            } else {
                return {
                    phase: phases.ACCUMULATION,
                    label: 'ACCUMULO',
                    color: 'blue',
                    icon: '📊',
                    priority: 'volume',
                    gymAllowed: true,
                    gymFocus: 'hypertrophy_strength'
                };
            }
        }
        
        // No events nearby
        return {
            phase: phases.NORMAL,
            label: 'SETTIMANA STANDARD',
            color: 'gray',
            icon: '📅',
            priority: 'balanced',
            gymAllowed: true,
            gymFocus: 'progressive_overload'
        };
    },
    
    // ===========================================
    // GENERA RACCOMANDAZIONI
    // ===========================================
    
    generateRecommendations(mdContext, weekPhase, profile, athlete) {
        const recommendations = {
            sessionType: 'full_body',
            volumeModifier: 1.0,
            intensityModifier: 1.0,
            focusAreas: [],
            avoidAreas: [],
            priorityOrder: [],
            timeRecommendation: 60,
            warmupEmphasis: 'standard',
            cooldownEmphasis: 'standard',
            notes: []
        };
        
        // Modifica in base alla fase
        switch (weekPhase.phase) {
            case 'match_day':
                recommendations.sessionType = 'none';
                recommendations.volumeModifier = 0;
                recommendations.intensityModifier = 0;
                recommendations.notes.push('⚠️ GIORNO GARA - Nessun allenamento in palestra');
                break;
                
            case 'recovery':
                recommendations.sessionType = 'active_recovery';
                recommendations.volumeModifier = 0.3;
                recommendations.intensityModifier = 0.4;
                recommendations.focusAreas = ['mobility', 'stretching', 'core_stability'];
                recommendations.avoidAreas = ['heavy_compounds', 'plyometrics', 'high_intensity'];
                recommendations.timeRecommendation = 30;
                recommendations.warmupEmphasis = 'extended';
                recommendations.notes.push('🧊 Focus su recupero attivo e rigenerazione');
                recommendations.notes.push('❌ Evitare carichi pesanti e impatti');
                break;
                
            case 'regeneration':
                recommendations.sessionType = 'light_strength';
                recommendations.volumeModifier = 0.5;
                recommendations.intensityModifier = 0.55;
                recommendations.focusAreas = ['blood_flow', 'light_resistance', 'prehab'];
                recommendations.avoidAreas = ['maximal_effort', 'eccentric_emphasis'];
                recommendations.timeRecommendation = 40;
                recommendations.notes.push('🔄 Lavoro rigenerativo con carichi leggeri');
                break;
                
            case 'activation':
                recommendations.sessionType = 'neural_activation';
                recommendations.volumeModifier = 0.35;
                recommendations.intensityModifier = 0.6;
                recommendations.focusAreas = ['explosive_movements', 'cns_activation', 'sport_specific'];
                recommendations.avoidAreas = ['fatigue_inducing', 'high_volume', 'new_exercises'];
                recommendations.timeRecommendation = 25;
                recommendations.warmupEmphasis = 'dynamic';
                recommendations.priorityOrder = ['activation', 'power', 'mobility'];
                recommendations.notes.push('⚡ Solo attivazione neuromuscolare');
                recommendations.notes.push('⏱️ Sessione breve e mirata');
                break;
                
            case 'taper':
                recommendations.sessionType = 'maintenance';
                recommendations.volumeModifier = 0.5;
                recommendations.intensityModifier = 0.7;
                recommendations.focusAreas = ['strength_maintenance', 'power'];
                recommendations.avoidAreas = ['volume_work', 'new_stimuli', 'metabolic_stress'];
                recommendations.timeRecommendation = 35;
                recommendations.notes.push('📉 Mantenimento intensità, riduzione volume');
                break;
                
            case 'realization':
                recommendations.sessionType = 'power_speed';
                recommendations.volumeModifier = 0.6;
                recommendations.intensityModifier = 0.9;
                recommendations.focusAreas = ['power', 'rate_of_force', 'sport_specific'];
                recommendations.avoidAreas = ['hypertrophy', 'metabolic_work'];
                recommendations.timeRecommendation = 45;
                recommendations.priorityOrder = ['power', 'speed', 'reactive'];
                recommendations.notes.push('🎯 Focus su potenza e velocità');
                break;
                
            case 'intensification':
                recommendations.sessionType = 'strength_power';
                recommendations.volumeModifier = 0.7;
                recommendations.intensityModifier = 0.85;
                recommendations.focusAreas = ['max_strength', 'power', 'compound_movements'];
                recommendations.timeRecommendation = 55;
                recommendations.priorityOrder = ['strength', 'power', 'assistance'];
                recommendations.notes.push('🔥 Lavoro di forza ad alta intensità');
                break;
                
            case 'accumulation':
                recommendations.sessionType = 'hypertrophy_strength';
                recommendations.volumeModifier = 0.9;
                recommendations.intensityModifier = 0.75;
                recommendations.focusAreas = ['muscle_building', 'work_capacity', 'weak_points'];
                recommendations.timeRecommendation = 60;
                recommendations.priorityOrder = ['compound', 'isolation', 'conditioning'];
                recommendations.notes.push('📊 Alto volume per adattamenti strutturali');
                break;
                
            default: // normal
                recommendations.sessionType = 'balanced';
                recommendations.volumeModifier = 1.0;
                recommendations.intensityModifier = 1.0;
                recommendations.focusAreas = ['progressive_overload'];
                recommendations.timeRecommendation = 60;
                break;
        }
        
        // Aggiungi note basate sul contesto MD
        if (mdContext.daysToMatch !== null && mdContext.daysToMatch > 0) {
            recommendations.notes.push(`📅 ${mdContext.daysToMatch} giorni alla gara`);
        }
        if (mdContext.daysFromMatch !== null && mdContext.daysFromMatch <= 3) {
            recommendations.notes.push(`⏪ ${mdContext.daysFromMatch} giorni dalla gara`);
        }
        
        return recommendations;
    },
    
    // ===========================================
    // FORMATTAZIONE OUTPUT
    // ===========================================
    
    formatForRationale(mdContext, weekPhase, recommendations) {
        return {
            phase: weekPhase.phase,
            phaseLabel: weekPhase.label,
            mdLabel: mdContext.mdLabel || 'N/A',
            volumeModifier: recommendations.volumeModifier,
            intensityModifier: recommendations.intensityModifier,
            sessionType: recommendations.sessionType,
            focusAreas: recommendations.focusAreas,
            avoidAreas: recommendations.avoidAreas,
            gymAllowed: weekPhase.gymAllowed
        };
    },
    
    formatForPrompt(mdContext, weekPhase, recommendations, nextEvent, lastEvent) {
        const lines = [];
        
        lines.push(`=== CONTESTO SETTIMANALE ===`);
        lines.push(`📅 Fase: ${weekPhase.icon} ${weekPhase.label}`);
        
        if (mdContext.mdLabel) {
            lines.push(`⏱️ MD: ${mdContext.mdLabel}`);
        }
        
        if (nextEvent) {
            lines.push(`🎯 Prossimo evento: ${nextEvent.name || nextEvent.title} (${mdContext.daysToMatch} giorni)`);
        }
        
        if (lastEvent && mdContext.daysFromMatch <= 3) {
            lines.push(`⏪ Ultimo evento: ${lastEvent.name || lastEvent.title} (${mdContext.daysFromMatch} giorni fa)`);
        }
        
        lines.push(`📊 Volume consigliato: ${Math.round(recommendations.volumeModifier * 100)}%`);
        lines.push(`💪 Intensità consigliata: ${Math.round(recommendations.intensityModifier * 100)}%`);
        lines.push(`🏋️ Tipo sessione: ${recommendations.sessionType}`);
        
        if (recommendations.focusAreas.length > 0) {
            lines.push(`✅ Focus: ${recommendations.focusAreas.join(', ')}`);
        }
        
        if (recommendations.avoidAreas.length > 0) {
            lines.push(`❌ Evitare: ${recommendations.avoidAreas.join(', ')}`);
        }
        
        if (recommendations.notes.length > 0) {
            lines.push(`📝 Note: ${recommendations.notes.join(' | ')}`);
        }
        
        return lines.join('\n');
    },
    
    // ===========================================
    // UTILITIES
    // ===========================================
    
    normalizeSport(sport) {
        if (!sport) return 'default';
        
        const sportLower = sport.toLowerCase().trim();
        
        const sportMappings = {
            'calcio': 'calcio',
            'football': 'calcio',
            'soccer': 'calcio',
            'basket': 'basket',
            'basketball': 'basket',
            'pallacanestro': 'basket',
            'pallavolo': 'pallavolo',
            'volleyball': 'pallavolo',
            'volley': 'pallavolo',
            'mma': 'mma',
            'mixed martial arts': 'mma',
            'arti marziali miste': 'mma',
            'boxe': 'boxe',
            'boxing': 'boxe',
            'pugilato': 'boxe',
            'rugby': 'rugby',
            'tennis': 'tennis',
            'nuoto': 'nuoto',
            'swimming': 'nuoto',
            'atletica': 'atletica',
            'track': 'atletica',
            'track and field': 'atletica',
            'crossfit': 'crossfit'
        };
        
        return sportMappings[sportLower] || 'default';
    },
    
    getDayName(date) {
        const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        return days[date.getDay()];
    },
    
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    },
    
    // ===========================================
    // UI HELPER - Badge per calendario
    // ===========================================
    
    getMDBadgeClass(daysToMatch, daysFromMatch) {
        if (daysToMatch === 0) return 'md0';
        if (daysToMatch === 1) return 'md-1';
        if (daysToMatch === 2) return 'md-2';
        if (daysFromMatch === 1) return 'md1';
        if (daysFromMatch === 2) return 'md2';
        return '';
    },
    
    getMDBadgeText(daysToMatch, daysFromMatch) {
        if (daysToMatch === 0) return 'MD';
        if (daysToMatch === 1) return 'MD-1';
        if (daysToMatch === 2) return 'MD-2';
        if (daysToMatch > 2 && daysToMatch <= 5) return `MD-${daysToMatch}`;
        if (daysFromMatch === 1) return 'MD+1';
        if (daysFromMatch === 2) return 'MD+2';
        return '';
    }
};

// Export for browser
if (typeof window !== 'undefined') {
    window.WeekContextEngine = WeekContextEngine;
}

console.log('📅 WeekContextEngine v1.0 caricato');
