"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ContentTransition } from "@/components/ContentTransition";
import { RewardBurst } from "@/components/RewardBurst";
import { SpeakAudioButton } from "@/components/SpeakAudioButton";
import { TrainerCorrectFeedback } from "@/components/grundlagen/TrainerCorrectFeedback";
import { TrainerHint } from "@/components/grundlagen/TrainerHint";
import { TrainerWrongFeedback } from "@/components/grundlagen/TrainerWrongFeedback";
import { WordBreakdown } from "@/components/grundlagen/WordBreakdown";
import { IconCheck } from "@/components/icons";
import { checkSentenceBuilt } from "@/lib/germanTextCompare";
import {
  buildDeckExercises,
  sentenceFor,
  WO_IST_DECKS,
  WO_IST_FORMULA,
  WO_IST_PASS_SCORE,
  WO_IST_RULES,
  type WoIstDeckId,
  type WoIstExercise,
} from "@/lib/woIstLego";
import {
  loadWoIstLegoProgress,
  markWoIstDeckDone,
  saveWoIstLegoProgress,
} from "@/lib/woIstLegoStorage";
import { pickSessionReward } from "@/lib/trainerRewards";
import { useSessionStreak } from "@/lib/useSessionStreak";
import type { TrainerReward } from "@/lib/trainerRewards";

type Phase = "list" | "learn" | "play" | "done";

const BLOCK_COLORS: Record<string, string> = {
  question: "border-goethe-gold/50 bg-goethe-gold/15 text-goethe-blue",
  verb: "border-goethe-blue/40 bg-goethe-blue/10 text-goethe-blue",
  slot: "border-sage-200 bg-white text-goethe-blue",
};

function shufflePool(arr: string[], seed: number): string[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function FormulaStrip() {
  return (
    <div className="card-soft border border-goethe-blue/20 p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-sage-500">
        Lego kalıp
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {WO_IST_FORMULA.map((b, i) => (
          <div key={`${b.de}-${i}`} className="flex items-center gap-2">
            <div
              className={`rounded-xl border-2 px-3 py-2 text-center ${BLOCK_COLORS[b.role ?? "slot"]}`}
            >
              <p className="text-sm font-bold">{b.de}</p>
              <p className="text-[10px] text-sage-600">{b.tr}</p>
            </div>
            {i < WO_IST_FORMULA.length - 1 && (
              <span className="text-sage-300">+</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function WoIstLegoTrainer() {
  const [phase, setPhase] = useState<Phase>("list");
  const [deckId, setDeckId] = useState<WoIstDeckId | null>(null);
  const [progress, setProgress] = useState(loadWoIstLegoProgress);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setProgress(loadWoIstLegoProgress());
  }, []);

  const exercises = useMemo(() => {
    if (!deckId) return [];
    return buildDeckExercises(deckId, 10, deckId.length * 7919);
  }, [deckId]);

  const activeDeck = WO_IST_DECKS.find((d) => d.id === deckId);

  const openDeck = (id: WoIstDeckId) => {
    setDeckId(id);
    setPhase("learn");
    setExerciseIdx(0);
    setScore(0);
  };

  const finishDeck = useCallback(
    (finalScore: number) => {
      if (!deckId) return;
      const next = markWoIstDeckDone(progress, deckId, finalScore);
      setProgress(next);
      saveWoIstLegoProgress(next);
      setPhase("done");
    },
    [deckId, progress]
  );

  const handleAnswer = (correct: boolean) => {
    const nextScore = correct ? score + 1 : score;
    setScore(nextScore);
    const nextIdx = exerciseIdx + 1;
    if (nextIdx >= exercises.length) {
      finishDeck(nextScore);
    } else {
      setExerciseIdx(nextIdx);
    }
  };

  if (phase === "list") {
    return (
      <div className="space-y-4">
        <FormulaStrip />
        <div className="card-soft overflow-x-auto p-4">
          <table className="w-full text-sm">
            <tbody>
              {WO_IST_RULES.map((r) => (
                <tr key={r.label} className="border-b border-sage-50">
                  <td className="py-2 pr-3 font-semibold text-goethe-blue">{r.label}</td>
                  <td className="py-2 text-sage-600">{r.tr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs tabular-nums text-sage-500">
          {progress.completed.length} / {WO_IST_DECKS.length} deste tamam
        </p>
        <ol className="space-y-2">
          {WO_IST_DECKS.map((d) => {
            const done = progress.completed.includes(d.id);
            const best = progress.scores[d.id];
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => openDeck(d.id)}
                  className="card-soft flex w-full items-center gap-3 border border-sage-100 p-4 text-left transition hover:border-goethe-blue/30"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      done ? "bg-sage-200 text-sage-700" : "bg-goethe-blue/10 text-goethe-blue"
                    }`}
                  >
                    {done ? <IconCheck size={16} /> : "?"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-goethe-blue">{d.title}</p>
                    <p className="text-sm text-sage-600">{d.titleTr}</p>
                    <p className="mt-0.5 text-xs text-sage-400">{d.desc}</p>
                  </div>
                  {best !== undefined && (
                    <span className="shrink-0 text-xs text-sage-400">{best}/10</span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  if (phase === "learn" && activeDeck) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          className="text-sm text-goethe-blue hover:underline"
          onClick={() => {
            setDeckId(null);
            setPhase("list");
          }}
        >
          ← Deste listesi
        </button>
        <h2 className="text-lg font-bold text-goethe-blue">{activeDeck.title}</h2>
        <FormulaStrip />
        <div className="card-soft space-y-3 p-5">
          <p className="text-sm text-sage-600">
            Her blok sabit — sadece <strong className="text-goethe-blue">artikel</strong> ve{" "}
            <strong className="text-goethe-blue">isim</strong> değişir.
          </p>
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-sage-50 p-4">
            {["Wo", "ist", "der", "Bahnhof", "?"].map((t, i) => (
              <span key={t} className="flex items-center gap-2">
                <span
                  className={`rounded-lg border-2 px-3 py-1.5 text-sm font-bold ${
                    t === "Wo" || t === "?"
                      ? BLOCK_COLORS.question
                      : t === "ist"
                        ? BLOCK_COLORS.verb
                        : BLOCK_COLORS.slot
                  }`}
                >
                  {t}
                </span>
                {i < 4 && <span className="text-sage-300">·</span>}
              </span>
            ))}
          </div>
          <p className="text-sm text-sage-600">
            Tren istasyonu nerede? → <span className="font-semibold text-goethe-blue">Wo ist der Bahnhof?</span>
          </p>
          <div className="flex items-center gap-2">
            <SpeakAudioButton text="Wo ist der Bahnhof?" size="md" />
            <span className="text-xs text-sage-500">Dinle ve tekrarla</span>
          </div>
        </div>
        <button type="button" className="btn-primary w-full" onClick={() => setPhase("play")}>
          Oyna — 10 soru →
        </button>
      </div>
    );
  }

  if (phase === "done" && activeDeck) {
    const passed = score >= WO_IST_PASS_SCORE;
    return (
      <div className="card-soft space-y-4 p-6 text-center">
        <p className="text-lg font-bold text-goethe-blue">{activeDeck.title}</p>
        <p className="text-3xl font-bold text-goethe-gold">
          {score} / {exercises.length}
        </p>
        <p className="text-sm text-sage-600">
          {passed ? "Deste tamam! Artikel ve Wo kalıbı oturdu." : `${WO_IST_PASS_SCORE}/10 lazım — tekrar dene.`}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setDeckId(null);
              setPhase("list");
            }}
          >
            Deste listesi
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setExerciseIdx(0);
              setScore(0);
              setPhase("learn");
            }}
          >
            Tekrar çalış
          </button>
        </div>
      </div>
    );
  }

  if (phase === "play" && exercises[exerciseIdx]) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2 text-xs text-sage-500">
          <button
            type="button"
            className="text-goethe-blue hover:underline"
            onClick={() => setPhase("learn")}
          >
            ← Öğren
          </button>
          <span className="tabular-nums">
            {exerciseIdx + 1}/{exercises.length} · {score} doğru
          </span>
        </div>
        <ContentTransition stepKey={exercises[exerciseIdx].id}>
          <WoIstExerciseCard
            exercise={exercises[exerciseIdx]}
            onAnswer={handleAnswer}
          />
        </ContentTransition>
      </div>
    );
  }

  return null;
}

function WoIstExerciseCard({
  exercise,
  onAnswer,
}: {
  exercise: WoIstExercise;
  onAnswer: (correct: boolean) => void;
}) {
  if (exercise.kind === "build") {
    return <BuildExercise exercise={exercise} onAnswer={onAnswer} />;
  }
  return <PickExercise exercise={exercise} onAnswer={onAnswer} />;
}

function BuildExercise({
  exercise,
  onAnswer,
}: {
  exercise: WoIstExercise;
  onAnswer: (correct: boolean) => void;
}) {
  const { recordCorrect, recordWrong } = useSessionStreak();
  const pool = useMemo(
    () =>
      shufflePool(
        [...exercise.tokens, ...exercise.distractors],
        exercise.id.length * 17
      ),
    [exercise]
  );
  const [available, setAvailable] = useState(pool);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [rewardTrigger, setRewardTrigger] = useState(0);
  const [lastReward, setLastReward] = useState<TrainerReward | null>(null);

  const pickToken = (token: string, idx: number) => {
    if (checked) return;
    setSelected((s) => [...s, token]);
    setAvailable((a) => a.filter((_, i) => i !== idx));
  };

  const removeToken = (idx: number) => {
    if (checked) return;
    const token = selected[idx];
    setSelected((s) => s.filter((_, i) => i !== idx));
    setAvailable((a) => [...a, token]);
  };

  const handleCheck = () => {
    if (selected.length < exercise.tokens.length) return;
    const ok = checkSentenceBuilt(selected, exercise.answer_de);
    setChecked(true);
    setIsCorrect(ok);
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

  return (
    <div className="relative card-soft space-y-4 p-5">
      <RewardBurst trigger={rewardTrigger} reward={lastReward} />
      <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-gold">
        Lego kur · tam cümle
      </p>
      <p className="text-base font-medium text-goethe-blue">{exercise.prompt_tr}</p>
      {exercise.hint_tr && !checked && <TrainerHint>{exercise.hint_tr}</TrainerHint>}

      <div className="min-h-[52px] rounded-xl border-2 border-dashed border-goethe-blue/30 bg-goethe-blue/5 p-3">
        {selected.length === 0 ? (
          <p className="text-center text-sm text-sage-400">Bloklara dokun — sırayla kur</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selected.map((t, i) => (
              <button
                key={`${t}-${i}`}
                type="button"
                disabled={checked}
                className="rounded-lg border-2 border-goethe-blue/30 bg-white px-3 py-1.5 text-sm font-bold text-goethe-blue shadow-sm"
                onClick={() => removeToken(i)}
              >
                {t}
              </button>
            ))}
            {!checked && selected.length > 0 && (
              <span className="self-center text-lg font-bold text-goethe-gold">?</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {available.map((t, i) => (
          <button
            key={`${t}-${i}`}
            type="button"
            disabled={checked}
            onClick={() => pickToken(t, i)}
            className="rounded-lg border border-sage-200 bg-sage-50 px-3 py-1.5 text-sm font-medium text-goethe-blue transition hover:border-goethe-blue/40"
          >
            {t}
          </button>
        ))}
      </div>

      {!checked ? (
        <button
          type="button"
          className="btn-primary w-full"
          disabled={selected.length < exercise.tokens.length}
          onClick={handleCheck}
        >
          Kontrol et
        </button>
      ) : (
        <div className="space-y-3">
          {isCorrect ? (
            <TrainerCorrectFeedback answer={exercise.answer_de} reward={lastReward} />
          ) : (
            <TrainerWrongFeedback
              correctAnswer={exercise.answer_de}
              reasons={["Blok sırası: Wo → ist → Artikel → İsim → ?"]}
              ruleTr={exercise.hint_tr}
            />
          )}
          <WordBreakdown parts={exercise.blocks} />
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => onAnswer(isCorrect)}
          >
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}

function PickExercise({
  exercise,
  onAnswer,
}: {
  exercise: WoIstExercise;
  onAnswer: (correct: boolean) => void;
}) {
  const { recordCorrect, recordWrong } = useSessionStreak();
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const options = useMemo(
    () => shufflePool([...exercise.tokens, ...exercise.distractors], exercise.id.length),
    [exercise]
  );

  const kindLabel =
    exercise.kind === "artikel" ? "Artikel seç" : "Wo mu?";

  const handlePick = (opt: string) => {
    if (checked) return;
    setPicked(opt);
    const ok = opt === exercise.answer_de;
    setChecked(true);
    if (ok) recordCorrect();
    else recordWrong();
  };

  const isCorrect = picked === exercise.answer_de;

  return (
    <div className="card-soft space-y-4 p-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-gold">
        {kindLabel}
      </p>
      <p className="text-base font-medium text-goethe-blue">{exercise.prompt_tr}</p>

      {exercise.kind === "artikel" && (
        <p className="rounded-lg bg-sage-50 p-3 text-center text-lg font-bold text-goethe-blue">
          Wo ist <span className="border-b-2 border-dashed border-goethe-gold">___</span>{" "}
          {exercise.place.word}?
        </p>
      )}

      {exercise.hint_tr && !checked && <TrainerHint>{exercise.hint_tr}</TrainerHint>}

      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const selected = picked === opt;
          const showOk = checked && opt === exercise.answer_de;
          const showBad = checked && selected && !isCorrect;
          return (
            <button
              key={opt}
              type="button"
              disabled={checked}
              onClick={() => handlePick(opt)}
              className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition ${
                showOk
                  ? "border-sage-400 bg-sage-100 text-sage-800"
                  : showBad
                    ? "border-red-300 bg-red-50 text-red-800"
                    : selected
                      ? "border-goethe-blue bg-goethe-blue/10 text-goethe-blue"
                      : "border-sage-200 bg-white text-goethe-blue hover:border-goethe-blue/40"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {checked && (
        <div className="space-y-3">
          {isCorrect ? (
            <TrainerCorrectFeedback
              answer={
                exercise.kind === "artikel"
                  ? sentenceFor(exercise.place)
                  : sentenceFor(exercise.place)
              }
            />
          ) : (
            <TrainerWrongFeedback
              correctAnswer={
                exercise.kind === "artikel"
                  ? sentenceFor(exercise.place)
                  : exercise.answer_de
              }
              reasons={
                exercise.kind === "artikel"
                  ? [`${exercise.place.word} → ${exercise.place.article}`]
                  : ["Yer sorusu = Wo"]
              }
              ruleTr={exercise.hint_tr}
            />
          )}
          <WordBreakdown parts={exercise.blocks} />
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => onAnswer(isCorrect)}
          >
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}
