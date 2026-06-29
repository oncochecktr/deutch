"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VocabularyWord } from "@german-coach/vocabulary";
import type { CardsListenSettings } from "@/lib/cardsSettings";
import { AudioButton } from "./AudioButton";
import { CardsPlayButton } from "@/components/cards/CardsPlayButton";
import { SmartTip } from "@/components/ui/SmartTip";
import { formatWord } from "@/lib/audio";
import { checkDictation } from "@/lib/germanTextCompare";
import { splitExamples } from "@/lib/vocabMeta";

type Mode = "word" | "sentence";

const CORRECT_ADVANCE_MS = 450;

interface HearAndWriteProps {
  word: VocabularyWord;
  wordVisible?: boolean;
  disabled?: boolean;
  /** Doğru yazıldığında çağrılır (ör. sonraki kelime kartı) */
  onCorrect?: () => void;
  showKeyboardHint?: boolean;
  listenSettings?: CardsListenSettings;
}

export function HearAndWrite({
  word,
  wordVisible = false,
  disabled = false,
  onCorrect,
  showKeyboardHint = true,
  listenSettings,
}: HearAndWriteProps) {
  const display = formatWord(word.word, word.article);
  const examples = splitExamples(word.example_de, word.example_tr);
  const sentence = examples[0]?.de ?? word.example_de;

  const [mode, setMode] = useState<Mode>("word");
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof checkDictation> | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const target = mode === "word" ? display : sentence;
  const audioSrc = mode === "word" ? word.audio_word : word.audio_example;

  useEffect(() => {
    setInput("");
    setChecked(false);
    setResult(null);
  }, [word.id, mode]);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    []
  );

  const scheduleAdvance = useCallback(() => {
    if (!onCorrect) return;
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      onCorrect();
      advanceTimer.current = null;
    }, CORRECT_ADVANCE_MS);
  }, [onCorrect]);

  const advanceNow = useCallback(() => {
    if (!onCorrect) return;
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    onCorrect();
  }, [onCorrect]);

  const handleCheck = useCallback(() => {
    if (!input.trim()) return;
    const r = checkDictation(input, target, {
      allowArticleOmit: mode === "word",
      minScore: mode === "word" ? 92 : 88,
    });
    setResult(r);
    setChecked(true);
    if (r.ok) scheduleAdvance();
  }, [input, target, mode, scheduleAdvance]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    e.stopPropagation();
    if (!input.trim() || disabled) return;
    if (checked && result?.ok && onCorrect) {
      advanceNow();
      return;
    }
    handleCheck();
  };

  return (
    <section
      className="border-t border-sage-100 bg-cream-50/80 p-4"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-goethe-blue">
          Duyduğunu yaz
        </p>
        <div className="flex rounded-lg bg-sage-100 p-0.5">
          {(
            [
              ["word", "Kelime"],
              ["sentence", "Cümle"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => setMode(id)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                mode === id ? "bg-white text-goethe-blue shadow-sm" : "text-sage-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2 flex flex-wrap gap-2">
        {listenSettings ? (
          <CardsPlayButton
            word={word}
            settings={listenSettings}
            mode={mode === "word" ? "word" : "sentence"}
            label={mode === "word" ? "Dinle" : "Cumleyi dinle"}
          />
        ) : (
          <AudioButton
            text={target}
            audioSrc={audioSrc}
            label={mode === "word" ? "Dinle" : "Cümleyi dinle"}
          />
        )}
      </div>

      <textarea
        value={input}
        disabled={disabled}
        onChange={(e) => {
          setInput(e.target.value);
          setChecked(false);
          setResult(null);
        }}
        onKeyDown={handleKeyDown}
        rows={mode === "sentence" ? 3 : 1}
        placeholder={
          mode === "word"
            ? "Duyduğun kelimeyi Almanca yaz…"
            : "Duyduğun cümleyi Almanca yaz…"
        }
        className="w-full resize-none rounded-xl border border-sage-200 bg-white px-4 py-3 text-base text-sage-800 placeholder:text-sage-300 focus:border-goethe-blue focus:outline-none focus:ring-2 focus:ring-goethe-blue/20"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        lang="de"
      />

      {showKeyboardHint && (
        <SmartTip
          id={onCorrect ? "cards-hear-write-enter" : "hear-write-enter"}
          className="mt-2"
        >
          {onCorrect ? (
            <>
              <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
                Enter
              </kbd>{" "}
              = kontrol et · doğruysan sonraki kelime · cümle modunda{" "}
              <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
                Shift+Enter
              </kbd>{" "}
              = yeni satır
            </>
          ) : (
            <>
              <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
                Enter
              </kbd>{" "}
              = kontrol et
              {mode === "sentence" && (
                <>
                  {" "}
                  ·{" "}
                  <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
                    Shift+Enter
                  </kbd>{" "}
                  = yeni satır
                </>
              )}
            </>
          )}
        </SmartTip>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-primary flex-1 sm:flex-none"
          disabled={disabled || !input.trim()}
          onClick={handleCheck}
        >
          Kontrol et
        </button>
        {input && (
          <button
            type="button"
            className="btn-secondary"
            disabled={disabled}
            onClick={() => {
              setInput("");
              setChecked(false);
              setResult(null);
            }}
          >
            Temizle
          </button>
        )}
      </div>

      {checked && result && (
        <div
          className={`mt-3 rounded-xl border px-4 py-3 text-sm ${
            result.ok
              ? "border-sage-300 bg-sage-50 text-sage-700"
              : "border-goethe-red/30 bg-red-50 text-red-900"
          }`}
        >
          {result.ok ? (
            <>
              <p className="font-semibold text-sage-600">Doğru — aferin!</p>
              <p className="mt-1 text-sage-600">
                Yazdığın: <strong>{input.trim()}</strong>
              </p>
              <p className="mt-2 text-xs text-sage-500">
                Bir kez daha yüksek sesle oku — yazdığın kelime daha çok akılda kalır.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold">Henüz tam değil — düzelt ve tekrar dene</p>
              <p className="mt-2">
                Doğrusu: <strong className="text-goethe-blue">{target}</strong>
              </p>
              <p className="mt-1 text-xs opacity-80">
                Benzerlik: %{result.score} · İngilizce klavye OK: u=ü, ss/s/b=ß, ue=ü
              </p>
              {examples[0]?.tr && mode === "sentence" && (
                <p className="mt-2 border-t border-red-200/50 pt-2 text-sage-600">
                  TR: {examples[0].tr}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
