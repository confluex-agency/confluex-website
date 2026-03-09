(function() {
  // ── Navbar scroll ──
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ── Mobile menu ──
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navCta = document.getElementById('navCta');
  const overlay = document.getElementById('mobileOverlay');

  function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
    navCta.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
  }
  function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('mobile-open');
    navCta.classList.remove('mobile-open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);
  navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));

  // ── Smooth scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ── IntersectionObserver ──
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // ── Chatbot ──
  const rooms = [
    { label: '🌊 Suite Caribe', price: '$680.000/noche', desc: 'Vista al mar, jacuzzi, 45m²' },
    { label: '🌿 Suite Jardín', price: '$520.000/noche', desc: 'Jardín tropical, terraza, 38m²' },
    { label: '🏛️ Suite Colonial', price: '$380.000/noche', desc: 'Estilo cartagenero, centro, 30m²' }
  ];

  const faq = {
    welcome: {
      msg: '¡Hola! Bienvenido a Bahía Serena. Soy tu asistente de reservas. ¿En qué puedo ayudarte?',
      options: [
        { label: '🏨 Reservar habitación', next: 'reserva_start' },
        { label: '🛏️ Ver habitaciones', next: 'habitaciones' },
        { label: '🏖️ Experiencias', next: 'experiencias' },
        { label: '📍 Ubicación', next: 'ubicacion' },
        { label: '💬 Hablar con recepción', next: 'contacto' }
      ]
    },
    habitaciones: {
      msg: '🛏️ Nuestras suites:\n\n🌊 Suite Caribe — $680.000/noche\nVista panorámica al mar, jacuzzi, balcón privado. 45m²\n\n🌿 Suite Jardín — $520.000/noche\nJardines tropicales, terraza, ducha outdoor. 38m²\n\n🏛️ Suite Colonial — $380.000/noche\nEstilo cartagenero, techos altos, mosaico artesanal. 30m²\n\nTodas incluyen desayuno, WiFi y acceso a playa privada.',
      options: [
        { label: '🏨 Reservar', next: 'reserva_start' },
        { label: '🏖️ Experiencias', next: 'experiencias' },
        { label: '🔙 Inicio', next: 'welcome' }
      ]
    },
    experiencias: {
      msg: '🏖️ Experiencias incluidas y adicionales:\n\n✅ Incluido:\n• Playa privada con servicio de bar\n• Piscina infinity\n• Desayuno buffet\n\n💎 Adicional:\n• Spa & masajes — desde $150.000\n• Tour Islas del Rosario — $250.000/persona\n• City tour centro histórico — $120.000/persona\n• Paseo en lancha al atardecer — $180.000/pareja',
      options: [
        { label: '🏨 Reservar', next: 'reserva_start' },
        { label: '🛏️ Habitaciones', next: 'habitaciones' },
        { label: '🔙 Inicio', next: 'welcome' }
      ]
    },
    ubicacion: {
      msg: '📍 Estamos en:\n\nBocagrande, Cartagena de Indias\n📞 +57 605 000 0000\n📱 WhatsApp: +57 300 000 0000\n\n✈️ 15 min desde aeropuerto Rafael Núñez\n🚗 Transfer aeropuerto disponible ($80.000)\n\nRecepción 24 horas.',
      options: [
        { label: '🗺️ Google Maps', action: () => window.open('https://maps.google.com?q=Bocagrande+Cartagena','_blank') },
        { label: '🏨 Reservar', next: 'reserva_start' },
        { label: '🔙 Inicio', next: 'welcome' }
      ]
    },
    contacto: {
      msg: '💬 Puedes contactarnos:\n\n📱 WhatsApp: +57 300 000 0000\n📞 Teléfono: +57 605 000 0000\n📧 reservas@bahiaserena.co\n\nHorario recepción: 24 horas',
      options: [
        { label: '📱 WhatsApp', action: () => window.open('https://wa.me/573000000000','_blank') },
        { label: '🔙 Inicio', next: 'welcome' }
      ]
    }
  };

  // Booking state
  const reserva = { room: null, checkin: null, checkout: null, guests: null, nombre: null, telefono: null };
  let currentStep = null;

  const btn = document.getElementById('chat-btn');
  const win = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chatClose');
  const msgs = document.getElementById('chat-messages');
  const opts = document.getElementById('chat-options');
  const inputWrap = document.getElementById('chatInput');
  const inputField = document.getElementById('chatText');
  const sendBtn = document.getElementById('chatSend');

  btn.addEventListener('click', () => { btn.classList.add('hidden'); win.classList.add('open'); if (!msgs.children.length) showFaq('welcome'); });
  closeBtn.addEventListener('click', () => { win.classList.remove('open'); btn.classList.remove('hidden'); });

  function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = 'chat-msg ' + type;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function showTyping() {
    const d = document.createElement('div');
    d.className = 'chat-msg bot'; d.id = 'typing';
    d.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
  }
  function removeTyping() { const t = document.getElementById('typing'); if (t) t.remove(); }
  function botSay(text, type) {
    type = type || 'bot';
    return new Promise(r => { showTyping(); setTimeout(() => { removeTyping(); addMsg(text, type); r(); }, 400 + Math.random() * 300); });
  }
  function showInput(ph) {
    opts.innerHTML = ''; opts.style.display = 'none';
    inputWrap.style.display = 'flex'; inputField.placeholder = ph || ''; inputField.value = ''; inputField.focus();
  }
  function hideInput() { inputWrap.style.display = 'none'; opts.style.display = 'flex'; }

  function showFaq(key) {
    currentStep = null; hideInput();
    const step = faq[key]; opts.innerHTML = '';
    botSay(step.msg).then(() => {
      step.options.forEach(o => {
        const b = document.createElement('button');
        b.className = 'chat-opt'; b.textContent = o.label;
        b.addEventListener('click', () => {
          addMsg(o.label, 'user');
          if (o.action) { o.action(); if (o.next) setTimeout(() => showFaq(o.next), 500); }
          else if (o.next === 'reserva_start') setTimeout(() => startReserva(), 400);
          else setTimeout(() => showFaq(o.next), 400);
        });
        opts.appendChild(b);
      });
    });
  }

  // ── Booking flow ──
  async function startReserva() {
    currentStep = 'room';
    Object.keys(reserva).forEach(k => reserva[k] = null);
    opts.innerHTML = '';
    await botSay('¡Perfecto! Reservemos tu estadía en Bahía Serena. 🏖️');
    await botSay('¿Qué tipo de suite prefieres?');
    opts.style.display = 'flex';
    rooms.forEach(r => {
      const b = document.createElement('button');
      b.className = 'chat-opt';
      b.textContent = r.label;
      b.addEventListener('click', () => handleReserva(r.label, r));
      opts.appendChild(b);
    });
  }

  async function handleReserva(value, extra) {
    addMsg(value, 'user');
    opts.innerHTML = '';

    if (currentStep === 'room') {
      reserva.room = extra;
      currentStep = 'checkin';
      await botSay(extra.label + '\n' + extra.price + '\n' + extra.desc + '\n\n¿Cuándo llegas? (Check-in)');
      opts.style.display = 'flex';
      const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
      const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      for (let i = 0; i < 6; i++) {
        const d = new Date(); d.setDate(d.getDate() + i);
        const label = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()];
        const b = document.createElement('button');
        b.className = 'chat-opt'; b.textContent = label;
        b.addEventListener('click', () => handleReserva(label));
        opts.appendChild(b);
      }
    }
    else if (currentStep === 'checkin') {
      reserva.checkin = value;
      currentStep = 'noches';
      await botSay('Check-in: ' + value + ' ✅\n\n¿Cuántas noches?');
      opts.style.display = 'flex';
      ['1 noche','2 noches','3 noches','4 noches','5 noches','7 noches'].forEach(n => {
        const b = document.createElement('button');
        b.className = 'chat-opt'; b.textContent = n;
        b.addEventListener('click', () => handleReserva(n));
        opts.appendChild(b);
      });
    }
    else if (currentStep === 'noches') {
      reserva.checkout = value;
      currentStep = 'guests';
      await botSay('¿Cuántos huéspedes?');
      opts.style.display = 'flex';
      ['1 persona','2 personas','3 personas','4 personas'].forEach(g => {
        const b = document.createElement('button');
        b.className = 'chat-opt'; b.textContent = g;
        b.addEventListener('click', () => handleReserva(g));
        opts.appendChild(b);
      });
    }
    else if (currentStep === 'guests') {
      reserva.guests = value;
      currentStep = 'nombre';
      await botSay('¿A nombre de quién la reserva?');
      showInput('Tu nombre completo...');
    }
    else if (currentStep === 'nombre') {
      reserva.nombre = value;
      currentStep = 'telefono';
      await botSay('¡Gracias ' + value + '! 🌊\n\nDéjame tu WhatsApp para confirmar:');
      showInput('Tu WhatsApp...');
    }
    else if (currentStep === 'telefono') {
      reserva.telefono = value;
      currentStep = null;
      hideInput();
      await botSay('Procesando tu reserva...');

      const noches = parseInt(reserva.checkout) || 1;
      const precioNoche = reserva.room.price.replace('/noche','');
      const resumen = '✅ ¡Reserva confirmada!\n\n'
        + '👤 ' + reserva.nombre + '\n'
        + '🛏️ ' + reserva.room.label + ' (' + precioNoche + '/noche)\n'
        + '📅 Check-in: ' + reserva.checkin + '\n'
        + '🌙 ' + reserva.checkout + '\n'
        + '👥 ' + reserva.guests + '\n'
        + '📱 ' + reserva.telefono + '\n\n'
        + 'Te enviaremos la confirmación por WhatsApp.\n¡Te esperamos en Bahía Serena! 🏖️';

      await botSay(resumen, 'system');

      opts.innerHTML = ''; opts.style.display = 'flex';
      [
        { label: '🛏️ Ver habitaciones', next: 'habitaciones' },
        { label: '🏖️ Experiencias', next: 'experiencias' },
        { label: '🔙 Inicio', next: 'welcome' }
      ].forEach(o => {
        const b = document.createElement('button');
        b.className = 'chat-opt'; b.textContent = o.label;
        b.addEventListener('click', () => { addMsg(o.label, 'user'); setTimeout(() => showFaq(o.next), 400); });
        opts.appendChild(b);
      });
    }
  }

  function submitText() {
    const v = inputField.value.trim();
    if (!v || !currentStep) return;
    inputField.value = '';
    handleReserva(v);
  }
  sendBtn.addEventListener('click', submitText);
  inputField.addEventListener('keydown', e => { if (e.key === 'Enter') submitText(); });
})();
