"use client";

import { useMemo, useState } from "react";
import { AudioButton } from "@/components/AudioButton";
import { IconCheck } from "@/components/icons";
import { WordOrderDrillPanel } from "@/components/grundlagen/WordOrderDrill";
import type { WordOrderTrainerData } from "@/lib/grundlagen";
import { markWordOrderCompleted, WORD_ORDER_PASS_SCORE } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";

type Phase = "list" | "learn" | "drill" | "done";

interface WordOrderUnit {
  id: string;
  order: number;
  title: string;
  titleTr: string;
  rule_de: string;
  rule_tr: string;
  examples: { de: string; tr: string }[];
  drill: WordOrderTrainerData["megaDrill"];
}

function shuffleDrill<T>(arr: T[], seed: number, count: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

interface WordOrderTrainerProps {
  data: WordOrderTrainerData;
}

export function WordOrderTrainer({ data }: WordOrderTrainerProps) {
  const { progress, updateProgress } = useProgress();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("list");
  const [exampleIdx, setExampleIdx] = useState(0);
  const [drillScore, setDrillScore] = useState(0);

  const completed = progress.grundlagen.wordOrderCompleted;
  const scores = progress.grundlagen.wordOrderScores;

  const units: WordOrderUnit[] = useMemo(() => {
    const base = data.sections.map((s) => ({
      id: s.id,
      order: s.order,
      title: s.title,
      titleTr: s.titleTr,
      rule_de: s.rule_de,
      rule_tr: s.rule_tr,
      examples: s.examples,
      drill: s.drill,
    }));
    base.push({
      id: "mixed",
      order: 5,
      title: "Karışık Drill",
      titleTr: "100+ egzersiz",
      rule_de: "SVO · Ja/Nein · W-Fragen",
      rule_tr: "Tüm kalıplar karışık — 10 soruluk örneklem",
      examples: [
        { de: "Du joggst oft. → Joggst du oft?", tr: "Fiil başa" },
        { de: "Wie heißt du?", tr: "W + fiil + du" },
      ],
      drill: shuffleDrill(data.megaDrill, 42, data.drillsPerSection),
    });
    return base;
  }, [data]);

  const active = units.find((u) => u.id === activeId) ?? null;

  const openUnit = (id: string) => {
    setActiveId(id);
    setPhase("learn");
    setExampleIdx(0);
    setDrillScore(0);
  };

  const backToList = () => {
    setActiveId(null);
    setPhase("list");
  };

  if (phase === "list" || !active) {
    return (
      <div className="space-y-4">
        <div className="card-soft border border-goethe-blue/20 p-4">
          <p className="text-sm text-sage-600">
            Kelime biliyorsun ama sıra karışıyor mu? Önce motoru (fiili) bul, sonra kur.
            SVO → Ja/Nein (fiil başa) → W-Fragen → 100+ drill. {WORD_ORDER_PASS_SCORE}/10 geç.
          </p>
          <p className="mt-2 text-xs tabular-nums text-sage-500">
            {completed.length} / {units.length} bölüm tamam
          </p>
        </div>
        <ol className="space-y-2">
          {units.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                onClick={() => openUnit(u.id)}
                className="card-soft flex w-full items-center gap-3 border border-sage-100 p-4 text-left transition hover:border-goethe-blue/30"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    completed.includes(u.id)
                      ? "bg-sage-200 text-sage-700"
                      : "bg-goethe-blue/10 text-goethe-blue"
                  }`}
                >
                  {completed.includes(u.id) ? <IconCheck size={16} /> : u.order}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-goethe-blue">
                    {u.title}
                    <span className="ml-2 text-sm font-normal text-sage-500">{u.titleTr}</span>
                  </p>
                  <p className="text-sm text-sage-600">
                    {u.rule_de} · {u.rule_tr}
                  </p>
                </div>
                {scores[u.id] !== undefined && (
                  <span className="shrink-0 text-xs text-sage-400">
                    {scores[u.id]}/{data.drillsPerSection}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (phase === "done") {
    const passed = drillScore >= WORD_ORDER_PASS_SCORE;
    return (
      <div className="card-soft space-y-4 p-6 text-center">
        <p className="text-lg font-bold text-goethe-blue">{active.title}</p>
        <p className="text-3xl font-bold text-goethe-gold">
          {drillScore} / {data.drillsPerSection}
        </p>
        <p className="text-sm text-sage-600">
          {passed ? "Bölüm tamam — sıradaki kalıba geç!" : `${WORD_ORDER_PASS_SCORE}/10 lazım — tekrar dene.`}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" className="btn-secondary" onClick={backToList}>
            Bölüm listesi
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setPhase("learn");
              setExampleIdx(0);
              setDrillScore(0);
            }}
          >
            Tekrar çalış
          </button>
        </div>
      </div>
    );
  }

  if (phase === "drill") {
    const drillItems =
      active.id === "mixed"
        ? shuffleDrill(data.megaDrill, active.order * 31, data.drillsPerSection)
        : active.drill.slice(0, data.drillsPerSection);

    return (
      <div className="space-y-4">
        <UnitHeader unit={active} onBack={backToList} />
        <WordOrderDrillPanel
          exercises={drillItems}
          onFinish={(score) => {
            setDrillScore(score);
            updateProgress(markWordOrderCompleted(progress, active.id, score));
            setPhase("done");
          }}
        />
      </div>
    );
  }

  const example = active.examples[exampleIdx];
  const atEnd = exampleIdx >= active.examples.length - 1;

  return (
    <div className="space-y-4">
      <UnitHeader unit={active} onBack={backToList} />

      <div className="card-soft border border-goethe-blue/20 p-4">
        <p className="text-xs font-bold uppercase text-goethe-blue">{active.rule_de}</p>
        <p className="mt-1 text-sm text-sage-600">{active.rule_tr}</p>
      </div>

      {example && (
        <div className="card-soft space-y-3 p-5">
          <p className="text-xs text-sage-400">
            Örnek {exampleIdx + 1} / {active.examples.length}
          </p>
          <p className="text-xl font-bold text-goethe-blue">{example.de}</p>
          <p className="text-base text-sage-700">{example.tr}</p>
          <AudioButton text={example.de.replace(/→.*/, "").trim()} label="Cümleyi dinle" />
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          className="btn-secondary flex-1"
          disabled={exampleIdx === 0}
          onClick={() => setExampleIdx((i) => i - 1)}
        >
          ← Önceki
        </button>
        {!atEnd ? (
          <button
            type="button"
            className="btn-primary flex-1"
            onClick={() => setExampleIdx((i) => i + 1)}
          >
            Sonraki →
          </button>
        ) : (
          <button type="button" className="btn-primary flex-1" onClick={() => setPhase("drill")}>
            Drill&apos;e geç ({data.drillsPerSection} soru) →
          </button>
        )}
      </div>
    </div>
  );
}

function UnitHeader({ unit, onBack }: { unit: WordOrderUnit; onBack: () => void }) {
  return (
    <div>
      <button type="button" className="text-xs text-sage-500 underline" onClick={onBack}>
        ← Tüm bölümler
      </button>
      <h2 className="mt-1 text-lg font-bold text-goethe-blue">
        {unit.title} · {unit.titleTr}
      </h2>
    </div>
  );
}
