/**
 * Darkstar Chimera FX engine. This is the library renderer: Three core,
 * original effect composer, AI state machine, component registry and themes.
 */
import * as THREE from '../../three.module.min.js';
import { EffectComposer } from '../../three-addons/postprocessing/EffectComposer.js';
import { RenderPass } from '../../three-addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../../three-addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from '../../three-addons/postprocessing/ShaderPass.js';
import { StateMachine } from './StateMachine.js';
import { ChromaticAberrationShader } from '../postfx/ChromaticAberrationShader.js';
import { FilmGrainShader } from '../postfx/FilmGrainShader.js';
import { GlitchShader } from '../postfx/GlitchShader.js';

export class Engine {
  constructor(opts = {}) {
    this.container = typeof opts.container === 'string' ? document.querySelector(opts.container) : opts.container || document.body;
    this.components = []; this.clock = new THREE.Clock(); this.mouse = new THREE.Vector2(0, 0); this.mouseNDC = new THREE.Vector2(0, 0);
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.targetFPS = opts.fps || 60; this.frameInterval = 1000 / this.targetFPS; this.lastFrame = 0;
    this.running = false; this.disposed = false; this.theme = null; this.uniforms = {};
    this._initRenderer(); this._initScene(); this._initCamera(); this._initPostProcessing(opts); this._initStateMachine(); this._initEvents();
    if (opts.theme) this.setTheme(opts.theme);
  }
  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x000000, 0); this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.0; this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvas = this.renderer.domElement; canvas.id = 'chimera-fx-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1;pointer-events:none;opacity:0.25;mix-blend-mode:screen;';
    if (this.container.firstChild) this.container.insertBefore(canvas, this.container.firstChild); else this.container.appendChild(canvas);
  }
  _initScene() { this.scene = new THREE.Scene(); this.scene.fog = new THREE.FogExp2(0x000000, 0.0015); }
  _initCamera() { const aspect = this.container.clientWidth / this.container.clientHeight; this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000); this.camera.position.set(0, 0, 30); this.camera.lookAt(0, 0, 0); }
  _initPostProcessing(opts) {
    const w = this.container.clientWidth, h = this.container.clientHeight; this.composer = new EffectComposer(this.renderer); this.composer.setSize(w, h);
    this.renderPass = new RenderPass(this.scene, this.camera); this.composer.addPass(this.renderPass);
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), opts.bloomStrength ?? 0.4, opts.bloomRadius ?? 0.6, opts.bloomThreshold ?? 0.3); this.composer.addPass(this.bloomPass);
    this.chromaPass = new ShaderPass(ChromaticAberrationShader); this.chromaPass.uniforms.uIntensity.value = 0.0; this.composer.addPass(this.chromaPass);
    this.grainPass = new ShaderPass(FilmGrainShader); this.grainPass.uniforms.uIntensity.value = 0.08; this.composer.addPass(this.grainPass);
    this.glitchPass = new ShaderPass(GlitchShader); this.glitchPass.uniforms.uIntensity.value = 0.0; this.glitchPass.enabled = false; this.composer.addPass(this.glitchPass);
  }
  _initStateMachine() {
    this.stateMachine = new StateMachine({ initial: 'idle', states: {
      idle: { bloomStrength: .4, chromaIntensity: 0, grainIntensity: .04, glitchIntensity: 0, componentIntensity: .15, transitionSpeed: .03 },
      thinking: { bloomStrength: .7, chromaIntensity: .001, grainIntensity: .03, glitchIntensity: 0, componentIntensity: .35, transitionSpeed: .05 },
      streaming: { bloomStrength: .6, chromaIntensity: .001, grainIntensity: .03, glitchIntensity: 0, componentIntensity: .3, transitionSpeed: .04 },
      executing: { bloomStrength: .9, chromaIntensity: .002, grainIntensity: .02, glitchIntensity: 0, componentIntensity: .5, transitionSpeed: .08 },
      error: { bloomStrength: .6, chromaIntensity: .004, grainIntensity: .08, glitchIntensity: .5, componentIntensity: .25, transitionSpeed: .1 },
      success: { bloomStrength: 1.2, chromaIntensity: .002, grainIntensity: .02, glitchIntensity: 0, componentIntensity: .6, transitionSpeed: .08 },
    }, onTransition: (_from, _to, values) => { this._targetState = values; } });
  }
  _initEvents() {
    this._onResize = this._resize.bind(this); this._onMouseMove = e => { this.mouse.set(e.clientX, e.clientY); const w = this.container.clientWidth, h = this.container.clientHeight; this.mouseNDC.set((e.clientX / w) * 2 - 1, -(e.clientY / h) * 2 + 1); };
    this._onVisChange = () => { if (document.hidden) this._pause(); else this._resume(); };
    window.addEventListener('resize', this._onResize); window.addEventListener('mousemove', this._onMouseMove); document.addEventListener('visibilitychange', this._onVisChange);
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => { this.reducedMotion = e.matches; });
  }
  _resize() { const w = this.container.clientWidth, h = this.container.clientHeight; this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.renderer.setSize(w, h); this.composer.setSize(w, h); this.components.forEach(c => c.onResize?.(w, h, this)); }
  addComponent(component) { component.init?.(this); this.components.push(component); return this; }
  removeComponent(component) { const i = this.components.indexOf(component); if (i >= 0) { component.dispose?.(this); this.components.splice(i, 1); } return this; }
  setTheme(theme) { this.theme = theme; if (theme) { theme.apply?.(this); this.components.forEach(c => c.onThemeChange?.(theme, this)); } return this; }
  setState(state) { this.stateMachine.transitionTo(state); this.components.forEach(c => c.onStateChange?.(state, this)); return this; }
  pulse(type = 'default', data = {}) { this.components.forEach(c => c.onPulse?.(type, data, this)); if (type === 'trade' || type === 'success') { this.setState('success'); setTimeout(() => this.setState('idle'), 2000); } else if (type === 'error') { this.setState('error'); this.glitchPass.enabled = true; setTimeout(() => { this.setState('idle'); this.glitchPass.enabled = false; }, 1500); } return this; }
  start() { if (this.running) return this; this.running = true; this.clock.start(); this._animate(performance.now()); return this; }
  _pause() { this.running = false; }
  _resume() { if (!this.running && !this.disposed) { this.running = true; this.clock.start(); this._animate(performance.now()); } }
  _animate(now) { if (!this.running || this.disposed) return; requestAnimationFrame(this._animate.bind(this)); if (now - this.lastFrame < this.frameInterval) return; this.lastFrame = now; if (this.reducedMotion) return; const dt = Math.min(this.clock.getDelta(), .05), elapsed = this.clock.getElapsedTime(); const target = this._targetState || this.stateMachine.currentValues; if (target) { const speed = target.transitionSpeed || .05; this.bloomPass.strength += (target.bloomStrength - this.bloomPass.strength) * speed; this.chromaPass.uniforms.uIntensity.value += (target.chromaIntensity - this.chromaPass.uniforms.uIntensity.value) * speed; this.grainPass.uniforms.uTime.value = elapsed; this.grainPass.uniforms.uIntensity.value += (target.grainIntensity - this.grainPass.uniforms.uIntensity.value) * speed; if (this.glitchPass.enabled) { this.glitchPass.uniforms.uTime.value = elapsed; this.glitchPass.uniforms.uIntensity.value += (target.glitchIntensity - this.glitchPass.uniforms.uIntensity.value) * speed; } } const ctx = { dt, elapsed, mouse: this.mouse, mouseNDC: this.mouseNDC, state: this.stateMachine.current, intensity: target?.componentIntensity ?? .3, theme: this.theme }; this.components.forEach(c => c.update?.(ctx, this)); this.camera.position.x = Math.sin(elapsed * .1) * .5; this.camera.position.y = Math.cos(elapsed * .07) * .3; this.composer.render(dt); }
  dispose() { this.disposed = true; this.running = false; window.removeEventListener('resize', this._onResize); window.removeEventListener('mousemove', this._onMouseMove); document.removeEventListener('visibilitychange', this._onVisChange); this.components.forEach(c => c.dispose?.(this)); this.components = []; this.composer.dispose(); this.renderer.dispose(); this.renderer.domElement.remove(); }
}
