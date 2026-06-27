"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getA1Vocabulary, getTimurVocabulary, getWordById } from "@german-coach/vocabulary";
import { PageShell } from "@/components/PageShell";
import { ResetSRSButton } from "@/components/ResetSRSButton";
import { SessionTrail } from "@/components/SessionTrail";
import { StudyMotivation } from "@/components/StudyMotivation";
import { WordCard } from "@/components/WordCard";
import { IconArrowLeft, IconArrowRight } from "@/components/icons";
import { recordSRSReview, resetStudyProfile, type UserProgress } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";
import { buildReviewQueue, getIntervalLabel, getSRSStats } from "@/lib/srs";

const SESSION_MEMORY_MAX = 20;

export default function ReviewPage() {
  const { progress, updateProgress, hydrated } = useProgress();
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(0);
  const [sessionWords, setSessionWords] = useState<string[]>([]);
  const [viewPos, setViewPos] = useState(0);
  const [nudgeTrigger, setNudgeTrigger] = useState(0);
  const sessionReady = useRef(false);

  const allIds = useMemo(
    () => [
      ...getA1Vocabulary().words.map((w) => w.id),
      ...getTimurVocabulary().words.map((w) => w.id),
    ],
    []
  );

  const stats = useMemo(
    () => getSRSStats(allIds, progress.srsRecords),
    [allIds, progress.srsRecords]
  );

  const queue = useMemo(() => {
    if (progress.reviewQueue.length > 0) return progress.reviewQueue;
    return buildReviewQueue(allIds, progress.srsRecords, 30);
  }, [allIds, progress.srsRecords, progress.reviewQueue]);

  const index = Math.min(progress.reviewIndex, Math.max(queue.length - 1, 0));
  const livePos = Math.max(0, sessionWords.length - 1);
  const isLive = viewPos === livePos;
  const viewWordId = sessionWords[viewPos];
  const liveWordId = sessionWords[livePos];
  const word = viewWordId ? getWordById(viewWordId) : null;
  const srsRec = liveWordId ? progress.srsRecords[liveWordId] : undefined;

  useEffect(() => {
    if (!hydrated || progress.reviewQueue.length > 0) return;
    const fresh = buildReviewQueue(allIds, progress.srsRecords, 30);
    if (fresh.length === 0) return;
    updateProgress({ reviewQueue: fresh, reviewIndex: 0 });
  }, [hydrated, progress.reviewQueue.length, allIds, progress.srsRecords, updateProgress]);

  useEffect(() => {
    if (!hydrated || sessionReady.current || progress.reviewQueue.length === 0) return;

    const saved = progress.reviewSessionWords.filter((id) => getWordById(id));
    if (saved.length > 0) {
      const trimmed = saved.slice(-SESSION_MEMORY_MAX);
      const pos = Math.min(Math.max(0, progress.reviewViewPos), trimmed.length - 1);
      setSessionWords(trimmed);
      setViewPos(pos);
      sessionReady.current = true;
      return;
    }

    const idx = Math.min(progress.reviewIndex, progress.reviewQueue.length - 1);
    const initial = progress.reviewQueue.slice(0, idx + 1).filter(Boolean);
    if (initial.length === 0) return;
    setSessionWords(initial);
    setViewPos(idx);
    sessionReady.current = true;
  }, [
    hydrated,
    progress.reviewQueue,
    progress.reviewIndex,
    progress.reviewSessionWords,
    progress.reviewViewPos,
  ]);

  useEffect(() => {
    if (!hydrated || !sessionReady.current) return;
    updateProgress({
      reviewSessionWords: sessionWords,
      reviewViewPos: viewPos,
    });
  }, [sessionWords, viewPos, hydrated, updateProgress]);

  const goToPos = useCallback((i: number) => {
    setViewPos(i);
    setFlipped(false);
  }, []);

  const goPrevious = useCallback(() => {
    setViewPos((p) => (p <= 0 ? p : p - 1));
    setFlipped(false);
  }, []);

  const appendSessionWord = useCallback((nextId: string) => {
    if (!nextId) return;
    setSessionWords((prev) => {
      if (prev[prev.length - 1] === nextId) return prev;
      let next = [...prev, nextId];
      if (next.length > SESSION_MEMORY_MAX) {
        next = next.slice(-SESSION_MEMORY_MAX);
      }
      setViewPos(next.length - 1);
      return next;
    });
    setFlipped(false);
    setNudgeTrigger((n) => n + 1);
  }, []);

  const advanceQueue = useCallback(
    (nextIndex: number, nextQueue: string[], updatedProgress: UserProgress) => {
      if (nextIndex >= nextQueue.length) {
        const freshQueue = buildReviewQueue(allIds, updatedProgress.srsRecords, 30);
        updateProgress({
          ...updatedProgress,
          reviewQueue: freshQueue,
          reviewIndex: 0,
        });
        if (freshQueue[0]) appendSessionWord(freshQueue[0]);
        setSessionDone((d) => d + 1);
      } else {
        updateProgress({ ...updatedProgress, reviewIndex: nextIndex });
        const nextId = nextQueue[nextIndex];
        if (nextId) appendSessionWord(nextId);
      }
      setFlipped(false);
    },
    [allIds, updateProgress, appendSessionWord]
  );

  const continueLive = useCallback(() => {
    if (!liveWordId || !isLive) return;
    const active = getWordById(liveWordId);
    if (!active) return;
    const updated = recordSRSReview(progress, active.id, true);
    advanceQueue(index + 1, queue, updated);
  }, [liveWordId, isLive, progress, advanceQueue, index, queue]);

  const goNext = useCallback(() => {
    if (viewPos < livePos) {
      setViewPos((p) => p + 1);
      setFlipped(false);
      return;
    }
    if (isLive) {
      continueLive();
    }
  }, [viewPos, livePos, isLive, continueLive]);

  const resetIndicators = useCallback(() => {
    const fresh = buildReviewQueue(allIds, {}, 30);
    const first = fresh[0] ? [fresh[0]] : [];
    updateProgress({
      ...resetStudyProfile(progress),
      reviewQueue: fresh,
      reviewSessionWords: first,
      reviewViewPos: 0,
    });
    setSessionDone(0);
    setFlipped(false);
    setSessionWords(first);
    setViewPos(0);
    sessionReady.current = true;
  }, [allIds, progress, updateProgress]);

  const restartSession = () => {
    const fresh = buildReviewQueue(allIds, progress.srsRecords, 30);
    const first = fresh[0] ? [fresh[0]] : [];
    updateProgress({
      reviewQueue: fresh,
      reviewIndex: 0,
      reviewSessionWords: first,
      reviewViewPos: 0,
    });
    setSessionDone(0);
    setFlipped(false);
    setSessionWords(first);
    setViewPos(0);
    sessionReady.current = true;
  };

  const canGoPrev = viewPos > 0;
  const canGoNextHistory = viewPos < livePos;
  const canContinueLive = isLive;
  const canGoNext = canGoNextHistory || canContinueLive;

  if (!hydrated) {
    return (
      <PageShell title="Tekrar Motoru" subtitle="SRS">
        <div className="card-soft h-64 animate-pulse rounded-xl bg-sage-50" />
      </PageShell>
    );
  }

  if (stats.due === 0 && stats.newWords === 0) {
    return (
      <PageShell title="Tekrar Motoru" subtitle="SRS">
        <div className="card-soft p-8 text-center">
          <span className="goethe-badge mb-4">SRS Tamamlandı</span>
          <h2 className="text-lg font-bold text-goethe-blue">Bugün tekrar yok!</h2>
          <p className="mt-2 text-sm text-sage-500">
            {stats.mastered} kelime 30 günlük aralıkta. Yarın yeni tekrarlar gelecek.
          </p>
          <button type="button" className="btn-primary-lg mt-6 w-full" onClick={restartSession}>
            Ekstra pratik başlat
          </button>
        </div>
      </PageShell>
    );
  }

  if (!word) {
    return (
      <PageShell title="Tekrar Motoru">
        <div className="card-soft p-8 text-center">
          <h2 className="text-lg font-bold text-goethe-blue">Tekrar oturumu bitti</h2>
          <p className="mt-2 text-sm text-sage-500">{sessionDone + 1} tur tamamlandı.</p>
          <button type="button" className="btn-primary-lg mt-6 w-full" onClick={restartSession}>
            Yeni oturum
          </button>
        </div>
      </PageShell>
    );
  }

  const progressPct = Math.round(((index + 1) / Math.max(queue.length, 1)) * 100);

  return (
    <>
      <StudyMotivation trigger={nudgeTrigger} />

      <PageShell
        title="Tekrar Motoru"
        subtitle={`${index + 1} / ${queue.length} · ${stats.due} bekleyen · ${stats.newWords} yeni`}
      >
        <div className="mx-auto h-2 max-w-xs overflow-hidden rounded-full bg-sage-100">
          <div
            className="h-full bg-goethe-gold transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {!isLive && (
          <div className="rounded-xl border border-goethe-gold/40 bg-goethe-gold/10 px-4 py-3 text-center text-sm text-goethe-blue">
            Geçmiş kelime ({viewPos + 1}/{sessionWords.length}) — tekrar bakıyorsun, İleri ile devam et
          </div>
        )}

        {isLive && srsRec && (
          <div className="flex flex-wrap justify-center gap-3 text-sm text-sage-400">
            <span>Adım: {getIntervalLabel(srsRec.step)}</span>
            <span>Tekrar: {srsRec.totalReviews}</span>
          </div>
        )}

        {!flipped && isLive && (
          <p className="text-center text-sm text-sage-500">
            Kartı çevir · <strong className="text-sage-500">Sonraki kelime</strong>
          </p>
        )}

        <WordCard
          word={word}
          size="large"
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
            title={
              canContinueLive
                ? "Sonraki kelimeye geç (kartı çevirmene gerek yok)"
                : canGoNextHistory
                  ? "Hafızada ileri git"
                  : undefined
            }
          >
            {canContinueLive ? "Sonraki kelime" : "İleri"}
            <IconArrowRight size={18} />
          </button>
        </div>

        {isLive && (
          <p className="text-center text-xs text-sage-400">
            Tekrar: 1, 3, 7 gün.
          </p>
        )}

        <SessionTrail
          wordIds={sessionWords}
          currentIndex={viewPos}
          onSelect={goToPos}
          maxVisible={SESSION_MEMORY_MAX}
        />

        <div className="grid grid-cols-3 gap-2 text-center text-sm text-sage-400">
          <div className="rounded-lg bg-sage-50 p-3">
            <p className="text-lg font-semibold text-sage-600">{stats.due}</p>
            <p>Bekleyen</p>
          </div>
          <div className="rounded-lg bg-sage-50 p-3">
            <p className="text-lg font-semibold text-sage-600">{stats.mastered}</p>
            <p>Ezber</p>
          </div>
          <div className="rounded-lg bg-sage-50 p-3">
            <p className="text-lg font-semibold text-sage-600">{stats.newWords}</p>
            <p>Yeni</p>
          </div>
        </div>

        <ResetSRSButton
          className="btn-secondary w-full text-sm text-goethe-blue"
          onAfterReset={resetIndicators}
        />
      </PageShell>
    </>
  );
}
