/**
 * GR Perform - Injury Prevention Engine
 * A4: Sistema intelligente di prevenzione infortuni
 * 
 * Funzionalità:
 * - Risk scoring basato su dati storici
 * - Movement screening virtuale
 * - Pattern detection per overuse injuries
 * - Raccomandazioni prehab/mobility
 * - Alert per coach quando rischio alto
 */

window.InjuryPrevention = (function() {
    'use strict';

    const VERSION = '1.0';
    const STORAGE_KEY = 'gr_injury_data';
    const SCREENING_KEY = 'gr_movement_screening';

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURAZIONE RISCHIO PER SPORT
    // ═══════════════════════════════════════════════════════════════
    const SPORT_RISK_PROFILES = {
        boxe: {
            high_risk_areas: ['shoulder', 'wrist', 'lower_back', 'neck'],
            overuse_patterns: ['rotator_cuff', 'wrist_strain', 'lumbar_compression'],
            critical_movements: ['overhead_press', 'rotation', 'impact'],
            prehab_priority: ['shoulder_stability', 'core_anti_rotation', 'wrist_mobility']
        },
        calcio: {
            high_risk_areas: ['knee', 'ankle', 'hamstring', 'groin'],
            overuse_patterns: ['acl_strain', 'ankle_sprain', 'hamstring_pull', 'pubalgia'],
            critical_movements: ['cutting', 'deceleration', 'kicking'],
            prehab_priority: ['knee_stability', 'ankle_proprioception', 'hip_mobility']
        },
        basket: {
            high_risk_areas: ['ankle', 'knee', 'shoulder', 'lower_back'],
            overuse_patterns: ['patellar_tendinopathy', 'ankle_sprain', 'shoulder_impingement'],
            critical_movements: ['jumping', 'landing', 'lateral_movement'],
            prehab_priority: ['landing_mechanics', 'ankle_stability', 'core_strength']
        },
        fitness: {
            high_risk_areas: ['lower_back', 'shoulder', 'knee'],
            overuse_patterns: ['disc_herniation', 'rotator_cuff', 'patellofemoral'],
            critical_movements: ['deadlift', 'squat', 'overhead'],
            prehab_priority: ['hip_hinge', 'thoracic_mobility', 'glute_activation']
        },
        powerlifting: {
            high_risk_areas: ['lower_back', 'shoulder', 'hip', 'knee'],
            overuse_patterns: ['disc_injury', 'pec_tear', 'hip_impingement'],
            critical_movements: ['max_effort', 'spinal_loading', 'deep_squat'],
            prehab_priority: ['spinal_stability', 'hip_mobility', 'shoulder_prep']
        },
        crossfit: {
            high_risk_areas: ['shoulder', 'lower_back', 'wrist', 'knee'],
            overuse_patterns: ['rhabdomyolysis', 'shoulder_impingement', 'wrist_strain'],
            critical_movements: ['kipping', 'olympic_lifts', 'high_rep'],
            prehab_priority: ['shoulder_mobility', 'wrist_prep', 'movement_quality']
        },
        default: {
            high_risk_areas: ['lower_back', 'shoulder', 'knee'],
            overuse_patterns: ['general_overuse'],
            critical_movements: ['compound_lifts'],
            prehab_priority: ['mobility', 'stability', 'movement_quality']
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // FATTORI DI RISCHIO
    // ═══════════════════════════════════════════════════════════════
    const RISK_FACTORS = {
        // Fattori demografici
        age: {
            weight: 0.15,
            score: (age) => {
                if (age < 25) return 0.2;
                if (age < 35) return 0.3;
                if (age < 45) return 0.5;
                if (age < 55) return 0.7;
                return 0.9;
            }
        },
        // Esperienza
        experience: {
            weight: 0.2,
            score: (level) => {
                const scores = { beginner: 0.8, intermediate: 0.4, advanced: 0.2, elite: 0.1 };
                return scores[level] || 0.5;
            }
        },
        // Storia infortuni
        injury_history: {
            weight: 0.25,
            score: (injuries) => {
                if (!injuries || injuries.length === 0) return 0.1;
                if (injuries.length === 1) return 0.4;
                if (injuries.length === 2) return 0.6;
                return 0.9;
            }
        },
        // Fatica accumulata (da RPE trend)
        fatigue: {
            weight: 0.2,
            score: (rpeTrend) => {
                if (rpeTrend === 'critical' || rpeTrend === 'overtraining') return 1.0;
                if (rpeTrend === 'warning') return 0.7;
                if (rpeTrend === 'elevated') return 0.5;
                if (rpeTrend === 'optimal') return 0.2;
                return 0.3;
            }
        },
        // Dolori recenti
        recent_pain: {
            weight: 0.2,
            score: (painData) => {
                if (!painData || !painData.bodyParts) return 0;
                const chronicCount = painData.chronicPain?.length || 0;
                const recentCount = painData.recentPain?.length || 0;
                if (chronicCount >= 2) return 1.0;
                if (chronicCount >= 1) return 0.7;
                if (recentCount >= 2) return 0.5;
                if (recentCount >= 1) return 0.3;
                return 0;
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // MOVEMENT SCREENING (FMS-like virtuale)
    // ═══════════════════════════════════════════════════════════════
    const MOVEMENT_SCREENS = [
        {
            id: 'deep_squat',
            name: 'Deep Squat',
            question: 'Riesci a fare uno squat profondo con i talloni a terra e le braccia sopra la testa?',
            options: [
                { value: 3, label: 'Sì, senza problemi' },
                { value: 2, label: 'Sì, ma con leggera difficoltà' },
                { value: 1, label: 'Solo con i talloni alzati o compensi' },
                { value: 0, label: 'Dolore durante il movimento' }
            ],
            implications: {
                0: ['hip_mobility_deficit', 'ankle_mobility_deficit', 'pain_flag'],
                1: ['ankle_mobility_deficit', 'hip_mobility_deficit'],
                2: ['minor_mobility_limitation']
            }
        },
        {
            id: 'hurdle_step',
            name: 'Hurdle Step',
            question: 'Stando su una gamba, riesci a sollevare l\'altra al livello dell\'anca mantenendo l\'equilibrio?',
            options: [
                { value: 3, label: 'Sì, stabile su entrambe' },
                { value: 2, label: 'Leggera oscillazione' },
                { value: 1, label: 'Forte instabilità o asimmetria' },
                { value: 0, label: 'Dolore' }
            ],
            implications: {
                0: ['hip_pain', 'stability_deficit'],
                1: ['hip_stability_deficit', 'core_weakness', 'asymmetry'],
                2: ['minor_stability_issue']
            }
        },
        {
            id: 'inline_lunge',
            name: 'Inline Lunge',
            question: 'Riesci a fare un affondo in linea toccando il ginocchio a terra mantenendo l\'equilibrio?',
            options: [
                { value: 3, label: 'Sì, controllato' },
                { value: 2, label: 'Leggera difficoltà di equilibrio' },
                { value: 1, label: 'Perdo l\'equilibrio o ginocchio devia' },
                { value: 0, label: 'Dolore al ginocchio' }
            ],
            implications: {
                0: ['knee_pain', 'stability_deficit'],
                1: ['knee_stability_deficit', 'hip_mobility_deficit'],
                2: ['minor_balance_issue']
            }
        },
        {
            id: 'shoulder_mobility',
            name: 'Shoulder Mobility',
            question: 'Dietro la schiena, riesci a toccare le mani (una dall\'alto, una dal basso)?',
            options: [
                { value: 3, label: 'Sì, le mani si toccano' },
                { value: 2, label: 'Mani a meno di 15cm di distanza' },
                { value: 1, label: 'Mani a più di 15cm' },
                { value: 0, label: 'Dolore durante il test' }
            ],
            implications: {
                0: ['shoulder_pain', 'mobility_deficit'],
                1: ['shoulder_mobility_deficit', 'thoracic_stiffness'],
                2: ['minor_shoulder_tightness']
            }
        },
        {
            id: 'active_slr',
            name: 'Active Straight Leg Raise',
            question: 'Da sdraiato, riesci a sollevare una gamba dritta oltre i 70° senza piegare l\'altra?',
            options: [
                { value: 3, label: 'Sì, oltre 80°' },
                { value: 2, label: 'Tra 60° e 80°' },
                { value: 1, label: 'Sotto i 60° o l\'altra gamba si piega' },
                { value: 0, label: 'Dolore posteriore coscia/schiena' }
            ],
            implications: {
                0: ['hamstring_pain', 'lower_back_issue'],
                1: ['hamstring_tightness', 'hip_flexor_tightness'],
                2: ['minor_flexibility_limitation']
            }
        },
        {
            id: 'trunk_stability',
            name: 'Trunk Stability Push-up',
            question: 'Riesci a fare un push-up mantenendo il corpo in linea retta (senza inarcare la schiena)?',
            options: [
                { value: 3, label: 'Sì, perfettamente' },
                { value: 2, label: 'Leggero cedimento del core' },
                { value: 1, label: 'Schiena che si inarca o anche che salgono' },
                { value: 0, label: 'Dolore lombare' }
            ],
            implications: {
                0: ['lower_back_pain', 'core_weakness'],
                1: ['core_instability', 'scapular_dysfunction'],
                2: ['minor_core_endurance_issue']
            }
        },
        {
            id: 'rotary_stability',
            name: 'Rotary Stability',
            question: 'In quadrupedia, riesci a estendere braccio e gamba opposti mantenendo la schiena stabile?',
            options: [
                { value: 3, label: 'Sì, senza oscillazioni' },
                { value: 2, label: 'Leggera oscillazione' },
                { value: 1, label: 'Forte oscillazione o caduta' },
                { value: 0, label: 'Dolore' }
            ],
            implications: {
                0: ['pain_flag', 'stability_deficit'],
                1: ['rotary_instability', 'core_timing_deficit'],
                2: ['minor_coordination_issue']
            }
        }
    ];

    // ═══════════════════════════════════════════════════════════════
    // PREHAB EXERCISE DATABASE
    // ═══════════════════════════════════════════════════════════════
    const PREHAB_EXERCISES = {
        shoulder_stability: [
            { name: 'Band Pull-Apart', sets: '3x15', focus: 'rear delt, rhomboids' },
            { name: 'Face Pull', sets: '3x15', focus: 'external rotation' },
            { name: 'Y-T-W Raises', sets: '2x10 each', focus: 'scapular control' },
            { name: 'Serratus Wall Slides', sets: '2x12', focus: 'serratus activation' }
        ],
        shoulder_mobility: [
            { name: 'Shoulder CAR', sets: '2x5 each', focus: 'full ROM' },
            { name: 'Wall Angels', sets: '2x10', focus: 'thoracic extension' },
            { name: 'Doorway Stretch', sets: '2x30s each', focus: 'pec minor' }
        ],
        core_anti_rotation: [
            { name: 'Pallof Press', sets: '3x10 each', focus: 'anti-rotation' },
            { name: 'Dead Bug', sets: '3x8 each', focus: 'core timing' },
            { name: 'Bird Dog', sets: '3x8 each', focus: 'contralateral stability' }
        ],
        hip_mobility: [
            { name: '90/90 Hip Stretch', sets: '2x45s each', focus: 'internal/external rotation' },
            { name: 'Hip CAR', sets: '2x5 each', focus: 'full hip ROM' },
            { name: 'Couch Stretch', sets: '2x60s each', focus: 'hip flexor length' },
            { name: 'Pigeon Pose', sets: '2x45s each', focus: 'external rotation' }
        ],
        ankle_proprioception: [
            { name: 'Single Leg Balance', sets: '3x30s each', focus: 'static stability' },
            { name: 'Ankle Alphabet', sets: '2 rounds', focus: 'mobility + control' },
            { name: 'BOSU Single Leg', sets: '3x20s each', focus: 'dynamic stability' }
        ],
        knee_stability: [
            { name: 'TKE (Terminal Knee Extension)', sets: '3x15 each', focus: 'VMO activation' },
            { name: 'Step Downs', sets: '3x10 each', focus: 'eccentric control' },
            { name: 'Single Leg Romanian Deadlift', sets: '3x8 each', focus: 'posterior chain' }
        ],
        landing_mechanics: [
            { name: 'Drop Landing Hold', sets: '3x5', focus: 'absorption' },
            { name: 'Box Jump Step Down', sets: '3x5', focus: 'controlled eccentric' },
            { name: 'Single Leg Hop & Stick', sets: '3x5 each', focus: 'single leg stability' }
        ],
        wrist_mobility: [
            { name: 'Wrist Circles', sets: '2x10 each way', focus: 'general mobility' },
            { name: 'Prayer Stretch', sets: '2x30s', focus: 'flexion' },
            { name: 'Reverse Prayer', sets: '2x30s', focus: 'extension' },
            { name: 'Wrist Flexor/Extensor Stretch', sets: '2x30s each', focus: 'forearm length' }
        ],
        spinal_stability: [
            { name: 'McGill Big 3', sets: '1 round', focus: 'curl-up, side plank, bird dog' },
            { name: 'Stir The Pot', sets: '2x10 each', focus: 'dynamic core' },
            { name: 'Farmers Carry', sets: '3x40m', focus: 'loaded stability' }
        ],
        hip_hinge: [
            { name: 'Hip Hinge Wall Touch', sets: '2x10', focus: 'pattern drill' },
            { name: 'Romanian Deadlift Light', sets: '2x12', focus: 'posterior chain' },
            { name: 'Pull-Through', sets: '3x12', focus: 'glute drive' }
        ],
        glute_activation: [
            { name: 'Glute Bridge', sets: '3x15', focus: 'glute max' },
            { name: 'Clamshell', sets: '3x15 each', focus: 'glute med' },
            { name: 'Monster Walk', sets: '2x20 steps', focus: 'glute med endurance' }
        ],
        thoracic_mobility: [
            { name: 'Cat-Cow', sets: '2x10', focus: 'spinal flexion/extension' },
            { name: 'Thread The Needle', sets: '2x8 each', focus: 't-spine rotation' },
            { name: 'Foam Roll T-Spine', sets: '2x60s', focus: 'extension' }
        ]
    };

    // ═══════════════════════════════════════════════════════════════
    // STORAGE HELPERS
    // ═══════════════════════════════════════════════════════════════
    function loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    }

    function saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function loadScreening() {
        try {
            const raw = localStorage.getItem(SCREENING_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    }

    function saveScreening(data) {
        localStorage.setItem(SCREENING_KEY, JSON.stringify(data));
    }

    // ═══════════════════════════════════════════════════════════════
    // CORE RISK CALCULATION
    // ═══════════════════════════════════════════════════════════════
    function calculateRiskScore(athleteData, feedbackAnalysis = {}) {
        let totalScore = 0;
        let totalWeight = 0;
        const breakdown = {};

        // Age factor
        if (athleteData.age) {
            const score = RISK_FACTORS.age.score(athleteData.age);
            breakdown.age = { score, weight: RISK_FACTORS.age.weight };
            totalScore += score * RISK_FACTORS.age.weight;
            totalWeight += RISK_FACTORS.age.weight;
        }

        // Experience factor
        if (athleteData.experience_level) {
            const score = RISK_FACTORS.experience.score(athleteData.experience_level);
            breakdown.experience = { score, weight: RISK_FACTORS.experience.weight };
            totalScore += score * RISK_FACTORS.experience.weight;
            totalWeight += RISK_FACTORS.experience.weight;
        }

        // Injury history
        const injuries = athleteData.injuries || athleteData.injury_history || [];
        const injuryList = Array.isArray(injuries) ? injuries : 
                          (typeof injuries === 'string' ? injuries.split(',').map(s => s.trim()).filter(Boolean) : []);
        const injuryScore = RISK_FACTORS.injury_history.score(injuryList);
        breakdown.injury_history = { score: injuryScore, weight: RISK_FACTORS.injury_history.weight, count: injuryList.length };
        totalScore += injuryScore * RISK_FACTORS.injury_history.weight;
        totalWeight += RISK_FACTORS.injury_history.weight;

        // Fatigue from feedback
        if (feedbackAnalysis.rpeTrend) {
            const trend = feedbackAnalysis.rpeTrend.trend || feedbackAnalysis.rpeTrend;
            const score = RISK_FACTORS.fatigue.score(trend);
            breakdown.fatigue = { score, weight: RISK_FACTORS.fatigue.weight, trend };
            totalScore += score * RISK_FACTORS.fatigue.weight;
            totalWeight += RISK_FACTORS.fatigue.weight;
        }

        // Recent pain
        if (feedbackAnalysis.pain) {
            const score = RISK_FACTORS.recent_pain.score(feedbackAnalysis.pain);
            breakdown.recent_pain = { score, weight: RISK_FACTORS.recent_pain.weight, areas: feedbackAnalysis.pain.bodyParts };
            totalScore += score * RISK_FACTORS.recent_pain.weight;
            totalWeight += RISK_FACTORS.recent_pain.weight;
        }

        // Normalize score (0-100)
        const normalizedScore = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;

        return {
            score: normalizedScore,
            level: normalizedScore >= 70 ? 'high' : (normalizedScore >= 40 ? 'moderate' : 'low'),
            breakdown,
            timestamp: new Date().toISOString()
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // SPORT-SPECIFIC RISK ANALYSIS
    // ═══════════════════════════════════════════════════════════════
    function getSportRiskProfile(sport) {
        const key = String(sport || 'default').toLowerCase();
        return SPORT_RISK_PROFILES[key] || SPORT_RISK_PROFILES.default;
    }

    function analyzeInjuryRisk(athleteData, feedbackAnalysis = {}) {
        const sport = athleteData.sport || 'fitness';
        const sportProfile = getSportRiskProfile(sport);
        const baseRisk = calculateRiskScore(athleteData, feedbackAnalysis);

        // Check if pain areas match high-risk areas for sport
        const painAreas = feedbackAnalysis.pain?.bodyParts || [];
        const highRiskMatches = painAreas.filter(area => 
            sportProfile.high_risk_areas.includes(area)
        );

        // Increase risk if pain in high-risk areas
        let adjustedScore = baseRisk.score;
        if (highRiskMatches.length > 0) {
            adjustedScore = Math.min(100, adjustedScore + (highRiskMatches.length * 10));
        }

        // Determine potential injury patterns
        const potentialPatterns = [];
        highRiskMatches.forEach(area => {
            sportProfile.overuse_patterns.forEach(pattern => {
                if (pattern.includes(area) || 
                    (area === 'knee' && pattern.includes('patellar')) ||
                    (area === 'shoulder' && pattern.includes('rotator')) ||
                    (area === 'lower_back' && pattern.includes('disc'))) {
                    potentialPatterns.push(pattern);
                }
            });
        });

        return {
            ...baseRisk,
            score: adjustedScore,
            level: adjustedScore >= 70 ? 'high' : (adjustedScore >= 40 ? 'moderate' : 'low'),
            sport,
            sportProfile,
            highRiskMatches,
            potentialPatterns: [...new Set(potentialPatterns)],
            criticalMovements: sportProfile.critical_movements,
            recommendedPrehab: sportProfile.prehab_priority
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // MOVEMENT SCREENING
    // ═══════════════════════════════════════════════════════════════
    function getMovementScreens() {
        return MOVEMENT_SCREENS;
    }

    function saveScreeningResult(athleteId, results) {
        const data = loadScreening();
        
        // Calculate total score
        const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
        const maxScore = MOVEMENT_SCREENS.length * 3;
        
        // Collect all implications
        const implications = [];
        results.forEach(result => {
            const screen = MOVEMENT_SCREENS.find(s => s.id === result.screenId);
            if (screen && screen.implications[result.score]) {
                implications.push(...screen.implications[result.score]);
            }
        });

        const screening = {
            athleteId,
            date: new Date().toISOString(),
            results,
            totalScore,
            maxScore,
            percentage: Math.round((totalScore / maxScore) * 100),
            implications: [...new Set(implications)],
            hasPainFlag: implications.includes('pain_flag') || results.some(r => r.score === 0)
        };

        if (!data[athleteId]) data[athleteId] = [];
        data[athleteId].unshift(screening);
        
        // Keep last 10 screenings
        data[athleteId] = data[athleteId].slice(0, 10);
        
        saveScreening(data);
        return screening;
    }

    function getLatestScreening(athleteId) {
        const data = loadScreening();
        return data[athleteId]?.[0] || null;
    }

    function getScreeningHistory(athleteId) {
        const data = loadScreening();
        return data[athleteId] || [];
    }

    // ═══════════════════════════════════════════════════════════════
    // PREHAB RECOMMENDATIONS
    // ═══════════════════════════════════════════════════════════════
    function generatePrehabProtocol(athleteData, feedbackAnalysis = {}, screening = null) {
        const riskAnalysis = analyzeInjuryRisk(athleteData, feedbackAnalysis);
        const exercises = [];
        const priorityAreas = new Set();

        // Add from sport prehab priorities
        riskAnalysis.recommendedPrehab.forEach(area => {
            priorityAreas.add(area);
        });

        // Add from pain areas
        const painAreas = feedbackAnalysis.pain?.bodyParts || [];
        painAreas.forEach(area => {
            // Map pain areas to prehab categories
            const mapping = {
                shoulder: ['shoulder_stability', 'shoulder_mobility', 'thoracic_mobility'],
                knee: ['knee_stability', 'glute_activation', 'hip_mobility'],
                lower_back: ['spinal_stability', 'hip_mobility', 'glute_activation'],
                ankle: ['ankle_proprioception'],
                hip: ['hip_mobility', 'glute_activation'],
                wrist: ['wrist_mobility'],
                elbow: ['shoulder_mobility', 'wrist_mobility']
            };
            (mapping[area] || []).forEach(cat => priorityAreas.add(cat));
        });

        // Add from screening implications
        if (screening?.implications) {
            screening.implications.forEach(impl => {
                const mapping = {
                    hip_mobility_deficit: ['hip_mobility'],
                    ankle_mobility_deficit: ['ankle_proprioception'],
                    shoulder_mobility_deficit: ['shoulder_mobility', 'thoracic_mobility'],
                    core_weakness: ['core_anti_rotation', 'spinal_stability'],
                    stability_deficit: ['knee_stability', 'ankle_proprioception'],
                    hamstring_tightness: ['hip_mobility'],
                    core_instability: ['core_anti_rotation', 'spinal_stability']
                };
                (mapping[impl] || []).forEach(cat => priorityAreas.add(cat));
            });
        }

        // Build exercise list
        priorityAreas.forEach(area => {
            if (PREHAB_EXERCISES[area]) {
                exercises.push({
                    category: area.replace(/_/g, ' '),
                    exercises: PREHAB_EXERCISES[area]
                });
            }
        });

        return {
            riskLevel: riskAnalysis.level,
            riskScore: riskAnalysis.score,
            protocol: exercises.slice(0, 5), // Max 5 categories
            priorityAreas: [...priorityAreas],
            duration: riskAnalysis.level === 'high' ? '15-20 min' : '10-15 min',
            frequency: riskAnalysis.level === 'high' ? 'prima di ogni allenamento' : '3x/settimana',
            notes: generatePrehabNotes(riskAnalysis, painAreas)
        };
    }

    function generatePrehabNotes(riskAnalysis, painAreas) {
        const notes = [];
        
        if (riskAnalysis.level === 'high') {
            notes.push('⚠️ Rischio infortunio ALTO - eseguire prehab SEMPRE prima dell\'allenamento');
        }
        
        if (painAreas.length > 0) {
            notes.push(`Focus su aree doloranti: ${painAreas.join(', ')}`);
        }
        
        if (riskAnalysis.potentialPatterns.length > 0) {
            notes.push(`Pattern da monitorare: ${riskAnalysis.potentialPatterns.slice(0, 2).join(', ')}`);
        }
        
        if (riskAnalysis.breakdown?.fatigue?.trend === 'warning' || 
            riskAnalysis.breakdown?.fatigue?.trend === 'critical') {
            notes.push('Considerare riduzione volume/intensità per recupero');
        }

        return notes;
    }

    // ═══════════════════════════════════════════════════════════════
    // OVERUSE PATTERN DETECTION
    // ═══════════════════════════════════════════════════════════════
    function detectOverusePatterns(athleteId, feedbackHistory) {
        const patterns = [];
        
        if (!feedbackHistory || feedbackHistory.length < 3) {
            return { patterns: [], risk: 'insufficient_data' };
        }

        // Analyze pain frequency by area
        const painByArea = {};
        const recentWeeks = 4;
        const now = Date.now();
        const msPerWeek = 7 * 24 * 60 * 60 * 1000;

        feedbackHistory.forEach(fb => {
            if (!fb.completed_at) return;
            
            const weekAgo = (now - new Date(fb.completed_at).getTime()) / msPerWeek;
            if (weekAgo > recentWeeks) return;

            const painAreas = fb.pain_areas || [];
            painAreas.forEach(area => {
                if (!painByArea[area]) painByArea[area] = { count: 0, weeks: new Set() };
                painByArea[area].count++;
                painByArea[area].weeks.add(Math.floor(weekAgo));
            });
        });

        // Detect chronic patterns
        Object.entries(painByArea).forEach(([area, data]) => {
            if (data.weeks.size >= 3) {
                patterns.push({
                    type: 'chronic',
                    area,
                    severity: 'high',
                    message: `Dolore ${area} ricorrente per ${data.weeks.size}+ settimane - rischio cronicizzazione`,
                    recommendation: 'Consultare fisioterapista, modificare esercizi che stressano la zona'
                });
            } else if (data.count >= 3) {
                patterns.push({
                    type: 'recurring',
                    area,
                    severity: 'medium',
                    message: `Dolore ${area} segnalato ${data.count}x nelle ultime ${recentWeeks} settimane`,
                    recommendation: 'Monitorare attentamente, aggiungere prehab specifico'
                });
            }
        });

        // Analyze RPE progression for overtraining
        const rpeValues = feedbackHistory
            .filter(fb => fb.rpe && fb.completed_at)
            .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
            .slice(0, 10)
            .map(fb => fb.rpe);

        if (rpeValues.length >= 5) {
            const recentAvg = rpeValues.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
            const olderAvg = rpeValues.slice(5).reduce((a, b) => a + b, 0) / Math.max(1, rpeValues.slice(5).length);
            
            if (recentAvg > olderAvg + 1) {
                patterns.push({
                    type: 'overtraining',
                    area: 'systemic',
                    severity: recentAvg >= 9 ? 'high' : 'medium',
                    message: `RPE in aumento significativo (${olderAvg.toFixed(1)} → ${recentAvg.toFixed(1)})`,
                    recommendation: 'Pianificare deload, verificare recupero e qualità sonno'
                });
            }
        }

        return {
            patterns,
            risk: patterns.some(p => p.severity === 'high') ? 'high' : 
                  patterns.length > 0 ? 'moderate' : 'low',
            analyzedWorkouts: feedbackHistory.length
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // EXERCISE SAFETY CHECK
    // ═══════════════════════════════════════════════════════════════
    function checkExerciseSafety(exerciseName, athleteData, feedbackAnalysis) {
        const name = String(exerciseName).toLowerCase();
        const painAreas = feedbackAnalysis?.pain?.bodyParts || [];
        const riskLevel = feedbackAnalysis?.modifiers?.forceDeload ? 'high' : 'normal';
        
        const warnings = [];
        const alternatives = [];

        // Check pain area conflicts
        const exercisePainMap = {
            shoulder: ['overhead press', 'military press', 'lateral raise', 'upright row', 'arnold press', 'face pull'],
            knee: ['squat', 'lunge', 'leg extension', 'leg press', 'jump', 'step'],
            lower_back: ['deadlift', 'good morning', 'bent row', 'romanian', 'back extension'],
            wrist: ['curl', 'push-up', 'clean', 'snatch', 'front squat'],
            elbow: ['curl', 'tricep', 'skull crusher', 'dip'],
            hip: ['squat', 'lunge', 'deadlift', 'hip thrust']
        };

        painAreas.forEach(area => {
            const riskyExercises = exercisePainMap[area] || [];
            if (riskyExercises.some(ex => name.includes(ex))) {
                warnings.push({
                    severity: 'high',
                    message: `⚠️ Esercizio potenzialmente problematico per dolore ${area}`,
                    action: 'Considera alternativa o riduci carico'
                });

                // Suggest alternatives
                if (area === 'shoulder') {
                    alternatives.push('Landmine press', 'Cable chest fly', 'Push-up');
                } else if (area === 'knee') {
                    alternatives.push('Hip thrust', 'Romanian deadlift', 'Cable kickback');
                } else if (area === 'lower_back') {
                    alternatives.push('Trap bar deadlift', 'Hip thrust', 'Leg press');
                }
            }
        });

        // Check experience level for complex exercises
        const advancedExercises = ['clean', 'snatch', 'jerk', 'muscle-up', 'handstand'];
        if (athleteData.experience_level === 'beginner' && 
            advancedExercises.some(ex => name.includes(ex))) {
            warnings.push({
                severity: 'medium',
                message: 'Esercizio avanzato per livello beginner',
                action: 'Assicurarsi di avere supervisione tecnica'
            });
        }

        return {
            exercise: exerciseName,
            safe: warnings.length === 0,
            warnings,
            alternatives: [...new Set(alternatives)],
            riskLevel: warnings.some(w => w.severity === 'high') ? 'high' : 
                       warnings.length > 0 ? 'moderate' : 'low'
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // ALERT GENERATION FOR COACH
    // ═══════════════════════════════════════════════════════════════
    function generateCoachAlerts(athleteId, athleteData, feedbackAnalysis) {
        const alerts = [];
        const riskAnalysis = analyzeInjuryRisk(athleteData, feedbackAnalysis);

        // High risk alert
        if (riskAnalysis.level === 'high') {
            alerts.push({
                type: 'injury_risk',
                severity: 'critical',
                title: 'Rischio Infortunio Alto',
                message: `Score: ${riskAnalysis.score}/100. Fattori: ${Object.entries(riskAnalysis.breakdown)
                    .filter(([_, v]) => v.score >= 0.6)
                    .map(([k, _]) => k.replace(/_/g, ' '))
                    .join(', ')}`,
                action: 'Ridurre volume/intensità, focus su recovery e prehab'
            });
        }

        // Chronic pain alert
        const chronicPain = feedbackAnalysis?.pain?.chronicPain || [];
        if (chronicPain.length > 0) {
            alerts.push({
                type: 'chronic_pain',
                severity: 'warning',
                title: 'Dolore Cronico Rilevato',
                message: `Aree: ${chronicPain.join(', ')}`,
                action: 'Valutare consultazione fisioterapista, modificare programma'
            });
        }

        // High-risk sport area match
        if (riskAnalysis.highRiskMatches?.length > 0) {
            alerts.push({
                type: 'sport_specific_risk',
                severity: 'warning',
                title: 'Dolore in Area Critica per Sport',
                message: `${riskAnalysis.highRiskMatches.join(', ')} - zone ad alto rischio per ${riskAnalysis.sport}`,
                action: 'Modificare esercizi, aggiungere prehab specifico'
            });
        }

        // Overtraining pattern
        if (riskAnalysis.breakdown?.fatigue?.trend === 'critical' || 
            riskAnalysis.breakdown?.fatigue?.trend === 'overtraining') {
            alerts.push({
                type: 'overtraining',
                severity: 'critical',
                title: 'Segnali di Overtraining',
                message: 'RPE costantemente alto, rischio burnout/infortunio',
                action: 'Inserire deload immediato, verificare recupero'
            });
        }

        return {
            athleteId,
            alerts,
            hasAlerts: alerts.length > 0,
            criticalCount: alerts.filter(a => a.severity === 'critical').length,
            riskAnalysis,
            timestamp: new Date().toISOString()
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // PROMPT GENERATION FOR AI WORKOUT
    // ═══════════════════════════════════════════════════════════════
    function generateInjuryPreventionPrompt(athleteData, feedbackAnalysis, screening = null) {
        const riskAnalysis = analyzeInjuryRisk(athleteData, feedbackAnalysis);
        const prehab = generatePrehabProtocol(athleteData, feedbackAnalysis, screening);
        
        const lines = [
            '',
            '🛡️ INJURY PREVENTION - ANALISI RISCHIO',
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        ];

        // Risk level
        const riskEmoji = riskAnalysis.level === 'high' ? '🔴' : 
                          riskAnalysis.level === 'moderate' ? '🟡' : '🟢';
        lines.push(`${riskEmoji} Rischio infortunio: ${riskAnalysis.level.toUpperCase()} (${riskAnalysis.score}/100)`);

        // Pain areas to avoid
        const painAreas = feedbackAnalysis?.pain?.bodyParts || [];
        if (painAreas.length > 0) {
            lines.push(`⛔ Zone doloranti: ${painAreas.join(', ')}`);
            lines.push(`   → EVITA esercizi che stressano queste aree`);
        }

        // Sport-specific warnings
        if (riskAnalysis.highRiskMatches?.length > 0) {
            lines.push(`⚠️ Aree critiche per ${riskAnalysis.sport}: ${riskAnalysis.highRiskMatches.join(', ')}`);
        }

        // Movements to modify
        if (riskAnalysis.criticalMovements?.length > 0 && riskAnalysis.level !== 'low') {
            lines.push(`🔄 Movimenti da monitorare: ${riskAnalysis.criticalMovements.join(', ')}`);
        }

        // Prehab recommendations
        if (prehab.priorityAreas.length > 0) {
            lines.push(`💪 Prehab prioritario: ${prehab.priorityAreas.slice(0, 3).join(', ')}`);
        }

        // Screening results if available
        if (screening) {
            lines.push(`📋 Movement screening: ${screening.percentage}% (${screening.totalScore}/${screening.maxScore})`);
            if (screening.hasPainFlag) {
                lines.push(`   ⚠️ Dolore rilevato durante screening - cautela`);
            }
        }

        lines.push('');

        return lines.join('\n');
    }

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════
    return {
        VERSION,
        
        // Risk analysis
        calculateRiskScore,
        analyzeInjuryRisk,
        getSportRiskProfile,
        
        // Movement screening
        getMovementScreens,
        saveScreeningResult,
        getLatestScreening,
        getScreeningHistory,
        
        // Prehab
        generatePrehabProtocol,
        PREHAB_EXERCISES,
        
        // Pattern detection
        detectOverusePatterns,
        
        // Safety checks
        checkExerciseSafety,
        
        // Coach alerts
        generateCoachAlerts,
        
        // AI integration
        generateInjuryPreventionPrompt,
        
        // Config
        SPORT_RISK_PROFILES,
        RISK_FACTORS
    };
})();

console.log('🛡️ InjuryPrevention Engine v' + window.InjuryPrevention.VERSION + ' loaded');
