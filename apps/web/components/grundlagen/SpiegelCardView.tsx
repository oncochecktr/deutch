"use client";

import { useState } from "react";
import { playGermanAudio, stopAudio } from "@/lib/audio";
import type { SpiegelDisplay } from "@/lib/wordSpiegel";
import { IconVolume } from "@/components/icons";

interface SpiegelCardViewProps {
  card: SpiegelDisplay;
  showTurkish: boolean;
}

/** Görsel referans: TR → DE kalın → IPA — sade, sol hizalı */
export function SpiegelCardView({ card, showTurkish }: SpiegelCardViewProps) {
  const [playing, setPlaying] = useState(false);
  const [revealTr, setRevealTr] = useState(false);
  const [showVariations, setShowVariations] = useState(false);

  const trVisible = showTurkish || revealTr;
  const deLine = card.de.replace(/\.$/, "");

  const speak = async () => {
    stopAudio();
    setPlaying(true);
    try {
      await playGermanAudio(deLine);
    } finally {
      setPlaying(false);
    }
  };

  return (
    <article className="rounded-2xl border border-sage-100 bg-white px-5 py-6">
      {card.tag && (
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-sage-400">
          {card.tag}
        </p>
      )}

      <div className="space-y-3 text-left">
        {trVisible ? (
          <p className="text-base text-sage-700">{card.tr}</p>
        ) : (
          <button
            type="button"
            onClick={() => setRevealTr(true)}
            className="text-sm text-sage-400 underline decoration-dotted underline-offset-4"
          >
            Türkçeyi göster
          </button>
        )}

        <div className="flex items-start gap-3">
          <p className="flex-1 text-xl font-bold leading-snug text-goethe-blue">{deLine}</p>
          <button
            type="button"
            onClick={speak}
            disabled={playing}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-goethe-blue/70 hover:bg-sage-50 disabled:opacity-50"
            aria-label="Dinle"
          >
            {playing ? <span className="text-xs">…</span> : <IconVolume size={18} />}
          </button>
        </div>

        <p className="font-mono text-sm text-sage-400">{card.ipa}</p>
      </div>

      {card.variations && card.variations.length > 0 && (
        <div className="mt-5 border-t border-sage-50 pt-4">
          <button
            type="button"
            onClick={() => setShowVariations((v) => !v)}
            className="text-xs font-medium text-sage-500"
          >
            {showVariations ? "Benzerleri gizle" : "Benzer cümleler"}
          </button>
          {showVariations && (
            <ul className="mt-3 space-y-3">
              {card.variations.map((v, i) => (
                <li key={i} className="space-y-1">
                  {trVisible && <p className="text-sm text-sage-600">{v.tr}</p>}
                  <p className="font-semibold text-goethe-blue">{v.de}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}
