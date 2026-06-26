"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ContentTransition } from "@/components/ContentTransition";
import { SpeakAudioButton } from "@/components/SpeakAudioButton";
import { TrainerCorrectFeedback } from "@/components/grundlagen/TrainerCorrectFeedback";
import { TrainerHint } from "@/components/grundlagen/TrainerHint";
import {
  TrainerLessonCompare,
  TrainerLessonIntro,
  TrainerLessonRulesTable,
} from "@/components/grundlagen/TrainerLessonIntro";
import { TrainerWrongFeedback } from "@/components/grundlagen/TrainerWrongFeedback";
import { IconCheck, IconLock } from "@/components/icons";
import { checkSentenceBuilt } from "@/lib/germanTextCompare";
import { DAS_IST_ADJECTIVES } from "@/lib/dasIstEngine";
import {
  buildPossessiveDeckExercises,
  buildPossessivePair,
  DAS_IST_MEIN_LESSON,
  DAS_IST_MEIN_PASS_SCORE,
  DAS_IST_MEIN_RULES,
  DAS_IST_POSSESSIVE_DECKS,
  getPossessiveNouns,
  pairFullDe,
  POSSESSIVE_BRIDGE,
  POSSESSIVE_OWNERS,
  type DasIstPossessiveDeckId,
  type DasIstPossessivePair,
  type PossessiveExercise,
} from "@/lib/dasIstPossessiveEngine";
import {
  isDasIstPossessiveDeckUnlocked,
  isDasIstPossessiveModuleUnlocked,
  loadDasIstPossessiveProgress,
  markDasIstPossessiveDeckDone,
  saveDasIstPossessiveProgress,
} from "@/lib/dasIstPossessiveStorage";
import { useSessionStreak } from "@/lib/useSessionStreak";

type Phase = "list" | "learn" | "play" | "done";

function TwoLinePreview({
  pair,
  highlight,
}: {
  pair: DasIstPossessivePair;
  highlight?: "1" | "2" | "both";
}) {
  return (
    <div className="space-y-2 rounded-xl border border-sage-100 bg-sage-50/80 p-4">
      <p className={`text-sm font-medium ${highlight === "2" ? "text-sage-400" : "text-goethe-blue"}`}>
        <span className="text-sage-500">1 · </span>
        Das ist{" "}
        <span className="underline decoration-goethe-gold/60 decoration-2 underline-offset-2">
          {pair.possessive}
        </span>{" "}
        {pair.noun.word}.
        <span className="mt-0.5 block text-xs font-normal text-sage-500">{pair.line1_tr}</span>
      </p>
      <p className={`text-sm font-medium ${highlight === "1" ? "text-sage-400" : "text-goethe-blue"}`}>
        <span className="text-sage-500">2 · </span>
        <span className="underline decoration-goethe-gold/60 decoration-2 underline-offset-2">
          {pair.pronoun}
        </span>{" "}
        ist sehr {pair.adjective.lemma}.
        <span className="mt-0.5 block text-xs font-normal text-sage-500">{pair.line2_tr}</span>
      </p>
    </div>
  );
}

function PossessiveBridgeTable() {
  return (
    <TrainerLessonRulesTable
      title="Artikel → sahiplik → zamir"
      rules={POSSESSIVE_BRIDGE.map((r) => ({
        label: `${r.article} → ${r.pronoun}`,
        tr: `${r.form} · ${r.tr}`,
      }))}
    />
  );
}

export function DasIstPossessiveLegoTrainer() {
  const [phase, setPhase] = useState<Phase>("list");
  const [deckId, setDeckId] = useState<DasIstPossessiveDeckId | null>(null);
  const [progress, setProgress] = useState(loadDasIstPossessiveProgress);
  const [moduleUnlocked, setModuleUnlocked] = useState(false);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setProgress(loadDasIstPossessiveProgress());
    setModuleUnlocked(isDasIstPossessiveModuleUnlocked());
  }, []);

  const exercises = useMemo(() => {
    if (!deckId) return [];
    return buildPossessiveDeckExercises(deckId, 8, deckId.length * 7727);
  }, [deckId]);

  const activeDeck = DAS_IST_POSSESSIVE_DECKS.find((d) => d.id === deckId);

  const samplePair = useMemo(() => {
    if (!deckId) return null;
    const nouns = getPossessiveNouns();
    const zimmer = nouns.find((n) => n.word === "Zimmer") ?? nouns[0];
    if (!zimmer) return null;
    const owner = activeDeck?.owners?.[0] ?? "mein";
    const adj =
      deckId === "unser"
        ? DAS_IST_ADJECTIVES.find((a) => a.id === "klein")!
        : DAS_IST_ADJECTIVES.find((a) => a.id === "gross")!;
    return buildPossessivePair(zimmer, owner, adj);
  }, [deckId, activeDeck]);

  const openDeck = (id: DasIstPossessiveDeckId) => {
    if (!isDasIstPossessiveDeckUnlocked(id, progress)) return;
    setDeckId(id);
    setPhase("learn");
    setExerciseIdx(0);
    setScore(0);
  };

  const finishDeck = useCallback(
    (finalScore: number) => {
      if (!deckId) return;
      const next = markDasIstPossessiveDeckDone(progress, deckId, finalScore);
      setProgress(next);
      saveDasIstPossessiveProgress(next);
      setPhase("done");
    },
    [deckId, progress]
  );

  const handleAnswer = (correct: boolean) => {
    const nextScore = correct ? score + 1 : score;
    setScore(nextScore);
    const nextIdx = exerciseIdx + 1;
    if (nextIdx >= exercises.length) finishDeck(nextScore);
    else setExerciseIdx(nextIdx);
  };

  if (!moduleUnlocked) {
    return (
      <div className="card-soft space-y-4 border border-sage-200 p-6 text-center">
        <IconLock size={28} className="mx-auto text-sage-400" />
        <p className="text-lg font-bold text-goethe-blue">Önce Pattern 03</p>
        <p className="text-sm text-sage-600">
          Das ist <strong>ein</strong> … → Er/Es/Sie modülünü bitir (karışık deste). Sonra mein/dein/unser
          açılır.
        </p>
        <Link href="/grundlagen/sentence-engine/das-ist" className="btn-primary inline-block">
          Pattern 03&apos;e git →
        </Link>
      </div>
    );
  }

  if (phase === "list") {
    return (
      <div className="space-y-4">
        <Link href="/grundlagen/sentence-engine" className="text-sm text-goethe-blue hover:underline">
          ← Sentence Engine
        </Link>

        <TrainerLessonIntro
          badge={DAS_IST_MEIN_LESSON.badge}
          title={DAS_IST_MEIN_LESSON.title}
          summary={DAS_IST_MEIN_LESSON.summary}
          sections={DAS_IST_MEIN_LESSON.sections}
          rules={DAS_IST_MEIN_RULES}
        >
          <div className="space-y-2">
            {DAS_IST_MEIN_LESSON.examples.map((ex) => (
              <div key={ex.de} className="rounded-xl border border-sage-100 bg-sage-50/80 px-3 py-2 text-sm">
                <p className="font-medium text-goethe-blue">{ex.de}</p>
                <p className="text-xs text-sage-500">{ex.tr}</p>
              </div>
            ))}
          </div>
          <PossessiveBridgeTable />
          <TrainerLessonRulesTable
            title="Sahiplik formları"
            rules={POSSESSIVE_OWNERS.map((o) => ({
              label: o.tr,
              tr: `${o.mascNeut} / ${o.fem}`,
            }))}
          />
        </TrainerLessonIntro>

        <p className="text-xs text-sage-500">Sırayla: mein → dein → unser → onun → sizin → karışık</p>

        <ol className="space-y-2">
          {DAS_IST_POSSESSIVE_DECKS.map((d) => {
            const unlocked = isDasIstPossessiveDeckUnlocked(d.id, progress);
            const done = progress.completed.includes(d.id);
            const best = progress.scores[d.id];
            return (
              <li key={d.id}>
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => openDeck(d.id)}
                  className={`card-soft flex w-full items-center gap-3 border p-4 text-left transition ${
                    unlocked
                      ? "border-sage-100 hover:border-goethe-blue/30"
                      : "cursor-not-allowed border-sage-100 opacity-55"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      done
                        ? "bg-sage-200 text-sage-700"
                        : unlocked
                          ? "bg-goethe-blue/10 text-goethe-blue"
                          : "bg-sage-100 text-sage-400"
                    }`}
                  >
                    {done ? <IconCheck size={16} /> : !unlocked ? <IconLock size={14} /> : d.titleTr[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-goethe-blue">{d.title}</p>
                    <p className="text-sm text-sage-600">{d.titleTr}</p>
                    <p className="mt-0.5 text-xs text-sage-400">{d.desc}</p>
                  </div>
                  {best !== undefined && (
                    <span className="shrink-0 text-xs text-sage-400">{best}/8</span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  if (phase === "learn" && activeDeck && samplePair) {
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
          ← Adımlar
        </button>

        <h2 className="text-lg font-bold text-goethe-blue">{activeDeck.title}</h2>
        <p className="text-sm text-sage-600">{activeDeck.desc}</p>

        <TrainerLessonCompare
          title="Bu adımda"
          left={{
            label: "Satır 1",
            de: samplePair.line1_de,
            tr: samplePair.line1_tr,
          }}
          right={{
            label: "Satır 2",
            de: samplePair.line2_de,
            tr: `${samplePair.noun.article} → ${samplePair.pronoun}`,
          }}
        />

        <PossessiveBridgeTable />
        <TwoLinePreview pair={samplePair} highlight="both" />

        <div className="flex items-center gap-2">
          <SpeakAudioButton text={pairFullDe(samplePair)} size="md" />
          <span className="text-xs text-sage-500">İki satırı dinle</span>
        </div>

        <button type="button" className="btn-primary w-full" onClick={() => setPhase("play")}>
          Oyna — 8 soru →
        </button>
      </div>
    );
  }

  if (phase === "done" && activeDeck) {
    const passed = score >= DAS_IST_MEIN_PASS_SCORE;
    return (
      <div className="card-soft space-y-4 p-6 text-center">
        <p className="text-lg font-bold text-goethe-blue">{activeDeck.title}</p>
        <p className="text-3xl font-bold text-goethe-gold">
          {score} / {exercises.length}
        </p>
        <p className="text-sm text-sage-600">
          {passed
            ? "Adım tamam — sonraki sahiplik formuna geç."
            : `${DAS_IST_MEIN_PASS_SCORE}/8 lazım — tekrar dene.`}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" className="btn-secondary" onClick={() => { setDeckId(null); setPhase("list"); }}>
            Adımlar
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
        <div className="flex items-center justify-between text-xs text-sage-500">
          <button type="button" className="text-goethe-blue hover:underline" onClick={() => setPhase("learn")}>
            ← Öğren
          </button>
          <span className="tabular-nums">
            {exerciseIdx + 1}/{exercises.length} · {score} doğru
          </span>
        </div>
        <ContentTransition stepKey={exercises[exerciseIdx].id}>
          <PossessiveExerciseCard exercise={exercises[exerciseIdx]} onAnswer={handleAnswer} />
        </ContentTransition>
      </div>
    );
  }

  return null;
}

function PossessiveExerciseCard({
  exercise,
  onAnswer,
}: {
  exercise: PossessiveExercise;
  onAnswer: (correct: boolean) => void;
}) {
  if (exercise.kind === "possessive" || exercise.kind === "pronoun") {
    return <PossessivePickCard exercise={exercise} onAnswer={onAnswer} />;
  }
  return <PossessiveBuildCard exercise={exercise} onAnswer={onAnswer} />;
}

function PossessivePickCard({
  exercise,
  onAnswer,
}: {
  exercise: PossessiveExercise;
  onAnswer: (correct: boolean) => void;
}) {
  const { recordCorrect, recordWrong } = useSessionStreak();
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const options = useMemo(
    () => [...new Set([...exercise.tokens, ...exercise.distractors])],
    [exercise]
  );

  const handlePick = (opt: string) => {
    if (checked) return;
    setPicked(opt);
    const ok = opt === exercise.answer_de;
    setChecked(true);
    if (ok) recordCorrect();
    else recordWrong();
  };

  const ok = picked === exercise.answer_de;

  return (
    <div className="card-soft space-y-4 p-5">
      <TwoLinePreview pair={exercise.pair} highlight="1" />
      <p className="text-base font-medium text-goethe-blue">{exercise.prompt_tr}</p>
      {exercise.hint_tr && !checked && <TrainerHint>{exercise.hint_tr}</TrainerHint>}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={checked}
            onClick={() => handlePick(opt)}
            className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold ${
              checked && opt === exercise.answer_de
                ? "border-goethe-blue/40 bg-sage-50"
                : checked && picked === opt
                  ? "border-sage-300 bg-sage-50"
                  : "border-sage-200 hover:border-goethe-blue/30"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {checked && (
        <div className="space-y-3">
          {ok ? (
            <TrainerCorrectFeedback answer={exercise.pair.line2_de} />
          ) : (
            <TrainerWrongFeedback
              correctAnswer={exercise.answer_de}
              reasons={[`${exercise.pair.noun.article} → ${exercise.pair.possessive}`]}
              ruleTr={exercise.hint_tr}
            />
          )}
          <button type="button" className="btn-primary w-full" onClick={() => onAnswer(ok)}>
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}

function PossessiveBuildCard({
  exercise,
  onAnswer,
}: {
  exercise: PossessiveExercise;
  onAnswer: (correct: boolean) => void;
}) {
  const { recordCorrect, recordWrong } = useSessionStreak();
  const [selected, setSelected] = useState<string[]>([]);
  const [available, setAvailable] = useState(() =>
    shuffleTokens([...exercise.tokens, ...exercise.distractors], exercise.id.length)
  );
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);

  const pick = (t: string, i: number) => {
    if (checked) return;
    setSelected((s) => [...s, t]);
    setAvailable((a) => a.filter((_, j) => j !== i));
  };

  const remove = (i: number) => {
    if (checked) return;
    const t = selected[i];
    setSelected((s) => s.filter((_, j) => j !== i));
    setAvailable((a) => [...a, t]);
  };

  const check = () => {
    const built = selected.join(" ").replace(/\s+\./g, ".");
    const normAnswer = exercise.answer_de.replace(/\./g, "").trim();
    const normBuilt = built.replace(/\./g, "").trim();
    const isOk = normBuilt === normAnswer || checkSentenceBuilt(selected, exercise.answer_de);
    setChecked(true);
    setOk(isOk);
    if (isOk) recordCorrect();
    else recordWrong();
  };

  return (
    <div className="card-soft space-y-4 p-5">
      <TwoLinePreview pair={exercise.pair} highlight={exercise.kind === "line2" ? "1" : "both"} />
      <p className="text-base font-medium text-goethe-blue">{exercise.prompt_tr}</p>
      {exercise.hint_tr && !checked && <TrainerHint>{exercise.hint_tr}</TrainerHint>}

      <div className="min-h-[44px] rounded-xl border-2 border-dashed border-sage-200 p-3">
        {selected.length === 0 ? (
          <p className="text-center text-sm text-sage-400">Kelimelere dokun</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selected.map((t, i) => (
              <button
                key={`${t}-${i}`}
                type="button"
                disabled={checked}
                onClick={() => remove(i)}
                className="rounded-lg border border-sage-200 bg-white px-2.5 py-1 text-sm font-medium text-goethe-blue"
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
            onClick={() => pick(t, i)}
            className="rounded-lg border border-sage-200 bg-sage-50 px-2.5 py-1 text-sm text-goethe-blue"
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
          onClick={check}
        >
          Kontrol et
        </button>
      ) : (
        <div className="space-y-3">
          {ok ? (
            <TrainerCorrectFeedback answer={exercise.answer_de} />
          ) : (
            <TrainerWrongFeedback
              correctAnswer={exercise.answer_de}
              reasons={["Satır 1: Das ist mein … · Satır 2: Es/Er/Sie ist sehr …"]}
              ruleTr={exercise.hint_tr}
            />
          )}
          <button type="button" className="btn-primary w-full" onClick={() => onAnswer(ok)}>
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}

function shuffleTokens(arr: string[], seed: number): string[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
