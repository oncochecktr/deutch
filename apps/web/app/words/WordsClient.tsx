"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getA1Vocabulary } from "@german-coach/vocabulary";
import { IconCheck, IconX } from "@/components/icons";
import { AudioButton } from "@/components/AudioButton";
import { formatWord } from "@/lib/audio";
import { useProgress } from "@/lib/ProgressContext";

export default function WordsPage() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const { progress } = useProgress();
  const [search, setSearch] = useState("");
  const vocab = getA1Vocabulary();

  const words = useMemo(() => {
    let list = vocab.words;
    if (categoryFilter) list = list.filter((w) => w.category === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.translation_tr.toLowerCase().includes(q) ||
          w.translation_ru.toLowerCase().includes(q)
      );
    }
    return list;
  }, [vocab.words, categoryFilter, search]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-bold text-goethe-blue">Kelime Listesi</h1>
        <p className="text-sm text-sage-400">
          {categoryFilter ? `${categoryFilter} — ` : ""}
          {words.length} kelime
        </p>
      </header>

      <input
        type="search"
        placeholder="Kelime ara (DE / TR / RU)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sage-400"
      />

      <div className="space-y-2">
        {words.map((w) => {
          const known = progress.knownWordIds.includes(w.id);
          const wp = progress.wordProgress[w.id];
          return (
            <article
              key={w.id}
              className={`card-soft flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${
                known ? "border-sage-200" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-goethe-blue">
                    {formatWord(w.word, w.article)}
                  </span>
                  {known && (
                    <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] text-sage-600">
                      bilinen
                    </span>
                  )}
                </div>
                <p className="text-sm text-sage-500">
                  {w.translation_tr} · {w.translation_ru}
                </p>
                <p className="mt-1 text-xs italic text-sage-400">{w.example_de}</p>
                <span className="mt-1 inline-block text-[10px] text-sage-300">{w.category}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {wp && (
                  <span className="inline-flex items-center gap-2 text-xs text-sage-400">
                    <span className="inline-flex items-center gap-0.5">
                      <IconCheck size={11} /> {wp.correct}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <IconX size={11} /> {wp.wrong}
                    </span>
                  </span>
                )}
                <AudioButton text={formatWord(w.word, w.article)} size="sm" audioSrc={w.audio_word} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
