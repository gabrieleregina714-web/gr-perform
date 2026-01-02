// GR Perform - Weekly Logic System
// Logica "umana" per programmazione settimanale

const WeeklyLogic = {

    // ═══════════════════════════════════════════════════════════════════════════
    // LOGICA SETTIMANALE PER SPORT
    // Come ragionerebbe un coach umano
    // ═══════════════════════════════════════════════════════════════════════════

    weeklyPatterns: {
        boxe: {
            description: "Boxing Week Structure",
            days: {
                1: {
                    name: "Power Day",
                    reasoning: "Dopo il riposo del weekend, sei fresco. Oggi spingiamo sulla potenza.",
                    focus: "Heavy Bag Power + Lower Body Strength",
                    intensity: "Alta",
                    volume: "Medio",
                    mainLifts: ["Back Squat", "Trap Bar Deadlift", "Goblet Squat"],
                    boxing: ["Heavy Bag power rounds", "Power combos (1-2, 1-2-3)"],
                    conditioning: "Breve ma intenso",
                    notes: "Focus sulla qualità dei colpi, non sulla quantità"
                },
                2: {
                    name: "Speed & Technique Day",
                    reasoning: "Ieri hai spinto pesante, oggi lavoriamo sulla velocità e tecnica.",
                    focus: "Speed Bag + Upper Body + Footwork",
                    intensity: "Media",
                    volume: "Medio",
                    mainLifts: ["Bench Press", "Rows", "Shoulder Press", "Pull-ups"],
                    boxing: ["Speed Bag", "Shadow Boxing tecnico", "Footwork drills", "Pad work simulation"],
                    conditioning: "Intervalli brevi, recupero completo",
                    notes: "Oggi non cerchiamo la fatica, cerchiamo la precisione"
                },
                3: {
                    name: "Endurance & Conditioning Day",
                    reasoning: "Domani riposi, quindi possiamo spingere sul volume.",
                    focus: "Long Rounds + Circuits + Full Body",
                    intensity: "Media",
                    volume: "Alto",
                    mainLifts: ["Romanian Deadlift", "Lunges", "Push-ups", "Core work"],
                    boxing: ["Extended rounds (4-5min)", "Combo chains", "Shadow boxing continuo"],
                    conditioning: "Circuiti lunghi, Jump Rope intervals",
                    notes: "Costruiamo la base aerobica e la resistenza specifica"
                }
            }
        },

        calcio: {
            description: "Football Week Structure",
            days: {
                1: {
                    name: "Speed & Power Day",
                    reasoning: "Inizio settimana, gambe fresche. Lavoro esplosivo.",
                    focus: "Sprint + Plyometrics + Lower Body Power",
                    intensity: "Alta",
                    volume: "Basso",
                    mainLifts: ["Back Squat", "Power Clean", "Box Jumps"],
                    sport: ["Sprint 10-30m", "Acceleration drills", "Agility ladder"],
                    conditioning: "Sprints brevi con recupero completo",
                    notes: "Qualità > Quantità. Recupero totale tra le ripetizioni."
                },
                2: {
                    name: "Strength Endurance Day",
                    reasoning: "Ieri velocità, oggi resistenza alla forza.",
                    focus: "Repeated Sprint Ability + Strength Endurance",
                    intensity: "Media",
                    volume: "Medio-Alto",
                    mainLifts: ["Trap Bar Deadlift", "Bulgarian Split Squat", "Nordic Curls"],
                    sport: ["RSA drills", "Yo-Yo test intervals", "Small-sided game simulation"],
                    conditioning: "Intervalli 4x4min o 30-30",
                    notes: "Simuliamo le richieste della partita"
                },
                3: {
                    name: "Agility & Prevention Day",
                    reasoning: "Pre-partita o pre-riposo. Focus su agilità e prevenzione.",
                    focus: "COD + Hamstring Prevention + Mobility",
                    intensity: "Media",
                    volume: "Medio",
                    mainLifts: ["Single-leg work", "Hip stability", "Core anti-rotation"],
                    sport: ["T-Test", "5-10-5", "Reactive agility", "Ball work"],
                    conditioning: "Game-like intervals",
                    notes: "Preveniamo infortuni, manteniamo freschezza"
                }
            }
        },

        basket: {
            description: "Basketball Week Structure",
            days: {
                1: {
                    name: "Vertical Power Day",
                    reasoning: "Gambe fresche, lavoriamo sul salto.",
                    focus: "Jump Training + Lower Body Power",
                    intensity: "Alta",
                    volume: "Basso",
                    mainLifts: ["Front Squat", "Trap Bar Deadlift", "Step-ups"],
                    sport: ["Approach jumps", "Depth jumps", "Rim touches"],
                    conditioning: "Court sprints brevi",
                    notes: "Massimizziamo l'altezza del salto"
                },
                2: {
                    name: "Lateral Movement Day",
                    reasoning: "Ieri salti, oggi movimenti laterali e difesa.",
                    focus: "Defensive Slides + Core + Upper Body",
                    intensity: "Media",
                    volume: "Medio",
                    mainLifts: ["Bench Press", "Rows", "Lateral Lunges", "Core work"],
                    sport: ["Defensive slides", "Close-outs", "Lane agility"],
                    conditioning: "Suicides, 17s",
                    notes: "Costruiamo la resistenza difensiva"
                },
                3: {
                    name: "Game Conditioning Day",
                    reasoning: "Simuliamo le richieste della partita.",
                    focus: "Full Court Work + Game Simulation",
                    intensity: "Media-Alta",
                    volume: "Alto",
                    mainLifts: ["Full body circuit", "Medicine ball work"],
                    sport: ["Fast breaks", "5v5 simulation", "Shooting under fatigue"],
                    conditioning: "Game-like intervals 4min on / 2min off",
                    notes: "Abituiamoci a giocare stanchi"
                }
            }
        },

        palestra: {
            description: "Gym Week Structure (PPL)",
            days: {
                1: {
                    name: "Push Day",
                    reasoning: "Inizio settimana con i push. Petto e spalle freschi.",
                    focus: "Chest + Shoulders + Triceps",
                    intensity: "Alta",
                    volume: "Medio",
                    mainLifts: ["Bench Press", "Incline DB Press", "OHP", "Dips"],
                    accessories: ["Lateral Raise", "Tricep Pushdown", "Chest Fly"],
                    conditioning: "Opzionale: HIIT breve",
                    notes: "Primo esercizio pesante, poi volume"
                },
                2: {
                    name: "Pull Day",
                    reasoning: "Ieri push, oggi pull. Equilibrio muscolare.",
                    focus: "Back + Biceps + Rear Delts",
                    intensity: "Alta",
                    volume: "Medio",
                    mainLifts: ["Weighted Pull-ups", "Barbell Row", "Cable Row"],
                    accessories: ["Face Pull", "Bicep Curl", "Rear Delt Fly"],
                    conditioning: "Opzionale: Rowing intervals",
                    notes: "Focus sulla connessione mente-muscolo"
                },
                3: {
                    name: "Legs Day",
                    reasoning: "Gambe riposate, giorno più impegnativo.",
                    focus: "Quads + Hamstrings + Glutes",
                    intensity: "Alta",
                    volume: "Alto",
                    mainLifts: ["Back Squat", "Romanian Deadlift", "Leg Press"],
                    accessories: ["Leg Curl", "Leg Extension", "Calf Raise", "Walking Lunges"],
                    conditioning: "Finisher: Sled push o bike",
                    notes: "Non saltare mai il leg day"
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // GENERA CONTESTO PER GIORNO SPECIFICO
    // ═══════════════════════════════════════════════════════════════════════════

    getDayContext(sport, dayNumber, weekNumber, previousWorkouts = []) {
        const sportKey = String(sport || 'palestra').toLowerCase();
        const pattern = this.weeklyPatterns[sportKey] || this.weeklyPatterns.palestra;
        const dayIndex = ((dayNumber - 1) % 3) + 1; // 1, 2, or 3
        const dayPlan = pattern.days[dayIndex];

        let context = `\n🗓️ LOGICA SETTIMANALE (come ragionerebbe un coach):\n`;
        context += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        context += `📌 OGGI: ${dayPlan.name} (Giorno ${dayNumber}/settimana)\n`;
        context += `💭 RAGIONAMENTO: "${dayPlan.reasoning}"\n`;
        context += `🎯 FOCUS: ${dayPlan.focus}\n`;
        context += `📊 Intensità: ${dayPlan.intensity} | Volume: ${dayPlan.volume}\n\n`;

        // Esercizi consigliati
        context += `💪 ESERCIZI MAIN LIFT CONSIGLIATI:\n`;
        for (const lift of dayPlan.mainLifts) {
            context += `   • ${lift}\n`;
        }

        // Sport-specific o accessories
        if (dayPlan.boxing) {
            context += `\n🥊 BOXING WORK:\n`;
            for (const ex of dayPlan.boxing) {
                context += `   • ${ex}\n`;
            }
        }
        if (dayPlan.sport) {
            context += `\n⚽ SPORT-SPECIFIC:\n`;
            for (const ex of dayPlan.sport) {
                context += `   • ${ex}\n`;
            }
        }
        if (dayPlan.accessories) {
            context += `\n🔧 ACCESSORI:\n`;
            for (const ex of dayPlan.accessories) {
                context += `   • ${ex}\n`;
            }
        }

        context += `\n🏃 CONDITIONING: ${dayPlan.conditioning}\n`;
        context += `📝 NOTE COACH: "${dayPlan.notes}"\n`;

        // Riferimento ai giorni precedenti della settimana
        if (previousWorkouts.length > 0) {
            context += `\n📋 SESSIONI PRECEDENTI QUESTA SETTIMANA:\n`;
            for (let i = 0; i < previousWorkouts.length; i++) {
                const pw = previousWorkouts[i];
                const mainExs = (pw.exercises || [])
                    .filter(e => e.type === 'strength')
                    .slice(0, 2)
                    .map(e => e.name?.substring(0, 40))
                    .join(', ');
                context += `   • Giorno ${i + 1}: ${pw.name || 'Workout'} - Main: ${mainExs || 'N/A'}\n`;
            }
            context += `\n⚠️ IMPORTANTE: Oggi fai esercizi DIVERSI da quelli sopra!\n`;
        }

        // Progressione dalla settimana scorsa
        context += `\n📈 PROGRESSIONE (Settimana ${weekNumber}):\n`;
        if (weekNumber === 1) {
            context += `   Prima settimana: inizia con volumi conservativi.\n`;
            context += `   Impara i movimenti, stabilisci baseline.\n`;
        } else if (weekNumber === 2) {
            context += `   Seconda settimana: +1 set o +2 reps rispetto a settimana 1.\n`;
            context += `   Aumenta leggermente il carico se la tecnica è buona.\n`;
        } else if (weekNumber === 3) {
            context += `   Terza settimana: picco volume. Push it!\n`;
            context += `   +10-15% volume totale rispetto a settimana 2.\n`;
        } else if (weekNumber === 4 || weekNumber % 4 === 0) {
            context += `   Settimana di DELOAD: -40% volume, mantieni intensità.\n`;
            context += `   Recupera, non spingere.\n`;
        } else {
            context += `   Settimana ${weekNumber}: progressione lineare.\n`;
            context += `   +piccoli incrementi su volume o carico.\n`;
        }

        context += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

        return context;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // OTTIENI PIANO COMPLETO SETTIMANA
    // ═══════════════════════════════════════════════════════════════════════════

    getWeekPlan(sport, weekNumber) {
        const sportKey = String(sport || 'palestra').toLowerCase();
        const pattern = this.weeklyPatterns[sportKey] || this.weeklyPatterns.palestra;
        
        return {
            sport: sportKey,
            weekNumber,
            description: pattern.description,
            days: [
                { ...pattern.days[1], dayNumber: 1 },
                { ...pattern.days[2], dayNumber: 2 },
                { ...pattern.days[3], dayNumber: 3 }
            ],
            isDeload: weekNumber % 4 === 0
        };
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // GENERA NOME WORKOUT SENSATO
    // ═══════════════════════════════════════════════════════════════════════════

    generateWorkoutName(sport, dayNumber, weekNumber, phase) {
        const sportKey = String(sport || 'palestra').toLowerCase();
        const pattern = this.weeklyPatterns[sportKey] || this.weeklyPatterns.palestra;
        const dayIndex = ((dayNumber - 1) % 3) + 1;
        const dayPlan = pattern.days[dayIndex];
        
        const phasePrefix = {
            'accumulo': 'GPP',
            'adattamento': 'Base',
            'intensificazione': 'Strength',
            'peaking': 'Peak',
            'deload': 'Recovery'
        };
        
        const prefix = phasePrefix[String(phase).toLowerCase()] || 'Training';
        
        return `${prefix} - ${dayPlan.name}`;
    }
};

// Export
window.WeeklyLogic = WeeklyLogic;
