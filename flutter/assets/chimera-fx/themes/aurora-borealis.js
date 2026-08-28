/**
 * Theme: Aurora Borealis
 *
 * Polar ribbons of green, violet, and icy cyan.
 * WebGL-compatible ChimeraFX theme; no WebGPU renderer path.
 */

import * as THREE from 'three';

export const AuroraBorealis = {
  name: 'aurora-borealis',

  colors: {
    primary: new THREE.Color(0x6fffd2),
    secondary: new THREE.Color(0x9a7cff),
    tertiary: new THREE.Color(0x53d8ff),
    accent: new THREE.Color(0xff5ccf),
    background: new THREE.Color(0x041017),
    surface: new THREE.Color(0x081725),
  },

  particleColors: [
    [0.435, 1.0, 0.824],
    [0.604, 0.486, 1.0],
    [0.325, 0.847, 1.0],
    [1.0, 0.361, 0.812],
  ],

  tendrilColors: [
    new THREE.Color(0x6fffd2),
    new THREE.Color(0x9a7cff),
    new THREE.Color(0xff5ccf),
  ],

  riverColors: [
    [0.435, 1.0, 0.824],
    [0.604, 0.486, 1.0],
    [0.325, 0.847, 1.0],
  ],

  metalColors: [
    new THREE.Color(0x6fffd2),
    new THREE.Color(0x9a7cff),
  ],

  reactionColors: [
    new THREE.Color(0x6fffd2),
    new THREE.Color(0x9a7cff),
    new THREE.Color(0xff5ccf),
  ],

  postfx: {
    bloomStrength: 0.72,
    bloomRadius: 0.55,
    bloomThreshold: 0.22,
    grainIntensity: 0.012,
    chromaBase: 0.001,
  },

  fogColor: new THREE.Color(0x041017),
  fogDensity: 0.0025,

  apply(engine) {
    engine.scene.fog.color.copy(this.fogColor);
    engine.scene.fog.density = this.fogDensity;
    engine.bloomPass.strength = this.postfx.bloomStrength;
    engine.bloomPass.radius = this.postfx.bloomRadius;
    engine.bloomPass.threshold = this.postfx.bloomThreshold;
    engine.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
  },
};
