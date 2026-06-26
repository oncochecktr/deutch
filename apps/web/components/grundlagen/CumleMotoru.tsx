"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CATEGORIES_A1, getA1Vocabulary } from "@german-coach/vocabulary";
import {
  loadLearnerProfile,
  saveLearnerProfile,
  learnerDisplayName,
  type LearnerProfile,
} from "@/lib/learnerProfileStorage";
import {
  recordCumleMotoruCardSeen,
  recordCumleMotoruQuiz,
} from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";
import { IconCheck, IconX } from "@/components/icons";
import { LearnerOnboarding } from "@/components/grundlagen/LearnerOnboarding";
import { SpiegelCardView } from "@/components/grundlagen/SpiegelCardView";
import { WordSpiegelList } from "@/components/grundlagen/WordSpiegelList";
import {
  filterWordSpiegel,
  generateWordQuizzes,
  getAllWordSpiegel,
  getWordSpiegelById,
  type WordQuiz,
} from "@/lib/wordSpiegel";

export function CumleMotoru() {
  const { progress, updateProgress } = useProgress();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [showOnboard, setShowOnboard] = useState(false);
  const [mode, setMode] = useState<"kelimeler" | "oyun">("kelimeler");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const allWords = useMemo(() => getAllWordSpiegel(), []);
  const filtered = useMemo(
    () => filterWordSpiegel(allWords, search, category),
    [allWords, search, category]
  );
  const quizzes = useMemo(() => generateWordQuizzes(10), []);

  useEffect(() => {
    const p = loadLearnerProfile();
    setProfile(p);
    if (!p.onboardingComplete) setShowOnboard(true);
    const initial =
      p.lastWordId && getWordSpiegelById(p.lastWordId)
        ? p.lastWordId
        : allWords[0]?.id ?? null;
    setSelectedId(initial);
  }, [allWords]);

  const selected = selectedId ? getWordSpiegelById(selectedId) : null;
  const points = progress.grundlagen.cumleMotoruPoints;
  const streak = progress.grundlagen.cumleMotoruStreak;
  const showTurkish = profile?.showTurkish ?? true;
  const seenCount = progress.grundlagen.cumleMotoruSeenCards.length;
  const total = getA1Vocabulary().total;

  const selectWord = useCallback(
    (id: string) => {
      setSelectedId(id);
      saveLearnerProfile({ lastWordId: id });
      setProfile(loadLearnerProfile());
      updateProgress((p) =>
        recordCumleMotoruCardSeen(p, id, filtered.findIndex((w) => w.id === id))
      );
    },
    [filtered, updateProgress]
  );

  const toggleTurkish = () => {
    if (!profile) return;
    const next = saveLearnerProfile({ showTurkish: !profile.showTurkish });
    setProfile(next);
  };

  if (!profile) {
    return <p className="text-center text-sage-500">Yükleniyor…</p>;
  }

  return (
    <div className="space-y-4">
      {showOnboard && (
        <LearnerOnboarding
          onComplete={() => {
            setProfile(loadLearnerProfile());
            setShowOnboard(false);
          }}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-goethe-gold/20 px-2.5 py-1 text-sm font-bold text-goethe-blue">
            {points} puan
          </span>
          {streak > 0 && (
            <span className="text-sm text-sage-500">🔥 {streak}</span>
          )}
          <span className="text-xs text-sage-400">
            {seenCount}/{total} kelime
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTurkish}
            className="rounded-full border border-sage-200 px-2.5 py-1 text-[10px] text-sage-500"
          >
            TR {showTurkish ? "açık" : "kapalı"}
          </button>
          <button
            type="button"
            className="rounded-full border border-sage-200 px-3 py-1 text-xs text-goethe-blue"
            onClick={() => setShowOnboard(true)}
          >
            {learnerDisplayName(profile)}
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold ${
            mode === "kelimeler" ? "bg-goethe-blue text-white" : "bg-sage-100 text-sage-600"
          }`}
          onClick={() => setMode("kelimeler")}
        >
          852 kelime
        </button>
        <button
          type="button"
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold ${
            mode === "oyun" ? "bg-goethe-blue text-white" : "bg-sage-100 text-sage-600"
          }`}
          onClick={() => setMode("oyun")}
        >
          Oyna
        </button>
      </div>

      {mode === "kelimeler" ? (
        <>
          {selected && <SpiegelCardView card={selected} showTurkish={showTurkish} />}

          <input
            type="search"
            placeholder="Kelime veya cümle ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-goethe-blue/40"
          />

          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                !category ? "bg-goethe-blue text-white" : "bg-sage-100 text-sage-600"
              }`}
            >
              Tümü ({total})
            </button>
            {CATEGORIES_A1.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat === category ? null : cat)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                  category === cat ? "bg-goethe-blue text-white" : "bg-sage-100 text-sage-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-xs text-sage-400">{filtered.length} kelime — dokun, kart açılsın</p>

          <WordSpiegelList
            items={filtered}
            selectedId={selectedId}
            onSelect={selectWord}
          />
        </>
      ) : (
        <WordGamePlay
          quizzes={quizzes}
          onAnswer={(correct, wordId) => {
            updateProgress((p) => recordCumleMotoruQuiz(p, correct));
            if (wordId) {
              updateProgress((p) => recordCumleMotoruCardSeen(p, wordId, 0));
            }
          }}
        />
      )}
    </div>
  );
}

function WordGamePlay({
  quizzes,
  onAnswer,
}: {
  quizzes: WordQuiz[];
  onAnswer: (correct: boolean, wordId: string) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const quiz = quizzes[idx];

  if (!quiz) return <p className="text-sage-500">Yükleniyor…</p>;

  if (idx >= quizzes.length) {
    return (
      <div className="rounded-2xl border border-sage-100 bg-white p-8 text-center">
        <p className="text-2xl font-bold text-goethe-blue">Tur bitti!</p>
        <p className="mt-2 text-sage-600">
          {sessionCorrect} / {quizzes.length} doğru
        </p>
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={() => {
            setIdx(0);
            setSessionCorrect(0);
          }}
        >
          Tekrar oyna
        </button>
      </div>
    );
  }

  return (
    <WordQuizCard
      key={quiz.id}
      quiz={quiz}
      index={idx}
      total={quizzes.length}
      onDone={(correct) => {
        onAnswer(correct, quiz.wordId);
        if (correct) setSessionCorrect((s) => s + 1);
        setIdx((i) => i + 1);
      }}
    />
  );
}

function WordQuizCard({
  quiz,
  index,
  total,
  onDone,
}: {
  quiz: WordQuiz;
  index: number;
  total: number;
  onDone: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const show = selected !== null;
  const ok = selected === quiz.correctIndex;

  return (
    <div className="space-y-4 rounded-2xl border border-sage-100 bg-white p-5">
      <p className="text-xs text-sage-400">
        {index + 1} / {total} — Hangi Almanca cümle?
      </p>
      <p className="text-lg font-medium text-sage-700">{quiz.prompt_tr}</p>
      <div className="space-y-2">
        {quiz.options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            disabled={show}
            onClick={() => setSelected(i)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium ${
              !show
                ? "border-sage-100 text-goethe-blue hover:border-sage-300"
                : i === quiz.correctIndex
                  ? "border-sage-500 bg-sage-50"
                  : i === selected
                    ? "border-red-200 bg-red-50"
                    : "opacity-40"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {show && (
        <>
          <div className={`flex items-center gap-2 text-sm ${ok ? "text-sage-600" : "text-red-600"}`}>
            {ok ? <IconCheck size={18} /> : <IconX size={18} />}
            {ok ? "Doğru cümle!" : `Doğrusu: ${quiz.options[quiz.correctIndex]}`}
          </div>
          <button type="button" className="btn-primary w-full" onClick={() => onDone(ok)}>
            Sonraki →
          </button>
        </>
      )}
    </div>
  );
}
