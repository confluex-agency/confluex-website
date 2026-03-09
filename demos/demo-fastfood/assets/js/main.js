// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 60); }, { passive: true });

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
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('active'); revealObs.unobserve(entry.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') { e.preventDefault(); const t = document.querySelector(href); if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' }); }
    });
});

// CHATBOT WIDGET
(function() {
    var faq = {
        welcome: { msg: 'Hola! Soy el asistente de Sabor de mi Tierra. Como te puedo ayudar?', options: [
            { label: 'Ver menu', next: 'menu' }, { label: 'Reservar mesa', next: 'reserva_start' },
            { label: 'Horarios', next: 'horarios' }, { label: 'Domicilios', next: 'domicilios' }
        ]},
        menu: { msg: 'Nuestros platos estrella:\n\n- Bandeja Paisa - $25.000\n- Ajiaco Santafereno - $22.000\n- Sancocho de Gallina - $20.000\n\nTodos incluyen bebida y postre del dia.', options: [
            { label: 'Reservar mesa', next: 'reserva_start' }, { label: 'Pedir domicilio', next: 'domicilios' }, { label: 'Inicio', next: 'welcome' }
        ]},
        horarios: { msg: 'Horarios de atencion:\n\nLunes a Domingo\n11:00 AM - 9:00 PM\n\nLos esperamos!', options: [
            { label: 'Ver menu', next: 'menu' }, { label: 'Reservar mesa', next: 'reserva_start' }, { label: 'Ubicacion', next: 'ubicacion' }, { label: 'Inicio', next: 'welcome' }
        ]},
        ubicacion: { msg: 'Nos encuentras en:\n\nManizales, Caldas\n+57 324 562 0084', options: [
            { label: 'Google Maps', action: function(){window.open('https://maps.google.com?q=Manizales+Caldas','_blank');} },
            { label: 'Reservar mesa', next: 'reserva_start' }, { label: 'Inicio', next: 'welcome' }
        ]},
        domicilios: { msg: 'Hacemos domicilios!\n\nZona de cobertura: Manizales centro y alrededores.\nPedido minimo: $18.000\nDomicilio: $4.000\n\nHaz tu pedido por WhatsApp:', options: [
            { label: 'WhatsApp', action: function(){window.open('https://wa.me/573245620084?text=Hola!%20Quiero%20hacer%20un%20pedido','_blank');} },
            { label: 'Ver menu', next: 'menu' }, { label: 'Inicio', next: 'welcome' }
        ]}
    };
    var reserva = { personas: null, fecha: null, hora: null, nombre: null, telefono: null };
    var currentStep = null;
    var btn = document.getElementById('chat-btn'), win = document.getElementById('chat-window'),
        close = document.getElementById('chatClose'), msgs = document.getElementById('chat-messages'),
        opts = document.getElementById('chat-options'), inputWrap = document.getElementById('chatInput'),
        inputField = document.getElementById('chatText'), sendBtn = document.getElementById('chatSend');

    btn.addEventListener('click', function(){ btn.classList.add('hidden'); win.classList.add('open'); if(!msgs.children.length) showFaq('welcome'); });
    close.addEventListener('click', function(){ win.classList.remove('open'); btn.classList.remove('hidden'); });

    function addMsg(text, type) { var d = document.createElement('div'); d.className = 'chat-msg ' + type; d.textContent = text; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; }
    function showTyping() { var d = document.createElement('div'); d.className = 'chat-msg bot'; d.id = 'typing'; d.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>'; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; }
    function removeTyping() { var t = document.getElementById('typing'); if(t) t.remove(); }
    function botSay(text, type) { type = type || 'bot'; return new Promise(function(r){ showTyping(); setTimeout(function(){ removeTyping(); addMsg(text, type); r(); }, 600 + Math.random()*400); }); }
    function showInput(ph) { opts.innerHTML = ''; opts.style.display = 'none'; inputWrap.style.display = 'flex'; inputField.placeholder = ph || ''; inputField.value = ''; inputField.focus(); }
    function hideInput() { inputWrap.style.display = 'none'; opts.style.display = 'flex'; }

    function showFaq(key) {
        currentStep = null; hideInput(); var step = faq[key]; opts.innerHTML = '';
        botSay(step.msg).then(function(){
            step.options.forEach(function(o){ var b = document.createElement('button'); b.className = 'chat-opt'; b.textContent = o.label;
                b.addEventListener('click', function(){ addMsg(o.label, 'user');
                    if(o.action){ o.action(); if(o.next) setTimeout(function(){ showFaq(o.next); }, 500); }
                    else if(o.next === 'reserva_start') setTimeout(function(){ startReserva(); }, 400);
                    else setTimeout(function(){ showFaq(o.next); }, 400);
                }); opts.appendChild(b);
            });
        });
    }

    function startReserva() {
        currentStep = 'personas'; reserva = { personas:null, fecha:null, hora:null, nombre:null, telefono:null };
        opts.innerHTML = '';
        botSay('Perfecto! Vamos a reservar tu mesa.').then(function(){ return botSay('Para cuantas personas?'); }).then(function(){
            opts.innerHTML = ''; opts.style.display = 'flex';
            [1,2,3,4,5,6,'Mas de 6'].forEach(function(n){ var b = document.createElement('button'); b.className = 'chat-opt';
                b.textContent = typeof n === 'number' ? n + (n===1?' persona':' personas') : n;
                b.addEventListener('click', function(){ handleRes(typeof n === 'number' ? String(n) : '7'); }); opts.appendChild(b);
            });
        });
    }

    function handleRes(value) {
        addMsg(value, 'user'); opts.innerHTML = '';
        if(currentStep === 'personas') { reserva.personas = value; currentStep = 'fecha';
            botSay('Que dia te gustaria venir?').then(function(){ opts.style.display = 'flex';
                var days=['Dom','Lun','Mar','Mie','Jue','Vie','Sab'], months=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
                for(var i=0;i<5;i++){ var d=new Date(); d.setDate(d.getDate()+i);
                    var label = i===0?'Hoy':i===1?'Manana':days[d.getDay()]+' '+d.getDate()+' '+months[d.getMonth()];
                    (function(l){ var b=document.createElement('button'); b.className='chat-opt'; b.textContent=l;
                        b.addEventListener('click',function(){handleRes(l);}); opts.appendChild(b); })(label);
                }
            });
        } else if(currentStep === 'fecha') { reserva.fecha = value; currentStep = 'hora';
            botSay('A que hora? Abrimos de 11 AM a 9 PM.').then(function(){ opts.style.display = 'flex';
                ['12:00 PM','1:00 PM','2:00 PM','6:00 PM','7:00 PM','8:00 PM'].forEach(function(h){
                    var b=document.createElement('button'); b.className='chat-opt'; b.textContent=h;
                    b.addEventListener('click',function(){handleRes(h);}); opts.appendChild(b);
                });
            });
        } else if(currentStep === 'hora') { reserva.hora = value; currentStep = 'nombre';
            botSay('A nombre de quien la reserva?').then(function(){ showInput('Tu nombre...'); });
        } else if(currentStep === 'nombre') { reserva.nombre = value; currentStep = 'telefono';
            botSay('Un numero de contacto:').then(function(){ showInput('Tu telefono...'); });
        } else if(currentStep === 'telefono') { reserva.telefono = value; currentStep = null; hideInput();
            botSay('Confirmando tu reserva...').then(function(){
                var r = 'Reserva confirmada!\n\n' + reserva.nombre + '\n' + reserva.personas + (reserva.personas==='1'?' persona':' personas') + '\n' + reserva.fecha + '\n' + reserva.hora + '\n' + reserva.telefono + '\n\nTe esperamos en Sabor de mi Tierra!';
                return botSay(r, 'system');
            }).then(function(){
                opts.innerHTML = ''; opts.style.display = 'flex';
                [{label:'Ver menu',next:'menu'},{label:'Como llegar',next:'ubicacion'},{label:'Inicio',next:'welcome'}].forEach(function(o){
                    var b=document.createElement('button'); b.className='chat-opt'; b.textContent=o.label;
                    b.addEventListener('click',function(){addMsg(o.label,'user'); setTimeout(function(){showFaq(o.next);},400);}); opts.appendChild(b);
                });
            });
        }
    }

    function submitText(){ var v=inputField.value.trim(); if(!v||!currentStep) return; inputField.value=''; handleRes(v); }
    sendBtn.addEventListener('click', submitText);
    inputField.addEventListener('keydown', function(e){ if(e.key==='Enter') submitText(); });
})();
