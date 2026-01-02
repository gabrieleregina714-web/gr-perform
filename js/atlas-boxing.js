/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🥊 ATLAS BOXING MODULE v1.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Modulo specifico per la boxe che integra:
 * - Tecnica: shadow boxing, bag work, pad work, combinations
 * - Circuiti condizionamento sport-specifici
 * - Footwork e movement drills
 * - Core anti-rotazione per pugni potenti
 * - Condizionamento metabolico round-based
 * 
 * OBIETTIVO: Workout da pugile vero, non da palestra generica
 */

window.ATLASBoxing = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🥊 ESERCIZI SPECIFICI BOXE
    // ═══════════════════════════════════════════════════════════════════════════
    
    exercises: {
        
        // TECNICA PURA
        technique: [
            { 
                name: 'Shadow Boxing', 
                sets: 3, 
                reps: '3 min', 
                type: 'technique', 
                rest: '60s',
                notes: 'Focus: jab-cross-hook. Movimento continuo, visualizza avversario',
                cues: ['Guardia alta', 'Ruota i fianchi', 'Torna in guardia']
            },
            { 
                name: 'Mirror Drill', 
                sets: 2, 
                reps: '2 min', 
                type: 'technique', 
                rest: '30s',
                notes: 'Davanti allo specchio, focus su tecnica pulita',
                cues: ['Controlla postura', 'Piedi paralleli', 'Mento giù']
            },
            { 
                name: 'Slow Motion Combinations', 
                sets: 3, 
                reps: '10 combo', 
                type: 'technique', 
                rest: '30s',
                notes: '1-2-3-2, 1-1-2-3-2. Al rallentatore per perfezione tecnica',
                cues: ['Ogni colpo perfetto', 'Respira sul colpo', 'Equilibrio']
            }
        ],
        
        // BAG WORK
        bagWork: [
            { 
                name: 'Heavy Bag Rounds', 
                sets: 4, 
                reps: '3 min', 
                type: 'conditioning', 
                rest: '60s',
                notes: 'Round completi. Mix jab, cross, hook, uppercut',
                cues: ['Potenza dai fianchi', 'Non spingere, colpisci', 'Muoviti dopo ogni combo']
            },
            { 
                name: 'Speed Bag', 
                sets: 3, 
                reps: '2 min', 
                type: 'coordination', 
                rest: '30s',
                notes: 'Ritmo costante, piccoli movimenti',
                cues: ['Mani rilassate', 'Ritmo 1-2-3', 'Gomiti su']
            },
            { 
                name: 'Double-End Bag', 
                sets: 3, 
                reps: '2 min', 
                type: 'accuracy', 
                rest: '45s',
                notes: 'Focus precisione e timing',
                cues: ['Colpisci al centro', 'Muovi la testa', 'Jab leggero']
            },
            { 
                name: 'Heavy Bag Power Shots', 
                sets: 4, 
                reps: '10 colpi', 
                type: 'power', 
                rest: '90s',
                notes: 'Solo colpi potenti al 100%. Cross e hook',
                cues: ['Tutto il corpo', 'Respira fuori', 'Resetta dopo ogni colpo']
            },
            { 
                name: 'Uppercut Bag Drill', 
                sets: 3, 
                reps: '2 min', 
                type: 'technique', 
                rest: '45s',
                notes: 'Alternare destro e sinistro, potenza dalle gambe',
                cues: ['Piega le ginocchia', 'Solleva con le gambe', 'Ruota spalla']
            }
        ],
        
        // PAD WORK (per quando ha partner)
        padWork: [
            { 
                name: 'Pad Work - Combinations', 
                sets: 4, 
                reps: '3 min', 
                type: 'technique', 
                rest: '60s',
                notes: 'Con partner. Combo chiamate dal coach',
                cues: ['Ascolta il coach', 'Reazione rapida', 'Torna in guardia']
            },
            { 
                name: 'Pad Work - Counter Punching', 
                sets: 3, 
                reps: '2 min', 
                type: 'reaction', 
                rest: '45s',
                notes: 'Reagisci ai colpi del partner, poi contrattacca',
                cues: ['Slip e counter', 'Roll e hook', 'Timing > velocità']
            },
            { 
                name: 'Pad Work - Body Shots', 
                sets: 3, 
                reps: '2 min', 
                type: 'power', 
                rest: '60s',
                notes: 'Focus su ganci e montanti al corpo',
                cues: ['Abbassati', 'Ruota fianchi', 'Colpisci attraverso']
            }
        ],
        
        // FOOTWORK
        footwork: [
            { 
                name: 'Ladder Drill - Ali Shuffle', 
                sets: 3, 
                reps: '30s', 
                type: 'agility', 
                rest: '30s',
                notes: 'In-in-out-out nella scala',
                cues: ['Sulle punte', 'Passi piccoli', 'Braccia coordinate']
            },
            { 
                name: 'Cone Pivots', 
                sets: 3, 
                reps: '8 per direzione', 
                type: 'agility', 
                rest: '30s',
                notes: 'Pivot attorno al cono, mantieni guardia',
                cues: ['Piede perno', 'Guardia su', 'Occhi avanti']
            },
            { 
                name: 'Circle Drill', 
                sets: 3, 
                reps: '1 min', 
                type: 'movement', 
                rest: '30s',
                notes: 'Muoviti in cerchio, cambia direzione a comando',
                cues: ['Mai incrociare piedi', 'Passi laterali', 'Sempre in guardia']
            },
            { 
                name: 'In-Out Footwork', 
                sets: 3, 
                reps: '2 min', 
                type: 'movement', 
                rest: '45s',
                notes: 'Entra con jab, esci con passo indietro. Ritmo',
                cues: ['Jab mentre entri', 'Step back veloce', 'Non stare fermo']
            },
            { 
                name: 'Lateral Movement Drill', 
                sets: 3, 
                reps: '1 min per lato', 
                type: 'movement', 
                rest: '30s',
                notes: 'Movimento laterale continuo con jab',
                cues: ['Push dal piede', 'Non saltare', 'Jab ogni step']
            }
        ],
        
        // DEFENSE DRILLS
        defense: [
            { 
                name: 'Slip Drill', 
                sets: 3, 
                reps: '20 per lato', 
                type: 'defense', 
                rest: '30s',
                notes: 'Slip a destra e sinistra, corda o partner',
                cues: ['Piega ginocchia', 'Non solo testa', 'Occhi su avversario']
            },
            { 
                name: 'Bob & Weave', 
                sets: 3, 
                reps: '20', 
                type: 'defense', 
                rest: '30s',
                notes: 'Sotto la corda, movimento a U',
                cues: ['Usa le gambe', 'Testa sotto', 'Exit con colpo']
            },
            { 
                name: 'Parry Drill', 
                sets: 3, 
                reps: '30s', 
                type: 'defense', 
                rest: '30s',
                notes: 'Con partner, devia jab con mano anteriore',
                cues: ['Piccolo movimento', 'Non bloccare, devia', 'Counter dopo']
            },
            { 
                name: 'Roll Under', 
                sets: 3, 
                reps: '10 per lato', 
                type: 'defense', 
                rest: '30s',
                notes: 'Rollo sotto gancio immaginario, exit con hook',
                cues: ['Ginocchia piegate', 'Peso sul piede avanti', 'Hook dopo roll']
            }
        ],
        
        // CONDITIONING CIRCUITS - Clear, specific exercises
        conditioningCircuits: [
            { 
                name: 'Airdyne/Assault Bike Intervals', 
                sets: 5, 
                reps: '20s max / 40s easy', 
                type: 'conditioning', 
                rest: '0s',
                notes: 'All-out 20s, recupero attivo 40s. Simula round intensity.',
                cues: ['Max rpm per 20s', 'Recupera pedalando', '5 rounds = 5 min']
            },
            { 
                name: 'Battle Ropes Alternating', 
                sets: 4, 
                reps: '30s', 
                type: 'conditioning', 
                rest: '30s',
                notes: 'Onde alternate rapide. Simula punch rhythm.',
                cues: ['Core braced', 'Spalle basse', 'Ritmo costante']
            },
            { 
                name: 'Burpee to 1-2 Combo', 
                sets: 3, 
                reps: '10', 
                type: 'conditioning', 
                rest: '60s',
                notes: 'Burpee completo, sali in guardia, jab-cross potente.',
                cues: ['Chest to floor', 'Esplodi su', 'Combo veloce']
            },
            { 
                name: 'Medicine Ball Slam', 
                sets: 3, 
                reps: '12', 
                type: 'power', 
                rest: '45s',
                notes: 'Overhead slam con potenza. Simula overhand.',
                cues: ['Alza sopra testa', 'Sbatti con tutto corpo', 'Prendi e ripeti']
            },
            { 
                name: 'Sprint Intervals', 
                sets: 6, 
                reps: '30s on / 30s off', 
                type: 'conditioning', 
                rest: '0s',
                notes: '30s max effort, 30s walk. 6 rounds = 6 min.',
                cues: ['Tutto fuori 30s', 'Walk recovery', 'Mantieni ogni round']
            },
            { 
                name: 'Box Jump', 
                sets: 3, 
                reps: '8', 
                type: 'power', 
                rest: '60s',
                notes: 'Jump esplosivo, step down. Potenza lower body.',
                cues: ['Braccia swing', 'Atterraggio morbido', 'Reset ogni rep']
            }
        ],
        
        // CONDIZIONAMENTO SPECIFICO (legacy pool)
        conditioning: [
            { 
                name: 'Jump Rope', 
                sets: 3, 
                reps: '3 min', 
                type: 'conditioning', 
                rest: '60s',
                notes: 'Cambio ritmo: normale, doppio, incrociato',
                cues: ['Polsi rilassati', 'Saltello basso', 'Respira']
            },
            { 
                name: 'Burpee to Jab-Cross', 
                sets: 3, 
                reps: '10', 
                type: 'conditioning', 
                rest: '60s',
                notes: 'Burpee, sali in guardia, tira 1-2',
                cues: ['Esplodi su', 'Subito in guardia', '1-2 veloce']
            },
            { 
                name: 'Sprint Intervals', 
                sets: 6, 
                reps: '30s on / 30s off', 
                type: 'conditioning', 
                rest: '0s',
                notes: 'Simula round: 30s massimo, 30s recupero attivo',
                cues: ['Tutto fuori 30s', 'Cammina nel rest', 'Mantieni ritmo']
            },
            { 
                name: 'Battle Ropes', 
                sets: 3, 
                reps: '30s', 
                type: 'conditioning', 
                rest: '45s',
                notes: 'Onde alternate, simula ritmo pugni',
                cues: ['Core tight', 'Dalle spalle', 'Non fermarti']
            },
            { 
                name: 'Airdyne/Assault Bike Intervals', 
                sets: 5, 
                reps: '20s max / 40s easy', 
                type: 'conditioning', 
                rest: '0s',
                notes: 'Condizionamento metabolico round-based',
                cues: ['Massimo 20s', 'Recupera pedalando', 'Ritmo costante']
            }
        ],
        
        // CORE ANTI-ROTAZIONE (per pugni potenti)
        coreBoxing: [
            { 
                name: 'Pallof Press', 
                sets: 3, 
                reps: '10 per lato', 
                type: 'core', 
                rest: '45s',
                notes: 'Anti-rotazione. Resisti alla rotazione',
                cues: ['Core braced', 'Non ruotare', 'Spinta lenta']
            },
            { 
                name: 'Landmine Rotation', 
                sets: 3, 
                reps: '8 per lato', 
                type: 'power', 
                rest: '60s',
                notes: 'Potenza rotazionale per hook e cross',
                cues: ['Forza dai fianchi', 'Esplodi', 'Controlla discesa']
            },
            { 
                name: 'Medicine Ball Rotational Throw', 
                sets: 3, 
                reps: '8 per lato', 
                type: 'power', 
                rest: '60s',
                notes: 'Lancia contro muro. Simula hook potente',
                cues: ['Ruota tutto corpo', 'Rilascia con fianchi', 'Prendi e ripeti']
            },
            { 
                name: 'Cable Woodchop', 
                sets: 3, 
                reps: '12 per lato', 
                type: 'core', 
                rest: '45s',
                notes: 'Alto-basso o basso-alto, controllo rotazione',
                cues: ['Braccia dritte', 'Ruota core', 'Piedi fermi']
            },
            { 
                name: 'Russian Twist', 
                sets: 3, 
                reps: '20 totali', 
                type: 'core', 
                rest: '45s',
                notes: 'Con medicine ball, tocca terra ogni lato',
                cues: ['Piedi sollevati', 'Ruota spalle', 'Controllo']
            },
            { 
                name: 'Dead Bug', 
                sets: 3, 
                reps: '10 per lato', 
                type: 'core', 
                rest: '30s',
                notes: 'Anti-estensione, schiena a terra',
                cues: ['Lombare a terra', 'Respira fuori', 'Lento']
            }
        ],
        
        // ═══════════════════════════════════════════════════════════════
        // INJURY PREVENTION - Polsi, Spalle, Collo
        // 18% injury rate polso/mano nei pugili, necessario prehab
        // ═══════════════════════════════════════════════════════════════
        injuryPrevention: [
            // POLSI E AVAMBRACCI
            { 
                name: 'Wrist Circles', 
                sets: 2, 
                reps: '10 per direzione', 
                type: 'prehab', 
                rest: '0s',
                notes: 'Riscaldamento polsi essenziale prima di guanti',
                cues: ['Cerchi lenti', 'Massima ampiezza', 'Entrambe direzioni']
            },
            { 
                name: 'Wrist Flexor/Extensor Stretch', 
                sets: 2, 
                reps: '30s per lato', 
                type: 'prehab', 
                rest: '0s',
                notes: 'Stretching avambracci pre e post allenamento',
                cues: ['Braccio dritto', 'Tira delicatamente', 'Senti stretch']
            },
            { 
                name: 'Rice Bucket Training', 
                sets: 2, 
                reps: '60s', 
                type: 'prehab', 
                rest: '30s',
                notes: 'Rinforzo grip e polso in tutte le direzioni',
                cues: ['Affonda mani', 'Apri/chiudi', 'Ruota polsi']
            },
            { 
                name: 'Wrist Roller', 
                sets: 2, 
                reps: '2 su + 2 giù', 
                type: 'prehab', 
                rest: '45s',
                notes: 'Forza avambracci per punch endurance',
                cues: ['Braccia dritte davanti', 'Solo polsi', 'Controllo']
            },
            { 
                name: 'Finger Extensions (Rubber Band)', 
                sets: 2, 
                reps: '20', 
                type: 'prehab', 
                rest: '0s',
                notes: 'Bilanciare grip con estensione dita',
                cues: ['Elastico su dita', 'Apri completamente', 'Lento']
            },
            
            // SPALLE - Rotator Cuff
            { 
                name: 'Band External Rotation', 
                sets: 2, 
                reps: '15 per lato', 
                type: 'prehab', 
                rest: '30s',
                notes: 'Prevenzione cuffia rotatori, essenziale per pugili',
                cues: ['Gomito fisso', 'Ruota fuori', 'Controllo ritorno']
            },
            { 
                name: 'Band Pull-Apart', 
                sets: 2, 
                reps: '15', 
                type: 'prehab', 
                rest: '30s',
                notes: 'Rinforzo posteriore spalle, controbilancia push',
                cues: ['Braccia dritte', 'Squeeze scapole', 'Controllo']
            },
            { 
                name: 'Face Pull', 
                sets: 3, 
                reps: '15', 
                type: 'prehab', 
                rest: '45s',
                notes: 'Salute spalle, rinforza deltoide posteriore',
                cues: ['Tira al viso', 'Gomiti alti', 'Pause in contrazione']
            },
            { 
                name: 'YTWL Raises', 
                sets: 2, 
                reps: '8 per posizione', 
                type: 'prehab', 
                rest: '30s',
                notes: 'Attivazione completa stabilizzatori spalla',
                cues: ['Pancia su panca', 'Pollici su', 'Squeeze scapole']
            },
            
            // COLLO - Fondamentale per incassare colpi
            { 
                name: 'Neck Flexion/Extension (Manual Resistance)', 
                sets: 2, 
                reps: '10 per direzione', 
                type: 'prehab', 
                rest: '30s',
                notes: 'Rinforzo collo per proteggere da KO',
                cues: ['Resistenza mano', 'Movimento lento', 'No jerking']
            },
            { 
                name: 'Neck Lateral Flexion', 
                sets: 2, 
                reps: '10 per lato', 
                type: 'prehab', 
                rest: '30s',
                notes: 'Laterali per stabilità quando si incassa',
                cues: ['Orecchio verso spalla', 'Resistenza opposta', 'Controllo']
            },
            { 
                name: 'Neck Harness Extension', 
                sets: 2, 
                reps: '15', 
                type: 'prehab', 
                rest: '45s',
                notes: 'Con peso leggero, focus su estensione',
                cues: ['Mento al petto', 'Estendi lento', 'No momentum']
            },
            { 
                name: 'Shrugs (with hold)', 
                sets: 3, 
                reps: '12 + 3s hold', 
                type: 'prehab', 
                rest: '45s',
                notes: 'Trapezi forti = collo protetto',
                cues: ['Spalle alle orecchie', 'Hold in alto', 'Abbassa lento']
            }
        ],
        
        // FORZA SPECIFICA BOXE
        strengthBoxing: [
            { 
                name: 'Push Press', 
                sets: 4, 
                reps: '5', 
                type: 'power', 
                rest: '90s',
                notes: 'Potenza spalle per jab e cross',
                cues: ['Dip con gambe', 'Drive esplosivo', 'Lockout']
            },
            { 
                name: 'Clap Push-up', 
                sets: 3, 
                reps: '8', 
                type: 'power', 
                rest: '60s',
                notes: 'Potenza esplosiva push',
                cues: ['Petto a terra', 'Esplodi', 'Mani pronte']
            },
            { 
                name: 'Medicine Ball Slam', 
                sets: 3, 
                reps: '10', 
                type: 'power', 
                rest: '60s',
                notes: 'Full body power, simula overhand',
                cues: ['Alza sopra testa', 'Sbatti con tutto', 'Prendi subito']
            },
            { 
                name: 'Dumbbell Snatch', 
                sets: 3, 
                reps: '6 per lato', 
                type: 'power', 
                rest: '60s',
                notes: 'Potenza totale corpo, hip hinge esplosivo',
                cues: ['Inizia da terra', 'Estendi fianchi', 'Prendi in alto']
            },
            { 
                name: 'Bent Over Row (unilateral)', 
                sets: 3, 
                reps: '10 per lato', 
                type: 'strength', 
                rest: '60s',
                notes: 'Forza tirata per riportare il braccio',
                cues: ['Schiena dritta', 'Tira al fianco', 'Squeeze']
            },
            { 
                name: 'Pull-up', 
                sets: 3, 
                reps: '8-10', 
                type: 'strength', 
                rest: '90s',
                notes: 'Forza schiena per clinch e tiro',
                cues: ['Dead hang start', 'Petto alla barra', 'Controllo giù']
            },
            { 
                name: 'Box Jump', 
                sets: 3, 
                reps: '5', 
                type: 'power', 
                rest: '90s',
                notes: 'Potenza esplosiva lower body. Step down per recupero.',
                cues: ['Braccia swing', 'Atterraggio morbido', 'Reset ogni rep']
            },
            { 
                name: 'Trap Bar Deadlift', 
                sets: 4, 
                reps: '5', 
                type: 'strength', 
                rest: '120s',
                notes: 'Forza lower body e hip hinge. Base per potenza punch.',
                cues: ['Petto alto', 'Drive con gambe', 'Lockout completo']
            },
            { 
                name: 'Split Squat', 
                sets: 3, 
                reps: '8 per lato', 
                type: 'strength', 
                rest: '60s',
                notes: 'Forza unilaterale. Importante per stance e footwork.',
                cues: ['Ginocchio posteriore verso terra', 'Torso dritto', 'Push dal tallone']
            }
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 TEMPLATE WORKOUT BOXE
    // ═══════════════════════════════════════════════════════════════════════════
    
    templates: {
        
        // SESSIONE TECNICA (focus skill)
        technique_session: {
            name: 'Tecnica Boxe',
            duration: 60,
            type: 'technique',
            warmup: {
                exercises: [
                    { name: 'Jump Rope', sets: 2, reps: '3 min', rest: '30s' },
                    { name: 'Dynamic Stretching', sets: 1, reps: '5 min', rest: '0s' },
                    { name: 'Shadow Boxing Light', sets: 2, reps: '2 min', rest: '30s' }
                ]
            },
            main: {
                sections: ['technique', 'footwork', 'defense', 'coreBoxing'],
                structure: [
                    { from: 'technique', count: 3 },
                    { from: 'footwork', count: 2 },
                    { from: 'defense', count: 2 },
                    { from: 'coreBoxing', count: 2 }
                ]
            },
            finisher: {
                exercises: [
                    { name: 'Shadow Boxing Rounds', sets: 3, reps: '3 min', rest: '60s', notes: 'Metti insieme tutto' }
                ]
            },
            cooldown: {
                exercises: [
                    { name: 'Stretching', sets: 1, reps: '5 min', type: 'cooldown' }
                ]
            }
        },
        
        // SESSIONE BAG WORK (potenza e timing)
        bag_session: {
            name: 'Bag Work Session',
            duration: 60,
            type: 'conditioning',
            warmup: {
                exercises: [
                    { name: 'Jump Rope', sets: 3, reps: '3 min', rest: '30s' },
                    { name: 'Shadow Boxing', sets: 2, reps: '3 min', rest: '60s' }
                ]
            },
            main: {
                sections: ['bagWork', 'coreBoxing'],
                structure: [
                    { from: 'bagWork', count: 5 },
                    { from: 'coreBoxing', count: 2 }
                ]
            },
            finisher: {
                exercises: [
                    { name: 'Heavy Bag Burnout', sets: 1, reps: '3 min non-stop', rest: '0s', notes: 'Tutto quello che hai. Round finale.' }
                ]
            },
            cooldown: {
                exercises: [
                    { name: 'Light Shadow Boxing', sets: 1, reps: '2 min', type: 'cooldown' },
                    { name: 'Stretching', sets: 1, reps: '5 min', type: 'cooldown' }
                ]
            }
        },
        
        // SESSIONE CONDITIONING (redesigned - clear structure)
        conditioning_session: {
            name: 'Boxing Conditioning',
            duration: 50,
            type: 'conditioning',
            warmup: {
                exercises: [
                    { name: 'Jump Rope', sets: 2, reps: '2 min', rest: '30s', type: 'warmup' },
                    { name: 'Dynamic Movement', sets: 1, reps: '3 min', rest: '0s', type: 'warmup' },
                    { name: 'Shadow Boxing Light', sets: 2, reps: '2 min', rest: '30s', type: 'warmup' }
                ]
            },
            main: {
                sections: ['conditioningCircuits'],
                structure: [
                    { from: 'conditioningCircuits', count: 3 }
                ]
            },
            finisher: {
                exercises: [
                    { name: 'Tabata Shadow Boxing', sets: 8, reps: '20s on / 10s off', rest: '0s', type: 'conditioning', notes: '4 minuti totali. Max intensità ogni round.' },
                    { name: 'Burpee Finisher', sets: 2, reps: '10', rest: '30s', type: 'conditioning', notes: 'Ultimo push. Full effort.' }
                ]
            },
            core: {
                exercises: [
                    { name: 'Plank Hold', sets: 3, reps: '45s', rest: '30s', type: 'core', notes: 'Core tight, respira' },
                    { name: 'Pallof Press', sets: 2, reps: '10 per lato', rest: '30s', type: 'core' }
                ]
            },
            cooldown: {
                exercises: [
                    { name: 'Walk/Easy Bike', sets: 1, reps: '3 min', rest: '0s', type: 'cooldown', notes: 'Abbassa frequenza cardiaca' },
                    { name: 'Full Body Stretch', sets: 1, reps: '3 min', type: 'cooldown' }
                ]
            }
        },
        
        // SESSIONE STRENGTH (forza per boxe)
        strength_session: {
            name: 'Boxing Strength',
            duration: 60,
            type: 'strength',
            warmup: {
                exercises: [
                    { name: 'Jump Rope', sets: 2, reps: '2 min', rest: '30s' },
                    { name: 'Band Pull-Apart', sets: 2, reps: '15', rest: '30s' },
                    { name: 'Shadow Boxing Light', sets: 2, reps: '2 min', rest: '30s' }
                ]
            },
            prehab: {
                sections: ['injuryPrevention'],
                structure: [
                    { from: 'injuryPrevention', count: 4, filter: ['prehab'] }  // Polsi, spalle, collo
                ]
            },
            main: {
                sections: ['strengthBoxing', 'coreBoxing'],
                structure: [
                    { from: 'strengthBoxing', count: 5 },  // Increased to include lower body
                    { from: 'coreBoxing', count: 2 }
                ]
            },
            finisher: {
                exercises: [
                    { name: 'Heavy Bag Power Shots', sets: 3, reps: '10 per hand (1-2 combo)', rest: '60s', type: 'power', notes: 'Applica la forza. Full power, reset stance.' }
                ]
            },
            cooldown: {
                exercises: [
                    { name: 'Stretching', sets: 1, reps: '5 min', type: 'cooldown' }
                ]
            }
        },
        
        // SESSIONE COMPLETA (tutto insieme)
        complete_session: {
            name: 'Complete Boxing Session',
            duration: 75,
            type: 'complete',
            warmup: {
                exercises: [
                    { name: 'Jump Rope', sets: 3, reps: '3 min', rest: '30s' },
                    { name: 'Shadow Boxing Progressive', sets: 2, reps: '3 min', rest: '60s', notes: 'Da leggero a intenso' }
                ]
            },
            main: {
                sections: ['technique', 'bagWork', 'strengthBoxing', 'coreBoxing'],
                structure: [
                    { from: 'technique', count: 1 },
                    { from: 'bagWork', count: 2 },
                    { from: 'strengthBoxing', count: 2 },
                    { from: 'coreBoxing', count: 2 }
                ]
            },
            finisher: {
                exercises: [
                    { name: 'Tabata Shadow Boxing', sets: 8, reps: '20s on / 10s off', rest: '0s', notes: '4 minuti totali. Massima intensità.' }
                ]
            },
            cooldown: {
                exercises: [
                    { name: 'Light Movement', sets: 1, reps: '2 min', type: 'cooldown' },
                    { name: 'Full Body Stretch', sets: 1, reps: '5 min', type: 'cooldown' }
                ]
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🏗️ GENERAZIONE WORKOUT
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Genera workout specifico per boxe
     * @param {Object} profile - Profilo atleta
     * @param {string} sessionType - Tipo sessione: technique, bag, conditioning, strength, complete
     * @returns {Object} Workout boxe completo
     */
    generateWorkout(profile, sessionType = 'complete') {
        const template = this.templates[sessionType + '_session'] || this.templates.complete_session;
        
        console.log(`🥊 Generating Boxing Workout: ${template.name}`);
        
        const workout = {
            name: template.name,
            type: 'boxing',
            duration: template.duration,
            sport: 'boxe',
            exercises: [],
            circuits: [],
            metadata: {
                generatedAt: new Date().toISOString(),
                sessionType: sessionType,
                module: 'ATLASBoxing v' + this.version
            }
        };
        
        // WARMUP
        if (template.warmup) {
            template.warmup.exercises.forEach(ex => {
                workout.exercises.push({ ...ex, phase: 'warmup' });
            });
        }
        
        // MAIN WORKOUT
        if (template.main) {
            template.main.structure.forEach(item => {
                const exercisePool = this.exercises[item.from];
                if (exercisePool) {
                    // Seleziona esercizi random dal pool
                    const shuffled = [...exercisePool].sort(() => Math.random() - 0.5);
                    const selected = shuffled.slice(0, item.count);
                    selected.forEach(ex => {
                        workout.exercises.push({ ...ex, phase: 'main' });
                    });
                }
            });
        }
        
        // CORE (se definito separatamente nel template)
        if (template.core && template.core.exercises) {
            template.core.exercises.forEach(ex => {
                workout.exercises.push({ ...ex, phase: 'main', type: 'core' });
            });
        }
        
        // FINISHER
        if (template.finisher) {
            template.finisher.exercises.forEach(ex => {
                workout.exercises.push({ ...ex, phase: 'finisher' });
            });
        }
        
        // COOLDOWN
        if (template.cooldown) {
            template.cooldown.exercises.forEach(ex => {
                workout.exercises.push({ ...ex, phase: 'cooldown' });
            });
        }
        
        // Aggiungi cues se mancanti
        workout.exercises = workout.exercises.map(ex => ({
            ...ex,
            cues: ex.cues || this.getDefaultCues(ex.name)
        }));
        
        return workout;
    },
    
    /**
     * Arricchisce un workout generico con elementi boxe
     */
    enrichWithBoxingElements(workout, intensity = 'normal') {
        if (!workout || !workout.exercises) return workout;
        
        const enriched = { ...workout };
        const newExercises = [];
        
        // Aggiungi shadow boxing all'inizio se non c'è warmup boxe
        const hasBoxingWarmup = enriched.exercises.some(e => 
            e.name?.toLowerCase().includes('shadow') || 
            e.name?.toLowerCase().includes('rope')
        );
        
        if (!hasBoxingWarmup) {
            newExercises.push({
                name: 'Shadow Boxing',
                sets: 2,
                reps: '2 min',
                type: 'warmup',
                phase: 'warmup',
                notes: 'Riscaldamento specifico boxe'
            });
        }
        
        // Sostituisci core generico con core anti-rotazione
        enriched.exercises = enriched.exercises.map(ex => {
            const name = (ex.name || '').toLowerCase();
            
            // Sostituisci plank con pallof press
            if (name.includes('plank') && !name.includes('copenhagen')) {
                return this.exercises.coreBoxing.find(e => e.name === 'Pallof Press') || ex;
            }
            
            // Sostituisci crunch con russian twist
            if (name.includes('crunch') || name.includes('sit-up')) {
                return this.exercises.coreBoxing.find(e => e.name === 'Russian Twist') || ex;
            }
            
            return ex;
        });
        
        // Aggiungi finisher boxe
        if (intensity !== 'light') {
            enriched.exercises.push({
                name: 'Shadow Boxing Finisher',
                sets: 2,
                reps: '3 min',
                type: 'conditioning',
                phase: 'finisher',
                notes: 'Rounds finali. Intensità alta, movimento costante'
            });
        }
        
        // Combina
        enriched.exercises = [...newExercises, ...enriched.exercises];
        enriched.boxingEnriched = true;
        
        return enriched;
    },
    
    /**
     * Cues di default per esercizi comuni
     */
    getDefaultCues(exerciseName) {
        const name = (exerciseName || '').toLowerCase();
        
        if (name.includes('shadow')) return ['Guardia alta', 'Movimento fluido', 'Respira'];
        if (name.includes('bag')) return ['Potenza dai fianchi', 'Non spingere', 'Torna in guardia'];
        if (name.includes('rope') || name.includes('jump')) return ['Sulle punte', 'Saltello basso', 'Polsi rilassati'];
        if (name.includes('push')) return ['Petto a terra', 'Core tight', 'Esplosivo'];
        if (name.includes('pull')) return ['Squeeze in alto', 'Controllo', 'Full ROM'];
        
        return ['Focus sulla tecnica', 'Controllo del movimento'];
    },
    
    /**
     * Determina il tipo di sessione ottimale per il giorno
     */
    recommendSessionType(weeklySchedule, dayOfWeek, goal) {
        // Logica intelligente per raccomandare tipo sessione
        const day = weeklySchedule[dayOfWeek];
        
        // Se domani c'è sparring/match, oggi tecnica leggera
        const tomorrow = this.getNextDay(dayOfWeek);
        const tomorrowActivity = weeklySchedule[tomorrow];
        
        if (tomorrowActivity === 'match' || tomorrowActivity === 'sparring') {
            return 'technique'; // Sessione leggera
        }
        
        // Se ieri c'era sparring/match, oggi recovery/technique
        const yesterday = this.getPreviousDay(dayOfWeek);
        const yesterdayActivity = weeklySchedule[yesterday];
        
        if (yesterdayActivity === 'match' || yesterdayActivity === 'sparring') {
            return 'technique'; // Recovery tecnico
        }
        
        // Altrimenti basati sul goal
        switch (goal) {
            case 'potenza':
                return 'strength';
            case 'resistenza':
                return 'conditioning';
            case 'tecnica':
                return 'technique';
            default:
                return 'complete';
        }
    },
    
    getNextDay(day) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const idx = days.indexOf(day);
        return days[(idx + 1) % 7];
    },
    
    getPreviousDay(day) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const idx = days.indexOf(day);
        return days[(idx + 6) % 7];
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🥊 ATLAS Boxing Module v1.0 loaded!');
console.log('   → ATLASBoxing.generateWorkout(profile, type) - Generate boxing workout');
console.log('   → Session types: technique, bag, conditioning, strength, complete');
console.log('   → ATLASBoxing.enrichWithBoxingElements(workout) - Add boxing to generic workout');
