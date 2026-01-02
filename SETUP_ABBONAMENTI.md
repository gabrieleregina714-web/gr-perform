# 🔐 Setup Sistema Abbonamenti GR Perform

## ✅ FILE CREATI

| File | Descrizione |
|------|-------------|
| `js/subscription-manager.js` | Gestione abbonamenti lato client |
| `athlete-login.html` | Login atleta con verifica abbonamento |
| `coach-subscriptions.html` | Pannello coach per gestire abbonamenti |
| `api/shopify-webhook.js` | Webhook per creare abbonamenti automatici |

---

## STEP 1: Crea Tabella in Supabase

1. Vai su https://supabase.com e accedi al tuo progetto
2. Clicca su **SQL Editor** (icona terminale a sinistra)
3. Copia e incolla questo codice:

```sql
-- Tabella Abbonamenti
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    
    -- Info abbonamento
    plan_type VARCHAR(50) DEFAULT 'monthly',  -- monthly, quarterly, yearly
    status VARCHAR(20) DEFAULT 'active',       -- active, expired, cancelled, pending
    
    -- Date
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    
    -- Shopify
    shopify_order_id VARCHAR(100),
    shopify_customer_id VARCHAR(100),
    
    -- Collegamento atleta
    athlete_id UUID REFERENCES athletes(id),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0
);

-- Indici per performance
CREATE INDEX idx_subscriptions_email ON subscriptions(email);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);

-- Tabella per log accessi
CREATE TABLE IF NOT EXISTS subscription_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_id UUID REFERENCES subscriptions(id),
    action VARCHAR(50),  -- login, logout, renewed, expired, created
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Funzione per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

4. Clicca **Run** (pulsante verde)
5. Dovresti vedere "Success"

---

## STEP 2: Configura Resend (per email)

1. Vai su https://resend.com
2. Crea account gratuito
3. Vai su **API Keys** → **Create API Key**
4. Copia la chiave (inizia con `re_...`)
5. Salva questa chiave, ti servirà dopo

---

## STEP 3: Configura Webhook Shopify

1. Vai nel tuo admin Shopify
2. **Settings** → **Notifications** → **Webhooks**
3. Clicca **Create webhook**
4. Evento: `Order payment` 
5. URL: (te lo darò dopo che deployamo)
6. Formato: JSON

---

## STEP 4: Deploy su Vercel (Gratis)

1. Vai su https://vercel.com
2. Crea account con GitHub
3. Importa il progetto
4. Aggiungi variabili ambiente:
   - `RESEND_API_KEY` = la tua chiave Resend
   - `SUPABASE_URL` = il tuo URL Supabase
   - `SUPABASE_KEY` = la tua chiave Supabase
   - `SHOPIFY_WEBHOOK_SECRET` = (lo trovi in Shopify)

---

## Durata Abbonamenti

| Piano | Codice | Durata |
|-------|--------|--------|
| Mensile | `monthly` | 30 giorni |
| Trimestrale | `quarterly` | 90 giorni |
| Annuale | `yearly` | 365 giorni |

---

## Flusso Automatico

1. ✅ Cliente compra su Shopify
2. ✅ Shopify invia webhook al tuo server
3. ✅ Server crea account in Supabase
4. ✅ Server genera password casuale
5. ✅ Server invia email con credenziali
6. ✅ Cliente fa login nella dashboard
7. ✅ Sistema controlla scadenza ad ogni accesso
8. ✅ Se scaduto → redirect a pagina rinnovo

