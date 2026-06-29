"use client";

import { useCallback, useMemo, useState } from "react";
import { getA1Vocabulary, getDistractors } from "@german-coach/vocabulary";
import { IconCheck, IconX } from "@/components/icons";
import { AudioButton } from "@/components/AudioButton";
import { formatWord } from "@/lib/audio";
import { recordWordRecall } from "@/lib/learningEngine";
import { useProgress } from "@/lib/ProgressContext";

type QuizPhase = "question" | "result" | "finished";

export default function QuizPage() {
  const { progress, updateProgress } = useProgress();
  const vocab = getA1Vocabulary();
  const [phase, setPhase] = useState<QuizPhase>("question");
  const [selected, setSelected] = useState<string | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionWrong, setSessionWrong] = useState(0);
  const [questionNum, setQuestionNum] = useState(1);
  const totalQuestions = 10;

  const index = progress.quizIndex % vocab.words.length;
  const currentWord = vocab.words[index];

  const options = useMemo(() => {
    const distractors = getDistractors(currentWord, 3);
    const all = [currentWord, ...distractors];
    return all.sort(() => Math.random() - 0.5);
  }, [currentWord]);

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (phase !== "question") return;
      const isCorrect = optionId === currentWord.id;
      setSelected(optionId);
      setPhase("result");
      setSessionCorrect((c) => c + (isCorrect ? 1 : 0));
      setSessionWrong((w) => w + (isCorrect ? 0 : 1));
      updateProgress((p) => recordWordRecall(p, currentWord.id, isCorrect, "quiz"));
    },
    [phase, currentWord.id, updateProgress]
  );

  const nextQuestion = useCallback(() => {
    if (questionNum >= totalQuestions) {
      setPhase("finished");
      updateProgress((p) => ({
        ...p,
        quizIndex: (index + 1) % vocab.words.length,
        dailyStats: {
          ...p.dailyStats,
          quizzesCompleted: p.dailyStats.quizzesCompleted + 1,
        },
      }));
      return;
    }
    setQuestionNum((n) => n + 1);
    setSelected(null);
    setPhase("question");
    updateProgress((p) => ({
      ...p,
      quizIndex: (index + 1) % vocab.words.length,
    }));
  }, [questionNum, index, vocab.words.length, updateProgress]);

  const restart = () => {
    setPhase("question");
    setSelected(null);
    setSessionCorrect(0);
    setSessionWrong(0);
    setQuestionNum(1);
  };

  if (phase === "finished") {
    const pct = Math.round((sessionCorrect / totalQuestions) * 100);
    const pass = pct >= 85;
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="card-soft p-8">
          <span className="goethe-badge mb-4">Quiz Tamamlandı</span>
          <h1 className="mb-2 text-3xl font-bold text-goethe-blue">
            {sessionCorrect}/{totalQuestions}
          </h1>
          <p className="text-lg text-sage-600">Doğruluk: %{pct}</p>
          <p className={`mt-2 text-sm ${pass ? "text-sage-600" : "text-goethe-red"}`}>
            {pass
              ? "A1 kelime hedefine uygun — devam!"
              : "Hedef %85+. Yanlış kelimeleri kart modunda tekrar et."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" className="btn-primary" onClick={restart}>
              Yeni Quiz
            </button>
            <a href="/cards" className="btn-secondary">
              Kartlara Git
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect = selected === currentWord.id;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-goethe-blue">Kelime Quiz</h1>
          <p className="text-sm text-sage-400">
            Soru {questionNum}/{totalQuestions}
          </p>
        </div>
        <span className="inline-flex items-center gap-3 rounded-full bg-sage-100 px-3 py-1 text-xs text-sage-600">
          <span className="inline-flex items-center gap-1">
            <IconCheck size={12} /> {sessionCorrect}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconX size={12} /> {sessionWrong}
          </span>
        </span>
      </header>

      <div className="card-soft p-6">
        <p className="mb-1 text-xs uppercase tracking-wide text-sage-400">
          {currentWord.category} · A1 format
        </p>
        <p className="mb-4 text-sm text-sage-500">
          Bu kelimenin Türkçe karşılığı nedir?
        </p>
        <div className="mb-6 flex items-center justify-between rounded-xl bg-goethe-blue/5 p-4">
          <span className="text-2xl font-semibold text-goethe-blue">
            {formatWord(currentWord.word, currentWord.article)}
          </span>
          <AudioButton text={formatWord(currentWord.word, currentWord.article)} size="sm" audioSrc={currentWord.audio_word} />
        </div>

        <div className="grid gap-2">
          {options.map((opt) => {
            let cls =
              "w-full rounded-xl border px-4 py-3 text-left text-sm transition ";
            if (phase === "result") {
              if (opt.id === currentWord.id) cls += "border-sage-400 bg-sage-100 text-sage-700";
              else if (opt.id === selected) cls += "border-red-200 bg-red-50 text-red-700";
              else cls += "border-sage-100 bg-white text-sage-400 opacity-60";
            } else {
              cls +=
                "border-sage-200 bg-white text-sage-700 hover:border-sage-400 hover:bg-sage-50 cursor-pointer";
            }
            return (
              <button
                key={opt.id}
                type="button"
                className={cls}
                onClick={() => handleAnswer(opt.id)}
                disabled={phase !== "question"}
              >
                {opt.translation_tr}
              </button>
            );
          })}
        </div>

        {phase === "result" && (
          <div className="animate-feedback-in mt-4 space-y-3">
            <p
              className={`text-center text-sm font-medium ${isCorrect ? "text-sage-600" : "text-goethe-red"} ${!isCorrect ? "animate-shake-soft" : ""}`}
            >
              {isCorrect ? "Richtig! — Doğru" : `Falsch — Doğru: ${currentWord.translation_tr}`}
            </p>
            <p className="text-center text-xs italic text-sage-400">{currentWord.example_de}</p>
            <button type="button" className="btn-primary w-full" onClick={nextQuestion}>
              {questionNum >= totalQuestions ? "Sonuçları Gör" : "Sonraki Soru →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
