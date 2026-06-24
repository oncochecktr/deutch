/** Türkçe çeviri — tam genişlik, hoparlörle yan yana bitişmez */
export function TurkishTranslation({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full items-start gap-3 rounded-2xl border border-goethe-gold/30 bg-gradient-to-br from-goethe-gold/15 via-cream-50 to-sage-50/80 px-4 py-3.5 shadow-sm sm:gap-4 sm:px-5 sm:py-4 ${className}`}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-goethe-gold/25 text-sm font-bold text-goethe-blue sm:h-10 sm:w-10"
        aria-hidden
      >
        TR
      </span>
      <p className="min-w-0 flex-1 pt-0.5 text-lg font-semibold leading-snug text-sage-700 sm:text-xl">
        {text}
      </p>
    </div>
  );
}
