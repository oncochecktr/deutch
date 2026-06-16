"use client";

interface TrueFalseQuestionProps {
  index: number;
  total: number;
  statementDe: string;
  statementTr?: string;
  contextDe?: string;
  audioText?: string;
  selected: boolean | null;
  onSelect: (value: boolean) => void;
  maxPlays?: number;
  playCount?: number;
  onPlay?: () => void;
}

export function TrueFalseQuestion({
  index,
  total,
  statementDe,
  statementTr,
  contextDe,
  audioText,
  selected,
  onSelect,
}: TrueFalseQuestionProps) {
  return (
    <div className="card-soft p-4">
      <p className="mb-1 text-xs text-sage-400">
        Aufgabe {index + 1} / {total}
      </p>
      {contextDe && (
        <div className="mb-3 rounded-lg bg-sage-50 p-3 text-center text-sm font-semibold whitespace-pre-line">
          {contextDe}
        </div>
      )}
      {audioText && (
        <p className="mb-2 text-xs text-sage-500 italic">Audio: {audioText.slice(0, 80)}…</p>
      )}
      <p className="mb-1 font-medium text-goethe-blue">{statementDe}</p>
      {statementTr && <p className="mb-3 text-xs text-sage-400">{statementTr}</p>}
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            [true, "Richtig", "Doğru"],
            [false, "Falsch", "Yanlış"],
          ] as const
        ).map(([val, de, tr]) => (
          <button
            key={String(val)}
            type="button"
            onClick={() => onSelect(val)}
            className={`rounded-xl border-2 px-4 py-4 text-center transition ${
              selected === val
                ? "border-goethe-blue bg-goethe-blue/10 font-semibold"
                : "border-sage-200 hover:border-sage-400"
            }`}
          >
            <span className="block text-goethe-blue">{de}</span>
            <span className="text-xs text-sage-500">{tr}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
