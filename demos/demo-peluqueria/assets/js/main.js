(function() {
  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  const portfolioBar = document.querySelector('.portfolio-bar');
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
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  // ── Smooth scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ── IntersectionObserver for .reveal ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Chatbot ──
  function getSlots() {
    const hours = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
                   '12:00 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM',
                   '4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM'];
    const taken = new Set();
    const seed = new Date().getDate();
    hours.forEach((h,i) => { if ((seed * (i+3) * 7) % 10 < 3) taken.add(h); });
    return hours.map(h => ({ time: h, available: !taken.has(h) }));
  }

  const faq = {
    welcome: {
      msg: '¡Hola! ✨ Bienvenida a Lumière Atelier. Soy tu asistente de belleza. ¿En qué te puedo ayudar?',
      options: [
        { label: '✂️ Agendar cita', next: 'cita_start' },
        { label: '💇 Servicios y precios', next: 'servicios' },
        { label: '🕐 Horarios', next: 'horarios' },
        { label: '📍 Ubicación', next: 'ubicacion' }
      ]
    },
    servicios: {
      msg: '💇 Nuestros servicios:\n\n✂️ Corte & Styling\n• Corte de Diseño Mujer — $80k\n• Corte Caballero — $35k\n• Blower & Ondas — $45k\n• Peinado de Evento — $90k\n• Tratamiento Hidratante — $120k\n\n🎨 Color & Técnica\n• Balayage / Babylights — $350k+\n• Tinte Completo — $180k\n• Mechas Tradicionales — $200k\n• Keratina Alisadora — $250k\n• Corrección de Color — Consultar',
      options: [
        { label: '✂️ Agendar cita', next: 'cita_start' },
        { label: '🕐 Horarios', next: 'horarios' },
        { label: '🔙 Inicio', next: 'welcome' }
      ]
    },
    horarios: {
      msg: '🕐 Horarios de atención:\n\nLunes a Sábado\n9:00 AM – 7:00 PM\n\nDomingos cerrado.',
      options: [
        { label: '✂️ Agendar cita', next: 'cita_start' },
        { label: '💇 Servicios', next: 'servicios' },
        { label: '📍 Ubicación', next: 'ubicacion' },
        { label: '🔙 Inicio', next: 'welcome' }
      ]
    },
    ubicacion: {
      msg: '📍 Nos encuentras en:\n\nVillamaría, Caldas\n📞 +57 300 000 0000\n\nLunes a Sábado, 9AM – 7PM',
      options: [
        { label: '🗺️ Google Maps', action: () => window.open('https://maps.google.com?q=Villamaria+Caldas','_blank') },
        { label: '✂️ Agendar cita', next: 'cita_start' },
        { label: '🔙 Inicio', next: 'welcome' }
      ]
    }
  };

  const cita = { servicio: null, fecha: null, hora: null, nombre: null, telefono: null };
  let currentStep = null;

  const btn = document.getElementById('chat-btn');
  const win = document.getElementById('chat-window');
  const close = document.getElementById('chatClose');
  const msgs = document.getElementById('chat-messages');
  const opts = document.getElementById('chat-options');
  const inputWrap = document.getElementById('chatInput');
  const inputField = document.getElementById('chatText');
  const sendBtn = document.getElementById('chatSend');

  btn.addEventListener('click', () => { btn.classList.add('hidden'); win.classList.add('open'); if (!msgs.children.length) showFaq('welcome'); });
  close.addEventListener('click', () => { win.classList.remove('open'); btn.classList.remove('hidden'); });

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
    return new Promise(r => { showTyping(); setTimeout(() => { removeTyping(); addMsg(text, type); r(); }, 500 + Math.random() * 400); });
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
          else if (o.next === 'cita_start') setTimeout(() => startCita(), 400);
          else setTimeout(() => showFaq(o.next), 400);
        });
        opts.appendChild(b);
      });
    });
  }

  const servicios = [
    { label: '✂️ Corte de Diseño', dur: '45 min', price: '$80k' },
    { label: '💨 Blower & Ondas', dur: '30 min', price: '$45k' },
    { label: '💆 Tratamiento Hidratante', dur: '60 min', price: '$120k' },
    { label: '🎨 Balayage / Babylights', dur: '120 min', price: '$350k+' },
    { label: '🎨 Tinte Completo', dur: '90 min', price: '$180k' },
    { label: '💇 Keratina Alisadora', dur: '90 min', price: '$250k' }
  ];

  async function startCita() {
    currentStep = 'servicio';
    cita.servicio = cita.fecha = cita.hora = cita.nombre = cita.telefono = null;
    opts.innerHTML = '';
    await botSay('¡Perfecto! Agendemos tu cita. ✨');
    await botSay('¿Qué servicio te interesa?');
    opts.style.display = 'flex';
    servicios.forEach(s => {
      const b = document.createElement('button');
      b.className = 'chat-opt';
      b.textContent = s.label;
      b.addEventListener('click', () => handleCitaInput(s.label, s));
      opts.appendChild(b);
    });
  }

  async function handleCitaInput(value, extra) {
    addMsg(value, 'user');
    opts.innerHTML = '';

    if (currentStep === 'servicio') {
      cita.servicio = extra;
      currentStep = 'fecha';
      await botSay(extra.label + ' — ' + extra.price + ' (' + extra.dur + ')\n\n¿Qué día te queda bien?');
      opts.style.display = 'flex';
      const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
      const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      let count = 0;
      for (let i = 0; count < 5; i++) {
        const d = new Date(); d.setDate(d.getDate() + i);
        if (d.getDay() === 0) continue;
        const label = count === 0 ? 'Hoy' : count === 1 ? 'Mañana' : days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()];
        const b = document.createElement('button');
        b.className = 'chat-opt'; b.textContent = label;
        b.addEventListener('click', () => handleCitaInput(label));
        opts.appendChild(b);
        count++;
      }
    }
    else if (currentStep === 'fecha') {
      cita.fecha = value;
      currentStep = 'hora';
      await botSay('Estos son los horarios disponibles para ' + value + ':');
      const slots = getSlots();
      const grid = document.createElement('div');
      grid.className = 'time-grid';
      slots.forEach(s => {
        const t = document.createElement('button');
        t.className = 'time-slot' + (s.available ? '' : ' taken');
        t.textContent = s.time;
        if (s.available) t.addEventListener('click', () => handleCitaInput(s.time));
        grid.appendChild(t);
      });
      const wrapper = document.createElement('div');
      wrapper.className = 'chat-msg bot';
      wrapper.style.maxWidth = '95%';
      wrapper.appendChild(grid);
      msgs.appendChild(wrapper);
      msgs.scrollTop = msgs.scrollHeight;
      opts.style.display = 'none';
    }
    else if (currentStep === 'hora') {
      cita.hora = value;
      currentStep = 'nombre';
      await botSay('Excelente, ' + value + ' ✅\n\n¿A nombre de quién agendamos?');
      showInput('Tu nombre...');
    }
    else if (currentStep === 'nombre') {
      cita.nombre = value;
      currentStep = 'telefono';
      await botSay('¡Hola ' + value + '! 💜\n\nDéjame un número de contacto para confirmarte:');
      showInput('Tu teléfono...');
    }
    else if (currentStep === 'telefono') {
      cita.telefono = value;
      currentStep = null;
      hideInput();
      await botSay('Agendando tu cita...');
      const resumen = '✅ ¡Cita confirmada!\n\n'
        + '👤 ' + cita.nombre + '\n'
        + '💇 ' + cita.servicio.label + ' (' + cita.servicio.price + ')\n'
        + '📅 ' + cita.fecha + '\n'
        + '🕐 ' + cita.hora + '\n'
        + '⏱️ Duración: ' + cita.servicio.dur + '\n'
        + '📞 ' + cita.telefono + '\n\n'
        + 'Te enviaremos un recordatorio.\n¡Te esperamos en Lumière Atelier! ✨';
      await botSay(resumen, 'system');
      opts.innerHTML = ''; opts.style.display = 'flex';
      [
        { label: '💇 Ver servicios', next: 'servicios' },
        { label: '📍 Cómo llegar', next: 'ubicacion' },
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
    handleCitaInput(v);
  }
  sendBtn.addEventListener('click', submitText);
  inputField.addEventListener('keydown', e => { if (e.key === 'Enter') submitText(); });
})();
