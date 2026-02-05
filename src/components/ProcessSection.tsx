import type { FC } from "react";

const processSteps = [
  {
    step: "KROK 01",
    category: "DISCOVERY",
    title: "Bezpłatna konsultacja i analiza potrzeb",
    description:
      "Zanim napiszemy pierwszą linijkę kodu, musimy zrozumieć Twój biznes. Podczas bezpłatnej rozmowy poznajemy cele, grupę docelową i wyzwania. Nie jesteśmy fabryką stron – każdy projekt traktujemy indywidualnie, bo wiemy, że gotowe szablony nie budują przewagi konkurencyjnej.",
    highlight: "Dlaczego to ważne?",
    highlightText:
      "Większość agencji przeskakuje ten etap i od razu proponuje rozwiązania. My najpierw słuchamy – dzięki temu nie płacisz za funkcje, których nie potrzebujesz.",
  },
  {
    step: "KROK 02",
    category: "STRATEGIA",
    title: "Plan działania i architektura projektu",
    description:
      "Na podstawie analizy tworzymy szczegółowy plan: struktura strony, user flow, technologie i harmonogram. Otrzymujesz przejrzysty dokument z celami, kamieniami milowymi i kosztorysem – bez ukrytych opłat i niespodzianek w trakcie projektu.",
    highlight: "Co nas wyróżnia?",
    highlightText:
      "Pracujemy w modelu fixed price z jasno określonym zakresem. Wiesz dokładnie, co otrzymasz i za ile – nie ma 'dodatkowych' faktur na koniec projektu.",
  },
  {
    step: "KROK 03",
    category: "DESIGN",
    title: "Projektowanie interfejsu i doświadczenia",
    description:
      "Tworzymy makiety i projekt wizualny, który nie tylko dobrze wygląda, ale przede wszystkim konwertuje. Każdy element – od typografii po rozmieszczenie CTA – jest przemyślany pod kątem celów biznesowych. Pokazujemy Ci projekt w Figma z pełną interakcją.",
    highlight: "Różnica w podejściu",
    highlightText:
      "Nie kopiujemy trendów dla samych trendów. Projektujemy z myślą o Twoim użytkowniku i Twoich celach – czy to lead generation, sprzedaż, czy budowanie marki.",
  },
  {
    step: "KROK 04",
    category: "DEVELOPMENT",
    title: "Budowa w nowoczesnych technologiach",
    description:
      "Strony budujemy w React i Next.js – technologiach używanych przez największe firmy świata. To oznacza błyskawiczne ładowanie, doskonałe SEO i łatwość rozbudowy w przyszłości. Kod jest czysty, udokumentowany i w pełni Twój po zakończeniu projektu.",
    highlight: "Przewaga technologiczna",
    highlightText:
      "Statyczne strony na WordPress ładują się 3-5 sekund. Nasze rozwiązania – poniżej sekundy. W erze mobile first i wymagających algorytmów Google, to nie detal – to fundament sukcesu.",
  },
  {
    step: "KROK 05",
    category: "QA & TESTY",
    title: "Testy na każdym urządzeniu i przeglądarce",
    description:
      "Przed uruchomieniem każdy projekt przechodzi rygorystyczne testy: responsywność, wydajność, dostępność (WCAG), SEO i bezpieczeństwo. Używamy narzędzi takich jak Lighthouse i WebPageTest, aby upewnić się, że Twoja strona działa idealnie wszędzie.",
    highlight: "Standard, nie dodatek",
    highlightText:
      "Testy to u nas standard, nie opcja za dopłatą. Nie oddajemy projektów 'na 90%' — uruchamiamy tylko wtedy, gdy wszystko działa bez zastrzeżeń.",
  },
  {
    step: "KROK 06",
    category: "LAUNCH",
    title: "Uruchomienie i wsparcie po starcie",
    description:
      "Dzień premiery to nie koniec współpracy – to początek nowego etapu. Konfigurujemy hosting, SSL, analitykę i monitorujemy pierwsze tygodnie działania. Otrzymujesz też 30 dni bezpłatnego wsparcia na poprawki i drobne zmiany.",
    highlight: "Partnerstwo, nie transakcja",
    highlightText:
      "Po uruchomieniu oferujemy pakiety wsparcia i rozwoju. Wielu klientów zostaje z nami na lata, bo wiedzą, że mogą na nas polegać.",
  },
];

const ProcessSection: FC = () => {
  return (
    <section id="proces" className="relative overflow-hidden bg-black py-32 sm:py-40">
      {/* Top accent line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(139,92,246,0.06),transparent_60%)]" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="mb-20 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-6 inline-block font-mono text-xs uppercase tracking-[0.25em] text-white/40">
              [ Proces ]
            </span>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Jak działamy
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-white/50 sm:text-right">
            Przejrzysty proces, który daje Ci kontrolę i pewność na każdym etapie. Bez niespodzianek, bez ukrytych kosztów.
          </p>
        </div>

        {/* Process Steps */}
        <div className="space-y-0">
          {processSteps.map((item) => (
            <article
              key={item.step}
              className="group relative border-t border-white/[0.08] py-12 transition-colors duration-300 first:border-t-0 hover:bg-white/[0.01] lg:py-16"
            >
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Left column - Step indicator */}
                <div className="lg:col-span-2">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/30">
                    {item.step}
                  </span>
                </div>

                {/* Middle column - Main content */}
                <div className="lg:col-span-6">
                  <h3 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-white/50 sm:text-lg">
                    {item.description}
                  </p>

                  {/* Category and Read more */}
                  <div className="mt-8 flex items-center gap-6">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-violet-400/70">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Right column - Highlight box */}
                <div className="lg:col-span-4">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors duration-300 group-hover:border-violet-500/20 group-hover:bg-white/[0.03]">
                    <span className="text-sm font-medium text-violet-400/80">
                      {item.highlight}
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-white/45">
                      {item.highlightText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hover indicator line */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </article>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 border-t border-white/[0.08] pt-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                Gotowy, żeby zacząć?
              </h3>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/50">
                Umów się na bezpłatną konsultację. Porozmawiamy o Twoim projekcie, odpowiemy na pytania i przedstawimy wstępną wycenę – bez zobowiązań.
              </p>
            </div>
            <div className="flex items-center lg:justify-end">
              <a
                href="#kontakt"
                className="group/btn inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-8 py-4 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-500/10"
              >
                <span>Umów rozmowę</span>
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
