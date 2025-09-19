import type { FC } from "react";
import CTAHeroButton from "../ctaherobutton";

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

        <div className="flex w-full flex-col items-center gap-6 text-base text-white/70 text-center">
          <p className="max-w-xl text-sm leading-relaxed text-white/60 text-center sm:text-base">
            Projektujemy i wdrażamy doświadczenia cyfrowe, które łączą świetny design z mierzalnymi
            efektami. Od pierwszej koncepcji po wsparcie po starcie działamy jako Twój partner w rozwoju.
          </p>
          <CTAHeroButton
            onClick={onContactClick}
            className="pointer-events-auto"
            label="Porozmawiajmy"
          />
        </div>
      </div>
    </div>
  );
};

export default BigTitle;
