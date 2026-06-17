"use client";

import { useMemo, useState } from "react";
import { IconCheck, IconX } from "@/components/icons";
import { checkSentenceBuilt, germanTextsMatch } from "@/lib/germanTextCompare";
import type { WordOrderExercise } from "@/lib/grundlagen";

function shuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function tokensMatch(user: string, expected: string) {
  return germanTextsMatch(user.replace(/[.,!?]/g, ""), expected.replace(/[.,!?]/g, ""));
}

interface WordOrderSpotVerbProps {
  exercise: WordOrderExercise;
  onAnswer: (correct: boolean) => void;
}

export function WordOrderSpotVerb({ exercise, onAnswer }: WordOrderSpotVerbProps) {
  const verb = exercise.verb ?? "";
  const pool = useMemo(
    () => shuffle(exercise.word_pool ?? [], exercise.id.length),
    [exercise]
  );
  const buildPool = useMemo(
    () =>
      shuffle(
        [...(exercise.tokens ?? []), ...(exercise.distractors ?? [])],
        exercise.id.length + 7
      ),
    [exercise]
  );

  const [phase, setPhase] = useState<"spot" | "build" | "done">("spot");
  const [verbPicked, setVerbPicked] = useState<string | null>(null);
  const [verbWrong, setVerbWrong] = useState(false);
  const [available, setAvailable] = useState<string[]>(buildPool);
  const [selected, setSelected] = useState<string[]>([]);
  const [buildChecked, setBuildChecked] = useState(false);
  const [buildCorrect, setBuildCorrect] = useState(false);

  const handleVerbPick = (word: string) => {
    if (phase !== "spot" || verbPicked) return;
    const ok = tokensMatch(word, verb);
    setVerbPicked(word);
    if (ok) {
      setPhase("build");
    } else {
      setVerbWrong(true);
    }
  };

  const pickToken = (token: string, idx: number) => {
    if (buildChecked) return;
    setSelected((s) => [...s, token]);
    setAvailable((a) => a.filter((_, i) => i !== idx));
  };

  const removeToken = (idx: number) => {
    if (buildChecked) return;
    const token = selected[idx];
    setSelected((s) => s.filter((_, i) => i !== idx));
    setAvailable((a) => [...a, token]);
  };

  const handleBuildCheck = () => {
    if (!exercise.answer_de || selected.length === 0) return;
    const ok = checkSentenceBuilt(selected, exercise.answer_de);
    setBuildChecked(true);
    setBuildCorrect(ok);
    setPhase("done");
  };

  const finish = (correct: boolean) => {
    onAnswer(correct);
  };

  if (verbWrong && phase === "spot") {
    return (
      <div className="card-soft space-y-4 p-5">
        <StepBadge step={1} label="Fiili bul" />
        {exercise.statement_de && <StatementBox text={exercise.statement_de} />}
        <p className="text-base font-medium text-goethe-blue">
          Kelimelerden motor (fiil) hangisi?
        </p>
        <div className="flex flex-wrap gap-2">
          {pool.map((w, i) => (
            <span
              key={`${w}-${i}`}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                tokensMatch(w, verb)
                  ? "border-sage-500 bg-sage-100 font-semibold"
                  : w === verbPicked
                    ? "border-red-300 bg-red-50"
                    : "border-sage-100 bg-white"
              }`}
            >
              {w}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-900">
          <IconX size={18} />
          Motor değil — doğrusu: <strong className="ml-1">{verb}</strong>
        </div>
        {exercise.verb_hint_tr && (
          <p className="text-xs text-sage-600">{exercise.verb_hint_tr}</p>
        )}
        <button type="button" className="btn-primary-lg w-full" onClick={() => finish(false)}>
          Sonraki →
        </button>
      </div>
    );
  }

  if (phase === "spot") {
    return (
      <div className="card-soft space-y-4 p-5">
        <StepBadge step={1} label="Fiili bul (motor)" />
        {exercise.statement_de && <StatementBox text={exercise.statement_de} />}
        <p className="text-base font-medium text-goethe-blue">
          Bu cümlede motor hangisi? Fiil = hareket bildiren kelime.
        </p>
        <p className="rounded-lg border border-goethe-gold/30 bg-goethe-gold/10 px-3 py-2 text-xs text-sage-700">
          Alman polisi kuralı: Normal cümlede fiil yerinde oturur. Soruda fiil öne geçer.
        </p>
        <div className="flex flex-wrap gap-2">
          {pool.map((w, i) => (
            <button
              key={`${w}-${i}`}
              type="button"
              className="rounded-lg border border-sage-200 bg-white px-4 py-2 text-sm font-medium text-goethe-blue transition hover:border-goethe-blue hover:bg-goethe-blue/5"
              onClick={() => handleVerbPick(w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-soft space-y-4 p-5">
      <StepBadge step={2} label="Soruyu kur" />
      <div className="flex items-center gap-2 rounded-lg bg-sage-100 px-3 py-2 text-sm">
        <IconCheck size={16} className="text-sage-600" />
        <span>
          Motor: <strong className="text-goethe-blue">{verb}</strong> — şimdi fiili başa al
        </span>
      </div>
      {exercise.statement_de && (
        <p className="text-sm text-sage-600">
          <span className="text-sage-400">Düz cümle: </span>
          {exercise.statement_de}
        </p>
      )}
      <p className="text-base font-medium text-goethe-blue">
        Ja/Nein sorusunu kur — fiil + özne + …
      </p>

      <div className="min-h-[48px] rounded-xl border-2 border-dashed border-goethe-blue/30 bg-goethe-blue/5 p-3">
        {selected.length === 0 ? (
          <p className="text-center text-sm text-sage-400">Kelimeye dokun</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selected.map((t, i) => (
              <button
                key={`${t}-${i}`}
                type="button"
                disabled={buildChecked}
                className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-goethe-blue shadow-sm"
                onClick={() => removeToken(i)}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {available.map((t, i) => (
          <button
            key={`${t}-${i}`}
            type="button"
            disabled={buildChecked}
            className="rounded-lg border border-sage-200 bg-white px-3 py-1.5 text-sm text-sage-700 hover:border-goethe-blue/40"
            onClick={() => pickToken(t, i)}
          >
            {t}
          </button>
        ))}
      </div>

      {phase !== "done" ? (
        <button
          type="button"
          className="btn-primary-lg w-full"
          disabled={selected.length === 0}
          onClick={handleBuildCheck}
        >
          Kontrol et
        </button>
      ) : (
        <div className="space-y-3">
          <div
            className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
              buildCorrect ? "bg-sage-100 text-sage-800" : "bg-red-50 text-red-900"
            }`}
          >
            {buildCorrect ? <IconCheck size={18} /> : <IconX size={18} />}
            {buildCorrect ? "Richtig!" : `Doğrusu: ${exercise.answer_de}`}
          </div>
          {!buildCorrect && exercise.hint_tr && (
            <p className="text-xs text-sage-600">{exercise.hint_tr}</p>
          )}
          <button
            type="button"
            className="btn-primary-lg w-full"
            onClick={() => finish(buildCorrect)}
          >
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}

function StepBadge({ step, label }: { step: number; label: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
      Adım {step} · {label}
    </p>
  );
}

function StatementBox({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-sage-100 bg-sage-50 p-3">
      <p className="text-[10px] font-bold uppercase text-sage-400">Düz cümle</p>
      <p className="mt-1 font-semibold text-goethe-blue">{text}</p>
    </div>
  );
}
