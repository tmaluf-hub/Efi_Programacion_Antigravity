import { renderNavbar } from '../../components/navbar.js';
import { renderFooter } from '../../components/footer.js';
import { auth } from '../../services/auth.js';
import { dataService } from '../../services/dataService.js';
import { formatCurrency } from '../../utils/formatters.js';
import { showToast } from '../../components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  // Guard de rol feriante
  if (!auth.requireAuth(['feriante'], '../login.html')) return;

  renderNavbar();
  renderFooter();

  const user = auth.getCurrentUser();
  const merchantId = user.merchantId || 'emp-1';
  const merchant = dataService.getMerchantById(merchantId);

  // Render cabecera
  document.getElementById('merchant-title').textContent = merchant ? merchant.name : user.name;
  document.getElementById('merchant-details').textContent = `${merchant ? merchant.artisanName : user.name} · ${merchant ? merchant.neighborhood : 'Río Cuarto'}`;
  document.getElementById('merchant-avatar').src = merchant ? merchant.avatar : user.avatar;

  const planBadge = document.getElementById('merchant-plan-badge');
  const isPlanBasico = user.plan === 'basico';
  planBadge.textContent = isPlanBasico ? 'Plan Básico (Hasta 15)' : 'Plan Pro (Ilimitado)';

  const modal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('product-crud-form');
  const tbody = document.getElementById('merchant-products-tbody');
  const metricCount = document.getElementById('metric-prod-count');

  function renderTable() {
    const allProducts = dataService.getProducts();
    const myProducts = allProducts.filter(p => p.merchantId === merchantId);

    metricCount.textContent = myProducts.length;

    if (myProducts.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="p-6 text-center text-ink-muted">No tenés productos cargados todavía. Agregá el primero con el botón superior.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = myProducts.map(p => `
      <tr class="hover:bg-sand/10 dark:hover:bg-slate-800/50 transition-colors">
        <td class="p-3.5">
          <div class="flex items-center space-x-3">
            <img src="${p.image}" alt="${p.name}" class="w-10 h-10 rounded-lg object-cover border border-sand/40">
            <div>
              <span class="font-bold text-ink dark:text-white block">${p.name}</span>
              ${p.isPromoted ? '<span class="text-[10px] text-accent font-extrabold uppercase">★ En Promoción</span>' : ''}
            </div>
          </div>
        </td>
        <td class="p-3.5 text-ink-muted dark:text-slate-300">${p.category}</td>
        <td class="p-3.5 font-bold text-accent font-heading">${formatCurrency(p.price)}</td>
        <td class="p-3.5 text-ink dark:text-white font-medium">${p.stock} un.</td>
        <td class="p-3.5">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700'}">
            ${p.stock > 0 ? 'En Stock' : 'Agotado'}
          </span>
        </td>
        <td class="p-3.5 text-right space-x-2">
          <button data-id="${p.id}" class="edit-prod-btn text-accent hover:underline font-bold text-xs">Editar</button>
          <button data-id="${p.id}" class="delete-prod-btn text-rose-500 hover:underline font-bold text-xs">Eliminar</button>
        </td>
      </tr>
    `).join('');

    // Listener Editar
    document.querySelectorAll('.edit-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const prod = myProducts.find(p => p.id === id);
        if (prod) openModal(prod);
      });
    });

    // Listener Eliminar
    document.querySelectorAll('.delete-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('¿Deseás eliminar este producto de tu catálogo?')) {
          dataService.deleteProduct(id);
          renderTable();
          showToast('Producto eliminado', 'info');
        }
      });
    });
  }

  function openModal(prod = null) {
    // Control de límite de 15 productos para Plan Básico
    const currentCount = dataService.getProducts().filter(p => p.merchantId === merchantId).length;
    if (!prod && isPlanBasico && currentCount >= 15) {
      alert('Alcanzaste el límite de 15 productos del Plan Básico. Para publicar más artículos, pasate al Plan Pro en la sección de Planes.');
      window.location.href = '../planes.html';
      return;
    }

    form.reset();
    if (prod) {
      modalTitle.textContent = 'Editar Producto';
      document.getElementById('prod-form-id').value = prod.id;
      document.getElementById('prod-form-name').value = prod.name;
      document.getElementById('prod-form-category').value = prod.category;
      document.getElementById('prod-form-price').value = prod.price;
      document.getElementById('prod-form-stock').value = prod.stock;
      document.getElementById('prod-form-fair').value = prod.fairId;
      document.getElementById('prod-form-image').value = prod.image;
      document.getElementById('prod-form-desc').value = prod.description;
    } else {
      modalTitle.textContent = 'Agregar Nuevo Producto';
      document.getElementById('prod-form-id').value = '';
    }
    modal.classList.remove('hidden');
  }

  function closeModal() {
    modal.classList.add('hidden');
  }

  document.getElementById('open-new-prod-btn')?.addEventListener('click', () => openModal());
  document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('cancel-modal-btn')?.addEventListener('click', closeModal);

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('prod-form-id').value;
    const name = document.getElementById('prod-form-name').value;
    const category = document.getElementById('prod-form-category').value;
    const price = parseInt(document.getElementById('prod-form-price').value, 10);
    const stock = parseInt(document.getElementById('prod-form-stock').value, 10);
    const fairId = document.getElementById('prod-form-fair').value;
    const image = document.getElementById('prod-form-image').value;
    const description = document.getElementById('prod-form-desc').value;

    const payload = {
      name,
      category,
      price,
      stock,
      fairId,
      image,
      description,
      merchantId,
      merchantName: merchant ? merchant.name : user.name
    };

    if (id) payload.id = id;

    dataService.saveProduct(payload);
    closeModal();
    renderTable();
    showToast(`Producto "${name}" guardado con éxito`, 'success');
  });

  // Render ferias para postularse
  const applyList = document.getElementById('fairs-apply-list');
  if (applyList) {
    const fairs = dataService.getFairs();
    applyList.innerHTML = fairs.slice(0, 3).map(f => `
      <div class="p-3.5 rounded-xl border border-sand/30 bg-cream dark:bg-slate-800/50 flex items-center justify-between gap-3 text-xs">
        <div>
          <p class="font-bold text-ink dark:text-white">${f.name}</p>
          <p class="text-ink-muted dark:text-slate-400">🕒 ${f.schedule}</p>
        </div>
        <button class="apply-fair-btn btn-accent text-[11px] py-1.5 px-3 whitespace-nowrap" data-fair="${f.name}">
          Inscribirme
        </button>
      </div>
    `).join('');

    document.querySelectorAll('.apply-fair-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const fairName = btn.getAttribute('data-fair');
        btn.textContent = '✓ Inscripto';
        btn.disabled = true;
        btn.classList.replace('btn-accent', 'btn-outline');
        showToast(`Te postulaste exitosamente a "${fairName}". El organizador revisará tu solicitud.`, 'success');
      });
    });
  }

  renderTable();
});
