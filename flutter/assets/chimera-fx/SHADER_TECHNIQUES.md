# ChimeraFX Shader Techniques — Deep Dive Reference

## Research compiled from Codrops, Shadertoy, Three.js Journey, pmndrs, and 40+ sources.

### Performance Budget (16ms target)
| Phase | Budget | Technique |
|-------|--------|-----------|
| Scene render | 4ms | InstancedMesh, frustum culling |
| GPGPU compute | 3ms | Curl noise + reaction-diffusion ping-pong |
| SDF ray march | 4ms | 64-96 steps, bounding sphere skip |
| Post-processing | 3ms | Bloom + chroma + grain batched |
| Headroom | 2ms | Safety margin |

### Cross-Cutting Integration Architecture
1. Scene render → GPGPU compute (particles, reaction-diffusion) → SDF ray march → EffectComposer (god rays → chroma → bloom)
2. Shared `AIState` uniform buffer: `{ phase, intensity, confidence, frequency, colorShift }`
3. GPUComputationRenderer handles multiple ping-pong FBOs simultaneously
4. Profile with `renderer.info` and Chrome DevTools GPU panel

### Key Optimized Patterns
- **Curl noise**: Bitangent noise reduces 18 noise evals to 3 per particle
- **Reaction-diffusion**: Half-resolution (512²), 4-8 sim steps per frame
- **SDF**: Bounding sphere check to skip rays that miss cluster
- **God rays**: Occlusion pass at quarter resolution
- **Chromatic aberration**: 6 iterations on mobile, 12 on desktop
- **Voronoi**: Pre-computed textures eliminate runtime cost
- **Lightning**: FBM 4-6 octaves, ≤50 total evaluations per pixel

### Sources (50+)
See RESEARCH_CATALOG.md for the full source list.
