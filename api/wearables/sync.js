/**
 * GR Perform - Wearables Data Sync
 * Vercel Serverless Function
 * 
 * Endpoint: /api/wearables/sync
 * 
 * Fetches real biometric data from connected wearables
 * Supports: WHOOP, Oura, Garmin
 */

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { athlete_id, provider } = req.query;
    
    if (!athlete_id) {
        return res.status(400).json({ error: 'athlete_id required' });
    }

    try {
        // Get stored credentials from Supabase
        const credentials = await getCredentials(athlete_id, provider);
        
        if (!credentials || credentials.length === 0) {
            return res.status(404).json({ 
                error: 'No wearables connected',
                message: 'Connect a wearable device first'
            });
        }
        
        // Sync data from all connected providers
        const results = {};
        
        for (const cred of credentials) {
            if (!cred.is_active) continue;
            
            try {
                // Check if token needs refresh
                const tokens = await ensureValidToken(cred);
                
                // Fetch data based on provider
                const data = await fetchProviderData(cred.provider, tokens.access_token);
                results[cred.provider] = {
                    success: true,
                    data: data,
                    synced_at: new Date().toISOString()
                };
                
                // Save to Supabase
                await saveBiometricData(athlete_id, cred.provider, data);
                
            } catch (providerError) {
                console.error(`Error syncing ${cred.provider}:`, providerError);
                results[cred.provider] = {
                    success: false,
                    error: providerError.message
                };
            }
        }
        
        // Calculate unified readiness from all sources
        const unifiedReadiness = calculateUnifiedReadiness(results);
        
        return res.json({
            success: true,
            athlete_id,
            providers: results,
            readiness: unifiedReadiness
        });
        
    } catch (error) {
        console.error('Sync Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

// Get credentials from Supabase
async function getCredentials(athleteId, provider = null) {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    let url = `${SUPABASE_URL}/rest/v1/athlete_wearables?athlete_id=eq.${athleteId}`;
    if (provider) {
        url += `&provider=eq.${provider}`;
    }
    
    const response = await fetch(url, {
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
    });
    
    return await response.json();
}

// Ensure token is valid, refresh if needed
async function ensureValidToken(credential) {
    const creds = credential.credentials;
    const expiresAt = new Date(creds.expires_at);
    
    // Refresh if expires in less than 5 minutes
    if (expiresAt <= new Date(Date.now() + 5 * 60 * 1000)) {
        return await refreshToken(credential.provider, creds.refresh_token, credential.athlete_id);
    }
    
    return creds;
}

// Refresh token for provider
async function refreshToken(provider, refreshToken, athleteId) {
    const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/wearables/${provider}-auth?action=refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken, athlete_id: athleteId })
    });
    
    if (!response.ok) {
        throw new Error(`Failed to refresh ${provider} token`);
    }
    
    // Get updated credentials
    const creds = await getCredentials(athleteId, provider);
    return creds[0]?.credentials;
}

// Fetch data from specific provider
async function fetchProviderData(provider, accessToken) {
    switch (provider) {
        case 'whoop':
            return await fetchWhoopData(accessToken);
        case 'oura':
            return await fetchOuraData(accessToken);
        case 'garmin':
            return await fetchGarminData(accessToken);
        default:
            throw new Error(`Unknown provider: ${provider}`);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// WHOOP API
// ═══════════════════════════════════════════════════════════════════════════

async function fetchWhoopData(accessToken) {
    const headers = { 'Authorization': `Bearer ${accessToken}` };
    const baseUrl = 'https://api.prod.whoop.com/developer/v1';
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Fetch recovery (most important for readiness)
    const recoveryRes = await fetch(`${baseUrl}/recovery?start=${yesterday}&end=${today}`, { headers });
    const recoveryData = recoveryRes.ok ? await recoveryRes.json() : null;
    
    // Fetch sleep
    const sleepRes = await fetch(`${baseUrl}/sleep?start=${yesterday}&end=${today}`, { headers });
    const sleepData = sleepRes.ok ? await sleepRes.json() : null;
    
    // Fetch workout/strain
    const workoutRes = await fetch(`${baseUrl}/workout?start=${yesterday}&end=${today}`, { headers });
    const workoutData = workoutRes.ok ? await workoutRes.json() : null;
    
    // Get latest records
    const latestRecovery = recoveryData?.records?.[0];
    const latestSleep = sleepData?.records?.[0];
    
    return {
        provider: 'whoop',
        timestamp: new Date().toISOString(),
        metrics: {
            // Recovery
            recovery_score: latestRecovery?.score?.recovery_score,
            hrv_rmssd: latestRecovery?.score?.hrv_rmssd_milli,
            resting_heart_rate: latestRecovery?.score?.resting_heart_rate,
            
            // Sleep
            sleep_duration_minutes: latestSleep?.score?.stage_summary?.total_in_bed_time_milli / 60000,
            sleep_score: latestSleep?.score?.sleep_performance_percentage,
            sleep_efficiency: latestSleep?.score?.sleep_efficiency_percentage,
            sleep_deep_minutes: latestSleep?.score?.stage_summary?.total_slow_wave_sleep_time_milli / 60000,
            sleep_rem_minutes: latestSleep?.score?.stage_summary?.total_rem_sleep_time_milli / 60000,
            sleep_light_minutes: latestSleep?.score?.stage_summary?.total_light_sleep_time_milli / 60000,
            
            // Strain (from yesterday's workouts)
            strain: workoutData?.records?.reduce((sum, w) => sum + (w.score?.strain || 0), 0) || 0,
            
            // Raw data for debugging
            _raw: { recovery: latestRecovery, sleep: latestSleep }
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// OURA API
// ═══════════════════════════════════════════════════════════════════════════

async function fetchOuraData(accessToken) {
    const headers = { 'Authorization': `Bearer ${accessToken}` };
    const baseUrl = 'https://api.ouraring.com/v2/usercollection';
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Fetch daily readiness
    const readinessRes = await fetch(`${baseUrl}/daily_readiness?start_date=${yesterday}&end_date=${today}`, { headers });
    const readinessData = readinessRes.ok ? await readinessRes.json() : null;
    
    // Fetch sleep
    const sleepRes = await fetch(`${baseUrl}/daily_sleep?start_date=${yesterday}&end_date=${today}`, { headers });
    const sleepData = sleepRes.ok ? await sleepRes.json() : null;
    
    // Fetch heart rate
    const hrRes = await fetch(`${baseUrl}/heartrate?start_datetime=${yesterday}T00:00:00Z&end_datetime=${today}T23:59:59Z`, { headers });
    const hrData = hrRes.ok ? await hrRes.json() : null;
    
    const latestReadiness = readinessData?.data?.[0];
    const latestSleep = sleepData?.data?.[0];
    
    // Calculate average HR from samples
    const hrSamples = hrData?.data || [];
    const avgHR = hrSamples.length > 0 
        ? hrSamples.reduce((sum, s) => sum + s.bpm, 0) / hrSamples.length 
        : null;
    
    return {
        provider: 'oura',
        timestamp: new Date().toISOString(),
        metrics: {
            // Readiness
            readiness_score: latestReadiness?.score,
            hrv_balance_score: latestReadiness?.contributors?.hrv_balance,
            recovery_index: latestReadiness?.contributors?.recovery_index,
            
            // Heart Rate
            resting_heart_rate: latestSleep?.contributors?.resting_heart_rate || avgHR,
            hrv_rmssd: latestReadiness?.contributors?.hrv_balance, // Oura uses a different metric
            
            // Sleep
            sleep_score: latestSleep?.score,
            sleep_duration_minutes: latestSleep?.contributors?.total_sleep,
            sleep_efficiency: latestSleep?.contributors?.efficiency,
            sleep_deep_percentage: latestSleep?.contributors?.deep_sleep,
            sleep_rem_percentage: latestSleep?.contributors?.rem_sleep,
            
            _raw: { readiness: latestReadiness, sleep: latestSleep }
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// GARMIN API
// ═══════════════════════════════════════════════════════════════════════════

async function fetchGarminData(accessToken) {
    const headers = { 'Authorization': `Bearer ${accessToken}` };
    const baseUrl = 'https://apis.garmin.com';
    
    const today = new Date().toISOString().split('T')[0];
    
    // Note: Garmin Health API requires specific endpoints
    // These are examples - actual endpoints may vary
    
    // Fetch daily summary
    const dailyRes = await fetch(`${baseUrl}/wellness-api/rest/dailies?date=${today}`, { headers });
    const dailyData = dailyRes.ok ? await dailyRes.json() : null;
    
    // Fetch sleep
    const sleepRes = await fetch(`${baseUrl}/wellness-api/rest/sleeps?date=${today}`, { headers });
    const sleepData = sleepRes.ok ? await sleepRes.json() : null;
    
    // Fetch stress
    const stressRes = await fetch(`${baseUrl}/wellness-api/rest/stress?date=${today}`, { headers });
    const stressData = stressRes.ok ? await stressRes.json() : null;
    
    const daily = dailyData?.[0];
    const sleep = sleepData?.[0];
    
    return {
        provider: 'garmin',
        timestamp: new Date().toISOString(),
        metrics: {
            // Heart Rate
            resting_heart_rate: daily?.restingHeartRateInBeatsPerMinute,
            max_heart_rate: daily?.maxHeartRateInBeatsPerMinute,
            avg_heart_rate: daily?.averageHeartRateInBeatsPerMinute,
            
            // HRV
            hrv_rmssd: daily?.hrvStatus?.hrvValue,
            hrv_status: daily?.hrvStatus?.status, // 'BALANCED', 'LOW', 'UNBALANCED'
            
            // Sleep
            sleep_duration_minutes: sleep?.durationInSeconds ? sleep.durationInSeconds / 60 : null,
            sleep_score: sleep?.overallSleepScore,
            sleep_deep_minutes: sleep?.deepSleepDurationInSeconds ? sleep.deepSleepDurationInSeconds / 60 : null,
            sleep_light_minutes: sleep?.lightSleepDurationInSeconds ? sleep.lightSleepDurationInSeconds / 60 : null,
            sleep_rem_minutes: sleep?.remSleepInSeconds ? sleep.remSleepInSeconds / 60 : null,
            sleep_awake_minutes: sleep?.awakeDurationInSeconds ? sleep.awakeDurationInSeconds / 60 : null,
            
            // Activity
            steps: daily?.steps,
            calories_total: daily?.totalKilocalories,
            active_minutes: daily?.moderateIntensityDurationInSeconds ? daily.moderateIntensityDurationInSeconds / 60 : 0,
            
            // Stress/Recovery
            stress_score: stressData?.averageStressLevel,
            body_battery_high: daily?.bodyBatteryChargedValue,
            body_battery_low: daily?.bodyBatteryDrainedValue,
            
            _raw: { daily, sleep, stress: stressData }
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED READINESS CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

function calculateUnifiedReadiness(providerResults) {
    const allMetrics = {};
    
    // Merge metrics from all providers
    for (const [provider, result] of Object.entries(providerResults)) {
        if (result.success && result.data?.metrics) {
            Object.assign(allMetrics, result.data.metrics);
        }
    }
    
    // Calculate component scores
    const factors = {};
    let totalScore = 0;
    let totalWeight = 0;
    
    // HRV (weight: 30%)
    if (allMetrics.hrv_rmssd) {
        const hrvScore = normalizeHRV(allMetrics.hrv_rmssd);
        factors.hrv = { value: allMetrics.hrv_rmssd, score: hrvScore, weight: 30 };
        totalScore += hrvScore * 30;
        totalWeight += 30;
    }
    
    // Resting HR (weight: 15%)
    if (allMetrics.resting_heart_rate) {
        const hrScore = normalizeRestingHR(allMetrics.resting_heart_rate);
        factors.resting_hr = { value: allMetrics.resting_heart_rate, score: hrScore, weight: 15 };
        totalScore += hrScore * 15;
        totalWeight += 15;
    }
    
    // Sleep Duration (weight: 25%)
    if (allMetrics.sleep_duration_minutes) {
        const sleepScore = normalizeSleepDuration(allMetrics.sleep_duration_minutes);
        factors.sleep_duration = { value: allMetrics.sleep_duration_minutes, score: sleepScore, weight: 25 };
        totalScore += sleepScore * 25;
        totalWeight += 25;
    }
    
    // Recovery Score (weight: 20%) - from WHOOP/Oura
    if (allMetrics.recovery_score || allMetrics.readiness_score) {
        const recoveryScore = allMetrics.recovery_score || allMetrics.readiness_score;
        factors.recovery = { value: recoveryScore, score: recoveryScore, weight: 20 };
        totalScore += recoveryScore * 20;
        totalWeight += 20;
    }
    
    // Strain/Stress (weight: 10%) - inverse
    if (allMetrics.strain !== undefined) {
        const strainScore = Math.max(0, 100 - allMetrics.strain * 5);
        factors.strain = { value: allMetrics.strain, score: strainScore, weight: 10 };
        totalScore += strainScore * 10;
        totalWeight += 10;
    }
    
    const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : null;
    
    return {
        score: finalScore,
        factors: factors,
        recommendation: getReadinessRecommendation(finalScore),
        sources: Object.keys(providerResults).filter(p => providerResults[p].success)
    };
}

function normalizeHRV(hrv) {
    if (hrv >= 60) return 100;
    if (hrv >= 50) return 85;
    if (hrv >= 40) return 70;
    if (hrv >= 30) return 50;
    if (hrv >= 20) return 30;
    return 15;
}

function normalizeRestingHR(hr) {
    if (hr <= 50) return 100;
    if (hr <= 55) return 90;
    if (hr <= 60) return 80;
    if (hr <= 65) return 65;
    if (hr <= 70) return 50;
    return 35;
}

function normalizeSleepDuration(minutes) {
    const hours = minutes / 60;
    if (hours >= 8) return 100;
    if (hours >= 7.5) return 90;
    if (hours >= 7) return 80;
    if (hours >= 6.5) return 65;
    if (hours >= 6) return 50;
    return 30;
}

function getReadinessRecommendation(score) {
    if (!score) return { status: 'unknown', message: 'Insufficient data' };
    
    if (score >= 80) return { 
        status: 'optimal', 
        message: 'Go hard! Ready for intense training',
        intensity_modifier: 1.1,
        emoji: '🚀'
    };
    if (score >= 65) return { 
        status: 'good', 
        message: 'Good to go - standard training',
        intensity_modifier: 1.0,
        emoji: '💪'
    };
    if (score >= 50) return { 
        status: 'moderate', 
        message: 'Reduced intensity recommended',
        intensity_modifier: 0.85,
        emoji: '👍'
    };
    if (score >= 35) return { 
        status: 'low', 
        message: 'Light activity or active recovery',
        intensity_modifier: 0.7,
        emoji: '🧘'
    };
    return { 
        status: 'critical', 
        message: 'Rest day strongly recommended',
        intensity_modifier: 0.5,
        emoji: '😴'
    };
}

// Save biometric data to Supabase
async function saveBiometricData(athleteId, provider, data) {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    // Save to biometric_history table
    await fetch(`${SUPABASE_URL}/rest/v1/biometric_history`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            athlete_id: athleteId,
            provider: provider,
            metrics: data.metrics,
            recorded_at: data.timestamp
        })
    });
    
    // Update athlete's current biometric state
    await fetch(`${SUPABASE_URL}/rest/v1/athletes?id=eq.${athleteId}`, {
        method: 'PATCH',
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            biometric_data: data.metrics,
            biometric_updated_at: data.timestamp,
            biometric_provider: provider
        })
    });
}
