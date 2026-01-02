/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧠 ATLAS BRAIN - Orchestratore Cerebrale Unificato
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Questo modulo unifica Neural Cortex, Synaptic Links e Predictive Engine
 * in un'unica API semplice da usare.
 * 
 * È il "cervello completo" di ATLAS che:
 * 1. Raccoglie tutti i dati (SensoryInput)
 * 2. Processa attraverso tutte le aree cerebrali
 * 3. Risolve conflitti e amplifica segnali (SynapticLinks)
 * 4. Predice conseguenze (PredictiveEngine)
 * 5. Produce decisione finale con reasoning completo
 * 
 * Autore: GR Perform AI Team
 * Versione: 1.0.0
 */

window.ATLASBrain = (function() {
    'use strict';

    const VERSION = '1.0.0';

    /**
     * THINK - Il metodo principale che fa "pensare" ATLAS
     * 
     * @param {Object} profile - Profilo atleta completo
     * @param {Object} options - Opzioni aggiuntive
     * @param {Array} options.history - Storico workout
     * @param {string} options.targetDay - Giorno target
     * @param {string} options.phase - Fase periodizzazione
     * @returns {Object} Decisione completa con tutto il reasoning
     */
    function think(profile, options = {}) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🧠 ATLAS BRAIN v' + VERSION + ' - Thinking...');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const startTime = Date.now();
        
        // Verifica dipendenze
        if (!window.ATLASNeuralCortex) {
            console.error('❌ ATLASNeuralCortex not loaded!');
            return { error: 'Neural Cortex not available' };
        }
        
        // ═══════════════════════════════════════════════════════════════
        // FASE 1: SENSORY INPUT - Raccolta dati
        // ═══════════════════════════════════════════════════════════════
        console.log('\n📥 Phase 1: Sensory Input...');
        const state = ATLASNeuralCortex.areas.SensoryInput.gatherState(profile, options);
        
        // ═══════════════════════════════════════════════════════════════
        // FASE 2: CHECK EMERGENZE
        // ═══════════════════════════════════════════════════════════════
        if (window.ATLASSynapticLinks) {
            console.log('\n🚨 Phase 2: Emergency Check...');
            const emergency = ATLASSynapticLinks.EmergencyProtocols.check(state);
            
            if (emergency.triggered) {
                console.log(`⛔ EMERGENCY PROTOCOL: ${emergency.protocol}`);
                return {
                    success: true,
                    emergency: true,
                    protocol: emergency.protocol,
                    decision: {
                        action: emergency.action,
                        intensity: emergency.intensity || 'none',
                        volume: emergency.volume || 'none',
                        message: emergency.message,
                        allowedActivities: emergency.allowedActivities || []
                    },
                    reasoning: [emergency.message],
                    processingTime: Date.now() - startTime
                };
            }
        }
        
        // ═══════════════════════════════════════════════════════════════
        // FASE 3: PROCESSING - Tutte le aree cerebrali
        // ═══════════════════════════════════════════════════════════════
        console.log('\n🧠 Phase 3: Neural Processing...');
        
        const outputs = {};
        
        // Prefrontal (strategia)
        outputs.strategic = ATLASNeuralCortex.areas.PrefrontalCortex.process(state);
        console.log('   ✓ PrefrontalCortex:', outputs.strategic.action);
        
        // Motor (esercizi)
        outputs.motor = ATLASNeuralCortex.areas.MotorCortex.process(state, outputs.strategic);
        console.log('   ✓ MotorCortex:', outputs.motor.muscleTargets?.join(', '));
        
        // Limbic (fatica)
        outputs.limbic = ATLASNeuralCortex.areas.LimbicSystem.process(state, outputs.strategic);
        console.log('   ✓ LimbicSystem: RPE', outputs.limbic.sustainableRPE);
        
        // Cerebellum (timing)
        outputs.timing = ATLASNeuralCortex.areas.Cerebellum.process(state, outputs.strategic, outputs.motor);
        console.log('   ✓ Cerebellum:', outputs.timing.sessionPacing);
        
        // Hippocampus (memoria)
        outputs.memory = ATLASNeuralCortex.areas.Hippocampus.process(state);
        console.log('   ✓ Hippocampus: patterns loaded');
        
        // Amygdala (rischio)
        outputs.amygdala = ATLASNeuralCortex.areas.Amygdala.process(state, { motor: outputs.motor, limbic: outputs.limbic });
        console.log('   ✓ Amygdala: risk', Math.round(outputs.amygdala.overallRisk * 100) + '%');
        
        // Basal Ganglia (metodi)
        outputs.methods = ATLASNeuralCortex.areas.BasalGanglia.process(state, { limbic: outputs.limbic, amygdala: outputs.amygdala });
        console.log('   ✓ BasalGanglia:', outputs.methods.recommendedMethods?.length, 'methods');
        
        // ═══════════════════════════════════════════════════════════════
        // FASE 4: SYNAPTIC PROCESSING - Conflitti e amplificazione
        // ═══════════════════════════════════════════════════════════════
        let synapticResult = { conflicts: { detected: 0 }, amplifications: [], confidence: { value: 0.7 } };
        
        if (window.ATLASSynapticLinks) {
            console.log('\n🔗 Phase 4: Synaptic Processing...');
            synapticResult = ATLASSynapticLinks.process(state, outputs);
            console.log('   Conflicts resolved:', synapticResult.conflicts.resolved);
            console.log('   Amplifications:', synapticResult.amplifications.length);
        }
        
        // ═══════════════════════════════════════════════════════════════
        // FASE 5: COMPILA DECISIONE FINALE
        // ═══════════════════════════════════════════════════════════════
        console.log('\n📋 Phase 5: Compiling Decision...');
        
        const decision = {
            action: outputs.strategic.action,
            intensity: outputs.strategic.intensity,
            volume: outputs.strategic.volume,
            
            parameters: {
                targetRPE: outputs.limbic.sustainableRPE,
                restPeriods: outputs.timing.restPeriods,
                tempo: outputs.timing.tempoRecommendations,
                pacing: outputs.timing.sessionPacing,
                methods: outputs.methods.recommendedMethods?.slice(0, 2) || []
            },
            
            targets: {
                muscles: outputs.motor.muscleTargets || [],
                avoidMuscles: outputs.motor.avoidMuscles?.map(m => m.muscle) || [],
                categories: outputs.motor.exerciseCategories || []
            },
            
            risk: {
                level: outputs.amygdala.overallRisk,
                vetoes: outputs.amygdala.absoluteVetoes || [],
                greenLights: outputs.amygdala.greenLights || [],
                warnings: outputs.amygdala.warnings || []
            },
            
            sportRoutine: outputs.methods.routinePatterns || {}
        };
        
        // ═══════════════════════════════════════════════════════════════
        // FASE 6: PREDIZIONE (opzionale)
        // ═══════════════════════════════════════════════════════════════
        let prediction = null;
        let recommendations = [];
        
        if (window.ATLASPredictiveEngine) {
            console.log('\n🔮 Phase 6: Prediction...');
            const predResult = ATLASPredictiveEngine.predict(state, decision);
            prediction = predResult.prediction;
            recommendations = predResult.recommendations;
            console.log('   CNS after:', prediction.immediate.cns + '%');
            console.log('   DOMS expected:', prediction.domsProfile.severity);
            console.log('   Recommendations:', recommendations.length);
        }
        
        // ═══════════════════════════════════════════════════════════════
        // FASE 7: CROSS VALIDATION
        // ═══════════════════════════════════════════════════════════════
        let validation = { valid: true, issues: [], warnings: [] };
        
        if (window.ATLASSynapticLinks) {
            console.log('\n✅ Phase 7: Cross Validation...');
            validation = ATLASSynapticLinks.validateDecision({
                ...decision,
                rawOutputs: { state }
            });
            console.log('   Valid:', validation.valid);
            console.log('   Fixes applied:', validation.fixesApplied);
        }
        
        // ═══════════════════════════════════════════════════════════════
        // RISULTATO FINALE
        // ═══════════════════════════════════════════════════════════════
        const processingTime = Date.now() - startTime;
        
        // Compila reasoning
        const reasoning = [
            ...outputs.strategic.reasoning || [],
            ...outputs.motor.reasoning || [],
            ...outputs.limbic.reasoning || [],
            ...outputs.timing.reasoning || [],
            ...outputs.memory.reasoning || [],
            ...(outputs.amygdala.reasoning || [])
        ];
        
        const result = {
            success: true,
            emergency: false,
            
            decision,
            
            confidence: synapticResult.confidence,
            
            reasoning,
            
            prediction: prediction ? {
                cnsAfter: prediction.immediate.cns,
                readinessTomorrow: prediction.readinessProjection.tomorrow.readiness,
                domsExpected: prediction.domsProfile.severity,
                muscleRecovery: prediction.muscleRecovery
            } : null,
            
            recommendations,
            
            validation,
            
            meta: {
                processingTime,
                conflictsResolved: synapticResult.conflicts?.resolved || 0,
                amplifications: synapticResult.amplifications?.length || 0,
                dataConfidence: state.confidence
            },
            
            // Debug (può essere rimosso in produzione)
            _debug: {
                state,
                outputs,
                synapticResult
            }
        };
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🧠 ATLAS BRAIN completed in ${processingTime}ms`);
        console.log(`   Action: ${decision.action}`);
        console.log(`   Intensity: ${decision.intensity}`);
        console.log(`   Confidence: ${Math.round(synapticResult.confidence.value * 100)}%`);
        console.log(`   Risk: ${Math.round(decision.risk.level * 100)}%`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        return result;
    }

    /**
     * QUICK THINK - Versione veloce senza predizione
     */
    function quickThink(profile, options = {}) {
        // Disabilita temporaneamente predictive
        const savedPredictive = window.ATLASPredictiveEngine;
        window.ATLASPredictiveEngine = null;
        
        const result = think(profile, options);
        
        window.ATLASPredictiveEngine = savedPredictive;
        
        return result;
    }

    /**
     * GENERATE WORKOUT PROMPT - Genera prompt per AI con tutte le direttive
     */
    function generateWorkoutPrompt(brainResult) {
        if (!brainResult.success || brainResult.emergency) {
            return brainResult.decision?.message || 'Impossibile generare workout';
        }
        
        const d = brainResult.decision;
        let prompt = '';
        
        prompt += `\n═══════════════════════════════════════════════════════════════`;
        prompt += `\n🧠 DIRETTIVE ATLAS BRAIN (OBBLIGATORIE)`;
        prompt += `\n═══════════════════════════════════════════════════════════════`;
        
        prompt += `\n\n📋 AZIONE: ${d.action}`;
        prompt += `\n   Intensità: ${d.intensity.toUpperCase()}`;
        prompt += `\n   Volume: ${d.volume}`;
        prompt += `\n   RPE Target: ${d.parameters.targetRPE}/10`;
        prompt += `\n   Pacing: ${d.parameters.pacing}`;
        
        prompt += `\n\n🎯 MUSCOLI TARGET: ${d.targets.muscles.join(', ')}`;
        
        if (d.targets.avoidMuscles.length > 0) {
            prompt += `\n⛔ MUSCOLI DA EVITARE: ${d.targets.avoidMuscles.join(', ')}`;
        }
        
        prompt += `\n\n⏱️ REST PERIODS:`;
        for (const [type, rest] of Object.entries(d.parameters.restPeriods)) {
            prompt += `\n   - ${type}: ${rest}`;
        }
        
        if (d.parameters.methods.length > 0) {
            prompt += `\n\n💪 METODOLOGIE OBBLIGATORIE:`;
            d.parameters.methods.forEach((m, i) => {
                prompt += `\n   ${i + 1}. ${m.method?.name || m.key || 'Method'}`;
            });
        }
        
        if (d.risk.vetoes.length > 0) {
            prompt += `\n\n🚫 VETI ASSOLUTI (NON IGNORARE):`;
            d.risk.vetoes.forEach(v => {
                prompt += `\n   - ${v.reason || v.pattern}`;
            });
        }
        
        if (brainResult.reasoning.length > 0) {
            prompt += `\n\n📝 REASONING:`;
            brainResult.reasoning.forEach(r => {
                prompt += `\n   • ${r}`;
            });
        }
        
        if (brainResult.prediction) {
            prompt += `\n\n🔮 PREVISIONE POST-WORKOUT:`;
            prompt += `\n   CNS: ${brainResult.prediction.cnsAfter}%`;
            prompt += `\n   Readiness domani: ${brainResult.prediction.readinessTomorrow}%`;
            prompt += `\n   DOMS attesi: ${brainResult.prediction.domsExpected}`;
        }
        
        prompt += `\n\n═══════════════════════════════════════════════════════════════`;
        
        return prompt;
    }

    /**
     * TEST
     */
    function test() {
        const mockProfile = {
            name: 'Test Athlete',
            sport: 'calcio',
            goal: 'forza',
            experience: 'intermediate',
            age: 28,
            session_duration: 60,
            quickCheck: {
                energy: 7,
                soreness: 4,
                motivation: 8,
                sleep: 6
            },
            weekly_schedule: {
                monday: 'gr_perform',
                tuesday: 'team_training',
                wednesday: 'gr_perform',
                thursday: 'team_training',
                friday: 'gr_perform',
                saturday: 'match',
                sunday: 'rest'
            }
        };
        
        console.log('\n🧪 Running ATLAS Brain Test...\n');
        const result = think(mockProfile, { targetDay: 'wednesday' });
        
        console.log('\n📄 Generated Prompt:');
        console.log(generateWorkoutPrompt(result));
        
        return result;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // API PUBBLICA
    // ═══════════════════════════════════════════════════════════════════════════

    return {
        VERSION,
        think,
        quickThink,
        generateWorkoutPrompt,
        test,
        
        // Shortcut per accesso ai moduli
        get Cortex() { return window.ATLASNeuralCortex; },
        get Synaptic() { return window.ATLASSynapticLinks; },
        get Predictive() { return window.ATLASPredictiveEngine; }
    };

})();

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧠 ATLAS BRAIN v1.0 - Unified Neural System loaded!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('Usage:');
console.log('  ATLASBrain.think(profile, options)  → Full brain processing');
console.log('  ATLASBrain.quickThink(profile)      → Fast processing');
console.log('  ATLASBrain.test()                   → Run test');
console.log('');
