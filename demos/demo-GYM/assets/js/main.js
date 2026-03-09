// Page Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('pageLoader').classList.add('hidden');
    }, 500);
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Create Particles
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (10 + Math.random() * 10) + 's';
    particlesContainer.appendChild(particle);
}

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
});

// Counter Animation
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString() + '+';
                    }
                };
                updateCounter();
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    counterObserver.observe(heroStats);
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.flexDirection = 'column';
    navLinks.style.background = 'rgba(10, 10, 10, 0.98)';
    navLinks.style.padding = '20px';
    navLinks.style.borderBottom = '1px solid var(--color-border)';
});

// Button Click Effects
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (!this.closest('nav') && !this.classList.contains('mobile-menu-btn')) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax Effect on Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroGrid = document.querySelector('.hero-grid');
    if (heroGrid && scrolled < window.innerHeight) {
        heroGrid.style.transform = `perspective(500px) rotateX(60deg) translateY(${scrolled * 0.5}px)`;
    }
});

// Schedule Cell Click Effect
document.querySelectorAll('.schedule-table td').forEach(cell => {
    cell.addEventListener('click', function() {
        if (this.querySelector('.schedule-class')) {
            this.style.background = 'rgba(255, 61, 0, 0.2)';
            setTimeout(() => {
                this.style.background = '';
            }, 300);
        }
    });
});

// Pricing Card Selection
document.querySelectorAll('.btn-plan').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.pricing-card');
        const planName = card.querySelector('.plan-name').textContent;
        alert(`¡Has seleccionado el plan ${planName}! Un asesor se pondrá en contacto contigo pronto.`);
    });
});

// CTA Buttons
document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('membresias').scrollIntoView({ behavior: 'smooth' });
    });
});

// Secondary CTA
document.querySelectorAll('.btn-secondary').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('¡Próximamente! Video tour de nuestras instalaciones.');
    });
});

// CHATBOT WIDGET
(function() {
  function getSlots() {
    var hours = ['6:00 AM','7:00 AM','8:00 AM','9:00 AM','5:00 PM','6:00 PM','7:00 PM','8:00 PM'];
    var taken = new Set();
    var seed = new Date().getDate();
    hours.forEach(function(h, i) { if ((seed * (i + 3) * 13) % 10 < 3) taken.add(h); });
    return hours.map(function(h) { return { time: h, available: !taken.has(h) }; });
  }

  var faq = {
    welcome: {
      msg: '¡Hola! 💪 Bienvenido a Iron Pulse Fitness. Soy tu asistente virtual. ¿En qué puedo ayudarte?',
      options: [
        { label: '📅 Agendar visita/clase de prueba', next: 'reserva_start' },
        { label: '💳 Membresías y planes', next: 'membresias' },
        { label: '🥊 Nuestras clases', next: 'clases' },
        { label: '🕐 Horarios', next: 'horarios' },
        { label: '📍 Ubicación', next: 'ubicacion' }
      ]
    },
    membresias: {
      msg: '💳 Planes de membresía:\n\n🔹 Básico — $29.990/mes\n   Acceso a zona de pesas y cardio\n\n🔸 Pro — $49.990/mes\n   Todo Básico + clases grupales ilimitadas + sauna\n\n🔶 Elite — $69.990/mes\n   Todo Pro + entrenador personal + acceso 24/7\n\n¡Sin contratos, cancela cuando quieras!',
      options: [
        { label: '📅 Agendar visita', next: 'reserva_start' },
        { label: '🥊 Ver clases', next: 'clases' },
        { label: '🔙 Inicio', next: 'welcome' }
      ]
    },
    clases: {
      msg: '🥊 Nuestras clases:\n\n🔥 CrossFit — 60 min · Alta intensidad\n🧘 Yoga Power — 75 min · Flexibilidad & fuerza\n🥊 Boxing Fit — 45 min · Combate & cardio\n⚡ HIIT Burn — 30 min · Quema extrema\n\nTodas incluidas en planes Pro y Elite.',
      options: [
        { label: '📅 Agendar clase de prueba', next: 'reserva_start' },
        { label: '💳 Ver membresías', next: 'membresias' },
        { label: '🕐 Horarios', next: 'horarios' },
        { label: '🔙 Inicio', next: 'welcome' }
      ]
    },
    horarios: {
      msg: '🕐 Horarios de atención:\n\nLunes a Viernes: 5:00 AM – 10:00 PM\nSábados: 6:00 AM – 8:00 PM\nDomingos: 8:00 AM – 2:00 PM\n\n¡No hay excusas para no entrenar!',
      options: [
        { label: '📅 Agendar visita', next: 'reserva_start' },
        { label: '🥊 Ver clases', next: 'clases' },
        { label: '📍 Ubicación', next: 'ubicacion' },
        { label: '🔙 Inicio', next: 'welcome' }
      ]
    },
    ubicacion: {
      msg: '📍 Nos encuentras en:\n\nAv. Granaderos 2050\nCalama, Antofagasta, Chile\n📞 +56 55 234 5678\n✉️ info@ironpulse.fitness',
      options: [
        { label: '🗺️ Abrir en Google Maps', action: function() { window.open('https://maps.app.goo.gl/obVR1mNGwCmLb7sj7', '_blank'); } },
        { label: '📅 Agendar visita', next: 'reserva_start' },
        { label: '🔙 Inicio', next: 'welcome' }
      ]
    }
  };

  var actividades = [
    { label: '🔥 CrossFit', value: 'CrossFit' },
    { label: '🧘 Yoga Power', value: 'Yoga' },
    { label: '🥊 Boxing Fit', value: 'Boxing' },
    { label: '⚡ HIIT Burn', value: 'HIIT' },
    { label: '🏋️ Visita guiada', value: 'Visita guiada' }
  ];

  var reserva = { actividad: null, fecha: null, hora: null, nombre: null, telefono: null };
  var currentStep = null;

  var btn = document.getElementById('gymChatBtn');
  var win = document.getElementById('gymChatWindow');
  var cls = document.getElementById('gymChatClose');
  var msgs = document.getElementById('gymChatMessages');
  var opts = document.getElementById('gymChatOptions');
  var inputWrap = document.getElementById('gymChatInput');
  var inputField = document.getElementById('gymChatText');
  var sendBtn = document.getElementById('gymChatSend');

  btn.addEventListener('click', function() { btn.classList.add('hidden'); win.classList.add('open'); if (!msgs.children.length) showFaq('welcome'); });
  cls.addEventListener('click', function() { win.classList.remove('open'); btn.classList.remove('hidden'); });

  function addMsg(text, type) {
    var d = document.createElement('div');
    d.className = 'gym-msg ' + type; d.textContent = text;
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
  }
  function showTyping() {
    var d = document.createElement('div');
    d.className = 'gym-msg bot'; d.id = 'gymtyping';
    d.innerHTML = '<div class="gym-dots"><span></span><span></span><span></span></div>';
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
  }
  function removeTyping() { var t = document.getElementById('gymtyping'); if (t) t.remove(); }
  function botSay(text, type) {
    type = type || 'bot';
    return new Promise(function(r) { showTyping(); setTimeout(function() { removeTyping(); addMsg(text, type); r(); }, 500 + Math.random() * 400); });
  }
  function showInput(ph) {
    opts.innerHTML = ''; opts.style.display = 'none';
    inputWrap.style.display = 'flex'; inputField.placeholder = ph || ''; inputField.value = ''; inputField.focus();
  }
  function hideInput() { inputWrap.style.display = 'none'; opts.style.display = 'flex'; }

  function showFaq(key) {
    currentStep = null; hideInput();
    var step = faq[key]; opts.innerHTML = '';
    botSay(step.msg).then(function() {
      step.options.forEach(function(o) {
        var b = document.createElement('button');
        b.className = 'gym-opt'; b.textContent = o.label;
        b.addEventListener('click', function() {
          addMsg(o.label, 'user');
          if (o.action) { o.action(); if (o.next) setTimeout(function() { showFaq(o.next); }, 500); }
          else if (o.next === 'reserva_start') setTimeout(function() { startReserva(); }, 400);
          else setTimeout(function() { showFaq(o.next); }, 400);
        });
        opts.appendChild(b);
      });
    });
  }

  async function startReserva() {
    currentStep = 'actividad';
    reserva.actividad = reserva.fecha = reserva.hora = reserva.nombre = reserva.telefono = null;
    opts.innerHTML = '';
    await botSay('¡Vamos a agendarte! 💪');
    await botSay('¿Qué actividad te interesa?');
    opts.style.display = 'flex';
    actividades.forEach(function(a) {
      var b = document.createElement('button');
      b.className = 'gym-opt'; b.textContent = a.label;
      b.addEventListener('click', function() { handleInput(a.label, a); });
      opts.appendChild(b);
    });
  }

  async function handleInput(value, extra) {
    addMsg(value, 'user'); opts.innerHTML = '';

    if (currentStep === 'actividad') {
      reserva.actividad = extra; currentStep = 'fecha';
      await botSay('Genial, ' + extra.value + '. ¿Qué día prefieres?');
      opts.style.display = 'flex';
      var days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
      var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      var count = 0;
      for (var i = 1; count < 5; i++) {
        var d = new Date(); d.setDate(d.getDate() + i);
        if (d.getDay() === 0) continue;
        var label = count === 0 ? 'Mañana' : days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()];
        var b = document.createElement('button');
        b.className = 'gym-opt'; b.textContent = label;
        (function(lbl) { b.addEventListener('click', function() { handleInput(lbl); }); })(label);
        opts.appendChild(b); count++;
      }
    }
    else if (currentStep === 'fecha') {
      reserva.fecha = value; currentStep = 'hora';
      await botSay('Horarios disponibles para ' + value + ':');
      var slots = getSlots();
      var grid = document.createElement('div');
      grid.className = 'gym-time-grid';
      slots.forEach(function(s) {
        var t = document.createElement('button');
        t.className = 'gym-slot' + (s.available ? '' : ' taken');
        t.textContent = s.time;
        if (s.available) t.addEventListener('click', function() { handleInput(s.time); });
        grid.appendChild(t);
      });
      var wrapper = document.createElement('div');
      wrapper.className = 'gym-msg bot'; wrapper.style.maxWidth = '95%';
      wrapper.appendChild(grid);
      msgs.appendChild(wrapper); msgs.scrollTop = msgs.scrollHeight;
      opts.style.display = 'none';
    }
    else if (currentStep === 'hora') {
      reserva.hora = value; currentStep = 'nombre';
      await botSay(value + ' ✅\n\n¿Cuál es tu nombre?');
      showInput('Tu nombre...');
    }
    else if (currentStep === 'nombre') {
      reserva.nombre = value; currentStep = 'telefono';
      await botSay('¡Perfecto, ' + value + '! 🔥\n\nDéjanos tu teléfono para confirmar:');
      showInput('Tu teléfono...');
    }
    else if (currentStep === 'telefono') {
      reserva.telefono = value; currentStep = null; hideInput();
      await botSay('Confirmando tu reserva...');

      var resumen = '✅ ¡Reserva confirmada!\n\n'
        + '👤 ' + reserva.nombre + '\n'
        + '🏋️ ' + reserva.actividad.value + '\n'
        + '📅 ' + reserva.fecha + '\n'
        + '🕐 ' + reserva.hora + '\n'
        + '📞 ' + reserva.telefono + '\n\n'
        + '📍 Av. Granaderos 2050, Calama\n\n'
        + '¡Te esperamos en Iron Pulse Fitness! 💪🔥';

      await botSay(resumen, 'system');
      opts.innerHTML = ''; opts.style.display = 'flex';
      [
        { label: '💳 Ver membresías', next: 'membresias' },
        { label: '🥊 Ver clases', next: 'clases' },
        { label: '🔙 Inicio', next: 'welcome' }
      ].forEach(function(o) {
        var b = document.createElement('button');
        b.className = 'gym-opt'; b.textContent = o.label;
        b.addEventListener('click', function() { addMsg(o.label, 'user'); setTimeout(function() { showFaq(o.next); }, 400); });
        opts.appendChild(b);
      });
    }
  }

  function submitText() {
    var v = inputField.value.trim();
    if (!v || !currentStep) return;
    inputField.value = ''; handleInput(v);
  }
  sendBtn.addEventListener('click', submitText);
  inputField.addEventListener('keydown', function(e) { if (e.key === 'Enter') submitText(); });
})();
