import type { FC } from "react";

const RightBloom: FC = () => {
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <div
        className="pointer-events-none absolute right-[-25vw] top-[-10vh] h-[140vh] w-[85vw]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.85), rgba(150, 180, 255, 0.45) 35%, rgba(0,0,0,0) 65%)",
          filter: "blur(60px)",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
};

export default RightBloom;
