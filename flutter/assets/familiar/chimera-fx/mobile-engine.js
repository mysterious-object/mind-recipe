import * as THREE from '../three.module.min.js';
import { ParticleNebula } from './components/ParticleNebula.js';
import { EnergyTendrils } from './components/EnergyTendrils.js';
import { DataRivers } from './components/DataRivers.js';
import { VolumetricLight } from './components/VolumetricLight.js';
import { LiquidMetal } from './components/LiquidMetal.js';
import { ReactionDiffusion } from './components/ReactionDiffusion.js';
import { VoronoiShatter } from './components/VoronoiShatter.js';
import { HoloHUD } from './components/HoloHUD.js';
import { EnergyBeams } from './components/EnergyBeams.js';
import { IridescentOrb } from './components/IridescentOrb.js';
import { ChimeraNative } from './themes/chimera-native.js';
import { CyberpunkNeon } from './themes/cyberpunk-neon.js';
import { OrganicBioluminescent } from './themes/organic-bioluminescent.js';
import { QuantumVoid } from './themes/quantum-void.js';
import { HolographicMatrix } from './themes/holographic-matrix.js';

const stage = document.getElementById('stage');
const themes = [ChimeraNative, OrganicBioluminescent, QuantumVoid, HolographicMatrix, CyberpunkNeon];
const recipes = {
  field: ['nebula', 'volumetric'], nebula: ['nebula', 'volumetric', 'reaction'],
  rivers: ['rivers', 'beams', 'hud'], tendrils: ['tendrils', 'nebula', 'beams'],
  orbs: ['orb', 'nebula', 'volumetric'], lattice: ['hud', 'rivers', 'beams'],
  void: ['orb', 'reaction', 'nebula'], prism: ['metal', 'voronoi', 'beams'],
  aurora: ['volumetric', 'tendrils', 'rivers'], ember: ['nebula', 'voronoi', 'reaction'],
  ocean: ['metal', 'reaction', 'volumetric'], twilight: ['orb', 'tendrils', 'hud', 'nebula'],
};
const factories = {
  nebula: () => new ParticleNebula({ count: 4200, spread: 40 }),
  tendrils: () => new EnergyTendrils({ count: 7, segments: 56 }),
  rivers: () => new DataRivers({ rivers: 5, particles: 240 }),
  volumetric: () => new VolumetricLight({ samples: 36 }),
  metal: () => new LiquidMetal(), reaction: () => new ReactionDiffusion({ resolution: 192, stepsPerFrame: 5 }),
  voronoi: () => new VoronoiShatter({ cells: 14 }), hud: () => new HoloHUD(),
  beams: () => new EnergyBeams({ count: 4 }), orb: () => new IridescentOrb({ size: 9 }),
};

const engine = {
  scene: new THREE.Scene(), clock: new THREE.Clock(), components: [], theme: ChimeraNative,
  mouse: new THREE.Vector2(), mouseNDC: new THREE.Vector2(), state: 'idle', intensity: .35,
};
engine.camera = new THREE.PerspectiveCamera(60, innerWidth / Math.max(innerHeight, 1), .1, 1000);
engine.camera.position.set(0, 0, 30);
engine.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true });
engine.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
engine.renderer.setSize(innerWidth, innerHeight);
engine.renderer.setClearColor(0x000000, 0);
engine.renderer.toneMapping = THREE.ACESFilmicToneMapping;
engine.renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.append(engine.renderer.domElement);

let variant = 'field', paused = false, reduced = false, themeIndex = 0;
function disposeComponents() {
  engine.components.forEach(c => c.dispose?.(engine));
  engine.components = [];
}
function rebuild(next = variant) {
  variant = recipes[next] ? next : 'field';
  disposeComponents();
  engine.theme = themes[themeIndex % themes.length];
  engine.scene.fog = new THREE.FogExp2(engine.theme.fogColor, engine.theme.fogDensity);
  for (const name of recipes[variant]) {
    const component = factories[name]();
    component.init?.(engine);
    component.onThemeChange?.(engine.theme, engine);
    component.onStateChange?.(engine.state, engine);
    engine.components.push(component);
  }
}
function setState(s) {
  engine.state = s;
  engine.components.forEach(c => c.onStateChange?.(s, engine));
}
window.setBackgroundState = value => {
  if (!value) return;
  const nextVariant = value.variant || variant;
  const nextTheme = Math.abs((['field','nebula','rivers','tendrils','orbs','lattice','void','prism','aurora','ember','ocean','twilight'].indexOf(nextVariant))) % themes.length;
  const changed = nextVariant !== variant || nextTheme !== themeIndex;
  themeIndex = nextTheme;
  engine.intensity = Math.max(.15, Math.min(1, Number(value.intensity || .7))) * (.65 + Number(value.progress || 0) * .35);
  reduced = !!value.reduceMotion;
  if (changed) rebuild(nextVariant);
  setState(Number(value.progress || 0) > .72 ? 'success' : Number(value.progress || 0) > .35 ? 'thinking' : 'idle');
};
window.setBackgroundPaused = value => { paused = !!value; };
window.setIntroVariant = value => {
  const names = Object.keys(recipes);
  window.setBackgroundState({ variant: names[Math.abs(Number(value) || 0) % names.length], progress: .58, intensity: .92 });
};
window.setIntroPaused = value => { paused = !!value; };
window.setFamiliarState = value => {
  if (!value) return;
  const growth = Number(value.growth || 0), form = Number(value.form || 0);
  const stages = ['orbs', 'twilight', 'aurora', 'prism'];
  themeIndex = Math.abs(Number(value.seed || 0)) % themes.length;
  const next = stages[Math.min(3, Math.floor(Math.max(growth, form) * 4))];
  engine.intensity = .45 + Number(value.activation || .35) * .4 + Number(value.complexity || 0) * .15;
  reduced = !!value.reduceMotion;
  rebuild(next);
  setState(growth > .72 ? 'success' : Number(value.activation || 0) > .55 ? 'thinking' : 'idle');
};
window.setFamiliarPaused = value => { paused = !!value; };
addEventListener('resize', () => {
  engine.camera.aspect = innerWidth / Math.max(innerHeight, 1);
  engine.camera.updateProjectionMatrix();
  engine.renderer.setSize(innerWidth, innerHeight);
  engine.components.forEach(c => c.onResize?.(innerWidth, innerHeight, engine));
});
engine.renderer.domElement.addEventListener('webglcontextlost', event => {
  event.preventDefault();
  try { BackgroundBridge.postMessage('context_lost'); } catch (_) {}
});
function frame() {
  requestAnimationFrame(frame);
  if (paused) return;
  const dt = Math.min(engine.clock.getDelta(), .05), elapsed = engine.clock.getElapsedTime();
  const ctx = { dt, elapsed, mouse: engine.mouse, mouseNDC: engine.mouseNDC, state: engine.state, intensity: engine.intensity, theme: engine.theme };
  if (!reduced) engine.components.forEach(c => c.update?.(ctx, engine));
  engine.camera.position.x = Math.sin(elapsed * .1) * .5;
  engine.camera.position.y = Math.cos(elapsed * .07) * .3;
  engine.renderer.render(engine.scene, engine.camera);
}
rebuild(); frame();
try { BackgroundBridge.postMessage('ready'); } catch (_) {}
try { IntroBridge.postMessage('ready'); } catch (_) {}
try { FamiliarBridge.postMessage('ready'); } catch (_) {}
