import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { dataService } from '../services/dataService.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { cart } from '../services/cart.js';
import { showToast } from '../components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  const container = document.getElementById('product-detail-container');
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'prod-1';

  const product = dataService.getProductById(productId);

  if (!product) {
    container.innerHTML = `
      <div class="card-surface p-12 text-center space-y-4 max-w-xl mx-auto">
        <span class="text-4xl">⚠️</span>
        <h2 class="text-2xl font-bold text-ink dark:text-white">Producto no encontrado</h2>
        <p class="text-sm text-ink-muted dark:text-slate-300">El producto que estás buscando no existe o fue dado de baja por el feriante.</p>
        <a href="./catalogo.html" class="btn-accent inline-block">Volver al catálogo</a>
      </div>
    `;
    return;
  }

  const merchant = dataService.getMerchantById(product.merchantId);
  const fair = dataService.getFairById(product.fairId);
  const reviews = dataService.getReviews().products.filter(r => r.productId === product.id);

  // Armar mensaje directo de WhatsApp
  const whatsappMsg = encodeURIComponent(
    `¡Hola ${merchant ? merchant.name : ''}! Vi en FeriaZone tu producto "${product.name}" (${formatCurrency(product.price)}) y quería consultar disponibilidad para coordinar la compra.`
  );
  const whatsappUrl = merchant ? `https://wa.me/${merchant.phone.replace(/[^0-9]/g, '')}?text=${whatsappMsg}` : '#';

  container.innerHTML = `
    <!-- Migas de pan (Breadcrumb) -->
    <nav class="flex items-center space-x-2 text-xs text-ink-light dark:text-slate-400 mb-6">
      <a href="../index.html" class="hover:text-accent">Inicio</a>
      <span>/</span>
      <a href="./catalogo.html" class="hover:text-accent">Catálogo</a>
      <span>/</span>
      <span class="text-ink dark:text-white font-medium truncate max-w-xs">${product.name}</span>
    </nav>

    <!-- Ficha Principal de Producto -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      
      <!-- Columna Izquierda: Imagen y Badges -->
      <div class="lg:col-span-6 space-y-4">
        <div class="relative rounded-3xl overflow-hidden bg-sand/20 border border-sand/40 dark:border-slate-800 shadow-md">
          <img src="${product.image}" alt="${product.name}" class="w-full h-80 sm:h-[450px] object-cover">
          ${product.isPromoted ? `
            <span class="absolute top-4 left-4 bg-accent text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md">
              ★ Producto Destacado
            </span>
          ` : ''}
        </div>
      </div>

      <!-- Columna Derecha: Información y Acciones -->
      <div class="lg:col-span-6 space-y-6 flex flex-col justify-between">
        <div class="space-y-4">
          
          <!-- Categoría y Feriante -->
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-sand/60 text-ink dark:bg-slate-800 dark:text-sand-light">
              ${product.category}
            </span>
            <span class="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              ✓ Stock disponible: ${product.stock} unidades
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-ink dark:text-white font-heading leading-tight">
            ${product.name}
          </h1>

          <!-- Precio -->
          <div class="p-4 rounded-2xl bg-cream dark:bg-slate-800/80 border border-sand/30 flex items-center justify-between">
            <div>
              <span class="text-xs text-ink-light dark:text-slate-400 block font-medium">Precio en pesos</span>
              <span class="text-3xl font-extrabold text-accent font-heading">
                ${formatCurrency(product.price)}
              </span>
            </div>
            <span class="text-xs text-ink-muted dark:text-slate-300">Sin comisiones agregadas</span>
          </div>

          <!-- Descripción completa -->
          <div class="space-y-2">
            <h3 class="text-sm font-bold text-ink dark:text-white uppercase tracking-wider">Descripción del producto</h3>
            <p class="text-sm sm:text-base text-ink-muted dark:text-slate-300 leading-relaxed">
              ${product.description}
            </p>
          </div>

          <!-- Selector de cantidad y Botón Carrito -->
          <div class="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <div class="flex items-center border border-sand/60 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 p-1 w-full sm:w-36 justify-between">
              <button id="qty-minus" class="w-10 h-10 flex items-center justify-center font-bold text-ink dark:text-white hover:bg-sand/30 rounded-lg text-lg">-</button>
              <span id="qty-value" class="font-bold text-ink dark:text-white px-2">1</span>
              <button id="qty-plus" class="w-10 h-10 flex items-center justify-center font-bold text-ink dark:text-white hover:bg-sand/30 rounded-lg text-lg">+</button>
            </div>

            <button id="detail-add-cart-btn" class="btn-accent w-full sm:flex-grow text-base py-3 shadow-md">
              Agregar al Carrito
            </button>
          </div>

          <!-- Botón de Contacto por WhatsApp -->
          <div>
            <a href="${whatsappUrl}" target="_blank" class="w-full inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm gap-2">
              <span>💬</span>
              <span>Encargar directo al Feriante por WhatsApp</span>
            </a>
          </div>

        </div>

        <!-- Tarjeta del Emprendedor Asociado -->
        ${merchant ? `
          <div class="card-surface p-4 border border-sand/40 flex items-center justify-between gap-4 mt-6">
            <div class="flex items-center space-x-3">
              <img src="${merchant.avatar}" alt="${merchant.name}" class="w-12 h-12 rounded-xl object-cover border border-sand">
              <div>
                <span class="text-xs text-ink-light dark:text-slate-400">Elaborado por</span>
                <h4 class="font-bold text-sm text-ink dark:text-white font-heading">${merchant.name}</h4>
                <p class="text-xs text-accent">${merchant.neighborhood}</p>
              </div>
            </div>
            <a href="./emprendimiento.html?id=${merchant.id}" class="btn-outline text-xs py-2 px-3">
              Ver perfil
            </a>
          </div>
        ` : ''}

        <!-- Feria de retiro habitual -->
        ${fair ? `
          <div class="p-3.5 rounded-xl bg-sand/20 dark:bg-slate-800 text-xs text-ink dark:text-slate-300 flex items-center gap-2">
            <span>🎪</span>
            <span>Retiro habitual en: <strong>${fair.name}</strong> (${fair.schedule})</span>
          </div>
        ` : ''}

      </div>
    </div>

    <!-- SECCIÓN DE RESEÑAS -->
    <section class="mt-16 pt-12 border-t border-sand/30 dark:border-slate-800 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-2xl font-bold text-ink dark:text-white font-heading">Opiniones de compradores</h3>
          <p class="text-xs text-ink-muted dark:text-slate-400">Reseñas de vecinos que ya probaron este producto.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${reviews.length > 0 ? reviews.map(r => `
          <div class="card-surface p-4 space-y-2 border border-sand/30">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-ink dark:text-white">${r.author}</span>
              <span class="text-xs text-accent font-bold">★ ${r.rating} / 5</span>
            </div>
            <p class="text-xs text-ink-muted dark:text-slate-300 leading-relaxed">${r.comment}</p>
            <span class="text-[10px] text-ink-light dark:text-slate-400 block">${formatDate(r.date)}</span>
          </div>
        `).join('') : `
          <p class="col-span-full text-sm text-ink-muted">Aún no hay reseñas para este producto. ¡Sé el primero en dejar una al comprar!</p>
        `}
      </div>
    </section>
  `;

  // Control de cantidad
  let currentQty = 1;
  const qtyValue = document.getElementById('qty-value');
  const minusBtn = document.getElementById('qty-minus');
  const plusBtn = document.getElementById('qty-plus');

  minusBtn?.addEventListener('click', () => {
    if (currentQty > 1) {
      currentQty--;
      qtyValue.textContent = currentQty;
    }
  });

  plusBtn?.addEventListener('click', () => {
    if (currentQty < product.stock) {
      currentQty++;
      qtyValue.textContent = currentQty;
    } else {
      showToast('Alcanzaste el límite de stock disponible', 'error');
    }
  });

  // Agregar al carrito
  document.getElementById('detail-add-cart-btn')?.addEventListener('click', () => {
    cart.addItem(product, currentQty);
    showToast(`Agregaste ${currentQty} unidad(es) de "${product.name}" al carrito`, 'success');
  });
});
