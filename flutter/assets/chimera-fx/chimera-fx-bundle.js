/**
 * ChimeraFX Bundle — Self-contained Three.js VFX library for Chimera Copilot.
 *
 * This is the non-module entry point. Loads Three.js from CDN via importmap,
 * then exposes the full ChimeraFX API on window.ChimeraFX.
 *
 * Usage (in HTML after Three.js is loaded):
 *   <script type="importmap">{"imports":{"three":"...", "three/addons/":"..."}}</script>
 *   <script type="module" src="js/chimera-fx/chimera-fx-bundle.js"></script>
 *
 * Then in any <script>:
 *   const fx = ChimeraFX.create({ theme: 'cyberpunk-neon', components: ['nebula', 'tendrils', 'rivers'] });
 *   fx.setState('thinking');
 *   fx.pulse('trade');
 */

import { Engine } from './core/Engine.js?v=11';
import { StateMachine } from './core/StateMachine.js?v=9';
import { ShapableMatter } from './core/ShapableMatter.js?v=12';
import { AmbientColors } from './core/AmbientColors.js?v=10';
import { ParticleNebula } from './components/ParticleNebula.js?v=9';
import { EnergyTendrils } from './components/EnergyTendrils.js?v=9';
import { DataRivers } from './components/DataRivers.js?v=9';
import { VolumetricLight } from './components/VolumetricLight.js?v=11';
import { LiquidMetal } from './components/LiquidMetal.js?v=9';
import { ReactionDiffusion } from './components/ReactionDiffusion.js?v=9';
import { VoronoiShatter } from './components/VoronoiShatter.js?v=9';
import { HoloHUD } from './components/HoloHUD.js?v=9';
import { EnergyBeams } from './components/EnergyBeams.js?v=9';
import { IridescentOrb } from './components/IridescentOrb.js?v=9';

import { CyberpunkNeon } from './themes/cyberpunk-neon.js?v=9';
import { OrganicBioluminescent } from './themes/organic-bioluminescent.js?v=9';
import { QuantumVoid } from './themes/quantum-void.js?v=9';
import { HolographicMatrix } from './themes/holographic-matrix.js?v=9';
import { ChimeraNative } from './themes/chimera-native.js?v=9';
import { MidnightTrading } from './themes/midnight-trading.js?v=9';
import { NeonSamurai } from './themes/neon-samurai.js?v=9';
import { DeepOcean } from './themes/deep-ocean.js?v=9';
import { SolarFlare } from './themes/solar-flare.js?v=9';
import { VoidWalker } from './themes/void-walker.js?v=9';
import { CrystalMatrix } from './themes/crystal-matrix.js?v=9';
import { AuroraBorealis } from './themes/aurora-borealis.js?v=1';
import { ObsidianForge } from './themes/obsidian-forge.js?v=1';
import { OrchidVapor } from './themes/orchid-vapor.js?v=1';
import { TidalGlass } from './themes/tidal-glass.js?v=1';

// ─── Component Registry ───────────────────────────────────────────────────
const COMPONENTS = {
  nebula: ParticleNebula,
  'particle-nebula': ParticleNebula,
  tendrils: EnergyTendrils,
  'energy-tendrils': EnergyTendrils,
  rivers: DataRivers,
  'data-rivers': DataRivers,
  volumetric: VolumetricLight,
  'volumetric-light': VolumetricLight,
  metal: LiquidMetal,
  'liquid-metal': LiquidMetal,
  reaction: ReactionDiffusion,
  'reaction-diffusion': ReactionDiffusion,
  voronoi: VoronoiShatter,
  'voronoi-shatter': VoronoiShatter,
  hud: HoloHUD,
  'holo-hud': HoloHUD,
  beams: EnergyBeams,
  'energy-beams': EnergyBeams,
  orb: IridescentOrb,
  'iridescent-orb': IridescentOrb,
  matter: ShapableMatter,
  'shapable-matter': ShapableMatter,
};

// ─── Theme Registry ───────────────────────────────────────────────────────
const THEMES = {
  'cyberpunk-neon': CyberpunkNeon,
  'organic-bioluminescent': OrganicBioluminescent,
  'quantum-void': QuantumVoid,
  'holographic-matrix': HolographicMatrix,
  'chimera-native': ChimeraNative,
  'midnight-trading': MidnightTrading,
  'neon-samurai': NeonSamurai,
  'deep-ocean': DeepOcean,
  'solar-flare': SolarFlare,
  'void-walker': VoidWalker,
  'crystal-matrix': CrystalMatrix,
  'aurora-borealis': AuroraBorealis,
  'obsidian-forge': ObsidianForge,
  'orchid-vapor': OrchidVapor,
  'tidal-glass': TidalGlass,
};

// ─── Preset Configurations (curated component combos) ─────────────────────
const PRESETS = {
  // Full experience — all components (powerful GPUs only)
  full: ['nebula', 'tendrils', 'rivers', 'volumetric', 'reaction', 'voronoi', 'hud', 'beams', 'orb', 'matter'],

  // Performance-optimized — lighter components
  lite: ['nebula', 'tendrils', 'hud', 'matter'],

  // Trading focused — data visualization emphasis
  trading: ['rivers', 'tendrils', 'voronoi', 'hud', 'beams', 'matter'],

  // Cinematic — heavy visual feast
  cinematic: ['nebula', 'volumetric', 'metal', 'reaction', 'orb', 'matter'],

  // Holographic — sci-fi control room
  holographic: ['orb', 'hud', 'beams', 'tendrils', 'rivers', 'matter'],

  // Minimal — just ambient background (shapable matter for mode-switching)
  minimal: ['matter'],

  // Matter-only — single ShapableMatter component (all 11 modes available)
  matter: ['matter'],
};

// ─── Factory Function ─────────────────────────────────────────────────────
function create(opts = {}) {
  const engine = new Engine({
    container: opts.container || document.body,
    fps: opts.fps || 60,
    theme: undefined, // set after component init
    bloomStrength: opts.bloomStrength,
    bloomRadius: opts.bloomRadius,
    bloomThreshold: opts.bloomThreshold,
  });

  // Resolve components
  let componentNames;
  if (opts.preset) {
    componentNames = PRESETS[opts.preset] || PRESETS.lite;
  } else if (opts.components) {
    componentNames = opts.components;
  } else {
    componentNames = PRESETS.lite; // default
  }

  // Instantiate and add components
  for (const name of componentNames) {
    const Ctor = COMPONENTS[name];
    if (Ctor) {
      const compOpts = opts[name] || {};
      engine.addComponent(new Ctor(compOpts));
    } else {
      console.warn(`ChimeraFX: Unknown component "${name}"`);
    }
  }

  // Apply theme
  if (opts.theme) {
    const theme = typeof opts.theme === 'string' ? THEMES[opts.theme] : opts.theme;
    if (theme) engine.setTheme(theme);
  }

  // Start rendering
  engine.start();

  return engine;
}

// ─── Global API ───────────────────────────────────────────────────────────
const ChimeraFX = {
  // Factory
  create,

  // Classes (for advanced usage)
  Engine,
  StateMachine,

  // Components
  ParticleNebula,
  ShapableMatter,
  EnergyTendrils,
  DataRivers,
  VolumetricLight,
  LiquidMetal,
  ReactionDiffusion,
  VoronoiShatter,
  HoloHUD,
  EnergyBeams,
  IridescentOrb,

  // Themes
  themes: THEMES,
  CyberpunkNeon,
  OrganicBioluminescent,
  QuantumVoid,
  HolographicMatrix,
  ChimeraNative,
  MidnightTrading,
  NeonSamurai,
  DeepOcean,
  SolarFlare,
  VoidWalker,
  CrystalMatrix,
  AuroraBorealis,
  ObsidianForge,
  OrchidVapor,
  TidalGlass,

  // Presets
  presets: PRESETS,

  // Component registry (extensible)
  components: COMPONENTS,

  // Register custom component
  registerComponent(name, Ctor) {
    COMPONENTS[name] = Ctor;
  },

  // Register custom theme
  registerTheme(name, theme) {
    THEMES[name] = theme;
  },

  // Version
  version: '1.0.1',

  // Shim: Engine.setTheme looks for ChimeraFX._themes
  _themes: THEMES,

  // Matter mode routing to active ShapableMatter component
  setMatterMode(mode) {
    const engine = window._chimeraFX;
    if (!engine) { console.warn('[ChimeraFX] setMatterMode: engine not ready'); return; }
    const compNames = engine.components.map(c => c.constructor.name);
    console.log('[ChimeraFX] setMatterMode:', mode, '| components:', compNames);
    const matter = engine.components.find(c => c.constructor.name === 'ShapableMatter');
    if (matter && typeof matter.setMatterMode === 'function') {
      matter.setMatterMode(mode);
      console.log('[ChimeraFX] setMatterMode:', mode, '— ShapableMatter found, mode applied');
    } else {
      console.warn('[ChimeraFX] setMatterMode:', mode, '— ShapableMatter not found in components:', compNames);
      // Try by display-name fallback
      const matterByProto = engine.components.find(c => c.constructor?.prototype?.setMatterMode);
      if (matterByProto) {
        console.log('[ChimeraFX] setMatterMode: found by prototype fallback');
        matterByProto.setMatterMode(mode);
      }
    }
  },

  // Get current matter mode
  getMatterMode() {
    const engine = window._chimeraFX;
    if (!engine) return 'nebula';
    const matter = engine.components.find(c => c.constructor.name === 'ShapableMatter');
    return matter?.getMatterMode?.() || 'nebula';
  },
};

// Expose globally — merge so AmbientColors.js methods survive
window.ChimeraFX = { ...(window.ChimeraFX || {}), ...ChimeraFX };

export default ChimeraFX;
