// Supabase Client
const SUPABASE_URL = 'https://unkzjnlrorluzfahmize.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVua3pqbmxyb3JsdXpmYWhtaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3OTQ3MTIsImV4cCI6MjA4MTM3MDcxMn0.c1utLN0YO2k6K-8cFokp7LaTD2ND6Mb0l2BxeFW4oxM';

const supabase = {
    async fetch(table, query = '') {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            const data = await res.json();
            if (!res.ok) {
                console.error(`Supabase fetch error for ${table}:`, data);
                return [];
            }
            return data;
        } catch (e) {
            console.error(`Supabase fetch exception for ${table}:`, e);
            return [];
        }
    },
    
    async insert(table, data) {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (!res.ok) {
                console.error(`Supabase insert error for ${table}:`, result);
                return { error: true, message: result.message || result.error || 'Insert failed', details: result };
            }
            console.log(`Supabase insert success for ${table}:`, result);
            return result;
        } catch (e) {
            console.error(`Supabase insert exception for ${table}:`, e);
            return { error: true, message: e.message };
        }
    },
    
    async update(table, id, data) {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (!res.ok) {
                console.error(`Supabase update error for ${table}:`, result);
                return { error: true, message: result.message || result.error || 'Update failed' };
            }
            return result;
        } catch (e) {
            console.error(`Supabase update exception for ${table}:`, e);
            return { error: true, message: e.message };
        }
    },

    async delete(table, query) {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            return res.ok;
        } catch (e) {
            console.error(`Supabase delete exception for ${table}:`, e);
            return false;
        }
    }
};

window.supabase = supabase;
