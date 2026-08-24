#include <flutter/runtime_effect.glsl>

uniform vec2 uSize;
uniform float uTime;
uniform float uProgress;
uniform float uDark;
uniform float uVariant; // 0 field · 1 nebula · 2 rivers · 3 tendrils · 4 orbs · 5 lattice · 6 void · 7 prism · 8 aurora · 9 ember · 10 ocean · 11 twilight
uniform float uTiltX; // smoothed device roll  -1..1
uniform float uTiltY; // smoothed device pitch -1..1

out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  // Device-tilt parallax: the whole field slides against the motion.
  vec2 tilt = vec2(uTiltX, -uTiltY);
  vec2 uv = FlutterFragCoord().xy / uSize + tilt * 0.055;
  vec2 centered = uv - 0.5;
  centered.x *= uSize.x / uSize.y;

  // Tilting the phone adds energy — the field brightens and speeds up.
  float tiltEnergy = min(1.0, abs(uTiltX) + abs(uTiltY));
  float t = uTime * (0.16 + tiltEnergy * 0.10) + uProgress * 0.7;
  int variant = int(uVariant + 0.5);

  float organic = noise(uv * 4.0 + vec2(t, -t * 0.7));
  organic += noise(uv * 8.0 - vec2(t * 0.6, t)) * 0.5;

  vec3 teal = vec3(0.0, 0.898, 0.80);
  vec3 green = vec3(0.0, 0.902, 0.541);
  vec3 violet = vec3(0.486, 0.227, 0.929);
  vec3 amber = vec3(0.96, 0.65, 0.14);
  vec3 deepBlue = vec3(0.0, 0.43, 0.57);
  vec3 nightViolet = vec3(0.27, 0.28, 0.64);

  float strength = 0.0;
  vec3 color = mix(teal, violet, clamp(uv.x + organic * 0.22, 0.0, 1.0));

  if (variant == 0) {
    // field — original: two rivers, drifting orb, breathing lattice
    float riverY = 0.36 + sin(uv.x * 7.0 + t * 2.0) * 0.055;
    float river = 1.0 - smoothstep(0.003, 0.018, abs(uv.y - riverY));
    float riverY2 = 0.69 + sin(uv.x * 5.3 - t * 1.4) * 0.075;
    float river2 = 1.0 - smoothstep(0.003, 0.014, abs(uv.y - riverY2));
    vec2 orbCenter = vec2(0.72 + sin(t) * 0.08, 0.19 + cos(t * 0.8) * 0.035);
    float orb = exp(-pow(distance(uv, orbCenter), 2.0) * 34.0);
    float lattice = sin((centered.x + centered.y) * 28.0 + t * 3.0)
        * sin((centered.x - centered.y) * 23.0 - t * 2.0);
    lattice = smoothstep(0.92, 1.0, lattice) * smoothstep(0.30, 0.85, organic);
    color = mix(color, green, river2 * 0.62 + orb * 0.22);
    strength = organic * 0.045 + river * 0.28 + river2 * 0.16 + orb * 0.15 + lattice * 0.10;
  } else if (variant == 1) {
    // nebula — slow turbulent multi-octave clouds
    float clouds = noise(uv * 2.2 + vec2(t * 0.35, -t * 0.22));
    clouds += noise(uv * 5.0 - vec2(t * 0.18, t * 0.30)) * 0.6;
    clouds += noise(uv * 11.0 + vec2(t * 0.5, 0.0)) * 0.25;
    color = mix(violet, teal, clouds * 0.8);
    color = mix(color, green, smoothstep(0.55, 0.95, clouds) * 0.5);
    strength = pow(clouds, 1.6) * 0.34;
  } else if (variant == 2) {
    // rivers — five parallel flowing streams
    float flow = 0.0;
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float y = 0.14 + fi * 0.17 + sin(uv.x * (4.0 + fi) + t * (1.4 + fi * 0.35)) * 0.045;
      flow += (1.0 - smoothstep(0.002, 0.011, abs(uv.y - y))) * (0.75 - fi * 0.09);
    }
    color = mix(deepBlue, teal, uv.y);
    strength = flow * 0.30 + organic * 0.02;
  } else if (variant == 3) {
    // tendrils — curling horizontal filaments
    float fil = 0.0;
    vec2 p = centered * 3.0;
    for (int i = 0; i < 4; i++) {
      float fi = float(i);
      float wave = sin(p.x * (1.6 + fi * 0.5) + t * (1.1 + fi * 0.4) + fi * 1.7);
      fil += 1.0 - smoothstep(0.0, 0.16 + fi * 0.05, abs(p.y * (0.55 + fi * 0.14) - wave * 0.5));
    }
    color = mix(green, teal, clamp(uv.y + 0.2, 0.0, 1.0));
    strength = fil * 0.10 + organic * 0.02;
  } else if (variant == 4) {
    // orbs — three drifting glow spheres
    float glow = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      vec2 c = vec2(
        0.5 + sin(t * (0.5 + fi * 0.22) + fi * 2.1) * 0.3,
        0.5 + cos(t * (0.42 + fi * 0.18) + fi * 1.3) * 0.26
      );
      glow += exp(-pow(distance(uv, c), 2.0) * (22.0 + fi * 10.0));
    }
    color = mix(violet, teal, glow);
    strength = glow * 0.22;
  } else if (variant == 5) {
    // lattice — breathing grid with travelling pulse
    float g1 = sin((centered.x + t * 0.6) * 24.0);
    float g2 = sin((centered.y - t * 0.45) * 20.0);
    float grid = smoothstep(0.94, 1.0, g1 * g2);
    float pulse = 0.5 + 0.5 * sin(t * 1.4 + (centered.x + centered.y) * 3.0);
    color = mix(deepBlue, teal, pulse);
    strength = grid * (0.10 + pulse * 0.10);
  } else if (variant == 6) {
    // void — near stillness, slow breath
    float vign = exp(-pow(distance(centered, vec2(0.0)), 2.0) * 3.2);
    float breath = 0.5 + 0.5 * sin(t * 0.5);
    color = mix(vec3(0.02), teal, vign * breath * 0.5);
    strength = vign * breath * 0.05 + organic * 0.008;
  } else if (variant == 7) {
    // prism — rotating refracted bands with a bright core
    float ang = atan(centered.y, centered.x);
    float bands = sin(ang * 9.0 + t * 1.8) * 0.5 + 0.5;
    bands *= smoothstep(0.15, 0.75, distance(centered, vec2(0.0)));
    float core = exp(-pow(distance(uv, vec2(0.5, 0.5)), 2.0) * 10.0);
    vec3 rainbow = mix(mix(teal, green, bands), violet, bands * bands);
    color = mix(rainbow, teal, core * 0.4);
    strength = bands * 0.16 + core * 0.12;
  } else if (variant == 8) {
    // aurora — three swaying vertical curtains
    float curt = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float x = 0.28 + fi * 0.22 + sin(uv.y * 3.2 + t * (0.9 + fi * 0.3) + fi * 2.0) * 0.09;
      curt += (1.0 - smoothstep(0.0, 0.09, abs(uv.x - x))) * (1.0 - uv.y * 0.55) * (0.8 - fi * 0.16);
    }
    color = mix(nightViolet, teal, uv.y);
    color = mix(color, green, curt * 0.5);
    strength = curt * 0.24;
  } else if (variant == 9) {
    // ember — sparks rising with flicker
    float sparks = 0.0;
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      float yy = fract(uv.y + t * (0.05 + fi * 0.017) + fi * 0.37);
      float xx = 0.12 + fi * 0.15 + sin(t * (0.8 + fi * 0.3) + fi) * 0.05;
      sparks += exp(-pow(distance(vec2(uv.x, yy), vec2(xx, 0.15)), 2.0) * 260.0);
    }
    color = mix(amber, vec3(0.64, 0.26, 0.07), uv.y);
    strength = sparks * 0.20 + organic * 0.012;
  } else if (variant == 10) {
    // ocean — four rolling swells plus surface noise
    float swell = 0.0;
    for (int i = 0; i < 4; i++) {
      float fi = float(i);
      float y = 0.2 + fi * 0.18 + sin(uv.x * (3.2 + fi) - t * (1.0 + fi * 0.28)) * 0.035;
      swell += 1.0 - smoothstep(0.004, 0.02, abs(uv.y - y));
    }
    color = mix(deepBlue, teal, uv.y);
    strength = swell * 0.16 + noise(uv * 6.0 + vec2(t * 0.4, 0.0)) * 0.02;
  } else {
    // twilight — twinkling star field on deep violet
    vec2 cell = floor(uv * 26.0);
    vec2 f = fract(uv * 26.0);
    float h = hash(cell);
    vec2 starPos = vec2(hash(cell + 1.3), hash(cell + 2.7));
    float d = distance(f, starPos);
    float tw = 0.5 + 0.5 * sin(t * 2.4 + h * 40.0);
    float stars = (1.0 - smoothstep(0.0, 0.08, d)) * step(0.82, h) * tw;
    color = mix(nightViolet * 0.5, vec3(0.02), uv.y);
    strength = stars * 0.30 + organic * 0.008;
  }

  // Fine sparkle so the field always shimmers, boosted by device motion.
  float shimmer = pow(noise(uv * 22.0 + vec2(t * 2.1, -t * 1.3)), 6.0);
  strength += shimmer * (0.05 + tiltEnergy * 0.10);

  // Tilting the phone makes the whole field glow brighter and feel alive.
  strength *= 1.0 + tiltEnergy * 0.55;
  strength *= mix(0.48, 1.0, uDark);
  fragColor = vec4(color * strength, strength);
}
