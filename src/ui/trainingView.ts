import { store } from '../services/store';
import { TRAINING_MODULES } from '../services/trainingData';
import { ICONS } from './icons';

let currentModuleId = 1;

export function renderTrainingView(container: HTMLElement) {
  const currentUser = store.getCurrentUser();
  const currentMod = TRAINING_MODULES.find(m => m.id === currentModuleId) || TRAINING_MODULES[0];
  const progressPercent = Math.round((currentUser.trainingProgress / 10) * 100);

  container.innerHTML = `
    <div style="max-width: 960px; margin: 0 auto;">
      <!-- Training Header & Progress Bar -->
      <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.6); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <span class="badge" style="background: var(--c-champagne); color: #553E17; margin-bottom: 0.35rem;">
              Capacitación Oficial Obligatoria
            </span>
            <h1 class="font-serif" style="font-size: 1.75rem; color: #24201E; font-weight: 700;">
              Academia Belleza en tus Manos
            </h1>
            <p style="font-size: 0.85rem; color: #6A635E;">
              Revendedora: <strong>${currentUser.fullName}</strong> • ID: ${currentUser.id}
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.35rem; font-weight: 800; color: ${currentUser.trainingCompleted ? '#2E7D32' : 'var(--c-gold-dark)'};">
              ${progressPercent}% Completado
            </div>
            <div style="font-size: 0.75rem; color: #6A635E;">
              ${currentUser.trainingProgress} de 10 módulos validados
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div style="width: 100%; height: 10px; background: var(--c-neutral-100); border-radius: var(--radius-full); overflow: hidden; position: relative;">
          <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #D4AF37 0%, #2E7D32 100%); transition: width 0.4s ease;"></div>
        </div>

        ${currentUser.trainingCompleted ? `
          <div style="margin-top: 1rem; background: #EDF7EE; border: 1px solid #C8E6C9; border-radius: 12px; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.75rem;">
            <div style="color: #2E7D32;">${ICONS.check}</div>
            <div style="font-size: 0.85rem; color: #1B5E20; font-weight: 600;">
              ¡Felicitaciones! Has completado el 100% de la capacitación interactiva. Tu cuenta está plenamente habilitada para enviar pedidos y recibir comisiones.
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Modules Layout Grid -->
      <div style="display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; align-items: start;">
        <!-- Left: Module List -->
        <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.4); border-radius: var(--radius-lg); padding: 1rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 0.4rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--c-neutral-400); text-transform: uppercase; padding: 0 0.5rem 0.5rem 0.5rem; border-bottom: 1px solid var(--c-neutral-100);">
            Los 10 Módulos de Aprendizaje
          </div>
          ${TRAINING_MODULES.map(m => {
            const isCompleted = currentUser.trainingProgress >= m.id;
            const isCurrent = m.id === currentModuleId;
            return `
              <button class="training-mod-nav-btn" data-id="${m.id}" style="
                display: flex;
                align-items: center;
                gap: 0.65rem;
                padding: 0.6rem 0.75rem;
                border-radius: var(--radius-md);
                border: 1px solid ${isCurrent ? 'var(--c-gold)' : 'transparent'};
                background: ${isCurrent ? 'var(--c-champagne-light)' : 'transparent'};
                color: ${isCurrent ? '#24201E' : '#4A4441'};
                font-size: 0.82rem;
                font-weight: ${isCurrent ? '700' : '500'};
                cursor: pointer;
                text-align: left;
                transition: all 0.15s ease;
              ">
                <span style="
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 0.72rem;
                  font-weight: 700;
                  background: ${isCompleted ? '#2E7D32' : (isCurrent ? 'var(--c-gold)' : 'var(--c-neutral-200)')};
                  color: ${isCompleted || isCurrent ? '#FFF' : '#6A635E'};
                  flex-shrink: 0;
                ">
                  ${isCompleted ? '✓' : m.id}
                </span>
                <span style="flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${m.title}
                </span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Right: Current Module Content -->
        <div style="background: var(--c-card-bg); border: 1px solid rgba(232, 197, 200, 0.5); border-radius: var(--radius-lg); padding: 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span class="badge" style="background: var(--c-rose-100); color: var(--c-rose-600);">
              ${currentMod.category} • ${currentMod.duration}
            </span>
            <span style="font-size: 0.8rem; color: #6A635E;">
              Paso ${currentMod.id} de 10
            </span>
          </div>

          <h2 class="font-serif" style="font-size: 1.45rem; color: #24201E; font-weight: 700; margin-bottom: 0.5rem;">
            ${currentMod.title}
          </h2>
          <p style="font-size: 0.95rem; color: #553E17; font-weight: 500; margin-bottom: 1.25rem;">
            ${currentMod.summary}
          </p>

          <!-- Core Content -->
          <div style="background: #FFF; border: 1px solid var(--c-neutral-100); border-radius: 14px; padding: 1.25rem; margin-bottom: 1.25rem;">
            <h4 style="font-size: 0.82rem; font-weight: 700; color: var(--c-neutral-400); text-transform: uppercase; margin-bottom: 0.65rem;">
              Conceptos Clave
            </h4>
            <ul style="padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.88rem; color: #383330;">
              ${currentMod.content.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>

          <!-- Tips -->
          <div style="background: var(--c-champagne-light); border: 1px solid var(--c-champagne); border-radius: 14px; padding: 1rem; margin-bottom: 1.5rem;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #553E17; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.4rem;">
              💡 Consejos de Éxito en Ventas
            </div>
            <ul style="padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.84rem; color: #6A5025;">
              ${currentMod.tips.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>

          <!-- Module Validation Quiz -->
          <div style="border-top: 1px solid var(--c-neutral-100); padding-top: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span class="badge" style="background: #E8C5C8; color: #551D24;">Pregunta de Validación</span>
              <span style="font-size: 0.78rem; color: #6A635E;">Respondé correctamente para validar el módulo</span>
            </div>
            <h3 style="font-size: 1rem; font-weight: 700; color: #24201E; margin-bottom: 1rem;">
              ${currentMod.quizQuestion}
            </h3>

            <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.25rem;" id="quiz-options-container">
              ${currentMod.quizOptions.map((opt, idx) => `
                <label style="
                  display: flex;
                  align-items: center;
                  gap: 0.75rem;
                  background: #FAF7F5;
                  border: 1px solid var(--c-neutral-200);
                  border-radius: 12px;
                  padding: 0.75rem 1rem;
                  cursor: pointer;
                  font-size: 0.86rem;
                  transition: all 0.15s ease;
                " class="quiz-option-label">
                  <input type="radio" name="training-quiz" value="${idx}" style="accent-color: var(--c-rose-600);" />
                  <span>${opt}</span>
                </label>
              `).join('')}
            </div>

            <div id="quiz-feedback-box" style="display: none; margin-bottom: 1rem; padding: 0.85rem; border-radius: 12px; font-size: 0.85rem; font-weight: 600;"></div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <button class="btn btn-outline" id="btn-prev-module" ${currentMod.id === 1 ? 'disabled' : ''}>
                ← Anterior
              </button>
              <button class="btn btn-primary" id="btn-validate-quiz">
                Verificar y Avanzar →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach handlers
  container.querySelectorAll('.training-mod-nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentModuleId = Number((e.currentTarget as HTMLElement).dataset.id);
      renderTrainingView(container);
    });
  });

  container.querySelector('#btn-prev-module')?.addEventListener('click', () => {
    if (currentModuleId > 1) {
      currentModuleId--;
      renderTrainingView(container);
    }
  });

  container.querySelector('#btn-validate-quiz')?.addEventListener('click', () => {
    const selected = container.querySelector('input[name="training-quiz"]:checked') as HTMLInputElement;
    const feedbackBox = container.querySelector('#quiz-feedback-box') as HTMLElement;
    if (!selected) {
      alert('Por favor seleccioná una respuesta para validar tu comprensión.');
      return;
    }

    const answerIdx = Number(selected.value);
    if (answerIdx === currentMod.correctAnswer) {
      feedbackBox.style.display = 'block';
      feedbackBox.style.background = '#EDF7EE';
      feedbackBox.style.color = '#1B5E20';
      feedbackBox.style.border = '1px solid #C8E6C9';
      feedbackBox.innerHTML = `✓ ¡Respuesta Correcta! Módulo ${currentMod.id} validado exitosamente.`;

      store.updateTrainingProgress(currentUser.id, currentMod.id);

      setTimeout(() => {
        if (currentModuleId < 10) {
          currentModuleId++;
        }
        renderTrainingView(container);
      }, 900);
    } else {
      feedbackBox.style.display = 'block';
      feedbackBox.style.background = '#FFEBEE';
      feedbackBox.style.color = '#B71C1C';
      feedbackBox.style.border = '1px solid #FFCDD2';
      feedbackBox.innerHTML = `✗ Respuesta incorrecta. Releé los conceptos clave del módulo e intentá de nuevo.`;
    }
  });
}
