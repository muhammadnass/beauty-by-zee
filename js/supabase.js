// ===== Beauty by Zee — Supabase Price Manager =====
//
// SETUP INSTRUCTIONS:
// 1. Go to https://supabase.com and create a free account
// 2. Create a new project (free tier is enough)
// 3. In the SQL Editor, run this to create the prices table:
//
//    CREATE TABLE prices (
//      id INTEGER PRIMARY KEY,
//      price NUMERIC DEFAULT 0,
//      updated_at TIMESTAMPTZ DEFAULT NOW()
//    );
//    ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
//    CREATE POLICY "Public read" ON prices FOR SELECT USING (true);
//    CREATE POLICY "Admin write" ON prices FOR ALL USING (true);
//
// 4. Go to Project Settings → API and copy your URL and anon key below
//

const SUPABASE_URL = '';    // e.g. 'https://xxxx.supabase.co'
const SUPABASE_KEY = '';    // your anon/public key

// ---- Internal ----
let _client = null;

function getClient() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  if (_client) return _client;
  // Load Supabase JS from CDN if not already loaded
  return _client;
}

const SupabaseManager = {
  isConfigured() {
    return !!(SUPABASE_URL && SUPABASE_KEY);
  },

  async loadPrices() {
    if (!this.isConfigured()) {
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem('bbz_prices') || '{}');
    }
    try {
      const { createClient } = window.supabase;
      const client = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data, error } = await client.from('prices').select('id, price');
      if (error) throw error;
      const prices = {};
      data.forEach(row => { prices[row.id] = row.price; });
      // Also cache locally as fallback
      localStorage.setItem('bbz_prices', JSON.stringify(prices));
      return prices;
    } catch (err) {
      console.warn('Supabase unavailable, using local cache:', err.message);
      return JSON.parse(localStorage.getItem('bbz_prices') || '{}');
    }
  },

  async savePrices(pricesObj) {
    // Always save to localStorage as fallback
    localStorage.setItem('bbz_prices', JSON.stringify(pricesObj));

    if (!this.isConfigured()) return { ok: false, msg: 'Supabase not configured — saved locally only.' };

    try {
      const { createClient } = window.supabase;
      const client = createClient(SUPABASE_URL, SUPABASE_KEY);
      const rows = Object.entries(pricesObj).map(([id, price]) => ({
        id: parseInt(id), price: parseFloat(price) || 0, updated_at: new Date().toISOString()
      }));
      const { error } = await client.from('prices').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
      return { ok: true, msg: 'Prices saved to Supabase — visible to all customers!' };
    } catch (err) {
      return { ok: false, msg: `Saved locally (Supabase error: ${err.message})` };
    }
  }
};

if (typeof module !== 'undefined') module.exports = SupabaseManager;
