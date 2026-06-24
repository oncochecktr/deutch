"use client";

import { useState } from "react";
import { IconCheck } from "@/components/icons";
import { ConjugationDrillPanel } from "@/components/grundlagen/ConjugationDrill";
import { ConjugationTable } from "@/components/grundlagen/ConjugationTable";
import type { ConjugationMatrixData, ConjugationVerb } from "@/lib/grundlagen";
import { CONJUGATION_PASS_SCORE, markConjugationCompleted } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";

type Phase = "list" | "learn" | "drill" | "done";

interface ConjugationMatrixProps {
  data: ConjugationMatrixData;
}

export function ConjugationMatrix({ data }: ConjugationMatrixProps) {
  const { progress, updateProgress } = useProgress();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("list");
  const [drillScore, setDrillScore] = useState(0);

  const completed = progress.grundlagen.conjugationCompleted;
  const scores = progress.grundlagen.conjugationScores;
  const active = data.verbs.find((v) => v.id === activeId) ?? null;

  const openVerb = (id: string) => {
    setActiveId(id);
    setPhase("learn");
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
            11 fiil × 9 kişi. {CONJUGATION_PASS_SCORE}/10 geç.
          </p>
          <p className="mt-2 text-xs tabular-nums text-sage-500">
            {completed.length} / {data.verbs.length} fiil tamam
          </p>
        </div>
        <ol className="space-y-2">
          {data.verbs.map((v) => (
            <VerbListItem
              key={v.id}
              verb={v}
              done={completed.includes(v.id)}
              score={scores[v.id]}
              onOpen={() => openVerb(v.id)}
            />
          ))}
        </ol>
      </div>
    );
  }

  if (phase === "done") {
    const passed = drillScore >= CONJUGATION_PASS_SCORE;
    return (
      <div className="card-soft space-y-4 p-6 text-center">
        <p className="text-lg font-bold text-goethe-blue">
          {active.infinitive} · {active.tr}
        </p>
        <p className="text-3xl font-bold text-goethe-gold">
          {drillScore} / {data.drillsPerVerb}
        </p>
        <p className="text-sm text-sage-600">
          {passed ? "Fiil çekimi tamam — sonraki fiile geç!" : `${CONJUGATION_PASS_SCORE}/10 lazım — tekrar dene.`}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" className="btn-secondary" onClick={backToList}>
            Fiil listesi
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setPhase("learn");
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
        <VerbHeader verb={active} onBack={backToList} />
        <ConjugationDrillPanel
          verb={active}
          onFinish={(score) => {
            setDrillScore(score);
            updateProgress(markConjugationCompleted(progress, active.id, score));
            setPhase("done");
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <VerbHeader verb={active} onBack={backToList} />
      <ConjugationTable verb={active} />
      <div className="card-soft p-4">
        <p className="mb-2 text-xs font-semibold uppercase text-sage-500">Örnek cümleler</p>
        <ul className="space-y-2">
          {active.examples.map((ex) => (
            <li key={ex.personId} className="text-sm">
              <span className="font-semibold text-goethe-blue">{ex.de}</span>
              <span className="ml-2 text-sage-600">{ex.tr}</span>
            </li>
          ))}
        </ul>
      </div>
      <button type="button" className="btn-primary-lg w-full" onClick={() => setPhase("drill")}>
        Drill&apos;e geç ({data.drillsPerVerb} soru) →
      </button>
    </div>
  );
}

function VerbListItem({
  verb,
  done,
  score,
  onOpen,
}: {
  verb: ConjugationVerb;
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
          {done ? <IconCheck size={16} /> : verb.order}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-goethe-blue">{verb.infinitive}</p>
          <p className="text-sm text-sage-600">{verb.tr}</p>
        </div>
        {score !== undefined && (
          <span className="shrink-0 text-xs text-sage-400">{score}/10</span>
        )}
      </button>
    </li>
  );
}

function VerbHeader({ verb, onBack }: { verb: ConjugationVerb; onBack: () => void }) {
  return (
    <div>
      <button type="button" className="text-xs text-sage-500 underline" onClick={onBack}>
        ← Tüm fiiller
      </button>
      <h2 className="mt-1 text-lg font-bold text-goethe-blue">
        {verb.infinitive} · {verb.tr}
      </h2>
    </div>
  );
}
