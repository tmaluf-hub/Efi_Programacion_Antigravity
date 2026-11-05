export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full px-4';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' 
    ? 'bg-emerald-600 text-white' 
    : type === 'error' 
    ? 'bg-rose-600 text-white' 
    : 'bg-primary text-white';

  toast.className = `${bgClass} p-4 rounded-xl shadow-lg border border-white/10 flex items-center justify-between transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto`;
  toast.innerHTML = `
    <div class="flex items-center space-x-3">
      <span class="text-xl">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <p class="text-sm font-medium">${message}</p>
    </div>
  `;

  container.appendChild(toast);

  // Animar entrada
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  // Salida automática a los 3.5 segundos
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
