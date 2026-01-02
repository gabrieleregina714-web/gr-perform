/**
 * GR Perform - AI Expert Integrator v1.0
 * 
 * 🔌 MODULO DI INTEGRAZIONE AI ESPERTO
 * 
 * Questo modulo connette tutti i componenti del sistema AI esperto:
 * - ExpertKnowledgeEngine (conoscenza sport-specifica)
 * - ExpertReasoningChain (spiegazioni decisioni)
 * - AdaptiveIntelligence (intelligenza adattiva)
 * - Training Methods (metodologie)
 * - Injury Prevention (prevenzione)
 * - Exercise Library (libreria esercizi)
 * 
 * Fornisce un'API unificata per generare workout intelligenti e spiegati.
 */

window.AIExpertIntegrator = (function() {
    'use strict';

    const VERSION = '1.0';

    // ═══════════════════════════════════════════════════════════════════════════
    // 1. MODULE REFERENCES
    // ═══════════════════════════════════════════════════════════════════════════

    const getModules = () => ({
        knowledge: window.ExpertKnowledgeEngine,
        reasoning: window.ExpertReasoningChain,
        adaptive: window.AdaptiveIntelligence,
        methods: window.TRAINING_METHODS,
        methodsAdvanced: window.ROLE_ADAPTATIONS,
        injury: window.InjuryPreventionEngine,
        exercises: window.ExerciseLibraryV2 || window.ExerciseLibrary,
        periodization: window.PeriodizationEngine
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. UNIFIED WORKOUT CONTEXT BUILDER
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Costruisce un contesto completo unificando tutti i dati
     */
    function buildUnifiedContext(athleteProfile, sessionParams = {}) {
        const modules = getModules();
        
        const context = {
            // Base info
            athlete_id: athleteProfile.id || 'anonymous',
            timestamp: new Date().toISOString(),
            
            // Sport & Goal
            sport: athleteProfile.sport || 'fitness',
            position: athleteProfile.position || athleteProfile.role || null,
            goal: athleteProfile.goal || 'general_fitness',
            
            // Experience & Demographics
            experience_level: athleteProfile.experience_level || 'intermediate',
            age: athleteProfile.age || 30,
            
            // Current State
            readiness: athleteProfile.readiness || sessionParams.readiness || 80,
            sleep_quality: athleteProfile.sleep_quality || 'good',
            stress_level: athleteProfile.stress_level || 'medium',
            
            // Health & Constraints
            injury_history: athleteProfile.injury_history || [],
            pain_areas: athleteProfile.pain_areas || [],
            movement_limitations: athleteProfile.movement_limitations || [],
            contraindications: athleteProfile.contraindications || [],
            
            // Periodization
            phase: sessionParams.phase || athleteProfile.current_phase || 'accumulation',
            week_of_phase: sessionParams.week_of_phase || 1,
            mesocycle_week: sessionParams.mesocycle_week || 1,
            
            // Match Day Protocol (for sports)
            in_season: athleteProfile.in_season || false,
            match_day_type: sessionParams.match_day_type || null,
            days_to_match: sessionParams.days_to_match || null,
            
            // Session Specific
            session_type: sessionParams.session_type || 'full_body',
            available_time: sessionParams.available_time || 60,
            available_equipment: sessionParams.available_equipment || ['barbell', 'dumbbell', 'cables'],
            
            // Historical (for adaptive)
            recent_sessions: athleteProfile.recent_sessions || [],
            training_history: athleteProfile.training_history || []
        };

        // Enrich with module data
        if (modules.knowledge) {
            const sportExpertise = modules.knowledge.getSportExpertise(context.sport);
            context._sport_expertise = sportExpertise;
            context._golden_rules = modules.knowledge.getSessionGoldenRules(context);
        }

        if (modules.adaptive && context.training_history.length > 0) {
            context._fatigue = modules.adaptive.calculateFatigue(context.recent_sessions);
            context._anomalies = modules.adaptive.detectAnomalies(context.training_history);
            context._athlete_dna = modules.adaptive.buildAthleteDNA(context.training_history);
        }

        if (modules.injury) {
            context._risk_assessment = modules.injury.assessRisk?.(athleteProfile) || null;
        }

        return context;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. INTELLIGENT WORKOUT GENERATOR
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Genera un workout intelligente con reasoning completo
     */
    function generateIntelligentWorkout(athleteProfile, sessionParams = {}) {
        const modules = getModules();
        const context = buildUnifiedContext(athleteProfile, sessionParams);
        
        // Start reasoning chain
        const reasoningChain = modules.reasoning?.createChain(context) || { decisions: [], recordDecision: () => {} };
        
        const workout = {
            id: `wk_${Date.now()}`,
            generated_at: new Date().toISOString(),
            context_summary: summarizeContext(context),
            
            // Workout structure
            warmup: null,
            main_workout: [],
            conditioning: null,
            cooldown: null,
            
            // Metadata
            selected_methods: [],
            excluded_exercises: [],
            applied_rules: [],
            
            // Reasoning
            reasoning_report: null,
            
            // Warnings & Notes
            warnings: [],
            coaching_notes: [],
            
            // Adaptive
            recommended_adjustments: null,
            game_changer: null
        };

        try {
            // 1. Apply contextual overrides
            if (modules.adaptive) {
                const overrideResult = modules.adaptive.applyContextualOverrides({}, context);
                if (overrideResult._overrides_applied?.length > 0) {
                    workout.applied_rules.push(...overrideResult._overrides_applied.map(o => o.note));
                    reasoningChain.recordDecision('override', { overrides: overrideResult._overrides_applied }, 
                        [{ name: 'context', value: 'situational_override', impact: 'neutral' }]);
                }
            }

            // 2. Select methodologies
            if (modules.knowledge) {
                const methodSelection = modules.knowledge.selectMethodologies(context);
                workout.selected_methods = methodSelection.primary;
                workout.applied_rules.push(...methodSelection.rationale);
            }

            // 3. Handle match day protocol
            if (context.match_day_type) {
                const matchDayProtocol = applyMatchDayProtocol(context);
                workout.warnings.push(`⚽ ${context.match_day_type.toUpperCase()}: ${matchDayProtocol.note}`);
                workout.applied_rules.push(matchDayProtocol.rule);
            }

            // 4. Handle anomalies
            if (context._anomalies?.length > 0) {
                const criticalAnomalies = context._anomalies.filter(a => a.severity === 'critical' || a.severity === 'warning');
                criticalAnomalies.forEach(a => {
                    workout.warnings.push(`⚠️ ${a.message} - ${a.action}`);
                });
            }

            // 5. Get sport-specific golden rules
            if (context._golden_rules) {
                workout.coaching_notes.push(...context._golden_rules);
            }

            // 6. Generate game changer
            if (modules.adaptive) {
                workout.game_changer = modules.adaptive.identifyGameChanger(context);
            }

            // 7. Get personalized recommendations from DNA
            if (context._athlete_dna) {
                workout.recommended_adjustments = modules.adaptive.getPersonalizedRecommendations(context._athlete_dna);
            }

            // 8. Generate reasoning report
            if (reasoningChain.generateReport) {
                workout.reasoning_report = reasoningChain.generateReport();
            }

        } catch (error) {
            console.error('Error generating intelligent workout:', error);
            workout.warnings.push(`⚠️ Errore durante generazione: ${error.message}`);
        }

        return workout;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. CONTEXT HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    function summarizeContext(context) {
        const parts = [];
        
        parts.push(`Sport: ${context.sport}`);
        if (context.position) parts.push(`Ruolo: ${context.position}`);
        parts.push(`Goal: ${context.goal}`);
        parts.push(`Fase: ${context.phase}`);
        parts.push(`Readiness: ${context.readiness}%`);
        
        if (context.in_season) parts.push('📅 In-Season');
        if (context.match_day_type) parts.push(`🗓️ ${context.match_day_type.toUpperCase()}`);
        if (context.injury_history?.length > 0) parts.push(`⚠️ Infortuni: ${context.injury_history.length}`);
        if (context.pain_areas?.length > 0) parts.push(`🔴 Dolori: ${context.pain_areas.join(', ')}`);
        
        return parts.join(' | ');
    }

    function applyMatchDayProtocol(context) {
        const protocols = {
            'md-3': { note: 'Ultimo giorno per lavoro pesante', rule: 'Forza OK, volume medio-alto' },
            'md-2': { note: 'Velocità e agilità, no volume', rule: 'Solo qualità, no fatica' },
            'md-1': { note: 'Solo attivazione leggera', rule: 'Warm-up esteso, no lavoro' },
            'md0': { note: 'Giorno gara', rule: 'Solo primer mattutino se serve' },
            'md+1': { note: 'Recovery attivo', rule: 'Pool, foam roll, mobilità' },
            'md+2': { note: 'Rientro graduale', rule: 'Volume basso, intensità bassa' }
        };

        return protocols[context.match_day_type?.toLowerCase()] || { note: 'Nessun protocollo specifico', rule: 'Standard' };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. EXERCISE EVALUATION
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Valuta un esercizio nel contesto dato
     */
    function evaluateExercise(exercise, context) {
        const modules = getModules();
        const evaluation = {
            approved: true,
            score: 100,
            reasons: [],
            warnings: [],
            blocks: []
        };

        // Knowledge-based evaluation
        if (modules.knowledge?.evaluateExerciseFit) {
            const fit = modules.knowledge.evaluateExerciseFit(exercise, context);
            evaluation.score = fit.value;
            evaluation.reasons.push(...fit.reasons);
            evaluation.warnings.push(...fit.warnings);
            evaluation.blocks.push(...fit.blocks);
            
            if (fit.value <= 0 || fit.blocks.length > 0) {
                evaluation.approved = false;
            }
        }

        // Injury/Pain based blocking
        const painAreas = context.pain_areas || [];
        const exerciseMuscles = exercise.muscles?.primary || [];
        
        painAreas.forEach(pain => {
            if (exerciseMuscles.some(m => m.toLowerCase().includes(pain.toLowerCase()))) {
                evaluation.approved = false;
                evaluation.blocks.push(`Bloccato: coinvolge area dolorante (${pain})`);
            }
        });

        // Match day blocking
        if (['md0', 'md-1', 'md+1'].includes(context.match_day_type)) {
            if (exercise.recovery_cost === 'very_high') {
                evaluation.approved = false;
                evaluation.blocks.push(`Bloccato: troppo impattante per ${context.match_day_type}`);
            }
        }

        return evaluation;
    }

    /**
     * Spiega perché un esercizio è stato scelto o escluso
     */
    function explainExerciseDecision(exercise, context, isApproved) {
        const modules = getModules();
        
        if (!modules.reasoning) {
            return { formatted: isApproved ? `✅ ${exercise.name}` : `❌ ${exercise.name}` };
        }

        if (isApproved) {
            return modules.reasoning.explainExerciseChoice(exercise, context);
        } else {
            const evaluation = evaluateExercise(exercise, context);
            const mainReason = evaluation.blocks[0] || evaluation.warnings[0] || 'Non adatto al contesto';
            return modules.reasoning.explainExerciseExclusion(exercise, context, mainReason);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 6. AI PROMPT ENRICHMENT
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Genera contesto arricchito per prompt AI
     * Da usare quando si genera il prompt per LLM
     */
    function generateEnrichedPromptContext(athleteProfile, sessionParams = {}) {
        const context = buildUnifiedContext(athleteProfile, sessionParams);
        
        const promptContext = {
            // Dati essenziali per AI
            athlete_summary: summarizeContext(context),
            
            // Sport expertise
            sport_knowledge: context._sport_expertise ? {
                physical_demands: context._sport_expertise.physical_demands,
                training_priorities: context._sport_expertise.training_priorities,
                injury_risks: context._sport_expertise.injury_risks
            } : null,
            
            // Active constraints
            constraints: [
                ...context.injury_history.map(i => `Storico infortunio: ${i}`),
                ...context.pain_areas.map(p => `Dolore attuale: ${p}`),
                ...context.contraindications.map(c => `Controindicazione: ${c}`)
            ],
            
            // Session parameters
            phase: context.phase,
            match_day_protocol: context.match_day_type ? applyMatchDayProtocol(context).note : null,
            
            // Adaptive insights
            fatigue_status: context._fatigue ? {
                neural: (context._fatigue.neural * 100).toFixed(0) + '%',
                muscular: (context._fatigue.muscular * 100).toFixed(0) + '%',
                total: (context._fatigue.total * 100).toFixed(0) + '%'
            } : null,
            
            anomalies: context._anomalies?.filter(a => a.severity !== 'info').map(a => a.message) || [],
            
            // DNA-based recommendations
            athlete_dna_summary: context._athlete_dna ? {
                recovery_speed: context._athlete_dna.recovery_speed,
                volume_tolerance: context._athlete_dna.volume_tolerance,
                strengths: context._athlete_dna.strengths,
                weaknesses: context._athlete_dna.weaknesses
            } : null,
            
            // Rules to follow
            golden_rules: context._golden_rules || [],
            
            // What to absolutely avoid
            absolute_avoid: [
                ...context.pain_areas.map(p => `Evitare carichi su: ${p}`),
                ...(context.match_day_type === 'md-1' ? ['Evitare qualsiasi fatica significativa'] : []),
                ...(context.phase === 'deload' ? ['Evitare cedimento, RPE max 6'] : [])
            ]
        };

        return promptContext;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 7. SYSTEM HEALTH CHECK
    // ═══════════════════════════════════════════════════════════════════════════

    function checkSystemHealth() {
        const modules = getModules();
        const health = {
            timestamp: new Date().toISOString(),
            status: 'OK',
            modules: {},
            issues: []
        };

        // Check each module
        const moduleChecks = [
            ['knowledge', 'ExpertKnowledgeEngine'],
            ['reasoning', 'ExpertReasoningChain'],
            ['adaptive', 'AdaptiveIntelligence'],
            ['methods', 'TRAINING_METHODS'],
            ['injury', 'InjuryPreventionEngine'],
            ['exercises', 'ExerciseLibrary'],
            ['periodization', 'PeriodizationEngine']
        ];

        moduleChecks.forEach(([key, name]) => {
            if (modules[key]) {
                health.modules[name] = {
                    loaded: true,
                    version: modules[key].VERSION || 'unknown'
                };
            } else {
                health.modules[name] = { loaded: false };
                health.issues.push(`Module ${name} not loaded`);
            }
        });

        // Determine overall status
        const criticalModules = ['knowledge', 'methods'];
        const criticalMissing = criticalModules.filter(m => !modules[m]);
        
        if (criticalMissing.length > 0) {
            health.status = 'DEGRADED';
        }
        if (Object.values(modules).filter(Boolean).length === 0) {
            health.status = 'CRITICAL';
        }

        return health;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 8. PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════════

    console.log(`🔌 AIExpertIntegrator v${VERSION} loaded`);

    return {
        VERSION,
        
        // Context
        buildUnifiedContext,
        summarizeContext,
        
        // Workout Generation
        generateIntelligentWorkout,
        
        // Exercise Evaluation
        evaluateExercise,
        explainExerciseDecision,
        
        // AI Integration
        generateEnrichedPromptContext,
        
        // System
        checkSystemHealth,
        getModules,
        
        // Quick access
        getExpertise: (sport) => getModules().knowledge?.getSportExpertise(sport),
        getGoldenRules: (context) => getModules().knowledge?.getSessionGoldenRules(context),
        detectAnomalies: (history) => getModules().adaptive?.detectAnomalies(history),
        getGameChanger: (profile) => getModules().adaptive?.identifyGameChanger(profile)
    };
})();

// Auto-log system health on load
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const health = window.AIExpertIntegrator?.checkSystemHealth();
            if (health) {
                console.log('🔌 AIExpertIntegrator Health:', health.status);
                if (health.issues.length > 0) {
                    console.warn('Issues:', health.issues);
                }
            }
        }, 1000);
    });
}
