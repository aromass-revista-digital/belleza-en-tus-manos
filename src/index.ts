import * as xb from 'xrblocks';
import { ShowroomScene } from './spatial/ShowroomScene';
import { store } from './services/store';
import { initPwaManager, isPwaInstallable, promptPwaInstall } from './ui/pwaManager';
import { renderCatalogView } from './ui/catalogView';
import { renderSalesToolsView } from './ui/salesToolsView';
import { renderTrainingView } from './ui/trainingView';
import { renderOrdersView } from './ui/ordersView';
import { renderAdminView } from './ui/adminView';
import { showCartModal } from './ui/cartModal';
import { showRegisterModal } from './ui/registerModal';
import { showShareAppModal } from './ui/shareAppModal';
import { ICONS } from './ui/icons';

type ActiveView = 'catalogo' | 'ventas' | 'capacitacion' | 'pedidos' | 'admin';

let activeView: ActiveView = 'catalogo';
let is3dMode = false;

function initApp() {
  initPwaManager();

  // Register service worker if available
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.warn('Service worker registration error:', err);
    });
  }

  // Initialize XR Blocks Scene
  try {
    const options = new xb.Options();
    options.setAppTitle('Belleza en tus Manos 3D');
    options.setAppDescription('Showroom espacial interactivo de cosmética y perfumería.');
    xb.add(new ShowroomScene());
    xb.init(options);
  } catch (err) {
    console.warn('XR Blocks initialization note:', err);
  }

  // Render 2D UI
  render2DApp();

  // Custom Event Listeners
  window.addEventListener('bem-cart-updated', () => updateCartBadge());
  window.addEventListener('bem-pwa-installable', () => updateInstallButtonVisibility());
  window.addEventListener('bem-navigate', (e: any) => {
    if (e.detail) {
      activeView = e.detail;
      render2DApp();
    }
  });
}

function render2DApp() {
  const root = document.getElementById('root');
  if (!root) return;

  const currentUser = store.getCurrentUser();
  const cartItems = store.getCart();
  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  root.innerHTML = `
    <!-- Offline Notification Banner (hidden by default) -->
    <div id="bem-offline-banner" class="offline-banner" style="display: ${navigator.onLine ? 'none' : 'flex'};">
      <span>⚠️ Modo sin conexión: Estás navegando datos almacenados en tu dispositivo.</span>
    </div>

    <!-- Luxury Top Header -->
    <header class="bem-header">
      <div class="bem-header-inner">
        <!-- Brand Identification -->
        <div class="bem-brand" id="brand-home-btn">
          ${ICONS.logo}
          <div>
            <div class="bem-brand-title">BELLEZA EN TUS MANOS</div>
            <div class="bem-brand-subtitle">Distribuidora Digital Independiente</div>
          </div>
        </div>

        <!-- Desktop Navigation Tabs -->
        <nav class="bem-nav-tabs" style="display: none;">
          <button class="bem-nav-btn ${activeView === 'catalogo' ? 'active' : ''}" data-nav="catalogo">
            Catálogo
          </button>
          <button class="bem-nav-btn ${activeView === 'ventas' ? 'active' : ''}" data-nav="ventas">
            Herramienta de Ventas
          </button>
          <button class="bem-nav-btn ${activeView === 'capacitacion' ? 'active' : ''}" data-nav="capacitacion">
            Capacitación ${!currentUser.trainingCompleted && currentUser.role === 'revendedor' ? '⚠️' : ''}
          </button>
          ${currentUser.role !== 'admin' ? `
            <button class="bem-nav-btn ${activeView === 'pedidos' ? 'active' : ''}" data-nav="pedidos">
              Mis Pedidos
            </button>
          ` : `
            <button class="bem-nav-btn ${activeView === 'admin' ? 'active' : ''}" data-nav="admin">
              Panel Administrador 🛡️
            </button>
          `}
        </nav>

        <!-- Right Quick Actions -->
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <!-- 3D Showroom Button -->
          <button class="btn btn-gold" id="btn-toggle-3d" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;" title="Explorar frascos y texturas en 3D">
            ${ICONS.sparkles} <span class="hide-mobile">Showroom</span> 3D
          </button>

          <!-- Install PWA Button -->
          <button class="btn btn-outline" id="btn-header-install" style="font-size: 0.78rem; padding: 0.4rem 0.75rem; display: ${isPwaInstallable() ? 'inline-flex' : 'none'};">
            ${ICONS.download} <span class="hide-mobile">Instalar PWA</span>
          </button>

          <!-- Share App Button -->
          <button class="btn-icon" id="btn-header-share" title="Compartir Aplicación">
            ${ICONS.share}
          </button>

          <!-- Cart Button with Count Badge -->
          <button class="btn-icon" id="btn-header-cart" title="Ver mi pedido">
            ${ICONS.cart}
            ${totalCartCount > 0 ? `
              <span id="header-cart-badge" style="
                position: absolute;
                top: -4px;
                right: -4px;
                background: #B85E68;
                color: #FFF;
                font-size: 0.68rem;
                font-weight: 800;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid #FFF;
              ">
                ${totalCartCount}
              </span>
            ` : ''}
          </button>

          <!-- Active Role Switcher Pill -->
          <button class="btn btn-outline" id="btn-role-switcher" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; border-radius: var(--radius-full); display: flex; align-items: center; gap: 0.4rem;">
            ${currentUser.role === 'admin' ? ICONS.shield : ICONS.user}
            <span style="font-weight: 700; max-width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${currentUser.role === 'admin' ? 'Administrador' : currentUser.fullName.split(' ')[0]}
            </span>
            <span style="font-size: 0.65rem; color: #6A635E;">▼</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="bem-main-content" id="bem-view-container"></main>

    <!-- Mobile Bottom Navigation Bar (PWA optimized) -->
    <div class="bem-mobile-bar">
      <button class="bem-bar-item ${activeView === 'catalogo' ? 'active' : ''}" data-nav="catalogo">
        ${ICONS.book}
        <span>Catálogo</span>
      </button>
      <button class="bem-bar-item ${activeView === 'ventas' ? 'active' : ''}" data-nav="ventas">
        ${ICONS.sparkles}
        <span>Ventas IA</span>
      </button>
      <button class="bem-bar-item ${activeView === 'capacitacion' ? 'active' : ''}" data-nav="capacitacion">
        ${ICONS.shield}
        <span>Academia</span>
      </button>
      ${currentUser.role === 'admin' ? `
        <button class="bem-bar-item ${activeView === 'admin' ? 'active' : ''}" data-nav="admin">
          ${ICONS.chart}
          <span>Admin</span>
        </button>
      ` : `
        <button class="bem-bar-item ${activeView === 'pedidos' ? 'active' : ''}" data-nav="pedidos">
          ${ICONS.box}
          <span>Pedidos</span>
        </button>
      `}
    </div>
  `;

  // Apply responsive styles for header desktop nav
  const mediaQuery = window.matchMedia('(min-width: 900px)');
  const updateNavDisplay = () => {
    const nav = root.querySelector('.bem-nav-tabs') as HTMLElement;
    if (nav) nav.style.display = mediaQuery.matches ? 'flex' : 'none';
  };
  updateNavDisplay();
  mediaQuery.addEventListener('change', updateNavDisplay);

  // Attach Navigation Listeners
  root.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      activeView = (e.currentTarget as HTMLElement).dataset.nav as any;
      render2DApp();
    });
  });

  root.querySelector('#brand-home-btn')?.addEventListener('click', () => {
    activeView = 'catalogo';
    render2DApp();
  });

  root.querySelector('#btn-header-cart')?.addEventListener('click', () => {
    showCartModal(() => {
      activeView = 'pedidos';
      render2DApp();
    });
  });

  root.querySelector('#btn-header-share')?.addEventListener('click', () => {
    showShareAppModal();
  });

  root.querySelector('#btn-header-install')?.addEventListener('click', () => {
    promptPwaInstall();
  });

  root.querySelector('#btn-role-switcher')?.addEventListener('click', () => {
    showRoleSwitcherModal(() => render2DApp());
  });

  root.querySelector('#btn-toggle-3d')?.addEventListener('click', () => {
    toggle3dShowroom();
  });

  // Render the current view inside the container
  const viewContainer = root.querySelector('#bem-view-container') as HTMLElement;
  if (!viewContainer) return;

  if (activeView === 'catalogo') {
    renderCatalogView(viewContainer, () => toggle3dShowroom(), () => {
      showCartModal(() => {
        activeView = 'pedidos';
        render2DApp();
      });
    });
  } else if (activeView === 'ventas') {
    renderSalesToolsView(viewContainer);
  } else if (activeView === 'capacitacion') {
    renderTrainingView(viewContainer);
  } else if (activeView === 'pedidos') {
    renderOrdersView(viewContainer);
  } else if (activeView === 'admin') {
    renderAdminView(viewContainer);
  }
}

function updateCartBadge() {
  const badge = document.getElementById('header-cart-badge');
  const cartItems = store.getCart();
  const count = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  if (badge) {
    if (count > 0) {
      badge.textContent = String(count);
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  } else if (count > 0) {
    // Re-render header to add badge
    render2DApp();
  }
}

function updateInstallButtonVisibility() {
  const btn = document.getElementById('btn-header-install');
  if (btn) {
    btn.style.display = isPwaInstallable() ? 'inline-flex' : 'none';
  }
}

function toggle3dShowroom() {
  is3dMode = !is3dMode;
  const viewContainer = document.getElementById('bem-view-container');
  const xrWrapper = document.getElementById('XRButtonWrapper');

  if (is3dMode) {
    if (viewContainer) {
      viewContainer.style.opacity = '0.15';
      viewContainer.style.pointerEvents = 'none';
    }
    // Inform user of simulated desktop / Android XR capability
    const toast = document.createElement('div');
    toast.id = 'bem-3d-toast';
    toast.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 150;
      background: rgba(36, 32, 30, 0.9);
      color: #FFF;
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-lg);
      border: 1px solid #D4AF37;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: fadeIn 0.2s ease;
    `;
    toast.innerHTML = `
      <span>✨ <strong>Modo 3D Activo:</strong> Arrastrá con el mouse o usá tus manos en XR para rotar los perfumes.</span>
      <button class="btn btn-primary" id="btn-close-3d-toast" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;">
        Volver a la App
      </button>
    `;
    document.body.appendChild(toast);
    toast.querySelector('#btn-close-3d-toast')?.addEventListener('click', () => {
      toggle3dShowroom();
    });
  } else {
    document.getElementById('bem-3d-toast')?.remove();
    if (viewContainer) {
      viewContainer.style.opacity = '1';
      viewContainer.style.pointerEvents = 'auto';
    }
  }
}

function showRoleSwitcherModal(onChanged: () => void) {
  const users = store.getUsers();
  const current = store.getCurrentUser();

  const modal = document.createElement('div');
  modal.className = 'bem-modal-backdrop';
  modal.innerHTML = `
    <div class="bem-modal-box" style="max-width: 460px;">
      <button id="btn-close-role-modal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6A635E; cursor: pointer;">&times;</button>
      <h3 class="font-serif" style="font-size: 1.35rem; color: #24201E; font-weight: 700; margin-bottom: 0.25rem;">
        Cambiar Usuario y Rol
      </h3>
      <p style="font-size: 0.85rem; color: #6A635E; margin-bottom: 1.25rem;">
        Permite alternar entre la visión del Administrador Principal, Revendedoras con cuentas aisladas o registrar una nueva.
      </p>

      <div style="display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.25rem;">
        ${users.map(u => `
          <button class="btn-select-user" data-id="${u.id}" style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.85rem 1rem;
            border-radius: 12px;
            border: 1px solid ${u.id === current.id ? 'var(--c-gold)' : 'var(--c-neutral-200)'};
            background: ${u.id === current.id ? 'var(--c-champagne-light)' : '#FFF'};
            cursor: pointer;
            text-align: left;
            transition: all 0.15s ease;
          ">
            <div>
              <div style="font-weight: 700; font-size: 0.9rem; color: #24201E;">${u.fullName}</div>
              <div style="font-size: 0.75rem; color: #6A635E;">${u.role.toUpperCase()} • ID: ${u.id} (${u.locality})</div>
            </div>
            ${u.id === current.id ? `
              <span class="badge badge-active">Activo</span>
            ` : `
              <span class="badge" style="background: var(--c-rose-50); color: #6A635E;">Ingresar</span>
            `}
          </button>
        `).join('')}
      </div>

      <div style="border-top: 1px solid var(--c-neutral-100); padding-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <button class="btn btn-gold" id="btn-modal-new-reseller" style="font-size: 0.82rem;">
          + Registrar Nueva Revendedora
        </button>
        <button class="btn btn-outline" id="btn-modal-close" style="font-size: 0.82rem;">
          Cerrar
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#btn-close-role-modal')?.addEventListener('click', () => modal.remove());
  modal.querySelector('#btn-modal-close')?.addEventListener('click', () => modal.remove());

  modal.querySelectorAll('.btn-select-user').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id!;
      store.setCurrentUser(id);
      modal.remove();
      onChanged();
    });
  });

  modal.querySelector('#btn-modal-new-reseller')?.addEventListener('click', () => {
    modal.remove();
    showRegisterModal(() => onChanged());
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
