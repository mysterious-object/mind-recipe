/**
 * Theme: Quantum Void
 *
 * Ultraviolet, deep indigo, particle physics aesthetics.
 * Inspired by: CERN visualizations, quantum field theory, event horizons.
 * Minimal color palette, heavy bloom, ethereal and sparse.
 */

import * as THREE from 'three';

export const QuantumVoid = {
  name: 'quantum-void',

  colors: {
    primary: new THREE.Color(0x7c4dff),   // ultraviolet
    secondary: new THREE.Color(0x448aff), // quantum blue
    tertiary: new THREE.Color(0xff6e40),  // annihilation orange
    accent: new THREE.Color(0xffffff),    // pure white (photon)
    background: new THREE.Color(0x050510), // void
    surface: new THREE.Color(0x0a0a20),
  },

  particleColors: [
    [0.486, 0.302, 1.0],   // ultraviolet
    [0.267, 0.541, 1.0],   // quantum blue
    [1.0, 0.431, 0.251],   // orange
    [1.0, 1.0, 1.0],       // photon white
  ],

  tendrilColors: [
    new THREE.Color(0x7c4dff),
    new THREE.Color(0x448aff),
    new THREE.Color(0xff6e40),
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
    new THREE.Color(0xff6e40),
  ],

  postfx: {
    bloomStrength: 0.7,
    bloomRadius: 0.5,
    bloomThreshold: 0.25,
    grainIntensity: 0.03,
    chromaBase: 0.001,
  },

  fogColor: new THREE.Color(0x050510),
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
