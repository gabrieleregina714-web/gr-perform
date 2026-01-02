// GR Perform - Post-Processing System
// Sistema hard-coded per forzare correzioni dopo generazione AI

const WorkoutPostProcessor = {

    // ═══════════════════════════════════════════════════════════════════════════
    // PATTERNS VIETATI → SOSTITUZIONI
    // ═══════════════════════════════════════════════════════════════════════════

    REPLACEMENTS: {
        // Nomi generici → Nomi specifici
        "Boxing Circuit": "Heavy Bag Circuit: 5x3min (Round 1-2: jab-cross, Round 3-4: hooks + body shots, Round 5: freestyle combos) - 1min rest",
        "Circuito Boxe": "Heavy Bag Circuit: 5x3min (Round 1-2: jab-cross, Round 3-4: hooks + body shots, Round 5: freestyle combos) - 1min rest",
        "Boxing Circuit: 8 rounds of 3min work (sacco + shadow + corda) + 1min rest": "Boxing Circuit: 8x3min (R1-2: Heavy Bag power shots, R3-4: Shadow Boxing combos + footwork, R5-6: Jump Rope intervals, R7-8: Speed Bag or Slip Rope) - 1min rest",
        "Boxing Circuit: 8x3min (sacco + shadow + corda) + 1min rest": "Boxing Circuit: 8x3min (R1-2: Heavy Bag power shots, R3-4: Shadow Boxing combos + footwork, R5-6: Jump Rope intervals, R7-8: Speed Bag or Slip Rope) - 1min rest",
        "Padwork": "Pad Work: 4x3min (coach calls: 1-2, 1-2-3, 1-2-3-2, combos con movimento) - 1min rest",
        "Pad work": "Pad Work: 4x3min (coach calls: 1-2, 1-2-3, 1-2-3-2, combos con movimento) - 1min rest",
        "Conditioning Circuit": "MetCon Circuit: 4x (10 Burpees + 15 KB Swings + 10 Box Jumps + 200m Run) - 90s rest",
        "Cardio": "Cardio: 20min Zone 2 (conversational pace, 120-140 bpm)",
        "Core Work": "Core Circuit: 3x (20 Russian Twists + 15 Leg Raises + 30s Plank + 10 V-ups) - 45s rest",
        "Core work": "Core Circuit: 3x (20 Russian Twists + 15 Leg Raises + 30s Plank + 10 V-ups) - 45s rest",
        "Stretching": "Static Stretching: 10min (Hip Flexors 90s/side, Hamstrings 90s/side, Shoulders 60s/side, Chest 60s/side)",
        "Warm-up": "Dynamic Warm-up: 5min (High Knees + Butt Kicks + Leg Swings + Arm Circles + Hip Circles)",
        "Warmup": "Dynamic Warm-up: 5min (High Knees + Butt Kicks + Leg Swings + Arm Circles + Hip Circles)",
        "Shadow Boxing": "Shadow Boxing: 3x3min (Round 1: footwork + jab only, Round 2: add cross, Round 3: full combos) - 1min rest",
        "Jump Rope": "Jump Rope: 3x3min (alternating: 1min normal + 30s double-under attempts + 30s high knees) - 30s rest",
        "Bag Work": "Heavy Bag: 6x3min (alternating power rounds and speed rounds) - 1min rest",
        "Sacco": "Heavy Bag: 6x3min (alternating power rounds and speed rounds) - 1min rest",
        "Sprint": "Sprint Training: 6x30m from standing start, walk back recovery (full rest ~90s)",
        "Sprints": "Sprint Training: 6x30m from standing start, walk back recovery (full rest ~90s)",
        "Plyo": "Plyometrics: Box Jump 3x5 → Drop Jump 3x5 → Broad Jump 3x5 (full recovery between sets)",
        "Mobility": "Mobility Flow: 8min (Cat-Cow 10x, Thread Needle 5x/side, Hip 90/90 60s/side, T-spine rotation 10x/side)",
        "Mobility Work": "Mobility Flow: 8min (Cat-Cow 10x, Thread Needle 5x/side, Hip 90/90 60s/side, T-spine rotation 10x/side)",
        "Strength Training": "Compound Strength: 4x6 on main lift (Back Squat or Deadlift or Bench Press) @ RPE 8",
        "Weight Training": "Compound Strength: 4x6 on main lift (Back Squat or Deadlift or Bench Press) @ RPE 8",
        "Agility Drills": "Agility Circuit: T-Test 4x + 5-10-5 Drill 4x + Ladder (Ickey Shuffle + In-Out + Lateral) 3 sets each",
        "Agility": "Agility Circuit: T-Test 4x + 5-10-5 Drill 4x + Ladder (Ickey Shuffle + In-Out + Lateral) 3 sets each",
        "Speed Work": "Speed Training: 8x20m sprints (first 3 steps focus) + 4x40m flying sprints - full recovery",
        "Resistance Training": "Resistance Training: 4x8-10 compound + 3x12 isolation (see specific exercises below)",
        "Interval Training": "HIIT: 8x (30s all-out sprint + 90s walk recovery) or 4x (2min @ 90% + 2min recovery)",
        "HIIT": "HIIT Protocol: 8x (30s all-out effort + 90s active recovery) - Assault Bike or Rowing",
        "Circuit Training": "Full Body Circuit: 5x (10 KB Swing + 10 Goblet Squat + 10 Push-ups + 10 Rows + 200m Run) - 2min rest",
        "Cool Down": "Cool Down: 5min walk + Static Stretching 5min (major muscle groups 30s each)",
        "Cool down": "Cool Down: 5min walk + Static Stretching 5min (major muscle groups 30s each)",
        "Cooldown": "Cool Down: 5min walk + Static Stretching 5min (major muscle groups 30s each)",
        "Upper Body": "Upper Body: A1 Bench Press 4x8 → A2 Row 4x10 → B1 OHP 3x10 → B2 Lat Pulldown 3x12 → C Arm Superset 3x12",
        "Lower Body": "Lower Body: A Back Squat 4x6 → B Romanian Deadlift 4x8 → C Split Squat 3x10/leg → D Leg Curl 3x12",
        "Full Body": "Full Body: A1 Squat 3x8 → A2 Row 3x10 → B1 RDL 3x8 → B2 Push-up 3x12 → C Core 3x15",
        "Push Day": "Push Day: A Bench Press 4x6 → B Incline DB Press 3x10 → C OHP 3x10 → D Lateral Raise 3x15 → E Tricep Pushdown 3x12",
        "Pull Day": "Pull Day: A Weighted Pull-up 4x6 → B Cable Row 4x10 → C Face Pull 3x15 → D Rear Delt Fly 3x15 → E Bicep Curl 3x12",
        "Leg Day": "Leg Day: A Back Squat 4x6 → B RDL 4x8 → C Leg Press 3x12 → D Walking Lunges 3x12/leg → E Leg Curl 3x12 → F Calf Raise 4x15"
    },

    // Pattern regex per catch più ampio
    VAGUE_PATTERNS: [
        // Boxing-specific patterns
        { regex: /boxing circuit.*rounds.*sacco.*shadow.*corda/i, replacement: "Boxing Circuit: 8x3min (R1-2: Heavy Bag power shots, R3-4: Shadow Boxing combos, R5-6: Jump Rope intervals, R7-8: Speed Bag) - 1min rest" },
        { regex: /boxing circuit.*\d+\s*rounds?.*3\s*min/i, replacement: "Boxing Circuit: 6x3min (R1-2: Heavy Bag jab-cross-hook, R3-4: Shadow Boxing defense + counters, R5-6: Speed work + combos) - 1min rest" },
        { regex: /boxing circuit.*\d+\s*rounds?\s*\(\d+\s*min\s*work.*rest\)/i, replacement: "Boxing Circuit: 6x2min (R1-2: Heavy Bag power combos jab-cross-hook, R3-4: Shadow Boxing slips + counters, R5-6: Speed Bag + footwork drills) - 1min rest" },
        { regex: /boxing circuit.*\d+\s*rounds?$/i, replacement: "Boxing Circuit: 6x3min (R1-2: Heavy Bag jab-cross-hook power, R3-4: Shadow Boxing defense + slips, R5-6: Jump Rope intervals + speed work) - 1min rest" },
        { regex: /heavy bag intervals?:?\s*\d+.*rounds?$/i, replacement: "Heavy Bag Intervals: 6x3min (30s max power + 30s technical work per round) - 1min rest" },
        { regex: /shadow boxing drills?$/i, replacement: "Shadow Boxing: 4x3min (R1: Jab-Cross only, R2: add Hooks, R3: add Uppercuts + slips, R4: freestyle combos with footwork) - 1min rest" },
        
        // General patterns
        { regex: /^conditioning$/i, replacement: "MetCon: 4x (10 Burpees + 15 KB Swings + 10 Box Jumps) - 90s rest" },
        { regex: /^cardio$/i, replacement: "Steady State Cardio: 20min Zone 2 (conversational pace)" },
        { regex: /^core$/i, replacement: "Core Circuit: 3x (20 Russian Twists + 15 Leg Raises + 30s Plank)" },
        { regex: /^strength$/i, replacement: "Compound Lift: 4x6 @ RPE 8 (Squat/Deadlift/Bench variation)" },
        { regex: /^power$/i, replacement: "Power: Box Jump 4x5 + Med Ball Slam 3x8 + Clap Push-up 3x5" },
        { regex: /^plyo(metrics)?$/i, replacement: "Plyometrics: Box Jump 3x5 + Depth Jump 3x5 + Broad Jump 3x5" },
        { regex: /^technique$/i, replacement: "Technical Drill: Sport-specific movement patterns at 60% intensity, 15min" },
        { regex: /^skill$/i, replacement: "Skill Work: Sport-specific drills at submaximal intensity, 15min" },
        { regex: /^recovery$/i, replacement: "Active Recovery: Foam Rolling 10min + Static Stretching 10min" },
        { regex: /^prehab$/i, replacement: "Prehab: Band work (face pulls, pull-aparts, external rotations) 3x15 each" },
        { regex: /^abs$/i, replacement: "Abs Circuit: 3x (15 Hanging Leg Raise + 20 Cable Crunch + 30s Hollow Hold)" },
        { regex: /^arms$/i, replacement: "Arm Superset: 4x (12 Barbell Curl + 12 Tricep Pushdown) - no rest between" },
        { regex: /^finisher$/i, replacement: "Finisher: AMRAP 5min (10 KB Swing + 10 Goblet Squat + 5 Burpee)" }
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // MAIN PROCESS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Processa un workout completo
     * @param {Object} workout - Il workout generato dall'AI
     * @param {string} sport - Sport dell'atleta
     * @param {string} phase - Fase del mesociclo
     * @param {Object} athleteContext - Contesto atleta (experience_level, compliance, etc.)
     * @returns {Object} Workout corretto
     */
    process(workout, sport, phase, athleteContext = {}) {
        if (!workout || !workout.exercises) return workout;
        
        const correctedWorkout = JSON.parse(JSON.stringify(workout)); // Deep clone
        const corrections = [];
        
        // 0a. Applica volume/intensità da PeriodizationEngine se disponibile
        const periodization = athleteContext.periodization;
        if (periodization && periodization.volume) {
            correctedWorkout.exercises = this.applyPeriodizationVolume(
                correctedWorkout.exercises, 
                periodization, 
                corrections
            );
        }
        
        // 0b. Riduzione volume per principianti o bassa compliance
        const expLevel = String(athleteContext.experience_level || '').toLowerCase();
        const compliance = athleteContext.compliance || 100;
        
        if (expLevel === 'principiante' || expLevel === 'beginner' || compliance < 70) {
            correctedWorkout.exercises = this.reduceVolumeForBeginner(correctedWorkout.exercises, corrections);
        }
        
        // 1. Correggi nomi esercizi
        for (let i = 0; i < correctedWorkout.exercises.length; i++) {
            const ex = correctedWorkout.exercises[i];
            const originalName = ex.name;
            
            // Check direct replacements
            if (this.REPLACEMENTS[originalName]) {
                ex.name = this.REPLACEMENTS[originalName];
                corrections.push(`"${originalName}" → "${ex.name}"`);
                continue;
            }
            
            // Check regex patterns
            for (const pattern of this.VAGUE_PATTERNS) {
                if (pattern.regex.test(originalName)) {
                    ex.name = pattern.replacement;
                    corrections.push(`"${originalName}" → "${ex.name}"`);
                    break;
                }
            }
            
            // Check boxing circuits vaghi (contengono termini generici senza dettagli specifici)
            if (/boxing circuit.*\(.*(?:sacco|shadow|corda).*\)/i.test(originalName) && 
                !/jab|cross|hook|uppercut|power|defense|footwork/i.test(originalName)) {
                ex.name = "Boxing Circuit: 6x3min (R1-2: Heavy Bag jab-cross-hook power, R3-4: Shadow Boxing defense + slips, R5-6: Jump Rope intervals + speed work) - 1min rest";
                corrections.push(`Boxing circuit vago "${originalName}" → dettagliato`);
            }
            
            // Check if still too short/vague
            if (ex.name && ex.name.split(' ').length <= 2 && !this.isAcceptableShortName(ex.name)) {
                ex.name = this.expandShortName(ex.name, sport, phase, ex.type);
                if (ex.name !== originalName) {
                    corrections.push(`"${originalName}" → "${ex.name}"`);
                }
            }
        }
        
        // 2. Aggiungi warmup se manca
        // Il primo esercizio deve essere un warm-up dinamico vero (no shadow boxing)
        const firstEx = correctedWorkout.exercises[0];
        if (!firstEx || !/warm|activation|mobility|dynamic/i.test(String(firstEx.name || '')) || /shadow/i.test(String(firstEx.name || ''))) {
            correctedWorkout.exercises.unshift({
                name: "Dynamic Warm-up: 7min (High Knees, Butt Kicks, Leg Swings, Arm Circles, Hip Circles, Bodyweight Squats)",
                sets: 1,
                reps: "7 min",
                type: "conditioning"
            });
            corrections.push("Aggiunto warm-up dinamico come primo esercizio (no shadow boxing)");
        }
        
        // 3. Aggiungi cooldown se manca
        if (!this.hasCooldown(correctedWorkout)) {
            correctedWorkout.exercises.push({
                name: "Cool Down: 5min walk + Static Stretching (quads, hamstrings, hip flexors, shoulders - 30s each)",
                sets: 1,
                reps: "10 min",
                type: "conditioning"
            });
            corrections.push("Aggiunto cool-down mancante");
        }
        
        // 4. Fix sets/reps mancanti
        for (const ex of correctedWorkout.exercises) {
            if (!ex.sets || ex.sets === 0) {
                ex.sets = 3;
                corrections.push(`Sets mancanti per "${ex.name}" → 3`);
            }
            if (!ex.reps) {
                ex.reps = this.inferReps(ex.name, ex.type);
                corrections.push(`Reps mancanti per "${ex.name}" → ${ex.reps}`);
            }
            
            // Fix reps che dicono solo "rounds" o simili
            const repsStr = String(ex.reps || '').toLowerCase().trim();
            if (repsStr === 'rounds' || repsStr === 'round' || repsStr === 'circuit' || repsStr === 'as prescribed') {
                const inferredReps = this.inferReps(ex.name, ex.type);
                if (inferredReps !== ex.reps) {
                    corrections.push(`Reps "${ex.reps}" → "${inferredReps}"`);
                    ex.reps = inferredReps;
                }
            }
            
            // Fix reps "N rounds" (es. "8 rounds")
            if (/^\d+\s*rounds?$/i.test(repsStr)) {
                const inferredReps = this.inferReps(ex.name, ex.type);
                corrections.push(`Reps "${ex.reps}" → "${inferredReps}"`);
                ex.reps = inferredReps;
            }
            
            // Fix reps "N/A" o vuote
            if (repsStr === 'n/a' || repsStr === '' || repsStr === 'na') {
                const inferredReps = this.inferReps(ex.name, ex.type);
                corrections.push(`Reps "${ex.reps}" → "${inferredReps}"`);
                ex.reps = inferredReps;
            }
            
            // Sincronizza sets con nome esercizio (es. "8x2min" nel nome → sets=8)
            const nameSetMatch = String(ex.name || '').match(/(\d+)\s*x\s*\d+\s*(min|sec|')/i);
            if (nameSetMatch) {
                const impliedSets = parseInt(nameSetMatch[1]);
                if (ex.sets !== impliedSets && impliedSets <= 12) {
                    corrections.push(`Sets ${ex.sets} → ${impliedSets} (da nome "${ex.name.substring(0,40)}...")`);
                    ex.sets = impliedSets;
                }
            }
            
            // Fix reps "N x M min" - estrai solo la durata (es. "8 x 2 min" → "2 min")
            const nxmMatch = String(ex.reps || '').match(/^(\d+)\s*x\s*(\d+)\s*(min|sec)/i);
            if (nxmMatch) {
                const extractedReps = `${nxmMatch[2]} ${nxmMatch[3]}`;
                // Se i sets non corrispondono al primo numero, aggiorna
                const impliedSets = parseInt(nxmMatch[1]);
                if (ex.sets !== impliedSets) {
                    corrections.push(`Sets ${ex.sets} → ${impliedSets} (da reps "${ex.reps}")`);
                    ex.sets = impliedSets;
                }
                corrections.push(`Reps "${ex.reps}" → "${extractedReps}"`);
                ex.reps = extractedReps;
            }
        }
        
        // 5. Controllo volume per fase (GPP = volume ridotto)
        // Migliorato: se la fase o il nome del giorno contiene "bassa intensità", "deload", "RPE 5-6", riduci volume
        const dayTitle = String(correctedWorkout.title || '').toLowerCase();
        const isLowIntensity = /bassa intensità|deload|rpe 5-6|light|recovery/i.test(dayTitle) || /bassa intensità|deload|rpe 5-6|light|recovery/i.test(String(phase || ''));
        if (isLowIntensity) {
            // Riduci serie di tutti gli esercizi (eccetto warmup/cooldown) del 30%, min 2 serie/round
            correctedWorkout.exercises = this.applySmartDeload(correctedWorkout.exercises, 30, corrections);
            // Se ancora >6 esercizi, taglia gli ultimi accessori fino a max 6
            if (correctedWorkout.exercises.length > 6) {
                const before = correctedWorkout.exercises.length;
                correctedWorkout.exercises = correctedWorkout.exercises.slice(0, 6);
                corrections.push(`✂️ Tagliati esercizi accessori: da ${before} a 6 (bassa intensità)`);
            }
        } else {
            correctedWorkout.exercises = this.adjustVolumeForPhase(correctedWorkout.exercises, phase, corrections);
        }
        
        // 6. Sport-specific adjustments
        correctedWorkout.exercises = this.sportSpecificAdjustments(correctedWorkout.exercises, sport, phase);
        
        // 7. ⚠️ NUOVO: Enforce fixed parameters (box jump, plank, neck mai a tempo)
        correctedWorkout.exercises = this.enforceFixedParameters(correctedWorkout.exercises, corrections);
        
        // 8. ⚠️ NUOVO: Validate name-parameter consistency
        correctedWorkout.exercises = this.validateNameParameterConsistency(correctedWorkout.exercises, corrections);
        
        // Log corrections
        if (corrections.length > 0) {
            console.log('🔧 Post-processing corrections:', corrections);
            correctedWorkout._postProcessingApplied = true;
            correctedWorkout._corrections = corrections;
        }
        
        return correctedWorkout;
    },

    /**
     * Check se nome corto è accettabile (esercizi noti)
     */
    isAcceptableShortName(name) {
        const acceptable = [
            // Compound lifts
            'squat', 'deadlift', 'bench press', 'overhead press', 'barbell row',
            'pull-up', 'pull up', 'chin-up', 'dip', 'push-up', 'push up',
            // Machines/isolation
            'leg press', 'leg curl', 'leg extension', 'lat pulldown',
            'bicep curl', 'tricep extension', 'lateral raise', 'face pull',
            // Olympic
            'clean', 'snatch', 'jerk', 'clean and jerk',
            // Sport specific with detail
            'back squat', 'front squat', 'goblet squat', 'box squat',
            'romanian deadlift', 'sumo deadlift', 'trap bar deadlift'
        ];
        
        const lower = name.toLowerCase();
        return acceptable.some(a => lower.includes(a));
    },

    /**
     * Espande nome corto in dettagliato
     */
    expandShortName(name, sport, phase, type) {
        const lower = name.toLowerCase();
        
        // Boxing specific
        if (sport === 'boxe' || sport === 'boxing') {
            if (lower.includes('bag') || lower.includes('sacco')) {
                return 'Heavy Bag: 5x3min (Round 1-2: single shots for power, Round 3-4: 3-punch combos, Round 5: freestyle) - 1min rest';
            }
            if (lower.includes('shadow')) {
                return 'Shadow Boxing: 4x3min (Round 1: footwork, Round 2: defense, Round 3-4: full combos with movement) - 1min rest';
            }
            if (lower.includes('rope') || lower.includes('corda')) {
                return 'Jump Rope: 3x3min (alternating single bounce, double-under attempts, high knees) - 30s rest';
            }
        }
        
        // Football specific
        if (sport === 'calcio' || sport === 'football') {
            if (lower.includes('sprint')) {
                return 'Sprint Training: 6x30m from standing start + 4x20m flying sprints - full recovery (walk back)';
            }
            if (lower.includes('agility')) {
                return 'Agility: T-Test 4x + 5-10-5 Pro Agility 4x + Reactive Mirror Drill 3x20s - full recovery';
            }
        }
        
        // General expansions by type - CON WHITELIST
        // ⚠️ NON applicare template round-based a esercizi che non li supportano
        if (type === 'conditioning') {
            // Verifica se può essere round-based (usa BoxingRules se disponibile)
            const canBeRound = window.BoxingRules?.canBeRoundBased?.(name) || 
                               this.isRoundBasedExercise(name);
            
            if (canBeRound) {
                return `${name}: 4x3min work / 1min rest (moderate to high intensity)`;
            } else {
                // Esercizi conditioning NON round-based (box jump, burpees, etc.)
                return `${name}: 3-4 sets x 8-10 reps (explosive, full recovery)`;
            }
        }
        if (type === 'strength') {
            return `${name}: 4x6-8 @ RPE 8 (controlled tempo 2-0-2)`;
        }
        if (type === 'hypertrophy') {
            return `${name}: 3x10-12 @ RPE 7 (focus on mind-muscle connection)`;
        }
        
        return `${name}: 3x10-12 (adjust load as needed)`;
    },

    /**
     * Whitelist esercizi che possono essere round-based
     */
    ROUND_BASED_WHITELIST: [
        'shadow', 'heavy bag', 'sacco', 'pad work', 'speed bag', 'double end',
        'sparring', 'boxing circuit', 'jump rope', 'corda', 'battle rope',
        'rowing', 'assault bike', 'airdyne', 'ski erg', 'emom', 'amrap',
        'conditioning circuit', 'hiit', 'tabata', 'interval'
    ],
    
    /**
     * Whitelist esercizi che NON devono MAI essere round-based
     */
    NEVER_ROUND_BASED: [
        'box jump', 'depth jump', 'drop jump', 'broad jump', 'plank',
        'burpee', 'push-up', 'pull-up', 'dip', 'squat jump',
        'medicine ball', 'slam', 'throw'
    ],
    
    /**
     * Verifica se esercizio può essere round-based
     */
    isRoundBasedExercise(name) {
        const lower = String(name || '').toLowerCase();
        
        // Prima controlla se è nella lista "mai round-based"
        if (this.NEVER_ROUND_BASED.some(pattern => lower.includes(pattern))) {
            return false;
        }
        
        // Poi controlla se è nella whitelist
        return this.ROUND_BASED_WHITELIST.some(pattern => lower.includes(pattern));
    },

    /**
     * Check warmup presence
     */
    hasWarmup(workout) {
        if (!workout.exercises || workout.exercises.length === 0) return false;
        const first = workout.exercises[0];
        const name = String(first.name || '').toLowerCase();
        return name.includes('warm') || name.includes('mobility') || name.includes('activation') ||
               name.includes('riscaldamento') || name.includes('dynamic');
    },

    /**
     * Check cooldown presence
     */
    hasCooldown(workout) {
        if (!workout.exercises || workout.exercises.length === 0) return false;
        const last = workout.exercises[workout.exercises.length - 1];
        const name = String(last.name || '').toLowerCase();
        return name.includes('cool') || name.includes('stretch') || name.includes('defaticamento') ||
               name.includes('recovery') || name.includes('foam');
    },

    /**
     * Infer reps from exercise name - VERSIONE MIGLIORATA
     */
    inferReps(name, type) {
        const nameLower = String(name || '').toLowerCase();
        
        // Se ha già tempo nel nome, estrailo
        if (/(\d+)\s*min/i.test(name)) {
            const match = name.match(/(\d+)\s*min/i);
            return `${match[1]} min`;
        }
        
        // Se ha xReps nel nome (es. 4x8)
        if (/(\d+)\s*x\s*(\d+[-\d]*)/i.test(name)) {
            const match = name.match(/(\d+)\s*x\s*(\d+[-\d]*)/i);
            return match[2];
        }
        
        // Boxing-specific
        if (/heavy bag|sacco|bag intervals/i.test(nameLower)) return '3 min';
        if (/shadow boxing/i.test(nameLower)) return '3 min';
        if (/jump rope|corda/i.test(nameLower)) return '3 min';
        if (/pad work/i.test(nameLower)) return '3 min';
        if (/boxing circuit/i.test(nameLower)) return '3 min';
        if (/neck/i.test(nameLower)) return '15-20';
        
        // Warm-up/Cooldown
        if (/warm|mobility|activation/i.test(nameLower)) return '5-7 min';
        if (/cool|stretch/i.test(nameLower)) return '5-10 min';
        
        // Type-based defaults
        if (type === 'conditioning') return '3 min';
        if (type === 'strength') return '5-6';
        if (type === 'hypertrophy') return '10-12';
        
        return '10-12';
    },

    /**
     * Sport-specific adjustments
     */
    sportSpecificAdjustments(exercises, sport, phase) {
        const sportLower = String(sport || '').toLowerCase();
        
        // Boxing: ensure neck work in intensification
        if ((sportLower === 'boxe' || sportLower === 'boxing') && phase === 'intensificazione') {
            const hasNeck = exercises.some(e => /neck/i.test(e.name));
            if (!hasNeck) {
                // Add before last exercise (cooldown)
                const insertIndex = Math.max(0, exercises.length - 1);
                exercises.splice(insertIndex, 0, {
                    name: "Neck Strengthening: Neck Curl 2x15 + Neck Extension 2x15 + Lateral Flexion 2x10/side",
                    sets: 2,
                    reps: "15",
                    type: "conditioning"
                });
            }
        }
        
        // Football: ensure hamstring work
        if (sportLower === 'calcio' || sportLower === 'football') {
            const hasHamstring = exercises.some(e => 
                /hamstring|nordic|rdl|romanian|leg curl/i.test(e.name)
            );
            if (!hasHamstring && phase !== 'deload') {
                const insertIndex = exercises.findIndex(e => e.type === 'strength');
                if (insertIndex !== -1) {
                    exercises.splice(insertIndex + 1, 0, {
                        name: "Nordic Hamstring Curl: 3x5 (with partner assist or eccentric focus)",
                        sets: 3,
                        reps: "5",
                        type: "strength"
                    });
                }
            }
        }
        
        return exercises;
    },

    /**
     * Riduce volume per principianti o bassa compliance
     */
    reduceVolumeForBeginner(exercises, corrections) {
        for (const ex of exercises) {
            const sets = parseInt(ex.sets) || 1;
            
            // Riduci sets alti
            if (sets >= 8) {
                const newSets = Math.ceil(sets * 0.5); // Dimezza
                corrections.push(`Principiante: "${ex.name.substring(0,30)}..." sets ${sets} → ${newSets}`);
                ex.sets = newSets;
            } else if (sets >= 5) {
                const newSets = Math.ceil(sets * 0.7); // Riduci 30%
                corrections.push(`Principiante: "${ex.name.substring(0,30)}..." sets ${sets} → ${newSets}`);
                ex.sets = newSets;
            }
            
            // Aggiorna anche il nome se contiene Nx
            const nameMatch = String(ex.name || '').match(/^(.+?)(\d+)\s*x\s*(\d+)\s*(min|sec|')/i);
            if (nameMatch && parseInt(nameMatch[2]) !== ex.sets) {
                const newName = `${nameMatch[1]}${ex.sets}x${nameMatch[3]}${nameMatch[4]}${ex.name.substring(nameMatch[0].length)}`;
                ex.name = newName;
            }
        }
        
        return exercises;
    },

    /**
     * Regola volume in base alla fase del mesociclo
     */
    adjustVolumeForPhase(exercises, phase, corrections) {
        const phaseLower = String(phase || '').toLowerCase();
        
        // GPP/Accumulo: volume moderato, non eccessivo
        if (phaseLower === 'accumulo' || phaseLower === 'adattamento' || phaseLower.includes('gpp')) {
            let conditioningMinutes = 0;
            
            for (const ex of exercises) {
                if (ex.type === 'conditioning') {
                    // Calcola minuti approssimativi
                    const sets = parseInt(ex.sets) || 1;
                    let minsPerSet = 3; // default
                    
                    if (/(\d+)\s*min/i.test(String(ex.reps))) {
                        const match = String(ex.reps).match(/(\d+)\s*min/i);
                        minsPerSet = parseInt(match[1]) || 3;
                    } else if (/(\d+)\s*rounds?/i.test(String(ex.reps))) {
                        minsPerSet = 3; // assume 3min per round
                    }
                    
                    conditioningMinutes += sets * minsPerSet;
                }
            }
            
            // Se conditioning > 40min, riduci i rounds
            if (conditioningMinutes > 40) {
                for (const ex of exercises) {
                    if (ex.type === 'conditioning' && parseInt(ex.sets) >= 8) {
                        const oldSets = ex.sets;
                        ex.sets = Math.max(4, Math.floor(ex.sets * 0.6)); // Riduci del 40%
                        if (oldSets !== ex.sets) {
                            corrections.push(`Volume GPP: "${ex.name}" sets ${oldSets} → ${ex.sets}`);
                        }
                    }
                }
            }
        }
        
        // Deload: volume molto ridotto
        if (phaseLower === 'deload' || phaseLower === 'scarico') {
            for (const ex of exercises) {
                const sets = parseInt(ex.sets) || 1;
                if (sets > 3) {
                    const oldSets = ex.sets;
                    ex.sets = Math.ceil(sets * 0.5); // Riduci del 50%
                    if (oldSets !== ex.sets) {
                        corrections.push(`Deload: "${ex.name}" sets ${oldSets} → ${ex.sets}`);
                    }
                }
            }
        }
        
        return exercises;
    },

    /**
     * Applica volume da PeriodizationEngine
     * @param {Array} exercises - Lista esercizi
     * @param {Object} periodization - Parametri da PeriodizationEngine
     * @param {Array} corrections - Array per tracking correzioni
     */
    applyPeriodizationVolume(exercises, periodization, corrections) {
        const volumePct = periodization.volume || 100;
        const intensityPct = periodization.intensity || 70;
        const phase = periodization.phase || 'accumulo';
        
        // NOTA: volumePct rappresenta la % del volume TARGET del mesociclo
        // L'AI genera già con il volume appropriato nel prompt
        // Il post-processor NON deve ridurre - solo gestire casi estremi
        
        // Solo intervieni se fase speciale (deload/taper) o se l'AI ha generato troppo
        const isRecoveryPhase = ['deload', 'recovery', 'taper', 'scarico'].includes(phase);
        
        for (const ex of exercises) {
            const originalSets = parseInt(ex.sets) || 3;
            
            // Salta warmup/cooldown
            if (/warm|prep|cool|stretch/i.test(ex.name)) continue;
            
            // Fase deload/recovery → max 3 sets (override forte)
            if (isRecoveryPhase && ex.sets > 3) {
                corrections.push(`📊 ${phase.toUpperCase()}: "${ex.name.substring(0,25)}..." sets ${ex.sets} → 3`);
                ex.sets = 3;
                continue;
            }
            
            // Intensità alta (>85%) → meno reps per strength
            if (intensityPct >= 85 && ex.type === 'strength') {
                const repsStr = String(ex.reps || '');
                const repsMatch = repsStr.match(/(\d+)[-–]?(\d+)?/);
                if (repsMatch) {
                    const currentReps = parseInt(repsMatch[1]);
                    if (currentReps >= 8) {
                        // Riduci a 3-6 reps
                        ex.reps = '3-5 @ RPE 8';
                        corrections.push(`📊 Intensity (${intensityPct}%): "${ex.name.substring(0,25)}..." reps → 3-5`);
                    }
                }
            }
            
            // NON ridurre sets basandosi su volumePct - l'AI lo fa già nel prompt
            // Il post-processor preserva il volume generato dall'AI
        }
        
        return exercises;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // STRICT VALIDATION (for retry logic)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Validazione stretta - ritorna array di issues critici
     */
    strictValidate(workout, sport, phase) {
        const issues = [];
        
        if (!workout) {
            issues.push('Workout è null');
            return issues;
        }
        
        if (!workout.exercises || !Array.isArray(workout.exercises)) {
            issues.push('exercises non è un array');
            return issues;
        }
        
        if (workout.exercises.length < 4) {
            issues.push(`Solo ${workout.exercises.length} esercizi - minimo 4 richiesti`);
        }
        
        if (workout.exercises.length > 12) {
            issues.push(`${workout.exercises.length} esercizi - massimo 12 consentiti`);
        }
        
        // Check each exercise
        for (let i = 0; i < workout.exercises.length; i++) {
            const ex = workout.exercises[i];
            
            if (!ex.name || typeof ex.name !== 'string') {
                issues.push(`Esercizio ${i+1}: manca nome`);
                continue;
            }
            
            // Still vague after post-processing?
            if (this.isStillVague(ex.name)) {
                issues.push(`Esercizio ${i+1} "${ex.name}" troppo vago`);
            }
            
            // Has sets and reps?
            if (!ex.sets && !ex.reps) {
                issues.push(`Esercizio ${i+1} "${ex.name}" manca sets E reps`);
            }
            
            // Type valid?
            const validTypes = ['strength', 'conditioning', 'hypertrophy', 'power', 'technique'];
            if (!ex.type || !validTypes.includes(ex.type.toLowerCase())) {
                issues.push(`Esercizio ${i+1} "${ex.name}" type non valido: ${ex.type}`);
            }
        }
        
        // Phase-specific requirements
        if (phase === 'intensificazione') {
            const hasStrength = workout.exercises.some(e => e.type === 'strength');
            if (!hasStrength) {
                issues.push('Fase intensificazione richiede almeno 1 esercizio strength');
            }
        }
        
        return issues;
    },

    /**
     * Check if name is still vague after processing
     */
    isStillVague(name) {
        const vaguePatterns = [
            /^[A-Za-z\s]{1,15}$/,  // Very short single/two words without details
            /^conditioning$/i,
            /^cardio$/i,
            /^strength$/i,
            /^core$/i,
            /^circuit$/i,
            /^training$/i,
            /^workout$/i
        ];
        
        // But allow if has numbers (sets/reps/time in name)
        if (/\d/.test(name)) return false;
        
        // Allow if has common specific markers
        if (/bench|squat|deadlift|press|curl|row|pull|push|jump|sprint|run|swing/i.test(name)) return false;
        
        for (const pattern of vaguePatterns) {
            if (pattern.test(name.trim())) return true;
        }
        
        return false;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // FIXED PARAMETERS ENFORCEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Applica parametri fissi per esercizi specifici
     * Alcuni esercizi hanno parametri che NON devono mai variare
     */
    enforceFixedParameters(exercises, corrections) {
        const FIXED = {
            box_jump: {
                patterns: [/box jump/i],
                reps: { min: 3, max: 8 },
                sets: { min: 3, max: 5 },
                rest: { min: 90, max: 180 },
                neverTimed: true,
                correctReps: '5-6',
                correctRest: '120s'
            },
            depth_jump: {
                patterns: [/depth jump|drop jump/i],
                reps: { min: 3, max: 6 },
                sets: { min: 3, max: 4 },
                rest: { min: 120, max: 180 },
                neverTimed: true,
                correctReps: '4-5',
                correctRest: '150s'
            },
            plank: {
                patterns: [/^plank$/i, /plank:/i, /side plank/i],
                reps: { min: 20, max: 60, unit: 'seconds' },
                sets: { min: 2, max: 4 },
                rest: { min: 30, max: 60 },
                correctReps: '45 sec',
                correctRest: '45s'
            },
            neck: {
                patterns: [/neck flexion|neck extension|neck lateral|neck curl|neck strengthening/i],
                reps: { min: 12, max: 20 },
                sets: { min: 2, max: 4 },
                rest: { min: 30, max: 60 },
                neverTimed: true,
                correctReps: '15-20',
                correctRest: '30s'
            }
        };

        // ═══════════════════════════════════════════════════════════════════════════
        // ROUND-BASED EXERCISES - Devono avere reps in formato "N minutes"
        // ═══════════════════════════════════════════════════════════════════════════
        const ROUND_BASED_FIX = [
            /heavy bag/i, /sacco/i, /shadow boxing/i, /shadow/i,
            /pad work/i, /speed bag/i, /double end/i, /sparring/i,
            /boxing circuit/i, /jump rope/i, /corda/i
        ];

        for (const ex of exercises) {
            const name = String(ex.name || '').toLowerCase();
            const repsStr = String(ex.reps || '').toLowerCase().trim();
            
            // ═══════════════════════════════════════════════════════════════════════════
            // FIX ROUND-BASED: reps numerico puro → "N minutes"
            // Es: Heavy Bag Power Rounds con reps="3" → reps="3 minutes"
            // ═══════════════════════════════════════════════════════════════════════════
            const isRoundBased = ROUND_BASED_FIX.some(p => p.test(name));
            if (isRoundBased) {
                // Se reps è solo un numero (es. "3")
                if (/^\d+$/.test(repsStr)) {
                    const num = parseInt(repsStr);
                    // Se il numero è ragionevole per minuti (1-5)
                    if (num >= 1 && num <= 5) {
                        corrections.push(`🔧 FIX ROUND: "${ex.name.substring(0,35)}..." reps "${ex.reps}" → "${num} minutes"`);
                        ex.reps = `${num} minutes`;
                    } else if (num > 5) {
                        // Probabilmente sono rep, non minuti - default 3 min per round
                        corrections.push(`🔧 FIX ROUND: "${ex.name.substring(0,35)}..." reps "${ex.reps}" → "3 minutes" (round-based)`);
                        ex.reps = '3 minutes';
                    }
                }
                
                // Se reps è "N min" senza "utes", normalizza
                if (/^\d+\s*min$/i.test(repsStr)) {
                    const mins = parseInt(repsStr.match(/(\d+)/)[1]);
                    ex.reps = `${mins} minutes`;
                }
                
                // Rest per round-based deve essere 60s
                const restVal = parseInt(String(ex.rest || '0').replace(/\D/g, ''));
                if (!ex.rest || restVal === 0) {
                    ex.rest = '60s';
                }
            }
            
            // ═══════════════════════════════════════════════════════════════════════════
            // FIX ESERCIZI CON PARAMETRI FISSI
            // ═══════════════════════════════════════════════════════════════════════════
            for (const [key, rules] of Object.entries(FIXED)) {
                const matches = rules.patterns.some(p => p.test(name));
                if (!matches) continue;
                
                // Check if time-based when it shouldn't be
                if (rules.neverTimed && /min/i.test(repsStr)) {
                    corrections.push(`🛑 FIX: "${ex.name.substring(0,30)}..." reps "${ex.reps}" → "${rules.correctReps}" (mai a tempo)`);
                    ex.reps = rules.correctReps;
                }
                
                // Check plank in minutes (should be seconds)
                if (key === 'plank' && /(\d+)\s*min/i.test(repsStr)) {
                    const mins = parseInt(repsStr.match(/(\d+)/)[1]);
                    if (mins >= 2) {
                        corrections.push(`🛑 FIX: Plank "${ex.reps}" → "45 sec" (max 60s)`);
                        ex.reps = '45 sec';
                    }
                }
                
                // Fix rest if too short
                const restVal = parseInt(String(ex.rest || '0').replace(/\D/g, ''));
                if (restVal > 0 && restVal < rules.rest.min) {
                    corrections.push(`🛑 FIX: "${ex.name.substring(0,30)}..." rest ${ex.rest} → ${rules.correctRest}`);
                    ex.rest = rules.correctRest;
                }
            }
        }
        
        return exercises;
    },

    /**
     * Valida coerenza tra nome esercizio e parametri
     * Se nome dice "4x6-8", i parametri devono corrispondere
     * MIGLIORATO: gestisce anche formato round-based (Nx3min)
     */
    validateNameParameterConsistency(exercises, corrections) {
        for (const ex of exercises) {
            const name = String(ex.name || '');
            const nameLower = name.toLowerCase();
            // Nuovo: matcha "Nx3min" anche con testo extra (es. tra parentesi)
            const roundPattern = name.match(/(\d+)\s*x\s*(\d+)\s*min(?![a-z])/i);
            if (roundPattern) {
                const expectedSets = parseInt(roundPattern[1]);
                const expectedMins = roundPattern[2];
                // Sync sets
                if (ex.sets !== expectedSets && expectedSets <= 12) {
                    corrections.push(`📐 SYNC ROUND: "${name.substring(0,35)}..." sets ${ex.sets} → ${expectedSets}`);
                    ex.sets = expectedSets;
                }
                // Sync reps → deve essere "N minutes"
                const currentReps = String(ex.reps || '').toLowerCase();
                const expectedReps = `${expectedMins} minutes`;
                if (!/min/i.test(currentReps) || !currentReps.includes(expectedMins)) {
                    corrections.push(`📐 SYNC ROUND: "${name.substring(0,35)}..." reps "${ex.reps}" → "${expectedReps}"`);
                    ex.reps = expectedReps;
                }
                continue;
            }
            
            // ═══════════════════════════════════════════════════════════════
            // 2. ESERCIZI ROUND-BASED senza formato nel nome
            // Heavy Bag, Shadow Boxing, Pad Work con reps numerico puro
            // ═══════════════════════════════════════════════════════════════
            const isRoundBased = /shadow|heavy bag|sacco|pad work|speed bag|boxing circuit/i.test(nameLower);
            if (isRoundBased) {
                const repsStr = String(ex.reps || '').toLowerCase();
                const repsNum = parseInt(repsStr.replace(/\D/g, ''), 10);
                
                // Se reps è solo un numero (es. "3" invece di "3 minutes")
                if (/^\d+$/.test(repsStr.trim()) && repsNum <= 5) {
                    corrections.push(`📐 FIX ROUND: "${name.substring(0,35)}..." reps "${ex.reps}" → "${repsNum} minutes" (round-based)`);
                    ex.reps = `${repsNum} minutes`;
                }
                
                // Se reps è "3 min" assicura formato consistente
                if (/^\d+\s*min$/i.test(repsStr.trim())) {
                    const mins = parseInt(repsStr.match(/(\d+)/)[1]);
                    ex.reps = `${mins} minutes`;
                }
            }
            
            // ═══════════════════════════════════════════════════════════════
            // 3. PATTERN STANDARD: "NxR" o "NxR-R" (sets x reps)
            // ═══════════════════════════════════════════════════════════════
            const namePattern = name.match(/(\d+)\s*x\s*(\d+(?:[-–]\d+)?)\s*(?:@|$|\s)/i);
            if (namePattern) {
                const expectedSets = parseInt(namePattern[1]);
                const expectedReps = namePattern[2];
                
                // Sync sets se non corrispondono
                if (ex.sets !== expectedSets && expectedSets <= 10) {
                    corrections.push(`📐 SYNC: "${name.substring(0,30)}..." sets ${ex.sets} → ${expectedSets} (da nome)`);
                    ex.sets = expectedSets;
                }
                
                // Sync reps se sono molto diverse (ignora se contiene "min" o "@")
                const currentReps = String(ex.reps || '');
                if (!currentReps.includes('min') && !currentReps.includes('@') && !currentReps.includes('sec')) {
                    const currentRepsNum = parseInt(currentReps.replace(/\D/g, ''));
                    const expectedRepsNum = parseInt(expectedReps.replace(/\D/g, ''));
                    
                    if (currentRepsNum && expectedRepsNum && Math.abs(currentRepsNum - expectedRepsNum) > 3) {
                        corrections.push(`📐 SYNC: "${name.substring(0,30)}..." reps ${ex.reps} → ${expectedReps} (da nome)`);
                        ex.reps = expectedReps;
                    }
                }
            }
        }
        
        return exercises;
    },
    
    /**
     * Applica deload intelligente con minimi sensati
     * Non taglia mai sotto 2 serie per compound, 2 round per boxing
     */
    applySmartDeload(exercises, deloadPercent, corrections) {
        const DELOAD_MINIMUMS = {
            compound: 2,      // Squat, Deadlift, Bench, Row, Press
            roundBased: 2,    // Shadow, Heavy Bag, Pad Work
            accessory: 1,     // Curl, Lateral Raise, etc.
            default: 2
        };
        
        for (const ex of exercises) {
            const name = String(ex.name || '').toLowerCase();
            const originalSets = parseInt(ex.sets) || 1;
            
            // Skip warmup/cooldown
            if (/warm|cool|stretch|mobility/i.test(name)) continue;
            
            // Determina tipo esercizio
            let exType = 'default';
            if (/squat|deadlift|bench|press|row|pull-?up|chin-?up/i.test(name)) {
                exType = 'compound';
            } else if (/shadow|heavy bag|sacco|pad work|speed bag|sparring/i.test(name)) {
                exType = 'roundBased';
            } else if (/curl|raise|fly|extension|face pull|band/i.test(name)) {
                exType = 'accessory';
            }
            
            // Calcola nuove serie
            let newSets = Math.round(originalSets * (1 - deloadPercent / 100));
            
            // Applica minimi
            const minSets = DELOAD_MINIMUMS[exType];
            if (newSets < minSets) {
                newSets = minSets;
            }
            
            // Applica se diverso
            if (newSets !== originalSets) {
                corrections.push(`📉 DELOAD: "${name.substring(0,30)}..." sets ${originalSets} → ${newSets} (min ${minSets})`);
                ex.sets = newSets;
                
                // Aggiorna nome se contiene NxM
                const nameMatch = name.match(/^(.+?)(\d+)\s*x\s*(\d+)/i);
                if (nameMatch && parseInt(nameMatch[2]) !== newSets) {
                    // Ricostruisci nome con nuovi sets
                    const restOfName = ex.name.substring(nameMatch[0].length);
                    ex.name = `${nameMatch[1]}${newSets}x${nameMatch[3]}${restOfName}`;
                }
            }
        }
        
        return exercises;
    },

    /**
     * Validazione pattern limits (max esercizi per pattern motorio)
     */
    validatePatternLimits(exercises) {
        const issues = [];
        const patterns = {
            squat: { count: 0, max: 2, regex: /squat|goblet/i, exclude: /jump squat/i },
            hinge: { count: 0, max: 2, regex: /deadlift|rdl|romanian|hip thrust|swing/i },
            push: { count: 0, max: 3, regex: /bench|press|push-?up|dip/i },
            pull: { count: 0, max: 3, regex: /row|pull-?up|chin-?up|lat pull/i }
        };
        
        for (const ex of exercises) {
            const name = String(ex.name || '').toLowerCase();
            
            for (const [pattern, config] of Object.entries(patterns)) {
                if (config.regex.test(name) && (!config.exclude || !config.exclude.test(name))) {
                    config.count++;
                }
            }
        }
        
        for (const [pattern, config] of Object.entries(patterns)) {
            if (config.count > config.max) {
                issues.push(`Pattern "${pattern}": ${config.count} esercizi (max ${config.max})`);
            }
        }
        
        return issues;
    }
};

// Export
window.WorkoutPostProcessor = WorkoutPostProcessor;
