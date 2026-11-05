import { formatCurrency } from '../utils/formatters.js';
import { cart } from '../services/cart.js';
import { showToast } from './toast.js';

/**
 * Genera el HTML de una tarjeta de producto con diseño artesanal accesible
 */
export function renderProductCard(product, relativePrefix = './') {
  const isInsidePages = window.location.pathname.includes('/pages/');
  const isDeepLevel = window.location.pathname.includes('/usuario/') || 
                      window.location.pathname.includes('/feriante/') || 
                      window.location.pathname.includes('/organizador/');
  
  const pagesPrefix = isDeepLevel ? '../' : isInsidePages ? './' : './pages/';

  return `
  <article class="card-surface overflow-hidden group flex flex-col justify-between hover:shadow-md transition-all duration-200 border border-sand/40 relative">
    
    <!-- Badges Superiores -->
    <div class="absolute top-3 left-3 z-10 flex flex-col gap-1">
      ${product.isPromoted ? `
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-accent text-white shadow-sm">
          ★ Destacado
        </span>
      ` : ''}
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sand/80 text-ink backdrop-blur-sm shadow-xs">
        ${product.category}
      </span>
    </div>

    <!-- Imagen del Producto -->
    <div class="relative h-48 sm:h-52 overflow-hidden bg-sand/20">
      <img 
        src="${product.image}" 
        alt="${product.name}" 
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      >
    </div>

    <!-- Contenido y Metadatos -->
    <div class="p-4 sm:p-5 flex-grow flex flex-col justify-between">
      <div>
        <a href="${pagesPrefix}emprendimiento.html?id=${product.merchantId}" class="text-xs text-accent hover:underline font-semibold uppercase tracking-wider block mb-1">
          ${product.merchantName}
        </a>
        <h3 class="text-base sm:text-lg font-bold text-ink dark:text-white line-clamp-2 leading-snug group-hover:text-accent transition-colors">
          <a href="${pagesPrefix}producto.html?id=${product.id}">
            ${product.name}
          </a>
        </h3>
        <p class="text-xs text-ink-muted dark:text-slate-300 line-clamp-2 mt-2 leading-relaxed">
          ${product.description}
        </p>
      </div>

      <!-- Precio y Botón Agregar -->
      <div class="mt-4 pt-3 border-t border-sand/30 dark:border-slate-700/60 flex items-center justify-between">
        <div>
          <span class="text-xs text-ink-light dark:text-slate-400 block font-medium">Precio</span>
          <span class="text-lg sm:text-xl font-extrabold text-ink dark:text-white font-heading">
            ${formatCurrency(product.price)}
          </span>
        </div>

        <button 
          type="button"
          data-product-id="${product.id}"
          class="add-to-cart-btn btn-accent px-3.5 py-2 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
          aria-label="Agregar ${product.name} al carrito">
          <span>+</span>
          <span>Carrito</span>
        </button>
      </div>

    </div>
  </article>
  `;
}

/**
 * Inicializa los eventos de clic en los botones de "Agregar al carrito"
 */
export function attachAddToCartListeners(productsList) {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prodId = btn.getAttribute('data-product-id');
      const product = productsList.find(p => p.id === prodId);
      if (product) {
        cart.addItem(product, 1);
        showToast(`Agregaste "${product.name}" al carrito`, 'success');
      }
    });
  });
}
