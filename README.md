# Confluex Website

Sitio web de portafolio para **Confluex**, agencia de desarrollo web, automatizacion y chatbots con IA. Incluye landing page principal y 8 demos funcionales para distintos nichos de negocio.

## Estructura

```
confluex-website/
  index.html                          # Landing page principal
  assets/
    css/styles.css                    # Estilos principales
    js/main.js                        # Logica principal (theme, nav, menu, animaciones)
    thumbs/                           # Thumbnails del portfolio
  demos/
    demo-cafe/                        # Cafeteria artesanal
      assets/css/styles.css
      assets/js/main.js
    demo-fastfood/                    # Restaurante fast food
      assets/css/styles.css
      assets/js/main.js
    demo-peluqueria/                  # Peluqueria / salon de belleza
      assets/css/styles.css
      assets/js/main.js
    demo-GYM/                         # Gimnasio / fitness
      assets/css/styles.css
      assets/js/main.js
    demo-clinicadental/               # Clinica dental
      assets/css/styles.css
      assets/js/main.js
    demo-veterinaria/                 # Veterinaria
      assets/css/styles.css
      assets/js/main.js
    demo-ecommerce/                   # E-commerce (NOVA Store)
      assets/css/styles.css
      assets/js/main.js
    demo-hotel/                       # Hotel boutique (Bahia Serena)
      assets/css/styles.css
      assets/js/main.js
  .github/workflows/ci.yml           # CI/CD pipeline
```

## Stack

- HTML5 + CSS3 + Vanilla JavaScript
- Google Fonts + Font Awesome (CDN)
- Web3Forms (formulario de contacto)
- Sin frameworks ni dependencias de build

## Demos Destacadas

### NOVA Store (E-commerce)
Tienda de moda con funcionalidad completa:
- Catalogo de productos con filtros por categoria
- Carrito de compras con slide-out drawer (agregar, eliminar, cantidad, subtotal)
- Wishlist con toggle de corazon
- Badge counter con animacion
- Checkout via WhatsApp con resumen del pedido
- Persistencia en localStorage

### Bahia Serena (Hotel Boutique)
Hotel en Cartagena de Indias con:
- Catalogo de habitaciones con precios
- Chatbot con flujo completo de reserva (habitacion, fechas, huespedes, confirmacion)
- Galeria de imagenes
- Integracion Google Maps
- Seccion de testimonios internacionales

## Caracteristicas Comunes

- Dark/Light mode con persistencia en localStorage
- Navbar fixed con glassmorphism y scroll detection
- Animaciones de scroll con IntersectionObserver
- Chatbot integrado con flujos de FAQ
- Formulario de contacto (Web3Forms)
- Responsive (mobile-first en demos nuevas)
- SEO: meta descriptions, Open Graph, datos estructurados
- WhatsApp y email como canales de contacto

## CI/CD

GitHub Actions pipeline (`.github/workflows/ci.yml`):
- Validacion HTML (`html-validate`)
- Lint CSS (`stylelint`)
- Link checking (`lychee`)
- Lighthouse audits (9 paginas)

## Desarrollo

No requiere build. Abrir `index.html` en el navegador o usar un servidor local:

```bash
npx serve .
```

## Autores

- **Nicolas Boggioni Troncoso** — Co-Founder & Developer
- **Geison Herrera** — Co-Founder & Designer

Agencia: [Confluex](https://confluex.dev)
