// Native bridge for the locally bundled Chimera FX engine.
// This file is bundled for mobile WebViews so the engine and all five official
// Source visual themes load as one local script, with no module-resolution or
// network dependency.
import ChimeraFX from './chimera-fx-bundle.js';
import * as THREE from '../three.module.min.js';

const bridge = value => {
  for (const name of ['BackgroundBridge', 'FamiliarBridge']) {
    try { window[name]?.postMessage(value); } catch (_) {}
  }
};

const sceneKind = document.body?.dataset.sceneMode || window.MIND_RECIPE_SCENE_MODE || 'pulse';
const host = document.getElementById('stage') || document.body;
let engine = null;
let activeTheme = 'chimera-native';
let activePreset = 'lite';
let requestedPreset = 'lite';
let lastState = {};

// This is the source Chimera FX background catalog.  Keep the identifiers in
// lock-step with ChimeraFX.presets: each item is a distinct component stack,
// not a color treatment of one generic background.
const backgroundPresetIds = new Set([
  'full', 'lite', 'trading', 'cinematic', 'holographic', 'minimal',
]);

// Existing installations saved one of the temporary Mind Recipe scene names.
// Migrate those choices into the actual source presets without discarding a
// person's visual preference.
const legacyPresetMap = {
  field: 'full', nebula: 'lite', rivers: 'trading', tendrils: 'holographic',
  orbs: 'cinematic', lattice: 'trading', void: 'minimal', prism: 'holographic',
  aurora: 'cinematic', ember: 'trading', ocean: 'full', twilight: 'minimal',
};

function backgroundPreset(value) {
  if (backgroundPresetIds.has(value)) return value;
  return legacyPresetMap[value] || 'full';
}

// The source package supplies the first five named themes. These additional
// visual systems are full renderer themes—not palette aliases. Each has its
// own fog, post-processing, component colors, and preferred composition.
const visualThemeSpecs = {
  'mind-recipe-orbit': [0x00d9c0, 0x8b5cf6, 0xf5b942, 0x06151b, 'lite', .42, .46, .025],
  'midnight-signal': [0x147bff, 0x00edac, 0xa98cff, 0x020719, 'trading', .30, .32, .018],
  'neon-ronin': [0xee2c74, 0x7038ff, 0x4fdfff, 0x160414, 'holographic', .58, .35, .05],
  'abyssal-current': [0x0077ff, 0x00e3d2, 0x75ffd9, 0x000f25, 'cinematic', .32, .68, .018],
  'solar-flare': [0xff9d00, 0xffcf5c, 0xff4d23, 0x1a0c02, 'cinematic', .62, .28, .04],
  'void-walker': [0x4630b5, 0x9d72ff, 0xc5b3ff, 0x05020f, 'minimal', .24, .72, .015],
  'crystal-matrix': [0x75f7ff, 0xe9feff, 0x5ba8c9, 0x07151b, 'lite', .28, .55, .012],
  'aurora': [0x23edab, 0x9a56ff, 0xff74b8, 0x07111d, 'full', .48, .50, .026],
  'obsidian-forge': [0xef6736, 0xffb04b, 0x873b2f, 0x140909, 'cinematic', .38, .24, .065],
  'orchid-vapor': [0xdb54e8, 0x7ee9ff, 0xc5a0ff, 0x160b20, 'holographic', .52, .64, .03],
  'tidal-glass': [0x00c6dc, 0xe3ffff, 0x45dcb4, 0x031d25, 'trading', .30, .58, .015],
};

const sourceThemePresets = {
  'chimera-native': 'full',
  'cyberpunk-neon': 'holographic',
  'organic-bioluminescent': 'cinematic',
  'quantum-void': 'minimal',
  'holographic-matrix': 'trading',
};

// These are the source renderer's named compositions with only the
// ray-marched IridescentOrb removed. That shader is retained for capable
// desktop renderers, but it prevents the entire background scene from
// starting on several Android WebViews. Pulse supplies its own geometry-backed
// Three.js familiar, so omitting the background orb loses no user state.
const mobileBackgroundComponents = {
  full: ['nebula', 'tendrils', 'rivers', 'volumetric', 'voronoi', 'hud', 'beams'],
  lite: ['nebula', 'tendrils', 'hud'],
  trading: ['rivers', 'tendrils', 'voronoi', 'hud', 'beams'],
  cinematic: ['nebula', 'volumetric', 'metal', 'reaction'],
  holographic: ['hud', 'beams', 'tendrils', 'rivers'],
  minimal: ['nebula'],
};

const themePreset = name => visualThemeSpecs[name]?.[4] || sourceThemePresets[name] || 'full';

for (const [name, [primaryHex, secondaryHex, tertiaryHex, backgroundHex, _preset, bloom, radius, grain]] of Object.entries(visualThemeSpecs)) {
  const primary = new THREE.Color(primaryHex);
  const secondary = new THREE.Color(secondaryHex);
  const tertiary = new THREE.Color(tertiaryHex);
  const background = new THREE.Color(backgroundHex);
  const base = ChimeraFX.ChimeraNative;
  ChimeraFX.registerTheme(name, {
    ...base,
    name,
    colors: { ...base.colors, primary, secondary, tertiary, background, surface: background.clone().offsetHSL(0, 0, .035) },
    particleColors: [primary.toArray(), secondary.toArray(), tertiary.toArray(), primary.clone().lerp(secondary, .5).toArray()],
    tendrilColors: [primary, secondary, tertiary],
    riverColors: [primary.toArray(), secondary.toArray(), tertiary.toArray()],
    metalColors: [primary, secondary],
    reactionColors: [primary, secondary, tertiary],
    fogColor: background,
    fogDensity: name === 'void-walker' ? .0032 : name === 'crystal-matrix' ? .0012 : .002,
    postfx: { ...base.postfx, bloomStrength: bloom, bloomRadius: radius, grainIntensity: grain },
    apply(engine) {
      engine.scene.fog.color.copy(this.fogColor);
      engine.scene.fog.density = this.fogDensity;
      engine.bloomPass.strength = this.postfx.bloomStrength;
      engine.bloomPass.radius = this.postfx.bloomRadius;
      engine.bloomPass.threshold = this.postfx.bloomThreshold;
      engine.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    },
  });
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
    return {
      container: host,
      fps: 30,
      theme: activeTheme,
      // Preserve each source composition while avoiding the one ray-marched
      // component that is not reliable in Android's embedded renderer.
      components: mobileBackgroundComponents[activePreset] || mobileBackgroundComponents.lite,
    };
  }
  return {
    container: host,
    fps: 30,
    theme: activeTheme,
    // The mobile-safe geometry orb is added after the engine starts.
    // Avoid creating the unsupported ray-marched shader orb on this route.
    components: ['nebula', 'tendrils', 'rivers', 'hud'],
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

function attachContextHandler() {
  engine?.renderer?.domElement?.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    bridge('context_lost');
  });
}

function createEngine() {
  engine = seededCreate(lastState.seed, () => ChimeraFX.create(optionsFor(sceneKind)));
  if (sceneKind === 'pulse') engine.addComponent(new EvolvingOrb(lastState.seed));
  configureCanvas();
  attachContextHandler();
  engine.renderer.compile(engine.scene, engine.camera);
  engine.renderer.render(engine.scene, engine.camera);
}

function replaceBackgroundPreset(nextPreset) {
  if (sceneKind !== 'background' || nextPreset === activePreset) return;
  engine?.dispose();
  activePreset = nextPreset;
  createEngine();
}

function apply(state = {}) {
  lastState = { ...lastState, ...state };
  if (!engine) return;
  const nextRequestedPreset = backgroundPreset(lastState.variant);
  if (nextRequestedPreset !== requestedPreset) {
    requestedPreset = nextRequestedPreset;
    replaceBackgroundPreset(nextRequestedPreset);
  }
  const nextTheme = ChimeraFX.themes[lastState.theme] ? lastState.theme : 'chimera-native';
  if (nextTheme !== activeTheme) {
    activeTheme = nextTheme;
    engine.setTheme(ChimeraFX.themes[activeTheme]);
    // A theme change is a real visual-system change. Rebuild against its
    // distinct source composition so it cannot look like a recolored clone.
    replaceBackgroundPreset(backgroundPreset(themePreset(activeTheme)));
  }
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
}

function start() {
  try {
    activeTheme = ChimeraFX.themes[lastState.theme] ? lastState.theme : 'chimera-native';
    activePreset = lastState.variant
      ? backgroundPreset(lastState.variant)
      : themePreset(activeTheme);
    requestedPreset = activePreset;
    createEngine();
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
