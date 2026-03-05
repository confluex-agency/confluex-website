# Confluex Website

Sitio web de portafolio para **Confluex**, agencia de desarrollo web. Incluye landing page principal y 8 demos funcionales para distintos nichos de negocio.

## Estructura

```
confluex-website/
  index.html              # Landing page principal
  assets/                 # Estilos, imagens y thumbnails
  demos/
    demo-cafe/            # Cafeteria artesanal
    demo-fastfood/        # Restaurante fast food
    demo-peluqueria/      # Peluqueria / salon de belleza
    demo-GYM/             # Gimnasio / fitness
    demo-clinicadental/   # Clinica dental
    demo-veterinaria/     # Veterinaria
    demo-ecommerce/       # E-commerce (NOVA Store)
    demo-hotel/           # Hotel boutique (Bahia Serena)
```

## Stack

- HTML5 + CSS3 + Vanilla JavaScript
- Google Fonts + Font Awesome (CDN)
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

- Portfolio bar fijo con link a Confluex
- Navbar con glassmorphism y scroll detection
- Animaciones de scroll con IntersectionObserver
- Chatbot integrado con flujos de FAQ
- Responsive (mobile-first en demos nuevas)
- SEO: meta descriptions, Open Graph, datos estructurados
- WhatsApp como canal de contacto principal

## CI/CD

GitHub Actions pipeline (`.github/workflows/ci.yml`):
- Validacion HTML
- Lint CSS
- Lighthouse audits (9 paginas)
- Checks de seguridad

## Desarrollo

No requiere build. Abrir `index.html` en el navegador o usar un servidor local:

```bash
npx serve .
```

## Autores

- **Nicolas Boggioni Troncoso**
- **Geison** (reviewer)

Agencia: [Confluex](https://confluex-agency.github.io/confluex-website/)
