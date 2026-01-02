/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ATLAS WARMUP INTELLIGENCE SYSTEM v1.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sistema NASA-level per la generazione di riscaldamenti scientificamente ottimali.
 * 
 * FONDAMENTI SCIENTIFICI:
 * - RAMP Protocol (Raise, Activate, Mobilize, Potentiate) - Dr. Ian Jeffreys
 * - PAP (Post-Activation Potentiation) per performance
 * - Tissue Temperature Theory (aumento 1-2°C per ottimizzare viscosità)
 * - Neural Priming per coordinazione motoria
 * - Movement Preparation vs Static Stretching (meta-analisi 2020+)
 * 
 * ADATTAMENTI INTELLIGENTI:
 * - Fase del percorso (injury prevention focus iniziale)
 * - Esercizi del workout (preparazione specifica)
 * - Storico atleta (aree problematiche, mobilità)
 * - Temperatura ambiente (modulazione durata)
 * - Ora del giorno (mattina = più lungo)
 * 
 * @author ATLAS Performance System
 * @version 1.0.0
 * @date 2025
 */

const WarmupIntelligence = {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧬 CONFIGURAZIONE SCIENTIFICA
    // ═══════════════════════════════════════════════════════════════════════════
    
    config: {
        // Durate base per fase RAMP (in secondi)
        phaseDurations: {
            raise: { min: 180, optimal: 300, max: 420 },      // 3-7 min
            activate: { min: 120, optimal: 180, max: 300 },   // 2-5 min
            mobilize: { min: 120, optimal: 180, max: 300 },   // 2-5 min
            potentiate: { min: 60, optimal: 120, max: 180 }   // 1-3 min
        },
        
        // Moltiplicatori per contesto
        contextMultipliers: {
            morningSession: 1.3,      // Mattina presto = tessuti più rigidi
            eveningSession: 0.9,      // Sera = già "caldi" dalla giornata
            coldEnvironment: 1.4,     // <15°C
            hotEnvironment: 0.8,      // >28°C
            postInjury: 1.5,          // Area precedentemente infortunata
            beginnerPhase: 1.3,       // Settimane 1-4: focus prevenzione
            advancedPhase: 0.9        // Fase avanzata: efficienza
        },
        
        // Target heart rate zones per fase
        heartRateZones: {
            raise: { min: 0.5, max: 0.65 },      // 50-65% HRmax
            activate: { min: 0.6, max: 0.75 },   // 60-75% HRmax
            potentiate: { min: 0.7, max: 0.85 }  // 70-85% HRmax (brevi picchi)
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📚 MOVEMENT LIBRARY - Esercizi categorizzati per fase RAMP
    // ═══════════════════════════════════════════════════════════════════════════
    
    movementLibrary: {
        
        // ─────────────────────────────────────────────────────────────────────
        // FASE 1: RAISE - Aumentare temperatura corporea e frequenza cardiaca
        // ─────────────────────────────────────────────────────────────────────
        raise: {
            general: [
                {
                    id: 'light_jog',
                    name: 'Corsa Leggera',
                    duration: '2-3 min',
                    intensity: 'RPE 3-4',
                    cues: ['Respiro controllato', 'Passi brevi', 'Rilassato'],
                    hrTarget: 0.55,
                    sports: ['all']
                },
                {
                    id: 'jump_rope_light',
                    name: 'Salto Corda Leggero',
                    duration: '2-3 min',
                    intensity: 'RPE 3-4',
                    cues: ['Rimbalzi bassi', 'Polsi rilassati', 'Ritmo costante'],
                    hrTarget: 0.60,
                    sports: ['boxe', 'basket', 'calcio']
                },
                {
                    id: 'rowing_easy',
                    name: 'Vogatore Leggero',
                    duration: '3 min',
                    intensity: 'RPE 3-4',
                    cues: ['Stroke rate 18-22', 'Focus tecnica', 'Respiro'],
                    hrTarget: 0.55,
                    sports: ['palestra']
                },
                {
                    id: 'bike_easy',
                    name: 'Cyclette/Bike Leggera',
                    duration: '3-5 min',
                    intensity: 'RPE 3-4',
                    cues: ['RPM 70-80', 'Resistenza bassa', 'Sella corretta'],
                    hrTarget: 0.55,
                    sports: ['palestra', 'calcio']
                },
                {
                    id: 'shadow_boxing_light',
                    name: 'Shadow Boxing Leggero',
                    duration: '2-3 min',
                    intensity: 'RPE 3-4',
                    cues: ['Movimenti fluidi', 'Footwork base', 'No potenza'],
                    hrTarget: 0.55,
                    sports: ['boxe']
                }
            ],
            
            progressive: [
                {
                    id: 'dynamic_locomotion',
                    name: 'Locomotion Dinamica',
                    duration: '2 min',
                    intensity: 'RPE 4-5',
                    exercises: ['High Knees', 'Butt Kicks', 'Lateral Shuffle', 'Carioca'],
                    cues: ['20m per esercizio', 'Aumenta gradualmente intensità'],
                    hrTarget: 0.65,
                    sports: ['all']
                },
                {
                    id: 'jumping_jacks_variations',
                    name: 'Jumping Jack Progressivi',
                    duration: '1-2 min',
                    intensity: 'RPE 4-5',
                    exercises: ['Standard', 'Cross-Jack', 'Seal Jack'],
                    cues: ['30 sec ciascuno', 'Braccia complete', 'Core attivo'],
                    hrTarget: 0.65,
                    sports: ['all']
                }
            ]
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // FASE 2: ACTIVATE - Attivazione muscolare specifica
        // ─────────────────────────────────────────────────────────────────────
        activate: {
            
            glutes: [
                {
                    id: 'glute_bridge',
                    name: 'Glute Bridge',
                    sets: '2x10',
                    tempo: '2-1-2',
                    cues: ['Squeeze glutei in alto', 'No iperestensione lombare', 'Pausa 1s top'],
                    targetMuscles: ['glutes', 'hamstrings'],
                    priority: 'high',
                    whenNeeded: ['squat', 'deadlift', 'lunge', 'sprint', 'jump']
                },
                {
                    id: 'clamshell',
                    name: 'Clamshell',
                    sets: '2x12 per lato',
                    tempo: '2-1-2',
                    cues: ['Piedi uniti', 'Ruota solo l\'anca', 'Controllo'],
                    targetMuscles: ['glute_med', 'hip_external_rotators'],
                    priority: 'high',
                    whenNeeded: ['squat', 'lunge', 'lateral_movement', 'single_leg']
                },
                {
                    id: 'band_monster_walk',
                    name: 'Monster Walk con Banda',
                    sets: '2x10 passi per direzione',
                    tempo: 'controlled',
                    cues: ['Banda sopra ginocchia', 'Ginocchia in fuori', 'Passi piccoli'],
                    targetMuscles: ['glute_med', 'tfl'],
                    priority: 'medium',
                    whenNeeded: ['squat', 'lateral_movement']
                },
                {
                    id: 'single_leg_glute_bridge',
                    name: 'Single Leg Glute Bridge',
                    sets: '2x8 per lato',
                    tempo: '2-2-2',
                    cues: ['Una gamba estesa', 'Bacino livellato', 'Squeeze in alto'],
                    targetMuscles: ['glutes', 'hamstrings'],
                    priority: 'medium',
                    whenNeeded: ['single_leg', 'sprint', 'running']
                }
            ],
            
            core: [
                {
                    id: 'dead_bug',
                    name: 'Dead Bug',
                    sets: '2x8 per lato',
                    tempo: '3-0-3',
                    cues: ['Lombare a terra', 'Movimento opposto', 'Espira all\'estensione'],
                    targetMuscles: ['transverse', 'rectus_abdominis'],
                    priority: 'high',
                    whenNeeded: ['all']
                },
                {
                    id: 'bird_dog',
                    name: 'Bird Dog',
                    sets: '2x8 per lato',
                    tempo: '2-2-2',
                    cues: ['Schiena neutra', 'Estendi opposti', 'No rotazione'],
                    targetMuscles: ['erectors', 'glutes', 'core'],
                    priority: 'high',
                    whenNeeded: ['deadlift', 'row', 'back_exercises']
                },
                {
                    id: 'plank_hold',
                    name: 'Plank Isometrico',
                    sets: '2x20-30s',
                    tempo: 'hold',
                    cues: ['Corpo in linea', 'Glutei contratti', 'Respira'],
                    targetMuscles: ['core', 'shoulders'],
                    priority: 'medium',
                    whenNeeded: ['pressing', 'overhead']
                }
            ],
            
            shoulders: [
                {
                    id: 'band_pull_apart',
                    name: 'Band Pull Apart',
                    sets: '2x15',
                    tempo: '2-1-2',
                    cues: ['Scapole retratte', 'Braccia tese', 'Squeeze in fondo'],
                    targetMuscles: ['rear_delts', 'rhomboids', 'rotator_cuff'],
                    priority: 'high',
                    whenNeeded: ['pressing', 'pulling', 'overhead', 'boxing']
                },
                {
                    id: 'arm_circles',
                    name: 'Arm Circles Progressivi',
                    sets: '10 piccoli + 10 medi + 10 grandi per direzione',
                    tempo: 'fluid',
                    cues: ['Progressione dimensione', 'Controllo', 'Respira'],
                    targetMuscles: ['shoulders', 'rotator_cuff'],
                    priority: 'medium',
                    whenNeeded: ['overhead', 'pressing', 'boxing']
                },
                {
                    id: 'ytwl',
                    name: 'YTWL (Prone)',
                    sets: '1x8 ciascuno',
                    tempo: '2-1-2',
                    cues: ['Pancia a terra', 'Pollici in alto', 'Squeeze scapole'],
                    targetMuscles: ['lower_traps', 'rotator_cuff', 'rhomboids'],
                    priority: 'high',
                    whenNeeded: ['overhead', 'pulling']
                },
                {
                    id: 'cuban_rotation',
                    name: 'Cuban Rotation',
                    sets: '2x10',
                    tempo: '2-1-2',
                    cues: ['Gomiti a 90°', 'Extrarotazione controllata', 'Peso leggero/niente'],
                    targetMuscles: ['rotator_cuff'],
                    priority: 'high',
                    whenNeeded: ['pressing', 'overhead', 'boxing']
                }
            ],
            
            hips: [
                {
                    id: 'fire_hydrant',
                    name: 'Fire Hydrant',
                    sets: '2x10 per lato',
                    tempo: '2-1-2',
                    cues: ['Quadrupedia', 'Solleva lateralmente', 'Core stabile'],
                    targetMuscles: ['glute_med', 'hip_abductors'],
                    priority: 'medium',
                    whenNeeded: ['squat', 'lunge', 'lateral']
                },
                {
                    id: 'leg_swings_frontal',
                    name: 'Leg Swings Frontali',
                    sets: '2x10 per gamba',
                    tempo: 'dynamic',
                    cues: ['Tieni qualcosa', 'Swing controllato', 'Aumenta ROM gradualmente'],
                    targetMuscles: ['hip_flexors', 'hamstrings'],
                    priority: 'high',
                    whenNeeded: ['running', 'kicking', 'deadlift']
                },
                {
                    id: 'leg_swings_lateral',
                    name: 'Leg Swings Laterali',
                    sets: '2x10 per gamba',
                    tempo: 'dynamic',
                    cues: ['Swing lato-lato', 'Core stabile', 'Controllo'],
                    targetMuscles: ['adductors', 'abductors'],
                    priority: 'high',
                    whenNeeded: ['squat', 'lateral', 'kicking']
                }
            ],
            
            ankles: [
                {
                    id: 'ankle_circles',
                    name: 'Ankle Circles',
                    sets: '10 per direzione per caviglia',
                    tempo: 'fluid',
                    cues: ['Cerchi completi', 'Entrambe le direzioni', 'Controllo'],
                    targetMuscles: ['ankle_complex'],
                    priority: 'medium',
                    whenNeeded: ['squat', 'jump', 'running']
                },
                {
                    id: 'calf_raise_activation',
                    name: 'Calf Raise Attivazione',
                    sets: '2x15',
                    tempo: '1-1-1',
                    cues: ['Full ROM', 'Pausa in alto', 'Controllo in basso'],
                    targetMuscles: ['calves'],
                    priority: 'medium',
                    whenNeeded: ['jump', 'running', 'squat']
                }
            ]
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // FASE 3: MOBILIZE - Mobilità dinamica specifica
        // ─────────────────────────────────────────────────────────────────────
        mobilize: {
            
            hip_complex: [
                {
                    id: 'worlds_greatest_stretch',
                    name: 'World\'s Greatest Stretch',
                    sets: '3-5 per lato',
                    tempo: 'fluid',
                    cues: ['Lunge profondo', 'Gomito a terra', 'Ruota e apri', 'Raddrizza gamba'],
                    targetAreas: ['hip_flexors', 'hamstrings', 'thoracic', 'groin'],
                    priority: 'essential',
                    whenNeeded: ['all']
                },
                {
                    id: 'hip_90_90_flow',
                    name: '90/90 Hip Flow',
                    sets: '5 transizioni',
                    tempo: '3-3',
                    cues: ['Gambe a 90°', 'Transizione fluida', 'Petto alto'],
                    targetAreas: ['hip_internal_rotation', 'hip_external_rotation'],
                    priority: 'high',
                    whenNeeded: ['squat', 'deadlift', 'rotational']
                },
                {
                    id: 'deep_squat_hold',
                    name: 'Deep Squat Hold con Oscillazioni',
                    sets: '30-60s totali',
                    tempo: 'hold + shifts',
                    cues: ['Talloni a terra se possibile', 'Spingi ginocchia fuori', 'Shift lato-lato'],
                    targetAreas: ['ankles', 'hips', 'thoracic'],
                    priority: 'essential',
                    whenNeeded: ['squat', 'olympic_lifts']
                },
                {
                    id: 'spiderman_lunge',
                    name: 'Spiderman Lunge',
                    sets: '5 per lato',
                    tempo: '2-2',
                    cues: ['Lunge profondo', 'Gomito verso interno piede', 'Anca bassa'],
                    targetAreas: ['hip_flexors', 'groin', 'thoracic'],
                    priority: 'high',
                    whenNeeded: ['squat', 'lunge', 'running']
                }
            ],
            
            thoracic: [
                {
                    id: 'cat_cow',
                    name: 'Cat-Cow Flow',
                    sets: '10-15 cicli',
                    tempo: 'breath-synced',
                    cues: ['Inspira: inarca', 'Espira: arrotonda', 'Movimento fluido'],
                    targetAreas: ['thoracic_spine', 'lumbar'],
                    priority: 'high',
                    whenNeeded: ['all']
                },
                {
                    id: 'thread_the_needle',
                    name: 'Thread the Needle',
                    sets: '5 per lato',
                    tempo: '2-2-2',
                    cues: ['Quadrupedia', 'Passa braccio sotto', 'Ruota e apri'],
                    targetAreas: ['thoracic_rotation'],
                    priority: 'high',
                    whenNeeded: ['pressing', 'overhead', 'rotational', 'boxing']
                },
                {
                    id: 'open_book',
                    name: 'Open Book (Thoracic Rotation)',
                    sets: '5 per lato',
                    tempo: '3-hold-3',
                    cues: ['Ginocchia unite', 'Ruota braccio', 'Segui con sguardo'],
                    targetAreas: ['thoracic_rotation'],
                    priority: 'medium',
                    whenNeeded: ['rotational', 'boxing', 'golf']
                }
            ],
            
            shoulders: [
                {
                    id: 'wall_slides',
                    name: 'Wall Slides',
                    sets: '2x10',
                    tempo: '2-1-2',
                    cues: ['Schiena e braccia a muro', 'Scorri su-giù', 'Mantieni contatto'],
                    targetAreas: ['shoulders', 'thoracic'],
                    priority: 'high',
                    whenNeeded: ['overhead', 'pressing']
                },
                {
                    id: 'shoulder_dislocates',
                    name: 'Shoulder Dislocates (Banda/Bastone)',
                    sets: '2x10',
                    tempo: 'controlled',
                    cues: ['Presa larga', 'Arco completo', 'Controllo'],
                    targetAreas: ['shoulders', 'pecs'],
                    priority: 'medium',
                    whenNeeded: ['overhead', 'snatch', 'pressing']
                }
            ],
            
            ankles: [
                {
                    id: 'ankle_rocks',
                    name: 'Ankle Rocks (Mobilità Dorsiflessione)',
                    sets: '10-15 per caviglia',
                    tempo: 'controlled',
                    cues: ['Ginocchio avanti', 'Tallone a terra', 'Oscilla'],
                    targetAreas: ['ankle_dorsiflexion'],
                    priority: 'essential',
                    whenNeeded: ['squat', 'olympic_lifts', 'jump']
                },
                {
                    id: 'wall_ankle_mobilization',
                    name: 'Wall Ankle Mobilization',
                    sets: '2x10 per caviglia',
                    tempo: '2-2',
                    cues: ['Piede 10cm da muro', 'Ginocchio tocca muro', 'Tallone giù'],
                    targetAreas: ['ankle_dorsiflexion'],
                    priority: 'high',
                    whenNeeded: ['squat', 'olympic_lifts']
                }
            ]
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // FASE 4: POTENTIATE - Attivazione neurale pre-performance
        // ─────────────────────────────────────────────────────────────────────
        potentiate: {
            
            lower_body: [
                {
                    id: 'squat_jumps_submaximal',
                    name: 'Squat Jump Submassimali',
                    sets: '2x3-5',
                    intensity: '70-80%',
                    cues: ['Non massimale', 'Focus tecnica', 'Atterraggio morbido'],
                    purpose: 'PAP per salti/sprint',
                    whenNeeded: ['jump', 'sprint', 'power_lower']
                },
                {
                    id: 'broad_jumps',
                    name: 'Broad Jump',
                    sets: '2-3 reps',
                    intensity: '80%',
                    cues: ['Distanza moderata', 'Tecnica pulita', 'Recupero tra reps'],
                    purpose: 'PAP orizzontale',
                    whenNeeded: ['sprint', 'horizontal_power']
                },
                {
                    id: 'banded_squats',
                    name: 'Banded Squats (Reactive)',
                    sets: '2x5',
                    intensity: 'bodyweight + band',
                    cues: ['Velocità concentrica', 'Banda sopra ginocchia', 'Esplosivo'],
                    purpose: 'Attivazione rate of force development',
                    whenNeeded: ['squat', 'power_lower']
                },
                {
                    id: 'pogos',
                    name: 'Pogo Hops',
                    sets: '2x10',
                    intensity: 'reactive',
                    cues: ['Caviglie rigide', 'Rimbalzo rapido', 'Tempo a terra minimo'],
                    purpose: 'Stiffness tendinea',
                    whenNeeded: ['jump', 'running', 'sprint']
                }
            ],
            
            upper_body: [
                {
                    id: 'explosive_pushups',
                    name: 'Push-Up Esplosivi/Clap',
                    sets: '2x3-5',
                    intensity: '80%',
                    cues: ['Esplosione massima', 'Atterraggio controllato', 'Quality over quantity'],
                    purpose: 'PAP push',
                    whenNeeded: ['bench', 'pressing', 'boxing']
                },
                {
                    id: 'med_ball_chest_pass',
                    name: 'Med Ball Chest Pass',
                    sets: '2x5',
                    intensity: 'explosive',
                    cues: ['Palla 3-5kg', 'Spinta esplosiva', 'Full extension'],
                    purpose: 'PAP push + rate of force',
                    whenNeeded: ['bench', 'pressing', 'boxing']
                },
                {
                    id: 'band_facepull_explosive',
                    name: 'Band Face Pull Veloce',
                    sets: '2x10',
                    intensity: 'fast',
                    cues: ['Movimento rapido', 'Controllo ritorno', 'Scapole attive'],
                    purpose: 'Attivazione posteriore',
                    whenNeeded: ['pulling', 'rowing', 'boxing']
                }
            ],
            
            rotational: [
                {
                    id: 'med_ball_rotational_throw',
                    name: 'Med Ball Rotational Throw',
                    sets: '3 per lato',
                    intensity: 'explosive',
                    cues: ['Rotazione dai fianchi', 'Rilascio esplosivo', 'Segui il movimento'],
                    purpose: 'PAP rotazionale',
                    whenNeeded: ['boxing', 'golf', 'throwing', 'rotational']
                },
                {
                    id: 'shadow_boxing_explosive',
                    name: 'Shadow Boxing Esplosivo',
                    sets: '30-60s',
                    intensity: '90%',
                    cues: ['Combinazioni esplosive', 'Footwork attivo', 'Recupera tra burst'],
                    purpose: 'Attivazione sport-specifica boxe',
                    whenNeeded: ['boxing']
                }
            ],
            
            neural: [
                {
                    id: 'fast_feet_drill',
                    name: 'Fast Feet (10s burst)',
                    sets: '2-3x10s',
                    intensity: 'maximal',
                    cues: ['Più veloce possibile', 'Piedi bassi', 'Braccia coordinate'],
                    purpose: 'Attivazione neurale velocità',
                    whenNeeded: ['sprint', 'agility', 'boxing']
                },
                {
                    id: 'a_skip',
                    name: 'A-Skip Progressivo',
                    sets: '2x20m',
                    intensity: 'increasing',
                    cues: ['Ginocchio alto', 'Braccio opposto', 'Aumenta velocità'],
                    purpose: 'Coordinazione sprint',
                    whenNeeded: ['sprint', 'running']
                }
            ]
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧠 ANALISI INTELLIGENTE - Analizza workout per determinare necessità
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Analizza il workout per determinare i pattern di movimento coinvolti
     */
    analyzeWorkout(exercises) {
        const analysis = {
            patterns: new Set(),
            muscles: {
                primary: new Set(),
                secondary: new Set()
            },
            movements: {
                hasSquat: false,
                hasHinge: false,
                hasPush: false,
                hasPull: false,
                hasRotation: false,
                hasJump: false,
                hasSprint: false,
                hasOverhead: false,
                hasSingleLeg: false,
                hasLateral: false
            },
            intensity: 'moderate',
            powerDemand: 'low'
        };
        
        const patternKeywords = {
            squat: ['squat', 'goblet', 'leg press', 'pistol', 'lunge', 'split'],
            hinge: ['deadlift', 'rdl', 'hip thrust', 'swing', 'good morning', 'pull through'],
            push: ['press', 'push', 'bench', 'dip', 'floor press'],
            pull: ['row', 'pull', 'chin', 'pulldown', 'lat', 'face pull'],
            rotation: ['twist', 'rotation', 'woodchop', 'cable chop', 'med ball'],
            jump: ['jump', 'box', 'bound', 'hop', 'depth', 'broad'],
            sprint: ['sprint', 'run', 'dash'],
            overhead: ['overhead', 'ohp', 'military', 'snatch', 'jerk'],
            singleLeg: ['single leg', 'unilateral', 'split squat', 'step up', 'bulgarian'],
            lateral: ['lateral', 'side', 'cossack', 'skater']
        };
        
        const muscleMap = {
            squat: ['quadriceps', 'glutes', 'core'],
            hinge: ['hamstrings', 'glutes', 'erectors'],
            push: ['chest', 'shoulders', 'triceps'],
            pull: ['lats', 'rhomboids', 'biceps'],
            rotation: ['obliques', 'core'],
            jump: ['quadriceps', 'glutes', 'calves'],
            overhead: ['shoulders', 'triceps', 'core']
        };
        
        exercises.forEach(ex => {
            const name = (ex.name || '').toLowerCase();
            
            Object.entries(patternKeywords).forEach(([pattern, keywords]) => {
                if (keywords.some(kw => name.includes(kw))) {
                    analysis.patterns.add(pattern);
                    analysis.movements[`has${pattern.charAt(0).toUpperCase() + pattern.slice(1)}`] = true;
                    
                    if (muscleMap[pattern]) {
                        muscleMap[pattern].forEach(m => analysis.muscles.primary.add(m));
                    }
                }
            });
            
            // Detect power demand
            if (name.includes('power') || name.includes('explosive') || 
                name.includes('jump') || name.includes('clean') || name.includes('snatch')) {
                analysis.powerDemand = 'high';
            }
            
            // Detect intensity from type
            if (ex.type === 'strength' && (ex.reps && parseInt(ex.reps) <= 5)) {
                analysis.intensity = 'high';
            }
        });
        
        return analysis;
    },
    
    /**
     * Determina le aree critiche basate sulla fase del percorso
     */
    getPhaseConsiderations(weekNumber, totalWeeks) {
        const phase = weekNumber / totalWeeks;
        
        if (phase <= 0.25) {
            // Fase 1: Foundation (settimane 1-25%)
            return {
                name: 'foundation',
                focus: 'injury_prevention',
                priorities: ['mobility', 'stability', 'movement_quality'],
                warmupMultiplier: 1.3,
                extraEmphasis: ['core_activation', 'glute_activation', 'ankle_mobility'],
                notes: 'Riscaldamento più lungo con focus su movimento corretto e prevenzione'
            };
        } else if (phase <= 0.5) {
            // Fase 2: Build (settimane 25-50%)
            return {
                name: 'build',
                focus: 'progressive_loading',
                priorities: ['activation', 'mobility_maintenance', 'preparation'],
                warmupMultiplier: 1.1,
                extraEmphasis: ['muscle_activation', 'joint_prep'],
                notes: 'Riscaldamento bilanciato tra mobilità e attivazione'
            };
        } else if (phase <= 0.75) {
            // Fase 3: Peak (settimane 50-75%)
            return {
                name: 'peak',
                focus: 'performance',
                priorities: ['potentiation', 'neural_activation', 'efficiency'],
                warmupMultiplier: 1.0,
                extraEmphasis: ['pap', 'speed_activation'],
                notes: 'Riscaldamento efficiente con focus su potentiamento'
            };
        } else {
            // Fase 4: Taper/Maintain (settimane 75-100%)
            return {
                name: 'maintain',
                focus: 'quality_maintenance',
                priorities: ['mobility', 'recovery', 'preparation'],
                warmupMultiplier: 0.9,
                extraEmphasis: ['flexibility', 'blood_flow'],
                notes: 'Riscaldamento moderato per mantenimento'
            };
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏗️ GENERATORE RISCALDAMENTO INTELLIGENTE
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Genera riscaldamento ottimale basato su tutti i fattori
     */
    generateWarmup(options = {}) {
        const {
            exercises = [],           // Esercizi del workout
            sport = 'palestra',       // Sport principale
            weekNumber = 1,           // Settimana corrente
            totalWeeks = 12,          // Durata totale percorso
            timeOfDay = 'afternoon',  // morning, afternoon, evening
            temperature = 20,         // Temperatura ambiente °C
            injuryHistory = [],       // Aree precedentemente infortunate
            mobilityIssues = [],      // Aree con limitata mobilità
            availableEquipment = ['band', 'foam_roller'], // Attrezzatura disponibile
            maxDuration = 12          // Durata massima in minuti
        } = options;
        
        // Analisi workout
        const workoutAnalysis = this.analyzeWorkout(exercises);
        
        // Considerazioni fase
        const phaseConsiderations = this.getPhaseConsiderations(weekNumber, totalWeeks);
        
        // Calcola moltiplicatori contesto
        let durationMultiplier = phaseConsiderations.warmupMultiplier;
        
        if (timeOfDay === 'morning') durationMultiplier *= this.config.contextMultipliers.morningSession;
        if (timeOfDay === 'evening') durationMultiplier *= this.config.contextMultipliers.eveningSession;
        if (temperature < 15) durationMultiplier *= this.config.contextMultipliers.coldEnvironment;
        if (temperature > 28) durationMultiplier *= this.config.contextMultipliers.hotEnvironment;
        
        // Costruisci warmup RAMP
        let warmup = {
            protocol: 'RAMP',
            phases: [],
            totalDuration: 0,
            context: {
                sport,
                phase: phaseConsiderations.name,
                focus: phaseConsiderations.focus,
                workoutPatterns: Array.from(workoutAnalysis.patterns)
            }
        };
        
        // ═══ FASE 1: RAISE ═══
        const raisePhase = this.buildRaisePhase(sport, durationMultiplier);
        warmup.phases.push(raisePhase);
        warmup.totalDuration += raisePhase.duration;
        
        // ═══ FASE 2: ACTIVATE ═══
        const activatePhase = this.buildActivatePhase(
            workoutAnalysis, 
            phaseConsiderations,
            injuryHistory,
            durationMultiplier
        );
        warmup.phases.push(activatePhase);
        warmup.totalDuration += activatePhase.duration;
        
        // ═══ FASE 3: MOBILIZE ═══
        const mobilizePhase = this.buildMobilizePhase(
            workoutAnalysis,
            mobilityIssues,
            phaseConsiderations,
            durationMultiplier
        );
        warmup.phases.push(mobilizePhase);
        warmup.totalDuration += mobilizePhase.duration;
        
        // ═══ FASE 4: POTENTIATE ═══
        // Solo se workout richiede potenza o siamo in fase peak
        if (workoutAnalysis.powerDemand === 'high' || phaseConsiderations.name === 'peak') {
            const potentiatePhase = this.buildPotentiatePhase(
                workoutAnalysis,
                sport,
                durationMultiplier
            );
            warmup.phases.push(potentiatePhase);
            warmup.totalDuration += potentiatePhase.duration;
        }
        
        // Trim se supera durata massima
        if (warmup.totalDuration > maxDuration * 60) {
            warmup = this.trimWarmup(warmup, maxDuration * 60);
        }
        
        // Aggiungi note scientifiche
        warmup.scientificNotes = this.generateScientificNotes(warmup, phaseConsiderations);
        
        return warmup;
    },
    
    /**
     * Costruisce fase RAISE - 1 solo esercizio
     */
    buildRaisePhase(sport, multiplier) {
        const phase = {
            name: 'RAISE',
            purpose: 'Aumentare temperatura corporea e frequenza cardiaca',
            targetHR: '50-65% HRmax',
            duration: 0,
            exercises: []
        };
        
        // 1 SOLO esercizio basato su sport
        const raiseOptions = this.movementLibrary.raise.general;
        let selectedRaise;
        
        switch(sport) {
            case 'boxe':
                selectedRaise = raiseOptions.find(e => e.id === 'jump_rope_light') || 
                               raiseOptions.find(e => e.id === 'shadow_boxing_light');
                break;
            case 'calcio':
            case 'basket':
                selectedRaise = raiseOptions.find(e => e.id === 'light_jog');
                break;
            default:
                // Usa locomotion dinamica per tutti
                selectedRaise = this.movementLibrary.raise.progressive[0];
        }
        
        if (selectedRaise) {
            phase.exercises.push({
                ...selectedRaise,
                notes: '3-4 minuti, aumenta gradualmente intensità'
            });
            phase.duration += 180; // 3 min
        }
        
        // Applica moltiplicatore
        phase.duration = Math.round(phase.duration * multiplier);
        phase.durationFormatted = this.formatDuration(phase.duration);
        
        return phase;
    },
    
    /**
     * Costruisce fase ACTIVATE - MAX 2 esercizi
     */
    buildActivatePhase(workoutAnalysis, phaseConsiderations, injuryHistory, multiplier) {
        const phase = {
            name: 'ACTIVATE',
            purpose: 'Attivazione muscolare specifica per il workout',
            duration: 0,
            exercises: []
        };
        
        // MAX 2 esercizi per questa fase
        const maxExercises = 2;
        
        // Priorità 1: Core O Glutei (basato su workout)
        const hasLowerBody = workoutAnalysis.movements.hasSquat || 
                            workoutAnalysis.movements.hasHinge ||
                            workoutAnalysis.movements.hasSingleLeg;
        
        if (hasLowerBody && phase.exercises.length < maxExercises) {
            const gluteBridge = this.movementLibrary.activate.glutes.find(e => e.id === 'glute_bridge');
            if (gluteBridge) {
                phase.exercises.push(gluteBridge);
                phase.duration += 60;
            }
        } else if (phase.exercises.length < maxExercises) {
            // Se no lower body, usa dead bug per core
            const deadBug = this.movementLibrary.activate.core.find(e => e.id === 'dead_bug');
            if (deadBug) {
                phase.exercises.push(deadBug);
                phase.duration += 60;
            }
        }
        
        // Priorità 2: Spalle se upper body
        const hasUpperBody = workoutAnalysis.movements.hasPush || 
                            workoutAnalysis.movements.hasPull ||
                            workoutAnalysis.movements.hasOverhead;
        
        if (hasUpperBody && phase.exercises.length < maxExercises) {
            const bandPullApart = this.movementLibrary.activate.shoulders.find(e => e.id === 'band_pull_apart');
            if (bandPullApart) {
                phase.exercises.push(bandPullApart);
                phase.duration += 45;
            }
        }
        
        // Applica moltiplicatore
        phase.duration = Math.round(phase.duration * multiplier);
        phase.durationFormatted = this.formatDuration(phase.duration);
        
        return phase;
    },
    
    /**
     * Costruisce fase MOBILIZE - MAX 2 esercizi
     */
    buildMobilizePhase(workoutAnalysis, mobilityIssues, phaseConsiderations, multiplier) {
        const phase = {
            name: 'MOBILIZE',
            purpose: 'Mobilità dinamica per i movimenti del workout',
            duration: 0,
            exercises: []
        };
        
        // MAX 2 esercizi per questa fase
        const maxExercises = 2;
        
        // Priorità 1: World's Greatest Stretch - SEMPRE incluso (mobilità completa)
        const wgs = this.movementLibrary.mobilize.hip_complex.find(e => e.id === 'worlds_greatest_stretch');
        if (wgs && phase.exercises.length < maxExercises) {
            phase.exercises.push({
                ...wgs,
                notes: 'Mobilità totale corpo'
            });
            phase.duration += 90;
        }
        
        // Priorità 2: Cat-Cow O Leg Swings basato su workout
        const hasUpperBody = workoutAnalysis.movements.hasPush || 
                            workoutAnalysis.movements.hasPull ||
                            workoutAnalysis.movements.hasOverhead;
        
        if (hasUpperBody && phase.exercises.length < maxExercises) {
            const catCow = this.movementLibrary.mobilize.thoracic.find(e => e.id === 'cat_cow');
            if (catCow) {
                phase.exercises.push(catCow);
                phase.duration += 60;
            }
        } else if (phase.exercises.length < maxExercises) {
            const legSwings = this.movementLibrary.activate.hips?.find(e => e.id === 'leg_swings_frontal');
            if (legSwings) {
                phase.exercises.push(legSwings);
                phase.duration += 45;
            }
        }
        
        // Applica moltiplicatore
        phase.duration = Math.round(phase.duration * multiplier);
        phase.durationFormatted = this.formatDuration(phase.duration);
        
        return phase;
    },
    
    /**
     * Costruisce fase POTENTIATE - MAX 1 esercizio (opzionale)
     * Solo se workout è esplosivo/potenza
     */
    buildPotentiatePhase(workoutAnalysis, sport, multiplier) {
        const phase = {
            name: 'POTENTIATE',
            purpose: 'Attivazione neurale e Post-Activation Potentiation',
            targetHR: '70-85% HRmax (brevi picchi)',
            duration: 0,
            exercises: []
        };
        
        // MAX 1 esercizio - solo se workout include esplosività
        const isExplosiveWorkout = workoutAnalysis.movements.hasJump || 
                                   workoutAnalysis.movements.hasSprint ||
                                   workoutAnalysis.intensity === 'high';
        
        if (!isExplosiveWorkout) {
            // Skip POTENTIATE per workout non esplosivi
            phase.durationFormatted = '0 sec';
            return phase;
        }
        
        // UN solo esercizio basato sul workout
        if (workoutAnalysis.movements.hasSquat || 
            workoutAnalysis.movements.hasJump ||
            workoutAnalysis.movements.hasSprint) {
            
            const pogos = this.movementLibrary.potentiate.lower_body.find(e => e.id === 'pogos');
            if (pogos) {
                phase.exercises.push(pogos);
                phase.duration += 30;
            }
        } else if (workoutAnalysis.movements.hasPush) {
            const explPushup = this.movementLibrary.potentiate.upper_body.find(e => e.id === 'explosive_pushups');
            if (explPushup) {
                phase.exercises.push(explPushup);
                phase.duration += 30;
            }
        }
        
        // Applica moltiplicatore
        phase.duration = Math.round(phase.duration * Math.min(multiplier, 1.1));
        phase.durationFormatted = this.formatDuration(phase.duration);
        
        return phase;
    },
    
    /**
     * Genera note scientifiche per il riscaldamento
     */
    generateScientificNotes(warmup, phaseConsiderations) {
        const notes = [];
        
        notes.push(`📊 Protocollo: RAMP (Raise-Activate-Mobilize-Potentiate) - Dr. Ian Jeffreys`);
        notes.push(`🎯 Fase percorso: ${phaseConsiderations.name.toUpperCase()} - Focus: ${phaseConsiderations.focus.replace('_', ' ')}`);
        
        if (phaseConsiderations.name === 'foundation') {
            notes.push(`⚠️ Fase iniziale: riscaldamento più lungo per costruire basi di movimento e prevenire infortuni`);
        }
        
        notes.push(`🌡️ Target: aumentare temperatura muscolare di 1-2°C per ottimizzare viscosità e velocità enzimatica`);
        notes.push(`⚡ La fase RAISE aumenta gradualmente la frequenza cardiaca e prepara il sistema cardiovascolare`);
        notes.push(`💪 ACTIVATE pre-attiva i muscoli stabilizzatori critici per il workout`);
        notes.push(`🧘 MOBILIZE usa stretching DINAMICO (non statico) - preserva forza e potenza`);
        
        if (warmup.phases.some(p => p.name === 'POTENTIATE')) {
            notes.push(`⚡ POTENTIATE sfrutta il PAP (Post-Activation Potentiation) per migliorare performance esplosiva`);
        }
        
        return notes;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🛠️ UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return secs > 0 ? `${mins}min ${secs}s` : `${mins}min`;
    },
    
    trimWarmup(warmup, maxSeconds) {
        // Riduci proporcionalmente ogni fase
        const ratio = maxSeconds / warmup.totalDuration;
        
        warmup.phases.forEach(phase => {
            phase.duration = Math.round(phase.duration * ratio);
            phase.durationFormatted = this.formatDuration(phase.duration);
        });
        
        warmup.totalDuration = maxSeconds;
        warmup.trimmed = true;
        
        return warmup;
    },
    
    /**
     * Converte warmup in formato esercizi per workout
     */
    toWorkoutExercises(warmup) {
        const exercises = [];
        
        warmup.phases.forEach(phase => {
            phase.exercises.forEach(ex => {
                // Parse sets e reps correttamente
                let sets = 1;
                let reps = ex.duration || '30s';
                
                // Se ex.sets contiene formato "2x10", separalo
                if (typeof ex.sets === 'string' && ex.sets.includes('x')) {
                    const parts = ex.sets.split('x');
                    sets = parseInt(parts[0]) || 1;
                    reps = parts[1] || reps;
                } else if (typeof ex.sets === 'number') {
                    sets = ex.sets;
                } else if (ex.sets) {
                    // Es: "3-5 per lato" -> usa come reps
                    reps = ex.sets;
                    sets = 1;
                }
                
                exercises.push({
                    name: ex.name,
                    sets: sets,
                    reps: reps,
                    rest: '0s',
                    type: 'warmup',
                    phase: 'warmup',
                    rampPhase: phase.name,
                    cues: ex.cues,
                    notes: ex.notes
                });
            });
        });
        
        return exercises;
    },
    
    /**
     * Genera HTML per visualizzazione warmup
     */
    toHTML(warmup) {
        let html = `
        <div class="warmup-protocol ramp-protocol">
            <div class="warmup-header">
                <h3>🔥 Riscaldamento RAMP</h3>
                <span class="duration-badge">${this.formatDuration(warmup.totalDuration)}</span>
            </div>
            <div class="warmup-context">
                <span class="phase-badge">${warmup.context.phase}</span>
                <span class="focus-badge">${warmup.context.focus}</span>
            </div>
        `;
        
        warmup.phases.forEach(phase => {
            html += `
            <div class="ramp-phase ${phase.name.toLowerCase()}">
                <div class="phase-header">
                    <h4>${this.getPhaseEmoji(phase.name)} ${phase.name}</h4>
                    <span class="phase-duration">${phase.durationFormatted}</span>
                </div>
                <p class="phase-purpose">${phase.purpose}</p>
                <ul class="phase-exercises">
            `;
            
            phase.exercises.forEach(ex => {
                html += `
                    <li>
                        <strong>${ex.name}</strong>
                        ${ex.sets ? `<span class="sets">${ex.sets}</span>` : ''}
                        ${ex.duration ? `<span class="duration">${ex.duration}</span>` : ''}
                        ${ex.cues ? `<div class="cues">${ex.cues.join(' • ')}</div>` : ''}
                        ${ex.notes ? `<div class="notes">${ex.notes}</div>` : ''}
                    </li>
                `;
            });
            
            html += `</ul></div>`;
        });
        
        // Note scientifiche
        if (warmup.scientificNotes && warmup.scientificNotes.length) {
            html += `
            <div class="scientific-notes">
                <h5>📚 Perché questo protocollo?</h5>
                <ul>
                    ${warmup.scientificNotes.map(n => `<li>${n}</li>`).join('')}
                </ul>
            </div>
            `;
        }
        
        html += `</div>`;
        return html;
    },
    
    getPhaseEmoji(phaseName) {
        const emojis = {
            'RAISE': '🔥',
            'ACTIVATE': '💪',
            'MOBILIZE': '🧘',
            'POTENTIATE': '⚡'
        };
        return emojis[phaseName] || '▶️';
    }
};

// Export per uso globale
if (typeof window !== 'undefined') {
    window.WarmupIntelligence = WarmupIntelligence;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = WarmupIntelligence;
}
