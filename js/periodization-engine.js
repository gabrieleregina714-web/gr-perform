// GR Perform - Periodization Engine
// Sistema intelligente di periodizzazione automatica

const PeriodizationEngine = {

    // ═══════════════════════════════════════════════════════════════════════════
    // MODELLI DI PERIODIZZAZIONE
    // ═══════════════════════════════════════════════════════════════════════════

    models: {
        // Periodizzazione lineare classica (4 settimane)
        linear_4week: {
            name: "Lineare 4 Settimane",
            description: "Classica: accumulo → intensificazione → picco → deload",
            weeks: {
                1: { phase: 'accumulo', volume: 100, intensity: 70, rpe_target: 6.5, focus: 'Base building' },
                2: { phase: 'accumulo', volume: 110, intensity: 75, rpe_target: 7.0, focus: 'Volume increase' },
                3: { phase: 'intensificazione', volume: 90, intensity: 85, rpe_target: 8.0, focus: 'Intensity peak' },
                4: { phase: 'deload', volume: 60, intensity: 65, rpe_target: 5.0, focus: 'Recovery' }
            }
        },

        // Periodizzazione ondulata settimanale
        undulating_weekly: {
            name: "Ondulata Settimanale",
            description: "Varia intensità ogni settimana",
            weeks: {
                1: { phase: 'accumulo', volume: 100, intensity: 70, rpe_target: 7.0, focus: 'Hypertrophy' },
                2: { phase: 'intensificazione', volume: 85, intensity: 85, rpe_target: 8.0, focus: 'Strength' },
                3: { phase: 'accumulo', volume: 110, intensity: 72, rpe_target: 7.0, focus: 'Volume' },
                4: { phase: 'deload', volume: 55, intensity: 60, rpe_target: 5.0, focus: 'Recovery' }
            }
        },

        // Periodizzazione per sport (8 settimane)
        sport_8week: {
            name: "Sport 8 Settimane",
            description: "GPP → Forza → Potenza → Specifico",
            weeks: {
                1: { phase: 'gpp', volume: 100, intensity: 65, rpe_target: 6.0, focus: 'General conditioning' },
                2: { phase: 'gpp', volume: 110, intensity: 68, rpe_target: 6.5, focus: 'Volume base' },
                3: { phase: 'forza_base', volume: 100, intensity: 75, rpe_target: 7.0, focus: 'Strength introduction' },
                4: { phase: 'forza_base', volume: 105, intensity: 78, rpe_target: 7.5, focus: 'Strength development' },
                5: { phase: 'potenza', volume: 85, intensity: 85, rpe_target: 8.0, focus: 'Power conversion' },
                6: { phase: 'potenza', volume: 80, intensity: 88, rpe_target: 8.5, focus: 'Power peak' },
                7: { phase: 'specifico', volume: 75, intensity: 80, rpe_target: 7.5, focus: 'Sport-specific' },
                8: { phase: 'taper', volume: 50, intensity: 70, rpe_target: 5.5, focus: 'Competition prep' }
            }
        },

        // Periodizzazione principianti (più conservativa)
        beginner_6week: {
            name: "Principianti 6 Settimane",
            description: "Progressione lenta e sicura",
            weeks: {
                1: { phase: 'adattamento', volume: 70, intensity: 55, rpe_target: 5.0, focus: 'Learn movements' },
                2: { phase: 'adattamento', volume: 80, intensity: 60, rpe_target: 5.5, focus: 'Build habit' },
                3: { phase: 'accumulo', volume: 90, intensity: 65, rpe_target: 6.0, focus: 'Volume intro' },
                4: { phase: 'accumulo', volume: 95, intensity: 68, rpe_target: 6.5, focus: 'Progressive overload' },
                5: { phase: 'intensificazione', volume: 85, intensity: 72, rpe_target: 7.0, focus: 'Intensity intro' },
                6: { phase: 'deload', volume: 60, intensity: 55, rpe_target: 5.0, focus: 'Test & recover' }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SELEZIONE AUTOMATICA DEL MODELLO
    // ═══════════════════════════════════════════════════════════════════════════

    selectModel(athleteContext) {
        const exp = String(athleteContext.experience_level || '').toLowerCase();
        const sport = String(athleteContext.sport || '').toLowerCase();
        const goal = String(athleteContext.goal || '').toLowerCase();

        // Principianti → modello conservativo
        if (exp === 'principiante' || exp === 'beginner') {
            return 'beginner_6week';
        }

        // Sport specifici → 8 settimane
        if (['boxe', 'boxing', 'calcio', 'football', 'basket', 'basketball', 'rugby', 'mma'].includes(sport)) {
            return 'sport_8week';
        }

        // Goal ipertrofia o estetico → ondulata
        if (goal.includes('ipertrofia') || goal.includes('massa') || goal.includes('hypertrophy') || goal.includes('aesthetic')) {
            return 'undulating_weekly';
        }

        // Default → lineare 4 settimane
        return 'linear_4week';
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // CALCOLO PARAMETRI SETTIMANA
    // ═══════════════════════════════════════════════════════════════════════════

    getWeekParameters(weekNumber, athleteContext = {}) {
        const modelKey = this.selectModel(athleteContext);
        const model = this.models[modelKey];
        const totalWeeks = Object.keys(model.weeks).length;
        
        // Cicla se oltre il numero di settimane
        const weekInCycle = ((weekNumber - 1) % totalWeeks) + 1;
        const cycleNumber = Math.floor((weekNumber - 1) / totalWeeks) + 1;
        
        const baseParams = { ...model.weeks[weekInCycle] };
        
        // Progressione tra cicli (ogni ciclo successivo leggermente più intenso)
        if (cycleNumber > 1) {
            const progressionFactor = 1 + (cycleNumber - 1) * 0.05; // +5% per ciclo
            baseParams.intensity = Math.min(95, baseParams.intensity * progressionFactor);
            baseParams.volume = Math.min(130, baseParams.volume * progressionFactor);
        }
        
        // Aggiungi metadata
        baseParams.weekNumber = weekNumber;
        baseParams.weekInCycle = weekInCycle;
        baseParams.cycleNumber = cycleNumber;
        baseParams.modelName = model.name;
        baseParams.totalWeeksInCycle = totalWeeks;
        
        return baseParams;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // ADATTAMENTO DA FEEDBACK
    // ═══════════════════════════════════════════════════════════════════════════

    adaptFromFeedback(baseParams, feedback = {}) {
        const adapted = { ...baseParams };
        const adjustments = [];

        // RPE medio troppo alto → riduci volume/intensità
        const avgRpe = parseFloat(feedback.avgRpe || feedback.rpe || 0);
        if (avgRpe > 0) {
            if (avgRpe > 8.5) {
                adapted.volume *= 0.85;
                adapted.intensity *= 0.95;
                adjustments.push(`RPE alto (${avgRpe}): volume -15%, intensità -5%`);
            } else if (avgRpe > 8.0 && adapted.phase !== 'intensificazione') {
                adapted.volume *= 0.92;
                adjustments.push(`RPE elevato (${avgRpe}): volume -8%`);
            } else if (avgRpe < 5.5 && adapted.phase !== 'deload') {
                adapted.volume *= 1.08;
                adapted.intensity *= 1.03;
                adjustments.push(`RPE basso (${avgRpe}): volume +8%, intensità +3%`);
            }
        }

        // Compliance bassa → riduci volume
        const compliance = parseFloat(feedback.compliance || 100);
        if (compliance < 70) {
            adapted.volume *= 0.80;
            adjustments.push(`Compliance bassa (${compliance}%): volume -20%`);
        } else if (compliance < 85) {
            adapted.volume *= 0.90;
            adjustments.push(`Compliance media (${compliance}%): volume -10%`);
        }

        // Sonno scarso → focus recupero
        const sleepHours = parseFloat(feedback.sleep || 7);
        if (sleepHours < 6) {
            adapted.intensity *= 0.90;
            adapted.volume *= 0.85;
            adjustments.push(`Sonno scarso (${sleepHours}h): intensità -10%, volume -15%`);
        } else if (sleepHours < 7) {
            adapted.intensity *= 0.95;
            adjustments.push(`Sonno sotto-ottimale (${sleepHours}h): intensità -5%`);
        }

        // HRV basso → sessione più leggera
        const hrv = parseFloat(feedback.hrv || 0);
        if (hrv > 0 && hrv < 30) {
            adapted.volume *= 0.75;
            adapted.intensity *= 0.85;
            adjustments.push(`HRV basso (${hrv}): volume -25%, intensità -15%`);
        } else if (hrv > 0 && hrv < 50) {
            adapted.volume *= 0.90;
            adjustments.push(`HRV sotto media (${hrv}): volume -10%`);
        }

        // Readiness basso → riduci tutto
        const readiness = parseFloat(feedback.readiness || 0);
        if (readiness > 0 && readiness < 50) {
            adapted.volume *= 0.70;
            adapted.intensity *= 0.80;
            adapted.phase = 'recovery';
            adjustments.push(`Readiness critico (${readiness}): sessione di recupero attivo`);
        } else if (readiness > 0 && readiness < 70) {
            adapted.volume *= 0.85;
            adjustments.push(`Readiness basso (${readiness}): volume -15%`);
        }

        // Dolori/infortuni → modifica focus
        const painAreas = feedback.painAreas || [];
        if (painAreas.length > 0) {
            adjustments.push(`Dolori segnalati (${painAreas.join(', ')}): evita esercizi che stressano queste aree`);
            adapted.avoidAreas = painAreas;
        }

        // Arrotonda valori
        adapted.volume = Math.round(adapted.volume);
        adapted.intensity = Math.round(adapted.intensity);
        adapted.adjustments = adjustments;

        return adapted;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // GENERA PROMPT SECTION PER AI
    // ═══════════════════════════════════════════════════════════════════════════

    generatePeriodizationPrompt(weekNumber, athleteContext = {}, feedback = {}) {
        const baseParams = this.getWeekParameters(weekNumber, athleteContext);
        const adapted = this.adaptFromFeedback(baseParams, feedback);

        let prompt = `\n📊 PERIODIZZAZIONE INTELLIGENTE\n`;
        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        prompt += `📅 Settimana ${weekNumber} (${adapted.weekInCycle}/${adapted.totalWeeksInCycle} del ciclo ${adapted.cycleNumber})\n`;
        prompt += `📋 Modello: ${adapted.modelName}\n`;
        prompt += `🎯 Fase: ${adapted.phase.toUpperCase()}\n`;
        prompt += `📈 Focus: ${adapted.focus}\n\n`;

        prompt += `⚙️ PARAMETRI PRESCRITTI:\n`;
        prompt += `   • Volume: ${adapted.volume}% (base 100 = volume normale)\n`;
        prompt += `   • Intensità: ${adapted.intensity}% (% del massimale teorico)\n`;
        prompt += `   • RPE Target: ${adapted.rpe_target}/10\n\n`;

        // Volume tradotto in sets
        const volumeGuidance = this.translateVolumeToSets(adapted.volume, adapted.phase);
        prompt += `📐 TRADUZIONE VOLUME:\n`;
        prompt += `   • Esercizi compound: ${volumeGuidance.compound}\n`;
        prompt += `   • Esercizi accessori: ${volumeGuidance.accessory}\n`;
        prompt += `   • Conditioning: ${volumeGuidance.conditioning}\n\n`;

        // Intensità tradotta in rep range
        const intensityGuidance = this.translateIntensityToReps(adapted.intensity, adapted.phase);
        prompt += `💪 TRADUZIONE INTENSITÀ:\n`;
        prompt += `   • Rep range principale: ${intensityGuidance.mainReps}\n`;
        prompt += `   • RPE indicativo: ${intensityGuidance.rpe}\n`;
        prompt += `   • Tempo consigliato: ${intensityGuidance.tempo}\n\n`;

        // Adattamenti applicati
        if (adapted.adjustments && adapted.adjustments.length > 0) {
            prompt += `🔄 ADATTAMENTI DA FEEDBACK:\n`;
            for (const adj of adapted.adjustments) {
                prompt += `   ⚠️ ${adj}\n`;
            }
            prompt += '\n';
        }

        // Aree da evitare
        if (adapted.avoidAreas && adapted.avoidAreas.length > 0) {
            prompt += `⛔ AREE DA EVITARE (dolore segnalato):\n`;
            for (const area of adapted.avoidAreas) {
                prompt += `   • ${area}: scegli alternative che non stressino questa zona\n`;
            }
            prompt += '\n';
        }

        // Regole per fase
        prompt += this.getPhaseSpecificRules(adapted.phase);

        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

        return prompt;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // HELPER: Traduci volume % in sets concreti
    // ═══════════════════════════════════════════════════════════════════════════

    translateVolumeToSets(volumePct, phase) {
        // Base: volume 100 = 4 sets compound, 3 sets accessory
        const baseCompound = 4;
        const baseAccessory = 3;
        const baseConditioning = 4; // rounds/sets

        const factor = volumePct / 100;

        let compound = Math.round(baseCompound * factor);
        let accessory = Math.round(baseAccessory * factor);
        let conditioning = Math.round(baseConditioning * factor);

        // Clamp values
        compound = Math.max(2, Math.min(6, compound));
        accessory = Math.max(1, Math.min(5, accessory));
        conditioning = Math.max(2, Math.min(8, conditioning));

        // Phase adjustments
        if (phase === 'deload' || phase === 'taper') {
            compound = Math.min(3, compound);
            accessory = Math.min(2, accessory);
            conditioning = Math.min(2, conditioning);
        }

        return {
            compound: `${compound} sets`,
            accessory: `${accessory} sets`,
            conditioning: `${conditioning} rounds/sets`
        };
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // HELPER: Traduci intensità % in rep range
    // ═══════════════════════════════════════════════════════════════════════════

    translateIntensityToReps(intensityPct, phase) {
        let mainReps, rpe, tempo;

        if (intensityPct >= 90) {
            mainReps = '1-3 reps';
            rpe = 'RPE 9-10';
            tempo = 'Controllato, no tempo forzato';
        } else if (intensityPct >= 85) {
            mainReps = '3-5 reps';
            rpe = 'RPE 8-9';
            tempo = '2-0-X (esplosivo concentrico)';
        } else if (intensityPct >= 75) {
            mainReps = '5-8 reps';
            rpe = 'RPE 7-8';
            tempo = '2-1-2 (controllato)';
        } else if (intensityPct >= 65) {
            mainReps = '8-12 reps';
            rpe = 'RPE 6-7';
            tempo = '3-1-2 (focus TUT)';
        } else {
            mainReps = '12-15+ reps';
            rpe = 'RPE 5-6';
            tempo = '2-0-2 (leggero)';
        }

        // Override per deload
        if (phase === 'deload' || phase === 'taper') {
            mainReps = '8-10 reps (50-60% carico normale)';
            rpe = 'RPE 5 max';
            tempo = 'Fluido, nessuno sforzo';
        }

        return { mainReps, rpe, tempo };
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // HELPER: Regole specifiche per fase
    // ═══════════════════════════════════════════════════════════════════════════

    getPhaseSpecificRules(phase) {
        const rules = {
            adattamento: `📌 REGOLE FASE ADATTAMENTO:
   • Priorità: tecnica perfetta, nessun cedimento
   • Carichi leggeri (50-60% max)
   • Più tempo di rest (2-3min)
   • Evita esercizi complessi o rischiosi
   • Includi molto lavoro di mobilità\n\n`,

            accumulo: `📌 REGOLE FASE ACCUMULO:
   • Priorità: volume totale, time under tension
   • Carichi moderati (65-75% max)
   • Rest standard (60-90s)
   • Superset e giant set OK
   • Focus su ipertrofia e base aerobica\n\n`,

            gpp: `📌 REGOLE FASE GPP:
   • Priorità: base aerobica e conditioning generale
   • Carichi leggeri-moderati
   • Molto lavoro sport-specifico
   • Circuiti e interval training
   • Costruisci work capacity\n\n`,

            forza_base: `📌 REGOLE FASE FORZA BASE:
   • Priorità: progressione sui compound
   • Carichi crescenti (75-82% max)
   • Rest più lunghi (2-3min)
   • Focus su squat, deadlift, bench, press
   • Meno volume accessori\n\n`,

            intensificazione: `📌 REGOLE FASE INTENSIFICAZIONE:
   • Priorità: carico massimo, poche reps
   • Carichi alti (82-92% max)
   • Rest lunghi (3-5min)
   • Solo compound essenziali
   • Accessori minimi, recupero massimo\n\n`,

            potenza: `📌 REGOLE FASE POTENZA:
   • Priorità: velocità e esplosività
   • Carichi moderati con max velocità (60-80%)
   • Rest completi (2-4min)
   • Plyometrics, jump training, medicine ball
   • Olympic lifts se tecnica OK\n\n`,

            specifico: `📌 REGOLE FASE SPECIFICO:
   • Priorità: transfer allo sport
   • Esercizi sport-specifici
   • Simula le richieste della gara
   • Mantieni forza, non costruire
   • Freschezza > fatica\n\n`,

            deload: `📌 REGOLE FASE DELOAD:
   • Priorità: RECUPERO TOTALE
   • Volume -40/50% rispetto a normale
   • Intensità -30% (carichi leggeri)
   • Nessun cedimento, RPE max 5
   • Stretching, mobilità, sonno\n\n`,

            taper: `📌 REGOLE FASE TAPER:
   • Priorità: freschezza per gara
   • Volume -50%, mantieni intensità
   • Solo esercizi chiave
   • Molto riposo, zero stress
   • Visualizzazione e preparazione mentale\n\n`,

            recovery: `📌 REGOLE FASE RECOVERY (EMERGENZA):
   • RECUPERO ATTIVO SOLO
   • Niente carichi, solo movimento
   • Camminate, stretching, foam rolling
   • Focus su sonno e nutrizione
   • Valuta consultare professionista\n\n`
        };

        return rules[phase] || rules.accumulo;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // CHECK: Serve deload forzato?
    // ═══════════════════════════════════════════════════════════════════════════

    shouldForceDeload(weekNumber, feedback = {}, history = []) {
        // Prima verifica: quanto tempo è passato dall'ultimo allenamento?
        const daysSinceLastWorkout = this.getDaysSinceLastWorkout(history);
        
        // Se l'atleta non si allena da 5+ giorni, NON serve deload
        // Serve invece una RIPRESA GRADUALE (l'atleta è già riposato!)
        if (daysSinceLastWorkout >= 5) {
            console.log(`📅 Atleta fermo da ${daysSinceLastWorkout} giorni - NO deload, serve ripresa graduale`);
            return { 
                force: false, 
                reason: null,
                needsGradualReturn: true,
                daysSinceLastWorkout: daysSinceLastWorkout
            };
        }
        
        // Ogni 4 settimane se non c'è già stato
        const weeksSinceLastDeload = this.getWeeksSinceLastDeload(history);
        if (weeksSinceLastDeload >= 4) {
            return { force: true, reason: `${weeksSinceLastDeload} settimane senza deload` };
        }

        // RPE medio > 8.5 per 2+ settimane consecutive
        const recentHighRpe = (history || []).slice(-2).filter(w => (w.avgRpe || 0) > 8.5);
        if (recentHighRpe.length >= 2) {
            return { force: true, reason: 'RPE > 8.5 per 2 settimane consecutive' };
        }

        // Compliance < 60% per 2+ settimane - MA solo se l'atleta si stava allenando
        // Se non si allenava, la bassa compliance NON indica overtraining
        const recentLowCompliance = (history || []).slice(-2).filter(w => (w.compliance || 100) < 60);
        if (recentLowCompliance.length >= 2) {
            // Verifica che l'atleta stava effettivamente allenandosi (completedWorkouts > 0)
            const wasTraining = (history || []).slice(-2).some(w => (w.completedWorkouts || 0) > 0);
            if (wasTraining) {
                return { force: true, reason: 'Compliance < 60% per 2 settimane (con allenamenti)' };
            } else {
                console.log('📅 Compliance bassa ma atleta non si allenava - NO deload');
                return { force: false, reason: null, needsGradualReturn: true };
            }
        }

        // HRV in calo costante
        const hrvTrend = this.calculateTrend((history || []).map(w => w.hrv).filter(Boolean));
        if (hrvTrend < -0.3) { // Calo significativo
            return { force: true, reason: 'HRV in calo costante' };
        }

        return { force: false, reason: null };
    },

    // Calcola i giorni dall'ultimo allenamento completato
    getDaysSinceLastWorkout(history = []) {
        // Cerca l'ultimo allenamento nel localStorage
        try {
            const allWorkouts = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.includes('workout_history_')) {
                    const data = JSON.parse(localStorage.getItem(key) || '[]');
                    allWorkouts.push(...data);
                }
            }
            
            if (allWorkouts.length === 0) return 999; // Nessun allenamento = considera come fermo
            
            // Trova la data più recente
            const dates = allWorkouts
                .map(w => new Date(w.completedAt || w.date || w.created_at))
                .filter(d => !isNaN(d.getTime()));
            
            if (dates.length === 0) return 999;
            
            const mostRecent = new Date(Math.max(...dates));
            const today = new Date();
            const diffTime = today - mostRecent;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            return diffDays;
        } catch (e) {
            console.warn('Errore calcolo giorni dall\'ultimo allenamento:', e);
            return 0; // In caso di errore, assume che si stava allenando
        }
    },

    getWeeksSinceLastDeload(history = []) {
        for (let i = history.length - 1; i >= 0; i--) {
            if (history[i].phase === 'deload') {
                return history.length - 1 - i;
            }
        }
        return history.length;
    },

    calculateTrend(values = []) {
        if (values.length < 3) return 0;
        const recent = values.slice(-3);
        const diffs = [];
        for (let i = 1; i < recent.length; i++) {
            diffs.push((recent[i] - recent[i-1]) / recent[i-1]);
        }
        return diffs.reduce((a, b) => a + b, 0) / diffs.length;
    }
};

// Export
window.PeriodizationEngine = PeriodizationEngine;
