"use client";

import { MEKTUP_B1_OVERVIEW, MEKTUP_B1_TEMPLATES } from "@/lib/mektupB1";

export function MektupB1Intro() {
  return (
    <div className="space-y-3">
      <div className="card-soft p-4">
        <p className="text-xs font-semibold text-goethe-blue">{MEKTUP_B1_OVERVIEW.exam}</p>
        <ul className="mt-2 space-y-1 text-sm text-sage-700">
          <li>En az 80 kelime</li>
          <li>4 maddeye tam cevap</li>
          <li>Resmi dil: Sie, Sehr geehrte …</li>
          <li>weil, außerdem, deshalb gibi bağlaçlar</li>
        </ul>
      </div>

      <p className="rounded-lg bg-sage-50 px-3 py-2 text-xs text-sage-600">
        {MEKTUP_B1_OVERVIEW.rule}
      </p>

      <details className="card-soft p-3">
        <summary className="cursor-pointer text-sm font-medium text-goethe-blue">
          Kalıp iskeleti
        </summary>
        <div className="mt-2 space-y-2">
          {Object.values(MEKTUP_B1_TEMPLATES).map((t) => (
            <div key={t.label} className="rounded-lg bg-sage-50 p-2 text-xs text-sage-700">
              <p className="font-medium text-goethe-blue">{t.label}</p>
              <p className="mt-1 font-mono">{t.greeting}</p>
              <p className="font-mono">{t.opening}</p>
              <p className="font-mono text-sage-500">{t.closing[0]}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
