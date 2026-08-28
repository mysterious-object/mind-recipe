/* Dedicated Pulse familiar: an on-device Three.js scene, deliberately
 * separate from the Darkstar matter-field background underneath it. */
import * as THREE from './three.module.min.js';

const host = document.getElementById('pulse-orb-stage');
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
renderer.setClearColor(0x000000, 0);
renderer.domElement.id = 'pulse-familiar-three-canvas';
renderer.domElement.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:3;pointer-events:none;';
host.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, .1, 100); camera.position.z = 8;
const familiar = new THREE.Group(); scene.add(familiar);
const halo = new THREE.Group(); familiar.add(halo);
const orbMaterial = new THREE.MeshPhysicalMaterial({ color: 0x29f4c5, emissive: 0x075d51, emissiveIntensity: 1.35, roughness: .22, metalness: .52, transmission: .06, transparent: true, opacity: .96, clearcoat: 1, clearcoatRoughness: .12 });
const shellMaterial = new THREE.MeshBasicMaterial({ color: 0x8fffe5, transparent: true, opacity: .2, wireframe: true, blending: THREE.AdditiveBlending });
const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 5), orbMaterial);
const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.48, 3), shellMaterial);
familiar.add(core, shell);

const rings = [];
for (let i = 0; i < 4; i++) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.78 + i * .23, .019 + i * .006, 8, 96), new THREE.MeshBasicMaterial({ color: 0x65ffe0, transparent: true, opacity: .42 - i * .055, blending: THREE.AdditiveBlending }));
  halo.add(ring); rings.push(ring);
}
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 180; const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) { const a = Math.random() * Math.PI * 2, z = Math.random() * 2 - 1, r = Math.sqrt(1 - z * z) * (2 + Math.random() * 1.15); positions[i * 3] = Math.cos(a) * r; positions[i * 3 + 1] = z * (2 + Math.random()); positions[i * 3 + 2] = Math.sin(a) * r; }
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x99ffe9, size: .032, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false }));
familiar.add(particles);
scene.add(new THREE.AmbientLight(0x5fffe1, 1.9));
const key = new THREE.PointLight(0xa47aff, 22, 18); key.position.set(2, 3, 4); scene.add(key);
const rim = new THREE.PointLight(0x20ffd1, 18, 15); rim.position.set(-3, -2, 3); scene.add(rim);

const state = { seed: 0, growth: 0, activation: .35, complexity: 0, paused: false };
function seeded(n) { return Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1; }
function evolve(next = {}) {
  state.seed = Number(next.seed ?? state.seed); state.growth = Math.max(0, Math.min(1, Number(next.growth ?? state.growth))); state.activation = Math.max(0, Math.min(1, Number(next.activation ?? state.activation))); state.complexity = Math.max(0, Math.min(1, Number(next.complexity ?? state.complexity)));
  const hue = (seeded(state.seed) + state.growth * .18 + state.complexity * .07) % 1;
  const coreColor = new THREE.Color().setHSL(hue, .84, .53);
  orbMaterial.color.copy(coreColor); orbMaterial.emissive.copy(coreColor).multiplyScalar(.28 + state.activation * .23); shellMaterial.color.copy(coreColor); particles.material.color.copy(coreColor);
  const scale = .86 + state.growth * .34 + state.complexity * .16; core.scale.setScalar(scale); shell.scale.setScalar(scale * 1.1);
  rings.forEach((ring, i) => { ring.visible = i < 2 + Math.round(state.complexity * 2); ring.material.color.copy(new THREE.Color().setHSL((hue + .12 + i * .07) % 1, .9, .63)); ring.rotation.set(seeded(state.seed + i) * Math.PI, seeded(state.seed + 20 + i) * Math.PI, seeded(state.seed + 40 + i) * Math.PI); ring.scale.setScalar(1 + state.growth * .22 + i * state.complexity * .07); });
  particles.material.size = .022 + state.complexity * .028;
}
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / Math.max(1, h); camera.updateProjectionMatrix(); }
let started = performance.now();
function frame(now) { requestAnimationFrame(frame); if (state.paused) return; const t = (now - started) / 1000; const breath = 1 + Math.sin(t * (.65 + state.activation * 1.5)) * (.035 + state.activation * .035); familiar.scale.setScalar(breath); familiar.rotation.y = t * (.13 + state.activation * .25); familiar.rotation.x = Math.sin(t * .2) * .12; shell.rotation.y = -t * .16; particles.rotation.y = t * (.08 + state.complexity * .18); particles.rotation.x = t * .045; rings.forEach((ring, i) => ring.rotation.z += (.002 + state.activation * .006) * (i % 2 ? -1 : 1)); renderer.render(scene, camera); }
window.setFamiliarState = ((darkstarApply) => value => { darkstarApply?.(value); evolve(value); })(window.setFamiliarState);
window.setFamiliarPaused = ((darkstarPause) => value => { darkstarPause?.(value); state.paused = !!value; })(window.setFamiliarPaused);
window.addEventListener('resize', resize); renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); try { FamiliarBridge.postMessage('context_lost'); } catch (_) {} });
resize(); evolve({ seed: 17, growth: .12, activation: .35, complexity: .08 }); frame(performance.now());
