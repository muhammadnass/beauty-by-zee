// ===== Beauty by Zee — Price Sync via JSONBin.io =====
// Free alternative to Supabase — no project limits
// Setup: https://jsonbin.io → Sign up free → Create Bin → paste IDs below

const JSONBIN_BIN_ID  = '';   // e.g. '6748abc123def456789'
const JSONBIN_API_KEY = '';   // e.g. '$2a$10$...'

// =====================================================

const SupabaseManager = {

  isConfigured() {
    return JSONBIN_BIN_ID.trim() !== '' && JSONBIN_API_KEY.trim() !== '';
  },

  async loadPrices() {
    // Try JSONBin first if configured
    if (this.isConfigured()) {
      try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
          headers: {
            'X-Master-Key': JSONBIN_API_KEY,
            'X-Bin-Meta': 'false'
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Cache locally as fallback
          try { localStorage.setItem('bbz_prices', JSON.stringify(data)); } catch {}
          return data;
        }
      } catch (e) {
        console.warn('JSONBin fetch failed, using local cache', e);
      }
    }

    // Fallback to localStorage
    try {
      const local = localStorage.getItem('bbz_prices');
      if (local) return JSON.parse(local);
    } catch {}
    return {};
  },

  async savePrices(pricesObj) {
    // Always save to localStorage
    try { localStorage.setItem('bbz_prices', JSON.stringify(pricesObj)); } catch {}

    if (!this.isConfigured()) {
      return { ok: true, msg: 'Prices saved locally. Set up JSONBin for global sync.' };
    }

    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY
        },
        body: JSON.stringify(pricesObj)
      });

      if (res.ok) {
        return { ok: true, msg: 'Prices saved and synced to all customers! ✅' };
      } else {
        return { ok: false, msg: 'Cloud sync failed — prices saved locally only.' };
      }
    } catch (e) {
      return { ok: false, msg: 'Network error — prices saved locally only.' };
    }
  }
};
