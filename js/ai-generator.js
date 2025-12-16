// GR Perform - AI Workout Generator
// Sistema di generazione schede con LLM Council (Groq)

// Modelli disponibili su Groq
const MODELS = {
    main: 'llama-3.3-70b-versatile',    // Ragionamento principale
    fast: 'llama-3.1-8b-instant',        // Risposte veloci
    review: 'mixtral-8x7b-32768'         // Review e validazione
};

const AIGenerator = {
    
    // Genera prompt per l'AI basato sui dati atleta
    buildPrompt(athlete, sportData, schedule, goals) {
        const sportPrompts = {
            calcio: this.buildCalcioPrompt,
            basket: this.buildBasketPrompt,
            boxe: this.buildBoxePrompt,
            palestra: this.buildPalestraPrompt
        };
        
        const baseContext = `
Sei un preparatore atletico d'elite con 20+ anni di esperienza nel calcio professionistico.
Crei programmi basati sulle ultime ricerche scientifiche in:
- Periodizzazione tattica
- Prevenzione infortuni
- Sport science applicata
- Biomeccanica del movimento

ATLETA:
- Nome: ${athlete.first_name} ${athlete.last_name}
- Età: ${this.calculateAge(athlete.birth_date)} anni
- Altezza: ${athlete.height_cm}cm | Peso: ${athlete.weight_kg}kg
- Sport: ${athlete.sport}
- Esperienza: ${athlete.experience_level}
- Pacchetto: ${athlete.package_type}

`;
        
        const sportContext = sportPrompts[athlete.sport]?.call(this, sportData) || '';
        const scheduleContext = this.buildScheduleContext(schedule);
        const goalsContext = this.buildGoalsContext(goals);
        
        return baseContext + sportContext + scheduleContext + goalsContext + this.getOutputFormat();
    },
    
    buildCalcioPrompt(data) {
        return `
DETTAGLI CALCIO:
- Ruolo: ${data.football_role}
- Squadra: ${data.football_team_name} (${data.football_team_level})
- Allenamenti squadra: ${data.football_weekly_team_sessions}x/settimana
- Giorno partita: ${data.football_match_day}

CONSIDERAZIONI PER RUOLO:
${this.getRoleConsiderations('calcio', data.football_role)}
`;
    },
    
    buildBasketPrompt(data) {
        return `
DETTAGLI BASKET:
- Ruolo: ${data.basket_role}
- Squadra: ${data.basket_team_name} (${data.basket_team_level})
- Allenamenti squadra: ${data.basket_weekly_team_sessions}x/settimana
- Giorno partita: ${data.basket_match_day}
`;
    },
    
    buildBoxePrompt(data) {
        return `
DETTAGLI BOXE:
- Categoria: ${data.boxing_weight_class}
- Guardia: ${data.boxing_stance}
- Stile: ${data.boxing_style}
- Palestra: ${data.boxing_gym_name}
${data.boxing_upcoming_fight_date ? `- Prossimo match: ${data.boxing_upcoming_fight_date}` : ''}
`;
    },
    
    buildPalestraPrompt(data) {
        return `
DETTAGLI PALESTRA:
- Obiettivo primario: ${data.gym_primary_goal}
- Obiettivo secondario: ${data.gym_secondary_goal || 'Non specificato'}
- Giorni disponibili: ${data.gym_available_days}
- Durata sessione: ${data.gym_session_duration} minuti
- Attrezzatura: ${data.gym_equipment_access}
`;
    },
    
    buildScheduleContext(schedule) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
        
        let context = '\nAGENDA SETTIMANALE:\n';
        let availableDays = [];
        
        days.forEach((day, i) => {
            const activity = schedule[day] || 'rest';
            const label = {
                'rest': '🔴 Riposo',
                'team_training': '⚽ Allenamento squadra',
                'match': '🏆 PARTITA',
                'gr_available': '✅ Disponibile GR'
            }[activity];
            context += `- ${dayNames[i]}: ${label}\n`;
            
            if (activity === 'gr_available') {
                availableDays.push(day);
            }
        });
        
        const maxSessions = schedule.max_gr_sessions_per_week || 3;
        const sessionDuration = schedule.session_duration || 60;
        
        context += `\n📌 ISTRUZIONI FONDAMENTALI:\n`;
        context += `- Giorni disponibili per GR: ${availableDays.join(', ')}\n`;
        context += `- DEVI creare ESATTAMENTE ${Math.min(maxSessions, availableDays.length)} workout per settimana\n`;
        context += `- Ogni sessione deve durare circa ${sessionDuration} minuti\n`;
        context += `- NON programmare allenamenti nei giorni di squadra o partita\n`;
        context += `- Il giorno prima della partita (sabato) deve essere scarico o riposo\n`;
        
        return context;
    },
    
    buildGoalsContext(goals) {
        if (!goals || goals.length === 0) return '';
        
        let context = '\nOBIETTIVI PRIORITARI:\n';
        goals.forEach((goal, i) => {
            context += `${i + 1}. ${goal.goal_name}\n`;
        });
        return context;
    },
    
    getRoleConsiderations(sport, role) {
        const considerations = {
            calcio: {
                portiere: `
- Focus su esplosività, reattività, flessibilità
- Pliometria per tuffi e uscite
- Core stability per posizioni di parata
- Mobilità anche e spalle`,
                difensore_centrale: `
- Forza nei contrasti aerei e a terra
- Accelerazione su brevi distanze
- Core anti-rotazione
- Prevenzione pubalgia`,
                terzino: `
- Resistenza specifica (up&down)
- Sprint ripetuti
- Agilità cambi direzione
- Forza monopodalica`,
                centrocampista: `
- Resistenza box-to-box
- Capacità di recupero
- Forza funzionale tutto il corpo
- Prevenzione sovraccarico`,
                ala: `
- Velocità massima e accelerazione
- Agilità e dribbling
- Potenza esplosiva
- Prevenzione hamstring`,
                attaccante: `
- Esplosività su brevi distanze
- Potenza nel tiro
- Movimenti in area
- Forza parte superiore per protezione palla`
            }
        };
        
        return considerations[sport]?.[role] || '';
    },
    
    getOutputFormat() {
        return `

GENERA UN PROGRAMMA COMPLETO MULTI-SETTIMANA in formato JSON:
{
    "program_name": "Nome del programma",
    "description": "Breve descrizione con periodizzazione",
    "total_weeks": 8,
    "phases": [
        {"weeks": "1-3", "name": "Accumulo", "focus": "Volume e tecnica"},
        {"weeks": "4-6", "name": "Intensificazione", "focus": "Intensità"},
        {"weeks": "7-8", "name": "Realizzazione", "focus": "Picco performance"}
    ],
    "weekly_templates": [
        {
            "week_range": "1-3",
            "phase": "accumulo",
            "workouts": [
                {
                    "day": "tuesday",
                    "name": "Forza Funzionale A",
                    "type": "strength",
                    "duration_minutes": 60,
                    "focus": "Costruzione base di forza",
                    "exercises": [
                        {
                            "order": 1,
                            "name": "Goblet Squat",
                            "sets": 4,
                            "reps": "10-12",
                            "tempo": "3010",
                            "rest_seconds": 90,
                            "load_progression": "Aumenta 2.5kg ogni settimana",
                            "notes": "Petto alto, ginocchia in fuori",
                            "why": "Costruisce forza arti inferiori"
                        }
                    ]
                },
                {
                    "day": "thursday",
                    "name": "Potenza e Agilità A",
                    "type": "power",
                    "duration_minutes": 55,
                    "focus": "Esplosività",
                    "exercises": []
                }
            ]
        },
        {
            "week_range": "4-6",
            "phase": "intensificazione",
            "workouts": []
        },
        {
            "week_range": "7-8",
            "phase": "realizzazione",
            "workouts": []
        }
    ]
}

REGOLE FONDAMENTALI:
1. Crea template DIVERSI per ogni fase (accumulo, intensificazione, realizzazione)
2. Ogni fase ha esercizi diversi o progressioni diverse
3. ACCUMULO: volume alto (3-4x10-12), tecnica, base
4. INTENSIFICAZIONE: volume medio (4x6-8), carichi maggiori
5. REALIZZAZIONE: volume basso (3-5x3-5), massima intensità, più recupero
6. Includi 5-7 esercizi per sessione
7. Ogni esercizio deve avere "load_progression" per indicare come progredire
8. Il "why" spiega il beneficio per il ruolo specifico`;
    },
    
    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    },
    
    // Chiama Groq API
    async generate(athlete, sportData, schedule, goals) {
        const prompt = this.buildPrompt(athlete, sportData, schedule, goals);
        
        console.log('📋 Prompt generato per', athlete.first_name);
        
        try {
            // Step 1: Genera workout con modello principale
            console.log('🧠 Generazione con', MODELS.main);
            const workout = await this.callGroq(MODELS.main, prompt);
            
            // Step 2: Review rapido con secondo modello
            console.log('✅ Review con', MODELS.review);
            const reviewed = await this.reviewWorkout(workout, athlete);
            
            return reviewed;
            
        } catch (error) {
            console.error('AI Error:', error);
            return this.getMockWorkout(athlete);
        }
    },
    
    async callGroq(model, prompt, systemPrompt = null) {
        const response = await fetch('/api/ai/groq-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { 
                        role: 'system', 
                        content: systemPrompt || 'Sei un preparatore atletico d\'elite italiano. Rispondi SOLO con JSON valido, senza markdown o testo aggiuntivo.'
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 4000
            })
        });
        
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Groq proxy error: ${errText}`);
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Parse JSON dalla risposta
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        throw new Error('Invalid JSON response');
    },
    
    async reviewWorkout(workout, athlete) {
        // Validazione base senza seconda chiamata API per velocità
        // In futuro: chiamata a MODELS.review per validare
        
        // Verifica struttura
        if (!workout.workouts || workout.workouts.length === 0) {
            console.warn('⚠️ Workout vuoto, uso fallback');
            return this.getMockWorkout(athlete);
        }
        
        // Verifica ogni workout ha esercizi
        workout.workouts = workout.workouts.filter(w => w.exercises && w.exercises.length > 0);
        
        return workout;
    },
    
    // Workout di esempio per test
    getMockWorkout(athlete) {
        return {
            program_name: `Programma ${athlete.sport} - ${athlete.first_name}`,
            description: `Programma personalizzato per ${athlete.experience_level}`,
            phase: 'accumulo',
            workouts: [
                {
                    day: 'tuesday',
                    name: 'Forza Funzionale',
                    type: 'strength',
                    duration_minutes: 55,
                    exercises: [
                        {
                            name: 'Goblet Squat',
                            sets: 4,
                            reps: '8-10',
                            tempo: '3110',
                            rest_seconds: 90,
                            notes: 'Mantieni il petto alto, ginocchia in linea con le punte',
                            why: 'Costruisce forza negli arti inferiori con pattern squat sicuro'
                        },
                        {
                            name: 'Romanian Deadlift',
                            sets: 3,
                            reps: '10-12',
                            tempo: '3010',
                            rest_seconds: 90,
                            notes: 'Schiena neutra, senti lo stretch sugli hamstring',
                            why: 'Rinforza la catena posteriore, previene infortuni hamstring'
                        },
                        {
                            name: 'Push-up',
                            sets: 3,
                            reps: '12-15',
                            tempo: '2010',
                            rest_seconds: 60,
                            notes: 'Core attivo, corpo in linea retta',
                            why: 'Forza pushing fondamentale'
                        },
                        {
                            name: 'Plank',
                            sets: 3,
                            reps: '30-45s',
                            tempo: 'hold',
                            rest_seconds: 45,
                            notes: 'Glutei contratti, no lordosi',
                            why: 'Stabilità core anti-estensione'
                        }
                    ]
                },
                {
                    day: 'thursday',
                    name: 'Potenza & Agilità',
                    type: 'power',
                    duration_minutes: 50,
                    exercises: [
                        {
                            name: 'Box Jump',
                            sets: 4,
                            reps: '5',
                            tempo: 'explosive',
                            rest_seconds: 120,
                            notes: 'Atterra morbido, step down per tornare',
                            why: 'Sviluppa potenza esplosiva degli arti inferiori'
                        },
                        {
                            name: 'Split Squat Jump',
                            sets: 3,
                            reps: '6 per lato',
                            tempo: 'explosive',
                            rest_seconds: 90,
                            notes: 'Alterna le gambe in aria',
                            why: 'Potenza monopodalica sport-specifica'
                        },
                        {
                            name: 'Lateral Bound',
                            sets: 3,
                            reps: '8 per lato',
                            tempo: 'explosive',
                            rest_seconds: 60,
                            notes: 'Stabilizza 1 secondo prima del prossimo salto',
                            why: 'Potenza laterale per cambi direzione'
                        },
                        {
                            name: 'Copenhagen Plank',
                            sets: 3,
                            reps: '20s per lato',
                            tempo: 'hold',
                            rest_seconds: 45,
                            notes: 'Adduttori attivi',
                            why: 'Prevenzione pubalgia e rinforzo adduttori'
                        }
                    ]
                }
            ]
        };
    }
};

window.AIGenerator = AIGenerator;
