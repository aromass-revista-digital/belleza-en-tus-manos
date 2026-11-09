import { ICONS } from './icons';
import { promptPwaInstall } from './pwaManager';

export function showShareAppModal() {
  const currentUrl = window.location.origin;
  const shareTitle = 'Belleza en tus Manos – Distribuidora Digital de Cosmética';
  const shareText = 'Instalá la PWA de Belleza en tus Manos o navegá el catálogo oficial de Natura y AVON con entregas a domicilio y precios congelados.';

  const modal = document.createElement('div');
  modal.className = 'bem-modal-backdrop';
  modal.innerHTML = `
    <div class="bem-modal-box" style="max-width: 500px; text-align: center;">
      <button id="btn-close-share" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6A635E; cursor: pointer;">&times;</button>
      <div style="width: 56px; height: 56px; margin: 0 auto 0.75rem; border-radius: 16px; background: #F3DDD9; display: flex; align-items: center; justify-content: center;">
        ${ICONS.logo}
      </div>
      <h2 class="font-serif" style="font-size: 1.4rem; color: #24201E; font-weight: 700; margin-bottom: 0.25rem;">
        Compartir e Instalar la Aplicación
      </h2>
      <p style="font-size: 0.85rem; color: #6A635E; margin-bottom: 1.25rem;">
        Llevá Belleza en tus Manos a tus clientas y revendedoras en cualquier dispositivo Android o computadora.
      </p>

      <!-- PWA Install Button -->
      <div style="background: linear-gradient(135deg, #FAF3EA 0%, #FDFBF7 100%); border: 1px solid var(--c-champagne); border-radius: 14px; padding: 1rem; margin-bottom: 1.25rem;">
        <div style="font-size: 0.9rem; font-weight: 700; color: #24201E; margin-bottom: 0.25rem;">
          📱 Instalación Directa PWA en Celular
        </div>
        <p style="font-size: 0.78rem; color: #6A635E; margin-bottom: 0.75rem;">
          Sin descargas pesadas de tiendas. Funciona sin conexión, rápida y segura.
        </p>
        <button class="btn btn-primary" id="btn-install-from-modal" style="width: 100%;">
          ${ICONS.download} Instalar en Pantalla de Inicio
        </button>
      </div>

      <!-- Share Channels Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; margin-bottom: 1.25rem;">
        <button class="btn btn-outline" id="btn-share-native" style="font-size: 0.8rem;">
          📲 Menú Nativo del Celular
        </button>
        <button class="btn btn-primary" id="btn-share-modal-wa" style="background: #25D366; color: #FFF; border-color: #25D366; font-size: 0.8rem;">
          ${ICONS.whatsapp} WhatsApp
        </button>
        <button class="btn btn-outline" id="btn-share-fb" style="font-size: 0.8rem;">
          Facebook
        </button>
        <button class="btn btn-outline" id="btn-share-copy-link" style="font-size: 0.8rem;">
          ${ICONS.share} Copiar Enlace
        </button>
      </div>

      <div style="background: #FAF7F5; padding: 0.75rem; border-radius: 10px; font-size: 0.75rem; color: #6A635E;">
        Enlace directo: <strong style="color: #24201E;">${currentUrl}</strong>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#btn-close-share')?.addEventListener('click', () => modal.remove());

  modal.querySelector('#btn-install-from-modal')?.addEventListener('click', async () => {
    modal.remove();
    await promptPwaInstall();
  });

  modal.querySelector('#btn-share-native')?.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(currentUrl);
      alert('Enlace copiado al portapapeles: ' + currentUrl);
    }
  });

  modal.querySelector('#btn-share-modal-wa')?.addEventListener('click', () => {
    const msg = `${shareText} ${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  });

  modal.querySelector('#btn-share-fb')?.addEventListener('click', () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  });

  modal.querySelector('#btn-share-copy-link')?.addEventListener('click', () => {
    navigator.clipboard.writeText(currentUrl);
    alert('¡Enlace de Belleza en tus Manos copiado!');
  });
}
