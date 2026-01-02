/**
 * GR Perform - Constraint Engine v1.0
 * 
 * SISTEMA INVIOLABILE di validazione e correzione automatica.
 * 
 * Questo modulo NON si affida all'AI per seguire regole.
 * Invece, VALIDA l'output dell'AI e lo CORREGGE automaticamente
 * applicando regole matematiche e scientifiche.
 * 
 * L'AI genera → Constraint Engine valida e corregge → Output SEMPRE conforme
 */

window.ConstraintEngine = (function() {
    'use strict';
    
    const VERSION = '1.0';
    
    // Riferimento ai modelli scientifici
    const getModels = () => window.ScientificModels || null;
    
    // ═══════════════════════════════════════════════════════════════
    // HARD CONSTRAINTS - Regole INVIOLABILI (codice, non prompt)
    // ═══════════════════════════════════════════════════════════════
    
    const HARD_CONSTRAINTS = {
        // ───────────────────────────────────────────────────────────
        // CONSTRAINT: Ordine fasi sessione
        // ───────────────────────────────────────────────────────────
        sessionOrder: {
            id: 'session_order',
            description: 'Ordine fasi sessione deve seguire principi fisiologici',
            
            // Ordine priorità: più basso = prima nella sessione
            phasePriority: {
                warmup: 1,
                activation: 2,
                power: 3,        // Potenza PRIMA di forza (CNS fresco)
                strength: 4,     // Forza prima di conditioning
                hypertrophy: 5,
                conditioning: 6,
                accessories: 7,
                core: 8,
                cooldown: 9
            },
            
            /**
             * Classifica un esercizio in una fase
             */
            classifyExercise(exercise) {
                const name = String(exercise?.name || '').toLowerCase();
                const type = String(exercise?.type || '').toLowerCase();
                
                // Cool-down detection - DEVE venire PRIMA di warm-up!
                // Altrimenti "Cool-down (Stretching)" matcha "stretch" come warmup
                if (/cool-?down|static.*stretch|foam.*roll.*end|recovery.*walk/i.test(name)) {
                    return 'cooldown';
                }
                
                // Warm-up detection
                if (/warm|dynamic|activation|mobility|foam|stretch/i.test(name) && 
                    !/static.*stretch/i.test(name)) {
                    return 'warmup';
                }
                
                // BOXING CONDITIONING - deve venire PRIMA di power detection
                // Heavy Bag, Shadow Boxing, Boxing Circuit sono CONDITIONING, non power
                if (/heavy\s*bag|shadow\s*box|boxing\s*circuit|speed\s*bag|pad\s*work|mitts/i.test(name)) {
                    return 'conditioning';
                }
                
                // Power exercises (before strength) - ma NON "power punches" etc
                // Solo esercizi pliometrici veri: jumps, throws, bounds
                if (/box\s*jump|depth\s*jump|broad\s*jump|plyo|explosive\s*push|med.*ball.*throw|bound/i.test(name) &&
                    !/punch|bag|boxing/i.test(name)) {
                    return 'power';
                }
                
                // Core/accessories
                if (/core|plank|dead\s*bug|bird\s*dog|pallof|anti|neck|collo/i.test(name)) {
                    return 'core';
                }
                
                // Conditioning (general)
                if (/circuit|hiit|interval|cardio|sprint|run|rope/i.test(name) ||
                    type === 'conditioning') {
                    return 'conditioning';
                }
                
                // Strength vs hypertrophy based on type and rep range
                if (type === 'strength') {
                    return 'strength';
                }
                if (type === 'hypertrophy') {
                    return 'hypertrophy';
                }
                
                // Default classification by exercise name
                if (/squat|deadlift|bench|press|row|pull/i.test(name)) {
                    return 'strength';
                }
                
                return 'accessories';
            },
            
            /**
             * Riordina esercizi secondo ordine fisiologico corretto
             */
            enforce(exercises) {
                if (!Array.isArray(exercises) || exercises.length === 0) {
                    return { exercises: [], fixes: [] };
                }
                
                const classified = exercises.map((ex, idx) => ({
                    exercise: ex,
                    originalIndex: idx,
                    phase: this.classifyExercise(ex),
                    priority: this.phasePriority[this.classifyExercise(ex)] || 5
                }));
                
                // DEBUG: mostra classificazione
                console.log('🔬 ConstraintEngine CLASSIFICATION:');
                classified.forEach(c => {
                    console.log(`  [${c.priority}] ${c.phase}: ${c.exercise.name?.substring(0,40)}`);
                });
                
                // Ordina per priorità fase
                classified.sort((a, b) => a.priority - b.priority);
                
                // DEBUG: mostra ordine dopo sorting
                console.log('🔬 ConstraintEngine AFTER SORT:');
                classified.forEach((c, i) => {
                    console.log(`  ${i+1}. [${c.priority}] ${c.phase}: ${c.exercise.name?.substring(0,40)}`);
                });
                
                // Rileva se c'è stato riordinamento
                const fixes = [];
                let wasReordered = false;
                
                classified.forEach((item, newIdx) => {
                    if (item.originalIndex !== newIdx) {
                        wasReordered = true;
                    }
                });
                
                if (wasReordered) {
                    fixes.push({
                        type: 'reorder',
                        severity: 'high',
                        message: 'Esercizi riordinati per rispettare sequenza fisiologica corretta',
                        detail: 'Warm-up → Power → Strength → Conditioning → Core → Cool-down'
                    });
                }
                
                return {
                    exercises: classified.map(c => c.exercise),
                    fixes
                };
            }
        },
        
        // ───────────────────────────────────────────────────────────
        // CONSTRAINT: Tempi di recupero minimi
        // ───────────────────────────────────────────────────────────
        restPeriods: {
            id: 'rest_periods',
            description: 'Tempi di recupero devono rispettare fisiologia sistema energetico',
            
            /**
             * Calcola rest minimo basato su reps e tipo esercizio
             */
            getMinimumRest(exercise) {
                const name = String(exercise?.name || '').toLowerCase();
                const type = String(exercise?.type || '').toLowerCase();
                const repsRaw = String(exercise?.reps || '');
                
                // Estrai numero di reps
                let reps = parseInt(repsRaw.replace(/\D/g, ''), 10) || 8;
                
                // Se è a tempo (es. "3min"), considera come conditioning
                if (/min/i.test(repsRaw)) {
                    return { min: 60, optimal: 60, reason: 'Round-based: 60s simula recupero ring' };
                }
                
                // Compound exercises
                const isCompound = /squat|deadlift|bench|press|row|pull.*up|chin|dip|lunge/i.test(name);
                
                // Strength type
                if (type === 'strength' || (isCompound && reps <= 6)) {
                    if (reps <= 3) {
                        return { min: 180, optimal: 240, reason: 'Max strength (1-3 rep): ATP-PC completo' };
                    }
                    if (reps <= 5) {
                        return { min: 150, optimal: 180, reason: 'Strength (4-5 rep): recupero sistema fosfageno' };
                    }
                    return { min: 120, optimal: 150, reason: 'Strength-hypertrophy (6 rep)' };
                }
                
                // Hypertrophy
                if (type === 'hypertrophy' || (reps >= 8 && reps <= 12)) {
                    return { min: 60, optimal: 90, reason: 'Hypertrophy (8-12 rep): stress metabolico desiderato' };
                }
                
                // Conditioning
                if (type === 'conditioning' || /circuit|shadow|bag|cardio/i.test(name)) {
                    return { min: 30, optimal: 60, reason: 'Conditioning: recupero incompleto voluto' };
                }
                
                // Core/accessories
                if (/core|neck|collo|plank|ab/i.test(name)) {
                    return { min: 30, optimal: 45, reason: 'Accessori: recupero rapido' };
                }
                
                // Default
                return { min: 60, optimal: 90, reason: 'Default' };
            },
            
            /**
             * Corregge tempi di recupero insufficienti
             */
            enforce(exercises) {
                if (!Array.isArray(exercises)) {
                    return { exercises: [], fixes: [] };
                }
                
                const fixes = [];
                const corrected = exercises.map(ex => {
                    const currentRestRaw = String(ex?.rest || '60');
                    const currentRest = parseInt(currentRestRaw.replace(/\D/g, ''), 10) || 60;
                    
                    const requirements = this.getMinimumRest(ex);
                    
                    if (currentRest < requirements.min) {
                        fixes.push({
                            type: 'rest_correction',
                            severity: 'medium',
                            exercise: ex.name,
                            was: currentRest,
                            now: requirements.optimal,
                            message: `${ex.name}: rest ${currentRest}s → ${requirements.optimal}s`,
                            reason: requirements.reason
                        });
                        
                        return { ...ex, rest: `${requirements.optimal}s` };
                    }
                    
                    return ex;
                });
                
                return { exercises: corrected, fixes };
            }
        },
        
        // ───────────────────────────────────────────────────────────
        // CONSTRAINT: Volume forza minimo
        // ───────────────────────────────────────────────────────────
        strengthVolume: {
            id: 'strength_volume',
            description: 'Volume forza deve rispettare chart di Prilepin',
            
            minimums: {
                // Per esercizio compound principale
                mainCompound: { sets: 3, reps: 4 },
                // Per accessori
                accessory: { sets: 2, reps: 6 }
            },
            
            /**
             * Identifica se è un compound principale
             */
            isMainCompound(exercise) {
                const name = String(exercise?.name || '').toLowerCase();
                return /^(back\s*)?squat|^deadlift|^bench\s*press|^overhead\s*press|^barbell\s*row/i.test(name) ||
                       /trap\s*bar|front\s*squat|military\s*press/i.test(name);
            },
            
            /**
             * Corregge volume insufficiente
             */
            enforce(exercises) {
                if (!Array.isArray(exercises)) {
                    return { exercises: [], fixes: [] };
                }
                
                const fixes = [];
                const corrected = exercises.map(ex => {
                    const type = String(ex?.type || '').toLowerCase();
                    
                    if (type !== 'strength') return ex;
                    
                    const isMain = this.isMainCompound(ex);
                    const minReq = isMain ? this.minimums.mainCompound : this.minimums.accessory;
                    
                    const currentSets = parseInt(String(ex?.sets || '0'), 10) || 0;
                    const currentReps = parseInt(String(ex?.reps || '0').replace(/\D/g, ''), 10) || 0;
                    
                    let correctedEx = { ...ex };
                    let needsFix = false;
                    
                    // Fix sets
                    if (currentSets < minReq.sets && currentSets > 0) {
                        correctedEx.sets = minReq.sets;
                        needsFix = true;
                    }
                    
                    // Fix reps (solo se troppo bassi E non è max strength voluto)
                    if (currentReps < minReq.reps && currentReps > 0 && currentReps < 3) {
                        // Solo per principianti, non forzare reps alti
                        // Max strength (1-3) è valido per avanzati
                    }
                    
                    if (needsFix) {
                        fixes.push({
                            type: 'volume_correction',
                            severity: 'medium',
                            exercise: ex.name,
                            was: { sets: currentSets, reps: currentReps },
                            now: { sets: correctedEx.sets, reps: correctedEx.reps },
                            message: `${ex.name}: volume aumentato per rispettare chart Prilepin`,
                            isMainCompound: isMain
                        });
                    }
                    
                    return correctedEx;
                });
                
                return { exercises: corrected, fixes };
            }
        },
        
        // ───────────────────────────────────────────────────────────
        // CONSTRAINT: Protocollo collo (Boxe-specific)
        // ───────────────────────────────────────────────────────────
        neckProtocol: {
            id: 'neck_protocol',
            description: 'Protocollo collo deve essere reps-based, non a tempo',
            
            /**
             * Corregge esercizi collo da tempo a reps
             */
            enforce(exercises, sport) {
                if (sport !== 'boxe') {
                    return { exercises, fixes: [] };
                }
                
                if (!Array.isArray(exercises)) {
                    return { exercises: [], fixes: [] };
                }
                
                const fixes = [];
                const corrected = exercises.map(ex => {
                    const name = String(ex?.name || '').toLowerCase();
                    const reps = String(ex?.reps || '').toLowerCase();
                    
                    if (!/neck|collo/i.test(name)) return ex;
                    
                    // Se è a tempo (min, work, round), converti a reps
                    // Include anche pattern nel nome come "4x3min work"
                    const isTimeFormat = /min|work|round/i.test(reps) || /\d+x\d+min|work/i.test(name);
                    
                    if (isTimeFormat) {
                        fixes.push({
                            type: 'neck_protocol_fix',
                            severity: 'high',
                            exercise: ex.name?.substring(0, 40),
                            was: `${ex.sets}x${reps}`,
                            now: '3x15 per direzione',
                            message: `Collo: formato tempo → reps (3x15) - protocollo sicuro`,
                            reason: 'Protocollo collo a tempo aumenta rischio infortunio cervicale'
                        });
                        
                        return {
                            ...ex,
                            name: 'Neck Strengthening (Flexion, Extension, Lateral)',
                            sets: 3,
                            reps: '15',
                            rest: '90s',  // 90s per recupero adeguato del collo
                            type: 'hypertrophy'
                        };
                    }
                    
                    // Anche se già in formato reps, assicura rest=90s per collo
                    const currentRest = String(ex.rest || '');
                    if (!/^90|^120|^180/.test(currentRest.replace(/\D/g, ''))) {
                        fixes.push({
                            type: 'neck_rest_fix',
                            severity: 'medium',
                            exercise: ex.name?.substring(0, 40),
                            was: currentRest,
                            now: '90s',
                            message: `Collo: rest ${currentRest} → 90s (recupero adeguato)`,
                            reason: 'Esercizi collo richiedono minimo 90s di recupero'
                        });
                        return { ...ex, rest: '90s' };
                    }
                    
                    return ex;
                });
                
                return { exercises: corrected, fixes };
            }
        },
        
        // ───────────────────────────────────────────────────────────
        // CONSTRAINT: Boxing conditioning volume
        // ───────────────────────────────────────────────────────────
        boxingConditioningVolume: {
            id: 'boxing_conditioning_volume',
            description: 'Volume conditioning boxe non deve essere eccessivo',
            
            /**
             * Limita round eccessivi per shadow boxing e heavy bag
             */
            enforce(exercises, sport) {
                if (!/box|pugilato/i.test(String(sport || ''))) {
                    return { exercises, fixes: [] };
                }
                
                if (!Array.isArray(exercises)) {
                    return { exercises: [], fixes: [] };
                }
                
                const fixes = [];
                const corrected = exercises.map(ex => {
                    const name = String(ex?.name || '').toLowerCase();
                    const originalName = String(ex?.name || '');
                    const sets = parseInt(String(ex?.sets || '3'), 10);
                    const reps = String(ex?.reps || '');
                    
                    // Shadow Boxing: max 4 round (4x2-3min = 8-12min totali)
                    if (/shadow\s*box/i.test(name)) {
                        // Controlla se il nome contiene "X round" e estrai il numero
                        const roundMatch = name.match(/(\d+)\s*round/i);
                        const effectiveSets = roundMatch ? parseInt(roundMatch[1], 10) : sets;
                        
                        if (effectiveSets > 4) {
                            const newSets = 3;
                            // Aggiorna anche il nome se contiene "X round"
                            let newName = originalName;
                            if (roundMatch) {
                                newName = originalName.replace(/(\d+)\s*round/i, `${newSets} round`);
                            }
                            
                            fixes.push({
                                type: 'shadow_volume_fix',
                                severity: 'medium',
                                exercise: originalName.substring(0, 40),
                                was: effectiveSets,
                                now: newSets,
                                message: `Shadow Boxing: ${effectiveSets} round → ${newSets} round (max 4, evita overuse)`
                            });
                            return { ...ex, sets: newSets, name: newName };
                        }
                    }
                    
                    // Heavy Bag: max 4 round (include "X round" nel nome)
                    if (/heavy\s*bag/i.test(name)) {
                        // Controlla se il nome contiene "X round" e estrai il numero
                        const roundMatch = name.match(/(\d+)\s*round/i);
                        const effectiveSets = roundMatch ? parseInt(roundMatch[1], 10) : sets;
                        
                        if (effectiveSets > 4) {
                            const newSets = 3;
                            // Aggiorna anche il nome se contiene "X round"
                            let newName = originalName;
                            if (roundMatch) {
                                newName = originalName.replace(/(\d+)\s*round/i, `${newSets} round`);
                            }
                            
                            fixes.push({
                                type: 'heavybag_volume_fix',
                                severity: 'medium',
                                exercise: originalName.substring(0, 40),
                                was: effectiveSets,
                                now: newSets,
                                message: `Heavy Bag: ${effectiveSets} round → ${newSets} round (max 4)`
                            });
                            return { ...ex, sets: newSets, name: newName };
                        }
                    }
                    
                    // Boxing Circuit: max 6 round
                    if (/boxing\s*circuit|circuit.*box/i.test(name)) {
                        // Cattura sia "X round" che "Xx3min" pattern
                        const roundMatch = name.match(/(\d+)\s*round/i);
                        const xMinMatch = originalName.match(/(\d+)\s*x\s*\d+\s*min/i);
                        const nameRounds = roundMatch ? parseInt(roundMatch[1], 10) : 
                                          xMinMatch ? parseInt(xMinMatch[1], 10) : null;
                        
                        // Se il nome indica più round di sets, riduci il limite
                        let effectiveSets = nameRounds || sets;
                        
                        if (effectiveSets > 6) {
                            const newSets = 4;
                            let newName = originalName;
                            if (roundMatch) {
                                newName = originalName.replace(/(\d+)\s*round/i, `${newSets} round`);
                            } else if (xMinMatch) {
                                // Sostituisci "6x3min" con "4x3min"
                                newName = originalName.replace(/(\d+)(\s*x\s*\d+\s*min)/i, `${newSets}$2`);
                            }
                            
                            fixes.push({
                                type: 'circuit_volume_fix',
                                severity: 'medium',
                                exercise: originalName.substring(0, 40),
                                was: effectiveSets,
                                now: newSets,
                                message: `Boxing Circuit: ${effectiveSets} round → ${newSets} round (limite per sessione)`
                            });
                            return { ...ex, sets: newSets, name: newName };
                        }
                        
                        // Sincronizza nome con sets se diversi (es: nome dice 6x3min ma sets=3)
                        if (nameRounds && nameRounds !== sets) {
                            let syncedName = originalName;
                            if (roundMatch) {
                                syncedName = originalName.replace(/(\d+)\s*round/i, `${sets} round`);
                            } else if (xMinMatch) {
                                syncedName = originalName.replace(/(\d+)(\s*x\s*\d+\s*min)/i, `${sets}$2`);
                            }
                            
                            fixes.push({
                                type: 'circuit_name_sync',
                                severity: 'low',
                                exercise: originalName.substring(0, 40),
                                was: `nome: ${nameRounds} round, sets: ${sets}`,
                                now: `${sets}x (sincronizzato)`,
                                message: `Boxing Circuit: sincronizzato nome con sets (${sets} round)`
                            });
                            return { ...ex, name: syncedName };
                        }
                    }
                    
                    return ex;
                });
                
                return { exercises: corrected, fixes };
            }
        },
        
        // ───────────────────────────────────────────────────────────
        // CONSTRAINT: Warm-up minimo
        // ───────────────────────────────────────────────────────────
        warmupMinimum: {
            id: 'warmup_minimum',
            description: 'Warm-up deve essere almeno 8-10 minuti',
            
            /**
             * Verifica e corregge warm-up insufficiente
             */
            enforce(exercises) {
                if (!Array.isArray(exercises) || exercises.length === 0) {
                    return { exercises, fixes: [] };
                }
                
                const firstEx = exercises[0];
                const name = String(firstEx?.name || '').toLowerCase();
                const reps = String(firstEx?.reps || '').toLowerCase();
                
                // Check if first exercise is warmup
                if (!/warm|dynamic|activation|mobility/i.test(name)) {
                    // No warmup found, but we don't add one (AI should have)
                    return {
                        exercises,
                        fixes: [{
                            type: 'warmup_missing',
                            severity: 'high',
                            message: 'ATTENZIONE: Warm-up non rilevato come primo esercizio',
                            suggestion: 'Aggiungere Dynamic Warm-up 10-12 min'
                        }]
                    };
                }
                
                // Check warmup duration
                const durationMatch = reps.match(/(\d+)\s*min/i);
                if (durationMatch) {
                    const duration = parseInt(durationMatch[1], 10);
                    if (duration < 8) {
                        const corrected = [...exercises];
                        corrected[0] = { ...firstEx, reps: '10 min' };
                        
                        return {
                            exercises: corrected,
                            fixes: [{
                                type: 'warmup_duration',
                                severity: 'medium',
                                was: duration,
                                now: 10,
                                message: `Warm-up: durata aumentata da ${duration} a 10 minuti`
                            }]
                        };
                    }
                }
                
                return { exercises, fixes: [] };
            }
        },
        
        // ───────────────────────────────────────────────────────────
        // CONSTRAINT: Warm-up consolidation (rimuovi duplicati)
        // ───────────────────────────────────────────────────────────
        warmupConsolidation: {
            id: 'warmup_consolidation',
            description: 'Consolida warm-up multipli in uno solo',
            
            enforce(exercises) {
                if (!Array.isArray(exercises) || exercises.length < 3) {
                    return { exercises, fixes: [] };
                }
                
                // Trova quanti warmup consecutivi ci sono all'inizio
                let warmupCount = 0;
                for (let i = 0; i < exercises.length; i++) {
                    const name = String(exercises[i]?.name || '').toLowerCase();
                    if (/warm|dynamic|activation|mobility|stretch|greatest/i.test(name) && 
                        !/static.*stretch|cool/i.test(name)) {
                        warmupCount++;
                    } else {
                        break;
                    }
                }
                
                // Se ci sono 2+ warmup, consolida
                if (warmupCount >= 2) {
                    const firstWarmup = exercises[0];
                    const consolidated = [
                        { 
                            ...firstWarmup, 
                            name: 'Dynamic Warm-up & Mobility',
                            sets: 1,
                            reps: '10-12 minutes',
                            rest: 'N/A',
                            type: 'conditioning'
                        },
                        ...exercises.slice(warmupCount)
                    ];
                    
                    return {
                        exercises: consolidated,
                        fixes: [{
                            type: 'warmup_consolidation',
                            severity: 'low',
                            was: warmupCount,
                            now: 1,
                            message: `Warm-up: ${warmupCount} esercizi consolidati in 1 (evita ridondanza)`
                        }]
                    };
                }
                
                return { exercises, fixes: [] };
            }
        },
        
        // ───────────────────────────────────────────────────────────
        // CONSTRAINT: Cool-down presenza
        // ───────────────────────────────────────────────────────────
        cooldownPresence: {
            id: 'cooldown_presence',
            description: 'Cool-down deve essere presente e a bassa intensità',
            
            enforce(exercises) {
                if (!Array.isArray(exercises) || exercises.length === 0) {
                    return { exercises, fixes: [] };
                }
                
                const lastEx = exercises[exercises.length - 1];
                const name = String(lastEx?.name || '').toLowerCase();
                
                // Check if last exercise is cooldown
                const isCooldown = /cool|static.*stretch|recovery|walk.*stretch/i.test(name);
                
                if (!isCooldown) {
                    return {
                        exercises,
                        fixes: [{
                            type: 'cooldown_missing',
                            severity: 'medium',
                            message: 'ATTENZIONE: Cool-down non rilevato. Aggiungere 5 min stretching statico.',
                            suggestion: 'Aggiungere Cool-down: 5min walk + static stretching'
                        }]
                    };
                }
                
                // Check that cooldown doesn't say "high intensity"
                if (/high.*intensity|moderate.*high/i.test(name)) {
                    const corrected = [...exercises];
                    const fixedName = name.replace(/high.*intensity|moderate.*high/gi, 'low intensity');
                    corrected[corrected.length - 1] = { ...lastEx, name: `Cool-down: 5min walk + static stretching` };
                    
                    return {
                        exercises: corrected,
                        fixes: [{
                            type: 'cooldown_intensity',
                            severity: 'high',
                            message: 'Cool-down corretto: rimossa "high intensity" (deve essere bassa)',
                            was: lastEx.name,
                            now: corrected[corrected.length - 1].name
                        }]
                    };
                }
                
                return { exercises, fixes: [] };
            }
        },
        
        // ───────────────────────────────────────────────────────────
        // CONSTRAINT: Superset structure
        // ───────────────────────────────────────────────────────────
        supersetStructure: {
            id: 'superset_structure',
            description: 'Superset devono avere rest=0 tra A1/A2, rest dopo coppia',
            
            enforce(exercises) {
                if (!Array.isArray(exercises)) {
                    return { exercises: [], fixes: [] };
                }
                
                const fixes = [];
                const corrected = exercises.map((ex, idx) => {
                    const name = String(ex?.name || '');
                    
                    // Detect superset A1 - multiple patterns:
                    // "A1: Exercise (superset)", "Exercise (superset A1)", "A1) Exercise"
                    const isA1 = /^A1[:\s]/i.test(name) || /\(superset\s*A1\)/i.test(name) || /A1\)/i.test(name);
                    
                    console.log(`🔧 Superset check: "${name.substring(0,30)}" → isA1=${isA1}, rest=${ex?.rest}`);
                    
                    if (isA1) {
                        const currentRest = String(ex?.rest || '60s');
                        const currentRestNum = parseInt(currentRest.replace(/\D/g, ''), 10) || 60;
                        
                        console.log(`🔧 A1 detected: rest=${currentRest} (${currentRestNum}), need fix: ${currentRestNum > 30}`);
                        
                        // A1 deve avere rest basso (0-30s) per passare subito ad A2
                        if (currentRestNum > 30) {
                            fixes.push({
                                type: 'superset_a1_rest',
                                severity: 'medium',
                                exercise: name.substring(0, 40),
                                was: currentRest,
                                now: '0s',
                                message: `Superset A1: rest ${currentRest} → 0s (passare subito ad A2)`
                            });
                            return { ...ex, rest: '0s' };
                        }
                    }
                    
                    // Detect superset A2 - multiple patterns
                    const isA2 = /^A2[:\s]/i.test(name) || /\(superset\s*A2\)/i.test(name) || /A2\)/i.test(name);
                    
                    if (isA2) {
                        const currentRestRaw = String(ex?.rest || '60s');
                        const currentRest = parseInt(currentRestRaw.replace(/\D/g, ''), 10) || 60;
                        
                        // A2 dovrebbe avere 90-120s (recupero prima di ripetere coppia)
                        if (currentRest < 90) {
                            fixes.push({
                                type: 'superset_a2_rest',
                                severity: 'low',
                                exercise: name.substring(0, 40),
                                was: currentRestRaw,
                                now: '120s',
                                message: `Superset A2: rest ${currentRestRaw} → 120s (recupero completo)`
                            });
                            return { ...ex, rest: '120s' };
                        }
                    }
                    
                    return ex;
                });
                
                return { exercises: corrected, fixes };
            }
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // SOFT CONSTRAINTS - Raccomandazioni (warning, non correzioni)
    // ═══════════════════════════════════════════════════════════════
    
    const SOFT_CONSTRAINTS = {
        volumeBalance: {
            id: 'volume_balance',
            description: 'Bilanciamento volume push/pull',
            
            analyze(exercises) {
                let pushVolume = 0;
                let pullVolume = 0;
                
                exercises.forEach(ex => {
                    const name = String(ex?.name || '').toLowerCase();
                    const sets = parseInt(String(ex?.sets || '0'), 10) || 0;
                    
                    if (/bench|press|push|dip|fly/i.test(name)) {
                        pushVolume += sets;
                    }
                    if (/row|pull|chin|lat|rear.*delt|face.*pull/i.test(name)) {
                        pullVolume += sets;
                    }
                });
                
                const ratio = pushVolume > 0 ? pullVolume / pushVolume : 1;
                
                return {
                    pushVolume,
                    pullVolume,
                    ratio: Math.round(ratio * 100) / 100,
                    balanced: ratio >= 0.8 && ratio <= 1.2,
                    warning: ratio < 0.8 ? 'Pull volume basso rispetto a push' :
                             ratio > 1.2 ? 'Push volume basso rispetto a pull' : null
                };
            }
        },
        
        exerciseVariety: {
            id: 'exercise_variety',
            description: 'Varietà pattern di movimento',
            
            analyze(exercises) {
                const patterns = new Set();
                const classifier = window.ScientificModels?.exercises || null;
                
                exercises.forEach(ex => {
                    const name = String(ex?.name || '').toLowerCase();
                    
                    if (/squat|lunge|leg.*press/i.test(name)) patterns.add('squat');
                    if (/deadlift|rdl|hinge|hip.*thrust/i.test(name)) patterns.add('hinge');
                    if (/bench|push/i.test(name)) patterns.add('push_horizontal');
                    if (/overhead|shoulder.*press/i.test(name)) patterns.add('push_vertical');
                    if (/row/i.test(name)) patterns.add('pull_horizontal');
                    if (/pull.*up|chin.*up|lat/i.test(name)) patterns.add('pull_vertical');
                });
                
                return {
                    patterns: Array.from(patterns),
                    count: patterns.size,
                    diverse: patterns.size >= 4,
                    warning: patterns.size < 3 ? 'Pochi pattern di movimento - aggiungere varietà' : null
                };
            }
        }
    };
    
    // ═══════════════════════════════════════════════════════════════
    // MAIN ENFORCEMENT FUNCTION
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Applica TUTTI i constraint a un workout
     * @param {Object} workout - Workout generato dall'AI
     * @param {string} sport - Sport dell'atleta
     * @returns {Object} { workout: correctedWorkout, report: validationReport }
     */
    function enforceAll(workout, sport = 'palestra') {
        if (!workout || !Array.isArray(workout.exercises)) {
            return {
                workout,
                report: { valid: false, error: 'Workout invalido o senza esercizi' }
            };
        }
        
        let exercises = [...workout.exercises];
        const allFixes = [];
        const warnings = [];
        
        // 1. Ordine sessione (HARD)
        const orderResult = HARD_CONSTRAINTS.sessionOrder.enforce(exercises);
        exercises = orderResult.exercises;
        allFixes.push(...orderResult.fixes);
        
        // 2. Tempi di recupero (HARD)
        const restResult = HARD_CONSTRAINTS.restPeriods.enforce(exercises);
        exercises = restResult.exercises;
        allFixes.push(...restResult.fixes);
        
        // 3. Volume forza (HARD)
        const volumeResult = HARD_CONSTRAINTS.strengthVolume.enforce(exercises);
        exercises = volumeResult.exercises;
        allFixes.push(...volumeResult.fixes);
        
        // 4. Protocollo collo - solo per boxe (HARD)
        const neckResult = HARD_CONSTRAINTS.neckProtocol.enforce(exercises, sport);
        exercises = neckResult.exercises;
        allFixes.push(...neckResult.fixes);
        
        // 4b. Boxing conditioning volume (HARD)
        const boxingVolResult = HARD_CONSTRAINTS.boxingConditioningVolume.enforce(exercises, sport);
        exercises = boxingVolResult.exercises;
        allFixes.push(...boxingVolResult.fixes);
        
        // 5. Warm-up minimo (HARD)
        const warmupResult = HARD_CONSTRAINTS.warmupMinimum.enforce(exercises);
        exercises = warmupResult.exercises;
        allFixes.push(...warmupResult.fixes);
        
        // 5b. Warm-up consolidation (rimuovi duplicati)
        const warmupConsolidationResult = HARD_CONSTRAINTS.warmupConsolidation.enforce(exercises);
        exercises = warmupConsolidationResult.exercises;
        allFixes.push(...warmupConsolidationResult.fixes);
        
        // 6. Cool-down (HARD)
        const cooldownResult = HARD_CONSTRAINTS.cooldownPresence.enforce(exercises);
        exercises = cooldownResult.exercises;
        allFixes.push(...cooldownResult.fixes);
        
        // 7. Superset structure (HARD) - DEVE essere ULTIMO per override rest times
        const supersetResult = HARD_CONSTRAINTS.supersetStructure.enforce(exercises);
        exercises = supersetResult.exercises;
        allFixes.push(...supersetResult.fixes);
        
        // SOFT CONSTRAINTS (solo analisi)
        const balanceAnalysis = SOFT_CONSTRAINTS.volumeBalance.analyze(exercises);
        if (balanceAnalysis.warning) {
            warnings.push({ type: 'balance', message: balanceAnalysis.warning, data: balanceAnalysis });
        }
        
        const varietyAnalysis = SOFT_CONSTRAINTS.exerciseVariety.analyze(exercises);
        if (varietyAnalysis.warning) {
            warnings.push({ type: 'variety', message: varietyAnalysis.warning, data: varietyAnalysis });
        }
        
        // Calcola durata corretta
        const estimatedDuration = calculateDuration(exercises);
        
        // Report finale
        const report = {
            valid: true,
            constraintsApplied: allFixes.length,
            fixes: allFixes,
            warnings,
            analysis: {
                balance: balanceAnalysis,
                variety: varietyAnalysis
            },
            summary: allFixes.length === 0 
                ? '✅ Workout conforme a tutte le regole scientifiche'
                : `⚠️ ${allFixes.length} correzioni applicate per conformità scientifica`
        };
        
        return {
            workout: {
                ...workout,
                exercises,
                estimated_duration_minutes: estimatedDuration,
                _constraintEngine: {
                    version: VERSION,
                    validated: true,
                    fixesApplied: allFixes.length
                }
            },
            report
        };
    }
    
    /**
     * Calcola durata stimata workout
     */
    function calculateDuration(exercises) {
        let totalSeconds = 0;
        
        exercises.forEach(ex => {
            const sets = parseInt(String(ex?.sets || '1'), 10) || 1;
            const repsRaw = String(ex?.reps || '10');
            const restRaw = String(ex?.rest || '60');
            
            // Parse reps
            let workTime;
            if (/min/i.test(repsRaw)) {
                const mins = parseInt(repsRaw.replace(/\D/g, ''), 10) || 3;
                workTime = mins * 60;
            } else {
                const reps = parseInt(repsRaw.replace(/\D/g, ''), 10) || 10;
                workTime = reps * 3; // ~3 secondi per rep
            }
            
            // Parse rest
            const restSeconds = parseInt(restRaw.replace(/\D/g, ''), 10) || 60;
            
            // Total per exercise: sets * (work + rest)
            totalSeconds += sets * (workTime + restSeconds);
        });
        
        return Math.round(totalSeconds / 60);
    }
    
    /**
     * Quick validation senza correzioni (per preview)
     */
    function validate(workout, sport = 'palestra') {
        const result = enforceAll(workout, sport);
        return {
            isValid: result.report.constraintsApplied === 0,
            issues: result.report.fixes.length,
            warnings: result.report.warnings.length,
            details: result.report
        };
    }
    
    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════
    
    console.log(`⚙️ ConstraintEngine v${VERSION} loaded - Deterministic workout validation ready`);
    
    return {
        VERSION,
        
        // Main functions
        enforceAll,
        validate,
        
        // Individual constraints (for testing)
        constraints: {
            hard: HARD_CONSTRAINTS,
            soft: SOFT_CONSTRAINTS
        },
        
        // Utilities
        calculateDuration,
        
        // Helper for debugging
        classifyExercise: (ex) => HARD_CONSTRAINTS.sessionOrder.classifyExercise(ex),
        getMinimumRest: (ex) => HARD_CONSTRAINTS.restPeriods.getMinimumRest(ex)
    };
})();
