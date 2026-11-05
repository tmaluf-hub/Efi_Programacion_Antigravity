import { SITE_CONFIG } from '../config/site.js';

export function renderFooter() {
  const isInsidePages = window.location.pathname.includes('/pages/');
  const isDeepLevel = window.location.pathname.includes('/usuario/') || 
                      window.location.pathname.includes('/feriante/') || 
                      window.location.pathname.includes('/organizador/');
  
  const rootPrefix = isDeepLevel ? '../../' : isInsidePages ? '../' : './';
  const pagesPrefix = isDeepLevel ? '../' : isInsidePages ? './' : './pages/';

  const html = `
  <footer class="bg-primary-dark dark:bg-slate-950 text-slate-300 border-t border-sand/20 mt-16 pt-12 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        
        <!-- Columna 1: Marca y Propósito -->
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <span class="text-3xl">🎪</span>
            <span class="text-2xl font-black text-white font-heading tracking-tight">
              FERIA<span class="text-accent">ZONE</span>
            </span>
          </div>
          <p class="text-sm text-sand-light leading-relaxed">
            ${SITE_CONFIG.slogan}. Uniendo el trabajo de artesanos y productores con los vecinos de nuestra ciudad.
          </p>
          <div class="pt-2 text-xs text-sand">
            <p class="font-semibold text-white">Examen Final Integrador 2026</p>
            <p>Programación II · Opción 7</p>
          </div>
        </div>

        <!-- Columna 2: Enlaces Rápidos -->
        <div>
          <h4 class="text-white font-bold text-base mb-4 font-heading border-b border-sand/20 pb-2">Navegación</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="${rootPrefix}index.html" class="hover:text-accent transition-colors">Inicio</a></li>
            <li><a href="${pagesPrefix}catalogo.html" class="hover:text-accent transition-colors">Catálogo de Productos</a></li>
            <li><a href="${pagesPrefix}ferias.html" class="hover:text-accent transition-colors">Guía de Ferias</a></li>
            <li><a href="${pagesPrefix}mapa.html" class="hover:text-accent transition-colors">Mapa y Cercanía</a></li>
            <li><a href="${pagesPrefix}planes.html" class="hover:text-accent transition-colors">Planes y Promociones</a></li>
            <li><a href="${pagesPrefix}nosotros.html" class="hover:text-accent transition-colors">Quiénes Somos (Equipo)</a></li>
          </ul>
        </div>

        <!-- Columna 3: Información de Contacto -->
        <div>
          <h4 class="text-white font-bold text-base mb-4 font-heading border-b border-sand/20 pb-2">Sede y Contacto</h4>
          <ul class="space-y-3 text-sm">
            <li class="flex items-start space-x-2">
              <span class="text-accent mt-0.5">📍</span>
              <span>${SITE_CONFIG.address}</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="text-accent">💬</span>
              <a href="${SITE_CONFIG.whatsappUrl}" target="_blank" class="hover:text-white transition-colors">
                ${SITE_CONFIG.phone}
              </a>
            </li>
            <li class="flex items-center space-x-2">
              <span class="text-accent">✉️</span>
              <a href="mailto:${SITE_CONFIG.email}" class="hover:text-white transition-colors">
                ${SITE_CONFIG.email}
              </a>
            </li>
            <li class="pt-2">
              <a href="${SITE_CONFIG.feedbackUrl}" target="_blank" class="inline-flex items-center text-xs text-accent hover:underline font-medium">
                <span>Completar Formulario de Feedback</span>
                <span class="ml-1">↗</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Columna 4: Redes Sociales -->
        <div>
          <h4 class="text-white font-bold text-base mb-4 font-heading border-b border-sand/20 pb-2">Comunidad</h4>
          <p class="text-xs text-sand-light mb-4">Seguí las novedades de las ferias de Río Cuarto en nuestras redes oficiales:</p>
          <div class="flex flex-wrap gap-2">
            <a href="${SITE_CONFIG.social.instagram.url}" target="_blank" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors">
              Instagram
            </a>
            <a href="${SITE_CONFIG.social.facebook.url}" target="_blank" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors">
              Facebook
            </a>
            <a href="${SITE_CONFIG.social.tiktok.url}" target="_blank" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors">
              TikTok
            </a>
            <a href="${SITE_CONFIG.social.youtube.url}" target="_blank" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors">
              YouTube
            </a>
            <a href="${SITE_CONFIG.social.linkedin.url}" target="_blank" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </div>

      </div>

      <!-- Barra inferior -->
      <div class="border-t border-sand/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
        <p>© 2026 FeriaZone — Río Cuarto, Córdoba. Desarrollado con HTML5, Tailwind CSS y JavaScript Vanilla.</p>
        <p class="mt-2 sm:mt-0">Sin comisiones por venta · Apoyando el comercio local</p>
      </div>
    </div>
  </footer>
  `;

  const mountPoint = document.getElementById('footer-placeholder');
  if (mountPoint) {
    mountPoint.outerHTML = html;
  } else {
    document.body.insertAdjacentHTML('beforeend', html);
  }
}
