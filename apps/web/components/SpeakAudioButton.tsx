"use client";

import { useState } from "react";
import { IconVolume } from "@/components/icons";
import { playGermanAudio, stopAudio } from "@/lib/audio";

interface SpeakAudioButtonProps {
  text: string;
  label?: string;
  size?: "sm" | "md";
  /** dark: sınıf tahtası gibi koyu zemin; light: beyaz/krem kartlar */
  variant?: "light" | "dark";
  className?: string;
}

const VARIANT_CLASS = {
  light:
    "border-goethe-blue/25 bg-goethe-blue/10 text-goethe-blue hover:border-goethe-blue/40 hover:bg-goethe-blue/15",
  dark: "border-white/25 bg-white/10 text-[#e8edd8] hover:bg-white/20",
} as const;

export function SpeakAudioButton({
  text,
  label,
  size = "sm",
  variant = "light",
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
      className={`inline-flex shrink-0 items-center justify-center rounded-full border transition disabled:opacity-50 ${VARIANT_CLASS[variant]} ${sizeClass} ${className}`}
    >
      {playing ? (
        <span className="text-xs">…</span>
      ) : (
        <IconVolume size={size === "md" ? 18 : 14} />
      )}
    </button>
  );
}
