/**
 * ReactionDiffusion — Gray-Scott model on GPU for organic, evolving textures.
 *
 * Technique: Ping-pong render targets with compute-in-fragment shader.
 * The Gray-Scott reaction-diffusion system creates organic coral-like patterns
 * that evolve over time. Parameters shift with AI state — idle creates slow
 * organic growth, thinking creates rapid proliferation, errors create decay.
 *
 * Inspired by: Karl Sims, Coral reefs, chemical morphogenesis, Turing patterns.
 */

import * as THREE from '../../three.module.min.js';

const COMPUTE_FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D tState;   // previous state (r=A, g=B chemical)
  uniform vec2 uResolution;
  uniform float uFeed;        // feed rate (how fast A is added)
  uniform float uKill;        // kill rate (how fast B decays)
  uniform float uDiffuseA;    // A diffusion rate
  uniform float uDiffuseB;    // B diffusion rate
  uniform float uDt;          // time step
  uniform vec2 uMouse;        // seed point
  uniform float uMouseActive; // 1 when mouse is seeding

  varying vec2 vUv;

  void main() {
    vec2 texel = 1.0 / uResolution;
    vec2 uv = vUv;

    // Sample center and neighbors (Laplacian)
    vec2 c = texture2D(tState, uv).rg;
    vec2 n = texture2D(tState, uv + vec2(0, texel.y)).rg;
    vec2 s = texture2D(tState, uv - vec2(0, texel.y)).rg;
    vec2 e = texture2D(tState, uv + vec2(texel.x, 0)).rg;
    vec2 w = texture2D(tState, uv - vec2(texel.x, 0)).rg;

    // 5-point Laplacian
    vec2 laplacian = (n + s + e + w - 4.0 * c);

    float A = c.r;
    float B = c.g;

    // Gray-Scott equations
    float reaction = A * B * B;
    float newA = A + (uDiffuseA * laplacian.r - reaction + uFeed * (1.0 - A)) * uDt;
    float newB = B + (uDiffuseB * laplacian.g + reaction - (uKill + uFeed) * B) * uDt;

    // Mouse seeding — drop B chemical at mouse position
    float mouseDist = length(uv - (uMouse * 0.5 + 0.5));
    if (uMouseActive > 0.5 && mouseDist < 0.02) {
      newB = 1.0;
    }

    // Auto-seed some random spots to keep it alive
    float autoSeed = step(0.9998, fract(sin(dot(uv * uResolution, vec2(12.9898, 78.233))) * 43758.5453));
    newB = max(newB, autoSeed * 0.5);

    gl_FragColor = vec4(clamp(newA, 0.0, 1.0), clamp(newB, 0.0, 1.0), 0.0, 1.0);
  }
`;

const DISPLAY_FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D tState;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uIntensity;

  varying vec2 vUv;

  void main() {
    vec2 state = texture2D(tState, vUv).rg;
    float A = state.r;
    float B = state.g;

    // Map chemical concentrations to colors
    vec3 col = vec3(0.0);
    col = mix(col, uColor1, smoothstep(0.0, 0.5, B) * 0.6);
    col = mix(col, uColor2, smoothstep(0.3, 0.7, B));
    col = mix(col, uColor3, smoothstep(0.6, 1.0, B) * 0.8);

    // Edge glow where A and B meet
    float edge = abs(A - B);
    col += uColor1 * edge * 0.3;

    float alpha = smoothstep(0.1, 0.5, B) * uIntensity * 0.2;

    gl_FragColor = vec4(col, alpha);
  }
`;

const QUAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Parameter presets per AI state
const PRESETS = {
  idle:      { feed: 0.037, kill: 0.06,  diffA: 1.0, diffB: 0.5, dt: 1.0 },
  thinking:  { feed: 0.042, kill: 0.065, diffA: 1.0, diffB: 0.5, dt: 2.0 },
  streaming: { feed: 0.04,  kill: 0.062, diffA: 1.0, diffB: 0.5, dt: 1.5 },
  executing: { feed: 0.05,  kill: 0.065, diffA: 1.0, diffB: 0.5, dt: 2.5 },
  error:     { feed: 0.02,  kill: 0.055, diffA: 1.2, diffB: 0.4, dt: 0.5 },
  success:   { feed: 0.055, kill: 0.062, diffA: 0.8, diffB: 0.6, dt: 3.0 },
};

export class ReactionDiffusion {
  constructor(opts = {}) {
    this.resolution = opts.resolution || 256;
    this.stepsPerFrame = opts.stepsPerFrame || 8;
    this.displayMesh = null;
    this.computeMat = null;
    this.displayMat = null;
    this.rtA = null;
    this.rtB = null;
    this.computeScene = null;
    this.computeCamera = null;
    this.computeMesh = null;
    this.currentPreset = { ...PRESETS.idle };
    this.targetPreset = { ...PRESETS.idle };
  }

  init(engine) {
    const res = this.resolution;

    // Ping-pong render targets
    const rtOpts = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    };
    this.rtA = new THREE.WebGLRenderTarget(res, res, rtOpts);
    this.rtB = new THREE.WebGLRenderTarget(res, res, rtOpts);

    // Initialize with mostly A, sparse B seeds
    this._seedInitial(engine);

    // Compute pass (offscreen)
    this.computeScene = new THREE.Scene();
    this.computeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadGeo = new THREE.PlaneGeometry(2, 2);

    this.computeMat = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERT,
      fragmentShader: COMPUTE_FRAG,
      uniforms: {
        tState: { value: this.rtA.texture },
        uResolution: { value: new THREE.Vector2(res, res) },
        uFeed: { value: PRESETS.idle.feed },
        uKill: { value: PRESETS.idle.kill },
        uDiffuseA: { value: PRESETS.idle.diffA },
        uDiffuseB: { value: PRESETS.idle.diffB },
        uDt: { value: PRESETS.idle.dt },
        uMouse: { value: new THREE.Vector2() },
        uMouseActive: { value: 0 },
      },
    });
    this.computeMesh = new THREE.Mesh(quadGeo, this.computeMat);
    this.computeScene.add(this.computeMesh);

    // Display mesh
    this.displayMat = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERT,
      fragmentShader: DISPLAY_FRAG,
      uniforms: {
        tState: { value: this.rtA.texture },
        uColor1: { value: new THREE.Color(0x58a6ff) },
        uColor2: { value: new THREE.Color(0xbc8cff) },
        uColor3: { value: new THREE.Color(0x3fb950) },
        uIntensity: { value: 0.3 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.displayMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.displayMat);
    this.displayMesh.frustumCulled = false;
    this.displayMesh.scale.set(25, 25, 1);
    this.displayMesh.position.z = -10;
    engine.scene.add(this.displayMesh);
  }

  _seedInitial(engine) {
    const res = this.resolution;
    const data = new Float32Array(res * res * 4);
    for (let i = 0; i < res * res; i++) {
      const x = (i % res) / res;
      const y = Math.floor(i / res) / res;
      data[i * 4] = 1.0; // A = 1 everywhere
      data[i * 4 + 1] = 0.0; // B = 0

      // Seed some spots with B
      const cx = x - 0.5;
      const cy = y - 0.5;
      if (Math.random() < 0.01 && Math.sqrt(cx * cx + cy * cy) < 0.3) {
        data[i * 4 + 1] = 1.0;
      }
    }

    const tex = new THREE.DataTexture(data, res, res, THREE.RGBAFormat, THREE.FloatType);
    tex.needsUpdate = true;

    // Render initial data to rtA
    const scene = new THREE.Scene();
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(mesh);
    engine.renderer.setRenderTarget(this.rtA);
    engine.renderer.render(scene, cam);
    engine.renderer.setRenderTarget(null);
    mat.dispose();
    tex.dispose();
  }

  update(ctx, engine) {
    if (!this.computeMat) return;

    // Smooth parameter transition
    const speed = 0.02;
    for (const key of ['feed', 'kill', 'diffA', 'diffB', 'dt']) {
      this.currentPreset[key] += (this.targetPreset[key] - this.currentPreset[key]) * speed;
    }

    this.computeMat.uniforms.uFeed.value = this.currentPreset.feed;
    this.computeMat.uniforms.uKill.value = this.currentPreset.kill;
    this.computeMat.uniforms.uDiffuseA.value = this.currentPreset.diffA;
    this.computeMat.uniforms.uDiffuseB.value = this.currentPreset.diffB;
    this.computeMat.uniforms.uDt.value = this.currentPreset.dt;
    this.computeMat.uniforms.uMouse.value.copy(ctx.mouseNDC);

    // Ping-pong compute passes
    for (let i = 0; i < this.stepsPerFrame; i++) {
      this.computeMat.uniforms.tState.value = this.rtA.texture;
      engine.renderer.setRenderTarget(this.rtB);
      engine.renderer.render(this.computeScene, this.computeCamera);

      // Swap
      [this.rtA, this.rtB] = [this.rtB, this.rtA];
    }
    engine.renderer.setRenderTarget(null);

    // Update display
    this.displayMat.uniforms.tState.value = this.rtA.texture;
    this.displayMat.uniforms.uIntensity.value = ctx.intensity;

    // Billboard
    this.displayMesh.quaternion.copy(engine.camera.quaternion);
  }

  onStateChange(state, engine) {
    if (PRESETS[state]) {
      this.targetPreset = { ...PRESETS[state] };
    }
  }

  onThemeChange(theme, engine) {
    if (this.displayMat && theme.reactionColors) {
      this.displayMat.uniforms.uColor1.value.set(theme.reactionColors[0]);
      this.displayMat.uniforms.uColor2.value.set(theme.reactionColors[1]);
      this.displayMat.uniforms.uColor3.value.set(theme.reactionColors[2]);
    }
  }

  dispose(engine) {
    if (this.displayMesh) {
      engine.scene.remove(this.displayMesh);
      this.displayMesh.geometry.dispose();
      this.displayMat.dispose();
    }
    this.computeMat?.dispose();
    this.rtA?.dispose();
    this.rtB?.dispose();
  }
}
