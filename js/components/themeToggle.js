import { storage } from '../services/storage.js';

const STORAGE_KEY = 'fz_theme';

export function initThemeToggle(buttonId = 'theme-toggle-btn') {
  const toggleBtn = document.getElementById(buttonId);
  if (!toggleBtn) return;

  function updateAria(isDark) {
    toggleBtn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    toggleBtn.setAttribute('title', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    
    // Si contiene íconos de sol / luna
    const sunIcon = toggleBtn.querySelector('.sun-icon');
    const moonIcon = toggleBtn.querySelector('.moon-icon');
    if (sunIcon && moonIcon) {
      if (isDark) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      }
    }
  }

  const isDarkInitial = document.documentElement.classList.contains('dark');
  updateAria(isDarkInitial);

  toggleBtn.addEventListener('click', () => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    const willBeDark = !isCurrentlyDark;

    if (willBeDark) {
      document.documentElement.classList.add('dark');
      storage.set(STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      storage.set(STORAGE_KEY, 'light');
    }

    updateAria(willBeDark);
  });
}
