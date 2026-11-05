import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { dataService } from '../services/dataService.js';
import { calculateDistanceKm } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';
import { SITE_CONFIG } from '../config/site.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  const fairs = dataService.getFairs();
  const closestBtn = document.getElementById('find-closest-btn');
  const closestBox = document.getElementById('closest-result-box');
  const closestName = document.getElementById('closest-name');
  const closestDist = document.getElementById('closest-dist');
  const closestLink = document.getElementById('closest-link');

  if (!window.L) {
    console.error('Leaflet no pudo cargarse');
    return;
  }

  // Centrar por defecto en Río Cuarto
  const defaultCoords = SITE_CONFIG.defaultCoords;
  const map = L.map('fairs-map').setView([defaultCoords.lat, defaultCoords.lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap - FeriaZone Río Cuarto'
  }).addTo(map);

  // Agregar marcadores para cada feria
  const markers = [];
  fairs.forEach(fair => {
    const marker = L.marker([fair.lat, fair.lng]).addTo(map);
    marker.bindPopup(`
      <div style="font-family: inherit; font-size: 13px; max-width: 200px;">
        <strong style="color: #3F4E63;">${fair.name}</strong><br>
        <span style="color: #B8654A; font-weight: 600;">📍 ${fair.zone}</span><br>
        <span style="font-size: 11px; color: #666;">${fair.schedule}</span><br>
        <div style="margin-top: 6px;">
          <a href="./feria.html?id=${fair.id}" style="color: #B8654A; font-weight: bold; text-decoration: underline;">Ver ficha completa</a>
        </div>
      </div>
    `);
    markers.push({ fair, marker });
  });

  // Geolocalización: Feria más cercana a mí
  closestBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showToast('Tu navegador no soporta geolocalización', 'error');
      fallbackToCenter();
      return;
    }

    closestBtn.disabled = true;
    closestBtn.innerHTML = '<span>⏳</span><span>Buscando tu posición...</span>';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Marcador del usuario
        const userIcon = L.divIcon({
          className: 'user-marker',
          html: '<div style="background-color: #B8654A; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">👤</div>',
          iconSize: [28, 28]
        });

        L.marker([userLat, userLng], { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>Tu ubicación actual</b>')
          .openPopup();

        // Calcular feria más cercana
        let minDistance = Infinity;
        let closestFair = null;

        fairs.forEach(f => {
          const dist = calculateDistanceKm(userLat, userLng, f.lat, f.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closestFair = f;
          }
        });

        if (closestFair) {
          closestBox.classList.remove('hidden');
          closestName.textContent = closestFair.name;
          closestDist.textContent = `Aproximadamente a ${minDistance} km de tu ubicación (${closestFair.zone} - ${closestFair.locationName})`;
          closestLink.href = `./feria.html?id=${closestFair.id}`;

          map.setView([closestFair.lat, closestFair.lng], 15);
          showToast(`La feria más cercana es "${closestFair.name}"`, 'success');
        }

        closestBtn.disabled = false;
        closestBtn.innerHTML = '<span>📍</span><span>Feria más cercana a mí</span>';
      },
      (error) => {
        console.warn('Permiso de geolocalización denegado o error:', error);
        showToast('No pudimos acceder a tu GPS. Centrando en Río Cuarto.', 'info');
        fallbackToCenter();
        closestBtn.disabled = false;
        closestBtn.innerHTML = '<span>📍</span><span>Feria más cercana a mí</span>';
      },
      { timeout: 7000 }
    );
  });

  function fallbackToCenter() {
    map.setView([defaultCoords.lat, defaultCoords.lng], 13);
  }
});
