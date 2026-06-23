"use client";

import { useState } from "react";
import { playGermanAudio, stopAudio } from "@/lib/audio";

interface SpeakAudioButtonProps {
  text: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function SpeakAudioButton({
  text,
  label,
  size = "sm",
  className = "",
}: SpeakAudioButtonProps) {
  const [playing, setPlaying] = useState(false);
  const trimmed = text.trim();
  if (!trimmed) return null;

  const sizeClass =
    size === "md"
      ? "h-10 w-10 text-lg"
      : "h-8 w-8 text-sm";

  return (
    <button
      type="button"
      disabled={playing}
      onClick={async (e) => {
        e.stopPropagation();
        stopAudio();
        setPlaying(true);
        try {
          await playGermanAudio(trimmed);
        } finally {
          setPlaying(false);
        }
      }}
      aria-label={label ?? `Profesör seslendirsin: ${trimmed}`}
      title="Profesör seslendirsin"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-[#e8edd8] transition hover:bg-white/20 disabled:opacity-50 ${sizeClass} ${className}`}
    >
      {playing ? "…" : "🔊"}
    </button>
  );
}
