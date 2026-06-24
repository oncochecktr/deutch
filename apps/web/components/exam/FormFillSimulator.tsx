"use client";

import { useState } from "react";
import {
  checkFormAnswer,
  FORM_EXAMPLES,
  FORM_FIELD_GLOSSARY,
  type FormExample,
} from "@/lib/gerceksinavSchreiben";

export function FormFillSimulator({ onBack }: { onBack?: () => void }) {
  const [exampleIdx, setExampleIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

  const example = FORM_EXAMPLES[exampleIdx];

  const score = example.fields.filter((f) => checkFormAnswer(f, answers[f.id] ?? "")).length;

  const reset = (idx: number) => {
    setExampleIdx(idx);
    setAnswers({});
    setChecked(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FORM_EXAMPLES.map((ex, i) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => reset(i)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              i === exampleIdx ? "bg-goethe-blue text-white" : "bg-sage-100 text-sage-600"
            }`}
          >
            {ex.titleTr}
          </button>
        ))}
      </div>

      <FormExampleCard
        example={example}
        answers={answers}
        setAnswers={setAnswers}
        checked={checked}
        score={score}
        showGlossary={showGlossary}
        setShowGlossary={setShowGlossary}
        onCheck={() => setChecked(true)}
        onRetry={() => {
          setAnswers({});
          setChecked(false);
        }}
      />

      {onBack && (
        <button type="button" className="text-sm text-sage-500 underline" onClick={onBack}>
          ← Schreiben rehberine dön
        </button>
      )}
    </div>
  );
}

function FormExampleCard({
  example,
  answers,
  setAnswers,
  checked,
  score,
  showGlossary,
  setShowGlossary,
  onCheck,
  onRetry,
}: {
  example: FormExample;
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  checked: boolean;
  score: number;
  showGlossary: boolean;
  setShowGlossary: (v: boolean) => void;
  onCheck: () => void;
  onRetry: () => void;
}) {
  return (
    <>
      <div className="card-soft border-l-4 border-goethe-blue p-4">
        <p className="text-xs font-semibold uppercase text-sage-400">Teil 1 — Metin (okuyun)</p>
        <p className="mt-2 text-sm leading-relaxed text-sage-800">{example.textDe}</p>
        <p className="mt-2 text-sm text-sage-500">{example.textTr}</p>
      </div>

      <ul className="space-y-1 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
        {example.tips.map((t) => (
          <li key={t}>• {t}</li>
        ))}
      </ul>

      <button
        type="button"
        className="text-xs text-sage-500 underline"
        onClick={() => setShowGlossary(!showGlossary)}
      >
        {showGlossary ? "Sözlüğü gizle" : "Form sözlüğü"}
      </button>
      {showGlossary && (
        <div className="grid gap-1 rounded-xl bg-sage-50 p-3 sm:grid-cols-2">
          {FORM_FIELD_GLOSSARY.map((g) => (
            <p key={g.de} className="text-xs text-sage-600">
              <span className="font-medium text-goethe-blue">{g.de}</span> — {g.tr}
            </p>
          ))}
        </div>
      )}

      <div className="card-soft space-y-3 p-4">
        <p className="text-xs font-semibold uppercase text-sage-400">
          5 boşluk — cevap kağıdına 1 · 2 · 3 · 4 · 5
        </p>
        {example.fields.map((f, i) => {
          const ok = checked ? checkFormAnswer(f, answers[f.id] ?? "") : null;
          return (
            <label key={f.id} className="block">
              <span className="flex items-baseline gap-2 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-goethe-blue text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span>
                  <span className="font-medium text-goethe-blue">{f.labelDe}</span>
                  <span className="text-sage-400"> — {f.labelTr}</span>
                </span>
              </span>
              <p className="ml-8 text-xs text-sage-400">{f.hintTr}</p>
              <input
                className={`ml-8 mt-1 w-[calc(100%-2rem)] rounded-lg border px-3 py-2 text-sm ${
                  ok === true
                    ? "border-sage-400 bg-sage-50"
                    : ok === false
                      ? "border-goethe-red/50 bg-red-50"
                      : "border-sage-200"
                }`}
                value={answers[f.id] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [f.id]: e.target.value }))}
                disabled={checked && ok === true}
              />
              {checked && ok === false && (
                <p className="ml-8 mt-1 text-xs text-sage-600">
                  Örnek cevap: <strong>{f.answer}</strong>
                </p>
              )}
            </label>
          );
        })}
      </div>

      {!checked ? (
        <button type="button" className="btn-primary w-full" onClick={onCheck}>
          Kontrol et
        </button>
      ) : (
        <div className="space-y-2">
          <div
            className={`card-soft p-4 text-center ${score === 5 ? "border-2 border-sage-300" : ""}`}
          >
            <p className="text-2xl font-bold text-goethe-blue">{score}/5</p>
            <p className="text-sm text-sage-500">
              {score === 5
                ? "Form tamam — cevap kağıdına aynen geçir!"
                : "Metni tekrar oku; kein, Ort, kimin bilgisi soruluyor?"}
            </p>
          </div>
          <button type="button" className="btn-secondary w-full" onClick={onRetry}>
            Tekrar dene
          </button>
        </div>
      )}
    </>
  );
}
