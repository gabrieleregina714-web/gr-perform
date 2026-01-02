/**
 * GR Perform - Cognitive Reasoning Engine v1.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * IL MOTORE DI PENSIERO: Ragionamento come un coach esperto
 * 
 * Questo modulo implementa un vero processo di "thinking" che:
 * 1. Analizza il contesto completo dell'atleta
 * 2. Identifica problemi e opportunità
 * 3. Genera opzioni multiple
 * 4. Valuta ogni opzione con pro/contro
 * 5. Prende decisioni argomentate
 * 6. Spiega il "perché" di ogni scelta
 * 
 * Ispirato a: Chain-of-Thought reasoning, Expert Systems, Decision Trees
 * 
 * "Non è sufficiente fare la cosa giusta, bisogna saperla spiegare"
 */

window.CognitiveReasoningEngine = (function() {
    'use strict';

    const VERSION = '1.0';
    const NAME = 'CognitiveReasoningEngine';

    // ═══════════════════════════════════════════════════════════════════════════
    // 1. CONTEXT ANALYSIS - Analisi completa del contesto
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Costruisce uno snapshot completo del contesto dell'atleta
     * @param {Object} profile - Profilo atleta
     * @param {Object} context - Contesto attuale (readiness, schedule, etc.)
     * @param {Object} history - Storico allenamenti
     * @returns {Object} Snapshot completo
     */
    function buildContextSnapshot(profile, context, history) {
        const snapshot = {
            timestamp: new Date().toISOString(),
            
            // ATLETA
            athlete: {
                sport: profile.sport || 'palestra',
                experience: profile.experience_level || 'intermediate',
                age: parseInt(profile.age) || 30,
                gender: profile.gender || 'male',
                goal: profile.goal || 'general_fitness',
                role: profile.role || null,
                injuries: profile.injuries || [],
                limitations: profile.limitations || []
            },
            
            // STATO ATTUALE
            currentState: {
                readiness: context.readiness ?? 75,
                fatigue: context.fatigue ?? 'normal',
                motivation: context.motivation ?? 'normal',
                stress: context.stress ?? 'normal',
                sleepQuality: context.sleepQuality ?? 'normal',
                sleepHours: context.sleepHours ?? 7,
                musclesSore: context.musclesSore || [],
                activeInjury: context.activeInjury || null
            },
            
            // SCHEDULING
            schedule: {
                daysToMatch: context.daysToMatch ?? null,
                matchDay: context.matchDay ?? null,
                availableTime: context.availableTime || 60,
                trainingDaysThisWeek: context.trainingDaysThisWeek || 3,
                currentDayInWeek: context.currentDayInWeek || 1
            },
            
            // STORICO
            history: {
                lastWorkout: history?.lastWorkout || null,
                weeklyVolume: history?.weeklyVolume || { total: 0, byMuscle: {} },
                acwr: history?.acwr ?? 1.0,
                monotony: history?.monotony ?? 1.5,
                strain: history?.strain ?? 'normal',
                recentPerformance: history?.recentPerformance || 'stable',
                daysInProgram: history?.daysInProgram || 0,
                currentPhase: history?.currentPhase || 'accumulo'
            },
            
            // PREFERENZE
            preferences: {
                preferredMethods: profile.preferredMethods || [],
                dislikedMethods: profile.dislikedMethods || [],
                preferredEquipment: profile.preferredEquipment || ['full_gym'],
                timePreference: profile.timePreference || 'any'
            }
        };
        
        // Calcola indicatori derivati
        snapshot.derivedIndicators = calculateDerivedIndicators(snapshot);
        
        return snapshot;
    }

    /**
     * Calcola indicatori derivati dal contesto
     */
    function calculateDerivedIndicators(snapshot) {
        const indicators = {};
        
        // Readiness Level (categorico)
        const readiness = snapshot.currentState.readiness;
        if (readiness >= 80) indicators.readinessLevel = 'optimal';
        else if (readiness >= 60) indicators.readinessLevel = 'good';
        else if (readiness >= 40) indicators.readinessLevel = 'moderate';
        else indicators.readinessLevel = 'poor';
        
        // Training Intensity Recommendation
        const acwr = snapshot.history.acwr;
        if (acwr > 1.5) indicators.intensityRec = 'deload';
        else if (acwr > 1.3) indicators.intensityRec = 'reduce';
        else if (acwr < 0.8) indicators.intensityRec = 'increase';
        else indicators.intensityRec = 'maintain';
        
        // Match Proximity Effect
        const daysToMatch = snapshot.schedule.daysToMatch;
        if (daysToMatch === 0) indicators.matchProximity = 'match_day';
        else if (daysToMatch === 1) indicators.matchProximity = 'pre_match';
        else if (daysToMatch === 2) indicators.matchProximity = 'near_match';
        else if (daysToMatch !== null && daysToMatch <= 4) indicators.matchProximity = 'match_week';
        else indicators.matchProximity = 'normal';
        
        // Recovery Status (from soreness and fatigue)
        const soreCount = snapshot.currentState.musclesSore.length;
        const fatigue = snapshot.currentState.fatigue;
        if (soreCount >= 3 || fatigue === 'high') indicators.recoveryStatus = 'poor';
        else if (soreCount >= 1 || fatigue === 'moderate') indicators.recoveryStatus = 'moderate';
        else indicators.recoveryStatus = 'good';
        
        // Available Methods (based on experience)
        const exp = snapshot.athlete.experience;
        if (exp === 'beginner') {
            indicators.allowedMethodComplexity = 'basic';
            indicators.maxMethodsPerWorkout = 2;
        } else if (exp === 'intermediate') {
            indicators.allowedMethodComplexity = 'moderate';
            indicators.maxMethodsPerWorkout = 3;
        } else {
            indicators.allowedMethodComplexity = 'advanced';
            indicators.maxMethodsPerWorkout = 4;
        }
        
        // Priority Focus
        if (daysToMatch !== null && daysToMatch <= 2) {
            indicators.priorityFocus = 'match_preparation';
        } else if (acwr > 1.4) {
            indicators.priorityFocus = 'recovery';
        } else if (snapshot.currentState.readiness < 50) {
            indicators.priorityFocus = 'light_session';
        } else {
            indicators.priorityFocus = snapshot.history.currentPhase;
        }
        
        return indicators;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. PROBLEM IDENTIFICATION - Identifica problemi e vincoli
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Identifica problemi e vincoli dal contesto
     * @param {Object} snapshot - Context snapshot
     * @returns {Array} Lista di problemi identificati
     */
    function identifyProblems(snapshot) {
        const problems = [];
        
        // ═══ PROBLEMI CRITICI (bloccanti) ═══
        
        // Infortunio attivo
        if (snapshot.currentState.activeInjury) {
            problems.push({
                id: 'active_injury',
                severity: 'critical',
                category: 'health',
                description: `Infortunio attivo: ${snapshot.currentState.activeInjury}`,
                constraint: `Evitare completamente esercizi che coinvolgono ${snapshot.currentState.activeInjury}`,
                resolution: 'avoid_affected_area'
            });
        }
        
        // ACWR troppo alto
        if (snapshot.history.acwr > 1.5) {
            problems.push({
                id: 'high_acwr',
                severity: 'critical',
                category: 'load',
                description: `ACWR ${snapshot.history.acwr.toFixed(2)} > 1.5 - Rischio infortunio elevato`,
                constraint: 'Ridurre volume/intensità del 50%',
                resolution: 'mandatory_deload'
            });
        }
        
        // ═══ PROBLEMI IMPORTANTI (warning) ═══
        
        // Pre-match
        if (snapshot.schedule.daysToMatch === 1) {
            problems.push({
                id: 'pre_match',
                severity: 'important',
                category: 'schedule',
                description: 'Allenamento giorno prima della partita',
                constraint: 'Solo attivazione leggera, no lavoro pesante',
                resolution: 'activation_only'
            });
        }
        
        // Match day
        if (snapshot.schedule.daysToMatch === 0) {
            problems.push({
                id: 'match_day',
                severity: 'critical',
                category: 'schedule',
                description: 'Giorno della partita',
                constraint: 'Nessun allenamento o solo primer 10min',
                resolution: 'rest_or_primer'
            });
        }
        
        // Sonno scarso
        if (snapshot.currentState.sleepHours < 5) {
            problems.push({
                id: 'poor_sleep',
                severity: 'important',
                category: 'recovery',
                description: `Solo ${snapshot.currentState.sleepHours}h di sonno`,
                constraint: 'Ridurre intensità del 40-50%',
                resolution: 'reduce_intensity'
            });
        }
        
        // Readiness basso
        if (snapshot.currentState.readiness < 40) {
            problems.push({
                id: 'low_readiness',
                severity: 'important',
                category: 'recovery',
                description: `Readiness ${snapshot.currentState.readiness}% - sotto soglia minima`,
                constraint: 'Sessione di recupero attivo o riposo',
                resolution: 'active_recovery'
            });
        }
        
        // DOMS significativo
        if (snapshot.currentState.musclesSore.length >= 3) {
            problems.push({
                id: 'significant_doms',
                severity: 'moderate',
                category: 'recovery',
                description: `DOMS in ${snapshot.currentState.musclesSore.length} gruppi muscolari`,
                constraint: 'Evitare i muscoli dolenti',
                resolution: 'avoid_sore_muscles'
            });
        }
        
        // ═══ PROBLEMI MODERATI (suggerimenti) ═══
        
        // Tempo limitato
        if (snapshot.schedule.availableTime < 30) {
            problems.push({
                id: 'time_limited',
                severity: 'moderate',
                category: 'logistics',
                description: `Solo ${snapshot.schedule.availableTime} minuti disponibili`,
                constraint: 'Sessione express con focus su compound',
                resolution: 'express_workout'
            });
        }
        
        // Alto stress
        if (snapshot.currentState.stress === 'high') {
            problems.push({
                id: 'high_stress',
                severity: 'moderate',
                category: 'mental',
                description: 'Livello di stress elevato',
                constraint: 'Preferire sessione rilassante, evitare HIIT',
                resolution: 'prefer_steady_state'
            });
        }
        
        // Monotony alta
        if (snapshot.history.monotony > 2.0) {
            problems.push({
                id: 'high_monotony',
                severity: 'moderate',
                category: 'programming',
                description: 'Training monotony > 2.0',
                constraint: 'Variare stimolo e intensità',
                resolution: 'increase_variety'
            });
        }
        
        return problems;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. OPTION GENERATION - Genera opzioni multiple
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Genera opzioni di workout basate sul contesto
     * @param {Object} snapshot - Context snapshot
     * @param {Array} problems - Problemi identificati
     * @returns {Array} Lista di opzioni possibili
     */
    function generateOptions(snapshot, problems) {
        const options = [];
        
        const hasCritical = problems.some(p => p.severity === 'critical');
        const hasImportant = problems.some(p => p.severity === 'important');
        
        // ═══ SE CI SONO PROBLEMI CRITICI ═══
        if (hasCritical) {
            // Opzione 1: Riposo completo
            options.push({
                id: 'complete_rest',
                name: 'Riposo Completo',
                type: 'rest',
                rationale: 'Problemi critici identificati - priorità al recupero',
                intensity: 0,
                volume: 0,
                applicableFor: problems.filter(p => p.severity === 'critical').map(p => p.id)
            });
            
            // Opzione 2: Recupero attivo leggero
            options.push({
                id: 'active_recovery',
                name: 'Recupero Attivo',
                type: 'recovery',
                rationale: 'Mantenere movimento senza stress sul sistema',
                intensity: 0.3,
                volume: 0.3,
                structure: ['mobility_20min', 'light_cardio_10min', 'stretching_10min'],
                applicableFor: problems.filter(p => p.severity === 'critical').map(p => p.id)
            });
        }
        
        // ═══ SE CI SONO PROBLEMI IMPORTANTI (ma non critici) ═══
        if (hasImportant && !hasCritical) {
            // Opzione: Sessione ridotta
            options.push({
                id: 'reduced_session',
                name: 'Sessione Ridotta',
                type: 'training',
                rationale: 'Problemi importanti - ridurre volume e intensità',
                intensity: 0.6,
                volume: 0.6,
                modifications: ['reduce_sets_30', 'reduce_weight_20', 'avoid_failure'],
                applicableFor: problems.filter(p => p.severity === 'important').map(p => p.id)
            });
            
            // Opzione: Focus su aree non problematiche
            options.push({
                id: 'modified_focus',
                name: 'Focus Modificato',
                type: 'training',
                rationale: 'Lavorare evitando le aree problematiche',
                intensity: 0.8,
                volume: 0.8,
                modifications: ['avoid_problem_areas', 'alternative_exercises'],
                applicableFor: problems.filter(p => p.severity === 'important').map(p => p.id)
            });
        }
        
        // ═══ OPZIONI NORMALI ═══
        if (!hasCritical) {
            const phase = snapshot.history.currentPhase || 'accumulo';
            
            // Opzione basata sulla fase corrente
            const phaseOptions = {
                accumulo: {
                    id: 'accumulo_session',
                    name: 'Sessione di Accumulo',
                    type: 'training',
                    rationale: 'Fase di accumulo - focus su volume',
                    intensity: 0.7,
                    volume: 0.9,
                    preferredMethods: ['superset', 'drop_set', 'tempo_training'],
                    repRange: '8-12',
                    restTime: '60-90s'
                },
                intensificazione: {
                    id: 'intensification_session',
                    name: 'Sessione di Intensificazione',
                    type: 'training',
                    rationale: 'Fase di intensificazione - focus su carichi',
                    intensity: 0.85,
                    volume: 0.7,
                    preferredMethods: ['cluster_set', 'rest_pause', 'wave_loading'],
                    repRange: '4-6',
                    restTime: '180-240s'
                },
                realizzazione: {
                    id: 'realization_session',
                    name: 'Sessione di Realizzazione',
                    type: 'training',
                    rationale: 'Fase di realizzazione - picco performance',
                    intensity: 0.9,
                    volume: 0.5,
                    preferredMethods: ['singles', 'contrast_training'],
                    repRange: '1-3',
                    restTime: '300s+'
                },
                deload: {
                    id: 'deload_session',
                    name: 'Sessione Deload',
                    type: 'training',
                    rationale: 'Deload - mantenere pattern senza stress',
                    intensity: 0.5,
                    volume: 0.5,
                    preferredMethods: ['tempo_training', 'technique_work'],
                    repRange: '8-10',
                    restTime: '90-120s'
                }
            };
            
            options.push(phaseOptions[phase] || phaseOptions.accumulo);
        }
        
        // ═══ OPZIONI SPORT-SPECIFICHE ═══
        const sport = snapshot.athlete.sport;
        if (sport && sport !== 'palestra') {
            options.push({
                id: 'sport_specific',
                name: `Sessione Sport-Specifica (${sport})`,
                type: 'sport_specific',
                rationale: `Allenamento mirato alle richieste del ${sport}`,
                intensity: 0.75,
                volume: 0.75,
                structure: getSportSpecificStructure(sport, snapshot)
            });
        }
        
        // ═══ OPZIONE EXPRESS (se tempo limitato) ═══
        if (snapshot.schedule.availableTime < 45) {
            options.push({
                id: 'express_workout',
                name: 'Workout Express',
                type: 'training',
                rationale: 'Massimo risultato in minimo tempo',
                intensity: 0.8,
                volume: 0.5,
                preferredMethods: ['superset', 'circuit', 'emom'],
                structure: ['warmup_5min', 'compound_pairs_20min', 'finisher_5min']
            });
        }
        
        return options;
    }

    function getSportSpecificStructure(sport, snapshot) {
        const structures = {
            boxe: [
                'warmup_dynamic_10min',
                'shadow_boxing_5min',
                'explosive_power_15min',
                'boxing_circuits_20min',
                'core_neck_10min',
                'cooldown_5min'
            ],
            calcio: [
                'fifa11_warmup_15min',
                'sprint_agility_15min',
                'strength_compound_20min',
                'prevention_work_10min',
                'cooldown_5min'
            ],
            basket: [
                'dynamic_warmup_10min',
                'jump_power_15min',
                'strength_work_20min',
                'lateral_agility_10min',
                'cooldown_5min'
            ]
        };
        
        return structures[sport] || structures.calcio;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. OPTION EVALUATION - Valuta ogni opzione con score
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Valuta ogni opzione e assegna score
     * @param {Array} options - Opzioni generate
     * @param {Object} snapshot - Context snapshot
     * @param {Array} problems - Problemi identificati
     * @returns {Array} Opzioni con score e valutazioni
     */
    function evaluateOptions(options, snapshot, problems) {
        return options.map(option => {
            const evaluation = {
                ...option,
                scores: {},
                pros: [],
                cons: [],
                totalScore: 0
            };
            
            // ═══ CRITERI DI VALUTAZIONE ═══
            
            // 1. Safety Score (0-25)
            let safetyScore = 25;
            if (option.type === 'rest') safetyScore = 25;
            else if (option.type === 'recovery') safetyScore = 23;
            else {
                // Riduci per intensità alta
                safetyScore -= (option.intensity * 10);
                // Riduci per problemi
                problems.forEach(p => {
                    if (p.severity === 'critical') safetyScore -= 10;
                    if (p.severity === 'important') safetyScore -= 5;
                });
            }
            evaluation.scores.safety = Math.max(0, Math.min(25, safetyScore));
            
            // 2. Effectiveness Score (0-25)
            let effectivenessScore = 15;
            if (option.type === 'rest') effectivenessScore = 10;
            else if (option.type === 'training') {
                // Bonus per match con fase
                if (option.id.includes(snapshot.history.currentPhase)) {
                    effectivenessScore += 10;
                    evaluation.pros.push('Allineato con fase corrente');
                }
                // Bonus per sport-specifico
                if (option.type === 'sport_specific') {
                    effectivenessScore += 8;
                    evaluation.pros.push('Specificità sportiva');
                }
            }
            evaluation.scores.effectiveness = Math.min(25, effectivenessScore);
            
            // 3. Feasibility Score (0-25)
            let feasibilityScore = 20;
            const timeAvailable = snapshot.schedule.availableTime;
            const estimatedTime = option.type === 'rest' ? 0 : 
                                  option.type === 'recovery' ? 30 : 60;
            
            if (estimatedTime > timeAvailable) {
                feasibilityScore -= 15;
                evaluation.cons.push(`Richiede ${estimatedTime}min, disponibili ${timeAvailable}min`);
            } else {
                evaluation.pros.push('Fattibile nel tempo disponibile');
            }
            evaluation.scores.feasibility = Math.max(0, feasibilityScore);
            
            // 4. Adherence Score (0-25)
            let adherenceScore = 18;
            // Preferenze metodi
            if (option.preferredMethods) {
                const liked = snapshot.preferences.preferredMethods || [];
                const disliked = snapshot.preferences.dislikedMethods || [];
                
                option.preferredMethods.forEach(m => {
                    if (liked.includes(m)) {
                        adherenceScore += 3;
                        evaluation.pros.push(`Include metodo preferito: ${m}`);
                    }
                    if (disliked.includes(m)) {
                        adherenceScore -= 5;
                        evaluation.cons.push(`Include metodo non gradito: ${m}`);
                    }
                });
            }
            evaluation.scores.adherence = Math.min(25, Math.max(0, adherenceScore));
            
            // ═══ CALCOLO SCORE TOTALE ═══
            evaluation.totalScore = 
                evaluation.scores.safety +
                evaluation.scores.effectiveness +
                evaluation.scores.feasibility +
                evaluation.scores.adherence;
            
            return evaluation;
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. DECISION MAKING - Prende la decisione finale
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Prende la decisione finale e genera il reasoning
     * @param {Array} evaluatedOptions - Opzioni valutate
     * @param {Object} snapshot - Context snapshot
     * @param {Array} problems - Problemi identificati
     * @returns {Object} Decisione con reasoning completo
     */
    function makeDecision(evaluatedOptions, snapshot, problems) {
        // Ordina per score
        const sorted = evaluatedOptions.sort((a, b) => b.totalScore - a.totalScore);
        
        // La migliore opzione
        const chosen = sorted[0];
        const alternatives = sorted.slice(1, 3);
        
        // Costruisci reasoning
        const reasoning = buildReasoning(chosen, alternatives, snapshot, problems);
        
        return {
            decision: chosen,
            alternatives,
            reasoning,
            confidence: calculateConfidence(chosen, sorted),
            timestamp: new Date().toISOString()
        };
    }

    function buildReasoning(chosen, alternatives, snapshot, problems) {
        let reasoning = '';
        
        // Contesto
        reasoning += `📊 ANALISI CONTESTO:\n`;
        reasoning += `• Sport: ${snapshot.athlete.sport}\n`;
        reasoning += `• Livello: ${snapshot.athlete.experience}\n`;
        reasoning += `• Readiness: ${snapshot.currentState.readiness}%\n`;
        reasoning += `• Fase: ${snapshot.history.currentPhase}\n`;
        if (snapshot.schedule.daysToMatch !== null) {
            reasoning += `• Giorni a partita: ${snapshot.schedule.daysToMatch}\n`;
        }
        
        // Problemi
        if (problems.length > 0) {
            reasoning += `\n⚠️ PROBLEMI IDENTIFICATI:\n`;
            problems.forEach(p => {
                const icon = p.severity === 'critical' ? '🔴' : 
                             p.severity === 'important' ? '🟠' : '🟡';
                reasoning += `${icon} ${p.description}\n`;
            });
        }
        
        // Decisione
        reasoning += `\n✅ DECISIONE: ${chosen.name}\n`;
        reasoning += `📝 Razionale: ${chosen.rationale}\n`;
        reasoning += `📈 Score totale: ${chosen.totalScore}/100\n`;
        
        // Pro e contro
        if (chosen.pros.length > 0) {
            reasoning += `\n👍 PUNTI DI FORZA:\n`;
            chosen.pros.forEach(p => reasoning += `• ${p}\n`);
        }
        if (chosen.cons.length > 0) {
            reasoning += `\n👎 LIMITAZIONI:\n`;
            chosen.cons.forEach(c => reasoning += `• ${c}\n`);
        }
        
        // Alternative
        if (alternatives.length > 0) {
            reasoning += `\n🔄 ALTERNATIVE CONSIDERATE:\n`;
            alternatives.forEach(alt => {
                reasoning += `• ${alt.name} (score: ${alt.totalScore})\n`;
            });
        }
        
        return reasoning;
    }

    function calculateConfidence(chosen, allOptions) {
        if (allOptions.length <= 1) return 100;
        
        const secondBest = allOptions[1];
        const gap = chosen.totalScore - secondBest.totalScore;
        
        // Gap > 15 = alta confidenza
        // Gap 5-15 = media
        // Gap < 5 = bassa
        if (gap > 15) return 95;
        if (gap > 10) return 85;
        if (gap > 5) return 75;
        return 60;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 6. CHAIN OF THOUGHT - Processo completo di reasoning
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Esegue il processo completo di reasoning
     * @param {Object} profile - Profilo atleta
     * @param {Object} context - Contesto attuale
     * @param {Object} history - Storico
     * @returns {Object} Risultato completo con tutti i passaggi
     */
    function reason(profile, context = {}, history = {}) {
        console.log(`🧠 ${NAME}: Starting cognitive reasoning process...`);
        
        const startTime = performance.now();
        
        // Step 1: Build context
        const snapshot = buildContextSnapshot(profile, context, history);
        console.log('  ✓ Context snapshot built');
        
        // Step 2: Identify problems
        const problems = identifyProblems(snapshot);
        console.log(`  ✓ ${problems.length} problems identified`);
        
        // Step 3: Generate options
        const options = generateOptions(snapshot, problems);
        console.log(`  ✓ ${options.length} options generated`);
        
        // Step 4: Evaluate options
        const evaluatedOptions = evaluateOptions(options, snapshot, problems);
        console.log('  ✓ Options evaluated');
        
        // Step 5: Make decision
        const decision = makeDecision(evaluatedOptions, snapshot, problems);
        console.log('  ✓ Decision made');
        
        const duration = performance.now() - startTime;
        
        return {
            success: true,
            duration: Math.round(duration),
            snapshot,
            problems,
            options: evaluatedOptions,
            decision,
            
            // Quick access
            recommendedOption: decision.decision,
            confidence: decision.confidence,
            reasoning: decision.reasoning,
            
            // Summary for prompt injection
            getSummaryForPrompt: function() {
                return formatForPrompt(this);
            }
        };
    }

    /**
     * Formatta il risultato per iniezione nel prompt AI
     */
    function formatForPrompt(result) {
        let prompt = '\n═══ COGNITIVE REASONING ANALYSIS ═══\n\n';
        
        prompt += result.reasoning;
        
        prompt += `\n\n🎯 IMPLEMENTAZIONE SUGGERITA:\n`;
        const option = result.recommendedOption;
        
        if (option.type === 'rest') {
            prompt += 'Riposo completo raccomandato.\n';
        } else if (option.type === 'recovery') {
            prompt += 'Sessione di recupero attivo:\n';
            if (option.structure) {
                option.structure.forEach(s => prompt += `• ${s}\n`);
            }
        } else {
            prompt += `Intensità: ${Math.round(option.intensity * 100)}%\n`;
            prompt += `Volume: ${Math.round(option.volume * 100)}%\n`;
            if (option.preferredMethods) {
                prompt += `Metodi consigliati: ${option.preferredMethods.join(', ')}\n`;
            }
            if (option.repRange) {
                prompt += `Range rep: ${option.repRange}\n`;
            }
            if (option.structure) {
                prompt += 'Struttura:\n';
                option.structure.forEach(s => prompt += `• ${s}\n`);
            }
            if (option.modifications) {
                prompt += 'Modifiche:\n';
                option.modifications.forEach(m => prompt += `• ${m}\n`);
            }
        }
        
        prompt += `\nConfidenza decisione: ${result.confidence}%\n`;
        
        return prompt;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════════

    console.log(`🧠 ${NAME} v${VERSION} loaded - Cognitive reasoning ready`);

    return {
        VERSION,
        NAME,
        
        // Main function
        reason,
        
        // Individual steps (for testing/debugging)
        buildContextSnapshot,
        identifyProblems,
        generateOptions,
        evaluateOptions,
        makeDecision,
        
        // Utilities
        formatForPrompt,
        calculateDerivedIndicators
    };
})();
