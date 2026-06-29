import type { VocabularyWord } from "@german-coach/vocabulary";
import { packLabel } from "@/lib/vocabPdf";
import { VocabPdfCategoryHeader, VocabPdfRow } from "@/components/words/VocabPdfRow";
import type { VocabPdfPack } from "@/lib/vocabPdf";

export function VocabPdfSheet({
  words,
  pack,
  category,
  includeExamples,
  compact,
}: {
  words: VocabularyWord[];
  pack: VocabPdfPack;
  category: string | null;
  includeExamples: boolean;
  compact?: boolean;
}) {
  const grouped = (() => {
    if (category) return [{ category: null as string | null, words }];
    const map = new Map<string, VocabularyWord[]>();
    for (const w of words) {
      const list = map.get(w.category) ?? [];
      list.push(w);
      map.set(w.category, list);
    }
    return [...map.entries()].map(([cat, list]) => ({ category: cat, words: list }));
  })();

  const title = category
    ? `${packLabel(pack)} · ${category}`
    : `${packLabel(pack)} kelimeler`;

  return (
    <div className="bg-white p-5 text-black">
      <header className="mb-4 border-b border-sage-200 pb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
          German Coach
        </p>
        <h2 className="text-xl font-bold text-goethe-blue">{title}</h2>
        <div className="mt-2 grid grid-cols-2 gap-4 text-[10px] font-semibold uppercase tracking-wide text-sage-500">
          <span>Almanca</span>
          <span>Türkçe</span>
        </div>
      </header>
      <div>
        {grouped.map(({ category: cat, words: list }) => (
          <div key={cat ?? "all"}>
            {cat && !category && <VocabPdfCategoryHeader name={cat} />}
            {list.map((w) => (
              <VocabPdfRow
                key={w.id}
                word={w}
                includeExamples={includeExamples}
                compact={compact}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
