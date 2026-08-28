/**
 * Chromatic Aberration — RGB channel offset for that sci-fi lens distortion feel.
 * Intensity reacts to AI state (higher during thinking/executing).
 */
export const ChromaticAberrationShader = {
  name: 'ChromaticAberration',
  uniforms: {
    tDiffuse: { value: null },
    uIntensity: { value: 0.003 },
    uDirection: { value: [1.0, 0.0] },
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
    uniform float uIntensity;
    uniform vec2 uDirection;
    varying vec2 vUv;

    void main() {
      vec2 offset = uIntensity * normalize(vUv - 0.5);
      float r = texture2D(tDiffuse, vUv + offset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - offset).b;
      float a = texture2D(tDiffuse, vUv).a;
      gl_FragColor = vec4(r, g, b, a);
    }
  `,
};
