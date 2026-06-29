import type { VocabularyWord } from "@german-coach/vocabulary";
import { displayGerman } from "@/lib/vocabPdf";

export function VocabPdfRow({
  word,
  includeExamples,
  compact,
}: {
  word: VocabularyWord;
  includeExamples: boolean;
  compact?: boolean;
}) {
  return (
    <article
      className={`grid grid-cols-2 gap-x-4 border-b border-dashed border-sage-200 ${
        compact ? "py-2.5" : "py-4"
      }`}
    >
      <div className="min-w-0 border-r border-sage-100 pr-4">
        <p
          className={`font-bold leading-snug text-goethe-blue ${
            compact ? "text-base" : "text-lg sm:text-xl"
          }`}
        >
          {displayGerman(word)}
        </p>
        {includeExamples && (
          <p
            className={`mt-1.5 leading-relaxed text-sage-700 ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            {word.example_de}
          </p>
        )}
      </div>
      <div className="min-w-0 pl-1">
        <p
          className={`font-medium leading-snug text-sage-800 ${
            compact ? "text-base" : "text-lg"
          }`}
        >
          {word.translation_tr}
        </p>
        {includeExamples && (
          <p
            className={`mt-1.5 leading-relaxed text-sage-500 ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            {word.example_tr}
          </p>
        )}
      </div>
    </article>
  );
}

export function VocabPdfCategoryHeader({ name }: { name: string }) {
  return (
    <h3 className="sticky top-0 z-10 border-b border-goethe-blue/20 bg-sage-50 px-1 py-2 text-xs font-bold uppercase tracking-wide text-goethe-blue">
      {name}
    </h3>
  );
}
