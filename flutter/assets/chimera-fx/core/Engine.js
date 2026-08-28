/**
 * ChimeraFX Engine — Core renderer, scene manager, and AI-reactive state machine.
 *
 * Architecture:
 *   Engine → manages Three.js renderer, scene, camera, clock
 *          → owns EffectComposer (post-processing pipeline)
 *          → owns StateMachine (AI state → visual transitions)
 *          → owns ComponentRegistry (pluggable VFX components)
 *          → owns ThemeManager (hot-swappable color/material themes)
 *
 * Usage:
 *   const engine = new ChimeraFX.Engine({ container: '#app', theme: 'cyberpunk-neon' });
 *   engine.addComponent(new ChimeraFX.ParticleNebula());
 *   engine.addComponent(new ChimeraFX.EnergyTendrils());
 *   engine.start();
 *   // AI hooks
 *   engine.setState('thinking');
 *   engine.pulse('trade');
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { StateMachine } from './StateMachine.js?v=9';
import { ChromaticAberrationShader } from '../postfx/ChromaticAberrationShader.js?v=9';
import { FilmGrainShader } from '../postfx/FilmGrainShader.js?v=9';
import { GlitchShader } from '../postfx/GlitchShader.js?v=9';

export class Engine {
  constructor(opts = {}) {
    this.container = typeof opts.container === 'string'
      ? document.querySelector(opts.container)
      : opts.container || document.body;

    this.components = [];
    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseNDC = new THREE.Vector2(0, 0);
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.targetFPS = opts.fps || 60;
    this.frameInterval = 1000 / this.targetFPS;
    this.lastFrame = 0;
    this.running = false;
    this.disposed = false;
    this.theme = null;
    this.uniforms = {};

    // ── Three.js core ──
    this._initRenderer();
    this._initScene();
    this._initCamera();
    this._initPostProcessing(opts);
    this._initStateMachine();
    this._initEvents();

    // Apply theme
    if (opts.theme) this.setTheme(opts.theme);
  }

  // ─── Renderer ───────────────────────────────────────────────────────────
  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Style: fixed fullscreen behind UI
    const canvas = this.renderer.domElement;
    canvas.id = 'chimera-fx-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2;pointer-events:none;opacity:0.85;mix-blend-mode:screen;';
    // Prepend so it's behind all DOM elements
    if (this.container.firstChild) {
      this.container.insertBefore(canvas, this.container.firstChild);
    } else {
      this.container.appendChild(canvas);
    }
  }

  // ─── Scene ──────────────────────────────────────────────────────────────
  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.0015);
  }

  // ─── Camera ─────────────────────────────────────────────────────────────
  _initCamera() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 30);
    this.camera.lookAt(0, 0, 0);
  }

  // ─── Post-Processing Pipeline ───────────────────────────────────────────
  _initPostProcessing(opts) {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(w, h);

    // Base render
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    // Bloom — the signature glow
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(w, h),
      opts.bloomStrength ?? 0.4,    // strength
      opts.bloomRadius ?? 0.6,      // radius
      opts.bloomThreshold ?? 0.3    // threshold
    );
    this.composer.addPass(this.bloomPass);

    // Chromatic Aberration
    this.chromaPass = new ShaderPass(ChromaticAberrationShader);
    this.chromaPass.uniforms.uIntensity.value = 0.0;
    this.composer.addPass(this.chromaPass);

    // Film Grain — barely perceptible (was 0.08, caused visible wavy static on dark backgrounds)
    this.grainPass = new ShaderPass(FilmGrainShader);
    this.grainPass.uniforms.uIntensity.value = 0.01;
    this.composer.addPass(this.grainPass);

    // Glitch (off by default, activated on errors)
    this.glitchPass = new ShaderPass(GlitchShader);
    this.glitchPass.uniforms.uIntensity.value = 0.0;
    this.glitchPass.enabled = false;
    this.composer.addPass(this.glitchPass);
  }

  // ─── AI State Machine ──────────────────────────────────────────────────
  _initStateMachine() {
    this.stateMachine = new StateMachine({
      initial: 'idle',
      states: {
        idle: {
          bloomStrength: 0.4,
          chromaIntensity: 0.0,
          grainIntensity: 0.01,
          glitchIntensity: 0.0,
          componentIntensity: 0.15,
          transitionSpeed: 0.03,
        },
        thinking: {
          bloomStrength: 0.7,
          chromaIntensity: 0.001,
          grainIntensity: 0.008,
          glitchIntensity: 0.0,
          componentIntensity: 0.35,
          transitionSpeed: 0.05,
        },
        streaming: {
          bloomStrength: 0.6,
          chromaIntensity: 0.001,
          grainIntensity: 0.008,
          glitchIntensity: 0.0,
          componentIntensity: 0.3,
          transitionSpeed: 0.04,
        },
        executing: {
          bloomStrength: 0.9,
          chromaIntensity: 0.002,
          grainIntensity: 0.005,
          glitchIntensity: 0.0,
          componentIntensity: 0.5,
          transitionSpeed: 0.08,
        },
        error: {
          bloomStrength: 0.6,
          chromaIntensity: 0.004,
          grainIntensity: 0.02,
          glitchIntensity: 0.5,
          componentIntensity: 0.25,
          transitionSpeed: 0.1,
        },
        success: {
          bloomStrength: 1.2,
          chromaIntensity: 0.002,
          grainIntensity: 0.005,
          glitchIntensity: 0.0,
          componentIntensity: 0.6,
          transitionSpeed: 0.08,
        },
      },
      onTransition: (from, to, values) => this._applyStateValues(values),
    });
  }

  _applyStateValues(values) {
    // These are target values — actual interpolation in render loop
    this._targetState = values;
  }

  // ─── Events ─────────────────────────────────────────────────────────────
  _initEvents() {
    this._onResize = this._resize.bind(this);
    this._onMouseMove = (e) => {
      this.mouse.set(e.clientX, e.clientY);
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.mouseNDC.set((e.clientX / w) * 2 - 1, -(e.clientY / h) * 2 + 1);
    };
    this._onVisChange = () => {
      if (document.hidden) this._pause();
      else this._resume();
    };

    window.addEventListener('resize', this._onResize);
    window.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('visibilitychange', this._onVisChange);

    // Reduced motion listener
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
    });
  }

  _resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
    this.components.forEach(c => c.onResize?.(w, h, this));
  }

  // ─── Component API ──────────────────────────────────────────────────────
  addComponent(component) {
    component.init?.(this);
    this.components.push(component);
    return this;
  }

  removeComponent(component) {
    const idx = this.components.indexOf(component);
    if (idx >= 0) {
      component.dispose?.(this);
      this.components.splice(idx, 1);
    }
    return this;
  }

  /**
   * Enable a component by registry name (e.g. 'nebula', 'tendrils', 'rivers').
   * Uses window.ChimeraFX.components registry if available.
   */
  _resolveComponentCtor(name) {
    const reg = window.ChimeraFX?.components;
    if (!reg || !name) return null;
    return reg[name] || reg[String(name).toLowerCase()] || null;
  }

  _hasComponentCtor(Ctor) {
    if (!Ctor) return false;
    return this.components.some(c => c instanceof Ctor || c.constructor === Ctor || c.constructor?.name === Ctor.name);
  }

  enableComponent(name) {
    const Ctor = this._resolveComponentCtor(name);
    if (!Ctor) {
      console.warn('ChimeraFX: Unknown component:', name);
      return this;
    }
    if (this._hasComponentCtor(Ctor)) return this;
    const instance = new Ctor();
    return this.addComponent(instance);
  }

  /**
   * Disable and remove a component by registry name.
   */
  disableComponent(name) {
    const Ctor = this._resolveComponentCtor(name);
    const comp = Ctor
      ? this.components.find(c => c instanceof Ctor || c.constructor === Ctor || c.constructor?.name === Ctor.name)
      : this.components.find(c => c.constructor?.name === name);
    if (comp) this.removeComponent(comp);
    return this;
  }

  /**
   * Check if a component is currently enabled.
   */
  isComponentEnabled(name) {
    const Ctor = this._resolveComponentCtor(name);
    return Ctor ? this._hasComponentCtor(Ctor) : this.components.some(c => c.constructor?.name === name);
  }

  /**
   * Replace active components with a curated registry-name preset.
   */
  setComponentPreset(names = []) {
    const requiredCtors = [];
    for (const name of names) {
      const Ctor = this._resolveComponentCtor(name);
      if (Ctor && !requiredCtors.includes(Ctor)) requiredCtors.push(Ctor);
    }
    if (!requiredCtors.length) return this;
    for (const comp of [...this.components]) {
      if (!requiredCtors.some(Ctor => comp instanceof Ctor || comp.constructor === Ctor || comp.constructor?.name === Ctor.name)) {
        this.removeComponent(comp);
      }
    }
    for (const Ctor of requiredCtors) {
      if (!this._hasComponentCtor(Ctor)) {
        this.addComponent(new Ctor());
      }
    }
    return this;
  }

  /**
   * Get the current enabled component names.
   */
  getEnabledComponents() {
    return this.components.map(c => c.constructor?.name).filter(Boolean);
  }

  // ─── Theme API ──────────────────────────────────────────────────────────
  setTheme(themeOrName) {
    if (typeof themeOrName === 'string') {
      // Dynamic import would go here; for now, themes are registered objects
      this.theme = window.ChimeraFX?._themes?.[themeOrName] || null;
    } else {
      this.theme = themeOrName;
    }
    if (this.theme) {
      this.theme.apply?.(this);
      this.components.forEach(c => c.onThemeChange?.(this.theme, this));
    }
    return this;
  }

  // ─── State API (for AI hooks) ───────────────────────────────────────────
  setState(state) {
    this.stateMachine.transitionTo(state);
    this.components.forEach(c => c.onStateChange?.(state, this));
    return this;
  }

  /** One-shot burst effect (trade execution, notification, etc.) */
  pulse(type = 'default', data = {}) {
    this.components.forEach(c => c.onPulse?.(type, data, this));

    // Temporary state boosts
    if (type === 'trade' || type === 'success') {
      this.setState('success');
      setTimeout(() => this.setState('idle'), 2000);
    } else if (type === 'error') {
      this.setState('error');
      this.glitchPass.enabled = true;
      setTimeout(() => {
        this.setState('idle');
        this.glitchPass.enabled = false;
      }, 1500);
    }
    return this;
  }

  /**
   * User-facing intensity control (0–1).
   * Scales all post-processing targets and component intensity.
   * Unlike AI state transitions which are temporary, this persists
   * until the user moves the slider again.
   */
  setUserIntensity(factor) {
    this._userIntensity = Math.min(1, Math.max(0, factor));
    this._syncPostProcessingToIntensity();
    return this;
  }

  getUserIntensity() {
    return this._userIntensity ?? 1;
  }

  /**
   * Set post-processing multiplier on top of state-machine targets.
   * factor = 0 → minimal effects, factor = 1 → full state intensity.
   */
  _getEffectiveTarget() {
    const base = this._targetState || this.stateMachine.currentValues;
    const u = this.getUserIntensity();
    if (u >= 1) return base;
    // Scale numeric post-processing values by user factor
    const result = { ...base };
    const scaleKeys = ['bloomStrength', 'chromaIntensity', 'grainIntensity',
                       'glitchIntensity', 'componentIntensity'];
    for (const k of scaleKeys) {
      if (typeof result[k] === 'number') {
        result[k] = result[k] * u;
      }
    }
    return result;
  }

  _syncPostProcessingToIntensity() {
    const target = this._getEffectiveTarget();
    if (!target) return;

    if (this.bloomPass && typeof target.bloomStrength === 'number') {
      this.bloomPass.strength = target.bloomStrength;
    }
    if (this.chromaPass?.uniforms?.uIntensity && typeof target.chromaIntensity === 'number') {
      this.chromaPass.uniforms.uIntensity.value = target.chromaIntensity;
    }
    if (this.grainPass?.uniforms?.uIntensity && typeof target.grainIntensity === 'number') {
      this.grainPass.uniforms.uIntensity.value = target.grainIntensity;
    }
    if (this.glitchPass?.uniforms?.uIntensity && typeof target.glitchIntensity === 'number') {
      this.glitchPass.uniforms.uIntensity.value = target.glitchIntensity;
    }
  }

  // ─── Render Loop ────────────────────────────────────────────────────────
  start() {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    this._animate(performance.now());
    return this;
  }

  _pause() { this.running = false; }
  _resume() {
    if (!this.running && !this.disposed) {
      this.running = true;
      this.clock.start();
      this._animate(performance.now());
    }
  }

  _animate(now) {
    if (!this.running || this.disposed) return;
    requestAnimationFrame(this._animate.bind(this));

    // FPS cap
    if (now - this.lastFrame < this.frameInterval) return;
    this.lastFrame = now;

    if (this.reducedMotion) return;

    const dt = Math.min(this.clock.getDelta(), 0.05); // Clamp deltaTime
    const elapsed = this.clock.getElapsedTime();

    // ── Interpolate post-processing towards target state ──
    const target = this._getEffectiveTarget();
    if (target) {
      const speed = target.transitionSpeed || 0.05;
      this.bloomPass.strength += (target.bloomStrength - this.bloomPass.strength) * speed;
      this.chromaPass.uniforms.uIntensity.value +=
        (target.chromaIntensity - this.chromaPass.uniforms.uIntensity.value) * speed;
      this.grainPass.uniforms.uTime.value = elapsed;
      this.grainPass.uniforms.uIntensity.value +=
        (target.grainIntensity - this.grainPass.uniforms.uIntensity.value) * speed;
      if (this.glitchPass.enabled) {
        this.glitchPass.uniforms.uTime.value = elapsed;
        this.glitchPass.uniforms.uIntensity.value +=
          (target.glitchIntensity - this.glitchPass.uniforms.uIntensity.value) * speed;
      }
    }

    // ── Update components ──
    const ctx = {
      dt, elapsed, mouse: this.mouse, mouseNDC: this.mouseNDC,
      state: this.stateMachine.current,
      intensity: target?.componentIntensity ?? 0.3,
      theme: this.theme,
    };
    this.components.forEach(c => c.update?.(ctx, this));

    // ── Subtle camera breathing ──
    this.camera.position.x = Math.sin(elapsed * 0.1) * 0.5;
    this.camera.position.y = Math.cos(elapsed * 0.07) * 0.3;

    // ── Render ──
    this.composer.render(dt);
  }

  // ─── Cleanup ────────────────────────────────────────────────────────────
  dispose() {
    this.disposed = true;
    this.running = false;
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('visibilitychange', this._onVisChange);
    this.components.forEach(c => c.dispose?.(this));
    this.components = [];
    this.composer.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

// ─── Global namespace for non-module usage ────────────────────────────────
if (typeof window !== 'undefined') {
  window.ChimeraFX = window.ChimeraFX || {};
  window.ChimeraFX.Engine = Engine;
  window.ChimeraFX._themes = window.ChimeraFX._themes || {};
}
