"use client";

import type { KonusDinleItem } from "@/lib/konusDinlePlaylist";
import type { KonusDinleBranchNode } from "@/lib/konusDinleTree";
import { lengthLabelTr } from "@/components/konus-dinle/SessionHeader";

interface KonusDinleBranchPreviewProps {
  branch: KonusDinleBranchNode | undefined;
  samples: KonusDinleItem[];
  onUseSuggested?: () => void;
  suggested?: boolean;
}

export function KonusDinleBranchPreview({
  branch,
  samples,
  onUseSuggested,
  suggested,
}: KonusDinleBranchPreviewProps) {
  if (!branch || branch.total === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-sage-200 bg-sage-50/50 p-5 text-center text-sm text-sage-500">
        Bu dalda henüz içerik yok. Başka uzunluk veya seviye dene.
      </div>
    );
  }

  const remaining = branch.total - branch.completed;

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-goethe-blue/15 bg-white shadow-sm">
      <div className="border-b border-sage-100 bg-gradient-to-r from-goethe-blue/5 to-goethe-gold/5 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
              Seçili dal
            </p>
            <h3 className="text-lg font-bold text-goethe-blue">
              {branch.level} · {lengthLabelTr(branch.lengthFilter)}
            </h3>
            <p className="text-xs text-sage-500">{branch.subtitle}</p>
          </div>
          {suggested && onUseSuggested && (
            <button
              type="button"
              onClick={onUseSuggested}
              className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800"
            >
              ★ Önerilen
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] tabular-nums text-sage-600">
          <span>
            <strong className="text-goethe-blue">{branch.total}</strong> ifade
          </span>
          <span>
            Tamamlanan: <strong>{branch.completed}</strong>
          </span>
          <span>
            Kalan: <strong>{remaining}</strong>
          </span>
          <span>%{branch.percent}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sage-100">
          <div
            className="h-full rounded-full bg-goethe-gold transition-all"
            style={{ width: `${branch.percent}%` }}
          />
        </div>
      </div>

      {samples.length > 0 && (
        <div className="space-y-2 p-4">
          <p className="text-[10px] font-bold uppercase text-sage-400">Örnek ifadeler</p>
          {samples.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-sage-100 bg-cream-50/80 px-3 py-2"
            >
              <p className="text-sm font-medium text-goethe-blue">{item.textDe}</p>
              <p className="text-xs italic text-sage-500">{item.textTr}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
