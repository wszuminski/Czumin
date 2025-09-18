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
    content: "Projekt dla trenera personalnego",
    category: "Planning",
    logo: "/LogoArtur.png",
    relatedIds: [],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Akademia Ruchu",
    date: "Lipiec 2025",
    content: "Projekt dla studia treningowego",
    category: "Design",
    logo: "/LogoJakub.svg",
    relatedIds: [],
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "Eryk Jankowski",
    date: "Wrzesień 2025",
    content: "Projekt dla trenera z systemem płatności",
    category: "Development",
    logo: "/Logo.png",
    relatedIds: [],
    status: "completed",
    energy: 100,
  },
  {
    id: 4,
    title: "Marcel Kaczmarek",
    date: "Sierpień 2025",
    content: "Projekt dla trenera z niestandardowym designem",
    category: "Testing",
    logo: "/LogoMarcel.png",
    relatedIds: [],
    status: "completed",
    energy: 100,
  },
  {
    id: 5,
    title: "Bartek Węgielnik",
    date: "Sierpień 2025",
    content: "Projekt dla trenera z focusem na sprzedaż",
    category: "Release",
    logo: "/LogoBartek.png",
    relatedIds: [],
    status: "completed",
    energy: 100,
  },
];
