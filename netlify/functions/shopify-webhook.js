/**
 * GR Perform - Shopify Webhook Handler
 * Netlify Function
 * 
 * URL: https://grfrperform.netlify.app/.netlify/functions/shopify-webhook
 */

// Configurazione
const CONFIG = {
    SUPABASE_URL: 'https://unkzjnlrorluzfahmize.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVua3pqbmxyb3JsdXpmYWhtaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3OTQ3MTIsImV4cCI6MjA4MTM3MDcxMn0.c1utLN0YO2k6K-8cFokp7LaTD2ND6Mb0l2BxeFW4oxM',
    RESEND_API_KEY: 're_iDKvDHA3_FXLXsy2AU9B8R92eSpuiwy9y',
    APP_URL: 'https://grfrperform.netlify.app',
    FROM_EMAIL: 'onboarding@resend.dev' // Usa questo finché non verifichi un dominio
};

// Mapping prodotti Shopify → piani
const PRODUCT_TO_PLAN = {
    'Abbonamento Mensile': 'monthly',
    'Abbonamento Trimestrale': 'quarterly',
    'Abbonamento Annuale': 'yearly',
    'Piano Mensile': 'monthly',
    'Piano Trimestrale': 'quarterly',
    'Piano Annuale': 'yearly',
    'Monthly': 'monthly',
    'Quarterly': 'quarterly',
    'Yearly': 'yearly'
};

const PLAN_DURATIONS = {
    'monthly': 30,
    'quarterly': 90,
    'yearly': 365
};

// Hash password
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'gr_perform_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Genera password
function generatePassword(length = 10) {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Supabase fetch
async function supabaseFetch(endpoint, options = {}) {
    const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/${endpoint}`, {
        ...options,
        headers: {
            'apikey': CONFIG.SUPABASE_KEY,
            'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            ...options.headers
        }
    });
    return res.json();
}

// Invia email con Resend
async function sendEmail(to, subject, html) {
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CONFIG.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: CONFIG.FROM_EMAIL,
            to: to,
            subject: subject,
            html: html
        })
    });
    return res.json();
}

// Handler principale
exports.handler = async (event, context) => {
    // Solo POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const order = JSON.parse(event.body);
        
        console.log('📦 Ordine ricevuto:', order.id);

        // Estrai dati cliente
        const customer = order.customer || {};
        const email = (order.email || customer.email || '').toLowerCase().trim();
        
        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No email in order' })
            };
        }

        // Determina tipo piano
        let planType = 'monthly';
        for (const item of order.line_items || []) {
            const title = item.title || '';
            const productId = String(item.product_id);
            
            if (PRODUCT_TO_PLAN[title]) {
                planType = PRODUCT_TO_PLAN[title];
                break;
            }
            if (PRODUCT_TO_PLAN[productId]) {
                planType = PRODUCT_TO_PLAN[productId];
                break;
            }
        }

        // Verifica se esiste già
        const existing = await supabaseFetch(`subscriptions?email=eq.${encodeURIComponent(email)}`);
        
        let password = generatePassword();
        let isRenewal = false;

        if (existing && existing.length > 0) {
            // Rinnovo - estendi abbonamento esistente
            isRenewal = true;
            const sub = existing[0];
            const currentEnd = new Date(sub.end_date);
            const now = new Date();
            const startFrom = currentEnd > now ? currentEnd : now;
            const newEnd = new Date(startFrom);
            newEnd.setDate(newEnd.getDate() + PLAN_DURATIONS[planType]);

            await supabaseFetch(`subscriptions?id=eq.${sub.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    end_date: newEnd.toISOString(),
                    status: 'active',
                    plan_type: planType,
                    shopify_order_id: String(order.id)
                })
            });

            console.log('🔄 Abbonamento rinnovato:', email);
        } else {
            // Nuovo abbonamento
            const passwordHash = await hashPassword(password);
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + PLAN_DURATIONS[planType]);

            await supabaseFetch('subscriptions', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password_hash: passwordHash,
                    first_name: customer.first_name || order.billing_address?.first_name || '',
                    last_name: customer.last_name || order.billing_address?.last_name || '',
                    phone: customer.phone || order.billing_address?.phone || '',
                    plan_type: planType,
                    status: 'active',
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    shopify_order_id: String(order.id),
                    shopify_customer_id: customer.id ? String(customer.id) : null
                })
            });

            console.log('✅ Nuovo abbonamento creato:', email);
        }

        // Invia email
        const firstName = customer.first_name || 'Atleta';
        const planNames = { monthly: 'Mensile', quarterly: 'Trimestrale', yearly: 'Annuale' };

        const emailHtml = isRenewal ? `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #000; padding: 30px; text-align: center;">
                    <h1 style="color: #E63946; margin: 0;">GR PERFORM</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <h2 style="color: #333;">Abbonamento Rinnovato! 🔄</h2>
                    <p>Ciao ${firstName},</p>
                    <p>Il tuo abbonamento <strong>${planNames[planType]}</strong> è stato rinnovato con successo!</p>
                    <p>Puoi continuare ad accedere con le tue credenziali esistenti:</p>
                    <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>🔗 App:</strong> <a href="${CONFIG.APP_URL}/login.html">${CONFIG.APP_URL}</a></p>
                    </div>
                    <p>Buon allenamento! 💪</p>
                </div>
            </div>
        ` : `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #000; padding: 30px; text-align: center;">
                    <h1 style="color: #E63946; margin: 0;">GR PERFORM</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <h2 style="color: #333;">Benvenuto in GR Perform! 🎉</h2>
                    <p>Ciao ${firstName},</p>
                    <p>Il tuo abbonamento <strong>${planNames[planType]}</strong> è stato attivato!</p>
                    <p>Ecco le tue credenziali di accesso:</p>
                    <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #E63946;">
                        <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${email}</p>
                        <p style="margin: 5px 0;"><strong>🔑 Password:</strong> ${password}</p>
                    </div>
                    <a href="${CONFIG.APP_URL}/login.html" style="display: inline-block; background: #E63946; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                        ACCEDI ORA →
                    </a>
                    <p style="margin-top: 30px; color: #666; font-size: 14px;">
                        Conserva questa email. Per assistenza: support@grperform.com
                    </p>
                </div>
            </div>
        `;

        await sendEmail(
            email,
            isRenewal ? '🔄 Abbonamento Rinnovato - GR Perform' : '🎉 Benvenuto in GR Perform!',
            emailHtml
        );

        console.log('📧 Email inviata a:', email);

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true, 
                email: email,
                plan: planType,
                renewal: isRenewal
            })
        };

    } catch (error) {
        console.error('❌ Errore webhook:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
