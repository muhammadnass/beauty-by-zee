// ===== Beauty by Zee — Main App =====
document.addEventListener('DOMContentLoaded', async () => {

  // ===== LOAD PRODUCTS (with Supabase prices) =====
  let products = [];

  async function initProducts() {
    // Load prices from Supabase if configured, else localStorage
    const prices = await SupabaseManager.loadPrices();
    products = DEFAULT_PRODUCTS.map(p => ({
      ...p,
      price: prices[p.id] !== undefined ? parseFloat(prices[p.id]) : 0
    }));
    renderProducts('All');
    document.dispatchEvent(new CustomEvent('productsRendered'));
  }

  const grid = document.getElementById('productsGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderProducts(filter) {
    if (!grid) return;
    const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-light)">No products found.</div>`;
      return;
    }

    grid.innerHTML = filtered.map((p, i) => `
      <div class="product-card" style="animation-delay:${i * 0.06}s" data-id="${p.id}" role="article">
        <div class="product-img-wrap" onclick="openModal(${p.id})" style="cursor:pointer">
          <img src="${p.image}" alt="${p.name}" loading="lazy"
            onerror="this.src='images/placeholder.jpg'"
            width="300" height="300">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        </div>
        <div class="product-info">
          <div class="product-category">${p.category}</div>
          <div class="product-name" onclick="openModal(${p.id})" style="cursor:pointer">${p.name}</div>
          <div class="product-desc">${p.description}</div>
          <div class="product-footer">
            <div class="product-price ${p.price > 0 ? '' : 'no-price'}">
              ${p.price > 0 ? '₦' + p.price.toLocaleString() : 'Price on request'}
            </div>
            <button
              class="add-to-cart"
              onclick="addToCart(${p.id})"
              ${p.price === 0 ? 'disabled title="Price not set yet"' : ''}
              aria-label="Add ${p.name} to cart"
            >
              <span aria-hidden="true">🛒</span> Add
            </button>
          </div>
        </div>
      </div>
    `).join('');

    document.dispatchEvent(new CustomEvent('productsRendered'));
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });

  await initProducts();

  // ===== CART =====
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('bbz_cart') || '[]'); } catch { cart = []; }

  function saveCart() {
    try { localStorage.setItem('bbz_cart', JSON.stringify(cart)); } catch {}
    updateCartUI();
  }

  function updateCartUI() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('cartCount');
    if (badge) {
      badge.textContent = count;
      const wasVisible = badge.classList.contains('visible');
      badge.classList.toggle('visible', count > 0);
      // Retrigger animation on new item
      if (!wasVisible && count > 0) {
        badge.style.animation = 'none';
        badge.offsetHeight; // reflow
        badge.style.animation = '';
      }
    }
    renderCartItems();
    updateCartTotal();
  }

  function renderCartItems() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <p style="font-weight:600;color:var(--brown)">Your cart is empty</p>
          <p style="font-size:0.85rem;margin-top:0.4rem">Browse our products and add items!</p>
        </div>`;
      return;
    }
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" width="70" height="70"
          onerror="this.src='images/placeholder.jpg'" loading="lazy">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₦${item.price.toLocaleString()} each</div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)" aria-label="Decrease quantity">−</button>
            <span class="qty-num" aria-live="polite">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove ${item.name}">✕</button>
      </div>
    `).join('');
  }

  function updateCartTotal() {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const el = document.getElementById('cartTotal');
    if (el) el.textContent = '₦' + total.toLocaleString();
  }

  window.addToCart = function(id) {
    const p = products.find(x => x.id === id);
    if (!p || p.price === 0) {
      showToast('⚠️ Price not available yet. Contact us on WhatsApp!');
      return;
    }
    const existing = cart.find(x => x.id === id);
    if (existing) { existing.qty++; }
    else { cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 }); }
    saveCart();
    showToast(`✨ ${p.name} added!`);
    openCart();
  };

  window.changeQty = function(id, delta) {
    const item = cart.find(x => x.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
    saveCart();
  };

  window.removeFromCart = function(id) {
    cart = cart.filter(x => x.id !== id);
    saveCart();
    showToast('🗑️ Item removed');
  };

  // ===== CART SIDEBAR =====
  const cartOverlay = document.getElementById('cartOverlay');
  const cartSidebar = document.getElementById('cartSidebar');

  window.openCart = function() {
    if (!cartOverlay || !cartSidebar) return;
    cartOverlay.classList.add('open');
    cartSidebar.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeCart = function() {
    if (!cartOverlay || !cartSidebar) return;
    cartOverlay.classList.remove('open');
    cartSidebar.classList.remove('open');
    document.body.style.overflow = '';
  };

  cartOverlay?.addEventListener('click', closeCart);
  document.getElementById('cartCloseBtn')?.addEventListener('click', closeCart);
  document.getElementById('cartBtn')?.addEventListener('click', e => { e.preventDefault(); openCart(); });

  // Swipe-to-close on mobile
  let startX = 0;
  cartSidebar?.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  cartSidebar?.addEventListener('touchend', e => {
    if (e.changedTouches[0].clientX - startX > 70) closeCart();
  }, { passive: true });

  // ===== WHATSAPP CHECKOUT =====
  document.getElementById('whatsappBtn')?.addEventListener('click', () => {
    if (cart.length === 0) { showToast('⚠️ Your cart is empty!'); return; }
    const note = document.getElementById('cartNote')?.value.trim() || '';
    const lines = cart.map(i => `• ${i.name} ×${i.qty} — ₦${(i.price * i.qty).toLocaleString()}`).join('\n');
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const msg = `Hello Beauty by Zee! 🌟\n\nI'd like to place an order:\n\n${lines}\n\n*Total: ₦${total.toLocaleString()}*${note ? '\n\n📍 ' + note : ''}\n\nPlease confirm my order. Thank you! 😊`;
    const url = `https://wa.me/2348067023509?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener');
  });

  // ===== TOAST =====
  window.showToast = function(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.remove('show');
    requestAnimationFrame(() => { requestAnimationFrame(() => toast.classList.add('show')); });
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
  };

  // ===== PRODUCT MODAL =====
  window.openModal = function(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const overlay = document.getElementById('productModal');
    if (!overlay) return;
    overlay.querySelector('.modal-img').src = p.image;
    overlay.querySelector('.modal-img').alt = p.name;
    overlay.querySelector('.modal-product-name').textContent = p.name;
    overlay.querySelector('.modal-product-desc').textContent = p.description;
    overlay.querySelector('.modal-product-price').innerHTML =
      p.price > 0
        ? `<strong style="color:var(--gold-dark);font-size:1.3rem;font-family:'Playfair Display',serif">₦${p.price.toLocaleString()}</strong>`
        : '<span style="color:#999;font-size:0.9rem">Price not available — contact us on WhatsApp</span>';
    const addBtn = overlay.querySelector('.modal-add-btn');
    addBtn.disabled = p.price === 0;
    addBtn.onclick = () => { addToCart(id); closeModal(); };
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.modal-close').focus();
  };

  window.closeModal = function() {
    document.getElementById('productModal')?.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.getElementById('productModal')?.addEventListener('click', e => {
    if (e.target.id === 'productModal') closeModal();
  });

  // ESC key closes any overlay
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      closeCart();
    }
  });

  // ===== SCROLL TO TOP =====
  const scrollBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    scrollBtn?.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  scrollBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  updateCartUI();
});
