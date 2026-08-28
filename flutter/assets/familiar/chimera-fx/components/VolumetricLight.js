/**
 * VolumetricLight — God rays / light shafts emanating from a core point.
 *
 * Technique: Full-screen quad with ray marching fragment shader.
 * Samples along view rays through a density field shaped by noise,
 * creating volumetric cones of light. Light source position reacts to mouse.
 *
 * Inspired by: Unreal Engine god rays, Cathedral interior lighting, sci-fi reactor cores.
 */

import * as THREE from '../../three.module.min.js';

const VOLUME_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;
  uniform vec2 uLightPos;     // NDC coordinates of light source
  uniform vec3 uLightColor;
  uniform float uDecay;
  uniform float uDensity;
  uniform float uWeight;
  uniform int uSamples;
  uniform sampler2D tScene;   // scene render target

  varying vec2 vUv;

  // Simple noise for density variation
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }

  void main() {
    vec2 texCoord = vUv;
    vec2 lightPos = uLightPos * 0.5 + 0.5; // NDC to UV
    vec2 deltaTexCoord = (texCoord - lightPos);
    deltaTexCoord *= 1.0 / float(uSamples) * uDensity;

    float illuminationDecay = 1.0;
    vec3 accumColor = vec3(0.0);

    vec2 sampleCoord = texCoord;

    for (int i = 0; i < 64; i++) {
      if (i >= uSamples) break;
      sampleCoord -= deltaTexCoord;

      // Sample scene — use noise to vary density
      float density = noise(sampleCoord * 10.0 + uTime * 0.3) * 0.5 + 0.5;

      // Distance falloff from light source
      float dist = length(sampleCoord - lightPos);
      float falloff = max(0.0, 1.0 - dist * 1.5);
      falloff *= falloff;

      // Accumulate light
      vec3 sample = uLightColor * falloff * density * uWeight * uIntensity;
      sample *= illuminationDecay;
      accumColor += sample;

      illuminationDecay *= uDecay;
    }

    // Radial gradient — stronger near light source
    float radialFade = 1.0 - smoothstep(0.0, 1.0, length(texCoord - lightPos));

    // Subtle pulsing
    float pulse = 0.9 + 0.1 * sin(uTime * 0.5);

    gl_FragColor = vec4(accumColor * radialFade * pulse * 0.12, 1.0);
  }
`;

const VOLUME_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export class VolumetricLight {
  constructor(opts = {}) {
    this.lightColor = opts.color || new THREE.Color(0x58a6ff);
    this.samples = opts.samples || 48;
    this.density = opts.density || 0.8;
    this.decay = opts.decay || 0.96;
    this.weight = opts.weight || 0.4;
    this.mesh = null;
    this.mat = null;
  }

  init(engine) {
    const geo = new THREE.PlaneGeometry(2, 2);

    this.mat = new THREE.ShaderMaterial({
      vertexShader: VOLUME_VERT,
      fragmentShader: VOLUME_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.3 },
        uResolution: { value: new THREE.Vector2(
          engine.renderer.domElement.width,
          engine.renderer.domElement.height
        ) },
        uLightPos: { value: new THREE.Vector2(0, -0.8) }, // bottom center
        uLightColor: { value: this.lightColor },
        uDecay: { value: this.decay },
        uDensity: { value: this.density },
        uWeight: { value: this.weight },
        uSamples: { value: this.samples },
        tScene: { value: null },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Render on a separate scene layer (orthographic overlay)
    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 999;

    // We add it to the main scene but position it to fill the screen
    // (a simpler approach than a separate scene + camera)
    this.mesh.position.z = engine.camera.position.z - 1;
    engine.scene.add(this.mesh);
  }

  update(ctx, engine) {
    if (!this.mat) return;
    this.mat.uniforms.uTime.value = ctx.elapsed;
    this.mat.uniforms.uIntensity.value = ctx.intensity;

    // Light follows mouse slightly
    const mouseInfluence = 0.3;
    const lx = ctx.mouseNDC.x * mouseInfluence;
    const ly = -0.6 + ctx.mouseNDC.y * mouseInfluence * 0.5;
    this.mat.uniforms.uLightPos.value.set(lx, ly);

    // Keep mesh in front of camera
    this.mesh.position.copy(engine.camera.position);
    this.mesh.position.z -= 1;
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
