import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { dataService } from '../services/dataService.js';
import { renderProductCard, attachAddToCartListeners } from '../components/productCard.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  const container = document.getElementById('merchant-container');
  const urlParams = new URLSearchParams(window.location.search);
  const merchantId = urlParams.get('id') || 'emp-1';

  const merchant = dataService.getMerchantById(merchantId);

  if (!merchant) {
    container.innerHTML = `
      <div class="card-surface p-12 text-center space-y-4 max-w-xl mx-auto">
        <h2 class="text-2xl font-bold text-ink dark:text-white">Emprendimiento no encontrado</h2>
        <a href="./catalogo.html" class="btn-accent inline-block">Ver catálogo general</a>
      </div>
    `;
    return;
  }

  const fair = dataService.getFairById(merchant.regularFairId);
  const merchantProducts = dataService.getProducts().filter(p => p.merchantId === merchant.id);

  container.innerHTML = `
    <!-- Header del Emprendimiento -->
    <div class="card-surface overflow-hidden border border-sand/40">
      <div class="h-44 sm:h-56 w-full relative bg-sand/30 overflow-hidden">
        <img src="${merchant.coverImage}" alt="${merchant.name}" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      <div class="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          <img src="${merchant.avatar}" alt="${merchant.name}" class="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl bg-white">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-accent text-white">${merchant.category}</span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-sand/60 text-ink dark:bg-slate-700 dark:text-sand-light">📍 ${merchant.neighborhood}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-ink dark:text-white font-heading">${merchant.name}</h1>
            <p class="text-xs text-ink-light dark:text-slate-400">Responsable artesanal: <strong>${merchant.artisanName}</strong></p>
          </div>
        </div>

        <!-- Botones de contacto directo -->
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <a href="https://wa.me/${merchant.phone.replace(/[^0-9]/g, '')}" target="_blank" class="btn-accent text-sm py-2.5 px-4 shadow-sm flex items-center justify-center gap-2">
            <span>💬</span>
            <span>WhatsApp (${merchant.phone})</span>
          </a>
          <a href="https://instagram.com" target="_blank" class="btn-outline text-sm py-2.5 px-4 flex items-center justify-center gap-2">
            <span>📸</span>
            <span>${merchant.instagram}</span>
          </a>
        </div>
      </div>

      <!-- Biografía e info de feria habitual -->
      <div class="px-6 pb-6 sm:px-8 sm:pb-8 pt-2 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-sand/30 dark:border-slate-700/60 mt-4">
        <div class="md:col-span-2 space-y-2">
          <h3 class="text-xs font-bold uppercase tracking-wider text-ink-light dark:text-slate-400">Sobre el Emprendimiento</h3>
          <p class="text-sm text-ink-muted dark:text-slate-300 leading-relaxed">${merchant.bio}</p>
        </div>
        ${fair ? `
          <div class="p-4 rounded-2xl bg-cream dark:bg-slate-800/60 border border-sand/30 space-y-1">
            <span class="text-[11px] font-bold text-accent uppercase tracking-wider">Feria Frecuente</span>
            <h4 class="font-bold text-sm text-ink dark:text-white font-heading">${fair.name}</h4>
            <p class="text-xs text-ink-muted dark:text-slate-300">🕒 ${fair.schedule}</p>
            <a href="./feria.html?id=${fair.id}" class="text-xs text-accent font-semibold hover:underline block pt-1">Ver detalles de feria →</a>
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Catálogo de productos de este emprendedor -->
    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-black text-ink dark:text-white font-heading">
            Productos de ${merchant.name} (${merchantProducts.length})
          </h2>
          <p class="text-xs text-ink-muted dark:text-slate-400">Catálogo oficial con precios vigentes en Río Cuarto.</p>
        </div>
      </div>

      <div id="merchant-products-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        ${merchantProducts.map(p => renderProductCard(p, '../')).join('')}
      </div>
    </section>
  `;

  attachAddToCartListeners(merchantProducts);
});
