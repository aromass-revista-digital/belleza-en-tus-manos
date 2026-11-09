import { store } from '../services/store';
import { Product, Brand, ProductCategory } from '../types';
import { ICONS } from './icons';

let currentBrandFilter: 'Todas' | Brand = 'Todas';
let currentCategoryFilter: 'Todas' | ProductCategory = 'Todas';
let searchQuery = '';
let selectedSort: 'default' | 'price-asc' | 'price-desc' = 'default';

export function renderCatalogView(container: HTMLElement, onOpen3d: () => void, onOpenCart: () => void) {
  const currentUser = store.getCurrentUser();
  const rawProducts = store.getProducts();
  const activeCycle = store.getCycles().find(c => c.status === 'publicado') || store.getCycles()[0];

  container.innerHTML = `
    <!-- Cycle Banner -->
    <div style="background: linear-gradient(135deg, #F3DDD9 0%, #F7E7CE 100%); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; box-shadow: var(--shadow-sm);">
      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
          <span class="badge" style="background: #D4AF37; color: #FFF;">Ciclo Activo</span>
          <span style="font-size: 0.85rem; font-weight: 700; color: #553E17;">15 DÍAS COMERCIALES</span>
        </div>
        <h2 class="font-serif" style="font-size: 1.4rem; color: #24201E; font-weight: 700;">${activeCycle.name}</h2>
        <p style="font-size: 0.85rem; color: #6A635E;">Vigencia: ${activeCycle.startDate} al ${activeCycle.endDate} • Precios congelados al confirmar.</p>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button class="btn btn-gold" id="btn-banner-3d" style="font-size: 0.85rem;">
          ${ICONS.sparkles} Showroom 3D
        </button>
      </div>
    </div>

    <!-- Filters & Search Bar -->
    <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between;">
        <!-- Brand Pills -->
        <div style="display: flex; gap: 0.4rem; background: var(--c-rose-50); padding: 0.25rem; border-radius: var(--radius-full); border: 1px solid var(--c-neutral-200);">
          <button class="brand-filter-btn btn ${currentBrandFilter === 'Todas' ? 'btn-primary' : 'btn-outline'}" data-brand="Todas" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">Todas las Marcas</button>
          <button class="brand-filter-btn btn ${currentBrandFilter === 'Natura' ? 'btn-primary' : 'btn-outline'}" data-brand="Natura" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">Natura</button>
          <button class="brand-filter-btn btn ${currentBrandFilter === 'AVON' ? 'btn-primary' : 'btn-outline'}" data-brand="AVON" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">AVON</button>
        </div>

        <!-- Search Input -->
        <div style="position: relative; flex: 1; min-width: 240px; max-width: 420px;">
          <input type="text" id="catalog-search-input" value="${searchQuery}" placeholder="Buscar por nombre, código o fragancia..." class="form-input" style="width: 100%; padding-left: 2.25rem;" />
          <div style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--c-neutral-400);">
            ${ICONS.search}
          </div>
        </div>

        <!-- Sort -->
        <select id="catalog-sort-select" class="form-select" style="font-size: 0.82rem; padding: 0.5rem 0.75rem; width: auto;">
          <option value="default" ${selectedSort === 'default' ? 'selected' : ''}>Ordenar: Destacados</option>
          <option value="price-asc" ${selectedSort === 'price-asc' ? 'selected' : ''}>Precio: Menor a Mayor</option>
          <option value="price-desc" ${selectedSort === 'price-desc' ? 'selected' : ''}>Precio: Mayor a Menor</option>
        </select>
      </div>

      <!-- Categories Scrollable Row -->
      <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.25rem; scrollbar-width: none;">
        ${['Todas', 'Perfumería', 'Maquillaje', 'Cuidado facial', 'Cuidado corporal', 'Higiene', 'Cabello', 'Ofertas'].map(cat => `
          <button class="category-filter-btn ${currentCategoryFilter === cat ? 'active' : ''}" data-cat="${cat}" style="
            border: 1px solid ${currentCategoryFilter === cat ? 'var(--c-gold)' : 'var(--c-neutral-200)'};
            background: ${currentCategoryFilter === cat ? 'var(--c-champagne)' : '#FFF'};
            color: ${currentCategoryFilter === cat ? '#553E17' : 'var(--c-neutral-700)'};
            font-size: 0.78rem;
            font-weight: 600;
            padding: 0.35rem 0.8rem;
            border-radius: var(--radius-full);
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.15s ease;
          ">
            ${cat}
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Products Count Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
      <p style="font-size: 0.85rem; color: var(--c-neutral-700); font-weight: 600;" id="catalog-results-count">
        Cargando catálogo...
      </p>
      ${currentUser.role !== 'cliente_publico' ? `
        <span style="font-size: 0.78rem; color: #2E7D32; font-weight: 700; background: #EDF7EE; padding: 0.25rem 0.65rem; border-radius: var(--radius-full);">
          ✓ Tu ganancia del 10% reflejada en cada producto
        </span>
      ` : ''}
    </div>

    <!-- Products Grid -->
    <div id="catalog-products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem;">
      <!-- Generated below -->
    </div>
  `;

  // Attach filter handlers
  container.querySelectorAll('.brand-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentBrandFilter = (e.currentTarget as HTMLElement).dataset.brand as any;
      renderCatalogView(container, onOpen3d, onOpenCart);
    });
  });

  container.querySelectorAll('.category-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentCategoryFilter = (e.currentTarget as HTMLElement).dataset.cat as any;
      renderCatalogView(container, onOpen3d, onOpenCart);
    });
  });

  const searchInput = container.querySelector('#catalog-search-input') as HTMLInputElement;
  searchInput?.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value.toLowerCase();
    updateProductsGrid();
  });

  const sortSelect = container.querySelector('#catalog-sort-select') as HTMLSelectElement;
  sortSelect?.addEventListener('change', (e) => {
    selectedSort = (e.target as HTMLSelectElement).value as any;
    updateProductsGrid();
  });

  container.querySelector('#btn-banner-3d')?.addEventListener('click', onOpen3d);

  function updateProductsGrid() {
    const grid = container.querySelector('#catalog-products-grid');
    const countEl = container.querySelector('#catalog-results-count');
    if (!grid) return;

    let filtered = rawProducts.filter(p => {
      if (currentBrandFilter !== 'Todas' && p.brand !== currentBrandFilter) return false;
      if (currentCategoryFilter !== 'Todas') {
        if (currentCategoryFilter === 'Ofertas' && !p.isPromotion) return false;
        if (currentCategoryFilter !== 'Ofertas' && p.category !== currentCategoryFilter) return false;
      }
      if (searchQuery) {
        const text = `${p.name} ${p.code} ${p.category} ${p.description}`.toLowerCase();
        if (!text.includes(searchQuery)) return false;
      }
      return true;
    });

    if (selectedSort === 'price-asc') {
      filtered.sort((a, b) => a.publicPrice - b.publicPrice);
    } else if (selectedSort === 'price-desc') {
      filtered.sort((a, b) => b.publicPrice - a.publicPrice);
    }

    if (countEl) {
      countEl.textContent = `Mostrando ${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--c-card-bg); border-radius: var(--radius-lg); border: 1px dashed var(--c-rose-200);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🌸</div>
          <h3 class="font-serif" style="font-size: 1.2rem; color: #24201E;">No se encontraron productos</h3>
          <p style="font-size: 0.85rem; color: #6A635E; margin-top: 0.25rem;">Probá buscando con otros términos o seleccionando otra categoría.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(product => {
      const brandBadgeClass = product.brand === 'Natura' ? 'badge-natura' : 'badge-avon';
      const hasRealImage = Boolean(product.image && product.image.trim() !== '' && !product.image.includes('unsplash.com') && !product.image.includes('picsum.photos'));

      return `
        <div class="bem-card" data-product-id="${product.id}">
          <div class="bem-card-img-wrap">
            ${hasRealImage ? `
              <img src="${product.image}" alt="${product.name}" class="bem-card-img" loading="lazy" referrerpolicy="no-referrer" />
            ` : `
              <div class="bem-product-fallback">
                <div class="bem-product-fallback-icon">
                  ${ICONS.cosmetics}
                </div>
                <div class="bem-product-fallback-code">${product.brand} • ${product.code}</div>
                <div class="bem-product-fallback-name">${product.name}</div>
                <div class="bem-product-fallback-badge">
                  ${product.presentation} • Ficha Verificada
                </div>
              </div>
            `}
            <div style="position: absolute; top: 10px; left: 10px; display: flex; gap: 0.35rem; flex-wrap: wrap; z-index: 2;">
              <span class="badge ${brandBadgeClass}">${product.brand}</span>
              ${product.isPromotion ? `<span class="badge" style="background: #E8C5C8; color: #72242B;">Oferta Ciclo</span>` : ''}
            </div>
            <div style="position: absolute; bottom: 8px; right: 8px; z-index: 2;">
              <span style="font-size: 0.7rem; background: rgba(36, 32, 30, 0.75); color: #FFF; padding: 2px 7px; border-radius: 4px; font-weight: 600;">
                ${product.presentation}
              </span>
            </div>
          </div>

          <div style="padding: 1rem; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
            <div>
              <div style="font-size: 0.72rem; color: var(--c-neutral-400); font-weight: 600; text-transform: uppercase; margin-bottom: 0.2rem;">
                CÓD: ${product.code} • ${product.category}
              </div>
              <h3 class="font-serif" style="font-size: 1.05rem; font-weight: 700; color: #24201E; line-height: 1.3; margin-bottom: 0.5rem; min-height: 2.6rem;">
                ${product.name}
              </h3>
              <p style="font-size: 0.8rem; color: var(--c-neutral-700); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 0.85rem;">
                ${product.description}
              </p>
            </div>

            <div style="border-top: 1px solid var(--c-neutral-100); padding-top: 0.75rem;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.6rem;">
                <div>
                  <div style="font-size: 0.68rem; color: var(--c-neutral-400); font-weight: 600;">PRECIO PÚBLICO</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #24201E;">
                    $${product.publicPrice.toLocaleString('es-AR')}
                  </div>
                </div>
                ${currentUser.role !== 'cliente_publico' ? `
                  <div style="text-align: right;">
                    <span class="badge badge-gain" title="Tu ganancia neta del 10%">
                      +$${product.resellerGain.toLocaleString('es-AR')} ganancia
                    </span>
                  </div>
                ` : ''}
              </div>

              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-outline btn-product-details" data-id="${product.id}" style="padding: 0.5rem; flex: 1; font-size: 0.78rem;">
                  Ficha
                </button>
                <button class="btn btn-primary btn-add-cart" data-id="${product.id}" style="padding: 0.5rem 0.9rem; flex: 2; font-size: 0.82rem;">
                  ${ICONS.cart} Sumar
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach Add to Cart
    grid.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pid = (e.currentTarget as HTMLElement).dataset.id!;
        store.addToCart(pid, 1);
        window.dispatchEvent(new CustomEvent('bem-cart-updated'));
        const originalText = (e.currentTarget as HTMLElement).innerHTML;
        (e.currentTarget as HTMLElement).innerHTML = `${ICONS.check} ¡Sumado!`;
        (e.currentTarget as HTMLElement).style.background = '#C5E1A5';
        setTimeout(() => {
          (e.currentTarget as HTMLElement).innerHTML = originalText;
          (e.currentTarget as HTMLElement).style.background = '';
        }, 1000);
      });
    });

    // Attach Product Details Modal
    grid.querySelectorAll('.btn-product-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pid = (e.currentTarget as HTMLElement).dataset.id!;
        const p = rawProducts.find(item => item.id === pid);
        if (p) showProductModal(p, onOpenCart);
      });
    });
  }

  updateProductsGrid();
}

function showProductModal(product: Product, onOpenCart: () => void) {
  const currentUser = store.getCurrentUser();
  const hasRealImage = Boolean(product.image && product.image.trim() !== '' && !product.image.includes('unsplash.com') && !product.image.includes('picsum.photos'));

  const modal = document.createElement('div');
  modal.className = 'bem-modal-backdrop';
  modal.innerHTML = `
    <div class="bem-modal-box" style="max-width: 520px;">
      <button id="btn-close-modal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6A635E; cursor: pointer;">&times;</button>
      <div style="border-radius: 14px; overflow: hidden; margin-bottom: 1rem; position: relative; min-height: 180px; max-height: 280px; background: #FAF7F5;">
        ${hasRealImage ? `
          <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 260px; object-fit: cover;" referrerpolicy="no-referrer" />
        ` : `
          <div style="padding: 2rem 1.5rem; text-align: center; background: linear-gradient(135deg, #FBF6F6 0%, #F5E8E9 50%, #FAF4EB 100%);">
            <div style="width: 54px; height: 54px; border-radius: 50%; background: #FFF; border: 1px solid rgba(212,175,55,0.4); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem;">
              ${ICONS.cosmetics}
            </div>
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--c-gold-dark);">${product.brand} • ${product.code}</div>
            <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E; margin-top: 0.25rem;">${product.name}</h3>
            <span style="font-size: 0.75rem; color: #6A635E; background: rgba(255,255,255,0.9); padding: 3px 10px; border-radius: var(--radius-full); display: inline-block; margin-top: 0.5rem;">
              ${product.presentation} • Ficha Técnica Oficial Verificada
            </span>
          </div>
        `}
        <span class="badge ${product.brand === 'Natura' ? 'badge-natura' : 'badge-avon'}" style="position: absolute; top: 12px; left: 12px; z-index: 2;">
          ${product.brand}
        </span>
      </div>

      <div style="font-size: 0.75rem; color: var(--c-neutral-400); font-weight: 600; text-transform: uppercase;">
        CÓDIGO: ${product.code} • ${product.category}
      </div>
      <h2 class="font-serif" style="font-size: 1.35rem; color: #24201E; font-weight: 700; margin: 0.35rem 0 0.75rem 0;">
        ${product.name}
      </h2>
      <p style="font-size: 0.88rem; color: var(--c-neutral-700); line-height: 1.5; margin-bottom: 1rem;">
        ${product.description}
      </p>

      <div style="background: var(--c-rose-50); border: 1px solid var(--c-rose-200); border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div>
            <div style="font-size: 0.7rem; color: #6A635E; font-weight: 600;">PRECIO OFICIAL AL PÚBLICO</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: #24201E;">
              $${product.publicPrice.toLocaleString('es-AR')}
            </div>
          </div>
          ${currentUser.role !== 'cliente_publico' ? `
            <div style="text-align: right;">
              <span class="badge badge-gain" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">
                Tu ganancia (10%): +$${product.resellerGain.toLocaleString('es-AR')}
              </span>
            </div>
          ` : ''}
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem;">
        <button class="btn btn-primary" id="btn-modal-add-cart" style="flex: 1;">
          ${ICONS.cart} Agregar a mi Pedido
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#btn-close-modal')?.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  modal.querySelector('#btn-modal-add-cart')?.addEventListener('click', () => {
    store.addToCart(product.id, 1);
    window.dispatchEvent(new CustomEvent('bem-cart-updated'));
    modal.remove();
  });
}
