import type { FC } from "react";

const steps = [
  {
    number: "01",
    title: "Rozmowa",
    description:
      "Poznajemy Twój biznes, cele i oczekiwania. Wspólnie ustalamy zakres i kierunek projektu.",
  },
  {
    number: "02",
    title: "Strategia",
    description:
      "Opracowujemy plan działania, czyli całą strukturę, funkcjonalności i harmonogram wdrożenia.",
  },
  {
    number: "03",
    title: "Projektowanie",
    description:
      "Tworzymy makiety i projekt wizualny, który oddaje charakter Twojej marki.",
  },
  {
    number: "04",
    title: "Wdrożenie",
    description:
      "Budujemy stronę w nowoczesnych technologiach, szybką, responsywną i skalowalną.",
  },
  {
    number: "05",
    title: "Testy",
    description:
      "Sprawdzamy działanie na każdym urządzeniu, optymalizujemy wydajność i SEO.",
  },
  {
    number: "06",
    title: "Uruchomienie",
    description:
      "Publikujemy stronę i zapewniamy wsparcie po starcie, jesteśmy z Tobą na dalszym etapie.",
  },
];

const ProcessSection: FC = () => {
  return (
    <section className="relative overflow-hidden bg-black py-32 sm:py-40">
      {/* Top neon line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,rgba(139,92,246,0.08),transparent_70%)]" />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-black/90 to-black" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-violet-500/20 bg-violet-500/[0.06] px-5 py-1.5 text-xs uppercase tracking-[0.2em] text-violet-300/80">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400" />
            </span>
            Proces
          </span>
          <h2 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Jak działamy
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            Od pierwszej rozmowy do uruchomienia, mamy przejrzysty proces, w którym wiesz co się dzieje na każdym etapie.
          </p>
        </div>

        {/* Timeline */}
        <div className="mx-auto mt-16 max-w-5xl lg:mt-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-colors duration-300 hover:border-violet-500/25 hover:bg-white/[0.04]"
              >
                {/* Top glow on hover */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Step number */}
                <span className="mb-4 block font-mono text-sm tracking-wider text-violet-400/70">
                  {step.number}
                </span>

                {/* Connector dot */}
                <div className="absolute -right-[13px] top-10 hidden h-[7px] w-[7px] rounded-full border border-violet-500/40 bg-black sm:block lg:hidden" />
                {i < steps.length - 1 && (
                  <div className="pointer-events-none absolute -right-6 top-[52px] hidden h-px w-6 bg-gradient-to-r from-violet-500/20 to-transparent sm:block lg:hidden" />
                )}

                <p className="text-lg font-medium text-white">{step.title}</p>
                <p className="mt-3 leading-relaxed text-white/45">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
