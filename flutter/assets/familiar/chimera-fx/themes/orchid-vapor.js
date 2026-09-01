/**
 * Theme: Orchid Vapor
 *
 * Vapor magenta with mint and cyan aerogel glow.
 * WebGL-compatible ChimeraFX theme; no WebGPU renderer path.
 */

import * as THREE from 'three';

export const OrchidVapor = {
  name: 'orchid-vapor',

  colors: {
    primary: new THREE.Color(0xff5ac8),
    secondary: new THREE.Color(0x8fffe0),
    tertiary: new THREE.Color(0x68d8ff),
    accent: new THREE.Color(0xe8b7ff),
    background: new THREE.Color(0x100515),
    surface: new THREE.Color(0x17101f),
  },

  particleColors: [
    [1.0, 0.353, 0.784],
    [0.561, 1.0, 0.878],
    [0.408, 0.847, 1.0],
    [0.91, 0.718, 1.0],
  ],

  tendrilColors: [
    new THREE.Color(0xff5ac8),
    new THREE.Color(0x8fffe0),
    new THREE.Color(0xe8b7ff),
  ],

  riverColors: [
    [1.0, 0.353, 0.784],
    [0.561, 1.0, 0.878],
    [0.408, 0.847, 1.0],
  ],

  metalColors: [
    new THREE.Color(0xff5ac8),
    new THREE.Color(0x8fffe0),
  ],

  reactionColors: [
    new THREE.Color(0xff5ac8),
    new THREE.Color(0x8fffe0),
    new THREE.Color(0xe8b7ff),
  ],

  postfx: {
    bloomStrength: 0.66,
    bloomRadius: 0.62,
    bloomThreshold: 0.25,
    grainIntensity: 0.01,
    chromaBase: 0.001,
  },

  fogColor: new THREE.Color(0x100515),
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
