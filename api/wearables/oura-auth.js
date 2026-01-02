/**
 * GR Perform - Oura Ring OAuth Flow
 * Vercel Serverless Function
 * 
 * Endpoint: /api/wearables/oura-auth
 * 
 * Oura uses OAuth 2.0
 * Docs: https://cloud.ouraring.com/docs/authentication
 */

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { action, code, state } = req.query;
    
    // Environment variables
    const CLIENT_ID = process.env.OURA_CLIENT_ID;
    const CLIENT_SECRET = process.env.OURA_CLIENT_SECRET;
    const REDIRECT_URI = process.env.OURA_REDIRECT_URI || `${getBaseUrl(req)}/api/wearables/oura-auth?action=callback`;
    
    if (!CLIENT_ID || !CLIENT_SECRET) {
        return res.status(500).json({ 
            error: 'Oura OAuth not configured',
            message: 'Set OURA_CLIENT_ID and OURA_CLIENT_SECRET in environment'
        });
    }

    try {
        switch (action) {
            case 'authorize':
                return handleAuthorize(req, res, CLIENT_ID, REDIRECT_URI);
            
            case 'callback':
                return handleCallback(req, res, code, state, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
            
            case 'refresh':
                return handleRefresh(req, res, CLIENT_ID, CLIENT_SECRET);
            
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('Oura OAuth Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

function getBaseUrl(req) {
    const host = req.headers.host;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
}

// Step 1: Redirect to Oura authorization
function handleAuthorize(req, res, clientId, redirectUri) {
    const state = generateState();
    const athleteId = req.query.athlete_id || '';
    
    // Oura OAuth 2.0 URL
    const authUrl = new URL('https://cloud.ouraring.com/oauth/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'daily sleep workout heartrate personal');
    authUrl.searchParams.set('state', `${state}:${athleteId}`);
    
    return res.redirect(302, authUrl.toString());
}

// Step 2: Exchange authorization code for tokens
async function handleCallback(req, res, code, state, clientId, clientSecret, redirectUri) {
    const [savedState, athleteId] = (state || '').split(':');
    
    const tokenUrl = 'https://api.ouraring.com/oauth/token';
    
    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri
        })
    });
    
    if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('Oura Token exchange failed:', error);
        return res.redirect(`/app-wearables.html?error=token_exchange_failed&provider=oura`);
    }
    
    const tokens = await tokenResponse.json();
    
    // Save tokens to Supabase
    if (athleteId) {
        await saveTokensToSupabase('oura', athleteId, tokens);
    }
    
    return res.redirect(`/app-wearables.html?connected=oura&athlete_id=${athleteId}`);
}

// Step 3: Refresh expired tokens
async function handleRefresh(req, res, clientId, clientSecret) {
    const { refresh_token, athlete_id } = req.body;
    
    if (!refresh_token) {
        return res.status(400).json({ error: 'refresh_token required' });
    }
    
    const tokenUrl = 'https://api.ouraring.com/oauth/token';
    
    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refresh_token
        })
    });
    
    if (!tokenResponse.ok) {
        return res.status(401).json({ error: 'Token refresh failed', reconnect: true });
    }
    
    const tokens = await tokenResponse.json();
    
    if (athlete_id) {
        await saveTokensToSupabase('oura', athlete_id, tokens);
    }
    
    return res.json({ success: true, expires_in: tokens.expires_in });
}

// Save tokens to Supabase
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
        expires_at: new Date(Date.now() + (tokens.expires_in || 86400) * 1000).toISOString(),
        connected_at: new Date().toISOString()
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

function generateState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}
