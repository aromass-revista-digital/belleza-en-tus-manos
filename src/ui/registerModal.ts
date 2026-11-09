import { store } from '../services/store';

export function showRegisterModal(onSuccess?: () => void) {
  const modal = document.createElement('div');
  modal.className = 'bem-modal-backdrop';
  modal.innerHTML = `
    <div class="bem-modal-box" style="max-width: 660px; max-height: 90vh; overflow-y: auto;">
      <button id="btn-close-reg" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6A635E; cursor: pointer;">&times;</button>
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
        <span class="badge" style="background: var(--c-champagne); color: #553E17;">Nueva Revendedora</span>
        <span class="badge" style="background: #E8F5E9; color: #2E7D32;">Bono de Bienvenida: 50 Pts</span>
      </div>
      <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700; margin-bottom: 0.25rem;">
        Registro Oficial — Belleza en tus Manos
      </h2>
      <p style="font-size: 0.85rem; color: #6A635E; margin-bottom: 1.25rem;">
        Completá tus datos reales para generar tu identificador único (ID) de revendedora independiente. Tu cuenta incluirá un balance inicial de puntos y seguimiento de actividad.
      </p>

      <form id="reg-form" style="display: flex; flex-direction: column; gap: 0.85rem;">
        <!-- Bloque 1: Datos Personales -->
        <div style="font-size: 0.78rem; font-weight: 700; color: #553E17; text-transform: uppercase; border-bottom: 1px solid var(--c-neutral-100); padding-bottom: 0.25rem;">
          1. Datos Personales y de Identificación
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 0.75rem;">
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Nombre y Apellido *</label>
            <input type="text" id="reg-name" required class="form-input" placeholder="Ej: Marcela Alejandra Pérez" />
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label">DNI / CUIT *</label>
            <input type="text" id="reg-dni" required class="form-input" placeholder="Ej: 36.882.104" />
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Fecha Nacimiento</label>
            <input type="date" id="reg-birth" class="form-input" value="1990-05-15" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Teléfono Celular *</label>
            <input type="tel" id="reg-phone" required class="form-input" placeholder="+54 11 ..." />
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label">WhatsApp (para avisos) *</label>
            <input type="tel" id="reg-wa" required class="form-input" placeholder="+54 9 11 ..." />
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Correo Electrónico *</label>
            <input type="email" id="reg-email" required class="form-input" placeholder="nombre@gmail.com" />
          </div>
        </div>

        <!-- Bloque 2: Domicilio de Facturación y Entrega -->
        <div style="font-size: 0.78rem; font-weight: 700; color: #553E17; text-transform: uppercase; border-bottom: 1px solid var(--c-neutral-100); padding-bottom: 0.25rem; margin-top: 0.5rem;">
          2. Domicilio Completo y Georreferencia
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0.75rem;">
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Provincia *</label>
            <input type="text" id="reg-province" required class="form-input" value="Buenos Aires" />
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Localidad *</label>
            <input type="text" id="reg-locality" required class="form-input" placeholder="Ej: Castelar" />
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Barrio</label>
            <input type="text" id="reg-neighborhood" class="form-input" placeholder="Ej: Castelar Norte" />
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Código Postal *</label>
            <input type="text" id="reg-postal" required class="form-input" placeholder="1712" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 0.75rem;">
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Calle *</label>
            <input type="text" id="reg-street" required class="form-input" placeholder="Ej: Av. Zeballos" />
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Altura / Número *</label>
            <input type="text" id="reg-number" required class="form-input" placeholder="Ej: 2450" />
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Piso / Depto</label>
            <input type="text" id="reg-floor" class="form-input" placeholder="Ej: 3 B" />
          </div>
        </div>

        <div class="form-group" style="margin: 0;">
          <label class="form-label">Referencias del lugar (Fachada, portón, entre calles)</label>
          <input type="text" id="reg-ref" class="form-input" placeholder="Ej: Portón blanco, rejas negras, frente a la plaza" />
        </div>

        <!-- Bloque 3: Datos de Entrega y Recepción -->
        <div style="font-size: 0.78rem; font-weight: 700; color: #553E17; text-transform: uppercase; border-bottom: 1px solid var(--c-neutral-100); padding-bottom: 0.25rem; margin-top: 0.5rem;">
          3. Datos de Entrega y Disponibilidad
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Persona autorizada a recibir mercadería *</label>
            <input type="text" id="reg-auth" required class="form-input" placeholder="Nombre completo y DNI" />
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Teléfono de contacto de recepción</label>
            <input type="tel" id="reg-receiver-phone" class="form-input" placeholder="+54 11 ..." />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Días y horarios disponibles para entregas *</label>
            <input type="text" id="reg-hours" required class="form-input" placeholder="Ej: Lunes a Viernes 14 a 18 hs" />
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Instrucciones de entrega</label>
            <input type="text" id="reg-instructions" class="form-input" placeholder="Ej: Tocar timbre 2B, dejar con encargado" />
          </div>
        </div>

        <div style="background: #FAF7F5; padding: 0.75rem; border-radius: 10px; font-size: 0.75rem; color: #6A635E;">
          🛡️ Al enviar tu solicitud se te asignará un código único (ej: REV-2026-XXXX) con <strong>50 puntos iniciales de bienvenida</strong>. Deberás completar la capacitación obligatoria para validar tu cuenta.
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem;">
          <button type="button" class="btn btn-outline" id="btn-cancel-reg">Cancelar</button>
          <button type="submit" class="btn btn-primary">Registrarme y Obtener ID</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#btn-close-reg')?.addEventListener('click', () => modal.remove());
  modal.querySelector('#btn-cancel-reg')?.addEventListener('click', () => modal.remove());

  modal.querySelector('#reg-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const street = (modal.querySelector('#reg-street') as HTMLInputElement).value.trim();
    const number = (modal.querySelector('#reg-number') as HTMLInputElement).value.trim();
    const floor = (modal.querySelector('#reg-floor') as HTMLInputElement).value.trim();
    const fullAddress = `${street} ${number}${floor ? ' ' + floor : ''}`;

    const newUser = store.registerUser({
      fullName: (modal.querySelector('#reg-name') as HTMLInputElement).value.trim(),
      dni: (modal.querySelector('#reg-dni') as HTMLInputElement).value.trim(),
      birthDate: (modal.querySelector('#reg-birth') as HTMLInputElement).value,
      phone: (modal.querySelector('#reg-phone') as HTMLInputElement).value.trim(),
      whatsapp: (modal.querySelector('#reg-wa') as HTMLInputElement).value.trim(),
      email: (modal.querySelector('#reg-email') as HTMLInputElement).value.trim(),
      province: (modal.querySelector('#reg-province') as HTMLInputElement).value.trim(),
      locality: (modal.querySelector('#reg-locality') as HTMLInputElement).value.trim(),
      neighborhood: (modal.querySelector('#reg-neighborhood') as HTMLInputElement).value.trim(),
      postalCode: (modal.querySelector('#reg-postal') as HTMLInputElement).value.trim(),
      street,
      streetNumber: number,
      floorApt: floor,
      fullAddress,
      references: (modal.querySelector('#reg-ref') as HTMLInputElement).value.trim(),
      authorizedReceiver: (modal.querySelector('#reg-auth') as HTMLInputElement).value.trim(),
      receiverPhone: (modal.querySelector('#reg-receiver-phone') as HTMLInputElement).value.trim(),
      deliveryDaysAndHours: (modal.querySelector('#reg-hours') as HTMLInputElement).value.trim(),
      deliveryInstructions: (modal.querySelector('#reg-instructions') as HTMLInputElement).value.trim()
    });

    store.setCurrentUser(newUser.id);
    modal.remove();
    alert(`¡Registro completado! Tu ID oficial de revendedora es: ${newUser.id}.\nHas recibido ${newUser.pointsBalance} puntos de bienvenida para iniciar tu actividad.\nTu cuenta está lista para comenzar la capacitación obligatoria.`);
    if (onSuccess) onSuccess();
  });
}

