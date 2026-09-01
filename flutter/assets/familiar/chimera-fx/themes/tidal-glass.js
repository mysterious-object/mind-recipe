/**
 * Theme: Tidal Glass
 *
 * Transparent aqua, cobalt, and pale-gold caustics.
 * WebGL-compatible ChimeraFX theme; no WebGPU renderer path.
 */

import * as THREE from 'three';

export const TidalGlass = {
  name: 'tidal-glass',

  colors: {
    primary: new THREE.Color(0x42d9ff),
    secondary: new THREE.Color(0x4f85ff),
    tertiary: new THREE.Color(0xf3d77a),
    accent: new THREE.Color(0xdffbff),
    background: new THREE.Color(0x03101c),
    surface: new THREE.Color(0x071827),
  },

  particleColors: [
    [0.259, 0.851, 1.0],
    [0.31, 0.522, 1.0],
    [0.953, 0.843, 0.478],
    [0.875, 0.984, 1.0],
  ],

  tendrilColors: [
    new THREE.Color(0x42d9ff),
    new THREE.Color(0x4f85ff),
    new THREE.Color(0xf3d77a),
  ],

  riverColors: [
    [0.259, 0.851, 1.0],
    [0.31, 0.522, 1.0],
    [0.953, 0.843, 0.478],
  ],

  metalColors: [
    new THREE.Color(0x42d9ff),
    new THREE.Color(0xdffbff),
  ],

  reactionColors: [
    new THREE.Color(0x42d9ff),
    new THREE.Color(0x4f85ff),
    new THREE.Color(0xf3d77a),
  ],

  postfx: {
    bloomStrength: 0.62,
    bloomRadius: 0.52,
    bloomThreshold: 0.28,
    grainIntensity: 0.006,
    chromaBase: 0.0008,
  },

  fogColor: new THREE.Color(0x03101c),
  fogDensity: 0.0022,

  apply(engine) {
    engine.scene.fog.color.copy(this.fogColor);
    engine.scene.fog.density = this.fogDensity;
    engine.bloomPass.strength = this.postfx.bloomStrength;
    engine.bloomPass.radius = this.postfx.bloomRadius;
    engine.bloomPass.threshold = this.postfx.bloomThreshold;
    engine.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
  },
};
