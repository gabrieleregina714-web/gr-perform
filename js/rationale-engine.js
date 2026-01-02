// ============================================
// GR PERFORM - RATIONALE ENGINE v1.0
// ============================================
// Il cuore del sistema: ragiona come un coach esperto
// Non genera schede - DECIDE cosa fare e spiega PERCHÉ
// ============================================

const RationaleEngine = {
    
    version: '1.0.0',
    name: 'RationaleEngine',
    
    // ===========================================
    // STEP 1: COMPRENSIONE DEL CONTESTO
    // ===========================================
    
    buildContextSnapshot(athlete, sportData, weekContext, todayContext) {
        return {
            // Chi è l'atleta
            athlete: {
                id: athlete?.id,
                name: `${athlete?.first_name || ''} ${athlete?.last_name || ''}`.trim(),
                age: athlete?.birth_date ? this.calculateAge(athlete.birth_date) : null,
                sport: athlete?.sport,
                level: athlete?.experience_level,
                activeInjuries: athlete?.injuries?.filter(i => i.status === 'active') || [],
                historicalInjuries: athlete?.injuries?.filter(i => i.status === 'healed') || []
            },
            
            // Quando siamo
            timing: {
                dayOfWeek: todayContext?.dayOfWeek || new Date().toLocaleDateString('it-IT', { weekday: 'long' }),
                dayType: todayContext?.dayType || 'training', // training, match, rest, recovery
                matchDay: weekContext?.matchDay || null, // data prossimo match
                daysToMatch: weekContext?.daysToMatch ?? null, // MD-x
                daysFromMatch: weekContext?.daysFromMatch ?? null, // MD+x
                phase: weekContext?.phase || 'in-season', // pre-season, in-season, off-season
                weekNumber: weekContext?.weekNumber || 1,
                mesocycle: weekContext?.mesocycle || 'accumulation'
            },
            
            // Stato attuale
            currentState: {
                fatigue: todayContext?.fatigue || { muscular: 50, cns: 50, psychological: 50 },
                sleep: todayContext?.sleep || { hours: 7, quality: 'good' },
                stress: todayContext?.stress || 5,
                readiness: todayContext?.readiness || 7,
                soreness: todayContext?.soreness || [],
                compliance: todayContext?.compliance ?? 80,
                acwr: todayContext?.acwr ?? 1.0 // Acute:Chronic Workload Ratio
            },
            
            // Carico esterno recente
            externalLoad: {
                yesterday: todayContext?.externalLoadYesterday || null,
                lastTeamSession: weekContext?.lastTeamSession || null,
                weeklyTeamLoad: weekContext?.weeklyTeamLoad || 0
            },
            
            // Vincoli attivi
            constraints: {
                timeAvailable: todayContext?.timeAvailable || 60, // minuti
                equipmentAvailable: todayContext?.equipment || 'full',
                locationConstraints: todayContext?.location || 'gym',
                avoidExercises: athlete?.avoid_exercises || [],
                avoidMovements: this.getMovementsToAvoid(athlete?.injuries)
            }
        };
    },
    
    // ===========================================
    // STEP 2: IDENTIFICAZIONE DEL PROBLEMA
    // ===========================================
    
    identifyDecisionNeeded(context, requestType = 'generate_workout') {
        const { athlete, timing, currentState, externalLoad, constraints } = context;
        
        let problemStatement = `Devo ${this.getRequestDescription(requestType)} per `;
        problemStatement += `${athlete.name}, ${athlete.sport} ${athlete.level}`;
        
        // Aggiungi dettagli rilevanti
        const details = [];
        
        if (timing.daysToMatch !== null && timing.daysToMatch <= 3) {
            details.push(`a ${timing.daysToMatch} giorni dal match`);
        }
        if (timing.daysFromMatch !== null && timing.daysFromMatch <= 2) {
            details.push(`${timing.daysFromMatch} giorni dopo il match`);
        }
        if (currentState.soreness?.length > 0) {
            details.push(`con fastidio a: ${currentState.soreness.map(s => s.location).join(', ')}`);
        }
        if (currentState.sleep?.hours < 6) {
            details.push(`avendo dormito solo ${currentState.sleep.hours}h`);
        }
        if (currentState.acwr > 1.3) {
            details.push(`con ACWR elevato (${currentState.acwr.toFixed(2)})`);
        }
        if (externalLoad.lastTeamSession) {
            details.push(`dopo allenamento squadra ${externalLoad.lastTeamSession}`);
        }
        
        if (details.length > 0) {
            problemStatement += `, ${details.join(', ')}`;
        }
        
        problemStatement += `.`;
        
        return {
            statement: problemStatement,
            requestType,
            keyFactors: this.identifyKeyFactors(context)
        };
    },
    
    identifyKeyFactors(context) {
        const factors = [];
        const { timing, currentState, externalLoad, athlete, constraints } = context;
        
        // Fattori di timing
        if (timing.daysToMatch !== null) {
            if (timing.daysToMatch === 0) {
                factors.push({ factor: 'MATCH_DAY', priority: 'critical', value: 'Oggi è giorno gara' });
            } else if (timing.daysToMatch === 1) {
                factors.push({ factor: 'MD_MINUS_1', priority: 'high', value: 'Domani c\'è gara' });
            } else if (timing.daysToMatch === 2) {
                factors.push({ factor: 'MD_MINUS_2', priority: 'medium', value: 'Gara tra 2 giorni' });
            }
        }
        
        if (timing.daysFromMatch !== null && timing.daysFromMatch <= 2) {
            factors.push({ 
                factor: 'POST_MATCH', 
                priority: timing.daysFromMatch === 1 ? 'high' : 'medium',
                value: `${timing.daysFromMatch} giorno/i dopo gara`
            });
        }
        
        // Fattori di stato
        if (currentState.readiness < 5) {
            factors.push({ factor: 'LOW_READINESS', priority: 'high', value: `Readiness ${currentState.readiness}/10` });
        }
        
        if (currentState.sleep?.hours < 6) {
            factors.push({ factor: 'SLEEP_DEBT', priority: 'medium', value: `Solo ${currentState.sleep.hours}h sonno` });
        }
        
        if (currentState.acwr > 1.5) {
            factors.push({ factor: 'HIGH_ACWR', priority: 'critical', value: `ACWR ${currentState.acwr.toFixed(2)} - rischio infortunio` });
        } else if (currentState.acwr > 1.3) {
            factors.push({ factor: 'ELEVATED_ACWR', priority: 'high', value: `ACWR ${currentState.acwr.toFixed(2)} - attenzione` });
        }
        
        if (currentState.compliance < 60) {
            factors.push({ factor: 'LOW_COMPLIANCE', priority: 'medium', value: `Compliance ${currentState.compliance}% - necessario DELOAD` });
        }
        
        // Fattori di infortunio
        if (currentState.soreness?.length > 0) {
            currentState.soreness.forEach(s => {
                factors.push({ 
                    factor: 'ACTIVE_SORENESS', 
                    priority: s.severity > 5 ? 'high' : 'medium',
                    value: `${s.location}: ${s.severity}/10`
                });
            });
        }
        
        if (athlete.activeInjuries?.length > 0) {
            athlete.activeInjuries.forEach(inj => {
                factors.push({ 
                    factor: 'ACTIVE_INJURY', 
                    priority: 'critical',
                    value: `${inj.type} - ${inj.location}`
                });
            });
        }
        
        // Carico esterno
        if (externalLoad.lastTeamSession) {
            factors.push({ 
                factor: 'EXTERNAL_LOAD', 
                priority: 'medium',
                value: `Allenamento squadra: ${externalLoad.lastTeamSession}`
            });
        }
        
        // Ordina per priorità
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        factors.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        
        return factors;
    },
    
    // ===========================================
    // STEP 3: GENERAZIONE OPZIONI
    // ===========================================
    
    generateOptions(context, problem) {
        const options = [];
        const { timing, currentState, athlete } = context;
        const hasHighPriorityIssues = problem.keyFactors.some(f => f.priority === 'critical' || f.priority === 'high');
        
        // OPZIONE A: Sessione standard come da programma
        if (!hasHighPriorityIssues) {
            options.push({
                id: 'A',
                name: 'Sessione standard',
                description: 'Allenamento come da programma settimanale',
                type: 'standard',
                volumeModifier: 1.0,
                intensityModifier: 1.0,
                riskLevel: 'low'
            });
        }
        
        // OPZIONE B: Sessione modificata
        options.push({
            id: 'B',
            name: 'Sessione modificata',
            description: 'Allenamento adattato ai fattori attuali',
            type: 'modified',
            volumeModifier: this.calculateVolumeModifier(context),
            intensityModifier: this.calculateIntensityModifier(context),
            modifications: this.suggestModifications(context, problem),
            riskLevel: 'low-medium'
        });
        
        // OPZIONE C: Focus alternativo
        if (currentState.soreness?.length > 0 || athlete.activeInjuries?.length > 0) {
            options.push({
                id: 'C',
                name: 'Focus alternativo',
                description: 'Lavoro su zone non coinvolte + recovery attivo',
                type: 'alternative_focus',
                focusAreas: this.getAlternativeFocusAreas(context),
                volumeModifier: 0.6,
                intensityModifier: 0.7,
                riskLevel: 'very-low'
            });
        }
        
        // OPZIONE D: Recupero attivo
        if (timing.daysFromMatch === 1 || currentState.readiness < 5 || currentState.fatigue?.cns > 80) {
            options.push({
                id: 'D',
                name: 'Recupero attivo',
                description: 'Sessione leggera focalizzata su recovery',
                type: 'active_recovery',
                volumeModifier: 0.3,
                intensityModifier: 0.4,
                activities: ['mobilità', 'foam rolling', 'stretching dinamico', 'cardio leggero'],
                riskLevel: 'minimal'
            });
        }
        
        // OPZIONE E: Riposo completo
        if (timing.daysToMatch === 1 || currentState.acwr > 1.5 || 
            problem.keyFactors.some(f => f.factor === 'ACTIVE_INJURY')) {
            options.push({
                id: 'E',
                name: 'Riposo',
                description: 'Nessun allenamento strutturato',
                type: 'rest',
                volumeModifier: 0,
                intensityModifier: 0,
                recommendations: ['riposo attivo leggero se necessario', 'focus su sonno e nutrizione'],
                riskLevel: 'none'
            });
        }
        
        return options;
    },
    
    // ===========================================
    // STEP 4: VALUTAZIONE OPZIONI
    // ===========================================
    
    evaluateOptions(options, context, problem) {
        const evaluations = options.map(option => {
            const evaluation = {
                option,
                scores: {},
                pros: [],
                cons: [],
                totalScore: 0
            };
            
            // Score per diversi criteri (0-100)
            evaluation.scores.safetyScore = this.calculateSafetyScore(option, context);
            evaluation.scores.progressScore = this.calculateProgressScore(option, context);
            evaluation.scores.alignmentScore = this.calculateAlignmentScore(option, context, problem);
            evaluation.scores.practicalityScore = this.calculatePracticalityScore(option, context);
            
            // Pesi per i criteri
            const weights = {
                safetyScore: 0.35,      // La sicurezza è prioritaria
                progressScore: 0.25,    // Ma anche il progresso conta
                alignmentScore: 0.25,   // Allineamento con obiettivi
                practicalityScore: 0.15 // Fattibilità pratica
            };
            
            // Score pesato
            evaluation.totalScore = Object.entries(weights).reduce((sum, [key, weight]) => {
                return sum + (evaluation.scores[key] * weight);
            }, 0);
            
            // Genera pro e contro
            evaluation.pros = this.generatePros(option, evaluation.scores);
            evaluation.cons = this.generateCons(option, evaluation.scores, context);
            
            return evaluation;
        });
        
        // Ordina per score totale
        evaluations.sort((a, b) => b.totalScore - a.totalScore);
        
        return evaluations;
    },
    
    calculateSafetyScore(option, context) {
        let score = 100;
        
        // Penalizza in base al risk level
        const riskPenalties = { 'none': 0, 'minimal': 5, 'very-low': 10, 'low': 15, 'low-medium': 25, 'medium': 40, 'high': 70 };
        score -= riskPenalties[option.riskLevel] || 0;
        
        // Penalizza se ci sono infortuni attivi e si fa sessione normale
        if (context.athlete.activeInjuries?.length > 0 && option.type === 'standard') {
            score -= 30;
        }
        
        // Penalizza se ACWR alto e volume alto
        if (context.currentState.acwr > 1.3 && option.volumeModifier > 0.8) {
            score -= 20;
        }
        
        return Math.max(0, Math.min(100, score));
    },
    
    calculateProgressScore(option, context) {
        let score = 50; // Baseline
        
        // Più volume/intensità = più potenziale progresso (ma bilanciato con safety)
        score += (option.volumeModifier || 0) * 30;
        score += (option.intensityModifier || 0) * 20;
        
        // Penalizza riposo completo per progresso
        if (option.type === 'rest') {
            score -= 30;
        }
        
        return Math.max(0, Math.min(100, score));
    },
    
    calculateAlignmentScore(option, context, problem) {
        let score = 70;
        
        // Se siamo vicini a match, valorizziamo opzioni conservative
        if (context.timing.daysToMatch !== null && context.timing.daysToMatch <= 2) {
            if (option.type === 'active_recovery' || option.type === 'rest') {
                score += 25;
            } else if (option.type === 'standard') {
                score -= 20;
            }
        }
        
        // Se compliance bassa, DELOAD è allineato
        if (context.currentState.compliance < 60 && option.volumeModifier < 0.6) {
            score += 20;
        }
        
        // Se post-match, recovery è allineato
        if (context.timing.daysFromMatch === 1 && option.type === 'active_recovery') {
            score += 30;
        }
        
        return Math.max(0, Math.min(100, score));
    },
    
    calculatePracticalityScore(option, context) {
        let score = 80;
        
        // Penalizza se richiede più tempo di quello disponibile
        const estimatedTime = this.estimateSessionTime(option);
        if (estimatedTime > context.constraints.timeAvailable) {
            score -= 30;
        }
        
        // Penalizza se l'opzione alternativa non ha zone valide
        if (option.type === 'alternative_focus' && (!option.focusAreas || option.focusAreas.length === 0)) {
            score -= 40;
        }
        
        return Math.max(0, Math.min(100, score));
    },
    
    generatePros(option, scores) {
        const pros = [];
        
        if (scores.safetyScore >= 90) pros.push('Minimizza rischio infortuni');
        if (scores.progressScore >= 80) pros.push('Mantiene stimolo allenante ottimale');
        if (scores.alignmentScore >= 85) pros.push('Perfettamente allineato con la fase attuale');
        
        if (option.type === 'modified') pros.push('Bilancia progresso e sicurezza');
        if (option.type === 'active_recovery') pros.push('Accelera il recupero');
        if (option.type === 'alternative_focus') pros.push('Permette allenamento evitando zone problematiche');
        
        return pros;
    },
    
    generateCons(option, scores, context) {
        const cons = [];
        
        if (scores.safetyScore < 70) cons.push('Rischio potenziale per le condizioni attuali');
        if (scores.progressScore < 50) cons.push('Stimolo allenante ridotto');
        if (option.type === 'rest') cons.push('Nessun progresso in questa sessione');
        if (option.type === 'standard' && context.currentState.acwr > 1.2) {
            cons.push('Potrebbe aumentare ulteriormente ACWR');
        }
        
        return cons;
    },
    
    // ===========================================
    // STEP 5: DECISIONE E RATIONALE
    // ===========================================
    
    makeDecision(evaluations, context, problem) {
        // Prendi la migliore opzione
        const bestEval = evaluations[0];
        const alternativeEval = evaluations[1];
        
        // Costruisci il rationale completo
        const rationale = {
            timestamp: new Date().toISOString(),
            
            // Contesto sintetizzato
            contextSummary: this.summarizeContext(context),
            
            // Problema identificato
            problem: problem.statement,
            keyFactors: problem.keyFactors,
            
            // Decisione
            decision: {
                chosen: bestEval.option.name,
                type: bestEval.option.type,
                confidence: this.calculateConfidence(bestEval, alternativeEval),
                volumeModifier: bestEval.option.volumeModifier,
                intensityModifier: bestEval.option.intensityModifier
            },
            
            // Ragionamento
            reasoning: {
                whyChosen: this.explainChoice(bestEval, context, problem),
                alternativesConsidered: evaluations.slice(1).map(e => ({
                    option: e.option.name,
                    score: Math.round(e.totalScore),
                    whyNotChosen: this.explainRejection(e, bestEval)
                })),
                tradeoffs: this.identifyTradeoffs(bestEval, evaluations)
            },
            
            // Modifiche specifiche
            modifications: bestEval.option.modifications || [],
            focusAreas: bestEval.option.focusAreas || null,
            
            // Piano di monitoraggio
            monitoring: this.createMonitoringPlan(bestEval, context, problem),
            
            // Score dettagliati
            scores: bestEval.scores
        };
        
        return rationale;
    },
    
    calculateConfidence(bestEval, alternativeEval) {
        if (!alternativeEval) return 95;
        
        const scoreDiff = bestEval.totalScore - alternativeEval.totalScore;
        
        if (scoreDiff > 20) return 95;
        if (scoreDiff > 15) return 90;
        if (scoreDiff > 10) return 85;
        if (scoreDiff > 5) return 75;
        return 65; // Decisione difficile, opzioni simili
    },
    
    explainChoice(evaluation, context, problem) {
        const reasons = [];
        const option = evaluation.option;
        
        // Motivo principale basato sul tipo
        switch (option.type) {
            case 'standard':
                reasons.push('Non ci sono fattori critici che richiedono modifiche alla programmazione.');
                break;
            case 'modified':
                reasons.push(`L'allenamento è stato adattato considerando: ${problem.keyFactors.slice(0, 3).map(f => f.value).join(', ')}.`);
                break;
            case 'alternative_focus':
                reasons.push(`Focus su ${option.focusAreas?.join(', ')} per evitare stress sulle zone problematiche.`);
                break;
            case 'active_recovery':
                reasons.push('Le condizioni attuali richiedono priorità al recupero per ottimizzare le sessioni successive.');
                break;
            case 'rest':
                reasons.push('Il riposo è la scelta migliore per prevenire sovrallenamento o aggravamento di problemi esistenti.');
                break;
        }
        
        // Aggiungi dettagli sui punteggi
        if (evaluation.scores.safetyScore >= 90) {
            reasons.push('Questa opzione minimizza il rischio di infortunio.');
        }
        if (evaluation.scores.alignmentScore >= 85) {
            reasons.push('Perfettamente allineata con la fase del macrociclo e la prossimità agli impegni agonistici.');
        }
        
        return reasons.join(' ');
    },
    
    explainRejection(evaluation, bestEval) {
        const reasons = [];
        
        if (evaluation.scores.safetyScore < bestEval.scores.safetyScore - 10) {
            reasons.push('rischio più elevato');
        }
        if (evaluation.scores.alignmentScore < bestEval.scores.alignmentScore - 10) {
            reasons.push('meno allineata con gli obiettivi attuali');
        }
        if (evaluation.cons.length > 0) {
            reasons.push(evaluation.cons[0].toLowerCase());
        }
        
        return reasons.length > 0 ? reasons.join(', ') : 'score complessivo inferiore';
    },
    
    identifyTradeoffs(bestEval, allEvaluations) {
        const tradeoffs = [];
        
        // Confronta con l'opzione più progressiva
        const mostProgressive = allEvaluations.find(e => e.option.type === 'standard');
        if (mostProgressive && bestEval.option.type !== 'standard') {
            if (mostProgressive.scores.progressScore > bestEval.scores.progressScore) {
                tradeoffs.push({
                    sacrificed: 'stimolo allenante massimo',
                    gained: 'maggiore sicurezza e recupero',
                    worthIt: bestEval.scores.safetyScore - mostProgressive.scores.safetyScore > 15
                });
            }
        }
        
        return tradeoffs;
    },
    
    createMonitoringPlan(evaluation, context, problem) {
        const plan = {
            immediateChecks: [],
            postWorkoutChecks: [],
            nextDayChecks: []
        };
        
        // Check immediati pre-workout
        if (context.currentState.soreness?.length > 0) {
            plan.immediateChecks.push('Rivalutare dolore durante warm-up');
            plan.immediateChecks.push('Se dolore aumenta >3 punti, passare a recovery');
        }
        
        // Check post-workout
        plan.postWorkoutChecks.push('Registrare RPE effettivo della sessione');
        
        if (context.timing.daysToMatch !== null && context.timing.daysToMatch <= 3) {
            plan.postWorkoutChecks.push('Verificare assenza di nuovi fastidi');
        }
        
        if (context.currentState.acwr > 1.2) {
            plan.postWorkoutChecks.push('Monitorare sensazione di fatica nelle ore successive');
        }
        
        // Check giorno dopo
        plan.nextDayChecks.push('Valutare readiness al risveglio');
        
        if (problem.keyFactors.some(f => f.factor === 'ACTIVE_SORENESS')) {
            plan.nextDayChecks.push('Confrontare livello di dolore: migliorato/stabile/peggiorato');
        }
        
        plan.nextDayChecks.push('Se problemi emergenti, attivare protocollo gestione infortuni');
        
        return plan;
    },
    
    // ===========================================
    // STEP 6: OUTPUT FORMATTATO
    // ===========================================
    
    formatRationaleForUI(rationale) {
        return {
            // Header compatto
            summary: {
                decision: rationale.decision.chosen,
                confidence: rationale.decision.confidence,
                emoji: this.getDecisionEmoji(rationale.decision.type)
            },
            
            // Card principale
            mainCard: {
                title: `🧠 Decisione: ${rationale.decision.chosen}`,
                subtitle: rationale.problem,
                confidence: `${rationale.decision.confidence}% confidenza`
            },
            
            // Fattori chiave (max 3 per UI)
            keyFactors: rationale.keyFactors.slice(0, 3).map(f => ({
                icon: this.getFactorIcon(f.factor),
                text: f.value,
                priority: f.priority
            })),
            
            // Spiegazione breve
            explanation: rationale.reasoning.whyChosen,
            
            // Modifiche applicate
            modifications: rationale.modifications.map(m => ({
                icon: '⚡',
                text: m
            })),
            
            // Alternative scartate (collapsible)
            alternatives: rationale.reasoning.alternativesConsidered.map(a => ({
                name: a.option,
                reason: a.whyNotChosen
            })),
            
            // Cosa monitorare
            monitoring: [
                ...rationale.monitoring.postWorkoutChecks.slice(0, 2),
                ...rationale.monitoring.nextDayChecks.slice(0, 1)
            ]
        };
    },
    
    formatRationaleForPrompt(rationale) {
        // Formato compatto per includere nel prompt AI
        return `
DECISIONE DEL REASONING ENGINE:
- Tipo sessione: ${rationale.decision.type}
- Volume modifier: ${rationale.decision.volumeModifier}
- Intensity modifier: ${rationale.decision.intensityModifier}
- Confidence: ${rationale.decision.confidence}%

FATTORI CONSIDERATI:
${rationale.keyFactors.map(f => `- [${f.priority.toUpperCase()}] ${f.value}`).join('\n')}

MODIFICHE RICHIESTE:
${rationale.modifications.length > 0 ? rationale.modifications.map(m => `- ${m}`).join('\n') : '- Nessuna modifica specifica'}

FOCUS AREAS:
${rationale.focusAreas ? rationale.focusAreas.join(', ') : 'Standard per fase'}

MOTIVO DECISIONE:
${rationale.reasoning.whyChosen}
`.trim();
    },
    
    // ===========================================
    // METODO PRINCIPALE: REASON
    // ===========================================
    
    async reason(athlete, sportData, weekContext, todayContext, requestType = 'generate_workout') {
        console.log(`🧠 RationaleEngine: Inizio ragionamento per ${athlete?.first_name || 'atleta'}...`);
        
        try {
            // Step 1: Costruisci snapshot del contesto
            const context = this.buildContextSnapshot(athlete, sportData, weekContext, todayContext);
            
            // Step 2: Identifica il problema
            const problem = this.identifyDecisionNeeded(context, requestType);
            console.log(`🧠 Problema: ${problem.statement}`);
            
            // Step 3: Genera opzioni
            const options = this.generateOptions(context, problem);
            console.log(`🧠 Opzioni generate: ${options.length}`);
            
            // Step 4: Valuta opzioni
            const evaluations = this.evaluateOptions(options, context, problem);
            
            // Step 5: Prendi decisione
            const rationale = this.makeDecision(evaluations, context, problem);
            console.log(`🧠 Decisione: ${rationale.decision.chosen} (${rationale.decision.confidence}% confidence)`);
            
            // Step 6: Formatta per diversi output
            return {
                rationale,
                forUI: this.formatRationaleForUI(rationale),
                forPrompt: this.formatRationaleForPrompt(rationale),
                
                // Modifiers per la generazione
                volumeModifier: rationale.decision.volumeModifier,
                intensityModifier: rationale.decision.intensityModifier,
                sessionType: rationale.decision.type,
                focusAreas: rationale.focusAreas,
                modifications: rationale.modifications
            };
            
        } catch (error) {
            console.error('🧠 RationaleEngine Error:', error);
            // Fallback sicuro
            return this.getDefaultRationale();
        }
    },
    
    // ===========================================
    // UTILITY METHODS
    // ===========================================
    
    calculateAge(birthDate) {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    },
    
    getRequestDescription(requestType) {
        const descriptions = {
            'generate_workout': 'generare l\'allenamento di oggi',
            'weekly_plan': 'pianificare la settimana',
            'adjust_session': 'modificare la sessione programmata',
            'emergency_change': 'gestire un cambio d\'emergenza'
        };
        return descriptions[requestType] || 'prendere una decisione';
    },
    
    getMovementsToAvoid(injuries) {
        if (!injuries || injuries.length === 0) return [];
        
        const movementMap = {
            'spalla': ['push overhead', 'dip', 'military press'],
            'ginocchio': ['squat profondo', 'lunge', 'salti'],
            'schiena': ['deadlift pesante', 'good morning', 'rowing'],
            'caviglia': ['salti', 'sprint', 'cambi di direzione'],
            'adduttore': ['squat sumo', 'lunge laterale', 'sprint'],
            'polpaccio': ['salti', 'corsa', 'calf raise']
        };
        
        const movements = new Set();
        injuries.forEach(inj => {
            if (inj.status === 'active') {
                const location = inj.location?.toLowerCase();
                Object.keys(movementMap).forEach(key => {
                    if (location?.includes(key)) {
                        movementMap[key].forEach(m => movements.add(m));
                    }
                });
            }
        });
        
        return Array.from(movements);
    },
    
    calculateVolumeModifier(context) {
        let modifier = 1.0;
        
        // Riduci per ACWR alto
        if (context.currentState.acwr > 1.3) modifier *= 0.8;
        if (context.currentState.acwr > 1.5) modifier *= 0.7;
        
        // Riduci per sonno scarso
        if (context.currentState.sleep?.hours < 6) modifier *= 0.85;
        
        // Riduci per readiness basso
        if (context.currentState.readiness < 5) modifier *= 0.75;
        
        // Riduci per compliance bassa (DELOAD)
        if (context.currentState.compliance < 60) modifier *= 0.5;
        
        // Riduci pre-match
        if (context.timing.daysToMatch === 2) modifier *= 0.7;
        if (context.timing.daysToMatch === 1) modifier *= 0.4;
        
        return Math.max(0.3, modifier);
    },
    
    calculateIntensityModifier(context) {
        let modifier = 1.0;
        
        // Mantieni intensità più alta del volume in genere
        if (context.currentState.acwr > 1.3) modifier *= 0.9;
        
        // Riduci per readiness molto basso
        if (context.currentState.readiness < 4) modifier *= 0.8;
        
        // Riduci pre-match per non affaticare
        if (context.timing.daysToMatch === 1) modifier *= 0.5;
        
        return Math.max(0.4, modifier);
    },
    
    suggestModifications(context, problem) {
        const mods = [];
        
        if (context.currentState.compliance < 60) {
            mods.push('Ridurre set da 4 a 2-3 per esercizio (DELOAD compliance)');
        }
        
        if (context.currentState.acwr > 1.3) {
            mods.push('Evitare esercizi ad alto impatto');
            mods.push('Preferire tempo controllato (3-0-3)');
        }
        
        if (context.timing.daysToMatch === 2) {
            mods.push('Focus su attivazione e qualità, non volume');
            mods.push('Niente esercizi che creano DOMS');
        }
        
        if (context.timing.daysFromMatch === 1) {
            mods.push('Solo mobilità e lavoro leggero di recupero');
            mods.push('Evitare qualsiasi carico eccentrico');
        }
        
        if (context.currentState.soreness?.some(s => s.severity > 5)) {
            mods.push('Evitare completamente zone con dolore >5/10');
        }
        
        return mods;
    },
    
    getAlternativeFocusAreas(context) {
        const allAreas = ['upper body push', 'upper body pull', 'core', 'lower body', 'conditioning', 'mobilità'];
        const avoid = new Set();
        
        // Escludi aree problematiche
        context.currentState.soreness?.forEach(s => {
            if (s.location?.toLowerCase().includes('spalla')) avoid.add('upper body push');
            if (s.location?.toLowerCase().includes('schiena')) {
                avoid.add('lower body');
                avoid.add('core');
            }
            if (s.location?.toLowerCase().includes('ginocchio') || 
                s.location?.toLowerCase().includes('adduttore') ||
                s.location?.toLowerCase().includes('polpaccio')) {
                avoid.add('lower body');
                avoid.add('conditioning');
            }
        });
        
        return allAreas.filter(a => !avoid.has(a));
    },
    
    estimateSessionTime(option) {
        const baseTimes = {
            'standard': 60,
            'modified': 50,
            'alternative_focus': 45,
            'active_recovery': 30,
            'rest': 0
        };
        return baseTimes[option.type] || 60;
    },
    
    summarizeContext(context) {
        const parts = [];
        
        parts.push(`${context.athlete.name}, ${context.athlete.sport}`);
        parts.push(`${context.timing.dayOfWeek}`);
        
        if (context.timing.daysToMatch !== null && context.timing.daysToMatch <= 5) {
            parts.push(`MD-${context.timing.daysToMatch}`);
        }
        if (context.timing.daysFromMatch !== null && context.timing.daysFromMatch <= 3) {
            parts.push(`MD+${context.timing.daysFromMatch}`);
        }
        
        parts.push(`Readiness: ${context.currentState.readiness}/10`);
        
        return parts.join(' | ');
    },
    
    getDecisionEmoji(type) {
        const emojis = {
            'standard': '💪',
            'modified': '⚡',
            'alternative_focus': '🔄',
            'active_recovery': '🌿',
            'rest': '😴'
        };
        return emojis[type] || '🧠';
    },
    
    getFactorIcon(factor) {
        const icons = {
            'MATCH_DAY': '🏆',
            'MD_MINUS_1': '⚡',
            'MD_MINUS_2': '📅',
            'POST_MATCH': '🔄',
            'LOW_READINESS': '😴',
            'SLEEP_DEBT': '🌙',
            'HIGH_ACWR': '🚨',
            'ELEVATED_ACWR': '⚠️',
            'LOW_COMPLIANCE': '📉',
            'ACTIVE_SORENESS': '🩹',
            'ACTIVE_INJURY': '🚑',
            'EXTERNAL_LOAD': '👥'
        };
        return icons[factor] || '📌';
    },
    
    getDefaultRationale() {
        return {
            rationale: {
                decision: { chosen: 'Sessione standard', type: 'standard', confidence: 70, volumeModifier: 1.0, intensityModifier: 1.0 },
                reasoning: { whyChosen: 'Dati insufficienti per analisi avanzata, procedo con sessione standard.' }
            },
            forUI: {
                summary: { decision: 'Sessione standard', confidence: 70, emoji: '💪' }
            },
            forPrompt: 'DECISIONE: Sessione standard (dati insufficienti per analisi avanzata)',
            volumeModifier: 1.0,
            intensityModifier: 1.0,
            sessionType: 'standard',
            modifications: []
        };
    }
};

// Export for browser
if (typeof window !== 'undefined') {
    window.RationaleEngine = RationaleEngine;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RationaleEngine;
}

console.log('🧠 RationaleEngine v1.0 loaded - Il cervello del coach AI');
