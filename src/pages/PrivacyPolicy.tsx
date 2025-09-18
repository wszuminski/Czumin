import TopNav from "../components/ui/bggrok/TopNav";
import Footer from "../components/layout/Footer";

export function PrivacyPolicyPage() {
  const sections = [
    { id: "wstep", title: "Wstęp" },
    { id: "administrator", title: "Administrator danych" },
    { id: "zakres", title: "Zakres przetwarzanych danych" },
    { id: "cele", title: "Cele i podstawa prawna" },
    { id: "cookies", title: "Pliki cookies" },
    { id: "okres", title: "Okres przechowywania" },
    { id: "prawa", title: "Prawa użytkownika" },
    { id: "kontakt", title: "Kontakt" },
  ];

  return (
    <section className="relative min-h-dvh bg-black text-white">
      <TopNav />

      <div className="container px-4 pt-24 pb-16">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">Polityka prywatności</h1>
          <p className="mt-2 text-sm text-white/60">Ostatnia aktualizacja: 01.09.2025</p>
        </header>

        <nav aria-label="Spis treści" className="mb-10">
          <ul className="flex flex-wrap gap-3 text-xs text-white/70">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 hover:bg-white/10 hover:text-white"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="prose prose-invert prose-sm max-w-none">
          <section id="wstep" className="mb-8">
            <h2>Wstęp</h2>
            <p>
              Tutaj wkleisz wprowadzenie do polityki prywatności. Opisz w kilku zdaniach czym jest ten dokument,
              czego dotyczy i dla kogo został przygotowany. Zaznacz, że cenisz prywatność użytkowników oraz że
              dokument wyjaśnia sposób przetwarzania danych na Twojej stronie.
            </p>
          </section>

          <section id="administrator" className="mb-8">
            <h2>Administrator danych</h2>
            <p>
              Miejsce na dane identyfikujące administratora, np. nazwa firmy, adres e‑mail do kontaktu w sprawach
              danych osobowych oraz ewentualne inne dane kontaktowe. Dodaj także informację o podstawowych zasadach
              bezpieczeństwa i odpowiedzialności za dane.
            </p>
          </section>

          <section id="zakres" className="mb-8">
            <h2>Zakres przetwarzanych danych</h2>
            <p>
              Wypunktuj rodzaje danych, które możesz przetwarzać (np. imię, adres e‑mail, numer telefonu, dane
              przekazane w treści wiadomości, adres IP, identyfikatory cookies). Zaznacz, że zakres zależy od
              czynności użytkownika (np. przesłanie formularza, zapis na newsletter itp.).
            </p>
          </section>

          <section id="cele" className="mb-8">
            <h2>Cele i podstawa prawna</h2>
            <p>
              Opisz typowe cele: udzielenie odpowiedzi na zapytanie, realizacja umowy, prowadzenie korespondencji,
              analityka odwiedzin, zapewnienie bezpieczeństwa serwisu, marketing własny. Dla każdego celu możesz
              uzupełnić przykładową podstawę prawną (np. art. 6 ust. 1 lit. b RODO – wykonanie umowy, art. 6 ust. 1 lit. f
              RODO – uzasadniony interes administratora, art. 6 ust. 1 lit. a RODO – zgoda).
            </p>
          </section>

          <section id="cookies" className="mb-8">
            <h2>Pliki cookies</h2>
            <p>
              Dodaj informację o stosowaniu plików cookies oraz podobnych technologii, ich celach (np. niezbędne,
              analityczne, funkcjonalne), czasie życia i możliwości zarządzania nimi (panel zgód, ustawienia przeglądarki).
              Zostaw miejsce na opis narzędzi analitycznych, jeżeli z nich korzystasz.
            </p>
          </section>

          <section id="okres" className="mb-8">
            <h2>Okres przechowywania danych</h2>
            <p>
              Wpisz ogólne zasady retencji – np. dane przetwarzane do czasu realizacji celu, do czasu wygaśnięcia
              roszczeń, do momentu wycofania zgody lub wniesienia sprzeciwu; dane księgowe – zgodnie z przepisami.
            </p>
          </section>

          <section id="prawa" className="mb-8">
            <h2>Prawa użytkownika</h2>
            <p>
              Miejsce na listę praw: dostępu do danych, sprostowania, usunięcia, ograniczenia, przenoszenia,
              sprzeciwu, wycofania zgody oraz skargi do organu nadzorczego. Zostaw notę, gdzie i jak z tych praw
              skorzystać (np. poprzez formularz kontaktowy lub e‑mail).
            </p>
          </section>

          <section id="kontakt" className="mb-8">
            <h2>Kontakt</h2>
            <p>
              Wstaw tutaj preferowaną ścieżkę kontaktu w sprawach ochrony danych – e‑mail, formularz, adres
              korespondencyjny. Dodaj informację, że odpowiadasz bez zbędnej zwłoki.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </section>
  );
}

export default PrivacyPolicyPage;
