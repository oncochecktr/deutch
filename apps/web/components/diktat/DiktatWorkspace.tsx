"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VocabularyWord } from "@german-coach/vocabulary";
import { HearAndWrite } from "@/components/HearAndWrite";
import { WordSidebar } from "@/components/diktat/WordSidebar";
import { loadDiktatStore, saveDiktatStore } from "@/lib/diktatStorage";
import {
  loadLearnerProfile,
  learnerDisplayName,
  type LearnerProfile,
} from "@/lib/learnerProfileStorage";
import { SmartDiktatDrill } from "@/components/diktat/SmartDiktatDrill";
import { LearnerOnboarding } from "@/components/grundlagen/LearnerOnboarding";
import { formatWord, playGermanAudio } from "@/lib/audio";

const STARTER_LINES = `Hast du ein Auto? Ja, ich habe ein Auto.
Ich brauche Hilfe. Ich brauche Zeit.
Wo ist der Strand? Wo ist dein Vater? Er ist hier.
Das ist ein Strand. Viele Leute gehen dorthin.
Das ist meine Uhr. Sie ist neu.
Ich habe eine Wohnung. Die Wohnung ist sehr gut.
Ich sehe einen Mann. Er ist sehr seltsam.
`;

export function DiktatWorkspace() {
  const [profile, setProfile] = useState<LearnerProfile>(loadLearnerProfile);
  const [showOnboard, setShowOnboard] = useState(false);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [showTurkish, setShowTurkish] = useState(true);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mode, setMode] = useState<"free" | "smart" | "listen">("smart");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingInsert = useRef<string | null>(null);

  useEffect(() => {
    const p = loadLearnerProfile();
    setProfile(p);
    if (!p.onboardingComplete) setShowOnboard(true);
    const store = loadDiktatStore();
    setText(store.freeText || "");
    setCategory(store.sidebarCategory);
    setShowTurkish(store.showTurkish);
  }, []);

  const persistText = useCallback((value: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveDiktatStore({ freeText: value, sidebarCategory: category, showTurkish });
    }, 400);
  }, [category, showTurkish]);

  const handleTextChange = (value: string) => {
    setText(value);
    persistText(value);
  };

  const insertAtCursor = useCallback((snippet: string) => {
    const el = textareaRef.current;
    if (!el) {
      setText((t) => (t ? `${t} ${snippet}` : snippet));
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = text.slice(0, start);
    const needsSpace = before.length > 0 && !before.endsWith(" ") && !before.endsWith("\n");
    const insert = `${needsSpace ? " " : ""}${snippet}`;
    const next = before + insert + text.slice(end);
    setText(next);
    persistText(next);
    requestAnimationFrame(() => {
      const pos = start + insert.length;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  }, [text, persistText]);

  useEffect(() => {
    if (mode !== "free" || !pendingInsert.current) return;
    const snippet = pendingInsert.current;
    pendingInsert.current = null;
    requestAnimationFrame(() => insertAtCursor(snippet));
  }, [mode, insertAtCursor]);

  const handleSelectWord = useCallback(async (w: VocabularyWord) => {
    setSelectedWord(w);
    setMode("listen");
    const display = formatWord(w.word, w.article);
    try {
      await playGermanAudio(display, w.audio_word);
    } catch {
      /* TTS yedek — sessiz devam */
    }
  }, []);

  const handleInsertWord = useCallback(
    (snippet: string) => {
      if (mode !== "free") {
        pendingInsert.current = snippet;
        setMode("free");
        return;
      }
      insertAtCursor(snippet);
    },
    [mode, insertAtCursor]
  );

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col gap-4 lg:flex-row">
      {showOnboard && (
        <LearnerOnboarding
          onComplete={() => {
            setProfile(loadLearnerProfile());
            setShowOnboard(false);
          }}
        />
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-goethe-blue">
              Diktat defteri
            </p>
            <p className="text-xs text-sage-500">
              {learnerDisplayName(profile)} — yazarak öğren, kelimeler yanda
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const next = !showTurkish;
                setShowTurkish(next);
                saveDiktatStore({ showTurkish: next });
              }}
              className="rounded-full border border-sage-200 px-2.5 py-1 text-[10px] text-sage-500"
            >
              TR {showTurkish ? "açık" : "kapalı"}
            </button>
            <button
              type="button"
              onClick={() => setShowOnboard(true)}
              className="rounded-full border border-sage-200 px-3 py-1 text-xs text-goethe-blue"
            >
              Profil
            </button>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            className={`flex-1 rounded-xl py-2 text-xs font-semibold sm:text-sm ${
              mode === "smart" ? "bg-goethe-blue text-white" : "bg-sage-100 text-sage-600"
            }`}
            onClick={() => setMode("smart")}
          >
            Akıllı tekrar
          </button>
          <button
            type="button"
            className={`flex-1 rounded-xl py-2 text-xs font-semibold sm:text-sm ${
              mode === "free" ? "bg-goethe-blue text-white" : "bg-sage-100 text-sage-600"
            }`}
            onClick={() => setMode("free")}
          >
            Serbest yaz
          </button>
          <button
            type="button"
            className={`flex-1 rounded-xl py-2 text-xs font-semibold sm:text-sm ${
              mode === "listen" ? "bg-goethe-blue text-white" : "bg-sage-100 text-sage-600"
            }`}
            onClick={() => setMode("listen")}
            disabled={!selectedWord}
          >
            Kelime
          </button>
        </div>

        {mode === "smart" ? (
          <SmartDiktatDrill showTurkish={showTurkish} />
        ) : mode === "free" ? (
          <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-sage-100 bg-white shadow-sm">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Almanca cümlelerini buraya yaz…&#10;&#10;Örnek: Ich sehe ein Auto. Das Auto ist schwarz."
              className="min-h-[320px] flex-1 resize-y rounded-xl bg-white px-5 py-4 text-base leading-relaxed text-sage-800 placeholder:text-sage-300 focus:outline-none lg:min-h-[480px]"
              spellCheck
              lang="de"
              autoComplete="off"
            />
            <div className="flex flex-wrap gap-2 border-t border-sage-50 px-4 py-3">
              <button
                type="button"
                className="btn-secondary text-xs"
                onClick={() => {
                  if (!text.trim()) handleTextChange(STARTER_LINES);
                }}
              >
                Örnek cümleler
              </button>
              <button
                type="button"
                className="btn-secondary text-xs"
                onClick={() => {
                  if (confirm("Tüm metin silinsin mi?")) handleTextChange("");
                }}
              >
                Temizle
              </button>
              <span className="ml-auto self-center text-[10px] text-sage-400">
                Otomatik kayıt · bu cihazda
              </span>
            </div>
          </div>
        ) : selectedWord ? (
          <div className="rounded-xl border border-sage-100 bg-white overflow-hidden">
            <HearAndWrite word={selectedWord} wordVisible />
            <p className="border-t border-sage-50 px-4 py-2 text-xs text-sage-400">
              Yan listeden başka kelime seçebilirsin.
            </p>
          </div>
        ) : (
          <p className="text-sm text-sage-500">Dinle-yaz için yan listeden bir kelime seç.</p>
        )}
      </div>

      <div
        className={`${
          sidebarOpen ? "flex" : "hidden"
        } fixed inset-x-3 bottom-20 top-28 z-20 flex-col lg:static lg:inset-auto lg:flex lg:w-72 lg:shrink-0`}
      >
        <WordSidebar
          showTurkish={showTurkish}
          category={category}
          onCategoryChange={(cat) => {
            setCategory(cat);
            saveDiktatStore({ sidebarCategory: cat });
          }}
          selectedId={selectedWord?.id ?? null}
          onSelect={handleSelectWord}
          onInsert={handleInsertWord}
          onToggleCollapse={() => setSidebarOpen(false)}
        />
      </div>

      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="btn-attention-glow fixed bottom-24 right-3 z-30 rounded-full px-4 py-2.5 text-xs font-semibold shadow-lg lg:hidden"
        >
          Kelimeler ↑
        </button>
      )}
    </div>
  );
}
