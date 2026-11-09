// PWA Manager for In-App Install Prompt & Installation Instructions (Android & iPhone)

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let isInstalled = false;
let isIOSDevice = false;
let isAndroidDevice = false;

export function initPwaManager() {
  // Detect standalone mode (already installed & opened as PWA)
  const isStandaloneMatch = window.matchMedia('(display-mode: standalone)').matches;
  const isIosStandalone = (window.navigator as any).standalone === true;
  isInstalled = isStandaloneMatch || isIosStandalone;

  // Detect platform
  const ua = window.navigator.userAgent.toLowerCase();
  isIOSDevice = /iphone|ipad|ipod/.test(ua);
  isAndroidDevice = /android/.test(ua);

  // Listen for beforeinstallprompt (Android / Chrome / Edge)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    window.dispatchEvent(new CustomEvent('bem-pwa-installable'));
  });

  window.addEventListener('appinstalled', () => {
    isInstalled = true;
    deferredPrompt = null;
    window.dispatchEvent(new CustomEvent('bem-pwa-installed'));
  });

  // Offline / Online listeners
  window.addEventListener('online', () => {
    window.dispatchEvent(new CustomEvent('bem-connection-change', { detail: { online: true } }));
  });
  window.addEventListener('offline', () => {
    window.dispatchEvent(new CustomEvent('bem-connection-change', { detail: { online: false } }));
  });
}

export function isPwaInstalled(): boolean {
  return isInstalled;
}

export function isPwaInstallable(): boolean {
  // If already running standalone, hide the install button
  if (isInstalled) return false;
  // Always allow showing the install helper or automated prompt on non-standalone mobile/desktop
  return true;
}

export async function promptPwaInstall(): Promise<boolean> {
  // If native prompt is available (Chrome Android or desktop)
  if (deferredPrompt) {
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        isInstalled = true;
        deferredPrompt = null;
        window.dispatchEvent(new CustomEvent('bem-pwa-installed'));
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Install prompt error, showing guide:', err);
      showPwaInstallModal();
      return false;
    }
  } else {
    // If native prompt is not available (e.g. Safari on iOS, already dismissed, or custom browser)
    showPwaInstallModal();
    return true;
  }
}

export function showPwaInstallModal() {
  const existing = document.getElementById('bem-pwa-install-modal');
  if (existing) existing.remove();

  const isIos = isIOSDevice;

  const modal = document.createElement('div');
  modal.id = 'bem-pwa-install-modal';
  modal.className = 'bem-modal-backdrop';
  modal.innerHTML = `
    <div class="bem-modal-box" style="max-width: 480px; text-align: center; border-color: var(--c-gold-accent);">
      <button id="btn-close-pwa-modal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6A635E; cursor: pointer;">&times;</button>

      <!-- App Icon Header -->
      <div style="width: 72px; height: 72px; margin: 0 auto 1rem; border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-md); border: 2px solid var(--c-gold);">
        <img src="/icon.svg" alt="Belleza en tus Manos" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>

      <h3 class="font-serif" style="font-size: 1.45rem; margin-bottom: 0.35rem; color: #24201E; font-weight: 700;">
        Instalar BELLEZA EN TUS MANOS
      </h3>
      <p style="font-size: 0.85rem; color: #6A635E; margin-bottom: 1.25rem;">
        Distribuidora digital de cosmética y perfumería en tu pantalla de inicio como una aplicación nativa.
      </p>

      <!-- Advantages List -->
      <div style="background: var(--c-champagne-light); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 14px; padding: 1rem; text-align: left; margin-bottom: 1.25rem;">
        <div style="font-size: 0.75rem; font-weight: 800; color: #553E17; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;">
          Ventajas de la Aplicación Instalada:
        </div>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.82rem; color: #4A4441;">
          <li style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: #2E7D32;">✓</span> <strong>Acceso directo instantáneo</strong> sin escribir la web ni abrir pestañas.
          </li>
          <li style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: #2E7D32;">✓</span> <strong>Navegación fluida y rápida</strong> en celulares Android y iPhone.
          </li>
          <li style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: #2E7D32;">✓</span> <strong>Catálogo y pedidos disponibles</strong> aún con conexión débil o intermitente.
          </li>
          <li style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: #2E7D32;">✓</span> <strong>Pantalla completa y segura</strong>, sin barras molestas del navegador.
          </li>
        </ul>
      </div>

      <!-- Action / Instructions based on platform -->
      ${deferredPrompt ? `
        <button class="btn btn-primary" id="btn-pwa-trigger-auto" style="width: 100%; padding: 0.85rem; font-size: 0.95rem; font-weight: 700; margin-bottom: 1rem;">
          📲 Instalar Aplicación Ahora
        </button>
      ` : ''}

      <!-- Platform Manual Guide Accordion -->
      <div style="text-align: left; background: #FAF7F5; border-radius: 14px; padding: 1rem; border: 1px solid var(--c-neutral-200); font-size: 0.84rem; line-height: 1.55;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <strong style="color: #24201E;">
            ${isIos ? '📱 Instrucciones para iPhone (Safari):' : '📱 Instrucciones para Android / Chrome:'}
          </strong>
          <span style="font-size: 0.72rem; color: #9E9791;">Paso a paso</span>
        </div>

        ${isIos ? `
          <div style="color: #4A4441;">
            1. En Safari, tocá el botón <strong>Compartir</strong> <span style="font-size: 1.05rem; display: inline-block;">⎋</span> (icono de cuadrado con flecha hacia arriba).<br/>
            2. Deslizá hacia abajo en el menú y seleccioná <strong>"Agregar a pantalla de inicio"</strong> ➕.<br/>
            3. Tocá <strong>"Agregar"</strong> en la esquina superior derecha.<br/>
            <span style="font-size: 0.78rem; color: #6A635E; margin-top: 0.35rem; display: block;">
              ¡Listo! El ícono oficial de Belleza en tus Manos aparecerá junto a tus otras aplicaciones.
            </span>
          </div>
        ` : `
          <div style="color: #4A4441;">
            1. Tocá el menú de tres puntos <strong>(⋮)</strong> en la esquina superior derecha de Google Chrome.<br/>
            2. Seleccioná la opción <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.<br/>
            3. Tocá <strong>"Instalar"</strong> para confirmar.<br/>
            <span style="font-size: 0.78rem; color: #6A635E; margin-top: 0.35rem; display: block;">
              Se creará un acceso directo en tu teléfono para abrirla a pantalla completa.
            </span>
          </div>
        `}
      </div>

      <div style="margin-top: 1.25rem;">
        <button class="btn btn-outline" id="btn-close-pwa-bottom" style="width: 100%;">
          Entendido, cerrar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#btn-close-pwa-modal')?.addEventListener('click', () => modal.remove());
  modal.querySelector('#btn-close-pwa-bottom')?.addEventListener('click', () => modal.remove());

  modal.querySelector('#btn-pwa-trigger-auto')?.addEventListener('click', async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        isInstalled = true;
        deferredPrompt = null;
        window.dispatchEvent(new CustomEvent('bem-pwa-installed'));
        modal.remove();
      }
    }
  });
}
