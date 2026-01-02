/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧠 ATLAS EXERCISE INTELLIGENCE v1.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sistema intelligente per:
 * 1. Calcolo volumi ottimali (sets/reps) basato su evidenze scientifiche
 * 2. Ordinamento esercizi secondo priorità fisiologica
 * 3. Selezione esercizi basata su obiettivo e contesto
 */

window.ATLASExerciseIntelligence = {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 VOLUME LANDMARKS - Riferimenti scientifici per gruppo muscolare
    // Basato su: Schoenfeld 2017, Israetel MRV/MEV concepts
    // ═══════════════════════════════════════════════════════════════════════════
    
    volumeLandmarks: {
        // MEV = Minimum Effective Volume, MRV = Maximum Recoverable Volume
        // Valori in SETS PER SETTIMANA per gruppo muscolare
        
        chest:      { MEV: 8,  MRV: 22, optimal: 12-16, recovery: 48 },
        back:       { MEV: 10, MRV: 25, optimal: 14-18, recovery: 48 },
        shoulders:  { MEV: 6,  MRV: 20, optimal: 10-14, recovery: 48 },
        biceps:     { MEV: 6,  MRV: 20, optimal: 10-14, recovery: 48 },
        triceps:    { MEV: 6,  MRV: 18, optimal: 8-12,  recovery: 48 },
        quadriceps: { MEV: 8,  MRV: 20, optimal: 12-16, recovery: 72 },
        hamstrings: { MEV: 6,  MRV: 16, optimal: 10-14, recovery: 72 },
        glutes:     { MEV: 4,  MRV: 16, optimal: 8-12,  recovery: 48 },
        calves:     { MEV: 8,  MRV: 20, optimal: 12-16, recovery: 24 },
        core:       { MEV: 4,  MRV: 16, optimal: 8-12,  recovery: 24 }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 REP RANGES PER OBIETTIVO
    // Basato su: NSCA Guidelines, Schoenfeld meta-analysis
    // ═══════════════════════════════════════════════════════════════════════════
    
    repRanges: {
        forza: {
            power:      { sets: [3, 5], reps: [2, 5],   rest: '3-5 min',  rpe: [7, 8],   intensity: '60-80%', note: 'max velocity' },
            compound:   { sets: [4, 6], reps: [3, 6],   rest: '3-5 min',  rpe: [8, 9.5], intensity: '85-95%' },
            accessory:  { sets: [3, 4], reps: [5, 8],   rest: '2-3 min',  rpe: [7, 8],   intensity: '75-85%' },
            isolation:  { sets: [2, 3], reps: [8, 12],  rest: '60-90s',   rpe: [7, 8],   intensity: '65-75%' },
            core:       { sets: [2, 3], reps: [8, 12],  rest: '60-90s',   rpe: [7, 8],   intensity: 'bodyweight' },
            technique:  { sets: [2, 3], reps: ['2', '3 rounds'], rest: '60-90s', rpe: [6, 7], intensity: 'skill', note: 'focus qualità' },
            conditioning: { sets: [2, 3], reps: [8, 12], rest: '30-60s', rpe: [7, 8],  intensity: 'moderate' }
        },
        potenza: {
            power:      { sets: [3, 5], reps: [3, 5],   rest: '3-5 min',  rpe: [7, 8],   intensity: '60-80%', note: 'max velocity' },
            compound:   { sets: [3, 4], reps: [4, 6],   rest: '2-4 min',  rpe: [7, 8.5], intensity: '75-85%' },
            plyometric: { sets: [3, 4], reps: [4, 6],   rest: '2-3 min',  rpe: [6, 7],   intensity: 'bodyweight' },
            accessory:  { sets: [3, 4], reps: [5, 8],   rest: '90-120s',  rpe: [7, 8],   intensity: '70-80%' },
            core:       { sets: [2, 3], reps: [8, 10],  rest: '60s',      rpe: [6, 7],   intensity: 'bodyweight' },
            technique:  { sets: [3, 4], reps: ['3', '3 rounds'], rest: '90-120s', rpe: [6, 7], intensity: 'explosive', note: 'max potenza' },
            conditioning: { sets: [3, 4], reps: [6, 10], rest: '60-90s', rpe: [7, 8], intensity: 'high' }
        },
        ipertrofia: {
            compound:   { sets: [3, 4], reps: [6, 10],  rest: '90-120s',  rpe: [7, 9],   intensity: '65-80%' },
            accessory:  { sets: [3, 4], reps: [8, 12],  rest: '60-90s',   rpe: [7, 9],   intensity: '60-75%' },
            isolation:  { sets: [3, 4], reps: [10, 15], rest: '45-60s',   rpe: [7, 9],   intensity: '55-70%' },
            power:      { sets: [3, 4], reps: [5, 8],   rest: '90-120s',  rpe: [7, 8],   intensity: '65-75%' },
            core:       { sets: [3, 4], reps: [10, 15], rest: '45-60s',   rpe: [7, 8],   intensity: 'bodyweight' },
            technique:  { sets: [2, 3], reps: ['3', '3 rounds'], rest: '60-90s', rpe: [6, 7], intensity: 'moderate' },
            conditioning: { sets: [2, 3], reps: [10, 15], rest: '45-60s', rpe: [7, 8], intensity: 'moderate' }
        },
        resistenza: {
            compound:   { sets: [2, 3], reps: [12, 20], rest: '30-60s',   rpe: [6, 8],   intensity: '40-60%' },
            accessory:  { sets: [2, 3], reps: [15, 25], rest: '30-45s',   rpe: [6, 8],   intensity: '35-55%' },
            conditioning: { sets: [3, 4], reps: [15, 30], rest: '15-30s', rpe: [7, 9],  intensity: 'HIIT', note: 'max effort' },
            power:      { sets: [2, 3], reps: [8, 12],  rest: '45-60s',   rpe: [6, 7],   intensity: '50-60%' },
            core:       { sets: [2, 3], reps: [15, 20], rest: '30s',      rpe: [7, 8],   intensity: 'bodyweight' },
            technique:  { sets: [3, 5], reps: ['3', '3 rounds'], rest: '30-60s', rpe: [6, 8], intensity: 'endurance', note: 'alto volume' },
            circuit:    { sets: [2, 4], reps: ['30s', '60s'], rest: '0-30s', rpe: [6, 8], intensity: 'time-based' }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 EXERCISE ORDER PRIORITY - Ordine fisiologico ottimale
    // ═══════════════════════════════════════════════════════════════════════════
    
    exerciseOrderPriority: {
        // 1 = primo in sessione, 10 = ultimo
        
        // WARMUP & ACTIVATION (1-2)
        warmup:             { order: 1, rationale: 'Prepara il sistema' },
        activation:         { order: 2, rationale: 'Attiva pattern motori' },
        mobility:           { order: 2, rationale: 'Prepara ROM' },
        
        // POWER & PLYOMETRICS (3) - CNS fresh
        plyometric:         { order: 3, rationale: 'CNS fresco per max potenza' },
        power:              { order: 3, rationale: 'Velocità richiede CNS fresco' },
        olympic:            { order: 3, rationale: 'Tecnica complessa, CNS fresh' },
        
        // COMPOUND STRENGTH (4-5) - Primary stimulus
        compound_lower:     { order: 4, rationale: 'Esercizi più tassanti prima' },
        compound_upper:     { order: 5, rationale: 'Dopo lower per recupero' },
        
        // UNILATERAL & ACCESSORY (6-7)
        unilateral:         { order: 6, rationale: 'Dopo compound bilaterali' },
        accessory:          { order: 7, rationale: 'Supporta compound' },
        
        // ISOLATION (8)
        isolation:          { order: 8, rationale: 'Non interferisce con compound' },
        
        // CORE & CONDITIONING (9)
        core:               { order: 9, rationale: 'Core stanco non limita altri' },
        conditioning:       { order: 9, rationale: 'Finisher metabolico' },
        
        // COOLDOWN (10)
        cooldown:           { order: 10, rationale: 'Recupero e flessibilità' },
        stretching:         { order: 10, rationale: 'Post-workout' },
        
        // SPORT-SPECIFIC (variabile)
        technique:          { order: 3.5, rationale: 'Dopo warmup, prima forza' },
        sport_specific:     { order: 4.5, rationale: 'Integrato con strength' }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔢 CALCOLA VOLUME OTTIMALE
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Calcola sets e reps ottimali per un esercizio
     * @param {Object} exercise - L'esercizio
     * @param {Object} context - { goal, level, age, fatigue, weekNumber }
     * @returns {Object} { sets, reps, rest, rpe, notes } o null se non modificare
     */
    calculateOptimalVolume(exercise, context) {
        const { goal, level, age, fatigue, weekNumber, cnsState } = context;
        
        // Determina categoria esercizio
        const category = this.categorizeExercise(exercise);
        
        // NON modificare warmup e cooldown - mantieni valori originali
        if (category === 'warmup' || category === 'cooldown') {
            return null; // Segnala di non modificare
        }
        
        // Ottieni range base per goal + categoria
        const goalRanges = this.repRanges[goal] || this.repRanges.ipertrofia;
        const baseRange = goalRanges[category] || goalRanges.accessory;
        
        // Se non c'è range definito, non modificare
        if (!baseRange) {
            return null;
        }
        
        // Calcola modificatori
        const levelMod = this.getLevelModifier(level);
        const ageMod = this.getAgeModifier(age);
        const fatigueMod = this.getFatigueModifier(fatigue, cnsState);
        const weekMod = this.getWeekModifier(weekNumber);
        
        // Calcola sets (base + modificatori)
        let sets = Math.round(
            (baseRange.sets[0] + baseRange.sets[1]) / 2 * 
            levelMod.volume * ageMod.volume * fatigueMod.volume * weekMod.volume
        );
        sets = Math.max(2, Math.min(6, sets)); // Clamp 2-6
        
        // Calcola reps - gestisci sia numeri che stringhe (es. "3 rounds")
        let repsMin = baseRange.reps[0];
        let repsMax = baseRange.reps[1];
        let repsString;
        
        // Se reps sono stringhe (es. "3 rounds", "30s"), usa direttamente
        if (typeof repsMin === 'string' || typeof repsMax === 'string') {
            repsString = typeof repsMin === 'string' ? repsMin : `${repsMin}-${repsMax}`;
        } else {
            // Adatta per età (solo se numeri)
            if (age && age >= 50) {
                repsMin = Math.min(repsMin + 2, 12);
                repsMax = Math.min(repsMax + 3, 15);
            }
            repsString = repsMin === repsMax ? `${repsMin}` : `${repsMin}-${repsMax}`;
        }
        
        // Costruisci output
        const result = {
            sets: sets,
            reps: repsString,
            rest: baseRange.rest,
            rpe: `${baseRange.rpe[0]}-${baseRange.rpe[1]}`,
            intensity: baseRange.intensity,
            notes: []
        };
        
        // Aggiungi note esplicative
        if (ageMod.note) result.notes.push(ageMod.note);
        if (fatigueMod.note) result.notes.push(fatigueMod.note);
        if (weekMod.note) result.notes.push(weekMod.note);
        if (baseRange.note) result.notes.push(baseRange.note);
        
        return result;
    },
    
    /**
     * Categorizza esercizio (compound, accessory, isolation, etc.)
     */
    categorizeExercise(exercise) {
        const name = (exercise.name || '').toLowerCase();
        const type = (exercise.type || '').toLowerCase();
        
        // Warmup - non modificare volume
        if (type === 'warmup' || type === 'mobility' || type === 'activation' ||
            name.includes('warm') || name.includes('stretch') || name.includes('mobility') ||
            name.includes('locomotion') || name.includes('cat-cow') || name.includes('dead bug') ||
            name.includes('glute bridge') || name.includes('band pull')) {
            return 'warmup';
        }
        
        // Cooldown - non modificare
        if (type === 'cooldown' || name.includes('cool') || name.includes('walk') || name.includes('easy bike')) {
            return 'cooldown';
        }
        
        // Power/Plyometric/Explosive
        if (type === 'power' || type === 'plyometric' ||
            name.includes('jump') || name.includes('throw') || name.includes('slam') ||
            name.includes('clean') || name.includes('snatch') || name.includes('clap') ||
            name.includes('explosive') || name.includes('power shot')) {
            return 'power';
        }
        
        // Sport-Specific Technique (boxe, etc.) - volume moderato
        if (name.includes('shadow') || name.includes('drill') || name.includes('slip') ||
            name.includes('bob') || name.includes('weave') || name.includes('parry') ||
            name.includes('mirror') || name.includes('footwork') || name.includes('combo') ||
            name.includes('round') || name.includes('bag') || name.includes('tabata')) {
            return 'technique';
        }
        
        // Compound
        const compoundKeywords = ['squat', 'deadlift', 'press', 'row', 'pull-up', 'chin-up',
                                  'bench', 'lunge', 'thrust', 'pulldown', 'split squat'];
        if (compoundKeywords.some(k => name.includes(k))) {
            return 'compound';
        }
        
        // Core
        if (name.includes('plank') || name.includes('pallof') || name.includes('woodchop') ||
            name.includes('rotation') || name.includes('anti-') || name.includes('core') ||
            name.includes('ab ') || name.includes('crunch') || name.includes('landmine rot')) {
            return 'core';
        }
        
        // Conditioning/HIIT
        if (name.includes('burpee') || name.includes('battle rope') || name.includes('finisher') ||
            name.includes('circuit') || name.includes('hiit') || name.includes('emom')) {
            return 'conditioning';
        }
        
        // Isolation
        const isolationKeywords = ['curl', 'extension', 'fly', 'raise', 'pushdown',
                                   'kickback', 'shrug', 'calf'];
        if (isolationKeywords.some(k => name.includes(k))) {
            return 'isolation';
        }
        
        // Default: accessory
        return 'accessory';
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 MODIFICATORI
    // ═══════════════════════════════════════════════════════════════════════════
    
    getLevelModifier(level) {
        const mods = {
            principiante: { volume: 0.7, intensity: 0.8, note: 'Principiante: volume ridotto' },
            beginner:     { volume: 0.7, intensity: 0.8, note: 'Beginner: reduced volume' },
            intermedio:   { volume: 1.0, intensity: 1.0, note: null },
            intermediate: { volume: 1.0, intensity: 1.0, note: null },
            avanzato:     { volume: 1.2, intensity: 1.1, note: 'Avanzato: volume aumentato' },
            advanced:     { volume: 1.2, intensity: 1.1, note: 'Advanced: increased volume' }
        };
        return mods[level] || mods.intermedio;
    },
    
    getAgeModifier(age) {
        if (!age) return { volume: 1.0, intensity: 1.0, note: null };
        
        if (age >= 60) {
            return { volume: 0.7, intensity: 0.8, note: 'Over 60: volume ridotto, focus qualità' };
        }
        if (age >= 50) {
            return { volume: 0.85, intensity: 0.9, note: 'Over 50: volume moderato' };
        }
        if (age >= 40) {
            return { volume: 0.95, intensity: 0.95, note: null };
        }
        if (age < 25) {
            return { volume: 1.1, intensity: 1.05, note: 'Under 25: recupero ottimale' };
        }
        return { volume: 1.0, intensity: 1.0, note: null };
    },
    
    getFatigueModifier(fatigue, cnsState) {
        if (!fatigue && !cnsState) return { volume: 1.0, intensity: 1.0, note: null };
        
        // CNS state ha priorità
        if (cnsState === 'depleted') {
            return { volume: 0.6, intensity: 0.7, note: '⚠️ CNS depleto: volume minimo' };
        }
        if (cnsState === 'fatigued') {
            return { volume: 0.75, intensity: 0.85, note: 'CNS affaticato: volume ridotto' };
        }
        
        // Fatigue numerica
        if (fatigue >= 8) {
            return { volume: 0.7, intensity: 0.8, note: 'Alta fatica: volume ridotto' };
        }
        if (fatigue >= 6) {
            return { volume: 0.85, intensity: 0.9, note: 'Fatica moderata' };
        }
        if (fatigue <= 3) {
            return { volume: 1.1, intensity: 1.05, note: 'Fresco: volume pieno' };
        }
        
        return { volume: 1.0, intensity: 1.0, note: null };
    },
    
    getWeekModifier(weekNumber) {
        if (!weekNumber) return { volume: 1.0, intensity: 1.0, note: null };
        
        const weekInMesocycle = ((weekNumber - 1) % 4) + 1;
        
        switch (weekInMesocycle) {
            case 1: return { volume: 0.85, intensity: 0.9,  note: 'Week 1: introduzione' };
            case 2: return { volume: 1.0,  intensity: 1.0,  note: null };
            case 3: return { volume: 1.1,  intensity: 1.05, note: 'Week 3: overreaching' };
            case 4: return { volume: 0.6,  intensity: 0.7,  note: '🔄 DELOAD: volume -40%' };
            default: return { volume: 1.0, intensity: 1.0, note: null };
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 ORDINA ESERCIZI
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Ordina array di esercizi secondo priorità fisiologica
     * @param {Array} exercises - Array esercizi
     * @returns {Array} Esercizi ordinati
     */
    sortExercises(exercises) {
        return [...exercises].sort((a, b) => {
            // PRIMA: Gli esercizi con prefisso circuito (C1, C2, A1, etc.) 
            // devono stare INSIEME e ordinati per prefisso
            const prefixA = this.getCircuitPrefix(a.name);
            const prefixB = this.getCircuitPrefix(b.name);
            
            // Se entrambi hanno prefisso circuito, ordina per prefisso
            if (prefixA && prefixB) {
                return prefixA.localeCompare(prefixB);
            }
            
            // Se solo uno ha prefisso, quello senza prefisso va prima/dopo in base al tipo
            if (prefixA && !prefixB) {
                // B non ha prefisso - controlla se B è warmup/cooldown
                const orderB = this.getExerciseOrder(b);
                if (orderB <= 2) return 1;  // B è warmup, va prima
                if (orderB >= 9) return -1; // B è core/cooldown, va dopo
                return 1; // Circuito va dopo la parte non-circuito principale
            }
            if (!prefixA && prefixB) {
                const orderA = this.getExerciseOrder(a);
                if (orderA <= 2) return -1;  // A è warmup, va prima
                if (orderA >= 9) return 1;   // A è core/cooldown, va dopo
                return -1; // Non-circuito va prima del circuito
            }
            
            // Nessuno ha prefisso: usa ordine fisiologico
            const orderA = this.getExerciseOrder(a);
            const orderB = this.getExerciseOrder(b);
            return orderA - orderB;
        });
    },
    
    /**
     * Estrae prefisso circuito (C1, C2, A1, A2, etc.)
     */
    getCircuitPrefix(name) {
        if (!name) return null;
        const match = name.match(/^([A-Z]\d+):/);
        return match ? match[1] : null;
    },
    
    /**
     * Determina ordine di un esercizio
     */
    getExerciseOrder(exercise) {
        const name = (exercise.name || '').toLowerCase();
        const originalName = exercise.name || '';
        const type = (exercise.type || exercise.phase || '').toLowerCase();
        
        // Check type diretto
        if (this.exerciseOrderPriority[type]) {
            return this.exerciseOrderPriority[type].order;
        }
        
        // Check keywords nel nome - WARMUP (ordine 1-2)
        if (name.includes('warm') || name.includes('locomotion') || name.includes('activation') ||
            name.includes('glute bridge') || name.includes('dead bug') || name.includes('band pull') ||
            name.includes('cat-cow') || name.includes('world') || name.includes('greatest')) {
            return 1.5;
        }
        
        // Dynamic mobility = inizio (ordine 2)
        if ((name.includes('mobility') || name.includes('dynamic')) && !name.includes('cool')) {
            return 2;
        }
        
        // POWER/EXPLOSIVE (ordine 3)
        if (name.includes('jump') || name.includes('throw') || name.includes('slam') ||
            name.includes('explosive') || name.includes('power shot') || name.includes('clap')) {
            return 3;
        }
        if (name.includes('clean') || name.includes('snatch') || name.includes('olympic')) {
            return 3;
        }
        
        // TECHNIQUE/DRILLS (ordine 4) - dopo warmup, durante main work
        if (name.includes('shadow') || name.includes('drill') || name.includes('mirror') ||
            name.includes('footwork') || name.includes('combo') || name.includes('round')) {
            return 4;
        }
        
        // CIRCUITO esercizi (ordine 5) - parte principale
        if (this.getCircuitPrefix(originalName)) {
            return 5;
        }
        
        // COMPOUND (ordine 5-6)
        if (name.includes('squat') || name.includes('deadlift')) {
            return 5;
        }
        if (name.includes('press') || name.includes('bench') || name.includes('row') || name.includes('pull')) {
            return 5.5;
        }
        
        // UNILATERAL (ordine 6)
        if (name.includes('lunge') || name.includes('single-leg') || name.includes('unilateral') || name.includes('split')) {
            return 6;
        }
        
        // BAG WORK (ordine 7) - dopo strength
        if (name.includes('bag') || name.includes('heavy bag')) {
            return 7;
        }
        
        // ISOLATION (ordine 8)
        if (name.includes('curl') || name.includes('extension') || name.includes('raise') || name.includes('fly')) {
            return 8;
        }
        
        // FINISHER/CONDITIONING (ordine 8.5)
        if (name.includes('finisher') || name.includes('burpee') || name.includes('battle rope') || name.includes('tabata')) {
            return 8.5;
        }
        
        // CORE (ordine 9)
        if (name.includes('plank') || name.includes('core') || name.includes('ab') || 
            name.includes('pallof') || name.includes('woodchop') || name.includes('rotation')) {
            return 9;
        }
        
        // COOLDOWN (ordine 10)
        if (name.includes('cool') || name.includes('stretch') || name.includes('walk') || name.includes('easy')) {
            return 10;
        }
        
        // Default: metà sessione
        return 6;
    },
    
    /**
     * Ottimizza workout completo: ordina + calcola volumi
     * @param {Object} workout - Workout con exercises
     * @param {Object} context - Contesto atleta
     * @returns {Object} Workout ottimizzato
     */
    optimizeWorkout(workout, context) {
        if (!workout.exercises || workout.exercises.length === 0) {
            return workout;
        }
        
        // 1. Ordina esercizi
        const sortedExercises = this.sortExercises(workout.exercises);
        
        // 2. Calcola volumi ottimali per ogni esercizio
        const optimizedExercises = sortedExercises.map((ex, index) => {
            // Skip warmup/cooldown
            if (ex.type === 'warmup' || ex.type === 'cooldown' || ex.type === 'mobility') {
                return ex;
            }
            
            const optimalVolume = this.calculateOptimalVolume(ex, context);
            
            // Se null, mantieni valori originali (warmup/cooldown)
            if (!optimalVolume) {
                return ex;
            }
            
            // Gestisci reps che possono essere stringhe o array
            let repsValue;
            if (Array.isArray(optimalVolume.reps)) {
                repsValue = optimalVolume.reps.join('-');
            } else if (typeof optimalVolume.reps === 'object') {
                repsValue = ex.reps; // Mantieni originale
            } else {
                repsValue = optimalVolume.reps;
            }
            
            return {
                ...ex,
                sets: optimalVolume.sets,
                reps: repsValue,
                rest: optimalVolume.rest,
                rpe: optimalVolume.rpe,
                intensity: optimalVolume.intensity,
                volumeNotes: optimalVolume.notes && optimalVolume.notes.length > 0 ? optimalVolume.notes : undefined,
                originalOrder: index + 1
            };
        });
        
        // 3. Log ottimizzazione
        console.log('🧠 Workout Ottimizzato:');
        console.log(`   📋 Ordine: ${optimizedExercises.map(e => e.name.substring(0, 15)).join(' → ')}`);
        console.log(`   📊 Volume totale: ${optimizedExercises.reduce((sum, e) => sum + (parseInt(e.sets) || 0), 0)} sets`);
        
        return {
            ...workout,
            exercises: optimizedExercises,
            optimized: true,
            optimizationContext: {
                goal: context.goal,
                level: context.level,
                age: context.age,
                weekNumber: context.weekNumber
            }
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 ANALISI VOLUME SESSIONE
    // ═══════════════════════════════════════════════════════════════════════════
    
    analyzeSessionVolume(exercises, context) {
        const analysis = {
            totalSets: 0,
            muscleVolume: {},
            recommendations: []
        };
        
        exercises.forEach(ex => {
            const sets = parseInt(ex.sets) || 3;
            analysis.totalSets += sets;
            
            // Traccia volume per muscolo
            if (ex.muscles && Array.isArray(ex.muscles)) {
                ex.muscles.forEach(muscle => {
                    analysis.muscleVolume[muscle] = (analysis.muscleVolume[muscle] || 0) + sets;
                });
            }
        });
        
        // Genera raccomandazioni
        const levelMaxSets = {
            beginner: 15,
            principiante: 15,
            intermediate: 20,
            intermedio: 20,
            advanced: 25,
            avanzato: 25
        };
        
        const maxSets = levelMaxSets[context.level] || 20;
        
        if (analysis.totalSets > maxSets) {
            analysis.recommendations.push({
                type: 'warning',
                message: `Volume eccessivo: ${analysis.totalSets} sets (max ${maxSets} per ${context.level})`
            });
        } else if (analysis.totalSets < maxSets * 0.5) {
            analysis.recommendations.push({
                type: 'info',
                message: `Volume basso: ${analysis.totalSets} sets - potrebbe aumentare`
            });
        } else {
            analysis.recommendations.push({
                type: 'success',
                message: `Volume ottimale: ${analysis.totalSets} sets`
            });
        }
        
        return analysis;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ⏱️ CALCOLO DURATA REALISTICA SESSIONE
    // Stima precisa basata su: tempo sotto tensione, recuperi, transizioni
    // ═══════════════════════════════════════════════════════════════════════════
    
    calculateRealisticDuration(exercises, context = {}) {
        if (!exercises || exercises.length === 0) return 0;
        
        let totalSeconds = 0;
        const breakdown = [];
        
        // Costanti di tempo (in secondi)
        const TIME = {
            // Tempo per rep in base al tipo
            repDuration: {
                warmup: 2,          // Movimenti fluidi e leggeri
                mobility: 3,        // Stretching tenuto
                power: 2,           // Esplosivo, veloce
                plyometric: 2,
                strength: 4,        // Controllato, pesante
                compound: 3.5,      // Multi-articolare
                hypertrophy: 3,     // Tempo standard
                accessory: 2.5,
                isolation: 2.5,
                technique: 4,       // Focus sulla forma
                boxing: 2,          // Colpi veloci
                conditioning: 1.5,  // Cardio-based
                core: 2.5,
                cooldown: 4,        // Stretching statico
                circuit: 2          // Veloce in circuito
            },
            // Setup per esercizio (secondi)
            setupTime: {
                barbell: 45,        // Caricare/scaricare bilanciere
                dumbbell: 20,       // Prendere manubri
                machine: 15,        // Regolare macchina
                cable: 20,          // Attacco/stacco
                bodyweight: 10,     // Posizionamento
                band: 15,           // Preparare bande
                kettlebell: 15,
                medicine_ball: 10,
                bag: 15,            // Posizionamento al sacco
                default: 15
            },
            // Transizione tra esercizi
            transition: 30,
            // Warmup iniziale e cooldown
            sessionWarmup: 300,     // 5 min (se non c'è warm-up esplicito)
            sessionCooldown: 180    // 3 min (se non c'è cool-down esplicito)
        };
        
        // Helper: parse reps da stringa
        const parseReps = (repsStr) => {
            const s = String(repsStr || '').toLowerCase();
            
            // "3 min", "2min" -> converti in secondi totali
            const minMatch = s.match(/(\d+)\s*min/);
            if (minMatch) return { type: 'timed', seconds: parseInt(minMatch[1]) * 60 };
            
            // "30s", "45sec"
            const secMatch = s.match(/(\d+)\s*s(?:ec)?/);
            if (secMatch) return { type: 'timed', seconds: parseInt(secMatch[1]) };
            
            // "3 rounds", "3 round"
            const roundMatch = s.match(/(\d+)\s*round/i);
            if (roundMatch) return { type: 'rounds', count: parseInt(roundMatch[1]), perRound: 180 }; // 3min/round
            
            // "8-10" -> media
            const rangeMatch = s.match(/(\d+)\s*[-–]\s*(\d+)/);
            if (rangeMatch) return { type: 'reps', count: (parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2 };
            
            // Numero semplice "10"
            const numMatch = s.match(/(\d+)/);
            if (numMatch) return { type: 'reps', count: parseInt(numMatch[1]) };
            
            return { type: 'reps', count: 10 }; // Default
        };
        
        // Helper: parse rest da stringa
        const parseRest = (restStr) => {
            const s = String(restStr || '').toLowerCase();
            
            // "90-120s", "90-120 sec"
            const rangeMatch = s.match(/(\d+)\s*[-–]\s*(\d+)/);
            if (rangeMatch) return (parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2;
            
            // "90s", "120sec"
            const secMatch = s.match(/(\d+)\s*s/);
            if (secMatch) return parseInt(secMatch[1]);
            
            // "3 min", "2min"
            const minMatch = s.match(/(\d+)\s*min/);
            if (minMatch) return parseInt(minMatch[1]) * 60;
            
            // Numero semplice "90"
            const numMatch = s.match(/(\d+)/);
            if (numMatch) return parseInt(numMatch[1]);
            
            return 60; // Default 60s
        };
        
        // Helper: determina equipment dall'esercizio
        const detectEquipment = (name) => {
            const n = (name || '').toLowerCase();
            if (/barbell|squat|deadlift|bench press|overhead press|row(?!ing)/i.test(n)) return 'barbell';
            if (/dumbbell|db\s|manubri/i.test(n)) return 'dumbbell';
            if (/machine|leg press|lat pulldown|cable|pulley/i.test(n)) return 'machine';
            if (/cable|pulley/i.test(n)) return 'cable';
            if (/kettlebell|kb\s/i.test(n)) return 'kettlebell';
            if (/band|elastic/i.test(n)) return 'band';
            if (/medicine ball|slam|throw/i.test(n)) return 'medicine_ball';
            if (/bag|sacco|heavy bag/i.test(n)) return 'bag';
            if (/push-?up|pull-?up|plank|burpee|jumping|bodyweight|bw/i.test(n)) return 'bodyweight';
            return 'default';
        };
        
        // Traccia se c'è warmup/cooldown esplicito
        let hasExplicitWarmup = false;
        let hasExplicitCooldown = false;
        
        // Rileva circuiti per calcolo speciale
        const circuitGroups = {};
        
        // Prima passata: identifica strutture
        exercises.forEach(ex => {
            const name = (ex.name || '').trim();
            const phase = (ex.phase || ex.type || '').toLowerCase();
            
            if (phase === 'warmup' || phase === 'mobility') hasExplicitWarmup = true;
            if (phase === 'cooldown' || phase === 'flexibility') hasExplicitCooldown = true;
            
            // Raggruppa circuiti (C1:, C2:, etc.)
            const circuitMatch = name.match(/^([A-Z])(\d+):/);
            if (circuitMatch) {
                const circuitId = circuitMatch[1];
                if (!circuitGroups[circuitId]) circuitGroups[circuitId] = [];
                circuitGroups[circuitId].push(ex);
            }
        });
        
        // Calcola tempo per ogni esercizio
        let processedCircuits = new Set();
        
        for (const ex of exercises) {
            const name = (ex.name || '').trim();
            const sets = parseInt(ex.sets) || 3;
            const repsData = parseReps(ex.reps);
            const restSeconds = parseRest(ex.rest);
            const type = (ex.phase || ex.type || 'hypertrophy').toLowerCase();
            const equipment = detectEquipment(name);
            
            // Tempo per singola rep
            const repDuration = TIME.repDuration[type] || TIME.repDuration.hypertrophy;
            
            // Check se è parte di un circuito
            const circuitMatch = name.match(/^([A-Z])(\d+):/);
            
            let exerciseTime = 0;
            
            if (circuitMatch && !processedCircuits.has(circuitMatch[1])) {
                // Calcola tempo INTERO circuito (una sola volta)
                const circuitId = circuitMatch[1];
                const circuitExercises = circuitGroups[circuitId];
                const circuitRounds = 3; // Standard: 3 giri per circuito
                
                // Tempo per SINGOLO giro del circuito
                let roundTime = 0;
                let maxRestBetweenRounds = 60; // Default
                
                for (const circuitEx of circuitExercises) {
                    const cRepsData = parseReps(circuitEx.reps);
                    const cRestSeconds = parseRest(circuitEx.rest);
                    const cType = (circuitEx.phase || circuitEx.type || 'circuit').toLowerCase();
                    const cRepDur = TIME.repDuration[cType] || TIME.repDuration.circuit;
                    const cSets = parseInt(circuitEx.sets) || 2;
                    
                    // Tempo di lavoro per questo esercizio (sets × reps × tempo/rep)
                    let workTime = 0;
                    if (cRepsData.type === 'timed') {
                        workTime = cRepsData.seconds * cSets;
                    } else if (cRepsData.type === 'rounds') {
                        workTime = cRepsData.count * cRepsData.perRound;
                    } else {
                        workTime = cRepsData.count * cRepDur * cSets;
                    }
                    
                    // Aggiungi tempo lavoro + rest tra set + transizione
                    roundTime += workTime + ((cSets - 1) * 30) + 15; // 30s rest tra set, 15s transizione
                    
                    // Traccia il rest massimo per recupero tra giri
                    if (cRestSeconds > maxRestBetweenRounds) {
                        maxRestBetweenRounds = cRestSeconds;
                    }
                }
                
                // Tempo totale circuito = (giri × tempo/giro) + (giri-1 × rest tra giri)
                exerciseTime = (circuitRounds * roundTime) + ((circuitRounds - 1) * maxRestBetweenRounds);
                exerciseTime += TIME.transition; // Setup iniziale
                
                const totalMinutes = Math.round(exerciseTime / 60);
                breakdown.push({
                    name: `🔁 Circuito ${circuitId} (${circuitExercises.length} esercizi × ${circuitRounds} giri)`,
                    time: exerciseTime,
                    detail: `${Math.round(roundTime/60)}min/giro + ${maxRestBetweenRounds}s recupero = ~${totalMinutes}min totali`
                });
                
                processedCircuits.add(circuitId);
            } else if (!circuitMatch) {
                // Esercizio singolo (non in circuito)
                let workTime = 0;
                
                if (repsData.type === 'timed') {
                    // Es. "2 min" -> tempo diretto
                    workTime = repsData.seconds;
                } else if (repsData.type === 'rounds') {
                    // Es. "3 rounds" -> assumi 3 min per round
                    workTime = repsData.count * repsData.perRound;
                } else {
                    // Reps normali
                    workTime = repsData.count * repDuration;
                }
                
                // Setup equipment
                const setupTime = TIME.setupTime[equipment] || TIME.setupTime.default;
                
                // Tempo totale: (sets × work) + ((sets-1) × rest) + setup + transizione
                exerciseTime = (sets * workTime) + ((sets - 1) * restSeconds) + setupTime + TIME.transition;
                
                breakdown.push({
                    name: name,
                    time: exerciseTime,
                    sets: sets,
                    type: type
                });
            }
            // Se è parte di circuito già processato, skip
            
            totalSeconds += exerciseTime;
        }
        
        // Aggiungi warmup/cooldown se non espliciti
        if (!hasExplicitWarmup) {
            totalSeconds += TIME.sessionWarmup;
            breakdown.unshift({ name: '🔥 Warmup generico', time: TIME.sessionWarmup });
        }
        if (!hasExplicitCooldown) {
            totalSeconds += TIME.sessionCooldown;
            breakdown.push({ name: '🧘 Cooldown generico', time: TIME.sessionCooldown });
        }
        
        // Converti in minuti
        const totalMinutes = Math.round(totalSeconds / 60);
        
        console.log(`⏱️ Durata calcolata: ${totalMinutes} minuti`);
        console.log('📊 Breakdown:', breakdown.map(b => `${b.name}: ${Math.round(b.time/60)}min`).join(', '));
        
        return {
            minutes: totalMinutes,
            seconds: totalSeconds,
            breakdown: breakdown,
            hasExplicitWarmup,
            hasExplicitCooldown
        };
    }
};

console.log('🧠 ATLAS Exercise Intelligence v1.0 loaded');
