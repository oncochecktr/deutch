"use client";

import { useMemo, useState } from "react";
import { AudioButton } from "@/components/AudioButton";
import { IconCheck } from "@/components/icons";
import { WordOrderDrillPanel } from "@/components/grundlagen/WordOrderDrill";
import type { WordOrderTrainerData } from "@/lib/grundlagen";
import {
  WORD_ORDER_STUFE,
  wordOrderTierForSection,
  type WordOrderTier,
} from "@/lib/grundlagen";
import { markWordOrderCompleted, WORD_ORDER_PASS_SCORE } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";

type Phase = "list" | "learn" | "drill" | "done";

interface WordOrderUnit {
  id: string;
  order: number;
  tier: WordOrderTier;
  tierLabel: string;
  title: string;
  titleTr: string;
  rule_de: string;
  rule_tr: string;
  examples: { de: string; tr: string }[];
  drill: WordOrderTrainerData["megaDrill"];
}

const RULE_CARDS = [
  {
    tier: 1 as WordOrderTier,
    de: "Ich + komme + aus Istanbul.",
    tr: "Düz cümle: özne + fiil + diğerleri",
  },
  {
    tier: 2 as WordOrderTier,
    de: "Kommst + du + aus Istanbul?",
    tr: "Ja/Nein: fiil polis gibi öne geçer",
  },
  {
    tier: 3 as WordOrderTier,
    de: "Wo + wohnst + du?",
    tr: "W-Frage + fiil + özne",
  },
];

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

function tierMeta(sectionId: string, section?: { tier?: WordOrderTier; tierLabel?: string }) {
  const tier = section?.tier ?? wordOrderTierForSection(sectionId);
  const tierLabel = section?.tierLabel ?? WORD_ORDER_STUFE[tier].label;
  return { tier, tierLabel };
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
    const base = data.sections.map((s) => {
      const { tier, tierLabel } = tierMeta(s.id, s);
      return {
        id: s.id,
        order: s.order,
        tier,
        tierLabel,
        title: s.title,
        titleTr: s.titleTr,
        rule_de: s.rule_de,
        rule_tr: s.rule_tr,
        examples: s.examples,
        drill: s.drill,
      };
    });
    base.push({
      id: "mixed",
      order: 6,
      tier: 4,
      tierLabel: WORD_ORDER_STUFE[4].label,
      title: "Karışık Drill",
      titleTr: "100+ egzersiz",
      rule_de: "SVO · Ja/Nein · W-Fragen",
      rule_tr: "Tüm kalıplar karışık — 10 soruluk örneklem",
      examples: [
        { de: "Wir zahlen mit Karte. → Zahlen wir mit Karte?", tr: "Fiil başa" },
        { de: "Wie heißt du?", tr: "W + fiil + du" },
      ],
      drill: shuffleDrill(data.megaDrill, 42, data.drillsPerSection),
    });
    return base.sort((a, b) => a.order - b.order);
  }, [data]);

  const active = units.find((u) => u.id === activeId) ?? null;

  const isUnitLocked = (unitIndex: number) => {
    if (unitIndex === 0) return false;
    const prev = units[unitIndex - 1];
    return !completed.includes(prev.id);
  };

  const openUnit = (id: string, unitIndex: number) => {
    if (isUnitLocked(unitIndex)) return;
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
            Stufe 1→4: SVO → Ja/Nein (fiil başa) → W-Fragen → karışık. {WORD_ORDER_PASS_SCORE}/10 geç.
          </p>
          <p className="mt-2 text-xs tabular-nums text-sage-500">
            {completed.length} / {units.length} bölüm tamam
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          {RULE_CARDS.map((card) => (
            <div
              key={card.tier}
              className="rounded-xl border border-sage-100 bg-white p-3 text-sm"
            >
              <p className="text-[10px] font-bold uppercase text-goethe-blue">
                {WORD_ORDER_STUFE[card.tier].label}
              </p>
              <p className="mt-1 font-semibold text-goethe-blue">{card.de}</p>
              <p className="mt-0.5 text-xs text-sage-600">{card.tr}</p>
            </div>
          ))}
        </div>

        <ol className="space-y-2">
          {units.map((u, idx) => {
            const locked = isUnitLocked(idx);
            return (
              <li key={u.id}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => openUnit(u.id, idx)}
                  className={`card-soft flex w-full items-center gap-3 border p-4 text-left transition ${
                    locked
                      ? "cursor-not-allowed border-sage-100 opacity-60"
                      : "border-sage-100 hover:border-goethe-blue/30"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      completed.includes(u.id)
                        ? "bg-sage-200 text-sage-700"
                        : locked
                          ? "bg-sage-100 text-sage-400"
                          : "bg-goethe-blue/10 text-goethe-blue"
                    }`}
                  >
                    {completed.includes(u.id) ? <IconCheck size={16} /> : u.order}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-goethe-blue">
                        {u.title}
                        <span className="ml-2 text-sm font-normal text-sage-500">{u.titleTr}</span>
                      </p>
                      <span className="rounded-full bg-goethe-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase text-goethe-blue">
                        {u.tierLabel}
                      </span>
                    </div>
                    <p className="text-sm text-sage-600">
                      {u.rule_de} · {u.rule_tr}
                    </p>
                    {locked && (
                      <p className="mt-1 text-xs text-sage-400">
                        Önceki bölümü {WORD_ORDER_PASS_SCORE}/10 ile bitir
                      </p>
                    )}
                  </div>
                  {scores[u.id] !== undefined && (
                    <span className="shrink-0 text-xs text-sage-400">
                      {scores[u.id]}/{data.drillsPerSection}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
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

      <div className="grid gap-2 sm:grid-cols-3">
        {RULE_CARDS.map((card) => (
          <div
            key={card.tier}
            className={`rounded-xl border p-3 text-sm ${
              card.tier === active.tier
                ? "border-goethe-blue/40 bg-goethe-blue/5"
                : "border-sage-100 bg-white opacity-80"
            }`}
          >
            <p className="text-[10px] font-bold uppercase text-goethe-blue">
              {WORD_ORDER_STUFE[card.tier].label}
            </p>
            <p className="mt-1 font-semibold text-goethe-blue">{card.de}</p>
            <p className="mt-0.5 text-xs text-sage-600">{card.tr}</p>
          </div>
        ))}
      </div>

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
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold text-goethe-blue">
          {unit.title} · {unit.titleTr}
        </h2>
        <span className="rounded-full bg-goethe-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase text-goethe-blue">
          {unit.tierLabel}
        </span>
      </div>
      <p className="text-xs text-sage-500">{WORD_ORDER_STUFE[unit.tier].subtitle}</p>
    </div>
  );
}
