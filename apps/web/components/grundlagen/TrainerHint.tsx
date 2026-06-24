interface TrainerHintProps {
  children: string;
  className?: string;
}

/** Gramer antrenmanlarında okunaklı ipucu kutusu */
export function TrainerHint({ children, className = "" }: TrainerHintProps) {
  return (
    <div
      className={`animate-fade-in-up mt-3 rounded-lg border border-goethe-gold/35 bg-goethe-gold/10 px-3 py-2.5 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-goethe-blue">İpucu</p>
      <p className="mt-1 text-sm leading-relaxed text-sage-800 sm:text-base">{children}</p>
    </div>
  );
}
