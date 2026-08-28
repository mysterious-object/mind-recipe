/**
 * HoloHUD — Holographic heads-up display overlay with scanning lines and data readouts.
 *
 * Technique: Full-screen shader with:
 *   - Horizontal scan lines sweeping downward
 *   - Grid overlay with pulsing intersections
 *   - Corner bracket decorations
 *   - Radial focus reticle that follows mouse
 *   - Data ticker bars along edges
 *
 * Inspired by: Iron Man HUD, Blade Runner interfaces, military HUDs.
 */

import * as THREE from '../../three.module.min.js';

const HUD_FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColor;
  uniform float uScanSpeed;

  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 pos = (uv - 0.5) * aspect;
    float t = uTime;

    vec3 color = vec3(0.0);
    float alpha = 0.0;

    // ── Scan line (sweeping horizontal bar) ──
    float scanY = fract(t * uScanSpeed * 0.05);
    float scanDist = abs(uv.y - scanY);
    float scanLine = smoothstep(0.02, 0.0, scanDist) * 0.4;
    color += uColor * scanLine;
    alpha += scanLine;

    // ── Micro scan lines (CRT-style) ──
    float microLines = step(0.5, fract(uv.y * uResolution.y * 0.25)) * 0.03;
    alpha += microLines * uIntensity;
    color += uColor * microLines * 0.5;

    // ── Grid ──
    float gridSize = 40.0;
    vec2 grid = abs(fract(uv * gridSize) - 0.5);
    float gridLine = smoothstep(0.02, 0.0, min(grid.x, grid.y));
    // Pulse at intersections
    float intersection = smoothstep(0.02, 0.0, grid.x) * smoothstep(0.02, 0.0, grid.y);
    float gridPulse = intersection * (0.5 + 0.5 * sin(t * 2.0 + uv.x * 50.0));
    float gridAlpha = (gridLine * 0.02 + gridPulse * 0.15) * uIntensity;
    color += uColor * gridAlpha;
    alpha += gridAlpha;

    // ── Corner brackets ──
    float cornerSize = 0.06;
    float cornerThick = 0.002;
    float bracket = 0.0;
    // Top-left
    if (uv.x < cornerSize && abs(uv.y - 0.0) < cornerThick) bracket = 1.0;
    if (uv.y < cornerSize && abs(uv.x - 0.0) < cornerThick) bracket = 1.0;
    // Top-right
    if (uv.x > 1.0 - cornerSize && abs(uv.y - 0.0) < cornerThick) bracket = 1.0;
    if (abs(uv.x - 1.0) < cornerThick && uv.y < cornerSize) bracket = 1.0;
    // Bottom-left
    if (uv.x < cornerSize && abs(uv.y - 1.0) < cornerThick) bracket = 1.0;
    if (abs(uv.x - 0.0) < cornerThick && uv.y > 1.0 - cornerSize) bracket = 1.0;
    // Bottom-right
    if (uv.x > 1.0 - cornerSize && abs(uv.y - 1.0) < cornerThick) bracket = 1.0;
    if (abs(uv.x - 1.0) < cornerThick && uv.y > 1.0 - cornerSize) bracket = 1.0;

    color += uColor * bracket * 0.6 * uIntensity;
    alpha += bracket * 0.3 * uIntensity;

    // ── Mouse reticle ──
    vec2 mouseUv = uMouse * 0.5 + 0.5;
    vec2 mPos = (mouseUv - 0.5) * aspect;
    float mouseDist = length(pos - mPos);
    float reticleRing = smoothstep(0.003, 0.0, abs(mouseDist - 0.03));
    float reticleCross = 0.0;
    if (abs(pos.x - mPos.x) < 0.001 && abs(pos.y - mPos.y) < 0.04) reticleCross = 1.0;
    if (abs(pos.y - mPos.y) < 0.001 && abs(pos.x - mPos.x) < 0.04) reticleCross = 1.0;
    float reticle = max(reticleRing, reticleCross * 0.5) * uIntensity;
    color += uColor * reticle * 0.5;
    alpha += reticle * 0.3;

    // ── Edge data tickers ──
    float tickerY = step(0.97, uv.y) + step(uv.y, 0.03);
    float tickerBar = tickerY * step(0.5, fract(uv.x * 100.0 - t * 5.0)) * 0.15;
    color += uColor * tickerBar * uIntensity;
    alpha += tickerBar * uIntensity;

    // Overall fade near edges for vignette
    float vignette = smoothstep(0.0, 0.3, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
    alpha *= mix(1.0, vignette, 0.5);

    // Cap maximum opacity to stay subtle
    alpha = min(alpha, 0.15) * uIntensity;

    gl_FragColor = vec4(color, alpha);
  }
`;

const HUD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export class HoloHUD {
  constructor(opts = {}) {
    this.color = opts.color || new THREE.Color(0x58a6ff);
    this.scanSpeed = opts.scanSpeed || 1.0;
    this.mesh = null;
    this.mat = null;
  }

  init(engine) {
    this.mat = new THREE.ShaderMaterial({
      vertexShader: HUD_VERT,
      fragmentShader: HUD_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.3 },
        uResolution: { value: new THREE.Vector2(
          engine.renderer.domElement.width,
          engine.renderer.domElement.height
        ) },
        uMouse: { value: new THREE.Vector2() },
        uColor: { value: this.color },
        uScanSpeed: { value: this.scanSpeed },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 1000;
    engine.scene.add(this.mesh);
  }

  update(ctx, engine) {
    if (!this.mat) return;
    this.mat.uniforms.uTime.value = ctx.elapsed;
    this.mat.uniforms.uIntensity.value = ctx.intensity * 0.7;
    this.mat.uniforms.uMouse.value.copy(ctx.mouseNDC);

    // Keep in front of camera
    this.mesh.position.copy(engine.camera.position);
    this.mesh.position.z -= 0.5;
    this.mesh.lookAt(engine.camera.position);
  }

  onResize(w, h, engine) {
    if (this.mat) {
      this.mat.uniforms.uResolution.value.set(w, h);
    }
  }

  dispose(engine) {
    if (this.mesh) {
      engine.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mat.dispose();
    }
  }
}
