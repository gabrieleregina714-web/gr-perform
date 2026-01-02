/**
 * GR Perform - Shopify Webhook Handler
 * Riceve ordini da Shopify e crea abbonamenti automaticamente
 * 
 * DEPLOY: Vercel Serverless Function o Cloudflare Workers
 * 
 * @version 1.0.0
 */

// ============================================
// CONFIGURAZIONE - MODIFICA QUESTI VALORI
// ============================================
const CONFIG = {
    // Supabase (le tue credenziali reali)
    SUPABASE_URL: 'https://unkzjnlrorluzfahmize.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVua3pqbmxyb3JsdXpmYWhtaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3OTQ3MTIsImV4cCI6MjA4MTM3MDcxMn0.c1utLN0YO2k6K-8cFokp7LaTD2ND6Mb0l2BxeFW4oxM',
    
    // Resend (email) - DEVI CREARE ACCOUNT SU resend.com
    RESEND_API_KEY: 're_iDKvDHA3_FXLXsy2AU9B8R92eSpuiwy9y',
    
    // Shopify - lo trovi in Shopify Admin > Settings > Notifications
    SHOPIFY_WEBHOOK_SECRET: 'your-webhook-secret',
    
    // App
    APP_URL: 'https://grfrperform.netlify.app',
    FROM_EMAIL: 'noreply@grperform.com'
};

// ============================================
// MAPPING PRODOTTI SHOPIFY → PIANI
// Modifica con i tuoi Product ID di Shopify
// ============================================
const PRODUCT_TO_PLAN = {
    // ID prodotto Shopify: tipo piano
    '1234567890': 'monthly',
    '1234567891': 'quarterly',
    '1234567892': 'yearly',
    // Puoi anche usare il titolo del prodotto
    'Abbonamento Mensile': 'monthly',
    'Abbonamento Trimestrale': 'quarterly',
    'Abbonamento Annuale': 'yearly',
    'Piano Mensile': 'monthly',
    'Piano Trimestrale': 'quarterly',
    'Piano Annuale': 'yearly'
};

// ============================================
// VERCEL SERVERLESS FUNCTION
// File: /api/shopify-webhook.js
// ============================================

export default async function handler(req, res) {
    // Solo POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Verifica firma webhook (sicurezza)
        const hmac = req.headers['x-shopify-hmac-sha256'];
        // In produzione: verifica la firma con crypto
        
        const order = req.body;
        
        console.log('📦 Nuovo ordine ricevuto:', order.id);

        // Estrai dati cliente
        const customer = order.customer || {};
        const email = order.email || customer.email;
        
        if (!email) {
            console.error('❌ Nessuna email trovata nell\'ordine');
            return res.status(400).json({ error: 'No email in order' });
        }

        // Determina tipo piano dal prodotto acquistato
        let planType = 'monthly'; // default
        
        for (const item of order.line_items || []) {
            const productId = String(item.product_id);
            const productTitle = item.title || '';
            
            if (PRODUCT_TO_PLAN[productId]) {
                planType = PRODUCT_TO_PLAN[productId];
                break;
            }
            
            // Cerca per titolo prodotto
            for (const [key, value] of Object.entries(PRODUCT_TO_PLAN)) {
                if (productTitle.toLowerCase().includes(key.toLowerCase())) {
                    planType = value;
                    break;
                }
            }
        }

        // Genera password
        const password = generatePassword(12);

        // Crea abbonamento in Supabase
        const subscription = await createSubscription({
            email: email.toLowerCase().trim(),
            firstName: customer.first_name || order.shipping_address?.first_name || '',
            lastName: customer.last_name || order.shipping_address?.last_name || '',
            phone: customer.phone || order.shipping_address?.phone || '',
            planType: planType,
            password: password,
            shopifyOrderId: String(order.id),
            shopifyCustomerId: customer.id ? String(customer.id) : null
        });

        if (!subscription.success) {
            // Potrebbe esistere già - prova a rinnovare
            if (subscription.error?.includes('duplicate')) {
                console.log('📧 Email già esiste, rinnovo abbonamento');
                await renewExistingSubscription(email, planType);
                return res.status(200).json({ message: 'Subscription renewed' });
            }
            
            throw new Error(subscription.error);
        }

        // Invia email con credenziali
        await sendWelcomeEmail({
            to: email,
            firstName: customer.first_name || 'Atleta',
            password: password,
            planType: planType,
            endDate: subscription.endDate
        });

        console.log('✅ Abbonamento creato e email inviata:', email);

        return res.status(200).json({ 
            success: true, 
            message: 'Subscription created',
            email: email
        });

    } catch (error) {
        console.error('❌ Errore webhook:', error);
        return res.status(500).json({ error: error.message });
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generatePassword(length = 12) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'gr_perform_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function calculateEndDate(planType) {
    const days = {
        'monthly': 30,
        'quarterly': 90,
        'yearly': 365,
        'trial': 7
    };
    
    const end = new Date();
    end.setDate(end.getDate() + (days[planType] || 30));
    return end;
}

async function createSubscription(data) {
    const passwordHash = await hashPassword(data.password);
    const endDate = calculateEndDate(data.planType);
    
    const subscriptionData = {
        email: data.email,
        password_hash: passwordHash,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        plan_type: data.planType,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: endDate.toISOString(),
        shopify_order_id: data.shopifyOrderId,
        shopify_customer_id: data.shopifyCustomerId
    };

    try {
        const response = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': CONFIG.SUPABASE_KEY,
                'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(subscriptionData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: errorText };
        }

        const result = await response.json();
        return { success: true, subscription: result, endDate: endDate };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function renewExistingSubscription(email, planType) {
    const endDate = calculateEndDate(planType);
    
    const response = await fetch(
        `${CONFIG.SUPABASE_URL}/rest/v1/subscriptions?email=eq.${email}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'apikey': CONFIG.SUPABASE_KEY,
                'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`
            },
            body: JSON.stringify({
                plan_type: planType,
                status: 'active',
                end_date: endDate.toISOString()
            })
        }
    );
    
    return response.ok;
}

async function sendWelcomeEmail({ to, firstName, password, planType, endDate }) {
    const planNames = {
        'monthly': 'Mensile',
        'quarterly': 'Trimestrale',
        'yearly': 'Annuale'
    };

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 40px 20px; }
        .container { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #E63946, #FF6B6B); padding: 40px; text-align: center; }
        .logo { color: white; font-size: 32px; font-weight: 900; letter-spacing: -1px; }
        .content { padding: 40px; }
        h1 { color: #1a1a1a; font-size: 24px; margin-bottom: 16px; }
        p { color: #666; line-height: 1.6; margin-bottom: 16px; }
        .credentials { background: #f8f8f8; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .credential-label { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .credential-value { color: #1a1a1a; font-size: 18px; font-weight: 600; font-family: monospace; margin-bottom: 16px; }
        .btn { display: inline-block; background: #E63946; color: white; text-decoration: none; padding: 16px 32px; border-radius: 10px; font-weight: 700; margin-top: 24px; }
        .footer { padding: 24px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">GRPerform</div>
        </div>
        <div class="content">
            <h1>Benvenuto ${firstName}! 🎉</h1>
            <p>Grazie per aver attivato il tuo abbonamento <strong>${planNames[planType] || planType}</strong>.</p>
            <p>Ecco le tue credenziali per accedere alla dashboard:</p>
            
            <div class="credentials">
                <div class="credential-label">Email</div>
                <div class="credential-value">${to}</div>
                
                <div class="credential-label">Password</div>
                <div class="credential-value">${password}</div>
                
                <div class="credential-label">Valido fino al</div>
                <div class="credential-value">${new Date(endDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
            
            <p>Conserva queste credenziali in un luogo sicuro. Potrai cambiare la password dopo il primo accesso.</p>
            
            <center>
                <a href="${CONFIG.APP_URL}/athlete-login.html" class="btn">Accedi Ora →</a>
            </center>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} GR Perform. Tutti i diritti riservati.</p>
            <p>Hai bisogno di aiuto? Rispondi a questa email.</p>
        </div>
    </div>
</body>
</html>
    `;

    // Invia con Resend
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.RESEND_API_KEY}`
        },
        body: JSON.stringify({
            from: CONFIG.FROM_EMAIL,
            to: to,
            subject: '🎉 Benvenuto in GR Perform - Le tue credenziali',
            html: emailHtml
        })
    });

    if (!response.ok) {
        console.error('Errore invio email:', await response.text());
        return false;
    }

    return true;
}

// ============================================
// CLOUDFLARE WORKERS VERSION
// Decommentare se usi Cloudflare invece di Vercel
// ============================================
/*
export default {
    async fetch(request, env) {
        if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        // Usa env.SUPABASE_URL, env.RESEND_API_KEY etc.
        CONFIG.SUPABASE_URL = env.SUPABASE_URL;
        CONFIG.SUPABASE_KEY = env.SUPABASE_KEY;
        CONFIG.RESEND_API_KEY = env.RESEND_API_KEY;

        const order = await request.json();
        
        // ... stesso codice di sopra ...

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
*/
