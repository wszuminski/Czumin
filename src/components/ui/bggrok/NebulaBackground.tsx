import { useEffect, useRef } from "react";
import type { FC } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";

/* -------------------- GLSL: Grok-like wisps with bright right flare -------------------- */
const VERT = /* glsl */ `
  precision highp float;
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Tuned to resemble the Grok landing hero: very dark left, intense white/blue flare on the right,
// slow cloudy motion, subtle streaking around the light source, and gentle vignette.
const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float iTime;
  uniform vec3 iResolution; // (w, h, aspect)

  // -------------------------------------------------- utilities
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
  // Domain-warped fbm for soft wisps
  float wispy(vec2 p, float t){
    vec2 q = p;
    q += 0.35*vec2(fbm(p*1.2 + vec2(0.9*t, -0.6*t)), fbm(p*1.2 - vec2(0.6*t, 0.9*t)));
    float n1 = fbm(q*1.1 - vec2(0.25*t, -0.35*t));
    float n2 = fbm(q*2.3 + vec2(0.15*t, 0.21*t));
    return mix(n1, n2, 0.5);
  }

  // Soft radial light positioned slightly off the right edge
  float rightLight(vec2 uv){
    // place the light slightly outside the frame so the core sits off-screen
    vec2 lp = vec2(1.15, 0.52);
    float d = distance(uv, lp);
    // blend of gaussian-ish core and long tail for bloom
    float core = exp(-pow(d*14.0, 2.0));
    float tail = pow(max(0.0, 1.0 - d*1.15), 3.0);
    return clamp(core*1.4 + tail*1.2, 0.0, 2.0);
  }

  // Directional streaking around the light (samples along the tangent)
  float haloStreak(vec2 uv, vec2 st, float t){
    vec2 lp = vec2(1.15, 0.52);
    vec2 toL = uv - lp;
    vec2 tangent = normalize(vec2(-toL.y, toL.x) + 1e-5);
    float acc = 0.0;
    float wsum = 0.0;
    // 5-tap directional blur with evolving offsets for motion
    for(int i=-2;i<=2;i++){
      float fi = float(i);
      float w = 1.0 - abs(fi)/3.0;
      vec2 ofs = tangent * fi * 0.015;
      float s = wispy(st + ofs*1.8, t + fi*0.05);
      acc += s*w; wsum += w;
    }
    return (acc/wsum);
  }

  // Filmic-ish tonemap (ACES-ish approximation)
  vec3 tonemap(vec3 x){
    float a=2.51, b=0.03, c=2.43, d=0.59, e=0.14;
    return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
  }

  void main(){
    vec2 res = iResolution.xy;
    vec2 uv = vUv;                     // 0..1
    vec2 st = (uv - 0.5);
    st.x *= iResolution.x / max(1.0, iResolution.y); // aspect-corrected - keep shapes round

    float t = iTime*0.25;

    // Gentle global swirl
    float ang = 0.28 + 0.12*sin(iTime*0.6);
    float cs = cos(ang), sn = sin(ang);
    mat2 R = mat2(cs,-sn,sn,cs);
    vec2 p = R * st * 1.15;

    // Wisp field (0..1)
    float base = wispy(p*1.3, t);
    base = smoothstep(0.35, 0.95, base);

    // Radial light + halo
    float light = rightLight(uv);

    // Streaking aligned around the light
    float streak = haloStreak(uv, p*1.0, t);
    streak = smoothstep(0.45, 0.95, streak);

    // Edge vignette and stronger darkening on the far left
    float vign = smoothstep(0.0, 0.08, uv.y) * smoothstep(1.0, 0.92, uv.y);
    float leftDark = smoothstep(0.0, 0.55, uv.x);

    // Palette: deep near-black -> cool blue -> white core
    vec3 deep = vec3(0.005, 0.010, 0.030);
    vec3 haze = vec3(0.22, 0.34, 0.85);
    vec3 glow = vec3(0.95, 0.98, 1.0);

    // Compose layers
    vec3 col = deep;
    // smoky field mostly in the middle/right, softened by vignette
    col = mix(col, haze, base * (0.6 + 0.4*vign) * (0.3 + 0.7*smoothstep(0.25, 1.0, uv.x)));

    // add light bloom and streaks
    col += glow * (light*1.35);
    col += glow * 0.55 * streak * smoothstep(0.35, 1.0, uv.x);

    // reduce brightness on the extreme left to match the screenshot's deep blacks
    col *= mix(0.58, 1.0, leftDark);

    // very soft fog so blacks aren't crushed near the light transition
    col += vec3(0.02) * smoothstep(0.2, 0.8, uv.x);

    // tiny blue bias to shadows
    col = mix(col, vec3(0.02,0.03,0.09), 0.25*(1.0-leftDark));

    // temporal pulse for breathing energy in the flare
    float pulse = 0.8 + 0.2*sin(iTime*0.9);
    col *= (0.96 + 0.04*pulse);

    // dither to avoid banding (screen-space noise)
    float d = hash(gl_FragCoord.xy/iResolution.x);
    col += (d-0.5)/255.0;

    col = tonemap(col);

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ----------------------- OGL-backed animated background ----------------------- */
const NebulaBackground: FC<{ className?: string }> = ({ className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const glRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(
    null
  );
  const programRef = useRef<Program | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const lastRef = useRef<number>(0);
  const visibleRef = useRef<boolean>(true);
  const inViewRef = useRef<boolean>(true);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.innerHTML = "";
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(1, 1, 1) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    rendererRef.current = renderer;
    glRef.current = gl;
    programRef.current = program;
    meshRef.current = mesh;

    const updateResolution = () => {
      const dw = gl.drawingBufferWidth;
      const dh = gl.drawingBufferHeight;
      program.uniforms.iResolution.value.set(dw, dh, dw / Math.max(1, dh));
    };

    const setSize = (w: number, h: number) => {
      renderer.setSize(Math.max(1, Math.floor(w)), Math.max(1, Math.floor(h)));
      gl.canvas.style.width = `${w}px`;
      gl.canvas.style.height = `${h}px`;
      updateResolution();
    };

    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (r) setSize(r.width, r.height);
    });
    ro.observe(container);
    const rect = container.getBoundingClientRect();
    setSize(rect.width, rect.height);

    const onVis = () => {
      visibleRef.current = document.visibilityState === "visible";
      if (visibleRef.current && inViewRef.current) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVis);

    const io = new IntersectionObserver(
      (entries) => {
        inViewRef.current = !!entries[0]?.isIntersecting;
        if (visibleRef.current && inViewRef.current) start();
        else stop();
      },
      { root: null, threshold: 0 }
    );
    io.observe(container);

    const frame = (t: number) => {
      if (startRef.current === 0) startRef.current = t;
      //  const dt = (t - (lastRef.current || t)) * 0.001; // reserved
      lastRef.current = t;
      const elapsed = (t - startRef.current) * 0.001;
      program.uniforms.iTime.value = elapsed;
      renderer.render({ scene: mesh });
      rafRef.current = requestAnimationFrame(frame);
    };

    const start = () => {
      if (rafRef.current != null) return;
      lastRef.current = performance.now();
      rafRef.current = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    start();

    return () => {
      stop();
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
  }, []);

  return (
    <div
      ref={ref}
      className={"absolute inset-0 pointer-events-none " + (className || "")}
    />
  );
};

export default NebulaBackground;
