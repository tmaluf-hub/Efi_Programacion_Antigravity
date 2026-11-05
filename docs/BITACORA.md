# FeriaZone — Bitácora de Desarrollo

Este documento registra cronológicamente los avances, decisiones técnicas y resoluciones de cada fase del proyecto.

---

## [Fase 0] — Fundación, Tooling y Configuración Inicial
- **Fecha:** Octubre 2026
- **Estado:** ✅ Completada y Verificada
- **Acciones Realizadas:**
  - Inicialización del entorno con `package.json`, configurando scripts `dev`, `build`, `dev:css` y `dev:server`.
  - Instalación exitosa de Tailwind CSS y `live-server` con `concurrently`.
  - Creación de la estructura integral de directorios (`docs/`, `pages/`, `assets/brand/`, `assets/img/`, `css/`, `js/`, `directivas/`).
  - Creación de la documentación base (`CONTEXTO.md`, `REGLAS.md`, `ARQUITECTURA.md`, `BITACORA.md`) y sincronización con las reglas de workspace de Antigravity en `.agent/rules/`.
  - Definición de tokens de diseño en `tailwind.config.js` y `css/input.css` (`primary`, `accent`, `sand`, `cream`, `ink`) con soporte de modo oscuro por clase `.dark`.
  - Implementación de script anti-parpadeo de tema (FOUC) en el `<head>` y módulo interactivo `themeToggle.js`.
  - Creación del servicio de persistencia `js/services/storage.js` con fallback transparente en memoria.
  - Creación de la página de prueba `index.html` demostrando tokens, fuentes (Outfit e Inter), contraste accesible (mínimo 44px de altura táctil) y alternancia de temas.
  - Verificación exitosa de compilación (`npm run build`, 16.6 KB minificado) y ejecución local con respuesta HTTP 200 en `http://127.0.0.1:3000/`.
- **Decisiones Técnicas:**
  - Uso de Node v24 y Tailwind CLI para garantizar compilación autónoma sin ataduras a bundlers pesados.
  - Implementación de fallback en memoria en `storage.js` para asegurar que el sitio funcione incluso con `localStorage` deshabilitado.

---

## [Fase de Producción] — Construcción Integral del Frontend
- **Fecha:** Noviembre 2026
- **Estado:** ✅ Completada y Verificada
- **Acciones Realizadas:**
  - Construcción de los módulos de datos semilla en `js/data/`: 6 ferias de Río Cuarto, 12 emprendimientos artesanales, 60 productos categorizados, reseñas y paquetes de promoción.
  - Implementación de los servicios puros en `js/services/`: `storage.js` (persistencia con memoria fallback), `auth.js` (roles y guards), `cart.js` (carrito reactivo) y `dataService.js` (CRUD en memoria/localStorage).
  - Componentes compartidos modulares: `navbar.js` (con toggle de tema, badge de carrito y soporte mobile), `footer.js`, `productCard.js`, `fairCard.js` y `toast.js`.
  - Construcción y maquetación de 17 pantallas completas con Tailwind CSS y Leaflet: Home, Catálogo con filtros y ordenamiento, Detalle de producto, Perfil de emprendimiento, Listado y detalle de ferias, Mapa interactivo con geolocalización ("Feria más cercana a mí"), Carrito y Checkout simulado con número de orden, Login demo por roles, Registro, Panel de Usuario (historial y reseñas), Panel de Feriante (CRUD productos con límite de plan básico de 15 productos, métricas e inscripciones), Pantalla de contratación de promociones (`promocionar.html`), Panel de Organizador (creación de ferias con clic en mapa y soporte técnico), Planes, Quiénes somos y Contacto.
  - Verificación exitosa de compilación (`npm run build`) y respuesta HTTP 200 en las 17 rutas servidas por `live-server`.
