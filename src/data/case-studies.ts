export type CaseStudyStatus = "completed" | "in-progress" | "pending";

export interface CaseStudy {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  logo: string;
  relatedIds: number[];
  status: CaseStudyStatus;
  energy: number;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: "Artur Stawiak",
    date: "Czerwiec 2025",
    content: "Prosta wizytówka z wyraźnym 'Umów konsultację' i FAQ. 150 odwiedzających, 15% kliknięć w kontakt po starcie.",
    category: "Strona + Design",
    logo: "/LogoArtur.png",
    relatedIds: [],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Akademia Ruchu",
    date: "Lipiec 2025",
    content: "Studio treningowe: oferta i duże 'Umów trening' od razu. Szybkie ładowanie i SEO lokalne, mniej klikania, więcej zapytań.",
    category: "Strona + Design",
    logo: "/LogoJakub.svg",
    relatedIds: [],
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "Eryk Jankowski",
    date: "Wrzesień 2025",
    content: "Wideo z ofertą pod sekcją główną, opinie + metamorfozy i płatności online. Zakup planu bez pisania na priv.",
    category: "Design + Sklep",
    logo: "/Logo.png",
    relatedIds: [],
    status: "completed",
    energy: 100,
  },
  {
    id: 4,
    title: "Marcel Kaczmarek",
    date: "Sierpień 2025",
    content: "Z 1:1 do sprzedaży planów online: efekty podopiecznych, ścieżka 'Zobacz efekty → Wybierz plan → Wyceń'.",
    category: "Design + Strona",
    logo: "/LogoMarcel.png",
    relatedIds: [],
    status: "completed",
    energy: 100,
  },
  {
    id: 5,
    title: "Bartek Węgielnik",
    date: "Sierpień 2025",
    content: "Wizytówka jak Instagram Bartka: jasna karta oferty i formularz w kluczowych miejscachszybkie zapytania bez DM.",
    category: "Design + Strona",
    logo: "/LogoBartek.png",
    relatedIds: [],
    status: "completed",
    energy: 100,
  },
  {
    id: 6,
    title: "Top Global Plus",
    date: "Październik 2025",
    content: "Minimalistyczna strona wizytówka dla międzynarodowej firmy. Dwa języki, prosty design i jasny przekaz dla klientów biznesowych.",
    category: "Design + Strona",
    logo: "icon:Box",
    relatedIds: [],
    status: "completed",
    energy: 100,
  },
];
