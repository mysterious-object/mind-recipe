/**
 * EnergyTendrils — Procedural lightning / energy veins using line geometry.
 *
 * Technique: BufferGeometry lines with vertex displacement via fbm noise.
 * Multiple "tendrils" originate from the bottom of screen and reach upward,
 * branching and flickering. Reacts to AI state with speed and brightness.
 *
 * Inspired by: electrical discharge simulations, Lissajous curves, aurora borealis.
 */

import * as THREE from '../../three.module.min.js';

const TENDRIL_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uBaseY;

  attribute float aProgress;   // 0..1 along tendril
  attribute float aSeed;       // unique per-tendril
  attribute float aBranch;     // branch index

  varying float vProgress;
  varying float vIntensity;

  // Hash functions
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash2(i), f),
                   dot(hash2(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
               mix(dot(hash2(i + vec2(0, 1)), f - vec2(0, 1)),
                   dot(hash2(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float t = uTime;
    float seed = aSeed;
    float prog = aProgress;

    // Base path: curve from bottom to top
    float x = position.x;
    float y = position.y;

    // Apply fbm displacement — increases with progress (wilder at tips)
    float displace = fbm(vec2(prog * 3.0 + seed * 10.0, t * (0.5 + uIntensity))) * prog;
    x += displace * 8.0;

    // Secondary jitter — high frequency for lightning crackle
    float jitter = noise(vec2(prog * 20.0, t * 5.0 + seed * 100.0)) * prog * 2.0 * uIntensity;
    x += jitter;

    // Vertical stretch based on intensity
    y *= 1.0 + uIntensity * 0.3;

    // Branch offset
    x += aBranch * 0.5 * prog;

    vProgress = prog;
    vIntensity = uIntensity;

    vec4 mvPos = modelViewMatrix * vec4(x, y, position.z, 1.0);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const TENDRIL_FRAG = /* glsl */ `
  varying float vProgress;
  varying float vIntensity;
  uniform vec3 uColor;
  uniform float uTime;

  void main() {
    // Core brightness at base, fading at tips
    float alpha = (1.0 - vProgress) * (0.15 + vIntensity * 0.25);

    // Flickering
    float flicker = 0.8 + 0.2 * sin(uTime * 15.0 + vProgress * 50.0);
    alpha *= flicker;

    // Color shifts from base color to white at core
    vec3 col = mix(uColor, vec3(1.0), vProgress * 0.3 * vIntensity);

    gl_FragColor = vec4(col, alpha);
  }
`;

export class EnergyTendrils {
  constructor(opts = {}) {
    this.tendrilCount = opts.count || 6;
    this.segmentsPerTendril = opts.segments || 48;
    this.height = opts.height || 18;
    this.meshes = [];
  }

  init(engine) {
    const palette = engine.theme?.tendrilColors || [
      new THREE.Color(0x58a6ff),
      new THREE.Color(0xbc8cff),
      new THREE.Color(0x3fb950),
    ];

    for (let t = 0; t < this.tendrilCount; t++) {
      const geo = new THREE.BufferGeometry();
      const positions = [];
      const progresses = [];
      const seeds = [];
      const branches = [];

      const seed = Math.random() * 100;
      const startX = (Math.random() - 0.5) * 30;
      const branchCount = 1 + Math.floor(Math.random() * 3);

      for (let b = 0; b < branchCount; b++) {
        for (let s = 0; s <= this.segmentsPerTendril; s++) {
          const prog = s / this.segmentsPerTendril;
          positions.push(startX, -15 + prog * this.height, (Math.random() - 0.5) * 2);
          progresses.push(prog);
          seeds.push(seed);
          branches.push(b - branchCount / 2);
        }
      }

      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('aProgress', new THREE.Float32BufferAttribute(progresses, 1));
      geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 1));
      geo.setAttribute('aBranch', new THREE.Float32BufferAttribute(branches, 1));

      const color = palette[t % palette.length];
      const mat = new THREE.ShaderMaterial({
        vertexShader: TENDRIL_VERT,
        fragmentShader: TENDRIL_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0.3 },
          uBaseY: { value: -15 },
          uColor: { value: color },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.Line(geo, mat);
      line.frustumCulled = false;
      engine.scene.add(line);
      this.meshes.push({ line, mat, geo });
    }
  }

  update(ctx, engine) {
    this.meshes.forEach(({ mat }) => {
      mat.uniforms.uTime.value = ctx.elapsed;
      mat.uniforms.uIntensity.value = ctx.intensity;
    });
  }

  onPulse(type, data, engine) {
    // Could spawn additional temporary tendrils for trade pulses
  }

  dispose(engine) {
    this.meshes.forEach(({ line, mat, geo }) => {
      engine.scene.remove(line);
      geo.dispose();
      mat.dispose();
    });
    this.meshes = [];
  }
}
