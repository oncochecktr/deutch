"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { playGermanAudio, stopAudio } from "@/lib/audio";
import { checkDictation } from "@/lib/germanTextCompare";
import {
  buildSmartQueue,
  GRAMMAR_CHEATSHEET,
  hintForAttempt,
  markMastered,
  patternLabel,
  requeueOnWrong,
  type SmartQueueItem,
} from "@/lib/smartDiktat";
import { loadDiktatStore, saveDiktatStore } from "@/lib/diktatStorage";
import { IconVolume } from "@/components/icons";

interface SmartDiktatDrillProps {
  showTurkish: boolean;
}

export function SmartDiktatDrill({ showTurkish }: SmartDiktatDrillProps) {
  const [queue, setQueue] = useState<SmartQueueItem[]>(() => buildSmartQueue(8));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const autoPlayedRef = useRef(false);

  const item = queue[index];
  const drill = item?.drill;
  const done = index >= queue.length;
  const hint = drill ? hintForAttempt(drill, item.attempts, showTurkish) : null;

  const playAudio = useCallback(async (times = 1) => {
    if (!drill) return;
    stopAudio();
    setPlaying(true);
    try {
      for (let t = 0; t < times; t++) {
        await playGermanAudio(drill.audioText);
        if (t < times - 1) await sleep(700);
      }
    } finally {
      setPlaying(false);
    }
  }, [drill]);

  useEffect(() => {
    setInput("");
    setChecked(false);
    autoPlayedRef.current = false;
    if (drill) void playAudio(1);
  }, [drill?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCheck = () => {
    if (!drill || !item) return;
    const result = checkDictation(input, drill.de, { minScore: 88, allowArticleOmit: false });
    setChecked(true);

    if (result.ok) {
      setSessionCorrect((c) => c + 1);
      const store = loadDiktatStore();
      saveDiktatStore({ smartCorrect: (store.smartCorrect ?? 0) + 1 });
      setTimeout(() => {
        setQueue((q) => markMastered(q, index));
        setIndex((i) => i + 1);
      }, 1200);
    } else {
      if (!autoPlayedRef.current) {
        autoPlayedRef.current = true;
        void playAudio(1);
      }
      const nextAttempts = item.attempts + 1;
      setQueue((q) => requeueOnWrong(q, index));
      const delay = nextAttempts >= 3 ? 2800 : 1600;
      setTimeout(() => setIndex((i) => i + 1), delay);
    }
  };

  const restart = () => {
    setQueue(buildSmartQueue(8, Date.now()));
    setIndex(0);
    setSessionCorrect(0);
    setInput("");
    setChecked(false);
  };

  const result = useMemo(() => {
    if (!checked || !drill) return null;
    return checkDictation(input, drill.de, { minScore: 88, allowArticleOmit: false });
  }, [checked, drill, input]);

  if (done) {
    return (
      <div className="rounded-xl border border-sage-100 bg-white p-8 text-center">
        <p className="text-xl font-bold text-goethe-blue">Tur tamam!</p>
        <p className="mt-2 text-sage-600">
          {sessionCorrect} / {queue.length} ilk denemede doğru
        </p>
        <button type="button" className="btn-primary mt-4" onClick={restart}>
          Yeni tur (farklı kelimeler)
        </button>
      </div>
    );
  }

  if (!drill) return null;

  return (
    <div className="space-y-4 rounded-xl border border-sage-100 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase text-goethe-blue">
            Akıllı tekrar · {patternLabel(drill.pattern)}
          </p>
          <p className="text-xs text-sage-500">
            {index + 1} / {queue.length}
            {item.attempts > 0 && ` · deneme ${item.attempts + 1}`}
          </p>
        </div>
        <button
          type="button"
          disabled={playing}
          onClick={() => playAudio(1)}
          className="flex items-center gap-1 rounded-full bg-goethe-blue/10 px-3 py-1.5 text-xs font-semibold text-goethe-blue"
        >
          <IconVolume size={14} />
          Dinle
        </button>
      </div>

      <details className="rounded-lg bg-sage-50 px-3 py-2 text-xs text-sage-600">
        <summary className="cursor-pointer font-semibold text-goethe-blue">
          haben / sehen · ein / eine / einen
        </summary>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {GRAMMAR_CHEATSHEET.map((row) => (
            <li key={row.de}>
              <span className="font-medium text-goethe-blue">{row.de}</span>
              <span className="text-sage-400"> — {row.tr}</span>
            </li>
          ))}
        </ul>
      </details>

      {hint && (
        <p className="rounded-lg border border-goethe-gold/30 bg-goethe-gold/10 px-3 py-2 text-sm text-sage-700">
          💡 {hint}
        </p>
      )}

      <p className="text-xs text-sage-400">
        Duyduğunu yaz — yanlışsa bir kez daha dinlersin, aynı kart hemen tekrarlanmaz.
      </p>

      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setChecked(false);
        }}
        rows={3}
        placeholder="Ich habe ein Handy. Das Handy ist neu."
        className="w-full resize-none rounded-xl border border-sage-200 px-4 py-3 text-base focus:border-goethe-blue focus:outline-none"
        spellCheck={false}
        lang="de"
        autoComplete="off"
      />

      <div className="flex gap-2">
        <button
          type="button"
          className="btn-primary flex-1"
          disabled={!input.trim() || playing}
          onClick={handleCheck}
        >
          Kontrol
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={playing}
          onClick={() => playAudio(2)}
        >
          2× dinle
        </button>
      </div>

      {checked && result && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            result.ok ? "bg-sage-50 text-sage-700" : "bg-red-50 text-red-900"
          }`}
        >
          {result.ok ? (
            <p className="font-semibold">Doğru — sıradaki cümleye geçiliyor…</p>
          ) : (
            <>
              <p className="font-semibold">Henüz tam değil (%{result.score})</p>
              <p className="mt-2">
                Doğrusu: <strong className="text-goethe-blue">{drill.de}</strong>
              </p>
              {showTurkish && <p className="mt-1 text-sage-600">{drill.tr}</p>}
              <p className="mt-2 text-xs opacity-80">
                {item.attempts < 3
                  ? "Biraz sonra aynı kalıp tekrar gelir — şimdi başka cümleye geç."
                  : "Cevap gösterildi — devam."}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
