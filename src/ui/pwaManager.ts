// PWA Manager for In-App Install Prompt & Offline State

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let isInstalled = false;
let isIOSDevice = false;

export function initPwaManager() {
  // Detect standalone mode
  isInstalled =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;

  // Detect iOS
  const ua = window.navigator.userAgent.toLowerCase();
  isIOSDevice = /iphone|ipad|ipod/.test(ua);

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

export function isPwaInstallable(): boolean {
  return !isInstalled && (Boolean(deferredPrompt) || isIOSDevice);
}

export async function promptPwaInstall(): Promise<boolean> {
  if (deferredPrompt) {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      isInstalled = true;
      deferredPrompt = null;
      return true;
    }
    return false;
  } else if (isIOSDevice) {
    showIosInstallModal();
    return true;
  }
  return false;
}

export function showIosInstallModal() {
  const existing = document.getElementById('bem-ios-pwa-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'bem-ios-pwa-modal';
  modal.className = 'bem-modal-backdrop';
  modal.innerHTML = `
    <div class="bem-modal-box" style="max-width: 420px; text-align: center;">
      <div style="width: 56px; height: 56px; margin: 0 auto 1rem; border-radius: 16px; background: #F3DDD9; display: flex; align-items: center; justify-content: center;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D97A85" stroke-width="2"><path d="M12 2v10m0 0 4-4m-4 4-4-4M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></svg>
      </div>
      <h3 class="font-serif" style="font-size: 1.35rem; margin-bottom: 0.5rem; color: #24201E;">Instalar en iPhone o iPad</h3>
      <p style="font-size: 0.88rem; color: #6A635E; margin-bottom: 1.25rem;">
        Agregá Belleza en tus Manos a tu pantalla de inicio para acceder al catálogo y gestionar tus pedidos sin barra de navegación:
      </p>
      <div style="background: #FAF7F5; padding: 1rem; border-radius: 14px; text-align: left; font-size: 0.85rem; line-height: 1.6; margin-bottom: 1.25rem;">
        1. Tocá el botón <strong>Compartir</strong> <span style="font-size: 1.1rem;">⎋</span> en la barra de Safari.<br/>
        2. Deslizá hacia abajo y seleccioná <strong>"Agregar a pantalla de inicio"</strong> ➕.<br/>
        3. Tocá <strong>"Agregar"</strong> en la esquina superior derecha.
      </div>
      <button class="btn btn-primary" style="width: 100%;" id="btn-close-ios-modal">Entendido</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#btn-close-ios-modal')?.addEventListener('click', () => modal.remove());
}
