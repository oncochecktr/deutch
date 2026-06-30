"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { playGermanAudio, stopAudio } from "@/lib/audio";
import { checkDictation } from "@/lib/germanTextCompare";
import {
  buildSmartQueue,
  hintForAttempt,
  markMastered,
  patternCheatsheetRows,
  patternCheatsheetSummary,
  patternLabel,
  requeueOnWrong,
  type SmartQueueItem,
} from "@/lib/smartDiktat";
import { loadDiktatStore, saveDiktatStore } from "@/lib/diktatStorage";
import { IconVolume } from "@/components/icons";

interface SmartDiktatDrillProps {
  showTurkish: boolean;
  active?: boolean;
}

function placeholderForPattern(pattern: "habe" | "sehe"): string {
  return pattern === "habe"
    ? "Dinlediğin cümleyi yaz… (ör. Ich habe … Das … ist …)"
    : "Dinlediğin cümleyi yaz… (ör. Ich sehe … Das … ist …)";
}

export function SmartDiktatDrill({ showTurkish, active = true }: SmartDiktatDrillProps) {
  const [queue, setQueue] = useState<SmartQueueItem[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [lastResult, setLastResult] = useState<ReturnType<typeof checkDictation> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQueue(buildSmartQueue(8));
  }, []);

  useEffect(
    () => () => {
      stopAudio();
    },
    []
  );

  useEffect(() => {
    if (!active) {
      stopAudio();
      setPlaying(false);
    }
  }, [active]);

  const item = queue[index];
  const drill = item?.drill;
  const done = queue.length > 0 && index >= queue.length;
  const hint = drill ? hintForAttempt(drill, item.attempts, showTurkish) : null;
  const cheatsheetRows = useMemo(
    () => (drill ? patternCheatsheetRows(drill.pattern) : []),
    [drill]
  );

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
    setLastResult(null);
  }, [drill?.id]);

  useEffect(() => {
    if (checked && lastResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [checked, lastResult]);

  const handleCheck = () => {
    if (!drill || !item || checked) return;
    const result = checkDictation(input, drill.de, { minScore: 88, allowArticleOmit: false });
    setLastResult(result);
    setChecked(true);

    if (result.ok) {
      setSessionCorrect((c) => c + 1);
      const store = loadDiktatStore();
      saveDiktatStore({ smartCorrect: (store.smartCorrect ?? 0) + 1 });
    } else {
      setQueue((q) =>
        q.map((it, i) => (i === index ? { ...it, attempts: it.attempts + 1 } : it))
      );
    }
  };

  const handleRetry = () => {
    setInput("");
    setChecked(false);
    setLastResult(null);
  };

  const handleNext = () => {
    if (!item || !lastResult) return;

    if (lastResult.ok) {
      setQueue((q) => markMastered(q, index));
      setIndex((i) => i + 1);
    } else {
      setQueue((q) => requeueOnWrong(q, index));
      // Kuyruktan çıkarılınca aynı index'teki sonraki cümle gelir — atlama yok
    }

    setInput("");
    setChecked(false);
    setLastResult(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    if (!input.trim() || playing || checked) return;
    handleCheck();
  };

  const restart = () => {
    stopAudio();
    setQueue(buildSmartQueue(8, Date.now()));
    setIndex(0);
    setSessionCorrect(0);
    setInput("");
    setChecked(false);
    setLastResult(null);
  };

  if (queue.length === 0) {
    return (
      <div className="rounded-xl border border-sage-100 bg-white p-8 text-center text-sm text-sage-500">
        Akıllı tekrar hazırlanıyor…
      </div>
    );
  }

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
          {patternCheatsheetSummary(drill.pattern)}
        </summary>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {cheatsheetRows.map((row) => (
            <li key={row.de}>
              <span className="font-medium text-goethe-blue">{row.de}</span>
              <span className="text-sage-400"> — {row.tr}</span>
            </li>
          ))}
        </ul>
      </details>

      {hint && (
        <p className="rounded-lg border border-goethe-gold/30 bg-goethe-gold/10 px-3 py-2 text-sm text-sage-700">
          Ipucu: {hint}
        </p>
      )}

      <p className="text-xs text-sage-400">
        Önce <strong className="font-semibold text-sage-500">Dinle</strong> — sonra duyduğunu yaz. Yanlışsa bir kez daha dinlersin.
      </p>

      <textarea
        value={input}
        onChange={(e) => {
          if (checked) return;
          setInput(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        rows={3}
        placeholder={placeholderForPattern(drill.pattern)}
        className="w-full resize-none rounded-xl border border-sage-200 px-4 py-3 text-base placeholder:text-sage-300 focus:border-goethe-blue focus:outline-none"
        spellCheck={false}
        lang="de"
        autoComplete="off"
      />

      {checked && lastResult && (
        <div
          ref={resultRef}
          className={`rounded-lg px-4 py-3 text-sm ${
            lastResult.ok ? "bg-sage-50 text-sage-700" : "bg-red-50 text-red-900"
          }`}
        >
          {lastResult.ok ? (
            <p className="font-semibold">Doğru — devam etmek için Sonraki.</p>
          ) : (
            <>
              <p className="font-semibold">Henüz tam değil (%{lastResult.score})</p>
              <p className="mt-2">
                Doğrusu: <strong className="text-goethe-blue">{drill.de}</strong>
              </p>
              {showTurkish && <p className="mt-1 text-sage-600">{drill.tr}</p>}
              <p className="mt-2 text-xs opacity-80">
                Tekrar yazabilir veya Sonraki ile devam edebilirsin.
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {!checked ? (
          <>
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
          </>
        ) : (
          <>
            {!lastResult?.ok && (
              <button type="button" className="btn-secondary flex-1" onClick={handleRetry}>
                Tekrar dene
              </button>
            )}
            <button
              type="button"
              className={`${lastResult?.ok ? "btn-primary flex-1" : "btn-primary flex-1"}`}
              onClick={handleNext}
            >
              Sonraki
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
