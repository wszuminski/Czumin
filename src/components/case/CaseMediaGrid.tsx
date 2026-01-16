import type { FC } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
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
    order: i + 1,
  }));

  const rows = items.reduce<{ id: number; src: string; alt: string; description: string; order: number; }[][]>((acc, item, index) => {
    const rowIndex = Math.floor(index / 2);
    if (!acc[rowIndex]) {
      acc[rowIndex] = [];
    }
    acc[rowIndex].push(item);
    return acc;
  }, []);

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

        <div className="flex flex-col gap-10">
          {rows.map((rowItems, rowIdx) => {
            const isLastRow = rowIdx === rows.length - 1;

            const renderCard = (
              item: { id: number; src: string; alt: string; description: string; order: number },
              { showMobileConnector }: { showMobileConnector: boolean }
            ) => (
              <div className="flex flex-col" key={`card-${item.id}`}>
                <article className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl shadow-black/30">
                  <div className="absolute left-4 top-4 hidden h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/70 text-xs font-semibold text-white sm:flex">
                    {item.order}
                  </div>
                  <div className="relative flex aspect-[18/10] items-center justify-center bg-black/30">
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-violet-500/10 mix-blend-screen" />
                  </div>
                  <div className="p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/70 text-xs font-semibold text-white sm:hidden">
                      {item.order}
                    </div>
                    <p className="text-sm leading-relaxed text-white/80">
                      {item.description}
                    </p>
                  </div>
                </article>
                {showMobileConnector && (
                  <div className="mt-4 flex justify-center sm:hidden">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white/80">
                      <ArrowDown className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
            );

            return (
              <div key={`row-${rowIdx}`} className="flex flex-col gap-6">
                <div className="flex flex-col gap-6 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch sm:gap-6">
                  {rowItems[0] && (
                    renderCard(rowItems[0], {
                      showMobileConnector: rowItems.length > 1 || !isLastRow,
                    })
                  )}

                  {rowItems.length > 1 && (
                    <div className="hidden sm:flex sm:col-start-2 sm:items-center sm:justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white/80">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  )}

                  {rowItems[1] && (
                    renderCard(rowItems[1], {
                      showMobileConnector: !isLastRow,
                    })
                  )}
                </div>

                {!isLastRow && (
                  <div className="hidden sm:flex sm:h-12 sm:items-center sm:justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white/80">
                      <ArrowDown className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CaseMediaGrid;
