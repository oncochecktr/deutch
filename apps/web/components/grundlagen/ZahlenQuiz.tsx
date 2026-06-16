"use client";

import { useCallback, useState } from "react";
import { AudioButton } from "@/components/AudioButton";
import { numberToGerman, numberToTurkish } from "@/lib/grundlagen";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ZahlenQuiz() {
  const [num, setNum] = useState(() => randomInt(0, 99));
  const [showAnswer, setShowAnswer] = useState(false);
  const [range, setRange] = useState<"0-20" | "0-99" | "0-999">("0-99");

  const next = useCallback(() => {
    setShowAnswer(false);
    if (range === "0-20") setNum(randomInt(0, 20));
    else if (range === "0-99") setNum(randomInt(0, 99));
    else setNum(randomInt(0, 999));
  }, [range]);

  const answerDe = numberToGerman(num);
  const answerTr = numberToTurkish(num);

  return (
    <div className="card-soft space-y-4 p-5">
      <p className="text-sm text-sage-600">
        <strong className="text-goethe-blue">Alıştırma:</strong> Rakamı gör → Almanca söyle → cevabı kontrol et.
      </p>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["0-20", "0 – 20"],
            ["0-99", "0 – 99"],
            ["0-999", "0 – 999"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setRange(id);
              setShowAnswer(false);
              setNum(randomInt(0, id === "0-20" ? 20 : id === "0-99" ? 99 : 999));
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              range === id ? "bg-goethe-blue text-white" : "bg-sage-100 text-sage-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border-2 border-goethe-blue/15 bg-goethe-blue/5 py-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">
          Bu rakam Almanca nasıl söylenir?
        </p>
        <p className="mt-3 text-6xl font-bold tabular-nums text-goethe-blue">{num}</p>
        {!showAnswer && (
          <p className="mt-3 text-sm text-sage-500">Önce yüksek sesle Almanca söyle, sonra cevaba bak.</p>
        )}

        {showAnswer ? (
          <div className="mx-auto mt-6 max-w-sm rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase text-sage-400">Almanca</p>
            <p className="mt-1 text-2xl font-bold text-goethe-blue">{answerDe}</p>
            <p className="mt-3 text-xs uppercase text-sage-400">Türkçe</p>
            <p className="mt-1 text-xl font-semibold text-sage-700">{answerTr}</p>
            <div className="mt-4 flex justify-center">
              <AudioButton text={answerDe} label="Dinle" />
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn-secondary mt-6"
            onClick={() => setShowAnswer(true)}
          >
            Almanca cevabı göster
          </button>
        )}
      </div>

      <button type="button" className="btn-primary-lg w-full" onClick={next}>
        Sonraki rakam
      </button>
    </div>
  );
}
