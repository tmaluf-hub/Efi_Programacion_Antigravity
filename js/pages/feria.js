import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { dataService } from '../services/dataService.js';
import { formatDate } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  const container = document.getElementById('fair-detail-container');
  const urlParams = new URLSearchParams(window.location.search);
  const fairId = urlParams.get('id') || 'feria-1';

  const fair = dataService.getFairById(fairId);

  if (!fair) {
    container.innerHTML = `
      <div class="card-surface p-12 text-center space-y-4 max-w-xl mx-auto">
        <h2 class="text-2xl font-bold text-ink dark:text-white">Feria no encontrada</h2>
        <a href="./ferias.html" class="btn-accent inline-block">Volver a ferias</a>
      </div>
    `;
    return;
  }

  const merchantsInFair = dataService.getMerchants().filter(m => m.regularFairId === fair.id);
  const fairReviews = dataService.getReviews().fairs.filter(r => r.fairId === fair.id);

  container.innerHTML = `
    <!-- Cabecera -->
    <div class="card-surface overflow-hidden border border-sand/40">
      <div class="h-64 sm:h-80 w-full relative overflow-hidden bg-sand/30">
        <img src="${fair.coverImage}" alt="${fair.name}" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>
        <div class="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent">
            ${fair.zone}
          </span>
          <h1 class="text-2xl sm:text-4xl font-black font-heading">${fair.name}</h1>
          <p class="text-sm text-sand-light">${fair.tagline}</p>
        </div>
      </div>

      <!-- Datos clave -->
      <div class="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="space-y-1">
          <span class="text-xs text-ink-light dark:text-slate-400 font-bold uppercase tracking-wider">Ubicación</span>
          <p class="text-sm font-semibold text-ink dark:text-white">${fair.locationName}</p>
        </div>

        <div class="space-y-1">
          <span class="text-xs text-ink-light dark:text-slate-400 font-bold uppercase tracking-wider">Días y Horarios</span>
          <p class="text-sm font-semibold text-accent">${fair.schedule}</p>
        </div>

        <div class="space-y-1">
          <span class="text-xs text-ink-light dark:text-slate-400 font-bold uppercase tracking-wider">Capacidad de Puestos</span>
          <p class="text-sm font-semibold text-ink dark:text-white">${fair.registeredCount} / ${fair.capacity} ocupados</p>
        </div>

      </div>

      <!-- Descripción y servicios -->
      <div class="px-6 pb-6 sm:px-8 sm:pb-8 space-y-4 border-t border-sand/20 pt-4">
        <div>
          <h3 class="text-sm font-bold text-ink dark:text-white uppercase tracking-wider mb-2">Sobre esta feria</h3>
          <p class="text-sm text-ink-muted dark:text-slate-300 leading-relaxed">${fair.description}</p>
        </div>

        <div>
          <h3 class="text-xs font-bold text-ink dark:text-white uppercase tracking-wider mb-2">Servicios disponibles</h3>
          <div class="flex flex-wrap gap-2">
            ${fair.services.map(s => `
              <span class="px-3 py-1 rounded-xl bg-sand/30 dark:bg-slate-800 text-xs text-ink dark:text-sand-light font-medium">
                ✓ ${s}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- MAPA LEAFLET DE LA FERIA -->
    <div class="mt-8 card-surface p-6 space-y-4 border border-sand/40">
      <h3 class="text-xl font-bold text-ink dark:text-white font-heading">Ubicación en el Mapa</h3>
      <div id="fair-single-map" class="h-72 sm:h-96 rounded-2xl overflow-hidden z-10 border border-sand/30"></div>
    </div>

    <!-- EMPRENDEDORES PRESENTES -->
    <section class="mt-12 space-y-6">
      <div>
        <h3 class="text-2xl font-bold text-ink dark:text-white font-heading">
          Emprendedores inscriptos en esta feria (${merchantsInFair.length})
        </h3>
        <p class="text-xs text-ink-muted dark:text-slate-400">Puestos y artesanos que podés encontrar en este espacio.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        ${merchantsInFair.map(m => `
          <div class="card-surface p-4 flex items-center space-x-3 border border-sand/30">
            <img src="${m.avatar}" alt="${m.name}" class="w-12 h-12 rounded-xl object-cover border border-sand">
            <div class="flex-grow">
              <h4 class="font-bold text-sm text-ink dark:text-white leading-tight">${m.name}</h4>
              <span class="text-xs text-accent">${m.category}</span>
              <a href="./emprendimiento.html?id=${m.id}" class="text-[11px] text-primary dark:text-sand-light hover:underline block mt-1">Ver productos →</a>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- RESEÑAS DE LA FERIA -->
    <section class="mt-12 space-y-6">
      <h3 class="text-2xl font-bold text-ink dark:text-white font-heading">Reseñas del evento</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${fairReviews.map(r => `
          <div class="card-surface p-4 space-y-2 border border-sand/30">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-ink dark:text-white">${r.author}</span>
              <span class="text-xs text-accent font-bold">★ ${r.rating} / 5</span>
            </div>
            <p class="text-xs text-ink-muted dark:text-slate-300 leading-relaxed">${r.comment}</p>
            <span class="text-[10px] text-ink-light dark:text-slate-400 block">${formatDate(r.date)}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  // Inicializar Leaflet si la librería cargó
  if (window.L) {
    const map = L.map('fair-single-map').setView([fair.lat, fair.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    L.marker([fair.lat, fair.lng])
      .addTo(map)
      .bindPopup(`<b>${fair.name}</b><br>${fair.locationName}`)
      .openPopup();
  }
});
