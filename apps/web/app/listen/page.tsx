"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getTimurVocabulary,
  getWorkVocabulary,
  getA1Vocabulary,
  type VocabularyWord,
} from "@german-coach/vocabulary";
import { IconArrowLeft, IconArrowRight, IconPause, IconPlay } from "@/components/icons";
import { playGermanAudio, formatWord, stopAudio } from "@/lib/audio";
import { buildReviewQueue } from "@/lib/srs";
import { useProgress } from "@/lib/ProgressContext";

type ListenPack = "mesleki" | "work" | "a1" | "srs";

const PACK_LABELS: Record<ListenPack, string> = {
  mesleki: "Mesleki Almanca",
  work: "İş Almancası (Mesleki + A1 iş)",
  a1: "A1 — Tüm kelimeler",
  srs: "SRS — Bugün tekrar edilecekler",
};

function parsePack(value: string | null): ListenPack {
  if (value === "timur") return "mesleki";
  if (value === "mesleki" || value === "work" || value === "a1" || value === "srs") {
    return value;
  }
  return "mesleki";
}

export default function ListenPage() {
  return (
    <Suspense
      fallback={
        <div className="card-soft mx-auto max-w-lg p-8 text-center text-sage-500">
          Dinleme modu yükleniyor…
        </div>
      }
    >
      <ListenPageContent />
    </Suspense>
  );
}

function ListenPageContent() {
  const searchParams = useSearchParams();
  const { progress } = useProgress();
  const [pack, setPack] = useState<ListenPack>(() => parsePack(searchParams.get("pack")));
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [intervalSec, setIntervalSec] = useState(4);
  const [playExample, setPlayExample] = useState(true);
  const [a1Offline, setA1Offline] = useState<{ ready: number; total: number } | null>(null);
  const playbackGenRef = useRef(0);

  const interruptPlayback = useCallback(() => {
    playbackGenRef.current += 1;
    stopAudio();
  }, []);

  useEffect(() => {
    fetch("/audio/manifest.json")
      .then((r) => r.json())
      .then((m) => {
        const a1 = m.packs?.a1;
        if (a1) setA1Offline({ ready: a1.audioReady ?? 0, total: a1.words ?? 0 });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPack(parsePack(searchParams.get("pack")));
  }, [searchParams]);

  const playlist = useMemo((): VocabularyWord[] => {
    switch (pack) {
      case "mesleki":
        return getTimurVocabulary().words;
      case "work":
        return getWorkVocabulary();
      case "a1":
        return getA1Vocabulary().words;
      case "srs": {
        const ids = buildReviewQueue(
          getA1Vocabulary().words.map((w) => w.id),
          progress.srsRecords,
          50
        );
        const timurIds = buildReviewQueue(
          getTimurVocabulary().words.map((w) => w.id),
          progress.srsRecords,
          30
        );
        const all = [...getTimurVocabulary().words, ...getA1Vocabulary().words];
        return [...new Set([...timurIds, ...ids])]
          .map((id) => all.find((w) => w.id === id))
          .filter(Boolean) as VocabularyWord[];
      }
      default:
        return [];
    }
  }, [pack, progress.srsRecords]);

  const word = playlist[index % Math.max(playlist.length, 1)];

  const playCurrent = useCallback(
    async (gen: number) => {
      if (!word) return;
      const alive = () => playbackGenRef.current === gen;

      const display = formatWord(word.word, word.article);
      await playGermanAudio(display, word.audio_word);
      if (!alive()) return;

      if (playExample) {
        await sleep(600);
        if (!alive()) return;
        await playGermanAudio(word.example_de, word.audio_example);
      }
    },
    [word, playExample]
  );

  useEffect(() => {
    return () => {
      interruptPlayback();
    };
  }, [interruptPlayback]);

  useEffect(() => {
    if (!playing || !word) return;
    const gen = ++playbackGenRef.current;

    let active = true;

    (async () => {
      await playCurrent(gen);
      if (!active || playbackGenRef.current !== gen) return;
      await sleep(intervalSec * 1000);
      if (active && playbackGenRef.current === gen) {
        setIndex((i) => (i + 1) % playlist.length);
        setShowTranslation(false);
      }
    })();

    return () => {
      active = false;
      interruptPlayback();
    };
  }, [playing, index, word?.id, intervalSec, playCurrent, playlist.length, interruptPlayback]);

  useEffect(() => {
    if (!word) {
      setShowTranslation(false);
      return;
    }
    if (playing) {
      setShowTranslation(false);
      const t = setTimeout(() => setShowTranslation(true), 1500);
      return () => clearTimeout(t);
    }
    setShowTranslation(true);
  }, [playing, index, word?.id]);

  if (!word) {
    return (
      <div className="card-soft mx-auto max-w-lg p-8 text-center">
        <p className="text-sage-500">Liste boş.</p>
      </div>
    );
  }

  const display = formatWord(word.word, word.article);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <header className="text-center">
        <span className="goethe-badge mb-2 bg-goethe-blue">Kulak Eğitimi</span>
        <h1 className="text-xl font-bold text-goethe-blue">Yürüyüş Dinleme</h1>
        <p className="text-sm text-sage-400">{PACK_LABELS[pack]}</p>
        {pack === "a1" && a1Offline && (
          <p className="mt-2 text-xs text-sage-500">
            MP3 offline: {a1Offline.ready}/{a1Offline.total}
            {a1Offline.ready >= a1Offline.total ? " · tam paket" : " · eksikler TTS ile tamamlanır"}
          </p>
        )}
      </header>

      <div className="card-soft p-4 space-y-3">
        <label className="block text-xs text-sage-400">Paket</label>
        <select
          value={pack}
          onChange={(e) => {
            interruptPlayback();
            setPack(e.target.value as ListenPack);
            setIndex(0);
            setPlaying(false);
          }}
          className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2 text-sm"
        >
          {(Object.keys(PACK_LABELS) as ListenPack[]).map((k) => (
            <option key={k} value={k}>
              {PACK_LABELS[k]}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-sage-400">
            Aralık: {intervalSec}s
            <input
              type="range"
              min={2}
              max={10}
              value={intervalSec}
              onChange={(e) => setIntervalSec(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-sage-500">
            <input
              type="checkbox"
              checked={playExample}
              onChange={(e) => setPlayExample(e.target.checked)}
            />
            Cümle de dinle
          </label>
        </div>
      </div>

      <div className="card-soft overflow-hidden">
        <div className="bg-goethe-blue px-6 py-10 text-center text-white">
          <p className="text-xs uppercase tracking-widest text-white/60">
            {index + 1} / {playlist.length}
          </p>
          <p className="mt-4 text-4xl font-bold">{display}</p>
          {word.plural && (
            <p className="mt-2 text-sm text-white/70">Plural: {word.plural}</p>
          )}
          {showTranslation && (
            <div className="mt-6 space-y-2 text-left sm:text-center">
              <p className="text-lg font-medium text-white">{word.translation_tr}</p>
              {word.example_de && (
                <div className="rounded-lg bg-white/10 px-4 py-3">
                  <p className="text-sm italic text-white/80">{word.example_de}</p>
                  {word.example_tr && (
                    <p className="mt-1 text-sm text-white/65">{word.example_tr}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2 p-4">
          <button
            type="button"
            className="btn-secondary inline-flex flex-1 items-center justify-center gap-1"
            onClick={() => {
              interruptPlayback();
              setPlaying(false);
              setIndex((i) => (i - 1 + playlist.length) % playlist.length);
            }}
          >
            <IconArrowLeft size={16} />
            Önceki
          </button>
          <button
            type="button"
            className={`inline-flex flex-1 items-center justify-center gap-1 py-2.5 rounded-xl font-medium text-white ${
              playing ? "bg-goethe-red" : "bg-sage-500 hover:bg-sage-600"
            }`}
            onClick={() => {
              if (playing) {
                interruptPlayback();
                setPlaying(false);
              } else {
                setPlaying(true);
              }
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
                Başlat
              </>
            )}
          </button>
          <button
            type="button"
            className="btn-secondary inline-flex flex-1 items-center justify-center gap-1"
            onClick={() => {
              interruptPlayback();
              setPlaying(false);
              setIndex((i) => (i + 1) % playlist.length);
            }}
          >
            Sonraki
            <IconArrowRight size={16} />
          </button>
        </div>
        <div className="border-t border-sage-100 p-4 text-center">
          <button
            type="button"
            className="text-sm text-sage-500 underline"
            onClick={() => {
              const gen = ++playbackGenRef.current;
              void playCurrent(gen);
            }}
          >
            Tekrar dinle
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-sage-400">
        MP3 yoksa tarayıcı sesi kullanılır. Önce:{" "}
        <code className="rounded bg-sage-100 px-1">npm run audio -- --pack timur</code>
      </p>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
