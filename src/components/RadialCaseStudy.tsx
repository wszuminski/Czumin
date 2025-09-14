import { Calendar, Code, FileText, User, Clock } from "lucide-react";
import RadialOrbitalTimeline from "../components/ui/radial-orb";

const timelineData = [
  {
    id: 1,
    title: "Artur Stawiak",
    date: "Czerwiec 2025",
    content: "Projekt dla trenera personalnego",
    category: "Planning",
    icon: Calendar,
    relatedIds: [],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Akademia Ruchu",
    date: "Lipiec 2025",
    content: "Projekt dla studia treningowego",
    category: "Design",
    icon: FileText,
    relatedIds: [],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Eryk Jankowski",
    date: "Wrzesień 2025",
    content: "Projekt dla trenera z systemem płatności",
    category: "Development",
    icon: Code,
    relatedIds: [],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 4,
    title: "Marcel Kaczmarek",
    date: "Sierpień 2025",
    content: "Projekt dla trenera z niestandardowym designem",
    category: "Testing",
    icon: User,
    relatedIds: [],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 5,
    title: "Bartek Węgielnik",
    date: "Sierpień 2025",
    content: "Projekt dla trenera z focusem na sprzedaż",
    category: "Release",
    icon: Clock,
    relatedIds: [],
    status: "completed" as const,
    energy: 100,
  },
];

export function RadialCaseStudy() {
  return (
    <>
      <RadialOrbitalTimeline timelineData={timelineData} />
    </>
  );
}

export default {
  RadialCaseStudy,
};
