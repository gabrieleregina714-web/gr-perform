// GR Perform - Training Methods Advanced Rules
// Progressioni, incompatibilità, sequenze e adattamenti per ruolo

// ═══════════════════════════════════════════════════════════════════════════
// 1. PROGRESSIONI SETTIMANALI PER METODOLOGIA
// ═══════════════════════════════════════════════════════════════════════════

const METHOD_PROGRESSIONS = {

    // ─────────────────────────────────────────────────────────────────────
    // METODI DI INTENSITÀ
    // ─────────────────────────────────────────────────────────────────────

    drop_set: {
        week_1: { 
            frequency: 1, 
            exercises: 1, 
            drops: 2,
            notes: "Introduzione: 1 esercizio con 2 drop, solo isolamento"
        },
        week_2: { 
            frequency: 2, 
            exercises: 1, 
            drops: 2,
            notes: "Consolida: 2 sessioni, ancora 2 drop"
        },
        week_3: { 
            frequency: 2, 
            exercises: 2, 
            drops: 3,
            notes: "Progressione: 2 esercizi, 3 drop"
        },
        week_4: { 
            frequency: 1, 
            exercises: 1, 
            drops: 2,
            notes: "Deload: torna a parametri settimana 1"
        }
    },

    superset: {
        week_1: { 
            pairs: 2, 
            type: "antagonist",
            notes: "Inizia con superset antagonisti (più facili)"
        },
        week_2: { 
            pairs: 3, 
            type: "antagonist",
            notes: "Aumenta a 3 coppie antagoniste"
        },
        week_3: { 
            pairs: 3, 
            type: "mixed",
            notes: "Introduci 1 superset agonista"
        },
        week_4: { 
            pairs: 2, 
            type: "antagonist",
            notes: "Deload: torna a 2 coppie semplici"
        }
    },

    rest_pause: {
        week_1: { 
            exercises: 1, 
            clusters: 2,
            pause_seconds: 15,
            notes: "1 esercizio compound, 2 mini-cluster"
        },
        week_2: { 
            exercises: 1, 
            clusters: 3,
            pause_seconds: 12,
            notes: "Aumenta a 3 cluster, riduci pausa"
        },
        week_3: { 
            exercises: 2, 
            clusters: 3,
            pause_seconds: 10,
            notes: "2 esercizi, 3 cluster, pausa breve"
        },
        week_4: { 
            exercises: 1, 
            clusters: 2,
            pause_seconds: 15,
            notes: "Deload"
        }
    },

    myo_reps: {
        week_1: { 
            exercises: 2, 
            activation_reps: 15,
            mini_sets: 3,
            notes: "2 esercizi isolamento, 15 attivazione + 3 mini-set"
        },
        week_2: { 
            exercises: 3, 
            activation_reps: 15,
            mini_sets: 4,
            notes: "3 esercizi, aggiungi 1 mini-set"
        },
        week_3: { 
            exercises: 3, 
            activation_reps: 12,
            mini_sets: 5,
            notes: "Attivazione più pesante (12 reps), 5 mini-set"
        },
        week_4: { 
            exercises: 2, 
            activation_reps: 15,
            mini_sets: 3,
            notes: "Deload"
        }
    },

    cluster_set: {
        week_1: { 
            exercises: 1, 
            reps_per_cluster: 2,
            clusters: 3,
            load_percent: 85,
            notes: "1 esercizio, 3x2 @ 85%"
        },
        week_2: { 
            exercises: 1, 
            reps_per_cluster: 2,
            clusters: 4,
            load_percent: 87,
            notes: "4 cluster @ 87%"
        },
        week_3: { 
            exercises: 2, 
            reps_per_cluster: 2,
            clusters: 4,
            load_percent: 88,
            notes: "2 esercizi @ 88%"
        },
        week_4: { 
            exercises: 1, 
            reps_per_cluster: 2,
            clusters: 3,
            load_percent: 80,
            notes: "Deload @ 80%"
        }
    },

    // ─────────────────────────────────────────────────────────────────────
    // METODI TEMPO/CARDIO
    // ─────────────────────────────────────────────────────────────────────

    circuit: {
        week_1: { 
            stations: 5, 
            rounds: 3,
            work_seconds: 40,
            rest_seconds: 20,
            notes: "5 stazioni, 40/20, 3 giri"
        },
        week_2: { 
            stations: 6, 
            rounds: 3,
            work_seconds: 40,
            rest_seconds: 15,
            notes: "6 stazioni, riduci riposo"
        },
        week_3: { 
            stations: 6, 
            rounds: 4,
            work_seconds: 45,
            rest_seconds: 15,
            notes: "Aggiungi 1 giro, aumenta lavoro"
        },
        week_4: { 
            stations: 5, 
            rounds: 3,
            work_seconds: 40,
            rest_seconds: 20,
            notes: "Deload"
        }
    },

    emom: {
        week_1: { 
            duration_minutes: 8,
            exercises: 2,
            reps_per_exercise: 5,
            notes: "EMOM 8min: 2 esercizi x 5 reps"
        },
        week_2: { 
            duration_minutes: 10,
            exercises: 2,
            reps_per_exercise: 6,
            notes: "EMOM 10min: aumenta volume"
        },
        week_3: { 
            duration_minutes: 12,
            exercises: 3,
            reps_per_exercise: 5,
            notes: "EMOM 12min: 3 esercizi"
        },
        week_4: { 
            duration_minutes: 8,
            exercises: 2,
            reps_per_exercise: 5,
            notes: "Deload"
        }
    },

    tabata: {
        week_1: { 
            blocks: 1,
            exercises: 1,
            notes: "1 Tabata (4min), 1 esercizio"
        },
        week_2: { 
            blocks: 2,
            exercises: 2,
            rest_between_blocks: 120,
            notes: "2 Tabata, 2min riposo tra blocchi"
        },
        week_3: { 
            blocks: 2,
            exercises: 2,
            rest_between_blocks: 90,
            notes: "Riduci riposo tra blocchi"
        },
        week_4: { 
            blocks: 1,
            exercises: 1,
            notes: "Deload"
        }
    },

    // ─────────────────────────────────────────────────────────────────────
    // METODI SPORT-SPECIFICI: CALCIO
    // ─────────────────────────────────────────────────────────────────────

    rsa_repeated_sprint: {
        week_1: { 
            sprints: 6, 
            distance_m: 20,
            rest_seconds: 30,
            sets: 2,
            notes: "6x20m, rec 30s, 2 serie"
        },
        week_2: { 
            sprints: 8, 
            distance_m: 25,
            rest_seconds: 25,
            sets: 2,
            notes: "8x25m, rec 25s"
        },
        week_3: { 
            sprints: 8, 
            distance_m: 30,
            rest_seconds: 20,
            sets: 3,
            notes: "8x30m, rec 20s, 3 serie"
        },
        week_4: { 
            sprints: 6, 
            distance_m: 20,
            rest_seconds: 30,
            sets: 2,
            notes: "Deload"
        }
    },

    nordic_hamstring: {
        week_1: { 
            sets: 2, 
            reps: 5,
            assisted: true,
            notes: "2x5 con assistenza (partner o elastico)"
        },
        week_2: { 
            sets: 3, 
            reps: 5,
            assisted: true,
            notes: "3x5, ancora assistiti"
        },
        week_3: { 
            sets: 3, 
            reps: 6,
            assisted: false,
            notes: "3x6, prova senza assistenza"
        },
        week_4: { 
            sets: 2, 
            reps: 5,
            assisted: true,
            notes: "Deload"
        }
    },

    copenhagen_adductor: {
        week_1: { 
            sets: 2, 
            hold_seconds: 10,
            knee_bent: true,
            notes: "2x10s/lato, ginocchio piegato"
        },
        week_2: { 
            sets: 3, 
            hold_seconds: 12,
            knee_bent: true,
            notes: "3x12s/lato"
        },
        week_3: { 
            sets: 3, 
            hold_seconds: 10,
            knee_bent: false,
            notes: "3x10s/lato, gamba TESA"
        },
        week_4: { 
            sets: 2, 
            hold_seconds: 10,
            knee_bent: true,
            notes: "Deload"
        }
    },

    // ─────────────────────────────────────────────────────────────────────
    // METODI SPORT-SPECIFICI: BOXE
    // ─────────────────────────────────────────────────────────────────────

    boxing_circuit: {
        week_1: { 
            rounds: 6, 
            work_minutes: 2,
            rest_minutes: 1,
            notes: "6 round x 2min, rec 1min (focus tecnica)"
        },
        week_2: { 
            rounds: 8, 
            work_minutes: 2,
            rest_minutes: 1,
            notes: "8 round"
        },
        week_3: { 
            rounds: 8, 
            work_minutes: 3,
            rest_minutes: 1,
            notes: "8 round x 3min (match simulation)"
        },
        week_4: { 
            rounds: 6, 
            work_minutes: 2,
            rest_minutes: 1,
            notes: "Deload"
        }
    },

    heavy_bag_intervals: {
        week_1: { 
            rounds: 6, 
            burst_seconds: 20,
            cruise_seconds: 40,
            notes: "6 round: 20s burst / 40s cruise"
        },
        week_2: { 
            rounds: 8, 
            burst_seconds: 25,
            cruise_seconds: 35,
            notes: "8 round: 25s/35s"
        },
        week_3: { 
            rounds: 10, 
            burst_seconds: 30,
            cruise_seconds: 30,
            notes: "10 round: 30s/30s"
        },
        week_4: { 
            rounds: 6, 
            burst_seconds: 20,
            cruise_seconds: 40,
            notes: "Deload"
        }
    },

    // ─────────────────────────────────────────────────────────────────────
    // METODI SPORT-SPECIFICI: PALESTRA
    // ─────────────────────────────────────────────────────────────────────

    german_volume_training: {
        week_1: { 
            sets: 10, 
            reps: 10,
            load_percent: 55,
            rest_seconds: 90,
            notes: "10x10 @ 55%, rec 90s (adattamento)"
        },
        week_2: { 
            sets: 10, 
            reps: 10,
            load_percent: 58,
            rest_seconds: 75,
            notes: "10x10 @ 58%, rec 75s"
        },
        week_3: { 
            sets: 10, 
            reps: 10,
            load_percent: 60,
            rest_seconds: 60,
            notes: "10x10 @ 60%, rec 60s"
        },
        week_4: { 
            sets: 6, 
            reps: 8,
            load_percent: 50,
            rest_seconds: 90,
            notes: "Deload: 6x8 @ 50%"
        }
    },

    // ─────────────────────────────────────────────────────────────────────
    // METODI AGGIUNTIVI
    // ─────────────────────────────────────────────────────────────────────

    contrast_training: {
        week_1: { 
            pairs: 2,
            heavy_percent: 80,
            plyometric_intensity: "low",
            notes: "2 coppie, 80% + plyo basso (jump controllato)"
        },
        week_2: { 
            pairs: 2,
            heavy_percent: 85,
            plyometric_intensity: "medium",
            notes: "2 coppie, 85% + plyo medio (CMJ)"
        },
        week_3: { 
            pairs: 3,
            heavy_percent: 87,
            plyometric_intensity: "high",
            notes: "3 coppie, 87% + plyo alto (drop jump)"
        },
        week_4: { 
            pairs: 2,
            heavy_percent: 75,
            plyometric_intensity: "low",
            notes: "Deload"
        }
    },

    vertical_jump_training: {
        week_1: { 
            contacts: 40,
            intensity: "low",
            box_height_cm: 30,
            notes: "40 contatti, box basso, focus tecnica"
        },
        week_2: { 
            contacts: 60,
            intensity: "medium",
            box_height_cm: 40,
            notes: "60 contatti, box medio"
        },
        week_3: { 
            contacts: 80,
            intensity: "high",
            box_height_cm: 50,
            notes: "80 contatti, box alto"
        },
        week_4: { 
            contacts: 40,
            intensity: "low",
            box_height_cm: 30,
            notes: "Deload"
        }
    },

    change_of_direction: {
        week_1: { 
            drills: 4,
            total_distance_m: 200,
            cuts_per_drill: 4,
            notes: "4 drill, 200m totali, tagli controllati"
        },
        week_2: { 
            drills: 5,
            total_distance_m: 300,
            cuts_per_drill: 5,
            notes: "5 drill, più volume"
        },
        week_3: { 
            drills: 6,
            total_distance_m: 400,
            cuts_per_drill: 6,
            notes: "6 drill, intensità massima"
        },
        week_4: { 
            drills: 4,
            total_distance_m: 200,
            cuts_per_drill: 4,
            notes: "Deload"
        }
    },

    defensive_slides_drill: {
        week_1: { 
            sets: 4,
            duration_seconds: 20,
            rest_seconds: 40,
            notes: "4x20s, focus postura bassa"
        },
        week_2: { 
            sets: 5,
            duration_seconds: 25,
            rest_seconds: 35,
            notes: "5x25s, aumenta durata"
        },
        week_3: { 
            sets: 6,
            duration_seconds: 30,
            rest_seconds: 30,
            notes: "6x30s, intensità match"
        },
        week_4: { 
            sets: 4,
            duration_seconds: 20,
            rest_seconds: 40,
            notes: "Deload"
        }
    },

    shadow_boxing_drills: {
        week_1: { 
            rounds: 6,
            duration_minutes: 2,
            focus: "basic_combinations",
            notes: "6x2min, combo 1-2, 1-2-3"
        },
        week_2: { 
            rounds: 8,
            duration_minutes: 2,
            focus: "footwork_combos",
            notes: "8x2min, aggiungi footwork"
        },
        week_3: { 
            rounds: 8,
            duration_minutes: 3,
            focus: "advanced_defense",
            notes: "8x3min, schivate + contrattacco"
        },
        week_4: { 
            rounds: 6,
            duration_minutes: 2,
            focus: "basic_combinations",
            notes: "Deload"
        }
    },

    neck_strengthening: {
        week_1: { 
            exercises: 2,
            sets: 2,
            reps: 10,
            notes: "2 esercizi x 2x10, isometrica + neck curl"
        },
        week_2: { 
            exercises: 3,
            sets: 2,
            reps: 12,
            notes: "3 esercizi x 2x12"
        },
        week_3: { 
            exercises: 3,
            sets: 3,
            reps: 12,
            notes: "3 esercizi x 3x12, aggiungi resistenza"
        },
        week_4: { 
            exercises: 2,
            sets: 2,
            reps: 10,
            notes: "Deload"
        }
    },

    punch_resistance_training: {
        week_1: { 
            exercises: 3,
            sets: 3,
            rep_range: "8-10",
            notes: "3 esercizi rotazionali x 3x8-10"
        },
        week_2: { 
            exercises: 4,
            sets: 3,
            rep_range: "8-10",
            notes: "4 esercizi x 3x8-10"
        },
        week_3: { 
            exercises: 4,
            sets: 4,
            rep_range: "6-8",
            notes: "4 esercizi x 4x6-8, più pesante"
        },
        week_4: { 
            exercises: 3,
            sets: 3,
            rep_range: "10-12",
            notes: "Deload, più reps meno peso"
        }
    },

    progressive_overload: {
        week_1: { 
            rpe_target: 7,
            sets: 3,
            rep_range: "8-10",
            notes: "3x8-10 @ RPE 7, stabilizza tecnica"
        },
        week_2: { 
            rpe_target: 7.5,
            sets: 4,
            rep_range: "6-8",
            notes: "4x6-8 @ RPE 7.5"
        },
        week_3: { 
            rpe_target: 8,
            sets: 4,
            rep_range: "5-6",
            notes: "4x5-6 @ RPE 8, picco"
        },
        week_4: { 
            rpe_target: 6,
            sets: 3,
            rep_range: "8-10",
            notes: "Deload @ RPE 6"
        }
    },

    amrap: {
        week_1: { 
            duration_minutes: 8,
            movements: 3,
            notes: "AMRAP 8min, 3 movimenti semplici"
        },
        week_2: { 
            duration_minutes: 10,
            movements: 4,
            notes: "AMRAP 10min, 4 movimenti"
        },
        week_3: { 
            duration_minutes: 12,
            movements: 4,
            notes: "AMRAP 12min, intensità massima"
        },
        week_4: { 
            duration_minutes: 8,
            movements: 3,
            notes: "Deload"
        }
    }
};


// ═══════════════════════════════════════════════════════════════════════════
// 2. REGOLE DI INCOMPATIBILITÀ TRA METODOLOGIE
// ═══════════════════════════════════════════════════════════════════════════

const METHOD_INCOMPATIBILITIES = {
    // Formato: metodo -> [lista metodi incompatibili nella stessa sessione]
    
    drop_set: {
        incompatible_with: ["rest_pause", "german_volume_training", "cluster_set", "myo_reps"],
        reason: "Troppo stress metabolico combinato, rischio overtraining"
    },
    
    rest_pause: {
        incompatible_with: ["drop_set", "german_volume_training", "myo_reps", "amrap"],
        reason: "Entrambi portano a cedimento, SNC troppo stressato"
    },
    
    german_volume_training: {
        incompatible_with: ["drop_set", "rest_pause", "tri_set", "giant_set", "cluster_set"],
        reason: "GVT è già volume massimo, non aggiungere altri stressor"
    },
    
    cluster_set: {
        incompatible_with: ["drop_set", "german_volume_training", "myo_reps"],
        reason: "Cluster è per forza/potenza, non mescolare con metodi metabolici"
    },
    
    contrast_training: {
        incompatible_with: ["german_volume_training", "circuit", "amrap", "tabata"],
        reason: "PAP richiede SNC fresco, non fare dopo lavoro metabolico"
    },
    
    tabata: {
        incompatible_with: ["amrap", "german_volume_training", "rsa_repeated_sprint"],
        reason: "Due protocolli HIIT nella stessa sessione = overreaching"
    },
    
    rsa_repeated_sprint: {
        incompatible_with: ["tabata", "amrap", "heavy_bag_intervals"],
        reason: "Sprint ripetuti + altro HIIT = troppo stress cardiovascolare"
    },
    
    heavy_bag_intervals: {
        incompatible_with: ["rsa_repeated_sprint", "tabata", "fast_break_conditioning"],
        reason: "Non combinare due protocolli interval nella stessa sessione"
    }
};


// ═══════════════════════════════════════════════════════════════════════════
// 3. SEQUENZA OTTIMALE NELLA SESSIONE
// ═══════════════════════════════════════════════════════════════════════════

const METHOD_SEQUENCE_ORDER = {
    // Numero più basso = va fatto PRIMA nella sessione
    // Logica: SNC fresh → compound pesanti → metabolico → finishers
    
    contrast_training: { order: 1, reason: "Richiede SNC freschissimo per PAP" },
    cluster_set: { order: 2, reason: "Carichi alti, serve concentrazione massima" },
    
    pyramid: { order: 3, reason: "Compound principale della sessione" },
    progressive_overload: { order: 3, reason: "Main lift" },
    rpe_autoregulation: { order: 3, reason: "Main lift con autoregolazione" },
    
    superset: { order: 4, reason: "Può essere compound o accessori" },
    rest_pause: { order: 4, reason: "Alto stress, ma gestibile mid-session" },
    
    drop_set: { order: 5, reason: "Fine esercizio, porta a cedimento" },
    myo_reps: { order: 5, reason: "Isolamento con alto volume" },
    mechanical_drop_set: { order: 5, reason: "Cedimento progressivo" },
    
    tri_set: { order: 6, reason: "Volume alto, fatica accumulata" },
    giant_set: { order: 6, reason: "Molto faticoso, quasi finisher" },
    
    circuit: { order: 7, reason: "Conditioning, può essere finisher" },
    emom: { order: 7, reason: "Conditioning/skill work" },
    tabata: { order: 8, reason: "Finisher metabolico" },
    amrap: { order: 8, reason: "Finisher test" },
    
    tempo_training: { order: 0, reason: "Può essere usato ovunque" },
    mind_muscle_connection: { order: 0, reason: "Approccio, non sequenza" },
    eccentric_focus: { order: 0, reason: "Modifica di esecuzione" },
    
    // Sport-specific
    rsa_repeated_sprint: { order: 8, reason: "Mai all'inizio, dopo attivazione" },
    change_of_direction: { order: 3, reason: "Dopo warm-up, prima della fatica" },
    nordic_hamstring: { order: 6, reason: "Prehab, dopo lavoro principale" },
    copenhagen_adductor: { order: 6, reason: "Prehab" },
    
    boxing_circuit: { order: 7, reason: "Conditioning finale" },
    heavy_bag_intervals: { order: 5, reason: "Lavoro specifico" },
    shadow_boxing_drills: { order: 2, reason: "Warm-up tecnico o skill" },
    
    vertical_jump_training: { order: 2, reason: "Pliometria fresco" },
    defensive_slides_drill: { order: 4, reason: "Skill/conditioning" }
};


// ═══════════════════════════════════════════════════════════════════════════
// 4. ADATTAMENTI PER RUOLO SPORTIVO
// ═══════════════════════════════════════════════════════════════════════════

const ROLE_METHOD_PREFERENCES = {
    
    // ─────────────────────────────────────────────────────────────────────
    // CALCIO ⚽
    // ─────────────────────────────────────────────────────────────────────
    
    calcio: {
        portiere: {
            priority_methods: ["contrast_training", "vertical_jump_training", "change_of_direction"],
            secondary_methods: ["cluster_set", "eccentric_focus"],
            avoid_methods: ["german_volume_training", "rsa_repeated_sprint"],
            focus: "Esplosività, reattività, potenza nel tuffo",
            notes: "Meno endurance, più esplosività e agilità"
        },
        difensore_centrale: {
            priority_methods: ["nordic_hamstring", "contrast_training", "cluster_set"],
            secondary_methods: ["superset", "circuit"],
            avoid_methods: ["german_volume_training"],
            focus: "Forza aerea, contrasti, prevenzione",
            notes: "Salto, forza collo, anti-rotazione"
        },
        terzino: {
            priority_methods: ["rsa_repeated_sprint", "change_of_direction", "circuit"],
            secondary_methods: ["superset", "emom"],
            avoid_methods: ["german_volume_training", "cluster_set"],
            focus: "Resistenza ripetuta, up&down continuo",
            notes: "Alto volume sprint, recupero rapido"
        },
        centrocampista: {
            priority_methods: ["rsa_repeated_sprint", "circuit", "emom"],
            secondary_methods: ["superset", "tempo_training"],
            avoid_methods: ["contrast_training"], // troppo specifico
            focus: "Box-to-box, resistenza, recupero",
            notes: "Equilibrio forza/endurance"
        },
        ala: {
            priority_methods: ["rsa_repeated_sprint", "contrast_training", "change_of_direction"],
            secondary_methods: ["nordic_hamstring", "drop_set"],
            avoid_methods: ["german_volume_training"],
            focus: "Velocità, dribbling, accelerazioni",
            notes: "Potenza esplosiva, prevenzione hamstring"
        },
        attaccante: {
            priority_methods: ["contrast_training", "cluster_set", "vertical_jump_training"],
            secondary_methods: ["change_of_direction", "nordic_hamstring"],
            avoid_methods: ["circuit", "amrap"],
            focus: "Esplosività, salto, tiro potente",
            notes: "Più forza/potenza che endurance"
        }
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // BASKET 🏀
    // ─────────────────────────────────────────────────────────────────────
    
    basket: {
        playmaker: {
            priority_methods: ["change_of_direction", "defensive_slides_drill", "emom"],
            secondary_methods: ["circuit", "superset"],
            avoid_methods: ["german_volume_training"],
            focus: "Agilità, visione, resistenza",
            notes: "Footwork e decision-making sotto fatica"
        },
        guardia: {
            priority_methods: ["rsa_repeated_sprint", "change_of_direction", "contrast_training"],
            secondary_methods: ["vertical_jump_training", "defensive_slides_drill"],
            avoid_methods: ["german_volume_training"],
            focus: "Velocità, tiro, difesa perimetrale",
            notes: "Mix esplosività e resistenza"
        },
        ala_piccola: {
            priority_methods: ["vertical_jump_training", "contrast_training", "fast_break_conditioning"],
            secondary_methods: ["change_of_direction", "superset"],
            avoid_methods: [],
            focus: "Versatilità, atletismo completo",
            notes: "Deve fare tutto bene"
        },
        ala_grande: {
            priority_methods: ["vertical_jump_training", "cluster_set", "contrast_training"],
            secondary_methods: ["rest_pause", "eccentric_focus"],
            avoid_methods: ["tabata"],
            focus: "Potenza, rimbalzi, post moves",
            notes: "Più forza che agilità"
        },
        centro: {
            priority_methods: ["cluster_set", "rest_pause", "eccentric_focus"],
            secondary_methods: ["vertical_jump_training", "superset"],
            avoid_methods: ["rsa_repeated_sprint", "tabata"],
            focus: "Forza pura, presenza in area",
            notes: "Potenza > endurance"
        }
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // BOXE 🥊
    // ─────────────────────────────────────────────────────────────────────
    
    boxe: {
        peso_leggero: {
            priority_methods: ["boxing_circuit", "heavy_bag_intervals", "emom"],
            secondary_methods: ["shadow_boxing_drills", "circuit"],
            avoid_methods: ["german_volume_training", "cluster_set"],
            focus: "Velocità, resistenza, volume",
            notes: "No massa, sì endurance e rapidità"
        },
        peso_medio: {
            priority_methods: ["heavy_bag_intervals", "punch_resistance_training", "circuit"],
            secondary_methods: ["boxing_circuit", "contrast_training"],
            avoid_methods: ["german_volume_training"],
            focus: "Equilibrio potenza/resistenza",
            notes: "Mix completo"
        },
        peso_massimo: {
            priority_methods: ["punch_resistance_training", "cluster_set", "contrast_training"],
            secondary_methods: ["heavy_bag_intervals", "neck_strengthening"],
            avoid_methods: ["tabata", "amrap"],
            focus: "Potenza pura, KO power",
            notes: "Forza > endurance"
        },
        tecnico: {
            priority_methods: ["shadow_boxing_drills", "tempo_training", "mind_muscle_connection"],
            secondary_methods: ["heavy_bag_intervals", "emom"],
            avoid_methods: ["cluster_set"],
            focus: "Precisione, timing, footwork",
            notes: "Qualità > quantità"
        },
        pressure_fighter: {
            priority_methods: ["boxing_circuit", "heavy_bag_intervals", "rsa_repeated_sprint"],
            secondary_methods: ["circuit", "tabata"],
            avoid_methods: ["cluster_set"],
            focus: "Volume, pressione costante",
            notes: "Resistenza infinita"
        }
    },
    
    // ─────────────────────────────────────────────────────────────────────
    // PALESTRA 🏋️
    // ─────────────────────────────────────────────────────────────────────
    
    palestra: {
        bodybuilding: {
            priority_methods: ["drop_set", "superset", "myo_reps", "german_volume_training"],
            secondary_methods: ["rest_pause", "mechanical_drop_set", "tri_set"],
            avoid_methods: ["cluster_set", "contrast_training"],
            focus: "Ipertrofia massima, pump, TUT",
            notes: "Volume alto, connessione mente-muscolo"
        },
        powerlifting: {
            priority_methods: ["cluster_set", "progressive_overload", "rpe_autoregulation"],
            secondary_methods: ["contrast_training", "eccentric_focus"],
            avoid_methods: ["german_volume_training", "circuit", "tabata"],
            focus: "1RM, forza massimale",
            notes: "Basso volume, alta intensità"
        },
        fitness_generale: {
            priority_methods: ["circuit", "superset", "emom"],
            secondary_methods: ["tabata", "progressive_overload"],
            avoid_methods: ["cluster_set", "german_volume_training"],
            focus: "Salute, composizione corporea",
            notes: "Varietà, divertimento, sostenibilità"
        },
        dimagrimento: {
            priority_methods: ["circuit", "tabata", "emom", "superset"],
            secondary_methods: ["amrap", "complex_training"],
            avoid_methods: ["cluster_set", "rest_pause"],
            focus: "Deficit calorico, EPOC alto",
            notes: "Densità alta, recupero breve"
        },
        forza_funzionale: {
            priority_methods: ["complex_training", "superset", "circuit"],
            secondary_methods: ["contrast_training", "emom"],
            avoid_methods: ["german_volume_training"],
            focus: "Movimenti multi-articolari, catene",
            notes: "Qualità movimento > carico"
        }
    }
};


// ═══════════════════════════════════════════════════════════════════════════
// 5. PERIODIZZAZIONE: QUALE METODOLOGIA IN QUALE SETTIMANA
// ═══════════════════════════════════════════════════════════════════════════

const MESOCYCLE_METHOD_PLAN = {
    
    // Piano standard 4 settimane
    standard_4_week: {
        week_1: {
            name: "Adattamento",
            primary_methods: ["superset", "tempo_training", "circuit"],
            intensity: "low-medium",
            notes: "Introduci metodologie base, focus tecnica"
        },
        week_2: {
            name: "Accumulo",
            primary_methods: ["superset", "drop_set", "myo_reps", "emom"],
            intensity: "medium",
            notes: "Aumenta volume, introduci metodi metabolici"
        },
        week_3: {
            name: "Intensificazione",
            primary_methods: ["rest_pause", "cluster_set", "contrast_training"],
            intensity: "high",
            notes: "Picco intensità, riduci volume"
        },
        week_4: {
            name: "Deload",
            primary_methods: ["tempo_training", "superset"],
            intensity: "low",
            notes: "Volume e intensità ridotti 40-50%"
        }
    },
    
    // Piano sport 8 settimane (calcio/basket pre-season)
    sport_8_week: {
        week_1: {
            phase: "GPP",
            primary_methods: ["circuit", "superset", "tempo_training"],
            notes: "Costruzione base aerobica e forza"
        },
        week_2: {
            phase: "GPP",
            primary_methods: ["circuit", "emom", "superset"],
            notes: "Aumenta volume"
        },
        week_3: {
            phase: "Accumulo Forza",
            primary_methods: ["progressive_overload", "superset", "nordic_hamstring"],
            notes: "Introduci lavoro forza"
        },
        week_4: {
            phase: "Accumulo Forza",
            primary_methods: ["progressive_overload", "drop_set", "copenhagen_adductor"],
            notes: "Aumenta carichi"
        },
        week_5: {
            phase: "Potenza",
            primary_methods: ["contrast_training", "cluster_set", "change_of_direction"],
            notes: "Converti forza in potenza"
        },
        week_6: {
            phase: "Potenza",
            primary_methods: ["contrast_training", "vertical_jump_training", "rsa_repeated_sprint"],
            notes: "Picco potenza"
        },
        week_7: {
            phase: "Specifico",
            primary_methods: ["rsa_repeated_sprint", "change_of_direction", "small_sided_games"],
            notes: "Sport-specifico, simula match"
        },
        week_8: {
            phase: "Taper",
            primary_methods: ["tempo_training", "shadow_boxing_drills"],
            notes: "Volume -50%, mantieni intensità"
        }
    },
    
    // Piano boxe fight camp (8 settimane)
    boxing_8_week: {
        week_1: {
            phase: "Base Building",
            primary_methods: ["circuit", "shadow_boxing_drills", "superset"],
            notes: "Costruzione aerobica"
        },
        week_2: {
            phase: "Base Building",
            primary_methods: ["boxing_circuit", "emom", "punch_resistance_training"],
            notes: "Aumenta volume specifico"
        },
        week_3: {
            phase: "Strength",
            primary_methods: ["punch_resistance_training", "cluster_set", "neck_strengthening"],
            notes: "Forza rotazionale"
        },
        week_4: {
            phase: "Strength",
            primary_methods: ["contrast_training", "punch_resistance_training", "superset"],
            notes: "Converti in potenza"
        },
        week_5: {
            phase: "Fight Simulation",
            primary_methods: ["heavy_bag_intervals", "boxing_circuit", "rsa_repeated_sprint"],
            notes: "Simula intensità match"
        },
        week_6: {
            phase: "Fight Simulation",
            primary_methods: ["heavy_bag_intervals", "tabata", "boxing_circuit"],
            notes: "Picco conditioning"
        },
        week_7: {
            phase: "Sharpening",
            primary_methods: ["shadow_boxing_drills", "heavy_bag_intervals"],
            notes: "Riduci volume, affila tecnica"
        },
        week_8: {
            phase: "Fight Week",
            primary_methods: ["shadow_boxing_drills", "tempo_training"],
            notes: "Solo tecnica leggera, recupero"
        }
    }
};


// ═══════════════════════════════════════════════════════════════════════════
// 6. FUNZIONI HELPER AVANZATE
// ═══════════════════════════════════════════════════════════════════════════

const AdvancedMethodSelector = {

    /**
     * Ottiene la progressione per una metodologia in una settimana specifica
     */
    getProgression(methodKey, weekNumber) {
        const prog = METHOD_PROGRESSIONS[methodKey];
        if (!prog) return null;
        
        const weekKey = `week_${weekNumber}`;
        return prog[weekKey] || prog.week_1; // fallback a week 1
    },

    /**
     * Controlla se due metodologie sono compatibili nella stessa sessione
     */
    areCompatible(method1, method2) {
        const incompat1 = METHOD_INCOMPATIBILITIES[method1]?.incompatible_with || [];
        const incompat2 = METHOD_INCOMPATIBILITIES[method2]?.incompatible_with || [];
        
        if (incompat1.includes(method2) || incompat2.includes(method1)) {
            return {
                compatible: false,
                reason: METHOD_INCOMPATIBILITIES[method1]?.reason || 
                        METHOD_INCOMPATIBILITIES[method2]?.reason || 
                        "Incompatibilità generale"
            };
        }
        return { compatible: true };
    },

    /**
     * Ordina le metodologie per sequenza ottimale nella sessione
     */
    sortBySequence(methodKeys) {
        return [...methodKeys].sort((a, b) => {
            const orderA = METHOD_SEQUENCE_ORDER[a]?.order ?? 5;
            const orderB = METHOD_SEQUENCE_ORDER[b]?.order ?? 5;
            return orderA - orderB;
        });
    },

    /**
     * Ottiene metodologie prioritarie per sport + ruolo
     */
    getMethodsForRole(sport, role) {
        const sportRoles = ROLE_METHOD_PREFERENCES[sport];
        if (!sportRoles) return null;
        
        const rolePrefs = sportRoles[role];
        if (!rolePrefs) return null;
        
        return {
            priority: rolePrefs.priority_methods || [],
            secondary: rolePrefs.secondary_methods || [],
            avoid: rolePrefs.avoid_methods || [],
            focus: rolePrefs.focus,
            notes: rolePrefs.notes
        };
    },

    /**
     * Ottiene il piano metodologico per una settimana nel mesociclo
     */
    getMesocycleWeek(planType, weekNumber) {
        const plan = MESOCYCLE_METHOD_PLAN[planType];
        if (!plan) return null;
        
        const weekKey = `week_${weekNumber}`;
        return plan[weekKey] || null;
    },

    /**
     * Genera testo prompt con tutte le regole avanzate
     */
    generateAdvancedPromptSection(context) {
        const { sport, role, weekNumber, selectedMethods, planType } = context;
        
        const lines = [];
        lines.push("\n⛔═══════════════════════════════════════════════════════════════⛔");
        lines.push("REGOLE AVANZATE VINCOLANTI - NON IGNORARE");
        lines.push("⛔═══════════════════════════════════════════════════════════════⛔");
        
        // 1. Preferenze ruolo
        const rolePrefs = this.getMethodsForRole(sport, role);
        if (rolePrefs) {
            lines.push(`\n🎯 RUOLO ${role.toUpperCase()}: ${rolePrefs.focus}`);
            if (rolePrefs.priority.length) {
                lines.push(`✅ DEVI USARE preferibilmente: ${rolePrefs.priority.slice(0, 3).join(', ')}`);
            }
            if (rolePrefs.avoid.length) {
                lines.push(`⛔ VIETATO USARE: ${rolePrefs.avoid.join(', ')}`);
            }
        }
        
        // 2. Piano mesociclo
        const weekPlan = this.getMesocycleWeek(planType || 'standard_4_week', weekNumber);
        if (weekPlan) {
            lines.push(`\n📅 SETTIMANA ${weekNumber} - FASE: ${weekPlan.name || weekPlan.phase}`);
            lines.push(`METODOLOGIE OBBLIGATORIE questa settimana: ${weekPlan.primary_methods.join(', ')}`);
            if (weekPlan.notes) lines.push(`Direttiva: ${weekPlan.notes}`);
        }
        
        // 3. Progressioni per metodologie selezionate
        if (selectedMethods && selectedMethods.length) {
            lines.push(`\n📈 PARAMETRI ESATTI SETTIMANA ${weekNumber} (RISPETTA QUESTI NUMERI):`);
            for (const m of selectedMethods.slice(0, 3)) {
                const prog = this.getProgression(m, weekNumber);
                if (prog) {
                    lines.push(`- ${m}: ${prog.notes}`);
                }
            }
        }
        
        // 4. Controllo incompatibilità
        if (selectedMethods && selectedMethods.length >= 2) {
            const incompatibleFound = [];
            for (let i = 0; i < selectedMethods.length; i++) {
                for (let j = i + 1; j < selectedMethods.length; j++) {
                    const check = this.areCompatible(selectedMethods[i], selectedMethods[j]);
                    if (!check.compatible) {
                        incompatibleFound.push(`${selectedMethods[i]} + ${selectedMethods[j]}`);
                    }
                }
            }
            if (incompatibleFound.length) {
                lines.push(`\n⛔ COMBINAZIONI VIETATE (non usare insieme):`);
                for (const combo of incompatibleFound) {
                    lines.push(`   ❌ ${combo}`);
                }
            }
        }
        
        // 5. Sequenza ottimale
        if (selectedMethods && selectedMethods.length >= 2) {
            const sorted = this.sortBySequence(selectedMethods);
            lines.push(`\n🔢 ORDINE OBBLIGATORIO nella sessione: ${sorted.join(' → ')}`);
        }
        
        return lines.join('\n');
    },

    /**
     * Valida un workout completo e restituisce warnings/errors
     */
    validateWorkout(workoutObj, context) {
        const warnings = [];
        const errors = [];
        const suggestions = [];

        if (!workoutObj || !Array.isArray(workoutObj.exercises)) {
            errors.push("Workout non valido: manca array exercises");
            return { valid: false, errors, warnings, suggestions };
        }

        const { sport, role, weekNumber, fatigue } = context || {};

        // Estrai metodologie usate dal workout
        const methodsUsed = [];
        const exerciseNames = workoutObj.exercises.map(e => String(e?.name || '').toLowerCase());

        // Detect methods from exercise names
        if (exerciseNames.some(n => /superset|a1.*a2|b1.*b2/i.test(n))) methodsUsed.push('superset');
        if (exerciseNames.some(n => /drop\s*set/i.test(n))) methodsUsed.push('drop_set');
        if (exerciseNames.some(n => /rest[- ]?pause/i.test(n))) methodsUsed.push('rest_pause');
        if (exerciseNames.some(n => /myo[- ]?reps/i.test(n))) methodsUsed.push('myo_reps');
        if (exerciseNames.some(n => /cluster/i.test(n))) methodsUsed.push('cluster_set');
        if (exerciseNames.some(n => /emom/i.test(n))) methodsUsed.push('emom');
        if (exerciseNames.some(n => /tabata/i.test(n))) methodsUsed.push('tabata');
        if (exerciseNames.some(n => /circuit/i.test(n))) methodsUsed.push('circuit');
        if (exerciseNames.some(n => /amrap/i.test(n))) methodsUsed.push('amrap');
        if (exerciseNames.some(n => /nordic/i.test(n))) methodsUsed.push('nordic_hamstring');
        if (exerciseNames.some(n => /copenhagen/i.test(n))) methodsUsed.push('copenhagen_adductor');
        if (exerciseNames.some(n => /rsa|repeated\s*sprint/i.test(n))) methodsUsed.push('rsa_repeated_sprint');

        // 1. Check incompatibilità
        for (let i = 0; i < methodsUsed.length; i++) {
            for (let j = i + 1; j < methodsUsed.length; j++) {
                const check = this.areCompatible(methodsUsed[i], methodsUsed[j]);
                if (!check.compatible) {
                    warnings.push(`⚠️ ${methodsUsed[i]} + ${methodsUsed[j]} non sono ideali insieme: ${check.reason}`);
                }
            }
        }

        // 2. Check fatigue
        if (fatigue >= 7) {
            const highIntensityMethods = ['drop_set', 'rest_pause', 'german_volume_training', 'cluster_set', 'tabata'];
            const usedHighIntensity = methodsUsed.filter(m => highIntensityMethods.includes(m));
            if (usedHighIntensity.length > 0) {
                warnings.push(`⚠️ Fatigue alta (${fatigue}/10): le metodologie ${usedHighIntensity.join(', ')} potrebbero essere eccessive`);
                suggestions.push("Considera serie tradizionali o metodologie a bassa intensità");
            }
        }

        // 3. Check role preferences
        if (sport && role) {
            const rolePrefs = this.getMethodsForRole(sport, role);
            if (rolePrefs) {
                for (const m of methodsUsed) {
                    if (rolePrefs.avoid.includes(m)) {
                        warnings.push(`⚠️ ${m} non è ideale per il ruolo ${role}: evitare`);
                    }
                }
            }
        }

        // 4. Check volume
        const exerciseCount = workoutObj.exercises.length;
        if (exerciseCount > 10) {
            warnings.push(`⚠️ Troppi esercizi (${exerciseCount}): considera ridurre a 6-8`);
        }
        if (exerciseCount < 4) {
            warnings.push(`⚠️ Pochi esercizi (${exerciseCount}): considera aggiungerne qualcuno`);
        }

        // 5. Check structure (warm-up, main, accessories, finisher)
        const hasWarmup = exerciseNames.some(n => /warm|mob|activation|prep/i.test(n));
        const hasFinisher = exerciseNames.some(n => /finisher|circuit|emom|tabata|core|cooldown/i.test(n));
        
        if (!hasWarmup) {
            suggestions.push("Considera aggiungere warm-up/activation iniziale");
        }
        if (!hasFinisher && exerciseCount >= 5) {
            suggestions.push("Considera aggiungere finisher o core finale");
        }

        return {
            valid: errors.length === 0,
            methodsDetected: methodsUsed,
            errors,
            warnings,
            suggestions
        };
    },

    /**
     * Suggerisce metodologie per un contesto specifico
     */
    suggestMethodsForContext(context) {
        const { sport, role, weekNumber, phase, fatigue, goal } = context;
        const suggestions = [];

        // 1. Da ruolo
        const rolePrefs = this.getMethodsForRole(sport, role);
        if (rolePrefs) {
            suggestions.push(...rolePrefs.priority.slice(0, 2).map(m => ({
                method: m,
                reason: `Prioritario per ruolo ${role}`,
                score: 100
            })));
        }

        // 2. Da mesociclo
        const planType = sport === 'palestra' ? 'standard_4_week' : 'sport_8_week';
        const weekPlan = this.getMesocycleWeek(planType, weekNumber);
        if (weekPlan) {
            suggestions.push(...weekPlan.primary_methods.slice(0, 2).map(m => ({
                method: m,
                reason: `Consigliato per ${weekPlan.phase || weekPlan.name}`,
                score: 80
            })));
        }

        // 3. Adjust for fatigue
        if (fatigue >= 7) {
            // Deprioritize high intensity
            suggestions.forEach(s => {
                if (['drop_set', 'rest_pause', 'cluster_set', 'tabata'].includes(s.method)) {
                    s.score -= 40;
                    s.reason += ' (⚠️ fatigue alta)';
                }
            });
        }

        // Deduplicate and sort
        const uniqueMethods = {};
        for (const s of suggestions) {
            if (!uniqueMethods[s.method] || uniqueMethods[s.method].score < s.score) {
                uniqueMethods[s.method] = s;
            }
        }

        return Object.values(uniqueMethods).sort((a, b) => b.score - a.score).slice(0, 5);
    }
};

// Export per uso browser
window.METHOD_PROGRESSIONS = METHOD_PROGRESSIONS;
window.METHOD_INCOMPATIBILITIES = METHOD_INCOMPATIBILITIES;
window.METHOD_SEQUENCE_ORDER = METHOD_SEQUENCE_ORDER;
window.ROLE_METHOD_PREFERENCES = ROLE_METHOD_PREFERENCES;
window.MESOCYCLE_METHOD_PLAN = MESOCYCLE_METHOD_PLAN;
window.AdvancedMethodSelector = AdvancedMethodSelector;
