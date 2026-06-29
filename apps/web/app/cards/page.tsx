"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getA1Vocabulary } from "@german-coach/vocabulary";
import { CardsDailyGoal } from "@/components/cards/CardsDailyGoal";
import { CardsListenPanel } from "@/components/cards/CardsListenPanel";
import { CardsLockListenBar } from "@/components/cards/CardsLockListenBar";
import { CardsTierPicker } from "@/components/cards/CardsTierPicker";
import { PageShell } from "@/components/PageShell";
import { LearningCoachBanner } from "@/components/LearningCoachBanner";
import { SessionTrail } from "@/components/SessionTrail";
import { StudyMotivation } from "@/components/StudyMotivation";
import { WordCard } from "@/components/WordCard";
import { IconArrowLeft, IconArrowRight } from "@/components/icons";
import { buildCardsPlaylist, playlistLabel } from "@/lib/cardsPlaylist";
import {
  filterKey,
  getTierCategories,
  loadCardsListenSettings,
  saveCardsListenSettings,
  type CardsListenSettings,
} from "@/lib/cardsSettings";
import {
  cardsCoachMessage,
  shouldShowCardsCoachBanner,
} from "@/lib/learningCoach";
import { recordAnswer } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";
import { useLearningCoach } from "@/lib/useLearningCoach";
import type { A1WordTierId } from "@/lib/wordTiers";

const SESSION_MEMORY_MAX = 20;

export default function CardsPage() {
  const { progress, updateProgress, hydrated, flushProgress } = useProgress();
  const { coach } = useLearningCoach();
  const vocab = getA1Vocabulary();
  const [flipped, setFlipped] = useState(false);
  const [trail, setTrail] = useState<string[]>([]);
  const [trailCursor, setTrailCursor] = useState(0);
  const [nudgeTrigger, setNudgeTrigger] = useState(0);
  const [listenSettings, setListenSettings] = useState<CardsListenSettings>(
    loadCardsListenSettings
  );
  const trailReady = useRef(false);

  useEffect(() => {
    return () => flushProgress();
  }, [flushProgress]);

  const { filterTier, filterCategory } = listenSettings;
  const fKey = filterKey(filterTier, filterCategory);
  const categories = useMemo(
    () => getTierCategories(filterTier),
    [filterTier]
  );

  const playlist = useMemo(
    () => buildCardsPlaylist(vocab.words, filterTier, filterCategory),
    [vocab.words, filterTier, filterCategory]
  );

  const filterIndex = listenSettings.filterIndices[fKey] ?? 0;
  const safeIndex = playlist.length
    ? Math.min(filterIndex, playlist.length - 1)
    : 0;

  const liveWord = playlist[safeIndex] ?? vocab.words[0];
  const livePos = Math.max(0, trail.length - 1);
  const isLive = trail.length === 0 || trailCursor === livePos;
  const viewId = trail.length > 0 ? trail[trailCursor] : liveWord.id;
  const word = vocab.words.find((w) => w.id === viewId) ?? liveWord;

  const learnedToday = progress.dailyStats.newWordsLearned;

  const patchSettings = useCallback((next: CardsListenSettings) => {
    setListenSettings(next);
    saveCardsListenSettings(next);
  }, []);

  const setFilterIndex = useCallback(
    (idx: number) => {
      const clamped = playlist.length
        ? Math.min(Math.max(0, idx), playlist.length - 1)
        : 0;
      patchSettings({
        ...listenSettings,
        filterIndices: { ...listenSettings.filterIndices, [fKey]: clamped },
      });
    },
    [listenSettings, fKey, playlist.length, patchSettings]
  );

  const handleTierChange = useCallback(
    (tier: A1WordTierId | "all") => {
      const cats = getTierCategories(tier);
      const firstCat = tier === "all" ? null : (cats[0] ?? null);
      patchSettings({
        ...listenSettings,
        filterTier: tier,
        filterCategory: firstCat,
        filterIndices: { ...listenSettings.filterIndices, [filterKey(tier, firstCat)]: 0 },
      });
      setTrail([]);
      setTrailCursor(0);
      trailReady.current = false;
    },
    [listenSettings, patchSettings]
  );

  const handleCategoryChange = useCallback(
    (category: string | null) => {
      patchSettings({
        ...listenSettings,
        filterCategory: category,
        filterIndices: {
          ...listenSettings.filterIndices,
          [filterKey(listenSettings.filterTier, category)]: 0,
        },
      });
      setTrail([]);
      setTrailCursor(0);
      trailReady.current = false;
    },
    [listenSettings, patchSettings]
  );

  useEffect(() => {
    if (!hydrated || trailReady.current) return;
    const validIds = new Set(playlist.map((w) => w.id));
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
  }, [hydrated, progress.cardsTrail, progress.cardsTrailCursor, liveWord.id, playlist]);

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
    if (!isLive || playlist.length === 0) return;
    const nextIdx = (safeIndex + 1) % playlist.length;
    const nextWord = playlist[nextIdx]!;
    updateProgress((p) => ({
      ...recordAnswer(p, liveWord.id, true),
      cardIndex: vocab.words.findIndex((w) => w.id === nextWord.id),
    }));
    setFilterIndex(nextIdx);
    appendTrail(nextWord.id);
  }, [
    isLive,
    playlist,
    safeIndex,
    liveWord.id,
    vocab.words,
    updateProgress,
    appendTrail,
    setFilterIndex,
  ]);

  const goPrevious = useCallback(() => {
    if (trailCursor > 0) {
      setTrailCursor((c) => c - 1);
      setFlipped(false);
      return;
    }
    if (isLive && playlist.length > 0) {
      const prevIdx = (safeIndex - 1 + playlist.length) % playlist.length;
      setFilterIndex(prevIdx);
      setFlipped(false);
    }
  }, [trailCursor, isLive, playlist.length, safeIndex, setFilterIndex]);

  const goNext = useCallback(() => {
    if (trailCursor < livePos) {
      setTrailCursor((c) => c + 1);
      setFlipped(false);
      return;
    }
    if (isLive) {
      continueLive();
    }
  }, [trailCursor, livePos, isLive, continueLive]);

  const progressPct = useMemo(
    () =>
      playlist.length
        ? Math.round(((safeIndex + 1) / playlist.length) * 100)
        : 0,
    [safeIndex, playlist.length]
  );

  const canGoPrev = trailCursor > 0 || (isLive && playlist.length > 1);
  const canGoNextHistory = trailCursor < livePos;
  const canContinueLive = isLive && playlist.length > 0;
  const canGoNext = canGoNextHistory || canContinueLive;

  const showCoachBanner = shouldShowCardsCoachBanner(trail.length, coach);
  const coachMsg = cardsCoachMessage(coach);
  const groupLabel = playlistLabel(filterTier, filterCategory);

  return (
    <>
      <StudyMotivation trigger={nudgeTrigger} />

      <PageShell
        title="Kelime Kartları"
        subtitle={`${groupLabel} · ${safeIndex + 1} / ${playlist.length}`}
        maxWidth="xl"
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(260px,300px)_1fr] lg:items-start">
          <aside className="space-y-3 lg:sticky lg:top-4">
            <CardsDailyGoal
              learnedToday={learnedToday}
              goal={listenSettings.dailyGoal}
              compact
            />

            <CardsTierPicker
              tier={filterTier}
              category={filterCategory}
              categories={categories}
              onTierChange={handleTierChange}
              onCategoryChange={handleCategoryChange}
              playlistSize={playlist.length}
            />

            <CardsListenPanel settings={listenSettings} onChange={patchSettings} />

            {isLive && (
              <CardsLockListenBar
                word={liveWord}
                settings={listenSettings}
                index={safeIndex}
                total={playlist.length}
                categoryLabel={groupLabel}
                onPrevious={goPrevious}
                onNext={goNext}
              />
            )}
          </aside>

          <div className="min-w-0 space-y-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-sage-100">
              <div
                className="h-full bg-sage-400 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {!isLive && (
              <div className="rounded-xl border border-goethe-gold/40 bg-goethe-gold/10 px-4 py-2 text-center text-sm text-goethe-blue">
                Geçmiş kelime ({trailCursor + 1}/{trail.length})
              </div>
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

            {playlist.length === 0 ? (
              <div className="card-soft p-6 text-center text-sm text-sage-500">
                Bu grupta kelime yok. Baska bir kategori sec.
              </div>
            ) : (
              <WordCard
                word={word}
                flipped={flipped}
                onFlip={() => setFlipped((f) => !f)}
                readOnly={!isLive && flipped}
                showHearAndWrite={isLive}
                onDictationCorrect={isLive ? continueLive : undefined}
                listenSettings={listenSettings}
                hideFlipHint
              />
            )}

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
          </div>
        </div>
      </PageShell>
    </>
  );
}
