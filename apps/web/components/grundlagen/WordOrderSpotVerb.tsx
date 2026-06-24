"use client";

import { useMemo, useState } from "react";
import { ContentTransition } from "@/components/ContentTransition";
import { RewardBurst } from "@/components/RewardBurst";
import { IconCheck, IconX } from "@/components/icons";
import { TrainerCorrectFeedback } from "@/components/grundlagen/TrainerCorrectFeedback";
import { TrainerHint } from "@/components/grundlagen/TrainerHint";
import { TrainerWrongFeedback } from "@/components/grundlagen/TrainerWrongFeedback";
import { checkSentenceBuilt, germanTextsMatch } from "@/lib/germanTextCompare";
import type { WordOrderExercise } from "@/lib/grundlagen";
import { analyzeSatzMistake } from "@/lib/sentenceBuilderFeedback";
import { pickSessionReward } from "@/lib/trainerRewards";
import { useSessionStreak } from "@/lib/useSessionStreak";
import type { TrainerReward } from "@/lib/trainerRewards";

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
  const { recordCorrect, recordWrong } = useSessionStreak();
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
  const [popKey, setPopKey] = useState(0);
  const [rewardTrigger, setRewardTrigger] = useState(0);
  const [lastReward, setLastReward] = useState<TrainerReward | null>(null);

  const buildMistake = useMemo(() => {
    if (!buildChecked || buildCorrect || !exercise.answer_de) return null;
    return analyzeSatzMistake(selected, {
      tokens: exercise.tokens ?? [],
      distractors: exercise.distractors,
      answer_de: exercise.answer_de,
      hint_tr: exercise.hint_tr,
      explanation_tr: exercise.explanation_tr,
    });
  }, [buildChecked, buildCorrect, exercise, selected]);

  const stepKey = verbWrong ? "spot-wrong" : phase;

  const handleVerbPick = (word: string) => {
    if (phase !== "spot" || verbPicked) return;
    const ok = tokensMatch(word, verb);
    setVerbPicked(word);
    if (ok) {
      setPhase("build");
    } else {
      setVerbWrong(true);
      recordWrong();
    }
  };

  const pickToken = (token: string, idx: number) => {
    if (buildChecked) return;
    setPopKey((k) => k + 1);
    setSelected((s) => [...s, token]);
    setAvailable((a) => a.filter((_, i) => i !== idx));
  };

  const removeToken = (idx: number) => {
    if (buildChecked) return;
    setPopKey((k) => k + 1);
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
    if (ok) {
      const streak = recordCorrect();
      const reward = pickSessionReward(streak, true);
      setLastReward(reward);
      if (reward) setRewardTrigger((t) => t + 1);
    } else {
      recordWrong();
      setLastReward(null);
    }
  };

  const finish = (correct: boolean) => {
    onAnswer(correct);
  };

  return (
    <div className="relative">
      <RewardBurst trigger={rewardTrigger} reward={lastReward} />
      <ContentTransition stepKey={stepKey} direction={1}>
        {verbWrong && phase === "spot" ? (
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
            <div className="animate-feedback-in flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-900">
              <span className="animate-shake-soft inline-flex">
                <IconX size={18} />
              </span>
              Motor değil — doğrusu: <strong className="ml-1">{verb}</strong>
            </div>
            {exercise.verb_hint_tr && <TrainerHint>{exercise.verb_hint_tr}</TrainerHint>}
            <button type="button" className="btn-primary-lg w-full" onClick={() => finish(false)}>
              Sonraki →
            </button>
          </div>
        ) : phase === "spot" ? (
          <div className="card-soft space-y-4 p-5">
            <StepBadge step={1} label="Fiili bul (motor)" />
            {exercise.statement_de && <StatementBox text={exercise.statement_de} />}
            <p className="text-base font-medium text-goethe-blue">
              Bu cümlede motor hangisi? Fiil = hareket bildiren kelime.
            </p>
            <p className="rounded-lg border border-goethe-gold/30 bg-goethe-gold/10 px-3 py-2.5 text-sm text-sage-700">
              Soruda fiil başa geçer.
            </p>
            <div className="flex flex-wrap gap-2">
              {pool.map((w, i) => (
                <button
                  key={`${w}-${i}`}
                  type="button"
                  className="animate-token-pop rounded-lg border border-sage-200 bg-white px-4 py-2.5 text-base font-medium text-goethe-blue transition hover:border-goethe-blue hover:bg-goethe-blue/5"
                  onClick={() => handleVerbPick(w)}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="card-soft space-y-4 p-5">
            <StepBadge step={2} label="Soruyu kur" />
            {exercise.statement_de && <StatementBox text={exercise.statement_de} />}
            <div className="flex items-center gap-2 rounded-lg bg-sage-100 px-3 py-2.5 text-base">
              <IconCheck size={16} className="text-sage-600" />
              <span>
                Motor: <strong className="text-goethe-blue">{verb}</strong> — bu düz cümleden Ja/Nein
                sorusunu kur
              </span>
            </div>
            <p className="text-base font-medium text-goethe-blue">
              Fiili başa al — fiil + özne + …
            </p>

            <div className="min-h-[48px] rounded-xl border-2 border-dashed border-goethe-blue/30 bg-goethe-blue/5 p-3">
              {selected.length === 0 ? (
                <p className="text-center text-sm text-sage-400">Kelimeye dokun</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selected.map((t, i) => (
                    <button
                      key={`${t}-${i}-${popKey}`}
                      type="button"
                      disabled={buildChecked}
                      className="animate-token-pop rounded-lg bg-white px-3 py-2 text-base font-medium text-goethe-blue shadow-sm"
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
                  key={`${t}-${i}-${popKey}`}
                  type="button"
                  disabled={buildChecked}
                  className="animate-token-pop rounded-lg border border-sage-200 bg-white px-3 py-2 text-base text-sage-700 hover:border-goethe-blue/40"
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
                {buildCorrect && exercise.answer_de ? (
                  <TrainerCorrectFeedback answer={exercise.answer_de} reward={lastReward} />
                ) : (
                  buildMistake &&
                  exercise.answer_de && (
                    <TrainerWrongFeedback
                      correctAnswer={exercise.answer_de}
                      reasons={buildMistake.reasons}
                      ruleTr={buildMistake.ruleTr}
                    />
                  )
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
        )}
      </ContentTransition>
    </div>
  );
}

function StepBadge({ step, label }: { step: number; label: string }) {
  return (
    <p className="text-label font-bold uppercase tracking-widest text-goethe-blue">
      Adım {step} · {label}
    </p>
  );
}

function StatementBox({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-sage-200 bg-sage-50 p-4">
      <p className="text-label font-bold uppercase text-sage-500">Düz cümle</p>
      <p className="mt-1.5 text-lg font-semibold text-goethe-blue">{text}</p>
    </div>
  );
}
