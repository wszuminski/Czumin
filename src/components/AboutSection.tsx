import type { FC } from "react";

const AboutSection: FC = () => {
  return (
    <section className="relative overflow-hidden bg-black py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(99,102,241,0.18),rgba(17,24,39,0)_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-indigo-500/40 via-fuchsia-500/40 to-sky-500/40" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-black/90 to-black" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
            <span className="h-1 w-1 rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400" />
            O nas
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Tworzymy doświadczenia cyfrowe, które wspierają rozwój Twojego biznesu</h2>
          <p className="mt-4 text-lg text-white/70">
            Łączymy strategię, projektowanie i technologię, aby dostarczać projekty, które działają
            szybko, wyglądają nowocześnie i są proste w utrzymaniu. Współpracujemy z zespołami,
            którym zależy na wzroście i partnerskim podejściu.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 text-sm text-white/70 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <p className="text-base font-medium text-white">Strategia &amp; konsultacje</p>
            <p className="mt-2 text-white/60">Analizujemy cele, proponujemy drogę wdrożenia i doradzamy na każdym etapie.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <p className="text-base font-medium text-white">Projektowanie bez chaosu</p>
            <p className="mt-2 text-white/60">Czytelne interfejsy, dopracowane detale i spójna komunikacja wizualna.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <p className="text-base font-medium text-white">Wdrożenie i wsparcie</p>
            <p className="mt-2 text-white/60">Stabilne rozwiązania, szybkie ładowanie i pomoc w utrzymaniu po starcie.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
