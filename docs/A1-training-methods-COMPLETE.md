# 🎯 GR Perform - Pilastro A1: Training Methods
## Status: 10/10 ✅

---

## 📋 Cosa è stato implementato

### 1. Catalogo Metodologie Base (`training-methods.js`)
- **30+ metodologie** generali e sport-specifiche
- Ogni metodologia ha:
  - Nome e descrizione
  - Esempio pratico
  - Fase ideale (accumulo/intensificazione/peaking/deload)
  - Obiettivi compatibili (massa/forza/definizione)
  - Limite max per workout
  - Controindicazioni

### 2. Metodologie Sport-Specifiche
- **Calcio (5)**: RSA, COD, Nordic Hamstring, Copenhagen Adductor, FIFA 11+
- **Basket (3)**: Vertical Jump, Defensive Slides, Fast Break Conditioning
- **Boxe (5)**: Boxing Circuit, Heavy Bag, Shadow Boxing, Neck Strengthening, Punch Resistance
- **Palestra (6)**: GVT, Progressive Overload, RPE, BFR, DUP, Mind-Muscle Connection

### 3. Sistema di Scoring Intelligente (`MethodSelector`)
- Prioritizza metodologie in base a:
  - Goal dell'atleta
  - Fase del mesociclo
  - Sport praticato (+50 punti per sport match)
  - Livello di esperienza
  - Fatica corrente
  - Zone doloranti

---

## 🚀 Nuove Funzionalità Avanzate (`training-methods-advanced.js`)

### 4. Progressioni Settimanali
Ogni metodologia ha parametri che progrediscono settimana per settimana:

```javascript
drop_set: {
    week_1: { exercises: 1, drops: 2, notes: "Introduzione" },
    week_2: { exercises: 1, drops: 2, notes: "Consolida" },
    week_3: { exercises: 2, drops: 3, notes: "Progressione" },
    week_4: { exercises: 1, drops: 2, notes: "Deload" }
}
```

### 5. Regole di Incompatibilità
L'AI sa quali metodologie NON combinare:
- ❌ Drop Set + GVT (troppo stress metabolico)
- ❌ Rest Pause + Myo Reps (entrambi a cedimento)
- ❌ Tabata + RSA (due HIIT nella stessa sessione)
- ❌ Cluster Set + metodi metabolici (PAP richiede SNC fresco)

### 6. Sequenza Ottimale
Ordine corretto nella sessione:
1. **Contrast Training** - SNC freschissimo
2. **Cluster Set** - Carichi alti
3. **Progressive Overload / Main Lift**
4. **Superset / Rest Pause**
5. **Drop Set / Myo Reps** - Fine esercizio
6. **Tri-Set / Giant Set**
7. **Circuit / EMOM** - Conditioning
8. **Tabata / AMRAP** - Finisher

### 7. Adattamenti per Ruolo Sportivo

#### Calcio ⚽
| Ruolo | Priorità | Evita |
|-------|----------|-------|
| Portiere | Contrast, Vertical Jump, COD | GVT, RSA |
| Terzino | RSA, COD, Circuit | GVT, Cluster |
| Centrocampista | RSA, Circuit, EMOM | Contrast |
| Attaccante | Contrast, Cluster, Jump | Circuit, AMRAP |

#### Basket 🏀
| Ruolo | Priorità | Evita |
|-------|----------|-------|
| Playmaker | COD, Defensive Slides, EMOM | GVT |
| Centro | Cluster, Rest Pause, Eccentric | RSA, Tabata |
| Ala | Vertical Jump, Contrast, Fast Break | - |

#### Boxe 🥊
| Stile | Priorità | Evita |
|-------|----------|-------|
| Peso Leggero | Boxing Circuit, Heavy Bag, EMOM | GVT, Cluster |
| Peso Massimo | Punch Resistance, Cluster, Contrast | Tabata, AMRAP |
| Tecnico | Shadow Boxing, Tempo Training | Cluster |
| Pressure Fighter | Boxing Circuit, Heavy Bag, RSA | Cluster |

#### Palestra 🏋️
| Obiettivo | Priorità | Evita |
|-----------|----------|-------|
| Bodybuilding | Drop Set, Superset, Myo Reps, GVT | Cluster |
| Powerlifting | Cluster, Progressive Overload, RPE | GVT, Circuit |
| Dimagrimento | Circuit, Tabata, EMOM, Superset | Cluster |

### 8. Periodizzazione Mesociclo
Piani predefiniti per 4 e 8 settimane:

**Standard 4 Week (Palestra)**
- Week 1: Adattamento → Superset, Tempo
- Week 2: Accumulo → Drop Set, Myo Reps
- Week 3: Intensificazione → Rest Pause, Cluster
- Week 4: Deload → Superset leggero

**Sport 8 Week (Pre-season)**
- Week 1-2: GPP → Circuit, EMOM
- Week 3-4: Forza → Progressive Overload, Nordic
- Week 5-6: Potenza → Contrast, Jump Training
- Week 7-8: Specifico → RSA, COD

**Boxing Fight Camp**
- Week 1-2: Base Building
- Week 3-4: Strength → Punch Resistance
- Week 5-6: Fight Simulation → Heavy Bag, Tabata
- Week 7-8: Sharpening → Shadow Boxing

### 9. Sistema di Validazione
Controlla automaticamente:
- ✅ Incompatibilità tra metodologie
- ✅ Coerenza con livello fatica
- ✅ Preferenze ruolo
- ✅ Volume esercizi (6-8 ideale)
- ✅ Struttura workout (warm-up, main, finisher)

### 10. Integrazione nei Prompt AI
Tutto il sistema è integrato in `coach-generate.html`:
- `trainingMethodsText` → metodologie base
- `advancedMethodsText` → regole avanzate, progressioni, ruolo

---

## 📊 Checklist Finale A1

| Feature | Status |
|---------|--------|
| Catalogo metodologie generali | ✅ |
| Metodologie sport-specifiche | ✅ |
| Sistema scoring intelligente | ✅ |
| Progressioni settimanali | ✅ |
| Regole incompatibilità | ✅ |
| Sequenza ottimale | ✅ |
| Adattamenti per ruolo | ✅ |
| Periodizzazione mesociclo | ✅ |
| Validazione workout | ✅ |
| Integrazione AI prompts | ✅ |

---

## 🎉 Rating: 10/10

Il pilastro A1 è completo. L'AI ora può:
1. Scegliere le metodologie giuste per sport/ruolo/fase
2. Progredirle settimana per settimana
3. Evitare combinazioni pericolose
4. Ordinarle correttamente nella sessione
5. Validare i workout generati
