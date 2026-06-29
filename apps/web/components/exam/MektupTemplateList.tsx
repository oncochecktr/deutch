import { MEKTUP_TEMPLATES, MEKTUP_WHY_RULE } from "@/lib/gerceksinavSchreiben";

export function MektupTemplateList({ showRule = true }: { showRule?: boolean }) {
  return (
    <section className="card-soft p-4">
      <h2 className="mb-2 text-xs font-semibold uppercase text-sage-400">Ezber kalıpları</h2>
      {showRule && (
        <p className="mb-3 rounded-lg border border-goethe-gold/30 bg-goethe-gold/5 px-3 py-2 text-xs leading-relaxed text-sage-700">
          {MEKTUP_WHY_RULE}
        </p>
      )}
      <div className="space-y-3">
        {Object.entries(MEKTUP_TEMPLATES).map(([key, t]) => (
          <div key={key} className="rounded-lg bg-sage-50 p-3 text-xs">
            <p className="font-semibold text-goethe-blue">{t.label}</p>
            <p className="mt-1 font-mono text-sage-700">{t.greeting}</p>
            <p className="font-mono text-sage-800">{t.opening}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-sage-400">
              veya (PDF örnekleri)
            </p>
            <p className="font-mono text-sage-600">{t.followUp}</p>
            <p className="mt-2 font-mono text-sage-500">{t.closing.join(" ")}</p>
            {t.note && <p className="mt-1 text-sage-400">{t.note}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
