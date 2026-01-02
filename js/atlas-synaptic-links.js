/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔗 ATLAS SYNAPTIC LINKS v1.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sistema di connessioni sinaptiche tra le aree del Neural Cortex.
 * Gestisce:
 * - Conflict Resolution: quando due aree sono in disaccordo
 * - Signal Amplification: rinforza decisioni concordanti
 * - Cross-Validation: verifica coerenza tra output
 * - Emergency Circuits: bypassi per situazioni critiche
 * 
 * Autore: GR Perform AI Team
 * Versione: 1.0.0
 */

window.ATLASSynapticLinks = (function() {
    'use strict';

    const VERSION = '1.0.0';
    const DEBUG = true;

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔴 EMERGENCY PROTOCOLS - Circuiti di emergenza
    // ═══════════════════════════════════════════════════════════════════════════

    const EmergencyProtocols = {
        
        /**
         * Trigger di emergenza che bypassano tutto
         */
        triggers: {
            INJURY_ACUTE: {
                condition: (state) => {
                    const injuries = state.constraints?.injuries || [];
                    return injuries.some(i => /acute|grave|recente/i.test(String(i)));
                },
                action: 'STOP',
                output: {
                    action: 'MEDICAL_REFERRAL',
                    intensity: 'none',
                    volume: 'none',
                    message: '⛔ STOP: Infortunio acuto rilevato. Consultare medico prima di allenarsi.',
                    allowedActivities: ['stretching_passive', 'breathing']
                }
            },
            
            ILLNESS_REPORTED: {
                condition: (state) => {
                    const quickCheck = state.recovery?.subjective;
                    return quickCheck && (
                        quickCheck.energy <= 2 ||
                        (quickCheck.soreness >= 9 && quickCheck.energy <= 4)
                    );
                },
                action: 'REST',
                output: {
                    action: 'COMPLETE_REST',
                    intensity: 'none',
                    volume: 'none',
                    message: '🛑 Energia critica. Riposo completo consigliato.',
                    allowedActivities: ['rest', 'light_walk', 'sleep']
                }
            },
            
            SLEEP_CRITICAL: {
                condition: (state) => {
                    const sleep = state.recovery?.subjective?.sleep;
                    return sleep !== undefined && sleep <= 3;
                },
                action: 'MINIMAL',
                output: {
                    action: 'MINIMAL_SESSION',
                    intensity: 'very_low',
                    volume: 'minimal',
                    message: '😴 Sonno critico (<3). Solo mobilità e attivazione leggera.',
                    maxDuration: 30,
                    allowedActivities: ['mobility', 'light_activation', 'stretching']
                }
            },
            
            COMPETITION_TOMORROW: {
                condition: (state) => {
                    return state.calendar?.daysToMatch === 1;
                },
                action: 'ACTIVATION',
                output: {
                    action: 'PRE_COMPETITION_ACTIVATION',
                    intensity: 'low',
                    volume: 'minimal',
                    message: '🏆 Gara domani! Solo attivazione neurale.',
                    maxDuration: 30,
                    allowedActivities: ['neural_activation', 'mobility', 'visualization'],
                    forbidden: ['heavy_lifting', 'high_volume', 'new_exercises', 'DOMS_inducing']
                }
            },
            
            CNS_CRITICAL: {
                condition: (state) => {
                    return state.recovery?.cns !== undefined && state.recovery.cns < 40;
                },
                action: 'RECOVERY',
                output: {
                    action: 'ACTIVE_RECOVERY',
                    intensity: 'very_low',
                    volume: 'minimal',
                    message: '🧠 CNS critico (<40%). Solo recupero attivo.',
                    allowedActivities: ['mobility', 'light_cardio', 'stretching', 'massage']
                }
            },
            
            MENTAL_BURNOUT: {
                condition: (state) => {
                    const motivation = state.recovery?.subjective?.motivation;
                    const patterns = state.patterns;
                    
                    // Motivazione bassa + storico di overtraining
                    return motivation !== undefined && motivation <= 3 && 
                           patterns?.averageRPE > 8;
                },
                action: 'DELOAD_FORCED',
                output: {
                    action: 'FORCED_DELOAD',
                    intensity: 'low',
                    volume: 'reduced',
                    duration: '1 week',
                    message: '🧘 Burnout mentale rilevato. Settimana deload forzata.',
                    volumeReduction: 0.5,
                    intensityReduction: 0.6
                }
            }
        },
        
        /**
         * Verifica tutti i trigger di emergenza
         */
        check(state) {
            for (const [name, protocol] of Object.entries(this.triggers)) {
                if (protocol.condition(state)) {
                    if (DEBUG) {
                        console.log(`🚨 EMERGENCY: ${name} triggered`);
                    }
                    return {
                        triggered: true,
                        protocol: name,
                        ...protocol.output
                    };
                }
            }
            return { triggered: false };
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // ⚔️ CONFLICT RESOLUTION - Risoluzione conflitti tra aree
    // ═══════════════════════════════════════════════════════════════════════════

    const ConflictResolution = {
        
        /**
         * Gerarchia di priorità delle aree
         * In caso di conflitto, l'area con priorità più alta vince
         */
        hierarchy: {
            'Amygdala': 10,          // Sicurezza sempre prima
            'PrefrontalCortex': 9,   // Strategia
            'LimbicSystem': 7,       // Fatica/motivazione
            'Cerebellum': 5,         // Timing
            'MotorCortex': 5,        // Selezione
            'Hippocampus': 4,        // Memoria
            'BasalGanglia': 3        // Abitudini
        },
        
        /**
         * Detecta conflitti tra output delle aree
         */
        detectConflicts(outputs) {
            const conflicts = [];
            
            // Conflitto 1: Motor vuole muscolo che Amygdala ha vetato
            if (outputs.motor?.muscleTargets && outputs.amygdala?.absoluteVetoes) {
                const muscleVetoes = outputs.amygdala.absoluteVetoes
                    .filter(v => v.type === 'muscle_target')
                    .map(v => v.muscle);
                
                const conflictMuscles = outputs.motor.muscleTargets.filter(m => 
                    muscleVetoes.includes(m)
                );
                
                if (conflictMuscles.length > 0) {
                    conflicts.push({
                        type: 'muscle_veto_conflict',
                        areas: ['MotorCortex', 'Amygdala'],
                        description: `Motor vuole ${conflictMuscles.join(', ')} ma Amygdala ha vetato`,
                        resolution: 'amygdala_wins',
                        action: () => {
                            outputs.motor.muscleTargets = outputs.motor.muscleTargets
                                .filter(m => !muscleVetoes.includes(m));
                        }
                    });
                }
            }
            
            // Conflitto 2: Prefrontal dice "heavy" ma Limbic dice "RPE max 6"
            if (outputs.strategic?.intensity === 'high' && outputs.limbic?.sustainableRPE <= 6) {
                conflicts.push({
                    type: 'intensity_fatigue_conflict',
                    areas: ['PrefrontalCortex', 'LimbicSystem'],
                    description: 'Strategia vuole intensità alta ma fatica non lo permette',
                    resolution: 'limbic_modulates',
                    action: () => {
                        outputs.strategic.intensity = 'moderate';
                        outputs.strategic.reasoning.push('Intensità ridotta per fatica (Limbic override)');
                    }
                });
            }
            
            // Conflitto 3: BasalGanglia suggerisce metodo vetato da Amygdala
            if (outputs.methods?.recommendedMethods && outputs.amygdala?.absoluteVetoes) {
                const methodVetoes = outputs.amygdala.absoluteVetoes
                    .filter(v => v.type === 'method')
                    .map(v => v.pattern);
                
                const vetoedMethods = outputs.methods.recommendedMethods.filter(m =>
                    methodVetoes.some(v => m.key?.includes(v))
                );
                
                if (vetoedMethods.length > 0) {
                    conflicts.push({
                        type: 'method_safety_conflict',
                        areas: ['BasalGanglia', 'Amygdala'],
                        description: `Metodi suggeriti ${vetoedMethods.map(m => m.key).join(', ')} vetati per sicurezza`,
                        resolution: 'amygdala_wins',
                        action: () => {
                            outputs.methods.recommendedMethods = outputs.methods.recommendedMethods
                                .filter(m => !methodVetoes.some(v => m.key?.includes(v)));
                        }
                    });
                }
            }
            
            // Conflitto 4: Tempo insufficiente per rest periods richiesti
            if (outputs.timing?.restPeriods && outputs.state?.constraints?.time) {
                const avgRest = this.parseRestAverage(outputs.timing.restPeriods);
                const estimatedDuration = this.estimateDuration(avgRest, outputs.motor?.muscleTargets?.length || 4);
                
                if (estimatedDuration > outputs.state.constraints.time * 1.2) {
                    conflicts.push({
                        type: 'time_rest_conflict',
                        areas: ['Cerebellum', 'Constraints'],
                        description: `Durata stimata ${estimatedDuration}min supera tempo disponibile`,
                        resolution: 'compress_rest',
                        action: () => {
                            outputs.timing.restPeriods = {
                                compound: '60-90s',
                                accessory: '45-60s',
                                isolation: '30-45s'
                            };
                            outputs.timing.reasoning.push('Rest compressi per vincolo tempo');
                        }
                    });
                }
            }
            
            return conflicts;
        },
        
        /**
         * Risolve tutti i conflitti rilevati
         */
        resolveAll(outputs, conflicts) {
            const resolutions = [];
            
            for (const conflict of conflicts) {
                if (conflict.action) {
                    conflict.action();
                    resolutions.push({
                        conflict: conflict.type,
                        resolution: conflict.resolution,
                        description: conflict.description
                    });
                    
                    if (DEBUG) {
                        console.log(`⚔️ Conflict resolved: ${conflict.type} → ${conflict.resolution}`);
                    }
                }
            }
            
            return resolutions;
        },
        
        parseRestAverage(restPeriods) {
            let total = 0;
            let count = 0;
            
            for (const [type, rest] of Object.entries(restPeriods)) {
                const match = String(rest).match(/(\d+)/);
                if (match) {
                    total += parseInt(match[1]);
                    count++;
                }
            }
            
            return count > 0 ? total / count : 90;
        },
        
        estimateDuration(avgRest, exerciseCount) {
            const setsPerExercise = 3;
            const timePerSet = 40; // secondi
            const exercises = exerciseCount || 6;
            
            const workTime = exercises * setsPerExercise * timePerSet;
            const restTime = exercises * setsPerExercise * avgRest;
            
            return Math.round((workTime + restTime) / 60);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 📡 SIGNAL AMPLIFICATION - Rinforzo segnali concordanti
    // ═══════════════════════════════════════════════════════════════════════════

    const SignalAmplification = {
        
        /**
         * Analizza concordanza tra aree e amplifica segnali forti
         */
        process(outputs) {
            const amplifications = [];
            
            // Concordanza 1: Tutte le aree concordano su "light"
            const lightSignals = [];
            if (outputs.strategic?.intensity === 'light') lightSignals.push('Prefrontal');
            if (outputs.limbic?.sustainableRPE <= 6) lightSignals.push('Limbic');
            if (outputs.amygdala?.overallRisk > 0.5) lightSignals.push('Amygdala');
            
            if (lightSignals.length >= 2) {
                amplifications.push({
                    type: 'light_intensity_consensus',
                    strength: lightSignals.length / 3,
                    sources: lightSignals,
                    action: 'CONFIRMED_LIGHT',
                    message: `${lightSignals.length} aree concordano: sessione leggera`
                });
            }
            
            // Concordanza 2: Via libera per heavy
            const heavySignals = [];
            if (outputs.strategic?.intensity === 'high') heavySignals.push('Prefrontal');
            if (outputs.limbic?.sustainableRPE >= 8) heavySignals.push('Limbic');
            if (outputs.amygdala?.greenLights?.includes('heavy_compound')) heavySignals.push('Amygdala');
            if (outputs.state?.recovery?.cns > 80) heavySignals.push('CNS');
            
            if (heavySignals.length >= 3) {
                amplifications.push({
                    type: 'heavy_intensity_consensus',
                    strength: heavySignals.length / 4,
                    sources: heavySignals,
                    action: 'CONFIRMED_HEAVY',
                    message: `Via libera totale: ${heavySignals.length} segnali positivi per heavy`
                });
            }
            
            // Concordanza 3: Deload necessario
            const deloadSignals = [];
            if (outputs.strategic?.action === 'DELOAD') deloadSignals.push('Prefrontal');
            if (outputs.state?.fatigue?.trend === 'increasing') deloadSignals.push('Fatigue');
            if (outputs.memory?.suggestions?.some(s => /deload|recovery/i.test(s))) deloadSignals.push('Memory');
            
            if (deloadSignals.length >= 2) {
                amplifications.push({
                    type: 'deload_consensus',
                    strength: 1.0,
                    sources: deloadSignals,
                    action: 'FORCE_DELOAD',
                    message: 'Segnale forte: deload raccomandato da multiple fonti'
                });
            }
            
            return amplifications;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // ✅ CROSS VALIDATION - Verifica coerenza finale
    // ═══════════════════════════════════════════════════════════════════════════

    const CrossValidation = {
        
        /**
         * Verifica coerenza dell'output finale
         */
        validate(decision) {
            const issues = [];
            const warnings = [];
            
            // Check 1: Intensità coerente con RPE
            if (decision.intensity === 'high' && decision.parameters?.targetRPE < 7) {
                issues.push({
                    type: 'intensity_rpe_mismatch',
                    message: 'Intensità alta ma RPE target basso',
                    fix: () => { decision.intensity = 'moderate'; }
                });
            }
            
            // Check 2: Volume coerente con tempo
            if (decision.volume === 'high' && decision.rawOutputs?.state?.constraints?.time < 50) {
                issues.push({
                    type: 'volume_time_mismatch',
                    message: 'Volume alto ma tempo limitato',
                    fix: () => { decision.volume = 'moderate'; }
                });
            }
            
            // Check 3: Muscoli target non vuoti
            if (!decision.targets?.muscles || decision.targets.muscles.length === 0) {
                warnings.push({
                    type: 'no_muscle_targets',
                    message: 'Nessun muscolo target specificato'
                });
            }
            
            // Check 4: Reasoning non vuoto
            if (!decision.reasoning || decision.reasoning.length === 0) {
                warnings.push({
                    type: 'no_reasoning',
                    message: 'Nessun reasoning fornito'
                });
            }
            
            // Check 5: Rischio alto ma non action di recovery
            if (decision.risk?.level > 0.6 && !['REST_DAY', 'RECOVERY_FOCUS', 'MINIMAL_SESSION'].includes(decision.action)) {
                issues.push({
                    type: 'risk_action_mismatch',
                    message: 'Rischio alto ma action non è recovery-focused',
                    fix: () => { 
                        decision.action = 'RECOVERY_FOCUS';
                        decision.intensity = 'light';
                    }
                });
            }
            
            // Applica fix
            for (const issue of issues) {
                if (issue.fix) {
                    issue.fix();
                    if (DEBUG) console.log(`✅ CrossValidation fix: ${issue.type}`);
                }
            }
            
            return {
                valid: issues.length === 0,
                issues,
                warnings,
                fixesApplied: issues.length
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 CONFIDENCE CALIBRATION - Calibrazione confidenza
    // ═══════════════════════════════════════════════════════════════════════════

    const ConfidenceCalibration = {
        
        /**
         * Calcola e calibra la confidenza finale
         */
        calculate(state, outputs, conflicts, amplifications) {
            let confidence = 0.5; // Base
            
            // +0.2 per dati completi
            if (state.confidence > 0.7) confidence += 0.2;
            
            // +0.15 per consenso tra aree
            if (amplifications.length > 0) {
                confidence += amplifications.reduce((sum, a) => sum + a.strength * 0.05, 0);
            }
            
            // -0.1 per ogni conflitto non risolto
            // (i conflitti risolti non penalizzano)
            
            // -0.15 per rischio alto
            if (outputs.amygdala?.overallRisk > 0.5) {
                confidence -= 0.15;
            }
            
            // +0.1 per pattern storici disponibili
            if (outputs.memory?.successfulPatterns?.length > 0) {
                confidence += 0.1;
            }
            
            // Categorizza
            const categories = {
                veryHigh: { min: 0.85, label: 'Molto Alta', emoji: '🟢' },
                high: { min: 0.7, label: 'Alta', emoji: '🟢' },
                moderate: { min: 0.55, label: 'Moderata', emoji: '🟡' },
                low: { min: 0.4, label: 'Bassa', emoji: '🟠' },
                veryLow: { min: 0, label: 'Molto Bassa', emoji: '🔴' }
            };
            
            let category = 'veryLow';
            for (const [name, config] of Object.entries(categories)) {
                if (confidence >= config.min) {
                    category = name;
                    break;
                }
            }
            
            return {
                value: Math.max(0.3, Math.min(1.0, confidence)),
                category,
                ...categories[category],
                recommendation: this.getRecommendation(confidence)
            };
        },
        
        getRecommendation(confidence) {
            if (confidence >= 0.85) return 'Procedi senza esitazione';
            if (confidence >= 0.7) return 'Procedi con monitoraggio standard';
            if (confidence >= 0.55) return 'Procedi ma monitora RPE attentamente';
            if (confidence >= 0.4) return 'Considera alternativa più sicura';
            return 'Raccogli più dati prima di decidere';
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔌 API PUBBLICA
    // ═══════════════════════════════════════════════════════════════════════════

    return {
        VERSION,
        
        EmergencyProtocols,
        ConflictResolution,
        SignalAmplification,
        CrossValidation,
        ConfidenceCalibration,
        
        /**
         * Processa tutti i link sinaptici
         * @param {Object} state - Stato dall'input sensoriale
         * @param {Object} outputs - Output da tutte le aree cerebrali
         * @returns {Object} Output processato con conflitti risolti
         */
        process(state, outputs) {
            console.log('🔗 Synaptic Links processing...');
            const startTime = Date.now();
            
            // 1. Check emergenze (bypass tutto se attivato)
            const emergency = EmergencyProtocols.check(state);
            if (emergency.triggered) {
                console.log(`🚨 Emergency protocol: ${emergency.protocol}`);
                return {
                    emergency: true,
                    ...emergency,
                    confidence: { value: 1.0, category: 'emergency' }
                };
            }
            
            // 2. Detecta conflitti
            const conflicts = ConflictResolution.detectConflicts({ ...outputs, state });
            
            // 3. Risolvi conflitti
            const resolutions = ConflictResolution.resolveAll(outputs, conflicts);
            
            // 4. Amplifica segnali concordanti
            const amplifications = SignalAmplification.process(outputs);
            
            // 5. Calcola confidenza calibrata
            const confidence = ConfidenceCalibration.calculate(state, outputs, conflicts, amplifications);
            
            const result = {
                emergency: false,
                processingTime: Date.now() - startTime,
                conflicts: {
                    detected: conflicts.length,
                    resolved: resolutions.length,
                    details: resolutions
                },
                amplifications,
                confidence,
                modifiedOutputs: outputs
            };
            
            console.log(`🔗 Synaptic processing complete in ${result.processingTime}ms`);
            console.log(`   Conflicts: ${conflicts.length} detected, ${resolutions.length} resolved`);
            console.log(`   Confidence: ${confidence.emoji} ${Math.round(confidence.value * 100)}% (${confidence.label})`);
            
            return result;
        },
        
        /**
         * Validazione finale di una decisione
         */
        validateDecision(decision) {
            return CrossValidation.validate(decision);
        }
    };

})();

console.log('🔗 ATLAS Synaptic Links v1.0 loaded!');
console.log('   → ATLASSynapticLinks.process(state, outputs) - Full synaptic processing');
console.log('   → ATLASSynapticLinks.EmergencyProtocols.check(state) - Check emergencies');
