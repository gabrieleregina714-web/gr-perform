// GR Perform - App Initialization
// Include this file in all pages for PWA support

(function() {
    'use strict';

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    console.log('[GR] Service Worker registered:', reg.scope);
                    
                    // Check for updates
                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(err => console.log('[GR] SW registration failed:', err));
        });
    }

    // Show update notification
    function showUpdateNotification() {
        const notification = document.createElement('div');
        notification.id = 'update-notification';
        notification.innerHTML = `
            <div style="position: fixed; bottom: 80px; left: 16px; right: 16px; 
                        background: linear-gradient(135deg, #E63946, #FF6B6B); 
                        padding: 16px 20px; border-radius: 14px; z-index: 10000;
                        display: flex; align-items: center; justify-content: space-between;
                        box-shadow: 0 8px 32px rgba(230,57,70,0.3);">
                <span style="color: white; font-weight: 600; font-size: 14px;">
                    ✨ Nuova versione disponibile!
                </span>
                <button onclick="location.reload()" style="
                    background: white; color: #E63946; border: none; 
                    padding: 8px 16px; border-radius: 8px; font-weight: 700;
                    cursor: pointer; font-size: 13px;">
                    Aggiorna
                </button>
            </div>
        `;
        document.body.appendChild(notification);
    }

    // Handle online/offline status
    function updateOnlineStatus() {
        const isOnline = navigator.onLine;
        document.body.classList.toggle('is-offline', !isOnline);
        
        if (!isOnline) {
            showOfflineIndicator();
        } else {
            hideOfflineIndicator();
        }
    }

    function showOfflineIndicator() {
        if (document.getElementById('offline-indicator')) return;
        
        const indicator = document.createElement('div');
        indicator.id = 'offline-indicator';
        indicator.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; 
                        background: #FF9800; color: white; 
                        padding: 8px; text-align: center; z-index: 10001;
                        font-size: 13px; font-weight: 600;">
                📡 Modalità Offline
            </div>
        `;
        document.body.appendChild(indicator);
        document.body.style.paddingTop = '36px';
    }

    function hideOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.remove();
            document.body.style.paddingTop = '';
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Check initial status
    if (!navigator.onLine) {
        updateOnlineStatus();
    }

    // iOS standalone mode detection
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                        || window.navigator.standalone;
    
    if (isStandalone) {
        document.body.classList.add('is-standalone');
        console.log('[GR] Running in standalone mode');
    }

    // Prevent pull-to-refresh on iOS
    document.body.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) return; // Allow pinch zoom
        
        const scrollable = e.target.closest('.scrollable, .chat-messages, .conversation-messages');
        if (scrollable) {
            const atTop = scrollable.scrollTop <= 0;
            const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight;
            
            if ((atTop && e.touches[0].clientY > 0) || atBottom) {
                // Allow native behavior at scroll boundaries
            }
        }
    }, { passive: true });

    // Install prompt for Android
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });

    function showInstallButton() {
        // Check if already shown recently
        const lastPrompt = localStorage.getItem('gr_install_prompt');
        if (lastPrompt && Date.now() - parseInt(lastPrompt) < 7 * 24 * 60 * 60 * 1000) {
            return; // Don't show again within 7 days
        }

        const installBanner = document.createElement('div');
        installBanner.id = 'install-banner';
        installBanner.innerHTML = `
            <div style="position: fixed; bottom: 80px; left: 16px; right: 16px; 
                        background: #111; border: 1px solid #333;
                        padding: 16px 20px; border-radius: 14px; z-index: 10000;
                        display: flex; align-items: center; gap: 16px;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #E63946, #FF6B6B);
                            border-radius: 12px; display: flex; align-items: center; justify-content: center;
                            font-weight: 900; color: white; font-size: 16px;">GR</div>
                <div style="flex: 1;">
                    <div style="color: white; font-weight: 700; font-size: 14px;">Installa GR Perform</div>
                    <div style="color: #888; font-size: 12px;">Aggiungi alla home per accesso rapido</div>
                </div>
                <button id="install-btn" style="
                    background: #E63946; color: white; border: none; 
                    padding: 10px 18px; border-radius: 10px; font-weight: 700;
                    cursor: pointer; font-size: 13px;">
                    Installa
                </button>
                <button id="install-close" style="
                    background: none; border: none; color: #666; 
                    padding: 8px; cursor: pointer; font-size: 18px;">
                    ✕
                </button>
            </div>
        `;
        document.body.appendChild(installBanner);

        document.getElementById('install-btn').addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log('[GR] Install prompt outcome:', outcome);
                deferredPrompt = null;
            }
            installBanner.remove();
        });

        document.getElementById('install-close').addEventListener('click', () => {
            localStorage.setItem('gr_install_prompt', Date.now().toString());
            installBanner.remove();
        });
    }

    // Track app installed
    window.addEventListener('appinstalled', () => {
        console.log('[GR] App installed successfully');
        const banner = document.getElementById('install-banner');
        if (banner) banner.remove();
    });

})();
