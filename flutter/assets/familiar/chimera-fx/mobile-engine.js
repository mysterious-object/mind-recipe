/* App bridge only. Rendering is performed exclusively by Darkstar's
 * chimera-fx-bundle.js factory and Engine post-processing pipeline. */
import ChimeraFX from './chimera-fx-bundle.js';

const stage = document.getElementById('stage');
const themeNames = ['chimera-native', 'organic-bioluminescent', 'quantum-void', 'holographic-matrix', 'cyberpunk-neon'];
const surface = location.pathname.endsWith('intro.html') ? 'intro' : location.pathname.endsWith('index.html') ? 'pulse' : 'background';
const preset = surface === 'pulse' ? 'full' : surface === 'intro' ? 'cinematic' : 'holographic';
let fx;
function bridge(message) { for (const name of ['BackgroundBridge', 'IntroBridge', 'FamiliarBridge']) { try { window[name]?.postMessage(message); } catch (_) {} } }
function setCanvasStrength(value) { if (fx?.renderer?.domElement) fx.renderer.domElement.style.opacity = String(Math.max(.55, Math.min(1, value))); }
function applyTheme(index) { fx?.setTheme(ChimeraFX.themes[themeNames[Math.abs(index) % themeNames.length]]); }
function applyState(progress, intensity) { setCanvasStrength(.58 + Number(intensity || .7) * .42); const p = Number(progress || 0); fx?.setState(p > .72 ? 'success' : p > .35 ? 'thinking' : 'idle'); }
try {
  fx = ChimeraFX.create({ container: stage, preset, theme: 'chimera-native', fps: 30, bloomStrength: surface === 'pulse' ? .85 : .65, bloomRadius: .7, bloomThreshold: .16 });
  fx.renderer.domElement.style.position = 'absolute'; fx.renderer.domElement.style.inset = '0'; fx.renderer.domElement.style.width = '100%'; fx.renderer.domElement.style.height = '100%'; fx.renderer.domElement.style.opacity = '.82';
  fx.renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); bridge('context_lost'); });
  fx.renderer.debug.onShaderError = () => bridge('shader_error'); bridge('ready');
} catch (error) { console.error('ChimeraFX engine startup failed', error); bridge('engine_error'); }
window.setBackgroundState = value => { if (!value || !fx) return; const index = ['field', 'nebula', 'rivers', 'tendrils', 'orbs', 'lattice', 'void', 'prism', 'aurora', 'ember', 'ocean', 'twilight'].indexOf(value.variant); applyTheme(index < 0 ? 0 : index); applyState(value.progress, value.intensity); };
window.setBackgroundPaused = value => { if (value) fx?._pause(); else fx?._resume(); };
window.setIntroVariant = value => { if (!fx) return; applyTheme(Number(value) || 0); applyState(.58, .92); fx.pulse('success'); };
window.setIntroPaused = value => window.setBackgroundPaused(value);
window.setFamiliarState = value => { if (!value || !fx) return; const growth = Number(value.growth || 0), form = Number(value.form || 0); applyTheme(Number(value.seed || 0)); applyState(Math.max(growth, form), .65 + Number(value.activation || .35) * .35); if (growth > .72) fx.pulse('success'); };
window.setFamiliarPaused = value => window.setBackgroundPaused(value);
