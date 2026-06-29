"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VocabularyWord } from "@german-coach/vocabulary";
import { IconPause, IconPlay } from "@/components/icons";
import { formatWord, stopAudio } from "@/lib/audio";
import type { CardsListenSettings } from "@/lib/cardsSettings";
import { playCardWordAudio } from "@/lib/playCardAudio";
import { useListenMediaSession } from "@/lib/useListenMediaSession";

interface CardsLockListenBarProps {
  word: VocabularyWord;
  settings: CardsListenSettings;
  index: number;
  total: number;
  categoryLabel: string;
  onPrevious: () => void;
  onNext: () => void;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function CardsLockListenBar({
  word,
  settings,
  index,
  total,
  categoryLabel,
  onPrevious,
  onNext,
}: CardsLockListenBarProps) {
  const [playing, setPlaying] = useState(false);
  const genRef = useRef(0);

  const display = formatWord(word.word, word.article);

  const interrupt = useCallback(() => {
    genRef.current += 1;
    stopAudio();
    setPlaying(false);
  }, []);

  const playOnce = useCallback(
    async (gen: number) => {
      if (genRef.current !== gen) return;
      await playCardWordAudio(word, settings);
    },
    [word, settings]
  );

  useEffect(() => {
    if (!playing) return;
    const gen = ++genRef.current;
    let active = true;

    (async () => {
      await playOnce(gen);
      if (!active || genRef.current !== gen) return;
      await sleep(2500);
      if (active && genRef.current === gen) {
        onNext();
      }
    })();

    return () => {
      active = false;
      interrupt();
    };
  }, [playing, word.id, playOnce, onNext, interrupt]);

  useEffect(() => () => interrupt(), [interrupt]);

  useListenMediaSession(
    playing,
    {
      title: display,
      subtitle: categoryLabel,
      index,
      total,
    },
    {
      onPause: interrupt,
      onPlay: () => setPlaying(true),
      onPrevious: () => {
        interrupt();
        onPrevious();
      },
      onNext: () => {
        interrupt();
        onNext();
      },
    }
  );

  return (
    <div className="card-soft border-2 border-goethe-blue/25 bg-goethe-blue/5 p-4">
      <p className="text-xs font-semibold uppercase text-goethe-blue">Kilit ekranı dinle</p>
      <p className="mt-1 text-sm text-sage-600">
        Başlat → telefonu kilitle → kulaklık veya kilit ekranından ileri/geri. Yazmak için ekranı
        aç; dinleme devam eder.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white ${
            playing ? "bg-goethe-red" : "bg-goethe-blue"
          }`}
          onClick={() => {
            if (playing) interrupt();
            else setPlaying(true);
          }}
        >
          {playing ? (
            <>
              <IconPause size={16} />
              Dur
            </>
          ) : (
            <>
              <IconPlay size={16} />
              Baslat
            </>
          )}
        </button>
        <button
          type="button"
          className="btn-secondary text-sm"
          onClick={() => {
            const gen = ++genRef.current;
            void playOnce(gen);
          }}
        >
          Tekrar
        </button>
      </div>
    </div>
  );
}
