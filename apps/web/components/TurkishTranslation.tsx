/** Türkçe çeviri — belirgin, sıcak vurgu (küçük gri metin yerine) */
export function TurkishTranslation({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`mt-4 inline-flex max-w-full flex-wrap items-center gap-3 rounded-2xl border border-goethe-gold/35 bg-gradient-to-br from-goethe-gold/20 via-cream-50 to-sage-50 px-4 py-3 shadow-sm ${className}`}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-goethe-gold/30 text-sm font-bold text-goethe-blue"
        aria-hidden
      >
        TR
      </span>
      <p className="text-xl font-semibold leading-snug text-sage-700 sm:text-2xl">{text}</p>
    </div>
  );
}
