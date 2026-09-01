/**
 * Theme: Neon Samurai
 *
 * Hot pink and electric cyan, aggressive gaming aesthetic.
 * Based on Cyberpunk Neon but more cinematic — heavier bloom,
 * more saturated colors, full component energy.
 */

import * as THREE from 'three';

export const NeonSamurai = {
  name: 'neon-samurai',

  colors: {
    primary: new THREE.Color(0xff0066),    // hot pink
    secondary: new THREE.Color(0x00ffff),  // electric cyan
    tertiary: new THREE.Color(0x7c3aed),   // purple
    accent: new THREE.Color(0xffff00),     // neon yellow
    background: new THREE.Color(0x0a0014), // deep purple-black
    surface: new THREE.Color(0x1a0033),
  },

  particleColors: [
    [1.0, 0.0, 0.4],     // hot pink
    [0.0, 1.0, 1.0],     // cyan
    [0.486, 0.227, 0.929],// purple
    [1.0, 1.0, 0.0],     // yellow
  ],

  tendrilColors: [
    new THREE.Color(0xff0066),
    new THREE.Color(0x00ffff),
    new THREE.Color(0x7c3aed),
  ],

  riverColors: [
    [1.0, 0.0, 0.4],
    [0.0, 1.0, 1.0],
    [1.0, 1.0, 0.0],
  ],

  metalColors: [
    new THREE.Color(0xff0066),
    new THREE.Color(0x00ffff),
  ],

  reactionColors: [
    new THREE.Color(0xff0066),
    new THREE.Color(0x00ffff),
    new THREE.Color(0x7c3aed),
  ],

  postfx: {
    bloomStrength: 0.7,
    bloomRadius: 0.5,
    bloomThreshold: 0.25,
    grainIntensity: 0.035,
    chromaBase: 0.002,
  },

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
