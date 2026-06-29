"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getA2Vocabulary, CATEGORIES_A2 } from "@german-coach/vocabulary";
import { PageShell } from "@/components/PageShell";
import { formatWord } from "@/lib/audio";

export default function A2WordsPage() {
  const vocab = getA2Vocabulary();
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = vocab.words;
    if (category !== "all") list = list.filter((w) => w.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.translation_tr.toLowerCase().includes(q)
      );
    }
    return list;
  }, [vocab.words, category, query]);

  return (
    <PageShell
      title="A2 Kelime Listesi"
      subtitle={`${vocab.total} kelime · ${CATEGORIES_A2.length} kategori`}
      backHref="/a2/cards"
    >
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={category === "all"} onClick={() => setCategory("all")} label="Tümü" />
          {CATEGORIES_A2.map((c) => (
            <FilterChip key={c} active={category === c} onClick={() => setCategory(c)} label={c} />
          ))}
        </div>
        <input
          type="search"
          placeholder="Kelime veya Türkçe ara…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-sage-200 px-4 py-2 text-sm"
        />
        <Link
          href={category !== "all" ? `/words/pdf?pack=a2&category=${encodeURIComponent(category)}` : "/words/pdf?pack=a2"}
          className="card-soft block border border-goethe-blue/20 p-3 text-sm text-goethe-blue hover:border-goethe-blue/40"
        >
          PDF indir — önizle →
        </Link>
        <p className="text-xs text-sage-400">{filtered.length} kelime gösteriliyor</p>
        <ul className="divide-y divide-sage-100 rounded-xl border border-sage-100 bg-white">
          {filtered.map((w) => (
            <li key={w.id} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
              <div>
                <span className="font-medium text-goethe-blue">{formatWord(w.word, w.article)}</span>
                <span className="ml-2 text-sm text-sage-600">{w.translation_tr}</span>
              </div>
              <span className="text-[10px] uppercase text-sage-300">{w.category}</span>
            </li>
          ))}
        </ul>
        <Link href="/a2/cards" className="block text-center text-sm text-goethe-blue hover:underline">
          ← Kart moduna dön
        </Link>
      </div>
    </PageShell>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active ? "bg-goethe-blue text-white" : "bg-sage-100 text-sage-600 hover:bg-sage-200"
      }`}
    >
      {label}
    </button>
  );
}
