"use client";

import { useState } from "react";
import type { VocabularyWord } from "@german-coach/vocabulary";
import { IconPlay, IconVolume } from "@/components/icons";
import type { CardsListenSettings } from "@/lib/cardsSettings";
import { SPEECH_RATE } from "@/lib/cardsSettings";
import { playCardSentenceAudio, playCardWordAudio } from "@/lib/playCardAudio";
import { playGermanAudio } from "@/lib/audio";

interface CardsPlayButtonProps {
  word: VocabularyWord;
  settings: CardsListenSettings;
  mode?: "word" | "sentence";
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function CardsPlayButton({
  word,
  settings,
  mode = "word",
  label,
  size = "md",
  className = "",
}: CardsPlayButtonProps) {
  const [playing, setPlaying] = useState(false);
  const cls =
    size === "sm"
      ? "rounded-lg px-3 py-1.5 text-xs"
      : "rounded-xl px-4 py-2 text-sm";
  const playLabel = label ?? (mode === "word" ? "Dinle" : "Cumleyi dinle");

  return (
    <button
      type="button"
      disabled={playing}
      onClick={async (e) => {
        e.stopPropagation();
        setPlaying(true);
        try {
          if (mode === "word") {
            await playCardWordAudio(word, settings);
          } else {
            await playCardSentenceAudio(word, settings);
          }
        } finally {
          setPlaying(false);
        }
      }}
      className={`${cls} inline-flex shrink-0 items-center gap-2 border border-sage-200 bg-white font-medium text-sage-600 transition hover:border-goethe-blue/30 hover:bg-sage-50 disabled:opacity-60 ${className}`}
      title={`${playLabel} · ${settings.repeatCount}x`}
    >
      {playing ? <IconPlay size={16} /> : <IconVolume size={16} />}
      {playLabel}
      {settings.speechSpeed !== "normal" && (
        <span className="text-[10px] text-sage-400">
          ({settings.speechSpeed === "slow" ? "yavaş" : "çok yavaş"})
        </span>
      )}
    </button>
  );
}

export function CardsPlayTextButton({
  text,
  audioSrc,
  settings,
  label = "Dinle",
  size = "sm",
}: {
  text: string;
  audioSrc?: string | null;
  settings: CardsListenSettings;
  label?: string;
  size?: "sm" | "md";
}) {
  const [playing, setPlaying] = useState(false);
  const cls =
    size === "sm"
      ? "rounded-lg px-3 py-1.5 text-xs"
      : "rounded-xl px-4 py-2 text-sm";

  return (
    <button
      type="button"
      disabled={playing}
      onClick={async (e) => {
        e.stopPropagation();
        setPlaying(true);
        try {
          const rate = SPEECH_RATE[settings.speechSpeed];
          for (let i = 0; i < settings.repeatCount; i++) {
            await playGermanAudio(text, audioSrc, { playbackRate: rate });
          }
        } finally {
          setPlaying(false);
        }
      }}
      className={`${cls} inline-flex shrink-0 items-center gap-2 border border-sage-200 bg-white font-medium text-sage-600`}
    >
      <IconVolume size={16} />
      {label}
    </button>
  );
}
