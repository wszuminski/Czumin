import { useEffect, useRef } from "react";
import * as THREE from "three";

export function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    camera: THREE.Camera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    uniforms: any;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    // Fragment shader
    const fragmentShader = `
  #define TWO_PI 6.2831853072
  #define PI 3.14159265359

  precision highp float;
  uniform vec2 resolution;
  uniform float time;

  void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float t = time * 0.05;
    float lineWidth = 0.002;

    // Build the same ringy pattern, but as a single scalar accumulator
    float accum = 0.0;
    for (int j = 0; j < 3; j++) {
      for (int i = 0; i < 5; i++) {
        accum += lineWidth * float(i*i)
          / abs(fract(t - 0.01*float(j) + float(i)*0.01)*5.0
          - length(uv) + mod(uv.x+uv.y, 0.2));
      }
    }

    // Normalize pattern -> 0..1
    float v = clamp(accum * 0.6, 0.0, 1.0);

    // Purple (#6A00FF) and Pink (#FF4FD8) in 0..1 sRGB
    vec3 purple = vec3(0.4157, 0.0,    1.0);
    vec3 pink   = vec3(1.0,    0.3098, 0.8471);

    // Add a gentle sweep through the gradient using angle + time
    float sweep = 0.5 + 0.5 * sin(atan(uv.y, uv.x) + time * 0.4);
    float mixAmt = clamp(0.65 * v + 0.35 * sweep, 0.0, 1.0);

    // Final color from purple → pink, modulated by pattern brightness
    vec3 col = mix(purple, pink, mixAmt);
    float brightness = smoothstep(0.0, 1.0, v * 1.2);
    col *= brightness;

    gl_FragColor = vec4(col, 1.0);
  }
`;


    // Initialize Three.js scene
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    // Handle window resize
    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    // Initial resize
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }
    };

    // Store scene references for cleanup
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    };

    // Start animation
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }

        sceneRef.current.renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen"
      style={{
        background: "#000",
        overflow: "hidden",
      }}
    />
  );
}
