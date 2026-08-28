/**
 * LiquidMetal — SDF Ray-marched metaballs that morph and merge.
 *
 * Technique: Full-screen ray marching using Signed Distance Functions.
 * Multiple sphere SDFs smoothly blended (smooth-min), creating mercury-like
 * organic shapes that react to AI state. Sphere positions orbit and pulse.
 *
 * Inspired by: Chrome experiments, mercury drops, T-1000, Shadertoy metaballs.
 */

import * as THREE from 'three';

const METAL_FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  varying vec2 vUv;

  // ── SDF Primitives ──
  float sdSphere(vec3 p, float r) { return length(p) - r; }

  // Smooth minimum for organic blending
  float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * h * k * (1.0 / 6.0);
  }

  // ── Scene SDF ──
  float scene(vec3 p) {
    float t = uTime * 0.5;
    float pulse = 1.0 + uIntensity * 0.5;

    // Main blob
    float d = sdSphere(p, 1.5 * pulse);

    // Orbiting satellites
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float angle = t * (0.3 + fi * 0.1) + fi * 1.2566;
      float radius = 2.5 + sin(t * 0.5 + fi) * 0.5;
      float blobSize = 0.6 + sin(t + fi * 2.0) * 0.2;

      vec3 orbPos = vec3(
        cos(angle) * radius,
        sin(angle * 0.7 + fi) * radius * 0.5,
        sin(angle) * radius
      );

      float satellite = sdSphere(p - orbPos, blobSize * pulse);
      d = smin(d, satellite, 0.8 + uIntensity * 0.4);
    }

    // Mouse-attracted blob
    vec3 mousePos = vec3(uMouse * 3.0, 0.0);
    float mouseSphere = sdSphere(p - mousePos, 0.8);
    d = smin(d, mouseSphere, 1.0);

    return d;
  }

  // ── Normal via central differences ──
  vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
      scene(p + e.xyy) - scene(p - e.xyy),
      scene(p + e.yxy) - scene(p - e.yxy),
      scene(p + e.yyx) - scene(p - e.yyx)
    ));
  }

  // ── Environment map (fake) ──
  vec3 envMap(vec3 dir) {
    float t = uTime * 0.1;
    vec3 col = mix(uColor1 * 0.3, uColor2 * 0.5, dir.y * 0.5 + 0.5);
    col += vec3(0.1) * pow(max(dir.y, 0.0), 4.0);
    // Scanning lines
    col += vec3(0.05) * step(0.98, fract(dir.y * 20.0 + t));
    return col;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - uResolution * 0.5) / min(uResolution.x, uResolution.y);

    // Camera
    vec3 ro = vec3(0.0, 0.0, 6.0);
    vec3 rd = normalize(vec3(uv, -1.5));

    // ── Ray march ──
    float totalDist = 0.0;
    float hit = 0.0;
    vec3 p;

    for (int i = 0; i < 64; i++) {
      p = ro + rd * totalDist;
      float d = scene(p);
      if (d < 0.001) { hit = 1.0; break; }
      if (totalDist > 20.0) break;
      totalDist += d;
    }

    vec3 color = vec3(0.0);

    if (hit > 0.5) {
      vec3 normal = calcNormal(p);

      // Fresnel — edge glow
      float fresnel = pow(1.0 - max(dot(normal, -rd), 0.0), 3.0);

      // Reflection
      vec3 ref = reflect(rd, normal);
      vec3 envColor = envMap(ref);

      // Iridescent color shift based on normal angle
      float iridescence = dot(normal, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5;
      vec3 iriColor = mix(uColor1, uColor2, iridescence);

      // Specular
      vec3 lightDir = normalize(vec3(1.0, 2.0, 3.0));
      float spec = pow(max(dot(ref, lightDir), 0.0), 32.0);

      color = envColor * 0.6 + iriColor * fresnel * 0.8 + vec3(spec * 0.5);

      // Rim lighting
      color += uColor1 * fresnel * 0.3 * uIntensity;
    }

    // Soft fade
    float alpha = hit * (0.08 + uIntensity * 0.15);

    gl_FragColor = vec4(color, alpha);
  }
`;

const METAL_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export class LiquidMetal {
  constructor(opts = {}) {
    this.color1 = opts.color1 || new THREE.Color(0x58a6ff);
    this.color2 = opts.color2 || new THREE.Color(0xbc8cff);
    this.mesh = null;
    this.mat = null;
    this.visible = true;
  }

  init(engine) {
    const geo = new THREE.PlaneGeometry(2, 2);

    this.mat = new THREE.ShaderMaterial({
      vertexShader: METAL_VERT,
      fragmentShader: METAL_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.3 },
        uResolution: { value: new THREE.Vector2(
          engine.renderer.domElement.width,
          engine.renderer.domElement.height
        ) },
        uMouse: { value: new THREE.Vector2() },
        uColor1: { value: this.color1 },
        uColor2: { value: this.color2 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 100;

    // Position in scene
    this.mesh.position.set(0, 0, 0);
    this.mesh.scale.set(10, 10, 1);
    engine.scene.add(this.mesh);
  }

  update(ctx, engine) {
    if (!this.mat) return;
    this.mat.uniforms.uTime.value = ctx.elapsed;
    this.mat.uniforms.uIntensity.value = ctx.intensity;
    this.mat.uniforms.uMouse.value.copy(ctx.mouseNDC);

    // Billboard — always face camera
    this.mesh.quaternion.copy(engine.camera.quaternion);
  }

  onResize(w, h, engine) {
    if (this.mat) {
      this.mat.uniforms.uResolution.value.set(w, h);
    }
  }

  onThemeChange(theme, engine) {
    if (this.mat && theme.metalColors) {
      this.mat.uniforms.uColor1.value.set(theme.metalColors[0]);
      this.mat.uniforms.uColor2.value.set(theme.metalColors[1]);
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
