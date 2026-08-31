/* Local Three.js Pulse familiar. Stable seed = visual genome; completed work
 * changes anatomy, while current mood changes only the light and motion. */
import * as THREE from './three.module.min.js';

const host = document.getElementById('pulse-orb-stage');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({alpha:true, antialias:true, powerPreference:'high-performance'});
} catch (error) {
  try { FamiliarBridge.postMessage('webgl_error'); } catch (_) {}
  throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.28;
renderer.domElement.id = 'pulse-familiar-three-canvas';
renderer.domElement.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:3;pointer-events:none';
host.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
camera.position.set(0, .05, 7.7);
const familiar = new THREE.Group();
const aura = new THREE.Group();
const anatomy = new THREE.Group();
familiar.add(aura, anatomy);
scene.add(familiar);
const state = {seed:17, hue:174, valence:0, activation:.35, growth:0, complexity:.08, form:0, paused:false, reduceMotion:false};
const seeded = n => Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1;
const colorFor = (offset=0, saturation=.78, lightness=.55) => new THREE.Color().setHSL((((state.hue + offset) % 360) + 360) % 360 / 360, saturation, lightness);

const coreMaterial = new THREE.MeshPhysicalMaterial({color:colorFor(), emissive:colorFor(-12,.74,.24), emissiveIntensity:1.15, roughness:.18, metalness:.36, transmission:.13, transparent:true, opacity:.98, clearcoat:1, clearcoatRoughness:.09});
const membraneMaterial = new THREE.MeshBasicMaterial({color:colorFor(24,.8,.7), transparent:true, opacity:.18, wireframe:true, blending:THREE.AdditiveBlending, depthWrite:false});
const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.36, 5), coreMaterial);
const membrane = new THREE.Mesh(new THREE.IcosahedronGeometry(1.56, 3), membraneMaterial);
membrane.scale.set(1.08, .9, .88);
anatomy.add(core, membrane);

const rings = [];
for (let i=0; i<6; i++) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.78 + i*.17, .014 + i*.003, 10, 120), new THREE.MeshBasicMaterial({color:colorFor(i*14,.86,.64), transparent:true, opacity:.4-i*.045, blending:THREE.AdditiveBlending, depthWrite:false}));
  ring.rotation.set(seeded(i+3)*Math.PI, seeded(i+17)*Math.PI, seeded(i+31)*Math.PI);
  aura.add(ring); rings.push(ring);
}

const particleCount = 360;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
for (let i=0; i<particleCount; i++) {
  const angle=seeded(i*3.1+2)*Math.PI*2, z=seeded(i*7.7+5)*2-1, radius=Math.sqrt(1-z*z)*(2+seeded(i*4.3)*1.35);
  particlePositions[i*3]=Math.cos(angle)*radius;
  particlePositions[i*3+1]=z*(2.05+seeded(i*8.1));
  particlePositions[i*3+2]=Math.sin(angle)*radius;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({color:colorFor(12,.72,.75), size:.027, transparent:true, opacity:.82, blending:THREE.AdditiveBlending, depthWrite:false}));
aura.add(particles);
function applyGenome(seed) {
  for (let i=0; i<particleCount; i++) {
    const angle=seeded(seed+i*3.1+2)*Math.PI*2, z=seeded(seed+i*7.7+5)*2-1, radius=Math.sqrt(1-z*z)*(2+seeded(seed+i*4.3)*1.35);
    particlePositions[i*3]=Math.cos(angle)*radius;
    particlePositions[i*3+1]=z*(2.05+seeded(seed+i*8.1));
    particlePositions[i*3+2]=Math.sin(angle)*radius;
  }
  particleGeometry.attributes.position.needsUpdate=true;
  familiar.rotation.z=(seeded(seed+177)-.5)*.23;
}

// Milestone anatomy: crystalline petals, branches, and a crown appear only
// as sustained progress crosses successive form thresholds.
const crystals = new THREE.Group();
for (let i=0; i<9; i++) {
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(.11+seeded(i+70)*.13, 1), new THREE.MeshPhysicalMaterial({color:colorFor(25+i*8,.8,.65), emissive:colorFor(i*9,.72,.2), emissiveIntensity:.8, roughness:.18, metalness:.55, transparent:true, opacity:.92}));
  const theta=seeded(i*3+40)*Math.PI*2;
  crystal.position.set(Math.cos(theta)*(1.56+seeded(i)*.35), (seeded(i*9)-.5)*2.25, Math.sin(theta)*.5);
  crystal.rotation.set(seeded(i+20)*5, seeded(i+50)*5, seeded(i+90)*5);
  crystals.add(crystal);
}
anatomy.add(crystals);

const branches = new THREE.Group();
for (let i=0; i<7; i++) {
  const angle=i/7*Math.PI*2;
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(Math.cos(angle)*.65,Math.sin(angle)*.42,0),new THREE.Vector3(Math.cos(angle)*1.28,Math.sin(angle)*.9,seeded(i+6)-.5),new THREE.Vector3(Math.cos(angle)*1.75,Math.sin(angle)*1.38,(seeded(i+18)-.5)*1.2)]);
  branches.add(new THREE.Mesh(new THREE.TubeGeometry(curve,26,.022+seeded(i+100)*.016,7,false),new THREE.MeshBasicMaterial({color:colorFor(i*16,.85,.67),transparent:true,opacity:.63,blending:THREE.AdditiveBlending})));
}
anatomy.add(branches);

const crown = new THREE.Group();
for (let i=0; i<5; i++) {
  const shard=new THREE.Mesh(new THREE.ConeGeometry(.09+seeded(i)*.07,.55+seeded(i+9)*.35,5),new THREE.MeshPhysicalMaterial({color:colorFor(38+i*11,.78,.73),emissive:colorFor(18,.68,.25),emissiveIntensity:.9,roughness:.14,metalness:.65}));
  const angle=i/5*Math.PI*2;
  shard.position.set(Math.cos(angle)*.66,1.56+seeded(i+20)*.18,Math.sin(angle)*.42);
  shard.rotation.z=Math.cos(angle)*.36; shard.rotation.x=Math.sin(angle)*.3;
  crown.add(shard);
}
anatomy.add(crown);

scene.add(new THREE.HemisphereLight(0xcdebe6,0x08201f,2.2));
const key=new THREE.PointLight(0xb8fff0,20,15); key.position.set(2.4,3.1,4.3); scene.add(key);
const rim=new THREE.PointLight(0x5ca9ff,15,14); rim.position.set(-3,-1.5,3); scene.add(rim);

function evolve(next={}) {
  state.seed=Number(next.seed ?? state.seed); state.hue=Number(next.hue ?? state.hue);
  state.valence=Math.max(-1,Math.min(1,Number(next.valence ?? state.valence)));
  state.growth=Math.max(0,Math.min(1,Number(next.growth ?? state.growth)));
  state.activation=Math.max(0,Math.min(1,Number(next.activation ?? state.activation)));
  state.complexity=Math.max(0,Math.min(1,Number(next.complexity ?? state.complexity)));
  state.form=Math.max(0,Math.min(1,Number(next.form ?? state.form))); state.reduceMotion=!!next.reduceMotion;
  applyGenome(state.seed);
  const temporaryHue=state.valence*12;
  coreMaterial.color.copy(colorFor(temporaryHue,.74+state.complexity*.16,.48+state.valence*.07));
  coreMaterial.emissive.copy(colorFor(temporaryHue-14,.76,.18+state.activation*.15));
  coreMaterial.emissiveIntensity=.78+state.activation*1.12;
  membraneMaterial.color.copy(colorFor(temporaryHue+26,.82,.72));
  particles.material.color.copy(colorFor(temporaryHue+13,.74,.76)); particles.material.size=.018+state.complexity*.034;
  core.scale.set(1+state.growth*.12,1+state.complexity*.08,1+state.growth*.06);
  membrane.scale.set((.86+state.growth*.34)*1.04,(.86+state.growth*.34)*(.84+state.complexity*.12),(.86+state.growth*.34)*.87);
  rings.forEach((ring,i)=>{ring.visible=i<2+Math.ceil(state.complexity*4);ring.material.color.copy(colorFor(temporaryHue+20+i*14,.84,.64));ring.rotation.set(seeded(state.seed+i+3)*Math.PI,seeded(state.seed+i+17)*Math.PI,seeded(state.seed+i+31)*Math.PI);ring.scale.setScalar(1+state.growth*.18+i*state.complexity*.055);});
  crystals.visible=state.form>=.18; crystals.children.forEach((crystal,i)=>crystal.visible=i<Math.ceil(2+state.complexity*7));
  branches.visible=state.form>=.48; crown.visible=state.form>=.80;
  crystals.scale.setScalar(.74+state.growth*.42); branches.scale.setScalar(.76+state.growth*.34); crown.scale.setScalar(.7+state.growth*.38);
}
function resize(){renderer.setSize(Math.max(1,innerWidth),Math.max(1,innerHeight),false);camera.aspect=innerWidth/Math.max(1,innerHeight);camera.updateProjectionMatrix();}
let started=performance.now();
function frame(now){requestAnimationFrame(frame);if(state.paused)return;const t=(now-started)/1000;const speed=state.reduceMotion?.08:.16+state.activation*.22;const breath=state.reduceMotion?1:1+Math.sin(t*(.7+state.activation*1.2))*(.025+state.activation*.035);familiar.scale.setScalar(breath);familiar.rotation.y=t*speed;familiar.rotation.x=state.reduceMotion?.04:Math.sin(t*.22)*.1;membrane.rotation.y=-t*(.06+state.complexity*.14);particles.rotation.y=t*(.04+state.complexity*.14);crystals.rotation.y=-t*.12;branches.rotation.z=Math.sin(t*.28)*.09;crown.rotation.y=t*.08;rings.forEach((ring,i)=>ring.rotation.z+=(state.reduceMotion?.0002:.0018+state.activation*.004)*(i%2?-1:1));renderer.render(scene,camera);}
window.setFamiliarState=value=>evolve(value);
window.setFamiliarPaused=value=>{state.paused=!!value;};
window.addEventListener('resize',resize);
renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();try{FamiliarBridge.postMessage('context_lost');}catch(_){}});
try {
  resize();
  evolve({seed:17,hue:174,growth:.08,activation:.35,complexity:.08,form:0});
  // Only report ready after an actual Three.js frame succeeds.
  renderer.compile(scene,camera);
  renderer.render(scene,camera);
  try{FamiliarBridge.postMessage('ready');}catch(_){}
  frame(performance.now());
} catch (_) {
  try{FamiliarBridge.postMessage('shader_error');}catch(__){}
}
