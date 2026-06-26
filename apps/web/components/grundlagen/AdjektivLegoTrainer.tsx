"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  ADJEKTIV_DECK_META,
  generateWoIstAdjExamples,
  getEngineAdjectives,
  PATTERN02_FORMULA,
  PATTERN02_RULES,
  type EngineAdjectiveDeck,
} from "@/lib/adjektivDeclension";
import {
  ADJEKTIV_PASS_SCORE,
  buildAdjDeckExercises,
  type AdjektivExercise,
} from "@/lib/adjektivEngine";
import {
  loadSentenceEngineProgress,
  markPattern02DeckDone,
  saveSentenceEngineProgress,
} from "@/lib/sentenceEngineStorage";
import { pickSessionReward } from "@/lib/trainerRewards";
import { useSessionStreak } from "@/lib/useSessionStreak";
import type { TrainerReward } from "@/lib/trainerRewards";

type Phase = "list" | "learn" | "play" | "done";

const BLOCK = {
  artikel: "border-goethe-blue/40 bg-goethe-blue/10 text-goethe-blue",
  adj: "border-goethe-gold/50 bg-goethe-gold/20 text-goethe-blue",
  noun: "border-sage-200 bg-white text-goethe-blue",
  fixed: "border-goethe-gold/50 bg-goethe-gold/15 text-goethe-blue",
  verb: "border-goethe-blue/40 bg-goethe-blue/10 text-goethe-blue",
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

function LegoStack({
  article,
  adj,
  noun,
}: {
  article: string;
  adj: string;
  noun: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <div className={`rounded-xl border-2 px-6 py-2 text-center text-sm font-bold ${BLOCK.artikel}`}>
        {article}
      </div>
      <span className="text-sage-300">↓</span>
      <div className={`rounded-xl border-2 px-6 py-2 text-center text-sm font-bold ${BLOCK.adj}`}>
        {adj}
      </div>
      <span className="text-sage-300">↓</span>
      <div className={`rounded-xl border-2 px-6 py-2 text-center text-sm font-bold ${BLOCK.noun}`}>
        {noun}
      </div>
    </div>
  );
}

export function AdjektivLegoTrainer() {
  const [phase, setPhase] = useState<Phase>("list");
  const [deckId, setDeckId] = useState<EngineAdjectiveDeck | null>(null);
  const [progress, setProgress] = useState(loadSentenceEngineProgress);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setProgress(loadSentenceEngineProgress());
  }, []);

  const exercises = useMemo(() => {
    if (!deckId) return [];
    return buildAdjDeckExercises(deckId, 10, deckId.length * 8831);
  }, [deckId]);

  const activeDeck = ADJEKTIV_DECK_META.find((d) => d.id === deckId);
  const deckAdjs = useMemo(
    () => (deckId ? getEngineAdjectives(deckId) : []),
    [deckId]
  );

  const openDeck = (id: EngineAdjectiveDeck) => {
    setDeckId(id);
    setPhase("learn");
    setExerciseIdx(0);
    setScore(0);
  };

  const finishDeck = useCallback(
    (finalScore: number) => {
      if (!deckId) return;
      const next = markPattern02DeckDone(
        progress,
        deckId,
        finalScore,
        deckAdjs.map((a) => a.id)
      );
      setProgress(next);
      saveSentenceEngineProgress(next);
      setPhase("done");
    },
    [deckId, deckAdjs, progress]
  );

  const handleAnswer = (correct: boolean) => {
    const nextScore = correct ? score + 1 : score;
    setScore(nextScore);
    const nextIdx = exerciseIdx + 1;
    if (nextIdx >= exercises.length) finishDeck(nextScore);
    else setExerciseIdx(nextIdx);
  };

  if (phase === "list") {
    return (
      <div className="space-y-4">
        <Link
          href="/grundlagen/sentence-engine"
          className="text-sm text-goethe-blue hover:underline"
        >
          ← Sentence Engine
        </Link>

        <div className="card-soft border border-goethe-gold/30 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sage-500">
            Pattern 02
          </p>
          <p className="mt-1 text-lg font-bold text-goethe-blue">Artikel + Adjektiv + Nomen</p>
          <p className="mt-2 text-sm text-sage-600">
            Orta blok değişir — motor aynı kalır. Engine yeni sıfatla cümle üretir.
          </p>
        </div>

        <LegoStack article="der" adj="große" noun="Bahnhof" />

        <p className="text-xs tabular-nums text-sage-500">
          {progress.pattern02Completed.length} / {ADJEKTIV_DECK_META.length} deste tamam
        </p>

        <ol className="space-y-2">
          {ADJEKTIV_DECK_META.map((d) => {
            const done = progress.pattern02Completed.includes(d.id);
            const best = progress.pattern02Scores[d.id];
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => openDeck(d.id)}
                  className="card-soft flex w-full items-center gap-3 border border-sage-100 p-4 text-left transition hover:border-goethe-blue/30"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      done ? "bg-sage-200 text-sage-700" : "bg-goethe-gold/20 text-goethe-blue"
                    }`}
                  >
                    {done ? <IconCheck size={16} /> : "02"}
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

  if (phase === "learn" && activeDeck && deckAdjs[0]) {
    const sampleAdj = deckAdjs[0];
    const samples = generateWoIstAdjExamples(sampleAdj, 3, 42);

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

        {deckId === "intro" && (
          <div className="card-soft border-2 border-goethe-gold/40 bg-goethe-gold/10 p-4">
            <p className="text-sm font-bold text-goethe-blue">Yeni parça öğrendin</p>
            <p className="mt-1 text-sm text-sage-700">
              Artikel + <strong>Sıfat</strong> + İsim — sıfat isimden <em>önce</em> gelir.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {PATTERN02_FORMULA.map((b, i) => (
            <span key={`${b.de}-${i}`} className="flex items-center gap-2">
              <span
                className={`rounded-lg border-2 px-2 py-1 text-xs font-bold ${
                  b.role === "verb"
                    ? BLOCK.verb
                    : b.role === "question"
                      ? BLOCK.fixed
                      : BLOCK.noun
                }`}
              >
                {b.de}
              </span>
              {i < PATTERN02_FORMULA.length - 1 && <span className="text-sage-300">·</span>}
            </span>
          ))}
        </div>

        <LegoStack
          article="der"
          adj={sampleAdj.attributive}
          noun="Bahnhof"
        />

        <ul className="space-y-2 text-sm">
          {samples.map((s) => (
            <li
              key={s.de}
              className="flex items-center justify-between gap-2 rounded-lg bg-sage-50 px-3 py-2"
            >
              <span className="font-medium text-goethe-blue">{s.de}</span>
              <SpeakAudioButton text={s.de} />
            </li>
          ))}
        </ul>

        <button type="button" className="btn-primary w-full" onClick={() => setPhase("play")}>
          Oyna — 10 soru →
        </button>
      </div>
    );
  }

  if (phase === "done" && activeDeck) {
    const passed = score >= ADJEKTIV_PASS_SCORE;
    return (
      <div className="card-soft space-y-4 p-6 text-center">
        <p className="text-lg font-bold text-goethe-blue">{activeDeck.title}</p>
        <p className="text-3xl font-bold text-goethe-gold">
          {score} / {exercises.length}
        </p>
        <p className="text-sm text-sage-600">
          {passed
            ? "Pattern 02 oturdu — sıfat bloğunu değiştirmeye devam!"
            : `${ADJEKTIV_PASS_SCORE}/10 lazım — tekrar dene.`}
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

        {exercises[exerciseIdx].revealPattern && (
          <div className="rounded-xl border border-goethe-gold/40 bg-goethe-gold/10 px-3 py-2 text-sm text-goethe-blue">
            Yeni parça: <strong>Artikel + Sıfat + İsim</strong>
          </div>
        )}

        <ContentTransition stepKey={exercises[exerciseIdx].id}>
          <AdjExerciseCard exercise={exercises[exerciseIdx]} onAnswer={handleAnswer} />
        </ContentTransition>
      </div>
    );
  }

  return null;
}

function AdjExerciseCard({
  exercise,
  onAnswer,
}: {
  exercise: AdjektivExercise;
  onAnswer: (correct: boolean) => void;
}) {
  if (exercise.kind === "build") {
    return <AdjBuildCard exercise={exercise} onAnswer={onAnswer} />;
  }
  return <AdjPickCard exercise={exercise} onAnswer={onAnswer} />;
}

function AdjBuildCard({
  exercise,
  onAnswer,
}: {
  exercise: AdjektivExercise;
  onAnswer: (correct: boolean) => void;
}) {
  const { recordCorrect, recordWrong } = useSessionStreak();
  const pool = useMemo(
    () => shufflePool([...exercise.tokens, ...exercise.distractors], exercise.id.length * 19),
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
        Lego kur · Pattern 02
      </p>

      <LegoStack
        article={exercise.place.article}
        adj={exercise.adjective.attributive}
        noun={exercise.place.word}
      />

      <p className="text-base font-medium text-goethe-blue">{exercise.prompt_tr}</p>
      {exercise.hint_tr && !checked && <TrainerHint>{exercise.hint_tr}</TrainerHint>}

      <div className="min-h-[52px] rounded-xl border-2 border-dashed border-goethe-blue/30 bg-goethe-blue/5 p-3">
        {selected.length === 0 ? (
          <p className="text-center text-sm text-sage-400">Bloklara dokun</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selected.map((t, i) => (
              <button
                key={`${t}-${i}`}
                type="button"
                disabled={checked}
                className="rounded-lg border-2 border-goethe-blue/30 bg-white px-3 py-1.5 text-sm font-bold text-goethe-blue"
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
            disabled={checked}
            onClick={() => pickToken(t, i)}
            className="rounded-lg border border-sage-200 bg-sage-50 px-3 py-1.5 text-sm font-medium text-goethe-blue"
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
              reasons={PATTERN02_RULES.map((r) => `${r.label}: ${r.tr}`).slice(0, 2)}
              ruleTr={exercise.hint_tr}
            />
          )}
          <WordBreakdown parts={exercise.blocks} />
          <button type="button" className="btn-primary w-full" onClick={() => onAnswer(isCorrect)}>
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}

function AdjPickCard({
  exercise,
  onAnswer,
}: {
  exercise: AdjektivExercise;
  onAnswer: (correct: boolean) => void;
}) {
  const { recordCorrect, recordWrong } = useSessionStreak();
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const options = useMemo(
    () => shufflePool([...exercise.tokens, ...exercise.distractors], exercise.id.length),
    [exercise]
  );

  const label =
    exercise.kind === "adj-form"
      ? "Sıfat formu"
      : exercise.kind === "lego-swap"
        ? "Orta bloğu seç"
        : "Seç";

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
      <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-gold">{label}</p>

      <LegoStack
        article={exercise.place.article}
        adj={checked ? exercise.adjective.attributive : "…"}
        noun={exercise.place.word}
      />

      <p className="text-base font-medium text-goethe-blue">{exercise.prompt_tr}</p>
      {exercise.hint_tr && !checked && <TrainerHint>{exercise.hint_tr}</TrainerHint>}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
              className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold ${
                showOk
                  ? "border-sage-400 bg-sage-100"
                  : showBad
                    ? "border-red-300 bg-red-50"
                    : "border-sage-200 bg-white hover:border-goethe-blue/40"
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
            <TrainerCorrectFeedback answer={exercise.answer_de} />
          ) : (
            <TrainerWrongFeedback
              correctAnswer={exercise.answer_de}
              reasons={[`Doğru: ${exercise.adjective.attributive}`]}
              ruleTr={exercise.hint_tr}
            />
          )}
          <WordBreakdown parts={exercise.blocks} />
          <button type="button" className="btn-primary w-full" onClick={() => onAnswer(isCorrect)}>
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}
