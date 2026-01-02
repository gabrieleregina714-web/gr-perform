/**
 * ═══════════════════════════════════════════════════════════════════════════════════
 * 🤖 ATLAS AUTONOMOUS TEAM v1.0 - Il Sistema che Lavora Come un Team
 * ═══════════════════════════════════════════════════════════════════════════════════
 * 
 * "COMPLETAMENTE AUTONOMO - Tutta la sapienza della scienza dello sport"
 * 
 * Questo modulo orchestra tutti i componenti ATLAS come un team coeso:
 * 
 * 🎯 WORKFLOW AUTONOMO:
 * 1. ANALISI → ATLASAthleteIntelligence analizza stato atleta
 * 2. DECISIONE → ATLASGuardian valuta se/come procedere
 * 3. PIANIFICAZIONE → ATLASMacroPlanner + ATLASWeekGenerator
 * 4. GENERAZIONE → ATLASComplete + Sport Modules
 * 5. VALIDAZIONE → ScientificWorkoutValidator
 * 6. ADATTAMENTO → ATLASAutoAdjuster + ATLASFeedback
 * 7. APPRENDIMENTO → ATLASMemory + ATLASProgression
 * 
 * PRINCIPI GUIDA:
 * - Zero intervento umano necessario per decisioni standard
 * - Fail-safe automatici per situazioni anomale
 * - Apprendimento continuo da ogni interazione
 * - Trasparenza totale nelle decisioni
 * ═══════════════════════════════════════════════════════════════════════════════════
 */

window.ATLASAutonomousTeam = {
    
    version: '1.0.0',
    codename: 'SKYNET-FIT',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧠 STATO SISTEMA
    // ═══════════════════════════════════════════════════════════════════════════
    
    systemState: {
        initialized: false,
        modulesLoaded: {},
        lastDecision: null,
        decisionHistory: [],
        learningEnabled: true
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔌 INIZIALIZZAZIONE
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Inizializza il team autonomo verificando tutti i moduli
     */
    initialize() {
        console.log('\n' + '═'.repeat(70));
        console.log('🤖 ATLAS AUTONOMOUS TEAM v1.0 - Inizializzazione');
        console.log('═'.repeat(70));
        
        // Verifica moduli disponibili
        const modules = {
            // Core
            core: typeof ATLAS !== 'undefined',
            complete: typeof ATLASComplete !== 'undefined',
            templates: typeof ATLASTemplates !== 'undefined',
            
            // Intelligence
            intelligence: typeof ATLASAthleteIntelligence !== 'undefined',
            guardian: typeof ATLASGuardian !== 'undefined',
            memory: typeof ATLASMemory !== 'undefined',
            feedback: typeof ATLASFeedback !== 'undefined',
            
            // Planning
            macroPlanner: typeof AtlasMacroPlanner !== 'undefined',
            weekGenerator: typeof AtlasWeekGenerator !== 'undefined',
            autoAdjuster: typeof AtlasAutoAdjuster !== 'undefined',
            progressTracker: typeof AtlasProgressTracker !== 'undefined',
            
            // Recovery & Science
            recovery: typeof ATLASRecovery !== 'undefined',
            periodization: typeof ATLASPeriodization !== 'undefined',
            progression: typeof ATLASProgression !== 'undefined',
            anamnesi: typeof ATLASAnamnesi !== 'undefined',
            structuralBalance: typeof window.AtlasStructuralBalance !== 'undefined',
            
            // Sport Specific
            sportsMaster: typeof ATLASSportsMaster !== 'undefined',
            boxing: typeof ATLASBoxing !== 'undefined',
            soccer: typeof ATLASSoccer !== 'undefined',
            basketball: typeof ATLASBasketball !== 'undefined',
            
            // Validation
            validator: typeof ScientificWorkoutValidator !== 'undefined',
            warmup: typeof WarmupIntelligence !== 'undefined'
        };
        
        this.systemState.modulesLoaded = modules;
        
        // Log stato moduli
        let loadedCount = 0;
        let missingCritical = [];
        
        const criticalModules = ['complete', 'validator', 'guardian', 'intelligence'];
        
        Object.entries(modules).forEach(([name, loaded]) => {
            const status = loaded ? '✅' : '❌';
            console.log(`   ${status} ${name}`);
            if (loaded) loadedCount++;
            if (!loaded && criticalModules.includes(name)) {
                missingCritical.push(name);
            }
        });
        
        console.log('─'.repeat(70));
        console.log(`📊 Moduli caricati: ${loadedCount}/${Object.keys(modules).length}`);
        
        if (missingCritical.length > 0) {
            console.warn(`⚠️ Moduli critici mancanti: ${missingCritical.join(', ')}`);
        }
        
        this.systemState.initialized = true;
        console.log('🤖 ATLAS Autonomous Team: ONLINE');
        console.log('═'.repeat(70) + '\n');
        
        return {
            success: true,
            modulesLoaded: loadedCount,
            missingCritical,
            ready: missingCritical.length === 0
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 DECISIONE AUTONOMA PRINCIPALE
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Decisione completamente autonoma su cosa fare per l'atleta
     * IL CUORE DEL SISTEMA - Prende TUTTE le decisioni
     */
    async makeAutonomousDecision(athleteId, context = {}) {
        console.log('\n🤖 AUTONOMOUS DECISION PROCESS');
        console.log('─'.repeat(50));
        
        const decision = {
            timestamp: new Date().toISOString(),
            athleteId,
            stages: [],
            finalDecision: null,
            confidence: 0,
            reasoning: []
        };
        
        try {
            // ══════════════════════════════════════════════════════════════════
            // STAGE 1: RACCOLTA DATI COMPLETA
            // ══════════════════════════════════════════════════════════════════
            console.log('📊 Stage 1: Data Collection...');
            
            const athleteData = await this.collectAthleteData(athleteId, context);
            decision.stages.push({ name: 'data_collection', status: 'complete', data: athleteData });
            
            // ══════════════════════════════════════════════════════════════════
            // STAGE 2: ANALISI INTELLIGENZA 360°
            // ══════════════════════════════════════════════════════════════════
            console.log('🧠 Stage 2: Intelligence Analysis...');
            
            let intelligenceReport = null;
            if (this.systemState.modulesLoaded.intelligence) {
                intelligenceReport = ATLASAthleteIntelligence.getFullAthleteReport(
                    athleteId,
                    athleteData.workoutHistory || [],
                    athleteData.feedbackHistory || []
                );
            } else {
                intelligenceReport = this.fallbackIntelligenceAnalysis(athleteData);
            }
            decision.stages.push({ name: 'intelligence', status: 'complete', data: intelligenceReport });
            
            // ══════════════════════════════════════════════════════════════════
            // STAGE 3: GUARDIAN CHECK - Può allenarsi?
            // ══════════════════════════════════════════════════════════════════
            console.log('🛡️ Stage 3: Guardian Safety Check...');
            
            let guardianCheck = { canTrain: true, level: 'optimal' };
            if (this.systemState.modulesLoaded.guardian) {
                guardianCheck = ATLASGuardian.quickReadinessCheck({
                    cnsRecovery: intelligenceReport.cns?.currentLoad ? (100 - intelligenceReport.cns.currentLoad) : 80,
                    consecutiveTrainingDays: athleteData.consecutiveTrainingDays || 0,
                    lastSleepScore: athleteData.lastFeedback?.sleep || 7,
                    currentPain: this.extractMaxPain(athleteData.feedbackHistory)
                });
            }
            decision.stages.push({ name: 'guardian', status: 'complete', data: guardianCheck });
            
            // ══════════════════════════════════════════════════════════════════
            // STAGE 4: DECISIONE - Cosa fare oggi?
            // ══════════════════════════════════════════════════════════════════
            console.log('🎯 Stage 4: Decision Making...');
            
            const todayDecision = this.determineTodayAction(
                athleteData,
                intelligenceReport,
                guardianCheck,
                context
            );
            decision.stages.push({ name: 'decision', status: 'complete', data: todayDecision });
            
            // ══════════════════════════════════════════════════════════════════
            // STAGE 5: ESECUZIONE DECISIONE
            // ══════════════════════════════════════════════════════════════════
            console.log('⚡ Stage 5: Executing Decision...');
            
            const executionResult = await this.executeDecision(todayDecision, athleteData, context);
            decision.stages.push({ name: 'execution', status: 'complete', data: executionResult });
            
            // ══════════════════════════════════════════════════════════════════
            // STAGE 6: VALIDAZIONE FINALE
            // ══════════════════════════════════════════════════════════════════
            if (executionResult.workout) {
                console.log('✅ Stage 6: Final Validation...');
                
                const validation = this.validateFinalOutput(executionResult.workout, athleteData);
                decision.stages.push({ name: 'validation', status: 'complete', data: validation });
                executionResult.workout.finalValidation = validation;
            }
            
            // Prepara decisione finale
            decision.finalDecision = {
                action: todayDecision.action,
                workout: executionResult.workout,
                message: todayDecision.message,
                alternativeActions: todayDecision.alternatives || []
            };
            decision.confidence = this.calculateConfidence(decision.stages);
            decision.reasoning = this.buildReasoningChain(decision.stages);
            
            // Salva in history
            this.systemState.lastDecision = decision;
            this.systemState.decisionHistory.push({
                timestamp: decision.timestamp,
                athleteId,
                action: todayDecision.action,
                confidence: decision.confidence
            });
            
            // Log summary
            console.log('─'.repeat(50));
            console.log(`🤖 DECISIONE AUTONOMA COMPLETATA`);
            console.log(`   Action: ${todayDecision.action}`);
            console.log(`   Confidence: ${decision.confidence}%`);
            console.log(`   Message: ${todayDecision.message}`);
            console.log('─'.repeat(50) + '\n');
            
            return decision;
            
        } catch (error) {
            console.error('❌ Autonomous decision error:', error);
            decision.error = error.message;
            decision.finalDecision = {
                action: 'FALLBACK_SAFE',
                message: 'Errore nel sistema - generato workout sicuro di base',
                workout: this.generateSafeWorkout(context)
            };
            decision.confidence = 50;
            return decision;
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 DATA COLLECTION
    // ═══════════════════════════════════════════════════════════════════════════
    
    async collectAthleteData(athleteId, context) {
        const data = {
            athleteId,
            profile: context.profile || null,
            workoutHistory: context.workoutHistory || [],
            feedbackHistory: context.feedbackHistory || [],
            weeklySchedule: context.weeklySchedule || {},
            anamnesi: context.anamnesi || {},
            currentWeek: context.currentWeek || 1,
            phase: context.phase || 'accumulo',
            consecutiveTrainingDays: 0,
            lastFeedback: null
        };
        
        // Calcola giorni consecutivi
        if (data.workoutHistory.length > 0) {
            data.consecutiveTrainingDays = this.calculateConsecutiveDays(data.workoutHistory);
            data.lastWorkout = data.workoutHistory[0];
        }
        
        // Ultimo feedback
        if (data.feedbackHistory.length > 0) {
            data.lastFeedback = data.feedbackHistory[0];
        }
        
        // Prova a caricare da ATLASMemory se disponibile
        if (this.systemState.modulesLoaded.memory) {
            const memoryData = ATLASMemory.getAthleteProfile?.(athleteId);
            if (memoryData) {
                data.memoryProfile = memoryData;
            }
        }
        
        return data;
    },
    
    calculateConsecutiveDays(workoutHistory) {
        if (workoutHistory.length === 0) return 0;
        
        let count = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < Math.min(7, workoutHistory.length); i++) {
            const workoutDate = new Date(workoutHistory[i].completed_at || workoutHistory[i].created_at);
            workoutDate.setHours(0, 0, 0, 0);
            
            const daysDiff = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === i || daysDiff === i + 1) {
                count++;
            } else {
                break;
            }
        }
        
        return count;
    },
    
    extractMaxPain(feedbackHistory) {
        if (!feedbackHistory || feedbackHistory.length === 0) return 0;
        
        const recent = feedbackHistory.slice(0, 3);
        let maxPain = 0;
        
        recent.forEach(f => {
            const pain = f.pain_level || f.painLevel || 0;
            if (pain > maxPain) maxPain = pain;
        });
        
        return maxPain;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 DECISION LOGIC
    // ═══════════════════════════════════════════════════════════════════════════
    
    determineTodayAction(athleteData, intelligence, guardianCheck, context) {
        const decision = {
            action: 'GENERATE_WORKOUT',
            subAction: null,
            message: '',
            priority: 'normal',
            alternatives: [],
            reasoning: []
        };
        
        // ══════════════════════════════════════════════════════════════════
        // PRIORITY 1: SICUREZZA - Guardian dice STOP?
        // ══════════════════════════════════════════════════════════════════
        if (!guardianCheck.canTrain) {
            decision.action = 'REST_DAY';
            decision.message = guardianCheck.recommendation;
            decision.priority = 'critical';
            decision.reasoning.push('Guardian: Training non sicuro');
            decision.alternatives.push({ action: 'MOBILITY_SESSION', message: 'Sessione mobility leggera' });
            return decision;
        }
        
        if (guardianCheck.level === 'caution') {
            decision.subAction = 'LIGHT_WORKOUT';
            decision.message = 'Solo lavoro leggero consigliato';
            decision.reasoning.push('Guardian: Caution level');
        }
        
        // ══════════════════════════════════════════════════════════════════
        // PRIORITY 2: INJURY RISK - Rischio infortunio alto?
        // ══════════════════════════════════════════════════════════════════
        if (intelligence.injuryRisk?.level === 'high') {
            decision.action = 'RECOVERY_FOCUS';
            decision.message = 'Rischio infortunio alto - focus su recovery';
            decision.priority = 'high';
            decision.reasoning.push(`Injury risk: ${intelligence.injuryRisk.score}%`);
            decision.alternatives.push({ action: 'DELOAD_WORKOUT', message: 'Workout deload' });
            return decision;
        }
        
        // ══════════════════════════════════════════════════════════════════
        // PRIORITY 3: SCHEDULE - Cosa c'è nel calendario?
        // ══════════════════════════════════════════════════════════════════
        const scheduleDecision = this.analyzeScheduleContext(athleteData.weeklySchedule, context.targetDay);
        
        if (scheduleDecision.override) {
            decision.action = scheduleDecision.action;
            decision.message = scheduleDecision.message;
            decision.reasoning.push(`Schedule: ${scheduleDecision.reason}`);
            if (scheduleDecision.action !== 'GENERATE_WORKOUT') {
                return decision;
            }
        }
        
        // ══════════════════════════════════════════════════════════════════
        // PRIORITY 4: DELOAD - Serve deload?
        // ══════════════════════════════════════════════════════════════════
        const weekNumber = athleteData.currentWeek || context.currentWeek || 1;
        const needsDeload = this.checkDeloadNeed(athleteData, intelligence, weekNumber);
        
        if (needsDeload.needed) {
            decision.subAction = 'DELOAD';
            decision.message = needsDeload.message;
            decision.reasoning.push(needsDeload.reason);
        }
        
        // ══════════════════════════════════════════════════════════════════
        // PRIORITY 5: READINESS-BASED ADJUSTMENT
        // ══════════════════════════════════════════════════════════════════
        if (intelligence.readiness) {
            if (intelligence.readiness.score < 50) {
                decision.subAction = 'REDUCED_VOLUME';
                decision.message = 'Readiness bassa - volume ridotto';
                decision.reasoning.push(`Readiness: ${intelligence.readiness.score}%`);
            } else if (intelligence.readiness.score >= 85) {
                decision.subAction = 'HIGH_INTENSITY_OK';
                decision.reasoning.push(`Readiness ottimale: ${intelligence.readiness.score}%`);
            }
        }
        
        // ══════════════════════════════════════════════════════════════════
        // DEFAULT: GENERA WORKOUT NORMALE
        // ══════════════════════════════════════════════════════════════════
        if (decision.action === 'GENERATE_WORKOUT' && !decision.message) {
            decision.message = 'Genera workout ottimale per oggi';
            decision.reasoning.push('Tutte le condizioni normali');
        }
        
        return decision;
    },
    
    analyzeScheduleContext(schedule, targetDay) {
        const result = { override: false, action: 'GENERATE_WORKOUT', message: '', reason: '' };
        
        if (!schedule || !targetDay) return result;
        
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayIndex = days.indexOf(targetDay.toLowerCase());
        
        if (dayIndex === -1) return result;
        
        const todayActivity = schedule[targetDay];
        const tomorrowDay = days[(dayIndex + 1) % 7];
        const tomorrowActivity = schedule[tomorrowDay];
        
        // Oggi è rest day?
        if (todayActivity === 'rest' || todayActivity === 'riposo') {
            result.override = true;
            result.action = 'REST_DAY';
            result.message = 'Giorno di riposo programmato';
            result.reason = 'rest day in schedule';
            return result;
        }
        
        // Oggi è match?
        if (['match', 'partita', 'gara', 'competition'].includes(todayActivity)) {
            result.override = true;
            result.action = 'MATCH_DAY';
            result.message = 'Giorno gara - nessun workout';
            result.reason = 'match day';
            return result;
        }
        
        // Domani gara → oggi solo attivazione
        if (['match', 'partita', 'gara', 'competition'].includes(tomorrowActivity)) {
            result.override = true;
            result.action = 'PRE_COMPETITION';
            result.message = 'Pre-gara: solo attivazione';
            result.reason = 'pre-competition day';
            return result;
        }
        
        return result;
    },
    
    checkDeloadNeed(athleteData, intelligence, weekNumber) {
        // Deload ogni 4 settimane
        if (weekNumber % 4 === 0) {
            return {
                needed: true,
                message: 'Settimana di deload programmata',
                reason: `Week ${weekNumber} - deload cycle`
            };
        }
        
        // Deload forzato se troppe settimane senza
        const weeksSinceDeload = athleteData.weeksSinceDeload || weekNumber % 4;
        if (weeksSinceDeload >= 6) {
            return {
                needed: true,
                message: 'Deload necessario - troppe settimane di carico',
                reason: `${weeksSinceDeload} weeks since last deload`
            };
        }
        
        // Deload se overtraining risk
        if (intelligence.predictions?.overtraining?.likely) {
            return {
                needed: true,
                message: 'Deload consigliato per prevenire overtraining',
                reason: 'overtraining prediction'
            };
        }
        
        return { needed: false };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ⚡ EXECUTION
    // ═══════════════════════════════════════════════════════════════════════════
    
    async executeDecision(decision, athleteData, context) {
        const result = {
            action: decision.action,
            workout: null,
            message: decision.message
        };
        
        switch (decision.action) {
            case 'REST_DAY':
                result.workout = this.generateRestDayPlan();
                break;
                
            case 'MOBILITY_SESSION':
                result.workout = this.generateMobilitySession();
                break;
                
            case 'RECOVERY_FOCUS':
                result.workout = this.generateRecoveryWorkout();
                break;
                
            case 'PRE_COMPETITION':
                result.workout = this.generateActivationSession(athleteData.profile);
                break;
                
            case 'MATCH_DAY':
                result.workout = null;
                result.message = 'Giorno gara - concentrati sulla performance!';
                break;
                
            case 'GENERATE_WORKOUT':
            default:
                result.workout = await this.generateOptimalWorkout(decision, athleteData, context);
                break;
        }
        
        // Applica sub-actions
        if (result.workout && decision.subAction) {
            result.workout = this.applySubAction(result.workout, decision.subAction);
        }
        
        return result;
    },
    
    async generateOptimalWorkout(decision, athleteData, context) {
        // Usa ATLASComplete se disponibile
        if (this.systemState.modulesLoaded.complete) {
            const profile = {
                ...athleteData.profile,
                sport: context.sport || athleteData.profile?.sport || 'fitness',
                goal: context.goal || 'ipertrofia',
                level: context.level || athleteData.profile?.experience_level || 'intermediate',
                currentWeek: athleteData.currentWeek,
                phase: athleteData.phase,
                anamnesi: athleteData.anamnesi,
                applyProgression: true,
                athleteId: athleteData.athleteId
            };
            
            try {
                const workout = ATLASComplete.generateWorkout(profile);
                
                // Applica Guardian se disponibile
                if (this.systemState.modulesLoaded.guardian) {
                    const guardianEval = ATLASGuardian.evaluateWorkoutPlan(
                        {
                            ...athleteData,
                            cnsRecovery: 100 - (athleteData.cnsLoad || 0),
                            muscleRecovery: athleteData.muscleRecovery || {}
                        },
                        workout,
                        { anamnesi: athleteData.anamnesi, schedule: athleteData.weeklySchedule }
                    );
                    
                    if (guardianEval.allModifications.length > 0) {
                        return ATLASGuardian.applyModifications(workout, guardianEval);
                    }
                    
                    workout.guardianApproved = guardianEval.approved;
                }
                
                return workout;
                
            } catch (error) {
                console.error('ATLASComplete error:', error);
                return this.generateSafeWorkout(context);
            }
        }
        
        // Fallback
        return this.generateSafeWorkout(context);
    },
    
    applySubAction(workout, subAction) {
        switch (subAction) {
            case 'DELOAD':
                return this.applyDeloadModifier(workout);
                
            case 'REDUCED_VOLUME':
                return this.applyVolumeReduction(workout, 0.7);
                
            case 'LIGHT_WORKOUT':
                return this.applyLightModifier(workout);
                
            case 'HIGH_INTENSITY_OK':
                // Nessuna modifica - intensità piena OK
                workout.intensityApproved = true;
                return workout;
                
            default:
                return workout;
        }
    },
    
    applyDeloadModifier(workout) {
        if (workout.exercises) {
            workout.exercises = workout.exercises.map(ex => ({
                ...ex,
                sets: Math.max(2, Math.round((parseInt(ex.sets) || 3) * 0.6)),
                deload: true
            }));
        }
        workout.isDeload = true;
        workout.name = (workout.name || 'Workout') + ' (Deload)';
        return workout;
    },
    
    applyVolumeReduction(workout, factor) {
        if (workout.exercises) {
            workout.exercises = workout.exercises.map(ex => ({
                ...ex,
                sets: Math.max(2, Math.round((parseInt(ex.sets) || 3) * factor)),
                volumeReduced: true
            }));
        }
        return workout;
    },
    
    applyLightModifier(workout) {
        if (workout.exercises) {
            workout.exercises = workout.exercises.filter(ex => {
                const name = (ex.name || '').toLowerCase();
                // Rimuovi esercizi pesanti
                return !/deadlift|squat heavy|max|1rm|heavy/i.test(name);
            }).map(ex => ({
                ...ex,
                sets: Math.max(2, Math.round((parseInt(ex.sets) || 3) * 0.7)),
                lightSession: true
            }));
        }
        workout.isLight = true;
        return workout;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏋️ WORKOUT GENERATORS
    // ═══════════════════════════════════════════════════════════════════════════
    
    generateRestDayPlan() {
        return {
            name: 'Rest Day - Active Recovery',
            type: 'rest',
            exercises: [
                { name: 'Light Walking', duration: '20-30 min', type: 'cardio', notes: 'Facile, conversazionale' },
                { name: 'Foam Rolling', duration: '10 min', type: 'recovery', notes: 'Focus aree tese' },
                { name: 'Light Stretching', duration: '10 min', type: 'flexibility' }
            ],
            notes: 'Oggi focus su recupero. Idratazione, sonno, alimentazione.',
            isRestDay: true
        };
    },
    
    generateMobilitySession() {
        return {
            name: 'Mobility & Flexibility',
            type: 'mobility',
            exercises: [
                { name: 'Cat-Cow', sets: 2, reps: '10 each', type: 'mobility' },
                { name: 'World\'s Greatest Stretch', sets: 2, reps: '5 each side', type: 'mobility' },
                { name: '90/90 Hip Switch', sets: 2, reps: '8 each side', type: 'mobility' },
                { name: 'Thread the Needle', sets: 2, reps: '8 each side', type: 'mobility' },
                { name: 'Deep Squat Hold', sets: 3, reps: '30s', type: 'mobility' },
                { name: 'Wall Slides', sets: 2, reps: '10', type: 'mobility' },
                { name: 'Bretzel Stretch', sets: 2, reps: '30s each side', type: 'stretching' }
            ]
        };
    },
    
    generateRecoveryWorkout() {
        return {
            name: 'Recovery Focus Session',
            type: 'recovery',
            exercises: [
                { name: 'Foam Rolling - Full Body', duration: '8 min', type: 'recovery' },
                { name: 'Light Cycling/Walking', duration: '10 min', type: 'warmup' },
                { name: 'Band Pull-Aparts', sets: 2, reps: '15', type: 'activation' },
                { name: 'Goblet Squat (light)', sets: 2, reps: '10', type: 'activation' },
                { name: 'Hip Flexor Stretch', sets: 2, reps: '45s each', type: 'stretching' },
                { name: 'Thoracic Extension', sets: 2, reps: '10', type: 'mobility' },
                { name: 'Breathing/Relaxation', duration: '5 min', type: 'recovery' }
            ],
            notes: 'Sessione leggera per promuovere il recupero senza aggiungere stress'
        };
    },
    
    generateActivationSession(profile) {
        return {
            name: 'Pre-Competition Activation',
            type: 'activation',
            exercises: [
                { name: 'Light Jogging', duration: '5 min', type: 'warmup' },
                { name: 'Dynamic Stretches', duration: '5 min', type: 'warmup' },
                { name: 'Sport-Specific Drills (50% effort)', sets: 3, reps: '30s', type: 'activation' },
                { name: 'Explosive Primers (3-5 reps, no fatigue)', sets: 2, reps: '3-5', type: 'activation' },
                { name: 'Mental Rehearsal', duration: '5 min', type: 'mental' }
            ],
            notes: 'Attivazione SENZA fatica. Domani è il giorno importante!'
        };
    },
    
    generateSafeWorkout(context) {
        return {
            name: 'Safe Fallback Workout',
            type: 'general',
            exercises: [
                { name: 'Warm-Up Cardio', duration: '5 min', type: 'warmup' },
                { name: 'Bodyweight Squats', sets: 3, reps: '12', type: 'strength' },
                { name: 'Push-Ups', sets: 3, reps: '10-15', type: 'strength' },
                { name: 'Dumbbell Rows', sets: 3, reps: '10 each', type: 'strength' },
                { name: 'Plank', sets: 3, reps: '30s', type: 'core' },
                { name: 'Lunges', sets: 2, reps: '10 each', type: 'strength' },
                { name: 'Stretching', duration: '5 min', type: 'cooldown' }
            ],
            notes: 'Workout sicuro generato come fallback',
            isFallback: true
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ✅ VALIDATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    validateFinalOutput(workout, athleteData) {
        const validation = {
            passed: true,
            checks: [],
            score: 0
        };
        
        // Check 1: Ha esercizi?
        const hasExercises = workout.exercises && workout.exercises.length > 0;
        validation.checks.push({
            name: 'has_exercises',
            passed: hasExercises,
            message: hasExercises ? 'Workout ha esercizi' : 'ERRORE: Nessun esercizio'
        });
        
        // Check 2: Usa validator scientifico se disponibile
        if (this.systemState.modulesLoaded.validator && hasExercises) {
            const scientificValidation = ScientificWorkoutValidator.validate(workout, athleteData.profile || {});
            validation.scientificScore = scientificValidation.score;
            validation.scientificGrade = scientificValidation.grade?.letter;
            validation.checks.push({
                name: 'scientific_validation',
                passed: scientificValidation.score >= 60,
                message: `Score: ${scientificValidation.score}% (${scientificValidation.grade?.letter})`
            });
        }
        
        // Check 3: Volume ragionevole?
        if (hasExercises) {
            const totalSets = workout.exercises.reduce((sum, ex) => sum + (parseInt(ex.sets) || 0), 0);
            const volumeOK = totalSets >= 6 && totalSets <= 35;
            validation.checks.push({
                name: 'volume_check',
                passed: volumeOK,
                message: volumeOK ? `Volume OK (${totalSets} set)` : `Volume anomalo: ${totalSets} set`
            });
        }
        
        // Calcola pass rate
        const passedChecks = validation.checks.filter(c => c.passed).length;
        validation.passed = passedChecks === validation.checks.length;
        validation.score = Math.round((passedChecks / validation.checks.length) * 100);
        
        return validation;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧮 HELPERS
    // ═══════════════════════════════════════════════════════════════════════════
    
    fallbackIntelligenceAnalysis(athleteData) {
        return {
            readiness: {
                score: 75,
                level: 'good',
                message: 'Analisi semplificata'
            },
            injuryRisk: {
                level: 'low',
                score: 20
            },
            cns: {
                status: 'moderate'
            },
            predictions: {}
        };
    },
    
    calculateConfidence(stages) {
        let confidence = 100;
        
        stages.forEach(stage => {
            if (stage.status !== 'complete') confidence -= 15;
            if (stage.data?.error) confidence -= 20;
        });
        
        // Guardian approval boost
        const guardian = stages.find(s => s.name === 'guardian');
        if (guardian?.data?.level === 'optimal') confidence += 5;
        if (guardian?.data?.level === 'caution') confidence -= 10;
        if (!guardian?.data?.canTrain) confidence -= 20;
        
        return Math.max(30, Math.min(100, confidence));
    },
    
    buildReasoningChain(stages) {
        const reasoning = [];
        
        stages.forEach(stage => {
            if (stage.data?.reasoning) {
                reasoning.push(...stage.data.reasoning);
            }
            if (stage.data?.message) {
                reasoning.push(stage.data.message);
            }
        });
        
        return reasoning;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 SYSTEM STATUS
    // ═══════════════════════════════════════════════════════════════════════════
    
    getSystemStatus() {
        return {
            version: this.version,
            initialized: this.systemState.initialized,
            modulesLoaded: Object.entries(this.systemState.modulesLoaded)
                .filter(([_, loaded]) => loaded)
                .map(([name, _]) => name),
            modulesMissing: Object.entries(this.systemState.modulesLoaded)
                .filter(([_, loaded]) => !loaded)
                .map(([name, _]) => name),
            lastDecision: this.systemState.lastDecision?.timestamp,
            decisionsCount: this.systemState.decisionHistory.length
        };
    }
};

// Auto-initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Delay to ensure other modules are loaded
        setTimeout(() => {
            ATLASAutonomousTeam.initialize();
        }, 100);
    });
}

console.log('🤖 ATLAS Autonomous Team v1.0 loaded - Ready for autonomous operation');
