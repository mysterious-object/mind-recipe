/**
 * Theme: Holographic Matrix
 *
 * Classic green-on-black with iridescent hologram overlays.
 * Inspired by: The Matrix, hologram projections, retro terminals, CRT screens.
 * Heavy scan lines, phosphor glow, monochrome base with holographic shimmer.
 */

import * as THREE from '../../three.module.min.js';

export const HolographicMatrix = {
  name: 'holographic-matrix',

  colors: {
    primary: new THREE.Color(0x00ff41),    // matrix green
    secondary: new THREE.Color(0x00bcd4),  // hologram cyan
    tertiary: new THREE.Color(0xff4081),   // hologram magenta
    accent: new THREE.Color(0xffd740),     // amber highlight
    background: new THREE.Color(0x000a00), // deep green-black
    surface: new THREE.Color(0x001400),
  },

  particleColors: [
    [0.0, 1.0, 0.255],    // matrix green
    [0.0, 0.737, 0.831],  // hologram cyan
    [0.0, 0.5, 0.2],      // dark green
    [1.0, 0.843, 0.251],  // amber
  ],

  tendrilColors: [
    new THREE.Color(0x00ff41),
    new THREE.Color(0x00bcd4),
    new THREE.Color(0xff4081),
  ],

  riverColors: [
    [0.0, 1.0, 0.255],
    [0.0, 0.737, 0.831],
    [1.0, 0.251, 0.506],
  ],

  metalColors: [
    new THREE.Color(0x00ff41),
    new THREE.Color(0x00bcd4),
  ],

  reactionColors: [
    new THREE.Color(0x00ff41),
    new THREE.Color(0x00bcd4),
    new THREE.Color(0xff4081),
  ],

  postfx: {
    bloomStrength: 0.5,
    bloomRadius: 0.4,
    bloomThreshold: 0.3,
    grainIntensity: 0.06,    // higher grain for CRT feel
    chromaBase: 0.001,       // subtle chromatic aberration for hologram
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
