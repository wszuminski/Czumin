import type { FC } from "react";

const AboutSection: FC = () => {
  return (
    <section id="o-nas" className="relative overflow-hidden bg-black py-32 sm:py-40 lg:py-48">
      {/* Top neon accent line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-indigo-500/40 via-fuchsia-500/50 to-violet-500/40 blur-[1px]" />

      {/* Main radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_0%,rgba(139,92,246,0.15),rgba(99,102,241,0.08)_40%,rgba(17,24,39,0)_70%)]" />

      {/* Secondary subtle glow bottom-center */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_100%,rgba(139,92,246,0.06),transparent_60%)]" />

      {/* Side accent glows */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-violet-500/20 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-black/90 to-black" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-violet-500/20 bg-violet-500/[0.06] px-5 py-1.5 text-xs uppercase tracking-[0.2em] text-violet-300/80">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400" />
            </span>
            O nas
          </span>
          <h2 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Tworzymy doświadczenia cyfrowe, które wspierają rozwój Twojego biznesu
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            Łączymy strategię, projektowanie i technologię, aby dostarczać projekty, które działają
            szybko, wyglądają nowocześnie i są proste w utrzymaniu. Współpracujemy z zespołami,
            którym zależy na wzroście i partnerskim podejściu.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-5 sm:grid-cols-3 lg:mt-20">
          <div className="group relative rounded-2xl border border-violet-500/15 bg-white/[0.03] p-8 backdrop-blur-sm transition-colors duration-300 hover:border-violet-500/30 hover:bg-white/[0.05]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <p className="text-lg font-medium text-white">Strategia &amp; konsultacje</p>
            <p className="mt-3 leading-relaxed text-white/50">Analizujemy cele, proponujemy drogę wdrożenia i doradzamy na każdym etapie.</p>
          </div>

          <div className="group relative rounded-2xl border border-violet-500/15 bg-white/[0.03] p-8 backdrop-blur-sm transition-colors duration-300 hover:border-violet-500/30 hover:bg-white/[0.05]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <p className="text-lg font-medium text-white">Projektowanie bez chaosu</p>
            <p className="mt-3 leading-relaxed text-white/50">Czytelne interfejsy, dopracowane detale i spójna komunikacja wizualna.</p>
          </div>

          <div className="group relative rounded-2xl border border-violet-500/15 bg-white/[0.03] p-8 backdrop-blur-sm transition-colors duration-300 hover:border-violet-500/30 hover:bg-white/[0.05]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <p className="text-lg font-medium text-white">Wdrożenie i wsparcie</p>
            <p className="mt-3 leading-relaxed text-white/50">Stabilne rozwiązania, szybkie ładowanie i pomoc w utrzymaniu po starcie.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
