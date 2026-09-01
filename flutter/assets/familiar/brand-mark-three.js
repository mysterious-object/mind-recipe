import * as THREE from './three.module.min.js';

const sceneMode = document.body?.dataset.sceneMode || window.MIND_RECIPE_SCENE_MODE || 'compact';
const isIntro = sceneMode === 'intro';
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.domElement.id = 'mind-recipe-brand-webgl';
renderer.domElement.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:3;pointer-events:none';
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(isIntro ? 34 : 30, 1, 0.1, 100);
camera.position.set(0, 0, isIntro ? 6.1 : 5.4);
const root = new THREE.Group();
scene.add(root);

const palette = {
  ink: new THREE.Color(0x161e21),
  deep: new THREE.Color(0x14645f),
  teal: new THREE.Color(0x1c847a),
  glass: new THREE.Color(0xa8d0cb),
  silver: new THREE.Color(0xcdd0d0),
};

const livingMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uTime: { value: 0 },
    uDeep: { value: palette.deep },
    uTeal: { value: palette.teal },
    uGlass: { value: palette.glass },
    uVariant: { value: 0 },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uVariant;
    varying vec3 vNormal;
    varying vec3 vWorld;
    varying float vWave;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      float wave = sin(position.x * 5.0 + uTime * 0.72 + uVariant) *
                   sin(position.y * 6.0 - uTime * 0.54) *
                   sin(position.z * 4.0 + uTime * 0.38);
      float folds = sin((position.x + position.y) * 10.0 + uTime * 0.45) * 0.035;
      vec3 displaced = position + normal * (wave * 0.105 + folds);
      vec4 world = modelMatrix * vec4(displaced, 1.0);
      vWorld = world.xyz;
      vWave = wave;
      gl_Position = projectionMatrix * viewMatrix * world;
    }
  `,
  fragmentShader: `
    precision highp float;
    uniform float uTime;
    uniform vec3 uDeep;
    uniform vec3 uTeal;
    uniform vec3 uGlass;
    varying vec3 vNormal;
    varying vec3 vWorld;
    varying float vWave;
    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorld);
      float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.6);
      float filament = pow(0.5 + 0.5 * sin(vWorld.y * 17.0 + vWorld.x * 9.0 - uTime), 8.0);
      vec3 body = mix(uDeep, uTeal, vWave * 0.5 + 0.5);
      body = mix(body, uGlass, fresnel * 0.92 + filament * 0.22);
      float alpha = 0.13 + fresnel * 0.42 + filament * 0.08;
      gl_FragColor = vec4(body, alpha);
    }
  `,
});

const living = new THREE.Mesh(
  new THREE.IcosahedronGeometry(isIntro ? 1.58 : 1.44, 5),
  livingMaterial,
);
living.scale.set(1.15, 0.83, 0.72);
living.position.z = -0.55;
root.add(living);

const topology = new THREE.Mesh(
  new THREE.IcosahedronGeometry(isIntro ? 1.69 : 1.54, 3),
  new THREE.MeshBasicMaterial({
    color: palette.glass,
    wireframe: true,
    transparent: true,
    opacity: 0.095,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
);
topology.scale.set(1.17, 0.84, 0.75);
topology.position.z = -0.58;
root.add(topology);

const nodeCount = isIntro ? 420 : 240;
const positions = new Float32Array(nodeCount * 3);
for (let i = 0; i < nodeCount; i++) {
  const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  const radius = 1.46 + 0.16 * Math.sin(i * 2.17);
  positions[i * 3] = Math.cos(theta) * Math.sin(phi) * radius * 1.18;
  positions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * radius * 0.84;
  positions[i * 3 + 2] = Math.cos(phi) * radius * 0.72 - 0.48;
}
const nodeGeometry = new THREE.BufferGeometry();
nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const nodes = new THREE.Points(
  nodeGeometry,
  new THREE.PointsMaterial({
    color: palette.silver,
    size: isIntro ? 0.022 : 0.026,
    transparent: true,
    opacity: 0.66,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
);
root.add(nodes);

const orbitals = [];
for (let i = 0; i < 5; i++) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.66 + i * 0.09, 0.008 + (i % 2) * 0.004, 12, 180),
    new THREE.MeshBasicMaterial({
      color: [palette.teal, palette.glass, palette.silver][i % 3],
      transparent: true,
      opacity: 0.29 - i * 0.025,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  ring.scale.y = 0.66 + i * 0.035;
  ring.rotation.set(0.35 + i * 0.31, i * 0.57, i * 0.83);
  root.add(ring);
  orbitals.push(ring);
}

const markMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  uniforms: {
    uMap: { value: null },
    uOpacity: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    uniform sampler2D uMap;
    uniform float uOpacity;
    varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(uMap, vUv);
      if (texel.a < 0.015) discard;
      gl_FragColor = vec4(texel.rgb, texel.a * uOpacity);
    }
  `,
});
const mark = new THREE.Mesh(new THREE.PlaneGeometry(3.72, 3.72), markMaterial);
mark.position.z = 0.72;
root.add(mark);

new THREE.TextureLoader().load(
  '../branding/mind-recipe-mark.png',
  (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    markMaterial.uniforms.uMap.value = texture;
    markMaterial.needsUpdate = true;
    try { window.BrandBridge?.postMessage('ready'); } catch (_) {}
    try { window.IntroBridge?.postMessage('brand_ready'); } catch (_) {}
  },
  undefined,
  () => { try { window.BrandBridge?.postMessage('texture_error'); } catch (_) {} },
);

let variant = 0;
window.setBrandSceneVariant = (value) => {
  variant = Number(value || 0) % 12;
  livingMaterial.uniforms.uVariant.value = variant * 0.73;
  root.rotation.z = ((variant % 5) - 2) * 0.018;
};

function resize() {
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  // Fit the complete horizontal mark on portrait launch screens. Compact
  // modal headers are wide, so they use a larger scale for legibility.
  const aspectScale = isIntro
    ? Math.min(0.42, Math.max(0.29, (width / height) * 0.64))
    : 1.18;
  root.userData.baseScale = aspectScale;
}
window.addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
let revealed = 0;
function frame() {
  requestAnimationFrame(frame);
  const t = clock.getElapsedTime();
  revealed += (1 - revealed) * 0.035;
  livingMaterial.uniforms.uTime.value = t;
  living.rotation.y = t * 0.075 + Math.sin(t * 0.21) * 0.12;
  living.rotation.x = Math.sin(t * 0.27) * 0.08;
  topology.rotation.y = -t * 0.052;
  topology.rotation.z = Math.sin(t * 0.19) * 0.12;
  nodes.rotation.y = t * 0.041;
  nodes.rotation.x = Math.sin(t * 0.16) * 0.09;
  orbitals.forEach((ring, i) => {
    ring.rotation.z += (0.0014 + i * 0.00042) * (i % 2 ? -1 : 1);
    ring.rotation.y += 0.0005 * (i % 2 ? 1 : -1);
  });
  const breathe = 0.96 + Math.sin(t * 0.82) * 0.025;
  root.scale.setScalar((root.userData.baseScale || 1) * breathe);
  markMaterial.uniforms.uOpacity.value = Math.min(1, revealed * 1.18);
  mark.position.y = Math.sin(t * 0.64 + variant) * 0.035;
  renderer.render(scene, camera);
}
frame();
