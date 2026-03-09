// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
function closeMobile() { mobileMenu.classList.remove('open'); mobileOverlay.classList.remove('open'); }
mobileToggle.addEventListener('click', () => { mobileMenu.classList.toggle('open'); mobileOverlay.classList.toggle('open'); });
mobileOverlay.addEventListener('click', closeMobile);
document.querySelectorAll('.mobile-link').forEach(a => a.addEventListener('click', closeMobile));

// Scroll animations
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.animate').forEach(el => obs.observe(el));

// Chatbot
(function() {
    function getSlots() {
        const hours = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
                       '12:00 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM',
                       '5:30 PM','6:00 PM','6:30 PM'];
        const taken = new Set();
        const seed = new Date().getDate();
        hours.forEach((h,i) => { if ((seed * (i+7) * 13) % 10 < 3) taken.add(h); });
        return hours.map(h => ({ time: h, available: !taken.has(h) }));
    }

    const faq = {
        welcome: {
            msg: '¡Hola! 🐾 Bienvenido a Patitas Felices. ¿En qué puedo ayudarte?',
            options: [
                { label: '📅 Agendar consulta', next: 'cita_start' },
                { label: '🩺 Servicios', next: 'servicios' },
                { label: '🕐 Horarios', next: 'horarios' },
                { label: '🚨 Emergencias', next: 'emergencias' },
                { label: '📍 Ubicación', next: 'ubicacion' }
            ]
        },
        servicios: {
            msg: '🩺 Nuestros servicios:\n\n• Consulta General — $15.000\n• Vacunación — $12.000\n• Cirugía — Desde $80.000\n• Peluquería Canina — $18.000\n• Diagnóstico por Imagen — $25.000\n• Emergencias 24/7 — $25.000',
            options: [
                { label: '📅 Agendar consulta', next: 'cita_start' },
                { label: '🕐 Horarios', next: 'horarios' },
                { label: '🔙 Inicio', next: 'welcome' }
            ]
        },
        horarios: {
            msg: '🕐 Horarios:\n\nLun-Vie: 9:00 AM – 7:00 PM\nSábados: 9:00 AM – 2:00 PM\nDomingos: Cerrado\n\n🚨 Emergencias: 24/7',
            options: [
                { label: '📅 Agendar consulta', next: 'cita_start' },
                { label: '🩺 Servicios', next: 'servicios' },
                { label: '📍 Ubicación', next: 'ubicacion' },
                { label: '🔙 Inicio', next: 'welcome' }
            ]
        },
        emergencias: {
            msg: '🚨 Emergencias 24/7\n\nSi tu mascota necesita atención urgente, llámanos inmediatamente:\n\n📞 +56 9 8765 4321\n\nEstamos disponibles todos los días, las 24 horas.',
            options: [
                { label: '📞 Llamar ahora', action: () => window.open('tel:+56987654321') },
                { label: '💬 WhatsApp', action: () => window.open('https://wa.me/56987654321?text=Emergencia%20veterinaria','_blank') },
                { label: '🔙 Inicio', next: 'welcome' }
            ]
        },
        ubicacion: {
            msg: '📍 Nos encuentras en:\n\nAv. Granaderos 2050\nCalama, Antofagasta, Chile\n📞 +56 55 234 5678',
            options: [
                { label: '🗺️ Google Maps', action: () => window.open('https://maps.app.goo.gl/obVR1mNGwCmLb7sj7','_blank') },
                { label: '📅 Agendar consulta', next: 'cita_start' },
                { label: '🔙 Inicio', next: 'welcome' }
            ]
        }
    };

    const serviciosList = [
        { label: '🩺 Consulta General', dur: '30 min', price: '$15.000' },
        { label: '💉 Vacunación', dur: '20 min', price: '$12.000' },
        { label: '✂️ Peluquería Canina', dur: '60 min', price: '$18.000' },
        { label: '🔬 Diagnóstico por Imagen', dur: '40 min', price: '$25.000' }
    ];

    const cita = { servicio: null, mascota: null, fecha: null, hora: null, nombre: null, telefono: null };
    let step = null;

    const btn = document.getElementById('vet-chat-btn');
    const win = document.getElementById('vet-chat-window');
    const cls = document.getElementById('vet-chatClose');
    const msgs = document.getElementById('vet-msgs');
    const opts = document.getElementById('vet-opts');
    const inputWrap = document.getElementById('vet-input');
    const inputField = document.getElementById('vet-text');
    const sendBtn = document.getElementById('vet-send');

    btn.addEventListener('click', () => { btn.classList.add('hidden'); win.classList.add('open'); if (!msgs.children.length) showFaq('welcome'); });
    cls.addEventListener('click', () => { win.classList.remove('open'); btn.classList.remove('hidden'); });

    function addMsg(t, type) {
        const d = document.createElement('div');
        d.className = 'vet-msg ' + type; d.textContent = t;
        msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
    }
    function showTyping() {
        const d = document.createElement('div');
        d.className = 'vet-msg bot'; d.id = 'vet-typing';
        d.innerHTML = '<div class="vet-dots"><span></span><span></span><span></span></div>';
        msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
    }
    function removeTyping() { const t = document.getElementById('vet-typing'); if (t) t.remove(); }
    function botSay(t, type) {
        type = type || 'bot';
        return new Promise(r => { showTyping(); setTimeout(() => { removeTyping(); addMsg(t, type); r(); }, 500 + Math.random() * 400); });
    }
    function showInput(ph) { opts.innerHTML = ''; opts.style.display = 'none'; inputWrap.style.display = 'flex'; inputField.placeholder = ph; inputField.value = ''; inputField.focus(); }
    function hideInput() { inputWrap.style.display = 'none'; opts.style.display = 'flex'; }

    function showFaq(key) {
        step = null; hideInput();
        const s = faq[key]; opts.innerHTML = '';
        botSay(s.msg).then(() => {
            s.options.forEach(o => {
                const b = document.createElement('button');
                b.className = 'vet-opt'; b.textContent = o.label;
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
        step = 'servicio'; opts.innerHTML = '';
        Object.keys(cita).forEach(k => cita[k] = null);
        await botSay('¡Vamos a agendar una consulta! 🐾');
        await botSay('¿Qué servicio necesita tu mascota?');
        opts.style.display = 'flex';
        serviciosList.forEach(s => {
            const b = document.createElement('button');
            b.className = 'vet-opt'; b.textContent = s.label;
            b.addEventListener('click', () => handleInput(s.label, s));
            opts.appendChild(b);
        });
    }

    async function handleInput(value, extra) {
        addMsg(value, 'user'); opts.innerHTML = '';

        if (step === 'servicio') {
            cita.servicio = extra; step = 'mascota';
            await botSay(extra.label + ' — ' + extra.price + ' (' + extra.dur + ')\n\n¿Cómo se llama tu mascota y qué es? (ej: Luna, gata)');
            showInput('Nombre y tipo de mascota...');
        }
        else if (step === 'mascota') {
            cita.mascota = value; step = 'fecha';
            await botSay('¡Hola ' + value.split(',')[0].trim() + '! 🐾\n\n¿Qué día te queda bien?');
            opts.style.display = 'flex';
            const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
            const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
            let count = 0;
            for (let i = 0; count < 5; i++) {
                const d = new Date(); d.setDate(d.getDate() + i);
                if (d.getDay() === 0) continue;
                const label = count === 0 ? 'Hoy' : count === 1 ? 'Mañana' : days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()];
                const b = document.createElement('button');
                b.className = 'vet-opt'; b.textContent = label;
                b.addEventListener('click', () => handleInput(label));
                opts.appendChild(b); count++;
            }
        }
        else if (step === 'fecha') {
            cita.fecha = value; step = 'hora';
            await botSay('Horarios disponibles para ' + value + ':');
            const slots = getSlots();
            const grid = document.createElement('div'); grid.className = 'vet-time-grid';
            slots.forEach(s => {
                const t = document.createElement('button');
                t.className = 'vet-slot' + (s.available ? '' : ' taken');
                t.textContent = s.time;
                if (s.available) t.addEventListener('click', () => handleInput(s.time));
                grid.appendChild(t);
            });
            const w = document.createElement('div');
            w.className = 'vet-msg bot'; w.style.maxWidth = '95%';
            w.appendChild(grid); msgs.appendChild(w); msgs.scrollTop = msgs.scrollHeight;
            opts.style.display = 'none';
        }
        else if (step === 'hora') {
            cita.hora = value; step = 'nombre';
            await botSay('Perfecto, ' + value + ' ✅\n\n¿Tu nombre completo?');
            showInput('Tu nombre...');
        }
        else if (step === 'nombre') {
            cita.nombre = value; step = 'telefono';
            await botSay('¡Gracias ' + value + '! 😊\n\nUn teléfono de contacto:');
            showInput('Tu teléfono...');
        }
        else if (step === 'telefono') {
            cita.telefono = value; step = null; hideInput();
            await botSay('Agendando la consulta...');
            const r = '✅ ¡Consulta agendada!\n\n'
                + '👤 ' + cita.nombre + '\n'
                + '🐾 ' + cita.mascota + '\n'
                + '🩺 ' + cita.servicio.label + ' (' + cita.servicio.price + ')\n'
                + '📅 ' + cita.fecha + '\n'
                + '🕐 ' + cita.hora + '\n'
                + '📞 ' + cita.telefono + '\n\n'
                + '📍 Av. Granaderos 2050, Calama\n¡Los esperamos! 🐾';
            await botSay(r, 'system');
            opts.innerHTML = ''; opts.style.display = 'flex';
            [
                { label: '🩺 Ver servicios', next: 'servicios' },
                { label: '📍 Cómo llegar', next: 'ubicacion' },
                { label: '🔙 Inicio', next: 'welcome' }
            ].forEach(o => {
                const b = document.createElement('button');
                b.className = 'vet-opt'; b.textContent = o.label;
                b.addEventListener('click', () => { addMsg(o.label, 'user'); setTimeout(() => showFaq(o.next), 400); });
                opts.appendChild(b);
            });
        }
    }

    function submit() { const v = inputField.value.trim(); if (!v || !step) return; inputField.value = ''; handleInput(v); }
    sendBtn.addEventListener('click', submit);
    inputField.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
})();
