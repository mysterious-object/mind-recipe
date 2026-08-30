import * as THREE from './three.module.min.js';
const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'}); renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5)); renderer.setClearColor(0,0); document.body.appendChild(renderer.domElement);
const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(38,1,.1,100); camera.position.z=5.2;
const group=new THREE.Group(); scene.add(group);
new THREE.TextureLoader().load('../branding/mind-recipe-mark.png', texture=>{texture.colorSpace=THREE.SRGBColorSpace; const mark=new THREE.Mesh(new THREE.PlaneGeometry(2.25,2.25),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false})); group.add(mark); try{BrandBridge.postMessage('ready')}catch(_){};});
for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.35+i*.18,.018+i*.006,8,96),new THREE.MeshBasicMaterial({color:[0x20b89f,0x8ef4dc,0xb8c7c7][i],transparent:true,opacity:.55-i*.1,blending:THREE.AdditiveBlending}));ring.rotation.x=.55+i*.43;ring.rotation.y=i*.72;group.add(ring)}
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/Math.max(1,innerHeight);camera.updateProjectionMatrix()} addEventListener('resize',resize);resize();
function frame(ms){requestAnimationFrame(frame);const t=ms/1000;group.rotation.y=Math.sin(t*.55)*.22;group.rotation.z=Math.sin(t*.38)*.06;group.scale.setScalar(.92+Math.sin(t*1.35)*.06);group.children.slice(1).forEach((r,i)=>r.rotation.z+=.004*(i%2?-1:1));renderer.render(scene,camera)} requestAnimationFrame(frame);
