/**
 * GR Perform - Quick Readiness Check
 * 
 * SUPERA IL COACH UMANO: Dialogo pre-allenamento strutturato,
 * raccoglie dati in tempo reale che il coach non può chiedere ogni volta.
 * 
 * Un coach umano non può chiedere 10 domande ogni sessione.
 * Questo sistema lo fa in 30 secondi con UI ottimizzata.
 */

window.QuickReadinessCheck = (function() {
    'use strict';

    const VERSION = '1.0';
    const STORAGE_KEY = 'gr_quick_readiness_v1';

    // Ultimo check per atleta
    let lastChecks = {};

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURAZIONE DOMANDE
    // ═══════════════════════════════════════════════════════════════
    
    const QUESTIONS = {
        overall: {
            id: 'overall',
            text: 'Come ti senti oggi in generale?',
            type: 'emoji',
            options: [
                { value: 1, emoji: '😫', label: 'Molto male' },
                { value: 2, emoji: '😕', label: 'Non bene' },
                { value: 3, emoji: '😐', label: 'Normale' },
                { value: 4, emoji: '🙂', label: 'Bene' },
                { value: 5, emoji: '💪', label: 'Ottimo!' }
            ]
        },
        sleep: {
            id: 'sleep',
            text: 'Come hai dormito stanotte?',
            type: 'slider',
            min: 3,
            max: 10,
            step: 0.5,
            unit: 'ore',
            defaultValue: 7
        },
        sleepQuality: {
            id: 'sleepQuality',
            text: 'Qualità del sonno?',
            type: 'stars',
            max: 5
        },
        stress: {
            id: 'stress',
            text: 'Livello di stress oggi?',
            type: 'slider',
            min: 1,
            max: 10,
            step: 1,
            labels: { 1: 'Zen', 5: 'Normale', 10: 'Altissimo' },
            defaultValue: 5,
            invertForReadiness: true // Alto stress = bassa readiness
        },
        soreness: {
            id: 'soreness',
            text: 'Hai dolori muscolari (DOMS)?',
            type: 'bodymap',
            options: [
                { value: 'none', label: 'Nessuno' },
                { value: 'legs', label: 'Gambe' },
                { value: 'back', label: 'Schiena' },
                { value: 'shoulders', label: 'Spalle' },
                { value: 'chest', label: 'Petto' },
                { value: 'arms', label: 'Braccia' },
                { value: 'core', label: 'Core' }
            ],
            multiselect: true
        },
        injury: {
            id: 'injury',
            text: 'Hai dolori/fastidi NON da allenamento?',
            type: 'yesno',
            followUp: {
                yes: {
                    id: 'injuryLocation',
                    text: 'Dove?',
                    type: 'text',
                    placeholder: 'es. ginocchio dx, spalla sx'
                }
            }
        },
        motivation: {
            id: 'motivation',
            text: 'Quanto sei motivato oggi?',
            type: 'emoji',
            options: [
                { value: 1, emoji: '😴', label: 'Zero voglia' },
                { value: 2, emoji: '🥱', label: 'Poca' },
                { value: 3, emoji: '😐', label: 'Normale' },
                { value: 4, emoji: '😊', label: 'Buona' },
                { value: 5, emoji: '🔥', label: 'On fire!' }
            ]
        },
        nutrition: {
            id: 'nutrition',
            text: 'Hai mangiato bene oggi?',
            type: 'quickselect',
            options: [
                { value: 1, label: 'A digiuno', icon: '🚫' },
                { value: 2, label: 'Poco', icon: '🍎' },
                { value: 3, label: 'Normale', icon: '🍽️' },
                { value: 4, label: 'Bene', icon: '✅' }
            ]
        },
        timeAvailable: {
            id: 'timeAvailable',
            text: 'Quanto tempo hai oggi?',
            type: 'quickselect',
            options: [
                { value: 30, label: '30 min', icon: '⚡' },
                { value: 45, label: '45 min', icon: '⏱️' },
                { value: 60, label: '60 min', icon: '🕐' },
                { value: 90, label: '90 min', icon: '💪' }
            ]
        }
    };

    // Preset di domande per situazioni specifiche
    const QUESTION_SETS = {
        quick: ['overall', 'soreness', 'timeAvailable'], // 3 domande, ~15 sec
        standard: ['overall', 'sleep', 'stress', 'soreness', 'motivation', 'timeAvailable'], // 6 domande, ~30 sec
        full: Object.keys(QUESTIONS) // Tutte le domande, ~60 sec
    };

    // ═══════════════════════════════════════════════════════════════
    // INIZIALIZZAZIONE
    // ═══════════════════════════════════════════════════════════════
    
    function init() {
        loadFromStorage();
        injectStyles();
        console.log('🎯 QuickReadinessCheck initialized');
    }

    function loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                lastChecks = JSON.parse(stored);
            }
        } catch (e) {
            console.warn('QuickReadinessCheck: Failed to load from storage', e);
        }
    }

    function saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(lastChecks));
        } catch (e) {
            console.warn('QuickReadinessCheck: Failed to save to storage', e);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // UI: Modal di check
    // ═══════════════════════════════════════════════════════════════
    
    function injectStyles() {
        if (document.getElementById('quick-readiness-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'quick-readiness-styles';
        style.textContent = `
            .qr-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: qrFadeIn 0.3s ease;
            }
            @keyframes qrFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .qr-modal {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 24px;
                width: min(500px, 95vw);
                max-height: 90vh;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                animation: qrSlideUp 0.4s ease;
            }
            @keyframes qrSlideUp {
                from { transform: translateY(40px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .qr-header {
                background: linear-gradient(90deg, #00D26A 0%, #00BCD4 100%);
                padding: 20px 24px;
                text-align: center;
            }
            .qr-header h2 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 700;
                color: #000;
            }
            .qr-header p {
                margin: 6px 0 0;
                font-size: 0.9rem;
                color: rgba(0,0,0,0.7);
            }
            .qr-progress {
                height: 4px;
                background: rgba(0,0,0,0.2);
            }
            .qr-progress-bar {
                height: 100%;
                background: #000;
                transition: width 0.3s ease;
            }
            .qr-body {
                padding: 24px;
                overflow-y: auto;
                max-height: 60vh;
            }
            .qr-question {
                text-align: center;
                animation: qrQuestionIn 0.3s ease;
            }
            @keyframes qrQuestionIn {
                from { transform: translateX(20px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .qr-question-text {
                font-size: 1.25rem;
                font-weight: 600;
                color: #fff;
                margin-bottom: 24px;
            }
            .qr-emoji-options {
                display: flex;
                justify-content: center;
                gap: 12px;
                flex-wrap: wrap;
            }
            .qr-emoji-btn {
                background: rgba(255,255,255,0.1);
                border: 2px solid transparent;
                border-radius: 16px;
                padding: 16px 20px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }
            .qr-emoji-btn:hover {
                background: rgba(255,255,255,0.15);
                transform: translateY(-2px);
            }
            .qr-emoji-btn.selected {
                border-color: #00D26A;
                background: rgba(0, 210, 106, 0.2);
            }
            .qr-emoji-btn .emoji {
                font-size: 2.5rem;
            }
            .qr-emoji-btn .label {
                font-size: 0.75rem;
                color: rgba(255,255,255,0.7);
            }
            .qr-slider-container {
                padding: 0 20px;
            }
            .qr-slider {
                width: 100%;
                height: 8px;
                -webkit-appearance: none;
                background: rgba(255,255,255,0.2);
                border-radius: 4px;
                outline: none;
            }
            .qr-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 28px;
                height: 28px;
                background: #00D26A;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 210, 106, 0.4);
            }
            .qr-slider-value {
                text-align: center;
                font-size: 2rem;
                font-weight: 700;
                color: #00D26A;
                margin-top: 16px;
            }
            .qr-slider-value .unit {
                font-size: 1rem;
                color: rgba(255,255,255,0.5);
            }
            .qr-stars {
                display: flex;
                justify-content: center;
                gap: 8px;
            }
            .qr-star {
                font-size: 2.5rem;
                cursor: pointer;
                color: rgba(255,255,255,0.3);
                transition: all 0.2s;
            }
            .qr-star:hover, .qr-star.active {
                color: #FFD700;
                transform: scale(1.1);
            }
            .qr-bodymap {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 10px;
            }
            .qr-bodymap-btn {
                background: rgba(255,255,255,0.1);
                border: 2px solid transparent;
                border-radius: 12px;
                padding: 12px 16px;
                color: #fff;
                cursor: pointer;
                transition: all 0.2s;
            }
            .qr-bodymap-btn:hover {
                background: rgba(255,255,255,0.15);
            }
            .qr-bodymap-btn.selected {
                border-color: #E63946;
                background: rgba(230, 57, 70, 0.2);
            }
            .qr-quickselect {
                display: flex;
                justify-content: center;
                gap: 10px;
                flex-wrap: wrap;
            }
            .qr-quickselect-btn {
                background: rgba(255,255,255,0.1);
                border: 2px solid transparent;
                border-radius: 12px;
                padding: 16px 20px;
                color: #fff;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
            }
            .qr-quickselect-btn:hover {
                background: rgba(255,255,255,0.15);
            }
            .qr-quickselect-btn.selected {
                border-color: #00D26A;
                background: rgba(0, 210, 106, 0.2);
            }
            .qr-quickselect-btn .icon {
                font-size: 1.5rem;
            }
            .qr-yesno {
                display: flex;
                justify-content: center;
                gap: 20px;
            }
            .qr-yesno-btn {
                background: rgba(255,255,255,0.1);
                border: 2px solid transparent;
                border-radius: 16px;
                padding: 20px 40px;
                color: #fff;
                cursor: pointer;
                font-size: 1.1rem;
                font-weight: 600;
                transition: all 0.2s;
            }
            .qr-yesno-btn:hover {
                transform: translateY(-2px);
            }
            .qr-yesno-btn.yes.selected {
                border-color: #E63946;
                background: rgba(230, 57, 70, 0.2);
            }
            .qr-yesno-btn.no.selected {
                border-color: #00D26A;
                background: rgba(0, 210, 106, 0.2);
            }
            .qr-text-input {
                width: 100%;
                padding: 16px;
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 12px;
                color: #fff;
                font-size: 1rem;
                outline: none;
                transition: border-color 0.2s;
            }
            .qr-text-input:focus {
                border-color: #00D26A;
            }
            .qr-footer {
                padding: 16px 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid rgba(255,255,255,0.1);
            }
            .qr-btn {
                padding: 12px 24px;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
            }
            .qr-btn-skip {
                background: transparent;
                color: rgba(255,255,255,0.5);
            }
            .qr-btn-skip:hover {
                color: #fff;
            }
            .qr-btn-next {
                background: #00D26A;
                color: #000;
            }
            .qr-btn-next:hover {
                background: #00E676;
                transform: translateY(-1px);
            }
            .qr-btn-next:disabled {
                background: rgba(255,255,255,0.2);
                color: rgba(255,255,255,0.4);
                cursor: not-allowed;
                transform: none;
            }
            .qr-result {
                text-align: center;
                padding: 20px;
            }
            .qr-result-score {
                font-size: 4rem;
                font-weight: 700;
                background: linear-gradient(90deg, #00D26A, #00BCD4);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .qr-result-label {
                font-size: 1.2rem;
                color: rgba(255,255,255,0.7);
                margin-top: 8px;
            }
            .qr-result-insights {
                margin-top: 24px;
                text-align: left;
            }
            .qr-insight {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                background: rgba(255,255,255,0.05);
                border-radius: 12px;
                margin-bottom: 8px;
            }
            .qr-insight-icon {
                font-size: 1.5rem;
            }
            .qr-insight-text {
                color: #fff;
                font-size: 0.95rem;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Apre il modal di check
     * @param {string} athleteId 
     * @param {string} preset - 'quick' | 'standard' | 'full'
     * @returns {Promise<object>} - Risultato del check
     */
    function open(athleteId, preset = 'standard') {
        return new Promise((resolve, reject) => {
            const questionIds = QUESTION_SETS[preset] || QUESTION_SETS.standard;
            const questions = questionIds.map(id => QUESTIONS[id]).filter(Boolean);
            
            let currentIndex = 0;
            const answers = {};
            
            // Crea overlay
            const overlay = document.createElement('div');
            overlay.className = 'qr-overlay';
            overlay.innerHTML = `
                <div class="qr-modal">
                    <div class="qr-header">
                        <h2>🎯 Quick Check</h2>
                        <p>Come stai oggi?</p>
                        <div class="qr-progress">
                            <div class="qr-progress-bar" style="width: 0%"></div>
                        </div>
                    </div>
                    <div class="qr-body">
                        <div class="qr-question"></div>
                    </div>
                    <div class="qr-footer">
                        <button class="qr-btn qr-btn-skip">Salta</button>
                        <button class="qr-btn qr-btn-next" disabled>Avanti →</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            const modal = overlay.querySelector('.qr-modal');
            const questionContainer = overlay.querySelector('.qr-question');
            const progressBar = overlay.querySelector('.qr-progress-bar');
            const skipBtn = overlay.querySelector('.qr-btn-skip');
            const nextBtn = overlay.querySelector('.qr-btn-next');
            
            function updateProgress() {
                const pct = ((currentIndex + 1) / questions.length) * 100;
                progressBar.style.width = `${pct}%`;
            }
            
            function renderQuestion() {
                const q = questions[currentIndex];
                if (!q) {
                    showResult();
                    return;
                }
                
                updateProgress();
                questionContainer.innerHTML = '';
                
                const textEl = document.createElement('div');
                textEl.className = 'qr-question-text';
                textEl.textContent = q.text;
                questionContainer.appendChild(textEl);
                
                const optionsEl = document.createElement('div');
                
                switch (q.type) {
                    case 'emoji':
                        optionsEl.className = 'qr-emoji-options';
                        for (const opt of q.options) {
                            const btn = document.createElement('button');
                            btn.className = 'qr-emoji-btn';
                            btn.innerHTML = `<span class="emoji">${opt.emoji}</span><span class="label">${opt.label}</span>`;
                            btn.onclick = () => selectOption(q.id, opt.value, btn, 'qr-emoji-btn');
                            optionsEl.appendChild(btn);
                        }
                        break;
                        
                    case 'slider':
                        optionsEl.className = 'qr-slider-container';
                        const slider = document.createElement('input');
                        slider.type = 'range';
                        slider.className = 'qr-slider';
                        slider.min = q.min;
                        slider.max = q.max;
                        slider.step = q.step;
                        slider.value = q.defaultValue || ((q.max - q.min) / 2 + q.min);
                        
                        const valueDisplay = document.createElement('div');
                        valueDisplay.className = 'qr-slider-value';
                        valueDisplay.innerHTML = `${slider.value}<span class="unit">${q.unit || ''}</span>`;
                        
                        slider.oninput = () => {
                            valueDisplay.innerHTML = `${slider.value}<span class="unit">${q.unit || ''}</span>`;
                            answers[q.id] = parseFloat(slider.value);
                            nextBtn.disabled = false;
                        };
                        
                        answers[q.id] = parseFloat(slider.value);
                        nextBtn.disabled = false;
                        
                        optionsEl.appendChild(slider);
                        optionsEl.appendChild(valueDisplay);
                        break;
                        
                    case 'stars':
                        optionsEl.className = 'qr-stars';
                        for (let i = 1; i <= (q.max || 5); i++) {
                            const star = document.createElement('span');
                            star.className = 'qr-star';
                            star.textContent = '★';
                            star.onclick = () => {
                                answers[q.id] = i;
                                optionsEl.querySelectorAll('.qr-star').forEach((s, idx) => {
                                    s.classList.toggle('active', idx < i);
                                });
                                nextBtn.disabled = false;
                            };
                            optionsEl.appendChild(star);
                        }
                        break;
                        
                    case 'bodymap':
                        optionsEl.className = 'qr-bodymap';
                        answers[q.id] = [];
                        for (const opt of q.options) {
                            const btn = document.createElement('button');
                            btn.className = 'qr-bodymap-btn';
                            btn.textContent = opt.label;
                            btn.onclick = () => {
                                if (opt.value === 'none') {
                                    answers[q.id] = ['none'];
                                    optionsEl.querySelectorAll('.qr-bodymap-btn').forEach(b => b.classList.remove('selected'));
                                    btn.classList.add('selected');
                                } else {
                                    const noneBtn = optionsEl.querySelector('.qr-bodymap-btn.selected');
                                    if (answers[q.id].includes('none')) {
                                        answers[q.id] = [];
                                        noneBtn?.classList.remove('selected');
                                    }
                                    
                                    if (answers[q.id].includes(opt.value)) {
                                        answers[q.id] = answers[q.id].filter(v => v !== opt.value);
                                        btn.classList.remove('selected');
                                    } else {
                                        answers[q.id].push(opt.value);
                                        btn.classList.add('selected');
                                    }
                                }
                                nextBtn.disabled = answers[q.id].length === 0;
                            };
                            optionsEl.appendChild(btn);
                        }
                        nextBtn.disabled = true;
                        break;
                        
                    case 'quickselect':
                        optionsEl.className = 'qr-quickselect';
                        for (const opt of q.options) {
                            const btn = document.createElement('button');
                            btn.className = 'qr-quickselect-btn';
                            btn.innerHTML = `<span class="icon">${opt.icon}</span><span>${opt.label}</span>`;
                            btn.onclick = () => selectOption(q.id, opt.value, btn, 'qr-quickselect-btn');
                            optionsEl.appendChild(btn);
                        }
                        break;
                        
                    case 'yesno':
                        optionsEl.className = 'qr-yesno';
                        const yesBtn = document.createElement('button');
                        yesBtn.className = 'qr-yesno-btn yes';
                        yesBtn.textContent = 'Sì';
                        yesBtn.onclick = () => {
                            answers[q.id] = true;
                            yesBtn.classList.add('selected');
                            optionsEl.querySelector('.no')?.classList.remove('selected');
                            nextBtn.disabled = false;
                        };
                        
                        const noBtn = document.createElement('button');
                        noBtn.className = 'qr-yesno-btn no';
                        noBtn.textContent = 'No';
                        noBtn.onclick = () => {
                            answers[q.id] = false;
                            noBtn.classList.add('selected');
                            optionsEl.querySelector('.yes')?.classList.remove('selected');
                            nextBtn.disabled = false;
                        };
                        
                        optionsEl.appendChild(yesBtn);
                        optionsEl.appendChild(noBtn);
                        break;
                        
                    case 'text':
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.className = 'qr-text-input';
                        input.placeholder = q.placeholder || '';
                        input.oninput = () => {
                            answers[q.id] = input.value;
                            nextBtn.disabled = false;
                        };
                        optionsEl.appendChild(input);
                        nextBtn.disabled = false;
                        break;
                }
                
                questionContainer.appendChild(optionsEl);
                nextBtn.disabled = answers[q.id] === undefined;
            }
            
            function selectOption(questionId, value, btn, btnClass) {
                answers[questionId] = value;
                document.querySelectorAll(`.${btnClass}`).forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                nextBtn.disabled = false;
            }
            
            function showResult() {
                const result = calculateReadiness(answers);
                
                // Salva il check
                lastChecks[athleteId] = {
                    ...result,
                    answers,
                    timestamp: new Date().toISOString()
                };
                saveToStorage();
                
                // Notifica FeedbackLearner se disponibile
                if (window.FeedbackLearner) {
                    window.FeedbackLearner.recordSessionFeedback(athleteId, {
                        dayOfWeek: new Date().toLocaleDateString('en', { weekday: 'long' }),
                        timeOfDay: new Date().toTimeString().slice(0, 5),
                        feeling: answers.overall || 3,
                        sleepHours: answers.sleep || 7
                    });
                }
                
                modal.querySelector('.qr-header h2').textContent = '✅ Check Completato';
                modal.querySelector('.qr-header p').textContent = 'Ecco il tuo stato di oggi';
                progressBar.style.width = '100%';
                
                const readinessColor = result.readiness >= 80 ? '#00D26A' : result.readiness >= 60 ? '#FFB300' : '#E63946';
                
                questionContainer.innerHTML = `
                    <div class="qr-result">
                        <div class="qr-result-score" style="background: linear-gradient(90deg, ${readinessColor}, #00BCD4); -webkit-background-clip: text; background-clip: text;">${result.readiness}%</div>
                        <div class="qr-result-label">Readiness Score</div>
                        
                        <div class="qr-result-insights">
                            ${result.insights.map(i => `
                                <div class="qr-insight">
                                    <span class="qr-insight-icon">${i.icon}</span>
                                    <span class="qr-insight-text">${i.text}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                
                skipBtn.style.display = 'none';
                nextBtn.textContent = 'Inizia Allenamento';
                nextBtn.disabled = false;
                nextBtn.onclick = () => {
                    overlay.remove();
                    resolve(result);
                };
            }
            
            skipBtn.onclick = () => {
                currentIndex++;
                renderQuestion();
            };
            
            nextBtn.onclick = () => {
                currentIndex++;
                renderQuestion();
            };
            
            // Chiudi con ESC
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                    reject(new Error('Cancelled'));
                }
            };
            
            renderQuestion();
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // CALCOLO READINESS
    // ═══════════════════════════════════════════════════════════════
    
    function calculateReadiness(answers) {
        let score = 100;
        const insights = [];
        const modifiers = {
            volumeMultiplier: 1.0,
            intensityMultiplier: 1.0,
            focusAreas: [],
            avoidAreas: [],
            timeAvailable: answers.timeAvailable || 60
        };
        
        // Overall feeling (peso: 25%)
        if (answers.overall) {
            const overallMod = (answers.overall - 3) * 10; // -20 to +20
            score += overallMod;
            if (answers.overall <= 2) {
                insights.push({ icon: '😔', text: 'Feeling basso - considera workout leggero' });
                modifiers.intensityMultiplier *= 0.85;
            } else if (answers.overall >= 4) {
                insights.push({ icon: '💪', text: 'Ottimo feeling - puoi spingere!' });
            }
        }
        
        // Sleep quantity (peso: 20%)
        if (answers.sleep) {
            if (answers.sleep < 6) {
                score -= 20;
                insights.push({ icon: '😴', text: `Solo ${answers.sleep}h di sonno - riduci intensità` });
                modifiers.intensityMultiplier *= 0.8;
                modifiers.volumeMultiplier *= 0.9;
            } else if (answers.sleep < 7) {
                score -= 10;
                insights.push({ icon: '💤', text: 'Sonno sotto la media' });
            } else if (answers.sleep >= 8) {
                score += 5;
                insights.push({ icon: '✨', text: 'Ottimo riposo!' });
            }
        }
        
        // Sleep quality (peso: 10%)
        if (answers.sleepQuality) {
            const qualMod = (answers.sleepQuality - 3) * 5; // -10 to +10
            score += qualMod;
        }
        
        // Stress (peso: 15%)
        if (answers.stress) {
            if (answers.stress >= 8) {
                score -= 20;
                insights.push({ icon: '🧠', text: 'Stress alto - focus su movimento fluido' });
                modifiers.intensityMultiplier *= 0.9;
            } else if (answers.stress >= 6) {
                score -= 10;
            } else if (answers.stress <= 3) {
                score += 5;
                insights.push({ icon: '🧘', text: 'Mente rilassata - ottimo per performance' });
            }
        }
        
        // Soreness (peso: 15%)
        if (answers.soreness && answers.soreness.length > 0 && !answers.soreness.includes('none')) {
            const sorenessCount = answers.soreness.length;
            score -= sorenessCount * 8;
            modifiers.avoidAreas = answers.soreness;
            
            if (sorenessCount >= 3) {
                insights.push({ icon: '🔥', text: `DOMS in ${sorenessCount} zone - focus su altri gruppi` });
                modifiers.volumeMultiplier *= 0.85;
            } else {
                insights.push({ icon: '⚡', text: `Evita sovraccarico: ${answers.soreness.join(', ')}` });
            }
        }
        
        // Injury (peso: critico)
        if (answers.injury === true) {
            score -= 25;
            insights.push({ icon: '⚠️', text: `Dolore riportato${answers.injuryLocation ? ': ' + answers.injuryLocation : ''} - workout adattato` });
            modifiers.intensityMultiplier *= 0.7;
            if (answers.injuryLocation) {
                modifiers.avoidAreas.push(answers.injuryLocation);
            }
        }
        
        // Motivation (peso: 10%)
        if (answers.motivation) {
            if (answers.motivation <= 2) {
                score -= 15;
                insights.push({ icon: '🎯', text: 'Motivazione bassa - workout breve e intenso?' });
                modifiers.volumeMultiplier *= 0.8;
            } else if (answers.motivation >= 4) {
                score += 5;
                insights.push({ icon: '🔥', text: 'Alta motivazione - sfruttala!' });
            }
        }
        
        // Nutrition (peso: 10%)
        if (answers.nutrition) {
            if (answers.nutrition === 1) {
                score -= 15;
                insights.push({ icon: '🍎', text: 'A digiuno - evita volume alto' });
                modifiers.volumeMultiplier *= 0.75;
            } else if (answers.nutrition === 2) {
                score -= 8;
            }
        }
        
        // Time available
        if (answers.timeAvailable) {
            if (answers.timeAvailable <= 30) {
                insights.push({ icon: '⚡', text: 'Solo 30min - workout express' });
            }
        }
        
        // Clamp score
        score = Math.max(20, Math.min(100, Math.round(score)));
        
        // Raccomandazione
        let recommendation = '';
        if (score >= 85) {
            recommendation = 'Pronto per sessione intensa!';
        } else if (score >= 70) {
            recommendation = 'Sessione normale, ascolta il corpo';
        } else if (score >= 50) {
            recommendation = 'Sessione leggera consigliata';
        } else {
            recommendation = 'Considera riposo attivo o mobilità';
        }
        
        insights.push({ icon: '📋', text: recommendation });
        
        return {
            readiness: score,
            insights,
            modifiers,
            recommendation
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Ottieni l'ultimo check per un atleta
     */
    function getLastCheck(athleteId) {
        const check = lastChecks[athleteId];
        if (!check) return null;
        
        // Verifica se è recente (< 4 ore)
        const checkTime = new Date(check.timestamp).getTime();
        const now = Date.now();
        const hoursAgo = (now - checkTime) / (1000 * 60 * 60);
        
        return {
            ...check,
            hoursAgo,
            isRecent: hoursAgo < 4
        };
    }

    /**
     * Genera prompt section per l'AI
     */
    function generatePromptSection(athleteId) {
        const check = getLastCheck(athleteId);
        if (!check || !check.isRecent) return '';
        
        const lines = ['═══ QUICK READINESS CHECK (appena completato) ═══'];
        lines.push(`Readiness: ${check.readiness}%`);
        
        if (check.modifiers.avoidAreas?.length > 0) {
            lines.push(`⛔ Zone da evitare: ${check.modifiers.avoidAreas.join(', ')}`);
        }
        
        if (check.modifiers.volumeMultiplier !== 1.0) {
            lines.push(`📉 Volume modifier: ${Math.round(check.modifiers.volumeMultiplier * 100)}%`);
        }
        
        if (check.modifiers.intensityMultiplier !== 1.0) {
            lines.push(`📉 Intensity modifier: ${Math.round(check.modifiers.intensityMultiplier * 100)}%`);
        }
        
        if (check.modifiers.timeAvailable) {
            lines.push(`⏱️ Tempo disponibile: ${check.modifiers.timeAvailable} min`);
        }
        
        lines.push(`💡 ${check.recommendation}`);
        
        return lines.join('\n');
    }

    /**
     * Ottieni i modificatori per generazione workout
     */
    function getModifiers(athleteId) {
        const check = getLastCheck(athleteId);
        if (!check || !check.isRecent) {
            return {
                hasCheck: false,
                volumeMultiplier: 1.0,
                intensityMultiplier: 1.0,
                timeAvailable: 60
            };
        }
        
        return {
            hasCheck: true,
            ...check.modifiers
        };
    }

    // Inizializza
    init();

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════
    
    return {
        VERSION,
        open,
        getLastCheck,
        getModifiers,
        generatePromptSection,
        QUESTION_SETS
    };
})();

console.log('🎯 QuickReadinessCheck module loaded');
