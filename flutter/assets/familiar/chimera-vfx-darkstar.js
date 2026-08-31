/**
 * Chimera VFX v4 — Something Big on the Other Side
 * Dark aquarium glass: green particle swarm + massive creature shadows
 * moving behind translucent panels. Textured, alive, unsettling.
 */
const ChimeraVFX = (() => {
    let gl, glCanvas, program, ctx2d, partCanvas;
    let time = 0, animId = null, enabled = true, paused = false;
    let mouseX = 0.5, mouseY = 0.5;
    let coreIntensity = 0.25, coreTarget = 0.25;
    let pulseFlash = 0;
    let ripples = [], particles = [];
    const MAX_RIPPLES = 6, PARTICLE_COUNT = 140;
    let _ulocs = null, _lastFrame = 0, _frameCount = 0;
    let aiIntensity = 0, aiTarget = 0, holoPhase = 0;
    let visualVariant = 0;

    // ── Text-to-matter system ──
    let textCanvas = null, textCtx = null, textTexture = null;
    let textContent = '', textDirty = false, textAlpha = 0, textAlphaTarget = 0;
    // Text texture matches the GL canvas pixel dimensions for 1:1 mapping
    let TEXT_W = 2048, TEXT_H = 1024;

    // Colors
    // Mind Recipe mark: sea-glass highlight, deep teal, brushed silver.
    let C1 = [0.6588, 0.8157, 0.7920], C2 = [0.1106, 0.5176, 0.4796], C3 = [0.8020, 0.8139, 0.8176];
    let _colorProbe = null, _colorCache = {};

    function cssToRGB(c) {
        if (_colorCache[c]) return _colorCache[c];
        if (!_colorProbe) { _colorProbe = document.createElement('div'); _colorProbe.style.cssText = 'position:absolute;visibility:hidden;'; document.body.appendChild(_colorProbe); }
        _colorProbe.style.color = c;
        const m = getComputedStyle(_colorProbe).color.match(/(\d+)/g);
        const v = m ? [+m[0]/255, +m[1]/255, +m[2]/255] : [0, 0.8, 1];
        _colorCache[c] = v; return v;
    }
    function resolveColors() {
        try {
            const s = getComputedStyle(document.documentElement);
            const p = s.getPropertyValue('--primary-neon').trim();
            const g = s.getPropertyValue('--success-neon').trim();
            const sc = s.getPropertyValue('--secondary-neon').trim();
            if (p) C1 = cssToRGB(p); if (g) C2 = cssToRGB(g); if (sc) C3 = cssToRGB(sc);
        } catch(e) {}
    }

    // ═══════════════════════════════════════════
    // SHADER — Scales + veins + CREATURE SHADOWS + depth
    // ═══════════════════════════════════════════
    const VERT = `#version 300 es
    in vec2 a_pos; out vec2 v_uv;
    void main() { v_uv = a_pos*0.5+0.5; gl_Position = vec4(a_pos,0,1); }`;

    const FRAG = `#version 300 es
    precision highp float;
    in vec2 v_uv; out vec4 fragColor;
    uniform float u_time, u_core, u_pulse;
    uniform vec2 u_resolution, u_mouse;
    uniform vec3 u_c1, u_c2, u_c3;
    uniform vec4 u_ripples[6];
    uniform int u_ripple_count;
    uniform float u_ai_intensity;   // 0=idle, 0.5=thinking, 1.0=executing
    uniform float u_variant;        // background composition 0..11
    uniform float u_holo_phase;     // animated phase for holographic sweep
    uniform sampler2D u_text_tex;   // text rendered as white-on-black density mask
    uniform float u_text_alpha;     // 0=no text, 1=full text formation

    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    vec2 hash2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.1;a*=.5;}return v;}

    // Voronoi for scale texture
    float voroEdge(vec2 p){
        vec2 n=floor(p),f=fract(p);float md=8.,md2=8.;
        for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){
            vec2 g=vec2(float(i),float(j)),o=hash2(n+g);
            o=.5+.5*sin(u_time*.02+6.283*o);
            float d=length(g+o-f);
            if(d<md){md2=md;md=d;}else if(d<md2){md2=d;}
        }
        return md2-md;
    }

    // ── CREATURE SHADOWS: massive aquatic bodies swimming behind the glass ──
    float creature(vec2 st, float t) {
        float body = 0.0;

        // Creature 1: huge, slow — like a whale passing
        // Sinusoidal path with body undulation
        float c1Phase = t * 0.04;
        vec2 c1Pos = vec2(
            mod(c1Phase + 0.3, 2.4) - 0.5,
            0.5 + sin(c1Phase * 2.5) * 0.18
        );
        // Body shape: elongated with tail-like taper
        vec2 c1Off = st - c1Pos;
        // Undulating body warp (S-curve like a swimming snake)
        c1Off.y += sin(c1Off.x * 4.0 + t * 0.3) * 0.04;
        float c1 = fbm(c1Off * 1.2 + t * 0.02);
        c1 = smoothstep(0.32, 0.52, c1);
        float c1Mask = smoothstep(0.6, 0.05, length(c1Off * vec2(0.45, 1.3)));
        body += c1 * c1Mask;

        // Creature 2: medium, opposite direction
        float c2Phase = -t * 0.035;
        vec2 c2Pos = vec2(
            mod(c2Phase + 1.8, 2.4) - 0.5,
            0.35 + sin(c2Phase * 3.0 + 2.0) * 0.14
        );
        vec2 c2Off = st - c2Pos;
        c2Off.y += sin(c2Off.x * 5.0 - t * 0.25) * 0.035;
        float c2 = fbm(c2Off * 1.8 - t * 0.015);
        c2 = smoothstep(0.35, 0.52, c2);
        float c2Mask = smoothstep(0.45, 0.04, length(c2Off * vec2(0.5, 1.1)));
        body += c2 * c2Mask * 0.7;

        // Creature 3: deep background, very large and slow (barely visible)
        float c3Phase = t * 0.02;
        vec2 c3Pos = vec2(
            0.5 + sin(c3Phase) * 0.6,
            0.6 + cos(c3Phase * 0.7) * 0.25
        );
        vec2 c3Off = st - c3Pos;
        c3Off.y += sin(c3Off.x * 3.0 + t * 0.15) * 0.05;
        float c3 = fbm(c3Off * 0.8 + t * 0.01);
        c3 = smoothstep(0.30, 0.50, c3);
        float c3Mask = smoothstep(0.8, 0.1, length(c3Off * vec2(0.35, 0.8)));
        body += c3 * c3Mask * 0.4;

        return min(body, 1.0);
    }

    // ── HOLOGRAPHIC FUNCTIONS ──
    vec3 holoIridescence(float angle, float intensity) {
        // Thin-film interference: viewing angle → spectral rainbow
        vec3 phase = vec3(0.0, 0.33, 0.67);
        return 0.5 + 0.5 * cos(6.28318 * (angle * 2.0 + phase)) * intensity;
    }

    float holoScanLine(vec2 uv, float t, float speed, float density) {
        // Sweeping horizontal holographic scan bar
        float scanY = fract(t * speed);
        float dist = abs(uv.y - scanY);
        return smoothstep(0.015, 0.0, dist) * 0.4;
    }

    float holoGrid(vec2 uv, float gridSize, float t) {
        // Subtle holographic grid with pulsing intersections
        vec2 grid = abs(fract(uv * gridSize) - 0.5);
        float gridLine = smoothstep(0.02, 0.0, min(grid.x, grid.y));
        float intersection = smoothstep(0.02, 0.0, grid.x) * smoothstep(0.02, 0.0, grid.y);
        float pulse = intersection * (0.5 + 0.5 * sin(t * 2.0 + uv.x * 50.0));
        return gridLine * 0.01 + pulse * 0.06;
    }

    float dataStream(vec2 st, float t) {
        // Falling data streams (Matrix-like) that activate during AI output
        float stream = 0.0;
        for (int i = 0; i < 6; i++) {
            float fi = float(i);
            float x = hash(vec2(fi * 73.1, 0.0)) * 2.0; // random x position
            float speed = 0.3 + hash(vec2(fi, 31.0)) * 0.5;
            float col = fract(st.y * 8.0 - t * speed + fi * 0.5);
            float xDist = abs(st.x - x);
            stream += step(0.97, col) * smoothstep(0.02, 0.0, xDist) * 0.3;
        }
        return stream;
    }

    void main() {
        vec2 uv = v_uv;
        float ar = u_resolution.x / u_resolution.y;
        vec2 st = uv * vec2(ar, 1.0);
        float t = u_time;
        float variant = floor(mod(u_variant, 12.0));
        float angle = (variant - 5.5) * 0.055;
        mat2 variantRotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        st = variantRotation * (st - vec2(ar * .5, .5)) + vec2(ar * .5, .5);

        // ── 1. SCALE TEXTURE (voronoi) ──
        float scaleDensity = 6.0 + mod(variant, 5.0) * 2.25;
        float scaleEdge = voroEdge(st * scaleDensity);
        float scales = smoothstep(0.02, 0.06, scaleEdge) * 0.08;

        // ── 2. GREEN SCALAR MASS (large aquatic creature swimming) ──
        // Slow undulating displacement — the mass itself moves like a body
        vec2 swim = vec2(
            sin(t * 0.15) * 0.08 + sin(t * 0.07) * 0.05,
            cos(t * 0.12) * 0.06 + cos(t * 0.05) * 0.04
        );
        // The mass warps and flows as it "swims"
        vec2 q = vec2(fbm(st*1.5 + swim + t*.02), fbm(st*1.5 + vec2(3.7,8.2) + swim*0.7 + t*.018));
        vec2 r2 = vec2(fbm(st*1.5 + q*2.0 + t*.008), fbm(st*1.5 + q + vec2(2.8,4.1) + t*.012));
        float massField = fbm(st*1.5 + r2*1.5 + swim*0.5);

        // Every background choice changes the field composition, rather than
        // merely renaming or recoloring the same animation.
        float bands = .5 + .5 * sin((st.x * (3.0 + mod(variant, 4.0)) +
            st.y * (1.0 + mod(variant, 3.0)) + t * .11) * 6.28318);
        float radial = 1.0 - smoothstep(.05, .62,
            abs(length(st - vec2(ar * .5, .5)) - (.16 + .08 * sin(t * .16))));
        float lattice = max(
            smoothstep(.475, .5, abs(sin(st.x * (12.0 + variant)))),
            smoothstep(.475, .5, abs(sin(st.y * (12.0 + variant)))));
        if (variant == 1.0) massField = mix(massField, fbm(st * 2.2 - t * .025), .50);
        else if (variant == 2.0) massField = mix(massField, bands, .62);
        else if (variant == 3.0) massField = mix(massField, pow(abs(sin((massField + st.y) * 12.0)), 3.0), .52);
        else if (variant == 4.0) massField = mix(massField, radial, .68);
        else if (variant == 5.0) massField = mix(massField, lattice, .58);
        else if (variant == 6.0) massField *= .32;
        else if (variant == 7.0) massField = mix(massField, abs(sin(atan(st.y-.5, st.x-ar*.5)*7.0+t*.1)), .46);
        else if (variant == 8.0) massField = mix(massField, smoothstep(.38,.72,bands + fbm(st*1.2)*.45), .58);
        else if (variant == 9.0) massField = mix(massField, pow(fbm(st*3.4-vec2(0,t*.04)), 2.2), .55);
        else if (variant == 10.0) massField = mix(massField, fbm(st*1.05+vec2(t*.018,-t*.012)), .62);
        else if (variant == 11.0) massField = mix(massField, fbm(st*2.0+r2*.8-t*.012), .50);

        // The mass: broad, wavy — like watching a huge body undulate
        float mass = pow(massField, 1.2) * 2.5;
        // Brighter ridges within (like light catching the creature's back)
        float veins = smoothstep(0.44, 0.54, massField) * 0.9;
        // Deep layer moves independently (different part of the body)
        vec2 deepSwim = vec2(sin(t*0.09)*0.06, cos(t*0.11)*0.05);
        float deepLayer = pow(fbm(st*2.5 + deepSwim - t*.01 + vec2(5.,2.)), 1.3) * 1.5;

        // Smooth pulsation — slow breathing, not a heartbeat flash
        float breathe = 0.88 + 0.12 * sin(t * 0.3);
        float breathe2 = 0.85 + 0.15 * sin(t * 0.22 + 1.5);
        mass *= breathe;
        veins *= breathe2;

        // ── 3. CREATURE SHADOWS ──
        float creatureShadow = creature(st / vec2(ar, 1.0), t);

        // ── 4. DEPTH FOG (murky green, thicker at edges) ──
        float fog = fbm(st * 1.0 + t * 0.01) * 0.15;

        // ── 5. CORE GLOW ──
        vec2 coreP = vec2(0.5*ar, -0.05);
        float coreDist = length(st - coreP);
        float core = exp(-coreDist*2.0) * u_core;
        core *= 0.7+0.3*noise(st*5.+t*2.);
        core += u_pulse * exp(-coreDist*2.5);

        // ── 6. MOUSE AWARENESS ──
        float mDist = distance(st, u_mouse*vec2(ar,1.));
        float mGlow = exp(-mDist*5.) * 0.06;

        // ── 7. RIPPLES ──
        float ripple = 0.;
        for(int i=0;i<6;i++){
            if(i>=u_ripple_count) break;
            vec4 rp=u_ripples[i]; float age=u_time-rp.z;
            if(age>3.) continue;
            float d=distance(st,rp.xy*vec2(ar,1.));
            ripple += exp(-pow((d-age*.25)*7.,2.)) * exp(-age*1.3) * rp.w * 0.35;
        }

        // ── COMPOSE ──
        vec3 col = vec3(0.);

        // Base: very dark with faint scale texture
        col += vec3(0.012, 0.018, 0.019) * (1. + scales * 4.);

        // Scale edges: dim green outline
        col += u_c2 * 0.06 * scaleEdge * smoothstep(0.06, 0.02, scaleEdge);

        // ── THE GREEN MASS: dominant flowing scalar field ──
        col += u_c2 * mass * 0.35;         // broad wavy green mass (the main visual)
        col += u_c2 * veins * 0.8;         // brighter veins within the mass
        col += u_c1 * deepLayer * 0.2;     // cyan accent depth layer
        col += u_c2 * fog * 0.6;           // green fog fills remaining space

        // Creature shadows: massive dark shapes swimming through the green mass
        float creatureEdge = smoothstep(0.01, 0.12, creatureShadow) - smoothstep(0.12, 0.45, creatureShadow);
        col *= (1.0 - creatureShadow * 0.5); // creature darkens the green mass as it passes
        col += u_c2 * creatureEdge * 0.25;   // bioluminescent edge outline
        col += u_c1 * creatureShadow * 0.03;  // faint internal glow

        // Core is drawn from the mark's sea-glass and silver, never orange.
        col += mix(u_c1, u_c3, 0.42) * core * 1.15;

        // Mouse awareness
        col += u_c2 * mGlow * 1.5;

        // Ripple: green flash through the mass
        col += mix(u_c2, u_c3, 0.46) * ripple;

        // Ambient green floor (never fully black)
        col += u_c2 * 0.006;

        // Slow undulating brightness — like light filtering through water
        col *= 0.92 + 0.08 * sin(t * 0.18 + st.x * 0.5) * sin(t * 0.13 + st.y * 0.7);

        // Deep vignette
        float vig = 1.-dot((uv-.5)*1.05,(uv-.5)*1.05);
        col *= clamp(vig*vig, 0., 1.);

        // Scanline (original)
        col *= 0.97+0.03*sin(uv.y*u_resolution.y*0.35+t*3.);

        // ══════════════════════════════════════════════════
        // GREEN MATTER TEXT FORMATION
        // The green mass physically morphs into letter shapes
        // ══════════════════════════════════════════════════
        float textMask = texture(u_text_tex, uv).r;
        float tAlpha = u_text_alpha;

        if (tAlpha > 0.01) {
            // ── Direct text sampling — NO warp, crisp pixel-perfect letters ──
            float organicText = texture(u_text_tex, uv).r * tAlpha;

            // ═══════════════════════════════════════════════════
            // THE GREEN LIQUID MATTER FORMS INTO WORDS
            // Empty areas go pitch black. ALL matter flows into letters.
            // Letters have the SAME fbm/vein/creature texture as the background.
            // ═══════════════════════════════════════════════════

            // Hard edge — binary letter shapes, no blur
            float letterBody = step(0.1, organicText);
            float emptyArea = 1.0 - letterBody;

            // EVACUATE: non-text areas go to near-total darkness
            col *= (1.0 - tAlpha * emptyArea * 0.97);

            // RECONCENTRATE: rebuild the green mass INSIDE the letter shapes
            // Use the same domain-warped fbm as the original mass above
            vec2 lSwim = vec2(sin(t * 0.12) * 0.06, cos(t * 0.1) * 0.05);
            vec2 lq = vec2(fbm(st*1.5 + lSwim + t*0.02), fbm(st*1.5 + vec2(3.7,8.2) + lSwim*0.7 + t*0.018));
            vec2 lr = vec2(fbm(st*1.5 + lq*2.0 + t*0.008), fbm(st*1.5 + lq + vec2(2.8,4.1) + t*0.012));
            float lMass = fbm(st*1.5 + lr*1.5 + lSwim*0.5);
            float lVeins = smoothstep(0.42, 0.54, lMass);
            float lDeep = pow(fbm(st*2.5 + vec2(sin(t*0.09)*0.06, cos(t*0.11)*0.05) - t*0.01 + vec2(5.,2.)), 1.3);

            // SOLID green matter fills letters — shape comes first, texture is accent
            // Strong solid base: READABLE letter shapes
            col += u_c2 * letterBody * 2.0;
            col += u_c1 * letterBody * 0.5;
            // Subtle organic texture accent (NOT enough to break readability)
            col += u_c2 * letterBody * lVeins * 0.4;
            col += u_c1 * letterBody * lDeep * 0.15;

            // Very faint creature shadow — just enough to show life, not enough to break text
            float lCreature = fbm(st * 0.8 + vec2(t * 0.04, t * 0.03));
            float lcShadow = smoothstep(0.3, 0.55, lCreature) * letterBody;
            col *= (1.0 - lcShadow * 0.1);

            // Edge glow — tight bioluminescent border of the letters
            float tEdge = smoothstep(0.1, 0.15, organicText) - smoothstep(0.15, 0.22, organicText);
            col += u_c1 * tEdge * 1.5;

            // Breathing
            col *= 0.9 + 0.1 * sin(t * 0.3 + uv.y * 2.0);

            // Sparkle
            float sparkle = pow(noise(st * 60.0 + t * 4.0), 4.0) * letterBody;
            col += mix(u_c1, u_c3, 0.5) * sparkle * 2.0;
        }

        // ── Ambient holographic enhancements (always active, subtle) ──
        float ai = u_ai_intensity;
        float massLum = dot(col, vec3(0.299, 0.587, 0.114));

        // Scan line sweep
        float scanSpeed = 0.03 + ai * 0.06;
        float scan = holoScanLine(uv, t, scanSpeed, 200.0);
        col += u_c1 * scan * (0.08 + ai * 0.15);

        // Ambient pulse
        col *= 1.0 + ai * 0.1 * sin(t * 1.5);

        fragColor = vec4(col, 1.0);
    }`;

    function mkShader(type, src) {
        const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error('Shader:', gl.getShaderInfoLog(s)); return null; }
        return s;
    }

    // ═══════════════════════════════════════════
    // 2D OVERLAY — NOT particles, just subtle ember sparks from core
    // The main green mass effect is entirely in the WebGL shader above
    // ═══════════════════════════════════════════
    function initParticles() {
        particles = [];
        for (let i = 0; i < 30; i++) {
            particles.push({
                x: window.innerWidth * (0.3 + Math.random()*0.4),
                y: window.innerHeight + Math.random()*50,
                vx: (Math.random()-.5)*0.3,
                vy: -(0.2 + Math.random()*0.6),
                size: 0.5 + Math.random()*1.5,
                life: Math.random(),
                decay: 0.002 + Math.random()*0.004,
            });
        }
    }

    function updateParticles() {
        const w = partCanvas.width, h = partCanvas.height;
        for (const p of particles) {
            p.x += p.vx + (Math.random()-.5)*0.15;
            p.y += p.vy;
            p.life -= p.decay;
            if (p.life <= 0 || p.y < -10) {
                p.x = w*(0.3+Math.random()*0.4); p.y = h+10;
                p.life = 0.8+Math.random()*0.2; p.vy = -(0.2+Math.random()*0.6);
            }
        }
    }

    function drawParticles() {
        const w = partCanvas.width, h = partCanvas.height;
        ctx2d.clearRect(0, 0, w, h);
        for (const p of particles) {
            if (p.life <= 0) continue;
            const a = p.life * 0.4;
            const rgb = C3.map(v => Math.round(v * 255));
            ctx2d.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
            ctx2d.beginPath();
            ctx2d.arc(p.x, p.y, p.size*p.life, 0, Math.PI*2);
            ctx2d.fill();
        }
    }

    function scatterFrom() {} // no-op, the green mass reacts in shader

    // ═══════════════════════════════════════════
    // TEXT-TO-MATTER: Render AI text into a texture the shader uses as a density field
    // The green matter concentrates into the letter shapes
    // ═══════════════════════════════════════════
    function initTextSystem() {
        textCanvas = document.createElement('canvas');
        textCanvas.width = TEXT_W;
        textCanvas.height = TEXT_H;
        textCtx = textCanvas.getContext('2d', { willReadFrequently: true });

        // Create GL texture
        textTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // Init with blank
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TEXT_W, TEXT_H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }

    function renderTextToTexture(text) {
        if (!textCtx || !gl) return;
        const ctx = textCtx;
        ctx.clearRect(0, 0, TEXT_W, TEXT_H);

        if (!text || text.trim().length === 0) {
            // Upload blank texture
            gl.bindTexture(gl.TEXTURE_2D, textTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
            return;
        }

        // ── Render text as white-on-black (the shader uses this as a density mask) ──
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, TEXT_W, TEXT_H);

        // Strip markdown/HTML for clean text
        let clean = text.replace(/<[^>]*>/g, '').replace(/[#*_`~]/g, '').replace(/\n{3,}/g, '\n\n').trim();

        // Limit to ~60 chars — fewer = bigger letters = readable in shader
        if (clean.length > 60) {
            clean = clean.slice(-60);
            const spaceIdx = clean.indexOf(' ');
            if (spaceIdx > 0 && spaceIdx < 10) clean = clean.slice(spaceIdx + 1);
        }

        // Font size proportional to canvas — fills ~60% of width
        const fontSize = Math.floor(TEXT_H * 0.12);
        const lineHeight = fontSize * 1.25;
        const maxWidth = TEXT_W * 0.85;
        ctx.font = `900 ${fontSize}px "Arial Black", "Impact", "Helvetica Neue", sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';

        const lines = [];
        const paragraphs = clean.split('\n');
        for (const para of paragraphs) {
            const words = para.split(' ');
            let line = '';
            for (const word of words) {
                const test = line + (line ? ' ' : '') + word;
                if (ctx.measureText(test).width > maxWidth && line) {
                    lines.push(line);
                    line = word;
                } else {
                    line = test;
                }
            }
            if (line) lines.push(line);
        }

        // Center both horizontally and vertically
        const totalH = lines.length * lineHeight;
        let y = Math.max(20, (TEXT_H - totalH) / 2);
        const cx = TEXT_W / 2;

        for (const line of lines) {
            ctx.fillText(line, cx, y);
            y += lineHeight;
            if (y > TEXT_H - 20) break;
        }

        // No blur — keep letters crisp. The shader noise adds organic feel.

        // Upload to GL — 1:1 pixel mapping for crisp text
        gl.bindTexture(gl.TEXTURE_2D, textTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    }

    /** Set the text that the green matter should form into */
    function setText(text) {
        if (text === textContent) return;
        textContent = text || '';
        textDirty = true;
        textAlphaTarget = text && text.trim().length > 0 ? 1.0 : 0.0;
    }

    // ═══════════════════════════════════════════
    // INIT & RENDER
    // ═══════════════════════════════════════════
    function init() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { enabled = false; return; }

        glCanvas = document.createElement('canvas');
        glCanvas.id = 'chimera-vfx-gl';
        glCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:0;pointer-events:none;';
        document.body.prepend(glCanvas);

        gl = glCanvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' });
        if (!gl) { glCanvas.remove(); enabled = false; return; }

        const vs = mkShader(gl.VERTEX_SHADER, VERT), fs = mkShader(gl.FRAGMENT_SHADER, FRAG);
        if (!vs || !fs) { enabled = false; return; }
        program = gl.createProgram();
        gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { enabled = false; return; }

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(program, 'a_pos');
        gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        partCanvas = document.createElement('canvas');
        partCanvas.id = 'chimera-vfx-swarm';
        partCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1;pointer-events:none;';
        glCanvas.after(partCanvas);
        ctx2d = partCanvas.getContext('2d');

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = 1 - e.clientY / window.innerHeight;
        });
        document.addEventListener('click', e => {
            if (!enabled) return;
            addRipple(e.clientX/window.innerWidth, 1-e.clientY/window.innerHeight, 1.0);
            scatterFrom(e.clientX, e.clientY);
        });
        document.addEventListener('visibilitychange', () => {
            paused = document.hidden;
            if (!paused && !animId) render();
        });

        resize();
        window.addEventListener('resize', resize);
        initParticles();
        initTextSystem();
        resolveColors();
        render();
    }

    function resize() {
        const dpr = Math.min(window.devicePixelRatio, 2);
        const w = window.innerWidth, h = window.innerHeight;
        if (glCanvas) { glCanvas.width=w*dpr; glCanvas.height=h*dpr; gl.viewport(0,0,glCanvas.width,glCanvas.height); }
        // Match text texture to canvas pixels for 1:1 crisp text
        if (glCanvas && textCanvas) {
            TEXT_W = glCanvas.width;
            TEXT_H = glCanvas.height;
            textCanvas.width = TEXT_W;
            textCanvas.height = TEXT_H;
            if (textContent) { textDirty = true; } // re-render text at new size
        }
        if (partCanvas) { partCanvas.width=w; partCanvas.height=h; }
    }

    function addRipple(x,y,s) { ripples.push({x,y,birth:time,strength:s}); if(ripples.length>MAX_RIPPLES) ripples.shift(); }

    function render(ts) {
        if (!enabled || paused) { animId = null; return; }
        if (ts && ts - _lastFrame < 30) { animId = requestAnimationFrame(render); return; }
        _lastFrame = ts || 0; _frameCount++; time += 0.033;

        coreIntensity += (coreTarget-coreIntensity)*0.04;
        if (pulseFlash > 0) pulseFlash *= 0.93;
        if (pulseFlash < 0.01) pulseFlash = 0;
        aiIntensity += (aiTarget - aiIntensity) * 0.04;
        holoPhase = (holoPhase + 0.005) % 1.0;

        gl.useProgram(program);
        if (!_ulocs) {
            _ulocs = {};
            for (const n of ['u_time','u_resolution','u_c1','u_c2','u_c3','u_core','u_pulse','u_mouse','u_ripples','u_ripple_count','u_ai_intensity','u_variant','u_holo_phase','u_text_tex','u_text_alpha'])
                _ulocs[n] = gl.getUniformLocation(program, n);
        }
        if (_frameCount % 300 === 0) resolveColors();

        gl.uniform1f(_ulocs.u_time, time);
        gl.uniform2f(_ulocs.u_resolution, glCanvas.width, glCanvas.height);
        gl.uniform3fv(_ulocs.u_c1, C1); gl.uniform3fv(_ulocs.u_c2, C2); gl.uniform3fv(_ulocs.u_c3, C3);
        gl.uniform1f(_ulocs.u_core, coreIntensity+pulseFlash);
        gl.uniform1f(_ulocs.u_pulse, pulseFlash);
        gl.uniform2f(_ulocs.u_mouse, mouseX, mouseY);
        gl.uniform1f(_ulocs.u_ai_intensity, aiIntensity);
        gl.uniform1f(_ulocs.u_variant, visualVariant);
        gl.uniform1f(_ulocs.u_holo_phase, holoPhase);

        // Text-to-matter: update texture if dirty, bind it
        if (textDirty && textTexture) {
            renderTextToTexture(textContent);
            textDirty = false;
        }
        textAlpha += (textAlphaTarget - textAlpha) * 0.06;
        if (textTexture) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textTexture);
            gl.uniform1i(_ulocs.u_text_tex, 0);
        }
        gl.uniform1f(_ulocs.u_text_alpha, textAlpha);

        ripples = ripples.filter(r=>(time-r.birth)<3);
        const rd = new Float32Array(MAX_RIPPLES*4);
        for (let i=0;i<Math.min(ripples.length,MAX_RIPPLES);i++){const r=ripples[i];rd[i*4]=r.x;rd[i*4+1]=r.y;rd[i*4+2]=r.birth;rd[i*4+3]=r.strength;}
        gl.uniform4fv(_ulocs.u_ripples, rd);
        gl.uniform1i(_ulocs.u_ripple_count, Math.min(ripples.length, MAX_RIPPLES));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        updateParticles();
        drawParticles();

        animId = requestAnimationFrame(render);
    }

    function toggle(on) { enabled=on; if(on&&!animId) render(); }
    function setThinking(on) { coreTarget = on ? 0.5 : 0.25; aiTarget = on ? 0.5 : 0; }
    function pulse() { pulseFlash=0.8; coreTarget=0.6; aiTarget=1.0; setTimeout(()=>{coreTarget=0.25; aiTarget=0;},2000); }
    function setAI(v) { aiTarget = Math.max(0, Math.min(1, v)); }
    function setIntensity(v) { if(glCanvas) glCanvas.style.opacity=Math.max(0,Math.min(1,v)); }
    function setPalette(primary, success, secondary) {
        if (Array.isArray(primary) && primary.length === 3) C1 = primary;
        if (Array.isArray(success) && success.length === 3) C2 = success;
        if (Array.isArray(secondary) && secondary.length === 3) C3 = secondary;
    }
    function setVariant(value) { visualVariant = Math.max(0, Math.min(11, Number(value) || 0)); }

    return { init, toggle, setThinking, pulse, setIntensity, setPalette, setVariant, addRipple, setAI, setText };
})();

if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', ChimeraVFX.init);
else ChimeraVFX.init();

// Mind Recipe's native bridge deliberately uses the existing Darkstar VFX
// controls; it does not replace or redraw the shader system.
function mindRecipeBridge(message) {
    for (const name of ['BackgroundBridge', 'IntroBridge', 'FamiliarBridge']) {
        try { window[name]?.postMessage(message); } catch (_) {}
    }
}
function mindRecipeApply(state) {
    const progress = Number(state?.progress ?? state?.growth ?? state?.form ?? 0);
    const activation = Number(state?.intensity ?? state?.activation ?? .72);
    ChimeraVFX.setIntensity(Math.max(.72, Math.min(1, activation)));
    ChimeraVFX.setAI(Math.max(0, Math.min(1, (progress + activation) / 2)));
    ChimeraVFX.setThinking(progress > .28 || activation > .72);
    const palettes = {
        'chimera-native': [[.6588,.8157,.7920],[.1106,.5176,.4796],[.8020,.8139,.8176]],
        'cyberpunk-neon': [[0.0,.83,1.0],[1.0,.18,.58],[.55,.36,.96]],
        'organic-bioluminescent': [[.20,.88,.77],[0.0,.90,.54],[.70,1.0,.35]],
        'quantum-void': [[.31,.27,.90],[.55,.36,.96],[.93,.28,.60]],
        'holographic-matrix': [[0.0,.83,1.0],[.22,1.0,.53],[.71,1.0,0.0]],
    };
    const palette = palettes[state?.theme] || palettes['chimera-native'];
    ChimeraVFX.setPalette(palette[0], palette[1], palette[2]);
    const variants = ['field','nebula','rivers','tendrils','orbs','lattice','void','prism','aurora','ember','ocean','twilight'];
    const variantIndex = variants.indexOf(state?.variant);
    if (variantIndex >= 0) ChimeraVFX.setVariant(variantIndex);
    if (progress > .72) ChimeraVFX.pulse();
}
window.setBackgroundState = mindRecipeApply;
window.setIntroVariant = value => {
    mindRecipeApply({ theme: 'chimera-native', progress: .45 + (Number(value || 0) % 3) * .12, intensity: .96 });
    window.setBrandSceneVariant?.(value);
    ChimeraVFX.pulse();
};
window.setFamiliarState = mindRecipeApply;
window.setBackgroundPaused = paused => ChimeraVFX.toggle(!paused);
window.setIntroPaused = window.setBackgroundPaused;
window.setFamiliarPaused = window.setBackgroundPaused;
requestAnimationFrame(() => {
    const canvas = document.getElementById('chimera-vfx-gl');
    canvas?.addEventListener('webglcontextlost', event => { event.preventDefault(); mindRecipeBridge('context_lost'); });
    mindRecipeBridge(canvas ? 'ready' : 'engine_error');
});
