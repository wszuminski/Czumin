import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/ui/bggrok/TopNav";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";

export function PrivacyPolicyPage() {
  const navigate = useNavigate();
  const sections = [
    { id: "informacje-ogolne", title: "1. Informacje ogólne" },
    { id: "metody-ochrony", title: "2. Wybrane metody ochrony danych" },
    { id: "hosting", title: "3. Hosting" },
    { id: "prawa-dodatkowe", title: "4. Twoje prawa i informacje" },
    { id: "informacje-w-formularzach", title: "5. Informacje w formularzach" },
    { id: "logi-administratora", title: "6. Logi Administratora" },
    { id: "techniki-marketingowe", title: "7. Istotne techniki marketingowe" },
    { id: "cookies-info", title: "8. Informacja o plikach cookies" },
    { id: "zarzadzanie-cookies", title: "9. Zarządzanie plikami cookies" },
  ];

  return (
    <section className="relative min-h-dvh bg-black text-white">
      <TopNav />

      <div className="container px-4 pt-24 pb-16">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Powrót
          </Button>
        </div>

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
          <section id="informacje-ogolne" className="mb-8">
            <h2>1. Informacje ogólne</h2>
            <p>
              Niniejsza polityka dotyczy Serwisu www, funkcjonującego pod adresem url: <strong>czumin.pl</strong>
            </p>
            <p>
              Operatorem serwisu oraz Administratorem danych osobowych jest: <strong>Wojciech Szumiński</strong>, ul. Grójecka 71/73 m.44, Warszawa.
            </p>
            <p>
              Adres kontaktowy poczty elektronicznej operatora: <a href="mailto:wojciechszuminski0@gmail.com">wojciechszuminski0@gmail.com</a>
            </p>
            <p>
              Operator jest Administratorem Twoich danych osobowych w odniesieniu do danych podanych dobrowolnie w Serwisie.
            </p>
            <p>Serwis wykorzystuje dane osobowe w następujących celach:</p>
            <ul>
              <li>Obsługa zapytań przez formularz</li>
            </ul>
            <p>Serwis realizuje funkcje pozyskiwania informacji o użytkownikach i ich zachowaniu w następujący sposób:</p>
            <ul>
              <li>Poprzez dobrowolnie wprowadzone w formularzach dane, które zostają wprowadzone do systemów Operatora.</li>
              <li>Poprzez zapisywanie w urządzeniach końcowych plików cookie (tzw. „ciasteczka”).</li>
            </ul>
          </section>

          <section id="metody-ochrony" className="mb-8">
            <h2>2. Wybrane metody ochrony danych stosowane przez Operatora</h2>
            <ul>
              <li>Miejsca logowania i wprowadzania danych osobowych są chronione w warstwie transmisji (certyfikat SSL). Dzięki temu dane osobowe i dane logowania, wprowadzone na stronie, zostają zaszyfrowane w komputerze użytkownika i mogą być odczytane jedynie na docelowym serwerze.</li>
              <li>Operator okresowo zmienia swoje hasła administracyjne.</li>
              <li>W celu ochrony danych Operator regularnie wykonuje kopie bezpieczeństwa.</li>
              <li>Istotnym elementem ochrony danych jest regularna aktualizacja wszelkiego oprogramowania, wykorzystywanego przez Operatora do przetwarzania danych osobowych, co w szczególności oznacza regularne aktualizacje komponentów programistycznych.</li>
            </ul>
          </section>

          <section id="hosting" className="mb-8">
            <h2>3. Hosting</h2>
            <p>
              Serwis jest hostowany (technicznie utrzymywany) na serwerach operatora: <strong>Vercel</strong>
            </p>
            <p>
              Firma hostingowa w celu zapewnienia niezawodności technicznej prowadzi logi na poziomie serwera. Zapisowi mogą podlegać:
            </p>
            <ul>
              <li>zasoby określone identyfikatorem URL (adresy żądanych zasobów – stron, plików),</li>
              <li>czas nadejścia zapytania,</li>
              <li>czas wysłania odpowiedzi,</li>
              <li>nazwę stacji klienta – identyfikacja realizowana przez protokół HTTP,</li>
              <li>informacje o błędach jakie nastąpiły przy realizacji transakcji HTTP,</li>
              <li>adres URL strony poprzednio odwiedzanej przez użytkownika (referer link) – w przypadku gdy przejście do Serwisu nastąpiło przez odnośnik,</li>
              <li>informacje o przeglądarce użytkownika,</li>
              <li>informacje o adresie IP,</li>
              <li>informacje diagnostyczne związane z procesem samodzielnego zamawiania usług poprzez rejestratory na stronie,</li>
              <li>informacje związane z obsługą poczty elektronicznej kierowanej do Operatora oraz wysyłanej przez Operatora.</li>
            </ul>
          </section>

          <section id="prawa-dodatkowe" className="mb-8">
            <h2>4. Twoje prawa i dodatkowe informacje o sposobie wykorzystania danych</h2>
            <p>
              W niektórych sytuacjach Administrator ma prawo przekazywać Twoje dane osobowe innym odbiorcom, jeśli będzie to niezbędne do wykonania zawartej z Tobą umowy lub do zrealizowania obowiązków ciążących na Administratorze. Dotyczy to takich grup odbiorców:
            </p>
            <ul>
              <li>upoważnieni pracownicy i współpracownicy, którzy korzystają z danych w celu realizacji celu działania strony</li>
            </ul>
            <p>
              Twoje dane osobowe przetwarzane przez Administratora nie dłużej, niż jest to konieczne do wykonania związanych z nimi czynności określonych osobnymi przepisami (np. o prowadzeniu rachunkowości). W odniesieniu do danych marketingowych dane nie będą przetwarzane dłużej niż przez 3 lata.
            </p>
            <p>Przysługuje Ci prawo żądania od Administratora:</p>
            <ul>
              <li>dostępu do danych osobowych Ciebie dotyczących,</li>
              <li>ich sprostowania,</li>
              <li>usunięcia,</li>
              <li>ograniczenia przetwarzania,</li>
              <li>oraz przenoszenia danych.</li>
            </ul>
            <p>
              Przysługuje Ci prawo do złożenia sprzeciwu w zakresie przetwarzania wskazanego w pkt 3.2 wobec przetwarzania danych osobowych w celu wykonania prawnie uzasadnionych interesów realizowanych przez Administratora, w tym profilowania, przy czym prawo sprzeciwu nie będzie mogło być wykonane w przypadku istnienia ważnych prawnie uzasadnionych podstaw do przetwarzania, nadrzędnych wobec Ciebie interesów, praw i wolności, w szczególności ustalenia, dochodzenia lub obrony roszczeń.
            </p>
            <p>
              Na działania Administratora przysługuje skarga do Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.
            </p>
            <p>
              Podanie danych osobowych jest dobrowolne, lecz niezbędne do obsługi Serwisu.
            </p>
            <p>
              W stosunku do Ciebie mogą być podejmowane czynności polegające na zautomatyzowanym podejmowaniu decyzji, w tym profilowaniu w celu świadczenia usług w ramach zawartej umowy oraz w celu prowadzenia przez Administratora marketingu bezpośredniego.
            </p>
            <p>
              Dane osobowe nie są przekazywane od krajów trzecich w rozumieniu przepisów o ochronie danych osobowych. Oznacza to, że nie przesyłamy ich poza teren Unii Europejskiej.
            </p>
          </section>

          <section id="informacje-w-formularzach" className="mb-8">
            <h2>5. Informacje w formularzach</h2>
            <p>
              Serwis zbiera informacje podane dobrowolnie przez użytkownika, w tym dane osobowe, o ile zostaną one podane.
            </p>
            <p>
              Serwis może zapisać informacje o parametrach połączenia (oznaczenie czasu, adres IP).
            </p>
            <p>
              Serwis, w niektórych wypadkach, może zapisać informację ułatwiającą powiązanie danych w formularzu z adresem e-mail użytkownika wypełniającego formularz. W takim wypadku adres e-mail użytkownika pojawia się wewnątrz adresu url strony zawierającej formularz.
            </p>
            <p>
              Dane podane w formularzu są przetwarzane w celu wynikającym z funkcji konkretnego formularza, np. w celu dokonania procesu obsługi zgłoszenia serwisowego lub kontaktu handlowego, rejestracji usług itp. Każdorazowo kontekst i opis formularza w czytelny sposób informuje, do czego on służy.
            </p>
          </section>

          <section id="logi-administratora" className="mb-8">
            <h2>6. Logi Administratora</h2>
            <p>
              Informacje zachowaniu użytkowników w serwisie mogą podlegać logowaniu. Dane te są wykorzystywane w celu administrowania serwisem.
            </p>
          </section>

          <section id="techniki-marketingowe" className="mb-8">
            <h2>7. Istotne techniki marketingowe</h2>
          </section>

          <section id="cookies-info" className="mb-8">
            <h2>8. Informacja o plikach cookies</h2>
            <p>Serwis korzysta z plików cookies.</p>
            <p>
              Pliki cookies (tzw. „ciasteczka”) stanowią dane informatyczne, w szczególności pliki tekstowe, które przechowywane są w urządzeniu końcowym Użytkownika Serwisu i przeznaczone są do korzystania ze stron internetowych Serwisu. Cookies zazwyczaj zawierają nazwę strony internetowej, z której pochodzą, czas przechowywania ich na urządzeniu końcowym oraz unikalny numer.
            </p>
            <p>
              Podmiotem zamieszczającym na urządzeniu końcowym Użytkownika Serwisu pliki cookies oraz uzyskującym do nich dostęp jest operator Serwisu.
            </p>
            <p>Pliki cookies wykorzystywane są w następujących celach:</p>
            <ul>
              <li>utrzymanie sesji użytkownika Serwisu (po zalogowaniu), dzięki której użytkownik nie musi na każdej podstronie Serwisu ponownie wpisywać loginu i hasła;</li>
              <li>realizacji celów określonych powyżej w części "Istotne techniki marketingowe";</li>
            </ul>
            <p>
              W ramach Serwisu stosowane są dwa zasadnicze rodzaje plików cookies: „sesyjne” (session cookies) oraz „stałe” (persistent cookies). Cookies „sesyjne” są plikami tymczasowymi, które przechowywane są w urządzeniu końcowym Użytkownika do czasu wylogowania, opuszczenia strony internetowej lub wyłączenia oprogramowania (przeglądarki internetowej). „Stałe” pliki cookies przechowywane są w urządzeniu końcowym Użytkownika przez czas określony w parametrach plików cookies lub do czasu ich usunięcia przez Użytkownika.
            </p>
            <p>
              Oprogramowanie do przeglądania stron internetowych (przeglądarka internetowa) zazwyczaj domyślnie dopuszcza przechowywanie plików cookies w urządzeniu końcowym Użytkownika. Użytkownicy Serwisu mogą dokonać zmiany ustawień w tym zakresie. Przeglądarka internetowa umożliwia usunięcie plików cookies. Możliwe jest także automatyczne blokowanie plików cookies Szczegółowe informacje na ten temat zawiera pomoc lub dokumentacja przeglądarki internetowej.
            </p>
            <p>
              Ograniczenia stosowania plików cookies mogą wpłynąć na niektóre funkcjonalności dostępne na stronach internetowych Serwisu.
            </p>
            <p>
              Pliki cookies zamieszczane w urządzeniu końcowym Użytkownika Serwisu wykorzystywane mogą być również przez współpracujące z operatorem Serwisu podmioty, w szczególności dotyczy to firm: Google (Google Inc. z siedzibą w USA), Facebook (Facebook Inc. z siedzibą w USA), Twitter (Twitter Inc. z siedzibą w USA).
            </p>
          </section>

          <section id="zarzadzanie-cookies" className="mb-8">
            <h2>9. Zarządzanie plikami cookies – jak w praktyce wyrażać i cofać zgodę?</h2>
            <p>
              Jeśli użytkownik nie chce otrzymywać plików cookies, może zmienić ustawienia przeglądarki. Zastrzegamy, że wyłączenie obsługi plików cookies niezbędnych dla procesów uwierzytelniania, bezpieczeństwa, utrzymania preferencji użytkownika może utrudnić, a w skrajnych przypadkach może uniemożliwić korzystanie ze stron www
            </p>
        
          </section>
        </div>
      </div>

      <Footer />
    </section>
  );
}

export default PrivacyPolicyPage;
