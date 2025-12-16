// GR Perform - Sistema AI Elite
// Generazione adattiva multi-fase

const GROQ_API_KEY = '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';
const MODELS = {
    main: 'llama-3.3-70b-versatile',
    fast: 'llama-3.1-8b-instant'
};

const GREliteAI = {
    
    // FASE 1: Genera macro-periodizzazione
    async generateMacroPlan(athlete, sportData, schedule, goals, weeks = 8) {
        console.log('📊 Generazione Macro-Plan...');
        
        const prompt = `
Sei un preparatore atletico d'elite. Crea un MACRO-PIANO di periodizzazione.

ATLETA:
- Nome: ${athlete.first_name} ${athlete.last_name}
- Sport: ${athlete.sport} | Ruolo: ${sportData.football_role || sportData.basket_role || sportData.boxing_weight_class || sportData.gym_primary_goal}
- Livello: ${athlete.experience_level}
- Età: ${this.calculateAge(athlete.birth_date)} anni

DURATA: ${weeks} settimane
SESSIONI/SETTIMANA: ${schedule.max_gr_sessions_per_week || 3}

Genera SOLO JSON:
{
    "plan_name": "Nome piano",
    "total_weeks": ${weeks},
    "overview": "Descrizione generale del piano",
    "phases": [
        {
            "phase_number": 1,
            "name": "Accumulo",
            "weeks": [1, 2, 3],
            "focus": "Obiettivo principale",
            "volume": "alto|medio|basso",
            "intensity": "alta|media|bassa",
            "key_exercises_categories": ["forza base", "core", "prevenzione"],
            "weekly_structure": {
                "day1_focus": "Forza lower body",
                "day2_focus": "Potenza + upper body"
            },
            "progression_notes": "Come progredire settimana per settimana"
        }
    ],
    "deload_weeks": [4, 8],
    "testing_weeks": [1, ${weeks}],
    "key_metrics_to_track": ["squat 1RM stimato", "CMJ", "tempo 10m"]
}

Crea 3-4 fasi realistiche per ${weeks} settimane. Sii specifico per il ruolo ${sportData.football_role || sportData.basket_role || 'atleta'}.`;

        return await this.callGroq(prompt);
    },
    
    // FASE 2: Genera settimana specifica
    async generateWeek(athlete, sportData, schedule, macroPlan, weekNumber, feedback = null, biometrics = null) {
        console.log(`📅 Generazione Settimana ${weekNumber}...`);
        
        // Trova la fase corrente
        const currentPhase = macroPlan.phases.find(p => p.weeks.includes(weekNumber));
        let isDeload = macroPlan.deload_weeks?.includes(weekNumber);
        
        // Costruisci biometrics context dai wearables
        let biometricsContext = '';
        if (biometrics && biometrics.hasData) {
            const readiness = biometrics.readiness;
            
            // Auto-trigger deload se readiness critica
            if (readiness.score < 40) {
                isDeload = true;
            }
            
            biometricsContext = `
📊 DATI BIOMETRICI WEARABLE (${biometrics.source}):
- HRV Media: ${biometrics.hrv?.average || 'N/A'} ms (${biometrics.hrv?.trend || 'stabile'})
- RHR: ${biometrics.rhr?.current || 'N/A'} bpm (baseline: ${biometrics.rhr?.baseline || 'N/A'})
- Sonno: ${biometrics.sleep?.duration || 'N/A'}h, qualità ${biometrics.sleep?.quality || 'N/A'}%
- Strain/Carico: ${biometrics.strain?.daily || 'N/A'}/21
- Recovery Score: ${biometrics.recovery?.score || 'N/A'}%

🎯 READINESS CALCOLATA: ${readiness.score}/100 - ${readiness.status}
${readiness.recommendations?.map(r => `• ${r}`).join('\n') || ''}

${readiness.score < 50 ? '⚠️ READINESS BASSA: Riduci intensità e volume, focus recupero attivo' : ''}
${readiness.score >= 80 ? '💪 READINESS OTTIMA: Puoi spingere su intensità e carichi' : ''}
${biometrics.hrv?.trend === 'declining' ? '📉 HRV IN CALO: Segno di accumulo fatica, considera recupero extra' : ''}
${biometrics.rhr?.elevated ? '❤️ RHR ELEVATA: Possibile stress/overtraining, riduci intensità' : ''}
`;
        }
        
        // Costruisci feedback context dal weekly feedback completo
        let feedbackContext = '';
        if (feedback) {
            // Check if athlete requested deload
            if (feedback.preferences?.request_deload) {
                isDeload = true;
            }
            
            feedbackContext = `
FEEDBACK SETTIMANALE ATLETA:
- Fatica generale: ${feedback.fatigue_level || feedback.fatigue}/10
- Qualità sonno: ${feedback.sleep_quality}/5 (${feedback.sleep_hours}h/notte)
- Stress vita: ${feedback.stress_level}/10
- Nutrizione: ${feedback.nutrition_quality}/4
- Motivazione: ${feedback.motivation_level}/10
- Readiness Score: ${feedback.readiness_score}/10

${feedback.pain_areas?.length > 0 ? `⚠️ ZONE DOLORANTI: ${feedback.pain_areas.join(', ')}
${feedback.pain_notes ? 'Dettagli: ' + feedback.pain_notes : ''}
ADATTA GLI ESERCIZI per evitare stress su queste zone!` : ''}

${feedback.fatigue_level >= 7 ? '⚠️ ATLETA MOLTO AFFATICATO: Riduci volume 30%, evita cedimento' : ''}
${feedback.stress_level >= 7 ? '⚠️ STRESS ALTO: Sessioni più corte, focus su movimento e non intensità' : ''}
${feedback.sleep_quality <= 2 ? '⚠️ SONNO SCARSO: Riduci volume, più mobilità e recupero attivo' : ''}
${feedback.motivation_level >= 8 ? '💪 MOTIVAZIONE ALTA: Puoi spingere di più su intensità' : ''}
${feedback.preferences?.focus_mobility ? '🧘 RICHIESTA: Aggiungi più esercizi di mobilità' : ''}
${feedback.preferences?.increase_intensity ? '🔥 RICHIESTA: Aumenta intensità se possibile' : ''}

NOTE COACH: ${feedback.coach_notes || 'Nessuna'}
`;
        }

        const prompt = `
Sei un preparatore atletico d'elite. Genera gli allenamenti per la SETTIMANA ${weekNumber}.

ATLETA: ${athlete.first_name} ${athlete.last_name}
SPORT: ${athlete.sport} | RUOLO: ${sportData.football_role || sportData.basket_role || sportData.boxing_weight_class || 'generale'}

FASE CORRENTE: ${currentPhase?.name || 'Base'}
- Focus: ${currentPhase?.focus || 'Costruzione'}
- Volume: ${currentPhase?.volume || 'medio'}
- Intensità: ${currentPhase?.intensity || 'media'}
${isDeload ? '🔄 SETTIMANA DI SCARICO: Volume -40%, niente cedimento' : ''}

GIORNI DISPONIBILI GR:
${this.getAvailableDays(schedule).map(d => `- ${d}`).join('\n')}

${biometricsContext}

${feedbackContext}

STRUTTURA RICHIESTA:
- ${currentPhase?.weekly_structure?.day1_focus || 'Forza'}
- ${currentPhase?.weekly_structure?.day2_focus || 'Potenza'}

Genera SOLO JSON:
{
    "week_number": ${weekNumber},
    "phase": "${currentPhase?.name || 'Base'}",
    "is_deload": ${isDeload || false},
    "coach_notes": "Note per il coach su questa settimana",
    "workouts": [
        {
            "day": "tuesday",
            "name": "Nome sessione",
            "type": "strength|power|conditioning",
            "duration_minutes": 60,
            "warmup": {
                "duration": 10,
                "exercises": ["Foam roll 2min", "Mobilità anche 3min", "Attivazione glutei 2x10"]
            },
            "main_workout": [
                {
                    "order": 1,
                    "category": "compound|accessory|core|prevention",
                    "name": "Nome esercizio",
                    "sets": 4,
                    "reps": "8-10",
                    "tempo": "3010",
                    "rest_seconds": 90,
                    "RPE_target": 7,
                    "load_suggestion": "70% 1RM o 20kg",
                    "technique_cues": ["Cue 1", "Cue 2", "Cue 3"],
                    "why": "Beneficio specifico per il ruolo",
                    "alternatives": ["Alternativa 1", "Alternativa 2"]
                }
            ],
            "cooldown": {
                "duration": 5,
                "exercises": ["Stretching hamstring 30s x2", "Stretching hip flexor 30s x2"]
            }
        }
    ],
    "weekly_tips": "Consigli per l'atleta questa settimana",
    "nutrition_focus": "Focus nutrizionale della settimana",
    "recovery_priority": "bassa|media|alta"
}

Genera ${this.getAvailableDays(schedule).length} workout completi con 5-6 esercizi nel main_workout.`;

        return await this.callGroq(prompt);
    },
    
    // Helper: giorni disponibili
    getAvailableDays(schedule) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayNames = {
            monday: 'Lunedì', tuesday: 'Martedì', wednesday: 'Mercoledì',
            thursday: 'Giovedì', friday: 'Venerdì', saturday: 'Sabato', sunday: 'Domenica'
        };
        return days.filter(d => schedule[d] === 'gr_available').map(d => dayNames[d]);
    },
    
    // Helper: età
    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    },
    
    // Chiamata Groq
    async callGroq(prompt) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: MODELS.main,
                messages: [
                    { role: 'system', content: 'Sei un preparatore atletico d\'elite italiano. Rispondi SOLO con JSON valido.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 4000
            })
        });
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Invalid JSON');
    },
    
    // WORKFLOW COMPLETO per nuovo atleta
    async onboardAthlete(athleteId) {
        // 1. Carica dati atleta
        const athlete = (await supabase.fetch('athletes', `?id=eq.${athleteId}`))[0];
        const sportData = (await supabase.fetch('sport_specific_data', `?athlete_id=eq.${athleteId}`))[0] || {};
        const schedule = (await supabase.fetch('weekly_schedule', `?athlete_id=eq.${athleteId}`))[0] || {};
        
        // 2. Genera macro-plan
        const macroPlan = await this.generateMacroPlan(athlete, sportData, schedule, [], 8);
        
        // 3. Salva macro-plan nel database
        const [program] = await supabase.insert('programs', {
            athlete_id: athleteId,
            name: macroPlan.plan_name,
            description: macroPlan.overview,
            program_type: athlete.package_type,
            total_weeks: macroPlan.total_weeks,
            periodization_type: 'block',
            phase: macroPlan.phases[0]?.name || 'Accumulo',
            status: 'active',
            start_date: new Date().toISOString().split('T')[0]
        });
        
        // 4. Genera prima settimana
        const week1 = await this.generateWeek(athlete, sportData, schedule, macroPlan, 1);
        
        // 5. Salva workout settimana 1 (in attesa review coach)
        for (let workout of week1.workouts) {
            await supabase.insert('workouts', {
                program_id: program.id,
                athlete_id: athleteId,
                week_number: 1,
                day_of_week: workout.day,
                name: workout.name,
                workout_type: workout.type,
                exercises: {
                    warmup: workout.warmup,
                    main: workout.main_workout,
                    cooldown: workout.cooldown
                },
                ai_generated: true,
                ai_generation_prompt: JSON.stringify({ week: 1, phase: week1.phase }),
                reviewed_by_coach: false,
                coach_notes: week1.coach_notes,
                estimated_duration_minutes: workout.duration_minutes,
                status: 'pending_review'
            });
        }
        
        return {
            program,
            macroPlan,
            week1
        };
    },
    
    // Genera prossima settimana (con feedback)
    async generateNextWeek(athleteId, programId, currentWeek, feedback = null, biometrics = null) {
        const athlete = (await supabase.fetch('athletes', `?id=eq.${athleteId}`))[0];
        const sportData = (await supabase.fetch('sport_specific_data', `?athlete_id=eq.${athleteId}`))[0] || {};
        const schedule = (await supabase.fetch('weekly_schedule', `?athlete_id=eq.${athleteId}`))[0] || {};
        const program = (await supabase.fetch('programs', `?id=eq.${programId}`))[0];
        
        // Usa feedback dal database se non passato
        if (!feedback && athlete.latest_weekly_feedback) {
            feedback = athlete.latest_weekly_feedback;
        }
        
        // Recupera dati biometrici se non passati
        if (!biometrics && athlete.biometrics_data) {
            biometrics = athlete.biometrics_data;
        }
        
        // Analizza anche i feedback dei singoli workout della settimana
        const weekWorkouts = await supabase.fetch('workouts', 
            `?athlete_id=eq.${athleteId}&week_number=eq.${currentWeek}&status=eq.completed`
        );
        
        // Calcola RPE medio e sensazioni dalla settimana
        let avgRPE = 0;
        let avgFeeling = 0;
        let workoutNotes = [];
        weekWorkouts.forEach(w => {
            if (w.athlete_feedback?.rpe) avgRPE += w.athlete_feedback.rpe;
            if (w.athlete_feedback?.feeling) avgFeeling += w.athlete_feedback.feeling;
            if (w.athlete_feedback?.notes) workoutNotes.push(w.athlete_feedback.notes);
        });
        if (weekWorkouts.length > 0) {
            avgRPE = avgRPE / weekWorkouts.length;
            avgFeeling = avgFeeling / weekWorkouts.length;
        }
        
        // Aggiungi dati workout al feedback
        if (feedback) {
            feedback.workout_avg_rpe = avgRPE.toFixed(1);
            feedback.workout_avg_feeling = avgFeeling.toFixed(1);
            feedback.workout_notes = workoutNotes.join(' | ');
        }
        
        // Ricostruisci macro-plan
        const macroPlan = {
            phases: [
                { name: 'Accumulo', weeks: [1, 2, 3], focus: 'Volume', volume: 'alto', intensity: 'media' },
                { name: 'Intensificazione', weeks: [4, 5, 6], focus: 'Intensità', volume: 'medio', intensity: 'alta' },
                { name: 'Realizzazione', weeks: [7, 8], focus: 'Picco', volume: 'basso', intensity: 'molto alta' }
            ],
            deload_weeks: [4, 8]
        };
        
        const nextWeek = currentWeek + 1;
        const weekData = await this.generateWeek(athlete, sportData, schedule, macroPlan, nextWeek, feedback, biometrics);
        
        // Salva workout
        for (let workout of weekData.workouts) {
            await supabase.insert('workouts', {
                program_id: programId,
                athlete_id: athleteId,
                week_number: nextWeek,
                day_of_week: workout.day,
                name: workout.name,
                workout_type: workout.type,
                exercises: {
                    warmup: workout.warmup,
                    main: workout.main_workout,
                    cooldown: workout.cooldown
                },
                ai_generated: true,
                reviewed_by_coach: false,
                coach_notes: weekData.coach_notes,
                estimated_duration_minutes: workout.duration_minutes,
                status: 'pending_review'
            });
        }
        
        // Aggiorna settimana corrente nel programma
        await supabase.update('programs', programId, { current_week: nextWeek });
        
        return weekData;
    }
};

window.GREliteAI = GREliteAI;
