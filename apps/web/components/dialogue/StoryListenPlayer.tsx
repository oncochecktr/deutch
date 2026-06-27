"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DialogueStory } from "@/lib/dialogueTypes";
import { playGermanAudio, playTurkishAudio, stopAudio } from "@/lib/audio";
import { checkDictation } from "@/lib/germanTextCompare";
import { useListenMediaSession } from "@/lib/useListenMediaSession";
import { IconArrowLeft, IconArrowRight, IconPause, IconPlay, IconVolume } from "@/components/icons";

const DE_TR_GAP_MS = 700;
const LINE_GAP_MS = 1600;

type SubMode = "flow" | "write";

interface StoryListenPlayerProps {
  story: DialogueStory;
}

export function StoryListenPlayer({ story }: StoryListenPlayerProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [subMode, setSubMode] = useState<SubMode>("flow");
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [showTr, setShowTr] = useState(false);
  const [playingOne, setPlayingOne] = useState(false);
  const genRef = useRef(0);

  const line = story.lines[index];
  const total = story.lines.length;

  const interrupt = useCallback(() => {
    genRef.current += 1;
    stopAudio();
    setPlayingOne(false);
  }, []);

  const playLineSequence = useCallback(
    async (lineIndex: number, gen: number, trAfter = true) => {
      const l = story.lines[lineIndex];
      if (!l) return;
      const alive = () => genRef.current === gen;

      if (l.audio_de) {
        await playGermanAudio(l.text_de, l.audio_de);
      } else {
        await playGermanAudio(l.text_de);
      }
      if (!alive()) return;

      if (trAfter) {
        await sleep(DE_TR_GAP_MS);
        if (!alive()) return;
        if (l.audio_tr) {
          await playTurkishAudio(l.text_tr, l.audio_tr);
        } else {
          await playTurkishAudio(l.text_tr);
        }
      }
    },
    [story.lines]
  );

  const goPrevious = useCallback(() => {
    interrupt();
    setPlaying(false);
    setIndex((i) => Math.max(0, i - 1));
    setInput("");
    setChecked(false);
    setShowTr(false);
  }, [interrupt]);

  const goNext = useCallback(() => {
    interrupt();
    setPlaying(false);
    setIndex((i) => Math.min(total - 1, i + 1));
    setInput("");
    setChecked(false);
    setShowTr(false);
  }, [interrupt, total]);

  useEffect(() => {
    setInput("");
    setChecked(false);
    setShowTr(false);
  }, [index]);

  useEffect(() => {
    if (!playing || subMode !== "flow") return;
    const gen = ++genRef.current;
    let cancelled = false;

    (async () => {
      setShowTr(false);
      await playLineSequence(index, gen, true);
      if (cancelled || genRef.current !== gen) return;
      setShowTr(true);
      await sleep(LINE_GAP_MS);
      if (cancelled || genRef.current !== gen) return;
      if (index + 1 < total) {
        setIndex((i) => i + 1);
      } else {
        setPlaying(false);
      }
    })();

    return () => {
      cancelled = true;
      stopAudio();
    };
  }, [playing, index, subMode, playLineSequence, total]);

  useEffect(() => () => interrupt(), [interrupt]);

  useListenMediaSession(
    (playing || playingOne) && !!line,
    {
      title: line?.text_de.slice(0, 72) || story.title_de,
      subtitle: `${story.title_tr} · Almanca → Türkçe`,
      index,
      total,
    },
    {
      onPause: () => {
        interrupt();
        setPlaying(false);
      },
      onPlay: () => {
        if (subMode === "flow") setPlaying(true);
      },
      onPrevious: goPrevious,
      onNext: goNext,
    }
  );

  const playCurrentOnce = async (withTr: boolean) => {
    interrupt();
    const gen = ++genRef.current;
    setPlayingOne(true);
    try {
      await playLineSequence(index, gen, withTr);
    } finally {
      if (genRef.current === gen) setPlayingOne(false);
    }
  };

  const result =
    checked && line
      ? checkDictation(input, line.text_de, { minScore: 88, allowArticleOmit: false })
      : null;

  const handleCheck = () => {
    if (!input.trim() || !line) return;
    setChecked(true);
  };

  if (!line) return null;

  return (
    <div className="space-y-4 rounded-xl border border-goethe-blue/15 bg-gradient-to-b from-goethe-blue/5 to-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-goethe-blue">
            Hikaye dinle
          </p>
          <p className="text-sm text-sage-600">
            Satır {index + 1} / {total} · önce Almanca, sonra Türkçe
          </p>
        </div>
        <div className="flex rounded-lg bg-sage-100 p-0.5">
          <button
            type="button"
            onClick={() => {
              interrupt();
              setPlaying(false);
              setSubMode("flow");
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              subMode === "flow" ? "bg-white text-goethe-blue shadow-sm" : "text-sage-600"
            }`}
          >
            Dinle (DE→TR)
          </button>
          <button
            type="button"
            onClick={() => {
              interrupt();
              setPlaying(false);
              setSubMode("write");
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              subMode === "write" ? "bg-white text-goethe-blue shadow-sm" : "text-sage-600"
            }`}
          >
            Dinle-yaz
          </button>
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-sage-100">
        <div
          className="h-full rounded-full bg-goethe-blue transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {subMode === "flow" ? (
        <>
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-sage-100">
            <p className="text-base leading-relaxed text-goethe-blue sm:text-lg">{line.text_de}</p>
            {(playing || showTr) && (
              <p className="mt-3 border-t border-sage-100 pt-3 text-sm italic text-sage-600">
                {line.text_tr}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button type="button" className="btn-secondary text-xs" onClick={goPrevious} disabled={index === 0}>
              <span className="inline-flex items-center justify-center gap-1">
                <IconArrowLeft size={14} />
                Önceki
              </span>
            </button>
            <button
              type="button"
              className={`inline-flex items-center justify-center gap-1 rounded-xl py-3 text-sm font-semibold text-white ${
                playing ? "bg-goethe-red" : "bg-goethe-blue"
              }`}
              onClick={() => {
                if (playing) {
                  interrupt();
                  setPlaying(false);
                } else {
                  setShowTr(false);
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
              className="btn-secondary text-xs"
              onClick={goNext}
              disabled={index >= total - 1}
            >
              <span className="inline-flex items-center justify-center gap-1">
                Sonraki
                <IconArrowRight size={14} />
              </span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-secondary flex-1 text-xs"
              disabled={playingOne || playing}
              onClick={() => void playCurrentOnce(true)}
            >
              <span className="inline-flex items-center justify-center gap-1">
                <IconVolume size={14} />
                Bu satır (DE→TR)
              </span>
            </button>
            <button
              type="button"
              className="rounded-xl border border-sage-200 px-3 py-2 text-xs text-sage-600"
              onClick={() => setShowTr((v) => !v)}
            >
              {showTr ? "TR gizle" : "TR göster"}
            </button>
          </div>

          <p className="text-center text-[11px] leading-relaxed text-sage-500">
            Başlat → her satırda önce Almanca, sonra Türkçe. Telefonu kilitle — kilit ekranından
            ileri/geri ve dur/başlat çalışır.
          </p>
        </>
      ) : (
        <>
          <p className="text-xs text-sage-500">
            Önce dinle, duyduğunu Almanca yaz, kontrol et — anlamak için Türkçe dinle.
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-secondary flex-1 text-xs"
              disabled={playingOne || playing}
              onClick={() => void playCurrentOnce(false)}
            >
              <IconVolume size={14} className="mr-1 inline" />
              Almanca dinle
            </button>
            <button
              type="button"
              className="btn-secondary flex-1 text-xs"
              disabled={playingOne || playing}
              onClick={async () => {
                interrupt();
                const gen = ++genRef.current;
                setPlayingOne(true);
                try {
                  if (line.audio_tr) await playTurkishAudio(line.text_tr, line.audio_tr);
                  else await playTurkishAudio(line.text_tr);
                } finally {
                  if (genRef.current === gen) setPlayingOne(false);
                }
              }}
            >
              <IconVolume size={14} className="mr-1 inline" />
              Türkçe dinle
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setChecked(false);
            }}
            rows={3}
            placeholder="Duyduğunu Almanca yaz…"
            className="w-full resize-none rounded-xl border border-sage-200 px-4 py-3 text-base focus:border-goethe-blue focus:outline-none"
            spellCheck={false}
            lang="de"
            autoComplete="off"
          />

          <div className="flex gap-2">
            <button
              type="button"
              className="btn-primary flex-1"
              disabled={!input.trim() || playingOne}
              onClick={handleCheck}
            >
              Kontrol
            </button>
            <button type="button" className="btn-secondary" onClick={goNext} disabled={index >= total - 1}>
              Sonraki →
            </button>
          </div>

          {checked && result && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                result.ok ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"
              }`}
            >
              {result.ok ? (
                <p className="font-semibold">Doğru!</p>
              ) : (
                <>
                  <p className="font-semibold">Henüz tam değil (%{result.score})</p>
                  <p className="mt-2 text-goethe-blue">{line.text_de}</p>
                </>
              )}
              <p className="mt-2 text-sage-600">{line.text_tr}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
