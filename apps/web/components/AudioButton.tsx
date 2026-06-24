"use client";

import { useState } from "react";
import { IconPlay, IconVolume } from "@/components/icons";
import { playGermanAudio } from "@/lib/audio";

interface AudioButtonProps {
  text: string;
  audioSrc?: string | null;
  label?: string;
  size?: "sm" | "md";
  maxPlays?: number;
  playsUsed?: number;
  onPlay?: () => boolean;
  className?: string;
}

export function AudioButton({
  text,
  audioSrc,
  label = "Dinle",
  size = "md",
  maxPlays,
  playsUsed = 0,
  onPlay,
  className = "",
}: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);
  const cls =
    size === "sm"
      ? "rounded-lg px-3 py-1.5 text-xs"
      : "rounded-xl px-4 py-2 text-sm";
  const limitReached = maxPlays !== undefined && playsUsed >= maxPlays;
  const playLabel =
    maxPlays !== undefined ? `${label} (${playsUsed}/${maxPlays})` : label;

  return (
    <button
      type="button"
      disabled={playing || limitReached}
      onClick={async () => {
        if (onPlay && !onPlay()) return;
        setPlaying(true);
        try {
          await playGermanAudio(text, audioSrc);
        } finally {
          setPlaying(false);
        }
      }}
      className={`${cls} inline-flex shrink-0 items-center gap-2 border border-sage-200 bg-white font-medium text-sage-600 transition hover:border-goethe-blue/30 hover:bg-sage-50 disabled:opacity-60 ${className}`}
      title={
        limitReached
          ? "Maksimum dinleme sayısına ulaşıldı"
          : audioSrc
            ? "MP3 dinle"
            : "Almanca ses (Edge TTS)"
      }
    >
      {playing ? <IconPlay size={16} /> : <IconVolume size={16} />}
      {playLabel}
    </button>
  );
}
