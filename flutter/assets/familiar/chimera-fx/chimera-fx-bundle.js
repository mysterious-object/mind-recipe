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
import { MindRecipeCore } from './themes/mindrecipe-core.js';
import { AuroraBorealis } from './themes/aurora-borealis.js';
import { CrystalMatrix } from './themes/crystal-matrix.js';
import { DeepOcean } from './themes/deep-ocean.js';
import { MidnightTrading } from './themes/midnight-trading.js';
import { NeonSamurai } from './themes/neon-samurai.js';
import { ObsidianForge } from './themes/obsidian-forge.js';
import { OrchidVapor } from './themes/orchid-vapor.js';
import { SolarFlare } from './themes/solar-flare.js';
import { TidalGlass } from './themes/tidal-glass.js';
import { VoidWalker } from './themes/void-walker.js';

const COMPONENTS = { nebula: ParticleNebula, 'particle-nebula': ParticleNebula, tendrils: EnergyTendrils, 'energy-tendrils': EnergyTendrils, rivers: DataRivers, 'data-rivers': DataRivers, volumetric: VolumetricLight, 'volumetric-light': VolumetricLight, metal: LiquidMetal, 'liquid-metal': LiquidMetal, reaction: ReactionDiffusion, 'reaction-diffusion': ReactionDiffusion, voronoi: VoronoiShatter, 'voronoi-shatter': VoronoiShatter, hud: HoloHUD, 'holo-hud': HoloHUD, beams: EnergyBeams, 'energy-beams': EnergyBeams, orb: IridescentOrb, 'iridescent-orb': IridescentOrb };
const THEMES = {
  'mindrecipe-core': MindRecipeCore,
  'cyberpunk-neon': CyberpunkNeon,
  'organic-bioluminescent': OrganicBioluminescent,
  'quantum-void': QuantumVoid,
  'holographic-matrix': HolographicMatrix,
  'chimera-native': ChimeraNative,
  'aurora-borealis': AuroraBorealis,
  'crystal-matrix': CrystalMatrix,
  'deep-ocean': DeepOcean,
  'midnight-trading': MidnightTrading,
  'neon-samurai': NeonSamurai,
  'obsidian-forge': ObsidianForge,
  'orchid-vapor': OrchidVapor,
  'solar-flare': SolarFlare,
  'tidal-glass': TidalGlass,
  'void-walker': VoidWalker,
};
const PRESETS = { full: ['nebula', 'tendrils', 'rivers', 'volumetric', 'reaction', 'voronoi', 'hud', 'beams', 'orb'], lite: ['nebula', 'tendrils', 'hud'], trading: ['rivers', 'tendrils', 'voronoi', 'hud', 'beams'], cinematic: ['nebula', 'volumetric', 'metal', 'reaction', 'orb'], holographic: ['orb', 'hud', 'beams', 'tendrils', 'rivers'], minimal: ['nebula'] };

function create(opts = {}) {
  const theme = typeof opts.theme === 'string' ? THEMES[opts.theme] : opts.theme;
  // Components build their GPU colors during init, so the theme must be on the
  // engine before any component is constructed.
  const engine = new Engine({ container: opts.container || document.body, fps: opts.fps || 60, theme, bloomStrength: opts.bloomStrength, bloomRadius: opts.bloomRadius, bloomThreshold: opts.bloomThreshold });
  const names = opts.preset ? (PRESETS[opts.preset] || PRESETS.lite) : (opts.components || PRESETS.lite);
  for (const name of names) { const Ctor = COMPONENTS[name]; if (Ctor) engine.addComponent(new Ctor(opts[name] || {})); else console.warn(`ChimeraFX: Unknown component "${name}"`); }
  engine.start(); return engine;
}
const ChimeraFX = { create, Engine, StateMachine, ParticleNebula, EnergyTendrils, DataRivers, VolumetricLight, LiquidMetal, ReactionDiffusion, VoronoiShatter, HoloHUD, EnergyBeams, IridescentOrb, themes: THEMES, MindRecipeCore, CyberpunkNeon, OrganicBioluminescent, QuantumVoid, HolographicMatrix, ChimeraNative, AuroraBorealis, CrystalMatrix, DeepOcean, MidnightTrading, NeonSamurai, ObsidianForge, OrchidVapor, SolarFlare, TidalGlass, VoidWalker, presets: PRESETS, components: COMPONENTS, registerComponent(name, Ctor) { COMPONENTS[name] = Ctor; }, registerTheme(name, theme) { THEMES[name] = theme; }, version: '1.1.0' };
window.ChimeraFX = ChimeraFX;
export default ChimeraFX;
