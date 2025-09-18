import BackgroundBase from "./bggrok/BackgroundBase";
import RightBloom from "./bggrok/RightBloom";
import NebulaBackground from "./bggrok/NebulaBackground";
import TopNav from "./bggrok/TopNav";
import BigTitle from "./bggrok/BigTitle";

interface GrokHeroProps {
  introComplete?: boolean;
  onContactClick?: () => void;
}

export default function GrokHero({ introComplete = true, onContactClick }: GrokHeroProps) {
  const ready = introComplete;

  return (
    <section
      className={`relative min-h-screen w-full overflow-hidden bg-black text-white transition-all duration-700 ease-out transform-gpu ${
        ready ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-6"
      }`}
    >
      <BackgroundBase />
      <RightBloom />
      <NebulaBackground fadeTop={64} fadeBottom={72} />
      <TopNav onContactClick={onContactClick} />
      <BigTitle onContactClick={onContactClick} />
      {/* Bottom chevron aligned to nav/container left edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 opacity-80">
        <div className="container px-4">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4v16M12 20l-4-4M12 20l4-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
