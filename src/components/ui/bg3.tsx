import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";
import type { FC } from "react";

interface ComponentProps {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
}

/* ----------------------- GLSL kept identical ----------------------- */
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

const FRAG = /* glsl */ `
  precision highp float;

  uniform float iTime;
  uniform vec3 iResolution;
  uniform float hue;
  uniform float hover;
  uniform float rot;
  uniform float hoverIntensity;
  varying vec2 vUv;

  vec3 rgb2yiq(vec3 c) {
    float y = dot(c, vec3(0.299, 0.587, 0.114));
    float i = dot(c, vec3(0.596, -0.274, -0.322));
    float q = dot(c, vec3(0.211, -0.523, 0.312));
    return vec3(y, i, q);
  }
  
  vec3 yiq2rgb(vec3 c) {
    float r = c.x + 0.956 * c.y + 0.621 * c.z;
    float g = c.x - 0.272 * c.y - 0.647 * c.z;
    float b = c.x - 1.106 * c.y + 1.703 * c.z;
    return vec3(r, g, b);
  }
  
  vec3 adjustHue(vec3 color, float hueDeg) {
    float hueRad = hueDeg * 3.14159265 / 180.0;
    vec3 yiq = rgb2yiq(color);
    float cosA = cos(hueRad);
    float sinA = sin(hueRad);
    float i = yiq.y * cosA - yiq.z * sinA;
    float q = yiq.y * sinA + yiq.z * cosA;
    yiq.y = i;
    yiq.z = q;
    return yiq2rgb(yiq);
  }
  
  vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
    p3 += dot(p3, p3.yxz + 19.19);
    return -1.0 + 2.0 * fract(vec3(
      p3.x + p3.y,
      p3.x + p3.z,
      p3.y + p3.z
    ) * p3.zyx);
  }
  
  float snoise3(vec3 p) {
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    vec3 d1 = d0 - (i1 - K2);
    vec3 d2 = d0 - (i2 - K1);
    vec3 d3 = d0 - 0.5;
    vec4 h = max(0.6 - vec4(
      dot(d0, d0),
      dot(d1, d1),
      dot(d2, d2),
      dot(d3, d3)
    ), 0.0);
    vec4 n = h * h * h * h * vec4(
      dot(d0, hash33(i)),
      dot(d1, hash33(i + i1)),
      dot(d2, hash33(i + i2)),
      dot(d3, hash33(i + 1.0))
    );
    return dot(vec4(31.316), n);
  }
  
  vec4 extractAlpha(vec3 colorIn) {
    float a = max(max(colorIn.r, colorIn.g), colorIn.b);
    return vec4(colorIn.rgb / (a + 1e-5), a);
  }
  
  const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
  const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
  const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
  const float innerRadius = 0.6;
  const float noiseScale = 0.65;
  
  float light1(float intensity, float attenuation, float dist) {
    return intensity / (1.0 + dist * attenuation);
  }
  
  float light2(float intensity, float attenuation, float dist) {
    return intensity / (1.0 + dist * dist * attenuation);
  }
  
  vec4 draw(vec2 uv) {
    vec3 color1 = adjustHue(baseColor1, hue);
    vec3 color2 = adjustHue(baseColor2, hue);
    vec3 color3 = adjustHue(baseColor3, hue);
    
    float ang = atan(uv.y, uv.x);
    float len = length(uv);
    float invLen = len > 0.0 ? 1.0 / len : 0.0;
    
    float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
    float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
    float d0 = distance(uv, (r0 * invLen) * uv);
    float v0 = light1(1.0, 10.0, d0);
    v0 *= smoothstep(r0 * 1.05, r0, len);
    float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
    
    float a = iTime * -1.0;
    vec2 pos = vec2(cos(a), sin(a)) * r0;
    float d = distance(uv, pos);
    float v1 = light2(1.5, 5.0, d);
    v1 *= light1(1.0, 50.0, d0);
    
    float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
    float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
    
    vec3 col = mix(color1, color2, cl);
    col = mix(color3, col, v0);
    col = (col + v1) * v2 * v3;
    col = clamp(col, 0.0, 1.0);
    
    return extractAlpha(col);
  }
  
  vec4 mainImage(vec2 fragCoord) {
    vec2 center = iResolution.xy * 0.5;
    float size = min(iResolution.x, iResolution.y);
    vec2 uv = (fragCoord - center) / size * 2.0;
    
    float angle = rot;
    float s = sin(angle);
    float c = cos(angle);
    uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
    
    uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
    uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
    
    return draw(uv);
  }
  
  void main() {
    vec2 fragCoord = vUv * iResolution.xy;
    vec4 col = mainImage(fragCoord);
    gl_FragColor = vec4(col.rgb * col.a, col.a);
  }
`;

export const Component: FC<ComponentProps> = ({
  hue = 0,
  hoverIntensity = 0.2,
  rotateOnHover = true,
  forceHoverState = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // GL / OGL refs
  const rendererRef = useRef<Renderer | null>(null);
  const glRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(
    null
  );
  const programRef = useRef<Program | null>(null);
  const meshRef = useRef<Mesh | null>(null);

  // Animation state refs
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const rotRef = useRef<number>(0);
  const hoverValueRef = useRef<number>(0);
  const targetHoverRef = useRef<number>(0);
  const isInViewRef = useRef<boolean>(true);
  const isPageVisibleRef = useRef<boolean>(true);

  // Live prop refs (avoid re-creating GL on prop changes)
  const hueRef = useRef(hue);
  const hoverIntensityRef = useRef(hoverIntensity);
  const rotateOnHoverRef = useRef(rotateOnHover);
  const forceHoverStateRef = useRef(forceHoverState);

  useEffect(() => {
    hueRef.current = hue;
  }, [hue]);
  useEffect(() => {
    hoverIntensityRef.current = hoverIntensity;
  }, [hoverIntensity]);
  useEffect(() => {
    rotateOnHoverRef.current = rotateOnHover;
  }, [rotateOnHover]);
  useEffect(() => {
    forceHoverStateRef.current = forceHoverState;
  }, [forceHoverState]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposeRequested = false;

    // Create renderer with correct DPR; OGL applies DPR inside setSize().
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      dpr: window.devicePixelRatio || 1,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    // Clear possible previous canvas
    if (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(1, 1, 1) },
        hue: { value: hueRef.current },
        hover: { value: 0 },
        rot: { value: 0 },
        hoverIntensity: { value: hoverIntensityRef.current },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    rendererRef.current = renderer;
    glRef.current = gl;
    programRef.current = program;
    meshRef.current = mesh;

    // --- Sizing: use ResizeObserver (falls back to window resize if unsupported)
    const updateResolutionUniform = () => {
      // Use drawing buffer size (post-DPR) to match shader expectations
      const dw = gl.drawingBufferWidth;
      const dh = gl.drawingBufferHeight;
      program.uniforms.iResolution.value.set(dw, dh, dw / Math.max(1, dh));
    };

    const doSetSize = (w: number, h: number) => {
      // Important: DON'T multiply by DPR here; OGL does it internally
      renderer.setSize(Math.max(1, Math.floor(w)), Math.max(1, Math.floor(h)));
      // Style size in CSS pixels
      gl.canvas.style.width = `${w}px`;
      gl.canvas.style.height = `${h}px`;
      updateResolutionUniform();
    };

    const ro =
      "ResizeObserver" in window
        ? new ResizeObserver((entries) => {
            const rect = entries[0]?.contentRect;
            if (rect) doSetSize(rect.width, rect.height);
          })
        : null;

    if (ro) {
      ro.observe(container);
    } else {
      // Fallback
      const onWinResize = () => {
        const rect = container.getBoundingClientRect();
        doSetSize(rect.width, rect.height);
      };
      window.addEventListener("resize", onWinResize);
      // Initial size
      onWinResize();
    }

    // Ensure we size at least once if RO fired before uniforms ready
    if (!ro) {
      // Already sized in onWinResize
    } else {
      const rect = container.getBoundingClientRect();
      doSetSize(rect.width, rect.height);
    }

    // --- Visibility controls: pause when off-screen or tab hidden
    const onVisibilityChange = () => {
      isPageVisibleRef.current = document.visibilityState === "visible";
      if (isPageVisibleRef.current && isInViewRef.current) startLoop();
      else stopLoop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const io = new IntersectionObserver(
      (entries) => {
        isInViewRef.current = !!entries[0]?.isIntersecting;
        if (isInViewRef.current && isPageVisibleRef.current) startLoop();
        else stopLoop();
      },
      { root: null, threshold: 0 }
    );
    io.observe(container);

    // --- Pointer interactions (passive)
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      const size = Math.min(width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const uvX = ((x - centerX) / size) * 2.0;
      const uvY = ((y - centerY) / size) * 2.0;
      targetHoverRef.current = Math.hypot(uvX, uvY) < 0.8 ? 1 : 0;
    };
    const handlePointerLeave = () => {
      targetHoverRef.current = 0;
    };
    const ac = new AbortController();
    container.addEventListener("pointermove", handlePointerMove, {
      passive: true,
      signal: ac.signal,
    });
    container.addEventListener("pointerleave", handlePointerLeave, {
      passive: true,
      signal: ac.signal,
    });

    // --- RAF loop (start/stop safely)
    const rotationSpeed = 0.3;
    const frame = (t: number) => {
      if (disposeRequested) return;
      // Start clock on first frame
      if (startTimeRef.current === 0) startTimeRef.current = t;
      const dt = (t - (lastTimeRef.current || t)) * 0.001;
      lastTimeRef.current = t;

      const elapsed = (t - startTimeRef.current) * 0.001;
      // Live uniforms
      program.uniforms.iTime.value = elapsed;
      program.uniforms.hue.value = hueRef.current;
      program.uniforms.hoverIntensity.value = hoverIntensityRef.current;

      const effectiveHover = forceHoverStateRef.current
        ? 1
        : targetHoverRef.current;
      // Smooth the hover uniform
      hoverValueRef.current += (effectiveHover - hoverValueRef.current) * 0.1;
      program.uniforms.hover.value = hoverValueRef.current;

      if (rotateOnHoverRef.current && effectiveHover > 0.5) {
        rotRef.current += dt * rotationSpeed;
      }
      program.uniforms.rot.value = rotRef.current;

      renderer.render({ scene: mesh });

      rafRef.current = requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (rafRef.current != null) return; // already running
      lastTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(frame);
    };

    const stopLoop = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    // Start initially if visible
    if (isPageVisibleRef.current && isInViewRef.current) startLoop();

    // Cleanup
    return () => {
      disposeRequested = true;
      stopLoop();

      document.removeEventListener("visibilitychange", onVisibilityChange);
      io.disconnect();
      ro?.disconnect();

      ac.abort();

      if (container && gl.canvas && gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();

      // Null refs
      rendererRef.current = null;
      glRef.current = null;
      programRef.current = null;
      meshRef.current = null;
    };
  }, []); // Init once

  return <div ref={containerRef} className="w-full h-full" />;
};
