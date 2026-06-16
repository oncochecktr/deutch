"use client";

import { useState } from "react";
import Link from "next/link";
import { getA2Vocabulary } from "@german-coach/vocabulary";
import { PageShell } from "@/components/PageShell";
import { WordCard } from "@/components/WordCard";
import { IconArrowLeft, IconArrowRight } from "@/components/icons";

export default function A2CardsPage() {
  const vocab = getA2Vocabulary();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const word = vocab.words[index];

  const go = (delta: number) => {
    setIndex((i) => (i + delta + vocab.words.length) % vocab.words.length);
    setFlipped(false);
  };

  return (
    <PageShell
      title="A2 Kelime Kartları"
      subtitle={`${vocab.total} kelime · Start Deutsch 2 hazırlık`}
      backHref="/"
    >
      <div className="mx-auto max-w-lg space-y-4">
        <p className="text-center text-xs text-sage-400">
          {index + 1} / {vocab.words.length} · {word.category}
        </p>
        <WordCard word={word} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
        <div className="flex gap-2">
          <button type="button" className="btn-secondary flex-1 py-3" onClick={() => go(-1)}>
            <IconArrowLeft size={18} className="mx-auto" />
          </button>
          <button type="button" className="btn-primary flex-1 py-3" onClick={() => go(1)}>
            <IconArrowRight size={18} className="mx-auto" />
          </button>
        </div>
        <Link href="/a2/words" className="block text-center text-sm text-goethe-blue hover:underline">
          Kelime listesi →
        </Link>
      </div>
    </PageShell>
  );
}
