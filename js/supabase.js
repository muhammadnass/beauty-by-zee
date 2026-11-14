// ===== Beauty by Zee — Data Sync via JSONBin.io =====
// Stores prices AND custom products in JSONBin (free, no project limits)

const JSONBIN_BIN_ID  = '6af8a1dcffd5d16053c17c7c';   // prices bin
const JSONBIN_API_KEY = '$2a$10$qR7YKI5q6wBSQntH6NzQkuK05m/AwYgrhaqAtt3JtkJgmLlJsbqRu';                   // ← KEEP YOUR REAL KEY HERE

// Cloudinary config (for image uploads from admin)
const CLOUDINARY_CLOUD = 'mtlh9cyx';
const CLOUDINARY_PRESET = 'beauty_by_zee';  // unsigned upload preset (create in Cloudinary)
const CLOUDINARY_FOLDER = 'beauty-by-zee';

// =====================================================

const SupabaseManager = {

  isConfigured() {
    return JSONBIN_BIN_ID.trim() !== '' && JSONBIN_API_KEY.trim() !== '' && !JSONBIN_API_KEY.includes('...');
  },

  // ---- PRICES ----
  async loadPrices() {
    if (this.isConfigured()) {
      try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
          headers: { 'X-Master-Key': JSONBIN_API_KEY, 'X-Bin-Meta': 'false' }
        });
        if (res.ok) {
          const data = await res.json();
          const prices = data.prices || data;
          try { localStorage.setItem('bbz_prices', JSON.stringify(prices)); } catch {}
          return prices;
        }
      } catch (e) { console.warn('JSONBin prices fetch failed', e); }
    }
    try {
      const local = localStorage.getItem('bbz_prices');
      if (local) return JSON.parse(local);
    } catch {}
    return {};
  },

  async savePrices(pricesObj) {
    try { localStorage.setItem('bbz_prices', JSON.stringify(pricesObj)); } catch {}
    if (!this.isConfigured()) {
      return { ok: true, msg: 'Prices saved locally. Configure JSONBin for global sync.' };
    }
    try {
      // Merge with existing bin data to preserve products
      let existing = {};
      try {
        const r = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
          headers: { 'X-Master-Key': JSONBIN_API_KEY, 'X-Bin-Meta': 'false' }
        });
        if (r.ok) existing = await r.json();
      } catch {}

      const payload = { ...existing, prices: pricesObj };
      const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': JSONBIN_API_KEY },
        body: JSON.stringify(payload)
      });
      return res.ok
        ? { ok: true, msg: 'Prices saved and synced to all customers! ✅' }
        : { ok: false, msg: 'Cloud sync failed — prices saved locally only.' };
    } catch {
      return { ok: false, msg: 'Network error — prices saved locally only.' };
    }
  },

  // ---- CUSTOM PRODUCTS ----
  async loadCustomProducts() {
    if (this.isConfigured()) {
      try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
          headers: { 'X-Master-Key': JSONBIN_API_KEY, 'X-Bin-Meta': 'false' }
        });
        if (res.ok) {
          const data = await res.json();
          const products = data.customProducts || [];
          try { localStorage.setItem('bbz_custom_products', JSON.stringify(products)); } catch {}
          return products;
        }
      } catch (e) { console.warn('JSONBin custom products fetch failed', e); }
    }
    try {
      const local = localStorage.getItem('bbz_custom_products');
      if (local) return JSON.parse(local);
    } catch {}
    return [];
  },

  async saveCustomProducts(productsArray) {
    try { localStorage.setItem('bbz_custom_products', JSON.stringify(productsArray)); } catch {}
    if (!this.isConfigured()) {
      return { ok: true, msg: 'Products saved locally only.' };
    }
    try {
      let existing = {};
      try {
        const r = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
          headers: { 'X-Master-Key': JSONBIN_API_KEY, 'X-Bin-Meta': 'false' }
        });
        if (r.ok) existing = await r.json();
      } catch {}

      const payload = { ...existing, customProducts: productsArray };
      const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': JSONBIN_API_KEY },
        body: JSON.stringify(payload)
      });
      return res.ok
        ? { ok: true, msg: 'Products synced globally! ✅' }
        : { ok: false, msg: 'Sync failed — saved locally.' };
    } catch {
      return { ok: false, msg: 'Network error — saved locally.' };
    }
  },

  // ---- CLOUDINARY IMAGE UPLOAD ----
  async uploadImage(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);
    formData.append('folder', CLOUDINARY_FOLDER);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`);
      if (onProgress) {
        xhr.upload.onprogress = e => {
          if (e.lengthComputable) onProgress(Math.round(e.loaded / e.total * 100));
        };
      }
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.public_id) {
            const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/f_auto,q_auto,w_600/${data.public_id}`;
            resolve({ ok: true, url, public_id: data.public_id });
          } else {
            reject(new Error(data.error?.message || 'Upload failed'));
          }
        } catch { reject(new Error('Upload failed')); }
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(formData);
    });
  }
};
