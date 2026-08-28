/**
 * Theme: Midnight Trading
 *
 * Deep matrix green, data stream aesthetic for focused traders.
 * Based on Holographic Matrix but darker, more trading-focused.
 * Heavy data rivers, subtle matrix rain, restrained bloom.
 */

import * as THREE from 'three';

export const MidnightTrading = {
  name: 'midnight-trading',

  colors: {
    primary: new THREE.Color(0x00ff41),     // matrix green
    secondary: new THREE.Color(0x00bcd4),  // data cyan
    tertiary: new THREE.Color(0x003311),   // dark forest
    accent: new THREE.Color(0x39ff14),      // neon green
    background: new THREE.Color(0x000a00),  // near-black green
    surface: new THREE.Color(0x001400),
  },

  particleColors: [
    [0.0, 1.0, 0.255],    // matrix green
    [0.0, 0.737, 0.831],  // data cyan
    [0.0, 0.5, 0.2],      // dark green
    [0.224, 1.0, 0.078],  // neon accent
  ],

  tendrilColors: [
    new THREE.Color(0x00ff41),
    new THREE.Color(0x00bcd4),
    new THREE.Color(0x39ff14),
  ],

  riverColors: [
    [0.0, 1.0, 0.255],
    [0.0, 0.737, 0.831],
    [0.224, 1.0, 0.078],
  ],

  metalColors: [
    new THREE.Color(0x00ff41),
    new THREE.Color(0x00bcd4),
  ],

  reactionColors: [
    new THREE.Color(0x00ff41),
    new THREE.Color(0x00bcd4),
    new THREE.Color(0x39ff14),
  ],

  postfx: {
    bloomStrength: 0.55,
    bloomRadius: 0.5,
    bloomThreshold: 0.28,
    grainIntensity: 0.025,
    chromaBase: 0.001,
  },

  fogColor: new THREE.Color(0x000a00),
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
