/**
 * Theme: Deep Ocean
 *
 * Abyssal blues with bioluminescent life.
 * Based on Organic Bioluminescent but deeper, more volumetric.
 * Soft, calming, rich with particle detail.
 */

import * as THREE from 'three';

export const DeepOcean = {
  name: 'deep-ocean',

  colors: {
    primary: new THREE.Color(0x00b4d8),    // abyssal blue
    secondary: new THREE.Color(0x00e5ff),  // bioluminescent cyan
    tertiary: new THREE.Color(0x0077b6),   // deep navy
    accent: new THREE.Color(0x90e0ef),     // light cyan
    background: new THREE.Color(0x020810), // near-black ocean
    surface: new THREE.Color(0x040d18),
  },

  particleColors: [
    [0.0, 0.706, 0.847],  // abyssal blue
    [0.0, 0.898, 1.0],   // bioluminescent
    [0.0, 0.467, 0.725], // deep navy
    [0.565, 0.878, 0.937],// light cyan
  ],

  tendrilColors: [
    new THREE.Color(0x00b4d8),
    new THREE.Color(0x00e5ff),
    new THREE.Color(0x0077b6),
  ],

  riverColors: [
    [0.0, 0.706, 0.847],
    [0.0, 0.898, 1.0],
    [0.565, 0.878, 0.937],
  ],

  metalColors: [
    new THREE.Color(0x00b4d8),
    new THREE.Color(0x00e5ff),
  ],

  reactionColors: [
    new THREE.Color(0x00b4d8),
    new THREE.Color(0x00e5ff),
    new THREE.Color(0x0077b6),
  ],

  postfx: {
    bloomStrength: 0.65,
    bloomRadius: 0.6,
    bloomThreshold: 0.22,
    grainIntensity: 0.015,
    chromaBase: 0.0008,
  },

  fogColor: new THREE.Color(0x020810),
  fogDensity: 0.003,

  apply(engine) {
    engine.scene.fog.color.copy(this.fogColor);
    engine.scene.fog.density = this.fogDensity;
    engine.bloomPass.strength = this.postfx.bloomStrength;
    engine.bloomPass.radius = this.postfx.bloomRadius;
    engine.bloomPass.threshold = this.postfx.bloomThreshold;
    engine.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
  },
};
