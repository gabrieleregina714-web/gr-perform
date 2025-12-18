// ================================================
// LIFE TRACKER ELITE - 100 FEATURES
// ================================================

// ==================== ELITE DATA STORAGE ====================
const ELITE_STORAGE = {
    user: 'lt_user',
    xp: 'lt_xp',
    badges: 'lt_badges',
    streaks: 'lt_streaks',
    moods: 'lt_moods',
    water: 'lt_water',
    sleep: 'lt_sleep',
    gratitude: 'lt_gratitude',
    journal: 'lt_journal',
    temptations: 'lt_temptations',
    triggers: 'lt_triggers',
    whyStarted: 'lt_why_started',
    futureSelf: 'lt_future_self',
    affirmations: 'lt_affirmations',
    wins: 'lt_wins',
    pomodoros: 'lt_pomodoros',
    calories: 'lt_calories',
    macros: 'lt_macros',
    fasting: 'lt_fasting',
    supplements: 'lt_supplements',
    measurements: 'lt_measurements',
    photos: 'lt_photos',
    challenges: 'lt_challenges',
    dailyTop3: 'lt_daily_top3',
    weeklyPlan: 'lt_weekly_plan',
    energy: 'lt_energy',
    focusSessions: 'lt_focus_sessions'
};

let eliteData = {
    user: {
        name: '',
        level: 1,
        xp: 0,
        totalXp: 0,
        title: 'Principiante',
        avatar: 1,
        joinDate: null
    },
    badges: [],
    streaks: {},
    moods: [],
    water: [],
    sleep: [],
    gratitude: [],
    journal: [],
    temptations: [],
    triggers: [],
    whyStarted: [],
    futureSelf: [],
    affirmations: [],
    wins: [],
    pomodoros: [],
    calories: [],
    macros: [],
    fasting: [],
    supplements: [],
    measurements: [],
    photos: [],
    challenges: [],
    dailyTop3: [],
    weeklyPlan: [],
    energy: [],
    focusSessions: []
};

// XP Rewards per action
const XP_REWARDS = {
    goalComplete: 50,
    goalSkipped: -10,
    streakDay: 10,
    streakWeek: 100,
    streakMonth: 500,
    workout: 30,
    waterGlass: 5,
    moodLog: 10,
    gratitudeLog: 15,
    journalEntry: 20,
    temptationResist: 100,
    meditationSession: 25,
    pomodoroComplete: 20,
    badgeEarned: 200,
    challengeComplete: 150,
    photoUploaded: 30,
    measurementLogged: 15
};

// Level thresholds
const LEVELS = [
    { level: 1, xp: 0, title: 'Principiante', color: '#737373' },
    { level: 2, xp: 100, title: 'Apprendista', color: '#22C55E' },
    { level: 3, xp: 300, title: 'Praticante', color: '#3B82F6' },
    { level: 4, xp: 600, title: 'Esperto', color: '#A855F7' },
    { level: 5, xp: 1000, title: 'Veterano', color: '#F59E0B' },
    { level: 6, xp: 1500, title: 'Maestro', color: '#EF4444' },
    { level: 7, xp: 2500, title: 'Campione', color: '#EC4899' },
    { level: 8, xp: 4000, title: 'Leggenda', color: '#FFD700' },
    { level: 9, xp: 6000, title: 'Mito', color: '#00FFFF' },
    { level: 10, xp: 10000, title: 'Divinità', color: '#FFFFFF' }
];

// All badges definitions
const BADGES = {
    // Streak badges
    streak7: { id: 'streak7', name: '7 Giorni', desc: 'Prima settimana completata', icon: 'fa-fire', color: '#F59E0B', xp: 100 },
    streak30: { id: 'streak30', name: '30 Giorni', desc: 'Un mese di disciplina', icon: 'fa-fire-flame-curved', color: '#EF4444', xp: 500 },
    streak100: { id: 'streak100', name: '100 Giorni', desc: 'Inarrestabile', icon: 'fa-meteor', color: '#A855F7', xp: 1000 },
    streak365: { id: 'streak365', name: '1 Anno', desc: 'Trasformazione completa', icon: 'fa-crown', color: '#FFD700', xp: 5000 },
    
    // Workout badges
    workout10: { id: 'workout10', name: '10 Workout', desc: 'Primi 10 allenamenti', icon: 'fa-dumbbell', color: '#3B82F6', xp: 100 },
    workout50: { id: 'workout50', name: '50 Workout', desc: 'Mezzo centinaio', icon: 'fa-dumbbell', color: '#22C55E', xp: 300 },
    workout100: { id: 'workout100', name: '100 Workout', desc: 'Centurione', icon: 'fa-dumbbell', color: '#FFD700', xp: 500 },
    
    // Mindset badges
    temptation10: { id: 'temptation10', name: 'Resistente', desc: '10 tentazioni superate', icon: 'fa-shield', color: '#22C55E', xp: 200 },
    temptation50: { id: 'temptation50', name: 'Invincibile', desc: '50 tentazioni superate', icon: 'fa-shield-halved', color: '#A855F7', xp: 500 },
    gratitude30: { id: 'gratitude30', name: 'Grato', desc: '30 giorni di gratitudine', icon: 'fa-heart', color: '#EC4899', xp: 300 },
    journal30: { id: 'journal30', name: 'Scrittore', desc: '30 voci di diario', icon: 'fa-book', color: '#3B82F6', xp: 300 },
    
    // Health badges
    water7: { id: 'water7', name: 'Idratato', desc: '7 giorni obiettivo acqua', icon: 'fa-droplet', color: '#3B82F6', xp: 100 },
    sleep7: { id: 'sleep7', name: 'Ben Riposato', desc: '7 giorni sonno ottimale', icon: 'fa-moon', color: '#A855F7', xp: 100 },
    meditation10: { id: 'meditation10', name: 'Zen', desc: '10 sessioni meditazione', icon: 'fa-om', color: '#22C55E', xp: 150 },
    
    // Productivity badges
    pomodoro25: { id: 'pomodoro25', name: 'Focalizzato', desc: '25 pomodoro completati', icon: 'fa-clock', color: '#EF4444', xp: 200 },
    pomodoro100: { id: 'pomodoro100', name: 'Produttivo', desc: '100 pomodoro completati', icon: 'fa-hourglass', color: '#FFD700', xp: 500 },
    
    // Special badges
    firstGoal: { id: 'firstGoal', name: 'Primo Passo', desc: 'Primo obiettivo creato', icon: 'fa-flag', color: '#22C55E', xp: 50 },
    perfectWeek: { id: 'perfectWeek', name: 'Settimana Perfetta', desc: '100% obiettivi in una settimana', icon: 'fa-star', color: '#FFD700', xp: 300 },
    earlyBird: { id: 'earlyBird', name: 'Mattiniero', desc: 'Completa obiettivo prima delle 7', icon: 'fa-sun', color: '#F59E0B', xp: 100 },
    nightOwl: { id: 'nightOwl', name: 'Nottambulo', desc: 'Completa obiettivo dopo le 23', icon: 'fa-moon', color: '#A855F7', xp: 100 },
    comeback: { id: 'comeback', name: 'Ritorno', desc: 'Riprendi dopo una ricaduta', icon: 'fa-rotate', color: '#3B82F6', xp: 150 }
};

// Daily Challenges pool
const DAILY_CHALLENGES = [
    { id: 'dc_water8', name: 'Bevi 8 bicchieri', icon: 'fa-droplet', xp: 30 },
    { id: 'dc_walk', name: 'Fai 5000 passi', icon: 'fa-person-walking', xp: 40 },
    { id: 'dc_meditate', name: 'Medita 10 minuti', icon: 'fa-om', xp: 30 },
    { id: 'dc_journal', name: 'Scrivi nel diario', icon: 'fa-pen', xp: 25 },
    { id: 'dc_gratitude', name: '3 cose per cui sei grato', icon: 'fa-heart', xp: 25 },
    { id: 'dc_stretch', name: '10 min stretching', icon: 'fa-child-reaching', xp: 25 },
    { id: 'dc_nosugar', name: 'Niente zuccheri', icon: 'fa-ban', xp: 50 },
    { id: 'dc_earlybed', name: 'A letto entro le 23', icon: 'fa-bed', xp: 30 },
    { id: 'dc_nophone', name: '1 ora senza telefono', icon: 'fa-mobile-screen', xp: 40 },
    { id: 'dc_coldshower', name: 'Doccia fredda', icon: 'fa-shower', xp: 50 },
    { id: 'dc_read', name: 'Leggi 20 pagine', icon: 'fa-book-open', xp: 30 },
    { id: 'dc_veggie', name: 'Mangia 5 porzioni verdure', icon: 'fa-carrot', xp: 35 },
    { id: 'dc_compliment', name: 'Fai un complimento', icon: 'fa-comment-dots', xp: 20 },
    { id: 'dc_declutter', name: 'Riordina una zona', icon: 'fa-broom', xp: 30 },
    { id: 'dc_learn', name: 'Impara qualcosa di nuovo', icon: 'fa-graduation-cap', xp: 35 }
];

// Motivational quotes
const QUOTES = [
    { text: "La disciplina è il ponte tra obiettivi e risultati.", author: "Jim Rohn" },
    { text: "Non contare i giorni, fai che i giorni contino.", author: "Muhammad Ali" },
    { text: "Il successo è la somma di piccoli sforzi ripetuti ogni giorno.", author: "Robert Collier" },
    { text: "Sii più forte delle tue scuse.", author: "Anonimo" },
    { text: "L'unico modo per fare un ottimo lavoro è amare quello che fai.", author: "Steve Jobs" },
    { text: "Il momento migliore per piantare un albero era 20 anni fa. Il secondo momento migliore è ora.", author: "Proverbio cinese" },
    { text: "Non è quello che fai ogni tanto a contare, ma quello che fai ogni giorno.", author: "Jenny Craig" },
    { text: "Credi di poterlo fare e sei già a metà strada.", author: "Theodore Roosevelt" },
    { text: "Il dolore della disciplina pesa grammi. Il rimpianto pesa tonnellate.", author: "Jim Rohn" },
    { text: "Ogni giorno è una nuova opportunità per cambiare la tua vita.", author: "Anonimo" }
];

// Breathing exercise patterns
const BREATHING_EXERCISES = [
    { name: '4-7-8 Rilassante', inhale: 4, hold: 7, exhale: 8, rounds: 4 },
    { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, holdOut: 4, rounds: 4 },
    { name: 'Energia', inhale: 4, hold: 0, exhale: 4, rounds: 10 },
    { name: 'Calma Profonda', inhale: 5, hold: 5, exhale: 10, rounds: 5 }
];

// ==================== ELITE INITIALIZATION ====================
async function initEliteFeatures() {
    try {
        // Wait for cloud sync to hydrate localStorage before computing elite stats
        if (window.ltCloudInitPromise) {
            try {
                await window.ltCloudInitPromise;
            } catch (e) {
                console.warn('Elite init: cloud hydration failed:', e);
            }
        }

        loadEliteData();
        initEliteUI();
        checkDailyReset();
        updateUserLevel();
        // Initialize mood display if already logged today
        setTimeout(() => {
            if (typeof EliteFeatures !== 'undefined' && EliteFeatures.initMoodDisplay) {
                EliteFeatures.initMoodDisplay();
            }
        }, 100);
        // Delay badge check to ensure data is loaded
        setTimeout(() => {
            try {
                checkBadges();
            } catch(e) {
                console.warn('Badge check error:', e);
            }
        }, 500);
        generateDailyChallenge();

        // Ensure profile stats reflect hydrated elite data
        if (typeof updateProfileStats === 'function') updateProfileStats();
        if (typeof updateRealStats === 'function') updateRealStats();

        console.log('Elite features initialized successfully');
    } catch(e) {
        console.error('Elite features init error:', e);
    }
}

function loadEliteData() {
    Object.keys(ELITE_STORAGE).forEach(key => {
        const stored = localStorage.getItem(ELITE_STORAGE[key]);
        if (stored) {
            eliteData[key] = JSON.parse(stored);
        }
    });
    
    // Initialize user if new
    if (!eliteData.user.joinDate) {
        eliteData.user.joinDate = new Date().toISOString();
        saveEliteData('user');
    }
    
    // Sync today's water from eliteData to lt_water_today
    syncWaterFromEliteData();
}

function syncWaterFromEliteData() {
    const today = getDateString(new Date());
    const todayWater = eliteData.water.find(w => w.date === today);
    
    if (todayWater && todayWater.glasses > 0) {
        const waterToday = JSON.parse(localStorage.getItem('lt_water_today') || '{"glasses": 0, "date": "", "maxReached": 0}');
        
        // Only update if eliteData has more glasses (cloud sync has newer data)
        if (todayWater.glasses > waterToday.glasses || waterToday.date !== today) {
            localStorage.setItem('lt_water_today', JSON.stringify({
                glasses: todayWater.glasses,
                date: today,
                maxReached: todayWater.glasses
            }));
        }
    }
}

function saveEliteData(key) {
    localStorage.setItem(ELITE_STORAGE[key], JSON.stringify(eliteData[key]));
}

function checkDailyReset() {
    const today = getDateString(new Date());
    const lastVisit = localStorage.getItem('lt_last_visit');
    
    if (lastVisit !== today) {
        // New day! Reset everything
        console.log('New day detected - resetting daily data');
        
        // 1. Reset water tracker
        localStorage.setItem('lt_water_today', JSON.stringify({
            glasses: 0,
            date: today,
            maxReached: 0
        }));
        
        // 2. Reset mood display (mood data is already per-date, just reset UI)
        const moodFaces = document.getElementById('moodFaces');
        const moodSelected = document.getElementById('moodSelected');
        const editMoodBtn = document.getElementById('editMoodBtn');
        if (moodFaces) moodFaces.style.display = 'flex';
        if (moodSelected) {
            moodSelected.style.display = 'none';
            moodSelected.classList.remove('active');
        }
        if (editMoodBtn) editMoodBtn.style.display = 'none';
        
        // 3. Reset daily goals completion status
        if (typeof resetDailyGoals === 'function') {
            resetDailyGoals();
        }
        
        // 4. Reset priorities (clear for new day)
        localStorage.setItem('lt_priorities', JSON.stringify([]));
        
        // 5. Generate new challenge
        generateDailyChallenge();
        
        // 6. Update UI
        if (typeof updateWaterDisplay === 'function') {
            updateWaterDisplay();
        }
        if (typeof loadPriorities === 'function') {
            loadPriorities();
        }
        if (typeof renderAllGoals === 'function') {
            renderAllGoals();
        }
        
        localStorage.setItem('lt_last_visit', today);
        
        showToast('🌅 Nuovo giorno! Tutto resettato.', 'success');
    }
}

// Also check periodically for midnight reset
setInterval(() => {
    const today = getDateString(new Date());
    const lastVisit = localStorage.getItem('lt_last_visit');
    if (lastVisit !== today) {
        checkDailyReset();
    }
}, 60000); // Check every minute

// ==================== XP & LEVELING SYSTEM ====================
function addXP(amount, reason = '') {
    eliteData.user.xp += amount;
    eliteData.user.totalXp += amount;
    saveEliteData('user');
    
    const oldLevel = eliteData.user.level;
    updateUserLevel();
    
    if (eliteData.user.level > oldLevel) {
        showLevelUpAnimation(eliteData.user.level);
    }
    
    if (amount > 0) {
        showXPPopup(amount, reason);
    }
    
    renderEliteHeader();
}

function updateUserLevel() {
    let newLevel = 1;
    for (const lvl of LEVELS) {
        if (eliteData.user.totalXp >= lvl.xp) {
            newLevel = lvl.level;
            eliteData.user.title = lvl.title;
        }
    }
    eliteData.user.level = newLevel;
    saveEliteData('user');
}

function getXPForNextLevel() {
    const currentLevel = LEVELS.find(l => l.level === eliteData.user.level);
    const nextLevel = LEVELS.find(l => l.level === eliteData.user.level + 1);
    if (!nextLevel) return { current: eliteData.user.totalXp, needed: eliteData.user.totalXp, percent: 100 };
    
    const xpInLevel = eliteData.user.totalXp - currentLevel.xp;
    const xpNeeded = nextLevel.xp - currentLevel.xp;
    return { current: xpInLevel, needed: xpNeeded, percent: Math.round((xpInLevel / xpNeeded) * 100) };
}

function showXPPopup(amount, reason) {
    const popup = document.createElement('div');
    popup.className = 'xp-popup';
    popup.innerHTML = `+${amount} XP`;
    document.body.appendChild(popup);
    
    setTimeout(() => popup.classList.add('show'), 10);
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }, 1500);
}

function showLevelUpAnimation(level) {
    const levelData = LEVELS.find(l => l.level === level);
    const overlay = document.createElement('div');
    overlay.className = 'level-up-overlay';
    overlay.innerHTML = `
        <div class="level-up-content">
            <div class="level-up-icon"><i class="fas fa-arrow-up"></i></div>
            <h2>LEVEL UP!</h2>
            <div class="level-up-level" style="color: ${levelData.color}">Livello ${level}</div>
            <div class="level-up-title">${levelData.title}</div>
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">CONTINUA</button>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('show'), 10);
}

// ==================== BADGE SYSTEM ====================
function checkBadges() {
    const earnedBadges = eliteData.badges.map(b => b.id);
    
    // Check streak badges
    const maxStreak = getMaxStreak();
    if (maxStreak >= 7 && !earnedBadges.includes('streak7')) awardBadge('streak7');
    if (maxStreak >= 30 && !earnedBadges.includes('streak30')) awardBadge('streak30');
    if (maxStreak >= 100 && !earnedBadges.includes('streak100')) awardBadge('streak100');
    if (maxStreak >= 365 && !earnedBadges.includes('streak365')) awardBadge('streak365');
    
    // Check workout badges
    const workoutCount = data.exercises?.length || 0;
    if (workoutCount >= 10 && !earnedBadges.includes('workout10')) awardBadge('workout10');
    if (workoutCount >= 50 && !earnedBadges.includes('workout50')) awardBadge('workout50');
    if (workoutCount >= 100 && !earnedBadges.includes('workout100')) awardBadge('workout100');
    
    // Check temptation badges
    const temptationCount = eliteData.temptations.length;
    if (temptationCount >= 10 && !earnedBadges.includes('temptation10')) awardBadge('temptation10');
    if (temptationCount >= 50 && !earnedBadges.includes('temptation50')) awardBadge('temptation50');
    
    // Check gratitude badge
    const gratitudeCount = eliteData.gratitude.length;
    if (gratitudeCount >= 30 && !earnedBadges.includes('gratitude30')) awardBadge('gratitude30');
    
    // Check journal badge
    const journalCount = eliteData.journal.length;
    if (journalCount >= 30 && !earnedBadges.includes('journal30')) awardBadge('journal30');
    
    // Check first goal badge
    if (data.goals?.length >= 1 && !earnedBadges.includes('firstGoal')) awardBadge('firstGoal');
    
    // Check pomodoro badges
    const pomodoroCount = eliteData.pomodoros.length;
    if (pomodoroCount >= 25 && !earnedBadges.includes('pomodoro25')) awardBadge('pomodoro25');
    if (pomodoroCount >= 100 && !earnedBadges.includes('pomodoro100')) awardBadge('pomodoro100');
}

function awardBadge(badgeId) {
    const badge = BADGES[badgeId];
    if (!badge) return;
    
    eliteData.badges.push({
        id: badgeId,
        earnedAt: new Date().toISOString()
    });
    saveEliteData('badges');
    
    addXP(badge.xp, `Badge: ${badge.name}`);
    showBadgeEarnedAnimation(badge);
}

function showBadgeEarnedAnimation(badge) {
    const overlay = document.createElement('div');
    overlay.className = 'badge-earned-overlay';
    overlay.innerHTML = `
        <div class="badge-earned-content">
            <div class="badge-earned-icon" style="background: ${badge.color}20; color: ${badge.color}">
                <i class="fas ${badge.icon}"></i>
            </div>
            <h2>BADGE SBLOCCATO!</h2>
            <div class="badge-earned-name">${badge.name}</div>
            <div class="badge-earned-desc">${badge.desc}</div>
            <div class="badge-earned-xp">+${badge.xp} XP</div>
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">FANTASTICO!</button>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('show'), 10);
}

function getMaxStreak() {
    let maxStreak = 0;
    data.goals?.forEach(goal => {
        const streak = calculateGoalStreak(goal.id);
        if (streak > maxStreak) maxStreak = streak;
    });
    return maxStreak;
}

// ==================== STREAK SYSTEM ====================
function updateStreaks() {
    const today = getDateString(new Date());
    
    data.goals?.forEach(goal => {
        const streak = calculateGoalStreak(goal.id);
        if (!eliteData.streaks[goal.id]) {
            eliteData.streaks[goal.id] = { current: 0, max: 0 };
        }
        eliteData.streaks[goal.id].current = streak;
        if (streak > eliteData.streaks[goal.id].max) {
            eliteData.streaks[goal.id].max = streak;
        }
    });
    
    saveEliteData('streaks');
}

// ==================== EMERGENCY SOS ====================
function openSOSModal() {
    const modal = document.getElementById('sosModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderSOSContent();
    }
}

function renderSOSContent() {
    const content = document.getElementById('sosContent');
    if (!content) return;
    
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const whyReasons = eliteData.whyStarted.slice(0, 3);
    
    content.innerHTML = `
        <div class="sos-quote">
            <i class="fas fa-quote-left"></i>
            <p>${quote.text}</p>
            <span>— ${quote.author}</span>
        </div>
        
        ${whyReasons.length > 0 ? `
            <div class="sos-why">
                <h3><i class="fas fa-heart"></i> PERCHÉ HAI INIZIATO</h3>
                ${whyReasons.map(r => `<div class="sos-reason">${r.text}</div>`).join('')}
            </div>
        ` : ''}
        
        <div class="sos-actions">
            <button class="btn btn-success btn-full" onclick="logTemptationResisted(); closeModal('sosModal');">
                <i class="fas fa-shield"></i> CE L'HO FATTA!
            </button>
            <button class="btn btn-secondary btn-full" onclick="openBreathingExercise()">
                <i class="fas fa-wind"></i> RESPIRA
            </button>
            <button class="btn btn-secondary btn-full" onclick="showDistractingTasks()">
                <i class="fas fa-list"></i> DISTRAIMI
            </button>
        </div>
    `;
}

function logTemptationResisted() {
    eliteData.temptations.push({
        id: generateId(),
        date: new Date().toISOString(),
        resisted: true
    });
    saveEliteData('temptations');
    addXP(XP_REWARDS.temptationResist, 'Tentazione superata!');
    checkBadges();
    showToast('💪 HAI RESISTITO! +100 XP', 'success');
}

// ==================== MOOD TRACKER ====================
function logMood(value, note = '') {
    const today = getDateString(new Date());
    
    // Check if mood already logged today
    const existingMood = eliteData.moods.find(m => m.date === today);
    const isFirstMoodToday = !existingMood;
    
    // Remove existing mood for today
    eliteData.moods = eliteData.moods.filter(m => m.date !== today);
    
    eliteData.moods.push({
        id: generateId(),
        date: today,
        value, // 1-5
        note,
        timestamp: new Date().toISOString()
    });
    saveEliteData('moods');
    
    // Only give XP for first mood log of the day
    if (isFirstMoodToday) {
        addXP(XP_REWARDS.moodLog, 'Mood registrato');
    }
}

function getTodayMood() {
    const today = getDateString(new Date());
    return eliteData.moods.find(m => m.date === today);
}

// ==================== WATER TRACKER ====================
function addWater(glasses = 1) {
    const today = getDateString(new Date());
    let todayWater = eliteData.water.find(w => w.date === today);
    
    if (!todayWater) {
        todayWater = { date: today, glasses: 0, goal: 8 };
        eliteData.water.push(todayWater);
    }
    
    todayWater.glasses += glasses;
    saveEliteData('water');
    addXP(XP_REWARDS.waterGlass * glasses, 'Acqua bevuta');
    renderWaterTracker();
    
    // Update minimal display
    if (typeof updateWaterDisplay === 'function') {
        updateWaterDisplay();
    }
}

function adjustWater(delta) {
    const today = getDateString(new Date());
    let waterData = JSON.parse(localStorage.getItem('lt_water_today') || '{"glasses": 0, "date": "", "maxReached": 0}');
    
    if (waterData.date !== today) {
        waterData = { glasses: 0, date: today, maxReached: 0 };
    }
    
    const oldGlasses = waterData.glasses;
    waterData.glasses = Math.max(0, Math.min(8, waterData.glasses + delta));
    
    // Track max reached to prevent XP exploit
    const prevMax = waterData.maxReached || 0;
    
    // Only give XP if we're reaching a NEW maximum (not re-adding after removing)
    if (waterData.glasses > prevMax) {
        const newGlasses = waterData.glasses - prevMax;
        waterData.maxReached = waterData.glasses;
        addXP(XP_REWARDS.waterGlass * newGlasses, 'Acqua bevuta');
    }
    
    localStorage.setItem('lt_water_today', JSON.stringify(waterData));
    
    // Sync with elite data
    let todayWaterElite = eliteData.water.find(w => w.date === today);
    if (!todayWaterElite) {
        todayWaterElite = { date: today, glasses: 0, goal: 8 };
        eliteData.water.push(todayWaterElite);
    }
    todayWaterElite.glasses = waterData.glasses;
    saveEliteData('water');
    
    // Update display
    if (typeof updateWaterDisplay === 'function') {
        updateWaterDisplay();
    }
}

function getTodayWater() {
    const today = getDateString(new Date());
    return eliteData.water.find(w => w.date === today) || { glasses: 0, goal: 8 };
}

// ==================== SLEEP TRACKER ====================
function logSleep(hours, quality) {
    const today = getDateString(new Date());
    
    eliteData.sleep = eliteData.sleep.filter(s => s.date !== today);
    eliteData.sleep.push({
        id: generateId(),
        date: today,
        hours,
        quality, // 1-5
        timestamp: new Date().toISOString()
    });
    saveEliteData('sleep');
}

// ==================== GRATITUDE JOURNAL ====================
function addGratitude(items) {
    const today = getDateString(new Date());
    
    eliteData.gratitude.push({
        id: generateId(),
        date: today,
        items, // array of 3 strings
        timestamp: new Date().toISOString()
    });
    saveEliteData('gratitude');
    addXP(XP_REWARDS.gratitudeLog, 'Gratitudine');
    checkBadges();
}

// ==================== JOURNAL ====================
function addJournalEntry(content, mood) {
    eliteData.journal.push({
        id: generateId(),
        date: new Date().toISOString(),
        content,
        mood
    });
    saveEliteData('journal');
    addXP(XP_REWARDS.journalEntry, 'Voce diario');
    checkBadges();
}

// ==================== WHY I STARTED ====================
function addWhyStarted(text) {
    eliteData.whyStarted.push({
        id: generateId(),
        text,
        createdAt: new Date().toISOString()
    });
    saveEliteData('whyStarted');
}

// ==================== FUTURE SELF LETTER ====================
function addFutureSelfLetter(text, openDate) {
    eliteData.futureSelf.push({
        id: generateId(),
        text,
        openDate,
        createdAt: new Date().toISOString(),
        opened: false
    });
    saveEliteData('futureSelf');
}

// ==================== DAILY CHALLENGES ====================
function generateDailyChallenge() {
    const today = getDateString(new Date());
    const existing = eliteData.challenges.find(c => c.date === today);
    if (existing) return;
    
    // Pick 3 random challenges
    const shuffled = [...DAILY_CHALLENGES].sort(() => Math.random() - 0.5);
    const todayChallenges = shuffled.slice(0, 3).map(c => ({
        ...c,
        completed: false
    }));
    
    eliteData.challenges.push({
        date: today,
        challenges: todayChallenges
    });
    saveEliteData('challenges');
}

function getTodayChallenges() {
    const today = getDateString(new Date());
    return eliteData.challenges.find(c => c.date === today)?.challenges || [];
}

function completeDailyChallenge(challengeId) {
    const today = getDateString(new Date());
    const todayData = eliteData.challenges.find(c => c.date === today);
    if (!todayData) return;
    
    const challenge = todayData.challenges.find(c => c.id === challengeId);
    if (challenge && !challenge.completed) {
        challenge.completed = true;
        saveEliteData('challenges');
        addXP(challenge.xp, `Sfida: ${challenge.name}`);
        renderDailyChallenges();
    }
}

// ==================== POMODORO TIMER ====================
let pomodoroInterval = null;
let pomodoroTimeLeft = 25 * 60;
let pomodoroRunning = false;
let pomodoroType = 'work'; // work, break, longBreak

function startPomodoro() {
    if (pomodoroRunning) return;
    
    pomodoroRunning = true;
    pomodoroInterval = setInterval(() => {
        pomodoroTimeLeft--;
        renderPomodoroTimer();
        
        if (pomodoroTimeLeft <= 0) {
            completePomodoro();
        }
    }, 1000);
    
    renderPomodoroTimer();
}

function pausePomodoro() {
    pomodoroRunning = false;
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
    }
    renderPomodoroTimer();
}

function resetPomodoro() {
    pausePomodoro();
    pomodoroTimeLeft = pomodoroType === 'work' ? 25 * 60 : pomodoroType === 'break' ? 5 * 60 : 15 * 60;
    renderPomodoroTimer();
}

function completePomodoro() {
    pausePomodoro();
    
    if (pomodoroType === 'work') {
        eliteData.pomodoros.push({
            id: generateId(),
            date: new Date().toISOString(),
            duration: 25
        });
        saveEliteData('pomodoros');
        addXP(XP_REWARDS.pomodoroComplete, 'Pomodoro completato');
        checkBadges();
        
        // Show notification
        if (Notification.permission === 'granted') {
            new Notification('🍅 Pomodoro Completato!', {
                body: 'Tempo per una pausa di 5 minuti.',
                icon: '/icons/icon-192.png'
            });
        }
        
        // Switch to break
        pomodoroType = 'break';
        pomodoroTimeLeft = 5 * 60;
    } else {
        // Switch back to work
        pomodoroType = 'work';
        pomodoroTimeLeft = 25 * 60;
    }
    
    renderPomodoroTimer();
}

// ==================== BREATHING EXERCISE ====================
let breathingInterval = null;
let breathingPhase = 'inhale';
let breathingTimeLeft = 0;

function openBreathingExercise(exerciseIndex = 0) {
    const exercise = BREATHING_EXERCISES[exerciseIndex];
    const modal = document.getElementById('breathingModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        startBreathingExercise(exercise);
    }
}

function startBreathingExercise(exercise) {
    // Implementation of breathing animation
    // This would control the breathing circle animation
}

// ==================== HEATMAP ====================
function generateHeatmapData() {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const heatmapData = [];
    
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = getDateString(new Date(d));
        const dow = d.getDay();
        
        const dayGoals = data.goals?.filter(g => isGoalScheduledForDay(g, dow)) || [];
        const done = dayGoals.filter(g => {
            const entry = data.history?.find(h => h.goalId === g.id && h.date === dateStr);
            return entry?.status === 'done';
        }).length;
        
        const percent = dayGoals.length > 0 ? Math.round((done / dayGoals.length) * 100) : 0;
        
        heatmapData.push({
            date: dateStr,
            value: percent,
            goals: dayGoals.length,
            done
        });
    }
    
    return heatmapData;
}

// ==================== WEEKLY REPORT ====================
function generateWeeklyReport() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekHistory = data.history?.filter(h => new Date(h.date) >= weekAgo) || [];
    const completed = weekHistory.filter(h => h.status === 'done').length;
    const skipped = weekHistory.filter(h => h.status === 'skipped').length;
    const blocked = weekHistory.filter(h => h.status === 'blocked').length;
    
    const workouts = data.exercises?.filter(e => new Date(e.date) >= weekAgo).length || 0;
    const waterDays = eliteData.water.filter(w => new Date(w.date) >= weekAgo && w.glasses >= w.goal).length;
    const moodAvg = calculateAverageMood(7);
    
    return {
        period: `${weekAgo.toLocaleDateString('it-IT')} - ${today.toLocaleDateString('it-IT')}`,
        goals: { completed, skipped, blocked, total: completed + skipped + blocked },
        workouts,
        waterDays,
        moodAvg,
        xpEarned: eliteData.user.totalXp, // This would need to track weekly
        successRate: completed + skipped + blocked > 0 ? Math.round((completed / (completed + skipped + blocked)) * 100) : 0
    };
}

function calculateAverageMood(days) {
    const recent = eliteData.moods.slice(-days);
    if (recent.length === 0) return 0;
    const sum = recent.reduce((acc, m) => acc + m.value, 0);
    return Math.round((sum / recent.length) * 10) / 10;
}

// ==================== CALORIES & MACROS ====================
function logCalories(amount, mealType, description = '') {
    const today = getDateString(new Date());
    
    eliteData.calories.push({
        id: generateId(),
        date: today,
        amount,
        mealType, // breakfast, lunch, dinner, snack
        description,
        timestamp: new Date().toISOString()
    });
    saveEliteData('calories');
}

function getTodayCalories() {
    const today = getDateString(new Date());
    return eliteData.calories
        .filter(c => c.date === today)
        .reduce((sum, c) => sum + c.amount, 0);
}

function logMacros(protein, carbs, fat) {
    const today = getDateString(new Date());
    
    eliteData.macros.push({
        id: generateId(),
        date: today,
        protein,
        carbs,
        fat,
        timestamp: new Date().toISOString()
    });
    saveEliteData('macros');
}

// ==================== FASTING TRACKER ====================
let fastingStartTime = null;
let fastingInterval = null;

function startFasting() {
    fastingStartTime = new Date();
    localStorage.setItem('lt_fasting_start', fastingStartTime.toISOString());
    
    fastingInterval = setInterval(renderFastingTimer, 1000);
    renderFastingTimer();
}

function endFasting() {
    if (!fastingStartTime) return;
    
    const endTime = new Date();
    const duration = (endTime - fastingStartTime) / 1000 / 60 / 60; // hours
    
    eliteData.fasting.push({
        id: generateId(),
        start: fastingStartTime.toISOString(),
        end: endTime.toISOString(),
        hours: Math.round(duration * 10) / 10
    });
    saveEliteData('fasting');
    
    fastingStartTime = null;
    localStorage.removeItem('lt_fasting_start');
    clearInterval(fastingInterval);
    
    renderFastingTimer();
}

// ==================== SUPPLEMENTS TRACKER ====================
function logSupplement(name) {
    const today = getDateString(new Date());
    
    eliteData.supplements.push({
        id: generateId(),
        date: today,
        name,
        timestamp: new Date().toISOString()
    });
    saveEliteData('supplements');
}

// ==================== BODY MEASUREMENTS ====================
function logMeasurement(type, value) {
    eliteData.measurements.push({
        id: generateId(),
        date: new Date().toISOString(),
        type, // chest, waist, hips, arms, thighs, etc.
        value
    });
    saveEliteData('measurements');
    addXP(XP_REWARDS.measurementLogged, 'Misurazione');
}

// ==================== PROGRESS PHOTOS ====================
function addProgressPhoto(dataUrl, note = '') {
    eliteData.photos.push({
        id: generateId(),
        date: new Date().toISOString(),
        data: dataUrl,
        note
    });
    saveEliteData('photos');
    addXP(XP_REWARDS.photoUploaded, 'Foto progresso');
}

// ==================== DAILY TOP 3 ====================
function setDailyTop3(tasks) {
    const today = getDateString(new Date());
    
    eliteData.dailyTop3 = eliteData.dailyTop3.filter(t => t.date !== today);
    eliteData.dailyTop3.push({
        date: today,
        tasks: tasks.map((t, i) => ({
            id: i + 1,
            text: t,
            completed: false
        }))
    });
    saveEliteData('dailyTop3');
}

function completeDailyTop3Task(taskId) {
    const today = getDateString(new Date());
    const todayData = eliteData.dailyTop3.find(t => t.date === today);
    if (!todayData) return;
    
    const task = todayData.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveEliteData('dailyTop3');
        renderDailyTop3();
    }
}

// ==================== ENERGY TRACKING ====================
function logEnergy(level, time = null) {
    eliteData.energy.push({
        id: generateId(),
        timestamp: time || new Date().toISOString(),
        level // 1-5
    });
    saveEliteData('energy');
}

// ==================== QUOTE OF THE DAY ====================
function getQuoteOfTheDay() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    return QUOTES[dayOfYear % QUOTES.length];
}

// ==================== AFFIRMATIONS ====================
function addAffirmation(text) {
    eliteData.affirmations.push({
        id: generateId(),
        text,
        createdAt: new Date().toISOString()
    });
    saveEliteData('affirmations');
}

function getRandomAffirmation() {
    if (eliteData.affirmations.length === 0) return null;
    return eliteData.affirmations[Math.floor(Math.random() * eliteData.affirmations.length)];
}

// ==================== WINS JOURNAL ====================
function addWin(text) {
    eliteData.wins.push({
        id: generateId(),
        text,
        date: new Date().toISOString()
    });
    saveEliteData('wins');
    addXP(15, 'Vittoria registrata');
}

// ==================== DISTRACTION TASKS ====================
const DISTRACTION_TASKS = [
    { icon: 'fa-person-walking', text: 'Fai una passeggiata di 10 minuti' },
    { icon: 'fa-phone', text: 'Chiama un amico' },
    { icon: 'fa-music', text: 'Ascolta la tua canzone preferita' },
    { icon: 'fa-shower', text: 'Fai una doccia fredda' },
    { icon: 'fa-dumbbell', text: '20 jumping jacks' },
    { icon: 'fa-glass-water', text: 'Bevi un bicchiere d\'acqua' },
    { icon: 'fa-lungs', text: 'Fai 10 respiri profondi' },
    { icon: 'fa-broom', text: 'Riordina la tua scrivania' },
    { icon: 'fa-book', text: 'Leggi 5 pagine di un libro' },
    { icon: 'fa-pen', text: 'Scrivi cosa provi in questo momento' }
];

function showDistractingTasks() {
    const shuffled = [...DISTRACTION_TASKS].sort(() => Math.random() - 0.5);
    const content = document.getElementById('sosContent');
    if (!content) return;
    
    content.innerHTML = `
        <h3><i class="fas fa-shuffle"></i> DISTRAITI CON QUESTE ATTIVITÀ</h3>
        <div class="distraction-list">
            ${shuffled.slice(0, 5).map(t => `
                <div class="distraction-item">
                    <i class="fas ${t.icon}"></i>
                    <span>${t.text}</span>
                </div>
            `).join('')}
        </div>
        <button class="btn btn-success btn-full" onclick="logTemptationResisted(); closeModal('sosModal');">
            <i class="fas fa-shield"></i> CE L'HO FATTA!
        </button>
    `;
}

// ==================== CORRELATION FINDER ====================
function findCorrelations() {
    const correlations = [];
    
    // Check mood vs sleep correlation
    const sleepMoodCorr = calculateSleepMoodCorrelation();
    if (sleepMoodCorr) correlations.push(sleepMoodCorr);
    
    // Check workout vs mood correlation
    const workoutMoodCorr = calculateWorkoutMoodCorrelation();
    if (workoutMoodCorr) correlations.push(workoutMoodCorr);
    
    // Check water vs energy correlation
    const waterEnergyCorr = calculateWaterEnergyCorrelation();
    if (waterEnergyCorr) correlations.push(waterEnergyCorr);
    
    return correlations;
}

function calculateSleepMoodCorrelation() {
    // Simple correlation analysis
    const sleepDays = new Map();
    eliteData.sleep.forEach(s => sleepDays.set(s.date, s.hours));
    
    const moodDays = new Map();
    eliteData.moods.forEach(m => moodDays.set(m.date, m.value));
    
    const pairs = [];
    sleepDays.forEach((hours, date) => {
        if (moodDays.has(date)) {
            pairs.push({ sleep: hours, mood: moodDays.get(date) });
        }
    });
    
    if (pairs.length < 7) return null;
    
    const goodSleep = pairs.filter(p => p.sleep >= 7);
    const badSleep = pairs.filter(p => p.sleep < 7);
    
    const goodMoodAvg = goodSleep.length > 0 ? goodSleep.reduce((s, p) => s + p.mood, 0) / goodSleep.length : 0;
    const badMoodAvg = badSleep.length > 0 ? badSleep.reduce((s, p) => s + p.mood, 0) / badSleep.length : 0;
    
    if (goodMoodAvg - badMoodAvg > 0.5) {
        return {
            type: 'positive',
            icon: 'fa-moon',
            text: `Quando dormi 7+ ore, il tuo umore è in media ${Math.round((goodMoodAvg - badMoodAvg) * 20)}% migliore`
        };
    }
    return null;
}

function calculateWorkoutMoodCorrelation() {
    // Similar analysis for workout days
    return null; // Simplified for now
}

function calculateWaterEnergyCorrelation() {
    // Similar analysis for water intake
    return null; // Simplified for now
}

// ==================== PREDICTION ENGINE ====================
function predictGoalCompletion(goalId) {
    const entries = data.history?.filter(h => h.goalId === goalId) || [];
    if (entries.length < 7) return null;
    
    const recentRate = entries.slice(-30).filter(e => e.status === 'done').length / 
                       Math.min(entries.slice(-30).length, 30);
    
    // Simple linear prediction
    if (recentRate >= 0.9) return 'Eccellente! Mantieni questo ritmo';
    if (recentRate >= 0.7) return 'Buon progresso, continua così';
    if (recentRate >= 0.5) return 'Puoi migliorare, punta al 70%';
    return 'Attenzione: tasso di completamento basso';
}

// ==================== UI RENDERING ====================
function initEliteUI() {
    renderEliteHeader();
    renderDailyChallenges();
    renderWaterTracker();
    renderMoodSelector();
    renderPomodoroTimer();
    renderDailyTop3();
    renderQuoteOfDay();
    renderHeatmap();
    renderWeeklyReport();
    renderBadgesWall();
    renderWhyStarted();
    renderWinsJournal();
    renderMeasurements();
    renderPhotosGrid();
    renderCorrelations();
    
    // Load fasting state
    const savedFastingStart = localStorage.getItem('lt_fasting_start');
    if (savedFastingStart) {
        fastingStartTime = new Date(savedFastingStart);
    }
}

function renderQuoteOfDay() {
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    if (!quoteText || !quoteAuthor) return;
    
    const quote = getQuoteOfTheDay();
    quoteText.textContent = `"${quote.text}"`;
    quoteAuthor.textContent = `— ${quote.author}`;
}

function renderWeeklyReport() {
    const container = document.getElementById('weeklyReport');
    if (!container) return;
    
    const report = generateWeeklyReport();
    
    container.innerHTML = `
        <div class="report-header">
            <h3>Report</h3>
            <span class="report-period">${report.period}</span>
        </div>
        <div class="report-grid">
            <div class="report-stat">
                <div class="report-stat-value ${report.successRate >= 70 ? 'positive' : ''}">${report.successRate}%</div>
                <div class="report-stat-label">SUCCESSO</div>
            </div>
            <div class="report-stat">
                <div class="report-stat-value">${report.goals.completed}</div>
                <div class="report-stat-label">COMPLETATI</div>
            </div>
            <div class="report-stat">
                <div class="report-stat-value">${report.workouts}</div>
                <div class="report-stat-label">WORKOUT</div>
            </div>
            <div class="report-stat">
                <div class="report-stat-value">${report.moodAvg || '-'}</div>
                <div class="report-stat-label">MOOD MEDIO</div>
            </div>
        </div>
    `;
}

function renderEliteHeader() {
    // Update new minimal XP bar
    const xpProgress = getXPForNextLevel();
    const xpFill = document.getElementById('xpFill');
    const currentXP = document.getElementById('currentXP');
    const nextLevelXP = document.getElementById('nextLevelXP');
    const heroLevel = document.getElementById('heroLevel');
    
    if (xpFill) {
        xpFill.style.width = `${xpProgress.percent}%`;
    }
    if (currentXP) {
        currentXP.textContent = xpProgress.current;
    }
    if (nextLevelXP) {
        nextLevelXP.textContent = xpProgress.needed;
    }
    if (heroLevel) {
        heroLevel.textContent = eliteData.user.level;
    }
    
    // Also update old container if exists (for backwards compatibility)
    const container = document.getElementById('eliteHeader');
    if (!container) return;
    
    const levelData = LEVELS.find(l => l.level === eliteData.user.level);
    
    container.innerHTML = `
        <div class="elite-level" style="border-color: ${levelData.color}">
            <span class="level-number">${eliteData.user.level}</span>
        </div>
        <div class="elite-info">
            <div class="elite-title" style="color: ${levelData.color}">${eliteData.user.title}</div>
            <div class="elite-xp-bar">
                <div class="elite-xp-fill" style="width: ${xpProgress.percent}%; background: ${levelData.color}"></div>
            </div>
            <div class="elite-xp-text">${xpProgress.current} / ${xpProgress.needed} XP</div>
        </div>
    `;
}

function renderDailyChallenges() {
    const container = document.getElementById('dailyChallenges');
    if (!container) return;
    
    const challenges = getTodayChallenges();
    
    container.innerHTML = challenges.map(c => `
        <div class="daily-challenge ${c.completed ? 'completed' : ''}" onclick="completeDailyChallenge('${c.id}')">
            <div class="challenge-icon"><i class="fas ${c.icon}"></i></div>
            <div class="challenge-info">
                <div class="challenge-name">${c.name}</div>
                <div class="challenge-xp">+${c.xp} XP</div>
            </div>
            <div class="challenge-check">
                <i class="fas ${c.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
            </div>
        </div>
    `).join('');
}

function renderWaterTracker() {
    const container = document.getElementById('waterTracker');
    if (!container) return;
    
    const water = getTodayWater();
    const glasses = [];
    for (let i = 0; i < 8; i++) {
        glasses.push(i < water.glasses ? 'filled' : '');
    }
    
    container.innerHTML = `
        <div class="water-glasses">
            ${glasses.map((c, i) => `
                <div class="water-glass ${c}" onclick="addWater(1)">
                    <i class="fas fa-droplet"></i>
                </div>
            `).join('')}
        </div>
        <div class="water-count">${water.glasses} / 8 bicchieri</div>
    `;
}

function renderMoodSelector() {
    const container = document.getElementById('moodSelector');
    if (!container) return;
    
    const moods = [
        { value: 1, icon: 'fa-face-sad-tear', label: 'Pessimo' },
        { value: 2, icon: 'fa-face-frown', label: 'Male' },
        { value: 3, icon: 'fa-face-meh', label: 'Così così' },
        { value: 4, icon: 'fa-face-smile', label: 'Bene' },
        { value: 5, icon: 'fa-face-grin-stars', label: 'Fantastico' }
    ];
    
    const todayMood = getTodayMood();
    
    container.innerHTML = `
        <div class="mood-faces">
            ${moods.map(m => `
                <button class="mood-btn ${todayMood?.value === m.value ? 'selected' : ''}" 
                        onclick="logMood(${m.value})" title="${m.label}">
                    <i class="fas ${m.icon}"></i>
                </button>
            `).join('')}
        </div>
    `;
}

function renderPomodoroTimer() {
    // Update modal display
    const timeDisplay = document.getElementById('pomodoroTime');
    const typeDisplay = document.getElementById('pomodoroType');
    const btn = document.getElementById('pomodoroBtn');
    
    if (timeDisplay) {
        const minutes = Math.floor(pomodoroTimeLeft / 60);
        const seconds = pomodoroTimeLeft % 60;
        timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    if (typeDisplay) {
        typeDisplay.textContent = pomodoroType === 'work' ? '🍅 FOCUS' : '☕ PAUSA';
    }
    
    if (btn) {
        btn.innerHTML = pomodoroRunning ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    }
}

function renderHeatmap() {
    const container = document.getElementById('heatmapContainer');
    if (!container) return;
    
    const heatmapData = generateHeatmapData();
    
    // Generate SVG heatmap like GitHub
    const weeks = 53;
    const days = 7;
    const cellSize = 12;
    const cellGap = 2;
    
    let svg = `<svg width="${weeks * (cellSize + cellGap)}" height="${days * (cellSize + cellGap)}">`;
    
    let week = 0;
    let day = new Date(heatmapData[0]?.date || new Date()).getDay();
    
    heatmapData.forEach((d, i) => {
        const x = week * (cellSize + cellGap);
        const y = day * (cellSize + cellGap);
        
        let color = '#262626';
        if (d.value > 0) color = '#22C55E33';
        if (d.value >= 50) color = '#22C55E66';
        if (d.value >= 75) color = '#22C55E99';
        if (d.value === 100) color = '#22C55E';
        
        svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="${color}" 
                      data-date="${d.date}" data-value="${d.value}%">
                    <title>${d.date}: ${d.value}%</title>
                </rect>`;
        
        day++;
        if (day >= 7) {
            day = 0;
            week++;
        }
    });
    
    svg += '</svg>';
    container.innerHTML = svg;
}

function renderDailyTop3() {
    const container = document.getElementById('dailyTop3');
    if (!container) return;
    
    const today = getDateString(new Date());
    const todayData = eliteData.dailyTop3.find(t => t.date === today);
    
    if (!todayData) {
        container.innerHTML = `
            <div class="empty-top3">
                <p>Imposta le tue 3 priorità di oggi</p>
                <button class="btn btn-primary" onclick="openTop3Modal()">IMPOSTA TOP 3</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = todayData.tasks.map(t => `
        <div class="top3-item ${t.completed ? 'completed' : ''}" onclick="completeDailyTop3Task(${t.id})">
            <span class="top3-number">${t.id}</span>
            <span class="top3-text">${t.text}</span>
            <i class="fas ${t.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
        </div>
    `).join('');
}

function renderFastingTimer() {
    const container = document.getElementById('fastingTimer');
    if (!container) return;
    
    if (fastingStartTime) {
        const elapsed = (new Date() - fastingStartTime) / 1000 / 60 / 60;
        const hours = Math.floor(elapsed);
        const mins = Math.floor((elapsed - hours) * 60);
        
        container.innerHTML = `
            <div class="fasting-time">${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}</div>
            <div class="fasting-label">ore di digiuno</div>
            <button class="btn btn-danger" onclick="endFasting()">TERMINA DIGIUNO</button>
        `;
    } else {
        container.innerHTML = `
            <div class="fasting-idle">
                <i class="fas fa-utensils"></i>
                <p>Nessun digiuno attivo</p>
                <button class="btn btn-primary" onclick="startFasting()">INIZIA DIGIUNO</button>
            </div>
        `;
    }
}

function renderBadgesWall() {
    const container = document.getElementById('badgesWall');
    if (!container) return;
    
    const earnedIds = eliteData.badges.map(b => b.id);
    
    container.innerHTML = Object.values(BADGES).map(badge => {
        const earned = earnedIds.includes(badge.id);
        return `
            <div class="badge-item ${earned ? 'earned' : 'locked'}">
                <div class="badge-icon" style="${earned ? `background: ${badge.color}20; color: ${badge.color}` : ''}">
                    <i class="fas ${badge.icon}"></i>
                </div>
                <div class="badge-name">${badge.name}</div>
            </div>
        `;
    }).join('');
}

// ==================== INITIALIZE ON LOAD ====================
// Delay initialization to ensure app.js is fully loaded
function safeInitElite() {
    try {
        initEliteFeatures();
    } catch(e) {
        console.error('Elite init failed:', e);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(safeInitElite, 200));
} else {
    setTimeout(safeInitElite, 200);
}

// ==================== PUBLIC API ====================
const EliteFeatures = {
    init: initEliteFeatures,
    
    // XP & Leveling
    addXP,
    getLevel: () => eliteData.user.level,
    getXP: () => eliteData.user.totalXp,
    getTitle: () => eliteData.user.title,
    
    // Mood
    saveMood: (value) => {
        logMood(value);
        
        const moodLabels = {
            1: { icon: 'fa-face-tired', text: 'Esausto' },
            2: { icon: 'fa-face-frown', text: 'Giù' },
            3: { icon: 'fa-face-meh', text: 'Così così' },
            4: { icon: 'fa-face-smile', text: 'Bene' },
            5: { icon: 'fa-face-laugh-beam', text: 'Alla grande!' }
        };
        
        const moodFaces = document.getElementById('moodFaces');
        const moodSelected = document.getElementById('moodSelected');
        const moodSelectedIcon = document.getElementById('moodSelectedIcon');
        const moodSelectedText = document.getElementById('moodSelectedText');
        const editMoodBtn = document.getElementById('editMoodBtn');
        
        if (moodFaces && moodSelected && moodLabels[value]) {
            // Hide faces
            moodFaces.style.display = 'none';
            // Show selected mood
            moodSelected.style.display = 'flex';
            moodSelected.classList.add('active');
            moodSelectedIcon.innerHTML = `<i class="fas ${moodLabels[value].icon}"></i>`;
            moodSelectedText.textContent = moodLabels[value].text;
        }
        if (editMoodBtn) {
            editMoodBtn.style.display = 'flex';
        }
        
        showToast('Mood registrato! +10 XP', 'success');
    },
    
    enableMoodEdit: () => {
        const moodFaces = document.getElementById('moodFaces');
        const moodSelected = document.getElementById('moodSelected');
        const editMoodBtn = document.getElementById('editMoodBtn');
        
        if (moodFaces && moodSelected) {
            moodFaces.style.display = 'flex';
            moodSelected.style.display = 'none';
            moodSelected.classList.remove('active');
        }
        if (editMoodBtn) {
            editMoodBtn.style.display = 'none';
        }
    },
    
    initMoodDisplay: () => {
        const todayMood = getTodayMood();
        if (todayMood) {
            const moodLabels = {
                1: { icon: 'fa-face-tired', text: 'Esausto' },
                2: { icon: 'fa-face-frown', text: 'Giù' },
                3: { icon: 'fa-face-meh', text: 'Così così' },
                4: { icon: 'fa-face-smile', text: 'Bene' },
                5: { icon: 'fa-face-laugh-beam', text: 'Alla grande!' }
            };
            
            const moodFaces = document.getElementById('moodFaces');
            const moodSelected = document.getElementById('moodSelected');
            const moodSelectedIcon = document.getElementById('moodSelectedIcon');
            const moodSelectedText = document.getElementById('moodSelectedText');
            const editMoodBtn = document.getElementById('editMoodBtn');
            
            if (moodFaces && moodSelected && moodLabels[todayMood.value]) {
                moodFaces.style.display = 'none';
                moodSelected.style.display = 'flex';
                moodSelected.classList.add('active');
                moodSelectedIcon.innerHTML = `<i class="fas ${moodLabels[todayMood.value].icon}"></i>`;
                moodSelectedText.textContent = moodLabels[todayMood.value].text;
            }
            if (editMoodBtn) {
                editMoodBtn.style.display = 'flex';
            }
        }
    },
    
    // Water
    addWater,
    adjustWater,
    getWater: getTodayWater,
    
    // Sleep
    saveSleep: () => {
        const hours = parseFloat(document.getElementById('sleepHours')?.value) || 0;
        const quality = parseInt(document.getElementById('sleepQuality')?.value) || 3;
        if (hours > 0) {
            logSleep(hours, quality);
            showToast('Sonno registrato!', 'success');
        }
    },
    
    // Gratitude
    saveGratitude: (e) => {
        e.preventDefault();
        const items = [
            document.getElementById('gratitude1')?.value,
            document.getElementById('gratitude2')?.value,
            document.getElementById('gratitude3')?.value
        ].filter(i => i);
        
        if (items.length > 0) {
            addGratitude(items);
            showToast('Gratitudine salvata! +15 XP', 'success');
            closeModal('gratitudeModal');
            e.target.reset();
        }
    },
    
    // Journal
    saveJournal: (e) => {
        e.preventDefault();
        const content = document.getElementById('journalEntry')?.value;
        if (content) {
            addJournalEntry(content, getTodayMood()?.value || 3);
            showToast('Diario salvato! +20 XP', 'success');
            closeModal('journalModal');
            e.target.reset();
        }
    },
    
    // Pomodoro
    togglePomodoro: () => {
        if (pomodoroRunning) {
            pausePomodoro();
            document.getElementById('pomodoroBtn').innerHTML = '<i class="fas fa-play"></i>';
        } else {
            startPomodoro();
            document.getElementById('pomodoroBtn').innerHTML = '<i class="fas fa-pause"></i>';
        }
    },
    resetPomodoro: () => {
        resetPomodoro();
        document.getElementById('pomodoroBtn').innerHTML = '<i class="fas fa-play"></i>';
    },
    skipPomodoro: () => {
        completePomodoro();
    },
    
    // Breathing
    startBreathing: () => {
        const exercise = BREATHING_EXERCISES[0]; // 4-7-8
        let phase = 'inhale';
        let count = exercise.inhale;
        let round = 1;
        
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const instruction = document.getElementById('breathingInstruction');
        const btn = document.getElementById('breathingBtn');
        
        btn.style.display = 'none';
        
        const tick = () => {
            if (count > 0) {
                text.textContent = count;
                count--;
            } else {
                if (phase === 'inhale') {
                    phase = 'hold';
                    count = exercise.hold;
                    circle.classList.remove('inhale');
                    instruction.textContent = 'TRATTIENI';
                } else if (phase === 'hold') {
                    phase = 'exhale';
                    count = exercise.exhale;
                    circle.classList.add('exhale');
                    instruction.textContent = 'ESPIRA';
                } else if (phase === 'exhale') {
                    round++;
                    if (round > exercise.rounds) {
                        clearInterval(breathingInterval);
                        text.textContent = '✓';
                        instruction.textContent = 'COMPLETATO';
                        btn.style.display = 'block';
                        btn.textContent = 'CHIUDI';
                        btn.onclick = () => closeModal('breathingModal');
                        addXP(XP_REWARDS.meditationSession, 'Respirazione');
                        return;
                    }
                    phase = 'inhale';
                    count = exercise.inhale;
                    circle.classList.remove('exhale');
                    circle.classList.add('inhale');
                    instruction.textContent = 'INSPIRA';
                }
            }
        };
        
        circle.classList.add('inhale');
        instruction.textContent = 'INSPIRA';
        breathingInterval = setInterval(tick, 1000);
        tick();
    },
    
    // Top 3
    saveTop3: (e) => {
        e.preventDefault();
        const tasks = [
            document.getElementById('top3_1')?.value,
            document.getElementById('top3_2')?.value,
            document.getElementById('top3_3')?.value
        ].filter(t => t);
        
        if (tasks.length > 0) {
            setDailyTop3(tasks);
            showToast('Priorità impostate!', 'success');
            closeModal('top3Modal');
            renderDailyTop3();
            e.target.reset();
        }
    },
    
    // Why I Started
    saveWhy: (e) => {
        e.preventDefault();
        const text = document.getElementById('whyEntry')?.value;
        if (text) {
            addWhyStarted(text);
            showToast('Motivazione salvata!', 'success');
            closeModal('whyModal');
            renderWhyStarted();
            e.target.reset();
        }
    },
    
    // Wins
    saveWin: (e) => {
        e.preventDefault();
        const text = document.getElementById('winEntry')?.value;
        if (text) {
            eliteData.wins.push({
                id: generateId(),
                text,
                date: new Date().toISOString()
            });
            saveEliteData('wins');
            showToast('Vittoria aggiunta!', 'success');
            closeModal('winsModal');
            renderWinsJournal();
            e.target.reset();
        }
    },
    
    // Measurements
    saveMeasurements: (e) => {
        e.preventDefault();
        const measurements = {
            weight: parseFloat(document.getElementById('measureWeight')?.value),
            waist: parseFloat(document.getElementById('measureWaist')?.value),
            chest: parseFloat(document.getElementById('measureChest')?.value),
            arms: parseFloat(document.getElementById('measureArms')?.value),
            thighs: parseFloat(document.getElementById('measureThighs')?.value),
            hips: parseFloat(document.getElementById('measureHips')?.value)
        };
        
        Object.entries(measurements).forEach(([type, value]) => {
            if (value > 0) logMeasurement(type, value);
        });
        
        showToast('Misure salvate! +15 XP', 'success');
        closeModal('measurementsModal');
        renderMeasurements();
        e.target.reset();
    },
    
    // Progress Photos
    saveProgressPhoto: (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                addProgressPhoto(event.target.result);
                showToast('Foto salvata! +30 XP', 'success');
                renderPhotosGrid();
            };
            reader.readAsDataURL(file);
        }
    },
    
    // Level Up / Badge overlays
    closeLevelUp: () => {
        document.getElementById('levelUpOverlay')?.classList.remove('show');
    },
    closeBadge: () => {
        document.getElementById('badgeEarnedOverlay')?.classList.remove('show');
    },
    
    // Getters for stats
    getBadges: () => eliteData.badges,
    getStreaks: () => eliteData.streaks,
    getMoods: () => eliteData.moods,
    getGratitude: () => eliteData.gratitude,
    getJournal: () => eliteData.journal
};

// Additional render functions
function renderWhyStarted() {
    const container = document.getElementById('whyStartedDisplay');
    if (!container) return;
    
    if (eliteData.whyStarted.length === 0) {
        container.innerHTML = '<p style="color:var(--gray-500);text-align:center;">Aggiungi le tue motivazioni</p>';
        return;
    }
    
    container.innerHTML = eliteData.whyStarted.map(w => `
        <div class="sos-reason">${w.text}</div>
    `).join('');
}

function renderWinsJournal() {
    const container = document.getElementById('winsJournal');
    if (!container) return;
    
    if (eliteData.wins.length === 0) {
        container.innerHTML = '<p style="color:var(--gray-500);text-align:center;">Registra le tue vittorie</p>';
        return;
    }
    
    container.innerHTML = eliteData.wins.slice(-5).reverse().map(w => `
        <div class="win-item">
            <i class="fas fa-trophy win-icon"></i>
            <div>
                <div class="win-text">${w.text}</div>
                <div class="win-date">${new Date(w.date).toLocaleDateString('it-IT')}</div>
            </div>
        </div>
    `).join('');
}

function renderMeasurements() {
    const container = document.getElementById('measurementsList');
    if (!container) return;
    
    if (eliteData.measurements.length === 0) {
        container.innerHTML = '<p style="color:var(--gray-500);text-align:center;">Nessuna misurazione</p>';
        return;
    }
    
    // Get latest of each type
    const types = ['weight', 'waist', 'chest', 'arms', 'thighs', 'hips'];
    const labels = { weight: 'Peso', waist: 'Vita', chest: 'Petto', arms: 'Braccia', thighs: 'Cosce', hips: 'Fianchi' };
    const units = { weight: 'kg', waist: 'cm', chest: 'cm', arms: 'cm', thighs: 'cm', hips: 'cm' };
    
    const latestByType = {};
    types.forEach(type => {
        const vals = eliteData.measurements.filter(m => m.type === type);
        if (vals.length > 0) {
            latestByType[type] = vals[vals.length - 1];
        }
    });
    
    if (Object.keys(latestByType).length === 0) {
        container.innerHTML = '<p style="color:var(--gray-500);text-align:center;">Nessuna misurazione</p>';
        return;
    }
    
    container.innerHTML = Object.entries(latestByType).map(([type, m]) => `
        <div class="measurement-item">
            <span class="measurement-label">${labels[type]}</span>
            <span class="measurement-value">${m.value} ${units[type]}</span>
        </div>
    `).join('');
}

function renderPhotosGrid() {
    const container = document.getElementById('photosGrid');
    if (!container) return;
    
    if (eliteData.photos.length === 0) {
        container.innerHTML = '<p style="color:var(--gray-500);text-align:center;">Nessuna foto</p>';
        return;
    }
    
    container.innerHTML = eliteData.photos.slice(-9).map(p => `
        <div class="photo-item">
            <img src="${p.data}" alt="Progress ${new Date(p.date).toLocaleDateString('it-IT')}">
        </div>
    `).join('');
}

function renderCorrelations() {
    const container = document.getElementById('correlationsContainer');
    if (!container) return;
    
    const correlations = findCorrelations();
    
    if (correlations.length === 0) {
        container.innerHTML = '<p style="color:var(--gray-500);text-align:center;">Continua a tracciare per scoprire correlazioni</p>';
        return;
    }
    
    container.innerHTML = correlations.map(c => `
        <div class="correlation-card ${c.positive ? 'positive' : 'negative'}">
            <div class="correlation-icon">
                <i class="fas ${c.positive ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
            </div>
            <div class="correlation-text">${c.text}</div>
        </div>
    `).join('');
}

// ==================== GLOBAL FUNCTIONS ====================
function openTop3Modal() {
    openModal('top3Modal');
}

function togglePomodoro() {
    if (pomodoroRunning) {
        pausePomodoro();
    } else {
        startPomodoro();
    }
    renderPomodoroTimer();
}

// Make sure window has access
window.EliteFeatures = EliteFeatures;
window.completeDailyChallenge = completeDailyChallenge;
window.completeDailyTop3Task = completeDailyTop3Task;
window.openTop3Modal = openTop3Modal;
window.togglePomodoro = togglePomodoro;
window.addWater = addWater;
window.adjustWater = adjustWater;
window.logMood = logMood;
window.startPomodoro = startPomodoro;
window.pausePomodoro = pausePomodoro;
window.resetPomodoro = resetPomodoro;
