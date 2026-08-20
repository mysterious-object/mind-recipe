#include <flutter/runtime_effect.glsl>

uniform vec2 uSize;
uniform float uTime;
uniform float uProgress;
uniform float uDark;

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
  vec2 uv = FlutterFragCoord().xy / uSize;
  vec2 centered = uv - 0.5;
  centered.x *= uSize.x / uSize.y;

  float t = uTime * 0.16 + uProgress * 0.7;
  float organic = noise(uv * 4.0 + vec2(t, -t * 0.7));
  organic += noise(uv * 8.0 - vec2(t * 0.6, t)) * 0.5;

  float riverY = 0.36 + sin(uv.x * 7.0 + t * 2.0) * 0.055;
  float river = 1.0 - smoothstep(0.003, 0.018, abs(uv.y - riverY));
  float riverY2 = 0.69 + sin(uv.x * 5.3 - t * 1.4) * 0.075;
  float river2 = 1.0 - smoothstep(0.003, 0.014, abs(uv.y - riverY2));

  vec2 orbCenter = vec2(0.72 + sin(t) * 0.08, 0.19 + cos(t * 0.8) * 0.035);
  float orbDistance = distance(uv, orbCenter);
  float orb = exp(-orbDistance * orbDistance * 34.0);

  float lattice = sin((centered.x + centered.y) * 28.0 + t * 3.0);
  lattice *= sin((centered.x - centered.y) * 23.0 - t * 2.0);
  lattice = smoothstep(0.92, 1.0, lattice) * smoothstep(0.30, 0.85, organic);

  vec3 teal = vec3(0.0, 0.898, 0.80);
  vec3 green = vec3(0.0, 0.902, 0.541);
  vec3 violet = vec3(0.486, 0.227, 0.929);
  vec3 color = mix(teal, violet, clamp(uv.x + organic * 0.22, 0.0, 1.0));
  color = mix(color, green, river2 * 0.62 + orb * 0.22);

  float strength = organic * 0.045 + river * 0.28 + river2 * 0.16 + orb * 0.15 + lattice * 0.10;
  strength *= mix(0.48, 1.0, uDark);
  fragColor = vec4(color * strength, strength);
}
