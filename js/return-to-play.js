/**
 * RETURN-TO-PLAY PROTOCOL - GR Perform
 * 
 * Gestione del ritorno graduale all'attività dopo un infortunio.
 * Basato su protocolli evidence-based per sport da combattimento e non.
 * 
 * Fasi del protocollo:
 * 1. Rest (0-7 giorni) - Riposo completo, solo mobilità passiva
 * 2. Light Activity (7-14 giorni) - Attività leggera, no impatto
 * 3. Sport-Specific (14-21 giorni) - Movimenti specifici a bassa intensità
 * 4. Full Training (21-28 giorni) - Ritorno graduale completo
 * 5. Competition Ready (28+ giorni) - Pronto per competizione
 * 
 * @version 1.0.0
 * @date 2024-12-19
 */

window.ReturnToPlay = (function() {
    'use strict';

    // ============================================
    // CONFIGURAZIONE PROTOCOLLI
    // ============================================
    
    const INJURY_PROTOCOLS = {
        // Infortuni muscolari
        muscle_strain: {
            name: 'Stiramento Muscolare',
            grades: {
                mild: { restDays: 7, phases: [7, 7, 7, 7] },      // Grade 1
                moderate: { restDays: 14, phases: [14, 14, 14, 14] }, // Grade 2
                severe: { restDays: 28, phases: [28, 21, 21, 14] }    // Grade 3
            },
            restrictions: {
                rest: ['Nessun esercizio', 'Solo mobilità passiva', 'Ghiaccio e compressione'],
                light: ['Cardio a basso impatto (bike, nuoto)', 'Stretching leggero', 'Esercizi isometrici'],
                sport_specific: ['Movimenti sport-specifici al 50%', 'No contatto', 'Shadowboxing leggero'],
                full: ['Allenamento normale al 75%', 'Contatto controllato', 'Sparring leggero'],
                competition: ['100% capacità', 'Match/competizione OK']
            },
            avoidUntilPhase: {
                'plyometrics': 'sport_specific',
                'heavy_lifting': 'full',
                'contact': 'full',
                'competition': 'competition'
            }
        },
        
        // Infortuni articolari (caviglia, ginocchio, spalla)
        joint_sprain: {
            name: 'Distorsione Articolare',
            grades: {
                mild: { restDays: 5, phases: [5, 7, 7, 7] },
                moderate: { restDays: 14, phases: [14, 14, 14, 14] },
                severe: { restDays: 21, phases: [21, 21, 21, 21] }
            },
            restrictions: {
                rest: ['Immobilizzazione', 'RICE protocol', 'Nessun carico'],
                light: ['Mobilità attiva', 'Esercizi in scarico', 'Propriocezione base'],
                sport_specific: ['Movimenti controllati', 'Propriocezione avanzata', 'Rinforzo specifico'],
                full: ['Allenamento completo', 'Agilità e cambi direzione', 'Sparring'],
                competition: ['Pronto per competizione']
            },
            avoidUntilPhase: {
                'jumping': 'sport_specific',
                'pivoting': 'full',
                'contact': 'full'
            }
        },
        
        // Contusioni
        contusion: {
            name: 'Contusione',
            grades: {
                mild: { restDays: 3, phases: [3, 4, 5, 3] },
                moderate: { restDays: 7, phases: [7, 7, 7, 7] },
                severe: { restDays: 14, phases: [14, 10, 7, 7] }
            },
            restrictions: {
                rest: ['Protezione area', 'Ghiaccio', 'Evitare pressione'],
                light: ['Attività che non coinvolge l\'area', 'Mobilità generale'],
                sport_specific: ['Ripresa graduale', 'Protezione se necessario'],
                full: ['Allenamento normale'],
                competition: ['OK competizione']
            }
        },
        
        // Concussione (importante per sport da combattimento)
        concussion: {
            name: 'Commozione Cerebrale',
            grades: {
                mild: { restDays: 7, phases: [7, 7, 7, 14] },
                moderate: { restDays: 14, phases: [14, 14, 14, 21] },
                severe: { restDays: 30, phases: [30, 21, 21, 28] }
            },
            restrictions: {
                rest: ['Riposo cognitivo totale', 'No schermi', 'Buio e silenzio', 'Valutazione medica OBBLIGATORIA'],
                light: ['Camminate leggere', 'No attività che aumenta FC', 'Monitoraggio sintomi'],
                sport_specific: ['Esercizi specifici senza contatto testa', 'No sparring', 'No pad work pesante'],
                full: ['Allenamento con protezioni', 'Sparring MOLTO leggero', 'Valutazione medica'],
                competition: ['SOLO con clearance medica scritta', 'Valutazione neurologica']
            },
            avoidUntilPhase: {
                'any_contact': 'full',
                'sparring': 'competition',
                'competition': 'competition'
            },
            requiresMedicalClearance: true
        },
        
        // Fratture da stress
        stress_fracture: {
            name: 'Frattura da Stress',
            grades: {
                mild: { restDays: 28, phases: [28, 21, 21, 14] },
                moderate: { restDays: 42, phases: [42, 28, 21, 21] },
                severe: { restDays: 56, phases: [56, 42, 28, 28] }
            },
            restrictions: {
                rest: ['Nessun carico', 'Tutore/gesso se indicato', 'Solo upper body (se arto inferiore)'],
                light: ['Carico parziale', 'Esercizi in acqua', 'Bike senza resistenza'],
                sport_specific: ['Carico progressivo', 'Corsa su superfici morbide', 'No salti'],
                full: ['Allenamento normale', 'Monitoraggio dolore'],
                competition: ['OK con clearance medica']
            },
            requiresMedicalClearance: true
        },
        
        // Tendinopatie
        tendinopathy: {
            name: 'Tendinopatia',
            grades: {
                mild: { restDays: 7, phases: [7, 14, 14, 14] },
                moderate: { restDays: 14, phases: [14, 21, 21, 14] },
                severe: { restDays: 21, phases: [21, 28, 28, 21] }
            },
            restrictions: {
                rest: ['Scarico tendine', 'Isometrici leggeri', 'No movimenti esplosivi'],
                light: ['Eccentrico progressivo', 'Carico controllato', 'No rimbalzi'],
                sport_specific: ['Movimenti specifici lenti', 'Carico incrementale', 'Attenzione dolore'],
                full: ['Allenamento normale', 'Gestione carico'],
                competition: ['OK con gestione carico']
            }
        }
    };

    // Fasi del protocollo
    const PHASES = ['rest', 'light', 'sport_specific', 'full', 'competition'];
    
    const PHASE_NAMES = {
        rest: 'Riposo',
        light: 'Attività Leggera',
        sport_specific: 'Sport-Specifico',
        full: 'Allenamento Completo',
        competition: 'Pronto Competizione'
    };

    const PHASE_COLORS = {
        rest: '#E63946',
        light: '#FF9800',
        sport_specific: '#2196F3',
        full: '#00D26A',
        competition: '#9C27B0'
    };

    // ============================================
    // STORAGE
    // ============================================
    
    const STORAGE_KEY = 'grperform_injuries';
    
    function loadInjuries() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.warn('Errore caricamento infortuni:', e);
            return {};
        }
    }
    
    function saveInjuries(injuries) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(injuries));
        } catch (e) {
            console.warn('Errore salvataggio infortuni:', e);
        }
    }

    // ============================================
    // LOGICA PROTOCOLLO
    // ============================================
    
    /**
     * Registra un nuovo infortunio
     */
    function registerInjury(athleteId, injuryData) {
        const { type, grade, bodyPart, date, notes } = injuryData;
        
        const protocol = INJURY_PROTOCOLS[type];
        if (!protocol) {
            return { success: false, error: `Tipo infortunio non riconosciuto: ${type}` };
        }
        
        const gradeConfig = protocol.grades[grade || 'mild'];
        if (!gradeConfig) {
            return { success: false, error: `Gravità non valida: ${grade}` };
        }
        
        const injuryDate = new Date(date || new Date());
        
        // Calcola le date delle fasi
        const phases = [];
        let currentDate = new Date(injuryDate);
        
        PHASES.forEach((phaseName, index) => {
            const daysInPhase = gradeConfig.phases[index] || 7;
            const startDate = new Date(currentDate);
            const endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + daysInPhase - 1);
            
            phases.push({
                name: phaseName,
                displayName: PHASE_NAMES[phaseName],
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                days: daysInPhase,
                restrictions: protocol.restrictions[phaseName] || [],
                color: PHASE_COLORS[phaseName]
            });
            
            currentDate = new Date(endDate);
            currentDate.setDate(currentDate.getDate() + 1);
        });
        
        const injury = {
            id: `injury_${Date.now()}`,
            athleteId: athleteId,
            type: type,
            typeName: protocol.name,
            grade: grade || 'mild',
            bodyPart: bodyPart || 'non specificato',
            injuryDate: injuryDate.toISOString().split('T')[0],
            registeredAt: new Date().toISOString(),
            phases: phases,
            notes: notes || '',
            requiresMedicalClearance: protocol.requiresMedicalClearance || false,
            medicalClearance: null,
            status: 'active',
            avoidUntilPhase: protocol.avoidUntilPhase || {}
        };
        
        // Salva
        const all = loadInjuries();
        if (!all[athleteId]) all[athleteId] = [];
        all[athleteId].push(injury);
        saveInjuries(all);
        
        console.log('🏥 Infortunio registrato:', injury);
        return { success: true, injury };
    }

    /**
     * Ottieni la fase corrente per un infortunio
     */
    function getCurrentPhase(injury, date = new Date()) {
        const checkDate = new Date(date);
        
        for (const phase of injury.phases) {
            const start = new Date(phase.startDate);
            const end = new Date(phase.endDate);
            
            if (checkDate >= start && checkDate <= end) {
                const daysInPhase = Math.floor((checkDate - start) / (24 * 60 * 60 * 1000)) + 1;
                const totalDays = phase.days;
                const progressPct = (daysInPhase / totalDays) * 100;
                
                return {
                    ...phase,
                    currentDay: daysInPhase,
                    progress: Math.round(progressPct),
                    phaseIndex: injury.phases.indexOf(phase)
                };
            }
        }
        
        // Se siamo oltre tutte le fasi, siamo in "competition ready"
        const lastPhase = injury.phases[injury.phases.length - 1];
        if (new Date(date) > new Date(lastPhase.endDate)) {
            return {
                name: 'cleared',
                displayName: 'Recupero Completato',
                progress: 100,
                phaseIndex: injury.phases.length,
                color: '#00D26A'
            };
        }
        
        return null;
    }

    /**
     * Ottieni tutti gli infortuni attivi per un atleta
     */
    function getActiveInjuries(athleteId, date = new Date()) {
        const all = loadInjuries();
        const athleteInjuries = all[athleteId] || [];
        
        return athleteInjuries.filter(injury => {
            if (injury.status === 'resolved') return false;
            
            const lastPhase = injury.phases[injury.phases.length - 1];
            const endDate = new Date(lastPhase.endDate);
            
            // Ancora attivo se non abbiamo superato l'ultima fase
            return new Date(date) <= endDate;
        });
    }

    /**
     * Genera restrizioni per la generazione workout
     */
    function getWorkoutRestrictions(athleteId, date = new Date()) {
        const activeInjuries = getActiveInjuries(athleteId, date);
        
        if (activeInjuries.length === 0) {
            return { hasRestrictions: false, restrictions: [], injuries: [] };
        }
        
        const restrictions = [];
        const injuryContexts = [];
        
        activeInjuries.forEach(injury => {
            const currentPhase = getCurrentPhase(injury, date);
            if (!currentPhase) return;
            
            injuryContexts.push({
                type: injury.typeName,
                bodyPart: injury.bodyPart,
                phase: currentPhase.displayName,
                progress: currentPhase.progress,
                restrictions: currentPhase.restrictions || []
            });
            
            // Aggiungi restrizioni della fase
            if (currentPhase.restrictions) {
                restrictions.push(...currentPhase.restrictions);
            }
            
            // Aggiungi restrizioni per tipo di attività
            if (injury.avoidUntilPhase) {
                Object.entries(injury.avoidUntilPhase).forEach(([activity, minPhase]) => {
                    const phaseIndex = PHASES.indexOf(minPhase);
                    if (currentPhase.phaseIndex < phaseIndex) {
                        restrictions.push(`EVITA: ${activity} (consentito da fase "${PHASE_NAMES[minPhase]}")`);
                    }
                });
            }
            
            // Warning per clearance medica
            if (injury.requiresMedicalClearance && !injury.medicalClearance) {
                restrictions.push('⚠️ RICHIESTA CLEARANCE MEDICA prima di tornare a piena attività');
            }
        });
        
        return {
            hasRestrictions: restrictions.length > 0,
            restrictions: [...new Set(restrictions)], // Rimuovi duplicati
            injuries: injuryContexts
        };
    }

    /**
     * Genera testo per il prompt AI
     */
    function generatePromptContext(athleteId, date = new Date()) {
        const { hasRestrictions, restrictions, injuries } = getWorkoutRestrictions(athleteId, date);
        
        if (!hasRestrictions) return '';
        
        let text = '\n\n🏥 RETURN-TO-PLAY ATTIVO:';
        
        injuries.forEach(inj => {
            text += `\n   • ${inj.type} (${inj.bodyPart}) - Fase: ${inj.phase} (${inj.progress}%)`;
        });
        
        text += '\n\n   RESTRIZIONI OBBLIGATORIE:';
        restrictions.forEach(r => {
            text += `\n   - ${r}`;
        });
        
        text += '\n\n   ⚠️ ADATTA IL WORKOUT: riduci volume/intensità, evita esercizi controindicati.';
        
        return text;
    }

    /**
     * Marca un infortunio come risolto
     */
    function resolveInjury(athleteId, injuryId) {
        const all = loadInjuries();
        if (all[athleteId]) {
            const injury = all[athleteId].find(i => i.id === injuryId);
            if (injury) {
                injury.status = 'resolved';
                injury.resolvedAt = new Date().toISOString();
                saveInjuries(all);
                return { success: true };
            }
        }
        return { success: false, error: 'Infortunio non trovato' };
    }

    /**
     * Aggiungi clearance medica
     */
    function addMedicalClearance(athleteId, injuryId, clearanceData) {
        const all = loadInjuries();
        if (all[athleteId]) {
            const injury = all[athleteId].find(i => i.id === injuryId);
            if (injury) {
                injury.medicalClearance = {
                    date: new Date().toISOString(),
                    doctor: clearanceData.doctor || 'Non specificato',
                    notes: clearanceData.notes || ''
                };
                saveInjuries(all);
                return { success: true };
            }
        }
        return { success: false, error: 'Infortunio non trovato' };
    }

    // ============================================
    // API PUBBLICA
    // ============================================
    
    return {
        register: registerInjury,
        getCurrentPhase: getCurrentPhase,
        getActive: getActiveInjuries,
        getRestrictions: getWorkoutRestrictions,
        generatePromptContext: generatePromptContext,
        resolve: resolveInjury,
        addClearance: addMedicalClearance,
        
        getAll: function(athleteId) {
            const all = loadInjuries();
            return all[athleteId] || [];
        },
        
        delete: function(athleteId, injuryId) {
            const all = loadInjuries();
            if (all[athleteId]) {
                all[athleteId] = all[athleteId].filter(i => i.id !== injuryId);
                saveInjuries(all);
            }
        },
        
        getProtocols: function() {
            return { ...INJURY_PROTOCOLS };
        },
        
        getPhaseNames: function() {
            return { ...PHASE_NAMES };
        },
        
        getPhaseColors: function() {
            return { ...PHASE_COLORS };
        }
    };
})();

console.log('🏥 ReturnToPlay protocol caricato');
