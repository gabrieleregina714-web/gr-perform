// ═══════════════════════════════════════════════════════════════════════════════════
// 🔧 ATLAS AUTO-ADJUSTER - Sistema Adattamento Automatico Fasi
// ═══════════════════════════════════════════════════════════════════════════════════
//
// Responsabilità:
// - Monitora segnali di overtraining/undertraining
// - Decide automaticamente quando modificare il macro-plan
// - Gestisce eventi straordinari (malattia, vacanza, plateau)
// - Ottimizza timing dei deload
//
// Principio: Flexible Periodization (Kiely 2024)
// "Il piano è una guida, non una legge. L'atleta viene prima del programma."
// ═══════════════════════════════════════════════════════════════════════════════════

const AtlasAutoAdjuster = {

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚨 SOGLIE DI ALLARME
    // ═══════════════════════════════════════════════════════════════════════════

    thresholds: {
        // Overtraining
        overtraining: {
            fatigue_high: 8,               // Fatica >= 8 per 2+ settimane
            performance_declining: 2,       // Settimane consecutive in calo
            sleep_poor_streak: 2,          // Settimane con sonno scarso
            motivation_low: 4,              // Motivazione <= 4
            rpe_creep: 1.5,                // RPE aumenta di 1.5+ a parità carico
            hrv_drop_percent: 15           // HRV cala del 15%+
        },
        
        // Undertraining / Coasting
        undertraining: {
            fatigue_low_streak: 3,         // Fatica <= 4 per 3+ settimane
            rpe_too_easy: 6,               // RPE medio <= 6 (troppo facile)
            no_progression_weeks: 4        // Nessun progresso per 4 settimane
        },
        
        // Ottimale (estendi fase)
        optimal: {
            excellent_weeks: 2,            // 2+ settimane eccellenti
            fatigue_moderate: 6,           // Fatica 5-7 (zona ottimale)
            performance_improving: 2       // Progressione per 2+ settimane
        },

        // Plateau
        plateau: {
            same_weight_weeks: 3,          // Stesso peso per 3+ settimane su lift principale
            motivation_stagnant: 3         // Motivazione costante media per 3+ settimane
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🧠 ANALISI SEGNALI
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Analizza dati atleta e suggerisce aggiustamenti
     */
    analyze(athleteProgress, macroTemplate) {
        const weekHistory = athleteProgress.week_history || [];
        const signals = athleteProgress.adaptation_signals || {};
        const currentWeek = athleteProgress.macro_plan.current_week;
        
        // Analisi multi-dimensionale
        const overtrainingRisk = this.assessOvertrainingRisk(weekHistory, signals);
        const undertrainingRisk = this.assessUndertrainingRisk(weekHistory, signals);
        const plateauDetected = this.detectPlateau(weekHistory, athleteProgress.key_metrics);
        const optimalAdaptation = this.detectOptimalAdaptation(weekHistory, signals);
        
        // Decisione
        const decision = this.makeDecision({
            overtrainingRisk,
            undertrainingRisk,
            plateauDetected,
            optimalAdaptation,
            currentWeek,
            macroTemplate,
            signals
        });
        
        return {
            analysis: {
                overtraining_risk: overtrainingRisk,
                undertraining_risk: undertrainingRisk,
                plateau: plateauDetected,
                optimal: optimalAdaptation
            },
            decision,
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Valuta rischio overtraining
     */
    assessOvertrainingRisk(weekHistory, signals) {
        if (weekHistory.length < 2) return { risk: 'low', score: 0, factors: [] };
        
        const recentWeeks = weekHistory.slice(-3);
        const factors = [];
        let score = 0;
        
        // Check fatica alta
        const highFatigueWeeks = recentWeeks.filter(w => w.fatigue >= this.thresholds.overtraining.fatigue_high);
        if (highFatigueWeeks.length >= 2) {
            score += 30;
            factors.push(`Fatica >= ${this.thresholds.overtraining.fatigue_high} per ${highFatigueWeeks.length} settimane`);
        }
        
        // Check performance in calo
        const decliningWeeks = recentWeeks.filter(w => w.performance === 'declining');
        if (decliningWeeks.length >= 2) {
            score += 35;
            factors.push(`Performance in calo per ${decliningWeeks.length} settimane`);
        }
        
        // Check sonno
        const poorSleepWeeks = recentWeeks.filter(w => w.sleep_quality === 'poor');
        if (poorSleepWeeks.length >= 2) {
            score += 20;
            factors.push(`Sonno scarso per ${poorSleepWeeks.length} settimane`);
        }
        
        // Check motivazione
        const lowMotivationWeeks = recentWeeks.filter(w => w.motivation <= this.thresholds.overtraining.motivation_low);
        if (lowMotivationWeeks.length >= 2) {
            score += 25;
            factors.push(`Motivazione bassa per ${lowMotivationWeeks.length} settimane`);
        }
        
        // Flags accumulati
        if (signals.overreaching_flags >= 2) {
            score += 15;
            factors.push(`${signals.overreaching_flags} segnali overreaching accumulati`);
        }
        
        // Tempo dall'ultimo deload
        if (signals.last_deload_week) {
            const weeksSinceDeload = weekHistory.length - signals.last_deload_week;
            if (weeksSinceDeload >= 6) {
                score += 10;
                factors.push(`${weeksSinceDeload} settimane dall'ultimo deload`);
            }
        }
        
        return {
            risk: score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low',
            score,
            factors
        };
    },

    /**
     * Valuta rischio undertraining
     */
    assessUndertrainingRisk(weekHistory, signals) {
        if (weekHistory.length < 3) return { risk: 'low', score: 0, factors: [] };
        
        const recentWeeks = weekHistory.slice(-4);
        const factors = [];
        let score = 0;
        
        // Fatica troppo bassa = non stai spingendo abbastanza
        const lowFatigueWeeks = recentWeeks.filter(w => w.fatigue <= 4);
        if (lowFatigueWeeks.length >= 3) {
            score += 35;
            factors.push(`Fatica bassa (≤4) per ${lowFatigueWeeks.length} settimane - forse troppo facile`);
        }
        
        // Performance sempre stabile ma mai in miglioramento
        const stableWeeks = recentWeeks.filter(w => w.performance === 'stable');
        if (stableWeeks.length >= 3 && recentWeeks.filter(w => w.performance === 'improving' || w.performance === 'excellent').length === 0) {
            score += 30;
            factors.push(`Nessun miglioramento per ${stableWeeks.length} settimane`);
        }
        
        // Aderenza bassa
        const lowAdherence = recentWeeks.filter(w => w.adherence_rate < 0.7);
        if (lowAdherence.length >= 2) {
            score += 20;
            factors.push(`Bassa aderenza al programma`);
        }
        
        return {
            risk: score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low',
            score,
            factors
        };
    },

    /**
     * Rileva plateau
     */
    detectPlateau(weekHistory, keyMetrics) {
        if (weekHistory.length < 4) return { detected: false, factors: [] };
        
        const factors = [];
        let plateauScore = 0;
        
        // Check PRs - se non ci sono PRs per 4+ settimane su nessun lift
        const recentPRs = weekHistory.slice(-4).flatMap(w => w.prs_achieved || []);
        if (recentPRs.length === 0 && weekHistory.length >= 4) {
            plateauScore += 40;
            factors.push('Nessun PR nelle ultime 4 settimane');
        }
        
        // Check same weights per exercise principale
        // Questo richiederebbe workout_history più dettagliato
        
        // Check motivazione costante media (né alta né bassa = stagnazione)
        const recentMotivation = weekHistory.slice(-3).map(w => w.motivation);
        const avgMotivation = recentMotivation.reduce((a, b) => a + b, 0) / recentMotivation.length;
        const motivationVariance = recentMotivation.reduce((sum, m) => sum + Math.pow(m - avgMotivation, 2), 0) / recentMotivation.length;
        
        if (avgMotivation >= 5 && avgMotivation <= 7 && motivationVariance < 1) {
            plateauScore += 25;
            factors.push('Motivazione stagnante (costante ma non entusiasmante)');
        }
        
        return {
            detected: plateauScore >= 40,
            score: plateauScore,
            factors
        };
    },

    /**
     * Rileva adattamento ottimale (estendi fase)
     */
    detectOptimalAdaptation(weekHistory, signals) {
        if (weekHistory.length < 2) return { optimal: false, factors: [] };
        
        const recentWeeks = weekHistory.slice(-2);
        const factors = [];
        let optimalScore = 0;
        
        // Settimane eccellenti consecutive
        const excellentWeeks = recentWeeks.filter(w => 
            w.performance === 'excellent' || w.performance === 'improving'
        );
        if (excellentWeeks.length >= 2) {
            optimalScore += 40;
            factors.push('Performance eccellente per 2+ settimane');
        }
        
        // Fatica nella zona ottimale
        const optimalFatigue = recentWeeks.filter(w => w.fatigue >= 5 && w.fatigue <= 7);
        if (optimalFatigue.length >= 2) {
            optimalScore += 30;
            factors.push('Fatica nella zona ottimale (5-7)');
        }
        
        // Alta motivazione
        const highMotivation = recentWeeks.filter(w => w.motivation >= 8);
        if (highMotivation.length >= 2) {
            optimalScore += 20;
            factors.push('Motivazione alta');
        }
        
        // PRs recenti
        const recentPRs = recentWeeks.flatMap(w => w.prs_achieved || []);
        if (recentPRs.length > 0) {
            optimalScore += 15;
            factors.push(`${recentPRs.length} PR recenti`);
        }
        
        return {
            optimal: optimalScore >= 60,
            score: optimalScore,
            factors
        };
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 DECISION MAKING
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Prende decisione basata su analisi
     */
    makeDecision(analysisData) {
        const { 
            overtrainingRisk, 
            undertrainingRisk, 
            plateauDetected, 
            optimalAdaptation,
            currentWeek,
            macroTemplate,
            signals
        } = analysisData;
        
        // PRIORITÀ 1: Overtraining → Deload immediato
        if (overtrainingRisk.risk === 'high') {
            return {
                action: 'SKIP_TO_DELOAD',
                priority: 'critical',
                reason: 'Rischio overtraining alto',
                details: overtrainingRisk.factors,
                recommendation: `Salta immediatamente alla fase di deload. Fattori: ${overtrainingRisk.factors.join('; ')}`
            };
        }
        
        // PRIORITÀ 2: Overtraining medio → Riduci carico questa settimana
        if (overtrainingRisk.risk === 'medium') {
            return {
                action: 'REDUCE_LOAD',
                priority: 'high',
                reason: 'Segnali di affaticamento',
                details: overtrainingRisk.factors,
                load_modifier: 0.85, // -15%
                volume_modifier: 0.80, // -20%
                recommendation: `Riduci intensità del 15% e volume del 20% questa settimana. Monitora per possibile deload.`
            };
        }
        
        // PRIORITÀ 3: Plateau → Cambio stimolo
        if (plateauDetected.detected) {
            return {
                action: 'CHANGE_STIMULUS',
                priority: 'medium',
                reason: 'Plateau rilevato',
                details: plateauDetected.factors,
                recommendations: [
                    'Cambia metodologie di allenamento',
                    'Modifica ordine esercizi',
                    'Introduci shock week (volume alto)',
                    'Considera cambio split'
                ]
            };
        }
        
        // PRIORITÀ 4: Undertraining → Aumenta stimolo
        if (undertrainingRisk.risk === 'high') {
            return {
                action: 'INCREASE_STIMULUS',
                priority: 'medium',
                reason: 'Stimolo insufficiente',
                details: undertrainingRisk.factors,
                load_modifier: 1.10, // +10%
                volume_modifier: 1.15, // +15%
                recommendation: `Aumenta intensità del 10% e volume del 15%. Il corpo si sta adattando troppo facilmente.`
            };
        }
        
        // PRIORITÀ 5: Adattamento ottimale → Estendi fase
        if (optimalAdaptation.optimal) {
            // Ma solo se non siamo già estesi troppo
            if (signals.phase_extensions < 2) {
                return {
                    action: 'EXTEND_PHASE',
                    priority: 'low',
                    reason: 'Progressione ottimale in corso',
                    details: optimalAdaptation.factors,
                    recommendation: `Fase corrente funziona bene. Ripeti questa settimana prima di passare alla prossima fase.`
                };
            }
        }
        
        // DEFAULT: Continua come programmato
        return {
            action: 'CONTINUE',
            priority: 'none',
            reason: 'Progressione nella norma',
            details: ['Nessun intervento necessario'],
            recommendation: 'Continua con il programma come pianificato.'
        };
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 ESECUZIONE AGGIUSTAMENTI
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Applica aggiustamento al programma
     */
    applyAdjustment(athleteId, decision, macroTemplate) {
        // Dipende da ProgressTracker
        if (typeof AtlasProgressTracker === 'undefined') {
            console.error('AtlasAutoAdjuster: ProgressTracker non disponibile');
            return { success: false, error: 'ProgressTracker non caricato' };
        }
        
        switch (decision.action) {
            case 'SKIP_TO_DELOAD':
                return AtlasProgressTracker.skipToDeload(athleteId, macroTemplate);
                
            case 'EXTEND_PHASE':
                return AtlasProgressTracker.extendCurrentPhase(athleteId);
                
            case 'REDUCE_LOAD':
            case 'INCREASE_STIMULUS':
            case 'CHANGE_STIMULUS':
                // Questi modificano i parametri ma non la posizione nel macro
                return {
                    success: true,
                    modifiers: {
                        load: decision.load_modifier || 1.0,
                        volume: decision.volume_modifier || 1.0
                    },
                    recommendations: decision.recommendations || [decision.recommendation]
                };
                
            case 'CONTINUE':
            default:
                return { success: true, action: 'no_change' };
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 EVENTI STRAORDINARI
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Gestisce eventi straordinari
     */
    handleSpecialEvent(athleteId, event, macroTemplate) {
        const eventHandlers = {
            
            'illness': {
                action: 'PAUSE_AND_DELOAD',
                duration_pause: event.days || 7,
                on_return: 'Start with 50% volume for 1 week',
                modify_plan: (progress) => {
                    progress.macro_plan.status = 'paused';
                    return progress;
                }
            },
            
            'vacation': {
                action: 'MAINTENANCE_MODE',
                during: 'Optional light training 2x/week',
                on_return: 'Resume at 80% volume for first week',
                modify_plan: null // Non modifica lo stato
            },
            
            'injury': {
                action: 'MODIFY_AND_CONTINUE',
                exclude_area: event.body_part,
                substitute: 'Work around injury with alternative exercises',
                recovery_protocol: event.severity === 'severe' ? 'Complete rest for affected area' : 'Light rehab work',
                modify_plan: (progress) => {
                    progress.macro_plan.injury_note = `Infortunio ${event.body_part}: ${event.severity}`;
                    return progress;
                }
            },
            
            'high_stress_period': {
                action: 'REDUCE_VOLUME',
                volume_modifier: 0.7, // -30%
                intensity_keep: true, // Mantieni intensità, taglia volume
                duration: event.expected_weeks || 2,
                recommendation: 'Prioritize compound movements, cut accessories'
            },
            
            'competition': {
                action: 'TAPER_PROTOCOL',
                weeks_out: event.weeks_until || 2,
                protocol: this.getTaperProtocol(event.weeks_until)
            },
            
            'plateau_break': {
                action: 'SHOCK_WEEK',
                volume_modifier: 1.4, // +40% volume
                intensity_modifier: 0.85, // -15% intensity
                duration: 1,
                follow_with: 'deload',
                recommendation: 'High volume shock followed by mini-deload'
            }
        };
        
        const handler = eventHandlers[event.type];
        if (!handler) {
            return { success: false, error: `Evento sconosciuto: ${event.type}` };
        }
        
        // Se c'è modifica al piano, applicala
        if (handler.modify_plan) {
            const progress = AtlasProgressTracker.load(athleteId);
            if (progress) {
                const modified = handler.modify_plan(progress);
                AtlasProgressTracker.save(modified);
            }
        }
        
        return {
            success: true,
            event_type: event.type,
            action: handler.action,
            instructions: handler,
            message: this.generateEventMessage(event.type, handler)
        };
    },

    /**
     * Protocollo taper per competizione
     */
    getTaperProtocol(weeksOut) {
        if (weeksOut <= 1) {
            return {
                volume: 0.4, // -60%
                intensity: 1.0, // Mantieni
                frequency: 0.5,
                focus: 'Activation only, stay fresh'
            };
        } else if (weeksOut <= 2) {
            return {
                volume: 0.6,
                intensity: 0.95,
                frequency: 0.7,
                focus: 'Reduce volume, maintain intensity'
            };
        } else {
            return {
                volume: 0.8,
                intensity: 0.90,
                frequency: 0.85,
                focus: 'Gradual reduction begins'
            };
        }
    },

    /**
     * Genera messaggio per evento
     */
    generateEventMessage(eventType, handler) {
        const messages = {
            'illness': `Evento malattia registrato. Pausa di ${handler.duration_pause} giorni. Al ritorno: ${handler.on_return}`,
            'vacation': `Vacanza registrata. ${handler.during}. Al ritorno: ${handler.on_return}`,
            'injury': `Infortunio registrato. ${handler.recovery_protocol}. ${handler.substitute}`,
            'high_stress_period': `Periodo di stress alto. Volume ridotto al ${handler.volume_modifier * 100}%. ${handler.recommendation}`,
            'competition': `Competizione in arrivo. Protocollo taper attivato.`,
            'plateau_break': `Shock week programmata. Volume +40%, poi deload.`
        };
        
        return messages[eventType] || 'Evento gestito.';
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 REPORT ANALISI
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Genera report completo per prompt AI
     */
    generateAnalysisPrompt(analysis) {
        let prompt = `\n\n🔧 ANALISI AUTO-ADJUSTER:\n`;
        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        
        // Rischi
        prompt += `\n📊 ANALISI RISCHI:\n`;
        prompt += `• Overtraining: ${analysis.analysis.overtraining_risk.risk.toUpperCase()} (score: ${analysis.analysis.overtraining_risk.score})\n`;
        if (analysis.analysis.overtraining_risk.factors.length > 0) {
            prompt += `  Fattori: ${analysis.analysis.overtraining_risk.factors.join('; ')}\n`;
        }
        
        prompt += `• Undertraining: ${analysis.analysis.undertraining_risk.risk.toUpperCase()} (score: ${analysis.analysis.undertraining_risk.score})\n`;
        prompt += `• Plateau: ${analysis.analysis.plateau.detected ? 'RILEVATO' : 'No'}\n`;
        prompt += `• Adattamento ottimale: ${analysis.analysis.optimal.optimal ? 'SÌ' : 'No'}\n`;
        
        // Decisione
        prompt += `\n🎯 DECISIONE:\n`;
        prompt += `Azione: ${analysis.decision.action}\n`;
        prompt += `Priorità: ${analysis.decision.priority}\n`;
        prompt += `Motivo: ${analysis.decision.reason}\n`;
        prompt += `Raccomandazione: ${analysis.decision.recommendation}\n`;
        
        if (analysis.decision.load_modifier) {
            prompt += `\nModificatori applicati:\n`;
            prompt += `• Carico: ${Math.round((analysis.decision.load_modifier - 1) * 100)}%\n`;
            prompt += `• Volume: ${Math.round((analysis.decision.volume_modifier - 1) * 100)}%\n`;
        }
        
        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        
        return prompt;
    }
};

// Export per browser
window.AtlasAutoAdjuster = AtlasAutoAdjuster;
