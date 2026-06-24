"use client";

import { useState } from "react";
import { ContentTransition } from "@/components/ContentTransition";
import { IconCheck } from "@/components/icons";
import { GrundlagenDrillPanel } from "@/components/grundlagen/GrundlagenDrill";
import { GrundlagenExampleView } from "@/components/grundlagen/GrundlagenExampleView";
import type { SetTrainerData, TrainerSet } from "@/lib/grundlagen";
import { useStepDirection } from "@/lib/useStepDirection";

type Phase = "list" | "learn" | "drill" | "done";

export interface SetTrainerConfig {
  data: SetTrainerData;
  completed: string[];
  scores: Record<string, number>;
  passScore: number;
  onComplete: (setId: string, score: number) => void;
  drillLabel?: string;
  showRules?: boolean;
}

export function SetTrainer({
  data,
  completed,
  scores,
  passScore,
  onComplete,
  drillLabel = "Drill",
  showRules = false,
}: SetTrainerConfig) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("list");
  const { index: exampleIdx, direction, goNext, goPrev, reset: resetExample } = useStepDirection(0);
  const [drillScore, setDrillScore] = useState(0);

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
          <p className="mt-2 text-xs tabular-nums text-sage-500">
            {completed.length} / {data.sets.length} set tamam
          </p>
        </div>
        {showRules && data.rules && data.rules.length > 0 && (
          <div className="card-soft overflow-x-auto p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sage-100 text-left text-xs uppercase text-sage-500">
                  <th className="pb-2 pr-3">Kural</th>
                  <th className="pb-2">Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {data.rules.map((r) => (
                  <tr key={r.label} className="border-b border-sage-50">
                    <td className="py-2 pr-3 font-medium text-goethe-blue">{r.label}</td>
                    <td className="py-2 text-sage-600">{r.tr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <ol className="space-y-2">
          {data.sets.map((s) => (
            <SetListItem
              key={s.id}
              set={s}
              done={completed.includes(s.id)}
              score={scores[s.id]}
              drillsPerSet={data.drillsPerSet}
              onOpen={() => openSet(s.id)}
            />
          ))}
        </ol>
      </div>
    );
  }

  if (phase === "done") {
    const passed = drillScore >= passScore;
    return (
      <div className="card-soft space-y-4 p-6 text-center">
        <p className="text-lg font-bold text-goethe-blue">{active.title_tr}</p>
        <p className="text-3xl font-bold text-goethe-gold">
          {drillScore} / {data.drillsPerSet}
        </p>
        <p className="text-sm text-sage-600">
          {passed
            ? "Set tamam!"
            : `${passScore}/${data.drillsPerSet} lazım.`}
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
        <GrundlagenDrillPanel
          label={drillLabel}
          drills={active.drills}
          onFinish={(score) => {
            setDrillScore(score);
            onComplete(active.id, score);
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
      <ContentTransition
        stepKey={`${active.id}-ex-${exampleIdx}`}
        direction={direction}
      >
        <GrundlagenExampleView example={example} index={exampleIdx} total={active.examples.length} />
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
  drillsPerSet,
  onOpen,
}: {
  set: TrainerSet;
  done: boolean;
  score?: number;
  drillsPerSet: number;
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
          <p className="font-semibold text-goethe-blue">{set.title_tr}</p>
          <p className="text-sm text-sage-600">{set.examples.length} örnek + drill</p>
        </div>
        {score !== undefined && (
          <span className="shrink-0 text-xs text-sage-400">
            {score}/{drillsPerSet}
          </span>
        )}
      </button>
    </li>
  );
}

function SetHeader({ set, onBack }: { set: TrainerSet; onBack: () => void }) {
  return (
    <div>
      <button type="button" className="text-xs text-sage-500 underline" onClick={onBack}>
        ← Tüm setler
      </button>
      <h2 className="mt-1 text-lg font-bold text-goethe-blue">{set.title_tr}</h2>
    </div>
  );
}
