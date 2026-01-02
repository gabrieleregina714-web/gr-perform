// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                                                                              ║
// ║     █████╗ ████████╗██╗      █████╗ ███████╗                                 ║
// ║    ██╔══██╗╚══██╔══╝██║     ██╔══██╗██╔════╝                                 ║
// ║    ███████║   ██║   ██║     ███████║███████╗                                 ║
// ║    ██╔══██║   ██║   ██║     ██╔══██║╚════██║                                 ║
// ║    ██║  ██║   ██║   ███████╗██║  ██║███████║                                 ║
// ║    ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝                                 ║
// ║                                                                              ║
// ║    Autonomous Training Learning & Adaptation System                          ║
// ║    v1.0 - The Self-Evolving Fitness Intelligence                            ║
// ║                                                                              ║
// ║    "Non regole che cambiano, ma PRINCIPI PRIMI che generano applicazioni"   ║
// ║                                                                              ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

const ATLAS = {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧬 FIRST PRINCIPLES - Leggi IMMUTABILI della fisiologia
    // Queste NON cambiano. Sono leggi della natura, non opinioni.
    // ═══════════════════════════════════════════════════════════════════════════
    
    firstPrinciples: {
        
        // 1. SAID - Specific Adaptation to Imposed Demands
        // Il corpo si adatta ESATTAMENTE a ciò che gli chiedi
        SAID: {
            law: "Il corpo si adatta specificamente allo stress imposto",
            immutable: true,
            implications: [
                "Vuoi saltare alto? Devi saltare.",
                "Vuoi essere forte? Devi sollevare pesante.",
                "Vuoi resistenza? Devi fare volume.",
                "L'adattamento è SPECIFICO, non generale."
            ],
            derive: (goal) => {
                // L'AI usa questo principio per DERIVARE cosa fare
                return `Per ottenere ${goal}, devo imporre stress specifico per ${goal}`;
            }
        },
        
        // 2. SUPERCOMPENSAZIONE - Hans Selye's General Adaptation Syndrome
        // Stress → Fatica → Recovery → Supercompensazione
        supercompensation: {
            law: "Dopo stress adeguato e recovery, il corpo supera il livello precedente",
            immutable: true,
            implications: [
                "Troppo stress senza recovery = overtraining",
                "Troppo poco stress = nessun adattamento",
                "Il timing del prossimo stimolo è CRITICO",
                "Ogni sistema ha tempi di recovery diversi"
            ],
            recoveryTimes: {
                neural: "48-72h",      // CNS, potenza
                muscular: "48-96h",    // Ipertrofia
                metabolic: "24-48h",   // Conditioning
                connective: "72-168h"  // Tendini, legamenti
            }
        },
        
        // 3. WOLFF'S LAW - Bone/Tissue Remodeling
        // I tessuti si rinforzano lungo le linee di stress
        wolff: {
            law: "I tessuti biologici si adattano ai carichi imposti",
            immutable: true,
            implications: [
                "Stress progressivo rinforza ossa e tendini",
                "Mancanza di stress = atrofia",
                "Il carico deve essere PROGRESSIVO (non improvviso)"
            ]
        },
        
        // 4. AGONIST-ANTAGONIST BALANCE
        // Ogni muscolo ha un opposto. Squilibrio = infortunio.
        muscularBalance: {
            law: "I gruppi muscolari opposti devono essere bilanciati per prevenire infortuni",
            immutable: true,
            pairs: {
                quadriceps: "hamstrings",
                chest: "upper_back",
                anterior_deltoid: "posterior_deltoid",
                biceps: "triceps",
                hip_flexors: "glutes",
                internal_rotation: "external_rotation"
            },
            idealRatios: {
                "hamstrings:quadriceps": 0.6,  // H:Q ratio per prevenzione ACL
                "pull:push": 1.0,
                "posterior:anterior": 1.2  // Leggermente più posteriore
            }
        },
        
        // 5. PROGRESSIVE OVERLOAD
        // Senza progressione, nessun adattamento
        progressiveOverload: {
            law: "Lo stimolo deve progressivamente aumentare per continuare l'adattamento",
            immutable: true,
            methods: [
                "Aumentare peso",
                "Aumentare reps",
                "Aumentare sets",
                "Ridurre rest",
                "Aumentare range of motion",
                "Aumentare tempo sotto tensione",
                "Aumentare frequenza"
            ]
        },
        
        // 6. ENERGY SYSTEMS
        // ATP-PC, Glycolytic, Oxidative - Ognuno ha regole proprie
        energySystems: {
            law: "Esistono tre sistemi energetici con caratteristiche distinte",
            immutable: true,
            systems: {
                phosphagen: { duration: "0-10s", recovery: "3-5min", trainWith: "max effort, long rest" },
                glycolytic: { duration: "10s-2min", recovery: "1-3min", trainWith: "intervals" },
                oxidative: { duration: ">2min", recovery: "minimal", trainWith: "steady state, tempo" }
            }
        },
        
        // 7. HORMESIS
        // La dose fa il veleno. Troppo poco = niente. Troppo = danno.
        hormesis: {
            law: "Lo stress in dose appropriata è benefico; in eccesso è dannoso",
            immutable: true,
            implications: [
                "Esiste una dose OTTIMALE di stress",
                "Sotto la soglia = nessun adattamento",
                "Sopra la soglia = danno/overtraining",
                "La soglia INDIVIDUALE varia"
            ]
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧠 REASONING ENGINE - L'AI ragiona con i principi primi
    // Non "cosa fare" ma "perché e come derivare cosa fare"
    // ═══════════════════════════════════════════════════════════════════════════
    
    reasoningEngine: {
        
        // Dato un obiettivo, deriva le necessità usando principi primi
        deriveFromPrinciples(goal, context) {
            const reasoning = {
                goal,
                principlesApplied: [],
                derivedActions: [],
                constraints: [],
                reasoning: []
            };
            
            // Applica SAID
            reasoning.reasoning.push(`[SAID] Per ${goal}, devo imporre stress specifico.`);
            
            // Applica Supercompensation
            reasoning.reasoning.push(`[SUPERCOMP] Devo permettere recovery tra stimoli.`);
            
            // Applica Balance
            if (context.sport) {
                reasoning.reasoning.push(`[BALANCE] Devo bilanciare agonisti/antagonisti per prevenire infortuni.`);
            }
            
            // Applica Progressive Overload
            reasoning.reasoning.push(`[OVERLOAD] Ogni sessione deve avere progressione misurabile.`);
            
            // Applica Hormesis
            reasoning.reasoning.push(`[HORMESIS] Devo trovare la dose ottimale per questo atleta.`);
            
            return reasoning;
        },
        
        // Valuta una decisione contro i principi primi
        validateAgainstPrinciples(decision, context) {
            const violations = [];
            const alignments = [];
            
            // Check SAID
            if (decision.exercises) {
                const hasSpecificWork = decision.exercises.some(e => 
                    this.isSpecificToGoal(e, context.goal)
                );
                if (!hasSpecificWork) {
                    violations.push({
                        principle: 'SAID',
                        issue: 'Manca lavoro specifico per l\'obiettivo',
                        severity: 'high'
                    });
                } else {
                    alignments.push({ principle: 'SAID', note: 'Lavoro specifico presente' });
                }
            }
            
            // Check Balance
            // ... più validazioni
            
            return { violations, alignments };
        },
        
        isSpecificToGoal(exercise, goal) {
            // L'AI deduce se un esercizio è specifico per un obiettivo
            const goalExerciseMap = {
                'vertical_jump': ['jump', 'squat', 'plyo', 'depth'],
                'sprint': ['sprint', 'hip', 'glute', 'hamstring'],
                'punch_power': ['rotation', 'hip', 'core', 'medicine ball'],
                'endurance': ['interval', 'tempo', 'circuit']
            };
            
            const keywords = goalExerciseMap[goal] || [];
            const exName = (exercise.name || '').toLowerCase();
            return keywords.some(k => exName.includes(k));
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 TEMPORAL COHERENCE - Valuta la PROGRAMMAZIONE, non solo la sessione
    // Microciclo → Mesociclo → Macrociclo
    // ═══════════════════════════════════════════════════════════════════════════
    
    temporalCoherence: {
        
        // Analizza coerenza su scala temporale
        analyzeProgram(sessions, timeframe = 'mesocycle') {
            const analysis = {
                timeframe,
                volumeProgression: this.analyzeVolumeProgression(sessions),
                intensityProgression: this.analyzeIntensityProgression(sessions),
                balanceOverTime: this.analyzeBalanceOverTime(sessions),
                recoveryAdequacy: this.analyzeRecoveryWindows(sessions),
                periodizationPattern: this.detectPeriodization(sessions),
                adaptationPrediction: this.predictAdaptation(sessions)
            };
            
            return analysis;
        },
        
        analyzeVolumeProgression(sessions) {
            if (!sessions || sessions.length < 2) return { trend: 'insufficient_data' };
            
            const volumes = sessions.map(s => 
                (s.exercises || []).reduce((sum, e) => sum + (parseInt(e.sets) || 0), 0)
            );
            
            // Calcola trend
            const firstHalf = volumes.slice(0, Math.floor(volumes.length / 2));
            const secondHalf = volumes.slice(Math.floor(volumes.length / 2));
            
            const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
            const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
            
            const trend = avgSecond > avgFirst * 1.1 ? 'progressive' :
                         avgSecond < avgFirst * 0.9 ? 'regressive' : 'stable';
            
            return {
                trend,
                volumes,
                recommendation: trend === 'progressive' ? 
                    '✅ Volume progressivo - buon overload' :
                    '⚠️ Considera aumentare il volume progressivamente'
            };
        },
        
        analyzeIntensityProgression(sessions) {
            // Analizza se intensità cresce (rep ranges calano, carichi salgono)
            return { trend: 'needs_implementation' };
        },
        
        analyzeBalanceOverTime(sessions) {
            // Verifica che nel mesociclo tutti i pattern siano coperti
            const patternCounts = {};
            sessions.forEach(s => {
                (s.exercises || []).forEach(e => {
                    const pattern = this.identifyPattern(e.name);
                    patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
                });
            });
            
            return {
                patternDistribution: patternCounts,
                isBalanced: this.checkDistributionBalance(patternCounts)
            };
        },
        
        analyzeRecoveryWindows(sessions) {
            // Verifica che ci siano almeno 48-72h tra sessioni simili
            return { adequate: true, note: 'Needs timestamp data' };
        },
        
        detectPeriodization(sessions) {
            // Rileva se c'è un pattern: linear, undulating, block
            return { pattern: 'unknown', confidence: 0 };
        },
        
        predictAdaptation(sessions) {
            // Predice quali adattamenti ci saranno basandosi su SAID
            return { predictions: ['needs_more_data'] };
        },
        
        identifyPattern(name) {
            const n = (name || '').toLowerCase();
            if (n.includes('squat') || n.includes('leg press')) return 'squat';
            if (n.includes('deadlift') || n.includes('rdl')) return 'hinge';
            if (n.includes('bench') || n.includes('push')) return 'push';
            if (n.includes('row') || n.includes('pull')) return 'pull';
            return 'other';
        },
        
        checkDistributionBalance(counts) {
            const values = Object.values(counts);
            if (values.length < 2) return false;
            const max = Math.max(...values);
            const min = Math.min(...values);
            return (min / max) > 0.5; // Max 2:1 ratio
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 SELF-EVOLUTION ENGINE - Il sistema impara e si migliora
    // Raccoglie feedback, correla con decisioni, aggiusta pesi
    // ═══════════════════════════════════════════════════════════════════════════
    
    evolution: {
        
        // Database di feedback (persistente in localStorage)
        feedbackDB: null,
        
        init() {
            try {
                this.feedbackDB = JSON.parse(localStorage.getItem('atlas_feedback') || '{}');
            } catch {
                this.feedbackDB = {};
            }
            return this;
        },
        
        // Registra outcome di un workout
        recordOutcome(workoutId, outcome) {
            // outcome: { athleteId, date, workout, results: { rpe, performance, soreness, injury, prs } }
            if (!this.feedbackDB) this.init();
            
            this.feedbackDB[workoutId] = {
                ...outcome,
                recordedAt: new Date().toISOString()
            };
            
            localStorage.setItem('atlas_feedback', JSON.stringify(this.feedbackDB));
            
            // Trigger learning
            this.learn();
        },
        
        // Analizza pattern nei feedback
        learn() {
            if (!this.feedbackDB) this.init();
            
            const outcomes = Object.values(this.feedbackDB);
            if (outcomes.length < 10) {
                console.log('📚 ATLAS: Need more data to learn (min 10 outcomes)');
                return;
            }
            
            // Trova correlazioni
            const insights = {
                injuryCorrelations: this.findInjuryCorrelations(outcomes),
                performancePatterns: this.findPerformancePatterns(outcomes),
                optimalVolume: this.findOptimalVolume(outcomes),
                recoveryPatterns: this.findRecoveryPatterns(outcomes)
            };
            
            localStorage.setItem('atlas_insights', JSON.stringify(insights));
            console.log('🧠 ATLAS learned new insights:', insights);
            
            return insights;
        },
        
        findInjuryCorrelations(outcomes) {
            // Trova esercizi/pattern che correlano con infortuni
            const injuries = outcomes.filter(o => o.results?.injury);
            // ... analisi
            return { correlations: [], confidence: 0 };
        },
        
        findPerformancePatterns(outcomes) {
            // Trova cosa porta a PRs e miglioramenti
            const prs = outcomes.filter(o => o.results?.prs?.length > 0);
            // ... analisi
            return { patterns: [], confidence: 0 };
        },
        
        findOptimalVolume(outcomes) {
            // Trova volume ottimale per diversi tipi di atleti
            return { ranges: {}, confidence: 0 };
        },
        
        findRecoveryPatterns(outcomes) {
            // Trova pattern di recovery ottimali
            return { patterns: [], confidence: 0 };
        },
        
        // Ottieni raccomandazioni basate su learning
        getLearnedRecommendations(context) {
            const insights = JSON.parse(localStorage.getItem('atlas_insights') || '{}');
            
            const recommendations = [];
            
            // Applica insights appresi
            if (insights.injuryCorrelations?.correlations?.length) {
                // Evita pattern correlati a infortuni
            }
            
            if (insights.optimalVolume?.ranges) {
                // Suggerisci volume ottimale
            }
            
            return recommendations;
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 META-PROMPT GENERATOR - Genera prompt che fanno RAGIONARE l'AI
    // COMBINA: Principi Primi (WHY) + Regole Specifiche (WHAT)
    // ═══════════════════════════════════════════════════════════════════════════
    
    metaPromptGenerator: {
        
        generate(context) {
            // Ottieni regole sport-specifiche se disponibili
            const sportRules = window.ScientificPromptRules?.generatePrompt 
                ? window.ScientificPromptRules.generatePrompt(context.sport, context)
                : this.getDefaultSportRules(context.sport, context);
            
            // Calcola numero esercizi in base a durata e goal
            const exerciseLimits = this.getExerciseLimits(context);
            
            return `
═══════════════════════════════════════════════════════════════════════════════
🧬 ATLAS - WORKOUT SCIENTIFICAMENTE OTTIMALE
═══════════════════════════════════════════════════════════════════════════════

⏱️ VINCOLI TEMPO (RISPETTA RIGOROSAMENTE):
• Durata totale: ${context.duration || 60} minuti
• Numero MASSIMO esercizi: ${exerciseLimits.maxExercises}
• Struttura tempo: ${exerciseLimits.timeBreakdown}

PRINCIPI FISIOLOGICI DA RISPETTARE (OBBLIGATORI):
• Per ogni PUSH → includi un PULL (bilancia anteriore/posteriore)
• Warm-up SEMPRE all'inizio
• Potenza/Salti PRIMA di forza
• Cool-down alla fine
• Volume: ${this.getVolumeForLevel(context.level)}

🔬 SCIENZA AVANZATA (Applica questi principi):

1. LENGTHENED vs SHORTENED TRAINING:
   - Includi esercizi che lavorano il muscolo in ALLUNGAMENTO (es: RDL, Incline Curl, Overhead Extension)
   - E esercizi che lavorano in ACCORCIAMENTO (es: Leg Curl, Concentration Curl, Pushdown)
   - Se non puoi fare entrambi nella sessione, alterna durante la settimana

2. FIBER TYPE OPTIMIZATION:
   - Quadricipiti: 8-12 reps (fibre miste)
   - Spalle/Polpacci: 12-20 reps (fibre Type I dominanti)
   - Petto/Tricipiti/Hamstring: 6-10 reps (fibre Type II dominanti)

3. ECCENTRIC EMPHASIS:
   - Includi almeno 1 esercizio con enfasi eccentrica (Nordic, Tempo lento, Negatives)
   - Specialmente per prevenzione infortuni

4. AGONIST/ANTAGONIST BALANCE:
   - Quadricipiti:Hamstring = 1:0.6-0.8
   - Petto:Schiena = 1:1
   - Bicipiti:Tricipiti = 1:1.2

5. SRA (STIMULUS-RECOVERY-ADAPTATION):
   - Max 10-12 sets per gruppo muscolare grande per sessione
   - Max 6-8 sets per gruppo piccolo per sessione

═══════════════════════════════════════════════════════════════════════════════
ATLETA
═══════════════════════════════════════════════════════════════════════════════

${this.formatContext(context)}

═══════════════════════════════════════════════════════════════════════════════
ESERCIZI OBBLIGATORI PER ${(context.sport || 'SPORT').toUpperCase()}
═══════════════════════════════════════════════════════════════════════════════

${sportRules}

═══════════════════════════════════════════════════════════════════════════════
OUTPUT JSON (SEGUI ESATTAMENTE QUESTO FORMATO)
═══════════════════════════════════════════════════════════════════════════════

{
  "title": "Titolo descrittivo",
  "exercises": [
    {"name": "Dynamic Warm-up", "sets": 1, "reps": "5 min", "type": "warmup"},
    {"name": "Esercizio Potenza/Salto", "sets": 3, "reps": "5", "type": "power"},
    {"name": "Esercizio Compound 1", "sets": 4, "reps": "6-8", "type": "strength"},
    {"name": "Esercizio Compound 2", "sets": 3, "reps": "8-10", "type": "strength"},
    {"name": "Esercizio Unilaterale/Accessorio", "sets": 3, "reps": "10-12", "type": "hypertrophy"},
    {"name": "Esercizio PULL/Posteriore", "sets": 3, "reps": "10-12", "type": "strength"},
    {"name": "Core", "sets": 3, "reps": "30s", "type": "strength"},
    {"name": "Stretching/Cool-down", "sets": 1, "reps": "5 min", "type": "cooldown"}
  ]
}

SOSTITUISCI gli esercizi placeholder con esercizi REALI e SPECIFICI per ${context.sport || 'lo sport'}.
${context.injuries?.length ? '⚠️ EVITA ASSOLUTAMENTE esercizi che stressano: ' + context.injuries.join(', ') : ''}

Rispondi SOLO con il JSON, nessun altro testo.
`;
        },
        
        getExerciseLimits(context) {
            const duration = context.duration || 60;
            const goal = (context.goal || '').toLowerCase();
            
            // Potenza: recuperi lunghi (3-5 min), meno esercizi
            // Ipertrofia: recuperi medi (60-90s), più esercizi
            // Forza: recuperi lunghi (2-4 min), esercizi medi
            
            if (goal === 'potenza' || goal === 'power') {
                // Potenza: 3-5 min recupero tra serie pesanti
                const baseExercises = Math.floor((duration - 10) / 8); // 8 min per esercizio medio
                return {
                    maxExercises: Math.min(Math.max(baseExercises, 5), 8),
                    timeBreakdown: `Warmup 5min + ${Math.min(baseExercises, 6)} esercizi (45-50min) + Cooldown 5min`,
                    restPeriod: '3-5 min tra serie compound, 2 min tra pliometria'
                };
            } else if (goal === 'ipertrofia' || goal === 'hypertrophy' || goal === 'massa') {
                // Ipertrofia: 60-90s recupero
                const baseExercises = Math.floor((duration - 10) / 5); // 5 min per esercizio
                return {
                    maxExercises: Math.min(Math.max(baseExercises, 8), 12),
                    timeBreakdown: `Warmup 5min + ${Math.min(baseExercises, 10)} esercizi (45-50min) + Cooldown 5min`,
                    restPeriod: '60-90s tra serie'
                };
            } else {
                // Forza/generale
                const baseExercises = Math.floor((duration - 10) / 6);
                return {
                    maxExercises: Math.min(Math.max(baseExercises, 6), 10),
                    timeBreakdown: `Warmup 5min + ${Math.min(baseExercises, 8)} esercizi (45-50min) + Cooldown 5min`,
                    restPeriod: '2-3 min tra serie compound'
                };
            }
        },
        
        getVolumeForLevel(level) {
            const volumes = {
                principiante: '15-18 sets totali',
                intermedio: '18-22 sets totali',
                avanzato: '22-26 sets totali',
                elite: '24-30 sets totali'
            };
            return volumes[level] || '18-22 sets totali';
        },
        
        getDefaultSportRules(sport, context = {}) {
            const rules = {
                calcio: `🎯 CALCIO - ESERCIZI OBBLIGATORI DA INCLUDERE:

PREVENZIONE INFORTUNI (SCEGLI ALMENO 2):
• Nordic Curl OPPURE Romanian Deadlift (RDL) → per hamstring
• Copenhagen Plank OPPURE Adductor Squeeze → per pubalgia
• Single-Leg RDL OPPURE Bulgarian Split Squat → stabilità

ESPLOSIVITÀ (SCEGLI 1-2):
• Box Jump OPPURE Broad Jump OPPURE Lateral Bound

CORE (SCEGLI 1):
• Pallof Press OPPURE Dead Bug OPPURE Bird Dog

SEQUENZA CONSIGLIATA:
1. Warm-up dinamico (5 min)
2. Pliometria (jump/bound)
3. Forza compound (squat, deadlift)
4. Accessori unilaterali (split squat, step-up)
5. Core anti-rotazione
6. Conditioning (opzionale)
7. Cool-down/stretching`,

                basket: `🏀 BASKET - ESERCIZI OBBLIGATORI DA INCLUDERE:

SALTO VERTICALE (CRITICO - INCLUDI ALMENO 1):
• "Box Jump" o "Jump Squat" o "Depth Jump" → USA QUESTI NOMI ESATTI

STABILITÀ SINGLE-LEG (INCLUDI 1):
• "Single-Leg Balance" o "Calf Raise" o "Single-Leg RDL"

MOVIMENTO LATERALE (INCLUDI 1):
• "Lateral Lunge" o "Lateral Bound" o "Side Shuffle"

FORZA LOWER BODY:
• Squat (Back/Front/Goblet)
• RDL o Deadlift per catena posteriore

CORE:
• Plank o Pallof Press

ESEMPIO WORKOUT BASKET OTTIMALE:
1. Dynamic Warm-up (5 min)
2. Box Jump (3x5) - POTENZA
3. Squat (4x6) - FORZA  
4. Single-Leg RDL (3x8 per lato) - POSTERIORE/BALANCE
5. Lateral Lunge (3x10 per lato) - LATERALE
6. Calf Raise (3x15) - CAVIGLIE
7. Plank (3x30s) - CORE
8. Stretching (5 min)

SEGUI QUESTA STRUTTURA!`,

                boxe: `🥊 BOXE - WORKOUT SCIENTIFICO DA COMBATTIMENTO:

🔬 PRINCIPI FISIOLOGICI BOXE:
- Potenza rotazionale = core + catena cinetica
- Resistenza muscolare spalle (round 3 min)
- Esplosività gambe per footwork
- Collo forte per resistenza impatti

CORE ROTAZIONALE (CRITICO - INCLUDI 2):
• "Russian Twist" o "Landmine Rotation" - ANTI-ROTAZIONE
• "Woodchop" o "Medicine Ball Throw" - POTENZA ROTAZIONALE
• "Pallof Press" - STABILITÀ

COLLO E TRAPEZI (INCLUDI 1) - PREVENZIONE CONCUSSIONI:
• "Neck Curl" o "Neck Extension" o "Face Pull"
• "Shrugs" per trapezi

SPALLE RESISTENZA (FONDAMENTALE):
• "Shoulder Press" (3x12-15) - endurance
• "Lateral Raise" (3x15-20) - deltoidi resistenti
• "Battle Ropes" - condizionamento spalle

GAMBE ESPLOSIVE:
• "Box Jump" o "Jump Squat" - potenza
• "Squat" - base di forza
• "Calf Raise" - footwork

CONDITIONING (simula round 3:1):
• "HIIT Intervals" 3 min ON, 1 min OFF
• "Burpees" o "Jump Rope"

ESEMPIO WORKOUT BOXE OTTIMALE:
1. Jump Rope Warm-up (5 min)
2. Box Jump (3x5) - ESPLOSIVITÀ
3. Squat (3x8) - FORZA BASE
4. Shoulder Press (3x12) - ENDURANCE SPALLE
5. Russian Twist (3x20) - CORE ROTAZIONALE
6. Pallof Press (3x12 per lato) - ANTI-ROTAZIONE
7. Face Pull (3x15) - POSTURA + TRAPEZI
8. HIIT Burpees (4x30s ON / 30s OFF) - CONDITIONING
9. Neck Curl/Extension (2x15) - PREVENZIONE
10. Stretching (5 min)

SEGUI QUESTA STRUTTURA!`,

                palestra: `🏋️ PALESTRA - STRUTTURA BASATA SUL GOAL:

${context.goal === 'potenza' ? `
⚡ GOAL: POTENZA (Forza × Velocità)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⛔ VIETATO: Esercizi di isolamento (Curl, Extension, Lateral Raise, Fly)
✅ SOLO: Compound esplosivi + Forza massimale

REP RANGES POTENZA:
• Pliometria: 3-5 reps × 3 sets (esplosivi)
• Forza massimale: 3-6 reps × 4-5 sets (>85% 1RM)
• Forza veloce: 5-8 reps × 3-4 sets (velocità concentrica massima)

STRUTTURA OBBLIGATORIA:
1. Dynamic Warm-up (5 min)
2. Pliometria: Box Jump / Depth Jump / Jump Squat (3x3-5)
3. Squat o Deadlift PESANTE (4-5x3-5 reps)
4. Push Compound: Bench Press o Push Press (4x4-6)
5. Pull Compound: Pull-up pesante o Pendlay Row (4x4-6)
6. Unilaterale esplosivo: Split Squat Jump o Step-up esplosivo (3x5)
7. Core Anti-rotazione: Pallof Press (3x10)
8. Cool-down (5 min)

📋 ESEMPIO POTENZA:
{
  "title": "Power Training - Full Body",
  "focus": "potenza",
  "exercises": [
    {"name": "Dynamic Warm-up", "sets": 1, "reps": "5 min", "type": "warmup"},
    {"name": "Box Jump", "sets": 4, "reps": "4", "type": "power"},
    {"name": "Back Squat", "sets": 5, "reps": "4", "type": "strength"},
    {"name": "Bench Press", "sets": 4, "reps": "5", "type": "strength"},
    {"name": "Weighted Pull-up", "sets": 4, "reps": "5", "type": "strength"},
    {"name": "Split Squat Jump", "sets": 3, "reps": "5", "type": "power"},
    {"name": "Pallof Press", "sets": 3, "reps": "10", "type": "core"},
    {"name": "Stretching", "sets": 1, "reps": "5 min", "type": "cooldown"}
  ]
}

⚠️ ZERO CURL, ZERO EXTENSION, ZERO ISOLATION!

` : context.goal === 'ipertrofia' ? `
💪 GOAL: IPERTROFIA (Volume + TUT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRINCIPI CHIAVE:
• Volume: 10-20 sets per gruppo muscolare/settimana
• TUT: 40-70 secondi per set
• Lengthened + Shortened position per ogni muscolo
• Isolation PERMESSI per dettaglio muscolare

REP RANGES IPERTROFIA:
• Compound: 6-10 reps
• Isolation: 10-15 reps
• Tipo I dominant (spalle/polpacci): 12-20 reps

STRUTTURA:
1. Warm-up (5 min)
2. Compound #1: Squat/RDL (4x8)
3. Compound #2: Bench/Row (3x10)
4. Accessorio Lengthened: Incline Curl + Overhead Extension (3x12)
5. Accessorio Shortened: Pushdown + Concentration Curl (3x12)
6. Isolation: Lateral Raise + Fly (3x15)
7. Core
8. Stretching

📋 ESEMPIO IPERTROFIA:
{
  "title": "Hypertrophy - Full Body",
  "focus": "ipertrofia",
  "exercises": [
    {"name": "Dynamic Warm-up", "sets": 1, "reps": "5 min", "type": "warmup"},
    {"name": "Back Squat", "sets": 4, "reps": "8", "type": "strength"},
    {"name": "Romanian Deadlift", "sets": 3, "reps": "10", "type": "strength"},
    {"name": "Bench Press", "sets": 3, "reps": "10", "type": "strength"},
    {"name": "Cable Row", "sets": 3, "reps": "12", "type": "strength"},
    {"name": "Incline Dumbbell Curl", "sets": 3, "reps": "12", "type": "hypertrophy"},
    {"name": "Overhead Tricep Extension", "sets": 3, "reps": "12", "type": "hypertrophy"},
    {"name": "Lateral Raise", "sets": 3, "reps": "15", "type": "hypertrophy"},
    {"name": "Plank", "sets": 3, "reps": "45s", "type": "core"},
    {"name": "Stretching", "sets": 1, "reps": "5 min", "type": "cooldown"}
  ]
}

` : `
⚖️ GOAL: FORZA/GENERALE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STRUTTURA BILANCIATA:
1. Warm-up (5 min)
2. Compound Lower (Squat/Deadlift) - 4x6
3. Compound Upper Push (Bench/OHP) - 4x6
4. Compound Upper Pull (Row/Pull-up) - 4x8
5. Unilaterale (Lunge/Split Squat) - 3x10
6. Core - 3x30s
7. Cool-down

REP RANGES: 5-8 compound, 8-12 accessori
`}
BILANCIAMENTO (SEMPRE):
• Push = Pull (1:1)
• Quad = Hamstring (1:0.7)`
            };
            
            return rules[sport] || 'Segui i principi generali di biomeccanica e progressione';
        },
        
        formatContext(ctx) {
            const order = ['sport', 'level', 'role', 'goal', 'age', 'weight', 'injuries', 'goals'];
            const lines = [];
            
            order.forEach(key => {
                if (ctx[key] !== null && ctx[key] !== undefined) {
                    const value = Array.isArray(ctx[key]) ? ctx[key].join(', ') : ctx[key];
                    const emoji = {
                        sport: '🏅', level: '📊', role: '👤', goal: '🎯',
                        age: '📅', weight: '⚖️', injuries: '⚠️', goals: '🎯'
                    }[key] || '•';
                    lines.push(`${emoji} ${key}: ${value}`);
                }
            });
            
            // Aggiungi altri campi non nell'ordine
            Object.entries(ctx).forEach(([k, v]) => {
                if (!order.includes(k) && v !== null && v !== undefined) {
                    lines.push(`• ${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
                }
            });
            
            return lines.join('\n');
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔮 CONSCIOUSNESS LAYER - Il sistema "osserva" se stesso
    // Monitora le sue decisioni e impara dai propri errori
    // ═══════════════════════════════════════════════════════════════════════════
    
    consciousness: {
        
        // Log di tutte le decisioni prese
        decisionLog: [],
        
        // Registra una decisione
        logDecision(decision) {
            this.decisionLog.push({
                timestamp: new Date().toISOString(),
                decision,
                context: decision.context,
                reasoning: decision.reasoning,
                outcome: null  // Sarà riempito dopo
            });
            
            // Mantieni solo ultime 1000 decisioni in memoria
            if (this.decisionLog.length > 1000) {
                this.decisionLog = this.decisionLog.slice(-1000);
            }
        },
        
        // Quando arriva feedback, collega alla decisione
        linkOutcome(decisionId, outcome) {
            const decision = this.decisionLog.find(d => d.id === decisionId);
            if (decision) {
                decision.outcome = outcome;
                this.reflect(decision);
            }
        },
        
        // Il sistema "riflette" sulle sue decisioni
        reflect(decision) {
            if (!decision.outcome) return;
            
            const wasGood = decision.outcome.success;
            
            if (!wasGood) {
                console.log(`🤔 ATLAS REFLECTION: Decision ${decision.id} had poor outcome.`);
                console.log(`   Context: ${JSON.stringify(decision.context)}`);
                console.log(`   Reasoning: ${decision.reasoning}`);
                console.log(`   Outcome: ${JSON.stringify(decision.outcome)}`);
                console.log(`   → Learning: Avoid similar pattern in future`);
                
                // Aggiungi alla "memoria" di cosa evitare
                this.addToAvoidPatterns(decision);
            }
        },
        
        avoidPatterns: [],
        
        addToAvoidPatterns(decision) {
            this.avoidPatterns.push({
                pattern: this.extractPattern(decision),
                reason: decision.outcome.reason,
                addedAt: new Date().toISOString()
            });
        },
        
        extractPattern(decision) {
            // Estrae pattern generalizzabile dalla decisione
            return {
                sport: decision.context?.sport,
                level: decision.context?.level,
                avoidedExercises: decision.decision?.exercises?.map(e => e.name),
                volume: decision.decision?.exercises?.reduce((s, e) => s + (e.sets || 0), 0)
            };
        },
        
        // Check se una nuova decisione matcha pattern da evitare
        shouldAvoid(newDecision) {
            return this.avoidPatterns.filter(p => 
                this.matchesPattern(newDecision, p.pattern)
            );
        },
        
        matchesPattern(decision, pattern) {
            // Logica di matching fuzzy
            return false; // Implement
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 MAIN INTERFACE - API pubblica di ATLAS
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Inizializza ATLAS
    init() {
        console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║  █████╗ ████████╗██╗      █████╗ ███████╗    v2.0 NASA-LEVEL                ║
║ ██╔══██╗╚══██╔══╝██║     ██╔══██╗██╔════╝                                    ║
║ ███████║   ██║   ██║     ███████║███████╗                                    ║
║ ██╔══██║   ██║   ██║     ██╔══██║╚════██║                                    ║
║ ██║  ██║   ██║   ███████╗██║  ██║███████║                                    ║
║ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝                                    ║
║                                                                              ║
║ Autonomous Training Learning & Adaptation System                             ║
║ v2.0 - NASA-Level Scientific Integration                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
        `);
        
        this.evolution.init();
        
        // Check new modules
        this.checkModules();
        
        return this;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔌 MODULI v2.0 - INTEGRAZIONE SISTEMA IBRIDO
    // ═══════════════════════════════════════════════════════════════════════════
    
    VERSION: '2.0.0',
    CODENAME: 'NASA-Level',
    
    /**
     * Verifica moduli v2.0 caricati
     */
    checkModules() {
        const modules = {
            MacroPlanner: typeof AtlasMacroPlanner !== 'undefined',
            ProgressTracker: typeof AtlasProgressTracker !== 'undefined',
            WeekGenerator: typeof AtlasWeekGenerator !== 'undefined',
            AutoAdjuster: typeof AtlasAutoAdjuster !== 'undefined',
            StructuralBalance: typeof AtlasStructuralBalance !== 'undefined' || typeof window.AtlasStructuralBalance !== 'undefined',
            Recovery: typeof AtlasRecovery !== 'undefined',
            Science: typeof AtlasScience !== 'undefined',
            TrainingMethods: typeof TRAINING_METHODS !== 'undefined',
            AthleteLearning: typeof ATLASAthleteLearning !== 'undefined',
            NeuralCortex: typeof ATLASNeuralCortex !== 'undefined'
        };
        
        const loaded = Object.entries(modules).filter(([k, v]) => v).map(([k]) => k);
        const missing = Object.entries(modules).filter(([k, v]) => !v).map(([k]) => k);
        
        if (loaded.length > 0) {
            console.log(`✅ ATLAS v2.0 Moduli: ${loaded.join(', ')}`);
        }
        if (missing.length > 0) {
            console.log(`⚠️ ATLAS v2.0 Moduli mancanti: ${missing.join(', ')}`);
        }
        
        return { loaded, missing, ready: missing.length === 0 };
    },
    
    /**
     * Inizializza atleta nel sistema v2.0
     */
    initializeAthlete(athleteProfile) {
        if (typeof AtlasMacroPlanner === 'undefined' || typeof AtlasProgressTracker === 'undefined') {
            console.error('ATLAS: Moduli MacroPlanner/ProgressTracker non caricati');
            return null;
        }
        
        const athleteId = athleteProfile.id || `athlete_${Date.now().toString(36)}`;
        const macroTemplate = AtlasMacroPlanner.selectMacroTemplate(athleteProfile);
        const progress = AtlasProgressTracker.initializeAthlete(athleteId, macroTemplate);
        
        // Structural assessment se dati disponibili
        let structuralAnalysis = null;
        if (athleteProfile.lifts && typeof AtlasStructuralBalance !== 'undefined') {
            structuralAnalysis = AtlasStructuralBalance.analyzeBalance(athleteProfile);
        }
        
        return {
            athlete_id: athleteId,
            macro_template: macroTemplate,
            progress,
            structural_analysis: structuralAnalysis,
            status: 'initialized'
        };
    },
    
    /**
     * Genera workout con sistema v2.0 completo
     */
    generateWorkoutV2(athleteId, options = {}) {
        // Carica progress
        const progress = AtlasProgressTracker?.load(athleteId);
        if (!progress) {
            return { error: 'Atleta non trovato. Usa initializeAthlete() prima.' };
        }
        
        // Ottieni macro template
        const macroTemplate = AtlasMacroPlanner.macroTemplates[progress.macro_plan.goal] 
            || AtlasMacroPlanner.macroTemplates.ipertrofia;
        
        // Genera parametri settimana
        const lastFeedback = progress.week_history?.slice(-1)[0] || {};
        const weekParams = AtlasMacroPlanner.generateWeekParameters(
            macroTemplate,
            progress.macro_plan.current_week,
            lastFeedback
        );
        
        // Analisi auto-adjuster
        const autoAnalysis = AtlasAutoAdjuster?.analyze(progress, macroTemplate);
        
        // Applica modificatori se necessario
        if (autoAnalysis?.decision?.load_modifier) {
            weekParams.intensity_target = Math.round(
                weekParams.intensity_target * autoAnalysis.decision.load_modifier
            );
        }
        if (autoAnalysis?.decision?.volume_modifier) {
            weekParams.volume_modifier *= autoAnalysis.decision.volume_modifier;
        }
        
        // Genera struttura settimana
        const weekPlan = AtlasWeekGenerator?.generateWeek({
            athlete: options.athleteProfile || {},
            weekParams,
            recoveryStatus: null,
            cnsStatus: null,
            progressSummary: AtlasProgressTracker.getProgressSummary(athleteId)
        });
        
        // Seleziona metodologie
        const methods = typeof MethodSelector !== 'undefined' 
            ? MethodSelector.selectMethods({
                goal: progress.macro_plan.goal,
                phase: weekParams.phase_name,
                experience: options.experience || 'intermediate',
                fatigue: lastFeedback.fatigue || 5,
                time_available: options.time_available || 60
            })
            : [];
        
        // Genera prompt completo
        let fullPrompt = this.generateFullSystemPrompt({
            weekParams, weekPlan, methods, autoAnalysis, progress
        });
        
        return {
            athlete_id: athleteId,
            week: progress.macro_plan.current_week,
            phase: weekParams.phase_name,
            parameters: weekParams,
            week_plan: weekPlan,
            methods: methods.slice(0, 3),
            auto_adjustment: autoAnalysis?.decision,
            full_prompt: fullPrompt
        };
    },
    
    /**
     * Genera prompt completo per AI
     */
    generateFullSystemPrompt(data) {
        const { weekParams, weekPlan, methods, autoAnalysis, progress } = data;
        
        let prompt = `\n${'═'.repeat(60)}\n`;
        prompt += `🏛️ ATLAS v2.0 NASA-Level - PARAMETRI WORKOUT\n`;
        prompt += `${'═'.repeat(60)}\n\n`;
        
        // Fase
        if (typeof AtlasMacroPlanner !== 'undefined') {
            prompt += AtlasMacroPlanner.generatePhasePrompt(weekParams);
        }
        
        // Struttura settimana
        if (weekPlan && typeof AtlasWeekGenerator !== 'undefined') {
            prompt += AtlasWeekGenerator.generateWeekPrompt(weekPlan);
        }
        
        // Metodologie
        if (methods.length > 0 && typeof MethodSelector !== 'undefined') {
            prompt += MethodSelector.generatePromptSection(methods);
        }
        
        // Structural Balance
        if (typeof AtlasStructuralBalance !== 'undefined' && weekParams.athleteId) {
            try {
                const sbAnalysis = AtlasStructuralBalance.getFullAnalysis(weekParams.athleteId, weekParams.athlete || {});
                if (sbAnalysis?.analysis && AtlasStructuralBalance.generateBalancePrompt) {
                    prompt += AtlasStructuralBalance.generateBalancePrompt(sbAnalysis.analysis);
                } else if (sbAnalysis?.analysis?.issues?.length > 0) {
                    prompt += `\n⚖️ SQUILIBRI STRUTTURALI:\n`;
                    prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                    sbAnalysis.analysis.issues.forEach(issue => {
                        prompt += `${issue.type === 'critical' ? '🔴' : '🟡'} ${issue.message}\n`;
                        if (issue.correction) {
                            prompt += `   → Correzione: ${issue.correction}\n`;
                        }
                    });
                    prompt += `\n⚠️ OBBLIGATORIO: Includere esercizi correttivi nel workout!\n`;
                    prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                }
            } catch (e) {
                console.warn('Structural balance prompt generation failed:', e);
            }
        }
        
        // Auto-adjuster
        if (autoAnalysis?.decision?.action !== 'CONTINUE' && typeof AtlasAutoAdjuster !== 'undefined') {
            prompt += AtlasAutoAdjuster.generateAnalysisPrompt(autoAnalysis);
        }
        
        // Regole finali
        prompt += `\n${'═'.repeat(60)}\n`;
        prompt += `⛔ REGOLE ASSOLUTE:\n`;
        prompt += `1. Intensità: ${weekParams.intensity_target}%\n`;
        prompt += `2. RPE target: ${weekParams.rpe_target}\n`;
        prompt += `3. Usa almeno 1 metodologia dalla lista\n`;
        prompt += `4. Recupero: ${weekParams.rest_range?.min || 60}-${weekParams.rest_range?.max || 120}s\n`;
        prompt += `${'═'.repeat(60)}\n`;
        
        return prompt;
    },
    
    /**
     * Registra feedback workout
     */
    recordWorkoutV2(athleteId, workoutData) {
        return AtlasProgressTracker?.recordWorkout(athleteId, workoutData) || { error: 'ProgressTracker non caricato' };
    },
    
    /**
     * Registra feedback settimanale
     */
    recordWeeklyFeedbackV2(athleteId, weekData) {
        return AtlasProgressTracker?.recordWeeklyFeedback(athleteId, weekData) || { error: 'ProgressTracker non caricato' };
    },
    
    /**
     * Avanza alla settimana successiva
     */
    advanceWeekV2(athleteId) {
        const progress = AtlasProgressTracker?.load(athleteId);
        if (!progress) return { error: 'Atleta non trovato' };
        
        const macroTemplate = AtlasMacroPlanner.macroTemplates[progress.macro_plan.goal] 
            || AtlasMacroPlanner.macroTemplates.ipertrofia;
        
        // Check auto-adjuster
        const analysis = AtlasAutoAdjuster?.analyze(progress, macroTemplate);
        
        if (analysis?.decision?.action === 'SKIP_TO_DELOAD') {
            return AtlasAutoAdjuster.applyAdjustment(athleteId, analysis.decision, macroTemplate);
        }
        
        if (analysis?.decision?.action === 'EXTEND_PHASE') {
            return AtlasAutoAdjuster.applyAdjustment(athleteId, analysis.decision, macroTemplate);
        }
        
        return AtlasProgressTracker.advanceWeek(athleteId, macroTemplate);
    },
    
    /**
     * Gestisci evento speciale (malattia, vacanza, etc.)
     */
    handleEventV2(athleteId, event) {
        const progress = AtlasProgressTracker?.load(athleteId);
        if (!progress) return { error: 'Atleta non trovato' };
        
        const macroTemplate = AtlasMacroPlanner.macroTemplates[progress.macro_plan.goal];
        return AtlasAutoAdjuster?.handleSpecialEvent(athleteId, event, macroTemplate);
    },
    
    /**
     * Ottieni report atleta completo
     */
    getAthleteReportV2(athleteId) {
        return AtlasProgressTracker?.getProgressSummary(athleteId) || { error: 'ProgressTracker non caricato' };
    },
    
    /**
     * Analisi equilibrio strutturale
     */
    analyzeStructuralBalance(athleteLifts) {
        if (typeof AtlasStructuralBalance === 'undefined') {
            return { error: 'StructuralBalance non caricato' };
        }
        return AtlasStructuralBalance.analyzeBalance({ lifts: athleteLifts });
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // LEGACY METHODS (v1.0 compatibility)
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Genera prompt intelligente per AI
    generatePrompt(context) {
        return this.metaPromptGenerator.generate(context);
    },
    
    // Valida workout contro principi primi
    validateWithPrinciples(workout, context) {
        return this.reasoningEngine.validateAgainstPrinciples({ exercises: workout.exercises }, context);
    },
    
    // Analizza programmazione temporale
    analyzeProgram(sessions) {
        return this.temporalCoherence.analyzeProgram(sessions);
    },
    
    // Registra feedback
    recordFeedback(workoutId, outcome) {
        return this.evolution.recordOutcome(workoutId, outcome);
    },
    
    // Ottieni stato di coscienza
    getConsciousnessState() {
        return {
            version: this.VERSION,
            codename: this.CODENAME,
            decisionsLogged: this.consciousness.decisionLog.length,
            avoidPatterns: this.consciousness.avoidPatterns.length,
            feedbackRecorded: Object.keys(this.evolution.feedbackDB || {}).length,
            insightsLearned: Object.keys(JSON.parse(localStorage.getItem('atlas_insights') || '{}')).length,
            v2_modules: this.checkModules()
        };
    }
};

// Auto-init
ATLAS.init();

window.ATLAS = ATLAS;
console.log('🧬 ATLAS v2.0 NASA-Level loaded');
console.log('   → v2.0 Methods:');
console.log('   → ATLAS.initializeAthlete(profile) - Initialize athlete');
console.log('   → ATLAS.generateWorkoutV2(athleteId) - Generate workout with full system');
console.log('   → ATLAS.advanceWeekV2(athleteId) - Advance to next week');
console.log('   → ATLAS.analyzeStructuralBalance(lifts) - Structural balance check');
console.log('   → Legacy v1.0 methods still available');
