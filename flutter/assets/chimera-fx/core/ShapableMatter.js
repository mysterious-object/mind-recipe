/**
 * ShapableMatter — Unified particle engine with 11 swappable matter modes.
 *
 * Architecture:
 *   Single THREE.Points (8000 particles, InstancedBufferGeometry) shared across
 *   all modes. Switching modes swaps the ShaderMaterial only — no geometry
 *   rebuild, no component add/remove.
 *
 * Modes:
 *   fluid       — iridescent soap-bubble blobs with surface tension
 *   crystalline — faceted geometric shards with prismatic refraction
 *   plasma      — high-energy electric tendrils with flicker
 *   ferrofluid  — spike-field ripples with metallic sheen
 *   nebula      — organic curl-noise particle cloud (current default)
 *   cellular    — Voronoi cell boundaries with organic pulse
 *   electric    — branching lightning bolts with white-hot cores
 *   superfluid  — frictionless liquid waves with quantized rings
 *   ionstorm    — charged ion cores with plasma sheaths
 *   aerogel     — ultra-light porous lattice filaments
 *   photonic    — diffraction rings and interference bands
 *
 * Usage:
 *   engine.addComponent(new ChimeraFX.ShapableMatter());
 *   window.ChimeraFX.setMatterMode('plasma');
 */

import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════
//  SHARED VERTEX SHADER (all modes use the same attribute interface)
//  Each mode provides its own fragment shader + optional vertex variant.
// ═══════════════════════════════════════════════════════════════════════════

const SHARED_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uMouse;
  uniform float uModeParam;

  attribute vec3 aOffset;
  attribute vec3 aVelocity;
  attribute float aLife;
  attribute float aSize;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  // ── 3D curl noise ──
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
    float x = noise3D(p + dy) - noise3D(p - dy) - noise3D(p + dz) + noise3D(p - dz);
    float y = noise3D(p + dz) - noise3D(p - dz) - noise3D(p + dx) + noise3D(p - dx);
    float z = noise3D(p + dx) - noise3D(p - dx) - noise3D(p + dy) + noise3D(p - dy);
    return normalize(vec3(x, y, z)) / (2.0 * e);
  }

  void main() {
    float speed = 0.15 + uIntensity * 0.3;
    vec3 pos = aOffset;
    pos += curlNoise(pos * 0.08 + uTime * speed * 0.1) * uTime * speed * 0.5;

    // Orbital rotation around center
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

    float life = fract(aLife + uTime * 0.02);
    vLife = life;
    vAlpha = sin(life * 3.14159) * (0.25 + uIntensity * 0.75);
    vColor = aColor * (0.5 + uIntensity * 0.5);

    float size = aSize * (1.0 + sin(uTime * 2.0 + aLife * 20.0) * 0.3 * uIntensity);

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (300.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
//  MODE FRAGMENT SHADERS
// ═══════════════════════════════════════════════════════════════════════════

const FRAG_NEBULA = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.1, dist);
    float halo = smoothstep(0.5, 0.0, dist) * 0.3;
    float alpha = (core + halo) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

const FRAG_FLUID = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  void main() {
    float dist = length(gl_PointCoord - 0.5);
    // Soap-bubble iridescence: color shifts over time + distance from center
    float hueShift = fract(vLife + uTime * 0.05 + dist * 2.0);
    vec3 iridescent = vColor + 0.3 * vec3(
      sin(hueShift * 6.28),
      sin(hueShift * 6.28 + 2.09),
      sin(hueShift * 6.28 + 4.18)
    );
    // Soft merging blob with Fresnel edge glow
    float blob = smoothstep(0.5, 0.25, dist);
    float edge = pow(1.0 - dist * 2.0, 3.0) * 0.6;
    float alpha = (blob * 0.8 + edge * 0.4) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(iridescent, alpha);
  }
`;

const FRAG_CRYSTALLINE = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  // Generate a pseudo-random value for faceting
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float angle = atan(uv.y, uv.x);
    // 6-sided crystal facets
    float facet = floor((angle + 3.14159) / 1.0472); // 6 segments
    float facetBright = 0.7 + hash(vec2(facet, vLife)) * 0.3;
    // Sharp diamond-shaped core
    float diamond = 1.0 - abs(uv.x) * 2.0 - abs(uv.y) * 2.0;
    diamond = smoothstep(0.0, 0.15, diamond);
    // Prismatic rainbow on edges
    float edge = smoothstep(0.45, 0.5, length(uv)) - smoothstep(0.5, 0.55, length(uv));
    vec3 prism = vColor * facetBright + edge * vec3(
      sin(uTime * 3.0 + facet) * 0.4,
      sin(uTime * 3.0 + facet + 2.09) * 0.4,
      sin(uTime * 3.0 + facet + 4.18) * 0.4
    );
    float alpha = max(diamond * 0.85, edge * 0.9) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(prism, alpha);
  }
`;

const FRAG_PLASMA = /* glsl */ `
  uniform float uTime;
  uniform float uModeParam;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    // Bright-hot core with fuzzy halo
    float core = exp(-dist * 8.0) * 1.5;
    float halo = exp(-dist * 2.5) * 0.4;
    // Tendril streaks via noise
    float streak = noise(vec2(floor(dist * 12.0) + uTime * 2.0, vLife));
    streak = smoothstep(0.3, 0.7, streak) * (1.0 - dist * 1.2);
    // Fast flicker — 20-30 Hz feel
    float flicker = 0.7 + 0.3 * sin(uTime * 25.0 + vLife * 50.0);
    // Color: white-hot core → colored outer glow
    vec3 plasmaColor = mix(vec3(1.0), vColor, dist * 1.5) * flicker;
    float alpha = (core * 0.9 + halo * 0.5 + streak * 0.6) * vAlpha * flicker;
    if (alpha < 0.005) discard;
    gl_FragColor = vec4(plasmaColor, alpha);
  }
`;

const FRAG_FERROFLUID = /* glsl */ `
  uniform float uTime;
  uniform float uModeParam;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);
    // Concentric ring ripples
    float rings = sin(dist * 20.0 - uTime * 3.0) * 0.5 + 0.5;
    rings *= exp(-dist * 2.0); // rings fade outward
    // Spike vertices at 8 fixed intervals
    float spike = 0.0;
    for (int i = 0; i < 8; i++) {
      float a = float(i) * 0.785; // PI/4 intervals
      float spikeAngle = abs(mod(angle - a + 3.14159, 6.28318) - 3.14159);
      float spikeDist = spikeAngle * 3.0;
      float spikeHeight = uModeParam * 0.5 + 0.5;
      spike += exp(-spikeDist * spikeDist * 15.0) * spikeHeight;
    }
    // Metallic sheen
    float metallic = 0.4 + rings * 0.4 + spike * 0.3;
    vec3 ferroColor = vColor * metallic + vec3(0.2) * spike;
    float alpha = metallic * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(ferroColor, alpha);
  }
`;

const FRAG_CELLULAR = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  vec2 random2(vec2 p) {
    return fract(sin(vec2(
      dot(p, vec2(127.1, 311.7)),
      dot(p, vec2(269.5, 183.3))
    )) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    // Scale UV for larger cells
    vec2 st = gl_PointCoord * 6.0;
    vec2 i = floor(st);
    vec2 f = fract(st);
    // Voronoi: find nearest cell center
    float mDist = 1.0;
    vec2 mPoint = vec2(0.0);
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = random2(i + neighbor);
        point = 0.5 + 0.5 * sin(uTime * 0.3 + 6.28318 * point);
        vec2 diff = neighbor + point - f;
        float d = dot(diff, diff);
        if (d < mDist) {
          mDist = d;
          mPoint = point;
        }
      }
    }
    mDist = sqrt(mDist);
    // Cell boundary as thin glowing line
    float edge = smoothstep(0.0, 0.06, mDist) - smoothstep(0.06, 0.12, mDist);
    // Interior slow gradient
    float interior = (1.0 - smoothstep(0.0, 0.5, mDist)) * 0.3;
    // Organic pulse
    float pulse = 0.7 + 0.3 * sin(uTime * 2.0 + length(mPoint) * 10.0);
    // Circular fade at particle edge
    float fade = 1.0 - smoothstep(0.35, 0.5, dist);
    vec3 cellColor = vColor * (interior + 0.3) + vColor * edge * 1.5 * pulse;
    float alpha = max(edge * 0.9 * pulse, interior * 0.4) * vAlpha * fade;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(cellColor, alpha);
  }
`;

const FRAG_ELECTRIC = /* glsl */ `
  uniform float uTime;
  uniform float uModeParam;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  // Recursive branching bolt via noise displacement
  float bolt(vec2 uv, float t) {
    float d = abs(uv.x);
    // Main branch with sinusoidal displacement
    float y = uv.y;
    float displace = 0.0;
    float amp = 1.0;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      displace += sin(y * freq * 10.0 + t * 15.0 + hash(float(i))) * amp * 0.04;
      amp *= 0.5;
      freq *= 2.0;
    }
    float boltX = displace;
    float boltDist = abs(uv.x - boltX);
    // White-hot core + colored glow
    float core = exp(-boltDist * 80.0);
    float glow = exp(-boltDist * 12.0) * 0.6;
    return core + glow;
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    // Rotate bolt direction based on life
    float angle = vLife * 3.14159 * 2.0 + uTime * 0.5;
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 ruv = rot * uv;
    // Random flash — bright bolt ~every 0.5s
    float flash = step(0.92, hash(vLife * 100.0 + floor(uTime * 2.0)));
    float intensity = bolt(ruv, uTime) * (0.4 + flash * 0.6);
    vec3 boltColor = mix(vec3(1.0, 0.98, 0.9), vColor, 0.5);
    float alpha = intensity * vAlpha * (1.0 - smoothstep(0.3, 0.5, dist));
    if (alpha < 0.005) discard;
    gl_FragColor = vec4(boltColor, alpha);
  }
`;

const FRAG_SUPERFLUID = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);
    float ripple = sin((dist * 34.0) - uTime * 3.2 + vLife * 9.0) * 0.5 + 0.5;
    float phase = sin(angle * 3.0 + uTime * 1.1 + vLife * 5.0) * 0.5 + 0.5;
    float droplet = smoothstep(0.48, 0.18, dist);
    float edge = smoothstep(0.47, 0.40, dist) - smoothstep(0.36, 0.30, dist);
    float vortex = exp(-abs(dist - (0.18 + phase * 0.08)) * 18.0) * 0.35;
    vec3 coldShift = vec3(0.45, 0.85, 1.0);
    vec3 superColor = mix(vColor * coldShift, vec3(0.9, 1.0, 1.0), ripple * 0.35);
    float alpha = (droplet * 0.34 + ripple * edge * 0.8 + vortex) * vAlpha;
    if (alpha < 0.008) discard;
    gl_FragColor = vec4(superColor, alpha);
  }
`;

const FRAG_IONSTORM = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);
    float sheath = exp(-dist * 4.0);
    float core = exp(-dist * 18.0);
    float arc = 0.0;
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float spoke = sin(angle * (3.0 + fi) + uTime * (3.0 + fi) + vLife * 18.0);
      float band = exp(-abs(spoke) * 16.0) * exp(-dist * (4.0 + fi * 0.7));
      arc += band * (0.5 + 0.5 * hash(fi + floor(uTime * 8.0) + vLife * 30.0));
    }
    float flash = step(0.86, hash(floor(uTime * 10.0) + vLife * 99.0));
    vec3 ionColor = mix(vColor, vec3(0.55, 0.95, 1.0), 0.35) + vec3(1.0, 0.25, 0.72) * flash * core;
    float alpha = (sheath * 0.25 + core * 0.85 + arc * 0.35) * vAlpha * (1.0 - smoothstep(0.42, 0.5, dist));
    if (alpha < 0.006) discard;
    gl_FragColor = vec4(ionColor, alpha);
  }
`;

const FRAG_AEROGEL = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    vec2 st = gl_PointCoord * 5.0;
    vec2 cell = fract(st) - 0.5;
    float strandX = exp(-abs(cell.x) * 26.0);
    float strandY = exp(-abs(cell.y) * 26.0);
    float diagonal = exp(-abs(cell.x + cell.y + sin(uTime * 0.4 + vLife * 8.0) * 0.08) * 20.0);
    float node = exp(-length(cell) * 18.0);
    float poreFade = 1.0 - smoothstep(0.36, 0.5, dist);
    float lattice = (strandX + strandY + diagonal * 0.6 + node * 0.7) * poreFade;
    vec3 airColor = mix(vColor * vec3(0.78, 0.95, 1.12), vec3(1.0), node * 0.35);
    float alpha = lattice * 0.18 * vAlpha + node * 0.16 * vAlpha;
    if (alpha < 0.006) discard;
    gl_FragColor = vec4(airColor, alpha);
  }
`;

const FRAG_PHOTONIC = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);
    float rings = sin(dist * 55.0 - uTime * 4.0 + vLife * 12.0) * 0.5 + 0.5;
    float grating = sin((uv.x + uv.y) * 34.0 + uTime * 1.5) * 0.5 + 0.5;
    float star = pow(abs(cos(angle * 6.0 + uTime * 0.6)), 14.0) * (1.0 - smoothstep(0.1, 0.5, dist));
    float lens = smoothstep(0.48, 0.12, dist);
    vec3 prism = vec3(
      0.55 + 0.45 * sin(dist * 22.0 + uTime),
      0.55 + 0.45 * sin(dist * 22.0 + uTime + 2.09),
      0.55 + 0.45 * sin(dist * 22.0 + uTime + 4.18)
    );
    vec3 photonColor = mix(vColor * 0.72, prism, 0.48) + vec3(0.75, 0.88, 1.0) * star * 0.32;
    float alpha = (rings * grating * 0.16 + star * 0.38 + lens * 0.08) * vAlpha * (1.0 - smoothstep(0.42, 0.5, dist));
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(photonColor, alpha);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
//  MODE REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

const MATTER_MODES = {
  nebula: {
    label: 'Nebula',
    icon: '🌌',
    description: 'Organic curl-noise particle cloud — the original default.',
    fragShader: FRAG_NEBULA,
    postfx: null,
    palette: [
      [0.2, 0.4, 1.0],    // deep blue
      [0.6, 0.2, 0.9],    // violet
      [0.1, 0.7, 1.0],    // cyan
      [0.8, 0.3, 0.9],    // magenta
    ],
  },
  fluid: {
    label: 'Fluid',
    icon: '💧',
    description: 'Iridescent soap-bubble blobs with surface tension.',
    fragShader: FRAG_FLUID,
    postfx: { bloomStrength: 0.5, grainIntensity: 0.008 },
    palette: [
      [0.3, 0.9, 1.0],    // aqua
      [0.9, 0.5, 0.8],    // pink
      [0.5, 1.0, 0.6],    // mint
      [1.0, 0.85, 0.4],   // gold
    ],
  },
  crystalline: {
    label: 'Crystalline',
    icon: '💎',
    description: 'Faceted geometric shards with prismatic rainbow edges.',
    fragShader: FRAG_CRYSTALLINE,
    postfx: { bloomStrength: 0.35, grainIntensity: 0.005 },
    palette: [
      [0.85, 0.95, 1.0],  // ice white
      [0.5, 0.8, 1.0],    // sky blue
      [0.9, 0.9, 1.0],    // silver
      [0.3, 0.6, 0.95],   // sapphire
    ],
  },
  plasma: {
    label: 'Plasma',
    icon: '⚡',
    description: 'High-energy electric tendrils with fast flicker.',
    fragShader: FRAG_PLASMA,
    postfx: { bloomStrength: 0.9, grainIntensity: 0.012 },
    palette: [
      [1.0, 0.4, 0.0],    // orange
      [1.0, 0.1, 0.1],    // red
      [1.0, 0.8, 0.0],    // yellow
      [1.0, 0.6, 0.2],    // amber
    ],
  },
  ferrofluid: {
    label: 'Ferrofluid',
    icon: '🧲',
    description: 'Spike-field surface ripples with metallic sheen.',
    fragShader: FRAG_FERROFLUID,
    postfx: { bloomStrength: 0.45, grainIntensity: 0.01 },
    palette: [
      [0.7, 0.7, 0.75],   // silver
      [0.3, 0.3, 0.35],   // gunmetal
      [0.9, 0.9, 0.95],   // bright silver
      [0.5, 0.5, 0.55],   // steel
    ],
  },
  cellular: {
    label: 'Cellular',
    icon: '🫧',
    description: 'Voronoi cell membranes with organic pulsing.',
    fragShader: FRAG_CELLULAR,
    postfx: { bloomStrength: 0.3, grainIntensity: 0.006 },
    palette: [
      [0.1, 0.9, 0.5],    // bio green
      [0.0, 0.7, 0.6],    // teal
      [0.2, 1.0, 0.4],    // neon green
      [0.0, 0.5, 0.4],    // deep teal
    ],
  },
  electric: {
    label: 'Electric Arcs',
    icon: '🌩️',
    description: 'Branching lightning bolts with white-hot cores.',
    fragShader: FRAG_ELECTRIC,
    postfx: { bloomStrength: 0.7, grainIntensity: 0.015 },
    palette: [
      [0.8, 0.95, 1.0],   // white-cyan
      [0.0, 0.8, 1.0],    // electric blue
      [0.9, 0.9, 1.0],    // white
      [0.2, 0.5, 1.0],    // blue
    ],
  },
  superfluid: {
    label: 'Superfluid',
    icon: 'S',
    description: 'Frictionless liquid waves with quantized ripple rings.',
    fragShader: FRAG_SUPERFLUID,
    postfx: { bloomStrength: 0.52, grainIntensity: 0.005 },
    palette: [
      [0.38, 0.86, 1.0],
      [0.72, 0.95, 1.0],
      [0.48, 0.60, 1.0],
      [0.92, 1.0, 0.98],
    ],
  },
  ionstorm: {
    label: 'Ion Storm',
    icon: 'I',
    description: 'Charged ion cores with flickering plasma sheaths.',
    fragShader: FRAG_IONSTORM,
    postfx: { bloomStrength: 0.74, grainIntensity: 0.014 },
    palette: [
      [1.0, 0.28, 0.56],
      [0.36, 0.92, 1.0],
      [1.0, 0.72, 0.22],
      [0.72, 0.38, 1.0],
    ],
  },
  aerogel: {
    label: 'Aerogel',
    icon: 'A',
    description: 'Ultra-light porous lattice filaments suspended in air.',
    fragShader: FRAG_AEROGEL,
    postfx: { bloomStrength: 0.38, grainIntensity: 0.004 },
    palette: [
      [0.74, 0.94, 1.0],
      [0.92, 0.98, 1.0],
      [0.68, 1.0, 0.86],
      [0.78, 0.72, 1.0],
    ],
  },
  photonic: {
    label: 'Photonic',
    icon: 'P',
    description: 'Diffracted light matter with interference bands and star lenses.',
    fragShader: FRAG_PHOTONIC,
    postfx: { bloomStrength: 0.42, grainIntensity: 0.006 },
    palette: [
      [0.55, 0.95, 1.0],
      [1.0, 0.46, 0.78],
      [0.82, 0.74, 1.0],
      [1.0, 0.92, 0.42],
    ],
  },
};

const DEFAULT_MODE = 'nebula';

// ═══════════════════════════════════════════════════════════════════════════
//  SHAPABLE MATTER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export class ShapableMatter {
  constructor(opts = {}) {
    this.count = opts.count || 12000;
    this.spread = opts.spread || 25;
    this.mesh = null;
    this.material = null;
    this._currentMode = opts.mode || DEFAULT_MODE;
    this._engine = null;
  }

  /** Build the shared particle geometry and initial material. */
  init(engine) {
    this._engine = engine;
    const geo = new THREE.BufferGeometry();

    // One real point per particle. THREE.Points does not expand
    // InstancedBufferAttribute data, so every attribute must have
    // this.count entries for matter modes to be visibly distinct.
    const positions = new Float32Array(this.count * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Instanced per-particle attributes
    const offsets = new Float32Array(this.count * 3);
    const velocities = new Float32Array(this.count * 3);
    const lives = new Float32Array(this.count);
    const sizes = new Float32Array(this.count);
    const colors = new Float32Array(this.count * 3);

    const modePalette = MATTER_MODES[this._currentMode]?.palette;
    const palette = engine.theme?.particleColors || modePalette || [
      [0.345, 0.651, 1.0],      // cyan
      [0.737, 0.549, 1.0],      // purple
      [0.247, 0.725, 0.314],    // green
      [1.0, 0.596, 0.0],        // orange
      [1.0, 0.2, 0.2],          // red
      [1.0, 1.0, 1.0],          // white
    ];

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.5) * this.spread;

      offsets[i3]     = r * Math.sin(phi) * Math.cos(theta);
      offsets[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      offsets[i3 + 2] = r * Math.cos(phi);

      velocities[i3]     = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;

      lives[i]  = Math.random();
      sizes[i]  = 2.0 + Math.random() * 8.0;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3]     = col[0];
      colors[i3 + 1] = col[1];
      colors[i3 + 2] = col[2];
    }

    geo.setAttribute('aOffset',   new THREE.BufferAttribute(offsets, 3));
    geo.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3));
    geo.setAttribute('aLife',     new THREE.BufferAttribute(lives, 1));
    geo.setAttribute('aSize',     new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aColor',    new THREE.BufferAttribute(colors, 3));

    // Build the initial material for the starting mode
    this._buildMaterial(this._currentMode);

    this.mesh = new THREE.Points(geo, this.material);
    this.mesh.frustumCulled = false;

    engine.scene.add(this.mesh);

    // Read stored mode preference
    try {
      const stored = localStorage.getItem('chimera-matter-mode');
      if (stored && MATTER_MODES[stored]) {
        this.setMatterMode(stored);
      }
    } catch (_) {}
  }

  /** Create (or rebuild) the ShaderMaterial for the given mode. */
  _buildMaterial(modeName) {
    const mode = MATTER_MODES[modeName];
    if (!mode) {
      console.warn('ShapableMatter: unknown mode', modeName);
      return;
    }

    if (this.material) this.material.dispose();

    this.material = new THREE.ShaderMaterial({
      vertexShader: SHARED_VERT,
      fragmentShader: mode.fragShader,
      uniforms: {
        uTime:      { value: 0 },
        uIntensity: { value: 0.8 },
        uMouse:     { value: new THREE.Vector2() },
        uModeParam: { value: 0.5 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // If the mesh exists already (re-switching modes), splice in the new material
    if (this.mesh) {
      this.mesh.material = this.material;
    }

    // Apply mode-specific postfx overrides
    if (mode.postfx && this._engine) {
      const pf = mode.postfx;
      const target = this._engine._targetState || {};
      if (pf.bloomStrength != null) {
        this._engine.bloomPass.strength = pf.bloomStrength;
        if (target.bloomStrength != null) target.bloomStrength = pf.bloomStrength;
      }
      if (pf.grainIntensity != null) {
        this._engine.grainPass.uniforms.uIntensity.value = pf.grainIntensity;
        if (target.grainIntensity != null) target.grainIntensity = pf.grainIntensity;
      }
    }
  }

  /** Re-color particles from a palette (used on mode or theme change). */
  _recolorParticles(palette) {
    if (!this.mesh || !palette || !palette.length) return;
    const colors = this.mesh.geometry.attributes.aColor.array;
    for (let i = 0; i < this.count; i++) {
      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = col[0];
      colors[i * 3 + 1] = col[1];
      colors[i * 3 + 2] = col[2];
    }
    this.mesh.geometry.attributes.aColor.needsUpdate = true;
  }

  /** Switch to a different matter mode instantly. */
  setMatterMode(name) {
    if (!MATTER_MODES[name]) {
      console.warn('ShapableMatter: unknown mode', name, '— valid:', Object.keys(MATTER_MODES));
      return;
    }
    if (name === this._currentMode) {
      console.log('[ShapableMatter] mode already', name, '— skipping');
      return;
    }
    this._currentMode = name;
    this._buildMaterial(name);
    // Immediately update particle colors to the mode's signature palette
    const modePalette = MATTER_MODES[name]?.palette;
    if (modePalette) this._recolorParticles(modePalette);
    console.log('[ShapableMatter] mode + colors updated:', name);
    try { localStorage.setItem('chimera-matter-mode', name); } catch (_) {}
  }

  /** Return the currently active mode name. */
  getMatterMode() {
    return this._currentMode;
  }

  /** List all registered mode names. */
  static getModes() {
    return Object.keys(MATTER_MODES);
  }

  /** Get metadata for a mode. */
  static getModeInfo(name) {
    return MATTER_MODES[name] || null;
  }

  /** Per-frame update from the engine render loop. */
  update(ctx, engine) {
    if (!this.material) return;
    this.material.uniforms.uTime.value = ctx.elapsed;
    this.material.uniforms.uIntensity.value = ctx.intensity;
    this.material.uniforms.uMouse.value.copy(ctx.mouseNDC);
    // uModeParam inherited from last _buildMaterial (constant for the mode lifetime)
  }

  onStateChange(_state, _engine) {}
  onPulse(_type, _data, _engine) {}
  onThemeChange(theme, _engine) {
    if (theme?.particleColors) {
      this._recolorParticles(theme.particleColors);
    }
  }

  dispose(engine) {
    if (this.mesh) {
      engine.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
    }
    if (this.material) this.material.dispose();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  WINDOW API
// ═══════════════════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.ChimeraFX = window.ChimeraFX || {};
  window.ChimeraFX.ShapableMatter = ShapableMatter;
  window.ChimeraFX.MATTER_MODES = MATTER_MODES;

  /** Switch the active matter mode. Callable from app.js UI. */
  window.ChimeraFX.setMatterMode = function (name) {
    const engine = window._chimeraFX;
    if (!engine) return;
    // Find the ShapableMatter component
    const matter = engine.components.find(c => c instanceof ShapableMatter);
    if (matter) {
      matter.setMatterMode(name);
    }
  };

  /** Get the current matter mode name. */
  window.ChimeraFX.getMatterMode = function () {
    const engine = window._chimeraFX;
    if (!engine) return null;
    const matter = engine.components.find(c => c instanceof ShapableMatter);
    return matter ? matter.getMatterMode() : null;
  };

  /** List all available matter mode names. */
  window.ChimeraFX.getMatterModes = function () {
    return Object.keys(MATTER_MODES);
  };

  /** Metadata for a specific mode. */
  window.ChimeraFX.getMatterModeInfo = function (name) {
    return MATTER_MODES[name] || null;
  };
}
