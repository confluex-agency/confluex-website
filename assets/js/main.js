// Theme toggle
(function() {
  const html = document.documentElement;
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  if (theme === 'light') html.setAttribute('data-theme', 'light');

  function updateMeta() {
    const isLight = html.getAttribute('data-theme') === 'light';
    document.getElementById('metaThemeColor').content = isLight ? '#F5F3F0' : '#0A0A0A';
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateMeta();
    document.getElementById('themeToggle').addEventListener('click', () => {
      const isLight = html.getAttribute('data-theme') === 'light';
      if (isLight) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
      updateMeta();
    });
  });
})();

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');
function closeMenu() {
  menu.classList.remove('open'); overlay.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}
toggle.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  overlay.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
overlay.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-link').forEach(a => a.addEventListener('click', closeMenu));

// Scroll animations
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade').forEach(el => obs.observe(el));

// Dynamic year in footer
(function() {
  const y = document.getElementById('currentYear');
  if (y) y.textContent = new Date().getFullYear();
})();

// Counter animation for stats — runs once when stat enters viewport
(function() {
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nodes = document.querySelectorAll('.stat__num[data-count]');
  if (!nodes.length) return;

  function animate(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    if (prefersReduce) { el.textContent = target; return; }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animate(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  nodes.forEach(n => counterObs.observe(n));
})();

// Contact form: loading state + real-time validation feedback
(function() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const btn = form.querySelector('.cta__btn');
  const btnLabel = btn ? btn.innerHTML : '';

  form.addEventListener('submit', () => {
    if (!btn) return;
    btn.classList.add('is-loading');
    btn.disabled = true;
    btn.innerHTML = 'Enviando <span class="arrow">&middot;&middot;&middot;</span>';
    // Web3Forms POSTs synchronously via native form action — no need to reset.
  });

  // Touch each input on blur to trigger :invalid:not(:placeholder-shown) styling
  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('blur', () => el.classList.add('was-touched'));
  });
})();
