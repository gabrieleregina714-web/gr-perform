/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 ATLAS ONBOARDING WIZARD v1.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Sistema di onboarding per nuovi coach/atleti
 * Guida l'utente attraverso la configurazione iniziale
 */

const ATLASOnboarding = {
    version: '1.0.0',
    
    // Configurazione steps
    steps: [
        {
            id: 'welcome',
            title: 'Benvenuto in ATLAS',
            subtitle: 'Il tuo coach AI personale',
            icon: '🧠',
            content: `
                <div class="onboarding-hero">
                    <div class="onboarding-brain-icon">🧠</div>
                    <h2>ATLAS AI</h2>
                    <p>Sistema Autonomo di Training basato su Intelligenza Artificiale</p>
                </div>
                <div class="onboarding-features">
                    <div class="onboarding-feature">
                        <span class="feature-icon">📊</span>
                        <span>Workout personalizzati scientificamente</span>
                    </div>
                    <div class="onboarding-feature">
                        <span class="feature-icon">🛡️</span>
                        <span>Prevenzione infortuni automatica</span>
                    </div>
                    <div class="onboarding-feature">
                        <span class="feature-icon">📈</span>
                        <span>Progressione intelligente</span>
                    </div>
                    <div class="onboarding-feature">
                        <span class="feature-icon">🎯</span>
                        <span>15+ sport supportati</span>
                    </div>
                </div>
            `
        },
        {
            id: 'profile',
            title: 'Il Tuo Profilo',
            subtitle: 'Dati base per personalizzare',
            icon: '👤',
            content: `
                <div class="onboarding-form">
                    <div class="onboarding-form-group">
                        <label>Nome</label>
                        <input type="text" id="onb-name" placeholder="Il tuo nome">
                    </div>
                    <div class="onboarding-form-row">
                        <div class="onboarding-form-group">
                            <label>Ruolo</label>
                            <select id="onb-role">
                                <option value="coach">Coach / PT</option>
                                <option value="athlete">Atleta</option>
                                <option value="both">Entrambi</option>
                            </select>
                        </div>
                        <div class="onboarding-form-group">
                            <label>Esperienza</label>
                            <select id="onb-experience">
                                <option value="beginner">Principiante</option>
                                <option value="intermediate">Intermedio</option>
                                <option value="advanced">Avanzato</option>
                                <option value="elite">Elite</option>
                            </select>
                        </div>
                    </div>
                </div>
            `
        },
        {
            id: 'sport',
            title: 'Il Tuo Sport',
            subtitle: 'Seleziona il focus principale',
            icon: '🏆',
            content: `
                <div class="onboarding-sports-grid">
                    <div class="onboarding-sport" data-sport="calcio">⚽ Calcio</div>
                    <div class="onboarding-sport" data-sport="basket">🏀 Basket</div>
                    <div class="onboarding-sport" data-sport="boxe">🥊 Boxe/MMA</div>
                    <div class="onboarding-sport" data-sport="palestra">🏋️ Palestra</div>
                    <div class="onboarding-sport" data-sport="running">🏃 Running</div>
                    <div class="onboarding-sport" data-sport="tennis">🎾 Tennis</div>
                    <div class="onboarding-sport" data-sport="nuoto">🏊 Nuoto</div>
                    <div class="onboarding-sport" data-sport="ciclismo">🚴 Ciclismo</div>
                    <div class="onboarding-sport" data-sport="crossfit">💪 CrossFit</div>
                    <div class="onboarding-sport" data-sport="other">🎯 Altro</div>
                </div>
            `
        },
        {
            id: 'goals',
            title: 'I Tuoi Obiettivi',
            subtitle: 'Cosa vuoi raggiungere?',
            icon: '🎯',
            content: `
                <div class="onboarding-goals-grid">
                    <div class="onboarding-goal" data-goal="strength">💪 Forza</div>
                    <div class="onboarding-goal" data-goal="hypertrophy">📐 Massa Muscolare</div>
                    <div class="onboarding-goal" data-goal="conditioning">❤️ Conditioning</div>
                    <div class="onboarding-goal" data-goal="sport">🏆 Performance Sport</div>
                    <div class="onboarding-goal" data-goal="weight_loss">⚖️ Dimagrimento</div>
                    <div class="onboarding-goal" data-goal="injury_prevention">🛡️ Prevenzione</div>
                </div>
                <p class="onboarding-hint">Puoi selezionare più obiettivi</p>
            `
        },
        {
            id: 'ready',
            title: 'Tutto Pronto!',
            subtitle: 'ATLAS è configurato',
            icon: '🚀',
            content: `
                <div class="onboarding-ready">
                    <div class="onboarding-checkmark">✓</div>
                    <h2>Configurazione Completata</h2>
                    <p>ATLAS è pronto per creare il tuo primo workout personalizzato</p>
                    <div class="onboarding-summary" id="onboarding-summary">
                        <!-- Populated by JS -->
                    </div>
                </div>
            `
        }
    ],
    
    currentStep: 0,
    data: {},
    
    /**
     * Verifica se mostrare onboarding
     */
    shouldShow() {
        return !localStorage.getItem('atlas_onboarding_completed');
    },
    
    /**
     * Avvia onboarding
     */
    start() {
        if (!this.shouldShow()) return false;
        
        this.currentStep = 0;
        this.data = {};
        this.render();
        return true;
    },
    
    /**
     * Salta onboarding
     */
    skip() {
        localStorage.setItem('atlas_onboarding_completed', 'true');
        localStorage.setItem('atlas_onboarding_skipped', 'true');
        this.close();
    },
    
    /**
     * Chiudi onboarding
     */
    close() {
        const modal = document.getElementById('atlas-onboarding-modal');
        if (modal) {
            modal.classList.add('closing');
            setTimeout(() => modal.remove(), 300);
        }
    },
    
    /**
     * Vai allo step successivo
     */
    next() {
        // Salva dati step corrente
        this.saveStepData();
        
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.render();
        } else {
            this.complete();
        }
    },
    
    /**
     * Vai allo step precedente
     */
    prev() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.render();
        }
    },
    
    /**
     * Salva dati dello step corrente
     */
    saveStepData() {
        const step = this.steps[this.currentStep];
        
        switch(step.id) {
            case 'profile':
                this.data.name = document.getElementById('onb-name')?.value || '';
                this.data.role = document.getElementById('onb-role')?.value || 'coach';
                this.data.experience = document.getElementById('onb-experience')?.value || 'intermediate';
                break;
                
            case 'sport':
                const selectedSport = document.querySelector('.onboarding-sport.selected');
                this.data.sport = selectedSport?.dataset.sport || 'palestra';
                break;
                
            case 'goals':
                const selectedGoals = document.querySelectorAll('.onboarding-goal.selected');
                this.data.goals = Array.from(selectedGoals).map(el => el.dataset.goal);
                break;
        }
    },
    
    /**
     * Completa onboarding
     */
    complete() {
        this.saveStepData();
        
        // Salva preferenze
        localStorage.setItem('atlas_onboarding_completed', 'true');
        localStorage.setItem('atlas_onboarding_data', JSON.stringify(this.data));
        
        // Salva anche nelle preferenze globali
        if (this.data.name) {
            localStorage.setItem('gr_coach_name', this.data.name);
        }
        
        console.log('🎯 Onboarding completed:', this.data);
        
        this.close();
        
        // Callback opzionale
        if (typeof window.onOnboardingComplete === 'function') {
            window.onOnboardingComplete(this.data);
        }
    },
    
    /**
     * Renderizza modal
     */
    render() {
        const step = this.steps[this.currentStep];
        const isFirst = this.currentStep === 0;
        const isLast = this.currentStep === this.steps.length - 1;
        
        // Se è l'ultimo step, popola il summary
        if (step.id === 'ready') {
            setTimeout(() => this.renderSummary(), 100);
        }
        
        const html = `
            <div class="atlas-onboarding-modal" id="atlas-onboarding-modal">
                <div class="onboarding-backdrop" onclick="ATLASOnboarding.skip()"></div>
                <div class="onboarding-container">
                    <button class="onboarding-skip" onclick="ATLASOnboarding.skip()">
                        Salta <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="onboarding-progress">
                        ${this.steps.map((s, i) => `
                            <div class="progress-dot ${i === this.currentStep ? 'active' : ''} ${i < this.currentStep ? 'completed' : ''}"></div>
                        `).join('')}
                    </div>
                    
                    <div class="onboarding-header">
                        <div class="onboarding-icon">${step.icon}</div>
                        <h1 class="onboarding-title">${step.title}</h1>
                        <p class="onboarding-subtitle">${step.subtitle}</p>
                    </div>
                    
                    <div class="onboarding-content">
                        ${step.content}
                    </div>
                    
                    <div class="onboarding-actions">
                        ${!isFirst ? `
                            <button class="onboarding-btn secondary" onclick="ATLASOnboarding.prev()">
                                <i class="fas fa-arrow-left"></i> Indietro
                            </button>
                        ` : '<div></div>'}
                        
                        <button class="onboarding-btn primary" onclick="ATLASOnboarding.next()">
                            ${isLast ? 'Inizia!' : 'Avanti'} <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Rimuovi modal esistente
        const existing = document.getElementById('atlas-onboarding-modal');
        if (existing) existing.remove();
        
        // Inserisci nuovo modal
        document.body.insertAdjacentHTML('beforeend', html);
        
        // Setup interazioni
        this.setupInteractions();
    },
    
    /**
     * Setup interazioni (click su sport/goals)
     */
    setupInteractions() {
        // Sport selection (single)
        document.querySelectorAll('.onboarding-sport').forEach(el => {
            el.addEventListener('click', () => {
                document.querySelectorAll('.onboarding-sport').forEach(s => s.classList.remove('selected'));
                el.classList.add('selected');
            });
        });
        
        // Goals selection (multi)
        document.querySelectorAll('.onboarding-goal').forEach(el => {
            el.addEventListener('click', () => {
                el.classList.toggle('selected');
            });
        });
        
        // Restore previous selections
        if (this.data.sport) {
            const sportEl = document.querySelector(`.onboarding-sport[data-sport="${this.data.sport}"]`);
            if (sportEl) sportEl.classList.add('selected');
        }
        
        if (this.data.goals) {
            this.data.goals.forEach(goal => {
                const goalEl = document.querySelector(`.onboarding-goal[data-goal="${goal}"]`);
                if (goalEl) goalEl.classList.add('selected');
            });
        }
    },
    
    /**
     * Renderizza summary finale
     */
    renderSummary() {
        const summary = document.getElementById('onboarding-summary');
        if (!summary) return;
        
        const sportLabels = {
            calcio: '⚽ Calcio', basket: '🏀 Basket', boxe: '🥊 Boxe',
            palestra: '🏋️ Palestra', running: '🏃 Running', tennis: '🎾 Tennis',
            nuoto: '🏊 Nuoto', ciclismo: '🚴 Ciclismo', crossfit: '💪 CrossFit',
            other: '🎯 Altro'
        };
        
        const goalLabels = {
            strength: '💪 Forza', hypertrophy: '📐 Massa', conditioning: '❤️ Cardio',
            sport: '🏆 Sport', weight_loss: '⚖️ Dimagrimento', injury_prevention: '🛡️ Prevenzione'
        };
        
        summary.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Nome</span>
                <span class="summary-value">${this.data.name || 'Coach'}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Sport</span>
                <span class="summary-value">${sportLabels[this.data.sport] || this.data.sport}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Obiettivi</span>
                <span class="summary-value">${this.data.goals?.map(g => goalLabels[g]).join(', ') || '-'}</span>
            </div>
        `;
    },
    
    /**
     * Inietta CSS
     */
    injectStyles() {
        if (document.getElementById('atlas-onboarding-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'atlas-onboarding-styles';
        styles.textContent = `
            .atlas-onboarding-modal {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            
            .atlas-onboarding-modal.closing {
                animation: fadeOut 0.3s ease forwards;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            .onboarding-backdrop {
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.9);
                backdrop-filter: blur(10px);
            }
            
            .onboarding-container {
                position: relative;
                background: linear-gradient(180deg, #111 0%, #000 100%);
                border: 1px solid #333;
                border-radius: 20px;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideUp 0.4s ease;
            }
            
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .onboarding-skip {
                position: absolute;
                top: 16px; right: 16px;
                background: transparent;
                border: none;
                color: #666;
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .onboarding-skip:hover { color: #fff; }
            
            .onboarding-progress {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-bottom: 30px;
            }
            
            .progress-dot {
                width: 8px; height: 8px;
                border-radius: 50%;
                background: #333;
                transition: all 0.3s;
            }
            
            .progress-dot.active { background: #E63946; transform: scale(1.3); }
            .progress-dot.completed { background: #22c55e; }
            
            .onboarding-header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .onboarding-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }
            
            .onboarding-title {
                font-size: 28px;
                font-weight: 900;
                margin-bottom: 8px;
                letter-spacing: -1px;
            }
            
            .onboarding-subtitle {
                color: #888;
                font-size: 14px;
            }
            
            .onboarding-content {
                margin-bottom: 30px;
            }
            
            .onboarding-hero {
                text-align: center;
                padding: 20px 0;
            }
            
            .onboarding-brain-icon {
                font-size: 64px;
                margin-bottom: 16px;
            }
            
            .onboarding-features {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-top: 24px;
            }
            
            .onboarding-feature {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                background: rgba(255,255,255,0.05);
                border-radius: 10px;
                font-size: 14px;
            }
            
            .feature-icon { font-size: 20px; }
            
            .onboarding-form-group {
                margin-bottom: 16px;
            }
            
            .onboarding-form-group label {
                display: block;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #888;
                margin-bottom: 6px;
            }
            
            .onboarding-form-group input,
            .onboarding-form-group select {
                width: 100%;
                padding: 12px 16px;
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 8px;
                color: #fff;
                font-size: 15px;
            }
            
            .onboarding-form-group input:focus,
            .onboarding-form-group select:focus {
                outline: none;
                border-color: #E63946;
            }
            
            .onboarding-form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }
            
            .onboarding-sports-grid,
            .onboarding-goals-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }
            
            .onboarding-sport,
            .onboarding-goal {
                padding: 16px;
                background: #1a1a1a;
                border: 2px solid #333;
                border-radius: 12px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 14px;
            }
            
            .onboarding-sport:hover,
            .onboarding-goal:hover {
                border-color: #666;
            }
            
            .onboarding-sport.selected,
            .onboarding-goal.selected {
                border-color: #E63946;
                background: rgba(230, 57, 70, 0.1);
            }
            
            .onboarding-hint {
                text-align: center;
                font-size: 12px;
                color: #666;
                margin-top: 12px;
            }
            
            .onboarding-ready {
                text-align: center;
                padding: 20px 0;
            }
            
            .onboarding-checkmark {
                width: 60px; height: 60px;
                background: #22c55e;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                color: #fff;
                margin: 0 auto 20px;
            }
            
            .onboarding-summary {
                margin-top: 24px;
                text-align: left;
            }
            
            .summary-item {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #222;
            }
            
            .summary-label { color: #888; font-size: 13px; }
            .summary-value { font-weight: 600; font-size: 14px; }
            
            .onboarding-actions {
                display: flex;
                justify-content: space-between;
                gap: 12px;
            }
            
            .onboarding-btn {
                padding: 14px 28px;
                border-radius: 10px;
                font-weight: 700;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s;
                border: none;
            }
            
            .onboarding-btn.primary {
                background: #E63946;
                color: #fff;
            }
            
            .onboarding-btn.primary:hover {
                background: #ff4d5a;
                transform: translateY(-2px);
            }
            
            .onboarding-btn.secondary {
                background: transparent;
                border: 1px solid #333;
                color: #888;
            }
            
            .onboarding-btn.secondary:hover {
                border-color: #666;
                color: #fff;
            }
            
            @media (max-width: 500px) {
                .onboarding-container {
                    padding: 24px;
                    border-radius: 16px 16px 0 0;
                    max-height: 85vh;
                }
                
                .onboarding-title { font-size: 22px; }
                .onboarding-sports-grid { grid-template-columns: 1fr 1fr; }
                .onboarding-form-row { grid-template-columns: 1fr; }
            }
        `;
        
        document.head.appendChild(styles);
    },
    
    /**
     * Init
     */
    init() {
        this.injectStyles();
        
        // Auto-start se non completato
        if (this.shouldShow()) {
            // Delay per permettere caricamento pagina
            setTimeout(() => this.start(), 500);
        }
    }
};

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ATLASOnboarding.init());
} else {
    ATLASOnboarding.init();
}

console.log('🎯 ATLAS Onboarding v1.0 loaded!');
