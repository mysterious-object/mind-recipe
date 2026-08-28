/**
 * ChimeraFX StateMachine — Smoothly interpolates between AI visual states.
 *
 * Each state defines target values for post-processing and component parameters.
 * Transitions are smooth (lerp-based), with configurable speed per state.
 */

export class StateMachine {
  constructor(opts = {}) {
    this.states = opts.states || {};
    this.current = opts.initial || 'idle';
    this.previous = null;
    this.currentValues = { ...this.states[this.current] };
    this.targetValues = { ...this.currentValues };
    this.onTransition = opts.onTransition || (() => {});
    this.transitionStartTime = 0;
    this.history = [];
  }

  transitionTo(state) {
    if (!this.states[state] || state === this.current) return;
    this.previous = this.current;
    this.current = state;
    this.targetValues = { ...this.states[state] };
    this.transitionStartTime = performance.now();
    this.history.push({ from: this.previous, to: state, at: Date.now() });
    if (this.history.length > 50) this.history.shift();
    this.onTransition(this.previous, this.current, this.targetValues);
  }

  /** Call per frame to interpolate currentValues toward targetValues */
  update(dt) {
    const speed = this.targetValues.transitionSpeed || 0.05;
    for (const key in this.targetValues) {
      if (key === 'transitionSpeed') continue;
      if (typeof this.targetValues[key] === 'number' && typeof this.currentValues[key] === 'number') {
        this.currentValues[key] += (this.targetValues[key] - this.currentValues[key]) * speed;
      }
    }
  }

  get isTransitioning() {
    if (!this.targetValues) return false;
    for (const key in this.targetValues) {
      if (key === 'transitionSpeed') continue;
      if (typeof this.targetValues[key] === 'number') {
        if (Math.abs(this.targetValues[key] - (this.currentValues[key] || 0)) > 0.001) return true;
      }
    }
    return false;
  }
}
