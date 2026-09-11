"use strict";
(() => {
  // assets/familiar/three.module.min.js
  var Va = "160";
  var vh = 1;
  var au = 2;
  var ti = 3;
  var _i = 0;
  var vt = 1;
  var _h = 2;
  var yh = 0;
  var Ve = 2;
  var Ui = 100;
  var Ga = 204;
  var Wa = 205;
  var xh = 0;
  var ou = 1;
  var lu = 2;
  var gi = 0;
  var cu = 1;
  var hu = 2;
  var uu = 3;
  var Jo = 4;
  var du = 5;
  var pu = 6;
  var Mh = 300;
  var fn = 301;
  var gn = 302;
  var Xa = 303;
  var ja = 304;
  var Bs = 306;
  var qa = 1e3;
  var ni = 1001;
  var Ya = 1002;
  var pt = 1003;
  var Hl = 1004;
  var ra = 1005;
  var gt = 1006;
  var mu = 1007;
  var ss = 1008;
  var Ot = 1009;
  var Ko = 1012;
  var bh = 1013;
  var mi = 1014;
  var Nt = 1015;
  var ri = 1016;
  var Sh = 1017;
  var Eh = 1018;
  var Bi = 1020;
  var bt = 1023;
  var Hi = 1026;
  var vn = 1027;
  var Th = 1029;
  var wh = 1031;
  var Ch = 1033;
  var sa = 33776;
  var aa = 33777;
  var oa = 33778;
  var la = 33779;
  var zl = 35840;
  var kl = 35841;
  var Vl = 35842;
  var Gl = 35843;
  var Ah = 36196;
  var Wl = 37492;
  var Xl = 37496;
  var jl = 37808;
  var ql = 37809;
  var Yl = 37810;
  var Zl = 37811;
  var Jl = 37812;
  var Kl = 37813;
  var $l = 37814;
  var Ql = 37815;
  var ec = 37816;
  var tc = 37817;
  var ic = 37818;
  var nc = 37819;
  var rc = 37820;
  var sc = 37821;
  var ca = 36492;
  var ac = 36494;
  var oc = 36495;
  var lc = 36284;
  var cc = 36285;
  var hc = 36286;
  var as = 2300;
  var os = 2301;
  var ha = 2302;
  var uc = 2400;
  var dc = 2401;
  var pc = 2402;
  var Rh = 3e3;
  var zi = 3001;
  var jt = "";
  var Qe = "srgb";
  var si = "srgb-linear";
  var $o = "display-p3";
  var Hs = "display-p3-linear";
  var ls = "linear";
  var We = "srgb";
  var cs = "rec709";
  var hs = "p3";
  var Yi = 7680;
  var mc = 35044;
  var fc = "300 es";
  var Za = 1035;
  var _n = 2e3;
  var us = 2001;
  var yi = class {
    addEventListener(e, t) {
      void 0 === this._listeners && (this._listeners = {});
      const i = this._listeners;
      void 0 === i[e] && (i[e] = []), -1 === i[e].indexOf(t) && i[e].push(t);
    }
    hasEventListener(e, t) {
      if (void 0 === this._listeners) return false;
      const i = this._listeners;
      return void 0 !== i[e] && -1 !== i[e].indexOf(t);
    }
    removeEventListener(e, t) {
      if (void 0 === this._listeners) return;
      const i = this._listeners[e];
      if (void 0 !== i) {
        const n = i.indexOf(t);
        -1 !== n && i.splice(n, 1);
      }
    }
    dispatchEvent(e) {
      if (void 0 === this._listeners) return;
      const t = this._listeners[e.type];
      if (void 0 !== t) {
        e.target = this;
        const i = t.slice(0);
        for (let n = 0, s = i.length; n < s; n++) i[n].call(this, e);
        e.target = null;
      }
    }
  };
  var ct = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
  var rs = Math.PI / 180;
  var Ja = 180 / Math.PI;
  function wn() {
    const r = 4294967295 * Math.random() | 0, e = 4294967295 * Math.random() | 0, t = 4294967295 * Math.random() | 0, i = 4294967295 * Math.random() | 0;
    return (ct[255 & r] + ct[r >> 8 & 255] + ct[r >> 16 & 255] + ct[r >> 24 & 255] + "-" + ct[255 & e] + ct[e >> 8 & 255] + "-" + ct[e >> 16 & 15 | 64] + ct[e >> 24 & 255] + "-" + ct[63 & t | 128] + ct[t >> 8 & 255] + "-" + ct[t >> 16 & 255] + ct[t >> 24 & 255] + ct[255 & i] + ct[i >> 8 & 255] + ct[i >> 16 & 255] + ct[i >> 24 & 255]).toLowerCase();
  }
  function st(r, e, t) {
    return Math.max(e, Math.min(t, r));
  }
  function fu(r, e) {
    return (r % e + e) % e;
  }
  function ua(r, e, t) {
    return (1 - t) * r + t * e;
  }
  function gc(r) {
    return 0 == (r & r - 1) && 0 !== r;
  }
  function Ka(r) {
    return Math.pow(2, Math.floor(Math.log(r) / Math.LN2));
  }
  function qn(r, e) {
    switch (e.constructor) {
      case Float32Array:
        return r;
      case Uint32Array:
        return r / 4294967295;
      case Uint16Array:
        return r / 65535;
      case Uint8Array:
        return r / 255;
      case Int32Array:
        return Math.max(r / 2147483647, -1);
      case Int16Array:
        return Math.max(r / 32767, -1);
      case Int8Array:
        return Math.max(r / 127, -1);
      default:
        throw new Error("Invalid component type.");
    }
  }
  function ft(r, e) {
    switch (e.constructor) {
      case Float32Array:
        return r;
      case Uint32Array:
        return Math.round(4294967295 * r);
      case Uint16Array:
        return Math.round(65535 * r);
      case Uint8Array:
        return Math.round(255 * r);
      case Int32Array:
        return Math.round(2147483647 * r);
      case Int16Array:
        return Math.round(32767 * r);
      case Int8Array:
        return Math.round(127 * r);
      default:
        throw new Error("Invalid component type.");
    }
  }
  var X = class r {
    constructor(e = 0, t = 0) {
      r.prototype.isVector2 = true, this.x = e, this.y = t;
    }
    get width() {
      return this.x;
    }
    set width(e) {
      this.x = e;
    }
    get height() {
      return this.y;
    }
    set height(e) {
      this.y = e;
    }
    set(e, t) {
      return this.x = e, this.y = t, this;
    }
    setScalar(e) {
      return this.x = e, this.y = e, this;
    }
    setX(e) {
      return this.x = e, this;
    }
    setY(e) {
      return this.y = e, this;
    }
    setComponent(e, t) {
      switch (e) {
        case 0:
          this.x = t;
          break;
        case 1:
          this.y = t;
          break;
        default:
          throw new Error("index is out of range: " + e);
      }
      return this;
    }
    getComponent(e) {
      switch (e) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        default:
          throw new Error("index is out of range: " + e);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y);
    }
    copy(e) {
      return this.x = e.x, this.y = e.y, this;
    }
    add(e) {
      return this.x += e.x, this.y += e.y, this;
    }
    addScalar(e) {
      return this.x += e, this.y += e, this;
    }
    addVectors(e, t) {
      return this.x = e.x + t.x, this.y = e.y + t.y, this;
    }
    addScaledVector(e, t) {
      return this.x += e.x * t, this.y += e.y * t, this;
    }
    sub(e) {
      return this.x -= e.x, this.y -= e.y, this;
    }
    subScalar(e) {
      return this.x -= e, this.y -= e, this;
    }
    subVectors(e, t) {
      return this.x = e.x - t.x, this.y = e.y - t.y, this;
    }
    multiply(e) {
      return this.x *= e.x, this.y *= e.y, this;
    }
    multiplyScalar(e) {
      return this.x *= e, this.y *= e, this;
    }
    divide(e) {
      return this.x /= e.x, this.y /= e.y, this;
    }
    divideScalar(e) {
      return this.multiplyScalar(1 / e);
    }
    applyMatrix3(e) {
      const t = this.x, i = this.y, n = e.elements;
      return this.x = n[0] * t + n[3] * i + n[6], this.y = n[1] * t + n[4] * i + n[7], this;
    }
    min(e) {
      return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this;
    }
    max(e) {
      return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this;
    }
    clamp(e, t) {
      return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this;
    }
    clampScalar(e, t) {
      return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this;
    }
    clampLength(e, t) {
      const i = this.length();
      return this.divideScalar(i || 1).multiplyScalar(Math.max(e, Math.min(t, i)));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this;
    }
    dot(e) {
      return this.x * e.x + this.y * e.y;
    }
    cross(e) {
      return this.x * e.y - this.y * e.x;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    angle() {
      return Math.atan2(-this.y, -this.x) + Math.PI;
    }
    angleTo(e) {
      const t = Math.sqrt(this.lengthSq() * e.lengthSq());
      if (0 === t) return Math.PI / 2;
      const i = this.dot(e) / t;
      return Math.acos(st(i, -1, 1));
    }
    distanceTo(e) {
      return Math.sqrt(this.distanceToSquared(e));
    }
    distanceToSquared(e) {
      const t = this.x - e.x, i = this.y - e.y;
      return t * t + i * i;
    }
    manhattanDistanceTo(e) {
      return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
    }
    setLength(e) {
      return this.normalize().multiplyScalar(e);
    }
    lerp(e, t) {
      return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this;
    }
    lerpVectors(e, t, i) {
      return this.x = e.x + (t.x - e.x) * i, this.y = e.y + (t.y - e.y) * i, this;
    }
    equals(e) {
      return e.x === this.x && e.y === this.y;
    }
    fromArray(e, t = 0) {
      return this.x = e[t], this.y = e[t + 1], this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this.x, e[t + 1] = this.y, e;
    }
    fromBufferAttribute(e, t) {
      return this.x = e.getX(t), this.y = e.getY(t), this;
    }
    rotateAround(e, t) {
      const i = Math.cos(t), n = Math.sin(t), s = this.x - e.x, a = this.y - e.y;
      return this.x = s * i - a * n + e.x, this.y = s * n + a * i + e.y, this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y;
    }
  };
  var Ae = class r {
    constructor(e, t, i, n, s, a, o, l, c) {
      r.prototype.isMatrix3 = true, this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1], void 0 !== e && this.set(e, t, i, n, s, a, o, l, c);
    }
    set(e, t, i, n, s, a, o, l, c) {
      const h = this.elements;
      return h[0] = e, h[1] = n, h[2] = o, h[3] = t, h[4] = s, h[5] = l, h[6] = i, h[7] = a, h[8] = c, this;
    }
    identity() {
      return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
    }
    copy(e) {
      const t = this.elements, i = e.elements;
      return t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = i[3], t[4] = i[4], t[5] = i[5], t[6] = i[6], t[7] = i[7], t[8] = i[8], this;
    }
    extractBasis(e, t, i) {
      return e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), i.setFromMatrix3Column(this, 2), this;
    }
    setFromMatrix4(e) {
      const t = e.elements;
      return this.set(t[0], t[4], t[8], t[1], t[5], t[9], t[2], t[6], t[10]), this;
    }
    multiply(e) {
      return this.multiplyMatrices(this, e);
    }
    premultiply(e) {
      return this.multiplyMatrices(e, this);
    }
    multiplyMatrices(e, t) {
      const i = e.elements, n = t.elements, s = this.elements, a = i[0], o = i[3], l = i[6], c = i[1], h = i[4], u = i[7], d = i[2], p = i[5], f = i[8], v = n[0], m = n[3], y = n[6], _ = n[1], g = n[4], w = n[7], R = n[2], T = n[5], A = n[8];
      return s[0] = a * v + o * _ + l * R, s[3] = a * m + o * g + l * T, s[6] = a * y + o * w + l * A, s[1] = c * v + h * _ + u * R, s[4] = c * m + h * g + u * T, s[7] = c * y + h * w + u * A, s[2] = d * v + p * _ + f * R, s[5] = d * m + p * g + f * T, s[8] = d * y + p * w + f * A, this;
    }
    multiplyScalar(e) {
      const t = this.elements;
      return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this;
    }
    determinant() {
      const e = this.elements, t = e[0], i = e[1], n = e[2], s = e[3], a = e[4], o = e[5], l = e[6], c = e[7], h = e[8];
      return t * a * h - t * o * c - i * s * h + i * o * l + n * s * c - n * a * l;
    }
    invert() {
      const e = this.elements, t = e[0], i = e[1], n = e[2], s = e[3], a = e[4], o = e[5], l = e[6], c = e[7], h = e[8], u = h * a - o * c, d = o * l - h * s, p = c * s - a * l, f = t * u + i * d + n * p;
      if (0 === f) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
      const v = 1 / f;
      return e[0] = u * v, e[1] = (n * c - h * i) * v, e[2] = (o * i - n * a) * v, e[3] = d * v, e[4] = (h * t - n * l) * v, e[5] = (n * s - o * t) * v, e[6] = p * v, e[7] = (i * l - c * t) * v, e[8] = (a * t - i * s) * v, this;
    }
    transpose() {
      let e;
      const t = this.elements;
      return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this;
    }
    getNormalMatrix(e) {
      return this.setFromMatrix4(e).invert().transpose();
    }
    transposeIntoArray(e) {
      const t = this.elements;
      return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this;
    }
    setUvTransform(e, t, i, n, s, a, o) {
      const l = Math.cos(s), c = Math.sin(s);
      return this.set(i * l, i * c, -i * (l * a + c * o) + a + e, -n * c, n * l, -n * (-c * a + l * o) + o + t, 0, 0, 1), this;
    }
    scale(e, t) {
      return this.premultiply(da.makeScale(e, t)), this;
    }
    rotate(e) {
      return this.premultiply(da.makeRotation(-e)), this;
    }
    translate(e, t) {
      return this.premultiply(da.makeTranslation(e, t)), this;
    }
    makeTranslation(e, t) {
      return e.isVector2 ? this.set(1, 0, e.x, 0, 1, e.y, 0, 0, 1) : this.set(1, 0, e, 0, 1, t, 0, 0, 1), this;
    }
    makeRotation(e) {
      const t = Math.cos(e), i = Math.sin(e);
      return this.set(t, -i, 0, i, t, 0, 0, 0, 1), this;
    }
    makeScale(e, t) {
      return this.set(e, 0, 0, 0, t, 0, 0, 0, 1), this;
    }
    equals(e) {
      const t = this.elements, i = e.elements;
      for (let n = 0; n < 9; n++) if (t[n] !== i[n]) return false;
      return true;
    }
    fromArray(e, t = 0) {
      for (let i = 0; i < 9; i++) this.elements[i] = e[i + t];
      return this;
    }
    toArray(e = [], t = 0) {
      const i = this.elements;
      return e[t] = i[0], e[t + 1] = i[1], e[t + 2] = i[2], e[t + 3] = i[3], e[t + 4] = i[4], e[t + 5] = i[5], e[t + 6] = i[6], e[t + 7] = i[7], e[t + 8] = i[8], e;
    }
    clone() {
      return new this.constructor().fromArray(this.elements);
    }
  };
  var da = new Ae();
  function Ph(r) {
    for (let e = r.length - 1; e >= 0; --e) if (r[e] >= 65535) return true;
    return false;
  }
  function ds(r) {
    return document.createElementNS("http://www.w3.org/1999/xhtml", r);
  }
  function gu() {
    const r = ds("canvas");
    return r.style.display = "block", r;
  }
  var vc = {};
  function ir(r) {
    r in vc || (vc[r] = true, console.warn(r));
  }
  var _c = new Ae().set(0.8224621, 0.177538, 0, 0.0331941, 0.9668058, 0, 0.0170827, 0.0723974, 0.9105199);
  var yc = new Ae().set(1.2249401, -0.2249404, 0, -0.0420569, 1.0420571, 0, -0.0196376, -0.0786361, 1.0982735);
  var Tr = { [si]: { transfer: ls, primaries: cs, toReference: (r) => r, fromReference: (r) => r }, [Qe]: { transfer: We, primaries: cs, toReference: (r) => r.convertSRGBToLinear(), fromReference: (r) => r.convertLinearToSRGB() }, [Hs]: { transfer: ls, primaries: hs, toReference: (r) => r.applyMatrix3(yc), fromReference: (r) => r.applyMatrix3(_c) }, [$o]: { transfer: We, primaries: hs, toReference: (r) => r.convertSRGBToLinear().applyMatrix3(yc), fromReference: (r) => r.applyMatrix3(_c).convertLinearToSRGB() } };
  var vu = /* @__PURE__ */ new Set([si, Hs]);
  var ze = { enabled: true, _workingColorSpace: si, get workingColorSpace() {
    return this._workingColorSpace;
  }, set workingColorSpace(r) {
    if (!vu.has(r)) throw new Error(`Unsupported working color space, "${r}".`);
    this._workingColorSpace = r;
  }, convert: function(r, e, t) {
    if (false === this.enabled || e === t || !e || !t) return r;
    const i = Tr[e].toReference;
    return (0, Tr[t].fromReference)(i(r));
  }, fromWorkingColorSpace: function(r, e) {
    return this.convert(r, this._workingColorSpace, e);
  }, toWorkingColorSpace: function(r, e) {
    return this.convert(r, e, this._workingColorSpace);
  }, getPrimaries: function(r) {
    return Tr[r].primaries;
  }, getTransfer: function(r) {
    return r === jt ? ls : Tr[r].transfer;
  } };
  function pn(r) {
    return r < 0.04045 ? 0.0773993808 * r : Math.pow(0.9478672986 * r + 0.0521327014, 2.4);
  }
  function pa(r) {
    return r < 31308e-7 ? 12.92 * r : 1.055 * Math.pow(r, 0.41666) - 0.055;
  }
  var Zi;
  var ps = class {
    static getDataURL(e) {
      if (/^data:/i.test(e.src)) return e.src;
      if ("undefined" == typeof HTMLCanvasElement) return e.src;
      let t;
      if (e instanceof HTMLCanvasElement) t = e;
      else {
        void 0 === Zi && (Zi = ds("canvas")), Zi.width = e.width, Zi.height = e.height;
        const i = Zi.getContext("2d");
        e instanceof ImageData ? i.putImageData(e, 0, 0) : i.drawImage(e, 0, 0, e.width, e.height), t = Zi;
      }
      return t.width > 2048 || t.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", e), t.toDataURL("image/jpeg", 0.6)) : t.toDataURL("image/png");
    }
    static sRGBToLinear(e) {
      if ("undefined" != typeof HTMLImageElement && e instanceof HTMLImageElement || "undefined" != typeof HTMLCanvasElement && e instanceof HTMLCanvasElement || "undefined" != typeof ImageBitmap && e instanceof ImageBitmap) {
        const t = ds("canvas");
        t.width = e.width, t.height = e.height;
        const i = t.getContext("2d");
        i.drawImage(e, 0, 0, e.width, e.height);
        const n = i.getImageData(0, 0, e.width, e.height), s = n.data;
        for (let a = 0; a < s.length; a++) s[a] = 255 * pn(s[a] / 255);
        return i.putImageData(n, 0, 0), t;
      }
      if (e.data) {
        const t = e.data.slice(0);
        for (let i = 0; i < t.length; i++) t instanceof Uint8Array || t instanceof Uint8ClampedArray ? t[i] = Math.floor(255 * pn(t[i] / 255)) : t[i] = pn(t[i]);
        return { data: t, width: e.width, height: e.height };
      }
      return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e;
    }
  };
  var _u = 0;
  var ms = class {
    constructor(e = null) {
      this.isSource = true, Object.defineProperty(this, "id", { value: _u++ }), this.uuid = wn(), this.data = e, this.version = 0;
    }
    set needsUpdate(e) {
      true === e && this.version++;
    }
    toJSON(e) {
      const t = void 0 === e || "string" == typeof e;
      if (!t && void 0 !== e.images[this.uuid]) return e.images[this.uuid];
      const i = { uuid: this.uuid, url: "" }, n = this.data;
      if (null !== n) {
        let s;
        if (Array.isArray(n)) {
          s = [];
          for (let a = 0, o = n.length; a < o; a++) n[a].isDataTexture ? s.push(ma(n[a].image)) : s.push(ma(n[a]));
        } else s = ma(n);
        i.url = s;
      }
      return t || (e.images[this.uuid] = i), i;
    }
  };
  function ma(r) {
    return "undefined" != typeof HTMLImageElement && r instanceof HTMLImageElement || "undefined" != typeof HTMLCanvasElement && r instanceof HTMLCanvasElement || "undefined" != typeof ImageBitmap && r instanceof ImageBitmap ? ps.getDataURL(r) : r.data ? { data: Array.from(r.data), width: r.width, height: r.height, type: r.data.constructor.name } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
  }
  var yu = 0;
  var Ct = class r extends yi {
    constructor(e = r.DEFAULT_IMAGE, t = r.DEFAULT_MAPPING, i = 1001, n = 1001, s = 1006, a = 1008, o = 1023, l = 1009, c = r.DEFAULT_ANISOTROPY, h = "") {
      super(), this.isTexture = true, Object.defineProperty(this, "id", { value: yu++ }), this.uuid = wn(), this.name = "", this.source = new ms(e), this.mipmaps = [], this.mapping = t, this.channel = 0, this.wrapS = i, this.wrapT = n, this.magFilter = s, this.minFilter = a, this.anisotropy = c, this.format = o, this.internalFormat = null, this.type = l, this.offset = new X(0, 0), this.repeat = new X(1, 1), this.center = new X(0, 0), this.rotation = 0, this.matrixAutoUpdate = true, this.matrix = new Ae(), this.generateMipmaps = true, this.premultiplyAlpha = false, this.flipY = true, this.unpackAlignment = 4, "string" == typeof h ? this.colorSpace = h : (ir("THREE.Texture: Property .encoding has been replaced by .colorSpace."), this.colorSpace = h === zi ? Qe : jt), this.userData = {}, this.version = 0, this.onUpdate = null, this.isRenderTargetTexture = false, this.needsPMREMUpdate = false;
    }
    get image() {
      return this.source.data;
    }
    set image(e = null) {
      this.source.data = e;
    }
    updateMatrix() {
      this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      return this.name = e.name, this.source = e.source, this.mipmaps = e.mipmaps.slice(0), this.mapping = e.mapping, this.channel = e.channel, this.wrapS = e.wrapS, this.wrapT = e.wrapT, this.magFilter = e.magFilter, this.minFilter = e.minFilter, this.anisotropy = e.anisotropy, this.format = e.format, this.internalFormat = e.internalFormat, this.type = e.type, this.offset.copy(e.offset), this.repeat.copy(e.repeat), this.center.copy(e.center), this.rotation = e.rotation, this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrix.copy(e.matrix), this.generateMipmaps = e.generateMipmaps, this.premultiplyAlpha = e.premultiplyAlpha, this.flipY = e.flipY, this.unpackAlignment = e.unpackAlignment, this.colorSpace = e.colorSpace, this.userData = JSON.parse(JSON.stringify(e.userData)), this.needsUpdate = true, this;
    }
    toJSON(e) {
      const t = void 0 === e || "string" == typeof e;
      if (!t && void 0 !== e.textures[this.uuid]) return e.textures[this.uuid];
      const i = { metadata: { version: 4.6, type: "Texture", generator: "Texture.toJSON" }, uuid: this.uuid, name: this.name, image: this.source.toJSON(e).uuid, mapping: this.mapping, channel: this.channel, repeat: [this.repeat.x, this.repeat.y], offset: [this.offset.x, this.offset.y], center: [this.center.x, this.center.y], rotation: this.rotation, wrap: [this.wrapS, this.wrapT], format: this.format, internalFormat: this.internalFormat, type: this.type, colorSpace: this.colorSpace, minFilter: this.minFilter, magFilter: this.magFilter, anisotropy: this.anisotropy, flipY: this.flipY, generateMipmaps: this.generateMipmaps, premultiplyAlpha: this.premultiplyAlpha, unpackAlignment: this.unpackAlignment };
      return Object.keys(this.userData).length > 0 && (i.userData = this.userData), t || (e.textures[this.uuid] = i), i;
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
    transformUv(e) {
      if (this.mapping !== Mh) return e;
      if (e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1) switch (this.wrapS) {
        case qa:
          e.x = e.x - Math.floor(e.x);
          break;
        case ni:
          e.x = e.x < 0 ? 0 : 1;
          break;
        case Ya:
          1 === Math.abs(Math.floor(e.x) % 2) ? e.x = Math.ceil(e.x) - e.x : e.x = e.x - Math.floor(e.x);
      }
      if (e.y < 0 || e.y > 1) switch (this.wrapT) {
        case qa:
          e.y = e.y - Math.floor(e.y);
          break;
        case ni:
          e.y = e.y < 0 ? 0 : 1;
          break;
        case Ya:
          1 === Math.abs(Math.floor(e.y) % 2) ? e.y = Math.ceil(e.y) - e.y : e.y = e.y - Math.floor(e.y);
      }
      return this.flipY && (e.y = 1 - e.y), e;
    }
    set needsUpdate(e) {
      true === e && (this.version++, this.source.needsUpdate = true);
    }
    get encoding() {
      return ir("THREE.Texture: Property .encoding has been replaced by .colorSpace."), this.colorSpace === Qe ? zi : Rh;
    }
    set encoding(e) {
      ir("THREE.Texture: Property .encoding has been replaced by .colorSpace."), this.colorSpace = e === zi ? Qe : jt;
    }
  };
  Ct.DEFAULT_IMAGE = null, Ct.DEFAULT_MAPPING = Mh, Ct.DEFAULT_ANISOTROPY = 1;
  var Ge = class r {
    constructor(e = 0, t = 0, i = 0, n = 1) {
      r.prototype.isVector4 = true, this.x = e, this.y = t, this.z = i, this.w = n;
    }
    get width() {
      return this.z;
    }
    set width(e) {
      this.z = e;
    }
    get height() {
      return this.w;
    }
    set height(e) {
      this.w = e;
    }
    set(e, t, i, n) {
      return this.x = e, this.y = t, this.z = i, this.w = n, this;
    }
    setScalar(e) {
      return this.x = e, this.y = e, this.z = e, this.w = e, this;
    }
    setX(e) {
      return this.x = e, this;
    }
    setY(e) {
      return this.y = e, this;
    }
    setZ(e) {
      return this.z = e, this;
    }
    setW(e) {
      return this.w = e, this;
    }
    setComponent(e, t) {
      switch (e) {
        case 0:
          this.x = t;
          break;
        case 1:
          this.y = t;
          break;
        case 2:
          this.z = t;
          break;
        case 3:
          this.w = t;
          break;
        default:
          throw new Error("index is out of range: " + e);
      }
      return this;
    }
    getComponent(e) {
      switch (e) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        case 3:
          return this.w;
        default:
          throw new Error("index is out of range: " + e);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z, this.w);
    }
    copy(e) {
      return this.x = e.x, this.y = e.y, this.z = e.z, this.w = void 0 !== e.w ? e.w : 1, this;
    }
    add(e) {
      return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this;
    }
    addScalar(e) {
      return this.x += e, this.y += e, this.z += e, this.w += e, this;
    }
    addVectors(e, t) {
      return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this;
    }
    addScaledVector(e, t) {
      return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this.w += e.w * t, this;
    }
    sub(e) {
      return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this;
    }
    subScalar(e) {
      return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this;
    }
    subVectors(e, t) {
      return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this;
    }
    multiply(e) {
      return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this;
    }
    multiplyScalar(e) {
      return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this;
    }
    applyMatrix4(e) {
      const t = this.x, i = this.y, n = this.z, s = this.w, a = e.elements;
      return this.x = a[0] * t + a[4] * i + a[8] * n + a[12] * s, this.y = a[1] * t + a[5] * i + a[9] * n + a[13] * s, this.z = a[2] * t + a[6] * i + a[10] * n + a[14] * s, this.w = a[3] * t + a[7] * i + a[11] * n + a[15] * s, this;
    }
    divideScalar(e) {
      return this.multiplyScalar(1 / e);
    }
    setAxisAngleFromQuaternion(e) {
      this.w = 2 * Math.acos(e.w);
      const t = Math.sqrt(1 - e.w * e.w);
      return t < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this;
    }
    setAxisAngleFromRotationMatrix(e) {
      let t, i, n, s;
      const a = 0.01, o = 0.1, l = e.elements, c = l[0], h = l[4], u = l[8], d = l[1], p = l[5], f = l[9], v = l[2], m = l[6], y = l[10];
      if (Math.abs(h - d) < a && Math.abs(u - v) < a && Math.abs(f - m) < a) {
        if (Math.abs(h + d) < o && Math.abs(u + v) < o && Math.abs(f + m) < o && Math.abs(c + p + y - 3) < o) return this.set(1, 0, 0, 0), this;
        t = Math.PI;
        const g = (c + 1) / 2, w = (p + 1) / 2, R = (y + 1) / 2, T = (h + d) / 4, A = (u + v) / 4, N = (f + m) / 4;
        return g > w && g > R ? g < a ? (i = 0, n = 0.707106781, s = 0.707106781) : (i = Math.sqrt(g), n = T / i, s = A / i) : w > R ? w < a ? (i = 0.707106781, n = 0, s = 0.707106781) : (n = Math.sqrt(w), i = T / n, s = N / n) : R < a ? (i = 0.707106781, n = 0.707106781, s = 0) : (s = Math.sqrt(R), i = A / s, n = N / s), this.set(i, n, s, t), this;
      }
      let _ = Math.sqrt((m - f) * (m - f) + (u - v) * (u - v) + (d - h) * (d - h));
      return Math.abs(_) < 1e-3 && (_ = 1), this.x = (m - f) / _, this.y = (u - v) / _, this.z = (d - h) / _, this.w = Math.acos((c + p + y - 1) / 2), this;
    }
    min(e) {
      return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this;
    }
    max(e) {
      return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this;
    }
    clamp(e, t) {
      return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this.z = Math.max(e.z, Math.min(t.z, this.z)), this.w = Math.max(e.w, Math.min(t.w, this.w)), this;
    }
    clampScalar(e, t) {
      return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this.z = Math.max(e, Math.min(t, this.z)), this.w = Math.max(e, Math.min(t, this.w)), this;
    }
    clampLength(e, t) {
      const i = this.length();
      return this.divideScalar(i || 1).multiplyScalar(Math.max(e, Math.min(t, i)));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
    }
    dot(e) {
      return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    setLength(e) {
      return this.normalize().multiplyScalar(e);
    }
    lerp(e, t) {
      return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this;
    }
    lerpVectors(e, t, i) {
      return this.x = e.x + (t.x - e.x) * i, this.y = e.y + (t.y - e.y) * i, this.z = e.z + (t.z - e.z) * i, this.w = e.w + (t.w - e.w) * i, this;
    }
    equals(e) {
      return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
    }
    fromArray(e, t = 0) {
      return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e;
    }
    fromBufferAttribute(e, t) {
      return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this.w = e.getW(t), this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y, yield this.z, yield this.w;
    }
  };
  var $a = class extends yi {
    constructor(e = 1, t = 1, i = {}) {
      super(), this.isRenderTarget = true, this.width = e, this.height = t, this.depth = 1, this.scissor = new Ge(0, 0, e, t), this.scissorTest = false, this.viewport = new Ge(0, 0, e, t);
      const n = { width: e, height: t, depth: 1 };
      void 0 !== i.encoding && (ir("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."), i.colorSpace = i.encoding === zi ? Qe : jt), i = Object.assign({ generateMipmaps: false, internalFormat: null, minFilter: gt, depthBuffer: true, stencilBuffer: false, depthTexture: null, samples: 0 }, i), this.texture = new Ct(n, i.mapping, i.wrapS, i.wrapT, i.magFilter, i.minFilter, i.format, i.type, i.anisotropy, i.colorSpace), this.texture.isRenderTargetTexture = true, this.texture.flipY = false, this.texture.generateMipmaps = i.generateMipmaps, this.texture.internalFormat = i.internalFormat, this.depthBuffer = i.depthBuffer, this.stencilBuffer = i.stencilBuffer, this.depthTexture = i.depthTexture, this.samples = i.samples;
    }
    setSize(e, t, i = 1) {
      this.width === e && this.height === t && this.depth === i || (this.width = e, this.height = t, this.depth = i, this.texture.image.width = e, this.texture.image.height = t, this.texture.image.depth = i, this.dispose()), this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      this.width = e.width, this.height = e.height, this.depth = e.depth, this.scissor.copy(e.scissor), this.scissorTest = e.scissorTest, this.viewport.copy(e.viewport), this.texture = e.texture.clone(), this.texture.isRenderTargetTexture = true;
      const t = Object.assign({}, e.texture.image);
      return this.texture.source = new ms(t), this.depthBuffer = e.depthBuffer, this.stencilBuffer = e.stencilBuffer, null !== e.depthTexture && (this.depthTexture = e.depthTexture.clone()), this.samples = e.samples, this;
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
  };
  var at = class extends $a {
    constructor(e = 1, t = 1, i = {}) {
      super(e, t, i), this.isWebGLRenderTarget = true;
    }
  };
  var fs = class extends Ct {
    constructor(e = null, t = 1, i = 1, n = 1) {
      super(null), this.isDataArrayTexture = true, this.image = { data: e, width: t, height: i, depth: n }, this.magFilter = pt, this.minFilter = pt, this.wrapR = ni, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
    }
  };
  var Qa = class extends Ct {
    constructor(e = null, t = 1, i = 1, n = 1) {
      super(null), this.isData3DTexture = true, this.image = { data: e, width: t, height: i, depth: n }, this.magFilter = pt, this.minFilter = pt, this.wrapR = ni, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
    }
  };
  var qt = class {
    constructor(e = 0, t = 0, i = 0, n = 1) {
      this.isQuaternion = true, this._x = e, this._y = t, this._z = i, this._w = n;
    }
    static slerpFlat(e, t, i, n, s, a, o) {
      let l = i[n + 0], c = i[n + 1], h = i[n + 2], u = i[n + 3];
      const d = s[a + 0], p = s[a + 1], f = s[a + 2], v = s[a + 3];
      if (0 === o) return e[t + 0] = l, e[t + 1] = c, e[t + 2] = h, void (e[t + 3] = u);
      if (1 === o) return e[t + 0] = d, e[t + 1] = p, e[t + 2] = f, void (e[t + 3] = v);
      if (u !== v || l !== d || c !== p || h !== f) {
        let m = 1 - o;
        const y = l * d + c * p + h * f + u * v, _ = y >= 0 ? 1 : -1, g = 1 - y * y;
        if (g > Number.EPSILON) {
          const R = Math.sqrt(g), T = Math.atan2(R, y * _);
          m = Math.sin(m * T) / R, o = Math.sin(o * T) / R;
        }
        const w = o * _;
        if (l = l * m + d * w, c = c * m + p * w, h = h * m + f * w, u = u * m + v * w, m === 1 - o) {
          const R = 1 / Math.sqrt(l * l + c * c + h * h + u * u);
          l *= R, c *= R, h *= R, u *= R;
        }
      }
      e[t] = l, e[t + 1] = c, e[t + 2] = h, e[t + 3] = u;
    }
    static multiplyQuaternionsFlat(e, t, i, n, s, a) {
      const o = i[n], l = i[n + 1], c = i[n + 2], h = i[n + 3], u = s[a], d = s[a + 1], p = s[a + 2], f = s[a + 3];
      return e[t] = o * f + h * u + l * p - c * d, e[t + 1] = l * f + h * d + c * u - o * p, e[t + 2] = c * f + h * p + o * d - l * u, e[t + 3] = h * f - o * u - l * d - c * p, e;
    }
    get x() {
      return this._x;
    }
    set x(e) {
      this._x = e, this._onChangeCallback();
    }
    get y() {
      return this._y;
    }
    set y(e) {
      this._y = e, this._onChangeCallback();
    }
    get z() {
      return this._z;
    }
    set z(e) {
      this._z = e, this._onChangeCallback();
    }
    get w() {
      return this._w;
    }
    set w(e) {
      this._w = e, this._onChangeCallback();
    }
    set(e, t, i, n) {
      return this._x = e, this._y = t, this._z = i, this._w = n, this._onChangeCallback(), this;
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._w);
    }
    copy(e) {
      return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this;
    }
    setFromEuler(e, t = true) {
      const i = e._x, n = e._y, s = e._z, a = e._order, o = Math.cos, l = Math.sin, c = o(i / 2), h = o(n / 2), u = o(s / 2), d = l(i / 2), p = l(n / 2), f = l(s / 2);
      switch (a) {
        case "XYZ":
          this._x = d * h * u + c * p * f, this._y = c * p * u - d * h * f, this._z = c * h * f + d * p * u, this._w = c * h * u - d * p * f;
          break;
        case "YXZ":
          this._x = d * h * u + c * p * f, this._y = c * p * u - d * h * f, this._z = c * h * f - d * p * u, this._w = c * h * u + d * p * f;
          break;
        case "ZXY":
          this._x = d * h * u - c * p * f, this._y = c * p * u + d * h * f, this._z = c * h * f + d * p * u, this._w = c * h * u - d * p * f;
          break;
        case "ZYX":
          this._x = d * h * u - c * p * f, this._y = c * p * u + d * h * f, this._z = c * h * f - d * p * u, this._w = c * h * u + d * p * f;
          break;
        case "YZX":
          this._x = d * h * u + c * p * f, this._y = c * p * u + d * h * f, this._z = c * h * f - d * p * u, this._w = c * h * u - d * p * f;
          break;
        case "XZY":
          this._x = d * h * u - c * p * f, this._y = c * p * u - d * h * f, this._z = c * h * f + d * p * u, this._w = c * h * u + d * p * f;
          break;
        default:
          console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + a);
      }
      return true === t && this._onChangeCallback(), this;
    }
    setFromAxisAngle(e, t) {
      const i = t / 2, n = Math.sin(i);
      return this._x = e.x * n, this._y = e.y * n, this._z = e.z * n, this._w = Math.cos(i), this._onChangeCallback(), this;
    }
    setFromRotationMatrix(e) {
      const t = e.elements, i = t[0], n = t[4], s = t[8], a = t[1], o = t[5], l = t[9], c = t[2], h = t[6], u = t[10], d = i + o + u;
      if (d > 0) {
        const p = 0.5 / Math.sqrt(d + 1);
        this._w = 0.25 / p, this._x = (h - l) * p, this._y = (s - c) * p, this._z = (a - n) * p;
      } else if (i > o && i > u) {
        const p = 2 * Math.sqrt(1 + i - o - u);
        this._w = (h - l) / p, this._x = 0.25 * p, this._y = (n + a) / p, this._z = (s + c) / p;
      } else if (o > u) {
        const p = 2 * Math.sqrt(1 + o - i - u);
        this._w = (s - c) / p, this._x = (n + a) / p, this._y = 0.25 * p, this._z = (l + h) / p;
      } else {
        const p = 2 * Math.sqrt(1 + u - i - o);
        this._w = (a - n) / p, this._x = (s + c) / p, this._y = (l + h) / p, this._z = 0.25 * p;
      }
      return this._onChangeCallback(), this;
    }
    setFromUnitVectors(e, t) {
      let i = e.dot(t) + 1;
      return i < Number.EPSILON ? (i = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = i) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = i)) : (this._x = e.y * t.z - e.z * t.y, this._y = e.z * t.x - e.x * t.z, this._z = e.x * t.y - e.y * t.x, this._w = i), this.normalize();
    }
    angleTo(e) {
      return 2 * Math.acos(Math.abs(st(this.dot(e), -1, 1)));
    }
    rotateTowards(e, t) {
      const i = this.angleTo(e);
      if (0 === i) return this;
      const n = Math.min(1, t / i);
      return this.slerp(e, n), this;
    }
    identity() {
      return this.set(0, 0, 0, 1);
    }
    invert() {
      return this.conjugate();
    }
    conjugate() {
      return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
    }
    dot(e) {
      return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
    }
    lengthSq() {
      return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
    }
    length() {
      return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
    }
    normalize() {
      let e = this.length();
      return 0 === e ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x = this._x * e, this._y = this._y * e, this._z = this._z * e, this._w = this._w * e), this._onChangeCallback(), this;
    }
    multiply(e) {
      return this.multiplyQuaternions(this, e);
    }
    premultiply(e) {
      return this.multiplyQuaternions(e, this);
    }
    multiplyQuaternions(e, t) {
      const i = e._x, n = e._y, s = e._z, a = e._w, o = t._x, l = t._y, c = t._z, h = t._w;
      return this._x = i * h + a * o + n * c - s * l, this._y = n * h + a * l + s * o - i * c, this._z = s * h + a * c + i * l - n * o, this._w = a * h - i * o - n * l - s * c, this._onChangeCallback(), this;
    }
    slerp(e, t) {
      if (0 === t) return this;
      if (1 === t) return this.copy(e);
      const i = this._x, n = this._y, s = this._z, a = this._w;
      let o = a * e._w + i * e._x + n * e._y + s * e._z;
      if (o < 0 ? (this._w = -e._w, this._x = -e._x, this._y = -e._y, this._z = -e._z, o = -o) : this.copy(e), o >= 1) return this._w = a, this._x = i, this._y = n, this._z = s, this;
      const l = 1 - o * o;
      if (l <= Number.EPSILON) {
        const p = 1 - t;
        return this._w = p * a + t * this._w, this._x = p * i + t * this._x, this._y = p * n + t * this._y, this._z = p * s + t * this._z, this.normalize(), this;
      }
      const c = Math.sqrt(l), h = Math.atan2(c, o), u = Math.sin((1 - t) * h) / c, d = Math.sin(t * h) / c;
      return this._w = a * u + this._w * d, this._x = i * u + this._x * d, this._y = n * u + this._y * d, this._z = s * u + this._z * d, this._onChangeCallback(), this;
    }
    slerpQuaternions(e, t, i) {
      return this.copy(e).slerp(t, i);
    }
    random() {
      const e = Math.random(), t = Math.sqrt(1 - e), i = Math.sqrt(e), n = 2 * Math.PI * Math.random(), s = 2 * Math.PI * Math.random();
      return this.set(t * Math.cos(n), i * Math.sin(s), i * Math.cos(s), t * Math.sin(n));
    }
    equals(e) {
      return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
    }
    fromArray(e, t = 0) {
      return this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this._onChangeCallback(), this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e;
    }
    fromBufferAttribute(e, t) {
      return this._x = e.getX(t), this._y = e.getY(t), this._z = e.getZ(t), this._w = e.getW(t), this._onChangeCallback(), this;
    }
    toJSON() {
      return this.toArray();
    }
    _onChange(e) {
      return this._onChangeCallback = e, this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x, yield this._y, yield this._z, yield this._w;
    }
  };
  var E = class r {
    constructor(e = 0, t = 0, i = 0) {
      r.prototype.isVector3 = true, this.x = e, this.y = t, this.z = i;
    }
    set(e, t, i) {
      return void 0 === i && (i = this.z), this.x = e, this.y = t, this.z = i, this;
    }
    setScalar(e) {
      return this.x = e, this.y = e, this.z = e, this;
    }
    setX(e) {
      return this.x = e, this;
    }
    setY(e) {
      return this.y = e, this;
    }
    setZ(e) {
      return this.z = e, this;
    }
    setComponent(e, t) {
      switch (e) {
        case 0:
          this.x = t;
          break;
        case 1:
          this.y = t;
          break;
        case 2:
          this.z = t;
          break;
        default:
          throw new Error("index is out of range: " + e);
      }
      return this;
    }
    getComponent(e) {
      switch (e) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        default:
          throw new Error("index is out of range: " + e);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z);
    }
    copy(e) {
      return this.x = e.x, this.y = e.y, this.z = e.z, this;
    }
    add(e) {
      return this.x += e.x, this.y += e.y, this.z += e.z, this;
    }
    addScalar(e) {
      return this.x += e, this.y += e, this.z += e, this;
    }
    addVectors(e, t) {
      return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this;
    }
    addScaledVector(e, t) {
      return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this;
    }
    sub(e) {
      return this.x -= e.x, this.y -= e.y, this.z -= e.z, this;
    }
    subScalar(e) {
      return this.x -= e, this.y -= e, this.z -= e, this;
    }
    subVectors(e, t) {
      return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this;
    }
    multiply(e) {
      return this.x *= e.x, this.y *= e.y, this.z *= e.z, this;
    }
    multiplyScalar(e) {
      return this.x *= e, this.y *= e, this.z *= e, this;
    }
    multiplyVectors(e, t) {
      return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this;
    }
    applyEuler(e) {
      return this.applyQuaternion(xc.setFromEuler(e));
    }
    applyAxisAngle(e, t) {
      return this.applyQuaternion(xc.setFromAxisAngle(e, t));
    }
    applyMatrix3(e) {
      const t = this.x, i = this.y, n = this.z, s = e.elements;
      return this.x = s[0] * t + s[3] * i + s[6] * n, this.y = s[1] * t + s[4] * i + s[7] * n, this.z = s[2] * t + s[5] * i + s[8] * n, this;
    }
    applyNormalMatrix(e) {
      return this.applyMatrix3(e).normalize();
    }
    applyMatrix4(e) {
      const t = this.x, i = this.y, n = this.z, s = e.elements, a = 1 / (s[3] * t + s[7] * i + s[11] * n + s[15]);
      return this.x = (s[0] * t + s[4] * i + s[8] * n + s[12]) * a, this.y = (s[1] * t + s[5] * i + s[9] * n + s[13]) * a, this.z = (s[2] * t + s[6] * i + s[10] * n + s[14]) * a, this;
    }
    applyQuaternion(e) {
      const t = this.x, i = this.y, n = this.z, s = e.x, a = e.y, o = e.z, l = e.w, c = 2 * (a * n - o * i), h = 2 * (o * t - s * n), u = 2 * (s * i - a * t);
      return this.x = t + l * c + a * u - o * h, this.y = i + l * h + o * c - s * u, this.z = n + l * u + s * h - a * c, this;
    }
    project(e) {
      return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
    }
    unproject(e) {
      return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
    }
    transformDirection(e) {
      const t = this.x, i = this.y, n = this.z, s = e.elements;
      return this.x = s[0] * t + s[4] * i + s[8] * n, this.y = s[1] * t + s[5] * i + s[9] * n, this.z = s[2] * t + s[6] * i + s[10] * n, this.normalize();
    }
    divide(e) {
      return this.x /= e.x, this.y /= e.y, this.z /= e.z, this;
    }
    divideScalar(e) {
      return this.multiplyScalar(1 / e);
    }
    min(e) {
      return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this;
    }
    max(e) {
      return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this;
    }
    clamp(e, t) {
      return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this.z = Math.max(e.z, Math.min(t.z, this.z)), this;
    }
    clampScalar(e, t) {
      return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this.z = Math.max(e, Math.min(t, this.z)), this;
    }
    clampLength(e, t) {
      const i = this.length();
      return this.divideScalar(i || 1).multiplyScalar(Math.max(e, Math.min(t, i)));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
    }
    dot(e) {
      return this.x * e.x + this.y * e.y + this.z * e.z;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    setLength(e) {
      return this.normalize().multiplyScalar(e);
    }
    lerp(e, t) {
      return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this;
    }
    lerpVectors(e, t, i) {
      return this.x = e.x + (t.x - e.x) * i, this.y = e.y + (t.y - e.y) * i, this.z = e.z + (t.z - e.z) * i, this;
    }
    cross(e) {
      return this.crossVectors(this, e);
    }
    crossVectors(e, t) {
      const i = e.x, n = e.y, s = e.z, a = t.x, o = t.y, l = t.z;
      return this.x = n * l - s * o, this.y = s * a - i * l, this.z = i * o - n * a, this;
    }
    projectOnVector(e) {
      const t = e.lengthSq();
      if (0 === t) return this.set(0, 0, 0);
      const i = e.dot(this) / t;
      return this.copy(e).multiplyScalar(i);
    }
    projectOnPlane(e) {
      return fa.copy(this).projectOnVector(e), this.sub(fa);
    }
    reflect(e) {
      return this.sub(fa.copy(e).multiplyScalar(2 * this.dot(e)));
    }
    angleTo(e) {
      const t = Math.sqrt(this.lengthSq() * e.lengthSq());
      if (0 === t) return Math.PI / 2;
      const i = this.dot(e) / t;
      return Math.acos(st(i, -1, 1));
    }
    distanceTo(e) {
      return Math.sqrt(this.distanceToSquared(e));
    }
    distanceToSquared(e) {
      const t = this.x - e.x, i = this.y - e.y, n = this.z - e.z;
      return t * t + i * i + n * n;
    }
    manhattanDistanceTo(e) {
      return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
    }
    setFromSpherical(e) {
      return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
    }
    setFromSphericalCoords(e, t, i) {
      const n = Math.sin(t) * e;
      return this.x = n * Math.sin(i), this.y = Math.cos(t) * e, this.z = n * Math.cos(i), this;
    }
    setFromCylindrical(e) {
      return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
    }
    setFromCylindricalCoords(e, t, i) {
      return this.x = e * Math.sin(t), this.y = i, this.z = e * Math.cos(t), this;
    }
    setFromMatrixPosition(e) {
      const t = e.elements;
      return this.x = t[12], this.y = t[13], this.z = t[14], this;
    }
    setFromMatrixScale(e) {
      const t = this.setFromMatrixColumn(e, 0).length(), i = this.setFromMatrixColumn(e, 1).length(), n = this.setFromMatrixColumn(e, 2).length();
      return this.x = t, this.y = i, this.z = n, this;
    }
    setFromMatrixColumn(e, t) {
      return this.fromArray(e.elements, 4 * t);
    }
    setFromMatrix3Column(e, t) {
      return this.fromArray(e.elements, 3 * t);
    }
    setFromEuler(e) {
      return this.x = e._x, this.y = e._y, this.z = e._z, this;
    }
    setFromColor(e) {
      return this.x = e.r, this.y = e.g, this.z = e.b, this;
    }
    equals(e) {
      return e.x === this.x && e.y === this.y && e.z === this.z;
    }
    fromArray(e, t = 0) {
      return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e;
    }
    fromBufferAttribute(e, t) {
      return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
    }
    randomDirection() {
      const e = 2 * (Math.random() - 0.5), t = Math.random() * Math.PI * 2, i = Math.sqrt(1 - e ** 2);
      return this.x = i * Math.cos(t), this.y = i * Math.sin(t), this.z = e, this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y, yield this.z;
    }
  };
  var fa = new E();
  var xc = new qt();
  var Bt = class {
    constructor(e = new E(1 / 0, 1 / 0, 1 / 0), t = new E(-1 / 0, -1 / 0, -1 / 0)) {
      this.isBox3 = true, this.min = e, this.max = t;
    }
    set(e, t) {
      return this.min.copy(e), this.max.copy(t), this;
    }
    setFromArray(e) {
      this.makeEmpty();
      for (let t = 0, i = e.length; t < i; t += 3) this.expandByPoint(It.fromArray(e, t));
      return this;
    }
    setFromBufferAttribute(e) {
      this.makeEmpty();
      for (let t = 0, i = e.count; t < i; t++) this.expandByPoint(It.fromBufferAttribute(e, t));
      return this;
    }
    setFromPoints(e) {
      this.makeEmpty();
      for (let t = 0, i = e.length; t < i; t++) this.expandByPoint(e[t]);
      return this;
    }
    setFromCenterAndSize(e, t) {
      const i = It.copy(t).multiplyScalar(0.5);
      return this.min.copy(e).sub(i), this.max.copy(e).add(i), this;
    }
    setFromObject(e, t = false) {
      return this.makeEmpty(), this.expandByObject(e, t);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      return this.min.copy(e.min), this.max.copy(e.max), this;
    }
    makeEmpty() {
      return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
    }
    isEmpty() {
      return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
    }
    getCenter(e) {
      return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(0.5);
    }
    getSize(e) {
      return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
    }
    expandByPoint(e) {
      return this.min.min(e), this.max.max(e), this;
    }
    expandByVector(e) {
      return this.min.sub(e), this.max.add(e), this;
    }
    expandByScalar(e) {
      return this.min.addScalar(-e), this.max.addScalar(e), this;
    }
    expandByObject(e, t = false) {
      e.updateWorldMatrix(false, false);
      const i = e.geometry;
      if (void 0 !== i) {
        const s = i.getAttribute("position");
        if (true === t && void 0 !== s && true !== e.isInstancedMesh) for (let a = 0, o = s.count; a < o; a++) true === e.isMesh ? e.getVertexPosition(a, It) : It.fromBufferAttribute(s, a), It.applyMatrix4(e.matrixWorld), this.expandByPoint(It);
        else void 0 !== e.boundingBox ? (null === e.boundingBox && e.computeBoundingBox(), wr.copy(e.boundingBox)) : (null === i.boundingBox && i.computeBoundingBox(), wr.copy(i.boundingBox)), wr.applyMatrix4(e.matrixWorld), this.union(wr);
      }
      const n = e.children;
      for (let s = 0, a = n.length; s < a; s++) this.expandByObject(n[s], t);
      return this;
    }
    containsPoint(e) {
      return !(e.x < this.min.x || e.x > this.max.x || e.y < this.min.y || e.y > this.max.y || e.z < this.min.z || e.z > this.max.z);
    }
    containsBox(e) {
      return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z;
    }
    getParameter(e, t) {
      return t.set((e.x - this.min.x) / (this.max.x - this.min.x), (e.y - this.min.y) / (this.max.y - this.min.y), (e.z - this.min.z) / (this.max.z - this.min.z));
    }
    intersectsBox(e) {
      return !(e.max.x < this.min.x || e.min.x > this.max.x || e.max.y < this.min.y || e.min.y > this.max.y || e.max.z < this.min.z || e.min.z > this.max.z);
    }
    intersectsSphere(e) {
      return this.clampPoint(e.center, It), It.distanceToSquared(e.center) <= e.radius * e.radius;
    }
    intersectsPlane(e) {
      let t, i;
      return e.normal.x > 0 ? (t = e.normal.x * this.min.x, i = e.normal.x * this.max.x) : (t = e.normal.x * this.max.x, i = e.normal.x * this.min.x), e.normal.y > 0 ? (t += e.normal.y * this.min.y, i += e.normal.y * this.max.y) : (t += e.normal.y * this.max.y, i += e.normal.y * this.min.y), e.normal.z > 0 ? (t += e.normal.z * this.min.z, i += e.normal.z * this.max.z) : (t += e.normal.z * this.max.z, i += e.normal.z * this.min.z), t <= -e.constant && i >= -e.constant;
    }
    intersectsTriangle(e) {
      if (this.isEmpty()) return false;
      this.getCenter(Yn), Cr.subVectors(this.max, Yn), Ji.subVectors(e.a, Yn), Ki.subVectors(e.b, Yn), $i.subVectors(e.c, Yn), ci.subVectors(Ki, Ji), hi.subVectors($i, Ki), Ri.subVectors(Ji, $i);
      let t = [0, -ci.z, ci.y, 0, -hi.z, hi.y, 0, -Ri.z, Ri.y, ci.z, 0, -ci.x, hi.z, 0, -hi.x, Ri.z, 0, -Ri.x, -ci.y, ci.x, 0, -hi.y, hi.x, 0, -Ri.y, Ri.x, 0];
      return !!ga(t, Ji, Ki, $i, Cr) && (t = [1, 0, 0, 0, 1, 0, 0, 0, 1], !!ga(t, Ji, Ki, $i, Cr) && (Ar.crossVectors(ci, hi), t = [Ar.x, Ar.y, Ar.z], ga(t, Ji, Ki, $i, Cr)));
    }
    clampPoint(e, t) {
      return t.copy(e).clamp(this.min, this.max);
    }
    distanceToPoint(e) {
      return this.clampPoint(e, It).distanceTo(e);
    }
    getBoundingSphere(e) {
      return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = 0.5 * this.getSize(It).length()), e;
    }
    intersect(e) {
      return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
    }
    union(e) {
      return this.min.min(e.min), this.max.max(e.max), this;
    }
    applyMatrix4(e) {
      return this.isEmpty() || (Jt[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), Jt[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), Jt[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), Jt[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), Jt[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), Jt[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), Jt[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), Jt[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(Jt)), this;
    }
    translate(e) {
      return this.min.add(e), this.max.add(e), this;
    }
    equals(e) {
      return e.min.equals(this.min) && e.max.equals(this.max);
    }
  };
  var Jt = [new E(), new E(), new E(), new E(), new E(), new E(), new E(), new E()];
  var It = new E();
  var wr = new Bt();
  var Ji = new E();
  var Ki = new E();
  var $i = new E();
  var ci = new E();
  var hi = new E();
  var Ri = new E();
  var Yn = new E();
  var Cr = new E();
  var Ar = new E();
  var Pi = new E();
  function ga(r, e, t, i, n) {
    for (let s = 0, a = r.length - 3; s <= a; s += 3) {
      Pi.fromArray(r, s);
      const o = n.x * Math.abs(Pi.x) + n.y * Math.abs(Pi.y) + n.z * Math.abs(Pi.z), l = e.dot(Pi), c = t.dot(Pi), h = i.dot(Pi);
      if (Math.max(-Math.max(l, c, h), Math.min(l, c, h)) > o) return false;
    }
    return true;
  }
  var xu = new Bt();
  var Zn = new E();
  var va = new E();
  var Ht = class {
    constructor(e = new E(), t = -1) {
      this.isSphere = true, this.center = e, this.radius = t;
    }
    set(e, t) {
      return this.center.copy(e), this.radius = t, this;
    }
    setFromPoints(e, t) {
      const i = this.center;
      void 0 !== t ? i.copy(t) : xu.setFromPoints(e).getCenter(i);
      let n = 0;
      for (let s = 0, a = e.length; s < a; s++) n = Math.max(n, i.distanceToSquared(e[s]));
      return this.radius = Math.sqrt(n), this;
    }
    copy(e) {
      return this.center.copy(e.center), this.radius = e.radius, this;
    }
    isEmpty() {
      return this.radius < 0;
    }
    makeEmpty() {
      return this.center.set(0, 0, 0), this.radius = -1, this;
    }
    containsPoint(e) {
      return e.distanceToSquared(this.center) <= this.radius * this.radius;
    }
    distanceToPoint(e) {
      return e.distanceTo(this.center) - this.radius;
    }
    intersectsSphere(e) {
      const t = this.radius + e.radius;
      return e.center.distanceToSquared(this.center) <= t * t;
    }
    intersectsBox(e) {
      return e.intersectsSphere(this);
    }
    intersectsPlane(e) {
      return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
    }
    clampPoint(e, t) {
      const i = this.center.distanceToSquared(e);
      return t.copy(e), i > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)), t;
    }
    getBoundingBox(e) {
      return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
    }
    applyMatrix4(e) {
      return this.center.applyMatrix4(e), this.radius = this.radius * e.getMaxScaleOnAxis(), this;
    }
    translate(e) {
      return this.center.add(e), this;
    }
    expandByPoint(e) {
      if (this.isEmpty()) return this.center.copy(e), this.radius = 0, this;
      Zn.subVectors(e, this.center);
      const t = Zn.lengthSq();
      if (t > this.radius * this.radius) {
        const i = Math.sqrt(t), n = 0.5 * (i - this.radius);
        this.center.addScaledVector(Zn, n / i), this.radius += n;
      }
      return this;
    }
    union(e) {
      return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (true === this.center.equals(e.center) ? this.radius = Math.max(this.radius, e.radius) : (va.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(Zn.copy(e.center).add(va)), this.expandByPoint(Zn.copy(e.center).sub(va))), this);
    }
    equals(e) {
      return e.center.equals(this.center) && e.radius === this.radius;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var Kt = new E();
  var _a = new E();
  var Rr = new E();
  var ui = new E();
  var ya = new E();
  var Pr = new E();
  var xa = new E();
  var yn = class {
    constructor(e = new E(), t = new E(0, 0, -1)) {
      this.origin = e, this.direction = t;
    }
    set(e, t) {
      return this.origin.copy(e), this.direction.copy(t), this;
    }
    copy(e) {
      return this.origin.copy(e.origin), this.direction.copy(e.direction), this;
    }
    at(e, t) {
      return t.copy(this.origin).addScaledVector(this.direction, e);
    }
    lookAt(e) {
      return this.direction.copy(e).sub(this.origin).normalize(), this;
    }
    recast(e) {
      return this.origin.copy(this.at(e, Kt)), this;
    }
    closestPointToPoint(e, t) {
      t.subVectors(e, this.origin);
      const i = t.dot(this.direction);
      return i < 0 ? t.copy(this.origin) : t.copy(this.origin).addScaledVector(this.direction, i);
    }
    distanceToPoint(e) {
      return Math.sqrt(this.distanceSqToPoint(e));
    }
    distanceSqToPoint(e) {
      const t = Kt.subVectors(e, this.origin).dot(this.direction);
      return t < 0 ? this.origin.distanceToSquared(e) : (Kt.copy(this.origin).addScaledVector(this.direction, t), Kt.distanceToSquared(e));
    }
    distanceSqToSegment(e, t, i, n) {
      _a.copy(e).add(t).multiplyScalar(0.5), Rr.copy(t).sub(e).normalize(), ui.copy(this.origin).sub(_a);
      const s = 0.5 * e.distanceTo(t), a = -this.direction.dot(Rr), o = ui.dot(this.direction), l = -ui.dot(Rr), c = ui.lengthSq(), h = Math.abs(1 - a * a);
      let u, d, p, f;
      if (h > 0) if (u = a * l - o, d = a * o - l, f = s * h, u >= 0) if (d >= -f) if (d <= f) {
        const v = 1 / h;
        u *= v, d *= v, p = u * (u + a * d + 2 * o) + d * (a * u + d + 2 * l) + c;
      } else d = s, u = Math.max(0, -(a * d + o)), p = -u * u + d * (d + 2 * l) + c;
      else d = -s, u = Math.max(0, -(a * d + o)), p = -u * u + d * (d + 2 * l) + c;
      else d <= -f ? (u = Math.max(0, -(-a * s + o)), d = u > 0 ? -s : Math.min(Math.max(-s, -l), s), p = -u * u + d * (d + 2 * l) + c) : d <= f ? (u = 0, d = Math.min(Math.max(-s, -l), s), p = d * (d + 2 * l) + c) : (u = Math.max(0, -(a * s + o)), d = u > 0 ? s : Math.min(Math.max(-s, -l), s), p = -u * u + d * (d + 2 * l) + c);
      else d = a > 0 ? -s : s, u = Math.max(0, -(a * d + o)), p = -u * u + d * (d + 2 * l) + c;
      return i && i.copy(this.origin).addScaledVector(this.direction, u), n && n.copy(_a).addScaledVector(Rr, d), p;
    }
    intersectSphere(e, t) {
      Kt.subVectors(e.center, this.origin);
      const i = Kt.dot(this.direction), n = Kt.dot(Kt) - i * i, s = e.radius * e.radius;
      if (n > s) return null;
      const a = Math.sqrt(s - n), o = i - a, l = i + a;
      return l < 0 ? null : o < 0 ? this.at(l, t) : this.at(o, t);
    }
    intersectsSphere(e) {
      return this.distanceSqToPoint(e.center) <= e.radius * e.radius;
    }
    distanceToPlane(e) {
      const t = e.normal.dot(this.direction);
      if (0 === t) return 0 === e.distanceToPoint(this.origin) ? 0 : null;
      const i = -(this.origin.dot(e.normal) + e.constant) / t;
      return i >= 0 ? i : null;
    }
    intersectPlane(e, t) {
      const i = this.distanceToPlane(e);
      return null === i ? null : this.at(i, t);
    }
    intersectsPlane(e) {
      const t = e.distanceToPoint(this.origin);
      if (0 === t) return true;
      return e.normal.dot(this.direction) * t < 0;
    }
    intersectBox(e, t) {
      let i, n, s, a, o, l;
      const c = 1 / this.direction.x, h = 1 / this.direction.y, u = 1 / this.direction.z, d = this.origin;
      return c >= 0 ? (i = (e.min.x - d.x) * c, n = (e.max.x - d.x) * c) : (i = (e.max.x - d.x) * c, n = (e.min.x - d.x) * c), h >= 0 ? (s = (e.min.y - d.y) * h, a = (e.max.y - d.y) * h) : (s = (e.max.y - d.y) * h, a = (e.min.y - d.y) * h), i > a || s > n ? null : ((s > i || isNaN(i)) && (i = s), (a < n || isNaN(n)) && (n = a), u >= 0 ? (o = (e.min.z - d.z) * u, l = (e.max.z - d.z) * u) : (o = (e.max.z - d.z) * u, l = (e.min.z - d.z) * u), i > l || o > n ? null : ((o > i || i != i) && (i = o), (l < n || n != n) && (n = l), n < 0 ? null : this.at(i >= 0 ? i : n, t)));
    }
    intersectsBox(e) {
      return null !== this.intersectBox(e, Kt);
    }
    intersectTriangle(e, t, i, n, s) {
      ya.subVectors(t, e), Pr.subVectors(i, e), xa.crossVectors(ya, Pr);
      let a, o = this.direction.dot(xa);
      if (o > 0) {
        if (n) return null;
        a = 1;
      } else {
        if (!(o < 0)) return null;
        a = -1, o = -o;
      }
      ui.subVectors(this.origin, e);
      const l = a * this.direction.dot(Pr.crossVectors(ui, Pr));
      if (l < 0) return null;
      const c = a * this.direction.dot(ya.cross(ui));
      if (c < 0) return null;
      if (l + c > o) return null;
      const h = -a * ui.dot(xa);
      return h < 0 ? null : this.at(h / o, s);
    }
    applyMatrix4(e) {
      return this.origin.applyMatrix4(e), this.direction.transformDirection(e), this;
    }
    equals(e) {
      return e.origin.equals(this.origin) && e.direction.equals(this.direction);
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var we = class r {
    constructor(e, t, i, n, s, a, o, l, c, h, u, d, p, f, v, m) {
      r.prototype.isMatrix4 = true, this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], void 0 !== e && this.set(e, t, i, n, s, a, o, l, c, h, u, d, p, f, v, m);
    }
    set(e, t, i, n, s, a, o, l, c, h, u, d, p, f, v, m) {
      const y = this.elements;
      return y[0] = e, y[4] = t, y[8] = i, y[12] = n, y[1] = s, y[5] = a, y[9] = o, y[13] = l, y[2] = c, y[6] = h, y[10] = u, y[14] = d, y[3] = p, y[7] = f, y[11] = v, y[15] = m, this;
    }
    identity() {
      return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
    }
    clone() {
      return new r().fromArray(this.elements);
    }
    copy(e) {
      const t = this.elements, i = e.elements;
      return t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = i[3], t[4] = i[4], t[5] = i[5], t[6] = i[6], t[7] = i[7], t[8] = i[8], t[9] = i[9], t[10] = i[10], t[11] = i[11], t[12] = i[12], t[13] = i[13], t[14] = i[14], t[15] = i[15], this;
    }
    copyPosition(e) {
      const t = this.elements, i = e.elements;
      return t[12] = i[12], t[13] = i[13], t[14] = i[14], this;
    }
    setFromMatrix3(e) {
      const t = e.elements;
      return this.set(t[0], t[3], t[6], 0, t[1], t[4], t[7], 0, t[2], t[5], t[8], 0, 0, 0, 0, 1), this;
    }
    extractBasis(e, t, i) {
      return e.setFromMatrixColumn(this, 0), t.setFromMatrixColumn(this, 1), i.setFromMatrixColumn(this, 2), this;
    }
    makeBasis(e, t, i) {
      return this.set(e.x, t.x, i.x, 0, e.y, t.y, i.y, 0, e.z, t.z, i.z, 0, 0, 0, 0, 1), this;
    }
    extractRotation(e) {
      const t = this.elements, i = e.elements, n = 1 / Qi.setFromMatrixColumn(e, 0).length(), s = 1 / Qi.setFromMatrixColumn(e, 1).length(), a = 1 / Qi.setFromMatrixColumn(e, 2).length();
      return t[0] = i[0] * n, t[1] = i[1] * n, t[2] = i[2] * n, t[3] = 0, t[4] = i[4] * s, t[5] = i[5] * s, t[6] = i[6] * s, t[7] = 0, t[8] = i[8] * a, t[9] = i[9] * a, t[10] = i[10] * a, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
    }
    makeRotationFromEuler(e) {
      const t = this.elements, i = e.x, n = e.y, s = e.z, a = Math.cos(i), o = Math.sin(i), l = Math.cos(n), c = Math.sin(n), h = Math.cos(s), u = Math.sin(s);
      if ("XYZ" === e.order) {
        const d = a * h, p = a * u, f = o * h, v = o * u;
        t[0] = l * h, t[4] = -l * u, t[8] = c, t[1] = p + f * c, t[5] = d - v * c, t[9] = -o * l, t[2] = v - d * c, t[6] = f + p * c, t[10] = a * l;
      } else if ("YXZ" === e.order) {
        const d = l * h, p = l * u, f = c * h, v = c * u;
        t[0] = d + v * o, t[4] = f * o - p, t[8] = a * c, t[1] = a * u, t[5] = a * h, t[9] = -o, t[2] = p * o - f, t[6] = v + d * o, t[10] = a * l;
      } else if ("ZXY" === e.order) {
        const d = l * h, p = l * u, f = c * h, v = c * u;
        t[0] = d - v * o, t[4] = -a * u, t[8] = f + p * o, t[1] = p + f * o, t[5] = a * h, t[9] = v - d * o, t[2] = -a * c, t[6] = o, t[10] = a * l;
      } else if ("ZYX" === e.order) {
        const d = a * h, p = a * u, f = o * h, v = o * u;
        t[0] = l * h, t[4] = f * c - p, t[8] = d * c + v, t[1] = l * u, t[5] = v * c + d, t[9] = p * c - f, t[2] = -c, t[6] = o * l, t[10] = a * l;
      } else if ("YZX" === e.order) {
        const d = a * l, p = a * c, f = o * l, v = o * c;
        t[0] = l * h, t[4] = v - d * u, t[8] = f * u + p, t[1] = u, t[5] = a * h, t[9] = -o * h, t[2] = -c * h, t[6] = p * u + f, t[10] = d - v * u;
      } else if ("XZY" === e.order) {
        const d = a * l, p = a * c, f = o * l, v = o * c;
        t[0] = l * h, t[4] = -u, t[8] = c * h, t[1] = d * u + v, t[5] = a * h, t[9] = p * u - f, t[2] = f * u - p, t[6] = o * h, t[10] = v * u + d;
      }
      return t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
    }
    makeRotationFromQuaternion(e) {
      return this.compose(Mu, e, bu);
    }
    lookAt(e, t, i) {
      const n = this.elements;
      return xt.subVectors(e, t), 0 === xt.lengthSq() && (xt.z = 1), xt.normalize(), di.crossVectors(i, xt), 0 === di.lengthSq() && (1 === Math.abs(i.z) ? xt.x += 1e-4 : xt.z += 1e-4, xt.normalize(), di.crossVectors(i, xt)), di.normalize(), Lr.crossVectors(xt, di), n[0] = di.x, n[4] = Lr.x, n[8] = xt.x, n[1] = di.y, n[5] = Lr.y, n[9] = xt.y, n[2] = di.z, n[6] = Lr.z, n[10] = xt.z, this;
    }
    multiply(e) {
      return this.multiplyMatrices(this, e);
    }
    premultiply(e) {
      return this.multiplyMatrices(e, this);
    }
    multiplyMatrices(e, t) {
      const i = e.elements, n = t.elements, s = this.elements, a = i[0], o = i[4], l = i[8], c = i[12], h = i[1], u = i[5], d = i[9], p = i[13], f = i[2], v = i[6], m = i[10], y = i[14], _ = i[3], g = i[7], w = i[11], R = i[15], T = n[0], A = n[4], N = n[8], I = n[12], F = n[1], Z = n[5], P = n[9], W = n[13], j = n[2], oe = n[6], de = n[10], ne = n[14], te = n[3], $ = n[7], k = n[11], G = n[15];
      return s[0] = a * T + o * F + l * j + c * te, s[4] = a * A + o * Z + l * oe + c * $, s[8] = a * N + o * P + l * de + c * k, s[12] = a * I + o * W + l * ne + c * G, s[1] = h * T + u * F + d * j + p * te, s[5] = h * A + u * Z + d * oe + p * $, s[9] = h * N + u * P + d * de + p * k, s[13] = h * I + u * W + d * ne + p * G, s[2] = f * T + v * F + m * j + y * te, s[6] = f * A + v * Z + m * oe + y * $, s[10] = f * N + v * P + m * de + y * k, s[14] = f * I + v * W + m * ne + y * G, s[3] = _ * T + g * F + w * j + R * te, s[7] = _ * A + g * Z + w * oe + R * $, s[11] = _ * N + g * P + w * de + R * k, s[15] = _ * I + g * W + w * ne + R * G, this;
    }
    multiplyScalar(e) {
      const t = this.elements;
      return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this;
    }
    determinant() {
      const e = this.elements, t = e[0], i = e[4], n = e[8], s = e[12], a = e[1], o = e[5], l = e[9], c = e[13], h = e[2], u = e[6], d = e[10], p = e[14];
      return e[3] * (+s * l * u - n * c * u - s * o * d + i * c * d + n * o * p - i * l * p) + e[7] * (+t * l * p - t * c * d + s * a * d - n * a * p + n * c * h - s * l * h) + e[11] * (+t * c * u - t * o * p - s * a * u + i * a * p + s * o * h - i * c * h) + e[15] * (-n * o * h - t * l * u + t * o * d + n * a * u - i * a * d + i * l * h);
    }
    transpose() {
      const e = this.elements;
      let t;
      return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this;
    }
    setPosition(e, t, i) {
      const n = this.elements;
      return e.isVector3 ? (n[12] = e.x, n[13] = e.y, n[14] = e.z) : (n[12] = e, n[13] = t, n[14] = i), this;
    }
    invert() {
      const e = this.elements, t = e[0], i = e[1], n = e[2], s = e[3], a = e[4], o = e[5], l = e[6], c = e[7], h = e[8], u = e[9], d = e[10], p = e[11], f = e[12], v = e[13], m = e[14], y = e[15], _ = u * m * c - v * d * c + v * l * p - o * m * p - u * l * y + o * d * y, g = f * d * c - h * m * c - f * l * p + a * m * p + h * l * y - a * d * y, w = h * v * c - f * u * c + f * o * p - a * v * p - h * o * y + a * u * y, R = f * u * l - h * v * l - f * o * d + a * v * d + h * o * m - a * u * m, T = t * _ + i * g + n * w + s * R;
      if (0 === T) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      const A = 1 / T;
      return e[0] = _ * A, e[1] = (v * d * s - u * m * s - v * n * p + i * m * p + u * n * y - i * d * y) * A, e[2] = (o * m * s - v * l * s + v * n * c - i * m * c - o * n * y + i * l * y) * A, e[3] = (u * l * s - o * d * s - u * n * c + i * d * c + o * n * p - i * l * p) * A, e[4] = g * A, e[5] = (h * m * s - f * d * s + f * n * p - t * m * p - h * n * y + t * d * y) * A, e[6] = (f * l * s - a * m * s - f * n * c + t * m * c + a * n * y - t * l * y) * A, e[7] = (a * d * s - h * l * s + h * n * c - t * d * c - a * n * p + t * l * p) * A, e[8] = w * A, e[9] = (f * u * s - h * v * s - f * i * p + t * v * p + h * i * y - t * u * y) * A, e[10] = (a * v * s - f * o * s + f * i * c - t * v * c - a * i * y + t * o * y) * A, e[11] = (h * o * s - a * u * s - h * i * c + t * u * c + a * i * p - t * o * p) * A, e[12] = R * A, e[13] = (h * v * n - f * u * n + f * i * d - t * v * d - h * i * m + t * u * m) * A, e[14] = (f * o * n - a * v * n - f * i * l + t * v * l + a * i * m - t * o * m) * A, e[15] = (a * u * n - h * o * n + h * i * l - t * u * l - a * i * d + t * o * d) * A, this;
    }
    scale(e) {
      const t = this.elements, i = e.x, n = e.y, s = e.z;
      return t[0] *= i, t[4] *= n, t[8] *= s, t[1] *= i, t[5] *= n, t[9] *= s, t[2] *= i, t[6] *= n, t[10] *= s, t[3] *= i, t[7] *= n, t[11] *= s, this;
    }
    getMaxScaleOnAxis() {
      const e = this.elements, t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2], i = e[4] * e[4] + e[5] * e[5] + e[6] * e[6], n = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
      return Math.sqrt(Math.max(t, i, n));
    }
    makeTranslation(e, t, i) {
      return e.isVector3 ? this.set(1, 0, 0, e.x, 0, 1, 0, e.y, 0, 0, 1, e.z, 0, 0, 0, 1) : this.set(1, 0, 0, e, 0, 1, 0, t, 0, 0, 1, i, 0, 0, 0, 1), this;
    }
    makeRotationX(e) {
      const t = Math.cos(e), i = Math.sin(e);
      return this.set(1, 0, 0, 0, 0, t, -i, 0, 0, i, t, 0, 0, 0, 0, 1), this;
    }
    makeRotationY(e) {
      const t = Math.cos(e), i = Math.sin(e);
      return this.set(t, 0, i, 0, 0, 1, 0, 0, -i, 0, t, 0, 0, 0, 0, 1), this;
    }
    makeRotationZ(e) {
      const t = Math.cos(e), i = Math.sin(e);
      return this.set(t, -i, 0, 0, i, t, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
    }
    makeRotationAxis(e, t) {
      const i = Math.cos(t), n = Math.sin(t), s = 1 - i, a = e.x, o = e.y, l = e.z, c = s * a, h = s * o;
      return this.set(c * a + i, c * o - n * l, c * l + n * o, 0, c * o + n * l, h * o + i, h * l - n * a, 0, c * l - n * o, h * l + n * a, s * l * l + i, 0, 0, 0, 0, 1), this;
    }
    makeScale(e, t, i) {
      return this.set(e, 0, 0, 0, 0, t, 0, 0, 0, 0, i, 0, 0, 0, 0, 1), this;
    }
    makeShear(e, t, i, n, s, a) {
      return this.set(1, i, s, 0, e, 1, a, 0, t, n, 1, 0, 0, 0, 0, 1), this;
    }
    compose(e, t, i) {
      const n = this.elements, s = t._x, a = t._y, o = t._z, l = t._w, c = s + s, h = a + a, u = o + o, d = s * c, p = s * h, f = s * u, v = a * h, m = a * u, y = o * u, _ = l * c, g = l * h, w = l * u, R = i.x, T = i.y, A = i.z;
      return n[0] = (1 - (v + y)) * R, n[1] = (p + w) * R, n[2] = (f - g) * R, n[3] = 0, n[4] = (p - w) * T, n[5] = (1 - (d + y)) * T, n[6] = (m + _) * T, n[7] = 0, n[8] = (f + g) * A, n[9] = (m - _) * A, n[10] = (1 - (d + v)) * A, n[11] = 0, n[12] = e.x, n[13] = e.y, n[14] = e.z, n[15] = 1, this;
    }
    decompose(e, t, i) {
      const n = this.elements;
      let s = Qi.set(n[0], n[1], n[2]).length();
      const a = Qi.set(n[4], n[5], n[6]).length(), o = Qi.set(n[8], n[9], n[10]).length();
      this.determinant() < 0 && (s = -s), e.x = n[12], e.y = n[13], e.z = n[14], Dt.copy(this);
      const l = 1 / s, c = 1 / a, h = 1 / o;
      return Dt.elements[0] *= l, Dt.elements[1] *= l, Dt.elements[2] *= l, Dt.elements[4] *= c, Dt.elements[5] *= c, Dt.elements[6] *= c, Dt.elements[8] *= h, Dt.elements[9] *= h, Dt.elements[10] *= h, t.setFromRotationMatrix(Dt), i.x = s, i.y = a, i.z = o, this;
    }
    makePerspective(e, t, i, n, s, a, o = 2e3) {
      const l = this.elements, c = 2 * s / (t - e), h = 2 * s / (i - n), u = (t + e) / (t - e), d = (i + n) / (i - n);
      let p, f;
      if (o === _n) p = -(a + s) / (a - s), f = -2 * a * s / (a - s);
      else {
        if (o !== us) throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
        p = -a / (a - s), f = -a * s / (a - s);
      }
      return l[0] = c, l[4] = 0, l[8] = u, l[12] = 0, l[1] = 0, l[5] = h, l[9] = d, l[13] = 0, l[2] = 0, l[6] = 0, l[10] = p, l[14] = f, l[3] = 0, l[7] = 0, l[11] = -1, l[15] = 0, this;
    }
    makeOrthographic(e, t, i, n, s, a, o = 2e3) {
      const l = this.elements, c = 1 / (t - e), h = 1 / (i - n), u = 1 / (a - s), d = (t + e) * c, p = (i + n) * h;
      let f, v;
      if (o === _n) f = (a + s) * u, v = -2 * u;
      else {
        if (o !== us) throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
        f = s * u, v = -1 * u;
      }
      return l[0] = 2 * c, l[4] = 0, l[8] = 0, l[12] = -d, l[1] = 0, l[5] = 2 * h, l[9] = 0, l[13] = -p, l[2] = 0, l[6] = 0, l[10] = v, l[14] = -f, l[3] = 0, l[7] = 0, l[11] = 0, l[15] = 1, this;
    }
    equals(e) {
      const t = this.elements, i = e.elements;
      for (let n = 0; n < 16; n++) if (t[n] !== i[n]) return false;
      return true;
    }
    fromArray(e, t = 0) {
      for (let i = 0; i < 16; i++) this.elements[i] = e[i + t];
      return this;
    }
    toArray(e = [], t = 0) {
      const i = this.elements;
      return e[t] = i[0], e[t + 1] = i[1], e[t + 2] = i[2], e[t + 3] = i[3], e[t + 4] = i[4], e[t + 5] = i[5], e[t + 6] = i[6], e[t + 7] = i[7], e[t + 8] = i[8], e[t + 9] = i[9], e[t + 10] = i[10], e[t + 11] = i[11], e[t + 12] = i[12], e[t + 13] = i[13], e[t + 14] = i[14], e[t + 15] = i[15], e;
    }
  };
  var Qi = new E();
  var Dt = new we();
  var Mu = new E(0, 0, 0);
  var bu = new E(1, 1, 1);
  var di = new E();
  var Lr = new E();
  var xt = new E();
  var Mc = new we();
  var bc = new qt();
  var gs = class r {
    constructor(e = 0, t = 0, i = 0, n = r.DEFAULT_ORDER) {
      this.isEuler = true, this._x = e, this._y = t, this._z = i, this._order = n;
    }
    get x() {
      return this._x;
    }
    set x(e) {
      this._x = e, this._onChangeCallback();
    }
    get y() {
      return this._y;
    }
    set y(e) {
      this._y = e, this._onChangeCallback();
    }
    get z() {
      return this._z;
    }
    set z(e) {
      this._z = e, this._onChangeCallback();
    }
    get order() {
      return this._order;
    }
    set order(e) {
      this._order = e, this._onChangeCallback();
    }
    set(e, t, i, n = this._order) {
      return this._x = e, this._y = t, this._z = i, this._order = n, this._onChangeCallback(), this;
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._order);
    }
    copy(e) {
      return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this._onChangeCallback(), this;
    }
    setFromRotationMatrix(e, t = this._order, i = true) {
      const n = e.elements, s = n[0], a = n[4], o = n[8], l = n[1], c = n[5], h = n[9], u = n[2], d = n[6], p = n[10];
      switch (t) {
        case "XYZ":
          this._y = Math.asin(st(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(-h, p), this._z = Math.atan2(-a, s)) : (this._x = Math.atan2(d, c), this._z = 0);
          break;
        case "YXZ":
          this._x = Math.asin(-st(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._y = Math.atan2(o, p), this._z = Math.atan2(l, c)) : (this._y = Math.atan2(-u, s), this._z = 0);
          break;
        case "ZXY":
          this._x = Math.asin(st(d, -1, 1)), Math.abs(d) < 0.9999999 ? (this._y = Math.atan2(-u, p), this._z = Math.atan2(-a, c)) : (this._y = 0, this._z = Math.atan2(l, s));
          break;
        case "ZYX":
          this._y = Math.asin(-st(u, -1, 1)), Math.abs(u) < 0.9999999 ? (this._x = Math.atan2(d, p), this._z = Math.atan2(l, s)) : (this._x = 0, this._z = Math.atan2(-a, c));
          break;
        case "YZX":
          this._z = Math.asin(st(l, -1, 1)), Math.abs(l) < 0.9999999 ? (this._x = Math.atan2(-h, c), this._y = Math.atan2(-u, s)) : (this._x = 0, this._y = Math.atan2(o, p));
          break;
        case "XZY":
          this._z = Math.asin(-st(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(d, c), this._y = Math.atan2(o, s)) : (this._x = Math.atan2(-h, p), this._y = 0);
          break;
        default:
          console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + t);
      }
      return this._order = t, true === i && this._onChangeCallback(), this;
    }
    setFromQuaternion(e, t, i) {
      return Mc.makeRotationFromQuaternion(e), this.setFromRotationMatrix(Mc, t, i);
    }
    setFromVector3(e, t = this._order) {
      return this.set(e.x, e.y, e.z, t);
    }
    reorder(e) {
      return bc.setFromEuler(this), this.setFromQuaternion(bc, e);
    }
    equals(e) {
      return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order;
    }
    fromArray(e) {
      return this._x = e[0], this._y = e[1], this._z = e[2], void 0 !== e[3] && (this._order = e[3]), this._onChangeCallback(), this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._order, e;
    }
    _onChange(e) {
      return this._onChangeCallback = e, this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x, yield this._y, yield this._z, yield this._order;
    }
  };
  gs.DEFAULT_ORDER = "XYZ";
  var vs = class {
    constructor() {
      this.mask = 1;
    }
    set(e) {
      this.mask = (1 << e | 0) >>> 0;
    }
    enable(e) {
      this.mask |= 1 << e | 0;
    }
    enableAll() {
      this.mask = -1;
    }
    toggle(e) {
      this.mask ^= 1 << e | 0;
    }
    disable(e) {
      this.mask &= ~(1 << e | 0);
    }
    disableAll() {
      this.mask = 0;
    }
    test(e) {
      return 0 != (this.mask & e.mask);
    }
    isEnabled(e) {
      return 0 != (this.mask & (1 << e | 0));
    }
  };
  var Su = 0;
  var Sc = new E();
  var en = new qt();
  var $t = new we();
  var Ir = new E();
  var Jn = new E();
  var Eu = new E();
  var Tu = new qt();
  var Ec = new E(1, 0, 0);
  var Tc = new E(0, 1, 0);
  var wc = new E(0, 0, 1);
  var wu = { type: "added" };
  var Cu = { type: "removed" };
  var _t = class r extends yi {
    constructor() {
      super(), this.isObject3D = true, Object.defineProperty(this, "id", { value: Su++ }), this.uuid = wn(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = r.DEFAULT_UP.clone();
      const e = new E(), t = new gs(), i = new qt(), n = new E(1, 1, 1);
      t._onChange((function() {
        i.setFromEuler(t, false);
      })), i._onChange((function() {
        t.setFromQuaternion(i, void 0, false);
      })), Object.defineProperties(this, { position: { configurable: true, enumerable: true, value: e }, rotation: { configurable: true, enumerable: true, value: t }, quaternion: { configurable: true, enumerable: true, value: i }, scale: { configurable: true, enumerable: true, value: n }, modelViewMatrix: { value: new we() }, normalMatrix: { value: new Ae() } }), this.matrix = new we(), this.matrixWorld = new we(), this.matrixAutoUpdate = r.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = false, this.layers = new vs(), this.visible = true, this.castShadow = false, this.receiveShadow = false, this.frustumCulled = true, this.renderOrder = 0, this.animations = [], this.userData = {};
    }
    onBeforeShadow() {
    }
    onAfterShadow() {
    }
    onBeforeRender() {
    }
    onAfterRender() {
    }
    applyMatrix4(e) {
      this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e), this.matrix.decompose(this.position, this.quaternion, this.scale);
    }
    applyQuaternion(e) {
      return this.quaternion.premultiply(e), this;
    }
    setRotationFromAxisAngle(e, t) {
      this.quaternion.setFromAxisAngle(e, t);
    }
    setRotationFromEuler(e) {
      this.quaternion.setFromEuler(e, true);
    }
    setRotationFromMatrix(e) {
      this.quaternion.setFromRotationMatrix(e);
    }
    setRotationFromQuaternion(e) {
      this.quaternion.copy(e);
    }
    rotateOnAxis(e, t) {
      return en.setFromAxisAngle(e, t), this.quaternion.multiply(en), this;
    }
    rotateOnWorldAxis(e, t) {
      return en.setFromAxisAngle(e, t), this.quaternion.premultiply(en), this;
    }
    rotateX(e) {
      return this.rotateOnAxis(Ec, e);
    }
    rotateY(e) {
      return this.rotateOnAxis(Tc, e);
    }
    rotateZ(e) {
      return this.rotateOnAxis(wc, e);
    }
    translateOnAxis(e, t) {
      return Sc.copy(e).applyQuaternion(this.quaternion), this.position.add(Sc.multiplyScalar(t)), this;
    }
    translateX(e) {
      return this.translateOnAxis(Ec, e);
    }
    translateY(e) {
      return this.translateOnAxis(Tc, e);
    }
    translateZ(e) {
      return this.translateOnAxis(wc, e);
    }
    localToWorld(e) {
      return this.updateWorldMatrix(true, false), e.applyMatrix4(this.matrixWorld);
    }
    worldToLocal(e) {
      return this.updateWorldMatrix(true, false), e.applyMatrix4($t.copy(this.matrixWorld).invert());
    }
    lookAt(e, t, i) {
      e.isVector3 ? Ir.copy(e) : Ir.set(e, t, i);
      const n = this.parent;
      this.updateWorldMatrix(true, false), Jn.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? $t.lookAt(Jn, Ir, this.up) : $t.lookAt(Ir, Jn, this.up), this.quaternion.setFromRotationMatrix($t), n && ($t.extractRotation(n.matrixWorld), en.setFromRotationMatrix($t), this.quaternion.premultiply(en.invert()));
    }
    add(e) {
      if (arguments.length > 1) {
        for (let t = 0; t < arguments.length; t++) this.add(arguments[t]);
        return this;
      }
      return e === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", e), this) : (e && e.isObject3D ? (null !== e.parent && e.parent.remove(e), e.parent = this, this.children.push(e), e.dispatchEvent(wu)) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", e), this);
    }
    remove(e) {
      if (arguments.length > 1) {
        for (let i = 0; i < arguments.length; i++) this.remove(arguments[i]);
        return this;
      }
      const t = this.children.indexOf(e);
      return -1 !== t && (e.parent = null, this.children.splice(t, 1), e.dispatchEvent(Cu)), this;
    }
    removeFromParent() {
      const e = this.parent;
      return null !== e && e.remove(this), this;
    }
    clear() {
      return this.remove(...this.children);
    }
    attach(e) {
      return this.updateWorldMatrix(true, false), $t.copy(this.matrixWorld).invert(), null !== e.parent && (e.parent.updateWorldMatrix(true, false), $t.multiply(e.parent.matrixWorld)), e.applyMatrix4($t), this.add(e), e.updateWorldMatrix(false, true), this;
    }
    getObjectById(e) {
      return this.getObjectByProperty("id", e);
    }
    getObjectByName(e) {
      return this.getObjectByProperty("name", e);
    }
    getObjectByProperty(e, t) {
      if (this[e] === t) return this;
      for (let i = 0, n = this.children.length; i < n; i++) {
        const s = this.children[i].getObjectByProperty(e, t);
        if (void 0 !== s) return s;
      }
    }
    getObjectsByProperty(e, t, i = []) {
      this[e] === t && i.push(this);
      const n = this.children;
      for (let s = 0, a = n.length; s < a; s++) n[s].getObjectsByProperty(e, t, i);
      return i;
    }
    getWorldPosition(e) {
      return this.updateWorldMatrix(true, false), e.setFromMatrixPosition(this.matrixWorld);
    }
    getWorldQuaternion(e) {
      return this.updateWorldMatrix(true, false), this.matrixWorld.decompose(Jn, e, Eu), e;
    }
    getWorldScale(e) {
      return this.updateWorldMatrix(true, false), this.matrixWorld.decompose(Jn, Tu, e), e;
    }
    getWorldDirection(e) {
      this.updateWorldMatrix(true, false);
      const t = this.matrixWorld.elements;
      return e.set(t[8], t[9], t[10]).normalize();
    }
    raycast() {
    }
    traverse(e) {
      e(this);
      const t = this.children;
      for (let i = 0, n = t.length; i < n; i++) t[i].traverse(e);
    }
    traverseVisible(e) {
      if (false === this.visible) return;
      e(this);
      const t = this.children;
      for (let i = 0, n = t.length; i < n; i++) t[i].traverseVisible(e);
    }
    traverseAncestors(e) {
      const t = this.parent;
      null !== t && (e(t), t.traverseAncestors(e));
    }
    updateMatrix() {
      this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = true;
    }
    updateMatrixWorld(e) {
      this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e) && (null === this.parent ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), this.matrixWorldNeedsUpdate = false, e = true);
      const t = this.children;
      for (let i = 0, n = t.length; i < n; i++) {
        const s = t[i];
        true !== s.matrixWorldAutoUpdate && true !== e || s.updateMatrixWorld(e);
      }
    }
    updateWorldMatrix(e, t) {
      const i = this.parent;
      if (true === e && null !== i && true === i.matrixWorldAutoUpdate && i.updateWorldMatrix(true, false), this.matrixAutoUpdate && this.updateMatrix(), null === this.parent ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), true === t) {
        const n = this.children;
        for (let s = 0, a = n.length; s < a; s++) {
          const o = n[s];
          true === o.matrixWorldAutoUpdate && o.updateWorldMatrix(false, true);
        }
      }
    }
    toJSON(e) {
      const t = void 0 === e || "string" == typeof e, i = {};
      t && (e = { geometries: {}, materials: {}, textures: {}, images: {}, shapes: {}, skeletons: {}, animations: {}, nodes: {} }, i.metadata = { version: 4.6, type: "Object", generator: "Object3D.toJSON" });
      const n = {};
      function s(o, l) {
        return void 0 === o[l.uuid] && (o[l.uuid] = l.toJSON(e)), l.uuid;
      }
      if (n.uuid = this.uuid, n.type = this.type, "" !== this.name && (n.name = this.name), true === this.castShadow && (n.castShadow = true), true === this.receiveShadow && (n.receiveShadow = true), false === this.visible && (n.visible = false), false === this.frustumCulled && (n.frustumCulled = false), 0 !== this.renderOrder && (n.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (n.userData = this.userData), n.layers = this.layers.mask, n.matrix = this.matrix.toArray(), n.up = this.up.toArray(), false === this.matrixAutoUpdate && (n.matrixAutoUpdate = false), this.isInstancedMesh && (n.type = "InstancedMesh", n.count = this.count, n.instanceMatrix = this.instanceMatrix.toJSON(), null !== this.instanceColor && (n.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (n.type = "BatchedMesh", n.perObjectFrustumCulled = this.perObjectFrustumCulled, n.sortObjects = this.sortObjects, n.drawRanges = this._drawRanges, n.reservedRanges = this._reservedRanges, n.visibility = this._visibility, n.active = this._active, n.bounds = this._bounds.map(((o) => ({ boxInitialized: o.boxInitialized, boxMin: o.box.min.toArray(), boxMax: o.box.max.toArray(), sphereInitialized: o.sphereInitialized, sphereRadius: o.sphere.radius, sphereCenter: o.sphere.center.toArray() }))), n.maxGeometryCount = this._maxGeometryCount, n.maxVertexCount = this._maxVertexCount, n.maxIndexCount = this._maxIndexCount, n.geometryInitialized = this._geometryInitialized, n.geometryCount = this._geometryCount, n.matricesTexture = this._matricesTexture.toJSON(e), null !== this.boundingSphere && (n.boundingSphere = { center: n.boundingSphere.center.toArray(), radius: n.boundingSphere.radius }), null !== this.boundingBox && (n.boundingBox = { min: n.boundingBox.min.toArray(), max: n.boundingBox.max.toArray() })), this.isScene) this.background && (this.background.isColor ? n.background = this.background.toJSON() : this.background.isTexture && (n.background = this.background.toJSON(e).uuid)), this.environment && this.environment.isTexture && true !== this.environment.isRenderTargetTexture && (n.environment = this.environment.toJSON(e).uuid);
      else if (this.isMesh || this.isLine || this.isPoints) {
        n.geometry = s(e.geometries, this.geometry);
        const o = this.geometry.parameters;
        if (void 0 !== o && void 0 !== o.shapes) {
          const l = o.shapes;
          if (Array.isArray(l)) for (let c = 0, h = l.length; c < h; c++) {
            const u = l[c];
            s(e.shapes, u);
          }
          else s(e.shapes, l);
        }
      }
      if (this.isSkinnedMesh && (n.bindMode = this.bindMode, n.bindMatrix = this.bindMatrix.toArray(), void 0 !== this.skeleton && (s(e.skeletons, this.skeleton), n.skeleton = this.skeleton.uuid)), void 0 !== this.material) if (Array.isArray(this.material)) {
        const o = [];
        for (let l = 0, c = this.material.length; l < c; l++) o.push(s(e.materials, this.material[l]));
        n.material = o;
      } else n.material = s(e.materials, this.material);
      if (this.children.length > 0) {
        n.children = [];
        for (let o = 0; o < this.children.length; o++) n.children.push(this.children[o].toJSON(e).object);
      }
      if (this.animations.length > 0) {
        n.animations = [];
        for (let o = 0; o < this.animations.length; o++) {
          const l = this.animations[o];
          n.animations.push(s(e.animations, l));
        }
      }
      if (t) {
        const o = a(e.geometries), l = a(e.materials), c = a(e.textures), h = a(e.images), u = a(e.shapes), d = a(e.skeletons), p = a(e.animations), f = a(e.nodes);
        o.length > 0 && (i.geometries = o), l.length > 0 && (i.materials = l), c.length > 0 && (i.textures = c), h.length > 0 && (i.images = h), u.length > 0 && (i.shapes = u), d.length > 0 && (i.skeletons = d), p.length > 0 && (i.animations = p), f.length > 0 && (i.nodes = f);
      }
      return i.object = n, i;
      function a(o) {
        const l = [];
        for (const c in o) {
          const h = o[c];
          delete h.metadata, l.push(h);
        }
        return l;
      }
    }
    clone(e) {
      return new this.constructor().copy(this, e);
    }
    copy(e, t = true) {
      if (this.name = e.name, this.up.copy(e.up), this.position.copy(e.position), this.rotation.order = e.rotation.order, this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.matrix.copy(e.matrix), this.matrixWorld.copy(e.matrixWorld), this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate, this.layers.mask = e.layers.mask, this.visible = e.visible, this.castShadow = e.castShadow, this.receiveShadow = e.receiveShadow, this.frustumCulled = e.frustumCulled, this.renderOrder = e.renderOrder, this.animations = e.animations.slice(), this.userData = JSON.parse(JSON.stringify(e.userData)), true === t) for (let i = 0; i < e.children.length; i++) {
        const n = e.children[i];
        this.add(n.clone());
      }
      return this;
    }
  };
  _t.DEFAULT_UP = new E(0, 1, 0), _t.DEFAULT_MATRIX_AUTO_UPDATE = true, _t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;
  var Ut = new E();
  var Qt = new E();
  var Ma = new E();
  var ei = new E();
  var tn = new E();
  var nn = new E();
  var Cc = new E();
  var ba = new E();
  var Sa = new E();
  var Ea = new E();
  var Dr = false;
  var Fi = class r {
    constructor(e = new E(), t = new E(), i = new E()) {
      this.a = e, this.b = t, this.c = i;
    }
    static getNormal(e, t, i, n) {
      n.subVectors(i, t), Ut.subVectors(e, t), n.cross(Ut);
      const s = n.lengthSq();
      return s > 0 ? n.multiplyScalar(1 / Math.sqrt(s)) : n.set(0, 0, 0);
    }
    static getBarycoord(e, t, i, n, s) {
      Ut.subVectors(n, t), Qt.subVectors(i, t), Ma.subVectors(e, t);
      const a = Ut.dot(Ut), o = Ut.dot(Qt), l = Ut.dot(Ma), c = Qt.dot(Qt), h = Qt.dot(Ma), u = a * c - o * o;
      if (0 === u) return s.set(0, 0, 0), null;
      const d = 1 / u, p = (c * l - o * h) * d, f = (a * h - o * l) * d;
      return s.set(1 - p - f, f, p);
    }
    static containsPoint(e, t, i, n) {
      return null !== this.getBarycoord(e, t, i, n, ei) && (ei.x >= 0 && ei.y >= 0 && ei.x + ei.y <= 1);
    }
    static getUV(e, t, i, n, s, a, o, l) {
      return false === Dr && (console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."), Dr = true), this.getInterpolation(e, t, i, n, s, a, o, l);
    }
    static getInterpolation(e, t, i, n, s, a, o, l) {
      return null === this.getBarycoord(e, t, i, n, ei) ? (l.x = 0, l.y = 0, "z" in l && (l.z = 0), "w" in l && (l.w = 0), null) : (l.setScalar(0), l.addScaledVector(s, ei.x), l.addScaledVector(a, ei.y), l.addScaledVector(o, ei.z), l);
    }
    static isFrontFacing(e, t, i, n) {
      return Ut.subVectors(i, t), Qt.subVectors(e, t), Ut.cross(Qt).dot(n) < 0;
    }
    set(e, t, i) {
      return this.a.copy(e), this.b.copy(t), this.c.copy(i), this;
    }
    setFromPointsAndIndices(e, t, i, n) {
      return this.a.copy(e[t]), this.b.copy(e[i]), this.c.copy(e[n]), this;
    }
    setFromAttributeAndIndices(e, t, i, n) {
      return this.a.fromBufferAttribute(e, t), this.b.fromBufferAttribute(e, i), this.c.fromBufferAttribute(e, n), this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this;
    }
    getArea() {
      return Ut.subVectors(this.c, this.b), Qt.subVectors(this.a, this.b), 0.5 * Ut.cross(Qt).length();
    }
    getMidpoint(e) {
      return e.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
    }
    getNormal(e) {
      return r.getNormal(this.a, this.b, this.c, e);
    }
    getPlane(e) {
      return e.setFromCoplanarPoints(this.a, this.b, this.c);
    }
    getBarycoord(e, t) {
      return r.getBarycoord(e, this.a, this.b, this.c, t);
    }
    getUV(e, t, i, n, s) {
      return false === Dr && (console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."), Dr = true), r.getInterpolation(e, this.a, this.b, this.c, t, i, n, s);
    }
    getInterpolation(e, t, i, n, s) {
      return r.getInterpolation(e, this.a, this.b, this.c, t, i, n, s);
    }
    containsPoint(e) {
      return r.containsPoint(e, this.a, this.b, this.c);
    }
    isFrontFacing(e) {
      return r.isFrontFacing(this.a, this.b, this.c, e);
    }
    intersectsBox(e) {
      return e.intersectsTriangle(this);
    }
    closestPointToPoint(e, t) {
      const i = this.a, n = this.b, s = this.c;
      let a, o;
      tn.subVectors(n, i), nn.subVectors(s, i), ba.subVectors(e, i);
      const l = tn.dot(ba), c = nn.dot(ba);
      if (l <= 0 && c <= 0) return t.copy(i);
      Sa.subVectors(e, n);
      const h = tn.dot(Sa), u = nn.dot(Sa);
      if (h >= 0 && u <= h) return t.copy(n);
      const d = l * u - h * c;
      if (d <= 0 && l >= 0 && h <= 0) return a = l / (l - h), t.copy(i).addScaledVector(tn, a);
      Ea.subVectors(e, s);
      const p = tn.dot(Ea), f = nn.dot(Ea);
      if (f >= 0 && p <= f) return t.copy(s);
      const v = p * c - l * f;
      if (v <= 0 && c >= 0 && f <= 0) return o = c / (c - f), t.copy(i).addScaledVector(nn, o);
      const m = h * f - p * u;
      if (m <= 0 && u - h >= 0 && p - f >= 0) return Cc.subVectors(s, n), o = (u - h) / (u - h + (p - f)), t.copy(n).addScaledVector(Cc, o);
      const y = 1 / (m + v + d);
      return a = v * y, o = d * y, t.copy(i).addScaledVector(tn, a).addScaledVector(nn, o);
    }
    equals(e) {
      return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
    }
  };
  var Lh = { aliceblue: 15792383, antiquewhite: 16444375, aqua: 65535, aquamarine: 8388564, azure: 15794175, beige: 16119260, bisque: 16770244, black: 0, blanchedalmond: 16772045, blue: 255, blueviolet: 9055202, brown: 10824234, burlywood: 14596231, cadetblue: 6266528, chartreuse: 8388352, chocolate: 13789470, coral: 16744272, cornflowerblue: 6591981, cornsilk: 16775388, crimson: 14423100, cyan: 65535, darkblue: 139, darkcyan: 35723, darkgoldenrod: 12092939, darkgray: 11119017, darkgreen: 25600, darkgrey: 11119017, darkkhaki: 12433259, darkmagenta: 9109643, darkolivegreen: 5597999, darkorange: 16747520, darkorchid: 10040012, darkred: 9109504, darksalmon: 15308410, darkseagreen: 9419919, darkslateblue: 4734347, darkslategray: 3100495, darkslategrey: 3100495, darkturquoise: 52945, darkviolet: 9699539, deeppink: 16716947, deepskyblue: 49151, dimgray: 6908265, dimgrey: 6908265, dodgerblue: 2003199, firebrick: 11674146, floralwhite: 16775920, forestgreen: 2263842, fuchsia: 16711935, gainsboro: 14474460, ghostwhite: 16316671, gold: 16766720, goldenrod: 14329120, gray: 8421504, green: 32768, greenyellow: 11403055, grey: 8421504, honeydew: 15794160, hotpink: 16738740, indianred: 13458524, indigo: 4915330, ivory: 16777200, khaki: 15787660, lavender: 15132410, lavenderblush: 16773365, lawngreen: 8190976, lemonchiffon: 16775885, lightblue: 11393254, lightcoral: 15761536, lightcyan: 14745599, lightgoldenrodyellow: 16448210, lightgray: 13882323, lightgreen: 9498256, lightgrey: 13882323, lightpink: 16758465, lightsalmon: 16752762, lightseagreen: 2142890, lightskyblue: 8900346, lightslategray: 7833753, lightslategrey: 7833753, lightsteelblue: 11584734, lightyellow: 16777184, lime: 65280, limegreen: 3329330, linen: 16445670, magenta: 16711935, maroon: 8388608, mediumaquamarine: 6737322, mediumblue: 205, mediumorchid: 12211667, mediumpurple: 9662683, mediumseagreen: 3978097, mediumslateblue: 8087790, mediumspringgreen: 64154, mediumturquoise: 4772300, mediumvioletred: 13047173, midnightblue: 1644912, mintcream: 16121850, mistyrose: 16770273, moccasin: 16770229, navajowhite: 16768685, navy: 128, oldlace: 16643558, olive: 8421376, olivedrab: 7048739, orange: 16753920, orangered: 16729344, orchid: 14315734, palegoldenrod: 15657130, palegreen: 10025880, paleturquoise: 11529966, palevioletred: 14381203, papayawhip: 16773077, peachpuff: 16767673, peru: 13468991, pink: 16761035, plum: 14524637, powderblue: 11591910, purple: 8388736, rebeccapurple: 6697881, red: 16711680, rosybrown: 12357519, royalblue: 4286945, saddlebrown: 9127187, salmon: 16416882, sandybrown: 16032864, seagreen: 3050327, seashell: 16774638, sienna: 10506797, silver: 12632256, skyblue: 8900331, slateblue: 6970061, slategray: 7372944, slategrey: 7372944, snow: 16775930, springgreen: 65407, steelblue: 4620980, tan: 13808780, teal: 32896, thistle: 14204888, tomato: 16737095, turquoise: 4251856, violet: 15631086, wheat: 16113331, white: 16777215, whitesmoke: 16119285, yellow: 16776960, yellowgreen: 10145074 };
  var pi = { h: 0, s: 0, l: 0 };
  var Ur = { h: 0, s: 0, l: 0 };
  function Ta(r, e, t) {
    return t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6 ? r + 6 * (e - r) * t : t < 0.5 ? e : t < 2 / 3 ? r + 6 * (e - r) * (2 / 3 - t) : r;
  }
  var x = class {
    constructor(e, t, i) {
      return this.isColor = true, this.r = 1, this.g = 1, this.b = 1, this.set(e, t, i);
    }
    set(e, t, i) {
      if (void 0 === t && void 0 === i) {
        const n = e;
        n && n.isColor ? this.copy(n) : "number" == typeof n ? this.setHex(n) : "string" == typeof n && this.setStyle(n);
      } else this.setRGB(e, t, i);
      return this;
    }
    setScalar(e) {
      return this.r = e, this.g = e, this.b = e, this;
    }
    setHex(e, t = Qe) {
      return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (255 & e) / 255, ze.toWorkingColorSpace(this, t), this;
    }
    setRGB(e, t, i, n = ze.workingColorSpace) {
      return this.r = e, this.g = t, this.b = i, ze.toWorkingColorSpace(this, n), this;
    }
    setHSL(e, t, i, n = ze.workingColorSpace) {
      if (e = fu(e, 1), t = st(t, 0, 1), i = st(i, 0, 1), 0 === t) this.r = this.g = this.b = i;
      else {
        const s = i <= 0.5 ? i * (1 + t) : i + t - i * t, a = 2 * i - s;
        this.r = Ta(a, s, e + 1 / 3), this.g = Ta(a, s, e), this.b = Ta(a, s, e - 1 / 3);
      }
      return ze.toWorkingColorSpace(this, n), this;
    }
    setStyle(e, t = Qe) {
      function i(s) {
        void 0 !== s && parseFloat(s) < 1 && console.warn("THREE.Color: Alpha component of " + e + " will be ignored.");
      }
      let n;
      if (n = /^(\w+)\(([^\)]*)\)/.exec(e)) {
        let s;
        const a = n[1], o = n[2];
        switch (a) {
          case "rgb":
          case "rgba":
            if (s = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return i(s[4]), this.setRGB(Math.min(255, parseInt(s[1], 10)) / 255, Math.min(255, parseInt(s[2], 10)) / 255, Math.min(255, parseInt(s[3], 10)) / 255, t);
            if (s = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return i(s[4]), this.setRGB(Math.min(100, parseInt(s[1], 10)) / 100, Math.min(100, parseInt(s[2], 10)) / 100, Math.min(100, parseInt(s[3], 10)) / 100, t);
            break;
          case "hsl":
          case "hsla":
            if (s = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return i(s[4]), this.setHSL(parseFloat(s[1]) / 360, parseFloat(s[2]) / 100, parseFloat(s[3]) / 100, t);
            break;
          default:
            console.warn("THREE.Color: Unknown color model " + e);
        }
      } else if (n = /^\#([A-Fa-f\d]+)$/.exec(e)) {
        const s = n[1], a = s.length;
        if (3 === a) return this.setRGB(parseInt(s.charAt(0), 16) / 15, parseInt(s.charAt(1), 16) / 15, parseInt(s.charAt(2), 16) / 15, t);
        if (6 === a) return this.setHex(parseInt(s, 16), t);
        console.warn("THREE.Color: Invalid hex color " + e);
      } else if (e && e.length > 0) return this.setColorName(e, t);
      return this;
    }
    setColorName(e, t = Qe) {
      const i = Lh[e.toLowerCase()];
      return void 0 !== i ? this.setHex(i, t) : console.warn("THREE.Color: Unknown color " + e), this;
    }
    clone() {
      return new this.constructor(this.r, this.g, this.b);
    }
    copy(e) {
      return this.r = e.r, this.g = e.g, this.b = e.b, this;
    }
    copySRGBToLinear(e) {
      return this.r = pn(e.r), this.g = pn(e.g), this.b = pn(e.b), this;
    }
    copyLinearToSRGB(e) {
      return this.r = pa(e.r), this.g = pa(e.g), this.b = pa(e.b), this;
    }
    convertSRGBToLinear() {
      return this.copySRGBToLinear(this), this;
    }
    convertLinearToSRGB() {
      return this.copyLinearToSRGB(this), this;
    }
    getHex(e = Qe) {
      return ze.fromWorkingColorSpace(ht.copy(this), e), 65536 * Math.round(st(255 * ht.r, 0, 255)) + 256 * Math.round(st(255 * ht.g, 0, 255)) + Math.round(st(255 * ht.b, 0, 255));
    }
    getHexString(e = Qe) {
      return ("000000" + this.getHex(e).toString(16)).slice(-6);
    }
    getHSL(e, t = ze.workingColorSpace) {
      ze.fromWorkingColorSpace(ht.copy(this), t);
      const i = ht.r, n = ht.g, s = ht.b, a = Math.max(i, n, s), o = Math.min(i, n, s);
      let l, c;
      const h = (o + a) / 2;
      if (o === a) l = 0, c = 0;
      else {
        const u = a - o;
        switch (c = h <= 0.5 ? u / (a + o) : u / (2 - a - o), a) {
          case i:
            l = (n - s) / u + (n < s ? 6 : 0);
            break;
          case n:
            l = (s - i) / u + 2;
            break;
          case s:
            l = (i - n) / u + 4;
        }
        l /= 6;
      }
      return e.h = l, e.s = c, e.l = h, e;
    }
    getRGB(e, t = ze.workingColorSpace) {
      return ze.fromWorkingColorSpace(ht.copy(this), t), e.r = ht.r, e.g = ht.g, e.b = ht.b, e;
    }
    getStyle(e = Qe) {
      ze.fromWorkingColorSpace(ht.copy(this), e);
      const t = ht.r, i = ht.g, n = ht.b;
      return e !== Qe ? `color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})` : `rgb(${Math.round(255 * t)},${Math.round(255 * i)},${Math.round(255 * n)})`;
    }
    offsetHSL(e, t, i) {
      return this.getHSL(pi), this.setHSL(pi.h + e, pi.s + t, pi.l + i);
    }
    add(e) {
      return this.r += e.r, this.g += e.g, this.b += e.b, this;
    }
    addColors(e, t) {
      return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this;
    }
    addScalar(e) {
      return this.r += e, this.g += e, this.b += e, this;
    }
    sub(e) {
      return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this;
    }
    multiply(e) {
      return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
    }
    multiplyScalar(e) {
      return this.r *= e, this.g *= e, this.b *= e, this;
    }
    lerp(e, t) {
      return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this;
    }
    lerpColors(e, t, i) {
      return this.r = e.r + (t.r - e.r) * i, this.g = e.g + (t.g - e.g) * i, this.b = e.b + (t.b - e.b) * i, this;
    }
    lerpHSL(e, t) {
      this.getHSL(pi), e.getHSL(Ur);
      const i = ua(pi.h, Ur.h, t), n = ua(pi.s, Ur.s, t), s = ua(pi.l, Ur.l, t);
      return this.setHSL(i, n, s), this;
    }
    setFromVector3(e) {
      return this.r = e.x, this.g = e.y, this.b = e.z, this;
    }
    applyMatrix3(e) {
      const t = this.r, i = this.g, n = this.b, s = e.elements;
      return this.r = s[0] * t + s[3] * i + s[6] * n, this.g = s[1] * t + s[4] * i + s[7] * n, this.b = s[2] * t + s[5] * i + s[8] * n, this;
    }
    equals(e) {
      return e.r === this.r && e.g === this.g && e.b === this.b;
    }
    fromArray(e, t = 0) {
      return this.r = e[t], this.g = e[t + 1], this.b = e[t + 2], this;
    }
    toArray(e = [], t = 0) {
      return e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e;
    }
    fromBufferAttribute(e, t) {
      return this.r = e.getX(t), this.g = e.getY(t), this.b = e.getZ(t), this;
    }
    toJSON() {
      return this.getHex();
    }
    *[Symbol.iterator]() {
      yield this.r, yield this.g, yield this.b;
    }
  };
  var ht = new x();
  x.NAMES = Lh;
  var Au = 0;
  var ai = class extends yi {
    constructor() {
      super(), this.isMaterial = true, Object.defineProperty(this, "id", { value: Au++ }), this.uuid = wn(), this.name = "", this.type = "Material", this.blending = 1, this.side = _i, this.vertexColors = false, this.opacity = 1, this.transparent = false, this.alphaHash = false, this.blendSrc = Ga, this.blendDst = Wa, this.blendEquation = Ui, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new x(0, 0, 0), this.blendAlpha = 0, this.depthFunc = 3, this.depthTest = true, this.depthWrite = true, this.stencilWriteMask = 255, this.stencilFunc = 519, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = Yi, this.stencilZFail = Yi, this.stencilZPass = Yi, this.stencilWrite = false, this.clippingPlanes = null, this.clipIntersection = false, this.clipShadows = false, this.shadowSide = null, this.colorWrite = true, this.precision = null, this.polygonOffset = false, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = false, this.alphaToCoverage = false, this.premultipliedAlpha = false, this.forceSinglePass = false, this.visible = true, this.toneMapped = true, this.userData = {}, this.version = 0, this._alphaTest = 0;
    }
    get alphaTest() {
      return this._alphaTest;
    }
    set alphaTest(e) {
      this._alphaTest > 0 != e > 0 && this.version++, this._alphaTest = e;
    }
    onBuild() {
    }
    onBeforeRender() {
    }
    onBeforeCompile() {
    }
    customProgramCacheKey() {
      return this.onBeforeCompile.toString();
    }
    setValues(e) {
      if (void 0 !== e) for (const t in e) {
        const i = e[t];
        if (void 0 === i) {
          console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);
          continue;
        }
        const n = this[t];
        void 0 !== n ? n && n.isColor ? n.set(i) : n && n.isVector3 && i && i.isVector3 ? n.copy(i) : this[t] = i : console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);
      }
    }
    toJSON(e) {
      const t = void 0 === e || "string" == typeof e;
      t && (e = { textures: {}, images: {} });
      const i = { metadata: { version: 4.6, type: "Material", generator: "Material.toJSON" } };
      function n(s) {
        const a = [];
        for (const o in s) {
          const l = s[o];
          delete l.metadata, a.push(l);
        }
        return a;
      }
      if (i.uuid = this.uuid, i.type = this.type, "" !== this.name && (i.name = this.name), this.color && this.color.isColor && (i.color = this.color.getHex()), void 0 !== this.roughness && (i.roughness = this.roughness), void 0 !== this.metalness && (i.metalness = this.metalness), void 0 !== this.sheen && (i.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (i.sheenColor = this.sheenColor.getHex()), void 0 !== this.sheenRoughness && (i.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (i.emissive = this.emissive.getHex()), this.emissiveIntensity && 1 !== this.emissiveIntensity && (i.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (i.specular = this.specular.getHex()), void 0 !== this.specularIntensity && (i.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (i.specularColor = this.specularColor.getHex()), void 0 !== this.shininess && (i.shininess = this.shininess), void 0 !== this.clearcoat && (i.clearcoat = this.clearcoat), void 0 !== this.clearcoatRoughness && (i.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (i.clearcoatMap = this.clearcoatMap.toJSON(e).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (i.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (i.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid, i.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), void 0 !== this.iridescence && (i.iridescence = this.iridescence), void 0 !== this.iridescenceIOR && (i.iridescenceIOR = this.iridescenceIOR), void 0 !== this.iridescenceThicknessRange && (i.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (i.iridescenceMap = this.iridescenceMap.toJSON(e).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (i.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid), void 0 !== this.anisotropy && (i.anisotropy = this.anisotropy), void 0 !== this.anisotropyRotation && (i.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (i.anisotropyMap = this.anisotropyMap.toJSON(e).uuid), this.map && this.map.isTexture && (i.map = this.map.toJSON(e).uuid), this.matcap && this.matcap.isTexture && (i.matcap = this.matcap.toJSON(e).uuid), this.alphaMap && this.alphaMap.isTexture && (i.alphaMap = this.alphaMap.toJSON(e).uuid), this.lightMap && this.lightMap.isTexture && (i.lightMap = this.lightMap.toJSON(e).uuid, i.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (i.aoMap = this.aoMap.toJSON(e).uuid, i.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (i.bumpMap = this.bumpMap.toJSON(e).uuid, i.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (i.normalMap = this.normalMap.toJSON(e).uuid, i.normalMapType = this.normalMapType, i.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (i.displacementMap = this.displacementMap.toJSON(e).uuid, i.displacementScale = this.displacementScale, i.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (i.roughnessMap = this.roughnessMap.toJSON(e).uuid), this.metalnessMap && this.metalnessMap.isTexture && (i.metalnessMap = this.metalnessMap.toJSON(e).uuid), this.emissiveMap && this.emissiveMap.isTexture && (i.emissiveMap = this.emissiveMap.toJSON(e).uuid), this.specularMap && this.specularMap.isTexture && (i.specularMap = this.specularMap.toJSON(e).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (i.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid), this.specularColorMap && this.specularColorMap.isTexture && (i.specularColorMap = this.specularColorMap.toJSON(e).uuid), this.envMap && this.envMap.isTexture && (i.envMap = this.envMap.toJSON(e).uuid, void 0 !== this.combine && (i.combine = this.combine)), void 0 !== this.envMapIntensity && (i.envMapIntensity = this.envMapIntensity), void 0 !== this.reflectivity && (i.reflectivity = this.reflectivity), void 0 !== this.refractionRatio && (i.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (i.gradientMap = this.gradientMap.toJSON(e).uuid), void 0 !== this.transmission && (i.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (i.transmissionMap = this.transmissionMap.toJSON(e).uuid), void 0 !== this.thickness && (i.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (i.thicknessMap = this.thicknessMap.toJSON(e).uuid), void 0 !== this.attenuationDistance && this.attenuationDistance !== 1 / 0 && (i.attenuationDistance = this.attenuationDistance), void 0 !== this.attenuationColor && (i.attenuationColor = this.attenuationColor.getHex()), void 0 !== this.size && (i.size = this.size), null !== this.shadowSide && (i.shadowSide = this.shadowSide), void 0 !== this.sizeAttenuation && (i.sizeAttenuation = this.sizeAttenuation), 1 !== this.blending && (i.blending = this.blending), this.side !== _i && (i.side = this.side), true === this.vertexColors && (i.vertexColors = true), this.opacity < 1 && (i.opacity = this.opacity), true === this.transparent && (i.transparent = true), this.blendSrc !== Ga && (i.blendSrc = this.blendSrc), this.blendDst !== Wa && (i.blendDst = this.blendDst), this.blendEquation !== Ui && (i.blendEquation = this.blendEquation), null !== this.blendSrcAlpha && (i.blendSrcAlpha = this.blendSrcAlpha), null !== this.blendDstAlpha && (i.blendDstAlpha = this.blendDstAlpha), null !== this.blendEquationAlpha && (i.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (i.blendColor = this.blendColor.getHex()), 0 !== this.blendAlpha && (i.blendAlpha = this.blendAlpha), 3 !== this.depthFunc && (i.depthFunc = this.depthFunc), false === this.depthTest && (i.depthTest = this.depthTest), false === this.depthWrite && (i.depthWrite = this.depthWrite), false === this.colorWrite && (i.colorWrite = this.colorWrite), 255 !== this.stencilWriteMask && (i.stencilWriteMask = this.stencilWriteMask), 519 !== this.stencilFunc && (i.stencilFunc = this.stencilFunc), 0 !== this.stencilRef && (i.stencilRef = this.stencilRef), 255 !== this.stencilFuncMask && (i.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== Yi && (i.stencilFail = this.stencilFail), this.stencilZFail !== Yi && (i.stencilZFail = this.stencilZFail), this.stencilZPass !== Yi && (i.stencilZPass = this.stencilZPass), true === this.stencilWrite && (i.stencilWrite = this.stencilWrite), void 0 !== this.rotation && 0 !== this.rotation && (i.rotation = this.rotation), true === this.polygonOffset && (i.polygonOffset = true), 0 !== this.polygonOffsetFactor && (i.polygonOffsetFactor = this.polygonOffsetFactor), 0 !== this.polygonOffsetUnits && (i.polygonOffsetUnits = this.polygonOffsetUnits), void 0 !== this.linewidth && 1 !== this.linewidth && (i.linewidth = this.linewidth), void 0 !== this.dashSize && (i.dashSize = this.dashSize), void 0 !== this.gapSize && (i.gapSize = this.gapSize), void 0 !== this.scale && (i.scale = this.scale), true === this.dithering && (i.dithering = true), this.alphaTest > 0 && (i.alphaTest = this.alphaTest), true === this.alphaHash && (i.alphaHash = true), true === this.alphaToCoverage && (i.alphaToCoverage = true), true === this.premultipliedAlpha && (i.premultipliedAlpha = true), true === this.forceSinglePass && (i.forceSinglePass = true), true === this.wireframe && (i.wireframe = true), this.wireframeLinewidth > 1 && (i.wireframeLinewidth = this.wireframeLinewidth), "round" !== this.wireframeLinecap && (i.wireframeLinecap = this.wireframeLinecap), "round" !== this.wireframeLinejoin && (i.wireframeLinejoin = this.wireframeLinejoin), true === this.flatShading && (i.flatShading = true), false === this.visible && (i.visible = false), false === this.toneMapped && (i.toneMapped = false), false === this.fog && (i.fog = false), Object.keys(this.userData).length > 0 && (i.userData = this.userData), t) {
        const s = n(e.textures), a = n(e.images);
        s.length > 0 && (i.textures = s), a.length > 0 && (i.images = a);
      }
      return i;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      this.name = e.name, this.blending = e.blending, this.side = e.side, this.vertexColors = e.vertexColors, this.opacity = e.opacity, this.transparent = e.transparent, this.blendSrc = e.blendSrc, this.blendDst = e.blendDst, this.blendEquation = e.blendEquation, this.blendSrcAlpha = e.blendSrcAlpha, this.blendDstAlpha = e.blendDstAlpha, this.blendEquationAlpha = e.blendEquationAlpha, this.blendColor.copy(e.blendColor), this.blendAlpha = e.blendAlpha, this.depthFunc = e.depthFunc, this.depthTest = e.depthTest, this.depthWrite = e.depthWrite, this.stencilWriteMask = e.stencilWriteMask, this.stencilFunc = e.stencilFunc, this.stencilRef = e.stencilRef, this.stencilFuncMask = e.stencilFuncMask, this.stencilFail = e.stencilFail, this.stencilZFail = e.stencilZFail, this.stencilZPass = e.stencilZPass, this.stencilWrite = e.stencilWrite;
      const t = e.clippingPlanes;
      let i = null;
      if (null !== t) {
        const n = t.length;
        i = new Array(n);
        for (let s = 0; s !== n; ++s) i[s] = t[s].clone();
      }
      return this.clippingPlanes = i, this.clipIntersection = e.clipIntersection, this.clipShadows = e.clipShadows, this.shadowSide = e.shadowSide, this.colorWrite = e.colorWrite, this.precision = e.precision, this.polygonOffset = e.polygonOffset, this.polygonOffsetFactor = e.polygonOffsetFactor, this.polygonOffsetUnits = e.polygonOffsetUnits, this.dithering = e.dithering, this.alphaTest = e.alphaTest, this.alphaHash = e.alphaHash, this.alphaToCoverage = e.alphaToCoverage, this.premultipliedAlpha = e.premultipliedAlpha, this.forceSinglePass = e.forceSinglePass, this.visible = e.visible, this.toneMapped = e.toneMapped, this.userData = JSON.parse(JSON.stringify(e.userData)), this;
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
    set needsUpdate(e) {
      true === e && this.version++;
    }
  };
  var zt = class extends ai {
    constructor(e) {
      super(), this.isMeshBasicMaterial = true, this.type = "MeshBasicMaterial", this.color = new x(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.combine = xh, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = true, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.fog = e.fog, this;
    }
  };
  var Mm = Ru();
  function Ru() {
    const r = new ArrayBuffer(4), e = new Float32Array(r), t = new Uint32Array(r), i = new Uint32Array(512), n = new Uint32Array(512);
    for (let l = 0; l < 256; ++l) {
      const c = l - 127;
      c < -27 ? (i[l] = 0, i[256 | l] = 32768, n[l] = 24, n[256 | l] = 24) : c < -14 ? (i[l] = 1024 >> -c - 14, i[256 | l] = 1024 >> -c - 14 | 32768, n[l] = -c - 1, n[256 | l] = -c - 1) : c <= 15 ? (i[l] = c + 15 << 10, i[256 | l] = c + 15 << 10 | 32768, n[l] = 13, n[256 | l] = 13) : c < 128 ? (i[l] = 31744, i[256 | l] = 64512, n[l] = 24, n[256 | l] = 24) : (i[l] = 31744, i[256 | l] = 64512, n[l] = 13, n[256 | l] = 13);
    }
    const s = new Uint32Array(2048), a = new Uint32Array(64), o = new Uint32Array(64);
    for (let l = 1; l < 1024; ++l) {
      let c = l << 13, h = 0;
      for (; 0 == (8388608 & c); ) c <<= 1, h -= 8388608;
      c &= -8388609, h += 947912704, s[l] = c | h;
    }
    for (let l = 1024; l < 2048; ++l) s[l] = 939524096 + (l - 1024 << 13);
    for (let l = 1; l < 31; ++l) a[l] = l << 23;
    a[31] = 1199570944, a[32] = 2147483648;
    for (let l = 33; l < 63; ++l) a[l] = 2147483648 + (l - 32 << 23);
    a[63] = 3347054592;
    for (let l = 1; l < 64; ++l) 32 !== l && (o[l] = 1024);
    return { floatView: e, uint32View: t, baseTable: i, shiftTable: n, mantissaTable: s, exponentTable: a, offsetTable: o };
  }
  var Ke = new E();
  var Nr = new X();
  var ke = class {
    constructor(e, t, i = false) {
      if (Array.isArray(e)) throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
      this.isBufferAttribute = true, this.name = "", this.array = e, this.itemSize = t, this.count = void 0 !== e ? e.length / t : 0, this.normalized = i, this.usage = mc, this._updateRange = { offset: 0, count: -1 }, this.updateRanges = [], this.gpuType = Nt, this.version = 0;
    }
    onUploadCallback() {
    }
    set needsUpdate(e) {
      true === e && this.version++;
    }
    get updateRange() {
      return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."), this._updateRange;
    }
    setUsage(e) {
      return this.usage = e, this;
    }
    addUpdateRange(e, t) {
      this.updateRanges.push({ start: e, count: t });
    }
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    copy(e) {
      return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this;
    }
    copyAt(e, t, i) {
      e *= this.itemSize, i *= t.itemSize;
      for (let n = 0, s = this.itemSize; n < s; n++) this.array[e + n] = t.array[i + n];
      return this;
    }
    copyArray(e) {
      return this.array.set(e), this;
    }
    applyMatrix3(e) {
      if (2 === this.itemSize) for (let t = 0, i = this.count; t < i; t++) Nr.fromBufferAttribute(this, t), Nr.applyMatrix3(e), this.setXY(t, Nr.x, Nr.y);
      else if (3 === this.itemSize) for (let t = 0, i = this.count; t < i; t++) Ke.fromBufferAttribute(this, t), Ke.applyMatrix3(e), this.setXYZ(t, Ke.x, Ke.y, Ke.z);
      return this;
    }
    applyMatrix4(e) {
      for (let t = 0, i = this.count; t < i; t++) Ke.fromBufferAttribute(this, t), Ke.applyMatrix4(e), this.setXYZ(t, Ke.x, Ke.y, Ke.z);
      return this;
    }
    applyNormalMatrix(e) {
      for (let t = 0, i = this.count; t < i; t++) Ke.fromBufferAttribute(this, t), Ke.applyNormalMatrix(e), this.setXYZ(t, Ke.x, Ke.y, Ke.z);
      return this;
    }
    transformDirection(e) {
      for (let t = 0, i = this.count; t < i; t++) Ke.fromBufferAttribute(this, t), Ke.transformDirection(e), this.setXYZ(t, Ke.x, Ke.y, Ke.z);
      return this;
    }
    set(e, t = 0) {
      return this.array.set(e, t), this;
    }
    getComponent(e, t) {
      let i = this.array[e * this.itemSize + t];
      return this.normalized && (i = qn(i, this.array)), i;
    }
    setComponent(e, t, i) {
      return this.normalized && (i = ft(i, this.array)), this.array[e * this.itemSize + t] = i, this;
    }
    getX(e) {
      let t = this.array[e * this.itemSize];
      return this.normalized && (t = qn(t, this.array)), t;
    }
    setX(e, t) {
      return this.normalized && (t = ft(t, this.array)), this.array[e * this.itemSize] = t, this;
    }
    getY(e) {
      let t = this.array[e * this.itemSize + 1];
      return this.normalized && (t = qn(t, this.array)), t;
    }
    setY(e, t) {
      return this.normalized && (t = ft(t, this.array)), this.array[e * this.itemSize + 1] = t, this;
    }
    getZ(e) {
      let t = this.array[e * this.itemSize + 2];
      return this.normalized && (t = qn(t, this.array)), t;
    }
    setZ(e, t) {
      return this.normalized && (t = ft(t, this.array)), this.array[e * this.itemSize + 2] = t, this;
    }
    getW(e) {
      let t = this.array[e * this.itemSize + 3];
      return this.normalized && (t = qn(t, this.array)), t;
    }
    setW(e, t) {
      return this.normalized && (t = ft(t, this.array)), this.array[e * this.itemSize + 3] = t, this;
    }
    setXY(e, t, i) {
      return e *= this.itemSize, this.normalized && (t = ft(t, this.array), i = ft(i, this.array)), this.array[e + 0] = t, this.array[e + 1] = i, this;
    }
    setXYZ(e, t, i, n) {
      return e *= this.itemSize, this.normalized && (t = ft(t, this.array), i = ft(i, this.array), n = ft(n, this.array)), this.array[e + 0] = t, this.array[e + 1] = i, this.array[e + 2] = n, this;
    }
    setXYZW(e, t, i, n, s) {
      return e *= this.itemSize, this.normalized && (t = ft(t, this.array), i = ft(i, this.array), n = ft(n, this.array), s = ft(s, this.array)), this.array[e + 0] = t, this.array[e + 1] = i, this.array[e + 2] = n, this.array[e + 3] = s, this;
    }
    onUpload(e) {
      return this.onUploadCallback = e, this;
    }
    clone() {
      return new this.constructor(this.array, this.itemSize).copy(this);
    }
    toJSON() {
      const e = { itemSize: this.itemSize, type: this.array.constructor.name, array: Array.from(this.array), normalized: this.normalized };
      return "" !== this.name && (e.name = this.name), this.usage !== mc && (e.usage = this.usage), e;
    }
  };
  var _s = class extends ke {
    constructor(e, t, i) {
      super(new Uint16Array(e), t, i);
    }
  };
  var ys = class extends ke {
    constructor(e, t, i) {
      super(new Uint32Array(e), t, i);
    }
  };
  var ye = class extends ke {
    constructor(e, t, i) {
      super(new Float32Array(e), t, i);
    }
  };
  var Pu = 0;
  var wt = new we();
  var wa = new _t();
  var rn = new E();
  var Mt = new Bt();
  var Kn = new Bt();
  var rt = new E();
  var Be = class r extends yi {
    constructor() {
      super(), this.isBufferGeometry = true, Object.defineProperty(this, "id", { value: Pu++ }), this.uuid = wn(), this.name = "", this.type = "BufferGeometry", this.index = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = false, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
    }
    getIndex() {
      return this.index;
    }
    setIndex(e) {
      return Array.isArray(e) ? this.index = new (Ph(e) ? ys : _s)(e, 1) : this.index = e, this;
    }
    getAttribute(e) {
      return this.attributes[e];
    }
    setAttribute(e, t) {
      return this.attributes[e] = t, this;
    }
    deleteAttribute(e) {
      return delete this.attributes[e], this;
    }
    hasAttribute(e) {
      return void 0 !== this.attributes[e];
    }
    addGroup(e, t, i = 0) {
      this.groups.push({ start: e, count: t, materialIndex: i });
    }
    clearGroups() {
      this.groups = [];
    }
    setDrawRange(e, t) {
      this.drawRange.start = e, this.drawRange.count = t;
    }
    applyMatrix4(e) {
      const t = this.attributes.position;
      void 0 !== t && (t.applyMatrix4(e), t.needsUpdate = true);
      const i = this.attributes.normal;
      if (void 0 !== i) {
        const s = new Ae().getNormalMatrix(e);
        i.applyNormalMatrix(s), i.needsUpdate = true;
      }
      const n = this.attributes.tangent;
      return void 0 !== n && (n.transformDirection(e), n.needsUpdate = true), null !== this.boundingBox && this.computeBoundingBox(), null !== this.boundingSphere && this.computeBoundingSphere(), this;
    }
    applyQuaternion(e) {
      return wt.makeRotationFromQuaternion(e), this.applyMatrix4(wt), this;
    }
    rotateX(e) {
      return wt.makeRotationX(e), this.applyMatrix4(wt), this;
    }
    rotateY(e) {
      return wt.makeRotationY(e), this.applyMatrix4(wt), this;
    }
    rotateZ(e) {
      return wt.makeRotationZ(e), this.applyMatrix4(wt), this;
    }
    translate(e, t, i) {
      return wt.makeTranslation(e, t, i), this.applyMatrix4(wt), this;
    }
    scale(e, t, i) {
      return wt.makeScale(e, t, i), this.applyMatrix4(wt), this;
    }
    lookAt(e) {
      return wa.lookAt(e), wa.updateMatrix(), this.applyMatrix4(wa.matrix), this;
    }
    center() {
      return this.computeBoundingBox(), this.boundingBox.getCenter(rn).negate(), this.translate(rn.x, rn.y, rn.z), this;
    }
    setFromPoints(e) {
      const t = [];
      for (let i = 0, n = e.length; i < n; i++) {
        const s = e[i];
        t.push(s.x, s.y, s.z || 0);
      }
      return this.setAttribute("position", new ye(t, 3)), this;
    }
    computeBoundingBox() {
      null === this.boundingBox && (this.boundingBox = new Bt());
      const e = this.attributes.position, t = this.morphAttributes.position;
      if (e && e.isGLBufferAttribute) return console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".', this), void this.boundingBox.set(new E(-1 / 0, -1 / 0, -1 / 0), new E(1 / 0, 1 / 0, 1 / 0));
      if (void 0 !== e) {
        if (this.boundingBox.setFromBufferAttribute(e), t) for (let i = 0, n = t.length; i < n; i++) {
          const s = t[i];
          Mt.setFromBufferAttribute(s), this.morphTargetsRelative ? (rt.addVectors(this.boundingBox.min, Mt.min), this.boundingBox.expandByPoint(rt), rt.addVectors(this.boundingBox.max, Mt.max), this.boundingBox.expandByPoint(rt)) : (this.boundingBox.expandByPoint(Mt.min), this.boundingBox.expandByPoint(Mt.max));
        }
      } else this.boundingBox.makeEmpty();
      (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
    }
    computeBoundingSphere() {
      null === this.boundingSphere && (this.boundingSphere = new Ht());
      const e = this.attributes.position, t = this.morphAttributes.position;
      if (e && e.isGLBufferAttribute) return console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".', this), void this.boundingSphere.set(new E(), 1 / 0);
      if (e) {
        const i = this.boundingSphere.center;
        if (Mt.setFromBufferAttribute(e), t) for (let s = 0, a = t.length; s < a; s++) {
          const o = t[s];
          Kn.setFromBufferAttribute(o), this.morphTargetsRelative ? (rt.addVectors(Mt.min, Kn.min), Mt.expandByPoint(rt), rt.addVectors(Mt.max, Kn.max), Mt.expandByPoint(rt)) : (Mt.expandByPoint(Kn.min), Mt.expandByPoint(Kn.max));
        }
        Mt.getCenter(i);
        let n = 0;
        for (let s = 0, a = e.count; s < a; s++) rt.fromBufferAttribute(e, s), n = Math.max(n, i.distanceToSquared(rt));
        if (t) for (let s = 0, a = t.length; s < a; s++) {
          const o = t[s], l = this.morphTargetsRelative;
          for (let c = 0, h = o.count; c < h; c++) rt.fromBufferAttribute(o, c), l && (rn.fromBufferAttribute(e, c), rt.add(rn)), n = Math.max(n, i.distanceToSquared(rt));
        }
        this.boundingSphere.radius = Math.sqrt(n), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
      }
    }
    computeTangents() {
      const e = this.index, t = this.attributes;
      if (null === e || void 0 === t.position || void 0 === t.normal || void 0 === t.uv) return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      const i = e.array, n = t.position.array, s = t.normal.array, a = t.uv.array, o = n.length / 3;
      false === this.hasAttribute("tangent") && this.setAttribute("tangent", new ke(new Float32Array(4 * o), 4));
      const l = this.getAttribute("tangent").array, c = [], h = [];
      for (let F = 0; F < o; F++) c[F] = new E(), h[F] = new E();
      const u = new E(), d = new E(), p = new E(), f = new X(), v = new X(), m = new X(), y = new E(), _ = new E();
      function g(F, Z, P) {
        u.fromArray(n, 3 * F), d.fromArray(n, 3 * Z), p.fromArray(n, 3 * P), f.fromArray(a, 2 * F), v.fromArray(a, 2 * Z), m.fromArray(a, 2 * P), d.sub(u), p.sub(u), v.sub(f), m.sub(f);
        const W = 1 / (v.x * m.y - m.x * v.y);
        isFinite(W) && (y.copy(d).multiplyScalar(m.y).addScaledVector(p, -v.y).multiplyScalar(W), _.copy(p).multiplyScalar(v.x).addScaledVector(d, -m.x).multiplyScalar(W), c[F].add(y), c[Z].add(y), c[P].add(y), h[F].add(_), h[Z].add(_), h[P].add(_));
      }
      let w = this.groups;
      0 === w.length && (w = [{ start: 0, count: i.length }]);
      for (let F = 0, Z = w.length; F < Z; ++F) {
        const P = w[F], W = P.start;
        for (let j = W, oe = W + P.count; j < oe; j += 3) g(i[j + 0], i[j + 1], i[j + 2]);
      }
      const R = new E(), T = new E(), A = new E(), N = new E();
      function I(F) {
        A.fromArray(s, 3 * F), N.copy(A);
        const Z = c[F];
        R.copy(Z), R.sub(A.multiplyScalar(A.dot(Z))).normalize(), T.crossVectors(N, Z);
        const P = T.dot(h[F]) < 0 ? -1 : 1;
        l[4 * F] = R.x, l[4 * F + 1] = R.y, l[4 * F + 2] = R.z, l[4 * F + 3] = P;
      }
      for (let F = 0, Z = w.length; F < Z; ++F) {
        const P = w[F], W = P.start;
        for (let j = W, oe = W + P.count; j < oe; j += 3) I(i[j + 0]), I(i[j + 1]), I(i[j + 2]);
      }
    }
    computeVertexNormals() {
      const e = this.index, t = this.getAttribute("position");
      if (void 0 !== t) {
        let i = this.getAttribute("normal");
        if (void 0 === i) i = new ke(new Float32Array(3 * t.count), 3), this.setAttribute("normal", i);
        else for (let d = 0, p = i.count; d < p; d++) i.setXYZ(d, 0, 0, 0);
        const n = new E(), s = new E(), a = new E(), o = new E(), l = new E(), c = new E(), h = new E(), u = new E();
        if (e) for (let d = 0, p = e.count; d < p; d += 3) {
          const f = e.getX(d + 0), v = e.getX(d + 1), m = e.getX(d + 2);
          n.fromBufferAttribute(t, f), s.fromBufferAttribute(t, v), a.fromBufferAttribute(t, m), h.subVectors(a, s), u.subVectors(n, s), h.cross(u), o.fromBufferAttribute(i, f), l.fromBufferAttribute(i, v), c.fromBufferAttribute(i, m), o.add(h), l.add(h), c.add(h), i.setXYZ(f, o.x, o.y, o.z), i.setXYZ(v, l.x, l.y, l.z), i.setXYZ(m, c.x, c.y, c.z);
        }
        else for (let d = 0, p = t.count; d < p; d += 3) n.fromBufferAttribute(t, d + 0), s.fromBufferAttribute(t, d + 1), a.fromBufferAttribute(t, d + 2), h.subVectors(a, s), u.subVectors(n, s), h.cross(u), i.setXYZ(d + 0, h.x, h.y, h.z), i.setXYZ(d + 1, h.x, h.y, h.z), i.setXYZ(d + 2, h.x, h.y, h.z);
        this.normalizeNormals(), i.needsUpdate = true;
      }
    }
    normalizeNormals() {
      const e = this.attributes.normal;
      for (let t = 0, i = e.count; t < i; t++) rt.fromBufferAttribute(e, t), rt.normalize(), e.setXYZ(t, rt.x, rt.y, rt.z);
    }
    toNonIndexed() {
      function e(o, l) {
        const c = o.array, h = o.itemSize, u = o.normalized, d = new c.constructor(l.length * h);
        let p = 0, f = 0;
        for (let v = 0, m = l.length; v < m; v++) {
          p = o.isInterleavedBufferAttribute ? l[v] * o.data.stride + o.offset : l[v] * h;
          for (let y = 0; y < h; y++) d[f++] = c[p++];
        }
        return new ke(d, h, u);
      }
      if (null === this.index) return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
      const t = new r(), i = this.index.array, n = this.attributes;
      for (const o in n) {
        const l = e(n[o], i);
        t.setAttribute(o, l);
      }
      const s = this.morphAttributes;
      for (const o in s) {
        const l = [], c = s[o];
        for (let h = 0, u = c.length; h < u; h++) {
          const d = e(c[h], i);
          l.push(d);
        }
        t.morphAttributes[o] = l;
      }
      t.morphTargetsRelative = this.morphTargetsRelative;
      const a = this.groups;
      for (let o = 0, l = a.length; o < l; o++) {
        const c = a[o];
        t.addGroup(c.start, c.count, c.materialIndex);
      }
      return t;
    }
    toJSON() {
      const e = { metadata: { version: 4.6, type: "BufferGeometry", generator: "BufferGeometry.toJSON" } };
      if (e.uuid = this.uuid, e.type = this.type, "" !== this.name && (e.name = this.name), Object.keys(this.userData).length > 0 && (e.userData = this.userData), void 0 !== this.parameters) {
        const l = this.parameters;
        for (const c in l) void 0 !== l[c] && (e[c] = l[c]);
        return e;
      }
      e.data = { attributes: {} };
      const t = this.index;
      null !== t && (e.data.index = { type: t.array.constructor.name, array: Array.prototype.slice.call(t.array) });
      const i = this.attributes;
      for (const l in i) {
        const c = i[l];
        e.data.attributes[l] = c.toJSON(e.data);
      }
      const n = {};
      let s = false;
      for (const l in this.morphAttributes) {
        const c = this.morphAttributes[l], h = [];
        for (let u = 0, d = c.length; u < d; u++) {
          const p = c[u];
          h.push(p.toJSON(e.data));
        }
        h.length > 0 && (n[l] = h, s = true);
      }
      s && (e.data.morphAttributes = n, e.data.morphTargetsRelative = this.morphTargetsRelative);
      const a = this.groups;
      a.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(a)));
      const o = this.boundingSphere;
      return null !== o && (e.data.boundingSphere = { center: o.center.toArray(), radius: o.radius }), e;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
      const t = {};
      this.name = e.name;
      const i = e.index;
      null !== i && this.setIndex(i.clone(t));
      const n = e.attributes;
      for (const c in n) {
        const h = n[c];
        this.setAttribute(c, h.clone(t));
      }
      const s = e.morphAttributes;
      for (const c in s) {
        const h = [], u = s[c];
        for (let d = 0, p = u.length; d < p; d++) h.push(u[d].clone(t));
        this.morphAttributes[c] = h;
      }
      this.morphTargetsRelative = e.morphTargetsRelative;
      const a = e.groups;
      for (let c = 0, h = a.length; c < h; c++) {
        const u = a[c];
        this.addGroup(u.start, u.count, u.materialIndex);
      }
      const o = e.boundingBox;
      null !== o && (this.boundingBox = o.clone());
      const l = e.boundingSphere;
      return null !== l && (this.boundingSphere = l.clone()), this.drawRange.start = e.drawRange.start, this.drawRange.count = e.drawRange.count, this.userData = e.userData, this;
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
  };
  var Ac = new we();
  var Li = new yn();
  var Or = new Ht();
  var Rc = new E();
  var sn = new E();
  var an = new E();
  var on = new E();
  var Ca = new E();
  var Fr = new E();
  var Br = new X();
  var Hr = new X();
  var zr = new X();
  var Pc = new E();
  var Lc = new E();
  var Ic = new E();
  var kr = new E();
  var Vr = new E();
  var De = class extends _t {
    constructor(e = new Be(), t = new zt()) {
      super(), this.isMesh = true, this.type = "Mesh", this.geometry = e, this.material = t, this.updateMorphTargets();
    }
    copy(e, t) {
      return super.copy(e, t), void 0 !== e.morphTargetInfluences && (this.morphTargetInfluences = e.morphTargetInfluences.slice()), void 0 !== e.morphTargetDictionary && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
    }
    updateMorphTargets() {
      const e = this.geometry.morphAttributes, t = Object.keys(e);
      if (t.length > 0) {
        const i = e[t[0]];
        if (void 0 !== i) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let n = 0, s = i.length; n < s; n++) {
            const a = i[n].name || String(n);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[a] = n;
          }
        }
      }
    }
    getVertexPosition(e, t) {
      const i = this.geometry, n = i.attributes.position, s = i.morphAttributes.position, a = i.morphTargetsRelative;
      t.fromBufferAttribute(n, e);
      const o = this.morphTargetInfluences;
      if (s && o) {
        Fr.set(0, 0, 0);
        for (let l = 0, c = s.length; l < c; l++) {
          const h = o[l], u = s[l];
          0 !== h && (Ca.fromBufferAttribute(u, e), a ? Fr.addScaledVector(Ca, h) : Fr.addScaledVector(Ca.sub(t), h));
        }
        t.add(Fr);
      }
      return t;
    }
    raycast(e, t) {
      const i = this.geometry, n = this.material, s = this.matrixWorld;
      if (void 0 !== n) {
        if (null === i.boundingSphere && i.computeBoundingSphere(), Or.copy(i.boundingSphere), Or.applyMatrix4(s), Li.copy(e.ray).recast(e.near), false === Or.containsPoint(Li.origin)) {
          if (null === Li.intersectSphere(Or, Rc)) return;
          if (Li.origin.distanceToSquared(Rc) > (e.far - e.near) ** 2) return;
        }
        Ac.copy(s).invert(), Li.copy(e.ray).applyMatrix4(Ac), null !== i.boundingBox && false === Li.intersectsBox(i.boundingBox) || this._computeIntersections(e, t, Li);
      }
    }
    _computeIntersections(e, t, i) {
      let n;
      const s = this.geometry, a = this.material, o = s.index, l = s.attributes.position, c = s.attributes.uv, h = s.attributes.uv1, u = s.attributes.normal, d = s.groups, p = s.drawRange;
      if (null !== o) if (Array.isArray(a)) for (let f = 0, v = d.length; f < v; f++) {
        const m = d[f], y = a[m.materialIndex];
        for (let _ = Math.max(m.start, p.start), g = Math.min(o.count, Math.min(m.start + m.count, p.start + p.count)); _ < g; _ += 3) {
          n = Gr(this, y, e, i, c, h, u, o.getX(_), o.getX(_ + 1), o.getX(_ + 2)), n && (n.faceIndex = Math.floor(_ / 3), n.face.materialIndex = m.materialIndex, t.push(n));
        }
      }
      else {
        for (let f = Math.max(0, p.start), v = Math.min(o.count, p.start + p.count); f < v; f += 3) {
          n = Gr(this, a, e, i, c, h, u, o.getX(f), o.getX(f + 1), o.getX(f + 2)), n && (n.faceIndex = Math.floor(f / 3), t.push(n));
        }
      }
      else if (void 0 !== l) if (Array.isArray(a)) for (let f = 0, v = d.length; f < v; f++) {
        const m = d[f], y = a[m.materialIndex];
        for (let _ = Math.max(m.start, p.start), g = Math.min(l.count, Math.min(m.start + m.count, p.start + p.count)); _ < g; _ += 3) {
          n = Gr(this, y, e, i, c, h, u, _, _ + 1, _ + 2), n && (n.faceIndex = Math.floor(_ / 3), n.face.materialIndex = m.materialIndex, t.push(n));
        }
      }
      else {
        for (let f = Math.max(0, p.start), v = Math.min(l.count, p.start + p.count); f < v; f += 3) {
          n = Gr(this, a, e, i, c, h, u, f, f + 1, f + 2), n && (n.faceIndex = Math.floor(f / 3), t.push(n));
        }
      }
    }
  };
  function Gr(r, e, t, i, n, s, a, o, l, c) {
    r.getVertexPosition(o, sn), r.getVertexPosition(l, an), r.getVertexPosition(c, on);
    const h = (function(u, d, p, f, v, m, y, _) {
      let g;
      if (g = d.side === vt ? f.intersectTriangle(y, m, v, true, _) : f.intersectTriangle(v, m, y, d.side === _i, _), null === g) return null;
      Vr.copy(_), Vr.applyMatrix4(u.matrixWorld);
      const w = p.ray.origin.distanceTo(Vr);
      return w < p.near || w > p.far ? null : { distance: w, point: Vr.clone(), object: u };
    })(r, e, t, i, sn, an, on, kr);
    if (h) {
      n && (Br.fromBufferAttribute(n, o), Hr.fromBufferAttribute(n, l), zr.fromBufferAttribute(n, c), h.uv = Fi.getInterpolation(kr, sn, an, on, Br, Hr, zr, new X())), s && (Br.fromBufferAttribute(s, o), Hr.fromBufferAttribute(s, l), zr.fromBufferAttribute(s, c), h.uv1 = Fi.getInterpolation(kr, sn, an, on, Br, Hr, zr, new X()), h.uv2 = h.uv1), a && (Pc.fromBufferAttribute(a, o), Lc.fromBufferAttribute(a, l), Ic.fromBufferAttribute(a, c), h.normal = Fi.getInterpolation(kr, sn, an, on, Pc, Lc, Ic, new E()), h.normal.dot(i.direction) > 0 && h.normal.multiplyScalar(-1));
      const u = { a: o, b: l, c, normal: new E(), materialIndex: 0 };
      Fi.getNormal(sn, an, on, u.normal), h.face = u;
    }
    return h;
  }
  var xn = class r extends Be {
    constructor(e = 1, t = 1, i = 1, n = 1, s = 1, a = 1) {
      super(), this.type = "BoxGeometry", this.parameters = { width: e, height: t, depth: i, widthSegments: n, heightSegments: s, depthSegments: a };
      const o = this;
      n = Math.floor(n), s = Math.floor(s), a = Math.floor(a);
      const l = [], c = [], h = [], u = [];
      let d = 0, p = 0;
      function f(v, m, y, _, g, w, R, T, A, N, I) {
        const F = w / A, Z = R / N, P = w / 2, W = R / 2, j = T / 2, oe = A + 1, de = N + 1;
        let ne = 0, te = 0;
        const $ = new E();
        for (let k = 0; k < de; k++) {
          const G = k * Z - W;
          for (let ce = 0; ce < oe; ce++) {
            const S = ce * F - P;
            $[v] = S * _, $[m] = G * g, $[y] = j, c.push($.x, $.y, $.z), $[v] = 0, $[m] = 0, $[y] = T > 0 ? 1 : -1, h.push($.x, $.y, $.z), u.push(ce / A), u.push(1 - k / N), ne += 1;
          }
        }
        for (let k = 0; k < N; k++) for (let G = 0; G < A; G++) {
          const ce = d + G + oe * k, S = d + G + oe * (k + 1), b = d + (G + 1) + oe * (k + 1), O = d + (G + 1) + oe * k;
          l.push(ce, S, O), l.push(S, b, O), te += 6;
        }
        o.addGroup(p, te, I), p += te, d += ne;
      }
      f("z", "y", "x", -1, -1, i, t, e, a, s, 0), f("z", "y", "x", 1, -1, i, t, -e, a, s, 1), f("x", "z", "y", 1, 1, e, i, t, n, a, 2), f("x", "z", "y", 1, -1, e, i, -t, n, a, 3), f("x", "y", "z", 1, -1, e, t, i, n, s, 4), f("x", "y", "z", -1, -1, e, t, -i, n, s, 5), this.setIndex(l), this.setAttribute("position", new ye(c, 3)), this.setAttribute("normal", new ye(h, 3)), this.setAttribute("uv", new ye(u, 2));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new r(e.width, e.height, e.depth, e.widthSegments, e.heightSegments, e.depthSegments);
    }
  };
  function Mn(r) {
    const e = {};
    for (const t in r) {
      e[t] = {};
      for (const i in r[t]) {
        const n = r[t][i];
        n && (n.isColor || n.isMatrix3 || n.isMatrix4 || n.isVector2 || n.isVector3 || n.isVector4 || n.isTexture || n.isQuaternion) ? n.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), e[t][i] = null) : e[t][i] = n.clone() : Array.isArray(n) ? e[t][i] = n.slice() : e[t][i] = n;
      }
    }
    return e;
  }
  function dt(r) {
    const e = {};
    for (let t = 0; t < r.length; t++) {
      const i = Mn(r[t]);
      for (const n in i) e[n] = i[n];
    }
    return e;
  }
  function Ih(r) {
    return null === r.getRenderTarget() ? r.outputColorSpace : ze.workingColorSpace;
  }
  var Cn = { clone: Mn, merge: dt };
  var Ee = class extends ai {
    constructor(e) {
      super(), this.isShaderMaterial = true, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = "void main() {\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}", this.fragmentShader = "void main() {\n	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}", this.linewidth = 1, this.wireframe = false, this.wireframeLinewidth = 1, this.fog = false, this.lights = false, this.clipping = false, this.forceSinglePass = true, this.extensions = { derivatives: false, fragDepth: false, drawBuffers: false, shaderTextureLOD: false, clipCullDistance: false }, this.defaultAttributeValues = { color: [1, 1, 1], uv: [0, 0], uv1: [0, 0] }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = false, this.glslVersion = null, void 0 !== e && this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.fragmentShader = e.fragmentShader, this.vertexShader = e.vertexShader, this.uniforms = Mn(e.uniforms), this.uniformsGroups = (function(t) {
        const i = [];
        for (let n = 0; n < t.length; n++) i.push(t[n].clone());
        return i;
      })(e.uniformsGroups), this.defines = Object.assign({}, e.defines), this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.fog = e.fog, this.lights = e.lights, this.clipping = e.clipping, this.extensions = Object.assign({}, e.extensions), this.glslVersion = e.glslVersion, this;
    }
    toJSON(e) {
      const t = super.toJSON(e);
      t.glslVersion = this.glslVersion, t.uniforms = {};
      for (const n in this.uniforms) {
        const s = this.uniforms[n].value;
        s && s.isTexture ? t.uniforms[n] = { type: "t", value: s.toJSON(e).uuid } : s && s.isColor ? t.uniforms[n] = { type: "c", value: s.getHex() } : s && s.isVector2 ? t.uniforms[n] = { type: "v2", value: s.toArray() } : s && s.isVector3 ? t.uniforms[n] = { type: "v3", value: s.toArray() } : s && s.isVector4 ? t.uniforms[n] = { type: "v4", value: s.toArray() } : s && s.isMatrix3 ? t.uniforms[n] = { type: "m3", value: s.toArray() } : s && s.isMatrix4 ? t.uniforms[n] = { type: "m4", value: s.toArray() } : t.uniforms[n] = { value: s };
      }
      Object.keys(this.defines).length > 0 && (t.defines = this.defines), t.vertexShader = this.vertexShader, t.fragmentShader = this.fragmentShader, t.lights = this.lights, t.clipping = this.clipping;
      const i = {};
      for (const n in this.extensions) true === this.extensions[n] && (i[n] = true);
      return Object.keys(i).length > 0 && (t.extensions = i), t;
    }
  };
  var or = class extends _t {
    constructor() {
      super(), this.isCamera = true, this.type = "Camera", this.matrixWorldInverse = new we(), this.projectionMatrix = new we(), this.projectionMatrixInverse = new we(), this.coordinateSystem = _n;
    }
    copy(e, t) {
      return super.copy(e, t), this.matrixWorldInverse.copy(e.matrixWorldInverse), this.projectionMatrix.copy(e.projectionMatrix), this.projectionMatrixInverse.copy(e.projectionMatrixInverse), this.coordinateSystem = e.coordinateSystem, this;
    }
    getWorldDirection(e) {
      return super.getWorldDirection(e).negate();
    }
    updateMatrixWorld(e) {
      super.updateMatrixWorld(e), this.matrixWorldInverse.copy(this.matrixWorld).invert();
    }
    updateWorldMatrix(e, t) {
      super.updateWorldMatrix(e, t), this.matrixWorldInverse.copy(this.matrixWorld).invert();
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var ut = class extends or {
    constructor(e = 50, t = 1, i = 0.1, n = 2e3) {
      super(), this.isPerspectiveCamera = true, this.type = "PerspectiveCamera", this.fov = e, this.zoom = 1, this.near = i, this.far = n, this.focus = 10, this.aspect = t, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
    }
    copy(e, t) {
      return super.copy(e, t), this.fov = e.fov, this.zoom = e.zoom, this.near = e.near, this.far = e.far, this.focus = e.focus, this.aspect = e.aspect, this.view = null === e.view ? null : Object.assign({}, e.view), this.filmGauge = e.filmGauge, this.filmOffset = e.filmOffset, this;
    }
    setFocalLength(e) {
      const t = 0.5 * this.getFilmHeight() / e;
      this.fov = 2 * Ja * Math.atan(t), this.updateProjectionMatrix();
    }
    getFocalLength() {
      const e = Math.tan(0.5 * rs * this.fov);
      return 0.5 * this.getFilmHeight() / e;
    }
    getEffectiveFOV() {
      return 2 * Ja * Math.atan(Math.tan(0.5 * rs * this.fov) / this.zoom);
    }
    getFilmWidth() {
      return this.filmGauge * Math.min(this.aspect, 1);
    }
    getFilmHeight() {
      return this.filmGauge / Math.max(this.aspect, 1);
    }
    setViewOffset(e, t, i, n, s, a) {
      this.aspect = e / t, null === this.view && (this.view = { enabled: true, fullWidth: 1, fullHeight: 1, offsetX: 0, offsetY: 0, width: 1, height: 1 }), this.view.enabled = true, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = i, this.view.offsetY = n, this.view.width = s, this.view.height = a, this.updateProjectionMatrix();
    }
    clearViewOffset() {
      null !== this.view && (this.view.enabled = false), this.updateProjectionMatrix();
    }
    updateProjectionMatrix() {
      const e = this.near;
      let t = e * Math.tan(0.5 * rs * this.fov) / this.zoom, i = 2 * t, n = this.aspect * i, s = -0.5 * n;
      const a = this.view;
      if (null !== this.view && this.view.enabled) {
        const l = a.fullWidth, c = a.fullHeight;
        s += a.offsetX * n / l, t -= a.offsetY * i / c, n *= a.width / l, i *= a.height / c;
      }
      const o = this.filmOffset;
      0 !== o && (s += e * o / this.getFilmWidth()), this.projectionMatrix.makePerspective(s, s + n, t, t - i, e, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
    }
    toJSON(e) {
      const t = super.toJSON(e);
      return t.object.fov = this.fov, t.object.zoom = this.zoom, t.object.near = this.near, t.object.far = this.far, t.object.focus = this.focus, t.object.aspect = this.aspect, null !== this.view && (t.object.view = Object.assign({}, this.view)), t.object.filmGauge = this.filmGauge, t.object.filmOffset = this.filmOffset, t;
    }
  };
  var ln = -90;
  var eo = class extends _t {
    constructor(e, t, i) {
      super(), this.type = "CubeCamera", this.renderTarget = i, this.coordinateSystem = null, this.activeMipmapLevel = 0;
      const n = new ut(ln, 1, e, t);
      n.layers = this.layers, this.add(n);
      const s = new ut(ln, 1, e, t);
      s.layers = this.layers, this.add(s);
      const a = new ut(ln, 1, e, t);
      a.layers = this.layers, this.add(a);
      const o = new ut(ln, 1, e, t);
      o.layers = this.layers, this.add(o);
      const l = new ut(ln, 1, e, t);
      l.layers = this.layers, this.add(l);
      const c = new ut(ln, 1, e, t);
      c.layers = this.layers, this.add(c);
    }
    updateCoordinateSystem() {
      const e = this.coordinateSystem, t = this.children.concat(), [i, n, s, a, o, l] = t;
      for (const c of t) this.remove(c);
      if (e === _n) i.up.set(0, 1, 0), i.lookAt(1, 0, 0), n.up.set(0, 1, 0), n.lookAt(-1, 0, 0), s.up.set(0, 0, -1), s.lookAt(0, 1, 0), a.up.set(0, 0, 1), a.lookAt(0, -1, 0), o.up.set(0, 1, 0), o.lookAt(0, 0, 1), l.up.set(0, 1, 0), l.lookAt(0, 0, -1);
      else {
        if (e !== us) throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + e);
        i.up.set(0, -1, 0), i.lookAt(-1, 0, 0), n.up.set(0, -1, 0), n.lookAt(1, 0, 0), s.up.set(0, 0, 1), s.lookAt(0, 1, 0), a.up.set(0, 0, -1), a.lookAt(0, -1, 0), o.up.set(0, -1, 0), o.lookAt(0, 0, 1), l.up.set(0, -1, 0), l.lookAt(0, 0, -1);
      }
      for (const c of t) this.add(c), c.updateMatrixWorld();
    }
    update(e, t) {
      null === this.parent && this.updateMatrixWorld();
      const { renderTarget: i, activeMipmapLevel: n } = this;
      this.coordinateSystem !== e.coordinateSystem && (this.coordinateSystem = e.coordinateSystem, this.updateCoordinateSystem());
      const [s, a, o, l, c, h] = this.children, u = e.getRenderTarget(), d = e.getActiveCubeFace(), p = e.getActiveMipmapLevel(), f = e.xr.enabled;
      e.xr.enabled = false;
      const v = i.texture.generateMipmaps;
      i.texture.generateMipmaps = false, e.setRenderTarget(i, 0, n), e.render(t, s), e.setRenderTarget(i, 1, n), e.render(t, a), e.setRenderTarget(i, 2, n), e.render(t, o), e.setRenderTarget(i, 3, n), e.render(t, l), e.setRenderTarget(i, 4, n), e.render(t, c), i.texture.generateMipmaps = v, e.setRenderTarget(i, 5, n), e.render(t, h), e.setRenderTarget(u, d, p), e.xr.enabled = f, i.texture.needsPMREMUpdate = true;
    }
  };
  var xs = class extends Ct {
    constructor(e, t, i, n, s, a, o, l, c, h) {
      super(e = void 0 !== e ? e : [], t = void 0 !== t ? t : fn, i, n, s, a, o, l, c, h), this.isCubeTexture = true, this.flipY = false;
    }
    get images() {
      return this.image;
    }
    set images(e) {
      this.image = e;
    }
  };
  var to = class extends at {
    constructor(e = 1, t = {}) {
      super(e, e, t), this.isWebGLCubeRenderTarget = true;
      const i = { width: e, height: e, depth: 1 }, n = [i, i, i, i, i, i];
      void 0 !== t.encoding && (ir("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."), t.colorSpace = t.encoding === zi ? Qe : jt), this.texture = new xs(n, t.mapping, t.wrapS, t.wrapT, t.magFilter, t.minFilter, t.format, t.type, t.anisotropy, t.colorSpace), this.texture.isRenderTargetTexture = true, this.texture.generateMipmaps = void 0 !== t.generateMipmaps && t.generateMipmaps, this.texture.minFilter = void 0 !== t.minFilter ? t.minFilter : gt;
    }
    fromEquirectangularTexture(e, t) {
      this.texture.type = t.type, this.texture.colorSpace = t.colorSpace, this.texture.generateMipmaps = t.generateMipmaps, this.texture.minFilter = t.minFilter, this.texture.magFilter = t.magFilter;
      const i = { uniforms: { tEquirect: { value: null } }, vertexShader: "\n\n				varying vec3 vWorldDirection;\n\n				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n				}\n\n				void main() {\n\n					vWorldDirection = transformDirection( position, modelMatrix );\n\n					#include <begin_vertex>\n					#include <project_vertex>\n\n				}\n			", fragmentShader: "\n\n				uniform sampler2D tEquirect;\n\n				varying vec3 vWorldDirection;\n\n				#include <common>\n\n				void main() {\n\n					vec3 direction = normalize( vWorldDirection );\n\n					vec2 sampleUV = equirectUv( direction );\n\n					gl_FragColor = texture2D( tEquirect, sampleUV );\n\n				}\n			" }, n = new xn(5, 5, 5), s = new Ee({ name: "CubemapFromEquirect", uniforms: Mn(i.uniforms), vertexShader: i.vertexShader, fragmentShader: i.fragmentShader, side: vt, blending: 0 });
      s.uniforms.tEquirect.value = t;
      const a = new De(n, s), o = t.minFilter;
      t.minFilter === ss && (t.minFilter = gt);
      return new eo(1, 10, this).update(e, a), t.minFilter = o, a.geometry.dispose(), a.material.dispose(), this;
    }
    clear(e, t, i, n) {
      const s = e.getRenderTarget();
      for (let a = 0; a < 6; a++) e.setRenderTarget(this, a), e.clear(t, i, n);
      e.setRenderTarget(s);
    }
  };
  var Aa = new E();
  var Lu = new E();
  var Iu = new Ae();
  var ii = class {
    constructor(e = new E(1, 0, 0), t = 0) {
      this.isPlane = true, this.normal = e, this.constant = t;
    }
    set(e, t) {
      return this.normal.copy(e), this.constant = t, this;
    }
    setComponents(e, t, i, n) {
      return this.normal.set(e, t, i), this.constant = n, this;
    }
    setFromNormalAndCoplanarPoint(e, t) {
      return this.normal.copy(e), this.constant = -t.dot(this.normal), this;
    }
    setFromCoplanarPoints(e, t, i) {
      const n = Aa.subVectors(i, t).cross(Lu.subVectors(e, t)).normalize();
      return this.setFromNormalAndCoplanarPoint(n, e), this;
    }
    copy(e) {
      return this.normal.copy(e.normal), this.constant = e.constant, this;
    }
    normalize() {
      const e = 1 / this.normal.length();
      return this.normal.multiplyScalar(e), this.constant *= e, this;
    }
    negate() {
      return this.constant *= -1, this.normal.negate(), this;
    }
    distanceToPoint(e) {
      return this.normal.dot(e) + this.constant;
    }
    distanceToSphere(e) {
      return this.distanceToPoint(e.center) - e.radius;
    }
    projectPoint(e, t) {
      return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
    }
    intersectLine(e, t) {
      const i = e.delta(Aa), n = this.normal.dot(i);
      if (0 === n) return 0 === this.distanceToPoint(e.start) ? t.copy(e.start) : null;
      const s = -(e.start.dot(this.normal) + this.constant) / n;
      return s < 0 || s > 1 ? null : t.copy(e.start).addScaledVector(i, s);
    }
    intersectsLine(e) {
      const t = this.distanceToPoint(e.start), i = this.distanceToPoint(e.end);
      return t < 0 && i > 0 || i < 0 && t > 0;
    }
    intersectsBox(e) {
      return e.intersectsPlane(this);
    }
    intersectsSphere(e) {
      return e.intersectsPlane(this);
    }
    coplanarPoint(e) {
      return e.copy(this.normal).multiplyScalar(-this.constant);
    }
    applyMatrix4(e, t) {
      const i = t || Iu.getNormalMatrix(e), n = this.coplanarPoint(Aa).applyMatrix4(e), s = this.normal.applyMatrix3(i).normalize();
      return this.constant = -n.dot(s), this;
    }
    translate(e) {
      return this.constant -= e.dot(this.normal), this;
    }
    equals(e) {
      return e.normal.equals(this.normal) && e.constant === this.constant;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  var Ii = new Ht();
  var Wr = new E();
  var bn = class {
    constructor(e = new ii(), t = new ii(), i = new ii(), n = new ii(), s = new ii(), a = new ii()) {
      this.planes = [e, t, i, n, s, a];
    }
    set(e, t, i, n, s, a) {
      const o = this.planes;
      return o[0].copy(e), o[1].copy(t), o[2].copy(i), o[3].copy(n), o[4].copy(s), o[5].copy(a), this;
    }
    copy(e) {
      const t = this.planes;
      for (let i = 0; i < 6; i++) t[i].copy(e.planes[i]);
      return this;
    }
    setFromProjectionMatrix(e, t = 2e3) {
      const i = this.planes, n = e.elements, s = n[0], a = n[1], o = n[2], l = n[3], c = n[4], h = n[5], u = n[6], d = n[7], p = n[8], f = n[9], v = n[10], m = n[11], y = n[12], _ = n[13], g = n[14], w = n[15];
      if (i[0].setComponents(l - s, d - c, m - p, w - y).normalize(), i[1].setComponents(l + s, d + c, m + p, w + y).normalize(), i[2].setComponents(l + a, d + h, m + f, w + _).normalize(), i[3].setComponents(l - a, d - h, m - f, w - _).normalize(), i[4].setComponents(l - o, d - u, m - v, w - g).normalize(), t === _n) i[5].setComponents(l + o, d + u, m + v, w + g).normalize();
      else {
        if (t !== us) throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + t);
        i[5].setComponents(o, u, v, g).normalize();
      }
      return this;
    }
    intersectsObject(e) {
      if (void 0 !== e.boundingSphere) null === e.boundingSphere && e.computeBoundingSphere(), Ii.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);
      else {
        const t = e.geometry;
        null === t.boundingSphere && t.computeBoundingSphere(), Ii.copy(t.boundingSphere).applyMatrix4(e.matrixWorld);
      }
      return this.intersectsSphere(Ii);
    }
    intersectsSprite(e) {
      return Ii.center.set(0, 0, 0), Ii.radius = 0.7071067811865476, Ii.applyMatrix4(e.matrixWorld), this.intersectsSphere(Ii);
    }
    intersectsSphere(e) {
      const t = this.planes, i = e.center, n = -e.radius;
      for (let s = 0; s < 6; s++) {
        if (t[s].distanceToPoint(i) < n) return false;
      }
      return true;
    }
    intersectsBox(e) {
      const t = this.planes;
      for (let i = 0; i < 6; i++) {
        const n = t[i];
        if (Wr.x = n.normal.x > 0 ? e.max.x : e.min.x, Wr.y = n.normal.y > 0 ? e.max.y : e.min.y, Wr.z = n.normal.z > 0 ? e.max.z : e.min.z, n.distanceToPoint(Wr) < 0) return false;
      }
      return true;
    }
    containsPoint(e) {
      const t = this.planes;
      for (let i = 0; i < 6; i++) if (t[i].distanceToPoint(e) < 0) return false;
      return true;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
  function Dh() {
    let r = null, e = false, t = null, i = null;
    function n(s, a) {
      t(s, a), i = r.requestAnimationFrame(n);
    }
    return { start: function() {
      true !== e && null !== t && (i = r.requestAnimationFrame(n), e = true);
    }, stop: function() {
      r.cancelAnimationFrame(i), e = false;
    }, setAnimationLoop: function(s) {
      t = s;
    }, setContext: function(s) {
      r = s;
    } };
  }
  function Du(r, e) {
    const t = e.isWebGL2, i = /* @__PURE__ */ new WeakMap();
    return { get: function(n) {
      return n.isInterleavedBufferAttribute && (n = n.data), i.get(n);
    }, remove: function(n) {
      n.isInterleavedBufferAttribute && (n = n.data);
      const s = i.get(n);
      s && (r.deleteBuffer(s.buffer), i.delete(n));
    }, update: function(n, s) {
      if (n.isGLBufferAttribute) {
        const o = i.get(n);
        return void ((!o || o.version < n.version) && i.set(n, { buffer: n.buffer, type: n.type, bytesPerElement: n.elementSize, version: n.version }));
      }
      n.isInterleavedBufferAttribute && (n = n.data);
      const a = i.get(n);
      if (void 0 === a) i.set(n, (function(o, l) {
        const c = o.array, h = o.usage, u = c.byteLength, d = r.createBuffer();
        let p;
        if (r.bindBuffer(l, d), r.bufferData(l, c, h), o.onUploadCallback(), c instanceof Float32Array) p = r.FLOAT;
        else if (c instanceof Uint16Array) if (o.isFloat16BufferAttribute) {
          if (!t) throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");
          p = r.HALF_FLOAT;
        } else p = r.UNSIGNED_SHORT;
        else if (c instanceof Int16Array) p = r.SHORT;
        else if (c instanceof Uint32Array) p = r.UNSIGNED_INT;
        else if (c instanceof Int32Array) p = r.INT;
        else if (c instanceof Int8Array) p = r.BYTE;
        else if (c instanceof Uint8Array) p = r.UNSIGNED_BYTE;
        else {
          if (!(c instanceof Uint8ClampedArray)) throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + c);
          p = r.UNSIGNED_BYTE;
        }
        return { buffer: d, type: p, bytesPerElement: c.BYTES_PER_ELEMENT, version: o.version, size: u };
      })(n, s));
      else if (a.version < n.version) {
        if (a.size !== n.array.byteLength) throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
        !(function(o, l, c) {
          const h = l.array, u = l._updateRange, d = l.updateRanges;
          if (r.bindBuffer(c, o), -1 === u.count && 0 === d.length && r.bufferSubData(c, 0, h), 0 !== d.length) {
            for (let p = 0, f = d.length; p < f; p++) {
              const v = d[p];
              t ? r.bufferSubData(c, v.start * h.BYTES_PER_ELEMENT, h, v.start, v.count) : r.bufferSubData(c, v.start * h.BYTES_PER_ELEMENT, h.subarray(v.start, v.start + v.count));
            }
            l.clearUpdateRanges();
          }
          -1 !== u.count && (t ? r.bufferSubData(c, u.offset * h.BYTES_PER_ELEMENT, h, u.offset, u.count) : r.bufferSubData(c, u.offset * h.BYTES_PER_ELEMENT, h.subarray(u.offset, u.offset + u.count)), u.count = -1), l.onUploadCallback();
        })(a.buffer, n, s), a.version = n.version;
      }
    } };
  }
  var Ze = class r extends Be {
    constructor(e = 1, t = 1, i = 1, n = 1) {
      super(), this.type = "PlaneGeometry", this.parameters = { width: e, height: t, widthSegments: i, heightSegments: n };
      const s = e / 2, a = t / 2, o = Math.floor(i), l = Math.floor(n), c = o + 1, h = l + 1, u = e / o, d = t / l, p = [], f = [], v = [], m = [];
      for (let y = 0; y < h; y++) {
        const _ = y * d - a;
        for (let g = 0; g < c; g++) {
          const w = g * u - s;
          f.push(w, -_, 0), v.push(0, 0, 1), m.push(g / o), m.push(1 - y / l);
        }
      }
      for (let y = 0; y < l; y++) for (let _ = 0; _ < o; _++) {
        const g = _ + c * y, w = _ + c * (y + 1), R = _ + 1 + c * (y + 1), T = _ + 1 + c * y;
        p.push(g, w, T), p.push(w, R, T);
      }
      this.setIndex(p), this.setAttribute("position", new ye(f, 3)), this.setAttribute("normal", new ye(v, 3)), this.setAttribute("uv", new ye(m, 2));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new r(e.width, e.height, e.widthSegments, e.heightSegments);
    }
  };
  var Se = { alphahash_fragment: "#ifdef USE_ALPHAHASH\n	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;\n#endif", alphahash_pars_fragment: "#ifdef USE_ALPHAHASH\n	const float ALPHA_HASH_SCALE = 0.05;\n	float hash2D( vec2 value ) {\n		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );\n	}\n	float hash3D( vec3 value ) {\n		return hash2D( vec2( hash2D( value.xy ), value.z ) );\n	}\n	float getAlphaHashThreshold( vec3 position ) {\n		float maxDeriv = max(\n			length( dFdx( position.xyz ) ),\n			length( dFdy( position.xyz ) )\n		);\n		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );\n		vec2 pixScales = vec2(\n			exp2( floor( log2( pixScale ) ) ),\n			exp2( ceil( log2( pixScale ) ) )\n		);\n		vec2 alpha = vec2(\n			hash3D( floor( pixScales.x * position.xyz ) ),\n			hash3D( floor( pixScales.y * position.xyz ) )\n		);\n		float lerpFactor = fract( log2( pixScale ) );\n		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;\n		float a = min( lerpFactor, 1.0 - lerpFactor );\n		vec3 cases = vec3(\n			x * x / ( 2.0 * a * ( 1.0 - a ) ),\n			( x - 0.5 * a ) / ( 1.0 - a ),\n			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )\n		);\n		float threshold = ( x < ( 1.0 - a ) )\n			? ( ( x < a ) ? cases.x : cases.y )\n			: cases.z;\n		return clamp( threshold , 1.0e-6, 1.0 );\n	}\n#endif", alphamap_fragment: "#ifdef USE_ALPHAMAP\n	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;\n#endif", alphamap_pars_fragment: "#ifdef USE_ALPHAMAP\n	uniform sampler2D alphaMap;\n#endif", alphatest_fragment: "#ifdef USE_ALPHATEST\n	if ( diffuseColor.a < alphaTest ) discard;\n#endif", alphatest_pars_fragment: "#ifdef USE_ALPHATEST\n	uniform float alphaTest;\n#endif", aomap_fragment: "#ifdef USE_AOMAP\n	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;\n	reflectedLight.indirectDiffuse *= ambientOcclusion;\n	#if defined( USE_CLEARCOAT ) \n		clearcoatSpecularIndirect *= ambientOcclusion;\n	#endif\n	#if defined( USE_SHEEN ) \n		sheenSpecularIndirect *= ambientOcclusion;\n	#endif\n	#if defined( USE_ENVMAP ) && defined( STANDARD )\n		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );\n		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );\n	#endif\n#endif", aomap_pars_fragment: "#ifdef USE_AOMAP\n	uniform sampler2D aoMap;\n	uniform float aoMapIntensity;\n#endif", batching_pars_vertex: "#ifdef USE_BATCHING\n	attribute float batchId;\n	uniform highp sampler2D batchingTexture;\n	mat4 getBatchingMatrix( const in float i ) {\n		int size = textureSize( batchingTexture, 0 ).x;\n		int j = int( i ) * 4;\n		int x = j % size;\n		int y = j / size;\n		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );\n		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );\n		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );\n		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );\n		return mat4( v1, v2, v3, v4 );\n	}\n#endif", batching_vertex: "#ifdef USE_BATCHING\n	mat4 batchingMatrix = getBatchingMatrix( batchId );\n#endif", begin_vertex: "vec3 transformed = vec3( position );\n#ifdef USE_ALPHAHASH\n	vPosition = vec3( position );\n#endif", beginnormal_vertex: "vec3 objectNormal = vec3( normal );\n#ifdef USE_TANGENT\n	vec3 objectTangent = vec3( tangent.xyz );\n#endif", bsdfs: "float G_BlinnPhong_Implicit( ) {\n	return 0.25;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nvec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float dotVH = saturate( dot( viewDir, halfDir ) );\n	vec3 F = F_Schlick( specularColor, 1.0, dotVH );\n	float G = G_BlinnPhong_Implicit( );\n	float D = D_BlinnPhong( shininess, dotNH );\n	return F * ( G * D );\n} // validated", iridescence_fragment: "#ifdef USE_IRIDESCENCE\n	const mat3 XYZ_TO_REC709 = mat3(\n		 3.2404542, -0.9692660,  0.0556434,\n		-1.5371385,  1.8760108, -0.2040259,\n		-0.4985314,  0.0415560,  1.0572252\n	);\n	vec3 Fresnel0ToIor( vec3 fresnel0 ) {\n		vec3 sqrtF0 = sqrt( fresnel0 );\n		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );\n	}\n	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {\n		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );\n	}\n	float IorToFresnel0( float transmittedIor, float incidentIor ) {\n		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));\n	}\n	vec3 evalSensitivity( float OPD, vec3 shift ) {\n		float phase = 2.0 * PI * OPD * 1.0e-9;\n		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );\n		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );\n		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );\n		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );\n		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );\n		xyz /= 1.0685e-7;\n		vec3 rgb = XYZ_TO_REC709 * xyz;\n		return rgb;\n	}\n	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {\n		vec3 I;\n		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );\n		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );\n		float cosTheta2Sq = 1.0 - sinTheta2Sq;\n		if ( cosTheta2Sq < 0.0 ) {\n			return vec3( 1.0 );\n		}\n		float cosTheta2 = sqrt( cosTheta2Sq );\n		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );\n		float R12 = F_Schlick( R0, 1.0, cosTheta1 );\n		float T121 = 1.0 - R12;\n		float phi12 = 0.0;\n		if ( iridescenceIOR < outsideIOR ) phi12 = PI;\n		float phi21 = PI - phi12;\n		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );\n		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );\n		vec3 phi23 = vec3( 0.0 );\n		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;\n		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;\n		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;\n		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;\n		vec3 phi = vec3( phi21 ) + phi23;\n		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );\n		vec3 r123 = sqrt( R123 );\n		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );\n		vec3 C0 = R12 + Rs;\n		I = C0;\n		vec3 Cm = Rs - T121;\n		for ( int m = 1; m <= 2; ++ m ) {\n			Cm *= r123;\n			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );\n			I += Cm * Sm;\n		}\n		return max( I, vec3( 0.0 ) );\n	}\n#endif", bumpmap_pars_fragment: "#ifdef USE_BUMPMAP\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n	vec2 dHdxy_fwd() {\n		vec2 dSTdx = dFdx( vBumpMapUv );\n		vec2 dSTdy = dFdy( vBumpMapUv );\n		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;\n		return vec2( dBx, dBy );\n	}\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {\n		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );\n		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );\n		vec3 vN = surf_norm;\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n		float fDet = dot( vSigmaX, R1 ) * faceDirection;\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n	}\n#endif", clipping_planes_fragment: "#if NUM_CLIPPING_PLANES > 0\n	vec4 plane;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n		plane = clippingPlanes[ i ];\n		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;\n	}\n	#pragma unroll_loop_end\n	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n		bool clipped = true;\n		#pragma unroll_loop_start\n		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n			plane = clippingPlanes[ i ];\n			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;\n		}\n		#pragma unroll_loop_end\n		if ( clipped ) discard;\n	#endif\n#endif", clipping_planes_pars_fragment: "#if NUM_CLIPPING_PLANES > 0\n	varying vec3 vClipPosition;\n	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n#endif", clipping_planes_pars_vertex: "#if NUM_CLIPPING_PLANES > 0\n	varying vec3 vClipPosition;\n#endif", clipping_planes_vertex: "#if NUM_CLIPPING_PLANES > 0\n	vClipPosition = - mvPosition.xyz;\n#endif", color_fragment: "#if defined( USE_COLOR_ALPHA )\n	diffuseColor *= vColor;\n#elif defined( USE_COLOR )\n	diffuseColor.rgb *= vColor;\n#endif", color_pars_fragment: "#if defined( USE_COLOR_ALPHA )\n	varying vec4 vColor;\n#elif defined( USE_COLOR )\n	varying vec3 vColor;\n#endif", color_pars_vertex: "#if defined( USE_COLOR_ALPHA )\n	varying vec4 vColor;\n#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )\n	varying vec3 vColor;\n#endif", color_vertex: "#if defined( USE_COLOR_ALPHA )\n	vColor = vec4( 1.0 );\n#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )\n	vColor = vec3( 1.0 );\n#endif\n#ifdef USE_COLOR\n	vColor *= color;\n#endif\n#ifdef USE_INSTANCING_COLOR\n	vColor.xyz *= instanceColor.xyz;\n#endif", common: "#define PI 3.141592653589793\n#define PI2 6.283185307179586\n#define PI_HALF 1.5707963267948966\n#define RECIPROCAL_PI 0.3183098861837907\n#define RECIPROCAL_PI2 0.15915494309189535\n#define EPSILON 1e-6\n#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\n#define whiteComplement( a ) ( 1.0 - saturate( a ) )\nfloat pow2( const in float x ) { return x*x; }\nvec3 pow2( const in vec3 x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }\nfloat average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }\nhighp float rand( const in vec2 uv ) {\n	const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n	return fract( sin( sn ) * c );\n}\n#ifdef HIGH_PRECISION\n	float precisionSafeLength( vec3 v ) { return length( v ); }\n#else\n	float precisionSafeLength( vec3 v ) {\n		float maxComponent = max3( abs( v ) );\n		return length( v / maxComponent ) * maxComponent;\n	}\n#endif\nstruct IncidentLight {\n	vec3 color;\n	vec3 direction;\n	bool visible;\n};\nstruct ReflectedLight {\n	vec3 directDiffuse;\n	vec3 directSpecular;\n	vec3 indirectDiffuse;\n	vec3 indirectSpecular;\n};\n#ifdef USE_ALPHAHASH\n	varying vec3 vPosition;\n#endif\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n}\nvec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n}\nmat3 transposeMat3( const in mat3 m ) {\n	mat3 tmp;\n	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );\n	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );\n	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );\n	return tmp;\n}\nfloat luminance( const in vec3 rgb ) {\n	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );\n	return dot( weights, rgb );\n}\nbool isPerspectiveMatrix( mat4 m ) {\n	return m[ 2 ][ 3 ] == - 1.0;\n}\nvec2 equirectUv( in vec3 dir ) {\n	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;\n	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n	return vec2( u, v );\n}\nvec3 BRDF_Lambert( const in vec3 diffuseColor ) {\n	return RECIPROCAL_PI * diffuseColor;\n}\nvec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {\n	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n}\nfloat F_Schlick( const in float f0, const in float f90, const in float dotVH ) {\n	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n} // validated", cube_uv_reflection_fragment: "#ifdef ENVMAP_TYPE_CUBE_UV\n	#define cubeUV_minMipLevel 4.0\n	#define cubeUV_minTileSize 16.0\n	float getFace( vec3 direction ) {\n		vec3 absDirection = abs( direction );\n		float face = - 1.0;\n		if ( absDirection.x > absDirection.z ) {\n			if ( absDirection.x > absDirection.y )\n				face = direction.x > 0.0 ? 0.0 : 3.0;\n			else\n				face = direction.y > 0.0 ? 1.0 : 4.0;\n		} else {\n			if ( absDirection.z > absDirection.y )\n				face = direction.z > 0.0 ? 2.0 : 5.0;\n			else\n				face = direction.y > 0.0 ? 1.0 : 4.0;\n		}\n		return face;\n	}\n	vec2 getUV( vec3 direction, float face ) {\n		vec2 uv;\n		if ( face == 0.0 ) {\n			uv = vec2( direction.z, direction.y ) / abs( direction.x );\n		} else if ( face == 1.0 ) {\n			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );\n		} else if ( face == 2.0 ) {\n			uv = vec2( - direction.x, direction.y ) / abs( direction.z );\n		} else if ( face == 3.0 ) {\n			uv = vec2( - direction.z, direction.y ) / abs( direction.x );\n		} else if ( face == 4.0 ) {\n			uv = vec2( - direction.x, direction.z ) / abs( direction.y );\n		} else {\n			uv = vec2( direction.x, direction.y ) / abs( direction.z );\n		}\n		return 0.5 * ( uv + 1.0 );\n	}\n	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {\n		float face = getFace( direction );\n		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );\n		mipInt = max( mipInt, cubeUV_minMipLevel );\n		float faceSize = exp2( mipInt );\n		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;\n		if ( face > 2.0 ) {\n			uv.y += faceSize;\n			face -= 3.0;\n		}\n		uv.x += face * faceSize;\n		uv.x += filterInt * 3.0 * cubeUV_minTileSize;\n		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );\n		uv.x *= CUBEUV_TEXEL_WIDTH;\n		uv.y *= CUBEUV_TEXEL_HEIGHT;\n		#ifdef texture2DGradEXT\n			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;\n		#else\n			return texture2D( envMap, uv ).rgb;\n		#endif\n	}\n	#define cubeUV_r0 1.0\n	#define cubeUV_m0 - 2.0\n	#define cubeUV_r1 0.8\n	#define cubeUV_m1 - 1.0\n	#define cubeUV_r4 0.4\n	#define cubeUV_m4 2.0\n	#define cubeUV_r5 0.305\n	#define cubeUV_m5 3.0\n	#define cubeUV_r6 0.21\n	#define cubeUV_m6 4.0\n	float roughnessToMip( float roughness ) {\n		float mip = 0.0;\n		if ( roughness >= cubeUV_r1 ) {\n			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;\n		} else if ( roughness >= cubeUV_r4 ) {\n			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;\n		} else if ( roughness >= cubeUV_r5 ) {\n			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;\n		} else if ( roughness >= cubeUV_r6 ) {\n			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;\n		} else {\n			mip = - 2.0 * log2( 1.16 * roughness );		}\n		return mip;\n	}\n	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {\n		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );\n		float mipF = fract( mip );\n		float mipInt = floor( mip );\n		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );\n		if ( mipF == 0.0 ) {\n			return vec4( color0, 1.0 );\n		} else {\n			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );\n			return vec4( mix( color0, color1, mipF ), 1.0 );\n		}\n	}\n#endif", defaultnormal_vertex: "vec3 transformedNormal = objectNormal;\n#ifdef USE_TANGENT\n	vec3 transformedTangent = objectTangent;\n#endif\n#ifdef USE_BATCHING\n	mat3 bm = mat3( batchingMatrix );\n	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );\n	transformedNormal = bm * transformedNormal;\n	#ifdef USE_TANGENT\n		transformedTangent = bm * transformedTangent;\n	#endif\n#endif\n#ifdef USE_INSTANCING\n	mat3 im = mat3( instanceMatrix );\n	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );\n	transformedNormal = im * transformedNormal;\n	#ifdef USE_TANGENT\n		transformedTangent = im * transformedTangent;\n	#endif\n#endif\ntransformedNormal = normalMatrix * transformedNormal;\n#ifdef FLIP_SIDED\n	transformedNormal = - transformedNormal;\n#endif\n#ifdef USE_TANGENT\n	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;\n	#ifdef FLIP_SIDED\n		transformedTangent = - transformedTangent;\n	#endif\n#endif", displacementmap_pars_vertex: "#ifdef USE_DISPLACEMENTMAP\n	uniform sampler2D displacementMap;\n	uniform float displacementScale;\n	uniform float displacementBias;\n#endif", displacementmap_vertex: "#ifdef USE_DISPLACEMENTMAP\n	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );\n#endif", emissivemap_fragment: "#ifdef USE_EMISSIVEMAP\n	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );\n	totalEmissiveRadiance *= emissiveColor.rgb;\n#endif", emissivemap_pars_fragment: "#ifdef USE_EMISSIVEMAP\n	uniform sampler2D emissiveMap;\n#endif", colorspace_fragment: "gl_FragColor = linearToOutputTexel( gl_FragColor );", colorspace_pars_fragment: "\nconst mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(\n	vec3( 0.8224621, 0.177538, 0.0 ),\n	vec3( 0.0331941, 0.9668058, 0.0 ),\n	vec3( 0.0170827, 0.0723974, 0.9105199 )\n);\nconst mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(\n	vec3( 1.2249401, - 0.2249404, 0.0 ),\n	vec3( - 0.0420569, 1.0420571, 0.0 ),\n	vec3( - 0.0196376, - 0.0786361, 1.0982735 )\n);\nvec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {\n	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );\n}\nvec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {\n	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );\n}\nvec4 LinearTransferOETF( in vec4 value ) {\n	return value;\n}\nvec4 sRGBTransferOETF( in vec4 value ) {\n	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );\n}\nvec4 LinearToLinear( in vec4 value ) {\n	return value;\n}\nvec4 LinearTosRGB( in vec4 value ) {\n	return sRGBTransferOETF( value );\n}", envmap_fragment: "#ifdef USE_ENVMAP\n	#ifdef ENV_WORLDPOS\n		vec3 cameraToFrag;\n		if ( isOrthographic ) {\n			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n		} else {\n			cameraToFrag = normalize( vWorldPosition - cameraPosition );\n		}\n		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vec3 reflectVec = reflect( cameraToFrag, worldNormal );\n		#else\n			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );\n		#endif\n	#else\n		vec3 reflectVec = vReflect;\n	#endif\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n	#else\n		vec4 envColor = vec4( 0.0 );\n	#endif\n	#ifdef ENVMAP_BLENDING_MULTIPLY\n		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n	#elif defined( ENVMAP_BLENDING_MIX )\n		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n	#elif defined( ENVMAP_BLENDING_ADD )\n		outgoingLight += envColor.xyz * specularStrength * reflectivity;\n	#endif\n#endif", envmap_common_pars_fragment: "#ifdef USE_ENVMAP\n	uniform float envMapIntensity;\n	uniform float flipEnvMap;\n	#ifdef ENVMAP_TYPE_CUBE\n		uniform samplerCube envMap;\n	#else\n		uniform sampler2D envMap;\n	#endif\n	\n#endif", envmap_pars_fragment: "#ifdef USE_ENVMAP\n	uniform float reflectivity;\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n		#define ENV_WORLDPOS\n	#endif\n	#ifdef ENV_WORLDPOS\n		varying vec3 vWorldPosition;\n		uniform float refractionRatio;\n	#else\n		varying vec3 vReflect;\n	#endif\n#endif", envmap_pars_vertex: "#ifdef USE_ENVMAP\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n		#define ENV_WORLDPOS\n	#endif\n	#ifdef ENV_WORLDPOS\n		\n		varying vec3 vWorldPosition;\n	#else\n		varying vec3 vReflect;\n		uniform float refractionRatio;\n	#endif\n#endif", envmap_physical_pars_fragment: "#ifdef USE_ENVMAP\n	vec3 getIBLIrradiance( const in vec3 normal ) {\n		#ifdef ENVMAP_TYPE_CUBE_UV\n			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );\n			return PI * envMapColor.rgb * envMapIntensity;\n		#else\n			return vec3( 0.0 );\n		#endif\n	}\n	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {\n		#ifdef ENVMAP_TYPE_CUBE_UV\n			vec3 reflectVec = reflect( - viewDir, normal );\n			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );\n			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );\n			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );\n			return envMapColor.rgb * envMapIntensity;\n		#else\n			return vec3( 0.0 );\n		#endif\n	}\n	#ifdef USE_ANISOTROPY\n		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {\n			#ifdef ENVMAP_TYPE_CUBE_UV\n				vec3 bentNormal = cross( bitangent, viewDir );\n				bentNormal = normalize( cross( bentNormal, bitangent ) );\n				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );\n				return getIBLRadiance( viewDir, bentNormal, roughness );\n			#else\n				return vec3( 0.0 );\n			#endif\n		}\n	#endif\n#endif", envmap_vertex: "#ifdef USE_ENVMAP\n	#ifdef ENV_WORLDPOS\n		vWorldPosition = worldPosition.xyz;\n	#else\n		vec3 cameraToVertex;\n		if ( isOrthographic ) {\n			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n		} else {\n			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n		}\n		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vReflect = reflect( cameraToVertex, worldNormal );\n		#else\n			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n		#endif\n	#endif\n#endif", fog_vertex: "#ifdef USE_FOG\n	vFogDepth = - mvPosition.z;\n#endif", fog_pars_vertex: "#ifdef USE_FOG\n	varying float vFogDepth;\n#endif", fog_fragment: "#ifdef USE_FOG\n	#ifdef FOG_EXP2\n		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );\n	#else\n		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );\n	#endif\n	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n#endif", fog_pars_fragment: "#ifdef USE_FOG\n	uniform vec3 fogColor;\n	varying float vFogDepth;\n	#ifdef FOG_EXP2\n		uniform float fogDensity;\n	#else\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n#endif", gradientmap_pars_fragment: "#ifdef USE_GRADIENTMAP\n	uniform sampler2D gradientMap;\n#endif\nvec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {\n	float dotNL = dot( normal, lightDirection );\n	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );\n	#ifdef USE_GRADIENTMAP\n		return vec3( texture2D( gradientMap, coord ).r );\n	#else\n		vec2 fw = fwidth( coord ) * 0.5;\n		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );\n	#endif\n}", lightmap_fragment: "#ifdef USE_LIGHTMAP\n	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;\n	reflectedLight.indirectDiffuse += lightMapIrradiance;\n#endif", lightmap_pars_fragment: "#ifdef USE_LIGHTMAP\n	uniform sampler2D lightMap;\n	uniform float lightMapIntensity;\n#endif", lights_lambert_fragment: "LambertMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularStrength = specularStrength;", lights_lambert_pars_fragment: "varying vec3 vViewPosition;\nstruct LambertMaterial {\n	vec3 diffuseColor;\n	float specularStrength;\n};\nvoid RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_Lambert\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert", lights_pars_begin: "uniform bool receiveShadow;\nuniform vec3 ambientLightColor;\n#if defined( USE_LIGHT_PROBES )\n	uniform vec3 lightProbe[ 9 ];\n#endif\nvec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {\n	float x = normal.x, y = normal.y, z = normal.z;\n	vec3 result = shCoefficients[ 0 ] * 0.886227;\n	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;\n	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;\n	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;\n	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;\n	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;\n	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );\n	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;\n	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );\n	return result;\n}\nvec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {\n	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );\n	return irradiance;\n}\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n	vec3 irradiance = ambientLightColor;\n	return irradiance;\n}\nfloat getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n	#if defined ( LEGACY_LIGHTS )\n		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {\n			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );\n		}\n		return 1.0;\n	#else\n		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n		if ( cutoffDistance > 0.0 ) {\n			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n		}\n		return distanceFalloff;\n	#endif\n}\nfloat getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {\n	return smoothstep( coneCosine, penumbraCosine, angleCosine );\n}\n#if NUM_DIR_LIGHTS > 0\n	struct DirectionalLight {\n		vec3 direction;\n		vec3 color;\n	};\n	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {\n		light.color = directionalLight.color;\n		light.direction = directionalLight.direction;\n		light.visible = true;\n	}\n#endif\n#if NUM_POINT_LIGHTS > 0\n	struct PointLight {\n		vec3 position;\n		vec3 color;\n		float distance;\n		float decay;\n	};\n	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {\n		vec3 lVector = pointLight.position - geometryPosition;\n		light.direction = normalize( lVector );\n		float lightDistance = length( lVector );\n		light.color = pointLight.color;\n		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );\n		light.visible = ( light.color != vec3( 0.0 ) );\n	}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n	struct SpotLight {\n		vec3 position;\n		vec3 direction;\n		vec3 color;\n		float distance;\n		float decay;\n		float coneCos;\n		float penumbraCos;\n	};\n	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];\n	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {\n		vec3 lVector = spotLight.position - geometryPosition;\n		light.direction = normalize( lVector );\n		float angleCos = dot( light.direction, spotLight.direction );\n		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n		if ( spotAttenuation > 0.0 ) {\n			float lightDistance = length( lVector );\n			light.color = spotLight.color * spotAttenuation;\n			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );\n			light.visible = ( light.color != vec3( 0.0 ) );\n		} else {\n			light.color = vec3( 0.0 );\n			light.visible = false;\n		}\n	}\n#endif\n#if NUM_RECT_AREA_LIGHTS > 0\n	struct RectAreaLight {\n		vec3 color;\n		vec3 position;\n		vec3 halfWidth;\n		vec3 halfHeight;\n	};\n	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;\n	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];\n#endif\n#if NUM_HEMI_LIGHTS > 0\n	struct HemisphereLight {\n		vec3 direction;\n		vec3 skyColor;\n		vec3 groundColor;\n	};\n	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];\n	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {\n		float dotNL = dot( normal, hemiLight.direction );\n		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n		return irradiance;\n	}\n#endif", lights_toon_fragment: "ToonMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;", lights_toon_pars_fragment: "varying vec3 vViewPosition;\nstruct ToonMaterial {\n	vec3 diffuseColor;\n};\nvoid RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_Toon\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon", lights_phong_fragment: "BlinnPhongMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularColor = specular;\nmaterial.specularShininess = shininess;\nmaterial.specularStrength = specularStrength;", lights_phong_pars_fragment: "varying vec3 vViewPosition;\nstruct BlinnPhongMaterial {\n	vec3 diffuseColor;\n	vec3 specularColor;\n	float specularShininess;\n	float specularStrength;\n};\nvoid RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;\n}\nvoid RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_BlinnPhong\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong", lights_physical_fragment: "PhysicalMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );\nvec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );\nfloat geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );\nmaterial.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;\nmaterial.roughness = min( material.roughness, 1.0 );\n#ifdef IOR\n	material.ior = ior;\n	#ifdef USE_SPECULAR\n		float specularIntensityFactor = specularIntensity;\n		vec3 specularColorFactor = specularColor;\n		#ifdef USE_SPECULAR_COLORMAP\n			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;\n		#endif\n		#ifdef USE_SPECULAR_INTENSITYMAP\n			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;\n		#endif\n		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );\n	#else\n		float specularIntensityFactor = 1.0;\n		vec3 specularColorFactor = vec3( 1.0 );\n		material.specularF90 = 1.0;\n	#endif\n	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );\n#else\n	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );\n	material.specularF90 = 1.0;\n#endif\n#ifdef USE_CLEARCOAT\n	material.clearcoat = clearcoat;\n	material.clearcoatRoughness = clearcoatRoughness;\n	material.clearcoatF0 = vec3( 0.04 );\n	material.clearcoatF90 = 1.0;\n	#ifdef USE_CLEARCOATMAP\n		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;\n	#endif\n	#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;\n	#endif\n	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );\n	material.clearcoatRoughness += geometryRoughness;\n	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );\n#endif\n#ifdef USE_IRIDESCENCE\n	material.iridescence = iridescence;\n	material.iridescenceIOR = iridescenceIOR;\n	#ifdef USE_IRIDESCENCEMAP\n		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;\n	#endif\n	#ifdef USE_IRIDESCENCE_THICKNESSMAP\n		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;\n	#else\n		material.iridescenceThickness = iridescenceThicknessMaximum;\n	#endif\n#endif\n#ifdef USE_SHEEN\n	material.sheenColor = sheenColor;\n	#ifdef USE_SHEEN_COLORMAP\n		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;\n	#endif\n	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );\n	#ifdef USE_SHEEN_ROUGHNESSMAP\n		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;\n	#endif\n#endif\n#ifdef USE_ANISOTROPY\n	#ifdef USE_ANISOTROPYMAP\n		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );\n		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;\n		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;\n	#else\n		vec2 anisotropyV = anisotropyVector;\n	#endif\n	material.anisotropy = length( anisotropyV );\n	if( material.anisotropy == 0.0 ) {\n		anisotropyV = vec2( 1.0, 0.0 );\n	} else {\n		anisotropyV /= material.anisotropy;\n		material.anisotropy = saturate( material.anisotropy );\n	}\n	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );\n	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;\n	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;\n#endif", lights_physical_pars_fragment: "struct PhysicalMaterial {\n	vec3 diffuseColor;\n	float roughness;\n	vec3 specularColor;\n	float specularF90;\n	#ifdef USE_CLEARCOAT\n		float clearcoat;\n		float clearcoatRoughness;\n		vec3 clearcoatF0;\n		float clearcoatF90;\n	#endif\n	#ifdef USE_IRIDESCENCE\n		float iridescence;\n		float iridescenceIOR;\n		float iridescenceThickness;\n		vec3 iridescenceFresnel;\n		vec3 iridescenceF0;\n	#endif\n	#ifdef USE_SHEEN\n		vec3 sheenColor;\n		float sheenRoughness;\n	#endif\n	#ifdef IOR\n		float ior;\n	#endif\n	#ifdef USE_TRANSMISSION\n		float transmission;\n		float transmissionAlpha;\n		float thickness;\n		float attenuationDistance;\n		vec3 attenuationColor;\n	#endif\n	#ifdef USE_ANISOTROPY\n		float anisotropy;\n		float alphaT;\n		vec3 anisotropyT;\n		vec3 anisotropyB;\n	#endif\n};\nvec3 clearcoatSpecularDirect = vec3( 0.0 );\nvec3 clearcoatSpecularIndirect = vec3( 0.0 );\nvec3 sheenSpecularDirect = vec3( 0.0 );\nvec3 sheenSpecularIndirect = vec3(0.0 );\nvec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {\n    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );\n    float x2 = x * x;\n    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );\n    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );\n}\nfloat V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n	float a2 = pow2( alpha );\n	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n	return 0.5 / max( gv + gl, EPSILON );\n}\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n	float a2 = pow2( alpha );\n	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;\n	return RECIPROCAL_PI * a2 / pow2( denom );\n}\n#ifdef USE_ANISOTROPY\n	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {\n		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );\n		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );\n		float v = 0.5 / ( gv + gl );\n		return saturate(v);\n	}\n	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {\n		float a2 = alphaT * alphaB;\n		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );\n		highp float v2 = dot( v, v );\n		float w2 = a2 / v2;\n		return RECIPROCAL_PI * a2 * pow2 ( w2 );\n	}\n#endif\n#ifdef USE_CLEARCOAT\n	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {\n		vec3 f0 = material.clearcoatF0;\n		float f90 = material.clearcoatF90;\n		float roughness = material.clearcoatRoughness;\n		float alpha = pow2( roughness );\n		vec3 halfDir = normalize( lightDir + viewDir );\n		float dotNL = saturate( dot( normal, lightDir ) );\n		float dotNV = saturate( dot( normal, viewDir ) );\n		float dotNH = saturate( dot( normal, halfDir ) );\n		float dotVH = saturate( dot( viewDir, halfDir ) );\n		vec3 F = F_Schlick( f0, f90, dotVH );\n		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n		float D = D_GGX( alpha, dotNH );\n		return F * ( V * D );\n	}\n#endif\nvec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {\n	vec3 f0 = material.specularColor;\n	float f90 = material.specularF90;\n	float roughness = material.roughness;\n	float alpha = pow2( roughness );\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNL = saturate( dot( normal, lightDir ) );\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float dotVH = saturate( dot( viewDir, halfDir ) );\n	vec3 F = F_Schlick( f0, f90, dotVH );\n	#ifdef USE_IRIDESCENCE\n		F = mix( F, material.iridescenceFresnel, material.iridescence );\n	#endif\n	#ifdef USE_ANISOTROPY\n		float dotTL = dot( material.anisotropyT, lightDir );\n		float dotTV = dot( material.anisotropyT, viewDir );\n		float dotTH = dot( material.anisotropyT, halfDir );\n		float dotBL = dot( material.anisotropyB, lightDir );\n		float dotBV = dot( material.anisotropyB, viewDir );\n		float dotBH = dot( material.anisotropyB, halfDir );\n		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );\n		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );\n	#else\n		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n		float D = D_GGX( alpha, dotNH );\n	#endif\n	return F * ( V * D );\n}\nvec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {\n	const float LUT_SIZE = 64.0;\n	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;\n	const float LUT_BIAS = 0.5 / LUT_SIZE;\n	float dotNV = saturate( dot( N, V ) );\n	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );\n	uv = uv * LUT_SCALE + LUT_BIAS;\n	return uv;\n}\nfloat LTC_ClippedSphereFormFactor( const in vec3 f ) {\n	float l = length( f );\n	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );\n}\nvec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {\n	float x = dot( v1, v2 );\n	float y = abs( x );\n	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;\n	float b = 3.4175940 + ( 4.1616724 + y ) * y;\n	float v = a / b;\n	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;\n	return cross( v1, v2 ) * theta_sintheta;\n}\nvec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {\n	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];\n	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];\n	vec3 lightNormal = cross( v1, v2 );\n	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );\n	vec3 T1, T2;\n	T1 = normalize( V - N * dot( V, N ) );\n	T2 = - cross( N, T1 );\n	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );\n	vec3 coords[ 4 ];\n	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );\n	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );\n	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );\n	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );\n	coords[ 0 ] = normalize( coords[ 0 ] );\n	coords[ 1 ] = normalize( coords[ 1 ] );\n	coords[ 2 ] = normalize( coords[ 2 ] );\n	coords[ 3 ] = normalize( coords[ 3 ] );\n	vec3 vectorFormFactor = vec3( 0.0 );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );\n	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );\n	return vec3( result );\n}\n#if defined( USE_SHEEN )\nfloat D_Charlie( float roughness, float dotNH ) {\n	float alpha = pow2( roughness );\n	float invAlpha = 1.0 / alpha;\n	float cos2h = dotNH * dotNH;\n	float sin2h = max( 1.0 - cos2h, 0.0078125 );\n	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );\n}\nfloat V_Neubelt( float dotNV, float dotNL ) {\n	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );\n}\nvec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNL = saturate( dot( normal, lightDir ) );\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float D = D_Charlie( sheenRoughness, dotNH );\n	float V = V_Neubelt( dotNV, dotNL );\n	return sheenColor * ( D * V );\n}\n#endif\nfloat IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float r2 = roughness * roughness;\n	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;\n	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;\n	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );\n	return saturate( DG * RECIPROCAL_PI );\n}\nvec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {\n	float dotNV = saturate( dot( normal, viewDir ) );\n	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\n	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\n	vec4 r = roughness * c0 + c1;\n	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\n	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;\n	return fab;\n}\nvec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {\n	vec2 fab = DFGApprox( normal, viewDir, roughness );\n	return specularColor * fab.x + specularF90 * fab.y;\n}\n#ifdef USE_IRIDESCENCE\nvoid computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#else\nvoid computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#endif\n	vec2 fab = DFGApprox( normal, viewDir, roughness );\n	#ifdef USE_IRIDESCENCE\n		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );\n	#else\n		vec3 Fr = specularColor;\n	#endif\n	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;\n	float Ess = fab.x + fab.y;\n	float Ems = 1.0 - Ess;\n	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );\n	singleScatter += FssEss;\n	multiScatter += Fms * Ems;\n}\n#if NUM_RECT_AREA_LIGHTS > 0\n	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n		vec3 normal = geometryNormal;\n		vec3 viewDir = geometryViewDir;\n		vec3 position = geometryPosition;\n		vec3 lightPos = rectAreaLight.position;\n		vec3 halfWidth = rectAreaLight.halfWidth;\n		vec3 halfHeight = rectAreaLight.halfHeight;\n		vec3 lightColor = rectAreaLight.color;\n		float roughness = material.roughness;\n		vec3 rectCoords[ 4 ];\n		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;\n		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;\n		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;\n		vec2 uv = LTC_Uv( normal, viewDir, roughness );\n		vec4 t1 = texture2D( ltc_1, uv );\n		vec4 t2 = texture2D( ltc_2, uv );\n		mat3 mInv = mat3(\n			vec3( t1.x, 0, t1.y ),\n			vec3(    0, 1,    0 ),\n			vec3( t1.z, 0, t1.w )\n		);\n		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );\n		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );\n		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );\n	}\n#endif\nvoid RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	#ifdef USE_CLEARCOAT\n		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );\n		vec3 ccIrradiance = dotNLcc * directLight.color;\n		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );\n	#endif\n	#ifdef USE_SHEEN\n		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );\n	#endif\n	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {\n	#ifdef USE_CLEARCOAT\n		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );\n	#endif\n	#ifdef USE_SHEEN\n		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n	#endif\n	vec3 singleScattering = vec3( 0.0 );\n	vec3 multiScattering = vec3( 0.0 );\n	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;\n	#ifdef USE_IRIDESCENCE\n		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );\n	#else\n		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );\n	#endif\n	vec3 totalScattering = singleScattering + multiScattering;\n	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );\n	reflectedLight.indirectSpecular += radiance * singleScattering;\n	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;\n	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;\n}\n#define RE_Direct				RE_Direct_Physical\n#define RE_Direct_RectArea		RE_Direct_RectArea_Physical\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical\n#define RE_IndirectSpecular		RE_IndirectSpecular_Physical\nfloat computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\n	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\n}", lights_fragment_begin: "\nvec3 geometryPosition = - vViewPosition;\nvec3 geometryNormal = normal;\nvec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );\nvec3 geometryClearcoatNormal = vec3( 0.0 );\n#ifdef USE_CLEARCOAT\n	geometryClearcoatNormal = clearcoatNormal;\n#endif\n#ifdef USE_IRIDESCENCE\n	float dotNVi = saturate( dot( normal, geometryViewDir ) );\n	if ( material.iridescenceThickness == 0.0 ) {\n		material.iridescence = 0.0;\n	} else {\n		material.iridescence = saturate( material.iridescence );\n	}\n	if ( material.iridescence > 0.0 ) {\n		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );\n		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );\n	}\n#endif\nIncidentLight directLight;\n#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n	PointLight pointLight;\n	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0\n	PointLightShadow pointLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n		pointLight = pointLights[ i ];\n		getPointLightInfo( pointLight, geometryPosition, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )\n		pointLightShadow = pointLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n	SpotLight spotLight;\n	vec4 spotColor;\n	vec3 spotLightCoord;\n	bool inSpotLightMap;\n	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0\n	SpotLightShadow spotLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n		spotLight = spotLights[ i ];\n		getSpotLightInfo( spotLight, geometryPosition, directLight );\n		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX\n		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS\n		#else\n		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n		#endif\n		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )\n			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;\n			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );\n			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );\n			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;\n		#endif\n		#undef SPOT_LIGHT_MAP_INDEX\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n		spotLightShadow = spotLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n	DirectionalLight directionalLight;\n	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n	DirectionalLightShadow directionalLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n		directionalLight = directionalLights[ i ];\n		getDirectionalLightInfo( directionalLight, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )\n		directionalLightShadow = directionalLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )\n	RectAreaLight rectAreaLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\n		rectAreaLight = rectAreaLights[ i ];\n		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if defined( RE_IndirectDiffuse )\n	vec3 iblIrradiance = vec3( 0.0 );\n	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n	#if defined( USE_LIGHT_PROBES )\n		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );\n	#endif\n	#if ( NUM_HEMI_LIGHTS > 0 )\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );\n		}\n		#pragma unroll_loop_end\n	#endif\n#endif\n#if defined( RE_IndirectSpecular )\n	vec3 radiance = vec3( 0.0 );\n	vec3 clearcoatRadiance = vec3( 0.0 );\n#endif", lights_fragment_maps: "#if defined( RE_IndirectDiffuse )\n	#ifdef USE_LIGHTMAP\n		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;\n		irradiance += lightMapIrradiance;\n	#endif\n	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )\n		iblIrradiance += getIBLIrradiance( geometryNormal );\n	#endif\n#endif\n#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )\n	#ifdef USE_ANISOTROPY\n		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );\n	#else\n		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );\n	#endif\n	#ifdef USE_CLEARCOAT\n		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );\n	#endif\n#endif", lights_fragment_end: "#if defined( RE_IndirectDiffuse )\n	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n#endif\n#if defined( RE_IndirectSpecular )\n	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n#endif", logdepthbuf_fragment: "#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )\n	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;\n#endif", logdepthbuf_pars_fragment: "#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )\n	uniform float logDepthBufFC;\n	varying float vFragDepth;\n	varying float vIsPerspective;\n#endif", logdepthbuf_pars_vertex: "#ifdef USE_LOGDEPTHBUF\n	#ifdef USE_LOGDEPTHBUF_EXT\n		varying float vFragDepth;\n		varying float vIsPerspective;\n	#else\n		uniform float logDepthBufFC;\n	#endif\n#endif", logdepthbuf_vertex: "#ifdef USE_LOGDEPTHBUF\n	#ifdef USE_LOGDEPTHBUF_EXT\n		vFragDepth = 1.0 + gl_Position.w;\n		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );\n	#else\n		if ( isPerspectiveMatrix( projectionMatrix ) ) {\n			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;\n			gl_Position.z *= gl_Position.w;\n		}\n	#endif\n#endif", map_fragment: "#ifdef USE_MAP\n	vec4 sampledDiffuseColor = texture2D( map, vMapUv );\n	#ifdef DECODE_VIDEO_TEXTURE\n		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );\n	\n	#endif\n	diffuseColor *= sampledDiffuseColor;\n#endif", map_pars_fragment: "#ifdef USE_MAP\n	uniform sampler2D map;\n#endif", map_particle_fragment: "#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n	#if defined( USE_POINTS_UV )\n		vec2 uv = vUv;\n	#else\n		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;\n	#endif\n#endif\n#ifdef USE_MAP\n	diffuseColor *= texture2D( map, uv );\n#endif\n#ifdef USE_ALPHAMAP\n	diffuseColor.a *= texture2D( alphaMap, uv ).g;\n#endif", map_particle_pars_fragment: "#if defined( USE_POINTS_UV )\n	varying vec2 vUv;\n#else\n	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n		uniform mat3 uvTransform;\n	#endif\n#endif\n#ifdef USE_MAP\n	uniform sampler2D map;\n#endif\n#ifdef USE_ALPHAMAP\n	uniform sampler2D alphaMap;\n#endif", metalnessmap_fragment: "float metalnessFactor = metalness;\n#ifdef USE_METALNESSMAP\n	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );\n	metalnessFactor *= texelMetalness.b;\n#endif", metalnessmap_pars_fragment: "#ifdef USE_METALNESSMAP\n	uniform sampler2D metalnessMap;\n#endif", morphcolor_vertex: "#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )\n	vColor *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		#if defined( USE_COLOR_ALPHA )\n			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];\n		#elif defined( USE_COLOR )\n			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];\n		#endif\n	}\n#endif", morphnormal_vertex: "#ifdef USE_MORPHNORMALS\n	objectNormal *= morphTargetBaseInfluence;\n	#ifdef MORPHTARGETS_TEXTURE\n		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];\n		}\n	#else\n		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];\n		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];\n		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];\n		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];\n	#endif\n#endif", morphtarget_pars_vertex: "#ifdef USE_MORPHTARGETS\n	uniform float morphTargetBaseInfluence;\n	#ifdef MORPHTARGETS_TEXTURE\n		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n		uniform sampler2DArray morphTargetsTexture;\n		uniform ivec2 morphTargetsTextureSize;\n		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {\n			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;\n			int y = texelIndex / morphTargetsTextureSize.x;\n			int x = texelIndex - y * morphTargetsTextureSize.x;\n			ivec3 morphUV = ivec3( x, y, morphTargetIndex );\n			return texelFetch( morphTargetsTexture, morphUV, 0 );\n		}\n	#else\n		#ifndef USE_MORPHNORMALS\n			uniform float morphTargetInfluences[ 8 ];\n		#else\n			uniform float morphTargetInfluences[ 4 ];\n		#endif\n	#endif\n#endif", morphtarget_vertex: "#ifdef USE_MORPHTARGETS\n	transformed *= morphTargetBaseInfluence;\n	#ifdef MORPHTARGETS_TEXTURE\n		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];\n		}\n	#else\n		transformed += morphTarget0 * morphTargetInfluences[ 0 ];\n		transformed += morphTarget1 * morphTargetInfluences[ 1 ];\n		transformed += morphTarget2 * morphTargetInfluences[ 2 ];\n		transformed += morphTarget3 * morphTargetInfluences[ 3 ];\n		#ifndef USE_MORPHNORMALS\n			transformed += morphTarget4 * morphTargetInfluences[ 4 ];\n			transformed += morphTarget5 * morphTargetInfluences[ 5 ];\n			transformed += morphTarget6 * morphTargetInfluences[ 6 ];\n			transformed += morphTarget7 * morphTargetInfluences[ 7 ];\n		#endif\n	#endif\n#endif", normal_fragment_begin: "float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;\n#ifdef FLAT_SHADED\n	vec3 fdx = dFdx( vViewPosition );\n	vec3 fdy = dFdy( vViewPosition );\n	vec3 normal = normalize( cross( fdx, fdy ) );\n#else\n	vec3 normal = normalize( vNormal );\n	#ifdef DOUBLE_SIDED\n		normal *= faceDirection;\n	#endif\n#endif\n#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )\n	#ifdef USE_TANGENT\n		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n	#else\n		mat3 tbn = getTangentFrame( - vViewPosition, normal,\n		#if defined( USE_NORMALMAP )\n			vNormalMapUv\n		#elif defined( USE_CLEARCOAT_NORMALMAP )\n			vClearcoatNormalMapUv\n		#else\n			vUv\n		#endif\n		);\n	#endif\n	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )\n		tbn[0] *= faceDirection;\n		tbn[1] *= faceDirection;\n	#endif\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	#ifdef USE_TANGENT\n		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n	#else\n		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );\n	#endif\n	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )\n		tbn2[0] *= faceDirection;\n		tbn2[1] *= faceDirection;\n	#endif\n#endif\nvec3 nonPerturbedNormal = normal;", normal_fragment_maps: "#ifdef USE_NORMALMAP_OBJECTSPACE\n	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n	#ifdef FLIP_SIDED\n		normal = - normal;\n	#endif\n	#ifdef DOUBLE_SIDED\n		normal = normal * faceDirection;\n	#endif\n	normal = normalize( normalMatrix * normal );\n#elif defined( USE_NORMALMAP_TANGENTSPACE )\n	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n	mapN.xy *= normalScale;\n	normal = normalize( tbn * mapN );\n#elif defined( USE_BUMPMAP )\n	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );\n#endif", normal_pars_fragment: "#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n	#ifdef USE_TANGENT\n		varying vec3 vTangent;\n		varying vec3 vBitangent;\n	#endif\n#endif", normal_pars_vertex: "#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n	#ifdef USE_TANGENT\n		varying vec3 vTangent;\n		varying vec3 vBitangent;\n	#endif\n#endif", normal_vertex: "#ifndef FLAT_SHADED\n	vNormal = normalize( transformedNormal );\n	#ifdef USE_TANGENT\n		vTangent = normalize( transformedTangent );\n		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );\n	#endif\n#endif", normalmap_pars_fragment: "#ifdef USE_NORMALMAP\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n#endif\n#ifdef USE_NORMALMAP_OBJECTSPACE\n	uniform mat3 normalMatrix;\n#endif\n#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )\n	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( uv.st );\n		vec2 st1 = dFdy( uv.st );\n		vec3 N = surf_norm;\n		vec3 q1perp = cross( q1, N );\n		vec3 q0perp = cross( N, q0 );\n		vec3 T = q1perp * st0.x + q0perp * st1.x;\n		vec3 B = q1perp * st0.y + q0perp * st1.y;\n		float det = max( dot( T, T ), dot( B, B ) );\n		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );\n		return mat3( T * scale, B * scale, N );\n	}\n#endif", clearcoat_normal_fragment_begin: "#ifdef USE_CLEARCOAT\n	vec3 clearcoatNormal = nonPerturbedNormal;\n#endif", clearcoat_normal_fragment_maps: "#ifdef USE_CLEARCOAT_NORMALMAP\n	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;\n	clearcoatMapN.xy *= clearcoatNormalScale;\n	clearcoatNormal = normalize( tbn2 * clearcoatMapN );\n#endif", clearcoat_pars_fragment: "#ifdef USE_CLEARCOATMAP\n	uniform sampler2D clearcoatMap;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	uniform sampler2D clearcoatNormalMap;\n	uniform vec2 clearcoatNormalScale;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	uniform sampler2D clearcoatRoughnessMap;\n#endif", iridescence_pars_fragment: "#ifdef USE_IRIDESCENCEMAP\n	uniform sampler2D iridescenceMap;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	uniform sampler2D iridescenceThicknessMap;\n#endif", opaque_fragment: "#ifdef OPAQUE\ndiffuseColor.a = 1.0;\n#endif\n#ifdef USE_TRANSMISSION\ndiffuseColor.a *= material.transmissionAlpha;\n#endif\ngl_FragColor = vec4( outgoingLight, diffuseColor.a );", packing: "vec3 packNormalToRGB( const in vec3 normal ) {\n	return normalize( normal ) * 0.5 + 0.5;\n}\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n	return 2.0 * rgb.xyz - 1.0;\n}\nconst float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\nconst float ShiftRight8 = 1. / 256.;\nvec4 packDepthToRGBA( const in float v ) {\n	vec4 r = vec4( fract( v * PackFactors ), v );\n	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;\n}\nfloat unpackRGBAToDepth( const in vec4 v ) {\n	return dot( v, UnpackFactors );\n}\nvec2 packDepthToRG( in highp float v ) {\n	return packDepthToRGBA( v ).yx;\n}\nfloat unpackRGToDepth( const in highp vec2 v ) {\n	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );\n}\nvec4 pack2HalfToRGBA( vec2 v ) {\n	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );\n	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );\n}\nvec2 unpackRGBATo2Half( vec4 v ) {\n	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );\n}\nfloat viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n	return ( viewZ + near ) / ( near - far );\n}\nfloat orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {\n	return depth * ( near - far ) - near;\n}\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {\n	return ( near * far ) / ( ( far - near ) * depth - far );\n}", premultiplied_alpha_fragment: "#ifdef PREMULTIPLIED_ALPHA\n	gl_FragColor.rgb *= gl_FragColor.a;\n#endif", project_vertex: "vec4 mvPosition = vec4( transformed, 1.0 );\n#ifdef USE_BATCHING\n	mvPosition = batchingMatrix * mvPosition;\n#endif\n#ifdef USE_INSTANCING\n	mvPosition = instanceMatrix * mvPosition;\n#endif\nmvPosition = modelViewMatrix * mvPosition;\ngl_Position = projectionMatrix * mvPosition;", dithering_fragment: "#ifdef DITHERING\n	gl_FragColor.rgb = dithering( gl_FragColor.rgb );\n#endif", dithering_pars_fragment: "#ifdef DITHERING\n	vec3 dithering( vec3 color ) {\n		float grid_position = rand( gl_FragCoord.xy );\n		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );\n		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );\n		return color + dither_shift_RGB;\n	}\n#endif", roughnessmap_fragment: "float roughnessFactor = roughness;\n#ifdef USE_ROUGHNESSMAP\n	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );\n	roughnessFactor *= texelRoughness.g;\n#endif", roughnessmap_pars_fragment: "#ifdef USE_ROUGHNESSMAP\n	uniform sampler2D roughnessMap;\n#endif", shadowmap_pars_fragment: "#if NUM_SPOT_LIGHT_COORDS > 0\n	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n#endif\n#if NUM_SPOT_LIGHT_MAPS > 0\n	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];\n#endif\n#ifdef USE_SHADOWMAP\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n		struct DirectionalLightShadow {\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];\n		struct SpotLightShadow {\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n		struct PointLightShadow {\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n			float shadowCameraNear;\n			float shadowCameraFar;\n		};\n		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n	#endif\n	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n	}\n	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {\n		return unpackRGBATo2Half( texture2D( shadow, uv ) );\n	}\n	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){\n		float occlusion = 1.0;\n		vec2 distribution = texture2DDistribution( shadow, uv );\n		float hard_shadow = step( compare , distribution.x );\n		if (hard_shadow != 1.0 ) {\n			float distance = compare - distribution.x ;\n			float variance = max( 0.00000, distribution.y * distribution.y );\n			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );\n		}\n		return occlusion;\n	}\n	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n		float shadow = 1.0;\n		shadowCoord.xyz /= shadowCoord.w;\n		shadowCoord.z += shadowBias;\n		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n		if ( frustumTest ) {\n		#if defined( SHADOWMAP_TYPE_PCF )\n			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n			float dx0 = - texelSize.x * shadowRadius;\n			float dy0 = - texelSize.y * shadowRadius;\n			float dx1 = + texelSize.x * shadowRadius;\n			float dy1 = + texelSize.y * shadowRadius;\n			float dx2 = dx0 / 2.0;\n			float dy2 = dy0 / 2.0;\n			float dx3 = dx1 / 2.0;\n			float dy3 = dy1 / 2.0;\n			shadow = (\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n			) * ( 1.0 / 17.0 );\n		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n			float dx = texelSize.x;\n			float dy = texelSize.y;\n			vec2 uv = shadowCoord.xy;\n			vec2 f = fract( uv * shadowMapSize + 0.5 );\n			uv -= f * texelSize;\n			shadow = (\n				texture2DCompare( shadowMap, uv, shadowCoord.z ) +\n				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +\n				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +\n				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),\n					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),\n					 f.x ) +\n				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),\n					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),\n					 f.x ) +\n				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),\n					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),\n					 f.y ) +\n				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),\n					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),\n					 f.y ) +\n				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),\n						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),\n						  f.x ),\n					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),\n						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),\n						  f.x ),\n					 f.y )\n			) * ( 1.0 / 9.0 );\n		#elif defined( SHADOWMAP_TYPE_VSM )\n			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );\n		#else\n			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );\n		#endif\n		}\n		return shadow;\n	}\n	vec2 cubeToUV( vec3 v, float texelSizeY ) {\n		vec3 absV = abs( v );\n		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );\n		absV *= scaleToCube;\n		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );\n		vec2 planar = v.xy;\n		float almostATexel = 1.5 * texelSizeY;\n		float almostOne = 1.0 - almostATexel;\n		if ( absV.z >= almostOne ) {\n			if ( v.z > 0.0 )\n				planar.x = 4.0 - v.x;\n		} else if ( absV.x >= almostOne ) {\n			float signX = sign( v.x );\n			planar.x = v.z * signX + 2.0 * signX;\n		} else if ( absV.y >= almostOne ) {\n			float signY = sign( v.y );\n			planar.x = v.x + 2.0 * signY + 2.0;\n			planar.y = v.z * signY - 2.0;\n		}\n		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );\n	}\n	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );\n		vec3 lightToPosition = shadowCoord.xyz;\n		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;\n		vec3 bd3D = normalize( lightToPosition );\n		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )\n			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;\n			return (\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +\n				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )\n			) * ( 1.0 / 9.0 );\n		#else\n			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );\n		#endif\n	}\n#endif", shadowmap_pars_vertex: "#if NUM_SPOT_LIGHT_COORDS > 0\n	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];\n	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n#endif\n#ifdef USE_SHADOWMAP\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n		struct DirectionalLightShadow {\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n		struct SpotLightShadow {\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n		struct PointLightShadow {\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n			float shadowCameraNear;\n			float shadowCameraFar;\n		};\n		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n	#endif\n#endif", shadowmap_vertex: "#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )\n	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n	vec4 shadowWorldPosition;\n#endif\n#if defined( USE_SHADOWMAP )\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );\n			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;\n		}\n		#pragma unroll_loop_end\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );\n			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;\n		}\n		#pragma unroll_loop_end\n	#endif\n#endif\n#if NUM_SPOT_LIGHT_COORDS > 0\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {\n		shadowWorldPosition = worldPosition;\n		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;\n		#endif\n		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;\n	}\n	#pragma unroll_loop_end\n#endif", shadowmask_pars_fragment: "float getShadowMask() {\n	float shadow = 1.0;\n	#ifdef USE_SHADOWMAP\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n	DirectionalLightShadow directionalLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n		directionalLight = directionalLightShadows[ i ];\n		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n	SpotLightShadow spotLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {\n		spotLight = spotLightShadows[ i ];\n		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n	PointLightShadow pointLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n		pointLight = pointLightShadows[ i ];\n		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#endif\n	return shadow;\n}", skinbase_vertex: "#ifdef USE_SKINNING\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n#endif", skinning_pars_vertex: "#ifdef USE_SKINNING\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n	uniform highp sampler2D boneTexture;\n	mat4 getBoneMatrix( const in float i ) {\n		int size = textureSize( boneTexture, 0 ).x;\n		int j = int( i ) * 4;\n		int x = j % size;\n		int y = j / size;\n		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );\n		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );\n		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );\n		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );\n		return mat4( v1, v2, v3, v4 );\n	}\n#endif", skinning_vertex: "#ifdef USE_SKINNING\n	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	transformed = ( bindMatrixInverse * skinned ).xyz;\n#endif", skinnormal_vertex: "#ifdef USE_SKINNING\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;\n	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n	#ifdef USE_TANGENT\n		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;\n	#endif\n#endif", specularmap_fragment: "float specularStrength;\n#ifdef USE_SPECULARMAP\n	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );\n	specularStrength = texelSpecular.r;\n#else\n	specularStrength = 1.0;\n#endif", specularmap_pars_fragment: "#ifdef USE_SPECULARMAP\n	uniform sampler2D specularMap;\n#endif", tonemapping_fragment: "#if defined( TONE_MAPPING )\n	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n#endif", tonemapping_pars_fragment: "#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\nuniform float toneMappingExposure;\nvec3 LinearToneMapping( vec3 color ) {\n	return saturate( toneMappingExposure * color );\n}\nvec3 ReinhardToneMapping( vec3 color ) {\n	color *= toneMappingExposure;\n	return saturate( color / ( vec3( 1.0 ) + color ) );\n}\nvec3 OptimizedCineonToneMapping( vec3 color ) {\n	color *= toneMappingExposure;\n	color = max( vec3( 0.0 ), color - 0.004 );\n	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );\n}\nvec3 RRTAndODTFit( vec3 v ) {\n	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;\n	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;\n	return a / b;\n}\nvec3 ACESFilmicToneMapping( vec3 color ) {\n	const mat3 ACESInputMat = mat3(\n		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),\n		vec3( 0.04823, 0.01566, 0.83777 )\n	);\n	const mat3 ACESOutputMat = mat3(\n		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),\n		vec3( -0.07367, -0.00605,  1.07602 )\n	);\n	color *= toneMappingExposure / 0.6;\n	color = ACESInputMat * color;\n	color = RRTAndODTFit( color );\n	color = ACESOutputMat * color;\n	return saturate( color );\n}\nconst mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(\n	vec3( 1.6605, - 0.1246, - 0.0182 ),\n	vec3( - 0.5876, 1.1329, - 0.1006 ),\n	vec3( - 0.0728, - 0.0083, 1.1187 )\n);\nconst mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(\n	vec3( 0.6274, 0.0691, 0.0164 ),\n	vec3( 0.3293, 0.9195, 0.0880 ),\n	vec3( 0.0433, 0.0113, 0.8956 )\n);\nvec3 agxDefaultContrastApprox( vec3 x ) {\n	vec3 x2 = x * x;\n	vec3 x4 = x2 * x2;\n	return + 15.5 * x4 * x2\n		- 40.14 * x4 * x\n		+ 31.96 * x4\n		- 6.868 * x2 * x\n		+ 0.4298 * x2\n		+ 0.1191 * x\n		- 0.00232;\n}\nvec3 AgXToneMapping( vec3 color ) {\n	const mat3 AgXInsetMatrix = mat3(\n		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),\n		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),\n		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )\n	);\n	const mat3 AgXOutsetMatrix = mat3(\n		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),\n		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),\n		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )\n	);\n	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;\n	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;\n	color *= toneMappingExposure;\n	color = AgXInsetMatrix * color;\n	color = max( color, 1e-10 );	color = log2( color );\n	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );\n	color = clamp( color, 0.0, 1.0 );\n	color = agxDefaultContrastApprox( color );\n	color = AgXOutsetMatrix * color;\n	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );\n	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;\n	return color;\n}\nvec3 CustomToneMapping( vec3 color ) { return color; }", transmission_fragment: "#ifdef USE_TRANSMISSION\n	material.transmission = transmission;\n	material.transmissionAlpha = 1.0;\n	material.thickness = thickness;\n	material.attenuationDistance = attenuationDistance;\n	material.attenuationColor = attenuationColor;\n	#ifdef USE_TRANSMISSIONMAP\n		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;\n	#endif\n	#ifdef USE_THICKNESSMAP\n		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;\n	#endif\n	vec3 pos = vWorldPosition;\n	vec3 v = normalize( cameraPosition - pos );\n	vec3 n = inverseTransformDirection( normal, viewMatrix );\n	vec4 transmitted = getIBLVolumeRefraction(\n		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,\n		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,\n		material.attenuationColor, material.attenuationDistance );\n	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );\n	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );\n#endif", transmission_pars_fragment: "#ifdef USE_TRANSMISSION\n	uniform float transmission;\n	uniform float thickness;\n	uniform float attenuationDistance;\n	uniform vec3 attenuationColor;\n	#ifdef USE_TRANSMISSIONMAP\n		uniform sampler2D transmissionMap;\n	#endif\n	#ifdef USE_THICKNESSMAP\n		uniform sampler2D thicknessMap;\n	#endif\n	uniform vec2 transmissionSamplerSize;\n	uniform sampler2D transmissionSamplerMap;\n	uniform mat4 modelMatrix;\n	uniform mat4 projectionMatrix;\n	varying vec3 vWorldPosition;\n	float w0( float a ) {\n		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );\n	}\n	float w1( float a ) {\n		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );\n	}\n	float w2( float a ){\n		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );\n	}\n	float w3( float a ) {\n		return ( 1.0 / 6.0 ) * ( a * a * a );\n	}\n	float g0( float a ) {\n		return w0( a ) + w1( a );\n	}\n	float g1( float a ) {\n		return w2( a ) + w3( a );\n	}\n	float h0( float a ) {\n		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );\n	}\n	float h1( float a ) {\n		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );\n	}\n	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {\n		uv = uv * texelSize.zw + 0.5;\n		vec2 iuv = floor( uv );\n		vec2 fuv = fract( uv );\n		float g0x = g0( fuv.x );\n		float g1x = g1( fuv.x );\n		float h0x = h0( fuv.x );\n		float h1x = h1( fuv.x );\n		float h0y = h0( fuv.y );\n		float h1y = h1( fuv.y );\n		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +\n			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );\n	}\n	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {\n		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );\n		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );\n		vec2 fLodSizeInv = 1.0 / fLodSize;\n		vec2 cLodSizeInv = 1.0 / cLodSize;\n		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );\n		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );\n		return mix( fSample, cSample, fract( lod ) );\n	}\n	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {\n		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );\n		vec3 modelScale;\n		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );\n		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );\n		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );\n		return normalize( refractionVector ) * thickness * modelScale;\n	}\n	float applyIorToRoughness( const in float roughness, const in float ior ) {\n		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );\n	}\n	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {\n		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );\n		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );\n	}\n	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {\n		if ( isinf( attenuationDistance ) ) {\n			return vec3( 1.0 );\n		} else {\n			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;\n			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;\n		}\n	}\n	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,\n		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,\n		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,\n		const in vec3 attenuationColor, const in float attenuationDistance ) {\n		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );\n		vec3 refractedRayExit = position + transmissionRay;\n		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n		vec2 refractionCoords = ndcPos.xy / ndcPos.w;\n		refractionCoords += 1.0;\n		refractionCoords /= 2.0;\n		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );\n		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );\n		vec3 attenuatedColor = transmittance * transmittedLight.rgb;\n		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );\n		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;\n		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );\n	}\n#endif", uv_pars_fragment: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	varying vec2 vUv;\n#endif\n#ifdef USE_MAP\n	varying vec2 vMapUv;\n#endif\n#ifdef USE_ALPHAMAP\n	varying vec2 vAlphaMapUv;\n#endif\n#ifdef USE_LIGHTMAP\n	varying vec2 vLightMapUv;\n#endif\n#ifdef USE_AOMAP\n	varying vec2 vAoMapUv;\n#endif\n#ifdef USE_BUMPMAP\n	varying vec2 vBumpMapUv;\n#endif\n#ifdef USE_NORMALMAP\n	varying vec2 vNormalMapUv;\n#endif\n#ifdef USE_EMISSIVEMAP\n	varying vec2 vEmissiveMapUv;\n#endif\n#ifdef USE_METALNESSMAP\n	varying vec2 vMetalnessMapUv;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	varying vec2 vRoughnessMapUv;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	varying vec2 vAnisotropyMapUv;\n#endif\n#ifdef USE_CLEARCOATMAP\n	varying vec2 vClearcoatMapUv;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	varying vec2 vClearcoatNormalMapUv;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	varying vec2 vClearcoatRoughnessMapUv;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	varying vec2 vIridescenceMapUv;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	varying vec2 vIridescenceThicknessMapUv;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	varying vec2 vSheenColorMapUv;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	varying vec2 vSheenRoughnessMapUv;\n#endif\n#ifdef USE_SPECULARMAP\n	varying vec2 vSpecularMapUv;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	varying vec2 vSpecularColorMapUv;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	varying vec2 vSpecularIntensityMapUv;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	uniform mat3 transmissionMapTransform;\n	varying vec2 vTransmissionMapUv;\n#endif\n#ifdef USE_THICKNESSMAP\n	uniform mat3 thicknessMapTransform;\n	varying vec2 vThicknessMapUv;\n#endif", uv_pars_vertex: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	varying vec2 vUv;\n#endif\n#ifdef USE_MAP\n	uniform mat3 mapTransform;\n	varying vec2 vMapUv;\n#endif\n#ifdef USE_ALPHAMAP\n	uniform mat3 alphaMapTransform;\n	varying vec2 vAlphaMapUv;\n#endif\n#ifdef USE_LIGHTMAP\n	uniform mat3 lightMapTransform;\n	varying vec2 vLightMapUv;\n#endif\n#ifdef USE_AOMAP\n	uniform mat3 aoMapTransform;\n	varying vec2 vAoMapUv;\n#endif\n#ifdef USE_BUMPMAP\n	uniform mat3 bumpMapTransform;\n	varying vec2 vBumpMapUv;\n#endif\n#ifdef USE_NORMALMAP\n	uniform mat3 normalMapTransform;\n	varying vec2 vNormalMapUv;\n#endif\n#ifdef USE_DISPLACEMENTMAP\n	uniform mat3 displacementMapTransform;\n	varying vec2 vDisplacementMapUv;\n#endif\n#ifdef USE_EMISSIVEMAP\n	uniform mat3 emissiveMapTransform;\n	varying vec2 vEmissiveMapUv;\n#endif\n#ifdef USE_METALNESSMAP\n	uniform mat3 metalnessMapTransform;\n	varying vec2 vMetalnessMapUv;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	uniform mat3 roughnessMapTransform;\n	varying vec2 vRoughnessMapUv;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	uniform mat3 anisotropyMapTransform;\n	varying vec2 vAnisotropyMapUv;\n#endif\n#ifdef USE_CLEARCOATMAP\n	uniform mat3 clearcoatMapTransform;\n	varying vec2 vClearcoatMapUv;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	uniform mat3 clearcoatNormalMapTransform;\n	varying vec2 vClearcoatNormalMapUv;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	uniform mat3 clearcoatRoughnessMapTransform;\n	varying vec2 vClearcoatRoughnessMapUv;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	uniform mat3 sheenColorMapTransform;\n	varying vec2 vSheenColorMapUv;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	uniform mat3 sheenRoughnessMapTransform;\n	varying vec2 vSheenRoughnessMapUv;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	uniform mat3 iridescenceMapTransform;\n	varying vec2 vIridescenceMapUv;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	uniform mat3 iridescenceThicknessMapTransform;\n	varying vec2 vIridescenceThicknessMapUv;\n#endif\n#ifdef USE_SPECULARMAP\n	uniform mat3 specularMapTransform;\n	varying vec2 vSpecularMapUv;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	uniform mat3 specularColorMapTransform;\n	varying vec2 vSpecularColorMapUv;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	uniform mat3 specularIntensityMapTransform;\n	varying vec2 vSpecularIntensityMapUv;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	uniform mat3 transmissionMapTransform;\n	varying vec2 vTransmissionMapUv;\n#endif\n#ifdef USE_THICKNESSMAP\n	uniform mat3 thicknessMapTransform;\n	varying vec2 vThicknessMapUv;\n#endif", uv_vertex: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	vUv = vec3( uv, 1 ).xy;\n#endif\n#ifdef USE_MAP\n	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ALPHAMAP\n	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_LIGHTMAP\n	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_AOMAP\n	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_BUMPMAP\n	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_NORMALMAP\n	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_DISPLACEMENTMAP\n	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_EMISSIVEMAP\n	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_METALNESSMAP\n	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOATMAP\n	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULARMAP\n	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_THICKNESSMAP\n	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;\n#endif", worldpos_vertex: "#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0\n	vec4 worldPosition = vec4( transformed, 1.0 );\n	#ifdef USE_BATCHING\n		worldPosition = batchingMatrix * worldPosition;\n	#endif\n	#ifdef USE_INSTANCING\n		worldPosition = instanceMatrix * worldPosition;\n	#endif\n	worldPosition = modelMatrix * worldPosition;\n#endif", background_vert: "varying vec2 vUv;\nuniform mat3 uvTransform;\nvoid main() {\n	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n	gl_Position = vec4( position.xy, 1.0, 1.0 );\n}", background_frag: "uniform sampler2D t2D;\nuniform float backgroundIntensity;\nvarying vec2 vUv;\nvoid main() {\n	vec4 texColor = texture2D( t2D, vUv );\n	#ifdef DECODE_VIDEO_TEXTURE\n		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );\n	#endif\n	texColor.rgb *= backgroundIntensity;\n	gl_FragColor = texColor;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}", backgroundCube_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	gl_Position.z = gl_Position.w;\n}", backgroundCube_frag: "#ifdef ENVMAP_TYPE_CUBE\n	uniform samplerCube envMap;\n#elif defined( ENVMAP_TYPE_CUBE_UV )\n	uniform sampler2D envMap;\n#endif\nuniform float flipEnvMap;\nuniform float backgroundBlurriness;\nuniform float backgroundIntensity;\nvarying vec3 vWorldDirection;\n#include <cube_uv_reflection_fragment>\nvoid main() {\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );\n	#elif defined( ENVMAP_TYPE_CUBE_UV )\n		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );\n	#else\n		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n	#endif\n	texColor.rgb *= backgroundIntensity;\n	gl_FragColor = texColor;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}", cube_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	gl_Position.z = gl_Position.w;\n}", cube_frag: "uniform samplerCube tCube;\nuniform float tFlip;\nuniform float opacity;\nvarying vec3 vWorldDirection;\nvoid main() {\n	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );\n	gl_FragColor = texColor;\n	gl_FragColor.a *= opacity;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}", depth_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <skinbase_vertex>\n	#ifdef USE_DISPLACEMENTMAP\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vHighPrecisionZW = gl_Position.zw;\n}", depth_frag: "#if DEPTH_PACKING == 3200\n	uniform float opacity;\n#endif\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( 1.0 );\n	#if DEPTH_PACKING == 3200\n		diffuseColor.a = opacity;\n	#endif\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <logdepthbuf_fragment>\n	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;\n	#if DEPTH_PACKING == 3200\n		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );\n	#elif DEPTH_PACKING == 3201\n		gl_FragColor = packDepthToRGBA( fragCoordZ );\n	#endif\n}", distanceRGBA_vert: "#define DISTANCE\nvarying vec3 vWorldPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <skinbase_vertex>\n	#ifdef USE_DISPLACEMENTMAP\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <worldpos_vertex>\n	#include <clipping_planes_vertex>\n	vWorldPosition = worldPosition.xyz;\n}", distanceRGBA_frag: "#define DISTANCE\nuniform vec3 referencePosition;\nuniform float nearDistance;\nuniform float farDistance;\nvarying vec3 vWorldPosition;\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main () {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( 1.0 );\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	float dist = length( vWorldPosition - referencePosition );\n	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );\n	dist = saturate( dist );\n	gl_FragColor = packDepthToRGBA( dist );\n}", equirect_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n}", equirect_frag: "uniform sampler2D tEquirect;\nvarying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vec3 direction = normalize( vWorldDirection );\n	vec2 sampleUV = equirectUv( direction );\n	gl_FragColor = texture2D( tEquirect, sampleUV );\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}", linedashed_vert: "uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;\n#include <common>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	vLineDistance = scale * lineDistance;\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphcolor_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n}", linedashed_frag: "uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	if ( mod( vLineDistance, totalSize ) > dashSize ) {\n		discard;\n	}\n	vec3 outgoingLight = vec3( 0.0 );\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}", meshbasic_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinbase_vertex>\n		#include <skinnormal_vertex>\n		#include <defaultnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <fog_vertex>\n}", meshbasic_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	#ifdef USE_LIGHTMAP\n		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;\n	#else\n		reflectedLight.indirectDiffuse += vec3( 1.0 );\n	#endif\n	#include <aomap_fragment>\n	reflectedLight.indirectDiffuse *= diffuseColor.rgb;\n	vec3 outgoingLight = reflectedLight.indirectDiffuse;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}", meshlambert_vert: "#define LAMBERT\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}", meshlambert_frag: "#define LAMBERT\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_lambert_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_lambert_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}", meshmatcap_vert: "#define MATCAP\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n	vViewPosition = - mvPosition.xyz;\n}", meshmatcap_frag: "#define MATCAP\nuniform vec3 diffuse;\nuniform float opacity;\nuniform sampler2D matcap;\nvarying vec3 vViewPosition;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	vec3 viewDir = normalize( vViewPosition );\n	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );\n	vec3 y = cross( viewDir, x );\n	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;\n	#ifdef USE_MATCAP\n		vec4 matcapColor = texture2D( matcap, uv );\n	#else\n		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );\n	#endif\n	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}", meshnormal_vert: "#define NORMAL\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	varying vec3 vViewPosition;\n#endif\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	vViewPosition = - mvPosition.xyz;\n#endif\n}", meshnormal_frag: "#define NORMAL\nuniform float opacity;\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	varying vec3 vViewPosition;\n#endif\n#include <packing>\n#include <uv_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );\n	#ifdef OPAQUE\n		gl_FragColor.a = 1.0;\n	#endif\n}", meshphong_vert: "#define PHONG\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}", meshphong_frag: "#define PHONG\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_phong_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}", meshphysical_vert: "#define STANDARD\nvarying vec3 vViewPosition;\n#ifdef USE_TRANSMISSION\n	varying vec3 vWorldPosition;\n#endif\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n#ifdef USE_TRANSMISSION\n	vWorldPosition = worldPosition.xyz;\n#endif\n}", meshphysical_frag: "#define STANDARD\n#ifdef PHYSICAL\n	#define IOR\n	#define USE_SPECULAR\n#endif\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\n#ifdef IOR\n	uniform float ior;\n#endif\n#ifdef USE_SPECULAR\n	uniform float specularIntensity;\n	uniform vec3 specularColor;\n	#ifdef USE_SPECULAR_COLORMAP\n		uniform sampler2D specularColorMap;\n	#endif\n	#ifdef USE_SPECULAR_INTENSITYMAP\n		uniform sampler2D specularIntensityMap;\n	#endif\n#endif\n#ifdef USE_CLEARCOAT\n	uniform float clearcoat;\n	uniform float clearcoatRoughness;\n#endif\n#ifdef USE_IRIDESCENCE\n	uniform float iridescence;\n	uniform float iridescenceIOR;\n	uniform float iridescenceThicknessMinimum;\n	uniform float iridescenceThicknessMaximum;\n#endif\n#ifdef USE_SHEEN\n	uniform vec3 sheenColor;\n	uniform float sheenRoughness;\n	#ifdef USE_SHEEN_COLORMAP\n		uniform sampler2D sheenColorMap;\n	#endif\n	#ifdef USE_SHEEN_ROUGHNESSMAP\n		uniform sampler2D sheenRoughnessMap;\n	#endif\n#endif\n#ifdef USE_ANISOTROPY\n	uniform vec2 anisotropyVector;\n	#ifdef USE_ANISOTROPYMAP\n		uniform sampler2D anisotropyMap;\n	#endif\n#endif\nvarying vec3 vViewPosition;\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <iridescence_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_physical_pars_fragment>\n#include <transmission_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <clearcoat_pars_fragment>\n#include <iridescence_pars_fragment>\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <roughnessmap_fragment>\n	#include <metalnessmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <clearcoat_normal_fragment_begin>\n	#include <clearcoat_normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_physical_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;\n	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;\n	#include <transmission_fragment>\n	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;\n	#ifdef USE_SHEEN\n		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );\n		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;\n	#endif\n	#ifdef USE_CLEARCOAT\n		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );\n		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );\n		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;\n	#endif\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}", meshtoon_vert: "#define TOON\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}", meshtoon_frag: "#define TOON\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <gradientmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_toon_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_toon_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}", points_vert: "uniform float size;\nuniform float scale;\n#include <common>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n#ifdef USE_POINTS_UV\n	varying vec2 vUv;\n	uniform mat3 uvTransform;\n#endif\nvoid main() {\n	#ifdef USE_POINTS_UV\n		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n	#endif\n	#include <color_vertex>\n	#include <morphcolor_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <project_vertex>\n	gl_PointSize = size;\n	#ifdef USE_SIZEATTENUATION\n		bool isPerspective = isPerspectiveMatrix( projectionMatrix );\n		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );\n	#endif\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <fog_vertex>\n}", points_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <color_pars_fragment>\n#include <map_particle_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec3 outgoingLight = vec3( 0.0 );\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <logdepthbuf_fragment>\n	#include <map_particle_fragment>\n	#include <color_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}", shadow_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <shadowmap_pars_vertex>\nvoid main() {\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}", shadow_frag: "uniform vec3 color;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <logdepthbuf_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\nvoid main() {\n	#include <logdepthbuf_fragment>\n	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n}", sprite_vert: "uniform float rotation;\nuniform vec2 center;\n#include <common>\n#include <uv_pars_vertex>\n#include <fog_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\n	vec2 scale;\n	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );\n	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );\n	#ifndef USE_SIZEATTENUATION\n		bool isPerspective = isPerspectiveMatrix( projectionMatrix );\n		if ( isPerspective ) scale *= - mvPosition.z;\n	#endif\n	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;\n	vec2 rotatedPosition;\n	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\n	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\n	mvPosition.xy += rotatedPosition;\n	gl_Position = projectionMatrix * mvPosition;\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n}", sprite_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	#include <clipping_planes_fragment>\n	vec3 outgoingLight = vec3( 0.0 );\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n}" };
  var le = { common: { diffuse: { value: new x(16777215) }, opacity: { value: 1 }, map: { value: null }, mapTransform: { value: new Ae() }, alphaMap: { value: null }, alphaMapTransform: { value: new Ae() }, alphaTest: { value: 0 } }, specularmap: { specularMap: { value: null }, specularMapTransform: { value: new Ae() } }, envmap: { envMap: { value: null }, flipEnvMap: { value: -1 }, reflectivity: { value: 1 }, ior: { value: 1.5 }, refractionRatio: { value: 0.98 } }, aomap: { aoMap: { value: null }, aoMapIntensity: { value: 1 }, aoMapTransform: { value: new Ae() } }, lightmap: { lightMap: { value: null }, lightMapIntensity: { value: 1 }, lightMapTransform: { value: new Ae() } }, bumpmap: { bumpMap: { value: null }, bumpMapTransform: { value: new Ae() }, bumpScale: { value: 1 } }, normalmap: { normalMap: { value: null }, normalMapTransform: { value: new Ae() }, normalScale: { value: new X(1, 1) } }, displacementmap: { displacementMap: { value: null }, displacementMapTransform: { value: new Ae() }, displacementScale: { value: 1 }, displacementBias: { value: 0 } }, emissivemap: { emissiveMap: { value: null }, emissiveMapTransform: { value: new Ae() } }, metalnessmap: { metalnessMap: { value: null }, metalnessMapTransform: { value: new Ae() } }, roughnessmap: { roughnessMap: { value: null }, roughnessMapTransform: { value: new Ae() } }, gradientmap: { gradientMap: { value: null } }, fog: { fogDensity: { value: 25e-5 }, fogNear: { value: 1 }, fogFar: { value: 2e3 }, fogColor: { value: new x(16777215) } }, lights: { ambientLightColor: { value: [] }, lightProbe: { value: [] }, directionalLights: { value: [], properties: { direction: {}, color: {} } }, directionalLightShadows: { value: [], properties: { shadowBias: {}, shadowNormalBias: {}, shadowRadius: {}, shadowMapSize: {} } }, directionalShadowMap: { value: [] }, directionalShadowMatrix: { value: [] }, spotLights: { value: [], properties: { color: {}, position: {}, direction: {}, distance: {}, coneCos: {}, penumbraCos: {}, decay: {} } }, spotLightShadows: { value: [], properties: { shadowBias: {}, shadowNormalBias: {}, shadowRadius: {}, shadowMapSize: {} } }, spotLightMap: { value: [] }, spotShadowMap: { value: [] }, spotLightMatrix: { value: [] }, pointLights: { value: [], properties: { color: {}, position: {}, decay: {}, distance: {} } }, pointLightShadows: { value: [], properties: { shadowBias: {}, shadowNormalBias: {}, shadowRadius: {}, shadowMapSize: {}, shadowCameraNear: {}, shadowCameraFar: {} } }, pointShadowMap: { value: [] }, pointShadowMatrix: { value: [] }, hemisphereLights: { value: [], properties: { direction: {}, skyColor: {}, groundColor: {} } }, rectAreaLights: { value: [], properties: { color: {}, position: {}, width: {}, height: {} } }, ltc_1: { value: null }, ltc_2: { value: null } }, points: { diffuse: { value: new x(16777215) }, opacity: { value: 1 }, size: { value: 1 }, scale: { value: 1 }, map: { value: null }, alphaMap: { value: null }, alphaMapTransform: { value: new Ae() }, alphaTest: { value: 0 }, uvTransform: { value: new Ae() } }, sprite: { diffuse: { value: new x(16777215) }, opacity: { value: 1 }, center: { value: new X(0.5, 0.5) }, rotation: { value: 0 }, map: { value: null }, mapTransform: { value: new Ae() }, alphaMap: { value: null }, alphaMapTransform: { value: new Ae() }, alphaTest: { value: 0 } } };
  var Xt = { basic: { uniforms: dt([le.common, le.specularmap, le.envmap, le.aomap, le.lightmap, le.fog]), vertexShader: Se.meshbasic_vert, fragmentShader: Se.meshbasic_frag }, lambert: { uniforms: dt([le.common, le.specularmap, le.envmap, le.aomap, le.lightmap, le.emissivemap, le.bumpmap, le.normalmap, le.displacementmap, le.fog, le.lights, { emissive: { value: new x(0) } }]), vertexShader: Se.meshlambert_vert, fragmentShader: Se.meshlambert_frag }, phong: { uniforms: dt([le.common, le.specularmap, le.envmap, le.aomap, le.lightmap, le.emissivemap, le.bumpmap, le.normalmap, le.displacementmap, le.fog, le.lights, { emissive: { value: new x(0) }, specular: { value: new x(1118481) }, shininess: { value: 30 } }]), vertexShader: Se.meshphong_vert, fragmentShader: Se.meshphong_frag }, standard: { uniforms: dt([le.common, le.envmap, le.aomap, le.lightmap, le.emissivemap, le.bumpmap, le.normalmap, le.displacementmap, le.roughnessmap, le.metalnessmap, le.fog, le.lights, { emissive: { value: new x(0) }, roughness: { value: 1 }, metalness: { value: 0 }, envMapIntensity: { value: 1 } }]), vertexShader: Se.meshphysical_vert, fragmentShader: Se.meshphysical_frag }, toon: { uniforms: dt([le.common, le.aomap, le.lightmap, le.emissivemap, le.bumpmap, le.normalmap, le.displacementmap, le.gradientmap, le.fog, le.lights, { emissive: { value: new x(0) } }]), vertexShader: Se.meshtoon_vert, fragmentShader: Se.meshtoon_frag }, matcap: { uniforms: dt([le.common, le.bumpmap, le.normalmap, le.displacementmap, le.fog, { matcap: { value: null } }]), vertexShader: Se.meshmatcap_vert, fragmentShader: Se.meshmatcap_frag }, points: { uniforms: dt([le.points, le.fog]), vertexShader: Se.points_vert, fragmentShader: Se.points_frag }, dashed: { uniforms: dt([le.common, le.fog, { scale: { value: 1 }, dashSize: { value: 1 }, totalSize: { value: 2 } }]), vertexShader: Se.linedashed_vert, fragmentShader: Se.linedashed_frag }, depth: { uniforms: dt([le.common, le.displacementmap]), vertexShader: Se.depth_vert, fragmentShader: Se.depth_frag }, normal: { uniforms: dt([le.common, le.bumpmap, le.normalmap, le.displacementmap, { opacity: { value: 1 } }]), vertexShader: Se.meshnormal_vert, fragmentShader: Se.meshnormal_frag }, sprite: { uniforms: dt([le.sprite, le.fog]), vertexShader: Se.sprite_vert, fragmentShader: Se.sprite_frag }, background: { uniforms: { uvTransform: { value: new Ae() }, t2D: { value: null }, backgroundIntensity: { value: 1 } }, vertexShader: Se.background_vert, fragmentShader: Se.background_frag }, backgroundCube: { uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 }, backgroundBlurriness: { value: 0 }, backgroundIntensity: { value: 1 } }, vertexShader: Se.backgroundCube_vert, fragmentShader: Se.backgroundCube_frag }, cube: { uniforms: { tCube: { value: null }, tFlip: { value: -1 }, opacity: { value: 1 } }, vertexShader: Se.cube_vert, fragmentShader: Se.cube_frag }, equirect: { uniforms: { tEquirect: { value: null } }, vertexShader: Se.equirect_vert, fragmentShader: Se.equirect_frag }, distanceRGBA: { uniforms: dt([le.common, le.displacementmap, { referencePosition: { value: new E() }, nearDistance: { value: 1 }, farDistance: { value: 1e3 } }]), vertexShader: Se.distanceRGBA_vert, fragmentShader: Se.distanceRGBA_frag }, shadow: { uniforms: dt([le.lights, le.fog, { color: { value: new x(0) }, opacity: { value: 1 } }]), vertexShader: Se.shadow_vert, fragmentShader: Se.shadow_frag } };
  Xt.physical = { uniforms: dt([Xt.standard.uniforms, { clearcoat: { value: 0 }, clearcoatMap: { value: null }, clearcoatMapTransform: { value: new Ae() }, clearcoatNormalMap: { value: null }, clearcoatNormalMapTransform: { value: new Ae() }, clearcoatNormalScale: { value: new X(1, 1) }, clearcoatRoughness: { value: 0 }, clearcoatRoughnessMap: { value: null }, clearcoatRoughnessMapTransform: { value: new Ae() }, iridescence: { value: 0 }, iridescenceMap: { value: null }, iridescenceMapTransform: { value: new Ae() }, iridescenceIOR: { value: 1.3 }, iridescenceThicknessMinimum: { value: 100 }, iridescenceThicknessMaximum: { value: 400 }, iridescenceThicknessMap: { value: null }, iridescenceThicknessMapTransform: { value: new Ae() }, sheen: { value: 0 }, sheenColor: { value: new x(0) }, sheenColorMap: { value: null }, sheenColorMapTransform: { value: new Ae() }, sheenRoughness: { value: 1 }, sheenRoughnessMap: { value: null }, sheenRoughnessMapTransform: { value: new Ae() }, transmission: { value: 0 }, transmissionMap: { value: null }, transmissionMapTransform: { value: new Ae() }, transmissionSamplerSize: { value: new X() }, transmissionSamplerMap: { value: null }, thickness: { value: 0 }, thicknessMap: { value: null }, thicknessMapTransform: { value: new Ae() }, attenuationDistance: { value: 0 }, attenuationColor: { value: new x(0) }, specularColor: { value: new x(1, 1, 1) }, specularColorMap: { value: null }, specularColorMapTransform: { value: new Ae() }, specularIntensity: { value: 1 }, specularIntensityMap: { value: null }, specularIntensityMapTransform: { value: new Ae() }, anisotropyVector: { value: new X() }, anisotropyMap: { value: null }, anisotropyMapTransform: { value: new Ae() } }]), vertexShader: Se.meshphysical_vert, fragmentShader: Se.meshphysical_frag };
  var Xr = { r: 0, b: 0, g: 0 };
  function Uu(r, e, t, i, n, s, a) {
    const o = new x(0);
    let l, c, h = true === s ? 0 : 1, u = null, d = 0, p = null;
    function f(v, m) {
      v.getRGB(Xr, Ih(r)), i.buffers.color.setClear(Xr.r, Xr.g, Xr.b, m, a);
    }
    return { getClearColor: function() {
      return o;
    }, setClearColor: function(v, m = 1) {
      o.set(v), h = m, f(o, h);
    }, getClearAlpha: function() {
      return h;
    }, setClearAlpha: function(v) {
      h = v, f(o, h);
    }, render: function(v, m) {
      let y = false, _ = true === m.isScene ? m.background : null;
      if (_ && _.isTexture) {
        _ = (m.backgroundBlurriness > 0 ? t : e).get(_);
      }
      null === _ ? f(o, h) : _ && _.isColor && (f(_, 1), y = true);
      const g = r.xr.getEnvironmentBlendMode();
      "additive" === g ? i.buffers.color.setClear(0, 0, 0, 1, a) : "alpha-blend" === g && i.buffers.color.setClear(0, 0, 0, 0, a), (r.autoClear || y) && r.clear(r.autoClearColor, r.autoClearDepth, r.autoClearStencil), _ && (_.isCubeTexture || _.mapping === Bs) ? (void 0 === c && (c = new De(new xn(1, 1, 1), new Ee({ name: "BackgroundCubeMaterial", uniforms: Mn(Xt.backgroundCube.uniforms), vertexShader: Xt.backgroundCube.vertexShader, fragmentShader: Xt.backgroundCube.fragmentShader, side: vt, depthTest: false, depthWrite: false, fog: false })), c.geometry.deleteAttribute("normal"), c.geometry.deleteAttribute("uv"), c.onBeforeRender = function(w, R, T) {
        this.matrixWorld.copyPosition(T.matrixWorld);
      }, Object.defineProperty(c.material, "envMap", { get: function() {
        return this.uniforms.envMap.value;
      } }), n.update(c)), c.material.uniforms.envMap.value = _, c.material.uniforms.flipEnvMap.value = _.isCubeTexture && false === _.isRenderTargetTexture ? -1 : 1, c.material.uniforms.backgroundBlurriness.value = m.backgroundBlurriness, c.material.uniforms.backgroundIntensity.value = m.backgroundIntensity, c.material.toneMapped = ze.getTransfer(_.colorSpace) !== We, u === _ && d === _.version && p === r.toneMapping || (c.material.needsUpdate = true, u = _, d = _.version, p = r.toneMapping), c.layers.enableAll(), v.unshift(c, c.geometry, c.material, 0, 0, null)) : _ && _.isTexture && (void 0 === l && (l = new De(new Ze(2, 2), new Ee({ name: "BackgroundMaterial", uniforms: Mn(Xt.background.uniforms), vertexShader: Xt.background.vertexShader, fragmentShader: Xt.background.fragmentShader, side: _i, depthTest: false, depthWrite: false, fog: false })), l.geometry.deleteAttribute("normal"), Object.defineProperty(l.material, "map", { get: function() {
        return this.uniforms.t2D.value;
      } }), n.update(l)), l.material.uniforms.t2D.value = _, l.material.uniforms.backgroundIntensity.value = m.backgroundIntensity, l.material.toneMapped = ze.getTransfer(_.colorSpace) !== We, true === _.matrixAutoUpdate && _.updateMatrix(), l.material.uniforms.uvTransform.value.copy(_.matrix), u === _ && d === _.version && p === r.toneMapping || (l.material.needsUpdate = true, u = _, d = _.version, p = r.toneMapping), l.layers.enableAll(), v.unshift(l, l.geometry, l.material, 0, 0, null));
    } };
  }
  function Nu(r, e, t, i) {
    const n = r.getParameter(r.MAX_VERTEX_ATTRIBS), s = i.isWebGL2 ? null : e.get("OES_vertex_array_object"), a = i.isWebGL2 || null !== s, o = {}, l = p(null);
    let c = l, h = false;
    function u(R) {
      return i.isWebGL2 ? r.bindVertexArray(R) : s.bindVertexArrayOES(R);
    }
    function d(R) {
      return i.isWebGL2 ? r.deleteVertexArray(R) : s.deleteVertexArrayOES(R);
    }
    function p(R) {
      const T = [], A = [], N = [];
      for (let I = 0; I < n; I++) T[I] = 0, A[I] = 0, N[I] = 0;
      return { geometry: null, program: null, wireframe: false, newAttributes: T, enabledAttributes: A, attributeDivisors: N, object: R, attributes: {}, index: null };
    }
    function f() {
      const R = c.newAttributes;
      for (let T = 0, A = R.length; T < A; T++) R[T] = 0;
    }
    function v(R) {
      m(R, 0);
    }
    function m(R, T) {
      const A = c.newAttributes, N = c.enabledAttributes, I = c.attributeDivisors;
      if (A[R] = 1, 0 === N[R] && (r.enableVertexAttribArray(R), N[R] = 1), I[R] !== T) {
        (i.isWebGL2 ? r : e.get("ANGLE_instanced_arrays"))[i.isWebGL2 ? "vertexAttribDivisor" : "vertexAttribDivisorANGLE"](R, T), I[R] = T;
      }
    }
    function y() {
      const R = c.newAttributes, T = c.enabledAttributes;
      for (let A = 0, N = T.length; A < N; A++) T[A] !== R[A] && (r.disableVertexAttribArray(A), T[A] = 0);
    }
    function _(R, T, A, N, I, F, Z) {
      true === Z ? r.vertexAttribIPointer(R, T, A, I, F) : r.vertexAttribPointer(R, T, A, N, I, F);
    }
    function g() {
      w(), h = true, c !== l && (c = l, u(c.object));
    }
    function w() {
      l.geometry = null, l.program = null, l.wireframe = false;
    }
    return { setup: function(R, T, A, N, I) {
      let F = false;
      if (a) {
        const Z = (function(P, W, j) {
          const oe = true === j.wireframe;
          let de = o[P.id];
          void 0 === de && (de = {}, o[P.id] = de);
          let ne = de[W.id];
          void 0 === ne && (ne = {}, de[W.id] = ne);
          let te = ne[oe];
          void 0 === te && (te = p(i.isWebGL2 ? r.createVertexArray() : s.createVertexArrayOES()), ne[oe] = te);
          return te;
        })(N, A, T);
        c !== Z && (c = Z, u(c.object)), F = (function(P, W, j, oe) {
          const de = c.attributes, ne = W.attributes;
          let te = 0;
          const $ = j.getAttributes();
          for (const k in $) {
            if ($[k].location >= 0) {
              const G = de[k];
              let ce = ne[k];
              if (void 0 === ce && ("instanceMatrix" === k && P.instanceMatrix && (ce = P.instanceMatrix), "instanceColor" === k && P.instanceColor && (ce = P.instanceColor)), void 0 === G) return true;
              if (G.attribute !== ce) return true;
              if (ce && G.data !== ce.data) return true;
              te++;
            }
          }
          return c.attributesNum !== te || c.index !== oe;
        })(R, N, A, I), F && (function(P, W, j, oe) {
          const de = {}, ne = W.attributes;
          let te = 0;
          const $ = j.getAttributes();
          for (const k in $) {
            if ($[k].location >= 0) {
              let G = ne[k];
              void 0 === G && ("instanceMatrix" === k && P.instanceMatrix && (G = P.instanceMatrix), "instanceColor" === k && P.instanceColor && (G = P.instanceColor));
              const ce = {};
              ce.attribute = G, G && G.data && (ce.data = G.data), de[k] = ce, te++;
            }
          }
          c.attributes = de, c.attributesNum = te, c.index = oe;
        })(R, N, A, I);
      } else {
        const Z = true === T.wireframe;
        c.geometry === N.id && c.program === A.id && c.wireframe === Z || (c.geometry = N.id, c.program = A.id, c.wireframe = Z, F = true);
      }
      null !== I && t.update(I, r.ELEMENT_ARRAY_BUFFER), (F || h) && (h = false, (function(Z, P, W, j) {
        if (false === i.isWebGL2 && (Z.isInstancedMesh || j.isInstancedBufferGeometry) && null === e.get("ANGLE_instanced_arrays")) return;
        f();
        const oe = j.attributes, de = W.getAttributes(), ne = P.defaultAttributeValues;
        for (const te in de) {
          const $ = de[te];
          if ($.location >= 0) {
            let k = oe[te];
            if (void 0 === k && ("instanceMatrix" === te && Z.instanceMatrix && (k = Z.instanceMatrix), "instanceColor" === te && Z.instanceColor && (k = Z.instanceColor)), void 0 !== k) {
              const G = k.normalized, ce = k.itemSize, S = t.get(k);
              if (void 0 === S) continue;
              const b = S.buffer, O = S.type, J = S.bytesPerElement, L = true === i.isWebGL2 && (O === r.INT || O === r.UNSIGNED_INT || k.gpuType === bh);
              if (k.isInterleavedBufferAttribute) {
                const Y = k.data, D = Y.stride, U = k.offset;
                if (Y.isInstancedInterleavedBuffer) {
                  for (let B = 0; B < $.locationSize; B++) m($.location + B, Y.meshPerAttribute);
                  true !== Z.isInstancedMesh && void 0 === j._maxInstanceCount && (j._maxInstanceCount = Y.meshPerAttribute * Y.count);
                } else for (let B = 0; B < $.locationSize; B++) v($.location + B);
                r.bindBuffer(r.ARRAY_BUFFER, b);
                for (let B = 0; B < $.locationSize; B++) _($.location + B, ce / $.locationSize, O, G, D * J, (U + ce / $.locationSize * B) * J, L);
              } else {
                if (k.isInstancedBufferAttribute) {
                  for (let Y = 0; Y < $.locationSize; Y++) m($.location + Y, k.meshPerAttribute);
                  true !== Z.isInstancedMesh && void 0 === j._maxInstanceCount && (j._maxInstanceCount = k.meshPerAttribute * k.count);
                } else for (let Y = 0; Y < $.locationSize; Y++) v($.location + Y);
                r.bindBuffer(r.ARRAY_BUFFER, b);
                for (let Y = 0; Y < $.locationSize; Y++) _($.location + Y, ce / $.locationSize, O, G, ce * J, ce / $.locationSize * Y * J, L);
              }
            } else if (void 0 !== ne) {
              const G = ne[te];
              if (void 0 !== G) switch (G.length) {
                case 2:
                  r.vertexAttrib2fv($.location, G);
                  break;
                case 3:
                  r.vertexAttrib3fv($.location, G);
                  break;
                case 4:
                  r.vertexAttrib4fv($.location, G);
                  break;
                default:
                  r.vertexAttrib1fv($.location, G);
              }
            }
          }
        }
        y();
      })(R, T, A, N), null !== I && r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, t.get(I).buffer));
    }, reset: g, resetDefaultState: w, dispose: function() {
      g();
      for (const R in o) {
        const T = o[R];
        for (const A in T) {
          const N = T[A];
          for (const I in N) d(N[I].object), delete N[I];
          delete T[A];
        }
        delete o[R];
      }
    }, releaseStatesOfGeometry: function(R) {
      if (void 0 === o[R.id]) return;
      const T = o[R.id];
      for (const A in T) {
        const N = T[A];
        for (const I in N) d(N[I].object), delete N[I];
        delete T[A];
      }
      delete o[R.id];
    }, releaseStatesOfProgram: function(R) {
      for (const T in o) {
        const A = o[T];
        if (void 0 === A[R.id]) continue;
        const N = A[R.id];
        for (const I in N) d(N[I].object), delete N[I];
        delete A[R.id];
      }
    }, initAttributes: f, enableAttribute: v, disableUnusedAttributes: y };
  }
  function Ou(r, e, t, i) {
    const n = i.isWebGL2;
    let s;
    this.setMode = function(a) {
      s = a;
    }, this.render = function(a, o) {
      r.drawArrays(s, a, o), t.update(o, s, 1);
    }, this.renderInstances = function(a, o, l) {
      if (0 === l) return;
      let c, h;
      if (n) c = r, h = "drawArraysInstanced";
      else if (c = e.get("ANGLE_instanced_arrays"), h = "drawArraysInstancedANGLE", null === c) return void console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");
      c[h](s, a, o, l), t.update(o, s, l);
    }, this.renderMultiDraw = function(a, o, l) {
      if (0 === l) return;
      const c = e.get("WEBGL_multi_draw");
      if (null === c) for (let h = 0; h < l; h++) this.render(a[h], o[h]);
      else {
        c.multiDrawArraysWEBGL(s, a, 0, o, 0, l);
        let h = 0;
        for (let u = 0; u < l; u++) h += o[u];
        t.update(h, s, 1);
      }
    };
  }
  function Fu(r, e, t) {
    let i;
    function n(w) {
      if ("highp" === w) {
        if (r.getShaderPrecisionFormat(r.VERTEX_SHADER, r.HIGH_FLOAT).precision > 0 && r.getShaderPrecisionFormat(r.FRAGMENT_SHADER, r.HIGH_FLOAT).precision > 0) return "highp";
        w = "mediump";
      }
      return "mediump" === w && r.getShaderPrecisionFormat(r.VERTEX_SHADER, r.MEDIUM_FLOAT).precision > 0 && r.getShaderPrecisionFormat(r.FRAGMENT_SHADER, r.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
    }
    const s = "undefined" != typeof WebGL2RenderingContext && "WebGL2RenderingContext" === r.constructor.name;
    let a = void 0 !== t.precision ? t.precision : "highp";
    const o = n(a);
    o !== a && (console.warn("THREE.WebGLRenderer:", a, "not supported, using", o, "instead."), a = o);
    const l = s || e.has("WEBGL_draw_buffers"), c = true === t.logarithmicDepthBuffer, h = r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS), u = r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS), d = r.getParameter(r.MAX_TEXTURE_SIZE), p = r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE), f = r.getParameter(r.MAX_VERTEX_ATTRIBS), v = r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS), m = r.getParameter(r.MAX_VARYING_VECTORS), y = r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS), _ = u > 0, g = s || e.has("OES_texture_float");
    return { isWebGL2: s, drawBuffers: l, getMaxAnisotropy: function() {
      if (void 0 !== i) return i;
      if (true === e.has("EXT_texture_filter_anisotropic")) {
        const w = e.get("EXT_texture_filter_anisotropic");
        i = r.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      } else i = 0;
      return i;
    }, getMaxPrecision: n, precision: a, logarithmicDepthBuffer: c, maxTextures: h, maxVertexTextures: u, maxTextureSize: d, maxCubemapSize: p, maxAttributes: f, maxVertexUniforms: v, maxVaryings: m, maxFragmentUniforms: y, vertexTextures: _, floatFragmentTextures: g, floatVertexTextures: _ && g, maxSamples: s ? r.getParameter(r.MAX_SAMPLES) : 0 };
  }
  function Bu(r) {
    const e = this;
    let t = null, i = 0, n = false, s = false;
    const a = new ii(), o = new Ae(), l = { value: null, needsUpdate: false };
    function c(h, u, d, p) {
      const f = null !== h ? h.length : 0;
      let v = null;
      if (0 !== f) {
        if (v = l.value, true !== p || null === v) {
          const m = d + 4 * f, y = u.matrixWorldInverse;
          o.getNormalMatrix(y), (null === v || v.length < m) && (v = new Float32Array(m));
          for (let _ = 0, g = d; _ !== f; ++_, g += 4) a.copy(h[_]).applyMatrix4(y, o), a.normal.toArray(v, g), v[g + 3] = a.constant;
        }
        l.value = v, l.needsUpdate = true;
      }
      return e.numPlanes = f, e.numIntersection = 0, v;
    }
    this.uniform = l, this.numPlanes = 0, this.numIntersection = 0, this.init = function(h, u) {
      const d = 0 !== h.length || u || 0 !== i || n;
      return n = u, i = h.length, d;
    }, this.beginShadows = function() {
      s = true, c(null);
    }, this.endShadows = function() {
      s = false;
    }, this.setGlobalState = function(h, u) {
      t = c(h, u, 0);
    }, this.setState = function(h, u, d) {
      const p = h.clippingPlanes, f = h.clipIntersection, v = h.clipShadows, m = r.get(h);
      if (!n || null === p || 0 === p.length || s && !v) s ? c(null) : (function() {
        l.value !== t && (l.value = t, l.needsUpdate = i > 0);
        e.numPlanes = i, e.numIntersection = 0;
      })();
      else {
        const y = s ? 0 : i, _ = 4 * y;
        let g = m.clippingState || null;
        l.value = g, g = c(p, u, _, d);
        for (let w = 0; w !== _; ++w) g[w] = t[w];
        m.clippingState = g, this.numIntersection = f ? this.numPlanes : 0, this.numPlanes += y;
      }
    };
  }
  function Hu(r) {
    let e = /* @__PURE__ */ new WeakMap();
    function t(n, s) {
      return s === Xa ? n.mapping = fn : s === ja && (n.mapping = gn), n;
    }
    function i(n) {
      const s = n.target;
      s.removeEventListener("dispose", i);
      const a = e.get(s);
      void 0 !== a && (e.delete(s), a.dispose());
    }
    return { get: function(n) {
      if (n && n.isTexture) {
        const s = n.mapping;
        if (s === Xa || s === ja) {
          if (e.has(n)) {
            return t(e.get(n).texture, n.mapping);
          }
          {
            const a = n.image;
            if (a && a.height > 0) {
              const o = new to(a.height / 2);
              return o.fromEquirectangularTexture(r, n), e.set(n, o), n.addEventListener("dispose", i), t(o.texture, n.mapping);
            }
            return null;
          }
        }
      }
      return n;
    }, dispose: function() {
      e = /* @__PURE__ */ new WeakMap();
    } };
  }
  var xi = class extends or {
    constructor(e = -1, t = 1, i = 1, n = -1, s = 0.1, a = 2e3) {
      super(), this.isOrthographicCamera = true, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = e, this.right = t, this.top = i, this.bottom = n, this.near = s, this.far = a, this.updateProjectionMatrix();
    }
    copy(e, t) {
      return super.copy(e, t), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.near = e.near, this.far = e.far, this.zoom = e.zoom, this.view = null === e.view ? null : Object.assign({}, e.view), this;
    }
    setViewOffset(e, t, i, n, s, a) {
      null === this.view && (this.view = { enabled: true, fullWidth: 1, fullHeight: 1, offsetX: 0, offsetY: 0, width: 1, height: 1 }), this.view.enabled = true, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = i, this.view.offsetY = n, this.view.width = s, this.view.height = a, this.updateProjectionMatrix();
    }
    clearViewOffset() {
      null !== this.view && (this.view.enabled = false), this.updateProjectionMatrix();
    }
    updateProjectionMatrix() {
      const e = (this.right - this.left) / (2 * this.zoom), t = (this.top - this.bottom) / (2 * this.zoom), i = (this.right + this.left) / 2, n = (this.top + this.bottom) / 2;
      let s = i - e, a = i + e, o = n + t, l = n - t;
      if (null !== this.view && this.view.enabled) {
        const c = (this.right - this.left) / this.view.fullWidth / this.zoom, h = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
        s += c * this.view.offsetX, a = s + c * this.view.width, o -= h * this.view.offsetY, l = o - h * this.view.height;
      }
      this.projectionMatrix.makeOrthographic(s, a, o, l, this.near, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
    }
    toJSON(e) {
      const t = super.toJSON(e);
      return t.object.zoom = this.zoom, t.object.left = this.left, t.object.right = this.right, t.object.top = this.top, t.object.bottom = this.bottom, t.object.near = this.near, t.object.far = this.far, null !== this.view && (t.object.view = Object.assign({}, this.view)), t;
    }
  };
  var Dc = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582];
  var $n = 20;
  var Ra = new xi();
  var Uc = new x();
  var Pa = null;
  var La = 0;
  var Ia = 0;
  var Di = (1 + Math.sqrt(5)) / 2;
  var cn = 1 / Di;
  var Nc = [new E(1, 1, 1), new E(-1, 1, 1), new E(1, 1, -1), new E(-1, 1, -1), new E(0, Di, cn), new E(0, Di, -cn), new E(cn, 0, Di), new E(-cn, 0, Di), new E(Di, cn, 0), new E(-Di, cn, 0)];
  var Ms = class {
    constructor(e) {
      this._renderer = e, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
    }
    fromScene(e, t = 0, i = 0.1, n = 100) {
      Pa = this._renderer.getRenderTarget(), La = this._renderer.getActiveCubeFace(), Ia = this._renderer.getActiveMipmapLevel(), this._setSize(256);
      const s = this._allocateTargets();
      return s.depthBuffer = true, this._sceneToCubeUV(e, i, n, s), t > 0 && this._blur(s, 0, 0, t), this._applyPMREM(s), this._cleanup(s), s;
    }
    fromEquirectangular(e, t = null) {
      return this._fromTexture(e, t);
    }
    fromCubemap(e, t = null) {
      return this._fromTexture(e, t);
    }
    compileCubemapShader() {
      null === this._cubemapMaterial && (this._cubemapMaterial = Bc(), this._compileMaterial(this._cubemapMaterial));
    }
    compileEquirectangularShader() {
      null === this._equirectMaterial && (this._equirectMaterial = Fc(), this._compileMaterial(this._equirectMaterial));
    }
    dispose() {
      this._dispose(), null !== this._cubemapMaterial && this._cubemapMaterial.dispose(), null !== this._equirectMaterial && this._equirectMaterial.dispose();
    }
    _setSize(e) {
      this._lodMax = Math.floor(Math.log2(e)), this._cubeSize = Math.pow(2, this._lodMax);
    }
    _dispose() {
      null !== this._blurMaterial && this._blurMaterial.dispose(), null !== this._pingPongRenderTarget && this._pingPongRenderTarget.dispose();
      for (let e = 0; e < this._lodPlanes.length; e++) this._lodPlanes[e].dispose();
    }
    _cleanup(e) {
      this._renderer.setRenderTarget(Pa, La, Ia), e.scissorTest = false, jr(e, 0, 0, e.width, e.height);
    }
    _fromTexture(e, t) {
      e.mapping === fn || e.mapping === gn ? this._setSize(0 === e.image.length ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4), Pa = this._renderer.getRenderTarget(), La = this._renderer.getActiveCubeFace(), Ia = this._renderer.getActiveMipmapLevel();
      const i = t || this._allocateTargets();
      return this._textureToCubeUV(e, i), this._applyPMREM(i), this._cleanup(i), i;
    }
    _allocateTargets() {
      const e = 3 * Math.max(this._cubeSize, 112), t = 4 * this._cubeSize, i = { magFilter: gt, minFilter: gt, generateMipmaps: false, type: ri, format: bt, colorSpace: si, depthBuffer: false }, n = Oc(e, t, i);
      if (null === this._pingPongRenderTarget || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== t) {
        null !== this._pingPongRenderTarget && this._dispose(), this._pingPongRenderTarget = Oc(e, t, i);
        const { _lodMax: s } = this;
        ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = (function(a) {
          const o = [], l = [], c = [];
          let h = a;
          const u = a - 4 + 1 + Dc.length;
          for (let d = 0; d < u; d++) {
            const p = Math.pow(2, h);
            l.push(p);
            let f = 1 / p;
            d > a - 4 ? f = Dc[d - a + 4 - 1] : 0 === d && (f = 0), c.push(f);
            const v = 1 / (p - 2), m = -v, y = 1 + v, _ = [m, m, y, m, y, y, m, m, y, y, m, y], g = 6, w = 6, R = 3, T = 2, A = 1, N = new Float32Array(R * w * g), I = new Float32Array(T * w * g), F = new Float32Array(A * w * g);
            for (let P = 0; P < g; P++) {
              const W = P % 3 * 2 / 3 - 1, j = P > 2 ? 0 : -1, oe = [W, j, 0, W + 2 / 3, j, 0, W + 2 / 3, j + 1, 0, W, j, 0, W + 2 / 3, j + 1, 0, W, j + 1, 0];
              N.set(oe, R * w * P), I.set(_, T * w * P);
              const de = [P, P, P, P, P, P];
              F.set(de, A * w * P);
            }
            const Z = new Be();
            Z.setAttribute("position", new ke(N, R)), Z.setAttribute("uv", new ke(I, T)), Z.setAttribute("faceIndex", new ke(F, A)), o.push(Z), h > 4 && h--;
          }
          return { lodPlanes: o, sizeLods: l, sigmas: c };
        })(s)), this._blurMaterial = (function(a, o, l) {
          const c = new Float32Array($n), h = new E(0, 1, 0), u = new Ee({ name: "SphericalGaussianBlur", defines: { n: $n, CUBEUV_TEXEL_WIDTH: 1 / o, CUBEUV_TEXEL_HEIGHT: 1 / l, CUBEUV_MAX_MIP: `${a}.0` }, uniforms: { envMap: { value: null }, samples: { value: 1 }, weights: { value: c }, latitudinal: { value: false }, dTheta: { value: 0 }, mipInt: { value: 0 }, poleAxis: { value: h } }, vertexShader: Qo(), fragmentShader: "\n\n			precision mediump float;\n			precision mediump int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n			uniform int samples;\n			uniform float weights[ n ];\n			uniform bool latitudinal;\n			uniform float dTheta;\n			uniform float mipInt;\n			uniform vec3 poleAxis;\n\n			#define ENVMAP_TYPE_CUBE_UV\n			#include <cube_uv_reflection_fragment>\n\n			vec3 getSample( float theta, vec3 axis ) {\n\n				float cosTheta = cos( theta );\n				// Rodrigues' axis-angle rotation\n				vec3 sampleDirection = vOutputDirection * cosTheta\n					+ cross( axis, vOutputDirection ) * sin( theta )\n					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );\n\n				return bilinearCubeUV( envMap, sampleDirection, mipInt );\n\n			}\n\n			void main() {\n\n				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );\n\n				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {\n\n					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );\n\n				}\n\n				axis = normalize( axis );\n\n				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );\n\n				for ( int i = 1; i < n; i++ ) {\n\n					if ( i >= samples ) {\n\n						break;\n\n					}\n\n					float theta = dTheta * float( i );\n					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );\n					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );\n\n				}\n\n			}\n		", blending: 0, depthTest: false, depthWrite: false });
          return u;
        })(s, e, t);
      }
      return n;
    }
    _compileMaterial(e) {
      const t = new De(this._lodPlanes[0], e);
      this._renderer.compile(t, Ra);
    }
    _sceneToCubeUV(e, t, i, n) {
      const s = new ut(90, 1, t, i), a = [1, -1, 1, 1, 1, 1], o = [1, 1, 1, -1, -1, -1], l = this._renderer, c = l.autoClear, h = l.toneMapping;
      l.getClearColor(Uc), l.toneMapping = gi, l.autoClear = false;
      const u = new zt({ name: "PMREM.Background", side: vt, depthWrite: false, depthTest: false }), d = new De(new xn(), u);
      let p = false;
      const f = e.background;
      f ? f.isColor && (u.color.copy(f), e.background = null, p = true) : (u.color.copy(Uc), p = true);
      for (let v = 0; v < 6; v++) {
        const m = v % 3;
        0 === m ? (s.up.set(0, a[v], 0), s.lookAt(o[v], 0, 0)) : 1 === m ? (s.up.set(0, 0, a[v]), s.lookAt(0, o[v], 0)) : (s.up.set(0, a[v], 0), s.lookAt(0, 0, o[v]));
        const y = this._cubeSize;
        jr(n, m * y, v > 2 ? y : 0, y, y), l.setRenderTarget(n), p && l.render(d, s), l.render(e, s);
      }
      d.geometry.dispose(), d.material.dispose(), l.toneMapping = h, l.autoClear = c, e.background = f;
    }
    _textureToCubeUV(e, t) {
      const i = this._renderer, n = e.mapping === fn || e.mapping === gn;
      n ? (null === this._cubemapMaterial && (this._cubemapMaterial = Bc()), this._cubemapMaterial.uniforms.flipEnvMap.value = false === e.isRenderTargetTexture ? -1 : 1) : null === this._equirectMaterial && (this._equirectMaterial = Fc());
      const s = n ? this._cubemapMaterial : this._equirectMaterial, a = new De(this._lodPlanes[0], s);
      s.uniforms.envMap.value = e;
      const o = this._cubeSize;
      jr(t, 0, 0, 3 * o, 2 * o), i.setRenderTarget(t), i.render(a, Ra);
    }
    _applyPMREM(e) {
      const t = this._renderer, i = t.autoClear;
      t.autoClear = false;
      for (let n = 1; n < this._lodPlanes.length; n++) {
        const s = Math.sqrt(this._sigmas[n] * this._sigmas[n] - this._sigmas[n - 1] * this._sigmas[n - 1]), a = Nc[(n - 1) % Nc.length];
        this._blur(e, n - 1, n, s, a);
      }
      t.autoClear = i;
    }
    _blur(e, t, i, n, s) {
      const a = this._pingPongRenderTarget;
      this._halfBlur(e, a, t, i, n, "latitudinal", s), this._halfBlur(a, e, i, i, n, "longitudinal", s);
    }
    _halfBlur(e, t, i, n, s, a, o) {
      const l = this._renderer, c = this._blurMaterial;
      "latitudinal" !== a && "longitudinal" !== a && console.error("blur direction must be either latitudinal or longitudinal!");
      const h = new De(this._lodPlanes[n], c), u = c.uniforms, d = this._sizeLods[i] - 1, p = isFinite(s) ? Math.PI / (2 * d) : 2 * Math.PI / 39, f = s / p, v = isFinite(s) ? 1 + Math.floor(3 * f) : $n;
      v > $n && console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${v} samples when the maximum is set to 20`);
      const m = [];
      let y = 0;
      for (let w = 0; w < $n; ++w) {
        const R = w / f, T = Math.exp(-R * R / 2);
        m.push(T), 0 === w ? y += T : w < v && (y += 2 * T);
      }
      for (let w = 0; w < m.length; w++) m[w] = m[w] / y;
      u.envMap.value = e.texture, u.samples.value = v, u.weights.value = m, u.latitudinal.value = "latitudinal" === a, o && (u.poleAxis.value = o);
      const { _lodMax: _ } = this;
      u.dTheta.value = p, u.mipInt.value = _ - i;
      const g = this._sizeLods[n];
      jr(t, 3 * g * (n > _ - 4 ? n - _ + 4 : 0), 4 * (this._cubeSize - g), 3 * g, 2 * g), l.setRenderTarget(t), l.render(h, Ra);
    }
  };
  function Oc(r, e, t) {
    const i = new at(r, e, t);
    return i.texture.mapping = Bs, i.texture.name = "PMREM.cubeUv", i.scissorTest = true, i;
  }
  function jr(r, e, t, i, n) {
    r.viewport.set(e, t, i, n), r.scissor.set(e, t, i, n);
  }
  function Fc() {
    return new Ee({ name: "EquirectangularToCubeUV", uniforms: { envMap: { value: null } }, vertexShader: Qo(), fragmentShader: "\n\n			precision mediump float;\n			precision mediump int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n\n			#include <common>\n\n			void main() {\n\n				vec3 outputDirection = normalize( vOutputDirection );\n				vec2 uv = equirectUv( outputDirection );\n\n				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );\n\n			}\n		", blending: 0, depthTest: false, depthWrite: false });
  }
  function Bc() {
    return new Ee({ name: "CubemapToCubeUV", uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 } }, vertexShader: Qo(), fragmentShader: "\n\n			precision mediump float;\n			precision mediump int;\n\n			uniform float flipEnvMap;\n\n			varying vec3 vOutputDirection;\n\n			uniform samplerCube envMap;\n\n			void main() {\n\n				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );\n\n			}\n		", blending: 0, depthTest: false, depthWrite: false });
  }
  function Qo() {
    return "\n\n		precision mediump float;\n		precision mediump int;\n\n		attribute float faceIndex;\n\n		varying vec3 vOutputDirection;\n\n		// RH coordinate system; PMREM face-indexing convention\n		vec3 getDirection( vec2 uv, float face ) {\n\n			uv = 2.0 * uv - 1.0;\n\n			vec3 direction = vec3( uv, 1.0 );\n\n			if ( face == 0.0 ) {\n\n				direction = direction.zyx; // ( 1, v, u ) pos x\n\n			} else if ( face == 1.0 ) {\n\n				direction = direction.xzy;\n				direction.xz *= -1.0; // ( -u, 1, -v ) pos y\n\n			} else if ( face == 2.0 ) {\n\n				direction.x *= -1.0; // ( -u, v, 1 ) pos z\n\n			} else if ( face == 3.0 ) {\n\n				direction = direction.zyx;\n				direction.xz *= -1.0; // ( -1, v, -u ) neg x\n\n			} else if ( face == 4.0 ) {\n\n				direction = direction.xzy;\n				direction.xy *= -1.0; // ( -u, -1, v ) neg y\n\n			} else if ( face == 5.0 ) {\n\n				direction.z *= -1.0; // ( u, v, -1 ) neg z\n\n			}\n\n			return direction;\n\n		}\n\n		void main() {\n\n			vOutputDirection = getDirection( uv, faceIndex );\n			gl_Position = vec4( position, 1.0 );\n\n		}\n	";
  }
  function zu(r) {
    let e = /* @__PURE__ */ new WeakMap(), t = null;
    function i(n) {
      const s = n.target;
      s.removeEventListener("dispose", i);
      const a = e.get(s);
      void 0 !== a && (e.delete(s), a.dispose());
    }
    return { get: function(n) {
      if (n && n.isTexture) {
        const s = n.mapping, a = s === Xa || s === ja, o = s === fn || s === gn;
        if (a || o) {
          if (n.isRenderTargetTexture && true === n.needsPMREMUpdate) {
            n.needsPMREMUpdate = false;
            let l = e.get(n);
            return null === t && (t = new Ms(r)), l = a ? t.fromEquirectangular(n, l) : t.fromCubemap(n, l), e.set(n, l), l.texture;
          }
          if (e.has(n)) return e.get(n).texture;
          {
            const l = n.image;
            if (a && l && l.height > 0 || o && l && (function(c) {
              let h = 0;
              const u = 6;
              for (let d = 0; d < u; d++) void 0 !== c[d] && h++;
              return h === u;
            })(l)) {
              null === t && (t = new Ms(r));
              const c = a ? t.fromEquirectangular(n) : t.fromCubemap(n);
              return e.set(n, c), n.addEventListener("dispose", i), c.texture;
            }
            return null;
          }
        }
      }
      return n;
    }, dispose: function() {
      e = /* @__PURE__ */ new WeakMap(), null !== t && (t.dispose(), t = null);
    } };
  }
  function ku(r) {
    const e = {};
    function t(i) {
      if (void 0 !== e[i]) return e[i];
      let n;
      switch (i) {
        case "WEBGL_depth_texture":
          n = r.getExtension("WEBGL_depth_texture") || r.getExtension("MOZ_WEBGL_depth_texture") || r.getExtension("WEBKIT_WEBGL_depth_texture");
          break;
        case "EXT_texture_filter_anisotropic":
          n = r.getExtension("EXT_texture_filter_anisotropic") || r.getExtension("MOZ_EXT_texture_filter_anisotropic") || r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
          break;
        case "WEBGL_compressed_texture_s3tc":
          n = r.getExtension("WEBGL_compressed_texture_s3tc") || r.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
          break;
        case "WEBGL_compressed_texture_pvrtc":
          n = r.getExtension("WEBGL_compressed_texture_pvrtc") || r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
          break;
        default:
          n = r.getExtension(i);
      }
      return e[i] = n, n;
    }
    return { has: function(i) {
      return null !== t(i);
    }, init: function(i) {
      i.isWebGL2 ? (t("EXT_color_buffer_float"), t("WEBGL_clip_cull_distance")) : (t("WEBGL_depth_texture"), t("OES_texture_float"), t("OES_texture_half_float"), t("OES_texture_half_float_linear"), t("OES_standard_derivatives"), t("OES_element_index_uint"), t("OES_vertex_array_object"), t("ANGLE_instanced_arrays")), t("OES_texture_float_linear"), t("EXT_color_buffer_half_float"), t("WEBGL_multisampled_render_to_texture");
    }, get: function(i) {
      const n = t(i);
      return null === n && console.warn("THREE.WebGLRenderer: " + i + " extension not supported."), n;
    } };
  }
  function Vu(r, e, t, i) {
    const n = {}, s = /* @__PURE__ */ new WeakMap();
    function a(l) {
      const c = l.target;
      null !== c.index && e.remove(c.index);
      for (const u in c.attributes) e.remove(c.attributes[u]);
      for (const u in c.morphAttributes) {
        const d = c.morphAttributes[u];
        for (let p = 0, f = d.length; p < f; p++) e.remove(d[p]);
      }
      c.removeEventListener("dispose", a), delete n[c.id];
      const h = s.get(c);
      h && (e.remove(h), s.delete(c)), i.releaseStatesOfGeometry(c), true === c.isInstancedBufferGeometry && delete c._maxInstanceCount, t.memory.geometries--;
    }
    function o(l) {
      const c = [], h = l.index, u = l.attributes.position;
      let d = 0;
      if (null !== h) {
        const v = h.array;
        d = h.version;
        for (let m = 0, y = v.length; m < y; m += 3) {
          const _ = v[m + 0], g = v[m + 1], w = v[m + 2];
          c.push(_, g, g, w, w, _);
        }
      } else {
        if (void 0 === u) return;
        {
          const v = u.array;
          d = u.version;
          for (let m = 0, y = v.length / 3 - 1; m < y; m += 3) {
            const _ = m + 0, g = m + 1, w = m + 2;
            c.push(_, g, g, w, w, _);
          }
        }
      }
      const p = new (Ph(c) ? ys : _s)(c, 1);
      p.version = d;
      const f = s.get(l);
      f && e.remove(f), s.set(l, p);
    }
    return { get: function(l, c) {
      return true === n[c.id] || (c.addEventListener("dispose", a), n[c.id] = true, t.memory.geometries++), c;
    }, update: function(l) {
      const c = l.attributes;
      for (const u in c) e.update(c[u], r.ARRAY_BUFFER);
      const h = l.morphAttributes;
      for (const u in h) {
        const d = h[u];
        for (let p = 0, f = d.length; p < f; p++) e.update(d[p], r.ARRAY_BUFFER);
      }
    }, getWireframeAttribute: function(l) {
      const c = s.get(l);
      if (c) {
        const h = l.index;
        null !== h && c.version < h.version && o(l);
      } else o(l);
      return s.get(l);
    } };
  }
  function Gu(r, e, t, i) {
    const n = i.isWebGL2;
    let s, a, o;
    this.setMode = function(l) {
      s = l;
    }, this.setIndex = function(l) {
      a = l.type, o = l.bytesPerElement;
    }, this.render = function(l, c) {
      r.drawElements(s, c, a, l * o), t.update(c, s, 1);
    }, this.renderInstances = function(l, c, h) {
      if (0 === h) return;
      let u, d;
      if (n) u = r, d = "drawElementsInstanced";
      else if (u = e.get("ANGLE_instanced_arrays"), d = "drawElementsInstancedANGLE", null === u) return void console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");
      u[d](s, c, a, l * o, h), t.update(c, s, h);
    }, this.renderMultiDraw = function(l, c, h) {
      if (0 === h) return;
      const u = e.get("WEBGL_multi_draw");
      if (null === u) for (let d = 0; d < h; d++) this.render(l[d] / o, c[d]);
      else {
        u.multiDrawElementsWEBGL(s, c, 0, a, l, 0, h);
        let d = 0;
        for (let p = 0; p < h; p++) d += c[p];
        t.update(d, s, 1);
      }
    };
  }
  function Wu(r) {
    const e = { frame: 0, calls: 0, triangles: 0, points: 0, lines: 0 };
    return { memory: { geometries: 0, textures: 0 }, render: e, programs: null, autoReset: true, reset: function() {
      e.calls = 0, e.triangles = 0, e.points = 0, e.lines = 0;
    }, update: function(t, i, n) {
      switch (e.calls++, i) {
        case r.TRIANGLES:
          e.triangles += n * (t / 3);
          break;
        case r.LINES:
          e.lines += n * (t / 2);
          break;
        case r.LINE_STRIP:
          e.lines += n * (t - 1);
          break;
        case r.LINE_LOOP:
          e.lines += n * t;
          break;
        case r.POINTS:
          e.points += n * t;
          break;
        default:
          console.error("THREE.WebGLInfo: Unknown draw mode:", i);
      }
    } };
  }
  function Xu(r, e) {
    return r[0] - e[0];
  }
  function ju(r, e) {
    return Math.abs(e[1]) - Math.abs(r[1]);
  }
  function qu(r, e, t) {
    const i = {}, n = new Float32Array(8), s = /* @__PURE__ */ new WeakMap(), a = new Ge(), o = [];
    for (let l = 0; l < 8; l++) o[l] = [l, 0];
    return { update: function(l, c, h) {
      const u = l.morphTargetInfluences;
      if (true === e.isWebGL2) {
        const p = c.morphAttributes.position || c.morphAttributes.normal || c.morphAttributes.color, f = void 0 !== p ? p.length : 0;
        let v = s.get(c);
        if (void 0 === v || v.count !== f) {
          let j = function() {
            P.dispose(), s.delete(c), c.removeEventListener("dispose", j);
          };
          var d = j;
          void 0 !== v && v.texture.dispose();
          const _ = void 0 !== c.morphAttributes.position, g = void 0 !== c.morphAttributes.normal, w = void 0 !== c.morphAttributes.color, R = c.morphAttributes.position || [], T = c.morphAttributes.normal || [], A = c.morphAttributes.color || [];
          let N = 0;
          true === _ && (N = 1), true === g && (N = 2), true === w && (N = 3);
          let I = c.attributes.position.count * N, F = 1;
          I > e.maxTextureSize && (F = Math.ceil(I / e.maxTextureSize), I = e.maxTextureSize);
          const Z = new Float32Array(I * F * 4 * f), P = new fs(Z, I, F, f);
          P.type = Nt, P.needsUpdate = true;
          const W = 4 * N;
          for (let oe = 0; oe < f; oe++) {
            const de = R[oe], ne = T[oe], te = A[oe], $ = I * F * 4 * oe;
            for (let k = 0; k < de.count; k++) {
              const G = k * W;
              true === _ && (a.fromBufferAttribute(de, k), Z[$ + G + 0] = a.x, Z[$ + G + 1] = a.y, Z[$ + G + 2] = a.z, Z[$ + G + 3] = 0), true === g && (a.fromBufferAttribute(ne, k), Z[$ + G + 4] = a.x, Z[$ + G + 5] = a.y, Z[$ + G + 6] = a.z, Z[$ + G + 7] = 0), true === w && (a.fromBufferAttribute(te, k), Z[$ + G + 8] = a.x, Z[$ + G + 9] = a.y, Z[$ + G + 10] = a.z, Z[$ + G + 11] = 4 === te.itemSize ? a.w : 1);
            }
          }
          v = { count: f, texture: P, size: new X(I, F) }, s.set(c, v), c.addEventListener("dispose", j);
        }
        let m = 0;
        for (let _ = 0; _ < u.length; _++) m += u[_];
        const y = c.morphTargetsRelative ? 1 : 1 - m;
        h.getUniforms().setValue(r, "morphTargetBaseInfluence", y), h.getUniforms().setValue(r, "morphTargetInfluences", u), h.getUniforms().setValue(r, "morphTargetsTexture", v.texture, t), h.getUniforms().setValue(r, "morphTargetsTextureSize", v.size);
      } else {
        const p = void 0 === u ? 0 : u.length;
        let f = i[c.id];
        if (void 0 === f || f.length !== p) {
          f = [];
          for (let g = 0; g < p; g++) f[g] = [g, 0];
          i[c.id] = f;
        }
        for (let g = 0; g < p; g++) {
          const w = f[g];
          w[0] = g, w[1] = u[g];
        }
        f.sort(ju);
        for (let g = 0; g < 8; g++) g < p && f[g][1] ? (o[g][0] = f[g][0], o[g][1] = f[g][1]) : (o[g][0] = Number.MAX_SAFE_INTEGER, o[g][1] = 0);
        o.sort(Xu);
        const v = c.morphAttributes.position, m = c.morphAttributes.normal;
        let y = 0;
        for (let g = 0; g < 8; g++) {
          const w = o[g], R = w[0], T = w[1];
          R !== Number.MAX_SAFE_INTEGER && T ? (v && c.getAttribute("morphTarget" + g) !== v[R] && c.setAttribute("morphTarget" + g, v[R]), m && c.getAttribute("morphNormal" + g) !== m[R] && c.setAttribute("morphNormal" + g, m[R]), n[g] = T, y += T) : (v && true === c.hasAttribute("morphTarget" + g) && c.deleteAttribute("morphTarget" + g), m && true === c.hasAttribute("morphNormal" + g) && c.deleteAttribute("morphNormal" + g), n[g] = 0);
        }
        const _ = c.morphTargetsRelative ? 1 : 1 - y;
        h.getUniforms().setValue(r, "morphTargetBaseInfluence", _), h.getUniforms().setValue(r, "morphTargetInfluences", n);
      }
    } };
  }
  function Yu(r, e, t, i) {
    let n = /* @__PURE__ */ new WeakMap();
    function s(a) {
      const o = a.target;
      o.removeEventListener("dispose", s), t.remove(o.instanceMatrix), null !== o.instanceColor && t.remove(o.instanceColor);
    }
    return { update: function(a) {
      const o = i.render.frame, l = a.geometry, c = e.get(a, l);
      if (n.get(c) !== o && (e.update(c), n.set(c, o)), a.isInstancedMesh && (false === a.hasEventListener("dispose", s) && a.addEventListener("dispose", s), n.get(a) !== o && (t.update(a.instanceMatrix, r.ARRAY_BUFFER), null !== a.instanceColor && t.update(a.instanceColor, r.ARRAY_BUFFER), n.set(a, o))), a.isSkinnedMesh) {
        const h = a.skeleton;
        n.get(h) !== o && (h.update(), n.set(h, o));
      }
      return c;
    }, dispose: function() {
      n = /* @__PURE__ */ new WeakMap();
    } };
  }
  var bs = class extends Ct {
    constructor(e, t, i, n, s, a, o, l, c, h) {
      if ((h = void 0 !== h ? h : Hi) !== Hi && h !== vn) throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
      void 0 === i && h === Hi && (i = mi), void 0 === i && h === vn && (i = Bi), super(null, n, s, a, o, l, h, i, c), this.isDepthTexture = true, this.image = { width: e, height: t }, this.magFilter = void 0 !== o ? o : pt, this.minFilter = void 0 !== l ? l : pt, this.flipY = false, this.generateMipmaps = false, this.compareFunction = null;
    }
    copy(e) {
      return super.copy(e), this.compareFunction = e.compareFunction, this;
    }
    toJSON(e) {
      const t = super.toJSON(e);
      return null !== this.compareFunction && (t.compareFunction = this.compareFunction), t;
    }
  };
  var Uh = new Ct();
  var Nh = new bs(1, 1);
  Nh.compareFunction = 515;
  var Oh = new fs();
  var Fh = new Qa();
  var Bh = new xs();
  var Hc = [];
  var zc = [];
  var kc = new Float32Array(16);
  var Vc = new Float32Array(9);
  var Gc = new Float32Array(4);
  function An(r, e, t) {
    const i = r[0];
    if (i <= 0 || i > 0) return r;
    const n = e * t;
    let s = Hc[n];
    if (void 0 === s && (s = new Float32Array(n), Hc[n] = s), 0 !== e) {
      i.toArray(s, 0);
      for (let a = 1, o = 0; a !== e; ++a) o += t, r[a].toArray(s, o);
    }
    return s;
  }
  function et(r, e) {
    if (r.length !== e.length) return false;
    for (let t = 0, i = r.length; t < i; t++) if (r[t] !== e[t]) return false;
    return true;
  }
  function tt(r, e) {
    for (let t = 0, i = e.length; t < i; t++) r[t] = e[t];
  }
  function zs(r, e) {
    let t = zc[e];
    void 0 === t && (t = new Int32Array(e), zc[e] = t);
    for (let i = 0; i !== e; ++i) t[i] = r.allocateTextureUnit();
    return t;
  }
  function Zu(r, e) {
    const t = this.cache;
    t[0] !== e && (r.uniform1f(this.addr, e), t[0] = e);
  }
  function Ju(r, e) {
    const t = this.cache;
    if (void 0 !== e.x) t[0] === e.x && t[1] === e.y || (r.uniform2f(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
    else {
      if (et(t, e)) return;
      r.uniform2fv(this.addr, e), tt(t, e);
    }
  }
  function Ku(r, e) {
    const t = this.cache;
    if (void 0 !== e.x) t[0] === e.x && t[1] === e.y && t[2] === e.z || (r.uniform3f(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
    else if (void 0 !== e.r) t[0] === e.r && t[1] === e.g && t[2] === e.b || (r.uniform3f(this.addr, e.r, e.g, e.b), t[0] = e.r, t[1] = e.g, t[2] = e.b);
    else {
      if (et(t, e)) return;
      r.uniform3fv(this.addr, e), tt(t, e);
    }
  }
  function $u(r, e) {
    const t = this.cache;
    if (void 0 !== e.x) t[0] === e.x && t[1] === e.y && t[2] === e.z && t[3] === e.w || (r.uniform4f(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
    else {
      if (et(t, e)) return;
      r.uniform4fv(this.addr, e), tt(t, e);
    }
  }
  function Qu(r, e) {
    const t = this.cache, i = e.elements;
    if (void 0 === i) {
      if (et(t, e)) return;
      r.uniformMatrix2fv(this.addr, false, e), tt(t, e);
    } else {
      if (et(t, i)) return;
      Gc.set(i), r.uniformMatrix2fv(this.addr, false, Gc), tt(t, i);
    }
  }
  function ed(r, e) {
    const t = this.cache, i = e.elements;
    if (void 0 === i) {
      if (et(t, e)) return;
      r.uniformMatrix3fv(this.addr, false, e), tt(t, e);
    } else {
      if (et(t, i)) return;
      Vc.set(i), r.uniformMatrix3fv(this.addr, false, Vc), tt(t, i);
    }
  }
  function td(r, e) {
    const t = this.cache, i = e.elements;
    if (void 0 === i) {
      if (et(t, e)) return;
      r.uniformMatrix4fv(this.addr, false, e), tt(t, e);
    } else {
      if (et(t, i)) return;
      kc.set(i), r.uniformMatrix4fv(this.addr, false, kc), tt(t, i);
    }
  }
  function id(r, e) {
    const t = this.cache;
    t[0] !== e && (r.uniform1i(this.addr, e), t[0] = e);
  }
  function nd(r, e) {
    const t = this.cache;
    if (void 0 !== e.x) t[0] === e.x && t[1] === e.y || (r.uniform2i(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
    else {
      if (et(t, e)) return;
      r.uniform2iv(this.addr, e), tt(t, e);
    }
  }
  function rd(r, e) {
    const t = this.cache;
    if (void 0 !== e.x) t[0] === e.x && t[1] === e.y && t[2] === e.z || (r.uniform3i(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
    else {
      if (et(t, e)) return;
      r.uniform3iv(this.addr, e), tt(t, e);
    }
  }
  function sd(r, e) {
    const t = this.cache;
    if (void 0 !== e.x) t[0] === e.x && t[1] === e.y && t[2] === e.z && t[3] === e.w || (r.uniform4i(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
    else {
      if (et(t, e)) return;
      r.uniform4iv(this.addr, e), tt(t, e);
    }
  }
  function ad(r, e) {
    const t = this.cache;
    t[0] !== e && (r.uniform1ui(this.addr, e), t[0] = e);
  }
  function od(r, e) {
    const t = this.cache;
    if (void 0 !== e.x) t[0] === e.x && t[1] === e.y || (r.uniform2ui(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
    else {
      if (et(t, e)) return;
      r.uniform2uiv(this.addr, e), tt(t, e);
    }
  }
  function ld(r, e) {
    const t = this.cache;
    if (void 0 !== e.x) t[0] === e.x && t[1] === e.y && t[2] === e.z || (r.uniform3ui(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
    else {
      if (et(t, e)) return;
      r.uniform3uiv(this.addr, e), tt(t, e);
    }
  }
  function cd(r, e) {
    const t = this.cache;
    if (void 0 !== e.x) t[0] === e.x && t[1] === e.y && t[2] === e.z && t[3] === e.w || (r.uniform4ui(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
    else {
      if (et(t, e)) return;
      r.uniform4uiv(this.addr, e), tt(t, e);
    }
  }
  function hd(r, e, t) {
    const i = this.cache, n = t.allocateTextureUnit();
    i[0] !== n && (r.uniform1i(this.addr, n), i[0] = n);
    const s = this.type === r.SAMPLER_2D_SHADOW ? Nh : Uh;
    t.setTexture2D(e || s, n);
  }
  function ud(r, e, t) {
    const i = this.cache, n = t.allocateTextureUnit();
    i[0] !== n && (r.uniform1i(this.addr, n), i[0] = n), t.setTexture3D(e || Fh, n);
  }
  function dd(r, e, t) {
    const i = this.cache, n = t.allocateTextureUnit();
    i[0] !== n && (r.uniform1i(this.addr, n), i[0] = n), t.setTextureCube(e || Bh, n);
  }
  function pd(r, e, t) {
    const i = this.cache, n = t.allocateTextureUnit();
    i[0] !== n && (r.uniform1i(this.addr, n), i[0] = n), t.setTexture2DArray(e || Oh, n);
  }
  function md(r, e) {
    r.uniform1fv(this.addr, e);
  }
  function fd(r, e) {
    const t = An(e, this.size, 2);
    r.uniform2fv(this.addr, t);
  }
  function gd(r, e) {
    const t = An(e, this.size, 3);
    r.uniform3fv(this.addr, t);
  }
  function vd(r, e) {
    const t = An(e, this.size, 4);
    r.uniform4fv(this.addr, t);
  }
  function _d(r, e) {
    const t = An(e, this.size, 4);
    r.uniformMatrix2fv(this.addr, false, t);
  }
  function yd(r, e) {
    const t = An(e, this.size, 9);
    r.uniformMatrix3fv(this.addr, false, t);
  }
  function xd(r, e) {
    const t = An(e, this.size, 16);
    r.uniformMatrix4fv(this.addr, false, t);
  }
  function Md(r, e) {
    r.uniform1iv(this.addr, e);
  }
  function bd(r, e) {
    r.uniform2iv(this.addr, e);
  }
  function Sd(r, e) {
    r.uniform3iv(this.addr, e);
  }
  function Ed(r, e) {
    r.uniform4iv(this.addr, e);
  }
  function Td(r, e) {
    r.uniform1uiv(this.addr, e);
  }
  function wd(r, e) {
    r.uniform2uiv(this.addr, e);
  }
  function Cd(r, e) {
    r.uniform3uiv(this.addr, e);
  }
  function Ad(r, e) {
    r.uniform4uiv(this.addr, e);
  }
  function Rd(r, e, t) {
    const i = this.cache, n = e.length, s = zs(t, n);
    et(i, s) || (r.uniform1iv(this.addr, s), tt(i, s));
    for (let a = 0; a !== n; ++a) t.setTexture2D(e[a] || Uh, s[a]);
  }
  function Pd(r, e, t) {
    const i = this.cache, n = e.length, s = zs(t, n);
    et(i, s) || (r.uniform1iv(this.addr, s), tt(i, s));
    for (let a = 0; a !== n; ++a) t.setTexture3D(e[a] || Fh, s[a]);
  }
  function Ld(r, e, t) {
    const i = this.cache, n = e.length, s = zs(t, n);
    et(i, s) || (r.uniform1iv(this.addr, s), tt(i, s));
    for (let a = 0; a !== n; ++a) t.setTextureCube(e[a] || Bh, s[a]);
  }
  function Id(r, e, t) {
    const i = this.cache, n = e.length, s = zs(t, n);
    et(i, s) || (r.uniform1iv(this.addr, s), tt(i, s));
    for (let a = 0; a !== n; ++a) t.setTexture2DArray(e[a] || Oh, s[a]);
  }
  var io = class {
    constructor(e, t, i) {
      this.id = e, this.addr = i, this.cache = [], this.type = t.type, this.setValue = (function(n) {
        switch (n) {
          case 5126:
            return Zu;
          case 35664:
            return Ju;
          case 35665:
            return Ku;
          case 35666:
            return $u;
          case 35674:
            return Qu;
          case 35675:
            return ed;
          case 35676:
            return td;
          case 5124:
          case 35670:
            return id;
          case 35667:
          case 35671:
            return nd;
          case 35668:
          case 35672:
            return rd;
          case 35669:
          case 35673:
            return sd;
          case 5125:
            return ad;
          case 36294:
            return od;
          case 36295:
            return ld;
          case 36296:
            return cd;
          case 35678:
          case 36198:
          case 36298:
          case 36306:
          case 35682:
            return hd;
          case 35679:
          case 36299:
          case 36307:
            return ud;
          case 35680:
          case 36300:
          case 36308:
          case 36293:
            return dd;
          case 36289:
          case 36303:
          case 36311:
          case 36292:
            return pd;
        }
      })(t.type);
    }
  };
  var no = class {
    constructor(e, t, i) {
      this.id = e, this.addr = i, this.cache = [], this.type = t.type, this.size = t.size, this.setValue = (function(n) {
        switch (n) {
          case 5126:
            return md;
          case 35664:
            return fd;
          case 35665:
            return gd;
          case 35666:
            return vd;
          case 35674:
            return _d;
          case 35675:
            return yd;
          case 35676:
            return xd;
          case 5124:
          case 35670:
            return Md;
          case 35667:
          case 35671:
            return bd;
          case 35668:
          case 35672:
            return Sd;
          case 35669:
          case 35673:
            return Ed;
          case 5125:
            return Td;
          case 36294:
            return wd;
          case 36295:
            return Cd;
          case 36296:
            return Ad;
          case 35678:
          case 36198:
          case 36298:
          case 36306:
          case 35682:
            return Rd;
          case 35679:
          case 36299:
          case 36307:
            return Pd;
          case 35680:
          case 36300:
          case 36308:
          case 36293:
            return Ld;
          case 36289:
          case 36303:
          case 36311:
          case 36292:
            return Id;
        }
      })(t.type);
    }
  };
  var ro = class {
    constructor(e) {
      this.id = e, this.seq = [], this.map = {};
    }
    setValue(e, t, i) {
      const n = this.seq;
      for (let s = 0, a = n.length; s !== a; ++s) {
        const o = n[s];
        o.setValue(e, t[o.id], i);
      }
    }
  };
  var Da = /(\w+)(\])?(\[|\.)?/g;
  function Wc(r, e) {
    r.seq.push(e), r.map[e.id] = e;
  }
  function Dd(r, e, t) {
    const i = r.name, n = i.length;
    for (Da.lastIndex = 0; ; ) {
      const s = Da.exec(i), a = Da.lastIndex;
      let o = s[1];
      const l = "]" === s[2], c = s[3];
      if (l && (o |= 0), void 0 === c || "[" === c && a + 2 === n) {
        Wc(t, void 0 === c ? new io(o, r, e) : new no(o, r, e));
        break;
      }
      {
        let h = t.map[o];
        void 0 === h && (h = new ro(o), Wc(t, h)), t = h;
      }
    }
  }
  var mn = class {
    constructor(e, t) {
      this.seq = [], this.map = {};
      const i = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
      for (let n = 0; n < i; ++n) {
        const s = e.getActiveUniform(t, n);
        Dd(s, e.getUniformLocation(t, s.name), this);
      }
    }
    setValue(e, t, i, n) {
      const s = this.map[t];
      void 0 !== s && s.setValue(e, i, n);
    }
    setOptional(e, t, i) {
      const n = t[i];
      void 0 !== n && this.setValue(e, i, n);
    }
    static upload(e, t, i, n) {
      for (let s = 0, a = t.length; s !== a; ++s) {
        const o = t[s], l = i[o.id];
        false !== l.needsUpdate && o.setValue(e, l.value, n);
      }
    }
    static seqWithValue(e, t) {
      const i = [];
      for (let n = 0, s = e.length; n !== s; ++n) {
        const a = e[n];
        a.id in t && i.push(a);
      }
      return i;
    }
  };
  function Xc(r, e, t) {
    const i = r.createShader(e);
    return r.shaderSource(i, t), r.compileShader(i), i;
  }
  var Ud = 37297;
  var Nd = 0;
  function jc(r, e, t) {
    const i = r.getShaderParameter(e, r.COMPILE_STATUS), n = r.getShaderInfoLog(e).trim();
    if (i && "" === n) return "";
    const s = /ERROR: 0:(\d+)/.exec(n);
    if (s) {
      const a = parseInt(s[1]);
      return t.toUpperCase() + "\n\n" + n + "\n\n" + (function(o, l) {
        const c = o.split("\n"), h = [], u = Math.max(l - 6, 0), d = Math.min(l + 6, c.length);
        for (let p = u; p < d; p++) {
          const f = p + 1;
          h.push(`${f === l ? ">" : " "} ${f}: ${c[p]}`);
        }
        return h.join("\n");
      })(r.getShaderSource(e), a);
    }
    return n;
  }
  function Od(r, e) {
    const t = (function(i) {
      const n = ze.getPrimaries(ze.workingColorSpace), s = ze.getPrimaries(i);
      let a;
      switch (n === s ? a = "" : n === hs && s === cs ? a = "LinearDisplayP3ToLinearSRGB" : n === cs && s === hs && (a = "LinearSRGBToLinearDisplayP3"), i) {
        case si:
        case Hs:
          return [a, "LinearTransferOETF"];
        case Qe:
        case $o:
          return [a, "sRGBTransferOETF"];
        default:
          return console.warn("THREE.WebGLProgram: Unsupported color space:", i), [a, "LinearTransferOETF"];
      }
    })(e);
    return `vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`;
  }
  function Fd(r, e) {
    let t;
    switch (e) {
      case cu:
        t = "Linear";
        break;
      case hu:
        t = "Reinhard";
        break;
      case uu:
        t = "OptimizedCineon";
        break;
      case Jo:
        t = "ACESFilmic";
        break;
      case pu:
        t = "AgX";
        break;
      case du:
        t = "Custom";
        break;
      default:
        console.warn("THREE.WebGLProgram: Unsupported toneMapping:", e), t = "Linear";
    }
    return "vec3 " + r + "( vec3 color ) { return " + t + "ToneMapping( color ); }";
  }
  function hn(r) {
    return "" !== r;
  }
  function qc(r, e) {
    const t = e.numSpotLightShadows + e.numSpotLightMaps - e.numSpotLightShadowsWithMaps;
    return r.replace(/NUM_DIR_LIGHTS/g, e.numDirLights).replace(/NUM_SPOT_LIGHTS/g, e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, t).replace(/NUM_RECT_AREA_LIGHTS/g, e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, e.numPointLights).replace(/NUM_HEMI_LIGHTS/g, e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, e.numPointLightShadows);
  }
  function Yc(r, e) {
    return r.replace(/NUM_CLIPPING_PLANES/g, e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, e.numClippingPlanes - e.numClipIntersection);
  }
  var Bd = /^[ \t]*#include +<([\w\d./]+)>/gm;
  function so(r) {
    return r.replace(Bd, zd);
  }
  var Hd = /* @__PURE__ */ new Map([["encodings_fragment", "colorspace_fragment"], ["encodings_pars_fragment", "colorspace_pars_fragment"], ["output_fragment", "opaque_fragment"]]);
  function zd(r, e) {
    let t = Se[e];
    if (void 0 === t) {
      const i = Hd.get(e);
      if (void 0 === i) throw new Error("Can not resolve #include <" + e + ">");
      t = Se[i], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', e, i);
    }
    return so(t);
  }
  var kd = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
  function Zc(r) {
    return r.replace(kd, Vd);
  }
  function Vd(r, e, t, i) {
    let n = "";
    for (let s = parseInt(e); s < parseInt(t); s++) n += i.replace(/\[\s*i\s*\]/g, "[ " + s + " ]").replace(/UNROLLED_LOOP_INDEX/g, s);
    return n;
  }
  function Jc(r) {
    let e = "precision " + r.precision + " float;\nprecision " + r.precision + " int;";
    return "highp" === r.precision ? e += "\n#define HIGH_PRECISION" : "mediump" === r.precision ? e += "\n#define MEDIUM_PRECISION" : "lowp" === r.precision && (e += "\n#define LOW_PRECISION"), e;
  }
  function Gd(r, e, t, i) {
    const n = r.getContext(), s = t.defines;
    let a = t.vertexShader, o = t.fragmentShader;
    const l = (function(P) {
      let W = "SHADOWMAP_TYPE_BASIC";
      return P.shadowMapType === vh ? W = "SHADOWMAP_TYPE_PCF" : P.shadowMapType === au ? W = "SHADOWMAP_TYPE_PCF_SOFT" : P.shadowMapType === ti && (W = "SHADOWMAP_TYPE_VSM"), W;
    })(t), c = (function(P) {
      let W = "ENVMAP_TYPE_CUBE";
      if (P.envMap) switch (P.envMapMode) {
        case fn:
        case gn:
          W = "ENVMAP_TYPE_CUBE";
          break;
        case Bs:
          W = "ENVMAP_TYPE_CUBE_UV";
      }
      return W;
    })(t), h = (function(P) {
      let W = "ENVMAP_MODE_REFLECTION";
      P.envMap && P.envMapMode === gn && (W = "ENVMAP_MODE_REFRACTION");
      return W;
    })(t), u = (function(P) {
      let W = "ENVMAP_BLENDING_NONE";
      if (P.envMap) switch (P.combine) {
        case xh:
          W = "ENVMAP_BLENDING_MULTIPLY";
          break;
        case ou:
          W = "ENVMAP_BLENDING_MIX";
          break;
        case lu:
          W = "ENVMAP_BLENDING_ADD";
      }
      return W;
    })(t), d = (function(P) {
      const W = P.envMapCubeUVHeight;
      if (null === W) return null;
      const j = Math.log2(W) - 2, oe = 1 / W;
      return { texelWidth: 1 / (3 * Math.max(Math.pow(2, j), 112)), texelHeight: oe, maxMip: j };
    })(t), p = t.isWebGL2 ? "" : (function(P) {
      return [P.extensionDerivatives || P.envMapCubeUVHeight || P.bumpMap || P.normalMapTangentSpace || P.clearcoatNormalMap || P.flatShading || "physical" === P.shaderID ? "#extension GL_OES_standard_derivatives : enable" : "", (P.extensionFragDepth || P.logarithmicDepthBuffer) && P.rendererExtensionFragDepth ? "#extension GL_EXT_frag_depth : enable" : "", P.extensionDrawBuffers && P.rendererExtensionDrawBuffers ? "#extension GL_EXT_draw_buffers : require" : "", (P.extensionShaderTextureLOD || P.envMap || P.transmission) && P.rendererExtensionShaderTextureLod ? "#extension GL_EXT_shader_texture_lod : enable" : ""].filter(hn).join("\n");
    })(t), f = (function(P) {
      return [P.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : ""].filter(hn).join("\n");
    })(t), v = (function(P) {
      const W = [];
      for (const j in P) {
        const oe = P[j];
        false !== oe && W.push("#define " + j + " " + oe);
      }
      return W.join("\n");
    })(s), m = n.createProgram();
    let y, _, g = t.glslVersion ? "#version " + t.glslVersion + "\n" : "";
    t.isRawShaderMaterial ? (y = ["#define SHADER_TYPE " + t.shaderType, "#define SHADER_NAME " + t.shaderName, v].filter(hn).join("\n"), y.length > 0 && (y += "\n"), _ = [p, "#define SHADER_TYPE " + t.shaderType, "#define SHADER_NAME " + t.shaderName, v].filter(hn).join("\n"), _.length > 0 && (_ += "\n")) : (y = [Jc(t), "#define SHADER_TYPE " + t.shaderType, "#define SHADER_NAME " + t.shaderName, v, t.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "", t.batching ? "#define USE_BATCHING" : "", t.instancing ? "#define USE_INSTANCING" : "", t.instancingColor ? "#define USE_INSTANCING_COLOR" : "", t.useFog && t.fog ? "#define USE_FOG" : "", t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "", t.map ? "#define USE_MAP" : "", t.envMap ? "#define USE_ENVMAP" : "", t.envMap ? "#define " + h : "", t.lightMap ? "#define USE_LIGHTMAP" : "", t.aoMap ? "#define USE_AOMAP" : "", t.bumpMap ? "#define USE_BUMPMAP" : "", t.normalMap ? "#define USE_NORMALMAP" : "", t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "", t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "", t.displacementMap ? "#define USE_DISPLACEMENTMAP" : "", t.emissiveMap ? "#define USE_EMISSIVEMAP" : "", t.anisotropy ? "#define USE_ANISOTROPY" : "", t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "", t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "", t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "", t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "", t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "", t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "", t.specularMap ? "#define USE_SPECULARMAP" : "", t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "", t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "", t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "", t.metalnessMap ? "#define USE_METALNESSMAP" : "", t.alphaMap ? "#define USE_ALPHAMAP" : "", t.alphaHash ? "#define USE_ALPHAHASH" : "", t.transmission ? "#define USE_TRANSMISSION" : "", t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "", t.thicknessMap ? "#define USE_THICKNESSMAP" : "", t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "", t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "", t.mapUv ? "#define MAP_UV " + t.mapUv : "", t.alphaMapUv ? "#define ALPHAMAP_UV " + t.alphaMapUv : "", t.lightMapUv ? "#define LIGHTMAP_UV " + t.lightMapUv : "", t.aoMapUv ? "#define AOMAP_UV " + t.aoMapUv : "", t.emissiveMapUv ? "#define EMISSIVEMAP_UV " + t.emissiveMapUv : "", t.bumpMapUv ? "#define BUMPMAP_UV " + t.bumpMapUv : "", t.normalMapUv ? "#define NORMALMAP_UV " + t.normalMapUv : "", t.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + t.displacementMapUv : "", t.metalnessMapUv ? "#define METALNESSMAP_UV " + t.metalnessMapUv : "", t.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + t.roughnessMapUv : "", t.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + t.anisotropyMapUv : "", t.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + t.clearcoatMapUv : "", t.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + t.clearcoatNormalMapUv : "", t.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + t.clearcoatRoughnessMapUv : "", t.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + t.iridescenceMapUv : "", t.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + t.iridescenceThicknessMapUv : "", t.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + t.sheenColorMapUv : "", t.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + t.sheenRoughnessMapUv : "", t.specularMapUv ? "#define SPECULARMAP_UV " + t.specularMapUv : "", t.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + t.specularColorMapUv : "", t.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + t.specularIntensityMapUv : "", t.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + t.transmissionMapUv : "", t.thicknessMapUv ? "#define THICKNESSMAP_UV " + t.thicknessMapUv : "", t.vertexTangents && false === t.flatShading ? "#define USE_TANGENT" : "", t.vertexColors ? "#define USE_COLOR" : "", t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "", t.vertexUv1s ? "#define USE_UV1" : "", t.vertexUv2s ? "#define USE_UV2" : "", t.vertexUv3s ? "#define USE_UV3" : "", t.pointsUvs ? "#define USE_POINTS_UV" : "", t.flatShading ? "#define FLAT_SHADED" : "", t.skinning ? "#define USE_SKINNING" : "", t.morphTargets ? "#define USE_MORPHTARGETS" : "", t.morphNormals && false === t.flatShading ? "#define USE_MORPHNORMALS" : "", t.morphColors && t.isWebGL2 ? "#define USE_MORPHCOLORS" : "", t.morphTargetsCount > 0 && t.isWebGL2 ? "#define MORPHTARGETS_TEXTURE" : "", t.morphTargetsCount > 0 && t.isWebGL2 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + t.morphTextureStride : "", t.morphTargetsCount > 0 && t.isWebGL2 ? "#define MORPHTARGETS_COUNT " + t.morphTargetsCount : "", t.doubleSided ? "#define DOUBLE_SIDED" : "", t.flipSided ? "#define FLIP_SIDED" : "", t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", t.shadowMapEnabled ? "#define " + l : "", t.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "", t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "", t.useLegacyLights ? "#define LEGACY_LIGHTS" : "", t.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", t.logarithmicDepthBuffer && t.rendererExtensionFragDepth ? "#define USE_LOGDEPTHBUF_EXT" : "", "uniform mat4 modelMatrix;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat3 normalMatrix;", "uniform vec3 cameraPosition;", "uniform bool isOrthographic;", "#ifdef USE_INSTANCING", "	attribute mat4 instanceMatrix;", "#endif", "#ifdef USE_INSTANCING_COLOR", "	attribute vec3 instanceColor;", "#endif", "attribute vec3 position;", "attribute vec3 normal;", "attribute vec2 uv;", "#ifdef USE_UV1", "	attribute vec2 uv1;", "#endif", "#ifdef USE_UV2", "	attribute vec2 uv2;", "#endif", "#ifdef USE_UV3", "	attribute vec2 uv3;", "#endif", "#ifdef USE_TANGENT", "	attribute vec4 tangent;", "#endif", "#if defined( USE_COLOR_ALPHA )", "	attribute vec4 color;", "#elif defined( USE_COLOR )", "	attribute vec3 color;", "#endif", "#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )", "	attribute vec3 morphTarget0;", "	attribute vec3 morphTarget1;", "	attribute vec3 morphTarget2;", "	attribute vec3 morphTarget3;", "	#ifdef USE_MORPHNORMALS", "		attribute vec3 morphNormal0;", "		attribute vec3 morphNormal1;", "		attribute vec3 morphNormal2;", "		attribute vec3 morphNormal3;", "	#else", "		attribute vec3 morphTarget4;", "		attribute vec3 morphTarget5;", "		attribute vec3 morphTarget6;", "		attribute vec3 morphTarget7;", "	#endif", "#endif", "#ifdef USE_SKINNING", "	attribute vec4 skinIndex;", "	attribute vec4 skinWeight;", "#endif", "\n"].filter(hn).join("\n"), _ = [p, Jc(t), "#define SHADER_TYPE " + t.shaderType, "#define SHADER_NAME " + t.shaderName, v, t.useFog && t.fog ? "#define USE_FOG" : "", t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "", t.map ? "#define USE_MAP" : "", t.matcap ? "#define USE_MATCAP" : "", t.envMap ? "#define USE_ENVMAP" : "", t.envMap ? "#define " + c : "", t.envMap ? "#define " + h : "", t.envMap ? "#define " + u : "", d ? "#define CUBEUV_TEXEL_WIDTH " + d.texelWidth : "", d ? "#define CUBEUV_TEXEL_HEIGHT " + d.texelHeight : "", d ? "#define CUBEUV_MAX_MIP " + d.maxMip + ".0" : "", t.lightMap ? "#define USE_LIGHTMAP" : "", t.aoMap ? "#define USE_AOMAP" : "", t.bumpMap ? "#define USE_BUMPMAP" : "", t.normalMap ? "#define USE_NORMALMAP" : "", t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "", t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "", t.emissiveMap ? "#define USE_EMISSIVEMAP" : "", t.anisotropy ? "#define USE_ANISOTROPY" : "", t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "", t.clearcoat ? "#define USE_CLEARCOAT" : "", t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "", t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "", t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "", t.iridescence ? "#define USE_IRIDESCENCE" : "", t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "", t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "", t.specularMap ? "#define USE_SPECULARMAP" : "", t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "", t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "", t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "", t.metalnessMap ? "#define USE_METALNESSMAP" : "", t.alphaMap ? "#define USE_ALPHAMAP" : "", t.alphaTest ? "#define USE_ALPHATEST" : "", t.alphaHash ? "#define USE_ALPHAHASH" : "", t.sheen ? "#define USE_SHEEN" : "", t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "", t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "", t.transmission ? "#define USE_TRANSMISSION" : "", t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "", t.thicknessMap ? "#define USE_THICKNESSMAP" : "", t.vertexTangents && false === t.flatShading ? "#define USE_TANGENT" : "", t.vertexColors || t.instancingColor ? "#define USE_COLOR" : "", t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "", t.vertexUv1s ? "#define USE_UV1" : "", t.vertexUv2s ? "#define USE_UV2" : "", t.vertexUv3s ? "#define USE_UV3" : "", t.pointsUvs ? "#define USE_POINTS_UV" : "", t.gradientMap ? "#define USE_GRADIENTMAP" : "", t.flatShading ? "#define FLAT_SHADED" : "", t.doubleSided ? "#define DOUBLE_SIDED" : "", t.flipSided ? "#define FLIP_SIDED" : "", t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", t.shadowMapEnabled ? "#define " + l : "", t.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "", t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "", t.useLegacyLights ? "#define LEGACY_LIGHTS" : "", t.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "", t.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", t.logarithmicDepthBuffer && t.rendererExtensionFragDepth ? "#define USE_LOGDEPTHBUF_EXT" : "", "uniform mat4 viewMatrix;", "uniform vec3 cameraPosition;", "uniform bool isOrthographic;", t.toneMapping !== gi ? "#define TONE_MAPPING" : "", t.toneMapping !== gi ? Se.tonemapping_pars_fragment : "", t.toneMapping !== gi ? Fd("toneMapping", t.toneMapping) : "", t.dithering ? "#define DITHERING" : "", t.opaque ? "#define OPAQUE" : "", Se.colorspace_pars_fragment, Od("linearToOutputTexel", t.outputColorSpace), t.useDepthPacking ? "#define DEPTH_PACKING " + t.depthPacking : "", "\n"].filter(hn).join("\n")), a = so(a), a = qc(a, t), a = Yc(a, t), o = so(o), o = qc(o, t), o = Yc(o, t), a = Zc(a), o = Zc(o), t.isWebGL2 && true !== t.isRawShaderMaterial && (g = "#version 300 es\n", y = [f, "precision mediump sampler2DArray;", "#define attribute in", "#define varying out", "#define texture2D texture"].join("\n") + "\n" + y, _ = ["precision mediump sampler2DArray;", "#define varying in", t.glslVersion === fc ? "" : "layout(location = 0) out highp vec4 pc_fragColor;", t.glslVersion === fc ? "" : "#define gl_FragColor pc_fragColor", "#define gl_FragDepthEXT gl_FragDepth", "#define texture2D texture", "#define textureCube texture", "#define texture2DProj textureProj", "#define texture2DLodEXT textureLod", "#define texture2DProjLodEXT textureProjLod", "#define textureCubeLodEXT textureLod", "#define texture2DGradEXT textureGrad", "#define texture2DProjGradEXT textureProjGrad", "#define textureCubeGradEXT textureGrad"].join("\n") + "\n" + _);
    const w = g + y + a, R = g + _ + o, T = Xc(n, n.VERTEX_SHADER, w), A = Xc(n, n.FRAGMENT_SHADER, R);
    function N(P) {
      if (r.debug.checkShaderErrors) {
        const W = n.getProgramInfoLog(m).trim(), j = n.getShaderInfoLog(T).trim(), oe = n.getShaderInfoLog(A).trim();
        let de = true, ne = true;
        if (false === n.getProgramParameter(m, n.LINK_STATUS)) if (de = false, "function" == typeof r.debug.onShaderError) r.debug.onShaderError(n, m, T, A);
        else {
          const te = jc(n, T, "vertex"), $ = jc(n, A, "fragment");
          console.error("THREE.WebGLProgram: Shader Error " + n.getError() + " - VALIDATE_STATUS " + n.getProgramParameter(m, n.VALIDATE_STATUS) + "\n\nProgram Info Log: " + W + "\n" + te + "\n" + $);
        }
        else "" !== W ? console.warn("THREE.WebGLProgram: Program Info Log:", W) : "" !== j && "" !== oe || (ne = false);
        ne && (P.diagnostics = { runnable: de, programLog: W, vertexShader: { log: j, prefix: y }, fragmentShader: { log: oe, prefix: _ } });
      }
      n.deleteShader(T), n.deleteShader(A), I = new mn(n, m), F = (function(W, j) {
        const oe = {}, de = W.getProgramParameter(j, W.ACTIVE_ATTRIBUTES);
        for (let ne = 0; ne < de; ne++) {
          const te = W.getActiveAttrib(j, ne), $ = te.name;
          let k = 1;
          te.type === W.FLOAT_MAT2 && (k = 2), te.type === W.FLOAT_MAT3 && (k = 3), te.type === W.FLOAT_MAT4 && (k = 4), oe[$] = { type: te.type, location: W.getAttribLocation(j, $), locationSize: k };
        }
        return oe;
      })(n, m);
    }
    let I, F;
    n.attachShader(m, T), n.attachShader(m, A), void 0 !== t.index0AttributeName ? n.bindAttribLocation(m, 0, t.index0AttributeName) : true === t.morphTargets && n.bindAttribLocation(m, 0, "position"), n.linkProgram(m), this.getUniforms = function() {
      return void 0 === I && N(this), I;
    }, this.getAttributes = function() {
      return void 0 === F && N(this), F;
    };
    let Z = false === t.rendererExtensionParallelShaderCompile;
    return this.isReady = function() {
      return false === Z && (Z = n.getProgramParameter(m, Ud)), Z;
    }, this.destroy = function() {
      i.releaseStatesOfProgram(this), n.deleteProgram(m), this.program = void 0;
    }, this.type = t.shaderType, this.name = t.shaderName, this.id = Nd++, this.cacheKey = e, this.usedTimes = 1, this.program = m, this.vertexShader = T, this.fragmentShader = A, this;
  }
  var Wd = 0;
  var ao = class {
    constructor() {
      this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
    }
    update(e) {
      const t = e.vertexShader, i = e.fragmentShader, n = this._getShaderStage(t), s = this._getShaderStage(i), a = this._getShaderCacheForMaterial(e);
      return false === a.has(n) && (a.add(n), n.usedTimes++), false === a.has(s) && (a.add(s), s.usedTimes++), this;
    }
    remove(e) {
      const t = this.materialCache.get(e);
      for (const i of t) i.usedTimes--, 0 === i.usedTimes && this.shaderCache.delete(i.code);
      return this.materialCache.delete(e), this;
    }
    getVertexShaderID(e) {
      return this._getShaderStage(e.vertexShader).id;
    }
    getFragmentShaderID(e) {
      return this._getShaderStage(e.fragmentShader).id;
    }
    dispose() {
      this.shaderCache.clear(), this.materialCache.clear();
    }
    _getShaderCacheForMaterial(e) {
      const t = this.materialCache;
      let i = t.get(e);
      return void 0 === i && (i = /* @__PURE__ */ new Set(), t.set(e, i)), i;
    }
    _getShaderStage(e) {
      const t = this.shaderCache;
      let i = t.get(e);
      return void 0 === i && (i = new oo(e), t.set(e, i)), i;
    }
  };
  var oo = class {
    constructor(e) {
      this.id = Wd++, this.code = e, this.usedTimes = 0;
    }
  };
  function Xd(r, e, t, i, n, s, a) {
    const o = new vs(), l = new ao(), c = [], h = n.isWebGL2, u = n.logarithmicDepthBuffer, d = n.vertexTextures;
    let p = n.precision;
    const f = { MeshDepthMaterial: "depth", MeshDistanceMaterial: "distanceRGBA", MeshNormalMaterial: "normal", MeshBasicMaterial: "basic", MeshLambertMaterial: "lambert", MeshPhongMaterial: "phong", MeshToonMaterial: "toon", MeshStandardMaterial: "physical", MeshPhysicalMaterial: "physical", MeshMatcapMaterial: "matcap", LineBasicMaterial: "basic", LineDashedMaterial: "dashed", PointsMaterial: "points", ShadowMaterial: "shadow", SpriteMaterial: "sprite" };
    function v(m) {
      return 0 === m ? "uv" : `uv${m}`;
    }
    return { getParameters: function(m, y, _, g, w) {
      const R = g.fog, T = w.geometry, A = m.isMeshStandardMaterial ? g.environment : null, N = (m.isMeshStandardMaterial ? t : e).get(m.envMap || A), I = N && N.mapping === Bs ? N.image.height : null, F = f[m.type];
      null !== m.precision && (p = n.getMaxPrecision(m.precision), p !== m.precision && console.warn("THREE.WebGLProgram.getParameters:", m.precision, "not supported, using", p, "instead."));
      const Z = T.morphAttributes.position || T.morphAttributes.normal || T.morphAttributes.color, P = void 0 !== Z ? Z.length : 0;
      let W, j, oe, de, ne = 0;
      if (void 0 !== T.morphAttributes.position && (ne = 1), void 0 !== T.morphAttributes.normal && (ne = 2), void 0 !== T.morphAttributes.color && (ne = 3), F) {
        const ot = Xt[F];
        W = ot.vertexShader, j = ot.fragmentShader;
      } else W = m.vertexShader, j = m.fragmentShader, l.update(m), oe = l.getVertexShaderID(m), de = l.getFragmentShaderID(m);
      const te = r.getRenderTarget(), $ = true === w.isInstancedMesh, k = true === w.isBatchedMesh, G = !!m.map, ce = !!m.matcap, S = !!N, b = !!m.aoMap, O = !!m.lightMap, J = !!m.bumpMap, L = !!m.normalMap, Y = !!m.displacementMap, D = !!m.emissiveMap, U = !!m.metalnessMap, B = !!m.roughnessMap, ie = m.anisotropy > 0, Q = m.clearcoat > 0, M = m.iridescence > 0, re = m.sheen > 0, H = m.transmission > 0, z = ie && !!m.anisotropyMap, se = Q && !!m.clearcoatMap, he = Q && !!m.clearcoatNormalMap, pe = Q && !!m.clearcoatRoughnessMap, fe = M && !!m.iridescenceMap, be = M && !!m.iridescenceThicknessMap, ge = re && !!m.sheenColorMap, ve = re && !!m.sheenRoughnessMap, Te = !!m.specularMap, nt = !!m.specularColorMap, _e = !!m.specularIntensityMap, Ne = H && !!m.transmissionMap, Pe = H && !!m.thicknessMap, yr = !!m.gradientMap, ji = !!m.alphaMap, xr = m.alphaTest > 0, St = !!m.alphaHash, yt = !!m.extensions, qi = !!T.attributes.uv1, q = !!T.attributes.uv2, Mr = !!T.attributes.uv3;
      let Wn = gi;
      return m.toneMapped && (null !== te && true !== te.isXRRenderTarget || (Wn = r.toneMapping)), { isWebGL2: h, shaderID: F, shaderType: m.type, shaderName: m.name, vertexShader: W, fragmentShader: j, defines: m.defines, customVertexShaderID: oe, customFragmentShaderID: de, isRawShaderMaterial: true === m.isRawShaderMaterial, glslVersion: m.glslVersion, precision: p, batching: k, instancing: $, instancingColor: $ && null !== w.instanceColor, supportsVertexTextures: d, outputColorSpace: null === te ? r.outputColorSpace : true === te.isXRRenderTarget ? te.texture.colorSpace : si, map: G, matcap: ce, envMap: S, envMapMode: S && N.mapping, envMapCubeUVHeight: I, aoMap: b, lightMap: O, bumpMap: J, normalMap: L, displacementMap: d && Y, emissiveMap: D, normalMapObjectSpace: L && 1 === m.normalMapType, normalMapTangentSpace: L && 0 === m.normalMapType, metalnessMap: U, roughnessMap: B, anisotropy: ie, anisotropyMap: z, clearcoat: Q, clearcoatMap: se, clearcoatNormalMap: he, clearcoatRoughnessMap: pe, iridescence: M, iridescenceMap: fe, iridescenceThicknessMap: be, sheen: re, sheenColorMap: ge, sheenRoughnessMap: ve, specularMap: Te, specularColorMap: nt, specularIntensityMap: _e, transmission: H, transmissionMap: Ne, thicknessMap: Pe, gradientMap: yr, opaque: false === m.transparent && 1 === m.blending, alphaMap: ji, alphaTest: xr, alphaHash: St, combine: m.combine, mapUv: G && v(m.map.channel), aoMapUv: b && v(m.aoMap.channel), lightMapUv: O && v(m.lightMap.channel), bumpMapUv: J && v(m.bumpMap.channel), normalMapUv: L && v(m.normalMap.channel), displacementMapUv: Y && v(m.displacementMap.channel), emissiveMapUv: D && v(m.emissiveMap.channel), metalnessMapUv: U && v(m.metalnessMap.channel), roughnessMapUv: B && v(m.roughnessMap.channel), anisotropyMapUv: z && v(m.anisotropyMap.channel), clearcoatMapUv: se && v(m.clearcoatMap.channel), clearcoatNormalMapUv: he && v(m.clearcoatNormalMap.channel), clearcoatRoughnessMapUv: pe && v(m.clearcoatRoughnessMap.channel), iridescenceMapUv: fe && v(m.iridescenceMap.channel), iridescenceThicknessMapUv: be && v(m.iridescenceThicknessMap.channel), sheenColorMapUv: ge && v(m.sheenColorMap.channel), sheenRoughnessMapUv: ve && v(m.sheenRoughnessMap.channel), specularMapUv: Te && v(m.specularMap.channel), specularColorMapUv: nt && v(m.specularColorMap.channel), specularIntensityMapUv: _e && v(m.specularIntensityMap.channel), transmissionMapUv: Ne && v(m.transmissionMap.channel), thicknessMapUv: Pe && v(m.thicknessMap.channel), alphaMapUv: ji && v(m.alphaMap.channel), vertexTangents: !!T.attributes.tangent && (L || ie), vertexColors: m.vertexColors, vertexAlphas: true === m.vertexColors && !!T.attributes.color && 4 === T.attributes.color.itemSize, vertexUv1s: qi, vertexUv2s: q, vertexUv3s: Mr, pointsUvs: true === w.isPoints && !!T.attributes.uv && (G || ji), fog: !!R, useFog: true === m.fog, fogExp2: R && R.isFogExp2, flatShading: true === m.flatShading, sizeAttenuation: true === m.sizeAttenuation, logarithmicDepthBuffer: u, skinning: true === w.isSkinnedMesh, morphTargets: void 0 !== T.morphAttributes.position, morphNormals: void 0 !== T.morphAttributes.normal, morphColors: void 0 !== T.morphAttributes.color, morphTargetsCount: P, morphTextureStride: ne, numDirLights: y.directional.length, numPointLights: y.point.length, numSpotLights: y.spot.length, numSpotLightMaps: y.spotLightMap.length, numRectAreaLights: y.rectArea.length, numHemiLights: y.hemi.length, numDirLightShadows: y.directionalShadowMap.length, numPointLightShadows: y.pointShadowMap.length, numSpotLightShadows: y.spotShadowMap.length, numSpotLightShadowsWithMaps: y.numSpotLightShadowsWithMaps, numLightProbes: y.numLightProbes, numClippingPlanes: a.numPlanes, numClipIntersection: a.numIntersection, dithering: m.dithering, shadowMapEnabled: r.shadowMap.enabled && _.length > 0, shadowMapType: r.shadowMap.type, toneMapping: Wn, useLegacyLights: r._useLegacyLights, decodeVideoTexture: G && true === m.map.isVideoTexture && ze.getTransfer(m.map.colorSpace) === We, premultipliedAlpha: m.premultipliedAlpha, doubleSided: 2 === m.side, flipSided: m.side === vt, useDepthPacking: m.depthPacking >= 0, depthPacking: m.depthPacking || 0, index0AttributeName: m.index0AttributeName, extensionDerivatives: yt && true === m.extensions.derivatives, extensionFragDepth: yt && true === m.extensions.fragDepth, extensionDrawBuffers: yt && true === m.extensions.drawBuffers, extensionShaderTextureLOD: yt && true === m.extensions.shaderTextureLOD, extensionClipCullDistance: yt && m.extensions.clipCullDistance && i.has("WEBGL_clip_cull_distance"), rendererExtensionFragDepth: h || i.has("EXT_frag_depth"), rendererExtensionDrawBuffers: h || i.has("WEBGL_draw_buffers"), rendererExtensionShaderTextureLod: h || i.has("EXT_shader_texture_lod"), rendererExtensionParallelShaderCompile: i.has("KHR_parallel_shader_compile"), customProgramCacheKey: m.customProgramCacheKey() };
    }, getProgramCacheKey: function(m) {
      const y = [];
      if (m.shaderID ? y.push(m.shaderID) : (y.push(m.customVertexShaderID), y.push(m.customFragmentShaderID)), void 0 !== m.defines) for (const _ in m.defines) y.push(_), y.push(m.defines[_]);
      return false === m.isRawShaderMaterial && (!(function(_, g) {
        _.push(g.precision), _.push(g.outputColorSpace), _.push(g.envMapMode), _.push(g.envMapCubeUVHeight), _.push(g.mapUv), _.push(g.alphaMapUv), _.push(g.lightMapUv), _.push(g.aoMapUv), _.push(g.bumpMapUv), _.push(g.normalMapUv), _.push(g.displacementMapUv), _.push(g.emissiveMapUv), _.push(g.metalnessMapUv), _.push(g.roughnessMapUv), _.push(g.anisotropyMapUv), _.push(g.clearcoatMapUv), _.push(g.clearcoatNormalMapUv), _.push(g.clearcoatRoughnessMapUv), _.push(g.iridescenceMapUv), _.push(g.iridescenceThicknessMapUv), _.push(g.sheenColorMapUv), _.push(g.sheenRoughnessMapUv), _.push(g.specularMapUv), _.push(g.specularColorMapUv), _.push(g.specularIntensityMapUv), _.push(g.transmissionMapUv), _.push(g.thicknessMapUv), _.push(g.combine), _.push(g.fogExp2), _.push(g.sizeAttenuation), _.push(g.morphTargetsCount), _.push(g.morphAttributeCount), _.push(g.numDirLights), _.push(g.numPointLights), _.push(g.numSpotLights), _.push(g.numSpotLightMaps), _.push(g.numHemiLights), _.push(g.numRectAreaLights), _.push(g.numDirLightShadows), _.push(g.numPointLightShadows), _.push(g.numSpotLightShadows), _.push(g.numSpotLightShadowsWithMaps), _.push(g.numLightProbes), _.push(g.shadowMapType), _.push(g.toneMapping), _.push(g.numClippingPlanes), _.push(g.numClipIntersection), _.push(g.depthPacking);
      })(y, m), (function(_, g) {
        o.disableAll(), g.isWebGL2 && o.enable(0);
        g.supportsVertexTextures && o.enable(1);
        g.instancing && o.enable(2);
        g.instancingColor && o.enable(3);
        g.matcap && o.enable(4);
        g.envMap && o.enable(5);
        g.normalMapObjectSpace && o.enable(6);
        g.normalMapTangentSpace && o.enable(7);
        g.clearcoat && o.enable(8);
        g.iridescence && o.enable(9);
        g.alphaTest && o.enable(10);
        g.vertexColors && o.enable(11);
        g.vertexAlphas && o.enable(12);
        g.vertexUv1s && o.enable(13);
        g.vertexUv2s && o.enable(14);
        g.vertexUv3s && o.enable(15);
        g.vertexTangents && o.enable(16);
        g.anisotropy && o.enable(17);
        g.alphaHash && o.enable(18);
        g.batching && o.enable(19);
        _.push(o.mask), o.disableAll(), g.fog && o.enable(0);
        g.useFog && o.enable(1);
        g.flatShading && o.enable(2);
        g.logarithmicDepthBuffer && o.enable(3);
        g.skinning && o.enable(4);
        g.morphTargets && o.enable(5);
        g.morphNormals && o.enable(6);
        g.morphColors && o.enable(7);
        g.premultipliedAlpha && o.enable(8);
        g.shadowMapEnabled && o.enable(9);
        g.useLegacyLights && o.enable(10);
        g.doubleSided && o.enable(11);
        g.flipSided && o.enable(12);
        g.useDepthPacking && o.enable(13);
        g.dithering && o.enable(14);
        g.transmission && o.enable(15);
        g.sheen && o.enable(16);
        g.opaque && o.enable(17);
        g.pointsUvs && o.enable(18);
        g.decodeVideoTexture && o.enable(19);
        _.push(o.mask);
      })(y, m), y.push(r.outputColorSpace)), y.push(m.customProgramCacheKey), y.join();
    }, getUniforms: function(m) {
      const y = f[m.type];
      let _;
      if (y) {
        const g = Xt[y];
        _ = Cn.clone(g.uniforms);
      } else _ = m.uniforms;
      return _;
    }, acquireProgram: function(m, y) {
      let _;
      for (let g = 0, w = c.length; g < w; g++) {
        const R = c[g];
        if (R.cacheKey === y) {
          _ = R, ++_.usedTimes;
          break;
        }
      }
      return void 0 === _ && (_ = new Gd(r, y, m, s), c.push(_)), _;
    }, releaseProgram: function(m) {
      if (0 == --m.usedTimes) {
        const y = c.indexOf(m);
        c[y] = c[c.length - 1], c.pop(), m.destroy();
      }
    }, releaseShaderCache: function(m) {
      l.remove(m);
    }, programs: c, dispose: function() {
      l.dispose();
    } };
  }
  function jd() {
    let r = /* @__PURE__ */ new WeakMap();
    return { get: function(e) {
      let t = r.get(e);
      return void 0 === t && (t = {}, r.set(e, t)), t;
    }, remove: function(e) {
      r.delete(e);
    }, update: function(e, t, i) {
      r.get(e)[t] = i;
    }, dispose: function() {
      r = /* @__PURE__ */ new WeakMap();
    } };
  }
  function qd(r, e) {
    return r.groupOrder !== e.groupOrder ? r.groupOrder - e.groupOrder : r.renderOrder !== e.renderOrder ? r.renderOrder - e.renderOrder : r.material.id !== e.material.id ? r.material.id - e.material.id : r.z !== e.z ? r.z - e.z : r.id - e.id;
  }
  function Kc(r, e) {
    return r.groupOrder !== e.groupOrder ? r.groupOrder - e.groupOrder : r.renderOrder !== e.renderOrder ? r.renderOrder - e.renderOrder : r.z !== e.z ? e.z - r.z : r.id - e.id;
  }
  function $c() {
    const r = [];
    let e = 0;
    const t = [], i = [], n = [];
    function s(a, o, l, c, h, u) {
      let d = r[e];
      return void 0 === d ? (d = { id: a.id, object: a, geometry: o, material: l, groupOrder: c, renderOrder: a.renderOrder, z: h, group: u }, r[e] = d) : (d.id = a.id, d.object = a, d.geometry = o, d.material = l, d.groupOrder = c, d.renderOrder = a.renderOrder, d.z = h, d.group = u), e++, d;
    }
    return { opaque: t, transmissive: i, transparent: n, init: function() {
      e = 0, t.length = 0, i.length = 0, n.length = 0;
    }, push: function(a, o, l, c, h, u) {
      const d = s(a, o, l, c, h, u);
      l.transmission > 0 ? i.push(d) : true === l.transparent ? n.push(d) : t.push(d);
    }, unshift: function(a, o, l, c, h, u) {
      const d = s(a, o, l, c, h, u);
      l.transmission > 0 ? i.unshift(d) : true === l.transparent ? n.unshift(d) : t.unshift(d);
    }, finish: function() {
      for (let a = e, o = r.length; a < o; a++) {
        const l = r[a];
        if (null === l.id) break;
        l.id = null, l.object = null, l.geometry = null, l.material = null, l.group = null;
      }
    }, sort: function(a, o) {
      t.length > 1 && t.sort(a || qd), i.length > 1 && i.sort(o || Kc), n.length > 1 && n.sort(o || Kc);
    } };
  }
  function Yd() {
    let r = /* @__PURE__ */ new WeakMap();
    return { get: function(e, t) {
      const i = r.get(e);
      let n;
      return void 0 === i ? (n = new $c(), r.set(e, [n])) : t >= i.length ? (n = new $c(), i.push(n)) : n = i[t], n;
    }, dispose: function() {
      r = /* @__PURE__ */ new WeakMap();
    } };
  }
  function Zd() {
    const r = {};
    return { get: function(e) {
      if (void 0 !== r[e.id]) return r[e.id];
      let t;
      switch (e.type) {
        case "DirectionalLight":
          t = { direction: new E(), color: new x() };
          break;
        case "SpotLight":
          t = { position: new E(), direction: new E(), color: new x(), distance: 0, coneCos: 0, penumbraCos: 0, decay: 0 };
          break;
        case "PointLight":
          t = { position: new E(), color: new x(), distance: 0, decay: 0 };
          break;
        case "HemisphereLight":
          t = { direction: new E(), skyColor: new x(), groundColor: new x() };
          break;
        case "RectAreaLight":
          t = { color: new x(), position: new E(), halfWidth: new E(), halfHeight: new E() };
      }
      return r[e.id] = t, t;
    } };
  }
  var Jd = 0;
  function Kd(r, e) {
    return (e.castShadow ? 2 : 0) - (r.castShadow ? 2 : 0) + (e.map ? 1 : 0) - (r.map ? 1 : 0);
  }
  function $d(r, e) {
    const t = new Zd(), i = /* @__PURE__ */ (function() {
      const l = {};
      return { get: function(c) {
        if (void 0 !== l[c.id]) return l[c.id];
        let h;
        switch (c.type) {
          case "DirectionalLight":
          case "SpotLight":
            h = { shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new X() };
            break;
          case "PointLight":
            h = { shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new X(), shadowCameraNear: 1, shadowCameraFar: 1e3 };
        }
        return l[c.id] = h, h;
      } };
    })(), n = { version: 0, hash: { directionalLength: -1, pointLength: -1, spotLength: -1, rectAreaLength: -1, hemiLength: -1, numDirectionalShadows: -1, numPointShadows: -1, numSpotShadows: -1, numSpotMaps: -1, numLightProbes: -1 }, ambient: [0, 0, 0], probe: [], directional: [], directionalShadow: [], directionalShadowMap: [], directionalShadowMatrix: [], spot: [], spotLightMap: [], spotShadow: [], spotShadowMap: [], spotLightMatrix: [], rectArea: [], rectAreaLTC1: null, rectAreaLTC2: null, point: [], pointShadow: [], pointShadowMap: [], pointShadowMatrix: [], hemi: [], numSpotLightShadowsWithMaps: 0, numLightProbes: 0 };
    for (let l = 0; l < 9; l++) n.probe.push(new E());
    const s = new E(), a = new we(), o = new we();
    return { setup: function(l, c) {
      let h = 0, u = 0, d = 0;
      for (let F = 0; F < 9; F++) n.probe[F].set(0, 0, 0);
      let p = 0, f = 0, v = 0, m = 0, y = 0, _ = 0, g = 0, w = 0, R = 0, T = 0, A = 0;
      l.sort(Kd);
      const N = true === c ? Math.PI : 1;
      for (let F = 0, Z = l.length; F < Z; F++) {
        const P = l[F], W = P.color, j = P.intensity, oe = P.distance, de = P.shadow && P.shadow.map ? P.shadow.map.texture : null;
        if (P.isAmbientLight) h += W.r * j * N, u += W.g * j * N, d += W.b * j * N;
        else if (P.isLightProbe) {
          for (let ne = 0; ne < 9; ne++) n.probe[ne].addScaledVector(P.sh.coefficients[ne], j);
          A++;
        } else if (P.isDirectionalLight) {
          const ne = t.get(P);
          if (ne.color.copy(P.color).multiplyScalar(P.intensity * N), P.castShadow) {
            const te = P.shadow, $ = i.get(P);
            $.shadowBias = te.bias, $.shadowNormalBias = te.normalBias, $.shadowRadius = te.radius, $.shadowMapSize = te.mapSize, n.directionalShadow[p] = $, n.directionalShadowMap[p] = de, n.directionalShadowMatrix[p] = P.shadow.matrix, _++;
          }
          n.directional[p] = ne, p++;
        } else if (P.isSpotLight) {
          const ne = t.get(P);
          ne.position.setFromMatrixPosition(P.matrixWorld), ne.color.copy(W).multiplyScalar(j * N), ne.distance = oe, ne.coneCos = Math.cos(P.angle), ne.penumbraCos = Math.cos(P.angle * (1 - P.penumbra)), ne.decay = P.decay, n.spot[v] = ne;
          const te = P.shadow;
          if (P.map && (n.spotLightMap[R] = P.map, R++, te.updateMatrices(P), P.castShadow && T++), n.spotLightMatrix[v] = te.matrix, P.castShadow) {
            const $ = i.get(P);
            $.shadowBias = te.bias, $.shadowNormalBias = te.normalBias, $.shadowRadius = te.radius, $.shadowMapSize = te.mapSize, n.spotShadow[v] = $, n.spotShadowMap[v] = de, w++;
          }
          v++;
        } else if (P.isRectAreaLight) {
          const ne = t.get(P);
          ne.color.copy(W).multiplyScalar(j), ne.halfWidth.set(0.5 * P.width, 0, 0), ne.halfHeight.set(0, 0.5 * P.height, 0), n.rectArea[m] = ne, m++;
        } else if (P.isPointLight) {
          const ne = t.get(P);
          if (ne.color.copy(P.color).multiplyScalar(P.intensity * N), ne.distance = P.distance, ne.decay = P.decay, P.castShadow) {
            const te = P.shadow, $ = i.get(P);
            $.shadowBias = te.bias, $.shadowNormalBias = te.normalBias, $.shadowRadius = te.radius, $.shadowMapSize = te.mapSize, $.shadowCameraNear = te.camera.near, $.shadowCameraFar = te.camera.far, n.pointShadow[f] = $, n.pointShadowMap[f] = de, n.pointShadowMatrix[f] = P.shadow.matrix, g++;
          }
          n.point[f] = ne, f++;
        } else if (P.isHemisphereLight) {
          const ne = t.get(P);
          ne.skyColor.copy(P.color).multiplyScalar(j * N), ne.groundColor.copy(P.groundColor).multiplyScalar(j * N), n.hemi[y] = ne, y++;
        }
      }
      m > 0 && (e.isWebGL2 ? true === r.has("OES_texture_float_linear") ? (n.rectAreaLTC1 = le.LTC_FLOAT_1, n.rectAreaLTC2 = le.LTC_FLOAT_2) : (n.rectAreaLTC1 = le.LTC_HALF_1, n.rectAreaLTC2 = le.LTC_HALF_2) : true === r.has("OES_texture_float_linear") ? (n.rectAreaLTC1 = le.LTC_FLOAT_1, n.rectAreaLTC2 = le.LTC_FLOAT_2) : true === r.has("OES_texture_half_float_linear") ? (n.rectAreaLTC1 = le.LTC_HALF_1, n.rectAreaLTC2 = le.LTC_HALF_2) : console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")), n.ambient[0] = h, n.ambient[1] = u, n.ambient[2] = d;
      const I = n.hash;
      I.directionalLength === p && I.pointLength === f && I.spotLength === v && I.rectAreaLength === m && I.hemiLength === y && I.numDirectionalShadows === _ && I.numPointShadows === g && I.numSpotShadows === w && I.numSpotMaps === R && I.numLightProbes === A || (n.directional.length = p, n.spot.length = v, n.rectArea.length = m, n.point.length = f, n.hemi.length = y, n.directionalShadow.length = _, n.directionalShadowMap.length = _, n.pointShadow.length = g, n.pointShadowMap.length = g, n.spotShadow.length = w, n.spotShadowMap.length = w, n.directionalShadowMatrix.length = _, n.pointShadowMatrix.length = g, n.spotLightMatrix.length = w + R - T, n.spotLightMap.length = R, n.numSpotLightShadowsWithMaps = T, n.numLightProbes = A, I.directionalLength = p, I.pointLength = f, I.spotLength = v, I.rectAreaLength = m, I.hemiLength = y, I.numDirectionalShadows = _, I.numPointShadows = g, I.numSpotShadows = w, I.numSpotMaps = R, I.numLightProbes = A, n.version = Jd++);
    }, setupView: function(l, c) {
      let h = 0, u = 0, d = 0, p = 0, f = 0;
      const v = c.matrixWorldInverse;
      for (let m = 0, y = l.length; m < y; m++) {
        const _ = l[m];
        if (_.isDirectionalLight) {
          const g = n.directional[h];
          g.direction.setFromMatrixPosition(_.matrixWorld), s.setFromMatrixPosition(_.target.matrixWorld), g.direction.sub(s), g.direction.transformDirection(v), h++;
        } else if (_.isSpotLight) {
          const g = n.spot[d];
          g.position.setFromMatrixPosition(_.matrixWorld), g.position.applyMatrix4(v), g.direction.setFromMatrixPosition(_.matrixWorld), s.setFromMatrixPosition(_.target.matrixWorld), g.direction.sub(s), g.direction.transformDirection(v), d++;
        } else if (_.isRectAreaLight) {
          const g = n.rectArea[p];
          g.position.setFromMatrixPosition(_.matrixWorld), g.position.applyMatrix4(v), o.identity(), a.copy(_.matrixWorld), a.premultiply(v), o.extractRotation(a), g.halfWidth.set(0.5 * _.width, 0, 0), g.halfHeight.set(0, 0.5 * _.height, 0), g.halfWidth.applyMatrix4(o), g.halfHeight.applyMatrix4(o), p++;
        } else if (_.isPointLight) {
          const g = n.point[u];
          g.position.setFromMatrixPosition(_.matrixWorld), g.position.applyMatrix4(v), u++;
        } else if (_.isHemisphereLight) {
          const g = n.hemi[f];
          g.direction.setFromMatrixPosition(_.matrixWorld), g.direction.transformDirection(v), f++;
        }
      }
    }, state: n };
  }
  function Qc(r, e) {
    const t = new $d(r, e), i = [], n = [];
    return { init: function() {
      i.length = 0, n.length = 0;
    }, state: { lightsArray: i, shadowsArray: n, lights: t }, setupLights: function(s) {
      t.setup(i, s);
    }, setupLightsView: function(s) {
      t.setupView(i, s);
    }, pushLight: function(s) {
      i.push(s);
    }, pushShadow: function(s) {
      n.push(s);
    } };
  }
  function Qd(r, e) {
    let t = /* @__PURE__ */ new WeakMap();
    return { get: function(i, n = 0) {
      const s = t.get(i);
      let a;
      return void 0 === s ? (a = new Qc(r, e), t.set(i, [a])) : n >= s.length ? (a = new Qc(r, e), s.push(a)) : a = s[n], a;
    }, dispose: function() {
      t = /* @__PURE__ */ new WeakMap();
    } };
  }
  var lo = class extends ai {
    constructor(e) {
      super(), this.isMeshDepthMaterial = true, this.type = "MeshDepthMaterial", this.depthPacking = 3200, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = false, this.wireframeLinewidth = 1, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.depthPacking = e.depthPacking, this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this;
    }
  };
  var co = class extends ai {
    constructor(e) {
      super(), this.isMeshDistanceMaterial = true, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this;
    }
  };
  function ep(r, e, t) {
    let i = new bn();
    const n = new X(), s = new X(), a = new Ge(), o = new lo({ depthPacking: 3201 }), l = new co(), c = {}, h = t.maxTextureSize, u = { [_i]: vt, [vt]: _i, 2: 2 }, d = new Ee({ defines: { VSM_SAMPLES: 8 }, uniforms: { shadow_pass: { value: null }, resolution: { value: new X() }, radius: { value: 4 } }, vertexShader: "void main() {\n	gl_Position = vec4( position, 1.0 );\n}", fragmentShader: "uniform sampler2D shadow_pass;\nuniform vec2 resolution;\nuniform float radius;\n#include <packing>\nvoid main() {\n	const float samples = float( VSM_SAMPLES );\n	float mean = 0.0;\n	float squared_mean = 0.0;\n	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );\n	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;\n	for ( float i = 0.0; i < samples; i ++ ) {\n		float uvOffset = uvStart + i * uvStride;\n		#ifdef HORIZONTAL_PASS\n			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );\n			mean += distribution.x;\n			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;\n		#else\n			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );\n			mean += depth;\n			squared_mean += depth * depth;\n		#endif\n	}\n	mean = mean / samples;\n	squared_mean = squared_mean / samples;\n	float std_dev = sqrt( squared_mean - mean * mean );\n	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );\n}" }), p = d.clone();
    p.defines.HORIZONTAL_PASS = 1;
    const f = new Be();
    f.setAttribute("position", new ke(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3));
    const v = new De(f, d), m = this;
    this.enabled = false, this.autoUpdate = true, this.needsUpdate = false, this.type = vh;
    let y = this.type;
    function _(T, A) {
      const N = e.update(v);
      d.defines.VSM_SAMPLES !== T.blurSamples && (d.defines.VSM_SAMPLES = T.blurSamples, p.defines.VSM_SAMPLES = T.blurSamples, d.needsUpdate = true, p.needsUpdate = true), null === T.mapPass && (T.mapPass = new at(n.x, n.y)), d.uniforms.shadow_pass.value = T.map.texture, d.uniforms.resolution.value = T.mapSize, d.uniforms.radius.value = T.radius, r.setRenderTarget(T.mapPass), r.clear(), r.renderBufferDirect(A, null, N, d, v, null), p.uniforms.shadow_pass.value = T.mapPass.texture, p.uniforms.resolution.value = T.mapSize, p.uniforms.radius.value = T.radius, r.setRenderTarget(T.map), r.clear(), r.renderBufferDirect(A, null, N, p, v, null);
    }
    function g(T, A, N, I) {
      let F = null;
      const Z = true === N.isPointLight ? T.customDistanceMaterial : T.customDepthMaterial;
      if (void 0 !== Z) F = Z;
      else if (F = true === N.isPointLight ? l : o, r.localClippingEnabled && true === A.clipShadows && Array.isArray(A.clippingPlanes) && 0 !== A.clippingPlanes.length || A.displacementMap && 0 !== A.displacementScale || A.alphaMap && A.alphaTest > 0 || A.map && A.alphaTest > 0) {
        const P = F.uuid, W = A.uuid;
        let j = c[P];
        void 0 === j && (j = {}, c[P] = j);
        let oe = j[W];
        void 0 === oe && (oe = F.clone(), j[W] = oe, A.addEventListener("dispose", R)), F = oe;
      }
      if (F.visible = A.visible, F.wireframe = A.wireframe, F.side = I === ti ? null !== A.shadowSide ? A.shadowSide : A.side : null !== A.shadowSide ? A.shadowSide : u[A.side], F.alphaMap = A.alphaMap, F.alphaTest = A.alphaTest, F.map = A.map, F.clipShadows = A.clipShadows, F.clippingPlanes = A.clippingPlanes, F.clipIntersection = A.clipIntersection, F.displacementMap = A.displacementMap, F.displacementScale = A.displacementScale, F.displacementBias = A.displacementBias, F.wireframeLinewidth = A.wireframeLinewidth, F.linewidth = A.linewidth, true === N.isPointLight && true === F.isMeshDistanceMaterial) {
        r.properties.get(F).light = N;
      }
      return F;
    }
    function w(T, A, N, I, F) {
      if (false === T.visible) return;
      if (T.layers.test(A.layers) && (T.isMesh || T.isLine || T.isPoints) && (T.castShadow || T.receiveShadow && F === ti) && (!T.frustumCulled || i.intersectsObject(T))) {
        T.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse, T.matrixWorld);
        const P = e.update(T), W = T.material;
        if (Array.isArray(W)) {
          const j = P.groups;
          for (let oe = 0, de = j.length; oe < de; oe++) {
            const ne = j[oe], te = W[ne.materialIndex];
            if (te && te.visible) {
              const $ = g(T, te, I, F);
              T.onBeforeShadow(r, T, A, N, P, $, ne), r.renderBufferDirect(N, null, P, $, T, ne), T.onAfterShadow(r, T, A, N, P, $, ne);
            }
          }
        } else if (W.visible) {
          const j = g(T, W, I, F);
          T.onBeforeShadow(r, T, A, N, P, j, null), r.renderBufferDirect(N, null, P, j, T, null), T.onAfterShadow(r, T, A, N, P, j, null);
        }
      }
      const Z = T.children;
      for (let P = 0, W = Z.length; P < W; P++) w(Z[P], A, N, I, F);
    }
    function R(T) {
      T.target.removeEventListener("dispose", R);
      for (const A in c) {
        const N = c[A], I = T.target.uuid;
        if (I in N) {
          N[I].dispose(), delete N[I];
        }
      }
    }
    this.render = function(T, A, N) {
      if (false === m.enabled) return;
      if (false === m.autoUpdate && false === m.needsUpdate) return;
      if (0 === T.length) return;
      const I = r.getRenderTarget(), F = r.getActiveCubeFace(), Z = r.getActiveMipmapLevel(), P = r.state;
      P.setBlending(0), P.buffers.color.setClear(1, 1, 1, 1), P.buffers.depth.setTest(true), P.setScissorTest(false);
      const W = y !== ti && this.type === ti, j = y === ti && this.type !== ti;
      for (let oe = 0, de = T.length; oe < de; oe++) {
        const ne = T[oe], te = ne.shadow;
        if (void 0 === te) {
          console.warn("THREE.WebGLShadowMap:", ne, "has no shadow.");
          continue;
        }
        if (false === te.autoUpdate && false === te.needsUpdate) continue;
        n.copy(te.mapSize);
        const $ = te.getFrameExtents();
        if (n.multiply($), s.copy(te.mapSize), (n.x > h || n.y > h) && (n.x > h && (s.x = Math.floor(h / $.x), n.x = s.x * $.x, te.mapSize.x = s.x), n.y > h && (s.y = Math.floor(h / $.y), n.y = s.y * $.y, te.mapSize.y = s.y)), null === te.map || true === W || true === j) {
          const G = this.type !== ti ? { minFilter: pt, magFilter: pt } : {};
          null !== te.map && te.map.dispose(), te.map = new at(n.x, n.y, G), te.map.texture.name = ne.name + ".shadowMap", te.camera.updateProjectionMatrix();
        }
        r.setRenderTarget(te.map), r.clear();
        const k = te.getViewportCount();
        for (let G = 0; G < k; G++) {
          const ce = te.getViewport(G);
          a.set(s.x * ce.x, s.y * ce.y, s.x * ce.z, s.y * ce.w), P.viewport(a), te.updateMatrices(ne, G), i = te.getFrustum(), w(A, N, te.camera, ne, this.type);
        }
        true !== te.isPointLightShadow && this.type === ti && _(te, N), te.needsUpdate = false;
      }
      y = this.type, m.needsUpdate = false, r.setRenderTarget(I, F, Z);
    };
  }
  function tp(r, e, t) {
    const i = t.isWebGL2;
    const n = new function() {
      let M = false;
      const re = new Ge();
      let H = null;
      const z = new Ge(0, 0, 0, 0);
      return { setMask: function(se) {
        H === se || M || (r.colorMask(se, se, se, se), H = se);
      }, setLocked: function(se) {
        M = se;
      }, setClear: function(se, he, pe, fe, be) {
        true === be && (se *= fe, he *= fe, pe *= fe), re.set(se, he, pe, fe), false === z.equals(re) && (r.clearColor(se, he, pe, fe), z.copy(re));
      }, reset: function() {
        M = false, H = null, z.set(-1, 0, 0, 0);
      } };
    }(), s = new function() {
      let M = false, re = null, H = null, z = null;
      return { setTest: function(se) {
        se ? J(r.DEPTH_TEST) : L(r.DEPTH_TEST);
      }, setMask: function(se) {
        re === se || M || (r.depthMask(se), re = se);
      }, setFunc: function(se) {
        if (H !== se) {
          switch (se) {
            case 0:
              r.depthFunc(r.NEVER);
              break;
            case 1:
              r.depthFunc(r.ALWAYS);
              break;
            case 2:
              r.depthFunc(r.LESS);
              break;
            case 3:
            default:
              r.depthFunc(r.LEQUAL);
              break;
            case 4:
              r.depthFunc(r.EQUAL);
              break;
            case 5:
              r.depthFunc(r.GEQUAL);
              break;
            case 6:
              r.depthFunc(r.GREATER);
              break;
            case 7:
              r.depthFunc(r.NOTEQUAL);
          }
          H = se;
        }
      }, setLocked: function(se) {
        M = se;
      }, setClear: function(se) {
        z !== se && (r.clearDepth(se), z = se);
      }, reset: function() {
        M = false, re = null, H = null, z = null;
      } };
    }(), a = new function() {
      let M = false, re = null, H = null, z = null, se = null, he = null, pe = null, fe = null, be = null;
      return { setTest: function(ge) {
        M || (ge ? J(r.STENCIL_TEST) : L(r.STENCIL_TEST));
      }, setMask: function(ge) {
        re === ge || M || (r.stencilMask(ge), re = ge);
      }, setFunc: function(ge, ve, Te) {
        H === ge && z === ve && se === Te || (r.stencilFunc(ge, ve, Te), H = ge, z = ve, se = Te);
      }, setOp: function(ge, ve, Te) {
        he === ge && pe === ve && fe === Te || (r.stencilOp(ge, ve, Te), he = ge, pe = ve, fe = Te);
      }, setLocked: function(ge) {
        M = ge;
      }, setClear: function(ge) {
        be !== ge && (r.clearStencil(ge), be = ge);
      }, reset: function() {
        M = false, re = null, H = null, z = null, se = null, he = null, pe = null, fe = null, be = null;
      } };
    }(), o = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap();
    let c = {}, h = {}, u = /* @__PURE__ */ new WeakMap(), d = [], p = null, f = false, v = null, m = null, y = null, _ = null, g = null, w = null, R = null, T = new x(0, 0, 0), A = 0, N = false, I = null, F = null, Z = null, P = null, W = null;
    const j = r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    let oe = false, de = 0;
    const ne = r.getParameter(r.VERSION);
    -1 !== ne.indexOf("WebGL") ? (de = parseFloat(/^WebGL (\d)/.exec(ne)[1]), oe = de >= 1) : -1 !== ne.indexOf("OpenGL ES") && (de = parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]), oe = de >= 2);
    let te = null, $ = {};
    const k = r.getParameter(r.SCISSOR_BOX), G = r.getParameter(r.VIEWPORT), ce = new Ge().fromArray(k), S = new Ge().fromArray(G);
    function b(M, re, H, z) {
      const se = new Uint8Array(4), he = r.createTexture();
      r.bindTexture(M, he), r.texParameteri(M, r.TEXTURE_MIN_FILTER, r.NEAREST), r.texParameteri(M, r.TEXTURE_MAG_FILTER, r.NEAREST);
      for (let pe = 0; pe < H; pe++) !i || M !== r.TEXTURE_3D && M !== r.TEXTURE_2D_ARRAY ? r.texImage2D(re + pe, 0, r.RGBA, 1, 1, 0, r.RGBA, r.UNSIGNED_BYTE, se) : r.texImage3D(re, 0, r.RGBA, 1, 1, z, 0, r.RGBA, r.UNSIGNED_BYTE, se);
      return he;
    }
    const O = {};
    function J(M) {
      true !== c[M] && (r.enable(M), c[M] = true);
    }
    function L(M) {
      false !== c[M] && (r.disable(M), c[M] = false);
    }
    O[r.TEXTURE_2D] = b(r.TEXTURE_2D, r.TEXTURE_2D, 1), O[r.TEXTURE_CUBE_MAP] = b(r.TEXTURE_CUBE_MAP, r.TEXTURE_CUBE_MAP_POSITIVE_X, 6), i && (O[r.TEXTURE_2D_ARRAY] = b(r.TEXTURE_2D_ARRAY, r.TEXTURE_2D_ARRAY, 1, 1), O[r.TEXTURE_3D] = b(r.TEXTURE_3D, r.TEXTURE_3D, 1, 1)), n.setClear(0, 0, 0, 1), s.setClear(1), a.setClear(0), J(r.DEPTH_TEST), s.setFunc(3), B(false), ie(1), J(r.CULL_FACE), U(0);
    const Y = { [Ui]: r.FUNC_ADD, 101: r.FUNC_SUBTRACT, 102: r.FUNC_REVERSE_SUBTRACT };
    if (i) Y[103] = r.MIN, Y[104] = r.MAX;
    else {
      const M = e.get("EXT_blend_minmax");
      null !== M && (Y[103] = M.MIN_EXT, Y[104] = M.MAX_EXT);
    }
    const D = { 200: r.ZERO, 201: r.ONE, 202: r.SRC_COLOR, [Ga]: r.SRC_ALPHA, 210: r.SRC_ALPHA_SATURATE, 208: r.DST_COLOR, 206: r.DST_ALPHA, 203: r.ONE_MINUS_SRC_COLOR, [Wa]: r.ONE_MINUS_SRC_ALPHA, 209: r.ONE_MINUS_DST_COLOR, 207: r.ONE_MINUS_DST_ALPHA, 211: r.CONSTANT_COLOR, 212: r.ONE_MINUS_CONSTANT_COLOR, 213: r.CONSTANT_ALPHA, 214: r.ONE_MINUS_CONSTANT_ALPHA };
    function U(M, re, H, z, se, he, pe, fe, be, ge) {
      if (0 !== M) {
        if (false === f && (J(r.BLEND), f = true), 5 === M) se = se || re, he = he || H, pe = pe || z, re === m && se === g || (r.blendEquationSeparate(Y[re], Y[se]), m = re, g = se), H === y && z === _ && he === w && pe === R || (r.blendFuncSeparate(D[H], D[z], D[he], D[pe]), y = H, _ = z, w = he, R = pe), false !== fe.equals(T) && be === A || (r.blendColor(fe.r, fe.g, fe.b, be), T.copy(fe), A = be), v = M, N = false;
        else if (M !== v || ge !== N) {
          if (m === Ui && g === Ui || (r.blendEquation(r.FUNC_ADD), m = Ui, g = Ui), ge) switch (M) {
            case 1:
              r.blendFuncSeparate(r.ONE, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA);
              break;
            case 2:
              r.blendFunc(r.ONE, r.ONE);
              break;
            case 3:
              r.blendFuncSeparate(r.ZERO, r.ONE_MINUS_SRC_COLOR, r.ZERO, r.ONE);
              break;
            case 4:
              r.blendFuncSeparate(r.ZERO, r.SRC_COLOR, r.ZERO, r.SRC_ALPHA);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", M);
          }
          else switch (M) {
            case 1:
              r.blendFuncSeparate(r.SRC_ALPHA, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA);
              break;
            case 2:
              r.blendFunc(r.SRC_ALPHA, r.ONE);
              break;
            case 3:
              r.blendFuncSeparate(r.ZERO, r.ONE_MINUS_SRC_COLOR, r.ZERO, r.ONE);
              break;
            case 4:
              r.blendFunc(r.ZERO, r.SRC_COLOR);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", M);
          }
          y = null, _ = null, w = null, R = null, T.set(0, 0, 0), A = 0, v = M, N = ge;
        }
      } else true === f && (L(r.BLEND), f = false);
    }
    function B(M) {
      I !== M && (M ? r.frontFace(r.CW) : r.frontFace(r.CCW), I = M);
    }
    function ie(M) {
      0 !== M ? (J(r.CULL_FACE), M !== F && (1 === M ? r.cullFace(r.BACK) : 2 === M ? r.cullFace(r.FRONT) : r.cullFace(r.FRONT_AND_BACK))) : L(r.CULL_FACE), F = M;
    }
    function Q(M, re, H) {
      M ? (J(r.POLYGON_OFFSET_FILL), P === re && W === H || (r.polygonOffset(re, H), P = re, W = H)) : L(r.POLYGON_OFFSET_FILL);
    }
    return { buffers: { color: n, depth: s, stencil: a }, enable: J, disable: L, bindFramebuffer: function(M, re) {
      return h[M] !== re && (r.bindFramebuffer(M, re), h[M] = re, i && (M === r.DRAW_FRAMEBUFFER && (h[r.FRAMEBUFFER] = re), M === r.FRAMEBUFFER && (h[r.DRAW_FRAMEBUFFER] = re)), true);
    }, drawBuffers: function(M, re) {
      let H = d, z = false;
      if (M) if (H = u.get(re), void 0 === H && (H = [], u.set(re, H)), M.isWebGLMultipleRenderTargets) {
        const se = M.texture;
        if (H.length !== se.length || H[0] !== r.COLOR_ATTACHMENT0) {
          for (let he = 0, pe = se.length; he < pe; he++) H[he] = r.COLOR_ATTACHMENT0 + he;
          H.length = se.length, z = true;
        }
      } else H[0] !== r.COLOR_ATTACHMENT0 && (H[0] = r.COLOR_ATTACHMENT0, z = true);
      else H[0] !== r.BACK && (H[0] = r.BACK, z = true);
      z && (t.isWebGL2 ? r.drawBuffers(H) : e.get("WEBGL_draw_buffers").drawBuffersWEBGL(H));
    }, useProgram: function(M) {
      return p !== M && (r.useProgram(M), p = M, true);
    }, setBlending: U, setMaterial: function(M, re) {
      2 === M.side ? L(r.CULL_FACE) : J(r.CULL_FACE);
      let H = M.side === vt;
      re && (H = !H), B(H), 1 === M.blending && false === M.transparent ? U(0) : U(M.blending, M.blendEquation, M.blendSrc, M.blendDst, M.blendEquationAlpha, M.blendSrcAlpha, M.blendDstAlpha, M.blendColor, M.blendAlpha, M.premultipliedAlpha), s.setFunc(M.depthFunc), s.setTest(M.depthTest), s.setMask(M.depthWrite), n.setMask(M.colorWrite);
      const z = M.stencilWrite;
      a.setTest(z), z && (a.setMask(M.stencilWriteMask), a.setFunc(M.stencilFunc, M.stencilRef, M.stencilFuncMask), a.setOp(M.stencilFail, M.stencilZFail, M.stencilZPass)), Q(M.polygonOffset, M.polygonOffsetFactor, M.polygonOffsetUnits), true === M.alphaToCoverage ? J(r.SAMPLE_ALPHA_TO_COVERAGE) : L(r.SAMPLE_ALPHA_TO_COVERAGE);
    }, setFlipSided: B, setCullFace: ie, setLineWidth: function(M) {
      M !== Z && (oe && r.lineWidth(M), Z = M);
    }, setPolygonOffset: Q, setScissorTest: function(M) {
      M ? J(r.SCISSOR_TEST) : L(r.SCISSOR_TEST);
    }, activeTexture: function(M) {
      void 0 === M && (M = r.TEXTURE0 + j - 1), te !== M && (r.activeTexture(M), te = M);
    }, bindTexture: function(M, re, H) {
      void 0 === H && (H = null === te ? r.TEXTURE0 + j - 1 : te);
      let z = $[H];
      void 0 === z && (z = { type: void 0, texture: void 0 }, $[H] = z), z.type === M && z.texture === re || (te !== H && (r.activeTexture(H), te = H), r.bindTexture(M, re || O[M]), z.type = M, z.texture = re);
    }, unbindTexture: function() {
      const M = $[te];
      void 0 !== M && void 0 !== M.type && (r.bindTexture(M.type, null), M.type = void 0, M.texture = void 0);
    }, compressedTexImage2D: function() {
      try {
        r.compressedTexImage2D.apply(r, arguments);
      } catch (M) {
        console.error("THREE.WebGLState:", M);
      }
    }, compressedTexImage3D: function() {
      try {
        r.compressedTexImage3D.apply(r, arguments);
      } catch (M) {
        console.error("THREE.WebGLState:", M);
      }
    }, texImage2D: function() {
      try {
        r.texImage2D.apply(r, arguments);
      } catch (M) {
        console.error("THREE.WebGLState:", M);
      }
    }, texImage3D: function() {
      try {
        r.texImage3D.apply(r, arguments);
      } catch (M) {
        console.error("THREE.WebGLState:", M);
      }
    }, updateUBOMapping: function(M, re) {
      let H = l.get(re);
      void 0 === H && (H = /* @__PURE__ */ new WeakMap(), l.set(re, H));
      let z = H.get(M);
      void 0 === z && (z = r.getUniformBlockIndex(re, M.name), H.set(M, z));
    }, uniformBlockBinding: function(M, re) {
      const H = l.get(re).get(M);
      o.get(re) !== H && (r.uniformBlockBinding(re, H, M.__bindingPointIndex), o.set(re, H));
    }, texStorage2D: function() {
      try {
        r.texStorage2D.apply(r, arguments);
      } catch (M) {
        console.error("THREE.WebGLState:", M);
      }
    }, texStorage3D: function() {
      try {
        r.texStorage3D.apply(r, arguments);
      } catch (M) {
        console.error("THREE.WebGLState:", M);
      }
    }, texSubImage2D: function() {
      try {
        r.texSubImage2D.apply(r, arguments);
      } catch (M) {
        console.error("THREE.WebGLState:", M);
      }
    }, texSubImage3D: function() {
      try {
        r.texSubImage3D.apply(r, arguments);
      } catch (M) {
        console.error("THREE.WebGLState:", M);
      }
    }, compressedTexSubImage2D: function() {
      try {
        r.compressedTexSubImage2D.apply(r, arguments);
      } catch (M) {
        console.error("THREE.WebGLState:", M);
      }
    }, compressedTexSubImage3D: function() {
      try {
        r.compressedTexSubImage3D.apply(r, arguments);
      } catch (M) {
        console.error("THREE.WebGLState:", M);
      }
    }, scissor: function(M) {
      false === ce.equals(M) && (r.scissor(M.x, M.y, M.z, M.w), ce.copy(M));
    }, viewport: function(M) {
      false === S.equals(M) && (r.viewport(M.x, M.y, M.z, M.w), S.copy(M));
    }, reset: function() {
      r.disable(r.BLEND), r.disable(r.CULL_FACE), r.disable(r.DEPTH_TEST), r.disable(r.POLYGON_OFFSET_FILL), r.disable(r.SCISSOR_TEST), r.disable(r.STENCIL_TEST), r.disable(r.SAMPLE_ALPHA_TO_COVERAGE), r.blendEquation(r.FUNC_ADD), r.blendFunc(r.ONE, r.ZERO), r.blendFuncSeparate(r.ONE, r.ZERO, r.ONE, r.ZERO), r.blendColor(0, 0, 0, 0), r.colorMask(true, true, true, true), r.clearColor(0, 0, 0, 0), r.depthMask(true), r.depthFunc(r.LESS), r.clearDepth(1), r.stencilMask(4294967295), r.stencilFunc(r.ALWAYS, 0, 4294967295), r.stencilOp(r.KEEP, r.KEEP, r.KEEP), r.clearStencil(0), r.cullFace(r.BACK), r.frontFace(r.CCW), r.polygonOffset(0, 0), r.activeTexture(r.TEXTURE0), r.bindFramebuffer(r.FRAMEBUFFER, null), true === i && (r.bindFramebuffer(r.DRAW_FRAMEBUFFER, null), r.bindFramebuffer(r.READ_FRAMEBUFFER, null)), r.useProgram(null), r.lineWidth(1), r.scissor(0, 0, r.canvas.width, r.canvas.height), r.viewport(0, 0, r.canvas.width, r.canvas.height), c = {}, te = null, $ = {}, h = {}, u = /* @__PURE__ */ new WeakMap(), d = [], p = null, f = false, v = null, m = null, y = null, _ = null, g = null, w = null, R = null, T = new x(0, 0, 0), A = 0, N = false, I = null, F = null, Z = null, P = null, W = null, ce.set(0, 0, r.canvas.width, r.canvas.height), S.set(0, 0, r.canvas.width, r.canvas.height), n.reset(), s.reset(), a.reset();
    } };
  }
  function ip(r, e, t, i, n, s, a) {
    const o = n.isWebGL2, l = e.has("WEBGL_multisampled_render_to_texture") ? e.get("WEBGL_multisampled_render_to_texture") : null, c = "undefined" != typeof navigator && /OculusBrowser/g.test(navigator.userAgent), h = /* @__PURE__ */ new WeakMap();
    let u;
    const d = /* @__PURE__ */ new WeakMap();
    let p = false;
    try {
      p = "undefined" != typeof OffscreenCanvas && null !== new OffscreenCanvas(1, 1).getContext("2d");
    } catch (S) {
    }
    function f(S, b) {
      return p ? new OffscreenCanvas(S, b) : ds("canvas");
    }
    function v(S, b, O, J) {
      let L = 1;
      if ((S.width > J || S.height > J) && (L = J / Math.max(S.width, S.height)), L < 1 || true === b) {
        if ("undefined" != typeof HTMLImageElement && S instanceof HTMLImageElement || "undefined" != typeof HTMLCanvasElement && S instanceof HTMLCanvasElement || "undefined" != typeof ImageBitmap && S instanceof ImageBitmap) {
          const Y = b ? Ka : Math.floor, D = Y(L * S.width), U = Y(L * S.height);
          void 0 === u && (u = f(D, U));
          const B = O ? f(D, U) : u;
          B.width = D, B.height = U;
          return B.getContext("2d").drawImage(S, 0, 0, D, U), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + S.width + "x" + S.height + ") to (" + D + "x" + U + ")."), B;
        }
        return "data" in S && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + S.width + "x" + S.height + ")."), S;
      }
      return S;
    }
    function m(S) {
      return gc(S.width) && gc(S.height);
    }
    function y(S, b) {
      return S.generateMipmaps && b && S.minFilter !== pt && S.minFilter !== gt;
    }
    function _(S) {
      r.generateMipmap(S);
    }
    function g(S, b, O, J, L = false) {
      if (false === o) return b;
      if (null !== S) {
        if (void 0 !== r[S]) return r[S];
        console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + S + "'");
      }
      let Y = b;
      if (b === r.RED && (O === r.FLOAT && (Y = r.R32F), O === r.HALF_FLOAT && (Y = r.R16F), O === r.UNSIGNED_BYTE && (Y = r.R8)), b === r.RED_INTEGER && (O === r.UNSIGNED_BYTE && (Y = r.R8UI), O === r.UNSIGNED_SHORT && (Y = r.R16UI), O === r.UNSIGNED_INT && (Y = r.R32UI), O === r.BYTE && (Y = r.R8I), O === r.SHORT && (Y = r.R16I), O === r.INT && (Y = r.R32I)), b === r.RG && (O === r.FLOAT && (Y = r.RG32F), O === r.HALF_FLOAT && (Y = r.RG16F), O === r.UNSIGNED_BYTE && (Y = r.RG8)), b === r.RGBA) {
        const D = L ? ls : ze.getTransfer(J);
        O === r.FLOAT && (Y = r.RGBA32F), O === r.HALF_FLOAT && (Y = r.RGBA16F), O === r.UNSIGNED_BYTE && (Y = D === We ? r.SRGB8_ALPHA8 : r.RGBA8), O === r.UNSIGNED_SHORT_4_4_4_4 && (Y = r.RGBA4), O === r.UNSIGNED_SHORT_5_5_5_1 && (Y = r.RGB5_A1);
      }
      return Y !== r.R16F && Y !== r.R32F && Y !== r.RG16F && Y !== r.RG32F && Y !== r.RGBA16F && Y !== r.RGBA32F || e.get("EXT_color_buffer_float"), Y;
    }
    function w(S, b, O) {
      return true === y(S, O) || S.isFramebufferTexture && S.minFilter !== pt && S.minFilter !== gt ? Math.log2(Math.max(b.width, b.height)) + 1 : void 0 !== S.mipmaps && S.mipmaps.length > 0 ? S.mipmaps.length : S.isCompressedTexture && Array.isArray(S.image) ? b.mipmaps.length : 1;
    }
    function R(S) {
      return S === pt || S === Hl || S === ra ? r.NEAREST : r.LINEAR;
    }
    function T(S) {
      const b = S.target;
      b.removeEventListener("dispose", T), (function(O) {
        const J = i.get(O);
        if (void 0 === J.__webglInit) return;
        const L = O.source, Y = d.get(L);
        if (Y) {
          const D = Y[J.__cacheKey];
          D.usedTimes--, 0 === D.usedTimes && N(O), 0 === Object.keys(Y).length && d.delete(L);
        }
        i.remove(O);
      })(b), b.isVideoTexture && h.delete(b);
    }
    function A(S) {
      const b = S.target;
      b.removeEventListener("dispose", A), (function(O) {
        const J = O.texture, L = i.get(O), Y = i.get(J);
        void 0 !== Y.__webglTexture && (r.deleteTexture(Y.__webglTexture), a.memory.textures--);
        O.depthTexture && O.depthTexture.dispose();
        if (O.isWebGLCubeRenderTarget) for (let D = 0; D < 6; D++) {
          if (Array.isArray(L.__webglFramebuffer[D])) for (let U = 0; U < L.__webglFramebuffer[D].length; U++) r.deleteFramebuffer(L.__webglFramebuffer[D][U]);
          else r.deleteFramebuffer(L.__webglFramebuffer[D]);
          L.__webglDepthbuffer && r.deleteRenderbuffer(L.__webglDepthbuffer[D]);
        }
        else {
          if (Array.isArray(L.__webglFramebuffer)) for (let D = 0; D < L.__webglFramebuffer.length; D++) r.deleteFramebuffer(L.__webglFramebuffer[D]);
          else r.deleteFramebuffer(L.__webglFramebuffer);
          if (L.__webglDepthbuffer && r.deleteRenderbuffer(L.__webglDepthbuffer), L.__webglMultisampledFramebuffer && r.deleteFramebuffer(L.__webglMultisampledFramebuffer), L.__webglColorRenderbuffer) for (let D = 0; D < L.__webglColorRenderbuffer.length; D++) L.__webglColorRenderbuffer[D] && r.deleteRenderbuffer(L.__webglColorRenderbuffer[D]);
          L.__webglDepthRenderbuffer && r.deleteRenderbuffer(L.__webglDepthRenderbuffer);
        }
        if (O.isWebGLMultipleRenderTargets) for (let D = 0, U = J.length; D < U; D++) {
          const B = i.get(J[D]);
          B.__webglTexture && (r.deleteTexture(B.__webglTexture), a.memory.textures--), i.remove(J[D]);
        }
        i.remove(J), i.remove(O);
      })(b);
    }
    function N(S) {
      const b = i.get(S);
      r.deleteTexture(b.__webglTexture);
      const O = S.source;
      delete d.get(O)[b.__cacheKey], a.memory.textures--;
    }
    let I = 0;
    function F(S, b) {
      const O = i.get(S);
      if (S.isVideoTexture && (function(J) {
        const L = a.render.frame;
        h.get(J) !== L && (h.set(J, L), J.update());
      })(S), false === S.isRenderTargetTexture && S.version > 0 && O.__version !== S.version) {
        const J = S.image;
        if (null === J) console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
        else {
          if (false !== J.complete) return void de(O, S, b);
          console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
        }
      }
      t.bindTexture(r.TEXTURE_2D, O.__webglTexture, r.TEXTURE0 + b);
    }
    const Z = { [qa]: r.REPEAT, [ni]: r.CLAMP_TO_EDGE, [Ya]: r.MIRRORED_REPEAT }, P = { [pt]: r.NEAREST, [Hl]: r.NEAREST_MIPMAP_NEAREST, [ra]: r.NEAREST_MIPMAP_LINEAR, [gt]: r.LINEAR, [mu]: r.LINEAR_MIPMAP_NEAREST, [ss]: r.LINEAR_MIPMAP_LINEAR }, W = { 512: r.NEVER, 519: r.ALWAYS, 513: r.LESS, 515: r.LEQUAL, 514: r.EQUAL, 518: r.GEQUAL, 516: r.GREATER, 517: r.NOTEQUAL };
    function j(S, b, O) {
      if (O ? (r.texParameteri(S, r.TEXTURE_WRAP_S, Z[b.wrapS]), r.texParameteri(S, r.TEXTURE_WRAP_T, Z[b.wrapT]), S !== r.TEXTURE_3D && S !== r.TEXTURE_2D_ARRAY || r.texParameteri(S, r.TEXTURE_WRAP_R, Z[b.wrapR]), r.texParameteri(S, r.TEXTURE_MAG_FILTER, P[b.magFilter]), r.texParameteri(S, r.TEXTURE_MIN_FILTER, P[b.minFilter])) : (r.texParameteri(S, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(S, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE), S !== r.TEXTURE_3D && S !== r.TEXTURE_2D_ARRAY || r.texParameteri(S, r.TEXTURE_WRAP_R, r.CLAMP_TO_EDGE), b.wrapS === ni && b.wrapT === ni || console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."), r.texParameteri(S, r.TEXTURE_MAG_FILTER, R(b.magFilter)), r.texParameteri(S, r.TEXTURE_MIN_FILTER, R(b.minFilter)), b.minFilter !== pt && b.minFilter !== gt && console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")), b.compareFunction && (r.texParameteri(S, r.TEXTURE_COMPARE_MODE, r.COMPARE_REF_TO_TEXTURE), r.texParameteri(S, r.TEXTURE_COMPARE_FUNC, W[b.compareFunction])), true === e.has("EXT_texture_filter_anisotropic")) {
        const J = e.get("EXT_texture_filter_anisotropic");
        if (b.magFilter === pt) return;
        if (b.minFilter !== ra && b.minFilter !== ss) return;
        if (b.type === Nt && false === e.has("OES_texture_float_linear")) return;
        if (false === o && b.type === ri && false === e.has("OES_texture_half_float_linear")) return;
        (b.anisotropy > 1 || i.get(b).__currentAnisotropy) && (r.texParameterf(S, J.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(b.anisotropy, n.getMaxAnisotropy())), i.get(b).__currentAnisotropy = b.anisotropy);
      }
    }
    function oe(S, b) {
      let O = false;
      void 0 === S.__webglInit && (S.__webglInit = true, b.addEventListener("dispose", T));
      const J = b.source;
      let L = d.get(J);
      void 0 === L && (L = {}, d.set(J, L));
      const Y = (function(D) {
        const U = [];
        return U.push(D.wrapS), U.push(D.wrapT), U.push(D.wrapR || 0), U.push(D.magFilter), U.push(D.minFilter), U.push(D.anisotropy), U.push(D.internalFormat), U.push(D.format), U.push(D.type), U.push(D.generateMipmaps), U.push(D.premultiplyAlpha), U.push(D.flipY), U.push(D.unpackAlignment), U.push(D.colorSpace), U.join();
      })(b);
      if (Y !== S.__cacheKey) {
        void 0 === L[Y] && (L[Y] = { texture: r.createTexture(), usedTimes: 0 }, a.memory.textures++, O = true), L[Y].usedTimes++;
        const D = L[S.__cacheKey];
        void 0 !== D && (L[S.__cacheKey].usedTimes--, 0 === D.usedTimes && N(b)), S.__cacheKey = Y, S.__webglTexture = L[Y].texture;
      }
      return O;
    }
    function de(S, b, O) {
      let J = r.TEXTURE_2D;
      (b.isDataArrayTexture || b.isCompressedArrayTexture) && (J = r.TEXTURE_2D_ARRAY), b.isData3DTexture && (J = r.TEXTURE_3D);
      const L = oe(S, b), Y = b.source;
      t.bindTexture(J, S.__webglTexture, r.TEXTURE0 + O);
      const D = i.get(Y);
      if (Y.version !== D.__version || true === L) {
        t.activeTexture(r.TEXTURE0 + O);
        const U = ze.getPrimaries(ze.workingColorSpace), B = b.colorSpace === jt ? null : ze.getPrimaries(b.colorSpace), ie = b.colorSpace === jt || U === B ? r.NONE : r.BROWSER_DEFAULT_WEBGL;
        r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, b.flipY), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, b.premultiplyAlpha), r.pixelStorei(r.UNPACK_ALIGNMENT, b.unpackAlignment), r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL, ie);
        const Q = (function(ve) {
          return !o && (ve.wrapS !== ni || ve.wrapT !== ni || ve.minFilter !== pt && ve.minFilter !== gt);
        })(b) && false === m(b.image);
        let M = v(b.image, Q, false, n.maxTextureSize);
        M = ce(b, M);
        const re = m(M) || o, H = s.convert(b.format, b.colorSpace);
        let z, se = s.convert(b.type), he = g(b.internalFormat, H, se, b.colorSpace, b.isVideoTexture);
        j(J, b, re);
        const pe = b.mipmaps, fe = o && true !== b.isVideoTexture && he !== Ah, be = void 0 === D.__version || true === L, ge = w(b, M, re);
        if (b.isDepthTexture) he = r.DEPTH_COMPONENT, o ? he = b.type === Nt ? r.DEPTH_COMPONENT32F : b.type === mi ? r.DEPTH_COMPONENT24 : b.type === Bi ? r.DEPTH24_STENCIL8 : r.DEPTH_COMPONENT16 : b.type === Nt && console.error("WebGLRenderer: Floating point depth texture requires WebGL2."), b.format === Hi && he === r.DEPTH_COMPONENT && b.type !== Ko && b.type !== mi && (console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."), b.type = mi, se = s.convert(b.type)), b.format === vn && he === r.DEPTH_COMPONENT && (he = r.DEPTH_STENCIL, b.type !== Bi && (console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."), b.type = Bi, se = s.convert(b.type))), be && (fe ? t.texStorage2D(r.TEXTURE_2D, 1, he, M.width, M.height) : t.texImage2D(r.TEXTURE_2D, 0, he, M.width, M.height, 0, H, se, null));
        else if (b.isDataTexture) if (pe.length > 0 && re) {
          fe && be && t.texStorage2D(r.TEXTURE_2D, ge, he, pe[0].width, pe[0].height);
          for (let ve = 0, Te = pe.length; ve < Te; ve++) z = pe[ve], fe ? t.texSubImage2D(r.TEXTURE_2D, ve, 0, 0, z.width, z.height, H, se, z.data) : t.texImage2D(r.TEXTURE_2D, ve, he, z.width, z.height, 0, H, se, z.data);
          b.generateMipmaps = false;
        } else fe ? (be && t.texStorage2D(r.TEXTURE_2D, ge, he, M.width, M.height), t.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, M.width, M.height, H, se, M.data)) : t.texImage2D(r.TEXTURE_2D, 0, he, M.width, M.height, 0, H, se, M.data);
        else if (b.isCompressedTexture) if (b.isCompressedArrayTexture) {
          fe && be && t.texStorage3D(r.TEXTURE_2D_ARRAY, ge, he, pe[0].width, pe[0].height, M.depth);
          for (let ve = 0, Te = pe.length; ve < Te; ve++) z = pe[ve], b.format !== bt ? null !== H ? fe ? t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY, ve, 0, 0, 0, z.width, z.height, M.depth, H, z.data, 0, 0) : t.compressedTexImage3D(r.TEXTURE_2D_ARRAY, ve, he, z.width, z.height, M.depth, 0, z.data, 0, 0) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : fe ? t.texSubImage3D(r.TEXTURE_2D_ARRAY, ve, 0, 0, 0, z.width, z.height, M.depth, H, se, z.data) : t.texImage3D(r.TEXTURE_2D_ARRAY, ve, he, z.width, z.height, M.depth, 0, H, se, z.data);
        } else {
          fe && be && t.texStorage2D(r.TEXTURE_2D, ge, he, pe[0].width, pe[0].height);
          for (let ve = 0, Te = pe.length; ve < Te; ve++) z = pe[ve], b.format !== bt ? null !== H ? fe ? t.compressedTexSubImage2D(r.TEXTURE_2D, ve, 0, 0, z.width, z.height, H, z.data) : t.compressedTexImage2D(r.TEXTURE_2D, ve, he, z.width, z.height, 0, z.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : fe ? t.texSubImage2D(r.TEXTURE_2D, ve, 0, 0, z.width, z.height, H, se, z.data) : t.texImage2D(r.TEXTURE_2D, ve, he, z.width, z.height, 0, H, se, z.data);
        }
        else if (b.isDataArrayTexture) fe ? (be && t.texStorage3D(r.TEXTURE_2D_ARRAY, ge, he, M.width, M.height, M.depth), t.texSubImage3D(r.TEXTURE_2D_ARRAY, 0, 0, 0, 0, M.width, M.height, M.depth, H, se, M.data)) : t.texImage3D(r.TEXTURE_2D_ARRAY, 0, he, M.width, M.height, M.depth, 0, H, se, M.data);
        else if (b.isData3DTexture) fe ? (be && t.texStorage3D(r.TEXTURE_3D, ge, he, M.width, M.height, M.depth), t.texSubImage3D(r.TEXTURE_3D, 0, 0, 0, 0, M.width, M.height, M.depth, H, se, M.data)) : t.texImage3D(r.TEXTURE_3D, 0, he, M.width, M.height, M.depth, 0, H, se, M.data);
        else if (b.isFramebufferTexture) {
          if (be) if (fe) t.texStorage2D(r.TEXTURE_2D, ge, he, M.width, M.height);
          else {
            let ve = M.width, Te = M.height;
            for (let nt = 0; nt < ge; nt++) t.texImage2D(r.TEXTURE_2D, nt, he, ve, Te, 0, H, se, null), ve >>= 1, Te >>= 1;
          }
        } else if (pe.length > 0 && re) {
          fe && be && t.texStorage2D(r.TEXTURE_2D, ge, he, pe[0].width, pe[0].height);
          for (let ve = 0, Te = pe.length; ve < Te; ve++) z = pe[ve], fe ? t.texSubImage2D(r.TEXTURE_2D, ve, 0, 0, H, se, z) : t.texImage2D(r.TEXTURE_2D, ve, he, H, se, z);
          b.generateMipmaps = false;
        } else fe ? (be && t.texStorage2D(r.TEXTURE_2D, ge, he, M.width, M.height), t.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, H, se, M)) : t.texImage2D(r.TEXTURE_2D, 0, he, H, se, M);
        y(b, re) && _(J), D.__version = Y.version, b.onUpdate && b.onUpdate(b);
      }
      S.__version = b.version;
    }
    function ne(S, b, O, J, L, Y) {
      const D = s.convert(O.format, O.colorSpace), U = s.convert(O.type), B = g(O.internalFormat, D, U, O.colorSpace);
      if (!i.get(b).__hasExternalTextures) {
        const ie = Math.max(1, b.width >> Y), Q = Math.max(1, b.height >> Y);
        L === r.TEXTURE_3D || L === r.TEXTURE_2D_ARRAY ? t.texImage3D(L, Y, B, ie, Q, b.depth, 0, D, U, null) : t.texImage2D(L, Y, B, ie, Q, 0, D, U, null);
      }
      t.bindFramebuffer(r.FRAMEBUFFER, S), G(b) ? l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER, J, L, i.get(O).__webglTexture, 0, k(b)) : (L === r.TEXTURE_2D || L >= r.TEXTURE_CUBE_MAP_POSITIVE_X && L <= r.TEXTURE_CUBE_MAP_NEGATIVE_Z) && r.framebufferTexture2D(r.FRAMEBUFFER, J, L, i.get(O).__webglTexture, Y), t.bindFramebuffer(r.FRAMEBUFFER, null);
    }
    function te(S, b, O) {
      if (r.bindRenderbuffer(r.RENDERBUFFER, S), b.depthBuffer && !b.stencilBuffer) {
        let J = true === o ? r.DEPTH_COMPONENT24 : r.DEPTH_COMPONENT16;
        if (O || G(b)) {
          const L = b.depthTexture;
          L && L.isDepthTexture && (L.type === Nt ? J = r.DEPTH_COMPONENT32F : L.type === mi && (J = r.DEPTH_COMPONENT24));
          const Y = k(b);
          G(b) ? l.renderbufferStorageMultisampleEXT(r.RENDERBUFFER, Y, J, b.width, b.height) : r.renderbufferStorageMultisample(r.RENDERBUFFER, Y, J, b.width, b.height);
        } else r.renderbufferStorage(r.RENDERBUFFER, J, b.width, b.height);
        r.framebufferRenderbuffer(r.FRAMEBUFFER, r.DEPTH_ATTACHMENT, r.RENDERBUFFER, S);
      } else if (b.depthBuffer && b.stencilBuffer) {
        const J = k(b);
        O && false === G(b) ? r.renderbufferStorageMultisample(r.RENDERBUFFER, J, r.DEPTH24_STENCIL8, b.width, b.height) : G(b) ? l.renderbufferStorageMultisampleEXT(r.RENDERBUFFER, J, r.DEPTH24_STENCIL8, b.width, b.height) : r.renderbufferStorage(r.RENDERBUFFER, r.DEPTH_STENCIL, b.width, b.height), r.framebufferRenderbuffer(r.FRAMEBUFFER, r.DEPTH_STENCIL_ATTACHMENT, r.RENDERBUFFER, S);
      } else {
        const J = true === b.isWebGLMultipleRenderTargets ? b.texture : [b.texture];
        for (let L = 0; L < J.length; L++) {
          const Y = J[L], D = s.convert(Y.format, Y.colorSpace), U = s.convert(Y.type), B = g(Y.internalFormat, D, U, Y.colorSpace), ie = k(b);
          O && false === G(b) ? r.renderbufferStorageMultisample(r.RENDERBUFFER, ie, B, b.width, b.height) : G(b) ? l.renderbufferStorageMultisampleEXT(r.RENDERBUFFER, ie, B, b.width, b.height) : r.renderbufferStorage(r.RENDERBUFFER, B, b.width, b.height);
        }
      }
      r.bindRenderbuffer(r.RENDERBUFFER, null);
    }
    function $(S) {
      const b = i.get(S), O = true === S.isWebGLCubeRenderTarget;
      if (S.depthTexture && !b.__autoAllocateDepthBuffer) {
        if (O) throw new Error("target.depthTexture not supported in Cube render targets");
        !(function(J, L) {
          if (L && L.isWebGLCubeRenderTarget) throw new Error("Depth Texture with cube render targets is not supported");
          if (t.bindFramebuffer(r.FRAMEBUFFER, J), !L.depthTexture || !L.depthTexture.isDepthTexture) throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
          i.get(L.depthTexture).__webglTexture && L.depthTexture.image.width === L.width && L.depthTexture.image.height === L.height || (L.depthTexture.image.width = L.width, L.depthTexture.image.height = L.height, L.depthTexture.needsUpdate = true), F(L.depthTexture, 0);
          const Y = i.get(L.depthTexture).__webglTexture, D = k(L);
          if (L.depthTexture.format === Hi) G(L) ? l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER, r.DEPTH_ATTACHMENT, r.TEXTURE_2D, Y, 0, D) : r.framebufferTexture2D(r.FRAMEBUFFER, r.DEPTH_ATTACHMENT, r.TEXTURE_2D, Y, 0);
          else {
            if (L.depthTexture.format !== vn) throw new Error("Unknown depthTexture format");
            G(L) ? l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER, r.DEPTH_STENCIL_ATTACHMENT, r.TEXTURE_2D, Y, 0, D) : r.framebufferTexture2D(r.FRAMEBUFFER, r.DEPTH_STENCIL_ATTACHMENT, r.TEXTURE_2D, Y, 0);
          }
        })(b.__webglFramebuffer, S);
      } else if (O) {
        b.__webglDepthbuffer = [];
        for (let J = 0; J < 6; J++) t.bindFramebuffer(r.FRAMEBUFFER, b.__webglFramebuffer[J]), b.__webglDepthbuffer[J] = r.createRenderbuffer(), te(b.__webglDepthbuffer[J], S, false);
      } else t.bindFramebuffer(r.FRAMEBUFFER, b.__webglFramebuffer), b.__webglDepthbuffer = r.createRenderbuffer(), te(b.__webglDepthbuffer, S, false);
      t.bindFramebuffer(r.FRAMEBUFFER, null);
    }
    function k(S) {
      return Math.min(n.maxSamples, S.samples);
    }
    function G(S) {
      const b = i.get(S);
      return o && S.samples > 0 && true === e.has("WEBGL_multisampled_render_to_texture") && false !== b.__useRenderToTexture;
    }
    function ce(S, b) {
      const O = S.colorSpace, J = S.format, L = S.type;
      return true === S.isCompressedTexture || true === S.isVideoTexture || S.format === Za || O !== si && O !== jt && (ze.getTransfer(O) === We ? false === o ? true === e.has("EXT_sRGB") && J === bt ? (S.format = Za, S.minFilter = gt, S.generateMipmaps = false) : b = ps.sRGBToLinear(b) : J === bt && L === Ot || console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", O)), b;
    }
    this.allocateTextureUnit = function() {
      const S = I;
      return S >= n.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + S + " texture units while this GPU supports only " + n.maxTextures), I += 1, S;
    }, this.resetTextureUnits = function() {
      I = 0;
    }, this.setTexture2D = F, this.setTexture2DArray = function(S, b) {
      const O = i.get(S);
      S.version > 0 && O.__version !== S.version ? de(O, S, b) : t.bindTexture(r.TEXTURE_2D_ARRAY, O.__webglTexture, r.TEXTURE0 + b);
    }, this.setTexture3D = function(S, b) {
      const O = i.get(S);
      S.version > 0 && O.__version !== S.version ? de(O, S, b) : t.bindTexture(r.TEXTURE_3D, O.__webglTexture, r.TEXTURE0 + b);
    }, this.setTextureCube = function(S, b) {
      const O = i.get(S);
      S.version > 0 && O.__version !== S.version ? (function(J, L, Y) {
        if (6 !== L.image.length) return;
        const D = oe(J, L), U = L.source;
        t.bindTexture(r.TEXTURE_CUBE_MAP, J.__webglTexture, r.TEXTURE0 + Y);
        const B = i.get(U);
        if (U.version !== B.__version || true === D) {
          t.activeTexture(r.TEXTURE0 + Y);
          const ie = ze.getPrimaries(ze.workingColorSpace), Q = L.colorSpace === jt ? null : ze.getPrimaries(L.colorSpace), M = L.colorSpace === jt || ie === Q ? r.NONE : r.BROWSER_DEFAULT_WEBGL;
          r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, L.flipY), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, L.premultiplyAlpha), r.pixelStorei(r.UNPACK_ALIGNMENT, L.unpackAlignment), r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL, M);
          const re = L.isCompressedTexture || L.image[0].isCompressedTexture, H = L.image[0] && L.image[0].isDataTexture, z = [];
          for (let _e = 0; _e < 6; _e++) z[_e] = re || H ? H ? L.image[_e].image : L.image[_e] : v(L.image[_e], false, true, n.maxCubemapSize), z[_e] = ce(L, z[_e]);
          const se = z[0], he = m(se) || o, pe = s.convert(L.format, L.colorSpace), fe = s.convert(L.type), be = g(L.internalFormat, pe, fe, L.colorSpace), ge = o && true !== L.isVideoTexture, ve = void 0 === B.__version || true === D;
          let Te, nt = w(L, se, he);
          if (j(r.TEXTURE_CUBE_MAP, L, he), re) {
            ge && ve && t.texStorage2D(r.TEXTURE_CUBE_MAP, nt, be, se.width, se.height);
            for (let _e = 0; _e < 6; _e++) {
              Te = z[_e].mipmaps;
              for (let Ne = 0; Ne < Te.length; Ne++) {
                const Pe = Te[Ne];
                L.format !== bt ? null !== pe ? ge ? t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + _e, Ne, 0, 0, Pe.width, Pe.height, pe, Pe.data) : t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + _e, Ne, be, Pe.width, Pe.height, 0, Pe.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : ge ? t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + _e, Ne, 0, 0, Pe.width, Pe.height, pe, fe, Pe.data) : t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + _e, Ne, be, Pe.width, Pe.height, 0, pe, fe, Pe.data);
              }
            }
          } else {
            Te = L.mipmaps, ge && ve && (Te.length > 0 && nt++, t.texStorage2D(r.TEXTURE_CUBE_MAP, nt, be, z[0].width, z[0].height));
            for (let _e = 0; _e < 6; _e++) if (H) {
              ge ? t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + _e, 0, 0, 0, z[_e].width, z[_e].height, pe, fe, z[_e].data) : t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + _e, 0, be, z[_e].width, z[_e].height, 0, pe, fe, z[_e].data);
              for (let Ne = 0; Ne < Te.length; Ne++) {
                const Pe = Te[Ne].image[_e].image;
                ge ? t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + _e, Ne + 1, 0, 0, Pe.width, Pe.height, pe, fe, Pe.data) : t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + _e, Ne + 1, be, Pe.width, Pe.height, 0, pe, fe, Pe.data);
              }
            } else {
              ge ? t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + _e, 0, 0, 0, pe, fe, z[_e]) : t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + _e, 0, be, pe, fe, z[_e]);
              for (let Ne = 0; Ne < Te.length; Ne++) {
                const Pe = Te[Ne];
                ge ? t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + _e, Ne + 1, 0, 0, pe, fe, Pe.image[_e]) : t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + _e, Ne + 1, be, pe, fe, Pe.image[_e]);
              }
            }
          }
          y(L, he) && _(r.TEXTURE_CUBE_MAP), B.__version = U.version, L.onUpdate && L.onUpdate(L);
        }
        J.__version = L.version;
      })(O, S, b) : t.bindTexture(r.TEXTURE_CUBE_MAP, O.__webglTexture, r.TEXTURE0 + b);
    }, this.rebindTextures = function(S, b, O) {
      const J = i.get(S);
      void 0 !== b && ne(J.__webglFramebuffer, S, S.texture, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, 0), void 0 !== O && $(S);
    }, this.setupRenderTarget = function(S) {
      const b = S.texture, O = i.get(S), J = i.get(b);
      S.addEventListener("dispose", A), true !== S.isWebGLMultipleRenderTargets && (void 0 === J.__webglTexture && (J.__webglTexture = r.createTexture()), J.__version = b.version, a.memory.textures++);
      const L = true === S.isWebGLCubeRenderTarget, Y = true === S.isWebGLMultipleRenderTargets, D = m(S) || o;
      if (L) {
        O.__webglFramebuffer = [];
        for (let U = 0; U < 6; U++) if (o && b.mipmaps && b.mipmaps.length > 0) {
          O.__webglFramebuffer[U] = [];
          for (let B = 0; B < b.mipmaps.length; B++) O.__webglFramebuffer[U][B] = r.createFramebuffer();
        } else O.__webglFramebuffer[U] = r.createFramebuffer();
      } else {
        if (o && b.mipmaps && b.mipmaps.length > 0) {
          O.__webglFramebuffer = [];
          for (let U = 0; U < b.mipmaps.length; U++) O.__webglFramebuffer[U] = r.createFramebuffer();
        } else O.__webglFramebuffer = r.createFramebuffer();
        if (Y) if (n.drawBuffers) {
          const U = S.texture;
          for (let B = 0, ie = U.length; B < ie; B++) {
            const Q = i.get(U[B]);
            void 0 === Q.__webglTexture && (Q.__webglTexture = r.createTexture(), a.memory.textures++);
          }
        } else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");
        if (o && S.samples > 0 && false === G(S)) {
          const U = Y ? b : [b];
          O.__webglMultisampledFramebuffer = r.createFramebuffer(), O.__webglColorRenderbuffer = [], t.bindFramebuffer(r.FRAMEBUFFER, O.__webglMultisampledFramebuffer);
          for (let B = 0; B < U.length; B++) {
            const ie = U[B];
            O.__webglColorRenderbuffer[B] = r.createRenderbuffer(), r.bindRenderbuffer(r.RENDERBUFFER, O.__webglColorRenderbuffer[B]);
            const Q = s.convert(ie.format, ie.colorSpace), M = s.convert(ie.type), re = g(ie.internalFormat, Q, M, ie.colorSpace, true === S.isXRRenderTarget), H = k(S);
            r.renderbufferStorageMultisample(r.RENDERBUFFER, H, re, S.width, S.height), r.framebufferRenderbuffer(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0 + B, r.RENDERBUFFER, O.__webglColorRenderbuffer[B]);
          }
          r.bindRenderbuffer(r.RENDERBUFFER, null), S.depthBuffer && (O.__webglDepthRenderbuffer = r.createRenderbuffer(), te(O.__webglDepthRenderbuffer, S, true)), t.bindFramebuffer(r.FRAMEBUFFER, null);
        }
      }
      if (L) {
        t.bindTexture(r.TEXTURE_CUBE_MAP, J.__webglTexture), j(r.TEXTURE_CUBE_MAP, b, D);
        for (let U = 0; U < 6; U++) if (o && b.mipmaps && b.mipmaps.length > 0) for (let B = 0; B < b.mipmaps.length; B++) ne(O.__webglFramebuffer[U][B], S, b, r.COLOR_ATTACHMENT0, r.TEXTURE_CUBE_MAP_POSITIVE_X + U, B);
        else ne(O.__webglFramebuffer[U], S, b, r.COLOR_ATTACHMENT0, r.TEXTURE_CUBE_MAP_POSITIVE_X + U, 0);
        y(b, D) && _(r.TEXTURE_CUBE_MAP), t.unbindTexture();
      } else if (Y) {
        const U = S.texture;
        for (let B = 0, ie = U.length; B < ie; B++) {
          const Q = U[B], M = i.get(Q);
          t.bindTexture(r.TEXTURE_2D, M.__webglTexture), j(r.TEXTURE_2D, Q, D), ne(O.__webglFramebuffer, S, Q, r.COLOR_ATTACHMENT0 + B, r.TEXTURE_2D, 0), y(Q, D) && _(r.TEXTURE_2D);
        }
        t.unbindTexture();
      } else {
        let U = r.TEXTURE_2D;
        if ((S.isWebGL3DRenderTarget || S.isWebGLArrayRenderTarget) && (o ? U = S.isWebGL3DRenderTarget ? r.TEXTURE_3D : r.TEXTURE_2D_ARRAY : console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")), t.bindTexture(U, J.__webglTexture), j(U, b, D), o && b.mipmaps && b.mipmaps.length > 0) for (let B = 0; B < b.mipmaps.length; B++) ne(O.__webglFramebuffer[B], S, b, r.COLOR_ATTACHMENT0, U, B);
        else ne(O.__webglFramebuffer, S, b, r.COLOR_ATTACHMENT0, U, 0);
        y(b, D) && _(U), t.unbindTexture();
      }
      S.depthBuffer && $(S);
    }, this.updateRenderTargetMipmap = function(S) {
      const b = m(S) || o, O = true === S.isWebGLMultipleRenderTargets ? S.texture : [S.texture];
      for (let J = 0, L = O.length; J < L; J++) {
        const Y = O[J];
        if (y(Y, b)) {
          const D = S.isWebGLCubeRenderTarget ? r.TEXTURE_CUBE_MAP : r.TEXTURE_2D, U = i.get(Y).__webglTexture;
          t.bindTexture(D, U), _(D), t.unbindTexture();
        }
      }
    }, this.updateMultisampleRenderTarget = function(S) {
      if (o && S.samples > 0 && false === G(S)) {
        const b = S.isWebGLMultipleRenderTargets ? S.texture : [S.texture], O = S.width, J = S.height;
        let L = r.COLOR_BUFFER_BIT;
        const Y = [], D = S.stencilBuffer ? r.DEPTH_STENCIL_ATTACHMENT : r.DEPTH_ATTACHMENT, U = i.get(S), B = true === S.isWebGLMultipleRenderTargets;
        if (B) for (let ie = 0; ie < b.length; ie++) t.bindFramebuffer(r.FRAMEBUFFER, U.__webglMultisampledFramebuffer), r.framebufferRenderbuffer(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0 + ie, r.RENDERBUFFER, null), t.bindFramebuffer(r.FRAMEBUFFER, U.__webglFramebuffer), r.framebufferTexture2D(r.DRAW_FRAMEBUFFER, r.COLOR_ATTACHMENT0 + ie, r.TEXTURE_2D, null, 0);
        t.bindFramebuffer(r.READ_FRAMEBUFFER, U.__webglMultisampledFramebuffer), t.bindFramebuffer(r.DRAW_FRAMEBUFFER, U.__webglFramebuffer);
        for (let ie = 0; ie < b.length; ie++) {
          Y.push(r.COLOR_ATTACHMENT0 + ie), S.depthBuffer && Y.push(D);
          const Q = void 0 !== U.__ignoreDepthValues && U.__ignoreDepthValues;
          if (false === Q && (S.depthBuffer && (L |= r.DEPTH_BUFFER_BIT), S.stencilBuffer && (L |= r.STENCIL_BUFFER_BIT)), B && r.framebufferRenderbuffer(r.READ_FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.RENDERBUFFER, U.__webglColorRenderbuffer[ie]), true === Q && (r.invalidateFramebuffer(r.READ_FRAMEBUFFER, [D]), r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER, [D])), B) {
            const M = i.get(b[ie]).__webglTexture;
            r.framebufferTexture2D(r.DRAW_FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, M, 0);
          }
          r.blitFramebuffer(0, 0, O, J, 0, 0, O, J, L, r.NEAREST), c && r.invalidateFramebuffer(r.READ_FRAMEBUFFER, Y);
        }
        if (t.bindFramebuffer(r.READ_FRAMEBUFFER, null), t.bindFramebuffer(r.DRAW_FRAMEBUFFER, null), B) for (let ie = 0; ie < b.length; ie++) {
          t.bindFramebuffer(r.FRAMEBUFFER, U.__webglMultisampledFramebuffer), r.framebufferRenderbuffer(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0 + ie, r.RENDERBUFFER, U.__webglColorRenderbuffer[ie]);
          const Q = i.get(b[ie]).__webglTexture;
          t.bindFramebuffer(r.FRAMEBUFFER, U.__webglFramebuffer), r.framebufferTexture2D(r.DRAW_FRAMEBUFFER, r.COLOR_ATTACHMENT0 + ie, r.TEXTURE_2D, Q, 0);
        }
        t.bindFramebuffer(r.DRAW_FRAMEBUFFER, U.__webglMultisampledFramebuffer);
      }
    }, this.setupDepthRenderbuffer = $, this.setupFrameBufferTexture = ne, this.useMultisampledRTT = G;
  }
  function np(r, e, t) {
    const i = t.isWebGL2;
    return { convert: function(n, s = "") {
      let a;
      const o = ze.getTransfer(s);
      if (n === Ot) return r.UNSIGNED_BYTE;
      if (n === Sh) return r.UNSIGNED_SHORT_4_4_4_4;
      if (n === Eh) return r.UNSIGNED_SHORT_5_5_5_1;
      if (1010 === n) return r.BYTE;
      if (1011 === n) return r.SHORT;
      if (n === Ko) return r.UNSIGNED_SHORT;
      if (n === bh) return r.INT;
      if (n === mi) return r.UNSIGNED_INT;
      if (n === Nt) return r.FLOAT;
      if (n === ri) return i ? r.HALF_FLOAT : (a = e.get("OES_texture_half_float"), null !== a ? a.HALF_FLOAT_OES : null);
      if (1021 === n) return r.ALPHA;
      if (n === bt) return r.RGBA;
      if (1024 === n) return r.LUMINANCE;
      if (1025 === n) return r.LUMINANCE_ALPHA;
      if (n === Hi) return r.DEPTH_COMPONENT;
      if (n === vn) return r.DEPTH_STENCIL;
      if (n === Za) return a = e.get("EXT_sRGB"), null !== a ? a.SRGB_ALPHA_EXT : null;
      if (1028 === n) return r.RED;
      if (n === Th) return r.RED_INTEGER;
      if (1030 === n) return r.RG;
      if (n === wh) return r.RG_INTEGER;
      if (n === Ch) return r.RGBA_INTEGER;
      if (n === sa || n === aa || n === oa || n === la) if (o === We) {
        if (a = e.get("WEBGL_compressed_texture_s3tc_srgb"), null === a) return null;
        if (n === sa) return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;
        if (n === aa) return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
        if (n === oa) return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
        if (n === la) return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
      } else {
        if (a = e.get("WEBGL_compressed_texture_s3tc"), null === a) return null;
        if (n === sa) return a.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === aa) return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === oa) return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === la) return a.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      }
      if (n === zl || n === kl || n === Vl || n === Gl) {
        if (a = e.get("WEBGL_compressed_texture_pvrtc"), null === a) return null;
        if (n === zl) return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === kl) return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === Vl) return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === Gl) return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      }
      if (n === Ah) return a = e.get("WEBGL_compressed_texture_etc1"), null !== a ? a.COMPRESSED_RGB_ETC1_WEBGL : null;
      if (n === Wl || n === Xl) {
        if (a = e.get("WEBGL_compressed_texture_etc"), null === a) return null;
        if (n === Wl) return o === We ? a.COMPRESSED_SRGB8_ETC2 : a.COMPRESSED_RGB8_ETC2;
        if (n === Xl) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : a.COMPRESSED_RGBA8_ETC2_EAC;
      }
      if (n === jl || n === ql || n === Yl || n === Zl || n === Jl || n === Kl || n === $l || n === Ql || n === ec || n === tc || n === ic || n === nc || n === rc || n === sc) {
        if (a = e.get("WEBGL_compressed_texture_astc"), null === a) return null;
        if (n === jl) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : a.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === ql) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : a.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === Yl) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : a.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === Zl) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : a.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === Jl) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : a.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === Kl) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : a.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === $l) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : a.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === Ql) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : a.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === ec) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : a.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === tc) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : a.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === ic) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : a.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === nc) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : a.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === rc) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : a.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === sc) return o === We ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : a.COMPRESSED_RGBA_ASTC_12x12_KHR;
      }
      if (n === ca || n === ac || n === oc) {
        if (a = e.get("EXT_texture_compression_bptc"), null === a) return null;
        if (n === ca) return o === We ? a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : a.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === ac) return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === oc) return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      }
      if (36283 === n || n === lc || n === cc || n === hc) {
        if (a = e.get("EXT_texture_compression_rgtc"), null === a) return null;
        if (n === ca) return a.COMPRESSED_RED_RGTC1_EXT;
        if (n === lc) return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === cc) return a.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === hc) return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      }
      return n === Bi ? i ? r.UNSIGNED_INT_24_8 : (a = e.get("WEBGL_depth_texture"), null !== a ? a.UNSIGNED_INT_24_8_WEBGL : null) : void 0 !== r[n] ? r[n] : null;
    } };
  }
  var ho = class extends ut {
    constructor(e = []) {
      super(), this.isArrayCamera = true, this.cameras = e;
    }
  };
  var fi = class extends _t {
    constructor() {
      super(), this.isGroup = true, this.type = "Group";
    }
  };
  var rp = { type: "move" };
  var nr = class {
    constructor() {
      this._targetRay = null, this._grip = null, this._hand = null;
    }
    getHandSpace() {
      return null === this._hand && (this._hand = new fi(), this._hand.matrixAutoUpdate = false, this._hand.visible = false, this._hand.joints = {}, this._hand.inputState = { pinching: false }), this._hand;
    }
    getTargetRaySpace() {
      return null === this._targetRay && (this._targetRay = new fi(), this._targetRay.matrixAutoUpdate = false, this._targetRay.visible = false, this._targetRay.hasLinearVelocity = false, this._targetRay.linearVelocity = new E(), this._targetRay.hasAngularVelocity = false, this._targetRay.angularVelocity = new E()), this._targetRay;
    }
    getGripSpace() {
      return null === this._grip && (this._grip = new fi(), this._grip.matrixAutoUpdate = false, this._grip.visible = false, this._grip.hasLinearVelocity = false, this._grip.linearVelocity = new E(), this._grip.hasAngularVelocity = false, this._grip.angularVelocity = new E()), this._grip;
    }
    dispatchEvent(e) {
      return null !== this._targetRay && this._targetRay.dispatchEvent(e), null !== this._grip && this._grip.dispatchEvent(e), null !== this._hand && this._hand.dispatchEvent(e), this;
    }
    connect(e) {
      if (e && e.hand) {
        const t = this._hand;
        if (t) for (const i of e.hand.values()) this._getHandJoint(t, i);
      }
      return this.dispatchEvent({ type: "connected", data: e }), this;
    }
    disconnect(e) {
      return this.dispatchEvent({ type: "disconnected", data: e }), null !== this._targetRay && (this._targetRay.visible = false), null !== this._grip && (this._grip.visible = false), null !== this._hand && (this._hand.visible = false), this;
    }
    update(e, t, i) {
      let n = null, s = null, a = null;
      const o = this._targetRay, l = this._grip, c = this._hand;
      if (e && "visible-blurred" !== t.session.visibilityState) {
        if (c && e.hand) {
          a = true;
          for (const v of e.hand.values()) {
            const m = t.getJointPose(v, i), y = this._getHandJoint(c, v);
            null !== m && (y.matrix.fromArray(m.transform.matrix), y.matrix.decompose(y.position, y.rotation, y.scale), y.matrixWorldNeedsUpdate = true, y.jointRadius = m.radius), y.visible = null !== m;
          }
          const h = c.joints["index-finger-tip"], u = c.joints["thumb-tip"], d = h.position.distanceTo(u.position), p = 0.02, f = 5e-3;
          c.inputState.pinching && d > p + f ? (c.inputState.pinching = false, this.dispatchEvent({ type: "pinchend", handedness: e.handedness, target: this })) : !c.inputState.pinching && d <= p - f && (c.inputState.pinching = true, this.dispatchEvent({ type: "pinchstart", handedness: e.handedness, target: this }));
        } else null !== l && e.gripSpace && (s = t.getPose(e.gripSpace, i), null !== s && (l.matrix.fromArray(s.transform.matrix), l.matrix.decompose(l.position, l.rotation, l.scale), l.matrixWorldNeedsUpdate = true, s.linearVelocity ? (l.hasLinearVelocity = true, l.linearVelocity.copy(s.linearVelocity)) : l.hasLinearVelocity = false, s.angularVelocity ? (l.hasAngularVelocity = true, l.angularVelocity.copy(s.angularVelocity)) : l.hasAngularVelocity = false));
        null !== o && (n = t.getPose(e.targetRaySpace, i), null === n && null !== s && (n = s), null !== n && (o.matrix.fromArray(n.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = true, n.linearVelocity ? (o.hasLinearVelocity = true, o.linearVelocity.copy(n.linearVelocity)) : o.hasLinearVelocity = false, n.angularVelocity ? (o.hasAngularVelocity = true, o.angularVelocity.copy(n.angularVelocity)) : o.hasAngularVelocity = false, this.dispatchEvent(rp)));
      }
      return null !== o && (o.visible = null !== n), null !== l && (l.visible = null !== s), null !== c && (c.visible = null !== a), this;
    }
    _getHandJoint(e, t) {
      if (void 0 === e.joints[t.jointName]) {
        const i = new fi();
        i.matrixAutoUpdate = false, i.visible = false, e.joints[t.jointName] = i, e.add(i);
      }
      return e.joints[t.jointName];
    }
  };
  var uo = class extends yi {
    constructor(e, t) {
      super();
      const i = this;
      let n = null, s = 1, a = null, o = "local-floor", l = 1, c = null, h = null, u = null, d = null, p = null, f = null;
      const v = t.getContextAttributes();
      let m = null, y = null;
      const _ = [], g = [], w = new X();
      let R = null;
      const T = new ut();
      T.layers.enable(1), T.viewport = new Ge();
      const A = new ut();
      A.layers.enable(2), A.viewport = new Ge();
      const N = [T, A], I = new ho();
      I.layers.enable(1), I.layers.enable(2);
      let F = null, Z = null;
      function P(k) {
        const G = g.indexOf(k.inputSource);
        if (-1 === G) return;
        const ce = _[G];
        void 0 !== ce && (ce.update(k.inputSource, k.frame, c || a), ce.dispatchEvent({ type: k.type, data: k.inputSource }));
      }
      function W() {
        n.removeEventListener("select", P), n.removeEventListener("selectstart", P), n.removeEventListener("selectend", P), n.removeEventListener("squeeze", P), n.removeEventListener("squeezestart", P), n.removeEventListener("squeezeend", P), n.removeEventListener("end", W), n.removeEventListener("inputsourceschange", j);
        for (let k = 0; k < _.length; k++) {
          const G = g[k];
          null !== G && (g[k] = null, _[k].disconnect(G));
        }
        F = null, Z = null, e.setRenderTarget(m), p = null, d = null, u = null, n = null, y = null, $.stop(), i.isPresenting = false, e.setPixelRatio(R), e.setSize(w.width, w.height, false), i.dispatchEvent({ type: "sessionend" });
      }
      function j(k) {
        for (let G = 0; G < k.removed.length; G++) {
          const ce = k.removed[G], S = g.indexOf(ce);
          S >= 0 && (g[S] = null, _[S].disconnect(ce));
        }
        for (let G = 0; G < k.added.length; G++) {
          const ce = k.added[G];
          let S = g.indexOf(ce);
          if (-1 === S) {
            for (let O = 0; O < _.length; O++) {
              if (O >= g.length) {
                g.push(ce), S = O;
                break;
              }
              if (null === g[O]) {
                g[O] = ce, S = O;
                break;
              }
            }
            if (-1 === S) break;
          }
          const b = _[S];
          b && b.connect(ce);
        }
      }
      this.cameraAutoUpdate = true, this.enabled = false, this.isPresenting = false, this.getController = function(k) {
        let G = _[k];
        return void 0 === G && (G = new nr(), _[k] = G), G.getTargetRaySpace();
      }, this.getControllerGrip = function(k) {
        let G = _[k];
        return void 0 === G && (G = new nr(), _[k] = G), G.getGripSpace();
      }, this.getHand = function(k) {
        let G = _[k];
        return void 0 === G && (G = new nr(), _[k] = G), G.getHandSpace();
      }, this.setFramebufferScaleFactor = function(k) {
        s = k, true === i.isPresenting && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.");
      }, this.setReferenceSpaceType = function(k) {
        o = k, true === i.isPresenting && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.");
      }, this.getReferenceSpace = function() {
        return c || a;
      }, this.setReferenceSpace = function(k) {
        c = k;
      }, this.getBaseLayer = function() {
        return null !== d ? d : p;
      }, this.getBinding = function() {
        return u;
      }, this.getFrame = function() {
        return f;
      }, this.getSession = function() {
        return n;
      }, this.setSession = async function(k) {
        if (n = k, null !== n) {
          if (m = e.getRenderTarget(), n.addEventListener("select", P), n.addEventListener("selectstart", P), n.addEventListener("selectend", P), n.addEventListener("squeeze", P), n.addEventListener("squeezestart", P), n.addEventListener("squeezeend", P), n.addEventListener("end", W), n.addEventListener("inputsourceschange", j), true !== v.xrCompatible && await t.makeXRCompatible(), R = e.getPixelRatio(), e.getSize(w), void 0 === n.renderState.layers || false === e.capabilities.isWebGL2) {
            const G = { antialias: void 0 !== n.renderState.layers || v.antialias, alpha: true, depth: v.depth, stencil: v.stencil, framebufferScaleFactor: s };
            p = new XRWebGLLayer(n, t, G), n.updateRenderState({ baseLayer: p }), e.setPixelRatio(1), e.setSize(p.framebufferWidth, p.framebufferHeight, false), y = new at(p.framebufferWidth, p.framebufferHeight, { format: bt, type: Ot, colorSpace: e.outputColorSpace, stencilBuffer: v.stencil });
          } else {
            let G = null, ce = null, S = null;
            v.depth && (S = v.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24, G = v.stencil ? vn : Hi, ce = v.stencil ? Bi : mi);
            const b = { colorFormat: t.RGBA8, depthFormat: S, scaleFactor: s };
            u = new XRWebGLBinding(n, t), d = u.createProjectionLayer(b), n.updateRenderState({ layers: [d] }), e.setPixelRatio(1), e.setSize(d.textureWidth, d.textureHeight, false), y = new at(d.textureWidth, d.textureHeight, { format: bt, type: Ot, depthTexture: new bs(d.textureWidth, d.textureHeight, ce, void 0, void 0, void 0, void 0, void 0, void 0, G), stencilBuffer: v.stencil, colorSpace: e.outputColorSpace, samples: v.antialias ? 4 : 0 });
            e.properties.get(y).__ignoreDepthValues = d.ignoreDepthValues;
          }
          y.isXRRenderTarget = true, this.setFoveation(l), c = null, a = await n.requestReferenceSpace(o), $.setContext(n), $.start(), i.isPresenting = true, i.dispatchEvent({ type: "sessionstart" });
        }
      }, this.getEnvironmentBlendMode = function() {
        if (null !== n) return n.environmentBlendMode;
      };
      const oe = new E(), de = new E();
      function ne(k, G) {
        null === G ? k.matrixWorld.copy(k.matrix) : k.matrixWorld.multiplyMatrices(G.matrixWorld, k.matrix), k.matrixWorldInverse.copy(k.matrixWorld).invert();
      }
      this.updateCamera = function(k) {
        if (null === n) return;
        I.near = A.near = T.near = k.near, I.far = A.far = T.far = k.far, F === I.near && Z === I.far || (n.updateRenderState({ depthNear: I.near, depthFar: I.far }), F = I.near, Z = I.far);
        const G = k.parent, ce = I.cameras;
        ne(I, G);
        for (let S = 0; S < ce.length; S++) ne(ce[S], G);
        2 === ce.length ? (function(S, b, O) {
          oe.setFromMatrixPosition(b.matrixWorld), de.setFromMatrixPosition(O.matrixWorld);
          const J = oe.distanceTo(de), L = b.projectionMatrix.elements, Y = O.projectionMatrix.elements, D = L[14] / (L[10] - 1), U = L[14] / (L[10] + 1), B = (L[9] + 1) / L[5], ie = (L[9] - 1) / L[5], Q = (L[8] - 1) / L[0], M = (Y[8] + 1) / Y[0], re = D * Q, H = D * M, z = J / (-Q + M), se = z * -Q;
          b.matrixWorld.decompose(S.position, S.quaternion, S.scale), S.translateX(se), S.translateZ(z), S.matrixWorld.compose(S.position, S.quaternion, S.scale), S.matrixWorldInverse.copy(S.matrixWorld).invert();
          const he = D + z, pe = U + z, fe = re - se, be = H + (J - se), ge = B * U / pe * he, ve = ie * U / pe * he;
          S.projectionMatrix.makePerspective(fe, be, ge, ve, he, pe), S.projectionMatrixInverse.copy(S.projectionMatrix).invert();
        })(I, T, A) : I.projectionMatrix.copy(T.projectionMatrix), (function(S, b, O) {
          null === O ? S.matrix.copy(b.matrixWorld) : (S.matrix.copy(O.matrixWorld), S.matrix.invert(), S.matrix.multiply(b.matrixWorld));
          S.matrix.decompose(S.position, S.quaternion, S.scale), S.updateMatrixWorld(true), S.projectionMatrix.copy(b.projectionMatrix), S.projectionMatrixInverse.copy(b.projectionMatrixInverse), S.isPerspectiveCamera && (S.fov = 2 * Ja * Math.atan(1 / S.projectionMatrix.elements[5]), S.zoom = 1);
        })(k, I, G);
      }, this.getCamera = function() {
        return I;
      }, this.getFoveation = function() {
        if (null !== d || null !== p) return l;
      }, this.setFoveation = function(k) {
        l = k, null !== d && (d.fixedFoveation = k), null !== p && void 0 !== p.fixedFoveation && (p.fixedFoveation = k);
      };
      let te = null;
      const $ = new Dh();
      $.setAnimationLoop((function(k, G) {
        if (h = G.getViewerPose(c || a), f = G, null !== h) {
          const ce = h.views;
          null !== p && (e.setRenderTargetFramebuffer(y, p.framebuffer), e.setRenderTarget(y));
          let S = false;
          ce.length !== I.cameras.length && (I.cameras.length = 0, S = true);
          for (let b = 0; b < ce.length; b++) {
            const O = ce[b];
            let J = null;
            if (null !== p) J = p.getViewport(O);
            else {
              const Y = u.getViewSubImage(d, O);
              J = Y.viewport, 0 === b && (e.setRenderTargetTextures(y, Y.colorTexture, d.ignoreDepthValues ? void 0 : Y.depthStencilTexture), e.setRenderTarget(y));
            }
            let L = N[b];
            void 0 === L && (L = new ut(), L.layers.enable(b), L.viewport = new Ge(), N[b] = L), L.matrix.fromArray(O.transform.matrix), L.matrix.decompose(L.position, L.quaternion, L.scale), L.projectionMatrix.fromArray(O.projectionMatrix), L.projectionMatrixInverse.copy(L.projectionMatrix).invert(), L.viewport.set(J.x, J.y, J.width, J.height), 0 === b && (I.matrix.copy(L.matrix), I.matrix.decompose(I.position, I.quaternion, I.scale)), true === S && I.cameras.push(L);
          }
        }
        for (let ce = 0; ce < _.length; ce++) {
          const S = g[ce], b = _[ce];
          null !== S && void 0 !== b && b.update(S, G, c || a);
        }
        te && te(k, G), G.detectedPlanes && i.dispatchEvent({ type: "planesdetected", data: G }), f = null;
      })), this.setAnimationLoop = function(k) {
        te = k;
      }, this.dispose = function() {
      };
    }
  };
  function sp(r, e) {
    function t(n, s) {
      true === n.matrixAutoUpdate && n.updateMatrix(), s.value.copy(n.matrix);
    }
    function i(n, s) {
      n.opacity.value = s.opacity, s.color && n.diffuse.value.copy(s.color), s.emissive && n.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity), s.map && (n.map.value = s.map, t(s.map, n.mapTransform)), s.alphaMap && (n.alphaMap.value = s.alphaMap, t(s.alphaMap, n.alphaMapTransform)), s.bumpMap && (n.bumpMap.value = s.bumpMap, t(s.bumpMap, n.bumpMapTransform), n.bumpScale.value = s.bumpScale, s.side === vt && (n.bumpScale.value *= -1)), s.normalMap && (n.normalMap.value = s.normalMap, t(s.normalMap, n.normalMapTransform), n.normalScale.value.copy(s.normalScale), s.side === vt && n.normalScale.value.negate()), s.displacementMap && (n.displacementMap.value = s.displacementMap, t(s.displacementMap, n.displacementMapTransform), n.displacementScale.value = s.displacementScale, n.displacementBias.value = s.displacementBias), s.emissiveMap && (n.emissiveMap.value = s.emissiveMap, t(s.emissiveMap, n.emissiveMapTransform)), s.specularMap && (n.specularMap.value = s.specularMap, t(s.specularMap, n.specularMapTransform)), s.alphaTest > 0 && (n.alphaTest.value = s.alphaTest);
      const a = e.get(s).envMap;
      if (a && (n.envMap.value = a, n.flipEnvMap.value = a.isCubeTexture && false === a.isRenderTargetTexture ? -1 : 1, n.reflectivity.value = s.reflectivity, n.ior.value = s.ior, n.refractionRatio.value = s.refractionRatio), s.lightMap) {
        n.lightMap.value = s.lightMap;
        const o = true === r._useLegacyLights ? Math.PI : 1;
        n.lightMapIntensity.value = s.lightMapIntensity * o, t(s.lightMap, n.lightMapTransform);
      }
      s.aoMap && (n.aoMap.value = s.aoMap, n.aoMapIntensity.value = s.aoMapIntensity, t(s.aoMap, n.aoMapTransform));
    }
    return { refreshFogUniforms: function(n, s) {
      s.color.getRGB(n.fogColor.value, Ih(r)), s.isFog ? (n.fogNear.value = s.near, n.fogFar.value = s.far) : s.isFogExp2 && (n.fogDensity.value = s.density);
    }, refreshMaterialUniforms: function(n, s, a, o, l) {
      s.isMeshBasicMaterial || s.isMeshLambertMaterial ? i(n, s) : s.isMeshToonMaterial ? (i(n, s), (function(c, h) {
        h.gradientMap && (c.gradientMap.value = h.gradientMap);
      })(n, s)) : s.isMeshPhongMaterial ? (i(n, s), (function(c, h) {
        c.specular.value.copy(h.specular), c.shininess.value = Math.max(h.shininess, 1e-4);
      })(n, s)) : s.isMeshStandardMaterial ? (i(n, s), (function(c, h) {
        c.metalness.value = h.metalness, h.metalnessMap && (c.metalnessMap.value = h.metalnessMap, t(h.metalnessMap, c.metalnessMapTransform));
        c.roughness.value = h.roughness, h.roughnessMap && (c.roughnessMap.value = h.roughnessMap, t(h.roughnessMap, c.roughnessMapTransform));
        const u = e.get(h).envMap;
        u && (c.envMapIntensity.value = h.envMapIntensity);
      })(n, s), s.isMeshPhysicalMaterial && (function(c, h, u) {
        c.ior.value = h.ior, h.sheen > 0 && (c.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen), c.sheenRoughness.value = h.sheenRoughness, h.sheenColorMap && (c.sheenColorMap.value = h.sheenColorMap, t(h.sheenColorMap, c.sheenColorMapTransform)), h.sheenRoughnessMap && (c.sheenRoughnessMap.value = h.sheenRoughnessMap, t(h.sheenRoughnessMap, c.sheenRoughnessMapTransform)));
        h.clearcoat > 0 && (c.clearcoat.value = h.clearcoat, c.clearcoatRoughness.value = h.clearcoatRoughness, h.clearcoatMap && (c.clearcoatMap.value = h.clearcoatMap, t(h.clearcoatMap, c.clearcoatMapTransform)), h.clearcoatRoughnessMap && (c.clearcoatRoughnessMap.value = h.clearcoatRoughnessMap, t(h.clearcoatRoughnessMap, c.clearcoatRoughnessMapTransform)), h.clearcoatNormalMap && (c.clearcoatNormalMap.value = h.clearcoatNormalMap, t(h.clearcoatNormalMap, c.clearcoatNormalMapTransform), c.clearcoatNormalScale.value.copy(h.clearcoatNormalScale), h.side === vt && c.clearcoatNormalScale.value.negate()));
        h.iridescence > 0 && (c.iridescence.value = h.iridescence, c.iridescenceIOR.value = h.iridescenceIOR, c.iridescenceThicknessMinimum.value = h.iridescenceThicknessRange[0], c.iridescenceThicknessMaximum.value = h.iridescenceThicknessRange[1], h.iridescenceMap && (c.iridescenceMap.value = h.iridescenceMap, t(h.iridescenceMap, c.iridescenceMapTransform)), h.iridescenceThicknessMap && (c.iridescenceThicknessMap.value = h.iridescenceThicknessMap, t(h.iridescenceThicknessMap, c.iridescenceThicknessMapTransform)));
        h.transmission > 0 && (c.transmission.value = h.transmission, c.transmissionSamplerMap.value = u.texture, c.transmissionSamplerSize.value.set(u.width, u.height), h.transmissionMap && (c.transmissionMap.value = h.transmissionMap, t(h.transmissionMap, c.transmissionMapTransform)), c.thickness.value = h.thickness, h.thicknessMap && (c.thicknessMap.value = h.thicknessMap, t(h.thicknessMap, c.thicknessMapTransform)), c.attenuationDistance.value = h.attenuationDistance, c.attenuationColor.value.copy(h.attenuationColor));
        h.anisotropy > 0 && (c.anisotropyVector.value.set(h.anisotropy * Math.cos(h.anisotropyRotation), h.anisotropy * Math.sin(h.anisotropyRotation)), h.anisotropyMap && (c.anisotropyMap.value = h.anisotropyMap, t(h.anisotropyMap, c.anisotropyMapTransform)));
        c.specularIntensity.value = h.specularIntensity, c.specularColor.value.copy(h.specularColor), h.specularColorMap && (c.specularColorMap.value = h.specularColorMap, t(h.specularColorMap, c.specularColorMapTransform));
        h.specularIntensityMap && (c.specularIntensityMap.value = h.specularIntensityMap, t(h.specularIntensityMap, c.specularIntensityMapTransform));
      })(n, s, l)) : s.isMeshMatcapMaterial ? (i(n, s), (function(c, h) {
        h.matcap && (c.matcap.value = h.matcap);
      })(n, s)) : s.isMeshDepthMaterial ? i(n, s) : s.isMeshDistanceMaterial ? (i(n, s), (function(c, h) {
        const u = e.get(h).light;
        c.referencePosition.value.setFromMatrixPosition(u.matrixWorld), c.nearDistance.value = u.shadow.camera.near, c.farDistance.value = u.shadow.camera.far;
      })(n, s)) : s.isMeshNormalMaterial ? i(n, s) : s.isLineBasicMaterial ? ((function(c, h) {
        c.diffuse.value.copy(h.color), c.opacity.value = h.opacity, h.map && (c.map.value = h.map, t(h.map, c.mapTransform));
      })(n, s), s.isLineDashedMaterial && (function(c, h) {
        c.dashSize.value = h.dashSize, c.totalSize.value = h.dashSize + h.gapSize, c.scale.value = h.scale;
      })(n, s)) : s.isPointsMaterial ? (function(c, h, u, d) {
        c.diffuse.value.copy(h.color), c.opacity.value = h.opacity, c.size.value = h.size * u, c.scale.value = 0.5 * d, h.map && (c.map.value = h.map, t(h.map, c.uvTransform));
        h.alphaMap && (c.alphaMap.value = h.alphaMap, t(h.alphaMap, c.alphaMapTransform));
        h.alphaTest > 0 && (c.alphaTest.value = h.alphaTest);
      })(n, s, a, o) : s.isSpriteMaterial ? (function(c, h) {
        c.diffuse.value.copy(h.color), c.opacity.value = h.opacity, c.rotation.value = h.rotation, h.map && (c.map.value = h.map, t(h.map, c.mapTransform));
        h.alphaMap && (c.alphaMap.value = h.alphaMap, t(h.alphaMap, c.alphaMapTransform));
        h.alphaTest > 0 && (c.alphaTest.value = h.alphaTest);
      })(n, s) : s.isShadowMaterial ? (n.color.value.copy(s.color), n.opacity.value = s.opacity) : s.isShaderMaterial && (s.uniformsNeedUpdate = false);
    } };
  }
  function ap(r, e, t, i) {
    let n = {}, s = {}, a = [];
    const o = t.isWebGL2 ? r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS) : 0;
    function l(u, d, p, f) {
      const v = u.value, m = d + "_" + p;
      if (void 0 === f[m]) return f[m] = "number" == typeof v || "boolean" == typeof v ? v : v.clone(), true;
      {
        const y = f[m];
        if ("number" == typeof v || "boolean" == typeof v) {
          if (y !== v) return f[m] = v, true;
        } else if (false === y.equals(v)) return y.copy(v), true;
      }
      return false;
    }
    function c(u) {
      const d = { boundary: 0, storage: 0 };
      return "number" == typeof u || "boolean" == typeof u ? (d.boundary = 4, d.storage = 4) : u.isVector2 ? (d.boundary = 8, d.storage = 8) : u.isVector3 || u.isColor ? (d.boundary = 16, d.storage = 12) : u.isVector4 ? (d.boundary = 16, d.storage = 16) : u.isMatrix3 ? (d.boundary = 48, d.storage = 48) : u.isMatrix4 ? (d.boundary = 64, d.storage = 64) : u.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", u), d;
    }
    function h(u) {
      const d = u.target;
      d.removeEventListener("dispose", h);
      const p = a.indexOf(d.__bindingPointIndex);
      a.splice(p, 1), r.deleteBuffer(n[d.id]), delete n[d.id], delete s[d.id];
    }
    return { bind: function(u, d) {
      const p = d.program;
      i.uniformBlockBinding(u, p);
    }, update: function(u, d) {
      let p = n[u.id];
      void 0 === p && (!(function(m) {
        const y = m.uniforms;
        let _ = 0;
        const g = 16;
        for (let R = 0, T = y.length; R < T; R++) {
          const A = Array.isArray(y[R]) ? y[R] : [y[R]];
          for (let N = 0, I = A.length; N < I; N++) {
            const F = A[N], Z = Array.isArray(F.value) ? F.value : [F.value];
            for (let P = 0, W = Z.length; P < W; P++) {
              const j = c(Z[P]), oe = _ % g;
              0 !== oe && g - oe < j.boundary && (_ += g - oe), F.__data = new Float32Array(j.storage / Float32Array.BYTES_PER_ELEMENT), F.__offset = _, _ += j.storage;
            }
          }
        }
        const w = _ % g;
        w > 0 && (_ += g - w);
        m.__size = _, m.__cache = {};
      })(u), p = (function(m) {
        const y = (function() {
          for (let R = 0; R < o; R++) if (-1 === a.indexOf(R)) return a.push(R), R;
          return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
        })();
        m.__bindingPointIndex = y;
        const _ = r.createBuffer(), g = m.__size, w = m.usage;
        return r.bindBuffer(r.UNIFORM_BUFFER, _), r.bufferData(r.UNIFORM_BUFFER, g, w), r.bindBuffer(r.UNIFORM_BUFFER, null), r.bindBufferBase(r.UNIFORM_BUFFER, y, _), _;
      })(u), n[u.id] = p, u.addEventListener("dispose", h));
      const f = d.program;
      i.updateUBOMapping(u, f);
      const v = e.render.frame;
      s[u.id] !== v && (!(function(m) {
        const y = n[m.id], _ = m.uniforms, g = m.__cache;
        r.bindBuffer(r.UNIFORM_BUFFER, y);
        for (let w = 0, R = _.length; w < R; w++) {
          const T = Array.isArray(_[w]) ? _[w] : [_[w]];
          for (let A = 0, N = T.length; A < N; A++) {
            const I = T[A];
            if (true === l(I, w, A, g)) {
              const F = I.__offset, Z = Array.isArray(I.value) ? I.value : [I.value];
              let P = 0;
              for (let W = 0; W < Z.length; W++) {
                const j = Z[W], oe = c(j);
                "number" == typeof j || "boolean" == typeof j ? (I.__data[0] = j, r.bufferSubData(r.UNIFORM_BUFFER, F + P, I.__data)) : j.isMatrix3 ? (I.__data[0] = j.elements[0], I.__data[1] = j.elements[1], I.__data[2] = j.elements[2], I.__data[3] = 0, I.__data[4] = j.elements[3], I.__data[5] = j.elements[4], I.__data[6] = j.elements[5], I.__data[7] = 0, I.__data[8] = j.elements[6], I.__data[9] = j.elements[7], I.__data[10] = j.elements[8], I.__data[11] = 0) : (j.toArray(I.__data, P), P += oe.storage / Float32Array.BYTES_PER_ELEMENT);
              }
              r.bufferSubData(r.UNIFORM_BUFFER, F, I.__data);
            }
          }
        }
        r.bindBuffer(r.UNIFORM_BUFFER, null);
      })(u), s[u.id] = v);
    }, dispose: function() {
      for (const u in n) r.deleteBuffer(n[u]);
      a = [], n = {}, s = {};
    } };
  }
  var lr = class {
    constructor(e = {}) {
      const { canvas: t = gu(), context: i = null, depth: n = true, stencil: s = true, alpha: a = false, antialias: o = false, premultipliedAlpha: l = true, preserveDrawingBuffer: c = false, powerPreference: h = "default", failIfMajorPerformanceCaveat: u = false } = e;
      let d;
      this.isWebGLRenderer = true, d = null !== i ? i.getContextAttributes().alpha : a;
      const p = new Uint32Array(4), f = new Int32Array(4);
      let v = null, m = null;
      const y = [], _ = [];
      this.domElement = t, this.debug = { checkShaderErrors: true, onShaderError: null }, this.autoClear = true, this.autoClearColor = true, this.autoClearDepth = true, this.autoClearStencil = true, this.sortObjects = true, this.clippingPlanes = [], this.localClippingEnabled = false, this._outputColorSpace = Qe, this._useLegacyLights = false, this.toneMapping = gi, this.toneMappingExposure = 1;
      const g = this;
      let w = false, R = 0, T = 0, A = null, N = -1, I = null;
      const F = new Ge(), Z = new Ge();
      let P = null;
      const W = new x(0);
      let j = 0, oe = t.width, de = t.height, ne = 1, te = null, $ = null;
      const k = new Ge(0, 0, oe, de), G = new Ge(0, 0, oe, de);
      let ce = false;
      const S = new bn();
      let b = false, O = false, J = null;
      const L = new we(), Y = new X(), D = new E(), U = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: true };
      function B() {
        return null === A ? ne : 1;
      }
      let ie, Q, M, re, H, z, se, he, pe, fe, be, ge, ve, Te, nt, _e, Ne, Pe, yr, ji, xr, St, yt, qi, q = i;
      function Mr(C, V) {
        for (let K = 0; K < C.length; K++) {
          const ae = C[K], ee = t.getContext(ae, V);
          if (null !== ee) return ee;
        }
        return null;
      }
      try {
        const C = { alpha: true, depth: n, stencil: s, antialias: o, premultipliedAlpha: l, preserveDrawingBuffer: c, powerPreference: h, failIfMajorPerformanceCaveat: u };
        if ("setAttribute" in t && t.setAttribute("data-engine", `three.js r${Va}`), t.addEventListener("webglcontextlost", Sl, false), t.addEventListener("webglcontextrestored", El, false), t.addEventListener("webglcontextcreationerror", Tl, false), null === q) {
          const V = ["webgl2", "webgl", "experimental-webgl"];
          if (true === g.isWebGL1Renderer && V.shift(), q = Mr(V, C), null === q) throw Mr(V) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
        }
        "undefined" != typeof WebGLRenderingContext && q instanceof WebGLRenderingContext && console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."), void 0 === q.getShaderPrecisionFormat && (q.getShaderPrecisionFormat = function() {
          return { rangeMin: 1, rangeMax: 1, precision: 1 };
        });
      } catch (C) {
        throw console.error("THREE.WebGLRenderer: " + C.message), C;
      }
      function Wn() {
        ie = new ku(q), Q = new Fu(q, ie, e), ie.init(Q), St = new np(q, ie, Q), M = new tp(q, ie, Q), re = new Wu(q), H = new jd(), z = new ip(q, ie, M, H, Q, St, re), se = new Hu(g), he = new zu(g), pe = new Du(q, Q), yt = new Nu(q, ie, pe, Q), fe = new Vu(q, pe, re, yt), be = new Yu(q, fe, pe, re), yr = new qu(q, Q, z), _e = new Bu(H), ge = new Xd(g, se, he, ie, Q, yt, _e), ve = new sp(g, H), Te = new Yd(), nt = new Qd(ie, Q), Pe = new Uu(g, se, he, M, be, d, l), Ne = new ep(g, be, Q), qi = new ap(q, re, Q, M), ji = new Ou(q, ie, re, Q), xr = new Gu(q, ie, re, Q), re.programs = ge.programs, g.capabilities = Q, g.extensions = ie, g.properties = H, g.renderLists = Te, g.shadowMap = Ne, g.state = M, g.info = re;
      }
      Wn();
      const ot = new uo(g, q);
      function Sl(C) {
        C.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), w = true;
      }
      function El() {
        console.log("THREE.WebGLRenderer: Context Restored."), w = false;
        const C = re.autoReset, V = Ne.enabled, K = Ne.autoUpdate, ae = Ne.needsUpdate, ee = Ne.type;
        Wn(), re.autoReset = C, Ne.enabled = V, Ne.autoUpdate = K, Ne.needsUpdate = ae, Ne.type = ee;
      }
      function Tl(C) {
        console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", C.statusMessage);
      }
      function wl(C) {
        const V = C.target;
        V.removeEventListener("dispose", wl), (function(K) {
          (function(ae) {
            const ee = H.get(ae).programs;
            void 0 !== ee && (ee.forEach((function(ue) {
              ge.releaseProgram(ue);
            })), ae.isShaderMaterial && ge.releaseShaderCache(ae));
          })(K), H.remove(K);
        })(V);
      }
      function Cl(C, V, K) {
        true === C.transparent && 2 === C.side && false === C.forceSinglePass ? (C.side = vt, C.needsUpdate = true, Sr(C, V, K), C.side = _i, C.needsUpdate = true, Sr(C, V, K), C.side = 2) : Sr(C, V, K);
      }
      this.xr = ot, this.getContext = function() {
        return q;
      }, this.getContextAttributes = function() {
        return q.getContextAttributes();
      }, this.forceContextLoss = function() {
        const C = ie.get("WEBGL_lose_context");
        C && C.loseContext();
      }, this.forceContextRestore = function() {
        const C = ie.get("WEBGL_lose_context");
        C && C.restoreContext();
      }, this.getPixelRatio = function() {
        return ne;
      }, this.setPixelRatio = function(C) {
        void 0 !== C && (ne = C, this.setSize(oe, de, false));
      }, this.getSize = function(C) {
        return C.set(oe, de);
      }, this.setSize = function(C, V, K = true) {
        ot.isPresenting ? console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.") : (oe = C, de = V, t.width = Math.floor(C * ne), t.height = Math.floor(V * ne), true === K && (t.style.width = C + "px", t.style.height = V + "px"), this.setViewport(0, 0, C, V));
      }, this.getDrawingBufferSize = function(C) {
        return C.set(oe * ne, de * ne).floor();
      }, this.setDrawingBufferSize = function(C, V, K) {
        oe = C, de = V, ne = K, t.width = Math.floor(C * K), t.height = Math.floor(V * K), this.setViewport(0, 0, C, V);
      }, this.getCurrentViewport = function(C) {
        return C.copy(F);
      }, this.getViewport = function(C) {
        return C.copy(k);
      }, this.setViewport = function(C, V, K, ae) {
        C.isVector4 ? k.set(C.x, C.y, C.z, C.w) : k.set(C, V, K, ae), M.viewport(F.copy(k).multiplyScalar(ne).floor());
      }, this.getScissor = function(C) {
        return C.copy(G);
      }, this.setScissor = function(C, V, K, ae) {
        C.isVector4 ? G.set(C.x, C.y, C.z, C.w) : G.set(C, V, K, ae), M.scissor(Z.copy(G).multiplyScalar(ne).floor());
      }, this.getScissorTest = function() {
        return ce;
      }, this.setScissorTest = function(C) {
        M.setScissorTest(ce = C);
      }, this.setOpaqueSort = function(C) {
        te = C;
      }, this.setTransparentSort = function(C) {
        $ = C;
      }, this.getClearColor = function(C) {
        return C.copy(Pe.getClearColor());
      }, this.setClearColor = function() {
        Pe.setClearColor.apply(Pe, arguments);
      }, this.getClearAlpha = function() {
        return Pe.getClearAlpha();
      }, this.setClearAlpha = function() {
        Pe.setClearAlpha.apply(Pe, arguments);
      }, this.clear = function(C = true, V = true, K = true) {
        let ae = 0;
        if (C) {
          let ee = false;
          if (null !== A) {
            const ue = A.texture.format;
            ee = ue === Ch || ue === wh || ue === Th;
          }
          if (ee) {
            const ue = A.texture.type, xe = ue === Ot || ue === mi || ue === Ko || ue === Bi || ue === Sh || ue === Eh, Me = Pe.getClearColor(), Ce = Pe.getClearAlpha(), Re = Me.r, Le = Me.g, Ie = Me.b;
            xe ? (p[0] = Re, p[1] = Le, p[2] = Ie, p[3] = Ce, q.clearBufferuiv(q.COLOR, 0, p)) : (f[0] = Re, f[1] = Le, f[2] = Ie, f[3] = Ce, q.clearBufferiv(q.COLOR, 0, f));
          } else ae |= q.COLOR_BUFFER_BIT;
        }
        V && (ae |= q.DEPTH_BUFFER_BIT), K && (ae |= q.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), q.clear(ae);
      }, this.clearColor = function() {
        this.clear(true, false, false);
      }, this.clearDepth = function() {
        this.clear(false, true, false);
      }, this.clearStencil = function() {
        this.clear(false, false, true);
      }, this.dispose = function() {
        t.removeEventListener("webglcontextlost", Sl, false), t.removeEventListener("webglcontextrestored", El, false), t.removeEventListener("webglcontextcreationerror", Tl, false), Te.dispose(), nt.dispose(), H.dispose(), se.dispose(), he.dispose(), be.dispose(), yt.dispose(), qi.dispose(), ge.dispose(), ot.dispose(), ot.removeEventListener("sessionstart", Al), ot.removeEventListener("sessionend", Rl), J && (J.dispose(), J = null), Ti.stop();
      }, this.renderBufferDirect = function(C, V, K, ae, ee, ue) {
        null === V && (V = U);
        const xe = ee.isMesh && ee.matrixWorld.determinant() < 0, Me = (function($e, Et, mt, Ue, Oe) {
          true !== Et.isScene && (Et = U);
          z.resetTextureUnits();
          const Xn = Et.fog, ea = Ue.isMeshStandardMaterial ? Et.environment : null, Kh = null === A ? g.outputColorSpace : true === A.isXRRenderTarget ? A.texture.colorSpace : si, Er = (Ue.isMeshStandardMaterial ? he : se).get(Ue.envMap || ea), $h = true === Ue.vertexColors && !!mt.attributes.color && 4 === mt.attributes.color.itemSize, Qh = !!mt.attributes.tangent && (!!Ue.normalMap || Ue.anisotropy > 0), eu = !!mt.morphAttributes.position, tu = !!mt.morphAttributes.normal, iu = !!mt.morphAttributes.color;
          let Nl = gi;
          Ue.toneMapped && (null !== A && true !== A.isXRRenderTarget || (Nl = g.toneMapping));
          const Ol = mt.morphAttributes.position || mt.morphAttributes.normal || mt.morphAttributes.color, nu = void 0 !== Ol ? Ol.length : 0, Fe = H.get(Ue), ru = m.state.lights;
          if (true === b && (true === O || $e !== I)) {
            const Tt = $e === I && Ue.id === N;
            _e.setState(Ue, $e, Tt);
          }
          let Pt = false;
          Ue.version === Fe.__version ? Fe.needsLights && Fe.lightsStateVersion !== ru.state.version || Fe.outputColorSpace !== Kh || Oe.isBatchedMesh && false === Fe.batching ? Pt = true : Oe.isBatchedMesh || true !== Fe.batching ? Oe.isInstancedMesh && false === Fe.instancing ? Pt = true : Oe.isInstancedMesh || true !== Fe.instancing ? Oe.isSkinnedMesh && false === Fe.skinning ? Pt = true : Oe.isSkinnedMesh || true !== Fe.skinning ? Oe.isInstancedMesh && true === Fe.instancingColor && null === Oe.instanceColor || Oe.isInstancedMesh && false === Fe.instancingColor && null !== Oe.instanceColor || Fe.envMap !== Er || true === Ue.fog && Fe.fog !== Xn ? Pt = true : void 0 === Fe.numClippingPlanes || Fe.numClippingPlanes === _e.numPlanes && Fe.numIntersection === _e.numIntersection ? (Fe.vertexAlphas !== $h || Fe.vertexTangents !== Qh || Fe.morphTargets !== eu || Fe.morphNormals !== tu || Fe.morphColors !== iu || Fe.toneMapping !== Nl || true === Q.isWebGL2 && Fe.morphTargetsCount !== nu) && (Pt = true) : Pt = true : Pt = true : Pt = true : Pt = true : (Pt = true, Fe.__version = Ue.version);
          let Ci = Fe.currentProgram;
          true === Pt && (Ci = Sr(Ue, Et, Oe));
          let Fl = false, jn = false, ta = false;
          const lt = Ci.getUniforms(), Ai = Fe.uniforms;
          M.useProgram(Ci.program) && (Fl = true, jn = true, ta = true);
          Ue.id !== N && (N = Ue.id, jn = true);
          if (Fl || I !== $e) {
            lt.setValue(q, "projectionMatrix", $e.projectionMatrix), lt.setValue(q, "viewMatrix", $e.matrixWorldInverse);
            const Tt = lt.map.cameraPosition;
            void 0 !== Tt && Tt.setValue(q, D.setFromMatrixPosition($e.matrixWorld)), Q.logarithmicDepthBuffer && lt.setValue(q, "logDepthBufFC", 2 / (Math.log($e.far + 1) / Math.LN2)), (Ue.isMeshPhongMaterial || Ue.isMeshToonMaterial || Ue.isMeshLambertMaterial || Ue.isMeshBasicMaterial || Ue.isMeshStandardMaterial || Ue.isShaderMaterial) && lt.setValue(q, "isOrthographic", true === $e.isOrthographicCamera), I !== $e && (I = $e, jn = true, ta = true);
          }
          if (Oe.isSkinnedMesh) {
            lt.setOptional(q, Oe, "bindMatrix"), lt.setOptional(q, Oe, "bindMatrixInverse");
            const Tt = Oe.skeleton;
            Tt && (Q.floatVertexTextures ? (null === Tt.boneTexture && Tt.computeBoneTexture(), lt.setValue(q, "boneTexture", Tt.boneTexture, z)) : console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."));
          }
          Oe.isBatchedMesh && (lt.setOptional(q, Oe, "batchingTexture"), lt.setValue(q, "batchingTexture", Oe._matricesTexture, z));
          const ia = mt.morphAttributes;
          (void 0 !== ia.position || void 0 !== ia.normal || void 0 !== ia.color && true === Q.isWebGL2) && yr.update(Oe, mt, Ci);
          (jn || Fe.receiveShadow !== Oe.receiveShadow) && (Fe.receiveShadow = Oe.receiveShadow, lt.setValue(q, "receiveShadow", Oe.receiveShadow));
          Ue.isMeshGouraudMaterial && null !== Ue.envMap && (Ai.envMap.value = Er, Ai.flipEnvMap.value = Er.isCubeTexture && false === Er.isRenderTargetTexture ? -1 : 1);
          jn && (lt.setValue(q, "toneMappingExposure", g.toneMappingExposure), Fe.needsLights && (Lt = ta, (Wt = Ai).ambientLightColor.needsUpdate = Lt, Wt.lightProbe.needsUpdate = Lt, Wt.directionalLights.needsUpdate = Lt, Wt.directionalLightShadows.needsUpdate = Lt, Wt.pointLights.needsUpdate = Lt, Wt.pointLightShadows.needsUpdate = Lt, Wt.spotLights.needsUpdate = Lt, Wt.spotLightShadows.needsUpdate = Lt, Wt.rectAreaLights.needsUpdate = Lt, Wt.hemisphereLights.needsUpdate = Lt), Xn && true === Ue.fog && ve.refreshFogUniforms(Ai, Xn), ve.refreshMaterialUniforms(Ai, Ue, ne, de, J), mn.upload(q, Dl(Fe), Ai, z));
          var Wt, Lt;
          Ue.isShaderMaterial && true === Ue.uniformsNeedUpdate && (mn.upload(q, Dl(Fe), Ai, z), Ue.uniformsNeedUpdate = false);
          Ue.isSpriteMaterial && lt.setValue(q, "center", Oe.center);
          if (lt.setValue(q, "modelViewMatrix", Oe.modelViewMatrix), lt.setValue(q, "normalMatrix", Oe.normalMatrix), lt.setValue(q, "modelMatrix", Oe.matrixWorld), Ue.isShaderMaterial || Ue.isRawShaderMaterial) {
            const Tt = Ue.uniformsGroups;
            for (let na = 0, su = Tt.length; na < su; na++) if (Q.isWebGL2) {
              const Bl = Tt[na];
              qi.update(Bl, Ci), qi.bind(Bl, Ci);
            } else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.");
          }
          return Ci;
        })(C, V, K, ae, ee);
        M.setMaterial(ae, xe);
        let Ce = K.index, Re = 1;
        if (true === ae.wireframe) {
          if (Ce = fe.getWireframeAttribute(K), void 0 === Ce) return;
          Re = 2;
        }
        const Le = K.drawRange, Ie = K.attributes.position;
        let je = Le.start * Re, Rt = (Le.start + Le.count) * Re;
        null !== ue && (je = Math.max(je, ue.start * Re), Rt = Math.min(Rt, (ue.start + ue.count) * Re)), null !== Ce ? (je = Math.max(je, 0), Rt = Math.min(Rt, Ce.count)) : null != Ie && (je = Math.max(je, 0), Rt = Math.min(Rt, Ie.count));
        const Zt = Rt - je;
        if (Zt < 0 || Zt === 1 / 0) return;
        let wi;
        yt.setup(ee, ae, Me, K, Ce);
        let qe = ji;
        if (null !== Ce && (wi = pe.get(Ce), qe = xr, qe.setIndex(wi)), ee.isMesh) true === ae.wireframe ? (M.setLineWidth(ae.wireframeLinewidth * B()), qe.setMode(q.LINES)) : qe.setMode(q.TRIANGLES);
        else if (ee.isLine) {
          let $e = ae.linewidth;
          void 0 === $e && ($e = 1), M.setLineWidth($e * B()), ee.isLineSegments ? qe.setMode(q.LINES) : ee.isLineLoop ? qe.setMode(q.LINE_LOOP) : qe.setMode(q.LINE_STRIP);
        } else ee.isPoints ? qe.setMode(q.POINTS) : ee.isSprite && qe.setMode(q.TRIANGLES);
        if (ee.isBatchedMesh) qe.renderMultiDraw(ee._multiDrawStarts, ee._multiDrawCounts, ee._multiDrawCount);
        else if (ee.isInstancedMesh) qe.renderInstances(je, Zt, ee.count);
        else if (K.isInstancedBufferGeometry) {
          const $e = void 0 !== K._maxInstanceCount ? K._maxInstanceCount : 1 / 0, Et = Math.min(K.instanceCount, $e);
          qe.renderInstances(je, Zt, Et);
        } else qe.render(je, Zt);
      }, this.compile = function(C, V, K = null) {
        null === K && (K = C), m = nt.get(K), m.init(), _.push(m), K.traverseVisible((function(ee) {
          ee.isLight && ee.layers.test(V.layers) && (m.pushLight(ee), ee.castShadow && m.pushShadow(ee));
        })), C !== K && C.traverseVisible((function(ee) {
          ee.isLight && ee.layers.test(V.layers) && (m.pushLight(ee), ee.castShadow && m.pushShadow(ee));
        })), m.setupLights(g._useLegacyLights);
        const ae = /* @__PURE__ */ new Set();
        return C.traverse((function(ee) {
          const ue = ee.material;
          if (ue) if (Array.isArray(ue)) for (let xe = 0; xe < ue.length; xe++) {
            const Me = ue[xe];
            Cl(Me, K, ee), ae.add(Me);
          }
          else Cl(ue, K, ee), ae.add(ue);
        })), _.pop(), m = null, ae;
      }, this.compileAsync = function(C, V, K = null) {
        const ae = this.compile(C, V, K);
        return new Promise(((ee) => {
          function ue() {
            ae.forEach((function(xe) {
              H.get(xe).currentProgram.isReady() && ae.delete(xe);
            })), 0 !== ae.size ? setTimeout(ue, 10) : ee(C);
          }
          null !== ie.get("KHR_parallel_shader_compile") ? ue() : setTimeout(ue, 10);
        }));
      };
      let Qs = null;
      function Al() {
        Ti.stop();
      }
      function Rl() {
        Ti.start();
      }
      const Ti = new Dh();
      function Pl(C, V, K, ae) {
        if (false === C.visible) return;
        if (C.layers.test(V.layers)) {
          if (C.isGroup) K = C.renderOrder;
          else if (C.isLOD) true === C.autoUpdate && C.update(V);
          else if (C.isLight) m.pushLight(C), C.castShadow && m.pushShadow(C);
          else if (C.isSprite) {
            if (!C.frustumCulled || S.intersectsSprite(C)) {
              ae && D.setFromMatrixPosition(C.matrixWorld).applyMatrix4(L);
              const ue = be.update(C), xe = C.material;
              xe.visible && v.push(C, ue, xe, K, D.z, null);
            }
          } else if ((C.isMesh || C.isLine || C.isPoints) && (!C.frustumCulled || S.intersectsObject(C))) {
            const ue = be.update(C), xe = C.material;
            if (ae && (void 0 !== C.boundingSphere ? (null === C.boundingSphere && C.computeBoundingSphere(), D.copy(C.boundingSphere.center)) : (null === ue.boundingSphere && ue.computeBoundingSphere(), D.copy(ue.boundingSphere.center)), D.applyMatrix4(C.matrixWorld).applyMatrix4(L)), Array.isArray(xe)) {
              const Me = ue.groups;
              for (let Ce = 0, Re = Me.length; Ce < Re; Ce++) {
                const Le = Me[Ce], Ie = xe[Le.materialIndex];
                Ie && Ie.visible && v.push(C, ue, Ie, K, D.z, Le);
              }
            } else xe.visible && v.push(C, ue, xe, K, D.z, null);
          }
        }
        const ee = C.children;
        for (let ue = 0, xe = ee.length; ue < xe; ue++) Pl(ee[ue], V, K, ae);
      }
      function Ll(C, V, K, ae) {
        const ee = C.opaque, ue = C.transmissive, xe = C.transparent;
        m.setupLightsView(K), true === b && _e.setGlobalState(g.clippingPlanes, K), ue.length > 0 && (function(Me, Ce, Re, Le) {
          const Ie = true === Re.isScene ? Re.overrideMaterial : null;
          if (null !== Ie) return;
          const je = Q.isWebGL2;
          null === J && (J = new at(1, 1, { generateMipmaps: true, type: ie.has("EXT_color_buffer_half_float") ? ri : Ot, minFilter: ss, samples: je ? 4 : 0 }));
          g.getDrawingBufferSize(Y), je ? J.setSize(Y.x, Y.y) : J.setSize(Ka(Y.x), Ka(Y.y));
          const Rt = g.getRenderTarget();
          g.setRenderTarget(J), g.getClearColor(W), j = g.getClearAlpha(), j < 1 && g.setClearColor(16777215, 0.5);
          g.clear();
          const Zt = g.toneMapping;
          g.toneMapping = gi, br(Me, Re, Le), z.updateMultisampleRenderTarget(J), z.updateRenderTargetMipmap(J);
          let wi = false;
          for (let qe = 0, $e = Ce.length; qe < $e; qe++) {
            const Et = Ce[qe], mt = Et.object, Ue = Et.geometry, Oe = Et.material, Xn = Et.group;
            if (2 === Oe.side && mt.layers.test(Le.layers)) {
              const ea = Oe.side;
              Oe.side = vt, Oe.needsUpdate = true, Il(mt, Re, Le, Ue, Oe, Xn), Oe.side = ea, Oe.needsUpdate = true, wi = true;
            }
          }
          true === wi && (z.updateMultisampleRenderTarget(J), z.updateRenderTargetMipmap(J));
          g.setRenderTarget(Rt), g.setClearColor(W, j), g.toneMapping = Zt;
        })(ee, ue, V, K), ae && M.viewport(F.copy(ae)), ee.length > 0 && br(ee, V, K), ue.length > 0 && br(ue, V, K), xe.length > 0 && br(xe, V, K), M.buffers.depth.setTest(true), M.buffers.depth.setMask(true), M.buffers.color.setMask(true), M.setPolygonOffset(false);
      }
      function br(C, V, K) {
        const ae = true === V.isScene ? V.overrideMaterial : null;
        for (let ee = 0, ue = C.length; ee < ue; ee++) {
          const xe = C[ee], Me = xe.object, Ce = xe.geometry, Re = null === ae ? xe.material : ae, Le = xe.group;
          Me.layers.test(K.layers) && Il(Me, V, K, Ce, Re, Le);
        }
      }
      function Il(C, V, K, ae, ee, ue) {
        C.onBeforeRender(g, V, K, ae, ee, ue), C.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse, C.matrixWorld), C.normalMatrix.getNormalMatrix(C.modelViewMatrix), ee.onBeforeRender(g, V, K, ae, C, ue), true === ee.transparent && 2 === ee.side && false === ee.forceSinglePass ? (ee.side = vt, ee.needsUpdate = true, g.renderBufferDirect(K, V, ae, ee, C, ue), ee.side = _i, ee.needsUpdate = true, g.renderBufferDirect(K, V, ae, ee, C, ue), ee.side = 2) : g.renderBufferDirect(K, V, ae, ee, C, ue), C.onAfterRender(g, V, K, ae, ee, ue);
      }
      function Sr(C, V, K) {
        true !== V.isScene && (V = U);
        const ae = H.get(C), ee = m.state.lights, ue = m.state.shadowsArray, xe = ee.state.version, Me = ge.getParameters(C, ee.state, ue, V, K), Ce = ge.getProgramCacheKey(Me);
        let Re = ae.programs;
        ae.environment = C.isMeshStandardMaterial ? V.environment : null, ae.fog = V.fog, ae.envMap = (C.isMeshStandardMaterial ? he : se).get(C.envMap || ae.environment), void 0 === Re && (C.addEventListener("dispose", wl), Re = /* @__PURE__ */ new Map(), ae.programs = Re);
        let Le = Re.get(Ce);
        if (void 0 !== Le) {
          if (ae.currentProgram === Le && ae.lightsStateVersion === xe) return Ul(C, Me), Le;
        } else Me.uniforms = ge.getUniforms(C), C.onBuild(K, Me, g), C.onBeforeCompile(Me, g), Le = ge.acquireProgram(Me, Ce), Re.set(Ce, Le), ae.uniforms = Me.uniforms;
        const Ie = ae.uniforms;
        return (C.isShaderMaterial || C.isRawShaderMaterial) && true !== C.clipping || (Ie.clippingPlanes = _e.uniform), Ul(C, Me), ae.needsLights = (function(je) {
          return je.isMeshLambertMaterial || je.isMeshToonMaterial || je.isMeshPhongMaterial || je.isMeshStandardMaterial || je.isShadowMaterial || je.isShaderMaterial && true === je.lights;
        })(C), ae.lightsStateVersion = xe, ae.needsLights && (Ie.ambientLightColor.value = ee.state.ambient, Ie.lightProbe.value = ee.state.probe, Ie.directionalLights.value = ee.state.directional, Ie.directionalLightShadows.value = ee.state.directionalShadow, Ie.spotLights.value = ee.state.spot, Ie.spotLightShadows.value = ee.state.spotShadow, Ie.rectAreaLights.value = ee.state.rectArea, Ie.ltc_1.value = ee.state.rectAreaLTC1, Ie.ltc_2.value = ee.state.rectAreaLTC2, Ie.pointLights.value = ee.state.point, Ie.pointLightShadows.value = ee.state.pointShadow, Ie.hemisphereLights.value = ee.state.hemi, Ie.directionalShadowMap.value = ee.state.directionalShadowMap, Ie.directionalShadowMatrix.value = ee.state.directionalShadowMatrix, Ie.spotShadowMap.value = ee.state.spotShadowMap, Ie.spotLightMatrix.value = ee.state.spotLightMatrix, Ie.spotLightMap.value = ee.state.spotLightMap, Ie.pointShadowMap.value = ee.state.pointShadowMap, Ie.pointShadowMatrix.value = ee.state.pointShadowMatrix), ae.currentProgram = Le, ae.uniformsList = null, Le;
      }
      function Dl(C) {
        if (null === C.uniformsList) {
          const V = C.currentProgram.getUniforms();
          C.uniformsList = mn.seqWithValue(V.seq, C.uniforms);
        }
        return C.uniformsList;
      }
      function Ul(C, V) {
        const K = H.get(C);
        K.outputColorSpace = V.outputColorSpace, K.batching = V.batching, K.instancing = V.instancing, K.instancingColor = V.instancingColor, K.skinning = V.skinning, K.morphTargets = V.morphTargets, K.morphNormals = V.morphNormals, K.morphColors = V.morphColors, K.morphTargetsCount = V.morphTargetsCount, K.numClippingPlanes = V.numClippingPlanes, K.numIntersection = V.numClipIntersection, K.vertexAlphas = V.vertexAlphas, K.vertexTangents = V.vertexTangents, K.toneMapping = V.toneMapping;
      }
      Ti.setAnimationLoop((function(C) {
        Qs && Qs(C);
      })), "undefined" != typeof self && Ti.setContext(self), this.setAnimationLoop = function(C) {
        Qs = C, ot.setAnimationLoop(C), null === C ? Ti.stop() : Ti.start();
      }, ot.addEventListener("sessionstart", Al), ot.addEventListener("sessionend", Rl), this.render = function(C, V) {
        if (void 0 !== V && true !== V.isCamera) return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        if (true === w) return;
        true === C.matrixWorldAutoUpdate && C.updateMatrixWorld(), null === V.parent && true === V.matrixWorldAutoUpdate && V.updateMatrixWorld(), true === ot.enabled && true === ot.isPresenting && (true === ot.cameraAutoUpdate && ot.updateCamera(V), V = ot.getCamera()), true === C.isScene && C.onBeforeRender(g, C, V, A), m = nt.get(C, _.length), m.init(), _.push(m), L.multiplyMatrices(V.projectionMatrix, V.matrixWorldInverse), S.setFromProjectionMatrix(L), O = this.localClippingEnabled, b = _e.init(this.clippingPlanes, O), v = Te.get(C, y.length), v.init(), y.push(v), Pl(C, V, 0, g.sortObjects), v.finish(), true === g.sortObjects && v.sort(te, $), this.info.render.frame++, true === b && _e.beginShadows();
        const K = m.state.shadowsArray;
        if (Ne.render(K, C, V), true === b && _e.endShadows(), true === this.info.autoReset && this.info.reset(), Pe.render(v, C), m.setupLights(g._useLegacyLights), V.isArrayCamera) {
          const ae = V.cameras;
          for (let ee = 0, ue = ae.length; ee < ue; ee++) {
            const xe = ae[ee];
            Ll(v, C, xe, xe.viewport);
          }
        } else Ll(v, C, V);
        null !== A && (z.updateMultisampleRenderTarget(A), z.updateRenderTargetMipmap(A)), true === C.isScene && C.onAfterRender(g, C, V), yt.resetDefaultState(), N = -1, I = null, _.pop(), m = _.length > 0 ? _[_.length - 1] : null, y.pop(), v = y.length > 0 ? y[y.length - 1] : null;
      }, this.getActiveCubeFace = function() {
        return R;
      }, this.getActiveMipmapLevel = function() {
        return T;
      }, this.getRenderTarget = function() {
        return A;
      }, this.setRenderTargetTextures = function(C, V, K) {
        H.get(C.texture).__webglTexture = V, H.get(C.depthTexture).__webglTexture = K;
        const ae = H.get(C);
        ae.__hasExternalTextures = true, ae.__hasExternalTextures && (ae.__autoAllocateDepthBuffer = void 0 === K, ae.__autoAllocateDepthBuffer || true === ie.has("WEBGL_multisampled_render_to_texture") && (console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"), ae.__useRenderToTexture = false));
      }, this.setRenderTargetFramebuffer = function(C, V) {
        const K = H.get(C);
        K.__webglFramebuffer = V, K.__useDefaultFramebuffer = void 0 === V;
      }, this.setRenderTarget = function(C, V = 0, K = 0) {
        A = C, R = V, T = K;
        let ae = true, ee = null, ue = false, xe = false;
        if (C) {
          const Me = H.get(C);
          void 0 !== Me.__useDefaultFramebuffer ? (M.bindFramebuffer(q.FRAMEBUFFER, null), ae = false) : void 0 === Me.__webglFramebuffer ? z.setupRenderTarget(C) : Me.__hasExternalTextures && z.rebindTextures(C, H.get(C.texture).__webglTexture, H.get(C.depthTexture).__webglTexture);
          const Ce = C.texture;
          (Ce.isData3DTexture || Ce.isDataArrayTexture || Ce.isCompressedArrayTexture) && (xe = true);
          const Re = H.get(C).__webglFramebuffer;
          C.isWebGLCubeRenderTarget ? (ee = Array.isArray(Re[V]) ? Re[V][K] : Re[V], ue = true) : ee = Q.isWebGL2 && C.samples > 0 && false === z.useMultisampledRTT(C) ? H.get(C).__webglMultisampledFramebuffer : Array.isArray(Re) ? Re[K] : Re, F.copy(C.viewport), Z.copy(C.scissor), P = C.scissorTest;
        } else F.copy(k).multiplyScalar(ne).floor(), Z.copy(G).multiplyScalar(ne).floor(), P = ce;
        if (M.bindFramebuffer(q.FRAMEBUFFER, ee) && Q.drawBuffers && ae && M.drawBuffers(C, ee), M.viewport(F), M.scissor(Z), M.setScissorTest(P), ue) {
          const Me = H.get(C.texture);
          q.framebufferTexture2D(q.FRAMEBUFFER, q.COLOR_ATTACHMENT0, q.TEXTURE_CUBE_MAP_POSITIVE_X + V, Me.__webglTexture, K);
        } else if (xe) {
          const Me = H.get(C.texture), Ce = V || 0;
          q.framebufferTextureLayer(q.FRAMEBUFFER, q.COLOR_ATTACHMENT0, Me.__webglTexture, K || 0, Ce);
        }
        N = -1;
      }, this.readRenderTargetPixels = function(C, V, K, ae, ee, ue, xe) {
        if (!C || !C.isWebGLRenderTarget) return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        let Me = H.get(C).__webglFramebuffer;
        if (C.isWebGLCubeRenderTarget && void 0 !== xe && (Me = Me[xe]), Me) {
          M.bindFramebuffer(q.FRAMEBUFFER, Me);
          try {
            const Ce = C.texture, Re = Ce.format, Le = Ce.type;
            if (Re !== bt && St.convert(Re) !== q.getParameter(q.IMPLEMENTATION_COLOR_READ_FORMAT)) return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
            const Ie = Le === ri && (ie.has("EXT_color_buffer_half_float") || Q.isWebGL2 && ie.has("EXT_color_buffer_float"));
            if (!(Le === Ot || St.convert(Le) === q.getParameter(q.IMPLEMENTATION_COLOR_READ_TYPE) || Le === Nt && (Q.isWebGL2 || ie.has("OES_texture_float") || ie.has("WEBGL_color_buffer_float")) || Ie)) return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
            V >= 0 && V <= C.width - ae && K >= 0 && K <= C.height - ee && q.readPixels(V, K, ae, ee, St.convert(Re), St.convert(Le), ue);
          } finally {
            const Ce = null !== A ? H.get(A).__webglFramebuffer : null;
            M.bindFramebuffer(q.FRAMEBUFFER, Ce);
          }
        }
      }, this.copyFramebufferToTexture = function(C, V, K = 0) {
        const ae = Math.pow(2, -K), ee = Math.floor(V.image.width * ae), ue = Math.floor(V.image.height * ae);
        z.setTexture2D(V, 0), q.copyTexSubImage2D(q.TEXTURE_2D, K, 0, 0, C.x, C.y, ee, ue), M.unbindTexture();
      }, this.copyTextureToTexture = function(C, V, K, ae = 0) {
        const ee = V.image.width, ue = V.image.height, xe = St.convert(K.format), Me = St.convert(K.type);
        z.setTexture2D(K, 0), q.pixelStorei(q.UNPACK_FLIP_Y_WEBGL, K.flipY), q.pixelStorei(q.UNPACK_PREMULTIPLY_ALPHA_WEBGL, K.premultiplyAlpha), q.pixelStorei(q.UNPACK_ALIGNMENT, K.unpackAlignment), V.isDataTexture ? q.texSubImage2D(q.TEXTURE_2D, ae, C.x, C.y, ee, ue, xe, Me, V.image.data) : V.isCompressedTexture ? q.compressedTexSubImage2D(q.TEXTURE_2D, ae, C.x, C.y, V.mipmaps[0].width, V.mipmaps[0].height, xe, V.mipmaps[0].data) : q.texSubImage2D(q.TEXTURE_2D, ae, C.x, C.y, xe, Me, V.image), 0 === ae && K.generateMipmaps && q.generateMipmap(q.TEXTURE_2D), M.unbindTexture();
      }, this.copyTextureToTexture3D = function(C, V, K, ae, ee = 0) {
        if (g.isWebGL1Renderer) return void console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");
        const ue = C.max.x - C.min.x + 1, xe = C.max.y - C.min.y + 1, Me = C.max.z - C.min.z + 1, Ce = St.convert(ae.format), Re = St.convert(ae.type);
        let Le;
        if (ae.isData3DTexture) z.setTexture3D(ae, 0), Le = q.TEXTURE_3D;
        else {
          if (!ae.isDataArrayTexture && !ae.isCompressedArrayTexture) return void console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");
          z.setTexture2DArray(ae, 0), Le = q.TEXTURE_2D_ARRAY;
        }
        q.pixelStorei(q.UNPACK_FLIP_Y_WEBGL, ae.flipY), q.pixelStorei(q.UNPACK_PREMULTIPLY_ALPHA_WEBGL, ae.premultiplyAlpha), q.pixelStorei(q.UNPACK_ALIGNMENT, ae.unpackAlignment);
        const Ie = q.getParameter(q.UNPACK_ROW_LENGTH), je = q.getParameter(q.UNPACK_IMAGE_HEIGHT), Rt = q.getParameter(q.UNPACK_SKIP_PIXELS), Zt = q.getParameter(q.UNPACK_SKIP_ROWS), wi = q.getParameter(q.UNPACK_SKIP_IMAGES), qe = K.isCompressedTexture ? K.mipmaps[ee] : K.image;
        q.pixelStorei(q.UNPACK_ROW_LENGTH, qe.width), q.pixelStorei(q.UNPACK_IMAGE_HEIGHT, qe.height), q.pixelStorei(q.UNPACK_SKIP_PIXELS, C.min.x), q.pixelStorei(q.UNPACK_SKIP_ROWS, C.min.y), q.pixelStorei(q.UNPACK_SKIP_IMAGES, C.min.z), K.isDataTexture || K.isData3DTexture ? q.texSubImage3D(Le, ee, V.x, V.y, V.z, ue, xe, Me, Ce, Re, qe.data) : K.isCompressedArrayTexture ? (console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."), q.compressedTexSubImage3D(Le, ee, V.x, V.y, V.z, ue, xe, Me, Ce, qe.data)) : q.texSubImage3D(Le, ee, V.x, V.y, V.z, ue, xe, Me, Ce, Re, qe), q.pixelStorei(q.UNPACK_ROW_LENGTH, Ie), q.pixelStorei(q.UNPACK_IMAGE_HEIGHT, je), q.pixelStorei(q.UNPACK_SKIP_PIXELS, Rt), q.pixelStorei(q.UNPACK_SKIP_ROWS, Zt), q.pixelStorei(q.UNPACK_SKIP_IMAGES, wi), 0 === ee && ae.generateMipmaps && q.generateMipmap(Le), M.unbindTexture();
      }, this.initTexture = function(C) {
        C.isCubeTexture ? z.setTextureCube(C, 0) : C.isData3DTexture ? z.setTexture3D(C, 0) : C.isDataArrayTexture || C.isCompressedArrayTexture ? z.setTexture2DArray(C, 0) : z.setTexture2D(C, 0), M.unbindTexture();
      }, this.resetState = function() {
        R = 0, T = 0, A = null, M.reset(), yt.reset();
      }, "undefined" != typeof __THREE_DEVTOOLS__ && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
    }
    get coordinateSystem() {
      return _n;
    }
    get outputColorSpace() {
      return this._outputColorSpace;
    }
    set outputColorSpace(e) {
      this._outputColorSpace = e;
      const t = this.getContext();
      t.drawingBufferColorSpace = e === $o ? "display-p3" : "srgb", t.unpackColorSpace = ze.workingColorSpace === Hs ? "display-p3" : "srgb";
    }
    get outputEncoding() {
      return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."), this.outputColorSpace === Qe ? zi : Rh;
    }
    set outputEncoding(e) {
      console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."), this.outputColorSpace = e === zi ? Qe : si;
    }
    get useLegacyLights() {
      return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."), this._useLegacyLights;
    }
    set useLegacyLights(e) {
      console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."), this._useLegacyLights = e;
    }
  };
  var po = class extends lr {
  };
  po.prototype.isWebGL1Renderer = true;
  var Ss = class r {
    constructor(e, t = 25e-5) {
      this.isFogExp2 = true, this.name = "", this.color = new x(e), this.density = t;
    }
    clone() {
      return new r(this.color, this.density);
    }
    toJSON() {
      return { type: "FogExp2", name: this.name, color: this.color.getHex(), density: this.density };
    }
  };
  var ki = class extends _t {
    constructor() {
      super(), this.isScene = true, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.overrideMaterial = null, "undefined" != typeof __THREE_DEVTOOLS__ && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
    }
    copy(e, t) {
      return super.copy(e, t), null !== e.background && (this.background = e.background.clone()), null !== e.environment && (this.environment = e.environment.clone()), null !== e.fog && (this.fog = e.fog.clone()), this.backgroundBlurriness = e.backgroundBlurriness, this.backgroundIntensity = e.backgroundIntensity, null !== e.overrideMaterial && (this.overrideMaterial = e.overrideMaterial.clone()), this.matrixAutoUpdate = e.matrixAutoUpdate, this;
    }
    toJSON(e) {
      const t = super.toJSON(e);
      return null !== this.fog && (t.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (t.object.backgroundBlurriness = this.backgroundBlurriness), 1 !== this.backgroundIntensity && (t.object.backgroundIntensity = this.backgroundIntensity), t;
    }
  };
  var bm = new E();
  var Sm = new E();
  var Em = new E();
  var Tm = new E();
  var wm = new X();
  var Cm = new X();
  var Am = new we();
  var Rm = new E();
  var Pm = new E();
  var Lm = new E();
  var Im = new X();
  var Dm = new X();
  var Um = new X();
  var Nm = new E();
  var Om = new E();
  var Fm = new E();
  var Bm = new Ge();
  var Hm = new Ge();
  var zm = new E();
  var km = new we();
  var Vm = new E();
  var Gm = new Ht();
  var Wm = new we();
  var Xm = new yn();
  var Es = class extends Ct {
    constructor(e = null, t = 1, i = 1, n, s, a, o, l, c = 1003, h = 1003, u, d) {
      super(null, a, o, l, c, h, n, s, u, d), this.isDataTexture = true, this.image = { data: e, width: t, height: i }, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
    }
  };
  var jm = new we();
  var qm = new we();
  var Yt = class extends ke {
    constructor(e, t, i, n = 1) {
      super(e, t, i), this.isInstancedBufferAttribute = true, this.meshPerAttribute = n;
    }
    copy(e) {
      return super.copy(e), this.meshPerAttribute = e.meshPerAttribute, this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.meshPerAttribute = this.meshPerAttribute, e.isInstancedBufferAttribute = true, e;
    }
  };
  var un = new we();
  var eh = new we();
  var qr = [];
  var th = new Bt();
  var op = new we();
  var Qn = new De();
  var er = new Ht();
  var Ts = class extends De {
    constructor(e, t, i) {
      super(e, t), this.isInstancedMesh = true, this.instanceMatrix = new Yt(new Float32Array(16 * i), 16), this.instanceColor = null, this.count = i, this.boundingBox = null, this.boundingSphere = null;
      for (let n = 0; n < i; n++) this.setMatrixAt(n, op);
    }
    computeBoundingBox() {
      const e = this.geometry, t = this.count;
      null === this.boundingBox && (this.boundingBox = new Bt()), null === e.boundingBox && e.computeBoundingBox(), this.boundingBox.makeEmpty();
      for (let i = 0; i < t; i++) this.getMatrixAt(i, un), th.copy(e.boundingBox).applyMatrix4(un), this.boundingBox.union(th);
    }
    computeBoundingSphere() {
      const e = this.geometry, t = this.count;
      null === this.boundingSphere && (this.boundingSphere = new Ht()), null === e.boundingSphere && e.computeBoundingSphere(), this.boundingSphere.makeEmpty();
      for (let i = 0; i < t; i++) this.getMatrixAt(i, un), er.copy(e.boundingSphere).applyMatrix4(un), this.boundingSphere.union(er);
    }
    copy(e, t) {
      return super.copy(e, t), this.instanceMatrix.copy(e.instanceMatrix), null !== e.instanceColor && (this.instanceColor = e.instanceColor.clone()), this.count = e.count, null !== e.boundingBox && (this.boundingBox = e.boundingBox.clone()), null !== e.boundingSphere && (this.boundingSphere = e.boundingSphere.clone()), this;
    }
    getColorAt(e, t) {
      t.fromArray(this.instanceColor.array, 3 * e);
    }
    getMatrixAt(e, t) {
      t.fromArray(this.instanceMatrix.array, 16 * e);
    }
    raycast(e, t) {
      const i = this.matrixWorld, n = this.count;
      if (Qn.geometry = this.geometry, Qn.material = this.material, void 0 !== Qn.material && (null === this.boundingSphere && this.computeBoundingSphere(), er.copy(this.boundingSphere), er.applyMatrix4(i), false !== e.ray.intersectsSphere(er))) for (let s = 0; s < n; s++) {
        this.getMatrixAt(s, un), eh.multiplyMatrices(i, un), Qn.matrixWorld = eh, Qn.raycast(e, qr);
        for (let a = 0, o = qr.length; a < o; a++) {
          const l = qr[a];
          l.instanceId = s, l.object = this, t.push(l);
        }
        qr.length = 0;
      }
    }
    setColorAt(e, t) {
      null === this.instanceColor && (this.instanceColor = new Yt(new Float32Array(3 * this.instanceMatrix.count), 3)), t.toArray(this.instanceColor.array, 3 * e);
    }
    setMatrixAt(e, t) {
      t.toArray(this.instanceMatrix.array, 16 * e);
    }
    updateMorphTargets() {
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
  };
  var mo = class {
    constructor() {
      this.index = 0, this.pool = [], this.list = [];
    }
    push(e, t) {
      const i = this.pool, n = this.list;
      this.index >= i.length && i.push({ start: -1, count: -1, z: -1 });
      const s = i[this.index];
      n.push(s), this.index++, s.start = e.start, s.count = e.count, s.z = t;
    }
    reset() {
      this.list.length = 0, this.index = 0;
    }
  };
  var Ym = new we();
  var Zm = new we();
  var Jm = new we();
  var Km = new we();
  var $m = new bn();
  var Qm = new Bt();
  var ef = new Ht();
  var tf = new E();
  var nf = new mo();
  var rf = new De();
  var fo = class extends ai {
    constructor(e) {
      super(), this.isLineBasicMaterial = true, this.type = "LineBasicMaterial", this.color = new x(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = true, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.color.copy(e.color), this.map = e.map, this.linewidth = e.linewidth, this.linecap = e.linecap, this.linejoin = e.linejoin, this.fog = e.fog, this;
    }
  };
  var ih = new E();
  var nh = new E();
  var rh = new we();
  var Ua = new yn();
  var Yr = new Ht();
  var ws = class extends _t {
    constructor(e = new Be(), t = new fo()) {
      super(), this.isLine = true, this.type = "Line", this.geometry = e, this.material = t, this.updateMorphTargets();
    }
    copy(e, t) {
      return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
    }
    computeLineDistances() {
      const e = this.geometry;
      if (null === e.index) {
        const t = e.attributes.position, i = [0];
        for (let n = 1, s = t.count; n < s; n++) ih.fromBufferAttribute(t, n - 1), nh.fromBufferAttribute(t, n), i[n] = i[n - 1], i[n] += ih.distanceTo(nh);
        e.setAttribute("lineDistance", new ye(i, 1));
      } else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
      return this;
    }
    raycast(e, t) {
      const i = this.geometry, n = this.matrixWorld, s = e.params.Line.threshold, a = i.drawRange;
      if (null === i.boundingSphere && i.computeBoundingSphere(), Yr.copy(i.boundingSphere), Yr.applyMatrix4(n), Yr.radius += s, false === e.ray.intersectsSphere(Yr)) return;
      rh.copy(n).invert(), Ua.copy(e.ray).applyMatrix4(rh);
      const o = s / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = o * o, c = new E(), h = new E(), u = new E(), d = new E(), p = this.isLineSegments ? 2 : 1, f = i.index, v = i.attributes.position;
      if (null !== f) {
        for (let m = Math.max(0, a.start), y = Math.min(f.count, a.start + a.count) - 1; m < y; m += p) {
          const _ = f.getX(m), g = f.getX(m + 1);
          c.fromBufferAttribute(v, _), h.fromBufferAttribute(v, g);
          if (Ua.distanceSqToSegment(c, h, d, u) > l) continue;
          d.applyMatrix4(this.matrixWorld);
          const w = e.ray.origin.distanceTo(d);
          w < e.near || w > e.far || t.push({ distance: w, point: u.clone().applyMatrix4(this.matrixWorld), index: m, face: null, faceIndex: null, object: this });
        }
      } else {
        for (let m = Math.max(0, a.start), y = Math.min(v.count, a.start + a.count) - 1; m < y; m += p) {
          c.fromBufferAttribute(v, m), h.fromBufferAttribute(v, m + 1);
          if (Ua.distanceSqToSegment(c, h, d, u) > l) continue;
          d.applyMatrix4(this.matrixWorld);
          const _ = e.ray.origin.distanceTo(d);
          _ < e.near || _ > e.far || t.push({ distance: _, point: u.clone().applyMatrix4(this.matrixWorld), index: m, face: null, faceIndex: null, object: this });
        }
      }
    }
    updateMorphTargets() {
      const e = this.geometry.morphAttributes, t = Object.keys(e);
      if (t.length > 0) {
        const i = e[t[0]];
        if (void 0 !== i) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let n = 0, s = i.length; n < s; n++) {
            const a = i[n].name || String(n);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[a] = n;
          }
        }
      }
    }
  };
  var sf = new E();
  var af = new E();
  var go = class extends ai {
    constructor(e) {
      super(), this.isPointsMaterial = true, this.type = "PointsMaterial", this.color = new x(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = true, this.fog = true, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.size = e.size, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
    }
  };
  var sh = new we();
  var vo = new yn();
  var Zr = new Ht();
  var Jr = new E();
  var Mi = class extends _t {
    constructor(e = new Be(), t = new go()) {
      super(), this.isPoints = true, this.type = "Points", this.geometry = e, this.material = t, this.updateMorphTargets();
    }
    copy(e, t) {
      return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
    }
    raycast(e, t) {
      const i = this.geometry, n = this.matrixWorld, s = e.params.Points.threshold, a = i.drawRange;
      if (null === i.boundingSphere && i.computeBoundingSphere(), Zr.copy(i.boundingSphere), Zr.applyMatrix4(n), Zr.radius += s, false === e.ray.intersectsSphere(Zr)) return;
      sh.copy(n).invert(), vo.copy(e.ray).applyMatrix4(sh);
      const o = s / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = o * o, c = i.index, h = i.attributes.position;
      if (null !== c) {
        for (let u = Math.max(0, a.start), d = Math.min(c.count, a.start + a.count); u < d; u++) {
          const p = c.getX(u);
          Jr.fromBufferAttribute(h, p), ah(Jr, p, l, n, e, t, this);
        }
      } else {
        for (let u = Math.max(0, a.start), d = Math.min(h.count, a.start + a.count); u < d; u++) Jr.fromBufferAttribute(h, u), ah(Jr, u, l, n, e, t, this);
      }
    }
    updateMorphTargets() {
      const e = this.geometry.morphAttributes, t = Object.keys(e);
      if (t.length > 0) {
        const i = e[t[0]];
        if (void 0 !== i) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let n = 0, s = i.length; n < s; n++) {
            const a = i[n].name || String(n);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[a] = n;
          }
        }
      }
    }
  };
  function ah(r, e, t, i, n, s, a) {
    const o = vo.distanceSqToPoint(r);
    if (o < t) {
      const l = new E();
      vo.closestPointToPoint(r, l), l.applyMatrix4(i);
      const c = n.ray.origin.distanceTo(l);
      if (c < n.near || c > n.far) return;
      s.push({ distance: c, distanceToRay: Math.sqrt(o), point: l, index: e, face: null, object: a });
    }
  }
  var At = class {
    constructor() {
      this.type = "Curve", this.arcLengthDivisions = 200;
    }
    getPoint() {
      return console.warn("THREE.Curve: .getPoint() not implemented."), null;
    }
    getPointAt(e, t) {
      const i = this.getUtoTmapping(e);
      return this.getPoint(i, t);
    }
    getPoints(e = 5) {
      const t = [];
      for (let i = 0; i <= e; i++) t.push(this.getPoint(i / e));
      return t;
    }
    getSpacedPoints(e = 5) {
      const t = [];
      for (let i = 0; i <= e; i++) t.push(this.getPointAt(i / e));
      return t;
    }
    getLength() {
      const e = this.getLengths();
      return e[e.length - 1];
    }
    getLengths(e = this.arcLengthDivisions) {
      if (this.cacheArcLengths && this.cacheArcLengths.length === e + 1 && !this.needsUpdate) return this.cacheArcLengths;
      this.needsUpdate = false;
      const t = [];
      let i, n = this.getPoint(0), s = 0;
      t.push(0);
      for (let a = 1; a <= e; a++) i = this.getPoint(a / e), s += i.distanceTo(n), t.push(s), n = i;
      return this.cacheArcLengths = t, t;
    }
    updateArcLengths() {
      this.needsUpdate = true, this.getLengths();
    }
    getUtoTmapping(e, t) {
      const i = this.getLengths();
      let n = 0;
      const s = i.length;
      let a;
      a = t || e * i[s - 1];
      let o, l = 0, c = s - 1;
      for (; l <= c; ) if (n = Math.floor(l + (c - l) / 2), o = i[n] - a, o < 0) l = n + 1;
      else {
        if (!(o > 0)) {
          c = n;
          break;
        }
        c = n - 1;
      }
      if (n = c, i[n] === a) return n / (s - 1);
      const h = i[n];
      return (n + (a - h) / (i[n + 1] - h)) / (s - 1);
    }
    getTangent(e, t) {
      const i = 1e-4;
      let n = e - i, s = e + i;
      n < 0 && (n = 0), s > 1 && (s = 1);
      const a = this.getPoint(n), o = this.getPoint(s), l = t || (a.isVector2 ? new X() : new E());
      return l.copy(o).sub(a).normalize(), l;
    }
    getTangentAt(e, t) {
      const i = this.getUtoTmapping(e);
      return this.getTangent(i, t);
    }
    computeFrenetFrames(e, t) {
      const i = new E(), n = [], s = [], a = [], o = new E(), l = new we();
      for (let p = 0; p <= e; p++) {
        const f = p / e;
        n[p] = this.getTangentAt(f, new E());
      }
      s[0] = new E(), a[0] = new E();
      let c = Number.MAX_VALUE;
      const h = Math.abs(n[0].x), u = Math.abs(n[0].y), d = Math.abs(n[0].z);
      h <= c && (c = h, i.set(1, 0, 0)), u <= c && (c = u, i.set(0, 1, 0)), d <= c && i.set(0, 0, 1), o.crossVectors(n[0], i).normalize(), s[0].crossVectors(n[0], o), a[0].crossVectors(n[0], s[0]);
      for (let p = 1; p <= e; p++) {
        if (s[p] = s[p - 1].clone(), a[p] = a[p - 1].clone(), o.crossVectors(n[p - 1], n[p]), o.length() > Number.EPSILON) {
          o.normalize();
          const f = Math.acos(st(n[p - 1].dot(n[p]), -1, 1));
          s[p].applyMatrix4(l.makeRotationAxis(o, f));
        }
        a[p].crossVectors(n[p], s[p]);
      }
      if (true === t) {
        let p = Math.acos(st(s[0].dot(s[e]), -1, 1));
        p /= e, n[0].dot(o.crossVectors(s[0], s[e])) > 0 && (p = -p);
        for (let f = 1; f <= e; f++) s[f].applyMatrix4(l.makeRotationAxis(n[f], p * f)), a[f].crossVectors(n[f], s[f]);
      }
      return { tangents: n, normals: s, binormals: a };
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      return this.arcLengthDivisions = e.arcLengthDivisions, this;
    }
    toJSON() {
      const e = { metadata: { version: 4.6, type: "Curve", generator: "Curve.toJSON" } };
      return e.arcLengthDivisions = this.arcLengthDivisions, e.type = this.type, e;
    }
    fromJSON(e) {
      return this.arcLengthDivisions = e.arcLengthDivisions, this;
    }
  };
  var cr = class extends At {
    constructor(e = 0, t = 0, i = 1, n = 1, s = 0, a = 2 * Math.PI, o = false, l = 0) {
      super(), this.isEllipseCurve = true, this.type = "EllipseCurve", this.aX = e, this.aY = t, this.xRadius = i, this.yRadius = n, this.aStartAngle = s, this.aEndAngle = a, this.aClockwise = o, this.aRotation = l;
    }
    getPoint(e, t) {
      const i = t || new X(), n = 2 * Math.PI;
      let s = this.aEndAngle - this.aStartAngle;
      const a = Math.abs(s) < Number.EPSILON;
      for (; s < 0; ) s += n;
      for (; s > n; ) s -= n;
      s < Number.EPSILON && (s = a ? 0 : n), true !== this.aClockwise || a || (s === n ? s = -n : s -= n);
      const o = this.aStartAngle + e * s;
      let l = this.aX + this.xRadius * Math.cos(o), c = this.aY + this.yRadius * Math.sin(o);
      if (0 !== this.aRotation) {
        const h = Math.cos(this.aRotation), u = Math.sin(this.aRotation), d = l - this.aX, p = c - this.aY;
        l = d * h - p * u + this.aX, c = d * u + p * h + this.aY;
      }
      return i.set(l, c);
    }
    copy(e) {
      return super.copy(e), this.aX = e.aX, this.aY = e.aY, this.xRadius = e.xRadius, this.yRadius = e.yRadius, this.aStartAngle = e.aStartAngle, this.aEndAngle = e.aEndAngle, this.aClockwise = e.aClockwise, this.aRotation = e.aRotation, this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.aX = this.aX, e.aY = this.aY, e.xRadius = this.xRadius, e.yRadius = this.yRadius, e.aStartAngle = this.aStartAngle, e.aEndAngle = this.aEndAngle, e.aClockwise = this.aClockwise, e.aRotation = this.aRotation, e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.aX = e.aX, this.aY = e.aY, this.xRadius = e.xRadius, this.yRadius = e.yRadius, this.aStartAngle = e.aStartAngle, this.aEndAngle = e.aEndAngle, this.aClockwise = e.aClockwise, this.aRotation = e.aRotation, this;
    }
  };
  var _o = class extends cr {
    constructor(e, t, i, n, s, a) {
      super(e, t, i, i, n, s, a), this.isArcCurve = true, this.type = "ArcCurve";
    }
  };
  function el() {
    let r = 0, e = 0, t = 0, i = 0;
    function n(s, a, o, l) {
      r = s, e = o, t = -3 * s + 3 * a - 2 * o - l, i = 2 * s - 2 * a + o + l;
    }
    return { initCatmullRom: function(s, a, o, l, c) {
      n(a, o, c * (o - s), c * (l - a));
    }, initNonuniformCatmullRom: function(s, a, o, l, c, h, u) {
      let d = (a - s) / c - (o - s) / (c + h) + (o - a) / h, p = (o - a) / h - (l - a) / (h + u) + (l - o) / u;
      d *= h, p *= h, n(a, o, d, p);
    }, calc: function(s) {
      const a = s * s;
      return r + e * s + t * a + i * (a * s);
    } };
  }
  var Kr = new E();
  var Na = new el();
  var Oa = new el();
  var Fa = new el();
  var yo = class extends At {
    constructor(e = [], t = false, i = "centripetal", n = 0.5) {
      super(), this.isCatmullRomCurve3 = true, this.type = "CatmullRomCurve3", this.points = e, this.closed = t, this.curveType = i, this.tension = n;
    }
    getPoint(e, t = new E()) {
      const i = t, n = this.points, s = n.length, a = (s - (this.closed ? 0 : 1)) * e;
      let o, l, c = Math.floor(a), h = a - c;
      this.closed ? c += c > 0 ? 0 : (Math.floor(Math.abs(c) / s) + 1) * s : 0 === h && c === s - 1 && (c = s - 2, h = 1), this.closed || c > 0 ? o = n[(c - 1) % s] : (Kr.subVectors(n[0], n[1]).add(n[0]), o = Kr);
      const u = n[c % s], d = n[(c + 1) % s];
      if (this.closed || c + 2 < s ? l = n[(c + 2) % s] : (Kr.subVectors(n[s - 1], n[s - 2]).add(n[s - 1]), l = Kr), "centripetal" === this.curveType || "chordal" === this.curveType) {
        const p = "chordal" === this.curveType ? 0.5 : 0.25;
        let f = Math.pow(o.distanceToSquared(u), p), v = Math.pow(u.distanceToSquared(d), p), m = Math.pow(d.distanceToSquared(l), p);
        v < 1e-4 && (v = 1), f < 1e-4 && (f = v), m < 1e-4 && (m = v), Na.initNonuniformCatmullRom(o.x, u.x, d.x, l.x, f, v, m), Oa.initNonuniformCatmullRom(o.y, u.y, d.y, l.y, f, v, m), Fa.initNonuniformCatmullRom(o.z, u.z, d.z, l.z, f, v, m);
      } else "catmullrom" === this.curveType && (Na.initCatmullRom(o.x, u.x, d.x, l.x, this.tension), Oa.initCatmullRom(o.y, u.y, d.y, l.y, this.tension), Fa.initCatmullRom(o.z, u.z, d.z, l.z, this.tension));
      return i.set(Na.calc(h), Oa.calc(h), Fa.calc(h)), i;
    }
    copy(e) {
      super.copy(e), this.points = [];
      for (let t = 0, i = e.points.length; t < i; t++) {
        const n = e.points[t];
        this.points.push(n.clone());
      }
      return this.closed = e.closed, this.curveType = e.curveType, this.tension = e.tension, this;
    }
    toJSON() {
      const e = super.toJSON();
      e.points = [];
      for (let t = 0, i = this.points.length; t < i; t++) {
        const n = this.points[t];
        e.points.push(n.toArray());
      }
      return e.closed = this.closed, e.curveType = this.curveType, e.tension = this.tension, e;
    }
    fromJSON(e) {
      super.fromJSON(e), this.points = [];
      for (let t = 0, i = e.points.length; t < i; t++) {
        const n = e.points[t];
        this.points.push(new E().fromArray(n));
      }
      return this.closed = e.closed, this.curveType = e.curveType, this.tension = e.tension, this;
    }
  };
  function oh(r, e, t, i, n) {
    const s = 0.5 * (i - e), a = 0.5 * (n - t), o = r * r;
    return (2 * t - 2 * i + s + a) * (r * o) + (-3 * t + 3 * i - 2 * s - a) * o + s * r + t;
  }
  function rr(r, e, t, i) {
    return (function(n, s) {
      const a = 1 - n;
      return a * a * s;
    })(r, e) + (function(n, s) {
      return 2 * (1 - n) * n * s;
    })(r, t) + (function(n, s) {
      return n * n * s;
    })(r, i);
  }
  function sr(r, e, t, i, n) {
    return (function(s, a) {
      const o = 1 - s;
      return o * o * o * a;
    })(r, e) + (function(s, a) {
      const o = 1 - s;
      return 3 * o * o * s * a;
    })(r, t) + (function(s, a) {
      return 3 * (1 - s) * s * s * a;
    })(r, i) + (function(s, a) {
      return s * s * s * a;
    })(r, n);
  }
  var Cs = class extends At {
    constructor(e = new X(), t = new X(), i = new X(), n = new X()) {
      super(), this.isCubicBezierCurve = true, this.type = "CubicBezierCurve", this.v0 = e, this.v1 = t, this.v2 = i, this.v3 = n;
    }
    getPoint(e, t = new X()) {
      const i = t, n = this.v0, s = this.v1, a = this.v2, o = this.v3;
      return i.set(sr(e, n.x, s.x, a.x, o.x), sr(e, n.y, s.y, a.y, o.y)), i;
    }
    copy(e) {
      return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this.v3.copy(e.v3), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e.v3 = this.v3.toArray(), e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this.v3.fromArray(e.v3), this;
    }
  };
  var xo = class extends At {
    constructor(e = new E(), t = new E(), i = new E(), n = new E()) {
      super(), this.isCubicBezierCurve3 = true, this.type = "CubicBezierCurve3", this.v0 = e, this.v1 = t, this.v2 = i, this.v3 = n;
    }
    getPoint(e, t = new E()) {
      const i = t, n = this.v0, s = this.v1, a = this.v2, o = this.v3;
      return i.set(sr(e, n.x, s.x, a.x, o.x), sr(e, n.y, s.y, a.y, o.y), sr(e, n.z, s.z, a.z, o.z)), i;
    }
    copy(e) {
      return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this.v3.copy(e.v3), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e.v3 = this.v3.toArray(), e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this.v3.fromArray(e.v3), this;
    }
  };
  var As = class extends At {
    constructor(e = new X(), t = new X()) {
      super(), this.isLineCurve = true, this.type = "LineCurve", this.v1 = e, this.v2 = t;
    }
    getPoint(e, t = new X()) {
      const i = t;
      return 1 === e ? i.copy(this.v2) : (i.copy(this.v2).sub(this.v1), i.multiplyScalar(e).add(this.v1)), i;
    }
    getPointAt(e, t) {
      return this.getPoint(e, t);
    }
    getTangent(e, t = new X()) {
      return t.subVectors(this.v2, this.v1).normalize();
    }
    getTangentAt(e, t) {
      return this.getTangent(e, t);
    }
    copy(e) {
      return super.copy(e), this.v1.copy(e.v1), this.v2.copy(e.v2), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this;
    }
  };
  var Mo = class extends At {
    constructor(e = new E(), t = new E()) {
      super(), this.isLineCurve3 = true, this.type = "LineCurve3", this.v1 = e, this.v2 = t;
    }
    getPoint(e, t = new E()) {
      const i = t;
      return 1 === e ? i.copy(this.v2) : (i.copy(this.v2).sub(this.v1), i.multiplyScalar(e).add(this.v1)), i;
    }
    getPointAt(e, t) {
      return this.getPoint(e, t);
    }
    getTangent(e, t = new E()) {
      return t.subVectors(this.v2, this.v1).normalize();
    }
    getTangentAt(e, t) {
      return this.getTangent(e, t);
    }
    copy(e) {
      return super.copy(e), this.v1.copy(e.v1), this.v2.copy(e.v2), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this;
    }
  };
  var Rs = class extends At {
    constructor(e = new X(), t = new X(), i = new X()) {
      super(), this.isQuadraticBezierCurve = true, this.type = "QuadraticBezierCurve", this.v0 = e, this.v1 = t, this.v2 = i;
    }
    getPoint(e, t = new X()) {
      const i = t, n = this.v0, s = this.v1, a = this.v2;
      return i.set(rr(e, n.x, s.x, a.x), rr(e, n.y, s.y, a.y)), i;
    }
    copy(e) {
      return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this;
    }
  };
  var Ps = class extends At {
    constructor(e = new E(), t = new E(), i = new E()) {
      super(), this.isQuadraticBezierCurve3 = true, this.type = "QuadraticBezierCurve3", this.v0 = e, this.v1 = t, this.v2 = i;
    }
    getPoint(e, t = new E()) {
      const i = t, n = this.v0, s = this.v1, a = this.v2;
      return i.set(rr(e, n.x, s.x, a.x), rr(e, n.y, s.y, a.y), rr(e, n.z, s.z, a.z)), i;
    }
    copy(e) {
      return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this;
    }
  };
  var Ls = class extends At {
    constructor(e = []) {
      super(), this.isSplineCurve = true, this.type = "SplineCurve", this.points = e;
    }
    getPoint(e, t = new X()) {
      const i = t, n = this.points, s = (n.length - 1) * e, a = Math.floor(s), o = s - a, l = n[0 === a ? a : a - 1], c = n[a], h = n[a > n.length - 2 ? n.length - 1 : a + 1], u = n[a > n.length - 3 ? n.length - 1 : a + 2];
      return i.set(oh(o, l.x, c.x, h.x, u.x), oh(o, l.y, c.y, h.y, u.y)), i;
    }
    copy(e) {
      super.copy(e), this.points = [];
      for (let t = 0, i = e.points.length; t < i; t++) {
        const n = e.points[t];
        this.points.push(n.clone());
      }
      return this;
    }
    toJSON() {
      const e = super.toJSON();
      e.points = [];
      for (let t = 0, i = this.points.length; t < i; t++) {
        const n = this.points[t];
        e.points.push(n.toArray());
      }
      return e;
    }
    fromJSON(e) {
      super.fromJSON(e), this.points = [];
      for (let t = 0, i = e.points.length; t < i; t++) {
        const n = e.points[t];
        this.points.push(new X().fromArray(n));
      }
      return this;
    }
  };
  var Is = Object.freeze({ __proto__: null, ArcCurve: _o, CatmullRomCurve3: yo, CubicBezierCurve: Cs, CubicBezierCurve3: xo, EllipseCurve: cr, LineCurve: As, LineCurve3: Mo, QuadraticBezierCurve: Rs, QuadraticBezierCurve3: Ps, SplineCurve: Ls });
  var bo = class extends At {
    constructor() {
      super(), this.type = "CurvePath", this.curves = [], this.autoClose = false;
    }
    add(e) {
      this.curves.push(e);
    }
    closePath() {
      const e = this.curves[0].getPoint(0), t = this.curves[this.curves.length - 1].getPoint(1);
      if (!e.equals(t)) {
        const i = true === e.isVector2 ? "LineCurve" : "LineCurve3";
        this.curves.push(new Is[i](t, e));
      }
      return this;
    }
    getPoint(e, t) {
      const i = e * this.getLength(), n = this.getCurveLengths();
      let s = 0;
      for (; s < n.length; ) {
        if (n[s] >= i) {
          const a = n[s] - i, o = this.curves[s], l = o.getLength(), c = 0 === l ? 0 : 1 - a / l;
          return o.getPointAt(c, t);
        }
        s++;
      }
      return null;
    }
    getLength() {
      const e = this.getCurveLengths();
      return e[e.length - 1];
    }
    updateArcLengths() {
      this.needsUpdate = true, this.cacheLengths = null, this.getCurveLengths();
    }
    getCurveLengths() {
      if (this.cacheLengths && this.cacheLengths.length === this.curves.length) return this.cacheLengths;
      const e = [];
      let t = 0;
      for (let i = 0, n = this.curves.length; i < n; i++) t += this.curves[i].getLength(), e.push(t);
      return this.cacheLengths = e, e;
    }
    getSpacedPoints(e = 40) {
      const t = [];
      for (let i = 0; i <= e; i++) t.push(this.getPoint(i / e));
      return this.autoClose && t.push(t[0]), t;
    }
    getPoints(e = 12) {
      const t = [];
      let i;
      for (let n = 0, s = this.curves; n < s.length; n++) {
        const a = s[n], o = a.isEllipseCurve ? 2 * e : a.isLineCurve || a.isLineCurve3 ? 1 : a.isSplineCurve ? e * a.points.length : e, l = a.getPoints(o);
        for (let c = 0; c < l.length; c++) {
          const h = l[c];
          i && i.equals(h) || (t.push(h), i = h);
        }
      }
      return this.autoClose && t.length > 1 && !t[t.length - 1].equals(t[0]) && t.push(t[0]), t;
    }
    copy(e) {
      super.copy(e), this.curves = [];
      for (let t = 0, i = e.curves.length; t < i; t++) {
        const n = e.curves[t];
        this.curves.push(n.clone());
      }
      return this.autoClose = e.autoClose, this;
    }
    toJSON() {
      const e = super.toJSON();
      e.autoClose = this.autoClose, e.curves = [];
      for (let t = 0, i = this.curves.length; t < i; t++) {
        const n = this.curves[t];
        e.curves.push(n.toJSON());
      }
      return e;
    }
    fromJSON(e) {
      super.fromJSON(e), this.autoClose = e.autoClose, this.curves = [];
      for (let t = 0, i = e.curves.length; t < i; t++) {
        const n = e.curves[t];
        this.curves.push(new Is[n.type]().fromJSON(n));
      }
      return this;
    }
  };
  var hr = class extends bo {
    constructor(e) {
      super(), this.type = "Path", this.currentPoint = new X(), e && this.setFromPoints(e);
    }
    setFromPoints(e) {
      this.moveTo(e[0].x, e[0].y);
      for (let t = 1, i = e.length; t < i; t++) this.lineTo(e[t].x, e[t].y);
      return this;
    }
    moveTo(e, t) {
      return this.currentPoint.set(e, t), this;
    }
    lineTo(e, t) {
      const i = new As(this.currentPoint.clone(), new X(e, t));
      return this.curves.push(i), this.currentPoint.set(e, t), this;
    }
    quadraticCurveTo(e, t, i, n) {
      const s = new Rs(this.currentPoint.clone(), new X(e, t), new X(i, n));
      return this.curves.push(s), this.currentPoint.set(i, n), this;
    }
    bezierCurveTo(e, t, i, n, s, a) {
      const o = new Cs(this.currentPoint.clone(), new X(e, t), new X(i, n), new X(s, a));
      return this.curves.push(o), this.currentPoint.set(s, a), this;
    }
    splineThru(e) {
      const t = [this.currentPoint.clone()].concat(e), i = new Ls(t);
      return this.curves.push(i), this.currentPoint.copy(e[e.length - 1]), this;
    }
    arc(e, t, i, n, s, a) {
      const o = this.currentPoint.x, l = this.currentPoint.y;
      return this.absarc(e + o, t + l, i, n, s, a), this;
    }
    absarc(e, t, i, n, s, a) {
      return this.absellipse(e, t, i, i, n, s, a), this;
    }
    ellipse(e, t, i, n, s, a, o, l) {
      const c = this.currentPoint.x, h = this.currentPoint.y;
      return this.absellipse(e + c, t + h, i, n, s, a, o, l), this;
    }
    absellipse(e, t, i, n, s, a, o, l) {
      const c = new cr(e, t, i, n, s, a, o, l);
      if (this.curves.length > 0) {
        const u = c.getPoint(0);
        u.equals(this.currentPoint) || this.lineTo(u.x, u.y);
      }
      this.curves.push(c);
      const h = c.getPoint(1);
      return this.currentPoint.copy(h), this;
    }
    copy(e) {
      return super.copy(e), this.currentPoint.copy(e.currentPoint), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.currentPoint = this.currentPoint.toArray(), e;
    }
    fromJSON(e) {
      return super.fromJSON(e), this.currentPoint.fromArray(e.currentPoint), this;
    }
  };
  var Ds = class r extends Be {
    constructor(e = [new X(0, -0.5), new X(0.5, 0), new X(0, 0.5)], t = 12, i = 0, n = 2 * Math.PI) {
      super(), this.type = "LatheGeometry", this.parameters = { points: e, segments: t, phiStart: i, phiLength: n }, t = Math.floor(t), n = st(n, 0, 2 * Math.PI);
      const s = [], a = [], o = [], l = [], c = [], h = 1 / t, u = new E(), d = new X(), p = new E(), f = new E(), v = new E();
      let m = 0, y = 0;
      for (let _ = 0; _ <= e.length - 1; _++) switch (_) {
        case 0:
          m = e[_ + 1].x - e[_].x, y = e[_ + 1].y - e[_].y, p.x = 1 * y, p.y = -m, p.z = 0 * y, v.copy(p), p.normalize(), l.push(p.x, p.y, p.z);
          break;
        case e.length - 1:
          l.push(v.x, v.y, v.z);
          break;
        default:
          m = e[_ + 1].x - e[_].x, y = e[_ + 1].y - e[_].y, p.x = 1 * y, p.y = -m, p.z = 0 * y, f.copy(p), p.x += v.x, p.y += v.y, p.z += v.z, p.normalize(), l.push(p.x, p.y, p.z), v.copy(f);
      }
      for (let _ = 0; _ <= t; _++) {
        const g = i + _ * h * n, w = Math.sin(g), R = Math.cos(g);
        for (let T = 0; T <= e.length - 1; T++) {
          u.x = e[T].x * w, u.y = e[T].y, u.z = e[T].x * R, a.push(u.x, u.y, u.z), d.x = _ / t, d.y = T / (e.length - 1), o.push(d.x, d.y);
          const A = l[3 * T + 0] * w, N = l[3 * T + 1], I = l[3 * T + 0] * R;
          c.push(A, N, I);
        }
      }
      for (let _ = 0; _ < t; _++) for (let g = 0; g < e.length - 1; g++) {
        const w = g + _ * e.length, R = w, T = w + e.length, A = w + e.length + 1, N = w + 1;
        s.push(R, T, N), s.push(A, N, T);
      }
      this.setIndex(s), this.setAttribute("position", new ye(a, 3)), this.setAttribute("uv", new ye(o, 2)), this.setAttribute("normal", new ye(c, 3));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new r(e.points, e.segments, e.phiStart, e.phiLength);
    }
  };
  var So = class r extends Ds {
    constructor(e = 1, t = 1, i = 4, n = 8) {
      const s = new hr();
      s.absarc(0, -t / 2, e, 1.5 * Math.PI, 0), s.absarc(0, t / 2, e, 0, 0.5 * Math.PI), super(s.getPoints(i), n), this.type = "CapsuleGeometry", this.parameters = { radius: e, length: t, capSegments: i, radialSegments: n };
    }
    static fromJSON(e) {
      return new r(e.radius, e.length, e.capSegments, e.radialSegments);
    }
  };
  var Eo = class r extends Be {
    constructor(e = 1, t = 32, i = 0, n = 2 * Math.PI) {
      super(), this.type = "CircleGeometry", this.parameters = { radius: e, segments: t, thetaStart: i, thetaLength: n }, t = Math.max(3, t);
      const s = [], a = [], o = [], l = [], c = new E(), h = new X();
      a.push(0, 0, 0), o.push(0, 0, 1), l.push(0.5, 0.5);
      for (let u = 0, d = 3; u <= t; u++, d += 3) {
        const p = i + u / t * n;
        c.x = e * Math.cos(p), c.y = e * Math.sin(p), a.push(c.x, c.y, c.z), o.push(0, 0, 1), h.x = (a[d] / e + 1) / 2, h.y = (a[d + 1] / e + 1) / 2, l.push(h.x, h.y);
      }
      for (let u = 1; u <= t; u++) s.push(u, u + 1, 0);
      this.setIndex(s), this.setAttribute("position", new ye(a, 3)), this.setAttribute("normal", new ye(o, 3)), this.setAttribute("uv", new ye(l, 2));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new r(e.radius, e.segments, e.thetaStart, e.thetaLength);
    }
  };
  var Us = class r extends Be {
    constructor(e = 1, t = 1, i = 1, n = 32, s = 1, a = false, o = 0, l = 2 * Math.PI) {
      super(), this.type = "CylinderGeometry", this.parameters = { radiusTop: e, radiusBottom: t, height: i, radialSegments: n, heightSegments: s, openEnded: a, thetaStart: o, thetaLength: l };
      const c = this;
      n = Math.floor(n), s = Math.floor(s);
      const h = [], u = [], d = [], p = [];
      let f = 0;
      const v = [], m = i / 2;
      let y = 0;
      function _(g) {
        const w = f, R = new X(), T = new E();
        let A = 0;
        const N = true === g ? e : t, I = true === g ? 1 : -1;
        for (let Z = 1; Z <= n; Z++) u.push(0, m * I, 0), d.push(0, I, 0), p.push(0.5, 0.5), f++;
        const F = f;
        for (let Z = 0; Z <= n; Z++) {
          const P = Z / n * l + o, W = Math.cos(P), j = Math.sin(P);
          T.x = N * j, T.y = m * I, T.z = N * W, u.push(T.x, T.y, T.z), d.push(0, I, 0), R.x = 0.5 * W + 0.5, R.y = 0.5 * j * I + 0.5, p.push(R.x, R.y), f++;
        }
        for (let Z = 0; Z < n; Z++) {
          const P = w + Z, W = F + Z;
          true === g ? h.push(W, W + 1, P) : h.push(W + 1, W, P), A += 3;
        }
        c.addGroup(y, A, true === g ? 1 : 2), y += A;
      }
      !(function() {
        const g = new E(), w = new E();
        let R = 0;
        const T = (t - e) / i;
        for (let A = 0; A <= s; A++) {
          const N = [], I = A / s, F = I * (t - e) + e;
          for (let Z = 0; Z <= n; Z++) {
            const P = Z / n, W = P * l + o, j = Math.sin(W), oe = Math.cos(W);
            w.x = F * j, w.y = -I * i + m, w.z = F * oe, u.push(w.x, w.y, w.z), g.set(j, T, oe).normalize(), d.push(g.x, g.y, g.z), p.push(P, 1 - I), N.push(f++);
          }
          v.push(N);
        }
        for (let A = 0; A < n; A++) for (let N = 0; N < s; N++) {
          const I = v[N][A], F = v[N + 1][A], Z = v[N + 1][A + 1], P = v[N][A + 1];
          h.push(I, F, P), h.push(F, Z, P), R += 6;
        }
        c.addGroup(y, R, 0), y += R;
      })(), false === a && (e > 0 && _(true), t > 0 && _(false)), this.setIndex(h), this.setAttribute("position", new ye(u, 3)), this.setAttribute("normal", new ye(d, 3)), this.setAttribute("uv", new ye(p, 2));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new r(e.radiusTop, e.radiusBottom, e.height, e.radialSegments, e.heightSegments, e.openEnded, e.thetaStart, e.thetaLength);
    }
  };
  var To = class r extends Us {
    constructor(e = 1, t = 1, i = 32, n = 1, s = false, a = 0, o = 2 * Math.PI) {
      super(0, e, t, i, n, s, a, o), this.type = "ConeGeometry", this.parameters = { radius: e, height: t, radialSegments: i, heightSegments: n, openEnded: s, thetaStart: a, thetaLength: o };
    }
    static fromJSON(e) {
      return new r(e.radius, e.height, e.radialSegments, e.heightSegments, e.openEnded, e.thetaStart, e.thetaLength);
    }
  };
  var Vi = class r extends Be {
    constructor(e = [], t = [], i = 1, n = 0) {
      super(), this.type = "PolyhedronGeometry", this.parameters = { vertices: e, indices: t, radius: i, detail: n };
      const s = [], a = [];
      function o(d, p, f, v) {
        const m = v + 1, y = [];
        for (let _ = 0; _ <= m; _++) {
          y[_] = [];
          const g = d.clone().lerp(f, _ / m), w = p.clone().lerp(f, _ / m), R = m - _;
          for (let T = 0; T <= R; T++) y[_][T] = 0 === T && _ === m ? g : g.clone().lerp(w, T / R);
        }
        for (let _ = 0; _ < m; _++) for (let g = 0; g < 2 * (m - _) - 1; g++) {
          const w = Math.floor(g / 2);
          g % 2 == 0 ? (l(y[_][w + 1]), l(y[_ + 1][w]), l(y[_][w])) : (l(y[_][w + 1]), l(y[_ + 1][w + 1]), l(y[_ + 1][w]));
        }
      }
      function l(d) {
        s.push(d.x, d.y, d.z);
      }
      function c(d, p) {
        const f = 3 * d;
        p.x = e[f + 0], p.y = e[f + 1], p.z = e[f + 2];
      }
      function h(d, p, f, v) {
        v < 0 && 1 === d.x && (a[p] = d.x - 1), 0 === f.x && 0 === f.z && (a[p] = v / 2 / Math.PI + 0.5);
      }
      function u(d) {
        return Math.atan2(d.z, -d.x);
      }
      !(function(d) {
        const p = new E(), f = new E(), v = new E();
        for (let m = 0; m < t.length; m += 3) c(t[m + 0], p), c(t[m + 1], f), c(t[m + 2], v), o(p, f, v, d);
      })(n), (function(d) {
        const p = new E();
        for (let f = 0; f < s.length; f += 3) p.x = s[f + 0], p.y = s[f + 1], p.z = s[f + 2], p.normalize().multiplyScalar(d), s[f + 0] = p.x, s[f + 1] = p.y, s[f + 2] = p.z;
      })(i), (function() {
        const d = new E();
        for (let f = 0; f < s.length; f += 3) {
          d.x = s[f + 0], d.y = s[f + 1], d.z = s[f + 2];
          const v = u(d) / 2 / Math.PI + 0.5, m = (p = d, Math.atan2(-p.y, Math.sqrt(p.x * p.x + p.z * p.z)) / Math.PI + 0.5);
          a.push(v, 1 - m);
        }
        var p;
        (function() {
          const f = new E(), v = new E(), m = new E(), y = new E(), _ = new X(), g = new X(), w = new X();
          for (let R = 0, T = 0; R < s.length; R += 9, T += 6) {
            f.set(s[R + 0], s[R + 1], s[R + 2]), v.set(s[R + 3], s[R + 4], s[R + 5]), m.set(s[R + 6], s[R + 7], s[R + 8]), _.set(a[T + 0], a[T + 1]), g.set(a[T + 2], a[T + 3]), w.set(a[T + 4], a[T + 5]), y.copy(f).add(v).add(m).divideScalar(3);
            const A = u(y);
            h(_, T + 0, f, A), h(g, T + 2, v, A), h(w, T + 4, m, A);
          }
        })(), (function() {
          for (let f = 0; f < a.length; f += 6) {
            const v = a[f + 0], m = a[f + 2], y = a[f + 4], _ = Math.max(v, m, y), g = Math.min(v, m, y);
            _ > 0.9 && g < 0.1 && (v < 0.2 && (a[f + 0] += 1), m < 0.2 && (a[f + 2] += 1), y < 0.2 && (a[f + 4] += 1));
          }
        })();
      })(), this.setAttribute("position", new ye(s, 3)), this.setAttribute("normal", new ye(s.slice(), 3)), this.setAttribute("uv", new ye(a, 2)), 0 === n ? this.computeVertexNormals() : this.normalizeNormals();
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new r(e.vertices, e.indices, e.radius, e.details);
    }
  };
  var wo = class r extends Vi {
    constructor(e = 1, t = 0) {
      const i = (1 + Math.sqrt(5)) / 2, n = 1 / i;
      super([-1, -1, -1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0, -n, -i, 0, -n, i, 0, n, -i, 0, n, i, -n, -i, 0, -n, i, 0, n, -i, 0, n, i, 0, -i, 0, -n, i, 0, -n, -i, 0, n, i, 0, n], [3, 11, 7, 3, 7, 15, 3, 15, 13, 7, 19, 17, 7, 17, 6, 7, 6, 15, 17, 4, 8, 17, 8, 10, 17, 10, 6, 8, 0, 16, 8, 16, 2, 8, 2, 10, 0, 12, 1, 0, 1, 18, 0, 18, 16, 6, 10, 2, 6, 2, 13, 6, 13, 15, 2, 16, 18, 2, 18, 3, 2, 3, 13, 18, 1, 9, 18, 9, 11, 18, 11, 3, 4, 14, 12, 4, 12, 0, 4, 0, 8, 11, 9, 5, 11, 5, 19, 11, 19, 7, 19, 5, 14, 19, 14, 4, 19, 4, 17, 1, 12, 14, 1, 14, 5, 1, 5, 9], e, t), this.type = "DodecahedronGeometry", this.parameters = { radius: e, detail: t };
    }
    static fromJSON(e) {
      return new r(e.radius, e.detail);
    }
  };
  var $r = new E();
  var Qr = new E();
  var Ba = new E();
  var es = new Fi();
  var Co = class extends Be {
    constructor(e = null, t = 1) {
      if (super(), this.type = "EdgesGeometry", this.parameters = { geometry: e, thresholdAngle: t }, null !== e) {
        const i = 4, n = Math.pow(10, i), s = Math.cos(rs * t), a = e.getIndex(), o = e.getAttribute("position"), l = a ? a.count : o.count, c = [0, 0, 0], h = ["a", "b", "c"], u = new Array(3), d = {}, p = [];
        for (let f = 0; f < l; f += 3) {
          a ? (c[0] = a.getX(f), c[1] = a.getX(f + 1), c[2] = a.getX(f + 2)) : (c[0] = f, c[1] = f + 1, c[2] = f + 2);
          const { a: v, b: m, c: y } = es;
          if (v.fromBufferAttribute(o, c[0]), m.fromBufferAttribute(o, c[1]), y.fromBufferAttribute(o, c[2]), es.getNormal(Ba), u[0] = `${Math.round(v.x * n)},${Math.round(v.y * n)},${Math.round(v.z * n)}`, u[1] = `${Math.round(m.x * n)},${Math.round(m.y * n)},${Math.round(m.z * n)}`, u[2] = `${Math.round(y.x * n)},${Math.round(y.y * n)},${Math.round(y.z * n)}`, u[0] !== u[1] && u[1] !== u[2] && u[2] !== u[0]) for (let _ = 0; _ < 3; _++) {
            const g = (_ + 1) % 3, w = u[_], R = u[g], T = es[h[_]], A = es[h[g]], N = `${w}_${R}`, I = `${R}_${w}`;
            I in d && d[I] ? (Ba.dot(d[I].normal) <= s && (p.push(T.x, T.y, T.z), p.push(A.x, A.y, A.z)), d[I] = null) : N in d || (d[N] = { index0: c[_], index1: c[g], normal: Ba.clone() });
          }
        }
        for (const f in d) if (d[f]) {
          const { index0: v, index1: m } = d[f];
          $r.fromBufferAttribute(o, v), Qr.fromBufferAttribute(o, m), p.push($r.x, $r.y, $r.z), p.push(Qr.x, Qr.y, Qr.z);
        }
        this.setAttribute("position", new ye(p, 3));
      }
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
  };
  var Ns = class extends hr {
    constructor(e) {
      super(e), this.uuid = wn(), this.type = "Shape", this.holes = [];
    }
    getPointsHoles(e) {
      const t = [];
      for (let i = 0, n = this.holes.length; i < n; i++) t[i] = this.holes[i].getPoints(e);
      return t;
    }
    extractPoints(e) {
      return { shape: this.getPoints(e), holes: this.getPointsHoles(e) };
    }
    copy(e) {
      super.copy(e), this.holes = [];
      for (let t = 0, i = e.holes.length; t < i; t++) {
        const n = e.holes[t];
        this.holes.push(n.clone());
      }
      return this;
    }
    toJSON() {
      const e = super.toJSON();
      e.uuid = this.uuid, e.holes = [];
      for (let t = 0, i = this.holes.length; t < i; t++) {
        const n = this.holes[t];
        e.holes.push(n.toJSON());
      }
      return e;
    }
    fromJSON(e) {
      super.fromJSON(e), this.uuid = e.uuid, this.holes = [];
      for (let t = 0, i = e.holes.length; t < i; t++) {
        const n = e.holes[t];
        this.holes.push(new hr().fromJSON(n));
      }
      return this;
    }
  };
  var lp = function(r, e, t = 2) {
    const i = e && e.length, n = i ? e[0] * t : r.length;
    let s = lh(r, 0, n, t, true);
    const a = [];
    if (!s || s.next === s.prev) return a;
    let o, l, c, h, u, d, p;
    if (i && (s = (function(f, v, m, y) {
      const _ = [];
      let g, w, R, T, A;
      for (g = 0, w = v.length; g < w; g++) R = v[g] * y, T = g < w - 1 ? v[g + 1] * y : f.length, A = lh(f, R, T, y, false), A === A.next && (A.steiner = true), _.push(gp(A));
      for (_.sort(pp), g = 0; g < _.length; g++) m = mp(_[g], m);
      return m;
    })(r, e, s, t)), r.length > 80 * t) {
      o = c = r[0], l = h = r[1];
      for (let f = t; f < n; f += t) u = r[f], d = r[f + 1], u < o && (o = u), d < l && (l = d), u > c && (c = u), d > h && (h = d);
      p = Math.max(c - o, h - l), p = 0 !== p ? 32767 / p : 0;
    }
    return ur(s, a, t, o, l, p, 0), a;
  };
  function lh(r, e, t, i, n) {
    let s, a;
    if (n === (function(o, l, c, h) {
      let u = 0;
      for (let d = l, p = c - h; d < c; d += h) u += (o[p] - o[d]) * (o[d + 1] + o[p + 1]), p = d;
      return u;
    })(r, e, t, i) > 0) for (s = e; s < t; s += i) a = ch(s, r[s], r[s + 1], a);
    else for (s = t - i; s >= e; s -= i) a = ch(s, r[s], r[s + 1], a);
    return a && ks(a, a.next) && (pr(a), a = a.next), a;
  }
  function Gi(r, e) {
    if (!r) return r;
    e || (e = r);
    let t, i = r;
    do {
      if (t = false, i.steiner || !ks(i, i.next) && 0 !== Ye(i.prev, i, i.next)) i = i.next;
      else {
        if (pr(i), i = e = i.prev, i === i.next) break;
        t = true;
      }
    } while (t || i !== e);
    return e;
  }
  function ur(r, e, t, i, n, s, a) {
    if (!r) return;
    !a && s && (function(h, u, d, p) {
      let f = h;
      do {
        0 === f.z && (f.z = Ao(f.x, f.y, u, d, p)), f.prevZ = f.prev, f.nextZ = f.next, f = f.next;
      } while (f !== h);
      f.prevZ.nextZ = null, f.prevZ = null, (function(v) {
        let m, y, _, g, w, R, T, A, N = 1;
        do {
          for (y = v, v = null, w = null, R = 0; y; ) {
            for (R++, _ = y, T = 0, m = 0; m < N && (T++, _ = _.nextZ, _); m++) ;
            for (A = N; T > 0 || A > 0 && _; ) 0 !== T && (0 === A || !_ || y.z <= _.z) ? (g = y, y = y.nextZ, T--) : (g = _, _ = _.nextZ, A--), w ? w.nextZ = g : v = g, g.prevZ = w, w = g;
            y = _;
          }
          w.nextZ = null, N *= 2;
        } while (R > 1);
      })(f);
    })(r, i, n, s);
    let o, l, c = r;
    for (; r.prev !== r.next; ) if (o = r.prev, l = r.next, s ? hp(r, i, n, s) : cp(r)) e.push(o.i / t | 0), e.push(r.i / t | 0), e.push(l.i / t | 0), pr(r), r = l.next, c = l.next;
    else if ((r = l) === c) {
      a ? 1 === a ? ur(r = up(Gi(r), e, t), e, t, i, n, s, 2) : 2 === a && dp(r, e, t, i, n, s) : ur(Gi(r), e, t, i, n, s, 1);
      break;
    }
  }
  function cp(r) {
    const e = r.prev, t = r, i = r.next;
    if (Ye(e, t, i) >= 0) return false;
    const n = e.x, s = t.x, a = i.x, o = e.y, l = t.y, c = i.y, h = n < s ? n < a ? n : a : s < a ? s : a, u = o < l ? o < c ? o : c : l < c ? l : c, d = n > s ? n > a ? n : a : s > a ? s : a, p = o > l ? o > c ? o : c : l > c ? l : c;
    let f = i.next;
    for (; f !== e; ) {
      if (f.x >= h && f.x <= d && f.y >= u && f.y <= p && dn(n, o, s, l, a, c, f.x, f.y) && Ye(f.prev, f, f.next) >= 0) return false;
      f = f.next;
    }
    return true;
  }
  function hp(r, e, t, i) {
    const n = r.prev, s = r, a = r.next;
    if (Ye(n, s, a) >= 0) return false;
    const o = n.x, l = s.x, c = a.x, h = n.y, u = s.y, d = a.y, p = o < l ? o < c ? o : c : l < c ? l : c, f = h < u ? h < d ? h : d : u < d ? u : d, v = o > l ? o > c ? o : c : l > c ? l : c, m = h > u ? h > d ? h : d : u > d ? u : d, y = Ao(p, f, e, t, i), _ = Ao(v, m, e, t, i);
    let g = r.prevZ, w = r.nextZ;
    for (; g && g.z >= y && w && w.z <= _; ) {
      if (g.x >= p && g.x <= v && g.y >= f && g.y <= m && g !== n && g !== a && dn(o, h, l, u, c, d, g.x, g.y) && Ye(g.prev, g, g.next) >= 0) return false;
      if (g = g.prevZ, w.x >= p && w.x <= v && w.y >= f && w.y <= m && w !== n && w !== a && dn(o, h, l, u, c, d, w.x, w.y) && Ye(w.prev, w, w.next) >= 0) return false;
      w = w.nextZ;
    }
    for (; g && g.z >= y; ) {
      if (g.x >= p && g.x <= v && g.y >= f && g.y <= m && g !== n && g !== a && dn(o, h, l, u, c, d, g.x, g.y) && Ye(g.prev, g, g.next) >= 0) return false;
      g = g.prevZ;
    }
    for (; w && w.z <= _; ) {
      if (w.x >= p && w.x <= v && w.y >= f && w.y <= m && w !== n && w !== a && dn(o, h, l, u, c, d, w.x, w.y) && Ye(w.prev, w, w.next) >= 0) return false;
      w = w.nextZ;
    }
    return true;
  }
  function up(r, e, t) {
    let i = r;
    do {
      const n = i.prev, s = i.next.next;
      !ks(n, s) && Hh(n, i, i.next, s) && dr(n, s) && dr(s, n) && (e.push(n.i / t | 0), e.push(i.i / t | 0), e.push(s.i / t | 0), pr(i), pr(i.next), i = r = s), i = i.next;
    } while (i !== r);
    return Gi(i);
  }
  function dp(r, e, t, i, n, s) {
    let a = r;
    do {
      let o = a.next.next;
      for (; o !== a.prev; ) {
        if (a.i !== o.i && vp(a, o)) {
          let l = zh(a, o);
          return a = Gi(a, a.next), l = Gi(l, l.next), ur(a, e, t, i, n, s, 0), void ur(l, e, t, i, n, s, 0);
        }
        o = o.next;
      }
      a = a.next;
    } while (a !== r);
  }
  function pp(r, e) {
    return r.x - e.x;
  }
  function mp(r, e) {
    const t = (function(n, s) {
      let a, o = s, l = -1 / 0;
      const c = n.x, h = n.y;
      do {
        if (h <= o.y && h >= o.next.y && o.next.y !== o.y) {
          const m = o.x + (h - o.y) * (o.next.x - o.x) / (o.next.y - o.y);
          if (m <= c && m > l && (l = m, a = o.x < o.next.x ? o : o.next, m === c)) return a;
        }
        o = o.next;
      } while (o !== s);
      if (!a) return null;
      const u = a, d = a.x, p = a.y;
      let f, v = 1 / 0;
      o = a;
      do {
        c >= o.x && o.x >= d && c !== o.x && dn(h < p ? c : l, h, d, p, h < p ? l : c, h, o.x, o.y) && (f = Math.abs(h - o.y) / (c - o.x), dr(o, n) && (f < v || f === v && (o.x > a.x || o.x === a.x && fp(a, o))) && (a = o, v = f)), o = o.next;
      } while (o !== u);
      return a;
    })(r, e);
    if (!t) return e;
    const i = zh(t, r);
    return Gi(i, i.next), Gi(t, t.next);
  }
  function fp(r, e) {
    return Ye(r.prev, r, e.prev) < 0 && Ye(e.next, r, r.next) < 0;
  }
  function Ao(r, e, t, i, n) {
    return (r = 1431655765 & ((r = 858993459 & ((r = 252645135 & ((r = 16711935 & ((r = (r - t) * n | 0) | r << 8)) | r << 4)) | r << 2)) | r << 1)) | (e = 1431655765 & ((e = 858993459 & ((e = 252645135 & ((e = 16711935 & ((e = (e - i) * n | 0) | e << 8)) | e << 4)) | e << 2)) | e << 1)) << 1;
  }
  function gp(r) {
    let e = r, t = r;
    do {
      (e.x < t.x || e.x === t.x && e.y < t.y) && (t = e), e = e.next;
    } while (e !== r);
    return t;
  }
  function dn(r, e, t, i, n, s, a, o) {
    return (n - a) * (e - o) >= (r - a) * (s - o) && (r - a) * (i - o) >= (t - a) * (e - o) && (t - a) * (s - o) >= (n - a) * (i - o);
  }
  function vp(r, e) {
    return r.next.i !== e.i && r.prev.i !== e.i && !(function(t, i) {
      let n = t;
      do {
        if (n.i !== t.i && n.next.i !== t.i && n.i !== i.i && n.next.i !== i.i && Hh(n, n.next, t, i)) return true;
        n = n.next;
      } while (n !== t);
      return false;
    })(r, e) && (dr(r, e) && dr(e, r) && (function(t, i) {
      let n = t, s = false;
      const a = (t.x + i.x) / 2, o = (t.y + i.y) / 2;
      do {
        n.y > o != n.next.y > o && n.next.y !== n.y && a < (n.next.x - n.x) * (o - n.y) / (n.next.y - n.y) + n.x && (s = !s), n = n.next;
      } while (n !== t);
      return s;
    })(r, e) && (Ye(r.prev, r, e.prev) || Ye(r, e.prev, e)) || ks(r, e) && Ye(r.prev, r, r.next) > 0 && Ye(e.prev, e, e.next) > 0);
  }
  function Ye(r, e, t) {
    return (e.y - r.y) * (t.x - e.x) - (e.x - r.x) * (t.y - e.y);
  }
  function ks(r, e) {
    return r.x === e.x && r.y === e.y;
  }
  function Hh(r, e, t, i) {
    const n = is(Ye(r, e, t)), s = is(Ye(r, e, i)), a = is(Ye(t, i, r)), o = is(Ye(t, i, e));
    return n !== s && a !== o || (!(0 !== n || !ts(r, t, e)) || (!(0 !== s || !ts(r, i, e)) || (!(0 !== a || !ts(t, r, i)) || !(0 !== o || !ts(t, e, i)))));
  }
  function ts(r, e, t) {
    return e.x <= Math.max(r.x, t.x) && e.x >= Math.min(r.x, t.x) && e.y <= Math.max(r.y, t.y) && e.y >= Math.min(r.y, t.y);
  }
  function is(r) {
    return r > 0 ? 1 : r < 0 ? -1 : 0;
  }
  function dr(r, e) {
    return Ye(r.prev, r, r.next) < 0 ? Ye(r, e, r.next) >= 0 && Ye(r, r.prev, e) >= 0 : Ye(r, e, r.prev) < 0 || Ye(r, r.next, e) < 0;
  }
  function zh(r, e) {
    const t = new Ro(r.i, r.x, r.y), i = new Ro(e.i, e.x, e.y), n = r.next, s = e.prev;
    return r.next = e, e.prev = r, t.next = n, n.prev = t, i.next = t, t.prev = i, s.next = i, i.prev = s, i;
  }
  function ch(r, e, t, i) {
    const n = new Ro(r, e, t);
    return i ? (n.next = i.next, n.prev = i, i.next.prev = n, i.next = n) : (n.prev = n, n.next = n), n;
  }
  function pr(r) {
    r.next.prev = r.prev, r.prev.next = r.next, r.prevZ && (r.prevZ.nextZ = r.nextZ), r.nextZ && (r.nextZ.prevZ = r.prevZ);
  }
  function Ro(r, e, t) {
    this.i = r, this.x = e, this.y = t, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = false;
  }
  var vi = class r {
    static area(e) {
      const t = e.length;
      let i = 0;
      for (let n = t - 1, s = 0; s < t; n = s++) i += e[n].x * e[s].y - e[s].x * e[n].y;
      return 0.5 * i;
    }
    static isClockWise(e) {
      return r.area(e) < 0;
    }
    static triangulateShape(e, t) {
      const i = [], n = [], s = [];
      hh(e), uh(i, e);
      let a = e.length;
      t.forEach(hh);
      for (let l = 0; l < t.length; l++) n.push(a), a += t[l].length, uh(i, t[l]);
      const o = lp(i, n);
      for (let l = 0; l < o.length; l += 3) s.push(o.slice(l, l + 3));
      return s;
    }
  };
  function hh(r) {
    const e = r.length;
    e > 2 && r[e - 1].equals(r[0]) && r.pop();
  }
  function uh(r, e) {
    for (let t = 0; t < e.length; t++) r.push(e[t].x), r.push(e[t].y);
  }
  var Po = class r extends Be {
    constructor(e = new Ns([new X(0.5, 0.5), new X(-0.5, 0.5), new X(-0.5, -0.5), new X(0.5, -0.5)]), t = {}) {
      super(), this.type = "ExtrudeGeometry", this.parameters = { shapes: e, options: t }, e = Array.isArray(e) ? e : [e];
      const i = this, n = [], s = [];
      for (let o = 0, l = e.length; o < l; o++) {
        a(e[o]);
      }
      function a(o) {
        const l = [], c = void 0 !== t.curveSegments ? t.curveSegments : 12, h = void 0 !== t.steps ? t.steps : 1, u = void 0 !== t.depth ? t.depth : 1;
        let d = void 0 === t.bevelEnabled || t.bevelEnabled, p = void 0 !== t.bevelThickness ? t.bevelThickness : 0.2, f = void 0 !== t.bevelSize ? t.bevelSize : p - 0.1, v = void 0 !== t.bevelOffset ? t.bevelOffset : 0, m = void 0 !== t.bevelSegments ? t.bevelSegments : 3;
        const y = t.extrudePath, _ = void 0 !== t.UVGenerator ? t.UVGenerator : _p;
        let g, w, R, T, A, N = false;
        y && (g = y.getSpacedPoints(h), N = true, d = false, w = y.computeFrenetFrames(h, false), R = new E(), T = new E(), A = new E()), d || (m = 0, p = 0, f = 0, v = 0);
        const I = o.extractPoints(c);
        let F = I.shape;
        const Z = I.holes;
        if (!vi.isClockWise(F)) {
          F = F.reverse();
          for (let D = 0, U = Z.length; D < U; D++) {
            const B = Z[D];
            vi.isClockWise(B) && (Z[D] = B.reverse());
          }
        }
        const P = vi.triangulateShape(F, Z), W = F;
        for (let D = 0, U = Z.length; D < U; D++) {
          const B = Z[D];
          F = F.concat(B);
        }
        function j(D, U, B) {
          return U || console.error("THREE.ExtrudeGeometry: vec does not exist"), D.clone().addScaledVector(U, B);
        }
        const oe = F.length, de = P.length;
        function ne(D, U, B) {
          let ie, Q, M;
          const re = D.x - U.x, H = D.y - U.y, z = B.x - D.x, se = B.y - D.y, he = re * re + H * H, pe = re * se - H * z;
          if (Math.abs(pe) > Number.EPSILON) {
            const fe = Math.sqrt(he), be = Math.sqrt(z * z + se * se), ge = U.x - H / fe, ve = U.y + re / fe, Te = ((B.x - se / be - ge) * se - (B.y + z / be - ve) * z) / (re * se - H * z);
            ie = ge + re * Te - D.x, Q = ve + H * Te - D.y;
            const nt = ie * ie + Q * Q;
            if (nt <= 2) return new X(ie, Q);
            M = Math.sqrt(nt / 2);
          } else {
            let fe = false;
            re > Number.EPSILON ? z > Number.EPSILON && (fe = true) : re < -Number.EPSILON ? z < -Number.EPSILON && (fe = true) : Math.sign(H) === Math.sign(se) && (fe = true), fe ? (ie = -H, Q = re, M = Math.sqrt(he)) : (ie = re, Q = H, M = Math.sqrt(he / 2));
          }
          return new X(ie / M, Q / M);
        }
        const te = [];
        for (let D = 0, U = W.length, B = U - 1, ie = D + 1; D < U; D++, B++, ie++) B === U && (B = 0), ie === U && (ie = 0), te[D] = ne(W[D], W[B], W[ie]);
        const $ = [];
        let k, G = te.concat();
        for (let D = 0, U = Z.length; D < U; D++) {
          const B = Z[D];
          k = [];
          for (let ie = 0, Q = B.length, M = Q - 1, re = ie + 1; ie < Q; ie++, M++, re++) M === Q && (M = 0), re === Q && (re = 0), k[ie] = ne(B[ie], B[M], B[re]);
          $.push(k), G = G.concat(k);
        }
        for (let D = 0; D < m; D++) {
          const U = D / m, B = p * Math.cos(U * Math.PI / 2), ie = f * Math.sin(U * Math.PI / 2) + v;
          for (let Q = 0, M = W.length; Q < M; Q++) {
            const re = j(W[Q], te[Q], ie);
            b(re.x, re.y, -B);
          }
          for (let Q = 0, M = Z.length; Q < M; Q++) {
            const re = Z[Q];
            k = $[Q];
            for (let H = 0, z = re.length; H < z; H++) {
              const se = j(re[H], k[H], ie);
              b(se.x, se.y, -B);
            }
          }
        }
        const ce = f + v;
        for (let D = 0; D < oe; D++) {
          const U = d ? j(F[D], G[D], ce) : F[D];
          N ? (T.copy(w.normals[0]).multiplyScalar(U.x), R.copy(w.binormals[0]).multiplyScalar(U.y), A.copy(g[0]).add(T).add(R), b(A.x, A.y, A.z)) : b(U.x, U.y, 0);
        }
        for (let D = 1; D <= h; D++) for (let U = 0; U < oe; U++) {
          const B = d ? j(F[U], G[U], ce) : F[U];
          N ? (T.copy(w.normals[D]).multiplyScalar(B.x), R.copy(w.binormals[D]).multiplyScalar(B.y), A.copy(g[D]).add(T).add(R), b(A.x, A.y, A.z)) : b(B.x, B.y, u / h * D);
        }
        for (let D = m - 1; D >= 0; D--) {
          const U = D / m, B = p * Math.cos(U * Math.PI / 2), ie = f * Math.sin(U * Math.PI / 2) + v;
          for (let Q = 0, M = W.length; Q < M; Q++) {
            const re = j(W[Q], te[Q], ie);
            b(re.x, re.y, u + B);
          }
          for (let Q = 0, M = Z.length; Q < M; Q++) {
            const re = Z[Q];
            k = $[Q];
            for (let H = 0, z = re.length; H < z; H++) {
              const se = j(re[H], k[H], ie);
              N ? b(se.x, se.y + g[h - 1].y, g[h - 1].x + B) : b(se.x, se.y, u + B);
            }
          }
        }
        function S(D, U) {
          let B = D.length;
          for (; --B >= 0; ) {
            const ie = B;
            let Q = B - 1;
            Q < 0 && (Q = D.length - 1);
            for (let M = 0, re = h + 2 * m; M < re; M++) {
              const H = oe * M, z = oe * (M + 1);
              J(U + ie + H, U + Q + H, U + Q + z, U + ie + z);
            }
          }
        }
        function b(D, U, B) {
          l.push(D), l.push(U), l.push(B);
        }
        function O(D, U, B) {
          L(D), L(U), L(B);
          const ie = n.length / 3, Q = _.generateTopUV(i, n, ie - 3, ie - 2, ie - 1);
          Y(Q[0]), Y(Q[1]), Y(Q[2]);
        }
        function J(D, U, B, ie) {
          L(D), L(U), L(ie), L(U), L(B), L(ie);
          const Q = n.length / 3, M = _.generateSideWallUV(i, n, Q - 6, Q - 3, Q - 2, Q - 1);
          Y(M[0]), Y(M[1]), Y(M[3]), Y(M[1]), Y(M[2]), Y(M[3]);
        }
        function L(D) {
          n.push(l[3 * D + 0]), n.push(l[3 * D + 1]), n.push(l[3 * D + 2]);
        }
        function Y(D) {
          s.push(D.x), s.push(D.y);
        }
        !(function() {
          const D = n.length / 3;
          if (d) {
            let U = 0, B = oe * U;
            for (let ie = 0; ie < de; ie++) {
              const Q = P[ie];
              O(Q[2] + B, Q[1] + B, Q[0] + B);
            }
            U = h + 2 * m, B = oe * U;
            for (let ie = 0; ie < de; ie++) {
              const Q = P[ie];
              O(Q[0] + B, Q[1] + B, Q[2] + B);
            }
          } else {
            for (let U = 0; U < de; U++) {
              const B = P[U];
              O(B[2], B[1], B[0]);
            }
            for (let U = 0; U < de; U++) {
              const B = P[U];
              O(B[0] + oe * h, B[1] + oe * h, B[2] + oe * h);
            }
          }
          i.addGroup(D, n.length / 3 - D, 0);
        })(), (function() {
          const D = n.length / 3;
          let U = 0;
          S(W, U), U += W.length;
          for (let B = 0, ie = Z.length; B < ie; B++) {
            const Q = Z[B];
            S(Q, U), U += Q.length;
          }
          i.addGroup(D, n.length / 3 - D, 1);
        })();
      }
      this.setAttribute("position", new ye(n, 3)), this.setAttribute("uv", new ye(s, 2)), this.computeVertexNormals();
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    toJSON() {
      const e = super.toJSON();
      return (function(t, i, n) {
        if (n.shapes = [], Array.isArray(t)) for (let s = 0, a = t.length; s < a; s++) {
          const o = t[s];
          n.shapes.push(o.uuid);
        }
        else n.shapes.push(t.uuid);
        n.options = Object.assign({}, i), void 0 !== i.extrudePath && (n.options.extrudePath = i.extrudePath.toJSON());
        return n;
      })(this.parameters.shapes, this.parameters.options, e);
    }
    static fromJSON(e, t) {
      const i = [];
      for (let s = 0, a = e.shapes.length; s < a; s++) {
        const o = t[e.shapes[s]];
        i.push(o);
      }
      const n = e.options.extrudePath;
      return void 0 !== n && (e.options.extrudePath = new Is[n.type]().fromJSON(n)), new r(i, e.options);
    }
  };
  var _p = { generateTopUV: function(r, e, t, i, n) {
    const s = e[3 * t], a = e[3 * t + 1], o = e[3 * i], l = e[3 * i + 1], c = e[3 * n], h = e[3 * n + 1];
    return [new X(s, a), new X(o, l), new X(c, h)];
  }, generateSideWallUV: function(r, e, t, i, n, s) {
    const a = e[3 * t], o = e[3 * t + 1], l = e[3 * t + 2], c = e[3 * i], h = e[3 * i + 1], u = e[3 * i + 2], d = e[3 * n], p = e[3 * n + 1], f = e[3 * n + 2], v = e[3 * s], m = e[3 * s + 1], y = e[3 * s + 2];
    return Math.abs(o - h) < Math.abs(a - c) ? [new X(a, 1 - l), new X(c, 1 - u), new X(d, 1 - f), new X(v, 1 - y)] : [new X(o, 1 - l), new X(h, 1 - u), new X(p, 1 - f), new X(m, 1 - y)];
  } };
  var Sn = class r extends Vi {
    constructor(e = 1, t = 0) {
      const i = (1 + Math.sqrt(5)) / 2;
      super([-1, i, 0, 1, i, 0, -1, -i, 0, 1, -i, 0, 0, -1, i, 0, 1, i, 0, -1, -i, 0, 1, -i, i, 0, -1, i, 0, 1, -i, 0, -1, -i, 0, 1], [0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1], e, t), this.type = "IcosahedronGeometry", this.parameters = { radius: e, detail: t };
    }
    static fromJSON(e) {
      return new r(e.radius, e.detail);
    }
  };
  var mr = class r extends Vi {
    constructor(e = 1, t = 0) {
      super([1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1], [0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2], e, t), this.type = "OctahedronGeometry", this.parameters = { radius: e, detail: t };
    }
    static fromJSON(e) {
      return new r(e.radius, e.detail);
    }
  };
  var Lo = class r extends Be {
    constructor(e = 0.5, t = 1, i = 32, n = 1, s = 0, a = 2 * Math.PI) {
      super(), this.type = "RingGeometry", this.parameters = { innerRadius: e, outerRadius: t, thetaSegments: i, phiSegments: n, thetaStart: s, thetaLength: a }, i = Math.max(3, i);
      const o = [], l = [], c = [], h = [];
      let u = e;
      const d = (t - e) / (n = Math.max(1, n)), p = new E(), f = new X();
      for (let v = 0; v <= n; v++) {
        for (let m = 0; m <= i; m++) {
          const y = s + m / i * a;
          p.x = u * Math.cos(y), p.y = u * Math.sin(y), l.push(p.x, p.y, p.z), c.push(0, 0, 1), f.x = (p.x / t + 1) / 2, f.y = (p.y / t + 1) / 2, h.push(f.x, f.y);
        }
        u += d;
      }
      for (let v = 0; v < n; v++) {
        const m = v * (i + 1);
        for (let y = 0; y < i; y++) {
          const _ = y + m, g = _, w = _ + i + 1, R = _ + i + 2, T = _ + 1;
          o.push(g, w, T), o.push(w, R, T);
        }
      }
      this.setIndex(o), this.setAttribute("position", new ye(l, 3)), this.setAttribute("normal", new ye(c, 3)), this.setAttribute("uv", new ye(h, 2));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new r(e.innerRadius, e.outerRadius, e.thetaSegments, e.phiSegments, e.thetaStart, e.thetaLength);
    }
  };
  var Io = class r extends Be {
    constructor(e = new Ns([new X(0, 0.5), new X(-0.5, -0.5), new X(0.5, -0.5)]), t = 12) {
      super(), this.type = "ShapeGeometry", this.parameters = { shapes: e, curveSegments: t };
      const i = [], n = [], s = [], a = [];
      let o = 0, l = 0;
      if (false === Array.isArray(e)) c(e);
      else for (let h = 0; h < e.length; h++) c(e[h]), this.addGroup(o, l, h), o += l, l = 0;
      function c(h) {
        const u = n.length / 3, d = h.extractPoints(t);
        let p = d.shape;
        const f = d.holes;
        false === vi.isClockWise(p) && (p = p.reverse());
        for (let m = 0, y = f.length; m < y; m++) {
          const _ = f[m];
          true === vi.isClockWise(_) && (f[m] = _.reverse());
        }
        const v = vi.triangulateShape(p, f);
        for (let m = 0, y = f.length; m < y; m++) {
          const _ = f[m];
          p = p.concat(_);
        }
        for (let m = 0, y = p.length; m < y; m++) {
          const _ = p[m];
          n.push(_.x, _.y, 0), s.push(0, 0, 1), a.push(_.x, _.y);
        }
        for (let m = 0, y = v.length; m < y; m++) {
          const _ = v[m], g = _[0] + u, w = _[1] + u, R = _[2] + u;
          i.push(g, w, R), l += 3;
        }
      }
      this.setIndex(i), this.setAttribute("position", new ye(n, 3)), this.setAttribute("normal", new ye(s, 3)), this.setAttribute("uv", new ye(a, 2));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    toJSON() {
      const e = super.toJSON();
      return (function(t, i) {
        if (i.shapes = [], Array.isArray(t)) for (let n = 0, s = t.length; n < s; n++) {
          const a = t[n];
          i.shapes.push(a.uuid);
        }
        else i.shapes.push(t.uuid);
        return i;
      })(this.parameters.shapes, e);
    }
    static fromJSON(e, t) {
      const i = [];
      for (let n = 0, s = e.shapes.length; n < s; n++) {
        const a = t[e.shapes[n]];
        i.push(a);
      }
      return new r(i, e.curveSegments);
    }
  };
  var Do = class r extends Be {
    constructor(e = 1, t = 32, i = 16, n = 0, s = 2 * Math.PI, a = 0, o = Math.PI) {
      super(), this.type = "SphereGeometry", this.parameters = { radius: e, widthSegments: t, heightSegments: i, phiStart: n, phiLength: s, thetaStart: a, thetaLength: o }, t = Math.max(3, Math.floor(t)), i = Math.max(2, Math.floor(i));
      const l = Math.min(a + o, Math.PI);
      let c = 0;
      const h = [], u = new E(), d = new E(), p = [], f = [], v = [], m = [];
      for (let y = 0; y <= i; y++) {
        const _ = [], g = y / i;
        let w = 0;
        0 === y && 0 === a ? w = 0.5 / t : y === i && l === Math.PI && (w = -0.5 / t);
        for (let R = 0; R <= t; R++) {
          const T = R / t;
          u.x = -e * Math.cos(n + T * s) * Math.sin(a + g * o), u.y = e * Math.cos(a + g * o), u.z = e * Math.sin(n + T * s) * Math.sin(a + g * o), f.push(u.x, u.y, u.z), d.copy(u).normalize(), v.push(d.x, d.y, d.z), m.push(T + w, 1 - g), _.push(c++);
        }
        h.push(_);
      }
      for (let y = 0; y < i; y++) for (let _ = 0; _ < t; _++) {
        const g = h[y][_ + 1], w = h[y][_], R = h[y + 1][_], T = h[y + 1][_ + 1];
        (0 !== y || a > 0) && p.push(g, w, T), (y !== i - 1 || l < Math.PI) && p.push(w, R, T);
      }
      this.setIndex(p), this.setAttribute("position", new ye(f, 3)), this.setAttribute("normal", new ye(v, 3)), this.setAttribute("uv", new ye(m, 2));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new r(e.radius, e.widthSegments, e.heightSegments, e.phiStart, e.phiLength, e.thetaStart, e.thetaLength);
    }
  };
  var Uo = class r extends Vi {
    constructor(e = 1, t = 0) {
      super([1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1], [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1], e, t), this.type = "TetrahedronGeometry", this.parameters = { radius: e, detail: t };
    }
    static fromJSON(e) {
      return new r(e.radius, e.detail);
    }
  };
  var fr = class r extends Be {
    constructor(e = 1, t = 0.4, i = 12, n = 48, s = 2 * Math.PI) {
      super(), this.type = "TorusGeometry", this.parameters = { radius: e, tube: t, radialSegments: i, tubularSegments: n, arc: s }, i = Math.floor(i), n = Math.floor(n);
      const a = [], o = [], l = [], c = [], h = new E(), u = new E(), d = new E();
      for (let p = 0; p <= i; p++) for (let f = 0; f <= n; f++) {
        const v = f / n * s, m = p / i * Math.PI * 2;
        u.x = (e + t * Math.cos(m)) * Math.cos(v), u.y = (e + t * Math.cos(m)) * Math.sin(v), u.z = t * Math.sin(m), o.push(u.x, u.y, u.z), h.x = e * Math.cos(v), h.y = e * Math.sin(v), d.subVectors(u, h).normalize(), l.push(d.x, d.y, d.z), c.push(f / n), c.push(p / i);
      }
      for (let p = 1; p <= i; p++) for (let f = 1; f <= n; f++) {
        const v = (n + 1) * p + f - 1, m = (n + 1) * (p - 1) + f - 1, y = (n + 1) * (p - 1) + f, _ = (n + 1) * p + f;
        a.push(v, m, _), a.push(m, y, _);
      }
      this.setIndex(a), this.setAttribute("position", new ye(o, 3)), this.setAttribute("normal", new ye(l, 3)), this.setAttribute("uv", new ye(c, 2));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new r(e.radius, e.tube, e.radialSegments, e.tubularSegments, e.arc);
    }
  };
  var No = class r extends Be {
    constructor(e = 1, t = 0.4, i = 64, n = 8, s = 2, a = 3) {
      super(), this.type = "TorusKnotGeometry", this.parameters = { radius: e, tube: t, tubularSegments: i, radialSegments: n, p: s, q: a }, i = Math.floor(i), n = Math.floor(n);
      const o = [], l = [], c = [], h = [], u = new E(), d = new E(), p = new E(), f = new E(), v = new E(), m = new E(), y = new E();
      for (let g = 0; g <= i; ++g) {
        const w = g / i * s * Math.PI * 2;
        _(w, s, a, e, p), _(w + 0.01, s, a, e, f), m.subVectors(f, p), y.addVectors(f, p), v.crossVectors(m, y), y.crossVectors(v, m), v.normalize(), y.normalize();
        for (let R = 0; R <= n; ++R) {
          const T = R / n * Math.PI * 2, A = -t * Math.cos(T), N = t * Math.sin(T);
          u.x = p.x + (A * y.x + N * v.x), u.y = p.y + (A * y.y + N * v.y), u.z = p.z + (A * y.z + N * v.z), l.push(u.x, u.y, u.z), d.subVectors(u, p).normalize(), c.push(d.x, d.y, d.z), h.push(g / i), h.push(R / n);
        }
      }
      for (let g = 1; g <= i; g++) for (let w = 1; w <= n; w++) {
        const R = (n + 1) * (g - 1) + (w - 1), T = (n + 1) * g + (w - 1), A = (n + 1) * g + w, N = (n + 1) * (g - 1) + w;
        o.push(R, T, N), o.push(T, A, N);
      }
      function _(g, w, R, T, A) {
        const N = Math.cos(g), I = Math.sin(g), F = R / w * g, Z = Math.cos(F);
        A.x = T * (2 + Z) * 0.5 * N, A.y = T * (2 + Z) * I * 0.5, A.z = T * Math.sin(F) * 0.5;
      }
      this.setIndex(o), this.setAttribute("position", new ye(l, 3)), this.setAttribute("normal", new ye(c, 3)), this.setAttribute("uv", new ye(h, 2));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    static fromJSON(e) {
      return new r(e.radius, e.tube, e.tubularSegments, e.radialSegments, e.p, e.q);
    }
  };
  var Oo = class r extends Be {
    constructor(e = new Ps(new E(-1, -1, 0), new E(-1, 1, 0), new E(1, 1, 0)), t = 64, i = 1, n = 8, s = false) {
      super(), this.type = "TubeGeometry", this.parameters = { path: e, tubularSegments: t, radius: i, radialSegments: n, closed: s };
      const a = e.computeFrenetFrames(t, s);
      this.tangents = a.tangents, this.normals = a.normals, this.binormals = a.binormals;
      const o = new E(), l = new E(), c = new X();
      let h = new E();
      const u = [], d = [], p = [], f = [];
      function v(m) {
        h = e.getPointAt(m / t, h);
        const y = a.normals[m], _ = a.binormals[m];
        for (let g = 0; g <= n; g++) {
          const w = g / n * Math.PI * 2, R = Math.sin(w), T = -Math.cos(w);
          l.x = T * y.x + R * _.x, l.y = T * y.y + R * _.y, l.z = T * y.z + R * _.z, l.normalize(), d.push(l.x, l.y, l.z), o.x = h.x + i * l.x, o.y = h.y + i * l.y, o.z = h.z + i * l.z, u.push(o.x, o.y, o.z);
        }
      }
      !(function() {
        for (let m = 0; m < t; m++) v(m);
        v(false === s ? t : 0), (function() {
          for (let m = 0; m <= t; m++) for (let y = 0; y <= n; y++) c.x = m / t, c.y = y / n, p.push(c.x, c.y);
        })(), (function() {
          for (let m = 1; m <= t; m++) for (let y = 1; y <= n; y++) {
            const _ = (n + 1) * (m - 1) + (y - 1), g = (n + 1) * m + (y - 1), w = (n + 1) * m + y, R = (n + 1) * (m - 1) + y;
            f.push(_, g, R), f.push(g, w, R);
          }
        })();
      })(), this.setIndex(f), this.setAttribute("position", new ye(u, 3)), this.setAttribute("normal", new ye(d, 3)), this.setAttribute("uv", new ye(p, 2));
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
    toJSON() {
      const e = super.toJSON();
      return e.path = this.parameters.path.toJSON(), e;
    }
    static fromJSON(e) {
      return new r(new Is[e.path.type]().fromJSON(e.path), e.tubularSegments, e.radius, e.radialSegments, e.closed);
    }
  };
  var Fo = class extends Be {
    constructor(e = null) {
      if (super(), this.type = "WireframeGeometry", this.parameters = { geometry: e }, null !== e) {
        const t = [], i = /* @__PURE__ */ new Set(), n = new E(), s = new E();
        if (null !== e.index) {
          const a = e.attributes.position, o = e.index;
          let l = e.groups;
          0 === l.length && (l = [{ start: 0, count: o.count, materialIndex: 0 }]);
          for (let c = 0, h = l.length; c < h; ++c) {
            const u = l[c], d = u.start;
            for (let p = d, f = d + u.count; p < f; p += 3) for (let v = 0; v < 3; v++) {
              const m = o.getX(p + v), y = o.getX(p + (v + 1) % 3);
              n.fromBufferAttribute(a, m), s.fromBufferAttribute(a, y), true === dh(n, s, i) && (t.push(n.x, n.y, n.z), t.push(s.x, s.y, s.z));
            }
          }
        } else {
          const a = e.attributes.position;
          for (let o = 0, l = a.count / 3; o < l; o++) for (let c = 0; c < 3; c++) {
            const h = 3 * o + c, u = 3 * o + (c + 1) % 3;
            n.fromBufferAttribute(a, h), s.fromBufferAttribute(a, u), true === dh(n, s, i) && (t.push(n.x, n.y, n.z), t.push(s.x, s.y, s.z));
          }
        }
        this.setAttribute("position", new ye(t, 3));
      }
    }
    copy(e) {
      return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
    }
  };
  function dh(r, e, t) {
    const i = `${r.x},${r.y},${r.z}-${e.x},${e.y},${e.z}`, n = `${e.x},${e.y},${e.z}-${r.x},${r.y},${r.z}`;
    return true !== t.has(i) && true !== t.has(n) && (t.add(i), t.add(n), true);
  }
  var of = Object.freeze({ __proto__: null, BoxGeometry: xn, CapsuleGeometry: So, CircleGeometry: Eo, ConeGeometry: To, CylinderGeometry: Us, DodecahedronGeometry: wo, EdgesGeometry: Co, ExtrudeGeometry: Po, IcosahedronGeometry: Sn, LatheGeometry: Ds, OctahedronGeometry: mr, PlaneGeometry: Ze, PolyhedronGeometry: Vi, RingGeometry: Lo, ShapeGeometry: Io, SphereGeometry: Do, TetrahedronGeometry: Uo, TorusGeometry: fr, TorusKnotGeometry: No, TubeGeometry: Oo, WireframeGeometry: Fo });
  var gr = class extends ai {
    constructor(e) {
      super(), this.isMeshStandardMaterial = true, this.defines = { STANDARD: "" }, this.type = "MeshStandardMaterial", this.color = new x(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new x(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = 0, this.normalScale = new X(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapIntensity = 1, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = false, this.fog = true, this.setValues(e);
    }
    copy(e) {
      return super.copy(e), this.defines = { STANDARD: "" }, this.color.copy(e.color), this.roughness = e.roughness, this.metalness = e.metalness, this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.roughnessMap = e.roughnessMap, this.metalnessMap = e.metalnessMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapIntensity = e.envMapIntensity, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
    }
  };
  var Os = class extends gr {
    constructor(e) {
      super(), this.isMeshPhysicalMaterial = true, this.defines = { STANDARD: "", PHYSICAL: "" }, this.type = "MeshPhysicalMaterial", this.anisotropyRotation = 0, this.anisotropyMap = null, this.clearcoatMap = null, this.clearcoatRoughness = 0, this.clearcoatRoughnessMap = null, this.clearcoatNormalScale = new X(1, 1), this.clearcoatNormalMap = null, this.ior = 1.5, Object.defineProperty(this, "reflectivity", { get: function() {
        return st(2.5 * (this.ior - 1) / (this.ior + 1), 0, 1);
      }, set: function(t) {
        this.ior = (1 + 0.4 * t) / (1 - 0.4 * t);
      } }), this.iridescenceMap = null, this.iridescenceIOR = 1.3, this.iridescenceThicknessRange = [100, 400], this.iridescenceThicknessMap = null, this.sheenColor = new x(0), this.sheenColorMap = null, this.sheenRoughness = 1, this.sheenRoughnessMap = null, this.transmissionMap = null, this.thickness = 0, this.thicknessMap = null, this.attenuationDistance = 1 / 0, this.attenuationColor = new x(1, 1, 1), this.specularIntensity = 1, this.specularIntensityMap = null, this.specularColor = new x(1, 1, 1), this.specularColorMap = null, this._anisotropy = 0, this._clearcoat = 0, this._iridescence = 0, this._sheen = 0, this._transmission = 0, this.setValues(e);
    }
    get anisotropy() {
      return this._anisotropy;
    }
    set anisotropy(e) {
      this._anisotropy > 0 != e > 0 && this.version++, this._anisotropy = e;
    }
    get clearcoat() {
      return this._clearcoat;
    }
    set clearcoat(e) {
      this._clearcoat > 0 != e > 0 && this.version++, this._clearcoat = e;
    }
    get iridescence() {
      return this._iridescence;
    }
    set iridescence(e) {
      this._iridescence > 0 != e > 0 && this.version++, this._iridescence = e;
    }
    get sheen() {
      return this._sheen;
    }
    set sheen(e) {
      this._sheen > 0 != e > 0 && this.version++, this._sheen = e;
    }
    get transmission() {
      return this._transmission;
    }
    set transmission(e) {
      this._transmission > 0 != e > 0 && this.version++, this._transmission = e;
    }
    copy(e) {
      return super.copy(e), this.defines = { STANDARD: "", PHYSICAL: "" }, this.anisotropy = e.anisotropy, this.anisotropyRotation = e.anisotropyRotation, this.anisotropyMap = e.anisotropyMap, this.clearcoat = e.clearcoat, this.clearcoatMap = e.clearcoatMap, this.clearcoatRoughness = e.clearcoatRoughness, this.clearcoatRoughnessMap = e.clearcoatRoughnessMap, this.clearcoatNormalMap = e.clearcoatNormalMap, this.clearcoatNormalScale.copy(e.clearcoatNormalScale), this.ior = e.ior, this.iridescence = e.iridescence, this.iridescenceMap = e.iridescenceMap, this.iridescenceIOR = e.iridescenceIOR, this.iridescenceThicknessRange = [...e.iridescenceThicknessRange], this.iridescenceThicknessMap = e.iridescenceThicknessMap, this.sheen = e.sheen, this.sheenColor.copy(e.sheenColor), this.sheenColorMap = e.sheenColorMap, this.sheenRoughness = e.sheenRoughness, this.sheenRoughnessMap = e.sheenRoughnessMap, this.transmission = e.transmission, this.transmissionMap = e.transmissionMap, this.thickness = e.thickness, this.thicknessMap = e.thicknessMap, this.attenuationDistance = e.attenuationDistance, this.attenuationColor.copy(e.attenuationColor), this.specularIntensity = e.specularIntensity, this.specularIntensityMap = e.specularIntensityMap, this.specularColor.copy(e.specularColor), this.specularColorMap = e.specularColorMap, this;
    }
  };
  function ns(r, e, t) {
    return !r || !t && r.constructor === e ? r : "number" == typeof e.BYTES_PER_ELEMENT ? new e(r) : Array.prototype.slice.call(r);
  }
  function yp(r) {
    return ArrayBuffer.isView(r) && !(r instanceof DataView);
  }
  var En = class {
    constructor(e, t, i, n) {
      this.parameterPositions = e, this._cachedIndex = 0, this.resultBuffer = void 0 !== n ? n : new t.constructor(i), this.sampleValues = t, this.valueSize = i, this.settings = null, this.DefaultSettings_ = {};
    }
    evaluate(e) {
      const t = this.parameterPositions;
      let i = this._cachedIndex, n = t[i], s = t[i - 1];
      t: {
        e: {
          let a;
          i: {
            n: if (!(e < n)) {
              for (let o = i + 2; ; ) {
                if (void 0 === n) {
                  if (e < s) break n;
                  return i = t.length, this._cachedIndex = i, this.copySampleValue_(i - 1);
                }
                if (i === o) break;
                if (s = n, n = t[++i], e < n) break e;
              }
              a = t.length;
              break i;
            }
            if (e >= s) break t;
            {
              const o = t[1];
              e < o && (i = 2, s = o);
              for (let l = i - 2; ; ) {
                if (void 0 === s) return this._cachedIndex = 0, this.copySampleValue_(0);
                if (i === l) break;
                if (n = s, s = t[--i - 1], e >= s) break e;
              }
              a = i, i = 0;
            }
          }
          for (; i < a; ) {
            const o = i + a >>> 1;
            e < t[o] ? a = o : i = o + 1;
          }
          if (n = t[i], s = t[i - 1], void 0 === s) return this._cachedIndex = 0, this.copySampleValue_(0);
          if (void 0 === n) return i = t.length, this._cachedIndex = i, this.copySampleValue_(i - 1);
        }
        this._cachedIndex = i, this.intervalChanged_(i, s, n);
      }
      return this.interpolate_(i, s, e, n);
    }
    getSettings_() {
      return this.settings || this.DefaultSettings_;
    }
    copySampleValue_(e) {
      const t = this.resultBuffer, i = this.sampleValues, n = this.valueSize, s = e * n;
      for (let a = 0; a !== n; ++a) t[a] = i[s + a];
      return t;
    }
    interpolate_() {
      throw new Error("call to abstract method");
    }
    intervalChanged_() {
    }
  };
  var Bo = class extends En {
    constructor(e, t, i, n) {
      super(e, t, i, n), this._weightPrev = -0, this._offsetPrev = -0, this._weightNext = -0, this._offsetNext = -0, this.DefaultSettings_ = { endingStart: uc, endingEnd: uc };
    }
    intervalChanged_(e, t, i) {
      const n = this.parameterPositions;
      let s = e - 2, a = e + 1, o = n[s], l = n[a];
      if (void 0 === o) switch (this.getSettings_().endingStart) {
        case dc:
          s = e, o = 2 * t - i;
          break;
        case pc:
          s = n.length - 2, o = t + n[s] - n[s + 1];
          break;
        default:
          s = e, o = i;
      }
      if (void 0 === l) switch (this.getSettings_().endingEnd) {
        case dc:
          a = e, l = 2 * i - t;
          break;
        case pc:
          a = 1, l = i + n[1] - n[0];
          break;
        default:
          a = e - 1, l = t;
      }
      const c = 0.5 * (i - t), h = this.valueSize;
      this._weightPrev = c / (t - o), this._weightNext = c / (l - i), this._offsetPrev = s * h, this._offsetNext = a * h;
    }
    interpolate_(e, t, i, n) {
      const s = this.resultBuffer, a = this.sampleValues, o = this.valueSize, l = e * o, c = l - o, h = this._offsetPrev, u = this._offsetNext, d = this._weightPrev, p = this._weightNext, f = (i - t) / (n - t), v = f * f, m = v * f, y = -d * m + 2 * d * v - d * f, _ = (1 + d) * m + (-1.5 - 2 * d) * v + (-0.5 + d) * f + 1, g = (-1 - p) * m + (1.5 + p) * v + 0.5 * f, w = p * m - p * v;
      for (let R = 0; R !== o; ++R) s[R] = y * a[h + R] + _ * a[c + R] + g * a[l + R] + w * a[u + R];
      return s;
    }
  };
  var Ho = class extends En {
    constructor(e, t, i, n) {
      super(e, t, i, n);
    }
    interpolate_(e, t, i, n) {
      const s = this.resultBuffer, a = this.sampleValues, o = this.valueSize, l = e * o, c = l - o, h = (i - t) / (n - t), u = 1 - h;
      for (let d = 0; d !== o; ++d) s[d] = a[c + d] * u + a[l + d] * h;
      return s;
    }
  };
  var zo = class extends En {
    constructor(e, t, i, n) {
      super(e, t, i, n);
    }
    interpolate_(e) {
      return this.copySampleValue_(e - 1);
    }
  };
  var Ft = class {
    constructor(e, t, i, n) {
      if (void 0 === e) throw new Error("THREE.KeyframeTrack: track name is undefined");
      if (void 0 === t || 0 === t.length) throw new Error("THREE.KeyframeTrack: no keyframes in track named " + e);
      this.name = e, this.times = ns(t, this.TimeBufferType), this.values = ns(i, this.ValueBufferType), this.setInterpolation(n || this.DefaultInterpolation);
    }
    static toJSON(e) {
      const t = e.constructor;
      let i;
      if (t.toJSON !== this.toJSON) i = t.toJSON(e);
      else {
        i = { name: e.name, times: ns(e.times, Array), values: ns(e.values, Array) };
        const n = e.getInterpolation();
        n !== e.DefaultInterpolation && (i.interpolation = n);
      }
      return i.type = e.ValueTypeName, i;
    }
    InterpolantFactoryMethodDiscrete(e) {
      return new zo(this.times, this.values, this.getValueSize(), e);
    }
    InterpolantFactoryMethodLinear(e) {
      return new Ho(this.times, this.values, this.getValueSize(), e);
    }
    InterpolantFactoryMethodSmooth(e) {
      return new Bo(this.times, this.values, this.getValueSize(), e);
    }
    setInterpolation(e) {
      let t;
      switch (e) {
        case as:
          t = this.InterpolantFactoryMethodDiscrete;
          break;
        case os:
          t = this.InterpolantFactoryMethodLinear;
          break;
        case ha:
          t = this.InterpolantFactoryMethodSmooth;
      }
      if (void 0 === t) {
        const i = "unsupported interpolation for " + this.ValueTypeName + " keyframe track named " + this.name;
        if (void 0 === this.createInterpolant) {
          if (e === this.DefaultInterpolation) throw new Error(i);
          this.setInterpolation(this.DefaultInterpolation);
        }
        return console.warn("THREE.KeyframeTrack:", i), this;
      }
      return this.createInterpolant = t, this;
    }
    getInterpolation() {
      switch (this.createInterpolant) {
        case this.InterpolantFactoryMethodDiscrete:
          return as;
        case this.InterpolantFactoryMethodLinear:
          return os;
        case this.InterpolantFactoryMethodSmooth:
          return ha;
      }
    }
    getValueSize() {
      return this.values.length / this.times.length;
    }
    shift(e) {
      if (0 !== e) {
        const t = this.times;
        for (let i = 0, n = t.length; i !== n; ++i) t[i] += e;
      }
      return this;
    }
    scale(e) {
      if (1 !== e) {
        const t = this.times;
        for (let i = 0, n = t.length; i !== n; ++i) t[i] *= e;
      }
      return this;
    }
    trim(e, t) {
      const i = this.times, n = i.length;
      let s = 0, a = n - 1;
      for (; s !== n && i[s] < e; ) ++s;
      for (; -1 !== a && i[a] > t; ) --a;
      if (++a, 0 !== s || a !== n) {
        s >= a && (a = Math.max(a, 1), s = a - 1);
        const o = this.getValueSize();
        this.times = i.slice(s, a), this.values = this.values.slice(s * o, a * o);
      }
      return this;
    }
    validate() {
      let e = true;
      const t = this.getValueSize();
      t - Math.floor(t) != 0 && (console.error("THREE.KeyframeTrack: Invalid value size in track.", this), e = false);
      const i = this.times, n = this.values, s = i.length;
      0 === s && (console.error("THREE.KeyframeTrack: Track is empty.", this), e = false);
      let a = null;
      for (let o = 0; o !== s; o++) {
        const l = i[o];
        if ("number" == typeof l && isNaN(l)) {
          console.error("THREE.KeyframeTrack: Time is not a valid number.", this, o, l), e = false;
          break;
        }
        if (null !== a && a > l) {
          console.error("THREE.KeyframeTrack: Out of order keys.", this, o, l, a), e = false;
          break;
        }
        a = l;
      }
      if (void 0 !== n && yp(n)) for (let o = 0, l = n.length; o !== l; ++o) {
        const c = n[o];
        if (isNaN(c)) {
          console.error("THREE.KeyframeTrack: Value is not a valid number.", this, o, c), e = false;
          break;
        }
      }
      return e;
    }
    optimize() {
      const e = this.times.slice(), t = this.values.slice(), i = this.getValueSize(), n = this.getInterpolation() === ha, s = e.length - 1;
      let a = 1;
      for (let o = 1; o < s; ++o) {
        let l = false;
        const c = e[o];
        if (c !== e[o + 1] && (1 !== o || c !== e[0])) if (n) l = true;
        else {
          const h = o * i, u = h - i, d = h + i;
          for (let p = 0; p !== i; ++p) {
            const f = t[h + p];
            if (f !== t[u + p] || f !== t[d + p]) {
              l = true;
              break;
            }
          }
        }
        if (l) {
          if (o !== a) {
            e[a] = e[o];
            const h = o * i, u = a * i;
            for (let d = 0; d !== i; ++d) t[u + d] = t[h + d];
          }
          ++a;
        }
      }
      if (s > 0) {
        e[a] = e[s];
        for (let o = s * i, l = a * i, c = 0; c !== i; ++c) t[l + c] = t[o + c];
        ++a;
      }
      return a !== e.length ? (this.times = e.slice(0, a), this.values = t.slice(0, a * i)) : (this.times = e, this.values = t), this;
    }
    clone() {
      const e = this.times.slice(), t = this.values.slice(), i = new (0, this.constructor)(this.name, e, t);
      return i.createInterpolant = this.createInterpolant, i;
    }
  };
  Ft.prototype.TimeBufferType = Float32Array, Ft.prototype.ValueBufferType = Float32Array, Ft.prototype.DefaultInterpolation = os;
  var Ni = class extends Ft {
  };
  Ni.prototype.ValueTypeName = "bool", Ni.prototype.ValueBufferType = Array, Ni.prototype.DefaultInterpolation = as, Ni.prototype.InterpolantFactoryMethodLinear = void 0, Ni.prototype.InterpolantFactoryMethodSmooth = void 0;
  var ko = class extends Ft {
  };
  ko.prototype.ValueTypeName = "color";
  var Vo = class extends Ft {
  };
  Vo.prototype.ValueTypeName = "number";
  var Go = class extends En {
    constructor(e, t, i, n) {
      super(e, t, i, n);
    }
    interpolate_(e, t, i, n) {
      const s = this.resultBuffer, a = this.sampleValues, o = this.valueSize, l = (i - t) / (n - t);
      let c = e * o;
      for (let h = c + o; c !== h; c += 4) qt.slerpFlat(s, 0, a, c - o, a, c, l);
      return s;
    }
  };
  var ar = class extends Ft {
    InterpolantFactoryMethodLinear(e) {
      return new Go(this.times, this.values, this.getValueSize(), e);
    }
  };
  ar.prototype.ValueTypeName = "quaternion", ar.prototype.DefaultInterpolation = os, ar.prototype.InterpolantFactoryMethodSmooth = void 0;
  var Oi = class extends Ft {
  };
  Oi.prototype.ValueTypeName = "string", Oi.prototype.ValueBufferType = Array, Oi.prototype.DefaultInterpolation = as, Oi.prototype.InterpolantFactoryMethodLinear = void 0, Oi.prototype.InterpolantFactoryMethodSmooth = void 0;
  var Wo = class extends Ft {
  };
  Wo.prototype.ValueTypeName = "vector";
  var Xo = class {
    constructor(e, t, i) {
      const n = this;
      let s, a = false, o = 0, l = 0;
      const c = [];
      this.onStart = void 0, this.onLoad = e, this.onProgress = t, this.onError = i, this.itemStart = function(h) {
        l++, false === a && void 0 !== n.onStart && n.onStart(h, o, l), a = true;
      }, this.itemEnd = function(h) {
        o++, void 0 !== n.onProgress && n.onProgress(h, o, l), o === l && (a = false, void 0 !== n.onLoad && n.onLoad());
      }, this.itemError = function(h) {
        void 0 !== n.onError && n.onError(h);
      }, this.resolveURL = function(h) {
        return s ? s(h) : h;
      }, this.setURLModifier = function(h) {
        return s = h, this;
      }, this.addHandler = function(h, u) {
        return c.push(h, u), this;
      }, this.removeHandler = function(h) {
        const u = c.indexOf(h);
        return -1 !== u && c.splice(u, 2), this;
      }, this.getHandler = function(h) {
        for (let u = 0, d = c.length; u < d; u += 2) {
          const p = c[u], f = c[u + 1];
          if (p.global && (p.lastIndex = 0), p.test(h)) return f;
        }
        return null;
      };
    }
  };
  var xp = new Xo();
  var jo = class {
    constructor(e) {
      this.manager = void 0 !== e ? e : xp, this.crossOrigin = "anonymous", this.withCredentials = false, this.path = "", this.resourcePath = "", this.requestHeader = {};
    }
    load() {
    }
    loadAsync(e, t) {
      const i = this;
      return new Promise((function(n, s) {
        i.load(e, n, t, s);
      }));
    }
    parse() {
    }
    setCrossOrigin(e) {
      return this.crossOrigin = e, this;
    }
    setWithCredentials(e) {
      return this.withCredentials = e, this;
    }
    setPath(e) {
      return this.path = e, this;
    }
    setResourcePath(e) {
      return this.resourcePath = e, this;
    }
    setRequestHeader(e) {
      return this.requestHeader = e, this;
    }
  };
  jo.DEFAULT_MATERIAL_NAME = "__DEFAULT";
  var qo = class extends _t {
    constructor(e, t = 1) {
      super(), this.isLight = true, this.type = "Light", this.color = new x(e), this.intensity = t;
    }
    dispose() {
    }
    copy(e, t) {
      return super.copy(e, t), this.color.copy(e.color), this.intensity = e.intensity, this;
    }
    toJSON(e) {
      const t = super.toJSON(e);
      return t.object.color = this.color.getHex(), t.object.intensity = this.intensity, void 0 !== this.groundColor && (t.object.groundColor = this.groundColor.getHex()), void 0 !== this.distance && (t.object.distance = this.distance), void 0 !== this.angle && (t.object.angle = this.angle), void 0 !== this.decay && (t.object.decay = this.decay), void 0 !== this.penumbra && (t.object.penumbra = this.penumbra), void 0 !== this.shadow && (t.object.shadow = this.shadow.toJSON()), t;
    }
  };
  var Ha = new we();
  var ph = new E();
  var mh = new E();
  var Yo = class {
    constructor(e) {
      this.camera = e, this.bias = 0, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new X(512, 512), this.map = null, this.mapPass = null, this.matrix = new we(), this.autoUpdate = true, this.needsUpdate = false, this._frustum = new bn(), this._frameExtents = new X(1, 1), this._viewportCount = 1, this._viewports = [new Ge(0, 0, 1, 1)];
    }
    getViewportCount() {
      return this._viewportCount;
    }
    getFrustum() {
      return this._frustum;
    }
    updateMatrices(e) {
      const t = this.camera, i = this.matrix;
      ph.setFromMatrixPosition(e.matrixWorld), t.position.copy(ph), mh.setFromMatrixPosition(e.target.matrixWorld), t.lookAt(mh), t.updateMatrixWorld(), Ha.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), this._frustum.setFromProjectionMatrix(Ha), i.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1), i.multiply(Ha);
    }
    getViewport(e) {
      return this._viewports[e];
    }
    getFrameExtents() {
      return this._frameExtents;
    }
    dispose() {
      this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
    }
    copy(e) {
      return this.camera = e.camera.clone(), this.bias = e.bias, this.radius = e.radius, this.mapSize.copy(e.mapSize), this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    toJSON() {
      const e = {};
      return 0 !== this.bias && (e.bias = this.bias), 0 !== this.normalBias && (e.normalBias = this.normalBias), 1 !== this.radius && (e.radius = this.radius), 512 === this.mapSize.x && 512 === this.mapSize.y || (e.mapSize = this.mapSize.toArray()), e.camera = this.camera.toJSON(false).object, delete e.camera.matrix, e;
    }
  };
  var fh = new we();
  var tr = new E();
  var za = new E();
  var Zo = class extends Yo {
    constructor() {
      super(new ut(90, 1, 0.5, 500)), this.isPointLightShadow = true, this._frameExtents = new X(4, 2), this._viewportCount = 6, this._viewports = [new Ge(2, 1, 1, 1), new Ge(0, 1, 1, 1), new Ge(3, 1, 1, 1), new Ge(1, 1, 1, 1), new Ge(3, 0, 1, 1), new Ge(1, 0, 1, 1)], this._cubeDirections = [new E(1, 0, 0), new E(-1, 0, 0), new E(0, 0, 1), new E(0, 0, -1), new E(0, 1, 0), new E(0, -1, 0)], this._cubeUps = [new E(0, 1, 0), new E(0, 1, 0), new E(0, 1, 0), new E(0, 1, 0), new E(0, 0, 1), new E(0, 0, -1)];
    }
    updateMatrices(e, t = 0) {
      const i = this.camera, n = this.matrix, s = e.distance || i.far;
      s !== i.far && (i.far = s, i.updateProjectionMatrix()), tr.setFromMatrixPosition(e.matrixWorld), i.position.copy(tr), za.copy(i.position), za.add(this._cubeDirections[t]), i.up.copy(this._cubeUps[t]), i.lookAt(za), i.updateMatrixWorld(), n.makeTranslation(-tr.x, -tr.y, -tr.z), fh.multiplyMatrices(i.projectionMatrix, i.matrixWorldInverse), this._frustum.setFromProjectionMatrix(fh);
    }
  };
  var Fs = class extends qo {
    constructor(e, t, i = 0, n = 2) {
      super(e, t), this.isPointLight = true, this.type = "PointLight", this.distance = i, this.decay = n, this.shadow = new Zo();
    }
    get power() {
      return 4 * this.intensity * Math.PI;
    }
    set power(e) {
      this.intensity = e / (4 * Math.PI);
    }
    dispose() {
      this.shadow.dispose();
    }
    copy(e, t) {
      return super.copy(e, t), this.distance = e.distance, this.decay = e.decay, this.shadow = e.shadow.clone(), this;
    }
  };
  var lf = new we();
  var cf = new we();
  var hf = new we();
  var Tn = class {
    constructor(e = true) {
      this.autoStart = e, this.startTime = 0, this.oldTime = 0, this.elapsedTime = 0, this.running = false;
    }
    start() {
      this.startTime = gh(), this.oldTime = this.startTime, this.elapsedTime = 0, this.running = true;
    }
    stop() {
      this.getElapsedTime(), this.running = false, this.autoStart = false;
    }
    getElapsedTime() {
      return this.getDelta(), this.elapsedTime;
    }
    getDelta() {
      let e = 0;
      if (this.autoStart && !this.running) return this.start(), 0;
      if (this.running) {
        const t = gh();
        e = (t - this.oldTime) / 1e3, this.oldTime = t, this.elapsedTime += e;
      }
      return e;
    }
  };
  function gh() {
    return ("undefined" == typeof performance ? Date : performance).now();
  }
  var uf = new E();
  var df = new qt();
  var pf = new E();
  var mf = new E();
  var ff = new E();
  var gf = new qt();
  var vf = new E();
  var _f = new E();
  var tl = "\\[\\]\\.:\\/";
  var Mp = new RegExp("[" + tl + "]", "g");
  var ka = "[^" + tl + "]";
  var bp = "[^" + tl.replace("\\.", "") + "]";
  var Sp = new RegExp("^" + /((?:WC+[\/:])*)/.source.replace("WC", ka) + /(WCOD+)?/.source.replace("WCOD", bp) + /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", ka) + /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", ka) + "$");
  var Ep = ["material", "materials", "bones", "map"];
  var Xe = class r {
    constructor(e, t, i) {
      this.path = t, this.parsedPath = i || r.parseTrackName(t), this.node = r.findNode(e, this.parsedPath.nodeName), this.rootNode = e, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
    }
    static create(e, t, i) {
      return e && e.isAnimationObjectGroup ? new r.Composite(e, t, i) : new r(e, t, i);
    }
    static sanitizeNodeName(e) {
      return e.replace(/\s/g, "_").replace(Mp, "");
    }
    static parseTrackName(e) {
      const t = Sp.exec(e);
      if (null === t) throw new Error("PropertyBinding: Cannot parse trackName: " + e);
      const i = { nodeName: t[2], objectName: t[3], objectIndex: t[4], propertyName: t[5], propertyIndex: t[6] }, n = i.nodeName && i.nodeName.lastIndexOf(".");
      if (void 0 !== n && -1 !== n) {
        const s = i.nodeName.substring(n + 1);
        -1 !== Ep.indexOf(s) && (i.nodeName = i.nodeName.substring(0, n), i.objectName = s);
      }
      if (null === i.propertyName || 0 === i.propertyName.length) throw new Error("PropertyBinding: can not parse propertyName from trackName: " + e);
      return i;
    }
    static findNode(e, t) {
      if (void 0 === t || "" === t || "." === t || -1 === t || t === e.name || t === e.uuid) return e;
      if (e.skeleton) {
        const i = e.skeleton.getBoneByName(t);
        if (void 0 !== i) return i;
      }
      if (e.children) {
        const i = function(s) {
          for (let a = 0; a < s.length; a++) {
            const o = s[a];
            if (o.name === t || o.uuid === t) return o;
            const l = i(o.children);
            if (l) return l;
          }
          return null;
        }, n = i(e.children);
        if (n) return n;
      }
      return null;
    }
    _getValue_unavailable() {
    }
    _setValue_unavailable() {
    }
    _getValue_direct(e, t) {
      e[t] = this.targetObject[this.propertyName];
    }
    _getValue_array(e, t) {
      const i = this.resolvedProperty;
      for (let n = 0, s = i.length; n !== s; ++n) e[t++] = i[n];
    }
    _getValue_arrayElement(e, t) {
      e[t] = this.resolvedProperty[this.propertyIndex];
    }
    _getValue_toArray(e, t) {
      this.resolvedProperty.toArray(e, t);
    }
    _setValue_direct(e, t) {
      this.targetObject[this.propertyName] = e[t];
    }
    _setValue_direct_setNeedsUpdate(e, t) {
      this.targetObject[this.propertyName] = e[t], this.targetObject.needsUpdate = true;
    }
    _setValue_direct_setMatrixWorldNeedsUpdate(e, t) {
      this.targetObject[this.propertyName] = e[t], this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_array(e, t) {
      const i = this.resolvedProperty;
      for (let n = 0, s = i.length; n !== s; ++n) i[n] = e[t++];
    }
    _setValue_array_setNeedsUpdate(e, t) {
      const i = this.resolvedProperty;
      for (let n = 0, s = i.length; n !== s; ++n) i[n] = e[t++];
      this.targetObject.needsUpdate = true;
    }
    _setValue_array_setMatrixWorldNeedsUpdate(e, t) {
      const i = this.resolvedProperty;
      for (let n = 0, s = i.length; n !== s; ++n) i[n] = e[t++];
      this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_arrayElement(e, t) {
      this.resolvedProperty[this.propertyIndex] = e[t];
    }
    _setValue_arrayElement_setNeedsUpdate(e, t) {
      this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.needsUpdate = true;
    }
    _setValue_arrayElement_setMatrixWorldNeedsUpdate(e, t) {
      this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_fromArray(e, t) {
      this.resolvedProperty.fromArray(e, t);
    }
    _setValue_fromArray_setNeedsUpdate(e, t) {
      this.resolvedProperty.fromArray(e, t), this.targetObject.needsUpdate = true;
    }
    _setValue_fromArray_setMatrixWorldNeedsUpdate(e, t) {
      this.resolvedProperty.fromArray(e, t), this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _getValue_unbound(e, t) {
      this.bind(), this.getValue(e, t);
    }
    _setValue_unbound(e, t) {
      this.bind(), this.setValue(e, t);
    }
    bind() {
      let e = this.node;
      const t = this.parsedPath, i = t.objectName, n = t.propertyName;
      let s = t.propertyIndex;
      if (e || (e = r.findNode(this.rootNode, t.nodeName), this.node = e), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, !e) return void console.warn("THREE.PropertyBinding: No target node found for track: " + this.path + ".");
      if (i) {
        let c = t.objectIndex;
        switch (i) {
          case "materials":
            if (!e.material) return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
            if (!e.material.materials) return void console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.", this);
            e = e.material.materials;
            break;
          case "bones":
            if (!e.skeleton) return void console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.", this);
            e = e.skeleton.bones;
            for (let h = 0; h < e.length; h++) if (e[h].name === c) {
              c = h;
              break;
            }
            break;
          case "map":
            if ("map" in e) {
              e = e.map;
              break;
            }
            if (!e.material) return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
            if (!e.material.map) return void console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.", this);
            e = e.material.map;
            break;
          default:
            if (void 0 === e[i]) return void console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.", this);
            e = e[i];
        }
        if (void 0 !== c) {
          if (void 0 === e[c]) return void console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.", this, e);
          e = e[c];
        }
      }
      const a = e[n];
      if (void 0 === a) {
        const c = t.nodeName;
        return void console.error("THREE.PropertyBinding: Trying to update property for track: " + c + "." + n + " but it wasn't found.", e);
      }
      let o = this.Versioning.None;
      this.targetObject = e, void 0 !== e.needsUpdate ? o = this.Versioning.NeedsUpdate : void 0 !== e.matrixWorldNeedsUpdate && (o = this.Versioning.MatrixWorldNeedsUpdate);
      let l = this.BindingType.Direct;
      if (void 0 !== s) {
        if ("morphTargetInfluences" === n) {
          if (!e.geometry) return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.", this);
          if (!e.geometry.morphAttributes) return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.", this);
          void 0 !== e.morphTargetDictionary[s] && (s = e.morphTargetDictionary[s]);
        }
        l = this.BindingType.ArrayElement, this.resolvedProperty = a, this.propertyIndex = s;
      } else void 0 !== a.fromArray && void 0 !== a.toArray ? (l = this.BindingType.HasFromToArray, this.resolvedProperty = a) : Array.isArray(a) ? (l = this.BindingType.EntireArray, this.resolvedProperty = a) : this.propertyName = n;
      this.getValue = this.GetterByBindingType[l], this.setValue = this.SetterByBindingTypeAndVersioning[l][o];
    }
    unbind() {
      this.node = null, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
    }
  };
  Xe.Composite = class {
    constructor(r, e, t) {
      const i = t || Xe.parseTrackName(e);
      this._targetGroup = r, this._bindings = r.subscribe_(e, i);
    }
    getValue(r, e) {
      this.bind();
      const t = this._targetGroup.nCachedObjects_, i = this._bindings[t];
      void 0 !== i && i.getValue(r, e);
    }
    setValue(r, e) {
      const t = this._bindings;
      for (let i = this._targetGroup.nCachedObjects_, n = t.length; i !== n; ++i) t[i].setValue(r, e);
    }
    bind() {
      const r = this._bindings;
      for (let e = this._targetGroup.nCachedObjects_, t = r.length; e !== t; ++e) r[e].bind();
    }
    unbind() {
      const r = this._bindings;
      for (let e = this._targetGroup.nCachedObjects_, t = r.length; e !== t; ++e) r[e].unbind();
    }
  }, Xe.prototype.BindingType = { Direct: 0, EntireArray: 1, ArrayElement: 2, HasFromToArray: 3 }, Xe.prototype.Versioning = { None: 0, NeedsUpdate: 1, MatrixWorldNeedsUpdate: 2 }, Xe.prototype.GetterByBindingType = [Xe.prototype._getValue_direct, Xe.prototype._getValue_array, Xe.prototype._getValue_arrayElement, Xe.prototype._getValue_toArray], Xe.prototype.SetterByBindingTypeAndVersioning = [[Xe.prototype._setValue_direct, Xe.prototype._setValue_direct_setNeedsUpdate, Xe.prototype._setValue_direct_setMatrixWorldNeedsUpdate], [Xe.prototype._setValue_array, Xe.prototype._setValue_array_setNeedsUpdate, Xe.prototype._setValue_array_setMatrixWorldNeedsUpdate], [Xe.prototype._setValue_arrayElement, Xe.prototype._setValue_arrayElement_setNeedsUpdate, Xe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate], [Xe.prototype._setValue_fromArray, Xe.prototype._setValue_fromArray_setNeedsUpdate, Xe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];
  var yf = new Float32Array(1);
  var xf = new X();
  var Mf = new E();
  var bf = new E();
  var Sf = new E();
  var Ef = new E();
  var Tf = new we();
  var wf = new we();
  var Cf = new E();
  var Af = new x();
  var Rf = new x();
  var Pf = new E();
  var Lf = new E();
  var If = new E();
  var Df = new E();
  var Uf = new or();
  var Nf = new Bt();
  var Of = new E();
  "undefined" != typeof __THREE_DEVTOOLS__ && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: { revision: Va } })), "undefined" != typeof window && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = Va);

  // assets/familiar/three-addons/shaders/CopyShader.js
  var Vs = {
    name: "CopyShader",
    uniforms: {
      "tDiffuse": { value: null },
      "opacity": { value: 1 }
    },
    vertexShader: (
      /* glsl */
      `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
    ),
    fragmentShader: (
      /* glsl */
      `

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`
    )
  };

  // assets/familiar/three-addons/postprocessing/Pass.js
  var kt = class {
    constructor() {
      this.isPass = true;
      this.enabled = true;
      this.needsSwap = true;
      this.clear = false;
      this.renderToScreen = false;
    }
    setSize() {
    }
    render() {
      console.error("THREE.Pass: .render() must be implemented in derived pass.");
    }
    dispose() {
    }
  };
  var Tp = new xi(-1, 1, 1, -1, 0, 1);
  var il = class extends Be {
    constructor() {
      super();
      this.setAttribute("position", new ye([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3));
      this.setAttribute("uv", new ye([0, 2, 0, 0, 2, 0], 2));
    }
  };
  var wp = new il();
  var Rn = class {
    constructor(e) {
      this._mesh = new De(wp, e);
    }
    dispose() {
      this._mesh.geometry.dispose();
    }
    render(e) {
      e.render(this._mesh, Tp);
    }
    get material() {
      return this._mesh.material;
    }
    set material(e) {
      this._mesh.material = e;
    }
  };

  // assets/familiar/three-addons/postprocessing/ShaderPass.js
  var bi = class extends kt {
    constructor(e, t) {
      super();
      this.textureID = t !== void 0 ? t : "tDiffuse";
      if (e instanceof Ee) {
        this.uniforms = e.uniforms;
        this.material = e;
      } else if (e) {
        this.uniforms = Cn.clone(e.uniforms);
        this.material = new Ee({
          name: e.name !== void 0 ? e.name : "unspecified",
          defines: Object.assign({}, e.defines),
          uniforms: this.uniforms,
          vertexShader: e.vertexShader,
          fragmentShader: e.fragmentShader
        });
      }
      this.fsQuad = new Rn(this.material);
    }
    render(e, t, i) {
      if (this.uniforms[this.textureID]) {
        this.uniforms[this.textureID].value = i.texture;
      }
      this.fsQuad.material = this.material;
      if (this.renderToScreen) {
        e.setRenderTarget(null);
        this.fsQuad.render(e);
      } else {
        e.setRenderTarget(t);
        if (this.clear) e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil);
        this.fsQuad.render(e);
      }
    }
    dispose() {
      this.material.dispose();
      this.fsQuad.dispose();
    }
  };

  // assets/familiar/three-addons/postprocessing/MaskPass.js
  var vr = class extends kt {
    constructor(e, t) {
      super();
      this.scene = e;
      this.camera = t;
      this.clear = true;
      this.needsSwap = false;
      this.inverse = false;
    }
    render(e, t, i) {
      const n = e.getContext();
      const s = e.state;
      s.buffers.color.setMask(false);
      s.buffers.depth.setMask(false);
      s.buffers.color.setLocked(true);
      s.buffers.depth.setLocked(true);
      let a, o;
      if (this.inverse) {
        a = 0;
        o = 1;
      } else {
        a = 1;
        o = 0;
      }
      s.buffers.stencil.setTest(true);
      s.buffers.stencil.setOp(n.REPLACE, n.REPLACE, n.REPLACE);
      s.buffers.stencil.setFunc(n.ALWAYS, a, 4294967295);
      s.buffers.stencil.setClear(o);
      s.buffers.stencil.setLocked(true);
      e.setRenderTarget(i);
      if (this.clear) e.clear();
      e.render(this.scene, this.camera);
      e.setRenderTarget(t);
      if (this.clear) e.clear();
      e.render(this.scene, this.camera);
      s.buffers.color.setLocked(false);
      s.buffers.depth.setLocked(false);
      s.buffers.color.setMask(true);
      s.buffers.depth.setMask(true);
      s.buffers.stencil.setLocked(false);
      s.buffers.stencil.setFunc(n.EQUAL, 1, 4294967295);
      s.buffers.stencil.setOp(n.KEEP, n.KEEP, n.KEEP);
      s.buffers.stencil.setLocked(true);
    }
  };
  var Gs = class extends kt {
    constructor() {
      super();
      this.needsSwap = false;
    }
    render(e) {
      e.state.buffers.stencil.setLocked(false);
      e.state.buffers.stencil.setTest(false);
    }
  };

  // assets/familiar/three-addons/postprocessing/EffectComposer.js
  var Ws = class {
    constructor(e, t) {
      this.renderer = e;
      this._pixelRatio = e.getPixelRatio();
      if (t === void 0) {
        const i = e.getSize(new X());
        this._width = i.width;
        this._height = i.height;
        const n = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent) ? Ot : ri;
        t = new at(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: n });
        t.texture.name = "EffectComposer.rt1";
      } else {
        this._width = t.width;
        this._height = t.height;
      }
      this.renderTarget1 = t;
      this.renderTarget2 = t.clone();
      this.renderTarget2.texture.name = "EffectComposer.rt2";
      this.writeBuffer = this.renderTarget1;
      this.readBuffer = this.renderTarget2;
      this.renderToScreen = true;
      this.passes = [];
      this.copyPass = new bi(Vs);
      this.copyPass.material.blending = yh;
      this.clock = new Tn();
    }
    swapBuffers() {
      const e = this.readBuffer;
      this.readBuffer = this.writeBuffer;
      this.writeBuffer = e;
    }
    addPass(e) {
      this.passes.push(e);
      e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
    }
    insertPass(e, t) {
      this.passes.splice(t, 0, e);
      e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
    }
    removePass(e) {
      const t = this.passes.indexOf(e);
      if (t !== -1) {
        this.passes.splice(t, 1);
      }
    }
    isLastEnabledPass(e) {
      for (let t = e + 1; t < this.passes.length; t++) {
        if (this.passes[t].enabled) {
          return false;
        }
      }
      return true;
    }
    render(e) {
      if (e === void 0) {
        e = this.clock.getDelta();
      }
      const t = this.renderer.getRenderTarget();
      let i = false;
      for (let n = 0, s = this.passes.length; n < s; n++) {
        const a = this.passes[n];
        if (a.enabled === false) continue;
        a.renderToScreen = this.renderToScreen && this.isLastEnabledPass(n);
        a.render(this.renderer, this.writeBuffer, this.readBuffer, e, i);
        if (a.needsSwap) {
          if (i) {
            const o = this.renderer.getContext();
            const l = this.renderer.state.buffers.stencil;
            l.setFunc(o.NOTEQUAL, 1, 4294967295);
            this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, e);
            l.setFunc(o.EQUAL, 1, 4294967295);
          }
          this.swapBuffers();
        }
        if (vr !== void 0) {
          if (a instanceof vr) {
            i = true;
          } else if (a instanceof Gs) {
            i = false;
          }
        }
      }
      this.renderer.setRenderTarget(t);
    }
    reset(e) {
      if (e === void 0) {
        const t = this.renderer.getSize(new X());
        this._pixelRatio = this.renderer.getPixelRatio();
        this._width = t.width;
        this._height = t.height;
        e = this.renderTarget1.clone();
        e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
      }
      this.renderTarget1.dispose();
      this.renderTarget2.dispose();
      this.renderTarget1 = e;
      this.renderTarget2 = e.clone();
      this.writeBuffer = this.renderTarget1;
      this.readBuffer = this.renderTarget2;
    }
    setSize(e, t) {
      this._width = e;
      this._height = t;
      const i = this._width * this._pixelRatio;
      const n = this._height * this._pixelRatio;
      this.renderTarget1.setSize(i, n);
      this.renderTarget2.setSize(i, n);
      for (let s = 0; s < this.passes.length; s++) {
        this.passes[s].setSize(i, n);
      }
    }
    setPixelRatio(e) {
      this._pixelRatio = e;
      this.setSize(this._width, this._height);
    }
    dispose() {
      this.renderTarget1.dispose();
      this.renderTarget2.dispose();
      this.copyPass.dispose();
    }
  };

  // assets/familiar/three-addons/postprocessing/RenderPass.js
  var Xs = class extends kt {
    constructor(e, t, i = null, n = null, s = null) {
      super();
      this.scene = e;
      this.camera = t;
      this.overrideMaterial = i;
      this.clearColor = n;
      this.clearAlpha = s;
      this.clear = true;
      this.clearDepth = false;
      this.needsSwap = false;
      this._oldClearColor = new x();
    }
    render(e, t, i) {
      const n = e.autoClear;
      e.autoClear = false;
      let s, a;
      if (this.overrideMaterial !== null) {
        a = this.scene.overrideMaterial;
        this.scene.overrideMaterial = this.overrideMaterial;
      }
      if (this.clearColor !== null) {
        e.getClearColor(this._oldClearColor);
        e.setClearColor(this.clearColor);
      }
      if (this.clearAlpha !== null) {
        s = e.getClearAlpha();
        e.setClearAlpha(this.clearAlpha);
      }
      if (this.clearDepth == true) {
        e.clearDepth();
      }
      e.setRenderTarget(this.renderToScreen ? null : i);
      if (this.clear === true) {
        e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil);
      }
      e.render(this.scene, this.camera);
      if (this.clearColor !== null) {
        e.setClearColor(this._oldClearColor);
      }
      if (this.clearAlpha !== null) {
        e.setClearAlpha(s);
      }
      if (this.overrideMaterial !== null) {
        this.scene.overrideMaterial = a;
      }
      e.autoClear = n;
    }
  };

  // assets/familiar/three-addons/shaders/LuminosityHighPassShader.js
  var kh = {
    name: "LuminosityHighPassShader",
    shaderID: "luminosityHighPass",
    uniforms: {
      "tDiffuse": { value: null },
      "luminosityThreshold": { value: 1 },
      "smoothWidth": { value: 1 },
      "defaultColor": { value: new x(0) },
      "defaultOpacity": { value: 0 }
    },
    vertexShader: (
      /* glsl */
      `

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
    ),
    fragmentShader: (
      /* glsl */
      `

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`
    )
  };

  // assets/familiar/three-addons/postprocessing/UnrealBloomPass.js
  var Pn = class r extends kt {
    constructor(e, t, i, n) {
      super();
      this.strength = t !== void 0 ? t : 1;
      this.radius = i;
      this.threshold = n;
      this.resolution = e !== void 0 ? new X(e.x, e.y) : new X(256, 256);
      this.clearColor = new x(0, 0, 0);
      this.renderTargetsHorizontal = [];
      this.renderTargetsVertical = [];
      this.nMips = 5;
      let s = Math.round(this.resolution.x / 2);
      let a = Math.round(this.resolution.y / 2);
      const o = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent) ? Ot : ri;
      this.renderTargetBright = new at(s, a, { type: o });
      this.renderTargetBright.texture.name = "UnrealBloomPass.bright";
      this.renderTargetBright.texture.generateMipmaps = false;
      for (let d = 0; d < this.nMips; d++) {
        const p = new at(s, a, { type: o });
        p.texture.name = "UnrealBloomPass.h" + d;
        p.texture.generateMipmaps = false;
        this.renderTargetsHorizontal.push(p);
        const f = new at(s, a, { type: o });
        f.texture.name = "UnrealBloomPass.v" + d;
        f.texture.generateMipmaps = false;
        this.renderTargetsVertical.push(f);
        s = Math.round(s / 2);
        a = Math.round(a / 2);
      }
      const l = kh;
      this.highPassUniforms = Cn.clone(l.uniforms);
      this.highPassUniforms["luminosityThreshold"].value = n;
      this.highPassUniforms["smoothWidth"].value = 0.01;
      this.materialHighPassFilter = new Ee({
        uniforms: this.highPassUniforms,
        vertexShader: l.vertexShader,
        fragmentShader: l.fragmentShader
      });
      this.separableBlurMaterials = [];
      const c = [3, 5, 7, 9, 11];
      s = Math.round(this.resolution.x / 2);
      a = Math.round(this.resolution.y / 2);
      for (let d = 0; d < this.nMips; d++) {
        this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[d]));
        this.separableBlurMaterials[d].uniforms["invSize"].value = new X(1 / s, 1 / a);
        s = Math.round(s / 2);
        a = Math.round(a / 2);
      }
      this.compositeMaterial = this.getCompositeMaterial(this.nMips);
      this.compositeMaterial.uniforms["blurTexture1"].value = this.renderTargetsVertical[0].texture;
      this.compositeMaterial.uniforms["blurTexture2"].value = this.renderTargetsVertical[1].texture;
      this.compositeMaterial.uniforms["blurTexture3"].value = this.renderTargetsVertical[2].texture;
      this.compositeMaterial.uniforms["blurTexture4"].value = this.renderTargetsVertical[3].texture;
      this.compositeMaterial.uniforms["blurTexture5"].value = this.renderTargetsVertical[4].texture;
      this.compositeMaterial.uniforms["bloomStrength"].value = t;
      this.compositeMaterial.uniforms["bloomRadius"].value = 0.1;
      const h = [1, 0.8, 0.6, 0.4, 0.2];
      this.compositeMaterial.uniforms["bloomFactors"].value = h;
      this.bloomTintColors = [new E(1, 1, 1), new E(1, 1, 1), new E(1, 1, 1), new E(1, 1, 1), new E(1, 1, 1)];
      this.compositeMaterial.uniforms["bloomTintColors"].value = this.bloomTintColors;
      const u = Vs;
      this.copyUniforms = Cn.clone(u.uniforms);
      this.blendMaterial = new Ee({
        uniforms: this.copyUniforms,
        vertexShader: u.vertexShader,
        fragmentShader: u.fragmentShader,
        blending: Ve,
        depthTest: false,
        depthWrite: false,
        transparent: true
      });
      this.enabled = true;
      this.needsSwap = false;
      this._oldClearColor = new x();
      this.oldClearAlpha = 1;
      this.basic = new zt();
      this.fsQuad = new Rn(null);
    }
    dispose() {
      for (let e = 0; e < this.renderTargetsHorizontal.length; e++) {
        this.renderTargetsHorizontal[e].dispose();
      }
      for (let e = 0; e < this.renderTargetsVertical.length; e++) {
        this.renderTargetsVertical[e].dispose();
      }
      this.renderTargetBright.dispose();
      for (let e = 0; e < this.separableBlurMaterials.length; e++) {
        this.separableBlurMaterials[e].dispose();
      }
      this.compositeMaterial.dispose();
      this.blendMaterial.dispose();
      this.basic.dispose();
      this.fsQuad.dispose();
    }
    setSize(e, t) {
      let i = Math.round(e / 2);
      let n = Math.round(t / 2);
      this.renderTargetBright.setSize(i, n);
      for (let s = 0; s < this.nMips; s++) {
        this.renderTargetsHorizontal[s].setSize(i, n);
        this.renderTargetsVertical[s].setSize(i, n);
        this.separableBlurMaterials[s].uniforms["invSize"].value = new X(1 / i, 1 / n);
        i = Math.round(i / 2);
        n = Math.round(n / 2);
      }
    }
    render(e, t, i, n, s) {
      e.getClearColor(this._oldClearColor);
      this.oldClearAlpha = e.getClearAlpha();
      const a = e.autoClear;
      e.autoClear = false;
      e.setClearColor(this.clearColor, 0);
      if (s) e.state.buffers.stencil.setTest(false);
      if (this.renderToScreen) {
        this.fsQuad.material = this.basic;
        this.basic.map = i.texture;
        e.setRenderTarget(null);
        e.clear();
        this.fsQuad.render(e);
      }
      this.highPassUniforms["tDiffuse"].value = i.texture;
      this.highPassUniforms["luminosityThreshold"].value = this.threshold;
      this.fsQuad.material = this.materialHighPassFilter;
      e.setRenderTarget(this.renderTargetBright);
      e.clear();
      this.fsQuad.render(e);
      let o = this.renderTargetBright;
      for (let l = 0; l < this.nMips; l++) {
        this.fsQuad.material = this.separableBlurMaterials[l];
        this.separableBlurMaterials[l].uniforms["colorTexture"].value = o.texture;
        this.separableBlurMaterials[l].uniforms["direction"].value = r.BlurDirectionX;
        e.setRenderTarget(this.renderTargetsHorizontal[l]);
        e.clear();
        this.fsQuad.render(e);
        this.separableBlurMaterials[l].uniforms["colorTexture"].value = this.renderTargetsHorizontal[l].texture;
        this.separableBlurMaterials[l].uniforms["direction"].value = r.BlurDirectionY;
        e.setRenderTarget(this.renderTargetsVertical[l]);
        e.clear();
        this.fsQuad.render(e);
        o = this.renderTargetsVertical[l];
      }
      this.fsQuad.material = this.compositeMaterial;
      this.compositeMaterial.uniforms["bloomStrength"].value = this.strength;
      this.compositeMaterial.uniforms["bloomRadius"].value = this.radius;
      this.compositeMaterial.uniforms["bloomTintColors"].value = this.bloomTintColors;
      e.setRenderTarget(this.renderTargetsHorizontal[0]);
      e.clear();
      this.fsQuad.render(e);
      this.fsQuad.material = this.blendMaterial;
      this.copyUniforms["tDiffuse"].value = this.renderTargetsHorizontal[0].texture;
      if (s) e.state.buffers.stencil.setTest(true);
      if (this.renderToScreen) {
        e.setRenderTarget(null);
        this.fsQuad.render(e);
      } else {
        e.setRenderTarget(i);
        this.fsQuad.render(e);
      }
      e.setClearColor(this._oldClearColor, this.oldClearAlpha);
      e.autoClear = a;
    }
    getSeperableBlurMaterial(e) {
      const t = [];
      for (let i = 0; i < e; i++) {
        t.push(0.39894 * Math.exp(-0.5 * i * i / (e * e)) / e);
      }
      return new Ee({
        defines: {
          "KERNEL_RADIUS": e
        },
        uniforms: {
          "colorTexture": { value: null },
          "invSize": { value: new X(0.5, 0.5) },
          // inverse texture size
          "direction": { value: new X(0.5, 0.5) },
          "gaussianCoefficients": { value: t }
          // precomputed Gaussian coefficients
        },
        vertexShader: `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
        fragmentShader: `#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`
      });
    }
    getCompositeMaterial(e) {
      return new Ee({
        defines: {
          "NUM_MIPS": e
        },
        uniforms: {
          "blurTexture1": { value: null },
          "blurTexture2": { value: null },
          "blurTexture3": { value: null },
          "blurTexture4": { value: null },
          "blurTexture5": { value: null },
          "bloomStrength": { value: 1 },
          "bloomFactors": { value: null },
          "bloomTintColors": { value: null },
          "bloomRadius": { value: 0 }
        },
        vertexShader: `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
        fragmentShader: `varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`
      });
    }
  };
  Pn.BlurDirectionX = new X(1, 0);
  Pn.BlurDirectionY = new X(0, 1);

  // assets/familiar/chimera-fx/core/StateMachine.js
  var Ln = class {
    constructor(e = {}) {
      this.states = e.states || {};
      this.current = e.initial || "idle";
      this.previous = null;
      this.currentValues = { ...this.states[this.current] };
      this.targetValues = { ...this.currentValues };
      this.onTransition = e.onTransition || (() => {
      });
      this.transitionStartTime = 0;
      this.history = [];
    }
    transitionTo(e) {
      if (!this.states[e] || e === this.current) return;
      this.previous = this.current;
      this.current = e;
      this.targetValues = { ...this.states[e] };
      this.transitionStartTime = performance.now();
      this.history.push({ from: this.previous, to: e, at: Date.now() });
      if (this.history.length > 50) this.history.shift();
      this.onTransition(this.previous, this.current, this.targetValues);
    }
    /** Call per frame to interpolate currentValues toward targetValues */
    update(e) {
      const t = this.targetValues.transitionSpeed || 0.05;
      for (const i in this.targetValues) {
        if (i === "transitionSpeed") continue;
        if (typeof this.targetValues[i] === "number" && typeof this.currentValues[i] === "number") {
          this.currentValues[i] += (this.targetValues[i] - this.currentValues[i]) * t;
        }
      }
    }
    get isTransitioning() {
      if (!this.targetValues) return false;
      for (const e in this.targetValues) {
        if (e === "transitionSpeed") continue;
        if (typeof this.targetValues[e] === "number") {
          if (Math.abs(this.targetValues[e] - (this.currentValues[e] || 0)) > 1e-3) return true;
        }
      }
      return false;
    }
  };

  // assets/familiar/chimera-fx/postfx/ChromaticAberrationShader.js
  var Vh = {
    name: "ChromaticAberration",
    uniforms: {
      tDiffuse: { value: null },
      uIntensity: { value: 3e-3 },
      uDirection: { value: [1, 0] }
    },
    vertexShader: (
      /* glsl */
      `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
    ),
    fragmentShader: (
      /* glsl */
      `
    uniform sampler2D tDiffuse;
    uniform float uIntensity;
    uniform vec2 uDirection;
    varying vec2 vUv;

    void main() {
      vec2 offset = uIntensity * normalize(vUv - 0.5);
      float r = texture2D(tDiffuse, vUv + offset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - offset).b;
      float a = texture2D(tDiffuse, vUv).a;
      gl_FragColor = vec4(r, g, b, a);
    }
  `
    )
  };

  // assets/familiar/chimera-fx/postfx/FilmGrainShader.js
  var Gh = {
    name: "FilmGrain",
    uniforms: {
      tDiffuse: { value: null },
      uTime: { value: 0 },
      uIntensity: { value: 0.08 },
      uSize: { value: 1.5 }
    },
    vertexShader: (
      /* glsl */
      `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
    ),
    fragmentShader: (
      /* glsl */
      `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uIntensity;
    uniform float uSize;
    varying vec2 vUv;

    // Fast pseudo-random
    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);

      // Animated grain
      vec2 grainUv = vUv * uSize + uTime * vec2(12.9898, 78.233);
      float grain = hash(grainUv) * 2.0 - 1.0;

      // Luminance-weighted: more grain in shadows, less in highlights
      float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      float grainWeight = mix(1.0, 0.3, lum);

      color.rgb += grain * uIntensity * grainWeight;
      gl_FragColor = color;
    }
  `
    )
  };

  // assets/familiar/chimera-fx/postfx/GlitchShader.js
  var Wh = {
    name: "Glitch",
    uniforms: {
      tDiffuse: { value: null },
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uResolution: { value: [1920, 1080] }
    },
    vertexShader: (
      /* glsl */
      `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
    ),
    fragmentShader: (
      /* glsl */
      `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uIntensity;
    uniform vec2 uResolution;
    varying vec2 vUv;

    float hash(float n) { return fract(sin(n) * 43758.5453); }

    float blockNoise(vec2 uv, float blockSize) {
      vec2 block = floor(uv * blockSize);
      return hash(block.x + block.y * 337.0 + floor(uTime * 8.0) * 1777.0);
    }

    void main() {
      vec2 uv = vUv;
      float intensity = uIntensity;

      // \u2500\u2500 Scan-line displacement \u2500\u2500
      float scanLine = step(0.98, hash(floor(uv.y * 200.0) + uTime * 17.0));
      uv.x += scanLine * (hash(uTime * 3.0 + uv.y) - 0.5) * 0.08 * intensity;

      // \u2500\u2500 Block displacement \u2500\u2500
      float blockVal = blockNoise(uv, 8.0);
      float blockActive = step(0.92, blockVal) * intensity;
      uv.x += blockActive * (hash(blockVal * 100.0 + uTime) - 0.5) * 0.1;

      // \u2500\u2500 RGB channel separation \u2500\u2500
      float shift = intensity * 0.01;
      vec4 cr = texture2D(tDiffuse, uv + vec2(shift, 0.0));
      vec4 cg = texture2D(tDiffuse, uv);
      vec4 cb = texture2D(tDiffuse, uv - vec2(shift, 0.0));

      vec4 color = vec4(cr.r, cg.g, cb.b, cg.a);

      // \u2500\u2500 Noise injection \u2500\u2500
      float noise = hash(uv.x * 10000.0 + uv.y * 10000.0 + uTime * 100.0);
      float noiseActive = step(0.97, blockNoise(uv, 4.0)) * intensity;
      color.rgb = mix(color.rgb, vec3(noise), noiseActive * 0.5);

      // \u2500\u2500 Temporal flicker \u2500\u2500
      float flicker = 1.0 - step(0.95, hash(floor(uTime * 20.0))) * intensity * 0.3;
      color.rgb *= flicker;

      gl_FragColor = color;
    }
  `
    )
  };

  // assets/familiar/chimera-fx/core/Engine.js
  var In = class {
    constructor(e = {}) {
      this.container = typeof e.container === "string" ? document.querySelector(e.container) : e.container || document.body;
      this.components = [];
      this.clock = new Tn();
      this.mouse = new X(0, 0);
      this.mouseNDC = new X(0, 0);
      this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.targetFPS = e.fps || 60;
      this.frameInterval = 1e3 / this.targetFPS;
      this.lastFrame = 0;
      this.running = false;
      this.disposed = false;
      this.theme = null;
      this.uniforms = {};
      this._initRenderer();
      this._initScene();
      this._initCamera();
      this._initPostProcessing(e);
      this._initStateMachine();
      this._initEvents();
      if (e.theme) this.setTheme(e.theme);
    }
    // ─── Renderer ───────────────────────────────────────────────────────────
    _initRenderer() {
      this.renderer = new lr({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setClearColor(0, 0);
      this.renderer.toneMapping = Jo;
      this.renderer.toneMappingExposure = 1;
      this.renderer.outputColorSpace = Qe;
      const e = this.renderer.domElement;
      e.id = "chimera-fx-canvas";
      e.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2;pointer-events:none;opacity:0.85;mix-blend-mode:screen;";
      if (this.container.firstChild) {
        this.container.insertBefore(e, this.container.firstChild);
      } else {
        this.container.appendChild(e);
      }
    }
    // ─── Scene ──────────────────────────────────────────────────────────────
    _initScene() {
      this.scene = new ki();
      this.scene.fog = new Ss(0, 15e-4);
    }
    // ─── Camera ─────────────────────────────────────────────────────────────
    _initCamera() {
      const e = this.container.clientWidth / this.container.clientHeight;
      this.camera = new ut(60, e, 0.1, 1e3);
      this.camera.position.set(0, 0, 30);
      this.camera.lookAt(0, 0, 0);
    }
    // ─── Post-Processing Pipeline ───────────────────────────────────────────
    _initPostProcessing(e) {
      const t = this.container.clientWidth;
      const i = this.container.clientHeight;
      this.composer = new Ws(this.renderer);
      this.composer.setSize(t, i);
      this.renderPass = new Xs(this.scene, this.camera);
      this.composer.addPass(this.renderPass);
      this.bloomPass = new Pn(
        new X(t, i),
        e.bloomStrength ?? 0.4,
        // strength
        e.bloomRadius ?? 0.6,
        // radius
        e.bloomThreshold ?? 0.3
        // threshold
      );
      this.composer.addPass(this.bloomPass);
      this.chromaPass = new bi(Vh);
      this.chromaPass.uniforms.uIntensity.value = 0;
      this.composer.addPass(this.chromaPass);
      this.grainPass = new bi(Gh);
      this.grainPass.uniforms.uIntensity.value = 0.01;
      this.composer.addPass(this.grainPass);
      this.glitchPass = new bi(Wh);
      this.glitchPass.uniforms.uIntensity.value = 0;
      this.glitchPass.enabled = false;
      this.composer.addPass(this.glitchPass);
    }
    // ─── AI State Machine ──────────────────────────────────────────────────
    _initStateMachine() {
      this.stateMachine = new Ln({
        initial: "idle",
        states: {
          idle: {
            bloomStrength: 0.4,
            chromaIntensity: 0,
            grainIntensity: 0.01,
            glitchIntensity: 0,
            componentIntensity: 0.15,
            transitionSpeed: 0.03
          },
          thinking: {
            bloomStrength: 0.7,
            chromaIntensity: 1e-3,
            grainIntensity: 8e-3,
            glitchIntensity: 0,
            componentIntensity: 0.35,
            transitionSpeed: 0.05
          },
          streaming: {
            bloomStrength: 0.6,
            chromaIntensity: 1e-3,
            grainIntensity: 8e-3,
            glitchIntensity: 0,
            componentIntensity: 0.3,
            transitionSpeed: 0.04
          },
          executing: {
            bloomStrength: 0.9,
            chromaIntensity: 2e-3,
            grainIntensity: 5e-3,
            glitchIntensity: 0,
            componentIntensity: 0.5,
            transitionSpeed: 0.08
          },
          error: {
            bloomStrength: 0.6,
            chromaIntensity: 4e-3,
            grainIntensity: 0.02,
            glitchIntensity: 0.5,
            componentIntensity: 0.25,
            transitionSpeed: 0.1
          },
          success: {
            bloomStrength: 1.2,
            chromaIntensity: 2e-3,
            grainIntensity: 5e-3,
            glitchIntensity: 0,
            componentIntensity: 0.6,
            transitionSpeed: 0.08
          }
        },
        onTransition: (e, t, i) => this._applyStateValues(i)
      });
    }
    _applyStateValues(e) {
      this._targetState = e;
    }
    // ─── Events ─────────────────────────────────────────────────────────────
    _initEvents() {
      this._onResize = this._resize.bind(this);
      this._onMouseMove = (e) => {
        this.mouse.set(e.clientX, e.clientY);
        const t = this.container.clientWidth;
        const i = this.container.clientHeight;
        this.mouseNDC.set(e.clientX / t * 2 - 1, -(e.clientY / i) * 2 + 1);
      };
      this._onVisChange = () => {
        if (document.hidden) this._pause();
        else this._resume();
      };
      window.addEventListener("resize", this._onResize);
      window.addEventListener("mousemove", this._onMouseMove);
      document.addEventListener("visibilitychange", this._onVisChange);
      window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
        this.reducedMotion = e.matches;
      });
    }
    _resize() {
      const e = this.container.clientWidth;
      const t = this.container.clientHeight;
      this.camera.aspect = e / t;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(e, t);
      this.composer.setSize(e, t);
      this.components.forEach((i) => i.onResize?.(e, t, this));
    }
    // ─── Component API ──────────────────────────────────────────────────────
    addComponent(e) {
      e.init?.(this);
      this.components.push(e);
      return this;
    }
    removeComponent(e) {
      const t = this.components.indexOf(e);
      if (t >= 0) {
        e.dispose?.(this);
        this.components.splice(t, 1);
      }
      return this;
    }
    /**
     * Enable a component by registry name (e.g. 'nebula', 'tendrils', 'rivers').
     * Uses window.ChimeraFX.components registry if available.
     */
    _resolveComponentCtor(e) {
      const t = window.ChimeraFX?.components;
      if (!t || !e) return null;
      return t[e] || t[String(e).toLowerCase()] || null;
    }
    _hasComponentCtor(e) {
      if (!e) return false;
      return this.components.some((t) => t instanceof e || t.constructor === e || t.constructor?.name === e.name);
    }
    enableComponent(e) {
      const t = this._resolveComponentCtor(e);
      if (!t) {
        console.warn("ChimeraFX: Unknown component:", e);
        return this;
      }
      if (this._hasComponentCtor(t)) return this;
      const i = new t();
      return this.addComponent(i);
    }
    /**
     * Disable and remove a component by registry name.
     */
    disableComponent(e) {
      const t = this._resolveComponentCtor(e);
      const i = t ? this.components.find((n) => n instanceof t || n.constructor === t || n.constructor?.name === t.name) : this.components.find((n) => n.constructor?.name === e);
      if (i) this.removeComponent(i);
      return this;
    }
    /**
     * Check if a component is currently enabled.
     */
    isComponentEnabled(e) {
      const t = this._resolveComponentCtor(e);
      return t ? this._hasComponentCtor(t) : this.components.some((i) => i.constructor?.name === e);
    }
    /**
     * Replace active components with a curated registry-name preset.
     */
    setComponentPreset(e = []) {
      const t = [];
      for (const i of e) {
        const n = this._resolveComponentCtor(i);
        if (n && !t.includes(n)) t.push(n);
      }
      if (!t.length) return this;
      for (const i of [...this.components]) {
        if (!t.some((n) => i instanceof n || i.constructor === n || i.constructor?.name === n.name)) {
          this.removeComponent(i);
        }
      }
      for (const i of t) {
        if (!this._hasComponentCtor(i)) {
          this.addComponent(new i());
        }
      }
      return this;
    }
    /**
     * Get the current enabled component names.
     */
    getEnabledComponents() {
      return this.components.map((e) => e.constructor?.name).filter(Boolean);
    }
    // ─── Theme API ──────────────────────────────────────────────────────────
    setTheme(e) {
      if (typeof e === "string") {
        this.theme = window.ChimeraFX?._themes?.[e] || null;
      } else {
        this.theme = e;
      }
      if (this.theme) {
        this.theme.apply?.(this);
        this.components.forEach((t) => t.onThemeChange?.(this.theme, this));
      }
      return this;
    }
    // ─── State API (for AI hooks) ───────────────────────────────────────────
    setState(e) {
      this.stateMachine.transitionTo(e);
      this.components.forEach((t) => t.onStateChange?.(e, this));
      return this;
    }
    /** One-shot burst effect (trade execution, notification, etc.) */
    pulse(e = "default", t = {}) {
      this.components.forEach((i) => i.onPulse?.(e, t, this));
      if (e === "trade" || e === "success") {
        this.setState("success");
        setTimeout(() => this.setState("idle"), 2e3);
      } else if (e === "error") {
        this.setState("error");
        this.glitchPass.enabled = true;
        setTimeout(() => {
          this.setState("idle");
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
    setUserIntensity(e) {
      this._userIntensity = Math.min(1, Math.max(0, e));
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
      const e = this._targetState || this.stateMachine.currentValues;
      const t = this.getUserIntensity();
      if (t >= 1) return e;
      const i = { ...e };
      const n = [
        "bloomStrength",
        "chromaIntensity",
        "grainIntensity",
        "glitchIntensity",
        "componentIntensity"
      ];
      for (const s of n) {
        if (typeof i[s] === "number") {
          i[s] = i[s] * t;
        }
      }
      return i;
    }
    _syncPostProcessingToIntensity() {
      const e = this._getEffectiveTarget();
      if (!e) return;
      if (this.bloomPass && typeof e.bloomStrength === "number") {
        this.bloomPass.strength = e.bloomStrength;
      }
      if (this.chromaPass?.uniforms?.uIntensity && typeof e.chromaIntensity === "number") {
        this.chromaPass.uniforms.uIntensity.value = e.chromaIntensity;
      }
      if (this.grainPass?.uniforms?.uIntensity && typeof e.grainIntensity === "number") {
        this.grainPass.uniforms.uIntensity.value = e.grainIntensity;
      }
      if (this.glitchPass?.uniforms?.uIntensity && typeof e.glitchIntensity === "number") {
        this.glitchPass.uniforms.uIntensity.value = e.glitchIntensity;
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
    _pause() {
      this.running = false;
    }
    _resume() {
      if (!this.running && !this.disposed) {
        this.running = true;
        this.clock.start();
        this._animate(performance.now());
      }
    }
    _animate(e) {
      if (!this.running || this.disposed) return;
      requestAnimationFrame(this._animate.bind(this));
      if (e - this.lastFrame < this.frameInterval) return;
      this.lastFrame = e;
      if (this.reducedMotion) return;
      const t = Math.min(this.clock.getDelta(), 0.05);
      const i = this.clock.getElapsedTime();
      const n = this._getEffectiveTarget();
      if (n) {
        const a = n.transitionSpeed || 0.05;
        this.bloomPass.strength += (n.bloomStrength - this.bloomPass.strength) * a;
        this.chromaPass.uniforms.uIntensity.value += (n.chromaIntensity - this.chromaPass.uniforms.uIntensity.value) * a;
        this.grainPass.uniforms.uTime.value = i;
        this.grainPass.uniforms.uIntensity.value += (n.grainIntensity - this.grainPass.uniforms.uIntensity.value) * a;
        if (this.glitchPass.enabled) {
          this.glitchPass.uniforms.uTime.value = i;
          this.glitchPass.uniforms.uIntensity.value += (n.glitchIntensity - this.glitchPass.uniforms.uIntensity.value) * a;
        }
      }
      const s = {
        dt: t,
        elapsed: i,
        mouse: this.mouse,
        mouseNDC: this.mouseNDC,
        state: this.stateMachine.current,
        intensity: n?.componentIntensity ?? 0.3,
        theme: this.theme
      };
      this.components.forEach((a) => a.update?.(s, this));
      this.camera.position.x = Math.sin(i * 0.1) * 0.5;
      this.camera.position.y = Math.cos(i * 0.07) * 0.3;
      this.composer.render(t);
    }
    // ─── Cleanup ────────────────────────────────────────────────────────────
    dispose() {
      this.disposed = true;
      this.running = false;
      window.removeEventListener("resize", this._onResize);
      window.removeEventListener("mousemove", this._onMouseMove);
      document.removeEventListener("visibilitychange", this._onVisChange);
      this.components.forEach((e) => e.dispose?.(this));
      this.components = [];
      this.composer.dispose();
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  };
  if (typeof window !== "undefined") {
    window.ChimeraFX = window.ChimeraFX || {};
    window.ChimeraFX.Engine = In;
    window.ChimeraFX._themes = window.ChimeraFX._themes || {};
  }

  // assets/familiar/chimera-fx/core/ShapableMatter.js
  var Cp = (
    /* glsl */
    `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uMouse;
  uniform float uModeParam;

  attribute vec3 aOffset;
  attribute vec3 aVelocity;
  attribute float aLife;
  attribute float aSize;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  // \u2500\u2500 3D curl noise \u2500\u2500
  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }

  float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(dot(hash3(i), f),
                       dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                   mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
                       dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
               mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
                       dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                   mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
                       dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
  }

  vec3 curlNoise(vec3 p) {
    float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);
    float x = noise3D(p + dy) - noise3D(p - dy) - noise3D(p + dz) + noise3D(p - dz);
    float y = noise3D(p + dz) - noise3D(p - dz) - noise3D(p + dx) + noise3D(p - dx);
    float z = noise3D(p + dx) - noise3D(p - dx) - noise3D(p + dy) + noise3D(p - dy);
    return normalize(vec3(x, y, z)) / (2.0 * e);
  }

  void main() {
    float speed = 0.15 + uIntensity * 0.3;
    vec3 pos = aOffset;
    pos += curlNoise(pos * 0.08 + uTime * speed * 0.1) * uTime * speed * 0.5;

    // Orbital rotation around center
    float angle = uTime * 0.05 * (1.0 + uIntensity);
    mat3 rot = mat3(
      cos(angle), 0.0, sin(angle),
      0.0, 1.0, 0.0,
      -sin(angle), 0.0, cos(angle)
    );
    pos = rot * pos;

    // Mouse influence
    vec3 mouseWorld = vec3(uMouse * 15.0, 0.0);
    vec3 toMouse = mouseWorld - pos;
    float mouseDist = length(toMouse);
    pos += normalize(toMouse) * (2.0 / max(mouseDist, 1.0)) * uIntensity;

    float life = fract(aLife + uTime * 0.02);
    vLife = life;
    vAlpha = sin(life * 3.14159) * (0.25 + uIntensity * 0.75);
    vColor = aColor * (0.5 + uIntensity * 0.5);

    float size = aSize * (1.0 + sin(uTime * 2.0 + aLife * 20.0) * 0.3 * uIntensity);

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (300.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`
  );
  var Ap = (
    /* glsl */
    `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.1, dist);
    float halo = smoothstep(0.5, 0.0, dist) * 0.3;
    float alpha = (core + halo) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`
  );
  var Rp = (
    /* glsl */
    `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  void main() {
    float dist = length(gl_PointCoord - 0.5);
    // Soap-bubble iridescence: color shifts over time + distance from center
    float hueShift = fract(vLife + uTime * 0.05 + dist * 2.0);
    vec3 iridescent = vColor + 0.3 * vec3(
      sin(hueShift * 6.28),
      sin(hueShift * 6.28 + 2.09),
      sin(hueShift * 6.28 + 4.18)
    );
    // Soft merging blob with Fresnel edge glow
    float blob = smoothstep(0.5, 0.25, dist);
    float edge = pow(1.0 - dist * 2.0, 3.0) * 0.6;
    float alpha = (blob * 0.8 + edge * 0.4) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(iridescent, alpha);
  }
`
  );
  var Pp = (
    /* glsl */
    `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  // Generate a pseudo-random value for faceting
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float angle = atan(uv.y, uv.x);
    // 6-sided crystal facets
    float facet = floor((angle + 3.14159) / 1.0472); // 6 segments
    float facetBright = 0.7 + hash(vec2(facet, vLife)) * 0.3;
    // Sharp diamond-shaped core
    float diamond = 1.0 - abs(uv.x) * 2.0 - abs(uv.y) * 2.0;
    diamond = smoothstep(0.0, 0.15, diamond);
    // Prismatic rainbow on edges
    float edge = smoothstep(0.45, 0.5, length(uv)) - smoothstep(0.5, 0.55, length(uv));
    vec3 prism = vColor * facetBright + edge * vec3(
      sin(uTime * 3.0 + facet) * 0.4,
      sin(uTime * 3.0 + facet + 2.09) * 0.4,
      sin(uTime * 3.0 + facet + 4.18) * 0.4
    );
    float alpha = max(diamond * 0.85, edge * 0.9) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(prism, alpha);
  }
`
  );
  var Lp = (
    /* glsl */
    `
  uniform float uTime;
  uniform float uModeParam;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    // Bright-hot core with fuzzy halo
    float core = exp(-dist * 8.0) * 1.5;
    float halo = exp(-dist * 2.5) * 0.4;
    // Tendril streaks via noise
    float streak = noise(vec2(floor(dist * 12.0) + uTime * 2.0, vLife));
    streak = smoothstep(0.3, 0.7, streak) * (1.0 - dist * 1.2);
    // Fast flicker \u2014 20-30 Hz feel
    float flicker = 0.7 + 0.3 * sin(uTime * 25.0 + vLife * 50.0);
    // Color: white-hot core \u2192 colored outer glow
    vec3 plasmaColor = mix(vec3(1.0), vColor, dist * 1.5) * flicker;
    float alpha = (core * 0.9 + halo * 0.5 + streak * 0.6) * vAlpha * flicker;
    if (alpha < 0.005) discard;
    gl_FragColor = vec4(plasmaColor, alpha);
  }
`
  );
  var Ip = (
    /* glsl */
    `
  uniform float uTime;
  uniform float uModeParam;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);
    // Concentric ring ripples
    float rings = sin(dist * 20.0 - uTime * 3.0) * 0.5 + 0.5;
    rings *= exp(-dist * 2.0); // rings fade outward
    // Spike vertices at 8 fixed intervals
    float spike = 0.0;
    for (int i = 0; i < 8; i++) {
      float a = float(i) * 0.785; // PI/4 intervals
      float spikeAngle = abs(mod(angle - a + 3.14159, 6.28318) - 3.14159);
      float spikeDist = spikeAngle * 3.0;
      float spikeHeight = uModeParam * 0.5 + 0.5;
      spike += exp(-spikeDist * spikeDist * 15.0) * spikeHeight;
    }
    // Metallic sheen
    float metallic = 0.4 + rings * 0.4 + spike * 0.3;
    vec3 ferroColor = vColor * metallic + vec3(0.2) * spike;
    float alpha = metallic * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(ferroColor, alpha);
  }
`
  );
  var Dp = (
    /* glsl */
    `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  vec2 random2(vec2 p) {
    return fract(sin(vec2(
      dot(p, vec2(127.1, 311.7)),
      dot(p, vec2(269.5, 183.3))
    )) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    // Scale UV for larger cells
    vec2 st = gl_PointCoord * 6.0;
    vec2 i = floor(st);
    vec2 f = fract(st);
    // Voronoi: find nearest cell center
    float mDist = 1.0;
    vec2 mPoint = vec2(0.0);
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = random2(i + neighbor);
        point = 0.5 + 0.5 * sin(uTime * 0.3 + 6.28318 * point);
        vec2 diff = neighbor + point - f;
        float d = dot(diff, diff);
        if (d < mDist) {
          mDist = d;
          mPoint = point;
        }
      }
    }
    mDist = sqrt(mDist);
    // Cell boundary as thin glowing line
    float edge = smoothstep(0.0, 0.06, mDist) - smoothstep(0.06, 0.12, mDist);
    // Interior slow gradient
    float interior = (1.0 - smoothstep(0.0, 0.5, mDist)) * 0.3;
    // Organic pulse
    float pulse = 0.7 + 0.3 * sin(uTime * 2.0 + length(mPoint) * 10.0);
    // Circular fade at particle edge
    float fade = 1.0 - smoothstep(0.35, 0.5, dist);
    vec3 cellColor = vColor * (interior + 0.3) + vColor * edge * 1.5 * pulse;
    float alpha = max(edge * 0.9 * pulse, interior * 0.4) * vAlpha * fade;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(cellColor, alpha);
  }
`
  );
  var Up = (
    /* glsl */
    `
  uniform float uTime;
  uniform float uModeParam;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  // Recursive branching bolt via noise displacement
  float bolt(vec2 uv, float t) {
    float d = abs(uv.x);
    // Main branch with sinusoidal displacement
    float y = uv.y;
    float displace = 0.0;
    float amp = 1.0;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      displace += sin(y * freq * 10.0 + t * 15.0 + hash(float(i))) * amp * 0.04;
      amp *= 0.5;
      freq *= 2.0;
    }
    float boltX = displace;
    float boltDist = abs(uv.x - boltX);
    // White-hot core + colored glow
    float core = exp(-boltDist * 80.0);
    float glow = exp(-boltDist * 12.0) * 0.6;
    return core + glow;
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    // Rotate bolt direction based on life
    float angle = vLife * 3.14159 * 2.0 + uTime * 0.5;
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 ruv = rot * uv;
    // Random flash \u2014 bright bolt ~every 0.5s
    float flash = step(0.92, hash(vLife * 100.0 + floor(uTime * 2.0)));
    float intensity = bolt(ruv, uTime) * (0.4 + flash * 0.6);
    vec3 boltColor = mix(vec3(1.0, 0.98, 0.9), vColor, 0.5);
    float alpha = intensity * vAlpha * (1.0 - smoothstep(0.3, 0.5, dist));
    if (alpha < 0.005) discard;
    gl_FragColor = vec4(boltColor, alpha);
  }
`
  );
  var Np = (
    /* glsl */
    `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);
    float ripple = sin((dist * 34.0) - uTime * 3.2 + vLife * 9.0) * 0.5 + 0.5;
    float phase = sin(angle * 3.0 + uTime * 1.1 + vLife * 5.0) * 0.5 + 0.5;
    float droplet = smoothstep(0.48, 0.18, dist);
    float edge = smoothstep(0.47, 0.40, dist) - smoothstep(0.36, 0.30, dist);
    float vortex = exp(-abs(dist - (0.18 + phase * 0.08)) * 18.0) * 0.35;
    vec3 coldShift = vec3(0.45, 0.85, 1.0);
    vec3 superColor = mix(vColor * coldShift, vec3(0.9, 1.0, 1.0), ripple * 0.35);
    float alpha = (droplet * 0.34 + ripple * edge * 0.8 + vortex) * vAlpha;
    if (alpha < 0.008) discard;
    gl_FragColor = vec4(superColor, alpha);
  }
`
  );
  var Op = (
    /* glsl */
    `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);
    float sheath = exp(-dist * 4.0);
    float core = exp(-dist * 18.0);
    float arc = 0.0;
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float spoke = sin(angle * (3.0 + fi) + uTime * (3.0 + fi) + vLife * 18.0);
      float band = exp(-abs(spoke) * 16.0) * exp(-dist * (4.0 + fi * 0.7));
      arc += band * (0.5 + 0.5 * hash(fi + floor(uTime * 8.0) + vLife * 30.0));
    }
    float flash = step(0.86, hash(floor(uTime * 10.0) + vLife * 99.0));
    vec3 ionColor = mix(vColor, vec3(0.55, 0.95, 1.0), 0.35) + vec3(1.0, 0.25, 0.72) * flash * core;
    float alpha = (sheath * 0.25 + core * 0.85 + arc * 0.35) * vAlpha * (1.0 - smoothstep(0.42, 0.5, dist));
    if (alpha < 0.006) discard;
    gl_FragColor = vec4(ionColor, alpha);
  }
`
  );
  var Fp = (
    /* glsl */
    `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    vec2 st = gl_PointCoord * 5.0;
    vec2 cell = fract(st) - 0.5;
    float strandX = exp(-abs(cell.x) * 26.0);
    float strandY = exp(-abs(cell.y) * 26.0);
    float diagonal = exp(-abs(cell.x + cell.y + sin(uTime * 0.4 + vLife * 8.0) * 0.08) * 20.0);
    float node = exp(-length(cell) * 18.0);
    float poreFade = 1.0 - smoothstep(0.36, 0.5, dist);
    float lattice = (strandX + strandY + diagonal * 0.6 + node * 0.7) * poreFade;
    vec3 airColor = mix(vColor * vec3(0.78, 0.95, 1.12), vec3(1.0), node * 0.35);
    float alpha = lattice * 0.18 * vAlpha + node * 0.16 * vAlpha;
    if (alpha < 0.006) discard;
    gl_FragColor = vec4(airColor, alpha);
  }
`
  );
  var Bp = (
    /* glsl */
    `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vLife;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);
    float rings = sin(dist * 55.0 - uTime * 4.0 + vLife * 12.0) * 0.5 + 0.5;
    float grating = sin((uv.x + uv.y) * 34.0 + uTime * 1.5) * 0.5 + 0.5;
    float star = pow(abs(cos(angle * 6.0 + uTime * 0.6)), 14.0) * (1.0 - smoothstep(0.1, 0.5, dist));
    float lens = smoothstep(0.48, 0.12, dist);
    vec3 prism = vec3(
      0.55 + 0.45 * sin(dist * 22.0 + uTime),
      0.55 + 0.45 * sin(dist * 22.0 + uTime + 2.09),
      0.55 + 0.45 * sin(dist * 22.0 + uTime + 4.18)
    );
    vec3 photonColor = mix(vColor * 0.72, prism, 0.48) + vec3(0.75, 0.88, 1.0) * star * 0.32;
    float alpha = (rings * grating * 0.16 + star * 0.38 + lens * 0.08) * vAlpha * (1.0 - smoothstep(0.42, 0.5, dist));
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(photonColor, alpha);
  }
`
  );
  var Vt = {
    nebula: {
      label: "Nebula",
      icon: "\u{1F30C}",
      description: "Organic curl-noise particle cloud \u2014 the original default.",
      fragShader: Ap,
      postfx: null,
      palette: [
        [0.2, 0.4, 1],
        // deep blue
        [0.6, 0.2, 0.9],
        // violet
        [0.1, 0.7, 1],
        // cyan
        [0.8, 0.3, 0.9]
        // magenta
      ]
    },
    fluid: {
      label: "Fluid",
      icon: "\u{1F4A7}",
      description: "Iridescent soap-bubble blobs with surface tension.",
      fragShader: Rp,
      postfx: { bloomStrength: 0.5, grainIntensity: 8e-3 },
      palette: [
        [0.3, 0.9, 1],
        // aqua
        [0.9, 0.5, 0.8],
        // pink
        [0.5, 1, 0.6],
        // mint
        [1, 0.85, 0.4]
        // gold
      ]
    },
    crystalline: {
      label: "Crystalline",
      icon: "\u{1F48E}",
      description: "Faceted geometric shards with prismatic rainbow edges.",
      fragShader: Pp,
      postfx: { bloomStrength: 0.35, grainIntensity: 5e-3 },
      palette: [
        [0.85, 0.95, 1],
        // ice white
        [0.5, 0.8, 1],
        // sky blue
        [0.9, 0.9, 1],
        // silver
        [0.3, 0.6, 0.95]
        // sapphire
      ]
    },
    plasma: {
      label: "Plasma",
      icon: "\u26A1",
      description: "High-energy electric tendrils with fast flicker.",
      fragShader: Lp,
      postfx: { bloomStrength: 0.9, grainIntensity: 0.012 },
      palette: [
        [1, 0.4, 0],
        // orange
        [1, 0.1, 0.1],
        // red
        [1, 0.8, 0],
        // yellow
        [1, 0.6, 0.2]
        // amber
      ]
    },
    ferrofluid: {
      label: "Ferrofluid",
      icon: "\u{1F9F2}",
      description: "Spike-field surface ripples with metallic sheen.",
      fragShader: Ip,
      postfx: { bloomStrength: 0.45, grainIntensity: 0.01 },
      palette: [
        [0.7, 0.7, 0.75],
        // silver
        [0.3, 0.3, 0.35],
        // gunmetal
        [0.9, 0.9, 0.95],
        // bright silver
        [0.5, 0.5, 0.55]
        // steel
      ]
    },
    cellular: {
      label: "Cellular",
      icon: "\u{1FAE7}",
      description: "Voronoi cell membranes with organic pulsing.",
      fragShader: Dp,
      postfx: { bloomStrength: 0.3, grainIntensity: 6e-3 },
      palette: [
        [0.1, 0.9, 0.5],
        // bio green
        [0, 0.7, 0.6],
        // teal
        [0.2, 1, 0.4],
        // neon green
        [0, 0.5, 0.4]
        // deep teal
      ]
    },
    electric: {
      label: "Electric Arcs",
      icon: "\u{1F329}\uFE0F",
      description: "Branching lightning bolts with white-hot cores.",
      fragShader: Up,
      postfx: { bloomStrength: 0.7, grainIntensity: 0.015 },
      palette: [
        [0.8, 0.95, 1],
        // white-cyan
        [0, 0.8, 1],
        // electric blue
        [0.9, 0.9, 1],
        // white
        [0.2, 0.5, 1]
        // blue
      ]
    },
    superfluid: {
      label: "Superfluid",
      icon: "S",
      description: "Frictionless liquid waves with quantized ripple rings.",
      fragShader: Np,
      postfx: { bloomStrength: 0.52, grainIntensity: 5e-3 },
      palette: [
        [0.38, 0.86, 1],
        [0.72, 0.95, 1],
        [0.48, 0.6, 1],
        [0.92, 1, 0.98]
      ]
    },
    ionstorm: {
      label: "Ion Storm",
      icon: "I",
      description: "Charged ion cores with flickering plasma sheaths.",
      fragShader: Op,
      postfx: { bloomStrength: 0.74, grainIntensity: 0.014 },
      palette: [
        [1, 0.28, 0.56],
        [0.36, 0.92, 1],
        [1, 0.72, 0.22],
        [0.72, 0.38, 1]
      ]
    },
    aerogel: {
      label: "Aerogel",
      icon: "A",
      description: "Ultra-light porous lattice filaments suspended in air.",
      fragShader: Fp,
      postfx: { bloomStrength: 0.38, grainIntensity: 4e-3 },
      palette: [
        [0.74, 0.94, 1],
        [0.92, 0.98, 1],
        [0.68, 1, 0.86],
        [0.78, 0.72, 1]
      ]
    },
    photonic: {
      label: "Photonic",
      icon: "P",
      description: "Diffracted light matter with interference bands and star lenses.",
      fragShader: Bp,
      postfx: { bloomStrength: 0.42, grainIntensity: 6e-3 },
      palette: [
        [0.55, 0.95, 1],
        [1, 0.46, 0.78],
        [0.82, 0.74, 1],
        [1, 0.92, 0.42]
      ]
    }
  };
  var Hp = "nebula";
  var oi = class {
    constructor(e = {}) {
      this.count = e.count || 12e3;
      this.spread = e.spread || 25;
      this.mesh = null;
      this.material = null;
      this._currentMode = e.mode || Hp;
      this._engine = null;
    }
    /** Build the shared particle geometry and initial material. */
    init(e) {
      this._engine = e;
      const t = new Be();
      const i = new Float32Array(this.count * 3);
      t.setAttribute("position", new ke(i, 3));
      const n = new Float32Array(this.count * 3);
      const s = new Float32Array(this.count * 3);
      const a = new Float32Array(this.count);
      const o = new Float32Array(this.count);
      const l = new Float32Array(this.count * 3);
      const c = Vt[this._currentMode]?.palette;
      const h = e.theme?.particleColors || c || [
        [0.345, 0.651, 1],
        // cyan
        [0.737, 0.549, 1],
        // purple
        [0.247, 0.725, 0.314],
        // green
        [1, 0.596, 0],
        // orange
        [1, 0.2, 0.2],
        // red
        [1, 1, 1]
        // white
      ];
      for (let u = 0; u < this.count; u++) {
        const d = u * 3;
        const p = Math.random() * Math.PI * 2;
        const f = Math.acos(2 * Math.random() - 1);
        const v = Math.pow(Math.random(), 0.5) * this.spread;
        n[d] = v * Math.sin(f) * Math.cos(p);
        n[d + 1] = v * Math.sin(f) * Math.sin(p);
        n[d + 2] = v * Math.cos(f);
        s[d] = (Math.random() - 0.5) * 0.1;
        s[d + 1] = (Math.random() - 0.5) * 0.1;
        s[d + 2] = (Math.random() - 0.5) * 0.1;
        a[u] = Math.random();
        o[u] = 2 + Math.random() * 8;
        const m = h[Math.floor(Math.random() * h.length)];
        l[d] = m[0];
        l[d + 1] = m[1];
        l[d + 2] = m[2];
      }
      t.setAttribute("aOffset", new ke(n, 3));
      t.setAttribute("aVelocity", new ke(s, 3));
      t.setAttribute("aLife", new ke(a, 1));
      t.setAttribute("aSize", new ke(o, 1));
      t.setAttribute("aColor", new ke(l, 3));
      this._buildMaterial(this._currentMode);
      this.mesh = new Mi(t, this.material);
      this.mesh.frustumCulled = false;
      e.scene.add(this.mesh);
      try {
        const u = localStorage.getItem("chimera-matter-mode");
        if (u && Vt[u]) {
          this.setMatterMode(u);
        }
      } catch (u) {
      }
    }
    /** Create (or rebuild) the ShaderMaterial for the given mode. */
    _buildMaterial(e) {
      const t = Vt[e];
      if (!t) {
        console.warn("ShapableMatter: unknown mode", e);
        return;
      }
      if (this.material) this.material.dispose();
      this.material = new Ee({
        vertexShader: Cp,
        fragmentShader: t.fragShader,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0.8 },
          uMouse: { value: new X() },
          uModeParam: { value: 0.5 }
        },
        transparent: true,
        depthWrite: false,
        blending: Ve
      });
      if (this.mesh) {
        this.mesh.material = this.material;
      }
      if (t.postfx && this._engine) {
        const i = t.postfx;
        const n = this._engine._targetState || {};
        if (i.bloomStrength != null) {
          this._engine.bloomPass.strength = i.bloomStrength;
          if (n.bloomStrength != null) n.bloomStrength = i.bloomStrength;
        }
        if (i.grainIntensity != null) {
          this._engine.grainPass.uniforms.uIntensity.value = i.grainIntensity;
          if (n.grainIntensity != null) n.grainIntensity = i.grainIntensity;
        }
      }
    }
    /** Re-color particles from a palette (used on mode or theme change). */
    _recolorParticles(e) {
      if (!this.mesh || !e || !e.length) return;
      const t = this.mesh.geometry.attributes.aColor.array;
      for (let i = 0; i < this.count; i++) {
        const n = e[Math.floor(Math.random() * e.length)];
        t[i * 3] = n[0];
        t[i * 3 + 1] = n[1];
        t[i * 3 + 2] = n[2];
      }
      this.mesh.geometry.attributes.aColor.needsUpdate = true;
    }
    /** Switch to a different matter mode instantly. */
    setMatterMode(e) {
      if (!Vt[e]) {
        console.warn("ShapableMatter: unknown mode", e, "\u2014 valid:", Object.keys(Vt));
        return;
      }
      if (e === this._currentMode) {
        console.log("[ShapableMatter] mode already", e, "\u2014 skipping");
        return;
      }
      this._currentMode = e;
      this._buildMaterial(e);
      const t = Vt[e]?.palette;
      if (t) this._recolorParticles(t);
      console.log("[ShapableMatter] mode + colors updated:", e);
      try {
        localStorage.setItem("chimera-matter-mode", e);
      } catch (i) {
      }
    }
    /** Return the currently active mode name. */
    getMatterMode() {
      return this._currentMode;
    }
    /** List all registered mode names. */
    static getModes() {
      return Object.keys(Vt);
    }
    /** Get metadata for a mode. */
    static getModeInfo(e) {
      return Vt[e] || null;
    }
    /** Per-frame update from the engine render loop. */
    update(e, t) {
      if (!this.material) return;
      this.material.uniforms.uTime.value = e.elapsed;
      this.material.uniforms.uIntensity.value = e.intensity;
      this.material.uniforms.uMouse.value.copy(e.mouseNDC);
    }
    onStateChange(e, t) {
    }
    onPulse(e, t, i) {
    }
    onThemeChange(e, t) {
      if (e?.particleColors) {
        this._recolorParticles(e.particleColors);
      }
    }
    dispose(e) {
      if (this.mesh) {
        e.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
      }
      if (this.material) this.material.dispose();
    }
  };
  if (typeof window !== "undefined") {
    window.ChimeraFX = window.ChimeraFX || {};
    window.ChimeraFX.ShapableMatter = oi;
    window.ChimeraFX.MATTER_MODES = Vt;
    window.ChimeraFX.setMatterMode = function(r) {
      const e = window._chimeraFX;
      if (!e) return;
      const t = e.components.find((i) => i instanceof oi);
      if (t) {
        t.setMatterMode(r);
      }
    };
    window.ChimeraFX.getMatterMode = function() {
      const r = window._chimeraFX;
      if (!r) return null;
      const e = r.components.find((t) => t instanceof oi);
      return e ? e.getMatterMode() : null;
    };
    window.ChimeraFX.getMatterModes = function() {
      return Object.keys(Vt);
    };
    window.ChimeraFX.getMatterModeInfo = function(r) {
      return Vt[r] || null;
    };
  }

  // assets/familiar/chimera-fx/core/AmbientColors.js
  var Xh = {
    ranging: {
      cool: { h: 210, s: 75, l: 55 },
      // blue-grey neutral
      warm: { h: 30, s: 60, l: 60 },
      // amber neutral
      accent: { h: 160, s: 80, l: 50 }
      // teal
    },
    trending: {
      cool: { h: 140, s: 90, l: 48 },
      // green momentum
      warm: { h: 280, s: 70, l: 55 },
      // purple breakout
      accent: { h: 200, s: 85, l: 52 }
      // cyan
    },
    volatile: {
      cool: { h: 0, s: 90, l: 55 },
      // red danger
      warm: { h: 45, s: 100, l: 50 },
      // orange warning
      accent: { h: 320, s: 80, l: 55 }
      // magenta
    },
    calm: {
      cool: { h: 220, s: 50, l: 60 },
      // muted blue
      warm: { h: 35, s: 45, l: 62 },
      // soft gold
      accent: { h: 170, s: 65, l: 50 }
      // soft teal
    }
  };
  var zp = Xh.ranging;
  function nl(r, e, t) {
    return r + (e - r) * t;
  }
  function rl(r, e, t) {
    return {
      h: Math.round(nl(r.h, e.h, t)),
      s: Math.round(nl(r.s, e.s, t)),
      l: Math.round(nl(r.l, e.l, t))
    };
  }
  var js = class {
    /**
     * @param {number} factor — influence strength 0.0–1.0 (default 0.45)
     * @param {object} overrides — optionally pre-set signals
     */
    constructor(e = 0.45, t = {}) {
      this.factor = Math.min(1, Math.max(0, e));
      this._signals = {
        regime: "ranging",
        // ranging | trending | volatile | calm
        momentum: 0.5,
        // 0.0–1.0
        fearGreed: 50,
        // 0–100
        volatility: 0.3,
        // 0.0–1.0
        ...t
      };
      this._lastPalette = null;
      this._styleElement = null;
      this._enabled = true;
      this._cssVarsApplied = false;
    }
    /** Update with fresh market signal data. Call each time a new signal arrives. */
    update(e = {}) {
      this._signals = { ...this._signals, ...e };
      this._apply();
    }
    /** Enable or disable ambient color influence. */
    setEnabled(e) {
      this._enabled = !!e;
      if (!e) this._revert();
      else this._apply();
    }
    /** Set the influence factor. */
    setFactor(e) {
      this.factor = Math.min(1, Math.max(0, e));
      this._apply();
    }
    /** Read the current influence factor. */
    getFactor() {
      return this.factor;
    }
    /** Return the live signal object. */
    getSignals() {
      return { ...this._signals };
    }
    // ── Internal ─────────────────────────────────────────────────────────────
    _getPalette() {
      const e = this._signals.regime || "ranging";
      return Xh[e] || zp;
    }
    _getSignalStrength() {
      const e = this._signals.momentum ?? 0.5;
      const t = (this._signals.fearGreed ?? 50) / 100;
      const i = this._signals.volatility ?? 0.3;
      const n = this._signals.regime === "volatile" ? 1.2 : 1;
      return Math.min(1, (e + t + i) / 3 * n);
    }
    _buildCssVars(e, t, i) {
      return `
      html[data-ambient-colors="on"] {
        --ambient-primary-h: ${e.h};
        --ambient-primary-s: ${e.s}%;
        --ambient-primary-l: ${e.l}%;
        --ambient-secondary-h: ${t.h};
        --ambient-secondary-s: ${t.s}%;
        --ambient-secondary-l: ${t.l}%;
        --ambient-accent-h: ${i.h};
        --ambient-accent-s: ${i.s}%;
        --ambient-accent-l: ${i.l}%;
        --primary-h: ${e.h};
        --primary-s: ${e.s}%;
        --primary-l: ${e.l}%;
        --secondary-h: ${t.h};
        --secondary-s: ${t.s}%;
        --secondary-l: ${t.l}%;
      }
    `;
    }
    _apply() {
      if (!this._enabled) return;
      document.documentElement.dataset.ambientColors = "on";
      const e = this._getPalette();
      const t = this._getSignalStrength();
      const i = this.factor * t;
      const n = this._readCurrentHSL();
      const s = rl(n.primary, e.cool, i);
      const a = rl(n.secondary, e.warm, i);
      const o = rl(n.accent, e.accent, i);
      this._injectCss(this._buildCssVars(s, a, o));
      this._syncChimeraVfx(s, o);
      this._lastPalette = { primary: s, secondary: a, accent: o, signalT: t, blend: i };
    }
    _readCurrentHSL() {
      const e = document.documentElement;
      const t = (i, n, s) => ({
        h: parseInt(getComputedStyle(e).getPropertyValue(`--${i}`) || "0"),
        s: parseInt(getComputedStyle(e).getPropertyValue(`--${n}`) || "50"),
        l: parseInt(getComputedStyle(e).getPropertyValue(`--${s}`) || "50")
      });
      return {
        primary: { h: 168, s: 100, l: 45 },
        secondary: { h: 210, s: 80, l: 56 },
        accent: { h: 160, s: 80, l: 50 }
      };
    }
    _injectCss(e) {
      if (!this._styleElement) {
        this._styleElement = document.createElement("style");
        this._styleElement.id = "chimera-ambient-colors";
        document.head.appendChild(this._styleElement);
      }
      this._styleElement.textContent = e;
      this._cssVarsApplied = true;
    }
    _revert() {
      delete document.documentElement.dataset.ambientColors;
      if (this._styleElement) {
        this._styleElement.textContent = "";
      }
      this._cssVarsApplied = false;
    }
    /** Notify the legacy VFX layer after CSS-driven ambient colors change. */
    _syncChimeraVfx(e, t) {
      try {
        if (window.ChimeraVFX?.resolveColors) {
          window.ChimeraVFX.resolveColors();
        }
      } catch (i) {
      }
    }
    /** Export current state as a JSON-serializable object. */
    toJSON() {
      return {
        factor: this.factor,
        enabled: this._enabled,
        signals: this.getSignals()
      };
    }
    /** Restore state from a JSON object (e.g. after page load). */
    fromJSON(e) {
      if (e.factor !== void 0) this.factor = e.factor;
      if (e.enabled !== void 0) this._enabled = e.enabled;
      if (e.signals) this._signals = { ...this._signals, ...e.signals };
    }
    dispose() {
      this._revert();
      if (this._styleElement) {
        this._styleElement.remove();
        this._styleElement = null;
      }
    }
  };
  if (typeof window !== "undefined") {
    window.ChimeraFX = window.ChimeraFX || {};
    window.ChimeraFX.initAmbientColors = function(r = 0.45) {
      if (window._chimeraAmbient) {
        window._chimeraAmbient.dispose();
      }
      window._chimeraAmbient = new js(r);
      try {
        const e = localStorage.getItem("chimera-ambient-state");
        if (e) {
          const t = JSON.parse(e);
          window._chimeraAmbient.fromJSON(t);
          if (window._chimeraAmbient._enabled) {
            window._chimeraAmbient._apply();
          }
        }
      } catch (e) {
      }
      return window._chimeraAmbient;
    };
    window.ChimeraFX.getAmbientColors = function() {
      return window._chimeraAmbient || null;
    };
    window.ChimeraFX.updateAmbient = function(r) {
      if (window._chimeraAmbient) {
        window._chimeraAmbient.update(r);
        try {
          localStorage.setItem("chimera-ambient-state", JSON.stringify(window._chimeraAmbient.toJSON()));
        } catch (e) {
        }
      }
    };
    window.ChimeraFX.setAmbientFactor = function(r) {
      if (window._chimeraAmbient) window._chimeraAmbient.setFactor(r);
    };
    window.ChimeraFX.setAmbientEnabled = function(r) {
      if (window._chimeraAmbient) window._chimeraAmbient.setEnabled(r);
    };
  }

  // assets/familiar/chimera-fx/components/ParticleNebula.js
  var kp = (
    /* glsl */
    `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uMouse;
  uniform float uDelta;

  attribute vec3 aOffset;
  attribute vec3 aVelocity;
  attribute float aLife;
  attribute float aSize;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  // \u2500\u2500 Curl noise (3D) \u2500\u2500
  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }

  float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(mix(dot(hash3(i), f),
                       dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                   mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
                       dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
               mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
                       dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                   mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
                       dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
  }

  vec3 curlNoise(vec3 p) {
    float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);

    float x = noise3D(p + dy) - noise3D(p - dy)
            - noise3D(p + dz) + noise3D(p - dz);
    float y = noise3D(p + dz) - noise3D(p - dz)
            - noise3D(p + dx) + noise3D(p - dx);
    float z = noise3D(p + dx) - noise3D(p - dx)
            - noise3D(p + dy) + noise3D(p - dy);

    return normalize(vec3(x, y, z)) / (2.0 * e);
  }

  void main() {
    // Curl noise flow
    float speed = 0.15 + uIntensity * 0.3;
    vec3 pos = aOffset;
    pos += curlNoise(pos * 0.08 + uTime * speed * 0.1) * uTime * speed * 0.5;

    // Orbit around center
    float angle = uTime * 0.05 * (1.0 + uIntensity);
    mat3 rot = mat3(
      cos(angle), 0.0, sin(angle),
      0.0, 1.0, 0.0,
      -sin(angle), 0.0, cos(angle)
    );
    pos = rot * pos;

    // Mouse influence
    vec3 mouseWorld = vec3(uMouse * 15.0, 0.0);
    vec3 toMouse = mouseWorld - pos;
    float mouseDist = length(toMouse);
    pos += normalize(toMouse) * (2.0 / max(mouseDist, 1.0)) * uIntensity;

    // Fade based on life
    float life = fract(aLife + uTime * 0.02);
    vAlpha = sin(life * 3.14159) * (0.1 + uIntensity * 0.2);
    vColor = aColor * (0.5 + uIntensity * 0.5);

    // Size pulses
    float size = aSize * (1.0 + sin(uTime * 2.0 + aLife * 20.0) * 0.3 * uIntensity);

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (300.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`
  );
  var Vp = (
    /* glsl */
    `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Soft circle with glow halo
    float dist = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.1, dist);
    float halo = smoothstep(0.5, 0.0, dist) * 0.3;
    float alpha = (core + halo) * vAlpha;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`
  );
  var Dn = class {
    constructor(e = {}) {
      this.count = e.count || 8e3;
      this.spread = e.spread || 40;
      this.mesh = null;
      this.material = null;
    }
    init(e) {
      const t = new Be();
      const i = new Float32Array(3);
      t.setAttribute("position", new ke(i, 3));
      const n = new Float32Array(this.count * 3);
      const s = new Float32Array(this.count * 3);
      const a = new Float32Array(this.count);
      const o = new Float32Array(this.count);
      const l = new Float32Array(this.count * 3);
      const c = e.theme?.particleColors || [
        [0.345, 0.651, 1],
        // cyan
        [0.737, 0.549, 1],
        // purple
        [0.247, 0.725, 0.314],
        // green
        [1, 0.596, 0]
        // orange
      ];
      for (let h = 0; h < this.count; h++) {
        const u = h * 3;
        const d = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        const f = Math.pow(Math.random(), 0.5) * this.spread;
        n[u] = f * Math.sin(p) * Math.cos(d);
        n[u + 1] = f * Math.sin(p) * Math.sin(d);
        n[u + 2] = f * Math.cos(p);
        s[u] = (Math.random() - 0.5) * 0.1;
        s[u + 1] = (Math.random() - 0.5) * 0.1;
        s[u + 2] = (Math.random() - 0.5) * 0.1;
        a[h] = Math.random();
        o[h] = 0.5 + Math.random() * 2;
        const v = c[Math.floor(Math.random() * c.length)];
        l[u] = v[0];
        l[u + 1] = v[1];
        l[u + 2] = v[2];
      }
      t.setAttribute("aOffset", new Yt(n, 3));
      t.setAttribute("aVelocity", new Yt(s, 3));
      t.setAttribute("aLife", new Yt(a, 1));
      t.setAttribute("aSize", new Yt(o, 1));
      t.setAttribute("aColor", new Yt(l, 3));
      this.material = new Ee({
        vertexShader: kp,
        fragmentShader: Vp,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0.3 },
          uMouse: { value: new X() },
          uDelta: { value: 0.016 }
        },
        transparent: true,
        depthWrite: false,
        blending: Ve
      });
      this.mesh = new Ts(
        new Ze(0.01, 0.01),
        // dummy
        this.material,
        this.count
      );
      this.mesh = new Mi(t, this.material);
      this.mesh.frustumCulled = false;
      e.scene.add(this.mesh);
    }
    update(e, t) {
      if (!this.material) return;
      this.material.uniforms.uTime.value = e.elapsed;
      this.material.uniforms.uIntensity.value = e.intensity;
      this.material.uniforms.uMouse.value.copy(e.mouseNDC);
      this.material.uniforms.uDelta.value = e.dt;
    }
    onStateChange(e, t) {
    }
    onPulse(e, t, i) {
    }
    onThemeChange(e, t) {
      if (!this.mesh || !e?.particleColors) return;
      const i = this.mesh.geometry.getAttribute("aColor");
      if (!i) return;
      const n = e.particleColors;
      const s = i.count;
      for (let a = 0; a < s; a++) {
        const o = n[Math.floor(Math.random() * n.length)];
        i.setXYZ(a, o[0], o[1], o[2]);
      }
      i.needsUpdate = true;
    }
    dispose(e) {
      if (this.mesh) {
        e.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.material.dispose();
      }
    }
  };

  // assets/familiar/chimera-fx/components/EnergyTendrils.js
  var Gp = (
    /* glsl */
    `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uBaseY;

  attribute float aProgress;   // 0..1 along tendril
  attribute float aSeed;       // unique per-tendril
  attribute float aBranch;     // branch index

  varying float vProgress;
  varying float vIntensity;

  // Hash functions
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash2(i), f),
                   dot(hash2(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
               mix(dot(hash2(i + vec2(0, 1)), f - vec2(0, 1)),
                   dot(hash2(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float t = uTime;
    float seed = aSeed;
    float prog = aProgress;

    // Base path: curve from bottom to top
    float x = position.x;
    float y = position.y;

    // Apply fbm displacement \u2014 increases with progress (wilder at tips)
    float displace = fbm(vec2(prog * 3.0 + seed * 10.0, t * (0.5 + uIntensity))) * prog;
    x += displace * 8.0;

    // Secondary jitter \u2014 high frequency for lightning crackle
    float jitter = noise(vec2(prog * 20.0, t * 5.0 + seed * 100.0)) * prog * 2.0 * uIntensity;
    x += jitter;

    // Vertical stretch based on intensity
    y *= 1.0 + uIntensity * 0.3;

    // Branch offset
    x += aBranch * 0.5 * prog;

    vProgress = prog;
    vIntensity = uIntensity;

    vec4 mvPos = modelViewMatrix * vec4(x, y, position.z, 1.0);
    gl_Position = projectionMatrix * mvPos;
  }
`
  );
  var Wp = (
    /* glsl */
    `
  varying float vProgress;
  varying float vIntensity;
  uniform vec3 uColor;
  uniform float uTime;

  void main() {
    // Core brightness at base, fading at tips
    float alpha = (1.0 - vProgress) * (0.15 + vIntensity * 0.25);

    // Flickering
    float flicker = 0.8 + 0.2 * sin(uTime * 15.0 + vProgress * 50.0);
    alpha *= flicker;

    // Color shifts from base color to white at core
    vec3 col = mix(uColor, vec3(1.0), vProgress * 0.3 * vIntensity);

    gl_FragColor = vec4(col, alpha);
  }
`
  );
  var Un = class {
    constructor(e = {}) {
      this.tendrilCount = e.count || 6;
      this.segmentsPerTendril = e.segments || 48;
      this.height = e.height || 18;
      this.meshes = [];
    }
    init(e) {
      const t = e.theme?.tendrilColors || [
        new x(5809919),
        new x(12356863),
        new x(4176208)
      ];
      for (let i = 0; i < this.tendrilCount; i++) {
        const n = new Be();
        const s = [];
        const a = [];
        const o = [];
        const l = [];
        const c = Math.random() * 100;
        const h = (Math.random() - 0.5) * 30;
        const u = 1 + Math.floor(Math.random() * 3);
        for (let v = 0; v < u; v++) {
          for (let m = 0; m <= this.segmentsPerTendril; m++) {
            const y = m / this.segmentsPerTendril;
            s.push(h, -15 + y * this.height, (Math.random() - 0.5) * 2);
            a.push(y);
            o.push(c);
            l.push(v - u / 2);
          }
        }
        n.setAttribute("position", new ye(s, 3));
        n.setAttribute("aProgress", new ye(a, 1));
        n.setAttribute("aSeed", new ye(o, 1));
        n.setAttribute("aBranch", new ye(l, 1));
        const d = t[i % t.length];
        const p = new Ee({
          vertexShader: Gp,
          fragmentShader: Wp,
          uniforms: {
            uTime: { value: 0 },
            uIntensity: { value: 0.3 },
            uBaseY: { value: -15 },
            uColor: { value: d }
          },
          transparent: true,
          depthWrite: false,
          blending: Ve
        });
        const f = new ws(n, p);
        f.frustumCulled = false;
        e.scene.add(f);
        this.meshes.push({ line: f, mat: p, geo: n });
      }
    }
    update(e, t) {
      this.meshes.forEach(({ mat: i }) => {
        i.uniforms.uTime.value = e.elapsed;
        i.uniforms.uIntensity.value = e.intensity;
      });
    }
    onPulse(e, t, i) {
    }
    onThemeChange(e, t) {
      if (!e?.tendrilColors) return;
      const i = e.tendrilColors;
      this.meshes.forEach(({ mat: n }, s) => {
        const a = i[s % i.length];
        if (a instanceof x) {
          n.uniforms.uColor.value.copy(a);
        } else if (Array.isArray(a) && a.length === 3) {
          n.uniforms.uColor.value.setRGB(a[0], a[1], a[2]);
        }
      });
    }
    dispose(e) {
      this.meshes.forEach(({ line: t, mat: i, geo: n }) => {
        e.scene.remove(t);
        n.dispose();
        i.dispose();
      });
      this.meshes = [];
    }
  };

  // assets/familiar/chimera-fx/components/DataRivers.js
  var Xp = (
    /* glsl */
    `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uFlowSpeed;
  uniform vec3 uCurveStart;
  uniform vec3 uCurveEnd;
  uniform vec3 uCurveControl;

  attribute float aPhase;     // 0..1 position along river
  attribute float aLane;      // offset from center
  attribute float aSpeed;     // individual speed variation
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  // Quadratic Bezier
  vec3 bezier(vec3 a, vec3 b, vec3 c, float t) {
    float t1 = 1.0 - t;
    return t1 * t1 * a + 2.0 * t1 * t * b + t * t * c;
  }

  vec3 bezierDerivative(vec3 a, vec3 b, vec3 c, float t) {
    return 2.0 * (1.0 - t) * (b - a) + 2.0 * t * (c - b);
  }

  void main() {
    float speed = uFlowSpeed * (0.8 + aSpeed * 0.4);
    float phase = fract(aPhase + uTime * speed * 0.1);

    // Position on curve
    vec3 pos = bezier(uCurveStart, uCurveControl, uCurveEnd, phase);

    // Normal offset for lane spacing
    vec3 tangent = normalize(bezierDerivative(uCurveStart, uCurveControl, uCurveEnd, phase));
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 normal = normalize(cross(tangent, up));
    pos += normal * aLane * 0.3;

    // Pulse effect \u2014 particles bunch up and spread
    float pulse = sin(phase * 6.28318 + uTime * 3.0) * 0.2 * uIntensity;
    pos += tangent * pulse;

    // Fade at endpoints
    float edgeFade = smoothstep(0.0, 0.1, phase) * smoothstep(1.0, 0.9, phase);
    vAlpha = edgeFade * (0.3 + uIntensity * 0.7);
    vColor = aColor * (0.6 + uIntensity * 0.4);

    // Size based on intensity
    float size = 2.0 + uIntensity * 3.0;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (200.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`
  );
  var jp = (
    /* glsl */
    `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
    if (alpha < 0.01) discard;

    // Bright core + soft halo
    float core = smoothstep(0.3, 0.0, dist);
    vec3 col = mix(vColor, vec3(1.0), core * 0.5);

    gl_FragColor = vec4(col, alpha);
  }
`
  );
  var Nn = class {
    constructor(e = {}) {
      this.riverCount = e.rivers || 4;
      this.particlesPerRiver = e.particles || 300;
      this.rivers = [];
    }
    init(e) {
      const t = e.theme?.riverColors || [
        [0.345, 0.651, 1],
        [0.737, 0.549, 1],
        [0.247, 0.725, 0.314]
      ];
      for (let i = 0; i < this.riverCount; i++) {
        const n = new Be();
        const s = new Float32Array(this.particlesPerRiver * 3);
        const a = new Float32Array(this.particlesPerRiver);
        const o = new Float32Array(this.particlesPerRiver);
        const l = new Float32Array(this.particlesPerRiver);
        const c = new Float32Array(this.particlesPerRiver * 3);
        const h = t[i % t.length];
        for (let _ = 0; _ < this.particlesPerRiver; _++) {
          s[_ * 3] = 0;
          s[_ * 3 + 1] = 0;
          s[_ * 3 + 2] = 0;
          a[_] = Math.random();
          o[_] = (Math.random() - 0.5) * 4;
          l[_] = Math.random();
          c[_ * 3] = h[0] + (Math.random() - 0.5) * 0.1;
          c[_ * 3 + 1] = h[1] + (Math.random() - 0.5) * 0.1;
          c[_ * 3 + 2] = h[2] + (Math.random() - 0.5) * 0.1;
        }
        n.setAttribute("position", new ke(s, 3));
        n.setAttribute("aPhase", new ke(a, 1));
        n.setAttribute("aLane", new ke(o, 1));
        n.setAttribute("aSpeed", new ke(l, 1));
        n.setAttribute("aColor", new ke(c, 3));
        const u = i / this.riverCount * Math.PI * 2;
        const d = 20 + Math.random() * 10;
        const p = new E(
          Math.cos(u) * d,
          -10 + Math.random() * 5,
          -5 + Math.random() * 10
        );
        const f = new E(
          Math.cos(u + Math.PI * 0.3) * d * 0.3,
          5 + Math.random() * 10,
          -5 + Math.random() * 10
        );
        const v = new E(
          (p.x + f.x) * 0.5 + (Math.random() - 0.5) * 15,
          (p.y + f.y) * 0.5 + Math.random() * 10,
          (p.z + f.z) * 0.5
        );
        const m = new Ee({
          vertexShader: Xp,
          fragmentShader: jp,
          uniforms: {
            uTime: { value: 0 },
            uIntensity: { value: 0.3 },
            uFlowSpeed: { value: 1 },
            uCurveStart: { value: p },
            uCurveEnd: { value: f },
            uCurveControl: { value: v }
          },
          transparent: true,
          depthWrite: false,
          blending: Ve
        });
        const y = new Mi(n, m);
        y.frustumCulled = false;
        e.scene.add(y);
        this.rivers.push({ points: y, mat: m, geo: n });
      }
    }
    update(e, t) {
      const i = e.state === "streaming" || e.state === "thinking";
      const n = i ? 2.5 : 0.5;
      this.rivers.forEach(({ mat: s }) => {
        s.uniforms.uTime.value = e.elapsed;
        s.uniforms.uIntensity.value = e.intensity;
        const a = s.uniforms.uFlowSpeed.value;
        s.uniforms.uFlowSpeed.value += (n - a) * 0.05;
      });
    }
    onThemeChange(e, t) {
      if (!e?.riverColors) return;
      const i = e.riverColors;
      this.rivers.forEach(({ mat: n, geo: s }, a) => {
        const o = i[a % i.length];
        const l = s.getAttribute("aColor");
        if (!l) return;
        const c = l.count;
        for (let h = 0; h < c; h++) {
          l.setXYZ(
            h,
            o[0] + (Math.random() - 0.5) * 0.1,
            o[1] + (Math.random() - 0.5) * 0.1,
            o[2] + (Math.random() - 0.5) * 0.1
          );
        }
        l.needsUpdate = true;
      });
    }
    dispose(e) {
      this.rivers.forEach(({ points: t, mat: i, geo: n }) => {
        e.scene.remove(t);
        n.dispose();
        i.dispose();
      });
      this.rivers = [];
    }
  };

  // assets/familiar/chimera-fx/components/VolumetricLight.js
  var qp = (
    /* glsl */
    `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;
  uniform vec2 uLightPos;     // NDC coordinates of light source
  uniform vec3 uLightColor;
  uniform float uDecay;
  uniform float uDensity;
  uniform float uWeight;
  uniform int uSamples;
  uniform sampler2D tScene;   // scene render target

  varying vec2 vUv;

  // Simple noise for density variation
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }

  void main() {
    vec2 texCoord = vUv;
    vec2 lightPos = uLightPos * 0.5 + 0.5; // NDC to UV
    vec2 deltaTexCoord = (texCoord - lightPos);
    deltaTexCoord *= 1.0 / float(uSamples) * uDensity;

    float illuminationDecay = 1.0;
    vec3 accumColor = vec3(0.0);

    vec2 sampleCoord = texCoord;

    for (int i = 0; i < 64; i++) {
      if (i >= uSamples) break;
      sampleCoord -= deltaTexCoord;

      // Sample scene \u2014 use noise to vary density
      float density = noise(sampleCoord * 10.0 + uTime * 0.3) * 0.5 + 0.5;

      // Distance falloff from light source
      float dist = length(sampleCoord - lightPos);
      float falloff = max(0.0, 1.0 - dist * 1.5);
      falloff *= falloff;

      // Accumulate light
      vec3 lightSample = uLightColor * falloff * density * uWeight * uIntensity;
      lightSample *= illuminationDecay;
      accumColor += lightSample;

      illuminationDecay *= uDecay;
    }

    // Radial gradient \u2014 stronger near light source
    float radialFade = 1.0 - smoothstep(0.0, 1.0, length(texCoord - lightPos));

    // Subtle pulsing
    float pulse = 0.9 + 0.1 * sin(uTime * 0.5);

    gl_FragColor = vec4(accumColor * radialFade * pulse * 0.12, 1.0);
  }
`
  );
  var Yp = (
    /* glsl */
    `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
  );
  var On = class {
    constructor(e = {}) {
      this.lightColor = e.color || new x(5809919);
      this.samples = e.samples || 48;
      this.density = e.density || 0.8;
      this.decay = e.decay || 0.96;
      this.weight = e.weight || 0.4;
      this.mesh = null;
      this.mat = null;
    }
    init(e) {
      const t = new Ze(2, 2);
      this.mat = new Ee({
        vertexShader: Yp,
        fragmentShader: qp,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0.3 },
          uResolution: { value: new X(
            e.renderer.domElement.width,
            e.renderer.domElement.height
          ) },
          uLightPos: { value: new X(0, -0.8) },
          // bottom center
          uLightColor: { value: this.lightColor },
          uDecay: { value: this.decay },
          uDensity: { value: this.density },
          uWeight: { value: this.weight },
          uSamples: { value: this.samples },
          tScene: { value: null }
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: Ve
      });
      this.mesh = new De(t, this.mat);
      this.mesh.frustumCulled = false;
      this.mesh.renderOrder = 999;
      this.mesh.position.z = e.camera.position.z - 1;
      e.scene.add(this.mesh);
    }
    update(e, t) {
      if (!this.mat) return;
      this.mat.uniforms.uTime.value = e.elapsed;
      this.mat.uniforms.uIntensity.value = e.intensity;
      const i = 0.3;
      const n = e.mouseNDC.x * i;
      const s = -0.6 + e.mouseNDC.y * i * 0.5;
      this.mat.uniforms.uLightPos.value.set(n, s);
      this.mesh.position.copy(t.camera.position);
      this.mesh.position.z -= 1;
      this.mesh.lookAt(t.camera.position);
    }
    onResize(e, t, i) {
      if (this.mat) {
        this.mat.uniforms.uResolution.value.set(e, t);
      }
    }
    dispose(e) {
      if (this.mesh) {
        e.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mat.dispose();
      }
    }
  };

  // assets/familiar/chimera-fx/components/LiquidMetal.js
  var Zp = (
    /* glsl */
    `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  varying vec2 vUv;

  // \u2500\u2500 SDF Primitives \u2500\u2500
  float sdSphere(vec3 p, float r) { return length(p) - r; }

  // Smooth minimum for organic blending
  float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * h * k * (1.0 / 6.0);
  }

  // \u2500\u2500 Scene SDF \u2500\u2500
  float scene(vec3 p) {
    float t = uTime * 0.5;
    float pulse = 1.0 + uIntensity * 0.5;

    // Main blob
    float d = sdSphere(p, 1.5 * pulse);

    // Orbiting satellites
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float angle = t * (0.3 + fi * 0.1) + fi * 1.2566;
      float radius = 2.5 + sin(t * 0.5 + fi) * 0.5;
      float blobSize = 0.6 + sin(t + fi * 2.0) * 0.2;

      vec3 orbPos = vec3(
        cos(angle) * radius,
        sin(angle * 0.7 + fi) * radius * 0.5,
        sin(angle) * radius
      );

      float satellite = sdSphere(p - orbPos, blobSize * pulse);
      d = smin(d, satellite, 0.8 + uIntensity * 0.4);
    }

    // Mouse-attracted blob
    vec3 mousePos = vec3(uMouse * 3.0, 0.0);
    float mouseSphere = sdSphere(p - mousePos, 0.8);
    d = smin(d, mouseSphere, 1.0);

    return d;
  }

  // \u2500\u2500 Normal via central differences \u2500\u2500
  vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
      scene(p + e.xyy) - scene(p - e.xyy),
      scene(p + e.yxy) - scene(p - e.yxy),
      scene(p + e.yyx) - scene(p - e.yyx)
    ));
  }

  // \u2500\u2500 Environment map (fake) \u2500\u2500
  vec3 envMap(vec3 dir) {
    float t = uTime * 0.1;
    vec3 col = mix(uColor1 * 0.3, uColor2 * 0.5, dir.y * 0.5 + 0.5);
    col += vec3(0.1) * pow(max(dir.y, 0.0), 4.0);
    // Scanning lines
    col += vec3(0.05) * step(0.98, fract(dir.y * 20.0 + t));
    return col;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - uResolution * 0.5) / min(uResolution.x, uResolution.y);

    // Camera
    vec3 ro = vec3(0.0, 0.0, 6.0);
    vec3 rd = normalize(vec3(uv, -1.5));

    // \u2500\u2500 Ray march \u2500\u2500
    float totalDist = 0.0;
    float hit = 0.0;
    vec3 p;

    for (int i = 0; i < 64; i++) {
      p = ro + rd * totalDist;
      float d = scene(p);
      if (d < 0.001) { hit = 1.0; break; }
      if (totalDist > 20.0) break;
      totalDist += d;
    }

    vec3 color = vec3(0.0);

    if (hit > 0.5) {
      vec3 normal = calcNormal(p);

      // Fresnel \u2014 edge glow
      float fresnel = pow(1.0 - max(dot(normal, -rd), 0.0), 3.0);

      // Reflection
      vec3 ref = reflect(rd, normal);
      vec3 envColor = envMap(ref);

      // Iridescent color shift based on normal angle
      float iridescence = dot(normal, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5;
      vec3 iriColor = mix(uColor1, uColor2, iridescence);

      // Specular
      vec3 lightDir = normalize(vec3(1.0, 2.0, 3.0));
      float spec = pow(max(dot(ref, lightDir), 0.0), 32.0);

      color = envColor * 0.6 + iriColor * fresnel * 0.8 + vec3(spec * 0.5);

      // Rim lighting
      color += uColor1 * fresnel * 0.3 * uIntensity;
    }

    // Soft fade
    float alpha = hit * (0.08 + uIntensity * 0.15);

    gl_FragColor = vec4(color, alpha);
  }
`
  );
  var Jp = (
    /* glsl */
    `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
  );
  var Fn = class {
    constructor(e = {}) {
      this.color1 = e.color1 || new x(5809919);
      this.color2 = e.color2 || new x(12356863);
      this.mesh = null;
      this.mat = null;
      this.visible = true;
    }
    init(e) {
      const t = new Ze(2, 2);
      this.mat = new Ee({
        vertexShader: Jp,
        fragmentShader: Zp,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0.3 },
          uResolution: { value: new X(
            e.renderer.domElement.width,
            e.renderer.domElement.height
          ) },
          uMouse: { value: new X() },
          uColor1: { value: this.color1 },
          uColor2: { value: this.color2 }
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: Ve,
        side: _h
      });
      this.mesh = new De(t, this.mat);
      this.mesh.frustumCulled = false;
      this.mesh.renderOrder = 100;
      this.mesh.position.set(0, 0, 0);
      this.mesh.scale.set(10, 10, 1);
      e.scene.add(this.mesh);
    }
    update(e, t) {
      if (!this.mat) return;
      this.mat.uniforms.uTime.value = e.elapsed;
      this.mat.uniforms.uIntensity.value = e.intensity;
      this.mat.uniforms.uMouse.value.copy(e.mouseNDC);
      this.mesh.quaternion.copy(t.camera.quaternion);
    }
    onResize(e, t, i) {
      if (this.mat) {
        this.mat.uniforms.uResolution.value.set(e, t);
      }
    }
    onThemeChange(e, t) {
      if (this.mat && e.metalColors) {
        this.mat.uniforms.uColor1.value.set(e.metalColors[0]);
        this.mat.uniforms.uColor2.value.set(e.metalColors[1]);
      }
    }
    dispose(e) {
      if (this.mesh) {
        e.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mat.dispose();
      }
    }
  };

  // assets/familiar/chimera-fx/components/ReactionDiffusion.js
  var Kp = (
    /* glsl */
    `
  precision highp float;

  uniform sampler2D tState;   // previous state (r=A, g=B chemical)
  uniform vec2 uResolution;
  uniform float uFeed;        // feed rate (how fast A is added)
  uniform float uKill;        // kill rate (how fast B decays)
  uniform float uDiffuseA;    // A diffusion rate
  uniform float uDiffuseB;    // B diffusion rate
  uniform float uDt;          // time step
  uniform vec2 uMouse;        // seed point
  uniform float uMouseActive; // 1 when mouse is seeding

  varying vec2 vUv;

  void main() {
    vec2 texel = 1.0 / uResolution;
    vec2 uv = vUv;

    // Sample center and neighbors (Laplacian)
    vec2 c = texture2D(tState, uv).rg;
    vec2 n = texture2D(tState, uv + vec2(0, texel.y)).rg;
    vec2 s = texture2D(tState, uv - vec2(0, texel.y)).rg;
    vec2 e = texture2D(tState, uv + vec2(texel.x, 0)).rg;
    vec2 w = texture2D(tState, uv - vec2(texel.x, 0)).rg;

    // 5-point Laplacian
    vec2 laplacian = (n + s + e + w - 4.0 * c);

    float A = c.r;
    float B = c.g;

    // Gray-Scott equations
    float reaction = A * B * B;
    float newA = A + (uDiffuseA * laplacian.r - reaction + uFeed * (1.0 - A)) * uDt;
    float newB = B + (uDiffuseB * laplacian.g + reaction - (uKill + uFeed) * B) * uDt;

    // Mouse seeding \u2014 drop B chemical at mouse position
    float mouseDist = length(uv - (uMouse * 0.5 + 0.5));
    if (uMouseActive > 0.5 && mouseDist < 0.02) {
      newB = 1.0;
    }

    // Auto-seed some random spots to keep it alive
    float autoSeed = step(0.9998, fract(sin(dot(uv * uResolution, vec2(12.9898, 78.233))) * 43758.5453));
    newB = max(newB, autoSeed * 0.5);

    gl_FragColor = vec4(clamp(newA, 0.0, 1.0), clamp(newB, 0.0, 1.0), 0.0, 1.0);
  }
`
  );
  var $p = (
    /* glsl */
    `
  precision highp float;

  uniform sampler2D tState;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uIntensity;

  varying vec2 vUv;

  void main() {
    vec2 state = texture2D(tState, vUv).rg;
    float A = state.r;
    float B = state.g;

    // Map chemical concentrations to colors
    vec3 col = vec3(0.0);
    col = mix(col, uColor1, smoothstep(0.0, 0.5, B) * 0.6);
    col = mix(col, uColor2, smoothstep(0.3, 0.7, B));
    col = mix(col, uColor3, smoothstep(0.6, 1.0, B) * 0.8);

    // Edge glow where A and B meet
    float edge = abs(A - B);
    col += uColor1 * edge * 0.3;

    float alpha = smoothstep(0.1, 0.5, B) * uIntensity * 0.2;

    gl_FragColor = vec4(col, alpha);
  }
`
  );
  var jh = (
    /* glsl */
    `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
  );
  var li = {
    idle: { feed: 0.037, kill: 0.06, diffA: 1, diffB: 0.5, dt: 1 },
    thinking: { feed: 0.042, kill: 0.065, diffA: 1, diffB: 0.5, dt: 2 },
    streaming: { feed: 0.04, kill: 0.062, diffA: 1, diffB: 0.5, dt: 1.5 },
    executing: { feed: 0.05, kill: 0.065, diffA: 1, diffB: 0.5, dt: 2.5 },
    error: { feed: 0.02, kill: 0.055, diffA: 1.2, diffB: 0.4, dt: 0.5 },
    success: { feed: 0.055, kill: 0.062, diffA: 0.8, diffB: 0.6, dt: 3 }
  };
  var Bn = class {
    constructor(e = {}) {
      this.resolution = e.resolution || 256;
      this.stepsPerFrame = e.stepsPerFrame || 8;
      this.displayMesh = null;
      this.computeMat = null;
      this.displayMat = null;
      this.rtA = null;
      this.rtB = null;
      this.computeScene = null;
      this.computeCamera = null;
      this.computeMesh = null;
      this.currentPreset = { ...li.idle };
      this.targetPreset = { ...li.idle };
    }
    init(e) {
      const t = this.resolution;
      const i = {
        minFilter: gt,
        magFilter: gt,
        format: bt,
        type: Nt
      };
      this.rtA = new at(t, t, i);
      this.rtB = new at(t, t, i);
      this._seedInitial(e);
      this.computeScene = new ki();
      this.computeCamera = new xi(-1, 1, 1, -1, 0, 1);
      const n = new Ze(2, 2);
      this.computeMat = new Ee({
        vertexShader: jh,
        fragmentShader: Kp,
        uniforms: {
          tState: { value: this.rtA.texture },
          uResolution: { value: new X(t, t) },
          uFeed: { value: li.idle.feed },
          uKill: { value: li.idle.kill },
          uDiffuseA: { value: li.idle.diffA },
          uDiffuseB: { value: li.idle.diffB },
          uDt: { value: li.idle.dt },
          uMouse: { value: new X() },
          uMouseActive: { value: 0 }
        }
      });
      this.computeMesh = new De(n, this.computeMat);
      this.computeScene.add(this.computeMesh);
      this.displayMat = new Ee({
        vertexShader: jh,
        fragmentShader: $p,
        uniforms: {
          tState: { value: this.rtA.texture },
          uColor1: { value: new x(5809919) },
          uColor2: { value: new x(12356863) },
          uColor3: { value: new x(4176208) },
          uIntensity: { value: 0.3 }
        },
        transparent: true,
        depthWrite: false,
        blending: Ve
      });
      this.displayMesh = new De(new Ze(2, 2), this.displayMat);
      this.displayMesh.frustumCulled = false;
      this.displayMesh.scale.set(25, 25, 1);
      this.displayMesh.position.z = -10;
      e.scene.add(this.displayMesh);
    }
    _seedInitial(e) {
      const t = this.resolution;
      const i = new Float32Array(t * t * 4);
      for (let c = 0; c < t * t; c++) {
        const h = c % t / t;
        const u = Math.floor(c / t) / t;
        i[c * 4] = 1;
        i[c * 4 + 1] = 0;
        const d = h - 0.5;
        const p = u - 0.5;
        if (Math.random() < 0.01 && Math.sqrt(d * d + p * p) < 0.3) {
          i[c * 4 + 1] = 1;
        }
      }
      const n = new Es(i, t, t, bt, Nt);
      n.needsUpdate = true;
      const s = new ki();
      const a = new xi(-1, 1, 1, -1, 0, 1);
      const o = new zt({ map: n });
      const l = new De(new Ze(2, 2), o);
      s.add(l);
      e.renderer.setRenderTarget(this.rtA);
      e.renderer.render(s, a);
      e.renderer.setRenderTarget(null);
      o.dispose();
      n.dispose();
    }
    update(e, t) {
      if (!this.computeMat) return;
      const i = 0.02;
      for (const n of ["feed", "kill", "diffA", "diffB", "dt"]) {
        this.currentPreset[n] += (this.targetPreset[n] - this.currentPreset[n]) * i;
      }
      this.computeMat.uniforms.uFeed.value = this.currentPreset.feed;
      this.computeMat.uniforms.uKill.value = this.currentPreset.kill;
      this.computeMat.uniforms.uDiffuseA.value = this.currentPreset.diffA;
      this.computeMat.uniforms.uDiffuseB.value = this.currentPreset.diffB;
      this.computeMat.uniforms.uDt.value = this.currentPreset.dt;
      this.computeMat.uniforms.uMouse.value.copy(e.mouseNDC);
      for (let n = 0; n < this.stepsPerFrame; n++) {
        this.computeMat.uniforms.tState.value = this.rtA.texture;
        t.renderer.setRenderTarget(this.rtB);
        t.renderer.render(this.computeScene, this.computeCamera);
        [this.rtA, this.rtB] = [this.rtB, this.rtA];
      }
      t.renderer.setRenderTarget(null);
      this.displayMat.uniforms.tState.value = this.rtA.texture;
      this.displayMat.uniforms.uIntensity.value = e.intensity;
      this.displayMesh.quaternion.copy(t.camera.quaternion);
    }
    onStateChange(e, t) {
      if (li[e]) {
        this.targetPreset = { ...li[e] };
      }
    }
    onThemeChange(e, t) {
      if (this.displayMat && e.reactionColors) {
        this.displayMat.uniforms.uColor1.value.set(e.reactionColors[0]);
        this.displayMat.uniforms.uColor2.value.set(e.reactionColors[1]);
        this.displayMat.uniforms.uColor3.value.set(e.reactionColors[2]);
      }
    }
    dispose(e) {
      if (this.displayMesh) {
        e.scene.remove(this.displayMesh);
        this.displayMesh.geometry.dispose();
        this.displayMat.dispose();
      }
      this.computeMat?.dispose();
      this.rtA?.dispose();
      this.rtB?.dispose();
    }
  };

  // assets/familiar/chimera-fx/components/VoronoiShatter.js
  var Qp = (
    /* glsl */
    `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;     // 0 = hidden, 1 = full shatter
  uniform float uShatterPhase;  // 0..1 transition progress
  uniform vec2 uResolution;
  uniform vec3 uEdgeColor;
  uniform vec3 uFillColor;
  uniform int uCellCount;

  varying vec2 vUv;

  // Voronoi
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }

  vec3 voronoi(vec2 x, float time) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    float minDist = 8.0;
    float secondDist = 8.0;
    vec2 minPoint;

    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = hash2(n + g);
        // Animate cell centers
        o = 0.5 + 0.5 * sin(time * 0.5 + 6.2831 * o);
        vec2 r = g + o - f;
        float d = dot(r, r);

        if (d < minDist) {
          secondDist = minDist;
          minDist = d;
          minPoint = r;
        } else if (d < secondDist) {
          secondDist = d;
        }
      }
    }

    float edge = secondDist - minDist;
    return vec3(minDist, edge, length(minPoint));
  }

  void main() {
    if (uIntensity < 0.01) discard;

    vec2 uv = vUv;
    float cellScale = float(uCellCount);

    vec3 v = voronoi(uv * cellScale, uTime);

    float minDist = v.x;
    float edge = v.y;
    float cellId = v.z;

    // Sharp crack lines
    float crackWidth = 0.05 + uShatterPhase * 0.1;
    float crack = smoothstep(crackWidth, 0.0, edge);

    // Cell displacement during shatter
    float displaceAmount = uShatterPhase * uShatterPhase * 0.05;
    vec2 cellOffset = (hash2(vec2(cellId * 100.0)) - 0.5) * displaceAmount;

    // Edge glow
    float edgeGlow = crack * (0.5 + uShatterPhase * 0.5);

    // Fill \u2014 subtle when idle, strong during shatter
    float fillAlpha = smoothstep(0.3, 0.0, minDist) * uShatterPhase * 0.3;

    // Combine
    vec3 color = uEdgeColor * edgeGlow + uFillColor * fillAlpha;

    // Flash effect on initial shatter
    float flash = smoothstep(0.0, 0.1, uShatterPhase) * smoothstep(0.3, 0.1, uShatterPhase);
    color += vec3(1.0) * flash * 0.3;

    float alpha = (edgeGlow + fillAlpha) * uIntensity;

    gl_FragColor = vec4(color, alpha);
  }
`
  );
  var em = (
    /* glsl */
    `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
  );
  var Hn = class {
    constructor(e = {}) {
      this.cellCount = e.cells || 12;
      this.edgeColor = e.edgeColor || new x(16273737);
      this.fillColor = e.fillColor || new x(16750592);
      this.mesh = null;
      this.mat = null;
      this._shatterPhase = 0;
      this._shatterTarget = 0;
      this._active = false;
    }
    init(e) {
      this.mat = new Ee({
        vertexShader: em,
        fragmentShader: Qp,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0 },
          uShatterPhase: { value: 0 },
          uResolution: { value: new X(
            e.renderer.domElement.width,
            e.renderer.domElement.height
          ) },
          uEdgeColor: { value: this.edgeColor },
          uFillColor: { value: this.fillColor },
          uCellCount: { value: this.cellCount }
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: Ve
      });
      this.mesh = new De(new Ze(2, 2), this.mat);
      this.mesh.frustumCulled = false;
      this.mesh.scale.set(30, 30, 1);
      this.mesh.position.z = -5;
      this.mesh.visible = false;
      e.scene.add(this.mesh);
    }
    update(e, t) {
      if (!this.mat) return;
      this.mat.uniforms.uTime.value = e.elapsed;
      this._shatterPhase += (this._shatterTarget - this._shatterPhase) * 0.08;
      this.mat.uniforms.uShatterPhase.value = this._shatterPhase;
      if (this._shatterPhase > 0.01) {
        this.mesh.visible = true;
        this.mat.uniforms.uIntensity.value = this._shatterPhase;
      } else {
        this.mesh.visible = false;
      }
      this.mesh.quaternion.copy(t.camera.quaternion);
      if (this._shatterTarget > 0) {
        this._shatterTarget -= e.dt * 0.5;
        if (this._shatterTarget < 0) this._shatterTarget = 0;
      }
    }
    /** Trigger a shatter effect */
    shatter(e = 1) {
      this._shatterTarget = e;
      this._shatterPhase = 0.01;
      this._active = true;
    }
    onStateChange(e, t) {
      if (e === "error") {
        this.shatter(1);
      }
    }
    onPulse(e, t, i) {
      if (e === "error") this.shatter(1);
      if (e === "trade") this.shatter(0.3);
    }
    dispose(e) {
      if (this.mesh) {
        e.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mat.dispose();
      }
    }
  };

  // assets/familiar/chimera-fx/components/HoloHUD.js
  var tm = (
    /* glsl */
    `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColor;
  uniform float uScanSpeed;

  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 pos = (uv - 0.5) * aspect;
    float t = uTime;

    vec3 color = vec3(0.0);
    float alpha = 0.0;

    // \u2500\u2500 Scan line (sweeping horizontal bar) \u2500\u2500
    float scanY = fract(t * uScanSpeed * 0.05);
    float scanDist = abs(uv.y - scanY);
    float scanLine = smoothstep(0.02, 0.0, scanDist) * 0.4;
    color += uColor * scanLine;
    alpha += scanLine;

    // \u2500\u2500 Micro scan lines (CRT-style) \u2500\u2500
    float microLines = step(0.5, fract(uv.y * uResolution.y * 0.25)) * 0.03;
    alpha += microLines * uIntensity;
    color += uColor * microLines * 0.5;

    // \u2500\u2500 Grid \u2500\u2500
    float gridSize = 40.0;
    vec2 grid = abs(fract(uv * gridSize) - 0.5);
    float gridLine = smoothstep(0.02, 0.0, min(grid.x, grid.y));
    // Pulse at intersections
    float intersection = smoothstep(0.02, 0.0, grid.x) * smoothstep(0.02, 0.0, grid.y);
    float gridPulse = intersection * (0.5 + 0.5 * sin(t * 2.0 + uv.x * 50.0));
    float gridAlpha = (gridLine * 0.02 + gridPulse * 0.15) * uIntensity;
    color += uColor * gridAlpha;
    alpha += gridAlpha;

    // \u2500\u2500 Corner brackets \u2500\u2500
    float cornerSize = 0.06;
    float cornerThick = 0.002;
    float bracket = 0.0;
    // Top-left
    if (uv.x < cornerSize && abs(uv.y - 0.0) < cornerThick) bracket = 1.0;
    if (uv.y < cornerSize && abs(uv.x - 0.0) < cornerThick) bracket = 1.0;
    // Top-right
    if (uv.x > 1.0 - cornerSize && abs(uv.y - 0.0) < cornerThick) bracket = 1.0;
    if (abs(uv.x - 1.0) < cornerThick && uv.y < cornerSize) bracket = 1.0;
    // Bottom-left
    if (uv.x < cornerSize && abs(uv.y - 1.0) < cornerThick) bracket = 1.0;
    if (abs(uv.x - 0.0) < cornerThick && uv.y > 1.0 - cornerSize) bracket = 1.0;
    // Bottom-right
    if (uv.x > 1.0 - cornerSize && abs(uv.y - 1.0) < cornerThick) bracket = 1.0;
    if (abs(uv.x - 1.0) < cornerThick && uv.y > 1.0 - cornerSize) bracket = 1.0;

    color += uColor * bracket * 0.6 * uIntensity;
    alpha += bracket * 0.3 * uIntensity;

    // \u2500\u2500 Mouse reticle \u2500\u2500
    vec2 mouseUv = uMouse * 0.5 + 0.5;
    vec2 mPos = (mouseUv - 0.5) * aspect;
    float mouseDist = length(pos - mPos);
    float reticleRing = smoothstep(0.003, 0.0, abs(mouseDist - 0.03));
    float reticleCross = 0.0;
    if (abs(pos.x - mPos.x) < 0.001 && abs(pos.y - mPos.y) < 0.04) reticleCross = 1.0;
    if (abs(pos.y - mPos.y) < 0.001 && abs(pos.x - mPos.x) < 0.04) reticleCross = 1.0;
    float reticle = max(reticleRing, reticleCross * 0.5) * uIntensity;
    color += uColor * reticle * 0.5;
    alpha += reticle * 0.3;

    // \u2500\u2500 Edge data tickers \u2500\u2500
    float tickerY = step(0.97, uv.y) + step(uv.y, 0.03);
    float tickerBar = tickerY * step(0.5, fract(uv.x * 100.0 - t * 5.0)) * 0.15;
    color += uColor * tickerBar * uIntensity;
    alpha += tickerBar * uIntensity;

    // Overall fade near edges for vignette
    float vignette = smoothstep(0.0, 0.3, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
    alpha *= mix(1.0, vignette, 0.5);

    // Cap maximum opacity to stay subtle
    alpha = min(alpha, 0.15) * uIntensity;

    gl_FragColor = vec4(color, alpha);
  }
`
  );
  var im = (
    /* glsl */
    `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
  );
  var zn = class {
    constructor(e = {}) {
      this.color = e.color || new x(5809919);
      this.scanSpeed = e.scanSpeed || 1;
      this.mesh = null;
      this.mat = null;
    }
    init(e) {
      this.mat = new Ee({
        vertexShader: im,
        fragmentShader: tm,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0.3 },
          uResolution: { value: new X(
            e.renderer.domElement.width,
            e.renderer.domElement.height
          ) },
          uMouse: { value: new X() },
          uColor: { value: this.color },
          uScanSpeed: { value: this.scanSpeed }
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: Ve
      });
      this.mesh = new De(new Ze(2, 2), this.mat);
      this.mesh.frustumCulled = false;
      this.mesh.renderOrder = 1e3;
      e.scene.add(this.mesh);
    }
    update(e, t) {
      if (!this.mat) return;
      this.mat.uniforms.uTime.value = e.elapsed;
      this.mat.uniforms.uIntensity.value = e.intensity * 0.7;
      this.mat.uniforms.uMouse.value.copy(e.mouseNDC);
      this.mesh.position.copy(t.camera.position);
      this.mesh.position.z -= 0.5;
      this.mesh.lookAt(t.camera.position);
    }
    onResize(e, t, i) {
      if (this.mat) {
        this.mat.uniforms.uResolution.value.set(e, t);
      }
    }
    dispose(e) {
      if (this.mesh) {
        e.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mat.dispose();
      }
    }
  };

  // assets/familiar/chimera-fx/components/EnergyBeams.js
  var nm = (
    /* glsl */
    `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColor;
  uniform vec2 uPointA;       // start point (NDC)
  uniform vec2 uPointB;       // end point (NDC)
  uniform float uThickness;
  uniform float uBranches;

  varying vec2 vUv;

  // \u2500\u2500 Noise \u2500\u2500
  float hash(float n) { return fract(sin(n) * 43758.5453); }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = i.x + i.y * 157.0;
    return mix(mix(hash(n), hash(n + 1.0), f.x),
               mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p;
      a *= 0.5;
    }
    return v;
  }

  // \u2500\u2500 Lightning bolt from A to B \u2500\u2500
  float bolt(vec2 uv, vec2 a, vec2 b, float seed, float time) {
    vec2 dir = b - a;
    float len = length(dir);
    if (len < 0.001) return 0.0;
    vec2 norm = vec2(-dir.y, dir.x) / len;

    // Parameter along bolt (0..1)
    float t = clamp(dot(uv - a, dir) / (len * len), 0.0, 1.0);

    // FBM displacement perpendicular to bolt direction
    float displacement = fbm(vec2(t * 8.0 + seed, time * 3.0 + seed)) * 0.15;
    displacement += fbm(vec2(t * 16.0 + seed * 2.0, time * 7.0)) * 0.05; // fine detail

    // Taper displacement at endpoints
    float taper = smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.9, t);
    displacement *= taper;

    // Perpendicular distance from displaced bolt path
    float dist = abs(dot(uv - a, norm) - displacement);

    // Inverse distance glow
    float glow = uThickness / (dist + 0.001);
    glow *= taper; // fade at ends

    return glow;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;

    float totalGlow = 0.0;

    // Main bolt
    totalGlow += bolt(uv, uPointA, uPointB, 0.0, t) * 0.6;

    // Secondary bolts (slightly offset paths)
    totalGlow += bolt(uv, uPointA, uPointB, 7.3, t * 1.2) * 0.3;
    totalGlow += bolt(uv, uPointA, uPointB, 13.7, t * 0.8) * 0.2;

    // Branch bolts
    if (uBranches > 0.5) {
      vec2 mid = mix(uPointA, uPointB, 0.4 + fbm(vec2(t * 0.5, 0.0)) * 0.2);
      vec2 branchEnd = mid + vec2(
        fbm(vec2(t, 0.0)) * 0.15,
        fbm(vec2(0.0, t)) * 0.15
      );
      totalGlow += bolt(uv, mid, branchEnd, 23.1, t * 1.5) * 0.15;

      vec2 mid2 = mix(uPointA, uPointB, 0.65);
      vec2 branchEnd2 = mid2 + vec2(
        fbm(vec2(t + 5.0, 1.0)) * 0.12,
        fbm(vec2(1.0, t + 5.0)) * -0.12
      );
      totalGlow += bolt(uv, mid2, branchEnd2, 37.9, t * 1.3) * 0.1;
    }

    // Intensity modulation
    totalGlow *= uIntensity;

    // Flicker
    float flicker = 0.85 + 0.15 * sin(t * 20.0) * sin(t * 31.0);
    totalGlow *= flicker;

    // Color with hot white core
    vec3 col = mix(uColor, vec3(1.0), smoothstep(1.0, 5.0, totalGlow));
    float alpha = min(totalGlow, 1.0);

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col * totalGlow, alpha);
  }
`
  );
  var rm = (
    /* glsl */
    `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
  );
  var kn = class {
    constructor(e = {}) {
      this.beamCount = e.count || 3;
      this.color = e.color || new x(5809919);
      this.beams = [];
      this._pulseActive = false;
      this._pulseTime = 0;
    }
    init(e) {
      for (let t = 0; t < this.beamCount; t++) {
        const i = new Ee({
          vertexShader: rm,
          fragmentShader: nm,
          uniforms: {
            uTime: { value: 0 },
            uIntensity: { value: 0 },
            uColor: { value: this.color.clone() },
            uPointA: { value: new X(-0.3, -0.5) },
            uPointB: { value: new X(0.3, 0.5) },
            uThickness: { value: 3e-3 },
            uBranches: { value: 1 }
          },
          transparent: true,
          depthWrite: false,
          depthTest: false,
          blending: Ve
        });
        const n = new De(new Ze(2, 2), i);
        n.frustumCulled = false;
        n.renderOrder = 800;
        n.visible = false;
        e.scene.add(n);
        this.beams.push({ mesh: n, mat: i, seed: Math.random() * 100 });
      }
    }
    update(e, t) {
      const i = e.state === "executing" || e.state === "success" || this._pulseActive;
      this.beams.forEach((n, s) => {
        n.mesh.visible = i;
        if (!i) return;
        const a = e.elapsed;
        n.mat.uniforms.uTime.value = a;
        const o = n.seed;
        const l = 0.3 + s * 0.1;
        n.mat.uniforms.uPointA.value.set(
          Math.sin(a * l + o) * 0.4,
          -0.5 + Math.sin(a * l * 0.7 + o) * 0.1
        );
        n.mat.uniforms.uPointB.value.set(
          Math.sin(a * l * 1.3 + o + 2) * 0.4,
          0.4 + Math.cos(a * l * 0.5 + o) * 0.2
        );
        let c = e.intensity;
        if (this._pulseActive) {
          const h = a - this._pulseTime;
          c = Math.max(c, 1 - h * 0.5);
          if (h > 2) this._pulseActive = false;
        }
        n.mat.uniforms.uIntensity.value = c;
        n.mesh.position.copy(t.camera.position);
        n.mesh.position.z -= 0.8;
        n.mesh.lookAt(t.camera.position);
      });
    }
    onPulse(e, t, i) {
      if (e === "trade" || e === "success") {
        this._pulseActive = true;
        this._pulseTime = i.clock.getElapsedTime();
      }
    }
    onThemeChange(e, t) {
      const i = e.tendrilColors?.[0] || this.color;
      this.beams.forEach((n) => n.mat.uniforms.uColor.value.copy(i));
    }
    dispose(e) {
      this.beams.forEach(({ mesh: t, mat: i }) => {
        e.scene.remove(t);
        t.geometry.dispose();
        i.dispose();
      });
      this.beams = [];
    }
  };

  // assets/familiar/chimera-fx/components/IridescentOrb.js
  var sm = (
    /* glsl */
    `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uBaseColor;
  uniform float uIridescenceStrength;
  uniform float uFresnelPower;
  uniform float uBreathingSpeed;
  uniform float uNoiseScale;

  varying vec2 vUv;

  // \u2500\u2500 Noise \u2500\u2500
  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(dot(hash3(i), f),
                       dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                   mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
                       dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
               mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
                       dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                   mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
                       dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
  }

  float fbm3(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise3(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  // \u2500\u2500 SDF sphere with noise displacement \u2500\u2500
  float sdSphere(vec3 p, float r) {
    return length(p) - r;
  }

  float scene(vec3 p) {
    float t = uTime * uBreathingSpeed;

    // Breathing animation
    float breathing = 1.0 + sin(t) * 0.05 * uIntensity;

    // Surface noise displacement
    float disp = fbm3(p * uNoiseScale + t * 0.3) * 0.15 * uIntensity;

    return sdSphere(p, 1.5 * breathing) + disp;
  }

  vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
      scene(p + e.xyy) - scene(p - e.xyy),
      scene(p + e.yxy) - scene(p - e.yxy),
      scene(p + e.yyx) - scene(p - e.yyx)
    ));
  }

  // \u2500\u2500 Thin-film iridescence \u2500\u2500
  vec3 iridescence(float cosTheta, float thickness) {
    // Map viewing angle to spectral color via thin-film interference
    float phase = cosTheta * thickness;
    return 0.5 + 0.5 * cos(6.28318 * (phase * vec3(1.0, 0.8, 0.6) + vec3(0.0, 0.1, 0.2)));
  }

  // \u2500\u2500 Fake environment \u2500\u2500
  vec3 envMap(vec3 dir, float t) {
    vec3 col = vec3(0.02);
    // Subtle gradient
    col += uBaseColor * 0.1 * (dir.y * 0.5 + 0.5);
    // Fake light sources
    float sun = pow(max(dot(dir, normalize(vec3(1.0, 1.0, 0.5))), 0.0), 32.0);
    col += vec3(1.0) * sun * 0.3;
    // Animated scan lines in reflection
    col += uBaseColor * 0.05 * step(0.97, fract(dir.y * 20.0 + t * 0.5));
    return col;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - uResolution * 0.5) / min(uResolution.x, uResolution.y);

    // Camera
    vec3 ro = vec3(0.0, 0.0, 4.0);
    vec3 rd = normalize(vec3(uv, -1.5));

    // Mouse parallax on camera
    ro.xy += uMouse * 0.3;

    // \u2500\u2500 Ray march \u2500\u2500
    float totalDist = 0.0;
    float hit = 0.0;
    vec3 p;

    for (int i = 0; i < 64; i++) {
      p = ro + rd * totalDist;
      float d = scene(p);
      if (d < 0.001) { hit = 1.0; break; }
      if (totalDist > 10.0) break;
      totalDist += d;
    }

    vec4 color = vec4(0.0);

    if (hit > 0.5) {
      vec3 normal = calcNormal(p);
      vec3 viewDir = normalize(ro - p);
      float cosTheta = max(dot(normal, viewDir), 0.0);

      // \u2500\u2500 Fresnel \u2500\u2500
      float fresnel = pow(1.0 - cosTheta, uFresnelPower);

      // \u2500\u2500 Thin-film iridescence \u2500\u2500
      float filmThickness = 2.0 + sin(uTime * 0.3) * 0.5;
      vec3 iriColor = iridescence(cosTheta, filmThickness) * uIridescenceStrength;

      // \u2500\u2500 Reflection \u2500\u2500
      vec3 reflected = reflect(-viewDir, normal);
      vec3 envColor = envMap(reflected, uTime);

      // \u2500\u2500 Specular \u2500\u2500
      vec3 lightDir = normalize(vec3(1.0, 2.0, 2.0));
      vec3 halfVec = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfVec), 0.0), 64.0);

      // \u2500\u2500 Combine \u2500\u2500
      vec3 col = vec3(0.0);
      col += uBaseColor * 0.15 * cosTheta;           // diffuse base
      col += iriColor * fresnel;                       // iridescent rim
      col += envColor * (0.3 + fresnel * 0.5);        // reflection
      col += vec3(1.0) * spec * 0.6;                  // specular highlight
      col += uBaseColor * fresnel * 0.4 * uIntensity; // glow rim

      // Subsurface scatter hint
      float sss = pow(max(dot(viewDir, -lightDir), 0.0), 3.0) * 0.15;
      col += uBaseColor * sss;

      float alpha = 0.1 + fresnel * 0.15 + uIntensity * 0.1;
      color = vec4(col, min(alpha, 0.4));
    }

    gl_FragColor = color;
  }
`
  );
  var am = (
    /* glsl */
    `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
  );
  var Vn = class {
    constructor(e = {}) {
      this.baseColor = e.color || new x(5809919);
      this.size = e.size || 8;
      this.mesh = null;
      this.mat = null;
    }
    init(e) {
      this.mat = new Ee({
        vertexShader: am,
        fragmentShader: sm,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0.3 },
          uResolution: { value: new X(
            e.renderer.domElement.width,
            e.renderer.domElement.height
          ) },
          uMouse: { value: new X() },
          uBaseColor: { value: this.baseColor },
          uIridescenceStrength: { value: 0.8 },
          uFresnelPower: { value: 3 },
          uBreathingSpeed: { value: 0.5 },
          uNoiseScale: { value: 2 }
        },
        transparent: true,
        depthWrite: false,
        blending: Ve
      });
      this.mesh = new De(new Ze(2, 2), this.mat);
      this.mesh.frustumCulled = false;
      this.mesh.renderOrder = 500;
      this.mesh.scale.set(this.size, this.size, 1);
      e.scene.add(this.mesh);
    }
    update(e, t) {
      if (!this.mat) return;
      this.mat.uniforms.uTime.value = e.elapsed;
      this.mat.uniforms.uIntensity.value = e.intensity;
      this.mat.uniforms.uMouse.value.copy(e.mouseNDC);
      const i = { idle: 0.5, thinking: 1.5, streaming: 1, executing: 2.5, error: 0.3, success: 2 };
      const n = i[e.state] || 0.5;
      const s = this.mat.uniforms.uBreathingSpeed.value;
      this.mat.uniforms.uBreathingSpeed.value += (n - s) * 0.05;
      const a = { idle: 2, thinking: 3.5, streaming: 2.5, executing: 5, error: 8, success: 1.5 };
      const o = a[e.state] || 2;
      const l = this.mat.uniforms.uNoiseScale.value;
      this.mat.uniforms.uNoiseScale.value += (o - l) * 0.03;
      this.mesh.quaternion.copy(t.camera.quaternion);
    }
    onResize(e, t, i) {
      if (this.mat) {
        this.mat.uniforms.uResolution.value.set(e, t);
      }
    }
    onThemeChange(e, t) {
      if (this.mat && e.colors) {
        this.mat.uniforms.uBaseColor.value.copy(e.colors.primary);
      }
    }
    dispose(e) {
      if (this.mesh) {
        e.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mat.dispose();
      }
    }
  };

  // assets/familiar/chimera-fx/themes/cyberpunk-neon.js
  var sl = {
    name: "cyberpunk-neon",
    // Core palette
    colors: {
      primary: new x(16711782),
      // hot pink
      secondary: new x(65535),
      // electric cyan
      tertiary: new x(3800852),
      // toxic green
      accent: new x(16776960),
      // neon yellow
      background: new x(655380),
      // deep purple-black
      surface: new x(1703987)
    },
    // Component-specific colors
    particleColors: [
      [1, 0, 0.4],
      // hot pink
      [0, 1, 1],
      // cyan
      [0.224, 1, 0.078],
      // green
      [1, 1, 0]
      // yellow
    ],
    tendrilColors: [
      new x(16711782),
      new x(65535),
      new x(3800852)
    ],
    riverColors: [
      [1, 0, 0.4],
      [0, 1, 1],
      [0.224, 1, 0.078]
    ],
    metalColors: [
      new x(16711782),
      new x(65535)
    ],
    reactionColors: [
      new x(16711782),
      new x(65535),
      new x(3800852)
    ],
    // Post-processing overrides
    postfx: {
      bloomStrength: 0.5,
      bloomRadius: 0.4,
      bloomThreshold: 0.3,
      grainIntensity: 0.05,
      chromaBase: 2e-3
    },
    // Fog
    fogColor: new x(655380),
    fogDensity: 2e-3,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/themes/organic-bioluminescent.js
  var al = {
    name: "organic-bioluminescent",
    colors: {
      primary: new x(58879),
      // bioluminescent blue
      secondary: new x(7798531),
      // phosphor green
      tertiary: new x(16755456),
      // amber
      accent: new x(14696699),
      // magenta (deep sea)
      background: new x(6707),
      // deep ocean
      surface: new x(8772)
    },
    particleColors: [
      [0, 0.898, 1],
      // bioluminescent blue
      [0.463, 1, 0.012],
      // phosphor green
      [1, 0.671, 0],
      // amber
      [0.878, 0.251, 0.984]
      // magenta
    ],
    tendrilColors: [
      new x(58879),
      new x(7798531),
      new x(14696699)
    ],
    riverColors: [
      [0, 0.898, 1],
      [0.463, 1, 0.012],
      [0.878, 0.251, 0.984]
    ],
    metalColors: [
      new x(58879),
      new x(7798531)
    ],
    reactionColors: [
      new x(58879),
      new x(7798531),
      new x(16755456)
    ],
    postfx: {
      bloomStrength: 0.6,
      bloomRadius: 0.5,
      bloomThreshold: 0.25,
      grainIntensity: 0.03,
      chromaBase: 1e-3
    },
    fogColor: new x(6707),
    fogDensity: 3e-3,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/themes/quantum-void.js
  var ol = {
    name: "quantum-void",
    colors: {
      primary: new x(8146431),
      // ultraviolet
      secondary: new x(4492031),
      // quantum blue
      tertiary: new x(16739904),
      // annihilation orange
      accent: new x(16777215),
      // pure white (photon)
      background: new x(328976),
      // void
      surface: new x(657952)
    },
    particleColors: [
      [0.486, 0.302, 1],
      // ultraviolet
      [0.267, 0.541, 1],
      // quantum blue
      [1, 0.431, 0.251],
      // orange
      [1, 1, 1]
      // photon white
    ],
    tendrilColors: [
      new x(8146431),
      new x(4492031),
      new x(16739904)
    ],
    riverColors: [
      [0.486, 0.302, 1],
      [0.267, 0.541, 1],
      [1, 1, 1]
    ],
    metalColors: [
      new x(8146431),
      new x(4492031)
    ],
    reactionColors: [
      new x(8146431),
      new x(4492031),
      new x(16739904)
    ],
    postfx: {
      bloomStrength: 0.7,
      bloomRadius: 0.5,
      bloomThreshold: 0.25,
      grainIntensity: 0.03,
      chromaBase: 1e-3
    },
    fogColor: new x(328976),
    fogDensity: 4e-3,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/themes/holographic-matrix.js
  var ll = {
    name: "holographic-matrix",
    colors: {
      primary: new x(65345),
      // matrix green
      secondary: new x(48340),
      // hologram cyan
      tertiary: new x(16728193),
      // hologram magenta
      accent: new x(16766784),
      // amber highlight
      background: new x(2560),
      // deep green-black
      surface: new x(5120)
    },
    particleColors: [
      [0, 1, 0.255],
      // matrix green
      [0, 0.737, 0.831],
      // hologram cyan
      [0, 0.5, 0.2],
      // dark green
      [1, 0.843, 0.251]
      // amber
    ],
    tendrilColors: [
      new x(65345),
      new x(48340),
      new x(16728193)
    ],
    riverColors: [
      [0, 1, 0.255],
      [0, 0.737, 0.831],
      [1, 0.251, 0.506]
    ],
    metalColors: [
      new x(65345),
      new x(48340)
    ],
    reactionColors: [
      new x(65345),
      new x(48340),
      new x(16728193)
    ],
    postfx: {
      bloomStrength: 0.5,
      bloomRadius: 0.4,
      bloomThreshold: 0.3,
      grainIntensity: 0.06,
      // higher grain for CRT feel
      chromaBase: 1e-3
      // subtle chromatic aberration for hologram
    },
    fogColor: new x(2560),
    fogDensity: 2e-3,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/themes/chimera-native.js
  var cl = {
    name: "chimera-native",
    colors: {
      primary: new x().setHSL(174 / 360, 1, 0.45),
      // teal-green #00E5CC
      secondary: new x().setHSL(265 / 360, 1, 0.6),
      // purple #7C3AED
      tertiary: new x(59018),
      // success green
      accent: new x(16098851),
      // warning amber
      background: new x(131587),
      // near-black
      surface: new x(657932),
      danger: new x(16726876)
    },
    particleColors: [
      [0, 0.898, 0.8],
      // teal-green (primary)
      [0, 0.902, 0.541],
      // success green
      [0.486, 0.227, 0.929],
      // purple (secondary)
      [0, 0.7, 0.6]
      // dark teal
    ],
    tendrilColors: [
      new x().setHSL(174 / 360, 1, 0.45),
      // teal
      new x(59018),
      // green
      new x().setHSL(265 / 360, 1, 0.6)
      // purple
    ],
    riverColors: [
      [0, 0.898, 0.8],
      // teal
      [0, 0.902, 0.541],
      // green
      [0.486, 0.227, 0.929]
      // purple
    ],
    metalColors: [
      new x().setHSL(174 / 360, 1, 0.45),
      new x().setHSL(265 / 360, 1, 0.6)
    ],
    reactionColors: [
      new x().setHSL(174 / 360, 1, 0.45),
      new x(59018),
      new x().setHSL(265 / 360, 1, 0.6)
    ],
    postfx: {
      bloomStrength: 0.35,
      bloomRadius: 0.5,
      bloomThreshold: 0.35,
      grainIntensity: 5e-3,
      chromaBase: 5e-4
    },
    fogColor: new x(131587),
    fogDensity: 2e-3,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/themes/midnight-trading.js
  var hl = {
    name: "midnight-trading",
    colors: {
      primary: new x(65345),
      // matrix green
      secondary: new x(48340),
      // data cyan
      tertiary: new x(13073),
      // dark forest
      accent: new x(3800852),
      // neon green
      background: new x(2560),
      // near-black green
      surface: new x(5120)
    },
    particleColors: [
      [0, 1, 0.255],
      // matrix green
      [0, 0.737, 0.831],
      // data cyan
      [0, 0.5, 0.2],
      // dark green
      [0.224, 1, 0.078]
      // neon accent
    ],
    tendrilColors: [
      new x(65345),
      new x(48340),
      new x(3800852)
    ],
    riverColors: [
      [0, 1, 0.255],
      [0, 0.737, 0.831],
      [0.224, 1, 0.078]
    ],
    metalColors: [
      new x(65345),
      new x(48340)
    ],
    reactionColors: [
      new x(65345),
      new x(48340),
      new x(3800852)
    ],
    postfx: {
      bloomStrength: 0.55,
      bloomRadius: 0.5,
      bloomThreshold: 0.28,
      grainIntensity: 0.025,
      chromaBase: 1e-3
    },
    fogColor: new x(2560),
    fogDensity: 2e-3,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/themes/neon-samurai.js
  var ul = {
    name: "neon-samurai",
    colors: {
      primary: new x(16711782),
      // hot pink
      secondary: new x(65535),
      // electric cyan
      tertiary: new x(8141549),
      // purple
      accent: new x(16776960),
      // neon yellow
      background: new x(655380),
      // deep purple-black
      surface: new x(1703987)
    },
    particleColors: [
      [1, 0, 0.4],
      // hot pink
      [0, 1, 1],
      // cyan
      [0.486, 0.227, 0.929],
      // purple
      [1, 1, 0]
      // yellow
    ],
    tendrilColors: [
      new x(16711782),
      new x(65535),
      new x(8141549)
    ],
    riverColors: [
      [1, 0, 0.4],
      [0, 1, 1],
      [1, 1, 0]
    ],
    metalColors: [
      new x(16711782),
      new x(65535)
    ],
    reactionColors: [
      new x(16711782),
      new x(65535),
      new x(8141549)
    ],
    postfx: {
      bloomStrength: 0.7,
      bloomRadius: 0.5,
      bloomThreshold: 0.25,
      grainIntensity: 0.035,
      chromaBase: 2e-3
    },
    fogColor: new x(655380),
    fogDensity: 2e-3,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/themes/deep-ocean.js
  var dl = {
    name: "deep-ocean",
    colors: {
      primary: new x(46296),
      // abyssal blue
      secondary: new x(58879),
      // bioluminescent cyan
      tertiary: new x(30646),
      // deep navy
      accent: new x(9494767),
      // light cyan
      background: new x(133136),
      // near-black ocean
      surface: new x(265496)
    },
    particleColors: [
      [0, 0.706, 0.847],
      // abyssal blue
      [0, 0.898, 1],
      // bioluminescent
      [0, 0.467, 0.725],
      // deep navy
      [0.565, 0.878, 0.937]
      // light cyan
    ],
    tendrilColors: [
      new x(46296),
      new x(58879),
      new x(30646)
    ],
    riverColors: [
      [0, 0.706, 0.847],
      [0, 0.898, 1],
      [0.565, 0.878, 0.937]
    ],
    metalColors: [
      new x(46296),
      new x(58879)
    ],
    reactionColors: [
      new x(46296),
      new x(58879),
      new x(30646)
    ],
    postfx: {
      bloomStrength: 0.65,
      bloomRadius: 0.6,
      bloomThreshold: 0.22,
      grainIntensity: 0.015,
      chromaBase: 8e-4
    },
    fogColor: new x(133136),
    fogDensity: 3e-3,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/themes/solar-flare.js
  var pl = {
    name: "solar-flare",
    colors: {
      primary: new x(16098851),
      // amber
      secondary: new x(16739125),
      // orange
      tertiary: new x(16726876),
      // crimson
      accent: new x(16766784),
      // bright amber
      background: new x(1311748),
      // near-black warm
      surface: new x(1705992)
    },
    particleColors: [
      [0.96, 0.65, 0.14],
      // amber
      [1, 0.42, 0.21],
      // orange
      [1, 0.23, 0.36],
      // crimson
      [1, 0.84, 0.25]
      // bright amber
    ],
    tendrilColors: [
      new x(16098851),
      new x(16739125),
      new x(16726876)
    ],
    riverColors: [
      [0.96, 0.65, 0.14],
      [1, 0.42, 0.21],
      [1, 0.23, 0.36]
    ],
    metalColors: [
      new x(16098851),
      new x(16739125)
    ],
    reactionColors: [
      new x(16098851),
      new x(16739125),
      new x(16726876)
    ],
    postfx: {
      bloomStrength: 0.9,
      bloomRadius: 0.55,
      bloomThreshold: 0.2,
      grainIntensity: 8e-3,
      chromaBase: 1e-3
    },
    fogColor: new x(1311748),
    fogDensity: 2e-3,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/themes/void-walker.js
  var ml = {
    name: "void-walker",
    colors: {
      primary: new x(8146431),
      // ultraviolet
      secondary: new x(4492031),
      // quantum blue
      tertiary: new x(14696699),
      // magenta
      accent: new x(16777215),
      // photon white
      background: new x(197384),
      // void
      surface: new x(328973)
    },
    particleColors: [
      [0.486, 0.302, 1],
      // ultraviolet
      [0.267, 0.541, 1],
      // quantum blue
      [0.878, 0.251, 0.984],
      // magenta
      [1, 1, 1]
      // photon white
    ],
    tendrilColors: [
      new x(8146431),
      new x(4492031),
      new x(14696699)
    ],
    riverColors: [
      [0.486, 0.302, 1],
      [0.267, 0.541, 1],
      [1, 1, 1]
    ],
    metalColors: [
      new x(8146431),
      new x(4492031)
    ],
    reactionColors: [
      new x(8146431),
      new x(4492031),
      new x(14696699)
    ],
    postfx: {
      bloomStrength: 0.85,
      bloomRadius: 0.55,
      bloomThreshold: 0.2,
      grainIntensity: 0.02,
      chromaBase: 15e-4
    },
    fogColor: new x(197384),
    fogDensity: 4e-3,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/themes/crystal-matrix.js
  var fl = {
    name: "crystal-matrix",
    colors: {
      primary: new x(10536191),
      // ice blue
      secondary: new x(14740223),
      // pale holographic
      tertiary: new x(4492031),
      // medium blue
      accent: new x(16777215),
      // white
      background: new x(330260),
      // deep blue-black
      surface: new x(528414)
    },
    particleColors: [
      [0.627, 0.769, 1],
      // ice blue
      [0.878, 0.918, 1],
      // pale holographic
      [0.267, 0.541, 1],
      // medium blue
      [1, 1, 1]
      // white
    ],
    tendrilColors: [
      new x(10536191),
      new x(14740223),
      new x(4492031)
    ],
    riverColors: [
      [0.627, 0.769, 1],
      [0.878, 0.918, 1],
      [1, 1, 1]
    ],
    metalColors: [
      new x(10536191),
      new x(14740223)
    ],
    reactionColors: [
      new x(10536191),
      new x(14740223),
      new x(4492031)
    ],
    postfx: {
      bloomStrength: 0.55,
      bloomRadius: 0.45,
      bloomThreshold: 0.3,
      grainIntensity: 0.01,
      chromaBase: 5e-4
    },
    fogColor: new x(330260),
    fogDensity: 2e-3,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/themes/aurora-borealis.js
  var gl = {
    name: "aurora-borealis",
    colors: {
      primary: new x(7339986),
      secondary: new x(10124543),
      tertiary: new x(5495039),
      accent: new x(16735439),
      background: new x(266263),
      surface: new x(530213)
    },
    particleColors: [
      [0.435, 1, 0.824],
      [0.604, 0.486, 1],
      [0.325, 0.847, 1],
      [1, 0.361, 0.812]
    ],
    tendrilColors: [
      new x(7339986),
      new x(10124543),
      new x(16735439)
    ],
    riverColors: [
      [0.435, 1, 0.824],
      [0.604, 0.486, 1],
      [0.325, 0.847, 1]
    ],
    metalColors: [
      new x(7339986),
      new x(10124543)
    ],
    reactionColors: [
      new x(7339986),
      new x(10124543),
      new x(16735439)
    ],
    postfx: {
      bloomStrength: 0.72,
      bloomRadius: 0.55,
      bloomThreshold: 0.22,
      grainIntensity: 0.012,
      chromaBase: 1e-3
    },
    fogColor: new x(266263),
    fogDensity: 25e-4,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/themes/obsidian-forge.js
  var vl = {
    name: "obsidian-forge",
    colors: {
      primary: new x(16742936),
      secondary: new x(10213375),
      tertiary: new x(3093826),
      accent: new x(16761182),
      background: new x(328966),
      surface: new x(1118743)
    },
    particleColors: [
      [1, 0.478, 0.094],
      [1, 0.757, 0.369],
      [0.608, 0.843, 1],
      [0.184, 0.208, 0.259]
    ],
    tendrilColors: [
      new x(16742936),
      new x(16761182),
      new x(10213375)
    ],
    riverColors: [
      [1, 0.478, 0.094],
      [0.608, 0.843, 1],
      [1, 0.757, 0.369]
    ],
    metalColors: [
      new x(16742936),
      new x(10213375)
    ],
    reactionColors: [
      new x(16742936),
      new x(16761182),
      new x(10213375)
    ],
    postfx: {
      bloomStrength: 0.82,
      bloomRadius: 0.48,
      bloomThreshold: 0.24,
      grainIntensity: 0.018,
      chromaBase: 12e-4
    },
    fogColor: new x(328966),
    fogDensity: 3e-3,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/themes/orchid-vapor.js
  var _l = {
    name: "orchid-vapor",
    colors: {
      primary: new x(16734920),
      secondary: new x(9437152),
      tertiary: new x(6871295),
      accent: new x(15251455),
      background: new x(1049877),
      surface: new x(1511455)
    },
    particleColors: [
      [1, 0.353, 0.784],
      [0.561, 1, 0.878],
      [0.408, 0.847, 1],
      [0.91, 0.718, 1]
    ],
    tendrilColors: [
      new x(16734920),
      new x(9437152),
      new x(15251455)
    ],
    riverColors: [
      [1, 0.353, 0.784],
      [0.561, 1, 0.878],
      [0.408, 0.847, 1]
    ],
    metalColors: [
      new x(16734920),
      new x(9437152)
    ],
    reactionColors: [
      new x(16734920),
      new x(9437152),
      new x(15251455)
    ],
    postfx: {
      bloomStrength: 0.66,
      bloomRadius: 0.62,
      bloomThreshold: 0.25,
      grainIntensity: 0.01,
      chromaBase: 1e-3
    },
    fogColor: new x(1049877),
    fogDensity: 2e-3,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/themes/tidal-glass.js
  var yl = {
    name: "tidal-glass",
    colors: {
      primary: new x(4381183),
      secondary: new x(5211647),
      tertiary: new x(15980410),
      accent: new x(14679039),
      background: new x(200732),
      surface: new x(464935)
    },
    particleColors: [
      [0.259, 0.851, 1],
      [0.31, 0.522, 1],
      [0.953, 0.843, 0.478],
      [0.875, 0.984, 1]
    ],
    tendrilColors: [
      new x(4381183),
      new x(5211647),
      new x(15980410)
    ],
    riverColors: [
      [0.259, 0.851, 1],
      [0.31, 0.522, 1],
      [0.953, 0.843, 0.478]
    ],
    metalColors: [
      new x(4381183),
      new x(14679039)
    ],
    reactionColors: [
      new x(4381183),
      new x(5211647),
      new x(15980410)
    ],
    postfx: {
      bloomStrength: 0.62,
      bloomRadius: 0.52,
      bloomThreshold: 0.28,
      grainIntensity: 6e-3,
      chromaBase: 8e-4
    },
    fogColor: new x(200732),
    fogDensity: 22e-4,
    apply(r) {
      r.scene.fog.color.copy(this.fogColor);
      r.scene.fog.density = this.fogDensity;
      r.bloomPass.strength = this.postfx.bloomStrength;
      r.bloomPass.radius = this.postfx.bloomRadius;
      r.bloomPass.threshold = this.postfx.bloomThreshold;
      r.grainPass.uniforms.uIntensity.value = this.postfx.grainIntensity;
    }
  };

  // assets/familiar/chimera-fx/chimera-fx-bundle.js
  var xl = {
    nebula: Dn,
    "particle-nebula": Dn,
    tendrils: Un,
    "energy-tendrils": Un,
    rivers: Nn,
    "data-rivers": Nn,
    volumetric: On,
    "volumetric-light": On,
    metal: Fn,
    "liquid-metal": Fn,
    reaction: Bn,
    "reaction-diffusion": Bn,
    voronoi: Hn,
    "voronoi-shatter": Hn,
    hud: zn,
    "holo-hud": zn,
    beams: kn,
    "energy-beams": kn,
    orb: Vn,
    "iridescent-orb": Vn,
    matter: oi,
    "shapable-matter": oi
  };
  var qs = {
    "cyberpunk-neon": sl,
    "organic-bioluminescent": al,
    "quantum-void": ol,
    "holographic-matrix": ll,
    "chimera-native": cl,
    "midnight-trading": hl,
    "neon-samurai": ul,
    "deep-ocean": dl,
    "solar-flare": pl,
    "void-walker": ml,
    "crystal-matrix": fl,
    "aurora-borealis": gl,
    "obsidian-forge": vl,
    "orchid-vapor": _l,
    "tidal-glass": yl
  };
  var Ys = {
    // Full experience — all components (powerful GPUs only)
    full: ["nebula", "tendrils", "rivers", "volumetric", "reaction", "voronoi", "hud", "beams", "orb", "matter"],
    // Performance-optimized — lighter components
    lite: ["nebula", "tendrils", "hud", "matter"],
    // Trading focused — data visualization emphasis
    trading: ["rivers", "tendrils", "voronoi", "hud", "beams", "matter"],
    // Cinematic — heavy visual feast
    cinematic: ["nebula", "volumetric", "metal", "reaction", "orb", "matter"],
    // Holographic — sci-fi control room
    holographic: ["orb", "hud", "beams", "tendrils", "rivers", "matter"],
    // Minimal — just ambient background (shapable matter for mode-switching)
    minimal: ["matter"],
    // Matter-only — single ShapableMatter component (all 11 modes available)
    matter: ["matter"]
  };
  function om(r = {}) {
    const e = new In({
      container: r.container || document.body,
      fps: r.fps || 60,
      theme: void 0,
      // set after component init
      bloomStrength: r.bloomStrength,
      bloomRadius: r.bloomRadius,
      bloomThreshold: r.bloomThreshold
    });
    let t;
    if (r.preset) {
      t = Ys[r.preset] || Ys.lite;
    } else if (r.components) {
      t = r.components;
    } else {
      t = Ys.lite;
    }
    for (const i of t) {
      const n = xl[i];
      if (n) {
        const s = r[i] || {};
        e.addComponent(new n(s));
      } else {
        console.warn(`ChimeraFX: Unknown component "${i}"`);
      }
    }
    if (r.theme) {
      const i = typeof r.theme === "string" ? qs[r.theme] : r.theme;
      if (i) e.setTheme(i);
    }
    e.start();
    return e;
  }
  var qh = {
    // Factory
    create: om,
    // Classes (for advanced usage)
    Engine: In,
    StateMachine: Ln,
    // Components
    ParticleNebula: Dn,
    ShapableMatter: oi,
    EnergyTendrils: Un,
    DataRivers: Nn,
    VolumetricLight: On,
    LiquidMetal: Fn,
    ReactionDiffusion: Bn,
    VoronoiShatter: Hn,
    HoloHUD: zn,
    EnergyBeams: kn,
    IridescentOrb: Vn,
    // Themes
    themes: qs,
    CyberpunkNeon: sl,
    OrganicBioluminescent: al,
    QuantumVoid: ol,
    HolographicMatrix: ll,
    ChimeraNative: cl,
    MidnightTrading: hl,
    NeonSamurai: ul,
    DeepOcean: dl,
    SolarFlare: pl,
    VoidWalker: ml,
    CrystalMatrix: fl,
    AuroraBorealis: gl,
    ObsidianForge: vl,
    OrchidVapor: _l,
    TidalGlass: yl,
    // Presets
    presets: Ys,
    // Component registry (extensible)
    components: xl,
    // Register custom component
    registerComponent(r, e) {
      xl[r] = e;
    },
    // Register custom theme
    registerTheme(r, e) {
      qs[r] = e;
    },
    // Version
    version: "1.0.1",
    // Shim: Engine.setTheme looks for ChimeraFX._themes
    _themes: qs,
    // Matter mode routing to active ShapableMatter component
    setMatterMode(r) {
      const e = window._chimeraFX;
      if (!e) {
        console.warn("[ChimeraFX] setMatterMode: engine not ready");
        return;
      }
      const t = e.components.map((n) => n.constructor.name);
      console.log("[ChimeraFX] setMatterMode:", r, "| components:", t);
      const i = e.components.find((n) => n.constructor.name === "ShapableMatter");
      if (i && typeof i.setMatterMode === "function") {
        i.setMatterMode(r);
        console.log("[ChimeraFX] setMatterMode:", r, "\u2014 ShapableMatter found, mode applied");
      } else {
        console.warn("[ChimeraFX] setMatterMode:", r, "\u2014 ShapableMatter not found in components:", t);
        const n = e.components.find((s) => s.constructor?.prototype?.setMatterMode);
        if (n) {
          console.log("[ChimeraFX] setMatterMode: found by prototype fallback");
          n.setMatterMode(r);
        }
      }
    },
    // Get current matter mode
    getMatterMode() {
      const r = window._chimeraFX;
      if (!r) return "nebula";
      const e = r.components.find((t) => t.constructor.name === "ShapableMatter");
      return e?.getMatterMode?.() || "nebula";
    }
  };
  window.ChimeraFX = { ...window.ChimeraFX || {}, ...qh };
  var Je = qh;

  // assets/familiar/chimera-fx/mobile-scene.js
  var Zs = (r) => {
    for (const e of ["BackgroundBridge", "FamiliarBridge", "IntroBridge"]) {
      try {
        window[e]?.postMessage(r);
      } catch (t) {
      }
    }
  };
  var Gt = document.body?.dataset.sceneMode || window.MIND_RECIPE_SCENE_MODE || "pulse";
  var Si = document.getElementById("stage") || document.body;
  var lm = 30;
  var me = null;
  var Ei = "chimera-native";
  var Wi = "mindrecipe-core";
  var Gn = 17;
  var it = {};
  var _r = null;
  var Ml = "";
  var Ks = {
    "mindrecipe-core": {
      components: ["nebula", "tendrils", "hud", "matter"],
      matter: "cellular"
    },
    "neon-circuit": {
      components: ["rivers", "beams", "hud", "matter"],
      matter: "electric"
    },
    "bioluminescent": {
      components: ["nebula", "volumetric", "matter"],
      matter: "cellular"
    },
    "quantum-void": {
      components: ["nebula", "voronoi", "matter"],
      matter: "photonic"
    },
    "holographic-matrix": {
      components: ["hud", "rivers", "volumetric", "matter"],
      matter: "electric"
    },
    "midnight-signal": {
      components: ["rivers", "tendrils", "matter"],
      matter: "ionstorm"
    },
    "neon-ronin": {
      components: ["tendrils", "metal", "matter"],
      matter: "plasma"
    },
    "abyssal-current": {
      components: ["volumetric", "rivers", "matter"],
      matter: "superfluid"
    },
    "solar-flare": {
      components: ["volumetric", "reaction", "matter"],
      matter: "plasma"
    },
    "void-walker": {
      components: ["metal", "nebula", "matter"],
      matter: "ionstorm"
    },
    "crystal-matrix": {
      components: ["metal", "hud", "matter"],
      matter: "crystalline"
    },
    "aurora": {
      components: ["nebula", "tendrils", "reaction", "matter"],
      matter: "aerogel"
    },
    "obsidian-forge": {
      components: ["metal", "volumetric", "matter"],
      matter: "ferrofluid"
    },
    "orchid-vapor": {
      components: ["reaction", "tendrils", "hud", "matter"],
      matter: "fluid"
    },
    "tidal-glass": {
      components: ["rivers", "reaction", "matter"],
      matter: "superfluid"
    }
  };
  function Yh(r) {
    return Ks[r] ? r : "mindrecipe-core";
  }
  var cm = [
    ["nebula", Je.ParticleNebula],
    ["tendrils", Je.EnergyTendrils],
    ["rivers", Je.DataRivers],
    ["volumetric", Je.VolumetricLight],
    ["metal", Je.LiquidMetal],
    ["reaction", Je.ReactionDiffusion],
    ["voronoi", Je.VoronoiShatter],
    ["hud", Je.HoloHUD],
    ["beams", Je.EnergyBeams],
    ["matter", Je.ShapableMatter]
  ];
  function hm(r) {
    return cm.find(([, e]) => r instanceof e)?.[0] || "unknown";
  }
  var Xi = class {
    constructor(e = 17) {
      this.seed = Number(e) || 17;
      this.group = new fi();
      this.core = null;
      this.shell = null;
      this.rings = [];
      this.petals = [];
      this.light = null;
      this.evolution = { growth: 0, complexity: 0, activation: 0.35, valence: 0 };
    }
    init(e) {
      const t = (o) => {
        const l = Math.sin((this.seed + o * 7919) * 12.9898) * 43758.5453;
        return l - Math.floor(l);
      };
      const i = e.theme || Je.themes["chimera-native"];
      const n = i.colors.primary.clone();
      const s = i.colors.secondary.clone();
      const a = new Sn(4.25, 4);
      this.core = new De(a, new Os({
        color: n,
        emissive: n.clone().multiplyScalar(0.32),
        emissiveIntensity: 1.5,
        metalness: 0.25,
        roughness: 0.22,
        clearcoat: 0.9,
        clearcoatRoughness: 0.18,
        transparent: true,
        opacity: 0.98
      }));
      this.core.renderOrder = 8;
      this.shell = new De(new Sn(4.72, 2), new zt({
        color: s,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        blending: Ve,
        depthWrite: false
      }));
      this.shell.renderOrder = 9;
      this.group.add(this.core, this.shell);
      for (let o = 0; o < 5; o += 1) {
        const l = new De(new fr(5.25 + o * 0.34, 0.055 + o * 0.01, 8, 96), new zt({
          color: o % 2 ? s : n,
          transparent: true,
          opacity: 0.42,
          blending: Ve,
          depthWrite: false
        }));
        l.rotation.set(t(o) * Math.PI, t(o + 13) * Math.PI, t(o + 29) * Math.PI);
        l.userData.baseRotation = l.rotation.clone();
        l.renderOrder = 10;
        this.rings.push(l);
        this.group.add(l);
      }
      for (let o = 0; o < 8; o += 1) {
        const l = new De(new mr(0.42 + t(o + 50) * 0.26, 1), new gr({
          color: o % 2 ? s : n,
          emissive: n.clone(),
          emissiveIntensity: 1.2,
          metalness: 0.45,
          roughness: 0.28,
          transparent: true,
          opacity: 0.92
        }));
        const c = o / 8 * Math.PI * 2;
        const h = 6.2 + t(o + 70) * 1.7;
        l.position.set(Math.cos(c) * h, Math.sin(c) * h * 0.58, (t(o + 90) - 0.5) * 3);
        l.userData.theta = c;
        l.userData.radius = h;
        l.userData.offset = t(o + 110) * Math.PI * 2;
        l.visible = false;
        l.renderOrder = 11;
        this.petals.push(l);
        this.group.add(l);
      }
      this.light = new Fs(n, 8, 38, 2);
      this.group.add(this.light);
      e.scene.add(this.group);
      this.onThemeChange(i);
    }
    onThemeChange(e) {
      const t = e.colors.primary;
      const i = e.colors.secondary;
      this.core?.material.color.copy(t);
      this.core?.material.emissive.copy(t).multiplyScalar(0.32);
      this.shell?.material.color.copy(i);
      this.rings.forEach((n, s) => n.material.color.copy(s % 2 ? i : t));
      this.petals.forEach((n, s) => {
        const a = s % 2 ? i : t;
        n.material.color.copy(a);
        n.material.emissive.copy(a);
      });
      if (this.light) this.light.color.copy(t);
    }
    setEvolution(e) {
      this.evolution = { ...this.evolution, ...e };
    }
    update({ elapsed: e, intensity: t }) {
      const { growth: i, complexity: n, activation: s, valence: a } = this.evolution;
      const o = 1 + Math.sin(e * (1.15 + s * 1.8)) * (0.035 + s * 0.055);
      const l = (1 + i * 0.24 + n * 0.17) * o;
      this.group.scale.setScalar(l);
      this.group.rotation.y = e * (0.12 + s * 0.22);
      this.group.rotation.x = Math.sin(e * 0.21) * 0.13;
      this.core.rotation.y = -e * (0.16 + n * 0.3);
      this.shell.rotation.set(e * 0.11, -e * 0.15, e * 0.08);
      this.core.material.emissiveIntensity = 1.05 + s * 1.8 + Math.max(0, a) * 0.45;
      this.shell.material.opacity = 0.18 + n * 0.38;
      this.light.intensity = 4 + s * 11;
      this.rings.forEach((c, h) => {
        const u = c.userData.baseRotation;
        c.rotation.x = u.x + e * (0.12 + h * 0.026);
        c.rotation.y = u.y + e * (0.08 + s * 0.14);
        c.material.opacity = 0.18 + n * 0.32 + t * 0.12;
        c.scale.setScalar(1 + Math.sin(e * 1.1 + h) * 0.025);
      });
      this.petals.forEach((c, h) => {
        const u = i >= 0.16 + h * 0.085 || n >= 0.46 + h * 0.055;
        c.visible = u;
        if (!u) return;
        const d = c.userData.theta + e * (0.24 + s * 0.36) * (h % 2 ? 1 : -1);
        const p = c.userData.radius + Math.sin(e * 1.7 + c.userData.offset) * (0.3 + s * 0.4);
        c.position.set(Math.cos(d) * p, Math.sin(d) * p * 0.58, Math.sin(e * 0.8 + h) * 2.1);
        c.rotation.set(e * 0.8, e * 0.5 + h, e * 0.6);
        c.scale.setScalar(0.72 + i * 0.55 + n * 0.35);
      });
    }
    dispose() {
      this.group.parent?.remove(this.group);
      this.group.traverse((e) => {
        e.geometry?.dispose?.();
        e.material?.dispose?.();
      });
    }
  };
  function um(r, e) {
    const t = Math.random;
    let i = Number(r) >>> 0 || 17;
    Math.random = () => {
      i = i * 1664525 + 1013904223 >>> 0;
      return i / 4294967296;
    };
    try {
      return e();
    } finally {
      Math.random = t;
    }
  }
  function dm(r) {
    if (r === "background") {
      const e = Ks[Wi];
      return {
        container: Si,
        // The factory starts immediately. Delay its first frame until the
        // render-target capability check below has selected a safe pipeline.
        fps: 1e-3,
        theme: Ei,
        components: e.components,
        matter: { mode: e.matter }
      };
    }
    return {
      container: Si,
      fps: 1e-3,
      theme: Ei,
      // The mobile-safe geometry orb is added after the engine starts.
      // Avoid creating the unsupported ray-marched shader orb on this route.
      // Pulse is deliberately sparse so the shared evolving familiar remains
      // the focal object instead of being hidden behind background components.
      components: ["nebula"],
      nebula: { count: 720, spread: 35 }
    };
  }
  function Js() {
    if (!me || me.disposed) return false;
    const r = Si.clientWidth;
    const e = Si.clientHeight;
    if (r < 2 || e < 2) return false;
    const t = me.renderer?.domElement;
    const i = me.renderer?.getPixelRatio?.() || 1;
    const n = Math.floor(r * i);
    const s = Math.floor(e * i);
    if (t?.width !== n || t?.height !== s) {
      me._resize();
      me.renderOnce?.();
      setTimeout(bl, 80);
    }
    return Boolean(t?.width && t?.height);
  }
  function pm() {
    if (_r || typeof ResizeObserver === "undefined") return;
    _r = new ResizeObserver(() => Js());
    _r.observe(Si);
  }
  function bl() {
    if (!me || me.disposed) return;
    const r = me.renderer?.domElement;
    const e = me.renderer?.getContext?.();
    const t = me.components || [];
    const i = t.find((a) => a instanceof Xi);
    const n = t.find(
      (a) => a instanceof Je.ShapableMatter
    );
    const s = [
      `theme=${Ei}`,
      `composition=${Gt === "background" ? Wi : "pulse-familiar"}`,
      `canvas=${r?.width || 0}x${r?.height || 0}`,
      `host=${Si.clientWidth}x${Si.clientHeight}`,
      `components=${t.map(hm).join(",") || "none"}`,
      `matter=${n?.getMatterMode?.() || "none"}`,
      `familiar=${Boolean(i && i.core?.visible !== false && i.group?.visible !== false)}`,
      `running=${Boolean(me.running)}`,
      `reducedMotion=${Boolean(me.reducedMotion)}`,
      `pipeline=${me.renderPipeline || "unknown"}`,
      `frame=${me.renderer?.info?.render?.frame || 0}`,
      `calls=${me.renderer?.info?.render?.calls || 0}`,
      `programs=${me.renderer?.info?.programs?.length || 0}`,
      `gl=${e?.getError?.() ?? -1}`
    ].join(" ");
    if (s === Ml) return;
    Ml = s;
    console.info(`[MindRecipe FX] ${s}`);
    Zs(`health:${s}`);
  }
  function mm() {
    const r = me?.renderer;
    const e = me?.composer;
    const t = r?.getContext?.();
    if (!r || !e || !t) return "unavailable";
    const i = [
      e.renderTarget1,
      e.renderTarget2,
      me.bloomPass?.renderTargetBright,
      ...me.bloomPass?.renderTargetsHorizontal || [],
      ...me.bloomPass?.renderTargetsVertical || []
    ].filter(Boolean);
    let n = true;
    for (const s of i) {
      r.setRenderTarget(s);
      if (t.checkFramebufferStatus(t.FRAMEBUFFER) !== t.FRAMEBUFFER_COMPLETE) {
        n = false;
        break;
      }
    }
    r.setRenderTarget(null);
    if (!n) {
      e.render = () => {
        r.setRenderTarget(null);
        r.render(me.scene, me.camera);
      };
    }
    me.frameInterval = 1e3 / lm;
    me.lastFrame = 0;
    me.renderPipeline = n ? "composer" : "direct-webgl";
    return me.renderPipeline;
  }
  function fm() {
    const r = me?.renderer?.domElement;
    if (!r) return;
    r.style.mixBlendMode = Gt === "background" ? "screen" : "normal";
    r.style.opacity = Gt === "background" ? ".78" : "1";
    r.style.zIndex = "1";
    me.renderer.setClearColor(0, Gt === "background" ? 0 : 1);
  }
  function Zh() {
    const r = me?.theme?.colors?.background;
    if (!r) return;
    const e = `#${r.getHexString()}`;
    document.documentElement.style.background = e;
    document.body.style.background = e;
    Si.style.background = e;
  }
  function gm() {
    me?.renderer?.domElement?.addEventListener("webglcontextlost", (r) => {
      r.preventDefault();
      Zs("context_lost");
    });
  }
  function vm() {
    me = um(Gn, () => Je.create(dm(Gt)));
    window._mindRecipeFX = me;
    mm();
    if (Gt === "pulse") me.addComponent(new Xi(Gn));
    if (Gt === "background") {
      const r = me.components?.find(
        (e) => e instanceof Je.ShapableMatter
      );
      r?.setMatterMode?.(Ks[Wi].matter);
    }
    fm();
    Zh();
    gm();
    pm();
    Js();
    me.renderer.compile(me.scene, me.camera);
    me.renderOnce?.();
    [0, 60, 180, 420, 900].forEach((r) => setTimeout(Js, r));
    setTimeout(bl, 750);
  }
  function Jh(r) {
    const e = Number(r);
    return Number.isFinite(e) && e !== 0 ? Math.abs(Math.trunc(e)) : 17;
  }
  function _m() {
    const r = Ks[Wi];
    me.setComponentPreset(r.components);
    me.setTheme(Je.themes[Ei]);
    const e = me.components?.find(
      (t) => t instanceof Je.ShapableMatter
    );
    e?.setMatterMode?.(r.matter);
    me.renderer.compile(me.scene, me.camera);
  }
  function ym(r) {
    me.setTheme(Je.themes[Ei]);
    if (!r) return;
    const e = me.components?.find((t) => t instanceof Xi);
    if (e) me.removeComponent(e);
    me.addComponent(new Xi(Gn));
    me.renderer.compile(me.scene, me.camera);
  }
  function $s(r = {}) {
    it = { ...it, ...r };
    if (!me) return;
    const e = Je.themes[it.theme] ? it.theme : "chimera-native";
    const t = Yh(it.variant);
    const i = Jh(it.seed);
    const n = e !== Ei;
    const s = Gt === "background" && t !== Wi;
    const a = Gt === "pulse" && i !== Gn;
    Ei = e;
    Wi = t;
    Gn = i;
    if (Gt === "background" && (n || s)) {
      _m();
    } else if (Gt === "pulse" && (n || a)) {
      ym(a);
    }
    Zh();
    Js();
    const o = Math.max(0, Math.min(1, Number(it.growth ?? it.progress ?? 0)));
    const l = Math.max(0, Math.min(1, Number(it.complexity ?? o)));
    const c = Math.max(0, Math.min(1, Number(it.activation ?? it.intensity ?? 0.35)));
    const h = Math.max(-1, Math.min(1, Number(it.valence ?? 0)));
    me.setState(c > 0.74 ? "thinking" : o > 0.68 ? "success" : l > 0.34 ? "streaming" : "idle");
    const u = me.components || [];
    u.find((f) => f instanceof Xi)?.setEvolution({ growth: o, complexity: l, activation: c, valence: h });
    const d = u.find(
      (f) => f instanceof Je.EnergyTendrils
    );
    d?.meshes?.forEach(({ line: f }, v) => {
      f.visible = v < 2 + Math.ceil(l * 3);
      f.scale.setScalar(0.78 + o * 0.3);
    });
    const p = u.find(
      (f) => f instanceof Je.DataRivers
    );
    p?.rivers?.forEach(({ mesh: f }, v) => {
      f.visible = v < 1 + Math.ceil(l * 2);
    });
    if (o >= 0.8 && it._lastMilestone !== o) {
      me.pulse("success");
      it._lastMilestone = o;
    }
    me.renderOnce?.();
    Ml = "";
    setTimeout(bl, 250);
  }
  function xm() {
    try {
      Ei = Je.themes[it.theme] ? it.theme : "chimera-native";
      Wi = Yh(it.variant);
      Gn = Jh(it.seed);
      vm();
      $s(it);
      Zs("ready");
    } catch (r) {
      Zs(`shader_error:${String(r?.message || r).slice(0, 100)}`);
    }
  }
  window.setBackgroundState = $s;
  window.setFamiliarState = $s;
  window.setIntroVariant = (r) => $s({
    seed: Number(r || 0) + 17,
    growth: 0.08,
    complexity: 0.12,
    activation: 0.45,
    theme: "chimera-native"
  });
  window.setBackgroundPaused = (r) => {
    r ? me?._pause() : me?._resume();
  };
  window.setFamiliarPaused = (r) => r ? me?._pause() : me?._resume();
  window.disposeMindRecipeScene = () => {
    _r?.disconnect();
    _r = null;
    me?.dispose();
    me = null;
    window._mindRecipeFX = null;
  };
  xm();
})();
/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
