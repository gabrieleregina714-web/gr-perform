// GR Perform - Wearables Integration Service v2.0
// Gestisce connessione e sync con dispositivi fitness
// Now with REAL OAuth flows via Vercel API routes

const WearablesService = {
    
    VERSION: '2.0',
    
    // API base URL (uses Vercel serverless functions)
    apiBase: '/api/wearables',
    
    // Supported providers
    providers: {
        whoop: {
            name: 'WHOOP',
            icon: '🟢',
            features: ['HRV', 'Recovery', 'Sleep', 'Strain'],
            color: '#00D4AA'
        },
        oura: {
            name: 'Oura Ring',
            icon: '⚪',
            features: ['HRV', 'Readiness', 'Sleep', 'Activity'],
            color: '#B8B8B8'
        },
        garmin: {
            name: 'Garmin',
            icon: '🔵',
            features: ['HR', 'HRV', 'Sleep', 'Stress', 'Body Battery'],
            color: '#007CC3'
        },
        fitbit: {
            name: 'Fitbit',
            icon: '🔷',
            features: ['HR', 'Sleep', 'Activity', 'Steps'],
            color: '#00B0B9'
        },
        strava: {
            name: 'Strava',
            icon: '🟠',
            features: ['Activities', 'Training Load'],
            color: '#FC4C02'
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // OAUTH FLOW
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Start OAuth flow for a provider
     */
    connect(provider) {
        if (!this.providers[provider]) {
            console.error('Provider non supportato:', provider);
            return;
        }
        
        const athleteId = localStorage.getItem('gr_athlete_id');
        if (!athleteId) {
            alert('Devi essere loggato per connettere un dispositivo');
            return;
        }
        
        // Redirect to OAuth endpoint
        window.location.href = `${this.apiBase}/${provider}-auth?action=authorize&athlete_id=${athleteId}`;
    },
    
    /**
     * Disconnect a provider
     */
    async disconnect(provider) {
        const athleteId = localStorage.getItem('gr_athlete_id');
        if (!athleteId) return { success: false, error: 'Not logged in' };
        
        try {
            // Update Supabase to mark as inactive
            await supabase.update('athlete_wearables', {
                athlete_id: athleteId,
                provider: provider
            }, {
                is_active: false
            });
            
            return { success: true };
        } catch (error) {
            console.error('Disconnect error:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Get connected providers for current athlete
     */
    async getConnectedProviders() {
        const athleteId = localStorage.getItem('gr_athlete_id');
        if (!athleteId) return [];
        
        try {
            const wearables = await supabase.fetch('athlete_wearables', 
                `?athlete_id=eq.${athleteId}&is_active=eq.true`);
            
            return wearables.map(w => ({
                provider: w.provider,
                name: this.providers[w.provider]?.name || w.provider,
                icon: this.providers[w.provider]?.icon || '📱',
                connectedAt: w.connected_at,
                lastSync: w.last_sync_at
            }));
        } catch (error) {
            console.error('Error fetching connected providers:', error);
            return [];
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // DATA SYNC
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Sync data from all connected providers
     */
    async syncAll() {
        const athleteId = localStorage.getItem('gr_athlete_id');
        if (!athleteId) return { success: false, error: 'Not logged in' };
        
        try {
            const response = await fetch(`${this.apiBase}/sync?athlete_id=${athleteId}`);
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Wearables sync complete:', result);
                
                // Emit event for UI update
                window.dispatchEvent(new CustomEvent('wearables-synced', { 
                    detail: result 
                }));
            }
            
            return result;
        } catch (error) {
            console.error('Sync error:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Sync data from specific provider
     */
    async syncProvider(provider) {
        const athleteId = localStorage.getItem('gr_athlete_id');
        if (!athleteId) return { success: false, error: 'Not logged in' };
        
        try {
            const response = await fetch(`${this.apiBase}/sync?athlete_id=${athleteId}&provider=${provider}`);
            return await response.json();
        } catch (error) {
            console.error('Sync error:', error);
            return { success: false, error: error.message };
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // READINESS CALCULATION (Local fallback + real data)
    // ═══════════════════════════════════════════════════════════════════════════
        
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
