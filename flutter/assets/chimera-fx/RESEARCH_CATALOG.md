# ChimeraFX Research Catalog — Award-Winning WebGL/Three.js Effects

## TOP 20 Effects with Trading UI Adaptations

### Tier 1: Already Implemented in ChimeraFX v1.0

| # | Effect | Component | Status |
|---|--------|-----------|--------|
| 1 | GPGPU Curl Noise Particles | `ParticleNebula` | ✅ Done |
| 3 | UnrealBloomPass | Engine postfx | ✅ Done |
| 5 | Reaction-Diffusion (Gray-Scott) | `ReactionDiffusion` | ✅ Done |
| 6 | Domain Warping with fBM | Legacy `chimera-vfx.js` | ✅ Done |
| 7 | SDF Ray Marching | `LiquidMetal` | ✅ Done |
| 8 | Curl Noise Particle Flow | `ParticleNebula` | ✅ Done |
| 9 | Metaballs via Smooth Min | `LiquidMetal` | ✅ Done |
| 12 | Chromatic Aberration | `ChromaticAberrationShader` | ✅ Done |
| 13 | Voronoi Shattering | `VoronoiShatter` | ✅ Done |
| 14 | Film Grain + Glitch | `FilmGrainShader` + `GlitchShader` | ✅ Done |
| 15 | Volumetric God Rays | `VolumetricLight` | ✅ Done |

### Tier 2: Next Sprint Components

| # | Effect | Planned Component | Priority |
|---|--------|------------------|----------|
| 2 | Volumetric Ray Marched Cloudscapes | `VolatilityClouds` | HIGH |
| 4 | Screen Space Reflections (SSR) | Engine postfx pass | MEDIUM |
| 10 | Matcap Zero-Light Shading | `MatcapElements` | LOW |
| 11 | Instanced Mesh Mouse Repulsion | `DataTopology` | HIGH |
| 16 | Vertex Displacement Morphing | `SentimentOrb` | HIGH |
| 19 | SDF Reveal Transitions | `SceneTransition` | MEDIUM |
| 20 | Liquid Ray Marching (TSL) | `LiquidOrb` (WebGPU) | LOW |

### Tier 3: Architecture Upgrades

| # | Technique | Purpose | Priority |
|---|-----------|---------|----------|
| 17 | OffscreenCanvas + Web Worker | Main-thread isolation | CRITICAL |
| 18 | LOD + InstancedMesh2 + BVH | Dense orderbook viz | HIGH |

## Performance Budget

| Metric | Target | Technique |
|--------|--------|-----------|
| Draw calls | < 100/frame | InstancedMesh, BatchedMesh |
| Textures | KTX2 compressed | `KTX2Loader` |
| Particles | 50k+ via GPGPU | `GPUComputationRenderer` |
| Shader precision | `mediump` mobile | Precision qualifiers |
| Thread isolation | OffscreenCanvas | `transferControlToOffscreen()` |

## Key Sources
- Awwwards Three.js Collection
- Codrops tutorials (GPGPU, Liquid Raymarching, Reaction-Diffusion, Metaballs, Transitions)
- Maxime Heckel (Volumetric Raymarching)
- Bruno Simon Portfolio (Matcap technique)
- Inigo Quilez (Domain Warping, SDF)
- Book of Shaders (fBM)
- pmndrs/postprocessing library
- Evil Martians (OffscreenCanvas guide)
- 100 Three.js Performance Tips (utsubo.com)
