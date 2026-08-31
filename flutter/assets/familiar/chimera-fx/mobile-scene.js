// Native bridge for the original Darkstar Chimera FX engine.
// This file is bundled for mobile WebViews so the engine and all five official
// Darkstar themes load as one local script, with no module-resolution or
// network dependency.
import ChimeraFX from './chimera-fx-bundle.js';

const bridge = value => {
  for (const name of ['BackgroundBridge', 'FamiliarBridge']) {
    try { window[name]?.postMessage(value); } catch (_) {}
  }
};

const sceneKind = window.MIND_RECIPE_SCENE_MODE || 'pulse';
const host = document.getElementById('stage') || document.body;
let engine = null;
let activeTheme = 'chimera-native';
let lastState = {};

function seededCreate(seed, create) {
  // Darkstar components use Math.random while creating their visual genome.
  // Supplying a stable per-member seed makes the familiar recognizably theirs
  // across launches without collecting any additional personal information.
  const original = Math.random;
  let value = (Number(seed) >>> 0) || 17;
  Math.random = () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
  try { return create(); } finally { Math.random = original; }
}

function optionsFor(kind) {
  if (kind === 'background') {
    return {
      container: host,
      fps: 30,
      theme: activeTheme,
      components: ['nebula', 'tendrils', 'rivers', 'hud'],
      nebula: { count: 520, spread: 38 },
      tendrils: { count: 4, segments: 28, height: 16 },
      rivers: { rivers: 3, particles: 110 },
      hud: { scanSpeed: .55 },
    };
  }
  return {
    container: host,
    fps: 30,
    theme: activeTheme,
    components: ['orb', 'nebula', 'tendrils', 'rivers', 'hud'],
    orb: { size: 8.2 },
    nebula: { count: 1350, spread: 31 },
    tendrils: { count: 5, segments: 34, height: 15 },
    rivers: { rivers: 3, particles: 150 },
    hud: { scanSpeed: .7 },
  };
}

function configureCanvas() {
  const canvas = engine?.renderer?.domElement;
  if (!canvas) return;
  canvas.style.mixBlendMode = sceneKind === 'background' ? 'screen' : 'normal';
  canvas.style.opacity = sceneKind === 'background' ? '.78' : '1';
  canvas.style.zIndex = '1';
  engine.renderer.setClearColor(0x000000, sceneKind === 'background' ? 0 : 1);
}

function apply(state = {}) {
  lastState = { ...lastState, ...state };
  if (!engine) return;
  const nextTheme = ChimeraFX.themes[lastState.theme] ? lastState.theme : 'chimera-native';
  if (nextTheme !== activeTheme) {
    activeTheme = nextTheme;
    engine.setTheme(ChimeraFX.themes[activeTheme]);
  }
  const growth = Math.max(0, Math.min(1, Number(lastState.growth ?? lastState.progress ?? 0)));
  const complexity = Math.max(0, Math.min(1, Number(lastState.complexity ?? growth)));
  const activation = Math.max(0, Math.min(1, Number(lastState.activation ?? lastState.intensity ?? .35)));
  const valence = Math.max(-1, Math.min(1, Number(lastState.valence ?? 0)));

  // Pulse state is deliberately expressive but never evaluative: changes in
  // current energy alter movement, while repeated progress unlocks anatomy.
  engine.setState(activation > .74 ? 'thinking' : growth > .68 ? 'success' : complexity > .34 ? 'streaming' : 'idle');
  const components = engine.components || [];
  const orb = components.find(component => component.constructor?.name === 'IridescentOrb');
  if (orb?.mesh) {
    const scale = 1 + growth * .26 + complexity * .16;
    orb.mesh.scale.set(8.2 * scale, 8.2 * scale, 1);
    orb.mat.uniforms.uIridescenceStrength.value = .54 + complexity * .42;
    orb.mat.uniforms.uNoiseScale.value = 1.5 + complexity * 4 + Math.max(0, -valence) * .8;
  }
  const tendrils = components.find(component => component.constructor?.name === 'EnergyTendrils');
  tendrils?.meshes?.forEach(({ line }, index) => {
    line.visible = index < 2 + Math.ceil(complexity * 3);
    line.scale.setScalar(.78 + growth * .3);
  });
  const rivers = components.find(component => component.constructor?.name === 'DataRivers');
  rivers?.rivers?.forEach(({ mesh }, index) => { mesh.visible = index < 1 + Math.ceil(complexity * 2); });
  if (growth >= .8 && lastState._lastMilestone !== growth) {
    engine.pulse('success');
    lastState._lastMilestone = growth;
  }
}

function start() {
  try {
    activeTheme = ChimeraFX.themes[lastState.theme] ? lastState.theme : 'chimera-native';
    engine = seededCreate(lastState.seed, () => ChimeraFX.create(optionsFor(sceneKind)));
    configureCanvas();
    engine.renderer.domElement.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      bridge('context_lost');
    });
    engine.renderer.compile(engine.scene, engine.camera);
    engine.renderer.render(engine.scene, engine.camera);
    apply(lastState);
    bridge('ready');
  } catch (error) {
    bridge(`shader_error:${String(error?.message || error).slice(0, 100)}`);
  }
}

window.setBackgroundState = apply;
window.setFamiliarState = apply;
window.setBackgroundPaused = paused => paused ? engine?._pause() : engine?._resume();
window.setFamiliarPaused = paused => paused ? engine?._pause() : engine?._resume();

start();
