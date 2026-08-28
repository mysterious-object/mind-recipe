/**
 * VoronoiShatter — Crack/shatter effect for error and transition states.
 *
 * Technique: Voronoi diagram computed in fragment shader creates cell-based
 * fracture patterns. On trigger, cells "explode" outward with physics-based
 * displacement. Between triggers, shows subtle living crack patterns.
 *
 * Inspired by: Glass shattering, blockchain block transitions, glitch art.
 */

import * as THREE from 'three';

const VORONOI_FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;     // 0 = hidden, 1 = full shatter
  uniform float uShatterPhase;  // 0..1 transition progress
  uniform vec2 uResolution;
  uniform vec3 uEdgeColor;
  uniform vec3 uFillColor;
  uniform int uCellCount;

  varying vec2 vUv;

  // Voronoi
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }

  vec3 voronoi(vec2 x, float time) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    float minDist = 8.0;
    float secondDist = 8.0;
    vec2 minPoint;

    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = hash2(n + g);
        // Animate cell centers
        o = 0.5 + 0.5 * sin(time * 0.5 + 6.2831 * o);
        vec2 r = g + o - f;
        float d = dot(r, r);

        if (d < minDist) {
          secondDist = minDist;
          minDist = d;
          minPoint = r;
        } else if (d < secondDist) {
          secondDist = d;
        }
      }
    }

    float edge = secondDist - minDist;
    return vec3(minDist, edge, length(minPoint));
  }

  void main() {
    if (uIntensity < 0.01) discard;

    vec2 uv = vUv;
    float cellScale = float(uCellCount);

    vec3 v = voronoi(uv * cellScale, uTime);

    float minDist = v.x;
    float edge = v.y;
    float cellId = v.z;

    // Sharp crack lines
    float crackWidth = 0.05 + uShatterPhase * 0.1;
    float crack = smoothstep(crackWidth, 0.0, edge);

    // Cell displacement during shatter
    float displaceAmount = uShatterPhase * uShatterPhase * 0.05;
    vec2 cellOffset = (hash2(vec2(cellId * 100.0)) - 0.5) * displaceAmount;

    // Edge glow
    float edgeGlow = crack * (0.5 + uShatterPhase * 0.5);

    // Fill — subtle when idle, strong during shatter
    float fillAlpha = smoothstep(0.3, 0.0, minDist) * uShatterPhase * 0.3;

    // Combine
    vec3 color = uEdgeColor * edgeGlow + uFillColor * fillAlpha;

    // Flash effect on initial shatter
    float flash = smoothstep(0.0, 0.1, uShatterPhase) * smoothstep(0.3, 0.1, uShatterPhase);
    color += vec3(1.0) * flash * 0.3;

    float alpha = (edgeGlow + fillAlpha) * uIntensity;

    gl_FragColor = vec4(color, alpha);
  }
`;

const VORONOI_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export class VoronoiShatter {
  constructor(opts = {}) {
    this.cellCount = opts.cells || 12;
    this.edgeColor = opts.edgeColor || new THREE.Color(0xf85149);
    this.fillColor = opts.fillColor || new THREE.Color(0xff9800);
    this.mesh = null;
    this.mat = null;
    this._shatterPhase = 0;
    this._shatterTarget = 0;
    this._active = false;
  }

  init(engine) {
    this.mat = new THREE.ShaderMaterial({
      vertexShader: VORONOI_VERT,
      fragmentShader: VORONOI_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0 },
        uShatterPhase: { value: 0 },
        uResolution: { value: new THREE.Vector2(
          engine.renderer.domElement.width,
          engine.renderer.domElement.height
        ) },
        uEdgeColor: { value: this.edgeColor },
        uFillColor: { value: this.fillColor },
        uCellCount: { value: this.cellCount },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.scale.set(30, 30, 1);
    this.mesh.position.z = -5;
    this.mesh.visible = false;
    engine.scene.add(this.mesh);
  }

  update(ctx, engine) {
    if (!this.mat) return;
    this.mat.uniforms.uTime.value = ctx.elapsed;

    // Smooth shatter phase
    this._shatterPhase += (this._shatterTarget - this._shatterPhase) * 0.08;
    this.mat.uniforms.uShatterPhase.value = this._shatterPhase;

    if (this._shatterPhase > 0.01) {
      this.mesh.visible = true;
      this.mat.uniforms.uIntensity.value = this._shatterPhase;
    } else {
      this.mesh.visible = false;
    }

    // Billboard
    this.mesh.quaternion.copy(engine.camera.quaternion);

    // Auto-decay
    if (this._shatterTarget > 0) {
      this._shatterTarget -= ctx.dt * 0.5;
      if (this._shatterTarget < 0) this._shatterTarget = 0;
    }
  }

  /** Trigger a shatter effect */
  shatter(intensity = 1.0) {
    this._shatterTarget = intensity;
    this._shatterPhase = 0.01; // kick-start
    this._active = true;
  }

  onStateChange(state, engine) {
    if (state === 'error') {
      this.shatter(1.0);
    }
  }

  onPulse(type, data, engine) {
    if (type === 'error') this.shatter(1.0);
    if (type === 'trade') this.shatter(0.3); // subtle crack on trades
  }

  dispose(engine) {
    if (this.mesh) {
      engine.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mat.dispose();
    }
  }
}
