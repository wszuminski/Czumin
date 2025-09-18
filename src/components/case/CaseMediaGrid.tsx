import type { FC } from "react";
import { caseMedia } from "../../data/case-media";

interface CaseMediaGridProps {
  caseId: number;
}

const placeholderText = [
  "Strona w pełni responsywna z naciskiem na szybkość wczytywania i przejrzystość. Układ dopasowany do potrzeb marki i czytelna typografia.",
  "Projekt skoncentrowany na konwersji: wyróżnione CTA, sekcja ofertowa i opinie klientów. Kolorystyka w odcieniach fioletu i błękitu.",
  "Modułowy układ sekcji pozwala szybko rozbudować treści. Zastosowano animacje mikrointerakcji podkreślające nowoczesny charakter.",
  "Integracje z analityką oraz formularzami kontaktowymi. Wybrane komponenty osadzone jako reusable, co ułatwia edycję i rozwój.",
  "Sekcja portfolio z układem siatki, optymalizowane obrazy i lazy-loading. Zachowana spójność brandingu i wizualny porządek.",
  "Delikatne efekty parallax i gradientowe akcenty. Minimalistyczny styl z naciskiem na czytelność i dostępność treści.",
];

const CaseMediaGrid: FC<CaseMediaGridProps> = ({ caseId }) => {
  const media = caseMedia[caseId] ?? [];
  const items = (media.length
    ? media
    : Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/case-${caseId}-${i + 1}/960/720`)
  ).map((src, i) => ({
    id: i + 1,
    src,
    alt: `Podgląd realizacji ${i + 1}`,
    description: placeholderText[i % placeholderText.length],
  }));

  return (
    <section className="relative">
      {/* Background glow */}
      <div className="pointer-events-none absolute -inset-x-8 -top-6 -bottom-10 opacity-25">
        <div className="mx-auto h-full max-w-7xl bg-gradient-to-b from-indigo-500/20 via-violet-500/10 to-blue-500/0 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        <h2 className="mb-6 text-lg font-medium text-white/90">
          Realizacje w ramach projektu
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl shadow-black/30"
            >
              <div className="relative flex aspect-[18/10] items-center justify-center bg-black/30">
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
                {/* subtle gradient edge */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-violet-500/10 mix-blend-screen" />
              </div>
              <div className="p-4">
                <p className="text-sm leading-relaxed text-white/80">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseMediaGrid;
