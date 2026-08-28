/**
 * EnergyBeams — Procedural lightning / energy arcs between dynamic endpoints.
 *
 * Technique: FBM-displaced line segments rendered on billboard planes with
 * inverse-distance glow falloff. Multiple beam layers with different seeds
 * create thickness. Lissajous oscillation on endpoints adds structured motion.
 *
 * Research source: Shadertoy FBM Lightning, stemkoski glow shader.
 * Inspired by: Tesla coils, sci-fi tractor beams, neural synapses firing.
 */

import * as THREE from '../../three.module.min.js';

const BEAM_FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColor;
  uniform vec2 uPointA;       // start point (NDC)
  uniform vec2 uPointB;       // end point (NDC)
  uniform float uThickness;
  uniform float uBranches;

  varying vec2 vUv;

  // ── Noise ──
  float hash(float n) { return fract(sin(n) * 43758.5453); }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = i.x + i.y * 157.0;
    return mix(mix(hash(n), hash(n + 1.0), f.x),
               mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p;
      a *= 0.5;
    }
    return v;
  }

  // ── Lightning bolt from A to B ──
  float bolt(vec2 uv, vec2 a, vec2 b, float seed, float time) {
    vec2 dir = b - a;
    float len = length(dir);
    if (len < 0.001) return 0.0;
    vec2 norm = vec2(-dir.y, dir.x) / len;

    // Parameter along bolt (0..1)
    float t = clamp(dot(uv - a, dir) / (len * len), 0.0, 1.0);

    // FBM displacement perpendicular to bolt direction
    float displacement = fbm(vec2(t * 8.0 + seed, time * 3.0 + seed)) * 0.15;
    displacement += fbm(vec2(t * 16.0 + seed * 2.0, time * 7.0)) * 0.05; // fine detail

    // Taper displacement at endpoints
    float taper = smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.9, t);
    displacement *= taper;

    // Perpendicular distance from displaced bolt path
    float dist = abs(dot(uv - a, norm) - displacement);

    // Inverse distance glow
    float glow = uThickness / (dist + 0.001);
    glow *= taper; // fade at ends

    return glow;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;

    float totalGlow = 0.0;

    // Main bolt
    totalGlow += bolt(uv, uPointA, uPointB, 0.0, t) * 0.6;

    // Secondary bolts (slightly offset paths)
    totalGlow += bolt(uv, uPointA, uPointB, 7.3, t * 1.2) * 0.3;
    totalGlow += bolt(uv, uPointA, uPointB, 13.7, t * 0.8) * 0.2;

    // Branch bolts
    if (uBranches > 0.5) {
      vec2 mid = mix(uPointA, uPointB, 0.4 + fbm(vec2(t * 0.5, 0.0)) * 0.2);
      vec2 branchEnd = mid + vec2(
        fbm(vec2(t, 0.0)) * 0.15,
        fbm(vec2(0.0, t)) * 0.15
      );
      totalGlow += bolt(uv, mid, branchEnd, 23.1, t * 1.5) * 0.15;

      vec2 mid2 = mix(uPointA, uPointB, 0.65);
      vec2 branchEnd2 = mid2 + vec2(
        fbm(vec2(t + 5.0, 1.0)) * 0.12,
        fbm(vec2(1.0, t + 5.0)) * -0.12
      );
      totalGlow += bolt(uv, mid2, branchEnd2, 37.9, t * 1.3) * 0.1;
    }

    // Intensity modulation
    totalGlow *= uIntensity;

    // Flicker
    float flicker = 0.85 + 0.15 * sin(t * 20.0) * sin(t * 31.0);
    totalGlow *= flicker;

    // Color with hot white core
    vec3 col = mix(uColor, vec3(1.0), smoothstep(1.0, 5.0, totalGlow));
    float alpha = min(totalGlow, 1.0);

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col * totalGlow, alpha);
  }
`;

const BEAM_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export class EnergyBeams {
  constructor(opts = {}) {
    this.beamCount = opts.count || 3;
    this.color = opts.color || new THREE.Color(0x58a6ff);
    this.beams = [];
    this._pulseActive = false;
    this._pulseTime = 0;
  }

  init(engine) {
    for (let i = 0; i < this.beamCount; i++) {
      const mat = new THREE.ShaderMaterial({
        vertexShader: BEAM_VERT,
        fragmentShader: BEAM_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0 },
          uColor: { value: this.color.clone() },
          uPointA: { value: new THREE.Vector2(-0.3, -0.5) },
          uPointB: { value: new THREE.Vector2(0.3, 0.5) },
          uThickness: { value: 0.003 },
          uBranches: { value: 1.0 },
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      });

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
      mesh.frustumCulled = false;
      mesh.renderOrder = 800;
      mesh.visible = false;
      engine.scene.add(mesh);
      this.beams.push({ mesh, mat, seed: Math.random() * 100 });
    }
  }

  update(ctx, engine) {
    const showBeams = ctx.state === 'executing' || ctx.state === 'success' || this._pulseActive;

    this.beams.forEach((beam, i) => {
      beam.mesh.visible = showBeams;
      if (!showBeams) return;

      const t = ctx.elapsed;
      beam.mat.uniforms.uTime.value = t;

      // Lissajous endpoint animation
      const seed = beam.seed;
      const freq = 0.3 + i * 0.1;
      beam.mat.uniforms.uPointA.value.set(
        Math.sin(t * freq + seed) * 0.4,
        -0.5 + Math.sin(t * freq * 0.7 + seed) * 0.1
      );
      beam.mat.uniforms.uPointB.value.set(
        Math.sin(t * freq * 1.3 + seed + 2.0) * 0.4,
        0.4 + Math.cos(t * freq * 0.5 + seed) * 0.2
      );

      // Pulse decay
      let intensity = ctx.intensity;
      if (this._pulseActive) {
        const pulseAge = t - this._pulseTime;
        intensity = Math.max(intensity, 1.0 - pulseAge * 0.5);
        if (pulseAge > 2.0) this._pulseActive = false;
      }
      beam.mat.uniforms.uIntensity.value = intensity;

      // Billboard
      beam.mesh.position.copy(engine.camera.position);
      beam.mesh.position.z -= 0.8;
      beam.mesh.lookAt(engine.camera.position);
    });
  }

  onPulse(type, data, engine) {
    if (type === 'trade' || type === 'success') {
      this._pulseActive = true;
      this._pulseTime = engine.clock.getElapsedTime();
    }
  }

  onThemeChange(theme, engine) {
    const color = theme.tendrilColors?.[0] || this.color;
    this.beams.forEach(b => b.mat.uniforms.uColor.value.copy(color));
  }

  dispose(engine) {
    this.beams.forEach(({ mesh, mat }) => {
      engine.scene.remove(mesh);
      mesh.geometry.dispose();
      mat.dispose();
    });
    this.beams = [];
  }
}
