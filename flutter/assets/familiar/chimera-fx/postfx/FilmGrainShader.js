export const FilmGrainShader = {
  name: 'FilmGrain',
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uIntensity: { value: 0.08 }, uSize: { value: 1.5 } },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime; uniform float uIntensity; uniform float uSize; varying vec2 vUv; float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); } void main() { vec4 color = texture2D(tDiffuse, vUv); vec2 grainUv = vUv * uSize + uTime * vec2(12.9898, 78.233); float grain = hash(grainUv) * 2.0 - 1.0; float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114)); color.rgb += grain * uIntensity * mix(1.0, 0.3, lum); gl_FragColor = color; }`,
};
