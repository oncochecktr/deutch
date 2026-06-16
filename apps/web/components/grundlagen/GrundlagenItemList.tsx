"use client";

import { useMemo, useState } from "react";
import { AudioButton } from "@/components/AudioButton";
import type { GrundlagenItem, GrundlagenSection } from "@/lib/grundlagen";
import { isNumericTr, numberToTurkish } from "@/lib/grundlagen";

interface GrundlagenItemListProps {
  sections: GrundlagenSection[];
  showExamples?: boolean;
  /** Sayı kartları: DE büyük, TR Türkçe sayı adı */
  numberMode?: boolean;
}

export function GrundlagenItemList({
  sections,
  showExamples = true,
  numberMode = false,
}: GrundlagenItemListProps) {
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? "");
  const [index, setIndex] = useState(0);
  const [showTr, setShowTr] = useState(false);

  const section = useMemo(
    () => sections.find((s) => s.id === sectionId) ?? sections[0],
    [sections, sectionId]
  );
  const items = section?.items ?? [];
  const item: GrundlagenItem | undefined = items[index];

  const next = () => {
    setShowTr(false);
    setIndex((i) => (i + 1) % Math.max(items.length, 1));
  };

  const prev = () => {
    setShowTr(false);
    setIndex((i) => (i - 1 + items.length) % Math.max(items.length, 1));
  };

  if (!section || !item) return null;

  const digit = isNumericTr(item.tr) ? item.tr : null;
  const trLabel =
    numberMode && digit !== null
      ? numberToTurkish(parseInt(digit, 10))
      : item.tr;

  return (
    <div className="space-y-4">
      {numberMode && (
        <p className="text-sm text-sage-600">
          <strong className="text-goethe-blue">Ezber kartları:</strong> Almanca kelimeyi öğren — dokununca
          rakam + Türkçe görünür.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSectionId(s.id);
              setIndex(0);
              setShowTr(false);
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              s.id === sectionId
                ? "bg-goethe-blue text-white"
                : "bg-sage-100 text-sage-600 hover:bg-sage-200"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="card-soft p-6 text-center">
        <p className="text-xs text-sage-400">
          {section.title} · {index + 1}/{items.length}
        </p>
        <button
          type="button"
          className="mt-4 w-full"
          onClick={() => setShowTr((v) => !v)}
        >
          <p className="text-3xl font-bold text-goethe-blue sm:text-4xl">{item.de}</p>
          {numberMode && digit !== null && !showTr && (
            <p className="mt-2 text-sm text-sage-400">Rakam: {digit}</p>
          )}
          {showTr && (
            <>
              {numberMode && digit !== null && (
                <p className="mt-3 text-lg tabular-nums text-sage-500">Rakam: {digit}</p>
              )}
              <p className="mt-3 text-xl font-semibold text-sage-700 sm:text-2xl">{trLabel}</p>
            </>
          )}
          {!showTr && (
            <p className="mt-3 text-sm text-sage-400">
              {numberMode ? "Türkçe anlam için dokun" : "Anlamı görmek için dokun"}
            </p>
          )}
        </button>
        {showExamples && (item.example_de || item.example_tr) && showTr && (
          <div className="mt-4 rounded-xl bg-sage-50 p-4 text-left text-sm">
            {item.example_de && <p className="italic text-sage-800">{item.example_de}</p>}
            {item.example_tr && (
              <p className="mt-2 text-lg font-medium text-goethe-blue">{item.example_tr}</p>
            )}
          </div>
        )}
        <div className="mt-4 flex justify-center">
          <AudioButton text={item.de.replace(/\?$/, "")} label="Dinle" />
        </div>
      </div>

      <div className="flex gap-2">
        <button type="button" className="btn-secondary-lg flex-1" onClick={prev}>
          Önceki
        </button>
        <button type="button" className="btn-primary-lg flex-1" onClick={next}>
          Sonraki
        </button>
      </div>
    </div>
  );
}
