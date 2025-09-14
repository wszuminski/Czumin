import BackgroundBase from "./bggrok/BackgroundBase";
import RightBloom from "./bggrok/RightBloom";
import NebulaBackground from "./bggrok/NebulaBackground";
import TopNav from "./bggrok/TopNav";
import BigTitle from "./bggrok/BigTitle";

export default function GrokHero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <BackgroundBase />
      <RightBloom />
      <NebulaBackground fadeTop={64} fadeBottom={72} />
      <TopNav />
      <BigTitle />
      {/* Bottom left chevron */}
      <div className="pointer-events-none absolute bottom-8 left-6 z-20 opacity-80">
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
    </section>
  );
}
