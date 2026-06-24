"use client";

import { useState } from "react";
import { ContentTransition } from "@/components/ContentTransition";
import { IconCheck } from "@/components/icons";
import { PossessiveDrillPanel } from "@/components/grundlagen/PossessiveDrill";
import { PossessiveExampleView } from "@/components/grundlagen/PossessiveExampleView";
import { PossessiveRuleTable } from "@/components/grundlagen/PossessiveRuleTable";
import type { PossessiveSet, PossessiveTrainerData } from "@/lib/grundlagen";
import { markPossessiveCompleted, POSSESSIVE_PASS_SCORE } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";
import { useStepDirection } from "@/lib/useStepDirection";

type Phase = "list" | "learn" | "drill" | "done";

interface PossessiveTrainerProps {
  data: PossessiveTrainerData;
}

export function PossessiveTrainer({ data }: PossessiveTrainerProps) {
  const { progress, updateProgress } = useProgress();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("list");
  const { index: exampleIdx, direction, goNext, goPrev, reset: resetExample } = useStepDirection(0);
  const [drillScore, setDrillScore] = useState(0);

  const completed = progress.grundlagen.possessivesCompleted;
  const scores = progress.grundlagen.possessiveScores;
  const active = data.sets.find((s) => s.id === activeId) ?? null;

  const openSet = (id: string) => {
    setActiveId(id);
    setPhase("learn");
    resetExample(0);
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
            8 örnek + drill — {POSSESSIVE_PASS_SCORE}/8 geç.
          </p>
          <p className="mt-2 text-xs tabular-nums text-sage-500">
            {completed.length} / {data.sets.length} set tamam
          </p>
        </div>
        <PossessiveRuleTable rules={data.rules} />
        <ol className="space-y-2">
          {data.sets.map((s) => (
            <SetListItem
              key={s.id}
              set={s}
              done={completed.includes(s.id)}
              score={scores[s.id]}
              onOpen={() => openSet(s.id)}
            />
          ))}
        </ol>
      </div>
    );
  }

  if (phase === "done") {
    const passed = drillScore >= POSSESSIVE_PASS_SCORE;
    return (
      <div className="card-soft space-y-4 p-6 text-center">
        <p className="text-lg font-bold text-goethe-blue">
          {active.owner_tr} ({active.masc_neut} / {active.fem_pl})
        </p>
        <p className="text-3xl font-bold text-goethe-gold">
          {drillScore} / {data.drillsPerSet}
        </p>
        <p className="text-sm text-sage-600">
          {passed
            ? "Set tamam!"
            : `${POSSESSIVE_PASS_SCORE}/8 lazım.`}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" className="btn-secondary" onClick={backToList}>
            Set listesi
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setPhase("learn");
              resetExample(0);
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
    return (
      <div className="space-y-4">
        <SetHeader set={active} onBack={backToList} />
        <PossessiveDrillPanel
          drills={active.drills}
          onFinish={(score) => {
            setDrillScore(score);
            updateProgress(markPossessiveCompleted(progress, active.id, score));
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
      <SetHeader set={active} onBack={backToList} />
      <PossessiveRuleTable rules={data.rules} highlightOwner={active.owner} />
      <ContentTransition stepKey={`${active.id}-ex-${exampleIdx}`} direction={direction}>
        <PossessiveExampleView
          example={example}
          index={exampleIdx}
          total={active.examples.length}
        />
      </ContentTransition>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn-secondary flex-1 transition active:scale-[0.98]"
          disabled={exampleIdx === 0}
          onClick={() => goPrev()}
        >
          ← Önceki
        </button>
        {!atEnd ? (
          <button
            type="button"
            className="btn-primary flex-1 transition active:scale-[0.98]"
            onClick={() => goNext()}
          >
            Sonraki →
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary flex-1 transition active:scale-[0.98]"
            onClick={() => setPhase("drill")}
          >
            Drill&apos;e geç ({data.drillsPerSet} soru) →
          </button>
        )}
      </div>
    </div>
  );
}

function SetListItem({
  set,
  done,
  score,
  onOpen,
}: {
  set: PossessiveSet;
  done: boolean;
  score?: number;
  onOpen: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="card-soft flex w-full items-center gap-3 border border-sage-100 p-4 text-left transition hover:border-goethe-blue/30"
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            done ? "bg-sage-200 text-sage-700" : "bg-goethe-blue/10 text-goethe-blue"
          }`}
        >
          {done ? <IconCheck size={16} /> : set.order}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-goethe-blue">
            {set.owner_tr}{" "}
            <span className="font-normal text-sage-500">
              ({set.masc_neut} / {set.fem_pl})
            </span>
          </p>
          <p className="text-sm text-sage-600">8 örnek + 8 drill</p>
        </div>
        {score !== undefined && (
          <span className="shrink-0 text-xs text-sage-400">{score}/8</span>
        )}
      </button>
    </li>
  );
}

function SetHeader({ set, onBack }: { set: PossessiveSet; onBack: () => void }) {
  return (
    <div>
      <button type="button" className="text-xs text-sage-500 underline" onClick={onBack}>
        ← Tüm setler
      </button>
      <h2 className="mt-1 text-lg font-bold text-goethe-blue">
        {set.owner_tr} · {set.masc_neut} / {set.fem_pl}
      </h2>
    </div>
  );
}
