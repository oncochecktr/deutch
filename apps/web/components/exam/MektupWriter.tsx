"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { useProgress } from "@/lib/ProgressContext";
import {
  MEKTUP_PUNCTUATION_RULES,
  MEKTUP_TEMPLATES,
  SCHREIBEN_GOLDEN_RULES,
  SCHREIBEN_OVERVIEW,
} from "@/lib/gerceksinavSchreiben";
import {
  buildFullLetter,
  checkBullet,
  checkStructure,
  countWords,
  MEKTUP_EXAMPLES,
  type MektupExample,
} from "@/lib/mektupRealExam";

type Phase = "intro" | "pick" | "write" | "done";

const STORAGE_KEY = "german-coach-mektup-done";

function loadDone(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function MektupWriter() {
  return (
    <PageShell
      title="Mektup Yazma"
      subtitle="A1 Schreiben"
      backHref="/exam/schreiben"
      backLabel="Schreiben modülüne dön"
      maxWidth="md"
    >
      <MektupWriterInner />
      <Link href="/exam" className="block text-center text-sm text-sage-400">
        ← Tüm modüller
      </Link>
    </PageShell>
  );
}

export function MektupWriterInner({
  embedded = false,
  onBack,
}: {
  embedded?: boolean;
  onBack?: () => void;
}) {
  const { progress, updateProgress } = useProgress();
  const [phase, setPhase] = useState<Phase>(embedded ? "pick" : "intro");
  const [exampleIdx, setExampleIdx] = useState(0);
  const [parts, setParts] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<string>("anrede");
  const [showSample, setShowSample] = useState(false);
  const [doneIds, setDoneIds] = useState<string[]>(() => loadDone());

  const example = MEKTUP_EXAMPLES[exampleIdx];
  const fullLetter = useMemo(
    () => (example ? buildFullLetter(example, parts) : ""),
    [example, parts]
  );
  const wordCount = countWords(fullLetter);
  const structure = checkStructure(fullLetter);
  const bulletsOk = example
    ? example.bullets.every((b) => checkBullet(fullLetter, b))
    : false;
  const sectionsFilled = example
    ? example.sections.every((s) => (parts[s.id] ?? "").trim().length > 0)
    : false;
  const canComplete =
    sectionsFilled && wordCount >= example.minWords && structure.ok && bulletsOk;

  const startExample = (idx: number) => {
    const ex = MEKTUP_EXAMPLES[idx];
    setExampleIdx(idx);
    setParts({});
    setActiveSection(ex.sections[0]?.id ?? "anrede");
    setShowSample(false);
    setPhase("write");
  };

  const insertPhrase = (phrase: string) => {
    const sec = activeSection;
    setParts((prev) => {
      const cur = (prev[sec] ?? "").trim();
      const next = cur ? `${cur}\n${phrase}` : phrase;
      return { ...prev, [sec]: next };
    });
  };

  const markComplete = () => {
    if (!example || !canComplete) return;
    const isNew = !doneIds.includes(example.id);
    const nextDone = isNew ? [...doneIds, example.id] : doneIds;
    setDoneIds(nextDone);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDone));
    if (isNew) {
      updateProgress({
        dailyStats: {
          ...progress.dailyStats,
          schreibenTasks: progress.dailyStats.schreibenTasks + 1,
        },
      });
    }
    setPhase("done");
  };

  return (
    <>
      {phase === "intro" && (
        <div className="space-y-4">
          <div className="card-soft border-2 border-goethe-gold/40 p-5">
            <p className="text-sm text-sage-600">
              Schreiben <strong>{SCHREIBEN_OVERVIEW.duration}</strong> — form (5 puan) + mektup (
              <strong>20 puan</strong>, ~30+ kelime). 5 örnekle
              adım adım yaz.
            </p>
            <p className="mt-2 text-xs font-medium text-goethe-red">{SCHREIBEN_OVERVIEW.warning}</p>
          </div>

          <section className="card-soft p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase text-sage-400">Teil 2 kuralları</h2>
            <ul className="space-y-2">
              {SCHREIBEN_GOLDEN_RULES.filter((r) =>
                ["Mektup noktalama", "Artikel affetilir", "Cevap kağıdına geçir"].includes(r.title)
              ).map((r) => (
                <li key={r.title} className="text-sm">
                  <span className="font-semibold text-goethe-blue">{r.title}:</span>{" "}
                  <span className="text-sage-600">{r.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card-soft p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase text-sage-400">Ezber kalıpları</h2>
            {Object.entries(MEKTUP_TEMPLATES).map(([key, t]) => (
              <div key={key} className="mb-2 rounded-lg bg-sage-50 p-2 text-xs last:mb-0">
                <p className="font-semibold text-goethe-blue">{t.label}</p>
                <p className="font-mono text-sage-700">{t.greeting}</p>
                <p className="font-mono text-sage-600">{t.deshalb}</p>
              </div>
            ))}
          </section>

          <ul className="list-inside list-disc space-y-1 rounded-xl bg-sage-50 p-3 text-xs text-sage-600">
            {MEKTUP_PUNCTUATION_RULES.slice(0, 4).map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <button type="button" className="btn-primary-lg w-full" onClick={() => setPhase("pick")}>
            Örneklere git — mektup yaz
          </button>
        </div>
      )}

      {phase === "pick" && (
        <div className="space-y-3">
          <p className="text-sm text-sage-500">
            Tamamlanan: {doneIds.length}/{MEKTUP_EXAMPLES.length}
          </p>
          {MEKTUP_EXAMPLES.map((ex, i) => (
            <button
              key={ex.id}
              type="button"
              className="card-soft w-full p-4 text-left transition hover:border-sage-300"
              onClick={() => startExample(i)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-sage-400">Beispiel {i + 1}</p>
                  <p className="font-semibold text-goethe-blue">{ex.titleTr}</p>
                  <p className="mt-1 text-xs text-sage-500">{ex.promptTr}</p>
                </div>
                {doneIds.includes(ex.id) && (
                  <span className="shrink-0 rounded-full bg-sage-100 px-2 py-0.5 text-[10px] text-sage-600">
                    ✓
                  </span>
                )}
              </div>
            </button>
          ))}
          {!embedded && (
            <button type="button" className="text-sm text-sage-500 underline" onClick={() => setPhase("intro")}>
              ← Kurallara dön
            </button>
          )}
          {embedded && onBack && (
            <button type="button" className="text-sm text-sage-500 underline" onClick={onBack}>
              ← Schreiben rehberine dön
            </button>
          )}
        </div>
      )}

      {phase === "write" && example && (
        <WritePhase
          example={example}
          exampleIdx={exampleIdx}
          parts={parts}
          setParts={setParts}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          insertPhrase={insertPhrase}
          fullLetter={fullLetter}
          wordCount={wordCount}
          structure={structure}
          bulletsOk={bulletsOk}
          canComplete={canComplete}
          showSample={showSample}
          setShowSample={setShowSample}
          onBack={() => setPhase("pick")}
          onComplete={markComplete}
        />
      )}

      {phase === "done" && example && (
        <div className="space-y-4">
          <div className="card-soft border-2 border-sage-200 p-5 text-center">
            <p className="text-2xl">✓</p>
            <p className="mt-2 font-bold text-goethe-blue">Mektup tamam!</p>
            <p className="mt-1 text-sm text-sage-500">{example.titleTr}</p>
          </div>

          <div className="card-soft p-4">
            <p className="text-xs font-semibold uppercase text-sage-400">Senin mektubun</p>
            <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed text-sage-700">
              {fullLetter}
            </pre>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary flex-1" onClick={() => setPhase("pick")}>
              Başka örnek
            </button>
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={() => {
                setParts({});
                setPhase("write");
              }}
            >
              Aynısını tekrar yaz
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function WritePhase({
  example,
  exampleIdx,
  parts,
  setParts,
  activeSection,
  setActiveSection,
  insertPhrase,
  fullLetter,
  wordCount,
  structure,
  bulletsOk,
  canComplete,
  showSample,
  setShowSample,
  onBack,
  onComplete,
}: {
  example: MektupExample;
  exampleIdx: number;
  parts: Record<string, string>;
  setParts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  activeSection: string;
  setActiveSection: (id: string) => void;
  insertPhrase: (p: string) => void;
  fullLetter: string;
  wordCount: number;
  structure: { ok: boolean; missing: string[] };
  bulletsOk: boolean;
  canComplete: boolean;
  showSample: boolean;
  setShowSample: (v: boolean) => void;
  onBack: () => void;
  onComplete: () => void;
}) {
  const section = example.sections.find((s) => s.id === activeSection) ?? example.sections[0];

  return (
    <div className="space-y-4">
      <div className="card-soft p-4">
        <p className="text-xs text-sage-400">Beispiel {exampleIdx + 1}</p>
        <p className="mt-1 font-medium text-goethe-blue">{example.promptDe}</p>
        <p className="mt-2 text-sm text-sage-500">{example.promptTr}</p>
        <ul className="mt-3 space-y-1">
          {example.bullets.map((b) => {
            const ok = checkBullet(fullLetter, b);
            return (
              <li key={b.de} className="flex items-start gap-2 text-sm">
                <span className={ok ? "text-sage-600" : "text-sage-300"}>{ok ? "✓" : "○"}</span>
                <span>
                  <span className="text-sage-700">{b.de}</span>
                  <span className="text-sage-400"> — {b.tr}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap gap-1">
        {example.sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            className={`rounded-lg px-2 py-1 text-xs font-medium transition ${
              activeSection === s.id
                ? "bg-goethe-blue text-white"
                : (parts[s.id] ?? "").trim()
                  ? "bg-sage-100 text-sage-700"
                  : "bg-white text-sage-400 ring-1 ring-sage-200"
            }`}
          >
            {s.labelTr}
          </button>
        ))}
      </div>

      {section && (
        <div className="card-soft p-4">
          <p className="text-xs font-semibold uppercase text-sage-400">
            {section.labelDe} · {section.labelTr}
          </p>
          <p className="mt-1 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            💡 {section.hintTr}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {section.phrases.map((p) => (
              <button
                key={p.de}
                type="button"
                title={p.tr}
                className="rounded-lg border border-sage-200 bg-white px-2 py-1 text-left text-xs text-goethe-blue hover:bg-sage-50"
                onClick={() => insertPhrase(p.de)}
              >
                + {p.de}
              </button>
            ))}
          </div>

          <textarea
            className="mt-3 w-full rounded-xl border border-sage-200 px-3 py-3 text-sm leading-relaxed"
            rows={4}
            placeholder={section.placeholder}
            value={parts[section.id] ?? ""}
            onChange={(e) => setParts((prev) => ({ ...prev, [section.id]: e.target.value }))}
            onFocus={() => setActiveSection(section.id)}
          />
        </div>
      )}

      <div className="card-soft p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase text-sage-400">Tam mektup önizleme</p>
          <p className={`text-xs ${wordCount >= 30 ? "text-sage-600" : "text-amber-700"}`}>
            {wordCount} kelime {wordCount < 30 ? "(hedef: ≥30)" : "✓"}
          </p>
        </div>
        <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg bg-sage-50 p-3 text-sm leading-relaxed text-sage-700">
          {fullLetter || "(Henüz boş — yukarıdaki bölümleri doldur)"}
        </pre>

        {!structure.ok && fullLetter.trim() && (
          <p className="mt-2 text-xs text-goethe-red">
            Eksik kalıp: {structure.missing.join(", ")}
          </p>
        )}
        {structure.ok && !bulletsOk && (
          <p className="mt-2 text-xs text-amber-700">
            Madde işaretli 3 sorunun hepsine cevap ver (yukarıdaki ✓ listesine bak).
          </p>
        )}
      </div>

      <button
        type="button"
        className="text-sm text-sage-500 underline"
        onClick={() => setShowSample(!showSample)}
      >
        {showSample ? "Örnek mektubu gizle" : "PDF örnek mektubu göster"}
      </button>
      {showSample && (
        <div className="rounded-xl border border-goethe-gold/30 bg-goethe-gold/5 p-4">
          <p className="text-xs font-semibold text-goethe-blue">Örnek cevap (PDF)</p>
          <pre className="mt-2 whitespace-pre-wrap text-sm italic text-sage-600">
            {example.sampleLetter}
          </pre>
        </div>
      )}

      <div className="flex gap-2">
        <button type="button" className="btn-secondary" onClick={onBack}>
          Liste
        </button>
        <button
          type="button"
          className="btn-primary flex-1"
          disabled={!canComplete}
          onClick={onComplete}
        >
          Mektubu bitir
        </button>
      </div>
    </div>
  );
}
