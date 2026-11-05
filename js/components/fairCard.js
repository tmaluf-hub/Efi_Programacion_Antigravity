import { formatDate } from '../utils/formatters.js';

export function renderFairCard(fair) {
  const isInsidePages = window.location.pathname.includes('/pages/');
  const isDeepLevel = window.location.pathname.includes('/usuario/') || 
                      window.location.pathname.includes('/feriante/') || 
                      window.location.pathname.includes('/organizador/');
  
  const pagesPrefix = isDeepLevel ? '../' : isInsidePages ? './' : './pages/';

  const statusBadge = fair.status === 'activa' 
    ? '<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-600 text-white shadow-xs">En curso</span>'
    : '<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-primary text-white shadow-xs">Próxima</span>';

  return `
  <article class="card-surface overflow-hidden group flex flex-col justify-between hover:shadow-md transition-all duration-200">
    <!-- Portada -->
    <div class="relative h-48 sm:h-52 overflow-hidden bg-sand/20">
      <img 
        src="${fair.coverImage}" 
        alt="${fair.name}" 
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      >
      <div class="absolute top-3 left-3 z-10">
        ${statusBadge}
      </div>
      <div class="absolute bottom-3 left-3 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md">
        📍 ${fair.zone}
      </div>
    </div>

    <!-- Info -->
    <div class="p-5 flex-grow flex flex-col justify-between space-y-4">
      <div>
        <h3 class="text-lg font-bold text-ink dark:text-white group-hover:text-accent transition-colors font-heading leading-snug">
          <a href="${pagesPrefix}feria.html?id=${fair.id}">
            ${fair.name}
          </a>
        </h3>
        <p class="text-xs text-accent font-semibold mt-1">
          🕒 ${fair.schedule}
        </p>
        <p class="text-xs text-ink-muted dark:text-slate-300 line-clamp-2 mt-2 leading-relaxed">
          ${fair.description}
        </p>
      </div>

      <!-- Footer tarjeta -->
      <div class="pt-3 border-t border-sand/30 dark:border-slate-700/60 flex items-center justify-between text-xs text-ink-light dark:text-slate-400">
        <span class="flex items-center gap-1">
          <strong>${fair.registeredCount}</strong> puestos inscriptos
        </span>
        <a href="${pagesPrefix}feria.html?id=${fair.id}" class="text-accent font-bold hover:underline">
          Ver detalles →
        </a>
      </div>
    </div>
  </article>
  `;
}
