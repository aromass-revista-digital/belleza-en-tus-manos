import { store } from '../services/store';
import { Order, OrderItem, AuditLogItem, PickingStatus } from '../types';
import { simulateOrExtractPdfCatalog, generateSeoContentWithAi } from '../services/geminiService';
import { performSeoAudit, SEARCH_ENGINES_PORTFOLIO } from '../services/seoService';
import { ICONS } from './icons';

let currentAdminTab: 
  | 'pdf_center' 
  | 'prices' 
  | 'cycles' 
  | 'orders' 
  | 'picking_preparation'
  | 'payments' 
  | 'consolidation' 
  | 'reception' 
  | 'boxes' 
  | 'deliveries' 
  | 'points_config'
  | 'shipping_config'
  | 'stats' 
  | 'resellers' 
  | 'seo' 
  | 'audit' = 'pdf_center';

export function renderAdminView(container: HTMLElement) {
  const currentUser = store.getCurrentUser();
  if (currentUser.role !== 'admin') {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem;">
        <div style="font-size: 2.5rem; color: #C62828;">🔒</div>
        <h2 class="font-serif" style="color: #24201E; margin-top: 0.5rem;">Acceso Restringido</h2>
        <p style="color: #6A635E; margin-top: 0.25rem;">Esta área está reservada exclusivamente para el Administrador Principal de la distribuidora.</p>
      </div>
    `;
    return;
  }

  // Check 4-month inactivity expirations every time admin views panel
  const suspensionsCount = store.checkInactivitySuspensions();

  container.innerHTML = `
    <div>
      <!-- Admin Top Banner -->
      <div style="background: linear-gradient(135deg, #24201E 0%, #3D3532 100%); color: #FDFBF7; border-radius: var(--radius-lg); padding: 1.5rem 1.75rem; margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; box-shadow: var(--shadow-md);">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span class="badge" style="background: #D4AF37; color: #000; font-weight: 800;">Panel Centralizado</span>
            <span style="font-size: 0.75rem; color: #E8C5C8; text-transform: uppercase; letter-spacing: 0.1em;">CONTROL TOTAL DISTRIBUIDORA</span>
            ${suspensionsCount > 0 ? `<span class="badge" style="background: #FFEBEE; color: #C62828;">${suspensionsCount} Cuentas suspendidas por inactividad (4 meses)</span>` : ''}
          </div>
          <h1 class="font-serif" style="font-size: 1.75rem; font-weight: 700; color: #FFF;">
            Administración — Belleza en tus Manos
          </h1>
          <p style="font-size: 0.85rem; color: #C8C2BA;">
            Administradores oficiales: <strong>Diego</strong> y <strong>María</strong> • Picking, Puntos, Envíos por distancia y Seguridad.
          </p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <span style="background: rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: var(--radius-full); font-size: 0.8rem; border: 1px solid rgba(212,175,55,0.3); color: #F7E7CE;">
            Margen Distribuidora: <strong>20%</strong> • Revendedor: <strong>10%</strong>
          </span>
        </div>
      </div>

      <!-- Section 22: Central Automation Quick Buttons -->
      <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--c-neutral-400); text-transform: uppercase; margin-bottom: 0.75rem; display: flex; justify-content: space-between;">
          <span>Módulos de Operación y Automatización Administrativa</span>
          <span style="color: #2E7D32;">✓ Enlace en tiempo real</span>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;" id="admin-quick-actions-bar">
          <button class="btn admin-tab-btn ${currentAdminTab === 'pdf_center' ? 'btn-primary' : 'btn-outline'}" data-tab="pdf_center" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            ${ICONS.filePdf} 1. Catálogos PDF & IA
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'prices' ? 'btn-primary' : 'btn-outline'}" data-tab="prices" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            💰 2. Revisar Precios
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'cycles' ? 'btn-primary' : 'btn-outline'}" data-tab="cycles" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            📅 3. Ciclos (15 días)
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'orders' ? 'btn-primary' : 'btn-outline'}" data-tab="orders" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            📋 4. Consultar Pedidos
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'picking_preparation' ? 'btn-primary' : 'btn-outline'}" data-tab="picking_preparation" style="font-size: 0.78rem; padding: 0.45rem 0.85rem; font-weight: 700;">
            🏷️ 5. Picking y Preparación
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'payments' ? 'btn-primary' : 'btn-outline'}" data-tab="payments" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            💳 6. Confirmar Pagos
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'consolidation' ? 'btn-primary' : 'btn-outline'}" data-tab="consolidation" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            🛒 7. Compra Consolidada
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'reception' ? 'btn-primary' : 'btn-outline'}" data-tab="reception" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            📥 8. Recepción y Control
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'boxes' ? 'btn-primary' : 'btn-outline'}" data-tab="boxes" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            📦 9. Preparar Cajas
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'deliveries' ? 'btn-primary' : 'btn-outline'}" data-tab="deliveries" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            🚚 10. Organizar Entregas
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'points_config' ? 'btn-primary' : 'btn-outline'}" data-tab="points_config" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            ⭐ 11. Sistema de Puntos
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'shipping_config' ? 'btn-primary' : 'btn-outline'}" data-tab="shipping_config" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            📍 12. Envíos y Distancia ($4.300/10km)
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'stats' ? 'btn-primary' : 'btn-outline'}" data-tab="stats" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            ${ICONS.chart} 13. Ganancias y Métricas
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'resellers' ? 'btn-primary' : 'btn-outline'}" data-tab="resellers" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            ${ICONS.user} 14. Revendedores
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'seo' ? 'btn-primary' : 'btn-outline'}" data-tab="seo" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            🌐 15. SEO y Posicionamiento
          </button>
          <button class="btn admin-tab-btn ${currentAdminTab === 'audit' ? 'btn-primary' : 'btn-outline'}" data-tab="audit" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
            ${ICONS.shield} 16. Auditoría y Trazabilidad
          </button>
        </div>
      </div>

      <!-- Tab Content Placeholder -->
      <div id="admin-tab-container"></div>
    </div>
  `;

  // Attach tab switcher
  container.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentAdminTab = (e.currentTarget as HTMLElement).dataset.tab as any;
      renderAdminView(container);
    });
  });

  const tabContainer = container.querySelector('#admin-tab-container') as HTMLElement;
  if (!tabContainer) return;

  switch (currentAdminTab) {
    case 'pdf_center':
      renderPdfCenterTab(tabContainer);
      break;
    case 'prices':
      renderPricesTab(tabContainer);
      break;
    case 'cycles':
      renderCyclesTab(tabContainer);
      break;
    case 'orders':
      renderOrdersTab(tabContainer);
      break;
    case 'picking_preparation':
      renderPickingPreparationTab(tabContainer);
      break;
    case 'payments':
      renderPaymentsTab(tabContainer);
      break;
    case 'consolidation':
      renderConsolidationTab(tabContainer);
      break;
    case 'reception':
      renderReceptionTab(tabContainer);
      break;
    case 'boxes':
      renderBoxesTab(tabContainer);
      break;
    case 'deliveries':
      renderDeliveriesTab(tabContainer);
      break;
    case 'points_config':
      renderPointsConfigTab(tabContainer);
      break;
    case 'shipping_config':
      renderShippingConfigTab(tabContainer);
      break;
    case 'stats':
      renderStatsTab(tabContainer);
      break;
    case 'resellers':
      renderResellersTab(tabContainer);
      break;
    case 'seo':
      renderSeoTab(tabContainer);
      break;
    case 'audit':
      renderAuditTab(tabContainer);
      break;
  }
}

// -------------------------------------------------------------
// TAB 1: CENTRO INTELIGENTE DE CATÁLOGOS PDF CON IA (Sección 4)
// -------------------------------------------------------------
function renderPdfCenterTab(container: HTMLElement) {
  const jobs = store.getPdfJobs();
  let selectedBrand: 'Natura' | 'AVON' = 'Natura';
  let isExtracting = false;
  let extractionResult: any = null;

  function renderSubView() {
    container.innerHTML = `
      <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div>
            <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700;">
              Centro Inteligente de Catálogos PDF
            </h2>
            <p style="font-size: 0.85rem; color: #6A635E;">
              Subí desde tu celular o computadora los PDF oficiales de Natura y AVON. La IA procesa páginas, OCR, fotos, códigos y calcula nuevos precios.
            </p>
          </div>
          <span class="badge" style="background: #E8C5C8; color: #551D24;">Módulo Prioritario</span>
        </div>

        <!-- Upload Form -->
        <div style="background: #FAF7F5; border: 2px dashed rgba(212, 175, 55, 0.4); border-radius: 14px; padding: 1.5rem; text-align: center; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1rem;">
            <button class="btn ${selectedBrand === 'Natura' ? 'btn-primary' : 'btn-outline'} brand-sel-btn" data-brand="Natura" style="font-size: 0.82rem;">
              Revista Natura
            </button>
            <button class="btn ${selectedBrand === 'AVON' ? 'btn-primary' : 'btn-outline'} brand-sel-btn" data-brand="AVON" style="font-size: 0.82rem;">
              Revista AVON
            </button>
          </div>

          <div style="font-size: 2.2rem; color: #D4AF37; margin-bottom: 0.5rem;">📄</div>
          <h3 style="font-size: 1.1rem; color: #24201E; font-weight: 700; margin-bottom: 0.25rem;">
            Arrastrá o seleccioná el archivo PDF
          </h3>
          <p style="font-size: 0.82rem; color: #6A635E; margin-bottom: 1rem;">
            Formatos admitidos: .pdf, .zip o imágenes de catálogo en alta resolución.
          </p>

          <input type="file" id="pdf-file-upload" accept=".pdf,image/*" style="display: none;" />
          <button class="btn btn-gold" id="btn-trigger-upload" ${isExtracting ? 'disabled' : ''}>
            ${isExtracting ? 'Procesando con IA y OCR...' : `${ICONS.filePdf} Seleccionar PDF de ${selectedBrand}`}
          </button>
          <div style="font-size: 0.75rem; color: #72242B; margin-top: 0.6rem; font-weight: 600;">
            🔒 Protección activa: los revendedores jamás podrán descargar los documentos originales de proveedores.
          </div>
        </div>

        <!-- Extraction Results if any -->
        ${extractionResult ? `
          <div style="background: #FFF; border: 1px solid var(--c-gold); border-radius: 14px; padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <div>
                <span class="badge" style="background: #EDF7EE; color: #2E7D32;">✓ Extracción Exitosa con IA</span>
                <h3 class="font-serif" style="font-size: 1.25rem; color: #24201E; font-weight: 700; margin-top: 0.25rem;">
                  Vista Previa de Productos Detectados (${extractionResult.brand} - ${extractionResult.cycle})
                </h3>
              </div>
              <button class="btn btn-primary" id="btn-approve-all-extracted">
                ${ICONS.check} Aprobar y Publicar en Catálogo
              </button>
            </div>
            <p style="font-size: 0.85rem; color: #6A635E; margin-bottom: 1rem;">
              ${extractionResult.summary}
            </p>

            <table class="bem-table" style="font-size: 0.82rem;">
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Cód</th>
                  <th>Producto</th>
                  <th>Costo Ref. (P)</th>
                  <th>Púb (+30%)</th>
                  <th>Rev (10%)</th>
                  <th>Dist (+20%)</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                ${extractionResult.extractedProducts.map((p: any, idx: number) => `
                  <tr style="${p.status === 'dudoso_revision' ? 'background: #FFFDE7;' : ''}">
                    <td>
                      ${p.status === 'dudoso_revision' ? `
                        <span class="badge" style="background: #FFF9C4; color: #F57F17;" title="${p.uncertaintyReason}">
                          ⚠️ Revisión
                        </span>
                      ` : `
                        <span class="badge badge-active">✓ OK</span>
                      `}
                    </td>
                    <td><strong>${p.code}</strong></td>
                    <td>
                      <div><strong>${p.name}</strong></div>
                      <div style="font-size: 0.7rem; color: #6A635E;">${p.presentation}</div>
                      ${p.uncertaintyReason ? `<div style="font-size: 0.7rem; color: #D84315; font-weight: 600;">${p.uncertaintyReason}</div>` : ''}
                    </td>
                    <td>$${p.referencePrice.toLocaleString('es-AR')}</td>
                    <td><strong style="color: #24201E;">$${Math.round(p.referencePrice * 1.3).toLocaleString('es-AR')}</strong></td>
                    <td><span style="color: #2E7D32; font-weight: 700;">+$${Math.round(p.referencePrice * 0.1).toLocaleString('es-AR')}</span></td>
                    <td>$${Math.round(p.referencePrice * 0.2).toLocaleString('es-AR')}</td>
                    <td>
                      <button class="btn btn-outline btn-edit-extracted-price" data-idx="${idx}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">
                        Editar
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <!-- Uploaded Jobs History -->
        <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E; font-weight: 700; margin-bottom: 0.75rem;">
          Historial de Catálogos Procesados
        </h3>
        <table class="bem-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Archivo</th>
              <th>Marca</th>
              <th>Páginas</th>
              <th>Productos</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${jobs.map(j => `
              <tr>
                <td>${new Date(j.uploadedAt).toLocaleDateString('es-AR')}</td>
                <td><strong>${j.filename}</strong></td>
                <td><span class="badge ${j.brand === 'Natura' ? 'badge-natura' : 'badge-avon'}">${j.brand}</span></td>
                <td>${j.pagesCount}</td>
                <td>${j.extractedProductsCount} SKUs</td>
                <td>
                  <span class="badge ${j.status === 'aprobado' ? 'badge-active' : 'badge-pending'}">
                    ${j.status === 'aprobado' ? 'Publicado' : 'Revisión Pendiente'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Handlers
    container.querySelectorAll('.brand-sel-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedBrand = (e.currentTarget as HTMLElement).dataset.brand as any;
        renderSubView();
      });
    });

    const fileInput = container.querySelector('#pdf-file-upload') as HTMLInputElement;
    container.querySelector('#btn-trigger-upload')?.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput?.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      isExtracting = true;
      renderSubView();

      extractionResult = await simulateOrExtractPdfCatalog(file, selectedBrand, 'Ciclo 05');
      isExtracting = false;
      renderSubView();
    });

    container.querySelector('#btn-approve-all-extracted')?.addEventListener('click', () => {
      if (!extractionResult) return;
      for (const p of extractionResult.extractedProducts) {
        store.addProduct({
          code: p.code,
          name: p.name,
          brand: p.brand,
          category: p.category as any,
          presentation: p.presentation,
          description: p.description,
          image: p.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80',
          referencePrice: p.referencePrice,
          cycleId: 'CICLO-2026-05',
          inStock: true,
          isPromotion: p.isPromotion,
          status: 'aprobado'
        });
      }
      store.addPdfJob({
        id: `JOB-PDF-${Date.now().toString().slice(-4)}`,
        filename: extractionResult.filename,
        brand: extractionResult.brand,
        cycle: extractionResult.cycle,
        uploadedAt: new Date().toISOString(),
        pagesCount: extractionResult.pagesScanned,
        extractedProductsCount: extractionResult.extractedProducts.length,
        status: 'aprobado',
        manualReviewNeededCount: 0
      });

      alert(`¡Catálogo de ${extractionResult.brand} publicado con éxito! Se incorporaron ${extractionResult.extractedProducts.length} productos con los nuevos precios oficiales.`);
      extractionResult = null;
      renderSubView();
    });

    container.querySelectorAll('.btn-edit-extracted-price').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number((e.currentTarget as HTMLElement).dataset.idx);
        const item = extractionResult.extractedProducts[idx];
        const newPrice = prompt(`Modificar precio de referencia para "${item.name}":`, String(item.referencePrice));
        if (newPrice && !isNaN(Number(newPrice))) {
          item.referencePrice = Number(newPrice);
          item.status = 'aprobado';
          delete item.uncertaintyReason;
          renderSubView();
        }
      });
    });
  }

  renderSubView();
}

// -------------------------------------------------------------
// TAB 2: REVISIÓN DE PRECIOS Y MÁRGENES (Sección 6)
// -------------------------------------------------------------
function renderPricesTab(container: HTMLElement) {
  const products = store.getProducts();

  container.innerHTML = `
    <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <div>
          <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700;">
            Motor de Precios y Márgenes
          </h2>
          <p style="font-size: 0.85rem; color: #6A635E;">
            Fórmula obligatoria: Público = P × 1.30 • Revendedor = P × 0.10 • Margen Distribuidora = P × 0.20 • Importe a cobrar = P × 1.20.
          </p>
        </div>
      </div>

      <table class="bem-table">
        <thead>
          <tr>
            <th>Cód</th>
            <th>Producto</th>
            <th>Marca</th>
            <th>Costo Mayorista (P)</th>
            <th>Precio Público (P×1.30)</th>
            <th>Comisión Rev. (P×0.10)</th>
            <th>Margen Dist. (P×0.20)</th>
            <th>Neto Dist. (P×1.20)</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td><strong>${p.code}</strong></td>
              <td>${p.name}</td>
              <td><span class="badge ${p.brand === 'Natura' ? 'badge-natura' : 'badge-avon'}">${p.brand}</span></td>
              <td><strong style="color: #6A635E;">$${p.referencePrice.toLocaleString('es-AR')}</strong></td>
              <td><strong style="color: #24201E; font-size: 0.95rem;">$${p.publicPrice.toLocaleString('es-AR')}</strong></td>
              <td><span style="color: #2E7D32; font-weight: 700;">+$${p.resellerGain.toLocaleString('es-AR')}</span></td>
              <td><span style="color: #D4AF37; font-weight: 700;">+$${p.distributorMargin.toLocaleString('es-AR')}</span></td>
              <td><span style="color: #24201E; font-weight: 800;">$${p.distributorAmount.toLocaleString('es-AR')}</span></td>
              <td>
                <button class="btn btn-outline btn-edit-price" data-id="${p.id}" data-price="${p.referencePrice}" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;">
                  Ajustar
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  container.querySelectorAll('.btn-edit-price').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id!;
      const current = (e.currentTarget as HTMLElement).dataset.price!;
      const newRef = prompt('Ingresá el nuevo Costo Mayorista de Referencia (P):', current);
      if (newRef && !isNaN(Number(newRef))) {
        store.updateProductPrice(id, Number(newRef));
        alert('Precio recalculado exitosamente con fórmula oficial.');
        renderPricesTab(container);
      }
    });
  });
}

// -------------------------------------------------------------
// TAB 3: CICLOS COMERCIALES (Sección 5)
// -------------------------------------------------------------
function renderCyclesTab(container: HTMLElement) {
  const cycles = store.getCycles();

  container.innerHTML = `
    <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700;">
            Ciclos Comerciales (15 Días)
          </h2>
          <p style="font-size: 0.85rem; color: #6A635E;">
            Cada ciclo dura exactamente 15 días. Al cerrar, los precios históricos de pedidos anteriores quedan inalterados.
          </p>
        </div>
        <button class="btn btn-gold" id="btn-create-cycle">
          + Nuevo Ciclo Comercial
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${cycles.map(c => `
          <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 14px; padding: 1.25rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                <span class="badge ${c.status === 'publicado' ? 'badge-active' : 'badge-pending'}">
                  ${c.status.toUpperCase()}
                </span>
                <span style="font-size: 0.75rem; color: #6A635E; font-weight: 600;">${c.id} • ${c.brand}</span>
              </div>
              <h3 class="font-serif" style="font-size: 1.25rem; font-weight: 700; color: #24201E;">
                ${c.name}
              </h3>
              <p style="font-size: 0.82rem; color: #6A635E; margin-top: 0.25rem;">
                📅 Período: <strong>${c.startDate}</strong> al <strong>${c.endDate}</strong> • ${c.notes}
              </p>
            </div>
            <div>
              ${c.status === 'publicado' ? `
                <button class="btn btn-outline btn-close-cycle" data-id="${c.id}" style="color: #C62828; border-color: #EF9A9A;">
                  Cerrar Ciclo y Consolidar
                </button>
              ` : `
                <span style="font-size: 0.82rem; color: #6A635E; font-weight: 600;">
                  ✓ Ciclo Finalizado e Histórico
                </span>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelector('#btn-create-cycle')?.addEventListener('click', () => {
    const name = prompt('Nombre del ciclo:', 'Ciclo 06 (Invierno Glamour)');
    if (!name) return;
    store.createCycle(name, 'Multimarca', '2026-11-16', '2026-11-30', 'Ciclo de 15 días con promociones de invierno');
    alert(`¡${name} creado y publicado!`);
    renderCyclesTab(container);
  });

  container.querySelectorAll('.btn-close-cycle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id!;
      if (confirm(`¿Confirma el cierre del ciclo ${id}? Se bloquearán nuevos pedidos de este ciclo y se habilitará la compra consolidada mayorista.`)) {
        store.closeCycle(id);
        alert('Ciclo cerrado exitosamente.');
        renderCyclesTab(container);
      }
    });
  });
}

// -------------------------------------------------------------
// TAB 4: CONSULTAR PEDIDOS Y EXPEDIENTES (Sección 11)
// -------------------------------------------------------------
function renderOrdersTab(container: HTMLElement) {
  const orders = store.getOrders();
  let statusFilter = 'Todos';

  function renderList() {
    const filtered = statusFilter === 'Todos' ? orders : orders.filter(o => o.deliveryStatus === statusFilter);

    container.innerHTML = `
      <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700;">
              Expedientes de Pedidos
            </h2>
            <p style="font-size: 0.85rem; color: #6A635E;">
              Registro completo e inmutable de operaciones, trazabilidad horaria y control de entregas.
            </p>
          </div>
          <select id="orders-status-filter" class="form-select" style="width: auto;">
            <option value="Todos">Ver todos los estados</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Pago acreditado">Pago acreditado</option>
            <option value="En preparación">En preparación</option>
            <option value="Caja lista">Caja lista</option>
            <option value="En reparto">En reparto</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>

        <table class="bem-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Revendedor / Localidad</th>
              <th>Fecha</th>
              <th>Total Púb.</th>
              <th>Comisión</th>
              <th>Neto Dist.</th>
              <th>Pago</th>
              <th>Estado Logístico</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(o => `
              <tr>
                <td><strong>${o.id}</strong></td>
                <td>
                  <strong>${o.resellerName}</strong>
                  <div style="font-size: 0.72rem; color: #6A635E;">${o.locality} • ${o.resellerPhone}</div>
                </td>
                <td>${new Date(o.createdAt).toLocaleDateString('es-AR')}</td>
                <td>$${o.totalPublicPrice.toLocaleString('es-AR')}</td>
                <td><span style="color: #2E7D32; font-weight: 700;">+$${o.totalResellerGain.toLocaleString('es-AR')}</span></td>
                <td><strong style="color: #D4AF37;">$${o.distributorAmountDue.toLocaleString('es-AR')}</strong></td>
                <td>
                  <span class="badge" style="${o.paymentStatus === 'Acreditado' ? 'background: #E8F5E9; color: #2E7D32;' : 'background: #FEF6E7; color: #925805;'}">
                    ${o.paymentStatus}
                  </span>
                </td>
                <td><span class="badge badge-active">${o.deliveryStatus}</span></td>
                <td>
                  <button class="btn btn-outline btn-view-dossier" data-id="${o.id}" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;">
                    Expediente
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    const filterSelect = container.querySelector('#orders-status-filter') as HTMLSelectElement;
    if (filterSelect) {
      filterSelect.value = statusFilter;
      filterSelect.addEventListener('change', (e) => {
        statusFilter = (e.target as HTMLSelectElement).value;
        renderList();
      });
    }

    container.querySelectorAll('.btn-view-dossier').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id!;
        const order = orders.find(o => o.id === id);
        if (order) showOrderDossierModal(order, () => renderList());
      });
    });
  }

  renderList();
}

// -------------------------------------------------------------
// TAB 5: PICKING Y PREPARACIÓN DE PEDIDOS (Prompt Complementario #7)
// -------------------------------------------------------------
function renderPickingPreparationTab(container: HTMLElement) {
  const orders = store.getOrders();
  let sortBy: 'picking' | 'zone' | 'status' = 'picking';

  function renderPickingView() {
    const sortedOrders = [...orders].sort((a, b) => {
      if (sortBy === 'picking') {
        return (a.pickingNumber || '').localeCompare(b.pickingNumber || '');
      } else if (sortBy === 'zone') {
        const zoneA = a.deliveryZone || a.locality || '';
        const zoneB = b.deliveryZone || b.locality || '';
        return zoneA.localeCompare(zoneB);
      } else {
        return (a.pickingStatus || '').localeCompare(b.pickingStatus || '');
      }
    });

    const consolidatedPickingMap = new Map<string, { code: string; name: string; brand: string; quantity: number; ordersCount: number }>();
    orders.forEach(o => {
      o.items.forEach(it => {
        const key = `${it.brand}-${it.code}`;
        const existing = consolidatedPickingMap.get(key);
        if (existing) {
          existing.quantity += it.quantity;
          existing.ordersCount += 1;
        } else {
          consolidatedPickingMap.set(key, {
            code: it.code,
            name: it.name,
            brand: it.brand,
            quantity: it.quantity,
            ordersCount: 1
          });
        }
      });
    });

    container.innerHTML = `
      <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); margin-bottom: 1.5rem;">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span class="badge" style="background: #24201E; color: #FFF; font-weight: 800;">Logística & Almacén</span>
              <span class="badge" style="background: #E8F5E9; color: #2E7D32;">Secuencia Correlativa Activa</span>
            </div>
            <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700;">
              Módulo de Picking y Preparación de Cajas
            </h2>
            <p style="font-size: 0.85rem; color: #6A635E;">
              Cada pedido confirmado cuenta con un número correlativo de picking. Ordená por número, zona de entrega o estado para optimizar el armado de paquetes.
            </p>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
            <select id="picking-sort-select" class="form-select" style="font-size: 0.8rem; padding: 0.45rem 0.75rem;">
              <option value="picking" ${sortBy === 'picking' ? 'selected' : ''}>Ordenar por Número de Picking (PICK-XXX)</option>
              <option value="zone" ${sortBy === 'zone' ? 'selected' : ''}>Ordenar por Zona / Localidad</option>
              <option value="status" ${sortBy === 'status' ? 'selected' : ''}>Ordenar por Estado de Preparación</option>
            </select>
            <button class="btn btn-gold" id="btn-print-consolidated-picking" style="font-size: 0.8rem; padding: 0.45rem 0.85rem;">
              📄 Imprimir Lista Global de Picking
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; background: #FAF7F5; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid var(--c-neutral-100); font-size: 0.85rem;">
          <div>
            <span style="color: #6A635E; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Total Pedidos en Picking:</span>
            <div style="font-size: 1.35rem; font-weight: 800; color: #24201E;">${orders.length}</div>
          </div>
          <div>
            <span style="color: #6A635E; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">SKUs Distintos a Retirar:</span>
            <div style="font-size: 1.35rem; font-weight: 800; color: #553E17;">${consolidatedPickingMap.size}</div>
          </div>
          <div>
            <span style="color: #6A635E; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Unidades Totales a Armar:</span>
            <div style="font-size: 1.35rem; font-weight: 800; color: #1B5E20;">
              ${Array.from(consolidatedPickingMap.values()).reduce((acc, curr) => acc + curr.quantity, 0)} u.
            </div>
          </div>
          <div>
            <span style="color: #6A635E; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Cajas Listas para Despacho:</span>
            <div style="font-size: 1.35rem; font-weight: 800; color: #D4AF37;">
              ${orders.filter(o => o.pickingStatus === 'Caja completa').length}
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${sortedOrders.map(order => {
            const isCompleted = order.pickingStatus === 'Caja completa';
            const isInProgress = order.pickingStatus === 'En picking';
            const badgeBg = isCompleted ? '#E8F5E9' : isInProgress ? '#E1F5FE' : '#FFF3E0';
            const badgeColor = isCompleted ? '#2E7D32' : isInProgress ? '#0277BD' : '#E65100';

            return `
              <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 14px; padding: 1.25rem; box-shadow: var(--shadow-sm);">
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem; border-bottom: 1px solid var(--c-neutral-100); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                  <div style="display: flex; align-items: center; gap: 0.65rem;">
                    <span style="font-family: monospace; font-size: 1.15rem; font-weight: 900; background: #24201E; color: #FDFBF7; padding: 0.25rem 0.65rem; border-radius: 8px;">
                      ${order.pickingNumber || 'PICK-PENDIENTE'}
                    </span>
                    <div>
                      <h3 style="font-size: 1.05rem; font-weight: 700; color: #24201E; margin: 0;">
                        ${order.id} • ${order.resellerName}
                      </h3>
                      <div style="font-size: 0.75rem; color: #6A635E;">
                        📍 Zona: <strong>${order.locality}</strong> • ${order.deliveryAddress}
                      </div>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span class="badge" style="background: ${badgeBg}; color: ${badgeColor}; font-weight: 700; font-size: 0.78rem;">
                      ${isCompleted ? '✓ CAJA COMPLETA' : isInProgress ? 'EN PROCESO DE ARMADO' : 'PENDIENTE DE PICKING'}
                    </span>
                    <button class="btn btn-outline btn-print-box-label" data-id="${order.id}" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;">
                      🏷️ Imprimir Etiqueta
                    </button>
                    <button class="btn btn-primary btn-toggle-picking-complete" data-id="${order.id}" data-current="${order.pickingStatus || 'pendiente'}" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; background: ${isCompleted ? '#6A635E' : '#2E7D32'}; border-color: ${isCompleted ? '#6A635E' : '#2E7D32'};">
                      ${isCompleted ? 'Reabrir Caja' : '✓ Marcar Caja Completa'}
                    </button>
                  </div>
                </div>

                <div style="font-size: 0.78rem; font-weight: 700; color: #553E17; text-transform: uppercase; margin-bottom: 0.4rem;">
                  Artículos a Empacar (${order.items.reduce((acc, it) => acc + it.quantity, 0)} unidades):
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.5rem; font-size: 0.82rem;">
                  ${order.items.map(item => `
                    <div style="background: #FAF7F5; padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid var(--c-neutral-100); display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <span style="font-size: 0.72rem; color: #6A635E; font-weight: 700;">${item.brand.toUpperCase()} • CÓD ${item.code}</span>
                        <div style="font-weight: 700; color: #24201E;">${item.name}</div>
                      </div>
                      <div style="font-size: 1rem; font-weight: 800; color: #1B5E20; background: #FFF; padding: 0.2rem 0.5rem; border-radius: 6px; border: 1px solid var(--c-neutral-200);">
                        ${item.quantity}u.
                      </div>
                    </div>
                  `).join('')}
                </div>

                <div style="font-size: 0.76rem; color: #6A635E; margin-top: 0.65rem; padding-top: 0.5rem; border-top: 1px dashed var(--c-neutral-100); display: flex; flex-wrap: wrap; justify-content: space-between;">
                  <span>👤 Autorizado a recibir: <strong>${order.authorizedReceiver}</strong> (${order.receiverPhone || order.resellerPhone})</span>
                  <span>⏰ Horario: <strong>${order.deliverySchedule}</strong></span>
                  ${order.deliveryInstructions ? `<span>📝 Nota: <strong>${order.deliveryInstructions}</strong></span>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const sortSelect = container.querySelector('#picking-sort-select') as HTMLSelectElement;
    sortSelect?.addEventListener('change', (e) => {
      sortBy = (e.target as HTMLSelectElement).value as any;
      renderPickingView();
    });

    container.querySelectorAll('.btn-toggle-picking-complete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const orderId = (e.currentTarget as HTMLElement).dataset.id!;
        const current = (e.currentTarget as HTMLElement).dataset.current!;
        const nextStatus: PickingStatus = current === 'Caja completa' ? 'En picking' : 'Caja completa';
        store.updatePickingStatus(orderId, nextStatus);
        renderPickingView();
      });
    });

    container.querySelectorAll('.btn-print-box-label').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const orderId = (e.currentTarget as HTMLElement).dataset.id!;
        const order = orders.find(o => o.id === orderId);
        if (order) showDispatchLabelModal(order);
      });
    });

    container.querySelector('#btn-print-consolidated-picking')?.addEventListener('click', () => {
      showConsolidatedPickingListModal(Array.from(consolidatedPickingMap.values()));
    });
  }

  renderPickingView();
}

function showConsolidatedPickingListModal(items: Array<{ code: string; name: string; brand: string; quantity: number; ordersCount: number }>) {
  const modal = document.createElement('div');
  modal.className = 'bem-modal-backdrop';
  modal.innerHTML = `
    <div class="bem-modal-box" style="max-width: 650px; font-family: monospace; background: #FFF; border: 2px solid #000;">
      <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 0.75rem; margin-bottom: 1rem;">
        <h2 style="font-size: 1.3rem; font-weight: 900;">BELLEZA EN TUS MANOS</h2>
        <div style="font-size: 0.8rem;">HOJA GENERAL DE PICKING Y EXTRACCIÓN DE ALMACÉN</div>
        <div style="font-size: 0.72rem; color: #555;">FECHA DE EMISIÓN: ${new Date().toLocaleString('es-AR')}</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; margin-bottom: 1.25rem;">
        <thead>
          <tr style="border-bottom: 1px solid #000; text-align: left;">
            <th style="padding: 0.35rem;">[ ]</th>
            <th style="padding: 0.35rem;">Marca</th>
            <th style="padding: 0.35rem;">Código</th>
            <th style="padding: 0.35rem;">Descripción del Producto</th>
            <th style="padding: 0.35rem; text-align: center;">Total U.</th>
            <th style="padding: 0.35rem; text-align: right;">Pedidos</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(it => `
            <tr style="border-bottom: 1px dashed #CCC;">
              <td style="padding: 0.35rem;">[ ]</td>
              <td style="padding: 0.35rem;">${it.brand}</td>
              <td style="padding: 0.35rem;"><strong>${it.code}</strong></td>
              <td style="padding: 0.35rem;">${it.name}</td>
              <td style="padding: 0.35rem; text-align: center; font-weight: 900; font-size: 0.95rem;">${it.quantity}</td>
              <td style="padding: 0.35rem; text-align: right;">${it.ordersCount}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display: flex; gap: 0.5rem;">
        <button class="btn btn-primary" onclick="window.print()" style="flex: 1;">Imprimir Lista de Picking</button>
        <button class="btn btn-outline" id="btn-close-picking-modal" style="flex: 1;">Cerrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#btn-close-picking-modal')?.addEventListener('click', () => modal.remove());
}

function showOrderDossierModal(order: Order, onUpdate: () => void) {
  const modal = document.createElement('div');
  modal.className = 'bem-modal-backdrop';
  modal.innerHTML = `
    <div class="bem-modal-box" style="max-width: 680px;">
      <button id="btn-close-dossier" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6A635E; cursor: pointer;">&times;</button>
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
        <span class="badge badge-gain">Expediente Oficial</span>
        <h2 class="font-serif" style="font-size: 1.4rem; color: #24201E; font-weight: 700;">${order.id}</h2>
      </div>
      <p style="font-size: 0.85rem; color: #6A635E; margin-bottom: 1.25rem;">
        Revendedor: <strong>${order.resellerName}</strong> • ${order.resellerPhone}
      </p>

      <div style="background: #FAF7F5; padding: 1rem; border-radius: 12px; font-size: 0.84rem; margin-bottom: 1.25rem; border: 1px solid var(--c-neutral-100);">
        <div><strong>Domicilio de entrega:</strong> ${order.deliveryAddress}</div>
        <div><strong>Persona autorizada para recibir:</strong> ${order.authorizedReceiver}</div>
        <div><strong>Horarios de entrega declarados:</strong> ${order.deliverySchedule}</div>
      </div>

      <h4 style="font-size: 0.85rem; font-weight: 700; color: #24201E; margin-bottom: 0.5rem;">Artículos del Pedido (Precios Congelados)</h4>
      <table class="bem-table" style="font-size: 0.8rem; margin-bottom: 1.25rem;">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cant</th>
            <th>Púb.</th>
            <th>Subtotal</th>
            <th>Costo Mayorista (P)</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map((it: OrderItem) => `
            <tr>
              <td>${it.name} (${it.brand} • ${it.code})</td>
              <td>${it.quantity}</td>
              <td>$${it.unitPublicPrice.toLocaleString('es-AR')}</td>
              <td>$${it.totalPublicPrice.toLocaleString('es-AR')}</td>
              <td style="color: #6A635E;">$${(it.unitReferencePrice || 0).toLocaleString('es-AR')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Change Delivery Status Selector -->
      <div class="form-group" style="margin-bottom: 1.25rem;">
        <label class="form-label">Actualizar Estado Logístico</label>
        <div style="display: flex; gap: 0.5rem;">
          <select id="dossier-delivery-status" class="form-select" style="flex: 1;">
            ${['Confirmado', 'Pago acreditado', 'Compra consolidada', 'Mercadería recibida', 'En preparación', 'Caja lista', 'En reparto', 'Entregado', 'Entrega fallida', 'Reprogramado'].map(st => `
              <option value="${st}" ${order.deliveryStatus === st ? 'selected' : ''}>${st}</option>
            `).join('')}
          </select>
          <button class="btn btn-primary" id="btn-save-delivery-status">Actualizar</button>
        </div>
      </div>

      <!-- Audit Timeline -->
      <h4 style="font-size: 0.85rem; font-weight: 700; color: #24201E; margin-bottom: 0.5rem;">Historial Inmutable de Auditoría</h4>
      <div style="max-height: 160px; overflow-y: auto; background: #FFF; border: 1px solid var(--c-neutral-100); border-radius: 10px; padding: 0.75rem; font-size: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem;">
        ${order.history.map((h: AuditLogItem) => `
          <div style="border-bottom: 1px dashed var(--c-neutral-100); padding-bottom: 0.35rem;">
            <div style="display: flex; justify-content: space-between; color: #6A635E;">
              <span><strong>${h.action}</strong> por ${h.userName}</span>
              <span>${new Date(h.timestamp).toLocaleString('es-AR')}</span>
            </div>
            <div style="color: #24201E;">${h.reason || 'Sin observación'}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#btn-close-dossier')?.addEventListener('click', () => modal.remove());
  modal.querySelector('#btn-save-delivery-status')?.addEventListener('click', () => {
    const sel = modal.querySelector('#dossier-delivery-status') as HTMLSelectElement;
    store.updateDeliveryStatus(order.id, sel.value as any, 'Actualización desde expediente');
    alert(`Estado actualizado a "${sel.value}"`);
    modal.remove();
    onUpdate();
  });
}

// -------------------------------------------------------------
// TAB 5: CONFIRMAR PAGOS Y COMPROBANTES (Sección 10)
// -------------------------------------------------------------
function renderPaymentsTab(container: HTMLElement) {
  const orders = store.getOrders().filter(o => o.paymentStatus !== 'Pendiente');

  container.innerHTML = `
    <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
      <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700; margin-bottom: 0.25rem;">
        Acreditación y Validación de Pagos
      </h2>
      <p style="font-size: 0.85rem; color: #6A635E; margin-bottom: 1.25rem;">
        Regla de seguridad: Un comprobante recibido NO equivale a dinero acreditado. Verificar siempre en la cuenta bancaria antes de autorizar.
      </p>

      ${orders.length === 0 ? `
        <div style="text-align: center; padding: 2rem; color: #6A635E;">No hay comprobantes pendientes de validación.</div>
      ` : `
        <table class="bem-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Revendedor</th>
              <th>Monto a Cobrar</th>
              <th>Comprobante</th>
              <th>Notas del Revendedor</th>
              <th>Estado Actual</th>
              <th>Acción Administrativa</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.resellerName}</td>
                <td><strong style="color: #24201E; font-size: 1rem;">$${o.distributorAmountDue.toLocaleString('es-AR')}</strong></td>
                <td>
                  ${o.paymentProofUrl ? `
                    <a href="${o.paymentProofUrl}" target="_blank" style="color: #D4AF37; font-weight: 700; text-decoration: underline;">
                      🔍 Ver Comprobante
                    </a>
                  ` : 'Sin archivo'}
                </td>
                <td style="font-size: 0.78rem; color: #6A635E;">${o.paymentProofNotes || 'Sin notas'}</td>
                <td>
                  <span class="badge" style="${o.paymentStatus === 'Acreditado' ? 'background: #E8F5E9; color: #2E7D32;' : 'background: #FEF6E7; color: #925805;'}">
                    ${o.paymentStatus}
                  </span>
                </td>
                <td>
                  ${o.paymentStatus !== 'Acreditado' ? `
                    <div style="display: flex; gap: 0.35rem;">
                      <button class="btn btn-primary btn-approve-pay" data-id="${o.id}" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; background: #2E7D32; border-color: #2E7D32; color: #FFF;">
                        Acreditar Pago
                      </button>
                      <button class="btn btn-outline btn-reject-pay" data-id="${o.id}" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; color: #C62828;">
                        Rechazar
                      </button>
                    </div>
                  ` : `
                    <span style="font-size: 0.78rem; color: #2E7D32; font-weight: 700;">✓ Acreditado en Galicia</span>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;

  container.querySelectorAll('.btn-approve-pay').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id!;
      store.verifyPayment(id, true, 'Acreditación confirmada en home banking oficial Galicia');
      alert(`Pago del pedido ${id} acreditado. El pedido avanzó automáticamente a "Pago Acreditado".`);
      renderPaymentsTab(container);
    });
  });

  container.querySelectorAll('.btn-reject-pay').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id!;
      const reason = prompt('Motivo del rechazo de comprobante:', 'Monto no coincide o transferencia no recibida');
      if (reason) {
        store.verifyPayment(id, false, reason);
        alert(`Comprobante del pedido ${id} marcado como rechazado.`);
        renderPaymentsTab(container);
      }
    });
  });
}

// -------------------------------------------------------------
// TAB 6: CONSOLIDADOR AUTOMÁTICO DE COMPRAS (Sección 12)
// -------------------------------------------------------------
function renderConsolidationTab(container: HTMLElement) {
  const consolidated = store.getConsolidatedPurchases('CICLO-2026-05');

  container.innerHTML = `
    <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
        <div>
          <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700;">
            Consolidador Automático de Compras Mayoristas
          </h2>
          <p style="font-size: 0.85rem; color: #6A635E;">
            Suma automática de todos los pedidos del ciclo divididos por proveedor oficial para emitir la orden mayorista.
          </p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-outline" id="btn-export-csv">
            ${ICONS.download} Exportar a Excel (CSV)
          </button>
          <button class="btn btn-gold" id="btn-print-consolidation">
            🖨️ Imprimir Orden
          </button>
        </div>
      </div>

      <!-- Total Wholesale Summary Card -->
      <div style="background: #FFF; border: 1px solid var(--c-champagne); border-radius: 12px; padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div>
          <div style="font-size: 0.75rem; color: #6A635E; font-weight: 700; text-transform: uppercase;">MONTO TOTAL ESTIMADO DE COMPRA MAYORISTA (P)</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #24201E;">
            $${consolidated.totalWholesale.toLocaleString('es-AR')}
          </div>
        </div>
        <div style="text-align: right; font-size: 0.82rem; color: #6A635E;">
          Natura: <strong>${consolidated.natura.reduce((a,b)=>a+b.totalQuantity,0)} u.</strong> • AVON: <strong>${consolidated.avon.reduce((a,b)=>a+b.totalQuantity,0)} u.</strong>
        </div>
      </div>

      <!-- Natura Section -->
      <h3 class="font-serif" style="font-size: 1.25rem; color: #CC4E00; margin-bottom: 0.5rem;">
        Proveedor: Natura Cosméticos
      </h3>
      <table class="bem-table" style="margin-bottom: 2rem;">
        <thead>
          <tr>
            <th>Cód. Producto</th>
            <th>Descripción</th>
            <th>Cantidad Total</th>
            <th>Pedidos Asignados</th>
            <th>Costo Unit. (P)</th>
            <th>Importe Total (P)</th>
          </tr>
        </thead>
        <tbody>
          ${consolidated.natura.map(item => `
            <tr>
              <td><strong>${item.code}</strong></td>
              <td>${item.name}</td>
              <td><strong style="font-size: 1rem; color: #24201E;">${item.totalQuantity} u.</strong></td>
              <td style="font-size: 0.75rem; color: #6A635E;">
                ${item.orderBreakdown.map(b => `${b.orderId} (${b.resellerName}): ${b.quantity}u`).join(', ')}
              </td>
              <td>$${item.unitWholesalePrice.toLocaleString('es-AR')}</td>
              <td><strong style="color: #24201E;">$${item.totalWholesaleAmount.toLocaleString('es-AR')}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- AVON Section -->
      <h3 class="font-serif" style="font-size: 1.25rem; color: #A31846; margin-bottom: 0.5rem;">
        Proveedor: AVON Cosmética y Bienestar
      </h3>
      <table class="bem-table">
        <thead>
          <tr>
            <th>Cód. Producto</th>
            <th>Descripción</th>
            <th>Cantidad Total</th>
            <th>Pedidos Asignados</th>
            <th>Costo Unit. (P)</th>
            <th>Importe Total (P)</th>
          </tr>
        </thead>
        <tbody>
          ${consolidated.avon.map(item => `
            <tr>
              <td><strong>${item.code}</strong></td>
              <td>${item.name}</td>
              <td><strong style="font-size: 1rem; color: #24201E;">${item.totalQuantity} u.</strong></td>
              <td style="font-size: 0.75rem; color: #6A635E;">
                ${item.orderBreakdown.map(b => `${b.orderId} (${b.resellerName}): ${b.quantity}u`).join(', ')}
              </td>
              <td>$${item.unitWholesalePrice.toLocaleString('es-AR')}</td>
              <td><strong style="color: #24201E;">$${item.totalWholesaleAmount.toLocaleString('es-AR')}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  container.querySelector('#btn-export-csv')?.addEventListener('click', () => {
    let csv = 'Proveedor,Codigo,Descripcion,Cantidad,CostoUnitario,TotalMayorista\n';
    consolidated.natura.forEach(i => {
      csv += `Natura,"${i.code}","${i.name}",${i.totalQuantity},${i.unitWholesalePrice},${i.totalWholesaleAmount}\n`;
    });
    consolidated.avon.forEach(i => {
      csv += `AVON,"${i.code}","${i.name}",${i.totalQuantity},${i.unitWholesalePrice},${i.totalWholesaleAmount}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Compra_Consolidada_Ciclo05.csv`;
    a.click();
  });

  container.querySelector('#btn-print-consolidation')?.addEventListener('click', () => {
    window.print();
  });
}

// -------------------------------------------------------------
// TAB 7: RECEPCIÓN Y CONTROL (Sección 13)
// -------------------------------------------------------------
function renderReceptionTab(container: HTMLElement) {
  container.innerHTML = `
    <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
      <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700; margin-bottom: 0.25rem;">
        Recepción y Control de Mercadería
      </h2>
      <p style="font-size: 0.85rem; color: #6A635E; margin-bottom: 1.25rem;">
        Comparación de mercadería solicitada al proveedor vs recibida en depósito. Detección automática de faltantes y productos dañados.
      </p>

      <div style="background: #EDF7EE; border: 1px solid #C8E6C9; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
        <div style="color: #2E7D32; font-size: 1.5rem;">✓</div>
        <div style="font-size: 0.85rem; color: #1B5E20;">
          Último remito recibido: Remito Oficial Natura #77129 (100% de bultos completos sin faltantes ni roturas).
        </div>
      </div>

      <table class="bem-table">
        <thead>
          <tr>
            <th>Marca</th>
            <th>Código</th>
            <th>Producto</th>
            <th>Solicitado</th>
            <th>Recibido</th>
            <th>Diferencia</th>
            <th>Estado Control</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="badge badge-natura">Natura</span></td>
            <td>NAT-7281</td>
            <td>Kaiak Clásico Masculino 100ml</td>
            <td>2 u.</td>
            <td>2 u.</td>
            <td>0</td>
            <td><span class="badge badge-active">Completo</span></td>
          </tr>
          <tr>
            <td><span class="badge badge-avon">AVON</span></td>
            <td>AVN-1104</td>
            <td>Far Away Glamour 50ml</td>
            <td>1 u.</td>
            <td>1 u.</td>
            <td>0</td>
            <td><span class="badge badge-active">Completo</span></td>
          </tr>
          <tr>
            <td><span class="badge badge-natura">Natura</span></td>
            <td>NAT-9902</td>
            <td>Tododia Crema Nuez Pecán 400ml</td>
            <td>2 u.</td>
            <td>2 u.</td>
            <td>0</td>
            <td><span class="badge badge-active">Completo</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

// -------------------------------------------------------------
// TAB 8: PREPARACIÓN DE CAJAS Y ETIQUETAS (Sección 14)
// -------------------------------------------------------------
function renderBoxesTab(container: HTMLElement) {
  const boxes = store.getBoxPreparations();

  container.innerHTML = `
    <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
      <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700; margin-bottom: 0.25rem;">
        Preparación de Cajas y Emisión de Etiquetas
      </h2>
      <p style="font-size: 0.85rem; color: #6A635E; margin-bottom: 1.25rem;">
        Ficha individual por pedido. Solo se autoriza la salida a reparto si la caja tiene todos los productos verificados.
      </p>

      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        ${boxes.map(box => `
          <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 14px; padding: 1.25rem;">
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem; border-bottom: 1px solid var(--c-neutral-100); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
              <div>
                <span class="badge badge-gain">Caja Pedido ${box.orderId}</span>
                <h3 class="font-serif" style="font-size: 1.2rem; font-weight: 700; color: #24201E; margin-top: 0.2rem;">
                  ${box.resellerName}
                </h3>
                <div style="font-size: 0.78rem; color: #6A635E;">
                  Destino: ${box.deliveryAddress} • Tel: ${box.phone}
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-outline btn-print-label" data-id="${box.orderId}" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
                  🖨️ Etiqueta de Despacho
                </button>
              </div>
            </div>

            <!-- Items checklist -->
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--c-neutral-400); text-transform: uppercase; margin-bottom: 0.4rem;">
              Contenido de la Caja (Checklist)
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.84rem;">
              ${box.items.map(it => `
                <div style="display: flex; align-items: center; justify-content: space-between; background: #FAF7F5; padding: 0.5rem 0.75rem; border-radius: 8px;">
                  <span><strong>${it.quantity}x</strong> ${it.productName} (CÓD ${it.code})</span>
                  <span class="badge badge-active">✓ Preparado</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.btn-print-label').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const orderId = (e.currentTarget as HTMLElement).dataset.id!;
      const order = store.getOrders().find(o => o.id === orderId);
      if (order) showDispatchLabelModal(order);
    });
  });
}

function showDispatchLabelModal(order: Order) {
  const modal = document.createElement('div');
  modal.className = 'bem-modal-backdrop';
  modal.innerHTML = `
    <div class="bem-modal-box" style="max-width: 480px; font-family: monospace; border: 2px dashed #000; background: #FFF;">
      <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
        <h2 style="font-size: 1.2rem; font-weight: 900; letter-spacing: 2px;">BELLEZA EN TUS MANOS</h2>
        <div style="font-size: 0.75rem;">DISTRIBUIDORA DIGITAL — ETIQUETA OFICIAL DE REPARTO</div>
      </div>
      <div style="font-size: 1.1rem; font-weight: 900; margin-bottom: 0.5rem;">
        PEDIDO: ${order.id}
      </div>
      <div style="font-size: 0.85rem; line-height: 1.4; margin-bottom: 0.75rem;">
        <strong>DESTINATARIO:</strong> ${order.resellerName}<br/>
        <strong>DIRECCIÓN:</strong> ${order.deliveryAddress}<br/>
        <strong>TELÉFONO:</strong> ${order.resellerPhone}<br/>
        <strong>AUTORIZADO A RECIBIR:</strong> ${order.authorizedReceiver}<br/>
        <strong>FRANJA HORARIA:</strong> ${order.deliverySchedule}
      </div>
      <div style="border-top: 1px solid #000; padding-top: 0.5rem; font-size: 0.75rem; margin-bottom: 1rem;">
        <strong>BULTOS:</strong> 1 Caja precintada • <strong>TOTAL SKUS:</strong> ${order.items.reduce((a: number, b: OrderItem) => a + b.quantity, 0)} unidades
      </div>
      <button class="btn btn-primary" onclick="window.print()" style="width: 100%;">Imprimir Etiqueta</button>
      <button class="btn btn-outline" id="btn-close-label" style="width: 100%; margin-top: 0.5rem;">Cerrar</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#btn-close-label')?.addEventListener('click', () => modal.remove());
}

// -------------------------------------------------------------
// TAB 9: ORGANIZAR ENTREGAS A DOMICILIO (Sección 15)
// -------------------------------------------------------------
function renderDeliveriesTab(container: HTMLElement) {
  const orders = store.getOrders();

  container.innerHTML = `
    <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
      <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700; margin-bottom: 0.25rem;">
        Rutas y Organización de Entregas a Domicilio
      </h2>
      <p style="font-size: 0.85rem; color: #6A635E; margin-bottom: 1.25rem;">
        Entregas planificadas dentro de los 5 días posteriores al cierre del ciclo. Organización por zona y disponibilidad horaria.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
        <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 14px; padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span class="badge" style="background: #E1F5FE; color: #0277BD;">Ruta 1 — Castelar / Morón</span>
            <span style="font-size: 0.75rem; color: #6A635E;">1 pedido</span>
          </div>
          <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E;">Zona Oeste Centro</h3>
          <p style="font-size: 0.8rem; color: #6A635E; margin-bottom: 0.75rem;">Reparto programado: Martes 14:00 a 18:00 hs.</p>
          <div style="background: #FAF7F5; padding: 0.75rem; border-radius: 8px; font-size: 0.8rem;">
            <strong>PED-2026-4019:</strong> Mariana González<br/>
            Bartolomé Mitre 2340, Castelar
          </div>
        </div>

        <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 14px; padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span class="badge" style="background: #F3E5F5; color: #6A1B9A;">Ruta 2 — Ituzaingó / Padua</span>
            <span style="font-size: 0.75rem; color: #6A635E;">En preparación</span>
          </div>
          <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E;">Zona Oeste Corredor Verde</h3>
          <p style="font-size: 0.8rem; color: #6A635E; margin-bottom: 0.75rem;">Reparto programado: Miércoles 16:00 a 20:00 hs.</p>
          <div style="background: #FAF7F5; padding: 0.75rem; border-radius: 8px; font-size: 0.8rem; color: #6A635E;">
            Consolidando cajas para despacho.
          </div>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// TAB 11: CONFIGURACIÓN DEL SISTEMA DE PUNTOS (Prompt Complementario #3)
// -------------------------------------------------------------
function renderPointsConfigTab(container: HTMLElement) {
  const pointsRules = store.getPointsRules();
  const resellers = store.getUsers().filter(u => u.role === 'revendedor');

  container.innerHTML = `
    <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span class="badge" style="background: var(--c-gold); color: #FFF; font-weight: 700;">Reglas Comerciales</span>
            <span class="badge" style="background: #E8F5E9; color: #2E7D32;">Control y Auditoría de Puntos</span>
          </div>
          <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700;">
            Sistema Oficial de Puntos y Bloqueo de Pedidos
          </h2>
          <p style="font-size: 0.85rem; color: #6A635E;">
            Configuración de requisitos de puntos por pedido, acreditaciones por bienvenida y compras. Sin valores ficticios ni manipulables.
          </p>
        </div>
      </div>

      <!-- Config Form -->
      <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 14px; padding: 1.25rem; margin-bottom: 1.5rem;">
        <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E; font-weight: 700; margin-bottom: 0.75rem;">
          Reglas Comerciales Vigentes
        </h3>
        
        <form id="points-rules-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Estado del Sistema</label>
            <select id="cfg-points-enabled" class="form-select">
              <option value="true" ${pointsRules.enabled ? 'selected' : ''}>Habilitado (Bloqueo activo si saldo es insuficiente)</option>
              <option value="false" ${!pointsRules.enabled ? 'selected' : ''}>Deshabilitado (Permitir pedidos sin puntos)</option>
            </select>
          </div>

          <div class="form-group" style="margin: 0;">
            <label class="form-label">Puntos Requeridos por Pedido</label>
            <input type="number" id="cfg-points-required" class="form-input" min="0" value="${pointsRules.pointsRequiredPerOrder}" />
          </div>

          <div class="form-group" style="margin: 0;">
            <label class="form-label">Puntos de Bienvenida (Nuevo Registro)</label>
            <input type="number" id="cfg-points-welcome" class="form-input" min="0" value="${pointsRules.initialWelcomePoints}" />
          </div>

          <div class="form-group" style="margin: 0;">
            <label class="form-label">Puntos Ganados por cada $1.000 Comprados</label>
            <input type="number" id="cfg-points-earn" class="form-input" min="0" value="${pointsRules.pointsEarnedPerThousandPesos}" />
          </div>

          <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end;">
            <button type="submit" class="btn btn-primary" style="font-size: 0.85rem;">
              Guardar Reglas de Puntos
            </button>
          </div>
        </form>
      </div>

      <!-- Manual Adjustment & Balances Table -->
      <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E; font-weight: 700; margin-bottom: 0.75rem;">
        Saldos de Puntos por Revendedor y Ajuste Manual
      </h3>

      <table class="bem-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Revendedor</th>
            <th>Saldo Actual</th>
            <th>Última Actividad</th>
            <th>Historial Movimientos</th>
            <th>Ajuste de Puntos</th>
          </tr>
        </thead>
        <tbody>
          ${resellers.map(u => `
            <tr>
              <td><strong>${u.id}</strong></td>
              <td>
                <strong>${u.fullName}</strong>
                <div style="font-size: 0.72rem; color: #6A635E;">${u.email}</div>
              </td>
              <td>
                <span style="font-size: 1.15rem; font-weight: 800; color: ${(u.pointsBalance ?? 0) >= pointsRules.pointsRequiredPerOrder ? '#2E7D32' : '#C62828'};">
                  ${u.pointsBalance ?? 0} pts
                </span>
              </td>
              <td style="font-size: 0.75rem;">
                ${u.lastActivityAt ? new Date(u.lastActivityAt).toLocaleDateString('es-AR') : 'Sin registro'}
              </td>
              <td>
                <div style="font-size: 0.72rem; max-height: 70px; overflow-y: auto; color: #6A635E;">
                  ${(u.pointsHistory || []).slice(-3).map(h => `
                    <div>• ${h.amount > 0 ? '+' : ''}${h.amount} pts: ${h.reason} (${new Date(h.timestamp).toLocaleDateString('es-AR')})</div>
                  `).join('') || 'Sin movimientos registrados'}
                </div>
              </td>
              <td>
                <div style="display: flex; gap: 0.35rem; align-items: center;">
                  <input type="number" class="form-input input-manual-delta" data-id="${u.id}" placeholder="± Pts" style="width: 70px; font-size: 0.78rem; padding: 0.25rem;" />
                  <input type="text" class="form-input input-manual-reason" data-id="${u.id}" placeholder="Motivo" style="width: 120px; font-size: 0.78rem; padding: 0.25rem;" />
                  <button class="btn btn-outline btn-apply-points" data-id="${u.id}" style="font-size: 0.72rem; padding: 0.3rem 0.6rem;">
                    Aplicar
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Submit Rules
  container.querySelector('#points-rules-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const enabled = (container.querySelector('#cfg-points-enabled') as HTMLSelectElement).value === 'true';
    const pointsRequiredPerOrder = parseInt((container.querySelector('#cfg-points-required') as HTMLInputElement).value, 10) || 0;
    const initialWelcomePoints = parseInt((container.querySelector('#cfg-points-welcome') as HTMLInputElement).value, 10) || 0;
    const pointsEarnedPerThousandPesos = parseInt((container.querySelector('#cfg-points-earn') as HTMLInputElement).value, 10) || 0;

    store.updatePointsRules({
      enabled,
      pointsRequiredPerOrder,
      initialWelcomePoints,
      pointsEarnedPerThousandPesos
    });

    alert('Reglas de puntos actualizadas y auditadas con éxito.');
    renderPointsConfigTab(container);
  });

  // Manual Adjustment Buttons
  container.querySelectorAll('.btn-apply-points').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const userId = (e.currentTarget as HTMLElement).dataset.id!;
      const deltaInput = container.querySelector(`.input-manual-delta[data-id="${userId}"]`) as HTMLInputElement;
      const reasonInput = container.querySelector(`.input-manual-reason[data-id="${userId}"]`) as HTMLInputElement;

      const delta = parseInt(deltaInput.value, 10);
      const reason = reasonInput.value.trim() || 'Ajuste manual administrativo';

      if (isNaN(delta) || delta === 0) {
        alert('Por favor ingrese un valor de puntos válido (positivo o negativo).');
        return;
      }

      store.adjustVendorPoints(userId, delta, delta > 0 ? 'acreditacion' : 'ajuste', reason);
      alert(`Puntos actualizados para el usuario ${userId} (${delta > 0 ? '+' : ''}${delta} pts).`);
      renderPointsConfigTab(container);
    });
  });
}

// -------------------------------------------------------------
// TAB 12: CONFIGURACIÓN DE ENVÍOS POR DISTANCIA (Prompt Complementario #4)
// -------------------------------------------------------------
function renderShippingConfigTab(container: HTMLElement) {
  const config = store.getShippingConfig();

  container.innerHTML = `
    <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span class="badge" style="background: #1B5E20; color: #FFF; font-weight: 700;">Tarifa por Distancia</span>
            <span class="badge" style="background: #E1F5FE; color: #0277BD;">$4.300 / 10 km</span>
          </div>
          <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700;">
            Tarifario y Centro de Distribución
          </h2>
          <p style="font-size: 0.85rem; color: #6A635E;">
            Cálculo automático según la distancia en kilómetros entre el punto de distribución y el domicilio de entrega del vendedor, por tramos de 10 km completos o iniciados.
          </p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
        <!-- Config Card -->
        <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 14px; padding: 1.25rem;">
          <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E; font-weight: 700; margin-bottom: 0.75rem;">
            Parámetros de Tarifa
          </h3>

          <form id="shipping-rate-form" style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div class="form-group" style="margin: 0;">
              <label class="form-label">Costo por Tramo de 10 km (ARS) *</label>
              <input type="number" id="ship-rate-price" class="form-input" value="${config.pricePer10Km}" required />
            </div>

            <div class="form-group" style="margin: 0;">
              <label class="form-label">Dirección Centro de Distribución *</label>
              <input type="text" id="ship-dist-address" class="form-input" value="${config.distributionCenterAddress}" required />
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top: 0.5rem;">
              Guardar Configuración de Envíos
            </button>
          </form>
        </div>

        <!-- Scale Preview Card -->
        <div style="background: #FAF7F5; border: 1px solid var(--c-neutral-200); border-radius: 14px; padding: 1.25rem;">
          <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E; font-weight: 700; margin-bottom: 0.75rem;">
            Escala Vigente de Cobro
          </h3>
          <p style="font-size: 0.82rem; color: #6A635E; margin-bottom: 0.75rem;">
            Se aplica por tramos completos o iniciados de 10 km desde <strong>${config.distributionCenterAddress}</strong>:
          </p>

          <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; background: #FFF; padding: 0.5rem 0.75rem; border-radius: 8px;">
              <span>Hasta 10 km (1 tramo):</span>
              <strong style="color: #1B5E20;">$${(config.pricePer10Km * 1).toLocaleString('es-AR')}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; background: #FFF; padding: 0.5rem 0.75rem; border-radius: 8px;">
              <span>Más de 10 km y hasta 20 km (2 tramos):</span>
              <strong style="color: #1B5E20;">$${(config.pricePer10Km * 2).toLocaleString('es-AR')}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; background: #FFF; padding: 0.5rem 0.75rem; border-radius: 8px;">
              <span>Más de 20 km y hasta 30 km (3 tramos):</span>
              <strong style="color: #1B5E20;">$${(config.pricePer10Km * 3).toLocaleString('es-AR')}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; background: #FFF; padding: 0.5rem 0.75rem; border-radius: 8px;">
              <span>Más de 30 km y hasta 40 km (4 tramos):</span>
              <strong style="color: #1B5E20;">$${(config.pricePer10Km * 4).toLocaleString('es-AR')}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#shipping-rate-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const rate = parseInt((container.querySelector('#ship-rate-price') as HTMLInputElement).value, 10) || 4300;
    const address = (container.querySelector('#ship-dist-address') as HTMLInputElement).value.trim() || 'Av. Rivadavia 17400, Morón, Buenos Aires';

    store.updateShippingRate(rate, address);
    alert('Tarifa de envíos por distancia actualizada con éxito.');
    renderShippingConfigTab(container);
  });
}

// -------------------------------------------------------------
// TAB 13: ESTADÍSTICAS EXCLUSIVAS (Sección 17)
// -------------------------------------------------------------

function renderStatsTab(container: HTMLElement) {
  const orders = store.getOrders();
  const users = store.getUsers().filter(u => u.role === 'revendedor');

  const totalPublicSales = orders.reduce((a,b)=>a+b.totalPublicPrice,0);
  const totalCommissionsPaid = orders.reduce((a,b)=>a+b.totalResellerGain,0);
  const totalDistributorNet = orders.reduce((a,b)=>a+b.distributorAmountDue,0);
  const totalWholesaleCosts = orders.reduce((acc, o) => {
    return acc + o.items.reduce((s, it) => s + (it.unitReferencePrice || 0) * it.quantity, 0);
  }, 0);
  const netProfit = totalDistributorNet - totalWholesaleCosts; // 20% margin

  container.innerHTML = `
    <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700;">
            Estadísticas Financieras y Métricas Exclusivas
          </h2>
          <p style="font-size: 0.85rem; color: #6A635E;">
            Solo visible por el administrador. Aislamiento absoluto de resultados económicos frente a los revendedores.
          </p>
        </div>
        <span class="badge" style="background: #D4AF37; color: #000;">Resultados Económicos Reales</span>
      </div>

      <!-- Financial Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 12px; padding: 1rem;">
          <div style="font-size: 0.72rem; color: #6A635E; font-weight: 700;">VENTAS TOTALES (PÚBLICO)</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #24201E;">$${totalPublicSales.toLocaleString('es-AR')}</div>
          <div style="font-size: 0.7rem; color: #2E7D32;">100% Facturado</div>
        </div>

        <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 12px; padding: 1rem;">
          <div style="font-size: 0.72rem; color: #6A635E; font-weight: 700;">COMISIONES REVENDEDORES (10%)</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #2E7D32;">$${totalCommissionsPaid.toLocaleString('es-AR')}</div>
          <div style="font-size: 0.7rem; color: #6A635E;">Entregadas a red</div>
        </div>

        <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 12px; padding: 1rem;">
          <div style="font-size: 0.72rem; color: #6A635E; font-weight: 700;">COSTOS MAYORISTAS (P)</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #C62828;">$${totalWholesaleCosts.toLocaleString('es-AR')}</div>
          <div style="font-size: 0.7rem; color: #6A635E;">A abonar a Natura/AVON</div>
        </div>

        <div style="background: #FFF; border: 1px solid #D4AF37; border-radius: 12px; padding: 1rem;">
          <div style="font-size: 0.72rem; color: #553E17; font-weight: 700;">GANANCIA NETA DISTRIBUIDORA (20%)</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #D4AF37;">$${netProfit.toLocaleString('es-AR')}</div>
          <div style="font-size: 0.7rem; color: #2E7D32;">Margen real retenido</div>
        </div>
      </div>

      <!-- Top Resellers Ranking -->
      <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E; font-weight: 700; margin-bottom: 0.5rem;">
        Ranking de Revendedores Activos
      </h3>
      <table class="bem-table">
        <thead>
          <tr>
            <th>Posición</th>
            <th>Revendedor</th>
            <th>Localidad</th>
            <th>Capacitación</th>
            <th>Ventas Brutas</th>
            <th>Comisión Ganada</th>
          </tr>
        </thead>
        <tbody>
          ${users.map((u, i) => `
            <tr>
              <td><strong>#${i + 1}</strong></td>
              <td><strong>${u.fullName}</strong> (${u.id})</td>
              <td>${u.locality}</td>
              <td>
                <span class="badge ${u.trainingCompleted ? 'badge-active' : 'badge-pending'}">
                  ${u.trainingProgress}/10 módulos
                </span>
              </td>
              <td>$${orders.filter(o=>o.resellerId===u.id).reduce((a,b)=>a+b.totalPublicPrice,0).toLocaleString('es-AR')}</td>
              <td><span style="color: #2E7D32; font-weight: 700;">+$${orders.filter(o=>o.resellerId===u.id).reduce((a,b)=>a+b.totalResellerGain,0).toLocaleString('es-AR')}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// -------------------------------------------------------------
// TAB 14: ADMINISTRAR REVENDEDORES (Sección 2 & Prompt Complementario #2)
// -------------------------------------------------------------
function renderResellersTab(container: HTMLElement) {
  const users = store.getUsers().filter(u => u.role === 'revendedor');

  container.innerHTML = `
    <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <div>
          <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700;">
            Gestión y Expedientes de Revendedores
          </h2>
          <p style="font-size: 0.85rem; color: #6A635E;">
            Aprobación de cuentas, puntos, suspensión automática por 4 meses de inactividad, reactivación manual y datos completos de entrega.
          </p>
        </div>
        <span class="badge badge-active">${users.length} Revendedores Registrados</span>
      </div>

      <table class="bem-table">
        <thead>
          <tr>
            <th>ID / Puntos</th>
            <th>Nombre y Apellido</th>
            <th>DNI / Nacimiento</th>
            <th>Contacto</th>
            <th>Domicilio & Entrega</th>
            <th>Última Actividad / Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(u => {
            const notice = store.getInactivityNotice(u);
            const isSuspended = u.status === 'suspendido' || u.inactivitySuspended;

            return `
              <tr>
                <td>
                  <strong>${u.id}</strong>
                  <div style="font-size: 0.76rem; color: #1B5E20; font-weight: 700;">⭐ ${u.pointsBalance ?? 0} pts</div>
                </td>
                <td>
                  <strong>${u.fullName}</strong>
                  <div style="font-size: 0.72rem; color: #6A635E;">${u.email}</div>
                  <div style="font-size: 0.7rem; color: #888;">Capacitación: ${u.trainingProgress}/10 (${u.trainingCompleted ? 'Completada' : 'Pendiente'})</div>
                </td>
                <td>
                  <div>${u.dni}</div>
                  <div style="font-size: 0.72rem; color: #6A635E;">${u.birthDate || 'No declarada'}</div>
                </td>
                <td>
                  <div>${u.whatsapp}</div>
                  <div style="font-size: 0.72rem; color: #6A635E;">${u.phone}</div>
                </td>
                <td style="font-size: 0.75rem;">
                  <strong>${u.fullAddress}</strong><br/>
                  ${u.neighborhood ? `Barrio: ${u.neighborhood} • ` : ''}${u.locality} (${u.postalCode})<br/>
                  <span style="color: #6A635E;">Recibe: ${u.authorizedReceiver} ${u.receiverPhone ? `(${u.receiverPhone})` : ''}</span>
                </td>
                <td>
                  <span class="badge" style="${isSuspended ? 'background: #FFEBEE; color: #C62828;' : u.status === 'activo' ? 'background: #E8F5E9; color: #2E7D32;' : 'background: #FEF6E7; color: #925805;'}">
                    ${isSuspended ? 'SUSPENDIDO (INACTIVIDAD)' : u.status.toUpperCase()}
                  </span>
                  <div style="font-size: 0.72rem; color: #6A635E; margin-top: 0.25rem;">
                    Actividad: ${u.lastActivityAt ? new Date(u.lastActivityAt).toLocaleDateString('es-AR') : 'Sin registro'}
                  </div>
                  ${notice && notice.hasWarning ? `<div style="font-size: 0.7rem; color: ${notice.daysRemaining <= 7 ? '#C62828' : '#F57F17'}; font-weight: 700; margin-top: 0.15rem;">⚠️ ${notice.message}</div>` : ''}
                </td>
                <td>
                  <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                    ${u.status === 'pendiente' ? `
                      <button class="btn btn-primary btn-change-user-status" data-id="${u.id}" data-status="activo" style="padding: 0.3rem 0.6rem; font-size: 0.72rem; background: #2E7D32; border-color: #2E7D32; color: #FFF;">
                        Aprobar
                      </button>
                    ` : ''}
                    ${u.status === 'activo' && !u.inactivitySuspended ? `
                      <button class="btn btn-outline btn-change-user-status" data-id="${u.id}" data-status="suspendido" style="padding: 0.3rem 0.6rem; font-size: 0.72rem; color: #C62828;">
                        Suspender
                      </button>
                    ` : ''}
                    ${isSuspended ? `
                      <button class="btn btn-primary btn-reactivate-user" data-id="${u.id}" style="padding: 0.3rem 0.6rem; font-size: 0.72rem; background: #2E7D32; border-color: #2E7D32; color: #FFF;">
                        Reactivar (Reset Inactividad)
                      </button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  container.querySelectorAll('.btn-change-user-status').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id!;
      const status = (e.currentTarget as HTMLElement).dataset.status! as any;
      store.updateUserStatus(id, status);
      alert(`Usuario ${id} actualizado a estado "${status}".`);
      renderResellersTab(container);
    });
  });

  container.querySelectorAll('.btn-reactivate-user').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id!;
      store.reactivateVendor(id, 'Reactivación manual por administrador con reinicio de vigencia de 4 meses');
      alert(`Usuario ${id} reactivado exitosamente. Se restableció su vigencia por 4 meses manteniendo todo su historial intacto.`);
      renderResellersTab(container);
    });
  });
}

// -------------------------------------------------------------
// TAB 12: SEO GLOBAL Y POSICIONAMIENTO (Sección 19)
// -------------------------------------------------------------
function renderSeoTab(container: HTMLElement) {
  const audit = performSeoAudit();
  let aiTopic = 'Perfumes Natura y AVON en Buenos Aires';
  let aiKeyword = 'distribuidora cosmética';
  let aiResult: any = null;
  let isGeneratingSeo = false;

  function renderSeoSubView() {
    container.innerHTML = `
      <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <span class="badge" style="background: #E8C5C8; color: #551D24;">Módulo Prioritario</span>
            <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700; margin-top: 0.25rem;">
              Posicionamiento Gratuito en Internet — SEO Global
            </h2>
            <p style="font-size: 0.85rem; color: #6A635E;">
              Estrategia orgánica para indexar en Google, Bing, Yahoo, DuckDuckGo, Ecosia, Brave y directorios argentinos sin publicidad paga.
            </p>
          </div>
          <div style="text-align: right; background: #EDF7EE; border: 1px solid #C8E6C9; padding: 0.5rem 1rem; border-radius: 12px;">
            <div style="font-size: 0.72rem; color: #2E7D32; font-weight: 700;">SALUD TÉCNICA SEO</div>
            <div style="font-size: 1.5rem; font-weight: 900; color: #1B5E20;">${audit.score}/100</div>
          </div>
        </div>

        <!-- SEO Checks Grid -->
        <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 14px; padding: 1.25rem; margin-bottom: 1.5rem;">
          <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E; margin-bottom: 0.75rem;">
            Auditoría de Componentes Técnicos
          </h3>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.82rem;">
            ${audit.checks.map(c => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: #FAF7F5; border-radius: 8px;">
                <div>
                  <strong>${c.name}</strong>
                  <div style="font-size: 0.72rem; color: #6A635E;">${c.details}</div>
                </div>
                <span class="badge badge-active">Correcto</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Search Engines Submission Portfolio -->
        <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E; margin-bottom: 0.75rem;">
          Portfolio de Buscadores y Protocolos Soportados
        </h3>
        <table class="bem-table" style="margin-bottom: 1.5rem;">
          <thead>
            <tr>
              <th>Buscador</th>
              <th>Ecosistema</th>
              <th>Mecanismo de Indexación</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${SEARCH_ENGINES_PORTFOLIO.map(se => `
              <tr>
                <td><strong>${se.name}</strong></td>
                <td>${se.category}</td>
                <td style="font-size: 0.78rem;">${se.submissionMethod}</td>
                <td><span class="badge badge-active">Indexable</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Generador de Contenido SEO con IA -->
        <div style="background: linear-gradient(135deg, #FAF3EA 0%, #FDFBF7 100%); border: 1px solid var(--c-champagne); border-radius: 14px; padding: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span class="badge" style="background: var(--c-gold); color: #FFF;">Herramienta IA</span>
            <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E; font-weight: 700;">
              Generador Asistido por IA de Metadatos y Contenidos SEO
            </h3>
          </div>
          <p style="font-size: 0.82rem; color: #6A635E; margin-bottom: 1rem;">
            Creá títulos, meta descriptions y textos originales de categorías orientados a búsquedas argentinas.
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group" style="margin: 0;">
              <label class="form-label">Tema o Categoría</label>
              <input type="text" id="seo-topic-input" class="form-input" value="${aiTopic}" />
            </div>
            <div class="form-group" style="margin: 0;">
              <label class="form-label">Palabra Clave Principal</label>
              <input type="text" id="seo-keyword-input" class="form-input" value="${aiKeyword}" />
            </div>
          </div>

          <button class="btn btn-primary" id="btn-run-seo-ai" ${isGeneratingSeo ? 'disabled' : ''}>
            ${isGeneratingSeo ? 'Generando con IA...' : `${ICONS.sparkles} Generar Metadatos y Texto SEO`}
          </button>

          ${aiResult ? `
            <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 12px; padding: 1rem; margin-top: 1rem; font-size: 0.85rem;">
              <div style="margin-bottom: 0.5rem;">
                <span style="font-size: 0.72rem; color: #6A635E; font-weight: 700;">TÍTULO SEO (TITLE):</span>
                <div style="font-weight: 700; color: #1A0DAB;">${aiResult.title}</div>
              </div>
              <div style="margin-bottom: 0.5rem;">
                <span style="font-size: 0.72rem; color: #6A635E; font-weight: 700;">META DESCRIPCIÓN:</span>
                <div style="color: #4D5156;">${aiResult.metaDescription}</div>
              </div>
              <div>
                <span style="font-size: 0.72rem; color: #6A635E; font-weight: 700;">TEXTO DE CATEGORÍA INDEXABLE:</span>
                <div style="line-height: 1.5; color: #24201E;">${aiResult.contentBody}</div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    container.querySelector('#btn-run-seo-ai')?.addEventListener('click', async () => {
      const tInput = container.querySelector('#seo-topic-input') as HTMLInputElement;
      const kInput = container.querySelector('#seo-keyword-input') as HTMLInputElement;
      aiTopic = tInput ? tInput.value : aiTopic;
      aiKeyword = kInput ? kInput.value : aiKeyword;

      isGeneratingSeo = true;
      renderSeoSubView();
      aiResult = await generateSeoContentWithAi(aiTopic, aiKeyword);
      isGeneratingSeo = false;
      renderSeoSubView();
    });
  }

  renderSeoSubView();
}

// -------------------------------------------------------------
// TAB 13: SEGURIDAD Y AUDITORÍA (Sección 18 y 20)
// -------------------------------------------------------------
function renderAuditTab(container: HTMLElement) {
  const logs = store.getAuditLogs();

  container.innerHTML = `
    <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <span class="badge" style="background: #FFEBEE; color: #C62828;">Módulo Crítico</span>
          <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700; margin-top: 0.25rem;">
            Trazabilidad Inmutable y Bitácora de Auditoría
          </h2>
          <p style="font-size: 0.85rem; color: #6A635E;">
            Cada movimiento, modificación de precios, cambio de permisos y pago queda registrado con usuario, fecha, hora y motivo.
          </p>
        </div>
        <span class="badge badge-active">${logs.length} eventos auditados</span>
      </div>

      <div style="background: #FAF7F5; padding: 0.85rem 1rem; border-radius: 12px; margin-bottom: 1.25rem; font-size: 0.8rem; color: #6A635E; border: 1px solid var(--c-neutral-100);">
        🛡️ <strong>Aislamiento Garantizado:</strong> Las credenciales administrativas nunca se envían al frontend de los revendedores. Las consultas entre cuentas están estrictamente denegadas por diseño de arquitectura.
      </div>

      <table class="bem-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Usuario</th>
            <th>Acción Realizada</th>
            <th>Entidad ID</th>
            <th>Detalles y Motivo</th>
          </tr>
        </thead>
        <tbody>
          ${logs.map(l => `
            <tr>
              <td style="font-family: monospace; font-size: 0.75rem;">
                ${new Date(l.timestamp).toLocaleString('es-AR')}
              </td>
              <td><strong>${l.userName}</strong></td>
              <td><span class="badge" style="background: var(--c-rose-100); color: var(--c-rose-600);">${l.action}</span></td>
              <td style="font-family: monospace; font-size: 0.75rem;">${l.entityId}</td>
              <td style="font-size: 0.78rem;">${l.reason || 'Sin detalles'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
