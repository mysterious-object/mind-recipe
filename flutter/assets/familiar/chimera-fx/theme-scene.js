import ChimeraFX from './chimera-fx-bundle.js';

const host = document.getElementById('stage') || document.body;
let engine = null;
let paused = false;
let lastState = { theme: 'chimera-native', progress: 0, intensity: 0.72 };

function notify(message) {
  try { window.BackgroundBridge?.postMessage(message); } catch (_) {}
}

function supportedTheme(value) {
  return typeof value === 'string' && ChimeraFX.themes[value]
    ? value
    : 'chimera-native';
}

function render(state = {}) {
  lastState = { ...lastState, ...state };
  const theme = supportedTheme(lastState.theme);
  try {
    engine?.dispose?.();
    engine = ChimeraFX.create({
      container: host,
      fps: 30,
      theme,
      preset: 'lite',
      bloomStrength: 0.35,
    });
    window._mindRecipeFX = engine;
    const activation = Math.max(0, Math.min(1, Number(lastState.intensity) || 0));
    const progress = Math.max(0, Math.min(1, Number(lastState.progress) || 0));
    engine.setState(activation > 0.78 ? 'thinking' : progress > 0.68 ? 'success' : progress > 0.3 ? 'streaming' : 'idle');
    if (paused) engine._pause?.();
    const color = engine.theme?.colors?.background;
    if (color) {
      const css = `#${color.getHexString()}`;
      document.documentElement.style.background = css;
      document.body.style.background = css;
      host.style.background = css;
    }
    const canvas = engine.renderer?.domElement;
    if (canvas) {
      canvas.style.opacity = '0.92';
      canvas.style.mixBlendMode = 'screen';
      canvas.addEventListener('webglcontextlost', event => {
        event.preventDefault();
        notify('context_lost');
      }, { once: true });
    }
    notify(`ready:${theme}`);
  } catch (error) {
    notify(`shader_error:${String(error?.message || error).slice(0, 100)}`);
  }
}

window.setBackgroundState = render;
window.setBackgroundPaused = value => {
  paused = Boolean(value);
  paused ? engine?._pause?.() : engine?._resume?.();
};
window.addEventListener('error', event => notify(`engine_error:${String(event.message || 'unknown').slice(0, 100)}`));
render();
