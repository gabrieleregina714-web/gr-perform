/**
 * PRE-WORKOUT CHECK - GR Perform
 * 
 * Raccoglie dati di readiness prima della generazione del workout:
 * - Qualità sonno
 * - Livello stress
 * - Dolori/fastidi
 * - Energia percepita
 * - HRV/Readiness (se disponibile da wearable)
 * 
 * Questi dati influenzano la generazione del workout in tempo reale.
 * 
 * @version 1.0.0
 * @date 2024-12-19
 */

window.PreWorkoutCheck = (function() {
    'use strict';

    const STORAGE_KEY = 'grperform_preworkout_checks';

    // ============================================
    // CONFIGURAZIONE PARAMETRI
    // ============================================
    
    const CHECK_PARAMETERS = {
        sleep: {
            name: 'Qualità Sonno',
            icon: '😴',
            question: 'Come hai dormito stanotte?',
            scale: [
                { value: 1, label: 'Malissimo', emoji: '😫', impact: -30 },
                { value: 2, label: 'Male', emoji: '😞', impact: -20 },
                { value: 3, label: 'Così così', emoji: '😐', impact: -10 },
                { value: 4, label: 'Bene', emoji: '🙂', impact: 0 },
                { value: 5, label: 'Benissimo', emoji: '😊', impact: 10 }
            ],
            weight: 0.3 // 30% del punteggio finale
        },
        
        stress: {
            name: 'Livello Stress',
            icon: '🧠',
            question: 'Quanto sei stressato oggi?',
            scale: [
                { value: 1, label: 'Molto stressato', emoji: '🤯', impact: -25 },
                { value: 2, label: 'Stressato', emoji: '😰', impact: -15 },
                { value: 3, label: 'Normale', emoji: '😐', impact: 0 },
                { value: 4, label: 'Rilassato', emoji: '😌', impact: 5 },
                { value: 5, label: 'Molto rilassato', emoji: '🧘', impact: 10 }
            ],
            weight: 0.2
        },
        
        energy: {
            name: 'Energia',
            icon: '⚡',
            question: 'Come ti senti energeticamente?',
            scale: [
                { value: 1, label: 'Sfinito', emoji: '🪫', impact: -30 },
                { value: 2, label: 'Stanco', emoji: '😩', impact: -20 },
                { value: 3, label: 'Normale', emoji: '😐', impact: 0 },
                { value: 4, label: 'Carico', emoji: '💪', impact: 10 },
                { value: 5, label: 'Esplosivo', emoji: '🚀', impact: 15 }
            ],
            weight: 0.25
        },
        
        soreness: {
            name: 'Dolori Muscolari',
            icon: '🦵',
            question: 'Hai dolori o DOMS?',
            scale: [
                { value: 1, label: 'Dolore forte', emoji: '😖', impact: -25 },
                { value: 2, label: 'DOMS intensi', emoji: '😣', impact: -15 },
                { value: 3, label: 'Leggeri DOMS', emoji: '😬', impact: -5 },
                { value: 4, label: 'Nessun dolore', emoji: '👍', impact: 0 },
                { value: 5, label: 'Fresco', emoji: '✨', impact: 5 }
            ],
            weight: 0.15
        },
        
        motivation: {
            name: 'Motivazione',
            icon: '🔥',
            question: 'Quanto sei motivato ad allenarti?',
            scale: [
                { value: 1, label: 'Zero voglia', emoji: '😒', impact: -15 },
                { value: 2, label: 'Poca voglia', emoji: '😕', impact: -10 },
                { value: 3, label: 'Normale', emoji: '😐', impact: 0 },
                { value: 4, label: 'Motivato', emoji: '💪', impact: 5 },
                { value: 5, label: 'Super carico', emoji: '🔥', impact: 10 }
            ],
            weight: 0.1
        }
    };

    // Soglie di readiness
    const READINESS_THRESHOLDS = {
        low: { max: 40, recommendation: 'deload', volumeMultiplier: 0.6, intensityMultiplier: 0.7 },
        belowAverage: { max: 55, recommendation: 'light', volumeMultiplier: 0.75, intensityMultiplier: 0.8 },
        average: { max: 70, recommendation: 'normal', volumeMultiplier: 0.9, intensityMultiplier: 0.95 },
        good: { max: 85, recommendation: 'push', volumeMultiplier: 1.0, intensityMultiplier: 1.0 },
        excellent: { max: 100, recommendation: 'peak', volumeMultiplier: 1.1, intensityMultiplier: 1.05 }
    };

    // ============================================
    // STORAGE
    // ============================================
    
    function loadChecks() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.warn('Errore caricamento pre-workout checks:', e);
            return {};
        }
    }
    
    function saveChecks(checks) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
        } catch (e) {
            console.warn('Errore salvataggio pre-workout checks:', e);
        }
    }

    // ============================================
    // LOGICA CHECK
    // ============================================
    
    /**
     * Salva un check pre-workout
     */
    function saveCheck(athleteId, checkData) {
        const { sleep, stress, energy, soreness, motivation, notes, painAreas } = checkData;
        
        // Calcola readiness score
        let totalScore = 0;
        let totalWeight = 0;
        
        const responses = {};
        
        Object.entries(CHECK_PARAMETERS).forEach(([key, param]) => {
            const value = checkData[key];
            if (value !== undefined && value !== null) {
                const scaleItem = param.scale.find(s => s.value === value);
                if (scaleItem) {
                    // Score base: (value / 5) * 100 + impact
                    const baseScore = (value / 5) * 100;
                    totalScore += (baseScore + scaleItem.impact) * param.weight;
                    totalWeight += param.weight;
                    
                    responses[key] = {
                        value,
                        label: scaleItem.label,
                        emoji: scaleItem.emoji,
                        impact: scaleItem.impact
                    };
                }
            }
        });
        
        const readinessScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;
        
        // Determina livello
        let readinessLevel = 'average';
        let recommendation = READINESS_THRESHOLDS.average;
        
        for (const [level, config] of Object.entries(READINESS_THRESHOLDS)) {
            if (readinessScore <= config.max) {
                readinessLevel = level;
                recommendation = config;
                break;
            }
        }
        
        const check = {
            id: `check_${Date.now()}`,
            athleteId,
            date: new Date().toISOString(),
            dateShort: new Date().toISOString().split('T')[0],
            responses,
            readinessScore,
            readinessLevel,
            recommendation: recommendation.recommendation,
            volumeMultiplier: recommendation.volumeMultiplier,
            intensityMultiplier: recommendation.intensityMultiplier,
            notes: notes || '',
            painAreas: painAreas || []
        };
        
        // Salva
        const all = loadChecks();
        if (!all[athleteId]) all[athleteId] = [];
        all[athleteId].push(check);
        
        // Mantieni solo ultimi 90 giorni
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 90);
        all[athleteId] = all[athleteId].filter(c => new Date(c.date) >= cutoff);
        
        saveChecks(all);
        
        console.log('📋 Pre-workout check salvato:', readinessScore, '/', 100, '-', readinessLevel);
        
        return { success: true, check };
    }

    /**
     * Ottieni l'ultimo check di oggi
     */
    function getTodayCheck(athleteId) {
        const all = loadChecks();
        const athleteChecks = all[athleteId] || [];
        
        const today = new Date().toISOString().split('T')[0];
        
        // Trova l'ultimo check di oggi
        const todayChecks = athleteChecks.filter(c => c.dateShort === today);
        
        return todayChecks.length > 0 ? todayChecks[todayChecks.length - 1] : null;
    }

    /**
     * Genera contesto per il prompt AI
     */
    function generatePromptContext(athleteId) {
        const todayCheck = getTodayCheck(athleteId);
        
        if (!todayCheck) return '';
        
        let text = '\n\n📋 CHECK PRE-WORKOUT DI OGGI:';
        text += `\n   Readiness Score: ${todayCheck.readinessScore}/100 (${todayCheck.readinessLevel})`;
        
        // Dettaglio risposte
        Object.entries(todayCheck.responses).forEach(([key, response]) => {
            const param = CHECK_PARAMETERS[key];
            if (param) {
                text += `\n   ${param.icon} ${param.name}: ${response.emoji} ${response.label}`;
            }
        });
        
        // Aree dolorose
        if (todayCheck.painAreas && todayCheck.painAreas.length > 0) {
            text += `\n   ⚠️ Aree con fastidio: ${todayCheck.painAreas.join(', ')}`;
        }
        
        // Raccomandazione
        text += '\n\n   📊 ADATTAMENTO RICHIESTO:';
        
        switch (todayCheck.recommendation) {
            case 'deload':
                text += '\n   ⚠️ READINESS BASSA - Riduci significativamente volume e intensità';
                text += '\n   - Volume: max 60% del normale';
                text += '\n   - Intensità: max 70% del normale';
                text += '\n   - Evita esercizi complessi, preferisci mobility e recupero attivo';
                break;
            case 'light':
                text += '\n   🔻 READINESS SOTTO MEDIA - Allenamento leggero consigliato';
                text += '\n   - Volume: max 75% del normale';
                text += '\n   - Intensità: max 80% del normale';
                break;
            case 'normal':
                text += '\n   ➡️ READINESS NELLA NORMA - Allenamento standard';
                text += '\n   - Volume: 90% del normale';
                text += '\n   - Intensità: 95% del normale';
                break;
            case 'push':
                text += '\n   ✅ READINESS BUONA - Puoi spingere';
                text += '\n   - Volume e intensità normali o leggermente sopra';
                break;
            case 'peak':
                text += '\n   🔥 READINESS ECCELLENTE - Giornata per dare il massimo!';
                text += '\n   - Puoi aumentare volume/intensità del 5-10%';
                text += '\n   - Buon giorno per PR o lavori impegnativi';
                break;
        }
        
        return text;
    }

    /**
     * Ottieni modificatori per PeriodizationEngine
     */
    function getModifiers(athleteId) {
        const todayCheck = getTodayCheck(athleteId);
        
        if (!todayCheck) {
            return {
                hasCheck: false,
                volumeMultiplier: 1.0,
                intensityMultiplier: 1.0,
                recommendation: 'normal'
            };
        }
        
        return {
            hasCheck: true,
            readinessScore: todayCheck.readinessScore,
            readinessLevel: todayCheck.readinessLevel,
            volumeMultiplier: todayCheck.volumeMultiplier,
            intensityMultiplier: todayCheck.intensityMultiplier,
            recommendation: todayCheck.recommendation,
            painAreas: todayCheck.painAreas || []
        };
    }

    /**
     * Ottieni trend degli ultimi N giorni
     */
    function getReadinessTrend(athleteId, days = 7) {
        const all = loadChecks();
        const athleteChecks = all[athleteId] || [];
        
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        const recentChecks = athleteChecks
            .filter(c => new Date(c.date) >= cutoff)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (recentChecks.length === 0) {
            return { hasTrend: false };
        }
        
        const scores = recentChecks.map(c => c.readinessScore);
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        
        // Trend: confronta prima metà vs seconda metà
        let trend = 'stable';
        if (scores.length >= 4) {
            const mid = Math.floor(scores.length / 2);
            const firstHalf = scores.slice(0, mid);
            const secondHalf = scores.slice(mid);
            
            const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
            const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
            
            if (avgSecond > avgFirst + 5) trend = 'improving';
            else if (avgSecond < avgFirst - 5) trend = 'declining';
        }
        
        return {
            hasTrend: true,
            days: recentChecks.length,
            avgScore,
            minScore: Math.min(...scores),
            maxScore: Math.max(...scores),
            trend,
            checks: recentChecks
        };
    }

    // ============================================
    // UI HELPER - Genera HTML per modal check
    // ============================================
    
    function generateCheckFormHTML() {
        let html = '<div class="preworkout-check-form">';
        
        Object.entries(CHECK_PARAMETERS).forEach(([key, param]) => {
            html += `
                <div class="check-question" data-param="${key}">
                    <div class="check-question-header">
                        <span class="check-icon">${param.icon}</span>
                        <span class="check-question-text">${param.question}</span>
                    </div>
                    <div class="check-scale">
                        ${param.scale.map(s => `
                            <button type="button" class="scale-btn" data-value="${s.value}" title="${s.label}">
                                <span class="scale-emoji">${s.emoji}</span>
                                <span class="scale-label">${s.label}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        // Area dolori
        html += `
            <div class="check-question" data-param="painAreas">
                <div class="check-question-header">
                    <span class="check-icon">🎯</span>
                    <span class="check-question-text">Hai fastidio in qualche zona? (opzionale)</span>
                </div>
                <div class="pain-areas">
                    <label><input type="checkbox" value="spalla"> Spalla</label>
                    <label><input type="checkbox" value="gomito"> Gomito</label>
                    <label><input type="checkbox" value="polso"> Polso</label>
                    <label><input type="checkbox" value="schiena"> Schiena</label>
                    <label><input type="checkbox" value="anca"> Anca</label>
                    <label><input type="checkbox" value="ginocchio"> Ginocchio</label>
                    <label><input type="checkbox" value="caviglia"> Caviglia</label>
                </div>
            </div>
        `;
        
        html += '</div>';
        return html;
    }

    // ============================================
    // API PUBBLICA
    // ============================================
    
    return {
        save: saveCheck,
        getToday: getTodayCheck,
        generatePromptContext: generatePromptContext,
        getModifiers: getModifiers,
        getTrend: getReadinessTrend,
        generateFormHTML: generateCheckFormHTML,
        
        getParameters: function() {
            return { ...CHECK_PARAMETERS };
        },
        
        getThresholds: function() {
            return { ...READINESS_THRESHOLDS };
        },
        
        getAll: function(athleteId) {
            const all = loadChecks();
            return all[athleteId] || [];
        },
        
        clear: function(athleteId) {
            const all = loadChecks();
            delete all[athleteId];
            saveChecks(all);
        }
    };
})();

console.log('📋 PreWorkoutCheck caricato');
