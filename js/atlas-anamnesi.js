/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🏥 ATLAS ANAMNESI ENGINE v1.0
 * Sistema intelligente di gestione infortuni, limitazioni e storia medica
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Questo modulo permette al sistema di:
 * - Escludere automaticamente esercizi pericolosi per infortuni attivi
 * - Suggerire sostituzioni sicure
 * - Adattare intensità in base a condizioni mediche
 * - Trackare recupero da infortuni
 * - Gestire limitazioni biomeccaniche permanenti
 */

const ATLASAnamnesi = {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 DATABASE INFORTUNI E MAPPATURA ESERCIZI
    // ═══════════════════════════════════════════════════════════════════════════
    
    injuries: {
        // ─────────────────────────────────────────────────────────────────────
        // 🦵 LOWER BODY
        // ─────────────────────────────────────────────────────────────────────
        
        knee_acl: {
            name: 'Lesione LCA',
            affectedJoints: ['knee'],
            severity: 'severe',
            recoveryWeeks: 36,
            phases: {
                acute: { weeks: [0, 6], restrictions: 'complete_rest' },
                subacute: { weeks: [6, 12], restrictions: 'limited_rom' },
                rehabilitation: { weeks: [12, 24], restrictions: 'controlled' },
                return_to_sport: { weeks: [24, 36], restrictions: 'progressive' }
            },
            avoid: [
                'squat', 'lunge', 'jump', 'plyometric', 'leg extension', 
                'running', 'lateral movement', 'pivot', 'cutting'
            ],
            modifications: {
                'squat': { substitute: 'leg press partial ROM', intensityMod: 0.5 },
                'lunge': { substitute: 'step up controlled', intensityMod: 0.4 },
                'jump': { substitute: 'box step up', intensityMod: 0.3 }
            },
            rehabilitationExercises: [
                { name: 'Quad Sets', phase: 'acute', sets: 3, reps: '10-15' },
                { name: 'Straight Leg Raise', phase: 'acute', sets: 3, reps: '10' },
                { name: 'Heel Slides', phase: 'subacute', sets: 3, reps: '15' },
                { name: 'Terminal Knee Extension', phase: 'subacute', sets: 3, reps: '15' },
                { name: 'Single Leg Balance', phase: 'rehabilitation', sets: 3, reps: '30s' },
                { name: 'Nordic Curl Eccentric', phase: 'return_to_sport', sets: 3, reps: '5' }
            ]
        },
        
        knee_meniscus: {
            name: 'Lesione Menisco',
            affectedJoints: ['knee'],
            severity: 'moderate',
            recoveryWeeks: 12,
            avoid: [
                'deep squat', 'full rom leg press', 'lunge deep', 
                'twisting movements', 'high impact'
            ],
            modifications: {
                'squat': { substitute: 'box squat parallel', maxROM: '90deg', intensityMod: 0.7 },
                'leg press': { substitute: 'leg press partial', maxROM: '90deg' }
            },
            notes: 'Evitare flessione oltre 90° in fase acuta'
        },
        
        ankle_sprain: {
            name: 'Distorsione Caviglia',
            affectedJoints: ['ankle'],
            severity: 'mild',
            recoveryWeeks: 6,
            phases: {
                acute: { weeks: [0, 1], restrictions: 'RICE_protocol' },
                subacute: { weeks: [1, 3], restrictions: 'limited_weight_bearing' },
                rehabilitation: { weeks: [3, 6], restrictions: 'progressive_loading' }
            },
            avoid: [
                'jump', 'running', 'lateral movement', 'calf raise single leg',
                'plyometrics', 'box jump'
            ],
            modifications: {
                'calf raise': { substitute: 'seated calf raise', intensityMod: 0.6 },
                'jump': { substitute: 'step up', intensityMod: 0.4 }
            },
            rehabilitationExercises: [
                { name: 'Ankle Alphabet', phase: 'acute', sets: 2, reps: 'full alphabet' },
                { name: 'Towel Scrunches', phase: 'subacute', sets: 3, reps: '20' },
                { name: 'Single Leg Balance', phase: 'rehabilitation', sets: 3, reps: '30s' },
                { name: 'Banded Ankle 4-Way', phase: 'rehabilitation', sets: 2, reps: '15 each' }
            ]
        },
        
        hip_impingement: {
            name: 'Impingement Anca (FAI)',
            affectedJoints: ['hip'],
            severity: 'moderate',
            chronicCondition: true,
            avoid: [
                'deep squat', 'sumo deadlift', 'wide stance', 'hip flexion >90°',
                'butterfly stretch', 'pigeon pose'
            ],
            modifications: {
                'squat': { substitute: 'box squat high', stance: 'narrow', intensityMod: 0.8 },
                'deadlift': { substitute: 'trap bar deadlift', note: 'narrow stance' },
                'lunge': { substitute: 'reverse lunge', note: 'short stride' }
            },
            notes: 'Limitare flessione anca oltre 90°, evitare rotazione interna forzata'
        },
        
        hamstring_strain: {
            name: 'Stiramento Hamstring',
            affectedJoints: ['hip', 'knee'],
            severity: 'moderate',
            recoveryWeeks: 8,
            phases: {
                acute: { weeks: [0, 2], restrictions: 'no_stretch' },
                subacute: { weeks: [2, 4], restrictions: 'controlled_rom' },
                rehabilitation: { weeks: [4, 8], restrictions: 'progressive' }
            },
            avoid: [
                'romanian deadlift', 'good morning', 'leg curl', 'sprint',
                'high kick', 'overstretching'
            ],
            modifications: {
                'rdl': { substitute: 'hip hinge bodyweight', intensityMod: 0.3 },
                'deadlift': { substitute: 'trap bar deadlift', note: 'limited ROM' }
            },
            rehabilitationExercises: [
                { name: 'Isometric Hamstring Bridge', phase: 'acute', sets: 3, reps: '10s hold' },
                { name: 'Slider Leg Curl', phase: 'subacute', sets: 3, reps: '8' },
                { name: 'Nordic Curl Eccentric', phase: 'rehabilitation', sets: 3, reps: '5' },
                { name: 'Single Leg RDL Light', phase: 'rehabilitation', sets: 3, reps: '8' }
            ]
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // 💪 UPPER BODY
        // ─────────────────────────────────────────────────────────────────────
        
        shoulder_impingement: {
            name: 'Impingement Spalla',
            affectedJoints: ['shoulder'],
            severity: 'moderate',
            chronicCondition: true,
            avoid: [
                'overhead press', 'upright row', 'behind neck press', 
                'lateral raise above 90°', 'dip', 'behind neck pulldown'
            ],
            modifications: {
                'overhead press': { substitute: 'landmine press', intensityMod: 0.8 },
                'lateral raise': { substitute: 'lateral raise to 80°', note: 'thumbs up' },
                'bench press': { substitute: 'floor press', note: 'limited ROM' },
                'pull up': { substitute: 'lat pulldown front', note: 'controlled' }
            },
            rehabilitationExercises: [
                { name: 'Band Pull-Apart', sets: 3, reps: '15-20' },
                { name: 'Face Pull', sets: 3, reps: '15' },
                { name: 'External Rotation', sets: 3, reps: '15' },
                { name: 'Scapular Push-up', sets: 3, reps: '12' }
            ],
            notes: 'Rinforzare cuffia dei rotatori e stabilizzatori scapolari'
        },
        
        shoulder_rotator_cuff: {
            name: 'Lesione Cuffia Rotatori',
            affectedJoints: ['shoulder'],
            severity: 'severe',
            recoveryWeeks: 24,
            phases: {
                acute: { weeks: [0, 6], restrictions: 'immobilization' },
                subacute: { weeks: [6, 12], restrictions: 'passive_rom' },
                rehabilitation: { weeks: [12, 18], restrictions: 'active_rom' },
                strengthening: { weeks: [18, 24], restrictions: 'progressive_loading' }
            },
            avoid: [
                'overhead', 'press', 'pull up', 'row', 'dip',
                'any shoulder loading'
            ],
            modifications: {
                'chest': { substitute: 'isometric chest squeeze', intensityMod: 0.2 },
                'back': { substitute: 'straight arm pulldown light', intensityMod: 0.3 }
            },
            notes: 'Seguire protocollo fisioterapista. No carico per 12+ settimane post-op'
        },
        
        elbow_tennis: {
            name: 'Epicondilite Laterale (Tennis Elbow)',
            affectedJoints: ['elbow'],
            severity: 'mild',
            chronicCondition: true,
            avoid: [
                'wrist extension', 'reverse curl', 'heavy grip',
                'pull up pronated', 'barbell curl'
            ],
            modifications: {
                'curl': { substitute: 'hammer curl', note: 'neutral grip' },
                'pull up': { substitute: 'neutral grip pull up', intensityMod: 0.7 },
                'row': { substitute: 'chest supported row', note: 'neutral grip' }
            },
            rehabilitationExercises: [
                { name: 'Wrist Extensor Eccentric', sets: 3, reps: '15' },
                { name: 'Tyler Twist', sets: 3, reps: '15' },
                { name: 'Grip Strengthening', sets: 3, reps: '30s' }
            ]
        },
        
        // ─────────────────────────────────────────────────────────────────────
        // 🔙 SPINE
        // ─────────────────────────────────────────────────────────────────────
        
        lower_back_disc: {
            name: 'Ernia Disco Lombare',
            affectedJoints: ['spine'],
            severity: 'severe',
            chronicCondition: true,
            avoid: [
                'deadlift', 'good morning', 'bent over row', 'situp', 'crunch',
                'leg raise', 'twisting', 'spinal flexion under load'
            ],
            modifications: {
                'deadlift': { substitute: 'hip thrust', note: 'spine neutral' },
                'row': { substitute: 'chest supported row', intensityMod: 0.7 },
                'squat': { substitute: 'goblet squat', note: 'spine neutral' },
                'core': { substitute: 'dead bug or bird dog', note: 'anti-movement' }
            },
            rehabilitationExercises: [
                { name: 'Cat-Cow', sets: 2, reps: '10' },
                { name: 'Bird Dog', sets: 3, reps: '10 each' },
                { name: 'Dead Bug', sets: 3, reps: '10 each' },
                { name: 'McGill Big 3', sets: 3, reps: '10s holds' }
            ],
            notes: 'McGill Big 3 quotidiano. Evitare flessione spinale, specialmente al mattino'
        },
        
        lower_back_generic: {
            name: 'Lombalgia Generica',
            affectedJoints: ['spine'],
            severity: 'mild',
            avoid: [
                'heavy deadlift', 'situp', 'crunch', 'good morning heavy'
            ],
            modifications: {
                'deadlift': { substitute: 'trap bar deadlift', intensityMod: 0.7 },
                'core': { substitute: 'pallof press', note: 'anti-rotation' }
            },
            notes: 'Rinforzare core con esercizi anti-movimento'
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏥 CONDIZIONI MEDICHE
    // ═══════════════════════════════════════════════════════════════════════════
    
    medicalConditions: {
        hypertension: {
            name: 'Ipertensione',
            restrictions: {
                maxIntensity: 80,           // Max % 1RM
                avoidIsometricMax: true,    // No isometrici massimali
                avoidValsalva: true,        // No manovra Valsalva
                restBetweenSets: 120        // Min secondi riposo
            },
            avoid: ['heavy deadlift', 'leg press max', 'isometric holds max'],
            notes: 'Evitare trattenere respiro. Preferire rep range più alti (10-15)',
            requiresMedicalClearance: true
        },
        
        diabetes_type2: {
            name: 'Diabete Tipo 2',
            restrictions: {
                requiresCarbs: true,        // Carboidrati pre/post
                monitorGlucose: true,
                avoidFasted: true
            },
            benefits: ['resistance training migliora sensibilità insulinica'],
            notes: 'Monitorare glicemia. Avere carboidrati rapidi disponibili',
            requiresMedicalClearance: true
        },
        
        osteoporosis: {
            name: 'Osteoporosi',
            restrictions: {
                avoidHighImpact: true,
                avoidSpinalFlexion: true,
                progressSlowly: true
            },
            avoid: ['jump', 'running', 'crunch', 'situp', 'twisting'],
            recommended: ['weight bearing exercises', 'resistance training'],
            notes: 'Il resistance training aumenta densità ossea. Progressione lenta',
            requiresMedicalClearance: true
        },
        
        pregnancy: {
            name: 'Gravidanza',
            restrictions: {
                maxIntensity: 70,
                avoidSupine: true,          // Dopo primo trimestre
                avoidValsalva: true,
                avoidOverheating: true
            },
            avoid: ['supine exercises after T1', 'contact sports', 'high intensity'],
            trimesterModifications: {
                T1: { intensityMod: 0.8, notes: 'Nausea possibile' },
                T2: { intensityMod: 0.7, notes: 'Evitare supino', avoidSupine: true },
                T3: { intensityMod: 0.6, notes: 'Focus stabilità e mobilità' }
            },
            requiresMedicalClearance: true
        },
        
        asthma: {
            name: 'Asma',
            restrictions: {
                warmupExtended: true,       // Warmup più lungo
                avoidCold: true,
                haveInhalerReady: true
            },
            notes: 'Warmup esteso (10-15 min). Inalatore sempre disponibile'
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 MOTORE DI FILTRAGGIO
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Filtra workout in base ad anamnesi
     * @param {Object} workout - Workout generato
     * @param {Object} anamnesi - Storia medica utente
     * @returns {Object} Workout modificato
     */
    filterWorkout(workout, anamnesi) {
        if (!anamnesi || (!anamnesi.injuries && !anamnesi.conditions)) {
            return workout;
        }
        
        const result = {
            ...workout,
            exercises: [],
            modifications: [],
            warnings: [],
            rehabilitationAdded: []
        };
        
        // Processa ogni esercizio
        for (const exercise of workout.exercises) {
            const filterResult = this.filterExercise(exercise, anamnesi);
            
            if (filterResult.allowed) {
                // Esercizio permesso (eventualmente modificato)
                result.exercises.push(filterResult.exercise);
                
                if (filterResult.modified) {
                    result.modifications.push({
                        original: exercise.name,
                        modified: filterResult.exercise.name,
                        reason: filterResult.reason
                    });
                }
            } else {
                // Esercizio sostituito
                if (filterResult.substitute) {
                    result.exercises.push(filterResult.substitute);
                    result.modifications.push({
                        original: exercise.name,
                        substitute: filterResult.substitute.name,
                        reason: filterResult.reason
                    });
                } else {
                    // Esercizio rimosso
                    result.warnings.push({
                        removed: exercise.name,
                        reason: filterResult.reason
                    });
                }
            }
        }
        
        // Aggiungi esercizi di riabilitazione se appropriato
        const rehabExercises = this.getRehabilitationExercises(anamnesi);
        if (rehabExercises.length > 0) {
            result.rehabilitationAdded = rehabExercises;
            // Inserisci dopo warmup
            const warmupIndex = result.exercises.findIndex(e => e.type === 'warmup');
            result.exercises.splice(warmupIndex + 1, 0, ...rehabExercises);
        }
        
        // Applica restrizioni globali da condizioni mediche
        result.exercises = this.applyMedicalRestrictions(result.exercises, anamnesi);
        
        return result;
    },
    
    /**
     * Filtra singolo esercizio
     */
    filterExercise(exercise, anamnesi) {
        const exerciseName = (exercise.name || '').toLowerCase();
        
        // Check ogni infortunio
        for (const injuryKey of (anamnesi.injuries || [])) {
            const injury = this.injuries[injuryKey];
            if (!injury) continue;
            
            // Check se esercizio è nella lista avoid
            const isAvoided = (injury.avoid || []).some(pattern => 
                exerciseName.includes(pattern.toLowerCase())
            );
            
            if (isAvoided) {
                // Cerca sostituzione
                const substitute = this.findSubstitute(exercise, injury);
                
                return {
                    allowed: false,
                    substitute,
                    reason: `${injury.name}: evitare ${exercise.name}`
                };
            }
            
            // Check se necessita modifica
            const modification = this.findModification(exercise, injury);
            if (modification) {
                return {
                    allowed: true,
                    modified: true,
                    exercise: modification,
                    reason: `${injury.name}: modificato`
                };
            }
        }
        
        return { allowed: true, exercise };
    },
    
    /**
     * Trova sostituzione per esercizio
     */
    findSubstitute(exercise, injury) {
        const exerciseName = (exercise.name || '').toLowerCase();
        
        // Cerca nelle modifiche dell'infortunio
        for (const [pattern, mod] of Object.entries(injury.modifications || {})) {
            if (exerciseName.includes(pattern.toLowerCase())) {
                return {
                    ...exercise,
                    name: mod.substitute,
                    originalName: exercise.name,
                    sets: mod.intensityMod 
                        ? Math.max(2, Math.round(exercise.sets * mod.intensityMod))
                        : exercise.sets,
                    notes: mod.note || `Sostituzione per ${injury.name}`
                };
            }
        }
        
        return null;
    },
    
    /**
     * Trova modifica per esercizio
     */
    findModification(exercise, injury) {
        const exerciseName = (exercise.name || '').toLowerCase();
        
        for (const [pattern, mod] of Object.entries(injury.modifications || {})) {
            if (exerciseName.includes(pattern.toLowerCase()) && mod.maxROM) {
                return {
                    ...exercise,
                    notes: `Limitare ROM a ${mod.maxROM}`,
                    maxROM: mod.maxROM
                };
            }
        }
        
        return null;
    },
    
    /**
     * Ottiene esercizi di riabilitazione appropriati
     */
    getRehabilitationExercises(anamnesi) {
        const exercises = [];
        
        for (const injuryKey of (anamnesi.injuries || [])) {
            const injury = this.injuries[injuryKey];
            if (!injury || !injury.rehabilitationExercises) continue;
            
            // Determina fase attuale
            const phase = anamnesi.injuryPhases?.[injuryKey] || 'rehabilitation';
            
            // Aggiungi esercizi appropriati per la fase
            const phaseExercises = injury.rehabilitationExercises.filter(ex => 
                !ex.phase || ex.phase === phase
            );
            
            exercises.push(...phaseExercises.slice(0, 2)); // Max 2 per infortunio
        }
        
        return exercises.map(ex => ({
            ...ex,
            type: 'rehabilitation',
            isRehab: true
        }));
    },
    
    /**
     * Applica restrizioni mediche globali
     */
    applyMedicalRestrictions(exercises, anamnesi) {
        const conditions = anamnesi.conditions || [];
        
        return exercises.map(exercise => {
            let modified = { ...exercise };
            
            for (const conditionKey of conditions) {
                const condition = this.medicalConditions[conditionKey];
                if (!condition) continue;
                
                const restrictions = condition.restrictions || {};
                
                // Limita intensità
                if (restrictions.maxIntensity && modified.targetIntensity) {
                    const currentIntensity = parseInt(modified.targetIntensity);
                    if (currentIntensity > restrictions.maxIntensity) {
                        modified.targetIntensity = `${restrictions.maxIntensity}% 1RM`;
                        modified.notes = (modified.notes || '') + 
                            ` [${condition.name}: intensità limitata]`;
                    }
                }
                
                // Aumenta riposo
                if (restrictions.restBetweenSets) {
                    modified.rest = `${restrictions.restBetweenSets}s+`;
                }
            }
            
            return modified;
        });
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 VALIDAZIONE ANAMNESI
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Valida e processa anamnesi utente
     */
    validateAnamnesi(anamnesi) {
        const result = {
            valid: true,
            warnings: [],
            requiresMedicalClearance: false,
            processedInjuries: [],
            processedConditions: []
        };
        
        // Valida infortuni
        for (const injury of (anamnesi.injuries || [])) {
            if (this.injuries[injury]) {
                result.processedInjuries.push({
                    key: injury,
                    ...this.injuries[injury]
                });
                
                if (this.injuries[injury].severity === 'severe') {
                    result.warnings.push(
                        `⚠️ ${this.injuries[injury].name}: richiede supervisione medica`
                    );
                }
            } else {
                result.warnings.push(`Infortunio non riconosciuto: ${injury}`);
            }
        }
        
        // Valida condizioni mediche
        for (const condition of (anamnesi.conditions || [])) {
            if (this.medicalConditions[condition]) {
                const cond = this.medicalConditions[condition];
                result.processedConditions.push({
                    key: condition,
                    ...cond
                });
                
                if (cond.requiresMedicalClearance) {
                    result.requiresMedicalClearance = true;
                    result.warnings.push(
                        `🏥 ${cond.name}: richiede clearance medica prima di iniziare`
                    );
                }
            }
        }
        
        return result;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 LISTA INFORTUNI/CONDIZIONI DISPONIBILI
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Ritorna lista infortuni disponibili per UI
     */
    getAvailableInjuries() {
        return Object.entries(this.injuries).map(([key, value]) => ({
            key,
            name: value.name,
            severity: value.severity,
            affectedJoints: value.affectedJoints,
            chronic: value.chronicCondition || false
        }));
    },
    
    /**
     * Ritorna lista condizioni mediche per UI
     */
    getAvailableConditions() {
        return Object.entries(this.medicalConditions).map(([key, value]) => ({
            key,
            name: value.name,
            requiresClearance: value.requiresMedicalClearance || false
        }));
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🧪 TEST E DEMO
    // ═══════════════════════════════════════════════════════════════════════════
    
    demo() {
        console.log('\n' + '═'.repeat(70));
        console.log('🏥 ATLAS ANAMNESI ENGINE - DEMO');
        console.log('═'.repeat(70));
        
        // Mostra infortuni disponibili
        console.log('\n📋 INFORTUNI DISPONIBILI:');
        this.getAvailableInjuries().forEach(inj => {
            console.log(`  • ${inj.name} (${inj.key}) - Severity: ${inj.severity}`);
        });
        
        console.log('\n🏥 CONDIZIONI MEDICHE:');
        this.getAvailableConditions().forEach(cond => {
            const clearance = cond.requiresClearance ? '⚠️ Richiede clearance' : '';
            console.log(`  • ${cond.name} (${cond.key}) ${clearance}`);
        });
        
        // Test con workout sample
        console.log('\n' + '─'.repeat(70));
        console.log('🧪 TEST FILTRAGGIO WORKOUT\n');
        
        const sampleWorkout = {
            exercises: [
                { name: 'Dynamic Warm-up', type: 'warmup', sets: 1, reps: '5 min' },
                { name: 'Back Squat', sets: 4, reps: '6-8', type: 'strength' },
                { name: 'Romanian Deadlift', sets: 3, reps: '8-10', type: 'strength' },
                { name: 'Overhead Press', sets: 3, reps: '8-10', type: 'strength' },
                { name: 'Pull-up', sets: 3, reps: '8-10', type: 'strength' },
                { name: 'Crunch', sets: 3, reps: '15', type: 'core' }
            ]
        };
        
        const anamnesi = {
            injuries: ['shoulder_impingement', 'lower_back_disc'],
            conditions: ['hypertension']
        };
        
        console.log('Anamnesi test:');
        console.log('  Infortuni:', anamnesi.injuries);
        console.log('  Condizioni:', anamnesi.conditions);
        
        // Valida anamnesi
        const validation = this.validateAnamnesi(anamnesi);
        console.log('\n⚠️ Warnings:');
        validation.warnings.forEach(w => console.log(`  ${w}`));
        
        // Filtra workout
        const filtered = this.filterWorkout(sampleWorkout, anamnesi);
        
        console.log('\n📊 MODIFICHE APPLICATE:');
        filtered.modifications.forEach(mod => {
            if (mod.substitute) {
                console.log(`  ✏️ ${mod.original} → ${mod.substitute}`);
            } else {
                console.log(`  ⚡ ${mod.original}: ${mod.reason}`);
            }
        });
        
        console.log('\n❌ ESERCIZI RIMOSSI:');
        filtered.warnings.forEach(w => {
            console.log(`  🚫 ${w.removed}: ${w.reason}`);
        });
        
        console.log('\n💊 RIABILITAZIONE AGGIUNTA:');
        filtered.rehabilitationAdded.forEach(ex => {
            console.log(`  + ${ex.name} (${ex.sets}x${ex.reps})`);
        });
        
        console.log('\n✅ WORKOUT FINALE:');
        filtered.exercises.forEach((ex, i) => {
            const rehab = ex.isRehab ? ' [REHAB]' : '';
            const notes = ex.notes ? ` - ${ex.notes}` : '';
            console.log(`  ${i+1}. ${ex.name}${rehab}${notes}`);
        });
        
        console.log('\n' + '═'.repeat(70));
        
        return filtered;
    }
};

// Export
if (typeof window !== 'undefined') {
    window.ATLASAnamnesi = ATLASAnamnesi;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ATLASAnamnesi;
}
