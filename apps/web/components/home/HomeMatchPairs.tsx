"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getA1Vocabulary,
  getA2Vocabulary,
  getTimurVocabulary,
  getUniversalVocabulary,
  type VocabularyWord,
} from "@german-coach/vocabulary";
import { IconArrowRight, IconCheck } from "@/components/icons";

type MatchSide = "de" | "tr";
type MatchCard = {
  id: string;
  side: MatchSide;
  label: string;
};

type MatchMemory = {
  totalMatches: number;
  todayMatches: number;
  roundsCompleted: number;
  solvedIds: string[];
  recentIds: string[];
  lastPlayedDate: string;
};

const MATCH_MEMORY_KEY = "german-coach-match-pairs";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function freshMemory(): MatchMemory {
  return {
    totalMatches: 0,
    todayMatches: 0,
    roundsCompleted: 0,
    solvedIds: [],
    recentIds: [],
    lastPlayedDate: todayKey(),
  };
}

function normalizeMemory(memory: MatchMemory): MatchMemory {
  const today = todayKey();
  return {
    ...memory,
    todayMatches: memory.lastPlayedDate === today ? memory.todayMatches : 0,
    lastPlayedDate: today,
  };
}

function loadMemory(): MatchMemory {
  if (typeof window === "undefined") return freshMemory();
  try {
    const raw = window.localStorage.getItem(MATCH_MEMORY_KEY);
    if (!raw) return freshMemory();
    const parsed = JSON.parse(raw) as Partial<MatchMemory>;
    return normalizeMemory({
      totalMatches: Number(parsed.totalMatches) || 0,
      todayMatches: Number(parsed.todayMatches) || 0,
      roundsCompleted: Number(parsed.roundsCompleted) || 0,
      solvedIds: Array.isArray(parsed.solvedIds) ? parsed.solvedIds.filter(Boolean) : [],
      recentIds: Array.isArray(parsed.recentIds) ? parsed.recentIds.filter(Boolean).slice(0, 8) : [],
      lastPlayedDate: typeof parsed.lastPlayedDate === "string" ? parsed.lastPlayedDate : todayKey(),
    });
  } catch {
    return freshMemory();
  }
}

function saveMemory(memory: MatchMemory) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MATCH_MEMORY_KEY, JSON.stringify(memory));
}

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j]!, next[i]!];
  }
  return next;
}

function wordLabel(word: VocabularyWord) {
  return [word.article, word.word].filter(Boolean).join(" ");
}

function buildPool() {
  const seen = new Set<string>();
  return [
    ...getA1Vocabulary().words,
    ...getA2Vocabulary().words,
    ...getUniversalVocabulary().words,
    ...getTimurVocabulary().words,
  ].filter((word) => {
    const key = `${word.word.toLocaleLowerCase("de-DE")}::${word.translation_tr.toLocaleLowerCase("tr-TR")}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return word.word.trim() && word.translation_tr.trim();
  });
}

function makeRound(pool: VocabularyWord[], size = 5) {
  const words = shuffle(pool).slice(0, size);
  return {
    words,
    left: shuffle(
      words.map((word) => ({
        id: word.id,
        side: "tr" as const,
        label: word.translation_tr,
      }))
    ),
    right: shuffle(
      words.map((word) => ({
        id: word.id,
        side: "de" as const,
        label: wordLabel(word),
      }))
    ),
  };
}

function makeInitialRound(pool: VocabularyWord[], size = 5) {
  const words = pool.slice(0, size);
  return {
    words,
    left: words.map((word) => ({
      id: word.id,
      side: "tr" as const,
      label: word.translation_tr,
    })),
    right: words.map((word) => ({
      id: word.id,
      side: "de" as const,
      label: wordLabel(word),
    })),
  };
}

export function HomeMatchPairs() {
  const pool = useMemo(() => buildPool(), []);
  const [round, setRound] = useState(() => makeInitialRound(pool));
  const [selected, setSelected] = useState<Partial<Record<MatchSide, string>>>({});
  const [matched, setMatched] = useState<string[]>([]);
  const [mistake, setMistake] = useState<string[]>([]);
  const [roundNo, setRoundNo] = useState(1);
  const [memory, setMemory] = useState<MatchMemory>(() => freshMemory());

  useEffect(() => {
    setMemory(loadMemory());
    setRound(makeRound(pool));
  }, [pool]);

  const matchedSet = useMemo(() => new Set(matched), [matched]);
  const wordById = useMemo(() => new Map(pool.map((word) => [word.id, word])), [pool]);
  const solvedUnique = Math.min(memory.solvedIds.length, pool.length);
  const recentWords = memory.recentIds
    .map((id) => wordById.get(id))
    .filter(Boolean)
    .slice(0, 4) as VocabularyWord[];
  const done = matched.length >= round.words.length;
  const totalProgressPct =
    pool.length > 0 ? Math.min(100, Math.max(0, Math.round((solvedUnique / pool.length) * 100))) : 0;

  const startNextRound = () => {
    setRound(makeRound(pool));
    setSelected({});
    setMatched([]);
    setMistake([]);
    setRoundNo((n) => n + 1);
  };

  const pick = (card: MatchCard) => {
    if (matchedSet.has(card.id)) return;
    if (selected[card.side] === card.id) {
      setSelected((current) => ({ ...current, [card.side]: undefined }));
      return;
    }

    const otherSide: MatchSide = card.side === "de" ? "tr" : "de";
    const otherId = selected[otherSide];
    if (!otherId) {
      setSelected((current) => ({ ...current, [card.side]: card.id }));
      return;
    }

    if (otherId === card.id) {
      setMatched((current) => {
        const nextMatched = [...current, card.id];
        setMemory((currentMemory) => {
          const uniqueSolved = new Set(currentMemory.solvedIds);
          uniqueSolved.add(card.id);
          const nextMemory = normalizeMemory({
            ...currentMemory,
            totalMatches: currentMemory.totalMatches + 1,
            todayMatches: currentMemory.todayMatches + 1,
            roundsCompleted:
              nextMatched.length >= round.words.length
                ? currentMemory.roundsCompleted + 1
                : currentMemory.roundsCompleted,
            solvedIds: Array.from(uniqueSolved),
            recentIds: [card.id, ...currentMemory.recentIds.filter((id) => id !== card.id)].slice(0, 8),
          });
          saveMemory(nextMemory);
          return nextMemory;
        });
        return nextMatched;
      });
      setSelected({});
      setMistake([]);
      return;
    }

    setMistake([otherId, card.id]);
    setSelected({});
    window.setTimeout(() => setMistake([]), 420);
  };

  const cardClass = (card: MatchCard) => {
    const isMatched = matchedSet.has(card.id);
    const isSelected = selected[card.side] === card.id;
    const isMistake = mistake.includes(card.id);
    if (isMatched) {
      return "border-[#58cc02] bg-[#d7ffb8] text-[#225c16] shadow-[0_5px_0_#58a700]";
    }
    if (isMistake) {
      return "border-[#ff4b4b] bg-[#ffe2e2] text-[#9f1d1d] shadow-[0_5px_0_#d33838]";
    }
    if (isSelected) {
      return "border-[#1cb0f6] bg-[#ddf4ff] text-[#0f5f8f] shadow-[0_5px_0_#84d8ff]";
    }
    return "border-[#d7e2d9] bg-white text-[#25343b] shadow-[0_5px_0_#d7e2d9] hover:border-[#1cb0f6] hover:bg-[#f3fbff] hover:text-[#0f5f8f]";
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-white/12 bg-[#f7fbf4] shadow-[0_18px_34px_rgba(0,0,0,0.22)]">
      <div className="border-b border-sage-100 bg-white px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#58a700]">
              Sınırsız eşleştirme
            </p>
            <h2 className="mt-1 text-xl font-bold leading-tight text-goethe-blue">
              Eşleşen çiftlere dokun
            </h2>
            <p className="mt-0.5 text-sm text-sage-600">
              {solvedUnique}/{pool.length} kelime çözüldü · her tur yeni çiftler.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-goethe-blue">
            <span className="rounded-full bg-[#ddf4ff] px-3 py-1">Tur {roundNo}</span>
            <span className="rounded-full bg-goethe-gold/20 px-3 py-1">
              Bugün {memory.todayMatches}
            </span>
            <span className="rounded-full bg-[#e5f8d6] px-3 py-1">
              Toplam {memory.totalMatches}
            </span>
          </div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-sage-100">
          <div
            className="h-full rounded-full bg-[#58cc02] transition-all duration-300"
            style={{ width: `${totalProgressPct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-sage-500">
          <span>Genel ilerleme %{totalProgressPct}</span>
          <span>Bu tur {matched.length}/{round.words.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-5">
        <div className="grid gap-3">
          {round.left.map((card) => (
            <button
              key={`${card.side}-${card.id}`}
              type="button"
              onClick={() => pick(card)}
              className={`min-h-[72px] rounded-2xl border-2 px-4 py-3 text-center text-base font-extrabold transition hover:-translate-y-0.5 active:translate-y-1 sm:min-h-[86px] sm:text-lg ${cardClass(card)}`}
            >
              {card.label}
            </button>
          ))}
        </div>
        <div className="grid gap-3">
          {round.right.map((card) => (
            <button
              key={`${card.side}-${card.id}`}
              type="button"
              onClick={() => pick(card)}
              className={`min-h-[72px] rounded-2xl border-2 px-4 py-3 text-center text-base font-extrabold transition hover:-translate-y-0.5 active:translate-y-1 sm:min-h-[86px] sm:text-lg ${cardClass(card)}`}
            >
              {card.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-sage-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="space-y-1">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-sage-600">
            {done ? (
              <>
                <IconCheck size={18} className="text-[#58cc02]" />
                Tur tamamlandı, yenisi hazır.
              </>
            ) : (
              `${matched.length}/${round.words.length} çift tamamlandı`
            )}
          </p>
          <p className="text-xs text-sage-500">
            {memory.roundsCompleted > 0
              ? `${memory.roundsCompleted} tur bitti. Hatırlamaya çalış: ${
                  recentWords.length > 0
                    ? recentWords.map((word) => wordLabel(word)).join(", ")
                    : "son eşleşmelerin burada görünecek"
                }.`
              : "Doğru eşleşmeler bu tarayıcıda kaydedilecek."}
          </p>
        </div>
        <button
          type="button"
          onClick={startNextRound}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#58cc02] px-5 py-3 text-sm font-bold text-white shadow-[0_4px_0_#58a700] transition hover:brightness-105 active:translate-y-1 active:shadow-none"
        >
          {done ? "Yeni tur" : "Karıştır"}
          <IconArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
