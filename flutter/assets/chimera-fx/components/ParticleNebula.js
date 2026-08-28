/**
 * ParticleNebula — GPGPU-driven particle cloud using curl noise flow fields.
 *
 * Particles follow a 3D curl noise vector field, creating organic aurora/nebula
 * effects. Intensity, speed, and color react to AI state.
 *
 * Technique: InstancedBufferGeometry + custom vertex/fragment shaders.
 * Each particle stores position + velocity + life in buffer attributes,
 * updated per-frame on GPU via vertex displacement.
 */

import * as THREE from 'three';

const PARTICLE_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uMouse;
  uniform float uDelta;

  attribute vec3 aOffset;
  attribute vec3 aVelocity;
  attribute float aLife;
  attribute float aSize;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  // ── Curl noise (3D) ──
  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }

  float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(mix(dot(hash3(i), f),
                       dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                   mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
                       dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
               mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
                       dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                   mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
                       dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
  }

  vec3 curlNoise(vec3 p) {
    float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);

    float x = noise3D(p + dy) - noise3D(p - dy)
            - noise3D(p + dz) + noise3D(p - dz);
    float y = noise3D(p + dz) - noise3D(p - dz)
            - noise3D(p + dx) + noise3D(p - dx);
    float z = noise3D(p + dx) - noise3D(p - dx)
            - noise3D(p + dy) + noise3D(p - dy);

    return normalize(vec3(x, y, z)) / (2.0 * e);
  }

  void main() {
    // Curl noise flow
    float speed = 0.15 + uIntensity * 0.3;
    vec3 pos = aOffset;
    pos += curlNoise(pos * 0.08 + uTime * speed * 0.1) * uTime * speed * 0.5;

    // Orbit around center
    float angle = uTime * 0.05 * (1.0 + uIntensity);
    mat3 rot = mat3(
      cos(angle), 0.0, sin(angle),
      0.0, 1.0, 0.0,
      -sin(angle), 0.0, cos(angle)
    );
    pos = rot * pos;

    // Mouse influence
    vec3 mouseWorld = vec3(uMouse * 15.0, 0.0);
    vec3 toMouse = mouseWorld - pos;
    float mouseDist = length(toMouse);
    pos += normalize(toMouse) * (2.0 / max(mouseDist, 1.0)) * uIntensity;

    // Fade based on life
    float life = fract(aLife + uTime * 0.02);
    vAlpha = sin(life * 3.14159) * (0.1 + uIntensity * 0.2);
    vColor = aColor * (0.5 + uIntensity * 0.5);

    // Size pulses
    float size = aSize * (1.0 + sin(uTime * 2.0 + aLife * 20.0) * 0.3 * uIntensity);

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (300.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const PARTICLE_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Soft circle with glow halo
    float dist = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.1, dist);
    float halo = smoothstep(0.5, 0.0, dist) * 0.3;
    float alpha = (core + halo) * vAlpha;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export class ParticleNebula {
  constructor(opts = {}) {
    this.count = opts.count || 8000;
    this.spread = opts.spread || 40;
    this.mesh = null;
    this.material = null;
  }

  init(engine) {
    const geo = new THREE.BufferGeometry();

    // Base geometry — single point
    const positions = new Float32Array(3); // origin
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Instanced attributes
    const offsets = new Float32Array(this.count * 3);
    const velocities = new Float32Array(this.count * 3);
    const lives = new Float32Array(this.count);
    const sizes = new Float32Array(this.count);
    const colors = new Float32Array(this.count * 3);

    const palette = engine.theme?.particleColors || [
      [0.345, 0.651, 1.0],  // cyan
      [0.737, 0.549, 1.0],  // purple
      [0.247, 0.725, 0.314], // green
      [1.0, 0.596, 0.0],    // orange
    ];

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.5) * this.spread;

      offsets[i3] = r * Math.sin(phi) * Math.cos(theta);
      offsets[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      offsets[i3 + 2] = r * Math.cos(phi);

      velocities[i3] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;

      lives[i] = Math.random();
      sizes[i] = 0.5 + Math.random() * 2.0;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = col[0];
      colors[i3 + 1] = col[1];
      colors[i3 + 2] = col[2];
    }

    geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
    geo.setAttribute('aVelocity', new THREE.InstancedBufferAttribute(velocities, 3));
    geo.setAttribute('aLife', new THREE.InstancedBufferAttribute(lives, 1));
    geo.setAttribute('aSize', new THREE.InstancedBufferAttribute(sizes, 1));
    geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(colors, 3));

    this.material = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.3 },
        uMouse: { value: new THREE.Vector2() },
        uDelta: { value: 0.016 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(0.01, 0.01), // dummy
      this.material,
      this.count
    );
    // Actually, use Points for efficiency
    this.mesh = new THREE.Points(geo, this.material);
    this.mesh.frustumCulled = false;

    engine.scene.add(this.mesh);
  }

  update(ctx, engine) {
    if (!this.material) return;
    this.material.uniforms.uTime.value = ctx.elapsed;
    this.material.uniforms.uIntensity.value = ctx.intensity;
    this.material.uniforms.uMouse.value.copy(ctx.mouseNDC);
    this.material.uniforms.uDelta.value = ctx.dt;
  }

  onStateChange(state, engine) {
    // Components react purely through ctx.intensity from the engine
  }

  onPulse(type, data, engine) {
    // Flash: temporarily max out intensity (engine handles timing)
  }

  onThemeChange(theme, engine) {
    if (!this.mesh || !theme?.particleColors) return;
    // Rebuild the aColor buffer from the new theme's palette
    const colors = this.mesh.geometry.getAttribute('aColor');
    if (!colors) return;
    const palette = theme.particleColors;
    const count = colors.count;
    for (let i = 0; i < count; i++) {
      const col = palette[Math.floor(Math.random() * palette.length)];
      colors.setXYZ(i, col[0], col[1], col[2]);
    }
    colors.needsUpdate = true;
  }

  dispose(engine) {
    if (this.mesh) {
      engine.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.material.dispose();
    }
  }
}
