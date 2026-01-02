# 🏛️ ATLAS v2.0 NASA-Level - Sommario Implementazione

## Data: 29 Dicembre 2025

---

## 📊 SISTEMA IBRIDO PERIODIZZAZIONE

### Filosofia
**MACRO-TEMPLATE + MICRO-ADATTAMENTO**
- Il Macro-Planner definisce le **FASI** (non gli esercizi specifici) per 12 settimane
- Il Week-Generator crea workout **adattivi** basati su fase + feedback atleta
- L'Auto-Adjuster **sposta fasi** quando necessario (malattia, plateau, overtraining)

---

## ✅ FASE 1: CORREZIONI SCIENTIFICHE

### 1. CNS Recovery Model Separato
**File:** `atlas-recovery.js`
- CNS e muscoli ora tracciati **separatamente**
- `cnsRecoveryModel.exerciseImpact` con rating per esercizio (deadlift: 1.8, squat: 1.5, etc.)
- `calculateCNSRecovery(workout)` restituisce load, recoveryHours, status, recommendation

### 2. Muscle-Specific Recovery Windows
**File:** `atlas-recovery.js`
- `muscleSpecificRecovery` con tempi per intensità (light/moderate/heavy/maximal)
- Quadricipiti: 48-120h a seconda dell'intensità
- Hamstrings: 48-96h
- Core: 24-48h (recupero rapido)

### 3. Lengthened Position Database
**File:** `atlas-science.js`
- `lengthendPositionDB` completo per tutti i muscoli
- Ogni muscolo ha: optimal exercises, technique, hypertrophy_score
- `suggestLengthenedExercises(workout)` suggerisce esercizi mancanti
- Basato su: Schoenfeld 2024, Pedrosa 2024, Milo Wolf 2024

### 4. Nuove Metodologie Avanzate
**File:** `training-methods.js`

| Metodologia | Descrizione | Riferimenti |
|-------------|-------------|-------------|
| **Eccentric Overload** | Flywheel, partner assist, weight releasers, 2-up/1-down | Maroto-Izquierdo 2024, Tesch 2017 |
| **VBT (Velocity Based Training)** | Velocity zones, velocity stops, daily readiness | Mann 2016, Banyard 2019 |
| **Lengthened Partials** | Full lengthened ROM, stretch pause, loaded stretch | Pedrosa 2024 |
| **Blood Flow Restriction** | KAATSU, 30-15-15-15 protocol | Loenneke 2022 |
| **Advanced Cluster Sets** | Power/strength/hypertrophy clusters | Tufano 2017 |

---

## ✅ FASE 2: SISTEMA IBRIDO PERIODIZZAZIONE

### 5. Macro-Planner 12 Settimane
**File:** `atlas-macro-planner.js`

Templates disponibili:
- **Ipertrofia**: Accumulo → Intensificazione → Overreaching → Deload
- **Forza Massimale**: Base → Costruzione → Peak → Realizzazione → Deload
- **Definizione**: Metabolic → Strength Maintenance → Peak Definition → Refeed
- **Performance Sportiva**: GPP → SPP → Pre-Competition → Taper
- **Principiante**: Apprendimento → Volume → Intensificazione → Consolidamento

Funzioni chiave:
- `selectMacroTemplate(athlete)` - seleziona template per obiettivo
- `getCurrentPhase(template, week)` - ottiene fase corrente
- `generateWeekParameters(template, week, feedback)` - parametri adattivi
- `generatePhasePrompt(params)` - prompt per AI

### 6. Progress Tracker
**File:** `atlas-progress-tracker.js`

- Storage in LocalStorage
- `initializeAthlete(id, template)` - crea profilo
- `recordWeeklyFeedback(id, data)` - feedback settimanale
- `recordWorkout(id, workout)` - registra workout
- `advanceWeek(id, template)` - avanza settimana
- `getProgressionTrend(id)` - analizza trend fatica/performance/volume
- `generateProgressPrompt(id)` - prompt per AI

### 7. Week Generator
**File:** `atlas-week-generator.js`

Strutture settimanali:
- Full Body 3x
- Upper/Lower 4x
- PPL 5x
- PPL 6x (Arnold)
- Strength 4x (Powerlifting)

Funzioni chiave:
- `generateWeek(params)` - genera struttura completa
- `selectWeekStructure(athlete, params)` - seleziona split
- `adaptForRecovery(structure, recovery, cns)` - adatta per recovery
- `assignMethods(structure, methods)` - assegna metodologie
- `generateWeekPrompt(plan)` - prompt per AI
- `generateSessionPrompt(session)` - prompt singola sessione

### 8. Auto-Adjuster
**File:** `atlas-auto-adjuster.js`

Soglie di allarme:
- **Overtraining**: fatica ≥8 per 2+ settimane, performance in calo, sonno scarso
- **Undertraining**: fatica ≤4 per 3+ settimane, nessuna progressione
- **Plateau**: stesso peso per 3+ settimane, motivazione stagnante
- **Ottimale**: 2+ settimane eccellenti, fatica 5-7

Decisioni automatiche:
- `SKIP_TO_DELOAD` - saltare al deload per overreaching
- `REDUCE_LOAD` - ridurre intensità/volume temporaneamente
- `INCREASE_STIMULUS` - aumentare per undertraining
- `CHANGE_STIMULUS` - cambiare metodologie per plateau
- `EXTEND_PHASE` - estendere fase se va bene
- `CONTINUE` - proseguire normalmente

Eventi speciali gestiti:
- Malattia
- Vacanza
- Infortunio
- Periodo stress alto
- Competizione (taper protocol)
- Plateau break (shock week)

---

## ✅ FASE 3: STRUCTURAL BALANCE

### 9. Structural Balance Assessment
**File:** `atlas-structural-balance.js`

Basato su Poliquin Structural Balance:

**Rapporti critici per prevenzione infortuni:**
- Hamstring:Quad (ideale 0.6) - prevenzione ACL
- Pull:Push (ideale 1.0) - salute spalle
- External:Internal rotation (ideale 0.75) - impingement
- Front:Back squat (ideale 0.85) - equilibrio catena

**Funzioni:**
- `analyzeBalance(athleteData)` - analisi completa
- `calculateInjuryPreventionRatios(lifts)` - rapporti critici
- `detectPlateau(history)` - rileva plateau
- `generatePriorityRecommendations(issues)` - raccomandazioni
- `generateBalancePrompt(analysis)` - prompt per AI
- `generateExerciseModifications(analysis)` - modifiche workout

---

## ✅ INTEGRAZIONE

### 10. Atlas Core v2.0
**File:** `atlas-core.js` (aggiornato)

Nuovi metodi v2.0:
```javascript
ATLAS.initializeAthlete(profile)     // Inizializza atleta
ATLAS.generateWorkoutV2(athleteId)   // Genera workout completo
ATLAS.recordWorkoutV2(id, data)      // Registra workout
ATLAS.recordWeeklyFeedbackV2(id)     // Registra feedback
ATLAS.advanceWeekV2(athleteId)       // Avanza settimana
ATLAS.handleEventV2(id, event)       // Gestisce eventi
ATLAS.getAthleteReportV2(id)         // Report completo
ATLAS.analyzeStructuralBalance(lifts) // Analisi equilibrio
```

---

## 📁 NUOVI FILE CREATI

| File | Dimensione | Descrizione |
|------|------------|-------------|
| `atlas-macro-planner.js` | ~700 righe | Template 12 settimane |
| `atlas-progress-tracker.js` | ~600 righe | Tracciamento progressi |
| `atlas-week-generator.js` | ~550 righe | Generazione settimanale |
| `atlas-auto-adjuster.js` | ~650 righe | Adattamento automatico |
| `atlas-structural-balance.js` | ~700 righe | Equilibrio strutturale |

---

## 📁 FILE MODIFICATI

| File | Modifiche |
|------|-----------|
| `atlas-recovery.js` | +CNS model, +muscle-specific recovery |
| `atlas-science.js` | +lengthendPositionDB, +suggestLengthenedExercises |
| `training-methods.js` | +5 metodologie avanzate |
| `atlas-core.js` | +metodi v2.0, +integrazione moduli |
| `coach-atlas.html` | +script v2.0 |
| `coach-generate.html` | +script v2.0 |
| `app-dashboard.html` | +script v2.0 |

---

## 🎯 COME USARE IL SISTEMA

### Flusso completo:

```javascript
// 1. Inizializza atleta
const init = ATLAS.initializeAthlete({
    id: 'atleta_123',
    name: 'Mario Rossi',
    goal: 'ipertrofia',
    experience: 'intermediate',
    available_days: 4
});

// 2. Genera workout con tutti i vincoli scientifici
const workout = ATLAS.generateWorkoutV2('atleta_123', {
    athleteProfile: { experience: 'intermediate' },
    time_available: 60
});

// 3. Usa il prompt generato per l'AI
console.log(workout.full_prompt);

// 4. Dopo il workout, registra feedback
ATLAS.recordWorkoutV2('atleta_123', {
    type: 'strength',
    duration: 65,
    avg_rpe: 7.5,
    quality: 'good',
    prs: [{ exercise: 'squat', weight: 120 }]
});

// 5. A fine settimana, registra feedback settimanale
ATLAS.recordWeeklyFeedbackV2('atleta_123', {
    fatigue: 6,
    motivation: 8,
    performance: 'improving',
    sleep_hours: 7.5,
    sleep_quality: 'good'
});

// 6. Avanza alla settimana successiva (auto-checks inclusi)
const advance = ATLAS.advanceWeekV2('atleta_123');
// Se overtraining → salta automaticamente al deload
// Se tutto ok → avanza normalmente

// 7. Gestisci eventi speciali
ATLAS.handleEventV2('atleta_123', {
    type: 'illness',
    days: 5
});
```

---

## 📚 RIFERIMENTI SCIENTIFICI

- Schoenfeld 2024: Lengthened training, muscle hypertrophy
- Pedrosa 2024: Lengthened partials
- Milo Wolf 2024: ROM research
- Kiely 2024: Flexible Periodization
- Issurin 2016: Block Periodization
- Maroto-Izquierdo 2024: Eccentric overload
- Tesch 2017: Flywheel training
- Mann 2016: Velocity Based Training
- Banyard 2019: VBT autoregulation
- Loenneke 2022: Blood Flow Restriction
- Poliquin: Structural Balance
- Helms 2019: Scientific Principles of Hypertrophy Training

---

**ATLAS v2.0 NASA-Level - Sistema Completamente Autonomo**
*"L'obiettivo finale: superare un essere umano"*
