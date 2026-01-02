# Coach Quality Rubric (human benchmark)

Obiettivo: definire *come lavorerebbe un coach umano* per gli sport attuali (boxe/calcio/basket/palestra) e trasformare questa logica in:
- **rubric** (criteri misurabili)
- **guardrail automatici** (issues/suggestions)
- **benchmark ripetibile** (stessa input → qualità stabile)

## Dimensioni di qualità (scoring)
1. **Struttura sessione**: warm-up → main → accessori → conditioning → cooldown.
2. **Specificità sport**: esercizi e lavori davvero trasferibili (non genericissimi).
3. **Coerenza fase** (adattamento/accumulo/intensificazione/deload): volume/intensità/densità coerenti.
4. **Gestione fatica & recupero**: rest realistici, durata sensata, volume compatibile con readiness.
5. **Sicurezza / injury risk**: prehab minimo, evita pattern noti di overuse per sport.
6. **Varietà**: niente ripetizioni inutili intra-settimana, pattern coverage.
7. **Chiarezza prescrizione**: sets/reps/rest/type coerenti e interpretazione non ambigua.

## Standard minimi per sport (MUST-HAVE)
### Boxe
- 1+ blocco boxing-specific (bag/shadow/pads/defense/footwork)
- Round-based chiaro (es. 6x3min) con rest realistico
- Prehab spalle/polsi/collo/scapole (micro-dose)

### Calcio
- 1+ componente speed/COD
- 1+ hamstring/groin prevention (Nordic / adductor)
- 1+ lower body power nel microciclo

### Basket
- 1+ jump/landing o power
- 1+ lateral movement/COD
- 1+ micro-dose caviglia/landing/core

### Palestra
- Main lift presente e chiaro
- Split e ordine logico
- Varietà pattern (push/pull/squat/hinge/core)

## Come “superare” i coach umani (non solo imitarli)
- **Affidabilità**: output strutturato e consistente, sempre parseable, sempre coerente con vincoli.
- **Personalizzazione scalabile**: integra telemetria/feedback in modo deterministico (no drift).
- **Controlli automatici**: score + issues guidano un loop di correzione, riducendo errori banali.
- **Tracciabilità**: log delle decisioni (perché volume X, perché deload, perché evitare esercizio Y).

## Implementazione
- Playbook prompt: [js/coach-playbook.js](../js/coach-playbook.js)
- Scoring engine: [js/coach-quality-engine.js](../js/coach-quality-engine.js)
