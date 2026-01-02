/**
 * GR Perform - Scientific Models v1.0
 * 
 * Modelli scientifici VALIDATI dalla letteratura per:
 * - Boxe, Calcio, Basket, Fitness/Palestra
 * 
 * Basato su:
 * - Prilepin's Chart (1974) - Volume ottimale per intensità
 * - Zatsiorsky & Kraemer - Science of Strength Training
 * - Bompa & Haff - Periodization Theory
 * - NSCA Essentials of Strength Training
 * - ACSM Guidelines
 * - Sport-specific research papers
 */

window.ScientificModels = (function() {
    'use strict';
    
    const VERSION = '1.0';
    
    // ═══════════════════════════════════════════════════════════════
    // PRILEPIN'S CHART - Volume ottimale basato su intensità
    // Fondamento scientifico per programmazione forza
    // ═══════════════════════════════════════════════════════════════
    
    const PRILEPIN_CHART = {
        // Intensità (% 1RM) → { repsPerSet, optimalTotal, range }
        zones: [
            { minPct: 55, maxPct: 65, repsPerSet: { min: 3, max: 6 }, optimalTotal: 24, range: { min: 18, max: 30 } },
            { minPct: 70, maxPct: 75, repsPerSet: { min: 3, max: 6 }, optimalTotal: 18, range: { min: 12, max: 24 } },
            { minPct: 80, maxPct: 85, repsPerSet: { min: 2, max: 4 }, optimalTotal: 15, range: { min: 10, max: 20 } },
            { minPct: 90, maxPct: 100, repsPerSet: { min: 1, max: 2 }, optimalTotal: 7, range: { min: 4, max: 10 } }
        ],
        
        /**
         * Calcola volume ottimale per un dato % 1RM
         * @param {number} intensityPct - Percentuale del 1RM (55-100)
         * @returns {Object} { repsPerSet, sets, totalReps }
         */
        getOptimalVolume(intensityPct) {
            const zone = this.zones.find(z => intensityPct >= z.minPct && intensityPct <= z.maxPct);
            if (!zone) {
                // Fallback per intensità fuori range
                if (intensityPct < 55) {
                    return { repsPerSet: { min: 6, max: 12 }, sets: 3, totalReps: 24, zone: 'hypertrophy' };
                }
                return { repsPerSet: { min: 1, max: 2 }, sets: 5, totalReps: 7, zone: 'max_strength' };
            }
            
            const avgReps = Math.round((zone.repsPerSet.min + zone.repsPerSet.max) / 2);
            const sets = Math.round(zone.optimalTotal / avgReps);
            
            return {
                repsPerSet: zone.repsPerSet,
                sets: Math.max(3, Math.min(6, sets)),
                totalReps: zone.optimalTotal,
                range: zone.range,
                zone: intensityPct >= 85 ? 'max_strength' : intensityPct >= 70 ? 'strength' : 'strength_endurance'
            };
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // RECOVERY TIME MODELS - Tempi di recupero basati su scienza
    // ═══════════════════════════════════════════════════════════════
    
    const RECOVERY_MODELS = {
        /**
         * Tempo di recupero intra-set basato su sistema energetico
         * Fonte: NSCA Essentials, Bompa
         */
        intraSetRest: {
            // Sistema fosfageno (ATP-PC): 1-6 rep max effort
            phosphagen: {
                minSeconds: 180,
                optimalSeconds: 240,
                maxSeconds: 300,
                rationale: 'ATP-PC resynthesis richiede 3-5 min per recupero completo'
            },
            // Sistema glicolitico: 6-12 rep
            glycolytic: {
                minSeconds: 90,
                optimalSeconds: 120,
                maxSeconds: 180,
                rationale: 'Clearance lattato e recupero parziale ATP'
            },
            // Sistema ossidativo: 12+ rep
            oxidative: {
                minSeconds: 30,
                optimalSeconds: 60,
                maxSeconds: 90,
                rationale: 'Recupero rapido, stress metabolico desiderato'
            }
        },
        
        /**
         * Calcola rest ottimale in base a rep e tipo esercizio
         */
        calculateOptimalRest(reps, exerciseType, isCompound = true) {
            let system;
            
            if (reps <= 5) {
                system = this.intraSetRest.phosphagen;
            } else if (reps <= 12) {
                system = this.intraSetRest.glycolytic;
            } else {
                system = this.intraSetRest.oxidative;
            }
            
            // Compound movements richiedono più recupero
            const compoundMultiplier = isCompound ? 1.2 : 1.0;
            
            return {
                minRest: Math.round(system.minSeconds * compoundMultiplier),
                optimalRest: Math.round(system.optimalSeconds * compoundMultiplier),
                maxRest: Math.round(system.maxSeconds * compoundMultiplier),
                system: reps <= 5 ? 'phosphagen' : reps <= 12 ? 'glycolytic' : 'oxidative',
                rationale: system.rationale
            };
        },
        
        /**
         * Tempo di recupero tra sessioni per gruppo muscolare
         * Fonte: Schoenfeld 2016, meta-analysis
         */
        interSessionRecovery: {
            // Ore minime tra sessioni che colpiscono stesso gruppo muscolare
            byIntensity: {
                maximal: 72,      // >90% 1RM
                high: 48,         // 75-90% 1RM  
                moderate: 36,     // 60-75% 1RM
                low: 24           // <60% 1RM
            },
            
            // Fattori che modificano recupero
            modifiers: {
                age_over_40: 1.25,        // +25% tempo recupero
                age_over_50: 1.5,         // +50% tempo recupero
                beginner: 1.3,            // Principianti: +30%
                advanced: 0.85,           // Avanzati: -15%
                poor_sleep: 1.4,          // Sonno scarso: +40%
                high_stress: 1.3,         // Stress alto: +30%
                good_nutrition: 0.9,      // Nutrizione ottimale: -10%
                active_recovery: 0.85     // Recovery attivo: -15%
            }
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // VOLUME LANDMARKS - Riferimenti volume settimanale
    // Fonte: Israetel, Schoenfeld, meta-analyses
    // ═══════════════════════════════════════════════════════════════
    
    const VOLUME_LANDMARKS = {
        // Sets per gruppo muscolare per settimana
        perMuscleGroup: {
            maintenance: { min: 6, max: 10 },    // Mantenimento guadagni
            minimum: { min: 10, max: 12 },       // Minimo per progresso
            optimal: { min: 12, max: 20 },       // Range ottimale
            maximum: { min: 20, max: 25 },       // Massimo recuperabile (MAV)
            overreaching: { min: 25, max: 30 }   // Oltre = overtraining risk
        },
        
        // Aggiustamento per livello atleta
        byExperience: {
            beginner: { multiplier: 0.7, maxSetsPerSession: 12 },
            intermediate: { multiplier: 1.0, maxSetsPerSession: 16 },
            advanced: { multiplier: 1.2, maxSetsPerSession: 20 }
        },
        
        /**
         * Calcola volume settimanale ottimale
         */
        calculateWeeklyVolume(muscleGroup, experience = 'intermediate', goal = 'hypertrophy') {
            const base = this.perMuscleGroup.optimal;
            const expMod = this.byExperience[experience] || this.byExperience.intermediate;
            
            let goalMod = 1.0;
            if (goal === 'strength') goalMod = 0.8;  // Meno volume, più intensità
            if (goal === 'endurance') goalMod = 1.2; // Più volume, meno intensità
            
            return {
                min: Math.round(base.min * expMod.multiplier * goalMod),
                max: Math.round(base.max * expMod.multiplier * goalMod),
                perSession: Math.round(expMod.maxSetsPerSession * goalMod)
            };
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // SPORT-SPECIFIC MODELS
    // ═══════════════════════════════════════════════════════════════
    
    const SPORT_MODELS = {
        // ───────────────────────────────────────────────────────────
        // BOXE - Modello basato su sport science pugilistica
        // ───────────────────────────────────────────────────────────
        boxe: {
            name: 'Boxing Performance Model',
            
            // Struttura sessione ottimale (ordine INVIOLABILE)
            sessionStructure: [
                { phase: 'warmup', minMinutes: 10, maxMinutes: 15, order: 1 },
                { phase: 'strength', minMinutes: 20, maxMinutes: 30, order: 2, condition: 'strength_day' },
                { phase: 'power', minMinutes: 10, maxMinutes: 15, order: 3, condition: 'power_day' },
                { phase: 'conditioning', minMinutes: 15, maxMinutes: 25, order: 4 },
                { phase: 'accessories', minMinutes: 10, maxMinutes: 15, order: 5 },
                { phase: 'cooldown', minMinutes: 5, maxMinutes: 10, order: 6 }
            ],
            
            // Rapporti forza ottimali (research-based)
            strengthRatios: {
                // Rapporto push/pull per salute spalla
                pushPull: { optimal: 1.0, acceptable: { min: 0.8, max: 1.2 } },
                // Rapporto quad/hamstring per prevenzione infortuni
                quadHamstring: { optimal: 0.6, acceptable: { min: 0.5, max: 0.8 } },
                // Rapporto agonista/antagonista rotatori spalla
                externalInternalRotation: { optimal: 0.66, acceptable: { min: 0.6, max: 0.75 } }
            },
            
            // Volume boxing rounds per sessione
            roundsPerSession: {
                beginner: { total: 6, shadow: 2, bag: 2, pads: 2 },
                intermediate: { total: 9, shadow: 3, bag: 3, pads: 3 },
                advanced: { total: 12, shadow: 4, bag: 4, pads: 4 }
            },
            
            // Protocollo collo (FISSO, basato su injury prevention research)
            neckProtocol: {
                sets: 3,
                reps: { min: 12, max: 15 },
                directions: ['flexion', 'extension', 'lateral_left', 'lateral_right'],
                restSeconds: 30,
                frequency: 'every_session',
                rationale: 'Cervical strengthening riduce rischio trauma cranico del 40%'
            },
            
            // Recupero tra round (simula competizione)
            roundRest: {
                shadow: 60,
                heavyBag: 60,
                pads: 60,
                sparring: 60,
                rationale: 'Simula 1 minuto di recupero tra round in competizione'
            }
        },
        
        // ───────────────────────────────────────────────────────────
        // CALCIO - Modello basato su sport science calcistica
        // ───────────────────────────────────────────────────────────
        calcio: {
            name: 'Football Performance Model',
            
            sessionStructure: [
                { phase: 'warmup', minMinutes: 12, maxMinutes: 18, order: 1 },
                { phase: 'strength', minMinutes: 20, maxMinutes: 30, order: 2 },
                { phase: 'plyometrics', minMinutes: 10, maxMinutes: 15, order: 3 },
                { phase: 'speed', minMinutes: 10, maxMinutes: 15, order: 4 },
                { phase: 'conditioning', minMinutes: 15, maxMinutes: 20, order: 5 },
                { phase: 'cooldown', minMinutes: 8, maxMinutes: 12, order: 6 }
            ],
            
            // Injury prevention protocols (FIFA 11+, Nordic research)
            injuryPrevention: {
                nordic: { 
                    sets: 3, 
                    reps: { min: 5, max: 8 },
                    frequency: '2x_week',
                    rationale: 'Riduce infortuni hamstring del 51% (Petersen 2011)'
                },
                copenhagen: { 
                    sets: 2, 
                    reps: { min: 8, max: 10 },
                    frequency: '2x_week',
                    rationale: 'Riduce infortuni adduttori del 41% (Harøy 2019)'
                }
            },
            
            // Plyometrics volume (contatti per sessione)
            plyometricsVolume: {
                beginner: { total: 40, perExercise: 10 },
                intermediate: { total: 80, perExercise: 15 },
                advanced: { total: 120, perExercise: 20 }
            },
            
            // Match Day logic
            matchDayModel: {
                'md-4': { intensity: 0.9, volume: 0.9, focus: 'strength_power' },
                'md-3': { intensity: 0.85, volume: 0.8, focus: 'speed_agility' },
                'md-2': { intensity: 0.7, volume: 0.6, focus: 'tactical_light' },
                'md-1': { intensity: 0.5, volume: 0.4, focus: 'activation_priming' },
                'md0': { intensity: 0, volume: 0, focus: 'match' },
                'md+1': { intensity: 0.3, volume: 0.3, focus: 'recovery' },
                'md+2': { intensity: 0.6, volume: 0.5, focus: 'regeneration' }
            }
        },
        
        // ───────────────────────────────────────────────────────────
        // BASKET - Modello basato su sport science basket
        // ───────────────────────────────────────────────────────────
        basket: {
            name: 'Basketball Performance Model',
            
            sessionStructure: [
                { phase: 'warmup', minMinutes: 12, maxMinutes: 15, order: 1 },
                { phase: 'strength', minMinutes: 20, maxMinutes: 25, order: 2 },
                { phase: 'power', minMinutes: 10, maxMinutes: 15, order: 3 },
                { phase: 'agility', minMinutes: 10, maxMinutes: 15, order: 4 },
                { phase: 'conditioning', minMinutes: 15, maxMinutes: 20, order: 5 },
                { phase: 'cooldown', minMinutes: 8, maxMinutes: 10, order: 6 }
            ],
            
            // Vertical jump focus
            verticalJumpProtocol: {
                compound: { exercise: 'squat', sets: 4, reps: 5, rest: 180 },
                power: { exercise: 'box_jump', sets: 4, reps: 5, rest: 90 },
                reactive: { exercise: 'depth_jump', sets: 3, reps: 4, rest: 120 }
            },
            
            // Ankle/knee injury prevention
            injuryPrevention: {
                ankleStability: { sets: 2, reps: 30, type: 'seconds', frequency: 'every_session' },
                landingMechanics: { sets: 3, reps: 8, frequency: '2x_week' }
            },
            
            // Game day model
            gameDayModel: {
                'g-3': { intensity: 0.9, volume: 0.9, focus: 'strength' },
                'g-2': { intensity: 0.8, volume: 0.7, focus: 'power_speed' },
                'g-1': { intensity: 0.5, volume: 0.4, focus: 'activation' },
                'g0': { intensity: 0, volume: 0, focus: 'game' },
                'g+1': { intensity: 0.3, volume: 0.3, focus: 'recovery' }
            }
        },
        
        // ───────────────────────────────────────────────────────────
        // PALESTRA/FITNESS - Modello bodybuilding/fitness
        // ───────────────────────────────────────────────────────────
        palestra: {
            name: 'Fitness/Bodybuilding Model',
            
            sessionStructure: [
                { phase: 'warmup', minMinutes: 8, maxMinutes: 12, order: 1 },
                { phase: 'compound', minMinutes: 25, maxMinutes: 35, order: 2 },
                { phase: 'accessories', minMinutes: 15, maxMinutes: 25, order: 3 },
                { phase: 'isolation', minMinutes: 10, maxMinutes: 15, order: 4 },
                { phase: 'core', minMinutes: 5, maxMinutes: 10, order: 5 },
                { phase: 'cooldown', minMinutes: 5, maxMinutes: 8, order: 6 }
            ],
            
            // Split templates
            splitTemplates: {
                fullBody: { daysPerWeek: 3, muscleGroupsPerSession: 'all' },
                upperLower: { daysPerWeek: 4, muscleGroupsPerSession: 'half' },
                ppl: { daysPerWeek: 6, muscleGroupsPerSession: 'third' }
            },
            
            // Volume per sessione per gruppo muscolare
            volumePerSession: {
                large: { min: 9, max: 12 },   // Petto, schiena, gambe
                medium: { min: 6, max: 9 },   // Spalle, bicipiti, tricipiti
                small: { min: 4, max: 6 }     // Core, avambracci, polpacci
            }
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // PERIODIZATION MODELS
    // ═══════════════════════════════════════════════════════════════
    
    const PERIODIZATION_MODELS = {
        /**
         * Modello lineare classico (Matveyev)
         */
        linear: {
            phases: [
                { name: 'preparatory_general', weeks: 4, volume: 0.9, intensity: 0.6 },
                { name: 'preparatory_specific', weeks: 4, volume: 0.8, intensity: 0.75 },
                { name: 'competition', weeks: 3, volume: 0.6, intensity: 0.9 },
                { name: 'transition', weeks: 1, volume: 0.4, intensity: 0.5 }
            ]
        },
        
        /**
         * Modello ondulatorio (DUP - Daily Undulating Periodization)
         */
        undulating: {
            weekPattern: [
                { day: 1, focus: 'hypertrophy', volume: 0.9, intensity: 0.7 },
                { day: 2, focus: 'strength', volume: 0.7, intensity: 0.85 },
                { day: 3, focus: 'power', volume: 0.6, intensity: 0.9 }
            ]
        },
        
        /**
         * Modello a blocchi (Issurin)
         */
        block: {
            blocks: [
                { name: 'accumulation', weeks: 3, volume: 0.95, intensity: 0.65, focus: 'work_capacity' },
                { name: 'transmutation', weeks: 3, volume: 0.75, intensity: 0.8, focus: 'sport_specific' },
                { name: 'realization', weeks: 2, volume: 0.5, intensity: 0.95, focus: 'peak_performance' }
            ]
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // FATIGUE & RECOVERY FORMULAS
    // ═══════════════════════════════════════════════════════════════
    
    const FATIGUE_FORMULAS = {
        /**
         * ACWR - Acute:Chronic Workload Ratio
         * Gabbett (2016) - Training-injury prevention paradox
         */
        calculateACWR(acuteLoad, chronicLoad) {
            if (chronicLoad === 0) return 0;
            const acwr = acuteLoad / chronicLoad;
            
            return {
                value: Math.round(acwr * 100) / 100,
                zone: acwr < 0.8 ? 'undertraining' :
                      acwr <= 1.3 ? 'optimal' :
                      acwr <= 1.5 ? 'caution' : 'danger',
                recommendation: acwr < 0.8 ? 'Aumentare carico gradualmente' :
                                acwr <= 1.3 ? 'Zona ottimale - continuare' :
                                acwr <= 1.5 ? 'Ridurre volume 10-20%' : 'Deload immediato'
            };
        },
        
        /**
         * Training Stress Score (TSS) semplificato
         * Basato su RPE e durata
         */
        calculateTSS(rpe, durationMinutes) {
            // TSS = (RPE/10) * (duration/60) * 100
            const tss = (rpe / 10) * (durationMinutes / 60) * 100;
            return Math.round(tss);
        },
        
        /**
         * Readiness Score basato su HRV, sonno, fatica percepita
         */
        calculateReadiness(hrv, hrvBaseline, sleepHours, perceivedFatigue) {
            // HRV component (0-40 points)
            const hrvScore = hrvBaseline > 0 
                ? Math.min(40, Math.max(0, 40 * (hrv / hrvBaseline)))
                : 20;
            
            // Sleep component (0-30 points)
            const sleepScore = Math.min(30, (sleepHours / 8) * 30);
            
            // Fatigue component (0-30 points, inverse)
            const fatigueScore = 30 - (perceivedFatigue / 10) * 30;
            
            const total = Math.round(hrvScore + sleepScore + fatigueScore);
            
            return {
                score: total,
                category: total >= 80 ? 'excellent' :
                          total >= 60 ? 'good' :
                          total >= 40 ? 'moderate' : 'poor',
                recommendation: total >= 80 ? 'Push day - alta intensità ok' :
                                total >= 60 ? 'Normal training' :
                                total >= 40 ? 'Ridurre intensità 10-20%' : 'Recovery day consigliato'
            };
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // EXERCISE CLASSIFICATION
    // ═══════════════════════════════════════════════════════════════
    
    const EXERCISE_CLASSIFICATION = {
        // Classificazione per catena cinetica
        compound: {
            lower: ['squat', 'deadlift', 'lunge', 'leg_press', 'hip_thrust'],
            upper_push: ['bench_press', 'overhead_press', 'dip'],
            upper_pull: ['row', 'pull_up', 'chin_up', 'lat_pulldown']
        },
        
        // Classificazione per pattern di movimento
        movementPatterns: {
            squat: { primary: 'quads', secondary: ['glutes', 'hamstrings', 'core'] },
            hinge: { primary: 'hamstrings', secondary: ['glutes', 'lower_back', 'core'] },
            push_horizontal: { primary: 'chest', secondary: ['triceps', 'front_delt'] },
            push_vertical: { primary: 'shoulders', secondary: ['triceps', 'upper_chest'] },
            pull_horizontal: { primary: 'lats', secondary: ['biceps', 'rear_delt', 'rhomboids'] },
            pull_vertical: { primary: 'lats', secondary: ['biceps', 'rear_delt'] },
            carry: { primary: 'core', secondary: ['grip', 'traps', 'total_body'] }
        },
        
        /**
         * Identifica pattern di movimento da nome esercizio
         */
        identifyPattern(exerciseName) {
            const name = exerciseName.toLowerCase();
            
            if (/squat|leg\s*press|lunge|split|step/i.test(name)) return 'squat';
            if (/deadlift|rdl|hip\s*hinge|good\s*morning|hip\s*thrust/i.test(name)) return 'hinge';
            if (/bench|push\s*up|chest\s*press|dip/i.test(name)) return 'push_horizontal';
            if (/overhead|shoulder\s*press|ohp|military/i.test(name)) return 'push_vertical';
            if (/row|cable\s*row|seated\s*row/i.test(name)) return 'pull_horizontal';
            if (/pull\s*up|chin\s*up|lat\s*pull/i.test(name)) return 'pull_vertical';
            if (/carry|walk|farmer/i.test(name)) return 'carry';
            
            return 'isolation';
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════
    
    console.log(`🔬 ScientificModels v${VERSION} loaded - Evidence-based training models ready`);
    
    return {
        VERSION,
        
        // Modelli core
        prilepin: PRILEPIN_CHART,
        recovery: RECOVERY_MODELS,
        volume: VOLUME_LANDMARKS,
        
        // Sport-specific
        sports: SPORT_MODELS,
        getSportModel: (sport) => SPORT_MODELS[sport] || SPORT_MODELS.palestra,
        
        // Periodization
        periodization: PERIODIZATION_MODELS,
        
        // Formule
        fatigue: FATIGUE_FORMULAS,
        
        // Exercise classification
        exercises: EXERCISE_CLASSIFICATION,
        
        // Helper functions
        getOptimalVolume: (intensity) => PRILEPIN_CHART.getOptimalVolume(intensity),
        getOptimalRest: (reps, type, isCompound) => RECOVERY_MODELS.calculateOptimalRest(reps, type, isCompound),
        calculateACWR: (acute, chronic) => FATIGUE_FORMULAS.calculateACWR(acute, chronic),
        calculateReadiness: (hrv, baseline, sleep, fatigue) => FATIGUE_FORMULAS.calculateReadiness(hrv, baseline, sleep, fatigue)
    };
})();
