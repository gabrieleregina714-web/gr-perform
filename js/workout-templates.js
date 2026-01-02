// GR Perform - Workout Templates
// Template rigidi per garantire struttura coerente - l'AI riempie solo gli slot

const WORKOUT_TEMPLATES = {

    // ═══════════════════════════════════════════════════════════════════════════
    // BOXE 🥊
    // ═══════════════════════════════════════════════════════════════════════════

    boxe: {
        accumulo: {
            name: "Boxing GPP - Volume",
            structure: [
                { slot: "warmup", type: "conditioning", required: true, 
                  options: [
                    "Mobility Flow: Neck Circles + Shoulder Rolls + Hip Circles + Ankle Rotations (5min)",
                    "Dynamic Warm-up: Jumping Jacks + High Knees + Butt Kicks + Arm Circles (5min)",
                    "Jump Rope: 3x2min (alternating pace) + 30s rest between"
                  ]
                },
                { slot: "technical", type: "conditioning", required: true,
                  options: [
                    "Shadow Boxing: 4x3min (Round 1: Jab-Cross only, Round 2: add Hook, Round 3: add Uppercut, Round 4: freestyle combos)",
                    "Mirror Drill: 3x3min (focus footwork + head movement: slip, roll, pivot)",
                    "Footwork Ladder: 3 sets (Ali Shuffle 30s + In-Out 30s + Lateral Slides 30s)"
                  ]
                },
                { slot: "strength_main", type: "strength", required: true,
                  options: [
                    "A1: Push-up Variations (3x12-15: standard, diamond, wide)",
                    "A1: Goblet Squat (superset)",
                    "A1: KB Swing (4x12)"
                  ]
                },
                { slot: "strength_accessory", type: "hypertrophy", required: true,
                  options: [
                    "A2: Inverted Row or TRX Row (superset with A1)",
                    "A2: Romanian Deadlift (superset)",
                    "B: Medicine Ball Rotational Throw (3x8/side)"
                  ]
                },
                { slot: "conditioning", type: "conditioning", required: true,
                  options: [
                    "Heavy Bag Circuit: 6x2min (Round 1-2: single punches power, Round 3-4: 2-punch combos, Round 5-6: body shots) - 1min rest",
                    "Pad Work Simulation: 5x2min (coach calls combos) - 45s rest",
                    "EMOM 10min: Even min - 10 Burpees, Odd min - 15 KB Swings"
                  ]
                },
                { slot: "finisher", type: "conditioning", required: false,
                  options: [
                    "Core Circuit: 3x (20 Russian Twists + 15 Leg Raises + 30s Plank + 10 V-ups)",
                    "Neck Strengthening: 4-way isometric holds (Front/Back/Left/Right) x 20s each x 2 sets",
                    "Cooldown: Static stretching focusing on shoulders, hips, and hamstrings (5min)"
                  ]
                }
            ]
        },
        intensificazione: {
            name: "Boxing Power Phase",
            structure: [
                { slot: "warmup", type: "conditioning", required: true,
                  options: [
                    "Dynamic Warm-up: Jump Rope 3min + Shadow Boxing light 2min",
                    "Mobility: Cat-Cow + Thread Needle + Hip 90/90 + Shoulder Dislocates (5min)"
                  ]
                },
                { slot: "power", type: "strength", required: true,
                  options: [
                    "Medicine Ball Slam: 4x6 (max power, full reset between reps)",
                    "Explosive Push-up: 4x5 (clap or release)",
                    "Box Jump: 4x5 (step down, full reset)"
                  ]
                },
                { slot: "strength_main", type: "strength", required: true,
                  options: [
                    "A1: Landmine Press (4x6-8 per arm) - rotational power",
                    "A1: Bench Press (4x5 @ RPE 8)",
                    "A1: Weighted Pull-up or Lat Pulldown (4x6)"
                  ]
                },
                { slot: "strength_accessory", type: "hypertrophy", required: true,
                  options: [
                    "A2: Single-Arm DB Row (4x8/arm)",
                    "B: Cable Woodchop (3x10/side)",
                    "B: Face Pull (3x12-15)"
                  ]
                },
                { slot: "sport_specific", type: "conditioning", required: true,
                  options: [
                    "Heavy Bag Power Rounds: 5x1min (MAX power single shots: Cross, Hook, Uppercut) - 1min rest",
                    "Pad Work: 4x2min (power combos 1-2-3, focus on hip rotation)",
                    "Speed Bag: 3x3min continuous (rhythm and shoulder endurance)"
                  ]
                },
                { slot: "finisher", type: "conditioning", required: false,
                  options: [
                    "Neck Circuit: Neck Curl 2x15 + Neck Extension 2x15 + Lateral Flexion 2x10/side",
                    "Core: Dead Bug 3x10/side + Pallof Press 3x10/side"
                  ]
                }
            ]
        },
        deload: {
            name: "Boxing Recovery Week",
            structure: [
                { slot: "warmup", type: "conditioning", required: true,
                  options: [
                    "Light Jump Rope: 2x2min (easy pace)",
                    "Joint Mobility Flow: All major joints, slow and controlled (8min)"
                  ]
                },
                { slot: "technical", type: "conditioning", required: true,
                  options: [
                    "Shadow Boxing: 3x3min (50% intensity, focus on perfect form and breathing)",
                    "Footwork Only: 2x3min (no punches, just movement patterns)"
                  ]
                },
                { slot: "light_strength", type: "conditioning", required: true,
                  options: [
                    "Bodyweight Circuit (easy): 2x (10 Squats + 10 Push-ups + 10 Rows + 10 Lunges)",
                    "Resistance Band Work: Pull-aparts, Face Pulls, External Rotations (2x15 each)"
                  ]
                },
                { slot: "recovery", type: "conditioning", required: true,
                  options: [
                    "Foam Rolling: Full body, 30s per muscle group (10min total)",
                    "Static Stretching: Hip flexors, hamstrings, shoulders, neck (10min)",
                    "Breathing Work: Box Breathing 4-4-4-4 for 5 minutes"
                  ]
                }
            ]
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // CALCIO ⚽
    // ═══════════════════════════════════════════════════════════════════════════

    calcio: {
        accumulo: {
            name: "Football GPP - Base Building",
            structure: [
                { slot: "warmup", type: "conditioning", required: true,
                  options: [
                    "FIFA 11+ Warm-up Part 1: Running exercises (8min)",
                    "Dynamic Warm-up: Leg Swings + Hip Circles + A-Skip + B-Skip + Carioca (7min)"
                  ]
                },
                { slot: "activation", type: "conditioning", required: true,
                  options: [
                    "Glute Activation: Clamshells + Glute Bridge + Fire Hydrants (2x12 each)",
                    "Core Activation: Dead Bug + Bird Dog + Plank (30s each, 2 sets)"
                  ]
                },
                { slot: "strength_main", type: "strength", required: true,
                  options: [
                    "A1: Back Squat (4x8 @ RPE 7)",
                    "A1: Trap Bar Deadlift (4x6)",
                    "A1: Bulgarian Split Squat (3x10/leg)"
                  ]
                },
                { slot: "strength_accessory", type: "hypertrophy", required: true,
                  options: [
                    "A2: Nordic Hamstring Curl (3x5 with partner assist)",
                    "A2: Copenhagen Adductor (3x8/side)",
                    "B: Single-Leg RDL (3x8/leg)"
                  ]
                },
                { slot: "conditioning", type: "conditioning", required: true,
                  options: [
                    "Aerobic Base: 20min Zone 2 run (conversational pace)",
                    "Tempo Runs: 4x400m @ 75% with 90s rest",
                    "Small-Sided Game Simulation: 4x4min work / 2min rest"
                  ]
                },
                { slot: "prehab", type: "conditioning", required: false,
                  options: [
                    "Ankle Stability: Single-leg balance variations (30s each x 3 positions)",
                    "Hip Mobility: 90/90 stretch + Pigeon + Frog stretch (2min each)"
                  ]
                }
            ]
        },
        intensificazione: {
            name: "Football Power & Speed",
            structure: [
                { slot: "warmup", type: "conditioning", required: true,
                  options: [
                    "Dynamic Warm-up: Build-ups + Acceleration drills (10min)",
                    "FIFA 11+ Part 1 + Part 2 (strength exercises)"
                  ]
                },
                { slot: "power", type: "strength", required: true,
                  options: [
                    "Contrast: Back Squat 3x3 @ 85% → Box Jump 3x5",
                    "Contrast: Trap Bar Deadlift 3x3 @ 85% → Broad Jump 3x5",
                    "Jump Training: Drop Jump 4x5 (focus on reactive strength)"
                  ]
                },
                { slot: "speed", type: "conditioning", required: true,
                  options: [
                    "Sprint Training: 6x20m from standing start, full recovery (2min)",
                    "Acceleration Drill: 8x10m, focus on first 3 steps",
                    "Flying Sprints: 4x20m (10m build-up + 20m max)"
                  ]
                },
                { slot: "agility", type: "conditioning", required: true,
                  options: [
                    "COD Drill: T-Test 4x with full recovery",
                    "Reactive Agility: 3x (mirror drill with partner, 20s work)",
                    "Ladder Work: 3 patterns (Ickey Shuffle + In-Out + Lateral) x 3 sets"
                  ]
                },
                { slot: "conditioning", type: "conditioning", required: true,
                  options: [
                    "RSA: 6x30m sprint, 25s recovery, 2 sets with 3min between",
                    "Yo-Yo IR1: 2 sets to exhaustion",
                    "High-Intensity Intervals: 4x4min @ 90% HRmax, 3min recovery"
                  ]
                }
            ]
        },
        deload: {
            name: "Football Recovery Week",
            structure: [
                { slot: "warmup", type: "conditioning", required: true,
                  options: [
                    "Light jog + dynamic stretching (10min)"
                  ]
                },
                { slot: "technical", type: "conditioning", required: true,
                  options: [
                    "Ball work: Passing patterns, first touch drills (15min at 60% intensity)",
                    "Rondo: 4v1 or 5v2, low intensity (10min)"
                  ]
                },
                { slot: "light_conditioning", type: "conditioning", required: true,
                  options: [
                    "Pool Session: Aqua jogging 20min",
                    "Bike: 20min Zone 1 (recovery spin)",
                    "Walk: 30min outdoor, no intensity"
                  ]
                },
                { slot: "recovery", type: "conditioning", required: true,
                  options: [
                    "Foam Rolling + Stretching: Lower body focus (15min)",
                    "Hip Mobility Routine: 90/90 + Pigeon + Couch Stretch (10min)"
                  ]
                }
            ]
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // BASKET 🏀
    // ═══════════════════════════════════════════════════════════════════════════

    basket: {
        accumulo: {
            name: "Basketball GPP",
            structure: [
                { slot: "warmup", type: "conditioning", required: true,
                  options: [
                    "Dynamic Warm-up: Leg Swings + Arm Circles + High Knees + Butt Kicks + Lateral Slides (7min)",
                    "Ball Handling Warm-up: Stationary dribbling patterns (5min)"
                  ]
                },
                { slot: "jump_training", type: "strength", required: true,
                  options: [
                    "Approach Jumps: 3x5 (2-foot takeoff, max height)",
                    "Box Jump: 4x5 (step down, focus on landing mechanics)",
                    "Depth Jump to Vertical: 3x5 from 30cm box"
                  ]
                },
                { slot: "strength_main", type: "strength", required: true,
                  options: [
                    "A1: Front Squat (4x6 @ RPE 7)",
                    "A1: Trap Bar Deadlift (4x5)",
                    "A1: Single-Leg Squat to Box (3x8/leg)"
                  ]
                },
                { slot: "strength_upper", type: "hypertrophy", required: true,
                  options: [
                    "A2: DB Bench Press (4x8)",
                    "A2: Pull-up or Lat Pulldown (4x8)",
                    "B: DB Row (3x10/arm)"
                  ]
                },
                { slot: "conditioning", type: "conditioning", required: true,
                  options: [
                    "Court Sprints: Suicide drills 4x with 90s rest",
                    "Lane Agility: Full court defensive slides + sprint back 4x",
                    "17s: Sideline to sideline 17x in 60s, 3 sets"
                  ]
                },
                { slot: "core", type: "conditioning", required: false,
                  options: [
                    "Core Circuit: 3x (15 Med Ball Twist + 10 Hanging Leg Raise + 30s Side Plank/side)"
                  ]
                }
            ]
        },
        intensificazione: {
            name: "Basketball Power Phase",
            structure: [
                { slot: "warmup", type: "conditioning", required: true,
                  options: [
                    "Movement Prep: Ankle mobility + Hip flow + Dynamic stretching (8min)"
                  ]
                },
                { slot: "power", type: "strength", required: true,
                  options: [
                    "Contrast: Trap Bar Deadlift 3x3 → Vertical Jump 3x5",
                    "Contrast: Split Squat 3x3/leg → Split Jump 3x5/leg",
                    "Reactive: Depth Jump 4x5 (minimize ground contact)"
                  ]
                },
                { slot: "strength", type: "strength", required: true,
                  options: [
                    "A1: Power Clean (4x3) or Hang Clean (4x3)",
                    "A2: Push Press (4x5)",
                    "B: Weighted Pull-up (4x5)"
                  ]
                },
                { slot: "court_work", type: "conditioning", required: true,
                  options: [
                    "Fast Break Drill: 5v0 → 5v5 transition, 5 sets",
                    "Defensive Slides: Zig-zag full court + close-out jumps, 4 sets",
                    "3-man Weave + Layup/Jumper: 4 sets each direction"
                  ]
                },
                { slot: "conditioning", type: "conditioning", required: true,
                  options: [
                    "Game Simulation: 4x4min pickup scrimmage with 2min rest",
                    "Repeated Sprints: 10x full court (baseline to baseline), 30s rest"
                  ]
                }
            ]
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // PALESTRA 🏋️
    // ═══════════════════════════════════════════════════════════════════════════

    palestra: {
        accumulo: {
            name: "Hypertrophy - Volume Phase",
            structure: [
                { slot: "warmup", type: "conditioning", required: true,
                  options: [
                    "General Warm-up: 5min cardio + dynamic stretching",
                    "Specific Warm-up: 2x12 light weight on first exercise"
                  ]
                },
                { slot: "main_compound", type: "strength", required: true,
                  options: [
                    "A: Squat Pattern (Back Squat / Front Squat / Goblet) - 4x8-10",
                    "A: Hinge Pattern (Deadlift / RDL / Trap Bar) - 4x6-8",
                    "A: Horizontal Push (Bench Press / DB Press) - 4x8-10",
                    "A: Vertical Pull (Pull-up / Lat Pulldown) - 4x8-10"
                  ]
                },
                { slot: "accessory_superset_1", type: "hypertrophy", required: true,
                  options: [
                    "B1: Walking Lunges (superset) - 3x12/leg",
                    "B1: Leg Press (superset) - 3x12-15",
                    "B1: Incline DB Press (superset) - 3x10-12"
                  ]
                },
                { slot: "accessory_superset_2", type: "hypertrophy", required: true,
                  options: [
                    "B2: Leg Curl (superset) - 3x12-15",
                    "B2: Cable Row (superset) - 3x12",
                    "B2: Lateral Raise (superset) - 3x15"
                  ]
                },
                { slot: "isolation", type: "hypertrophy", required: true,
                  options: [
                    "C: Tricep Pushdown (drop set) - 3x12 + drop 10 + drop 8",
                    "C: Bicep Curl (myo-reps) - 1x15 activation + 4x5 mini-sets",
                    "C: Lateral Raise (drop set) - 3x15 + drop 12 + drop 10"
                  ]
                },
                { slot: "core_finisher", type: "conditioning", required: false,
                  options: [
                    "Core Circuit: 3x (15 Cable Crunch + 15 Hanging Leg Raise + 30s Plank)",
                    "Finisher: AMRAP 5min (10 KB Swing + 10 Goblet Squat)"
                  ]
                }
            ]
        },
        intensificazione: {
            name: "Strength - Intensity Phase",
            structure: [
                { slot: "warmup", type: "conditioning", required: true,
                  options: [
                    "Specific Warm-up: Ramp-up sets (50% x 5, 70% x 3, 80% x 2)"
                  ]
                },
                { slot: "main_strength", type: "strength", required: true,
                  options: [
                    "A: Main Lift (Squat/Bench/Deadlift) - 5x3 @ RPE 8-9",
                    "A: Competition Lift - Work up to heavy single @ RPE 9, then 3x3 @ 85%"
                  ]
                },
                { slot: "secondary", type: "strength", required: true,
                  options: [
                    "B: Variation Lift (Pause Squat / Close-Grip Bench / Deficit Dead) - 4x5 @ RPE 7",
                    "B: Opposite Pattern (if squat day: hinge, if bench day: row) - 4x6"
                  ]
                },
                { slot: "accessory", type: "hypertrophy", required: true,
                  options: [
                    "C1: Unilateral Work (Split Squat / Single-Arm Press) - 3x8/side (superset)",
                    "C2: Antagonist (Row / Pull-up / Face Pull) - 3x10 (superset)"
                  ]
                },
                { slot: "pump", type: "hypertrophy", required: false,
                  options: [
                    "D: Isolation for weak points - 2-3x15-20 (light, focus on mind-muscle)",
                    "D: Arm Superset (Curl + Pushdown) - 3x12-15"
                  ]
                }
            ]
        },
        deload: {
            name: "Deload Week",
            structure: [
                { slot: "warmup", type: "conditioning", required: true,
                  options: [
                    "Extended Warm-up: 10min cardio + thorough mobility work"
                  ]
                },
                { slot: "main", type: "strength", required: true,
                  options: [
                    "A: Main Lifts at 60% - 3x5 (focus on speed and technique)",
                    "A: Bodyweight or light DB variations only"
                  ]
                },
                { slot: "accessory", type: "hypertrophy", required: true,
                  options: [
                    "B: 50% volume of normal week - 2x10-12 on key accessories"
                  ]
                },
                { slot: "recovery", type: "conditioning", required: true,
                  options: [
                    "Stretching: 15min static stretching all major muscle groups",
                    "Foam Rolling: Full body (quads, hamstrings, glutes, lats, thoracic) - 10min"
                  ]
                }
            ]
        }
    }
};


// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATE SELECTOR - Sceglie template e opzioni appropriate
// ═══════════════════════════════════════════════════════════════════════════

const TemplateSelector = {

    /**
     * Ottiene il template per sport e fase
     */
    getTemplate(sport, phase) {
        const sportKey = String(sport || 'palestra').toLowerCase();
        const phaseKey = String(phase || 'accumulo').toLowerCase();
        
        // Normalize phase
        const phaseMap = {
            'adattamento': 'accumulo',
            'accumulo': 'accumulo',
            'intensificazione': 'intensificazione',
            'peaking': 'intensificazione',
            'realizzazione': 'intensificazione',
            'deload': 'deload',
            'scarico': 'deload'
        };
        
        const mappedPhase = phaseMap[phaseKey] || 'accumulo';
        
        if (WORKOUT_TEMPLATES[sportKey] && WORKOUT_TEMPLATES[sportKey][mappedPhase]) {
            return WORKOUT_TEMPLATES[sportKey][mappedPhase];
        }
        
        // Fallback to palestra
        return WORKOUT_TEMPLATES.palestra[mappedPhase] || WORKOUT_TEMPLATES.palestra.accumulo;
    },

    /**
     * Genera struttura base da template (l'AI poi può modificare le opzioni)
     */
    generateBaseWorkout(sport, phase, weekNumber) {
        const template = this.getTemplate(sport, phase);
        
        const exercises = [];
        let exerciseIndex = 0;
        
        for (const slot of template.structure) {
            if (!slot.required && Math.random() > 0.7) continue; // Skip optional 30% del tempo
            
            // Scegli opzione random (o la prima per determinismo)
            const optionIndex = weekNumber ? (weekNumber % slot.options.length) : 0;
            const exerciseName = slot.options[optionIndex];
            
            exercises.push({
                name: exerciseName,
                sets: this.inferSets(exerciseName),
                reps: this.inferReps(exerciseName),
                type: slot.type
            });
            
            exerciseIndex++;
        }
        
        return {
            name: template.name,
            estimated_duration_minutes: 55,
            exercises
        };
    },

    /**
     * Inferisce sets da nome esercizio
     */
    inferSets(name) {
        const match = name.match(/(\d+)x\d+/);
        if (match) return parseInt(match[1]);
        if (/circuit|emom|amrap/i.test(name)) return 1;
        if (/warm|stretch|mobility/i.test(name)) return 1;
        return 3;
    },

    /**
     * Inferisce reps da nome esercizio
     */
    inferReps(name) {
        // Check for time-based
        if (/\d+min/i.test(name)) {
            const match = name.match(/(\d+)min/i);
            return match ? `${match[1]} min` : '5 min';
        }
        // Check for xReps format
        const xMatch = name.match(/(\d+)x(\d+[-\d]*)/);
        if (xMatch) return xMatch[2];
        // Check for rounds
        if (/round/i.test(name)) return 'as prescribed';
        // Default
        return '10-12';
    },

    /**
     * Valida un workout contro il template (ritorna issues)
     */
    validateAgainstTemplate(workout, sport, phase) {
        const template = this.getTemplate(sport, phase);
        const issues = [];
        
        const exs = workout?.exercises || [];
        const types = exs.map(e => String(e?.type || '').toLowerCase());
        
        // Check required slots
        for (const slot of template.structure) {
            if (!slot.required) continue;
            
            const hasSlotType = types.includes(slot.type);
            if (!hasSlotType) {
                issues.push(`Manca slot ${slot.slot} (type: ${slot.type})`);
            }
        }
        
        // Check structure balance
        const strengthCount = types.filter(t => t === 'strength').length;
        const conditioningCount = types.filter(t => t === 'conditioning').length;
        
        if (phase !== 'deload' && strengthCount === 0) {
            issues.push('Nessun esercizio strength nel workout');
        }
        
        return issues;
    },

    /**
     * Genera prompt section con template structure
     */
    generateTemplatePrompt(sport, phase) {
        const template = this.getTemplate(sport, phase);
        
        let text = `\n🏗️ TEMPLATE STRUTTURA OBBLIGATORIA (segui questo ordine):\n`;
        text += `Workout: ${template.name}\n\n`;
        
        for (const slot of template.structure) {
            const required = slot.required ? '✅ OBBLIGATORIO' : '⚪ Opzionale';
            text += `${slot.slot.toUpperCase()} [${slot.type}] - ${required}\n`;
            text += `  Esempi accettabili:\n`;
            for (const opt of slot.options.slice(0, 2)) {
                text += `  • "${opt}"\n`;
            }
            text += '\n';
        }
        
        return text;
    }
};

// Export
window.WORKOUT_TEMPLATES = WORKOUT_TEMPLATES;
window.TemplateSelector = TemplateSelector;
