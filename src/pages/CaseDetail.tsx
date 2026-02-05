import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, Quote, Star, CheckCircle2 } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import type { CaseStudy } from "../data/case-studies";
import { caseStudies } from "../data/case-studies";
import { caseMedia } from "../data/case-media";
import TopNav from "../components/ui/bggrok/TopNav";
import Footer from "../components/layout/Footer";
import ContactModal from "../components/ContactModal";

// Case-specific copy
const caseCopy: Record<number, {
  goal: string;
  result: string;
  intro: string; // Short 2-sentence intro for hero
  testimonial?: { text: string; author: string };
  metrics?: string[];
  focusLine?: string;
}> = {
  2: {
    intro: "Strona dla studia treningowego Akademia Ruchu — skupiona na szybkim kontakcie i czytelnej ofercie. Zaprojektowana tak, by klient od razu widział zakres usług i mógł umówić trening jednym kliknięciem.",
    goal: "Szybka ścieżka kontaktu i czytelna oferta dla studia treningowego.",
    result: "Z pierwszego ekranu widać zakres usług i wyraźne 'Umów trening'. Mniej klikania, więcej zapytań z jednego ekranu.",
    testimonial: {
      text: "Ze strony jestem bardzo zadowolony — zrobione szybko i dokładnie tak, jak chciałem. Na każdym etapie miałem info o zmianach. Najważniejsze: klienci łatwiej do mnie trafiają.",
      author: "Właściciel Akademii Ruchu",
    },
    metrics: ["CTA nad foldem", "SEO: usługi + lokalizacja", "Szybkie ładowanie"],
    focusLine: "Skupiliśmy się na widocznym CTA i prostej strukturze treści.",
  },
  3: {
    intro: "Strona sprzedażowa dla trenera Eryka Jankowskiego — nastawiona na sprzedaż planów online bez konieczności pisania na priv. Wideo, opinie i płatności w jednym miejscu.",
    goal: "Sprzedaż planów online bez zbędnych wiadomości na priv.",
    result: "Wideo pod sekcją główną + opinie i metamorfozy, do tego płatności online — zakup w kilka kliknięć prosto na stronie.",
    testimonial: {
      text: "Najwięcej daje mi to, że ktoś po obejrzeniu wideo i opinii od razu kupuje plan. Mniej korespondencji, więcej transakcji z samej strony.",
      author: "Eryk Jankowski, trener personalny",
    },
    metrics: ["Wideo pod sekcją główną", "Opinie + metamorfozy", "Płatności online"],
    focusLine: "Karta sprzedażowa z natychmiastową możliwością zakupu.",
  },
  5: {
    intro: "Wizytówka online dla trenera Bartka Węgielnika — spójna z jego Instagramem, by klienci od razu rozpoznawali markę. Jasna oferta i formularz kontaktu zamiast DMs.",
    goal: "Ułatwić poznanie oferty i zostawienie kontaktu.",
    result: "Wizytówka spójna z Instagramem, jasna karta oferty ('Co dostajesz' i 'Dla kogo') oraz formularz w kluczowych miejscach — szybkie zapytania bez DMs.",
    testimonial: {
      text: "Wreszcie mogę pokazać ofertę w jednym miejscu i zbierać zapytania bez odsyłania ludzi do DM. Strona wygląda jak mój Instagram — klienci od razu kojarzą, że to ja.",
      author: "Bartek Węgielnik, trener",
    },
    metrics: ["Wygląda jak Instagram", "Co dostajesz / Dla kogo", "Formularz w kluczowych miejscach"],
    focusLine: "Szybkie rozpoznanie marki + prosty formularz kontaktu.",
  },
  4: {
    intro: "Strona dla trenera Marcela Kaczmarka — przejście od treningów 1:1 do sprzedaży planów online. Skupiona na pokazaniu efektów podopiecznych i prowadzeniu do wyboru planu.",
    goal: "Odejść od samych treningów 1:1 i sprzedawać plany online.",
    result: "Najpierw dowody skuteczności (case'y, zdjęcia przed/po), potem ścieżka: 'Zobacz efekty' → 'Wybierz plan' → 'Wyceń indywidualnie'. Więcej konkretnych zapytań.",
    testimonial: {
      text: "Strona pokazuje efekty moich podopiecznych i prowadzi do wyboru planu. Dzięki temu mam mniej rozmów wstępnych, a więcej konkretnych zapytań o współpracę.",
      author: "Marcel Kaczmarek, trener",
    },
    metrics: ["Case'y + przed/po", "Wybór planu", "Zapytanie o wycenę"],
    focusLine: "Sekwencja: dowód → wybór → kontakt.",
  },
  1: {
    intro: "Wizytówka dla trenera Artura Stawiaka — prosta strona z czytelną ofertą i CTA 'Umów konsultację'. Zaprojektowana, by zapełnić grafik i ułatwić przejście na pełen etat.",
    goal: "Lepiej przedstawić ofertę i zapełnić grafik, by przejść na pełen etat.",
    result: "Prosta strona-wizytówka z czytelną ofertą, CTA 'Umów konsultację' i sekcją FAQ. Po starcie: 150 odwiedzin, 15% kliknęło w kontakt.",
    testimonial: {
      text: "Potrzebowałem prostej strony, która pomoże mi zapełnić grafik. Po wdrożeniu widzę wyraźny wzrost kontaktów i łatwiejsze umawianie treningów.",
      author: "Artur Stawiak, trener",
    },
    metrics: ["15% kliknięć w kontakt", "CTA 'Umów konsultację'", "Sekcja FAQ"],
    focusLine: "Jasna oferta + mocne CTA + FAQ.",
  },
};

// Rich image descriptions for gallery
const imageDescriptions = [
  {
    title: "Sekcja hero z wyraźnym CTA",
    description: "Pierwsza rzecz, którą widzi odwiedzający. Duże, czytelne CTA 'Umów trening' lub 'Skontaktuj się' — bez rozpraszaczy. Kluczowy przekaz marki i propozycja wartości od razu widoczne."
  },
  {
    title: "Prezentacja oferty i wartości",
    description: "Sekcja pokazująca zakres usług i unikalne cechy. Każdy element zaprojektowany tak, by odwiedzający szybko zrozumiał, co dostanie i dlaczego warto wybrać tę ofertę."
  },
  {
    title: "Sekcja O mnie budująca zaufanie",
    description: "Osobista historia trenera, certyfikaty i doświadczenie. Zdjęcia, które pokazują profesjonalizm i podejście do pracy. Buduje relację jeszcze przed pierwszym kontaktem."
  },
  {
    title: "Opinie i dowody społeczne",
    description: "Realne opinie klientów i efekty współpracy. Zdjęcia przed/po, cytaty i oceny — wszystko, co potwierdza skuteczność i buduje wiarygodność."
  },
  {
    title: "Struktura treści i nawigacja",
    description: "Przejrzysty układ strony, który prowadzi odwiedzającego przez kolejne sekcje. Logiczna ścieżka od zainteresowania do kontaktu — bez zbędnych kliknięć."
  },
  {
    title: "Sekcja kontaktowa",
    description: "Prosty formularz kontaktu lub przycisk do umówienia wizyty. Bez zbędnych pól — tylko to, co potrzebne. Wyraźne CTA i szybka ścieżka do działania."
  },
];

const statusCopy: Record<CaseStudy["status"], string> = {
  completed: "Zakończony",
  "in-progress": "W realizacji",
  pending: "W kolejce",
};

const statusColors: Record<CaseStudy["status"], string> = {
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "in-progress": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  pending: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

// ═══════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════
interface HeroSectionProps {
  caseStudy: CaseStudy;
  intro?: string;
  onBack: () => void;
}

const HeroSection = ({ caseStudy, intro, onBack }: HeroSectionProps) => (
  <section className="relative px-4 pt-24 pb-16 sm:pt-32 sm:pb-24">
    <div className="mx-auto max-w-5xl">
      {/* Back button */}
      <button
        onClick={onBack}
        className="group mb-12 flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Wróć do projektów</span>
      </button>

      {/* Title */}
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
        {caseStudy.title}
      </h1>
      <p className="mt-4 text-lg text-white/50">{caseStudy.date}</p>

      {/* Intro paragraph */}
      {intro && (
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/70">
          {intro}
        </p>
      )}

      {/* Stats row */}
      <div className="mt-12 flex flex-wrap items-center gap-4 sm:gap-6">
        {/* Satisfaction - Most prominent */}
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3">
          <span className="text-3xl font-bold text-emerald-400">{caseStudy.energy}%</span>
          <span className="text-sm text-emerald-400/80">Satysfakcja</span>
        </div>

        {/* Category */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="text-sm text-white/60">Kategoria</span>
          <p className="text-white font-medium">{caseStudy.category}</p>
        </div>

        {/* Status */}
        <Badge className={`border px-4 py-2 text-sm ${statusColors[caseStudy.status]}`}>
          {statusCopy[caseStudy.status]}
        </Badge>
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════
// VISUAL SHOWCASE SECTION (Full-width stacked)
// ═══════════════════════════════════════════════════════════════════════════
interface VisualShowcaseProps {
  caseId: number;
}

const VisualShowcase = ({ caseId }: VisualShowcaseProps) => {
  const media = caseMedia[caseId] ?? [];

  if (media.length === 0) return null;

  return (
    <section className="relative px-4 py-16 sm:py-24">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute right-1/4 top-2/3 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl">
        <h2 className="mb-16 text-2xl font-semibold text-white sm:text-3xl">
          Realizacje projektu
        </h2>

        {/* Full-width stacked images */}
        <div className="flex flex-col gap-20">
          {media.map((src, i) => {
            const desc = imageDescriptions[i % imageDescriptions.length];
            return (
              <figure key={i} className="group">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/50 transition-all duration-500 hover:border-white/20 hover:shadow-emerald-500/10">
                  <img
                    src={src}
                    alt={desc.title}
                    loading="lazy"
                    className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  />
                </div>
                <figcaption className="mt-6 px-2">
                  <h3 className="text-lg font-medium text-white">{desc.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-white/60">
                    {desc.description}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT DETAILS SECTION
// ═══════════════════════════════════════════════════════════════════════════
interface ProjectDetailsProps {
  goal: string;
  result: string;
}

const ProjectDetails = ({ goal, result }: ProjectDetailsProps) => (
  <section className="relative px-4 py-16 sm:py-24">
    <div className="mx-auto max-w-5xl">
      <h2 className="mb-12 text-2xl font-semibold text-white sm:text-3xl">
        Szczegóły projektu
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Goal Card */}
        <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:from-white/10">
          <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-emerald-400">
            Cel projektu
          </h3>
          <p className="text-lg leading-relaxed text-white/80">
            {goal}
          </p>
        </div>

        {/* Result Card */}
        <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:from-white/10">
          <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-emerald-400">
            Rezultat
          </h3>
          <p className="text-lg leading-relaxed text-white/80">
            {result}
          </p>
        </div>
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════
// TRUST & CTA SECTION
// ═══════════════════════════════════════════════════════════════════════════
interface TrustSectionProps {
  testimonial?: { text: string; author: string };
  metrics?: string[];
  focusLine?: string;
}

const TrustSection = ({ testimonial, metrics, focusLine }: TrustSectionProps) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [contactOpen, setContactOpen] = useState(false);

  const faqs = [
    { q: "Ile trwa realizacja projektu?", a: "Standardowa realizacja strony to około 2 tygodnie, w zależności od zakresu. W pilnych przypadkach możemy pracować w trybie przyspieszonym." },
    { q: "Czy pomagasz w treściach i zdjęciach?", a: "Tak. Przygotuję prostą strukturę treści, doradzę w ujęciach i podpowiem co zrobić, by wypaść wiarygodnie i atrakcyjnie dla klienta." },
    { q: "Jak wygląda płatność?", a: "Najczęściej 50% zaliczki na start i 50% po akceptacji efektu." },
    { q: "Czy po zakończeniu projektu mogę łatwo edytować stronę?", a: "Tak. Po zakończeniu projektu zapewniam stały kontakt w razie chęci wprowadzenia zmian lub poprawek." },
  ];

  return (
    <section className="relative px-4 py-16 sm:py-24">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />

      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">
          Dlaczego warto
        </h2>
        <p className="mb-12 text-white/50">
          Konkretne efekty, spokojny proces i szybka komunikacja.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Testimonial Card */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white">Co mówią klienci</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <blockquote className="relative rounded-xl border border-white/10 bg-black/40 p-5 text-white/80">
                <Quote className="absolute -left-2 -top-2 h-5 w-5 text-emerald-500/50" />
                <p className="leading-relaxed">
                  {testimonial?.text || "Współpraca przebiegła sprawnie, a strona realnie pomaga w pozyskiwaniu kontaktów."}
                </p>
                <footer className="mt-4 text-sm text-white/50">
                  — {testimonial?.author || "Klient z branży fitness"}
                </footer>
              </blockquote>

              <div className="flex flex-wrap gap-2">
                {(metrics?.length ? metrics : ["Szybkie ładowanie", "Czytelna oferta", "Wyraźne CTA"]).map((m) => (
                  <span key={m} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                    {m}
                  </span>
                ))}
              </div>

              {focusLine && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="text-sm text-emerald-400/80">{focusLine}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* FAQ Card */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white">Najczęstsze pytania</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-white/10">
              {faqs.map((f, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <button
                    key={idx}
                    className="group w-full py-4 text-left"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium text-white/90">{f.q}</p>
                      <ChevronDown
                        className="h-4 w-4 shrink-0 text-white/40 transition-transform duration-300"
                        style={{ transform: isOpen ? 'rotate(180deg)' : undefined }}
                      />
                    </div>
                    <div
                      className="overflow-hidden text-sm leading-relaxed text-white/60 transition-all duration-300"
                      style={{
                        maxHeight: isOpen ? '100px' : 0,
                        opacity: isOpen ? 1 : 0,
                        marginTop: isOpen ? '0.75rem' : 0,
                      }}
                    >
                      {f.a}
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-white/5 to-indigo-500/10 p-8 backdrop-blur-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Porozmawiajmy o Twoim projekcie
              </h3>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Szybki start
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Projekt pod konwersję
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Wsparcie po wdrożeniu
                </li>
              </ul>
            </div>
            <Button
              onClick={() => setContactOpen(true)}
              className="shrink-0 rounded-full bg-emerald-500 px-8 py-3 text-black font-medium transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              Skontaktuj się
            </Button>
          </div>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const caseStudy = useMemo(
    () => caseStudies.find((item) => item.id === Number(caseId)),
    [caseId]
  );

  if (!caseStudy) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-black px-6 py-24 text-white">
        <div className="max-w-md space-y-6 text-center">
          <h1 className="text-3xl font-semibold">Nie znaleziono projektu</h1>
          <p className="text-sm text-white/60">
            Wygląda na to, że ten projekt nie istnieje lub został przeniesiony.
          </p>
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => navigate("/")}
          >
            Wróć do strony głównej
          </Button>
        </div>
      </div>
    );
  }

  const copy = caseCopy[caseStudy.id];

  return (
    <div className="min-h-dvh bg-black text-white">
      <TopNav />

      <HeroSection caseStudy={caseStudy} intro={copy?.intro} onBack={() => navigate(-1)} />

      <VisualShowcase caseId={caseStudy.id} />

      <ProjectDetails
        goal={copy?.goal || "Skoncentrowany na osobach trenujących — prosta ścieżka do kontaktu."}
        result={copy?.result || "Lekka strona z wyraźnym CTA i odpowiedziami na najczęstsze pytania."}
      />

      <TrustSection
        testimonial={copy?.testimonial}
        metrics={copy?.metrics}
        focusLine={copy?.focusLine}
      />

      <Footer />
    </div>
  );
}

export default CaseDetailPage;
