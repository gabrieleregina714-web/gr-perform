/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧬 ATLAS PRINCIPLES DATABASE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Database completo di TUTTI i principi scientifici dell'allenamento.
 * Questo è il "cervello" di ATLAS - la conoscenza accumulata della scienza sportiva.
 * 
 * Ogni principio include:
 * - name: Nome del principio
 * - description: Spiegazione scientifica
 * - application: Come applicarlo in pratica
 * - sports: Sport dove è più rilevante
 * - priority: 1-10 (quanto è fondamentale)
 * - validation: Come verificare se è rispettato
 */

window.ATLASPrinciples = {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔬 PRINCIPI FISIOLOGICI FONDAMENTALI
    // ═══════════════════════════════════════════════════════════════════════════
    
    fundamental: {
        SAID: {
            name: 'Specific Adaptation to Imposed Demands',
            description: 'Il corpo si adatta SPECIFICAMENTE allo stress imposto. Se vuoi diventare forte, allena la forza. Se vuoi resistenza, allena la resistenza.',
            application: 'Gli esercizi devono essere specifici per lo sport e l\'obiettivo dell\'atleta',
            sports: ['all'],
            priority: 10,
            validation: (workout, profile) => {
                // Verifica che gli esercizi siano specifici per lo sport
                return { score: 0, msg: '' }; // Implementato altrove
            }
        },
        
        supercompensation: {
            name: 'Supercompensazione',
            description: 'Dopo uno stress adeguato + recupero sufficiente, il corpo si adatta a un livello SUPERIORE a prima.',
            application: 'Programmare recupero adeguato tra sessioni simili (48-72h muscoli grandi)',
            sports: ['all'],
            priority: 10,
            recoveryHours: {
                small_muscle: 24,  // bicipiti, tricipiti, spalle, polpacci
                medium_muscle: 48, // petto, schiena, quadricipiti
                large_muscle: 72,  // hamstring, glutes, lower back
                cns: 48            // dopo lavoro pesante/esplosivo
            }
        },
        
        progressive_overload: {
            name: 'Sovraccarico Progressivo',
            description: 'Per continuare a migliorare, lo stimolo deve aumentare nel tempo.',
            application: 'Aumentare peso, reps, sets, o diminuire recupero progressivamente',
            sports: ['all'],
            priority: 10,
            methods: ['increase_weight', 'increase_reps', 'increase_sets', 'decrease_rest', 'increase_ROM', 'increase_tempo']
        },
        
        reversibility: {
            name: 'Reversibilità (Use It or Lose It)',
            description: 'Gli adattamenti si perdono se lo stimolo viene rimosso.',
            application: 'Mantenere frequenza minima anche in periodi di scarico',
            sports: ['all'],
            priority: 8,
            detraining_rates: {
                strength: '2 weeks', // inizia a calare
                power: '1 week',
                endurance: '1-2 weeks',
                flexibility: '1 week'
            }
        },
        
        variability: {
            name: 'Variabilità degli Stimoli',
            description: 'Il corpo si adatta e smette di rispondere a stimoli identici.',
            application: 'Variare esercizi, angoli, tempi ogni 3-6 settimane',
            sports: ['all'],
            priority: 7
        },
        
        individuality: {
            name: 'Individualità',
            description: 'Ogni atleta risponde diversamente agli stessi stimoli.',
            application: 'Personalizzare volume, intensità, esercizi per l\'individuo',
            sports: ['all'],
            priority: 9,
            factors: ['genetics', 'training_age', 'recovery_capacity', 'stress_levels', 'sleep', 'nutrition']
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 PRINCIPI DI VOLUME E INTENSITÀ
    // ═══════════════════════════════════════════════════════════════════════════
    
    volume_intensity: {
        MRV: {
            name: 'Maximum Recoverable Volume',
            description: 'Il volume MASSIMO da cui un atleta può recuperare in una settimana.',
            application: 'Non superare MRV per evitare overtraining',
            sports: ['palestra', 'all'],
            priority: 9,
            guidelines: {
                beginner: { sets_per_muscle_week: '10-12' },
                intermediate: { sets_per_muscle_week: '12-18' },
                advanced: { sets_per_muscle_week: '18-25' },
                elite: { sets_per_muscle_week: '20-30' }
            }
        },
        
        MEV: {
            name: 'Minimum Effective Volume',
            description: 'Il volume MINIMO necessario per stimolare adattamento.',
            application: 'Non scendere sotto MEV altrimenti non c\'è progresso',
            sports: ['palestra', 'all'],
            priority: 8,
            guidelines: {
                maintenance: { sets_per_muscle_week: '6-8' },
                growth: { sets_per_muscle_week: '10+' }
            }
        },
        
        MAV: {
            name: 'Maximum Adaptive Volume',
            description: 'Il volume OTTIMALE per massimizzare adattamento con minimo rischio.',
            application: 'Stare nel range MAV per la maggior parte del mesociclo',
            sports: ['palestra', 'all'],
            priority: 9
        },
        
        RIR: {
            name: 'Reps In Reserve',
            description: 'Quante ripetizioni potresti ancora fare prima del cedimento.',
            application: 'La maggior parte del lavoro a 2-3 RIR, picchi a 0-1 RIR',
            sports: ['palestra'],
            priority: 8,
            guidelines: {
                hypertrophy: '1-3 RIR',
                strength: '2-4 RIR',
                power: '3-5 RIR (qualità > fatica)',
                endurance: '2-4 RIR'
            }
        },
        
        RPE: {
            name: 'Rate of Perceived Exertion',
            description: 'Scala 1-10 di sforzo percepito.',
            application: 'Autoregolazione dell\'intensità basata su come ti senti',
            sports: ['all'],
            priority: 7,
            scale: {
                6: 'Molto facile, potrei fare molte altre reps',
                7: 'Facile, potrei fare 3+ reps in più',
                8: 'Moderato, potrei fare 2 reps in più',
                9: 'Difficile, potrei fare 1 rep in più',
                10: 'Massimale, cedimento'
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📅 PRINCIPI DI PERIODIZZAZIONE
    // ═══════════════════════════════════════════════════════════════════════════
    
    periodization: {
        linear: {
            name: 'Periodizzazione Lineare',
            description: 'Aumento progressivo intensità, diminuzione volume nel tempo.',
            application: 'Adatta per principianti e preparazione forza massimale',
            sports: ['palestra', 'powerlifting'],
            priority: 7,
            phases: ['accumulation_high_volume', 'transmutation_moderate', 'realization_high_intensity']
        },
        
        undulating: {
            name: 'Periodizzazione Ondulata (DUP)',
            description: 'Variazione giornaliera/settimanale di volume e intensità.',
            application: 'Adatta per atleti intermedi+, mantiene più qualità contemporaneamente',
            sports: ['all'],
            priority: 8,
            example: {
                day1: 'Heavy (3-5 reps)',
                day2: 'Light (12-15 reps)', 
                day3: 'Moderate (6-10 reps)'
            }
        },
        
        block: {
            name: 'Periodizzazione a Blocchi',
            description: 'Fasi concentrate su 1-2 qualità alla volta.',
            application: 'Per atleti avanzati che necessitano stimoli concentrati',
            sports: ['all'],
            priority: 7,
            blocks: {
                accumulation: { duration: '3-4 weeks', focus: 'volume, work capacity' },
                transmutation: { duration: '2-3 weeks', focus: 'strength, intensity' },
                realization: { duration: '1-2 weeks', focus: 'peaking, competition' }
            }
        },
        
        conjugate: {
            name: 'Metodo Coniugato',
            description: 'Sviluppa più qualità contemporaneamente con variazione frequente.',
            application: 'Max Effort + Dynamic Effort + Repetition',
            sports: ['powerlifting', 'football'],
            priority: 6
        },
        
        tapering: {
            name: 'Tapering',
            description: 'Riduzione progressiva del volume pre-competizione mantenendo intensità.',
            application: 'Ridurre volume 40-60%, mantenere intensità, 1-3 settimane pre-gara',
            sports: ['all'],
            priority: 9,
            guidelines: {
                volume_reduction: '40-60%',
                intensity: 'maintain or slight increase',
                duration: '1-3 weeks',
                frequency: 'maintain'
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧠 PRINCIPI NEURALI
    // ═══════════════════════════════════════════════════════════════════════════
    
    neural: {
        henneman: {
            name: 'Henneman Size Principle',
            description: 'Le unità motorie piccole (Type I) si attivano prima, le grandi (Type II) dopo.',
            application: 'Per attivare tutte le fibre: carichi pesanti o ripetizioni a cedimento',
            sports: ['all'],
            priority: 8
        },
        
        rate_coding: {
            name: 'Rate Coding',
            description: 'La forza aumenta aumentando la frequenza di scarica dei motoneuroni.',
            application: 'Allenamento esplosivo migliora rate coding',
            sports: ['all'],
            priority: 7
        },
        
        PAP: {
            name: 'Post-Activation Potentiation',
            description: 'Dopo un esercizio pesante, la potenza esplosiva aumenta temporaneamente.',
            application: 'Squat pesante → aspetta 3-5 min → salto verticale migliorato',
            sports: ['basket', 'volley', 'atletica'],
            priority: 8,
            protocol: {
                heavy_exercise: '85-95% 1RM, 1-3 reps',
                rest: '3-7 minutes',
                explosive_exercise: 'jumps, throws, sprints'
            }
        },
        
        bilateral_deficit: {
            name: 'Deficit Bilaterale',
            description: 'La forza di 2 arti insieme è < della somma delle forze singole.',
            application: 'Includere lavoro unilaterale per massimizzare forza totale',
            sports: ['all'],
            priority: 7
        },
        
        autogenic_inhibition: {
            name: 'Inibizione Autogena',
            description: 'I Golgi Tendon Organs limitano la forza per proteggere i tendini.',
            application: 'L\'allenamento riduce questa inibizione, permettendo più forza',
            sports: ['powerlifting', 'palestra'],
            priority: 6
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ⚡ SISTEMI ENERGETICI
    // ═══════════════════════════════════════════════════════════════════════════
    
    energy_systems: {
        ATP_CP: {
            name: 'Sistema Fosfageno (ATP-CP)',
            description: 'Energia immediata per 0-10 secondi di lavoro massimale.',
            application: 'Sprint, salti, alzate singole pesanti',
            sports: ['all'],
            priority: 9,
            training: {
                work_duration: '5-10 seconds',
                rest_ratio: '1:12 to 1:20',
                recovery: 'full recovery between sets'
            }
        },
        
        glycolytic: {
            name: 'Sistema Glicolitico (Lattacido)',
            description: 'Energia per 10 secondi - 2 minuti di lavoro intenso.',
            application: 'Interval training, round di boxe, repeated sprints',
            sports: ['calcio', 'basket', 'boxe'],
            priority: 9,
            training: {
                work_duration: '20-90 seconds',
                rest_ratio: '1:3 to 1:5',
                accumulates_lactate: true
            }
        },
        
        aerobic: {
            name: 'Sistema Aerobico',
            description: 'Energia per lavoro >2 minuti, utilizza ossigeno.',
            application: 'Base di condizionamento, recupero tra sforzi',
            sports: ['calcio', 'basket', 'ciclismo'],
            priority: 8,
            training: {
                work_duration: '>2 minutes',
                intensity: '60-85% HRmax',
                improves_recovery: true
            }
        },
        
        EPOC: {
            name: 'Excess Post-Exercise Oxygen Consumption',
            description: 'Consumo di ossigeno elevato dopo l\'esercizio.',
            application: 'HIIT causa EPOC maggiore = più calorie post-workout',
            sports: ['all'],
            priority: 6
        },
        
        anaerobic_threshold: {
            name: 'Soglia Anaerobica',
            description: 'Intensità sopra la quale il lattato si accumula più velocemente di quanto viene smaltito.',
            application: 'Allenarsi a/vicino alla soglia migliora la capacità di lavorare ad alta intensità',
            sports: ['calcio', 'ciclismo', 'running'],
            priority: 8
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏋️ PRINCIPI BIOMECCANICI
    // ═══════════════════════════════════════════════════════════════════════════
    
    biomechanics: {
        force_velocity: {
            name: 'Curva Forza-Velocità',
            description: 'Forza e velocità sono inversamente proporzionali. Non puoi avere massima forza E massima velocità.',
            application: 'Allenare tutto lo spettro: pesante (forza), moderato (potenza), leggero (velocità)',
            sports: ['all'],
            priority: 9,
            zones: {
                max_strength: { load: '>85% 1RM', velocity: 'slow' },
                strength_speed: { load: '70-85% 1RM', velocity: 'moderate' },
                power: { load: '30-70% 1RM', velocity: 'fast' },
                speed_strength: { load: '<30% 1RM', velocity: 'max' }
            }
        },
        
        force_length: {
            name: 'Curva Forza-Lunghezza',
            description: 'Il muscolo produce forza diversa a diverse lunghezze. C\'è una lunghezza ottimale.',
            application: 'Allenare il muscolo in posizioni diverse (lengthened e shortened)',
            sports: ['palestra'],
            priority: 8
        },
        
        kinetic_chain: {
            name: 'Catena Cinetica',
            description: 'La forza si trasferisce da un segmento all\'altro in sequenza.',
            application: 'Potenza parte dal core/anche → si trasferisce agli arti',
            sports: ['boxe', 'tennis', 'baseball'],
            priority: 8
        },
        
        proximal_stability: {
            name: 'Stabilità Prossimale',
            description: 'Gli arti possono essere potenti solo se il core è stabile.',
            application: 'Core training non solo per estetica ma per performance',
            sports: ['all'],
            priority: 9
        },
        
        length_tension: {
            name: 'Relazione Lunghezza-Tensione',
            description: 'Il muscolo genera tensione diversa a diverse lunghezze.',
            application: 'Lengthened training per ipertrofia, shortened per contrazione',
            sports: ['palestra'],
            priority: 8,
            positions: {
                lengthened: 'Più tensione meccanica, più danno muscolare, più ipertrofia',
                shortened: 'Più stress metabolico, pump, connessione mente-muscolo'
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🛡️ PRINCIPI DI PREVENZIONE INFORTUNI
    // ═══════════════════════════════════════════════════════════════════════════
    
    injury_prevention: {
        HQ_ratio: {
            name: 'Hamstring:Quadriceps Ratio',
            description: 'Rapporto di forza tra posteriore e anteriore coscia.',
            application: 'Ideale H:Q = 0.6-0.8. Se più basso, rischio hamstring aumenta.',
            sports: ['calcio', 'basket', 'atletica'],
            priority: 10,
            assessment: 'Isokinetic testing or Nordic/Leg Extension comparison',
            target_ratio: 0.6 // minimo
        },
        
        bilateral_asymmetry: {
            name: 'Asimmetria Bilaterale',
            description: 'Differenza di forza tra lato destro e sinistro.',
            application: 'Mantenere differenza <10-15%. Oltre = rischio infortunio.',
            sports: ['all'],
            priority: 9,
            max_difference: 0.15 // 15%
        },
        
        nordic_protocol: {
            name: 'Protocollo Nordic Hamstring',
            description: 'Nordic curl riduce infortuni hamstring del 50-70%.',
            application: 'Includere Nordic curl 2-3x/settimana per atleti a rischio',
            sports: ['calcio', 'basket', 'atletica'],
            priority: 10,
            protocol: {
                frequency: '2-3x per week',
                volume: '3-4 sets x 4-6 reps',
                progression: 'increase ROM over time'
            }
        },
        
        copenhagen_protocol: {
            name: 'Protocollo Copenhagen Adductors',
            description: 'Esercizio per adduttori che riduce infortuni inguinali.',
            application: 'Includere per sport con cambi direzione frequenti',
            sports: ['calcio', 'hockey', 'basket'],
            priority: 9
        },
        
        ACL_prevention: {
            name: 'Prevenzione LCA',
            description: 'Programmi per ridurre rischio rottura legamento crociato anteriore.',
            application: 'Landing mechanics, single-leg strength, deceleration training',
            sports: ['calcio', 'basket', 'volley'],
            priority: 10,
            risk_factors: {
                female: '4-6x higher risk',
                fatigue: 'increases risk',
                poor_landing: 'knee valgus'
            },
            exercises: ['single_leg_squat', 'landing_drills', 'deceleration', 'hip_strengthening']
        },
        
        ACWR: {
            name: 'Acute:Chronic Workload Ratio',
            description: 'Rapporto tra carico ultima settimana vs media 4 settimane.',
            application: 'Mantenere ratio 0.8-1.3. Sopra 1.5 = rischio infortunio alto.',
            sports: ['all'],
            priority: 9,
            safe_zone: { min: 0.8, max: 1.3 },
            danger_zone: { above: 1.5 }
        },
        
        landing_mechanics: {
            name: 'Meccanica di Atterraggio',
            description: 'Come l\'atleta atterra influenza rischio infortunio ginocchio/caviglia.',
            application: 'Insegnare atterraggio soft, ginocchia in linea con piedi',
            sports: ['basket', 'volley', 'calcio'],
            priority: 9,
            cues: ['soft_landing', 'knees_over_toes', 'no_valgus', 'absorb_with_hips']
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 PRINCIPI DI RECUPERO
    // ═══════════════════════════════════════════════════════════════════════════
    
    recovery: {
        SRA_curve: {
            name: 'Stimulus-Recovery-Adaptation Curve',
            description: 'Ogni tessuto ha tempi diversi di recupero e adattamento.',
            application: 'Programmare frequenza basata su SRA del muscolo/sistema',
            sports: ['all'],
            priority: 9,
            recovery_times: {
                neural: '24-48h',
                metabolic: '24-48h',
                muscular_small: '24-48h',
                muscular_large: '48-72h',
                connective_tissue: '48-72h'
            }
        },
        
        sleep: {
            name: 'Qualità del Sonno',
            description: 'Il sonno è quando avviene la maggior parte della sintesi proteica e recupero.',
            application: '7-9 ore per atleti, evitare allenamenti intensi vicino a bedtime',
            sports: ['all'],
            priority: 10,
            recommendations: {
                hours: '7-9',
                deep_sleep: 'critical for GH release',
                consistency: 'same sleep/wake times'
            }
        },
        
        nutrition_timing: {
            name: 'Timing Nutrizionale',
            description: 'Quando mangi influenza recupero e adattamento.',
            application: 'Proteine entro 2h post-workout, ~0.4g/kg',
            sports: ['all'],
            priority: 8,
            guidelines: {
                post_workout_protein: '0.4g/kg',
                post_workout_window: '0-2 hours',
                daily_protein: '1.6-2.2g/kg'
            }
        },
        
        deload: {
            name: 'Settimana di Scarico',
            description: 'Riduzione programmata di volume/intensità per recupero completo.',
            application: 'Ogni 4-6 settimane, riduci volume 40-50%',
            sports: ['all'],
            priority: 8,
            protocols: {
                volume_deload: 'reduce sets 40-50%, maintain intensity',
                intensity_deload: 'reduce load 10-20%, maintain volume',
                frequency_deload: 'reduce training days'
            }
        },
        
        active_recovery: {
            name: 'Recupero Attivo',
            description: 'Movimento leggero accelera recupero vs riposo completo.',
            application: 'Camminata, nuoto leggero, yoga nei giorni off',
            sports: ['all'],
            priority: 7
        },
        
        HRV: {
            name: 'Heart Rate Variability',
            description: 'Misura della variabilità tra battiti cardiaci, indica stato del sistema nervoso.',
            application: 'HRV bassa = sotto-recuperato, ridurre intensità',
            sports: ['all'],
            priority: 7
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏆 PRINCIPI SPORT-SPECIFICI
    // ═══════════════════════════════════════════════════════════════════════════
    
    sport_specific: {
        calcio: {
            intermittent_endurance: {
                name: 'Resistenza Intermittente',
                description: 'Capacità di ripetere sprint con breve recupero.',
                application: 'Small-sided games, interval training sport-specifico',
                priority: 10
            },
            deceleration: {
                name: 'Decelerazione',
                description: 'Frenare è più traumatico che accelerare.',
                application: 'Allenare decelerazione eccentrica esplicitamente',
                priority: 9
            },
            COD_vs_agility: {
                name: 'COD vs Agilità',
                description: 'Cambio direzione pianificato ≠ reattivo.',
                application: 'Allenare entrambi: drill pianificati + reattivi',
                priority: 8
            },
            kicking_leg_balance: {
                name: 'Bilanciamento Gamba Calciante',
                description: 'La gamba dominante è spesso più forte.',
                application: 'Lavoro unilaterale per bilanciare',
                priority: 8
            }
        },
        
        basket: {
            vertical_jump: {
                name: 'Salto Verticale',
                description: 'Fondamentale per rimbalzi, stoppate, tiri.',
                application: 'Allenare potenza lower body + tecnica salto',
                priority: 10
            },
            ankle_stability: {
                name: 'Stabilità Caviglia',
                description: 'Distorsioni caviglia sono l\'infortunio più comune.',
                application: 'Propriocezione, calf raises, single-leg work',
                priority: 10
            },
            lateral_quickness: {
                name: 'Rapidità Laterale',
                description: 'Movimento difensivo laterale.',
                application: 'Lateral bounds, shuffles, defensive slides',
                priority: 9
            },
            vertical_deceleration: {
                name: 'Decelerazione Verticale',
                description: 'Atterraggio sicuro dopo salti.',
                application: 'Landing drills, single-leg landing',
                priority: 9
            }
        },
        
        boxe: {
            rotational_power: {
                name: 'Potenza Rotazionale',
                description: 'I pugni potenti partono dalle anche, non dalle braccia.',
                application: 'Core rotazionale, medicine ball throws, landmine rotation',
                priority: 10
            },
            shoulder_endurance: {
                name: 'Resistenza Spalle',
                description: 'Mantenere la guardia per round da 3 minuti.',
                application: 'Alto volume spalle, tempo lungo sotto tensione',
                priority: 10
            },
            neck_strength: {
                name: 'Forza Collo',
                description: 'Resistenza agli impatti, prevenzione concussioni.',
                application: 'Neck curls, extensions, isometrics',
                priority: 9
            },
            conditioning_3_1: {
                name: 'Condizionamento 3:1',
                description: 'Simulare struttura round boxe.',
                application: 'Interval training 3 min ON, 1 min OFF',
                priority: 9
            }
        },
        
        palestra: {
            lengthened_training: {
                name: 'Lengthened Training',
                description: 'Allenare il muscolo in posizione allungata.',
                application: 'Più tensione meccanica, più ipertrofia',
                priority: 9,
                examples: ['incline_curl', 'overhead_extension', 'rdl', 'deep_squat']
            },
            shortened_training: {
                name: 'Shortened Training',
                description: 'Allenare il muscolo in posizione accorciata.',
                application: 'Più stress metabolico, pump',
                priority: 8,
                examples: ['leg_curl', 'concentration_curl', 'pushdown', 'hip_thrust']
            },
            compound_first: {
                name: 'Compound First',
                description: 'Esercizi multiarticolari prima quando sei fresco.',
                application: 'Squat, Deadlift, Bench, Row prima degli isolation',
                priority: 9
            },
            push_pull_balance: {
                name: 'Bilanciamento Push/Pull',
                description: 'Rapporto 1:1 tra movimenti di spinta e tirata.',
                application: 'Per ogni push, includi un pull',
                priority: 9
            },
            mind_muscle: {
                name: 'Mind-Muscle Connection',
                description: 'Connessione neuromuscolare per attivazione ottimale.',
                application: 'Focus sul muscolo target durante l\'esercizio',
                priority: 7
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 METODI AVANZATI
    // ═══════════════════════════════════════════════════════════════════════════
    
    advanced_methods: {
        cluster_sets: {
            name: 'Cluster Sets',
            description: 'Pause intra-set per mantenere qualità con carichi pesanti.',
            application: 'Esempio: 5x1 con 15-20s rest invece di 1x5',
            sports: ['powerlifting', 'sport di forza'],
            priority: 6
        },
        
        french_contrast: {
            name: 'French Contrast',
            description: 'Sequenza: pesante → pliometria → leggero veloce → assistito',
            application: 'Sviluppa tutto lo spettro forza-velocità in una sessione',
            sports: ['atletica', 'sport esplosivi'],
            priority: 7,
            sequence: ['heavy_compound', 'plyometric', 'light_explosive', 'assisted_overspeed']
        },
        
        BFR: {
            name: 'Blood Flow Restriction',
            description: 'Restrizione flusso sanguigno per ipertrofia con carichi leggeri.',
            application: 'Utile per riabilitazione o quando non si possono usare carichi pesanti',
            sports: ['riabilitazione', 'palestra'],
            priority: 5
        },
        
        triphasic: {
            name: 'Triphasic Training',
            description: 'Fasi separate per eccentrica, isometrica, concentrica.',
            application: 'Fase 1: eccentrico, Fase 2: isometrico, Fase 3: concentrico',
            sports: ['sport esplosivi'],
            priority: 6,
            phases: {
                eccentric: '4-6 seconds eccentric',
                isometric: '3-5 seconds pause',
                concentric: 'explosive concentric'
            }
        },
        
        velocity_based: {
            name: 'Velocity Based Training',
            description: 'Monitorare velocità del movimento per autoregolazione.',
            application: 'Se velocità cala, terminare il set',
            sports: ['powerlifting', 'sport esplosivi'],
            priority: 6,
            zones: {
                strength: '<0.5 m/s',
                power: '0.5-0.75 m/s',
                speed_strength: '0.75-1.0 m/s',
                speed: '>1.0 m/s'
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📆 GESTIONE STAGIONE
    // ═══════════════════════════════════════════════════════════════════════════
    
    season_management: {
        offseason: {
            name: 'Off-Season',
            description: 'Costruzione della base fisica.',
            application: 'Volume alto, costruzione massa, correzione debolezze',
            priority: 8,
            focus: ['hypertrophy', 'work_capacity', 'address_weaknesses'],
            duration: '8-12 weeks'
        },
        
        preseason: {
            name: 'Pre-Season',
            description: 'Transizione verso sport-specifico.',
            application: 'Aumenta intensità, riduci volume, più sport-specifico',
            priority: 9,
            focus: ['strength', 'power', 'sport_specific'],
            duration: '4-8 weeks'
        },
        
        inseason: {
            name: 'In-Season',
            description: 'Mantenimento durante la competizione.',
            application: 'Volume basso, intensità alta, 1-2 sessioni/settimana',
            priority: 10,
            focus: ['maintenance', 'recovery', 'injury_prevention'],
            sessions_per_week: '1-2'
        },
        
        transition: {
            name: 'Transition (Post-Season)',
            description: 'Recupero attivo dopo la stagione.',
            application: 'Riposo, attività diverse, recupero mentale e fisico',
            priority: 7,
            duration: '2-4 weeks',
            focus: ['active_recovery', 'mental_rest', 'fun_activities']
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🛠️ UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Ottiene i principi più rilevanti per un profilo atleta
     */
    getRelevantPrinciples(profile) {
        const sport = profile.sport?.toLowerCase() || 'palestra';
        const level = profile.level?.toLowerCase() || 'intermedio';
        const goal = profile.goal?.toLowerCase() || 'forza';
        
        const relevant = [];
        
        // Sempre includere i fondamentali
        for (const [key, principle] of Object.entries(this.fundamental)) {
            relevant.push({ category: 'fundamental', key, ...principle });
        }
        
        // Principi sport-specifici
        if (this.sport_specific[sport]) {
            for (const [key, principle] of Object.entries(this.sport_specific[sport])) {
                relevant.push({ category: 'sport_specific', key, sport, ...principle });
            }
        }
        
        // Principi di prevenzione infortuni (sempre importanti)
        for (const [key, principle] of Object.entries(this.injury_prevention)) {
            if (principle.sports?.includes(sport) || principle.sports?.includes('all')) {
                relevant.push({ category: 'injury_prevention', key, ...principle });
            }
        }
        
        // Ordina per priorità
        relevant.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        
        return relevant;
    },
    
    /**
     * Genera un prompt con i principi rilevanti
     */
    generatePrinciplesPrompt(profile, maxPrinciples = 10) {
        const relevant = this.getRelevantPrinciples(profile).slice(0, maxPrinciples);
        
        let prompt = '🧬 PRINCIPI SCIENTIFICI DA RISPETTARE:\n\n';
        
        relevant.forEach((p, i) => {
            prompt += `${i + 1}. **${p.name}**: ${p.application}\n`;
        });
        
        return prompt;
    },
    
    /**
     * Valida un workout contro i principi
     */
    validateAgainstPrinciples(workout, profile) {
        const findings = [];
        const exercises = workout.exercises || [];
        const names = exercises.map(e => (e.name || '').toLowerCase()).join(' ');
        
        // Check Nordic per calcio
        if (profile.sport === 'calcio') {
            if (!names.includes('nordic') && !names.includes('hamstring')) {
                findings.push({
                    type: 'warning',
                    principle: 'nordic_protocol',
                    msg: '⚠️ Manca prevenzione hamstring (Nordic curl) - riduce infortuni 50-70%!'
                });
            }
        }
        
        // Check lavoro rotazionale per boxe
        if (profile.sport === 'boxe') {
            if (!names.includes('rotation') && !names.includes('twist') && !names.includes('chop')) {
                findings.push({
                    type: 'warning',
                    principle: 'rotational_power',
                    msg: '⚠️ Manca core rotazionale - fondamentale per potenza dei pugni!'
                });
            }
        }
        
        // Check compound first
        const compoundIndex = exercises.findIndex(e => {
            const n = (e.name || '').toLowerCase();
            return n.includes('squat') || n.includes('deadlift') || n.includes('bench') || n.includes('press');
        });
        
        const isolationIndex = exercises.findIndex(e => {
            const n = (e.name || '').toLowerCase();
            return n.includes('curl') || n.includes('extension') || n.includes('raise');
        });
        
        if (isolationIndex !== -1 && compoundIndex !== -1 && isolationIndex < compoundIndex) {
            findings.push({
                type: 'warning',
                principle: 'compound_first',
                msg: '⚠️ Isolation prima di Compound - inverti l\'ordine'
            });
        }
        
        return findings;
    }
};

console.log('🧬 ATLAS Principles Database loaded!');
console.log('   → ATLASPrinciples.getRelevantPrinciples(profile) - Get relevant principles for athlete');
console.log('   → ATLASPrinciples.generatePrinciplesPrompt(profile) - Generate prompt with principles');
console.log('   → ATLASPrinciples.validateAgainstPrinciples(workout, profile) - Validate workout');
