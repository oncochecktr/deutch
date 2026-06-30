"use client";

import { useEffect, useState } from "react";
import { SpeakAudioButton } from "@/components/SpeakAudioButton";
import type { HintLevel } from "@/lib/speakHintLevel";
import type { BoardPhase, TeachingExample } from "@/lib/speakTypes";

const PHASE_LABEL: Record<BoardPhase, string> = {
  teach: "Öğretim",
  practice: "Alıştırma",
  question: "Soru",
};

interface SpeakBoardProps {
  reply: string | null;
  boardPhase: BoardPhase | null;
  teachingIntro: string | null;
  teachingTopicGerman: string | null;
  teachingTopicTurkish: string | null;
  teachingExamples: TeachingExample[];
  germanQuestion: string | null;
  turkishTranslation: string | null;
  partialHint: string | null;
  praise: string | null;
  hintLevel: HintLevel;
  correction: string | null;
  correctionExplanation: string | null;
  latestNotes: string[];
  assignment: string | null;
  loading: boolean;
  loadingSlow?: boolean;
  exerciseMode?: boolean;
  exerciseOpen?: boolean;
  onToggleExercise?: () => void;
  onBoardClick?: () => void;
}

export function SpeakBoard({
  reply,
  boardPhase,
  teachingIntro,
  teachingTopicGerman,
  teachingTopicTurkish,
  teachingExamples,
  germanQuestion,
  turkishTranslation,
  partialHint,
  praise,
  hintLevel,
  correction,
  correctionExplanation,
  latestNotes,
  assignment,
  loading,
  loadingSlow = false,
  exerciseMode = false,
  exerciseOpen = false,
  onToggleExercise,
  onBoardClick,
}: SpeakBoardProps) {
  const [showTurkish, setShowTurkish] = useState(false);
  const questionTurkish = turkishTranslation ?? teachingTopicTurkish;
  const canToggleTurkish = Boolean(questionTurkish);

  useEffect(() => {
    setShowTurkish(false);
  }, [germanQuestion, teachingTopicGerman]);

  const showTeaching =
    Boolean(teachingIntro) || teachingExamples.length > 0 || Boolean(teachingTopicGerman);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className={`relative flex min-h-[min(58vh,560px)] flex-1 flex-col overflow-hidden rounded-sm border-[14px] border-[#5c4033] bg-[#1a3d32] shadow-[inset_0_4px_32px_rgba(0,0,0,0.5),0_12px_40px_rgba(0,0,0,0.25)] md:min-h-[min(65vh,620px)] lg:min-h-[min(68vh,680px)] ${onBoardClick ? "cursor-pointer" : ""}`}
        onClick={onBoardClick}
        role={onBoardClick ? "button" : undefined}
        tabIndex={onBoardClick ? 0 : undefined}
        onKeyDown={
          onBoardClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onBoardClick();
                }
              }
            : undefined
        }
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)",
          }}
        />

        <div className="relative flex flex-1 flex-col p-5 sm:p-8 md:p-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#a8c4b8] sm:text-sm">
              Tahta — Prof. German Coach
            </p>
            <div className="flex items-center gap-2">
              {onToggleExercise && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExercise();
                  }}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-xs ${
                    exerciseOpen
                      ? "bg-[#ffd966] text-[#5c4033]"
                      : "bg-white/10 text-[#e8edd8] hover:bg-white/20"
                  }`}
                >
                  {exerciseOpen ? "Egzersiz (açık)" : "Egzersiz"}
                </button>
              )}
              {exerciseMode && (
                <span className="rounded-full bg-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-[#a8f0c8] sm:text-xs">
                  Egzersiz modu
                </span>
              )}
              {boardPhase && !exerciseMode && (
                <span className="rounded-full bg-[#ffd966]/20 px-2 py-0.5 text-[10px] font-semibold text-[#ffd966] sm:text-xs">
                  {PHASE_LABEL[boardPhase]}
                </span>
              )}
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-[#c5d4cc] sm:text-xs">
                destek {hintLevel}/3
              </span>
              {loading && (
                <span className="text-xs text-[#a8c4b8] animate-pulse sm:text-sm">
                  {loadingSlow ? "Düşünüyor…" : "Yazıyor…"}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto pr-1">
            {praise && (
              <p className="text-lg font-semibold text-[#ffd966] sm:text-xl">{praise}</p>
            )}

            {showTeaching && (
              <div className="rounded-lg border border-[#ffd966]/30 bg-[#ffd966]/5 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#ffd966]">
                  Öğretim
                </p>
                {teachingIntro && (
                  <p className="mt-3 text-lg leading-relaxed text-[#f0f4e8] sm:text-xl">
                    {teachingIntro}
                  </p>
                )}
                {teachingTopicGerman && (
                  <div className="mt-3 flex items-start gap-3">
                    <SpeakAudioButton text={teachingTopicGerman} size="md" variant="dark" />
                    <p className="text-2xl font-semibold text-white sm:text-3xl">
                      {teachingTopicGerman}
                    </p>
                  </div>
                )}
                {teachingTopicTurkish && boardPhase === "teach" && (
                  <p className="mt-1 text-base italic text-[#c5d4cc]">
                    ({teachingTopicTurkish})
                  </p>
                )}
                {teachingExamples.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                    <p className="text-xs uppercase tracking-wider text-[#a8c4b8]">
                      Olası cevaplar / örnekler
                    </p>
                    {teachingExamples.map((ex, i) => (
                      <div key={i} className="flex items-start gap-2 text-base sm:text-lg">
                        <SpeakAudioButton text={ex.german} className="mt-0.5" variant="dark" />
                        <div>
                          <p className="font-medium text-[#e8edd8]">{ex.german}</p>
                          <p className="text-sm italic text-[#a8c4b8]">({ex.turkish})</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {germanQuestion && (
              <div className="rounded-lg border border-white/10 bg-black/15 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#a8c4b8]">
                  Soru
                </p>
                <div className="mt-3 flex items-start gap-3">
                  <SpeakAudioButton text={germanQuestion} size="md" variant="dark" />
                  <p className="text-2xl font-semibold leading-snug text-white sm:text-3xl md:text-4xl [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
                    {germanQuestion}
                  </p>
                </div>

                {hintLevel === 2 && partialHint && (
                  <p className="mt-4 text-base text-[#e8edd8] sm:text-lg">
                    <span className="font-semibold text-[#ffd966]">İpucu: </span>
                    {partialHint}
                  </p>
                )}

                {canToggleTurkish && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setShowTurkish((v) => !v)}
                      className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-[#e8edd8] hover:bg-white/10"
                    >
                      {showTurkish ? "Türkçeyi gizle" : "Türkçe göster"}
                    </button>
                    {showTurkish && (
                      <p className="mt-2 text-base italic text-[#c5d4cc] sm:text-lg">
                        {questionTurkish}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {!germanQuestion && !showTeaching && (
              <p className="text-xl italic text-[#8fa89c] sm:text-2xl">
                Derse gir.
              </p>
            )}

            {reply && (
              <p className="text-lg leading-relaxed text-[#f0f4e8] sm:text-xl [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
                {reply}
              </p>
            )}

            {latestNotes.length > 0 && (
              <ul className="space-y-2 border-t border-white/10 pt-4">
                {latestNotes.map((note, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-base text-[#e8edd8] sm:text-lg [text-shadow:0_1px_1px_rgba(0,0,0,0.25)]"
                  >
                    <span className="text-[#ffd966]">▸</span>
                    {note}
                  </li>
                ))}
              </ul>
            )}

            {correction && (
              <div className="border-t border-dashed border-white/15 pt-4">
                <p className="text-xs uppercase tracking-wider text-[#ffd966] sm:text-sm">
                  Model / düzeltme
                </p>
                <div className="mt-2 flex items-start gap-3">
                  <SpeakAudioButton text={correction} size="md" variant="dark" />
                  <p className="text-xl font-semibold text-white sm:text-2xl">{correction}</p>
                </div>
                {correctionExplanation && (
                  <p className="mt-2 text-base text-[#c5d4cc] sm:text-lg">
                    {correctionExplanation}
                  </p>
                )}
              </div>
            )}

            {assignment && (
              <p className="rounded-md border border-[#ffd966]/50 bg-[#ffd966]/10 px-4 py-3 text-base text-[#fff8dc] sm:text-lg">
                <span className="font-semibold text-[#ffd966]">Görev: </span>
                {assignment}
              </p>
            )}
          </div>
        </div>

        <div className="relative h-3 shrink-0 bg-[#4a3528]" aria-hidden>
          <div className="absolute bottom-1 right-6 h-2.5 w-14 rounded-sm bg-[#8b7355] opacity-70" />
        </div>
      </div>
    </div>
  );
}
