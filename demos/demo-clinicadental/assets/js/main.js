// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
});

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-menu-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Scroll animations with IntersectionObserver
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Booking alert
function showBookingAlert() {
    alert('¡Gracias por tu interés! Nuestro sistema de agendamiento online estará disponible próximamente. Por favor, llámanos al +56 55 234 5678 para agendar tu cita.');
}

// Add parallax effect to hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// CHATBOT WIDGET
(function() {
  function getSlots() {
    const hours = ['8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM',
                   '11:00 AM','11:30 AM','12:00 PM','2:00 PM','2:30 PM','3:00 PM',
                   '3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM'];
    const taken = new Set();
    const seed = new Date().getDate();
    hours.forEach((h,i) => { if ((seed * (i+5) * 11) % 10 < 3) taken.add(h); });
    return hours.map(h => ({ time: h, available: !taken.has(h) }));
  }

  const faq = {
    welcome: {
      msg: '¡Hola! 😁 Bienvenido a Sonría Dental. Soy tu asistente. ¿En qué puedo ayudarte?',
      options: [
        { label: '📅 Agendar cita', next: 'cita_start' },
        { label: '🦷 Servicios y precios', next: 'servicios' },
        { label: '🕐 Horarios', next: 'horarios' },
        { label: '📍 Ubicación', next: 'ubicacion' }
      ]
    },
    servicios: {
      msg: '🦷 Nuestros servicios:\n\n• Limpieza Dental — $25.000\n• Blanqueamiento LED — $80.000\n• Ortodoncia — Desde $150.000/mes\n• Implantes Dentales — Consultar\n• Endodoncia — $60.000\n• Urgencias Dentales — $30.000\n\nTodos incluyen evaluación inicial.',
      options: [
        { label: '📅 Agendar cita', next: 'cita_start' },
        { label: '🕐 Horarios', next: 'horarios' },
        { label: '🔙 Inicio', next: 'welcome' }
      ]
    },
    horarios: {
      msg: '🕐 Horarios de atención:\n\nLunes a Viernes: 8:00 AM – 6:00 PM\nSábados: 9:00 AM – 2:00 PM\nDomingos: Cerrado\n\nUrgencias: Lun-Vie hasta las 8 PM',
      options: [
        { label: '📅 Agendar cita', next: 'cita_start' },
        { label: '🦷 Servicios', next: 'servicios' },
        { label: '📍 Ubicación', next: 'ubicacion' },
        { label: '🔙 Inicio', next: 'welcome' }
      ]
    },
    ubicacion: {
      msg: '📍 Nos encuentras en:\n\nAv. Granaderos 2050\nCalama, Antofagasta, Chile\n📞 +56 55 234 5678',
      options: [
        { label: '🗺️ Google Maps', action: () => window.open('https://maps.app.goo.gl/obVR1mNGwCmLb7sj7','_blank') },
        { label: '📅 Agendar cita', next: 'cita_start' },
        { label: '🔙 Inicio', next: 'welcome' }
      ]
    }
  };

  const serviciosList = [
    { label: '🧹 Limpieza Dental', dur: '30 min', price: '$25.000' },
    { label: '✨ Blanqueamiento LED', dur: '60 min', price: '$80.000' },
    { label: '🔧 Ortodoncia (control)', dur: '30 min', price: '$40.000' },
    { label: '🦷 Endodoncia', dur: '60 min', price: '$60.000' },
    { label: '🚨 Urgencia Dental', dur: '30 min', price: '$30.000' }
  ];

  const cita = { servicio: null, fecha: null, hora: null, nombre: null, telefono: null };
  let currentStep = null;

  const btn = document.getElementById('chat-btn');
  const win = document.getElementById('chat-window');
  const cls = document.getElementById('chatClose');
  const msgs = document.getElementById('chat-messages');
  const opts = document.getElementById('chat-options');
  const inputWrap = document.getElementById('chatInput');
  const inputField = document.getElementById('chatText');
  const sendBtn = document.getElementById('chatSend');

  btn.addEventListener('click', () => { btn.classList.add('hidden'); win.classList.add('open'); if (!msgs.children.length) showFaq('welcome'); });
  cls.addEventListener('click', () => { win.classList.remove('open'); btn.classList.remove('hidden'); });

  function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = 'cb-msg ' + type; d.textContent = text;
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
  }
  function showTyping() {
    const d = document.createElement('div');
    d.className = 'cb-msg bot'; d.id = 'cbtyping';
    d.innerHTML = '<div class="cb-dots"><span></span><span></span><span></span></div>';
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
  }
  function removeTyping() { const t = document.getElementById('cbtyping'); if (t) t.remove(); }
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
        b.className = 'cb-opt'; b.textContent = o.label;
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

  async function startCita() {
    currentStep = 'servicio';
    cita.servicio = cita.fecha = cita.hora = cita.nombre = cita.telefono = null;
    opts.innerHTML = '';
    await botSay('¡Perfecto! Vamos a agendar tu cita. 😁');
    await botSay('¿Qué tratamiento necesitas?');
    opts.style.display = 'flex';
    serviciosList.forEach(s => {
      const b = document.createElement('button');
      b.className = 'cb-opt'; b.textContent = s.label;
      b.addEventListener('click', () => handleInput(s.label, s));
      opts.appendChild(b);
    });
  }

  async function handleInput(value, extra) {
    addMsg(value, 'user'); opts.innerHTML = '';

    if (currentStep === 'servicio') {
      cita.servicio = extra; currentStep = 'fecha';
      await botSay(extra.label + ' — ' + extra.price + ' (' + extra.dur + ')\n\n¿Qué día prefieres?');
      opts.style.display = 'flex';
      const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
      const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      let count = 0;
      for (let i = 0; count < 5; i++) {
        const d = new Date(); d.setDate(d.getDate() + i);
        if (d.getDay() === 0) continue;
        const label = count === 0 ? 'Hoy' : count === 1 ? 'Mañana' : days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()];
        const b = document.createElement('button');
        b.className = 'cb-opt'; b.textContent = label;
        b.addEventListener('click', () => handleInput(label));
        opts.appendChild(b); count++;
      }
    }
    else if (currentStep === 'fecha') {
      cita.fecha = value; currentStep = 'hora';
      await botSay('Horarios disponibles para ' + value + ':');
      const slots = getSlots();
      const grid = document.createElement('div');
      grid.className = 'cb-time-grid';
      slots.forEach(s => {
        const t = document.createElement('button');
        t.className = 'cb-slot' + (s.available ? '' : ' taken');
        t.textContent = s.time;
        if (s.available) t.addEventListener('click', () => handleInput(s.time));
        grid.appendChild(t);
      });
      const wrapper = document.createElement('div');
      wrapper.className = 'cb-msg bot'; wrapper.style.maxWidth = '95%';
      wrapper.appendChild(grid);
      msgs.appendChild(wrapper); msgs.scrollTop = msgs.scrollHeight;
      opts.style.display = 'none';
    }
    else if (currentStep === 'hora') {
      cita.hora = value; currentStep = 'nombre';
      await botSay('Excelente, ' + value + ' ✅\n\n¿A nombre de quién agendamos la cita?');
      showInput('Tu nombre...');
    }
    else if (currentStep === 'nombre') {
      cita.nombre = value; currentStep = 'telefono';
      await botSay('¡Gracias ' + value + '! 😊\n\nUn teléfono de contacto para recordarte la cita:');
      showInput('Tu teléfono...');
    }
    else if (currentStep === 'telefono') {
      cita.telefono = value; currentStep = null; hideInput();
      await botSay('Agendando tu cita...');

      const resumen = '✅ ¡Cita agendada!\n\n'
        + '👤 ' + cita.nombre + '\n'
        + '🦷 ' + cita.servicio.label + ' (' + cita.servicio.price + ')\n'
        + '📅 ' + cita.fecha + '\n'
        + '🕐 ' + cita.hora + '\n'
        + '⏱️ Duración: ' + cita.servicio.dur + '\n'
        + '📞 ' + cita.telefono + '\n\n'
        + '📍 Av. Granaderos 2050, Calama\nTe enviaremos un recordatorio.\n¡Te esperamos en Sonría Dental! 😁';

      await botSay(resumen, 'system');
      opts.innerHTML = ''; opts.style.display = 'flex';
      [
        { label: '🦷 Ver servicios', next: 'servicios' },
        { label: '📍 Cómo llegar', next: 'ubicacion' },
        { label: '🔙 Inicio', next: 'welcome' }
      ].forEach(o => {
        const b = document.createElement('button');
        b.className = 'cb-opt'; b.textContent = o.label;
        b.addEventListener('click', () => { addMsg(o.label, 'user'); setTimeout(() => showFaq(o.next), 400); });
        opts.appendChild(b);
      });
    }
  }

  function submitText() {
    const v = inputField.value.trim();
    if (!v || !currentStep) return;
    inputField.value = ''; handleInput(v);
  }
  sendBtn.addEventListener('click', submitText);
  inputField.addEventListener('keydown', e => { if (e.key === 'Enter') submitText(); });
})();
