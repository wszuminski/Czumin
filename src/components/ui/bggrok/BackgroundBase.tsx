import type { FC } from "react";

const BackgroundBase: FC = () => (
  <div
    aria-hidden
    className="absolute inset-0 -z-20 bg-gradient-to-b from-black via-[#04070e] to-[#02030a]"
  />
);

export default BackgroundBase;

