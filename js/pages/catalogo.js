import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { dataService } from '../services/dataService.js';
import { renderProductCard, attachAddToCartListeners } from '../components/productCard.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  const allProducts = dataService.getProducts();
  const searchInput = document.getElementById('filter-search');
  const categorySelect = document.getElementById('filter-category');
  const fairSelect = document.getElementById('filter-fair');
  const sortSelect = document.getElementById('filter-sort');
  const clearBtn = document.getElementById('clear-filters-btn');
  const gridContainer = document.getElementById('catalog-products-grid');
  const countLabel = document.getElementById('catalog-count');

  // Si viene con parámetro en URL ?categoria= o ?feria=
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('categoria')) {
    categorySelect.value = urlParams.get('categoria');
  }
  if (urlParams.get('feria')) {
    fairSelect.value = urlParams.get('feria');
  }

  function applyFilters() {
    const query = (searchInput.value || '').trim().toLowerCase();
    const category = categorySelect.value;
    const fair = fairSelect.value;
    const sort = sortSelect.value;

    let filtered = allProducts.filter(p => {
      const matchesQuery = !query || 
        p.name.toLowerCase().includes(query) || 
        p.merchantName.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query)));

      const matchesCategory = category === 'all' || p.category === category;
      const matchesFair = fair === 'all' || p.fairId === fair;

      return matchesQuery && matchesCategory && matchesFair;
    });

    // Ordenamiento
    if (sort === 'promoted-first') {
      filtered.sort((a, b) => (b.isPromoted ? 1 : 0) - (a.isPromoted ? 1 : 0));
    } else if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    countLabel.textContent = `${filtered.length} producto${filtered.length === 1 ? '' : 's'} encontrado${filtered.length === 1 ? '' : 's'}`;

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div class="col-span-full card-surface p-12 text-center space-y-3">
          <span class="text-4xl">🔍</span>
          <h3 class="text-lg font-bold text-ink dark:text-white">No encontramos productos con esos filtros</h3>
          <p class="text-sm text-ink-muted dark:text-slate-400">Probá modificando las palabras clave o seleccionando otra categoría.</p>
        </div>
      `;
    } else {
      gridContainer.innerHTML = filtered.map(p => renderProductCard(p, '../')).join('');
      attachAddToCartListeners(filtered);
    }
  }

  // Event Listeners
  searchInput.addEventListener('input', applyFilters);
  categorySelect.addEventListener('change', applyFilters);
  fairSelect.addEventListener('change', applyFilters);
  sortSelect.addEventListener('change', applyFilters);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    categorySelect.value = 'all';
    fairSelect.value = 'all';
    sortSelect.value = 'promoted-first';
    applyFilters();
  });

  applyFilters();
});
