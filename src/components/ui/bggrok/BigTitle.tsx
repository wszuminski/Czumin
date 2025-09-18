import type { FC } from "react";

interface BigTitleProps {
  onContactClick?: () => void;
}

const BigTitle: FC<BigTitleProps> = ({ onContactClick }) => {
  return (
    <div className="absolute inset-0 z-0 flex select-none flex-col items-center justify-end">
      <div className="pointer-events-auto container flex max-w-4xl flex-col items-center px-4 pb-28 text-center sm:pb-32">
        <h1
          className="heading-grok leading-none tracking-tight text-[clamp(64px,18vw,220px)] md:text-[clamp(120px,22vw,420px)]"
          style={{
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textShadow: "0 0 60px rgba(120,170,255,0.25)",
            fontFamily: '"Share Tech", var(--font-heading)',
          }}
        >
          Czumin
        </h1>

        <div className="mt-8 flex w-full flex-col items-center gap-5 text-base text-white/70 sm:flex-row sm:justify-center sm:gap-8">
          <p className="max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Projektujemy i wdrażamy doświadczenia cyfrowe, które łączą świetny design z mierzalnymi
            efektami. Od pierwszej koncepcji po wsparcie po starcie działamy jako Twój partner w rozwoju.
          </p>
          <button
            type="button"
            onClick={onContactClick}
            className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_20px_60px_rgba(99,102,241,0.35)] transition-transform hover:scale-[1.03] hover:shadow-[0_24px_70px_rgba(129,140,248,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-black"
          >
            Porozmawiajmy
          </button>
        </div>
      </div>
    </div>
  );
};

export default BigTitle;
