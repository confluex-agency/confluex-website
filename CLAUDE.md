# Confluex Website

Sitio web de portafolio para **Confluex**, agencia de desarrollo web, automatizacion y chatbots con IA. Landing page principal + 8 demos funcionales para distintos nichos de negocio.

## Architecture
- **Type**: Static site (no bundler, no frameworks)
- **Stack**: HTML5 + CSS3 + Vanilla JavaScript
- **Fonts**: Google Fonts (Outfit, DM Sans, JetBrains Mono) via CDN
- **Icons**: Font Awesome via CDN
- **Contact form**: Web3Forms
- **Deploy**: GitHub Pages at [confluex.dev](https://confluex.dev)
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml`)
- **Repo**: https://github.com/confluex-agency/confluex-website
- **Branch principal**: master

## Directory Structure
- `index.html` — Landing page principal (single-page)
- `assets/css/styles.css` — Estilos de la landing
- `assets/js/main.js` — Logica de la landing (theme toggle, nav, animaciones)
- `assets/thumbs/` — Thumbnails del portfolio
- `assets/*.png` — Logos (6 variantes), favicons (7 tamaños), fotos founders, social avatar
- `demos/` — 8 demos independientes, cada una con su propio `index.html` y `assets/{css,js,img}/`
- `.github/workflows/ci.yml` — Pipeline CI con 5 jobs

## Demos
| Demo | Directorio | Caracteristicas especiales |
|------|-----------|---------------------------|
| Cafeteria | `demo-cafe/` | Menu PDF |
| Fast Food | `demo-fastfood/` | — |
| Peluqueria | `demo-peluqueria/` | Config JS separado |
| Gimnasio | `demo-GYM/` | — |
| Clinica Dental | `demo-clinicadental/` | — |
| Veterinaria | `demo-veterinaria/` | — |
| E-commerce | `demo-ecommerce/` | Carrito, wishlist, checkout WhatsApp, localStorage |
| Hotel | `demo-hotel/` | Chatbot de reservas, Google Maps |

## Development
- **Setup**: No requiere instalacion. Clonar y abrir `index.html`.
- **Dev server**: `npx serve .`
- **No build step**: Editar HTML/CSS/JS directamente.

## CI/CD Pipeline (5 jobs)
1. **HTML Validation** — `html-validate` via npx
2. **CSS Lint** — `stylelint` con config standard (solo `demos/**/assets/css/*.css`)
3. **Broken Links** — `lychee-action` (excluye mailto/tel/WhatsApp/web3forms)
4. **Lighthouse CI** — Audita las 9 paginas (threshold: 0.8)
5. **Security Check** — Secrets expuestos, imgs sin alt, links sin rel=noopener

## Key Conventions
- Cada demo es autocontenida: `demo-*/index.html` con su propio `assets/`
- Dark/light mode con toggle y persistencia en localStorage
- Navbar fixed con glassmorphism y scroll detection
- Animaciones con IntersectionObserver
- Chatbot integrado en cada demo con flujos de FAQ
- Mobile-first responsive en demos nuevas (ecommerce, hotel)
- SEO: meta descriptions, Open Graph, datos estructurados

## Authors
- **Nicolas Boggioni Troncoso** — Co-Founder & Developer
- **Geison Herrera** — Co-Founder & Designer
