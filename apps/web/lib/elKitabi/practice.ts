import type { ElKitabiPractice } from "./types";
import { CH01_QUIZZES } from "./quizzes/ch01";
import { CH02_QUIZZES } from "./quizzes/ch02";
import { CH03_QUIZZES } from "./quizzes/ch03";
import { CH04_QUIZZES } from "./quizzes/ch04";
import { CH06_QUIZZES } from "./quizzes/ch06";

export const EL_KITABI_PRACTICE: Record<string, ElKitabiPractice> = {
  "ch01-3": {
    moduleHref: "/grundlagen/zahlen",
    moduleLabel: "Sayılar modülü",
    quiz: CH01_QUIZZES["ch01-3"],
    weakTip: "Sayıları sesli tekrar et — modülde dinle-yaz pratiği var.",
    strongTip: "Sayılar oturdu — saat ve tarih için Zaman modülüne geç.",
  },
  "ch02-2": {
    moduleHref: "/grundlagen/conjugation",
    moduleLabel: "Fiil çekimi modülü",
    quiz: CH02_QUIZZES["ch02-2"],
    weakTip: "ich/du/er tablosunu bir kez daha oku, sonra modülde drill yap.",
    strongTip: "Çekim iyi — düzensiz fiiller için aynı modülde devam et.",
  },
  "ch02-4": {
    moduleHref: "/grundlagen/word-order",
    moduleLabel: "Kelime sırası modülü",
    quiz: CH02_QUIZZES["ch02-4"],
    weakTip: "V2 kuralını örnek cümlelerle modülde uygula.",
    strongTip: "Cümle dizilimi net — modal fiillere geçebilirsin.",
  },
  "ch02-5": {
    moduleHref: "/grundlagen/negation",
    moduleLabel: "Olumsuzluk modülü",
    quiz: CH02_QUIZZES["ch02-5"],
    weakTip: "kein = isim, nicht = fiil/zarf — modülde örnekleri dinle.",
    strongTip: "nicht/kein ayrımı oturdu — modal fiillere geç.",
  },
  "ch03-1": {
    moduleHref: "/grundlagen/artikel",
    moduleLabel: "Artikel modülü",
    quiz: CH03_QUIZZES["ch03-1"],
    weakTip: "-ung → die, -chen → das kurallarını modülde pekiştir.",
    strongTip: "Artikel ipuçları iyi — drill ile hız kazan.",
  },
  "ch03-2": {
    moduleHref: "/grundlagen/artikel",
    moduleLabel: "Artikel drill",
    quiz: CH03_QUIZZES["ch03-2"],
    weakTip: "ein/eine/kein tablosunu modülde tekrar et.",
    strongTip: "Artikel türleri tamam — çoğul bölümüne geç.",
  },
  "ch04-1": {
    moduleHref: "/grundlagen/dativ",
    moduleLabel: "Dativ modülü",
    quiz: CH04_QUIZZES["ch04-1"],
    weakTip: "wem? = Dativ, wen? = Akkusativ — modülde örnek çöz.",
    strongTip: "Dört hal özeti net — artikel tablolarını pekiştir.",
  },
  "ch06-1": {
    moduleHref: "/grundlagen/prepositions",
    moduleLabel: "Edatlar modülü",
    quiz: CH06_QUIZZES["ch06-1"],
    weakTip: "DOGFUB listesini ezberle, modülde Akkusativ setini çöz.",
    strongTip: "Akkusativ edatlar oturdu — Dativ edatlarına geç.",
  },
  "ch06-2": {
    moduleHref: "/grundlagen/prepositions",
    moduleLabel: "Edatlar modülü",
    quiz: CH06_QUIZZES["ch06-2"],
    weakTip: "aus, bei, mit, nach, von, zu → Dativ. Modülde drill yap.",
    strongTip: "Dativ edatlar iyi — Wechselpräpositionlara geç.",
  },
};

export function getPracticeForSubsection(subsectionId: string): ElKitabiPractice | undefined {
  return EL_KITABI_PRACTICE[subsectionId];
}

export function elKitabiModuleHref(moduleHref: string, subsectionId: string): string {
  const sep = moduleHref.includes("?") ? "&" : "?";
  return `${moduleHref}${sep}from=el-kitabi&section=${encodeURIComponent(subsectionId)}`;
}

export const EL_KITABI_PRACTICE_IDS = Object.keys(EL_KITABI_PRACTICE);

/** Mini test geçme eşiği — doğru / toplam (ör. 2 soruda en az 2, 1/2 yeterli değil) */
export const EL_KITABI_QUIZ_PASS_RATIO = 0.8;

export function elKitabiQuizPassThreshold(total: number): number {
  if (total <= 0) return 0;
  return Math.max(1, Math.ceil(total * EL_KITABI_QUIZ_PASS_RATIO));
}

export function elKitabiQuizPassed(correct: number, total: number): boolean {
  if (total <= 0) return false;
  return correct >= elKitabiQuizPassThreshold(total);
}

export function elKitabiSubsectionQuizPassed(
  sub: { quizBest?: number; quizTotal?: number } | undefined
): boolean {
  if (!sub?.quizTotal || sub.quizBest === undefined) return false;
  return elKitabiQuizPassed(sub.quizBest, sub.quizTotal);
}

export function getSubsectionTitle(subsectionId: string): string | undefined {
  const practice = EL_KITABI_PRACTICE[subsectionId];
  if (!practice) return undefined;
  const titles: Record<string, string> = {
    "ch01-3": "1.3 Sayılar",
    "ch02-2": "2.2 Fiil çekimi",
    "ch02-4": "2.4 Cümle dizilimi",
    "ch02-5": "2.5 Olumsuzluk",
    "ch03-1": "3.1 Artikel trikleri",
    "ch03-2": "3.2 Artikel türleri",
    "ch04-1": "4.1 Dört hal",
    "ch06-1": "6.1 Akkusativ edatlar",
    "ch06-2": "6.2 Dativ edatlar",
  };
  return titles[subsectionId];
}

export function summarizeElKitabiProgress(
  subsections: Record<string, { read?: boolean; quizBest?: number; quizTotal?: number; moduleVisited?: boolean }>
): { total: number; read: number; tested: number; moduleVisited: number } {
  const ids = EL_KITABI_PRACTICE_IDS;
  let read = 0;
  let tested = 0;
  let moduleVisited = 0;
  for (const id of ids) {
    const s = subsections[id];
    if (!s) continue;
    if (s.read) read += 1;
    if (elKitabiSubsectionQuizPassed(s)) tested += 1;
    if (s.moduleVisited) moduleVisited += 1;
  }
  return { total: ids.length, read, tested, moduleVisited };
}
