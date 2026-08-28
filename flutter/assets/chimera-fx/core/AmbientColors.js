/**
 * AmbientColors — Market-aware ambient color system.
 *
 * Adjusts the CSS and VFX particle palette in response to market regime,
 * volatility, momentum, and fear/greed indicators — at a configurable
 * influence level (default 40-50%).
 *
 * Influence is one-directional: ambient merely nudges the active preset's
 * colors. The user's explicit theme selection always takes precedence.
 *
 * Usage:
 *   const ambient = new AmbientColors(0.45); // 45% influence
 *   ambient.update({ regime: 'trending', momentum: 0.7, fearGreed: 25 });
 *   // CSS vars and VFX theme are now shifted toward the market signal.
 */

import * as THREE from 'three';

const REGIME_PALETTES = {
  ranging: {
    cool:  { h: 210, s: 75, l: 55 },  // blue-grey neutral
    warm:  { h: 30,  s: 60, l: 60 },  // amber neutral
    accent:{ h: 160, s: 80, l: 50 },  // teal
  },
  trending: {
    cool:  { h: 140, s: 90, l: 48 },  // green momentum
    warm:  { h: 280, s: 70, l: 55 },  // purple breakout
    accent:{ h: 200, s: 85, l: 52 },  // cyan
  },
  volatile: {
    cool:  { h: 0,   s: 90, l: 55 },  // red danger
    warm:  { h: 45,  s: 100,l: 50 },  // orange warning
    accent:{ h: 320, s: 80, l: 55 },  // magenta
  },
  calm: {
    cool:  { h: 220, s: 50, l: 60 },  // muted blue
    warm:  { h: 35,  s: 45, l: 62 },  // soft gold
    accent:{ h: 170, s: 65, l: 50 },  // soft teal
  },
};

const DEFAULT_PALETTE = REGIME_PALETTES.ranging;

function lerp(a, b, t) { return a + (b - a) * t; }

function lerpHSL(base, target, strength) {
  return {
    h: Math.round(lerp(base.h, target.h, strength)),
    s: Math.round(lerp(base.s, target.s, strength)),
    l: Math.round(lerp(base.l, target.l, strength)),
  };
}

export class AmbientColors {
  /**
   * @param {number} factor — influence strength 0.0–1.0 (default 0.45)
   * @param {object} overrides — optionally pre-set signals
   */
  constructor(factor = 0.45, overrides = {}) {
    this.factor = Math.min(1, Math.max(0, factor));
    this._signals = {
      regime:       'ranging',  // ranging | trending | volatile | calm
      momentum:    0.5,        // 0.0–1.0
      fearGreed:   50,         // 0–100
      volatility:  0.3,        // 0.0–1.0
      ...overrides,
    };
    this._lastPalette = null;
    this._styleElement = null;
    this._enabled = true;
    this._cssVarsApplied = false;
  }

  /** Update with fresh market signal data. Call each time a new signal arrives. */
  update(signals = {}) {
    this._signals = { ...this._signals, ...signals };
    this._apply();
  }

  /** Enable or disable ambient color influence. */
  setEnabled(on) {
    this._enabled = !!on;
    if (!on) this._revert();
    else this._apply();
  }

  /** Set the influence factor. */
  setFactor(f) {
    this.factor = Math.min(1, Math.max(0, f));
    this._apply();
  }

  /** Read the current influence factor. */
  getFactor() { return this.factor; }

  /** Return the live signal object. */
  getSignals() { return { ...this._signals }; }

  // ── Internal ─────────────────────────────────────────────────────────────

  _getPalette() {
    const regime = this._signals.regime || 'ranging';
    return REGIME_PALETTES[regime] || DEFAULT_PALETTE;
  }

  _getSignalStrength() {
    // Normalize momentum (0–1) and fear/greed (0–100) to 0–1, average them
    const mom     = this._signals.momentum ?? 0.5;
    const fear    = (this._signals.fearGreed ?? 50) / 100;
    const vol    = this._signals.volatility ?? 0.3;
    // Volatile regime gets an extra push
    const regimeBoost = this._signals.regime === 'volatile' ? 1.2 : 1.0;
    return Math.min(1, ((mom + fear + vol) / 3) * regimeBoost);
  }

  _buildCssVars(primary, secondary, accent) {
    return `
      html[data-ambient-colors="on"] {
        --ambient-primary-h: ${primary.h};
        --ambient-primary-s: ${primary.s}%;
        --ambient-primary-l: ${primary.l}%;
        --ambient-secondary-h: ${secondary.h};
        --ambient-secondary-s: ${secondary.s}%;
        --ambient-secondary-l: ${secondary.l}%;
        --ambient-accent-h: ${accent.h};
        --ambient-accent-s: ${accent.s}%;
        --ambient-accent-l: ${accent.l}%;
        --primary-h: ${primary.h};
        --primary-s: ${primary.s}%;
        --primary-l: ${primary.l}%;
        --secondary-h: ${secondary.h};
        --secondary-s: ${secondary.s}%;
        --secondary-l: ${secondary.l}%;
      }
    `;
  }

  _apply() {
    if (!this._enabled) return;
    document.documentElement.dataset.ambientColors = 'on';

    const palette  = this._getPalette();
    const signalT = this._getSignalStrength();
    const blend   = this.factor * signalT;

    // Blend each axis toward the regime palette
    const current = this._readCurrentHSL();
    const primary   = lerpHSL(current.primary,   palette.cool,   blend);
    const secondary = lerpHSL(current.secondary, palette.warm,  blend);
    const accent    = lerpHSL(current.accent,    palette.accent, blend);

    this._injectCss(this._buildCssVars(primary, secondary, accent));

    // Propagate to ChimeraFX theme if available
    this._syncChimeraVfx(primary, accent);

    this._lastPalette = { primary, secondary, accent, signalT, blend };
  }

  _readCurrentHSL() {
    const root = document.documentElement;
    const get = (h, s, l) => ({
      h:  parseInt(getComputedStyle(root).getPropertyValue(`--${h}`) || '0'),
      s:  parseInt(getComputedStyle(root).getPropertyValue(`--${s}`) || '50'),
      l:  parseInt(getComputedStyle(root).getPropertyValue(`--${l}`) || '50'),
    });
    // Fallback to preset defaults if not set
    return {
      primary:   { h: 168, s: 100, l: 45 },
      secondary: { h: 210, s: 80,  l: 56 },
      accent:    { h: 160, s: 80,  l: 50 },
    };
  }

  _injectCss(css) {
    if (!this._styleElement) {
      this._styleElement = document.createElement('style');
      this._styleElement.id = 'chimera-ambient-colors';
      document.head.appendChild(this._styleElement);
    }
    this._styleElement.textContent = css;
    this._cssVarsApplied = true;
  }

  _revert() {
    delete document.documentElement.dataset.ambientColors;
    if (this._styleElement) {
      this._styleElement.textContent = '';
    }
    this._cssVarsApplied = false;
  }

  /** Notify the legacy VFX layer after CSS-driven ambient colors change. */
  _syncChimeraVfx(_primary, _accent) {
    try {
      // Notify ChimeraVFX if it has a color resolver
      if (window.ChimeraVFX?.resolveColors) {
        window.ChimeraVFX.resolveColors();
      }
    } catch (_) {}
  }

  /** Export current state as a JSON-serializable object. */
  toJSON() {
    return {
      factor:   this.factor,
      enabled:  this._enabled,
      signals:  this.getSignals(),
    };
  }

  /** Restore state from a JSON object (e.g. after page load). */
  fromJSON(data) {
    if (data.factor   !== undefined) this.factor   = data.factor;
    if (data.enabled !== undefined) this._enabled  = data.enabled;
    if (data.signals) this._signals = { ...this._signals, ...data.signals };
  }

  dispose() {
    this._revert();
    if (this._styleElement) {
      this._styleElement.remove();
      this._styleElement = null;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  WINDOW API
// ═══════════════════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.ChimeraFX = window.ChimeraFX || {};

  /** Create and wire the ambient color system. Call once on app init. */
  window.ChimeraFX.initAmbientColors = function (factor = 0.45) {
    if (window._chimeraAmbient) {
      window._chimeraAmbient.dispose();
    }
    window._chimeraAmbient = new AmbientColors(factor);

    // Restore from localStorage if previously configured
    try {
      const stored = localStorage.getItem('chimera-ambient-state');
      if (stored) {
        const data = JSON.parse(stored);
        window._chimeraAmbient.fromJSON(data);
        if (window._chimeraAmbient._enabled) {
          window._chimeraAmbient._apply();
        }
      }
    } catch (_) {}

    return window._chimeraAmbient;
  };

  /** Get the live ambient instance. */
  window.ChimeraFX.getAmbientColors = function () {
    return window._chimeraAmbient || null;
  };

  /** Convenience: push market signals to the ambient system. */
  window.ChimeraFX.updateAmbient = function (signals) {
    if (window._chimeraAmbient) {
      window._chimeraAmbient.update(signals);
      // Persist state
      try {
        localStorage.setItem('chimera-ambient-state', JSON.stringify(window._chimeraAmbient.toJSON()));
      } catch (_) {}
    }
  };

  /** Set ambient influence factor (0.0–1.0). */
  window.ChimeraFX.setAmbientFactor = function (f) {
    if (window._chimeraAmbient) window._chimeraAmbient.setFactor(f);
  };

  /** Enable or disable ambient influence. */
  window.ChimeraFX.setAmbientEnabled = function (on) {
    if (window._chimeraAmbient) window._chimeraAmbient.setEnabled(on);
  };
}
