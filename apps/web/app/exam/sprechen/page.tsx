"use client";

import { useState } from "react";
import Link from "next/link";
import { getSprechenCards } from "@german-coach/exams";
import { AudioButton } from "@/components/AudioButton";
import { ExamModuleShell } from "@/components/exam/ExamModuleShell";
import { useProgress } from "@/lib/ProgressContext";

export default function SprechenExamPage() {
  const { progress, updateProgress } = useProgress();
  const cards = getSprechenCards();
  const [idx, setIdx] = useState(0);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [showExample, setShowExample] = useState(false);

  const card = cards[idx];
  if (!card) return null;

  const allChecked = card.checklist.every((_, i) => checks[`c${i}`]);

  return (
    <ExamModuleShell
      title="Teil 4: Sprechen"
      subtitle={`Kart ${idx + 1}/${cards.length} — Teil ${card.part}`}
    >
      <div className="card-soft border-2 border-goethe-gold/30 p-4">
        <p className="text-xs font-semibold uppercase text-goethe-gold">Gerçek sınav formatı</p>
        <p className="mt-1 text-sm text-sage-600">
          4 kişilik oda · Teil 1 tanıtım · Tema kartları · Bitte / Verbot — gerceksinav.md
        </p>
        <Link
          href="/exam/sprechen/gercek"
          className="btn-primary-lg mt-3 inline-flex w-full items-center justify-center"
        >
          Gerçek Sprechen simülasyonu
        </Link>
      </div>

      <div className="card-soft p-6 text-center">
        <span className="rounded-full bg-goethe-gold/20 px-3 py-1 text-xs font-medium text-goethe-blue">
          Goethe Sprechen · Teil {card.part}
        </span>
        <p className="mt-4 text-lg font-medium text-goethe-blue">{card.prompt_de}</p>
        <p className="mt-2 text-sm text-sage-400">{card.prompt_tr}</p>
        <p className="mt-4 text-xs text-sage-400">
          Yüksek sesle konuş. Prüfer gibi hayal et.
        </p>
      </div>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          className="btn-secondary text-sm"
          onClick={() => setShowExample((s) => !s)}
        >
          {showExample ? "Örneği gizle" : "Örnek cevap"}
        </button>
        {showExample && (
          <AudioButton text={card.example_de} label="Örneği dinle" size="sm" />
        )}
      </div>

      {showExample && (
        <div className="card-soft p-4 text-sm">
          <p className="italic text-sage-700">{card.example_de}</p>
          <p className="mt-1 text-xs text-sage-400">{card.example_tr}</p>
        </div>
      )}

      <div className="card-soft space-y-2 p-4">
        <p className="text-xs font-semibold uppercase text-sage-400">Kontrol listesi</p>
        {card.checklist.map((item, i) => (
          <label key={i} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!checks[`c${i}`]}
              onChange={(e) => setChecks((c) => ({ ...c, [`c${i}`]: e.target.checked }))}
            />
            {item}
          </label>
        ))}
      </div>

      <button
        type="button"
        className="btn-primary w-full py-3"
        disabled={!allChecked}
        onClick={() => {
          const isNew = !progress.goethe.sprechenDone.includes(card.id);
          const done = isNew
            ? [...progress.goethe.sprechenDone, card.id]
            : progress.goethe.sprechenDone;
          updateProgress({
            goethe: { ...progress.goethe, sprechenDone: done },
            dailyStats: isNew
              ? {
                  ...progress.dailyStats,
                  sprechenCards: progress.dailyStats.sprechenCards + 1,
                }
              : progress.dailyStats,
          });
          setChecks({});
          setShowExample(false);
          if (idx + 1 < cards.length) setIdx((i) => i + 1);
        }}
      >
        Erledigt — Sonraki kart
      </button>

      <p className="text-center text-xs text-sage-400">
        Tamamlanan: {progress.goethe.sprechenDone.length}/{cards.length}
      </p>
      <Link href="/exam" className="block text-center text-sm text-sage-500">
        ← Modüllere dön
      </Link>
    </ExamModuleShell>
  );
}
