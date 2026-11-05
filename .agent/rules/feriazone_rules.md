# Reglas de Proyecto: FeriaZone

Consulta permanente de las directivas y normas de desarrollo para FeriaZone:
- Idioma de interfaz, comentarios y documentación: Español Rioplatense. Código (variables, funciones, clases): Inglés.
- Sin frameworks de frontend (solo HTML5 + CSS3 + Tailwind CLI + ES Modules).
- Tokens de diseño: primary (#3F4E63), accent (#B8654A), sand (#D4BC94), cream (#F5EFE6), ink (#1F2733).
- Modo oscuro por clase .dark con guardado en localStorage y script anti-parpadeo.
- Accesibilidad WCAG AA, botones de altura mínima de 44px, tipografía base >= 16px.
- Persistencia exclusiva mediante `js/services/storage.js` con soporte en memoria como fallback ante fallos de localStorage.
- Rutas y ejecución mediante `npm run dev` (soporte de ES Modules con `live-server`).
