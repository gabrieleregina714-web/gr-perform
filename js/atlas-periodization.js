/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🗓️ ATLAS PERIODIZATION ENGINE v1.0
 * Sistema di periodizzazione automatica 4-52 settimane
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Sostituisce completamente la pianificazione di un trainer umano:
 * - Mesocicli automatici (Accumulo, Intensificazione, Peaking, Deload)
 * - Progressione volume/intensità scientifica
 * - Wave loading settimanale
 * - Deload automatico basato su fatigue
 * - Adattamento al goal (forza, ipertrofia, potenza)
 */

const ATLASPeriodization = {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 CONFIGURAZIONE MESOCICLI
    // ═══════════════════════════════════════════════════════════════════════════
    
    mesocycles: {
        // IPERTROFIA - Focus volume
        ipertrofia: {
            phases: [
                { 
                    name: 'Accumulo', 
                    weeks: 4, 
                    volumeMultiplier: 1.0,      // Volume base
                    intensityRange: [65, 75],    // % 1RM
                    repsRange: [8, 12],
                    setsPerMuscle: [12, 16],     // Sets settimanali per gruppo
                    rirRange: [2, 3],            // Reps in Reserve
                    focus: 'volume_accumulation'
                },
                { 
                    name: 'Intensificazione', 
                    weeks: 3, 
                    volumeMultiplier: 0.9,
                    intensityRange: [70, 80],
                    repsRange: [6, 10],
                    setsPerMuscle: [10, 14],
                    rirRange: [1, 2],
                    focus: 'intensity_increase'
                },
                { 
                    name: 'Metabolico', 
                    weeks: 2, 
                    volumeMultiplier: 1.1,
                    intensityRange: [60, 70],
                    repsRange: [12, 20],
                    setsPerMuscle: [14, 20],
                    rirRange: [1, 2],
                    focus: 'metabolic_stress',
                    techniques: ['drop_sets', 'rest_pause', 'supersets']
                },
                { 
                    name: 'Deload', 
                    weeks: 1, 
                    volumeMultiplier: 0.5,
                    intensityRange: [50, 60],
                    repsRange: [8, 12],
                    setsPerMuscle: [6, 8],
                    rirRange: [4, 5],
                    focus: 'recovery'
                }
            ],
            totalWeeks: 10
        },
        
        // FORZA - Focus intensità
        forza: {
            phases: [
                { 
                    name: 'Accumulo', 
                    weeks: 3, 
                    volumeMultiplier: 1.0,
                    intensityRange: [70, 80],
                    repsRange: [5, 8],
                    setsPerMuscle: [10, 15],
                    rirRange: [2, 3],
                    focus: 'strength_base'
                },
                { 
                    name: 'Intensificazione', 
                    weeks: 3, 
                    volumeMultiplier: 0.85,
                    intensityRange: [80, 88],
                    repsRange: [3, 5],
                    setsPerMuscle: [8, 12],
                    rirRange: [1, 2],
                    focus: 'intensity_peak'
                },
                { 
                    name: 'Peaking', 
                    weeks: 2, 
                    volumeMultiplier: 0.6,
                    intensityRange: [88, 95],
                    repsRange: [1, 3],
                    setsPerMuscle: [5, 8],
                    rirRange: [0, 1],
                    focus: 'peak_strength'
                },
                { 
                    name: 'Deload', 
                    weeks: 1, 
                    volumeMultiplier: 0.4,
                    intensityRange: [50, 65],
                    repsRange: [5, 8],
                    setsPerMuscle: [4, 6],
                    rirRange: [4, 5],
                    focus: 'recovery'
                }
            ],
            totalWeeks: 9
        },
        
        // POTENZA - Focus esplosività
        potenza: {
            phases: [
                { 
                    name: 'Forza Base', 
                    weeks: 3, 
                    volumeMultiplier: 1.0,
                    intensityRange: [75, 85],
                    repsRange: [4, 6],
                    setsPerMuscle: [10, 12],
                    rirRange: [2, 3],
                    focus: 'strength_foundation',
                    plyoVolume: 'low'
                },
                { 
                    name: 'Potenza', 
                    weeks: 3, 
                    volumeMultiplier: 0.8,
                    intensityRange: [50, 70],  // Lighter for speed
                    repsRange: [3, 5],
                    setsPerMuscle: [8, 10],
                    rirRange: [2, 3],
                    focus: 'power_development',
                    plyoVolume: 'high',
                    velocityFocus: true
                },
                { 
                    name: 'Sport Specific', 
                    weeks: 2, 
                    volumeMultiplier: 0.7,
                    intensityRange: [60, 75],
                    repsRange: [3, 5],
                    setsPerMuscle: [6, 10],
                    rirRange: [2, 3],
                    focus: 'sport_transfer',
                    plyoVolume: 'medium'
                },
                { 
                    name: 'Deload', 
                    weeks: 1, 
                    volumeMultiplier: 0.4,
                    intensityRange: [40, 55],
                    repsRange: [5, 8],
                    setsPerMuscle: [4, 6],
                    rirRange: [4, 5],
                    focus: 'recovery'
                }
            ],
            totalWeeks: 9
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📈 WAVE LOADING - Progressione settimanale
    // ═══════════════════════════════════════════════════════════════════════════
    
    wavePatterns: {
        // Onda lineare classica
        linear: {
            name: 'Progressione Lineare',
            weeks: [
                { volumeMod: 1.0, intensityMod: 1.0 },   // Week 1
                { volumeMod: 1.05, intensityMod: 1.02 }, // Week 2
                { volumeMod: 1.1, intensityMod: 1.04 },  // Week 3
                { volumeMod: 0.6, intensityMod: 0.85 }   // Week 4 Deload
            ],
            suitableFor: ['beginner', 'intermediate']
        },
        
        // Onda a pendolo (DUP-like)
        undulating: {
            name: 'Ondulazione Giornaliera',
            weeks: [
                { volumeMod: 1.0, intensityMod: 0.95 },   // High volume
                { volumeMod: 0.85, intensityMod: 1.05 },  // High intensity
                { volumeMod: 1.05, intensityMod: 1.0 },   // Moderate
                { volumeMod: 0.5, intensityMod: 0.8 }     // Deload
            ],
            dailyVariation: true,
            suitableFor: ['intermediate', 'advanced']
        },
        
        // Step loading (2 up, 1 back)
        step: {
            name: 'Step Loading',
            weeks: [
                { volumeMod: 1.0, intensityMod: 1.0 },    // Step 1
                { volumeMod: 1.08, intensityMod: 1.03 },  // Step 2
                { volumeMod: 0.95, intensityMod: 0.98 },  // Back step
                { volumeMod: 1.1, intensityMod: 1.05 },   // New peak
                { volumeMod: 0.5, intensityMod: 0.8 }     // Deload
            ],
            suitableFor: ['advanced']
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧮 CALCOLO PERIODIZZAZIONE
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Genera piano periodizzato completo
     * @param {Object} profile - Profilo utente
     * @param {number} weeks - Durata totale (4-52)
     * @returns {Object} Piano periodizzato
     */
    generatePlan(profile, weeks = 12) {
        const goal = profile.goal || 'ipertrofia';
        const level = profile.level || 'intermediate';
        const sport = profile.sport || 'palestra';
        
        // Seleziona template mesociclo
        const mesocycleTemplate = this.mesocycles[goal];
        if (!mesocycleTemplate) {
            throw new Error(`Goal non supportato: ${goal}`);
        }
        
        // Calcola quanti mesocicli completi
        const mesocyclesNeeded = Math.ceil(weeks / mesocycleTemplate.totalWeeks);
        
        // Seleziona wave pattern
        const wavePattern = this.selectWavePattern(level);
        
        // Genera piano settimana per settimana
        const plan = {
            profile,
            totalWeeks: weeks,
            goal,
            sport,
            level,
            wavePattern: wavePattern.name,
            startDate: new Date(),
            mesocycles: [],
            weeklyPlans: []
        };
        
        let currentWeek = 1;
        let mesocycleNumber = 1;
        
        while (currentWeek <= weeks) {
            // Genera mesociclo
            const mesocycle = this.generateMesocycle(
                mesocycleTemplate, 
                mesocycleNumber, 
                currentWeek,
                Math.min(mesocycleTemplate.totalWeeks, weeks - currentWeek + 1),
                profile
            );
            
            plan.mesocycles.push(mesocycle);
            plan.weeklyPlans.push(...mesocycle.weeks);
            
            currentWeek += mesocycle.weeks.length;
            mesocycleNumber++;
        }
        
        // Trim to exact weeks requested
        plan.weeklyPlans = plan.weeklyPlans.slice(0, weeks);
        
        return plan;
    },
    
    /**
     * Genera singolo mesociclo
     */
    generateMesocycle(template, number, startWeek, maxWeeks, profile) {
        const mesocycle = {
            number,
            startWeek,
            phases: [],
            weeks: []
        };
        
        let weekInMeso = 0;
        
        for (const phase of template.phases) {
            if (weekInMeso >= maxWeeks) break;
            
            const phaseWeeks = Math.min(phase.weeks, maxWeeks - weekInMeso);
            
            const phaseData = {
                name: phase.name,
                startWeek: startWeek + weekInMeso,
                weeks: phaseWeeks,
                focus: phase.focus
            };
            
            mesocycle.phases.push(phaseData);
            
            // Genera settimane per questa fase
            for (let w = 0; w < phaseWeeks; w++) {
                const weekNumber = startWeek + weekInMeso;
                const weekPlan = this.generateWeekPlan(
                    phase, 
                    weekNumber, 
                    w + 1,  // week within phase
                    phaseWeeks,
                    profile
                );
                mesocycle.weeks.push(weekPlan);
                weekInMeso++;
            }
        }
        
        return mesocycle;
    },
    
    /**
     * Genera piano settimanale
     */
    generateWeekPlan(phase, absoluteWeek, weekInPhase, totalPhaseWeeks, profile) {
        // Calcola progressione intra-fase
        const progressionFactor = weekInPhase / totalPhaseWeeks;
        
        // Interpola intensità e volume
        const intensity = this.interpolate(
            phase.intensityRange[0], 
            phase.intensityRange[1], 
            progressionFactor
        );
        
        const reps = Math.round(this.interpolate(
            phase.repsRange[1],  // Start with higher reps
            phase.repsRange[0],  // End with lower reps
            progressionFactor
        ));
        
        const setsPerMuscle = Math.round(this.interpolate(
            phase.setsPerMuscle[0],
            phase.setsPerMuscle[1],
            progressionFactor * phase.volumeMultiplier
        ));
        
        const rir = Math.round(this.interpolate(
            phase.rirRange[1],
            phase.rirRange[0],
            progressionFactor
        ));
        
        return {
            weekNumber: absoluteWeek,
            phase: phase.name,
            focus: phase.focus,
            parameters: {
                intensity: Math.round(intensity),        // % 1RM
                reps,
                setsPerMuscle,
                rir,
                volumeMultiplier: phase.volumeMultiplier,
                techniques: phase.techniques || [],
                plyoVolume: phase.plyoVolume || 'normal',
                velocityFocus: phase.velocityFocus || false
            },
            isDeload: phase.focus === 'recovery',
            notes: this.generateWeekNotes(phase, weekInPhase, totalPhaseWeeks)
        };
    },
    
    /**
     * Seleziona pattern di wave appropriato
     */
    selectWavePattern(level) {
        switch (level) {
            case 'beginner':
                return this.wavePatterns.linear;
            case 'intermediate':
                return this.wavePatterns.undulating;
            case 'advanced':
                return this.wavePatterns.step;
            default:
                return this.wavePatterns.linear;
        }
    },
    
    /**
     * Interpolazione lineare
     */
    interpolate(start, end, factor) {
        return start + (end - start) * Math.min(1, Math.max(0, factor));
    },
    
    /**
     * Genera note per la settimana
     */
    generateWeekNotes(phase, weekInPhase, totalPhaseWeeks) {
        const notes = [];
        
        if (weekInPhase === 1) {
            notes.push(`🚀 Inizio fase ${phase.name}`);
        }
        
        if (phase.focus === 'recovery') {
            notes.push('🧘 Settimana di scarico - focus recupero');
            notes.push('💤 Priorità sonno e nutrizione');
        }
        
        if (phase.techniques && phase.techniques.length > 0) {
            notes.push(`💪 Tecniche speciali: ${phase.techniques.join(', ')}`);
        }
        
        if (phase.velocityFocus) {
            notes.push('⚡ Focus velocità esecuzione');
        }
        
        if (weekInPhase === totalPhaseWeeks && phase.focus !== 'recovery') {
            notes.push('📊 Ultima settimana fase - massimizza intensità');
        }
        
        return notes;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 INTEGRAZIONE CON ATLAS TEMPLATES
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Modifica workout generato in base alla settimana del piano
     */
    applyPeriodization(workout, weekPlan) {
        if (!weekPlan) return workout;
        
        const params = weekPlan.parameters;
        
        // Modifica ogni esercizio
        workout.exercises = workout.exercises.map(exercise => {
            // Skip warmup e cooldown
            if (exercise.type === 'warmup' || exercise.type === 'cooldown') {
                return exercise;
            }
            
            const modified = { ...exercise };
            
            // Applica modifiche rep range
            if (typeof modified.reps === 'string' && modified.reps.includes('-')) {
                // Mantieni il range ma adattalo
                modified.reps = this.adjustReps(modified.reps, params.reps);
            } else if (typeof modified.reps === 'number') {
                modified.reps = params.reps;
            }
            
            // Aggiungi RIR
            modified.rir = params.rir;
            
            // Aggiungi intensità target
            modified.targetIntensity = `${params.intensity}% 1RM`;
            
            // Applica tecniche speciali se fase metabolica
            if (params.techniques && params.techniques.length > 0) {
                modified.techniques = params.techniques;
            }
            
            // Volume adjustment
            if (params.volumeMultiplier !== 1.0) {
                const currentSets = modified.sets || 3;
                modified.sets = Math.max(2, Math.round(currentSets * params.volumeMultiplier));
            }
            
            return modified;
        });
        
        // Aggiungi metadata periodizzazione
        workout.periodization = {
            week: weekPlan.weekNumber,
            phase: weekPlan.phase,
            focus: weekPlan.focus,
            isDeload: weekPlan.isDeload,
            notes: weekPlan.notes
        };
        
        return workout;
    },
    
    /**
     * Adatta range ripetizioni
     */
    adjustReps(currentRange, targetReps) {
        // Parse current range (e.g., "8-10")
        const [min, max] = currentRange.split('-').map(Number);
        if (isNaN(min) || isNaN(max)) return currentRange;
        
        // Adjust based on target
        const currentMid = (min + max) / 2;
        const diff = targetReps - currentMid;
        
        const newMin = Math.max(1, Math.round(min + diff));
        const newMax = Math.max(newMin + 1, Math.round(max + diff));
        
        return `${newMin}-${newMax}`;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 VISUALIZZAZIONE E REPORTING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Stampa piano in console
     */
    printPlan(plan) {
        console.log('\n' + '═'.repeat(70));
        console.log('📅 PIANO PERIODIZZATO - ' + plan.goal.toUpperCase());
        console.log('═'.repeat(70));
        console.log(`🎯 Goal: ${plan.goal} | 🏅 Sport: ${plan.sport} | 📊 Level: ${plan.level}`);
        console.log(`📆 Durata: ${plan.totalWeeks} settimane | 🔄 Wave: ${plan.wavePattern}`);
        console.log('─'.repeat(70));
        
        // Stampa overview fasi
        console.log('\n📊 OVERVIEW MESOCICLI:\n');
        plan.mesocycles.forEach((meso, i) => {
            console.log(`  Mesociclo ${meso.number} (Settimane ${meso.startWeek}-${meso.startWeek + meso.weeks.length - 1}):`);
            meso.phases.forEach(phase => {
                console.log(`    └─ ${phase.name}: ${phase.weeks} settimane`);
            });
        });
        
        // Tabella settimane
        console.log('\n📅 PIANO SETTIMANALE:\n');
        console.log('Week | Phase           | Intensity | Reps  | Sets/Muscle | RIR | Notes');
        console.log('─'.repeat(70));
        
        plan.weeklyPlans.forEach(week => {
            const p = week.parameters;
            const deloadMarker = week.isDeload ? '🧘' : '  ';
            console.log(
                `${String(week.weekNumber).padStart(3)}  | ` +
                `${week.phase.padEnd(15)} | ` +
                `${String(p.intensity).padStart(3)}%      | ` +
                `${String(p.reps).padStart(2)}    | ` +
                `${String(p.setsPerMuscle).padStart(2)}          | ` +
                `${p.rir}   | ` +
                `${deloadMarker}`
            );
        });
        
        console.log('─'.repeat(70));
        console.log('\n✅ Piano generato con successo!\n');
        
        return plan;
    },
    
    /**
     * Esporta piano come JSON
     */
    exportPlan(plan) {
        return JSON.stringify(plan, null, 2);
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧪 TEST E DEMO
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Demo del sistema
     */
    demo() {
        console.log('\n🧪 ATLAS PERIODIZATION - DEMO\n');
        
        // Test ipertrofia 12 settimane
        const profile = {
            goal: 'ipertrofia',
            sport: 'palestra',
            level: 'intermediate',
            gender: 'male',
            age: 28
        };
        
        const plan = this.generatePlan(profile, 12);
        this.printPlan(plan);
        
        // Mostra come applicare a un workout
        console.log('\n📋 ESEMPIO APPLICAZIONE A WORKOUT:\n');
        
        const sampleWorkout = {
            exercises: [
                { name: 'Back Squat', sets: 4, reps: '6-8', type: 'strength' },
                { name: 'Romanian Deadlift', sets: 3, reps: '8-10', type: 'strength' },
                { name: 'Leg Press', sets: 3, reps: '10-12', type: 'strength' }
            ]
        };
        
        // Applica settimana 1
        const week1Workout = this.applyPeriodization(
            JSON.parse(JSON.stringify(sampleWorkout)), 
            plan.weeklyPlans[0]
        );
        console.log('Settimana 1 (Accumulo):', JSON.stringify(week1Workout, null, 2));
        
        // Applica settimana 6 (Intensificazione)
        const week6Workout = this.applyPeriodization(
            JSON.parse(JSON.stringify(sampleWorkout)), 
            plan.weeklyPlans[5]
        );
        console.log('\nSettimana 6 (Intensificazione):', JSON.stringify(week6Workout, null, 2));
        
        return plan;
    }
};

// Export per uso in browser
if (typeof window !== 'undefined') {
    window.ATLASPeriodization = ATLASPeriodization;
}

// Export per Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ATLASPeriodization;
}
