// ═══════════════════════════════════════════════════════════════════════════
// GR PERFORM - SCIENTIFIC WORKOUT VALIDATOR
// Sistema di valutazione scientifica NASA-level per workout
// ═══════════════════════════════════════════════════════════════════════════

const ScientificWorkoutValidator = {
    
    // ═══════════════════════════════════════════════════════════════════════
    // CONFIGURAZIONE SCIENTIFICA
    // ═══════════════════════════════════════════════════════════════════════
    
    // Database pattern movimento per categorizzazione esercizi
    movementPatterns: {
        hip_hinge: ['deadlift', 'rdl', 'romanian', 'hip thrust', 'good morning', 'swing', 'pull through'],
        squat: ['squat', 'goblet', 'front squat', 'back squat', 'split squat', 'lunge', 'leg press'],
        horizontal_push: ['bench', 'push-up', 'pushup', 'chest press', 'dumbbell press', 'floor press', 'clap push'],
        horizontal_pull: ['row', 'cable row', 'dumbbell row', 'barbell row', 'inverted row', 't-bar'],
        vertical_push: ['overhead press', 'military press', 'shoulder press', 'ohp', 'push press', 'landmine press'],
        vertical_pull: ['pull-up', 'pullup', 'chin-up', 'chinup', 'lat pulldown', 'pulldown'],
        knee_flexion: ['leg curl', 'hamstring curl', 'nordic', 'glute ham'],
        knee_extension: ['leg extension', 'quad extension'],
        hip_abduction: ['lateral raise', 'band walk', 'clamshell', 'side lying'],
        hip_adduction: ['copenhagen', 'adductor', 'squeeze'],
        core_anti_extension: ['plank', 'dead bug', 'ab wheel', 'rollout', 'hollow'],
        core_anti_rotation: ['pallof', 'bird dog', 'renegade row', 'anti-rotation'],
        core_anti_lateral: ['side plank', 'suitcase carry', 'farmer walk'],
        core_rotation: ['russian twist', 'woodchop', 'cable rotation', 'med ball throw', 'landmine rotation'],
        plyometric: ['jump', 'bound', 'hop', 'plyo', 'box jump', 'depth jump', 'broad jump'],
        power: ['clean', 'snatch', 'jerk', 'throw', 'slam', 'explosive', 'dumbbell snatch', 'medicine ball'],
        carry: ['farmer', 'carry', 'walk', 'suitcase'],
        isolation_upper: ['curl', 'tricep', 'lateral raise', 'front raise', 'rear delt', 'face pull', 'shrug'],
        isolation_lower: ['calf raise', 'leg extension', 'leg curl', 'hip flexor'],
        conditioning: ['sprint', 'interval', 'hiit', 'circuit', 'cardio', 'run', 'bike', 'row', 'burpee', 'battle rope'],
        mobility: ['stretch', 'mobility', 'foam roll', 'dynamic', 'warm-up', 'warmup', 'cool-down', 'cooldown'],
        
        // COMBAT SPORTS PATTERNS
        boxing_technique: ['shadow boxing', 'jab', 'cross', 'hook', 'uppercut', 'combination', 'combo'],
        boxing_bag: ['heavy bag', 'speed bag', 'double end', 'bag work', 'power shots'],
        boxing_footwork: ['footwork', 'pivot', 'lateral movement', 'angle', 'step'],
        boxing_defense: ['slip', 'bob', 'weave', 'parry', 'block', 'defense'],
        boxing_conditioning: ['jump rope', 'skip', 'tabata', 'rounds'],
        sport_skill: ['drill', 'technique', 'skill', 'practice', 'shadow']
    },
    
    // Muscoli target per pattern
    muscleTargets: {
        hip_hinge: ['hamstrings', 'glutes', 'erectors'],
        squat: ['quads', 'glutes', 'adductors'],
        horizontal_push: ['chest', 'front_delts', 'triceps'],
        horizontal_pull: ['lats', 'rhomboids', 'rear_delts', 'biceps'],
        vertical_push: ['shoulders', 'triceps', 'upper_chest'],
        vertical_pull: ['lats', 'biceps', 'rear_delts'],
        knee_flexion: ['hamstrings'],
        knee_extension: ['quads'],
        core_anti_extension: ['abs', 'core'],
        core_anti_rotation: ['obliques', 'core'],
        core_rotation: ['obliques', 'core'],
        plyometric: ['fast_twitch', 'cns'],
        power: ['full_body', 'cns'],
        conditioning: ['cardiovascular', 'endurance'],
        
        // Combat sports targets
        boxing_technique: ['shoulders', 'core', 'cns', 'coordination'],
        boxing_bag: ['shoulders', 'core', 'power', 'endurance'],
        boxing_footwork: ['calves', 'quads', 'coordination', 'agility'],
        boxing_defense: ['core', 'coordination', 'reaction'],
        boxing_conditioning: ['cardiovascular', 'endurance', 'calves'],
        sport_skill: ['coordination', 'cns', 'skill']
    },
    
    // SFR (Stimulus to Fatigue Ratio) per pattern - 1-10
    sfr_ratings: {
        hip_hinge: 8,        // Alto stimolo, fatica gestibile
        squat: 7,            // Alto stimolo, alta fatica
        horizontal_push: 7,
        horizontal_pull: 8,  // Ottimo SFR
        vertical_push: 7,
        vertical_pull: 9,    // Eccellente SFR (chin-up, pull-up)
        knee_flexion: 6,     // Buono
        knee_extension: 4,   // Basso SFR - stress articolare
        plyometric: 6,       // Alto impatto CNS
        power: 5,            // Molto tassante
        isolation_upper: 5,
        isolation_lower: 4,
        core_anti_extension: 8,
        core_anti_rotation: 8,
        core_rotation: 7,
        mobility: 10,        // Nessuna fatica
        conditioning: 5,     // Dipende
        
        // Combat sports SFR - alti perché sport-specifici
        boxing_technique: 9,     // Ottimo per skill
        boxing_bag: 7,           // Buono
        boxing_footwork: 8,      // Eccellente
        boxing_defense: 9,       // Ottimo per skill
        boxing_conditioning: 7,  // Buono
        sport_skill: 9           // Sport-specific = high value
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // 1. ANALISI VOLUME
    // ═══════════════════════════════════════════════════════════════════════
    
    analyzeVolume(workout, profile) {
        const result = {
            category: 'volume',
            score: 0,
            maxScore: 100,
            findings: [],
            details: {}
        };
        
        if (!workout.exercises || workout.exercises.length === 0) {
            result.findings.push({ type: 'error', msg: 'Nessun esercizio presente' });
            return result;
        }
        
        // Check se è workout sport-specific
        const isSportWorkout = ['boxe', 'mma', 'calcio', 'basket', 'tennis', 'nuoto', 'ciclismo', 'corsa', 'crossfit']
            .includes(workout.sport?.toLowerCase());
        
        // Calcola sets totali
        let totalSets = 0;
        let totalReps = 0;
        const muscleVolume = {};
        
        workout.exercises.forEach(ex => {
            const sets = parseInt(ex.sets) || 0;
            const reps = this.parseReps(ex.reps);
            totalSets += sets;
            totalReps += sets * reps;
            
            // Identifica pattern e muscoli
            const pattern = this.identifyPattern(ex.name);
            const muscles = this.muscleTargets[pattern] || ['unknown'];
            
            muscles.forEach(m => {
                muscleVolume[m] = (muscleVolume[m] || 0) + sets;
            });
        });
        
        result.details = { totalSets, totalReps, muscleVolume };
        
        // Valutazione volume totale per sessione
        // Per sport-specific, range più ampio è accettabile
        const minSets = isSportWorkout ? 8 : 10;
        const optimalMin = isSportWorkout ? 12 : 15;
        const optimalMax = isSportWorkout ? 35 : 30;
        const maxSets = isSportWorkout ? 40 : 35;
        
        if (totalSets >= optimalMin && totalSets <= optimalMax) {
            result.score += 30;
            result.findings.push({ type: 'success', msg: `Volume totale ottimale: ${totalSets} sets` });
        } else if (totalSets >= minSets && totalSets <= maxSets) {
            result.score += 20;
            result.findings.push({ type: 'warning', msg: `Volume accettabile: ${totalSets} sets` });
        } else if (totalSets < minSets) {
            result.score += 15; // Meno penalizzante per sport-specific
            result.findings.push({ type: 'warning', msg: `Volume basso: ${totalSets} sets - potrebbe essere insufficiente` });
        } else {
            result.findings.push({ type: 'error', msg: `Volume eccessivo: ${totalSets} sets - rischio overtraining` });
        }
        
        // Valutazione distribuzione muscolare
        const hasBalancedDistribution = this.checkMuscleBalance(muscleVolume, profile);
        if (hasBalancedDistribution.balanced) {
            result.score += 30;
            result.findings.push({ type: 'success', msg: 'Distribuzione volume muscolare bilanciata' });
        } else {
            result.score += 10;
            result.findings.push({ type: 'warning', msg: hasBalancedDistribution.issue });
        }
        
        // Volume appropriato per livello
        const levelMultiplier = { principiante: 0.7, intermedio: 1.0, avanzato: 1.2, elite: 1.3 };
        const expectedSets = 20 * (levelMultiplier[profile.level] || 1);
        
        if (Math.abs(totalSets - expectedSets) < 8) {
            result.score += 20;
            result.findings.push({ type: 'success', msg: `Volume adeguato per livello ${profile.level}` });
        } else {
            result.score += 10;
            result.findings.push({ type: 'info', msg: `Volume potrebbe essere aggiustato per livello ${profile.level}` });
        }
        
        // Bonus per volume intelligente (pochi esercizi, alto volume = OK)
        const avgSetsPerExercise = totalSets / workout.exercises.length;
        if (avgSetsPerExercise >= 3 && avgSetsPerExercise <= 5) {
            result.score += 20;
            result.findings.push({ type: 'success', msg: `Media ${avgSetsPerExercise.toFixed(1)} sets/esercizio - efficiente` });
        }
        
        return result;
    },
    
    parseReps(repsStr) {
        if (!repsStr) return 10;
        const str = String(repsStr).toLowerCase();
        
        // "8-10" -> media 9
        const rangeMatch = str.match(/(\d+)\s*[-–]\s*(\d+)/);
        if (rangeMatch) {
            return (parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2;
        }
        
        // "3 min" o "2 min" -> equivalente a ~20 reps per minuto
        if (str.includes('min')) {
            const mins = parseInt(str) || 2;
            return mins * 15; // Boxing round ~15 "reps" equivalent per minute
        }
        
        // "30s" -> ~10 equivalente
        if (str.includes('s') || str.includes('sec')) {
            const secs = parseInt(str) || 30;
            return Math.round(secs / 3);
        }
        
        // "round" -> ~30 reps equivalent (3 min round)
        if (str.includes('round')) {
            return 30;
        }
        
        // "AMRAP" -> ~12
        if (str.includes('amrap') || str.includes('max')) return 12;
        
        // "on/off" patterns like "20s on / 10s off" -> count as ~10
        if (str.includes('on') || str.includes('off')) {
            return 10;
        }
        
        return parseInt(str) || 10;
    },
    
    checkMuscleBalance(muscleVolume, profile) {
        // Push vs Pull
        const pushVol = (muscleVolume.chest || 0) + (muscleVolume.shoulders || 0) + (muscleVolume.triceps || 0);
        const pullVol = (muscleVolume.lats || 0) + (muscleVolume.rhomboids || 0) + (muscleVolume.biceps || 0);
        
        if (pushVol > 0 && pullVol > 0) {
            const ratio = pushVol / pullVol;
            if (ratio < 0.5 || ratio > 2) {
                return { balanced: false, issue: `Sbilanciamento push/pull: ${pushVol}/${pullVol}` };
            }
        }
        
        // Quad vs Hamstring per sport
        if (['calcio', 'basket', 'boxe'].includes(profile.sport)) {
            const quadVol = muscleVolume.quads || 0;
            const hamVol = muscleVolume.hamstrings || 0;
            
            if (quadVol > 0 && hamVol === 0) {
                return { balanced: false, issue: 'Mancano hamstring - rischio infortunio per sport' };
            }
        }
        
        return { balanced: true };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // 2. ANALISI SEQUENZA FISIOLOGICA
    // ═══════════════════════════════════════════════════════════════════════
    
    analyzeSequence(workout, profile) {
        const result = {
            category: 'sequence',
            score: 0,
            maxScore: 100,
            findings: [],
            details: {}
        };
        
        if (!workout.exercises || workout.exercises.length < 2) {
            result.score = 50;
            result.findings.push({ type: 'info', msg: 'Troppo pochi esercizi per valutare sequenza' });
            return result;
        }
        
        const exercises = workout.exercises.map((ex, i) => ({
            ...ex,
            index: i,
            pattern: this.identifyPattern(ex.name),
            isCompound: this.isCompound(ex.name),
            isPower: this.isPowerMovement(ex.name),
            isConditioning: this.isConditioning(ex.name),
            isMobility: this.isMobility(ex.name),
            isSportSpecific: this.isSportSpecific(ex.name)
        }));
        
        result.details.exercises = exercises;
        
        // Check 1: Warm-up all'inizio (include sport-specific warmups)
        const firstEx = exercises[0];
        const firstName = (firstEx.name || '').toLowerCase();
        const hasWarmupFirst = firstEx.isMobility || 
                               firstEx.pattern === 'mobility' ||
                               firstEx.pattern === 'boxing_conditioning' ||  // Jump Rope
                               firstName.includes('rope') ||
                               firstName.includes('shadow') ||
                               firstName.includes('light') ||
                               firstName.includes('warm') ||
                               firstName.includes('dynamic') ||
                               firstName.includes('mobility') ||
                               firstName.includes('activation') ||
                               firstName.includes('skip') ||
                               firstName.includes('jog') ||
                               firstName.includes('run');
        if (hasWarmupFirst) {
            result.score += 20; // Increased from 15
            result.findings.push({ type: 'success', msg: 'Warm-up correttamente posizionato all\'inizio' });
        } else {
            // Check if second exercise is warmup (some workouts have intro text first)
            const secondEx = exercises[1];
            if (secondEx) {
                const secondName = (secondEx.name || '').toLowerCase();
                const hasWarmupSecond = secondName.includes('rope') || secondName.includes('shadow') || 
                                        secondName.includes('warm') || secondName.includes('dynamic');
                if (hasWarmupSecond) {
                    result.score += 15;
                    result.findings.push({ type: 'success', msg: 'Warm-up presente (posizione 2)' });
                } else {
                    result.findings.push({ type: 'warning', msg: 'Manca warm-up all\'inizio della sessione' });
                }
            } else {
                result.findings.push({ type: 'warning', msg: 'Manca warm-up all\'inizio della sessione' });
            }
        }
        
        // Check 2: Power/Explosive prima di Forza (non applica a sport-specific)
        const hasSportSpecificWorkout = exercises.some(e => e.isSportSpecific);
        const firstPowerIdx = exercises.findIndex(e => e.isPower);
        const firstStrengthIdx = exercises.findIndex(e => e.isCompound && !e.isPower && !e.isMobility && !e.isSportSpecific);
        
        if (firstPowerIdx > -1 && firstStrengthIdx > -1) {
            if (firstPowerIdx < firstStrengthIdx) {
                result.score += 20;
                result.findings.push({ type: 'success', msg: 'Esercizi esplosivi prima della forza - corretto' });
            } else if (hasSportSpecificWorkout) {
                result.score += 15; // Sport-specific ha regole diverse
                result.findings.push({ type: 'info', msg: 'Sequenza sport-specifica accettata' });
            } else {
                result.findings.push({ type: 'error', msg: 'Potenza dopo forza - CNS già affaticato' });
            }
        } else if (firstPowerIdx > -1 || hasSportSpecificWorkout) {
            result.score += 15;
        }
        
        // Check 3: Compound prima di Isolation (non applica a sport-specific)
        let lastCompoundIdx = -1;
        let firstIsolationIdx = exercises.length;
        
        exercises.forEach((ex, i) => {
            if (ex.isCompound && !ex.isMobility) lastCompoundIdx = i;
            if (!ex.isCompound && !ex.isMobility && !ex.isConditioning && !ex.isSportSpecific && i < firstIsolationIdx) {
                firstIsolationIdx = i;
            }
        });
        
        if (lastCompoundIdx <= firstIsolationIdx || firstIsolationIdx === exercises.length) {
            result.score += 25;
            result.findings.push({ type: 'success', msg: 'Compound prima di isolation - sequenza corretta' });
        } else {
            result.findings.push({ type: 'warning', msg: 'Alcuni isolation prima di compound' });
            result.score += 10;
        }
        
        // Check 4: Conditioning alla fine
        const conditioningExercises = exercises.filter(e => e.isConditioning);
        if (conditioningExercises.length > 0) {
            const allConditioningAtEnd = conditioningExercises.every(e => e.index > exercises.length * 0.6);
            if (allConditioningAtEnd) {
                result.score += 20;
                result.findings.push({ type: 'success', msg: 'Conditioning posizionato correttamente alla fine' });
            } else {
                result.findings.push({ type: 'warning', msg: 'Conditioning non alla fine - può compromettere forza' });
                result.score += 5;
            }
        } else {
            result.score += 10; // Neutral
        }
        
        // Check 5: Cooldown alla fine
        const lastEx = exercises[exercises.length - 1];
        if (lastEx.isMobility || lastEx.pattern === 'mobility') {
            result.score += 20;
            result.findings.push({ type: 'success', msg: 'Cool-down presente alla fine' });
        } else {
            result.findings.push({ type: 'info', msg: 'Manca cool-down esplicito' });
            result.score += 5;
        }
        
        return result;
    },
    
    identifyPattern(exerciseName) {
        if (!exerciseName) return 'unknown';
        const name = exerciseName.toLowerCase();
        
        for (const [pattern, keywords] of Object.entries(this.movementPatterns)) {
            if (keywords.some(k => name.includes(k))) {
                return pattern;
            }
        }
        return 'unknown';
    },
    
    isCompound(exerciseName) {
        const pattern = this.identifyPattern(exerciseName);
        const compoundPatterns = ['hip_hinge', 'squat', 'horizontal_push', 'horizontal_pull', 
                                   'vertical_push', 'vertical_pull', 'power', 'plyometric',
                                   'boxing_bag', 'boxing_technique'];
        return compoundPatterns.includes(pattern);
    },
    
    isPowerMovement(exerciseName) {
        const name = (exerciseName || '').toLowerCase();
        const powerKeywords = ['power', 'explosive', 'jump', 'throw', 'slam', 'clean', 'snatch', 'jerk', 'plyo', 'bound',
                               'heavy bag', 'clap push', 'medicine ball', 'med ball'];
        return powerKeywords.some(k => name.includes(k));
    },
    
    isConditioning(exerciseName) {
        const name = (exerciseName || '').toLowerCase();
        const condKeywords = ['sprint', 'interval', 'hiit', 'circuit', 'cardio', 'run', 'bike', 'row', 'conditioning', 'finisher', 'tabata', 'emom',
                              'jump rope', 'rope', 'shadow boxing', 'bag', 'round', 'burpee', 'battle rope'];
        return condKeywords.some(k => name.includes(k));
    },
    
    isMobility(exerciseName) {
        const name = (exerciseName || '').toLowerCase();
        const mobKeywords = ['warm', 'stretch', 'mobility', 'foam', 'dynamic', 'activation', 'cool', 'prehab', 'light'];
        return mobKeywords.some(k => name.includes(k));
    },
    
    // Nuova funzione: riconosce esercizi sport-specifici
    isSportSpecific(exerciseName) {
        const name = (exerciseName || '').toLowerCase();
        const sportKeywords = ['shadow', 'bag', 'rope', 'drill', 'footwork', 'technique', 'combo', 
                               'slip', 'bob', 'weave', 'round', 'pad', 'sparring'];
        return sportKeywords.some(k => name.includes(k));
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // 3. ANALISI BILANCIAMENTO BIOMECCANICO
    // ═══════════════════════════════════════════════════════════════════════
    
    analyzeBiomechanics(workout, profile) {
        const result = {
            category: 'biomechanics',
            score: 0,
            maxScore: 100,
            findings: [],
            details: {}
        };
        
        const patterns = {};
        workout.exercises?.forEach(ex => {
            const p = this.identifyPattern(ex.name);
            const sets = parseInt(ex.sets) || 3;
            patterns[p] = (patterns[p] || 0) + sets;
        });
        
        result.details.patterns = patterns;
        
        // Conta esercizi sport-specifici
        const sportSpecificCount = (patterns.boxing_technique || 0) + (patterns.boxing_bag || 0) + 
                                   (patterns.boxing_footwork || 0) + (patterns.boxing_defense || 0) +
                                   (patterns.boxing_conditioning || 0) + (patterns.sport_skill || 0);
        
        // Se è principalmente sport-specific, valutazione diversa
        const isSportSpecificWorkout = sportSpecificCount >= 6;
        
        if (isSportSpecificWorkout) {
            // Sport-specific: valuta diversamente
            result.score += 40; // Base score alto per sport-specific
            result.findings.push({ type: 'success', msg: `Workout sport-specifico: ${sportSpecificCount} esercizi tecnici` });
            
            // Bonus per varietà di pattern boxing
            const boxingPatterns = ['boxing_technique', 'boxing_bag', 'boxing_footwork', 'boxing_defense', 'boxing_conditioning'];
            const presentPatterns = boxingPatterns.filter(p => patterns[p] > 0).length;
            if (presentPatterns >= 3) {
                result.score += 30;
                result.findings.push({ type: 'success', msg: `Varietà boxing eccellente: ${presentPatterns} categorie` });
            } else if (presentPatterns >= 2) {
                result.score += 20;
            }
            
            // Core per sport combat
            const hasCoreWork = (patterns.core_rotation || 0) + (patterns.core_anti_rotation || 0) > 0;
            if (hasCoreWork) {
                result.score += 15;
                result.findings.push({ type: 'success', msg: 'Core anti/rotazione presente' });
            }
            
            // Conditioning
            const hasConditioning = (patterns.conditioning || 0) + (patterns.boxing_conditioning || 0) > 0;
            if (hasConditioning) {
                result.score += 15;
                result.findings.push({ type: 'success', msg: 'Conditioning presente' });
            }
            
            return result;
        }
        
        // Push vs Pull (solo per workout tradizionali)
        const push = (patterns.horizontal_push || 0) + (patterns.vertical_push || 0);
        const pull = (patterns.horizontal_pull || 0) + (patterns.vertical_pull || 0);
        
        if (push > 0 || pull > 0) {
            const ratio = pull > 0 ? push / pull : push;
            if (ratio >= 0.8 && ratio <= 1.5) {
                result.score += 25;
                result.findings.push({ type: 'success', msg: `Push/Pull ratio ottimale: ${push}/${pull}` });
            } else if (ratio >= 0.5 && ratio <= 2) {
                result.score += 15;
                result.findings.push({ type: 'warning', msg: `Push/Pull accettabile: ${push}/${pull}` });
            } else {
                result.findings.push({ type: 'error', msg: `Push/Pull sbilanciato: ${push}/${pull}` });
            }
        }
        
        // Anterior vs Posterior (importante per sport)
        const anterior = (patterns.squat || 0) + (patterns.knee_extension || 0) + push;
        const posterior = (patterns.hip_hinge || 0) + (patterns.knee_flexion || 0) + pull;
        
        if (anterior > 0 || posterior > 0) {
            const ratio = anterior > 0 ? posterior / anterior : posterior;
            if (ratio >= 1.0) {
                result.score += 25;
                result.findings.push({ type: 'success', msg: `Posterior ≥ Anterior - ottimo per prevenzione` });
            } else if (ratio >= 0.7) {
                result.score += 15;
                result.findings.push({ type: 'warning', msg: `Ratio Posterior/Anterior: ${ratio.toFixed(1)} - aumentare catena posteriore` });
            } else {
                result.findings.push({ type: 'error', msg: `Troppo focus anteriore - rischio squilibri` });
            }
        }
        
        // Bilateral vs Unilateral
        const unilateralKeywords = ['single', 'split', 'lunge', 'step', 'one leg', 'one arm', 'unilateral'];
        let hasUnilateral = false;
        workout.exercises?.forEach(ex => {
            if (unilateralKeywords.some(k => ex.name?.toLowerCase().includes(k))) {
                hasUnilateral = true;
            }
        });
        
        if (hasUnilateral) {
            result.score += 25;
            result.findings.push({ type: 'success', msg: 'Include lavoro unilaterale' });
        } else {
            result.score += 10;
            result.findings.push({ type: 'info', msg: 'Manca lavoro unilaterale esplicito' });
        }
        
        // Core training (tutti i piani)
        const corePatterns = ['core_anti_extension', 'core_anti_rotation', 'core_anti_lateral', 'core_rotation'];
        const corePresent = corePatterns.filter(p => patterns[p] > 0);
        
        if (corePresent.length >= 2) {
            result.score += 25;
            result.findings.push({ type: 'success', msg: `Core multi-planare: ${corePresent.length} pattern` });
        } else if (corePresent.length === 1) {
            result.score += 15;
            result.findings.push({ type: 'warning', msg: 'Core presente ma mono-planare' });
        } else {
            result.findings.push({ type: 'info', msg: 'Core implicito nei compound (accettabile)' });
            result.score += 10;
        }
        
        return result;
    },
    
    // Continua - Sport Specificity, Safety, Context...
    
    // ═══════════════════════════════════════════════════════════════════════
    // 4. ANALISI SPECIFICITÀ SPORT
    // ═══════════════════════════════════════════════════════════════════════
    
    analyzeSportSpecificity(workout, profile) {
        const result = {
            category: 'sport_specificity',
            score: 0,
            maxScore: 100,
            findings: [],
            details: {}
        };
        
        const sport = profile.sport?.toLowerCase();
        const exercises = workout.exercises || [];
        const exerciseNames = exercises.map(e => (e.name || '').toLowerCase()).join(' ');
        
        switch (sport) {
            case 'calcio':
                result.details = this.analyzeCalcioSpecificity(exercises, exerciseNames, profile);
                break;
            case 'basket':
                result.details = this.analyzeBasketSpecificity(exercises, exerciseNames, profile);
                break;
            case 'boxe':
                result.details = this.analyzeBoxeSpecificity(exercises, exerciseNames, profile);
                break;
            case 'palestra':
                result.details = this.analyzePalestraSpecificity(exercises, exerciseNames, profile);
                break;
            default:
                result.score = 50;
                result.findings.push({ type: 'info', msg: 'Sport non riconosciuto per analisi specifica' });
                return result;
        }
        
        // Calcola score dai details
        result.score = result.details.score || 0;
        result.findings = result.details.findings || [];
        
        return result;
    },
    
    analyzeCalcioSpecificity(exercises, names, profile) {
        const findings = [];
        let score = 0;
        
        // 1. Prevenzione hamstring (CRITICO per calcio)
        const hasHamstringPrevention = names.includes('nordic') || 
                                        names.includes('hamstring') ||
                                        names.includes('rdl') ||
                                        names.includes('romanian');
        if (hasHamstringPrevention) {
            score += 25;
            findings.push({ type: 'success', msg: '✅ Prevenzione hamstring presente (Nordic/RDL)' });
        } else {
            findings.push({ type: 'error', msg: '❌ MANCA prevenzione hamstring - rischio infortunio alto nel calcio!' });
        }
        
        // 2. Lavoro adduttori (Copenhagen per pubalgia)
        const hasAdductors = names.includes('copenhagen') || 
                             names.includes('adductor') ||
                             names.includes('adduttori');
        if (hasAdductors) {
            score += 15;
            findings.push({ type: 'success', msg: '✅ Prevenzione pubalgia (Copenhagen/Adduttori)' });
        } else {
            score += 5;
            findings.push({ type: 'warning', msg: '⚠️ Manca lavoro adduttori specifico' });
        }
        
        // 3. Lavoro monopodalico (fondamentale per calcio)
        const hasUnilateral = names.includes('single') || 
                              names.includes('split') ||
                              names.includes('lunge') ||
                              names.includes('step');
        if (hasUnilateral) {
            score += 20;
            findings.push({ type: 'success', msg: '✅ Lavoro monopodalico per stabilità' });
        } else {
            findings.push({ type: 'warning', msg: '⚠️ Manca lavoro single-leg' });
        }
        
        // 4. Pliometria per esplosività
        const hasPlyometrics = names.includes('jump') || 
                               names.includes('plyo') ||
                               names.includes('bound') ||
                               names.includes('hop');
        if (hasPlyometrics) {
            score += 20;
            findings.push({ type: 'success', msg: '✅ Pliometria per esplosività' });
        } else {
            score += 5;
            findings.push({ type: 'info', msg: 'Pliometria non presente (ok se giorno forza pura)' });
        }
        
        // 5. Core anti-rotazione (per tiro e contrasti)
        const hasAntiRotation = names.includes('pallof') || 
                                names.includes('anti-rotation') ||
                                names.includes('chop') ||
                                names.includes('bird dog');
        if (hasAntiRotation) {
            score += 10;
            findings.push({ type: 'success', msg: '✅ Core anti-rotazione' });
        }
        
        // 6. Ruolo specifico
        const role = profile.role?.toLowerCase();
        if (role === 'portiere') {
            const hasReactivity = names.includes('reactive') || 
                                  names.includes('lateral') ||
                                  names.includes('dive') ||
                                  names.includes('plyo');
            if (hasReactivity) {
                score += 10;
                findings.push({ type: 'success', msg: '✅ Lavoro reattivo per portiere' });
            }
        }
        
        return { score: Math.min(score, 100), findings };
    },
    
    analyzeBasketSpecificity(exercises, names, profile) {
        const findings = [];
        let score = 0;
        
        // 1. Salto verticale (CRITICO per basket)
        const hasVerticalJump = names.includes('jump') || 
                                names.includes('box') ||
                                names.includes('depth') ||
                                names.includes('vertical') ||
                                names.includes('plyo') ||
                                names.includes('bound') ||
                                names.includes('hop') ||
                                names.includes('squat jump') ||
                                names.includes('explosive');
        if (hasVerticalJump) {
            score += 25;
            findings.push({ type: 'success', msg: '✅ Focus salto verticale' });
        } else {
            findings.push({ type: 'error', msg: '❌ MANCA lavoro salto - fondamentale per basket!' });
        }
        
        // 2. Lavoro caviglie/lower leg (prevenzione distorsioni)
        const hasAnkleWork = names.includes('ankle') || 
                             names.includes('calf') ||
                             names.includes('balance') ||
                             names.includes('stability') ||
                             names.includes('single leg') ||
                             names.includes('propriocept') ||
                             names.includes('single-leg');
        if (hasAnkleWork) {
            score += 20;
            findings.push({ type: 'success', msg: '✅ Stabilità caviglia/single-leg' });
        } else {
            score += 5;
            findings.push({ type: 'warning', msg: '⚠️ Manca lavoro caviglie/single-leg' });
        }
        
        // 3. Movimento laterale/agilità
        const hasLateral = names.includes('lateral') || 
                           names.includes('shuffle') ||
                           names.includes('slide') ||
                           names.includes('defensive') ||
                           names.includes('agility') ||
                           names.includes('side') ||
                           names.includes('lunge') ||
                           names.includes('direction');
        if (hasLateral) {
            score += 20;
            findings.push({ type: 'success', msg: '✅ Movimento laterale/difensivo' });
        } else {
            score += 5;
            findings.push({ type: 'info', msg: 'Movimento laterale non presente' });
        }
        
        // 4. Potenza upper body (contatto, tiro)
        const hasUpperPower = names.includes('push') || 
                              names.includes('press') ||
                              names.includes('throw') ||
                              names.includes('medicine ball');
        if (hasUpperPower) {
            score += 15;
            findings.push({ type: 'success', msg: '✅ Potenza upper body' });
        }
        
        // 5. Prevenzione ACL (soprattutto donne)
        if (profile.gender === 'female') {
            const hasACLPrevention = names.includes('nordic') || 
                                     names.includes('single leg') ||
                                     names.includes('landing') ||
                                     names.includes('decel');
            if (hasACLPrevention) {
                score += 20;
                findings.push({ type: 'success', msg: '✅ Prevenzione ACL per atleta donna' });
            } else {
                findings.push({ type: 'warning', msg: '⚠️ Includere prevenzione ACL per donna' });
            }
        } else {
            score += 10;
        }
        
        return { score: Math.min(score, 100), findings };
    },
    
    analyzeBoxeSpecificity(exercises, names, profile) {
        const findings = [];
        let score = 15; // Base score per workout boxing (è già sport-specific)
        findings.push({ type: 'success', msg: '✅ Workout boxing riconosciuto' });
        
        // 1. Tecnica Boxing (FONDAMENTALE)
        const techniqueKeywords = ['shadow', 'jab', 'cross', 'hook', 'uppercut', 'combo', 'combination', 'mirror', 'technique'];
        const techniqueCount = techniqueKeywords.filter(k => names.includes(k)).length;
        
        if (techniqueCount >= 3) {
            score += 25;
            findings.push({ type: 'success', msg: `✅ Tecnica boxing eccellente (${techniqueCount} elementi)` });
        } else if (techniqueCount >= 1) {
            score += 15;
            findings.push({ type: 'success', msg: '✅ Tecnica boxing presente' });
        } else {
            score += 5;
            findings.push({ type: 'info', msg: 'Tecnica non inclusa (ok se giorno forza/conditioning)' });
        }
        
        // 2. Core rotazionale (CRITICO per pugni)
        const hasCoreRotation = names.includes('rotation') || 
                                names.includes('twist') ||
                                names.includes('chop') ||
                                names.includes('med ball') ||
                                names.includes('medicine') ||
                                names.includes('pallof') ||
                                names.includes('russian') ||
                                names.includes('throw');
        if (hasCoreRotation) {
            score += 20;
            findings.push({ type: 'success', msg: '✅ Core rotazionale per potenza pugni' });
        } else {
            score += 5;
            findings.push({ type: 'warning', msg: '⚠️ Core rotazionale non esplicito' });
        }
        
        // 3. Bag Work (conditioning specifico)
        const hasBagWork = names.includes('bag') || 
                           names.includes('heavy') ||
                           names.includes('speed bag') ||
                           names.includes('double end');
        if (hasBagWork) {
            score += 15;
            findings.push({ type: 'success', msg: '✅ Bag work presente' });
        }
        
        // 4. Footwork & Movement
        const hasFootwork = names.includes('footwork') || 
                            names.includes('pivot') ||
                            names.includes('lateral') ||
                            names.includes('ladder') ||
                            names.includes('cone') ||
                            names.includes('movement') ||
                            names.includes('circle');
        if (hasFootwork) {
            score += 10;
            findings.push({ type: 'success', msg: '✅ Footwork training presente' });
        }
        
        // 5. Defense drills
        const hasDefense = names.includes('slip') || 
                           names.includes('bob') ||
                           names.includes('weave') ||
                           names.includes('parry') ||
                           names.includes('roll') ||
                           names.includes('defense');
        if (hasDefense) {
            score += 10;
            findings.push({ type: 'success', msg: '✅ Defense drills presenti' });
        }
        
        // 6. Conditioning specifico boxe
        const hasBoxingConditioning = names.includes('rope') || 
                                      names.includes('jump rope') ||
                                      names.includes('tabata') ||
                                      names.includes('round') ||
                                      names.includes('interval') ||
                                      names.includes('burpee') ||
                                      names.includes('sprint');
        if (hasBoxingConditioning) {
            score += 15;
            findings.push({ type: 'success', msg: '✅ Conditioning boxe specifico' });
        } else {
            score += 5;
            findings.push({ type: 'info', msg: 'Conditioning generico presente' });
        }
        
        // 7. Potenza esplosiva
        const hasPower = names.includes('power') || 
                         names.includes('explosive') ||
                         names.includes('clap') ||
                         names.includes('slam') ||
                         names.includes('snatch') ||
                         names.includes('jump') ||
                         names.includes('plyo') ||
                         names.includes('throw');
        if (hasPower) {
            score += 10;
            findings.push({ type: 'success', msg: '✅ Lavoro potenza esplosiva' });
        }
        
        // 8. Neck training (prevenzione KO - bonus)
        const hasNeck = names.includes('neck');
        if (hasNeck) {
            score += 5;
            findings.push({ type: 'success', msg: '✅ Neck training per protezione' });
        }
        
        // 9. Fight week check
        if (profile.fight_week) {
            const totalSets = exercises.reduce((s, e) => s + (parseInt(e.sets) || 0), 0);
            if (totalSets <= 15) {
                score += 10;
                findings.push({ type: 'success', msg: '✅ Fight week: volume appropriatamente basso' });
            } else {
                score -= 10;
                findings.push({ type: 'error', msg: '❌ Fight week: troppo volume! Rischio DOMS' });
            }
        }
        
        // BONUS: Sport-specific è sempre valido per boxe
        // Un workout boxing è intrinsecamente specifico
        score += 10;
        
        return { score: Math.min(score, 100), findings };
    },
    
    analyzePalestraSpecificity(exercises, names, profile) {
        const findings = [];
        let score = 0;
        const goal = profile.goal?.toLowerCase();
        
        // Lista esercizi di isolamento
        const isolationExercises = ['curl', 'extension', 'tricep', 'bicep', 'lateral raise', 
                                    'fly', 'croci', 'pushdown', 'kickback', 'concentration',
                                    'preacher', 'calf raise', 'wrist', 'forearm'];
        
        // 1. Compound movements presenti
        const compounds = ['squat', 'deadlift', 'bench', 'row', 'press', 'pull'];
        const compoundCount = compounds.filter(c => names.includes(c)).length;
        
        if (compoundCount >= 3) {
            score += 30;
            findings.push({ type: 'success', msg: `✅ ${compoundCount} compound fondamentali presenti` });
        } else if (compoundCount >= 1) {
            score += 15;
            findings.push({ type: 'warning', msg: `⚠️ Solo ${compoundCount} compound - aumentare` });
        } else {
            findings.push({ type: 'error', msg: '❌ Mancano compound fondamentali' });
        }
        
        // 2. Goal-specific - POTENZA
        if (goal === 'potenza' || goal === 'power') {
            // POTENZA: penalizza fortemente isolation
            const isolationInWorkout = exercises.filter(e => {
                const name = (e.name || '').toLowerCase();
                return isolationExercises.some(iso => name.includes(iso));
            });
            
            if (isolationInWorkout.length === 0) {
                score += 35;
                findings.push({ type: 'success', msg: '✅ POTENZA: Nessun isolation - perfetto!' });
            } else if (isolationInWorkout.length <= 1) {
                score += 15;
                findings.push({ type: 'warning', msg: `⚠️ POTENZA: ${isolationInWorkout.length} isolation presente - non ottimale` });
            } else {
                score -= 10; // Penalità
                findings.push({ type: 'error', msg: `❌ POTENZA: ${isolationInWorkout.length} isolation! Curl/Extension sono per ipertrofia, NON potenza!` });
            }
            
            // Check pliometria per potenza
            const hasPlyometrics = names.includes('jump') || names.includes('plyo') || names.includes('depth');
            if (hasPlyometrics) {
                score += 20;
                findings.push({ type: 'success', msg: '✅ POTENZA: Pliometria presente' });
            } else {
                findings.push({ type: 'warning', msg: '⚠️ POTENZA: Manca pliometria (Box Jump, Depth Jump, etc.)' });
            }
            
            // Check rep range basse per potenza
            const hasLowReps = exercises.some(e => {
                const reps = this.parseReps(e.reps);
                return reps >= 1 && reps <= 6;
            });
            if (hasLowReps) {
                score += 15;
                findings.push({ type: 'success', msg: '✅ POTENZA: Rep range forza (1-6) presente' });
            } else {
                findings.push({ type: 'warning', msg: '⚠️ POTENZA: Servono rep basse (3-6) per forza massimale' });
            }
            
        } else if (goal === 'forza' || goal === 'strength') {
            // FORZA: isolation tollerato ma non ideale
            const hasLowReps = exercises.some(e => {
                const reps = this.parseReps(e.reps);
                return reps <= 6;
            });
            if (hasLowReps) {
                score += 25;
                findings.push({ type: 'success', msg: '✅ Rep range forza (≤6) presente' });
            } else {
                findings.push({ type: 'warning', msg: '⚠️ Per forza servono rep ≤6' });
            }
            
        } else if (goal === 'ipertrofia' || goal === 'hypertrophy' || goal === 'massa') {
            // IPERTROFIA: isolation è OK!
            const hasHypertrophyReps = exercises.some(e => {
                const reps = this.parseReps(e.reps);
                return reps >= 8 && reps <= 12;
            });
            if (hasHypertrophyReps) {
                score += 20;
                findings.push({ type: 'success', msg: '✅ Rep range ipertrofia (8-12) presente' });
            }
            
            // Check isolation per muscle detail
            const isolationCount = exercises.filter(e => {
                const name = (e.name || '').toLowerCase();
                return isolationExercises.some(iso => name.includes(iso));
            }).length;
            
            if (isolationCount >= 2) {
                score += 15;
                findings.push({ type: 'success', msg: `✅ IPERTROFIA: ${isolationCount} isolation per dettaglio muscolare` });
            }
        } else {
            score += 15;
        }
        
        // 3. Varietà angoli/movimenti
        const patterns = new Set();
        exercises.forEach(e => {
            const p = this.identifyPattern(e.name);
            if (p !== 'unknown') patterns.add(p);
        });
        
        if (patterns.size >= 5) {
            score += 15;
            findings.push({ type: 'success', msg: `✅ Varietà movimenti: ${patterns.size} pattern diversi` });
        } else if (patterns.size >= 3) {
            score += 10;
            findings.push({ type: 'info', msg: `${patterns.size} pattern - varietà accettabile` });
        }
        
        return { score: Math.min(Math.max(score, 0), 100), findings };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // 5. ANALISI SICUREZZA & INFORTUNI
    // ═══════════════════════════════════════════════════════════════════════
    
    analyzeSafety(workout, profile) {
        const result = {
            category: 'safety',
            score: 100, // Parte da 100 e toglie punti per problemi
            maxScore: 100,
            findings: [],
            details: { violations: [], warnings: [] }
        };
        
        const injuries = profile.injuries || [];
        if (injuries.length === 0) {
            result.findings.push({ type: 'success', msg: 'Nessun infortunio dichiarato' });
            return result;
        }
        
        const exerciseNames = (workout.exercises || []).map(e => (e.name || '').toLowerCase()).join(' ');
        const injuryText = injuries.join(' ').toLowerCase();
        
        // Mappa infortuni -> esercizi da evitare
        const contraindications = {
            'spalla': {
                avoid: ['overhead press', 'military press', 'behind neck', 'upright row', 'dip'],
                penalty: 30,
                reason: 'stress articolazione spalla'
            },
            'shoulder': {
                avoid: ['overhead press', 'military press', 'behind neck', 'upright row', 'dip'],
                penalty: 30,
                reason: 'shoulder joint stress'
            },
            'schiena': {
                avoid: ['deadlift', 'good morning', 'bent over row'],
                penalty: 25,
                reason: 'carico assiale sulla colonna'
            },
            'lombare': {
                avoid: ['deadlift', 'good morning', 'back squat', 'bent over'],
                penalty: 30,
                reason: 'stress lombare'
            },
            'ernia': {
                avoid: ['deadlift', 'squat pesante', 'overhead', 'good morning'],
                penalty: 35,
                reason: 'compressione discale'
            },
            'ginocchio': {
                avoid: ['leg extension', 'deep squat', 'sissy squat', 'jump'],
                penalty: 25,
                reason: 'stress articolazione ginocchio'
            },
            'lca': {
                avoid: ['leg extension', 'jump', 'cutting', 'pivot'],
                penalty: 30,
                reason: 'stress LCA'
            },
            'acl': {
                avoid: ['leg extension', 'jump', 'cutting', 'pivot'],
                penalty: 30,
                reason: 'ACL stress'
            },
            'hamstring': {
                avoid: ['sprint', 'explosive', 'nordic avanzato'],
                penalty: 25,
                reason: 'stress hamstring in recupero'
            },
            'caviglia': {
                avoid: ['jump', 'run', 'sprint', 'agility'],
                penalty: 20,
                reason: 'impatto caviglia'
            },
            'polso': {
                avoid: ['front squat', 'clean', 'wrist curl'],
                penalty: 15,
                reason: 'stress polso'
            },
            'collo': {
                avoid: ['neck', 'shrug pesante', 'behind neck'],
                penalty: 20,
                reason: 'stress cervicale'
            }
        };
        
        // Check violazioni
        for (const [injury, config] of Object.entries(contraindications)) {
            if (injuryText.includes(injury)) {
                for (const avoid of config.avoid) {
                    if (exerciseNames.includes(avoid)) {
                        result.score -= config.penalty;
                        result.details.violations.push({
                            injury,
                            exercise: avoid,
                            reason: config.reason
                        });
                        result.findings.push({ 
                            type: 'error', 
                            msg: `❌ VIOLAZIONE: "${avoid}" controindicato per ${injury} (${config.reason})` 
                        });
                    }
                }
            }
        }
        
        // Check prehab incluso
        if (injuries.length > 0) {
            const prehabKeywords = ['mobility', 'activation', 'prehab', 'stability', 'band', 'corrective'];
            const hasPrehab = prehabKeywords.some(k => exerciseNames.includes(k));
            
            if (hasPrehab) {
                result.score = Math.min(100, result.score + 10);
                result.findings.push({ type: 'success', msg: '✅ Prehab/attivazione incluso' });
            } else {
                result.findings.push({ type: 'warning', msg: '⚠️ Considera aggiungere prehab per infortuni' });
            }
        }
        
        result.score = Math.max(0, result.score);
        
        if (result.details.violations.length === 0 && injuries.length > 0) {
            result.findings.push({ type: 'success', msg: '✅ Tutti gli infortuni rispettati' });
        }
        
        return result;
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 6. ANALISI CONTESTO (Fase, Match Day, ecc)
    // ═══════════════════════════════════════════════════════════════════════
    
    analyzeContext(workout, profile) {
        const result = {
            category: 'context',
            score: 0,
            maxScore: 100,
            findings: [],
            details: {}
        };
        
        const exercises = workout.exercises || [];
        const totalSets = exercises.reduce((s, e) => s + (parseInt(e.sets) || 0), 0);
        const hasPlyometrics = exercises.some(e => this.isPowerMovement(e.name));
        const hasHeavyCompound = exercises.some(e => {
            const reps = this.parseReps(e.reps);
            return this.isCompound(e.name) && reps <= 6;
        });
        
        // Phase appropriateness
        const phase = (profile.phase || 'accumulo').toLowerCase();
        
        switch (phase) {
            case 'accumulo':
            case 'hypertrophy':
                // Alto volume, intensità media
                if (totalSets >= 18) {
                    result.score += 30;
                    result.findings.push({ type: 'success', msg: '✅ Volume alto appropriato per Accumulo' });
                } else {
                    result.score += 15;
                    result.findings.push({ type: 'warning', msg: 'Volume potrebbe essere più alto in Accumulo' });
                }
                break;
                
            case 'intensificazione':
            case 'strength':
                // Volume medio, intensità alta
                if (hasHeavyCompound) {
                    result.score += 30;
                    result.findings.push({ type: 'success', msg: '✅ Lavoro pesante presente per Intensificazione' });
                } else {
                    result.findings.push({ type: 'warning', msg: 'Manca lavoro ad alta intensità (≤6 reps)' });
                }
                break;
                
            case 'peaking':
            case 'realizzazione':
                // Volume basso, intensità massima, più potenza
                if (totalSets <= 20 && (hasPlyometrics || hasHeavyCompound)) {
                    result.score += 30;
                    result.findings.push({ type: 'success', msg: '✅ Peaking: volume contenuto, qualità alta' });
                }
                break;
                
            case 'deload':
                // Volume e intensità ridotti
                if (totalSets <= 15) {
                    result.score += 30;
                    result.findings.push({ type: 'success', msg: '✅ Deload: volume appropriatamente ridotto' });
                } else {
                    result.findings.push({ type: 'error', msg: '❌ Deload ma volume troppo alto!' });
                }
                break;
                
            default:
                result.score += 15;
        }
        
        // Match Day proximity (per sport di squadra)
        if (['calcio', 'basket'].includes(profile.sport)) {
            const matchDayProximity = profile.matchDayProximity; // MD-1, MD-2, MD+1, etc
            
            if (matchDayProximity === 'MD-1' || matchDayProximity === 'md-1') {
                // Giorno prima partita: solo attivazione, NO DOMS
                if (totalSets <= 12 && !hasHeavyCompound) {
                    result.score += 35;
                    result.findings.push({ type: 'success', msg: '✅ MD-1: attivazione leggera, no rischio DOMS' });
                } else {
                    result.findings.push({ type: 'error', msg: '❌ MD-1: troppo carico! Rischio fatica per partita' });
                }
            } else if (matchDayProximity === 'MD+1' || matchDayProximity === 'md+1') {
                // Giorno dopo partita: recovery
                const hasRecovery = exercises.some(e => 
                    (e.name || '').toLowerCase().includes('stretch') ||
                    (e.name || '').toLowerCase().includes('mobility') ||
                    (e.name || '').toLowerCase().includes('foam')
                );
                if (hasRecovery || totalSets <= 10) {
                    result.score += 35;
                    result.findings.push({ type: 'success', msg: '✅ MD+1: focus recovery appropriato' });
                }
            } else {
                result.score += 20; // Neutral
            }
        } else {
            result.score += 25; // Non-team sport
        }
        
        // Fight week per boxe
        if (profile.sport === 'boxe' && profile.fight_week) {
            if (totalSets <= 12 && !hasHeavyCompound) {
                result.score += 35;
                result.findings.push({ type: 'success', msg: '✅ Fight week: scarico appropriato' });
            } else {
                result.findings.push({ type: 'error', msg: '❌ Fight week ma ancora troppo carico!' });
            }
        }
        
        return result;
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // 7. ANALISI STIMULUS-TO-FATIGUE RATIO (SFR)
    // ═══════════════════════════════════════════════════════════════════════
    
    analyzeSFR(workout, profile) {
        const result = {
            category: 'sfr',
            score: 0,
            maxScore: 100,
            findings: [],
            details: { exercises: [], avgSFR: 0 }
        };
        
        const exercises = workout.exercises || [];
        if (exercises.length === 0) {
            result.findings.push({ type: 'warning', msg: 'Nessun esercizio da analizzare' });
            return result;
        }
        
        let totalSFR = 0;
        let totalSets = 0;
        const lowSFRExercises = [];
        
        exercises.forEach(ex => {
            const pattern = this.identifyPattern(ex.name);
            const sfr = this.sfr_ratings[pattern] || 5;
            const sets = parseInt(ex.sets) || 3;
            
            totalSFR += sfr * sets;
            totalSets += sets;
            
            result.details.exercises.push({
                name: ex.name,
                pattern,
                sfr,
                sets
            });
            
            if (sfr <= 4) {
                lowSFRExercises.push(ex.name);
            }
        });
        
        const avgSFR = totalSets > 0 ? totalSFR / totalSets : 0;
        result.details.avgSFR = avgSFR.toFixed(1);
        
        // Score basato su SFR medio
        if (avgSFR >= 7) {
            result.score = 100;
            result.findings.push({ type: 'success', msg: `✅ SFR eccellente: ${avgSFR.toFixed(1)}/10 - workout molto efficiente` });
        } else if (avgSFR >= 6) {
            result.score = 80;
            result.findings.push({ type: 'success', msg: `✅ SFR buono: ${avgSFR.toFixed(1)}/10` });
        } else if (avgSFR >= 5) {
            result.score = 60;
            result.findings.push({ type: 'warning', msg: `⚠️ SFR medio: ${avgSFR.toFixed(1)}/10 - considera esercizi più efficienti` });
        } else {
            result.score = 40;
            result.findings.push({ type: 'warning', msg: `⚠️ SFR basso: ${avgSFR.toFixed(1)}/10 - troppi esercizi a basso rendimento` });
        }
        
        if (lowSFRExercises.length > 0 && lowSFRExercises.length <= 2) {
            result.findings.push({ type: 'info', msg: `Esercizi basso SFR: ${lowSFRExercises.join(', ')}` });
        } else if (lowSFRExercises.length > 2) {
            result.findings.push({ type: 'warning', msg: `Troppi esercizi basso SFR: ${lowSFRExercises.length}` });
        }
        
        return result;
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // 8. RUNNER PRINCIPALE - VALIDAZIONE COMPLETA
    // ═══════════════════════════════════════════════════════════════════════
    
    validate(workout, profile) {
        const startTime = Date.now();
        
        const analyses = {
            volume: this.analyzeVolume(workout, profile),
            sequence: this.analyzeSequence(workout, profile),
            biomechanics: this.analyzeBiomechanics(workout, profile),
            sportSpecificity: this.analyzeSportSpecificity(workout, profile),
            safety: this.analyzeSafety(workout, profile),
            context: this.analyzeContext(workout, profile),
            sfr: this.analyzeSFR(workout, profile),
            advancedScience: this.analyzeAdvancedScience(workout, profile)
        };
        
        // Calcola score pesato
        const weights = {
            volume: 10,
            sequence: 8,
            biomechanics: 10,
            sportSpecificity: 20,  // Sport-specific è molto importante
            safety: 18,  // Sicurezza è la più importante!
            context: 8,
            sfr: 10,     // SFR aumentato - efficienza importante
            advancedScience: 16  // Scienza avanzata
        };
        
        let totalWeightedScore = 0;
        let totalWeight = 0;
        
        for (const [key, analysis] of Object.entries(analyses)) {
            const weight = weights[key] || 10;
            // Protezione NaN: usa 50 come default se score non valido
            const score = typeof analysis.score === 'number' && !isNaN(analysis.score) 
                ? analysis.score 
                : 50;
            totalWeightedScore += (score / 100) * weight;
            totalWeight += weight;
        }
        
        const finalScore = Math.round((totalWeightedScore / totalWeight) * 100) || 50;
        
        // Genera grade
        let grade, gradeColor, gradeLabel;
        if (finalScore >= 90) {
            grade = 'A+'; gradeColor = '#22c55e'; gradeLabel = 'Eccellente';
        } else if (finalScore >= 80) {
            grade = 'A'; gradeColor = '#22c55e'; gradeLabel = 'Ottimo';
        } else if (finalScore >= 70) {
            grade = 'B'; gradeColor = '#84cc16'; gradeLabel = 'Buono';
        } else if (finalScore >= 60) {
            grade = 'C'; gradeColor = '#eab308'; gradeLabel = 'Sufficiente';
        } else if (finalScore >= 50) {
            grade = 'D'; gradeColor = '#f97316'; gradeLabel = 'Insufficiente';
        } else {
            grade = 'F'; gradeColor = '#ef4444'; gradeLabel = 'Fallito';
        }
        
        // Raccogli tutti i findings
        const allFindings = [];
        for (const analysis of Object.values(analyses)) {
            allFindings.push(...analysis.findings);
        }
        
        const errors = allFindings.filter(f => f.type === 'error');
        const warnings = allFindings.filter(f => f.type === 'warning');
        const successes = allFindings.filter(f => f.type === 'success');
        
        return {
            score: finalScore,
            grade: { letter: grade, color: gradeColor, label: gradeLabel },
            analyses,
            summary: {
                errors: errors.length,
                warnings: warnings.length,
                successes: successes.length,
                criticalIssues: errors.map(e => e.msg),
                strengths: successes.slice(0, 5).map(s => s.msg)
            },
            allFindings,
            profile: profile.id || profile.name,
            sport: profile.sport,
            validationTimeMs: Date.now() - startTime
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // 8. ANALISI SCIENZA AVANZATA (ATLAS Science)
    // ═══════════════════════════════════════════════════════════════════════
    
    analyzeAdvancedScience(workout, profile) {
        const result = {
            category: 'advanced_science',
            score: 0,
            maxScore: 100,
            findings: [],
            details: {}
        };
        
        // Se ATLASScience non è disponibile, skip
        if (!window.ATLASScience) {
            result.score = 50; // neutral
            result.findings.push({ type: 'info', msg: 'ℹ️ ATLAS Science non caricato' });
            return result;
        }
        
        try {
            const scienceAnalysis = window.ATLASScience.fullAnalysis(workout, profile);
            result.score = scienceAnalysis.score;
            result.findings = scienceAnalysis.allFindings;
            result.details = {
                lengthVsShortened: scienceAnalysis.results.lengthVsShortened,
                fiberTypeMatch: scienceAnalysis.results.fiberTypeMatch,
                eccentricEmphasis: scienceAnalysis.results.eccentricEmphasis,
                timeUnderTension: scienceAnalysis.results.timeUnderTension,
                agonistAntagonist: scienceAnalysis.results.agonistAntagonist,
                sraCompliance: scienceAnalysis.results.sraCompliance
            };
        } catch (e) {
            console.warn('Advanced science analysis failed:', e);
            result.score = 50;
            result.findings.push({ type: 'warning', msg: '⚠️ Analisi scienza avanzata fallita' });
        }
        
        return result;
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // UTILITY: Formatta report
    // ═══════════════════════════════════════════════════════════════════════
    
    formatReport(validation) {
        let report = `
╔══════════════════════════════════════════════════════════════════════════════╗
║  🔬 SCIENTIFIC WORKOUT VALIDATION                                             ║
║  Atleta: ${(validation.profile || 'N/A').padEnd(30)} Sport: ${(validation.sport || 'N/A').padEnd(10)}║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║    SCORE: ${validation.score}% | GRADE: ${validation.grade.letter} (${validation.grade.label})
║                                                                               ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  ANALISI PER CATEGORIA:                                                       ║`;

        for (const [key, analysis] of Object.entries(validation.analyses)) {
            const bar = '█'.repeat(Math.round(analysis.score / 10)) + '░'.repeat(10 - Math.round(analysis.score / 10));
            const label = key.replace(/([A-Z])/g, ' $1').trim();
            report += `\n║    ${label.padEnd(18)} ${bar} ${String(analysis.score).padStart(3)}%`;
        }

        report += `
╠══════════════════════════════════════════════════════════════════════════════╣`;

        if (validation.summary.errors > 0) {
            report += `\n║  ❌ ERRORI CRITICI (${validation.summary.errors}):`;
            validation.summary.criticalIssues.slice(0, 3).forEach(issue => {
                report += `\n║     • ${issue.substring(0, 65)}`;
            });
        }

        if (validation.summary.successes > 0) {
            report += `\n║  ✅ PUNTI DI FORZA:`;
            validation.summary.strengths.slice(0, 3).forEach(s => {
                report += `\n║     • ${s.substring(0, 65)}`;
            });
        }

        report += `
╚══════════════════════════════════════════════════════════════════════════════╝`;

        return report;
    }
};

window.ScientificWorkoutValidator = ScientificWorkoutValidator;
console.log('🔬 ScientificWorkoutValidator v1.0 COMPLETE - NASA-level workout validation ready!');
