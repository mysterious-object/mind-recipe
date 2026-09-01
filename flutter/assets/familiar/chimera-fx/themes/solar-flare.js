/**
 * Theme: Solar Flare
 *
 * Intense amber and crimson, solar energy unleashed.
 * Based on Chimera Native but warmer, higher energy.
 * Maximum bloom, vivid particle colors, high intensity.
 */

import * as THREE from 'three';

export const SolarFlare = {
  name: 'solar-flare',

  colors: {
    primary: new THREE.Color(0xf5a623),     // amber
    secondary: new THREE.Color(0xff6b35),  // orange
    tertiary: new THREE.Color(0xff3b5c),  // crimson
    accent: new THREE.Color(0xffd740),     // bright amber
    background: new THREE.Color(0x140404), // near-black warm
    surface: new THREE.Color(0x1a0808),
  },

  particleColors: [
    [0.96, 0.65, 0.14],  // amber
    [1.0, 0.42, 0.21],  // orange
    [1.0, 0.23, 0.36],  // crimson
    [1.0, 0.84, 0.25],  // bright amber
  ],

  tendrilColors: [
    new THREE.Color(0xf5a623),
    new THREE.Color(0xff6b35),
    new THREE.Color(0xff3b5c),
  ],

  riverColors: [
    [0.96, 0.65, 0.14],
    [1.0, 0.42, 0.21],
    [1.0, 0.23, 0.36],
  ],

  metalColors: [
    new THREE.Color(0xf5a623),
    new THREE.Color(0xff6b35),
  ],

  reactionColors: [
    new THREE.Color(0xf5a623),
    new THREE.Color(0xff6b35),
    new THREE.Color(0xff3b5c),
  ],

  postfx: {
    bloomStrength: 0.9,
    bloomRadius: 0.55,
    bloomThreshold: 0.2,
    grainIntensity: 0.008,
    chromaBase: 0.001,
  },

  fogColor: new THREE.Color(0x140404),
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
