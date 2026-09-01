// Mind Recipe bridge for the locally bundled renderer.
import './mind-recipe-vfx-engine.js';

const fx = window.ChimeraVFX;
const notify = value => ['BackgroundBridge', 'IntroBridge', 'FamiliarBridge'].forEach(name => { try { window[name]?.postMessage(value); } catch (_) {} });
const canvas = () => document.getElementById('chimera-vfx-gl');

function intensity(value) {
  if (!fx) return;
  const v = Math.max(.5, Math.min(1, Number(value ?? .8)));
  fx.setIntensity(v);
}
function apply(value = {}) {
  if (!fx) return;
  const progress = Number(value.progress ?? value.growth ?? 0);
  const activation = Number(value.activation ?? value.intensity ?? .55);
  intensity(.65 + activation * .35);
  fx.setAI(Math.max(0, Math.min(1, activation + progress * .25)));
  fx.setThinking(activation > .5 || progress > .35);
  if (progress > .72) fx.pulse();
}
window.setBackgroundState = apply;
window.setBackgroundPaused = paused => fx?.toggle(!paused);
window.setIntroVariant = variant => { apply({ progress: .45, intensity: .7 + (Number(variant || 0) % 3) * .08 }); fx?.pulse(); };
window.setIntroPaused = paused => fx?.toggle(!paused);
window.setFamiliarState = value => {
  apply(value);
  if (value?.growth != null) fx?.setText(value.growth > .72 ? 'GROWING' : value.growth > .38 ? 'STEADY' : 'BEGIN');
};
window.setFamiliarPaused = paused => fx?.toggle(!paused);

requestAnimationFrame(() => {
  if (!canvas()) { notify('engine_error'); return; }
  canvas().addEventListener('webglcontextlost', event => { event.preventDefault(); notify('context_lost'); });
  notify('ready');
});
