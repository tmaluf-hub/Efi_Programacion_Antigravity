import { auth } from '../services/auth.js';
import { cart } from '../services/cart.js';
import { initThemeToggle } from './themeToggle.js';

export function renderNavbar(currentPath = '') {
  const user = auth.getCurrentUser();
  const cartCount = cart.getCount();

  // Helper para saber qué ruta es relativa al nivel de la página
  const isInsidePages = window.location.pathname.includes('/pages/');
  const isDeepLevel = window.location.pathname.includes('/usuario/') || 
                      window.location.pathname.includes('/feriante/') || 
                      window.location.pathname.includes('/organizador/');
  
  const rootPrefix = isDeepLevel ? '../../' : isInsidePages ? '../' : './';
  const pagesPrefix = isDeepLevel ? '../' : isInsidePages ? './' : './pages/';

  const roleBadge = user ? `
    <span class="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-accent/20 text-accent uppercase tracking-wider">
      ${user.role}
    </span>
  ` : '';

  let panelLink = '';
  if (user) {
    if (user.role === 'usuario') panelLink = `${pagesPrefix}usuario/index.html`;
    else if (user.role === 'feriante') panelLink = `${pagesPrefix}feriante/index.html`;
    else if (user.role === 'organizador') panelLink = `${pagesPrefix}organizador/index.html`;
  }

  const html = `
  <header class="sticky top-0 z-40 bg-primary/95 dark:bg-slate-900/95 backdrop-blur-md text-white border-b border-sand/20 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Logo -->
        <a href="${rootPrefix}index.html" class="flex items-center space-x-3 group">
          <div class="w-10 h-10 rounded-xl bg-primary-dark dark:bg-slate-800 flex items-center justify-center border border-sand/30 shadow-inner group-hover:scale-105 transition-transform">
            <span class="text-xl">🎪</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-extrabold tracking-tight text-white font-heading">
              FERIA<span class="text-accent">ZONE</span>
            </span>
            <span class="text-[10px] text-sand-light tracking-wider uppercase font-medium -mt-1">Río Cuarto</span>
          </div>
        </a>

        <!-- Links Desktop -->
        <nav class="hidden md:flex items-center space-x-1 lg:space-x-2">
          <a href="${rootPrefix}index.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-100 hover:text-white hover:bg-white/10 transition-colors">
            Inicio
          </a>
          <a href="${pagesPrefix}catalogo.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-100 hover:text-white hover:bg-white/10 transition-colors">
            Catálogo
          </a>
          <a href="${pagesPrefix}ferias.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-100 hover:text-white hover:bg-white/10 transition-colors">
            Ferias
          </a>
          <a href="${pagesPrefix}mapa.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-100 hover:text-white hover:bg-white/10 transition-colors">
            Mapa
          </a>
          <a href="${pagesPrefix}planes.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-100 hover:text-white hover:bg-white/10 transition-colors">
            Planes
          </a>
          <a href="${pagesPrefix}nosotros.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-100 hover:text-white hover:bg-white/10 transition-colors">
            Nosotros
          </a>
          <a href="${pagesPrefix}contacto.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-100 hover:text-white hover:bg-white/10 transition-colors">
            Contacto
          </a>
        </nav>

        <!-- Acciones Derecha -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          
          <!-- Carrito con Badge -->
          <a href="${pagesPrefix}carrito.html" 
             class="relative inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-sand-light hover:text-white transition-colors"
             aria-label="Ver carrito de compras">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <span id="nav-cart-badge" class="${cartCount > 0 ? '' : 'hidden'} absolute -top-1 -right-1 bg-accent text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
              ${cartCount}
            </span>
          </a>

          <!-- Botón de Modo Oscuro -->
          <button id="theme-toggle-btn"
                  class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-sand-light hover:text-white transition-colors border border-sand/20"
                  aria-label="Alternar tema">
            <svg class="sun-icon w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" stroke-width="2"></circle>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
            </svg>
            <svg class="moon-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </button>

          <!-- Perfil / Login -->
          ${user ? `
            <div class="relative group">
              <a href="${panelLink}" class="flex items-center space-x-2 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <img src="${user.avatar}" alt="${user.name}" class="w-8 h-8 rounded-lg object-cover border border-sand/40">
                <div class="hidden xl:flex flex-col text-left">
                  <span class="text-xs font-semibold leading-tight">${user.name.split(' ')[0]}</span>
                  ${roleBadge}
                </div>
              </a>
            </div>
            <button id="nav-logout-btn" title="Cerrar sesión" class="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-rose-600/80 text-sand-light hover:text-white text-xs transition-colors">
              ✕
            </button>
          ` : `
            <a href="${pagesPrefix}login.html" class="btn-accent text-sm py-2 px-4 shadow">
              Ingresar
            </a>
          `}

          <!-- Botón Menú Mobile -->
          <button id="mobile-menu-btn" class="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 text-white hover:bg-white/20">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

        </div>

      </div>
    </div>

    <!-- Menú desplegable Mobile -->
    <div id="mobile-menu" class="hidden md:hidden border-t border-sand/20 bg-primary-dark/95 dark:bg-slate-900/95 px-4 pt-3 pb-6 space-y-2">
      <a href="${rootPrefix}index.html" class="block px-3 py-2.5 rounded-lg text-base font-medium text-white hover:bg-white/10">Inicio</a>
      <a href="${pagesPrefix}catalogo.html" class="block px-3 py-2.5 rounded-lg text-base font-medium text-white hover:bg-white/10">Catálogo</a>
      <a href="${pagesPrefix}ferias.html" class="block px-3 py-2.5 rounded-lg text-base font-medium text-white hover:bg-white/10">Ferias</a>
      <a href="${pagesPrefix}mapa.html" class="block px-3 py-2.5 rounded-lg text-base font-medium text-white hover:bg-white/10">Mapa Interactivo</a>
      <a href="${pagesPrefix}planes.html" class="block px-3 py-2.5 rounded-lg text-base font-medium text-white hover:bg-white/10">Planes y Promociones</a>
      <a href="${pagesPrefix}nosotros.html" class="block px-3 py-2.5 rounded-lg text-base font-medium text-white hover:bg-white/10">Quiénes Somos</a>
      <a href="${pagesPrefix}contacto.html" class="block px-3 py-2.5 rounded-lg text-base font-medium text-white hover:bg-white/10">Contacto</a>
      ${user ? `
        <div class="pt-3 border-t border-sand/20 flex items-center justify-between">
          <a href="${panelLink}" class="text-accent font-semibold text-sm">Ir a mi Panel (${user.role})</a>
          <button id="mobile-logout-btn" class="text-xs text-rose-400 font-medium">Cerrar sesión</button>
        </div>
      ` : `
        <div class="pt-3 border-t border-sand/20">
          <a href="${pagesPrefix}login.html" class="block text-center btn-accent w-full">Ingresar a FeriaZone</a>
        </div>
      `}
    </div>
  </header>
  `;

  const mountPoint = document.getElementById('navbar-placeholder') || document.body.firstElementChild;
  if (document.getElementById('navbar-placeholder')) {
    document.getElementById('navbar-placeholder').outerHTML = html;
  } else {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.prepend(wrapper.firstElementChild);
  }

  // Inicializar handlers
  initThemeToggle('theme-toggle-btn');

  // Menú mobile toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  // Logout
  const handleLogout = () => {
    auth.logout();
    window.location.reload();
  };
  document.getElementById('nav-logout-btn')?.addEventListener('click', handleLogout);
  document.getElementById('mobile-logout-btn')?.addEventListener('click', handleLogout);

  // Escuchar cambios en carrito para actualizar el badge en vivo
  cart.onChange((items, count) => {
    const badge = document.getElementById('nav-cart-badge');
    if (badge) {
      badge.textContent = count;
      if (count > 0) badge.classList.remove('hidden');
      else badge.classList.add('hidden');
    }
  });
}
