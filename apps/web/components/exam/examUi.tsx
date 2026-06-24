"use client";

import type { ReactNode } from "react";

/** Soru numarası — TR öncelikli, Almanca parantezde */
export function ExamQuestionMeta({
  index,
  total,
  tag,
}: {
  index: number;
  total: number;
  tag?: string;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm font-semibold text-goethe-blue">
        Soru {index + 1}
        <span className="font-normal text-sage-500"> / {total}</span>
        <span className="ml-1.5 hidden text-xs font-normal text-sage-400 sm:inline">
          (Aufgabe {index + 1})
        </span>
      </p>
      {tag ? (
        <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[11px] font-medium text-sage-600">
          {tag}
        </span>
      ) : null}
    </div>
  );
}

/** Bölüm ilerleme çubuğu */
export function ExamProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="mb-4" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
      <div className="mb-1.5 flex justify-between text-xs font-medium text-sage-600">
        <span>İlerleme</span>
        <span>
          {current}/{total} · %{pct}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-sage-100">
        <div
          className="h-full rounded-full bg-goethe-blue transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Seçim onayı — Sonraki’ye basmadan önce ne işaretlediğini gösterir */
export function ExamAnswerBar({ children }: { children: ReactNode }) {
  return (
    <div className="exam-answer-bar rounded-xl border border-goethe-blue/25 bg-goethe-blue/5 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-sage-500">Seçimin kaydedildi</p>
      <div className="mt-1 text-base font-medium text-goethe-blue">{children}</div>
    </div>
  );
}

export function ExamInstructionBanner({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-sage-100 bg-sage-50 px-4 py-3 text-sm leading-relaxed text-sage-700">
      {children}
    </p>
  );
}

/** Soru geçiş animasyonu */
export function ExamQuestionSlide({ qKey, children }: { qKey: string | number; children: ReactNode }) {
  return (
    <div key={qKey} className="content-transition content-transition-forward space-y-4">
      {children}
    </div>
  );
}

export function ExamAdvanceButton({
  disabled,
  onClick,
  label = "Sonraki soru",
}: {
  disabled: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      className="btn-primary w-full py-3.5 text-base font-semibold disabled:opacity-40"
      disabled={disabled}
      onClick={onClick}
    >
      {label} →
    </button>
  );
}

export function ExamEvaluateButton({
  disabled,
  onClick,
  answered,
  total,
}: {
  disabled: boolean;
  onClick: () => void;
  answered: number;
  total: number;
}) {
  return (
    <div className="space-y-2">
      <p className="text-center text-sm text-sage-600">
        {answered}/{total} soru işaretlendi
        {disabled ? " — hepsini işaretle" : " — değerlendirmeye hazır"}
      </p>
      <button
        type="button"
        className="btn-primary w-full py-3.5 text-base font-semibold disabled:opacity-40"
        disabled={disabled}
        onClick={onClick}
      >
        Değerlendir — Auswerten
      </button>
    </div>
  );
}

/** R/F sorularında statement_tr çoğu zaman Almanca kopya — anlamlı TR ipucu üret */
export function trueFalseHint(statementDe: string, statementTr?: string, hasContext?: boolean): string {
  if (statementTr && statementTr.trim() !== statementDe.trim()) return statementTr;
  if (hasContext) return "Tabelaya / metne göre bu cümle doğru mu?";
  return "Bu cümle doğru mu?";
}
