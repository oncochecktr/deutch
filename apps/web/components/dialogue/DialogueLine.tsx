"use client";

import { SpeakAudioButton } from "@/components/SpeakAudioButton";
import { StoryAudioButton } from "@/components/dialogue/StoryAudioButton";
import type { DialogueLine } from "@/lib/dialogueTypes";

interface DialogueLineRowProps {
  line: DialogueLine;
  showTranslation: boolean;
  onToggleTranslation: () => void;
  onMarkRead?: () => void;
}

export function DialogueLineRow({
  line,
  showTranslation,
  onToggleTranslation,
  onMarkRead,
}: DialogueLineRowProps) {
  const isNarration = line.kind === "narration";

  return (
    <div
      className={`rounded-xl border p-3 transition ${
        isNarration
          ? "border-sage-200 bg-sage-50/80"
          : "border-goethe-blue/15 bg-white"
      }`}
    >
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {line.speaker && (
            <span className="rounded-full bg-goethe-blue/10 px-2 py-0.5 text-[10px] font-bold uppercase text-goethe-blue">
              {line.speaker}
            </span>
          )}
          {isNarration && (
            <span className="text-[10px] uppercase tracking-wider text-sage-400">Anlatı</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            onToggleTranslation();
            onMarkRead?.();
          }}
          className="rounded-md border border-sage-200 px-2 py-0.5 text-[10px] text-sage-600 hover:bg-sage-50"
        >
          {showTranslation ? "TR gizle" : "TR göster"}
        </button>
      </div>
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex shrink-0 flex-col gap-1">
          {line.audio_de || line.audio_tr ? (
            <>
              <StoryAudioButton
                text={line.text_de}
                lang="de"
                audioSrc={line.audio_de}
                size="sm"
              />
              <StoryAudioButton
                text={line.text_tr}
                lang="tr"
                audioSrc={line.audio_tr}
                size="sm"
              />
            </>
          ) : (
            <SpeakAudioButton text={line.text_de} size="sm" className="mt-0.5 shrink-0" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-relaxed text-goethe-blue sm:text-base">{line.text_de}</p>
          {showTranslation && (
            <p className="mt-1 text-sm italic text-sage-600">{line.text_tr}</p>
          )}
        </div>
      </div>
    </div>
  );
}
