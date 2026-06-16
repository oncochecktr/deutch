"use client";

import { useState } from "react";
import {
  checkFormAnswer,
  FORM_EXAMPLES,
  type FormExample,
} from "@/lib/gerceksinavSchreiben";
import {
  checkBullet,
  checkStructure,
  countWords,
  MEKTUP_EXAMPLES,
  type MektupExample,
} from "@/lib/mektupRealExam";

interface SchreibenExamFlowProps {
  examMode?: boolean;
  onComplete: (scores: { form: number; letter: number; total: number }) => void;
  formExampleIdx?: number;
  mektupExampleIdx?: number;
}

export function SchreibenExamFlow({
  examMode = false,
  onComplete,
  formExampleIdx = 0,
  mektupExampleIdx = 0,
}: SchreibenExamFlowProps) {
  const [phase, setPhase] = useState<"form" | "letter" | "done">("form");
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const [formChecked, setFormChecked] = useState(false);
  const [letterText, setLetterText] = useState("");
  const [letterChecked, setLetterChecked] = useState(false);
  const [formScore, setFormScore] = useState(0);
  const [letterScore, setLetterScore] = useState(0);

  const formEx = FORM_EXAMPLES[formExampleIdx] ?? FORM_EXAMPLES[0];
  const mektupEx = MEKTUP_EXAMPLES[mektupExampleIdx] ?? MEKTUP_EXAMPLES[0];

  const formErrors = formEx.fields
    .filter((f) => !checkFormAnswer(f, formAnswers[f.id] ?? ""))
    .map((f) => ({
      fieldId: f.id,
      label: f.labelTr,
      message: `Doğru cevap: ${f.answer}`,
    }));

  const checkForm = () => {
    const score = formEx.fields.filter((f) => checkFormAnswer(f, formAnswers[f.id] ?? "")).length;
    setFormScore(score);
    setFormChecked(true);
    if (score === formEx.fields.length) {
      setTimeout(() => setPhase("letter"), 800);
    }
  };

  const checkLetter = () => {
    let score = 0;
    const errors: string[] = [];
    const words = countWords(letterText);
    if (words >= mektupEx.minWords) score += 4;
    else errors.push(`En az ${mektupEx.minWords} kelime gerekli (şu an: ${words})`);

    const structure = checkStructure(letterText);
    if (structure.ok) score += 4;
    else errors.push(`Eksik yapı: ${structure.missing.join(", ")}`);

    let bulletOk = 0;
    for (const b of mektupEx.bullets) {
      if (checkBullet(letterText, b)) bulletOk++;
    }
    score += Math.round((bulletOk / mektupEx.bullets.length) * 12);

    setLetterScore(Math.min(20, score));
    setLetterChecked(true);

    if (score >= 14) {
      onComplete({ form: formScore || formEx.fields.length, letter: Math.min(20, score), total: (formScore || formEx.fields.length) + Math.min(20, score) });
      setPhase("done");
    }
  };

  if (phase === "done") {
    return (
      <div className="card-soft p-6 text-center">
        <p className="text-lg font-bold text-goethe-blue">Schreiben tamamlandı</p>
        <p className="mt-2 text-3xl font-bold text-goethe-gold">
          {formScore + letterScore} / 25
        </p>
        <p className="text-sm text-sage-500">Form {formScore}/5 · Mektup {letterScore}/20</p>
      </div>
    );
  }

  if (phase === "form") {
    return (
      <FormPhase
        example={formEx}
        answers={formAnswers}
        setAnswers={setFormAnswers}
        checked={formChecked}
        errors={formErrors}
        score={formScore}
        examMode={examMode}
        onCheck={checkForm}
        onRetry={() => {
          setFormChecked(false);
        }}
      />
    );
  }

  const letterErrors: string[] = [];
  if (letterChecked) {
    if (countWords(letterText) < mektupEx.minWords) {
      letterErrors.push(`Kelime sayısı yetersiz (${countWords(letterText)}/${mektupEx.minWords})`);
    }
    const st = checkStructure(letterText);
    if (!st.ok) letterErrors.push(`Eksik: ${st.missing.join(", ")}`);
    mektupEx.bullets.forEach((b, i) => {
      if (!checkBullet(letterText, b)) letterErrors.push(`Soru ${i + 1} cevabı eksik`);
    });
  }

  return (
    <div className="space-y-4">
      <div className="card-soft p-4">
        <p className="text-xs uppercase text-sage-400">Teil 2 — Brief</p>
        <p className="mt-2 font-medium text-goethe-blue">{mektupEx.promptDe}</p>
        <p className="text-sm text-sage-500">{mektupEx.promptTr}</p>
        <ul className="mt-3 list-inside list-disc text-sm text-sage-600">
          {mektupEx.bullets.map((b) => (
            <li key={b.de}>{b.tr}</li>
          ))}
        </ul>
      </div>
      <textarea
        className="w-full rounded-xl border border-sage-200 px-4 py-3 text-sm"
        rows={12}
        value={letterText}
        onChange={(e) => setLetterText(e.target.value)}
        placeholder="Mektubunu Almanca yaz…"
        disabled={letterChecked && letterScore >= 14}
      />
      {letterChecked && letterErrors.length > 0 && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-900">
          <p className="font-semibold">Hatalar:</p>
          <ul className="mt-2 list-inside list-disc">
            {letterErrors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      {!letterChecked ? (
        <button type="button" className="btn-primary-lg w-full" onClick={checkLetter}>
          Kontrol et
        </button>
      ) : letterScore < 14 ? (
        <button
          type="button"
          className="btn-primary-lg w-full"
          onClick={() => setLetterChecked(false)}
        >
          Düzelt ve tekrar kontrol et
        </button>
      ) : null}
    </div>
  );
}

function FormPhase({
  example,
  answers,
  setAnswers,
  checked,
  errors,
  score,
  examMode,
  onCheck,
  onRetry,
}: {
  example: FormExample;
  answers: Record<string, string>;
  setAnswers: (a: Record<string, string>) => void;
  checked: boolean;
  errors: { fieldId: string; label: string; message: string }[];
  score: number;
  examMode: boolean;
  onCheck: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="card-soft p-4">
        <p className="text-xs uppercase text-sage-400">Teil 1 — Formular</p>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{example.textDe}</p>
        {!examMode && <p className="mt-2 text-xs text-sage-500">{example.textTr}</p>}
      </div>
      {example.fields.map((f) => {
        const wrong = checked && !checkFormAnswer(f, answers[f.id] ?? "");
        return (
          <label key={f.id} className="block">
            <span className="text-xs text-sage-400">{f.labelDe}</span>
            <input
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${
                wrong ? "border-red-400 bg-red-50" : "border-sage-200"
              }`}
              value={answers[f.id] ?? ""}
              onChange={(e) => setAnswers({ ...answers, [f.id]: e.target.value })}
              disabled={checked && score === example.fields.length}
            />
            {!examMode && <span className="text-[10px] text-sage-400">{f.hintTr}</span>}
          </label>
        );
      })}
      {checked && errors.length > 0 && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-900">
          <p className="font-semibold">Hatalı alanlar:</p>
          <ul className="mt-2 list-inside list-disc">
            {errors.map((e) => (
              <li key={e.fieldId}>
                {e.label}: {examMode ? "Yanlış — düzelt" : e.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {checked && score === example.fields.length && (
        <p className="text-center text-sm font-semibold text-sage-600">Form: {score}/5 — Richtig!</p>
      )}
      {!checked ? (
        <button type="button" className="btn-primary-lg w-full" onClick={onCheck}>
          Kontrol et
        </button>
      ) : score < example.fields.length ? (
        <button type="button" className="btn-secondary w-full" onClick={onRetry}>
          Düzelt ve tekrar kontrol et
        </button>
      ) : null}
    </div>
  );
}
