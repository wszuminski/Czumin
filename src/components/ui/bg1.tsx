// src/backgrounds/AuroraWaves.tsx
import React, { useEffect, useMemo, useState } from "react";

export interface BGProps {
  className?: string;
  style?: React.CSSProperties;
  colors?: string[];
  speed?: number;
  intensity?: number;
  seed?: number;
}

/**
 * AuroraWaves — layered gradient ribbons sliding gently; no blob orbs.
 * Tip: pass `colors` for palette; lower `intensity` for softer waves.
 * Uses SVG paths + CSS transform animations (cheap).
 */
const AuroraWaves: React.FC<BGProps> = ({
  className,
  style,
  colors,
  speed = 1,
  intensity = 1,
  seed = 5,
}) => {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduce(mq.matches);
    setReduce(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const palette = colors ?? ["#10081e", "#c026d3", "#ff6a00"];
  const vars: React.CSSProperties = useMemo(
    () => ({
      ["--bg1" as any]: palette[0],
      ["--bg2" as any]: palette[1],
      ["--bg3" as any]: palette[2],
      ["--dur" as any]: `${(reduce ? 0 : 28 / Math.max(0.25, speed)).toFixed(
        2
      )}s`,
      ["--blur" as any]: `${6 + 4 * intensity}px`,
      ["--op" as any]: `${0.35 + 0.25 * intensity}`,
    }),
    [palette, intensity, speed, reduce]
  );

  // vary vertical placements via seed
  const offsets = [
    20 + (seed % 7) * 2,
    52 + (seed % 5) * 1.5,
    78 + (seed % 3) * 1.2,
  ];

  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className || "",
      ].join(" ")}
      style={{ ...vars, ...style }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 10% 10%, var(--bg1) 0%, var(--bg2) 60%, var(--bg3) 100%)",
        }}
      />
      <svg
        className="absolute inset-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="aw-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--bg2)" />
            <stop offset="60%" stopColor="var(--bg3)" />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
        </defs>
        {/* three ribbons; we animate each group horizontally */}
        <g
          style={{
            transform: "translateX(-20%)",
            animation: reduce
              ? undefined
              : "aw-slide var(--dur) linear infinite",
            opacity: "var(--op)",
            filter: `blur(var(--blur))`,
            mixBlendMode: "screen",
          }}
        >
          <path
            d={`M-10 ${offsets[0]} C 15 ${offsets[0] - 8}, 35 ${
              offsets[0] + 8
            }, 60 ${offsets[0] - 6} S 110 ${offsets[0] + 6}, 130 ${
              offsets[0] - 2
            }`}
            fill="none"
            stroke="url(#aw-grad)"
            strokeWidth={8 + 2 * intensity}
            strokeLinecap="round"
          />
          <path
            d={`M-10 ${offsets[1]} C 20 ${offsets[1] + 6}, 40 ${
              offsets[1] - 6
            }, 70 ${offsets[1] + 4} S 110 ${offsets[1] - 8}, 130 ${
              offsets[1] + 2
            }`}
            fill="none"
            stroke="url(#aw-grad)"
            strokeWidth={7 + 2 * intensity}
            strokeLinecap="round"
            opacity={0.9}
          />
          <path
            d={`M-10 ${offsets[2]} C 10 ${offsets[2] - 4}, 30 ${
              offsets[2] + 4
            }, 55 ${offsets[2] - 2} S 110 ${offsets[2] + 4}, 130 ${offsets[2]}`}
            fill="none"
            stroke="url(#aw-grad)"
            strokeWidth={6 + 2 * intensity}
            strokeLinecap="round"
            opacity={0.8}
          />
        </g>
      </svg>

      {/* fine mist */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(60% 40% at 70% 20%, rgba(255,255,255,0.06) 0%, transparent 60%)",
          mixBlendMode: "screen",
        }}
      />

      <style>{`
        @keyframes aw-slide {
          0% { transform: translateX(-20%); }
          100% { transform: translateX(20%); }
        }
      `}</style>
    </div>
  );
};

export default AuroraWaves;
