/**
 * ============================================================
 * GR PERFORM - Dynamic Fatigue Model
 * ============================================================
 * Sistema di modellazione della fatica multi-dimensionale
 * 
 * Dimensioni della fatica tracciate:
 * 1. Muscolare (per gruppo muscolare)
 * 2. CNS (Sistema Nervoso Centrale)
 * 3. Metabolica (glicolitica, ossidativa)
 * 4. Psicologica (motivazione, stress mentale)
 * 5. Articolare (stress meccanico)
 * 
 * Principi scientifici:
 * - Fitness-Fatigue Model (Banister)
 * - Supercompensation Theory
 * - Non-linear fatigue accumulation
 * - Individual recovery profiles
 * ============================================================
 */

const DynamicFatigueModel = {
    
    // ============================================================
    // CONFIGURAZIONE
    // ============================================================
    
    config: {
        // Costanti temporali di recupero (ore)
        recoveryConstants: {
            muscular: {
                light: 24,      // Recupero da carico leggero
                moderate: 48,   // Recupero da carico moderato
                heavy: 72,      // Recupero da carico pesante
                maximal: 96     // Recupero da carico massimale
            },
            cns: {
                light: 12,
                moderate: 36,
                heavy: 72,
                maximal: 120    // CNS richiede più tempo per carichi massimali
            },
            metabolic: {
                glycolytic: 48, // Sistema glicolitico
                oxidative: 24,  // Sistema aerobico
                phosphagen: 4   // ATP-CP (recupero rapido)
            },
            psychological: {
                baseline: 24,   // Stress mentale baseline
                competition: 72 // Post-competizione
            },
            articular: {
                light: 24,
                moderate: 48,
                heavy: 72
            }
        },
        
        // Moltiplicatori per tipo di esercizio
        exerciseImpact: {
            // Compound movements
            squat: { muscular: 1.2, cns: 1.3, articular: 1.1 },
            deadlift: { muscular: 1.3, cns: 1.5, articular: 1.2 },
            bench_press: { muscular: 1.0, cns: 1.1, articular: 0.9 },
            overhead_press: { muscular: 1.0, cns: 1.1, articular: 1.0 },
            row: { muscular: 0.9, cns: 0.8, articular: 0.7 },
            
            // Olympic lifts
            clean: { muscular: 1.1, cns: 1.4, articular: 1.0 },
            snatch: { muscular: 1.0, cns: 1.5, articular: 1.1 },
            clean_and_jerk: { muscular: 1.2, cns: 1.5, articular: 1.1 },
            
            // Plyometrics
            box_jump: { muscular: 0.8, cns: 1.2, articular: 1.3 },
            depth_jump: { muscular: 0.9, cns: 1.4, articular: 1.5 },
            bounding: { muscular: 1.0, cns: 1.3, articular: 1.4 },
            
            // Conditioning
            sprint: { muscular: 1.1, cns: 1.2, metabolic_glycolytic: 1.3 },
            tempo_run: { muscular: 0.6, cns: 0.4, metabolic_oxidative: 1.2 },
            intervals: { muscular: 0.9, cns: 0.8, metabolic_glycolytic: 1.4 },
            
            // Isolation
            isolation: { muscular: 0.6, cns: 0.3, articular: 0.4 },
            
            // Default
            default: { muscular: 0.7, cns: 0.5, articular: 0.5 }
        },
        
        // Soglie di allarme
        thresholds: {
            warning: 65,    // Fatica moderata
            high: 80,       // Fatica alta - ridurre volume
            critical: 90,   // Fatica critica - riposo necessario
            overtraining: 95 // Rischio overtraining
        },
        
        // Fattori individuali (modificabili per atleta)
        individualFactors: {
            recoveryRate: 1.0,      // 0.7-1.3 (slow-fast)
            stressTolerance: 1.0,   // 0.8-1.2 (low-high)
            sleepQuality: 1.0,      // 0.6-1.2 (poor-excellent)
            nutritionQuality: 1.0,  // 0.7-1.2 (poor-excellent)
            age: 1.0                // 0.8-1.2 (older recovers slower)
        },
        
        // Pesi per calcolo fatica totale
        weights: {
            muscular: 0.30,
            cns: 0.25,
            psychological: 0.20,
            articular: 0.15,
            metabolic: 0.10
        }
    },
    
    // ============================================================
    // STATO DELLA FATICA
    // ============================================================
    
    state: {
        // Fatica muscolare per gruppo
        muscular: {
            quadriceps: 0,
            hamstrings: 0,
            glutes: 0,
            back: 0,
            chest: 0,
            shoulders: 0,
            biceps: 0,
            triceps: 0,
            core: 0,
            calves: 0
        },
        
        // Fatica CNS (0-100)
        cns: 0,
        
        // Fatica metabolica
        metabolic: {
            glycolytic: 0,
            oxidative: 0,
            phosphagen: 0
        },
        
        // Fatica psicologica
        psychological: 0,
        
        // Stress articolare
        articular: {
            knees: 0,
            hips: 0,
            lower_back: 0,
            shoulders: 0,
            elbows: 0,
            wrists: 0,
            ankles: 0
        },
        
        // Timestamp ultimo aggiornamento
        lastUpdate: null,
        
        // Storico sessioni (ultimi 14 giorni)
        sessionHistory: []
    },
    
    // ============================================================
    // MUSCLE GROUP MAPPING
    // ============================================================
    
    muscleGroupMapping: {
        // Compound → muscle groups
        squat: ['quadriceps', 'glutes', 'core', 'back'],
        deadlift: ['back', 'hamstrings', 'glutes', 'core'],
        bench_press: ['chest', 'shoulders', 'triceps'],
        overhead_press: ['shoulders', 'triceps', 'core'],
        row: ['back', 'biceps'],
        pull_up: ['back', 'biceps', 'core'],
        lunge: ['quadriceps', 'glutes', 'hamstrings'],
        hip_thrust: ['glutes', 'hamstrings'],
        
        // Olympic lifts
        clean: ['quadriceps', 'back', 'shoulders', 'core'],
        snatch: ['back', 'shoulders', 'quadriceps', 'core'],
        
        // Isolation
        leg_curl: ['hamstrings'],
        leg_extension: ['quadriceps'],
        calf_raise: ['calves'],
        bicep_curl: ['biceps'],
        tricep_extension: ['triceps'],
        lateral_raise: ['shoulders'],
        chest_fly: ['chest'],
        
        // Plyometrics
        box_jump: ['quadriceps', 'calves', 'glutes'],
        depth_jump: ['quadriceps', 'calves'],
        
        // Default
        default: ['core']
    },
    
    // Joint mapping
    jointMapping: {
        squat: ['knees', 'hips', 'ankles'],
        deadlift: ['lower_back', 'hips', 'knees'],
        bench_press: ['shoulders', 'elbows', 'wrists'],
        overhead_press: ['shoulders', 'elbows', 'wrists'],
        clean: ['knees', 'hips', 'wrists', 'shoulders'],
        snatch: ['shoulders', 'wrists', 'hips'],
        lunge: ['knees', 'hips', 'ankles'],
        box_jump: ['knees', 'ankles'],
        depth_jump: ['knees', 'ankles'],
        default: []
    },
    
    // ============================================================
    // METODI PRINCIPALI
    // ============================================================
    
    /**
     * Inizializza il modello per un atleta
     */
    initialize(athleteId, athleteProfile = {}) {
        console.log('🧠 DynamicFatigueModel: Initializing for athlete', athleteId);
        
        // Carica stato salvato o crea nuovo
        const savedState = this.loadState(athleteId);
        
        if (savedState) {
            this.state = savedState;
            console.log('📊 Loaded saved fatigue state');
        } else {
            this.resetState();
            console.log('🆕 Created fresh fatigue state');
        }
        
        // Applica fattori individuali
        if (athleteProfile.age) {
            this.config.individualFactors.age = this.calculateAgeFactor(athleteProfile.age);
        }
        
        // Decay fatigue based on time since last update
        this.applyTimeDecay();
        
        return this;
    },
    
    /**
     * Calcola fattore età per recupero
     */
    calculateAgeFactor(age) {
        if (age < 25) return 1.1;      // Recupero veloce
        if (age < 30) return 1.0;      // Baseline
        if (age < 35) return 0.95;
        if (age < 40) return 0.9;
        if (age < 45) return 0.85;
        return 0.8;                     // >45, recupero più lento
    },
    
    /**
     * Registra una sessione di allenamento
     */
    logSession(session) {
        // Safety check
        if (!this.state || !this.state.muscular) {
            console.warn('🧠 DynamicFatigueModel: State not initialized in logSession');
            return { total: 0, dimensions: {}, status: 'optimal', readinessScore: 100 };
        }
        
        console.log('📝 DynamicFatigueModel: Logging session', session);
        
        const timestamp = session.timestamp || Date.now();
        const exercises = session.exercises || [];
        const sessionIntensity = session.intensity || 'moderate'; // light, moderate, heavy, maximal
        const sessionVolume = session.volume || 'moderate';
        const sessionType = session.type || 'strength'; // strength, power, conditioning, recovery
        
        // Calcola impatto per ogni esercizio
        exercises.forEach(exercise => {
            this.processExercise(exercise, sessionIntensity, sessionType);
        });
        
        // Aggiungi impatto psicologico
        this.addPsychologicalLoad(session);
        
        // Aggiungi impatto metabolico basato sul tipo
        this.addMetabolicLoad(session);
        
        // Salva nella history
        this.state.sessionHistory.push({
            timestamp,
            type: sessionType,
            intensity: sessionIntensity,
            volume: sessionVolume,
            exercises: exercises.length,
            totalFatigueAdded: this.calculateSessionFatigue(session)
        });
        
        // Mantieni solo ultimi 14 giorni
        const fourteenDaysAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
        this.state.sessionHistory = this.state.sessionHistory.filter(s => s.timestamp > fourteenDaysAgo);
        
        // Aggiorna timestamp
        this.state.lastUpdate = Date.now();
        
        return this.getFullStatus();
    },
    
    /**
     * Processa un singolo esercizio
     */
    processExercise(exercise, sessionIntensity, sessionType) {
        const exerciseName = this.normalizeExerciseName(exercise.name || exercise);
        const sets = exercise.sets || 3;
        const reps = exercise.reps || 8;
        const rpe = exercise.rpe || 7;
        
        // Calcola carico relativo
        const volumeLoad = sets * reps;
        const intensityMultiplier = this.getIntensityMultiplier(sessionIntensity, rpe);
        
        // Get impact coefficients
        const impact = this.config.exerciseImpact[exerciseName] || 
                       this.config.exerciseImpact.default;
        
        // Fatica muscolare
        const muscleGroups = this.muscleGroupMapping[exerciseName] || 
                             this.muscleGroupMapping.default;
        
        const muscularFatigue = (volumeLoad / 24) * intensityMultiplier * impact.muscular;
        
        muscleGroups.forEach(muscle => {
            if (this.state.muscular[muscle] !== undefined) {
                this.state.muscular[muscle] = Math.min(100, 
                    this.state.muscular[muscle] + muscularFatigue
                );
            }
        });
        
        // Fatica CNS
        const cnsFatigue = (volumeLoad / 30) * intensityMultiplier * impact.cns;
        this.state.cns = Math.min(100, this.state.cns + cnsFatigue);
        
        // Stress articolare
        const joints = this.jointMapping[exerciseName] || this.jointMapping.default;
        const articularStress = (volumeLoad / 30) * intensityMultiplier * (impact.articular || 0.5);
        
        joints.forEach(joint => {
            if (this.state.articular[joint] !== undefined) {
                this.state.articular[joint] = Math.min(100,
                    this.state.articular[joint] + articularStress
                );
            }
        });
    },
    
    /**
     * Normalizza nome esercizio
     */
    normalizeExerciseName(name) {
        if (!name) return 'default';
        
        const normalized = name.toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
        
        // Map common variations
        const mappings = {
            'back_squat': 'squat',
            'front_squat': 'squat',
            'goblet_squat': 'squat',
            'conventional_deadlift': 'deadlift',
            'sumo_deadlift': 'deadlift',
            'romanian_deadlift': 'deadlift',
            'rdl': 'deadlift',
            'flat_bench': 'bench_press',
            'incline_bench': 'bench_press',
            'military_press': 'overhead_press',
            'ohp': 'overhead_press',
            'push_press': 'overhead_press',
            'barbell_row': 'row',
            'bent_over_row': 'row',
            'pendlay_row': 'row',
            'power_clean': 'clean',
            'hang_clean': 'clean',
            'power_snatch': 'snatch',
            'hang_snatch': 'snatch'
        };
        
        return mappings[normalized] || normalized;
    },
    
    /**
     * Ottieni moltiplicatore intensità
     */
    getIntensityMultiplier(intensity, rpe = 7) {
        const baseMultipliers = {
            light: 0.5,
            moderate: 1.0,
            heavy: 1.5,
            maximal: 2.0
        };
        
        const base = baseMultipliers[intensity] || 1.0;
        const rpeAdjustment = (rpe - 7) * 0.1; // RPE 7 = baseline
        
        return base + rpeAdjustment;
    },
    
    /**
     * Aggiungi carico psicologico
     */
    addPsychologicalLoad(session) {
        const type = session.type || 'strength';
        const intensity = session.intensity || 'moderate';
        
        let psychLoad = 5; // Base
        
        // Type impact
        if (type === 'competition') psychLoad += 25;
        else if (type === 'test' || type === 'max') psychLoad += 15;
        else if (type === 'power') psychLoad += 10;
        else if (type === 'conditioning') psychLoad += 8;
        
        // Intensity impact
        if (intensity === 'maximal') psychLoad *= 1.5;
        else if (intensity === 'heavy') psychLoad *= 1.2;
        else if (intensity === 'light') psychLoad *= 0.6;
        
        this.state.psychological = Math.min(100, 
            this.state.psychological + psychLoad
        );
    },
    
    /**
     * Aggiungi carico metabolico
     */
    addMetabolicLoad(session) {
        const type = session.type || 'strength';
        const duration = session.duration || 60; // minuti
        
        if (type === 'conditioning' || type === 'cardio') {
            // Conditioning principalmente glicolitico/ossidativo
            this.state.metabolic.glycolytic = Math.min(100,
                this.state.metabolic.glycolytic + (duration / 10)
            );
            this.state.metabolic.oxidative = Math.min(100,
                this.state.metabolic.oxidative + (duration / 8)
            );
        } else if (type === 'power' || type === 'strength') {
            // Power/strength usa phosphagen
            this.state.metabolic.phosphagen = Math.min(100,
                this.state.metabolic.phosphagen + (duration / 15)
            );
        }
    },
    
    /**
     * Calcola fatica totale sessione
     */
    calculateSessionFatigue(session) {
        const exercises = session.exercises || [];
        let total = 0;
        
        exercises.forEach(ex => {
            const sets = ex.sets || 3;
            const reps = ex.reps || 8;
            total += sets * reps;
        });
        
        return total;
    },
    
    /**
     * Applica decay temporale
     */
    applyTimeDecay() {
        // Safety check - state not initialized
        if (!this.state || !this.state.lastUpdate) return;
        
        const hoursSinceUpdate = (Date.now() - this.state.lastUpdate) / (1000 * 60 * 60);
        const recoveryRate = this.config.individualFactors.recoveryRate;
        
        // Decay muscular fatigue
        Object.keys(this.state.muscular).forEach(muscle => {
            const decayRate = this.config.recoveryConstants.muscular.moderate;
            const decay = (hoursSinceUpdate / decayRate) * 100 * recoveryRate;
            this.state.muscular[muscle] = Math.max(0, this.state.muscular[muscle] - decay);
        });
        
        // Decay CNS
        const cnsDecayRate = this.config.recoveryConstants.cns.moderate;
        const cnsDecay = (hoursSinceUpdate / cnsDecayRate) * 100 * recoveryRate;
        this.state.cns = Math.max(0, this.state.cns - cnsDecay);
        
        // Decay psychological
        const psychDecay = (hoursSinceUpdate / this.config.recoveryConstants.psychological.baseline) * 100 * recoveryRate;
        this.state.psychological = Math.max(0, this.state.psychological - psychDecay);
        
        // Decay metabolic
        Object.keys(this.state.metabolic).forEach(system => {
            const rate = this.config.recoveryConstants.metabolic[system] || 24;
            const decay = (hoursSinceUpdate / rate) * 100 * recoveryRate;
            this.state.metabolic[system] = Math.max(0, this.state.metabolic[system] - decay);
        });
        
        // Decay articular
        Object.keys(this.state.articular).forEach(joint => {
            const decayRate = this.config.recoveryConstants.articular.moderate;
            const decay = (hoursSinceUpdate / decayRate) * 100 * recoveryRate;
            this.state.articular[joint] = Math.max(0, this.state.articular[joint] - decay);
        });
        
        this.state.lastUpdate = Date.now();
    },
    
    // ============================================================
    // ANALISI E RACCOMANDAZIONI
    // ============================================================
    
    /**
     * Ottieni stato completo della fatica
     */
    getFullStatus() {
        // Safety check - return default if state not fully initialized
        if (!this.state || !this.state.muscular || typeof this.state.cns !== 'number') {
            console.warn('🧠 DynamicFatigueModel: State not ready in getFullStatus');
            return {
                total: 0,
                dimensions: { muscular: 0, cns: 0, psychological: 0, articular: 0, metabolic: 0 },
                details: { muscular: {}, articular: {}, metabolic: {} },
                status: 'optimal',
                alerts: [],
                recommendations: { volumeModifier: 1.0, intensityModifier: 1.0 },
                readinessScore: 100,
                sessionHistory: []
            };
        }
        
        this.applyTimeDecay();
        
        const muscularAvg = this.getAverageMuscularFatigue();
        const articularAvg = this.getAverageArticularStress();
        const metabolicAvg = this.getAverageMetabolicFatigue();
        
        // Calcola fatica totale pesata
        const totalFatigue = (
            muscularAvg * 0.30 +
            this.state.cns * 0.25 +
            this.state.psychological * 0.20 +
            articularAvg * 0.15 +
            metabolicAvg * 0.10
        );
        
        return {
            total: Math.round(totalFatigue),
            dimensions: {
                muscular: Math.round(muscularAvg),
                cns: Math.round(this.state.cns),
                psychological: Math.round(this.state.psychological),
                articular: Math.round(articularAvg),
                metabolic: Math.round(metabolicAvg)
            },
            details: {
                muscular: { ...this.state.muscular },
                articular: { ...this.state.articular },
                metabolic: { ...this.state.metabolic }
            },
            status: this.getStatusLevel(totalFatigue),
            alerts: this.generateAlerts(),
            recommendations: this.generateRecommendations(),
            readinessScore: Math.round(100 - totalFatigue),
            sessionHistory: this.state.sessionHistory
        };
    },
    
    /**
     * Media fatica muscolare
     */
    getAverageMuscularFatigue() {
        if (!this.state || !this.state.muscular) return 0;
        const values = Object.values(this.state.muscular);
        return values.reduce((a, b) => a + b, 0) / values.length;
    },
    
    /**
     * Media stress articolare
     */
    getAverageArticularStress() {
        if (!this.state || !this.state.articular) return 0;
        const values = Object.values(this.state.articular);
        return values.reduce((a, b) => a + b, 0) / values.length;
    },
    
    /**
     * Media fatica metabolica
     */
    getAverageMetabolicFatigue() {
        if (!this.state || !this.state.metabolic) return 0;
        const values = Object.values(this.state.metabolic);
        return values.reduce((a, b) => a + b, 0) / values.length;
    },
    
    /**
     * Determina livello status
     */
    getStatusLevel(fatigue) {
        if (fatigue >= this.config.thresholds.overtraining) return 'overtraining';
        if (fatigue >= this.config.thresholds.critical) return 'critical';
        if (fatigue >= this.config.thresholds.high) return 'high';
        if (fatigue >= this.config.thresholds.warning) return 'warning';
        return 'optimal';
    },
    
    /**
     * Genera alerts
     */
    generateAlerts() {
        const alerts = [];
        
        // Safety check - state not initialized
        if (!this.state || !this.state.muscular) {
            return alerts;
        }
        
        const thresholds = this.config.thresholds;
        
        // Check CNS
        if (this.state.cns >= thresholds.critical) {
            alerts.push({
                type: 'danger',
                dimension: 'CNS',
                message: `Fatica CNS critica (${Math.round(this.state.cns)}%). Evitare carichi pesanti e movimenti esplosivi.`,
                value: this.state.cns
            });
        } else if (this.state.cns >= thresholds.high) {
            alerts.push({
                type: 'warning',
                dimension: 'CNS',
                message: `Fatica CNS elevata (${Math.round(this.state.cns)}%). Ridurre intensità.`,
                value: this.state.cns
            });
        }
        
        // Check muscle groups
        Object.entries(this.state.muscular).forEach(([muscle, value]) => {
            if (value >= thresholds.critical) {
                alerts.push({
                    type: 'danger',
                    dimension: 'muscular',
                    muscle,
                    message: `${this.formatMuscleName(muscle)} in stato critico (${Math.round(value)}%). Evitare completamente.`,
                    value
                });
            } else if (value >= thresholds.high) {
                alerts.push({
                    type: 'warning',
                    dimension: 'muscular',
                    muscle,
                    message: `${this.formatMuscleName(muscle)} affaticato (${Math.round(value)}%). Volume ridotto consigliato.`,
                    value
                });
            }
        });
        
        // Check joints
        Object.entries(this.state.articular).forEach(([joint, value]) => {
            if (value >= thresholds.high) {
                alerts.push({
                    type: 'warning',
                    dimension: 'articular',
                    joint,
                    message: `Stress articolare ${this.formatJointName(joint)} elevato. Considerare esercizi alternativi.`,
                    value
                });
            }
        });
        
        // Check psychological
        if (this.state.psychological >= thresholds.high) {
            alerts.push({
                type: 'warning',
                dimension: 'psychological',
                message: `Fatica mentale elevata (${Math.round(this.state.psychological)}%). Sessione ludica o riposo consigliato.`,
                value: this.state.psychological
            });
        }
        
        return alerts;
    },
    
    /**
     * Genera raccomandazioni
     */
    generateRecommendations() {
        const recommendations = {
            volumeModifier: 1.0,
            intensityModifier: 1.0,
            avoidMuscleGroups: [],
            avoidExerciseTypes: [],
            preferredTypes: [],
            suggestedFocus: [],
            recoveryActions: []
        };
        
        // Safety check - ensure state exists and is fully initialized
        if (!this.state || !this.state.muscular || typeof this.state.cns !== 'number' || typeof this.state.psychological !== 'number') {
            console.warn('🧠 DynamicFatigueModel: State not fully initialized, returning default recommendations');
            return recommendations;
        }
        
        // Calculate total fatigue directly to avoid recursion
        const muscularAvg = this.getAverageMuscularFatigue();
        const articularAvg = this.getAverageArticularStress();
        const metabolicAvg = this.getAverageMetabolicFatigue();
        
        const totalFatigue = (
            muscularAvg * this.config.weights.muscular +
            this.state.cns * this.config.weights.cns +
            this.state.psychological * this.config.weights.psychological +
            articularAvg * this.config.weights.articular +
            metabolicAvg * this.config.weights.metabolic
        );
        
        // Volume/intensity modifiers based on total fatigue
        if (totalFatigue >= 90) {
            recommendations.volumeModifier = 0.3;
            recommendations.intensityModifier = 0.4;
            recommendations.preferredTypes = ['recovery', 'mobility'];
            recommendations.recoveryActions = [
                'Riposo attivo o completo',
                'Sonno extra (9+ ore)',
                'Idratazione aumentata',
                'Nutrizione anti-infiammatoria'
            ];
        } else if (totalFatigue >= 80) {
            recommendations.volumeModifier = 0.5;
            recommendations.intensityModifier = 0.6;
            recommendations.preferredTypes = ['technique', 'mobility', 'low_intensity'];
            recommendations.recoveryActions = [
                'Sessione tecnica leggera',
                'Stretching/mobilità',
                'Sonno 8+ ore'
            ];
        } else if (totalFatigue >= 65) {
            recommendations.volumeModifier = 0.7;
            recommendations.intensityModifier = 0.8;
            recommendations.preferredTypes = ['moderate_volume', 'skill_work'];
        }
        
        // Muscle groups to avoid
        Object.entries(this.state.muscular).forEach(([muscle, value]) => {
            if (value >= 80) {
                recommendations.avoidMuscleGroups.push(muscle);
            }
        });
        
        // Suggested focus (muscle groups with low fatigue)
        Object.entries(this.state.muscular).forEach(([muscle, value]) => {
            if (value < 30) {
                recommendations.suggestedFocus.push(muscle);
            }
        });
        
        // Exercise types to avoid based on CNS
        if (this.state.cns >= 70) {
            recommendations.avoidExerciseTypes.push('maximal_lifts', 'plyometrics', 'olympic_lifts');
        }
        
        return recommendations;
    },
    
    /**
     * Format muscle name
     */
    formatMuscleName(muscle) {
        const names = {
            quadriceps: 'Quadricipiti',
            hamstrings: 'Femorali',
            glutes: 'Glutei',
            back: 'Dorsali',
            chest: 'Pettorali',
            shoulders: 'Spalle',
            biceps: 'Bicipiti',
            triceps: 'Tricipiti',
            core: 'Core',
            calves: 'Polpacci'
        };
        return names[muscle] || muscle;
    },
    
    /**
     * Format joint name
     */
    formatJointName(joint) {
        const names = {
            knees: 'ginocchia',
            hips: 'anche',
            lower_back: 'zona lombare',
            shoulders: 'spalle',
            elbows: 'gomiti',
            wrists: 'polsi',
            ankles: 'caviglie'
        };
        return names[joint] || joint;
    },
    
    // ============================================================
    // PREDIZIONI
    // ============================================================
    
    /**
     * Predici stato fatica in X ore
     */
    predictFatigueIn(hours) {
        // Clone current state
        const projected = JSON.parse(JSON.stringify(this.state));
        const recoveryRate = this.config.individualFactors.recoveryRate;
        
        // Apply projected decay
        Object.keys(projected.muscular).forEach(muscle => {
            const decayRate = this.config.recoveryConstants.muscular.moderate;
            const decay = (hours / decayRate) * 100 * recoveryRate;
            projected.muscular[muscle] = Math.max(0, projected.muscular[muscle] - decay);
        });
        
        const cnsDecay = (hours / this.config.recoveryConstants.cns.moderate) * 100 * recoveryRate;
        projected.cns = Math.max(0, projected.cns - cnsDecay);
        
        const psychDecay = (hours / this.config.recoveryConstants.psychological.baseline) * 100 * recoveryRate;
        projected.psychological = Math.max(0, projected.psychological - psychDecay);
        
        // Calculate projected total
        const muscularAvg = Object.values(projected.muscular).reduce((a, b) => a + b, 0) / 
                           Object.values(projected.muscular).length;
        const articularAvg = Object.values(projected.articular).reduce((a, b) => a + b, 0) / 
                            Object.values(projected.articular).length;
        const metabolicAvg = Object.values(projected.metabolic).reduce((a, b) => a + b, 0) / 
                            Object.values(projected.metabolic).length;
        
        const projectedTotal = (
            muscularAvg * 0.30 +
            projected.cns * 0.25 +
            projected.psychological * 0.20 +
            articularAvg * 0.15 +
            metabolicAvg * 0.10
        );
        
        return {
            hours,
            projectedTotal: Math.round(projectedTotal),
            projectedReadiness: Math.round(100 - projectedTotal),
            projected
        };
    },
    
    /**
     * Calcola tempo necessario per raggiungere readiness target
     */
    hoursToReadiness(targetReadiness = 80) {
        const currentStatus = this.getFullStatus();
        const targetFatigue = 100 - targetReadiness;
        
        if (currentStatus.total <= targetFatigue) {
            return 0; // Already at target
        }
        
        // Binary search for hours
        let low = 0;
        let high = 168; // Max 7 days
        
        while (high - low > 1) {
            const mid = (low + high) / 2;
            const predicted = this.predictFatigueIn(mid);
            
            if (predicted.projectedTotal <= targetFatigue) {
                high = mid;
            } else {
                low = mid;
            }
        }
        
        return Math.ceil(high);
    },
    
    // ============================================================
    // INTEGRAZIONE CON WORKOUT PRECEDENTI
    // ============================================================
    
    /**
     * Stima fatica da workout precedenti (parsing automatico)
     */
    estimateFromWorkoutHistory(workouts) {
        console.log('🔄 DynamicFatigueModel: Estimating from workout history');
        
        // Safety check - ensure state is initialized before processing
        if (!this.state || !this.state.muscular || typeof this.state.cns !== 'number') {
            console.warn('🧠 DynamicFatigueModel: State not initialized in estimateFromWorkoutHistory');
            // Try to reset state if it's corrupted
            if (this.state && !this.state.muscular) {
                console.log('🔄 Attempting to reset corrupted state');
                this.resetState();
            } else {
                return {
                    total: 0,
                    dimensions: { muscular: 0, cns: 0, psychological: 0, articular: 0, metabolic: 0 },
                    details: { muscular: {}, articular: {}, metabolic: {} },
                    status: 'optimal',
                    alerts: [],
                    recommendations: [],
                    readinessScore: 100,
                    sessionHistory: []
                };
            }
        }
        
        workouts.forEach(workout => {
            if (!workout.date) return;
            
            const workoutDate = new Date(workout.date);
            const now = new Date();
            const daysDiff = (now - workoutDate) / (1000 * 60 * 60 * 24);
            
            // Solo ultimi 7 giorni
            if (daysDiff > 7) return;
            
            // Stima sessione
            const estimatedSession = {
                timestamp: workoutDate.getTime(),
                type: this.inferWorkoutType(workout),
                intensity: this.inferIntensity(workout),
                duration: workout.duration || 60,
                exercises: this.parseExercises(workout)
            };
            
            // Simula impatto (attenuato dal tempo)
            const attenuation = Math.max(0.1, 1 - (daysDiff / 7));
            this.logSessionAttenuated(estimatedSession, attenuation);
        });
        
        return this.getFullStatus();
    },
    
    /**
     * Inferisci tipo workout
     */
    inferWorkoutType(workout) {
        const name = (workout.name || '').toLowerCase();
        
        if (name.includes('forza') || name.includes('strength')) return 'strength';
        if (name.includes('potenza') || name.includes('power')) return 'power';
        if (name.includes('cardio') || name.includes('conditioning')) return 'conditioning';
        if (name.includes('recupero') || name.includes('recovery')) return 'recovery';
        if (name.includes('mobilità') || name.includes('mobility')) return 'mobility';
        
        return 'strength'; // default
    },
    
    /**
     * Inferisci intensità
     */
    inferIntensity(workout) {
        const name = (workout.name || '').toLowerCase();
        
        if (name.includes('max') || name.includes('pesante') || name.includes('heavy')) return 'heavy';
        if (name.includes('leggero') || name.includes('light') || name.includes('easy')) return 'light';
        if (name.includes('moderato') || name.includes('moderate')) return 'moderate';
        
        return 'moderate';
    },
    
    /**
     * Parsa esercizi da workout
     */
    parseExercises(workout) {
        if (workout.exercises && Array.isArray(workout.exercises)) {
            return workout.exercises;
        }
        
        // Prova a parsare da contenuto testuale
        const content = workout.content || workout.description || '';
        const exercises = [];
        
        // Pattern matching per esercizi comuni
        const patterns = [
            /squat/i, /deadlift/i, /bench/i, /press/i, /row/i,
            /pull.?up/i, /lunge/i, /clean/i, /snatch/i
        ];
        
        patterns.forEach(pattern => {
            if (pattern.test(content)) {
                exercises.push({
                    name: content.match(pattern)[0],
                    sets: 4,
                    reps: 6,
                    rpe: 7
                });
            }
        });
        
        return exercises;
    },
    
    /**
     * Log sessione con attenuazione temporale
     */
    logSessionAttenuated(session, attenuation) {
        // Safety check
        if (!this.state || !this.state.muscular) {
            console.warn('🧠 DynamicFatigueModel: State not initialized in logSessionAttenuated');
            return;
        }
        
        const originalState = JSON.parse(JSON.stringify(this.state));
        this.logSession(session);
        
        // Attenua l'impatto
        Object.keys(this.state.muscular).forEach(muscle => {
            const added = this.state.muscular[muscle] - originalState.muscular[muscle];
            this.state.muscular[muscle] = originalState.muscular[muscle] + (added * attenuation);
        });
        
        const cnsAdded = this.state.cns - originalState.cns;
        this.state.cns = originalState.cns + (cnsAdded * attenuation);
        
        const psychAdded = this.state.psychological - originalState.psychological;
        this.state.psychological = originalState.psychological + (psychAdded * attenuation);
    },
    
    // ============================================================
    // FORMATO PER AI PROMPT
    // ============================================================
    
    /**
     * Formatta per inclusione nel prompt AI
     */
    formatForPrompt() {
        const status = this.getFullStatus();
        
        if (status.total < 20) {
            return `
🧠 STATO FATICA ATLETA: OTTIMALE
- Readiness Score: ${status.readinessScore}%
- Tutte le dimensioni in range ottimale
- Nessuna limitazione - allenamento completo possibile
`;
        }
        
        let prompt = `
🧠 MODELLO FATICA DINAMICA
═══════════════════════════════════════
📊 STATO ATTUALE
- Fatica Totale: ${status.total}% (${status.status})
- Readiness Score: ${status.readinessScore}%

📈 DIMENSIONI FATICA:
- Muscolare: ${status.dimensions.muscular}%
- CNS: ${status.dimensions.cns}%
- Psicologica: ${status.dimensions.psychological}%
- Articolare: ${status.dimensions.articular}%
- Metabolica: ${status.dimensions.metabolic}%
`;
        
        // Add alerts
        if (status.alerts.length > 0) {
            prompt += `\n⚠️ ALERTS ATTIVI:\n`;
            status.alerts.forEach(alert => {
                prompt += `- [${alert.type.toUpperCase()}] ${alert.message}\n`;
            });
        }
        
        // Add recommendations
        const recs = status.recommendations;
        prompt += `\n📋 RACCOMANDAZIONI SISTEMA:\n`;
        prompt += `- Modificatore Volume: ${Math.round(recs.volumeModifier * 100)}%\n`;
        prompt += `- Modificatore Intensità: ${Math.round(recs.intensityModifier * 100)}%\n`;
        
        if (recs.avoidMuscleGroups.length > 0) {
            prompt += `- EVITARE gruppi muscolari: ${recs.avoidMuscleGroups.map(m => this.formatMuscleName(m)).join(', ')}\n`;
        }
        
        if (recs.suggestedFocus.length > 0) {
            prompt += `- Focus consigliato: ${recs.suggestedFocus.slice(0, 3).map(m => this.formatMuscleName(m)).join(', ')}\n`;
        }
        
        if (recs.avoidExerciseTypes.length > 0) {
            prompt += `- EVITARE tipi esercizio: ${recs.avoidExerciseTypes.join(', ')}\n`;
        }
        
        if (recs.recoveryActions.length > 0) {
            prompt += `\n🔄 AZIONI RECUPERO CONSIGLIATE:\n`;
            recs.recoveryActions.forEach(action => {
                prompt += `- ${action}\n`;
            });
        }
        
        // Add prediction
        const prediction24h = this.predictFatigueIn(24);
        const prediction48h = this.predictFatigueIn(48);
        
        prompt += `\n🔮 PREDIZIONI RECUPERO:\n`;
        prompt += `- Tra 24h: Readiness ${prediction24h.projectedReadiness}%\n`;
        prompt += `- Tra 48h: Readiness ${prediction48h.projectedReadiness}%\n`;
        
        const hoursTo80 = this.hoursToReadiness(80);
        if (hoursTo80 > 0) {
            prompt += `- Ore per 80% readiness: ~${hoursTo80}h\n`;
        }
        
        return prompt;
    },
    
    // ============================================================
    // PERSISTENZA
    // ============================================================
    
    /**
     * Salva stato
     */
    saveState(athleteId) {
        try {
            const key = `grperform_fatigue_${athleteId}`;
            localStorage.setItem(key, JSON.stringify(this.state));
            console.log('💾 Fatigue state saved');
        } catch (e) {
            console.warn('Could not save fatigue state:', e);
        }
    },
    
    /**
     * Carica stato
     */
    loadState(athleteId) {
        try {
            const key = `grperform_fatigue_${athleteId}`;
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.warn('Could not load fatigue state:', e);
            return null;
        }
    },
    
    /**
     * Reset state
     */
    resetState() {
        this.state = {
            muscular: {
                quadriceps: 0,
                hamstrings: 0,
                glutes: 0,
                back: 0,
                chest: 0,
                shoulders: 0,
                biceps: 0,
                triceps: 0,
                core: 0,
                calves: 0
            },
            cns: 0,
            metabolic: {
                glycolytic: 0,
                oxidative: 0,
                phosphagen: 0
            },
            psychological: 0,
            articular: {
                knees: 0,
                hips: 0,
                lower_back: 0,
                shoulders: 0,
                elbows: 0,
                wrists: 0,
                ankles: 0
            },
            lastUpdate: Date.now(),
            sessionHistory: []
        };
    },
    
    // ============================================================
    // UTILITY
    // ============================================================
    
    /**
     * Debug output
     */
    debug() {
        console.log('🧠 DynamicFatigueModel Debug:');
        console.table(this.state.muscular);
        console.log('CNS:', this.state.cns);
        console.log('Psychological:', this.state.psychological);
        console.table(this.state.articular);
        console.log('Full Status:', this.getFullStatus());
    }
};

// Export
if (typeof window !== 'undefined') {
    window.DynamicFatigueModel = DynamicFatigueModel;
}

console.log('🧠 DynamicFatigueModel loaded - Multi-dimensional fatigue tracking system');
