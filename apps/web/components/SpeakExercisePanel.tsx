"use client";

import { useState } from "react";
import { SpeakAudioButton } from "@/components/SpeakAudioButton";
import {
  EXERCISE_TYPE_LABELS,
  hintForExercise,
  type SpeakExercise,
} from "@/lib/speakExercise";
import { formatDailyExerciseLabel, scoreLabelTr } from "@/lib/speakExerciseDaily";
import type { SpeakDailyExercises } from "@/lib/speakExerciseDaily";
import type { ExerciseCheckResponse } from "@/lib/speakExercisePrompts";
import type { HintLevel } from "@/lib/speakHintLevel";
import type { SpeakLevel } from "@/lib/speakTypes";

interface SpeakExercisePanelProps {
  open: boolean;
  level: SpeakLevel;
  exercise: SpeakExercise | null;
  dailyExercises: SpeakDailyExercises;
  hintLevel: HintLevel;
  loading: boolean;
  lastResult: ExerciseCheckResponse | null;
  onClose: () => void;
  onSubmitMcq: (optionId: string) => void;
  onSubmitText: (answer: string) => void;
  onSubmitTrueFalse: (value: boolean) => void;
  onNext: () => void;
}

export function SpeakExercisePanel({
  open,
  level,
  exercise,
  dailyExercises,
  hintLevel,
  loading,
  lastResult,
  onClose,
  onSubmitMcq,
  onSubmitText,
  onSubmitTrueFalse,
  onNext,
}: SpeakExercisePanelProps) {
  const [textAnswer, setTextAnswer] = useState("");
  const [fillAnswer, setFillAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [selectedMcq, setSelectedMcq] = useState<string | null>(null);

  if (!open || !exercise) return null;

  const hints = showHint ? hintForExercise(exercise, hintLevel) : null;
  const doneToday = dailyExercises.completed >= dailyExercises.goal;
  const showResult = Boolean(lastResult) && !loading;

  const resetInputs = () => {
    setTextAnswer("");
    setFillAnswer("");
    setSelectedMcq(null);
    setShowHint(false);
  };

  const handleNext = () => {
    resetInputs();
    onNext();
  };

  return (
    <div className="max-h-[min(42vh,420px)] shrink-0 overflow-y-auto rounded-xl border-2 border-emerald-800/40 bg-[#f4f9f6] shadow-md">
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/80 bg-[#f4f9f6]/95 px-4 py-2 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-goethe-blue px-2 py-0.5 text-[10px] font-bold text-white">
            {level}
          </span>
          <span className="text-xs font-semibold text-emerald-900">Egzersiz alanı</span>
          <span className="text-[10px] text-sage-500">
            {EXERCISE_TYPE_LABELS[exercise.type]} · {exercise.index + 1}/{exercise.total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-sage-600">{formatDailyExerciseLabel(dailyExercises)}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-sage-200 px-2 py-1 text-[10px] text-sage-600 hover:bg-white"
          >
            Kapat
          </button>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {exercise.b1Note && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">{exercise.b1Note}</p>
        )}

        <div className="flex items-start gap-2">
          {exercise.audioText && <SpeakAudioButton text={exercise.audioText} size="sm" />}
          <p className="text-sm font-medium text-goethe-blue">{exercise.promptDe}</p>
        </div>

        {exercise.statementDe && (
          <p className="rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm text-sage-800">
            {exercise.statementDe}
          </p>
        )}

        {exercise.sentenceWithBlank && (
          <p className="font-mono text-base text-goethe-blue">{exercise.sentenceWithBlank}</p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className="rounded-lg border border-sage-200 px-2 py-1 text-xs text-sage-600 hover:bg-white"
          >
            {showHint ? "İpucunu gizle" : "💡 İpucu"}
          </button>
          <span className="self-center text-[10px] text-sage-400">destek {hintLevel}/3</span>
        </div>

        {hints?.turkish && (
          <p className="text-xs italic text-sage-600">Türkçe: {hints.turkish}</p>
        )}
        {hints?.partial && hintLevel >= 2 && (
          <p className="text-xs text-amber-800">{hints.partial}</p>
        )}

        {!showResult && exercise.type === "vocab_mcq" && exercise.options && (
          <div className="grid gap-2 sm:grid-cols-2">
            {exercise.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={loading}
                onClick={() => {
                  setSelectedMcq(opt.id);
                  onSubmitMcq(opt.id);
                }}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                  selectedMcq === opt.id
                    ? "border-goethe-blue bg-goethe-blue/10"
                    : "border-sage-200 bg-white hover:border-goethe-blue/40"
                } disabled:opacity-40`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {!showResult && exercise.type === "true_false" && (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => onSubmitTrueFalse(true)}
              className="flex-1 rounded-lg bg-emerald-700 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Doğru
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => onSubmitTrueFalse(false)}
              className="flex-1 rounded-lg bg-goethe-red py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Yanlış
            </button>
          </div>
        )}

        {!showResult &&
          (exercise.type === "fill_blank" ||
            exercise.type === "short_write" ||
            exercise.type === "speak_prompt") && (
            <div className="space-y-2">
              {exercise.type === "speak_prompt" && (
                <p className="text-xs text-sage-500">
                  Mikrofonla konuş veya yaz — alttaki alana cevabını yaz.
                </p>
              )}
              <input
                type="text"
                value={exercise.type === "fill_blank" ? fillAnswer : textAnswer}
                onChange={(e) =>
                  exercise.type === "fill_blank"
                    ? setFillAnswer(e.target.value)
                    : setTextAnswer(e.target.value)
                }
                placeholder={
                  exercise.type === "fill_blank"
                    ? "Boşluğa kelime…"
                    : exercise.type === "speak_prompt"
                      ? "Konuştuğun cümle…"
                      : "Almanca cümle…"
                }
                disabled={loading}
                className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm text-goethe-blue focus:border-goethe-blue focus:outline-none disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = exercise.type === "fill_blank" ? fillAnswer : textAnswer;
                    if (val.trim()) onSubmitText(val.trim());
                  }
                }}
              />
              <button
                type="button"
                disabled={loading || !(exercise.type === "fill_blank" ? fillAnswer : textAnswer).trim()}
                onClick={() =>
                  onSubmitText(
                    (exercise.type === "fill_blank" ? fillAnswer : textAnswer).trim()
                  )
                }
                className="w-full rounded-lg bg-goethe-blue py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                {loading ? "Profesör kontrol ediyor…" : "Gönder — kontrol ettir"}
              </button>
            </div>
          )}

        {showResult && lastResult && (
          <div className="space-y-2 rounded-lg border border-sage-200 bg-white p-3">
            <p className="text-sm font-semibold text-goethe-blue">
              {scoreLabelTr(lastResult.score)}
              {lastResult.praise ? ` — ${lastResult.praise}` : ""}
            </p>
            <p className="text-sm text-sage-700">{lastResult.boardReply}</p>
            {lastResult.correction && (
              <div className="flex items-start gap-2 border-t border-sage-100 pt-2">
                <SpeakAudioButton text={lastResult.correction} size="sm" />
                <div>
                  <p className="font-medium text-goethe-blue">{lastResult.correction}</p>
                  {lastResult.correctionExplanation && (
                    <p className="text-xs text-sage-500">{lastResult.correctionExplanation}</p>
                  )}
                </div>
              </div>
            )}
            {lastResult.tip && (
              <p className="text-xs text-emerald-800">💡 {lastResult.tip}</p>
            )}
            {!doneToday ? (
              <button
                type="button"
                onClick={handleNext}
                className="w-full rounded-lg bg-emerald-700 py-2 text-sm font-semibold text-white"
              >
                Sonraki egzersiz →
              </button>
            ) : (
              <p className="text-center text-xs font-medium text-emerald-800">
                Bugünkü egzersiz hedefi tamam! Yarın yeni set gelir.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
