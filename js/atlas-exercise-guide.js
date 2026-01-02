/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 📚 ATLAS EXERCISE GUIDE v1.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Database di spiegazioni contestuali per ogni esercizio:
 * - Esecuzione corretta
 * - Focus muscolare e come variarlo
 * - Perché l'esercizio è nel workout
 * - Errori comuni da evitare
 * - Varianti per obiettivi diversi
 */

window.ATLASExerciseGuide = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📖 DATABASE ESERCIZI
    // ═══════════════════════════════════════════════════════════════════════════
    
    exercises: {
        
        // ═══════════════════════════════════════════════════════════════════════
        // LOWER BODY
        // ═══════════════════════════════════════════════════════════════════════
        
        'squat': {
            name: 'Squat',
            category: 'lower_body',
            primaryMuscles: ['quadricipiti', 'glutei'],
            secondaryMuscles: ['hamstrings', 'core', 'erettori spinali'],
            
            execution: {
                setup: 'Piedi larghezza spalle o leggermente più larghi, punte leggermente extraruotate (15-30°).',
                movement: 'Inizia il movimento spingendo i fianchi indietro, poi piega le ginocchia. Scendi fino a quando le cosce sono parallele al pavimento o più giù. Spingi attraverso tutto il piede per risalire.',
                breathing: 'Inspira durante la discesa, espira durante la salita.',
                tempo: 'Controllato in discesa (2-3s), esplosivo in salita.'
            },
            
            focusVariants: [
                {
                    focus: 'QUADRICIPITI',
                    howTo: 'Mantieni il busto più verticale possibile. Ginocchia possono avanzare oltre le punte dei piedi. Stance più stretta (larghezza spalle).',
                    why: 'Posizione verticale aumenta flessione del ginocchio, maggior lavoro dei quad.'
                },
                {
                    focus: 'GLUTEI',
                    howTo: 'Stance più ampia (1.5x spalle). Punte più extraruotate (30-45°). Spingi le ginocchia fuori. Siediti più indietro.',
                    why: 'Stance ampia e profondità aumentano allungamento e attivazione glutei.'
                },
                {
                    focus: 'POTENZA (Sport)',
                    howTo: 'Profondità parallelo o sopra. Risalita esplosiva. Pausa in basso opzionale.',
                    why: 'Per sport serve potenza, non ipertrofia. Velocità concentrica prioritaria.'
                }
            ],
            
            commonErrors: [
                { error: 'Ginocchia che collassano verso interno', fix: 'Spingi attivamente le ginocchia fuori, attiva glutei' },
                { error: 'Talloni che si alzano', fix: 'Lavora sulla mobilità caviglia, oppure usa rialzo talloni' },
                { error: 'Busto che cade in avanti', fix: 'Core tight, sguardo avanti, lavora su mobilità anche' }
            ],
            
            sportContext: {
                boxe: 'Base stabile per pugni potenti. La potenza del cross viene dalle gambe.',
                calcio: 'Forza per sprint, salti, contrasti. Previene infortuni ginocchio.',
                basket: 'Potenza per salto verticale e accelerazioni.'
            }
        },
        
        'lunge': {
            name: 'Affondi / Lunge',
            category: 'lower_body',
            primaryMuscles: ['quadricipiti', 'glutei'],
            secondaryMuscles: ['hamstrings', 'adduttori', 'core'],
            
            execution: {
                setup: 'In piedi, piedi uniti. Un passo avanti lungo.',
                movement: 'Scendi piegando entrambe le ginocchia. Ginocchio posteriore verso il pavimento. Spingi dal piede anteriore per tornare su.',
                breathing: 'Inspira scendendo, espira salendo.',
                tempo: 'Controllato, 2s giù, 1s su.'
            },
            
            focusVariants: [
                {
                    focus: 'QUADRICIPITI',
                    howTo: 'Passo più corto. Busto verticale. Ginocchio anteriore AVANZA OLTRE la punta del piede. Peso sulla parte anteriore del piede.',
                    why: 'Maggiore flessione del ginocchio = più lavoro quadricipiti. È sicuro se fatto correttamente!'
                },
                {
                    focus: 'GLUTEI',
                    howTo: 'Passo più lungo. Busto leggermente inclinato avanti. Ginocchio resta SOPRA la caviglia. Peso sul tallone.',
                    why: 'Passo lungo allunga di più il gluteo. Tallone attiva la catena posteriore.'
                },
                {
                    focus: 'STABILITÀ (Sport)',
                    howTo: 'Aggiungi instabilità: walking lunges, reverse lunges, lateral lunges.',
                    why: 'Gli sport richiedono stabilità dinamica, non solo forza statica.'
                }
            ],
            
            commonErrors: [
                { error: 'Ginocchio che collassa verso interno', fix: 'Spingi ginocchio fuori, attiva gluteo medio' },
                { error: 'Passo troppo corto', fix: 'Il ginocchio posteriore deve quasi toccare terra' },
                { error: 'Perdita equilibrio', fix: 'Core tight, sguardo avanti, piedi non sulla stessa linea' }
            ],
            
            sportContext: {
                boxe: 'Simula la stance del pugile. Forza unilaterale per movimento e potenza.',
                calcio: 'Movimento calcistico per eccellenza. Previene pubalgia con lavoro adduttori.',
                basket: 'Decelerazione e cambio direzione. Fondamentale per difesa.'
            }
        },
        
        'split_squat': {
            name: 'Split Squat',
            category: 'lower_body',
            primaryMuscles: ['quadricipiti', 'glutei'],
            secondaryMuscles: ['hamstrings', 'core'],
            
            execution: {
                setup: 'Piedi sfalsati, uno avanti e uno dietro. Distanza circa 2 piedi.',
                movement: 'Scendi verticalmente piegando entrambe le ginocchia. Ginocchio posteriore verso terra. Risali spingendo dal piede anteriore.',
                breathing: 'Inspira giù, espira su.',
                tempo: '2s giù, 1s su.'
            },
            
            focusVariants: [
                {
                    focus: 'QUADRICIPITI',
                    howTo: 'Stance più corta. Busto verticale. Ginocchio avanza oltre la punta. Piede posteriore solo per equilibrio.',
                    why: 'Flessione ginocchio maggiore = quad focus.'
                },
                {
                    focus: 'GLUTEI',
                    howTo: 'Stance più lunga. Piede posteriore elevato (Bulgarian split squat). Inclina leggermente il busto.',
                    why: 'Maggiore allungamento del gluteo in posizione bassa.'
                }
            ],
            
            commonErrors: [
                { error: 'Peso sul piede posteriore', fix: '80% peso sul piede anteriore' },
                { error: 'Ginocchio che collassa', fix: 'Spingi attivamente verso fuori' }
            ],
            
            sportContext: {
                boxe: 'Forza nella stance. Importante per stabilità durante i pugni.',
                calcio: 'Forza unilaterale per calci e sprint.',
                basket: 'Potenza per salti da un piede.'
            }
        },
        
        'trap_bar_deadlift': {
            name: 'Trap Bar Deadlift',
            category: 'lower_body',
            primaryMuscles: ['quadricipiti', 'glutei', 'hamstrings'],
            secondaryMuscles: ['erettori spinali', 'trapezi', 'core'],
            
            execution: {
                setup: 'Dentro la trap bar, piedi larghezza anche. Afferra le maniglie, petto alto.',
                movement: 'Spingi il pavimento lontano da te con le gambe. Estendi anche e ginocchia insieme. Lockout completo in alto.',
                breathing: 'Grande respiro prima di sollevare, mantieni durante, espira al lockout.',
                tempo: 'Controllato ma non lento. Potenza.'
            },
            
            focusVariants: [
                {
                    focus: 'QUADRICIPITI',
                    howTo: 'Usa le maniglie alte. Siediti più in basso. Ginocchia più avanti.',
                    why: 'Posizione più simile a squat = più quad.'
                },
                {
                    focus: 'CATENA POSTERIORE',
                    howTo: 'Usa le maniglie basse. Fianchi più alti. Meno flessione ginocchio.',
                    why: 'Più hip hinge = più glutei e hamstrings.'
                },
                {
                    focus: 'POTENZA (Sport)',
                    howTo: 'Peso moderato (60-75%). Risalita ESPLOSIVA. Ogni rep come uno sprint.',
                    why: 'Per sport serve rate of force development, non 1RM.'
                }
            ],
            
            commonErrors: [
                { error: 'Schiena che si arrotonda', fix: 'Petto alto, lats attivati, core braced' },
                { error: 'Fianchi che si alzano prima delle spalle', fix: 'Spingi il pavimento, non tirare la barra' }
            ],
            
            sportContext: {
                boxe: 'Potenza hip hinge per pugni potenti. Il cross viene dalle gambe attraverso i fianchi.',
                calcio: 'Forza per sprint e salti. Previene infortuni hamstring.',
                basket: 'Base di forza per salto verticale.'
            }
        },
        
        'box_jump': {
            name: 'Box Jump',
            category: 'lower_body',
            primaryMuscles: ['quadricipiti', 'glutei'],
            secondaryMuscles: ['polpacci', 'core'],
            
            execution: {
                setup: 'In piedi davanti al box, piedi larghezza spalle.',
                movement: 'Contro-movimento rapido (braccia indietro, fianchi indietro), poi esplodi verso l\'alto e avanti. Atterra morbido sul box. STEP DOWN per scendere.',
                breathing: 'Espira durante il salto.',
                tempo: 'Esplosivo. Reset completo tra ogni rep.'
            },
            
            focusVariants: [
                {
                    focus: 'POTENZA PURA',
                    howTo: 'Box più alto possibile (ma sicuro). Pause tra rep. Max effort ogni salto.',
                    why: 'Forza + velocità = potenza massima.'
                },
                {
                    focus: 'REATTIVITÀ',
                    howTo: 'Box più basso. Salti continui (jump down, immediate jump up). Minimizza tempo a terra.',
                    why: 'Allena il ciclo stretch-shortening per sport reattivi.'
                },
                {
                    focus: 'SICUREZZA (Principianti)',
                    howTo: 'Box basso. Concentrati sulla tecnica di atterraggio. Step down sempre.',
                    why: 'Costruisci competenza prima di intensità.'
                }
            ],
            
            commonErrors: [
                { error: 'Atterraggio rumoroso/duro', fix: 'Atterra morbido, piega ginocchia, assorbi' },
                { error: 'Saltare giù dal box', fix: 'SEMPRE step down per proteggere tendini' },
                { error: 'Ginocchia che collassano all\'atterraggio', fix: 'Atterra con ginocchia tracking fuori' }
            ],
            
            sportContext: {
                boxe: 'Potenza lower body per footwork esplosivo e punch power.',
                calcio: 'Potenza per salti di testa e sprint.',
                basket: 'Diretto transfer al salto verticale.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════════════
        // UPPER BODY PUSH
        // ═══════════════════════════════════════════════════════════════════════
        
        'push_press': {
            name: 'Push Press',
            category: 'upper_push',
            primaryMuscles: ['spalle (deltoide anteriore)', 'tricipiti'],
            secondaryMuscles: ['quadricipiti', 'glutei', 'core'],
            
            execution: {
                setup: 'Bilanciere in rack position (sulle spalle anteriori). Piedi larghezza spalle.',
                movement: 'Piccolo dip con le ginocchia (1/4 squat), poi ESPLODI verso l\'alto estendendo gambe e braccia insieme. Lockout sopra la testa.',
                breathing: 'Inspira prima del dip, espira durante la spinta.',
                tempo: 'Dip controllato, drive ESPLOSIVO.'
            },
            
            focusVariants: [
                {
                    focus: 'POTENZA SPALLE',
                    howTo: 'Dip minimo. Più push dalle spalle che dalle gambe. Peso moderato.',
                    why: 'Per isolare potenza upper body.'
                },
                {
                    focus: 'POTENZA TOTALE',
                    howTo: 'Dip più profondo. Usa le gambe al massimo. Peso più pesante.',
                    why: 'Transfer di forza lower-to-upper body. Fondamentale per sport.'
                },
                {
                    focus: 'VELOCITÀ',
                    howTo: 'Peso leggero (50-60%). Massima velocità. Cluster sets.',
                    why: 'Allena rate of force development.'
                }
            ],
            
            commonErrors: [
                { error: 'Dip troppo profondo', fix: 'Solo 1/4 squat, non un front squat' },
                { error: 'Gomiti che cadono', fix: 'Mantieni gomiti alti in rack position' },
                { error: 'Pressare prima di estendere le gambe', fix: 'Le gambe danno il drive PRIMA, poi le braccia' }
            ],
            
            sportContext: {
                boxe: 'Transfer diretto al jab e cross. Potenza dalle gambe attraverso le spalle.',
                calcio: 'Forza per rimesse laterali e contrasti aerei.',
                basket: 'Potenza overhead per passaggi e tiri.'
            }
        },
        
        'clap_pushup': {
            name: 'Clap Push-up',
            category: 'upper_push',
            primaryMuscles: ['pettorali', 'tricipiti', 'deltoide anteriore'],
            secondaryMuscles: ['core', 'serratus'],
            
            execution: {
                setup: 'Posizione push-up standard. Mani leggermente più larghe delle spalle.',
                movement: 'Scendi controllato, poi ESPLODI verso l\'alto staccando le mani da terra. Clap rapido. Atterra con gomiti leggermente flessi per assorbire.',
                breathing: 'Espira durante l\'esplosione.',
                tempo: 'Discesa controllata, esplosione massima.'
            },
            
            focusVariants: [
                {
                    focus: 'POTENZA PUSH',
                    howTo: 'Massima altezza. Pause tra rep. Qualità > quantità.',
                    why: 'Allena la potenza pura del push.'
                },
                {
                    focus: 'REATTIVITÀ',
                    howTo: 'Rep continue. Minimizza tempo a terra tra rep.',
                    why: 'Allena il ciclo stretch-shortening.'
                },
                {
                    focus: 'PROGRESSIONE (se non riesci)',
                    howTo: 'Inizia con push-up esplosivi senza clap. O su ginocchia. O contro muro inclinato.',
                    why: 'Costruisci la potenza gradualmente.'
                }
            ],
            
            commonErrors: [
                { error: 'Atterraggio con gomiti bloccati', fix: 'Atterra sempre con gomiti leggermente flessi' },
                { error: 'Fianchi che cadono', fix: 'Core tight, corpo in linea retta' }
            ],
            
            sportContext: {
                boxe: 'Potenza push per jab e cross. Simula la meccanica del pugno.',
                calcio: 'Potenza per contrasti.',
                basket: 'Potenza per passaggi petto.'
            }
        },
        
        'bench_press': {
            name: 'Bench Press',
            category: 'upper_push',
            primaryMuscles: ['pettorali'],
            secondaryMuscles: ['tricipiti', 'deltoide anteriore'],
            
            execution: {
                setup: 'Sdraiato sulla panca. Scapole retratte e depresse. Arco naturale lombare. Piedi piantati.',
                movement: 'Abbassa la barra al petto (linea capezzoli). Gomiti ~45° dal corpo. Spingi verso l\'alto in linea retta.',
                breathing: 'Inspira giù, espira su.',
                tempo: 'Controllato giù (2-3s), potente su.'
            },
            
            focusVariants: [
                {
                    focus: 'PETTO',
                    howTo: 'Presa più larga (1.5x spalle). Gomiti più aperti (60-75°). Arco ridotto.',
                    why: 'Maggiore stretch e attivazione pettorale.'
                },
                {
                    focus: 'TRICIPITI',
                    howTo: 'Presa più stretta. Gomiti più chiusi (30-45°). Close grip bench.',
                    why: 'Maggiore range di movimento gomito = più tricipiti.'
                },
                {
                    focus: 'FORZA MASSIMA',
                    howTo: 'Arco pronunciato (safe). Leg drive attivo. Pausa al petto.',
                    why: 'Massimizza leva meccanica e forza totale.'
                }
            ],
            
            commonErrors: [
                { error: 'Scapole non retratte', fix: 'Stringi le scapole PRIMA di sdraiarti' },
                { error: 'Rimbalzo al petto', fix: 'Tocca e spingi controllato, no bounce' },
                { error: 'Gomiti troppo aperti (90°)', fix: 'Gomiti ~45° protegge la spalla' }
            ],
            
            sportContext: {
                boxe: 'Forza push, ma meno specifico di push-up e push press.',
                calcio: 'Forza per contrasti e rimesse.',
                basket: 'Forza base upper body.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════════════
        // UPPER BODY PULL
        // ═══════════════════════════════════════════════════════════════════════
        
        'pull_up': {
            name: 'Pull-up',
            category: 'upper_pull',
            primaryMuscles: ['latissimi', 'bicipiti'],
            secondaryMuscles: ['romboidi', 'trapezi', 'brachialis'],
            
            execution: {
                setup: 'Presa prona, leggermente più larga delle spalle. Dead hang completo.',
                movement: 'Inizia deprimendo le scapole. Tira portando il petto verso la barra. Scendi controllato fino a dead hang.',
                breathing: 'Espira salendo, inspira scendendo.',
                tempo: 'Controllato entrambe le direzioni. No kipping.'
            },
            
            focusVariants: [
                {
                    focus: 'LARGHEZZA SCHIENA (Lats)',
                    howTo: 'Presa più larga. Tira con i gomiti verso i fianchi. Immagina di piegare la barra.',
                    why: 'Presa larga enfatizza i lat nella loro funzione primaria.'
                },
                {
                    focus: 'SPESSORE SCHIENA (Romboidi)',
                    howTo: 'Chin-up (presa supina). Presa stretta. Stringi le scapole insieme in alto.',
                    why: 'Permette maggiore retrazione scapolare.'
                },
                {
                    focus: 'BICIPITI',
                    howTo: 'Chin-up (presa supina). Presa stretta (larghezza spalle). Enfasi sulla flessione del gomito.',
                    why: 'Supinazione + flessione = massimo bicipite.'
                }
            ],
            
            commonErrors: [
                { error: 'Mezza rep (non scendi tutto)', fix: 'Dead hang completo ogni rep' },
                { error: 'Kipping/oscillazione', fix: 'Core tight, controllo totale' },
                { error: 'Tirare con le braccia prima', fix: 'Inizia con le scapole, poi i gomiti' }
            ],
            
            sportContext: {
                boxe: 'Forza per clinch e riportare il braccio dopo il pugno.',
                calcio: 'Forza upper body per contrasti.',
                basket: 'Forza per rimbalzi e difesa fisica.'
            }
        },
        
        'bent_over_row': {
            name: 'Bent Over Row',
            category: 'upper_pull',
            primaryMuscles: ['latissimi', 'romboidi'],
            secondaryMuscles: ['bicipiti', 'erettori spinali', 'trapezi'],
            
            execution: {
                setup: 'In piedi, fianchi indietro, busto ~45° rispetto al pavimento. Ginocchia leggermente flesse.',
                movement: 'Tira la barra/manubrio verso l\'ombelico. Stringi le scapole insieme. Abbassa controllato.',
                breathing: 'Espira tirando, inspira abbassando.',
                tempo: '1s su, squeeze, 2s giù.'
            },
            
            focusVariants: [
                {
                    focus: 'LATISSIMI',
                    howTo: 'Presa più larga. Tira verso lo sterno basso. Gomiti fuori.',
                    why: 'Angolo enfatizza adduzione omero = più lat.'
                },
                {
                    focus: 'ROMBOIDI/TRAPEZI MEDI',
                    howTo: 'Presa stretta. Tira verso l\'ombelico. Gomiti vicini al corpo.',
                    why: 'Maggiore retrazione scapolare.'
                },
                {
                    focus: 'UNILATERALE (Anti-rotazione)',
                    howTo: 'Una mano alla volta. Non ruotare il busto. Core tight.',
                    why: 'Aggiunge componente anti-rotazione. Essenziale per sport.'
                }
            ],
            
            commonErrors: [
                { error: 'Busto che si alza durante la tirata', fix: 'Mantieni angolo fisso, usa meno peso' },
                { error: 'Usare momentum', fix: 'Controllato, no rimbalzo' },
                { error: 'Non stringere le scapole', fix: 'Squeeze in alto per 1s' }
            ],
            
            sportContext: {
                boxe: 'Riportare il braccio dopo il pugno. Anti-rotazione per potenza punch.',
                calcio: 'Forza per trattenere avversario.',
                basket: 'Forza per rimbalzi e difesa post.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════════════
        // CORE
        // ═══════════════════════════════════════════════════════════════════════
        
        'pallof_press': {
            name: 'Pallof Press',
            category: 'core',
            primaryMuscles: ['obliqui', 'trasverso addominale'],
            secondaryMuscles: ['retto addominale', 'glutei'],
            
            execution: {
                setup: 'In piedi lateralmente al cavo. Mani al petto con la maniglia.',
                movement: 'Estendi le braccia davanti a te. RESISTI alla rotazione. Mantieni fianchi e spalle dritti. Riporta al petto.',
                breathing: 'Espira mentre estendi.',
                tempo: 'Lento e controllato. 2s fuori, 2s hold, 2s dentro.'
            },
            
            focusVariants: [
                {
                    focus: 'ANTI-ROTAZIONE PURA',
                    howTo: 'Braccia completamente estese. Hold più lungo (3-5s). Più peso.',
                    why: 'Massimo braccio di leva = massima sfida anti-rotazione.'
                },
                {
                    focus: 'DINAMICO',
                    howTo: 'Aggiungi passo laterale mentre tieni le braccia estese. O squat hold.',
                    why: 'Integra anti-rotazione con movimento. Più sport-specific.'
                }
            ],
            
            commonErrors: [
                { error: 'Ruotare verso il cavo', fix: 'Core tight, RESISTI. Usa meno peso se necessario' },
                { error: 'Braccia piegate', fix: 'Estendi completamente per massimo effetto' }
            ],
            
            sportContext: {
                boxe: 'FONDAMENTALE. Potenza del pugno viene dalla capacità di resistere alla rotazione mentre generi rotazione.',
                calcio: 'Stabilità per calci e cambi direzione.',
                basket: 'Core per contatti e tiri in equilibrio.'
            }
        },
        
        'russian_twist': {
            name: 'Russian Twist',
            category: 'core',
            primaryMuscles: ['obliqui'],
            secondaryMuscles: ['retto addominale', 'flessori anca'],
            
            execution: {
                setup: 'Seduto, ginocchia piegate, piedi sollevati (opzionale per più difficoltà). Busto inclinato indietro ~45°.',
                movement: 'Ruota il busto portando le mani (o peso) da un lato all\'altro. Mantieni il core attivo.',
                breathing: 'Espira ad ogni rotazione.',
                tempo: 'Controllato, no momentum.'
            },
            
            focusVariants: [
                {
                    focus: 'ROTAZIONE POTENTE',
                    howTo: 'Con medicine ball. Tocca terra ogni lato con forza. Movimenti esplosivi.',
                    why: 'Allena potenza rotazionale per sport.'
                },
                {
                    focus: 'ENDURANCE CORE',
                    howTo: 'Senza peso o peso leggero. Rep alte (20-30). Controllo costante.',
                    why: 'Resistenza muscolare per round lunghi.'
                }
            ],
            
            commonErrors: [
                { error: 'Solo braccia che si muovono', fix: 'Ruota il BUSTO, non solo le braccia' },
                { error: 'Perdere posizione lombare', fix: 'Mantieni core braced, non iperestendere' }
            ],
            
            sportContext: {
                boxe: 'Rotazione per hook e uppercut. Endurance per round lunghi.',
                calcio: 'Rotazione per calci e passaggi lunghi.',
                basket: 'Core per tiri in movimento.'
            }
        },
        
        'dead_bug': {
            name: 'Dead Bug',
            category: 'core',
            primaryMuscles: ['retto addominale', 'trasverso addominale'],
            secondaryMuscles: ['obliqui', 'flessori anca'],
            
            execution: {
                setup: 'Sdraiato sulla schiena. Braccia verso il soffitto. Anche e ginocchia a 90°.',
                movement: 'Estendi un braccio dietro e la gamba opposta davanti. MANTIENI la schiena piatta contro il pavimento. Ritorna e cambia lato.',
                breathing: 'Espira mentre estendi.',
                tempo: 'Lento. 3s per estendere, 3s per tornare.'
            },
            
            focusVariants: [
                {
                    focus: 'ANTI-ESTENSIONE',
                    howTo: 'Concentrati sul mantenere la zona lombare COMPLETAMENTE a terra. Se si alza, riduci range.',
                    why: 'Il core deve prevenire l\'estensione lombare. Fondamentale per protezione schiena.'
                },
                {
                    focus: 'COORDINAZIONE',
                    howTo: 'Aggiungi pattern più complessi: stesso lato, crossing patterns, holds.',
                    why: 'Integrazione core-movimento per sport.'
                }
            ],
            
            commonErrors: [
                { error: 'Schiena che si inarca', fix: 'STOP. Riduci range fino a mantenere schiena piatta' },
                { error: 'Trattenere il respiro', fix: 'Espira attivamente durante l\'estensione' }
            ],
            
            sportContext: {
                boxe: 'Stabilità core per trasferimento forza. Prevenzione infortuni schiena.',
                calcio: 'Core stabile per calci potenti e sprint.',
                basket: 'Core per contatti e equilibrio.'
            }
        },
        
        'plank': {
            name: 'Plank',
            category: 'core',
            primaryMuscles: ['retto addominale', 'trasverso addominale'],
            secondaryMuscles: ['obliqui', 'glutei', 'spalle'],
            
            execution: {
                setup: 'Avambracci a terra, gomiti sotto le spalle. Piedi uniti o larghezza spalle.',
                movement: 'Corpo in linea retta dalla testa ai talloni. Mantieni la posizione.',
                breathing: 'Respira normalmente, non trattenere.',
                tempo: 'Static hold. 30-60s per set.'
            },
            
            focusVariants: [
                {
                    focus: 'ANTI-ESTENSIONE',
                    howTo: 'Tuck pelvis leggermente (posterior pelvic tilt). Stringi glutei. Non lasciare che i fianchi cadano.',
                    why: 'Insegna al core a resistere all\'estensione lombare.'
                },
                {
                    focus: 'FULL BODY TENSION',
                    howTo: 'Spingi i gomiti verso i piedi (senza muoverti). Spingi i piedi verso i gomiti. Crea tensione totale.',
                    why: 'Attiva più muscolatura. Più transfer a movimenti complessi.'
                },
                {
                    focus: 'ANTI-ROTAZIONE',
                    howTo: 'Plank con shoulder tap: tocca spalla opposta con mano, minimizza rotazione fianchi.',
                    why: 'Aggiunge componente anti-rotazione al plank base.'
                }
            ],
            
            commonErrors: [
                { error: 'Fianchi che cadono', fix: 'Stringi glutei, tuck pelvis' },
                { error: 'Fianchi troppo alti', fix: 'Corpo in linea retta, controlla nello specchio' },
                { error: 'Trattenere respiro', fix: 'Respira normalmente!' }
            ],
            
            sportContext: {
                boxe: 'Core stabile per trasferimento forza. Fondamentale per ogni sport.',
                calcio: 'Base di stabilità per tutti i movimenti.',
                basket: 'Core per contatti e equilibrio.'
            }
        },
        
        'cable_woodchop': {
            name: 'Cable Woodchop',
            category: 'core',
            primaryMuscles: ['obliqui'],
            secondaryMuscles: ['retto addominale', 'spalle', 'anche'],
            
            execution: {
                setup: 'Lateralmente al cavo. Mani insieme sulla maniglia. Cavo in alto (high-to-low) o in basso (low-to-high).',
                movement: 'Ruota il busto tirando la maniglia diagonalmente verso il lato opposto. Le braccia rimangono relativamente dritte - la forza viene dalla rotazione del core.',
                breathing: 'Espira durante la rotazione.',
                tempo: 'Potente ma controllato. Pause all\'inizio e alla fine.'
            },
            
            focusVariants: [
                {
                    focus: 'POTENZA ROTAZIONALE',
                    howTo: 'High-to-low (dall\'alto verso il basso). Movimento esplosivo. Simula hook/overhand.',
                    why: 'Direzione di forza simile a pugni potenti.'
                },
                {
                    focus: 'ANTI-ESTENSIONE + ROTAZIONE',
                    howTo: 'Low-to-high (dal basso verso l\'alto). Più controllo, meno momentum.',
                    why: 'Combina anti-estensione con rotazione. Più difficile per core.'
                },
                {
                    focus: 'SPORT-SPECIFIC',
                    howTo: 'Parti dalla stance del tuo sport. Piedi in posizione atletica. Aggiungi step o pivot.',
                    why: 'Transfer diretto al movimento sport-specific.'
                }
            ],
            
            commonErrors: [
                { error: 'Braccia che fanno tutto il lavoro', fix: 'Braccia dritte, RUOTA con il core' },
                { error: 'Piedi che si muovono', fix: 'Piedi piantati, pivot sul piede posteriore se necessario' }
            ],
            
            sportContext: {
                boxe: 'Diretto transfer a hook e overhand. Potenza rotazionale = potenza punch.',
                calcio: 'Potenza per calci e lanci lunghi.',
                basket: 'Rotazione per passaggi e tiri.'
            }
        },
        
        'landmine_rotation': {
            name: 'Landmine Rotation',
            category: 'core',
            primaryMuscles: ['obliqui'],
            secondaryMuscles: ['spalle', 'anche', 'core'],
            
            execution: {
                setup: 'Bilanciere ancorato in un angolo o landmine. In piedi, braccia estese con l\'estremità del bilanciere.',
                movement: 'Ruota il busto portando il bilanciere da un lato all\'altro in un arco. Braccia rimangono estese. Fianchi e piedi possono pivotare.',
                breathing: 'Espira durante la rotazione.',
                tempo: 'Controllato per tecnica, esplosivo per potenza.'
            },
            
            focusVariants: [
                {
                    focus: 'POTENZA ROTAZIONALE',
                    howTo: 'Peso moderato. Movimento esplosivo. Piedi possono pivotare. Come un pugno.',
                    why: 'Allena la potenza rotazionale con resistenza. Diretto transfer a punch.'
                },
                {
                    focus: 'CONTROLLO ANTI-ROTAZIONE',
                    howTo: 'Peso più leggero. Piedi fermi. Resisti alla rotazione delle anche. Solo core ruota.',
                    why: 'Allena la separazione tra anche e spalle. Fondamentale per potenza punch.'
                },
                {
                    focus: 'ENDURANCE',
                    howTo: 'Peso leggero. Rep alte (15-20 per lato). Ritmo costante.',
                    why: 'Resistenza rotazionale per round lunghi.'
                }
            ],
            
            commonErrors: [
                { error: 'Solo braccia che si muovono', fix: 'Ruota il BUSTO. Braccia sono solo il collegamento.' },
                { error: 'Perdere controllo', fix: 'Inizia leggero, costruisci il pattern' }
            ],
            
            sportContext: {
                boxe: 'FONDAMENTALE. Simula esattamente il pattern di rotazione del pugno con resistenza.',
                calcio: 'Potenza per calci e passaggi.',
                basket: 'Rotazione per passaggi e tiri.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════════════
        // BOXING SPECIFIC
        // ═══════════════════════════════════════════════════════════════════════
        
        'shadow_boxing': {
            name: 'Shadow Boxing',
            category: 'boxing',
            primaryMuscles: ['spalle', 'core'],
            secondaryMuscles: ['gambe', 'cardiovascolare'],
            
            execution: {
                setup: 'Stance di guardia. Mani su. Mento giù. Peso distribuito.',
                movement: 'Tira combinazioni immaginando un avversario. Muoviti, non stare fermo. Ritorna sempre in guardia.',
                breathing: 'Espira su ogni pugno. Respira con ritmo.',
                tempo: 'Varia: lento per tecnica, veloce per conditioning.'
            },
            
            focusVariants: [
                {
                    focus: 'TECNICA PURA',
                    howTo: 'Al rallentatore. Specchio. Concentrati su ogni dettaglio: piedi, fianchi, spalle, mani.',
                    why: 'La perfezione tecnica viene dalla ripetizione lenta e consapevole.'
                },
                {
                    focus: 'CONDITIONING',
                    howTo: 'Intensità alta. Non stop per tutto il round. Movimento costante.',
                    why: 'Costruisce resistenza sport-specifica.'
                },
                {
                    focus: 'VISUALIZZAZIONE',
                    howTo: 'Immagina un avversario reale. Reagisci ai suoi movimenti. Slip, counter, move.',
                    why: 'Prepara mentalmente per il combattimento reale.'
                }
            ],
            
            commonErrors: [
                { error: 'Non tornare in guardia', fix: 'Dopo OGNI pugno, mani tornano su' },
                { error: 'Stare fermi', fix: 'Movimento costante, footwork attivo' },
                { error: 'Solo braccia', fix: 'La potenza viene dai fianchi. Ruota!' }
            ],
            
            sportContext: {
                boxe: 'Fondamento assoluto. Ogni sessione inizia e/o finisce con shadow boxing.'
            }
        },
        
        'heavy_bag': {
            name: 'Heavy Bag',
            category: 'boxing',
            primaryMuscles: ['spalle', 'petto', 'core'],
            secondaryMuscles: ['gambe', 'schiena'],
            
            execution: {
                setup: 'Stance di guardia. Distanza corretta dal sacco (pugno esteso tocca il sacco).',
                movement: 'Colpisci ATTRAVERSO il sacco, non spingerlo. Ritorna in guardia. Muoviti attorno al sacco.',
                breathing: 'Espira su ogni pugno (sharp exhale).',
                tempo: 'Varia per obiettivo.'
            },
            
            focusVariants: [
                {
                    focus: 'POTENZA',
                    howTo: 'Singoli colpi con pausa. 100% potenza. Reset tra ogni pugno. Qualità > quantità.',
                    why: 'Allena massima forza di impatto.'
                },
                {
                    focus: 'COMBINAZIONI',
                    howTo: 'Combo fluide: 1-2, 1-2-3, 1-2-3-2. Flusso continuo. Potenza moderata.',
                    why: 'Allena flow e transizioni tra pugni.'
                },
                {
                    focus: 'CONDITIONING',
                    howTo: 'Round completi (3 min). Mix di tutto. Movimento costante. Non stop.',
                    why: 'Costruisce resistenza specifica al combattimento.'
                }
            ],
            
            commonErrors: [
                { error: 'Spingere il sacco', fix: 'Colpo secco, snap. Come una frusta.' },
                { error: 'Solo braccia', fix: 'Potenza da gambe → fianchi → spalle → braccio' },
                { error: 'Mani che cadono dopo il colpo', fix: 'Torna in guardia SUBITO' }
            ],
            
            sportContext: {
                boxe: 'Allenamento fondamentale. Costruisce potenza, timing, condizionamento.'
            }
        },
        
        'jump_rope': {
            name: 'Jump Rope',
            category: 'conditioning',
            primaryMuscles: ['polpacci'],
            secondaryMuscles: ['spalle', 'core', 'cardiovascolare'],
            
            execution: {
                setup: 'Corda giusta lunghezza (calpestala, maniglie arrivano alle ascelle).',
                movement: 'Salta con entrambi i piedi, saltello basso (1-2cm). Polsi fanno il lavoro, non le braccia.',
                breathing: 'Ritmica, attraverso il naso se possibile.',
                tempo: 'Costante. Varia la velocità per obiettivi diversi.'
            },
            
            focusVariants: [
                {
                    focus: 'WARMUP',
                    howTo: 'Ritmo moderato. 2-3 minuti. Saltello base.',
                    why: 'Alza frequenza cardiaca, attiva coordinazione.'
                },
                {
                    focus: 'CONDITIONING',
                    howTo: 'Intervalli: 30s veloce, 30s normale. O round da 3 min come boxe.',
                    why: 'Costruisce resistenza specifica.'
                },
                {
                    focus: 'FOOTWORK',
                    howTo: 'Varia: single leg, lateral, high knees, double unders.',
                    why: 'Migliora agilità e coordinazione piedi.'
                }
            ],
            
            commonErrors: [
                { error: 'Saltare troppo alto', fix: 'Solo 1-2cm. Efficienza.' },
                { error: 'Braccia che girano', fix: 'Solo i polsi. Gomiti fermi ai fianchi' },
                { error: 'Guardare la corda', fix: 'Sguardo avanti. Fidati del timing.' }
            ],
            
            sportContext: {
                boxe: 'Riscaldamento iconico. Costruisce footwork, timing, condizionamento.',
                basket: 'Coordinazione e condizionamento piedi.',
                calcio: 'Condizionamento e agilità.'
            }
        },
        
        'medicine_ball_slam': {
            name: 'Medicine Ball Slam',
            category: 'power',
            primaryMuscles: ['core', 'spalle', 'latissimi'],
            secondaryMuscles: ['gambe', 'tricipiti'],
            
            execution: {
                setup: 'In piedi, palla medicine sopra la testa.',
                movement: 'Sbatti la palla a terra con tutta la forza. Usa tutto il corpo: fianchi, core, braccia. Prendi la palla al rimbalzo e ripeti.',
                breathing: 'Espira violentemente durante lo slam.',
                tempo: 'Esplosivo ogni rep. Full reset tra rep.'
            },
            
            focusVariants: [
                {
                    focus: 'POTENZA PURA',
                    howTo: 'Palla più pesante. Sbatti con tutto. Pause tra rep.',
                    why: 'Massima forza di slam.'
                },
                {
                    focus: 'CONDITIONING',
                    howTo: 'Palla più leggera. Rep continue. AMRAP o time-based.',
                    why: 'Potenza + resistenza.'
                },
                {
                    focus: 'ROTAZIONALE (Per Boxe)',
                    howTo: 'Side slam: parti da un lato, sbatti dall\'altra parte. Alterna.',
                    why: 'Simula overhand e hook. Potenza rotazionale.'
                }
            ],
            
            commonErrors: [
                { error: 'Solo braccia', fix: 'Fianchi indietro, poi ESPLODI con tutto il corpo' },
                { error: 'Non prendere la palla', fix: 'Prendi al rimbalzo per rhythm e conditioning' }
            ],
            
            sportContext: {
                boxe: 'Simula overhand/hammer fist. Potenza totale corpo.',
                calcio: 'Potenza esplosiva upper body.',
                basket: 'Potenza per passaggi.'
            }
        },
        
        'battle_ropes': {
            name: 'Battle Ropes',
            category: 'conditioning',
            primaryMuscles: ['spalle', 'core'],
            secondaryMuscles: ['braccia', 'cardiovascolare'],
            
            execution: {
                setup: 'Afferra le estremità delle corde. Stance atletica. Ginocchia leggermente flesse.',
                movement: 'Crea onde alternando le braccia su e giù. Mantieni core tight e posizione stabile.',
                breathing: 'Ritmica, non trattenere.',
                tempo: 'Costante e potente per tutta la durata.'
            },
            
            focusVariants: [
                {
                    focus: 'ALTERNATING (Punch Rhythm)',
                    howTo: 'Braccia alternate. Simula ritmo jab-cross.',
                    why: 'Costruisce endurance spalle con pattern simile a pugni.'
                },
                {
                    focus: 'DOUBLE (Potenza)',
                    howTo: 'Entrambe le braccia insieme. Slam verso terra.',
                    why: 'Più potenza per rep. Simula slam.'
                },
                {
                    focus: 'LATERAL (Anti-rotazione)',
                    howTo: 'Onde laterali. Corde si muovono come serpenti.',
                    why: 'Sfida anti-rotazione del core.'
                }
            ],
            
            commonErrors: [
                { error: 'Stare troppo in piedi', fix: 'Ginocchia flesse, posizione atletica' },
                { error: 'Core rilassato', fix: 'Braced! Le onde vengono dalle spalle, non dal corpo che oscilla' }
            ],
            
            sportContext: {
                boxe: 'Endurance spalle. Ritmo simile a punch continui.',
                calcio: 'Condizionamento upper body.',
                basket: 'Resistenza spalle.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════════════
        // ADDITIONAL EXERCISES
        // ═══════════════════════════════════════════════════════════════════════
        
        'hip_thrust': {
            name: 'Hip Thrust',
            category: 'lower_body',
            primaryMuscles: ['glutei'],
            secondaryMuscles: ['hamstrings', 'core'],
            
            execution: {
                setup: 'Schiena superiore appoggiata su panca. Piedi larghezza anche, piatti a terra. Bilanciere sui fianchi con pad.',
                movement: 'Spingi i fianchi verso l\'alto fino all\'estensione completa. Squeeze glutei in alto. Abbassa controllato.',
                breathing: 'Espira salendo, inspira scendendo.',
                tempo: 'Controllato. 1s su, 1s squeeze in alto, 2s giù.'
            },
            
            focusVariants: [
                {
                    focus: 'GLUTEI MAX',
                    howTo: 'Piedi leggermente più avanti. Spingi attraverso i talloni. Squeeze MASSIMO in alto (3s).',
                    why: 'Piedi avanti riduce quad e massimizza glutei.'
                },
                {
                    focus: 'GLUTEI + HAMSTRINGS',
                    howTo: 'Piedi più indietro (più vicini ai glutei). Spingi attraverso tutto il piede.',
                    why: 'Piedi indietro aumenta coinvolgimento hamstring.'
                }
            ],
            
            commonErrors: [
                { error: 'Iper-estensione lombare', fix: 'Ferma l\'estensione quando i fianchi sono in linea con spalle' },
                { error: 'Non attivare glutei', fix: 'Pensa a "stringere una moneta" tra i glutei' }
            ],
            
            sportContext: {
                boxe: 'Potenza hip extension per punch power.',
                calcio: 'Forza glutei per sprint e calci.',
                basket: 'Potenza per salti.'
            }
        },
        
        'romanian_deadlift': {
            name: 'Romanian Deadlift (RDL)',
            category: 'lower_body',
            primaryMuscles: ['hamstrings', 'glutei'],
            secondaryMuscles: ['erettori spinali', 'core'],
            
            execution: {
                setup: 'In piedi, piedi larghezza anche. Bilanciere/manubri davanti alle cosce.',
                movement: 'Hip hinge: spingi i fianchi INDIETRO mantenendo le ginocchia leggermente flesse. Schiena dritta. Scendi finché senti stretch negli hamstrings. Risali spingendo i fianchi avanti.',
                breathing: 'Inspira scendendo, espira salendo.',
                tempo: '3s giù (lento e controllato), 1s su.'
            },
            
            focusVariants: [
                {
                    focus: 'HAMSTRINGS',
                    howTo: 'Ginocchia quasi dritte (soft). Scendi più profondo. Senti lo STRETCH.',
                    why: 'Meno flessione ginocchio = più allungamento hamstring.'
                },
                {
                    focus: 'GLUTEI',
                    howTo: 'Ginocchia più flesse. Squeeze glutei aggressivo in alto.',
                    why: 'Più hip extension = più glutei.'
                },
                {
                    focus: 'UNILATERALE (Single Leg)',
                    howTo: 'Una gamba sola. Gamba posteriore va indietro per bilanciare.',
                    why: 'Aggiunge stabilità e corregge sbilanciamenti.'
                }
            ],
            
            commonErrors: [
                { error: 'Schiena che si arrotonda', fix: 'Petto alto, core tight. Riduci range se necessario' },
                { error: 'Bilanciere che si allontana dal corpo', fix: 'Tieni la barra a contatto con le gambe' }
            ],
            
            sportContext: {
                boxe: 'Forza catena posteriore per stance stabile.',
                calcio: 'Previene infortuni hamstring. Forza per sprint.',
                basket: 'Potenza per salti.'
            }
        },
        
        'deadlift': {
            name: 'Deadlift (Stacco)',
            category: 'lower_body',
            primaryMuscles: ['hamstrings', 'glutei', 'erettori spinali'],
            secondaryMuscles: ['quadricipiti', 'trapezi', 'core'],
            
            execution: {
                setup: 'Piedi larghezza anche. Bilanciere sopra metà piede. Afferra la barra appena fuori le gambe.',
                movement: 'Petto alto, schiena dritta. Spingi il pavimento con le gambe mentre tiri la barra. Lockout con i fianchi, non iper-estendere la schiena.',
                breathing: 'Grande respiro prima di sollevare, mantieni durante, espira al lockout.',
                tempo: 'Controllato ma potente. Reset ogni rep.'
            },
            
            focusVariants: [
                {
                    focus: 'FORZA TOTALE',
                    howTo: 'Conventional stance. Peso massimale. Ogni rep è un max effort.',
                    why: 'Il re degli esercizi per forza totale.'
                },
                {
                    focus: 'GLUTEI/HAMSTRINGS',
                    howTo: 'Sumo stance: piedi larghi, punte fuori, presa stretta tra le gambe.',
                    why: 'Più hip dominant, meno stress sulla schiena.'
                },
                {
                    focus: 'POTENZA',
                    howTo: 'Peso moderato (70%). Risalita ESPLOSIVA. Cluster sets.',
                    why: 'Allena rate of force development.'
                }
            ],
            
            commonErrors: [
                { error: 'Schiena arrotondata', fix: 'Petto alto PRIMA di iniziare. Lats attivati.' },
                { error: 'Barra che si allontana', fix: 'Tira la barra verso di te, sempre a contatto' }
            ],
            
            sportContext: {
                boxe: 'Forza base per potenza punch.',
                calcio: 'Forza fondamentale per sprint e contrasti.',
                basket: 'Potenza per tutto.'
            }
        },
        
        'dip': {
            name: 'Dip',
            category: 'upper_push',
            primaryMuscles: ['pettorali', 'tricipiti'],
            secondaryMuscles: ['deltoide anteriore'],
            
            execution: {
                setup: 'Mani sulle parallele. Braccia dritte. Corpo sospeso.',
                movement: 'Scendi piegando i gomiti fino a 90°. Spingi per risalire.',
                breathing: 'Inspira giù, espira su.',
                tempo: '2s giù, 1s su.'
            },
            
            focusVariants: [
                {
                    focus: 'PETTO',
                    howTo: 'Inclina il busto IN AVANTI (45°). Gomiti più aperti. Scendi profondo.',
                    why: 'Inclinazione aumenta stretch e attivazione pettorale.'
                },
                {
                    focus: 'TRICIPITI',
                    howTo: 'Busto VERTICALE. Gomiti stretti vicino al corpo.',
                    why: 'Posizione verticale isola i tricipiti.'
                }
            ],
            
            commonErrors: [
                { error: 'Scendere troppo', fix: 'Stop a 90° per proteggere le spalle' },
                { error: 'Spalle che si alzano verso le orecchie', fix: 'Deprimi le scapole, spalle giù' }
            ],
            
            sportContext: {
                boxe: 'Forza push per punch power.',
                calcio: 'Forza upper body.',
                basket: 'Push strength.'
            }
        },
        
        'overhead_press': {
            name: 'Overhead Press (Military Press)',
            category: 'upper_push',
            primaryMuscles: ['spalle (deltoide)'],
            secondaryMuscles: ['tricipiti', 'core'],
            
            execution: {
                setup: 'In piedi. Bilanciere/manubri all\'altezza delle spalle. Presa leggermente più larga delle spalle.',
                movement: 'Spingi dritto sopra la testa. Lockout completo. Abbassa controllato.',
                breathing: 'Espira spingendo, inspira abbassando.',
                tempo: '1s su, 2s giù.'
            },
            
            focusVariants: [
                {
                    focus: 'FORZA PURA',
                    howTo: 'Bilanciere. Peso pesante. Core tight per stabilità.',
                    why: 'Il bilanciere permette più peso = più forza.'
                },
                {
                    focus: 'DELTOIDI',
                    howTo: 'Manubri. Range completo. Squeeze in alto.',
                    why: 'Manubri permettono più range di movimento.'
                },
                {
                    focus: 'STABILITÀ',
                    howTo: 'Seated. Elimina momentum. Isola le spalle.',
                    why: 'Toglie compensi lower body.'
                }
            ],
            
            commonErrors: [
                { error: 'Iper-estensione schiena', fix: 'Core tight. Glutei attivati. Non piegarti indietro' },
                { error: 'Gomiti troppo indietro', fix: 'Gomiti leggermente avanti, sotto la barra' }
            ],
            
            sportContext: {
                boxe: 'Forza per jab e cross overhead.',
                calcio: 'Forza per contrasti aerei.',
                basket: 'Forza per tiri e rimbalzi.'
            }
        },
        
        'lat_pulldown': {
            name: 'Lat Pulldown',
            category: 'upper_pull',
            primaryMuscles: ['latissimi'],
            secondaryMuscles: ['bicipiti', 'romboidi'],
            
            execution: {
                setup: 'Seduto alla macchina. Cosce bloccate. Presa larga.',
                movement: 'Tira la barra verso il petto alto/clavicola. Stringi le scapole. Ritorna controllato.',
                breathing: 'Espira tirando, inspira rilasciando.',
                tempo: '1s giù, squeeze, 2s su.'
            },
            
            focusVariants: [
                {
                    focus: 'LARGHEZZA (Lats)',
                    howTo: 'Presa larga (1.5x spalle). Tira verso le clavicole.',
                    why: 'Presa larga enfatizza adduzione omero = lats.'
                },
                {
                    focus: 'SPESSORE (Mid-back)',
                    howTo: 'Presa stretta. Inclina leggermente indietro. Stringi scapole.',
                    why: 'Più retrazione scapolare = romboidi e trapezi medi.'
                },
                {
                    focus: 'BICIPITI',
                    howTo: 'Presa supina (chin-up grip). Presa stretta.',
                    why: 'Supinazione = più bicipite.'
                }
            ],
            
            commonErrors: [
                { error: 'Tirare con le braccia', fix: 'Inizia con le scapole, poi i gomiti' },
                { error: 'Oscillare con il corpo', fix: 'Stabile. Niente momentum.' }
            ],
            
            sportContext: {
                boxe: 'Forza pull per riportare i pugni.',
                calcio: 'Forza upper body.',
                basket: 'Forza per rimbalzi.'
            }
        },
        
        'cable_row': {
            name: 'Cable Row / Seated Row',
            category: 'upper_pull',
            primaryMuscles: ['latissimi', 'romboidi'],
            secondaryMuscles: ['bicipiti', 'trapezi'],
            
            execution: {
                setup: 'Seduto alla macchina. Gambe leggermente flesse. Schiena dritta.',
                movement: 'Tira verso l\'ombelico. Stringi le scapole insieme. Ritorna controllato.',
                breathing: 'Espira tirando, inspira rilasciando.',
                tempo: '1s tira, 1s squeeze, 2s rilascia.'
            },
            
            focusVariants: [
                {
                    focus: 'MID-BACK (Romboidi)',
                    howTo: 'Presa stretta. Gomiti vicini. Squeeze scapole 2s.',
                    why: 'Massima retrazione scapolare.'
                },
                {
                    focus: 'LATS',
                    howTo: 'Presa larga. Tira verso il petto basso.',
                    why: 'Angolo di tiro diverso enfatizza i lats.'
                }
            ],
            
            commonErrors: [
                { error: 'Oscillare con il busto', fix: 'Busto fisso. Solo braccia e scapole si muovono.' },
                { error: 'Non stringere le scapole', fix: 'Squeeze attivo in posizione contratta' }
            ],
            
            sportContext: {
                boxe: 'Forza per riportare i pugni e stabilità.',
                calcio: 'Forza pull.',
                basket: 'Forza per trattenere avversari.'
            }
        },
        
        'leg_press': {
            name: 'Leg Press',
            category: 'lower_body',
            primaryMuscles: ['quadricipiti', 'glutei'],
            secondaryMuscles: ['hamstrings'],
            
            execution: {
                setup: 'Schiena piatta contro lo schienale. Piedi sulla piattaforma larghezza spalle.',
                movement: 'Sblocca i fermi. Scendi controllato fino a 90°. Spingi risalendo.',
                breathing: 'Inspira giù, espira su.',
                tempo: '2s giù, 1s su.'
            },
            
            focusVariants: [
                {
                    focus: 'QUADRICIPITI',
                    howTo: 'Piedi BASSI sulla piattaforma. Più vicini insieme. Spingi con la parte anteriore del piede.',
                    why: 'Piedi bassi = più flessione ginocchio = più quad.'
                },
                {
                    focus: 'GLUTEI',
                    howTo: 'Piedi ALTI sulla piattaforma. Stance larga. Spingi con i talloni.',
                    why: 'Piedi alti = più hip flexion = più glutei.'
                },
                {
                    focus: 'ADDUTTORI',
                    howTo: 'Stance molto larga. Punte extraruotate. Scendi profondo.',
                    why: 'Stance larga sfida gli adduttori.'
                }
            ],
            
            commonErrors: [
                { error: 'Schiena che si solleva', fix: 'Mantieni zona lombare a contatto con lo schienale' },
                { error: 'Ginocchia che collassano', fix: 'Spingi ginocchia fuori, tracking sulle punte' }
            ],
            
            sportContext: {
                boxe: 'Forza gambe senza stress sulla schiena.',
                calcio: 'Forza per calci e sprint.',
                basket: 'Potenza per salti.'
            }
        },
        
        'leg_curl': {
            name: 'Leg Curl',
            category: 'lower_body',
            primaryMuscles: ['hamstrings'],
            secondaryMuscles: ['polpacci'],
            
            execution: {
                setup: 'Sdraiato (prone) o seduto sulla macchina. Pad dietro le caviglie.',
                movement: 'Fletti le ginocchia portando i talloni verso i glutei. Squeeze. Ritorna controllato.',
                breathing: 'Espira flettendo, inspira estendendo.',
                tempo: '1s su, 1s squeeze, 3s giù.'
            },
            
            focusVariants: [
                {
                    focus: 'HAMSTRINGS COMPLETI',
                    howTo: 'Prone leg curl (sdraiato). Range completo.',
                    why: 'Posizione prone permette più range.'
                },
                {
                    focus: 'ISCHIO-CRURALI (parte alta)',
                    howTo: 'Seated leg curl. Piedi leggermente ruotati esterni.',
                    why: 'Diverso angolo enfatizza parte alta.'
                }
            ],
            
            commonErrors: [
                { error: 'Usare momentum', fix: 'Controllato. Se devi oscillare, riduci peso.' },
                { error: 'Fianchi che si alzano (prone)', fix: 'Fianchi a contatto con la panca' }
            ],
            
            sportContext: {
                boxe: 'Prevenzione infortuni. Equilibrio quad/ham.',
                calcio: 'FONDAMENTALE per prevenire lesioni hamstring.',
                basket: 'Prevenzione infortuni.'
            }
        },
        
        'leg_extension': {
            name: 'Leg Extension',
            category: 'lower_body',
            primaryMuscles: ['quadricipiti'],
            secondaryMuscles: [],
            
            execution: {
                setup: 'Seduto sulla macchina. Schienale regolato. Pad davanti alle caviglie.',
                movement: 'Estendi le ginocchia completamente. Squeeze al top. Ritorna controllato.',
                breathing: 'Espira estendendo, inspira flettendo.',
                tempo: '1s su, 2s squeeze, 3s giù.'
            },
            
            focusVariants: [
                {
                    focus: 'VASTO LATERALE',
                    howTo: 'Piedi leggermente ruotati internamente.',
                    why: 'Ruotazione interna enfatizza vasto laterale.'
                },
                {
                    focus: 'VASTO MEDIALE (goccia)',
                    howTo: 'Piedi leggermente ruotati esternamente. Focus sul lockout completo.',
                    why: 'Il VMO si attiva di più negli ultimi gradi di estensione.'
                },
                {
                    focus: 'REHAB/PUMP',
                    howTo: 'Peso leggero. Rep alte (15-20). Nessun lockout duro.',
                    why: 'Lavoro di riabilitazione o pump senza stress.'
                }
            ],
            
            commonErrors: [
                { error: 'Sollevare i glutei', fix: 'Seduto stabile. Core attivo.' },
                { error: 'Lockout troppo aggressivo', fix: 'Estensione completa ma controllata' }
            ],
            
            sportContext: {
                boxe: 'Forza quad per stance.',
                calcio: 'Forza per calci. Rehab ginocchio.',
                basket: 'Potenza per salti.'
            }
        },
        
        'calf_raise': {
            name: 'Calf Raise',
            category: 'lower_body',
            primaryMuscles: ['gastrocnemio', 'soleo'],
            secondaryMuscles: [],
            
            execution: {
                setup: 'In piedi (standing) o seduto (seated). Parte anteriore del piede su rialzo.',
                movement: 'Sali sulle punte al massimo. Squeeze in alto. Scendi controllato sotto il livello del rialzo per stretch.',
                breathing: 'Espira salendo, inspira scendendo.',
                tempo: '1s su, 2s hold, 3s giù (lo stretch è importante!).'
            },
            
            focusVariants: [
                {
                    focus: 'GASTROCNEMIO',
                    howTo: 'Standing calf raise. Ginocchia dritte.',
                    why: 'Gastrocnemio lavora di più con ginocchia estese.'
                },
                {
                    focus: 'SOLEO',
                    howTo: 'Seated calf raise. Ginocchia flesse a 90°.',
                    why: 'Il soleo prende il comando quando il gastrocnemio è accorciato.'
                }
            ],
            
            commonErrors: [
                { error: 'Range di movimento parziale', fix: 'FULL range: stretch profondo sotto, squeeze massimo sopra' },
                { error: 'Rimbalzare', fix: 'Controllato, pause in alto e in basso' }
            ],
            
            sportContext: {
                boxe: 'Footwork reattivo. Movimento sulle punte.',
                calcio: 'Sprint e salti.',
                basket: 'Potenza per salti.'
            }
        },
        
        'face_pull': {
            name: 'Face Pull',
            category: 'upper_pull',
            primaryMuscles: ['deltoide posteriore', 'romboidi'],
            secondaryMuscles: ['trapezi', 'cuffia dei rotatori'],
            
            execution: {
                setup: 'Cavo alto. Corda. Presa con pollici verso di te (external rotation).',
                movement: 'Tira verso il viso, apri le mani verso l\'esterno. Gomiti alti. Squeeze scapole e ruota esternamente.',
                breathing: 'Espira tirando, inspira rilasciando.',
                tempo: 'Controllato. 1s tira, 2s squeeze, 2s rilascia.'
            },
            
            focusVariants: [
                {
                    focus: 'DELTOIDE POSTERIORE',
                    howTo: 'Tira verso gli occhi. Gomiti alti.',
                    why: 'Angolo ottimale per deltoide posteriore.'
                },
                {
                    focus: 'CUFFIA DEI ROTATORI',
                    howTo: 'Enfatizza la rotazione esterna finale. Ruota le mani verso l\'esterno.',
                    why: 'Rinforza rotatori esterni. Salute della spalla.'
                }
            ],
            
            commonErrors: [
                { error: 'Tirare troppo basso', fix: 'Tira verso il VISO, non verso il petto' },
                { error: 'Non ruotare esternamente', fix: 'Apri le mani verso l\'esterno a fine movimento' }
            ],
            
            sportContext: {
                boxe: 'Equilibrio pushing/pulling. Salute spalla.',
                calcio: 'Postura e prevenzione.',
                basket: 'Salute spalla per tiri.'
            }
        },
        
        'lateral_raise': {
            name: 'Lateral Raise (Alzate Laterali)',
            category: 'upper_push',
            primaryMuscles: ['deltoide laterale'],
            secondaryMuscles: ['trapezi'],
            
            execution: {
                setup: 'In piedi. Manubri ai lati. Leggera flessione dei gomiti.',
                movement: 'Alza i manubri lateralmente fino a parallelo (altezza spalle). Abbassa controllato.',
                breathing: 'Espira salendo, inspira scendendo.',
                tempo: '1s su, 1s hold, 3s giù.'
            },
            
            focusVariants: [
                {
                    focus: 'DELTOIDE LATERALE',
                    howTo: 'Gomiti SEMPRE più alti dei polsi (versa acqua dalla bottiglia). Non superare altezza spalle.',
                    why: 'Angolo ottimale per isolare il deltoide laterale.'
                },
                {
                    focus: 'DELTOIDE POSTERIORE',
                    howTo: 'Inclinati leggermente in avanti. Tira leggermente più indietro.',
                    why: 'Inclinazione sposta enfasi sul posteriore.'
                }
            ],
            
            commonErrors: [
                { error: 'Polsi più alti dei gomiti', fix: 'Gomiti SEMPRE più alti. Pensa a versare acqua.' },
                { error: 'Usare momentum/slancio', fix: 'Peso leggero. Controllato. Senti il muscolo.' }
            ],
            
            sportContext: {
                boxe: 'Stabilità spalla per punch.',
                calcio: 'Equilibrio muscolare.',
                basket: 'Forza per tiri.'
            }
        },
        
        'bicep_curl': {
            name: 'Bicep Curl',
            category: 'upper_pull',
            primaryMuscles: ['bicipiti'],
            secondaryMuscles: ['brachialis', 'avambracci'],
            
            execution: {
                setup: 'In piedi. Manubri/bilanciere. Braccia lungo i fianchi.',
                movement: 'Fletti i gomiti portando i pesi verso le spalle. Abbassa controllato.',
                breathing: 'Espira salendo, inspira scendendo.',
                tempo: '1s su, squeeze, 3s giù.'
            },
            
            focusVariants: [
                {
                    focus: 'CAPO LUNGO (picco)',
                    howTo: 'Presa più stretta. Manubri extra-ruotati.',
                    why: 'Enfatizza il capo lungo per il "picco".'
                },
                {
                    focus: 'CAPO CORTO',
                    howTo: 'Presa più larga. Spider curl o preacher curl.',
                    why: 'Angolo diverso enfatizza capo corto.'
                },
                {
                    focus: 'BRACHIALIS',
                    howTo: 'Hammer curl (presa neutra, pollici in alto).',
                    why: 'Presa neutra sposta enfasi sul brachialis.'
                }
            ],
            
            commonErrors: [
                { error: 'Oscillare con il corpo', fix: 'Gomiti fissi ai fianchi. Zero momentum.' },
                { error: 'Non estendere completamente', fix: 'Full range. Estendi completamente sotto.' }
            ],
            
            sportContext: {
                boxe: 'Forza per clinch e riportare pugni.',
                calcio: 'Accessorio.',
                basket: 'Forza per prese e controllo palla.'
            }
        },
        
        'tricep_extension': {
            name: 'Tricep Extension (Pushdown)',
            category: 'upper_push',
            primaryMuscles: ['tricipiti'],
            secondaryMuscles: [],
            
            execution: {
                setup: 'Cavo alto. Barra dritta o corda. Gomiti ai fianchi.',
                movement: 'Estendi i gomiti spingendo verso il basso. Squeeze in basso. Ritorna controllato.',
                breathing: 'Espira spingendo, inspira risalendo.',
                tempo: '1s giù, 1s squeeze, 2s su.'
            },
            
            focusVariants: [
                {
                    focus: 'CAPO LATERALE',
                    howTo: 'Corda. Separa le mani in basso (apri fuori).',
                    why: 'Separazione finale enfatizza il capo laterale.'
                },
                {
                    focus: 'CAPO LUNGO',
                    howTo: 'Overhead extension. Braccia sopra la testa.',
                    why: 'Stretch massimo del capo lungo che attraversa la spalla.'
                },
                {
                    focus: 'FORZA',
                    howTo: 'Barra dritta. Peso più pesante.',
                    why: 'Barra permette più carico.'
                }
            ],
            
            commonErrors: [
                { error: 'Gomiti che si muovono', fix: 'Gomiti FISSI ai fianchi. Solo l\'avambraccio si muove.' },
                { error: 'Inclinarsi in avanti', fix: 'Busto stabile. Core tight.' }
            ],
            
            sportContext: {
                boxe: 'Lockout dei pugni. Potenza push.',
                calcio: 'Accessorio.',
                basket: 'Forza per tiri.'
            }
        },
        
        'burpee': {
            name: 'Burpee',
            category: 'conditioning',
            primaryMuscles: ['full body'],
            secondaryMuscles: ['cardiovascolare'],
            
            execution: {
                setup: 'In piedi.',
                movement: 'Scendi in squat, mani a terra. Salta piedi indietro in plank. Push-up (opzionale). Salta piedi avanti. Esplodi in salto con braccia sopra la testa.',
                breathing: 'Ritmica. Espira durante il salto.',
                tempo: 'Fluido ma controllato.'
            },
            
            focusVariants: [
                {
                    focus: 'CONDITIONING',
                    howTo: 'Ritmo costante. Volume alto. Nessuna pausa.',
                    why: 'Costruisce endurance cardiovascolare.'
                },
                {
                    focus: 'POTENZA',
                    howTo: 'Salto massimo ogni rep. Pause tra rep.',
                    why: 'Enfatizza esplosività.'
                },
                {
                    focus: 'PRINCIPIANTE',
                    howTo: 'No push-up. Step indietro invece di saltare. No salto finale.',
                    why: 'Costruisci gradualmente.'
                }
            ],
            
            commonErrors: [
                { error: 'Schiena che crolla in plank', fix: 'Core tight in posizione plank' },
                { error: 'Perdere ritmo', fix: 'Trova il tuo ritmo e mantienilo' }
            ],
            
            sportContext: {
                boxe: 'Conditioning totale. Simula fatica del combattimento.',
                calcio: 'Conditioning.',
                basket: 'Conditioning.'
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 METODI
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Trova la guida per un esercizio
     * @param {string} exerciseName - Nome esercizio
     * @returns {Object|null} Guida esercizio o null
     */
    findGuide(exerciseName) {
        if (!exerciseName) return null;
        const name = exerciseName.toLowerCase();
        
        // Cerca match esatto prima
        for (const [key, guide] of Object.entries(this.exercises)) {
            if (name.includes(key) || guide.name.toLowerCase().includes(name)) {
                return guide;
            }
        }
        
        // Cerca match parziale
        for (const [key, guide] of Object.entries(this.exercises)) {
            const keywords = key.split('_');
            if (keywords.some(kw => name.includes(kw))) {
                return guide;
            }
        }
        
        return null;
    },
    
    /**
     * Genera spiegazione contestuale per un esercizio
     * @param {string} exerciseName - Nome esercizio
     * @param {Object} context - Contesto (sport, goal, focus)
     * @returns {Object} Spiegazione contestuale
     */
    getContextualExplanation(exerciseName, context = {}) {
        const guide = this.findGuide(exerciseName);
        if (!guide) {
            return {
                found: false,
                name: exerciseName,
                message: 'Guida non disponibile per questo esercizio.'
            };
        }
        
        const sport = context.sport?.toLowerCase() || 'generale';
        const goal = context.goal?.toLowerCase() || 'forza';
        const focus = context.muscularFocus || null;
        
        // Costruisci spiegazione
        const explanation = {
            found: true,
            name: guide.name,
            category: guide.category,
            muscles: {
                primary: guide.primaryMuscles,
                secondary: guide.secondaryMuscles
            },
            execution: guide.execution,
            commonErrors: guide.commonErrors,
            focusVariants: guide.focusVariants
        };
        
        // Aggiungi contesto sport-specifico
        if (guide.sportContext && guide.sportContext[sport]) {
            explanation.whyThisExercise = guide.sportContext[sport];
        } else if (guide.sportContext) {
            explanation.whyThisExercise = Object.values(guide.sportContext)[0];
        }
        
        // Seleziona focus variant basato su goal
        if (guide.focusVariants && guide.focusVariants.length > 0) {
            if (goal.includes('potenza') || goal.includes('power')) {
                explanation.recommendedFocus = guide.focusVariants.find(v => 
                    v.focus.toLowerCase().includes('potenza') || v.focus.toLowerCase().includes('power')
                ) || guide.focusVariants[0];
            } else if (goal.includes('ipertrofia') || goal.includes('hypertrophy')) {
                explanation.recommendedFocus = guide.focusVariants.find(v => 
                    v.focus.toLowerCase().includes('muscol') || v.focus.toLowerCase().includes('ipertrofia')
                ) || guide.focusVariants[0];
            } else if (focus) {
                explanation.recommendedFocus = guide.focusVariants.find(v => 
                    v.focus.toLowerCase().includes(focus.toLowerCase())
                ) || guide.focusVariants[0];
            } else {
                explanation.recommendedFocus = guide.focusVariants[0];
            }
        }
        
        return explanation;
    },
    
    /**
     * Arricchisce un workout con spiegazioni
     * @param {Object} workout - Workout da arricchire
     * @param {Object} profile - Profilo atleta
     * @returns {Object} Workout arricchito
     */
    enrichWorkout(workout, profile = {}) {
        if (!workout || !workout.exercises) return workout;
        
        const context = {
            sport: profile.sport || 'generale',
            goal: profile.goal || 'forza'
        };
        
        const enrichedExercises = workout.exercises.map(ex => {
            const explanation = this.getContextualExplanation(ex.name, context);
            
            return {
                ...ex,
                guide: explanation.found ? {
                    execution: explanation.execution,
                    whyThisExercise: explanation.whyThisExercise,
                    recommendedFocus: explanation.recommendedFocus,
                    commonErrors: explanation.commonErrors?.slice(0, 2), // Top 2 errors
                    muscles: explanation.muscles
                } : null
            };
        });
        
        return {
            ...workout,
            exercises: enrichedExercises,
            hasGuides: true
        };
    },
    
    /**
     * Genera HTML per mostrare la guida
     * @param {Object} guide - Guida esercizio
     * @returns {string} HTML formattato
     */
    renderGuideHTML(guide) {
        if (!guide || !guide.found) {
            return '<p class="guide-unavailable">Guida non disponibile</p>';
        }
        
        let html = `
            <div class="exercise-guide">
                <h4>${guide.name}</h4>
                
                <div class="guide-section">
                    <h5>🎯 Perché questo esercizio</h5>
                    <p>${guide.whyThisExercise || 'Esercizio fondamentale per il tuo obiettivo.'}</p>
                </div>
                
                <div class="guide-section">
                    <h5>📋 Esecuzione</h5>
                    <p><strong>Setup:</strong> ${guide.execution?.setup || ''}</p>
                    <p><strong>Movimento:</strong> ${guide.execution?.movement || ''}</p>
                    <p><strong>Respirazione:</strong> ${guide.execution?.breathing || ''}</p>
                </div>
        `;
        
        if (guide.recommendedFocus) {
            html += `
                <div class="guide-section focus-tip">
                    <h5>💡 Focus consigliato: ${guide.recommendedFocus.focus}</h5>
                    <p><strong>Come:</strong> ${guide.recommendedFocus.howTo}</p>
                    <p><strong>Perché:</strong> ${guide.recommendedFocus.why}</p>
                </div>
            `;
        }
        
        if (guide.commonErrors && guide.commonErrors.length > 0) {
            html += `
                <div class="guide-section errors">
                    <h5>⚠️ Errori comuni</h5>
                    <ul>
                        ${guide.commonErrors.map(e => `
                            <li><strong>${e.error}</strong> → ${e.fix}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }
};

// Export
if (typeof window !== 'undefined') {
    window.ATLASExerciseGuide = ATLASExerciseGuide;
}

console.log('📚 ATLAS Exercise Guide v1.0 loaded!');
console.log('   → ' + Object.keys(ATLASExerciseGuide.exercises).length + ' esercizi con guide');
console.log('   → ATLASExerciseGuide.findGuide(name) - Trova guida');
console.log('   → ATLASExerciseGuide.getContextualExplanation(name, context) - Spiegazione contestuale');
console.log('   → ATLASExerciseGuide.enrichWorkout(workout, profile) - Arricchisce workout');
