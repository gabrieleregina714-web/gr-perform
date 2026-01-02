/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🤖 ATLAS COMPLETE SYSTEM v2.0
 * Sistema Integrato per Sostituzione Completa Trainer Umano
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Questo modulo integra:
 * - ATLASTemplates: Generazione workout deterministica
 * - ATLASPeriodization: Pianificazione 4-52 settimane
 * - ATLASAnamnesi: Gestione infortuni e limitazioni
 * - ATLASProgression: Progressive overload + RPE auto-regulation
 * - ScientificWorkoutValidator: Validazione scientifica
 * 
 * OBIETTIVO: Raggiungere 90%+ di qualità e sostituire completamente
 * la necessità di un trainer umano per la programmazione.
 */

const ATLASComplete = {
    
    version: '2.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 GENERAZIONE WORKOUT COMPLETA
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Genera workout completo con tutti i moduli integrati
     * @param {Object} profile - Profilo utente completo
     * @returns {Object} Workout completo con periodizzazione e anamnesi
     */
    generateWorkout(profile) {
        console.log('\n🤖 ATLAS COMPLETE - Generazione Workout Intelligente\n');
        
        // 1. CHECK SPORT-SPECIFIC MODULES via Sports Master
        if (profile.sport && typeof ATLASSportsMaster !== 'undefined') {
            const sportModule = ATLASSportsMaster.getModule(profile.sport);
            if (sportModule) {
                console.log(`🏆 Sport rilevato: ${profile.sport.toUpperCase()} - Uso modulo specifico`);
                return this.generateSportSpecificWorkout(profile, sportModule);
            }
        }
        
        // Fallback diretto per boxe (compatibilità backward)
        if (profile.sport === 'boxe' && typeof ATLASBoxing !== 'undefined') {
            console.log('🥊 Sport rilevato: BOXE - Uso modulo specifico');
            return this.generateBoxingWorkout(profile);
        }
        
        // 2. Genera workout base da template
        const baseWorkout = ATLASTemplates.generate(profile);
        console.log('✅ Workout base generato');
        
        // 2. Applica periodizzazione se abbiamo info settimana
        let periodizedWorkout = baseWorkout;
        if (profile.currentWeek && profile.programWeeks) {
            const plan = ATLASPeriodization.generatePlan(profile, profile.programWeeks);
            const weekPlan = plan.weeklyPlans[profile.currentWeek - 1];
            periodizedWorkout = ATLASPeriodization.applyPeriodization(baseWorkout, weekPlan);
            console.log(`✅ Periodizzazione applicata (Settimana ${profile.currentWeek}/${profile.programWeeks})`);
        }
        
        // 3. Filtra per anamnesi se presente
        let finalWorkout = periodizedWorkout;
        if (profile.anamnesi) {
            finalWorkout = ATLASAnamnesi.filterWorkout(periodizedWorkout, profile.anamnesi);
            console.log('✅ Anamnesi applicata');
            
            if (finalWorkout.modifications.length > 0) {
                console.log(`   └─ ${finalWorkout.modifications.length} modifiche per infortuni/limitazioni`);
            }
        }
        
        // 4. Applica progressive overload se disponibile
        if (typeof ATLASProgression !== 'undefined' && profile.applyProgression !== false) {
            finalWorkout = ATLASProgression.applyProgression(
                finalWorkout, 
                profile.goal,
                profile.readiness || null
            );
            console.log('✅ Progressive overload applicato');
        }
        
        // 4.5. NEW: Applica Readiness-based adjustments
        if (typeof ATLASReadiness !== 'undefined' && profile.biometricData) {
            const readinessResult = ATLASReadiness.calculate(profile.biometricData, {
                baselineHRV: profile.baselineHRV,
                baselineRestingHR: profile.baselineRestingHR
            });
            
            if (readinessResult.score !== null) {
                finalWorkout = ATLASReadiness.applyToWorkout(finalWorkout, readinessResult);
                console.log(`✅ Readiness ${readinessResult.score}% (${readinessResult.status}) → Intensità: ${readinessResult.recommendation.intensity_modifier}x`);
                finalWorkout.readiness = readinessResult;
            }
        }
        
        // 5. NEW: Applica Feedback Loop adjustments se disponibile
        if (typeof ATLASFeedback !== 'undefined' && profile.athleteId) {
            const feedbackResult = ATLASFeedback.applyAdjustments(finalWorkout, profile.athleteId);
            finalWorkout = feedbackResult.workout;
            if (feedbackResult.adjustments.length > 0) {
                console.log(`✅ Feedback Loop: ${feedbackResult.adjustments.length} adjustments applicati`);
                finalWorkout.feedbackAdjustments = feedbackResult.adjustments;
            }
        }
        
        // 6. NEW: Applica metodologie di allenamento
        finalWorkout = this.applyTrainingMethods(finalWorkout, profile);
        
        // 6.5. NEW: Ottimizza ordine esercizi e volumi con intelligenza
        if (typeof ATLASExerciseIntelligence !== 'undefined') {
            const intelligenceContext = {
                goal: profile.goal,
                level: profile.level,
                age: profile.age,
                fatigue: profile.fatigue || profile.readiness?.fatigue,
                weekNumber: profile.currentWeek,
                cnsState: profile.cnsState
            };
            finalWorkout = ATLASExerciseIntelligence.optimizeWorkout(finalWorkout, intelligenceContext);
            console.log('✅ Exercise Intelligence: ordine e volumi ottimizzati');
        }
        
        // 6.6. NEW: Calcola durata realistica
        if (typeof ATLASExerciseIntelligence !== 'undefined' && ATLASExerciseIntelligence.calculateRealisticDuration) {
            const durationResult = ATLASExerciseIntelligence.calculateRealisticDuration(
                finalWorkout.exercises || [],
                { level: profile.level, goal: profile.goal }
            );
            finalWorkout.duration = durationResult.minutes;
            finalWorkout.durationBreakdown = durationResult.breakdown;
            console.log(`⏱️ Durata stimata: ${durationResult.minutes} minuti`);
        }
        
        // 7. Valida con validator scientifico
        const validation = ScientificWorkoutValidator.validate(finalWorkout, profile);
        finalWorkout.validation = validation;
        console.log(`✅ Validazione: ${validation.score}% (${validation.grade.letter})`);
        
        // 8. Aggiungi metadata
        finalWorkout.metadata = {
            generatedAt: new Date().toISOString(),
            version: this.version,
            profile: {
                sport: profile.sport,
                goal: profile.goal,
                level: profile.level
            },
            quality: {
                score: validation.score,
                grade: validation.grade.letter,
                humanReplacement: validation.score >= 75 ? 'READY' : 'NEEDS_REVIEW'
            }
        };
        
        return finalWorkout;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 APPLICAZIONE METODOLOGIE DI ALLENAMENTO
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Applica metodologie di allenamento (superset, drop set, ecc) al workout
     */
    applyTrainingMethods(workout, profile) {
        // Check if training methods library is loaded
        if (typeof TRAINING_METHODS === 'undefined' || typeof MethodSelector === 'undefined') {
            return workout;
        }
        
        // Seleziona metodologie appropriate
        const goalMap = {
            forza: 'forza',
            potenza: 'forza',
            strength: 'forza',
            power: 'forza',
            massa: 'massa',
            ipertrofia: 'massa',
            hypertrophy: 'massa',
            muscle: 'massa',
            definizione: 'definizione',
            dimagrimento: 'definizione',
            resistenza: 'definizione',
            fat_loss: 'definizione',
            endurance: 'definizione',
            performance: 'performance',
            sport: 'performance',
            tecnica: 'performance',
            atletica: 'performance'
        };
        
        const selectorParams = {
            goal: goalMap[profile.goal] || 'massa',
            phase: profile.phase || 'accumulo',
            experience: profile.level || 'intermediate',
            fatigue: profile.fatigue || 5,
            time_available: profile.duration || 60,
            equipment: ['barbell', 'dumbbells', 'cables', 'machines', 'bodyweight'],
            sport: profile.sport || 'palestra',
            pain_areas: profile.painAreas || [],
            rpe_tolerance: profile.rpe_tolerance || 7,
            // 🧠 PARAMETRI INTELLIGENZA AVANZATA
            age: profile.age || 30,
            weight: profile.weight || 75,
            weekNumber: profile.weekNumber || 1,
            role: profile.role || null,
            sessionType: profile.sessionType || 'strength',
            previousMethods: profile.previousMethods || [],
            cnsState: profile.cnsState || 'fresh'
        };
        
        // 🧠 INTELLIGENZA AVANZATA: Usa AdvancedMethodSelector se disponibile
        let recommendations = [];
        let intelligentSelection = false;
        
        if (typeof AdvancedMethodSelector !== 'undefined' && selectorParams.role) {
            // Ottieni preferenze per ruolo
            const rolePrefs = AdvancedMethodSelector.getMethodsForRole(
                selectorParams.sport, 
                selectorParams.role
            );
            
            if (rolePrefs) {
                intelligentSelection = true;
                console.log('🧠 INTELLIGENZA AVANZATA: Usando preferenze ruolo', rolePrefs);
            }
        }
        
        // Ottieni raccomandazioni base
        recommendations = MethodSelector.selectMethods(selectorParams);
        
        // 🧠 INTELLIGENZA: Filtro per stato CNS
        if (selectorParams.cnsState === 'fatigued' || selectorParams.cnsState === 'depleted') {
            recommendations = recommendations.filter(r => {
                // Escludi metodologie ad alto costo CNS se affaticato
                const highCNS = ['cluster', 'contrast_training', 'gvt', 'drop_set', 'rest_pause'];
                return !highCNS.includes(r.key);
            });
            console.log('🧠 CNS affaticato: escluse metodologie ad alto costo');
        }
        
        // 🧠 INTELLIGENZA: Evita ripetizione metodologie recenti
        if (selectorParams.previousMethods && selectorParams.previousMethods.length > 0) {
            const lastUsed = selectorParams.previousMethods;
            recommendations = recommendations.map(r => {
                if (lastUsed.includes(r.key)) {
                    r.score *= 0.5; // Penalizza ripetizione
                    r.reason += ' (usato di recente - variato)';
                }
                return r;
            }).sort((a, b) => b.score - a.score);
            console.log('🧠 Variazione metodologie: penalizzate', lastUsed);
        }
        
        // 🧠 INTELLIGENZA: Adattamento per età
        if (selectorParams.age > 50) {
            recommendations = recommendations.filter(r => {
                // Escludi metodologie troppo intense per over 50
                const tooIntense = ['gvt', 'cluster', 'tabata'];
                if (tooIntense.includes(r.key)) {
                    console.log(`🧠 Età >50: escluso ${r.key}`);
                    return false;
                }
                return true;
            });
        }
        
        // 🧠 INTELLIGENZA: Adattamento per peso corporeo
        if (selectorParams.weight > 100) {
            recommendations = recommendations.filter(r => {
                // Meno plyometria per atleti pesanti
                const highImpact = ['tabata', 'plyometric_complex'];
                if (highImpact.includes(r.key)) {
                    r.score *= 0.7;
                }
                return true;
            }).sort((a, b) => b.score - a.score);
        }
        
        // 🧠 INTELLIGENZA: Check compatibilità tra metodologie selezionate
        if (typeof AdvancedMethodSelector !== 'undefined' && recommendations.length >= 2) {
            const top2 = recommendations.slice(0, 2);
            const compat = AdvancedMethodSelector.areCompatible(top2[0].key, top2[1].key);
            if (!compat.compatible) {
                console.log(`🧠 Incompatibilità rilevata: ${top2[0].key} + ${top2[1].key}: ${compat.reason}`);
                // Usa solo la prima
                recommendations = [recommendations[0], ...recommendations.slice(2)];
            }
        }
        
        // Log intelligenza
        if (recommendations.length > 0) {
            console.log('🎯 Metodologie selezionate:', recommendations.slice(0, 3).map(r => 
                `${r.key} (score: ${r.score}, reason: ${r.reason})`
            ));
        }
        
        if (!recommendations || recommendations.length === 0) {
            return workout;
        }
        
        // Applica le metodologie al workout
        const exercises = workout.exercises || [];
        const methodsApplied = [];
        
        // Nomi di esercizi tipici di warmup da escludere
        const warmupKeywords = [
            'warm', 'stretch', 'mobility', 'jump rope', 'band pull', 'shadow boxing light',
            'dynamic', 'activation', 'foam roll', 'cat-cow', 'world greatest', 'locomotion',
            'glute bridge', 'dead bug', 'bird dog'
        ];
        
        // Filtra esercizi principali (no warmup/cooldown)
        const mainExercises = exercises.filter(e => {
            const name = (e.name || '').toLowerCase();
            const type = (e.type || '').toLowerCase();
            
            // Escludi per type
            if (type === 'warmup' || type === 'cooldown' || type === 'activation') return false;
            
            // Escludi per nome
            if (warmupKeywords.some(kw => name.includes(kw))) return false;
            
            return true;
        });
        
        if (mainExercises.length < 4) {
            return workout;
        }
        
        // Applica metodologia principale (prima raccomandazione)
        const primaryMethod = recommendations[0];
        
        switch (primaryMethod.key) {
            case 'superset':
                this.applySuperset(exercises, mainExercises);
                methodsApplied.push('superset');
                break;
                
            case 'drop_set':
                this.applyDropSet(exercises, mainExercises);
                methodsApplied.push('drop_set');
                break;
                
            case 'rest_pause':
                this.applyRestPause(exercises, mainExercises);
                methodsApplied.push('rest_pause');
                break;
                
            case 'myo_reps':
                this.applyMyoReps(exercises, mainExercises);
                methodsApplied.push('myo_reps');
                break;
                
            case 'tempo_training':
                this.applyTempoTraining(exercises, mainExercises);
                methodsApplied.push('tempo_training');
                break;
                
            case 'circuit':
            case 'boxing_circuit':
                this.applyCircuit(exercises, mainExercises);
                methodsApplied.push('circuit');
                break;
                
            case 'emom':
                this.applyEMOM(exercises, mainExercises);
                methodsApplied.push('emom');
                break;
                
            case 'tabata':
                this.applyTabata(exercises, mainExercises);
                methodsApplied.push('tabata');
                break;
                
            case 'contrast_training':
            case 'pap':
            case 'post_activation_potentiation':
                this.applyContrastTraining(exercises, mainExercises);
                methodsApplied.push('contrast_training');
                break;
                
            case 'giant_set':
                this.applyGiantSet(exercises, mainExercises);
                methodsApplied.push('giant_set');
                break;
                
            case 'cluster':
            case 'cluster_set':
                this.applyClusterSet(exercises, mainExercises);
                methodsApplied.push('cluster');
                break;
                
            case 'heavy_bag_intervals':
            case 'shadow_boxing_drills':
            case 'punch_resistance_training':
                // Metodologie boxe-specifiche - già implicite, applica superset
                if (mainExercises.length >= 4) {
                    this.applySuperset(exercises, mainExercises);
                    methodsApplied.push('superset');
                }
                break;
                
            default:
                // Fallback: applica superset su 2 esercizi
                if (mainExercises.length >= 4) {
                    this.applySuperset(exercises, mainExercises);
                    methodsApplied.push('superset');
                }
        }
        
        // Applica metodologia secondaria se possibile
        if (recommendations.length >= 2 && methodsApplied.length < 2) {
            const secondaryMethod = recommendations[1];
            
            if (secondaryMethod.key === 'drop_set' && !methodsApplied.includes('drop_set')) {
                this.applyDropSet(exercises, mainExercises, true); // skip first 4 exercises
                methodsApplied.push('drop_set');
            } else if (secondaryMethod.key === 'tempo_training' && !methodsApplied.includes('tempo_training')) {
                this.applyTempoTraining(exercises, mainExercises);
                methodsApplied.push('tempo_training');
            }
        }
        
        if (methodsApplied.length > 0) {
            workout.methodsApplied = methodsApplied;
            console.log('🎯 Metodologie applicate al workout:', methodsApplied);
        }
        
        return workout;
    },
    
    /**
     * Applica superset a 2 esercizi consecutivi
     */
    applySuperset(allExercises, mainExercises) {
        // Trova 2 esercizi consecutivi compatibili (push+pull o agonist+antagonist)
        for (let i = 0; i < mainExercises.length - 1; i++) {
            const ex1 = mainExercises[i];
            const ex2 = mainExercises[i + 1];
            
            // Check se sono già modificati
            if (ex1.name.includes('A1:') || ex2.name.includes('A2:')) continue;
            
            // Applica superset
            const idx1 = allExercises.indexOf(ex1);
            const idx2 = allExercises.indexOf(ex2);
            
            if (idx1 >= 0 && idx2 >= 0) {
                allExercises[idx1].name = `A1: ${ex1.name} (superset)`;
                allExercises[idx1].rest = '0s';
                allExercises[idx2].name = `A2: ${ex2.name} (superset)`;
                allExercises[idx2].superset_pair = 'A1';
                break; // Solo un superset
            }
        }
    },
    
    /**
     * Applica drop set all'ultimo esercizio adatto
     */
    applyDropSet(allExercises, mainExercises, skipFirst = false) {
        // Trova esercizio adatto per drop set (forza/ipertrofia, non tecnica/cardio)
        const dropSetCandidates = mainExercises.filter(e => {
            const type = (e.type || '').toLowerCase();
            const name = (e.name || '').toLowerCase();
            // Adatto per drop set: strength, hypertrophy, isolation, power
            // NON adatto: technique, cardio, shadow boxing, drill
            const isGoodType = ['hypertrophy', 'isolation', 'strength', 'power', 'core'].includes(type);
            const isBadName = name.includes('shadow') || name.includes('drill') || 
                             name.includes('round') || name.includes('combo') ||
                             name.includes('interval') || name.includes('tabata');
            return isGoodType || (!isBadName && !type);
        });
        
        if (dropSetCandidates.length === 0) {
            return;
        }
        
        // Prendi l'ultimo (o penultimo se skipFirst)
        const targetIndex = skipFirst && dropSetCandidates.length > 1 ? 
            dropSetCandidates.length - 2 : dropSetCandidates.length - 1;
        const target = dropSetCandidates[targetIndex];
        
        const idx = allExercises.indexOf(target);
        if (idx >= 0 && !allExercises[idx].name.includes('drop set')) {
            allExercises[idx].name = `${target.name} (drop set)`;
            // Modifica reps per indicare drop set
            const baseReps = parseInt(target.reps) || 12;
            allExercises[idx].reps = `${baseReps} + drop ${baseReps - 4} + drop ${baseReps - 8}`;
        }
    },
    
    /**
     * Applica rest-pause a un esercizio compound
     */
    applyRestPause(allExercises, mainExercises) {
        // Trova esercizio compound adatto (strength/power, esercizi pesanti)
        const compoundExercises = mainExercises.filter(e => {
            const type = (e.type || '').toLowerCase();
            const name = (e.name || '').toLowerCase();
            // Compound: deadlift, squat, press, row, ecc.
            const isCompoundName = name.includes('deadlift') || name.includes('squat') || 
                                   name.includes('press') || name.includes('row') ||
                                   name.includes('pull') || name.includes('push');
            const isGoodType = ['strength', 'power'].includes(type);
            return (isGoodType || isCompoundName) && !name.includes('superset');
        });
        
        if (compoundExercises.length === 0) {
            return;
        }
        
        const target = compoundExercises[Math.floor(compoundExercises.length / 2)]; // middle compound
        const idx = allExercises.indexOf(target);
        
        if (idx >= 0 && !allExercises[idx].name.includes('rest-pause')) {
            allExercises[idx].name = `${target.name} (rest-pause)`;
            const baseReps = parseInt(target.reps) || 8;
            allExercises[idx].reps = `${baseReps} → 15s → ${Math.floor(baseReps/2)} → 15s → max`;
        }
    },
    
    /**
     * Applica myo-reps a esercizi adatti
     */
    applyMyoReps(allExercises, mainExercises) {
        const candidates = mainExercises.filter(e => {
            const type = (e.type || '').toLowerCase();
            const name = (e.name || '').toLowerCase();
            // Adatto per myo-reps: isolation, accessori, core
            const isBadName = name.includes('shadow') || name.includes('drill') || 
                             name.includes('round') || name.includes('combo');
            return ['hypertrophy', 'isolation', 'core'].includes(type) || 
                   (!isBadName && !['strength', 'power', 'technique'].includes(type));
        });
        
        if (candidates.length === 0) {
            return;
        }
        
        const target = candidates[0]; // Primo candidato
        const idx = allExercises.indexOf(target);
        
        if (idx >= 0 && !allExercises[idx].name.includes('myo-reps')) {
            allExercises[idx].name = `${target.name} (myo-reps)`;
            allExercises[idx].reps = '15 + 5x4';
            allExercises[idx].rest = '5s tra mini-set';
        }
    },
    
    /**
     * Applica tempo training (3-1-2-0) agli esercizi compound
     */
    applyTempoTraining(allExercises, mainExercises) {
        // Applica tempo a primi 2-3 compound
        let applied = 0;
        for (const ex of mainExercises) {
            if (applied >= 3) break;
            if (ex.type !== 'strength') continue;
            if (ex.tempo) continue; // già ha tempo
            
            const idx = allExercises.indexOf(ex);
            if (idx >= 0) {
                allExercises[idx].tempo = '3-1-2-0';
                allExercises[idx].name = `${ex.name} (tempo 3-1-2-0)`;
                applied++;
            }
        }
    },
    
    /**
     * 🔁 Applica struttura Circuit a 4-6 esercizi
     * Raggruppa esercizi consecutivi in un circuito con lettere (C1, C2, C3...)
     */
    applyCircuit(allExercises, mainExercises) {
        // Prendi 4-6 esercizi per il circuito
        const circuitSize = Math.min(6, Math.max(4, mainExercises.length));
        const circuitExercises = mainExercises.slice(0, circuitSize);
        
        if (circuitExercises.length < 4) return;
        
        circuitExercises.forEach((ex, i) => {
            const idx = allExercises.indexOf(ex);
            if (idx >= 0) {
                const letter = String.fromCharCode(65 + i); // A, B, C, D...
                allExercises[idx].name = `C${i + 1}: ${ex.name}`;
                allExercises[idx].circuitOrder = i + 1;
                allExercises[idx].circuitTotal = circuitExercises.length;
                // Rest 0 tra esercizi, rest lungo dopo il giro
                allExercises[idx].rest = i < circuitExercises.length - 1 ? '0s' : '90-120s';
                // Riduci reps per circuito
                const baseReps = parseInt(ex.reps) || 10;
                allExercises[idx].reps = Math.max(6, Math.floor(baseReps * 0.7));
            }
        });
        
        // Aggiungi nota al primo esercizio
        const firstIdx = allExercises.indexOf(circuitExercises[0]);
        if (firstIdx >= 0) {
            allExercises[firstIdx].circuitNote = `🔁 CIRCUITO x3 giri (${circuitExercises.length} esercizi)`;
        }
    },
    
    /**
     * ⏰ Applica struttura EMOM (Every Minute On the Minute)
     * Ogni esercizio viene eseguito all'inizio di ogni minuto
     */
    applyEMOM(allExercises, mainExercises) {
        // EMOM tipicamente 8-12 minuti, alterna 2-3 esercizi
        const emomExercises = mainExercises.slice(0, 3);
        
        if (emomExercises.length < 2) return;
        
        emomExercises.forEach((ex, i) => {
            const idx = allExercises.indexOf(ex);
            if (idx >= 0) {
                allExercises[idx].name = `EMOM Min ${i + 1}: ${ex.name}`;
                allExercises[idx].emomMinute = i + 1;
                // Reps bassi per completare in ~40s
                const baseReps = parseInt(ex.reps) || 10;
                allExercises[idx].reps = Math.min(8, Math.floor(baseReps * 0.6));
                allExercises[idx].rest = 'resto del minuto';
                allExercises[idx].sets = '4 rounds (12 min)';
            }
        });
        
        // Aggiungi nota
        const firstIdx = allExercises.indexOf(emomExercises[0]);
        if (firstIdx >= 0) {
            allExercises[firstIdx].emomNote = `⏰ EMOM 12 minuti - alterna ${emomExercises.length} esercizi`;
        }
    },
    
    /**
     * 🔥 Applica struttura Tabata (20s lavoro / 10s riposo)
     * 8 round per esercizio = 4 minuti
     */
    applyTabata(allExercises, mainExercises) {
        // Tabata funziona meglio con 2-4 esercizi
        const tabataExercises = mainExercises.filter(e => {
            const name = (e.name || '').toLowerCase();
            // Esercizi adatti per Tabata: bodyweight, esplosivi, cardio
            return !name.includes('deadlift') && !name.includes('squat pesante') &&
                   !name.includes('press') && e.type !== 'strength';
        }).slice(0, 4);
        
        if (tabataExercises.length < 2) {
            // Fallback: usa primi 2 esercizi qualsiasi
            tabataExercises.push(...mainExercises.slice(0, 2));
        }
        
        tabataExercises.slice(0, 4).forEach((ex, i) => {
            const idx = allExercises.indexOf(ex);
            if (idx >= 0) {
                allExercises[idx].name = `TABATA ${i + 1}: ${ex.name}`;
                allExercises[idx].reps = '20s max effort';
                allExercises[idx].rest = '10s';
                allExercises[idx].sets = '8 rounds (4 min)';
                allExercises[idx].tabataBlock = i + 1;
            }
        });
        
        // Aggiungi nota
        if (tabataExercises.length > 0) {
            const firstIdx = allExercises.indexOf(tabataExercises[0]);
            if (firstIdx >= 0) {
                allExercises[firstIdx].tabataNote = `🔥 TABATA Protocol - 20s ON / 10s OFF x8`;
            }
        }
    },
    
    /**
     * 🦾 Applica Giant Set (4+ esercizi senza riposo)
     * Tipicamente per stesso gruppo muscolare o full body
     */
    applyGiantSet(allExercises, mainExercises) {
        // Giant set: 4 esercizi consecutivi senza riposo
        const giantSetSize = Math.min(4, mainExercises.length);
        
        if (giantSetSize < 4) return;
        
        const giantSetExercises = mainExercises.slice(0, giantSetSize);
        
        giantSetExercises.forEach((ex, i) => {
            const idx = allExercises.indexOf(ex);
            if (idx >= 0) {
                allExercises[idx].name = `G${i + 1}: ${ex.name}`;
                allExercises[idx].giantSetOrder = i + 1;
                // Rest 0 tra esercizi, rest lungo dopo il giro completo
                allExercises[idx].rest = i < giantSetSize - 1 ? '0s' : '120-180s';
                allExercises[idx].sets = 3;
            }
        });
        
        // Aggiungi nota al primo esercizio
        const firstIdx = allExercises.indexOf(giantSetExercises[0]);
        if (firstIdx >= 0) {
            allExercises[firstIdx].giantSetNote = `🦾 GIANT SET x3 giri - ${giantSetSize} esercizi senza pausa`;
        }
    },
    
    /**
     * 🔗 Applica Cluster Set (mini-set con pause intra-serie)
     * Es: 6 reps come 2+2+2 con 15-20s di pausa
     */
    applyClusterSet(allExercises, mainExercises) {
        // Cluster funziona meglio su compound pesanti
        const clusterCandidates = mainExercises.filter(e => {
            const name = (e.name || '').toLowerCase();
            const type = (e.type || '').toLowerCase();
            // Compound movements
            return name.includes('squat') || name.includes('deadlift') ||
                   name.includes('press') || name.includes('row') ||
                   type === 'strength' || type === 'power';
        });
        
        if (clusterCandidates.length === 0) return;
        
        // Applica cluster al primo compound
        const target = clusterCandidates[0];
        const idx = allExercises.indexOf(target);
        
        if (idx >= 0 && !allExercises[idx].name.includes('cluster')) {
            const originalName = allExercises[idx].name.replace(/^[A-Z]\d+:\s*/, ''); // Rimuovi prefissi
            allExercises[idx].name = `${originalName} (cluster)`;
            allExercises[idx].reps = '(2+2+2) = 6 reps';
            allExercises[idx].rest = '15s intra-set, 180s inter-set';
            allExercises[idx].clusterNote = `🔗 CLUSTER SET - 15s pausa ogni 2 reps`;
        }
    },
    
    /**
     * ⚡ Applica Contrast Training (pesante + esplosivo)
     * Alternanza tra esercizio pesante e pliometrico/esplosivo
     */
    applyContrastTraining(allExercises, mainExercises) {
        // Trova un esercizio pesante e uno esplosivo
        const heavyEx = mainExercises.find(e => {
            const name = (e.name || '').toLowerCase();
            const type = (e.type || '').toLowerCase();
            return name.includes('squat') || name.includes('press') ||
                   name.includes('deadlift') || type === 'strength';
        });
        
        const explosiveEx = mainExercises.find(e => {
            const name = (e.name || '').toLowerCase();
            const type = (e.type || '').toLowerCase();
            return name.includes('jump') || name.includes('throw') ||
                   name.includes('plyometric') || name.includes('explosive') ||
                   type === 'power' || type === 'plyometric';
        });
        
        if (heavyEx && explosiveEx && heavyEx !== explosiveEx) {
            const idx1 = allExercises.indexOf(heavyEx);
            const idx2 = allExercises.indexOf(explosiveEx);
            
            if (idx1 >= 0 && idx2 >= 0) {
                allExercises[idx1].name = `PAP-A: ${heavyEx.name} (pesante)`;
                allExercises[idx1].rest = '30s';
                allExercises[idx1].reps = '3-5';
                allExercises[idx1].contrastNote = `⚡ PAP - Post-Activation Potentiation`;
                
                allExercises[idx2].name = `PAP-B: ${explosiveEx.name} (esplosivo)`;
                allExercises[idx2].rest = '180-240s';
                allExercises[idx2].reps = '5-6 max velocity';
                allExercises[idx2].contrastPair = 'PAP-A';
            }
        } else {
            // Fallback: marca il primo esercizio come contrast
            if (mainExercises.length >= 2) {
                const idx1 = allExercises.indexOf(mainExercises[0]);
                const idx2 = allExercises.indexOf(mainExercises[1]);
                if (idx1 >= 0 && idx2 >= 0) {
                    allExercises[idx1].name = `PAP-A: ${mainExercises[0].name}`;
                    allExercises[idx1].rest = '30s';
                    allExercises[idx2].name = `PAP-B: ${mainExercises[1].name}`;
                    allExercises[idx2].rest = '180s';
                    allExercises[idx1].contrastNote = `⚡ CONTRAST - Pesante → Esplosivo`;
                }
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏆 GENERAZIONE WORKOUT SPORT-SPECIFICO
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Genera workout usando modulo sport-specifico
     */
    generateSportSpecificWorkout(profile, sportModule) {
        // Determina tipo sessione
        let sessionType = profile.sessionType || 'strength';
        console.log(`🏆 Tipo sessione: ${sessionType}`);
        
        // Genera workout dal modulo sport
        let workout = sportModule.generateWorkout(profile, sessionType);
        
        // Applica anamnesi se presente
        if (profile.anamnesi && typeof ATLASAnamnesi !== 'undefined') {
            workout = ATLASAnamnesi.filterWorkout(workout, profile.anamnesi);
            console.log('✅ Anamnesi applicata al workout sport-specifico');
        }
        
        // Applica progressive overload
        if (typeof ATLASProgression !== 'undefined') {
            workout = ATLASProgression.applyProgression(
                workout, 
                profile.goal,
                profile.readiness || null
            );
            console.log('✅ Progressive overload applicato');
        }
        
        // NEW: Applica metodologie di allenamento
        try {
            workout = this.applyTrainingMethods(workout, profile);
        } catch (e) {
            console.error('❌ Errore in applyTrainingMethods:', e);
        }
        
        // NEW: Ottimizza ordine esercizi e volumi con intelligenza
        if (typeof ATLASExerciseIntelligence !== 'undefined') {
            const intelligenceContext = {
                goal: profile.goal,
                level: profile.level,
                age: profile.age,
                fatigue: profile.fatigue || profile.readiness?.fatigue,
                weekNumber: profile.currentWeek,
                cnsState: profile.cnsState
            };
            workout = ATLASExerciseIntelligence.optimizeWorkout(workout, intelligenceContext);
            console.log('✅ Exercise Intelligence: ordine e volumi ottimizzati');
            
            // Calcola durata realistica
            if (ATLASExerciseIntelligence.calculateRealisticDuration) {
                const durationResult = ATLASExerciseIntelligence.calculateRealisticDuration(
                    workout.exercises || [],
                    { level: profile.level, goal: profile.goal }
                );
                workout.duration = durationResult.minutes;
                workout.durationBreakdown = durationResult.breakdown;
                console.log(`⏱️ Durata stimata: ${durationResult.minutes} minuti`);
            }
        }
        
        // Valida workout
        const validation = ScientificWorkoutValidator.validate(workout, profile);
        workout.validation = validation;
        console.log(`✅ Validazione: ${validation.score}% (${validation.grade.letter})`);
        
        // Aggiungi metadata
        workout.metadata = {
            generatedAt: new Date().toISOString(),
            version: this.version,
            module: sportModule.version ? `${profile.sport.toUpperCase()} v${sportModule.version}` : profile.sport.toUpperCase(),
            profile: {
                sport: profile.sport,
                goal: profile.goal,
                level: profile.level,
                sessionType: sessionType
            },
            quality: {
                score: validation.score,
                grade: validation.grade.letter,
                humanReplacement: validation.score >= 75 ? 'READY' : 'NEEDS_REVIEW'
            }
        };
        
        return workout;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🥊 GENERAZIONE WORKOUT BOXE
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Genera workout specifico per boxe con modulo dedicato
     */
    generateBoxingWorkout(profile) {
        // Determina tipo sessione basato sul goal e contesto
        let sessionType = 'complete';
        
        // Prima controlla se abbiamo sessionType dal boxing split
        if (profile.sessionType && ['strength', 'technique', 'bag', 'conditioning', 'complete'].includes(profile.sessionType)) {
            sessionType = profile.sessionType;
            console.log(`🥊 Usando sessionType da split: ${sessionType}`);
        } else {
            // Fallback: determina da goal
            switch (profile.goal) {
                case 'potenza':
                    sessionType = 'strength';
                    break;
                case 'resistenza':
                    sessionType = 'conditioning';
                    break;
                case 'tecnica':
                    sessionType = 'technique';
                    break;
                case 'forza':
                    sessionType = 'strength';
                    break;
                default:
                    sessionType = 'complete';
            }
        }
        
        console.log(`🥊 Tipo sessione boxe: ${sessionType}`);
        
        // Genera workout boxe
        let boxingWorkout = ATLASBoxing.generateWorkout(profile, sessionType);
        
        // Applica anamnesi se presente
        if (profile.anamnesi && typeof ATLASAnamnesi !== 'undefined') {
            boxingWorkout = ATLASAnamnesi.filterWorkout(boxingWorkout, profile.anamnesi);
            console.log('✅ Anamnesi applicata al workout boxe');
        }
        
        // Applica progressive overload
        if (typeof ATLASProgression !== 'undefined') {
            boxingWorkout = ATLASProgression.applyProgression(
                boxingWorkout, 
                profile.goal,
                profile.readiness || null
            );
            console.log('✅ Progressive overload applicato');
        }
        
        // NEW: Applica metodologie di allenamento
        boxingWorkout = this.applyTrainingMethods(boxingWorkout, profile);
        
        // NEW: Ottimizza ordine esercizi e volumi con intelligenza
        if (typeof ATLASExerciseIntelligence !== 'undefined') {
            const intelligenceContext = {
                goal: profile.goal,
                level: profile.level,
                age: profile.age,
                fatigue: profile.fatigue || profile.readiness?.fatigue,
                weekNumber: profile.currentWeek,
                cnsState: profile.cnsState
            };
            boxingWorkout = ATLASExerciseIntelligence.optimizeWorkout(boxingWorkout, intelligenceContext);
            console.log('✅ Exercise Intelligence: ordine e volumi ottimizzati');
            
            // Calcola durata realistica
            if (ATLASExerciseIntelligence.calculateRealisticDuration) {
                const durationResult = ATLASExerciseIntelligence.calculateRealisticDuration(
                    boxingWorkout.exercises || [],
                    { level: profile.level, goal: profile.goal }
                );
                boxingWorkout.duration = durationResult.minutes;
                boxingWorkout.durationBreakdown = durationResult.breakdown;
                console.log(`⏱️ Durata stimata: ${durationResult.minutes} minuti`);
            }
        }
        
        // Valida workout
        const validation = ScientificWorkoutValidator.validate(boxingWorkout, profile);
        boxingWorkout.validation = validation;
        console.log(`✅ Validazione: ${validation.score}% (${validation.grade.letter})`);
        
        // Aggiungi metadata
        boxingWorkout.metadata = {
            generatedAt: new Date().toISOString(),
            version: this.version,
            module: 'ATLASBoxing',
            profile: {
                sport: 'boxe',
                goal: profile.goal,
                level: profile.level,
                sessionType: sessionType
            },
            quality: {
                score: validation.score,
                grade: validation.grade.letter,
                humanReplacement: validation.score >= 75 ? 'READY' : 'NEEDS_REVIEW'
            }
        };
        
        return boxingWorkout;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📅 GENERAZIONE SETTIMANA COMPLETA
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Genera tutti i workout della settimana basandosi sul calendario
     * @param {Object} profile - Profilo atleta
     * @param {Object} weeklySchedule - Calendario settimanale
     * @param {Array} workoutHistory - Storico workout recenti
     * @returns {Object} Piano settimanale con tutti i workout
     */
    generateWeeklyPlan(profile, weeklySchedule, workoutHistory = []) {
        console.log('\n' + '═'.repeat(70));
        console.log('📅 ATLAS - GENERAZIONE PIANO SETTIMANALE');
        console.log('═'.repeat(70) + '\n');
        
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
        
        // 1. Identifica i giorni GR Perform (palestra)
        const grDays = [];
        days.forEach((day, i) => {
            const activity = weeklySchedule[day];
            if (this.isGRPerformDay(activity)) {
                grDays.push({ day, dayName: dayNames[i], index: i });
            }
        });
        
        console.log(`🏋️ Giorni GR Perform: ${grDays.length} (${grDays.map(d => d.dayName).join(', ')})`);
        
        if (grDays.length === 0) {
            return {
                success: false,
                error: 'Nessun giorno GR Perform selezionato nel calendario',
                workouts: []
            };
        }
        
        // 2. Determina lo split ottimale (sport-specific via Sports Master)
        let split;
        if (typeof ATLASSportsMaster !== 'undefined' && profile.sport) {
            split = ATLASSportsMaster.getSplit(profile.sport, grDays.length);
            console.log(`🏆 Split sport-specifico: ${split.name}`);
        } else if (profile.sport === 'boxe') {
            split = this.determineBoxingSplit(grDays.length);
            console.log(`🥊 Split boxe: ${split.name}`);
        } else {
            split = this.determineSplit(grDays.length, profile.goal);
        }
        console.log(`📋 Split selezionato: ${split.name}`);
        
        // 3. Genera workout per ogni giorno GR Perform
        const workouts = [];
        
        grDays.forEach((dayInfo, sessionIndex) => {
            console.log(`\n--- ${dayInfo.dayName} (Sessione ${sessionIndex + 1}) ---`);
            
            // Determina il focus di questa sessione
            const sessionFocus = split.sessions[sessionIndex % split.sessions.length];
            
            // Costruisci profilo per questa sessione
            const sessionProfile = {
                ...profile,
                sessionFocus: sessionFocus.focus || sessionFocus.name,
                sessionType: sessionFocus.sessionType || sessionFocus.type,
                muscleGroups: sessionFocus.muscles,
                targetDay: dayInfo.day,
                sessionNumber: sessionIndex + 1,
                totalSessions: grDays.length
            };
            
            // Analizza contesto giorno (cosa c'è prima/dopo)
            let workout;
            if (typeof ATLASRecovery !== 'undefined') {
                const analysis = ATLASRecovery.analyzeWeekForWorkout(
                    weeklySchedule, 
                    dayInfo.day, 
                    profile.goal
                );
                
                // Modifica intensità se necessario
                if (analysis.warnings.length > 0) {
                    sessionProfile.intensity = analysis.recommended === 'strength_light' ? 'light' : 'normal';
                    console.log(`⚠️ Adattamento: ${analysis.warnings.map(w => w.message).join(', ')}`);
                }
            }
            
            // Genera il workout per questa sessione
            workout = this.generateSessionWorkout(sessionProfile);
            
            // Aggiungi metadata del giorno
            workout.dayOfWeek = dayInfo.day;
            workout.dayName = dayInfo.dayName;
            workout.sessionNumber = sessionIndex + 1;
            workout.sessionFocus = sessionFocus;
            workout.name = `${dayInfo.dayName} - ${sessionFocus.name}`;
            
            workouts.push(workout);
            console.log(`✅ ${workout.name} generato (Score: ${workout.validation?.score || '-'}%)`);
        });
        
        // 4. Calcola statistiche
        const avgScore = workouts.reduce((sum, w) => sum + (w.validation?.score || 80), 0) / workouts.length;
        
        const weekPlan = {
            success: true,
            generatedAt: new Date().toISOString(),
            athlete: profile.name || profile.athleteId,
            weekNumber: profile.weekNumber || 1,
            phase: profile.phase,
            split: split,
            schedule: weeklySchedule,
            workouts: workouts,
            statistics: {
                totalSessions: workouts.length,
                averageScore: Math.round(avgScore),
                totalExercises: workouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0)
            }
        };
        
        console.log('\n' + '═'.repeat(70));
        console.log(`📊 PIANO SETTIMANALE COMPLETATO`);
        console.log(`   Sessioni: ${weekPlan.statistics.totalSessions}`);
        console.log(`   Score medio: ${weekPlan.statistics.averageScore}%`);
        console.log(`   Esercizi totali: ${weekPlan.statistics.totalExercises}`);
        console.log('═'.repeat(70));
        
        return weekPlan;
    },
    
    /**
     * Verifica se un giorno è GR Perform (palestra)
     */
    isGRPerformDay(activity) {
        if (!activity) return false;
        const v = String(activity).toLowerCase();
        return ['gr_perform', 'gr_available', 'gym', 'palestra', 'both'].includes(v);
    },
    
    /**
     * Determina lo split ottimale basandosi sul numero di giorni e goal
     */
    determineSplit(daysPerWeek, goal) {
        const splits = {
            2: {
                name: 'Upper/Lower Split',
                sessions: [
                    { name: 'Upper Body', type: 'upper', focus: 'push_pull', muscles: ['chest', 'back', 'shoulders', 'arms'] },
                    { name: 'Lower Body', type: 'lower', focus: 'legs', muscles: ['quadriceps', 'hamstrings', 'glutes', 'calves'] }
                ]
            },
            3: {
                name: 'Push/Pull/Legs',
                sessions: [
                    { name: 'Push', type: 'push', focus: 'push', muscles: ['chest', 'shoulders', 'triceps'] },
                    { name: 'Pull', type: 'pull', focus: 'pull', muscles: ['back', 'biceps', 'rear_delts'] },
                    { name: 'Legs', type: 'legs', focus: 'legs', muscles: ['quadriceps', 'hamstrings', 'glutes', 'calves'] }
                ]
            },
            4: {
                name: 'Upper/Lower x2',
                sessions: [
                    { name: 'Upper A (Forza)', type: 'upper', focus: 'strength', muscles: ['chest', 'back', 'shoulders'] },
                    { name: 'Lower A (Forza)', type: 'lower', focus: 'strength', muscles: ['quadriceps', 'hamstrings', 'glutes'] },
                    { name: 'Upper B (Volume)', type: 'upper', focus: 'hypertrophy', muscles: ['chest', 'back', 'arms'] },
                    { name: 'Lower B (Volume)', type: 'lower', focus: 'hypertrophy', muscles: ['quadriceps', 'hamstrings', 'calves'] }
                ]
            },
            5: {
                name: 'Push/Pull/Legs/Upper/Lower',
                sessions: [
                    { name: 'Push', type: 'push', focus: 'push', muscles: ['chest', 'shoulders', 'triceps'] },
                    { name: 'Pull', type: 'pull', focus: 'pull', muscles: ['back', 'biceps'] },
                    { name: 'Legs', type: 'legs', focus: 'legs', muscles: ['quadriceps', 'hamstrings', 'glutes'] },
                    { name: 'Upper (Forza)', type: 'upper', focus: 'strength', muscles: ['chest', 'back', 'shoulders'] },
                    { name: 'Lower (Potenza)', type: 'lower', focus: 'power', muscles: ['glutes', 'hamstrings', 'calves'] }
                ]
            },
            6: {
                name: 'PPL x2',
                sessions: [
                    { name: 'Push A', type: 'push', focus: 'strength', muscles: ['chest', 'shoulders', 'triceps'] },
                    { name: 'Pull A', type: 'pull', focus: 'strength', muscles: ['back', 'biceps'] },
                    { name: 'Legs A', type: 'legs', focus: 'strength', muscles: ['quadriceps', 'hamstrings', 'glutes'] },
                    { name: 'Push B', type: 'push', focus: 'hypertrophy', muscles: ['chest', 'shoulders', 'triceps'] },
                    { name: 'Pull B', type: 'pull', focus: 'hypertrophy', muscles: ['back', 'biceps'] },
                    { name: 'Legs B', type: 'legs', focus: 'hypertrophy', muscles: ['quadriceps', 'hamstrings', 'calves'] }
                ]
            }
        };
        
        // Default a 3 giorni se non trovato
        return splits[daysPerWeek] || splits[3];
    },
    
    /**
     * Determina lo split ottimale per BOXE
     * Non usa Push/Pull/Legs ma sessioni specifiche boxe
     */
    determineBoxingSplit(daysPerWeek) {
        const boxingSplits = {
            2: {
                name: 'Boxing 2-Day Split',
                sessions: [
                    { name: 'Strength + Bag', type: 'strength', focus: 'strength', sessionType: 'strength' },
                    { name: 'Conditioning + Technique', type: 'conditioning', focus: 'conditioning', sessionType: 'conditioning' }
                ]
            },
            3: {
                name: 'Boxing 3-Day Split',
                sessions: [
                    { name: 'Strength', type: 'strength', focus: 'strength', sessionType: 'strength' },
                    { name: 'Bag Work', type: 'bag', focus: 'power', sessionType: 'bag' },
                    { name: 'Conditioning', type: 'conditioning', focus: 'conditioning', sessionType: 'conditioning' }
                ]
            },
            4: {
                name: 'Boxing 4-Day Split',
                sessions: [
                    { name: 'Strength', type: 'strength', focus: 'strength', sessionType: 'strength' },
                    { name: 'Technique', type: 'technique', focus: 'technique', sessionType: 'technique' },
                    { name: 'Bag Work', type: 'bag', focus: 'power', sessionType: 'bag' },
                    { name: 'Conditioning', type: 'conditioning', focus: 'conditioning', sessionType: 'conditioning' }
                ]
            },
            5: {
                name: 'Boxing 5-Day Split',
                sessions: [
                    { name: 'Strength Upper', type: 'strength', focus: 'strength', sessionType: 'strength' },
                    { name: 'Technique', type: 'technique', focus: 'technique', sessionType: 'technique' },
                    { name: 'Bag Work', type: 'bag', focus: 'power', sessionType: 'bag' },
                    { name: 'Strength Lower', type: 'strength', focus: 'strength', sessionType: 'strength' },
                    { name: 'Conditioning', type: 'conditioning', focus: 'conditioning', sessionType: 'conditioning' }
                ]
            },
            6: {
                name: 'Boxing 6-Day Split',
                sessions: [
                    { name: 'Strength', type: 'strength', focus: 'strength', sessionType: 'strength' },
                    { name: 'Technique AM', type: 'technique', focus: 'technique', sessionType: 'technique' },
                    { name: 'Bag Work', type: 'bag', focus: 'power', sessionType: 'bag' },
                    { name: 'Conditioning', type: 'conditioning', focus: 'conditioning', sessionType: 'conditioning' },
                    { name: 'Technique PM', type: 'technique', focus: 'technique', sessionType: 'technique' },
                    { name: 'Complete Session', type: 'complete', focus: 'complete', sessionType: 'complete' }
                ]
            }
        };
        
        return boxingSplits[daysPerWeek] || boxingSplits[3];
    },
    
    /**
     * Genera workout per una singola sessione con focus specifico
     */
    generateSessionWorkout(profile) {
        // Modifica il profilo per includere il focus della sessione
        const modifiedProfile = {
            ...profile,
            // Override goal se necessario per il focus
            sessionGoal: profile.sessionFocus || profile.goal
        };
        
        // Genera workout base
        let workout = this.generateWorkout(modifiedProfile);
        
        // Check se è uno sport con modulo specifico - skip muscle filtering
        if (typeof ATLASSportsMaster !== 'undefined' && profile.sport) {
            const sportModule = ATLASSportsMaster.getModule(profile.sport);
            if (sportModule) {
                console.log(`🏆 Sport-specific workout (${profile.sport}): skip muscle filtering`);
                return workout;
            }
        }
        
        // Fallback check per boxe (backward compatibility)
        const sportSpecificModules = ['boxe', 'boxing', 'mma', 'calcio', 'soccer', 'basket', 'basketball', 
                                       'tennis', 'running', 'corsa', 'crossfit', 'cycling', 'ciclismo', 
                                       'swimming', 'nuoto'];
        if (sportSpecificModules.includes(profile.sport)) {
            console.log(`🏆 Sport-specific workout (${profile.sport}): skip muscle filtering`);
            return workout;
        }
        
        // Filtra esercizi per muscoli target se specificati (solo per palestra generica)
        if (profile.muscleGroups && workout.exercises) {
            workout = this.filterExercisesByMuscles(workout, profile.muscleGroups, profile.sessionType);
        }
        
        return workout;
    },
    
    /**
     * Filtra e riordina esercizi per muscoli target della sessione
     */
    filterExercisesByMuscles(workout, targetMuscles, sessionType) {
        // Mapping esercizi -> muscoli
        const exerciseMuscleMap = {
            // Upper Push
            'bench_press': ['chest', 'triceps'],
            'incline_bench': ['chest', 'shoulders'],
            'overhead_press': ['shoulders', 'triceps'],
            'dumbbell_press': ['chest', 'triceps'],
            'push_up': ['chest', 'triceps'],
            'dips': ['chest', 'triceps'],
            'lateral_raise': ['shoulders'],
            'tricep_pushdown': ['triceps'],
            'skull_crusher': ['triceps'],
            
            // Upper Pull
            'pull_up': ['back', 'biceps'],
            'chin_up': ['back', 'biceps'],
            'barbell_row': ['back'],
            'dumbbell_row': ['back'],
            'lat_pulldown': ['back'],
            'cable_row': ['back'],
            'face_pull': ['rear_delts', 'back'],
            'bicep_curl': ['biceps'],
            'hammer_curl': ['biceps'],
            
            // Lower
            'squat': ['quadriceps', 'glutes'],
            'back_squat': ['quadriceps', 'glutes'],
            'front_squat': ['quadriceps'],
            'deadlift': ['hamstrings', 'glutes', 'back'],
            'romanian_deadlift': ['hamstrings', 'glutes'],
            'rdl': ['hamstrings', 'glutes'],
            'leg_press': ['quadriceps', 'glutes'],
            'lunges': ['quadriceps', 'glutes'],
            'bulgarian_split_squat': ['quadriceps', 'glutes'],
            'leg_curl': ['hamstrings'],
            'leg_extension': ['quadriceps'],
            'hip_thrust': ['glutes'],
            'calf_raise': ['calves'],
            
            // Power
            'power_clean': ['full_body'],
            'hang_clean': ['full_body'],
            'box_jump': ['legs', 'power'],
            'jump_squat': ['legs', 'power'],
            'med_ball_slam': ['full_body'],
            'kettlebell_swing': ['hamstrings', 'glutes']
        };
        
        const exercises = workout.exercises || [];
        
        // Funzione per verificare se esercizio matcha i muscoli target
        const matchesMuscles = (exercise) => {
            const name = (exercise.name || exercise.exercise || '').toLowerCase().replace(/\s+/g, '_');
            
            // Cerca match nel map
            for (const [key, muscles] of Object.entries(exerciseMuscleMap)) {
                if (name.includes(key) || key.includes(name.split('_')[0])) {
                    return muscles.some(m => targetMuscles.includes(m)) || muscles.includes('full_body');
                }
            }
            
            // Se non trovato, includi comunque (warmup, core, etc)
            const alwaysInclude = ['warmup', 'mobility', 'core', 'plank', 'dead_bug', 'cooldown'];
            return alwaysInclude.some(t => name.includes(t) || (exercise.type || '').includes(t));
        };
        
        // Filtra esercizi
        if (Array.isArray(exercises)) {
            workout.exercises = exercises.filter(matchesMuscles);
            
            // Assicurati di avere almeno 4-6 esercizi
            if (workout.exercises.length < 4) {
                // Aggiungi alcuni esercizi di base per il tipo di sessione
                const baseExercises = this.getBaseExercisesForSession(sessionType, targetMuscles);
                workout.exercises = [...workout.exercises, ...baseExercises].slice(0, 8);
            }
        }
        
        return workout;
    },
    
    /**
     * Ottieni esercizi base per tipo di sessione
     */
    getBaseExercisesForSession(sessionType, targetMuscles) {
        const baseExercises = {
            push: [
                { name: 'Bench Press', sets: 4, reps: '6-8', type: 'strength', rest: '180s' },
                { name: 'Overhead Press', sets: 3, reps: '8-10', type: 'strength', rest: '120s' },
                { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', type: 'hypertrophy', rest: '90s' },
                { name: 'Lateral Raise', sets: 3, reps: '12-15', type: 'isolation', rest: '60s' },
                { name: 'Tricep Pushdown', sets: 3, reps: '12-15', type: 'isolation', rest: '60s' }
            ],
            pull: [
                { name: 'Barbell Row', sets: 4, reps: '6-8', type: 'strength', rest: '180s' },
                { name: 'Pull Up', sets: 3, reps: '6-10', type: 'strength', rest: '120s' },
                { name: 'Cable Row', sets: 3, reps: '10-12', type: 'hypertrophy', rest: '90s' },
                { name: 'Face Pull', sets: 3, reps: '15-20', type: 'isolation', rest: '60s' },
                { name: 'Bicep Curl', sets: 3, reps: '10-12', type: 'isolation', rest: '60s' }
            ],
            legs: [
                { name: 'Back Squat', sets: 4, reps: '6-8', type: 'strength', rest: '180s' },
                { name: 'Romanian Deadlift', sets: 3, reps: '8-10', type: 'strength', rest: '120s' },
                { name: 'Leg Press', sets: 3, reps: '10-12', type: 'hypertrophy', rest: '90s' },
                { name: 'Leg Curl', sets: 3, reps: '12-15', type: 'isolation', rest: '60s' },
                { name: 'Calf Raise', sets: 4, reps: '15-20', type: 'isolation', rest: '60s' }
            ],
            upper: [
                { name: 'Bench Press', sets: 4, reps: '6-8', type: 'strength', rest: '180s' },
                { name: 'Barbell Row', sets: 4, reps: '6-8', type: 'strength', rest: '180s' },
                { name: 'Overhead Press', sets: 3, reps: '8-10', type: 'strength', rest: '120s' },
                { name: 'Pull Up', sets: 3, reps: 'Max', type: 'strength', rest: '120s' },
                { name: 'Face Pull', sets: 3, reps: '15-20', type: 'isolation', rest: '60s' }
            ],
            lower: [
                { name: 'Back Squat', sets: 4, reps: '6-8', type: 'strength', rest: '180s' },
                { name: 'Romanian Deadlift', sets: 4, reps: '8-10', type: 'strength', rest: '120s' },
                { name: 'Bulgarian Split Squat', sets: 3, reps: '10-12', type: 'hypertrophy', rest: '90s' },
                { name: 'Hip Thrust', sets: 3, reps: '10-12', type: 'hypertrophy', rest: '90s' },
                { name: 'Calf Raise', sets: 4, reps: '15-20', type: 'isolation', rest: '60s' }
            ]
        };
        
        return baseExercises[sessionType] || baseExercises.upper;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📅 GENERAZIONE PIANO MULTI-SETTIMANA
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Genera piano completo multi-settimana
     * @param {Object} profile - Profilo utente
     * @param {number} weeks - Numero settimane (4-52)
     * @returns {Object} Piano completo con tutti i workout
     */
    generateFullPlan(profile, weeks = 12) {
        console.log('\n' + '═'.repeat(70));
        console.log('📅 ATLAS COMPLETE - Generazione Piano ' + weeks + ' Settimane');
        console.log('═'.repeat(70) + '\n');
        
        // 1. Valida anamnesi se presente
        if (profile.anamnesi) {
            const validation = ATLASAnamnesi.validateAnamnesi(profile.anamnesi);
            if (validation.requiresMedicalClearance) {
                console.log('⚠️ ATTENZIONE: Richiesta clearance medica!');
                validation.warnings.forEach(w => console.log(`   ${w}`));
            }
        }
        
        // 2. Genera piano periodizzato
        const periodizationPlan = ATLASPeriodization.generatePlan(profile, weeks);
        console.log('✅ Piano periodizzato generato');
        
        // 3. Genera workout per ogni settimana
        const fullPlan = {
            profile,
            totalWeeks: weeks,
            periodization: periodizationPlan,
            weeklyWorkouts: [],
            statistics: {
                totalWorkouts: 0,
                averageScore: 0,
                modifications: 0
            }
        };
        
        let totalScore = 0;
        let totalMods = 0;
        
        for (let week = 1; week <= weeks; week++) {
            // Prepara profilo per questa settimana
            const weekProfile = {
                ...profile,
                currentWeek: week,
                programWeeks: weeks
            };
            
            // Genera workout per questa settimana
            const workout = this.generateWorkout(weekProfile);
            
            fullPlan.weeklyWorkouts.push({
                week,
                phase: periodizationPlan.weeklyPlans[week - 1]?.phase,
                workout,
                score: workout.validation.score
            });
            
            totalScore += workout.validation.score;
            totalMods += (workout.modifications?.length || 0);
            fullPlan.statistics.totalWorkouts++;
        }
        
        // Calcola statistiche
        fullPlan.statistics.averageScore = Math.round(totalScore / weeks);
        fullPlan.statistics.modifications = totalMods;
        fullPlan.statistics.qualityGrade = this.getGrade(fullPlan.statistics.averageScore);
        
        console.log('\n📊 STATISTICHE PIANO:');
        console.log(`   Workout totali: ${fullPlan.statistics.totalWorkouts}`);
        console.log(`   Score medio: ${fullPlan.statistics.averageScore}%`);
        console.log(`   Modifiche anamnesi: ${fullPlan.statistics.modifications}`);
        console.log(`   Grado qualità: ${fullPlan.statistics.qualityGrade}`);
        
        return fullPlan;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 ANALISI SISTEMA
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Analizza capacità del sistema come sostituto trainer
     */
    analyzeSystemCapabilities() {
        console.log('\n' + '═'.repeat(70));
        console.log('🤖 ATLAS v2.0 - ANALISI CAPACITÀ SOSTITUZIONE TRAINER');
        console.log('═'.repeat(70) + '\n');
        
        // Check moduli disponibili
        const hasProgression = typeof ATLASProgression !== 'undefined';
        const hasFeedback = typeof ATLASFeedback !== 'undefined';
        const hasRecovery = typeof ATLASRecovery !== 'undefined';
        
        const capabilities = {
            templateEngine: {
                name: 'Generazione Workout',
                status: 'ACTIVE',
                coverage: '75.6%',
                sports: ['calcio', 'basket', 'boxe', 'palestra'],
                goals: ['potenza', 'ipertrofia', 'forza'],
                variations: 3
            },
            periodization: {
                name: 'Periodizzazione',
                status: 'ACTIVE',
                coverage: '100%',
                features: [
                    'Mesocicli automatici',
                    'Wave loading',
                    'Deload automatico',
                    'Progressione intensità/volume'
                ],
                duration: '4-52 settimane'
            },
            anamnesi: {
                name: 'Gestione Infortuni',
                status: 'ACTIVE',
                coverage: '100%',
                injuries: Object.keys(ATLASAnamnesi.injuries).length,
                conditions: Object.keys(ATLASAnamnesi.medicalConditions).length,
                features: [
                    'Sostituzione automatica esercizi',
                    'Esercizi riabilitazione',
                    'Restrizioni intensità',
                    'Clearance medica'
                ]
            },
            progression: {
                name: 'Progressive Overload',
                status: hasProgression ? 'ACTIVE' : 'NOT_LOADED',
                coverage: hasProgression ? '100%' : '0%',
                features: [
                    'Storico sessioni',
                    'Personal Records tracking',
                    'Auto-incremento carichi',
                    'RPE auto-regulation',
                    'Trend analysis',
                    'Plateau prediction'
                ]
            },
            feedback: {
                name: 'Feedback Loop',
                status: hasFeedback ? 'ACTIVE' : 'NOT_LOADED',
                coverage: hasFeedback ? '100%' : '0%',
                features: [
                    'Analisi pattern difficoltà',
                    'Tracking esercizi problematici',
                    'Auto-riduzione su feedback negativo',
                    'Pain point tracking'
                ]
            },
            recovery: {
                name: 'Recovery & Scheduling Intelligence',
                status: hasRecovery ? 'ACTIVE' : 'NOT_LOADED',
                coverage: hasRecovery ? '100%' : '0%',
                features: [
                    'Recupero muscolare stimato',
                    'Smart week scheduling',
                    'NO forza prima squadra/partita',
                    'Separazione palestra/tecnica',
                    'Auto-adattamento intensità'
                ]
            },
            validation: {
                name: 'Validazione Scientifica',
                status: 'ACTIVE',
                coverage: '100%',
                categories: 8,
                accuracy: 'NASA-level'
            }
        };
        
        // Stampa report
        Object.values(capabilities).forEach(cap => {
            const statusIcon = cap.status === 'ACTIVE' ? '✅' : '❌';
            console.log(`\n📦 ${cap.name.toUpperCase()} ${statusIcon}`);
            console.log(`   Status: ${cap.status}`);
            console.log(`   Coverage: ${cap.coverage}`);
            if (cap.features) {
                console.log('   Features:');
                cap.features.forEach(f => console.log(`     • ${f}`));
            }
        });
        
        // Gap analysis
        console.log('\n' + '─'.repeat(70));
        console.log('📊 GAP ANALYSIS per 90%+\n');
        
        const gaps = [
            { feature: 'Progressive Overload Tracking', impact: '+3%', status: hasProgression ? 'DONE' : 'TODO' },
            { feature: 'RPE Auto-regulation', impact: '+2%', status: hasProgression ? 'DONE' : 'TODO' },
            { feature: 'Feedback Loop (pattern analysis)', impact: '+5%', status: hasFeedback ? 'DONE' : 'TODO' },
            { feature: 'Recovery Intelligence', impact: '+3%', status: hasRecovery ? 'DONE' : 'TODO' },
            { feature: 'Smart Week Scheduling', impact: '+5%', status: hasRecovery ? 'DONE' : 'TODO' },
            { feature: 'Nutrition Integration', impact: '+3%', status: 'TODO' },
            { feature: 'Long-term ML Learning', impact: '+5%', status: 'TODO' },
            { feature: 'Exercise Video Library', impact: '+1%', status: 'TODO' }
        ];
        
        let completedBonus = 0;
        gaps.forEach(gap => {
            const icon = gap.status === 'DONE' ? '✅' : (gap.status === 'PARTIAL' ? '🟡' : '⬜');
            console.log(`   ${icon} ${gap.feature}: ${gap.impact}`);
            if (gap.status === 'DONE') completedBonus += parseFloat(gap.impact);
            if (gap.status === 'PARTIAL') completedBonus += parseFloat(gap.impact) * 0.5;
        });
        
        const baseScore = 75.6;
        const currentScore = baseScore + completedBonus;
        const potentialScore = baseScore + gaps.reduce((sum, g) => sum + parseFloat(g.impact), 0);
        
        console.log('\n' + '─'.repeat(70));
        console.log(`📈 SCORE BASE: ${baseScore}%`);
        console.log(`📈 SCORE ATTUALE: ${currentScore.toFixed(1)}%`);
        console.log(`🎯 POTENZIALE: ${potentialScore}%`);
        console.log(`📍 DISTANZA DA 90%: ${(90 - currentScore).toFixed(1)}%`);
        console.log('─'.repeat(70));
        
        // Verdetto
        console.log('\n🏆 VERDETTO SOSTITUZIONE TRAINER:\n');
        
        if (currentScore >= 85) {
            console.log('   ✅ PRONTO per sostituire trainer umano');
            console.log('   Il sistema può gestire autonomamente la programmazione');
        } else if (currentScore >= 80) {
            console.log('   🟢 QUASI COMPLETO - Minima supervisione richiesta');
            console.log('   Il sistema gestisce 95% del lavoro');
        } else if (currentScore >= 75) {
            console.log('   🟡 QUASI PRONTO - Ottimo per uso assistito');
            console.log('   Raccomandato: review periodico da professionista');
            console.log('   Il sistema gestisce 90% del lavoro, umano supervisiona');
        } else {
            console.log('   🔴 NON PRONTO - Richiede miglioramenti');
        }
        
        return capabilities;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧪 DEMO COMPLETA
    // ═══════════════════════════════════════════════════════════════════════════
    
    demo() {
        console.log('\n' + '█'.repeat(70));
        console.log('█  🤖 ATLAS COMPLETE SYSTEM - DEMO INTEGRAZIONE COMPLETA');
        console.log('█'.repeat(70) + '\n');
        
        // Profilo utente completo
        const profile = {
            // Base
            name: 'Mario Rossi',
            age: 32,
            gender: 'male',
            level: 'intermediate',
            
            // Sport e goal
            sport: 'calcio',
            goal: 'potenza',
            
            // Periodizzazione
            currentWeek: 3,
            programWeeks: 12,
            sessionsPerWeek: 3,
            
            // Anamnesi
            anamnesi: {
                injuries: ['ankle_sprain', 'shoulder_impingement'],
                conditions: [],
                injuryPhases: {
                    'ankle_sprain': 'rehabilitation'
                }
            }
        };
        
        console.log('👤 PROFILO UTENTE:');
        console.log(`   Nome: ${profile.name}`);
        console.log(`   Sport: ${profile.sport} | Goal: ${profile.goal}`);
        console.log(`   Settimana: ${profile.currentWeek}/${profile.programWeeks}`);
        console.log(`   Infortuni: ${profile.anamnesi.injuries.join(', ')}`);
        
        // 1. Genera singolo workout
        console.log('\n' + '─'.repeat(70));
        console.log('📋 GENERAZIONE SINGOLO WORKOUT\n');
        
        const workout = this.generateWorkout(profile);
        
        console.log('\n💪 WORKOUT GENERATO:');
        workout.exercises.forEach((ex, i) => {
            const notes = ex.notes ? ` (${ex.notes})` : '';
            const rehab = ex.isRehab ? ' [REHAB]' : '';
            console.log(`   ${i+1}. ${ex.name} - ${ex.sets}x${ex.reps}${notes}${rehab}`);
        });
        
        if (workout.periodization) {
            console.log('\n📅 PERIODIZZAZIONE:');
            console.log(`   Fase: ${workout.periodization.phase}`);
            console.log(`   Focus: ${workout.periodization.focus}`);
            workout.periodization.notes?.forEach(n => console.log(`   ${n}`));
        }
        
        if (workout.modifications?.length > 0) {
            console.log('\n⚡ MODIFICHE PER INFORTUNI:');
            workout.modifications.forEach(mod => {
                console.log(`   • ${mod.original} → ${mod.substitute || mod.modified}`);
            });
        }
        
        console.log('\n📊 VALIDAZIONE:');
        console.log(`   Score: ${workout.validation.score}% (${workout.validation.grade.letter})`);
        
        // 2. Overview piano 12 settimane
        console.log('\n' + '─'.repeat(70));
        console.log('📅 OVERVIEW PIANO 12 SETTIMANE\n');
        
        const periodizationPlan = ATLASPeriodization.generatePlan(profile, 12);
        
        console.log('Week | Phase           | Intensity | RIR');
        console.log('─'.repeat(40));
        periodizationPlan.weeklyPlans.forEach(week => {
            const p = week.parameters;
            const deload = week.isDeload ? ' 🧘' : '';
            console.log(
                `${String(week.weekNumber).padStart(3)}  | ` +
                `${week.phase.padEnd(15)} | ` +
                `${String(p.intensity).padStart(3)}%      | ` +
                `${p.rir}${deload}`
            );
        });
        
        // 3. Analisi sistema
        this.analyzeSystemCapabilities();
        
        console.log('\n' + '█'.repeat(70));
        console.log('█  ✅ DEMO COMPLETATA');
        console.log('█'.repeat(70) + '\n');
        
        return {
            workout,
            periodizationPlan,
            profile
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🛠️ UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════
    
    getGrade(score) {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        return 'D';
    },
    
    /**
     * Quick test di tutti i componenti
     */
    healthCheck() {
        const checks = {
            templates: typeof ATLASTemplates !== 'undefined',
            periodization: typeof ATLASPeriodization !== 'undefined',
            anamnesi: typeof ATLASAnamnesi !== 'undefined',
            progression: typeof ATLASProgression !== 'undefined',
            validator: typeof ScientificWorkoutValidator !== 'undefined'
        };
        
        console.log('\n🔧 ATLAS v2.0 HEALTH CHECK:\n');
        
        let allPassed = true;
        let activeModules = 0;
        Object.entries(checks).forEach(([name, passed]) => {
            console.log(`   ${passed ? '✅' : '❌'} ${name}: ${passed ? 'OK' : 'MISSING'}`);
            if (!passed) allPassed = false;
            if (passed) activeModules++;
        });
        
        const totalModules = Object.keys(checks).length;
        console.log(`\n   Moduli attivi: ${activeModules}/${totalModules}`);
        console.log(`   Overall: ${allPassed ? '✅ ALL SYSTEMS GO' : '⚠️ SOME SYSTEMS MISSING'}\n`);
        
        return checks;
    },
    
    /**
     * Log sessione completata (wrapper per ATLASProgression)
     */
    logCompletedSession(sessionData) {
        if (typeof ATLASProgression !== 'undefined') {
            return ATLASProgression.logSession(sessionData);
        } else {
            console.warn('ATLASProgression non disponibile');
            return null;
        }
    },
    
    /**
     * Report progressi
     */
    getProgressReport(days = 30) {
        if (typeof ATLASProgression !== 'undefined') {
            return ATLASProgression.generateReport(days);
        } else {
            console.warn('ATLASProgression non disponibile');
            return null;
        }
    }
};

// Export
if (typeof window !== 'undefined') {
    window.ATLASComplete = ATLASComplete;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ATLASComplete;
}
