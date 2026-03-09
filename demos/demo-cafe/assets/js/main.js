// --- Navbar, Mobile Menu, Scroll Animations ---

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Mobile menu
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose = document.getElementById('mobileClose');

function openMenu() { mobileMenu.classList.add('active'); mobileOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeMenu() { mobileMenu.classList.remove('active'); mobileOverlay.classList.remove('active'); document.body.style.overflow = ''; }

mobileToggle.addEventListener('click', openMenu);
mobileClose.addEventListener('click', closeMenu);
mobileOverlay.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-link').forEach(a => a.addEventListener('click', closeMenu));

// Scroll animations
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        }
    });
});

// --- Chatbot Widget ---

(function() {
    const data = {
        welcome: {
            msg: 'Hola! Bienvenido a Origen & Altitud Cafe. En que te puedo ayudar?',
            options: [
                { label: 'Ver menu', next: 'menu' },
                { label: 'Horarios', next: 'horarios' },
                { label: 'Ubicacion', next: 'ubicacion' },
                { label: 'Reservar mesa', next: 'reservar' }
            ]
        },
        menu: {
            msg: 'Nuestros clasicos:\n\n- Espresso Doble - $4.500\n- Latte Macchiato - $6.800\n- Filtrado V60 - $8.000\n- Cold Brew - $9.500\n\nTe interesa algo mas?',
            options: [
                { label: 'Horarios', next: 'horarios' },
                { label: 'Reservar mesa', next: 'reservar' },
                { label: 'Volver al inicio', next: 'welcome' }
            ]
        },
        horarios: {
            msg: 'Nuestro horario:\n\nLunes a Domingo\n7:00 AM - 8:00 PM\n\nTe esperamos!',
            options: [
                { label: 'Ver menu', next: 'menu' },
                { label: 'Ubicacion', next: 'ubicacion' },
                { label: 'Reservar mesa', next: 'reservar' },
                { label: 'Volver al inicio', next: 'welcome' }
            ]
        },
        ubicacion: {
            msg: 'Estamos en:\n\nManizales, Caldas\nEn el corazon del Eje Cafetero\n\n+57 300 000 0000',
            options: [
                { label: 'Ver en Google Maps', next: 'maps' },
                { label: 'Horarios', next: 'horarios' },
                { label: 'Volver al inicio', next: 'welcome' }
            ]
        },
        maps: {
            msg: 'Te abrimos Google Maps para que nos encuentres facilmente!',
            action: () => window.open('https://maps.google.com?q=Manizales+Caldas', '_blank'),
            options: [
                { label: 'Ver menu', next: 'menu' },
                { label: 'Reservar mesa', next: 'reservar' },
                { label: 'Volver al inicio', next: 'welcome' }
            ]
        },
        reservar: {
            msg: 'Para reservar tu mesa:\n\nLlamanos o escribenos por WhatsApp al:\n+57 300 000 0000\n\nIndicanos fecha, hora y cantidad de personas. Con gusto te atendemos!',
            options: [
                { label: 'WhatsApp', next: 'whatsapp' },
                { label: 'Ver menu', next: 'menu' },
                { label: 'Volver al inicio', next: 'welcome' }
            ]
        },
        whatsapp: {
            msg: 'Te redirigimos a WhatsApp!',
            action: () => window.open('https://wa.me/573000000000?text=Hola!%20Quiero%20reservar%20una%20mesa', '_blank'),
            options: [
                { label: 'Ver menu', next: 'menu' },
                { label: 'Volver al inicio', next: 'welcome' }
            ]
        }
    };

    const btn = document.getElementById('chat-btn');
    const win = document.getElementById('chat-window');
    const close = document.getElementById('chatClose');
    const msgs = document.getElementById('chat-messages');
    const opts = document.getElementById('chat-options');

    btn.addEventListener('click', () => {
        btn.classList.add('hidden');
        win.classList.add('open');
        if (!msgs.children.length) showStep('welcome');
    });
    close.addEventListener('click', () => {
        win.classList.remove('open');
        btn.classList.remove('hidden');
    });

    function addMsg(text, type) {
        const div = document.createElement('div');
        div.className = 'chat-msg ' + type;
        div.textContent = text;
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    }

    function showStep(key) {
        const step = data[key];
        opts.innerHTML = '';
        addMsg(step.msg, 'bot');
        if (step.action) setTimeout(step.action, 600);
        step.options.forEach(o => {
            const b = document.createElement('button');
            b.className = 'chat-opt';
            b.textContent = o.label;
            b.addEventListener('click', () => {
                addMsg(o.label, 'user');
                setTimeout(() => showStep(o.next), 400);
            });
            opts.appendChild(b);
        });
    }
})();
