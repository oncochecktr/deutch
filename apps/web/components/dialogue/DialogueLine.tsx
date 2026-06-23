"use client";

import { useState } from "react";
import { SpeakAudioButton } from "@/components/SpeakAudioButton";
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
        <SpeakAudioButton text={line.text_de} size="sm" className="mt-0.5 shrink-0" />
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
