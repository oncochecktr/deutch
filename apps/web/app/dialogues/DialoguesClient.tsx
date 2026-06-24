"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { sanitizeProfessorErrorForUser } from "@/lib/professorMessages";
import { PageShell } from "@/components/PageShell";
import { DialogueReader } from "@/components/dialogue/DialogueReader";
import { getDialogueById, getDialoguesByLevel, getSeedDialogues } from "@/lib/dialogues";
import type { DialogueLevel, DialogueStory } from "@/lib/dialogueTypes";
import {
  canGenerateAiStory,
  isStoryRead,
  loadDialogueStorage,
  recordAiGeneration,
  recordDialogueRead,
  saveAiStory,
  saveDialogueStorage,
  type DialogueStorageState,
} from "@/lib/dialogueStorage";
import { useProgress } from "@/lib/ProgressContext";

const LEVELS: (DialogueLevel | "saved")[] = ["A1", "A2", "B1", "saved"];

export default function DialoguesClient() {
  const searchParams = useSearchParams();
  const levelParam = searchParams.get("level") as DialogueLevel | null;
  const idParam = searchParams.get("id");

  const { updateProgress, hydrated } = useProgress();
  const [storage, setStorage] = useState<DialogueStorageState>(() => loadDialogueStorage());
  const [tab, setTab] = useState<DialogueLevel | "saved">(
    levelParam && LEVELS.includes(levelParam) ? levelParam : "A1"
  );
  const [selectedId, setSelectedId] = useState<string | null>(idParam);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [genLevel, setGenLevel] = useState<DialogueLevel>("A1");
  const [genTheme, setGenTheme] = useState("");

  useEffect(() => {
    if (idParam) setSelectedId(idParam);
    if (levelParam && LEVELS.includes(levelParam)) setTab(levelParam);
  }, [idParam, levelParam]);

  const stories = useMemo(() => {
    if (tab === "saved") return storage.savedStories;
    return getDialoguesByLevel(tab, storage.savedStories);
  }, [tab, storage.savedStories]);

  const selectedStory = useMemo(
    () => (selectedId ? getDialogueById(selectedId, storage.savedStories) : null),
    [selectedId, storage.savedStories]
  );

  const persist = useCallback((next: DialogueStorageState) => {
    setStorage(next);
    saveDialogueStorage(next);
  }, []);

  const handleStoryComplete = useCallback(() => {
    if (!selectedId) return;
    const next = recordDialogueRead(storage, selectedId);
    persist(next);
    updateProgress((p) => ({
      dailyStats: {
        ...p.dailyStats,
        dialoguesRead: (p.dailyStats.dialoguesRead ?? 0) + 1,
      },
    }));
  }, [selectedId, storage, persist, updateProgress]);

  const handleGenerate = async () => {
    const guard = canGenerateAiStory(storage);
    if (!guard.ok) {
      setGenError(guard.reason ?? "Limit aşıldı.");
      return;
    }
    setGenerating(true);
    setGenError(null);
    try {
      const res = await fetch("/api/dialogue/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: genLevel,
          theme: genTheme.trim() || undefined,
          style: "funny",
          maxLines: 16,
        }),
        signal: AbortSignal.timeout(90_000),
      });
      const data = (await res.json()) as DialogueStory & { error?: string; detail?: string };
      if (!res.ok) {
        setGenError(sanitizeProfessorErrorForUser(data.error ?? "Üretim başarısız."));
        return;
      }
      const story: DialogueStory = {
        ...data,
        source: "ai",
        createdAt: new Date().toISOString(),
        readCount: 0,
      };
      let next = saveAiStory(storage, story);
      next = recordAiGeneration(next);
      persist(next);
      setTab("saved");
      setSelectedId(story.id);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Bağlantı hatası.");
    } finally {
      setGenerating(false);
    }
  };

  if (!hydrated) {
    return (
      <PageShell title="Hikayeler" subtitle="Yükleniyor…">
        <div className="card-soft p-8 text-center text-sm text-sage-500">…</div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Hikayeler & Diyaloglar"
      subtitle="Satır satır oku · ses · quiz"
      maxWidth="full"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <aside className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setTab(l);
                  setSelectedId(null);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  tab === l
                    ? "bg-goethe-blue text-white"
                    : "border border-sage-200 text-sage-600"
                }`}
              >
                {l === "saved" ? "Kaydedilenler" : l}
              </button>
            ))}
          </div>

          <div className="card-soft space-y-2 p-3">
            <p className="text-xs font-semibold text-goethe-blue">Profesör yeni hikaye yazsın</p>
            <select
              value={genLevel}
              onChange={(e) => setGenLevel(e.target.value as DialogueLevel)}
              className="w-full rounded-lg border border-sage-200 px-2 py-1.5 text-sm"
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
            </select>
            <input
              type="text"
              value={genTheme}
              onChange={(e) => setGenTheme(e.target.value)}
              placeholder="Tema (opsiyonel): aile, iş, seyahat…"
              className="w-full rounded-lg border border-sage-200 px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              disabled={generating}
              onClick={() => void handleGenerate()}
              className="w-full rounded-lg bg-indigo-700 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              {generating ? "Profesör yazıyor…" : "Yeni hikaye oluştur"}
            </button>
            {genError && <p className="text-xs text-goethe-red">{genError}</p>}
            <p className="text-[10px] text-sage-400">
              Günde 3 yeni hikaye · {getSeedDialogues().length} hazır hikaye
            </p>
          </div>

          <div className="max-h-[min(52vh,520px)] space-y-2 overflow-y-auto">
            {stories.length === 0 && (
              <p className="text-sm text-sage-500">
                {tab === "saved"
                  ? "Henüz özel hikaye yok — yukarıdan oluşturun."
                  : "Bu seviyede hikaye yok."}
              </p>
            )}
            {stories.map((s) => {
              const read = isStoryRead(storage, s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    selectedId === s.id
                      ? "border-goethe-blue bg-goethe-blue/5"
                      : "border-sage-200 bg-white hover:border-goethe-blue/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-goethe-blue">{s.title_de}</p>
                    {read && (
                      <span className="shrink-0 text-[10px] font-bold text-emerald-700">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-sage-500">{s.title_tr}</p>
                  <p className="mt-1 text-[10px] text-sage-400">
                    {s.lines.length} satır · {s.theme}
                    {s.source === "ai" ? " · özel" : ""}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="card-soft min-h-[400px] p-4 sm:p-6">
          {selectedStory ? (
            <DialogueReader story={selectedStory} onComplete={handleStoryComplete} />
          ) : (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center text-sage-500">
              <p className="text-lg font-medium text-goethe-blue">Bir hikaye seç</p>
              <p className="mt-2 max-w-sm text-sm">
                Soldan hikaye seç.
              </p>
            </div>
          )}
        </main>
      </div>
    </PageShell>
  );
}
