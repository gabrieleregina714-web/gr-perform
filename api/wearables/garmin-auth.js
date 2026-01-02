/**
 * GR Perform - Garmin OAuth Flow
 * Vercel Serverless Function
 * 
 * Endpoint: /api/wearables/garmin-auth
 * 
 * Flow:
 * 1. GET ?action=authorize → Redirect to Garmin OAuth
 * 2. GET ?action=callback&code=XXX → Exchange code for tokens
 * 3. POST { action: 'refresh', refresh_token: 'XXX' } → Refresh tokens
 */

// Note: Garmin uses OAuth 1.0a, which is more complex
// For simplicity, we'll document the OAuth 2.0 flow that newer Garmin APIs support

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { action, code, state, athlete_id } = req.query;
    
    // Environment variables (set in Vercel dashboard)
    const CLIENT_ID = process.env.GARMIN_CLIENT_ID;
    const CLIENT_SECRET = process.env.GARMIN_CLIENT_SECRET;
    const REDIRECT_URI = process.env.GARMIN_REDIRECT_URI || `${process.env.VERCEL_URL}/api/wearables/garmin-auth?action=callback`;
    
    if (!CLIENT_ID || !CLIENT_SECRET) {
        return res.status(500).json({ 
            error: 'Garmin OAuth not configured',
            message: 'Set GARMIN_CLIENT_ID and GARMIN_CLIENT_SECRET in environment'
        });
    }

    try {
        switch (action) {
            case 'authorize':
                return handleAuthorize(req, res, CLIENT_ID, REDIRECT_URI);
            
            case 'callback':
                return handleCallback(req, res, code, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
            
            case 'refresh':
                return handleRefresh(req, res, CLIENT_ID, CLIENT_SECRET);
            
            default:
                return res.status(400).json({ error: 'Invalid action', valid: ['authorize', 'callback', 'refresh'] });
        }
    } catch (error) {
        console.error('Garmin OAuth Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

// Step 1: Redirect to Garmin authorization
function handleAuthorize(req, res, clientId, redirectUri) {
    const state = generateState();
    const athleteId = req.query.athlete_id || '';
    
    // Garmin Connect OAuth 2.0 URL (for Health API)
    const authUrl = new URL('https://connect.garmin.com/oauthConfirm');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'activity health sleep stress');
    authUrl.searchParams.set('state', `${state}:${athleteId}`);
    
    // Store state for validation (in production use Redis or DB)
    // For now, include athlete_id in state
    
    return res.redirect(302, authUrl.toString());
}

// Step 2: Exchange authorization code for tokens
async function handleCallback(req, res, code, clientId, clientSecret, redirectUri) {
    const state = req.query.state || '';
    const [savedState, athleteId] = state.split(':');
    
    // Exchange code for tokens
    const tokenUrl = 'https://connectapi.garmin.com/oauth-service/oauth/access_token';
    
    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri
        })
    });
    
    if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('Token exchange failed:', error);
        return res.redirect(`/app-wearables.html?error=token_exchange_failed&provider=garmin`);
    }
    
    const tokens = await tokenResponse.json();
    
    // Save tokens to Supabase
    if (athleteId) {
        await saveTokensToSupabase('garmin', athleteId, tokens);
    }
    
    // Redirect back to app with success
    return res.redirect(`/app-wearables.html?connected=garmin&athlete_id=${athleteId}`);
}

// Step 3: Refresh expired tokens
async function handleRefresh(req, res, clientId, clientSecret) {
    const { refresh_token, athlete_id } = req.body;
    
    if (!refresh_token) {
        return res.status(400).json({ error: 'refresh_token required' });
    }
    
    const tokenUrl = 'https://connectapi.garmin.com/oauth-service/oauth/access_token';
    
    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        })
    });
    
    if (!tokenResponse.ok) {
        return res.status(401).json({ error: 'Token refresh failed', reconnect: true });
    }
    
    const tokens = await tokenResponse.json();
    
    // Update tokens in Supabase
    if (athlete_id) {
        await saveTokensToSupabase('garmin', athlete_id, tokens);
    }
    
    return res.json({ success: true, expires_in: tokens.expires_in });
}

// Helper: Save tokens to Supabase
async function saveTokensToSupabase(provider, athleteId, tokens) {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        console.error('Supabase not configured');
        return;
    }
    
    const wearableData = {
        provider: provider,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + (tokens.expires_in || 3600) * 1000).toISOString(),
        connected_at: new Date().toISOString(),
        user_id: tokens.user_id || null
    };
    
    await fetch(`${SUPABASE_URL}/rest/v1/athlete_wearables`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
            athlete_id: athleteId,
            provider: provider,
            credentials: wearableData,
            is_active: true
        })
    });
}

// Helper: Generate random state for CSRF protection
function generateState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}
