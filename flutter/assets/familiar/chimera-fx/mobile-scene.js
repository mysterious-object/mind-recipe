// Native bridge for MindRecipe's locally bundled Three.js/WebGL engine.
// Every renderer module and visual theme is packaged with the app; this scene
// never resolves a module or asset over the network.
import ChimeraFX from './chimera-fx-bundle.js';
import * as THREE from '../three.module.min.js';

const bridge = value => {
  for (const name of ['BackgroundBridge', 'FamiliarBridge', 'IntroBridge']) {
    try { window[name]?.postMessage(value); } catch (_) {}
  }
};

const sceneKind = document.body?.dataset.sceneMode || window.MIND_RECIPE_SCENE_MODE || 'pulse';
const host = document.getElementById('stage') || document.body;
const targetFPS = 30;
let engine = null;
let activeTheme = 'chimera-native';
let activeComposition = 'mindrecipe-core';
let activeSeed = 17;
let lastState = {};
let sizeObserver = null;
let lastHealthSignature = '';

// One saved MindRecipe theme selects one complete source-renderer
// composition. Every entry below is assembled exclusively from the copied
// ChimeraFX components and ShapableMatter modes; there is no Flutter painter
// or parallel shader involved. Keeping the stacks intentionally different is
// what makes a selection change the scene itself instead of merely recoloring
// the same four effects.
const COMPOSITIONS = {
  'mindrecipe-core': {
    components: ['nebula', 'tendrils', 'hud', 'matter'], matter: 'cellular',
  },
  'neon-circuit': {
    components: ['rivers', 'beams', 'hud', 'matter'], matter: 'electric',
  },
  'bioluminescent': {
    components: ['nebula', 'volumetric', 'tendrils', 'matter'], matter: 'cellular',
  },
  'quantum-void': {
    components: ['nebula', 'voronoi', 'matter'], matter: 'photonic',
  },
  'holographic-matrix': {
    components: ['hud', 'beams', 'rivers', 'matter'], matter: 'electric',
  },
  'midnight-signal': {
    components: ['rivers', 'hud', 'tendrils', 'matter'], matter: 'ionstorm',
  },
  'neon-ronin': {
    components: ['tendrils', 'beams', 'voronoi', 'matter'], matter: 'plasma',
  },
  'abyssal-current': {
    components: ['nebula', 'volumetric', 'rivers', 'matter'], matter: 'superfluid',
  },
  'solar-flare': {
    components: ['volumetric', 'tendrils', 'reaction', 'matter'], matter: 'plasma',
  },
  'void-walker': {
    components: ['nebula', 'voronoi', 'matter'], matter: 'ionstorm',
  },
  'crystal-matrix': {
    components: ['voronoi', 'beams', 'hud', 'matter'], matter: 'crystalline',
  },
  'aurora': {
    components: ['nebula', 'tendrils', 'volumetric', 'matter'], matter: 'aerogel',
  },
  'obsidian-forge': {
    components: ['metal', 'volumetric', 'beams', 'matter'], matter: 'ferrofluid',
  },
  'orchid-vapor': {
    components: ['reaction', 'tendrils', 'nebula', 'matter'], matter: 'fluid',
  },
  'tidal-glass': {
    components: ['rivers', 'volumetric', 'matter'], matter: 'superfluid',
  },
};

function compositionFor(value) {
  return COMPOSITIONS[value] ? value : 'mindrecipe-core';
}

// The original ray-marched IridescentOrb is retained in the engine,
// but some mobile WebViews compile it without drawing its surface. This is a
// geometry-backed Three.js familiar that runs in that same Three.js scene and
// uses the exact selected visual theme. It is deliberately not a Flutter
// imitation or a canvas fallback.
class EvolvingOrb {
  constructor(seed = 17) {
    this.seed = Number(seed) || 17;
    this.group = new THREE.Group();
    this.core = null;
    this.shell = null;
    this.rings = [];
    this.petals = [];
    this.light = null;
    this.evolution = { growth: 0, complexity: 0, activation: .35, valence: 0 };
  }

  init(engine) {
    const random = index => {
      const value = Math.sin((this.seed + index * 7919) * 12.9898) * 43758.5453;
      return value - Math.floor(value);
    };
    const theme = engine.theme || ChimeraFX.themes['chimera-native'];
    const primary = theme.colors.primary.clone();
    const secondary = theme.colors.secondary.clone();
    const geometry = new THREE.IcosahedronGeometry(4.25, 4);
    this.core = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({
      color: primary, emissive: primary.clone().multiplyScalar(.32),
      emissiveIntensity: 1.5, metalness: .25, roughness: .22,
      clearcoat: .9, clearcoatRoughness: .18, transparent: true, opacity: .98,
    }));
    this.core.renderOrder = 8;
    this.shell = new THREE.Mesh(new THREE.IcosahedronGeometry(4.72, 2), new THREE.MeshBasicMaterial({
      color: secondary, wireframe: true, transparent: true, opacity: .3,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    this.shell.renderOrder = 9;
    this.group.add(this.core, this.shell);

    for (let index = 0; index < 5; index += 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(5.25 + index * .34, .055 + index * .01, 8, 96), new THREE.MeshBasicMaterial({
        color: index % 2 ? secondary : primary, transparent: true,
        opacity: .42, blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      ring.rotation.set(random(index) * Math.PI, random(index + 13) * Math.PI, random(index + 29) * Math.PI);
      ring.userData.baseRotation = ring.rotation.clone();
      ring.renderOrder = 10;
      this.rings.push(ring); this.group.add(ring);
    }
    for (let index = 0; index < 8; index += 1) {
      const petal = new THREE.Mesh(new THREE.OctahedronGeometry(.42 + random(index + 50) * .26, 1), new THREE.MeshStandardMaterial({
        color: index % 2 ? secondary : primary, emissive: primary.clone(), emissiveIntensity: 1.2,
        metalness: .45, roughness: .28, transparent: true, opacity: .92,
      }));
      const theta = (index / 8) * Math.PI * 2;
      const radius = 6.2 + random(index + 70) * 1.7;
      petal.position.set(Math.cos(theta) * radius, Math.sin(theta) * radius * .58, (random(index + 90) - .5) * 3);
      petal.userData.theta = theta; petal.userData.radius = radius; petal.userData.offset = random(index + 110) * Math.PI * 2;
      petal.visible = false; petal.renderOrder = 11;
      this.petals.push(petal); this.group.add(petal);
    }
    this.light = new THREE.PointLight(primary, 8, 38, 2);
    this.group.add(this.light);
    engine.scene.add(this.group);
    this.onThemeChange(theme);
  }

  onThemeChange(theme) {
    const primary = theme.colors.primary;
    const secondary = theme.colors.secondary;
    this.core?.material.color.copy(primary);
    this.core?.material.emissive.copy(primary).multiplyScalar(.32);
    this.shell?.material.color.copy(secondary);
    this.rings.forEach((ring, index) => ring.material.color.copy(index % 2 ? secondary : primary));
    this.petals.forEach((petal, index) => {
      const color = index % 2 ? secondary : primary;
      petal.material.color.copy(color); petal.material.emissive.copy(color);
    });
    if (this.light) this.light.color.copy(primary);
  }

  setEvolution(next) { this.evolution = { ...this.evolution, ...next }; }

  update({ elapsed, intensity }) {
    const { growth, complexity, activation, valence } = this.evolution;
    const breath = 1 + Math.sin(elapsed * (1.15 + activation * 1.8)) * (.035 + activation * .055);
    const scale = (1 + growth * .24 + complexity * .17) * breath;
    this.group.scale.setScalar(scale);
    this.group.rotation.y = elapsed * (.12 + activation * .22);
    this.group.rotation.x = Math.sin(elapsed * .21) * .13;
    this.core.rotation.y = -elapsed * (.16 + complexity * .3);
    this.shell.rotation.set(elapsed * .11, -elapsed * .15, elapsed * .08);
    this.core.material.emissiveIntensity = 1.05 + activation * 1.8 + Math.max(0, valence) * .45;
    this.shell.material.opacity = .18 + complexity * .38;
    this.light.intensity = 4 + activation * 11;
    this.rings.forEach((ring, index) => {
      const base = ring.userData.baseRotation;
      ring.rotation.x = base.x + elapsed * (.12 + index * .026);
      ring.rotation.y = base.y + elapsed * (.08 + activation * .14);
      ring.material.opacity = .18 + complexity * .32 + intensity * .12;
      ring.scale.setScalar(1 + Math.sin(elapsed * 1.1 + index) * .025);
    });
    this.petals.forEach((petal, index) => {
      const unlocked = growth >= .16 + index * .085 || complexity >= .46 + index * .055;
      petal.visible = unlocked;
      if (!unlocked) return;
      const orbit = petal.userData.theta + elapsed * (.24 + activation * .36) * (index % 2 ? 1 : -1);
      const radius = petal.userData.radius + Math.sin(elapsed * 1.7 + petal.userData.offset) * (.3 + activation * .4);
      petal.position.set(Math.cos(orbit) * radius, Math.sin(orbit) * radius * .58, Math.sin(elapsed * .8 + index) * 2.1);
      petal.rotation.set(elapsed * .8, elapsed * .5 + index, elapsed * .6);
      petal.scale.setScalar(.72 + growth * .55 + complexity * .35);
    });
  }

  dispose() { this.group.parent?.remove(this.group); this.group.traverse(object => { object.geometry?.dispose?.(); object.material?.dispose?.(); }); }
}

function seededCreate(seed, create) {
  // Components use Math.random while creating their visual genome.
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
    const composition = COMPOSITIONS[activeComposition];
    return {
      container: host,
      // The factory starts immediately. Delay its first frame until the
      // render-target capability check below has selected a safe pipeline.
      fps: .001,
      theme: activeTheme,
      components: composition.components,
      matter: { mode: composition.matter },
    };
  }
  return {
    container: host,
    fps: .001,
    theme: activeTheme,
    // The mobile-safe geometry orb is added after the engine starts.
    // Avoid creating the unsupported ray-marched shader orb on this route.
    // Pulse is deliberately sparse so the shared evolving familiar remains
    // the focal object instead of being hidden behind background components.
    components: ['nebula'],
    nebula: { count: 720, spread: 35 },
  };
}

function syncRendererSize() {
  if (!engine || engine.disposed) return false;
  const width = host.clientWidth;
  const height = host.clientHeight;
  if (width < 2 || height < 2) return false;
  const canvas = engine.renderer?.domElement;
  const pixelRatio = engine.renderer?.getPixelRatio?.() || 1;
  const expectedWidth = Math.floor(width * pixelRatio);
  const expectedHeight = Math.floor(height * pixelRatio);
  if (canvas?.width !== expectedWidth || canvas?.height !== expectedHeight) {
    engine._resize();
    engine.renderOnce?.();
    setTimeout(reportHealth, 80);
  }
  return Boolean(canvas?.width && canvas?.height);
}

function observeRendererSize() {
  if (sizeObserver || typeof ResizeObserver === 'undefined') return;
  sizeObserver = new ResizeObserver(() => syncRendererSize());
  sizeObserver.observe(host);
}

function reportHealth() {
  if (!engine || engine.disposed) return;
  const canvas = engine.renderer?.domElement;
  const gl = engine.renderer?.getContext?.();
  const components = engine.components || [];
  const familiar = components.find(component => component instanceof EvolvingOrb);
  const details = [
    `theme=${activeTheme}`,
    `composition=${sceneKind === 'background' ? activeComposition : 'pulse-familiar'}`,
    `canvas=${canvas?.width || 0}x${canvas?.height || 0}`,
    `host=${host.clientWidth}x${host.clientHeight}`,
    `components=${components.map(component => component.constructor?.name).join(',') || 'none'}`,
    `familiar=${Boolean(familiar?.core?.visible !== false && familiar?.group?.visible !== false)}`,
    `running=${Boolean(engine.running)}`,
    `reducedMotion=${Boolean(engine.reducedMotion)}`,
    `pipeline=${engine.renderPipeline || 'unknown'}`,
    `frame=${engine.renderer?.info?.render?.frame || 0}`,
    `calls=${engine.renderer?.info?.render?.calls || 0}`,
    `programs=${engine.renderer?.info?.programs?.length || 0}`,
    `gl=${gl?.getError?.() ?? -1}`,
  ].join(' ');
  if (details === lastHealthSignature) return;
  lastHealthSignature = details;
  console.info(`[MindRecipe FX] ${details}`);
  bridge(`health:${details}`);
}

function configureRenderPipeline() {
  const renderer = engine?.renderer;
  const composer = engine?.composer;
  const gl = renderer?.getContext?.();
  if (!renderer || !composer || !gl) return 'unavailable';
  const targets = [
    composer.renderTarget1,
    composer.renderTarget2,
    engine.bloomPass?.renderTargetBright,
    ...(engine.bloomPass?.renderTargetsHorizontal || []),
    ...(engine.bloomPass?.renderTargetsVertical || []),
  ].filter(Boolean);
  let complete = true;
  for (const target of targets) {
    renderer.setRenderTarget(target);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      complete = false;
      break;
    }
  }
  renderer.setRenderTarget(null);
  if (!complete) {
    // Some Android WebViews expose WebGL2 but cannot complete the bloom
    // framebuffer stack. Keep the copied Three.js components and theme
    // shaders live by rendering the same scene directly to the onscreen
    // framebuffer instead of presenting a blank/frozen Flutter fallback.
    composer.render = () => {
      renderer.setRenderTarget(null);
      renderer.render(engine.scene, engine.camera);
    };
  }
  engine.frameInterval = 1000 / targetFPS;
  engine.lastFrame = 0;
  engine.renderPipeline = complete ? 'composer' : 'direct-webgl';
  return engine.renderPipeline;
}

function configureCanvas() {
  const canvas = engine?.renderer?.domElement;
  if (!canvas) return;
  canvas.style.mixBlendMode = sceneKind === 'background' ? 'screen' : 'normal';
  canvas.style.opacity = sceneKind === 'background' ? '.78' : '1';
  canvas.style.zIndex = '1';
  engine.renderer.setClearColor(0x000000, sceneKind === 'background' ? 0 : 1);
}

function configureSurface() {
  const background = engine?.theme?.colors?.background;
  if (!background) return;
  const color = `#${background.getHexString()}`;
  document.documentElement.style.background = color;
  document.body.style.background = color;
  host.style.background = color;
}

function attachContextHandler() {
  engine?.renderer?.domElement?.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    bridge('context_lost');
  });
}

function createEngine() {
  engine = seededCreate(activeSeed, () => ChimeraFX.create(optionsFor(sceneKind)));
  window._mindRecipeFX = engine;
  configureRenderPipeline();
  if (sceneKind === 'pulse') engine.addComponent(new EvolvingOrb(activeSeed));
  if (sceneKind === 'background') {
    const matter = engine.components?.find(
      component => component.constructor?.name === 'ShapableMatter',
    );
    matter?.setMatterMode?.(COMPOSITIONS[activeComposition].matter);
  }
  configureCanvas();
  configureSurface();
  attachContextHandler();
  observeRendererSize();
  syncRendererSize();
  engine.renderer.compile(engine.scene, engine.camera);
  engine.renderOnce?.();
  // A kept-alive Flutter page may load its WebView while it is still
  // offscreen, producing a 0x0 drawing buffer. Recheck after layout without
  // requiring a browser resize event; this is what restores the Pulse orb.
  [0, 60, 180, 420, 900].forEach(delay => setTimeout(syncRendererSize, delay));
  setTimeout(reportHealth, 750);
}

function normalizeSeed(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed !== 0 ? Math.abs(Math.trunc(parsed)) : 17;
}

function rebuildEngine() {
  engine?.dispose();
  createEngine();
}

function apply(state = {}) {
  lastState = { ...lastState, ...state };
  if (!engine) return;
  const nextTheme = ChimeraFX.themes[lastState.theme] ? lastState.theme : 'chimera-native';
  const nextComposition = compositionFor(lastState.variant);
  const nextSeed = normalizeSeed(lastState.seed);
  const themeChanged = nextTheme !== activeTheme;
  const compositionChanged = sceneKind === 'background' && nextComposition !== activeComposition;
  const seedChanged = sceneKind === 'pulse' && nextSeed !== activeSeed;
  activeTheme = nextTheme;
  activeComposition = nextComposition;
  activeSeed = nextSeed;
  // Most source components read their palette while constructing GPU
  // buffers. Recreate the local renderer when its theme, composition, or
  // visual genome changes so the selection changes real geometry and shaders.
  if (themeChanged || compositionChanged || seedChanged) rebuildEngine();
  configureSurface();
  syncRendererSize();

  const growth = Math.max(0, Math.min(1, Number(lastState.growth ?? lastState.progress ?? 0)));
  const complexity = Math.max(0, Math.min(1, Number(lastState.complexity ?? growth)));
  const activation = Math.max(0, Math.min(1, Number(lastState.activation ?? lastState.intensity ?? .35)));
  const valence = Math.max(-1, Math.min(1, Number(lastState.valence ?? 0)));

  // Pulse state is deliberately expressive but never evaluative: changes in
  // current energy alter movement, while repeated progress unlocks anatomy.
  engine.setState(activation > .74 ? 'thinking' : growth > .68 ? 'success' : complexity > .34 ? 'streaming' : 'idle');
  const components = engine.components || [];
  components.find(component => component instanceof EvolvingOrb)?.setEvolution({ growth, complexity, activation, valence });
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
  engine.renderOnce?.();
}

function start() {
  try {
    activeTheme = ChimeraFX.themes[lastState.theme] ? lastState.theme : 'chimera-native';
    activeComposition = compositionFor(lastState.variant);
    activeSeed = normalizeSeed(lastState.seed);
    createEngine();
    apply(lastState);
    bridge('ready');
  } catch (error) {
    bridge(`shader_error:${String(error?.message || error).slice(0, 100)}`);
  }
}

window.setBackgroundState = apply;
window.setFamiliarState = apply;
window.setIntroVariant = variant => apply({
  seed: Number(variant || 0) + 17,
  growth: .08,
  complexity: .12,
  activation: .45,
  theme: 'chimera-native',
});
window.setBackgroundPaused = paused => {
  paused ? engine?._pause() : engine?._resume();
};
window.setFamiliarPaused = paused => paused ? engine?._pause() : engine?._resume();

start();
