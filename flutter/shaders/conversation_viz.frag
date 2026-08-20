#include <flutter/runtime_effect.glsl>

uniform vec2 uSize;
uniform float uTime;
uniform float uActivity;    // 0.0 = idle, 1.0 = active (typing/voice/AI thinking)
uniform float uMessageType; // 0.0 = user, 1.0 = AI, 0.5 = system
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

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = FlutterFragCoord().xy / uSize;
  vec2 centered = uv - 0.5;
  centered.x *= uSize.x / uSize.y;

  float t = uTime * 0.12;

  // Base organic flow
  float organic = fbm(uv * 3.0 + vec2(t * 0.5, -t * 0.3));

  // Activity pulse — expands when AI is thinking or voice is active
  float pulse = uActivity * 0.3;
  float pulseWave = sin(length(centered) * 8.0 - t * 4.0) * pulse;
  float pulseGlow = exp(-length(centered) * 3.0) * pulse;

  // Neural network lattice — appears during AI processing
  float lattice = 0.0;
  if (uActivity > 0.3) {
    float latticeX = sin(centered.x * 20.0 + t * 3.0) * sin(centered.y * 20.0 - t * 2.0);
    float latticeY = sin(centered.x * 15.0 - t * 2.5) * sin(centered.y * 18.0 + t * 1.8);
    lattice = smoothstep(0.85, 1.0, latticeX * latticeY) * uActivity * 0.4;
  }

  // Data streams — flowing particles during voice/text input
  float streams = 0.0;
  for (float i = 0.0; i < 3.0; i++) {
    float streamY = 0.2 + i * 0.3;
    float streamX = fract(uv.x * 2.0 + t * (0.8 + i * 0.3) + i * 0.37);
    float stream = smoothstep(0.02, 0.0, abs(uv.y - streamY - sin(streamX * 6.28) * 0.05));
    streams += stream * uActivity * 0.3;
  }

  // Color based on message type
  vec3 userColor = vec3(0.0, 0.6, 0.55);      // Teal — user
  vec3 aiColor = vec3(0.49, 0.23, 0.93);       // Purple — AI
  vec3 systemColor = vec3(0.0, 0.9, 0.54);     // Green — system
  vec3 idleColor = vec3(0.05, 0.05, 0.08);     // Dark — idle

  vec3 baseColor = mix(userColor, aiColor, uMessageType);
  baseColor = mix(baseColor, systemColor, step(0.8, uMessageType));

  // Compose layers
  vec3 color = idleColor;
  color += baseColor * organic * 0.15;
  color += baseColor * pulseGlow * 0.5;
  color += baseColor * pulseWave * 0.1;
  color += vec3(lattice) * baseColor;
  color += baseColor * streams * 0.4;

  // Vignette
  float vignette = 1.0 - length(centered) * 0.8;
  color *= vignette;

  // Dark mode support
  color = mix(color, color * 0.3, uDark);

  float alpha = 0.6 + uActivity * 0.3;
  fragColor = vec4(color, alpha);
}
