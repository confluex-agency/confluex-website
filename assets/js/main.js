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
