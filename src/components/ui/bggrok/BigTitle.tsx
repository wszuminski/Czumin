import type { FC } from "react";

const BigTitle: FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center">
      <h1
        className="heading-grok leading-none tracking-tight -mb-[19.75rem] text-[clamp(64px,18vw,220px)] md:text-[clamp(120px,22vw,420px)]"
        style={{
          fontWeight: 700,
          letterSpacing: "-0.02em",
          textShadow: "0 0 60px rgba(120,170,255,0.25)",
          fontFamily: '"Share Tech", var(--font-heading)',
        }}
      >
        Czumin
      </h1>
    </div>
  );
};

export default BigTitle;
