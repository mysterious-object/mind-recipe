/**
 * MindRecipe Core
 *
 * Restorative teal and violet motion with a warm focus signal. This is the
 * product-specific visual genome shared by launch, background, and Pulse.
 */

import * as THREE from '../../three.module.min.js';

export const MindRecipeCore = {
  name: 'mindrecipe-core',

  colors: {
    primary: new THREE.Color(0x00d9c0),
    secondary: new THREE.Color(0x8b5cf6),
    tertiary: new THREE.Color(0xf5b942),
    accent: new THREE.Color(0x7defff),
    background: new THREE.Color(0x06151b),
    surface: new THREE.Color(0x0a2027),
  },

  particleColors: [
    [0.0, 0.851, 0.753],
    [0.545, 0.361, 0.965],
    [0.961, 0.725, 0.259],
    [0.247, 0.608, 0.859],
  ],

  tendrilColors: [
    new THREE.Color(0x00d9c0),
    new THREE.Color(0x8b5cf6),
    new THREE.Color(0xf5b942),
  ],

  riverColors: [
    [0.0, 0.851, 0.753],
    [0.545, 0.361, 0.965],
    [0.961, 0.725, 0.259],
  ],

  metalColors: [
    new THREE.Color(0x00d9c0),
    new THREE.Color(0x8b5cf6),
  ],

  reactionColors: [
    new THREE.Color(0x00d9c0),
    new THREE.Color(0x8b5cf6),
    new THREE.Color(0xf5b942),
  ],

  postfx: {
    bloomStrength: 0.62,
    bloomRadius: 0.54,
    bloomThreshold: 0.24,
    grainIntensity: 0.014,
    chromaBase: 0.001,
  },

  fogColor: new THREE.Color(0x06151b),
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
