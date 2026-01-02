/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🏋️ ATLAS BODY COMPOSITION v1.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Sistema di tracking composizione corporea per:
 * - Peso e body fat percentage
 * - Misure antropometriche
 * - Trend e analisi progressi
 * - Integrazione con goal setting
 */

window.ATLASBodyComposition = {
    
    VERSION: '1.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // FORMULE SCIENTIFICHE
    // ═══════════════════════════════════════════════════════════════════════════
    
    formulas: {
        /**
         * Calcola BMI
         */
        bmi(weightKg, heightCm) {
            const heightM = heightCm / 100;
            return weightKg / (heightM * heightM);
        },
        
        /**
         * Calcola FFMI (Fat-Free Mass Index)
         * Indicatore più utile del BMI per atleti
         * Normalizzato a 1.80m
         */
        ffmi(weightKg, heightCm, bodyFatPercentage) {
            const fatMassKg = weightKg * (bodyFatPercentage / 100);
            const leanMassKg = weightKg - fatMassKg;
            const heightM = heightCm / 100;
            
            // FFMI base
            const ffmi = leanMassKg / (heightM * heightM);
            
            // FFMI normalizzato a 1.80m (adjusted FFMI)
            const adjustedFFMI = ffmi + 6.1 * (1.80 - heightM);
            
            return {
                ffmi: ffmi,
                adjustedFFMI: adjustedFFMI,
                interpretation: this.interpretFFMI(adjustedFFMI)
            };
        },
        
        /**
         * Interpreta FFMI
         * Reference: Kouri et al. (1995)
         */
        interpretFFMI(ffmi) {
            if (ffmi < 18) return { level: 'below_average', label: 'Sotto la media' };
            if (ffmi < 20) return { level: 'average', label: 'Nella media' };
            if (ffmi < 22) return { level: 'above_average', label: 'Sopra la media' };
            if (ffmi < 23) return { level: 'excellent', label: 'Eccellente' };
            if (ffmi < 25) return { level: 'elite', label: 'Elite naturale' };
            return { level: 'suspect', label: 'Genetica eccezionale o uso PEDs' };
        },
        
        /**
         * Calcola body fat % dalla Navy Formula
         * Per quando non si ha accesso a metodi più precisi
         */
        bodyFatNavy(waistCm, neckCm, heightCm, hipsCm = null, isMale = true) {
            if (isMale) {
                return 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
            } else {
                if (!hipsCm) throw new Error('Hips measurement required for females');
                return 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipsCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
            }
        },
        
        /**
         * Stima massa muscolare da circonferenze
         * Formula di Martin Berkhan (Leangains)
         */
        estimateMuscle(heightCm, wristCm, ankleCm) {
            // Formula per massimo potenziale naturale
            const maxLeanBodyMass = (heightCm - 100) * 1.1; // Approssimazione semplice
            
            // Fattore frame size
            const frameSize = (wristCm + ankleCm) / 2;
            const frameFactor = frameSize / 17.5; // 17.5 è media
            
            return maxLeanBodyMass * frameFactor;
        },
        
        /**
         * Calcola TDEE (Total Daily Energy Expenditure)
         * Mifflin-St Jeor formula
         */
        tdee(weightKg, heightCm, age, isMale = true, activityLevel = 1.55) {
            // BMR
            let bmr;
            if (isMale) {
                bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
            } else {
                bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
            }
            
            // Activity multipliers
            const activityMultipliers = {
                sedentary: 1.2,
                light: 1.375,
                moderate: 1.55,
                active: 1.725,
                very_active: 1.9,
                athlete: 2.0
            };
            
            const multiplier = typeof activityLevel === 'string' 
                ? activityMultipliers[activityLevel] 
                : activityLevel;
            
            return {
                bmr: Math.round(bmr),
                tdee: Math.round(bmr * multiplier),
                activityMultiplier: multiplier
            };
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // GOAL ANALYSIS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Analizza composizione corporea attuale vs obiettivo
     */
    analyzeGoal(current, target, timeline = 12) {
        const analysis = {
            current: {
                weight: current.weight,
                bodyFat: current.bodyFatPercentage,
                leanMass: current.weight * (1 - current.bodyFatPercentage / 100),
                fatMass: current.weight * (current.bodyFatPercentage / 100)
            },
            target: {},
            changes: {},
            timeline: {
                weeks: timeline,
                startDate: new Date(),
                endDate: new Date(Date.now() + timeline * 7 * 24 * 60 * 60 * 1000)
            },
            recommendations: []
        };
        
        // Calcola target
        if (target.weight && target.bodyFatPercentage) {
            analysis.target = {
                weight: target.weight,
                bodyFat: target.bodyFatPercentage,
                leanMass: target.weight * (1 - target.bodyFatPercentage / 100),
                fatMass: target.weight * (target.bodyFatPercentage / 100)
            };
        } else if (target.weight) {
            // Mantieni stessa BF%
            analysis.target = {
                weight: target.weight,
                bodyFat: current.bodyFatPercentage,
                leanMass: target.weight * (1 - current.bodyFatPercentage / 100),
                fatMass: target.weight * (current.bodyFatPercentage / 100)
            };
        } else if (target.bodyFatPercentage) {
            // Mantieni stessa lean mass, perdi solo grasso
            analysis.target = {
                leanMass: analysis.current.leanMass,
                bodyFat: target.bodyFatPercentage,
                fatMass: analysis.current.leanMass * target.bodyFatPercentage / (100 - target.bodyFatPercentage),
                weight: analysis.current.leanMass / (1 - target.bodyFatPercentage / 100)
            };
        }
        
        // Calcola cambiamenti necessari
        analysis.changes = {
            totalWeight: analysis.target.weight - analysis.current.weight,
            fatMass: analysis.target.fatMass - analysis.current.fatMass,
            leanMass: analysis.target.leanMass - analysis.current.leanMass,
            bodyFat: analysis.target.bodyFat - analysis.current.bodyFat
        };
        
        // Rate settimanale
        analysis.changes.weeklyWeightChange = analysis.changes.totalWeight / timeline;
        analysis.changes.weeklyFatChange = analysis.changes.fatMass / timeline;
        
        // Deficit/surplus calorico necessario
        // 1 kg grasso = ~7700 kcal
        const dailyCalorieChange = (analysis.changes.fatMass * 7700) / (timeline * 7);
        analysis.changes.dailyCalorieChange = Math.round(dailyCalorieChange);
        
        // Genera raccomandazioni
        this.generateRecommendations(analysis);
        
        return analysis;
    },
    
    /**
     * Genera raccomandazioni basate sull'analisi
     */
    generateRecommendations(analysis) {
        const weeklyChange = Math.abs(analysis.changes.weeklyWeightChange);
        const isCutting = analysis.changes.totalWeight < 0;
        const isBulking = analysis.changes.totalWeight > 0;
        
        // Check rate
        if (isCutting) {
            if (weeklyChange > 1) {
                analysis.recommendations.push({
                    type: 'warning',
                    message: `Perdita troppo rapida (${weeklyChange.toFixed(2)}kg/sett). Rischio perdita muscolare.`,
                    suggestion: 'Estendi timeline o rivedi target'
                });
            } else if (weeklyChange > 0.7) {
                analysis.recommendations.push({
                    type: 'info',
                    message: `Deficit aggressivo (${weeklyChange.toFixed(2)}kg/sett). OK per atleti con buon BF%.`,
                    suggestion: 'Mantieni proteine alte (2.3-3.1g/kg)'
                });
            } else {
                analysis.recommendations.push({
                    type: 'success',
                    message: `Rate ottimale (${weeklyChange.toFixed(2)}kg/sett). Minimizza perdita muscolare.`,
                    suggestion: 'Procedi con il piano'
                });
            }
            
            // Proteine per cut
            analysis.recommendations.push({
                type: 'nutrition',
                message: `Proteine raccomandate: ${Math.round(analysis.current.leanMass * 2.5)}g/giorno`,
                suggestion: 'Aumenta proteine durante il deficit per preservare muscolo'
            });
        }
        
        if (isBulking) {
            if (weeklyChange > 0.5) {
                analysis.recommendations.push({
                    type: 'warning',
                    message: `Bulk troppo aggressivo (${weeklyChange.toFixed(2)}kg/sett). Rischio accumulo grasso.`,
                    suggestion: 'Rate ottimale: 0.25-0.5kg/sett'
                });
            } else if (weeklyChange >= 0.25) {
                analysis.recommendations.push({
                    type: 'success',
                    message: `Rate lean bulk ottimale (${weeklyChange.toFixed(2)}kg/sett).`,
                    suggestion: 'Mantieni surplus moderato 250-500 kcal'
                });
            } else {
                analysis.recommendations.push({
                    type: 'info',
                    message: `Lean bulk conservativo (${weeklyChange.toFixed(2)}kg/sett). Progressi lenti ma puliti.`,
                    suggestion: 'OK se priorità è rimanere lean'
                });
            }
            
            // Proteine per bulk
            analysis.recommendations.push({
                type: 'nutrition',
                message: `Proteine raccomandate: ${Math.round(analysis.current.weight * 1.8)}g/giorno`,
                suggestion: 'In surplus, 1.6-2.2g/kg è sufficiente'
            });
        }
        
        // Training recommendations
        if (isCutting && analysis.changes.bodyFat < -5) {
            analysis.recommendations.push({
                type: 'training',
                message: 'Mantieni intensità alta, riduci volume del 10-20%',
                suggestion: 'Priorità: mantenere forza per preservare muscolo'
            });
        }
        
        if (isBulking) {
            analysis.recommendations.push({
                type: 'training',
                message: 'Volume progressivo con surplus calorico',
                suggestion: 'Aumenta volume ogni 2-3 settimane'
            });
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PROGRESS TRACKING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Analizza trend dai dati storici
     */
    analyzeTrend(history, windowWeeks = 4) {
        if (!history || history.length < 2) {
            return { trend: 'insufficient_data' };
        }
        
        // Ordina per data
        const sorted = [...history].sort((a, b) => 
            new Date(a.recorded_at) - new Date(b.recorded_at));
        
        // Ultimi N giorni
        const cutoffDate = new Date(Date.now() - windowWeeks * 7 * 24 * 60 * 60 * 1000);
        const recent = sorted.filter(h => new Date(h.recorded_at) >= cutoffDate);
        
        if (recent.length < 2) {
            return { trend: 'insufficient_data' };
        }
        
        // Calcola media mobile
        const weights = recent.map(h => h.weight_kg).filter(w => w);
        const bodyFats = recent.map(h => h.body_fat_percentage).filter(bf => bf);
        
        const firstWeight = weights.slice(0, Math.ceil(weights.length / 3));
        const lastWeight = weights.slice(-Math.ceil(weights.length / 3));
        
        const avgFirstWeight = firstWeight.reduce((a, b) => a + b, 0) / firstWeight.length;
        const avgLastWeight = lastWeight.reduce((a, b) => a + b, 0) / lastWeight.length;
        
        const weightChange = avgLastWeight - avgFirstWeight;
        const weeklyChange = weightChange / windowWeeks;
        
        let trend, message;
        
        if (Math.abs(weeklyChange) < 0.1) {
            trend = 'stable';
            message = 'Peso stabile';
        } else if (weeklyChange > 0) {
            trend = weeklyChange > 0.5 ? 'gaining_fast' : 'gaining';
            message = `+${weeklyChange.toFixed(2)}kg/settimana`;
        } else {
            trend = weeklyChange < -0.5 ? 'losing_fast' : 'losing';
            message = `${weeklyChange.toFixed(2)}kg/settimana`;
        }
        
        // Body fat trend se disponibile
        let bodyFatTrend = null;
        if (bodyFats.length >= 2) {
            const firstBF = bodyFats.slice(0, Math.ceil(bodyFats.length / 3));
            const lastBF = bodyFats.slice(-Math.ceil(bodyFats.length / 3));
            const bfChange = (lastBF.reduce((a, b) => a + b, 0) / lastBF.length) - 
                            (firstBF.reduce((a, b) => a + b, 0) / firstBF.length);
            bodyFatTrend = {
                change: bfChange,
                direction: Math.abs(bfChange) < 0.3 ? 'stable' : (bfChange > 0 ? 'up' : 'down')
            };
        }
        
        return {
            trend,
            message,
            weightChange: weightChange,
            weeklyChange: weeklyChange,
            bodyFatTrend,
            dataPoints: recent.length,
            window: `${windowWeeks} settimane`
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STRENGTH STANDARDS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Confronta forza con standard per peso corporeo
     * Based on: Symmetric Strength, StrengthLevel.com
     */
    strengthStandards: {
        male: {
            squat: { novice: 1.0, intermediate: 1.5, advanced: 2.0, elite: 2.5, world: 3.0 },
            deadlift: { novice: 1.25, intermediate: 1.75, advanced: 2.25, elite: 2.75, world: 3.5 },
            bench: { novice: 0.75, intermediate: 1.0, advanced: 1.5, elite: 2.0, world: 2.5 },
            overhead_press: { novice: 0.5, intermediate: 0.75, advanced: 1.0, elite: 1.25, world: 1.5 }
        },
        female: {
            squat: { novice: 0.75, intermediate: 1.0, advanced: 1.5, elite: 2.0, world: 2.5 },
            deadlift: { novice: 1.0, intermediate: 1.25, advanced: 1.75, elite: 2.25, world: 2.75 },
            bench: { novice: 0.5, intermediate: 0.75, advanced: 1.0, elite: 1.25, world: 1.5 },
            overhead_press: { novice: 0.35, intermediate: 0.5, advanced: 0.75, elite: 1.0, world: 1.25 }
        }
    },
    
    /**
     * Valuta livello di forza per un lift
     */
    evaluateStrength(lift, oneRepMax, bodyweight, isMale = true) {
        const standards = isMale ? this.strengthStandards.male : this.strengthStandards.female;
        const liftStandards = standards[lift.toLowerCase()];
        
        if (!liftStandards) return null;
        
        const ratio = oneRepMax / bodyweight;
        
        let level, nextLevel, toNextLevel;
        
        if (ratio >= liftStandards.world) {
            level = 'world';
            nextLevel = null;
            toNextLevel = 0;
        } else if (ratio >= liftStandards.elite) {
            level = 'elite';
            nextLevel = 'world';
            toNextLevel = (liftStandards.world - ratio) * bodyweight;
        } else if (ratio >= liftStandards.advanced) {
            level = 'advanced';
            nextLevel = 'elite';
            toNextLevel = (liftStandards.elite - ratio) * bodyweight;
        } else if (ratio >= liftStandards.intermediate) {
            level = 'intermediate';
            nextLevel = 'advanced';
            toNextLevel = (liftStandards.advanced - ratio) * bodyweight;
        } else {
            level = 'novice';
            nextLevel = 'intermediate';
            toNextLevel = (liftStandards.intermediate - ratio) * bodyweight;
        }
        
        return {
            lift,
            oneRepMax,
            bodyweight,
            ratio: ratio.toFixed(2),
            level,
            nextLevel,
            toNextLevel: Math.round(toNextLevel),
            percentile: this.estimatePercentile(ratio, liftStandards)
        };
    },
    
    /**
     * Stima percentile basato su ratio
     */
    estimatePercentile(ratio, standards) {
        if (ratio >= standards.world) return 99;
        if (ratio >= standards.elite) return 95;
        if (ratio >= standards.advanced) return 80;
        if (ratio >= standards.intermediate) return 50;
        if (ratio >= standards.novice) return 25;
        return 10;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // DATABASE OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Salva record body composition
     */
    async saveRecord(athleteId, data) {
        try {
            const record = {
                athlete_id: athleteId,
                recorded_at: data.recorded_at || new Date().toISOString(),
                weight_kg: data.weight,
                body_fat_percentage: data.bodyFatPercentage,
                muscle_mass_kg: data.muscleMass,
                waist_cm: data.waist,
                chest_cm: data.chest,
                hips_cm: data.hips,
                arm_left_cm: data.armLeft,
                arm_right_cm: data.armRight,
                thigh_left_cm: data.thighLeft,
                thigh_right_cm: data.thighRight,
                source: data.source || 'manual',
                notes: data.notes
            };
            
            const result = await supabase.insert('body_composition', record);
            console.log('✅ Body composition saved:', result);
            return { success: true, record: result };
        } catch (error) {
            console.error('Error saving body composition:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Ottieni history per atleta
     */
    async getHistory(athleteId, limit = 30) {
        try {
            const history = await supabase.fetch('body_composition', 
                `?athlete_id=eq.${athleteId}&order=recorded_at.desc&limit=${limit}`);
            return history;
        } catch (error) {
            console.error('Error fetching body composition history:', error);
            return [];
        }
    }
};

console.log('🏋️ ATLAS Body Composition v1.0 loaded!');
console.log('   → ATLASBodyComposition.formulas.bmi(weight, height)');
console.log('   → ATLASBodyComposition.formulas.ffmi(weight, height, bf%)');
console.log('   → ATLASBodyComposition.analyzeGoal(current, target, weeks)');
console.log('   → ATLASBodyComposition.evaluateStrength(lift, 1rm, bw)');
