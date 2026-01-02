/**
 * ATLAS PDF Export Module
 * Esporta workout in formato PDF stampabile
 * @version 1.0.0
 */

const ATLASPDFExport = (() => {
    'use strict';

    // Utility per formattare data
    function formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('it-IT', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    }

    // Genera HTML per PDF
    function generatePDFHTML(workout, athlete) {
        const athleteName = athlete ? `${athlete.first_name} ${athlete.last_name}` : 'Atleta';
        const date = formatDate(workout.date || new Date());
        
        // Parse exercises
        let exercises = [];
        if (workout.exercises) {
            exercises = typeof workout.exercises === 'string' 
                ? JSON.parse(workout.exercises) 
                : workout.exercises;
        }

        // HTML Template
        return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Workout - ${athleteName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4; margin: 20mm; }
        
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #1a1a1a;
            background: white;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #E63946;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .logo {
            font-size: 24pt;
            font-weight: 900;
            color: #E63946;
            letter-spacing: -1px;
        }
        
        .logo span {
            color: #1a1a1a;
        }
        
        .workout-info {
            text-align: right;
        }
        
        .athlete-name {
            font-size: 16pt;
            font-weight: 700;
            margin-bottom: 4px;
        }
        
        .workout-date {
            font-size: 10pt;
            color: #666;
        }
        
        .workout-title {
            font-size: 18pt;
            font-weight: 800;
            margin-bottom: 8px;
            color: #1a1a1a;
        }
        
        .workout-type {
            display: inline-block;
            background: #E63946;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 9pt;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section-title {
            font-size: 10pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #E63946;
            margin-bottom: 12px;
            border-bottom: 1px solid #eee;
            padding-bottom: 6px;
        }
        
        .exercise-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .exercise-table th {
            background: #f5f5f5;
            padding: 10px 12px;
            text-align: left;
            font-size: 9pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666;
            border-bottom: 2px solid #ddd;
        }
        
        .exercise-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
            vertical-align: top;
        }
        
        .exercise-name {
            font-weight: 600;
            font-size: 11pt;
        }
        
        .exercise-muscle {
            font-size: 9pt;
            color: #888;
            margin-top: 2px;
        }
        
        .sets-reps {
            font-weight: 600;
            font-size: 12pt;
        }
        
        .exercise-notes {
            font-size: 9pt;
            color: #666;
            font-style: italic;
        }
        
        .checkbox-cell {
            width: 30px;
            text-align: center;
        }
        
        .checkbox {
            width: 18px;
            height: 18px;
            border: 2px solid #ccc;
            border-radius: 4px;
            display: inline-block;
        }
        
        .notes-section {
            background: #f9f9f9;
            border-left: 4px solid #E63946;
            padding: 16px 20px;
            margin-top: 20px;
        }
        
        .notes-title {
            font-weight: 700;
            font-size: 10pt;
            margin-bottom: 8px;
        }
        
        .notes-content {
            font-size: 10pt;
            color: #555;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            font-size: 9pt;
            color: #999;
        }
        
        .metrics-row {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .metric-box {
            flex: 1;
            background: #f9f9f9;
            padding: 12px 16px;
            border-radius: 8px;
            text-align: center;
        }
        
        .metric-value {
            font-size: 20pt;
            font-weight: 800;
            color: #E63946;
        }
        
        .metric-label {
            font-size: 8pt;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888;
            margin-top: 4px;
        }
        
        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">GR<span>Perform</span></div>
        <div class="workout-info">
            <div class="athlete-name">${athleteName}</div>
            <div class="workout-date">${date}</div>
        </div>
    </div>
    
    <div class="workout-title">${workout.title || workout.name || 'Allenamento'}</div>
    <div class="workout-type">${workout.type || workout.workout_type || 'Generale'}</div>
    
    <div class="metrics-row">
        <div class="metric-box">
            <div class="metric-value">${exercises.length}</div>
            <div class="metric-label">Esercizi</div>
        </div>
        <div class="metric-box">
            <div class="metric-value">${calculateTotalSets(exercises)}</div>
            <div class="metric-label">Serie Totali</div>
        </div>
        <div class="metric-box">
            <div class="metric-value">${workout.duration || estimateDuration(exercises)}′</div>
            <div class="metric-label">Durata Est.</div>
        </div>
        <div class="metric-box">
            <div class="metric-value">${workout.intensity || 'Med'}</div>
            <div class="metric-label">Intensità</div>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">Programma Allenamento</div>
        <table class="exercise-table">
            <thead>
                <tr>
                    <th class="checkbox-cell">✓</th>
                    <th>Esercizio</th>
                    <th style="width:100px;">Serie × Rep</th>
                    <th style="width:80px;">Carico</th>
                    <th style="width:60px;">Rec</th>
                    <th style="width:140px;">Note</th>
                </tr>
            </thead>
            <tbody>
                ${generateExerciseRows(exercises)}
            </tbody>
        </table>
    </div>
    
    ${workout.notes ? `
    <div class="notes-section">
        <div class="notes-title">📝 Note del Coach</div>
        <div class="notes-content">${workout.notes}</div>
    </div>
    ` : ''}
    
    <div class="footer">
        <div>Generato con ATLAS AI • GR Perform</div>
        <div>Workout ID: ${workout.id || 'N/A'}</div>
    </div>
</body>
</html>
        `;
    }

    function generateExerciseRows(exercises) {
        if (!exercises || exercises.length === 0) {
            return '<tr><td colspan="6" style="text-align:center;color:#999;padding:40px;">Nessun esercizio</td></tr>';
        }

        return exercises.map((ex, idx) => {
            const name = ex.name || ex.exercise_name || `Esercizio ${idx + 1}`;
            const sets = ex.sets || ex.series || 3;
            const reps = ex.reps || ex.repetitions || '10';
            const weight = ex.weight || ex.load || '-';
            const rest = ex.rest || ex.recovery || '60s';
            const notes = ex.notes || ex.technique || '';
            const muscle = ex.muscle || ex.target_muscle || '';

            return `
                <tr>
                    <td class="checkbox-cell"><div class="checkbox"></div></td>
                    <td>
                        <div class="exercise-name">${name}</div>
                        ${muscle ? `<div class="exercise-muscle">${muscle}</div>` : ''}
                    </td>
                    <td class="sets-reps">${sets} × ${reps}</td>
                    <td>${weight}${typeof weight === 'number' ? 'kg' : ''}</td>
                    <td>${rest}</td>
                    <td class="exercise-notes">${notes}</td>
                </tr>
            `;
        }).join('');
    }

    function calculateTotalSets(exercises) {
        if (!exercises || !Array.isArray(exercises)) return 0;
        return exercises.reduce((total, ex) => total + (parseInt(ex.sets || ex.series) || 3), 0);
    }

    function estimateDuration(exercises) {
        if (!exercises || !Array.isArray(exercises)) return 45;
        // ~3 min per esercizio (incluso riposo)
        return Math.round(exercises.length * 3 + 10);
    }

    // Apri finestra di stampa
    function printWorkout(workout, athlete) {
        const html = generatePDFHTML(workout, athlete);
        const printWindow = window.open('', '_blank');
        
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            
            // Attendi caricamento e stampa
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                }, 300);
            };
        } else {
            alert('Blocco popup attivo. Abilita i popup per questa pagina.');
        }
    }

    // Scarica come HTML (può essere convertito in PDF dal browser)
    function downloadHTML(workout, athlete) {
        const html = generatePDFHTML(workout, athlete);
        const athleteName = athlete ? `${athlete.first_name}_${athlete.last_name}` : 'workout';
        const date = new Date().toISOString().split('T')[0];
        const filename = `workout_${athleteName}_${date}.html`;
        
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📄 Workout esportato:', filename);
    }

    // Export pubblico
    return {
        print: printWorkout,
        download: downloadHTML,
        generateHTML: generatePDFHTML,
        VERSION: '1.0.0'
    };
})();

// Export globale
if (typeof window !== 'undefined') {
    window.ATLASPDFExport = ATLASPDFExport;
}

console.log('📄 ATLAS PDF Export v1.0.0 loaded');
