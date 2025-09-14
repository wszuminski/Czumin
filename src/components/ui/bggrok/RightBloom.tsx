import type { FC } from "react";

const RightBloom: FC = () => {
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <div
        className="pointer-events-none absolute right-[-25vw] top-[-10vh] h-[140vh] w-[85vw] blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.95), rgba(150, 180, 255, 0.55) 35%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
};

export default RightBloom;
