// ================================================
// SUPABASE CLIENT - Life Tracker Cloud Sync
// ================================================

const LT_SUPABASE_URL = 'https://lmrrqvggziaecilswumm.supabase.co';
const LT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtcnJxdmdnemlhZWNpbHN3dW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMTA1MDcsImV4cCI6MjA4MTU4NjUwN30.N9K-gTnMme0zcvFiQbVQ1YdJIF69CFA_75Vmh5z6G4s';

// Initialize Supabase client (only if not already initialized)
let ltSupabase;
try {
    ltSupabase = window.supabase.createClient(LT_SUPABASE_URL, LT_SUPABASE_KEY);
} catch(e) {
    console.warn('Supabase already initialized');
}

// Helper function to sync water data from cloud
function syncWaterFromCloud(waterDataStr) {
    if (!waterDataStr) return;
    
    try {
        const waterArray = JSON.parse(waterDataStr);
        const today = new Date().toISOString().split('T')[0];
        const todayWater = waterArray.find(w => w.date === today);
        
        if (todayWater && todayWater.glasses > 0) {
            localStorage.setItem('lt_water_today', JSON.stringify({
                glasses: todayWater.glasses,
                date: today,
                maxReached: todayWater.glasses
            }));
            
            // Update display immediately
            if (typeof updateWaterDisplay === 'function') {
                updateWaterDisplay();
            }
        }
    } catch(e) {
        console.warn('Error syncing water from cloud:', e);
    }
}

let currentUser = null;
let ltMissingAppStateColumn = false;
let ltCloudSaveInFlight = null;
let ltCloudSaveQueued = false;

function ltDataUrlToBlob(dataUrl) {
    const parts = String(dataUrl || '').split(',');
    if (parts.length < 2) return new Blob([], { type: 'image/jpeg' });
    const mime = (parts[0].match(/:(.*?);/) || [])[1] || 'image/jpeg';
    const binary = atob(parts[1]);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
}

async function ltSyncPublicProfile(patch = {}) {
    try {
        if (!currentUser || !ltSupabase) return;
        await ensureProfileExistsFromAuth();

        const next = {};
        if (patch && typeof patch.name === 'string') next.name = patch.name;
        if (patch && typeof patch.avatar_url === 'string') next.avatar_url = patch.avatar_url;
        if (Object.keys(next).length === 0) return;
        next.updated_at = new Date().toISOString();

        await ltSupabase.from('profiles').update(next).eq('id', currentUser.id);
    } catch (e) {
        console.warn('ltSyncPublicProfile error:', e);
    }
}

async function ltUploadAvatarFromDataUrl(dataUrl) {
    try {
        if (!currentUser || !ltSupabase) return;
        await ensureProfileExistsFromAuth();

        const blob = ltDataUrlToBlob(dataUrl);
        const ext = (blob.type || 'image/jpeg').includes('png') ? 'png' : 'jpg';
        const path = `${currentUser.id}/avatar.${ext}`;

        const upload = await ltSupabase.storage
            .from('social')
            .upload(path, blob, { contentType: blob.type, upsert: true });

        if (upload.error) {
            if (typeof showToast === 'function') {
                const msg = String(upload.error.message || '').toLowerCase().includes('bucket not found')
                    ? 'Bucket Storage "social" mancante su Supabase'
                    : 'Upload avatar fallito (policy Storage?)';
                showToast(msg, 'warning');
            }
            throw upload.error;
        }

        const pub = ltSupabase.storage.from('social').getPublicUrl(path);
        const avatarUrl = pub.data && pub.data.publicUrl ? pub.data.publicUrl : null;
        if (avatarUrl) {
            await ltSyncPublicProfile({ avatar_url: avatarUrl });
        }
    } catch (e) {
        console.warn('ltUploadAvatarFromDataUrl error:', e);
    }
}

// Expose minimal helpers for app.js
window.ltUploadAvatarFromDataUrl = ltUploadAvatarFromDataUrl;
window.ltSyncPublicProfile = ltSyncPublicProfile;

async function ensureProfileExistsFromAuth() {
    if (!currentUser || !ltSupabase) return;

    const userId = currentUser.id;
    const email = currentUser.email || null;
    const name = currentUser.user_metadata?.name || (email ? email.split('@')[0] : null);

    let inviteCode = null;
    try {
        if (typeof getMyInviteCode === 'function') {
            inviteCode = getMyInviteCode();
        } else {
            inviteCode = localStorage.getItem('lt_invite_code') || null;
        }
        if (inviteCode) inviteCode = String(inviteCode).toUpperCase();
    } catch (_) {
        inviteCode = null;
    }

    try {
        const { data: existing, error: selErr } = await ltSupabase
            .from('profiles')
            .select('id, invite_code, name, email')
            .eq('id', userId)
            .maybeSingle();

        // If select fails due to policies, still try insert (it may succeed for own row)
        if (selErr) {
            // fallthrough to insert
        }

        if (!existing) {
            await ltSupabase
                .from('profiles')
                .insert({
                    id: userId,
                    email: email || '',
                    name: name,
                    invite_code: inviteCode,
                    created_at: new Date().toISOString()
                });
            return;
        }

        const patch = {};
        if (!existing.email && email) patch.email = email;
        if (!existing.name && name) patch.name = name;
        if ((!existing.invite_code || !String(existing.invite_code).trim()) && inviteCode) patch.invite_code = inviteCode;

        if (Object.keys(patch).length > 0) {
            patch.updated_at = new Date().toISOString();
            await ltSupabase.from('profiles').update(patch).eq('id', userId);
        }
    } catch (e) {
        console.warn('ensureProfileExistsFromAuth error:', e);
    }
}

function getLocalChangeMs() {
    const v = localStorage.getItem('lt_last_local_change_ms');
    const n = v ? Number(v) : 0;
    return Number.isFinite(n) ? n : 0;
}

function setLocalChangeMs(ms) {
    try {
        const value = String(ms);
        // Use direct Storage call if present, to avoid recursion
        if (typeof window.__ltOriginalSetItem === 'function') {
            window.__ltOriginalSetItem('lt_last_local_change_ms', value);
        } else {
            Storage.prototype.setItem.call(localStorage, 'lt_last_local_change_ms', value);
        }
    } catch (_) {
        // ignore
    }
}

async function flushCloudSave(reason = 'flush') {
    if (!currentUser || typeof saveToCloud !== 'function') return;

    // If already saving, queue one more pass
    if (ltCloudSaveInFlight) {
        ltCloudSaveQueued = true;
        return;
    }

    ltCloudSaveInFlight = (async () => {
        try {
            await saveToCloud();
        } catch (e) {
            console.warn(`Cloud save failed (${reason}):`, e);
        }
    })();

    await ltCloudSaveInFlight;
    ltCloudSaveInFlight = null;

    if (ltCloudSaveQueued) {
        ltCloudSaveQueued = false;
        // run one more time to capture last changes
        await flushCloudSave('queued');
    }
}

function ensureLocalProfileIdentityFromAuth() {
    if (!currentUser) return;
    try {
        const raw = localStorage.getItem('lt_profile') || '{}';
        const profile = JSON.parse(raw);
        const authName = currentUser.user_metadata?.name || currentUser.email?.split('@')?.[0];
        if (!profile.name && authName) {
            profile.name = authName;
            localStorage.setItem('lt_profile', JSON.stringify(profile));
        }
    } catch (e) {
        console.warn('ensureLocalProfileIdentityFromAuth error:', e);
    }
}

function collectLocalAppState() {
    const state = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (!key.startsWith('lt_')) continue;
        // Device-specific flag; don't sync
        if (key === 'lt_skip_login') continue;
        state[key] = localStorage.getItem(key);
    }
    return state;
}

function restoreLocalAppState(appStateStr) {
    if (!appStateStr) return false;
    try {
        const state = JSON.parse(appStateStr);
        if (!state || typeof state !== 'object') return false;

        Object.entries(state).forEach(([key, value]) => {
            if (!key || !key.startsWith('lt_')) return;
            if (key === 'lt_skip_login') return;
            if (typeof value !== 'string') return;
            localStorage.setItem(key, value);
        });
        return true;
    } catch (e) {
        console.warn('restoreLocalAppState error:', e);
        return false;
    }
}

function isNonEmptyJsonValue(value) {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (trimmed === '{}' || trimmed === '[]' || trimmed === 'null') return false;
    return true;
}

function shouldPreferLocalOverCloud(localValue, cloudValue) {
    // If cloud is empty/default but local has meaningful data, keep local.
    if (!isNonEmptyJsonValue(cloudValue) && isNonEmptyJsonValue(localValue)) return true;
    return false;
}

function setFromCloudIfPreferred(storageKey, cloudValue) {
    if (typeof cloudValue !== 'string') return;

    const localValue = localStorage.getItem(storageKey);
    if (shouldPreferLocalOverCloud(localValue, cloudValue)) return;

    localStorage.setItem(storageKey, cloudValue);
}

// ==================== AUTH FUNCTIONS ====================

async function signUp(email, password, name) {
    try {
        const { data, error } = await ltSupabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { name: name },
                emailRedirectTo: `${window.location.origin}/login.html`
            }
        });
        
        if (error) throw error;
        
        if (data.user) {
            let inviteCode = null;
            try {
                // Prefer app.js generator if present
                if (typeof getMyInviteCode === 'function') {
                    inviteCode = getMyInviteCode();
                } else {
                    inviteCode = localStorage.getItem('lt_invite_code') || null;
                }
            } catch (_) {
                inviteCode = null;
            }

            await ltSupabase.from('profiles').insert({
                id: data.user.id,
                email: email,
                name: name,
                invite_code: inviteCode,
                created_at: new Date().toISOString()
            });
        }
        
        return { success: true, data };
    } catch (error) {
        console.error('SignUp error:', error);
        return { success: false, error: error.message };
    }
}

async function signIn(email, password) {
    try {
        const { data, error } = await ltSupabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        currentUser = data.user;

        // Ensure FK targets exist (posts.user_id -> profiles.id)
        await ensureProfileExistsFromAuth();
        await loadUserDataFromCloud();
        
        return { success: true, data };
    } catch (error) {
        console.error('SignIn error:', error);
        return { success: false, error: error.message };
    }
}

async function signOut() {
    try {
        const { error } = await ltSupabase.auth.signOut();
        if (error) throw error;
        
        currentUser = null;
        return { success: true };
    } catch (error) {
        console.error('SignOut error:', error);
        return { success: false, error: error.message };
    }
}

async function getCurrentUser() {
    const { data: { user } } = await ltSupabase.auth.getUser();
    currentUser = user;
    return user;
}

async function checkAuth() {
    try {
        const { data: { session } } = await ltSupabase.auth.getSession();
        if (session) {
            currentUser = session.user;
            return true;
        }
    } catch(e) {
        console.warn('Auth check error:', e);
    }
    return false;
}

// ==================== DATA SYNC FUNCTIONS ====================

async function saveToCloud() {
    if (!currentUser) return { success: false, error: 'Non sei loggato' };
    
    try {
        const userData = {
            user_id: currentUser.id,
            goals: localStorage.getItem('lt_goals') || '[]',
            history: localStorage.getItem('lt_history') || '[]',
            metrics: localStorage.getItem('lt_metrics') || '[]',
            metric_values: localStorage.getItem('lt_metric_values') || '[]',
            documents: localStorage.getItem('lt_documents') || '[]',
            workout_exercises: localStorage.getItem('lt_workout_exercises') || '[]',
            runs: localStorage.getItem('lt_runs') || '[]',
            workout_sessions: localStorage.getItem('lt_workout_sessions') || '[]',
            profile: localStorage.getItem('lt_profile') || '{}',
            elite_user: localStorage.getItem('lt_user') || '{}',
            elite_badges: localStorage.getItem('lt_badges') || '[]',
            elite_streaks: localStorage.getItem('lt_streaks') || '{}',
            elite_moods: localStorage.getItem('lt_moods') || '[]',
            elite_water: localStorage.getItem('lt_water') || '[]',
            elite_sleep: localStorage.getItem('lt_sleep') || '[]',
            elite_journal: localStorage.getItem('lt_journal') || '[]',
            measurements: localStorage.getItem('lt_measurements') || '[]',
            // Optional, requires adding `app_state` column in Supabase
            app_state: JSON.stringify(collectLocalAppState()),
            updated_at: new Date().toISOString()
        };
        
        let { error } = await ltSupabase
            .from('user_data')
            .upsert(userData, { onConflict: 'user_id' });

        // Backward compatibility: if `app_state` column doesn't exist yet, retry without it.
        if (error && String(error.message || '').toLowerCase().includes('app_state')) {
            ltMissingAppStateColumn = true;
            const { app_state, ...withoutAppState } = userData;
            const retry = await ltSupabase
                .from('user_data')
                .upsert(withoutAppState, { onConflict: 'user_id' });
            error = retry.error;
        }
        
        if (error) throw error;

        // Best-effort: upsert friend-visible stats snapshot (requires `friend_stats` table)
        try {
            const eliteUser = JSON.parse(localStorage.getItem('lt_user') || '{}');
            const badges = JSON.parse(localStorage.getItem('lt_badges') || '[]');
            const goals = JSON.parse(localStorage.getItem('lt_goals') || '[]');
            const history = JSON.parse(localStorage.getItem('lt_history') || '[]');

            let streak = 0;
            try {
                if (typeof calculateOverallStreak === 'function') {
                    streak = calculateOverallStreak();
                }
            } catch (_) {
                streak = 0;
            }

            const totalHistory = Array.isArray(history) ? history.length : 0;
            const doneHistory = Array.isArray(history) ? history.filter(h => h && h.status === 'done').length : 0;
            const discipline = totalHistory ? Math.round((doneHistory / totalHistory) * 100) : 0;

            const statsSnapshot = {
                level: eliteUser.level || 1,
                streak,
                badges: Array.isArray(badges) ? badges.length : 0,
                goals: Array.isArray(goals) ? goals.length : 0,
                discipline
            };

            await ltSupabase
                .from('friend_stats')
                .upsert({
                    user_id: currentUser.id,
                    stats: statsSnapshot,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });
        } catch (_) {
            // ignore: table not present yet, RLS, etc.
        }

        // Track last successful cloud update time locally
        try {
            const nowIso = new Date().toISOString();
            if (typeof window.__ltOriginalSetItem === 'function') {
                window.__ltOriginalSetItem('lt_last_cloud_updated_at', nowIso);
            } else {
                Storage.prototype.setItem.call(localStorage, 'lt_last_cloud_updated_at', nowIso);
            }
        } catch (_) {
            // ignore
        }
        
        console.log('Data saved to cloud');
        return { success: true };
    } catch (error) {
        console.error('Save to cloud error:', error);
        return { success: false, error: error.message };
    }
}

async function loadUserDataFromCloud() {
    if (!currentUser) return { success: false, error: 'Non sei loggato' };
    
    try {
        const { data, error } = await ltSupabase
            .from('user_data')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
            const cloudUpdatedAt = data.updated_at ? Date.parse(data.updated_at) : 0;
            const localChangeMs = getLocalChangeMs();

            // If local has newer changes than cloud, do NOT overwrite local storage.
            // We'll push local up to cloud on init.
            if (localChangeMs && cloudUpdatedAt && localChangeMs > cloudUpdatedAt) {
                console.log('Skipping cloud overwrite: local data is newer');
                return { success: true, data, skipped: true, reason: 'local-newer' };
            }

            // Prefer full app state if available
            if (data.app_state) {
                restoreLocalAppState(data.app_state);
            }

            // Only overwrite local storage when cloud has meaningful data (avoid wiping on reload)
            if (data.goals) setFromCloudIfPreferred('lt_goals', data.goals);
            if (data.history) setFromCloudIfPreferred('lt_history', data.history);
            if (data.metrics) setFromCloudIfPreferred('lt_metrics', data.metrics);
            if (data.metric_values) setFromCloudIfPreferred('lt_metric_values', data.metric_values);
            if (data.documents) setFromCloudIfPreferred('lt_documents', data.documents);
            if (data.workout_exercises) setFromCloudIfPreferred('lt_workout_exercises', data.workout_exercises);
            if (data.runs) setFromCloudIfPreferred('lt_runs', data.runs);
            if (data.workout_sessions) setFromCloudIfPreferred('lt_workout_sessions', data.workout_sessions);

            if (data.profile) setFromCloudIfPreferred('lt_profile', data.profile);
            if (data.elite_user) setFromCloudIfPreferred('lt_user', data.elite_user);
            if (data.elite_badges) setFromCloudIfPreferred('lt_badges', data.elite_badges);
            if (data.elite_streaks) setFromCloudIfPreferred('lt_streaks', data.elite_streaks);
            if (data.elite_moods) setFromCloudIfPreferred('lt_moods', data.elite_moods);
            if (data.elite_water) setFromCloudIfPreferred('lt_water', data.elite_water);
            if (data.elite_sleep) setFromCloudIfPreferred('lt_sleep', data.elite_sleep);
            if (data.elite_journal) setFromCloudIfPreferred('lt_journal', data.elite_journal);
            if (data.measurements) setFromCloudIfPreferred('lt_measurements', data.measurements);
            
            // Sync water display from cloud data
            syncWaterFromCloud(data.elite_water);
            
            console.log('Data loaded from cloud');
        }
        
        return { success: true, data };
    } catch (error) {
        console.error('Load from cloud error:', error);
        return { success: false, error: error.message };
    }
}

function enableAutoSync() {
    if (localStorage.__lt_autoSyncEnabled) return;
    localStorage.__lt_autoSyncEnabled = true;

    let syncTimeout = null;

    const originalSetItem = localStorage.setItem.bind(localStorage);
    // expose for meta updates without recursion
    window.__ltOriginalSetItem = originalSetItem;

    localStorage.setItem = function(key, value) {
        originalSetItem(key, value);

        if (typeof key === 'string' && key.startsWith('lt_')) {
            // Don't mark meta keys as "user changes"
            if (key !== 'lt_last_local_change_ms' && key !== 'lt_last_cloud_updated_at' && key !== 'lt_warn_app_state') {
                setLocalChangeMs(Date.now());
            }

            if (syncTimeout) clearTimeout(syncTimeout);
            syncTimeout = setTimeout(() => {
                if (currentUser) {
                    flushCloudSave('autosync');
                }
            }, 1500);
        }
    };

    // Flush on app close / background
    window.addEventListener('pagehide', () => {
        flushCloudSave('pagehide');
    });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            flushCloudSave('hidden');
        }
    });
}

// ==================== UI FUNCTIONS ====================

function showAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('active');
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('active');
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.auth-tab[onclick*="${tab}"]`)?.classList.add('active');
    
    document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = event.target.querySelector('button[type="submit"]');
    
    btn.disabled = true;
    btn.textContent = 'Accesso...';
    
    const result = await signIn(email, password);
    
    if (result.success) {
        closeAuthModal();
        if (typeof showToast === 'function') showToast('Benvenuto! Dati sincronizzati', 'success');
        updateAuthUI();
        if (typeof loadAllData === 'function') loadAllData();
        if (typeof renderApp === 'function') renderApp();
    } else {
        if (typeof showToast === 'function') showToast(result.error || 'Errore di accesso', 'error');
    }
    
    btn.disabled = false;
    btn.textContent = 'ACCEDI';
}

async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const btn = event.target.querySelector('button[type="submit"]');
    
    if (password !== confirmPassword) {
        if (typeof showToast === 'function') showToast('Le password non coincidono', 'error');
        return;
    }
    
    if (password.length < 6) {
        if (typeof showToast === 'function') showToast('La password deve avere almeno 6 caratteri', 'error');
        return;
    }
    
    btn.disabled = true;
    btn.textContent = 'Registrazione...';
    
    const result = await signUp(email, password, name);
    
    if (result.success) {
        if (typeof showToast === 'function') showToast('Registrazione completata! Controlla la tua email.', 'success');
        switchAuthTab('login');
    } else {
        if (typeof showToast === 'function') showToast(result.error || 'Errore di registrazione', 'error');
    }
    
    btn.disabled = false;
    btn.textContent = 'REGISTRATI';
}

async function handleLogout() {
    // Best effort save before logging out
    try {
        await saveToCloud();
    } catch (e) {
        console.warn('Pre-logout save failed:', e);
    }
    const result = await signOut();
    if (result.success) {
        if (typeof showToast === 'function') showToast('Disconnesso', 'success');
        updateAuthUI();
        // Redirect to login
        window.location.href = 'login.html';
    }
}

function updateAuthUI() {
    const authBtn = document.getElementById('authButton');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const syncBtn = document.getElementById('syncButton');
    const userEmail = document.getElementById('userEmail');
    const accountSection = document.getElementById('accountSection');
    
    if (currentUser) {
        if (authBtn) authBtn.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (userName) userName.textContent = currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Utente';
        if (syncBtn) syncBtn.style.display = 'block';
        if (userEmail) userEmail.textContent = currentUser.email || '';
        if (accountSection) accountSection.style.display = 'block';
    } else {
        if (authBtn) authBtn.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (syncBtn) syncBtn.style.display = 'none';
        if (accountSection) accountSection.style.display = 'none';
    }
}

async function manualSync() {
    const btn = document.getElementById('syncButton');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }
    
    const result = await saveToCloud();
    
    if (result.success) {
        if (typeof showToast === 'function') showToast('Dati sincronizzati!', 'success');
    } else {
        if (typeof showToast === 'function') showToast('Errore sincronizzazione', 'error');
    }
    
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sync"></i>';
    }
}

// ==================== INITIALIZATION ====================

async function initSupabase() {
    try {
        const isLoggedIn = await checkAuth();
        // If logged in on this device, always hydrate local storage from cloud
        if (isLoggedIn) {
            await ensureProfileExistsFromAuth();
            const loadResult = await loadUserDataFromCloud();
            ensureLocalProfileIdentityFromAuth();
            enableAutoSync();

            // If we skipped cloud overwrite because local is newer, push local to cloud now.
            if (loadResult && loadResult.skipped && loadResult.reason === 'local-newer') {
                flushCloudSave('local-newer');
            }
        }

        // UI can update after DOM exists
        updateAuthUI();

        // If the schema isn't upgraded yet, nudge the user once
        if (isLoggedIn && ltMissingAppStateColumn) {
            const hasShown = localStorage.getItem('lt_warn_app_state') === '1';
            if (!hasShown) {
                localStorage.setItem('lt_warn_app_state', '1');
                if (typeof showToast === 'function') {
                    showToast('Sync foto/bg/progressi: abilita colonna app_state su Supabase', 'warning');
                }
            }
        }
        
        if (isLoggedIn) console.log('Logged in as:', currentUser?.email);
    } catch(e) {
        console.warn('Supabase init error:', e);
    }
}

// Start init ASAP so app.js can await it (cross-device hydration)
window.ltCloudInitPromise = initSupabase();

// Expose a minimal surface for other modules (e.g. social.js)
window.ltSupabase = ltSupabase;
window.ltGetCurrentUser = getCurrentUser;
window.ltGetCachedUser = () => currentUser;
