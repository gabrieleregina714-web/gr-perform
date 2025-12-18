// ================================================
// LIFE TRACKER - COMPLETE APPLICATION
// ================================================

// ==================== DATA STORAGE ====================
const STORAGE_KEYS = {
    goals: 'lt_goals',
    history: 'lt_history',
    metrics: 'lt_metrics',
    metricValues: 'lt_metric_values',
    exercises: 'lt_exercises',
    documents: 'lt_documents',
    workoutExercises: 'lt_workout_exercises',
    runs: 'lt_runs',
    workoutSessions: 'lt_workout_sessions'
};

let data = {
    goals: [],
    history: [],
    metrics: [],
    metricValues: [],
    exercises: [],
    documents: [],
    workoutExercises: [],
    runs: [],
    workoutSessions: []
};

let currentGoalId = null;
let currentMetricId = null;
let currentView = 'home';
let expandedMetrics = new Set();

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        if (window.ltCloudInitPromise) {
            await window.ltCloudInitPromise;
        }
    } catch (e) {
        console.warn('Cloud init await failed:', e);
    }

    loadAllData();
    initEventListeners();
    initMetricListeners();
    renderApp();
    setDefaultDates();
});

function loadAllData() {
    Object.keys(STORAGE_KEYS).forEach(key => {
        const stored = localStorage.getItem(STORAGE_KEYS[key]);
        if (stored) {
            data[key] = JSON.parse(stored);
        }
    });
}

function saveData(key) {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data[key]));
}

function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    const metricDateEl = document.getElementById('metricValueDate');
    if (metricDateEl) metricDateEl.value = today;
    const bodyFatDateEl = document.getElementById('bodyFatDate');
    if (bodyFatDateEl) bodyFatDateEl.value = today;
}

// ==================== EVENT LISTENERS ====================
function initEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
        btn.addEventListener('click', () => {
            switchView(btn.dataset.view);
        });
    });

    // Frequency selector
    document.getElementById('goalFrequency').addEventListener('change', (e) => {
        document.getElementById('customDaysGroup').classList.toggle('hidden', e.target.value !== 'custom');
    });
    
    // Notification toggle
    document.getElementById('goalNotification').addEventListener('change', (e) => {
        document.getElementById('notificationTimeGroup').classList.toggle('hidden', !e.target.checked);
        if (e.target.checked) {
            requestNotificationPermission();
        }
    });

    // Category selector
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
    
    // Color selector
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // File upload
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            uploadZone.classList.add('has-file');
            uploadZone.querySelector('p').textContent = e.target.files[0].name;
        }
    });

    // Import input
    document.getElementById('importInput').addEventListener('change', handleImport);

    // Update exercise suggestions
    updateExerciseSuggestions();
    
    // Initialize notifications
    initNotifications();
}

// ==================== NAVIGATION ====================
function switchView(viewName) {
    currentView = viewName;
    
    // Update views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewName + 'View').classList.add('active');
    
    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-view="${viewName}"]`)?.classList.add('active');
    
    // Re-render current view
    renderApp();
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// ==================== RENDERING ====================
function renderApp() {
    const safe = (label, fn) => {
        try {
            if (typeof fn === 'function') fn();
        } catch (e) {
            console.warn(`renderApp step failed: ${label}`, e);
        }
    };

    safe('updateTodayDate', updateTodayDate);
    safe('renderHeroStats', renderHeroStats);
    safe('renderTodayGoals', renderTodayGoals);
    safe('renderWeekChart', renderWeekChart);
    safe('renderCategories', renderCategories);
    safe('renderAllGoals', renderAllGoals);
    safe('renderStats', renderStats);
    safe('renderWorkouts', renderWorkouts);
    safe('renderDocuments', renderDocuments);
    safe('loadProfile', loadProfile);
    safe('loadSocialData', loadSocialData);
    safe('renderWorkoutView', renderWorkoutView);

    // New features
    safe('updateHeroQuote', updateHeroQuote);
    safe('updateHeroLevel', updateHeroLevel);
    safe('updateWaterDisplay', updateWaterDisplay);
    safe('loadPriorities', loadPriorities);
    safe('renderDiaryEntries', renderDiaryEntries);
    safe('loadProfileBg', loadProfileBg);
    safe('renderPhotosPreview', renderPhotosPreview);
    safe('updateRealStats', updateRealStats);
    safe('initPomodoroSettings', initPomodoroSettings);
}

function updateTodayDate() {
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateEl = document.getElementById('todayDate');
    if (dateEl) {
        dateEl.textContent = today.toLocaleDateString('it-IT', options);
    }
}

function renderHeroStats() {
    const today = new Date();
    const todayStr = getDateString(today);
    const dayOfWeek = today.getDay();
    
    // Today's progress
    const todayGoals = data.goals.filter(g => isGoalScheduledForDay(g, dayOfWeek));
    const todayDone = todayGoals.filter(g => {
        const entry = getHistoryEntry(g.id, todayStr);
        return entry?.status === 'done';
    }).length;
    
    const todayPercent = todayGoals.length > 0 ? Math.round((todayDone / todayGoals.length) * 100) : 0;
    const todayProgressEl = document.getElementById('todayProgress');
    if (todayProgressEl) todayProgressEl.textContent = todayPercent + '%';
    
    // Week progress
    let weekTotal = 0, weekDone = 0;
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dStr = getDateString(d);
        const dow = d.getDay();
        
        const dayGoals = data.goals.filter(g => isGoalScheduledForDay(g, dow));
        weekTotal += dayGoals.length;
        weekDone += dayGoals.filter(g => getHistoryEntry(g.id, dStr)?.status === 'done').length;
    }
    
    const weekPercent = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;
    const weekProgressEl = document.getElementById('weekProgress');
    if (weekProgressEl) weekProgressEl.textContent = weekPercent + '%';
    
    // Discipline score
    const discipline = calculateDisciplineScore();
    const disciplineEl = document.getElementById('disciplineScore');
    if (disciplineEl) disciplineEl.textContent = discipline;
    
    // Streak
    const streak = calculateOverallStreak();
    const streakEl = document.getElementById('heroStreak');
    if (streakEl) streakEl.textContent = streak;
}

function renderTodayGoals() {
    const container = document.getElementById('todayGoals');
    const today = new Date();
    const todayStr = getDateString(today);
    const dayOfWeek = today.getDay();
    
    const todayGoals = data.goals.filter(g => isGoalScheduledForDay(g, dayOfWeek));
    
    if (todayGoals.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bullseye"></i>
                <p>Nessun obiettivo per oggi.<br>Aggiungine uno!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = todayGoals.map(goal => {
        const entry = getHistoryEntry(goal.id, todayStr);
        const statusClass = entry ? entry.status : '';
        const icon = goal.icon || getCategoryIcon(goal.category);
        const color = goal.color || '#00D26A';
        
        let checkIcon = '';
        if (entry?.status === 'done') checkIcon = '<i class="fas fa-check"></i>';
        else if (entry?.status === 'skipped') checkIcon = '<i class="fas fa-forward"></i>';
        else if (entry?.status === 'blocked') checkIcon = '<i class="fas fa-ban"></i>';
        
        return `
            <div class="goal-card ${statusClass}" onclick="openCheckin('${goal.id}')">
                <div class="goal-icon-wrap" style="background: ${color}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="goal-info">
                    <div class="goal-name">${goal.name}</div>
                </div>
                <div class="goal-check">${checkIcon}</div>
            </div>
        `;
    }).join('');
}

function renderWeekChart() {
    const container = document.getElementById('weekChart');
    if (!container) return;
    
    const today = new Date();
    const days = ['D', 'L', 'M', 'M', 'G', 'V', 'S'];
    
    let html = '';
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dStr = getDateString(d);
        const dow = d.getDay();
        
        const dayGoals = data.goals.filter(g => isGoalScheduledForDay(g, dow));
        const done = dayGoals.filter(g => getHistoryEntry(g.id, dStr)?.status === 'done').length;
        const percent = dayGoals.length > 0 ? Math.round((done / dayGoals.length) * 100) : 0;
        
        html += `
            <div class="week-day ${i === 0 ? 'today' : ''}">
                <div class="week-day-label">${days[dow]}</div>
                <div class="week-day-bar">
                    <div class="week-day-fill" style="height: ${percent}%"></div>
                </div>
                <div class="week-day-value">${percent}%</div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function renderCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    const categories = {
        health: { name: 'Salute', icon: 'fa-heart-pulse' },
        fitness: { name: 'Fitness', icon: 'fa-dumbbell' },
        nutrition: { name: 'Dieta', icon: 'fa-apple-whole' },
        mind: { name: 'Mente', icon: 'fa-brain' },
        work: { name: 'Lavoro', icon: 'fa-briefcase' },
        learning: { name: 'Studio', icon: 'fa-book' },
        finance: { name: 'Finanze', icon: 'fa-wallet' },
        social: { name: 'Sociale', icon: 'fa-users' }
    };
    
    const today = new Date();
    const todayStr = getDateString(today);
    const dayOfWeek = today.getDay();
    
    const catData = {};
    data.goals.forEach(g => {
        if (!catData[g.category]) catData[g.category] = { total: 0, done: 0 };
        if (isGoalScheduledForDay(g, dayOfWeek)) {
            catData[g.category].total++;
            if (getHistoryEntry(g.id, todayStr)?.status === 'done') {
                catData[g.category].done++;
            }
        }
    });
    
    const activeCats = Object.keys(catData).filter(k => catData[k].total > 0);
    
    if (activeCats.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1">
                <p>Le categorie appariranno qui</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = activeCats.map(key => {
        const cat = categories[key] || { name: key, icon: 'fa-star' };
        const { total, done } = catData[key];
        const percent = total > 0 ? Math.round((done / total) * 100) : 0;
        
        return `
            <div class="category-card">
                <div class="category-icon"><i class="fas ${cat.icon}"></i></div>
                <div class="category-name">${cat.name}</div>
                <div class="category-progress">${done}/${total} oggi</div>
                <div class="category-bar">
                    <div class="category-fill" style="width: ${percent}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

let currentGoalsFilter = 'all';

function filterGoals(filter) {
    currentGoalsFilter = filter;
    
    // Update active button
    document.querySelectorAll('.goals-filter-bar .filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    renderAllGoals();
}

function renderAllGoals() {
    const container = document.getElementById('allGoalsList');
    if (!container) return;
    
    // Update goals header stats
    const activeCount = document.getElementById('activeGoalsCount');
    const completedToday = document.getElementById('completedTodayCount');
    const goalsStreak = document.getElementById('goalsStreakCount');
    
    if (activeCount) activeCount.textContent = data.goals.length;
    
    const today = getDateString(new Date());
    const todayCompleted = data.history.filter(h => h.date === today && h.status === 'done').length;
    if (completedToday) completedToday.textContent = todayCompleted;
    
    const streak = calculateOverallStreak();
    if (goalsStreak) goalsStreak.textContent = streak;
    
    // Filter goals based on current filter
    let filteredGoals = data.goals;
    
    if (currentGoalsFilter === 'weekdays') {
        // Infrasettimanali: goals scheduled for Mon-Fri (days 1-5)
        filteredGoals = data.goals.filter(goal => {
            const days = goal.frequency?.days || [0, 1, 2, 3, 4, 5, 6];
            // Has at least one weekday
            return days.some(d => d >= 1 && d <= 5);
        });
    } else if (currentGoalsFilter === 'weekend') {
        // Weekend: goals scheduled for Sat-Sun (days 0, 6)
        filteredGoals = data.goals.filter(goal => {
            const days = goal.frequency?.days || [0, 1, 2, 3, 4, 5, 6];
            // Has at least one weekend day
            return days.some(d => d === 0 || d === 6);
        });
    }
    
    if (filteredGoals.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bullseye"></i>
                <p>Nessun obiettivo ${currentGoalsFilter === 'weekdays' ? 'infrasettimanale' : currentGoalsFilter === 'weekend' ? 'nel weekend' : ''}.<br>Inizia creandone uno!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredGoals.map(goal => {
        const goalStreak = calculateGoalStreak(goal.id);
        const completions = data.history.filter(h => h.goalId === goal.id && h.status === 'done').length;
        const icon = getCategoryIcon(goal.category);
        
        return `
            <div class="goal-card-full">
                <div class="goal-icon-wrap" style="background:${goal.color || 'var(--nike-orange)'}">
                    <i class="fas ${goal.icon || icon}"></i>
                </div>
                <div class="goal-info">
                    <div class="goal-name">${goal.name}</div>
                    <div class="goal-meta">${getFrequencyLabel(goal.frequency)}</div>
                </div>
                <div class="goal-stats">
                    <div class="goal-stat-mini">
                        <div class="value">${goalStreak}</div>
                        <div class="label">Streak</div>
                    </div>
                    <div class="goal-stat-mini">
                        <div class="value">${completions}</div>
                        <div class="label">Totali</div>
                    </div>
                </div>
                <button class="goal-delete" onclick="deleteGoal('${goal.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
}

function renderStats() {
    renderStatsHero();
    renderOverviewTab();
    renderCustomMetrics();
    renderDisciplineStats();
    renderCalendar();
    loadReportsPreview();
}

function updateStatsHeader() {
    // Update stats header values
    const weeklyScore = document.getElementById('statsWeeklyScore');
    const totalGoals = document.getElementById('statsTotalGoals');
    
    if (weeklyScore) {
        // Calculate weekly completion rate
        const now = new Date();
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekHistory = data.history.filter(h => new Date(h.date) >= weekStart);
        const completed = weekHistory.filter(h => h.status === 'done').length;
        const total = weekHistory.length || 1;
        weeklyScore.textContent = Math.round((completed / total) * 100) + '%';
    }
    
    if (totalGoals) {
        const allCompleted = data.history.filter(h => h.status === 'done').length;
        totalGoals.textContent = allCompleted;
    }
}

// ==================== CUSTOM METRICS SYSTEM ====================
function initMetricListeners() {
    // Metric type selector
    document.querySelectorAll('.metric-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Radio buttons handle selection automatically
        });
    });

    // Icon selector for metrics
    document.querySelectorAll('#metricIconGrid .icon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#metricIconGrid .icon-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
    
    // Progress period tabs
    document.querySelectorAll('.progress-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.progress-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderProgressOverview(tab.dataset.period);
        });
    });
}

// ==================== PROGRESS OVERVIEW ====================
function renderProgressOverview(period = 'week') {
    const container = document.getElementById('progressCards');
    if (!container) return;
    
    const now = new Date();
    let startDate;
    
    switch(period) {
        case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            break;
        case 'year':
            startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            break;
    }
    
    // Calculate goals completed
    const goalsInPeriod = data.history.filter(h => new Date(h.date) >= startDate);
    const completedGoals = goalsInPeriod.filter(h => h.action === 'completed').length;
    const skippedGoals = goalsInPeriod.filter(h => h.action === 'skipped').length;
    
    // Calculate workouts
    const workoutsInPeriod = data.exercises.filter(e => new Date(e.date) >= startDate).length;
    
    // Calculate metric changes
    const metricChanges = data.metrics.map(metric => {
        const values = getMetricValues(metric.id)
            .filter(v => new Date(v.date) >= startDate)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (values.length < 2) return null;
        
        const first = values[0].value;
        const last = values[values.length - 1].value;
        const change = last - first;
        const isGood = metric.type === 'higher_better' ? change > 0 : change < 0;
        
        return {
            name: metric.name,
            icon: metric.icon,
            unit: metric.unit,
            change,
            isGood
        };
    }).filter(Boolean);
    
    const periodLabels = {
        week: 'QUESTA SETTIMANA',
        month: 'QUESTO MESE',
        year: "QUEST'ANNO"
    };
    
    let cardsHtml = `
        <div class="progress-card">
            <div class="progress-card-icon"><i class="fas fa-check"></i></div>
            <div class="progress-card-value">${completedGoals}</div>
            <div class="progress-card-label">OBIETTIVI COMPLETATI</div>
        </div>
        <div class="progress-card">
            <div class="progress-card-icon"><i class="fas fa-dumbbell"></i></div>
            <div class="progress-card-value">${workoutsInPeriod}</div>
            <div class="progress-card-label">ESERCIZI REGISTRATI</div>
        </div>
    `;
    
    // Add metric change cards
    metricChanges.slice(0, 4).forEach(mc => {
        const sign = mc.change > 0 ? '+' : '';
        cardsHtml += `
            <div class="progress-card">
                <div class="progress-card-icon"><i class="fas ${mc.icon}"></i></div>
                <div class="progress-card-value ${mc.isGood ? 'positive' : 'negative'}">${sign}${mc.change.toFixed(1)}</div>
                <div class="progress-card-label">${mc.name.toUpperCase()}</div>
                <div class="progress-card-change ${mc.isGood ? 'up' : 'down'}">
                    <i class="fas fa-arrow-${mc.isGood ? 'up' : 'down'}"></i>
                    ${mc.unit}
                </div>
            </div>
        `;
    });
    
    // Add discipline if we have data
    if (goalsInPeriod.length > 0) {
        const successRate = Math.round((completedGoals / (completedGoals + skippedGoals || 1)) * 100);
        cardsHtml += `
            <div class="progress-card">
                <div class="progress-card-icon"><i class="fas fa-fire"></i></div>
                <div class="progress-card-value ${successRate >= 70 ? 'positive' : successRate >= 40 ? '' : 'negative'}">${successRate}%</div>
                <div class="progress-card-label">DISCIPLINA</div>
            </div>
        `;
    }
    
    container.innerHTML = cardsHtml;
}

function renderCustomMetrics() {
    const container = document.getElementById('customMetricsContainer');
    if (!container) return;
    
    // Render progress overview
    renderProgressOverview('week');

    if (data.metrics.length === 0) {
        container.innerHTML = `
            <div class="empty-metrics-compact">
                <i class="fas fa-chart-line"></i>
                <p>Crea la tua prima metrica per tracciare qualsiasi statistica</p>
            </div>
        `;
        return;
    }

    container.innerHTML = data.metrics.map(metric => {
        const values = getMetricValues(metric.id);
        const isExpanded = expandedMetrics.has(metric.id);
        
        // Calculate current value and delta
        let currentValue = '--';
        let deltaHtml = '';
        let miniChartHtml = '';
        let expandedChartHtml = '';
        let historyHtml = '';
        
        if (values.length > 0) {
            const sorted = [...values].sort((a, b) => new Date(a.date) - new Date(b.date));
            const latest = sorted[sorted.length - 1];
            currentValue = latest.value;
            
            if (sorted.length > 1) {
                const prev = sorted[sorted.length - 2];
                const diff = latest.value - prev.value;
                const isPositiveGood = metric.type === 'higher_better';
                const isGood = isPositiveGood ? diff > 0 : diff < 0;
                
                if (diff !== 0) {
                    deltaHtml = `
                        <span class="metric-compact-delta ${isGood ? 'positive' : 'negative'}">
                            <i class="fas fa-arrow-${diff > 0 ? 'up' : 'down'}"></i>
                            ${diff > 0 ? '+' : ''}${diff.toFixed(1)}
                        </span>
                    `;
                } else {
                    deltaHtml = `<span class="metric-compact-delta neutral">—</span>`;
                }
            }
            
            // Mini chart (last 7 values)
            const miniValues = sorted.slice(-7);
            const miniMax = Math.max(...miniValues.map(v => v.value));
            const miniMin = Math.min(...miniValues.map(v => v.value));
            const miniRange = miniMax - miniMin || 1;
            
            miniChartHtml = miniValues.map((v, i) => {
                const height = ((v.value - miniMin) / miniRange) * 80 + 20;
                const isLatest = i === miniValues.length - 1;
                return `<div class="metric-mini-bar ${isLatest ? 'latest' : ''}" style="height: ${height}%"></div>`;
            }).join('');
            
            // Expanded chart (last 14 values)
            const chartValues = sorted.slice(-14);
            const max = Math.max(...chartValues.map(v => v.value));
            const min = Math.min(...chartValues.map(v => v.value));
            const range = max - min || 1;
            
            expandedChartHtml = chartValues.map((v, i) => {
                const height = ((v.value - min) / range) * 80 + 20;
                const isLatest = i === chartValues.length - 1;
                return `<div class="metric-expanded-bar ${isLatest ? 'latest' : ''}" style="height: ${height}%" title="${v.value} ${metric.unit}"></div>`;
            }).join('');
            
            // History
            const recentValues = sorted.slice(-5).reverse();
            historyHtml = recentValues.map(v => `
                <div class="metric-history-row">
                    <span class="metric-history-row-date">${new Date(v.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</span>
                    <span class="metric-history-row-value">${v.value} ${metric.unit}</span>
                    <button class="metric-history-row-delete" onclick="event.stopPropagation(); deleteMetricValue('${v.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }

        return `
            <div class="metric-card-compact ${isExpanded ? 'expanded' : ''}" onclick="${isExpanded ? '' : `toggleMetric('${metric.id}')`}">
                <div class="metric-compact-header">
                    <div class="metric-compact-icon"><i class="fas ${metric.icon}"></i></div>
                    <div class="metric-compact-name">${metric.name}</div>
                </div>
                <div>
                    <span class="metric-compact-value">${typeof currentValue === 'number' ? currentValue.toFixed(1) : currentValue}</span>
                    <span class="metric-compact-unit">${metric.unit}</span>
                    ${deltaHtml}
                </div>
                ${!isExpanded && values.length > 0 ? `
                    <div class="metric-mini-chart">${miniChartHtml}</div>
                ` : ''}
                ${isExpanded ? `
                    <div class="metric-expanded-body" onclick="event.stopPropagation()">
                        ${values.length > 0 ? `
                            <div class="metric-expanded-chart">${expandedChartHtml}</div>
                        ` : ''}
                        <div class="metric-expanded-actions">
                            <button class="btn btn-primary" onclick="openAddMetricValue('${metric.id}')">
                                <i class="fas fa-plus"></i> AGGIUNGI
                            </button>
                            <button class="btn btn-secondary" onclick="toggleMetric('${metric.id}')">
                                <i class="fas fa-compress"></i> CHIUDI
                            </button>
                            <button class="btn btn-danger" onclick="deleteMetric('${metric.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        ${values.length > 0 ? `
                            <div class="metric-history-compact">${historyHtml}</div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function getMetricValues(metricId) {
    return data.metricValues
        .filter(v => v.metricId === metricId)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function toggleMetric(metricId) {
    if (expandedMetrics.has(metricId)) {
        expandedMetrics.delete(metricId);
    } else {
        expandedMetrics.add(metricId);
    }
    renderCustomMetrics();
}

function saveNewMetric(event) {
    event.preventDefault();
    
    const name = document.getElementById('metricName').value.trim();
    const unit = document.getElementById('metricUnit').value.trim();
    const type = document.querySelector('input[name="metricType"]:checked').value;
    const icon = document.querySelector('#metricIconGrid .icon-btn.selected')?.dataset.icon || 'fa-chart-line';
    
    const metric = {
        id: generateId(),
        name,
        unit,
        type,
        icon,
        createdAt: new Date().toISOString()
    };
    
    data.metrics.push(metric);
    saveData('metrics');
    
    closeModal('newMetricModal');
    document.getElementById('metricName').value = '';
    document.getElementById('metricUnit').value = '';
    
    // Expand the new metric
    expandedMetrics.add(metric.id);
    
    renderApp();
    showToast(`Metrica "${name}" creata!`, 'success');
}

function openAddMetricValue(metricId) {
    currentMetricId = metricId;
    const metric = data.metrics.find(m => m.id === metricId);
    
    document.getElementById('addMetricTitle').textContent = metric.name.toUpperCase();
    document.getElementById('metricValueLabel').textContent = `VALORE (${metric.unit})`;
    document.getElementById('currentMetricId').value = metricId;
    document.getElementById('metricValueInput').value = '';
    document.getElementById('metricValueDate').value = new Date().toISOString().split('T')[0];
    
    openModal('addMetricValueModal');
}

function saveMetricValue(event) {
    event.preventDefault();
    
    const metricId = document.getElementById('currentMetricId').value;
    const value = parseFloat(document.getElementById('metricValueInput').value);
    const date = document.getElementById('metricValueDate').value;
    
    data.metricValues.push({
        id: generateId(),
        metricId,
        value,
        date,
        timestamp: new Date().toISOString()
    });
    
    saveData('metricValues');
    closeModal('addMetricValueModal');
    
    renderApp();
    showToast('Valore registrato!', 'success');
}

function deleteMetricValue(valueId) {
    data.metricValues = data.metricValues.filter(v => v.id !== valueId);
    saveData('metricValues');
    renderApp();
    showToast('Valore eliminato', 'warning');
}

function deleteMetric(metricId) {
    if (!confirm('Eliminare questa metrica e tutti i suoi valori?')) return;
    
    const metric = data.metrics.find(m => m.id === metricId);
    data.metrics = data.metrics.filter(m => m.id !== metricId);
    data.metricValues = data.metricValues.filter(v => v.metricId !== metricId);
    
    saveData('metrics');
    saveData('metricValues');
    expandedMetrics.delete(metricId);
    
    renderApp();
    showToast(`Metrica "${metric.name}" eliminata`, 'warning');
}

function renderDisciplineStats() {
    const total = data.history.length;
    const completed = data.history.filter(h => h.status === 'done').length;
    const skipped = data.history.filter(h => h.status === 'skipped').length;
    const blocked = data.history.filter(h => h.status === 'blocked').length;
    
    const completedEl = document.getElementById('totalCompleted');
    const skippedEl = document.getElementById('totalSkipped');
    const blockedEl = document.getElementById('totalBlocked');
    const scoreEl = document.getElementById('disciplineScoreMain');
    
    if (completedEl) completedEl.textContent = completed;
    if (skippedEl) skippedEl.textContent = skipped;
    if (blockedEl) blockedEl.textContent = blocked;
    
    const score = calculateDisciplineScore();
    if (scoreEl) scoreEl.textContent = score;
    
    // Update ring
    const circle = document.getElementById('disciplineCircle');
    if (circle) {
        const circumference = 283;
        const offset = circumference - (score / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
}

// ==================== ADVANCED CALENDAR ====================
let currentCalendarDate = new Date();
let selectedCalendarDate = null;

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthYearEl = document.getElementById('calendarMonthYear');
    if (!grid || !monthYearEl) return;
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const today = new Date();
    const todayStr = getDateString(today);
    
    const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    
    monthYearEl.textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0
    
    // Get previous month days to fill
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    let html = '';
    
    // Previous month days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const date = new Date(year, month - 1, day);
        html += createCalendarDay(date, true, todayStr);
    }
    
    // Current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        html += createCalendarDay(date, false, todayStr);
    }
    
    // Next month days
    const totalCells = Math.ceil((startDayOfWeek + lastDay.getDate()) / 7) * 7;
    const remainingCells = totalCells - (startDayOfWeek + lastDay.getDate());
    for (let day = 1; day <= remainingCells; day++) {
        const date = new Date(year, month + 1, day);
        html += createCalendarDay(date, true, todayStr);
    }
    
    grid.innerHTML = html;
}

function createCalendarDay(date, isOtherMonth, todayStr) {
    const dateStr = getDateString(date);
    const isToday = dateStr === todayStr;
    const isSelected = selectedCalendarDate === dateStr;
    const dow = date.getDay();
    
    // Get goals and their status for this day
    const dayGoals = data.goals.filter(g => isGoalScheduledForDay(g, dow));
    const dayHistory = data.history.filter(h => h.date === dateStr);
    
    let dotsHtml = '';
    dayGoals.slice(0, 4).forEach(goal => {
        const entry = dayHistory.find(h => h.goalId === goal.id);
        const color = goal.color || '#00D26A';
        let dotStyle = '';
        let dotClass = '';
        
        if (entry) {
            if (entry.status === 'done') {
                dotStyle = `background: ${color}`;
            } else if (entry.status === 'skipped') {
                dotClass = 'skipped';
            } else {
                dotClass = 'blocked';
            }
        } else {
            dotStyle = `background: ${color}; opacity: 0.3`;
        }
        dotsHtml += `<div class="calendar-dot ${dotClass}" style="${dotStyle}"></div>`;
    });
    
    let classes = 'calendar-day';
    if (isOtherMonth) classes += ' other-month';
    if (isToday) classes += ' today';
    if (isSelected) classes += ' selected';
    
    return `
        <div class="${classes}" onclick="selectCalendarDay('${dateStr}')">
            <span class="calendar-day-number">${date.getDate()}</span>
            ${dotsHtml ? `<div class="calendar-day-dots">${dotsHtml}</div>` : ''}
        </div>
    `;
}

function navigateCalendar(direction) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
    renderCalendar();
}

function selectCalendarDay(dateStr) {
    selectedCalendarDate = dateStr;
    renderCalendar();
    openDayDetail(dateStr);
}

function openDayDetail(dateStr) {
    const panel = document.getElementById('dayDetailCard');
    const dateEl = document.getElementById('dayDetailDate');
    const contentEl = document.getElementById('dayDetailContent');
    
    if (!panel || !dateEl || !contentEl) return;
    
    const date = new Date(dateStr);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    dateEl.textContent = date.toLocaleDateString('it-IT', options);
    
    const dow = date.getDay();
    const dayGoals = data.goals.filter(g => isGoalScheduledForDay(g, dow));
    const dayHistory = data.history.filter(h => h.date === dateStr);
    
    if (dayGoals.length === 0) {
        contentEl.innerHTML = `<div class="day-empty"><i class="fas fa-calendar-xmark"></i><p>Nessun obiettivo per questo giorno</p></div>`;
    } else {
        contentEl.innerHTML = dayGoals.map(goal => {
            const entry = dayHistory.find(h => h.goalId === goal.id);
            let status = 'pending';
            let statusIcon = 'fa-circle';
            const color = goal.color || '#00D26A';
            const icon = goal.icon || getCategoryIcon(goal.category);
            
            if (entry) {
                status = entry.status === 'done' ? 'completed' : 
                         entry.status === 'skipped' ? 'skipped' : 'blocked';
                statusIcon = entry.status === 'done' ? 'fa-check' : 
                             entry.status === 'skipped' ? 'fa-forward' : 'fa-ban';
            }
            
            return `
                <div class="day-goal-item">
                    <div class="day-goal-status ${status}" style="${status === 'pending' ? `background: ${color}20; color: ${color}` : ''}">
                        <i class="fas ${status === 'pending' ? icon : statusIcon}"></i>
                    </div>
                    <div class="day-goal-info">
                        <div class="day-goal-name">${goal.name}</div>
                    </div>
                    <div class="day-goal-action">
                        <button class="btn-done" onclick="markGoalFromCalendar('${goal.id}', '${dateStr}', 'done')"><i class="fas fa-check"></i></button>
                        <button class="btn-skip" onclick="markGoalFromCalendar('${goal.id}', '${dateStr}', 'skipped')"><i class="fas fa-forward"></i></button>
                        <button class="btn-block" onclick="markGoalFromCalendar('${goal.id}', '${dateStr}', 'blocked')"><i class="fas fa-ban"></i></button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    panel.style.display = 'block';
}

function markGoalFromCalendar(goalId, dateStr, status) {
    // Remove existing entry for this goal and date
    data.history = data.history.filter(h => !(h.goalId === goalId && h.date === dateStr));
    
    // Add new entry
    data.history.push({
        id: generateId(),
        goalId,
        date: dateStr,
        status,
        action: status === 'done' ? 'completed' : status,
        note: '',
        timestamp: new Date().toISOString()
    });
    
    saveData('history');
    openDayDetail(dateStr);
    renderCalendar();
    renderApp();
}

function closeDayDetail() {
    const panel = document.getElementById('dayDetailCard');
    if (panel) panel.style.display = 'none';
    selectedCalendarDate = null;
    renderCalendar();
}

// ==================== STATS TABS ====================
let currentStatsTab = 'overview';
let currentTrendPeriod = 'week';

function switchStatsTab(tab) {
    currentStatsTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.stats-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(tab)) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide tab content
    document.getElementById('overviewTab').style.display = tab === 'overview' ? 'block' : 'none';
    document.getElementById('calendarTab').style.display = tab === 'calendar' ? 'block' : 'none';
    document.getElementById('trendsTab').style.display = tab === 'trends' ? 'block' : 'none';
    document.getElementById('bodyTab').style.display = tab === 'body' ? 'block' : 'none';
    
    // Render tab content
    if (tab === 'overview') {
        renderOverviewTab();
    } else if (tab === 'calendar') {
        renderCalendar();
    } else if (tab === 'trends') {
        renderTrendsTab();
    } else if (tab === 'body') {
        renderBodyTab();
    }
}

function renderStatsHero() {
    // Update hero metrics
    const streak = calculateOverallStreak();
    const stats = calculateDisciplineStats();
    const discipline = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    
    const heroStreak = document.getElementById('statsHeroStreak');
    const heroDiscipline = document.getElementById('statsHeroDiscipline');
    const heroCompleted = document.getElementById('statsHeroCompleted');
    
    if (heroStreak) heroStreak.textContent = streak;
    if (heroDiscipline) heroDiscipline.textContent = discipline + '%';
    if (heroCompleted) heroCompleted.textContent = stats.completed;
}

function renderOverviewTab() {
    const stats = calculateDisciplineStats();
    const discipline = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    const streak = calculateOverallStreak();
    
    // Update stat cards
    const cardCompleted = document.getElementById('statsCardCompleted');
    const cardStreak = document.getElementById('statsCardStreak');
    const cardGoals = document.getElementById('statsCardGoals');
    const cardBestStreak = document.getElementById('statsCardBestStreak');
    
    if (cardCompleted) cardCompleted.textContent = stats.completed;
    if (cardStreak) cardStreak.textContent = streak;
    if (cardGoals) cardGoals.textContent = data.goals.length;
    if (cardBestStreak) cardBestStreak.textContent = calculateBestStreak();
    
    // Render weekly performance bars
    renderWeeklyPerfBars();
    
    // Update discipline ring
    const disciplinePercent = document.getElementById('disciplinePercent');
    const ringFill = document.getElementById('disciplineRingFill');
    const discCompleted = document.getElementById('discCompleted');
    const discSkipped = document.getElementById('discSkipped');
    const discBlocked = document.getElementById('discBlocked');
    
    if (disciplinePercent) disciplinePercent.textContent = discipline + '%';
    if (ringFill) {
        const circumference = 2 * Math.PI * 52; // ~327
        const offset = circumference - (discipline / 100) * circumference;
        ringFill.style.strokeDashoffset = offset;
    }
    if (discCompleted) discCompleted.textContent = stats.completed;
    if (discSkipped) discSkipped.textContent = stats.skipped;
    if (discBlocked) discBlocked.textContent = stats.blocked;
    
    // Update report previews
    updateReportPreviews();
}

function renderWeeklyPerfBars() {
    const container = document.getElementById('weeklyPerfBars');
    if (!container) return;
    
    const days = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
    const today = new Date();
    let html = '';
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = getDateString(date);
        const dow = date.getDay();
        
        const dayGoals = data.goals.filter(g => isGoalScheduledForDay(g, dow));
        const dayHistory = data.history.filter(h => h.date === dateStr && h.status === 'done');
        
        const total = dayGoals.length;
        const completed = dayHistory.length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        
        const dayIndex = (dow + 6) % 7; // Convert to Monday=0
        
        html += `
            <div class="weekly-bar-wrap">
                <div class="weekly-bar-track">
                    <div class="weekly-bar-fill" style="height: ${percentage}%"></div>
                </div>
                <span class="weekly-bar-label">${days[dayIndex]}</span>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function updateReportPreviews() {
    // Mood average - use lt_moods from elite-features
    const moodData = JSON.parse(localStorage.getItem('lt_moods') || '[]');
    const moodAvg = document.getElementById('moodAvgPreview');
    if (moodAvg && moodData.length > 0) {
        const avg = moodData.reduce((sum, m) => sum + m.value, 0) / moodData.length;
        const moods = ['😢', '😕', '😐', '🙂', '😄'];
        moodAvg.textContent = moods[Math.round(avg) - 1] || '-';
    }
    
    // Sleep average
    const sleepData = data.history.filter(h => h.goalId && data.goals.find(g => g.id === h.goalId && g.category === 'salute'));
    const sleepAvg = document.getElementById('sleepAvgPreview');
    if (sleepAvg) {
        sleepAvg.textContent = '-';
    }
    
    // Water average - use lt_water from elite-features
    const waterData = JSON.parse(localStorage.getItem('lt_water') || '[]');
    const waterAvg = document.getElementById('waterAvgPreview');
    if (waterAvg && waterData.length > 0) {
        const avg = waterData.reduce((sum, w) => sum + (w.glasses || 0), 0) / waterData.length;
        waterAvg.textContent = avg.toFixed(1) + ' 💧';
    } else if (waterAvg) {
        // Fallback: get today's water
        const todayWater = JSON.parse(localStorage.getItem('lt_water_today') || '{"glasses": 0}');
        waterAvg.textContent = todayWater.glasses + ' 💧';
    }
    
    // Workout count - use sessions and runs
    const workoutCount = document.getElementById('workoutCountPreview');
    if (workoutCount) {
        const sessions = data.workoutSessions || [];
        const runs = data.runs || [];
        const totalWorkouts = sessions.length + runs.length;
        workoutCount.textContent = totalWorkouts;
    }
}

function calculateBestStreak() {
    if (data.goals.length === 0) return 0;
    
    let bestStreak = 0;
    let currentStreak = 0;
    
    const dates = [];
    const today = new Date();
    for (let i = 365; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(getDateString(date));
    }
    
    dates.forEach(dateStr => {
        const date = new Date(dateStr);
        const dow = date.getDay();
        const dayGoals = data.goals.filter(g => isGoalScheduledForDay(g, dow));
        
        if (dayGoals.length > 0) {
            const dayHistory = data.history.filter(h => h.date === dateStr && h.status === 'done');
            const allDone = dayGoals.every(g => dayHistory.some(h => h.goalId === g.id));
            
            if (allDone) {
                currentStreak++;
                if (currentStreak > bestStreak) bestStreak = currentStreak;
            } else {
                currentStreak = 0;
            }
        }
    });
    
    return bestStreak;
}

function renderTrendsTab() {
    renderTrendChart();
    renderInsights();
    renderComparison();
}

function setTrendPeriod(period) {
    currentTrendPeriod = period;
    
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(period)) {
            btn.classList.add('active');
        }
    });
    
    renderTrendChart();
    renderComparison();
}

function renderTrendChart() {
    const container = document.getElementById('trendChart');
    if (!container) return;
    
    const days = currentTrendPeriod === 'week' ? 7 : currentTrendPeriod === 'month' ? 30 : 365;
    const today = new Date();
    let html = '';
    let maxBars = currentTrendPeriod === 'year' ? 12 : days;
    
    if (currentTrendPeriod === 'year') {
        // Monthly data for year view
        for (let i = 11; i >= 0; i--) {
            const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
            
            let totalGoals = 0;
            let completed = 0;
            
            for (let d = 1; d <= lastDay.getDate(); d++) {
                const date = new Date(month.getFullYear(), month.getMonth(), d);
                const dateStr = getDateString(date);
                const dow = date.getDay();
                
                const dayGoals = data.goals.filter(g => isGoalScheduledForDay(g, dow));
                const dayHistory = data.history.filter(h => h.date === dateStr && h.status === 'done');
                
                totalGoals += dayGoals.length;
                completed += dayHistory.length;
            }
            
            const percentage = totalGoals > 0 ? (completed / totalGoals) * 100 : 0;
            html += `<div class="trend-bar" style="height: ${percentage}%"></div>`;
        }
    } else {
        // Daily data
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = getDateString(date);
            const dow = date.getDay();
            
            const dayGoals = data.goals.filter(g => isGoalScheduledForDay(g, dow));
            const dayHistory = data.history.filter(h => h.date === dateStr && h.status === 'done');
            
            const total = dayGoals.length;
            const completed = dayHistory.length;
            const percentage = total > 0 ? (completed / total) * 100 : 0;
            
            html += `<div class="trend-bar" style="height: ${percentage}%"></div>`;
        }
    }
    
    container.innerHTML = html;
}

function renderInsights() {
    const container = document.getElementById('insightsList');
    if (!container) return;
    
    const insights = [];
    const stats = calculateDisciplineStats();
    const streak = calculateOverallStreak();
    
    if (streak >= 7) {
        insights.push({
            icon: 'fa-fire',
            text: `Fantastico! Hai una streak di ${streak} giorni. Continua così!`,
            color: '#F97316'
        });
    }
    
    if (stats.completed >= 10) {
        insights.push({
            icon: 'fa-trophy',
            text: `Hai completato ${stats.completed} obiettivi. Sei sulla strada giusta!`,
            color: '#EAB308'
        });
    }
    
    const discipline = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    if (discipline >= 80) {
        insights.push({
            icon: 'fa-medal',
            text: `La tua disciplina è al ${discipline}%. Eccellente!`,
            color: '#22C55E'
        });
    } else if (discipline < 50 && stats.total > 0) {
        insights.push({
            icon: 'fa-lightbulb',
            text: 'Prova a concentrarti su meno obiettivi per aumentare il tuo tasso di completamento.',
            color: '#FACC15'
        });
    }
    
    if (insights.length === 0) {
        insights.push({
            icon: 'fa-lightbulb',
            text: 'Completa più obiettivi per sbloccare insights personalizzati',
            color: '#FACC15'
        });
    }
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-card">
            <div class="insight-icon" style="background: ${insight.color}20; color: ${insight.color}">
                <i class="fas ${insight.icon}"></i>
            </div>
            <div class="insight-text">${insight.text}</div>
        </div>
    `).join('');
}

function renderComparison() {
    const today = new Date();
    
    // This week
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay() + 1);
    const thisWeekPercentage = calculatePeriodPercentage(thisWeekStart, today);
    
    // Last week
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
    const lastWeekPercentage = calculatePeriodPercentage(lastWeekStart, lastWeekEnd);
    
    // This month
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthPercentage = calculatePeriodPercentage(thisMonthStart, today);
    
    // Last month
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    const lastMonthPercentage = calculatePeriodPercentage(lastMonthStart, lastMonthEnd);
    
    const weekChange = thisWeekPercentage - lastWeekPercentage;
    const monthChange = thisMonthPercentage - lastMonthPercentage;
    
    const thisWeekEl = document.getElementById('thisWeekCompare');
    const thisMonthEl = document.getElementById('thisMonthCompare');
    const weekChangeEl = document.getElementById('weekChange');
    const monthChangeEl = document.getElementById('monthChange');
    
    if (thisWeekEl) thisWeekEl.textContent = thisWeekPercentage + '%';
    if (thisMonthEl) thisMonthEl.textContent = thisMonthPercentage + '%';
    
    if (weekChangeEl) {
        weekChangeEl.textContent = (weekChange >= 0 ? '+' : '') + weekChange + '%';
        weekChangeEl.className = 'comparison-change ' + (weekChange >= 0 ? 'positive' : 'negative');
    }
    
    if (monthChangeEl) {
        monthChangeEl.textContent = (monthChange >= 0 ? '+' : '') + monthChange + '%';
        monthChangeEl.className = 'comparison-change ' + (monthChange >= 0 ? 'positive' : 'negative');
    }
}

function calculatePeriodPercentage(startDate, endDate) {
    let totalGoals = 0;
    let completed = 0;
    
    const current = new Date(startDate);
    while (current <= endDate) {
        const dateStr = getDateString(current);
        const dow = current.getDay();
        
        const dayGoals = data.goals.filter(g => isGoalScheduledForDay(g, dow));
        const dayHistory = data.history.filter(h => h.date === dateStr && h.status === 'done');
        
        totalGoals += dayGoals.length;
        completed += dayHistory.length;
        
        current.setDate(current.getDate() + 1);
    }
    
    return totalGoals > 0 ? Math.round((completed / totalGoals) * 100) : 0;
}

// ==================== BODY TAB ====================
function renderBodyTab() {
    renderWeightStats();
    renderMeasurementsGrid();
    renderMeasurementChart();
    renderProgressSummary();
}

function getEliteMeasurements() {
    return JSON.parse(localStorage.getItem('lt_measurements') || '[]');
}

function renderWeightStats() {
    const measurements = getEliteMeasurements();
    const weights = measurements.filter(m => m.type === 'weight').sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const currentWeightEl = document.getElementById('currentWeight');
    const startWeightEl = document.getElementById('startWeight');
    const weightChangeEl = document.getElementById('weightChange');
    const goalWeightEl = document.getElementById('goalWeight');
    
    if (weights.length > 0) {
        const current = weights[weights.length - 1].value;
        const start = weights[0].value;
        const change = current - start;
        
        if (currentWeightEl) currentWeightEl.textContent = current.toFixed(1);
        if (startWeightEl) startWeightEl.textContent = start.toFixed(1) + ' kg';
        if (weightChangeEl) {
            const sign = change > 0 ? '+' : '';
            weightChangeEl.textContent = sign + change.toFixed(1) + ' kg';
            weightChangeEl.className = 'body-change-value ' + (change < 0 ? 'positive' : change > 0 ? 'negative' : '');
        }
    } else {
        if (currentWeightEl) currentWeightEl.textContent = '--';
        if (startWeightEl) startWeightEl.textContent = '--';
        if (weightChangeEl) weightChangeEl.textContent = '--';
    }
    
    // Goal weight from profile
    const profile = JSON.parse(localStorage.getItem('lt_profile') || '{}');
    if (goalWeightEl) goalWeightEl.textContent = profile.goalWeight ? profile.goalWeight + ' kg' : '--';
    
    // Render weight chart
    renderWeightChart(weights);
}

function renderWeightChart(weights) {
    const container = document.getElementById('weightChart');
    if (!container) return;
    
    if (weights.length === 0) {
        container.innerHTML = '<p style="color:var(--gray-500);text-align:center;padding:var(--space-lg);">Nessun dato peso disponibile</p>';
        return;
    }
    
    const last10 = weights.slice(-10);
    const maxVal = Math.max(...last10.map(w => w.value));
    const minVal = Math.min(...last10.map(w => w.value));
    const range = maxVal - minVal || 1;
    
    container.innerHTML = `
        <div class="body-chart-bars">
            ${last10.map((w, i) => {
                const height = ((w.value - minVal) / range) * 70 + 30;
                const date = new Date(w.date).toLocaleDateString('it', { day: 'numeric', month: 'short' });
                const isLatest = i === last10.length - 1;
                return `<div class="body-chart-bar ${isLatest ? 'latest' : ''}" style="height: ${height}%">
                    <span class="body-bar-value">${w.value}</span>
                    <span class="body-bar-label">${date}</span>
                </div>`;
            }).join('')}
        </div>
    `;
}

function renderMeasurementsGrid() {
    const container = document.getElementById('measurementsStatsGrid');
    if (!container) return;
    
    const measurements = getEliteMeasurements();
    const types = ['waist', 'chest', 'arms', 'thighs', 'hips'];
    const labels = { waist: 'Vita', chest: 'Petto', arms: 'Braccia', thighs: 'Cosce', hips: 'Fianchi' };
    const icons = { waist: 'fa-circle-notch', chest: 'fa-heart', arms: 'fa-hand-fist', thighs: 'fa-person-walking', hips: 'fa-child-reaching' };
    
    const cards = types.map(type => {
        const vals = measurements.filter(m => m.type === type).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (vals.length === 0) {
            return `<div class="measurement-stat-card">
                <div class="measurement-stat-icon"><i class="fas ${icons[type]}"></i></div>
                <div class="measurement-stat-info">
                    <span class="measurement-stat-label">${labels[type]}</span>
                    <span class="measurement-stat-value">--</span>
                </div>
            </div>`;
        }
        
        const current = vals[vals.length - 1].value;
        const first = vals[0].value;
        const change = current - first;
        const changeClass = change < 0 ? 'positive' : change > 0 ? 'negative' : '';
        const changeSign = change > 0 ? '+' : '';
        
        return `<div class="measurement-stat-card">
            <div class="measurement-stat-icon"><i class="fas ${icons[type]}"></i></div>
            <div class="measurement-stat-info">
                <span class="measurement-stat-label">${labels[type]}</span>
                <span class="measurement-stat-value">${current} cm</span>
                ${vals.length > 1 ? `<span class="measurement-stat-change ${changeClass}">${changeSign}${change.toFixed(1)}</span>` : ''}
            </div>
        </div>`;
    });
    
    container.innerHTML = cards.join('');
}

function renderMeasurementChart() {
    const container = document.getElementById('measurementChart');
    if (!container) return;
    
    const select = document.getElementById('measurementTypeSelect');
    const type = select ? select.value : 'weight';
    
    const measurements = getEliteMeasurements();
    const vals = measurements.filter(m => m.type === type).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (vals.length === 0) {
        container.innerHTML = '<p style="color:var(--gray-500);text-align:center;padding:var(--space-lg);">Nessun dato disponibile per questa misura</p>';
        return;
    }
    
    const last10 = vals.slice(-10);
    const maxVal = Math.max(...last10.map(v => v.value));
    const minVal = Math.min(...last10.map(v => v.value));
    const range = maxVal - minVal || 1;
    const unit = type === 'weight' ? 'kg' : 'cm';
    
    container.innerHTML = `
        <div class="body-chart-bars">
            ${last10.map((v, i) => {
                const height = ((v.value - minVal) / range) * 70 + 30;
                const date = new Date(v.date).toLocaleDateString('it', { day: 'numeric', month: 'short' });
                const isLatest = i === last10.length - 1;
                return `<div class="body-chart-bar ${isLatest ? 'latest' : ''}" style="height: ${height}%">
                    <span class="body-bar-value">${v.value}</span>
                    <span class="body-bar-label">${date}</span>
                </div>`;
            }).join('')}
        </div>
    `;
}

function renderProgressSummary() {
    const container = document.getElementById('progressSummaryCards');
    if (!container) return;
    
    const measurements = getEliteMeasurements();
    const types = ['weight', 'waist', 'chest', 'arms', 'thighs', 'hips'];
    const labels = { weight: 'Peso', waist: 'Vita', chest: 'Petto', arms: 'Braccia', thighs: 'Cosce', hips: 'Fianchi' };
    const units = { weight: 'kg', waist: 'cm', chest: 'cm', arms: 'cm', thighs: 'cm', hips: 'cm' };
    
    const cards = [];
    
    types.forEach(type => {
        const vals = measurements.filter(m => m.type === type).sort((a, b) => new Date(a.date) - new Date(b.date));
        if (vals.length >= 2) {
            const first = vals[0];
            const last = vals[vals.length - 1];
            const change = last.value - first.value;
            const percentage = first.value !== 0 ? ((change / first.value) * 100).toFixed(1) : 0;
            
            const daysAgo = Math.round((new Date() - new Date(first.date)) / (1000 * 60 * 60 * 24));
            const changeClass = change < 0 ? 'positive' : change > 0 ? 'negative' : '';
            const changeSign = change > 0 ? '+' : '';
            
            cards.push(`<div class="progress-summary-card">
                <div class="progress-summary-header">
                    <span class="progress-summary-label">${labels[type]}</span>
                    <span class="progress-summary-period">${daysAgo} giorni</span>
                </div>
                <div class="progress-summary-values">
                    <span class="progress-summary-start">${first.value} ${units[type]}</span>
                    <i class="fas fa-arrow-right"></i>
                    <span class="progress-summary-current">${last.value} ${units[type]}</span>
                </div>
                <div class="progress-summary-change ${changeClass}">
                    ${changeSign}${change.toFixed(1)} ${units[type]} (${changeSign}${percentage}%)
                </div>
            </div>`);
        }
    });
    
    if (cards.length === 0) {
        container.innerHTML = '<p style="color:var(--gray-500);text-align:center;padding:var(--space-lg);">Registra almeno 2 misurazioni per vedere i progressi</p>';
    } else {
        container.innerHTML = cards.join('');
    }
}

function saveQuickWeight(event) {
    event.preventDefault();
    
    const weight = parseFloat(document.getElementById('quickWeight').value);
    const dateInput = document.getElementById('quickWeightDate').value;
    const date = dateInput ? new Date(dateInput).toISOString() : new Date().toISOString();
    
    if (!weight || weight <= 0) {
        showToast('Inserisci un peso valido', 'error');
        return;
    }
    
    // Save to measurements
    let measurements = JSON.parse(localStorage.getItem('lt_measurements') || '[]');
    
    measurements.push({
        id: Date.now().toString(),
        date: date,
        type: 'weight',
        value: weight
    });
    
    localStorage.setItem('lt_measurements', JSON.stringify(measurements));
    
    closeModal('addWeightModal');
    document.getElementById('quickWeight').value = '';
    document.getElementById('quickWeightDate').value = '';
    
    renderBodyTab();
    showToast('Peso salvato!', 'success');
}

function renderWorkouts() {
    renderExercisesList();
    renderExerciseProgress();
}

function renderExercisesList() {
    const container = document.getElementById('exercisesList');
    if (!container) return;
    
    const recentExercises = [...data.exercises]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 8);
    
    if (recentExercises.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-dumbbell"></i>
                <p>Nessun esercizio registrato</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentExercises.map(ex => `
        <div class="exercise-item-compact">
            <div class="exercise-icon-sm"><i class="fas fa-dumbbell"></i></div>
            <div class="exercise-info-compact">
                <div class="exercise-name-sm">${ex.name}</div>
            </div>
            <div class="exercise-weight-sm">${ex.weight}kg</div>
        </div>
    `).join('');
}

function renderExerciseProgress() {
    const container = document.getElementById('exerciseProgress');
    if (!container) return;
    
    // Group by exercise name
    const byName = {};
    data.exercises.forEach(ex => {
        if (!byName[ex.name]) byName[ex.name] = [];
        byName[ex.name].push(ex);
    });
    
    const progressData = Object.keys(byName).map(name => {
        const exs = byName[name].sort((a, b) => new Date(a.date) - new Date(b.date));
        const first = exs[0].weight;
        const last = exs[exs.length - 1].weight;
        const diff = last - first;
        const percent = first > 0 ? Math.round((diff / first) * 100) : 0;
        
        return { name, entries: exs, diff, percent };
    });
    
    if (progressData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>I progressi appariranno qui</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `<div class="exercise-progress-compact">${progressData.slice(0, 6).map(p => `
        <div class="progress-item-compact">
            <span class="progress-name">${p.name}</span>
            <span class="progress-value">${p.diff >= 0 ? '+' : ''}${p.diff}kg</span>
        </div>
    `).join('')}</div>`;
}

function renderDocuments() {
    const container = document.getElementById('documentsList');
    if (!container) return;
    
    if (data.documents.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file"></i>
                <p>Nessun documento caricato</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = data.documents.map(doc => {
        const isImage = doc.type.startsWith('image/');
        
        return `
            <div class="document-card" onclick="viewDocument('${doc.id}')">
                <div class="document-icon ${isImage ? 'image' : ''}">
                    <i class="fas ${isImage ? 'fa-image' : 'fa-file-pdf'}"></i>
                </div>
                <div class="document-info">
                    <div class="document-name">${doc.name}</div>
                    <div class="document-meta">${new Date(doc.date).toLocaleDateString('it-IT')}</div>
                </div>
                <button class="document-delete" onclick="event.stopPropagation(); deleteDocument('${doc.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
}

// ==================== GOAL MANAGEMENT ====================
function saveGoal(event) {
    event.preventDefault();
    
    const name = document.getElementById('goalName').value.trim();
    const category = document.querySelector('.cat-btn.selected')?.dataset.cat || 'health';
    const categoryIcon = document.querySelector('.cat-btn.selected')?.dataset.icon || 'fa-heart-pulse';
    const color = document.querySelector('.color-btn.selected')?.dataset.color || '#00D26A';
    const frequency = document.getElementById('goalFrequency').value;
    const notifyEnabled = document.getElementById('goalNotification').checked;
    const notifyTime = document.getElementById('goalNotificationTime').value;
    
    let days = [];
    if (frequency === 'daily') days = [0, 1, 2, 3, 4, 5, 6];
    else if (frequency === 'weekdays') days = [1, 2, 3, 4, 5];
    else if (frequency === 'custom') {
        days = Array.from(document.querySelectorAll('#customDaysGroup input:checked'))
            .map(cb => parseInt(cb.value));
    }
    
    const goal = {
        id: generateId(),
        name,
        category,
        icon: categoryIcon,
        color,
        frequency,
        days,
        notification: notifyEnabled ? notifyTime : null,
        createdAt: new Date().toISOString()
    };
    
    data.goals.push(goal);
    saveData('goals');
    
    // Schedule notification if enabled
    if (notifyEnabled) {
        scheduleGoalNotification(goal);
    }
    
    closeModal('addGoalModal');
    document.getElementById('addGoalForm').reset();
    document.getElementById('goalNotification').checked = false;
    document.getElementById('notificationTimeGroup').classList.add('hidden');
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
    document.querySelector('.cat-btn[data-cat="health"]').classList.add('selected');
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
    document.querySelector('.color-btn').classList.add('selected');
    
    renderApp();
    showToast('Obiettivo aggiunto!', 'success');
}

function deleteGoal(id) {
    if (!confirm('Eliminare questo obiettivo?')) return;
    
    data.goals = data.goals.filter(g => g.id !== id);
    data.history = data.history.filter(h => h.goalId !== id);
    saveData('goals');
    saveData('history');
    
    renderApp();
    showToast('Obiettivo eliminato', 'warning');
}

function openCheckin(goalId) {
    currentGoalId = goalId;
    const goal = data.goals.find(g => g.id === goalId);
    document.getElementById('checkinGoalName').textContent = goal.name;
    document.getElementById('checkinNote').value = '';
    openModal('checkinModal');
}

function markGoal(status) {
    if (!currentGoalId) return;
    
    const todayStr = getDateString(new Date());
    const note = document.getElementById('checkinNote').value.trim();
    
    // Remove existing entry
    data.history = data.history.filter(h => !(h.goalId === currentGoalId && h.date === todayStr));
    
    // Add new entry
    data.history.push({
        goalId: currentGoalId,
        date: todayStr,
        status,
        note,
        timestamp: new Date().toISOString()
    });
    
    saveData('history');
    closeModal('checkinModal');
    renderApp();
    
    const messages = {
        done: 'Fantastico! 🎉',
        skipped: 'Domani farai meglio! 💪',
        blocked: 'Capisco, succede. 🙏'
    };
    
    showToast(messages[status], status === 'done' ? 'success' : 'warning');
    currentGoalId = null;
}

// ==================== EXERCISES ====================
function saveExercise(event) {
    event.preventDefault();
    
    const name = document.getElementById('exerciseName').value.trim();
    const weight = parseFloat(document.getElementById('exerciseWeight').value);
    const reps = parseInt(document.getElementById('exerciseReps').value);
    const sets = parseInt(document.getElementById('exerciseSets').value);
    
    data.exercises.push({
        id: generateId(),
        name,
        weight,
        reps,
        sets,
        date: new Date().toISOString()
    });
    
    saveData('exercises');
    closeModal('exerciseModal');
    
    document.getElementById('exerciseName').value = '';
    document.getElementById('exerciseWeight').value = '';
    document.getElementById('exerciseReps').value = '';
    document.getElementById('exerciseSets').value = '';
    
    updateExerciseSuggestions();
    renderApp();
    showToast('Esercizio registrato!', 'success');
}

function updateExerciseSuggestions() {
    const datalist = document.getElementById('exerciseSuggestions');
    if (!datalist) return;
    
    const uniqueNames = [...new Set(data.exercises.map(e => e.name))];
    datalist.innerHTML = uniqueNames.map(name => `<option value="${name}">`).join('');
}

// ==================== DOCUMENTS ====================
function saveDocument(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('fileInput');
    const nameInput = document.getElementById('documentName');
    
    if (!fileInput.files.length) {
        showToast('Seleziona un file', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
        data.documents.push({
            id: generateId(),
            name: nameInput.value || file.name,
            type: file.type,
            data: e.target.result,
            date: new Date().toISOString()
        });
        
        saveData('documents');
        closeModal('uploadModal');
        
        fileInput.value = '';
        nameInput.value = '';
        document.getElementById('uploadZone').classList.remove('has-file');
        document.getElementById('uploadZone').querySelector('p').textContent = 'Tocca per selezionare un file';
        
        renderApp();
        showToast('Documento caricato!', 'success');
    };
    
    reader.readAsDataURL(file);
}

function viewDocument(id) {
    const doc = data.documents.find(d => d.id === id);
    if (!doc) return;
    
    const win = window.open();
    if (doc.type === 'application/pdf') {
        win.document.write(`<iframe src="${doc.data}" style="width:100%;height:100%;border:none;"></iframe>`);
    } else {
        win.document.write(`<img src="${doc.data}" style="max-width:100%;height:auto;">`);
    }
}

function deleteDocument(id) {
    if (!confirm('Eliminare questo documento?')) return;
    
    data.documents = data.documents.filter(d => d.id !== id);
    saveData('documents');
    renderApp();
    showToast('Documento eliminato', 'warning');
}

// ==================== PROFILE MANAGEMENT ====================
function loadProfile() {
    try {
        const profile = JSON.parse(localStorage.getItem('lt_profile') || '{}');
        
        // Update display elements
        const nameEl = document.getElementById('profileName');
        const bioEl = document.getElementById('profileBio');
        const photoEl = document.getElementById('profilePhoto');
        
        if (nameEl) nameEl.textContent = profile.name || 'IL TUO NOME';
        if (bioEl) bioEl.textContent = profile.bio || 'Tocca per modificare il profilo';
        
        if (photoEl) {
            if (profile.photo && profile.photo.startsWith('data:')) {
                photoEl.src = profile.photo;
                photoEl.style.display = 'block';
            } else {
                // Default avatar icon
                photoEl.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iNjAiIGZpbGw9IiMzMzMiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjQ1IiByPSIyMCIgZmlsbD0iIzY2NiIvPjxwYXRoIGQ9Ik0yNSA5NWMwLTIwIDIwLTMwIDM1LTMwczM1IDEwIDM1IDMwIiBmaWxsPSIjNjY2Ii8+PC9zdmc+';
                photoEl.style.display = 'block';
            }
        }
        
        // Update profile stats
        updateProfileStats();
    } catch (e) {
        console.error('Error loading profile:', e);
    }
}

function updateProfileStats() {
    const levelEl = document.getElementById('profileLevel');
    const streakEl = document.getElementById('profileStreak');
    const badgesEl = document.getElementById('profileBadges');
    
    // Get real level from elite user data
    if (levelEl) {
        const userData = JSON.parse(localStorage.getItem('lt_user') || '{}');
        const level = userData.level || 1;
        levelEl.textContent = level;
    }
    
    // Get real streak
    if (streakEl) {
        const streak = calculateOverallStreak();
        streakEl.textContent = streak;
    }
    
    // Get real badge count
    if (badgesEl) {
        const badges = JSON.parse(localStorage.getItem('lt_badges') || '[]');
        badgesEl.textContent = badges.length;
    }
}

function saveProfilePhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Compress image before saving (smaller size for profile photo)
    compressImage(file, 300, 0.6, (compressedData) => {
        try {
            const profile = JSON.parse(localStorage.getItem('lt_profile') || '{}');
            profile.photo = compressedData;
            localStorage.setItem('lt_profile', JSON.stringify(profile));
            try { localStorage.setItem('lt_last_local_change_ms', String(Date.now())); } catch (_) {}
            
            // Verify save worked
            const saved = localStorage.getItem('lt_profile');
            if (saved && JSON.parse(saved).photo) {
                const photoEl = document.getElementById('profilePhoto');
                if (photoEl) photoEl.src = compressedData;
                showToast('Foto profilo aggiornata!', 'success');

                // Ensure the change is persisted to cloud immediately (avoid losing on app close)
                if (typeof flushCloudSave === 'function') {
                    flushCloudSave('profile-photo');
                } else if (typeof saveToCloud === 'function') {
                    saveToCloud();
                }

                // Public avatar for Social (friends can see it)
                try {
                    if (typeof window.ltUploadAvatarFromDataUrl === 'function') {
                        window.ltUploadAvatarFromDataUrl(compressedData);
                    }
                } catch (_) {}
            } else {
                showToast('Errore nel salvataggio', 'error');
            }
        } catch (e) {
            console.error('Error saving profile photo:', e);
            showToast('Immagine troppo grande', 'error');
        }
    });
    
    // Clear input
    event.target.value = '';
}

function saveProfile(event) {
    event.preventDefault();
    
    try {
        const profile = JSON.parse(localStorage.getItem('lt_profile') || '{}');
        
        profile.name = document.getElementById('editProfileName').value;
        profile.bio = document.getElementById('editProfileBio').value;
        profile.age = document.getElementById('editProfileAge').value;
        profile.goalWeight = document.getElementById('editProfileGoalWeight').value;
        profile.goal = document.getElementById('editProfileGoal').value;
        
        localStorage.setItem('lt_profile', JSON.stringify(profile));
        try { localStorage.setItem('lt_last_local_change_ms', String(Date.now())); } catch (_) {}
        
        // Verify save worked
        const saved = JSON.parse(localStorage.getItem('lt_profile') || '{}');
        console.log('Profile saved:', saved);
        
        if (saved.name === profile.name) {
            loadProfile();
            closeModal('editProfileModal');
            showToast('Profilo aggiornato!', 'success');

            // Keep cloud public profile in sync (name shown to friends)
            try {
                if (typeof window.ltSyncPublicProfile === 'function') {
                    window.ltSyncPublicProfile({ name: profile.name });
                }
            } catch (_) {}

            if (typeof flushCloudSave === 'function') {
                flushCloudSave('profile');
            } else if (typeof saveToCloud === 'function') {
                saveToCloud();
            }
        } else {
            showToast('Errore nel salvataggio', 'error');
        }
    } catch (e) {
        console.error('Error saving profile:', e);
        showToast('Errore nel salvataggio', 'error');
    }
}

function openEditProfileModal() {
    const profile = JSON.parse(localStorage.getItem('lt_profile') || '{}');
    
    const nameInput = document.getElementById('editProfileName');
    const bioInput = document.getElementById('editProfileBio');
    const ageInput = document.getElementById('editProfileAge');
    const goalWeightInput = document.getElementById('editProfileGoalWeight');
    const goalSelect = document.getElementById('editProfileGoal');
    
    if (nameInput) nameInput.value = profile.name || '';
    if (bioInput) bioInput.value = profile.bio || '';
    if (ageInput) ageInput.value = profile.age || '';
    if (goalWeightInput) goalWeightInput.value = profile.goalWeight || '';
    if (goalSelect) goalSelect.value = profile.goal || 'health';
}

// ==================== SOCIAL SYSTEM ====================
function getMyInviteCode() {
    let code = localStorage.getItem('lt_invite_code');
    if (!code) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        code = 'LIFE-';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        localStorage.setItem('lt_invite_code', code);
    }
    return code;
}

function loadSocialData() {
    // Generate/load invite code
    const myCode = getMyInviteCode();
    const codeEl = document.getElementById('myInviteCode');
    if (codeEl) codeEl.textContent = myCode;
    
    // Load friends
    const friends = JSON.parse(localStorage.getItem('lt_friends') || '[]');
    const friendsCountEl = document.getElementById('friendsCount');
    if (friendsCountEl) friendsCountEl.textContent = friends.length;
    
    renderFriendsList();
}

function renderFriendsList() {
    const friends = JSON.parse(localStorage.getItem('lt_friends') || '[]');
    const container = document.getElementById('friendsList');
    if (!container) return;
    
    if (friends.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-group"></i>
                <p>Nessun amico ancora</p>
                <button class="btn btn-secondary" onclick="openModal('inviteFriendModal')">Invita amici</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = friends.map((friend, index) => `
        <div class="friend-item">
            <div class="friend-avatar">${friend.name.charAt(0).toUpperCase()}</div>
            <div class="friend-info">
                <div class="friend-name">${friend.name}</div>
                <div class="friend-stats">Streak: ${friend.streak || 0} giorni</div>
            </div>
            <button class="friend-action" onclick="removeFriend(${index})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

function copyInviteCode() {
    const code = getMyInviteCode();
    navigator.clipboard.writeText(code).then(() => {
        showToast('Codice copiato!', 'success');
    });
}

function addFriendByCode(event) {
    event.preventDefault();
    const code = document.getElementById('friendCode').value.trim().toUpperCase();
    
    if (code === getMyInviteCode()) {
        showToast('Non puoi aggiungere te stesso!', 'error');
        return;
    }
    
    const friends = JSON.parse(localStorage.getItem('lt_friends') || '[]');
    
    // Check if already added
    if (friends.some(f => f.code === code)) {
        showToast('Amico già aggiunto!', 'warning');
        return;
    }
    
    // Add friend (in a real app, this would verify the code with a server)
    friends.push({
        code: code,
        name: 'Amico ' + (friends.length + 1),
        streak: Math.floor(Math.random() * 30),
        addedAt: new Date().toISOString()
    });
    
    localStorage.setItem('lt_friends', JSON.stringify(friends));
    
    document.getElementById('friendCode').value = '';
    closeModal('inviteFriendModal');
    loadSocialData();
    showToast('Amico aggiunto!', 'success');
}

function removeFriend(index) {
    const friends = JSON.parse(localStorage.getItem('lt_friends') || '[]');
    friends.splice(index, 1);
    localStorage.setItem('lt_friends', JSON.stringify(friends));
    loadSocialData();
    showToast('Amico rimosso', 'warning');
}

function shareInvite(platform) {
    const code = getMyInviteCode();
    const message = `Unisciti a me su Life Tracker! Usa il mio codice: ${code}`;
    const url = encodeURIComponent(window.location.href);
    
    switch (platform) {
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
            break;
        case 'telegram':
            window.open(`https://t.me/share/url?url=${url}&text=${encodeURIComponent(message)}`, '_blank');
            break;
        case 'copy':
            navigator.clipboard.writeText(message).then(() => {
                showToast('Link copiato!', 'success');
            });
            break;
    }
}

// ==================== HISTORICAL REPORTS ====================
function loadReportsPreview() {
    // Mood preview - use lt_moods
    const moodData = JSON.parse(localStorage.getItem('lt_moods') || '[]');
    if (moodData.length > 0) {
        const avgMood = moodData.reduce((sum, m) => sum + m.value, 0) / moodData.length;
        const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];
        document.getElementById('moodReportPreview').textContent = `Media: ${moodEmojis[Math.round(avgMood) - 1] || '😊'}`;
    }
    
    // Sleep preview
    const sleepData = JSON.parse(localStorage.getItem('lt_sleep_history') || '[]');
    if (sleepData.length > 0) {
        const avgSleep = sleepData.reduce((sum, s) => sum + s.hours, 0) / sleepData.length;
        document.getElementById('sleepReportPreview').textContent = `Media: ${avgSleep.toFixed(1)}h`;
    }
    
    // Water preview - use lt_water
    const waterData = JSON.parse(localStorage.getItem('lt_water') || '[]');
    if (waterData.length > 0) {
        const avgWater = waterData.reduce((sum, w) => sum + w.glasses, 0) / waterData.length;
        document.getElementById('waterReportPreview').textContent = `Media: ${avgWater.toFixed(1)} bicchieri`;
    }
    
    // Workout preview - count total sessions
    const runs = data.runs || [];
    const exerciseSessions = (data.workoutExercises || []).reduce((sum, ex) => sum + (ex.history?.length || 0), 0);
    const workoutPreview = document.getElementById('workoutReportPreview');
    if (workoutPreview) {
        workoutPreview.textContent = `${runs.length + exerciseSessions} sessioni totali`;
    }
}

function renderMoodReport() {
    const moodData = JSON.parse(localStorage.getItem('lt_moods') || '[]');
    const last14 = moodData.slice(-14);
    
    // Calculate stats
    if (moodData.length > 0) {
        const avgMood = moodData.reduce((sum, m) => sum + m.value, 0) / moodData.length;
        const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];
        document.getElementById('moodAvg').textContent = moodEmojis[Math.round(avgMood) - 1] || '😊';
        
        const bestDay = moodData.reduce((best, m) => m.value > best.value ? m : best, moodData[0]);
        const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
        document.getElementById('moodBest').textContent = days[new Date(bestDay.date).getDay()];
        
        // Calculate positive streak
        let streak = 0;
        for (let i = moodData.length - 1; i >= 0; i--) {
            if (moodData[i].value >= 4) streak++;
            else break;
        }
        document.getElementById('moodStreak').textContent = streak;
    }
    
    // Render chart
    const chartEl = document.getElementById('moodChart');
    chartEl.innerHTML = last14.map((m, i) => {
        const height = (m.value / 5) * 100;
        const day = new Date(m.date).toLocaleDateString('it', { weekday: 'short' }).slice(0, 2);
        return `<div class="bar-item">
            <div class="bar-fill mood" style="height: ${height}%"></div>
            <span class="bar-label">${day}</span>
        </div>`;
    }).join('');
    
    // Render history
    const historyEl = document.getElementById('moodHistoryList');
    const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];
    historyEl.innerHTML = moodData.slice(-10).reverse().map(m => {
        const date = new Date(m.date).toLocaleDateString('it', { day: 'numeric', month: 'short' });
        const valueClass = m.value >= 4 ? 'good' : m.value >= 3 ? 'medium' : 'bad';
        return `<div class="history-item">
            <span class="history-date">${date}</span>
            <span class="history-value ${valueClass}">${moodEmojis[m.value - 1]}</span>
        </div>`;
    }).join('');
}

function renderSleepReport() {
    const sleepData = JSON.parse(localStorage.getItem('lt_sleep_history') || '[]');
    const last14 = sleepData.slice(-14);
    
    if (sleepData.length > 0) {
        const avgHours = sleepData.reduce((sum, s) => sum + s.hours, 0) / sleepData.length;
        document.getElementById('sleepAvgHours').textContent = avgHours.toFixed(1) + 'h';
        
        const avgQuality = sleepData.reduce((sum, s) => sum + (s.quality || 3), 0) / sleepData.length;
        const qualityLabels = ['', 'Scarsa', 'Sufficiente', 'Buona', 'Ottima', 'Perfetta'];
        document.getElementById('sleepAvgQuality').textContent = qualityLabels[Math.round(avgQuality)] || 'Buona';
        
        const bestNight = sleepData.reduce((best, s) => s.hours > best.hours ? s : best, sleepData[0]);
        document.getElementById('sleepBestNight').textContent = bestNight.hours + 'h';
    }
    
    // Render chart
    const chartEl = document.getElementById('sleepChart');
    chartEl.innerHTML = last14.map((s, i) => {
        const height = Math.min((s.hours / 10) * 100, 100);
        const day = new Date(s.date).toLocaleDateString('it', { weekday: 'short' }).slice(0, 2);
        return `<div class="bar-item">
            <div class="bar-fill sleep" style="height: ${height}%"></div>
            <span class="bar-label">${day}</span>
        </div>`;
    }).join('');
    
    // Render history
    const historyEl = document.getElementById('sleepHistoryList');
    historyEl.innerHTML = sleepData.slice(-10).reverse().map(s => {
        const date = new Date(s.date).toLocaleDateString('it', { day: 'numeric', month: 'short' });
        const valueClass = s.hours >= 7 ? 'good' : s.hours >= 5 ? 'medium' : 'bad';
        return `<div class="history-item">
            <span class="history-date">${date}</span>
            <span class="history-value ${valueClass}">${s.hours}h</span>
        </div>`;
    }).join('');
}

function renderWaterReport() {
    const waterData = JSON.parse(localStorage.getItem('lt_water') || '[]');
    const last14 = waterData.slice(-14);
    
    if (waterData.length > 0) {
        const avgGlasses = waterData.reduce((sum, w) => sum + w.glasses, 0) / waterData.length;
        document.getElementById('waterAvg').textContent = avgGlasses.toFixed(1);
        
        const totalLiters = waterData.reduce((sum, w) => sum + w.glasses, 0) * 0.25;
        document.getElementById('waterTotal').textContent = totalLiters.toFixed(1) + 'L';
        
        const goalDays = waterData.filter(w => w.glasses >= 8).length;
        document.getElementById('waterGoalDays').textContent = goalDays;
    }
    
    // Render chart
    const chartEl = document.getElementById('waterChart');
    chartEl.innerHTML = last14.map((w, i) => {
        const height = Math.min((w.glasses / 10) * 100, 100);
        const day = new Date(w.date).toLocaleDateString('it', { weekday: 'short' }).slice(0, 2);
        return `<div class="bar-item">
            <div class="bar-fill water" style="height: ${height}%"></div>
            <span class="bar-label">${day}</span>
        </div>`;
    }).join('');
    
    // Render history
    const historyEl = document.getElementById('waterHistoryList');
    historyEl.innerHTML = waterData.slice(-10).reverse().map(w => {
        const date = new Date(w.date).toLocaleDateString('it', { day: 'numeric', month: 'short' });
        const valueClass = w.glasses >= 8 ? 'good' : w.glasses >= 5 ? 'medium' : 'bad';
        return `<div class="history-item">
            <span class="history-date">${date}</span>
            <span class="history-value ${valueClass}">${w.glasses} 💧</span>
        </div>`;
    }).join('');
}

function renderWorkoutReport() {
    // Combine workout sessions and runs
    const sessions = data.workoutSessions || [];
    const runs = data.runs || [];
    
    // Total workouts
    const totalWorkouts = sessions.length + runs.length;
    const totalEl = document.getElementById('workoutTotal');
    if (totalEl) totalEl.textContent = totalWorkouts;
    
    // Total hours
    const sessionMinutes = sessions.reduce((sum, s) => sum + Math.round((s.duration || 0) / 60), 0);
    const runMinutes = runs.reduce((sum, r) => sum + (r.time || 0), 0);
    const totalMinutes = sessionMinutes + runMinutes;
    const hoursEl = document.getElementById('workoutHours');
    if (hoursEl) hoursEl.textContent = Math.floor(totalMinutes / 60) + 'h ' + (totalMinutes % 60) + 'min';
    
    // Total km
    const totalKm = runs.reduce((sum, r) => sum + (r.distance || 0), 0);
    const kmEl = document.getElementById('workoutKm');
    if (kmEl) kmEl.textContent = totalKm.toFixed(1) + ' km';
    
    // Calculate workout streak
    const allWorkoutDates = [
        ...sessions.map(s => new Date(s.date).toDateString()),
        ...runs.map(r => new Date(r.date).toDateString())
    ];
    const uniqueDates = [...new Set(allWorkoutDates)].sort((a, b) => new Date(a) - new Date(b));
    
    let bestStreak = 0, currentStreak = 0, lastDate = null;
    for (const dateStr of uniqueDates) {
        const date = new Date(dateStr);
        if (lastDate) {
            const diff = (date - lastDate) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                currentStreak++;
            } else {
                currentStreak = 1;
            }
        } else {
            currentStreak = 1;
        }
        bestStreak = Math.max(bestStreak, currentStreak);
        lastDate = date;
    }
    const streakEl = document.getElementById('workoutStreak');
    if (streakEl) streakEl.textContent = bestStreak;
    
    // Render chart (workouts per week - last 8 weeks)
    const chartEl = document.getElementById('workoutChart');
    if (chartEl) {
        const weeks = [];
        for (let i = 7; i >= 0; i--) {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay() - (i * 7));
            weekStart.setHours(0, 0, 0, 0);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            const sessionCount = sessions.filter(s => {
                const sDate = new Date(s.date);
                return sDate >= weekStart && sDate <= weekEnd;
            }).length;
            
            const runCount = runs.filter(r => {
                const rDate = new Date(r.date);
                return rDate >= weekStart && rDate <= weekEnd;
            }).length;
            
            weeks.push({ count: sessionCount + runCount, label: `S${8 - i}` });
        }
        
        const maxCount = Math.max(...weeks.map(w => w.count), 1);
        chartEl.innerHTML = weeks.map(w => {
            const height = (w.count / maxCount) * 100;
            return `<div class="bar-item">
                <div class="bar-fill workout" style="height: ${height}%"></div>
                <span class="bar-value">${w.count}</span>
                <span class="bar-label">${w.label}</span>
            </div>`;
        }).join('');
    }
    
    // Render history (combine sessions and runs, sort by date)
    const historyEl = document.getElementById('workoutHistoryList');
    if (historyEl) {
        const allWorkouts = [
            ...sessions.map(s => ({
                date: s.date,
                type: 'Pesi',
                duration: Math.round((s.duration || 0) / 60),
                exercises: s.exercises?.length || 0
            })),
            ...runs.map(r => ({
                date: r.date,
                type: 'Corsa',
                duration: r.time || 0,
                distance: r.distance || 0
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
        
        if (allWorkouts.length === 0) {
            historyEl.innerHTML = '<p style="color:var(--gray-500);text-align:center;">Nessun allenamento registrato</p>';
        } else {
            historyEl.innerHTML = allWorkouts.map(w => {
                const date = new Date(w.date).toLocaleDateString('it', { day: 'numeric', month: 'short' });
                const detail = w.type === 'Corsa' 
                    ? `${w.distance} km - ${w.duration} min`
                    : `${w.exercises} esercizi - ${w.duration} min`;
                return `<div class="history-item">
                    <span class="history-date">${date}</span>
                    <span class="history-value good">${w.type}: ${detail}</span>
                </div>`;
            }).join('');
        }
    }
}

function renderFullReport() {
    const moodData = JSON.parse(localStorage.getItem('lt_moods') || '[]');
    const sleepData = JSON.parse(localStorage.getItem('lt_sleep') || '[]');
    const waterData = JSON.parse(localStorage.getItem('lt_water') || '[]');
    const runs = data.runs || [];
    const exerciseSessions = (data.workoutExercises || []).reduce((sum, ex) => sum + (ex.history?.length || 0), 0);
    
    // Calculate trends (last 7 days vs previous 7 days)
    function getTrend(data, key = 'value') {
        if (data.length < 7) return { trend: 'neutral', change: 0 };
        const last7 = data.slice(-7);
        const prev7 = data.slice(-14, -7);
        if (prev7.length === 0) return { trend: 'neutral', change: 0 };
        
        const lastAvg = last7.reduce((sum, d) => sum + d[key], 0) / last7.length;
        const prevAvg = prev7.reduce((sum, d) => sum + d[key], 0) / prev7.length;
        const change = ((lastAvg - prevAvg) / prevAvg * 100).toFixed(0);
        
        return {
            trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
            change: Math.abs(change)
        };
    }
    
    const moodTrend = getTrend(moodData, 'value');
    const sleepTrend = getTrend(sleepData, 'hours');
    const waterTrend = getTrend(waterData, 'glasses');
    
    const gridEl = document.getElementById('fullReportGrid');
    gridEl.innerHTML = `
        <div class="full-report-card">
            <h4><i class="fas fa-face-smile"></i> Umore</h4>
            <div class="full-report-value">${moodData.length > 0 ? (moodData.reduce((s, m) => s + m.value, 0) / moodData.length).toFixed(1) : '-'}/5</div>
            <div class="full-report-trend ${moodTrend.trend}">
                <i class="fas fa-arrow-${moodTrend.trend === 'up' ? 'up' : moodTrend.trend === 'down' ? 'down' : 'right'}"></i>
                ${moodTrend.change}% vs sett. scorsa
            </div>
        </div>
        <div class="full-report-card">
            <h4><i class="fas fa-bed"></i> Sonno</h4>
            <div class="full-report-value">${sleepData.length > 0 ? (sleepData.reduce((s, m) => s + m.hours, 0) / sleepData.length).toFixed(1) : '-'}h</div>
            <div class="full-report-trend ${sleepTrend.trend}">
                <i class="fas fa-arrow-${sleepTrend.trend === 'up' ? 'up' : sleepTrend.trend === 'down' ? 'down' : 'right'}"></i>
                ${sleepTrend.change}% vs sett. scorsa
            </div>
        </div>
        <div class="full-report-card">
            <h4><i class="fas fa-droplet"></i> Acqua</h4>
            <div class="full-report-value">${waterData.length > 0 ? (waterData.reduce((s, m) => s + m.glasses, 0) / waterData.length).toFixed(1) : '-'}</div>
            <div class="full-report-trend ${waterTrend.trend}">
                <i class="fas fa-arrow-${waterTrend.trend === 'up' ? 'up' : waterTrend.trend === 'down' ? 'down' : 'right'}"></i>
                ${waterTrend.change}% vs sett. scorsa
            </div>
        </div>
        <div class="full-report-card">
            <h4><i class="fas fa-dumbbell"></i> Workout</h4>
            <div class="full-report-value">${workoutData.length}</div>
            <div class="full-report-trend neutral">
                <i class="fas fa-trophy"></i>
                Sessioni totali
            </div>
        </div>
        <div class="full-report-card">
            <h4><i class="fas fa-fire"></i> Streak</h4>
            <div class="full-report-value">${calculateOverallStreak()}</div>
            <div class="full-report-trend neutral">
                <i class="fas fa-calendar-check"></i>
                Giorni consecutivi
            </div>
        </div>
        <div class="full-report-card">
            <h4><i class="fas fa-star"></i> Disciplina</h4>
            <div class="full-report-value">${calculateDisciplineScore()}%</div>
            <div class="full-report-trend neutral">
                <i class="fas fa-chart-line"></i>
                Punteggio totale
            </div>
        </div>
    `;
}

// ==================== DAILY QUOTE (100 QUOTES) ====================
const MOTIVATIONAL_QUOTES = [
    "La disciplina è il ponte tra obiettivi e risultati.",
    "Non contare i giorni, fai che i giorni contino.",
    "Il successo è la somma di piccoli sforzi ripetuti ogni giorno.",
    "Inizia dove sei. Usa quello che hai. Fai quello che puoi.",
    "La costanza batte il talento quando il talento non è costante.",
    "Ogni maestro è stato un disastro all'inizio.",
    "Il momento migliore per iniziare era ieri. Il secondo migliore è ora.",
    "I campioni continuano a giocare finché non la fanno giusta.",
    "Non aspettare l'ispirazione, diventa l'ispirazione.",
    "La forza non viene dalla capacità fisica, ma da una volontà indomita.",
    "Sii più forte delle tue scuse.",
    "Fai oggi quello che gli altri non fanno, per avere domani quello che gli altri non hanno.",
    "Il dolore è temporaneo, mollare è per sempre.",
    "Trasforma i tuoi ostacoli in opportunità.",
    "Credi in te stesso e tutto diventa possibile.",
    "Il successo è andare di fallimento in fallimento senza perdere entusiasmo.",
    "Non pregare per una vita facile, prega per la forza di affrontare una difficile.",
    "La differenza tra chi vince e chi perde è non arrendersi.",
    "Ogni giorno è una nuova opportunità per cambiare la tua vita.",
    "Sii il cambiamento che vuoi vedere nel mondo.",
    "La vera forza è rialzarsi ogni volta che cadi.",
    "Non si tratta di quanto forte colpisci, ma di quanto forte puoi essere colpito.",
    "Il limite è solo nella tua mente.",
    "Chi vuole fare qualcosa trova un modo, chi non vuole trova una scusa.",
    "La paura è temporanea, il rimpianto è eterno.",
    "Fallire è un'opzione. Se non fallisci, non stai innovando abbastanza.",
    "La disciplina è ricordare quello che vuoi veramente.",
    "Ogni progresso conta, non importa quanto piccolo.",
    "La motivazione ti fa iniziare, l'abitudine ti fa continuare.",
    "Sii paziente con te stesso. Il cambiamento richiede tempo.",
    "Non confrontarti con gli altri, confrontati con chi eri ieri.",
    "Il corpo raggiunge ciò che la mente crede.",
    "Sudore oggi, successo domani.",
    "Più dura la battaglia, più dolce la vittoria.",
    "Non fermarti quando sei stanco, fermati quando hai finito.",
    "La coerenza è la chiave. Piccoli passi ogni giorno.",
    "Allenati come se avessi già firmato il contratto.",
    "Il riposo è parte dell'allenamento.",
    "Nessuno può farlo per te. Devi volerlo tu.",
    "Ogni rep conta. Ogni set conta. Ogni giorno conta.",
    "La qualità del tuo allenamento dipende dalla qualità del tuo impegno.",
    "Non esiste il momento perfetto. Inizia ora.",
    "I tuoi limiti esistono solo nella tua mente.",
    "Il successo è un viaggio, non una destinazione.",
    "Sii grato per quello che hai mentre lavori per quello che vuoi.",
    "La grandezza non è mai stata comoda.",
    "Sfida te stesso. È l'unico modo per crescere.",
    "Oggi è un buon giorno per essere fantastico.",
    "Non aspettare il permesso di nessuno per eccellere.",
    "Il tuo unico limite sei tu.",
    "La vittoria appartiene a chi ci crede di più.",
    "Trasforma la pressione in potenza.",
    "Non cercare scorciatoie. Il percorso è la ricompensa.",
    "Sii così bravo che non possono ignorarti.",
    "La mentalità è tutto. Allenala prima del corpo.",
    "Ogni mattina hai due scelte: continuare a dormire o svegliarti e inseguire i sogni.",
    "Il progresso, non la perfezione.",
    "Chi si allena oggi sarà il campione di domani.",
    "Non rimandare a domani ciò che puoi conquistare oggi.",
    "La dedizione di oggi è il successo di domani.",
    "Fai il lavoro che nessuno vede per avere i risultati che tutti vedono.",
    "La mentalità del vincitore: niente scuse, solo risultati.",
    "Più sei disciplinato, più sei libero.",
    "Non arrenderti mai. Oggi è dura, domani sarà peggio, dopodomani splenderà il sole.",
    "Il tuo futuro è creato da ciò che fai oggi.",
    "Lavora in silenzio, lascia che il successo faccia rumore.",
    "Essere forti non significa non sentire dolore, ma andare avanti nonostante il dolore.",
    "La resilienza si costruisce attraverso le avversità.",
    "Niente di ciò che vale la pena viene facile.",
    "Oggi soffri, domani brilli.",
    "Non esiste un ascensore per il successo. Devi prendere le scale.",
    "Ogni esperto è stato prima un principiante.",
    "La disciplina è fare ciò che devi fare quando non hai voglia di farlo.",
    "Il cambiamento inizia fuori dalla zona di comfort.",
    "Sii ossessionato dal diventare la migliore versione di te stesso.",
    "La perseveranza è la madre del successo.",
    "Un passo alla volta, ma non fermarti mai.",
    "Il successo non è finale, il fallimento non è fatale: è il coraggio di continuare che conta.",
    "Costruisci abitudini che costruiscono il tuo futuro.",
    "La forza di volontà è come un muscolo: più la usi, più diventa forte.",
    "Non esistono giorni liberi sulla strada per l'eccellenza.",
    "Chi ha fame non si ferma finché non è sazio.",
    "La differenza tra ordinario e straordinario è quel piccolo extra.",
    "Investi in te stesso. È il miglior investimento che puoi fare.",
    "Il tuo atteggiamento determina la tua direzione.",
    "Non aspettare che le cose cambino. Cambia le cose.",
    "Ogni goccia di sudore è un passo verso il tuo obiettivo.",
    "La motivazione è ciò che ti fa iniziare, la disciplina è ciò che ti fa andare avanti.",
    "Respira, credi, combatti.",
    "Non sei nato per essere mediocre.",
    "La costanza trasforma l'impossibile in inevitabile.",
    "Vinci prima nella mente, poi nel mondo.",
    "Non smettere mai di migliorare.",
    "Il tuo corpo può resistere quasi a tutto. È la mente che devi convincere.",
    "Oggi fai ciò che gli altri non faranno, domani realizzerai ciò che gli altri non possono.",
    "Sogna in grande, lavora duro, rimani concentrato.",
    "La forza viene dalla lotta. Quando impari a gestire le difficoltà, sviluppi forza.",
    "Abbraccia il disagio. È dove avviene la crescita.",
    "Il dolore che senti oggi sarà la forza che sentirai domani.",
    "Non importa quanto lentamente vai, l'importante è non fermarsi."
];

function getDailyQuote() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const quoteIndex = dayOfYear % MOTIVATIONAL_QUOTES.length;
    return MOTIVATIONAL_QUOTES[quoteIndex];
}

function updateHeroQuote() {
    const quoteEl = document.getElementById('heroQuote');
    if (quoteEl) {
        quoteEl.textContent = `"${getDailyQuote()}"`;
    }
}

function updateHeroLevel() {
    const levelEl = document.getElementById('heroLevel');
    if (levelEl) {
        const userData = JSON.parse(localStorage.getItem('lt_user') || '{}');
        levelEl.textContent = userData.level || 1;
    }
}

// ==================== WATER TRACKER (250ml per glass) ====================
function updateWaterDisplay() {
    const waterData = JSON.parse(localStorage.getItem('lt_water_today') || '{"glasses": 0, "date": "", "maxReached": 0}');
    const today = getDateString(new Date());
    
    if (waterData.date !== today) {
        // New day - reset water counter AND maxReached (so XP can be earned again)
        waterData.glasses = 0;
        waterData.date = today;
        waterData.maxReached = 0;
        localStorage.setItem('lt_water_today', JSON.stringify(waterData));
    }
    
    const glasses = waterData.glasses;
    const ml = glasses * 250;
    const progress = Math.min((glasses / 8) * 100, 100);
    
    const amountEl = document.getElementById('waterAmount');
    const progressEl = document.getElementById('waterProgressFill');
    const countEl = document.getElementById('waterGlassesCount');
    
    if (amountEl) amountEl.textContent = ml;
    if (progressEl) progressEl.style.width = `${progress}%`;
    if (countEl) countEl.textContent = glasses;
}

// ==================== PRIORITY SYSTEM ====================
function loadPriorities() {
    const priorities = JSON.parse(localStorage.getItem('lt_priorities') || '[]');
    const container = document.getElementById('priorityList');
    if (!container) return;
    
    if (priorities.length === 0) {
        container.innerHTML = `<div class="empty-state" style="padding:var(--space-md);">
            <p style="color:var(--gray-500);font-size:var(--text-sm);">Nessuna priorità impostata</p>
            <button class="btn btn-secondary" onclick="openModal('priorityModal')">Imposta Priorità</button>
        </div>`;
        return;
    }
    
    container.innerHTML = priorities.slice(0, 5).map((goalId, i) => {
        const goal = data.goals.find(g => g.id === goalId);
        if (!goal) return '';
        return `<div class="priority-item" draggable="true" data-id="${goal.id}">
            <div class="priority-number">${i + 1}</div>
            <div class="priority-content">
                <div class="priority-name">${goal.name}</div>
                <div class="priority-category">${goal.category}</div>
            </div>
            <i class="fas fa-grip-vertical priority-drag"></i>
        </div>`;
    }).join('');
    
    // Add drag and drop
    initPriorityDrag();
}

function initPriorityDrag() {
    const items = document.querySelectorAll('.priority-item');
    items.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            item.classList.add('dragging');
            e.dataTransfer.setData('text/plain', item.dataset.id);
        });
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('text/plain');
            const targetId = item.dataset.id;
            reorderPriorities(draggedId, targetId);
        });
    });
}

function reorderPriorities(fromId, toId) {
    let priorities = JSON.parse(localStorage.getItem('lt_priorities') || '[]');
    const fromIndex = priorities.indexOf(fromId);
    const toIndex = priorities.indexOf(toId);
    
    if (fromIndex > -1 && toIndex > -1) {
        priorities.splice(fromIndex, 1);
        priorities.splice(toIndex, 0, fromId);
        localStorage.setItem('lt_priorities', JSON.stringify(priorities));
        loadPriorities();
    }
}

function renderPriorityModal() {
    const container = document.getElementById('priorityGoalsList');
    if (!container) return;
    
    const priorities = JSON.parse(localStorage.getItem('lt_priorities') || '[]');
    
    container.innerHTML = data.goals.map(goal => {
        const isSelected = priorities.includes(goal.id);
        return `<div class="priority-goal-item" data-id="${goal.id}">
            <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="togglePriority('${goal.id}')">
            <i class="fas ${goal.icon || 'fa-bullseye'}" style="color:${goal.color || 'var(--nike-orange)'}"></i>
            <span style="flex:1;color:var(--white)">${goal.name}</span>
            <i class="fas fa-grip-vertical" style="color:var(--gray-600)"></i>
        </div>`;
    }).join('');
}

function togglePriority(goalId) {
    let priorities = JSON.parse(localStorage.getItem('lt_priorities') || '[]');
    const index = priorities.indexOf(goalId);
    
    if (index > -1) {
        priorities.splice(index, 1);
    } else {
        priorities.push(goalId);
    }
    
    localStorage.setItem('lt_priorities', JSON.stringify(priorities));
}

function savePriorities() {
    loadPriorities();
    showToast('Priorità salvate!', 'success');
}

// ==================== POMODORO CUSTOM TIMER ====================
let pomodoroSettings = JSON.parse(localStorage.getItem('lt_pomodoro_settings') || '{"focus": 25, "break": 5}');

function adjustPomodoroTime(type, delta) {
    if (type === 'focus') {
        pomodoroSettings.focus = Math.max(5, Math.min(60, pomodoroSettings.focus + delta));
        document.getElementById('pomodoroFocusTime').textContent = pomodoroSettings.focus;
    } else {
        pomodoroSettings.break = Math.max(1, Math.min(30, pomodoroSettings.break + delta));
        document.getElementById('pomodoroBreakTime').textContent = pomodoroSettings.break;
    }
    localStorage.setItem('lt_pomodoro_settings', JSON.stringify(pomodoroSettings));
    
    // Update display if not running
    if (typeof EliteFeatures !== 'undefined' && !EliteFeatures.pomodoroInterval) {
        document.getElementById('pomodoroTime').textContent = `${pomodoroSettings.focus}:00`;
    }
}

function initPomodoroSettings() {
    const focusEl = document.getElementById('pomodoroFocusTime');
    const breakEl = document.getElementById('pomodoroBreakTime');
    if (focusEl) focusEl.textContent = pomodoroSettings.focus;
    if (breakEl) breakEl.textContent = pomodoroSettings.break;
}

// ==================== DIARY SYSTEM ====================
function initDiary() {
    const now = new Date();
    const dateInput = document.getElementById('diaryDate');
    const timeInput = document.getElementById('diaryTime');
    
    if (dateInput) dateInput.value = getDateString(now);
    if (timeInput) timeInput.value = now.toTimeString().slice(0, 5);
}

function saveDiaryEntry(e) {
    e.preventDefault();
    
    const entry = {
        id: Date.now().toString(),
        date: document.getElementById('diaryDate').value,
        time: document.getElementById('diaryTime').value,
        title: document.getElementById('diaryTitle').value || 'Senza titolo',
        content: document.getElementById('diaryContent').value,
        images: diaryTempImages || [],
        createdAt: new Date().toISOString()
    };
    
    let diary = JSON.parse(localStorage.getItem('lt_diary') || '[]');
    diary.unshift(entry);
    localStorage.setItem('lt_diary', JSON.stringify(diary));
    
    diaryTempImages = [];
    closeModal('newDiaryEntryModal');
    renderDiaryEntries();
    showToast('Pagina salvata!', 'success');
    
    // Reset form
    document.getElementById('diaryTitle').value = '';
    document.getElementById('diaryContent').value = '';
    document.getElementById('diaryImagesPreview').innerHTML = '';
    initDiary();
}

let diaryTempImages = [];

function previewDiaryImages(e) {
    const files = e.target.files;
    const preview = document.getElementById('diaryImagesPreview');
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            diaryTempImages.push(event.target.result);
            const img = document.createElement('img');
            img.src = event.target.result;
            img.className = 'diary-image-thumb';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

function renderDiaryEntries() {
    const container = document.getElementById('diaryEntries');
    if (!container) return;
    
    const diary = JSON.parse(localStorage.getItem('lt_diary') || '[]');
    
    if (diary.length === 0) {
        container.innerHTML = `<div class="empty-state">
            <i class="fas fa-book-open"></i>
            <p>Nessuna pagina ancora</p>
            <button class="btn btn-primary" onclick="openModal('newDiaryEntryModal')">Scrivi la prima pagina</button>
        </div>`;
        return;
    }
    
    container.innerHTML = diary.map(entry => {
        const date = new Date(entry.date + 'T' + entry.time);
        const formattedDate = date.toLocaleDateString('it', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `<div class="diary-entry-card" onclick="viewDiaryEntry('${entry.id}')">
            <div class="diary-entry-header">
                <span class="diary-entry-title">${entry.title}</span>
                <span class="diary-entry-date">${formattedDate}</span>
            </div>
            <p class="diary-entry-preview">${entry.content}</p>
            ${entry.images && entry.images.length > 0 ? `<span class="diary-entry-images-count"><i class="fas fa-image"></i> ${entry.images.length} foto</span>` : ''}
        </div>`;
    }).join('');
}

let currentDiaryEntryId = null;

function viewDiaryEntry(id) {
    const diary = JSON.parse(localStorage.getItem('lt_diary') || '[]');
    const entry = diary.find(e => e.id === id);
    if (!entry) return;
    
    currentDiaryEntryId = id;
    
    document.getElementById('viewDiaryTitle').textContent = entry.title;
    
    const date = new Date(entry.date + 'T' + entry.time);
    document.getElementById('viewDiaryMeta').textContent = date.toLocaleDateString('it', { 
        weekday: 'long',
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('viewDiaryContent').textContent = entry.content;
    
    const imagesContainer = document.getElementById('viewDiaryImages');
    if (entry.images && entry.images.length > 0) {
        imagesContainer.innerHTML = entry.images.map(img => `<img src="${img}" alt="Diary image">`).join('');
    } else {
        imagesContainer.innerHTML = '';
    }
    
    openModal('viewDiaryEntryModal');
}

function deleteDiaryEntry() {
    if (!currentDiaryEntryId) return;
    if (!confirm('Eliminare questa pagina?')) return;
    
    let diary = JSON.parse(localStorage.getItem('lt_diary') || '[]');
    diary = diary.filter(e => e.id !== currentDiaryEntryId);
    localStorage.setItem('lt_diary', JSON.stringify(diary));
    
    closeModal('viewDiaryEntryModal');
    renderDiaryEntries();
    showToast('Pagina eliminata', 'warning');
}

// ==================== BADGES MODAL ====================
function renderBadgesModal() {
    // Read from correct localStorage keys (same as elite-features.js)
    const userData = JSON.parse(localStorage.getItem('lt_user') || '{}');
    const badgesData = JSON.parse(localStorage.getItem('lt_badges') || '[]');
    
    const level = userData.level || 1;
    const totalXP = userData.totalXp || 0;
    
    // Calculate XP progress for current level (same logic as elite-features.js)
    const LEVELS = [
        { level: 1, xp: 0, title: 'Principiante' },
        { level: 2, xp: 100, title: 'Apprendista' },
        { level: 3, xp: 300, title: 'Praticante' },
        { level: 4, xp: 600, title: 'Esperto' },
        { level: 5, xp: 1000, title: 'Veterano' },
        { level: 6, xp: 1500, title: 'Maestro' },
        { level: 7, xp: 2500, title: 'Campione' },
        { level: 8, xp: 4000, title: 'Leggenda' },
        { level: 9, xp: 6000, title: 'Mito' },
        { level: 10, xp: 10000, title: 'Divinità' }
    ];
    
    const currentLevelData = LEVELS.find(l => l.level === level) || LEVELS[0];
    const nextLevelData = LEVELS.find(l => l.level === level + 1);
    
    let xpInCurrentLevel, xpNeeded, percent;
    if (!nextLevelData) {
        xpInCurrentLevel = totalXP - currentLevelData.xp;
        xpNeeded = 1000;
        percent = 100;
    } else {
        xpInCurrentLevel = totalXP - currentLevelData.xp;
        xpNeeded = nextLevelData.xp - currentLevelData.xp;
        percent = Math.min(100, (xpInCurrentLevel / xpNeeded) * 100);
    }
    
    document.getElementById('badgesModalLevel').textContent = level;
    document.getElementById('badgesModalTitle').textContent = currentLevelData.title;
    document.getElementById('badgesModalXp').textContent = xpInCurrentLevel;
    document.getElementById('badgesModalNextXp').textContent = xpNeeded;
    document.getElementById('badgesModalXpFill').style.width = `${percent}%`;
    
    // Render all badges
    const allBadges = [
        { id: 'first_goal', name: 'Primo Obiettivo', icon: 'fa-bullseye', desc: 'Completa il primo obiettivo' },
        { id: 'streak_3', name: 'Streak 3', icon: 'fa-fire', desc: '3 giorni consecutivi' },
        { id: 'streak_7', name: 'Settimana Perfetta', icon: 'fa-calendar-week', desc: '7 giorni consecutivi' },
        { id: 'streak_30', name: 'Mese Perfetto', icon: 'fa-calendar', desc: '30 giorni consecutivi' },
        { id: 'water_master', name: 'Idratato', icon: 'fa-droplet', desc: '7 giorni al 100% acqua' },
        { id: 'early_bird', name: 'Mattiniero', icon: 'fa-sun', desc: 'Completa un obiettivo prima delle 8' },
        { id: 'night_owl', name: 'Nottambulo', icon: 'fa-moon', desc: 'Registra dopo mezzanotte' },
        { id: 'workout_10', name: '10 Workout', icon: 'fa-dumbbell', desc: '10 allenamenti completati' },
        { id: 'journal_writer', name: 'Scrittore', icon: 'fa-pen', desc: '5 pagine di diario' },
        { id: 'level_5', name: 'Livello 5', icon: 'fa-star', desc: 'Raggiungi livello 5' },
        { id: 'level_10', name: 'Livello 10', icon: 'fa-crown', desc: 'Raggiungi livello 10' },
        { id: 'disciplined', name: 'Disciplinato', icon: 'fa-medal', desc: '90% disciplina per una settimana' }
    ];
    
    const container = document.getElementById('badgesGridFull');
    container.innerHTML = allBadges.map(badge => {
        const isUnlocked = badgesData.includes(badge.id);
        return `<div class="badge-card-full ${isUnlocked ? '' : 'locked'}">
            <div class="badge-icon"><i class="fas ${badge.icon}"></i></div>
            <div class="badge-name">${badge.name}</div>
            <div class="badge-desc">${badge.desc}</div>
        </div>`;
    }).join('');
}

function getLevelTitle(level) {
    const titles = ['PRINCIPIANTE', 'INIZIATO', 'APPRENDISTA', 'PRATICANTE', 'ESPERTO', 
                   'VETERANO', 'MAESTRO', 'CAMPIONE', 'LEGGENDA', 'IMMORTALE'];
    return titles[Math.min(level - 1, titles.length - 1)];
}

// ==================== PROFILE BACKGROUND ====================
function saveProfileBg(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Compress image before saving (reduce to 800px for mobile)
    compressImage(file, 800, 0.5, (compressedData) => {
        try {
            localStorage.setItem('lt_profile_bg', compressedData);
            try { localStorage.setItem('lt_last_local_change_ms', String(Date.now())); } catch (_) {}
            
            // Verify save worked
            const saved = localStorage.getItem('lt_profile_bg');
            if (saved && saved.length > 100) {
                loadProfileBg();
                showToast('Sfondo aggiornato!', 'success');

                if (typeof flushCloudSave === 'function') {
                    flushCloudSave('profile-bg');
                } else if (typeof saveToCloud === 'function') {
                    saveToCloud();
                }
            } else {
                showToast('Errore nel salvataggio', 'error');
            }
        } catch (e) {
            console.error('Error saving profile bg:', e);
            showToast('Immagine troppo grande', 'error');
        }
    });
    
    // Clear input
    event.target.value = '';
}

// Helper function to compress images
function compressImage(file, maxWidth, quality, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Scale down if too large
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            callback(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function loadProfileBg() {
    try {
        const bg = localStorage.getItem('lt_profile_bg');
        const bgEl = document.getElementById('profileBg');
        if (bgEl) {
            if (bg && bg.startsWith('data:')) {
                bgEl.style.backgroundImage = `url(${bg})`;
                bgEl.style.backgroundSize = 'cover';
                bgEl.style.backgroundPosition = 'center';
            } else {
                // Default gradient background
                bgEl.style.backgroundImage = 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)';
            }
        }
    } catch (e) {
        console.error('Error loading profile bg:', e);
    }
}

// ==================== PHOTO GALLERY (Multiple Photos) ====================
function saveProgressPhotos(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    let savedCount = 0;
    const totalFiles = files.length;
    
    Array.from(files).forEach(file => {
        // Compress each image (smaller for gallery)
        compressImage(file, 600, 0.5, (compressedData) => {
            try {
                // Re-read photos each time to avoid race condition
                let photos = JSON.parse(localStorage.getItem('lt_progress_photos') || '[]');
                
                // Limit to max 20 photos to avoid localStorage quota
                if (photos.length >= 20) {
                    photos = photos.slice(0, 19);
                }
                
                photos.unshift({
                    id: Date.now().toString() + Math.random(),
                    src: compressedData,
                    date: new Date().toISOString()
                });
                localStorage.setItem('lt_progress_photos', JSON.stringify(photos));
                try { localStorage.setItem('lt_last_local_change_ms', String(Date.now())); } catch (_) {}
                
                savedCount++;
                if (savedCount === totalFiles) {
                    renderPhotosPreview();
                    showToast('Foto salvate!', 'success');

                    if (typeof flushCloudSave === 'function') {
                        flushCloudSave('progress-photos');
                    } else if (typeof saveToCloud === 'function') {
                        saveToCloud();
                    }
                }
            } catch (e) {
                console.error('Error saving progress photo:', e);
                showToast('Errore: spazio insufficiente', 'error');
            }
        });
    });
    
    // Clear input
    event.target.value = '';
}

function renderPhotosPreview() {
    try {
        const photos = JSON.parse(localStorage.getItem('lt_progress_photos') || '[]');
        const previewGrid = document.getElementById('photosPreviewGrid');
        const galleryBtn = document.getElementById('photosGalleryBtn');
        const countEl = document.getElementById('photosCount');
        
        if (!previewGrid) return;
        
        // Show first 4 photos
        const validPhotos = photos.filter(p => p.src && p.src.startsWith('data:'));
        previewGrid.innerHTML = validPhotos.slice(0, 4).map(photo => 
            `<img src="${photo.src}" alt="Progress photo" style="width:80px;height:80px;object-fit:cover;border-radius:12px;">`
        ).join('');
        
        // Show gallery button if there are photos
        if (validPhotos.length > 0 && galleryBtn) {
            galleryBtn.style.display = 'flex';
            if (countEl) countEl.textContent = validPhotos.length;
        } else if (galleryBtn) {
            galleryBtn.style.display = 'none';
        }
    } catch (e) {
        console.error('Error rendering photos preview:', e);
    }
}

function renderPhotoGallery() {
    const photos = JSON.parse(localStorage.getItem('lt_progress_photos') || '[]');
    const container = document.getElementById('photoGalleryContent');
    
    if (!container) return;
    
    container.innerHTML = photos.map(photo => {
        const date = new Date(photo.date).toLocaleDateString('it', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        return `<div class="gallery-photo">
            <img src="${photo.src}" alt="Progress">
            <div class="gallery-photo-date">${date}</div>
        </div>`;
    }).join('');
}

// ==================== REAL DATA FOR STATS ====================
function updateRealStats() {
    const userData = JSON.parse(localStorage.getItem('lt_user') || '{}');
    const badges = JSON.parse(localStorage.getItem('lt_badges') || '[]');
    const streak = calculateOverallStreak();
    const level = userData.level || 1;
    
    // Update profile stats
    const profileLevel = document.getElementById('profileLevel');
    const profileStreak = document.getElementById('profileStreak');
    const profileBadges = document.getElementById('profileBadges');
    
    if (profileLevel) profileLevel.textContent = level;
    if (profileStreak) profileStreak.textContent = streak;
    if (profileBadges) profileBadges.textContent = badges.length;
    
    // Update hero level
    const heroLevel = document.getElementById('heroLevel');
    if (heroLevel) heroLevel.textContent = level;
}

// ==================== DATA MANAGEMENT ====================
function exportData() {
    const exportObj = {
        version: 1,
        exportDate: new Date().toISOString(),
        data
    };
    
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-tracker-backup-${getDateString(new Date())}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('Dati esportati!', 'success');
}

function importDataPrompt() {
    document.getElementById('importInput').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.data) {
                data = imported.data;
                Object.keys(STORAGE_KEYS).forEach(key => saveData(key));
                renderApp();
                showToast('Dati importati!', 'success');
            }
        } catch (err) {
            showToast('Errore nell\'importazione', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function shareData() {
    const text = `Life Tracker Report
Streak: ${calculateOverallStreak()} giorni
Obiettivi completati: ${data.history.filter(h => h.status === 'done').length}
Disciplina: ${calculateDisciplineScore()}%`;
    
    if (navigator.share) {
        navigator.share({ title: 'Life Tracker', text });
    } else {
        navigator.clipboard.writeText(text);
        showToast('Copiato negli appunti!', 'success');
    }
}

function resetData() {
    if (!confirm('Sei sicuro? Tutti i dati verranno eliminati!')) return;
    if (!confirm('ULTIMA CONFERMA: Eliminare TUTTO?')) return;
    
    Object.keys(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(STORAGE_KEYS[key]);
        data[key] = [];
    });
    
    renderApp();
    showToast('Dati eliminati', 'warning');
}

// ==================== HELPERS ====================
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getDateString(date) {
    return date.toISOString().split('T')[0];
}

function getHistoryEntry(goalId, dateStr) {
    return data.history.find(h => h.goalId === goalId && h.date === dateStr);
}

function isGoalScheduledForDay(goal, dayOfWeek) {
    if (goal.frequency === 'daily') return true;
    if (goal.frequency === 'weekdays') return dayOfWeek >= 1 && dayOfWeek <= 5;
    return goal.days?.includes(dayOfWeek);
}

function getCategoryIcon(category) {
    const icons = {
        health: 'fa-heart-pulse',
        fitness: 'fa-dumbbell',
        nutrition: 'fa-apple-whole',
        mind: 'fa-brain',
        work: 'fa-briefcase',
        learning: 'fa-book',
        finance: 'fa-wallet',
        social: 'fa-users'
    };
    return icons[category] || 'fa-star';
}

function getFrequencyLabel(freq) {
    const labels = {
        daily: 'Ogni giorno',
        weekdays: 'Lun-Ven',
        custom: 'Personalizzato'
    };
    return labels[freq] || freq;
}

function calculateGoalStreak(goalId) {
    let streak = 0;
    const today = new Date();
    const goal = data.goals.find(g => g.id === goalId);
    if (!goal) return 0;
    
    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dStr = getDateString(d);
        const dow = d.getDay();
        
        if (!isGoalScheduledForDay(goal, dow)) continue;
        
        const entry = getHistoryEntry(goalId, dStr);
        if (entry?.status === 'done') {
            streak++;
        } else if (i > 0) {
            break;
        }
    }
    
    return streak;
}

function calculateOverallStreak() {
    if (data.goals.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    // Start from today (i = 0) to include current day if all goals completed
    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dStr = getDateString(d);
        const dow = d.getDay();
        
        const dayGoals = data.goals.filter(g => isGoalScheduledForDay(g, dow));
        if (dayGoals.length === 0) continue;
        
        const allDone = dayGoals.every(g => getHistoryEntry(g.id, dStr)?.status === 'done');
        
        if (allDone) {
            streak++;
        } else {
            // For today, if not all done yet, don't break - just don't count it
            if (i === 0) continue;
            // For past days, break the streak
            break;
        }
    }
    
    return streak;
}

function calculateDisciplineScore() {
    const total = data.history.length;
    if (total === 0) return 0;
    
    const done = data.history.filter(h => h.status === 'done').length;
    return Math.round((done / total) * 100);
}

function calculateDisciplineStats() {
    const completed = data.history.filter(h => h.status === 'done').length;
    const skipped = data.history.filter(h => h.status === 'skipped').length;
    const blocked = data.history.filter(h => h.status === 'blocked').length;
    const total = data.history.length;
    
    return { completed, skipped, blocked, total };
}

// ==================== UI HELPERS ====================
function openModal(modalId) {
    // Pre-fill edit profile modal if opening it
    if (modalId === 'editProfileModal') {
        openEditProfileModal();
    }
    
    // Load report data when opening report modals
    if (modalId === 'moodReportModal') {
        renderMoodReport();
    } else if (modalId === 'sleepReportModal') {
        renderSleepReport();
    } else if (modalId === 'waterReportModal') {
        renderWaterReport();
    } else if (modalId === 'workoutReportModal') {
        renderWorkoutReport();
    } else if (modalId === 'fullReportModal') {
        renderFullReport();
    } else if (modalId === 'badgesModal') {
        renderBadgesModal();
    } else if (modalId === 'priorityModal') {
        renderPriorityModal();
    } else if (modalId === 'newDiaryEntryModal') {
        initDiary();
    } else if (modalId === 'photoGalleryModal') {
        renderPhotoGallery();
    } else if (modalId === 'addWeightModal') {
        // Set today's date as default
        document.getElementById('quickWeightDate').value = getDateString(new Date());
    }
    
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
}

function showToast(message, type = 'default') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toastIcon');
    const msg = document.getElementById('toastMessage');
    
    const icons = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-circle',
        error: 'fa-times-circle',
        default: 'fa-info-circle'
    };
    
    icon.className = `fas ${icons[type] || icons.default}`;
    msg.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
// ==================== NOTIFICATIONS SYSTEM ====================
function requestNotificationPermission() {
    if (!('Notification' in window)) {
        showToast('Notifiche non supportate in questo browser', 'error');
        return;
    }
    
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showToast('Notifiche attivate!', 'success');
            }
        });
    }
}

function initNotifications() {
    if (!('Notification' in window)) return;
    
    // Check and schedule all goal notifications
    data.goals.forEach(goal => {
        if (goal.notification) {
            scheduleGoalNotification(goal);
        }
    });
    
    // Check every minute if we need to send a notification
    setInterval(checkNotifications, 60000);
    checkNotifications();
}

function scheduleGoalNotification(goal) {
    // Store scheduled notifications in localStorage
    const scheduled = JSON.parse(localStorage.getItem('lt_scheduled_notifications') || '{}');
    scheduled[goal.id] = {
        time: goal.notification,
        goalId: goal.id,
        goalName: goal.name,
        days: goal.days
    };
    localStorage.setItem('lt_scheduled_notifications', JSON.stringify(scheduled));
}

function checkNotifications() {
    if (Notification.permission !== 'granted') return;
    
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const todayStr = getDateString(now);
    
    const scheduled = JSON.parse(localStorage.getItem('lt_scheduled_notifications') || '{}');
    const notifiedToday = JSON.parse(localStorage.getItem('lt_notified_today') || '{}');
    
    Object.values(scheduled).forEach(notification => {
        // Check if this goal is scheduled for today
        if (!notification.days.includes(currentDay)) return;
        
        // Check if we already notified today for this goal
        if (notifiedToday[notification.goalId] === todayStr) return;
        
        // Check if it's time to notify
        if (notification.time === currentTime) {
            // Check if goal is already completed today
            const completed = data.history.some(
                h => h.goalId === notification.goalId && h.date === todayStr
            );
            
            if (!completed) {
                sendNotification(notification.goalName);
                
                // Mark as notified
                notifiedToday[notification.goalId] = todayStr;
                localStorage.setItem('lt_notified_today', JSON.stringify(notifiedToday));
            }
        }
    });
}

function sendNotification(goalName) {
    if (Notification.permission !== 'granted') return;
    
    const notification = new Notification('🎯 Life Tracker', {
        body: `È ora di: ${goalName}`,
        icon: '/images/icon-192.png',
        badge: '/images/icon-192.png',
        tag: 'goal-reminder',
        requireInteraction: true
    });
    
    notification.onclick = () => {
        window.focus();
        notification.close();
    };
}

// ==================== DAILY RESET FUNCTION ====================
function resetDailyGoals() {
    // Goals are tracked by date in history, so no reset needed
    // Just refresh the UI
    renderAllGoals();
    renderHeroStats();
}

// ==================== WORKOUT SYSTEM ====================
let currentExerciseId = null;

// Initialize workout data if not exists
if (!data.workoutExercises) data.workoutExercises = [];
if (!data.runs) data.runs = [];

function switchWorkoutTab(tab) {
    document.querySelectorAll('.workout-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.workout-tab[onclick*="${tab}"]`)?.classList.add('active');
    
    document.getElementById('weightsTab').style.display = tab === 'weights' ? 'block' : 'none';
    document.getElementById('runningTab').style.display = tab === 'running' ? 'block' : 'none';
    document.getElementById('sessionTab').style.display = tab === 'session' ? 'block' : 'none';
    
    if (tab === 'weights') {
        renderExercisesGrid();
        renderWeightProgressChart();
    } else if (tab === 'running') {
        renderRunningStats();
    } else if (tab === 'session') {
        renderSessionTab();
    }
}

// ==================== EXERCISE SEARCH ====================
function filterExercises() {
    const query = document.getElementById('exerciseSearchInput')?.value.toLowerCase() || '';
    const container = document.getElementById('exercisesGrid');
    if (!container) return;
    
    const filtered = (data.workoutExercises || []).filter(ex => 
        ex.name.toLowerCase().includes(query) ||
        (ex.muscle || '').toLowerCase().includes(query)
    );
    
    renderExercisesGridFiltered(filtered);
}

function renderExercisesGridFiltered(exercises) {
    const container = document.getElementById('exercisesGrid');
    if (!container) return;
    
    if (!exercises || exercises.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: span 2;">
                <i class="fas fa-search"></i>
                <p>Nessun esercizio trovato</p>
            </div>
        `;
        return;
    }
    
    const muscleIcons = {
        chest: 'fa-heart',
        back: 'fa-child-reaching',
        shoulders: 'fa-user',
        arms: 'fa-hand-fist',
        legs: 'fa-person-walking',
        core: 'fa-circle'
    };
    
    container.innerHTML = exercises.map(ex => {
        const latestWeight = ex.history?.[ex.history.length - 1]?.weight || ex.weight || 0;
        const latestReps = ex.history?.[ex.history.length - 1]?.reps || ex.reps || 0;
        
        return `
            <div class="exercise-card" onclick="openExerciseDetail('${ex.id}')">
                <div class="exercise-card-icon">
                    <i class="fas ${muscleIcons[ex.muscle] || 'fa-dumbbell'}"></i>
                </div>
                <div class="exercise-card-name">${ex.name}</div>
                <div class="exercise-card-weight">${latestWeight} kg</div>
                <div class="exercise-card-reps">${latestReps} reps</div>
            </div>
        `;
    }).join('');
}

// ==================== WORKOUT SESSION SYSTEM ====================
let activeSession = null;
let sessionTimer = null;
let sessionSeconds = 0;
let sessionExercises = [];

// Initialize sessions data
if (!data.workoutSessions) data.workoutSessions = [];

function startWorkoutSession() {
    activeSession = {
        id: generateId(),
        startTime: new Date().toISOString(),
        exercises: []
    };
    sessionExercises = [];
    sessionSeconds = 0;
    
    // Update UI
    document.getElementById('sessionBanner').style.display = 'flex';
    document.getElementById('startSessionSection').style.display = 'none';
    document.getElementById('sessionExercisesSection').style.display = 'block';
    
    // Start timer
    sessionTimer = setInterval(() => {
        sessionSeconds++;
        updateSessionTimer();
    }, 1000);
    
    // Render exercise list for selection
    renderSessionExerciseList();
    renderSelectedSessionExercises();
    
    showToast('Sessione iniziata! 💪', 'success');
}

function updateSessionTimer() {
    const hours = Math.floor(sessionSeconds / 3600);
    const mins = Math.floor((sessionSeconds % 3600) / 60);
    const secs = sessionSeconds % 60;
    
    const timerEl = document.getElementById('sessionTimer');
    if (timerEl) {
        timerEl.textContent = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

function endWorkoutSession() {
    if (!activeSession) return;
    
    // Stop timer
    clearInterval(sessionTimer);
    
    // Collect exercise data from inputs
    const finalExercises = sessionExercises.map(ex => {
        const weightInput = document.getElementById(`session-weight-${ex.id}`);
        const repsInput = document.getElementById(`session-reps-${ex.id}`);
        const setsInput = document.getElementById(`session-sets-${ex.id}`);
        
        return {
            exerciseId: ex.id,
            name: ex.name,
            weight: parseFloat(weightInput?.value) || ex.weight || 0,
            reps: parseInt(repsInput?.value) || ex.reps || 10,
            sets: parseInt(setsInput?.value) || 3
        };
    });
    
    // Save session
    const session = {
        id: activeSession.id,
        date: activeSession.startTime,
        duration: sessionSeconds,
        exercises: finalExercises
    };
    
    if (!data.workoutSessions) data.workoutSessions = [];
    data.workoutSessions.push(session);
    saveData('workoutSessions');
    
    // Update exercise history for each exercise
    finalExercises.forEach(ex => {
        const exercise = data.workoutExercises.find(e => e.id === ex.exerciseId);
        if (exercise) {
            if (!exercise.history) exercise.history = [];
            exercise.history.push({
                date: new Date().toISOString(),
                weight: ex.weight,
                reps: ex.reps,
                sets: ex.sets
            });
        }
    });
    saveData('workoutExercises');
    
    // Reset UI
    document.getElementById('sessionBanner').style.display = 'none';
    document.getElementById('startSessionSection').style.display = 'block';
    document.getElementById('sessionExercisesSection').style.display = 'none';
    
    activeSession = null;
    sessionExercises = [];
    sessionSeconds = 0;
    
    // Refresh UI
    renderSessionHistory();
    updateWorkoutHeroStats();
    renderWeightProgressChart();
    
    // Calculate XP
    const xp = 50 + (finalExercises.length * 10);
    if (typeof EliteFeatures !== 'undefined') {
        EliteFeatures.addXP(xp, 'Sessione completata');
    }
    
    showToast(`Sessione completata! +${xp} XP`, 'success');
}

function renderSessionTab() {
    renderSessionExerciseList();
    renderSelectedSessionExercises();
    renderSessionHistory();
    
    // Restore session state if active
    if (activeSession) {
        document.getElementById('sessionBanner').style.display = 'flex';
        document.getElementById('startSessionSection').style.display = 'none';
        document.getElementById('sessionExercisesSection').style.display = 'block';
    }
}

function filterSessionExercises() {
    renderSessionExerciseList();
}

function renderSessionExerciseList() {
    const container = document.getElementById('sessionExerciseResults');
    if (!container) return;
    
    const query = document.getElementById('sessionSearchInput')?.value.toLowerCase() || '';
    
    const filtered = (data.workoutExercises || []).filter(ex => 
        ex.name.toLowerCase().includes(query) ||
        (ex.muscle || '').toLowerCase().includes(query)
    );
    
    if (filtered.length === 0 && query) {
        container.innerHTML = `<div class="empty-state-sm"><p>Nessun esercizio trovato</p></div>`;
        return;
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state-sm"><p>Aggiungi esercizi nella tab Pesi</p></div>`;
        return;
    }
    
    const muscleIcons = {
        chest: 'fa-heart',
        back: 'fa-child-reaching',
        shoulders: 'fa-user',
        arms: 'fa-hand-fist',
        legs: 'fa-person-walking',
        core: 'fa-circle'
    };
    
    container.innerHTML = filtered.map(ex => {
        const isAdded = sessionExercises.some(se => se.id === ex.id);
        const latestWeight = ex.history?.[ex.history.length - 1]?.weight || ex.weight || 0;
        
        return `
            <div class="session-exercise-item ${isAdded ? 'added' : ''}">
                <div class="session-exercise-info">
                    <div class="session-exercise-icon">
                        <i class="fas ${muscleIcons[ex.muscle] || 'fa-dumbbell'}"></i>
                    </div>
                    <div>
                        <div class="session-exercise-name">${ex.name}</div>
                        <div class="session-exercise-weight">${latestWeight} kg</div>
                    </div>
                </div>
                <button class="session-add-btn ${isAdded ? 'remove' : ''}" onclick="toggleSessionExercise('${ex.id}')">
                    <i class="fas ${isAdded ? 'fa-minus' : 'fa-plus'}"></i>
                </button>
            </div>
        `;
    }).join('');
}

function toggleSessionExercise(exerciseId) {
    const exercise = data.workoutExercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    
    const index = sessionExercises.findIndex(e => e.id === exerciseId);
    
    if (index >= 0) {
        // Remove
        sessionExercises.splice(index, 1);
    } else {
        // Add
        sessionExercises.push({
            id: exercise.id,
            name: exercise.name,
            weight: exercise.history?.[exercise.history.length - 1]?.weight || exercise.weight || 0,
            reps: exercise.history?.[exercise.history.length - 1]?.reps || exercise.reps || 10,
            muscle: exercise.muscle
        });
    }
    
    renderSessionExerciseList();
    renderSelectedSessionExercises();
}

function renderSelectedSessionExercises() {
    const container = document.getElementById('sessionSelectedExercises');
    if (!container) return;
    
    if (sessionExercises.length === 0) {
        container.innerHTML = `
            <div class="empty-state-sm">
                <i class="fas fa-plus-circle"></i>
                <p>Aggiungi esercizi dalla ricerca sopra</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = sessionExercises.map(ex => `
        <div class="session-selected-item">
            <div class="session-selected-info">
                <div class="session-selected-name">${ex.name}</div>
            </div>
            <div class="session-selected-inputs">
                <input type="number" class="session-input-small" id="session-weight-${ex.id}" value="${ex.weight}" placeholder="Kg">
                <input type="number" class="session-input-small" id="session-reps-${ex.id}" value="${ex.reps}" placeholder="Reps">
                <input type="number" class="session-input-small" id="session-sets-${ex.id}" value="3" placeholder="Set">
            </div>
            <button class="session-remove-btn" onclick="toggleSessionExercise('${ex.id}')">
                <i class="fas fa-xmark"></i>
            </button>
        </div>
    `).join('');
}

function renderSessionHistory() {
    const container = document.getElementById('sessionHistoryList');
    if (!container) return;
    
    const sessions = data.workoutSessions || [];
    
    if (sessions.length === 0) {
        container.innerHTML = `
            <div class="empty-state-sm">
                <i class="fas fa-history"></i>
                <p>Nessuna sessione registrata</p>
            </div>
        `;
        return;
    }
    
    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hrs > 0) {
            return `${hrs}h ${mins}min`;
        }
        return `${mins} min`;
    };
    
    container.innerHTML = sessions.slice().reverse().slice(0, 10).map(session => {
        const date = new Date(session.date);
        const dateStr = date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="session-history-item">
                <div class="session-history-header">
                    <div>
                        <div class="session-history-date">${dateStr}</div>
                        <div style="font-size: var(--text-xs); color: var(--gray-500);">${timeStr}</div>
                    </div>
                    <div class="session-history-duration">${formatDuration(session.duration)}</div>
                </div>
                <div class="session-history-exercises">
                    ${(session.exercises || []).map(ex => `
                        <span class="session-exercise-tag">${ex.name} ${ex.weight}kg × ${ex.reps}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function renderWorkoutView() {
    // Ensure weights tab is visible and active by default
    const weightsTab = document.getElementById('weightsTab');
    const runningTab = document.getElementById('runningTab');
    const sessionTab = document.getElementById('sessionTab');
    
    if (weightsTab) weightsTab.style.display = 'block';
    if (runningTab) runningTab.style.display = 'none';
    if (sessionTab) sessionTab.style.display = 'none';
    
    // Set active tab button
    document.querySelectorAll('.workout-tab').forEach(t => t.classList.remove('active'));
    const activeBtn = document.querySelector('.workout-tab[onclick*="weights"]');
    if (activeBtn) activeBtn.classList.add('active');
    
    // Render content
    updateWorkoutHeroStats();
    renderExercisesGrid();
    renderWeightProgressChart();
    renderSessionHistory();
}

function updateWorkoutHeroStats() {
    const totalWorkoutsEl = document.getElementById('totalWorkouts');
    const totalWorkoutHoursEl = document.getElementById('totalWorkoutHours');
    const totalRunKmEl = document.getElementById('totalRunKm');
    
    // Calculate total sessions from workout sessions
    if (totalWorkoutsEl) {
        const sessions = (data.workoutSessions || []).length;
        const runSessions = (data.runs || []).length;
        totalWorkoutsEl.textContent = sessions + runSessions;
    }
    
    // Calculate total hours from actual tracked sessions
    if (totalWorkoutHoursEl) {
        const sessionMinutes = (data.workoutSessions || []).reduce((sum, s) => sum + Math.round((s.duration || 0) / 60), 0);
        const runMinutes = (data.runs || []).reduce((sum, r) => sum + (r.time || 0), 0);
        const totalHours = (sessionMinutes + runMinutes) / 60;
        totalWorkoutHoursEl.textContent = totalHours.toFixed(1);
    }
    
    // Calculate total km run
    if (totalRunKmEl) {
        const total = (data.runs || []).reduce((sum, r) => sum + (r.distance || 0), 0);
        totalRunKmEl.textContent = total.toFixed(1);
    }
}

// EXERCISES
function renderExercisesGrid() {
    const container = document.getElementById('exercisesGrid');
    if (!container) return;
    
    if (!data.workoutExercises || data.workoutExercises.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: span 2;">
                <i class="fas fa-dumbbell"></i>
                <p>Nessun esercizio ancora</p>
                <button class="btn btn-primary" onclick="openModal('addExerciseModal')">Aggiungi Esercizio</button>
            </div>
        `;
        return;
    }
    
    const muscleIcons = {
        chest: 'fa-heart',
        back: 'fa-child-reaching',
        shoulders: 'fa-user',
        arms: 'fa-hand-fist',
        legs: 'fa-person-walking',
        core: 'fa-circle'
    };
    
    container.innerHTML = data.workoutExercises.map(ex => {
        const latestWeight = ex.history?.[ex.history.length - 1]?.weight || ex.weight || 0;
        const latestReps = ex.history?.[ex.history.length - 1]?.reps || ex.reps || 0;
        
        return `
            <div class="exercise-card" onclick="openExerciseDetail('${ex.id}')">
                <div class="exercise-card-icon">
                    <i class="fas ${muscleIcons[ex.muscle] || 'fa-dumbbell'}"></i>
                </div>
                <div class="exercise-card-name">${ex.name}</div>
                <div class="exercise-card-weight">${latestWeight} kg</div>
                <div class="exercise-card-reps">${latestReps} reps</div>
            </div>
        `;
    }).join('');
}

function saveNewExercise(event) {
    event.preventDefault();
    
    const name = document.getElementById('newExerciseName').value.trim();
    const muscle = document.getElementById('newExerciseMuscle').value;
    const weight = parseFloat(document.getElementById('newExerciseWeight').value) || 0;
    const reps = parseInt(document.getElementById('newExerciseReps').value) || 10;
    
    if (!name) {
        showToast('Inserisci il nome dell\'esercizio', 'error');
        return;
    }
    
    if (!data.workoutExercises) data.workoutExercises = [];
    
    const exercise = {
        id: generateId(),
        name,
        muscle,
        weight,
        reps,
        history: [{
            date: new Date().toISOString(),
            weight,
            reps
        }],
        createdAt: new Date().toISOString()
    };
    
    data.workoutExercises.push(exercise);
    saveData('workoutExercises');
    
    closeModal('addExerciseModal');
    document.getElementById('addExerciseForm').reset();
    
    renderExercisesGrid();
    renderWeightProgressChart();
    updateWorkoutHeroStats();
    showToast('Esercizio aggiunto! +30 XP', 'success');
    
    if (typeof EliteFeatures !== 'undefined') {
        EliteFeatures.addXP(30, 'Nuovo esercizio');
    }
}

function openExerciseDetail(exerciseId) {
    currentExerciseId = exerciseId;
    const exercise = data.workoutExercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    
    document.getElementById('exerciseDetailName').textContent = exercise.name.toUpperCase();
    
    const latestWeight = exercise.history?.[exercise.history.length - 1]?.weight || exercise.weight || 0;
    const latestReps = exercise.history?.[exercise.history.length - 1]?.reps || exercise.reps || 0;
    const pr = Math.max(...(exercise.history || []).map(h => h.weight || 0), exercise.weight || 0);
    
    document.getElementById('exerciseCurrentWeight').textContent = latestWeight;
    document.getElementById('exerciseCurrentReps').textContent = latestReps;
    document.getElementById('exercisePR').textContent = pr;
    
    document.getElementById('updateExerciseWeight').value = latestWeight;
    document.getElementById('updateExerciseReps').value = latestReps;
    
    // Render history
    const historyContainer = document.getElementById('exerciseHistoryList');
    const history = (exercise.history || []).slice().reverse();
    
    historyContainer.innerHTML = history.length > 0 ? history.map(h => {
        const date = new Date(h.date);
        const dateStr = date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
        return `
            <div class="exercise-history-item">
                <span class="exercise-history-date">${dateStr}</span>
                <span class="exercise-history-weight">${h.weight} kg × ${h.reps}</span>
            </div>
        `;
    }).join('') : '<p style="color:var(--gray-500);text-align:center;">Nessuna cronologia</p>';
    
    // Render mini chart
    const chartContainer = document.getElementById('exerciseMiniChart');
    const chartData = (exercise.history || []).slice(-10);
    const maxWeight = Math.max(...chartData.map(h => h.weight || 0), 1);
    
    chartContainer.innerHTML = chartData.map(h => {
        const height = ((h.weight || 0) / maxWeight) * 100;
        return `<div class="exercise-chart-bar" style="height: ${height}%"></div>`;
    }).join('');
    
    openModal('exerciseDetailModal');
}

function updateExerciseWeight() {
    if (!currentExerciseId) return;
    
    const exercise = data.workoutExercises.find(e => e.id === currentExerciseId);
    if (!exercise) return;
    
    const newWeight = parseFloat(document.getElementById('updateExerciseWeight').value) || 0;
    const newReps = parseInt(document.getElementById('updateExerciseReps').value) || 10;
    
    if (!exercise.history) exercise.history = [];
    
    exercise.history.push({
        date: new Date().toISOString(),
        weight: newWeight,
        reps: newReps
    });
    
    saveData('workoutExercises');
    closeModal('exerciseDetailModal');
    
    renderExercisesGrid();
    renderWeightProgressChart();
    updateWorkoutHeroStats();
    showToast('Progresso salvato! +20 XP', 'success');
    
    if (typeof EliteFeatures !== 'undefined') {
        EliteFeatures.addXP(20, 'Workout registrato');
    }
}

function deleteExercise() {
    if (!currentExerciseId) return;
    
    if (confirm('Eliminare questo esercizio e tutta la sua cronologia?')) {
        data.workoutExercises = data.workoutExercises.filter(e => e.id !== currentExerciseId);
        saveData('workoutExercises');
        closeModal('exerciseDetailModal');
        renderExercisesGrid();
        renderWeightProgressChart();
        showToast('Esercizio eliminato', 'warning');
    }
}

function renderWeightProgressChart() {
    const container = document.getElementById('weightProgressChart');
    if (!container) return;
    
    if (!data.workoutExercises || data.workoutExercises.length === 0) {
        container.innerHTML = '<p style="color:var(--gray-500);text-align:center;padding:var(--space-xl);">Aggiungi esercizi per vedere i progressi</p>';
        return;
    }
    
    // Render each exercise with its progress
    container.innerHTML = data.workoutExercises.map(ex => {
        const history = ex.history || [];
        const currentWeight = history.length > 0 ? history[history.length - 1].weight : (ex.weight || 0);
        const startWeight = history.length > 0 ? history[0].weight : (ex.weight || 0);
        const maxWeight = history.length > 0 ? Math.max(...history.map(h => h.weight || 0)) : (ex.weight || 0);
        const progressPercent = startWeight > 0 ? Math.round(((currentWeight - startWeight) / startWeight) * 100) : 0;
        const isPositive = progressPercent >= 0;
        
        // Create mini chart bars (last 8 entries)
        const chartData = history.slice(-8);
        const chartMax = Math.max(...chartData.map(h => h.weight || 0), 1);
        
        const chartBars = chartData.length > 1 ? chartData.map((h, i) => {
            const height = (h.weight / chartMax) * 100;
            return `<div class="progress-chart-bar" style="height: ${height}%"></div>`;
        }).join('') : '<span style="color:var(--gray-500);font-size:var(--text-xs);">Min. 2 registrazioni</span>';
        
        return `
            <div class="weight-progress-card">
                <div class="weight-progress-header">
                    <div class="weight-progress-name">${ex.name}</div>
                    <div class="weight-progress-change ${isPositive ? 'positive' : 'negative'}">
                        <i class="fas fa-${isPositive ? 'arrow-up' : 'arrow-down'}"></i>
                        ${Math.abs(progressPercent)}%
                    </div>
                </div>
                <div class="weight-progress-stats">
                    <div class="weight-stat">
                        <span class="weight-stat-label">Attuale</span>
                        <span class="weight-stat-value">${currentWeight} kg</span>
                    </div>
                    <div class="weight-stat">
                        <span class="weight-stat-label">Max</span>
                        <span class="weight-stat-value">${maxWeight} kg</span>
                    </div>
                    <div class="weight-stat">
                        <span class="weight-stat-label">Inizio</span>
                        <span class="weight-stat-value">${startWeight} kg</span>
                    </div>
                </div>
                <div class="weight-progress-mini-chart">
                    ${chartBars}
                </div>
            </div>
        `;
    }).join('');
}

// RUNNING
function saveRun() {
    const distance = parseFloat(document.getElementById('runDistance').value);
    const time = parseInt(document.getElementById('runTime').value);
    
    if (!distance || !time) {
        showToast('Inserisci distanza e tempo', 'error');
        return;
    }
    
    if (!data.runs) data.runs = [];
    
    const pace = time / distance; // min/km
    
    data.runs.push({
        id: generateId(),
        distance,
        time,
        pace,
        date: new Date().toISOString()
    });
    
    saveData('runs');
    
    document.getElementById('runDistance').value = '';
    document.getElementById('runTime').value = '';
    
    renderRunningStats();
    updateWorkoutHeroStats();
    showToast('Corsa salvata! +25 XP', 'success');
    
    if (typeof EliteFeatures !== 'undefined') {
        EliteFeatures.addXP(25, 'Corsa completata');
    }
}

function renderRunningStats() {
    if (!data.runs) data.runs = [];
    
    const totalDistance = data.runs.reduce((sum, r) => sum + (r.distance || 0), 0);
    const avgPace = data.runs.length > 0 
        ? data.runs.reduce((sum, r) => sum + (r.pace || 0), 0) / data.runs.length 
        : 0;
    const bestPace = data.runs.length > 0 
        ? Math.min(...data.runs.map(r => r.pace || Infinity)) 
        : 0;
    
    const formatPace = (pace) => {
        if (!pace || pace === Infinity) return '0:00';
        const mins = Math.floor(pace);
        const secs = Math.round((pace - mins) * 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    document.getElementById('totalDistance').textContent = totalDistance.toFixed(1);
    document.getElementById('avgPace').textContent = formatPace(avgPace);
    document.getElementById('bestPace').textContent = formatPace(bestPace);
    document.getElementById('totalRuns').textContent = data.runs.length;
    
    // Weekly bar chart
    renderRunBarChart();
    
    // History
    renderRunsHistory();
}

function renderRunBarChart() {
    const container = document.getElementById('runBarChart');
    if (!container) return;
    
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const weekData = Array(7).fill(0);
    
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    
    (data.runs || []).forEach(run => {
        const runDate = new Date(run.date);
        if (runDate >= weekAgo && runDate <= now) {
            const dayIndex = runDate.getDay();
            weekData[dayIndex] += run.distance || 0;
        }
    });
    
    const maxKm = Math.max(...weekData, 1);
    const todayIndex = now.getDay();
    
    // Reorder to show last 7 days with today at the end
    const orderedDays = [];
    for (let i = 6; i >= 0; i--) {
        const idx = (todayIndex - i + 7) % 7;
        orderedDays.push({ day: days[idx], km: weekData[idx] });
    }
    
    container.innerHTML = orderedDays.map(d => {
        const height = (d.km / maxKm) * 100;
        return `
            <div class="run-bar-item">
                <div class="run-bar-value">${d.km > 0 ? d.km.toFixed(1) : ''}</div>
                <div class="run-bar" style="height: ${Math.max(height, 5)}%"></div>
                <div class="run-bar-label">${d.day}</div>
            </div>
        `;
    }).join('');
}

function renderRunsHistory() {
    const container = document.getElementById('runsHistory');
    if (!container) return;
    
    if (!data.runs || data.runs.length === 0) {
        container.innerHTML = '<p style="color:var(--gray-500);text-align:center;padding:var(--space-lg);">Nessuna corsa registrata</p>';
        return;
    }
    
    const formatPace = (pace) => {
        if (!pace) return '0:00';
        const mins = Math.floor(pace);
        const secs = Math.round((pace - mins) * 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    const sortedRuns = [...data.runs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    
    container.innerHTML = sortedRuns.map(run => {
        const date = new Date(run.date);
        const dateStr = date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
        
        return `
            <div class="run-history-item">
                <div class="run-history-icon"><i class="fas fa-running"></i></div>
                <div class="run-history-info">
                    <div class="run-history-distance">${run.distance} km</div>
                    <div class="run-history-date">${dateStr} • ${run.time} min</div>
                </div>
                <div class="run-history-pace">
                    <div class="run-history-pace-value">${formatPace(run.pace)}</div>
                    <div class="run-history-pace-label">min/km</div>
                </div>
            </div>
        `;
    }).join('');
}

// Make functions available globally for elite-features.js
window.resetDailyGoals = resetDailyGoals;
window.updateWaterDisplay = updateWaterDisplay;
window.loadPriorities = loadPriorities;
window.renderAllGoals = renderAllGoals;
window.filterGoals = filterGoals;
window.switchWorkoutTab = switchWorkoutTab;
window.saveNewExercise = saveNewExercise;
window.openExerciseDetail = openExerciseDetail;
window.updateExerciseWeight = updateExerciseWeight;
window.deleteExercise = deleteExercise;
window.saveRun = saveRun;
window.switchStatsTab = switchStatsTab;
window.setTrendPeriod = setTrendPeriod;
window.navigateCalendar = navigateCalendar;
window.selectCalendarDay = selectCalendarDay;
window.closeDayDetail = closeDayDetail;
window.markGoalFromCalendar = markGoalFromCalendar;
window.filterExercises = filterExercises;
window.filterSessionExercises = filterSessionExercises;
window.startWorkoutSession = startWorkoutSession;
window.endWorkoutSession = endWorkoutSession;
window.saveQuickWeight = saveQuickWeight;
window.renderMeasurementChart = renderMeasurementChart;
window.toggleSessionExercise = toggleSessionExercise;