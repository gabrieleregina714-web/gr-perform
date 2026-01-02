// ═══════════════════════════════════════════════════════════════════════════════════
// ⚖️ ATLAS STRUCTURAL BALANCE - Assessment Squilibri Muscolari
// ═══════════════════════════════════════════════════════════════════════════════════
//
// Basato su:
// - Poliquin Structural Balance (Charles Poliquin)
// - Functional Movement Screen concepts
// - Athletic Performance Testing Standards
//
// Obiettivo:
// - Identificare squilibri muscolari
// - Prevenire infortuni
// - Ottimizzare selezione esercizi per colmare gap
// - Migliorare performance attraverso equilibrio strutturale
//
// ═══════════════════════════════════════════════════════════════════════════════════

const AtlasStructuralBalance = {

    // ═══════════════════════════════════════════════════════════════════════════
    // 📐 RAPPORTI IDEALI (Poliquin Ratios + Modern Research)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Rapporti di forza ideali tra gruppi muscolari
     * Basati su Close Grip Bench Press come riferimento = 100
     */
    idealRatios: {
        // Base: Close Grip Bench Press = 100
        reference: 'close_grip_bench_press',
        
        upperBody: {
            close_grip_bench_press: { ratio: 100, tolerance: 5 },
            bench_press: { ratio: 117, tolerance: 5 },
            incline_press_30deg: { ratio: 100, tolerance: 5 },
            incline_press_45deg: { ratio: 95, tolerance: 5 },
            overhead_press: { ratio: 66, tolerance: 5 },
            behind_neck_press: { ratio: 62, tolerance: 5 },
            dip_weighted: { ratio: 117, tolerance: 5 }, // BW + weight
            
            // Pulling vs Pushing
            weighted_chin_up: { ratio: 90, tolerance: 7 }, // Should be close to CG bench
            bent_over_row: { ratio: 100, tolerance: 7 },   // Equal to CG bench
            seated_row: { ratio: 90, tolerance: 5 },
            
            // Rotator cuff (critico per prevenzione)
            external_rotation: { ratio: 10.6, tolerance: 2 },  // 9-12% of bench
            internal_rotation: { ratio: 13.5, tolerance: 2 },  // 10-15% of bench
        },
        
        lowerBody: {
            // Base: Back Squat = 100 per lower body
            reference_lower: 'back_squat',
            
            back_squat: { ratio: 100, tolerance: 5 },
            front_squat: { ratio: 85, tolerance: 5 },     // 80-90% of back squat
            deadlift: { ratio: 120, tolerance: 10 },      // 110-130% of back squat
            trap_bar_deadlift: { ratio: 115, tolerance: 8 },
            romanian_deadlift: { ratio: 80, tolerance: 5 },
            
            // Unilateral
            bulgarian_split_squat: { ratio: 50, tolerance: 5 }, // Per leg, 45-55% of back squat
            single_leg_rdl: { ratio: 35, tolerance: 5 },        // Per leg
            
            // Leg curl vs leg extension
            leg_curl_seated: { ratio: 60, tolerance: 10 },      // 50-70% of leg extension
            leg_extension: { ratio: 100, tolerance: 5 },        // Reference for quad isolation
            
            // Hip dominant vs Knee dominant
            hip_thrust: { ratio: 120, tolerance: 10 },          // Can exceed squat
        },
        
        // Rapporti critici per prevenzione infortuni
        injuryPrevention: {
            // Hamstring:Quad ratio (leg curl : leg extension)
            hamstring_quad: { ideal: 0.6, min: 0.5, max: 0.8, critical: true },
            
            // Pull:Push ratio (row : bench)
            pull_push: { ideal: 1.0, min: 0.9, max: 1.2, critical: true },
            
            // External:Internal rotation
            external_internal_rotation: { ideal: 0.75, min: 0.66, max: 0.80, critical: true },
            
            // Front:Back squat
            front_back_squat: { ideal: 0.85, min: 0.80, max: 0.90, critical: false },
            
            // Unilateral deficit (% differenza tra gambe)
            unilateral_deficit: { max_percent: 10, warning_percent: 5 }
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🧪 ASSESSMENT TESTS
    // ═══════════════════════════════════════════════════════════════════════════

    assessmentProtocol: {
        
        upperBody: {
            name: "Upper Body Structural Assessment",
            required_lifts: [
                { exercise: 'bench_press', type: '1RM_or_estimate', priority: 1 },
                { exercise: 'bent_over_row', type: '1RM_or_estimate', priority: 1 },
                { exercise: 'overhead_press', type: '1RM_or_estimate', priority: 2 },
                { exercise: 'weighted_chin_up', type: '1RM_or_estimate', priority: 2 },
                { exercise: 'external_rotation', type: '8RM', priority: 3 },
            ],
            duration_minutes: 45,
            rest_between_tests: 180
        },
        
        lowerBody: {
            name: "Lower Body Structural Assessment",
            required_lifts: [
                { exercise: 'back_squat', type: '1RM_or_estimate', priority: 1 },
                { exercise: 'deadlift', type: '1RM_or_estimate', priority: 1 },
                { exercise: 'front_squat', type: '1RM_or_estimate', priority: 2 },
                { exercise: 'leg_curl_seated', type: '8RM', priority: 2 },
                { exercise: 'leg_extension', type: '8RM', priority: 2 },
                { exercise: 'bulgarian_split_squat', type: '5RM_each_leg', priority: 3 },
            ],
            duration_minutes: 60,
            rest_between_tests: 180
        },
        
        quickScreen: {
            name: "Quick Imbalance Screen",
            required_lifts: [
                { exercise: 'bench_press', type: '1RM_or_estimate', priority: 1 },
                { exercise: 'bent_over_row', type: '1RM_or_estimate', priority: 1 },
                { exercise: 'back_squat', type: '1RM_or_estimate', priority: 1 },
                { exercise: 'romanian_deadlift', type: '1RM_or_estimate', priority: 1 },
            ],
            duration_minutes: 30,
            rest_between_tests: 180
        }
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔍 ANALISI SQUILIBRI
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Analizza i dati dell'atleta e identifica squilibri
     * @param {Object} athleteData - { lifts: { exercise: weight_kg } }
     */
    analyzeBalance(athleteData) {
        const lifts = athleteData.lifts || {};
        const issues = [];
        const strengths = [];
        const ratioResults = {};
        
        // Calcola rapporti injury prevention (critici)
        const injuryRatios = this.calculateInjuryPreventionRatios(lifts);
        
        for (const [ratio, result] of Object.entries(injuryRatios)) {
            ratioResults[ratio] = result;
            
            if (result.status === 'critical') {
                issues.push({
                    type: 'critical',
                    ratio: ratio,
                    current: result.current,
                    ideal: result.ideal,
                    message: result.message,
                    correction: result.correction
                });
            } else if (result.status === 'warning') {
                issues.push({
                    type: 'warning',
                    ratio: ratio,
                    current: result.current,
                    ideal: result.ideal,
                    message: result.message,
                    correction: result.correction
                });
            } else if (result.status === 'optimal') {
                strengths.push({
                    ratio: ratio,
                    message: `${ratio.replace(/_/g, ' ')}: bilanciato (${result.current.toFixed(2)})`
                });
            }
        }
        
        // Calcola rapporti upper body
        if (lifts.close_grip_bench_press || lifts.bench_press) {
            const upperRatios = this.calculateUpperBodyRatios(lifts);
            for (const [exercise, result] of Object.entries(upperRatios)) {
                ratioResults[exercise] = result;
                if (result.deviation > 10) {
                    issues.push({
                        type: result.deviation > 20 ? 'critical' : 'warning',
                        exercise: exercise,
                        current_percent: result.current_percent,
                        expected_percent: result.expected_percent,
                        deviation: result.deviation,
                        message: result.message,
                        correction: result.correction
                    });
                }
            }
        }
        
        // Calcola rapporti lower body
        if (lifts.back_squat) {
            const lowerRatios = this.calculateLowerBodyRatios(lifts);
            for (const [exercise, result] of Object.entries(lowerRatios)) {
                ratioResults[exercise] = result;
                if (result.deviation > 10) {
                    issues.push({
                        type: result.deviation > 20 ? 'critical' : 'warning',
                        exercise: exercise,
                        current_percent: result.current_percent,
                        expected_percent: result.expected_percent,
                        deviation: result.deviation,
                        message: result.message,
                        correction: result.correction
                    });
                }
            }
        }
        
        // Calcola unilateral deficit se disponibile
        if (lifts.bulgarian_split_squat_left && lifts.bulgarian_split_squat_right) {
            const uniDeficit = this.calculateUnilateralDeficit(
                lifts.bulgarian_split_squat_left,
                lifts.bulgarian_split_squat_right
            );
            ratioResults.unilateral_legs = uniDeficit;
            if (uniDeficit.deficit_percent > 5) {
                issues.push({
                    type: uniDeficit.deficit_percent > 10 ? 'critical' : 'warning',
                    area: 'unilateral_legs',
                    weak_side: uniDeficit.weak_side,
                    deficit: uniDeficit.deficit_percent,
                    message: `Deficit ${uniDeficit.weak_side}: ${uniDeficit.deficit_percent.toFixed(1)}%`,
                    correction: `Prioritizzare lavoro unilaterale su lato ${uniDeficit.weak_side}`
                });
            }
        }
        
        // Ordina issues per severità
        issues.sort((a, b) => {
            const priority = { critical: 0, warning: 1 };
            return (priority[a.type] || 2) - (priority[b.type] || 2);
        });
        
        // Genera priority score
        const balanceScore = this.calculateBalanceScore(ratioResults);
        
        return {
            balance_score: balanceScore,
            issues,
            strengths,
            detailed_ratios: ratioResults,
            recommendation_priority: this.generatePriorityRecommendations(issues),
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Calcola rapporti critici per prevenzione infortuni
     */
    calculateInjuryPreventionRatios(lifts) {
        const results = {};
        const refs = this.idealRatios.injuryPrevention;
        
        // Hamstring:Quad
        if (lifts.leg_curl_seated && lifts.leg_extension) {
            const ratio = lifts.leg_curl_seated / lifts.leg_extension;
            const ideal = refs.hamstring_quad;
            
            results.hamstring_quad = {
                current: ratio,
                ideal: ideal.ideal,
                min: ideal.min,
                max: ideal.max,
                status: ratio < ideal.min ? 'critical' : 
                        ratio < ideal.ideal * 0.9 ? 'warning' : 
                        ratio > ideal.max ? 'warning' : 'optimal',
                message: ratio < ideal.min 
                    ? `Hamstring deboli (${(ratio*100).toFixed(0)}% vs ideale ${(ideal.ideal*100).toFixed(0)}%). Alto rischio infortunio!`
                    : ratio < ideal.ideal * 0.9
                    ? `Hamstring sotto-sviluppati (${(ratio*100).toFixed(0)}%)`
                    : `Rapporto H:Q bilanciato`,
                correction: ratio < ideal.min 
                    ? 'PRIORITÀ: Nordic curl, Seated leg curl, Romanian deadlift. 2x frequenza hamstrings.'
                    : 'Mantieni lavoro hamstrings.'
            };
        }
        
        // Pull:Push
        if ((lifts.bent_over_row || lifts.seated_row) && lifts.bench_press) {
            const pullValue = lifts.bent_over_row || lifts.seated_row;
            const ratio = pullValue / lifts.bench_press;
            const ideal = refs.pull_push;
            
            results.pull_push = {
                current: ratio,
                ideal: ideal.ideal,
                min: ideal.min,
                max: ideal.max,
                status: ratio < ideal.min ? 'critical' : 
                        ratio < ideal.ideal * 0.95 ? 'warning' : 'optimal',
                message: ratio < ideal.min 
                    ? `Tirata debole rispetto a spinta (${(ratio*100).toFixed(0)}%). Rischio problemi spalle!`
                    : ratio < ideal.ideal * 0.95
                    ? `Leggero squilibrio pull/push (${(ratio*100).toFixed(0)}%)`
                    : `Rapporto pull:push bilanciato`,
                correction: ratio < ideal.min 
                    ? 'PRIORITÀ: Aumentare volume rowing (Barbell row, Cable row, Face pull). Rapporto 2:1 pull:push per 4-6 settimane.'
                    : 'Mantieni volume pulling.'
            };
        }
        
        // External:Internal Rotation
        if (lifts.external_rotation && lifts.internal_rotation) {
            const ratio = lifts.external_rotation / lifts.internal_rotation;
            const ideal = refs.external_internal_rotation;
            
            results.external_internal_rotation = {
                current: ratio,
                ideal: ideal.ideal,
                min: ideal.min,
                status: ratio < ideal.min ? 'critical' : 
                        ratio < ideal.ideal * 0.9 ? 'warning' : 'optimal',
                message: ratio < ideal.min 
                    ? `Extrarotatori deboli (${(ratio*100).toFixed(0)}%). Alto rischio impingement spalla!`
                    : `Rapporto rotatori bilanciato`,
                correction: ratio < ideal.min 
                    ? 'PRIORITÀ: Cuban press, Face pull, External rotation cable. Prima di ogni push workout.'
                    : 'Includere prehab rotatori 2x/settimana.'
            };
        }
        
        // Front:Back Squat
        if (lifts.front_squat && lifts.back_squat) {
            const ratio = lifts.front_squat / lifts.back_squat;
            const ideal = refs.front_back_squat;
            
            results.front_back_squat = {
                current: ratio,
                ideal: ideal.ideal,
                min: ideal.min,
                max: ideal.max,
                status: ratio < ideal.min ? 'warning' : 
                        ratio > ideal.max ? 'warning' : 'optimal',
                message: ratio < ideal.min 
                    ? `Front squat debole (${(ratio*100).toFixed(0)}%). Possibile debolezza core/quads/upper back.`
                    : ratio > ideal.max
                    ? `Back squat proporzionalmente debole. Possibile debolezza catena posteriore.`
                    : `Rapporto front:back squat bilanciato`,
                correction: ratio < ideal.min 
                    ? 'Aumentare frequenza front squat, lavoro core, upper back.'
                    : ratio > ideal.max
                    ? 'Focus su back squat, good mornings, posterior chain.'
                    : 'Bilanciato.'
            };
        }
        
        return results;
    },

    /**
     * Calcola rapporti upper body vs close grip bench
     */
    calculateUpperBodyRatios(lifts) {
        const results = {};
        const refs = this.idealRatios.upperBody;
        
        // Usa CG bench o stima da bench normale
        const reference = lifts.close_grip_bench_press || (lifts.bench_press * 0.85);
        
        const exercises = ['overhead_press', 'weighted_chin_up', 'bent_over_row', 'dip_weighted'];
        
        for (const exercise of exercises) {
            if (lifts[exercise] && refs[exercise]) {
                const expected = (reference * refs[exercise].ratio) / 100;
                const current = lifts[exercise];
                const currentPercent = (current / reference) * 100;
                const deviation = Math.abs(currentPercent - refs[exercise].ratio);
                
                results[exercise] = {
                    current_kg: current,
                    expected_kg: expected,
                    current_percent: currentPercent,
                    expected_percent: refs[exercise].ratio,
                    deviation: deviation,
                    status: deviation <= refs[exercise].tolerance ? 'optimal' : 
                            deviation <= refs[exercise].tolerance * 2 ? 'warning' : 'critical',
                    message: current < expected 
                        ? `${exercise.replace(/_/g, ' ')} debole: ${current}kg vs atteso ${expected.toFixed(0)}kg`
                        : `${exercise.replace(/_/g, ' ')} forte`,
                    correction: current < expected 
                        ? `Prioritizzare ${exercise.replace(/_/g, ' ')}`
                        : 'Bilanciato'
                };
            }
        }
        
        return results;
    },

    /**
     * Calcola rapporti lower body vs back squat
     */
    calculateLowerBodyRatios(lifts) {
        const results = {};
        const refs = this.idealRatios.lowerBody;
        const reference = lifts.back_squat;
        
        const exercises = ['front_squat', 'deadlift', 'romanian_deadlift', 'hip_thrust'];
        
        for (const exercise of exercises) {
            if (lifts[exercise] && refs[exercise]) {
                const expected = (reference * refs[exercise].ratio) / 100;
                const current = lifts[exercise];
                const currentPercent = (current / reference) * 100;
                const deviation = Math.abs(currentPercent - refs[exercise].ratio);
                
                results[exercise] = {
                    current_kg: current,
                    expected_kg: expected,
                    current_percent: currentPercent,
                    expected_percent: refs[exercise].ratio,
                    deviation: deviation,
                    status: deviation <= refs[exercise].tolerance ? 'optimal' : 
                            deviation <= refs[exercise].tolerance * 2 ? 'warning' : 'critical',
                    message: current < expected 
                        ? `${exercise.replace(/_/g, ' ')} debole: ${current}kg vs atteso ${expected.toFixed(0)}kg`
                        : `${exercise.replace(/_/g, ' ')} nella norma/forte`,
                    correction: current < expected 
                        ? `Prioritizzare ${exercise.replace(/_/g, ' ')}`
                        : 'Bilanciato'
                };
            }
        }
        
        return results;
    },

    /**
     * Calcola deficit unilaterale
     */
    calculateUnilateralDeficit(leftValue, rightValue) {
        const stronger = Math.max(leftValue, rightValue);
        const weaker = Math.min(leftValue, rightValue);
        const deficitPercent = ((stronger - weaker) / stronger) * 100;
        
        return {
            left: leftValue,
            right: rightValue,
            strong_side: leftValue >= rightValue ? 'left' : 'right',
            weak_side: leftValue < rightValue ? 'left' : 'right',
            deficit_percent: deficitPercent,
            status: deficitPercent <= 5 ? 'optimal' : 
                    deficitPercent <= 10 ? 'warning' : 'critical'
        };
    },

    /**
     * Calcola score complessivo di equilibrio strutturale
     */
    calculateBalanceScore(ratioResults) {
        let totalScore = 100;
        let criticalCount = 0;
        let warningCount = 0;
        
        for (const result of Object.values(ratioResults)) {
            if (result.status === 'critical') {
                totalScore -= 20;
                criticalCount++;
            } else if (result.status === 'warning') {
                totalScore -= 10;
                warningCount++;
            }
        }
        
        return {
            score: Math.max(0, totalScore),
            grade: totalScore >= 90 ? 'A' : 
                   totalScore >= 80 ? 'B' : 
                   totalScore >= 70 ? 'C' : 
                   totalScore >= 60 ? 'D' : 'F',
            critical_issues: criticalCount,
            warnings: warningCount,
            interpretation: totalScore >= 90 
                ? 'Eccellente equilibrio strutturale'
                : totalScore >= 80 
                ? 'Buon equilibrio con aree da migliorare'
                : totalScore >= 70 
                ? 'Squilibri moderati da correggere'
                : 'Squilibri significativi - priorità correzione'
        };
    },

    /**
     * Genera raccomandazioni prioritarie
     */
    generatePriorityRecommendations(issues) {
        const recommendations = [];
        
        // Priorità 1: Rapporti injury prevention critici
        const criticalInjury = issues.filter(i => i.type === 'critical' && 
            ['hamstring_quad', 'pull_push', 'external_internal_rotation'].includes(i.ratio)
        );
        
        if (criticalInjury.length > 0) {
            recommendations.push({
                priority: 'CRITICAL',
                area: 'Prevenzione Infortuni',
                issues: criticalInjury.map(i => i.ratio),
                action: 'Correggere PRIMA di aumentare carichi su altri lift',
                protocol: this.getInjuryPreventionProtocol(criticalInjury)
            });
        }
        
        // Priorità 2: Deficit unilaterali
        const unilateralIssue = issues.find(i => i.area === 'unilateral_legs' && i.type === 'critical');
        if (unilateralIssue) {
            recommendations.push({
                priority: 'HIGH',
                area: 'Deficit Unilaterale',
                weak_side: unilateralIssue.weak_side,
                action: `Extra set per lato ${unilateralIssue.weak_side} su esercizi unilaterali`,
                protocol: `Bulgarian split squat, Single leg RDL: +2 set lato debole per 4 settimane`
            });
        }
        
        // Priorità 3: Altri squilibri
        const otherIssues = issues.filter(i => 
            !['hamstring_quad', 'pull_push', 'external_internal_rotation'].includes(i.ratio) &&
            i.area !== 'unilateral_legs'
        );
        
        for (const issue of otherIssues.slice(0, 3)) { // Top 3
            recommendations.push({
                priority: issue.type === 'critical' ? 'HIGH' : 'MEDIUM',
                area: issue.exercise || issue.ratio,
                action: issue.correction,
                deviation: issue.deviation
            });
        }
        
        return recommendations;
    },

    /**
     * Genera protocollo per correzione rapporti injury prevention
     */
    getInjuryPreventionProtocol(criticalIssues) {
        const protocols = [];
        
        for (const issue of criticalIssues) {
            switch(issue.ratio) {
                case 'hamstring_quad':
                    protocols.push({
                        issue: 'Hamstring:Quad',
                        duration_weeks: 6,
                        frequency: '2-3x/settimana',
                        exercises: [
                            'Nordic Curl: 3x5 (progressivo)',
                            'Seated Leg Curl: 3x12',
                            'Romanian Deadlift: 3x8',
                            'Slider Leg Curl: 2x15'
                        ],
                        reduce: 'Ridurre volume quad isolation del 30%'
                    });
                    break;
                    
                case 'pull_push':
                    protocols.push({
                        issue: 'Pull:Push',
                        duration_weeks: 4,
                        frequency: 'Ogni sessione upper',
                        exercises: [
                            'Rapporto 2:1 pulling:pushing',
                            'Face Pull: 3x20 ogni sessione',
                            'Barbell Row: match bench press volume',
                            'Pull-up/Chin-up: priorità'
                        ],
                        reduce: 'Mantenere push ma non aumentare finché pull non recupera'
                    });
                    break;
                    
                case 'external_internal_rotation':
                    protocols.push({
                        issue: 'Rotatori Spalla',
                        duration_weeks: 8,
                        frequency: '3-4x/settimana (warm-up)',
                        exercises: [
                            'External Rotation Cable: 3x15',
                            'Cuban Press: 2x12',
                            'Face Pull: 3x20',
                            'Band Pull-apart: 2x25'
                        ],
                        reduce: 'Limitare overhead pressing pesante'
                    });
                    break;
            }
        }
        
        return protocols;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 REPORTING
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Genera report per prompt AI
     */
    generateBalancePrompt(analysis) {
        let prompt = `\n\n⚖️ ANALISI EQUILIBRIO STRUTTURALE:\n`;
        prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        
        prompt += `\n📊 SCORE COMPLESSIVO: ${analysis.balance_score.score}/100 (${analysis.balance_score.grade})\n`;
        prompt += `${analysis.balance_score.interpretation}\n`;
        
        if (analysis.issues.length > 0) {
            prompt += `\n🚨 SQUILIBRI RILEVATI (${analysis.issues.length}):\n`;
            
            for (const issue of analysis.issues) {
                const icon = issue.type === 'critical' ? '🔴' : '🟡';
                prompt += `\n${icon} ${issue.ratio || issue.exercise || issue.area}:\n`;
                prompt += `   ${issue.message}\n`;
                prompt += `   → ${issue.correction}\n`;
            }
        }
        
        if (analysis.strengths.length > 0) {
            prompt += `\n✅ PUNTI DI FORZA:\n`;
            for (const strength of analysis.strengths) {
                prompt += `• ${strength.message}\n`;
            }
        }
        
        if (analysis.recommendation_priority.length > 0) {
            prompt += `\n🎯 PRIORITÀ CORREZIONE:\n`;
            for (const rec of analysis.recommendation_priority) {
                prompt += `\n[${rec.priority}] ${rec.area}:\n`;
                prompt += `   ${rec.action}\n`;
                if (rec.protocol) {
                    if (typeof rec.protocol === 'string') {
                        prompt += `   Protocollo: ${rec.protocol}\n`;
                    }
                }
            }
        }
        
        prompt += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        prompt += `⚠️ VINCOLI WORKOUT:\n`;
        prompt += `- Correggere squilibri PRIMA di aumentare carichi\n`;
        prompt += `- Prioritizzare esercizi per aree deboli\n`;
        
        if (analysis.issues.some(i => i.ratio === 'hamstring_quad')) {
            prompt += `- 🦵 OBBLIGATORIO: Includere 2+ esercizi hamstring per sessione lower\n`;
        }
        if (analysis.issues.some(i => i.ratio === 'pull_push')) {
            prompt += `- 💪 OBBLIGATORIO: Rapporto 2:1 esercizi pull:push per sessione upper\n`;
        }
        
        return prompt;
    },

    /**
     * Genera modifica esercizi per correggere squilibri
     */
    generateExerciseModifications(analysis, workout) {
        const modifications = [];
        
        for (const issue of analysis.issues) {
            switch(issue.ratio) {
                case 'hamstring_quad':
                    modifications.push({
                        action: 'add',
                        exercise: 'Nordic Curl OR Romanian Deadlift',
                        sets: 3,
                        reps: '6-8',
                        reason: 'Correzione rapporto H:Q',
                        position: 'after_main_compound'
                    });
                    break;
                    
                case 'pull_push':
                    modifications.push({
                        action: 'increase_volume',
                        target: 'pulling_exercises',
                        modifier: 1.5, // +50% volume
                        reason: 'Correzione rapporto pull:push'
                    });
                    modifications.push({
                        action: 'add',
                        exercise: 'Face Pull',
                        sets: 3,
                        reps: '15-20',
                        position: 'every_upper_session'
                    });
                    break;
            }
        }
        
        return modifications;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 SISTEMA IBRIDO - Stime Iniziali + Learning da Workout
    // ═══════════════════════════════════════════════════════════════════════════

    STORAGE_KEY: 'atlas_structural_lifts_',

    /**
     * Coefficienti per stime iniziali basate su peso corporeo
     */
    estimateCoefficients: {
        M: {
            principiante: {
                back_squat: 0.75, deadlift: 1.0, bench_press: 0.60, 
                bent_over_row: 0.50, overhead_press: 0.40,
                front_squat: 0.65, leg_curl_seated: 0.25, leg_extension: 0.45
            },
            intermedio: {
                back_squat: 1.25, deadlift: 1.50, bench_press: 1.0,
                bent_over_row: 0.85, overhead_press: 0.65,
                front_squat: 1.05, leg_curl_seated: 0.40, leg_extension: 0.65
            },
            avanzato: {
                back_squat: 1.75, deadlift: 2.0, bench_press: 1.35,
                bent_over_row: 1.15, overhead_press: 0.85,
                front_squat: 1.45, leg_curl_seated: 0.55, leg_extension: 0.85
            },
            elite: {
                back_squat: 2.25, deadlift: 2.50, bench_press: 1.60,
                bent_over_row: 1.40, overhead_press: 1.05,
                front_squat: 1.90, leg_curl_seated: 0.70, leg_extension: 1.0
            }
        },
        F: {
            principiante: {
                back_squat: 0.60, deadlift: 0.85, bench_press: 0.35,
                bent_over_row: 0.35, overhead_press: 0.25,
                front_squat: 0.50, leg_curl_seated: 0.20, leg_extension: 0.35
            },
            intermedio: {
                back_squat: 1.0, deadlift: 1.25, bench_press: 0.60,
                bent_over_row: 0.55, overhead_press: 0.40,
                front_squat: 0.85, leg_curl_seated: 0.30, leg_extension: 0.50
            },
            avanzato: {
                back_squat: 1.40, deadlift: 1.65, bench_press: 0.85,
                bent_over_row: 0.75, overhead_press: 0.55,
                front_squat: 1.15, leg_curl_seated: 0.45, leg_extension: 0.70
            },
            elite: {
                back_squat: 1.75, deadlift: 2.0, bench_press: 1.05,
                bent_over_row: 0.95, overhead_press: 0.70,
                front_squat: 1.45, leg_curl_seated: 0.55, leg_extension: 0.85
            }
        }
    },

    /**
     * Modificatori per età
     */
    ageModifiers: {
        under_25: 1.0,
        '25_35': 1.0,
        '35_45': 0.92,
        '45_55': 0.84,
        over_55: 0.75
    },

    /**
     * Mapping esercizio → lift standard
     */
    exerciseMapping: {
        // Squat
        'squat': 'back_squat', 'back squat': 'back_squat', 'box squat': 'back_squat',
        'front squat': 'front_squat', 'goblet squat': 'back_squat',
        
        // Deadlift
        'deadlift': 'deadlift', 'conventional deadlift': 'deadlift',
        'romanian deadlift': 'romanian_deadlift', 'rdl': 'romanian_deadlift',
        'stiff leg deadlift': 'romanian_deadlift',
        
        // Bench
        'bench press': 'bench_press', 'bench': 'bench_press',
        'dumbbell bench press': 'bench_press', 'db bench': 'bench_press',
        'close grip bench press': 'close_grip_bench_press', 'close grip bench': 'close_grip_bench_press',
        
        // Row
        'barbell row': 'bent_over_row', 'bent over row': 'bent_over_row',
        'pendlay row': 'bent_over_row', 'dumbbell row': 'bent_over_row',
        'cable row': 'seated_row', 'seated row': 'seated_row',
        
        // OHP
        'overhead press': 'overhead_press', 'ohp': 'overhead_press',
        'military press': 'overhead_press', 'shoulder press': 'overhead_press',
        
        // Leg isolation
        'leg curl': 'leg_curl_seated', 'leg extension': 'leg_extension',
        'hamstring curl': 'leg_curl_seated', 'quad extension': 'leg_extension'
    },

    /**
     * Genera stime iniziali basate su profilo atleta
     */
    generateInitialEstimate(profile) {
        const gender = (profile.gender || profile.sesso || 'M').toUpperCase().charAt(0);
        const weight = parseFloat(profile.weight || profile.peso || 75);
        const age = parseInt(profile.age || profile.eta || 30);
        const level = this.normalizeLevel(profile.level || profile.experience || profile.livello || 'intermedio');
        
        // Coefficienti
        const genderCoeffs = this.estimateCoefficients[gender] || this.estimateCoefficients.M;
        const coeffs = genderCoeffs[level] || genderCoeffs.intermedio;
        
        // Modificatore età
        let ageMod = 1.0;
        if (age < 25) ageMod = this.ageModifiers.under_25;
        else if (age <= 35) ageMod = this.ageModifiers['25_35'];
        else if (age <= 45) ageMod = this.ageModifiers['35_45'];
        else if (age <= 55) ageMod = this.ageModifiers['45_55'];
        else ageMod = this.ageModifiers.over_55;
        
        const lifts = {};
        const confidence = {};
        
        for (const [exercise, coeff] of Object.entries(coeffs)) {
            lifts[exercise] = Math.round(weight * coeff * ageMod);
            confidence[exercise] = {
                value: 0.3,
                source: 'estimated',
                lastUpdated: new Date().toISOString()
            };
        }
        
        console.log('⚖️ Initial lifts estimated:', lifts);
        
        return { lifts, confidence };
    },

    /**
     * Normalizza livello atleta
     */
    normalizeLevel(level) {
        const l = (level || '').toLowerCase();
        if (l.includes('principiante') || l.includes('beginner')) return 'principiante';
        if (l.includes('avanzato') || l.includes('advanced')) return 'avanzato';
        if (l.includes('elite') || l.includes('agonista')) return 'elite';
        return 'intermedio';
    },

    /**
     * Calcola 1RM con formula Epley
     */
    calculate1RM(weight, reps) {
        if (!weight || weight <= 0) return 0;
        if (!reps || reps <= 0) return weight;
        if (reps === 1) return weight;
        return Math.round(weight * (1 + reps / 30));
    },

    /**
     * Mappa nome esercizio a lift standard
     */
    mapExerciseToLift(exerciseName) {
        const name = (exerciseName || '').toLowerCase().trim();
        
        // Direct mapping
        if (this.exerciseMapping[name]) {
            return this.exerciseMapping[name];
        }
        
        // Fuzzy search
        for (const [key, value] of Object.entries(this.exerciseMapping)) {
            if (name.includes(key) || key.includes(name)) {
                return value;
            }
        }
        
        return null;
    },

    /**
     * Aggiorna lifts da workout completato (LEARNING)
     */
    updateFromWorkout(athleteId, workout, profile = {}) {
        // Carica o crea modello
        let model = this.loadModel(athleteId);
        
        if (!model || !model.lifts || Object.keys(model.lifts).length === 0) {
            const estimate = this.generateInitialEstimate(profile);
            model = {
                athleteId,
                lifts: estimate.lifts,
                confidence: estimate.confidence,
                sessionsTracked: 0,
                history: [],
                createdAt: new Date().toISOString()
            };
        }

        // Estrai esercizi dal workout
        let exercises = [];
        if (workout?.exercises) {
            exercises = Array.isArray(workout.exercises) 
                ? workout.exercises 
                : Object.values(workout.exercises).flat();
        }

        let updated = false;

        exercises.forEach(ex => {
            const name = ex.name || ex.exercise || '';
            const liftKey = this.mapExerciseToLift(name);
            
            if (!liftKey) return;

            const weight = parseFloat(ex.weight) || 0;
            const reps = parseInt(String(ex.reps).replace(/\D/g, '')) || 0;
            
            if (weight <= 0 || reps <= 0) return;

            const estimated1RM = this.calculate1RM(weight, reps);
            const current = model.lifts[liftKey] || 0;

            // Aggiorna se migliore o primo dato reale
            if (!current || 
                model.confidence[liftKey]?.source === 'estimated' || 
                estimated1RM > current) {
                
                model.lifts[liftKey] = estimated1RM;
                model.confidence[liftKey] = {
                    value: Math.min(0.9, (model.confidence[liftKey]?.value || 0.3) + 0.1),
                    source: 'measured',
                    exercise: name,
                    weight: weight,
                    reps: reps,
                    lastUpdated: new Date().toISOString()
                };
                
                updated = true;
                console.log(`⚖️ Updated ${liftKey}: ${name} ${weight}kg × ${reps} → 1RM ~${estimated1RM}kg`);
            }
        });

        if (updated) {
            model.sessionsTracked = (model.sessionsTracked || 0) + 1;
            model.updatedAt = new Date().toISOString();
            
            // Aggiungi a history
            model.history.push({
                date: new Date().toISOString(),
                lifts: { ...model.lifts }
            });
            
            // Max 50 entries in history
            if (model.history.length > 50) {
                model.history = model.history.slice(-50);
            }
            
            this.saveModel(model);
        }

        return model;
    },

    /**
     * Carica modello da storage
     */
    loadModel(athleteId) {
        try {
            const key = this.STORAGE_KEY + athleteId;
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error('Error loading structural balance model:', e);
            return null;
        }
    },

    /**
     * Salva modello
     */
    saveModel(model) {
        try {
            const key = this.STORAGE_KEY + model.athleteId;
            localStorage.setItem(key, JSON.stringify(model));
        } catch (e) {
            console.error('Error saving structural balance model:', e);
        }
    },

    /**
     * Imposta lifts da form anamnesi (input manuale)
     */
    setLiftsFromAnamnesi(athleteId, liftsData) {
        let model = this.loadModel(athleteId) || {
            athleteId,
            lifts: {},
            confidence: {},
            sessionsTracked: 0,
            history: [],
            createdAt: new Date().toISOString()
        };

        // Mapping form → lift key
        const mapping = {
            squat: 'back_squat',
            back_squat: 'back_squat',
            front_squat: 'front_squat',
            deadlift: 'deadlift',
            romanian_deadlift: 'romanian_deadlift',
            bench: 'bench_press',
            bench_press: 'bench_press',
            row: 'bent_over_row',
            bent_over_row: 'bent_over_row',
            ohp: 'overhead_press',
            overhead_press: 'overhead_press',
            pullup: 'weighted_chin_up',
            weighted_chin_up: 'weighted_chin_up',
            leg_curl: 'leg_curl_seated',
            leg_curl_seated: 'leg_curl_seated',
            leg_extension: 'leg_extension'
        };

        for (const [key, liftKey] of Object.entries(mapping)) {
            if (liftsData[key] && parseInt(liftsData[key]) > 0) {
                model.lifts[liftKey] = parseInt(liftsData[key]);
                model.confidence[liftKey] = {
                    value: 0.85, // Alta confidence per input manuale
                    source: 'manual',
                    lastUpdated: new Date().toISOString()
                };
            }
        }

        model.updatedAt = new Date().toISOString();
        this.saveModel(model);

        console.log('⚖️ Lifts set from anamnesi:', model.lifts);
        return model;
    },

    /**
     * Ottieni analisi completa per widget UI
     */
    getFullAnalysis(athleteId, profile = {}) {
        let model = this.loadModel(athleteId);

        // Se non abbiamo dati, genera stime
        if (!model || !model.lifts || Object.keys(model.lifts).length === 0) {
            const estimate = this.generateInitialEstimate(profile);
            model = {
                athleteId,
                lifts: estimate.lifts,
                confidence: estimate.confidence,
                sessionsTracked: 0,
                dataQuality: 'estimated'
            };
        }

        // Analizza balance
        const analysis = this.analyzeBalance({ lifts: model.lifts });
        
        // Calcola data quality
        const confValues = Object.values(model.confidence || {});
        const measured = confValues.filter(c => c.source === 'measured' || c.source === 'manual').length;
        const total = confValues.length || 1;
        const qualityRatio = measured / total;

        let dataQuality = 'estimated';
        if (qualityRatio >= 0.8) dataQuality = 'excellent';
        else if (qualityRatio >= 0.5) dataQuality = 'good';
        else if (qualityRatio >= 0.2) dataQuality = 'partial';

        return {
            athleteId,
            lifts: model.lifts,
            confidence: model.confidence,
            analysis,
            dataQuality,
            sessionsTracked: model.sessionsTracked || 0,
            lastUpdated: model.updatedAt || model.createdAt
        };
    },

    /**
     * Esporta per Neural Cortex (Amygdala risk factors)
     */
    getRiskFactors(athleteId, profile = {}) {
        const analysis = this.getFullAnalysis(athleteId, profile);
        
        return (analysis.analysis?.issues || [])
            .filter(i => i.type === 'critical')
            .map(i => ({
                type: 'structural_imbalance',
                ratio: i.ratio,
                current: i.current,
                ideal: i.ideal,
                severity: i.ratio === 'hamstring_quad' ? 0.8 : 0.6,
                risk: i.message,
                correction: i.correction
            }));
    },

    /**
     * Reset per un atleta
     */
    reset(athleteId) {
        const key = this.STORAGE_KEY + athleteId;
        localStorage.removeItem(key);
        console.log('⚖️ Structural balance reset for:', athleteId);
    }
};

// Export per browser
window.AtlasStructuralBalance = AtlasStructuralBalance;

console.log('⚖️ ATLAS Structural Balance loaded with Hybrid Learning!');
