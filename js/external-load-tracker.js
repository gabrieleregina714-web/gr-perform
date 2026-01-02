// ============================================
// GR PERFORM - EXTERNAL LOAD TRACKER v1.0
// ============================================
// Traccia e stima il carico degli allenamenti esterni
// (squadra, sport, corsa, etc.) per adattare la palestra
// ============================================

const ExternalLoadTracker = {
    
    version: '1.0.0',
    name: 'ExternalLoadTracker',
    
    // Storage key prefix
    STORAGE_KEY: 'gr_external_load_',
    
    // ===========================================
    // PROFILI DI CARICO PER TIPO DI SESSIONE
    // ===========================================
    
    sessionProfiles: {
        // ALLENAMENTO SQUADRA
        team_training: {
            light: { load: 250, intensity: 55, description: 'Tattica leggera, possesso palla' },
            medium: { load: 450, intensity: 70, description: 'Allenamento standard, esercitazioni' },
            high: { load: 650, intensity: 85, description: 'Intenso, partitelle, condizionamento' },
            very_high: { load: 850, intensity: 95, description: 'Doppio allenamento, test fisici' }
        },
        
        // PARTITA/MATCH
        match: {
            friendly: { load: 500, intensity: 75, description: 'Amichevole, minuti parziali' },
            full_match: { load: 800, intensity: 90, description: 'Partita ufficiale completa' },
            cup_match: { load: 900, intensity: 95, description: 'Partita eliminatoria, alta tensione' },
            derby: { load: 950, intensity: 98, description: 'Derby/big match, massima intensità' }
        },
        
        // SPARRING/FIGHT TRAINING (MMA, Boxe)
        sparring: {
            technical: { load: 350, intensity: 60, description: 'Sparring tecnico, controllo' },
            light: { load: 500, intensity: 70, description: 'Sparring leggero' },
            hard: { load: 750, intensity: 90, description: 'Sparring duro, simulazione gara' },
            competition: { load: 1000, intensity: 100, description: 'Incontro/combattimento' }
        },
        
        // CORSA/RUNNING
        running: {
            recovery_jog: { load: 100, intensity: 40, description: 'Corsa rigenerativa 20-30min' },
            easy_run: { load: 200, intensity: 55, description: 'Corsa facile 30-45min' },
            tempo_run: { load: 400, intensity: 75, description: 'Corsa a ritmo, 30-40min' },
            interval: { load: 550, intensity: 85, description: 'Ripetute, interval training' },
            long_run: { load: 500, intensity: 65, description: 'Lungo lento 60-90min' },
            race: { load: 700, intensity: 95, description: 'Gara/time trial' }
        },
        
        // NUOTO
        swimming: {
            recovery: { load: 150, intensity: 45, description: 'Nuoto rigenerativo 30min' },
            technique: { load: 300, intensity: 55, description: 'Lavoro tecnico' },
            endurance: { load: 450, intensity: 70, description: 'Resistenza aerobica' },
            speed: { load: 550, intensity: 85, description: 'Lavoro velocità/potenza' },
            competition: { load: 700, intensity: 95, description: 'Gara' }
        },
        
        // CICLISMO
        cycling: {
            recovery: { load: 150, intensity: 45, description: 'Uscita rigenerativa 1h' },
            endurance: { load: 350, intensity: 60, description: 'Fondo 2-3h' },
            tempo: { load: 500, intensity: 75, description: 'Soglia/FTP' },
            intervals: { load: 650, intensity: 85, description: 'Ripetute in salita/sprint' },
            race: { load: 900, intensity: 95, description: 'Gara/granfondo' }
        },
        
        // SPORT RACCHETTA
        racquet_sport: {
            practice: { load: 300, intensity: 60, description: 'Pratica/drill' },
            training_match: { load: 450, intensity: 75, description: 'Partita allenamento' },
            official_match: { load: 600, intensity: 90, description: 'Match ufficiale' },
            tournament: { load: 750, intensity: 95, description: 'Torneo (più match)' }
        },
        
        // ALTRO GENERICO
        other: {
            light: { load: 200, intensity: 50, description: 'Attività leggera' },
            medium: { load: 400, intensity: 70, description: 'Attività moderata' },
            high: { load: 600, intensity: 85, description: 'Attività intensa' }
        }
    },
    
    // ===========================================
    // MOLTIPLICATORI PER DURATA
    // ===========================================
    
    durationMultipliers: {
        15: 0.3,
        30: 0.5,
        45: 0.7,
        60: 0.85,
        75: 0.95,
        90: 1.0,
        105: 1.1,
        120: 1.2,
        150: 1.35,
        180: 1.5
    },
    
    // ===========================================
    // REGISTRA SESSIONE ESTERNA
    // ===========================================
    
    logSession(athleteId, session) {
        const entry = {
            id: this.generateId(),
            athleteId: athleteId,
            date: session.date || new Date().toISOString().split('T')[0],
            time: session.time || null,
            type: session.type || 'team_training',
            intensity: session.intensity || 'medium',
            duration: session.duration || 90,
            description: session.description || '',
            rpe: session.rpe || null,
            notes: session.notes || '',
            createdAt: new Date().toISOString()
        };
        
        // Calcola il carico
        const calculated = this.calculateLoad(entry);
        entry.load = calculated.load;
        entry.estimatedIntensity = calculated.intensity;
        
        // Salva
        const sessions = this.getAthleteHistory(athleteId);
        sessions.push(entry);
        this.saveAthleteHistory(athleteId, sessions);
        
        console.log(`📊 ExternalLoadTracker: Sessione registrata`, entry);
        
        return entry;
    },
    
    // ===========================================
    // CALCOLA CARICO
    // ===========================================
    
    calculateLoad(session) {
        const profile = this.sessionProfiles[session.type] || this.sessionProfiles.other;
        const intensityProfile = profile[session.intensity] || profile.medium || Object.values(profile)[1];
        
        let baseLoad = intensityProfile.load;
        let baseIntensity = intensityProfile.intensity;
        
        // Applica moltiplicatore durata
        const durationMult = this.getDurationMultiplier(session.duration);
        baseLoad = Math.round(baseLoad * durationMult);
        
        // Se c'è RPE soggettivo, pesa anche quello
        if (session.rpe && session.rpe >= 1 && session.rpe <= 10) {
            const rpeFactor = session.rpe / 7; // 7 è il riferimento "normale"
            baseLoad = Math.round(baseLoad * rpeFactor);
            baseIntensity = Math.min(100, Math.round(baseIntensity * (rpeFactor * 0.5 + 0.5)));
        }
        
        return {
            load: baseLoad,
            intensity: baseIntensity
        };
    },
    
    getDurationMultiplier(minutes) {
        const keys = Object.keys(this.durationMultipliers).map(Number).sort((a, b) => a - b);
        
        if (minutes <= keys[0]) return this.durationMultipliers[keys[0]];
        if (minutes >= keys[keys.length - 1]) return this.durationMultipliers[keys[keys.length - 1]];
        
        // Interpolazione lineare
        for (let i = 0; i < keys.length - 1; i++) {
            if (minutes >= keys[i] && minutes < keys[i + 1]) {
                const ratio = (minutes - keys[i]) / (keys[i + 1] - keys[i]);
                return this.durationMultipliers[keys[i]] + 
                       ratio * (this.durationMultipliers[keys[i + 1]] - this.durationMultipliers[keys[i]]);
            }
        }
        
        return 1.0;
    },
    
    // ===========================================
    // ANALISI CARICO
    // ===========================================
    
    analyze(athleteId, days = 7) {
        const history = this.getAthleteHistory(athleteId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const cutoff = new Date(today);
        cutoff.setDate(cutoff.getDate() - days);
        
        const recentSessions = history.filter(s => {
            const sessionDate = new Date(s.date);
            sessionDate.setHours(0, 0, 0, 0);
            return sessionDate >= cutoff && sessionDate <= today;
        });
        
        // Totali
        const totalLoad = recentSessions.reduce((sum, s) => sum + (s.load || 0), 0);
        const avgIntensity = recentSessions.length > 0 
            ? Math.round(recentSessions.reduce((sum, s) => sum + (s.estimatedIntensity || 0), 0) / recentSessions.length)
            : 0;
        
        // Ultimi 2 giorni (per la decisione immediata)
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        const lastTwoDays = history.filter(s => {
            const sessionDate = new Date(s.date);
            sessionDate.setHours(0, 0, 0, 0);
            return sessionDate >= twoDaysAgo && sessionDate <= today;
        });
        
        const recentLoad = lastTwoDays.reduce((sum, s) => sum + (s.load || 0), 0);
        
        // Ieri
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const yesterdaySessions = history.filter(s => s.date === yesterdayStr);
        const yesterdayLoad = yesterdaySessions.reduce((sum, s) => sum + (s.load || 0), 0);
        
        // Oggi (se già registrato)
        const todayStr = today.toISOString().split('T')[0];
        const todaySessions = history.filter(s => s.date === todayStr);
        const todayLoad = todaySessions.reduce((sum, s) => sum + (s.load || 0), 0);
        
        // Raccomandazioni
        const recommendations = this.generateRecommendations(totalLoad, recentLoad, yesterdayLoad, todayLoad, days);
        
        return {
            period: `${days} giorni`,
            sessionsCount: recentSessions.length,
            totalLoad,
            avgLoadPerDay: Math.round(totalLoad / days),
            avgIntensity,
            
            yesterday: {
                load: yesterdayLoad,
                sessions: yesterdaySessions.length,
                types: [...new Set(yesterdaySessions.map(s => s.type))]
            },
            
            today: {
                load: todayLoad,
                sessions: todaySessions.length,
                types: [...new Set(todaySessions.map(s => s.type))]
            },
            
            recentLoad,
            
            recommendations,
            
            forPrompt: this.formatForPrompt(recentSessions, totalLoad, recommendations, yesterdayLoad, todayLoad)
        };
    },
    
    // ===========================================
    // GENERA RACCOMANDAZIONI
    // ===========================================
    
    generateRecommendations(totalLoad, recentLoad, yesterdayLoad, todayLoad, days) {
        const recommendations = {
            volumeModifier: 1.0,
            intensityModifier: 1.0,
            focusSuggestions: [],
            warnings: [],
            avoidAreas: []
        };
        
        // Carico ieri alto
        if (yesterdayLoad >= 600) {
            recommendations.volumeModifier *= 0.7;
            recommendations.intensityModifier *= 0.75;
            recommendations.warnings.push(`⚠️ Alto carico ieri (${yesterdayLoad} AU) - ridurre volume palestra`);
            recommendations.focusSuggestions.push('recovery', 'mobility');
        } else if (yesterdayLoad >= 400) {
            recommendations.volumeModifier *= 0.85;
            recommendations.intensityModifier *= 0.9;
            recommendations.warnings.push(`📊 Carico moderato ieri (${yesterdayLoad} AU) - adattare intensità`);
        }
        
        // Carico oggi (pre-allenamento squadra)
        if (todayLoad > 0) {
            recommendations.volumeModifier *= 0.6;
            recommendations.intensityModifier *= 0.7;
            recommendations.warnings.push(`🏃 Sessione già fatta oggi (${todayLoad} AU) - palestra leggera`);
            recommendations.avoidAreas.push('heavy_compounds', 'high_volume_legs');
        }
        
        // Carico settimanale alto
        const avgDaily = totalLoad / days;
        if (avgDaily >= 500) {
            recommendations.volumeModifier *= 0.8;
            recommendations.warnings.push(`📈 Settimana ad alto carico (${Math.round(avgDaily)} AU/giorno)`);
            recommendations.focusSuggestions.push('prehab', 'core');
        }
        
        // Ultimi 2 giorni molto carichi
        if (recentLoad >= 1000) {
            recommendations.volumeModifier *= 0.7;
            recommendations.intensityModifier *= 0.8;
            recommendations.warnings.push(`🔥 Ultimi 2 giorni molto intensi (${recentLoad} AU)`);
            recommendations.avoidAreas.push('plyometrics', 'max_effort');
            recommendations.focusSuggestions.push('upper_body_focus', 'technique');
        }
        
        // Normalizza i modificatori
        recommendations.volumeModifier = Math.max(0.4, Math.min(1.0, recommendations.volumeModifier));
        recommendations.intensityModifier = Math.max(0.5, Math.min(1.0, recommendations.intensityModifier));
        
        return recommendations;
    },
    
    // ===========================================
    // FORMATTAZIONE PER PROMPT AI
    // ===========================================
    
    formatForPrompt(sessions, totalLoad, recommendations, yesterdayLoad, todayLoad) {
        if (sessions.length === 0 && yesterdayLoad === 0 && todayLoad === 0) {
            return '';
        }
        
        const lines = [];
        lines.push('=== CARICO ESTERNO (Sport/Squadra) ===');
        
        if (yesterdayLoad > 0) {
            lines.push(`📊 Ieri: ${yesterdayLoad} AU (Arbitrary Units)`);
        }
        
        if (todayLoad > 0) {
            lines.push(`🏃 Oggi (già fatto): ${todayLoad} AU`);
        }
        
        if (sessions.length > 0) {
            lines.push(`📅 Ultimi ${sessions.length} sessioni: ${totalLoad} AU totali`);
        }
        
        if (recommendations.warnings.length > 0) {
            lines.push('⚠️ Alert: ' + recommendations.warnings.join(' | '));
        }
        
        lines.push(`📉 Modificatori consigliati: Volume ${Math.round(recommendations.volumeModifier * 100)}%, Intensità ${Math.round(recommendations.intensityModifier * 100)}%`);
        
        if (recommendations.avoidAreas.length > 0) {
            lines.push(`❌ Evitare: ${recommendations.avoidAreas.join(', ')}`);
        }
        
        if (recommendations.focusSuggestions.length > 0) {
            lines.push(`✅ Focus: ${recommendations.focusSuggestions.join(', ')}`);
        }
        
        return lines.join('\n');
    },
    
    // ===========================================
    // STIMA CARICO DA CALENDARIO
    // ===========================================
    
    estimateFromCalendar(events, athleteId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const estimates = [];
        
        for (const event of events) {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            
            // Solo ieri e oggi
            if (eventDate.getTime() !== yesterday.getTime() && eventDate.getTime() !== today.getTime()) {
                continue;
            }
            
            const type = (event.type || '').toLowerCase();
            const name = (event.name || event.title || '').toLowerCase();
            
            let sessionType = 'other';
            let intensity = 'medium';
            
            // Determina tipo
            if (type.includes('match') || type.includes('partita') || name.includes('partita')) {
                sessionType = 'match';
                intensity = type.includes('friendly') || name.includes('amichevole') ? 'friendly' : 'full_match';
            } else if (type.includes('train') || name.includes('allenamento')) {
                sessionType = 'team_training';
                if (name.includes('leggero') || name.includes('tattico')) intensity = 'light';
                else if (name.includes('intenso') || name.includes('fisico')) intensity = 'high';
            } else if (type.includes('spar') || name.includes('sparring')) {
                sessionType = 'sparring';
                if (name.includes('tecnico')) intensity = 'technical';
                else if (name.includes('duro') || name.includes('hard')) intensity = 'hard';
            }
            
            const estimate = {
                date: event.date,
                type: sessionType,
                intensity: intensity,
                duration: event.duration || 90,
                fromCalendar: true,
                eventName: event.name || event.title
            };
            
            const calculated = this.calculateLoad(estimate);
            estimate.load = calculated.load;
            estimate.estimatedIntensity = calculated.intensity;
            
            estimates.push(estimate);
        }
        
        return estimates;
    },
    
    // ===========================================
    // STORAGE HELPERS
    // ===========================================
    
    getAthleteHistory(athleteId) {
        try {
            const key = this.STORAGE_KEY + athleteId;
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.warn('ExternalLoadTracker: Errore lettura storage', e);
            return [];
        }
    },
    
    saveAthleteHistory(athleteId, sessions) {
        try {
            const key = this.STORAGE_KEY + athleteId;
            // Mantieni solo ultimi 90 giorni
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - 90);
            const filtered = sessions.filter(s => new Date(s.date) >= cutoff);
            localStorage.setItem(key, JSON.stringify(filtered));
        } catch (e) {
            console.warn('ExternalLoadTracker: Errore salvataggio', e);
        }
    },
    
    generateId() {
        return `ext_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // ===========================================
    // UI HELPERS
    // ===========================================
    
    getSessionTypeOptions() {
        return [
            { value: 'team_training', label: '⚽ Allenamento Squadra' },
            { value: 'match', label: '🏆 Partita/Match' },
            { value: 'sparring', label: '🥊 Sparring/Combat' },
            { value: 'running', label: '🏃 Corsa' },
            { value: 'swimming', label: '🏊 Nuoto' },
            { value: 'cycling', label: '🚴 Ciclismo' },
            { value: 'racquet_sport', label: '🎾 Sport Racchetta' },
            { value: 'other', label: '📋 Altro' }
        ];
    },
    
    getIntensityOptions(sessionType) {
        const profile = this.sessionProfiles[sessionType] || this.sessionProfiles.other;
        return Object.entries(profile).map(([key, value]) => ({
            value: key,
            label: value.description,
            load: value.load
        }));
    },
    
    // ===========================================
    // QUICK LOG - Per input veloce
    // ===========================================
    
    quickLog(athleteId, type, intensity = 'medium', rpe = null) {
        return this.logSession(athleteId, {
            type,
            intensity,
            rpe,
            duration: this.getDefaultDuration(type, intensity),
            description: `Quick log: ${type} - ${intensity}`
        });
    },
    
    getDefaultDuration(type, intensity) {
        const defaults = {
            team_training: { light: 60, medium: 90, high: 105, very_high: 120 },
            match: { friendly: 70, full_match: 95, cup_match: 100, derby: 100 },
            sparring: { technical: 45, light: 60, hard: 75, competition: 25 },
            running: { recovery_jog: 25, easy_run: 40, tempo_run: 35, interval: 45, long_run: 80, race: 30 },
            swimming: { recovery: 30, technique: 45, endurance: 60, speed: 50, competition: 10 },
            cycling: { recovery: 60, endurance: 150, tempo: 90, intervals: 75, race: 180 },
            racquet_sport: { practice: 60, training_match: 90, official_match: 120, tournament: 180 },
            other: { light: 45, medium: 60, high: 75 }
        };
        
        return defaults[type]?.[intensity] || 60;
    }
};

// Export for browser
if (typeof window !== 'undefined') {
    window.ExternalLoadTracker = ExternalLoadTracker;
}

console.log('📊 ExternalLoadTracker v1.0 caricato');
