/**
 * Theme: Organic Bioluminescent
 *
 * Deep ocean blues, phosphorescent greens, warm amber accents.
 * Inspired by: Deep sea creatures, Avatar bioluminescence, jellyfish, coral reefs.
 * Soft bloom, organic shapes, slow fluid motion.
 */

import * as THREE from '../../three.module.min.js';

export const OrganicBioluminescent = {
  name: 'organic-bioluminescent',

  colors: {
    primary: new THREE.Color(0x00e5ff),    // bioluminescent blue
    secondary: new THREE.Color(0x76ff03),  // phosphor green
    tertiary: new THREE.Color(0xffab00),   // amber
    accent: new THREE.Color(0xe040fb),     // magenta (deep sea)
    background: new THREE.Color(0x001a33), // deep ocean
    surface: new THREE.Color(0x002244),
  },

  particleColors: [
    [0.0, 0.898, 1.0],    // bioluminescent blue
    [0.463, 1.0, 0.012],  // phosphor green
    [1.0, 0.671, 0.0],    // amber
    [0.878, 0.251, 0.984], // magenta
  ],

  tendrilColors: [
    new THREE.Color(0x00e5ff),
    new THREE.Color(0x76ff03),
    new THREE.Color(0xe040fb),
  ],

  riverColors: [
    [0.0, 0.898, 1.0],
    [0.463, 1.0, 0.012],
    [0.878, 0.251, 0.984],
  ],

  metalColors: [
    new THREE.Color(0x00e5ff),
    new THREE.Color(0x76ff03),
  ],

  reactionColors: [
    new THREE.Color(0x00e5ff),
    new THREE.Color(0x76ff03),
    new THREE.Color(0xffab00),
  ],

  postfx: {
    bloomStrength: 0.6,
    bloomRadius: 0.5,
    bloomThreshold: 0.25,
    grainIntensity: 0.03,
    chromaBase: 0.001,
  },

  fogColor: new THREE.Color(0x001a33),
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
