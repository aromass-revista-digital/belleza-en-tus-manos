import { store } from '../services/store';
import { generateCommercialPitchWithAi } from '../services/geminiService';
import { ICONS } from './icons';

export function renderSalesToolsView(container: HTMLElement) {
  const currentUser = store.getCurrentUser();
  const products = store.getProducts();
  let selectedProductId = products[0]?.id || '';
  let selectedChannel: 'whatsapp' | 'instagram' | 'facebook' | 'tiktok' = 'whatsapp';
  let generatedText = '';
  let isGenerating = false;

  function render() {
    const selectedProd = products.find(p => p.id === selectedProductId) || products[0];

    container.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        <!-- Header -->
        <div style="margin-bottom: 1.5rem; text-align: center;">
          <span class="badge" style="background: var(--c-champagne); color: #553E17; margin-bottom: 0.5rem;">
            ${ICONS.sparkles} Impulsor de Ventas con IA
          </span>
          <h1 class="font-serif" style="font-size: 1.85rem; color: #24201E; font-weight: 700;">
            Mi Herramienta de Ventas
          </h1>
          <p style="font-size: 0.9rem; color: #6A635E; max-width: 620px; margin: 0.25rem auto 0 auto;">
            Generá publicaciones y textos comerciales persuasivos listos para enviar a tus clientas por WhatsApp y redes sociales. Precios públicos siempre actualizados y protegidos.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
          <!-- Controls Panel -->
          <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
              <!-- Select Product -->
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Elegí el producto a promocionar</label>
                <select id="sales-product-select" class="form-select">
                  ${products.map(p => `
                    <option value="${p.id}" ${p.id === selectedProductId ? 'selected' : ''}>
                      [${p.brand}] ${p.name} — $${p.publicPrice.toLocaleString('es-AR')}
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Select Channel -->
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Canal de difusión</label>
                <div style="display: flex; gap: 0.4rem; background: var(--c-rose-50); padding: 0.25rem; border-radius: var(--radius-md); border: 1px solid var(--c-neutral-200);">
                  <button class="channel-btn btn ${selectedChannel === 'whatsapp' ? 'btn-primary' : 'btn-outline'}" data-channel="whatsapp" style="flex: 1; padding: 0.4rem 0.5rem; font-size: 0.78rem;">
                    ${ICONS.whatsapp} WhatsApp
                  </button>
                  <button class="channel-btn btn ${selectedChannel === 'instagram' ? 'btn-primary' : 'btn-outline'}" data-channel="instagram" style="flex: 1; padding: 0.4rem 0.5rem; font-size: 0.78rem;">
                    Instagram
                  </button>
                  <button class="channel-btn btn ${selectedChannel === 'facebook' ? 'btn-primary' : 'btn-outline'}" data-channel="facebook" style="flex: 1; padding: 0.4rem 0.5rem; font-size: 0.78rem;">
                    Facebook
                  </button>
                </div>
              </div>
            </div>

            <!-- Product Quick Preview -->
            ${selectedProd ? `
              <div style="display: flex; align-items: center; gap: 1rem; background: #FAF7F5; padding: 0.85rem 1rem; border-radius: 12px; margin-bottom: 1.25rem; border: 1px solid var(--c-neutral-100);">
                <img src="${selectedProd.image}" alt="${selectedProd.name}" style="width: 54px; height: 54px; border-radius: 8px; object-fit: cover;" referrerpolicy="no-referrer" />
                <div style="flex: 1;">
                  <div style="font-size: 0.72rem; color: var(--c-neutral-400); font-weight: 700;">${selectedProd.brand.toUpperCase()} • CÓD ${selectedProd.code}</div>
                  <div style="font-size: 0.92rem; font-weight: 700; color: #24201E;">${selectedProd.name}</div>
                  <div style="font-size: 0.85rem; color: #D4AF37; font-weight: 700;">Precio Público: $${selectedProd.publicPrice.toLocaleString('es-AR')}</div>
                </div>
                <button class="btn btn-gold" id="btn-generate-ai" style="white-space: nowrap;" ${isGenerating ? 'disabled' : ''}>
                  ${isGenerating ? 'Generando con IA...' : `${ICONS.sparkles} Generar Mensaje`}
                </button>
              </div>
            ` : ''}

            <!-- Generated Pitch Area -->
            <div class="form-group" style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="form-label">Mensaje comercial generado</label>
                <span style="font-size: 0.75rem; color: #2E7D32; font-weight: 600;">✓ Protección total: información de costos oculta</span>
              </div>
              <textarea id="sales-pitch-textarea" class="form-textarea" style="min-height: 170px; font-size: 0.88rem; line-height: 1.5;">${generatedText || 'Tocá en "Generar Mensaje" para que la Inteligencia Artificial redacte el texto comercial adaptado a tu producto.'}</textarea>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: flex-end;">
              <button class="btn btn-outline" id="btn-copy-pitch">
                ${ICONS.share} Copiar Texto
              </button>
              <button class="btn btn-primary" id="btn-share-whatsapp" style="background: #25D366; color: #FFF; border-color: #25D366;">
                ${ICONS.whatsapp} Enviar por WhatsApp
              </button>
            </div>
          </div>

          <!-- Share Full Catalog Banner -->
          <div style="background: linear-gradient(135deg, #FDFBF7 0%, #FAF3EA 100%); border: 1px solid var(--c-champagne); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
            <div>
              <h3 class="font-serif" style="font-size: 1.15rem; color: #24201E; font-weight: 700; margin-bottom: 0.25rem;">
                Compartir Catálogo Completo a tus Clientas
              </h3>
              <p style="font-size: 0.85rem; color: #6A635E;">
                Enviá tu enlace seguro de catálogo digital. Tus clientas solo verán fotografías, descripciones y precios públicos.
              </p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-gold" id="btn-copy-catalog-link">
                ${ICONS.share} Copiar Enlace
              </button>
              <button class="btn btn-primary" id="btn-share-catalog-wa" style="background: #25D366; color: #FFF; border-color: #25D366;">
                ${ICONS.whatsapp} Compartir Catálogo
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach Handlers
    const productSelect = container.querySelector('#sales-product-select') as HTMLSelectElement;
    productSelect?.addEventListener('change', (e) => {
      selectedProductId = (e.target as HTMLSelectElement).value;
      render();
    });

    container.querySelectorAll('.channel-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedChannel = (e.currentTarget as HTMLElement).dataset.channel as any;
        render();
      });
    });

    container.querySelector('#btn-generate-ai')?.addEventListener('click', async () => {
      if (!selectedProd) return;
      isGenerating = true;
      render();
      generatedText = await generateCommercialPitchWithAi(selectedProd, selectedChannel, currentUser.fullName);
      isGenerating = false;
      render();
    });

    container.querySelector('#btn-copy-pitch')?.addEventListener('click', () => {
      const textarea = container.querySelector('#sales-pitch-textarea') as HTMLTextAreaElement;
      if (textarea) {
        navigator.clipboard.writeText(textarea.value);
        alert('¡Texto comercial copiado al portapapeles!');
      }
    });

    container.querySelector('#btn-share-whatsapp')?.addEventListener('click', () => {
      const textarea = container.querySelector('#sales-pitch-textarea') as HTMLTextAreaElement;
      const text = textarea ? textarea.value : '';
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });

    container.querySelector('#btn-copy-catalog-link')?.addEventListener('click', () => {
      const link = `${window.location.origin}/catalogo?ref=${currentUser.id}`;
      navigator.clipboard.writeText(link);
      alert('Enlace del catálogo copiado: ' + link);
    });

    container.querySelector('#btn-share-catalog-wa')?.addEventListener('click', () => {
      const link = `${window.location.origin}/catalogo?ref=${currentUser.id}`;
      const msg = `🌸 ¡Hola! Te comparto el Catálogo Digital de Belleza en tus Manos con lo mejor de Natura y AVON. Mirá las ofertas y avisame qué te gusta para tu pedido: ${link}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  // Initial pitch auto-generation if not set
  if (!generatedText && products[0]) {
    generateCommercialPitchWithAi(products[0], 'whatsapp', currentUser.fullName).then(res => {
      generatedText = res;
      render();
    });
  } else {
    render();
  }
}
