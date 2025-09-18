import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Link as LinkIcon, CheckCircle2, ChevronDown, Quote, Star } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import type { CaseStudy } from "../data/case-studies";
import { caseStudies } from "../data/case-studies";
import TopNav from "../components/ui/bggrok/TopNav";
import CaseMediaGrid from "../components/case/CaseMediaGrid";
// Inline trust/FAQ section below
import Footer from "../components/layout/Footer";
import ContactModal from "../components/ContactModal";

// Case-specific copy used to render concrete, sales-focused content
const caseCopy: Record<number, {
  goal: string;
  result: string;
  testimonial?: { text: string; author: string };
  metrics?: string[];
  focusLine?: string;
}> = {
  2: {
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
    goal: "Sprzedaż planów online bez zbędnych wiadomości na priv.",
    result: "Wideo pod sekcją główną + opinie i metamorfozy, do tego płatności online — zakup w kilka kliknięć prosto na stronie.",
    testimonial: {
      text: "Najwięcej daje mi to, że ktoś po obejrzeniu wideo i opinii od razu kupuje plan. Mniej korespondencji, więcej transakcji z samej strony.",
      author: "Eryk Jankowski, trener personalny",
    },
    metrics: ["Wideo pod sekcją główną ", "Opinie + metamorfozy", "Płatności online"],
    focusLine: "Karta sprzedażowa z natychmiastową możliwością zakupu.",
  },
  5: {
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


const TrustSection = ({ testimonial, metrics, focusLine }: { testimonial?: { text: string; author: string }; metrics?: string[]; focusLine?: string }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [contactOpen, setContactOpen] = useState(false);
  const faqs = [
    { q: "Ile trwa realizacja projektu?", a: "Standardowa realizacja strony to około 2 tygodnie, w zależności od zakresu. W pilnych przypadkach możemy pracować w trybie przyspieszonym." },
    { q: "Czy pomagasz w treściach i zdjęciach?", a: "Tak. Przygotuję prostą strukturę treści, doradzę w ujęciach i podpowiem co zrobić, by wypaść wiarygodnie i atrakcyjnie dla klienta." },
    { q: "Jak wygląda płatność?", a: "Najczęściej 50% zaliczki na start i 50% po akceptacji efektu. " },
    { q: "Czy po zakończeniu projektu mogę łatwo edytować stronę?", a: "Tak. Po zakończeniu projektu zapewniam stały kontakt w razie chęci wprowadzenia zmian lub poprawek" },
  ];
  return (
    <section className="relative mt-12 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-500/10 via-transparent to-violet-500/10" />
      <div className="container px-4">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Dlaczego warto i FAQ</h2>
          <p className="text-sm text-white/70">Konkretne efekty, spokojny proces i szybka komunikacja.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Co mówią klienci</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={16} fill="currentColor" />))}
              </div>
              <blockquote className="relative rounded-xl border border-white/10 bg-black/40 p-4 text-sm leading-relaxed text-white/80">
                <Quote className="absolute -left-3 -top-3 h-6 w-6 text-white/20" />
                {testimonial?.text || "Współpraca przebiegła sprawnie, a strona realnie pomaga w pozyskiwaniu kontaktów."}
                <footer className="mt-3 text-xs text-white/60">— {testimonial?.author || "Klient z branży fitness"}</footer>
              </blockquote>
              <div className="flex flex-wrap gap-2 text-xs">
                {(metrics && metrics.length > 0 ? metrics : ["Szybkie ładowanie", "Czytelna oferta", "Wyraźne CTA"]).map((m) => (
                  <span key={m} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/80">{m}</span>
                ))}
              </div>
              <div className="mt-2 rounded-lg border border-white/10 bg-gradient-to-r from-indigo-500/10 via-transparent to-violet-500/10 p-4">
                <p className="text-xs text-white/70">{focusLine || `Dla tego projektu skupiliśmy się na czytelnej ofercie i szybkim kontakcie.`}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Najczęstsze pytania</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-white/10">
              {faqs.map((f, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <button key={idx} className="group w-full py-3 text-left" onClick={() => setOpenIdx(isOpen ? null : idx)}>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium text-white/90">{f.q}</p>
                      <ChevronDown className="h-4 w-4 text-white/60 transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : undefined }} />
                    </div>
                    <div className="overflow-hidden text-sm text-white/70 transition-all" style={{ maxHeight: isOpen ? '160px' : 0, paddingTop: isOpen ? '0.5rem' : 0 }}>{f.a}</div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
        <Card className="mt-6 border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-white text-base font-semibold">Porozmawiajmy o Twoim projekcie</h3>
              <ul className="mt-2 grid gap-1 text-sm text-white/70 sm:grid-cols-3">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Szybki start i prosta komunikacja</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Projekt pod wyniki (konwersja)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Utrzymanie i wsparcie po wdrożeniu</li>
              </ul>
            </div>
            <Button onClick={() => setContactOpen(true)} className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-400">Skontaktuj się</Button>
          </CardContent>
        </Card>
      </div>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  )
}


const statusCopy: Record<CaseStudy["status"], string> = {
  completed: "Skończony projekt",
  "in-progress": "W trakcie realizacji",
  pending: "W kolejce",
};

const statusColors: Record<CaseStudy["status"], string> = {
  completed: "bg-emerald-600 text-white border-emerald-400/40",
  "in-progress": "bg-amber-500 text-black border-amber-200/60",
  pending: "bg-slate-800 text-white border-slate-500/60",
};

export function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const caseStudy = useMemo(
    () => caseStudies.find((item) => item.id === Number(caseId)),
    [caseId]
  );

  if (!caseStudy) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-black text-white px-6 py-24">
        <div className="max-w-md space-y-6 text-center">
          <h1 className="text-3xl font-semibold">Nie znaleziono projektu</h1>
          <p className="text-white/70 text-sm">
            Wygląda na to, że ten projekt nie istnieje lub został przeniesiony.
          </p>
          <Button
            variant="outline"
            className="border-white/40 text-white hover:bg-white/10"
            onClick={() => navigate("/")}
          >
            Wróć do osi czasu
          </Button>
        </div>
      </div>
    );
  }

  const relatedItems = caseStudy.relatedIds
    .map((relatedId) => caseStudies.find((item) => item.id === relatedId))
    .filter(Boolean) as CaseStudy[];

  const copy = caseCopy[caseStudy.id];

  return (
    <section className="relative min-h-dvh bg-black text-white px-4 pt-20 pb-12 sm:pt-24 sm:pb-16">
      <TopNav />
      <div className="container flex w-full flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Wróć
          </Button>
          <Badge className={`border ${statusColors[caseStudy.status]}`}>
            {statusCopy[caseStudy.status]}
          </Badge>
        </div>

        <Card className="border-white/10 bg-white/5 text-white shadow-2xl">
          <CardHeader className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 overflow-hidden">
                <img
                  src={caseStudy.logo}
                  alt={`${caseStudy.title} logo`}
                  className="h-full w-full rounded-full object-contain"
                  style={{ padding: 6, boxSizing: "border-box" }}
                  draggable={false}
                />
              </span>
              <div>
                <CardTitle className="text-white text-2xl sm:text-3xl">
                  {caseStudy.title}
                </CardTitle>
                <p className="text-sm text-white/60">{caseStudy.date}</p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3 text-xs text-white/60">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
                {caseStudy.category}
              </span>
              <span className="font-mono text-sm">Satisfaction: {caseStudy.energy}%</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-relaxed text-white/80">
            <p>{caseStudy.content}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                <h2 className="text-xs uppercase tracking-wider text-white/60">Cel projektu</h2>
                <p className="mt-2 text-sm text-white/80">{copy?.goal || "Skoncentrowany na osobach trenujących — prosta ścieżka do kontaktu."}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                <h2 className="text-xs uppercase tracking-wider text-white/60">Rezultat</h2>
                <p className="mt-2 text-sm text-white/80">{copy?.result || "Lekka strona z wyraźnym CTA i odpowiedziami na najczęstsze pytania."}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-black/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-white/50">Kategoria</p>
                <p className="mt-2 text-sm font-medium text-white">{caseStudy.category}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-white/50">Status</p>
                <p className="mt-2 text-sm font-medium text-white">{statusCopy[caseStudy.status]}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-white/50">Satysfakcja</p>
                <p className="mt-2 text-sm font-medium text-white">{caseStudy.energy}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {relatedItems.length > 0 && (
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">
                Powiązane projekty
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {relatedItems.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:bg-white/10"
                  onClick={() => navigate(`/cases/${item.id}`)}
                >
                  <LinkIcon className="mr-2 h-4 w-4 text-white/60" />
                  {item.title}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Gallery */}
        <CaseMediaGrid caseId={caseStudy.id} />
      </div>
      {/* Trust + FAQ + CTA section */}
      <TrustSection testimonial={copy?.testimonial} metrics={copy?.metrics} focusLine={copy?.focusLine} />
      <Footer />
    </section>
  );
}

export default CaseDetailPage;
