/**
 * GR Perform - Subscription Manager
 * Gestione abbonamenti atleti
 * @version 1.0.0
 */

const SubscriptionManager = (() => {
    'use strict';

    // Getter per supabase client (usa window.supabase)
    const getSupabase = () => {
        if (typeof window !== 'undefined' && window.supabase) {
            return window.supabase;
        }
        throw new Error('Supabase client non disponibile. Assicurati di caricare supabase-client.js prima di subscription-manager.js');
    };

    // Durate piani in giorni
    const PLAN_DURATIONS = {
        'monthly': 30,
        'quarterly': 90,
        'yearly': 365,
        'trial': 7
    };

    // Status abbonamento
    const STATUS = {
        ACTIVE: 'active',
        EXPIRED: 'expired',
        CANCELLED: 'cancelled',
        PENDING: 'pending'
    };

    /**
     * Hash password (semplice per demo, in produzione usa bcrypt lato server)
     */
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'gr_perform_salt_2024');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Genera password casuale
     */
    function generatePassword(length = 12) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    /**
     * Calcola data di scadenza
     */
    function calculateEndDate(planType, startDate = new Date()) {
        const days = PLAN_DURATIONS[planType] || 30;
        const end = new Date(startDate);
        end.setDate(end.getDate() + days);
        return end;
    }

    /**
     * Verifica se abbonamento è attivo
     */
    function isSubscriptionActive(subscription) {
        if (!subscription) return false;
        if (subscription.status !== STATUS.ACTIVE) return false;
        
        const now = new Date();
        const endDate = new Date(subscription.end_date);
        
        return endDate > now;
    }

    /**
     * Giorni rimanenti
     */
    function getDaysRemaining(subscription) {
        if (!subscription || !subscription.end_date) return 0;
        
        const now = new Date();
        const endDate = new Date(subscription.end_date);
        const diffTime = endDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return Math.max(0, diffDays);
    }

    /**
     * Crea nuovo abbonamento
     */
    async function createSubscription(data) {
        try {
            const password = data.password || generatePassword();
            const passwordHash = await hashPassword(password);
            
            const startDate = new Date();
            const endDate = calculateEndDate(data.plan_type || 'monthly', startDate);
            
            const subscriptionData = {
                email: data.email.toLowerCase().trim(),
                password_hash: passwordHash,
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                phone: data.phone || '',
                plan_type: data.plan_type || 'monthly',
                status: STATUS.ACTIVE,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                shopify_order_id: data.shopify_order_id || null,
                shopify_customer_id: data.shopify_customer_id || null
            };
            
            const result = await getSupabase().insert('subscriptions', subscriptionData);
            
            // Log creazione
            await logAction(result.id || result[0]?.id, 'created');
            
            console.log('✅ Abbonamento creato:', data.email);
            
            return {
                success: true,
                subscription: result,
                password: password, // Password in chiaro per email
                endDate: endDate
            };
            
        } catch (error) {
            console.error('❌ Errore creazione abbonamento:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Login atleta
     */
    async function login(email, password) {
        try {
            const emailLower = email.toLowerCase().trim();
            const passwordHash = await hashPassword(password);
            
            // Cerca abbonamento
            const results = await getSupabase().fetch('subscriptions', `?email=eq.${emailLower}&select=*`);
            
            if (!results || results.length === 0) {
                return { success: false, error: 'Email non trovata' };
            }
            
            const subscription = results[0];
            
            // Verifica password
            if (subscription.password_hash !== passwordHash) {
                return { success: false, error: 'Password errata' };
            }
            
            // Verifica stato
            if (subscription.status === STATUS.CANCELLED) {
                return { success: false, error: 'Abbonamento cancellato' };
            }
            
            // Verifica scadenza
            if (!isSubscriptionActive(subscription)) {
                // Aggiorna status a expired
                await getSupabase().update('subscriptions', subscription.id, { status: STATUS.EXPIRED });
                return { 
                    success: false, 
                    error: 'Abbonamento scaduto', 
                    expired: true,
                    renewUrl: 'https://grperform.com/rinnova' // URL tuo Shopify
                };
            }
            
            // Aggiorna ultimo login
            await getSupabase().update('subscriptions', subscription.id, {
                last_login: new Date().toISOString(),
                login_count: (subscription.login_count || 0) + 1
            });
            
            // Log login
            await logAction(subscription.id, 'login');
            
            // Salva sessione
            const session = {
                id: subscription.id,
                email: subscription.email,
                firstName: subscription.first_name,
                lastName: subscription.last_name,
                planType: subscription.plan_type,
                endDate: subscription.end_date,
                athleteId: subscription.athlete_id,
                loginTime: Date.now()
            };
            
            localStorage.setItem('gr_athlete_session', JSON.stringify(session));
            localStorage.setItem('gr_athlete_logged_in', 'true');
            
            console.log('✅ Login effettuato:', emailLower);
            
            return { 
                success: true, 
                subscription: subscription,
                daysRemaining: getDaysRemaining(subscription)
            };
            
        } catch (error) {
            console.error('❌ Errore login:', error);
            return { success: false, error: 'Errore di connessione' };
        }
    }

    /**
     * Logout
     */
    function logout() {
        const session = getSession();
        if (session?.id) {
            logAction(session.id, 'logout');
        }
        
        localStorage.removeItem('gr_athlete_session');
        localStorage.removeItem('gr_athlete_logged_in');
        
        window.location.href = 'athlete-login.html';
    }

    /**
     * Ottieni sessione corrente
     */
    function getSession() {
        try {
            const session = localStorage.getItem('gr_athlete_session');
            return session ? JSON.parse(session) : null;
        } catch {
            return null;
        }
    }

    /**
     * Verifica se loggato e abbonamento valido
     */
    async function checkAuth() {
        const session = getSession();
        
        if (!session) {
            return { valid: false, reason: 'not_logged_in' };
        }
        
        // Ricontrolla abbonamento dal server
        try {
            const results = await getSupabase().fetch('subscriptions', `?id=eq.${session.id}&select=*`);
            
            if (!results || results.length === 0) {
                logout();
                return { valid: false, reason: 'not_found' };
            }
            
            const subscription = results[0];
            
            if (!isSubscriptionActive(subscription)) {
                await getSupabase().update('subscriptions', subscription.id, { status: STATUS.EXPIRED });
                return { 
                    valid: false, 
                    reason: 'expired',
                    renewUrl: 'https://grperform.com/rinnova'
                };
            }
            
            return { 
                valid: true, 
                subscription: subscription,
                daysRemaining: getDaysRemaining(subscription)
            };
            
        } catch (error) {
            console.error('Errore verifica auth:', error);
            // In caso di errore rete, usa sessione locale
            const endDate = new Date(session.endDate);
            if (endDate > new Date()) {
                return { valid: true, offline: true };
            }
            return { valid: false, reason: 'expired' };
        }
    }

    /**
     * Rinnova abbonamento (chiamato dopo nuovo acquisto)
     */
    async function renewSubscription(subscriptionId, planType) {
        try {
            const newEndDate = calculateEndDate(planType);
            
            await getSupabase().update('subscriptions', subscriptionId, {
                plan_type: planType,
                status: STATUS.ACTIVE,
                end_date: newEndDate.toISOString()
            });
            
            await logAction(subscriptionId, 'renewed');
            
            console.log('✅ Abbonamento rinnovato:', subscriptionId);
            
            return { success: true, endDate: newEndDate };
            
        } catch (error) {
            console.error('❌ Errore rinnovo:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Cambia password
     */
    async function changePassword(subscriptionId, oldPassword, newPassword) {
        try {
            const results = await getSupabase().fetch('subscriptions', `?id=eq.${subscriptionId}&select=*`);
            
            if (!results || results.length === 0) {
                return { success: false, error: 'Abbonamento non trovato' };
            }
            
            const subscription = results[0];
            const oldHash = await hashPassword(oldPassword);
            
            if (subscription.password_hash !== oldHash) {
                return { success: false, error: 'Password attuale errata' };
            }
            
            const newHash = await hashPassword(newPassword);
            
            await getSupabase().update('subscriptions', subscriptionId, {
                password_hash: newHash
            });
            
            console.log('✅ Password cambiata');
            
            return { success: true };
            
        } catch (error) {
            console.error('❌ Errore cambio password:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Log azione
     */
    async function logAction(subscriptionId, action) {
        try {
            await getSupabase().insert('subscription_logs', {
                subscription_id: subscriptionId,
                action: action,
                user_agent: navigator.userAgent
            });
        } catch (e) {
            console.warn('Log action failed:', e);
        }
    }

    // ====================================
    // COACH: Funzioni Gestione
    // ====================================

    /**
     * [COACH] Lista tutti gli abbonamenti
     */
    async function listAllSubscriptions(filter = {}) {
        let query = '?select=*&order=created_at.desc';
        
        if (filter.status) {
            query += `&status=eq.${filter.status}`;
        }
        
        try {
            return await getSupabase().fetch('subscriptions', query);
        } catch (error) {
            console.error('Errore lista abbonamenti:', error);
            return [];
        }
    }

    /**
     * [COACH] Statistiche abbonamenti
     */
    async function getSubscriptionStats() {
        try {
            const all = await getSupabase().fetch('subscriptions', '?select=*');
            
            const now = new Date();
            const stats = {
                total: all.length,
                active: 0,
                expired: 0,
                expiringSoon: 0, // Scade entro 7 giorni
                cancelled: 0,
                monthly: 0,
                quarterly: 0,
                yearly: 0
            };
            
            all.forEach(sub => {
                // Status
                if (sub.status === 'active' && new Date(sub.end_date) > now) {
                    stats.active++;
                    
                    // Scade presto?
                    const daysLeft = getDaysRemaining(sub);
                    if (daysLeft <= 7) {
                        stats.expiringSoon++;
                    }
                } else if (sub.status === 'cancelled') {
                    stats.cancelled++;
                } else {
                    stats.expired++;
                }
                
                // Piano
                if (sub.plan_type === 'monthly') stats.monthly++;
                else if (sub.plan_type === 'quarterly') stats.quarterly++;
                else if (sub.plan_type === 'yearly') stats.yearly++;
            });
            
            return stats;
            
        } catch (error) {
            console.error('Errore stats:', error);
            return null;
        }
    }

    /**
     * [COACH] Crea abbonamento manuale
     */
    async function createManualSubscription(data) {
        return createSubscription(data);
    }

    /**
     * [COACH] Estendi abbonamento
     */
    async function extendSubscription(subscriptionId, days) {
        try {
            const results = await getSupabase().fetch('subscriptions', `?id=eq.${subscriptionId}&select=*`);
            
            if (!results || results.length === 0) {
                return { success: false, error: 'Non trovato' };
            }
            
            const sub = results[0];
            const currentEnd = new Date(sub.end_date);
            const now = new Date();
            
            // Se già scaduto, parti da oggi
            const baseDate = currentEnd > now ? currentEnd : now;
            baseDate.setDate(baseDate.getDate() + days);
            
            await getSupabase().update('subscriptions', subscriptionId, {
                end_date: baseDate.toISOString(),
                status: STATUS.ACTIVE
            });
            
            console.log(`✅ Esteso di ${days} giorni:`, subscriptionId);
            
            return { success: true, newEndDate: baseDate };
            
        } catch (error) {
            console.error('Errore estensione:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * [COACH] Cancella abbonamento
     */
    async function cancelSubscription(subscriptionId) {
        try {
            await getSupabase().update('subscriptions', subscriptionId, {
                status: STATUS.CANCELLED
            });
            
            await logAction(subscriptionId, 'cancelled');
            
            return { success: true };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * [COACH] Collega abbonamento ad atleta
     */
    async function linkToAthlete(subscriptionId, athleteId) {
        try {
            await getSupabase().update('subscriptions', subscriptionId, {
                athlete_id: athleteId
            });
            
            return { success: true };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // API Pubblica
    return {
        // Auth
        login,
        logout,
        getSession,
        checkAuth,
        changePassword,
        
        // Subscription
        createSubscription,
        renewSubscription,
        isSubscriptionActive,
        getDaysRemaining,
        calculateEndDate,
        
        // Coach Admin
        listAllSubscriptions,
        getSubscriptionStats,
        createManualSubscription,
        extendSubscription,
        cancelSubscription,
        linkToAthlete,
        
        // Utils
        generatePassword,
        
        // Constants
        PLAN_DURATIONS,
        STATUS,
        
        VERSION: '1.0.0'
    };
})();

// Export globale
if (typeof window !== 'undefined') {
    window.SubscriptionManager = SubscriptionManager;
}

console.log('🔐 Subscription Manager v1.0.0 loaded');
