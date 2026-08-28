import { Engine } from './core/Engine.js';
import { StateMachine } from './core/StateMachine.js';
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
import { CyberpunkNeon } from './themes/cyberpunk-neon.js';
import { OrganicBioluminescent } from './themes/organic-bioluminescent.js';
import { QuantumVoid } from './themes/quantum-void.js';
import { HolographicMatrix } from './themes/holographic-matrix.js';
import { ChimeraNative } from './themes/chimera-native.js';

const COMPONENTS = { nebula: ParticleNebula, 'particle-nebula': ParticleNebula, tendrils: EnergyTendrils, 'energy-tendrils': EnergyTendrils, rivers: DataRivers, 'data-rivers': DataRivers, volumetric: VolumetricLight, 'volumetric-light': VolumetricLight, metal: LiquidMetal, 'liquid-metal': LiquidMetal, reaction: ReactionDiffusion, 'reaction-diffusion': ReactionDiffusion, voronoi: VoronoiShatter, 'voronoi-shatter': VoronoiShatter, hud: HoloHUD, 'holo-hud': HoloHUD, beams: EnergyBeams, 'energy-beams': EnergyBeams, orb: IridescentOrb, 'iridescent-orb': IridescentOrb };
const THEMES = { 'cyberpunk-neon': CyberpunkNeon, 'organic-bioluminescent': OrganicBioluminescent, 'quantum-void': QuantumVoid, 'holographic-matrix': HolographicMatrix, 'chimera-native': ChimeraNative };
const PRESETS = { full: ['nebula', 'tendrils', 'rivers', 'volumetric', 'reaction', 'voronoi', 'hud', 'beams', 'orb'], lite: ['nebula', 'tendrils', 'hud'], trading: ['rivers', 'tendrils', 'voronoi', 'hud', 'beams'], cinematic: ['nebula', 'volumetric', 'metal', 'reaction', 'orb'], holographic: ['orb', 'hud', 'beams', 'tendrils', 'rivers'], minimal: ['nebula'] };

function create(opts = {}) {
  const engine = new Engine({ container: opts.container || document.body, fps: opts.fps || 60, theme: undefined, bloomStrength: opts.bloomStrength, bloomRadius: opts.bloomRadius, bloomThreshold: opts.bloomThreshold });
  const names = opts.preset ? (PRESETS[opts.preset] || PRESETS.lite) : (opts.components || PRESETS.lite);
  for (const name of names) { const Ctor = COMPONENTS[name]; if (Ctor) engine.addComponent(new Ctor(opts[name] || {})); else console.warn(`ChimeraFX: Unknown component "${name}"`); }
  if (opts.theme) { const theme = typeof opts.theme === 'string' ? THEMES[opts.theme] : opts.theme; if (theme) engine.setTheme(theme); }
  engine.start(); return engine;
}
const ChimeraFX = { create, Engine, StateMachine, ParticleNebula, EnergyTendrils, DataRivers, VolumetricLight, LiquidMetal, ReactionDiffusion, VoronoiShatter, HoloHUD, EnergyBeams, IridescentOrb, themes: THEMES, CyberpunkNeon, OrganicBioluminescent, QuantumVoid, HolographicMatrix, ChimeraNative, presets: PRESETS, components: COMPONENTS, registerComponent(name, Ctor) { COMPONENTS[name] = Ctor; }, registerTheme(name, theme) { THEMES[name] = theme; }, version: '1.0.0' };
window.ChimeraFX = ChimeraFX;
export default ChimeraFX;
