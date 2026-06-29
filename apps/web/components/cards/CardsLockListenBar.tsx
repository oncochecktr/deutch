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
  const wordRef = useRef(word);
  const settingsRef = useRef(settings);
  const onNextRef = useRef(onNext);
  const onPreviousRef = useRef(onPrevious);
  const playingRef = useRef(playing);

  wordRef.current = word;
  settingsRef.current = settings;
  onNextRef.current = onNext;
  onPreviousRef.current = onPrevious;
  playingRef.current = playing;

  const display = formatWord(word.word, word.article);

  const interrupt = useCallback(() => {
    genRef.current += 1;
    stopAudio();
    setPlaying(false);
  }, []);

  const playCurrent = useCallback(async () => {
    const gen = genRef.current;
    await playCardWordAudio(wordRef.current, settingsRef.current);
    return genRef.current === gen;
  }, []);

  useEffect(() => {
    if (!playing) return;

    const gen = ++genRef.current;

    const loop = async () => {
      while (playingRef.current && genRef.current === gen) {
        await playCardWordAudio(wordRef.current, settingsRef.current);
        if (!playingRef.current || genRef.current !== gen) break;
        await sleep(2500);
        if (!playingRef.current || genRef.current !== gen) break;
        onNextRef.current();
        await sleep(80);
      }
    };

    void loop();

    return () => {
      genRef.current += 1;
      stopAudio();
    };
  }, [playing]);

  useEffect(() => {
    return () => {
      genRef.current += 1;
      stopAudio();
    };
  }, []);

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
        onPreviousRef.current();
      },
      onNext: () => {
        interrupt();
        onNextRef.current();
      },
    }
  );

  return (
    <div className="card-soft border-2 border-goethe-blue/25 bg-goethe-blue/5 p-3">
      <p className="mb-2 text-xs font-semibold uppercase text-goethe-blue">Kilit ekranı dinle</p>
      <div className="flex gap-2">
        <button
          type="button"
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-white ${
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
            void playCurrent();
          }}
        >
          Tekrar
        </button>
      </div>
    </div>
  );
}
