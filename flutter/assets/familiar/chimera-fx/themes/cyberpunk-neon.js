/**
 * Theme: Cyberpunk Neon
 *
 * Hot pinks, electric blues, and toxic greens on deep black.
 * Inspired by: Cyberpunk 2077, Blade Runner, Akira.
 * High contrast, aggressive bloom, sharp edges.
 */

import * as THREE from '../../three.module.min.js';

export const CyberpunkNeon = {
  name: 'cyberpunk-neon',

  // Core palette
  colors: {
    primary: new THREE.Color(0xff0066),    // hot pink
    secondary: new THREE.Color(0x00ffff),  // electric cyan
    tertiary: new THREE.Color(0x39ff14),   // toxic green
    accent: new THREE.Color(0xffff00),     // neon yellow
    background: new THREE.Color(0x0a0014), // deep purple-black
    surface: new THREE.Color(0x1a0033),
  },

  // Component-specific colors
  particleColors: [
    [1.0, 0.0, 0.4],    // hot pink
    [0.0, 1.0, 1.0],    // cyan
    [0.224, 1.0, 0.078], // green
    [1.0, 1.0, 0.0],    // yellow
  ],

  tendrilColors: [
    new THREE.Color(0xff0066),
    new THREE.Color(0x00ffff),
    new THREE.Color(0x39ff14),
  ],

  riverColors: [
    [1.0, 0.0, 0.4],
    [0.0, 1.0, 1.0],
    [0.224, 1.0, 0.078],
  ],

  metalColors: [
    new THREE.Color(0xff0066),
    new THREE.Color(0x00ffff),
  ],

  reactionColors: [
    new THREE.Color(0xff0066),
    new THREE.Color(0x00ffff),
    new THREE.Color(0x39ff14),
  ],

  // Post-processing overrides
  postfx: {
    bloomStrength: 0.5,
    bloomRadius: 0.4,
    bloomThreshold: 0.3,
    grainIntensity: 0.05,
    chromaBase: 0.002,
  },

  // Fog
  fogColor: new THREE.Color(0x0a0014),
  fogDensity: 0.002,

  apply(engine) {
    engine.scene.fog.color.copy(this.fogColor);
    engine.scene.fog.density = this.fogDensity;
    engine.bloomPass.strength = this.postfx.bloomStrength;
    engine.bloomPass.radius = this.postfx.bloomRadius;
    engine.bloomPass.threshold = this.postfx.bloomThreshold;
    engine.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
  },
};
