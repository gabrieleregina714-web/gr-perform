/**
 * GR Perform - Workout Quality Audit System
 * Verifica automatica della qualità dei workout generati
 * 
 * Uso: WorkoutAudit.analyze(workout) → { score, issues, suggestions }
 */

window.WorkoutAudit = (function() {
    'use strict';

    const VERSION = '1.0';

    // ═══════════════════════════════════════════════════════════════
    // REGOLE DI VALIDAZIONE
    // ═══════════════════════════════════════════════════════════════
    
    const RULES = {
        // Struttura base
        structure: {
            minExercises: 6,
            maxExercises: 14,
            minDuration: 40,
            maxDuration: 100,
            requireWarmup: true,
            requireCooldown: true
        },
        
        // Rest per tipo
        restRanges: {
            strength: { min: 90, max: 300 },      // 90s - 5min
            hypertrophy: { min: 45, max: 120 },   // 45s - 2min
            conditioning: { min: 30, max: 90 },    // 30s - 90s (tra round)
            superset_first: { min: 0, max: 0 },   // 0s per primo esercizio superset
            superset_second: { min: 60, max: 150 }, // 60-150s dopo la coppia
            warmup: { min: 0, max: 30 },
            cooldown: { min: 0, max: 60 }
        },
        
        // Coerenza nome/parametri
        namePatterns: {
            rounds: /(\d+)\s*rounds?/i,
            xMin: /(\d+)\s*x\s*\d+\s*min/i,
            intervals: /interval/i,
            circuit: /circuit/i,
            superset: /superset|a1:|a2:|b1:|b2:|c1:|c2:/i
        },
        
        // Varietà
        variety: {
            maxSameExercisePerWeek: 2,  // Stesso esercizio max 2 volte/settimana
            minDifferentPatterns: 3,     // Almeno 3 pattern diversi
            maxSameAccessory: 1          // Stesso accessorio max 1 volta per workout
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // FUNZIONI DI ANALISI
    // ═══════════════════════════════════════════════════════════════

    function analyzeWorkout(workout) {
        const issues = [];
        const suggestions = [];
        let score = 100;

        const exercises = workout?.exercises || [];
        const name = workout?.name || '';
        const duration = workout?.estimated_duration_minutes || 0;

        // 1. Struttura base
        if (exercises.length < RULES.structure.minExercises) {
            issues.push(`❌ Solo ${exercises.length} esercizi (min: ${RULES.structure.minExercises})`);
            score -= 15;
        }
        if (exercises.length > RULES.structure.maxExercises) {
            issues.push(`⚠️ Troppi esercizi: ${exercises.length} (max: ${RULES.structure.maxExercises})`);
            score -= 5;
        }

        // 2. Warm-up e Cool-down
        const hasWarmup = exercises.some(ex => 
            /warm|activation|mobility|dynamic/i.test(ex.name)
        );
        const hasCooldown = exercises.some(ex => 
            /cool|stretch|recovery/i.test(ex.name)
        );
        
        if (!hasWarmup) {
            issues.push('❌ Manca warm-up');
            score -= 10;
        }
        if (!hasCooldown) {
            issues.push('⚠️ Manca cool-down/stretching');
            score -= 5;
        }

        // 3. Analisi per esercizio
        const accessoryCount = {};
        
        exercises.forEach((ex, idx) => {
            const exName = String(ex.name || '');
            const exType = String(ex.type || '').toLowerCase();
            const sets = parseInt(ex.sets, 10) || 0;
            const rest = parseRestToSeconds(ex.rest);
            const reps = String(ex.reps || '');

            // 3.1 Coerenza rounds/sets
            const roundsMatch = exName.match(RULES.namePatterns.rounds);
            if (roundsMatch) {
                const expectedSets = parseInt(roundsMatch[1], 10);
                if (expectedSets !== sets) {
                    issues.push(`❌ "${exName.substring(0, 30)}..." dice ${expectedSets} rounds ma sets=${sets}`);
                    score -= 10;
                }
            }

            // 3.2 Rest appropriato per tipo
            const isSuperset = RULES.namePatterns.superset.test(exName);
            const isFirstInSuperset = /a1:|b1:|c1:/i.test(exName);
            const isInterval = RULES.namePatterns.intervals.test(exName) || RULES.namePatterns.circuit.test(exName);
            
            if (isFirstInSuperset) {
                // Primo esercizio superset deve avere rest 0
                if (rest > 0) {
                    issues.push(`⚠️ "${exName.substring(0, 25)}..." (superset A1/B1) ha rest ${rest}s, dovrebbe essere 0s`);
                    score -= 3;
                }
            } else if (isInterval && rest === 0 && sets > 1) {
                // Intervals con rest 0 è impossibile
                issues.push(`❌ "${exName.substring(0, 30)}..." ha ${sets} rounds ma rest=0s (impossibile)`);
                score -= 10;
                suggestions.push(`→ Suggerimento: rest 60s tra i round per "${exName.substring(0, 20)}..."`);
            } else if (exType === 'strength' && rest < RULES.restRanges.strength.min && !isSuperset) {
                // Escludi accessori/prehab dalla regola strict del rest
                const isAccessory = /neck|face pull|band|rotation|prehab|harness|y-t-w|pull-apart/i.test(exName);
                if (!isAccessory) {
                    issues.push(`⚠️ "${exName.substring(0, 25)}..." (strength) ha rest ${rest}s (min: ${RULES.restRanges.strength.min}s)`);
                    score -= 5;
                }
            }

            // 3.3 Varietà accessori
            const accessoryName = exName.toLowerCase().replace(/[^a-z]/g, '');
            if (/b1:|b2:|c1:|c2:|accessory/i.test(exName)) {
                accessoryCount[accessoryName] = (accessoryCount[accessoryName] || 0) + 1;
            }

            // 3.4 Reps sensate per intervals
            if (isInterval) {
                const repsLower = reps.toLowerCase();
                if (reps === '1' || reps === '') {
                    issues.push(`⚠️ "${exName.substring(0, 25)}..." ha reps="${reps}" (dovrebbe essere tempo es. "1 min")`);
                    score -= 5;
                }
            }
        });

        // 4. Varietà accessori
        Object.entries(accessoryCount).forEach(([name, count]) => {
            if (count > RULES.variety.maxSameAccessory) {
                issues.push(`⚠️ Accessorio "${name}" ripetuto ${count} volte (max: ${RULES.variety.maxSameAccessory})`);
                suggestions.push(`→ Alterna con: Band Pull-apart, Y-T-W, External Rotation, Rear Delt Raise`);
                score -= 3;
            }
        });

        // 5. Calcola score finale
        score = Math.max(0, Math.min(100, score));

        // 6. Rating
        let rating;
        if (score >= 90) rating = '🏆 ECCELLENTE';
        else if (score >= 75) rating = '✅ BUONO';
        else if (score >= 60) rating = '⚠️ SUFFICIENTE';
        else rating = '❌ DA MIGLIORARE';

        return {
            score,
            rating,
            issues,
            suggestions,
            summary: {
                exerciseCount: exercises.length,
                hasWarmup,
                hasCooldown,
                duration
            }
        };
    }

    function analyzeWeekPlan(workouts) {
        if (!Array.isArray(workouts)) return null;

        const results = workouts.map(w => ({
            day: w.day_of_week,
            name: w.name,
            ...analyzeWorkout(w)
        }));

        const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
        const allIssues = results.flatMap(r => r.issues);
        const criticalIssues = allIssues.filter(i => i.startsWith('❌'));

        // Varietà settimanale
        const weeklyExercises = {};
        workouts.forEach(w => {
            (w.exercises || []).forEach(ex => {
                const name = String(ex.name || '').toLowerCase();
                weeklyExercises[name] = (weeklyExercises[name] || 0) + 1;
            });
        });

        const overusedExercises = Object.entries(weeklyExercises)
            .filter(([_, count]) => count > RULES.variety.maxSameExercisePerWeek)
            .map(([name, count]) => `"${name.substring(0, 25)}..." usato ${count}x`);

        return {
            averageScore: Math.round(avgScore),
            totalIssues: allIssues.length,
            criticalIssues: criticalIssues.length,
            workoutResults: results,
            weeklyVariety: {
                overusedExercises,
                uniqueExercises: Object.keys(weeklyExercises).length
            },
            overallRating: avgScore >= 80 ? '✅ SETTIMANA OK' : '⚠️ SETTIMANA DA RIVEDERE'
        };
    }

    function parseRestToSeconds(rest) {
        if (!rest) return 0;
        const str = String(rest).toLowerCase().trim();
        if (str === '0s' || str === '0' || str === 'n/a') return 0;
        
        const minMatch = str.match(/(\d+)\s*min/);
        if (minMatch) return parseInt(minMatch[1], 10) * 60;
        
        const secMatch = str.match(/(\d+)\s*s?/);
        if (secMatch) return parseInt(secMatch[1], 10);
        
        return 0;
    }

    // ═══════════════════════════════════════════════════════════════
    // REPORT CONSOLE
    // ═══════════════════════════════════════════════════════════════

    function printReport(workout) {
        const result = analyzeWorkout(workout);
        
        console.log('\n' + '═'.repeat(60));
        console.log(`📊 AUDIT: ${workout?.name || 'Workout'}`);
        console.log('═'.repeat(60));
        console.log(`Score: ${result.score}/100 ${result.rating}`);
        console.log(`Esercizi: ${result.summary.exerciseCount} | Warmup: ${result.summary.hasWarmup ? '✓' : '✗'} | Cooldown: ${result.summary.hasCooldown ? '✓' : '✗'}`);
        
        if (result.issues.length > 0) {
            console.log('\nProblemi trovati:');
            result.issues.forEach(i => console.log('  ' + i));
        }
        
        if (result.suggestions.length > 0) {
            console.log('\nSuggerimenti:');
            result.suggestions.forEach(s => console.log('  ' + s));
        }
        
        console.log('═'.repeat(60) + '\n');
        
        return result;
    }

    function printWeekReport(workouts) {
        const result = analyzeWeekPlan(workouts);
        if (!result) return null;
        
        console.log('\n' + '═'.repeat(60));
        console.log('📊 AUDIT SETTIMANALE');
        console.log('═'.repeat(60));
        console.log(`Score medio: ${result.averageScore}/100 ${result.overallRating}`);
        console.log(`Issues totali: ${result.totalIssues} (${result.criticalIssues} critici)`);
        console.log(`Esercizi unici: ${result.weeklyVariety.uniqueExercises}`);
        
        if (result.weeklyVariety.overusedExercises.length > 0) {
            console.log('\nEsercizi troppo ripetuti:');
            result.weeklyVariety.overusedExercises.forEach(e => console.log('  ⚠️ ' + e));
        }
        
        console.log('\nDettaglio per giorno:');
        result.workoutResults.forEach(r => {
            console.log(`  ${r.day}: ${r.score}/100 ${r.rating} (${r.issues.length} issues)`);
        });
        
        console.log('═'.repeat(60) + '\n');
        
        return result;
    }

    // ═══════════════════════════════════════════════════════════════
    // EXPORT
    // ═══════════════════════════════════════════════════════════════

    console.log(`📊 WorkoutAudit v${VERSION} loaded`);

    return {
        VERSION,
        analyze: analyzeWorkout,
        analyzeWeek: analyzeWeekPlan,
        printReport,
        printWeekReport,
        RULES
    };

})();
