import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { cart } from '../services/cart.js';
import { dataService } from '../services/dataService.js';
import { formatCurrency } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  const wrapper = document.getElementById('cart-content-wrapper');

  function renderCartView() {
    const items = cart.getItems();
    const totalPrice = cart.getTotalPrice();

    if (items.length === 0) {
      wrapper.innerHTML = `
        <div class="card-surface p-12 text-center space-y-4 max-w-lg mx-auto">
          <span class="text-5xl">🛍️</span>
          <h2 class="text-2xl font-bold text-ink dark:text-white">Tu carrito está vacío</h2>
          <p class="text-sm text-ink-muted dark:text-slate-300">
            Aún no agregaste productos de las ferias de Río Cuarto.
          </p>
          <a href="./catalogo.html" class="btn-accent inline-block mt-2">
            Explorar Catálogo
          </a>
        </div>
      `;
      return;
    }

    wrapper.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Lista de productos en carrito -->
        <div class="lg:col-span-8 space-y-4">
          <div class="card-surface divide-y divide-sand/30 dark:divide-slate-700/60 overflow-hidden border border-sand/40">
            ${items.map(item => `
              <div class="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center space-x-4 w-full sm:w-auto">
                  <img src="${item.image}" alt="${item.name}" class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-sand/40">
                  <div>
                    <span class="text-[11px] text-accent font-semibold uppercase tracking-wider block">${item.merchantName}</span>
                    <h3 class="text-base font-bold text-ink dark:text-white">${item.name}</h3>
                    <span class="text-sm font-extrabold text-accent font-heading">${formatCurrency(item.price)}</span>
                  </div>
                </div>

                <div class="flex items-center justify-between w-full sm:w-auto sm:space-x-6">
                  <!-- Control de cantidad -->
                  <div class="flex items-center border border-sand/60 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 p-1">
                    <button data-id="${item.id}" class="cart-minus w-8 h-8 flex items-center justify-center font-bold text-ink dark:text-white hover:bg-sand/30 rounded-lg">-</button>
                    <span class="font-bold text-ink dark:text-white px-3 text-sm">${item.quantity}</span>
                    <button data-id="${item.id}" class="cart-plus w-8 h-8 flex items-center justify-center font-bold text-ink dark:text-white hover:bg-sand/30 rounded-lg">+</button>
                  </div>

                  <!-- Subtotal -->
                  <div class="text-right">
                    <span class="text-xs text-ink-light dark:text-slate-400 block">Subtotal</span>
                    <span class="text-base font-bold text-ink dark:text-white">${formatCurrency(item.price * item.quantity)}</span>
                  </div>

                  <!-- Eliminar -->
                  <button data-id="${item.id}" class="cart-remove text-rose-500 hover:text-rose-700 p-2 text-sm font-bold" title="Eliminar producto">
                    ✕
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="flex justify-between items-center pt-2">
            <a href="./catalogo.html" class="text-xs font-semibold text-accent hover:underline">
              ← Seguir agregando productos
            </a>
            <button id="cart-clear-all" class="text-xs text-rose-500 hover:underline">
              Vaciar carrito
            </button>
          </div>
        </div>

        <!-- Checkout Simulado -->
        <div class="lg:col-span-4">
          <div class="card-surface p-6 space-y-6 border border-sand/40 sticky top-24">
            <h3 class="text-xl font-bold text-ink dark:text-white font-heading border-b border-sand/30 pb-3">
              Resumen del Pedido
            </h3>

            <div class="space-y-3 text-sm text-ink-muted dark:text-slate-300">
              <div class="flex justify-between">
                <span>Total productos:</span>
                <span class="font-bold text-ink dark:text-white">${cart.getCount()}</span>
              </div>
              <div class="flex justify-between">
                <span>Comisión de plataforma:</span>
                <span class="text-emerald-600 font-bold">$0 (Sin comisión)</span>
              </div>
              <div class="pt-3 border-t border-sand/30 flex justify-between text-base">
                <span class="font-bold text-ink dark:text-white">Total a abonar:</span>
                <span class="text-2xl font-black text-accent font-heading">${formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <!-- Formulario de Checkout simulado -->
            <form id="checkout-form" class="space-y-3 pt-2">
              <span class="text-xs font-bold text-ink-light dark:text-slate-400 uppercase tracking-wider block">
                Datos para coordinar retiro / entrega
              </span>

              <div>
                <label for="buyer-name" class="block text-xs font-semibold text-ink dark:text-white mb-1">Nombre y Apellido</label>
                <input type="text" id="buyer-name" required placeholder="Ej: María Gómez" class="w-full px-3.5 py-2 rounded-xl border border-sand/60 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
              </div>

              <div>
                <label for="buyer-phone" class="block text-xs font-semibold text-ink dark:text-white mb-1">Teléfono / WhatsApp</label>
                <input type="tel" id="buyer-phone" required placeholder="Ej: +54 9 358 4112233" class="w-full px-3.5 py-2 rounded-xl border border-sand/60 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
              </div>

              <div>
                <label for="pickup-method" class="block text-xs font-semibold text-ink dark:text-white mb-1">Punto de Retiro Preferido</label>
                <select id="pickup-method" class="w-full px-3.5 py-2 rounded-xl border border-sand/60 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                  <option value="Feria del Parque Sarmiento">Retirar en Feria del Parque Sarmiento</option>
                  <option value="Paseo de Ferias del Andino">Retirar en Paseo del Andino</option>
                  <option value="Feria de la Costanera">Retirar en Feria de la Costanera</option>
                  <option value="Acordar envío a domicilio en Río Cuarto">Acordar envío a domicilio por WhatsApp</option>
                </select>
              </div>

              <button type="submit" class="btn-accent w-full text-base py-3 shadow-md mt-4">
                Confirmar Pedido Simulado
              </button>
            </form>

            <p class="text-[11px] text-ink-light dark:text-slate-400 text-center leading-relaxed">
              🔒 Simulación del EFI de Programación II. No se debitará dinero real. Recibirás un código de pedido para coordinar con el feriante.
            </p>
          </div>
        </div>

      </div>
    `;

    // Asignar listeners
    document.querySelectorAll('.cart-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = items.find(i => i.id === id);
        if (item) cart.updateQuantity(id, item.quantity - 1);
        renderCartView();
      });
    });

    document.querySelectorAll('.cart-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = items.find(i => i.id === id);
        if (item) cart.updateQuantity(id, item.quantity + 1);
        renderCartView();
      });
    });

    document.querySelectorAll('.cart-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        cart.removeItem(id);
        renderCartView();
        showToast('Producto eliminado del carrito', 'info');
      });
    });

    document.getElementById('cart-clear-all')?.addEventListener('click', () => {
      if (confirm('¿Seguro que deseás vaciar el carrito?')) {
        cart.clear();
        renderCartView();
        showToast('Carrito vaciado', 'info');
      }
    });

    // Envío del Checkout
    document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const buyerName = document.getElementById('buyer-name').value;
      const buyerPhone = document.getElementById('buyer-phone').value;
      const pickupMethod = document.getElementById('pickup-method').value;

      const order = dataService.createOrder({
        buyerName,
        buyerPhone,
        pickupMethod,
        total: totalPrice,
        items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price }))
      });

      cart.clear();

      wrapper.innerHTML = `
        <div class="card-surface p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto border-2 border-emerald-500/50 shadow-xl">
          <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mx-auto">
            ✓
          </div>
          <div class="space-y-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600">
              ¡Pedido Registrado con Éxito!
            </span>
            <h2 class="text-2xl sm:text-3xl font-black text-ink dark:text-white font-heading">
              Número de Orden: <span class="text-accent">${order.id}</span>
            </h2>
            <p class="text-sm text-ink-muted dark:text-slate-300 leading-relaxed">
              Gracias <strong>${buyerName}</strong>. Tu pedido ha sido guardado en la plataforma. Podés presentarte con este código en el punto de retiro elegido (<strong>${pickupMethod}</strong>) o comunicarte con el feriante.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-sand/20 dark:bg-slate-800 text-left text-xs space-y-1">
            <p><strong>Total acordado:</strong> ${formatCurrency(order.total)}</p>
            <p><strong>Estado:</strong> ${order.status}</p>
            <p><strong>Contacto comprador:</strong> ${buyerPhone}</p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a href="./catalogo.html" class="btn-accent text-sm py-2.5 px-5">
              Seguir explorando
            </a>
            <a href="./usuario/index.html" class="btn-outline text-sm py-2.5 px-5">
              Ver en mi Historial de Pedidos
            </a>
          </div>
        </div>
      `;
      showToast(`¡Pedido ${order.id} confirmado con éxito!`, 'success');
    });
  }

  renderCartView();
});
