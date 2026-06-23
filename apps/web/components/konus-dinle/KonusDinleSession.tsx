"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FeedbackPanel } from "@/components/konus-dinle/FeedbackPanel";
import { KonusDinleBranchPreview } from "@/components/konus-dinle/KonusDinleBranchPreview";
import { KonusDinleFlowSteps } from "@/components/konus-dinle/KonusDinleFlowSteps";
import { KonusDinleGoalTree } from "@/components/konus-dinle/KonusDinleGoalTree";
import { KonusDinleProfilePanel } from "@/components/konus-dinle/KonusDinleProfilePanel";
import { KonusDinleQuickPick } from "@/components/konus-dinle/KonusDinleQuickPick";
import { PlatformBubble, playPlatformItem } from "@/components/konus-dinle/PlatformBubble";
import { SessionHeader, lengthLabelTr } from "@/components/konus-dinle/SessionHeader";
import { UserTurnPanel } from "@/components/konus-dinle/UserTurnPanel";
import { playTurkishAudio, stopAudio } from "@/lib/audio";
import { gradeKonusDinleAttempt, type KonusDinleGradeResult } from "@/lib/konusDinleGrading";
import {
  buildKonusDinlePlaylist,
  type KonusDinleItem,
  type KonusDinleLevel,
  type KonusDinleLengthFilter,
} from "@/lib/konusDinlePlaylist";
import {
  ensureTodayTurns,
  loadKonusDinleProgress,
  recordKonusDinleTurn,
  resetSessionStats,
  saveKonusDinleProgress,
  type KonusDinleProgress,
} from "@/lib/konusDinleStorage";
import {
  getBranchNode,
  suggestNextBranch,
} from "@/lib/konusDinleTree";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import { useProgress } from "@/lib/ProgressContext";
import { recordKonusDinleDailyTurn } from "@/lib/progress";

type Phase = "idle" | "platform" | "user" | "feedback";

export function KonusDinleSession() {
  const { updateProgress } = useProgress();
  const [kdProgress, setKdProgress] = useState<KonusDinleProgress>(() =>
    ensureTodayTurns(loadKonusDinleProgress())
  );
  const [level, setLevel] = useState<KonusDinleLevel>(kdProgress.lastFilter.level);
  const [lengthFilter, setLengthFilter] = useState<KonusDinleLengthFilter>(
    kdProgress.lastFilter.lengthFilter
  );
  const [sessionStarted, setSessionStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [playing, setPlaying] = useState(false);
  const [gradeResult, setGradeResult] = useState<KonusDinleGradeResult | null>(null);
  const [lastXp, setLastXp] = useState(0);
  const pendingGradeRef = useRef(false);
  const lastPlayedIdRef = useRef<string | null>(null);

  const playlist = useMemo(
    () => buildKonusDinlePlaylist({ level, lengthFilter, shuffle: true }),
    [level, lengthFilter]
  );

  const previewSamples = useMemo(
    () => buildKonusDinlePlaylist({ level, lengthFilter, shuffle: false }).slice(0, 3),
    [level, lengthFilter]
  );

  const branchNode = useMemo(
    () => getBranchNode(kdProgress, level, lengthFilter),
    [kdProgress, level, lengthFilter]
  );

  const suggestedBranch = useMemo(() => suggestNextBranch(kdProgress), [kdProgress]);
  const isSuggestedSelection =
    suggestedBranch?.level === level && suggestedBranch?.lengthFilter === lengthFilter;

  const currentItem: KonusDinleItem | null = playlist[index] ?? null;

  const {
    supported,
    listening,
    interimTranscript,
    finalTranscript,
    error: sttError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition("de");

  const displayTranscript =
    finalTranscript +
    (interimTranscript ? (finalTranscript ? " " : "") + interimTranscript : "");

  const persistKd = useCallback((next: KonusDinleProgress) => {
    setKdProgress(next);
    saveKonusDinleProgress(next);
  }, []);

  const applySelection = useCallback(
    (newLevel: KonusDinleLevel, newLength: KonusDinleLengthFilter) => {
      setLevel(newLevel);
      setLengthFilter(newLength);
      setKdProgress((prev) => {
        const next = { ...prev, lastFilter: { level: newLevel, lengthFilter: newLength } };
        saveKonusDinleProgress(next);
        return next;
      });
      lastPlayedIdRef.current = null;
      setIndex(0);
      setPhase("idle");
      setGradeResult(null);
    },
    []
  );

  const playCurrentItem = useCallback(async (item: KonusDinleItem) => {
    stopAudio();
    setPlaying(true);
    try {
      await playPlatformItem(item);
    } finally {
      setPlaying(false);
    }
  }, []);

  const startPlatformTurn = useCallback(async () => {
    if (!currentItem) return;
    setPhase("platform");
    resetTranscript();
    setGradeResult(null);
    await playCurrentItem(currentItem);
    setPhase("user");
  }, [currentItem, playCurrentItem, resetTranscript]);

  useEffect(() => {
    if (!sessionStarted || !currentItem || phase !== "idle") return;
    if (lastPlayedIdRef.current === currentItem.id) return;
    lastPlayedIdRef.current = currentItem.id;
    void startPlatformTurn();
  }, [sessionStarted, currentItem?.id, phase, startPlatformTurn]);

  useEffect(() => {
    if (!listening && pendingGradeRef.current) {
      pendingGradeRef.current = false;
      const text = finalTranscript.trim();
      if (currentItem) {
        const result = gradeKonusDinleAttempt(text, currentItem.textDe);
        setGradeResult(result);
        setLastXp(result.xp);
        setPhase("feedback");
        void playTurkishAudio(result.shortVoice);

        setKdProgress((prev) => {
          const next = recordKonusDinleTurn(prev, {
            itemId: currentItem.id,
            level,
            lengthFilter,
            xp: result.xp,
            isGood: result.isGood,
          });
          saveKonusDinleProgress(next);
          return next;
        });

        updateProgress((p) => recordKonusDinleDailyTurn(p, result.isGood));
      } else if (!text) {
        setPhase("user");
      }
    }
  }, [listening, finalTranscript, currentItem, level, lengthFilter, updateProgress]);

  useEffect(() => () => stopAudio(), []);

  const handleStartSession = () => {
    stopAudio();
    lastPlayedIdRef.current = null;
    const fresh = resetSessionStats({
      ...ensureTodayTurns(kdProgress),
      lastFilter: { level, lengthFilter },
    });
    persistKd(fresh);
    setIndex(0);
    setSessionStarted(true);
    setPhase("idle");
    setGradeResult(null);
  };

  const handleTreeSelect = (newLevel: KonusDinleLevel, newLength: KonusDinleLengthFilter) => {
    if (sessionStarted && phase !== "idle" && phase !== "feedback") return;
    applySelection(newLevel, newLength);
  };

  const handleJumpToSuggested = () => {
    const s = suggestNextBranch(kdProgress);
    if (!s) return;
    if (sessionStarted) handleEndSession();
    applySelection(s.level, s.lengthFilter);
  };

  const handleReplay = () => {
    if (!currentItem) return;
    void playCurrentItem(currentItem);
  };

  const handleMicToggle = () => {
    if (phase !== "user" && phase !== "feedback") return;
    if (phase === "feedback") {
      setGradeResult(null);
      setPhase("user");
    }
    if (listening) {
      pendingGradeRef.current = true;
      stopListening();
    } else {
      stopAudio();
      resetTranscript();
      pendingGradeRef.current = true;
      startListening();
    }
  };

  const handleContinue = () => {
    stopAudio();
    lastPlayedIdRef.current = null;
    if (index + 1 >= playlist.length) {
      setSessionStarted(false);
      setPhase("idle");
      setGradeResult(null);
      return;
    }
    setIndex((i) => i + 1);
    setPhase("idle");
    setGradeResult(null);
    resetTranscript();
  };

  const handleRetry = () => {
    stopAudio();
    resetTranscript();
    setGradeResult(null);
    lastPlayedIdRef.current = null;
    setPhase("idle");
  };

  const handleEndSession = () => {
    stopAudio();
    setSessionStarted(false);
    setPhase("idle");
    setGradeResult(null);
    setIndex(0);
    lastPlayedIdRef.current = null;
  };

  const pickDisabled = sessionStarted && phase !== "feedback" && phase !== "idle";

  const sessionBody = !sessionStarted ? (
    <div className="space-y-4">
      <KonusDinleBranchPreview
        branch={branchNode}
        samples={previewSamples}
        suggested={isSuggestedSelection}
      />
      <div className="card-soft space-y-4 p-6 text-center">
        <p className="text-sm text-sage-600">
          Hazırsan başla — acele yok, istediğin kadar tekrar dinleyebilirsin.
        </p>
        <button
          type="button"
          className="btn-primary-lg mx-auto w-full max-w-sm"
          disabled={playlist.length === 0}
          onClick={handleStartSession}
        >
          Antrenmana başla · {playlist.length} ifade
        </button>
        {!isSuggestedSelection && suggestedBranch && (
          <button
            type="button"
            className="text-xs text-goethe-blue underline-offset-2 hover:underline"
            onClick={handleJumpToSuggested}
          >
            veya önerilen dala git ({suggestedBranch.level}{" "}
            {lengthLabelTr(suggestedBranch.lengthFilter)})
          </button>
        )}
      </div>
    </div>
  ) : playlist.length === 0 ? (
    <div className="card-soft p-6 text-center text-sage-500">
      Bu dal için içerik yok. Soldan başka dal seç.
    </div>
  ) : !currentItem && phase !== "feedback" ? (
    <div className="card-soft space-y-4 p-6 text-center">
      <p className="text-lg font-bold text-goethe-blue">Dal tamamlandı!</p>
      <p className="text-sm text-sage-600">
        +{kdProgress.sessionXp} XP · {kdProgress.sessionTurns} tur · Bugün{" "}
        {kdProgress.todayTurns}/{kdProgress.dailyGoalTurns}
      </p>
      <button type="button" className="btn-primary-lg" onClick={handleEndSession}>
        Yeni dal seç
      </button>
      {suggestedBranch && (
        <button
          type="button"
          className="block w-full text-sm text-goethe-blue underline"
          onClick={handleJumpToSuggested}
        >
          Sıradaki öneri: {suggestedBranch.level} {lengthLabelTr(suggestedBranch.lengthFilter)}
        </button>
      )}
    </div>
  ) : (
    <>
      <KonusDinleFlowSteps phase={phase} />
      <SessionHeader
        totalXp={kdProgress.totalXp}
        sessionXp={kdProgress.sessionXp}
        streak={kdProgress.streak}
        currentIndex={index}
        total={playlist.length}
        todayTurns={kdProgress.todayTurns}
        dailyGoalTurns={kdProgress.dailyGoalTurns}
        levelLabel={level}
        lengthLabel={lengthLabelTr(lengthFilter)}
      />

      <div className="min-h-[360px] space-y-4 rounded-2xl border-2 border-sage-100 bg-gradient-to-b from-cream-50 to-white p-4 sm:p-6">
        {currentItem && (
          <PlatformBubble
            item={currentItem}
            playing={playing}
            onReplay={handleReplay}
            showReplayHint
          />
        )}

        {(phase === "user" || phase === "feedback") && (
          <UserTurnPanel
            listening={listening}
            supported={supported}
            transcript={displayTranscript}
            sttError={sttError}
            disabled={playing && phase === "user"}
            onMicToggle={handleMicToggle}
          />
        )}

        {phase === "platform" && !playing && (
          <p className="text-center text-xs text-sage-400">Dinle… sonra konuş</p>
        )}

        {phase === "feedback" && gradeResult && (
          <FeedbackPanel
            result={gradeResult}
            xpEarned={lastXp}
            onContinue={handleContinue}
            onRetry={handleRetry}
          />
        )}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          className="text-xs text-sage-400 underline-offset-2 hover:text-sage-600 hover:underline"
          onClick={handleEndSession}
        >
          Oturumu bitir
        </button>
      </div>
    </>
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(280px,320px)_minmax(280px,320px)_1fr] lg:grid-cols-[minmax(260px,300px)_1fr]">
        <aside className="space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto">
          <KonusDinleProfilePanel
            progress={kdProgress}
            onUpdate={persistKd}
            onJumpToSuggested={handleJumpToSuggested}
          />
          <KonusDinleGoalTree
            progress={kdProgress}
            selectedLevel={level}
            selectedLength={lengthFilter}
            disabled={pickDisabled}
            onSelect={handleTreeSelect}
          />
        </aside>

        <div className="hidden space-y-4 xl:block">
          <KonusDinleQuickPick
            level={level}
            lengthFilter={lengthFilter}
            disabled={pickDisabled}
            onSelect={handleTreeSelect}
          />
          {!sessionStarted && (
            <KonusDinleBranchPreview
              branch={branchNode}
              samples={previewSamples}
              suggested={isSuggestedSelection}
            />
          )}
        </div>

        <main className="min-w-0 space-y-4">
          <div className="xl:hidden">
            <KonusDinleQuickPick
              level={level}
              lengthFilter={lengthFilter}
              disabled={pickDisabled}
              onSelect={handleTreeSelect}
            />
          </div>
          {sessionBody}
        </main>
      </div>
    </div>
  );
}
