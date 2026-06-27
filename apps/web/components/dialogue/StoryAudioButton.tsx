"use client";

import { useState } from "react";
import { IconVolume } from "@/components/icons";
import { playGermanAudio, playTurkishAudio, stopAudio } from "@/lib/audio";

interface StoryAudioButtonProps {
  text: string;
  lang: "de" | "tr";
  audioSrc?: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function StoryAudioButton({
  text,
  lang,
  audioSrc,
  label,
  size = "sm",
  className = "",
}: StoryAudioButtonProps) {
  const [playing, setPlaying] = useState(false);
  const trimmed = text.trim();
  if (!trimmed) return null;

  const sizeClass = size === "md" ? "h-10 w-10 text-lg" : "h-8 w-8 text-sm";
  const langLabel = lang === "de" ? "DE" : "TR";
  const colorClass =
    lang === "de"
      ? "border-goethe-blue/20 bg-goethe-blue/10 text-goethe-blue hover:bg-goethe-blue/15"
      : "border-amber-200/80 bg-amber-50 text-amber-900 hover:bg-amber-100";

  return (
    <button
      type="button"
      disabled={playing}
      onClick={async (e) => {
        e.stopPropagation();
        stopAudio();
        setPlaying(true);
        try {
          if (lang === "de") {
            await playGermanAudio(trimmed, audioSrc ?? null);
          } else {
            await playTurkishAudio(trimmed, audioSrc ?? null);
          }
        } finally {
          setPlaying(false);
        }
      }}
      aria-label={label ?? `${langLabel} dinle: ${trimmed}`}
      title={`${langLabel} dinle`}
      className={`inline-flex shrink-0 items-center justify-center rounded-full border transition disabled:opacity-50 ${sizeClass} ${colorClass} ${className}`}
    >
      {playing ? (
        <span className="text-[10px] font-bold">…</span>
      ) : (
        <>
          <IconVolume size={size === "md" ? 18 : 14} />
          <span className="sr-only">{langLabel}</span>
        </>
      )}
    </button>
  );
}
