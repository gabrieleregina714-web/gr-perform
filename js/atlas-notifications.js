/**
 * ATLAS Push Notifications Module
 * Gestisce notifiche push per reminder allenamenti
 * @version 1.0.0
 */

const ATLASNotifications = (() => {
    'use strict';

    let permission = 'default';
    let swRegistration = null;

    /**
     * Inizializza il sistema di notifiche
     */
    async function init() {
        // Check se le notifiche sono supportate
        if (!('Notification' in window)) {
            console.warn('🔔 Notifiche non supportate in questo browser');
            return false;
        }

        permission = Notification.permission;
        console.log('🔔 Notification permission:', permission);

        // Registra service worker per push
        if ('serviceWorker' in navigator) {
            try {
                swRegistration = await navigator.serviceWorker.ready;
                console.log('🔔 Service Worker pronto per notifiche');
            } catch (e) {
                console.warn('Service Worker non pronto:', e);
            }
        }

        // Carica reminder salvati
        loadReminders();

        return true;
    }

    /**
     * Richiedi permesso notifiche
     */
    async function requestPermission() {
        if (!('Notification' in window)) {
            showToast('Notifiche non supportate', 'error');
            return false;
        }

        try {
            permission = await Notification.requestPermission();
            console.log('🔔 Permission result:', permission);
            
            if (permission === 'granted') {
                showToast('Notifiche abilitate! 🎉', 'success');
                return true;
            } else if (permission === 'denied') {
                showToast('Notifiche bloccate. Abilita dalle impostazioni del browser.', 'error');
                return false;
            }
        } catch (e) {
            console.error('Errore richiesta permesso:', e);
            return false;
        }

        return false;
    }

    /**
     * Invia una notifica locale
     */
    function sendNotification(title, options = {}) {
        if (permission !== 'granted') {
            console.warn('Notifiche non abilitate');
            return null;
        }

        const defaultOptions = {
            icon: '/assets/icons/icon-192.png',
            badge: '/assets/icons/icon-72.png',
            vibrate: [200, 100, 200],
            tag: 'atlas-notification',
            requireInteraction: false,
            ...options
        };

        try {
            const notification = new Notification(title, defaultOptions);
            
            notification.onclick = () => {
                window.focus();
                notification.close();
                if (options.url) {
                    window.location.href = options.url;
                }
            };

            return notification;
        } catch (e) {
            console.error('Errore invio notifica:', e);
            return null;
        }
    }

    /**
     * Schedula un reminder per workout
     */
    function scheduleReminder(workoutId, athleteName, time, options = {}) {
        const reminders = getReminders();
        
        const reminder = {
            id: `reminder_${workoutId}_${Date.now()}`,
            workoutId,
            athleteName,
            scheduledTime: new Date(time).getTime(),
            title: options.title || `⏰ Workout per ${athleteName}`,
            body: options.body || 'È ora del tuo allenamento!',
            created: Date.now(),
            sent: false
        };

        reminders.push(reminder);
        saveReminders(reminders);

        console.log('🔔 Reminder schedulato:', reminder);

        // Imposta timer se entro le prossime 24h
        const msUntil = reminder.scheduledTime - Date.now();
        if (msUntil > 0 && msUntil < 24 * 60 * 60 * 1000) {
            setTimeout(() => {
                triggerReminder(reminder.id);
            }, msUntil);
        }

        return reminder.id;
    }

    /**
     * Trigger un reminder
     */
    function triggerReminder(reminderId) {
        const reminders = getReminders();
        const reminder = reminders.find(r => r.id === reminderId);

        if (!reminder || reminder.sent) return;

        // Invia notifica
        sendNotification(reminder.title, {
            body: reminder.body,
            tag: reminderId,
            data: { workoutId: reminder.workoutId }
        });

        // Marca come inviato
        reminder.sent = true;
        reminder.sentAt = Date.now();
        saveReminders(reminders);

        console.log('🔔 Reminder inviato:', reminder.title);
    }

    /**
     * Cancella un reminder
     */
    function cancelReminder(reminderId) {
        let reminders = getReminders();
        reminders = reminders.filter(r => r.id !== reminderId);
        saveReminders(reminders);
        console.log('🔔 Reminder cancellato:', reminderId);
    }

    /**
     * Reminder giornaliero di default
     */
    function setupDailyReminder(hour = 9, minute = 0) {
        const now = new Date();
        const reminderTime = new Date();
        reminderTime.setHours(hour, minute, 0, 0);

        // Se già passato oggi, schedula per domani
        if (reminderTime <= now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }

        const msUntil = reminderTime - now;

        setTimeout(() => {
            sendNotification('🏋️ Buongiorno!', {
                body: 'Hai workout programmati per oggi?',
                tag: 'daily-reminder'
            });

            // Reschedula per domani
            setupDailyReminder(hour, minute);
        }, msUntil);

        console.log(`🔔 Daily reminder impostato per ${reminderTime.toLocaleString('it-IT')}`);
    }

    /**
     * Notifica workout completato
     */
    function notifyWorkoutComplete(athleteName, workoutName) {
        return sendNotification('✅ Workout Completato!', {
            body: `${athleteName} ha completato: ${workoutName}`,
            tag: 'workout-complete'
        });
    }

    /**
     * Notifica nuovo messaggio
     */
    function notifyNewMessage(athleteName) {
        return sendNotification('💬 Nuovo Messaggio', {
            body: `${athleteName} ti ha scritto`,
            tag: 'new-message',
            url: '/coach-chat.html'
        });
    }

    /**
     * Storage helpers
     */
    function getReminders() {
        try {
            return JSON.parse(localStorage.getItem('atlas_reminders') || '[]');
        } catch {
            return [];
        }
    }

    function saveReminders(reminders) {
        localStorage.setItem('atlas_reminders', JSON.stringify(reminders));
    }

    function loadReminders() {
        const reminders = getReminders();
        const now = Date.now();

        // Riattiva timer per reminder futuri
        reminders.forEach(r => {
            if (!r.sent && r.scheduledTime > now) {
                const msUntil = r.scheduledTime - now;
                if (msUntil < 24 * 60 * 60 * 1000) {
                    setTimeout(() => triggerReminder(r.id), msUntil);
                }
            }
        });

        // Cleanup reminder vecchi (> 7 giorni)
        const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
        const cleaned = reminders.filter(r => r.scheduledTime > weekAgo);
        if (cleaned.length !== reminders.length) {
            saveReminders(cleaned);
        }
    }

    /**
     * Toast helper
     */
    function showToast(message, type = 'info') {
        if (typeof ATLASErrorHandler !== 'undefined' && ATLASErrorHandler.showToast) {
            ATLASErrorHandler.showToast(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    /**
     * UI: Mostra pannello impostazioni notifiche
     */
    function showSettingsPanel() {
        const isEnabled = permission === 'granted';
        const reminders = getReminders().filter(r => !r.sent);

        const html = `
            <div class="notification-settings-overlay" onclick="if(event.target===this) ATLASNotifications.hideSettingsPanel()">
                <div class="notification-settings-panel">
                    <div class="notification-settings-header">
                        <h3>🔔 Impostazioni Notifiche</h3>
                        <button onclick="ATLASNotifications.hideSettingsPanel()">×</button>
                    </div>
                    
                    <div class="notification-settings-body">
                        <div class="notification-status ${isEnabled ? 'enabled' : 'disabled'}">
                            <i class="fas ${isEnabled ? 'fa-bell' : 'fa-bell-slash'}"></i>
                            <span>${isEnabled ? 'Notifiche Abilitate' : 'Notifiche Disabilitate'}</span>
                            ${!isEnabled ? '<button class="btn-enable" onclick="ATLASNotifications.requestPermission()">Abilita</button>' : ''}
                        </div>

                        ${isEnabled ? `
                        <div class="notification-option">
                            <label>
                                <input type="checkbox" id="notif-daily" ${localStorage.getItem('atlas_daily_reminder') === 'true' ? 'checked' : ''}>
                                Reminder giornaliero (ore 9:00)
                            </label>
                        </div>

                        <div class="notification-option">
                            <label>
                                <input type="checkbox" id="notif-workout" ${localStorage.getItem('atlas_workout_notif') !== 'false' ? 'checked' : ''}>
                                Workout completati dagli atleti
                            </label>
                        </div>

                        <div class="notification-option">
                            <label>
                                <input type="checkbox" id="notif-message" ${localStorage.getItem('atlas_message_notif') !== 'false' ? 'checked' : ''}>
                                Nuovi messaggi
                            </label>
                        </div>
                        ` : ''}

                        <div class="pending-reminders">
                            <h4>Reminder Programmati (${reminders.length})</h4>
                            ${reminders.length > 0 ? reminders.map(r => `
                                <div class="reminder-item">
                                    <span>${r.athleteName} - ${new Date(r.scheduledTime).toLocaleString('it-IT')}</span>
                                    <button onclick="ATLASNotifications.cancelReminder('${r.id}')">×</button>
                                </div>
                            `).join('') : '<p style="color:#666;">Nessun reminder</p>'}
                        </div>

                        ${isEnabled ? `
                        <button class="btn-test" onclick="ATLASNotifications.testNotification()">
                            🧪 Test Notifica
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
            <style>
                .notification-settings-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }
                .notification-settings-panel {
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 400px;
                }
                .notification-settings-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #333;
                }
                .notification-settings-header h3 { margin: 0; font-size: 16px; }
                .notification-settings-header button {
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 24px;
                    cursor: pointer;
                }
                .notification-settings-body { padding: 20px; }
                .notification-status {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                }
                .notification-status.enabled { background: rgba(34,197,94,0.15); color: #22c55e; }
                .notification-status.disabled { background: rgba(230,57,70,0.15); color: #E63946; }
                .btn-enable {
                    margin-left: auto;
                    padding: 8px 16px;
                    background: #E63946;
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                }
                .notification-option {
                    padding: 12px 0;
                    border-bottom: 1px solid #222;
                }
                .notification-option label {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                }
                .notification-option input[type="checkbox"] {
                    width: 20px;
                    height: 20px;
                    accent-color: #E63946;
                }
                .pending-reminders { margin-top: 20px; }
                .pending-reminders h4 { font-size: 12px; color: #888; margin-bottom: 12px; }
                .reminder-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    background: #1a1a1a;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    font-size: 13px;
                }
                .reminder-item button {
                    background: none;
                    border: none;
                    color: #E63946;
                    cursor: pointer;
                    font-size: 18px;
                }
                .btn-test {
                    width: 100%;
                    padding: 12px;
                    margin-top: 20px;
                    background: #222;
                    border: 1px solid #333;
                    border-radius: 10px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                }
                .btn-test:hover { background: #333; }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        // Event listeners per checkbox
        setTimeout(() => {
            const dailyCheck = document.getElementById('notif-daily');
            const workoutCheck = document.getElementById('notif-workout');
            const messageCheck = document.getElementById('notif-message');

            if (dailyCheck) {
                dailyCheck.addEventListener('change', (e) => {
                    localStorage.setItem('atlas_daily_reminder', e.target.checked);
                    if (e.target.checked) setupDailyReminder();
                });
            }
            if (workoutCheck) {
                workoutCheck.addEventListener('change', (e) => {
                    localStorage.setItem('atlas_workout_notif', e.target.checked);
                });
            }
            if (messageCheck) {
                messageCheck.addEventListener('change', (e) => {
                    localStorage.setItem('atlas_message_notif', e.target.checked);
                });
            }
        }, 100);
    }

    function hideSettingsPanel() {
        const overlay = document.querySelector('.notification-settings-overlay');
        if (overlay) overlay.remove();
    }

    function testNotification() {
        sendNotification('🧪 Test ATLAS', {
            body: 'Le notifiche funzionano correttamente!',
            tag: 'test'
        });
    }

    // API Pubblica
    return {
        init,
        requestPermission,
        sendNotification,
        scheduleReminder,
        cancelReminder,
        triggerReminder,
        setupDailyReminder,
        notifyWorkoutComplete,
        notifyNewMessage,
        showSettingsPanel,
        hideSettingsPanel,
        testNotification,
        isEnabled: () => permission === 'granted',
        VERSION: '1.0.0'
    };
})();

// Export globale
if (typeof window !== 'undefined') {
    window.ATLASNotifications = ATLASNotifications;
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ATLASNotifications.init());
} else {
    ATLASNotifications.init();
}

console.log('🔔 ATLAS Notifications v1.0.0 loaded');
