import { store } from '../services/store';
import { Order } from '../types';
import { ICONS } from './icons';

export function renderOrdersView(container: HTMLElement) {
  const currentUser = store.getCurrentUser();
  const orders = store.getOrders();
  const bankInfo = store.getBankInfo();

  container.innerHTML = `
    <div style="max-width: 960px; margin: 0 auto;">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <h1 class="font-serif" style="font-size: 1.75rem; color: #24201E; font-weight: 700;">
            Mis Pedidos y Ganancias
          </h1>
          <p style="font-size: 0.85rem; color: #6A635E;">
            Revendedora: <strong>${currentUser.fullName}</strong> • ID: ${currentUser.id} • Puntos Disponibles: <strong style="color: #2E7D32;">${currentUser.pointsBalance ?? 0} pts</strong>
          </p>
        </div>
        <div style="background: #EDF7EE; border: 1px solid #C8E6C9; border-radius: var(--radius-md); padding: 0.5rem 1rem; text-align: right;">
          <div style="font-size: 0.72rem; color: #2E7D32; font-weight: 700; text-transform: uppercase;">COMISIÓN TOTAL ACUMULADA</div>
          <div style="font-size: 1.35rem; font-weight: 800; color: #1B5E20;">
            +$${orders.reduce((acc, o) => acc + o.totalResellerGain, 0).toLocaleString('es-AR')}
          </div>
        </div>
      </div>

      <!-- Bank Transfer & CVU Instructions Card (Prompt Complementario #5) -->
      <div style="background: linear-gradient(135deg, #FAF3EA 0%, #FDFBF7 100%); border: 1px solid var(--c-champagne); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="badge" style="background: var(--c-gold); color: #FFF;">Cuenta Oficial</span>
            <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E; font-weight: 700;">Datos para Pago de Pedidos</h3>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button id="btn-copy-cvu" class="btn btn-primary" style="font-size: 0.8rem; padding: 0.4rem 0.85rem; background: #2E7D32; border-color: #2E7D32;">
              📋 COPIAR CVU
            </button>
            <a href="intent://#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_MAPS;end" target="_blank" id="btn-open-bank-app" class="btn btn-outline" style="font-size: 0.8rem; padding: 0.4rem 0.85rem; text-decoration: none;">
              🏦 Abrir Billetera / Home Banking
            </a>
          </div>
        </div>
        <p style="font-size: 0.84rem; color: #6A635E; margin-bottom: 0.85rem;">
          Realizá la transferencia del importe exacto con envío incluido a nuestra cuenta oficial. Podés copiar el CVU con un toque:
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.75rem; font-size: 0.84rem; background: #FFF; padding: 1rem; border-radius: 12px; border: 1px solid var(--c-neutral-100);">
          <div style="background: #F9F9F9; padding: 0.5rem; border-radius: 8px;">
            <span style="color: #6A635E; font-size: 0.75rem; font-weight: 700; display: block;">CVU OFICIAL:</span>
            <strong style="font-family: monospace; font-size: 0.95rem; color: #1B5E20;" id="cvu-text-display">${bankInfo.cvu || '0000003100024866086187'}</strong>
          </div>
          <div style="background: #F9F9F9; padding: 0.5rem; border-radius: 8px;">
            <span style="color: #6A635E; font-size: 0.75rem; font-weight: 700; display: block;">ALIAS BANCARIO:</span>
            <strong style="font-size: 0.92rem; color: #24201E;">${bankInfo.alias}</strong>
          </div>
          <div style="background: #F9F9F9; padding: 0.5rem; border-radius: 8px;">
            <span style="color: #6A635E; font-size: 0.75rem; font-weight: 700; display: block;">CBU BANCARIO:</span>
            <strong style="font-family: monospace; font-size: 0.85rem; color: #24201E;">${bankInfo.cbu}</strong>
          </div>
          <div style="background: #F9F9F9; padding: 0.5rem; border-radius: 8px;">
            <span style="color: #6A635E; font-size: 0.75rem; font-weight: 700; display: block;">TITULAR Y BANCO:</span>
            <strong style="font-size: 0.85rem; color: #24201E;">${bankInfo.titular}</strong> (${bankInfo.banco})
          </div>
        </div>
      </div>

      <!-- Orders List -->
      ${orders.length === 0 ? `
        <div style="text-align: center; padding: 3.5rem 1rem; background: var(--c-card-bg); border-radius: var(--radius-lg); border: 1px dashed var(--c-rose-200);">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">📦</div>
          <h3 class="font-serif" style="font-size: 1.25rem; color: #24201E;">Aún no realizaste ningún pedido</h3>
          <p style="font-size: 0.85rem; color: #6A635E; margin: 0.35rem 0 1.25rem 0;">Explorá el catálogo multimarca y armá tu primer pedido con precios congelados.</p>
          <button class="btn btn-primary" id="btn-empty-go-catalog">
            ${ICONS.cart} Ir al Catálogo
          </button>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${orders.map(order => renderOrderCard(order)).join('')}
        </div>
      `}
    </div>
  `;

  // Copy CVU Handler
  container.querySelector('#btn-copy-cvu')?.addEventListener('click', () => {
    const cvu = bankInfo.cvu || '0000003100024866086187';
    navigator.clipboard.writeText(cvu).then(() => {
      alert(`✓ CVU copiado al portapapeles:\n${cvu}\n\nPodés pegarlo en tu aplicación bancaria o billetera virtual.`);
    }).catch(() => {
      prompt('Copia manualmente el CVU:', cvu);
    });
  });

  // Attach upload payment proof handlers
  container.querySelectorAll('.btn-upload-proof').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const orderId = (e.currentTarget as HTMLElement).dataset.id!;
      showUploadPaymentModal(orderId, () => renderOrdersView(container));
    });
  });

  // Attach direct WhatsApp dispatch handlers (without revealing admin phones)
  container.querySelectorAll('.btn-whatsapp-proof').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const orderId = (e.currentTarget as HTMLElement).dataset.id!;
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      showWhatsAppDispatchModal(order, () => renderOrdersView(container));
    });
  });

  container.querySelector('#btn-empty-go-catalog')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('bem-navigate', { detail: 'catalogo' }));
  });
}

function renderOrderCard(order: Order): string {
  const isPendingVerification = order.paymentStatus === 'Comprobante recibido';
  const paymentBadgeStyle = 
    order.paymentStatus === 'Acreditado' ? 'background: #E8F5E9; color: #2E7D32;' :
    isPendingVerification ? 'background: #E1F5FE; color: #0277BD; font-weight: 700;' :
    order.paymentStatus === 'Rechazado' ? 'background: #FFEBEE; color: #C62828;' :
    'background: #FFF8E1; color: #F57F17;';

  const steps = [
    'Confirmado',
    'Pago acreditado',
    'Compra consolidada',
    'Mercadería recibida',
    'En preparación',
    'Caja lista',
    'En reparto',
    'Entregado'
  ];
  const currentStepIdx = steps.indexOf(order.deliveryStatus);

  const displayTotal = order.totalWithShipping || (order.distributorAmountDue + (order.shippingCost || 0));

  return `
    <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.55); border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--shadow-sm);">
      <!-- Card Header -->
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem; border-bottom: 1px solid var(--c-neutral-100); padding-bottom: 0.75rem; margin-bottom: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <h3 class="font-serif" style="font-size: 1.2rem; font-weight: 700; color: #24201E;">
              ${order.id}
            </h3>
            ${order.pickingNumber ? `
              <span class="badge" style="background: #24201E; color: #FDFBF7; font-weight: 800; font-family: monospace;">
                PICKING #${order.pickingNumber}
              </span>
            ` : ''}
            <span class="badge" style="${paymentBadgeStyle}">
              ${isPendingVerification ? 'PAGO PENDIENTE DE VERIFICACIÓN' : `Pago: ${order.paymentStatus}`}
            </span>
          </div>
          <div style="font-size: 0.75rem; color: #6A635E; margin-top: 0.2rem;">
            Fecha: ${new Date(order.createdAt).toLocaleDateString('es-AR')} ${new Date(order.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} • Ciclo: ${order.cycleId}
          </div>
        </div>

        <div style="display: flex; gap: 0.5rem; align-items: center;">
          ${order.paymentStatus === 'Pendiente' ? `
            <button class="btn btn-gold btn-upload-proof" data-id="${order.id}" style="font-size: 0.8rem; padding: 0.45rem 0.85rem;">
              ${ICONS.download} Cargar Comprobante
            </button>
            <button class="btn btn-whatsapp-proof" data-id="${order.id}" style="background: #25D366; color: #FFF; border: none; font-size: 0.8rem; padding: 0.45rem 0.85rem; border-radius: var(--radius-md); font-weight: 700; display: flex; align-items: center; gap: 0.35rem; cursor: pointer;">
              💬 ENVIAR COMPROBANTE POR WHATSAPP
            </button>
          ` : isPendingVerification ? `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 0.8rem; color: #0277BD; font-weight: 700; background: #E1F5FE; padding: 0.35rem 0.75rem; border-radius: 8px;">
                ⏳ PAGO PENDIENTE DE VERIFICACIÓN
              </span>
              <button class="btn btn-whatsapp-proof" data-id="${order.id}" style="background: #25D366; color: #FFF; border: none; font-size: 0.78rem; padding: 0.35rem 0.65rem; border-radius: var(--radius-md); font-weight: 600; cursor: pointer;">
                Reenviar a WhatsApp
              </button>
            </div>
          ` : `
            <span style="font-size: 0.8rem; color: #2E7D32; font-weight: 700; background: #E8F5E9; padding: 0.35rem 0.75rem; border-radius: 8px;">
              ✓ Pago Verificado y Acreditado
            </span>
          `}
        </div>
      </div>

      <!-- Tracking Timeline Mini -->
      <div style="margin-bottom: 1.25rem; background: #FAF7F5; padding: 0.85rem; border-radius: 12px; border: 1px solid var(--c-neutral-100);">
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--c-neutral-400); text-transform: uppercase; margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
          <span>Estado Logístico de Entrega</span>
          <span style="color: #24201E; font-weight: 800;">${order.deliveryStatus}</span>
        </div>
        <div style="display: flex; gap: 4px; height: 6px; border-radius: 3px; overflow: hidden; background: #E2DED9;">
          ${steps.map((st, i) => `
            <div style="flex: 1; height: 100%; background: ${i <= currentStepIdx ? '#2E7D32' : 'transparent'};"></div>
          `).join('')}
        </div>
        <div style="font-size: 0.75rem; color: #6A635E; margin-top: 0.4rem; display: flex; flex-wrap: wrap; justify-content: space-between;">
          <span>📍 Entrega a domicilio: <strong>${order.deliveryAddress}</strong> (${order.deliverySchedule})</span>
          ${order.shippingCost ? `<span style="color: #1B5E20; font-weight: 700;">Envío por Distancia: $${order.shippingCost.toLocaleString('es-AR')} (${order.shippingDistanceKm || 0} km)</span>` : ''}
        </div>
      </div>

      <!-- Items List -->
      <div style="margin-bottom: 1rem;">
        <table class="bem-table" style="font-size: 0.82rem;">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Precio Púb.</th>
              <th>Subtotal</th>
              <th style="text-align: right;">Tu Ganancia</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>
                  <strong>${item.name}</strong>
                  <div style="font-size: 0.72rem; color: #6A635E;">${item.brand} • CÓD ${item.code} (${item.presentation})</div>
                </td>
                <td>${item.quantity}</td>
                <td>$${item.unitPublicPrice.toLocaleString('es-AR')}</td>
                <td>$${item.totalPublicPrice.toLocaleString('es-AR')}</td>
                <td style="text-align: right; color: #2E7D32; font-weight: 700;">
                  +$${item.totalResellerGain.toLocaleString('es-AR')}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Financial Totals Breakdown & Shipping (Prompt Complementario #4 & #5) -->
      <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 12px; padding: 1rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
        <div style="font-size: 0.82rem; color: #6A635E;">
          <div>Cobro a tus clientas (Precio Público Total): <strong>$${order.totalPublicPrice.toLocaleString('es-AR')}</strong></div>
          <div>Tu comisión ganada (10% sobre base): <strong style="color: #2E7D32;">+$${order.totalResellerGain.toLocaleString('es-AR')}</strong></div>
          ${order.shippingCost ? `<div>Costo de envío a domicilio: <strong style="color: #1B5E20;">$${order.shippingCost.toLocaleString('es-AR')}</strong></div>` : ''}
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.75rem; color: var(--c-neutral-400); font-weight: 700;">TOTAL FINAL CON ENVÍO INCLUIDO</div>
          <div style="font-size: 1.55rem; font-weight: 800; color: #D4AF37;">
            $${displayTotal.toLocaleString('es-AR')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function showUploadPaymentModal(orderId: string, onDone: () => void) {
  const modal = document.createElement('div');
  modal.className = 'bem-modal-backdrop';
  modal.innerHTML = `
    <div class="bem-modal-box" style="max-width: 480px;">
      <button id="btn-close-payment-modal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6A635E; cursor: pointer;">&times;</button>
      <h3 class="font-serif" style="font-size: 1.35rem; color: #24201E; font-weight: 700; margin-bottom: 0.5rem;">
        Cargar Comprobante de Pago
      </h3>
      <p style="font-size: 0.85rem; color: #6A635E; margin-bottom: 1.25rem;">
        Adjuntá la captura o comprobante de la transferencia realizada para el pedido <strong>${orderId}</strong>.
      </p>

      <div class="form-group">
        <label class="form-label">Comprobante de Transferencia (Foto o PDF)</label>
        <input type="file" id="payment-file-input" class="form-input" accept="image/*,.pdf" style="padding: 0.5rem;" />
      </div>

      <div class="form-group">
        <label class="form-label">Número de Operación o Notas</label>
        <input type="text" id="payment-notes-input" class="form-input" placeholder="Ej: Galicia #992813 - Mariana González" />
      </div>

      <div style="background: #FFF8E1; border: 1px solid #FFE082; border-radius: 10px; padding: 0.75rem; font-size: 0.78rem; color: #7F5100; margin-bottom: 1.25rem;">
        ⚠️ Recordatorio: La carga del comprobante marca el pedido como <strong>PAGO PENDIENTE DE VERIFICACIÓN</strong> hasta la acreditación formal por los administradores.
      </div>

      <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
        <button class="btn btn-outline" id="btn-cancel-upload">Cancelar</button>
        <button class="btn btn-primary" id="btn-submit-payment">Enviar Comprobante</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#btn-close-payment-modal')?.addEventListener('click', () => modal.remove());
  modal.querySelector('#btn-cancel-upload')?.addEventListener('click', () => modal.remove());

  modal.querySelector('#btn-submit-payment')?.addEventListener('click', () => {
    const notesInput = modal.querySelector('#payment-notes-input') as HTMLInputElement;
    const notes = notesInput ? notesInput.value.trim() : 'Transferencia bancaria adjunta';
    const sampleProof = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80';

    store.uploadPaymentProof(orderId, sampleProof, notes);
    alert('Comprobante enviado a revisión administrativa. El estado del pedido se actualizó a "PAGO PENDIENTE DE VERIFICACIÓN".');
    modal.remove();
    onDone();
  });
}

/**
 * Modal to dispatch payment proof via WhatsApp to either Diego or María
 * strictly without revealing their telephone numbers in the UI (Prompt Complementario #1 & #6).
 */
function showWhatsAppDispatchModal(order: Order, onDone: () => void) {
  const modal = document.createElement('div');
  modal.className = 'bem-modal-backdrop';
  const currentUser = store.getCurrentUser();
  const totalDue = order.totalWithShipping || (order.distributorAmountDue + (order.shippingCost || 0));

  modal.innerHTML = `
    <div class="bem-modal-box" style="max-width: 520px;">
      <button id="btn-close-wa-modal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6A635E; cursor: pointer;">&times;</button>
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
        <span class="badge" style="background: #25D366; color: #FFF; font-weight: 700;">WhatsApp Oficial</span>
        <h3 class="font-serif" style="font-size: 1.35rem; color: #24201E; font-weight: 700;">
          ENVIAR COMPROBANTE DE PAGO
        </h3>
      </div>
      <p style="font-size: 0.85rem; color: #6A635E; margin-bottom: 1.25rem;">
        Enviá tu comprobante de pago directamente a la administración para agilizar la verificación. Seleccioná a qué administrador enviar:
      </p>

      <div style="background: #FAF7F5; padding: 1rem; border-radius: 12px; margin-bottom: 1.25rem; font-size: 0.85rem; border: 1px solid var(--c-neutral-100);">
        <div>• <strong>Pedido:</strong> ${order.id}</div>
        <div>• <strong>Número de Picking:</strong> ${order.pickingNumber || 'En asignación'}</div>
        <div>• <strong>Revendedora:</strong> ${currentUser.fullName} (ID: ${currentUser.id})</div>
        <div>• <strong>Importe a pagar con envío:</strong> <strong style="color: #D4AF37; font-size: 1.05rem;">$${totalDue.toLocaleString('es-AR')}</strong></div>
      </div>

      <div style="font-size: 0.85rem; font-weight: 700; color: #24201E; margin-bottom: 0.5rem;">
        Seleccioná a cuál Administrador notificar:
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
        <button id="btn-dispatch-diego" class="btn" style="background: #FFF; border: 1px solid #25D366; color: #1B5E20; padding: 0.85rem 1rem; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; font-weight: 700; cursor: pointer;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.3rem;">💬</span>
            <div style="text-align: left;">
              <div>Enviar a Diego (Administrador Principal)</div>
              <div style="font-size: 0.75rem; color: #6A635E; font-weight: 400;">Notificación directa y segura de comprobante</div>
            </div>
          </div>
          <span style="color: #25D366; font-size: 1.2rem;">➔</span>
        </button>

        <button id="btn-dispatch-maria" class="btn" style="background: #FFF; border: 1px solid #25D366; color: #1B5E20; padding: 0.85rem 1rem; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; font-weight: 700; cursor: pointer;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.3rem;">💬</span>
            <div style="text-align: left;">
              <div>Enviar a María (Administradora Principal)</div>
              <div style="font-size: 0.75rem; color: #6A635E; font-weight: 400;">Notificación directa y segura de comprobante</div>
            </div>
          </div>
          <span style="color: #25D366; font-size: 1.2rem;">➔</span>
        </button>
      </div>

      <div style="background: #FFF8E1; border: 1px solid #FFE082; border-radius: 10px; padding: 0.75rem; font-size: 0.76rem; color: #7F5100; margin-bottom: 1.25rem;">
        🔒 Los números telefónicos son de uso interno exclusivo y se procesan de manera segura a través de la pasarela de WhatsApp.
      </div>

      <div style="display: flex; justify-content: flex-end;">
        <button class="btn btn-outline" id="btn-cancel-wa-dispatch">Cerrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#btn-close-wa-modal')?.addEventListener('click', () => modal.remove());
  modal.querySelector('#btn-cancel-wa-dispatch')?.addEventListener('click', () => modal.remove());

  function dispatchTo(adminTarget: 'Diego' | 'María') {
    const text = `¡Hola! Soy ${currentUser.fullName} (ID: ${currentUser.id}). Adjunto el comprobante de pago para el Pedido ${order.id} (Picking: ${order.pickingNumber || 'PENDIENTE'}). Importe total con envío: $${totalDue.toLocaleString('es-AR')}. Aguardo la verificación formal. ¡Muchas gracias!`;
    const waUrl = store.getAdminWhatsAppDispatch(adminTarget, text);

    // Update order status to "Comprobante recibido" (PAGO PENDIENTE DE VERIFICACIÓN)
    store.uploadPaymentProof(
      order.id,
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
      `Enviado por WhatsApp oficial a ${adminTarget}`
    );

    // Open WhatsApp
    window.open(waUrl, '_blank');
    modal.remove();
    onDone();
  }

  modal.querySelector('#btn-dispatch-diego')?.addEventListener('click', () => dispatchTo('Diego'));
  modal.querySelector('#btn-dispatch-maria')?.addEventListener('click', () => dispatchTo('María'));
}

