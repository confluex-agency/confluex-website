(function() {
  'use strict';

  // ═══════════════════════════════════════
  // PRODUCT DATA
  // ═══════════════════════════════════════
  const PRODUCTS = [
    { id: 1, name: 'Vestido Midi Satinado', brand: 'NOVA Essentials', cat: 'vestidos', price: 189000, img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', tag: 'Nuevo' },
    { id: 2, name: 'Blazer Oversize Camel', brand: 'NOVA Studio', cat: 'outerwear', price: 245000, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: 'Conjunto Lino Natural', brand: 'NOVA Essentials', cat: 'vestidos', price: 154000, oldPrice: 220000, img: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', tag: '-30%', tagClass: 'sale' },
    { id: 4, name: 'Bolso Estructurado Noir', brand: 'NOVA Accessories', cat: 'accesorios', price: 312000, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', tag: 'Nuevo' },
    { id: 5, name: 'Trench Coat Arena', brand: 'NOVA Studio', cat: 'outerwear', price: 289000, img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 6, name: 'Vestido Wrap Terracota', brand: 'NOVA Essentials', cat: 'vestidos', price: 175000, img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', tag: 'Nuevo' },
    { id: 7, name: 'Sandalias Artesanales', brand: 'NOVA Accessories', cat: 'calzado', price: 169000, img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 8, name: 'Gafas Sol Oversize', brand: 'NOVA Accessories', cat: 'accesorios', price: 98000, oldPrice: 140000, img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', tag: '-30%', tagClass: 'sale' },
    { id: 9, name: 'Botines Chelsea Negro', brand: 'NOVA Studio', cat: 'calzado', price: 278000, img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 10, name: 'Pañuelo Seda Estampado', brand: 'NOVA Accessories', cat: 'accesorios', price: 79000, img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', tag: 'Nuevo' },
    { id: 11, name: 'Falda Plisada Midi', brand: 'NOVA Essentials', cat: 'vestidos', price: 145000, img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 12, name: 'Bomber Jacket Olive', brand: 'NOVA Studio', cat: 'outerwear', price: 210000, oldPrice: 300000, img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', tag: '-30%', tagClass: 'sale' },
  ];

  // ═══════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════
  let cart = JSON.parse(localStorage.getItem('nova_cart') || '[]');
  let wishlist = JSON.parse(localStorage.getItem('nova_wish') || '[]');
  let activeFilter = 'all';

  function saveState() {
    localStorage.setItem('nova_cart', JSON.stringify(cart));
    localStorage.setItem('nova_wish', JSON.stringify(wishlist));
  }

  function fmt(n) {
    return '$' + n.toLocaleString('es-CO');
  }

  // ═══════════════════════════════════════
  // TOAST
  // ═══════════════════════════════════════
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // ═══════════════════════════════════════
  // BADGES
  // ═══════════════════════════════════════
  const cartBadge = document.getElementById('cartBadge');
  const wishBadge = document.getElementById('wishBadge');

  function updateBadges() {
    const cartTotal = cart.reduce((s, i) => s + i.qty, 0);
    cartBadge.textContent = cartTotal || '';
    wishBadge.textContent = wishlist.length || '';
    cartBadge.classList.remove('bump');
    void cartBadge.offsetWidth;
    if (cartTotal) cartBadge.classList.add('bump');
  }

  // ═══════════════════════════════════════
  // RENDER PRODUCTS
  // ═══════════════════════════════════════
  const grid = document.getElementById('productsGrid');

  function renderProducts() {
    const items = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeFilter);
    grid.innerHTML = '';
    items.forEach(p => {
      const inWish = wishlist.includes(p.id);
      const tagHTML = p.tag ? '<span class="product-tag' + (p.tagClass === 'sale' ? ' product-tag--sale' : '') + '">' + p.tag + '</span>' : '';
      const oldHTML = p.oldPrice ? ' <span class="old-price">' + fmt(p.oldPrice) + '</span>' : '';

      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML =
        '<div class="product-thumb">' +
          '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
          tagHTML +
          '<button class="product-wish' + (inWish ? ' active' : '') + '" data-id="' + p.id + '" aria-label="Agregar a wishlist"><i class="' + (inWish ? 'fas' : 'far') + ' fa-heart"></i></button>' +
          '<div class="product-quick"><button class="btn-add-cart" data-id="' + p.id + '">Agregar al Carrito</button></div>' +
        '</div>' +
        '<div class="product-info">' +
          '<div class="product-brand">' + p.brand + '</div>' +
          '<div class="product-name">' + p.name + '</div>' +
          '<div class="product-price">' + fmt(p.price) + oldHTML + '</div>' +
        '</div>';
      grid.appendChild(card);
    });

    // Bind add-to-cart
    grid.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = +btn.dataset.id;
        addToCart(id);
        btn.textContent = 'Agregado ✓';
        btn.classList.add('added');
        setTimeout(() => { btn.textContent = 'Agregar al Carrito'; btn.classList.remove('added'); }, 1500);
      });
    });

    // Bind wishlist
    grid.querySelectorAll('.product-wish').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = +btn.dataset.id;
        toggleWish(id);
      });
    });
  }

  // ═══════════════════════════════════════
  // FILTER TABS
  // ═══════════════════════════════════════
  document.getElementById('filterTabs').addEventListener('click', e => {
    const tab = e.target.closest('.filter-tab');
    if (!tab) return;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeFilter = tab.dataset.cat;
    renderProducts();
  });

  // ═══════════════════════════════════════
  // CART LOGIC
  // ═══════════════════════════════════════
  function addToCart(id) {
    const existing = cart.find(i => i.id === id);
    if (existing) { existing.qty++; }
    else { cart.push({ id, qty: 1 }); }
    saveState();
    updateBadges();
    renderCart();
    showToast('Agregado al carrito');
  }

  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveState();
    updateBadges();
    renderCart();
  }

  function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty < 1) return removeFromCart(id);
    saveState();
    updateBadges();
    renderCart();
  }

  const cartItems = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');

  function renderCart() {
    if (!cart.length) {
      cartItems.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Tu carrito está vacío</p></div>';
      cartFooter.style.display = 'none';
      cartCount.textContent = '';
      return;
    }
    cartFooter.style.display = 'block';
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    cartCount.textContent = '(' + totalQty + ')';
    let total = 0;
    cartItems.innerHTML = '';
    cart.forEach(ci => {
      const p = PRODUCTS.find(x => x.id === ci.id);
      if (!p) return;
      total += p.price * ci.qty;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML =
        '<img class="cart-item-img" src="' + p.img + '" alt="' + p.name + '">' +
        '<div class="cart-item-details">' +
          '<div class="cart-item-brand">' + p.brand + '</div>' +
          '<div class="cart-item-name">' + p.name + '</div>' +
          '<div class="cart-item-price">' + fmt(p.price) + '</div>' +
        '</div>' +
        '<div class="cart-item-actions">' +
          '<button class="cart-item-remove" data-id="' + p.id + '"><i class="fas fa-trash-alt"></i></button>' +
          '<div class="qty-control">' +
            '<button class="qty-btn" data-id="' + p.id + '" data-d="-1">−</button>' +
            '<span class="qty-num">' + ci.qty + '</span>' +
            '<button class="qty-btn" data-id="' + p.id + '" data-d="1">+</button>' +
          '</div>' +
        '</div>';
      cartItems.appendChild(div);
    });
    cartTotal.textContent = fmt(total);

    cartItems.querySelectorAll('.cart-item-remove').forEach(b =>
      b.addEventListener('click', () => removeFromCart(+b.dataset.id))
    );
    cartItems.querySelectorAll('.qty-btn').forEach(b =>
      b.addEventListener('click', () => updateQty(+b.dataset.id, +b.dataset.d))
    );
  }

  // ═══════════════════════════════════════
  // WISHLIST LOGIC
  // ═══════════════════════════════════════
  function toggleWish(id) {
    const idx = wishlist.indexOf(id);
    if (idx > -1) { wishlist.splice(idx, 1); showToast('Eliminado de wishlist'); }
    else { wishlist.push(id); showToast('Agregado a wishlist ♥'); }
    saveState();
    updateBadges();
    renderProducts();
    renderWish();
  }

  const wishItems = document.getElementById('wishItems');
  const wishCountEl = document.getElementById('wishCount');

  function renderWish() {
    wishCountEl.textContent = wishlist.length ? '(' + wishlist.length + ')' : '';
    if (!wishlist.length) {
      wishItems.innerHTML = '<div class="cart-empty"><i class="far fa-heart"></i><p>Tu wishlist está vacía</p></div>';
      return;
    }
    wishItems.innerHTML = '';
    wishlist.forEach(id => {
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return;
      const div = document.createElement('div');
      div.className = 'wish-item';
      div.innerHTML =
        '<img class="cart-item-img" src="' + p.img + '" alt="' + p.name + '">' +
        '<div class="cart-item-details">' +
          '<div class="cart-item-brand">' + p.brand + '</div>' +
          '<div class="cart-item-name">' + p.name + '</div>' +
          '<div class="cart-item-price">' + fmt(p.price) + '</div>' +
        '</div>' +
        '<div class="wish-item-actions">' +
          '<button class="btn-wish-to-cart" data-id="' + p.id + '">Al Carrito</button>' +
          '<button class="cart-item-remove" data-id="' + p.id + '"><i class="fas fa-trash-alt"></i></button>' +
        '</div>';
      wishItems.appendChild(div);
    });
    wishItems.querySelectorAll('.btn-wish-to-cart').forEach(b =>
      b.addEventListener('click', () => { addToCart(+b.dataset.id); toggleWish(+b.dataset.id); })
    );
    wishItems.querySelectorAll('.cart-item-remove').forEach(b =>
      b.addEventListener('click', () => toggleWish(+b.dataset.id))
    );
  }

  // ═══════════════════════════════════════
  // DRAWERS
  // ═══════════════════════════════════════
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const wishDrawer = document.getElementById('wishDrawer');

  function openCart() { cartDrawer.classList.add('open'); cartOverlay.classList.add('open'); wishDrawer.classList.remove('open'); document.body.style.overflow = 'hidden'; renderCart(); }
  function closeCart() { cartDrawer.classList.remove('open'); cartOverlay.classList.remove('open'); document.body.style.overflow = ''; }
  function openWish() { wishDrawer.classList.add('open'); cartOverlay.classList.add('open'); cartDrawer.classList.remove('open'); document.body.style.overflow = 'hidden'; renderWish(); }
  function closeWish() { wishDrawer.classList.remove('open'); cartOverlay.classList.remove('open'); document.body.style.overflow = ''; }

  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('wishBtn').addEventListener('click', openWish);
  document.getElementById('wishClose').addEventListener('click', closeWish);
  cartOverlay.addEventListener('click', () => { closeCart(); closeWish(); });

  // ═══════════════════════════════════════
  // WHATSAPP CHECKOUT
  // ═══════════════════════════════════════
  document.getElementById('checkoutWa').addEventListener('click', () => {
    if (!cart.length) return;
    let msg = 'Hola NOVA! Quiero hacer un pedido:\n\n';
    let total = 0;
    cart.forEach(ci => {
      const p = PRODUCTS.find(x => x.id === ci.id);
      if (!p) return;
      msg += '• ' + p.name + ' x' + ci.qty + ' — ' + fmt(p.price * ci.qty) + '\n';
      total += p.price * ci.qty;
    });
    msg += '\nTotal: ' + fmt(total);
    window.open('https://wa.me/573000000000?text=' + encodeURIComponent(msg), '_blank');
  });

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    showToast('Redirigiendo a pasarela de pago...');
  });

  // ═══════════════════════════════════════
  // NAVBAR & MOBILE MENU
  // ═══════════════════════════════════════
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

  const hamburger = document.getElementById('hamburger');
  const navCenter = document.getElementById('navCenter');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navCenter.classList.toggle('mobile-open');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navCenter.classList.contains('mobile-open') ? 'hidden' : '';
  }
  function closeMobileMenu() {
    hamburger.classList.remove('active');
    navCenter.classList.remove('mobile-open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', () => { closeMobileMenu(); closeCart(); closeWish(); });
  navCenter.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMobileMenu));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // IntersectionObserver
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('active'); obs.unobserve(entry.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // ═══════════════════════════════════════
  // CHATBOT
  // ═══════════════════════════════════════
  const faqData = {
    welcome: {
      msg: '¡Hola! Bienvenida a NOVA Store. ¿En qué te puedo ayudar?',
      options: [
        { label: '📦 Rastrear pedido', next: 'rastrear' },
        { label: '👗 Productos', next: 'productos' },
        { label: '📏 Guía de tallas', next: 'tallas' },
        { label: '🔄 Cambios', next: 'cambios' },
        { label: '💬 Contacto', next: 'contacto' }
      ]
    },
    productos: { msg: '👗 Categorías:\n\n• Vestidos — desde $145.000\n• Outerwear — desde $210.000\n• Accesorios — desde $79.000\n• Calzado — desde $169.000\n\nEnvío gratis sobre $150.000.', options: [{ label: '📏 Tallas', next: 'tallas' },{ label: '🔙 Inicio', next: 'welcome' }] },
    tallas: { msg: '📏 Tallas NOVA:\n\nXS — Busto 80 / Cintura 60\nS — 84 / 64\nM — 88 / 68\nL — 92 / 72\nXL — 96 / 76\n\nEntre dos tallas, elige la mayor.', options: [{ label: '🔄 Cambios', next: 'cambios' },{ label: '🔙 Inicio', next: 'welcome' }] },
    cambios: { msg: '🔄 Cambios:\n\n• 30 días para cambios/devolución\n• Producto sin uso con etiquetas\n• Recogemos sin costo\n• Reembolso en 3-5 días', options: [{ label: '💬 WhatsApp', action: () => window.open('https://wa.me/573000000000','_blank') },{ label: '🔙 Inicio', next: 'welcome' }] },
    rastrear: { msg: '📦 Ingresa tu número de orden (NOVA-XXXXX):', input: true, inputPh: 'Ej: NOVA-12345', inputNext: 'rastrear_result' },
    contacto: { msg: '💬 Contáctanos:\n\n📱 WhatsApp: +57 300 000 0000\n📧 hola@novastore.co\n\nLun-Sáb 8AM-8PM', options: [{ label: '📱 WhatsApp', action: () => window.open('https://wa.me/573000000000','_blank') },{ label: '🔙 Inicio', next: 'welcome' }] }
  };

  const chatBtn = document.getElementById('chat-btn');
  const chatWin = document.getElementById('chat-window');
  const chatClose = document.getElementById('chatCloseBtn');
  const chatMsgs = document.getElementById('chat-messages');
  const chatOpts = document.getElementById('chat-options');
  const chatInputWrap = document.getElementById('chatInput');
  const chatField = document.getElementById('chatText');
  const chatSendBtn = document.getElementById('chatSend');
  let chatPendingInput = null;

  chatBtn.addEventListener('click', () => { chatBtn.classList.add('hidden'); chatWin.classList.add('open'); if (!chatMsgs.children.length) showChatFaq('welcome'); });
  chatClose.addEventListener('click', () => { chatWin.classList.remove('open'); chatBtn.classList.remove('hidden'); });

  function chatAddMsg(text, type) { const d = document.createElement('div'); d.className = 'chat-msg ' + type; d.textContent = text; chatMsgs.appendChild(d); chatMsgs.scrollTop = chatMsgs.scrollHeight; }
  function chatTyping() { const d = document.createElement('div'); d.className = 'chat-msg bot'; d.id = 'ctyping'; d.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>'; chatMsgs.appendChild(d); chatMsgs.scrollTop = chatMsgs.scrollHeight; }
  function chatRemoveTyping() { const t = document.getElementById('ctyping'); if (t) t.remove(); }
  function chatBotSay(text, type) { type = type || 'bot'; return new Promise(r => { chatTyping(); setTimeout(() => { chatRemoveTyping(); chatAddMsg(text, type); r(); }, 400 + Math.random() * 200); }); }

  function showChatFaq(key) {
    chatPendingInput = null;
    chatInputWrap.style.display = 'none';
    chatOpts.style.display = 'flex';
    const step = faqData[key]; chatOpts.innerHTML = '';
    chatBotSay(step.msg).then(() => {
      if (step.input) {
        chatPendingInput = step.inputNext;
        chatOpts.innerHTML = ''; chatOpts.style.display = 'none';
        chatInputWrap.style.display = 'flex'; chatField.placeholder = step.inputPh || ''; chatField.value = ''; chatField.focus();
        return;
      }
      if (step.options) step.options.forEach(o => {
        const b = document.createElement('button'); b.className = 'chat-opt'; b.textContent = o.label;
        b.addEventListener('click', () => { chatAddMsg(o.label, 'user'); if (o.action) { o.action(); if (o.next) setTimeout(() => showChatFaq(o.next), 500); } else if (o.next) setTimeout(() => showChatFaq(o.next), 400); });
        chatOpts.appendChild(b);
      });
    });
  }

  function chatSubmit() {
    const v = chatField.value.trim(); if (!v) return; chatField.value = '';
    chatAddMsg(v, 'user');
    if (chatPendingInput === 'rastrear_result') {
      chatPendingInput = null; chatInputWrap.style.display = 'none'; chatOpts.style.display = 'flex';
      const estados = ['En preparación','Enviado — en camino','En centro de distribución','En reparto final'];
      chatBotSay('📦 Pedido ' + v + '\nEstado: ' + estados[Math.floor(Math.random()*estados.length)] + '\n\nPara más info, escríbenos por WhatsApp.').then(() => {
        chatOpts.innerHTML = '';
        [{ label: '📱 WhatsApp', action: () => window.open('https://wa.me/573000000000','_blank') },{ label: '🔙 Inicio', next: 'welcome' }].forEach(o => {
          const b = document.createElement('button'); b.className = 'chat-opt'; b.textContent = o.label;
          b.addEventListener('click', () => { chatAddMsg(o.label, 'user'); if (o.action) { o.action(); if (o.next) setTimeout(() => showChatFaq(o.next), 500); } else if (o.next) setTimeout(() => showChatFaq(o.next), 400); });
          chatOpts.appendChild(b);
        });
      });
    }
  }
  chatSendBtn.addEventListener('click', chatSubmit);
  chatField.addEventListener('keydown', e => { if (e.key === 'Enter') chatSubmit(); });

  // ═══════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════
  renderProducts();
  updateBadges();
  renderCart();
  renderWish();

})();
