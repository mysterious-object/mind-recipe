/**
 * Theme: Chimera Native
 *
 * Matches the live Chimera AI v4.0 design system exactly.
 * Primary: HSL(174, 100%, 45%) — teal/cyan-green
 * Secondary: HSL(265, 100%, 60%) — purple
 * Success: #00e68a — bright green
 * Background: #020203 — near-black
 *
 * The "green matter" aesthetic — bioluminescent aquarium, living data.
 */

import * as THREE from 'three';

export const ChimeraNative = {
  name: 'chimera-native',

  colors: {
    primary: new THREE.Color().setHSL(174/360, 1.0, 0.45),   // teal-green #00E5CC
    secondary: new THREE.Color().setHSL(265/360, 1.0, 0.60),  // purple #7C3AED
    tertiary: new THREE.Color(0x00e68a),                        // success green
    accent: new THREE.Color(0xf5a623),                          // warning amber
    background: new THREE.Color(0x020203),                      // near-black
    surface: new THREE.Color(0x0a0a0c),
    danger: new THREE.Color(0xff3b5c),
  },

  particleColors: [
    [0.0, 0.898, 0.8],     // teal-green (primary)
    [0.0, 0.902, 0.541],   // success green
    [0.486, 0.227, 0.929], // purple (secondary)
    [0.0, 0.7, 0.6],       // dark teal
  ],

  tendrilColors: [
    new THREE.Color().setHSL(174/360, 1.0, 0.45),  // teal
    new THREE.Color(0x00e68a),                        // green
    new THREE.Color().setHSL(265/360, 1.0, 0.60),   // purple
  ],

  riverColors: [
    [0.0, 0.898, 0.8],     // teal
    [0.0, 0.902, 0.541],   // green
    [0.486, 0.227, 0.929], // purple
  ],

  metalColors: [
    new THREE.Color().setHSL(174/360, 1.0, 0.45),
    new THREE.Color().setHSL(265/360, 1.0, 0.60),
  ],

  reactionColors: [
    new THREE.Color().setHSL(174/360, 1.0, 0.45),
    new THREE.Color(0x00e68a),
    new THREE.Color().setHSL(265/360, 1.0, 0.60),
  ],

  postfx: {
    bloomStrength: 0.35,
    bloomRadius: 0.5,
    bloomThreshold: 0.35,
    grainIntensity: 0.005,
    chromaBase: 0.0005,
  },

  fogColor: new THREE.Color(0x020203),
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
