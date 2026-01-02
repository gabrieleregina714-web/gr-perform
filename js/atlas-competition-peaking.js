/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🏆 ATLAS COMPETITION PEAKING v1.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Sistema automatico per la preparazione a competizioni:
 * - Periodizzazione inversa dalla data gara
 * - Taper strategies scientifiche
 * - Peak performance prediction
 * - Weight cut planning (combat sports)
 * - Competition day protocols
 */

window.ATLASCompetitionPeaking = {
    
    VERSION: '1.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // COMPETITION PLANNING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Create a competition preparation plan
     */
    createPlan(competition, athleteProfile) {
        const { 
            date: compDate, 
            type, 
            weightClass = null,
            priority = 'A'  // A = major, B = important, C = minor
        } = competition;
        
        const daysOut = this.calculateDaysOut(compDate);
        
        if (daysOut < 0) {
            return { error: 'Competition date is in the past' };
        }
        
        const plan = {
            competition,
            athlete: athleteProfile.name || athleteProfile.id,
            daysOut,
            createdAt: new Date().toISOString(),
            phases: [],
            taperStrategy: null,
            weightPlan: null,
            competitionDayProtocol: null
        };
        
        // Generate phases based on time available
        plan.phases = this.generatePhases(daysOut, priority, type);
        
        // Generate taper strategy
        plan.taperStrategy = this.generateTaperStrategy(daysOut, priority, athleteProfile);
        
        // Generate weight cut plan if needed
        if (weightClass && athleteProfile.weight) {
            plan.weightPlan = this.generateWeightPlan(
                athleteProfile.weight, 
                weightClass, 
                daysOut,
                type
            );
        }
        
        // Generate competition day protocol
        plan.competitionDayProtocol = this.generateCompDayProtocol(type, weightClass);
        
        return plan;
    },
    
    /**
     * Calculate days until competition
     */
    calculateDaysOut(compDate) {
        const now = new Date();
        const comp = new Date(compDate);
        return Math.ceil((comp - now) / (1000 * 60 * 60 * 24));
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE GENERATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Generate training phases based on time available
     */
    generatePhases(daysOut, priority, sportType) {
        const phases = [];
        
        // Define phase templates
        const templates = {
            long: [  // 16+ weeks
                { name: 'Base Building', duration: 0.30, focus: 'volume', intensity: 65 },
                { name: 'Strength Phase', duration: 0.25, focus: 'intensity', intensity: 80 },
                { name: 'Power/Speed', duration: 0.20, focus: 'explosiveness', intensity: 85 },
                { name: 'Competition Specific', duration: 0.15, focus: 'skill', intensity: 90 },
                { name: 'Taper', duration: 0.10, focus: 'recovery', intensity: 70 }
            ],
            medium: [  // 8-16 weeks
                { name: 'Strength Build', duration: 0.35, focus: 'intensity', intensity: 78 },
                { name: 'Power/Peaking', duration: 0.35, focus: 'power', intensity: 85 },
                { name: 'Competition Prep', duration: 0.15, focus: 'skill', intensity: 88 },
                { name: 'Taper', duration: 0.15, focus: 'recovery', intensity: 65 }
            ],
            short: [  // 4-8 weeks
                { name: 'Intensification', duration: 0.50, focus: 'intensity', intensity: 82 },
                { name: 'Peaking', duration: 0.30, focus: 'power', intensity: 88 },
                { name: 'Taper', duration: 0.20, focus: 'recovery', intensity: 60 }
            ],
            minimal: [  // <4 weeks
                { name: 'Maintenance', duration: 0.60, focus: 'maintenance', intensity: 75 },
                { name: 'Taper', duration: 0.40, focus: 'recovery', intensity: 55 }
            ]
        };
        
        // Select template based on days out
        let template;
        if (daysOut >= 112) template = templates.long;      // 16+ weeks
        else if (daysOut >= 56) template = templates.medium; // 8+ weeks
        else if (daysOut >= 28) template = templates.short;  // 4+ weeks
        else template = templates.minimal;
        
        // Generate phases with actual dates
        let currentDay = 0;
        for (const phase of template) {
            const phaseDays = Math.round(daysOut * phase.duration);
            const startDate = new Date(Date.now() + currentDay * 24 * 60 * 60 * 1000);
            const endDate = new Date(Date.now() + (currentDay + phaseDays) * 24 * 60 * 60 * 1000);
            
            phases.push({
                name: phase.name,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                duration: phaseDays,
                focus: phase.focus,
                targetIntensity: phase.intensity,
                volumeModifier: phase.focus === 'recovery' ? 0.5 : (phase.focus === 'volume' ? 1.2 : 1.0),
                guidelines: this.getPhaseGuidelines(phase.name, sportType)
            });
            
            currentDay += phaseDays;
        }
        
        return phases;
    },
    
    /**
     * Get training guidelines for a phase
     */
    getPhaseGuidelines(phaseName, sportType) {
        const guidelines = {
            'Base Building': [
                'High volume, moderate intensity',
                'Build work capacity and aerobic base',
                'Focus on technique refinement',
                'Accumulate training stress gradually'
            ],
            'Strength Phase': [
                'Progressive overload on main lifts',
                'Reduce accessory volume',
                'Increase rest periods',
                'Focus on compound movements'
            ],
            'Power/Speed': [
                'Explosive movements with full recovery',
                'Reduce total volume, maintain intensity',
                'Sport-specific power development',
                'Plyometrics and speed work'
            ],
            'Competition Specific': [
                'Practice competition scenarios',
                'Fine-tune technique',
                'Mental preparation',
                'Simulate competition conditions'
            ],
            'Taper': [
                'Reduce volume by 40-60%',
                'Maintain intensity',
                'Increase rest and recovery',
                'Focus on sleep and nutrition'
            ],
            'Intensification': [
                'High intensity, lower volume',
                'Frequent heavy singles/doubles',
                'Full recovery between sessions'
            ],
            'Peaking': [
                'Peak weights with low volume',
                'Competition simulation',
                'Mental rehearsal'
            ],
            'Maintenance': [
                'Maintain current fitness',
                'Avoid new adaptations',
                'Fresh for competition'
            ]
        };
        
        return guidelines[phaseName] || ['Follow program as prescribed'];
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // TAPER STRATEGIES
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Generate optimal taper strategy
     */
    generateTaperStrategy(daysOut, priority, athlete) {
        // Taper duration based on priority and time available
        let taperDays;
        if (priority === 'A') {
            taperDays = Math.min(21, Math.round(daysOut * 0.12));
        } else if (priority === 'B') {
            taperDays = Math.min(14, Math.round(daysOut * 0.10));
        } else {
            taperDays = Math.min(7, Math.round(daysOut * 0.08));
        }
        
        taperDays = Math.max(taperDays, 5);  // Minimum 5 days
        
        // Select taper type based on athlete response
        let taperType;
        if (athlete.cluster === 'recovery_dependent') {
            taperType = 'step';  // More aggressive recovery
        } else if (athlete.cluster === 'high_responder') {
            taperType = 'exponential';  // Quick adaptation
        } else {
            taperType = 'linear';  // Standard
        }
        
        const strategy = {
            type: taperType,
            duration: taperDays,
            startDate: new Date(Date.now() + (daysOut - taperDays) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            volumeReduction: this.getTaperReduction(taperType),
            intensityGuideline: 'Maintain 85-95% of peak intensity',
            frequencyReduction: taperType === 'step' ? '50%' : '30%',
            schedule: this.generateTaperSchedule(taperDays, taperType),
            expectedPerformanceGain: this.estimatePerformanceGain(taperDays, taperType)
        };
        
        return strategy;
    },
    
    /**
     * Get volume reduction pattern for taper type
     */
    getTaperReduction(type) {
        switch (type) {
            case 'linear':
                return {
                    pattern: 'Linear reduction over taper period',
                    week1: 20,
                    week2: 40,
                    week3: 60
                };
            case 'step':
                return {
                    pattern: 'Immediate reduction then maintain',
                    week1: 50,
                    week2: 50,
                    week3: 60
                };
            case 'exponential':
                return {
                    pattern: 'Gradual reduction accelerating toward competition',
                    week1: 15,
                    week2: 35,
                    week3: 65
                };
            default:
                return { pattern: 'Standard reduction', week1: 30, week2: 45, week3: 60 };
        }
    },
    
    /**
     * Generate detailed taper schedule
     */
    generateTaperSchedule(days, type) {
        const schedule = [];
        
        for (let day = 1; day <= days; day++) {
            const progress = day / days;
            let volumePercent;
            
            switch (type) {
                case 'linear':
                    volumePercent = 100 - (progress * 60);
                    break;
                case 'step':
                    volumePercent = progress < 0.3 ? 50 : 40;
                    break;
                case 'exponential':
                    volumePercent = 100 * Math.exp(-2.5 * progress);
                    break;
                default:
                    volumePercent = 100 - (progress * 50);
            }
            
            // Determine if training day or rest
            const isTrainingDay = day <= days * 0.7 && (day % 2 !== 0 || day <= 3);
            
            schedule.push({
                day,
                daysToComp: days - day,
                date: new Date(Date.now() + day * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                volumePercent: Math.round(volumePercent),
                intensity: day >= days - 2 ? 70 : 85,
                type: isTrainingDay ? 'training' : 'rest',
                notes: this.getTaperDayNotes(days - day)
            });
        }
        
        return schedule;
    },
    
    /**
     * Get notes for specific days out
     */
    getTaperDayNotes(daysToComp) {
        if (daysToComp <= 1) return 'Complete rest or very light movement';
        if (daysToComp <= 3) return 'Light technique work, visualization';
        if (daysToComp <= 5) return 'Moderate intensity, low volume';
        if (daysToComp <= 7) return 'Maintain intensity, reduce volume';
        return 'Standard taper protocol';
    },
    
    /**
     * Estimate performance gain from taper
     */
    estimatePerformanceGain(days, type) {
        // Based on research (Mujika & Padilla, 2003)
        let baseGain = 3.0;  // 3% average
        
        // Adjust for taper duration
        if (days >= 14 && days <= 21) {
            baseGain = 3.5;
        } else if (days < 7) {
            baseGain = 1.5;
        }
        
        // Adjust for type
        if (type === 'exponential') {
            baseGain *= 1.1;
        }
        
        return {
            expected: baseGain,
            range: [baseGain * 0.5, baseGain * 1.5],
            confidence: 'moderate'
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // WEIGHT MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Generate weight cut plan for combat sports
     */
    generateWeightPlan(currentWeight, targetWeight, daysOut, sportType) {
        const weightToCut = currentWeight - targetWeight;
        
        if (weightToCut <= 0) {
            return {
                status: 'at_weight',
                message: 'Already at or below target weight',
                recommendation: 'Focus on performance, not weight'
            };
        }
        
        // Safety limits
        const maxSafeCut = currentWeight * 0.08;  // 8% max
        const isSafe = weightToCut <= maxSafeCut;
        
        if (!isSafe) {
            return {
                status: 'unsafe',
                message: `Weight cut of ${weightToCut.toFixed(1)}kg exceeds safe limit`,
                recommendation: 'Consider competing in higher weight class',
                maxRecommendedCut: maxSafeCut
            };
        }
        
        // Calculate phases
        const plan = {
            status: 'planned',
            currentWeight,
            targetWeight,
            totalToCut: weightToCut,
            phases: []
        };
        
        // Phase 1: Gradual diet (water manipulation free)
        const dietPhase = Math.min(Math.round(daysOut * 0.6), 42);
        const dietLoss = Math.min(weightToCut * 0.6, currentWeight * 0.04);
        
        plan.phases.push({
            name: 'Gradual Diet',
            duration: dietPhase,
            targetLoss: dietLoss,
            method: 'Caloric deficit 300-500 kcal/day',
            startWeight: currentWeight,
            endWeight: currentWeight - dietLoss,
            guidelines: [
                'Maintain protein at 2.2-2.5g/kg',
                'Reduce carbs moderately',
                'Stay hydrated',
                'No drastic changes'
            ]
        });
        
        // Phase 2: Water/sodium manipulation (last week)
        if (weightToCut - dietLoss > 0 && daysOut >= 7) {
            const waterCutStart = Math.max(0, daysOut - 7);
            const waterLoss = Math.min(weightToCut - dietLoss, currentWeight * 0.04);
            
            plan.phases.push({
                name: 'Water Loading/Cut',
                duration: 7,
                startDay: waterCutStart,
                targetLoss: waterLoss,
                protocol: this.generateWaterCutProtocol(waterLoss),
                warnings: [
                    'Only for experienced athletes',
                    'Medical supervision recommended',
                    'Have rehydration plan ready'
                ]
            });
        }
        
        // Phase 3: Rehydration
        plan.rehydration = {
            targetTime: '24 hours post weigh-in',
            fluidGoal: `${Math.round(weightToCut * 1.5)}L`,
            electrolyteProtocol: 'Sodium-containing fluids, light carbs',
            mealTiming: 'Small frequent meals, avoid heavy foods'
        };
        
        return plan;
    },
    
    /**
     * Generate water manipulation protocol
     */
    generateWaterCutProtocol(targetLoss) {
        return {
            day_7: { water: '8L', sodium: 'High (add salt to meals)', notes: 'Super-hydration begins' },
            day_6: { water: '8L', sodium: 'High', notes: 'Continue loading' },
            day_5: { water: '6L', sodium: 'Moderate', notes: 'Begin tapering' },
            day_4: { water: '4L', sodium: 'Low', notes: 'Reduce sodium' },
            day_3: { water: '2L', sodium: 'Very low', notes: 'Minimal sodium' },
            day_2: { water: '1L', sodium: 'None', notes: 'Restrict fluids' },
            day_1: { water: '500ml', sodium: 'None', notes: 'Sip only as needed' },
            weigh_in: { water: 'None until after', sodium: 'None', notes: 'Stay relaxed' }
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // COMPETITION DAY
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Generate competition day protocol
     */
    generateCompDayProtocol(sportType, weightClass = null) {
        const protocol = {
            preMorning: [],
            warmup: [],
            mental: [],
            nutrition: [],
            recovery: []
        };
        
        // Pre-competition morning routine
        protocol.preMorning = [
            { time: '-4h', action: 'Wake up, light movement', duration: 10 },
            { time: '-3.5h', action: 'Breakfast (familiar foods)', duration: 30 },
            { time: '-2.5h', action: 'Arrive at venue', duration: null },
            { time: '-2h', action: 'Check-in, assess environment', duration: 15 },
            { time: '-1.5h', action: 'Begin warm-up routine', duration: 45 }
        ];
        
        // Warm-up protocol
        protocol.warmup = [
            { phase: 'General', duration: 10, activities: ['Light jog/bike', 'Dynamic stretching'] },
            { phase: 'Activation', duration: 10, activities: ['Band work', 'Muscle activation'] },
            { phase: 'Movement Prep', duration: 10, activities: ['Sport-specific movements', 'Rehearsal'] },
            { phase: 'Potentiation', duration: 10, activities: ['Heavy primer', 'Explosive movements'] },
            { phase: 'Mental', duration: 5, activities: ['Visualization', 'Breathing', 'Cue words'] }
        ];
        
        // Mental preparation
        protocol.mental = [
            { technique: 'Visualization', description: 'Run through successful performance', timing: 'Night before + morning' },
            { technique: 'Breathing', description: 'Box breathing 4-4-4-4', timing: 'Before warm-up' },
            { technique: 'Arousal Control', description: 'Psych-up or calm-down as needed', timing: '10 min before' },
            { technique: 'Cue Words', description: 'Focus on 1-2 key technical cues', timing: 'During performance' }
        ];
        
        // Nutrition
        if (weightClass) {
            protocol.nutrition = [
                { time: 'Post weigh-in', item: 'Electrolyte drink', amount: '500ml' },
                { time: '+1h', item: 'Simple carbs + protein', amount: 'Light meal' },
                { time: '+2h', item: 'Continue rehydration', amount: 'Sip regularly' },
                { time: 'Between events', item: 'Simple carbs', amount: 'As tolerated' }
            ];
        } else {
            protocol.nutrition = [
                { time: '-3h', item: 'Pre-comp meal', amount: 'Familiar, moderate carbs' },
                { time: '-1h', item: 'Small snack if hungry', amount: 'Light' },
                { time: '-30min', item: 'Water/sports drink', amount: '200ml' },
                { time: 'Between events', item: 'Quick carbs', amount: 'As needed' }
            ];
        }
        
        // Recovery
        protocol.recovery = [
            { timing: 'Immediately after', action: 'Cool down, light movement' },
            { timing: '+30min', action: 'Rehydrate, refuel' },
            { timing: '+2h', action: 'Full meal, protein-rich' },
            { timing: 'Evening', action: 'Light stretching, early sleep' },
            { timing: 'Next day', action: 'Active recovery or complete rest' }
        ];
        
        return protocol;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // READINESS ASSESSMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Assess competition readiness
     */
    assessReadiness(athlete, competition) {
        const assessment = {
            physical: 0,
            mental: 0,
            technical: 0,
            tactical: 0,
            overall: 0,
            flags: [],
            recommendations: []
        };
        
        // Physical readiness
        if (athlete.readiness >= 80) {
            assessment.physical = 100;
        } else if (athlete.readiness >= 60) {
            assessment.physical = 75;
            assessment.flags.push({ type: 'warning', area: 'physical', message: 'Moderate readiness' });
        } else {
            assessment.physical = 50;
            assessment.flags.push({ type: 'concern', area: 'physical', message: 'Low readiness - consider recovery' });
        }
        
        // Form assessment (if digital twin available)
        if (athlete.form !== undefined) {
            if (athlete.form > 10) {
                assessment.physical = Math.min(100, assessment.physical + 10);
            } else if (athlete.form < -10) {
                assessment.physical = Math.max(0, assessment.physical - 15);
                assessment.flags.push({ type: 'concern', area: 'form', message: 'Negative form - may underperform' });
            }
        }
        
        // Mental (placeholder - would need psych assessment)
        assessment.mental = 75;  // Default moderate-high
        
        // Technical (based on recent performance)
        assessment.technical = athlete.technicalScore || 70;
        
        // Tactical
        assessment.tactical = 70;
        
        // Calculate overall
        assessment.overall = Math.round(
            assessment.physical * 0.35 +
            assessment.mental * 0.25 +
            assessment.technical * 0.25 +
            assessment.tactical * 0.15
        );
        
        // Generate recommendations
        if (assessment.physical < 70) {
            assessment.recommendations.push('Consider additional rest or lighter taper');
        }
        if (assessment.overall >= 80) {
            assessment.recommendations.push('Athlete is competition ready - focus on execution');
        }
        
        return assessment;
    }
};

console.log('🏆 ATLAS Competition Peaking v1.0 loaded!');
console.log('   → ATLASCompetitionPeaking.createPlan(competition, athlete)');
console.log('   → ATLASCompetitionPeaking.generateTaperStrategy(days, priority, athlete)');
console.log('   → ATLASCompetitionPeaking.generateWeightPlan(current, target, days)');
console.log('   → ATLASCompetitionPeaking.assessReadiness(athlete, competition)');
