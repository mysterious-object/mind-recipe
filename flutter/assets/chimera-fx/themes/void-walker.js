/**
 * Theme: Void Walker
 *
 * Ultraviolet and indigo, quantum field aesthetics.
 * Based on Quantum Void but more cinematic.
 * Maximum bloom, ethereal fog, sparse but powerful.
 */

import * as THREE from 'three';

export const VoidWalker = {
  name: 'void-walker',

  colors: {
    primary: new THREE.Color(0x7c4dff),   // ultraviolet
    secondary: new THREE.Color(0x448aff), // quantum blue
    tertiary: new THREE.Color(0xe040fb),  // magenta
    accent: new THREE.Color(0xffffff),    // photon white
    background: new THREE.Color(0x030308), // void
    surface: new THREE.Color(0x05050d),
  },

  particleColors: [
    [0.486, 0.302, 1.0],    // ultraviolet
    [0.267, 0.541, 1.0],   // quantum blue
    [0.878, 0.251, 0.984], // magenta
    [1.0, 1.0, 1.0],       // photon white
  ],

  tendrilColors: [
    new THREE.Color(0x7c4dff),
    new THREE.Color(0x448aff),
    new THREE.Color(0xe040fb),
  ],

  riverColors: [
    [0.486, 0.302, 1.0],
    [0.267, 0.541, 1.0],
    [1.0, 1.0, 1.0],
  ],

  metalColors: [
    new THREE.Color(0x7c4dff),
    new THREE.Color(0x448aff),
  ],

  reactionColors: [
    new THREE.Color(0x7c4dff),
    new THREE.Color(0x448aff),
    new THREE.Color(0xe040fb),
  ],

  postfx: {
    bloomStrength: 0.85,
    bloomRadius: 0.55,
    bloomThreshold: 0.2,
    grainIntensity: 0.02,
    chromaBase: 0.0015,
  },

  fogColor: new THREE.Color(0x030308),
  fogDensity: 0.004,

  apply(engine) {
    engine.scene.fog.color.copy(this.fogColor);
    engine.scene.fog.density = this.fogDensity;
    engine.bloomPass.strength = this.postfx.bloomStrength;
    engine.bloomPass.radius = this.postfx.bloomRadius;
    engine.bloomPass.threshold = this.postfx.bloomThreshold;
    engine.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
  },
};
