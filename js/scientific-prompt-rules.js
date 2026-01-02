// ═══════════════════════════════════════════════════════════════════════════
// GR PERFORM - SCIENTIFIC PROMPT RULES
// Regole scientifiche da iniettare nei prompt AI per workout ottimali
// ═══════════════════════════════════════════════════════════════════════════

const ScientificPromptRules = {
    
    // ═══════════════════════════════════════════════════════════════════════
    // REGOLE UNIVERSALI (tutti gli sport)
    // ═══════════════════════════════════════════════════════════════════════
    
    universal: {
        sequence: `
SEQUENZA OBBLIGATORIA:
1. Warm-up (5-10 min): mobilità articolare + attivazione
2. Potenza/Esplosività (se presente): SEMPRE prima di tutto
3. Forza compound: squat, deadlift, bench, row
4. Isolamento/Accessori: dopo i compound
5. Conditioning/Core: alla fine
6. Cool-down: stretching statico`,

        biomechanics: `
EQUILIBRIO BIOMECCANICO OBBLIGATORIO:
- Push/Pull ratio: ~1:1 (per ogni push, un pull)
- Anteriore/Posteriore: 40-60% posteriore (previeni squilibri)
- Unilaterale: almeno 1-2 esercizi single-leg o single-arm
- Core: includi anti-rotazione + anti-estensione`,

        volume: `
VOLUME PER LIVELLO:
- Principiante: 12-16 sets totali
- Intermedio: 16-22 sets totali  
- Avanzato/Elite: 20-28 sets totali`
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // REGOLE CALCIO
    // ═══════════════════════════════════════════════════════════════════════
    
    calcio: `
🎯 REGOLE SCIENTIFICHE CALCIO:

PREVENZIONE INFORTUNI (OBBLIGATORIO):
- Nordic Curl o Leg Curl eccentrico: SEMPRE incluso (previene lesioni hamstring)
- Copenhagen Adductor: per adduttori
- Lavoro unilaterale: Bulgarian Split Squat, Single-Leg RDL, Step-up

POTENZA SPECIFICA:
- Pliometria: Box Jump, Broad Jump, Lateral Bounds
- Sprint mechanics: A-skip, High knees

CORE FUNZIONALE:
- Pallof Press (anti-rotazione)
- Dead Bug, Bird Dog (stabilità)

PER RUOLO:
- Portiere: reattività, tuffi, esplosività laterale
- Difensore: forza aerea, contrasti, decelerazione
- Centrocampista: resistenza, cambi direzione
- Attaccante: sprint, esplosività, agilità

MATCH DAY LOGIC:
- MD-1: Solo attivazione leggera, NO volume
- MD+1: Recovery, stretching, foam rolling`,

    // ═══════════════════════════════════════════════════════════════════════
    // REGOLE BASKET
    // ═══════════════════════════════════════════════════════════════════════
    
    basket: `
🏀 REGOLE SCIENTIFICHE BASKET:

SALTO VERTICALE (OBBLIGATORIO):
- Almeno 1 esercizio per vertical jump: Box Jump, Depth Jump, Jump Squat
- Pliometria specifica per rimbalzi e schiacciate

CAVIGLIE E PREVENZIONE:
- Lavoro propriocettivo caviglie
- Calf raises (eccentrico)
- Prevenzione ACL per atlete donne

MOVIMENTI LATERALI:
- Lateral Bounds, Carioca, Defensive Slides
- Cambi di direzione esplosivi

UPPER BODY:
- Forza spalle per tiro e contatto
- Core rotazionale per passaggi

PER RUOLO:
- Playmaker: agilità, visione, cambi direzione
- Guardia: tiro, penetrazione, lateralità
- Ala: versatilità, salto, resistenza
- Centro: forza post, rimbalzi, protezione`,

    // ═══════════════════════════════════════════════════════════════════════
    // REGOLE BOXE
    // ═══════════════════════════════════════════════════════════════════════
    
    boxe: `
🥊 REGOLE SCIENTIFICHE BOXE:

CORE ROTAZIONALE (OBBLIGATORIO):
- Russian Twist, Woodchop, Landmine Rotation
- La potenza del pugno viene dalla rotazione dell'anca!

COLLO E TRAPPEZI:
- Neck Curl, Neck Extension (previene KO)
- Shrugs per stabilità

SPALLE E RESISTENZA:
- Shoulder endurance: round lunghi di shadowboxing
- Rotator cuff work

CONDITIONING SPECIFICO:
- HIIT con rapporti 3:1 (simula round)
- Burpees, Battle Ropes, Medicine Ball Slams

GAMBE:
- Esplosività per footwork: Box Jump, Lateral Bounds
- Calf work per movimento sul ring

FIGHT WEEK:
- ⚡ Solo attivazione, ZERO volume
- Niente esercizi che causano DOMS
- Focus: mobilità, tecnica, peso`,

    // ═══════════════════════════════════════════════════════════════════════
    // REGOLE PALESTRA/FITNESS
    // ═══════════════════════════════════════════════════════════════════════
    
    palestra: `
🏋️ REGOLE SCIENTIFICHE PALESTRA:

COMPOUND FIRST:
- Inizia SEMPRE con multi-articolari pesanti
- Squat, Deadlift, Bench Press, Row, OHP

PER OBIETTIVO:
- Ipertrofia: 8-12 reps, 3-4 sets, 60-90s rest
- Forza: 3-6 reps, 4-5 sets, 2-3 min rest
- Dimagrimento: circuiti, HIIT, volume alto

SPLIT RACCOMANDATI:
- Full Body: 3x settimana (principianti)
- Upper/Lower: 4x settimana (intermedi)
- Push/Pull/Legs: 6x settimana (avanzati)

BILANCIAMENTO:
- Mai solo push: aggiungi row per ogni press
- Mai solo quadricipiti: aggiungi hamstring
- Core ogni sessione`,

    // ═══════════════════════════════════════════════════════════════════════
    // GENERATOR: Crea prompt completo per sport
    // ═══════════════════════════════════════════════════════════════════════
    
    generatePrompt(sport, profile = {}) {
        const sportRules = this[sport] || '';
        const level = profile.level || 'intermedio';
        const injuries = profile.injuries || [];
        const phase = profile.phase || 'accumulo';
        
        let prompt = `
═══════════════════════════════════════════════════════════════════════════
📋 REGOLE SCIENTIFICHE PER GENERAZIONE WORKOUT
═══════════════════════════════════════════════════════════════════════════

${this.universal.sequence}

${this.universal.biomechanics}

${this.universal.volume}

${sportRules}`;

        // Aggiungi regole fase
        if (phase === 'accumulo' || phase === 'hypertrophy') {
            prompt += `\n\n📅 FASE ACCUMULO: Volume alto, intensità moderata (65-75% 1RM)`;
        } else if (phase === 'intensificazione' || phase === 'strength') {
            prompt += `\n\n📅 FASE INTENSIFICAZIONE: Volume medio, intensità alta (80-90% 1RM)`;
        } else if (phase === 'peaking' || phase === 'realizzazione') {
            prompt += `\n\n📅 FASE PEAKING: Volume basso, qualità massima`;
        }
        
        // Aggiungi infortuni
        if (injuries.length > 0) {
            prompt += `\n\n⚠️ INFORTUNI - EVITA ASSOLUTAMENTE:`;
            injuries.forEach(inj => {
                const contraindicated = this.getContraindicated(inj);
                prompt += `\n- ${inj}: NO ${contraindicated.join(', ')}`;
            });
        }
        
        // Match day per sport di squadra
        if (profile.matchDayProximity) {
            if (profile.matchDayProximity === 'MD-1') {
                prompt += `\n\n🚨 DOMANI PARTITA: Solo attivazione leggera, 8-10 sets max, zero DOMS`;
            } else if (profile.matchDayProximity === 'MD+1') {
                prompt += `\n\n🔄 POST-PARTITA: Recovery attivo, stretching, foam rolling`;
            }
        }
        
        // Fight week per boxe
        if (sport === 'boxe' && profile.fight_week) {
            prompt += `\n\n⚡ FIGHT WEEK: Solo attivazione, NO volume, NO esercizi pesanti!`;
        }
        
        return prompt;
    },
    
    // Esercizi controindicati per infortunio
    getContraindicated(injury) {
        const injuryLower = injury.toLowerCase();
        
        if (injuryLower.includes('ginocchio') || injuryLower.includes('lca') || injuryLower.includes('acl')) {
            return ['Jump Squat', 'Box Jump', 'Lunges profonde', 'Leg Extension pesante'];
        }
        if (injuryLower.includes('spalla')) {
            return ['Overhead Press', 'Dips', 'Behind Neck Press', 'Upright Row'];
        }
        if (injuryLower.includes('schiena') || injuryLower.includes('lombare') || injuryLower.includes('ernia')) {
            return ['Deadlift convenzionale', 'Good Morning', 'Bent Over Row pesante'];
        }
        if (injuryLower.includes('caviglia')) {
            return ['Box Jump', 'Jump Squat', 'Sprint', 'Calf Raise pesante'];
        }
        if (injuryLower.includes('polso') || injuryLower.includes('mano')) {
            return ['Push-up', 'Front Squat', 'Clean', 'Snatch'];
        }
        if (injuryLower.includes('hamstring') || injuryLower.includes('bicipite femorale')) {
            return ['Romanian Deadlift', 'Sprint', 'Nordic Curl (inizialmente)'];
        }
        
        return ['esercizi ad alto impatto sulla zona'];
    },
    
    // Quick access per sport
    getForSport(sport) {
        return this[sport] || '';
    }
};

window.ScientificPromptRules = ScientificPromptRules;
console.log('📋 ScientificPromptRules loaded - Scientific rules for AI prompts');
