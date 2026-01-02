/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🛡️ ATLAS ERROR HANDLER v1.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Sistema centralizzato di gestione errori per l'intera applicazione
 * - Cattura errori JavaScript globali
 * - Cattura promise rejections non gestite
 * - Mostra UI friendly per l'utente
 * - Log per debugging
 */

const ATLASErrorHandler = {
    version: '1.0.0',
    errors: [],
    maxErrors: 50,
    
    /**
     * Inizializza handler
     */
    init() {
        // Cattura errori globali
        window.onerror = (message, source, lineno, colno, error) => {
            this.handle({
                type: 'javascript',
                message: message,
                source: source,
                line: lineno,
                column: colno,
                stack: error?.stack,
                timestamp: new Date().toISOString()
            });
            return false; // Non bloccare altri handler
        };
        
        // Cattura promise rejection non gestite
        window.addEventListener('unhandledrejection', (event) => {
            this.handle({
                type: 'promise',
                message: event.reason?.message || String(event.reason),
                stack: event.reason?.stack,
                timestamp: new Date().toISOString()
            });
        });
        
        // Cattura errori fetch
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (!response.ok && response.status >= 500) {
                    this.handle({
                        type: 'network',
                        message: `Server error: ${response.status} ${response.statusText}`,
                        url: args[0],
                        timestamp: new Date().toISOString()
                    });
                }
                return response;
            } catch (error) {
                // Network errors (offline, CORS, etc.)
                this.handle({
                    type: 'network',
                    message: error.message,
                    url: args[0],
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        };
        
        this.injectStyles();
        console.log('🛡️ ATLAS Error Handler initialized');
    },
    
    /**
     * Gestisce un errore
     */
    handle(error) {
        // Ignora errori di estensioni browser
        if (this.shouldIgnore(error)) return;
        
        // Aggiungi a log
        this.errors.push(error);
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }
        
        // Log in console
        console.error('🛡️ ATLAS Error:', error);
        
        // Salva in localStorage per debugging
        try {
            localStorage.setItem('atlas_last_error', JSON.stringify(error));
        } catch (e) {}
        
        // Mostra toast solo per errori gravi
        if (this.isSerious(error)) {
            this.showToast(error);
        }
    },
    
    /**
     * Verifica se ignorare errore
     */
    shouldIgnore(error) {
        const message = (error.message || '').toLowerCase();
        const source = (error.source || '').toLowerCase();
        
        // Ignora errori di estensioni
        if (source.includes('extension')) return true;
        if (source.includes('chrome-extension')) return true;
        
        // Ignora errori comuni non critici
        if (message.includes('resizeobserver')) return true;
        if (message.includes('script error')) return true;
        if (message.includes('non-error promise rejection')) return true;
        
        return false;
    },
    
    /**
     * Verifica se errore è serio
     */
    isSerious(error) {
        const message = (error.message || '').toLowerCase();
        
        // Errori network sono sempre seri
        if (error.type === 'network') return true;
        
        // Errori critici JavaScript
        if (message.includes('cannot read') && message.includes('undefined')) return true;
        if (message.includes('is not a function')) return true;
        if (message.includes('is not defined')) return true;
        
        return false;
    },
    
    /**
     * Mostra toast errore
     */
    showToast(error) {
        // Rimuovi toast esistenti
        const existing = document.querySelector('.atlas-error-toast');
        if (existing) existing.remove();
        
        const message = this.getFriendlyMessage(error);
        const icon = error.type === 'network' ? '📡' : '⚠️';
        
        const toast = document.createElement('div');
        toast.className = 'atlas-error-toast';
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto-remove dopo 5 secondi
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('hiding');
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    },
    
    /**
     * Ottieni messaggio friendly
     */
    getFriendlyMessage(error) {
        const message = error.message || '';
        
        // Network errors
        if (error.type === 'network') {
            if (message.includes('NetworkError') || message.includes('Failed to fetch')) {
                return 'Connessione al server non riuscita. Controlla la tua connessione.';
            }
            return 'Errore di rete: ' + message.slice(0, 50);
        }
        
        // JavaScript errors
        if (message.includes('is not defined')) {
            return 'Modulo non caricato. Ricarica la pagina.';
        }
        if (message.includes('is not a function')) {
            return 'Funzionalità non disponibile. Ricarica la pagina.';
        }
        
        return 'Si è verificato un errore. Ricarica la pagina se il problema persiste.';
    },
    
    /**
     * Mostra pagina di errore grave
     */
    showCriticalError(error) {
        const html = `
            <div class="atlas-critical-error">
                <div class="critical-content">
                    <div class="critical-icon">💥</div>
                    <h1>Qualcosa è andato storto</h1>
                    <p>${this.getFriendlyMessage(error)}</p>
                    <div class="critical-actions">
                        <button onclick="location.reload()">Ricarica Pagina</button>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" class="secondary">Chiudi</button>
                    </div>
                    <details>
                        <summary>Dettagli tecnici</summary>
                        <pre>${JSON.stringify(error, null, 2)}</pre>
                    </details>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    },
    
    /**
     * Ottieni log errori
     */
    getErrors() {
        return [...this.errors];
    },
    
    /**
     * Pulisci log
     */
    clearErrors() {
        this.errors = [];
        localStorage.removeItem('atlas_last_error');
    },
    
    /**
     * Inietta stili
     */
    injectStyles() {
        if (document.getElementById('atlas-error-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'atlas-error-styles';
        styles.textContent = `
            .atlas-error-toast {
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%);
                background: #1a1a1a;
                border: 1px solid #333;
                border-left: 4px solid #f59e0b;
                border-radius: 8px;
                padding: 12px 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                max-width: 90%;
                width: 400px;
                z-index: 10001;
                animation: slideUp 0.3s ease;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            }
            
            .atlas-error-toast.hiding {
                animation: slideDown 0.3s ease forwards;
            }
            
            @keyframes slideUp {
                from { transform: translateX(-50%) translateY(20px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(0); opacity: 1; }
                to { transform: translateX(-50%) translateY(20px); opacity: 0; }
            }
            
            .toast-icon {
                font-size: 20px;
                flex-shrink: 0;
            }
            
            .toast-message {
                flex: 1;
                font-size: 13px;
                color: #fff;
            }
            
            .toast-close {
                background: none;
                border: none;
                color: #666;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
            }
            
            .toast-close:hover { color: #fff; }
            
            .atlas-critical-error {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10002;
            }
            
            .critical-content {
                text-align: center;
                max-width: 400px;
                padding: 40px;
            }
            
            .critical-icon {
                font-size: 64px;
                margin-bottom: 20px;
            }
            
            .critical-content h1 {
                font-size: 24px;
                margin-bottom: 12px;
            }
            
            .critical-content p {
                color: #888;
                margin-bottom: 24px;
            }
            
            .critical-actions {
                display: flex;
                gap: 12px;
                justify-content: center;
            }
            
            .critical-actions button {
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                border: none;
            }
            
            .critical-actions button:first-child {
                background: #E63946;
                color: #fff;
            }
            
            .critical-actions button.secondary {
                background: #333;
                color: #fff;
            }
            
            .critical-content details {
                margin-top: 24px;
                text-align: left;
            }
            
            .critical-content summary {
                color: #666;
                cursor: pointer;
                font-size: 12px;
            }
            
            .critical-content pre {
                background: #111;
                padding: 12px;
                border-radius: 8px;
                font-size: 10px;
                overflow: auto;
                max-height: 150px;
                margin-top: 8px;
            }
        `;
        
        document.head.appendChild(styles);
    }
};

// Auto-init
ATLASErrorHandler.init();

// Esporta per uso globale
window.ATLASErrorHandler = ATLASErrorHandler;

console.log('🛡️ ATLAS Error Handler v1.0 loaded!');
