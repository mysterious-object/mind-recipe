/**
 * Theme: Obsidian Forge
 *
 * Black glass, molten orange, and steel-blue sparks.
 * WebGL-compatible ChimeraFX theme; no WebGPU renderer path.
 */

import * as THREE from 'three';

export const ObsidianForge = {
  name: 'obsidian-forge',

  colors: {
    primary: new THREE.Color(0xff7a18),
    secondary: new THREE.Color(0x9bd7ff),
    tertiary: new THREE.Color(0x2f3542),
    accent: new THREE.Color(0xffc15e),
    background: new THREE.Color(0x050506),
    surface: new THREE.Color(0x111217),
  },

  particleColors: [
    [1.0, 0.478, 0.094],
    [1.0, 0.757, 0.369],
    [0.608, 0.843, 1.0],
    [0.184, 0.208, 0.259],
  ],

  tendrilColors: [
    new THREE.Color(0xff7a18),
    new THREE.Color(0xffc15e),
    new THREE.Color(0x9bd7ff),
  ],

  riverColors: [
    [1.0, 0.478, 0.094],
    [0.608, 0.843, 1.0],
    [1.0, 0.757, 0.369],
  ],

  metalColors: [
    new THREE.Color(0xff7a18),
    new THREE.Color(0x9bd7ff),
  ],

  reactionColors: [
    new THREE.Color(0xff7a18),
    new THREE.Color(0xffc15e),
    new THREE.Color(0x9bd7ff),
  ],

  postfx: {
    bloomStrength: 0.82,
    bloomRadius: 0.48,
    bloomThreshold: 0.24,
    grainIntensity: 0.018,
    chromaBase: 0.0012,
  },

  fogColor: new THREE.Color(0x050506),
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
