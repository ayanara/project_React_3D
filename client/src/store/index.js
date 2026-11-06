import { proxy, subscribe } from 'valtio';
import { defaults, sanitizePersonalization, readPersonalization, writePersonalization } from './personalization';

const state = proxy({
  intro: true,
  ...defaults,
  ready: false,
  saveStatus: '',
});

let initialization;
export function initializePersonalization() {
  initialization ??= (async () => {
    try {
      const saved = await readPersonalization();
      Object.assign(state, sanitizePersonalization(saved));
      state.saveStatus = saved ? 'Personalização recuperada neste navegador.' : '';
    } catch {
      state.saveStatus = 'Não foi possível recuperar a personalização neste navegador.';
    }
    state.ready = true;
    let previous = Object.keys(defaults).map((key) => state[key]);
    let pending;
    let writing = false;
    let revision = 0;
    async function savePending() {
      if (writing) return;
      writing = true;
      while (pending) {
        const { design, currentRevision } = pending;
        pending = null;
        try {
          await writePersonalization(design);
          if (revision === currentRevision) state.saveStatus = 'Salvo neste navegador.';
        } catch {
          if (revision === currentRevision) state.saveStatus = 'Não foi possível salvar. Suas alterações podem se perder ao sair.';
        }
      }
      writing = false;
    }
    subscribe(state, () => {
      const values = Object.keys(defaults).map((key) => state[key]);
      if (values.every((value, index) => value === previous[index])) return;
      previous = values;
      const currentRevision = ++revision;
      const design = Object.fromEntries(Object.keys(defaults).map((key) => [key, state[key]]));
      state.saveStatus = 'Salvando…';
      pending = { design, currentRevision };
      savePending();
    });
  })();
  return initialization;
}

export default state;
