/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 ATLAS EXERCISE GUIDES v1.0
 * Sistema di guide contestuali per esercizi
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Fornisce:
 * - Spiegazione dettagliata esecuzione
 * - Focus muscolare in base alla tecnica
 * - Varianti per target diversi
 * - Contesto sport-specifico
 */

window.ATLASExerciseGuides = {
    
    version: '1.0.0',
    
    // Database guide esercizi
    guides: {
        
        // ═══════════════════════════════════════════════════════════════
        // LOWER BODY
        // ═══════════════════════════════════════════════════════════════
        
        'lunge': {
            name: 'Affondi / Lunge',
            category: 'lower_body',
            primaryMuscles: ['quadriceps', 'glutes'],
            secondaryMuscles: ['hamstrings', 'calves', 'core'],
            
            execution: {
                setup: 'In piedi, piedi larghezza fianchi. Core attivo per stabilità. Puoi eseguire affondi avanti, indietro (reverse) o camminati - ognuno ha sfumature diverse ma il pattern è simile.',
                movement: 'Fai un passo (la lunghezza influenza il focus muscolare) e abbassa il corpo piegando entrambe le ginocchia. Il ginocchio posteriore scende verso terra senza toccare. Spingi per tornare. La distribuzione del peso tra i piedi determina quale gamba lavora di più.',
                breathing: 'Inspira durante la discesa, espira durante la spinta di risalita. Mantieni tensione core durante tutto il movimento.',
                commonMistakes: [
                    'Ginocchio anteriore che collassa verso interno (valgo) - indica debolezza gluteo medio o scarso controllo, lavora su rinforzo specifico',
                    'Perdita equilibrio laterale - è normale all\'inizio, il sistema propriocettivo migliora con la pratica. Puoi usare supporto inizialmente',
                    'Passo troppo corto - limita il ROM e riduce l\'efficacia. Sperimenta con lunghezze diverse per trovare quella ottimale per te',
                    'Busto che cade eccessivamente avanti - può essere intenzionale (per glutei) o compensatorio (per debolezza). Dipende dal tuo obiettivo'
                ]
            },
            
            focusVariants: {
                quadriceps: {
                    title: 'Focus Quadricipiti',
                    technique: 'Passo più corto, busto verticale. Lascia che il ginocchio avanzi oltre la punta del piede - questo è sicuro e aumenta la flessione del ginocchio, quindi lo stress sui quadricipiti. Spingi dalla parte anteriore del piede.',
                    cues: ['Passo medio', 'Busto verticale', 'Ginocchio avanza'],
                    when: 'Obiettivo sviluppo quadricipiti o miglioramento forza estensione ginocchio'
                },
                glutes: {
                    title: 'Focus Glutei',
                    technique: 'Passo più lungo che aumenta l\'hip flexion e quindi lo stretch del gluteo. Leggera inclinazione del busto avanti. Spingi dal tallone enfatizzando la contrazione del gluteo. Il reverse lunge è particolarmente efficace per i glutei.',
                    cues: ['Passo lungo', 'Tallone a terra', 'Squeeze gluteo in risalita'],
                    when: 'Obiettivo sviluppo glutei e catena posteriore'
                },
                stability: {
                    title: 'Focus Stabilità',
                    technique: 'Movimento lento e controllato (3-4 sec discesa). Pausa in basso per 2-3 secondi. Questo forza il sistema neuromuscolare ad adattarsi, migliorando propriocezione e controllo. Utile anche per apprendimento del pattern.',
                    cues: ['Discesa lenta', 'Pausa in basso', 'Controllo totale'],
                    when: 'Fase di apprendimento, rehab, o lavoro propriocettivo'
                }
            },
            
            sportContext: {
                boxe: 'L\'affondo replica il pattern di movimento del footwork e della guardia. La forza unilaterale è essenziale per i cambi di direzione rapidi e per mantenere stabilità quando si colpisce da posizioni asimmetriche. Migliora anche la capacità di recupero dopo aver tirato colpi potenti.',
                calcio: 'Movimento che simula fasi della corsa e dei cambi di direzione. Il rinforzo unilaterale aiuta a bilanciare asimmetrie tra gamba dominante e non dominante. Importante per la prevenzione infortuni, specialmente a ginocchio e anca.',
                basket: 'Transfer diretto ai movimenti di taglio, ai primi passi esplosivi e agli arresti. La componente di stabilità è fondamentale per i contatti e le ricezioni asimmetriche.',
                default: 'L\'affondo è un esercizio unilaterale fondamentale che sviluppa forza, equilibrio e coordinazione. Corregge asimmetrie tra gli arti e ha alto transfer funzionale per attività sportive e quotidiane.'
            }
        },
        
        'squat': {
            name: 'Squat',
            category: 'lower_body',
            primaryMuscles: ['quadriceps', 'glutes'],
            secondaryMuscles: ['hamstrings', 'erectors', 'core'],
            
            execution: {
                setup: 'Posiziona i piedi tra larghezza spalle e larghezza fianchi. Le punte possono essere dritte o extraruotate (15-30°) in base alla tua struttura e mobilità. La posizione ottimale è quella che ti permette di scendere mantenendo il peso distribuito su tutto il piede.',
                movement: 'Inizia il movimento piegando simultaneamente anche e ginocchia. La profondità dipende dalla tua mobilità e obiettivo: il parallelo è un buon riferimento, ma scendere oltre può aumentare l\'attivazione glutei se hai la mobilità necessaria. Le ginocchia possono avanzare oltre le punte dei piedi - è normale e sicuro se i talloni restano a terra.',
                breathing: 'Inspira e crea tensione addominale (bracing) prima di scendere. Mantieni durante la discesa. Espira durante la salita o dopo aver superato il punto più difficile.',
                commonMistakes: [
                    'Ginocchia che collassano verso l\'interno sotto carico - indica debolezza adduttori/glutei o scarso controllo motorio',
                    'Talloni che si alzano - può indicare mobilità caviglia limitata, prova un rialzo sotto i talloni',
                    'Perdita della lordosi lombare ("butt wink") - riduci la profondità al punto dove riesci a mantenere la schiena neutra',
                    'Busto che cade eccessivamente avanti - può dipendere da leve (femori lunghi) o mobilità, una stance più larga può aiutare'
                ]
            },
            
            focusVariants: {
                quadriceps: {
                    title: 'Focus Quadricipiti',
                    technique: 'Stance più stretta (larghezza spalle). Busto più verticale. Permetti alle ginocchia di avanzare. Questo aumenta il momento flettente sul ginocchio e quindi lo stress sui quadricipiti.',
                    cues: ['Ginocchia avanti', 'Busto dritto', 'Piedi larghezza spalle'],
                    when: 'Quando l\'obiettivo è massimizzare lo sviluppo dei quadricipiti'
                },
                glutes: {
                    title: 'Focus Glutei',
                    technique: 'Stance più larga. "Siediti indietro" enfatizzando l\'hip hinge. Questo aumenta il momento flettente sull\'anca e l\'allungamento dei glutei. Maggiore profondità = maggiore attivazione glutei.',
                    cues: ['Piedi più larghi', 'Siediti indietro', 'Profondità massima controllata'],
                    when: 'Per enfatizzare glutei e catena posteriore'
                },
                power: {
                    title: 'Focus Potenza',
                    technique: 'Discesa controllata (2-3 sec), poi esplodi nella salita. Il pause squat (2 sec in basso) elimina il riflesso di stretch e forza una contrazione concentrica pura. Box squat per imparare a generare forza da fermo.',
                    cues: ['Discesa controllata', 'Pausa in basso', 'Esplodi su'],
                    when: 'Per sviluppare rate of force development e transfer atletico'
                },
                strength: {
                    title: 'Focus Forza Massimale',
                    technique: 'Low bar position (bilanciere sui deltoidi posteriori) riduce il momento flettente sulla schiena permettendo carichi maggiori. Inclinazione busto maggiore è normale. Lavora su serie da 1-5 rep.',
                    cues: ['Bilanciere basso', 'Petto alto', 'Drive dal bacino'],
                    when: 'Per massimizzare il carico sollevato e la forza assoluta'
                }
            },
            
            sportContext: {
                boxe: 'Lo squat costruisce la base per la potenza dei colpi. La forza generata parte dalle gambe e si trasferisce attraverso la rotazione del core fino ai pugni. Sviluppa anche la resistenza necessaria per mantenere la guardia durante i round.',
                calcio: 'Fondamentale per sprint, salti e contrasti. La forza degli arti inferiori correla direttamente con velocità di sprint e potenza nei cambi di direzione. Aiuta nella prevenzione infortuni stabilizzando ginocchio e anca.',
                basket: 'Essenziale per il salto verticale e la potenza nei movimenti in area. Studi mostrano correlazione tra forza nello squat e altezza del salto. Importante per la resistenza nei quarti finali.',
                crossfit: 'Movimento fondamentale presente in molti WOD. La tecnica efficiente risparmia energia per il resto del workout. Il front squat e overhead squat richiedono mobilità e stabilità specifiche.',
                default: 'Lo squat è considerato il re degli esercizi per gli arti inferiori. Allena pattern motori fondamentali dell\'essere umano, sviluppa forza funzionale trasferibile a qualsiasi attività sportiva e quotidiana.'
            }
        },
        
        'deadlift': {
            name: 'Stacco da Terra / Deadlift',
            category: 'lower_body',
            primaryMuscles: ['hamstrings', 'glutes', 'erectors'],
            secondaryMuscles: ['lats', 'traps', 'forearms', 'core'],
            
            execution: {
                setup: 'Posizionati con il bilanciere sopra la metà del piede (circa 2-3 cm dagli stinchi). La larghezza dei piedi varia: convenzionale (larghezza fianchi) o sumo (larga) - dipende dalla tua struttura e preferenza. Presa appena fuori dalle ginocchia nel convenzionale.',
                movement: 'Porta le anche indietro fino ad afferrare il bilanciere, mantenendo la schiena in posizione neutra. Il movimento è una spinta delle gambe contro il pavimento mentre le anche si estendono. Il bilanciere deve rimanere a contatto con il corpo durante tutto il movimento per ridurre il momento sulla schiena.',
                breathing: 'Grande respiro e bracing addominale PRIMA di iniziare la trazione. Mantieni durante tutta la salita. Espira solo al lockout. Questo protegge la colonna sotto carico.',
                commonMistakes: [
                    'Schiena che si arrotonda (cifosi lombare) - riduce la capacità di trasmettere forza e aumenta stress sui dischi. Se succede, riduci il carico e lavora sulla mobilità/forza posturale',
                    'Bilanciere che si allontana dal corpo - aumenta esponenzialmente il momento sulla schiena. Pensa a "raschiare" le gambe con il bilanciere',
                    'Tirare con la schiena invece di spingere con le gambe - lo stacco è una spinta, non una trazione. Le gambe iniziano il movimento, la schiena mantiene la posizione',
                    'Iperestensione lombare al lockout - non serve ed è potenzialmente dannoso. Il lockout corretto è con anche completamente estese e glutei contratti, non con la schiena inarcata'
                ]
            },
            
            focusVariants: {
                hamstrings: {
                    title: 'Focus Hamstrings',
                    technique: 'Romanian Deadlift (RDL): mantieni le ginocchia quasi dritte (15-20° flessione) e porta i fianchi indietro. Questo enfatizza l\'hip hinge puro e massimizza lo stretch sugli hamstrings. Il bilanciere scende lungo le cosce. Fermati quando senti il massimo stretch senza perdere la posizione della schiena.',
                    cues: ['Ginocchia semifisse', 'Spingi fianchi indietro', 'Senti lo stretch'],
                    when: 'Obiettivo sviluppo femorali o miglioramento pattern hip hinge'
                },
                glutes: {
                    title: 'Focus Glutei',
                    technique: 'Sumo deadlift con stance larga e punte extraruotate (45°+). Questa posizione riduce il momento sulla schiena e aumenta la partecipazione dei glutei e adduttori. Al lockout enfatizza la contrazione dei glutei "spingendo i fianchi attraverso il bilanciere".',
                    cues: ['Stance larga', 'Ginocchia fuori', 'Squeeze glutei al top'],
                    when: 'Atleti con leve sfavorevoli al convenzionale o focus su glutei'
                },
                back: {
                    title: 'Focus Schiena',
                    technique: 'Deficit deadlift (5-10cm rialzo) aumenta il ROM e quindi lo stress sugli erettori spinali. Richiede più mobilità. Utile per superare punti deboli nella prima parte del movimento. Snatch grip (presa larga) è un\'altra variante che aumenta lo stress sulla schiena.',
                    cues: ['Stai su rialzo', 'Posizione più bassa', 'Tensione massima'],
                    when: 'Miglioramento forza erettori o superamento sticking point basso'
                },
                strength: {
                    title: 'Focus Forza Massimale',
                    technique: 'Lavora su singole o doppie pesanti con focus sulla tecnica perfetta. Il paused deadlift (1-2 sec appena staccato da terra) elimina il momentum e forza produzione di forza pulita. Utile per identificare e correggere debolezze.',
                    cues: ['Carico pesante', 'Pausa se necessario', 'Tecnica perfetta'],
                    when: 'Fase di massimizzazione della forza'
                }
            },
            
            sportContext: {
                boxe: 'Lo stacco sviluppa la potenza della catena posteriore che è fondamentale per la rotazione del core nei colpi. Un pugile con stacco forte può generare più potenza dal terreno verso l\'alto. Sviluppa anche la presa, utile nel clinch.',
                calcio: 'Previene infortuni agli hamstrings che sono tra i più comuni nel calcio. La forza eccentrica degli hamstrings sviluppata con RDL protegge durante sprint ad alta velocità. Importante per potenza nei cambi di direzione e nei contrasti.',
                basket: 'Costruisce potenza per rimbalzi aggressivi e contatti in area. La forza della catena posteriore contribuisce al salto verticale e alla stabilità negli atterraggi.',
                default: 'Lo stacco è probabilmente l\'esercizio che permette di sollevare il carico maggiore, rendendolo eccellente per lo sviluppo della forza totale. Allena l\'intero corpo con enfasi sulla catena posteriore e insegna a generare e trasmettere forza in modo efficiente.'
            }
        },
        
        'trap_bar_deadlift': {
            name: 'Trap Bar Deadlift',
            category: 'lower_body',
            primaryMuscles: ['quadriceps', 'glutes', 'hamstrings'],
            secondaryMuscles: ['erectors', 'traps', 'core'],
            
            execution: {
                setup: 'Entra nella trap bar e posizionati al centro. I piedi alla larghezza dei fianchi con le punte leggermente extraruotate. Le maniglie della trap bar sono tipicamente in posizione neutra, il che riduce lo stress sulle spalle rispetto al bilanciere. Puoi usare le maniglie alte (più facile, meno ROM) o basse (più impegnativo, più transfer al deadlift tradizionale).',
                movement: 'La trap bar permette un pattern ibrido tra squat e stacco. Puoi enfatizzare uno o l\'altro: per più "squat-like", siediti di più con il busto verticale; per più "deadlift-like", inclina il busto e spingi i fianchi indietro. Il vantaggio principale è che il carico è ai lati (non davanti), riducendo il momento sulla schiena.',
                breathing: 'Respiro profondo e bracing addominale prima di sollevare. Mantieni la pressione intra-addominale durante tutto il movimento. Espira al lockout.',
                commonMistakes: [
                    'Posizione non centrata nella trap bar - sbilancia il carico e rende il movimento inefficiente. Assicurati che le mani siano equidistanti',
                    'Trattarlo esattamente come uno squat o un deadlift - è un ibrido, trova la tua posizione ottimale sperimentando diverse inclinazioni del busto',
                    'Ignorare la qualità del bracing perché "sembra più facile" - i carichi che puoi sollevare sono spesso superiori al deadlift tradizionale, quindi il bracing è altrettanto importante',
                    'Usare sempre solo le maniglie alte - limita il ROM. Alterna con le maniglie basse per sviluppo completo'
                ]
            },
            
            focusVariants: {
                quadriceps: {
                    title: 'Focus Quadricipiti',
                    technique: 'Siediti di più nella posizione iniziale con il busto più verticale. Questo aumenta la flessione delle ginocchia e quindi il lavoro dei quadricipiti. Simile a uno squat ma con il carico distribuito ai lati. Le maniglie alte facilitano questa variante.',
                    cues: ['Busto verticale', 'Siedi nelle anche', 'Spingi il pavimento'],
                    when: 'Chi vuole più enfasi sui quad o ha problemi con lo squat tradizionale'
                },
                posterior_chain: {
                    title: 'Focus Catena Posteriore',
                    technique: 'Usa le maniglie basse e inclina il busto di più, simile a un deadlift convenzionale. Questo aumenta il coinvolgimento di hamstrings e glutei. Il movimento diventa più hip-dominant.',
                    cues: ['Maniglie basse', 'Hip hinge', 'Fianchi indietro'],
                    when: 'Per transfer al deadlift tradizionale o focus posteriore'
                },
                power: {
                    title: 'Focus Potenza',
                    technique: 'Jump Shrug con trap bar: tira esplosivamente estendendo caviglie, ginocchia e anche simultaneamente (tripla estensione). Non devi saltare realmente, ma l\'intenzione è quella. Carichi moderati (50-70% 1RM) per massimizzare la velocità.',
                    cues: ['Esplodi verso l\'alto', 'Tripla estensione', 'Velocità massima'],
                    when: 'Atleti che necessitano potenza esplosiva'
                }
            },
            
            sportContext: {
                boxe: 'Eccellente per sviluppare potenza da terra verso l\'alto in modo sicuro. La posizione con presa neutra riduce lo stress sulle spalle - utile per pugili che non vogliono affaticare le spalle già sotto stress dall\'allenamento specifico. Ottimo per jump shrugs.',
                calcio: 'Permette di sollevare carichi pesanti con minor stress lombare rispetto al deadlift tradizionale. Ideale per sviluppare potenza in atleti con alto volume di allenamento specifico. I jump shrugs sono eccellenti per esplosività.',
                basket: 'Sviluppa potenza verticale per il salto. La trap bar è spesso preferita negli sport dove la schiena è già sotto stress. I carichi elevati che permette sono ottimi per sviluppare forza massimale che poi si traduce in potenza.',
                default: 'La trap bar è uno strumento eccellente per chi vuole i benefici del deadlift con minor stress lombare. Permette spesso di sollevare il 5-10% in più rispetto al convenzionale. Ottima per atleti con precedenti problemi alla schiena o alto volume di altri esercizi.'
            }
        },
        
        'box_jump': {
            name: 'Box Jump',
            category: 'plyometric',
            primaryMuscles: ['quadriceps', 'glutes', 'calves'],
            secondaryMuscles: ['hamstrings', 'core'],
            
            execution: {
                setup: 'Posizionati a circa 30-50cm dal box. La distanza dipende dalla tua altezza e dalla tecnica che vuoi usare - più vicino = più verticale, più lontano = più orizzontale. Piedi alla larghezza delle spalle o leggermente più larghi. L\'altezza del box dovrebbe permetterti di atterrare in una posizione atletica (non con le ginocchia al petto).',
                movement: 'Inizia con un contro-movimento: braccia in alto, poi oscillale in basso mentre pieghi le ginocchia. Questo carica il ciclo stretch-shortening nei muscoli. Esplodi verso l\'alto coordinando braccia (che oscillano in avanti/alto) e gambe. L\'obiettivo è saltare IN ALTO, non raccogliere le ginocchia. Atterra morbido con tutto il piede sul box in posizione atletica (quarter squat). SEMPRE step down, mai saltare giù.',
                breathing: 'Espira in modo esplosivo durante il salto - questo aumenta l\'attivazione del core e la potenza prodotta.',
                commonMistakes: [
                    'Saltare giù dal box - lo stress articolare dell\'atterraggio può essere 2-3x il peso corporeo. Sempre step down per preservare le articolazioni',
                    'Box troppo alto che richiede di portare le ginocchia al petto - non stai saltando più in alto, stai solo raccogliendo le gambe. Usa un box che ti permetta di atterrare in quarter squat',
                    'Atterraggio rumoroso - indica mancanza di controllo eccentrico. L\'atterraggio deve essere morbido e controllato',
                    'Non usare le braccia - le braccia contribuiscono significativamente al salto. L\'oscillazione coordinata aumenta l\'altezza del 10-15%'
                ]
            },
            
            focusVariants: {
                height: {
                    title: 'Focus Altezza Massima',
                    technique: 'Usa un box appropriato e concentrati sulla massima elevazione del centro di massa. Il focus è sulla tripla estensione completa (caviglie, ginocchia, anche). Non sacrificare la tecnica per box più alti - se devi raccogliere le ginocchia al petto, il box è troppo alto.',
                    cues: ['Tripla estensione completa', 'Braccia in alto', 'Atterra in squat parziale'],
                    when: 'Sviluppo salto verticale per basket, volley, o sport con requisiti di salto'
                },
                reactive: {
                    title: 'Focus Potenza Reattiva',
                    technique: 'Depth Jump: cadi da un box (30-50cm), atterra brevemente e rimbalza immediatamente su un secondo box o verso l\'alto. Il contatto a terra deve essere minimo (150-200ms). Questo allena il riflesso stretch-shortening. AVANZATO: richiede buona base di forza (almeno 1.5x BW squat raccomandato).',
                    cues: ['Contatto minimo a terra', 'Rimbalza come una molla', 'Rigidità alle caviglie'],
                    when: 'Atleti avanzati che vogliono migliorare la potenza reattiva'
                },
                conditioning: {
                    title: 'Focus Condizionamento',
                    technique: 'Box jump ripetuti a intensità moderata con focus sulla consistenza tecnica. Altezza submassimale (60-70% del tuo massimo). Ottimo per condizionamento metabolico mantenendo elemento di potenza.',
                    cues: ['Ritmo costante', 'Tecnica consistente', 'Step down veloce'],
                    when: 'Sessioni di conditioning con componente pliometrica'
                }
            },
            
            sportContext: {
                boxe: 'Sviluppa esplosività del lower body che si trasferisce alla potenza dei colpi e alla reattività del footwork. La coordinazione braccia-gambe del box jump rispecchia la coordinazione necessaria per pugni potenti. Utile per la capacità di entrare e uscire rapidamente dal range.',
                basket: 'Transfer diretto al salto verticale in partita. Lavora sui depth jumps per migliorare i salti reattivi (secondi salti rapidi per rimbalzi). Il box jump sviluppa anche la confidenza nel saltare verso oggetti.',
                calcio: 'Potenza per salti di testa, contrasti aerei e la prima esplosione negli sprint. I salti laterali sul box migliorano anche i cambi di direzione. Importante per portieri nei tuffi.',
                default: 'Il box jump è l\'esercizio pliometrico più accessibile e sicuro (atterraggio ammortizzato). Sviluppa potenza esplosiva senza lo stress articolare dei salti con atterraggio a terra. Ottimo per insegnare la coordinazione della tripla estensione.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════
        // UPPER BODY - PUSH
        // ═══════════════════════════════════════════════════════════════
        
        'push_up': {
            name: 'Push-Up / Piegamenti',
            category: 'upper_push',
            primaryMuscles: ['pectorals', 'triceps', 'anterior_deltoids'],
            secondaryMuscles: ['core', 'serratus'],
            
            execution: {
                setup: 'Mani posizionate leggermente più larghe delle spalle - ma la larghezza ottimale varia in base alla tua struttura e all\'obiettivo. Dita che puntano in avanti o leggermente extraruotate. Il corpo deve formare una linea retta dalla testa ai talloni - attiva il core come se stessi per ricevere un pugno. Le scapole iniziano in posizione neutra (né protratte né retratte).',
                movement: 'Abbassa il corpo piegando i gomiti, mantenendoli a circa 45-60° rispetto al busto (non a 90°, che stressa l\'articolazione della spalla). Il petto dovrebbe quasi toccare terra. Spingi via il pavimento tornando su, permettendo alle scapole di protrarsi naturalmente in cima (importante per la salute del serratus anterior). Il movimento è completo quando le braccia sono dritte.',
                breathing: 'Inspira durante la discesa, espira durante la spinta. Mantieni il core attivo durante tutto il movimento.',
                commonMistakes: [
                    'Fianchi che cadono verso terra - indica debolezza del core. Se succede, regredisci a push-up inclinati o plank per costruire forza del core prima',
                    'Fianchi troppo alti (forma a "V") - spesso compensazione per mancanza di forza. Assicurati che il core sia attivo e la linea del corpo dritta',
                    'Gomiti che si aprono a 90° - aumenta lo stress sull\'articolazione della spalla. Mantienili a 45-60° rispetto al busto per proteggere le spalle',
                    'Range of motion incompleto - sia in alto che in basso. ROM completo costruisce forza in tutto l\'arco di movimento',
                    'Testa che cade in avanti - mantieni collo neutro guardando leggermente avanti (non dritto in basso)'
                ]
            },
            
            focusVariants: {
                chest: {
                    title: 'Focus Petto',
                    technique: 'Mani più larghe (1.5x larghezza spalle) con gomiti a 45°. Questa posizione aumenta l\'allungamento del pettorale nel punto basso e quindi la sua attivazione. Scendi completamente fino a quasi toccare terra con il petto. In cima, pensa a "stringere" i pettorali insieme.',
                    cues: ['Mani larghe', 'Gomiti a 45°', 'Squeeze pettorali in alto'],
                    when: 'Quando l\'obiettivo è ipertrofia o forza del petto'
                },
                triceps: {
                    title: 'Focus Tricipiti',
                    technique: 'Diamond push-up (mani vicine formando un triangolo) o mani alla larghezza spalle con gomiti stretti al corpo. La posizione stretta riduce la leva del pettorale e aumenta il lavoro dei tricipiti. Più impegnativo del push-up standard.',
                    cues: ['Mani strette', 'Gomiti vicino al corpo', 'Estendi completamente'],
                    when: 'Focus su tricipiti o per atleti che necessitano forza di estensione (es. pugili per il jab)'
                },
                power: {
                    title: 'Focus Potenza',
                    technique: 'Explosive/Clap push-up: scendi controllato, poi esplodi così forte da staccare le mani da terra. Atterra con gomiti morbidi per assorbire l\'impatto. Richiede buona base di forza (almeno 30 push-up puliti). Per principianti: push-up esplosivi contro muro o panca inclinata.',
                    cues: ['Discesa controllata', 'Esplosione massima', 'Atterraggio morbido'],
                    when: 'Atleti che necessitano potenza di spinta esplosiva'
                },
                core: {
                    title: 'Focus Core',
                    technique: 'Push-up con variazioni instabili: una mano su medball, anelli, o TRX. L\'instabilità richiede maggiore attivazione del core e dei muscoli stabilizzatori. Procedi gradualmente: prima padroneggia il push-up standard.',
                    cues: ['Core sempre attivo', 'Movimenti controllati', 'Zero rotazione del corpo'],
                    when: 'Sviluppo stabilità e controllo del core'
                }
            },
            
            sportContext: {
                boxe: 'Movimento fondamentale per pugili. Sviluppa la potenza di spinta necessaria per jab e cross. La versione esplosiva allena la velocità di estensione del braccio. Il lavoro del core durante il push-up simula il bracing necessario per trasferire potenza dalle gambe attraverso il core nei pugni.',
                calcio: 'Forza per proteggere la palla, resistere ai contrasti e rialzarsi rapidamente dopo i contatti. I push-up esplosivi migliorano la capacità di spingere via gli avversari.',
                basket: 'Forza per il contatto in area, rimbalzi e box-out. La resistenza muscolare alta (molte ripetizioni) è particolarmente importante per mantenere la forza durante tutta la partita.',
                default: 'Il push-up è probabilmente l\'esercizio a corpo libero più versatile. Allena petto, spalle, tricipiti e core simultaneamente. Esistono infinite progressioni e varianti che permettono di adattarlo a qualsiasi livello e obiettivo.'
            }
        },
        
        'bench_press': {
            name: 'Panca Piana / Bench Press',
            category: 'upper_push',
            primaryMuscles: ['pectorals', 'triceps', 'anterior_deltoids'],
            secondaryMuscles: ['lats', 'core'],
            
            execution: {
                setup: 'Sdraiato sulla panca con gli occhi sotto il bilanciere. Piedi piantati saldamente a terra (posizione che varia in base alla tua struttura - alcuni preferiscono piedi più avanti, altri più indietro). Scapole retratte e depresse - "metti le scapole in tasca". Questo crea una base stabile e protegge le spalle. Un arco lombare naturale è normale e desiderabile, l\'intensità dell\'arco dipende dalla mobilità e obiettivi (powerlifters usano archi maggiori). Afferra il bilanciere con presa tale che gli avambracci siano verticali quando la barra tocca il petto.',
                movement: 'Stacca il bilanciere con le braccia dritte e portalo sopra le spalle. Abbassa in modo controllato verso lo sterno basso (non verso il collo). I gomiti dovrebbero essere a 45-75° rispetto al busto - trova l\'angolo che senti più forte e comodo per la tua struttura. Tocca il petto brevemente, poi spingi verso l\'alto e leggermente indietro verso la posizione iniziale sopra le spalle.',
                breathing: 'Grande respiro e bracing addominale PRIMA della discesa. Mantieni il fiato durante la discesa e l\'inizio della spinta. Espira durante la parte finale della concentrica o al lockout.',
                commonMistakes: [
                    'Rimbalzare il bilanciere sul petto - elimina tensione e controllo. Tocca e spingi, non rimbalzare. Se devi rimbalzare, il peso è troppo pesante',
                    'Piedi che si alzano o muovono - perdi leg drive e stabilità. I piedi dovrebbero rimanere piantati, la spinta delle gambe aiuta il movimento',
                    'Scapole che si protraggono - le scapole devono rimanere retratte e depresse durante tutto il movimento. Se si staccano, perdi stabilità e lo stress passa alle spalle',
                    'Polsi piegati all\'indietro - il bilanciere dovrebbe essere sopra l\'avambraccio, non dietro. Polsi neutri proteggono l\'articolazione e permettono transfer di forza ottimale',
                    'Traiettoria verticale della barra - la barra non va dritta su e giù, ma segue un arco: giù verso lo sterno, su verso sopra le spalle'
                ]
            },
            
            focusVariants: {
                chest: {
                    title: 'Focus Petto',
                    technique: 'Presa più larga (indici sugli anelli del bilanciere o oltre) con pausa di 1-2 secondi al petto. La presa larga aumenta l\'allungamento del pettorale. La pausa elimina lo stretch reflex e forza il pettorale a lavorare di più dalla posizione di massimo allungamento. Questo è anche ottimo per costruire forza dal petto.',
                    cues: ['Presa larga', 'Pausa al petto', 'Squeeze pettorali in alto'],
                    when: 'Ipertrofia pettorale o miglioramento della forza dal petto'
                },
                triceps: {
                    title: 'Focus Tricipiti',
                    technique: 'Close Grip Bench Press: mani alla larghezza delle spalle o leggermente più strette. I gomiti rimangono più stretti al corpo. Questo riduce il contributo del pettorale e aumenta il lavoro dei tricipiti, specialmente nella parte alta del movimento. Enfatizza il lockout completo.',
                    cues: ['Presa stretta', 'Gomiti vicini al corpo', 'Lockout esplosivo'],
                    when: 'Sviluppo tricipiti o miglioramento lockout'
                },
                power: {
                    title: 'Focus Potenza',
                    technique: 'Speed Bench: usa 50-60% del 1RM e spingi il più velocemente possibile. La discesa è controllata (1-2 sec), poi esplodi. Puoi usare elastici o catene per accommodating resistance (aumenta la difficoltà man mano che spingi). 2-3 ripetizioni per set, molti set.',
                    cues: ['Peso moderato', 'Discesa controllata', 'Esplosione massima'],
                    when: 'Atleti che necessitano potenza di spinta o plateau nella forza'
                },
                strength: {
                    title: 'Focus Forza Massimale',
                    technique: 'Lavoro su singole, doppie e triple pesanti (85-95% 1RM). Paused bench elimina il momentum e costruisce forza vera. Board press o floor press per lavorare su punti deboli specifici (metà movimento o lockout). Pins press per allenare punti di stallo.',
                    cues: ['Carico pesante', 'Tecnica perfetta', 'Setup solido'],
                    when: 'Fase di forza massimale o powerlifting'
                }
            },
            
            sportContext: {
                boxe: 'Costruisce la forza di spinta orizzontale che si trasferisce ai pugni diretti (jab, cross). La close grip è spesso preferita per pugili perché simula meglio il pattern del pugno e sviluppa tricipiti forti per l\'estensione veloce del braccio. Speed bench eccellente per potenza nei pugni.',
                calcio: 'Forza per contrasti, protezione palla e rimesse laterali lunghe. La capacità di spingere via gli avversari è direttamente correlata alla forza sulla panca. Importante anche per rialzarsi rapidamente dopo i contatti.',
                basket: 'Forza per contatti sotto canestro, box-out e difesa fisica. La resistenza nella forza (capacità di mantenere la forza durante tutta la partita) è importante quanto la forza massimale.',
                default: 'La panca piana è probabilmente l\'esercizio più popolare in palestra. È eccellente per sviluppare forza e massa dell\'upper body anteriore. Il pattern di spinta orizzontale si trasferisce a molte attività sportive e quotidiane.'
            }
        },
        
        'overhead_press': {
            name: 'Military Press / Overhead Press',
            category: 'upper_push',
            primaryMuscles: ['deltoids', 'triceps'],
            secondaryMuscles: ['upper_chest', 'traps', 'core'],
            
            execution: {
                setup: 'In piedi con i piedi alla larghezza delle spalle, bilanciere posizionato sulle clavicole e deltoidi anteriori. Presa leggermente più larga delle spalle - gli avambracci dovrebbero essere verticali quando il bilanciere è sulle clavicole. Gomiti leggermente avanti rispetto alla barra (non direttamente sotto). Core e glutei attivi per stabilizzare il tronco.',
                movement: 'Prima di spingere, inclina leggermente la testa indietro (non il busto!) per permettere una traiettoria verticale della barra. Spingi il bilanciere verso l\'alto passando vicino al viso. Appena la barra supera la fronte, porta la testa in avanti "attraverso la finestra" creata dalle braccia. Lockout completo con braccia dritte, bilanciere sopra la linea mediana del piede, orecchie in linea con le braccia. Abbassa lungo lo stesso percorso.',
                breathing: 'Grande respiro e bracing addominale PRIMA di spingere. Mantieni la pressione durante la spinta. Puoi espirare gradualmente durante la seconda metà della concentrica o al lockout.',
                commonMistakes: [
                    'Inarcare eccessivamente la schiena - compensazione per mancanza di forza o mobilità. Se succede, riduci il peso. Un piccolo layback è normale, ma non dovrebbe essere eccessivo',
                    'Non portare la testa avanti dopo il passaggio della barra - lascia la barra davanti al corpo invece che direttamente sopra, rendendo il movimento inefficiente e stressante per le spalle',
                    'Gomiti che si aprono lateralmente - i gomiti dovrebbero rimanere leggermente avanti e sotto i polsi, non aperti a 90°',
                    'Lockout incompleto - il movimento finisce con braccia completamente estese e barra sopra la linea mediana del piede',
                    'Usare le gambe (quando non è intenzionale) - se devi piegare le ginocchia per iniziare, il peso è troppo pesante per strict press'
                ]
            },
            
            focusVariants: {
                anterior: {
                    title: 'Focus Deltoide Anteriore',
                    technique: 'Presa alla larghezza delle spalle o leggermente più stretta con gomiti più avanti. Questa posizione enfatizza il deltoide anteriore rispetto al laterale. Mantieni una traiettoria strettamente verticale. Arnold Press (con manubri) è un\'altra variante che enfatizza l\'anteriore.',
                    cues: ['Presa stretta', 'Gomiti avanti', 'Traiettoria verticale'],
                    when: 'Sviluppo deltoide anteriore o chi ha spalle larghe che preferiscono presa stretta'
                },
                lateral: {
                    title: 'Focus Deltoide Laterale',
                    technique: 'Presa più larga (oltre la larghezza spalle) con gomiti leggermente più aperti. Questa posizione aumenta l\'abduzione della spalla e quindi il coinvolgimento del deltoide laterale. Attenzione: presa troppo larga può stressare le spalle.',
                    cues: ['Presa larga', 'Gomiti leggermente aperti', 'Senti i deltoidi laterali'],
                    when: 'Chi vuole enfatizzare la larghezza delle spalle'
                },
                power: {
                    title: 'Focus Potenza',
                    technique: 'Push Press: usa un dip delle ginocchia (1/4 squat) seguito da drive esplosivo delle gambe per iniziare il movimento, poi completa con le braccia. Permette di usare carichi più pesanti e sviluppa potenza totale del corpo. È un movimento atletico che si trasferisce bene agli sport.',
                    cues: ['Dip rapido', 'Drive gambe esplosivo', 'Completa con braccia'],
                    when: 'Atleti che vogliono potenza overhead o superare plateau nello strict press'
                },
                strength: {
                    title: 'Focus Forza Strict',
                    technique: 'Z-Press (seduto a terra senza supporto) elimina completamente il contributo delle gambe e richiede eccellente core strength. Paused press (1-2 sec a livello mento) costruisce forza nel punto più debole. Pin press per lavorare su punti specifici.',
                    cues: ['Zero momentum', 'Core sempre attivo', 'Movimento controllato'],
                    when: 'Chi vuole forza strict pura o ha tendenza a usare troppo le gambe'
                }
            },
            
            sportContext: {
                boxe: 'Costruisce forza per uppercut e ganci che richiedono spinta verticale. Eccellente per la stabilità delle spalle necessaria a mantenere la guardia alta durante tutto il round. Il push press sviluppa la coordinazione gambe-core-braccia che rispecchia la meccanica dei pugni potenti.',
                basket: 'Forza per tiri da lontano (rilascio alto), passaggi sopra la testa e difesa con le braccia alte. La resistenza delle spalle è importante per mantenere le braccia alte in difesa per tutta la partita.',
                crossfit: 'Movimento fondamentale che progredisce verso push press, push jerk e split jerk. La tecnica strict è la base per tutti i movimenti overhead. Anche componente del thruster.',
                default: 'L\'overhead press è considerato il vero test di forza della parte superiore del corpo - nessuna panca su cui appoggiarsi, solo te contro la gravità. Costruisce spalle forti e stabili e richiede eccellente core strength.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════
        // UPPER BODY - PULL
        // ═══════════════════════════════════════════════════════════════
        
        'pull_up': {
            name: 'Pull-Up / Trazioni',
            category: 'upper_pull',
            primaryMuscles: ['lats', 'biceps', 'rear_deltoids'],
            secondaryMuscles: ['forearms', 'rhomboids', 'core'],
            
            execution: {
                setup: 'Afferra la sbarra con presa prona (palmi avanti) leggermente più larga delle spalle. La larghezza esatta dipende dalla tua struttura - sperimenta per trovare la posizione più forte e comoda. Appendi con le braccia completamente distese, spalle rilassate verso le orecchie (dead hang), poi attiva le scapole tirandole verso il basso e indietro (active hang) - questo è il punto di partenza di ogni rep.',
                movement: 'Inizia tirando i gomiti verso i fianchi mentre porti il petto verso la sbarra. L\'obiettivo è portare il petto (non il mento!) alla sbarra. Il corpo può inclinarsi leggermente all\'indietro per permettere questo. In cima, le scapole sono completamente retratte e depresse. Scendi in modo controllato fino al dead hang completo - il ROM completo è fondamentale per la salute delle spalle e lo sviluppo della forza.',
                breathing: 'Espira durante la trazione (concentrica), inspira durante la discesa (eccentrica). In alternativa, alcuni preferiscono trattenere durante la trazione per maggiore rigidità.',
                commonMistakes: [
                    'Kipping o usare momentum - toglie lavoro ai muscoli e non costruisce forza vera. Il kipping ha il suo posto (CrossFit), ma per costruire forza e massa serve lo strict',
                    'ROM incompleto in basso - non distendere completamente le braccia riduce lo sviluppo e può creare squilibri. Dead hang completo ad ogni rep',
                    'Allungare il collo per "arrivare" - il mento sopra la sbarra non è l\'obiettivo, il petto che tocca lo è. Se devi allungare il collo, non sei ancora pronto per quel livello',
                    'Scapole che rimangono elevate - le scapole devono muoversi: depressione/retrazione in salita, elevazione/protrazione in discesa. Questo è fondamentale per la salute delle spalle',
                    'Gomiti che puntano troppo indietro invece che verso i fianchi - penalizza l\'attivazione dei dorsali'
                ]
            },
            
            focusVariants: {
                lats: {
                    title: 'Focus Dorsali',
                    technique: 'Presa più larga (1.5x larghezza spalle) con focus sul tirare i gomiti verso i fianchi, non indietro. Inclina leggermente il corpo all\'indietro per permettere al petto di arrivare alla sbarra. Questa posizione enfatizza i dorsali rispetto ai bicipiti. Pausa in alto con squeeze delle scapole.',
                    cues: ['Presa larga', 'Gomiti ai fianchi', 'Petto alla sbarra', 'Squeeze scapole'],
                    when: 'Sviluppo larghezza schiena e dorsali'
                },
                biceps: {
                    title: 'Focus Bicipiti',
                    technique: 'Chin-up: presa supina (palmi verso di te) alla larghezza delle spalle o più stretta. Questa presa mette i bicipiti in posizione meccanicamente vantaggiosa, aumentando il loro contributo. Il chin-up è generalmente più facile del pull-up per questo motivo.',
                    cues: ['Palmi verso di te', 'Presa stretta', 'Senti i bicipiti lavorare'],
                    when: 'Costruire forza per il primo pull-up o enfasi sui bicipiti'
                },
                strength: {
                    title: 'Focus Forza',
                    technique: 'Weighted pull-up con zavorra (cintura, giubbotto, manubrio tra le gambe). Lavora su 3-5 rep pesanti. Pause pull-up (2-3 sec in alto) aumentano tempo sotto tensione. Eccentriche lente (5 sec discesa) costruiscono forza se non riesci ancora a fare i pull-up completi.',
                    cues: ['Aggiungi peso progressivamente', 'Pausa in alto', 'Eccentrica lenta'],
                    when: 'Chi vuole forza massimale o sta progredendo verso pull-up pesanti'
                },
                endurance: {
                    title: 'Focus Resistenza',
                    technique: 'Emom o cluster set per accumulare volume totale. Invece di fare 3x10 (rischiando il failure), fai 10 set di 5 ogni minuto. Permette volume totale maggiore con tecnica migliore. Ottimo per chi vuole aumentare il numero massimo di rep.',
                    cues: ['Volume alto', 'Tecnica consistente', 'Frequenza alta'],
                    when: 'Aumentare resistenza o numero massimo di ripetizioni'
                }
            },
            
            sportContext: {
                boxe: 'Forza di trazione fondamentale per il clinch - tirare l\'avversario, controllarlo, sbilanciarlo. I dorsali contribuiscono anche alla potenza dei ganci e alla velocità di retrazione del braccio dopo il pugno. Eccellente per la presa.',
                arrampicata: 'Il movimento primario dell\'arrampicata. La forza di trazione costruita con i pull-up si trasferisce direttamente. Varianti come one-arm work, offset grip e lock-off sono particolarmente utili.',
                nuoto: 'Forza per la bracciata, specialmente in stile libero e dorso. I dorsali sono i motori primari della fase di trazione in acqua. Volume alto di pull-up costruisce la resistenza necessaria.',
                default: 'Il pull-up è considerato il re degli esercizi a corpo libero per l\'upper body. Costruisce dorsali, bicipiti, presa e core simultaneamente. La capacità di trazionare il proprio peso corporeo è un indicatore fondamentale di forza funzionale.'
            }
        },
        
        'barbell_row': {
            name: 'Rematore con Bilanciere / Barbell Row',
            category: 'upper_pull',
            primaryMuscles: ['lats', 'rhomboids', 'rear_deltoids'],
            secondaryMuscles: ['biceps', 'erectors', 'core'],
            
            execution: {
                setup: 'Parti dalla posizione di deadlift e solleva il bilanciere. Esegui un hip hinge portando il busto in avanti mantenendo la schiena in posizione neutra. L\'angolo del busto può variare: più orizzontale (parallelo al pavimento) = più difficile ma maggiore ROM; più verticale (45°) = più facile da mantenere e permette carichi maggiori. Trova l\'angolo che ti permette di mantenere la posizione per tutto il set.',
                movement: 'Tira il bilanciere verso il corpo - il punto esatto dipende dall\'obiettivo (vedi focus). Inizia il movimento con una retrazione scapolare, poi tira con le braccia. Le scapole dovrebbero muoversi: protrazione in basso, retrazione completa in alto. Abbassa in modo controllato, non lasciare cadere il peso. Il busto dovrebbe rimanere fermo - se oscilla troppo, riduci il carico.',
                breathing: 'Espira durante la trazione, inspira durante la discesa. Mantieni core attivo durante tutto il movimento per proteggere la schiena.',
                commonMistakes: [
                    'Usare momentum oscillando il busto - toglie lavoro ai muscoli target e stressa la schiena. Se devi "strappare", il peso è troppo pesante',
                    'Schiena che si arrotonda - pericoloso sotto carico. Se succede, alza l\'angolo del busto o riduci il peso',
                    'Alzarsi durante la trazione - trasforma il row in un ibrido row/shrug. Mantieni l\'angolo del busto costante',
                    'Gomiti che si aprono troppo - dipende dal focus, ma generalmente i gomiti dovrebbero rimanere a 45-60° dal busto',
                    'Scapole che non si muovono - la retrazione scapolare è fondamentale per l\'attivazione del mid-back'
                ]
            },
            
            focusVariants: {
                lats: {
                    title: 'Focus Dorsali',
                    technique: 'Presa più larga (oltre larghezza spalle) con i gomiti che puntano a 45-60° dal corpo. Tira verso il petto basso/sterno. Questa posizione enfatizza i dorsali per la larghezza della schiena. Pensa a tirare i gomiti verso i fianchi, non indietro.',
                    cues: ['Presa larga', 'Tira allo sterno', 'Gomiti ai fianchi'],
                    when: 'Sviluppo larghezza schiena e dorsali'
                },
                mid_back: {
                    title: 'Focus Mid-Back',
                    technique: 'Presa stretta (larghezza spalle o meno) e tira verso l\'ombelico. Questa traiettoria enfatizza romboidi, trapezio medio e la "densità" della schiena. Pausa di 1-2 sec al top con squeeze delle scapole amplifica l\'effetto.',
                    cues: ['Presa stretta', 'Tira all\'ombelico', 'Squeeze scapole 1-2 sec'],
                    when: 'Sviluppo densità mid-back, postura, o debolezza scapolare'
                },
                power: {
                    title: 'Focus Potenza',
                    technique: 'Pendlay Row: il bilanciere torna a terra ad ogni ripetizione. Parti da fermo, tira esplosivamente, controlla la discesa. Questo elimina lo stretch reflex e allena la capacità di generare forza da fermo - molto atletico. Busto parallelo al pavimento.',
                    cues: ['Bilanciere a terra ogni rep', 'Trazione esplosiva', 'Reset completo'],
                    when: 'Potenza di trazione per sport o uscire da plateau'
                },
                strength: {
                    title: 'Focus Forza',
                    technique: 'Pause row con pausa di 1-2 sec con bilanciere al petto. Elimina momentum e forza controllo completo. Yates Row (busto a 45°, presa supina) permette carichi maggiori. Seal row (sdraiato su panca alta) elimina completamente il contributo della schiena.',
                    cues: ['Pausa al petto', 'Zero momentum', 'Controllo totale'],
                    when: 'Forza massima o correzione di cheating'
                }
            },
            
            sportContext: {
                boxe: 'Forza essenziale per il clinch - tirare l\'avversario, controllare la distanza, sbilanciarlo. I dorsali e romboidi contribuiscono anche alla potenza dei ganci. La forza di presa sviluppata si trasferisce direttamente al clinch.',
                canottaggio: 'Il movimento primario del canottaggio. Il barbell row costruisce la forza di trazione che si trasferisce direttamente alla vogata. La capacità di mantenere la posizione hip hinge mentre si tira è esattamente ciò che serve in barca.',
                nuoto: 'Forza per la fase di trazione della bracciata. I dorsali sono i motori primari in acqua. La forza costruita con i row si trasferisce alla potenza della bracciata in tutti gli stili.',
                default: 'Il barbell row è probabilmente l\'esercizio più completo per la schiena. Costruisce dorsali, romboidi, trapezio e bicipiti simultaneamente. Insegna anche a mantenere una forte posizione hip hinge sotto carico, utile per molti altri movimenti.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════
        // CORE
        // ═══════════════════════════════════════════════════════════════
        
        'plank': {
            name: 'Plank',
            category: 'core',
            primaryMuscles: ['rectus_abdominis', 'transverse_abdominis'],
            secondaryMuscles: ['obliques', 'erectors', 'glutes', 'shoulders'],
            
            execution: {
                setup: 'Avambracci a terra con i gomiti direttamente sotto le spalle (non più avanti o più indietro). Piedi alla larghezza dei fianchi - più larghi = più stabile, più stretti = più impegnativo. Il corpo deve formare una linea retta dalla testa ai talloni. Non guardare avanti (stressa il collo) - guarda il pavimento tra le mani mantenendo il collo neutro.',
                movement: 'Il plank è un esercizio isometrico: l\'obiettivo è RESISTERE al movimento, non crearlo. Attiva il core come se stessi per ricevere un pugno, contrai i glutei per stabilizzare il bacino, e spingi leggermente i gomiti verso i piedi (senza muoverli) per aumentare l\'attivazione. Immagina di "accorciare" la distanza tra sterno e bacino attraverso l\'attivazione del core.',
                breathing: 'Respira normalmente - trattenere il fiato non è né necessario né desiderabile per isometriche lunghe. Respiri brevi e controllati attraverso il core attivo.',
                commonMistakes: [
                    'Fianchi che cadono verso terra - indica fatica del core o debolezza. Riduci il tempo o passa a ginocchia a terra. Meglio 20 sec perfetti che 60 sec con forma orribile',
                    'Fianchi troppo alti (forma a "V") - spesso fatto per rendere l\'esercizio più facile. Assicurati che ci sia una linea retta dalle spalle ai talloni',
                    'Testa che cade o che guarda avanti - mantieni collo neutro in linea con la colonna. Guarda il pavimento',
                    'Trattenere il respiro - porta a fatica prematura. Respira normalmente',
                    'Mancanza di attivazione dei glutei - i glutei aiutano a stabilizzare il bacino e proteggere la schiena. Contraili'
                ]
            },
            
            focusVariants: {
                anti_extension: {
                    title: 'Focus Anti-Estensione',
                    technique: 'Plank standard con focus specifico sulla resistenza all\'estensione lombare. Pensa a "tirare" il bacino verso lo sterno (posterior pelvic tilt). Puoi aumentare la difficoltà allontanando i gomiti dalla linea delle spalle (più avanti = più difficile) o usando un ab wheel rollout come progressione.',
                    cues: ['Bacino neutro o leggero tuck', 'Core "corto"', 'Resisti all\'arco lombare'],
                    when: 'Chi ha tendenza a iperestendere o vuole costruire forza anti-estensione per deadlift/squat'
                },
                obliques: {
                    title: 'Focus Obliqui',
                    technique: 'Side Plank: appoggiato su un avambraccio con il corpo di lato. I fianchi devono rimanere alti - non lasciarli cadere. I piedi possono essere sovrapposti (più difficile) o sfalsati (più facile). Copenhagen plank (gamba superiore su panca) aggiunge lavoro per adduttori.',
                    cues: ['Fianchi alti', 'Corpo in linea', 'Braccio superiore sul fianco o esteso'],
                    when: 'Stabilità laterale, prevenzione infortuni per sport con cambi di direzione'
                },
                dynamic: {
                    title: 'Focus Dinamico',
                    technique: 'Plank con movimento aggiunto che sfida la stabilità: shoulder tap (tocca la spalla opposta), dead bug in plank, mountain climbers lenti e controllati. La chiave è minimizzare il movimento del bacino e del tronco mentre le estremità si muovono.',
                    cues: ['Zero rotazione del bacino', 'Core stabile', 'Movimenti lenti e controllati'],
                    when: 'Progressione dal plank statico o per atleti che necessitano stabilità dinamica'
                },
                rkt: {
                    title: 'Focus RKC Plank',
                    technique: 'Variante molto intensa: contrai tutto al massimo - glutei, quadricipiti, core, dorsali. Spingi i gomiti verso i piedi e i piedi verso i gomiti (senza muoverli). Questa co-contrazione totale rende anche 10-15 secondi molto impegnativi. Qualità dell\'attivazione > durata.',
                    cues: ['Contrai tutto al massimo', 'Spingi gomiti verso piedi', 'Max 15-20 sec'],
                    when: 'Chi vuole qualità di attivazione invece di lunghe isometriche'
                }
            },
            
            sportContext: {
                boxe: 'Core stability fondamentale per trasferire potenza dalle gambe ai pugni. Un core debole significa perdita di energia nel trasferimento. Il plank costruisce anche la capacità di resistere ai colpi al corpo mantenendo la posizione.',
                calcio: 'Stabilità per cambi di direzione rapidi, contrasti e resistenza alle spinte. Il core forte permette di mantenere l\'equilibrio sotto pressione e di generare potenza nei movimenti esplosivi.',
                nuoto: 'Il plank simula la posizione del corpo in acqua. Un core forte mantiene il corpo idrodinamico e permette un rollio efficiente senza perdita di energia.',
                default: 'Il plank è l\'esercizio di core stability più fondamentale. Insegna al core a fare il suo lavoro primario: resistere al movimento della colonna mentre le estremità lavorano. È la base per tutti gli altri esercizi di core.'
            }
        },
        
        'russian_twist': {
            name: 'Russian Twist',
            category: 'core',
            primaryMuscles: ['obliques', 'rectus_abdominis'],
            secondaryMuscles: ['hip_flexors', 'erectors'],
            
            execution: {
                setup: 'Seduto sul pavimento con le ginocchia piegate e i piedi sollevati dal pavimento (più impegnativo) o appoggiati (più facile). Inclinati indietro con il busto a circa 45° mantenendo la schiena dritta - non arrotondata. Le mani possono essere unite davanti al petto, tenere un peso (palla medica, manubrio, kettlebell) o toccare il pavimento ai lati.',
                movement: 'Ruota il BUSTO (non solo le braccia!) da un lato all\'altro. Le spalle dovrebbero girare mentre i fianchi rimangono relativamente fermi - questo crea la rotazione che lavora gli obliqui. Tocca il pavimento o porta il peso verso il lato ad ogni ripetizione. Il movimento dovrebbe essere controllato, non una oscillazione veloce e incontrollata.',
                breathing: 'Espira ad ogni rotazione verso il lato. Mantieni il core attivo durante tutto il movimento.',
                commonMistakes: [
                    'Ruotare solo le braccia senza muovere il busto - gli obliqui lavorano nella rotazione del tronco, non nel movimento delle braccia. Le spalle devono girare',
                    'Perdere l\'angolo del busto - cadere indietro o piegarsi in avanti cambia l\'esercizio. Mantieni l\'inclinazione costante',
                    'Movimento troppo veloce e incontrollato - trasforma l\'esercizio in momentum invece che lavoro muscolare. Controlla ogni rep',
                    'Schiena arrotondata - mantieni la colonna in posizione neutra. Se non riesci, siediti più verticale',
                    'Trattenere il respiro - respira naturalmente coordinando con le rotazioni'
                ]
            },
            
            focusVariants: {
                power: {
                    title: 'Focus Potenza Rotazionale',
                    technique: 'Con palla medica pesante e movimenti esplosivi. Ruota con forza come se stessi lanciando un gancio. Puoi anche lanciare effettivamente la palla contro un muro e prenderla. Questo sviluppa la potenza rotazionale esplosiva necessaria negli sport di combattimento.',
                    cues: ['Palla medica pesante', 'Rotazione esplosiva', 'Come un gancio'],
                    when: 'Sport di combattimento, tennis, golf, baseball - tutti gli sport con componente rotazionale'
                },
                endurance: {
                    title: 'Focus Resistenza',
                    technique: 'Alto volume (30-50+ rep per lato) con peso leggero o bodyweight. Ritmo costante e controllato. Ottimo come finisher per il core o in circuiti. Costruisce resistenza degli obliqui per mantenere la potenza rotazionale durante sessioni lunghe.',
                    cues: ['Peso leggero', 'Ritmo costante', 'Volume alto'],
                    when: 'Resistenza muscolare o conditioning'
                },
                stability: {
                    title: 'Focus Stabilità',
                    technique: 'Piedi sollevati con movimento lento e controllato. Fermati 1-2 sec ad ogni lato. Questa variante enfatizza il controllo e la stabilità piuttosto che la potenza. Ottimo per chi sta costruendo le basi.',
                    cues: ['Movimento lento', 'Pausa ad ogni lato', 'Piedi sollevati'],
                    when: 'Costruzione base o focus sulla qualità del movimento'
                }
            },
            
            sportContext: {
                boxe: 'Il Russian twist simula direttamente il pattern rotazionale di ganci e uppercut. La potenza di questi pugni viene dalla rotazione del tronco, non dalle braccia. Ottimo anche per sviluppare la forza rotazionale per le schivate (slip, bob & weave).',
                tennis: 'Potenza per dritto e rovescio che sono movimenti rotazionali. La capacità di generare potenza rotazionale rapidamente è fondamentale per colpi potenti.',
                golf: 'Lo swing del golf è essenzialmente una rotazione controllata del tronco. Il Russian twist costruisce sia la forza che il controllo necessari per uno swing potente e preciso.',
                default: 'Il Russian twist è l\'esercizio più diretto per la forza rotazionale. Allena gli obliqui nel loro ruolo primario (rotazione del tronco) e ha transfer diretto a qualsiasi sport o attività che richiede rotazione.'
            }
        },
        
        'dead_bug': {
            name: 'Dead Bug',
            category: 'core',
            primaryMuscles: ['transverse_abdominis', 'rectus_abdominis'],
            secondaryMuscles: ['hip_flexors', 'obliques'],
            
            execution: {
                setup: 'Sdraiato supino (pancia in su) con le braccia estese verso il soffitto e le ginocchia piegate a 90° direttamente sopra i fianchi. Prima di iniziare, premi la zona lombare contro il pavimento - non deve esserci spazio tra schiena e pavimento. Questo è il bracing che manterrai per tutto l\'esercizio.',
                movement: 'Mantenendo la schiena premuta a terra, estendi simultaneamente il braccio destro sopra la testa e la gamba sinistra in avanti (opposti). Scendi lentamente, quasi toccando il pavimento, poi torna alla posizione iniziale e alterna. Se la schiena si inarca (perde contatto col pavimento), hai esteso troppo - riduci il range.',
                breathing: 'Espira mentre estendi braccio e gamba - questo aiuta a mantenere l\'attivazione del core. Inspira tornando alla posizione iniziale.',
                commonMistakes: [
                    'Schiena che si inarca perdendo contatto col pavimento - questo è il segnale che hai perso il controllo del core. Riduci il ROM o fermati',
                    'Movimento troppo veloce - il dead bug dovrebbe essere lento e controllato. Velocità = compensazione',
                    'Non coordinare braccio e gamba opposta - usa sempre arti opposti per il pattern cross-body',
                    'Trattenere il respiro - espira durante l\'estensione per facilitare l\'attivazione del core',
                    'Estendere completamente fino a terra prima di avere il controllo - inizia con ROM ridotto e aumenta progressivamente'
                ]
            },
            
            focusVariants: {
                anti_extension: {
                    title: 'Focus Anti-Estensione',
                    technique: 'La chiave è mantenere la lombare SEMPRE premuta a terra. Appena senti che vuole inarcarsi, hai trovato il tuo limite attuale di ROM. Lavora in quel range finché non diventi più forte. Progressione: inizia estendendo solo le gambe, poi aggiungi le braccia.',
                    cues: ['Lombare SEMPRE a terra', 'ROM limitato se necessario', 'Lento e controllato'],
                    when: 'Costruzione base anti-estensione, riabilitazione lombare, o debolezza core'
                },
                loaded: {
                    title: 'Focus Caricato',
                    technique: 'Tieni un peso (kettlebell leggero, manubrio, palla medica) con entrambe le mani sopra il petto. Il braccio col peso rimane fermo mentre estendi le gambe alternandole. Oppure tieni il peso con una mano mentre estendi braccio e gamba opposta. Aumenta significativamente la difficoltà.',
                    cues: ['Peso leggero per iniziare', 'Braccio con peso stabile', 'Core ancora più attivo'],
                    when: 'Progressione dal dead bug base o atleti avanzati'
                },
                banded: {
                    title: 'Focus con Elastico',
                    technique: 'Elastico fissato dietro di te, tenuto con le mani. La tensione dell\'elastico cerca di tirare le braccia indietro, aumentando la richiesta anti-estensione. Variante: elastico ai piedi per resistenza durante l\'estensione delle gambe.',
                    cues: ['Resisti alla trazione', 'Core stabile', 'Movimento controllato'],
                    when: 'Atleti che necessitano anti-estensione dinamica'
                }
            },
            
            sportContext: {
                boxe: 'Il dead bug insegna a mantenere il controllo del core mentre gli arti si muovono - esattamente ciò che accade tirando combinazioni. La capacità di mantenere il core stabile mentre braccia e gambe lavorano si traduce in pugni più potenti e migliore equilibrio.',
                running: 'Stabilità core fondamentale per efficienza nella corsa. Un core debole porta a oscillazioni del bacino e perdita di energia. Il dead bug insegna il controllo cross-body necessario per la coordinazione braccia-gambe nella corsa.',
                default: 'Il dead bug è considerato uno degli esercizi di core più sicuri ed efficaci. Insegna l\'anti-estensione (resistere all\'arco lombare) che è fondamentale per proteggere la schiena in quasi tutti gli altri esercizi. Ottimo per principianti e riabilitazione.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════
        // BOXING SPECIFIC
        // ═══════════════════════════════════════════════════════════════
        
        'heavy_bag': {
            name: 'Heavy Bag Work / Sacco Pesante',
            category: 'boxing_technique',
            primaryMuscles: ['shoulders', 'core', 'legs'],
            secondaryMuscles: ['arms', 'back', 'cardio'],
            
            execution: {
                setup: 'Posizionati in guardia davanti al sacco alla distanza corretta: con il jab completamente esteso dovresti toccare il sacco con le nocche. Questa distanza varia durante il lavoro - impara a gestirla. Peso distribuito equamente sui piedi, ginocchia leggermente piegate, mani alte in guardia, mento abbassato.',
                movement: 'La potenza viene dal pavimento, passa attraverso le gambe, le anche, il core, e solo alla fine le braccia. Ogni pugno inizia con una rotazione dei piedi e delle anche - le braccia sono semplicemente l\'ultimo anello della catena. Lavora combinazioni complete: non solo pugni ma anche movimenti laterali, entrate, uscite, schivate. Il sacco dovrebbe oscillare in modo controllato, non volare via.',
                breathing: 'Espira brevemente e intensamente (uno "tss" o "shh") ad ogni pugno. Questo attiva il core, protegge il corpo in caso di contrattacco (nella realtà) e aiuta a mantenere un ritmo. Non trattenere mai il fiato. Tra le combinazioni respira normalmente.',
                commonMistakes: [
                    'Colpire solo con le braccia senza coinvolgere gambe e anche - questo limita la potenza al 20-30% del potenziale e affatica rapidamente le spalle',
                    'Piedi statici e piantati - nella boxe sei sempre in movimento. Lavora il footwork anche al sacco: entra, esci, gira, cambia angolo',
                    'Dimenticare la guardia tra i colpi - nella realtà verresti colpito. Torna sempre in guardia dopo ogni colpo come se l\'avversario contrattaccasse',
                    'Tensione eccessiva nelle spalle - porta a fatica rapida e pugni lenti. Le spalle sono rilassate, la tensione arriva solo al momento dell\'impatto',
                    'Colpire a vuoto (pushing) invece che con snap - il pugno deve avere uno "snap" finale, non essere una spinta'
                ]
            },
            
            focusVariants: {
                power: {
                    title: 'Focus Potenza',
                    technique: 'Lavora su colpi singoli massimali con reset completo tra uno e l\'altro. Ogni pugno al 100% con rotazione completa. Pausa di 2-3 secondi tra i colpi per resettare la posizione. Questo allena la capacità di generare potenza massimale. Non sacrificare la tecnica per la potenza.',
                    cues: ['Un colpo alla volta', 'Rotazione massima', 'Reset completo', 'Potenza dalle anche'],
                    when: 'Sviluppo potenza massimale nel singolo colpo'
                },
                volume: {
                    title: 'Focus Volume/Resistenza',
                    technique: 'Round continui (3-5 min) a ritmo sostenuto senza pause. L\'intensità è al 60-70% per permettere di mantenere il lavoro. Focus sulla respirazione e sulla gestione dell\'energia. Questo simula la fatica di un match reale.',
                    cues: ['Mai fermarsi', 'Ritmo costante', 'Gestisci energia', 'Respira ritmicamente'],
                    when: 'Conditioning specifico per boxe, resistenza in round lunghi'
                },
                technique: {
                    title: 'Focus Tecnica',
                    technique: 'Lavoro al 50% velocità e potenza con focus sulla forma perfetta. Ripeti le stesse combinazioni molte volte per costruire automatismi. Usa lo specchio se disponibile. Senti ogni parte del movimento. La perfezione tecnica ora diventa potenza dopo.',
                    cues: ['Mezzo ritmo', 'Forma perfetta', 'Ripeti combinazioni', 'Senti il movimento'],
                    when: 'Perfezionamento tecnico, correzione errori, apprendimento nuove combinazioni'
                },
                angles: {
                    title: 'Focus Angoli e Movimento',
                    technique: 'Enfasi sul footwork: entra con un passo, colpisci, esci con un angolo. Gira intorno al sacco. Lavora combinazioni da diverse posizioni. Questo simula il movimento nel ring dove raramente sei perfettamente di fronte all\'avversario.',
                    cues: ['Muoviti sempre', 'Cambia angolo dopo ogni combinazione', 'Entra ed esci'],
                    when: 'Sviluppo footwork e gestione della distanza'
                }
            },
            
            sportContext: {
                boxe: 'Il sacco pesante è probabilmente lo strumento più importante dopo lo sparring. Sviluppa potenza (la resistenza del sacco richiede forza per muoverlo), timing (imparare quando e come colpire), distanza (gestire la distanza dal bersaglio), e resistenza specifica (la fatica è identica al match). Usalo per tutto: tecnica, potenza, conditioning.',
                mma: 'Adatta il lavoro includendo gomitate, ginocchiate, calci bassi/medi/alti. Lavora le transizioni tra pugni e clinch. Il sacco pesante è versatile per allenare tutti gli aspetti dello striking.',
                default: 'Allenamento completo che combina cardio intenso, sviluppo di potenza, e sfogo stress. Anche per non-fighters è un ottimo workout total body.'
            }
        },
        
        'shadow_boxing': {
            name: 'Shadow Boxing',
            category: 'boxing_technique',
            primaryMuscles: ['shoulders', 'core'],
            secondaryMuscles: ['legs', 'cardio'],
            
            execution: {
                setup: 'Posizionati in guardia con spazio sufficiente per muoverti liberamente (almeno 3x3 metri). Lo specchio è utile per controllare la forma ma non essenziale. Peso sugli avampiedi, ginocchia morbide, mani in guardia, spalle rilassate.',
                movement: 'Il shadow boxing è "sparring con un avversario immaginario". Non stai semplicemente tirando pugni a vuoto - stai combattendo. Muoviti costantemente: avanti, indietro, lateralmente, in diagonale. Tira combinazioni realistiche. Schiva colpi immaginari. Contrattacca. L\'obiettivo è rendere i movimenti automatici così che durante lo sparring o il match non devi pensare.',
                breathing: 'Espira brevemente ad ogni pugno. Tra le combinazioni respira normalmente. Mantieni un ritmo respiratorio che puoi sostenere. La respirazione nel shadow boxing ti prepara alla gestione del fiato nel match.',
                commonMistakes: [
                    'Stare fermi sul posto - il shadow boxing senza movimento è inutile. I piedi sono sempre attivi, anche solo oscillando leggermente',
                    'Non visualizzare un avversario - tirare pugni a caso senza contesto non sviluppa timing. Immagina qualcuno di fronte che attacca e difende',
                    'Dimenticare la difesa - tira un pugno, torna in guardia. Schiva un attacco immaginario. Il shadow boxing allena l\'intera boxe, non solo l\'attacco',
                    'Movimenti pigri e senza intenzione - ogni pugno dovrebbe avere un bersaglio, anche se immaginario. Tira con intenzione',
                    'Braccia tese e rigide - le braccia sono rilassate, lo snap arriva solo alla fine del pugno. La rigidità spreca energia'
                ]
            },
            
            focusVariants: {
                warmup: {
                    title: 'Focus Riscaldamento',
                    technique: '2-3 round a bassa intensità per preparare il corpo. Lavora su tutti i pugni, tutte le difese, tutto il footwork. L\'obiettivo è lubrificare le articolazioni, aumentare la temperatura corporea, e attivare i pattern motori. Non forzare.',
                    cues: ['50% intensità', 'Movimenti fluidi', 'Tutti i colpi', 'Footwork libero'],
                    when: 'Prima di ogni sessione di boxe come riscaldamento specifico'
                },
                visualization: {
                    title: 'Focus Visualizzazione',
                    technique: 'Immagina un avversario specifico (il prossimo opponent, uno stile particolare). Reagisci ai suoi colpi, contrattacca i suoi pattern, sfrutta le sue debolezze. Questo è allenamento mentale tanto quanto fisico. I pugili professionisti usano questo per prepararsi tatticamente.',
                    cues: ['Avversario specifico', 'Reagisci ai suoi colpi', 'Esegui il game plan'],
                    when: 'Preparazione tattica pre-match o sviluppo abilità reattive'
                },
                conditioning: {
                    title: 'Focus Condizionamento',
                    technique: 'Alta intensità per round lunghi (4-5 min) o round da 3 min con brevi pause (30 sec). L\'obiettivo è simulare la fatica del match. Spingi soprattutto nell\'ultimo minuto di ogni round, quando durante un match saresti più stanco.',
                    cues: ['80%+ intensità', 'Non fermarti', 'Spingi a fine round', 'Simula la fatica del match'],
                    when: 'Conditioning specifico per boxe, preparazione alla fatica del match'
                },
                technical: {
                    title: 'Focus Tecnico',
                    technique: 'Round dedicati a aspetti specifici: un round solo jab, un round solo combinazioni 1-2, un round solo difese. Lavora lento e preciso. Questo è il momento per correggere errori e perfezionare la forma.',
                    cues: ['Un focus per round', 'Lento e preciso', 'Qualità > quantità'],
                    when: 'Perfezionamento tecnico o correzione di specifici errori'
                }
            },
            
            sportContext: {
                boxe: 'Il shadow boxing è il riscaldamento standard prima di ogni sessione e un allenamento a sé stante. È l\'unico modo per praticare la boxe senza partner e senza attrezzatura. Sviluppa fluidità, timing, coordinazione e resistenza. I migliori pugili fanno shadow boxing quotidianamente.',
                mma: 'Adatta includendo kicks, ginocchiate, sprawl per difesa takedown, transizioni a terra. Il shadow boxing per MMA è ancora più complesso perché integra più discipline.',
                default: 'Anche per non-fighters, il shadow boxing è un eccellente workout cardio che brucia calorie, sviluppa coordinazione e sfoga stress. Zero attrezzatura necessaria.'
            }
        },
        
        'speed_bag': {
            name: 'Speed Bag',
            category: 'boxing_technique',
            primaryMuscles: ['shoulders', 'arms'],
            secondaryMuscles: ['core', 'coordination'],
            
            execution: {
                setup: 'La speed bag dovrebbe essere posizionata circa all\'altezza degli occhi o leggermente più in basso (la parte più larga del bag a livello del mento). Posizionati vicino al bag, mani in una guardia alta modificata. Il movimento parte dai gomiti, non dalle spalle.',
                movement: 'Il pattern base è: colpisci il bag, aspetta che faccia 3 rimbalzi sulla piattaforma (boom-boom-boom), poi colpisci con l\'altra mano. Il colpo è un movimento circolare dall\'interno verso l\'esterno, colpendo la parte frontale-laterale del bag con il dorso dei pugni (nocche o lato mignolo). Le braccia si muovono in piccoli cerchi alternati. L\'arte è il timing, non la forza.',
                breathing: 'Respira in modo ritmico con il pattern dei colpi. La speed bag è quasi meditativa una volta trovato il ritmo - il respiro dovrebbe essere naturale e costante.',
                commonMistakes: [
                    'Colpire troppo forte - la speed bag richiede tocchi leggeri e precisi. La forza la fa rimbalzare in modo imprevedibile. Less is more',
                    'Perdere il ritmo e inseguire il bag - se perdi il pattern, fermati, lascia il bag fermarsi, e riparti. Non provare a "rincorrerlo"',
                    'Braccia rigide e tese - le braccia dovrebbero essere rilassate, il movimento viene dai gomiti e polsi, non dalle spalle',
                    'Non contare i rimbalzi - specialmente all\'inizio, conta "1-2-3-colpo" ad alta voce per costruire il timing',
                    'Guardare le mani invece del bag - gli occhi sul bag, le mani vanno automatiche'
                ]
            },
            
            focusVariants: {
                rhythm: {
                    title: 'Focus Ritmo Base',
                    technique: 'Pattern standard: 3 rimbalzi tra ogni colpo, mani alternate. L\'obiettivo è mantenere il ritmo per minuti senza errori. Questo sviluppa la coordinazione occhio-mano fondamentale. Inizia lento e gradualmente trova un ritmo confortevole.',
                    cues: ['1-2-3 colpo', 'Braccia rilassate', 'Trova il groove', 'Respira naturalmente'],
                    when: 'Principianti o costruzione della base ritmica'
                },
                speed: {
                    title: 'Focus Velocità',
                    technique: 'Riduci progressivamente i rimbalzi: da 3 a 2 a 1 (avanzato). Con un solo rimbalzo il ritmo è molto veloce e richiede reazioni rapide. I polsi devono essere sciolti e le braccia completamente rilassate per raggiungere alte velocità.',
                    cues: ['Riduci rimbalzi', 'Polsi sciolti', 'Velocità dalle mani non spalle'],
                    when: 'Sviluppo velocità mani avanzata'
                },
                endurance: {
                    title: 'Focus Resistenza Spalle',
                    technique: 'Round lunghi (3-5 min) a ritmo costante senza fermarsi. L\'obiettivo è mantenere il pattern perfetto nonostante la fatica alle spalle. Le spalle dei pugili devono resistere a round interi con le mani alte.',
                    cues: ['Round lunghi', 'Ritmo costante', 'Non perdere il pattern'],
                    when: 'Costruzione resistenza deltoidi per mantenere la guardia'
                },
                patterns: {
                    title: 'Focus Pattern Avanzati',
                    technique: 'Variazioni: doppio colpo con la stessa mano, colpi laterali, movimento intorno al bag, combinazione mani-gomiti. Questi pattern avanzati sviluppano coordinazione superiore e rendono l\'allenamento meno monotono.',
                    cues: ['Sperimenta pattern', 'Mantieni controllo', 'Creatività nel ritmo'],
                    when: 'Chi ha padroneggiato il pattern base'
                }
            },
            
            sportContext: {
                boxe: 'La speed bag sviluppa coordinazione occhio-mano, timing ritmico, e resistenza delle spalle. Anche se il movimento non è identico al pugno reale, la capacità ritmica e la resistenza si trasferiscono. È anche un ottimo esercizio per il recupero attivo tra sessioni intense.',
                default: 'La speed bag è un esercizio di coordinazione divertente e accessibile. Anche per non-pugili offre benefici: coordinazione, ritmo, resistenza spalle, e una forma di meditazione attiva una volta padroneggiata.'
            }
        },
        
        'battle_ropes': {
            name: 'Battle Ropes',
            category: 'conditioning',
            primaryMuscles: ['shoulders', 'core', 'arms'],
            secondaryMuscles: ['legs', 'back', 'cardio'],
            
            execution: {
                setup: 'Afferra le estremità delle corde con una presa salda ma non tesa (mani come "ganci"). Posizionati in stance atletica: piedi leggermente più larghi delle spalle, ginocchia piegate, peso sugli avampiedi, busto leggermente inclinato avanti. Non stare troppo vicino al punto di ancoraggio - dovresti avere un po\' di slack nelle corde.',
                movement: 'Esistono vari pattern: Waves alternate (movimento alternato delle braccia creando onde), Double waves (entrambe le braccia insieme), Slams (sbatti le corde a terra), Circles (cerchi), Snakes (onde laterali a terra). Inizia sempre dalle anche e dal core, non solo dalle braccia. L\'obiettivo è creare onde che arrivino fino al punto di ancoraggio.',
                breathing: 'Respira ritmicamente con il movimento. L\'errore più comune è trattenere il fiato. Trova un pattern respiratorio sostenibile - ad esempio espira su ogni onda o ogni due.',
                commonMistakes: [
                    'Stare troppo eretti - piegati leggermente in avanti con ginocchia flesse. La posizione atletica permette di usare tutto il corpo',
                    'Onde che muoiono prima di arrivare a fine corda - indica che non stai usando abbastanza ampiezza o forza. Usa movimenti più ampi',
                    'Usare solo le braccia - il potere viene dalle gambe e dal core. Le braccia sono l\'ultimo anello. Piega le ginocchia e usa tutto il corpo',
                    'Trattenere il respiro - porta a fatica rapida. Respira ritmicamente',
                    'Presa troppo stretta - affatica gli avambracci inutilmente. Tieni le corde ma non stritolarle'
                ]
            },
            
            focusVariants: {
                power: {
                    title: 'Focus Potenza',
                    technique: 'Slams: alza entrambe le corde sopra la testa e sbattile a terra con forza massima. Questo è un movimento esplosivo che coinvolge tutto il corpo. Pensa a "schiacciare" qualcosa a terra. Ogni rep dovrebbe essere massimale con reset completo tra le ripetizioni.',
                    cues: ['Braccia insieme in alto', 'Sbatti con tutto il corpo', 'Usa le gambe'],
                    when: 'Sviluppo potenza esplosiva full body'
                },
                endurance: {
                    title: 'Focus Resistenza',
                    technique: 'Waves alternate per 30-60 secondi continui (o più). Trova un ritmo sostenibile che puoi mantenere. L\'obiettivo è non fermarsi. Questo simula la fatica di un round di boxe o la resistenza necessaria in uno sport.',
                    cues: ['Ritmo costante', 'Non fermarti', 'Trova il tuo ritmo sostenibile'],
                    when: 'Conditioning metabolico, simulazione fatica match'
                },
                rotation: {
                    title: 'Focus Rotazione',
                    technique: 'Onde laterali (snakes) o movimenti rotazionali: ruota il busto creando onde che si muovono lateralmente a terra invece che verticalmente. Questo enfatizza il core rotazionale. Ottimo per sport che richiedono potenza rotazionale.',
                    cues: ['Ruota da fianchi', 'Core attivo', 'Onde laterali a terra'],
                    when: 'Sport con componente rotazionale (boxe, tennis, golf)'
                },
                hiit: {
                    title: 'Focus HIIT',
                    technique: 'Intervalli: 20 sec lavoro massimale / 10 sec pausa x 8 round (Tabata) o 30/30, 40/20. Alterna tra pattern diversi ogni intervallo per variare lo stimolo. Questo è conditioning ad alta intensità puro.',
                    cues: ['Massimale durante lavoro', 'Recupero attivo', 'Varia i pattern'],
                    when: 'Conditioning ad alta intensità, HIIT'
                }
            },
            
            sportContext: {
                boxe: 'Le battle ropes simulano perfettamente la fatica di un round: le spalle bruciano, il cuore pompa, devi continuare. La resistenza spalle sviluppata si trasferisce alla capacità di tenere la guardia alta per round interi. Gli slams sviluppano potenza per colpi al corpo.',
                mma: 'Conditioning eccellente per le braccia durante il grappling. Le onde alternate simulano i movimenti di controllo a terra. Gli slams simulano ground and pound.',
                crossfit: 'Movimento comune nei WOD per conditioning. Si integra bene con altri esercizi in circuiti.',
                default: 'Le battle ropes sono uno degli strumenti di conditioning più efficaci. Combinano cardio intenso con lavoro di forza-resistenza. Bruci calorie velocemente mentre costruisci resistenza muscolare. Adatte a tutti i livelli perché puoi regolare l\'intensità semplicemente cambiando la velocità.'
            }
        },
        
        'med_ball_slam': {
            name: 'Med Ball Slam',
            category: 'conditioning',
            primaryMuscles: ['core', 'shoulders', 'lats'],
            secondaryMuscles: ['legs', 'arms', 'cardio'],
            
            execution: {
                setup: 'In piedi con una palla medica appropriata. Per slams devi usare una palla che NON rimbalza (dead ball o sand ball), altrimenti ti torna in faccia. Piedi alla larghezza delle spalle o leggermente più larghi. Peso sulla palla sopra la testa con le braccia estese.',
                movement: 'Il movimento inizia dalle anche: piega rapidamente le ginocchia e le anche mentre porti la palla in basso e la sbatti a terra di fronte a te. Pensa a "piegarti a metà" - il movimento viene dal core che si flette, non dalle braccia che tirano giù. Al momento dello slam, espira con forza. Raccogli la palla (la palla dead ball non rimbalza) e torna alla posizione iniziale.',
                breathing: 'Espira con forza durante lo slam - questo attiva il core e protegge la schiena. Inspira mentre alzi la palla sopra la testa. Il pattern è simile a colpire qualcosa: espiri all\'impatto.',
                commonMistakes: [
                    'Sbattere solo con le braccia - la potenza viene dalla flessione delle anche e del core, non dalle braccia che tirano giù. Le braccia guidano, il core fa il lavoro',
                    'Non usare le gambe - le ginocchia si piegano durante lo slam per aggiungere forza e proteggere la schiena',
                    'Palla troppo leggera - non offre resistenza sufficiente per sviluppare potenza. Dovrebbe essere difficile, non facile',
                    'Palla troppo pesante - compromette la velocità del movimento e quindi la potenza. Deve essere abbastanza pesante da essere impegnativa ma abbastanza leggera da muoverla velocemente',
                    'Schiena arrotondata in modo incontrollato - la flessione del busto deve essere controllata dal core, non un collasso passivo'
                ]
            },
            
            focusVariants: {
                power: {
                    title: 'Focus Potenza',
                    technique: 'Usa una palla pesante (8-15kg a seconda della tua forza) e fai singoli slam massimali con reset completo tra ogni ripetizione. Ogni slam dovrebbe essere al 100% di intensità. Pausa di 3-5 secondi tra le ripetizioni per resettare e generare massima forza.',
                    cues: ['Palla pesante', 'Un slam alla volta', 'Reset completo', 'Potenza massima'],
                    when: 'Sviluppo potenza esplosiva pura'
                },
                conditioning: {
                    title: 'Focus Conditioning',
                    technique: 'Palla media (5-8kg) per serie lunghe senza pause: 20-30 ripetizioni o lavoro a tempo (30-60 secondi). L\'obiettivo è mantenere un ritmo alto nonostante la fatica. Questo è conditioning metabolico ad alta intensità.',
                    cues: ['Ritmo alto', 'Non fermarti', 'Gestisci la fatica'],
                    when: 'Conditioning metabolico, HIIT'
                },
                rotational: {
                    title: 'Focus Rotazionale',
                    technique: 'Rotational Slam: alza la palla in diagonale (verso alto-destra) e sbattila in diagonale opposta (verso basso-sinistra). Ruota tutto il corpo dalle anche. Questo simula il pattern di potenza rotazionale di molti sport (ganci, rovesci, swing).',
                    cues: ['Alza diagonale', 'Sbatti lato opposto', 'Ruota da fianchi'],
                    when: 'Sport con componente rotazionale (boxe, tennis, golf, baseball)'
                },
                overhead_throw: {
                    title: 'Focus Lancio',
                    technique: 'Invece di sbattere a terra, lancia la palla contro un muro solido e prendila al rimbalzo (richiede palla che rimbalza). Questo aggiunge la componente di lancio che si trasferisce a sport come calcio (rimessa), basket (passaggio).',
                    cues: ['Lancia al muro', 'Prendi al rimbalzo', 'Continuo'],
                    when: 'Sport che richiedono lancio overhead'
                }
            },
            
            sportContext: {
                boxe: 'Il med ball slam sviluppa la capacità di generare potenza verso il basso che si trasferisce ai colpi al corpo (overhand, colpi verso basso nel clinch). Il rotational slam simula direttamente il pattern del gancio. Ottimo anche per conditioning specifico.',
                mma: 'Simula il ground and pound - la capacità di generare potenza colpendo verso il basso da posizione dominante. Il movimento full body rispecchia i colpi a terra.',
                crossfit: 'Movimento comune nei WOD, specialmente con palle da muro (wall ball). Si integra bene in circuiti per conditioning.',
                default: 'Il med ball slam è uno degli esercizi più "primordiali" - sbatti qualcosa a terra con forza. È catartico, sviluppa potenza full body, e fornisce conditioning intenso. Ottimo per sfogare stress mentre ti alleni.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════
        // BOXING DRILLS - FOOTWORK
        // ═══════════════════════════════════════════════════════════════
        
        'ladder_drill': {
            name: 'Ladder Drill / Speed Ladder',
            category: 'boxing_footwork',
            primaryMuscles: ['calves', 'quadriceps'],
            secondaryMuscles: ['core', 'coordination'],
            
            execution: {
                setup: 'Posiziona la scala di agilità a terra su una superficie stabile e non scivolosa. Inizia in posizione atletica all\'inizio della scala: ginocchia leggermente piegate, peso sugli avampiedi, core attivo, braccia pronte a muoversi.',
                movement: 'Muovi i piedi rapidamente attraverso i quadrati della scala seguendo il pattern scelto. I piedi dovrebbero toccare terra brevemente (come camminare su carboni ardenti). Le braccia oscillano naturalmente in modo coordinato con le gambe - non tenerle ferme. Mantieni il busto relativamente stabile mentre i piedi lavorano velocemente sotto di te.',
                breathing: 'Respira ritmicamente - non trattenere il fiato. La respirazione dovrebbe essere naturale nonostante la velocità del movimento.',
                commonMistakes: [
                    'Guardare i piedi - guarda avanti, non in basso. I piedi vanno dove devono andare basandosi sulla propriocezione, non sulla vista',
                    'Movimenti troppo alti - i piedi dovrebbero rimanere bassi, quasi "scivolando" sulla superficie. Alzare troppo i piedi spreca tempo e energia',
                    'Braccia ferme lungo i fianchi - le braccia bilanciano il movimento. Oscillale naturalmente, come se stessi correndo',
                    'Sacrificare la tecnica per la velocità - impara prima il pattern lentamente, poi gradualmente accelera. La velocità senza controllo non serve',
                    'Postura eretta rigida - mantieni la posizione atletica con ginocchia leggermente flesse per tutta la lunghezza della scala'
                ]
            },
            
            focusVariants: {
                speed: {
                    title: 'Focus Velocità Pura',
                    technique: 'Pattern semplici (un piede per quadrato o due piedi) alla massima velocità possibile. L\'obiettivo è minimizzare il tempo di contatto a terra. Misura il tempo totale e cerca di migliorarlo mantenendo la tecnica.',
                    cues: ['Piedi leggeri', 'Contatto minimo', 'Più veloce possibile'],
                    when: 'Dopo aver padroneggiato i pattern, per sviluppare velocità massimale'
                },
                coordination: {
                    title: 'Focus Coordinazione',
                    technique: 'Pattern complessi: icky shuffle (in-in-out laterale), crossover, in-out-in. Inizia lento per imparare il pattern, poi accelera gradualmente. L\'obiettivo è programmare nuovi pattern motori nel sistema nervoso.',
                    cues: ['Pattern preciso', 'Lento poi veloce', 'Braccia coordinate'],
                    when: 'Sviluppo coordinazione neuromuscolare e agilità mentale'
                },
                lateral: {
                    title: 'Focus Laterale',
                    technique: 'Movimenti laterali attraverso la scala: shuffle laterale, carioca, crossover laterale. Questi pattern sviluppano l\'agilità laterale fondamentale per sport con cambi di direzione.',
                    cues: ['Mantieni basso', 'Spingi lateralmente', 'Anche verso la direzione'],
                    when: 'Sport che richiedono agilità laterale (basket, tennis, boxe)'
                }
            },
            
            sportContext: {
                boxe: 'La ladder sviluppa la velocità dei piedi che si trasferisce direttamente al footwork in combattimento. La capacità di muovere i piedi rapidamente e in modo coordinato è fondamentale per entrare, uscire e angolare.',
                calcio: 'Agilità per dribbling, cambi di direzione, e movimenti rapidi senza palla. La coordinazione piedi-braccia migliora anche il controllo palla.',
                basket: 'Footwork difensivo, cambi di direzione per drive e tagliafuori. Il basket richiede costanti movimenti laterali e cambi veloci.',
                default: 'La speed ladder è uno degli strumenti più efficaci per sviluppare agilità, coordinazione e velocità dei piedi. È anche un ottimo riscaldamento che attiva il sistema nervoso.'
            }
        },

        'slip_drill': {
            name: 'Slip Drill',
            category: 'boxing_defense',
            primaryMuscles: ['core', 'obliques'],
            secondaryMuscles: ['legs', 'neck'],
            
            execution: {
                setup: 'In guardia con posizione atletica. Opzionale: una corda orizzontale all\'altezza della testa come riferimento visivo, oppure un partner che tira colpi leggeri.',
                movement: 'Lo slip è un movimento laterale della testa e del busto per evitare un pugno dritto. Il movimento è una rotazione/flessione laterale del busto (principalmente obliqui), NON un piegamento del collo. La testa si sposta di pochi centimetri - quanto basta per far passare il pugno. Le mani rimangono in guardia. Subito dopo lo slip, torni alla posizione neutra (o contrattacchi).',
                breathing: 'Espira brevemente durante lo slip - questo attiva il core e prepara per un eventuale contrattacco immediato.',
                commonMistakes: [
                    'Piegare solo il collo senza muovere il busto - pericoloso per il collo e inefficace. Il movimento viene dal core',
                    'Abbassarsi troppo perdendo la posizione - lo slip è minimale. Ti abbassi/sposti solo quanto necessario',
                    'Mani che si abbassano durante lo slip - le mani devono rimanere in guardia. Abbassarle ti espone al secondo colpo',
                    'Chiudere gli occhi - devi vedere cosa sta arrivando. Mantieni contatto visivo',
                    'Movimento troppo ampio - lo slip dovrebbe essere rapido e minimale. Spostamenti grandi richiedono troppo tempo per tornare in posizione'
                ]
            },
            
            focusVariants: {
                reaction: {
                    title: 'Focus Reazione',
                    technique: 'Partner chiama la direzione (destra/sinistra) o tira colpi leggeri ai quali devi reagire. Questo allena la reattività - rispondere agli stimoli invece di anticipare. Fondamentale per trasferire l\'abilità allo sparring.',
                    cues: ['Reagisci veloce', 'Slip e torna', 'Occhi sull\'avversario'],
                    when: 'Sviluppo reattività difensiva per sparring/match'
                },
                conditioning: {
                    title: 'Focus Conditioning',
                    technique: 'Slip continui per round da 3 minuti (alternando destra e sinistra). L\'obiettivo è costruire resistenza negli obliqui per poter slippare per tutto il match, anche quando sei stanco.',
                    cues: ['Non fermarti', 'Ritmo costante', 'Mantieni guardia'],
                    when: 'Resistenza muscolare core specifica per boxe'
                },
                counter: {
                    title: 'Focus Contrattacco',
                    technique: 'Slip seguito immediatamente da un contropugno. Slip sinistro + cross destro, slip destro + gancio sinistro. Lo slip crea l\'apertura, il contropugno capitalizza.',
                    cues: ['Slip e colpisci', 'Un movimento fluido', 'Non esitare'],
                    when: 'Integrazione difesa-attacco'
                }
            },
            
            sportContext: {
                boxe: 'Lo slip è forse la difesa più importante nella boxe. Permette di evitare colpi mantenendo la posizione perfetta per contrattaccare. I migliori pugili costruiscono interi stili basati sullo slipping (es. Canelo, Mayweather).',
                mma: 'Essenziale per evitare lo striking stando in piedi. In MMA lo slip può anche essere seguito da un cambio livello per takedown.',
                default: 'Tecnica difensiva fondamentale che insegna a evitare il pericolo invece di assorbirlo. Costruisce anche core strength funzionale attraverso la rotazione rapida.'
            }
        },

        'bob_weave': {
            name: 'Bob & Weave',
            category: 'boxing_defense',
            primaryMuscles: ['quadriceps', 'glutes', 'core'],
            secondaryMuscles: ['hamstrings', 'calves'],
            
            execution: {
                setup: 'In guardia con ginocchia leggermente piegate. Il bob & weave richiede più flessione delle ginocchia rispetto allo slip, quindi preparati a usare le gambe.',
                movement: 'Il BOB è un abbassamento verticale piegando le ginocchia (non piegando la schiena in avanti). Il WEAVE è un movimento laterale mentre sei abbassato, come se stessi passando sotto una corda. Il movimento completo: piega ginocchia (bob), muoviti lateralmente mentre sei basso (weave), risali dall\'altra parte. Sempre mantenendo le mani in guardia.',
                breathing: 'Espira durante il bob (fase di lavoro), inspira tornando su.',
                commonMistakes: [
                    'Piegarsi in avanti con la schiena invece di abbassarsi con le ginocchia - ti lascia sbilanciato e vulnerabile. Scendi "dritto giù"',
                    'Perdere l\'equilibrio durante il weave laterale - mantieni il peso centrato e i piedi attivi',
                    'Movimento troppo lento - il bob & weave deve essere abbastanza veloce da evitare il gancio e posizionarti per contrattaccare',
                    'Abbassarsi troppo - scendi quanto basta per evitare il colpo. Troppo basso richiede troppo tempo per risalire',
                    'Mani che si abbassano - la guardia rimane alta durante tutto il movimento'
                ]
            },
            
            focusVariants: {
                technique: {
                    title: 'Focus Tecnica',
                    technique: 'Movimento lento e preciso concentrandosi sulla meccanica: abbassamento verticale (non avanti), trasferimento laterale controllato, risalita in posizione. Usa uno specchio o video per controllare la forma.',
                    cues: ['Giù dritto', 'Passa sotto', 'Risali in guardia'],
                    when: 'Apprendimento della meccanica o correzione errori'
                },
                cardio: {
                    title: 'Focus Cardio/Conditioning',
                    technique: 'Bob & weave continui per round da 3+ minuti. Aggiungi colpi dopo ogni bob: bob sinistro + gancio destro, bob destro + gancio sinistro. Questo è conditioning specifico che brucia le gambe come durante un match.',
                    cues: ['Bob, weave, colpisci', 'Non fermarti', 'Round completi'],
                    when: 'Conditioning specifico per boxe, resistenza gambe'
                },
                rope_drill: {
                    title: 'Focus Drill con Corda',
                    technique: 'Usa una corda orizzontale all\'altezza delle spalle e fai bob & weave continui da un\'estremità all\'altra. Questo drill classico ti obbliga a mantenere l\'altezza corretta.',
                    cues: ['Sotto la corda', 'Avanti e indietro', 'Non toccare la corda'],
                    when: 'Drill tecnico per altezza corretta del bob'
                }
            },
            
            sportContext: {
                boxe: 'Il bob & weave è LA difesa contro i ganci - i colpi circolari passano sopra la tua testa mentre tu ti posizioni per un devastante contrattacco (uppercut o gancio dal lato opposto). Stile iconico di Mike Tyson.',
                mma: 'Utile contro colpi circolari di striking, ma attenzione: abbassarsi troppo può esporre a ginocchiate o guillotine. Adatta il movimento al contesto MMA.',
                default: 'Tecnica difensiva avanzata che costruisce anche resistenza delle gambe. Il bob & weave continuo è uno degli esercizi più faticosi nella boxe.'
            }
        },
        
        'double_end_bag': {
            name: 'Double-End Bag',
            category: 'boxing_technique',
            primaryMuscles: ['shoulders', 'core'],
            secondaryMuscles: ['arms', 'coordination', 'timing'],
            
            execution: {
                setup: 'Il double-end bag è fissato con elastici sia in alto che in basso, creando un bersaglio che si muove velocemente quando colpito. Posizionati alla distanza del jab - braccio esteso dovrebbe raggiungere il centro del bag. Guardia alta, posizione atletica.',
                movement: 'A differenza del sacco pesante, il double-end bag richiede precisione e timing piuttosto che potenza. Colpisci il centro del bag con colpi leggeri e precisi. Quando il bag torna verso di te, schivalo (slip, bob, o spostamento laterale) come se fosse un contropugno. Poi colpisci di nuovo. L\'obiettivo è mantenere un dialogo continuo: colpisci, schiva, colpisci, schiva.',
                breathing: 'Espira ad ogni colpo, come sempre nella boxe. Il ritmo dovrebbe essere naturale e fluido.',
                commonMistakes: [
                    'Colpire troppo forte - la forza eccessiva fa oscillare il bag in modo imprevedibile. Il double-end bag non è per la potenza, è per precisione e timing',
                    'Non schivare il ritorno del bag - il bag che torna simula un contrattacco. Se non lo schivi, non stai allenando i riflessi difensivi',
                    'Stare fermi - muoviti, cambia angolo, entra ed esci. Il double-end bag allena il combattimento completo, non solo i colpi',
                    'Inseguire il bag con colpi wild - aspetta il momento giusto, non tirare quando il bag è in una posizione casuale',
                    'Mancanza di varietà nei colpi - usa tutti i pugni: jab, cross, ganci, uppercut. Varia le combinazioni'
                ]
            },
            
            focusVariants: {
                accuracy: {
                    title: 'Focus Precisione',
                    technique: 'Lavora su jab singoli puntando sempre al centro esatto del bag. Conta quanti colpi consecutivi centri perfettamente. Colpi leggeri - l\'obiettivo è la precisione, non la forza. Questo allena l\'accuratezza che si trasferisce al colpire bersagli piccoli (mento, fegato).',
                    cues: ['Centro del bag', 'Jab preciso', 'Conta i centri consecutivi'],
                    when: 'Sviluppo precisione e controllo'
                },
                combinations: {
                    title: 'Focus Combinazioni',
                    technique: 'Lavora su combinazioni veloci: 1-2, 1-1-2, 1-2-3. Dopo ogni combinazione, il bag torna - schivalo e continua con un\'altra combinazione. Questo simula lo scambio reale: attacchi, l\'avversario risponde, tu schivi e contrattacchi.',
                    cues: ['Combo veloci', 'Schiva il ritorno', 'Continua il flusso'],
                    when: 'Velocità mani e flusso del combattimento'
                },
                defense_reaction: {
                    title: 'Focus Difesa/Reazione',
                    technique: 'Colpisci una volta, poi concentrati sulla difesa: slip, bob, o spostamento. Ogni ritorno del bag è un pugno da evitare. Questo costruisce i riflessi difensivi e la mentalità che ogni attacco genera una risposta.',
                    cues: ['Colpisci e schiva', 'Ogni ritorno è un pugno', 'Reagisci veloce'],
                    when: 'Sviluppo riflessi difensivi e reattività'
                }
            },
            
            sportContext: {
                boxe: 'Il double-end bag è uno strumento unico che combina precisione, timing e riflessi difensivi. È il più vicino allo sparring tra tutti gli attrezzi perché il bag "risponde" ai tuoi colpi. Fondamentale per sviluppare l\'accuratezza che distingue i pugili di livello.',
                mma: 'Utile per timing nello striking. La necessità di schivare il ritorno allena i riflessi necessari in piedi.',
                default: 'Attrezzo eccellente per coordinazione occhio-mano, timing e riflessi. Più tecnico rispetto al sacco pesante ma costruisce abilità diverse e complementari.'
            }
        },
        
        'jump_rope': {
            name: 'Salto con Corda / Jump Rope',
            category: 'conditioning',
            primaryMuscles: ['calves', 'shoulders'],
            secondaryMuscles: ['quadriceps', 'core', 'forearms', 'cardio'],
            
            execution: {
                setup: 'La lunghezza della corda è critica: quando calpesti il centro della corda, i manici dovrebbero arrivare circa all\'altezza delle ascelle (per principianti) o più corti (per esperti/velocità). Corda troppo lunga = difficile controllare, troppo corta = colpirai i piedi.',
                movement: 'Il salto è molto più piccolo di quanto pensi - solo 2-3 cm dal pavimento, quanto basta per far passare la corda. I polsi ruotano la corda, NON le braccia - le braccia rimangono relativamente ferme lungo i fianchi. Atterri sugli avampiedi con le ginocchia morbide per assorbire l\'impatto. Il ritmo è costante e rilassato.',
                breathing: 'Respira in modo ritmico e naturale. Non trattenere il fiato. La respirazione dovrebbe essere nasale se possibile, passando alla bocca quando l\'intensità aumenta.',
                commonMistakes: [
                    'Saltare troppo alto - spreca energia e rallenta il ritmo. Il salto è minimo, solo quanto serve per far passare la corda',
                    'Braccia che ruotano invece dei polsi - affatica le spalle inutilmente e rende difficile aumentare la velocità. Le braccia sono ferme, i polsi ruotano',
                    'Guardare i piedi - guarda avanti. I piedi vanno dove devono andare senza guardarli',
                    'Atterrare sui talloni - atterrare sugli avampiedi con ginocchia morbide. I talloni non dovrebbero mai toccare',
                    'Tensione eccessiva nelle spalle - rilassa le spalle. La tensione rende difficile mantenere il ritmo a lungo'
                ]
            },
            
            focusVariants: {
                endurance: {
                    title: 'Focus Resistenza',
                    technique: 'Round lunghi (3-10+ minuti) a ritmo sostenibile. L\'obiettivo è continuare senza fermarsi, trovando un ritmo che puoi mantenere. Questo è conditioning aerobico puro - il riscaldamento classico dei pugili.',
                    cues: ['Ritmo costante', 'Respiro regolare', 'Rilassato', 'Non fermarti'],
                    when: 'Conditioning aerobico, riscaldamento'
                },
                speed: {
                    title: 'Focus Velocità',
                    technique: 'Double unders (la corda passa due volte per ogni salto) o semplicemente aumentare la velocità con salti singoli. Richiede polsi molto veloci e timing perfetto. I double unders sono molto più impegnativi e bruciano più calorie.',
                    cues: ['Polsi velocissimi', 'Salto leggermente più alto per DU', 'Timing perfetto'],
                    when: 'Sviluppo velocità, coordinazione, intensità alta'
                },
                footwork: {
                    title: 'Focus Footwork',
                    technique: 'Variazioni di footwork: boxer skip (alternare piedi), ali shuffle (spostamento laterale), high knees, criss-cross (incrociare le gambe). Queste varianti sviluppano coordinazione e agilità dei piedi che si trasferiscono direttamente al footwork nel ring.',
                    cues: ['Pattern vari', 'Piedi leggeri', 'Come una danza', 'Cambia spesso'],
                    when: 'Sviluppo footwork specifico per boxe o coordinazione'
                },
                intervals: {
                    title: 'Focus HIIT',
                    technique: 'Intervalli di intensità: 30 sec massimo / 30 sec leggero, oppure round da 3 min con "sprint" finali di 30 sec. Questo simula la fatica del match dove devi accelerare anche quando sei stanco.',
                    cues: ['Sprint e recupero', 'Spingi negli sprint', 'Recupero attivo'],
                    when: 'Conditioning ad alta intensità'
                }
            },
            
            sportContext: {
                boxe: 'La corda è IL riscaldamento della boxe - quasi ogni sessione inizia con la corda. Sviluppa il footwork leggero e rimbalzante che caratterizza i buoni pugili. Costruisce resistenza nei polpacci per rimanere sugli avampiedi per round interi. E il ritmo della corda si trasferisce al ritmo del combattimento.',
                crossfit: 'I double unders sono un movimento fondamentale in molti WOD. Richiedono pratica ma una volta padroneggiati sono un ottimo strumento di conditioning.',
                default: 'La corda è uno degli strumenti di cardio più efficaci ed economici. Brucia più calorie per minuto della corsa, è portatile, e sviluppa coordinazione insieme alla resistenza. Perfetta per viaggi o allenamenti a casa.'
            }
        },
        
        'burpee': {
            name: 'Burpee',
            category: 'conditioning',
            primaryMuscles: ['full_body'],
            secondaryMuscles: ['cardio', 'core', 'chest', 'legs'],
            
            execution: {
                setup: 'In piedi con spazio sufficiente per sdraiarti completamente. Non serve attrezzatura - questo è uno degli esercizi più efficaci che puoi fare ovunque.',
                movement: 'Il burpee standard: 1) Scendi in squat e metti le mani a terra davanti ai piedi, 2) Salta o cammina i piedi indietro arrivando in posizione plank, 3) Esegui un push-up completo (petto a terra, poi spingi), 4) Salta o cammina i piedi verso le mani, 5) Esplodi verso l\'alto saltando con le braccia sopra la testa. Ogni fase deve essere completata - non tagliare gli angoli. La qualità è più importante della velocità, specialmente sotto fatica.',
                breathing: 'Espira durante il push-up (quando spingi) e durante il salto. Inspira durante la discesa e quando salti indietro in plank. Mantieni un ritmo respiratorio costante anche quando sei stanco.',
                commonMistakes: [
                    'Saltare o rendere superficiale il push-up - il push-up è parte integrante del burpee. Se non riesci, fai la versione senza push-up ma non fare push-up falsi',
                    'Non estendere completamente nel salto finale - il burpee finisce con un salto dove ti estendi completamente, braccia sopra la testa',
                    'Fianchi che cadono nella posizione plank - mantieni il core attivo durante la fase plank. Se i fianchi cadono, stai tagliando la qualità',
                    'Sacrificare la forma per la velocità - un burpee fatto male è inutile. Mantieni la qualità anche quando sei stanco',
                    'Non toccare completamente il petto a terra - nella versione standard ("competition") il petto tocca il pavimento'
                ]
            },
            
            focusVariants: {
                standard: {
                    title: 'Focus Standard',
                    technique: 'Burpee completo con push-up, ogni fase eseguita correttamente. Lavora a un ritmo che puoi mantenere con buona forma. Questo è l\'esercizio di conditioning più efficace a corpo libero - full body, metabolicamente intenso, nessuna attrezzatura.',
                    cues: ['Ogni fase completa', 'Ritmo sostenibile', 'Forma prima di velocità'],
                    when: 'Conditioning generale, workout a corpo libero'
                },
                power: {
                    title: 'Focus Potenza',
                    technique: 'Burpee Box Jump: invece del salto verticale standard, salta su un box. Questo aggiunge una componente di potenza e forza l\'esplosività anche sotto fatica. Sempre step down dal box per proteggere le articolazioni.',
                    cues: ['Esplodi verso il box', 'Step down sempre', 'Massima esplosività'],
                    when: 'Sviluppo potenza esplosiva sotto fatica'
                },
                combat: {
                    title: 'Focus Combat/Sprawl',
                    technique: 'Sprawl Burpee: invece di saltare indietro in plank, esegui un sprawl da wrestling - i fianchi toccano il pavimento mentre le gambe si estendono indietro velocemente. Questo simula la difesa dal takedown. Risali rapidamente in posizione di combattimento invece di saltare in alto.',
                    cues: ['Sprawl esplosivo', 'Fianchi a terra', 'Risali in guardia'],
                    when: 'Conditioning specifico per lotta, MMA, o sport di combattimento'
                },
                modified: {
                    title: 'Focus Regressione',
                    technique: 'Burpee senza push-up o con step-back invece di salto indietro. Utile per principianti o per mantenere volume quando la fatica compromette la forma. Non c\'è vergogna nella regressione - è più intelligente che fare burpee con forma orribile.',
                    cues: ['Cammina invece di saltare', 'Skip push-up se serve', 'Mantieni la qualità'],
                    when: 'Principianti, recupero attivo, o quando la forma si deteriora'
                }
            },
            
            sportContext: {
                boxe: 'Il burpee simula l\'atto di rialzarsi dopo un knockdown - probabilmente l\'azione più faticosa e importante che un pugile può fare. Il conditioning costruito con i burpees permette di recuperare velocemente dopo situazioni difficili.',
                mma: 'Lo sprawl burpee è conditioning direttamente applicabile - simula la difesa dal takedown e la capacità di rialzarsi rapidamente. Fondamentale per la resistenza a terra e in piedi.',
                crossfit: 'Movimento fondamentale che appare in molti WOD. La versione CrossFit spesso richiede il petto a terra e braccia completamente estese nel salto.',
                default: 'Il burpee è probabilmente l\'esercizio di conditioning più efficace che esiste. Zero attrezzatura, lavora tutto il corpo, metabolicamente devastante. Se hai tempo per un solo esercizio di cardio, scegli i burpees.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════════
        // ADDITIONAL EXERCISES - Lower Body
        // ═══════════════════════════════════════════════════════════════════
        
        'nordic_curl': {
            name: 'Nordic Curl / Nordic Hamstring',
            category: 'lower_body',
            primaryMuscles: ['hamstrings'],
            secondaryMuscles: ['glutes', 'calves'],
            
            execution: {
                setup: 'Inginocchiati su un tappetino morbido. Hai bisogno di qualcosa che blocchi le caviglie: un partner, una macchina nordic, o il bordo di una panca pesante. Il corpo dovrebbe essere dritto dalla testa alle ginocchia.',
                movement: 'Mantieni il corpo rigido dalla testa alle ginocchia (no piegamento all\'anca). Abbassati lentamente verso terra resistendo con gli hamstrings. Controlla la discesa il più possibile. Usa le mani per "prenderti" quando non riesci più a resistere, poi spingi per tornare su e ripeti.',
                breathing: 'Inspira in posizione alta, mantieni la tensione durante la discesa controllata, espira durante la risalita.',
                commonMistakes: [
                    'Piegare le anche invece di mantenere il corpo dritto - vanifica il focus sugli hamstrings',
                    'Cadere troppo velocemente - l\'obiettivo è controllare la discesa il più lentamente possibile',
                    'Saltare le progressioni - questo esercizio è molto intenso, costruisci gradualmente'
                ]
            },
            
            focusVariants: {
                eccentric: {
                    title: 'Focus Eccentrico (Prevenzione)',
                    technique: 'Controlla la discesa in 5-8 secondi. Non preoccuparti della risalita - usa le mani per spingerti su. La fase eccentrica è quella che previene gli infortuni.',
                    cues: ['5-8 secondi discesa', 'Corpo dritto', 'Usa mani per tornare su'],
                    when: 'Prevenzione infortuni hamstring, calciatori, sprinter'
                },
                full: {
                    title: 'Focus Full Range',
                    technique: 'Cerca di completare il movimento senza aiuto delle mani. Questo richiede forza eccezionale degli hamstrings. La maggior parte delle persone impiega mesi per arrivarci.',
                    cues: ['No mani', 'Controllo totale', 'Costruisci gradualmente'],
                    when: 'Atleti avanzati con base di forza hamstring'
                }
            },
            
            sportContext: {
                calcio: 'Il Nordic Curl è il gold standard per la prevenzione infortuni agli hamstrings nel calcio. Studi mostrano riduzione significativa degli infortuni con 1-2 sessioni settimanali.',
                default: 'Esercizio fondamentale per forza eccentrica degli hamstrings. Previene gli infortuni che sono tra i più comuni e frustranti in ogni sport.'
            }
        },
        
        'bulgarian_split_squat': {
            name: 'Bulgarian Split Squat',
            category: 'lower_body',
            primaryMuscles: ['quadriceps', 'glutes'],
            secondaryMuscles: ['hamstrings', 'core', 'adductors'],
            
            execution: {
                setup: 'Posiziona un piede su una panca dietro di te. Il piede anteriore dovrebbe essere abbastanza avanti da permettere una discesa profonda senza che il ginocchio vada troppo oltre la punta.',
                movement: 'Abbassati piegando la gamba anteriore fino a quando il ginocchio posteriore quasi tocca terra. Il peso dovrebbe essere principalmente sulla gamba anteriore. Spingi attraverso il tallone per tornare su.',
                breathing: 'Inspira durante la discesa, espira durante la risalita.',
                commonMistakes: [
                    'Piede anteriore troppo vicino alla panca - limita il ROM',
                    'Troppo peso sul piede posteriore - la gamba posteriore è solo per equilibrio',
                    'Ginocchio che collassa verso interno - indica debolezza gluteo medio'
                ]
            },
            
            focusVariants: {
                quadriceps: {
                    title: 'Focus Quadricipiti',
                    technique: 'Busto più verticale, permetti al ginocchio di avanzare oltre la punta. Questo aumenta la flessione del ginocchio e lo stress sui quadricipiti.',
                    cues: ['Busto dritto', 'Ginocchio avanza', 'Spingi dall\'avampiede'],
                    when: 'Sviluppo quadricipiti, prevenzione squilibri'
                },
                glutes: {
                    title: 'Focus Glutei',
                    technique: 'Stance leggermente più lungo, leggera inclinazione busto in avanti. Cerca di "sederti indietro" nel movimento.',
                    cues: ['Passo più lungo', 'Siediti indietro', 'Spingi dal tallone'],
                    when: 'Sviluppo glutei, transfer atletico'
                }
            },
            
            sportContext: {
                calcio: 'Esercizio fondamentale per forza unilaterale e prevenzione infortuni. Simula la posizione di spinta nella corsa.',
                basket: 'Sviluppa forza single-leg essenziale per salti e cambi direzione.',
                default: 'Il Bulgarian Split Squat è uno dei migliori esercizi per le gambe - sviluppa forza unilaterale, equilibrio, e corregge squilibri tra le gambe.'
            }
        },
        
        'single_leg_rdl': {
            name: 'Single Leg RDL',
            category: 'lower_body',
            primaryMuscles: ['hamstrings', 'glutes'],
            secondaryMuscles: ['core', 'erectors', 'calves'],
            
            execution: {
                setup: 'In piedi su una gamba. Puoi usare un manubrio nella mano opposta alla gamba di appoggio, o bilanciere, o corpo libero.',
                movement: 'Mantieni la gamba di appoggio con leggera flessione del ginocchio. Inclina il busto in avanti mentre la gamba libera va indietro - pensa a fare una "T" con il corpo. Scendi finché senti stretch sugli hamstrings, poi torna su contraendo glutei.',
                breathing: 'Inspira durante la discesa, espira durante la risalita.',
                commonMistakes: [
                    'Perdere equilibrio - normale all\'inizio, usa un supporto se necessario',
                    'Arrotondare la schiena - mantieni la schiena neutra durante tutto il movimento',
                    'Non abbassarsi abbastanza - il ROM è limitato dalla mobilità, lavora per migliorarla'
                ]
            },
            
            focusVariants: {
                balance: {
                    title: 'Focus Equilibrio',
                    technique: 'Corpo libero, focus sul controllo e la stabilità. Pausa in basso per 2-3 secondi.',
                    cues: ['Controllo totale', 'Pausa in basso', 'Core attivo'],
                    when: 'Propriocezione, riabilitazione, riscaldamento'
                },
                strength: {
                    title: 'Focus Forza',
                    technique: 'Aggiungi carico significativo (manubrio o bilanciere). Meno enfasi sulla pausa, più sul carico progressivo.',
                    cues: ['Carico progressivo', 'ROM completo', 'Hip hinge pulito'],
                    when: 'Sviluppo forza hamstrings unilaterale'
                }
            },
            
            sportContext: {
                calcio: 'Fondamentale per forza hamstrings unilaterale e prevenzione infortuni. Simula la fase di frenata nella corsa.',
                default: 'Esercizio eccellente per equilibrio, propriocezione, e forza unilaterale della catena posteriore.'
            }
        },
        
        'step_up': {
            name: 'Step Up',
            category: 'lower_body',
            primaryMuscles: ['quadriceps', 'glutes'],
            secondaryMuscles: ['hamstrings', 'calves', 'core'],
            
            execution: {
                setup: 'Di fronte a una panca o box. L\'altezza dovrebbe essere tale che il ginocchio sia a circa 90° quando il piede è sul box.',
                movement: 'Posiziona un piede completamente sul box. Spingi attraverso quel piede per salire, portando l\'altro piede sul box. Controlla la discesa con la stessa gamba. Non usare la gamba a terra per spingerti - tutto il lavoro è sulla gamba sul box.',
                breathing: 'Espira durante la salita, inspira durante la discesa controllata.',
                commonMistakes: [
                    'Spingersi con la gamba a terra - vanifica l\'esercizio',
                    'Box troppo alto - inizia basso e progredisci',
                    'Salire troppo velocemente - controlla il movimento'
                ]
            },
            
            focusVariants: {
                strength: {
                    title: 'Focus Forza',
                    technique: 'Aggiungi manubri o bilanciere. Box alto per maggiore ROM. Movimento controllato.',
                    cues: ['No spinta gamba bassa', 'Controllo totale', 'Pausa in alto'],
                    when: 'Sviluppo forza unilaterale'
                },
                power: {
                    title: 'Focus Potenza',
                    technique: 'Step-up esplosivo con salto finale sul box. Atterraggio controllato.',
                    cues: ['Esplodi', 'Salto in alto', 'Atterraggio morbido'],
                    when: 'Sviluppo potenza verticale'
                }
            },
            
            sportContext: {
                default: 'Lo step-up è un esercizio funzionale fondamentale che trasferisce direttamente a salire scale, correre, e qualsiasi attività che richiede forza unilaterale.'
            }
        },
        
        'jump_squat': {
            name: 'Jump Squat',
            category: 'lower_body',
            primaryMuscles: ['quadriceps', 'glutes'],
            secondaryMuscles: ['hamstrings', 'calves', 'core'],
            
            execution: {
                setup: 'Posizione squat standard. Piedi larghezza spalle o leggermente più larghi. Per la versione caricata, usa manubri ai lati o bilanciere leggero.',
                movement: 'Scendi in squat (non serve profondità massima, circa parallelo), poi esplodi verso l\'alto saltando il più in alto possibile. Atterra morbidamente sugli avampiedi e ammortizza tornando in posizione di squat.',
                breathing: 'Inspira durante la discesa, espira esplosivamente durante il salto.',
                commonMistakes: [
                    'Atterrare sui talloni - sempre sugli avampiedi con ginocchia morbide',
                    'Troppo carico - il focus è la velocità, non il peso',
                    'Pausa troppo lunga tra i salti - mantieni il ritmo'
                ]
            },
            
            focusVariants: {
                power: {
                    title: 'Focus Potenza',
                    technique: 'Massima altezza ogni rep. Recupero completo tra le serie (2-3 min). Qualità > Quantità.',
                    cues: ['Massima altezza', 'Atterraggio morbido', 'Reset tra i rep'],
                    when: 'Sviluppo potenza pura, transfer verticale'
                },
                conditioning: {
                    title: 'Focus Conditioning',
                    technique: 'Reps continue senza pausa. Non cercare altezza massima ogni rep - mantieni ritmo sostenibile.',
                    cues: ['Ritmo costante', 'Non fermarti', 'Respira'],
                    when: 'Conditioning metabolico, HIIT'
                }
            },
            
            sportContext: {
                basket: 'Fondamentale per il salto verticale. Correla direttamente con altezza di salto nel gioco.',
                calcio: 'Sviluppa esplosività per contrasti aerei e scatti.',
                default: 'Il jump squat è uno degli esercizi più efficaci per sviluppare potenza degli arti inferiori in modo semplice e diretto.'
            }
        },
        
        'lateral_bounds': {
            name: 'Lateral Bounds / Salti Laterali',
            category: 'lower_body',
            primaryMuscles: ['glutes', 'adductors'],
            secondaryMuscles: ['quadriceps', 'hamstrings', 'calves', 'core'],
            
            execution: {
                setup: 'In piedi su una gamba con spazio laterale libero. Ginocchio leggermente piegato, peso sull\'avampiede.',
                movement: 'Esplodi lateralmente saltando il più lontano possibile sull\'altra gamba. Atterra controllando il movimento, stabilizzati, poi esplodi nella direzione opposta. Il focus è sulla stabilizzazione all\'atterraggio e l\'esplosività alla partenza.',
                breathing: 'Espira durante l\'esplosione, inspira durante la stabilizzazione.',
                commonMistakes: [
                    'Saltare in alto invece che di lato - il focus è la distanza orizzontale',
                    'Atterraggio instabile - pausa per stabilizzarti prima del prossimo salto',
                    'Ginocchio che collassa all\'atterraggio - mantieni allineamento'
                ]
            },
            
            focusVariants: {
                power: {
                    title: 'Focus Potenza',
                    technique: 'Cerca massima distanza laterale. Stabilizzati completamente prima del prossimo salto.',
                    cues: ['Massima distanza', 'Stabilizza', 'Controllo atterraggio'],
                    when: 'Sviluppo potenza laterale'
                },
                reactive: {
                    title: 'Focus Reattivo',
                    technique: 'Minimizza il tempo a terra. Appena tocchi, esplodi nella direzione opposta.',
                    cues: ['Tempo a terra minimo', 'Rimbalza', 'Reattivo'],
                    when: 'Sport con cambi direzione rapidi'
                }
            },
            
            sportContext: {
                basket: 'Essenziale per difesa laterale e cambi direzione rapidi.',
                calcio: 'Sviluppa la capacità di cambiare direzione velocemente.',
                default: 'I lateral bounds sviluppano potenza laterale e stabilità, capacità fondamentali per quasi tutti gli sport.'
            }
        },
        
        'calf_raise': {
            name: 'Calf Raise / Polpacci',
            category: 'lower_body',
            primaryMuscles: ['gastrocnemius', 'soleus'],
            secondaryMuscles: [],
            
            execution: {
                setup: 'Su un gradino o piattaforma con i talloni che sporgono. Puoi fare in piedi (focus gastrocnemio) o seduto (focus soleo).',
                movement: 'Abbassa i talloni sotto il livello del gradino per uno stretch completo. Poi sali sugli avampiedi il più alto possibile, contrando i polpacci. Pausa in alto, poi controlla la discesa.',
                breathing: 'Espira salendo, inspira scendendo.',
                commonMistakes: [
                    'ROM incompleto - usa l\'intero range per massimo sviluppo',
                    'Rimbalzare - controlla la fase eccentrica',
                    'Troppo veloce - tempo sotto tensione è importante per i polpacci'
                ]
            },
            
            focusVariants: {
                strength: {
                    title: 'Focus Forza',
                    technique: 'In piedi con peso (bilanciere o macchina). 8-12 reps, full ROM, pausa in alto.',
                    cues: ['Peso pesante', 'Pausa 2 sec in alto', 'Full ROM'],
                    when: 'Sviluppo forza polpacci'
                },
                eccentric: {
                    title: 'Focus Eccentrico',
                    technique: 'Scendi in 4-5 secondi, sali normalmente. Ottimo per prevenzione tendinopatia achillea.',
                    cues: ['5 sec eccentrica', 'Controllo totale'],
                    when: 'Prevenzione infortuni, riabilitazione'
                }
            },
            
            sportContext: {
                boxe: 'Polpacci forti permettono di rimanere sugli avampiedi per tutto il round.',
                basket: 'Contribuiscono alla potenza del salto.',
                default: 'I polpacci sono spesso trascurati ma fondamentali per esplosività e prevenzione infortuni.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════════
        // ADDITIONAL EXERCISES - Core
        // ═══════════════════════════════════════════════════════════════════
        
        'pallof_press': {
            name: 'Pallof Press',
            category: 'core',
            primaryMuscles: ['obliques', 'transverse_abdominis'],
            secondaryMuscles: ['glutes', 'shoulders'],
            
            execution: {
                setup: 'In piedi lateralmente a un cavo o banda elastica. Afferra la maniglia con entrambe le mani al centro del petto. Piedi larghezza spalle, ginocchia morbide.',
                movement: 'Premi le mani davanti a te estendendo le braccia. Il cavo/banda cercherà di ruotarti - resisti mantenendo il core stabile. Tieni la posizione per 2-3 secondi, poi torna al petto. Cambia lato.',
                breathing: 'Espira mentre premi avanti, mantieni tensione core durante la tenuta.',
                commonMistakes: [
                    'Ruotare con il cavo - l\'obiettivo è RESISTERE la rotazione',
                    'Braccia non completamente estese - estendi completamente per massima difficoltà',
                    'Core rilassato - mantieni tensione costante'
                ]
            },
            
            focusVariants: {
                anti_rotation: {
                    title: 'Focus Anti-Rotazione',
                    technique: 'Standard Pallof Press con pausa estesa (3-5 sec). Focus sulla stabilità totale.',
                    cues: ['Resisti rotazione', 'Core braced', 'Fianchi fermi'],
                    when: 'Stabilità core funzionale'
                },
                dynamic: {
                    title: 'Focus Dinamico',
                    technique: 'Aggiungi movimento: cammina lateralmente, step, o split stance mentre mantieni la posizione.',
                    cues: ['Muoviti lentamente', 'Mantieni stabilità', 'Respira'],
                    when: 'Progressione avanzata'
                }
            },
            
            sportContext: {
                boxe: 'Fondamentale per la potenza rotazionale controllata. La potenza del pugno viene dalla capacità di trasferire forza attraverso il core.',
                calcio: 'Stabilità durante contrasti e tiri.',
                default: 'Il Pallof Press è il re degli esercizi anti-rotazione. Costruisce stabilità core funzionale come pochi altri esercizi.'
            }
        },
        
        'bird_dog': {
            name: 'Bird Dog',
            category: 'core',
            primaryMuscles: ['core', 'erectors'],
            secondaryMuscles: ['glutes', 'shoulders'],
            
            execution: {
                setup: 'A quattro zampe con le mani sotto le spalle e le ginocchia sotto le anche. Schiena neutra, core attivo.',
                movement: 'Estendi il braccio destro in avanti e la gamba sinistra indietro simultaneamente, mantenendo la schiena neutra. Non ruotare il bacino. Tieni 2-3 secondi, torna alla posizione iniziale, ripeti dall\'altro lato.',
                breathing: 'Espira durante l\'estensione, inspira tornando alla posizione iniziale.',
                commonMistakes: [
                    'Iperestendere la schiena - mantieni neutrale',
                    'Ruotare il bacino quando estendi la gamba - i fianchi devono rimanere paralleli al pavimento',
                    'Movimento troppo veloce - controllo è tutto'
                ]
            },
            
            focusVariants: {
                stability: {
                    title: 'Focus Stabilità',
                    technique: 'Tenute lunghe (5-10 sec) in posizione estesa. Focus su zero movimento della schiena.',
                    cues: ['Tieni 5 sec', 'Zero movimento', 'Respira'],
                    when: 'Costruzione stabilità base, riabilitazione'
                },
                strength: {
                    title: 'Focus Forza',
                    technique: 'Aggiungi resistenza (cavigliere, manubrio leggero) o rallenta il tempo (3 sec estensione, 3 sec ritorno).',
                    cues: ['Movimento lento', 'Controllo totale'],
                    when: 'Progressione dopo aver padroneggiato la base'
                }
            },
            
            sportContext: {
                default: 'Il Bird Dog è uno degli esercizi fondamentali per la stabilità core secondo Stuart McGill. Perfetto per riscaldamento o riabilitazione.'
            }
        },
        
        'woodchop': {
            name: 'Woodchop / Cable Chop',
            category: 'core',
            primaryMuscles: ['obliques'],
            secondaryMuscles: ['shoulders', 'glutes', 'core'],
            
            execution: {
                setup: 'In piedi lateralmente a un cavo posizionato alto (o basso per reverse woodchop). Piedi più larghi delle spalle, ginocchia morbide.',
                movement: 'Afferra la maniglia con entrambe le mani. Ruota tirando diagonalmente dal punto alto verso il basso al lato opposto (o vice versa). La rotazione viene dai fianchi e dal core, le braccia guidano ma non tirano.',
                breathing: 'Espira durante la rotazione, inspira tornando.',
                commonMistakes: [
                    'Tirare con le braccia - la forza viene dai fianchi e dal core',
                    'Piedi fissi - i piedi possono ruotare leggermente con il movimento',
                    'Movimento troppo veloce - controllo, non momentum'
                ]
            },
            
            focusVariants: {
                power: {
                    title: 'Focus Potenza',
                    technique: 'Movimento esplosivo con controllo. Peso moderato, focus sulla velocità di rotazione.',
                    cues: ['Esplosivo', 'Dai fianchi', 'Controllo ritorno'],
                    when: 'Potenza rotazionale per sport'
                },
                control: {
                    title: 'Focus Controllo',
                    technique: 'Movimento lento e controllato (3 sec per direzione). Focus sulla connessione mente-muscolo.',
                    cues: ['Lento', 'Senti gli obliqui', 'Controllo totale'],
                    when: 'Costruzione base, connessione mente-muscolo'
                }
            },
            
            sportContext: {
                boxe: 'Simula il pattern rotazionale dei colpi. Ottimo per potenza nei ganci e uppercut.',
                default: 'Il Woodchop sviluppa potenza rotazionale funzionale utilizzata in praticamente ogni sport.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════════
        // ADDITIONAL EXERCISES - Conditioning
        // ═══════════════════════════════════════════════════════════════════
        
        'high_knees': {
            name: 'High Knees / Ginocchia Alte',
            category: 'conditioning',
            primaryMuscles: ['hip_flexors', 'core'],
            secondaryMuscles: ['quadriceps', 'calves', 'cardio'],
            
            execution: {
                setup: 'In piedi con spazio davanti a te. Braccia pronte come per correre.',
                movement: 'Corri sul posto portando le ginocchia il più alto possibile (idealmente oltre l\'anca). Le braccia si muovono in modo opposto alle gambe come nella corsa. Mantieni ritmo veloce e controllo.',
                breathing: 'Respira ritmicamente, non trattenere il fiato.',
                commonMistakes: [
                    'Ginocchia non abbastanza alte - il nome dice tutto, devono essere ALTE',
                    'Corpo che si inclina indietro - rimani verticale',
                    'Braccia ferme - le braccia devono muoversi con le gambe'
                ]
            },
            
            focusVariants: {
                warmup: {
                    title: 'Focus Riscaldamento',
                    technique: '30-60 secondi a intensità moderata. Ottimo per attivare i flessori dell\'anca.',
                    cues: ['Intensità moderata', 'Ginocchia alte', 'Braccia coordinate'],
                    when: 'Riscaldamento pre-allenamento'
                },
                hiit: {
                    title: 'Focus HIIT',
                    technique: 'Sprint massimale per 20-30 secondi. Recupero breve, ripeti.',
                    cues: ['Massima velocità', 'Ginocchia altissime', 'Tutto fuori'],
                    when: 'Conditioning ad alta intensità'
                }
            },
            
            sportContext: {
                default: 'Esercizio classico di riscaldamento e conditioning che migliora la meccanica della corsa e la potenza dei flessori dell\'anca.'
            }
        },
        
        'a_skip': {
            name: 'A-Skip / Skip Drill',
            category: 'conditioning',
            primaryMuscles: ['hip_flexors', 'calves'],
            secondaryMuscles: ['quadriceps', 'core'],
            
            execution: {
                setup: 'In piedi con spazio davanti per muoversi in avanti. Postura eretta.',
                movement: 'Salta in avanti alternando le gambe. Ad ogni passo, porta un ginocchio alto (come high knees) mentre fai un piccolo salto. Il piede di appoggio fa un "rimbalzo" attivo. Mantieni ritmo e coordinazione braccia-gambe.',
                breathing: 'Respira ritmicamente con il movimento.',
                commonMistakes: [
                    'Saltare troppo in alto invece che in avanti - è uno skip, non un salto',
                    'Ginocchio non abbastanza alto - esagera il movimento',
                    'Braccia non coordinate - braccia opposte alle gambe'
                ]
            },
            
            focusVariants: {
                technique: {
                    title: 'Focus Tecnica',
                    technique: 'Velocità moderata, enfasi sulla forma perfetta. Ogni contatto piede deve essere attivo.',
                    cues: ['Forma perfetta', 'Ginocchio alto', 'Contatto attivo'],
                    when: 'Riscaldamento, sviluppo meccanica corsa'
                },
                speed: {
                    title: 'Focus Velocità',
                    technique: 'Aumenta la frequenza mantenendo la forma. Questo sviluppa la velocità di turnover per lo sprint.',
                    cues: ['Frequenza alta', 'Mantieni forma', 'Piedi veloci'],
                    when: 'Sviluppo velocità sprint'
                }
            },
            
            sportContext: {
                calcio: 'Drill fondamentale per la meccanica della corsa. Usato da sprinter e calciatori.',
                default: 'L\'A-Skip è uno dei drill più efficaci per migliorare la meccanica della corsa e la potenza dei flessori dell\'anca.'
            }
        },
        
        'kettlebell_swing': {
            name: 'Kettlebell Swing',
            category: 'conditioning',
            primaryMuscles: ['glutes', 'hamstrings'],
            secondaryMuscles: ['core', 'shoulders', 'erectors', 'cardio'],
            
            execution: {
                setup: 'In piedi con piedi leggermente più larghi delle spalle. Kettlebell a terra davanti a te. Afferra con entrambe le mani.',
                movement: 'Il KB Swing è un HINGE, non uno squat. Spingi le anche indietro (come un deadlift), poi esplodi le anche in avanti. Le braccia sono passive - sono gli hips che lanciano il kettlebell. In alto, contrai glutei e addominali.',
                breathing: 'Inspira durante la discesa, espira esplosivamente durante lo snap delle anche.',
                commonMistakes: [
                    'Squat invece di hinge - le ginocchia si piegano poco, il movimento è dall\'anca',
                    'Tirare con le braccia - le braccia sono corde, la potenza viene dalle anche',
                    'Schiena che si arrotonda - mantieni schiena neutra, core braced'
                ]
            },
            
            focusVariants: {
                power: {
                    title: 'Focus Potenza',
                    technique: 'KB pesante, reps basse (8-12), focus su esplosività massima delle anche.',
                    cues: ['Esplosione anche', 'Squeeze glutei in alto', 'Potenza non volume'],
                    when: 'Sviluppo potenza catena posteriore'
                },
                conditioning: {
                    title: 'Focus Conditioning',
                    technique: 'KB moderato, reps alte (20+) o tempo (30-60 sec). Mantieni ritmo costante.',
                    cues: ['Ritmo costante', 'Respira', 'Non fermarti'],
                    when: 'Conditioning metabolico'
                }
            },
            
            sportContext: {
                boxe: 'Sviluppa l\'esplosione delle anche che è la base della potenza nei colpi.',
                default: 'Il KB Swing è uno degli esercizi più completi - sviluppa potenza, conditioning, e forza della catena posteriore in un unico movimento.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════════
        // MORE ESSENTIAL EXERCISES
        // ═══════════════════════════════════════════════════════════════════
        
        'hip_thrust': {
            name: 'Hip Thrust',
            category: 'lower_body',
            primaryMuscles: ['glutes'],
            secondaryMuscles: ['hamstrings', 'core'],
            
            execution: {
                setup: 'Schiena appoggiata su una panca all\'altezza delle scapole. Piedi a terra alla larghezza delle anche. Bilanciere sui fianchi (usa un pad per comfort).',
                movement: 'Spingi attraverso i talloni, sollevando i fianchi fino a che il corpo forma una linea retta dalle spalle alle ginocchia. Contrai i glutei in cima per 1-2 secondi, poi abbassa controllando.',
                breathing: 'Espira durante la spinta verso l\'alto, inspira durante la discesa.',
                commonMistakes: [
                    'Iperestendere la schiena in alto - fermati quando fianchi, ginocchia e spalle sono allineati',
                    'Piedi troppo vicini o lontani - sperimenta per trovare la posizione che massimizza l\'attivazione dei glutei',
                    'Non contrarre i glutei in cima - la pausa con contrazione è fondamentale'
                ]
            },
            
            focusVariants: {
                glutes: {
                    title: 'Focus Glutei',
                    technique: 'Pausa in cima per 2-3 secondi con massima contrazione. Pensa a "spremere" i glutei.',
                    cues: ['Squeeze in alto', 'Pausa 2-3 sec', 'Mento al petto'],
                    when: 'Massimo sviluppo glutei'
                },
                strength: {
                    title: 'Focus Forza',
                    technique: 'Carico pesante, 5-8 reps. Controllo nella discesa, esplosione nella salita.',
                    cues: ['Carico pesante', 'Esplosivo', 'Controllo eccentrico'],
                    when: 'Sviluppo forza glutei'
                }
            },
            
            sportContext: {
                calcio: 'Glutei forti = sprint più veloci e tiri più potenti.',
                default: 'L\'Hip Thrust è l\'esercizio più efficace per isolare e sviluppare i glutei.'
            }
        },
        
        'leg_press': {
            name: 'Leg Press',
            category: 'lower_body',
            primaryMuscles: ['quadriceps', 'glutes'],
            secondaryMuscles: ['hamstrings', 'calves'],
            
            execution: {
                setup: 'Siediti con la schiena completamente appoggiata. Piedi sulla piattaforma alla larghezza delle spalle o più larghi.',
                movement: 'Abbassa la piattaforma piegando le ginocchia fino a circa 90° (o oltre se hai la mobilità). Spingi per risalire senza bloccare completamente le ginocchia in alto.',
                breathing: 'Inspira durante la discesa, espira durante la spinta.',
                commonMistakes: [
                    'Schiena che si stacca dallo schienale - riduci la profondità',
                    'Bloccare le ginocchia in alto - mantieni una leggera flessione',
                    'Piedi troppo bassi sulla piattaforma - questo stressa le ginocchia'
                ]
            },
            
            focusVariants: {
                quadriceps: {
                    title: 'Focus Quadricipiti',
                    technique: 'Piedi più in basso sulla piattaforma, stance stretta.',
                    cues: ['Piedi in basso', 'Stance stretta', 'Full ROM'],
                    when: 'Sviluppo quadricipiti'
                },
                glutes: {
                    title: 'Focus Glutei',
                    technique: 'Piedi alti sulla piattaforma, stance larga, punte extraruotate.',
                    cues: ['Piedi in alto', 'Stance larga', 'Profondità'],
                    when: 'Sviluppo glutei e femorali'
                }
            },
            
            sportContext: {
                default: 'La leg press è un\'ottima opzione per chi ha problemi alla schiena o vuole volume extra sulle gambe senza stress assiale.'
            }
        },
        
        'leg_curl': {
            name: 'Leg Curl',
            category: 'lower_body',
            primaryMuscles: ['hamstrings'],
            secondaryMuscles: ['calves'],
            
            execution: {
                setup: 'Sdraiato sulla macchina con le ginocchia allineate al perno. Il cuscinetto dovrebbe essere appena sopra i talloni.',
                movement: 'Fletti le ginocchia portando i talloni verso i glutei. Contrai gli hamstrings in cima, poi abbassa lentamente.',
                breathing: 'Espira durante la flessione, inspira durante l\'estensione.',
                commonMistakes: [
                    'Sollevare i fianchi - mantieni i fianchi premuti contro il pad',
                    'Usare slancio - movimento controllato',
                    'ROM incompleto - full range per massimo sviluppo'
                ]
            },
            
            focusVariants: {
                hypertrophy: {
                    title: 'Focus Ipertrofia',
                    technique: '10-15 reps, pausa in contrazione, eccentrica lenta (3-4 sec).',
                    cues: ['Pausa in alto', 'Eccentrica lenta', 'Squeeze'],
                    when: 'Sviluppo massa hamstrings'
                },
                eccentric: {
                    title: 'Focus Eccentrico',
                    technique: '5 sec nella fase di discesa. Eccellente per prevenzione infortuni.',
                    cues: ['5 sec discesa', 'Controllo totale', 'Prevenzione'],
                    when: 'Prevenzione infortuni, riabilitazione'
                }
            },
            
            sportContext: {
                calcio: 'Fondamentale per bilanciare la forza quad/hamstring e prevenire infortuni.',
                default: 'Il leg curl è uno dei pochi esercizi che isola gli hamstrings nella funzione di flessione del ginocchio.'
            }
        },
        
        'lat_pulldown': {
            name: 'Lat Pulldown',
            category: 'upper_body_pull',
            primaryMuscles: ['lats'],
            secondaryMuscles: ['biceps', 'rear_delts', 'rhomboids'],
            
            execution: {
                setup: 'Siediti alla macchina con le cosce bloccate sotto i pad. Afferra la barra con presa larga (1.5x larghezza spalle).',
                movement: 'Tira la barra verso la parte alta del petto, guidando con i gomiti verso i fianchi. Contrai i dorsali, poi torna su controllando.',
                breathing: 'Espira durante la trazione, inspira durante la risalita.',
                commonMistakes: [
                    'Tirare con le braccia - pensa a guidare con i gomiti',
                    'Inclinarsi troppo indietro - leggera inclinazione va bene, non eccessiva',
                    'Non estendere completamente in alto - full stretch per massimo sviluppo'
                ]
            },
            
            focusVariants: {
                lats: {
                    title: 'Focus Dorsali',
                    technique: 'Presa larga, focus su tirare i gomiti verso i fianchi. Pausa in basso.',
                    cues: ['Gomiti ai fianchi', 'Presa larga', 'Squeeze dorsali'],
                    when: 'Sviluppo larghezza schiena'
                },
                strength: {
                    title: 'Focus Forza',
                    technique: 'Carico pesante, 6-8 reps. Eccentrica controllata.',
                    cues: ['Peso pesante', 'Controllo', 'Progressione'],
                    when: 'Costruzione forza per trazioni'
                }
            },
            
            sportContext: {
                default: 'Il lat pulldown è l\'esercizio fondamentale per sviluppare i dorsali, perfetto per costruire forza per le trazioni.'
            }
        },
        
        'face_pull': {
            name: 'Face Pull',
            category: 'upper_body_pull',
            primaryMuscles: ['rear_delts', 'rhomboids'],
            secondaryMuscles: ['rotator_cuff', 'traps'],
            
            execution: {
                setup: 'Cavo alto con corda. Afferra con presa neutra (pollici verso di te).',
                movement: 'Tira verso il viso separando le mani. I gomiti vanno in alto e indietro. Alla fine del movimento, ruota esternamente le spalle (pollici che puntano indietro).',
                breathing: 'Espira durante la trazione, inspira tornando.',
                commonMistakes: [
                    'Tirare troppo in basso - tira verso il viso, non verso il petto',
                    'Saltare l\'extrarotazione finale - è la parte più importante',
                    'Usare troppo peso - questo è un esercizio di qualità, non di peso'
                ]
            },
            
            focusVariants: {
                shoulder_health: {
                    title: 'Focus Salute Spalle',
                    technique: 'Volume alto (15-20 reps), peso leggero. Enfasi sull\'extrarotazione finale.',
                    cues: ['Peso leggero', 'Reps alte', 'Extrarotazione'],
                    when: 'Prevenzione infortuni, bilanciamento push/pull'
                },
                strength: {
                    title: 'Focus Forza',
                    technique: 'Peso moderato, 10-12 reps con pausa in contrazione.',
                    cues: ['Pausa 2 sec', 'Squeeze scapole', 'Controllo'],
                    when: 'Sviluppo deltoidi posteriori'
                }
            },
            
            sportContext: {
                boxe: 'Fondamentale per bilanciare tutto il lavoro di push (jab, cross) e mantenere spalle sane.',
                default: 'Il Face Pull è probabilmente l\'esercizio più importante per la salute delle spalle, specialmente per chi fa tanto lavoro di push.'
            }
        },
        
        'incline_bench_press': {
            name: 'Incline Bench Press / Panca Inclinata',
            category: 'upper_body_push',
            primaryMuscles: ['chest', 'front_delts'],
            secondaryMuscles: ['triceps'],
            
            execution: {
                setup: 'Panca inclinata a 30-45°. Piedi a terra, scapole retratte. Presa leggermente più larga delle spalle.',
                movement: 'Abbassa la barra al petto alto (sotto le clavicole). Spingi esplosivamente verso l\'alto e leggermente indietro.',
                breathing: 'Inspira durante la discesa, espira durante la spinta.',
                commonMistakes: [
                    'Inclinazione troppo alta - 30-45° è ottimale, oltre diventa troppo "spalle"',
                    'Abbassare la barra troppo in basso - deve toccare il petto alto',
                    'Gomiti troppo larghi - 45-60° rispetto al corpo'
                ]
            },
            
            focusVariants: {
                chest: {
                    title: 'Focus Petto Alto',
                    technique: '30° di inclinazione, focus su sentire lo stretch del petto in basso.',
                    cues: ['30° inclinazione', 'Stretch in basso', 'Squeeze in alto'],
                    when: 'Sviluppo petto alto'
                },
                strength: {
                    title: 'Focus Forza',
                    technique: 'Carico pesante, 5-8 reps. Pausa al petto.',
                    cues: ['Pause al petto', 'Esplosione', 'Controllo'],
                    when: 'Costruzione forza push'
                }
            },
            
            sportContext: {
                default: 'La panca inclinata sviluppa la porzione clavicolare del petto, creando un aspetto più completo.'
            }
        },
        
        'romanian_deadlift': {
            name: 'Romanian Deadlift / RDL',
            category: 'lower_body',
            primaryMuscles: ['hamstrings', 'glutes'],
            secondaryMuscles: ['erectors', 'lats'],
            
            execution: {
                setup: 'In piedi con bilanciere o manubri. Piedi alla larghezza dei fianchi. Leggera flessione delle ginocchia che rimane COSTANTE.',
                movement: 'Spingi i fianchi INDIETRO (non in basso) mantenendo il peso vicino alle gambe. Scendi finché senti un forte stretch sugli hamstrings. I fianchi tornano in avanti per risalire.',
                breathing: 'Inspira durante la discesa, espira durante la risalita.',
                commonMistakes: [
                    'Piegare le ginocchia durante il movimento - devono rimanere nella stessa posizione',
                    'Arrotondare la schiena - mantieni neutra durante tutto il movimento',
                    'Bilanciere che si allontana dalle gambe - deve "scivolare" lungo le cosce'
                ]
            },
            
            focusVariants: {
                hamstrings: {
                    title: 'Focus Hamstrings',
                    technique: 'Ginocchia quasi dritte (15-20° flessione), massimo stretch. Tempo lento (4-1-2).',
                    cues: ['Ginocchia semifisse', 'Senti lo stretch', '4 sec discesa'],
                    when: 'Sviluppo hamstrings, flessibilità'
                },
                strength: {
                    title: 'Focus Forza',
                    technique: 'Carico significativo, 6-8 reps. Mantieni controllo.',
                    cues: ['Peso pesante', 'Controllo', 'Schiena neutra'],
                    when: 'Forza catena posteriore'
                }
            },
            
            sportContext: {
                calcio: 'Fondamentale per forza eccentrica degli hamstrings - previene infortuni durante lo sprint.',
                default: 'L\'RDL è il re degli esercizi per gli hamstrings. Sviluppa forza e flessibilità simultaneamente.'
            }
        },
        
        'copenhagen_adductor': {
            name: 'Copenhagen Adductor',
            category: 'lower_body',
            primaryMuscles: ['adductors'],
            secondaryMuscles: ['core', 'obliques'],
            
            execution: {
                setup: 'Posizione side plank. La gamba superiore è appoggiata su una panca (ginocchio o piede). La gamba inferiore è sospesa.',
                movement: 'Solleva la gamba inferiore verso la panca contraendo gli adduttori. Tieni 1-2 sec, poi abbassa controllando. Puoi anche fare isometrico (tieni la posizione).',
                breathing: 'Respira normalmente, mantieni tensione core.',
                commonMistakes: [
                    'Ruotare il bacino - mantieni fianchi impilati',
                    'Usare lo slancio - movimento controllato',
                    'Saltare le progressioni - inizia dalla versione semplice (ginocchio sulla panca)'
                ]
            },
            
            focusVariants: {
                beginner: {
                    title: 'Focus Principiante',
                    technique: 'Ginocchio (non piede) sulla panca. Isometrico per 20-30 sec.',
                    cues: ['Ginocchio sulla panca', 'Tieni la posizione', 'Core attivo'],
                    when: 'Costruzione base, principianti'
                },
                advanced: {
                    title: 'Focus Avanzato',
                    technique: 'Piede sulla panca, gamba tesa. Reps dinamiche 8-12.',
                    cues: ['Gamba tesa', 'Controllo totale', 'Squeeze adduttori'],
                    when: 'Atleti avanzati, prevenzione'
                }
            },
            
            sportContext: {
                calcio: 'ESSENZIALE per prevenzione infortuni all\'inguine. Studi mostrano riduzione significativa degli infortuni con 2 sessioni settimanali.',
                default: 'Il Copenhagen è il gold standard per la prevenzione infortuni agli adduttori.'
            }
        },
        
        'power_clean': {
            name: 'Power Clean',
            category: 'power',
            primaryMuscles: ['glutes', 'hamstrings', 'traps'],
            secondaryMuscles: ['quadriceps', 'shoulders', 'core'],
            
            execution: {
                setup: 'Bilanciere a terra. Piedi alla larghezza dei fianchi. Presa appena fuori dalle ginocchia. Schiena neutra, petto alto.',
                movement: '1° pull: solleva il bilanciere fino alle ginocchia (lento e controllato). 2° pull: ESPLODI con le anche, triple extension (caviglie, ginocchia, anche). 3° catch: "tuffati" sotto il bilanciere, ricevi in posizione front squat.',
                breathing: 'Grande respiro prima del pull. Espira durante l\'esplosione.',
                commonMistakes: [
                    'Tirare con le braccia - le braccia sono corde, la potenza viene dalle anche',
                    'Non estendere completamente - triple extension completa prima di tirare sotto',
                    'Catch con gomiti bassi - i gomiti devono essere ALTI nella posizione rack'
                ]
            },
            
            focusVariants: {
                power: {
                    title: 'Focus Potenza',
                    technique: 'Carichi moderati (60-75% max), 2-3 reps. Massima velocità.',
                    cues: ['Esplosivo', 'Velocità > peso', 'Tecnica perfetta'],
                    when: 'Sviluppo rate of force development'
                },
                technique: {
                    title: 'Focus Tecnico',
                    technique: 'Peso leggero, focus su ogni fase. Hang clean per semplificare.',
                    cues: ['Peso leggero', 'Ogni fase corretta', 'Pazienza'],
                    when: 'Apprendimento tecnica, riscaldamento'
                }
            },
            
            sportContext: {
                calcio: 'Sviluppa potenza esplosiva per sprint e salti.',
                default: 'Il Power Clean è uno degli esercizi più efficaci per sviluppare potenza totale del corpo.'
            }
        },
        
        'dumbbell_row': {
            name: 'Dumbbell Row / Rematore Manubrio',
            category: 'upper_body_pull',
            primaryMuscles: ['lats', 'rhomboids'],
            secondaryMuscles: ['biceps', 'rear_delts', 'core'],
            
            execution: {
                setup: 'Un ginocchio e una mano sulla panca. L\'altra gamba a terra per stabilità. Manubrio nella mano libera, braccio lungo.',
                movement: 'Tira il manubrio verso il fianco, guidando con il gomito. Pensa a "mettere il gomito in tasca". Abbassa controllando.',
                breathing: 'Espira durante la trazione, inspira durante la discesa.',
                commonMistakes: [
                    'Ruotare il busto per tirare più peso - mantieni il torso fermo',
                    'Tirare verso la spalla invece del fianco - gomito va verso l\'anca',
                    'Non estendere completamente in basso - full stretch per i dorsali'
                ]
            },
            
            focusVariants: {
                lats: {
                    title: 'Focus Dorsali',
                    technique: 'Tira verso il fianco, gomito vicino al corpo. Pausa in alto.',
                    cues: ['Gomito al fianco', 'Pausa 1 sec', 'Squeeze'],
                    when: 'Sviluppo dorsali'
                },
                mid_back: {
                    title: 'Focus Mid-Back',
                    technique: 'Gomito più largo (45°), tira verso la gabbia toracica.',
                    cues: ['Gomito largo', 'Tira alla gabbia', 'Scapole retratte'],
                    when: 'Sviluppo romboidi e trapezio medio'
                }
            },
            
            sportContext: {
                boxe: 'Sviluppa la forza di trazione per il clinch e il bilanciamento del push dei colpi.',
                default: 'Il dumbbell row è versatile - permette di lavorare unilateralmente correggendo squilibri.'
            }
        },
        
        'depth_jump': {
            name: 'Depth Jump',
            category: 'power',
            primaryMuscles: ['quadriceps', 'glutes'],
            secondaryMuscles: ['calves', 'hamstrings', 'core'],
            
            execution: {
                setup: 'In piedi su un box (30-60cm per iniziare). Piedi al bordo.',
                movement: 'CADI (non saltare) dal box. Appena tocchi terra, ESPLODI immediatamente verso l\'alto. Il tempo a terra deve essere MINIMO - è un rimbalzo reattivo.',
                breathing: 'Espira durante l\'esplosione verso l\'alto.',
                commonMistakes: [
                    'Saltare dal box invece di cadere - questo aggiunge tempo a terra',
                    'Tempo a terra troppo lungo - deve essere un rimbalzo immediato',
                    'Box troppo alto - inizia basso, progredisci gradualmente'
                ]
            },
            
            focusVariants: {
                reactive: {
                    title: 'Focus Reattivo',
                    technique: 'Box basso (30-40cm), focus su tempo a terra MINIMO (<0.2 sec).',
                    cues: ['Tempo a terra minimo', 'Rimbalza subito', 'Rigido come molla'],
                    when: 'Sviluppo reactive strength'
                },
                height: {
                    title: 'Focus Altezza',
                    technique: 'Box moderato, focus su massima altezza del salto.',
                    cues: ['Assorbi', 'Esplodi massimo', 'Braccia coordinate'],
                    when: 'Sviluppo salto verticale'
                }
            },
            
            sportContext: {
                basket: 'Uno dei migliori esercizi per migliorare il salto verticale.',
                default: 'Il Depth Jump sviluppa la reactive strength - la capacità di passare rapidamente da eccentrico a concentrico.'
            }
        },
        
        'broad_jump': {
            name: 'Broad Jump / Salto in Lungo',
            category: 'power',
            primaryMuscles: ['glutes', 'quadriceps'],
            secondaryMuscles: ['hamstrings', 'calves', 'core'],
            
            execution: {
                setup: 'In piedi con spazio davanti. Piedi alla larghezza delle spalle.',
                movement: 'Carica piegando le ginocchia e portando le braccia indietro. ESPLODI in avanti e in alto (circa 45°). Le braccia oscillano in avanti per momentum. Atterra su entrambi i piedi, ammortizzando.',
                breathing: 'Espira durante l\'esplosione.',
                commonMistakes: [
                    'Troppo verticale o troppo orizzontale - l\'angolo ottimale è circa 45°',
                    'Non usare le braccia - lo swing delle braccia aggiunge potenza significativa',
                    'Atterraggio rigido - ammortizza con le ginocchia'
                ]
            },
            
            focusVariants: {
                distance: {
                    title: 'Focus Distanza',
                    technique: 'Massima distanza ogni rep. Recupero completo (30-60 sec) tra i salti.',
                    cues: ['Massima distanza', 'Angolo 45°', 'Braccia potenti'],
                    when: 'Sviluppo potenza orizzontale'
                },
                reactive: {
                    title: 'Focus Reattivo',
                    technique: 'Salti continui in avanti (3-5 consecutivi). Minimo tempo a terra tra i salti.',
                    cues: ['Rimbalza subito', 'Mantieni forma', 'Ritmo'],
                    when: 'Sviluppo reactive strength, conditioning'
                }
            },
            
            sportContext: {
                calcio: 'Sviluppa la potenza orizzontale fondamentale per l\'accelerazione.',
                default: 'Il Broad Jump è un ottimo test e esercizio per la potenza degli arti inferiori.'
            }
        },
        
        // ═══════════════════════════════════════════════════════════════════
        // WARMUP / MOBILITY EXERCISES
        // ═══════════════════════════════════════════════════════════════════
        
        'glute_bridge': {
            name: 'Glute Bridge',
            category: 'activation',
            primaryMuscles: ['glutes'],
            secondaryMuscles: ['hamstrings', 'core'],
            
            execution: {
                setup: 'Sdraiato sulla schiena, ginocchia piegate, piedi a terra alla larghezza dei fianchi.',
                movement: 'Spingi attraverso i talloni e solleva i fianchi fino a formare una linea retta dalle spalle alle ginocchia. Contrai i glutei in cima per 1-2 secondi, poi abbassa controllando.',
                breathing: 'Espira durante la salita, inspira durante la discesa.',
                commonMistakes: [
                    'Iperestendere la schiena - fermati quando fianchi e spalle sono allineati',
                    'Spingere dalle punte invece che dai talloni',
                    'Non contrarre i glutei in cima'
                ]
            },
            
            focusVariants: {
                activation: {
                    title: 'Focus Attivazione',
                    technique: 'Pausa di 2 secondi in cima con squeeze massimo dei glutei.',
                    cues: ['Squeeze glutei', 'Pausa in alto', 'Talloni a terra'],
                    when: 'Warmup, attivazione pre-squat/deadlift'
                }
            },
            
            sportContext: {
                default: 'Il Glute Bridge è fondamentale per attivare i glutei prima di squat e deadlift.'
            }
        },
        
        'cat_cow': {
            name: 'Cat-Cow',
            category: 'mobility',
            primaryMuscles: ['erectors'],
            secondaryMuscles: ['core', 'hip_flexors'],
            
            execution: {
                setup: 'Quadrupedia: mani sotto le spalle, ginocchia sotto i fianchi.',
                movement: 'CAT: arrotonda la schiena verso il soffitto, mento al petto, coccige in dentro. COW: inarca la schiena, pancia verso il pavimento, guarda in alto. Alterna fluidamente.',
                breathing: 'Inspira in COW (inarcamento), espira in CAT (arrotondamento).',
                commonMistakes: [
                    'Muovere solo la testa invece di tutta la colonna',
                    'Movimento troppo veloce - deve essere fluido e controllato',
                    'Non sincronizzare il respiro'
                ]
            },
            
            focusVariants: {
                mobility: {
                    title: 'Focus Mobilità Spinale',
                    technique: '10-15 cicli lenti, sincronizzati con il respiro.',
                    cues: ['Inspira COW', 'Espira CAT', 'Tutta la colonna'],
                    when: 'Warmup, mobilità mattutina'
                }
            },
            
            sportContext: {
                default: 'Il Cat-Cow è uno dei migliori esercizi per la mobilità della colonna vertebrale.'
            }
        },
        
        'worlds_greatest_stretch': {
            name: 'World\'s Greatest Stretch',
            category: 'mobility',
            primaryMuscles: ['hip_flexors', 'hamstrings', 'thoracic'],
            secondaryMuscles: ['glutes', 'groin', 'shoulders'],
            
            execution: {
                setup: 'Parti in posizione di lunge profondo, gamba destra avanti.',
                movement: '1) Porta il gomito destro verso il tallone interno. 2) Ruota e apri il braccio destro verso il soffitto. 3) Raddrizza la gamba anteriore per stretching hamstring. 4) Torna al lunge e ripeti.',
                breathing: 'Espira nelle posizioni di stretch, respira normalmente tra i movimenti.',
                commonMistakes: [
                    'Lunge non abbastanza profondo - anca bassa',
                    'Non ruotare abbastanza nella fase toracica',
                    'Fretta - ogni posizione va tenuta 2-3 respiri'
                ]
            },
            
            focusVariants: {
                complete: {
                    title: 'Focus Completo',
                    technique: '3-5 reps per lato, passando per tutte le posizioni.',
                    cues: ['Gomito a terra', 'Ruota e apri', 'Hamstring stretch'],
                    when: 'Warmup completo, mobilità totale'
                }
            },
            
            sportContext: {
                default: 'Il World\'s Greatest Stretch mobilizza anche, colonna toracica, e hamstrings in un unico movimento.'
            }
        },
        
        'band_pull_apart': {
            name: 'Band Pull Apart',
            category: 'activation',
            primaryMuscles: ['rear_delts', 'rhomboids'],
            secondaryMuscles: ['rotator_cuff', 'traps'],
            
            execution: {
                setup: 'In piedi, banda elastica tenuta a braccia tese davanti al petto, presa alla larghezza delle spalle.',
                movement: 'Tira la banda allargando le braccia fino a che tocca il petto. Concentrati su retrarre le scapole. Torna lentamente alla posizione iniziale.',
                breathing: 'Espira tirando, inspira tornando.',
                commonMistakes: [
                    'Alzare le spalle - tienile basse e retratte',
                    'Piegare i gomiti - braccia quasi tese',
                    'Usare banda troppo rigida - il movimento deve essere controllato'
                ]
            },
            
            focusVariants: {
                activation: {
                    title: 'Focus Attivazione',
                    technique: '2x15, pausa di 1 secondo con banda al petto.',
                    cues: ['Scapole insieme', 'Spalle basse', 'Pausa al petto'],
                    when: 'Pre-pressing, attivazione spalle'
                }
            },
            
            sportContext: {
                boxe: 'Fondamentale per bilanciare il lavoro di push e mantenere le spalle sane.',
                default: 'Il Band Pull Apart è essenziale per la salute delle spalle, specialmente per chi fa tanto pressing.'
            }
        },
        
        'leg_swings': {
            name: 'Leg Swings (Oscillazioni Gamba)',
            category: 'mobility',
            primaryMuscles: ['hip_flexors', 'hamstrings'],
            secondaryMuscles: ['glutes', 'adductors'],
            
            execution: {
                setup: 'In piedi, tieni qualcosa per equilibrio (muro, rack).',
                movement: 'FRONTALI: Oscilla la gamba avanti e indietro come un pendolo, aumentando gradualmente il range. LATERALI: Oscilla la gamba da un lato all\'altro davanti al corpo.',
                breathing: 'Respira normalmente, mantieni ritmo costante.',
                commonMistakes: [
                    'Oscillare troppo veloce all\'inizio - aumenta gradualmente',
                    'Ruotare il busto - tieni il core stabile',
                    'Non usare il full range disponibile'
                ]
            },
            
            focusVariants: {
                dynamic: {
                    title: 'Focus Dinamico',
                    technique: '10-15 oscillazioni per gamba per direzione, aumentando progressivamente il range.',
                    cues: ['Aumenta gradualmente', 'Core stabile', 'Controllo'],
                    when: 'Warmup pre-corsa, pre-squat'
                }
            },
            
            sportContext: {
                calcio: 'Preparazione dinamica per anche e hamstrings prima di sprint e calci.',
                default: 'I Leg Swings sono mobilità dinamica perfetta per preparare anche e gambe.'
            }
        },
        
        'arm_circles': {
            name: 'Arm Circles (Cerchi Braccia)',
            category: 'mobility',
            primaryMuscles: ['shoulders'],
            secondaryMuscles: ['rotator_cuff', 'traps'],
            
            execution: {
                setup: 'In piedi, braccia lungo i fianchi.',
                movement: 'Inizia con cerchi piccoli e aumenta progressivamente la dimensione. Prima in avanti, poi indietro. Mantieni le braccia dritte.',
                breathing: 'Respira normalmente.',
                commonMistakes: [
                    'Iniziare con cerchi troppo grandi',
                    'Non fare entrambe le direzioni',
                    'Piegare i gomiti'
                ]
            },
            
            focusVariants: {
                progressive: {
                    title: 'Focus Progressivo',
                    technique: '10 piccoli + 10 medi + 10 grandi, per ogni direzione.',
                    cues: ['Piccoli → Grandi', 'Avanti e Indietro', 'Braccia tese'],
                    when: 'Warmup spalle'
                }
            },
            
            sportContext: {
                default: 'I cerchi braccia sono un classico warmup per mobilizzare le spalle progressivamente.'
            }
        },
        
        'dynamic_locomotion': {
            name: 'Locomotion Dinamica',
            category: 'warmup',
            primaryMuscles: ['full_body'],
            secondaryMuscles: ['cardiovascular'],
            
            execution: {
                setup: 'Spazio di almeno 10-20 metri davanti a te.',
                movement: 'Esegui in sequenza: High Knees (ginocchia alte), Butt Kicks (talloni ai glutei), Lateral Shuffle (scivolamento laterale), Carioca (passo incrociato). 20m per esercizio.',
                breathing: 'Respiro naturale, aumenta con l\'intensità.',
                commonMistakes: [
                    'Partire troppo veloce - aumenta gradualmente',
                    'Tecnica sciatta - anche a velocità moderata, forma corretta',
                    'Non fare tutti gli esercizi'
                ]
            },
            
            focusVariants: {
                general: {
                    title: 'Focus Generale',
                    technique: '2 round di tutti gli esercizi, aumentando l\'intensità nel secondo round.',
                    cues: ['20m ciascuno', 'Tecnica prima', 'Aumenta velocità'],
                    when: 'Warmup generale'
                }
            },
            
            sportContext: {
                default: 'La locomotion dinamica prepara tutto il corpo aumentando temperatura e frequenza cardiaca.'
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // METODI PRINCIPALI
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Analizza i parametri dell'esercizio per determinare il tipo di lavoro
     * Restituisce: 'warmup', 'strength', 'power', 'hypertrophy', 'endurance', 'hiit', 'technique'
     */
    analyzeExerciseParams(context = {}) {
        const { sets, reps, duration, rest, sectionType } = context;
        
        // Converti reps in numero se stringa
        let repsNum = 0;
        if (reps) {
            if (typeof reps === 'string') {
                // Gestisce "8-12", "10", "30sec", "2 min", etc.
                const match = reps.match(/(\d+)/);
                if (match) repsNum = parseInt(match[1]);
            } else {
                repsNum = reps;
            }
        }
        
        // Converti duration in secondi
        let durationSec = 0;
        if (duration) {
            const durStr = String(duration).toLowerCase();
            if (durStr.includes('min')) {
                const match = durStr.match(/(\d+)/);
                if (match) durationSec = parseInt(match[1]) * 60;
            } else if (durStr.includes('sec') || durStr.match(/^\d+s?$/)) {
                const match = durStr.match(/(\d+)/);
                if (match) durationSec = parseInt(match[1]);
            } else {
                // Assume minuti se solo numero > 3, altrimenti secondi
                const match = durStr.match(/(\d+)/);
                if (match) {
                    const num = parseInt(match[1]);
                    durationSec = num > 3 ? num : num * 60;
                }
            }
        }
        
        // Parse sets
        const setsNum = parseInt(sets) || 3;
        
        // Logica di determinazione basata sui parametri
        
        // 1. Sezione warmup esplicita
        if (sectionType === 'warmup' || sectionType === 'riscaldamento') {
            return { type: 'warmup', confidence: 'high' };
        }
        
        // 2. Durata specifica per esercizi time-based
        if (durationSec > 0) {
            if (durationSec <= 60) {
                return { type: 'warmup', confidence: 'medium', reason: `${durationSec}sec = breve attivazione` };
            } else if (durationSec <= 120) {
                return { type: 'technique', confidence: 'medium', reason: `${Math.round(durationSec/60)}min = focus tecnico` };
            } else if (durationSec <= 300) {
                return { type: 'conditioning', confidence: 'high', reason: `${Math.round(durationSec/60)}min = conditioning` };
            } else {
                return { type: 'endurance', confidence: 'high', reason: `${Math.round(durationSec/60)}min = resistenza` };
            }
        }
        
        // 3. Basato su reps
        if (repsNum > 0) {
            if (repsNum <= 3) {
                return { type: 'power', confidence: 'high', reason: `${repsNum} reps = potenza/forza massimale` };
            } else if (repsNum <= 6) {
                return { type: 'strength', confidence: 'high', reason: `${repsNum} reps = forza` };
            } else if (repsNum <= 12) {
                return { type: 'hypertrophy', confidence: 'high', reason: `${repsNum} reps = ipertrofia` };
            } else if (repsNum <= 20) {
                return { type: 'endurance', confidence: 'medium', reason: `${repsNum} reps = resistenza muscolare` };
            } else {
                return { type: 'conditioning', confidence: 'high', reason: `${repsNum} reps = conditioning` };
            }
        }
        
        // 4. Basato su sets (se non abbiamo reps/duration)
        if (setsNum <= 2) {
            return { type: 'warmup', confidence: 'low', reason: 'Pochi set = attivazione' };
        }
        
        // Default
        return { type: 'general', confidence: 'low' };
    },
    
    /**
     * Determina automaticamente il focus ottimale per l'esercizio
     * VERSIONE INTELLIGENTE: analizza sets/reps/duration per scegliere focus appropriato
     */
    determineOptimalFocus(guide, context = {}) {
        if (!guide || !guide.focusVariants) return null;
        
        const { goal, phase, sport, sessionType } = context;
        const availableFocuses = Object.keys(guide.focusVariants);
        
        // PRIMA: Analizza i parametri dell'esercizio
        const exerciseAnalysis = this.analyzeExerciseParams(context);
        
        // Mapping parametri esercizio → focus preferiti
        const paramBasedFocusMap = {
            'warmup': ['warmup', 'technique', 'rhythm', 'standard', 'stability'],
            'technique': ['technique', 'accuracy', 'standard', 'warmup', 'rhythm'],
            'strength': ['strength', 'power', 'back', 'lats', 'quadriceps', 'glutes'],
            'power': ['power', 'reactive', 'height', 'strength', 'speed'],
            'hypertrophy': ['chest', 'lats', 'quadriceps', 'glutes', 'hamstrings', 'anterior', 'lateral', 'mid_back'],
            'endurance': ['endurance', 'conditioning', 'cardio', 'volume', 'intervals'],
            'conditioning': ['conditioning', 'endurance', 'intervals', 'hiit', 'cardio'],
            'hiit': ['intervals', 'hiit', 'conditioning', 'speed'],
            'general': [] // Usa altri criteri
        };
        
        // Mapping priorità focus per obiettivo atleta
        const goalFocusMap = {
            'power': ['power', 'strength', 'reactive', 'height'],
            'strength': ['strength', 'power', 'back', 'lats'],
            'maximal_strength': ['strength', 'power', 'back'],
            'hypertrophy': ['chest', 'lats', 'quadriceps', 'glutes', 'mid_back', 'hamstrings'],
            'muscle_gain': ['chest', 'lats', 'quadriceps', 'glutes', 'anterior', 'lateral'],
            'sport_performance': ['power', 'reactive', 'speed', 'coordination'],
            'athletic': ['power', 'speed', 'coordination', 'reactive'],
            'endurance': ['endurance', 'conditioning', 'cardio', 'volume'],
            'conditioning': ['conditioning', 'endurance', 'cardio'],
            'boxing': ['power', 'rotation', 'speed', 'reaction', 'conditioning'],
            'mma': ['power', 'combat', 'rotation', 'reaction'],
            'rehab': ['stability', 'anti_extension', 'coordination'],
            'stability': ['stability', 'anti_extension', 'coordination']
        };
        
        // Mapping per fase periodizzazione
        const phaseFocusMap = {
            'accumulation': ['endurance', 'volume', 'technique', 'stability'],
            'intensification': ['strength', 'power', 'chest', 'lats'],
            'realization': ['power', 'speed', 'reactive', 'sport'],
            'deload': ['technique', 'stability', 'coordination', 'warmup']
        };
        
        // PRIORITÀ INTELLIGENTE: parametri esercizio > sessionType > phase > goal
        let priorityList = [];
        
        // 1. PRIMA i parametri dell'esercizio (più importante!)
        if (exerciseAnalysis.type !== 'general' && paramBasedFocusMap[exerciseAnalysis.type]) {
            priorityList = [...priorityList, ...paramBasedFocusMap[exerciseAnalysis.type]];
        }
        
        // 2. Poi il tipo di sessione
        const sessionFocusMap = {
            'strength': ['strength', 'power', 'chest', 'lats', 'quadriceps'],
            'technical': ['technique', 'accuracy', 'coordination', 'rhythm'],
            'conditioning': ['conditioning', 'endurance', 'cardio', 'volume'],
            'power': ['power', 'reactive', 'speed', 'height'],
            'warmup': ['warmup', 'technique', 'standard']
        };
        if (sessionType && sessionFocusMap[sessionType]) {
            priorityList = [...priorityList, ...sessionFocusMap[sessionType]];
        }
        
        // 3. Fase periodizzazione
        if (phase && phaseFocusMap[phase]) {
            priorityList = [...priorityList, ...phaseFocusMap[phase]];
        }
        
        // 4. Goal dell'atleta
        if (goal && goalFocusMap[goal]) {
            priorityList = [...priorityList, ...goalFocusMap[goal]];
        }
        if (sport && goalFocusMap[sport]) {
            priorityList = [...priorityList, ...goalFocusMap[sport]];
        }
        
        // Trova il primo focus disponibile nella lista priorità
        for (const focusKey of priorityList) {
            if (availableFocuses.includes(focusKey)) {
                return {
                    key: focusKey,
                    variant: guide.focusVariants[focusKey],
                    reason: this.getFocusReason(focusKey, context, exerciseAnalysis)
                };
            }
        }
        
        // Fallback intelligente: scegli focus più appropriato per il tipo di esercizio
        // Non usare sempre il primo, ma cerca un match semantico
        const categoryFocusMap = {
            'lower_body': ['quadriceps', 'glutes', 'hamstrings', 'strength', 'power'],
            'upper_body_push': ['chest', 'anterior', 'strength', 'power'],
            'upper_body_pull': ['lats', 'mid_back', 'back', 'strength'],
            'core': ['anti_extension', 'stability', 'rotation'],
            'boxing_technique': ['power', 'technique', 'speed', 'conditioning'],
            'conditioning': ['conditioning', 'endurance', 'intervals']
        };
        
        if (guide.category && categoryFocusMap[guide.category]) {
            for (const focusKey of categoryFocusMap[guide.category]) {
                if (availableFocuses.includes(focusKey)) {
                    return {
                        key: focusKey,
                        variant: guide.focusVariants[focusKey],
                        reason: `Focus ottimale per ${guide.category.replace('_', ' ')}`
                    };
                }
            }
        }
        
        // Ultimo fallback: primo disponibile
        const firstKey = availableFocuses[0];
        return {
            key: firstKey,
            variant: guide.focusVariants[firstKey],
            reason: 'Focus consigliato per questo esercizio'
        };
    },
    
    /**
     * Genera spiegazione del perché è stato scelto quel focus
     */
    getFocusReason(focusKey, context, exerciseAnalysis = null) {
        const { goal, phase, sport, sessionType, sets, reps, duration } = context;
        
        // Se abbiamo un'analisi dell'esercizio, usa quella per una spiegazione più accurata
        if (exerciseAnalysis && exerciseAnalysis.reason) {
            const analysisReasons = {
                'warmup': `Riscaldamento: ${exerciseAnalysis.reason}`,
                'technique': `Focus tecnico: ${exerciseAnalysis.reason}`,
                'endurance': `Resistenza: ${exerciseAnalysis.reason}`,
                'conditioning': `Conditioning: ${exerciseAnalysis.reason}`,
                'intervals': `HIIT: intervalli ad alta intensità`
            };
            if (analysisReasons[focusKey]) {
                return analysisReasons[focusKey];
            }
        }
        
        // Reasons basate sui parametri specifici
        if (reps || duration) {
            const paramReasons = {
                'warmup': `Attivazione: preparazione per il lavoro principale`,
                'strength': `${reps ? reps + ' reps' : ''}: range ottimale per forza`,
                'power': `Basse reps: massima esplosività`,
                'hypertrophy': `${reps ? reps + ' reps' : ''}: range ipertrofico`,
                'endurance': `${duration || 'Alta rep'}: resistenza muscolare`,
                'conditioning': `${duration || 'Volume'}: condizionamento metabolico`
            };
            if (paramReasons[focusKey]) {
                return paramReasons[focusKey];
            }
        }
        
        const reasons = {
            // Power/Strength
            'power': `Obiettivo ${goal || 'performance'}: priorità allo sviluppo della potenza esplosiva`,
            'strength': `Fase di lavoro sulla forza massimale per costruire base solida`,
            'reactive': `Focus sulla componente reattiva per transfer atletico`,
            
            // Hypertrophy targets
            'chest': `Target ipertrofia: enfasi sul pettorale per massimo stimolo meccanico`,
            'lats': `Target ipertrofia: dorsali come priorità per sviluppo schiena`,
            'quadriceps': `Obiettivo gambe: focus quadricipiti per sviluppo anteriore`,
            'glutes': `Catena posteriore: glutei come motore principale del movimento`,
            'hamstrings': `Sviluppo femorali per equilibrio muscolare e prevenzione`,
            
            // Sport specific
            'speed': `Sport-specific: velocità di esecuzione per transfer in gara`,
            'rotation': `Sport di combattimento: potenza rotazionale per colpi efficaci`,
            'coordination': `Fase tecnica: miglioramento pattern motori`,
            
            // Conditioning
            'endurance': `Fase di accumulo: costruzione capacità di lavoro`,
            'conditioning': `Sessione metabolica: condizionamento specifico`,
            
            // Technique/Stability
            'technique': `Focus tecnico: perfezionamento della meccanica`,
            'stability': `Lavoro di stabilità per fondamenta solide`,
            'warmup': `Riscaldamento: attivazione e preparazione`,
            'rhythm': `Ritmo base: costruzione coordinazione`,
            'standard': `Esecuzione standard: focus sulla qualità`
        };
        
        return reasons[focusKey] || `Focus selezionato per il tuo obiettivo di ${goal || 'allenamento'}`;
    },
    
    /**
     * Ottiene la guida per un esercizio
     */
    getGuide(exerciseName) {
        const key = this.normalizeExerciseName(exerciseName);
        return this.guides[key] || null;
    },
    
    /**
     * Normalizza il nome esercizio per lookup
     */
    normalizeExerciseName(name) {
        if (!name) return '';
        return name.toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
    },
    
    /**
     * Genera spiegazione contestuale completa
     */
    getContextualExplanation(exerciseName, context = {}) {
        const guide = this.getGuide(exerciseName);
        if (!guide) {
            return this.getGenericExplanation(exerciseName);
        }
        
        const sport = context.sport || 'default';
        const goal = context.goal || 'strength';
        const focus = context.focus || null;
        
        let explanation = {
            name: guide.name,
            muscles: {
                primary: guide.primaryMuscles,
                secondary: guide.secondaryMuscles
            },
            execution: guide.execution,
            sportContext: guide.sportContext[sport] || guide.sportContext.default,
            focusTip: null
        };
        
        // Aggiungi focus specifico se richiesto
        if (focus && guide.focusVariants[focus]) {
            explanation.focusTip = guide.focusVariants[focus];
        }
        
        return explanation;
    },
    
    /**
     * Genera HTML per modale esercizio
     */
    generateExerciseModal(exerciseName, context = {}) {
        const explanation = this.getContextualExplanation(exerciseName, context);
        
        if (!explanation.execution) {
            return `<div class="exercise-guide">
                <h3>${exerciseName}</h3>
                <p>Guida dettagliata non ancora disponibile per questo esercizio.</p>
            </div>`;
        }
        
        let html = `
            <div class="exercise-guide">
                <h3>📖 ${explanation.name}</h3>
                
                <div class="guide-section">
                    <h4>🎯 Muscoli Target</h4>
                    <p><strong>Primari:</strong> ${explanation.muscles.primary.join(', ')}</p>
                    <p><strong>Secondari:</strong> ${explanation.muscles.secondary.join(', ')}</p>
                </div>
                
                <div class="guide-section">
                    <h4>📋 Esecuzione</h4>
                    <p><strong>Setup:</strong> ${explanation.execution.setup}</p>
                    <p><strong>Movimento:</strong> ${explanation.execution.movement}</p>
                    <p><strong>Respirazione:</strong> ${explanation.execution.breathing}</p>
                </div>
                
                <div class="guide-section">
                    <h4>⚠️ Errori Comuni</h4>
                    <ul>
                        ${explanation.execution.commonMistakes.map(m => `<li>${m}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="guide-section sport-context">
                    <h4>🏆 Perché Questo Esercizio?</h4>
                    <p>${explanation.sportContext}</p>
                </div>
        `;
        
        if (explanation.focusTip) {
            html += `
                <div class="guide-section focus-tip">
                    <h4>${explanation.focusTip.title}</h4>
                    <p>${explanation.focusTip.technique}</p>
                    <p><strong>Cues:</strong> ${explanation.focusTip.cues.join(' → ')}</p>
                    <p><em>${explanation.focusTip.when}</em></p>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    },
    
    /**
     * Spiegazione generica per esercizi non nel database
     */
    getGenericExplanation(exerciseName) {
        return {
            name: exerciseName,
            muscles: { primary: ['Vari'], secondary: [] },
            execution: null,
            sportContext: 'Esercizio incluso per il tuo obiettivo di allenamento.',
            focusTip: null
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // LOOKUP INTELLIGENTE
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Alias per lookup flessibile
     */
    aliases: {
        // Lunge variants
        'affondi': 'lunge',
        'affondo': 'lunge',
        'walking_lunge': 'lunge',
        'reverse_lunge': 'lunge',
        'split_squat': 'lunge',
        
        // Squat variants
        'back_squat': 'squat',
        'front_squat': 'squat',
        'goblet_squat': 'squat',
        'air_squat': 'squat',
        
        // Deadlift variants
        'stacco': 'deadlift',
        'rdl': 'deadlift',
        'romanian_deadlift': 'deadlift',
        'sumo_deadlift': 'deadlift',
        'trap_bar': 'trap_bar_deadlift',
        
        // Push-up variants
        'piegamenti': 'push_up',
        'pushup': 'push_up',
        'diamond_pushup': 'push_up',
        'clap_pushup': 'push_up',
        
        // Bench variants
        'panca': 'bench_press',
        'panca_piana': 'bench_press',
        'flat_bench': 'bench_press',
        'incline_bench': 'bench_press',
        'decline_bench': 'bench_press',
        
        // Press variants  
        'military': 'overhead_press',
        'ohp': 'overhead_press',
        'shoulder_press': 'overhead_press',
        'push_press': 'overhead_press',
        
        // Pull-up variants
        'trazioni': 'pull_up',
        'pullup': 'pull_up',
        'chin_up': 'pull_up',
        'chinup': 'pull_up',
        
        // Row variants
        'rematore': 'barbell_row',
        'bent_over_row': 'barbell_row',
        'pendlay_row': 'barbell_row',
        'dumbbell_row': 'barbell_row',
        
        // Core
        'planche': 'plank',
        'side_plank': 'plank',
        'russian': 'russian_twist',
        'deadbug': 'dead_bug',
        
        // Boxing
        'sacco': 'heavy_bag',
        'sacco_pesante': 'heavy_bag',
        'bag_work': 'heavy_bag',
        'heavy_bag_rounds': 'heavy_bag',
        'heavy_bag_power_shots': 'heavy_bag',
        'shadow': 'shadow_boxing',
        'shadowbox': 'shadow_boxing',
        'speed': 'speed_bag',
        'ropes': 'battle_ropes',
        'corde': 'battle_ropes',
        'slam': 'med_ball_slam',
        'medicine_ball': 'med_ball_slam',
        'med_ball': 'med_ball_slam',
        
        // Boxing Drills
        'ladder': 'ladder_drill',
        'speed_ladder': 'ladder_drill',
        'ali_shuffle': 'ladder_drill',
        'ladder_drill_ali_shuffle': 'ladder_drill',
        'slip': 'slip_drill',
        'slipping': 'slip_drill',
        'bob_and_weave': 'bob_weave',
        'bob_weave': 'bob_weave',
        'double_end': 'double_end_bag',
        'double_end_bag': 'double_end_bag',
        'corda': 'jump_rope',
        'salto_corda': 'jump_rope',
        'skip_rope': 'jump_rope',
        'skipping': 'jump_rope',
        'burpees': 'burpee',
        'sprawl': 'burpee',
        
        // Jumps
        'box': 'box_jump',
        'jump': 'box_jump',
        'salto': 'box_jump',
        
        // New exercises - Lower Body
        'nordic': 'nordic_curl',
        'nordic_hamstring': 'nordic_curl',
        'leg_curl_eccentric': 'nordic_curl',
        'split_squat_elevated': 'bulgarian_split_squat',
        'rear_foot_elevated_split_squat': 'bulgarian_split_squat',
        'rfess': 'bulgarian_split_squat',
        'single_leg_deadlift': 'single_leg_rdl',
        'sl_rdl': 'single_leg_rdl',
        'one_leg_rdl': 'single_leg_rdl',
        'stepup': 'step_up',
        'step_ups': 'step_up',
        'squat_jump': 'jump_squat',
        'bodyweight_squat_jump': 'jump_squat',
        'lateral_bound': 'lateral_bounds',
        'side_bounds': 'lateral_bounds',
        'calf_raises': 'calf_raise',
        'polpacci': 'calf_raise',
        
        // New exercises - Core
        'pallof': 'pallof_press',
        'anti_rotation': 'pallof_press',
        'birddog': 'bird_dog',
        'woodchops': 'woodchop',
        'cable_woodchop': 'woodchop',
        'cable_chop': 'woodchop',
        
        // New exercises - Conditioning
        'high_knee': 'high_knees',
        'ginocchia_alte': 'high_knees',
        'askip': 'a_skip',
        'a_skips': 'a_skip',
        'skip': 'a_skip',
        'kb_swing': 'kettlebell_swing',
        'swing': 'kettlebell_swing',
        'russian_swing': 'kettlebell_swing',
        
        // ═══════════════════════════════════════════════════════════════════
        // LIBRARY EXERCISES MAPPING (kebab-case from library to snake_case)
        // ═══════════════════════════════════════════════════════════════════
        
        // Lower Body - Library
        'back_squat': 'squat',
        'front_squat': 'squat',
        'goblet_squat': 'squat',
        'single_leg_squat_to_box': 'squat',
        'conventional_deadlift': 'deadlift',
        'romanian_deadlift': 'romanian_deadlift',
        'hip_thrust': 'hip_thrust',
        'leg_press': 'leg_press',
        'leg_curl': 'leg_curl',
        'leg_curl_eccentric': 'leg_curl',
        'calf_raises_eccentric': 'calf_raise',
        
        // Upper Body Pull - Library
        'lat_pulldown': 'lat_pulldown',
        'seated_row': 'barbell_row',
        'cable_row': 'barbell_row',
        'face_pull': 'face_pull',
        'band_pull_apart': 'face_pull',
        
        // Upper Body Push - Library  
        'incline_db_press': 'incline_bench_press',
        'incline_bench': 'incline_bench_press',
        'dumbbell_bench': 'bench_press',
        'cable_crossover': 'bench_press',
        'dumbbell_lateral_raise': 'overhead_press',
        'rear_delt_raise': 'face_pull',
        
        // Power - Library
        'power_clean': 'power_clean',
        'clean': 'power_clean',
        'depth_jump': 'depth_jump',
        'broad_jump': 'broad_jump',
        'vertical_jump_training': 'box_jump',
        
        // Core - Library
        'copenhagen_adductor': 'copenhagen_adductor',
        'copenhagen': 'copenhagen_adductor',
        
        // Conditioning - Library
        'assault_bike': 'battle_ropes',
        'rowing_machine': 'battle_ropes',
        'sled_push': 'kettlebell_swing',
        'sprint_intervals': 'high_knees',
        
        // Mobility/Warmup - Library
        'worlds_greatest_stretch': 'lunge',
        'cat_cow': 'dead_bug',
        'thoracic_rotation': 'dead_bug',
        'hip_circle': 'lunge',
        'scapular_pushup': 'push_up',
        
        // Accessory - Library
        'external_rotation_cable': 'face_pull',
        'cuban_rotation': 'face_pull',
        'prone_ytw': 'face_pull',
        'neck_strengthening': 'plank',
        
        // Sport Specific - Library
        'agility_cone_drills': 'ladder_drill',
        'reactive_agility': 'ladder_drill',
        'footwork_ladder': 'ladder_drill',
        'defensive_slides': 'ladder_drill',
        'boxing_circuit': 'heavy_bag',
        'heavy_bag_intervals': 'heavy_bag',
        'med_ball_rotational_throw': 'med_ball_slam',
        
        // Dumbbell variants
        'dumbbell_row': 'dumbbell_row',
        'db_row': 'dumbbell_row',
        'single_arm_row': 'dumbbell_row',
        
        // Warmup / Mobility aliases
        'glute_bridges': 'glute_bridge',
        'ponte_glutei': 'glute_bridge',
        'hip_bridge': 'glute_bridge',
        'cat_cow_stretch': 'cat_cow',
        'cat_camel': 'cat_cow',
        'gatto_mucca': 'cat_cow',
        'world_greatest_stretch': 'worlds_greatest_stretch',
        'wgs': 'worlds_greatest_stretch',
        'greatest_stretch': 'worlds_greatest_stretch',
        'band_pulls': 'band_pull_apart',
        'pull_aparts': 'band_pull_apart',
        'band_face_pull': 'face_pull',
        'leg_swing': 'leg_swings',
        'oscillazioni_gamba': 'leg_swings',
        'arm_circle': 'arm_circles',
        'cerchi_braccia': 'arm_circles',
        'shoulder_circles': 'arm_circles',
        'locomotion': 'dynamic_locomotion',
        'dynamic_warmup': 'dynamic_locomotion',
        'warmup_locomotion': 'dynamic_locomotion',
        'corsa_leggera': 'dynamic_locomotion',
        'light_jog': 'dynamic_locomotion'
    },
    
    /**
     * Cerca esercizio con fuzzy matching
     */
    findExercise(searchName) {
        if (!searchName) return null;
        
        const normalized = this.normalizeExerciseName(searchName);
        
        // 1. Match esatto
        if (this.guides[normalized]) {
            return this.guides[normalized];
        }
        
        // 2. Check alias
        if (this.aliases[normalized]) {
            return this.guides[this.aliases[normalized]];
        }
        
        // 3. Partial match in keys
        for (const key of Object.keys(this.guides)) {
            if (key.includes(normalized) || normalized.includes(key)) {
                return this.guides[key];
            }
        }
        
        // 4. Partial match in aliases
        for (const [alias, target] of Object.entries(this.aliases)) {
            if (alias.includes(normalized) || normalized.includes(alias)) {
                return this.guides[target];
            }
        }
        
        // 5. Match nel nome display
        for (const [key, guide] of Object.entries(this.guides)) {
            const guideName = this.normalizeExerciseName(guide.name);
            if (guideName.includes(normalized) || normalized.includes(guideName)) {
                return guide;
            }
        }
        
        return null;
    },
    
    /**
     * Verifica se esiste guida per esercizio
     */
    hasGuide(exerciseName) {
        return this.findExercise(exerciseName) !== null;
    },
    
    /**
     * Ottiene lista esercizi per categoria
     */
    getByCategory(category) {
        return Object.values(this.guides).filter(g => g.category === category);
    },
    
    /**
     * Ottiene lista esercizi per muscolo
     */
    getByMuscle(muscle) {
        return Object.values(this.guides).filter(g => 
            g.primaryMuscles.includes(muscle) || g.secondaryMuscles.includes(muscle)
        );
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // INTEGRAZIONE WORKOUT
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Arricchisce esercizio con guida contestuale
     */
    enrichExercise(exercise, context = {}) {
        const guide = this.findExercise(exercise.name);
        
        if (!guide) {
            return {
                ...exercise,
                hasGuide: false,
                quickTip: null
            };
        }
        
        // Seleziona focus in base al contesto
        let recommendedFocus = null;
        const goal = context.goal || 'general';
        
        if (goal === 'power' && guide.focusVariants.power) {
            recommendedFocus = guide.focusVariants.power;
        } else if (goal === 'hypertrophy' && (guide.focusVariants.chest || guide.focusVariants.lats)) {
            recommendedFocus = guide.focusVariants.chest || guide.focusVariants.lats;
        } else if (goal === 'endurance' && guide.focusVariants.endurance) {
            recommendedFocus = guide.focusVariants.endurance;
        }
        
        return {
            ...exercise,
            hasGuide: true,
            guide: guide,
            sportContext: guide.sportContext[context.sport] || guide.sportContext.default,
            recommendedFocus: recommendedFocus,
            quickTip: this.getQuickTip(guide, context)
        };
    },
    
    /**
     * Genera tip rapido per esercizio
     */
    getQuickTip(guide, context = {}) {
        const sport = context.sport || 'default';
        
        // Priorità: sport context > primo focus variant > execution tip
        if (guide.sportContext[sport] && sport !== 'default') {
            return `🏆 ${guide.sportContext[sport]}`;
        }
        
        const firstFocus = Object.values(guide.focusVariants)[0];
        if (firstFocus) {
            return `💡 ${firstFocus.cues[0]}`;
        }
        
        return `📋 ${guide.execution.movement.substring(0, 60)}...`;
    },
    
    /**
     * Arricchisce intero workout con guide
     */
    enrichWorkout(workout, context = {}) {
        if (!workout || !workout.exercises) return workout;
        
        return {
            ...workout,
            exercises: workout.exercises.map(ex => this.enrichExercise(ex, context))
        };
    },
    
    /**
     * Statistiche copertura guide
     */
    getCoverage(exerciseNames) {
        let covered = 0;
        let total = exerciseNames.length;
        
        for (const name of exerciseNames) {
            if (this.hasGuide(name)) covered++;
        }
        
        return {
            covered,
            total,
            percentage: Math.round((covered / total) * 100),
            missing: exerciseNames.filter(n => !this.hasGuide(n))
        };
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // UI INTEGRATION
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Mostra modale con guida esercizio
     */
    showExerciseModal(exerciseName, context = {}) {
        const guide = this.findExercise(exerciseName);
        
        // Rimuovi modale esistente
        const existing = document.getElementById('exercise-guide-modal');
        if (existing) existing.remove();
        
        // Crea modale
        const modal = document.createElement('div');
        modal.id = 'exercise-guide-modal';
        modal.className = 'exercise-modal-overlay';
        modal.innerHTML = this.generateModalHTML(guide, exerciseName, context);
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
        
        // Focus tabs se presenti
        const tabs = modal.querySelectorAll('.focus-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.showFocusVariant(modal, tab.dataset.focus, guide);
            });
        });
        
        // Animazione entrata
        requestAnimationFrame(() => modal.classList.add('visible'));
    },
    
    /**
     * Chiude modale
     */
    closeModal() {
        const modal = document.getElementById('exercise-guide-modal');
        if (modal) {
            modal.classList.remove('visible');
            setTimeout(() => modal.remove(), 300);
        }
    },
    
    /**
     * Genera HTML completo modale
     */
    generateModalHTML(guide, exerciseName, context) {
        // Get video from ATLASVideos
        const video = typeof ATLASVideos !== 'undefined' ? ATLASVideos.findVideo(exerciseName) : null;
        
        if (!guide) {
            return `
                <div class="exercise-modal">
                    <button class="modal-close">✕</button>
                    ${this.generateVideoHero(video, exerciseName)}
                    <div class="no-guide-container">
                        <h2>${exerciseName}</h2>
                        <p>Guida dettagliata in arrivo. Esegui con forma controllata.</p>
                    </div>
                </div>
            `;
        }
        
        const sport = context.sport || 'default';
        const sportContext = guide.sportContext[sport] || guide.sportContext.default;
        
        // Sistema sceglie automaticamente il focus ottimale
        const optimalFocus = this.determineOptimalFocus(guide, context);
        
        return `
            <div class="exercise-modal">
                <button class="modal-close">✕</button>
                
                ${this.generateVideoHero(video, exerciseName)}
                
                <div class="modal-content">
                    <h1 class="exercise-title-main">${guide.name}</h1>
                    
                    <div class="muscle-tags">
                        ${guide.primaryMuscles.map(m => `<span class="tag primary">${m}</span>`).join('')}
                        ${guide.secondaryMuscles.map(m => `<span class="tag secondary">${m}</span>`).join('')}
                    </div>
                    
                    <div class="guide-section">
                        <h3 class="section-header">Esecuzione</h3>
                        <div class="execution-steps">
                            <div class="exec-step">
                                <span class="exec-label">Setup</span>
                                <span class="exec-text">${guide.execution.setup}</span>
                            </div>
                            <div class="exec-step">
                                <span class="exec-label">Movimento</span>
                                <span class="exec-text">${guide.execution.movement}</span>
                            </div>
                            <div class="exec-step">
                                <span class="exec-label">Respiro</span>
                                <span class="exec-text">${guide.execution.breathing}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="guide-section">
                        <h3 class="section-header">Attenzione a</h3>
                        <ul class="error-list">
                            ${guide.execution.commonMistakes.map(m => `<li>${m}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="guide-section">
                        <h3 class="section-header">Perché questo esercizio</h3>
                        <div class="sport-context-box">${sportContext}</div>
                    </div>
                    
                    ${optimalFocus ? this.generateFocusSection(optimalFocus) : ''}
                </div>
            </div>
        `;
    },
    
    /**
     * Genera sezione focus contestuale (scelto dal sistema)
     */
    generateFocusSection(optimalFocus) {
        const variant = optimalFocus.variant;
        // Rimuovi emoji dal titolo
        const cleanTitle = variant.title.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
        
        return `
            <div class="guide-section focus-section-auto">
                <h3 class="section-header">Il tuo focus oggi</h3>
                <div class="focus-reason">${optimalFocus.reason}</div>
                <div class="focus-content-auto">
                    <div class="focus-title-auto">${cleanTitle}</div>
                    <p class="focus-technique">${variant.technique}</p>
                    <div class="focus-cues">
                        ${variant.cues.map(c => `<span class="cue">${c}</span>`).join('<span class="cue-arrow">→</span>')}
                    </div>
                </div>
            </div>
        `;
    },
    generateVideoHero(video, exerciseName) {
        if (!video) {
            return `
                <div class="video-hero">
                    <div class="video-placeholder-hero">
                        <i class="fas fa-play-circle"></i>
                        <span>Video tutorial in arrivo</span>
                    </div>
                </div>
            `;
        }
        
        // Check if YouTube
        const youtubeMatch = video.url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
        
        if (youtubeMatch) {
            const videoId = youtubeMatch[1];
            return `
                <div class="video-hero">
                    <div class="video-container">
                        <iframe 
                            src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1" 
                            title="${video.title || exerciseName}"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="video-hero">
                <div class="video-placeholder-hero">
                    <i class="fas fa-external-link-alt"></i>
                    <a href="${video.url}" target="_blank" style="color: #fff; text-decoration: none;">
                        Guarda video tutorial
                    </a>
                </div>
            </div>
        `;
    },
    
    /**
     * Aggiorna contenuto focus variant
     */
    showFocusVariant(modal, focusKey, guide) {
        const variant = guide.focusVariants[focusKey];
        if (!variant) return;
        
        const content = modal.querySelector('#focus-content');
        content.innerHTML = `
            <p class="focus-technique">${variant.technique}</p>
            <div class="focus-cues">
                ${variant.cues.map(c => `<span class="cue">${c}</span>`).join('<span class="cue-arrow">→</span>')}
            </div>
            <p class="focus-when"><em>${variant.when}</em></p>
        `;
    },
    
    /**
     * Inietta CSS per modale
     */
    injectStyles() {
        if (document.getElementById('exercise-guide-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'exercise-guide-styles';
        style.textContent = `
            /* ═══════════════════════════════════════════════════════════════
               GR PERFORM - Exercise Guide Modal
               Nike Training Club inspired - Clean & Minimal
            ═══════════════════════════════════════════════════════════════ */
            
            .exercise-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.25s ease;
                padding: 0;
            }
            
            .exercise-modal-overlay.visible {
                opacity: 1;
            }
            
            .exercise-modal {
                background: #0D0D0F;
                width: 100%;
                height: 100%;
                max-width: 100%;
                max-height: 100%;
                overflow-y: auto;
                position: relative;
                transform: translateY(20px);
                transition: transform 0.3s ease;
            }
            
            @media (min-width: 768px) {
                .exercise-modal {
                    max-width: 720px;
                    max-height: 92vh;
                    height: auto;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.08);
                }
                
                .exercise-modal-overlay {
                    padding: 20px;
                }
            }
            
            .exercise-modal-overlay.visible .exercise-modal {
                transform: translateY(0);
            }
            
            .modal-close {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255,255,255,0.1);
                border: none;
                color: #fff;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
            }
            
            @media (min-width: 768px) {
                .modal-close {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                }
            }
            
            .modal-close:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.05);
            }
            
            /* Video Section - Hero */
            .video-hero {
                position: relative;
                background: #000;
                aspect-ratio: 16/9;
                max-height: 45vh;
            }
            
            .video-hero .video-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            .video-hero .video-container iframe {
                width: 100%;
                height: 100%;
                border: none;
            }
            
            .video-placeholder-hero {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                background: linear-gradient(180deg, #1a1a1a 0%, #0D0D0F 100%);
                color: #666;
            }
            
            .video-placeholder-hero i {
                font-size: 48px;
                margin-bottom: 16px;
                opacity: 0.5;
            }
            
            .video-placeholder-hero span {
                font-size: 14px;
                opacity: 0.7;
            }
            
            /* Content */
            .modal-content {
                padding: 28px 24px 40px;
                color: #fff;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            
            @media (min-width: 768px) {
                .modal-content {
                    padding: 32px 40px 48px;
                }
            }
            
            .exercise-title-main {
                font-size: 28px;
                font-weight: 800;
                letter-spacing: -0.5px;
                margin: 0 0 8px 0;
                line-height: 1.2;
            }
            
            @media (min-width: 768px) {
                .exercise-title-main {
                    font-size: 34px;
                }
            }
            
            /* Muscle Tags */
            .muscle-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 32px;
            }
            
            .muscle-tags .tag {
                padding: 6px 14px;
                border-radius: 100px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .tag.primary {
                background: #D71921;
                color: #fff;
            }
            
            .tag.secondary {
                background: rgba(255,255,255,0.08);
                color: #888;
            }
            
            /* Section Headers */
            .guide-section {
                margin-bottom: 32px;
            }
            
            .section-header {
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #666;
                margin: 0 0 16px 0;
                padding-bottom: 12px;
                border-bottom: 1px solid rgba(255,255,255,0.08);
            }
            
            /* Execution Steps */
            .execution-steps {
                display: flex;
                flex-direction: column;
                gap: 0;
            }
            
            .exec-step {
                display: grid;
                grid-template-columns: 80px 1fr;
                gap: 16px;
                padding: 20px 0;
                border-bottom: 1px solid rgba(255,255,255,0.06);
            }
            
            .exec-step:last-child {
                border-bottom: none;
            }
            
            .exec-label {
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #D71921;
            }
            
            .exec-text {
                font-size: 15px;
                line-height: 1.6;
                color: #ccc;
            }
            
            /* Error List */
            .error-list {
                margin: 0;
                padding: 0;
                list-style: none;
            }
            
            .error-list li {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 12px 0;
                font-size: 14px;
                color: #999;
                border-bottom: 1px solid rgba(255,255,255,0.04);
            }
            
            .error-list li:last-child {
                border-bottom: none;
            }
            
            .error-list li::before {
                content: '';
                width: 6px;
                height: 6px;
                background: #D71921;
                border-radius: 50%;
                margin-top: 7px;
                flex-shrink: 0;
            }
            
            /* Sport Context */
            .sport-context-box {
                background: rgba(215,25,33,0.08);
                border-left: 3px solid #D71921;
                padding: 20px 24px;
                font-size: 15px;
                line-height: 1.7;
                color: #ddd;
            }
            
            /* Focus Variants */
            .focus-tabs {
                display: flex;
                gap: 8px;
                margin-bottom: 20px;
                overflow-x: auto;
                padding-bottom: 4px;
            }
            
            .focus-tab {
                background: transparent;
                border: 1px solid rgba(255,255,255,0.15);
                color: #888;
                padding: 10px 20px;
                border-radius: 100px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                transition: all 0.2s ease;
                white-space: nowrap;
            }
            
            .focus-tab:hover {
                border-color: rgba(255,255,255,0.3);
                color: #fff;
            }
            
            .focus-tab.active {
                background: #fff;
                border-color: #fff;
                color: #000;
            }
            
            .focus-content {
                background: rgba(255,255,255,0.03);
                border-radius: 12px;
                padding: 24px;
            }
            
            .focus-technique {
                margin: 0 0 20px 0;
                font-size: 15px;
                line-height: 1.6;
                color: #ddd;
            }
            
            .focus-cues {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 16px;
            }
            
            .cue {
                background: rgba(255,255,255,0.08);
                color: #fff;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
            }
            
            .cue-arrow {
                color: #444;
                display: flex;
                align-items: center;
            }
            
            .focus-when {
                margin: 0;
                color: #666;
                font-size: 13px;
                font-style: italic;
            }
            
            /* Focus Auto Section (system-selected) */
            .focus-section-auto {
                background: linear-gradient(135deg, rgba(215,25,33,0.06) 0%, transparent 100%);
                border-radius: 12px;
                padding: 24px;
                border: 1px solid rgba(215,25,33,0.15);
            }
            
            .focus-section-auto .section-header {
                border-bottom: none;
                padding-bottom: 0;
                margin-bottom: 8px;
                color: #D71921;
            }
            
            .focus-reason {
                font-size: 13px;
                color: #888;
                margin-bottom: 20px;
                font-style: italic;
            }
            
            .focus-content-auto {
                background: rgba(0,0,0,0.2);
                border-radius: 10px;
                padding: 20px;
            }
            
            .focus-title-auto {
                font-size: 16px;
                font-weight: 700;
                color: #fff;
                margin-bottom: 12px;
            }
            
            /* No Guide State */
            .no-guide-container {
                text-align: center;
                padding: 80px 40px;
            }
            
            .no-guide-container h2 {
                font-size: 24px;
                font-weight: 700;
                margin: 0 0 12px 0;
            }
            
            .no-guide-container p {
                color: #666;
                font-size: 15px;
                margin: 0;
            }
            
            /* Exercise Card Arrow */
            .exercise-arrow {
                color: #666;
                font-size: 14px;
                transition: transform 0.2s ease, color 0.2s ease;
            }
            
            .exercise-card:hover .exercise-arrow {
                color: #D71921;
                transform: translateX(3px);
            }
            
            /* Exercise Card Hover */
            .exercise-card {
                transition: background 0.2s ease;
            }
            
            .exercise-card:hover {
                background: rgba(255,255,255,0.04);
            }
            
            /* Scrollbar */
            .exercise-modal::-webkit-scrollbar {
                width: 6px;
            }
            
            .exercise-modal::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .exercise-modal::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.1);
                border-radius: 3px;
            }
            
            .exercise-modal::-webkit-scrollbar-thumb:hover {
                background: rgba(255,255,255,0.2);
            }
        `;
        document.head.appendChild(style);
    },
    
    /**
     * Inizializza sistema guide
     */
    init() {
        this.injectStyles();
        console.log('📖 ATLAS Exercise Guides initialized');
        console.log(`   → ${Object.keys(this.guides).length} exercise guides loaded`);
    }
};

// Export
if (typeof window !== 'undefined') {
    window.ATLASExerciseGuides = ATLASExerciseGuides;
}

console.log('📖 ATLAS Exercise Guides v1.0 loaded!');
console.log('   → ATLASExerciseGuides.getGuide(name) - Get exercise guide');
console.log('   → ATLASExerciseGuides.getContextualExplanation(name, context) - Full explanation');
