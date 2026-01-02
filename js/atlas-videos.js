/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🎬 ATLAS VIDEO LIBRARY v1.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Database video tutorial per ogni esercizio.
 * I video sono selezionati da canali affidabili (YouTube) o possono essere
 * sostituiti con video proprietari GR Perform.
 * 
 * OBIETTIVO: +1% qualità sistema (visual learning)
 */

window.ATLASVideos = {
    
    version: '1.0.0',
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 📚 DATABASE VIDEO ESERCIZI
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Libreria video organizzata per esercizio
     * Formato: 'exercise_key': { url, source, duration, language }
     * 
     * NOTE: Questi sono placeholder - sostituire con video GR Perform o YouTube verificati
     */
    library: {
        
        // ════════════════════════════════════════════════════════════════════════
        // 💪 COMPOUND MOVEMENTS - Lower Body
        // ════════════════════════════════════════════════════════════════════════
        
        'squat': {
            url: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
            title: 'Squat - Tecnica Corretta',
            source: 'YouTube',
            duration: '5:30',
            language: 'it',
            cues: ['Petto alto', 'Ginocchia in linea con piedi', 'Profondità parallelo']
        },
        'back_squat': {
            url: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
            title: 'Back Squat - Tecnica Corretta',
            source: 'YouTube',
            duration: '5:30',
            language: 'it',
            cues: ['Petto alto', 'Ginocchia in linea con piedi', 'Profondità parallelo']
        },
        'front_squat': {
            url: 'https://www.youtube.com/watch?v=m4ytaCJZpl0',
            title: 'Front Squat - Tutorial',
            source: 'YouTube',
            duration: '6:15',
            language: 'it',
            cues: ['Gomiti alti', 'Core attivo', 'Posizione rack']
        },
        'goblet_squat': {
            url: 'https://www.youtube.com/watch?v=MeIiIdhvXT4',
            title: 'Goblet Squat - Per Principianti',
            source: 'YouTube',
            duration: '3:45',
            language: 'it',
            cues: ['Kettlebell al petto', 'Gomiti tra ginocchia', 'Schiena dritta']
        },
        'bulgarian_split_squat': {
            url: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
            title: 'Bulgarian Split Squat',
            source: 'YouTube',
            duration: '4:20',
            language: 'it',
            cues: ['Piede posteriore elevato', 'Ginocchio non oltre punta', 'Busto verticale']
        },
        'lunge': {
            url: 'https://www.youtube.com/watch?v=L8fvypPrzzs',
            title: 'Lunge / Affondi - Tecnica Corretta',
            source: 'YouTube',
            duration: '3:30',
            language: 'it',
            cues: ['Passo lungo', 'Ginocchio a 90°', 'Core stabile']
        },
        'walking_lunges': {
            url: 'https://www.youtube.com/watch?v=L8fvypPrzzs',
            title: 'Walking Lunges - Affondi Camminati',
            source: 'YouTube',
            duration: '3:30',
            language: 'it',
            cues: ['Passo lungo', 'Ginocchio a 90°', 'Core stabile']
        },
        'reverse_lunges': {
            url: 'https://www.youtube.com/watch?v=xrPteyQLGAo',
            title: 'Reverse Lunges - Affondi Indietro',
            source: 'YouTube',
            duration: '3:15',
            language: 'it',
            cues: ['Passo indietro controllato', 'Busto eretto', 'Spinta dal tallone']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // 💪 COMPOUND MOVEMENTS - Deadlifts
        // ════════════════════════════════════════════════════════════════════════
        
        'deadlift': {
            url: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
            title: 'Deadlift Convenzionale - Guida Completa',
            source: 'YouTube',
            duration: '8:00',
            language: 'it',
            cues: ['Barra vicino tibie', 'Schiena neutra', 'Spinta gambe + estensione anca']
        },
        'romanian_deadlift': {
            url: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
            title: 'Romanian Deadlift (RDL)',
            source: 'YouTube',
            duration: '5:45',
            language: 'it',
            cues: ['Ginocchia leggermente flesse', 'Anca indietro', 'Stretch hamstring']
        },
        'rdl': {
            url: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
            title: 'Romanian Deadlift (RDL)',
            source: 'YouTube',
            duration: '5:45',
            language: 'it',
            cues: ['Ginocchia leggermente flesse', 'Anca indietro', 'Stretch hamstring']
        },
        'trap_bar_deadlift': {
            url: 'https://www.youtube.com/watch?v=GmRSV_n2E_M',
            title: 'Trap Bar Deadlift',
            source: 'YouTube',
            duration: '4:30',
            language: 'it',
            cues: ['Posizione centrale', 'Spinta verticale', 'Grip neutro']
        },
        'sumo_deadlift': {
            url: 'https://www.youtube.com/watch?v=3vMOfgu2hxk',
            title: 'Sumo Deadlift',
            source: 'YouTube',
            duration: '6:00',
            language: 'it',
            cues: ['Stance largo', 'Punte fuori', 'Petto alto']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // 💪 COMPOUND MOVEMENTS - Upper Push
        // ════════════════════════════════════════════════════════════════════════
        
        'bench_press': {
            url: 'https://www.youtube.com/watch?v=gRVjAtPip0Y',
            title: 'Bench Press - Panca Piana',
            source: 'YouTube',
            duration: '7:00',
            language: 'it',
            cues: ['Arco toracico', 'Scapole retratte', 'Barra al petto']
        },
        'incline_bench_press': {
            url: 'https://www.youtube.com/watch?v=SrqOu55lrYU',
            title: 'Incline Bench Press - Panca Inclinata',
            source: 'YouTube',
            duration: '5:30',
            language: 'it',
            cues: ['Inclinazione 30-45°', 'Scapole stabili', 'Gomiti 45°']
        },
        'overhead_press': {
            url: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
            title: 'Overhead Press - Military Press',
            source: 'YouTube',
            duration: '6:30',
            language: 'it',
            cues: ['Core stretto', 'Barra davanti al viso', 'Lockout completo']
        },
        'dumbbell_shoulder_press': {
            url: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
            title: 'Dumbbell Shoulder Press',
            source: 'YouTube',
            duration: '4:00',
            language: 'it',
            cues: ['Gomiti sotto polsi', 'Movimento controllato', 'Full ROM']
        },
        'push_up': {
            url: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
            title: 'Push Up - Piegamenti Corretti',
            source: 'YouTube',
            duration: '4:30',
            language: 'it',
            cues: ['Corpo in linea', 'Gomiti 45°', 'Petto a terra']
        },
        'dips': {
            url: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
            title: 'Dips alle Parallele',
            source: 'YouTube',
            duration: '5:00',
            language: 'it',
            cues: ['Inclinazione per petto/tricipiti', 'Profondità controllata', 'Spalle basse']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // 💪 COMPOUND MOVEMENTS - Upper Pull
        // ════════════════════════════════════════════════════════════════════════
        
        'pull_up': {
            url: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
            title: 'Pull Up - Trazioni Presa Prona',
            source: 'YouTube',
            duration: '5:00',
            language: 'it',
            cues: ['Scapole depresse', 'Petto alla sbarra', 'Controllo negativa']
        },
        'chin_up': {
            url: 'https://www.youtube.com/watch?v=brhRXlOhsAM',
            title: 'Chin Up - Trazioni Presa Supina',
            source: 'YouTube',
            duration: '4:30',
            language: 'it',
            cues: ['Presa supina', 'Bicipiti attivi', 'Mento sopra sbarra']
        },
        'barbell_row': {
            url: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ',
            title: 'Barbell Row - Rematore Bilanciere',
            source: 'YouTube',
            duration: '6:00',
            language: 'it',
            cues: ['Schiena parallela', 'Tirare al ombelico', 'Squeeze scapole']
        },
        'pendlay_row': {
            url: 'https://www.youtube.com/watch?v=ZlRrIsoDpKg',
            title: 'Pendlay Row',
            source: 'YouTube',
            duration: '4:45',
            language: 'it',
            cues: ['Barra da terra ogni rep', 'Esplosivo concentrico', 'Schiena orizzontale']
        },
        'dumbbell_row': {
            url: 'https://www.youtube.com/watch?v=roCP6wCXPqo',
            title: 'Dumbbell Row - Rematore Manubrio',
            source: 'YouTube',
            duration: '4:30',
            language: 'it',
            cues: ['Braccio lungo', 'Tirare al fianco', 'No rotazione busto']
        },
        'cable_row': {
            url: 'https://www.youtube.com/watch?v=GZbfZ033f74',
            title: 'Cable Row - Pulley Basso',
            source: 'YouTube',
            duration: '4:00',
            language: 'it',
            cues: ['Petto fuori', 'Gomiti indietro', 'Stretch controllato']
        },
        'lat_pulldown': {
            url: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
            title: 'Lat Pulldown',
            source: 'YouTube',
            duration: '5:00',
            language: 'it',
            cues: ['Presa larga', 'Tirare al petto', 'Scapole depresse']
        },
        'face_pull': {
            url: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
            title: 'Face Pull - Per Spalle Sane',
            source: 'YouTube',
            duration: '4:00',
            language: 'it',
            cues: ['Corda alta', 'Tirare al viso', 'Extrarotazione finale']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // 🎯 ISOLATION - Arms
        // ════════════════════════════════════════════════════════════════════════
        
        'bicep_curl': {
            url: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
            title: 'Bicep Curl - Curl Bicipiti',
            source: 'YouTube',
            duration: '3:30',
            language: 'it',
            cues: ['Gomiti fissi', 'Supinazione completa', 'Controllo negativa']
        },
        'hammer_curl': {
            url: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
            title: 'Hammer Curl',
            source: 'YouTube',
            duration: '3:00',
            language: 'it',
            cues: ['Presa neutra', 'Brachiale focus', 'No swing']
        },
        'tricep_pushdown': {
            url: 'https://www.youtube.com/watch?v=2-LAMcpzODU',
            title: 'Tricep Pushdown',
            source: 'YouTube',
            duration: '3:30',
            language: 'it',
            cues: ['Gomiti al corpo', 'Estensione completa', 'Squeeze finale']
        },
        'skull_crusher': {
            url: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
            title: 'Skull Crusher - French Press',
            source: 'YouTube',
            duration: '4:00',
            language: 'it',
            cues: ['Gomiti fissi', 'Barra alla fronte', 'Tricipiti stretch']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // 🎯 ISOLATION - Legs
        // ════════════════════════════════════════════════════════════════════════
        
        'leg_curl': {
            url: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
            title: 'Leg Curl - Hamstring',
            source: 'YouTube',
            duration: '3:30',
            language: 'it',
            cues: ['Anca premuta', 'Contrazione completa', 'Negativa lenta']
        },
        'leg_extension': {
            url: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
            title: 'Leg Extension - Quadricipiti',
            source: 'YouTube',
            duration: '3:30',
            language: 'it',
            cues: ['Schiena appoggiata', 'Estensione completa', 'Controllo']
        },
        'leg_press': {
            url: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
            title: 'Leg Press',
            source: 'YouTube',
            duration: '5:00',
            language: 'it',
            cues: ['Schiena bassa aderente', 'Ginocchia non lockout', 'Piedi vari per focus']
        },
        'hip_thrust': {
            url: 'https://www.youtube.com/watch?v=SEdqd1n0cvg',
            title: 'Hip Thrust - Glutei',
            source: 'YouTube',
            duration: '5:30',
            language: 'it',
            cues: ['Scapole su panca', 'Mento al petto', 'Squeeze glutei in alto']
        },
        'calf_raise': {
            url: 'https://www.youtube.com/watch?v=gwLzBJYoWlI',
            title: 'Calf Raise - Polpacci',
            source: 'YouTube',
            duration: '3:00',
            language: 'it',
            cues: ['Full stretch in basso', 'Pausa in alto', 'Controllo discesa']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // 🧠 CORE
        // ════════════════════════════════════════════════════════════════════════
        
        'plank': {
            url: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
            title: 'Plank - Tecnica Corretta',
            source: 'YouTube',
            duration: '4:00',
            language: 'it',
            cues: ['Corpo in linea', 'Core attivo', 'No cedimento lombare']
        },
        'dead_bug': {
            url: 'https://www.youtube.com/watch?v=I5xbsA71v1A',
            title: 'Dead Bug - Core Anti-Extension',
            source: 'YouTube',
            duration: '4:00',
            language: 'it',
            cues: ['Lombare premuta', 'Movimento opposto', 'Respiro controllato']
        },
        'pallof_press': {
            url: 'https://www.youtube.com/watch?v=AH_QZLm_0-s',
            title: 'Pallof Press - Anti-Rotazione',
            source: 'YouTube',
            duration: '3:30',
            language: 'it',
            cues: ['Resistere rotazione', 'Core stretto', 'Braccia tese']
        },
        'bird_dog': {
            url: 'https://www.youtube.com/watch?v=wiFNA3sqjCA',
            title: 'Bird Dog - Stabilità Core',
            source: 'YouTube',
            duration: '3:00',
            language: 'it',
            cues: ['Schiena neutra', 'Estensione opposta', 'No rotazione bacino']
        },
        'russian_twist': {
            url: 'https://www.youtube.com/watch?v=wkD8rjkodUI',
            title: 'Russian Twist',
            source: 'YouTube',
            duration: '3:00',
            language: 'it',
            cues: ['Busto inclinato', 'Rotazione controllata', 'Piedi a terra o sollevati']
        },
        'hanging_leg_raise': {
            url: 'https://www.youtube.com/watch?v=Pr1ieGZ5atk',
            title: 'Hanging Leg Raise',
            source: 'YouTube',
            duration: '4:00',
            language: 'it',
            cues: ['No swing', 'Bacino in retroversione', 'Controllo discesa']
        },
        'ab_wheel': {
            url: 'https://www.youtube.com/watch?v=rqiTPdK1c_I',
            title: 'Ab Wheel Rollout',
            source: 'YouTube',
            duration: '4:30',
            language: 'it',
            cues: ['Core attivato prima', 'No cedimento lombare', 'ROM progressivo']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // ⚡ POWER / EXPLOSIVE
        // ════════════════════════════════════════════════════════════════════════
        
        'box_jump': {
            url: 'https://www.youtube.com/watch?v=52r_Ul5k03g',
            title: 'Box Jump - Salto su Box',
            source: 'YouTube',
            duration: '4:30',
            language: 'it',
            cues: ['Caricamento rapido', 'Braccia coordinata', 'Atterraggio morbido']
        },
        'power_clean': {
            url: 'https://www.youtube.com/watch?v=GVt5pO7WZOE',
            title: 'Power Clean',
            source: 'YouTube',
            duration: '8:00',
            language: 'it',
            cues: ['Prima tirata lenta', 'Esplosione anca', 'Catch in rack position']
        },
        'hang_clean': {
            url: 'https://www.youtube.com/watch?v=exMKbQ8i3Aw',
            title: 'Hang Clean',
            source: 'YouTube',
            duration: '6:00',
            language: 'it',
            cues: ['Start da ginocchio', 'Triple extension', 'Gomiti veloci']
        },
        'med_ball_slam': {
            url: 'https://www.youtube.com/watch?v=hTX5kBfxlnk',
            title: 'Medicine Ball Slam',
            source: 'YouTube',
            duration: '3:00',
            language: 'it',
            cues: ['Overhead completo', 'Esplosione verso basso', 'Usa tutto il corpo']
        },
        'kettlebell_swing': {
            url: 'https://www.youtube.com/watch?v=YSxHifyI6s8',
            title: 'Kettlebell Swing',
            source: 'YouTube',
            duration: '5:00',
            language: 'it',
            cues: ['Hinge non squat', 'Snap anca', 'Braccia passive']
        },
        'jump_squat': {
            url: 'https://www.youtube.com/watch?v=YGGq0AE5Uyc',
            title: 'Jump Squat',
            source: 'YouTube',
            duration: '3:00',
            language: 'it',
            cues: ['Squat parziale', 'Esplosione massima', 'Atterraggio morbido']
        },
        'broad_jump': {
            url: 'https://www.youtube.com/watch?v=96zJo3nlmHI',
            title: 'Broad Jump - Salto in Lungo',
            source: 'YouTube',
            duration: '3:30',
            language: 'it',
            cues: ['Caricamento braccia', 'Angolo 45°', 'Atterraggio stabile']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // 🥊 SPORT-SPECIFIC - Boxing
        // ════════════════════════════════════════════════════════════════════════
        
        'shadow_boxing': {
            url: 'https://www.youtube.com/watch?v=Cw_EvSIHSwM',
            title: 'Shadow Boxing - Tecnica Base',
            source: 'YouTube',
            duration: '6:00',
            language: 'it',
            cues: ['Guardia alta', 'Movimento piedi', 'Combinazioni fluide']
        },
        'heavy_bag': {
            url: 'https://www.youtube.com/watch?v=rqpCT4tDOVI',
            title: 'Heavy Bag Work - Sacco Pesante',
            source: 'YouTube',
            duration: '7:00',
            language: 'it',
            cues: ['Distanza corretta', 'Rotazione anca', 'Recupero guardia']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // 🧘 MOBILITY / STRETCHING
        // ════════════════════════════════════════════════════════════════════════
        
        'hip_flexor_stretch': {
            url: 'https://www.youtube.com/watch?v=YQmpO9VT2X4',
            title: 'Hip Flexor Stretch',
            source: 'YouTube',
            duration: '4:00',
            language: 'it',
            cues: ['Ginocchio a terra', 'Gluteo contratto', 'No inarcamento lombare']
        },
        'pigeon_stretch': {
            url: 'https://www.youtube.com/watch?v=_fIjpNsSTVI',
            title: 'Pigeon Stretch - Piccione',
            source: 'YouTube',
            duration: '3:30',
            language: 'it',
            cues: ['Tibia parallela', 'Bacino quadrato', 'Respirare profondo']
        },
        'world_greatest_stretch': {
            url: 'https://www.youtube.com/watch?v=u5PDWIfNlG4',
            title: 'World Greatest Stretch',
            source: 'YouTube',
            duration: '4:00',
            language: 'it',
            cues: ['Affondo profondo', 'Rotazione torace', 'Transizioni fluide']
        },
        'foam_rolling': {
            url: 'https://www.youtube.com/watch?v=SxQrqIoXoFI',
            title: 'Foam Rolling - Automassaggio',
            source: 'YouTube',
            duration: '8:00',
            language: 'it',
            cues: ['Pressione moderata', 'Movimenti lenti', 'Focus trigger points']
        },
        'cat_cow': {
            url: 'https://www.youtube.com/watch?v=kqnua4rHVVA',
            title: 'Cat Cow - Mobilità Spinale',
            source: 'YouTube',
            duration: '3:00',
            language: 'it',
            cues: ['Segmento per segmento', 'Respiro sincronizzato', 'Movimento fluido']
        },
        'thoracic_rotation': {
            url: 'https://www.youtube.com/watch?v=7FCV9bMJNvI',
            title: 'Thoracic Rotation',
            source: 'YouTube',
            duration: '3:30',
            language: 'it',
            cues: ['Anca ferma', 'Rotazione torace', 'Sguardo segue mano']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // 🥊 BOXING SPECIFIC
        // ════════════════════════════════════════════════════════════════════════
        
        'shadow_boxing': {
            url: 'https://www.youtube.com/watch?v=Bt3jCBEP-YQ',
            title: 'Shadow Boxing - Tecnica Base',
            source: 'YouTube',
            duration: '8:00',
            language: 'en',
            cues: ['Guardia alta', 'Ruota i fianchi', 'Movimento continuo']
        },
        'heavy_bag_rounds': {
            url: 'https://www.youtube.com/watch?v=M4H-LLaF9Cc',
            title: 'Heavy Bag Workout - Rounds',
            source: 'YouTube',
            duration: '10:00',
            language: 'en',
            cues: ['Potenza dai fianchi', 'Non spingere', 'Torna in guardia']
        },
        'speed_bag': {
            url: 'https://www.youtube.com/watch?v=yc7bg-V8V3I',
            title: 'Speed Bag Tutorial',
            source: 'YouTube',
            duration: '6:30',
            language: 'en',
            cues: ['Ritmo costante', 'Polsi rilassati', 'Gomiti su']
        },
        'jump_rope': {
            url: 'https://www.youtube.com/watch?v=FJmRQ5iTXKE',
            title: 'Jump Rope per Boxe',
            source: 'YouTube',
            duration: '7:00',
            language: 'en',
            cues: ['Saltello basso', 'Polsi rilassati', 'Respira']
        },
        'slip_drill': {
            url: 'https://www.youtube.com/watch?v=qSX0PCQXiO4',
            title: 'Slip Drill - Schivata',
            source: 'YouTube',
            duration: '4:30',
            language: 'en',
            cues: ['Piega ginocchia', 'Non solo testa', 'Occhi su avversario']
        },
        'bob_weave': {
            url: 'https://www.youtube.com/watch?v=qSX0PCQXiO4',
            title: 'Bob & Weave Drill',
            source: 'YouTube',
            duration: '5:00',
            language: 'en',
            cues: ['Usa le gambe', 'Movimento a U', 'Exit con colpo']
        },
        'landmine_rotation': {
            url: 'https://www.youtube.com/watch?v=wvS0Ak0A4S4',
            title: 'Landmine Rotation - Core Power',
            source: 'YouTube',
            duration: '4:00',
            language: 'en',
            cues: ['Forza dai fianchi', 'Esplodi', 'Controlla discesa']
        },
        'medicine_ball_slam': {
            url: 'https://www.youtube.com/watch?v=B2SkEaGt0E4',
            title: 'Medicine Ball Slam',
            source: 'YouTube',
            duration: '3:00',
            language: 'en',
            cues: ['Alza sopra testa', 'Sbatti con tutto', 'Prendi subito']
        },
        'medicine_ball_rotational_throw': {
            url: 'https://www.youtube.com/watch?v=xfJtJGsPkFg',
            title: 'Rotational Med Ball Throw',
            source: 'YouTube',
            duration: '4:00',
            language: 'en',
            cues: ['Ruota tutto corpo', 'Rilascia con fianchi', 'Prendi e ripeti']
        },
        'pallof_press': {
            url: 'https://www.youtube.com/watch?v=AH_QZLm_0-s',
            title: 'Pallof Press - Anti-Rotation',
            source: 'YouTube',
            duration: '4:30',
            language: 'en',
            cues: ['Core braced', 'Non ruotare', 'Spinta lenta']
        },
        'russian_twist': {
            url: 'https://www.youtube.com/watch?v=wkD8rjkodUI',
            title: 'Russian Twist',
            source: 'YouTube',
            duration: '3:00',
            language: 'en',
            cues: ['Piedi sollevati', 'Ruota spalle', 'Controllo']
        },
        'push_press': {
            url: 'https://www.youtube.com/watch?v=iaBVSJm78ko',
            title: 'Push Press - Power',
            source: 'YouTube',
            duration: '5:00',
            language: 'en',
            cues: ['Dip con gambe', 'Drive esplosivo', 'Lockout']
        },
        'clap_push_up': {
            url: 'https://www.youtube.com/watch?v=EYwWCgM198s',
            title: 'Clap Push-up',
            source: 'YouTube',
            duration: '3:00',
            language: 'en',
            cues: ['Petto a terra', 'Esplodi', 'Mani pronte']
        },
        'battle_ropes': {
            url: 'https://www.youtube.com/watch?v=mE5FnhDXQf8',
            title: 'Battle Ropes per Boxe',
            source: 'YouTube',
            duration: '6:00',
            language: 'en',
            cues: ['Core tight', 'Dalle spalle', 'Non fermarti']
        },
        'burpee': {
            url: 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
            title: 'Burpee - Tecnica Completa',
            source: 'YouTube',
            duration: '4:00',
            language: 'en',
            cues: ['Push-up completo', 'Esplodi su', 'Salto in alto']
        },
        'burpee_jab_cross': {
            url: 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
            title: 'Burpee to Punches',
            source: 'YouTube',
            duration: '3:00',
            language: 'en',
            cues: ['Esplodi su', 'Subito in guardia', '1-2 veloce']
        },
        'double_end_bag': {
            url: 'https://www.youtube.com/watch?v=yGT3PstO9g0',
            title: 'Double End Bag - Tutorial',
            source: 'YouTube',
            duration: '6:00',
            language: 'en',
            cues: ['Timing preciso', 'Jab leggero', 'Occhi sul target']
        },
        'ladder_drill': {
            url: 'https://www.youtube.com/watch?v=at5rBS9GBuU',
            title: 'Agility Ladder Drills - Speed Ladder',
            source: 'YouTube',
            duration: '5:00',
            language: 'en',
            cues: ['Piedi veloci', 'Sugli avampiedi', 'Braccia coordinate']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // 💪 ADDITIONAL EXERCISES - Lower Body
        // ════════════════════════════════════════════════════════════════════════
        
        'nordic_curl': {
            url: 'https://www.youtube.com/watch?v=d7cS-MgXBs0',
            title: 'Nordic Curl - Prevenzione Hamstring',
            source: 'YouTube',
            duration: '4:30',
            language: 'en',
            cues: ['Corpo dritto', 'Discesa lenta', 'Controllo eccentrico']
        },
        'bulgarian_split_squat': {
            url: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
            title: 'Bulgarian Split Squat',
            source: 'YouTube',
            duration: '4:20',
            language: 'it',
            cues: ['Piede posteriore elevato', 'Busto verticale', 'Ginocchio a 90°']
        },
        'single_leg_rdl': {
            url: 'https://www.youtube.com/watch?v=_Po3o8QMGIo',
            title: 'Single Leg Romanian Deadlift',
            source: 'YouTube',
            duration: '4:00',
            language: 'en',
            cues: ['Equilibrio', 'Hip hinge', 'Schiena neutra']
        },
        'step_up': {
            url: 'https://www.youtube.com/watch?v=dQqApCGd5Ss',
            title: 'Step Up - Tecnica Corretta',
            source: 'YouTube',
            duration: '3:30',
            language: 'en',
            cues: ['No push da gamba bassa', 'Controllo', 'Core attivo']
        },
        'jump_squat': {
            url: 'https://www.youtube.com/watch?v=YGGq0AE5Uyc',
            title: 'Jump Squat',
            source: 'YouTube',
            duration: '3:00',
            language: 'it',
            cues: ['Squat parziale', 'Esplosione massima', 'Atterraggio morbido']
        },
        'lateral_bounds': {
            url: 'https://www.youtube.com/watch?v=6FwJXh-I9vY',
            title: 'Lateral Bounds - Salti Laterali',
            source: 'YouTube',
            duration: '3:00',
            language: 'en',
            cues: ['Distanza laterale', 'Stabilizza atterraggio', 'Ginocchio stabile']
        },
        'calf_raise': {
            url: 'https://www.youtube.com/watch?v=gwLzBJYoWlI',
            title: 'Calf Raise - Polpacci',
            source: 'YouTube',
            duration: '3:00',
            language: 'it',
            cues: ['Full stretch in basso', 'Pausa in alto', 'Controllo discesa']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // 🧠 ADDITIONAL EXERCISES - Core
        // ════════════════════════════════════════════════════════════════════════
        
        'pallof_press': {
            url: 'https://www.youtube.com/watch?v=AH_QZLm_0-s',
            title: 'Pallof Press - Anti-Rotazione',
            source: 'YouTube',
            duration: '4:30',
            language: 'en',
            cues: ['Core braced', 'Non ruotare', 'Spinta lenta']
        },
        'bird_dog': {
            url: 'https://www.youtube.com/watch?v=wiFNA3sqjCA',
            title: 'Bird Dog - Stabilità Core',
            source: 'YouTube',
            duration: '3:00',
            language: 'it',
            cues: ['Schiena neutra', 'Estensione opposta', 'No rotazione bacino']
        },
        'woodchop': {
            url: 'https://www.youtube.com/watch?v=pAplQXk3dkU',
            title: 'Cable Woodchop',
            source: 'YouTube',
            duration: '3:30',
            language: 'en',
            cues: ['Rotazione dai fianchi', 'Braccia guida', 'Controllo ritorno']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // 🏃 ADDITIONAL EXERCISES - Conditioning
        // ════════════════════════════════════════════════════════════════════════
        
        'high_knees': {
            url: 'https://www.youtube.com/watch?v=oDdkytliOqE',
            title: 'High Knees - Ginocchia Alte',
            source: 'YouTube',
            duration: '2:00',
            language: 'en',
            cues: ['Ginocchia alte', 'Braccia coordinate', 'Ritmo veloce']
        },
        'a_skip': {
            url: 'https://www.youtube.com/watch?v=V57hzg5Lk-U',
            title: 'A-Skip Drill',
            source: 'YouTube',
            duration: '3:00',
            language: 'en',
            cues: ['Ginocchio alto', 'Skip attivo', 'Forma perfetta']
        },
        'kettlebell_swing': {
            url: 'https://www.youtube.com/watch?v=YSxHifyI6s8',
            title: 'Kettlebell Swing',
            source: 'YouTube',
            duration: '5:00',
            language: 'it',
            cues: ['Hinge non squat', 'Snap anca', 'Braccia passive']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // 🆕 ADDITIONAL EXERCISES - Power & Sport Specific
        // ════════════════════════════════════════════════════════════════════════
        
        'depth_jump': {
            url: 'https://www.youtube.com/watch?v=k4MvjqJZZLM',
            title: 'Depth Jump - Reactive Strength',
            source: 'YouTube',
            duration: '4:00',
            language: 'en',
            cues: ['Cadi non saltare', 'Rimbalzo immediato', 'Minimo tempo a terra']
        },
        'copenhagen_adductor': {
            url: 'https://www.youtube.com/watch?v=2FNLNdXV6b4',
            title: 'Copenhagen Adductor - Prevenzione Inguine',
            source: 'YouTube',
            duration: '4:00',
            language: 'en',
            cues: ['Gamba su panca', 'Solleva gamba bassa', 'Adduttori attivi']
        },
        'seated_row': {
            url: 'https://www.youtube.com/watch?v=xQNrFHEMhI4',
            title: 'Seated Cable Row',
            source: 'YouTube',
            duration: '3:30',
            language: 'it',
            cues: ['Schiena dritta', 'Tira ai fianchi', 'Scapole retratte']
        },
        'cable_crossover': {
            url: 'https://www.youtube.com/watch?v=taI4XduLpTk',
            title: 'Cable Crossover - Petto',
            source: 'YouTube',
            duration: '4:00',
            language: 'it',
            cues: ['Leggera inclinazione', 'Gomiti fissi', 'Squeeze in centro']
        },
        'assault_bike': {
            url: 'https://www.youtube.com/watch?v=1b2F84pN_54',
            title: 'Assault Bike - Cardio HIIT',
            source: 'YouTube',
            duration: '3:00',
            language: 'en',
            cues: ['Braccia e gambe', 'Ritmo costante', 'Sprint intervallati']
        },
        'rowing_machine': {
            url: 'https://www.youtube.com/watch?v=Ts7P9C2gxdE',
            title: 'Rowing Machine - Tecnica',
            source: 'YouTube',
            duration: '5:00',
            language: 'en',
            cues: ['Gambe-schiena-braccia', 'Ritorno inverso', 'Core attivo']
        },
        'sled_push': {
            url: 'https://www.youtube.com/watch?v=eP5oylgV0ls',
            title: 'Sled Push',
            source: 'YouTube',
            duration: '3:00',
            language: 'en',
            cues: ['Corpo inclinato 45°', 'Spinta da gambe', 'Passi corti e veloci']
        },
        
        // ════════════════════════════════════════════════════════════════════════
        // 🔥 WARMUP / MOBILITY EXERCISES
        // ════════════════════════════════════════════════════════════════════════
        
        'glute_bridge': {
            url: 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E',
            title: 'Glute Bridge - Attivazione Glutei',
            source: 'YouTube',
            duration: '3:00',
            language: 'it',
            cues: ['Talloni a terra', 'Squeeze in alto', 'Pausa 1-2 sec']
        },
        'cat_cow': {
            url: 'https://www.youtube.com/watch?v=kqnua4rHVVA',
            title: 'Cat-Cow Stretch - Mobilità Spinale',
            source: 'YouTube',
            duration: '2:30',
            language: 'it',
            cues: ['Inspira COW', 'Espira CAT', 'Movimento fluido']
        },
        'worlds_greatest_stretch': {
            url: 'https://www.youtube.com/watch?v=MhSq16p9nCA',
            title: 'World\'s Greatest Stretch',
            source: 'YouTube',
            duration: '3:00',
            language: 'en',
            cues: ['Lunge profondo', 'Gomito a terra', 'Ruota e apri']
        },
        'band_pull_apart': {
            url: 'https://www.youtube.com/watch?v=JObYtU7Y7ag',
            title: 'Band Pull Apart - Attivazione Spalle',
            source: 'YouTube',
            duration: '2:30',
            language: 'en',
            cues: ['Braccia tese', 'Scapole retratte', 'Pausa al petto']
        },
        'leg_swings': {
            url: 'https://www.youtube.com/watch?v=Qy-wLNg9VjQ',
            title: 'Leg Swings - Mobilità Dinamica',
            source: 'YouTube',
            duration: '2:00',
            language: 'en',
            cues: ['Frontali e Laterali', 'Aumenta gradualmente', 'Core stabile']
        },
        'arm_circles': {
            url: 'https://www.youtube.com/watch?v=GVyMO6PU_N4',
            title: 'Arm Circles - Mobilità Spalle',
            source: 'YouTube',
            duration: '2:00',
            language: 'en',
            cues: ['Piccoli → Grandi', 'Avanti e Indietro', 'Braccia tese']
        },
        'dynamic_locomotion': {
            url: 'https://www.youtube.com/watch?v=nPHfEnZD1Wc',
            title: 'Dynamic Warm-Up Drills',
            source: 'YouTube',
            duration: '5:00',
            language: 'en',
            cues: ['High Knees', 'Butt Kicks', 'Lateral Shuffle', 'Carioca']
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔍 FUNZIONI DI RICERCA
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Trova video per un esercizio
     * @param {string} exerciseName - Nome esercizio
     * @returns {Object|null} Video info o null
     */
    findVideo(exerciseName) {
        if (!exerciseName) return null;
        
        // Normalizza nome
        const normalized = this.normalizeExerciseName(exerciseName);
        
        // Match esatto
        if (this.library[normalized]) {
            return { key: normalized, ...this.library[normalized] };
        }
        
        // Cerca match parziale
        const keys = Object.keys(this.library);
        for (const key of keys) {
            if (normalized.includes(key) || key.includes(normalized)) {
                return { key, ...this.library[key] };
            }
        }
        
        // Cerca per parole chiave
        const words = normalized.split('_');
        for (const key of keys) {
            const keyWords = key.split('_');
            const matches = words.filter(w => keyWords.includes(w));
            if (matches.length >= 2 || (matches.length === 1 && words.length === 1)) {
                return { key, ...this.library[key] };
            }
        }
        
        return null;
    },
    
    /**
     * Normalizza nome esercizio per matching
     */
    normalizeExerciseName(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .replace(/^(barbell|dumbbell|cable|machine|smith)_/, '')
            .replace(/_?(bilaterale|unilaterale|alternato)$/, '')
            .trim();
    },
    
    /**
     * Aggiungi video URL a tutti gli esercizi di un workout
     * @param {Object} workout - Workout con exercises
     * @returns {Object} Workout con video URLs
     */
    enrichWorkout(workout) {
        if (!workout) return workout;
        
        const processExercise = (ex) => {
            const video = this.findVideo(ex.name || ex.exercise);
            if (video) {
                return {
                    ...ex,
                    videoUrl: video.url,
                    videoTitle: video.title,
                    videoCues: video.cues
                };
            }
            return ex;
        };
        
        const exercises = workout.exercises || workout;
        
        if (Array.isArray(exercises)) {
            workout.exercises = exercises.map(processExercise);
        } else if (typeof exercises === 'object') {
            ['warmup', 'main', 'accessory', 'cooldown', 'rehab'].forEach(section => {
                if (exercises[section]) {
                    workout.exercises[section] = exercises[section].map(processExercise);
                }
            });
        }
        
        return workout;
    },
    
    /**
     * Conta quanti esercizi hanno video disponibile
     */
    countCoverage(workout) {
        let total = 0;
        let withVideo = 0;
        
        const countExercise = (ex) => {
            total++;
            if (this.findVideo(ex.name || ex.exercise)) {
                withVideo++;
            }
        };
        
        const exercises = workout?.exercises || workout;
        
        if (Array.isArray(exercises)) {
            exercises.forEach(countExercise);
        } else if (typeof exercises === 'object') {
            ['warmup', 'main', 'accessory', 'cooldown', 'rehab'].forEach(section => {
                if (exercises[section]) {
                    exercises[section].forEach(countExercise);
                }
            });
        }
        
        return {
            total,
            withVideo,
            coverage: total > 0 ? Math.round((withVideo / total) * 100) : 0
        };
    },
    
    /**
     * Genera HTML per icona video
     */
    getVideoIcon(exerciseName) {
        const video = this.findVideo(exerciseName);
        if (!video) return '';
        
        return `<a href="${video.url}" target="_blank" class="video-link" title="${video.title}">
            <i class="fas fa-play-circle"></i>
        </a>`;
    },
    
    /**
     * Genera HTML per modal video
     */
    getVideoModal(exerciseName) {
        const video = this.findVideo(exerciseName);
        if (!video) return null;
        
        // Estrai video ID da YouTube URL
        const match = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        const videoId = match ? match[1] : null;
        
        if (!videoId) return null;
        
        return {
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            title: video.title,
            cues: video.cues,
            duration: video.duration
        };
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🎬 ATLAS Video Library v1.0 loaded!');
console.log(`   → ${Object.keys(ATLASVideos.library).length} esercizi con video tutorial`);
console.log('   → ATLASVideos.findVideo(name) - Trova video per esercizio');
console.log('   → ATLASVideos.enrichWorkout(workout) - Aggiunge URL a tutti gli esercizi');
