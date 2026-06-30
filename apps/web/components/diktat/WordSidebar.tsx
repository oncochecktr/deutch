"use client";

import { useMemo, useState } from "react";
import { getA1Vocabulary, type VocabularyWord } from "@german-coach/vocabulary";
import { formatWord } from "@/lib/audio";
import { AttentionHintButton } from "@/components/ui/AttentionHintButton";
import { GoldCueLine } from "@/components/ui/GoldCueLine";

interface WordSidebarProps {
  showTurkish: boolean;
  category: string | null;
  onCategoryChange: (cat: string | null) => void;
  selectedId: string | null;
  onSelect: (word: VocabularyWord) => void;
  onInsert: (text: string) => void;
  /** panel: yan sütun başlığı + Gizle; plain: modal içi — sadece arama + liste */
  variant?: "panel" | "plain";
  onToggleCollapse?: () => void;
}

export function WordSidebar({
  showTurkish,
  category,
  onCategoryChange,
  selectedId,
  onSelect,
  onInsert,
  variant = "panel",
  onToggleCollapse,
}: WordSidebarProps) {
  const [search, setSearch] = useState("");
  const vocab = useMemo(() => getA1Vocabulary(), []);

  const words = useMemo(() => {
    let list = vocab.words;
    if (category) list = list.filter((w) => w.category === category);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.translation_tr.toLowerCase().includes(q)
      );
    }
    return list;
  }, [vocab.words, category, search]);

  return (
    <aside
      className={`flex min-h-0 flex-col ${
        variant === "panel" ? "h-full rounded-xl border border-sage-100 bg-white" : "h-full"
      }`}
    >
      <div className={`shrink-0 ${variant === "panel" ? "border-b border-sage-50 p-3" : "pb-3"}`}>
        {variant === "panel" && (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-goethe-blue">
                Kelimeler
              </p>
              <GoldCueLine className="mt-1.5" />
            </div>
            {onToggleCollapse && (
              <AttentionHintButton onClick={onToggleCollapse} aria-label="Kelime listesini gizle">
                Gizle ↓
              </AttentionHintButton>
            )}
          </div>
        )}
        {variant === "panel" && (
          <p className="mt-2 text-[10px] text-sage-400">
            {vocab.total} A1 · dokun = dinle · + metne ekle
          </p>
        )}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ara…"
          className="mt-2 w-full rounded-lg border border-sage-100 px-2.5 py-1.5 text-sm outline-none focus:border-goethe-blue/40"
        />
        <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => onCategoryChange(null)}
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
              !category ? "bg-goethe-blue text-white" : "bg-sage-100 text-sage-600"
            }`}
          >
            Tümü
          </button>
          {vocab.categories.slice(0, 8).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat === category ? null : cat)}
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                category === cat ? "bg-goethe-blue text-white" : "bg-sage-100 text-sage-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto divide-y divide-sage-50">
        {words.map((w) => {
          const display = formatWord(w.word, w.article);
          const active = w.id === selectedId;
          return (
            <li key={w.id}>
              <div
                className={`flex items-center gap-1 px-2 py-2 ${
                  active ? "bg-goethe-blue/5" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(w)}
                  className="min-w-0 flex-1 text-left"
                  title="Dinle ve yaz (Kelime modu)"
                >
                  <p className="truncate text-sm font-medium text-goethe-blue">{display}</p>
                  {showTurkish && (
                    <p className="truncate text-[10px] text-sage-400">{w.translation_tr}</p>
                  )}
                </button>
                <button
                  type="button"
                  title="Serbest yaz metnine ekle"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInsert(display);
                  }}
                  className="shrink-0 rounded-lg border border-sage-100 px-2 py-1 text-[10px] font-semibold text-sage-500 hover:border-goethe-blue/30 hover:text-goethe-blue"
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="shrink-0 border-t border-sage-50 p-2 text-center text-[10px] text-sage-300">
        {words.length} kelime
      </p>
    </aside>
  );
}
