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
} from "@/components/grundlagen/TrainerLessonIntro";
import { TrainerWrongFeedback } from "@/components/grundlagen/TrainerWrongFeedback";
import { IconCheck, IconLock } from "@/components/icons";
import { checkSentenceBuilt } from "@/lib/germanTextCompare";
import {
  buildDasIstDeckExercises,
  buildPair,
  DAS_IST_ADJECTIVES,
  DAS_IST_DECKS,
  DAS_IST_LESSON,
  DAS_IST_PASS_SCORE,
  DAS_IST_RULES,
  getDasIstNouns,
  pairFullDe,
  PRONOUN_BRIDGE,
  type DasIstDeckId,
  type DasIstExercise,
  type DasIstPair,
} from "@/lib/dasIstEngine";
import {
  isDasIstDeckUnlocked,
  loadDasIstProgress,
  markDasIstDeckDone,
  saveDasIstProgress,
} from "@/lib/dasIstStorage";
import { useSessionStreak } from "@/lib/useSessionStreak";

type Phase = "list" | "learn" | "play" | "done";

function TwoLinePreview({ pair, highlight }: { pair: DasIstPair; highlight?: "1" | "2" | "both" }) {
  return (
    <div className="space-y-2 rounded-xl border border-sage-100 bg-sage-50/80 p-4">
      <p
        className={`text-sm font-medium ${
          highlight === "2" ? "text-sage-400" : "text-goethe-blue"
        }`}
      >
        <span className="text-sage-500">1 · </span>
        {pair.line1_de}
        <span className="mt-0.5 block text-xs font-normal text-sage-500">{pair.line1_tr}</span>
      </p>
      <p
        className={`text-sm font-medium ${
          highlight === "1" ? "text-sage-400" : "text-goethe-blue"
        }`}
      >
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

function PronounBridgeTable({ activeArticle }: { activeArticle?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-sage-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-sage-100 text-left text-[10px] uppercase text-sage-400">
            <th className="px-3 py-2">Artikel</th>
            <th className="px-3 py-2">ein / eine</th>
            <th className="px-3 py-2">2. cümle</th>
          </tr>
        </thead>
        <tbody>
          {PRONOUN_BRIDGE.map((row) => (
            <tr
              key={row.article}
              className={`border-b border-sage-50 ${
                activeArticle === row.article ? "bg-goethe-gold/10" : ""
              }`}
            >
              <td className="px-3 py-2 font-medium text-goethe-blue">{row.article}</td>
              <td className="px-3 py-2 text-sage-600">{row.indef}</td>
              <td className="px-3 py-2 font-medium text-goethe-blue">
                {row.pronoun} ist …
                <span className="ml-1 text-xs font-normal text-sage-400">({row.tr})</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DasIstLegoTrainer() {
  const [phase, setPhase] = useState<Phase>("list");
  const [deckId, setDeckId] = useState<DasIstDeckId | null>(null);
  const [progress, setProgress] = useState(loadDasIstProgress);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setProgress(loadDasIstProgress());
  }, []);

  const exercises = useMemo(() => {
    if (!deckId) return [];
    return buildDasIstDeckExercises(deckId, 8, deckId.length * 9923);
  }, [deckId]);

  const activeDeck = DAS_IST_DECKS.find((d) => d.id === deckId);

  const samplePair = useMemo(() => {
    if (!deckId) return null;
    const nouns = getDasIstNouns(deckId);
    const noun = nouns[0];
    if (!noun) return null;
    const adj =
      deckId === "er"
        ? DAS_IST_ADJECTIVES.find((a) => a.id === "gut")!
        : DAS_IST_ADJECTIVES.find((a) => a.id === "schoen")!;
    return buildPair(noun, adj);
  }, [deckId]);

  const openDeck = (id: DasIstDeckId) => {
    if (!isDasIstDeckUnlocked(id, progress)) return;
    setDeckId(id);
    setPhase("learn");
    setExerciseIdx(0);
    setScore(0);
  };

  const finishDeck = useCallback(
    (finalScore: number) => {
      if (!deckId) return;
      const next = markDasIstDeckDone(progress, deckId, finalScore);
      setProgress(next);
      saveDasIstProgress(next);
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

  if (phase === "list") {
    return (
      <div className="space-y-4">
        <Link
          href="/grundlagen/sentence-engine"
          className="text-sm text-goethe-blue hover:underline"
        >
          ← Sentence Engine
        </Link>

        <TrainerLessonIntro
          badge={DAS_IST_LESSON.badge}
          title={DAS_IST_LESSON.title}
          summary={DAS_IST_LESSON.summary}
          sections={DAS_IST_LESSON.sections}
          rules={DAS_IST_RULES}
        >
          <TrainerLessonCompare
            title="Das ≠ das"
            left={DAS_IST_LESSON.twoDas.left}
            right={DAS_IST_LESSON.twoDas.right}
          />
          <PronounBridgeTable />
        </TrainerLessonIntro>

        <p className="text-xs text-sage-500">
          Sırayla: Es → Er → Sie → karışık
        </p>

        <ol className="space-y-2">
          {DAS_IST_DECKS.map((d) => {
            const unlocked = isDasIstDeckUnlocked(d.id, progress);
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
                    {done ? <IconCheck size={16} /> : !unlocked ? <IconLock size={14} /> : d.pronounOnly?.[0] ?? "?"}
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

        {deckId === "es" && (
          <p className="text-sm text-sage-600">
            Bu adımda <strong>sadece Es</strong> — das kelimeler (Hotel, Café …). İlk tanıtım:{" "}
            <strong>ein</strong>. Sonra <strong>Es</strong> ile yorum.
          </p>
        )}
        {deckId === "er" && (
          <p className="text-sm text-sage-600">
            Şimdi <strong>der → Er</strong> (Supermarkt, Bahnhof …). Satır 1: ein · Satır 2: Er.
          </p>
        )}
        {deckId === "sie" && (
          <p className="text-sm text-sage-600">
            Şimdi <strong>die → Sie</strong> (Apotheke, Bank …). die isimlerde satır 1:{" "}
            <strong>eine</strong>.
          </p>
        )}
        {deckId === "mixed" && (
          <p className="text-sm text-sage-600">
            Artikel → zamir köprüsünü hatırla: der→Er, die→Sie, das→Es.
          </p>
        )}

        <TrainerLessonCompare
          title="Bu adımda hatırla"
          left={DAS_IST_LESSON.twoDas.left}
          right={{
            label: `Bu deste: ${activeDeck.titleTr}`,
            de: `${samplePair.line1_de} ${samplePair.pronoun} ist …`,
            tr: `${samplePair.noun.article} → ${samplePair.pronoun}`,
          }}
        />

        <PronounBridgeTable activeArticle={samplePair.noun.article} />

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
    const passed = score >= DAS_IST_PASS_SCORE;
    return (
      <div className="card-soft space-y-4 p-6 text-center">
        <p className="text-lg font-bold text-goethe-blue">{activeDeck.title}</p>
        <p className="text-3xl font-bold text-goethe-gold">
          {score} / {exercises.length}
        </p>
        <p className="text-sm text-sage-600">
          {passed
            ? "Adım tamam — sonraki zamire geçebilirsin."
            : `${DAS_IST_PASS_SCORE}/8 lazım — tekrar dene.`}
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
          <DasIstExerciseCard exercise={exercises[exerciseIdx]} onAnswer={handleAnswer} />
        </ContentTransition>
      </div>
    );
  }

  return null;
}

function DasIstExerciseCard({
  exercise,
  onAnswer,
}: {
  exercise: DasIstExercise;
  onAnswer: (correct: boolean) => void;
}) {
  if (exercise.kind === "pronoun" || exercise.kind === "ein") {
    return <DasIstPickCard exercise={exercise} onAnswer={onAnswer} />;
  }
  return <DasIstBuildCard exercise={exercise} onAnswer={onAnswer} />;
}

function DasIstPickCard({
  exercise,
  onAnswer,
}: {
  exercise: DasIstExercise;
  onAnswer: (correct: boolean) => void;
}) {
  const { recordCorrect, recordWrong } = useSessionStreak();
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const options = useMemo(
    () => [...exercise.tokens, ...exercise.distractors],
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
      <TwoLinePreview
        pair={exercise.pair}
        highlight={exercise.kind === "pronoun" ? "1" : "1"}
      />
      <p className="text-base font-medium text-goethe-blue">{exercise.prompt_tr}</p>
      {exercise.hint_tr && !checked && <TrainerHint>{exercise.hint_tr}</TrainerHint>}
      <div className="grid grid-cols-3 gap-2">
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
              reasons={[`${exercise.pair.noun.article} → ${exercise.pair.pronoun}`]}
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

function DasIstBuildCard({
  exercise,
  onAnswer,
}: {
  exercise: DasIstExercise;
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
    const answer = exercise.kind === "both" ? exercise.answer_de : exercise.answer_de;
    const built =
      exercise.kind === "both"
        ? selected.join(" ").replace(/\s+\./g, ".")
        : selected.join(" ");
    const normAnswer = answer.replace(/\./g, "").trim();
    const normBuilt = built.replace(/\./g, "").trim();
    const isOk =
      normBuilt === normAnswer ||
      checkSentenceBuilt(selected, exercise.answer_de);
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
              reasons={["Satır 1: Das ist ein/eine … · Satır 2: Er/Sie/Es ist sehr …"]}
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
