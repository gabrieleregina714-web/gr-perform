// Anamnesi Form Logic
const formData = {
    sport: null,
    role: null,
    package: 'completo',
    goals: [],
    schedule: {}
};

let currentStep = 1;
const totalSteps = 6;

// Role options per sport
const rolesBySport = {
    calcio: [
        { id: 'portiere', name: 'Portiere' },
        { id: 'difensore_centrale', name: 'Difensore Centrale' },
        { id: 'terzino', name: 'Terzino' },
        { id: 'centrocampista', name: 'Centrocampista' },
        { id: 'ala', name: 'Ala' },
        { id: 'attaccante', name: 'Attaccante' }
    ],
    basket: [
        { id: 'playmaker', name: 'Playmaker' },
        { id: 'guardia', name: 'Guardia' },
        { id: 'ala_piccola', name: 'Ala Piccola' },
        { id: 'ala_grande', name: 'Ala Grande' },
        { id: 'centro', name: 'Centro' }
    ],
    boxe: [
        { id: 'peso_mosca', name: 'Peso Mosca' },
        { id: 'peso_piuma', name: 'Peso Piuma' },
        { id: 'peso_leggero', name: 'Peso Leggero' },
        { id: 'peso_welter', name: 'Peso Welter' },
        { id: 'peso_medio', name: 'Peso Medio' },
        { id: 'peso_massimo', name: 'Peso Massimo' }
    ],
    palestra: [
        { id: 'ipertrofia', name: 'Ipertrofia' },
        { id: 'forza', name: 'Forza' },
        { id: 'dimagrimento', name: 'Dimagrimento' },
        { id: 'fitness', name: 'Fitness Generale' },
        { id: 'powerlifting', name: 'Powerlifting' },
        { id: 'bodybuilding', name: 'Bodybuilding' }
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupSportCards();
    setupPackageCards();
    setupNavigation();
    updateProgress();
});

function setupSportCards() {
    document.querySelectorAll('.sport-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.sport-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            formData.sport = card.dataset.sport;
        });
    });
}

function setupPackageCards() {
    document.querySelectorAll('.package-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            formData.package = card.dataset.package;
        });
    });
}

function setupNavigation() {
    document.getElementById('nextBtn').addEventListener('click', nextStep);
    document.getElementById('prevBtn').addEventListener('click', prevStep);
}

function nextStep() {
    if (!validateStep(currentStep)) return;
    
    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
        
        // Load dynamic content
        if (currentStep === 3) loadRoleContent();
        if (currentStep === 4) loadGoals();
        if (currentStep === 6) loadSummary();
    } else {
        submitForm();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    
    document.getElementById('prevBtn').style.display = step > 1 ? 'flex' : 'none';
    document.getElementById('nextBtn').innerHTML = step === totalSteps 
        ? '<i class="fas fa-check"></i> Completa' 
        : 'Avanti <i class="fas fa-arrow-right"></i>';
    
    updateProgress();
}

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    
    document.querySelectorAll('.step').forEach((s, i) => {
        s.classList.remove('active', 'completed');
        if (i + 1 === currentStep) s.classList.add('active');
        if (i + 1 < currentStep) s.classList.add('completed');
    });
}

function validateStep(step) {
    switch(step) {
        case 1:
            if (!formData.sport) {
                alert('Seleziona il tuo sport');
                return false;
            }
            break;
        case 2:
            const required = ['firstName', 'lastName', 'email', 'birthDate', 'gender', 'height', 'weight'];
            for (let field of required) {
                if (!document.getElementById(field).value) {
                    alert('Compila tutti i campi obbligatori');
                    return false;
                }
            }
            break;
        case 3:
            if (!formData.role && formData.sport !== 'palestra') {
                alert('Seleziona il tuo ruolo');
                return false;
            }
            break;
    }
    return true;
}

function loadRoleContent() {
    const container = document.getElementById('roleContent');
    const roles = rolesBySport[formData.sport] || [];
    
    // Update title based on sport
    const titles = {
        calcio: { title: 'Il tuo ruolo in campo', subtitle: 'Seleziona la posizione che giochi' },
        basket: { title: 'Il tuo ruolo in campo', subtitle: 'Seleziona la posizione che giochi' },
        boxe: { title: 'La tua categoria', subtitle: 'Seleziona la categoria di peso' },
        palestra: { title: 'Il tuo obiettivo', subtitle: 'Cosa vuoi ottenere principalmente?' }
    };
    
    document.getElementById('step3Title').textContent = titles[formData.sport]?.title || 'Dettagli';
    document.getElementById('step3Subtitle').textContent = titles[formData.sport]?.subtitle || '';
    
    let html = '<div class="role-grid">';
    roles.forEach(role => {
        html += `<div class="role-card" data-role="${role.id}">${role.name}</div>`;
    });
    html += '</div>';
    
    // Sport-specific extra fields
    if (formData.sport === 'calcio' || formData.sport === 'basket') {
        html += `
            <div class="form-grid" style="margin-top: 1.5rem;">
                <div class="form-group">
                    <label>Nome squadra</label>
                    <input type="text" id="teamName" placeholder="Es: Inter Primavera">
                </div>
                <div class="form-group">
                    <label>Livello</label>
                    <select id="teamLevel">
                        <option value="amatoriale">Amatoriale</option>
                        <option value="giovanile">Giovanile</option>
                        <option value="dilettanti">Dilettanti</option>
                        <option value="semi_pro">Semi-Pro</option>
                        <option value="professionista">Professionista</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Giorno partita</label>
                    <select id="matchDay">
                        <option value="sabato">Sabato</option>
                        <option value="domenica">Domenica</option>
                        <option value="altro">Altro</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Allenamenti squadra/settimana</label>
                    <select id="teamSessions">
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5+</option>
                    </select>
                </div>
            </div>
        `;
    }
    
    if (formData.sport === 'boxe') {
        html += `
            <div class="form-grid" style="margin-top: 1.5rem;">
                <div class="form-group">
                    <label>Guardia</label>
                    <select id="stance">
                        <option value="ortodossa">Ortodossa</option>
                        <option value="southpaw">Southpaw</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Stile</label>
                    <select id="boxingStyle">
                        <option value="aggressivo">Aggressivo</option>
                        <option value="contrattaccante">Contrattaccante</option>
                        <option value="tecnico">Tecnico</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Palestra</label>
                    <input type="text" id="gymName" placeholder="Nome palestra">
                </div>
                <div class="form-group">
                    <label>Prossimo match (se previsto)</label>
                    <input type="date" id="nextFight">
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // Setup role card clicks
    container.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', () => {
            container.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            formData.role = card.dataset.role;
            loadGoals(); // Preload goals when role selected
        });
    });
}

async function loadGoals() {
    const container = document.getElementById('goalsContainer');
    
    try {
        // Fetch goals from database
        const query = `?sport=eq.${formData.sport}${formData.role ? `&role=eq.${formData.role}` : ''}`;
        const goals = await supabase.fetch('role_specific_goals', query);
        
        if (goals.length === 0) {
            // Fallback generic goals
            container.innerHTML = '<p style="color:#888">Obiettivi in caricamento...</p>';
            return;
        }
        
        let html = '';
        goals.forEach(goal => {
            html += `
                <div class="goal-card" data-goal="${goal.id}">
                    <h4>${goal.goal_name}</h4>
                    <p>${goal.goal_description || ''}</p>
                </div>
            `;
        });
        container.innerHTML = html;
        
        // Setup goal selection (max 3)
        container.querySelectorAll('.goal-card').forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('selected')) {
                    card.classList.remove('selected');
                    formData.goals = formData.goals.filter(g => g !== card.dataset.goal);
                } else if (formData.goals.length < 3) {
                    card.classList.add('selected');
                    formData.goals.push(card.dataset.goal);
                } else {
                    alert('Puoi selezionare massimo 3 obiettivi');
                }
            });
        });
    } catch (error) {
        console.error('Error loading goals:', error);
    }
}

function loadSummary() {
    const getValue = id => document.getElementById(id)?.value || '';
    
    const sportNames = { calcio: 'Calcio', basket: 'Basket', boxe: 'Boxe', palestra: 'Palestra' };
    const packageNames = { tecnica: 'Tecnica', performance: 'Performance', completo: 'Completo' };
    
    document.getElementById('summaryContent').innerHTML = `
        <div class="summary-row">
            <span class="summary-label">Nome</span>
            <span class="summary-value">${getValue('firstName')} ${getValue('lastName')}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Sport</span>
            <span class="summary-value">${sportNames[formData.sport]}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Ruolo</span>
            <span class="summary-value">${formData.role || '-'}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Pacchetto</span>
            <span class="summary-value">${packageNames[formData.package]}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Obiettivi</span>
            <span class="summary-value">${formData.goals.length} selezionati</span>
        </div>
    `;
}

async function submitForm() {
    const getValue = id => document.getElementById(id)?.value || null;

    const toIntOrNull = (v) => {
        const n = parseInt(v, 10);
        return Number.isFinite(n) ? n : null;
    };

    const toFloatOrNull = (v) => {
        const n = parseFloat(v);
        return Number.isFinite(n) ? n : null;
    };

    const normalizeGender = (v) => {
        const s = (v ?? '').toString().trim().toLowerCase();
        if (s === 'male' || s === 'm' || s === 'maschio') return 'male';
        if (s === 'female' || s === 'f' || s === 'femmina') return 'female';
        if (s) return 'other';
        return null;
    };

    const normalizeExperience = (v) => {
        const s = (v ?? '').toString().trim().toLowerCase();
        if (!s) return null;
        if (s === 'esperto') return 'elite';
        return s;
    };
    
    // Collect schedule
    document.querySelectorAll('.day-activity').forEach(select => {
        formData.schedule[select.dataset.day] = select.value;
    });
    
    try {
        // 1. Create athlete
        const athleteData = {
            email: getValue('email'),
            first_name: getValue('firstName'),
            last_name: getValue('lastName'),
            birth_date: getValue('birthDate'),
            gender: normalizeGender(getValue('gender')),
            phone: getValue('phone'),
            height_cm: toIntOrNull(getValue('height')),
            weight_kg: toFloatOrNull(getValue('weight')),
            sport: formData.sport,
            package_type: formData.package,
            experience_level: normalizeExperience(getValue('experience')),
            status: 'active'
        };
        
        const [athlete] = await supabase.insert('athletes', athleteData);
        const athleteId = athlete.id;
        
        // 2. Create sport-specific data
        let sportData = { athlete_id: athleteId };
        
        if (formData.sport === 'calcio') {
            sportData.football_role = formData.role;
            sportData.football_team_name = getValue('teamName');
            sportData.football_team_level = getValue('teamLevel');
            sportData.football_match_day = getValue('matchDay');
            sportData.football_weekly_team_sessions = toIntOrNull(getValue('teamSessions'));
        } else if (formData.sport === 'basket') {
            sportData.basket_role = formData.role;
            sportData.basket_team_name = getValue('teamName');
            sportData.basket_team_level = getValue('teamLevel');
            sportData.basket_match_day = getValue('matchDay');
            sportData.basket_weekly_team_sessions = toIntOrNull(getValue('teamSessions'));
        } else if (formData.sport === 'boxe') {
            sportData.boxing_weight_class = formData.role;
            sportData.boxing_stance = getValue('stance');
            sportData.boxing_style = getValue('boxingStyle');
            sportData.boxing_gym_name = getValue('gymName');
        } else if (formData.sport === 'palestra') {
            sportData.gym_primary_goal = formData.role;
        }
        
        await supabase.insert('sport_specific_data', sportData);
        
        // 3. Create weekly schedule
        const scheduleData = {
            athlete_id: athleteId,
            monday: formData.schedule.monday,
            tuesday: formData.schedule.tuesday,
            wednesday: formData.schedule.wednesday,
            thursday: formData.schedule.thursday,
            friday: formData.schedule.friday,
            saturday: formData.schedule.saturday,
            sunday: formData.schedule.sunday,
            max_gr_sessions_per_week: toIntOrNull(getValue('maxSessions'))
        };
        
        await supabase.insert('weekly_schedule', scheduleData);
        
        // 4. Save athlete goals
        for (let goalId of formData.goals) {
            await supabase.insert('athlete_goals', {
                athlete_id: athleteId,
                goal_id: goalId,
                priority: formData.goals.indexOf(goalId) + 1
            });
        }
        
        // 5. Save injuries if any
        const injuries = getValue('injuries');
        if (injuries) {
            await supabase.insert('injuries_conditions', {
                athlete_id: athleteId,
                injury_type: 'note',
                notes: injuries,
                status: 'noted'
            });
        }
        
        // Success!
        alert('Anamnesi completata! Benvenuto in GR Perform 🎉');
        window.location.href = `athlete-dashboard.html?id=${athleteId}`;
        
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Errore nel salvataggio. Riprova.');
    }
}
