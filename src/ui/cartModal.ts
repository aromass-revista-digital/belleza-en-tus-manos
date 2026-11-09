import { store } from '../services/store';
import { ICONS } from './icons';

export function showCartModal(onOrderConfirmed?: () => void) {
  const currentUser = store.getCurrentUser();
  const cartItems = store.getCart();
  const pointsRules = store.getPointsRules();
  const shippingConfig = store.getShippingConfig();

  let totalPublic = 0;
  let totalGain = 0;
  let totalDue = 0;

  cartItems.forEach(({ product, quantity }) => {
    totalPublic += product.publicPrice * quantity;
    totalGain += product.resellerGain * quantity;
    totalDue += Math.round(product.publicPrice * (1.2 / 1.3)) * quantity; // Net amount (P * 1.20)
  });

  // Calculate required points according to admin rules
  const pointsRequired = pointsRules.enabled ? pointsRules.pointsRequiredPerOrder : 0;
  const userPointsBalance = currentUser.pointsBalance ?? 0;
  const hasEnoughPoints = !pointsRules.enabled || userPointsBalance >= pointsRequired;
  const missingPoints = Math.max(0, pointsRequired - userPointsBalance);

  // Address and locality state for live shipping computation
  let currentLocality = currentUser.locality || 'Morón';
  let currentAddress = currentUser.fullAddress || 'Av. Rivadavia 17400';

  const modal = document.createElement('div');
  modal.className = 'bem-modal-backdrop';
  modal.id = 'bem-cart-modal';

  function renderModalContent() {
    const shipping = store.calculateShippingCost(currentAddress, currentLocality);
    const finalTotalWithShipping = totalDue + shipping.cost;

    modal.innerHTML = `
      <div class="bem-modal-box" style="max-width: 650px; max-height: 90vh; overflow-y: auto;">
        <button id="btn-close-cart" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6A635E; cursor: pointer;">&times;</button>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
          <span class="badge" style="background: var(--c-champagne); color: #553E17;">Multimarca Unificado</span>
          <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700;">Mi Carrito de Pedido</h2>
        </div>
        <p style="font-size: 0.85rem; color: #6A635E; margin-bottom: 1rem;">
          Revendedora: <strong>${currentUser.fullName}</strong> • Podés combinar productos de Natura y AVON libremente.
        </p>

        <!-- Points Balance & Validation Card (Prompt Complementario #3) -->
        <div style="background: ${hasEnoughPoints ? '#F4FBF7' : '#FDF3F3'}; border: 1px solid ${hasEnoughPoints ? '#A3D9B5' : '#F5B7B1'}; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="font-size: 1.2rem;">⭐</span>
              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: #4A4441; text-transform: uppercase;">Control de Puntos Oficial</div>
                <div style="font-size: 0.85rem; color: #24201E;">
                  Tu saldo disponible: <strong style="font-size: 0.95rem; color: ${hasEnoughPoints ? '#1E7E34' : '#C0392B'};">${userPointsBalance} pts</strong>
                  • Requiere: <strong>${pointsRequired} pts</strong>
                </div>
              </div>
            </div>
            ${hasEnoughPoints ? `
              <span class="badge" style="background: #D4EDDA; color: #155724; font-weight: 700;">✓ Puntos Suficientes</span>
            ` : `
              <span class="badge" style="background: #F8D7DA; color: #721C24; font-weight: 700;">Bloqueado: Faltan ${missingPoints} pts</span>
            `}
          </div>
          ${!hasEnoughPoints ? `
            <div style="font-size: 0.78rem; color: #721C24; margin-top: 0.5rem; line-height: 1.35; background: rgba(255,255,255,0.7); padding: 0.5rem 0.75rem; border-radius: 8px;">
              ⚠️ <strong>Bloqueo de seguridad:</strong> No tenés suficientes puntos para confirmar este pedido. Faltan <strong>${missingPoints} puntos</strong>. Los puntos se acreditan según las reglas comerciales de la distribuidora o por aprobación administrativa.
            </div>
          ` : ''}
        </div>

        ${cartItems.length === 0 ? `
          <div style="text-align: center; padding: 2.5rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🛍️</div>
            <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E;">Tu carrito está vacío</h3>
            <p style="font-size: 0.85rem; color: #6A635E; margin-top: 0.25rem;">Explorá los productos del catálogo y sumá artículos.</p>
          </div>
        ` : `
          <!-- Items List -->
          <div style="max-height: 200px; overflow-y: auto; margin-bottom: 1rem; border: 1px solid var(--c-neutral-100); border-radius: 12px; padding: 0.5rem;">
            ${cartItems.map(({ product, quantity }) => `
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.5rem; border-bottom: 1px solid var(--c-neutral-50);">
                <img src="${product.image}" alt="${product.name}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;" referrerpolicy="no-referrer" />
                <div style="flex: 1;">
                  <div style="font-size: 0.7rem; color: #6A635E; font-weight: 700;">${product.brand.toUpperCase()} • CÓD ${product.code}</div>
                  <div style="font-size: 0.84rem; font-weight: 700; color: #24201E;">${product.name}</div>
                  <div style="font-size: 0.78rem; color: #6A635E;">
                    Púb: $${product.publicPrice.toLocaleString('es-AR')} • <span style="color: #2E7D32; font-weight: 700;">+$${product.resellerGain.toLocaleString('es-AR')} ganancia c/u</span>
                  </div>
                </div>

                <!-- Quantity adjustment -->
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <button class="btn-qty-minus btn btn-outline" data-id="${product.id}" style="width: 26px; height: 26px; padding: 0; font-size: 0.85rem;">-</button>
                  <span style="font-weight: 700; font-size: 0.85rem; min-width: 18px; text-align: center;">${quantity}</span>
                  <button class="btn-qty-plus btn btn-outline" data-id="${product.id}" style="width: 26px; height: 26px; padding: 0; font-size: 0.85rem;">+</button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Totals Breakdown & Shipping by Distance (Prompt Complementario #4) -->
          <div style="background: #FAF7F5; border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
              <span>Total Precio Público (a cobrar a clientas):</span>
              <strong style="color: #24201E;">$${totalPublic.toLocaleString('es-AR')}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem; color: #2E7D32;">
              <span>Tu comisión estimada neta (10% sobre base):</span>
              <strong>+$${totalGain.toLocaleString('es-AR')}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #553E17;">
              <span>Subtotal neto de mercadería:</span>
              <strong>$${totalDue.toLocaleString('es-AR')}</strong>
            </div>

            <!-- Costo de Envío por Distancia -->
            <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 10px; padding: 0.75rem; margin-top: 0.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <span style="font-weight: 700; color: #24201E;">🚚 Envío por Distancia ($${shippingConfig.pricePer10Km.toLocaleString('es-AR')} c/ 10 km):</span>
                <strong style="font-size: 0.95rem; color: #1B5E20;">$${shipping.cost.toLocaleString('es-AR')}</strong>
              </div>
              <div style="font-size: 0.76rem; color: #6A635E; line-height: 1.35;">
                • Desde: <strong>${shippingConfig.distributionCenterAddress}</strong><br />
                • Distancia calculada: <strong>${shipping.distanceKm} km</strong> (${shipping.tramos10Km} tramo(s) de 10 km completos o iniciados).
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; border-top: 1px dashed var(--c-neutral-200); padding-top: 0.65rem; margin-top: 0.65rem;">
              <span style="font-weight: 800; color: #553E17; font-size: 0.95rem;">TOTAL GENERAL A PAGAR CON ENVÍO:</span>
              <strong style="font-size: 1.35rem; color: #D4AF37;">$${finalTotalWithShipping.toLocaleString('es-AR')}</strong>
            </div>
          </div>

          <!-- Section 9: Delivery Details, Locality & Full Reseller Data -->
          <div style="background: #FFF; border: 1px solid var(--c-neutral-200); border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem; font-size: 0.82rem;">
            <div style="font-weight: 700; color: #24201E; margin-bottom: 0.5rem;">Datos de Entrega y Disponibilidad Declarada</div>
            
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Domicilio completo de entrega:</label>
                <input type="text" id="order-delivery-address" class="form-input" value="${currentAddress}" style="font-size: 0.82rem; padding: 0.45rem 0.75rem;" />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Localidad / Barrio:</label>
                <input type="text" id="order-locality" class="form-input" value="${currentLocality}" style="font-size: 0.82rem; padding: 0.45rem 0.75rem;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Persona autorizada a recibir:</label>
                <input type="text" id="order-authorized-receiver" class="form-input" value="${currentUser.authorizedReceiver || currentUser.fullName}" style="font-size: 0.82rem; padding: 0.45rem 0.75rem;" />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Teléfono de contacto para entrega:</label>
                <input type="text" id="order-receiver-phone" class="form-input" value="${currentUser.receiverPhone || currentUser.phone}" style="font-size: 0.82rem; padding: 0.45rem 0.75rem;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.75rem;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Días y horario de entrega:</label>
                <input type="text" id="order-delivery-schedule" class="form-input" value="${currentUser.deliveryDaysAndHours || 'Lunes a Viernes 14 a 18 hs'}" style="font-size: 0.82rem; padding: 0.45rem 0.75rem;" />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Instrucciones de entrega:</label>
                <input type="text" id="order-delivery-instructions" class="form-input" value="${currentUser.deliveryInstructions || currentUser.references || ''}" placeholder="Ej: Timbre depto 2B, portón negro" style="font-size: 0.82rem; padding: 0.45rem 0.75rem;" />
              </div>
            </div>

            <!-- Mandatory Acceptance Checkbox -->
            <label style="display: flex; align-items: flex-start; gap: 0.5rem; cursor: pointer; color: #4A4441;">
              <input type="checkbox" id="order-terms-checkbox" style="margin-top: 3px; accent-color: var(--c-rose-600);" />
              <span>
                <strong>Aceptación expresa:</strong> Confirmo la revisión del pedido, entiendo que los precios quedan congelados bajo el ciclo vigente, me comprometo al pago del importe neto estipulado ($${finalTotalWithShipping.toLocaleString('es-AR')}) y acepto el plazo de entrega a domicilio de hasta 5 días posteriores al cierre del ciclo.
              </span>
            </label>
          </div>

          <!-- Submit Button -->
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button class="btn btn-outline" id="btn-cancel-cart">Seguir Comprando</button>
            <button class="btn btn-primary" id="btn-confirm-order" ${!hasEnoughPoints ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
              ${ICONS.check} ${hasEnoughPoints ? 'Confirmar y Congelar Pedido' : `Bloqueado: Faltan ${missingPoints} pts`}
            </button>
          </div>
        `}
      </div>
    `;

    // Attach listeners
    modal.querySelector('#btn-close-cart')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#btn-cancel-cart')?.addEventListener('click', () => modal.remove());

    const addrInput = modal.querySelector('#order-delivery-address') as HTMLInputElement;
    const locInput = modal.querySelector('#order-locality') as HTMLInputElement;

    addrInput?.addEventListener('change', () => {
      currentAddress = addrInput.value;
      renderModalContent();
    });
    locInput?.addEventListener('change', () => {
      currentLocality = locInput.value;
      renderModalContent();
    });

    modal.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id!;
        store.updateCartQuantity(id, -1);
        window.dispatchEvent(new CustomEvent('bem-cart-updated'));
        showCartModal(onOrderConfirmed);
      });
    });

    modal.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id!;
        store.updateCartQuantity(id, 1);
        window.dispatchEvent(new CustomEvent('bem-cart-updated'));
        showCartModal(onOrderConfirmed);
      });
    });

    modal.querySelector('#btn-confirm-order')?.addEventListener('click', () => {
      if (!hasEnoughPoints) {
        alert(`Operación bloqueada por el sistema: No disponés de suficientes puntos para confirmar este pedido. Tu saldo actual es de ${userPointsBalance} pts y este pedido requiere ${pointsRequired} pts (faltan ${missingPoints} pts).`);
        return;
      }

      const checkbox = modal.querySelector('#order-terms-checkbox') as HTMLInputElement;
      if (!checkbox || !checkbox.checked) {
        alert('Para confirmar el pedido es requisito obligatorio tildar la casilla de aceptación expresa de las condiciones comerciales.');
        return;
      }

      const addressVal = (modal.querySelector('#order-delivery-address') as HTMLInputElement)?.value || currentAddress;
      const localityVal = (modal.querySelector('#order-locality') as HTMLInputElement)?.value || currentLocality;
      const receiverVal = (modal.querySelector('#order-authorized-receiver') as HTMLInputElement)?.value || currentUser.fullName;
      const scheduleVal = (modal.querySelector('#order-delivery-schedule') as HTMLInputElement)?.value || 'Lunes a Viernes 14 a 18 hs';
      const receiverPhoneVal = (modal.querySelector('#order-receiver-phone') as HTMLInputElement)?.value || currentUser.phone;
      const instructionsVal = (modal.querySelector('#order-delivery-instructions') as HTMLInputElement)?.value || '';

      try {
        const order = store.confirmOrder(
          addressVal,
          localityVal,
          scheduleVal,
          receiverVal,
          {
            receiverPhone: receiverPhoneVal,
            deliveryInstructions: instructionsVal,
            neighborhood: localityVal
          }
        );

        modal.remove();
        window.dispatchEvent(new CustomEvent('bem-cart-updated'));
        alert(`¡Pedido ${order.id} confirmado con éxito!\nNúmero de Picking asignado: ${order.pickingNumber}\nTus precios quedaron congelados. El costo de envío por distancia ($${order.shippingCost.toLocaleString('es-AR')}) fue agregado al total.`);
        if (onOrderConfirmed) onOrderConfirmed();
      } catch (err: any) {
        alert(err.message || 'Error al procesar el pedido.');
      }
    });
  }

  renderModalContent();
  document.body.appendChild(modal);
}

