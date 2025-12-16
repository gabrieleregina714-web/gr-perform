// =====================================================
// GR PERFORM - CONFIGURAZIONE SUPABASE
// =====================================================

const SUPABASE_URL = 'https://unkzjnlrorluzfahmize.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVua3pqbmxyb3JsdXpmYWhtaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3OTQ3MTIsImV4cCI6MjA4MTM3MDcxMn0.c1utLN0YO2k6K-8cFokp7LaTD2ND6Mb0l2BxeFW4oxM';

// Inizializza Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================================================
// FUNZIONI DATABASE
// =====================================================

// --- ATLETI ---

async function createAthlete(athleteData) {
    const { data, error } = await supabase
        .from('athletes')
        .insert([athleteData])
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function getAthlete(athleteId) {
    const { data, error } = await supabase
        .from('athletes')
        .select(`
            *,
            sport_specific_data(*),
            weekly_schedule(*),
            injuries_conditions(*),
            athlete_goals(*, role_specific_goals(*))
        `)
        .eq('id', athleteId)
        .single();

    if (error) throw error;
    return data;
}

async function getAllAthletes() {
    const { data, error } = await supabase
        .from('athletes')
        .select(`
            *,
            programs(id, name, current_week, total_weeks, status)
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

async function updateAthlete(athleteId, updates) {
    const { data, error } = await supabase
        .from('athletes')
        .update(updates)
        .eq('id', athleteId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// --- DATI SPORT-SPECIFICI ---

async function saveSportSpecificData(athleteId, sportData) {
    const { data, error } = await supabase
        .from('sport_specific_data')
        .upsert({ athlete_id: athleteId, ...sportData })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// --- SCHEDULE SETTIMANALE ---

async function saveWeeklySchedule(athleteId, scheduleData) {
    const { data, error } = await supabase
        .from('weekly_schedule')
        .upsert({ athlete_id: athleteId, ...scheduleData })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// --- OBIETTIVI ---

async function getRoleGoals(sport, role) {
    const { data, error } = await supabase
        .from('role_specific_goals')
        .select('*')
        .eq('sport', sport)
        .eq('role', role)
        .order('is_primary', { ascending: false });

    if (error) throw error;
    return data;
}

async function saveAthleteGoals(athleteId, goals) {
    // Prima elimina i vecchi obiettivi
    await supabase
        .from('athlete_goals')
        .delete()
        .eq('athlete_id', athleteId);

    // Poi inserisce i nuovi
    const goalsToInsert = goals.map((goal, index) => ({
        athlete_id: athleteId,
        goal_id: goal.goal_id,
        priority: index + 1,
        current_level: goal.current_level || 1
    }));

    const { data, error } = await supabase
        .from('athlete_goals')
        .insert(goalsToInsert)
        .select();

    if (error) throw error;
    return data;
}

// --- INFORTUNI ---

async function saveInjury(athleteId, injuryData) {
    const { data, error } = await supabase
        .from('injuries_conditions')
        .insert({ athlete_id: athleteId, ...injuryData })
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function getAthleteInjuries(athleteId) {
    const { data, error } = await supabase
        .from('injuries_conditions')
        .select('*')
        .eq('athlete_id', athleteId)
        .in('status', ['attivo', 'in_recupero']);

    if (error) throw error;
    return data;
}

// --- PROGRAMMI ---

async function createProgram(programData) {
    const { data, error } = await supabase
        .from('programs')
        .insert([programData])
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function getAthletePrograms(athleteId) {
    const { data, error } = await supabase
        .from('programs')
        .select(`
            *,
            workouts(id, week_number, day_of_week, name, status)
        `)
        .eq('athlete_id', athleteId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// --- WORKOUT/SCHEDE ---

async function createWorkout(workoutData) {
    const { data, error } = await supabase
        .from('workouts')
        .insert([workoutData])
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function getWorkout(workoutId) {
    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', workoutId)
        .single();

    if (error) throw error;
    return data;
}

async function getAthleteWorkouts(athleteId, programId = null) {
    let query = supabase
        .from('workouts')
        .select('*')
        .eq('athlete_id', athleteId)
        .order('workout_date', { ascending: true });

    if (programId) {
        query = query.eq('program_id', programId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

async function updateWorkout(workoutId, updates) {
    const { data, error } = await supabase
        .from('workouts')
        .update(updates)
        .eq('id', workoutId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function getPendingAIReviews() {
    const { data, error } = await supabase
        .from('workouts')
        .select(`
            *,
            athletes(first_name, last_name, sport),
            programs(name, current_week)
        `)
        .eq('ai_generated', true)
        .eq('reviewed_by_coach', false)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// --- MESSAGGI ---

async function sendMessage(athleteId, senderType, content, attachments = null) {
    const { data, error } = await supabase
        .from('messages')
        .insert([{
            athlete_id: athleteId,
            sender_type: senderType,
            content: content,
            attachments: attachments
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function getAthleteMessages(athleteId, limit = 50) {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('athlete_id', athleteId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data.reverse(); // Per avere i più vecchi prima
}

async function markMessagesAsRead(athleteId) {
    const { error } = await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('athlete_id', athleteId)
        .eq('is_read', false);

    if (error) throw error;
}

async function getUnreadMessagesCount() {
    const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_type', 'athlete')
        .eq('is_read', false);

    if (error) throw error;
    return count;
}

// --- PROGRESSI ---

async function logProgress(athleteId, metricType, metricName, value, unit) {
    const { data, error } = await supabase
        .from('progress_metrics')
        .insert([{
            athlete_id: athleteId,
            metric_type: metricType,
            metric_name: metricName,
            value: value,
            unit: unit
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function getAthleteProgress(athleteId, metricName = null) {
    let query = supabase
        .from('progress_metrics')
        .select('*')
        .eq('athlete_id', athleteId)
        .order('recorded_at', { ascending: true });

    if (metricName) {
        query = query.eq('metric_name', metricName);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

// --- ACHIEVEMENT ---

async function checkAndUnlockAchievements(athleteId) {
    // Questa funzione verrà chiamata dopo ogni azione significativa
    // Per ora è un placeholder - implementeremo la logica completa
    console.log('Checking achievements for athlete:', athleteId);
}

async function getAthleteAchievements(athleteId) {
    const { data, error } = await supabase
        .from('athlete_achievements')
        .select(`
            *,
            achievements(*)
        `)
        .eq('athlete_id', athleteId)
        .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return data;
}

// --- STATISTICHE COACH ---

async function getCoachStats() {
    const [athletes, pendingReviews, unreadMessages] = await Promise.all([
        supabase.from('athletes').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('workouts').select('*', { count: 'exact', head: true }).eq('ai_generated', true).eq('reviewed_by_coach', false),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('sender_type', 'athlete').eq('is_read', false)
    ]);

    return {
        activeAthletes: athletes.count || 0,
        pendingReviews: pendingReviews.count || 0,
        unreadMessages: unreadMessages.count || 0
    };
}

// =====================================================
// EXPORT (per uso in altri file)
// =====================================================

window.GRPerformDB = {
    supabase,
    // Atleti
    createAthlete,
    getAthlete,
    getAllAthletes,
    updateAthlete,
    // Sport specifici
    saveSportSpecificData,
    getRoleGoals,
    saveAthleteGoals,
    // Schedule
    saveWeeklySchedule,
    // Infortuni
    saveInjury,
    getAthleteInjuries,
    // Programmi
    createProgram,
    getAthletePrograms,
    // Workout
    createWorkout,
    getWorkout,
    getAthleteWorkouts,
    updateWorkout,
    getPendingAIReviews,
    // Messaggi
    sendMessage,
    getAthleteMessages,
    markMessagesAsRead,
    getUnreadMessagesCount,
    // Progressi
    logProgress,
    getAthleteProgress,
    // Achievement
    checkAndUnlockAchievements,
    getAthleteAchievements,
    // Stats
    getCoachStats
};

console.log('✅ GR Perform Database initialized');
