/**
 * IridescentOrb — Holographic sphere with thin-film interference and Fresnel.
 *
 * Technique: SDF sphere ray-marched with:
 *   - Thin-film iridescence (view-angle → rainbow hue mapping)
 *   - Fresnel rim glow
 *   - Animated surface displacement via FBM noise
 *   - Environment reflection (fake cubemap)
 *   - Pulsing breathing animation tied to AI state
 *
 * Research source: DerSchmale thin-film, 4rknova foil, Three.js Journey hologram.
 * Inspired by: Soap bubbles, oil slicks, holographic foil, crystal balls.
 */

import * as THREE from 'three';

const ORB_FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uBaseColor;
  uniform float uIridescenceStrength;
  uniform float uFresnelPower;
  uniform float uBreathingSpeed;
  uniform float uNoiseScale;

  varying vec2 vUv;

  // ── Noise ──
  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p), f = fract(p);
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

  float fbm3(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise3(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  // ── SDF sphere with noise displacement ──
  float sdSphere(vec3 p, float r) {
    return length(p) - r;
  }

  float scene(vec3 p) {
    float t = uTime * uBreathingSpeed;

    // Breathing animation
    float breathing = 1.0 + sin(t) * 0.05 * uIntensity;

    // Surface noise displacement
    float disp = fbm3(p * uNoiseScale + t * 0.3) * 0.15 * uIntensity;

    return sdSphere(p, 1.5 * breathing) + disp;
  }

  vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
      scene(p + e.xyy) - scene(p - e.xyy),
      scene(p + e.yxy) - scene(p - e.yxy),
      scene(p + e.yyx) - scene(p - e.yyx)
    ));
  }

  // ── Thin-film iridescence ──
  vec3 iridescence(float cosTheta, float thickness) {
    // Map viewing angle to spectral color via thin-film interference
    float phase = cosTheta * thickness;
    return 0.5 + 0.5 * cos(6.28318 * (phase * vec3(1.0, 0.8, 0.6) + vec3(0.0, 0.1, 0.2)));
  }

  // ── Fake environment ──
  vec3 envMap(vec3 dir, float t) {
    vec3 col = vec3(0.02);
    // Subtle gradient
    col += uBaseColor * 0.1 * (dir.y * 0.5 + 0.5);
    // Fake light sources
    float sun = pow(max(dot(dir, normalize(vec3(1.0, 1.0, 0.5))), 0.0), 32.0);
    col += vec3(1.0) * sun * 0.3;
    // Animated scan lines in reflection
    col += uBaseColor * 0.05 * step(0.97, fract(dir.y * 20.0 + t * 0.5));
    return col;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - uResolution * 0.5) / min(uResolution.x, uResolution.y);

    // Camera
    vec3 ro = vec3(0.0, 0.0, 4.0);
    vec3 rd = normalize(vec3(uv, -1.5));

    // Mouse parallax on camera
    ro.xy += uMouse * 0.3;

    // ── Ray march ──
    float totalDist = 0.0;
    float hit = 0.0;
    vec3 p;

    for (int i = 0; i < 64; i++) {
      p = ro + rd * totalDist;
      float d = scene(p);
      if (d < 0.001) { hit = 1.0; break; }
      if (totalDist > 10.0) break;
      totalDist += d;
    }

    vec4 color = vec4(0.0);

    if (hit > 0.5) {
      vec3 normal = calcNormal(p);
      vec3 viewDir = normalize(ro - p);
      float cosTheta = max(dot(normal, viewDir), 0.0);

      // ── Fresnel ──
      float fresnel = pow(1.0 - cosTheta, uFresnelPower);

      // ── Thin-film iridescence ──
      float filmThickness = 2.0 + sin(uTime * 0.3) * 0.5;
      vec3 iriColor = iridescence(cosTheta, filmThickness) * uIridescenceStrength;

      // ── Reflection ──
      vec3 reflected = reflect(-viewDir, normal);
      vec3 envColor = envMap(reflected, uTime);

      // ── Specular ──
      vec3 lightDir = normalize(vec3(1.0, 2.0, 2.0));
      vec3 halfVec = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfVec), 0.0), 64.0);

      // ── Combine ──
      vec3 col = vec3(0.0);
      col += uBaseColor * 0.15 * cosTheta;           // diffuse base
      col += iriColor * fresnel;                       // iridescent rim
      col += envColor * (0.3 + fresnel * 0.5);        // reflection
      col += vec3(1.0) * spec * 0.6;                  // specular highlight
      col += uBaseColor * fresnel * 0.4 * uIntensity; // glow rim

      // Subsurface scatter hint
      float sss = pow(max(dot(viewDir, -lightDir), 0.0), 3.0) * 0.15;
      col += uBaseColor * sss;

      float alpha = 0.1 + fresnel * 0.15 + uIntensity * 0.1;
      color = vec4(col, min(alpha, 0.4));
    }

    gl_FragColor = color;
  }
`;

const ORB_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export class IridescentOrb {
  constructor(opts = {}) {
    this.baseColor = opts.color || new THREE.Color(0x58a6ff);
    this.size = opts.size || 8;
    this.mesh = null;
    this.mat = null;
  }

  init(engine) {
    this.mat = new THREE.ShaderMaterial({
      vertexShader: ORB_VERT,
      fragmentShader: ORB_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.3 },
        uResolution: { value: new THREE.Vector2(
          engine.renderer.domElement.width,
          engine.renderer.domElement.height
        ) },
        uMouse: { value: new THREE.Vector2() },
        uBaseColor: { value: this.baseColor },
        uIridescenceStrength: { value: 0.8 },
        uFresnelPower: { value: 3.0 },
        uBreathingSpeed: { value: 0.5 },
        uNoiseScale: { value: 2.0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 500;
    this.mesh.scale.set(this.size, this.size, 1);
    engine.scene.add(this.mesh);
  }

  update(ctx, engine) {
    if (!this.mat) return;
    this.mat.uniforms.uTime.value = ctx.elapsed;
    this.mat.uniforms.uIntensity.value = ctx.intensity;
    this.mat.uniforms.uMouse.value.copy(ctx.mouseNDC);

    // Breathing speed reacts to state
    const speeds = { idle: 0.5, thinking: 1.5, streaming: 1.0, executing: 2.5, error: 0.3, success: 2.0 };
    const target = speeds[ctx.state] || 0.5;
    const curr = this.mat.uniforms.uBreathingSpeed.value;
    this.mat.uniforms.uBreathingSpeed.value += (target - curr) * 0.05;

    // Noise scale reacts too
    const noiseTargets = { idle: 2.0, thinking: 3.5, streaming: 2.5, executing: 5.0, error: 8.0, success: 1.5 };
    const noiseTarget = noiseTargets[ctx.state] || 2.0;
    const noiseCurr = this.mat.uniforms.uNoiseScale.value;
    this.mat.uniforms.uNoiseScale.value += (noiseTarget - noiseCurr) * 0.03;

    // Billboard
    this.mesh.quaternion.copy(engine.camera.quaternion);
  }

  onResize(w, h, engine) {
    if (this.mat) {
      this.mat.uniforms.uResolution.value.set(w, h);
    }
  }

  onThemeChange(theme, engine) {
    if (this.mat && theme.colors) {
      this.mat.uniforms.uBaseColor.value.copy(theme.colors.primary);
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
