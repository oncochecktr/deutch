"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getA1Vocabulary } from "@german-coach/vocabulary";
import { PageShell } from "@/components/PageShell";
import { LearningCoachBanner } from "@/components/LearningCoachBanner";
import { SessionTrail } from "@/components/SessionTrail";
import { StudyMotivation } from "@/components/StudyMotivation";
import { WordCard } from "@/components/WordCard";
import { IconArrowLeft, IconArrowRight } from "@/components/icons";
import {
  cardsCoachMessage,
  shouldShowCardsCoachBanner,
} from "@/lib/learningCoach";
import { recordAnswer } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";
import { useLearningCoach } from "@/lib/useLearningCoach";

const SESSION_MEMORY_MAX = 20;

export default function CardsPage() {
  const { progress, updateProgress, hydrated, flushProgress } = useProgress();
  const { coach } = useLearningCoach();
  const vocab = getA1Vocabulary();
  const [flipped, setFlipped] = useState(false);
  const [trail, setTrail] = useState<string[]>([]);
  const [trailCursor, setTrailCursor] = useState(0);
  const [nudgeTrigger, setNudgeTrigger] = useState(0);
  const trailReady = useRef(false);

  useEffect(() => {
    return () => flushProgress();
  }, [flushProgress]);

  const index = Math.min(progress.cardIndex, vocab.words.length - 1);
  const liveWord = vocab.words[index];
  const livePos = Math.max(0, trail.length - 1);
  const isLive = trail.length === 0 || trailCursor === livePos;
  const viewId = trail.length > 0 ? trail[trailCursor] : liveWord.id;
  const word = vocab.words.find((w) => w.id === viewId) ?? liveWord;

  useEffect(() => {
    if (!hydrated || trailReady.current) return;
    const validIds = new Set(vocab.words.map((w) => w.id));
    const saved = progress.cardsTrail.filter((id) => validIds.has(id));
    if (saved.length > 0) {
      const trimmed = saved.slice(-SESSION_MEMORY_MAX);
      setTrail(trimmed);
      setTrailCursor(Math.min(Math.max(0, progress.cardsTrailCursor), trimmed.length - 1));
    } else {
      setTrail([liveWord.id]);
      setTrailCursor(0);
    }
    trailReady.current = true;
  }, [hydrated, progress.cardsTrail, progress.cardsTrailCursor, liveWord.id, vocab.words]);

  useEffect(() => {
    if (!hydrated || !trailReady.current || trail.length === 0) return;
    updateProgress({ cardsTrail: trail, cardsTrailCursor: trailCursor });
  }, [trail, trailCursor, hydrated, updateProgress]);

  const goToTrailIndex = useCallback((i: number) => {
    setTrailCursor(i);
    setFlipped(false);
  }, []);

  const appendTrail = useCallback((nextWordId: string) => {
    setTrail((t) => {
      if (t[t.length - 1] === nextWordId) return t;
      let next = [...t, nextWordId];
      if (next.length > SESSION_MEMORY_MAX) {
        next = next.slice(-SESSION_MEMORY_MAX);
      }
      setTrailCursor(next.length - 1);
      return next;
    });
    setFlipped(false);
    setNudgeTrigger((n) => n + 1);
  }, []);

  const continueLive = useCallback(() => {
    if (!isLive) return;
    const nextIndex = (index + 1) % vocab.words.length;
    const nextWord = vocab.words[nextIndex];
    updateProgress((p) => ({
      ...recordAnswer(p, liveWord.id, true),
      cardIndex: nextIndex,
    }));
    appendTrail(nextWord.id);
  }, [isLive, liveWord.id, index, vocab.words, updateProgress, appendTrail]);

  const goPrevious = () => {
    if (trailCursor > 0) {
      setTrailCursor((c) => c - 1);
      setFlipped(false);
    }
  };

  const goNext = () => {
    if (trailCursor < livePos) {
      setTrailCursor((c) => c + 1);
      setFlipped(false);
      return;
    }
    if (isLive) {
      continueLive();
    }
  };

  const progressPct = useMemo(
    () => Math.round(((index + 1) / vocab.words.length) * 100),
    [index, vocab.words.length]
  );

  const canGoPrev = trailCursor > 0;
  const canGoNextHistory = trailCursor < livePos;
  const canContinueLive = isLive;
  const canGoNext = canGoNextHistory || canContinueLive;

  const showCoachBanner = shouldShowCardsCoachBanner(trail.length, coach);
  const coachMsg = cardsCoachMessage(coach);

  return (
    <>
      <StudyMotivation trigger={nudgeTrigger} />

      <PageShell title="Kelime Kartları" subtitle={`Kart ${index + 1} / ${vocab.words.length}`}>
        <div className="mx-auto h-2 max-w-xs overflow-hidden rounded-full bg-sage-100">
          <div
            className="h-full bg-sage-400 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {!isLive && (
          <div className="rounded-xl border border-goethe-gold/40 bg-goethe-gold/10 px-4 py-3 text-center text-sm text-goethe-blue">
            Geçmiş kelime ({trailCursor + 1}/{trail.length})
          </div>
        )}

        {!flipped && isLive && (
          <p className="text-center text-sm text-sage-400">
            Kartı çevir · <strong className="text-sage-500">Sonraki kelime</strong>
          </p>
        )}

        {showCoachBanner && (
          <LearningCoachBanner
            coach={coach}
            variant="session"
            sessionTitle={coachMsg.title}
            sessionBody={coachMsg.body}
            sessionHref={coachMsg.href}
            sessionCta={coachMsg.cta}
          />
        )}

        <WordCard
          word={word}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
          readOnly={!isLive && flipped}
          showHearAndWrite={isLive}
          onDictationCorrect={isLive ? continueLive : undefined}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="btn-secondary-lg flex flex-1 items-center justify-center gap-2"
            onClick={goPrevious}
            disabled={!canGoPrev}
          >
            <IconArrowLeft size={18} />
            Önceki
          </button>
          <button
            type="button"
            className={`flex flex-1 items-center justify-center gap-2 ${
              canContinueLive ? "btn-primary-lg" : "btn-secondary-lg"
            }`}
            onClick={goNext}
            disabled={!canGoNext}
          >
            {canContinueLive ? "Sonraki kelime" : "İleri"}
            <IconArrowRight size={18} />
          </button>
        </div>

        <SessionTrail
          wordIds={trail}
          currentIndex={trailCursor}
          onSelect={goToTrailIndex}
          label="Bu oturumda gördüklerin"
          maxVisible={SESSION_MEMORY_MAX}
        />
      </PageShell>
    </>
  );
}
