import type { FC } from "react";

const BigTitle: FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center">
      <h1
        className="leading-none tracking-tight drop-shadow-[0_20px_80px_rgba(0,0,0,0.8)] bg-clip-text text-transparent"
        style={{
          fontWeight: 700,
          fontSize: "clamp(120px, 22vw, 420px)",
          letterSpacing: "-0.02em",
          textShadow: "0 0 60px rgba(120,170,255,0.25)",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.70) 0%, rgba(255,255,255,0.92) 45%, rgba(255,255,255,0.98) 70%, rgba(255,255,255,1) 100%)",
        }}
      >
        Czumin
      </h1>
    </div>
  );
};

export default BigTitle;
