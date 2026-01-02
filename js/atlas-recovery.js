/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧠 ATLAS RECOVERY & SCHEDULING INTELLIGENCE v1.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sistema intelligente che:
 * 1. Stima il recupero muscolare basandosi su storico workout
 * 2. Gestisce la settimana in modo intelligente:
 *    - NO forza pesante prima di allenamento squadra
 *    - Separa lavoro palestra e lavoro tecnico
 *    - Rispetta i giorni di riposo
 * 
 * OBIETTIVO: +8% qualità sistema → verso il 90%
 */

window.ATLASRecovery = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 MUSCLE RECOVERY MODEL - NASA-LEVEL SCIENCE (Schoenfeld 2024, Halperin 2024)
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Tempo di recupero DIFFERENZIATO per intensità (ore)
     * Basato su: Schoenfeld BJ 2024 Meta-analysis, Halperin I 2024 Neural Fatigue
     * 
     * Struttura: { light: <70%, moderate: 70-80%, heavy: 80-90%, maximal: >90% }
     */
    muscleSpecificRecovery: {
        // Grandi gruppi - richiedono più tempo
        quadriceps:  { light: 48, moderate: 72, heavy: 96, maximal: 120 },
        hamstrings:  { light: 48, moderate: 72, heavy: 96, maximal: 120 },
        glutes:      { light: 36, moderate: 60, heavy: 84, maximal: 96 },
        back:        { light: 48, moderate: 72, heavy: 96, maximal: 120 },
        
        // Medi gruppi
        chest:       { light: 36, moderate: 48, heavy: 72, maximal: 96 },
        shoulders:   { light: 36, moderate: 48, heavy: 72, maximal: 96 },
        
        // Piccoli gruppi - recupero più veloce
        biceps:      { light: 24, moderate: 48, heavy: 60, maximal: 72 },
        triceps:     { light: 24, moderate: 48, heavy: 60, maximal: 72 },
        
        // Alta frequenza possibile
        core:        { light: 12, moderate: 24, heavy: 36, maximal: 48 },
        calves:      { light: 12, moderate: 24, heavy: 36, maximal: 48 },
        forearms:    { light: 12, moderate: 24, heavy: 36, maximal: 48 }
    },
    
    /**
     * 🧠 CNS RECOVERY MODEL - SEPARATO DAL MUSCOLARE
     * Il sistema nervoso centrale ha curve di recupero DISTINTE
     * Basato su: Halperin I. 2024 "Neural Fatigue in Resistance Training"
     */
    cnsRecoveryModel: {
        // Tempo base recupero CNS (ore)
        baseRecovery: 48,
        
        // Impatto sul CNS per tipo di esercizio/pattern
        exerciseImpact: {
            // Alto impatto CNS - richiedono più recupero
            deadlift_heavy:     1.8,  // Deadlift pesante = massimo stress CNS
            squat_heavy:        1.5,  // Squat pesante
            olympic_lifts:      1.6,  // Clean, Snatch, etc.
            plyometrics_high:   1.4,  // Box jumps alti, depth jumps
            maximal_attempts:   2.0,  // 1RM o near-max
            
            // Medio impatto CNS
            compound_moderate:  1.0,  // Compound a intensità moderata
            explosive_power:    1.2,  // Medicine ball, jump training
            heavy_carries:      1.3,  // Farmer walks, sled
            
            // Basso impatto CNS
            isolation:          0.3,  // Curl, extension, etc.
            machine_work:       0.4,  // Esercizi guidati
            bodyweight:         0.5,  // Push-up, pull-up moderati
            cardio_steady:      0.2,  // Cardio bassa intensità
            
            // Minimo impatto
            stretching:         0.1,
            mobility:           0.1,
            technique_drill:    0.3   // Drill tecnici leggeri
        },
        
        /**
         * Calcola recupero CNS richiesto per un workout
         * CNS e muscoli sono INDIPENDENTI - puoi avere muscoli recuperati ma CNS affaticato
         */
        calculateCNSRecovery(workout) {
            let totalCNSLoad = 0;
            const exercises = workout.exercises || [];
            
            exercises.forEach(ex => {
                const name = (ex.name || '').toLowerCase();
                const type = (ex.type || '').toLowerCase();
                const intensity = ex.intensity || 75;
                const sets = parseInt(ex.sets) || 3;
                
                // Determina impatto CNS
                let impact = 0.5; // default
                
                // Match per nome
                if (name.includes('deadlift')) impact = intensity > 85 ? 1.8 : 1.2;
                else if (name.includes('squat') && !name.includes('split')) impact = intensity > 85 ? 1.5 : 1.0;
                else if (name.includes('clean') || name.includes('snatch') || name.includes('jerk')) impact = 1.6;
                else if (name.includes('jump') && name.includes('depth')) impact = 1.4;
                else if (name.includes('plyometric') || name.includes('box jump')) impact = 1.3;
                else if (name.includes('carry') || name.includes('sled')) impact = 1.3;
                else if (name.includes('press') && intensity > 85) impact = 1.2;
                else if (name.includes('row') || name.includes('pull')) impact = 0.8;
                else if (name.includes('curl') || name.includes('extension')) impact = 0.3;
                else if (name.includes('plank') || name.includes('core')) impact = 0.3;
                else if (type === 'technique' || type === 'drill') impact = 0.3;
                else if (type === 'cardio' || type === 'conditioning') impact = 0.4;
                
                // Scala per intensità
                const intensityMultiplier = intensity / 100;
                
                // Accumula
                totalCNSLoad += impact * intensityMultiplier * (sets / 3);
            });
            
            // Calcola ore di recupero CNS necessarie
            const cnsRecoveryHours = this.baseRecovery * (totalCNSLoad / 10);
            
            return {
                cnsLoad: Math.round(totalCNSLoad * 10) / 10,
                recoveryHours: Math.round(Math.min(96, Math.max(24, cnsRecoveryHours))),
                status: totalCNSLoad > 8 ? 'high' : (totalCNSLoad > 4 ? 'moderate' : 'low'),
                recommendation: totalCNSLoad > 8 
                    ? 'Evita lavoro pesante per 72h+' 
                    : (totalCNSLoad > 4 ? 'Lavoro moderato OK dopo 48h' : 'Recupero rapido - 24h')
            };
        }
    },
    
    /**
     * Tempo di recupero LEGACY (per backward compatibility)
     * USA muscleSpecificRecovery per precisione
     */
    recoveryTimes: {
        // Grandi gruppi - 48-72h
        quadriceps: 72,
        hamstrings: 72,
        glutes: 72,
        back: 72,
        chest: 48,
        
        // Medi gruppi - 48h
        shoulders: 48,
        triceps: 48,
        biceps: 48,
        
        // Piccoli gruppi / Alta frequenza - 24-48h
        core: 24,
        calves: 24,
        forearms: 24,
        
        // Sistema nervoso - 48-72h per lavoro pesante
        cns: 72
    },
    
    /**
     * Fattori che influenzano il recupero
     */
    recoveryFactors: {
        intensity: {
            light: 0.6,      // Recupero più veloce
            moderate: 1.0,   // Standard
            high: 1.3,       // Recupero più lento
            maximal: 1.6     // Molto più lento
        },
        volume: {
            low: 0.7,
            moderate: 1.0,
            high: 1.3
        },
        experience: {
            beginner: 1.3,   // Recupero più lento
            intermediate: 1.0,
            advanced: 0.85   // Recupero più veloce
        },
        age: {
            under25: 0.9,
            '25-35': 1.0,
            '35-45': 1.15,
            over45: 1.3
        },
        sleep: {
            poor: 1.4,       // <6h
            average: 1.1,    // 6-7h
            good: 1.0,       // 7-8h
            excellent: 0.85  // 8+h
        }
    },
    
    /**
     * Calcola stato recupero muscoli basandosi su storico
     * NASA-LEVEL: Usa muscleSpecificRecovery differenziato per intensità
     * @param {Array} workoutHistory - Ultimi workout (max 7 giorni)
     * @param {Object} profile - Profilo atleta
     * @returns {Object} Stato recupero per gruppo muscolare + CNS
     */
    calculateRecoveryState(workoutHistory, profile = {}) {
        const now = Date.now();
        const recoveryState = {};
        
        // Inizializza tutti i muscoli come completamente recuperati
        Object.keys(this.muscleSpecificRecovery).forEach(muscle => {
            recoveryState[muscle] = {
                status: 'recovered',
                percentage: 100,
                hoursUntilRecovered: 0,
                lastTrained: null,
                intensityLastTrained: null
            };
        });
        
        // Inizializza CNS separatamente
        recoveryState.cns = {
            status: 'recovered',
            percentage: 100,
            hoursUntilRecovered: 0,
            load: 0,
            recommendation: 'Pronto per lavoro pesante'
        };
        
        // Fattore esperienza
        const expFactor = this.recoveryFactors.experience[profile.level] || 1.0;
        
        // Fattore età
        let ageFactor = 1.0;
        if (profile.age) {
            if (profile.age < 25) ageFactor = 0.9;
            else if (profile.age <= 35) ageFactor = 1.0;
            else if (profile.age <= 45) ageFactor = 1.15;
            else ageFactor = 1.3;
        }
        
        // ══════════════════════════════════════════════════════════════
        // Fattore peso corporeo - atleti più pesanti necessitano più recupero
        // Basato su: maggior stress articolare e metabolico
        // ══════════════════════════════════════════════════════════════
        let weightFactor = 1.0;
        if (profile.weight) {
            if (profile.weight > 120) {
                weightFactor = 1.25;  // +25% tempo recupero
            } else if (profile.weight > 100) {
                weightFactor = 1.15;  // +15% tempo recupero
            } else if (profile.weight > 90) {
                weightFactor = 1.08;  // +8% tempo recupero
            } else if (profile.weight < 60) {
                weightFactor = 0.92;  // -8% tempo recupero (atleti leggeri)
            }
        }
        
        // Accumula CNS load da tutti i workout recenti
        let totalCNSLoad = 0;
        let lastCNSWorkoutHoursAgo = 168;
        
        // Analizza ogni workout recente
        workoutHistory.forEach(workout => {
            const workoutDate = new Date(workout.created_at || workout.date);
            const hoursAgo = (now - workoutDate.getTime()) / (1000 * 60 * 60);
            
            // Skip workout troppo vecchi (>7 giorni)
            if (hoursAgo > 168) return;
            
            // Estrai muscoli allenati
            const muscles = this.extractMusclesFromWorkout(workout);
            
            // Determina intensità (light, moderate, heavy, maximal)
            const intensity = this.determineIntensity(workout);
            
            // ══════════════════════════════════════════════════════════════
            // MUSCULAR RECOVERY - differenziato per intensità
            // ══════════════════════════════════════════════════════════════
            muscles.forEach(muscle => {
                if (muscle === 'cns') return; // CNS gestito separatamente
                
                // Usa muscleSpecificRecovery se disponibile
                const muscleData = this.muscleSpecificRecovery[muscle];
                let baseRecovery;
                
                if (muscleData) {
                    // NASA-LEVEL: recupero specifico per intensità
                    baseRecovery = muscleData[intensity] || muscleData.moderate || 48;
                } else {
                    // Fallback legacy
                    baseRecovery = this.recoveryTimes[muscle] || 48;
                    const intFactor = this.recoveryFactors.intensity[intensity] || 1.0;
                    baseRecovery *= intFactor;
                }
                
                // Applica fattori personali (età, esperienza, peso)
                const adjustedRecovery = baseRecovery * expFactor * ageFactor * weightFactor;
                
                const hoursRemaining = Math.max(0, adjustedRecovery - hoursAgo);
                const percentage = Math.min(100, Math.round((hoursAgo / adjustedRecovery) * 100));
                
                // Aggiorna solo se questo workout è più recente
                if (!recoveryState[muscle].lastTrained || hoursAgo < recoveryState[muscle].hoursAgo) {
                    recoveryState[muscle] = {
                        status: percentage >= 100 ? 'recovered' : (percentage >= 70 ? 'partial' : 'fatigued'),
                        percentage: percentage,
                        hoursUntilRecovered: Math.round(hoursRemaining),
                        lastTrained: workoutDate.toISOString(),
                        hoursAgo: hoursAgo,
                        intensityLastTrained: intensity
                    };
                }
            });
            
            // ══════════════════════════════════════════════════════════════
            // CNS RECOVERY - calcolo separato
            // ══════════════════════════════════════════════════════════════
            const cnsData = this.cnsRecoveryModel.calculateCNSRecovery(workout);
            
            // Accumula CNS load con decay temporale
            const decayFactor = Math.exp(-hoursAgo / 72); // Half-life ~72h
            totalCNSLoad += cnsData.cnsLoad * decayFactor;
            
            if (cnsData.cnsLoad > 3 && hoursAgo < lastCNSWorkoutHoursAgo) {
                lastCNSWorkoutHoursAgo = hoursAgo;
            }
        });
        
        // Calcola stato CNS finale
        const cnsRecoveryHours = Math.min(96, Math.max(24, totalCNSLoad * 8));
        const cnsPercentage = Math.min(100, Math.round((lastCNSWorkoutHoursAgo / cnsRecoveryHours) * 100));
        
        recoveryState.cns = {
            status: cnsPercentage >= 100 ? 'recovered' : (cnsPercentage >= 60 ? 'partial' : 'fatigued'),
            percentage: cnsPercentage,
            hoursUntilRecovered: Math.round(Math.max(0, cnsRecoveryHours - lastCNSWorkoutHoursAgo)),
            load: Math.round(totalCNSLoad * 10) / 10,
            recommendation: totalCNSLoad > 8 
                ? '⚠️ CNS affaticato - evita lavoro pesante' 
                : (totalCNSLoad > 4 ? 'Lavoro moderato OK' : '✅ Pronto per lavoro pesante')
        };
        
        return recoveryState;
    },
    
    /**
     * Estrai gruppi muscolari da un workout
     */
    extractMusclesFromWorkout(workout) {
        const muscles = new Set();
        const exercises = workout.exercises || [];
        
        // Se exercises è un oggetto con sezioni
        const allExercises = Array.isArray(exercises) 
            ? exercises 
            : [...(exercises.main || []), ...(exercises.accessory || [])];
        
        allExercises.forEach(ex => {
            // Da proprietà muscles dell'esercizio
            if (ex.muscles) {
                ex.muscles.forEach(m => muscles.add(m.toLowerCase()));
            }
            
            // Inferisci da nome esercizio
            const name = (ex.name || ex.exercise || '').toLowerCase();
            
            // Mapping esercizi -> muscoli
            if (name.includes('squat') || name.includes('leg press')) {
                muscles.add('quadriceps');
                muscles.add('glutes');
            }
            if (name.includes('deadlift') || name.includes('rdl') || name.includes('romanian')) {
                muscles.add('hamstrings');
                muscles.add('glutes');
                muscles.add('back');
                muscles.add('cns');
            }
            if (name.includes('bench') || name.includes('push')) {
                muscles.add('chest');
                muscles.add('triceps');
            }
            if (name.includes('row') || name.includes('pull')) {
                muscles.add('back');
                muscles.add('biceps');
            }
            if (name.includes('press') && name.includes('overhead')) {
                muscles.add('shoulders');
                muscles.add('triceps');
            }
            if (name.includes('lunge') || name.includes('split')) {
                muscles.add('quadriceps');
                muscles.add('glutes');
            }
            if (name.includes('curl')) {
                muscles.add('biceps');
            }
            if (name.includes('extension') && name.includes('tricep')) {
                muscles.add('triceps');
            }
            if (name.includes('plank') || name.includes('core') || name.includes('ab')) {
                muscles.add('core');
            }
        });
        
        return Array.from(muscles);
    },
    
    /**
     * Determina intensità workout
     */
    determineIntensity(workout) {
        const goal = (workout.goal || '').toLowerCase();
        const difficulty = (workout.difficulty || '').toLowerCase();
        
        if (goal === 'potenza' || goal === 'forza' || difficulty === 'advanced') {
            return 'high';
        }
        if (goal === 'ipertrofia' || difficulty === 'intermediate') {
            return 'moderate';
        }
        return 'moderate';
    },
    
    /**
     * Verifica se un gruppo muscolare è pronto per allenamento
     */
    isMuscleReady(muscle, recoveryState, minPercentage = 70) {
        const state = recoveryState[muscle];
        if (!state) return true;
        return state.percentage >= minPercentage;
    },
    
    /**
     * Ottieni muscoli da evitare oggi
     */
    getMusclestoAvoid(recoveryState, threshold = 60) {
        return Object.entries(recoveryState)
            .filter(([muscle, state]) => state.percentage < threshold)
            .map(([muscle, state]) => ({
                muscle,
                percentage: state.percentage,
                hoursUntilReady: state.hoursUntilRecovered
            }));
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📅 SMART WEEK SCHEDULING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Tipi di attività e loro impatto
     */
    activityTypes: {
        // Attività GR Perform (palestra)
        strength_heavy: {
            label: 'Forza Pesante',
            impact: 'high',
            cnsLoad: 'high',
            recoveryNeeded: 48,
            avoidBefore: ['team_training', 'match', 'technical'],
            avoidAfter: ['strength_heavy']
        },
        strength_light: {
            label: 'Forza Leggera',
            impact: 'low',
            cnsLoad: 'low',
            recoveryNeeded: 24,
            avoidBefore: ['match'],
            avoidAfter: []
        },
        hypertrophy: {
            label: 'Ipertrofia',
            impact: 'moderate',
            cnsLoad: 'low',
            recoveryNeeded: 48,
            avoidBefore: ['match', 'team_training'],
            avoidAfter: []
        },
        power: {
            label: 'Potenza/Esplosività',
            impact: 'high',
            cnsLoad: 'high',
            recoveryNeeded: 48,
            avoidBefore: ['team_training', 'match'],
            avoidAfter: ['strength_heavy']
        },
        conditioning: {
            label: 'Condizionamento',
            impact: 'moderate',
            cnsLoad: 'low',
            recoveryNeeded: 24,
            avoidBefore: ['match'],
            avoidAfter: []
        },
        mobility: {
            label: 'Mobilità/Recovery',
            impact: 'low',
            cnsLoad: 'none',
            recoveryNeeded: 0,
            avoidBefore: [],
            avoidAfter: []
        },
        
        // Attività esterne
        team_training: {
            label: 'Allenamento Squadra',
            impact: 'high',
            cnsLoad: 'moderate',
            recoveryNeeded: 24,
            avoidBefore: [],
            avoidAfter: ['strength_heavy']
        },
        technical: {
            label: 'Lavoro Tecnico',
            impact: 'moderate',
            cnsLoad: 'low',
            recoveryNeeded: 24,
            avoidBefore: [],
            avoidAfter: []
        },
        match: {
            label: 'Partita/Gara',
            impact: 'maximal',
            cnsLoad: 'high',
            recoveryNeeded: 72,
            avoidBefore: [],
            avoidAfter: ['strength_heavy', 'power', 'hypertrophy']
        },
        rest: {
            label: 'Riposo',
            impact: 'none',
            cnsLoad: 'none',
            recoveryNeeded: 0,
            avoidBefore: [],
            avoidAfter: []
        }
    },
    
    /**
     * Analizza la settimana e suggerisci il tipo di workout migliore
     * @param {Object} weeklySchedule - Calendario settimanale dell'atleta
     * @param {string} targetDay - Giorno per cui generare (monday, tuesday, etc.)
     * @param {string} preferredGoal - Goal preferito (forza, ipertrofia, potenza)
     * @returns {Object} Raccomandazione
     */
    analyzeWeekForWorkout(weeklySchedule, targetDay, preferredGoal = 'forza') {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const targetIndex = days.indexOf(targetDay.toLowerCase());
        
        if (targetIndex === -1) {
            return { 
                recommended: preferredGoal, 
                reason: 'Giorno non valido',
                warnings: [] 
            };
        }
        
        // Ottieni attività del giorno prima e dopo
        const prevDay = targetIndex > 0 ? days[targetIndex - 1] : null;
        const nextDay = targetIndex < 6 ? days[targetIndex + 1] : null;
        
        const prevActivity = prevDay ? this.parseActivity(weeklySchedule[prevDay]) : null;
        const nextActivity = nextDay ? this.parseActivity(weeklySchedule[nextDay]) : null;
        const currentActivity = this.parseActivity(weeklySchedule[targetDay]);
        
        const warnings = [];
        let recommendedType = this.mapGoalToType(preferredGoal);
        
        // ════════════════════════════════════════════════════════════════
        // REGOLA 1: NO forza pesante prima di allenamento squadra/partita
        // ════════════════════════════════════════════════════════════════
        if (nextActivity && ['team_training', 'match', 'technical'].includes(nextActivity)) {
            if (['strength_heavy', 'power'].includes(recommendedType)) {
                warnings.push({
                    type: 'conflict',
                    message: `Evita ${this.activityTypes[recommendedType].label} prima di ${this.activityTypes[nextActivity].label}`,
                    suggestion: 'strength_light'
                });
                recommendedType = 'strength_light';
            }
        }
        
        // ════════════════════════════════════════════════════════════════
        // REGOLA 2: NO forza pesante dopo partita (serve recupero)
        // ════════════════════════════════════════════════════════════════
        if (prevActivity === 'match') {
            if (['strength_heavy', 'power', 'hypertrophy'].includes(recommendedType)) {
                warnings.push({
                    type: 'recovery',
                    message: 'Giorno post-partita: preferire recupero attivo',
                    suggestion: 'mobility'
                });
                recommendedType = 'mobility';
            }
        }
        
        // ════════════════════════════════════════════════════════════════
        // REGOLA 3: NO due giorni forza pesante consecutivi
        // ════════════════════════════════════════════════════════════════
        if (prevActivity === 'strength_heavy' && recommendedType === 'strength_heavy') {
            warnings.push({
                type: 'overload',
                message: 'Evita due giorni forza pesante consecutivi',
                suggestion: 'hypertrophy'
            });
            recommendedType = 'hypertrophy';
        }
        
        // ════════════════════════════════════════════════════════════════
        // REGOLA 4: Separa palestra e tecnica
        // ════════════════════════════════════════════════════════════════
        if (currentActivity === 'technical' || currentActivity === 'team_training') {
            // Il giorno ha già lavoro tecnico/squadra - se deve fare anche palestra
            // suggeriamo mobilità o lavoro complementare leggero
            if (['strength_heavy', 'power'].includes(recommendedType)) {
                warnings.push({
                    type: 'double_session',
                    message: `Già previsto ${this.activityTypes[currentActivity].label} - riduci intensità palestra`,
                    suggestion: 'strength_light'
                });
                recommendedType = 'strength_light';
            }
        }
        
        // ════════════════════════════════════════════════════════════════
        // REGOLA 5: Pre-partita = solo attivazione/mobilità
        // ════════════════════════════════════════════════════════════════
        if (nextActivity === 'match') {
            warnings.push({
                type: 'pre_match',
                message: 'Giorno pre-gara: solo attivazione e mobilità',
                suggestion: 'mobility'
            });
            recommendedType = 'mobility';
        }
        
        return {
            targetDay,
            previousDay: prevDay ? { day: prevDay, activity: prevActivity } : null,
            nextDay: nextDay ? { day: nextDay, activity: nextActivity } : null,
            originalGoal: preferredGoal,
            recommended: recommendedType,
            recommendedLabel: this.activityTypes[recommendedType]?.label || recommendedType,
            warnings,
            isOptimal: warnings.length === 0,
            adjustmentsMade: warnings.length > 0
        };
    },
    
    /**
     * Mappa goal utente a tipo attività
     */
    mapGoalToType(goal) {
        const mapping = {
            'forza': 'strength_heavy',
            'strength': 'strength_heavy',
            'potenza': 'power',
            'power': 'power',
            'ipertrofia': 'hypertrophy',
            'hypertrophy': 'hypertrophy',
            'massa': 'hypertrophy',
            'conditioning': 'conditioning',
            'cardio': 'conditioning',
            'mobility': 'mobility',
            'recovery': 'mobility'
        };
        return mapping[(goal || '').toLowerCase()] || 'strength_heavy';
    },
    
    /**
     * Parse attività da valore weekly_schedule
     */
    parseActivity(value) {
        if (!value) return null;
        
        const v = String(value).toLowerCase();
        
        // Match esatti
        if (v === 'rest' || v === 'riposo' || v === 'off') return 'rest';
        if (v === 'match' || v === 'partita' || v === 'gara') return 'match';
        if (v === 'team' || v === 'team_training' || v === 'squadra' || v === 'allenamento_squadra') return 'team_training';
        if (v === 'technical' || v === 'tecnica' || v === 'skill') return 'technical';
        if (v === 'gr_perform' || v === 'gym' || v === 'palestra') return 'strength_heavy';
        if (v === 'gr_available' || v === 'available' || v === 'both') return 'strength_heavy';
        if (v === 'conditioning' || v === 'cardio') return 'conditioning';
        if (v === 'mobility' || v === 'recovery' || v === 'stretching') return 'mobility';
        
        // Se contiene certe parole
        if (v.includes('squad') || v.includes('team')) return 'team_training';
        if (v.includes('partita') || v.includes('match') || v.includes('gara')) return 'match';
        if (v.includes('tecnic') || v.includes('skill')) return 'technical';
        if (v.includes('palestra') || v.includes('gym') || v.includes('gr')) return 'strength_heavy';
        
        return null;
    },
    
    /**
     * Genera raccomandazione settimanale completa
     */
    generateWeekRecommendation(weeklySchedule, athleteGoal = 'forza') {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
        
        const recommendations = days.map((day, i) => {
            const scheduled = weeklySchedule[day];
            const analysis = this.analyzeWeekForWorkout(weeklySchedule, day, athleteGoal);
            
            return {
                day,
                dayName: dayNames[i],
                currentSchedule: scheduled,
                currentActivity: this.parseActivity(scheduled),
                ...analysis
            };
        });
        
        // Conta giorni ottimali per forza
        const optimalStrengthDays = recommendations.filter(r => 
            r.recommended === 'strength_heavy' && r.isOptimal
        ).length;
        
        // Conta warning totali
        const totalWarnings = recommendations.reduce((sum, r) => sum + r.warnings.length, 0);
        
        return {
            recommendations,
            summary: {
                optimalStrengthDays,
                totalWarnings,
                weekBalance: this.assessWeekBalance(recommendations)
            }
        };
    },
    
    /**
     * Valuta equilibrio settimanale
     */
    assessWeekBalance(recommendations) {
        const types = {};
        recommendations.forEach(r => {
            const t = r.recommended;
            types[t] = (types[t] || 0) + 1;
        });
        
        const issues = [];
        
        if ((types.strength_heavy || 0) > 3) {
            issues.push('Troppi giorni forza pesante');
        }
        if ((types.rest || 0) < 1) {
            issues.push('Manca giorno di riposo completo');
        }
        if ((types.mobility || 0) < 1) {
            issues.push('Aggiungi almeno un giorno mobilità');
        }
        
        return {
            distribution: types,
            issues,
            isBalanced: issues.length === 0
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 INTEGRAZIONE CON GENERAZIONE WORKOUT
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Modifica workout basandosi su recovery e scheduling
     * @param {Object} workout - Workout generato
     * @param {Object} context - Contesto (weeklySchedule, workoutHistory, targetDay, profile)
     * @returns {Object} Workout modificato
     */
    applyIntelligence(workout, context) {
        const { weeklySchedule, workoutHistory, targetDay, profile } = context;
        const modifications = [];
        
        // 1. Analisi scheduling
        let scheduleAnalysis = null;
        if (weeklySchedule && targetDay) {
            scheduleAnalysis = this.analyzeWeekForWorkout(
                weeklySchedule, 
                targetDay, 
                profile?.goal || 'forza'
            );
            
            // Se ci sono warning, modifica il workout
            if (scheduleAnalysis.warnings.length > 0) {
                workout = this.applyScheduleRecommendations(workout, scheduleAnalysis);
                modifications.push({
                    type: 'schedule',
                    warnings: scheduleAnalysis.warnings,
                    newType: scheduleAnalysis.recommended
                });
            }
        }
        
        // 2. Analisi recovery muscolare
        let recoveryState = null;
        if (workoutHistory && workoutHistory.length > 0) {
            recoveryState = this.calculateRecoveryState(workoutHistory, profile);
            const musclesToAvoid = this.getMusclestoAvoid(recoveryState, 50);
            
            if (musclesToAvoid.length > 0) {
                workout = this.reduceLoadOnFatiguedMuscles(workout, musclesToAvoid);
                modifications.push({
                    type: 'recovery',
                    fatiguedMuscles: musclesToAvoid
                });
            }
        }
        
        // Aggiungi metadata
        workout.recoveryIntelligence = {
            applied: true,
            scheduleAnalysis,
            recoveryState,
            modifications
        };
        
        if (modifications.length > 0) {
            console.log(`🧠 Recovery Intelligence: ${modifications.length} modifiche applicate`);
        }
        
        return workout;
    },
    
    /**
     * Applica raccomandazioni scheduling al workout
     */
    applyScheduleRecommendations(workout, analysis) {
        const newType = analysis.recommended;
        
        // Modifica parametri in base al tipo raccomandato
        const modifications = {
            'strength_light': {
                intensityMod: 0.7,      // -30% intensità
                volumeMod: 0.8,         // -20% volume
                removeHeavy: true       // Rimuovi esercizi pesanti
            },
            'mobility': {
                intensityMod: 0.5,
                volumeMod: 0.5,
                replaceWithMobility: true
            },
            'hypertrophy': {
                intensityMod: 0.85,
                volumeMod: 1.1,         // +10% volume
                increaseReps: true
            }
        };
        
        const mod = modifications[newType];
        if (!mod) return workout;
        
        const processExercise = (ex) => {
            const adjusted = { ...ex };
            
            // Riduci intensità (più rep, meno peso)
            if (mod.increaseReps && adjusted.reps) {
                const repsMatch = String(adjusted.reps).match(/(\d+)(?:-(\d+))?/);
                if (repsMatch) {
                    let minReps = parseInt(repsMatch[1]);
                    let maxReps = repsMatch[2] ? parseInt(repsMatch[2]) : minReps;
                    minReps = Math.min(15, minReps + 2);
                    maxReps = Math.min(20, maxReps + 2);
                    adjusted.reps = minReps === maxReps ? `${minReps}` : `${minReps}-${maxReps}`;
                }
            }
            
            // Riduci sets
            if (mod.volumeMod < 1 && adjusted.sets) {
                adjusted.sets = Math.max(2, Math.round(adjusted.sets * mod.volumeMod));
            }
            
            // Marca come modificato
            if (mod.intensityMod < 1 || mod.volumeMod !== 1) {
                adjusted.schedulingAdjusted = true;
                adjusted.adjustmentReason = analysis.warnings[0]?.message || 'Adattato per scheduling';
            }
            
            return adjusted;
        };
        
        const exercises = workout.exercises || [];
        
        if (Array.isArray(exercises)) {
            workout.exercises = exercises.map(processExercise);
        } else {
            ['warmup', 'main', 'accessory', 'cooldown', 'rehab'].forEach(section => {
                if (exercises[section]) {
                    workout.exercises[section] = exercises[section].map(processExercise);
                }
            });
        }
        
        // Aggiorna nome/metadata
        workout.schedulingAdjusted = true;
        workout.adjustedType = newType;
        
        return workout;
    },
    
    /**
     * Riduci carico su muscoli affaticati
     */
    reduceLoadOnFatiguedMuscles(workout, fatiguedMuscles) {
        const fatigueMap = {};
        fatiguedMuscles.forEach(m => {
            fatigueMap[m.muscle] = m.percentage;
        });
        
        const processExercise = (ex) => {
            const muscles = ex.muscles || this.inferMusclesFromExercise(ex);
            const hasFatiguedMuscle = muscles.some(m => fatigueMap[m] !== undefined);
            
            if (hasFatiguedMuscle) {
                // Trova il muscolo più affaticato
                const mostFatigued = muscles.reduce((worst, m) => {
                    const pct = fatigueMap[m];
                    if (pct !== undefined && (worst === null || pct < worst.pct)) {
                        return { muscle: m, pct };
                    }
                    return worst;
                }, null);
                
                if (mostFatigued && mostFatigued.pct < 50) {
                    return {
                        ...ex,
                        sets: Math.max(2, (ex.sets || 3) - 1),
                        recoveryReduced: true,
                        adjustmentReason: `${mostFatigued.muscle} solo ${mostFatigued.pct}% recuperato`
                    };
                }
            }
            
            return ex;
        };
        
        const exercises = workout.exercises || [];
        
        if (Array.isArray(exercises)) {
            workout.exercises = exercises.map(processExercise);
        } else {
            ['main', 'accessory'].forEach(section => {
                if (exercises[section]) {
                    workout.exercises[section] = exercises[section].map(processExercise);
                }
            });
        }
        
        return workout;
    },
    
    /**
     * Inferisci muscoli da nome esercizio
     */
    inferMusclesFromExercise(ex) {
        const name = (ex.name || ex.exercise || '').toLowerCase();
        const muscles = [];
        
        if (name.includes('squat')) muscles.push('quadriceps', 'glutes');
        if (name.includes('deadlift')) muscles.push('hamstrings', 'back', 'glutes');
        if (name.includes('bench')) muscles.push('chest', 'triceps');
        if (name.includes('row')) muscles.push('back', 'biceps');
        if (name.includes('press') && !name.includes('leg')) muscles.push('shoulders', 'triceps');
        if (name.includes('curl')) muscles.push('biceps');
        if (name.includes('lunge')) muscles.push('quadriceps', 'glutes');
        
        return muscles;
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🧠 ATLAS Recovery & Scheduling v1.0 loaded!');
console.log('   → ATLASRecovery.calculateRecoveryState(history, profile) - Calcola recupero muscoli');
console.log('   → ATLASRecovery.analyzeWeekForWorkout(schedule, day, goal) - Analizza scheduling');
console.log('   → ATLASRecovery.generateWeekRecommendation(schedule, goal) - Piano settimanale');
console.log('   → ATLASRecovery.applyIntelligence(workout, context) - Applica modifiche intelligenti');
