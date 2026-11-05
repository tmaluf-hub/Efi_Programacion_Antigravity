import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { dataService } from '../services/dataService.js';
import { renderProductCard, attachAddToCartListeners } from '../components/productCard.js';
import { renderFairCard } from '../components/fairCard.js';
import { initScrollAnimations } from '../utils/formatters.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  // 1. Cargar productos destacados
  const allProducts = dataService.getProducts();
  const featuredProducts = allProducts.filter(p => p.isPromoted).slice(0, 4);
  const productsContainer = document.getElementById('home-featured-products');
  if (productsContainer) {
    if (featuredProducts.length > 0) {
      productsContainer.innerHTML = featuredProducts.map(p => renderProductCard(p)).join('');
      attachAddToCartListeners(allProducts);
    } else {
      productsContainer.innerHTML = '<p class="col-span-full text-center text-sm text-ink-muted">No hay productos destacados activos en este momento.</p>';
    }
  }

  // 2. Cargar próximas ferias
  const allFairs = dataService.getFairs();
  const fairsContainer = document.getElementById('home-fairs-grid');
  if (fairsContainer) {
    fairsContainer.innerHTML = allFairs.slice(0, 3).map(f => renderFairCard(f)).join('');
  }

  // 3. Cargar emprendimientos destacados (vidriera en Home)
  const allMerchants = dataService.getMerchants();
  const featuredMerchants = allMerchants.filter(m => m.featured).slice(0, 4);
  const merchantsContainer = document.getElementById('home-merchants-grid');
  if (merchantsContainer) {
    merchantsContainer.innerHTML = featuredMerchants.map(m => `
      <article class="card-surface p-5 text-center flex flex-col items-center justify-between hover:shadow-md transition-all group">
        <div class="relative w-24 h-24 mb-4">
          <img src="${m.avatar}" alt="${m.name}" class="w-full h-full rounded-2xl object-cover border-2 border-sand shadow-inner group-hover:scale-105 transition-transform">
          <span class="absolute -bottom-1 -right-1 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">★ Verificado</span>
        </div>
        <div class="space-y-1">
          <span class="text-xs text-accent font-semibold uppercase tracking-wider">${m.category}</span>
          <h3 class="text-lg font-bold text-ink dark:text-white font-heading">${m.name}</h3>
          <p class="text-xs text-ink-muted dark:text-slate-300 line-clamp-2 px-2 mt-1 leading-relaxed">${m.bio}</p>
          <p class="text-[11px] text-ink-light dark:text-slate-400 mt-2">📍 ${m.neighborhood}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-sand/30 dark:border-slate-700/60 w-full">
          <a href="./pages/emprendimiento.html?id=${m.id}" class="btn-outline text-xs w-full py-2">
            Ver Emprendimiento
          </a>
        </div>
      </article>
    `).join('');
  }

  // Iniciar animaciones suaves
  initScrollAnimations();
});
