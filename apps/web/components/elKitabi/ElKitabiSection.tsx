import Link from "next/link";
import { ElKitabiBlocks } from "@/components/elKitabi/ElKitabiBlocks";
import type { ElKitabiChapter } from "@/lib/elKitabi/types";

export function ElKitabiSection({
  chapter,
  index,
  total,
}: {
  chapter: ElKitabiChapter;
  index: number;
  total: number;
}) {
  return (
    <section id={chapter.id} className="scroll-mt-20">
      <div className="card-soft p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-400">
          Bolum {index + 1} / {total} · {chapter.title}
        </p>
        {chapter.subtitle && (
          <p className="mt-1 text-sm text-sage-600">{chapter.subtitle}</p>
        )}

        <div className="mt-4 space-y-4">
          {chapter.subsections.map((sub) => (
            <details
              key={sub.id}
              id={sub.id}
              className="app-collapse group scroll-mt-24 rounded-lg border border-sage-200 bg-white"
            >
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-goethe-blue marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-2">
                  {sub.title}
                  <span className="text-xs font-normal text-sage-400 group-open:hidden">
                    Ac
                  </span>
                </span>
              </summary>
              <div className="border-t border-sage-100 px-4 py-4">
                <ElKitabiBlocks blocks={sub.blocks} />
              </div>
            </details>
          ))}
        </div>

        {chapter.practiceHref && (
          <div className="mt-5 border-t border-sage-100 pt-4">
            <Link
              href={chapter.practiceHref}
              className="btn-primary inline-block text-sm"
            >
              {chapter.practiceLabel ?? "Bu konuyu uygulamada calis"} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
