// Supabase Client
const SUPABASE_URL = 'https://unkzjnlrorluzfahmize.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVua3pqbmxyb3JsdXpmYWhtaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3OTQ3MTIsImV4cCI6MjA4MTM3MDcxMn0.c1utLN0YO2k6K-8cFokp7LaTD2ND6Mb0l2BxeFW4oxM';

const supabase = {
    async fetch(table, query = '') {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        return res.json();
    },
    
    async insert(table, data) {
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
        return res.json();
    },
    
    async update(table, id, data) {
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
        return res.json();
    }
};

window.supabase = supabase;
