// GR Perform - Wearables Integration Service
// Gestisce connessione e sync con dispositivi fitness

const WearablesService = {
    
    // Configurazioni OAuth (in produzione usare variabili d'ambiente)
    config: {
        garmin: {
            clientId: 'YOUR_GARMIN_CLIENT_ID',
            authUrl: 'https://connect.garmin.com/oauthConfirm',
            tokenUrl: 'https://connectapi.garmin.com/oauth-service/oauth/access_token',
            apiBase: 'https://apis.garmin.com'
        },
        fitbit: {
            clientId: 'YOUR_FITBIT_CLIENT_ID',
            authUrl: 'https://www.fitbit.com/oauth2/authorize',
            tokenUrl: 'https://api.fitbit.com/oauth2/token',
            apiBase: 'https://api.fitbit.com'
        },
        whoop: {
            clientId: 'YOUR_WHOOP_CLIENT_ID',
            authUrl: 'https://api.prod.whoop.com/oauth/oauth2/auth',
            tokenUrl: 'https://api.prod.whoop.com/oauth/oauth2/token',
            apiBase: 'https://api.prod.whoop.com'
        },
        oura: {
            clientId: 'YOUR_OURA_CLIENT_ID',
            authUrl: 'https://cloud.ouraring.com/oauth/authorize',
            tokenUrl: 'https://api.ouraring.com/oauth/token',
            apiBase: 'https://api.ouraring.com'
        },
        strava: {
            clientId: 'YOUR_STRAVA_CLIENT_ID',
            authUrl: 'https://www.strava.com/oauth/authorize',
            tokenUrl: 'https://www.strava.com/oauth/token',
            apiBase: 'https://www.strava.com/api/v3'
        }
    },
    
    // Inizia OAuth flow
    initiateOAuth(provider) {
        const config = this.config[provider];
        if (!config) {
            console.error('Provider non supportato:', provider);
            return;
        }
        
        const redirectUri = `${window.location.origin}/oauth-callback.html`;
        const state = this.generateState();
        localStorage.setItem('oauth_state', state);
        localStorage.setItem('oauth_provider', provider);
        
        const scopes = this.getScopes(provider);
        
        let authUrl = `${config.authUrl}?` +
            `client_id=${config.clientId}&` +
            `response_type=code&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `scope=${encodeURIComponent(scopes)}&` +
            `state=${state}`;
        
        window.location.href = authUrl;
    },
    
    // Scopes per provider
    getScopes(provider) {
        const scopeMap = {
            garmin: 'activity health sleep stress',
            fitbit: 'activity heartrate sleep profile',
            whoop: 'read:recovery read:sleep read:workout',
            oura: 'daily sleep workout heartrate',
            strava: 'read,activity:read'
        };
        return scopeMap[provider] || '';
    },
    
    // Genera state per CSRF protection
    generateState() {
        return Math.random().toString(36).substring(2, 15);
    },
    
    // Gestisci callback OAuth
    async handleOAuthCallback(code, state) {
        const savedState = localStorage.getItem('oauth_state');
        const provider = localStorage.getItem('oauth_provider');
        
        if (state !== savedState) {
            throw new Error('State mismatch - possibile attacco CSRF');
        }
        
        // In produzione, questo va fatto lato server per proteggere client_secret
        const tokens = await this.exchangeCodeForTokens(provider, code);
        
        // Salva tokens
        await this.saveTokens(provider, tokens);
        
        // Fetch dati iniziali
        await this.syncData(provider);
        
        return { success: true, provider };
    },
    
    // Scambia code per tokens (da fare lato server in produzione)
    async exchangeCodeForTokens(provider, code) {
        // Questo è un placeholder - in produzione usa un backend
        console.log(`Exchanging code for ${provider} tokens...`);
        
        // Simula tokens
        return {
            access_token: 'simulated_access_token',
            refresh_token: 'simulated_refresh_token',
            expires_in: 3600
        };
    },
    
    // Salva tokens nel database
    async saveTokens(provider, tokens) {
        const athleteId = localStorage.getItem('gr_athlete_id');
        if (!athleteId) return;
        
        const wearableData = {
            provider: provider,
            access_token: tokens.access_token, // In produzione: criptare
            refresh_token: tokens.refresh_token,
            expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
            connected_at: new Date().toISOString()
        };
        
        // Aggiorna atleta con wearable connesso
        await supabase.update('athletes', athleteId, {
            [`wearable_${provider}`]: wearableData
        });
    },
    
    // Sync dati dal wearable
    async syncData(provider) {
        console.log(`Syncing data from ${provider}...`);
        
        // In produzione, chiama le API reali
        // Per ora simuliamo i dati
        const data = this.generateSimulatedData(provider);
        
        return this.processAndSaveData(data);
    },
    
    // Genera dati simulati (per demo)
    generateSimulatedData(provider) {
        const baseHRV = 45 + Math.random() * 20;
        const baseHR = 55 + Math.random() * 10;
        const sleepHours = 6 + Math.random() * 2;
        
        return {
            provider: provider,
            timestamp: new Date().toISOString(),
            metrics: {
                // Heart Rate
                resting_heart_rate: Math.round(baseHR),
                max_heart_rate: Math.round(160 + Math.random() * 30),
                avg_heart_rate: Math.round(baseHR + 15),
                
                // HRV
                hrv_rmssd: Math.round(baseHRV),
                hrv_trend: baseHRV > 50 ? 'up' : (baseHRV > 40 ? 'stable' : 'down'),
                
                // Sleep
                sleep_duration_minutes: Math.round(sleepHours * 60),
                sleep_deep_minutes: Math.round(sleepHours * 60 * 0.2),
                sleep_light_minutes: Math.round(sleepHours * 60 * 0.5),
                sleep_rem_minutes: Math.round(sleepHours * 60 * 0.25),
                sleep_awake_minutes: Math.round(sleepHours * 60 * 0.05),
                sleep_score: Math.round(70 + Math.random() * 25),
                
                // Activity
                steps: Math.round(5000 + Math.random() * 10000),
                calories_total: Math.round(1800 + Math.random() * 1000),
                calories_active: Math.round(300 + Math.random() * 500),
                distance_meters: Math.round(3000 + Math.random() * 8000),
                floors_climbed: Math.round(Math.random() * 20),
                active_minutes: Math.round(30 + Math.random() * 90),
                
                // Stress/Recovery
                stress_score: Math.round(20 + Math.random() * 50),
                recovery_score: Math.round(50 + Math.random() * 50),
                body_battery: Math.round(40 + Math.random() * 60), // Garmin specific
                strain: Math.round(5 + Math.random() * 15), // WHOOP specific
                
                // Readiness (Oura/WHOOP)
                readiness_score: Math.round(60 + Math.random() * 35)
            }
        };
    },
    
    // Processa e salva dati
    async processAndSaveData(data) {
        const athleteId = localStorage.getItem('gr_athlete_id');
        if (!athleteId) return;
        
        // Calcola readiness unificato
        const readiness = this.calculateUnifiedReadiness(data.metrics);
        
        // Aggiorna database
        await supabase.update('athletes', athleteId, {
            biometric_data: data.metrics,
            biometric_updated_at: data.timestamp,
            biometric_provider: data.provider,
            readiness_score: readiness.score,
            readiness_factors: readiness.factors
        });
        
        return { data, readiness };
    },
    
    // Calcola readiness unificato da tutte le metriche
    calculateUnifiedReadiness(metrics) {
        const factors = {};
        let totalScore = 0;
        let totalWeight = 0;
        
        // HRV (peso: 30%)
        if (metrics.hrv_rmssd) {
            const hrvScore = this.normalizeHRV(metrics.hrv_rmssd);
            factors.hrv = { value: metrics.hrv_rmssd, score: hrvScore, weight: 30 };
            totalScore += hrvScore * 30;
            totalWeight += 30;
        }
        
        // Resting HR (peso: 15%)
        if (metrics.resting_heart_rate) {
            const hrScore = this.normalizeRestingHR(metrics.resting_heart_rate);
            factors.resting_hr = { value: metrics.resting_heart_rate, score: hrScore, weight: 15 };
            totalScore += hrScore * 15;
            totalWeight += 15;
        }
        
        // Sleep Duration (peso: 25%)
        if (metrics.sleep_duration_minutes) {
            const sleepScore = this.normalizeSleepDuration(metrics.sleep_duration_minutes);
            factors.sleep_duration = { value: metrics.sleep_duration_minutes, score: sleepScore, weight: 25 };
            totalScore += sleepScore * 25;
            totalWeight += 25;
        }
        
        // Sleep Quality (peso: 15%)
        if (metrics.sleep_score) {
            const qualityScore = metrics.sleep_score;
            factors.sleep_quality = { value: metrics.sleep_score, score: qualityScore, weight: 15 };
            totalScore += qualityScore * 15;
            totalWeight += 15;
        }
        
        // Stress (peso: 15%) - inverso
        if (metrics.stress_score !== undefined) {
            const stressScore = 100 - metrics.stress_score; // Inverti: alto stress = basso score
            factors.stress = { value: metrics.stress_score, score: stressScore, weight: 15 };
            totalScore += stressScore * 15;
            totalWeight += 15;
        }
        
        const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;
        
        return {
            score: finalScore,
            factors: factors,
            recommendation: this.getReadinessRecommendation(finalScore)
        };
    },
    
    // Normalizza HRV (range tipico 20-80ms per atleti)
    normalizeHRV(hrv) {
        if (hrv >= 60) return 100;
        if (hrv >= 50) return 85;
        if (hrv >= 40) return 70;
        if (hrv >= 30) return 50;
        if (hrv >= 20) return 30;
        return 15;
    },
    
    // Normalizza Resting HR (più basso = meglio per atleti)
    normalizeRestingHR(hr) {
        if (hr <= 50) return 100;
        if (hr <= 55) return 90;
        if (hr <= 60) return 80;
        if (hr <= 65) return 65;
        if (hr <= 70) return 50;
        if (hr <= 75) return 35;
        return 20;
    },
    
    // Normalizza durata sonno
    normalizeSleepDuration(minutes) {
        const hours = minutes / 60;
        if (hours >= 8) return 100;
        if (hours >= 7.5) return 90;
        if (hours >= 7) return 80;
        if (hours >= 6.5) return 65;
        if (hours >= 6) return 50;
        if (hours >= 5) return 30;
        return 15;
    },
    
    // Raccomandazione basata su readiness
    getReadinessRecommendation(score) {
        if (score >= 80) {
            return {
                status: 'optimal',
                message: 'Condizioni ottimali per allenamento intenso',
                suggestion: 'Puoi affrontare sessioni ad alta intensità o volume elevato',
                emoji: '🚀'
            };
        } else if (score >= 65) {
            return {
                status: 'good',
                message: 'Buona readiness per allenamento normale',
                suggestion: 'Allenamento standard, evita di strafare',
                emoji: '💪'
            };
        } else if (score >= 50) {
            return {
                status: 'moderate',
                message: 'Readiness moderata',
                suggestion: 'Sessione a intensità ridotta o tecnica',
                emoji: '👍'
            };
        } else if (score >= 35) {
            return {
                status: 'low',
                message: 'Readiness bassa - recupero consigliato',
                suggestion: 'Considera mobilità, stretching o rest day',
                emoji: '🧘'
            };
        } else {
            return {
                status: 'critical',
                message: 'Recupero prioritario',
                suggestion: 'Rest day fortemente consigliato',
                emoji: '😴'
            };
        }
    },
    
    // Check se abbiamo dati freschi (< 12 ore)
    isDataFresh(lastUpdate) {
        if (!lastUpdate) return false;
        const hoursSinceUpdate = (Date.now() - new Date(lastUpdate)) / (1000 * 60 * 60);
        return hoursSinceUpdate < 12;
    },
    
    // Fetch dati per dashboard
    async getDashboardMetrics(athleteId) {
        const athletes = await supabase.fetch('athletes', `?id=eq.${athleteId}`);
        const athlete = athletes[0];
        
        if (!athlete || !athlete.biometric_data) {
            return null;
        }
        
        return {
            metrics: athlete.biometric_data,
            readiness: athlete.readiness_score,
            factors: athlete.readiness_factors,
            provider: athlete.biometric_provider,
            lastUpdate: athlete.biometric_updated_at,
            isFresh: this.isDataFresh(athlete.biometric_updated_at)
        };
    }
};

// Export
window.WearablesService = WearablesService;
