/**
 * ATLAS Calendar View Module
 * Visualizzazione calendario mensile dei workout
 * @version 1.0.0
 */

const ATLASCalendar = (() => {
    'use strict';

    const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
                       'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    const DAYS_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

    let currentDate = new Date();
    let workouts = [];
    let onSelectCallback = null;

    /**
     * Inizializza il calendario
     */
    function init(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        workouts = options.workouts || [];
        onSelectCallback = options.onSelect || null;

        render(container);
    }

    /**
     * Aggiorna i workout
     */
    function setWorkouts(newWorkouts) {
        workouts = newWorkouts || [];
    }

    /**
     * Render calendario
     */
    function render(container) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const html = `
            <div class="atlas-calendar">
                <div class="calendar-header">
                    <button class="calendar-nav" onclick="ATLASCalendar.prevMonth()">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="calendar-title">
                        <span class="calendar-month">${MONTHS_IT[month]}</span>
                        <span class="calendar-year">${year}</span>
                    </div>
                    <button class="calendar-nav" onclick="ATLASCalendar.nextMonth()">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="calendar-days-header">
                    ${DAYS_IT.map(d => `<div class="calendar-day-name">${d}</div>`).join('')}
                </div>
                <div class="calendar-grid">
                    ${generateDays(year, month)}
                </div>
                <div class="calendar-legend">
                    <div class="legend-item"><span class="legend-dot completed"></span> Completato</div>
                    <div class="legend-item"><span class="legend-dot assigned"></span> Assegnato</div>
                    <div class="legend-item"><span class="legend-dot rest"></span> Riposo</div>
                </div>
            </div>
            <style>
                .atlas-calendar {
                    background: var(--gray-900, #0A0A0A);
                    border: 1px solid var(--gray-700, #1A1A1A);
                    border-radius: 16px;
                    padding: 20px;
                    font-family: 'Inter', sans-serif;
                }
                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .calendar-nav {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: var(--gray-700, #1A1A1A);
                    border: none;
                    color: var(--white, #FFF);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .calendar-nav:hover {
                    background: var(--red, #E63946);
                }
                .calendar-title {
                    text-align: center;
                }
                .calendar-month {
                    font-size: 18px;
                    font-weight: 700;
                }
                .calendar-year {
                    font-size: 14px;
                    color: var(--gray-500, #666);
                    margin-left: 8px;
                }
                .calendar-days-header {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 4px;
                    margin-bottom: 8px;
                }
                .calendar-day-name {
                    text-align: center;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: var(--gray-500, #666);
                    padding: 8px 0;
                }
                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 4px;
                }
                .calendar-day {
                    aspect-ratio: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                    background: var(--gray-800, #111);
                    min-height: 50px;
                }
                .calendar-day:hover {
                    background: var(--gray-700, #1A1A1A);
                }
                .calendar-day.today {
                    border: 2px solid var(--red, #E63946);
                }
                .calendar-day.other-month {
                    opacity: 0.3;
                }
                .calendar-day.has-workout {
                    background: rgba(230, 57, 70, 0.15);
                }
                .calendar-day.has-workout.completed {
                    background: rgba(34, 197, 94, 0.15);
                }
                .calendar-day.rest-day {
                    background: rgba(59, 130, 246, 0.1);
                }
                .day-number {
                    font-size: 14px;
                    font-weight: 600;
                }
                .day-indicator {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    margin-top: 4px;
                }
                .day-indicator.completed { background: #22c55e; }
                .day-indicator.assigned { background: #E63946; }
                .day-indicator.rest { background: #3b82f6; }
                .calendar-legend {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid var(--gray-700, #1A1A1A);
                }
                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11px;
                    color: var(--gray-400, #888);
                }
                .legend-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }
                .legend-dot.completed { background: #22c55e; }
                .legend-dot.assigned { background: #E63946; }
                .legend-dot.rest { background: #3b82f6; }
                
                @media (max-width: 600px) {
                    .calendar-day { min-height: 40px; }
                    .day-number { font-size: 12px; }
                }
            </style>
        `;

        container.innerHTML = html;
    }

    /**
     * Genera i giorni del mese
     */
    function generateDays(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = (firstDay.getDay() + 6) % 7; // Lun = 0
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let days = [];

        // Giorni del mese precedente
        const prevMonth = new Date(year, month, 0);
        for (let i = startDay - 1; i >= 0; i--) {
            const day = prevMonth.getDate() - i;
            days.push(createDayHTML(day, true, null, false));
        }

        // Giorni del mese corrente
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const isToday = date.getTime() === today.getTime();
            const workout = findWorkout(date);
            days.push(createDayHTML(day, false, workout, isToday, date));
        }

        // Giorni del mese successivo
        const remaining = 42 - days.length;
        for (let day = 1; day <= remaining; day++) {
            days.push(createDayHTML(day, true, null, false));
        }

        return days.join('');
    }

    /**
     * Crea HTML per un giorno
     */
    function createDayHTML(day, otherMonth, workout, isToday, date) {
        let classes = ['calendar-day'];
        let indicatorClass = '';

        if (otherMonth) classes.push('other-month');
        if (isToday) classes.push('today');

        if (workout) {
            classes.push('has-workout');
            if (workout.status === 'completed' || workout.completed_at) {
                classes.push('completed');
                indicatorClass = 'completed';
            } else {
                indicatorClass = 'assigned';
            }
        } else if (!otherMonth && date) {
            // Check if rest day (domenica = 0)
            if (date.getDay() === 0) {
                classes.push('rest-day');
                indicatorClass = 'rest';
            }
        }

        const dateStr = date ? date.toISOString().split('T')[0] : '';
        const onclick = date && !otherMonth ? `ATLASCalendar.selectDay('${dateStr}')` : '';

        return `
            <div class="${classes.join(' ')}" onclick="${onclick}">
                <span class="day-number">${day}</span>
                ${indicatorClass ? `<div class="day-indicator ${indicatorClass}"></div>` : ''}
            </div>
        `;
    }

    /**
     * Trova workout per data
     */
    function findWorkout(date) {
        const dateStr = date.toISOString().split('T')[0];
        return workouts.find(w => {
            const wDate = new Date(w.scheduled_for || w.created_at || w.date);
            return wDate.toISOString().split('T')[0] === dateStr;
        });
    }

    /**
     * Navigazione mese precedente
     */
    function prevMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        const container = document.querySelector('.atlas-calendar')?.parentElement;
        if (container) render(container);
    }

    /**
     * Navigazione mese successivo
     */
    function nextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        const container = document.querySelector('.atlas-calendar')?.parentElement;
        if (container) render(container);
    }

    /**
     * Seleziona un giorno
     */
    function selectDay(dateStr) {
        const workout = workouts.find(w => {
            const wDate = new Date(w.scheduled_for || w.created_at || w.date);
            return wDate.toISOString().split('T')[0] === dateStr;
        });

        if (onSelectCallback) {
            onSelectCallback(dateStr, workout);
        }

        // Highlight
        document.querySelectorAll('.calendar-day').forEach(el => el.style.boxShadow = '');
        event?.target?.closest('.calendar-day')?.style?.setProperty('box-shadow', '0 0 0 2px #E63946');
    }

    /**
     * Genera statistiche mensili
     */
    function getMonthStats() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const monthWorkouts = workouts.filter(w => {
            const wDate = new Date(w.scheduled_for || w.created_at || w.date);
            return wDate >= firstDay && wDate <= lastDay;
        });

        const completed = monthWorkouts.filter(w => w.status === 'completed' || w.completed_at);
        
        return {
            total: monthWorkouts.length,
            completed: completed.length,
            compliance: monthWorkouts.length > 0 
                ? Math.round((completed.length / monthWorkouts.length) * 100) 
                : 0
        };
    }

    // API Pubblica
    return {
        init,
        setWorkouts,
        prevMonth,
        nextMonth,
        selectDay,
        getMonthStats,
        refresh: () => {
            const container = document.querySelector('.atlas-calendar')?.parentElement;
            if (container) render(container);
        },
        VERSION: '1.0.0'
    };
})();

// Export globale
if (typeof window !== 'undefined') {
    window.ATLASCalendar = ATLASCalendar;
}

console.log('📅 ATLAS Calendar v1.0.0 loaded');
