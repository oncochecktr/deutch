"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Article, VocabularyWord } from "@german-coach/vocabulary";
import { AudioButton } from "@/components/AudioButton";
import { RewardBurst } from "@/components/RewardBurst";
import { TrainerCorrectFeedback } from "@/components/grundlagen/TrainerCorrectFeedback";
import { TrainerWrongFeedback } from "@/components/grundlagen/TrainerWrongFeedback";
import { GoldCueLine } from "@/components/ui/GoldCueLine";
import { SmartTip } from "@/components/ui/SmartTip";
import {
  ARTIKEL_OPTIONS,
  ARTIKEL_SESSION_SIZE,
  parseArtikelKey,
  pickArtikelSession,
} from "@/lib/artikelGame";
import { formatWord } from "@/lib/audio";
import { recordAnswer } from "@/lib/progress";
import { pickSessionReward } from "@/lib/trainerRewards";
import { splitMeanings } from "@/lib/vocabMeta";
import { useProgress } from "@/lib/ProgressContext";
import { useSessionStreak } from "@/lib/useSessionStreak";

const ADVANCE_MS = 450;

type Phase = "question" | "finished";

function meaningLabel(word: VocabularyWord): string {
  const m = splitMeanings(word.translation_tr);
  return m[0] ?? word.translation_tr;
}

export function ArtikelGame() {
  const { progress, updateProgress } = useProgress();
  const { streak, recordCorrect, recordWrong, reset: resetStreak } = useSessionStreak();
  const [phase, setPhase] = useState<Phase>("question");
  const [qIdx, setQIdx] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [selected, setSelected] = useState<Article | null>(null);
  const [rewardTrigger, setRewardTrigger] = useState(0);
  const [lastReward, setLastReward] = useState<ReturnType<typeof pickSessionReward> | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const sessionWords = useMemo(
    () => pickArtikelSession(ARTIKEL_SESSION_SIZE, progress.artikelGameIndex),
    [progress.artikelGameIndex]
  );

  const word = sessionWords[qIdx];
  const showResult = selected !== null;
  const isCorrect = showResult && word && selected === word.article;
  const isLast = qIdx >= ARTIKEL_SESSION_SIZE - 1;
  const fullPhrase = word ? formatWord(word.word, word.article) : "";

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    []
  );

  useEffect(() => {
    if (phase !== "question") return;
    rootRef.current?.focus({ preventScroll: true });
  }, [phase, qIdx]);

  const finishSession = useCallback(
    (finalCorrect: number) => {
      updateProgress((p) => ({
        ...p,
        artikelGameIndex: p.artikelGameIndex + ARTIKEL_SESSION_SIZE,
        dailyStats: {
          ...p.dailyStats,
          artikelGameSessions: p.dailyStats.artikelGameSessions + 1,
        },
      }));
      setSessionCorrect(finalCorrect);
      setPhase("finished");
    },
    [updateProgress]
  );

  const goNext = useCallback(() => {
    if (!word || selected === null) return;
    const ok = selected === word.article;
    const running = sessionCorrect + (ok ? 1 : 0);
    if (isLast) {
      finishSession(running);
      return;
    }
    setSessionCorrect(running);
    setQIdx((i) => i + 1);
    setSelected(null);
    setLastReward(null);
  }, [word, selected, sessionCorrect, isLast, finishSession]);

  const scheduleAdvance = useCallback(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      goNext();
      advanceTimer.current = null;
    }, ADVANCE_MS);
  }, [goNext]);

  const answer = useCallback(
    (article: Article) => {
      if (!word || showResult) return;
      setSelected(article);
      const ok = article === word.article;
      updateProgress((p) => recordAnswer(p, word.id, ok));
      if (ok) {
        const s = recordCorrect();
        const reward = pickSessionReward(s, true);
        setLastReward(reward);
        if (reward) setRewardTrigger((t) => t + 1);
        scheduleAdvance();
      } else {
        recordWrong();
        setLastReward(null);
      }
    },
    [word, showResult, updateProgress, recordCorrect, recordWrong, scheduleAdvance]
  );

  const playPrompt = useCallback(() => {
    if (!word) return;
    void import("@/lib/audio").then(({ playGermanAudio }) =>
      playGermanAudio(word.word, word.audio_word)
    );
  }, [word]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (phase !== "question" || !word) return;
    const article = parseArtikelKey(e.key);
    if (article && !showResult) {
      e.preventDefault();
      answer(article);
      return;
    }
    if (e.key === " " && !showResult) {
      e.preventDefault();
      void playPrompt();
      return;
    }
    if (e.key === "Enter" && showResult) {
      e.preventDefault();
      if (advanceTimer.current) {
        clearTimeout(advanceTimer.current);
        advanceTimer.current = null;
      }
      goNext();
    }
  };

  const restart = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    resetStreak();
    setPhase("question");
    setQIdx(0);
    setSessionCorrect(0);
    setSelected(null);
    setLastReward(null);
  };

  if (sessionWords.length === 0) {
    return (
      <p className="text-center text-sm text-sage-600">
        Artikel oyunu için yeterli isim bulunamadı.
      </p>
    );
  }

  if (phase === "finished") {
    const pct = Math.round((sessionCorrect / ARTIKEL_SESSION_SIZE) * 100);
    const pass = pct >= 80;
    return (
      <div className="card-soft space-y-6 p-6 text-center">
        <p className="text-label font-bold uppercase text-goethe-blue">Oturum bitti</p>
        <p className="text-4xl font-bold text-goethe-blue">
          {sessionCorrect}/{ARTIKEL_SESSION_SIZE}
        </p>
        <p className={`text-lg font-semibold ${pass ? "text-sage-600" : "text-goethe-blue"}`}>
          %{pct} · {pass ? "Güzel — artikeller oturuyor!" : "Tekrar dene — dinle ve seç"}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" className="btn-primary" onClick={restart}>
            Tekrar oyna
          </button>
          <Link href="/grundlagen/artikel" className="btn-secondary">
            Trainer&apos;a dön
          </Link>
        </div>
      </div>
    );
  }

  if (!word) return null;

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="card-soft relative space-y-4 p-5 outline-none ring-2 ring-goethe-gold/30 ring-offset-2"
    >
      <RewardBurst trigger={rewardTrigger} reward={lastReward} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-label font-semibold uppercase text-goethe-blue">Artikel oyunu</p>
        <span className="text-sm tabular-nums text-sage-500">
          Soru {qIdx + 1} / {ARTIKEL_SESSION_SIZE}
          {streak > 1 ? ` · seri ${streak}` : ""}
          {sessionCorrect > 0 ? ` · ${sessionCorrect} doğru` : ""}
        </span>
      </div>

      <SmartTip id="artikel-game-keyboard">
        <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
          Space
        </kbd>{" "}
        dinle ·{" "}
        <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
          1
        </kbd>
        /
        <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
          d
        </kbd>{" "}
        der ·{" "}
        <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
          2
        </kbd>
        /
        <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
          i
        </kbd>{" "}
        die ·{" "}
        <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
          3
        </kbd>
        /
        <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
          a
        </kbd>{" "}
        das ·{" "}
        <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
          Enter
        </kbd>{" "}
        sonraki
      </SmartTip>

      <div className="text-center">
        <p className="text-sm text-sage-600">
          <strong className="text-goethe-blue">{meaningLabel(word)}</strong> — artikeli nedir?
        </p>
        <GoldCueLine className="mx-auto mt-3 max-w-xs" />
        <p className="mt-4 text-3xl font-bold text-goethe-blue sm:text-4xl">{word.word}</p>
        <div className="mt-4 flex justify-center">
          <AudioButton
            text={word.word}
            audioSrc={word.audio_word}
            label="Dinle"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {ARTIKEL_OPTIONS.map((opt, i) => {
          const isSelected = selected === opt;
          const isAnswer = showResult && word.article === opt;
          const isWrongPick = showResult && isSelected && !isCorrect;

          let cls =
            "rounded-xl border-2 px-3 py-4 text-center text-lg font-bold transition active:scale-[0.98] sm:py-5 sm:text-xl ";
          if (isAnswer) cls += "border-sage-500 bg-sage-100 text-sage-800";
          else if (isWrongPick) cls += "border-red-300 bg-red-50 text-red-800";
          else if (isSelected) cls += "border-goethe-blue bg-goethe-blue/10 text-goethe-blue";
          else if (showResult) cls += "border-sage-100 opacity-50";
          else cls += "border-sage-200 hover:border-goethe-blue/40 hover:bg-sage-50";

          return (
            <button
              key={opt}
              type="button"
              disabled={showResult}
              className={cls}
              onClick={() => answer(opt)}
            >
              <span className="block text-[10px] font-normal text-sage-400">{i + 1}</span>
              {opt}
            </button>
          );
        })}
      </div>

      {showResult && isCorrect && (
        <TrainerCorrectFeedback answer={fullPhrase} reward={lastReward} />
      )}

      {showResult && !isCorrect && word.article && (
        <TrainerWrongFeedback
          correctAnswer={fullPhrase}
          reasons={[`${word.word} → ${word.article} (${meaningLabel(word)})`]}
          ruleTr="İsimlerin artikeli ezberlenir — dinle, tahmin et, tam kalıbı tekrar et."
        />
      )}

      {showResult && (
        <button type="button" className="btn-primary w-full" onClick={goNext}>
          {isLast ? "Sonucu gör" : "Sonraki soru"} →
        </button>
      )}
    </div>
  );
}
