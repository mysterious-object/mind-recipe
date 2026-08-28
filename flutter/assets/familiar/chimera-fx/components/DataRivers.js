/**
 * DataRivers — Flowing streams of data particles that represent information flow.
 *
 * Technique: InstancedMesh with custom vertex shader computing Bezier curves.
 * Each "river" is a parametric curve with particles flowing along it.
 * Rivers activate during AI streaming state, showing tokens flowing in.
 *
 * Inspired by: audio visualizers, fiber optic bundles, neural pathway diagrams.
 */

import * as THREE from '../../three.module.min.js';

const RIVER_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uFlowSpeed;
  uniform vec3 uCurveStart;
  uniform vec3 uCurveEnd;
  uniform vec3 uCurveControl;

  attribute float aPhase;     // 0..1 position along river
  attribute float aLane;      // offset from center
  attribute float aSpeed;     // individual speed variation
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  // Quadratic Bezier
  vec3 bezier(vec3 a, vec3 b, vec3 c, float t) {
    float t1 = 1.0 - t;
    return t1 * t1 * a + 2.0 * t1 * t * b + t * t * c;
  }

  vec3 bezierDerivative(vec3 a, vec3 b, vec3 c, float t) {
    return 2.0 * (1.0 - t) * (b - a) + 2.0 * t * (c - b);
  }

  void main() {
    float speed = uFlowSpeed * (0.8 + aSpeed * 0.4);
    float phase = fract(aPhase + uTime * speed * 0.1);

    // Position on curve
    vec3 pos = bezier(uCurveStart, uCurveControl, uCurveEnd, phase);

    // Normal offset for lane spacing
    vec3 tangent = normalize(bezierDerivative(uCurveStart, uCurveControl, uCurveEnd, phase));
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 normal = normalize(cross(tangent, up));
    pos += normal * aLane * 0.3;

    // Pulse effect — particles bunch up and spread
    float pulse = sin(phase * 6.28318 + uTime * 3.0) * 0.2 * uIntensity;
    pos += tangent * pulse;

    // Fade at endpoints
    float edgeFade = smoothstep(0.0, 0.1, phase) * smoothstep(1.0, 0.9, phase);
    vAlpha = edgeFade * (0.3 + uIntensity * 0.7);
    vColor = aColor * (0.6 + uIntensity * 0.4);

    // Size based on intensity
    float size = 2.0 + uIntensity * 3.0;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (200.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const RIVER_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
    if (alpha < 0.01) discard;

    // Bright core + soft halo
    float core = smoothstep(0.3, 0.0, dist);
    vec3 col = mix(vColor, vec3(1.0), core * 0.5);

    gl_FragColor = vec4(col, alpha);
  }
`;

export class DataRivers {
  constructor(opts = {}) {
    this.riverCount = opts.rivers || 4;
    this.particlesPerRiver = opts.particles || 300;
    this.rivers = [];
  }

  init(engine) {
    const colors = engine.theme?.riverColors || [
      [0.345, 0.651, 1.0],
      [0.737, 0.549, 1.0],
      [0.247, 0.725, 0.314],
    ];

    for (let r = 0; r < this.riverCount; r++) {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(this.particlesPerRiver * 3);
      const phases = new Float32Array(this.particlesPerRiver);
      const lanes = new Float32Array(this.particlesPerRiver);
      const speeds = new Float32Array(this.particlesPerRiver);
      const pColors = new Float32Array(this.particlesPerRiver * 3);

      const col = colors[r % colors.length];
      for (let i = 0; i < this.particlesPerRiver; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        phases[i] = Math.random();
        lanes[i] = (Math.random() - 0.5) * 4;
        speeds[i] = Math.random();
        pColors[i * 3] = col[0] + (Math.random() - 0.5) * 0.1;
        pColors[i * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.1;
        pColors[i * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.1;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
      geo.setAttribute('aLane', new THREE.BufferAttribute(lanes, 1));
      geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
      geo.setAttribute('aColor', new THREE.BufferAttribute(pColors, 3));

      // Random Bezier curves arcing across the scene
      const angle = (r / this.riverCount) * Math.PI * 2;
      const radius = 20 + Math.random() * 10;
      const start = new THREE.Vector3(
        Math.cos(angle) * radius,
        -10 + Math.random() * 5,
        -5 + Math.random() * 10
      );
      const end = new THREE.Vector3(
        Math.cos(angle + Math.PI * 0.3) * radius * 0.3,
        5 + Math.random() * 10,
        -5 + Math.random() * 10
      );
      const control = new THREE.Vector3(
        (start.x + end.x) * 0.5 + (Math.random() - 0.5) * 15,
        (start.y + end.y) * 0.5 + Math.random() * 10,
        (start.z + end.z) * 0.5
      );

      const mat = new THREE.ShaderMaterial({
        vertexShader: RIVER_VERT,
        fragmentShader: RIVER_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0.3 },
          uFlowSpeed: { value: 1.0 },
          uCurveStart: { value: start },
          uCurveEnd: { value: end },
          uCurveControl: { value: control },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      engine.scene.add(points);
      this.rivers.push({ points, mat, geo });
    }
  }

  update(ctx, engine) {
    const isStreaming = ctx.state === 'streaming' || ctx.state === 'thinking';
    const targetFlow = isStreaming ? 2.5 : 0.5;

    this.rivers.forEach(({ mat }) => {
      mat.uniforms.uTime.value = ctx.elapsed;
      mat.uniforms.uIntensity.value = ctx.intensity;
      // Smooth flow speed transition
      const curr = mat.uniforms.uFlowSpeed.value;
      mat.uniforms.uFlowSpeed.value += (targetFlow - curr) * 0.05;
    });
  }

  dispose(engine) {
    this.rivers.forEach(({ points, mat, geo }) => {
      engine.scene.remove(points);
      geo.dispose();
      mat.dispose();
    });
    this.rivers = [];
  }
}
