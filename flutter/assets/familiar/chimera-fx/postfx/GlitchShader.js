/**
 * Glitch Shader — Digital corruption / scan-line distortion.
 * Activated on AI error states. Combines:
 *   - Horizontal scan-line displacement
 *   - Block-based RGB shift
 *   - Noise injection
 *   - Temporal flickering
 */
export const GlitchShader = {
  name: 'Glitch',
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uIntensity: { value: 0.0 },
    uResolution: { value: [1920, 1080] },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uIntensity;
    uniform vec2 uResolution;
    varying vec2 vUv;

    float hash(float n) { return fract(sin(n) * 43758.5453); }

    float blockNoise(vec2 uv, float blockSize) {
      vec2 block = floor(uv * blockSize);
      return hash(block.x + block.y * 337.0 + floor(uTime * 8.0) * 1777.0);
    }

    void main() {
      vec2 uv = vUv;
      float intensity = uIntensity;

      // ── Scan-line displacement ──
      float scanLine = step(0.98, hash(floor(uv.y * 200.0) + uTime * 17.0));
      uv.x += scanLine * (hash(uTime * 3.0 + uv.y) - 0.5) * 0.08 * intensity;

      // ── Block displacement ──
      float blockVal = blockNoise(uv, 8.0);
      float blockActive = step(0.92, blockVal) * intensity;
      uv.x += blockActive * (hash(blockVal * 100.0 + uTime) - 0.5) * 0.1;

      // ── RGB channel separation ──
      float shift = intensity * 0.01;
      vec4 cr = texture2D(tDiffuse, uv + vec2(shift, 0.0));
      vec4 cg = texture2D(tDiffuse, uv);
      vec4 cb = texture2D(tDiffuse, uv - vec2(shift, 0.0));

      vec4 color = vec4(cr.r, cg.g, cb.b, cg.a);

      // ── Noise injection ──
      float noise = hash(uv.x * 10000.0 + uv.y * 10000.0 + uTime * 100.0);
      float noiseActive = step(0.97, blockNoise(uv, 4.0)) * intensity;
      color.rgb = mix(color.rgb, vec3(noise), noiseActive * 0.5);

      // ── Temporal flicker ──
      float flicker = 1.0 - step(0.95, hash(floor(uTime * 20.0))) * intensity * 0.3;
      color.rgb *= flicker;

      gl_FragColor = color;
    }
  `,
};
