"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { MektupAddScenario } from "@/components/exam/MektupAddScenario";
import { MektupB1Intro } from "@/components/exam/MektupB1Intro";
import { MektupB1RubricPanel } from "@/components/exam/MektupB1RubricPanel";
import { MektupLevelTabs } from "@/components/exam/MektupLevelTabs";
import { MektupTemplateList } from "@/components/exam/MektupTemplateList";
import { useProgress } from "@/lib/ProgressContext";
import {
  MEKTUP_PUNCTUATION_RULES,
  SCHREIBEN_GOLDEN_RULES,
  SCHREIBEN_OVERVIEW,
} from "@/lib/gerceksinavSchreiben";
import { MEKTUP_B1_CONNECTORS, MEKTUP_B1_PHRASE_BANK } from "@/lib/mektupB1";
import {
  buildFullLetter,
  checkBullet,
  checkStructureForLevel,
  countWords,
  getBuiltinMektupExamples,
  getMektupExamples,
  type MektupExample,
  type MektupLevel,
} from "@/lib/mektupIndex";
import {
  loadDoneIds,
  loadDraft,
  loadSavedLetters,
  removeCustomScenario,
  removeSavedLetter,
  saveDoneIds,
  saveDraft,
  saveLetter,
  type MektupSavedLetter,
} from "@/lib/mektupStorage";

type Phase = "intro" | "pick" | "write" | "done" | "viewSaved";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function MektupWriter() {
  return (
    <PageShell
      title="Mektup Yazma"
      subtitle="Goethe A1 ve B1"
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
  const [level, setLevel] = useState<MektupLevel>("B1");
  const [phase, setPhase] = useState<Phase>(embedded ? "pick" : "intro");
  const [exampleIdx, setExampleIdx] = useState(0);
  const [parts, setParts] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<string>("anrede");
  const [showSample, setShowSample] = useState(false);
  const [listVersion, setListVersion] = useState(0);
  const [showAddScenario, setShowAddScenario] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [viewingSaved, setViewingSaved] = useState<MektupSavedLetter | null>(null);

  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [savedLetters, setSavedLetters] = useState<MektupSavedLetter[]>([]);

  const examples = useMemo(
    () => getMektupExamples(level),
    [level, listVersion]
  );
  const example = examples[exampleIdx];

  const fullLetter = useMemo(
    () => (example ? buildFullLetter(example, parts) : ""),
    [example, parts]
  );
  const wordCount = countWords(fullLetter);
  const structure = example
    ? checkStructureForLevel(fullLetter, level, example.minWords)
    : { ok: false, missing: [] };
  const bulletsOk = example
    ? example.bullets.every((b) => checkBullet(fullLetter, b))
    : false;
  const sectionsFilled = example
    ? example.sections.every((s) => (parts[s.id] ?? "").trim().length > 0)
    : false;
  const canComplete =
    sectionsFilled &&
    wordCount >= example.minWords &&
    structure.ok &&
    bulletsOk;

  const refreshLists = useCallback(() => {
    setDoneIds(loadDoneIds(level));
    setSavedLetters(loadSavedLetters(level));
    setListVersion((v) => v + 1);
  }, [level]);

  useEffect(() => {
    refreshLists();
  }, [refreshLists]);

  const switchLevel = (next: MektupLevel) => {
    setLevel(next);
    setExampleIdx(0);
    setParts({});
    setPhase(embedded ? "pick" : "intro");
    setShowAddScenario(false);
    setViewingSaved(null);
  };

  useEffect(() => {
    if (phase !== "write" || !example) return;
    const t = window.setTimeout(() => {
      saveDraft(level, example.id, parts);
      setDraftSavedAt(new Date().toISOString());
    }, 600);
    return () => window.clearTimeout(t);
  }, [parts, phase, example, level]);

  const startExample = (idx: number) => {
    const ex = examples[idx];
    if (!ex) return;
    const draft = loadDraft(level, ex.id);
    setExampleIdx(idx);
    setParts(draft?.parts ?? {});
    setDraftSavedAt(draft?.updatedAt ?? null);
    setActiveSection(ex.sections[0]?.id ?? "anrede");
    setShowSample(false);
    setViewingSaved(null);
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

  const persistLetter = () => {
    if (!example || !fullLetter.trim()) return;
    saveLetter(level, {
      exampleId: example.id,
      titleTr: example.titleTr,
      fullLetter,
      wordCount,
    });
    refreshLists();
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  };

  const markComplete = () => {
    if (!example || !canComplete) return;
    persistLetter();
    const isNew = !doneIds.includes(example.id);
    const nextDone = isNew ? [...doneIds, example.id] : doneIds;
    setDoneIds(nextDone);
    saveDoneIds(level, nextDone);
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

  const onScenarioAdded = (id: string) => {
    setShowAddScenario(false);
    refreshLists();
    const all = getMektupExamples(level);
    const idx = all.findIndex((e) => e.id === id);
    if (idx >= 0) startExample(idx);
    else setPhase("pick");
  };

  if (phase === "viewSaved" && viewingSaved) {
    return (
      <>
        <div className="mb-4">
          <MektupLevelTabs level={level} onChange={switchLevel} />
        </div>
        <div className="space-y-4">
          <div className="card-soft p-4">
            <p className="text-xs text-sage-400">{formatDate(viewingSaved.savedAt)}</p>
            <p className="font-semibold text-goethe-blue">{viewingSaved.titleTr}</p>
            <p className="mt-1 text-xs text-sage-500">{viewingSaved.wordCount} kelime</p>
            <pre className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-sage-700">
              {viewingSaved.fullLetter}
            </pre>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={() => {
                setViewingSaved(null);
                setPhase("pick");
              }}
            >
              Listeye dön
            </button>
            <button
              type="button"
              className="text-sm text-goethe-red underline"
              onClick={() => {
                removeSavedLetter(level, viewingSaved.id);
                refreshLists();
                setViewingSaved(null);
                setPhase("pick");
              }}
            >
              Sil
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-4">
        <MektupLevelTabs level={level} onChange={switchLevel} />
      </div>

      {phase === "intro" && (
        <div className="space-y-4">
          {level === "B1" ? (
            <MektupB1Intro />
          ) : (
            <>
              <div className="card-soft p-4">
                <p className="text-sm text-sage-600">
                  Form + mektup (~30 kelime, 20 puan). 5 hazır örnek var; kendi senaryonu da ekleyebilirsin.
                </p>
                <p className="mt-2 text-xs text-goethe-red">{SCHREIBEN_OVERVIEW.warning}</p>
              </div>
              <section className="card-soft p-4">
                <h2 className="mb-2 text-xs font-semibold uppercase text-sage-400">Kurallar</h2>
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
              <MektupTemplateList />
              <ul className="list-inside list-disc space-y-1 rounded-xl bg-sage-50 p-3 text-xs text-sage-600">
                {MEKTUP_PUNCTUATION_RULES.slice(0, 4).map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </>
          )}
          <button type="button" className="btn-primary-lg w-full" onClick={() => setPhase("pick")}>
            Örnekleri aç
          </button>
        </div>
      )}

      {phase === "pick" && (
        <div className="space-y-3">
          <p className="text-sm text-sage-500">
            Tamamlanan: {doneIds.length}/{examples.length}
            {level === "B1" && <span className="text-sage-400"> · min. 80 kelime</span>}
          </p>

          {showAddScenario ? (
            <MektupAddScenario
              level={level}
              onAdded={onScenarioAdded}
              onCancel={() => setShowAddScenario(false)}
            />
          ) : (
            <button
              type="button"
              className="w-full rounded-xl border-2 border-dashed border-goethe-gold/50 py-3 text-sm font-medium text-goethe-blue hover:bg-goethe-gold/5"
              onClick={() => setShowAddScenario(true)}
            >
              + Kendi senaryonu ekle
            </button>
          )}

          {getBuiltinMektupExamples(level).map((ex, i) => (
            <ExampleCard
              key={ex.id}
              ex={ex}
              index={i}
              level={level}
              done={doneIds.includes(ex.id)}
              hasDraft={!!loadDraft(level, ex.id)}
              onClick={() => startExample(i)}
            />
          ))}

          {examples.length > getBuiltinMektupExamples(level).length && (
            <>
              <p className="pt-2 text-xs font-semibold uppercase text-sage-400">Senaryolarım</p>
              {examples
                .filter((ex) => ex.id.startsWith("custom_"))
                .map((ex) => {
                  const i = examples.indexOf(ex);
                  return (
                    <ExampleCard
                      key={ex.id}
                      ex={ex}
                      index={i}
                      level={level}
                      done={doneIds.includes(ex.id)}
                      hasDraft={!!loadDraft(level, ex.id)}
                      custom
                      onDelete={() => {
                        removeCustomScenario(level, ex.id);
                        refreshLists();
                      }}
                      onClick={() => startExample(i)}
                    />
                  );
                })}
            </>
          )}

          {savedLetters.length > 0 && (
            <section className="pt-2">
              <p className="text-xs font-semibold uppercase text-sage-400">
                Kayıtlı mektuplar ({savedLetters.length})
              </p>
              <div className="mt-2 space-y-2">
                {savedLetters.slice(0, 8).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="card-soft w-full p-3 text-left text-sm hover:border-goethe-gold/40"
                    onClick={() => {
                      setViewingSaved(s);
                      setPhase("viewSaved");
                    }}
                  >
                    <span className="font-medium text-goethe-blue">{s.titleTr}</span>
                    <span className="ml-2 text-xs text-sage-400">
                      {s.wordCount} kel. · {formatDate(s.savedAt)}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

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
          level={level}
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
          draftSavedAt={draftSavedAt}
          savedFlash={savedFlash}
          onSave={persistLetter}
          onBack={() => setPhase("pick")}
          onComplete={markComplete}
        />
      )}

      {phase === "done" && example && (
        <div className="space-y-4">
          <div className="card-soft border-2 border-sage-200 p-5 text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-sage-500">Tamamlandı</p>
            <p className="mt-2 font-bold text-goethe-blue">Goethe {level}</p>
            <p className="mt-1 text-sm text-sage-500">{example.titleTr}</p>
            <p className="mt-2 text-xs tabular-nums text-sage-400">{wordCount} kelime · kaydedildi</p>
          </div>

          {level === "B1" && (
            <MektupB1RubricPanel text={fullLetter} bulletsOk={bulletsOk} minWords={example.minWords} />
          )}

          <div className="card-soft p-4">
            <p className="text-xs font-semibold uppercase text-sage-400">Mektubun</p>
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
              Tekrar yaz
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ExampleCard({
  ex,
  index,
  level,
  done,
  hasDraft,
  custom,
  onClick,
  onDelete,
}: {
  ex: MektupExample;
  index: number;
  level: MektupLevel;
  done: boolean;
  hasDraft: boolean;
  custom?: boolean;
  onClick: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="card-soft flex items-start gap-2 p-4">
      <button type="button" className="min-w-0 flex-1 text-left transition hover:opacity-90" onClick={onClick}>
        <p className="text-xs text-sage-400">
          {custom ? "Senaryom" : `Örnek ${index + 1}`} · {level}
          {ex.register === "formal" ? " · resmi" : ""}
        </p>
        <p className="font-semibold text-goethe-blue">{ex.titleTr}</p>
        <p className="mt-1 text-xs text-sage-500 line-clamp-2">{ex.promptTr}</p>
        <p className="mt-1 text-[10px] text-sage-400">min. {ex.minWords} kelime</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {done && (
            <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold text-sage-600">
              Tamam
            </span>
          )}
          {hasDraft && !done && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              Taslak var
            </span>
          )}
        </div>
      </button>
      {custom && onDelete && (
        <button
          type="button"
          className="shrink-0 text-xs text-sage-400 hover:text-goethe-red"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Senaryoyu sil"
        >
          Sil
        </button>
      )}
    </div>
  );
}

function WritePhase({
  level,
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
  draftSavedAt,
  savedFlash,
  onSave,
  onBack,
  onComplete,
}: {
  level: MektupLevel;
  example: MektupExample;
  exampleIdx: number;
  parts: Record<string, string>;
  setParts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  activeSection: string;
  setActiveSection: (id: string) => void;
  insertPhrase: (p: string) => void;
  fullLetter: string;
  wordCount: number;
  structure: { ok: boolean; missing: string[]; hints?: string[] };
  bulletsOk: boolean;
  canComplete: boolean;
  showSample: boolean;
  setShowSample: (v: boolean) => void;
  draftSavedAt: string | null;
  savedFlash: boolean;
  onSave: () => void;
  onBack: () => void;
  onComplete: () => void;
}) {
  const section = example.sections.find((s) => s.id === activeSection) ?? example.sections[0];
  const wordOk = wordCount >= example.minWords;
  const wordWarn = example.maxWords && wordCount > example.maxWords;
  const hasSample = example.sampleLetter.trim().length > 0;

  return (
    <div className="space-y-4">
      {level === "B1" && (
        <MektupB1RubricPanel text={fullLetter} bulletsOk={bulletsOk} minWords={example.minWords} />
      )}

      <div className="flex items-center justify-between gap-2 text-xs text-sage-400">
        <span>
          {draftSavedAt ? `Taslak kaydedildi · ${formatDate(draftSavedAt)}` : "Taslak otomatik kaydedilir"}
        </span>
        {savedFlash && <span className="font-medium text-sage-600">Mektup kaydedildi</span>}
      </div>

      <div className="card-soft p-4">
        <p className="text-xs text-sage-400">Örnek {exampleIdx + 1}</p>
        <p className="mt-1 font-medium text-goethe-blue">{example.promptDe}</p>
        <p className="mt-2 text-sm text-sage-500">{example.promptTr}</p>
        <ul className="mt-3 space-y-1">
          {example.bullets.map((b) => {
            const ok = checkBullet(fullLetter, b);
            return (
              <li key={b.de} className="flex items-start gap-2 text-sm">
                <span className={ok ? "font-semibold text-sage-600" : "text-sage-300"}>
                  {ok ? "Tamam" : "—"}
                </span>
                <span>
                  <span className="text-sage-700">{b.de}</span>
                  <span className="text-sage-400"> — {b.tr}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {level === "B1" && (
        <details className="card-soft p-3">
          <summary className="cursor-pointer text-xs font-semibold text-goethe-blue">
            Hazır cümleler
          </summary>
          <div className="mt-2 flex flex-wrap gap-1">
            {MEKTUP_B1_PHRASE_BANK.slice(0, 6).map((p) => (
              <button
                key={p.de}
                type="button"
                title={p.tr}
                className="rounded-lg border border-sage-200 bg-white px-2 py-1 text-[10px] text-goethe-blue hover:bg-sage-50"
                onClick={() => insertPhrase(p.de)}
              >
                + {p.de.slice(0, 28)}
                {p.de.length > 28 ? "…" : ""}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-sage-400">Bağlaçlar:</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {MEKTUP_B1_CONNECTORS.map((c) => (
              <button
                key={c.de}
                type="button"
                title={c.tr}
                className="rounded-full bg-goethe-blue/10 px-2 py-0.5 text-[10px] text-goethe-blue"
                onClick={() => insertPhrase(`${c.de.split("/")[0]!.trim()} `)}
              >
                {c.de}
              </button>
            ))}
          </div>
        </details>
      )}

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
            <span className="text-xs font-semibold text-goethe-blue">İpucu: </span>
            {section.hintTr}
          </p>

          {section.phrases.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {section.phrases.map((p) => (
                <button
                  key={p.de}
                  type="button"
                  title={p.tr}
                  className="rounded-lg border border-sage-200 bg-white px-2 py-1 text-left text-xs text-goethe-blue hover:bg-sage-50"
                  onClick={() => insertPhrase(p.de)}
                >
                  + {p.de.length > 42 ? `${p.de.slice(0, 42)}…` : p.de}
                </button>
              ))}
            </div>
          )}

          <textarea
            className="mt-3 w-full rounded-xl border border-sage-200 px-3 py-3 text-sm leading-relaxed"
            rows={level === "B1" ? 5 : 4}
            placeholder={section.placeholder}
            value={parts[section.id] ?? ""}
            onChange={(e) => setParts((prev) => ({ ...prev, [section.id]: e.target.value }))}
            onFocus={() => setActiveSection(section.id)}
          />
        </div>
      )}

      <div className="card-soft p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase text-sage-400">Önizleme</p>
          <p
            className={`text-xs tabular-nums ${
              wordWarn ? "text-amber-700" : wordOk ? "text-sage-600" : "text-goethe-red"
            }`}
          >
            {wordCount} kelime
            {!wordOk && ` (min ${example.minWords})`}
            {wordWarn && ` · uzun (≤${example.maxWords} ideal)`}
          </p>
        </div>
        <pre className="mt-2 max-h-56 overflow-y-auto whitespace-pre-wrap rounded-lg bg-sage-50 p-3 text-sm leading-relaxed text-sage-700">
          {fullLetter || "(Henüz boş)"}
        </pre>

        {!structure.ok && fullLetter.trim() && (
          <p className="mt-2 text-xs text-goethe-red">Eksik: {structure.missing.join(" · ")}</p>
        )}
        {structure.hints && structure.hints.length > 0 && (
          <ul className="mt-2 list-inside list-disc text-xs text-sage-500">
            {structure.hints.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        {structure.ok && !bulletsOk && (
          <p className="mt-2 text-xs text-amber-700">Madde işaretli soruların hepsine cevap ver.</p>
        )}
      </div>

      {hasSample && (
        <>
          <button
            type="button"
            className="text-sm text-sage-500 underline"
            onClick={() => setShowSample(!showSample)}
          >
            {showSample ? "Model cevabı gizle" : "Model cevabı göster"}
          </button>
          {showSample && (
            <div className="rounded-xl border border-goethe-gold/30 bg-goethe-gold/5 p-4">
              <p className="text-xs font-semibold text-goethe-blue">Model cevap</p>
              <pre className="mt-2 whitespace-pre-wrap text-sm italic text-sage-600">
                {example.sampleLetter}
              </pre>
            </div>
          )}
        </>
      )}

      <div className="flex gap-2">
        <button type="button" className="btn-secondary" onClick={onBack}>
          Liste
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={!fullLetter.trim()}
          onClick={onSave}
        >
          Kaydet
        </button>
        <button
          type="button"
          className="btn-primary flex-1"
          disabled={!canComplete}
          onClick={onComplete}
        >
          Bitir
        </button>
      </div>
    </div>
  );
}
