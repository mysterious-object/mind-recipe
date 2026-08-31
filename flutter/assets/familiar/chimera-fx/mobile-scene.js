// Native bridge for the original Darkstar Chimera FX engine.
// This file is bundled for mobile WebViews so the engine and all five official
// Darkstar themes load as one local script, with no module-resolution or
// network dependency.
import ChimeraFX from './chimera-fx-bundle.js';
import * as THREE from '../three.module.min.js';

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

const extendedThemeSpecs = {
  'darkstar-cyan': [0x00f5ff, 0x00a8ff, 0xb7f2ff, 0x010d18],
  'solar-ember': [0xff4f0d, 0xffc214, 0x7a0503, 0x170401],
  'deep-ocean': [0x00b3d9, 0x034080, 0x0df2b3, 0x000b1a],
  'aurora-spectrum': [0x26ffa6, 0x9940ff, 0xff2699, 0x08031a],
  'crimson-pulse': [0xff0d1f, 0xbf0061, 0xff990d, 0x180006],
  'monochrome-glass': [0xe6f5ff, 0x7a8c9e, 0xffffff, 0x05080b],
  'ultraviolet-bloom': [0x9e1aff, 0x33ccff, 0xff1abf, 0x0c0218],
};

for (const [name, [primaryHex, secondaryHex, tertiaryHex, backgroundHex]] of Object.entries(extendedThemeSpecs)) {
  const primary = new THREE.Color(primaryHex);
  const secondary = new THREE.Color(secondaryHex);
  const tertiary = new THREE.Color(tertiaryHex);
  const background = new THREE.Color(backgroundHex);
  const base = ChimeraFX.ChimeraNative;
  ChimeraFX.registerTheme(name, {
    ...base,
    name,
    colors: { ...base.colors, primary, secondary, tertiary, background, surface: background.clone().offsetHSL(0, 0, .035) },
    particleColors: [primary.toArray(), secondary.toArray(), tertiary.toArray()],
    tendrilColors: [primary, secondary, tertiary],
    riverColors: [primary.toArray(), secondary.toArray(), tertiary.toArray()],
    metalColors: [primary, secondary],
    reactionColors: [primary, secondary, tertiary],
    fogColor: background,
  });
}

// The original Darkstar ray-marched IridescentOrb is retained in the engine,
// but some mobile WebViews compile it without drawing its surface. This is a
// geometry-backed Three.js familiar that runs in that same Darkstar scene and
// uses the exact selected Darkstar theme. It is deliberately not a Flutter
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
    // The mobile-safe geometry orb is added after the Darkstar engine starts.
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
    engine = seededCreate(lastState.seed, () => ChimeraFX.create(optionsFor(sceneKind)));
    if (sceneKind === 'pulse') engine.addComponent(new EvolvingOrb(lastState.seed));
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
