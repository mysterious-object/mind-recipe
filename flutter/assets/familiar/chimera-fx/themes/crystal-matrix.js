/**
 * Theme: Crystal Matrix
 *
 * Ice-blue holographic, clean and precise.
 * Based on Holographic Matrix but cooler, more crystalline.
 * Sharp bloom, minimal grain, pristine holographic feel.
 */

import * as THREE from 'three';

export const CrystalMatrix = {
  name: 'crystal-matrix',

  colors: {
    primary: new THREE.Color(0xa0c4ff),    // ice blue
    secondary: new THREE.Color(0xe0eaff),  // pale holographic
    tertiary: new THREE.Color(0x448aff),   // medium blue
    accent: new THREE.Color(0xffffff),     // white
    background: new THREE.Color(0x050a14), // deep blue-black
    surface: new THREE.Color(0x08101e),
  },

  particleColors: [
    [0.627, 0.769, 1.0],   // ice blue
    [0.878, 0.918, 1.0],   // pale holographic
    [0.267, 0.541, 1.0],   // medium blue
    [1.0, 1.0, 1.0],       // white
  ],

  tendrilColors: [
    new THREE.Color(0xa0c4ff),
    new THREE.Color(0xe0eaff),
    new THREE.Color(0x448aff),
  ],

  riverColors: [
    [0.627, 0.769, 1.0],
    [0.878, 0.918, 1.0],
    [1.0, 1.0, 1.0],
  ],

  metalColors: [
    new THREE.Color(0xa0c4ff),
    new THREE.Color(0xe0eaff),
  ],

  reactionColors: [
    new THREE.Color(0xa0c4ff),
    new THREE.Color(0xe0eaff),
    new THREE.Color(0x448aff),
  ],

  postfx: {
    bloomStrength: 0.55,
    bloomRadius: 0.45,
    bloomThreshold: 0.3,
    grainIntensity: 0.01,
    chromaBase: 0.0005,
  },

  fogColor: new THREE.Color(0x050a14),
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
