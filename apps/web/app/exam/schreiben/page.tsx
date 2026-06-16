"use client";

import { useState } from "react";
import Link from "next/link";
import { getSchreibenTasks } from "@german-coach/exams";
import { ExamModuleShell } from "@/components/exam/ExamModuleShell";
import { useProgress } from "@/lib/ProgressContext";

export default function SchreibenExamPage() {
  const { progress, updateProgress } = useProgress();
  const tasks = getSchreibenTasks();
  const [idx, setIdx] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [showSample, setShowSample] = useState(false);

  const task = tasks[idx];
  if (!task) return null;

  const filledRequired = task.fields
    .filter((f) => f.required)
    .every((f) => (values[f.id] ?? "").trim().length > 0);

  const textField = values.text ?? "";
  const wordCount = textField.trim() ? textField.trim().split(/\s+/).length : 0;
  const wordsOk = task.min_words === 0 || wordCount >= task.min_words;

  return (
    <ExamModuleShell
      title="Teil 3: Schreiben"
      subtitle={`Görev ${idx + 1}/${tasks.length} — ${task.type}`}
    >
      <Link
        href="/exam/schreiben/gercek"
        className="card-soft block border-2 border-goethe-gold/40 p-4 transition hover:border-goethe-gold"
      >
        <p className="text-xs font-semibold text-goethe-gold">gerceksinav.md</p>
        <p className="mt-1 text-sm font-medium text-goethe-blue">
          Gerçek Schreiben — form + mektup kuralları ve simülasyon
        </p>
        <span className="mt-2 inline-block text-xs text-sage-500">Tam rehbere git →</span>
      </Link>

      <Link
        href="/exam/schreiben/mektup"
        className="card-soft block border border-sage-200 p-4 transition hover:border-sage-300"
      >
        <p className="text-xs font-semibold text-sage-600">Mektup modu</p>
        <p className="mt-1 text-sm font-medium text-goethe-blue">5 PDF mektup örneği — adım adım yaz</p>
      </Link>

      <div className="card-soft p-5">
        <p className="font-medium text-goethe-blue">{task.prompt_de}</p>
        <p className="mt-1 text-sm text-sage-400">{task.prompt_tr}</p>
        {task.min_words > 0 && (
          <p className="mt-2 text-xs text-sage-400">
            Mindestens {task.min_words} Wörter · Şu an: {wordCount} kelime
          </p>
        )}
      </div>

      <div className="card-soft space-y-3 p-5">
        {task.fields.map((f) => (
          <label key={f.id} className="block">
            <span className="text-xs text-sage-400">
              {f.label}
              {f.required && " *"}
            </span>
            {f.id === "text" ? (
              <textarea
                className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 text-sm"
                rows={5}
                placeholder={f.placeholder}
                value={values[f.id] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
              />
            ) : (
              <input
                className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 text-sm"
                placeholder={f.placeholder}
                value={values[f.id] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
              />
            )}
          </label>
        ))}
      </div>

      <button
        type="button"
        className="text-sm text-sage-500 underline"
        onClick={() => setShowSample((s) => !s)}
      >
        {showSample ? "Örnek cevabı gizle" : "Örnek cevap göster"}
      </button>
      {showSample && (
        <div className="rounded-xl bg-sage-50 p-4 text-sm italic text-sage-600">
          {task.sample_answer}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          className="btn-primary flex-1"
          disabled={!filledRequired || !wordsOk}
          onClick={() => {
            const isNew = !progress.goethe.schreibenDone.includes(task.id);
            const done = isNew
              ? [...progress.goethe.schreibenDone, task.id]
              : progress.goethe.schreibenDone;
            updateProgress({
              goethe: { ...progress.goethe, schreibenDone: done },
              dailyStats: isNew
                ? {
                    ...progress.dailyStats,
                    schreibenTasks: progress.dailyStats.schreibenTasks + 1,
                  }
                : progress.dailyStats,
            });
            setValues({});
            setShowSample(false);
            if (idx + 1 < tasks.length) setIdx((i) => i + 1);
          }}
        >
          Tamamladım — Weiter
        </button>
        {idx + 1 < tasks.length && (
          <button type="button" className="btn-secondary" onClick={() => setIdx((i) => i + 1)}>
            Atla
          </button>
        )}
      </div>

      <p className="text-center text-xs text-sage-400">
        Tamamlanan: {progress.goethe.schreibenDone.length}/{tasks.length}
      </p>
      <Link href="/exam" className="block text-center text-sm text-sage-500">
        ← Modüllere dön
      </Link>
    </ExamModuleShell>
  );
}
