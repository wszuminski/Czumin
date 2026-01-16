// NebulaBackground.tsx
import { useEffect, useRef } from "react";
import type { FC } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";

/* ========================= Shaders ========================= */

const VERT = /* glsl */ `
  precision highp float;
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Grok-like wedge; right-side glow shifted to bluish–purple.
// Band grows with x and can be curved/tilted via uniforms.
const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float iTime;
  uniform vec3  iResolution;   // (w, h, aspect)

  // --- band shape controls ---
  uniform float uTopY;         // base top margin (normalized 0..1)
  uniform float uBottomCap;    // max bottom (<= ~0.99)
  uniform float uMinBandH;     // min height at x=0
  uniform float uCurvePow;     // width growth power
  uniform float uBandFeather;  // edge softness
  uniform float uTopBow;       // top edge bows upward to right
  uniform float uBotBow;       // bottom edge bows downward to right
  uniform float uTilt;         // linear tilt (-0.2..0.2)

  // -------- noise --------
  float hash(vec2 p){
    p = fract(p*vec2(123.34,456.21));
    p += dot(p,p+45.32);
    return fract(p.x*p.y);
  }
  float noise(vec2 p){
    vec2 i=floor(p); vec2 f=fract(p);
    float a=hash(i);
    float b=hash(i+vec2(1.0,0.0));
    float c=hash(i+vec2(0.0,1.0));
    float d=hash(i+vec2(1.0,1.0));
    vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  float fbm(vec2 p){
    float v=0.0; float a=0.5; mat2 m=mat2(1.6,1.2,-1.2,1.6);
    for(int i=0;i<6;i++){ v+=a*noise(p); p=m*p; a*=0.5; }
    return v;
  }
  float wispy(vec2 p, float t){
    vec2 q = p;
    q += 0.35*vec2(fbm(p*1.2 + vec2(0.9*t, -0.6*t)), fbm(p*1.2 - vec2(0.6*t, 0.9*t)));
    float n1 = fbm(q*1.1 - vec2(0.25*t, -0.35*t));
    float n2 = fbm(q*2.3 + vec2(0.15*t, 0.21*t));
    return mix(n1, n2, 0.5);
  }

  // Elliptical off-canvas-ish light for the right “blob”
  float rightLight(vec2 uv){
    vec2 lp = vec2(1.18, 0.50);              // push further right
    vec2 squeeze = vec2(1.25, 0.85);         // stretch horizontally
    float d = length((uv - lp) * squeeze);
    float core = exp(-pow(d*10.5, 2.0));
    float tail = pow(max(0.0, 1.0 - d*1.08), 2.8);
    return clamp(core*1.7 + tail*1.1, 0.0, 2.0);
  }

  // Tangential streaking around the blob
  float haloStreak(vec2 uv, vec2 st, float t){
    vec2 lp = vec2(1.18, 0.50);
    vec2 toL = uv - lp;
    vec2 tangent = normalize(vec2(-toL.y, toL.x) + 1e-5);
    float acc = 0.0, wsum = 0.0;
    for(int i=-2;i<=2;i++){
      float fi = float(i);
      float w = 1.0 - abs(fi)/3.0;
      vec2 ofs = tangent * fi * 0.015;
      float s = wispy(st + ofs*1.8, t + fi*0.05);
      acc += s*w; wsum += w;
    }
    return (acc/wsum);
  }

  vec3 tonemap(vec3 x){
    float a=2.51, b=0.03, c=2.43, d=0.59, e=0.14;
    return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
  }

  void main(){
    vec2 uv = vUv; // 0..1
    vec2 st = (uv - 0.5);
    st.x *= iResolution.x / max(1.0, iResolution.y);

    float t = iTime*0.25;

    // Swirl the underlying fields a bit
    float ang = 0.28 + 0.12*sin(iTime*0.6);
    float cs = cos(ang), sn = sin(ang);
    mat2 R = mat2(cs,-sn,sn,cs);
    vec2 p = R * st * 1.15;

    // Fields
    float base = wispy(p*1.3, t);
    base = smoothstep(0.35, 0.95, base);
    float light  = rightLight(uv);
    float streak = smoothstep(0.45, 0.95, haloStreak(uv, p, t));

    // --- palette (bluish-purple) ---
    vec3 deep   = vec3(0.010, 0.012, 0.040);
    vec3 haze   = vec3(0.22, 0.28, 0.78);
    vec3 purple = vec3(0.74, 0.60, 1.00);

    vec3 col = deep;
    col = mix(col, haze, base * (0.55 + 0.45*smoothstep(0.25, 1.0, uv.x)));
    col += purple * (light*1.25);
    col += purple * 0.60 * streak * smoothstep(0.35, 1.0, uv.x);

    // darken far left a touch
    float leftDark = smoothstep(0.0, 0.55, uv.x);
    col *= mix(0.58, 1.0, leftDark);
    col += vec3(0.02) * smoothstep(0.2, 0.8, uv.x);
    col = mix(col, vec3(0.02,0.03,0.09), 0.25*(1.0-leftDark));

    // subtle breathing
    float pulse = 0.8 + 0.2*sin(iTime*0.9);
    col *= (0.96 + 0.04*pulse);

    // bias bright areas toward purple so it never looks gray
    col = mix(col, purple, clamp(light*0.18, 0.0, 0.25));

    // Dither + tonemap
    float d = hash(gl_FragCoord.xy/iResolution.x);
    col += (d-0.5)/255.0;
    col = tonemap(col);

    // --------- Curved, widening “wedge” band ----------
    float maxH = clamp(uBottomCap - uTopY, 0.0, 1.0);
    float x = clamp(uv.x, 0.0, 1.0);
    float xk = pow(x, uCurvePow);
    float H  = mix(uMinBandH, maxH, xk);

    // gentle S-curve (can be zeroed by uniforms)
    float bowTop = uTopBow * smoothstep(0.1, 1.0, x) * x*x;
    float bowBot = uBotBow * smoothstep(0.0, 1.0, x);
    float tilt   = uTilt   * (x - 0.5);

    float yTop = clamp(uTopY - bowTop + tilt, 0.0, 1.0);
    float yBot = min(yTop + H + bowBot, uBottomCap);

    float aIn  = smoothstep(yTop - uBandFeather, yTop + uBandFeather, uv.y);
    float aOut = 1.0 - smoothstep(yBot - uBandFeather, yBot + uBandFeather, uv.y);
    float band = clamp(aIn * aOut, 0.0, 1.0);

    col *= band;
    gl_FragColor = vec4(col, band);
  }
`;

/* ========================= Component ========================= */

type NebulaProps = {
  className?: string;
  /** Top fade in px (keeps effect away from the top). */
  fadeTop?: number;
  /** Bottom fade in px (extra safety). */
  fadeBottom?: number;
  /** Extra px rendered above/below section. */
  bleed?: number;
  /** Where along X (0..1) we sample the band to anchor the title. */
  anchorX?: number; // default 0.5 (center)
};

const NebulaBackground: FC<NebulaProps> = ({
  className,
  fadeTop = 200,
  fadeBottom = 200,
  bleed = 0,
  anchorX = 0.5,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const glRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(
    null
  );
  const programRef = useRef<Program | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const visibleRef = useRef(true);
  const inViewRef = useRef(true);

  // CSS mask to avoid touching top/bottom hard edges
  const mask = `linear-gradient(
    to bottom,
    transparent 0px,
    black ${fadeTop}px,
    black calc(100% - ${fadeBottom}px),
    transparent 100%
  )`;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Renderer
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      powerPreference: "high-performance",
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const canvas = gl.canvas;
    canvas.style.pointerEvents = "none";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.contain = "layout paint size";
    canvas.style.willChange = "transform";

    container.innerHTML = "";
    container.appendChild(canvas);

    // Geometry + program
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(1, 1, 1) },

        // Wider band, almost full height on the right:
        uTopY: { value: 0.06 }, // start closer to top
        uBottomCap: { value: 0.0 }, // set at resize (≈0.99 after patch)
        uMinBandH: { value: 0.36 }, // wider left (0.34–0.40)
        uCurvePow: { value: 1.0 }, // clean linear wedge
        uBandFeather: { value: 0.06 }, // crisp but soft enough

        // Curvature/tilt (kept flat by default)
        uTopBow: { value: 0.0 },
        uBotBow: { value: 0.0 },
        uTilt: { value: 0.0 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    rendererRef.current = renderer;
    glRef.current = gl;
    programRef.current = program;
    meshRef.current = mesh;

    // ---- Helpers to mirror GLSL for band Y computation ----
    const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
    const smoothstep = (e0: number, e1: number, x: number) => {
      const t = clamp01((x - e0) / (e1 - e0));
      return t * t * (3 - 2 * t);
    };
    const computeBandY = (x: number) => {
      const u = program.uniforms as any;
      const uTopY = u.uTopY.value as number;
      const uBottomCap = u.uBottomCap.value as number;
      const uMinBandH = u.uMinBandH.value as number;
      const uCurvePow = u.uCurvePow.value as number;
      const uTopBow = (u.uTopBow?.value ?? 0) as number;
      const uBotBow = (u.uBotBow?.value ?? 0) as number;
      const uTilt = (u.uTilt?.value ?? 0) as number;

      const maxH = clamp01(uBottomCap - uTopY);
      const xk = Math.pow(clamp01(x), uCurvePow);
      const H = uMinBandH + (maxH - uMinBandH) * xk;

      const bowTop = uTopBow * smoothstep(0.1, 1.0, x) * x * x;
      const bowBot = uBotBow * smoothstep(0.0, 1.0, x);
      const tilt = uTilt * (x - 0.5);

      const yTop = clamp01(uTopY - bowTop + tilt);
      const yBot = Math.min(yTop + H + bowBot, uBottomCap);
      return { yTop, yBot, yCtr: (yTop + yBot) * 0.5 };
    };

    // ---- Size & uniforms ----
    const host = container.parentElement ?? container;
    const sizeState = { width: 0, height: 0 };
    let resizeRaf: number | null = null;
    let pendingSize: { width: number; height: number } | null = null;

    const updateUniformsForSize = (widthPx: number, heightPx: number) => {
      const dw = gl.drawingBufferWidth;
      const dh = gl.drawingBufferHeight;
      program.uniforms.iResolution.value.set(dw, dh, dw / Math.max(1, dh));

      const topNorm = Math.min(0.49, Math.max(0, fadeTop / Math.max(1, dh)));
      const bottomCapNorm = Math.max(
        0.0,
        Math.min(0.99, 1 - fadeBottom / Math.max(1, dh) - 0.01)
      );

      program.uniforms.uTopY.value = topNorm;
      program.uniforms.uBottomCap.value = Math.max(topNorm + 0.05, bottomCapNorm);
      program.uniforms.uBandFeather.value = Math.min(
        0.12,
        Math.max(0.025, 0.06)
      );

      if (host) {
        const { yTop, yBot, yCtr } = computeBandY(anchorX);
        host.style.setProperty("--grok-band-top", `${yTop * heightPx}px`);
        host.style.setProperty("--grok-band-bottom", `${yBot * heightPx}px`);
        host.style.setProperty("--grok-band-center", `${yCtr * heightPx}px`);
      }
    };

    const applySize = (width: number, height: number, force = false) => {
      const w = Math.max(1, Math.floor(width));
      const h = Math.max(1, Math.floor(height));
      if (!force && w === sizeState.width && h === sizeState.height) return;
      sizeState.width = w;
      sizeState.height = h;
      renderer.setSize(w, h);
      updateUniformsForSize(w, h);
    };

    const flushPendingSize = () => {
      if (!pendingSize) return;
      applySize(pendingSize.width, pendingSize.height);
      pendingSize = null;
    };

    const scheduleSize = (width: number, height: number) => {
      pendingSize = { width, height };
      if (resizeRaf != null) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null;
        flushPendingSize();
      });
    };

    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (!r) return;
      scheduleSize(r.width, r.height);
    });
    ro.observe(container);

    // initial size
    const rect0 = container.getBoundingClientRect();
    applySize(rect0.width, rect0.height, true);

    // visibility / in-view control
    const onVis = () => {
      visibleRef.current = document.visibilityState === "visible";
      if (visibleRef.current && inViewRef.current) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVis);

    const io = new IntersectionObserver(
      (entries) => {
        inViewRef.current = Boolean(entries[0]?.isIntersecting);
        if (visibleRef.current && inViewRef.current) start();
        else stop();
      },
      { root: null, threshold: 0, rootMargin: "0px 0px 200px 0px" }
    );
    io.observe(container);

    // render loop
    const frame = (t: number) => {
      if (startRef.current === 0) startRef.current = t;
      const elapsed = (t - startRef.current) * 0.001;
      program.uniforms.iTime.value = elapsed;
      renderer.render({ scene: mesh });
      rafRef.current = requestAnimationFrame(frame);
    };
    const start = () => {
      if (rafRef.current != null) return;
      flushPendingSize();
      rafRef.current = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    start();

    // cleanup
    return () => {
      stop();
      if (resizeRaf != null) {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = null;
      }
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      rendererRef.current = null;
      glRef.current = null;
      programRef.current = null;
      meshRef.current = null;
    };
  }, [fadeTop, fadeBottom, anchorX]);

  return (
    <div
      ref={ref}
      className={"absolute inset-0 pointer-events-none " + (className || "")}
      style={{
        top: -bleed,
        bottom: -bleed,
        WebkitMaskImage: mask as any,
        maskImage: mask,
        WebkitMaskRepeat: "no-repeat" as any,
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%" as any,
        maskSize: "100% 100%",
      }}
    />
  );
};

export default NebulaBackground;
