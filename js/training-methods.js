// GR Perform - Training Methods Library
// Catalogo metodologie di allenamento con regole di applicazione

const TRAINING_METHODS = {

    // ═══════════════════════════════════════════════════════════════════
    // METODI DI INTENSITÀ (aumentano lo stress meccanico/metabolico)
    // ═══════════════════════════════════════════════════════════════════

    drop_set: {
        name: "Drop Set",
        alias: ["stripping", "strip set", "serie a scalare"],
        description: "Esegui serie a cedimento, riduci il peso del 20-30% e continua senza pausa. Ripeti 2-3 volte.",
        example: "Curl bilanciere: 20kg x cedimento → 15kg x cedimento → 10kg x cedimento",
        
        // Quando usarlo
        best_for: ["hypertrophy", "muscle_endurance"],
        goals: ["massa_muscolare", "definizione", "pump"],
        
        // Requisiti
        min_experience: "intermediate", // beginner | intermediate | advanced
        min_rpe_tolerance: 8,
        requires_spotter: false,
        equipment_friendly: ["dumbbells", "cables", "machines"], // facile cambiare peso
        equipment_avoid: ["barbell_heavy"], // scomodo con bilanciere pesante
        
        // Periodizzazione
        phases: ["accumulo", "intensificazione"],
        avoid_phases: ["deload", "peaking"],
        
        // Limiti di sicurezza
        max_per_workout: 2, // massimo 2 esercizi con drop set per workout
        max_per_week: 4,
        recovery_cost: "high", // low | medium | high
        injury_risk: "medium",
        
        // Muscoli ideali
        ideal_muscles: ["biceps", "triceps", "shoulders", "chest", "quads"],
        avoid_muscles: ["lower_back", "rotator_cuff"],
        
        // Fatica e controindicazioni
        contraindications: ["high_fatigue", "joint_pain", "beginner"],
        fatigue_multiplier: 1.5 // moltiplica la fatica normale dell'esercizio
    },

    superset: {
        name: "Superset",
        alias: ["super serie"],
        description: "Due esercizi eseguiti back-to-back senza pausa. Può essere agonista-antagonista o stesso muscolo.",
        example: "A1: Chest Press x10 → A2: Rematore x10 (poi riposo 90s)",
        
        subtypes: {
            antagonist: {
                name: "Superset Antagonista",
                description: "Muscoli opposti (es: petto/dorso, bicipiti/tricipiti)",
                benefit: "Efficienza tempo, recupero attivo",
                example: "Panca + Rematore"
            },
            agonist: {
                name: "Superset Agonista", 
                description: "Stesso muscolo, due esercizi diversi",
                benefit: "Massimo stress metabolico",
                example: "Leg Extension + Squat"
            },
            pre_exhaust: {
                name: "Pre-Esaurimento",
                description: "Isolamento → Compound",
                benefit: "Target muscolo specifico nei compound",
                example: "Croci cavi → Panca piana"
            },
            post_exhaust: {
                name: "Post-Esaurimento",
                description: "Compound → Isolamento",
                benefit: "Svuotamento completo dopo compound",
                example: "Squat → Leg Extension"
            }
        },
        
        best_for: ["hypertrophy", "conditioning", "time_efficiency"],
        goals: ["massa_muscolare", "definizione", "fitness_generale"],
        
        min_experience: "beginner", // accessibile a tutti
        min_rpe_tolerance: 6,
        requires_spotter: false,
        
        phases: ["accumulo", "intensificazione", "mantenimento"],
        avoid_phases: ["peaking"], // nel peaking serve recupero completo
        
        max_per_workout: 4,
        max_per_week: 12,
        recovery_cost: "medium",
        injury_risk: "low",
        
        time_saving: 0.3, // risparmia 30% del tempo
        
        contraindications: ["cardiovascular_issues", "very_high_fatigue"]
    },

    tri_set: {
        name: "Tri-Set",
        alias: ["triple set", "tri serie"],
        description: "Tre esercizi consecutivi per lo stesso gruppo muscolare senza pausa.",
        example: "Shoulder Press → Alzate laterali → Alzate frontali (poi riposo 2min)",
        
        best_for: ["hypertrophy", "muscle_endurance"],
        goals: ["massa_muscolare", "definizione", "pump"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 8,
        
        phases: ["accumulo"],
        avoid_phases: ["deload", "peaking", "intensificazione"],
        
        max_per_workout: 2,
        max_per_week: 4,
        recovery_cost: "high",
        injury_risk: "medium",
        
        ideal_muscles: ["shoulders", "arms", "chest"],
        avoid_muscles: ["lower_back", "hamstrings"],
        
        contraindications: ["beginner", "high_fatigue", "time_limited"]
    },

    giant_set: {
        name: "Giant Set",
        alias: ["serie gigante"],
        description: "4+ esercizi consecutivi per lo stesso gruppo muscolare.",
        example: "Panca → Croci → Push-up → Dips (4 esercizi petto, poi riposo 3min)",
        
        best_for: ["hypertrophy", "conditioning", "muscle_endurance"],
        goals: ["massa_muscolare", "definizione", "resistenza"],
        
        min_experience: "advanced",
        min_rpe_tolerance: 9,
        
        phases: ["accumulo"],
        avoid_phases: ["deload", "peaking", "intensificazione"],
        
        max_per_workout: 1,
        max_per_week: 2,
        recovery_cost: "very_high",
        injury_risk: "medium",
        
        contraindications: ["beginner", "intermediate", "high_fatigue", "low_motivation"]
    },

    rest_pause: {
        name: "Rest-Pause",
        alias: ["pausa-riposo", "rest pause"],
        description: "Serie a cedimento → 10-15s pausa → continua fino a cedimento → ripeti 2-3 volte.",
        example: "Leg Press: 12 reps cedimento → 15s → 4 reps → 15s → 2 reps",
        
        best_for: ["strength", "hypertrophy"],
        goals: ["forza", "massa_muscolare"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 9,
        requires_spotter: true, // consigliato per sicurezza
        
        phases: ["intensificazione"],
        avoid_phases: ["deload", "accumulo"],
        
        max_per_workout: 2,
        max_per_week: 4,
        recovery_cost: "very_high",
        injury_risk: "high",
        
        ideal_muscles: ["chest", "back", "quads"],
        avoid_muscles: ["lower_back", "shoulders"], // troppo stress articolare
        
        contraindications: ["beginner", "joint_issues", "high_fatigue"]
    },

    cluster_set: {
        name: "Cluster Set",
        alias: ["cluster", "serie a grappolo"],
        description: "Serie interrotta da micro-pause (15-30s) per mantenere qualità con carichi alti.",
        example: "Squat 85% 1RM: 2 reps → 20s → 2 reps → 20s → 2 reps (totale 6 reps)",
        
        best_for: ["strength", "power"],
        goals: ["forza_massimale", "potenza", "performance"],
        
        min_experience: "advanced",
        min_rpe_tolerance: 8,
        requires_spotter: true,
        
        phases: ["intensificazione", "peaking"],
        avoid_phases: ["accumulo", "deload"],
        
        max_per_workout: 2,
        max_per_week: 4,
        recovery_cost: "high",
        injury_risk: "medium", // basso se tecnica ok, le pause permettono recupero
        
        ideal_exercises: ["squat", "deadlift", "bench_press", "power_clean"],
        
        contraindications: ["beginner", "intermediate", "technique_issues"]
    },

    myo_reps: {
        name: "Myo-Reps",
        alias: ["myo reps", "activation set"],
        description: "Serie attivazione (12-15 reps) → 5s pausa → mini-set 3-5 reps → ripeti 3-5 volte.",
        example: "Curl: 15 reps → 5s → 4 reps → 5s → 4 reps → 5s → 3 reps",
        
        best_for: ["hypertrophy", "time_efficiency"],
        goals: ["massa_muscolare", "definizione"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 8,
        
        phases: ["accumulo", "intensificazione"],
        avoid_phases: ["deload"],
        
        max_per_workout: 3,
        max_per_week: 8,
        recovery_cost: "medium",
        injury_risk: "low",
        
        time_saving: 0.4, // risparmia 40% del tempo
        
        ideal_muscles: ["biceps", "triceps", "calves", "rear_delts"],
        
        contraindications: ["beginner", "compound_exercises"]
    },

    // ═══════════════════════════════════════════════════════════════════
    // METODI DI TEMPO/STRUTTURA
    // ═══════════════════════════════════════════════════════════════════

    circuit: {
        name: "Circuit Training",
        alias: ["circuito", "circuit"],
        description: "5-10 esercizi eseguiti in sequenza con pausa minima. Ripeti 2-4 giri.",
        example: "Squat → Push-up → Row → Plank → Lunges (30s ciascuno, 4 giri)",
        
        subtypes: {
            strength_circuit: {
                name: "Circuito Forza",
                description: "Carichi moderati, 8-12 reps per stazione",
                rest_between: "15-30s",
                rounds: 3
            },
            metabolic_circuit: {
                name: "Circuito Metabolico",
                description: "Carichi leggeri o bodyweight, alta frequenza cardiaca",
                rest_between: "0-15s",
                rounds: 4
            },
            sport_specific: {
                name: "Circuito Sport-Specifico",
                description: "Mix di forza, potenza e movimenti atletici",
                rest_between: "20-40s",
                rounds: 3
            }
        },
        
        best_for: ["conditioning", "fat_loss", "time_efficiency", "muscle_endurance"],
        goals: ["definizione", "resistenza", "fitness_generale", "sport_performance"],
        
        min_experience: "beginner",
        min_rpe_tolerance: 7,
        
        phases: ["accumulo", "mantenimento"],
        avoid_phases: ["peaking"], // troppo faticoso, interferisce con forza
        
        max_per_workout: 2, // massimo 2 circuiti diversi
        max_per_week: 4,
        recovery_cost: "medium",
        injury_risk: "low",
        
        time_saving: 0.5, // risparmia 50% del tempo
        cardiovascular_benefit: "high",
        
        // Sport-specific circuits
        sport_applications: {
            calcio: ["sprint intervals", "agility ladder", "box jumps", "core rotation"],
            boxe: ["heavy bag", "shadow boxing", "burpees", "mountain climbers"],
            basket: ["defensive slides", "jump shots", "fast breaks", "core work"],
            palestra: ["compound lifts", "isolation", "cardio bursts"]
        },
        
        contraindications: ["cardiovascular_issues", "very_high_fatigue"]
    },

    emom: {
        name: "EMOM (Every Minute On the Minute)",
        alias: ["emom", "ogni minuto"],
        description: "Esegui X reps all'inizio di ogni minuto. Il tempo rimanente è riposo.",
        example: "EMOM 10min: 5 Pull-up + 10 Push-up (inizia ogni minuto)",
        
        best_for: ["conditioning", "power_endurance", "technique"],
        goals: ["resistenza", "potenza", "sport_performance"],
        
        min_experience: "beginner",
        min_rpe_tolerance: 6,
        
        phases: ["accumulo", "intensificazione", "mantenimento"],
        avoid_phases: ["deload"],
        
        max_per_workout: 2,
        max_per_week: 6,
        recovery_cost: "medium",
        injury_risk: "low",
        
        ideal_for: ["skill_work", "power_movements", "conditioning"],
        
        contraindications: ["very_deconditioned"]
    },

    amrap: {
        name: "AMRAP (As Many Rounds As Possible)",
        alias: ["amrap", "quante più ripetizioni possibili"],
        description: "Completa quanti più giri possibili in un tempo fisso.",
        example: "AMRAP 12min: 10 KB Swing + 10 Goblet Squat + 10 Push-up",
        
        best_for: ["conditioning", "mental_toughness", "competition"],
        goals: ["resistenza", "fitness_generale", "performance"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 8,
        
        phases: ["accumulo", "test"],
        avoid_phases: ["deload", "peaking"],
        
        max_per_workout: 1,
        max_per_week: 2,
        recovery_cost: "high",
        injury_risk: "medium", // rischio aumenta con fatica
        
        contraindications: ["beginner", "cardiovascular_issues", "technique_issues"]
    },

    tabata: {
        name: "Tabata Protocol",
        alias: ["tabata", "hiit 20/10"],
        description: "20s lavoro massimale → 10s riposo × 8 round (4 minuti totali).",
        example: "Tabata Burpees: 20s max effort → 10s rest × 8",
        
        best_for: ["conditioning", "fat_loss", "vo2max"],
        goals: ["definizione", "resistenza_cardiovascolare", "performance"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 9,
        
        phases: ["accumulo", "intensificazione"],
        avoid_phases: ["deload"],
        
        max_per_workout: 2,
        max_per_week: 4,
        recovery_cost: "high",
        injury_risk: "medium",
        cardiovascular_demand: "very_high",
        
        ideal_exercises: ["burpees", "kettlebell_swings", "bike", "rowing", "battle_ropes"],
        avoid_exercises: ["heavy_barbell", "technical_lifts"],
        
        contraindications: ["beginner", "cardiovascular_issues", "joint_issues"]
    },

    tempo_training: {
        name: "Tempo Training",
        alias: ["tempo", "time under tension", "TUT"],
        description: "Controllo rigoroso del tempo in ogni fase del movimento (es: 4-0-2-0).",
        example: "Squat tempo 4-0-2-0: 4s discesa, 0 pausa, 2s salita, 0 pausa in alto",
        
        tempo_notation: {
            format: "A-B-C-D",
            A: "Eccentrica (discesa)",
            B: "Pausa in posizione allungata",
            C: "Concentrica (salita)",
            D: "Pausa in posizione contratta"
        },
        
        common_tempos: {
            hypertrophy: "3-0-1-0",
            strength: "2-0-1-0",
            control: "4-1-2-1",
            explosive: "2-0-X-0" // X = esplosivo
        },
        
        best_for: ["hypertrophy", "technique", "muscle_control"],
        goals: ["massa_muscolare", "controllo_motorio", "riabilitazione"],
        
        min_experience: "beginner",
        min_rpe_tolerance: 6,
        
        phases: ["accumulo", "intensificazione", "riabilitazione"],
        avoid_phases: [],
        
        max_per_workout: 6, // può essere usato su molti esercizi
        max_per_week: 20,
        recovery_cost: "medium",
        injury_risk: "low",
        
        contraindications: []
    },

    // ═══════════════════════════════════════════════════════════════════
    // METODI DI CONTRASTO/POTENZA
    // ═══════════════════════════════════════════════════════════════════

    contrast_training: {
        name: "Contrast Training",
        alias: ["contrasto", "PAP", "post-activation potentiation"],
        description: "Esercizio pesante → Esercizio esplosivo simile. Sfrutta il PAP.",
        example: "Back Squat 85% × 3 → Box Jump × 5 (dopo 2min riposo)",
        
        best_for: ["power", "sport_performance", "explosiveness"],
        goals: ["potenza", "velocità", "salto", "sprint"],
        
        min_experience: "advanced",
        min_rpe_tolerance: 7,
        requires_spotter: true,
        
        phases: ["intensificazione", "peaking"],
        avoid_phases: ["accumulo", "deload"],
        
        max_per_workout: 2,
        max_per_week: 4,
        recovery_cost: "high",
        injury_risk: "medium",
        
        pairings: {
            lower: [
                { heavy: "Back Squat", explosive: "Box Jump" },
                { heavy: "Trap Bar Deadlift", explosive: "Broad Jump" },
                { heavy: "Hip Thrust", explosive: "Sprint 10m" }
            ],
            upper: [
                { heavy: "Bench Press", explosive: "Plyo Push-up" },
                { heavy: "Weighted Pull-up", explosive: "Med Ball Slam" }
            ]
        },
        
        contraindications: ["beginner", "intermediate", "technique_issues", "fatigue"]
    },

    complex_training: {
        name: "Complex Training",
        alias: ["complex", "barbell complex"],
        description: "Serie di movimenti con lo stesso attrezzo senza mai appoggiarlo.",
        example: "Barbell Complex: 6 Deadlift → 6 Row → 6 Clean → 6 Press → 6 Squat",
        
        best_for: ["conditioning", "fat_loss", "total_body"],
        goals: ["definizione", "resistenza", "coordinazione"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 8,
        
        phases: ["accumulo", "intensificazione"],
        avoid_phases: ["deload", "peaking"],
        
        max_per_workout: 2,
        max_per_week: 4,
        recovery_cost: "high",
        injury_risk: "medium",
        
        contraindications: ["beginner", "technique_issues", "grip_issues"]
    },

    // ═══════════════════════════════════════════════════════════════════
    // METODI SPECIFICI PER OBIETTIVO
    // ═══════════════════════════════════════════════════════════════════

    pyramid: {
        name: "Pyramid Set",
        alias: ["piramide", "pyramid"],
        description: "Aumenta peso e diminuisci reps ad ogni serie (o viceversa).",
        example: "Ascending: 12×60kg → 10×70kg → 8×80kg → 6×90kg",
        
        subtypes: {
            ascending: {
                name: "Piramide Ascendente",
                description: "Peso sale, reps scendono",
                best_for: "strength"
            },
            descending: {
                name: "Piramide Discendente",
                description: "Peso scende, reps salgono",
                best_for: "hypertrophy"
            },
            full: {
                name: "Piramide Completa",
                description: "Sale e poi scende",
                best_for: "both"
            }
        },
        
        best_for: ["strength", "hypertrophy"],
        goals: ["forza", "massa_muscolare"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 7,
        
        phases: ["intensificazione"],
        avoid_phases: ["deload"],
        
        max_per_workout: 2,
        max_per_week: 6,
        recovery_cost: "medium",
        injury_risk: "low",
        
        contraindications: ["beginner", "time_limited"]
    },

    mechanical_drop_set: {
        name: "Mechanical Drop Set",
        alias: ["drop set meccanico"],
        description: "Stesso peso, cambi posizione/angolo per rendere l'esercizio più facile.",
        example: "Incline DB Press → Flat DB Press → Decline DB Press (stesso peso)",
        
        best_for: ["hypertrophy"],
        goals: ["massa_muscolare", "pump"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 8,
        
        phases: ["accumulo"],
        avoid_phases: ["deload", "peaking"],
        
        max_per_workout: 2,
        max_per_week: 4,
        recovery_cost: "high",
        injury_risk: "low",
        
        contraindications: ["beginner", "high_fatigue"]
    },

    iso_hold: {
        name: "Isometric Hold",
        alias: ["isometria", "hold", "pause"],
        description: "Mantieni una posizione statica per tempo (es: 5s nella parte bassa dello squat).",
        example: "Squat con pausa 3s nel punto basso",
        
        best_for: ["strength", "technique", "muscle_activation"],
        goals: ["forza_posizionale", "controllo", "stabilità"],
        
        min_experience: "beginner",
        min_rpe_tolerance: 6,
        
        phases: ["accumulo", "tecnica", "riabilitazione"],
        avoid_phases: [],
        
        max_per_workout: 4,
        max_per_week: 12,
        recovery_cost: "low",
        injury_risk: "low",
        
        contraindications: ["hypertension"] // isometria alza la pressione
    },

    eccentric_focus: {
        name: "Eccentric Emphasis",
        alias: ["negativa", "eccentric", "negatives"],
        description: "Enfasi sulla fase eccentrica (4-6s discesa controllata).",
        example: "Pull-up: salta in alto, scendi in 5 secondi controllati",
        
        best_for: ["hypertrophy", "strength", "rehab"],
        goals: ["massa_muscolare", "forza_eccentrica", "prevenzione"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 7,
        
        phases: ["accumulo", "riabilitazione"],
        avoid_phases: ["peaking"], // troppo DOMS
        
        max_per_workout: 3,
        max_per_week: 6,
        recovery_cost: "very_high", // DOMS intensi
        injury_risk: "low", // paradossalmente protettivo
        
        contraindications: ["acute_injury", "very_high_fatigue"]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // METODOLOGIE SPORT-SPECIFICHE: CALCIO ⚽
    // ═══════════════════════════════════════════════════════════════════════

    rsa_repeated_sprint: {
        name: "RSA - Repeated Sprint Ability",
        alias: ["sprint ripetuti", "RSA", "repeated sprints"],
        description: "6-10 sprint massimali (20-40m) con recupero incompleto (20-30s). Simula gli sforzi intermittenti del calcio.",
        example: "8 x 30m sprint, recupero 25s tra gli sprint. Totale 3 serie, 3min tra serie.",
        
        sports: ["calcio", "basket"],
        best_for: ["conditioning", "sport_performance", "speed_endurance"],
        goals: ["resistenza_velocità", "performance", "capacità_recupero"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 8,
        
        phases: ["accumulo", "intensificazione"],
        avoid_phases: ["deload", "peaking"],
        
        max_per_workout: 1,
        max_per_week: 2,
        recovery_cost: "very_high",
        injury_risk: "medium",
        
        contraindications: ["hamstring_issues", "beginner", "high_fatigue"],
        
        progressions: [
            "Settimana 1-2: 6 x 20m, rec 30s",
            "Settimana 3-4: 8 x 25m, rec 25s",
            "Settimana 5-6: 8 x 30m, rec 20s"
        ]
    },

    change_of_direction: {
        name: "COD - Change of Direction",
        alias: ["cambi di direzione", "agility", "COD training"],
        description: "Lavoro su tagli, frenate e ripartenze con angoli variabili (45°, 90°, 180°).",
        example: "Pro Agility Drill 5-10-5, T-Test, Illinois Agility Test",
        
        sports: ["calcio", "basket"],
        best_for: ["agility", "sport_performance", "injury_prevention"],
        goals: ["agilità", "reattività", "performance"],
        
        min_experience: "beginner",
        min_rpe_tolerance: 6,
        
        phases: ["accumulo", "intensificazione", "mantenimento"],
        avoid_phases: ["deload"],
        
        max_per_workout: 2,
        max_per_week: 4,
        recovery_cost: "medium",
        injury_risk: "medium", // stress su ginocchia/caviglie
        
        drills: {
            calcio: ["Pro Agility 5-10-5", "T-Test", "Illinois", "Arrowhead", "L-Drill"],
            basket: ["Lane Agility", "3-Cone Drill", "Defensive Slides", "Zig-Zag"]
        },
        
        contraindications: ["knee_issues", "ankle_issues", "acute_injury"]
    },

    small_sided_games: {
        name: "SSG - Small Sided Games",
        alias: ["partitelle", "small sided games", "giochi ridotti"],
        description: "Partite a ranghi ridotti (3v3, 4v4, 5v5) su campi piccoli per allenare capacità condizionali + tattiche.",
        example: "4v4 + portieri, campo 30x20m, 4 x 4min con 2min recupero",
        
        sports: ["calcio", "basket"],
        best_for: ["conditioning", "sport_specific", "tactical"],
        goals: ["resistenza_specifica", "tattica", "recupero_attivo"],
        
        min_experience: "beginner",
        min_rpe_tolerance: 6,
        
        phases: ["accumulo", "intensificazione", "mantenimento"],
        avoid_phases: [],
        
        max_per_workout: 1,
        max_per_week: 3,
        recovery_cost: "medium",
        injury_risk: "medium",
        
        variations: {
            calcio: {
                "3v3": { campo: "20x15m", durata: "3min", focus: "tecnica + pressione" },
                "4v4": { campo: "30x20m", durata: "4min", focus: "possesso + transizioni" },
                "5v5": { campo: "40x25m", durata: "5min", focus: "gioco posizionale" }
            }
        },
        
        contraindications: ["solo_training", "no_teammates"]
    },

    nordic_hamstring: {
        name: "Nordic Hamstring",
        alias: ["nordic", "nordic curl", "GHR"],
        description: "Esercizio eccentrico per prevenzione infortuni hamstring. Gold standard nel calcio.",
        example: "3 x 5 reps, partner tiene le caviglie, scendi il più lento possibile",
        
        sports: ["calcio", "basket"],
        best_for: ["injury_prevention", "eccentric_strength"],
        goals: ["prevenzione_infortuni", "forza_eccentrica", "hamstring"],
        
        min_experience: "beginner", // fondamentale per tutti
        min_rpe_tolerance: 6,
        
        phases: ["accumulo", "intensificazione", "mantenimento", "in-season"],
        avoid_phases: [],
        
        max_per_workout: 1,
        max_per_week: 3,
        recovery_cost: "high", // DOMS significativi
        injury_risk: "low",
        
        fifa_11_protocol: true,
        evidence_level: "high",
        
        progressions: [
            "Settimana 1-2: 2 x 5, solo fase eccentrica con assistenza",
            "Settimana 3-4: 3 x 5, eccentrica completa",
            "Settimana 5+: 3 x 6-8, aggiungere resistenza se possibile"
        ],
        
        contraindications: ["acute_hamstring_injury", "recent_strain"]
    },

    copenhagen_adductor: {
        name: "Copenhagen Adductor",
        alias: ["copenhagen", "adductor plank"],
        description: "Esercizio per rinforzo adduttori e prevenzione pubalgia. Protocollo FIFA 11+.",
        example: "3 x 10-15s per lato, partner tiene la gamba alta, tu sollevi il bacino",
        
        sports: ["calcio", "basket"],
        best_for: ["injury_prevention", "adductor_strength"],
        goals: ["prevenzione_pubalgia", "stabilità_bacino", "adduttori"],
        
        min_experience: "beginner",
        min_rpe_tolerance: 5,
        
        phases: ["accumulo", "intensificazione", "mantenimento", "in-season"],
        avoid_phases: [],
        
        max_per_workout: 1,
        max_per_week: 4,
        recovery_cost: "medium",
        injury_risk: "low",
        
        fifa_11_protocol: true,
        evidence_level: "high",
        
        progressions: [
            "Livello 1: Ginocchio piegato, 3 x 10s",
            "Livello 2: Gamba tesa, 3 x 10s",
            "Livello 3: Gamba tesa + movimento dinamico, 3 x 10 reps"
        ],
        
        contraindications: ["acute_groin_pain", "pubic_symphysis_issues"]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // METODOLOGIE SPORT-SPECIFICHE: BASKET 🏀
    // ═══════════════════════════════════════════════════════════════════════

    vertical_jump_training: {
        name: "Vertical Jump Training",
        alias: ["salto verticale", "plyometrics", "jump training"],
        description: "Protocollo pliometrico per migliorare l'altezza di salto. Fondamentale nel basket.",
        example: "Depth Jump + Box Jump, 4 x 5 reps, recupero 2min tra serie",
        
        sports: ["basket", "pallavolo"],
        best_for: ["power", "explosiveness", "vertical_jump"],
        goals: ["potenza", "salto", "esplosività"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 7,
        
        phases: ["intensificazione", "peaking"],
        avoid_phases: ["deload"],
        
        max_per_workout: 2,
        max_per_week: 4,
        recovery_cost: "high",
        injury_risk: "medium",
        
        exercises: [
            { name: "Depth Jump", height: "40-60cm", reps: "3-5", focus: "reactive strength" },
            { name: "Box Jump", height: "progressivo", reps: "5", focus: "concentric power" },
            { name: "Broad Jump", distance: "max", reps: "5", focus: "horizontal power" },
            { name: "Single Leg Hop", reps: "5/lato", focus: "unilateral power" }
        ],
        
        contraindications: ["knee_issues", "beginner", "overweight"]
    },

    defensive_slides_drill: {
        name: "Defensive Slides",
        alias: ["scivolamenti difensivi", "lateral slides", "defensive footwork"],
        description: "Lavoro specifico sui movimenti difensivi laterali del basket.",
        example: "Lane slides 10 x andata/ritorno, poi zig-zag court, 3 serie totali",
        
        sports: ["basket"],
        best_for: ["agility", "conditioning", "sport_specific"],
        goals: ["difesa", "footwork", "resistenza_laterale"],
        
        min_experience: "beginner",
        min_rpe_tolerance: 6,
        
        phases: ["accumulo", "intensificazione", "in-season"],
        avoid_phases: [],
        
        max_per_workout: 2,
        max_per_week: 4,
        recovery_cost: "medium",
        injury_risk: "low",
        
        drills: [
            "Lane Slides (baseline a baseline)",
            "Zig-Zag Close-out",
            "Mirror Drill (1v1)",
            "Shell Drill (4v4 positioning)"
        ],
        
        contraindications: ["hip_issues", "knee_issues"]
    },

    fast_break_conditioning: {
        name: "Fast Break Conditioning",
        alias: ["contropiede", "transition drills"],
        description: "Allenamento delle transizioni offensive/difensive ad alta intensità.",
        example: "Full court 3v2 continuous, 5min, poi 2min recupero, 3 serie",
        
        sports: ["basket"],
        best_for: ["conditioning", "sport_specific", "speed"],
        goals: ["resistenza_specifica", "transizioni", "velocità"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 8,
        
        phases: ["accumulo", "intensificazione"],
        avoid_phases: ["deload"],
        
        max_per_workout: 1,
        max_per_week: 3,
        recovery_cost: "high",
        injury_risk: "medium",
        
        contraindications: ["cardiovascular_issues", "solo_training"]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // METODOLOGIE SPORT-SPECIFICHE: BOXE 🥊
    // ═══════════════════════════════════════════════════════════════════════

    boxing_circuit: {
        name: "Boxing Circuit",
        alias: ["circuito boxe", "fight circuit", "boxing conditioning"],
        description: "Circuito che simula le richieste energetiche di un round di boxe.",
        example: "3min lavoro (sacco + shadow + corda) + 1min riposo, 6-12 round",
        
        sports: ["boxe", "mma"],
        best_for: ["conditioning", "sport_specific", "endurance"],
        goals: ["resistenza_specifica", "conditioning_pugilato", "fight_fitness"],
        
        min_experience: "beginner",
        min_rpe_tolerance: 7,
        
        phases: ["accumulo", "intensificazione", "fight_camp"],
        avoid_phases: ["deload"],
        
        max_per_workout: 1,
        max_per_week: 3,
        recovery_cost: "high",
        injury_risk: "low",
        
        round_structure: {
            amateur: { work: "3min", rest: "1min", rounds: "6-8" },
            pro: { work: "3min", rest: "1min", rounds: "8-12" },
            conditioning: { work: "2min", rest: "30s", rounds: "10-15" }
        },
        
        stations: [
            "Heavy Bag (combinazioni)",
            "Shadow Boxing (movimento)",
            "Speed Bag / Double End",
            "Jump Rope",
            "Burpees / Mountain Climbers",
            "Core: Russian Twist / Plank"
        ],
        
        contraindications: ["shoulder_issues", "wrist_issues"]
    },

    heavy_bag_intervals: {
        name: "Heavy Bag Intervals",
        alias: ["sacco pesante", "bag work", "heavy bag"],
        description: "Lavoro al sacco con intervalli di alta intensità che simulano scambi durante il match.",
        example: "30s max output + 30s jab leggero, 10 round da 3min",
        
        sports: ["boxe", "mma", "kickboxing"],
        best_for: ["power_endurance", "conditioning", "technique"],
        goals: ["potenza_resistente", "tecnica", "timing"],
        
        min_experience: "beginner",
        min_rpe_tolerance: 7,
        
        phases: ["accumulo", "intensificazione", "fight_camp"],
        avoid_phases: ["deload"],
        
        max_per_workout: 2,
        max_per_week: 5,
        recovery_cost: "medium",
        injury_risk: "low",
        
        protocols: {
            power: { burst: "15s 100%", active_rest: "45s 50%", rounds: 6 },
            endurance: { burst: "30s 90%", active_rest: "30s 50%", rounds: 10 },
            fight_simulation: { burst: "10s 100%", active_rest: "20s 60%", rounds: 12 }
        },
        
        contraindications: ["hand_injury", "shoulder_issues"]
    },

    shadow_boxing_drills: {
        name: "Shadow Boxing Drills",
        alias: ["shadow boxing", "shadow", "tecnica ombra"],
        description: "Lavoro tecnico senza contatto per perfezionare movimenti, footwork e combinazioni.",
        example: "4 x 3min round: R1 jab only, R2 jab-cross, R3 defense, R4 free",
        
        sports: ["boxe", "mma", "kickboxing"],
        best_for: ["technique", "conditioning", "warm_up"],
        goals: ["tecnica", "coordinazione", "footwork"],
        
        min_experience: "beginner",
        min_rpe_tolerance: 4,
        
        phases: ["accumulo", "intensificazione", "fight_camp", "deload", "mantenimento"],
        avoid_phases: [],
        
        max_per_workout: 3,
        max_per_week: 10,
        recovery_cost: "low",
        injury_risk: "very_low",
        
        focus_rounds: {
            footwork: "Solo movimento, niente pugni",
            jab: "Solo jab, focus su estensione e ritorno",
            defense: "Slip, roll, block, senza contrattacco",
            combinations: "2-3-4 colpi in sequenza",
            visualization: "Immaginare avversario, reagire"
        },
        
        contraindications: []
    },

    punch_resistance_training: {
        name: "Punch Resistance Training",
        alias: ["forza pugile", "boxing strength", "combat strength"],
        description: "Allenamento di forza specifico per la potenza del pugno e la catena cinetica.",
        example: "Landmine Press + Med Ball Slam + Rotational Cable, 4 x 6-8",
        
        sports: ["boxe", "mma"],
        best_for: ["power", "rotational_strength", "punch_power"],
        goals: ["potenza_pugno", "forza_rotazionale", "core"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 7,
        
        phases: ["accumulo", "intensificazione"],
        avoid_phases: ["fight_week", "deload"],
        
        max_per_workout: 1,
        max_per_week: 3,
        recovery_cost: "medium",
        injury_risk: "low",
        
        key_exercises: [
            { name: "Landmine Press", why: "simula meccanica del jab/cross" },
            { name: "Med Ball Rotational Throw", why: "potenza rotazionale esplosiva" },
            { name: "Cable Woodchop", why: "forza anti-rotazione" },
            { name: "Pallof Press", why: "stabilità core" },
            { name: "Push-up with rotation", why: "integrazione catena" }
        ],
        
        contraindications: ["shoulder_issues", "core_weakness"]
    },

    neck_strengthening: {
        name: "Neck Strengthening",
        alias: ["rinforzo collo", "neck training", "combat neck"],
        description: "Protocollo di rinforzo del collo per assorbire i colpi e prevenire KO/commozioni.",
        example: "Neck Curl/Extension + Isometric Hold, 3 x 12-15 reps",
        
        sports: ["boxe", "mma", "rugby", "football_americano"],
        best_for: ["injury_prevention", "combat_specific"],
        goals: ["prevenzione_KO", "stabilità_collo", "assorbimento_impatto"],
        
        min_experience: "beginner",
        min_rpe_tolerance: 5,
        
        phases: ["accumulo", "intensificazione", "fight_camp", "mantenimento"],
        avoid_phases: [],
        
        max_per_workout: 1,
        max_per_week: 4,
        recovery_cost: "low",
        injury_risk: "low", // se fatto correttamente
        
        exercises: [
            { name: "Neck Curl (supino)", reps: "15-20", notes: "controllato, no slancio" },
            { name: "Neck Extension (prono)", reps: "15-20", notes: "range ridotto" },
            { name: "Lateral Neck Flexion", reps: "12-15/lato", notes: "isometrico 3s top" },
            { name: "Neck Rotation with band", reps: "10/direzione", notes: "leggero" },
            { name: "Wrestler Bridge", time: "30-60s", notes: "avanzato, supervisionato" }
        ],
        
        contraindications: ["cervical_issues", "neck_injury", "disc_problems"]
    },

    // ═══════════════════════════════════════════════════════════════════════
    // METODOLOGIE SPORT-SPECIFICHE: PALESTRA 🏋️
    // ═══════════════════════════════════════════════════════════════════════

    progressive_overload: {
        name: "Progressive Overload",
        alias: ["sovraccarico progressivo", "linear progression"],
        description: "Aumento sistematico del carico (2.5-5kg) o delle ripetizioni ogni sessione/settimana.",
        example: "Squat: Settimana 1: 80kg x 5, Settimana 2: 82.5kg x 5, Settimana 3: 85kg x 5",
        
        sports: ["palestra", "powerlifting", "bodybuilding"],
        best_for: ["strength", "hypertrophy", "beginner_gains"],
        goals: ["forza", "massa", "progressione"],
        
        min_experience: "beginner",
        min_rpe_tolerance: 6,
        
        phases: ["accumulo", "intensificazione"],
        avoid_phases: ["deload"],
        
        max_per_workout: 6, // tutti gli esercizi principali
        max_per_week: 20,
        recovery_cost: "medium",
        injury_risk: "low",
        
        progression_types: {
            linear: "+2.5kg ogni sessione (beginner)",
            weekly: "+2.5kg ogni settimana (intermediate)",
            double_progression: "aumenta reps prima, poi peso",
            wave_loading: "3 settimane su, 1 deload"
        },
        
        contraindications: []
    },

    rpe_autoregulation: {
        name: "RPE Autoregulation",
        alias: ["autoregolazione RPE", "RIR", "reps in reserve"],
        description: "Selezione del carico basata sulle ripetizioni in riserva (RIR) o RPE percepito.",
        example: "Bench Press 4 x 6 @ RPE 8 (lasci 2 reps in tank)",
        
        sports: ["palestra", "powerlifting"],
        best_for: ["strength", "hypertrophy", "fatigue_management"],
        goals: ["forza", "autogestione", "longevità"],
        
        min_experience: "intermediate", // serve consapevolezza corporea
        min_rpe_tolerance: 7,
        
        phases: ["accumulo", "intensificazione", "peaking"],
        avoid_phases: [],
        
        max_per_workout: 8,
        max_per_week: 25,
        recovery_cost: "medium",
        injury_risk: "low",
        
        rpe_scale: {
            "6": "Peso riscaldamento, molto leggero",
            "7": "Potresti fare 3+ reps in più",
            "8": "Potresti fare 2 reps in più",
            "9": "Potresti fare 1 rep in più",
            "10": "Cedimento muscolare"
        },
        
        contraindications: ["beginner"] // non hanno ancora calibrazione interna
    },

    blood_flow_restriction: {
        name: "BFR - Blood Flow Restriction",
        alias: ["BFR", "occlusione", "kaatsu"],
        description: "Allenamento con fasce che limitano parzialmente il flusso venoso. Ipertrofia con carichi bassi.",
        example: "Leg Extension con BFR: 30-15-15-15 reps, 30s recupero, 30% 1RM",
        
        sports: ["palestra", "bodybuilding", "riabilitazione"],
        best_for: ["hypertrophy", "rehab", "low_load_training"],
        goals: ["massa_muscolare", "riabilitazione", "pump"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 7,
        requires_equipment: ["bfr_bands", "pressure_cuffs"],
        
        phases: ["accumulo", "riabilitazione"],
        avoid_phases: ["peaking"],
        
        max_per_workout: 2,
        max_per_week: 4,
        recovery_cost: "medium",
        injury_risk: "low", // se fatto correttamente
        
        protocol: {
            pressure: "50-80% occlusione arteriosa",
            load: "20-40% 1RM",
            reps: "30-15-15-15",
            rest: "30s tra serie",
            total_time: "max 15-20min con fasce"
        },
        
        contraindications: ["cardiovascular_issues", "hypertension", "blood_clot_history", "pregnancy"]
    },

    german_volume_training: {
        name: "German Volume Training",
        alias: ["GVT", "10x10", "volume tedesco"],
        description: "10 serie da 10 ripetizioni con lo stesso peso. Alto volume per ipertrofia massima.",
        example: "Squat: 10 x 10 @ 60% 1RM, 90s recupero tra serie",
        
        sports: ["palestra", "bodybuilding"],
        best_for: ["hypertrophy", "volume_accumulation"],
        goals: ["massa_muscolare", "volume", "resistenza_muscolare"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 8,
        
        phases: ["accumulo"],
        avoid_phases: ["intensificazione", "peaking", "deload"],
        
        max_per_workout: 1, // solo 1 esercizio in GVT per sessione
        max_per_week: 2,
        recovery_cost: "very_high",
        injury_risk: "medium",
        
        protocol: {
            sets: 10,
            reps: 10,
            load: "60% 1RM",
            rest: "60-90s",
            tempo: "4-0-2-0"
        },
        
        contraindications: ["beginner", "time_limited", "high_fatigue"]
    },

    periodization_daily_undulating: {
        name: "DUP - Daily Undulating Periodization",
        alias: ["DUP", "ondulata", "undulating"],
        description: "Variazione giornaliera di volume/intensità: Giorno 1 forza, Giorno 2 ipertrofia, Giorno 3 potenza.",
        example: "Lun: Squat 5x3@85%, Mer: Squat 4x8@70%, Ven: Squat 6x2@90%",
        
        sports: ["palestra", "powerlifting"],
        best_for: ["strength", "hypertrophy", "variety"],
        goals: ["forza", "massa", "performance"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 7,
        
        phases: ["accumulo", "intensificazione"],
        avoid_phases: ["peaking"], // peaking richiede focus specifico
        
        max_per_workout: 4,
        max_per_week: 12,
        recovery_cost: "medium",
        injury_risk: "low",
        
        structure: {
            strength_day: { sets: "4-6", reps: "2-5", intensity: "80-90%" },
            hypertrophy_day: { sets: "3-4", reps: "8-12", intensity: "65-75%" },
            power_day: { sets: "5-6", reps: "2-3", intensity: "85-95%", note: "esplosivo" }
        },
        
        contraindications: ["beginner"]
    },

    mind_muscle_connection: {
        name: "Mind-Muscle Connection Focus",
        alias: ["MMC", "connessione mente-muscolo", "isolation focus"],
        description: "Esecuzione lenta e controllata con focus sulla contrazione del muscolo target.",
        example: "Cable Fly: 3 x 15, squeeze 2s al picco, concentrati solo sul petto",
        
        sports: ["palestra", "bodybuilding"],
        best_for: ["hypertrophy", "technique", "muscle_activation"],
        goals: ["massa_muscolare", "definizione", "qualità_contrazione"],
        
        min_experience: "beginner",
        min_rpe_tolerance: 5,
        
        phases: ["accumulo", "definizione"],
        avoid_phases: ["peaking"],
        
        max_per_workout: 4,
        max_per_week: 12,
        recovery_cost: "low",
        injury_risk: "very_low",
        
        techniques: [
            "Pausa 2s nel punto di massima contrazione",
            "Tempo 3-1-3-1 per sentire ogni fase",
            "Occhi chiusi per aumentare propriocezione",
            "Toccare il muscolo durante l'esercizio"
        ],
        
        contraindications: []
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 NASA-LEVEL ADVANCED METHODS (2024-2025 Science)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * ECCENTRIC OVERLOAD / FLYWHEEL TRAINING
     * Riferimenti: Maroto-Izquierdo 2024, Tesch 2017, Norrbrand 2008
     * Metodo gold-standard per ipertrofia e prevenzione infortuni
     */
    eccentric_overload: {
        name: "Eccentric Overload",
        alias: ["flywheel training", "accentuated eccentric", "supramaximal eccentric", "eccentrica sovramassimale"],
        description: "Carico eccentrico superiore al concentrico. Con flywheel, partner assist, weight releasers o 2-up/1-down.",
        example: "Leg Curl: concentrica assistita da partner → eccentrica da soli con 120% carico (5s discesa)",
        
        subtypes: {
            flywheel: {
                name: "Flywheel / Isoinerziale",
                description: "Dispositivo che accumula energia cinetica e la restituisce in eccentrica",
                benefit: "Sovraccarico eccentrico automatico, senza spotter",
                example: "kBox Squat: 3x6, massimo sforzo concentrico, resisti in eccentrica",
                equipment_required: "flywheel_device"
            },
            partner_assist: {
                name: "Partner Eccentric",
                description: "Partner aiuta in concentrica, atleta resiste da solo in eccentrica",
                benefit: "Nessuna attrezzatura speciale, sovraccarico ~120-140%",
                example: "Pull-up: partner spinge in salita, 5s discesa controllata"
            },
            weight_releasers: {
                name: "Weight Releasers",
                description: "Ganci che sganciano peso extra in fondo al movimento",
                benefit: "Eccentrica con 110-120% 1RM, concentrica con peso normale",
                example: "Panca piana: 100kg + 20kg releasers, scendono a 100kg in basso"
            },
            two_up_one_down: {
                name: "2-Up / 1-Down",
                description: "Fase concentrica bilaterale, eccentrica unilaterale",
                benefit: "Eccentrica con carico doppio per singolo arto",
                example: "Leg Press: sali con 2 gambe, scendi con 1 gamba (5s)"
            }
        },
        
        science: {
            hypertrophy: "+10-15% vs training tradizionale (Maroto-Izquierdo 2024)",
            strength: "+20% forza eccentrica (Tesch 2017)",
            injury_prevention: "Riduzione infortuni hamstring 51% con Nordic (Mjølsnes 2004)",
            mechanism: "Maggiore tensione meccanica → più sarcomeri in serie"
        },
        
        best_for: ["hypertrophy", "strength", "injury_prevention", "eccentric_strength"],
        goals: ["massa_muscolare", "forza_massimale", "prevenzione_infortuni", "forza_eccentrica"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 8,
        requires_spotter: true, // per la maggior parte dei subtypes
        
        phases: ["intensificazione", "forza"],
        avoid_phases: ["deload", "taper"],
        
        max_per_workout: 2,
        max_per_week: 4,
        recovery_cost: "very_high",
        injury_risk: "medium", // se fatto correttamente = low, altrimenti alto
        
        ideal_muscles: ["hamstrings", "quadriceps", "chest", "lats", "biceps"],
        avoid_muscles: ["lower_back", "rotator_cuff", "neck"],
        
        tempo_prescription: {
            eccentric_duration: "4-6 seconds",
            pause_bottom: "0-1 second",
            concentric: "assisted or explosive",
            note: "Mai rimbalzare in basso"
        },
        
        progressive_protocol: [
            "Settimana 1-2: 2x5 con 110% eccentrica (tempo 4s)",
            "Settimana 3-4: 3x5 con 115% eccentrica (tempo 5s)",
            "Settimana 5-6: 3x4 con 120% eccentrica (tempo 6s)",
            "Settimana 7: Deload - tornare a concentrico normale"
        ],
        
        contraindications: ["tendinopathy_acute", "muscle_strain", "beginner", "high_fatigue"]
    },

    /**
     * VELOCITY BASED TRAINING (VBT)
     * Riferimenti: Mann 2016, Jovanovic 2014, Banyard 2019
     * Autoregolazione basata sulla velocità del movimento
     */
    velocity_based_training: {
        name: "Velocity Based Training (VBT)",
        alias: ["VBT", "autoregolazione velocità", "velocity zones", "bar speed training"],
        description: "Selezione carico e volume basata sulla velocità del bilanciere. Dispositivo o video-analisi.",
        example: "Squat: obiettivo 0.6-0.8 m/s, se scendi sotto 0.6 m/s → ferma la serie",
        
        velocity_zones: {
            absolute_strength: {
                range: "< 0.35 m/s",
                intensity: "90-100% 1RM",
                focus: "Forza massimale",
                reps_typical: "1-3",
                use_case: "Peaking, test 1RM"
            },
            accelerative_strength: {
                range: "0.35-0.60 m/s",
                intensity: "80-90% 1RM",
                focus: "Forza-velocità",
                reps_typical: "3-5",
                use_case: "Fase intensificazione"
            },
            strength_speed: {
                range: "0.60-0.80 m/s",
                intensity: "60-80% 1RM",
                focus: "Velocità-forza",
                reps_typical: "4-6",
                use_case: "Potenza, sport"
            },
            speed_strength: {
                range: "0.80-1.00 m/s",
                intensity: "40-60% 1RM",
                focus: "Potenza veloce",
                reps_typical: "3-5",
                use_case: "Esplosività, sport"
            },
            starting_strength: {
                range: "> 1.00 m/s",
                intensity: "30-40% 1RM",
                focus: "Velocità pura",
                reps_typical: "3-5",
                use_case: "Balistici, accelerazione"
            }
        },
        
        velocity_stops: {
            explanation: "Ferma serie quando velocità scende sotto soglia (velocity loss)",
            loss_10_percent: "Volume 6-8 reps → meno fatica, più qualità",
            loss_20_percent: "Volume 8-12 reps → bilanciato",
            loss_30_percent: "Volume 12+ reps → più fatica, ipertrofia",
            recommendation: "Usa 20% loss per bilanciare volume e qualità"
        },
        
        daily_readiness: {
            explanation: "La velocità del primo rep indica lo stato dell'atleta",
            protocol: "Fai warm-up set a 70%, misura velocità",
            fast_day: "Velocità > media = CNS fresco → allenati pesante",
            slow_day: "Velocità < media = CNS affaticato → riduci carico 5-10%"
        },
        
        science: {
            autoregulation: "Superiore a % fissi per forza e potenza (Banyard 2019)",
            fatigue_management: "Riduce overreaching del 40% (Jovanovic 2014)",
            performance_peak: "Migliora timing del peak (Mann 2016)"
        },
        
        equipment_required: ["velocity_tracker", "linear_encoder", "camera_analysis"],
        equipment_alternatives: ["GymAware", "PUSH Band", "Tendo", "OpenBarbell", "Video 60fps"],
        
        best_for: ["power", "strength", "autoregulation", "sport_performance"],
        goals: ["forza_massimale", "potenza", "performance_sportiva", "autoregolazione"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 6,
        
        phases: ["intensificazione", "peaking", "in-season"],
        avoid_phases: ["accumulo"], // nell'accumulo serve volume, VBT taglia volume
        
        max_per_workout: 3, // 3 esercizi principali con VBT
        max_per_week: 9,
        recovery_cost: "medium", // perché autoregola e previene overreaching
        injury_risk: "low",
        
        ideal_exercises: ["squat", "bench_press", "deadlift", "clean", "snatch", "push_press"],
        avoid_exercises: ["isolation", "cables", "machines"], // difficile misurare velocità
        
        contraindications: ["no_equipment", "isolation_only"]
    },

    /**
     * LENGTHENED PARTIALS / STRETCH TRAINING
     * Riferimenti: Pedrosa 2024, Wolf 2024, Schoenfeld 2024
     * Allenamento nella porzione allungata del ROM per massima ipertrofia
     */
    lengthened_partials: {
        name: "Lengthened Partials",
        alias: ["stretch partials", "bottom partials", "partials allungati"],
        description: "Serie nella porzione allungata (stretched) del movimento. ROM parziale ma in stretch.",
        example: "Preacher Curl: solo porzione bassa (0-60°), dove bicipite è in stretch, 3x12",
        
        science: {
            hypertrophy: "+30% vs ROM completo per alcuni muscoli (Pedrosa 2024)",
            mechanism: "Massima tensione in posizione allungata → più sarcomeri in parallelo",
            muscles_responding: "Tricipiti, bicipiti, quadricipiti, polpacci risposta migliore"
        },
        
        protocols: {
            full_lengthened: {
                name: "Full Lengthened ROM",
                description: "Movimento solo nella metà allungata",
                rom: "0-50% del ROM totale",
                example: "Leg Extension: da ginocchio flesso a metà estensione"
            },
            stretch_pause: {
                name: "Stretch Pause",
                description: "Pausa 2-3s nel punto di massimo stretch",
                benefit: "Tempo sotto tensione in stretch",
                example: "Fly: pausa 2s con braccia aperte"
            },
            loaded_stretch: {
                name: "Loaded Stretch",
                description: "Mantenere posizione stretch sotto carico",
                duration: "30-60 secondi",
                example: "Hanging from bar per lats, 45s"
            }
        },
        
        best_for: ["hypertrophy", "flexibility", "muscle_lengthening"],
        goals: ["massa_muscolare", "ipertrofia_selettiva", "flessibilità"],
        
        min_experience: "intermediate",
        min_rpe_tolerance: 7,
        
        phases: ["accumulo", "ipertrofia"],
        avoid_phases: ["peaking"], // nel peaking serve ROM completo per sport
        
        max_per_workout: 3,
        max_per_week: 9,
        recovery_cost: "high", // stretch = più DOMS
        injury_risk: "medium", // se eseguito male in stretch = rischio
        
        ideal_muscles: ["triceps", "biceps", "quadriceps", "calves", "chest"],
        avoid_muscles: ["lower_back", "rotator_cuff"], // non fare stretch partials
        
        contraindications: ["muscle_strain", "flexibility_issues", "beginner"]
    },

    /**
     * BLOOD FLOW RESTRICTION (BFR / KAATSU)
     * Riferimenti: Loenneke 2022, Patterson 2019
     * Bassa intensità + restrizione flusso = ipertrofia
     */
    blood_flow_restriction: {
        name: "Blood Flow Restriction (BFR)",
        alias: ["BFR", "KAATSU", "occlusion training", "training occlusivo"],
        description: "Fascia elastica stringe l'arto prossimalmente. 20-30% 1RM, alto rep, massima crescita.",
        example: "Curl con BFR: 30% 1RM, 30-15-15-15 reps, 30s riposo tra serie",
        
        science: {
            hypertrophy: "Pari a 70% 1RM tradizionale (Loenneke 2022)",
            mechanism: "Accumulo metaboliti + reclutamento fibre tipo II prematuramente",
            safety: "Sicuro se pressione < 80% AOP (Patterson 2019)",
            rehab: "Gold standard per riabilitazione post-chirurgica"
        },
        
        protocols: {
            standard: {
                name: "Protocollo Standard",
                sets: "4 serie",
                reps: "30-15-15-15",
                rest: "30 secondi",
                load: "20-30% 1RM"
            },
            practical: {
                name: "Protocollo Pratico",
                sets: "3-4 serie",
                reps: "15-30 per serie",
                rest: "30-60 secondi",
                load: "20-40% 1RM"
            }
        },
        
        cuff_placement: {
            arms: "Alta sull'omero, sotto deltoide",
            legs: "Alta sulla coscia, vicino all'inguine",
            pressure: "5-7 su scala 1-10 (non dolore, pressione)",
            width: "5-8cm ideale"
        },
        
        best_for: ["hypertrophy", "rehab", "deload", "injury_prevention"],
        goals: ["massa_muscolare", "riabilitazione", "mantenimento_infortunio"],
        
        min_experience: "beginner", // sicuro anche per principianti
        min_rpe_tolerance: 5,
        
        phases: ["accumulo", "deload", "riabilitazione"],
        avoid_phases: ["peaking"], // non serve per forza massimale
        
        max_per_workout: 3,
        max_per_week: 9,
        recovery_cost: "low", // paradossalmente bassa intensità
        injury_risk: "very_low", // se fatto correttamente
        
        ideal_muscles: ["biceps", "triceps", "quadriceps", "hamstrings", "calves"],
        avoid_muscles: ["core", "back"], // difficile applicare BFR
        
        contraindications: ["cardiovascular_issues", "blood_clotting", "varicose_veins", "pregnancy"]
    },

    /**
     * CLUSTER SETS AVANZATI
     * Riferimenti: Tufano 2017, Haff 2008
     * Inter-rep rest per mantenere qualità del movimento
     */
    cluster_advanced: {
        name: "Advanced Cluster Sets",
        alias: ["cluster avanzati", "rest-pause cluster", "inter-rep rest"],
        description: "Pause intra-serie per ricaricare ATP e mantenere velocità/potenza su ogni rep.",
        example: "Squat: 5x(2+2+2) con 85%, 15s tra cluster, 3min tra serie complete",
        
        cluster_protocols: {
            power_cluster: {
                name: "Power Cluster",
                structure: "6 x 1 rep, 15-20s rest tra reps",
                load: "80-90% 1RM",
                goal: "Mantenere velocità massima su ogni rep",
                use: "Sport di potenza"
            },
            strength_cluster: {
                name: "Strength Cluster",
                structure: "4 x (2+2), 15s intra, 3min inter",
                load: "85-92% 1RM",
                goal: "Volume a intensità alte",
                use: "Powerlifting, forza"
            },
            hypertrophy_cluster: {
                name: "Hypertrophy Cluster",
                structure: "3 x (5+5), 10s intra, 90s inter",
                load: "70-75% 1RM",
                goal: "Volume senza calo qualità",
                use: "Bodybuilding"
            }
        },
        
        science: {
            power_output: "+20% vs serie tradizionali (Tufano 2017)",
            volume_quality: "Più reps di qualità a carichi alti",
            fatigue_management: "Meno fatica neuromuscolare vs serie continue"
        },
        
        best_for: ["power", "strength", "quality_volume"],
        goals: ["potenza", "forza_massimale", "performance"],
        
        min_experience: "advanced",
        min_rpe_tolerance: 7,
        
        phases: ["intensificazione", "peaking"],
        avoid_phases: ["deload"],
        
        max_per_workout: 2,
        max_per_week: 4,
        recovery_cost: "medium",
        injury_risk: "low",
        
        ideal_exercises: ["squat", "bench", "deadlift", "clean", "snatch"],
        avoid_exercises: ["isolation", "cables"],
        
        contraindications: ["beginner", "time_limited"]
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// LOGICA DI SELEZIONE METODOLOGIE
// ═══════════════════════════════════════════════════════════════════════════

const MethodSelector = {

    /**
     * Seleziona metodologie appropriate per il contesto
     * @param {Object} context - Contesto atleta
     * @returns {Array} Lista metodologie raccomandate con priorità
     */
    selectMethods(context) {
        const {
            goal,           // "forza" | "massa" | "definizione" | "performance"
            phase,          // "accumulo" | "intensificazione" | "peaking" | "deload"
            experience,     // "beginner" | "intermediate" | "advanced"
            fatigue,        // 1-10
            time_available, // minuti
            equipment,      // ["barbell", "dumbbells", "cables", "machines", ...]
            sport,          // "calcio" | "boxe" | "basket" | "palestra"
            pain_areas,     // ["lower_back", "shoulder", ...]
            rpe_tolerance   // 1-10, quanto può spingersi
        } = context;

        const recommendations = [];

        for (const [key, method] of Object.entries(TRAINING_METHODS)) {
            const score = this.scoreMethod(method, context);
            if (score > 0) {
                recommendations.push({
                    key,
                    method,
                    score,
                    reason: this.explainChoice(method, context)
                });
            }
        }

        // Ordina per score e ritorna top 5
        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    },

    /**
     * Calcola score di una metodologia per il contesto
     */
    scoreMethod(method, context) {
        let score = 50; // base

        // Sport-specific methods get HUGE bonus if they match
        if (method.sports && Array.isArray(method.sports)) {
            if (method.sports.includes(context.sport)) {
                score += 50; // sport-specific method for this sport
            } else {
                score -= 30; // sport-specific but wrong sport
            }
        }

        // Goal match (+30)
        const goalMap = {
            forza: ["strength", "power"],
            massa: ["hypertrophy"],
            definizione: ["conditioning", "fat_loss", "muscle_endurance"],
            performance: ["power", "sport_performance", "conditioning", "agility", "speed_endurance"]
        };
        const targetBestFor = goalMap[context.goal] || [];
        if (method.best_for?.some(b => targetBestFor.includes(b))) {
            score += 30;
        }

        // Phase match (+20 o -100)
        if (method.phases?.includes(context.phase)) {
            score += 20;
        }
        if (method.avoid_phases?.includes(context.phase)) {
            return 0; // escludi completamente
        }

        // Experience check (-100 se non qualificato)
        const expLevels = { beginner: 1, intermediate: 2, advanced: 3 };
        const minExp = expLevels[method.min_experience] || 1;
        const userExp = expLevels[context.experience] || 1;
        if (userExp < minExp) {
            return 0; // troppo avanzato
        }
        if (userExp > minExp) {
            score += 10; // bonus esperienza
        }

        // Fatigue check
        if (context.fatigue >= 7 && method.recovery_cost === "high") {
            score -= 30;
        }
        if (context.fatigue >= 8 && method.recovery_cost === "very_high") {
            return 0; // troppo stanco
        }

        // Time efficiency bonus
        if (context.time_available < 45 && method.time_saving) {
            score += method.time_saving * 30;
        }

        // RPE tolerance check
        if (context.rpe_tolerance < method.min_rpe_tolerance) {
            score -= 20;
        }

        // Pain areas check
        if (context.pain_areas?.length > 0 && method.contraindications) {
            if (method.contraindications.includes("joint_pain")) {
                score -= 40;
            }
            // Check specific pain areas
            for (const pain of context.pain_areas) {
                if (method.contraindications.includes(`${pain}_issues`)) {
                    score -= 50;
                }
            }
        }

        // Sport-specific bonus (legacy support for sport_applications)
        if (method.sport_applications?.[context.sport]) {
            score += 15;
        }

        // Injury prevention bonus for sports
        if (method.fifa_11_protocol && (context.sport === 'calcio' || context.sport === 'basket')) {
            score += 25;
        }
        
        // 🧠 INTELLIGENZA AVANZATA: Età
        if (context.age) {
            if (context.age > 50) {
                // Over 50: preferisci metodologie a basso impatto
                if (method.recovery_cost === "very_high" || method.recovery_cost === "high") {
                    score -= 25;
                }
                // Bonus per metodologie sicure
                if (method.name?.toLowerCase().includes('tempo') || 
                    method.name?.toLowerCase().includes('iso') ||
                    method.recovery_cost === "low") {
                    score += 15;
                }
            }
            if (context.age > 60) {
                // Over 60: escludi metodologie ad alto rischio
                const riskyMethods = ['cluster', 'gvt', 'tabata', 'plyometric'];
                if (riskyMethods.some(rm => method.name?.toLowerCase().includes(rm))) {
                    return 0;
                }
            }
        }
        
        // 🧠 INTELLIGENZA AVANZATA: Peso corporeo
        if (context.weight) {
            if (context.weight > 100) {
                // Atleti pesanti: meno jump/plyometrics
                if (method.name?.toLowerCase().includes('plyo') ||
                    method.name?.toLowerCase().includes('jump') ||
                    method.name?.toLowerCase().includes('tabata')) {
                    score -= 20;
                }
            }
            if (context.weight < 60) {
                // Atleti leggeri: bonus per metodologie esplosive
                if (method.best_for?.includes('power') ||
                    method.best_for?.includes('speed')) {
                    score += 10;
                }
            }
        }
        
        // 🧠 INTELLIGENZA AVANZATA: Tipo sessione
        if (context.sessionType) {
            const sessionMethodMatch = {
                'strength': ['cluster', 'contrast_training', 'rest_pause'],
                'power': ['contrast_training', 'plyometric', 'cluster'],
                'hypertrophy': ['drop_set', 'myo_reps', 'giant_set', 'superset'],
                'conditioning': ['circuit', 'emom', 'tabata'],
                'technique': [], // nessuna metodologia intensa per tecnica
                'recovery': [] // nessuna metodologia per recovery
            };
            
            const preferredMethods = sessionMethodMatch[context.sessionType] || [];
            if (preferredMethods.some(pm => method.key === pm || method.name?.toLowerCase().includes(pm))) {
                score += 25;
            }
            
            // Escludi metodologie intensive per sessioni tecniche o di recupero
            if ((context.sessionType === 'technique' || context.sessionType === 'recovery') &&
                (method.recovery_cost === "high" || method.recovery_cost === "very_high")) {
                return 0;
            }
        }
        
        // 🧠 INTELLIGENZA AVANZATA: Week number (periodizzazione)
        if (context.weekNumber) {
            // Deload week (ogni 4 settimane): preferisci metodologie a basso volume
            if (context.weekNumber % 4 === 0) {
                if (method.recovery_cost === "high" || method.recovery_cost === "very_high") {
                    score -= 30;
                }
                if (method.time_saving) {
                    score += 20;
                }
            }
            // Intensification weeks (2-3): bonus per metodologie intense
            if (context.weekNumber % 4 === 2 || context.weekNumber % 4 === 3) {
                if (method.best_for?.includes('strength') || method.best_for?.includes('power')) {
                    score += 15;
                }
            }
        }
        
        // 🧠 INTELLIGENZA AVANZATA: CNS state
        if (context.cnsState) {
            if (context.cnsState === 'depleted' || context.cnsState === 'fatigued') {
                if (method.recovery_cost === "high" || method.recovery_cost === "very_high") {
                    return 0; // escludi completamente
                }
            }
            if (context.cnsState === 'fresh') {
                // CNS fresco: bonus per metodologie intense
                if (method.recovery_cost === "high" || method.recovery_cost === "very_high") {
                    score += 15;
                }
            }
        }

        return Math.max(0, score);
    },

    /**
     * Spiega perché una metodologia è stata scelta
     */
    explainChoice(method, context) {
        const reasons = [];

        // Sport-specific reason
        if (method.sports?.includes(context.sport)) {
            reasons.push(`specifico per ${context.sport}`);
        }

        if (method.phases?.includes(context.phase)) {
            reasons.push(`ideale per fase ${context.phase}`);
        }

        if (method.time_saving && context.time_available < 45) {
            reasons.push(`risparmia ${Math.round(method.time_saving * 100)}% tempo`);
        }

        if (method.sport_applications?.[context.sport]) {
            reasons.push(`ottimo per ${context.sport}`);
        }

        if (context.goal === "definizione" && method.cardiovascular_benefit === "high") {
            reasons.push("alto impatto cardiovascolare");
        }

        if (method.fifa_11_protocol) {
            reasons.push("protocollo FIFA 11+ (evidence-based)");
        }

        if (method.evidence_level === "high") {
            reasons.push("alta evidenza scientifica");
        }

        return reasons.join(", ") || "adatto al profilo";
    },

    /**
     * Genera testo prompt per AI con metodologie suggerite
     */
    generatePromptSection(recommendations) {
        if (!recommendations || recommendations.length === 0) {
            return "";
        }

        let text = "\n� METODOLOGIE OBBLIGATORIE (DEVI usarne 1-2 per workout):\n";

        for (const rec of recommendations.slice(0, 3)) {
            text += `\n• ${rec.method.name}: ${rec.method.description}`;
            text += `\n  Esempio ESATTO da seguire: ${rec.method.example}`;
            text += `\n  Motivo: ${rec.reason}`;
            text += `\n  LIMITE ASSOLUTO: max ${rec.method.max_per_workout} esercizi/workout\n`;
        }

        text += "\n⛔ REGOLE VINCOLANTI (NON IGNORARE):";
        text += "\n- DEVI usare almeno 1 metodologia dalla lista sopra";
        text += "\n- VIETATO usare più di 2 metodologie intense nello stesso workout";
        text += "\n- Se fatica >= 7/10: VIETATO drop set, rest-pause, cluster. Usa solo serie tradizionali";
        text += "\n- OBBLIGATORIO indicare la metodologia nel nome (es: '(superset)', '(drop set)')";
        text += "\n- OBBLIGATORIO usare notazione A1/A2 per superset";

        return text;
    }
};

// Export per uso browser
window.TRAINING_METHODS = TRAINING_METHODS;
window.MethodSelector = MethodSelector;
