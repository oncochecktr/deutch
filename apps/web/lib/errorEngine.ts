import type { UserProgress } from "./progress";

export type ErrorTag =
  | "akkusativ"
  | "jaNein"
  | "trennbar"
  | "artikel"
  | "hoeren"
  | "lesen"
  | "schreiben"
  | "sprechen";

export interface WeakTopicSuggestion {
  tag: ErrorTag;
  label: string;
  href: string;
  cta: string;
  count: number;
  reason: string;
}

const TAG_ROUTES: Record<ErrorTag, { href: string; label: string; cta: string }> = {
  akkusativ: {
    href: "/grundlagen/grammar-pack?section=akkusativ",
    label: "Akkusativ",
    cta: "Akkusativ tekrarı",
  },
  jaNein: {
    href: "/grundlagen/grammar-pack?section=jaNein",
    label: "Ja/Nein soruları",
    cta: "Ja/Nein tekrarı",
  },
  trennbar: {
    href: "/grundlagen/grammar-pack?section=trennbar",
    label: "Trennbare Verben",
    cta: "Ayrılabilen fiiller",
  },
  artikel: {
    href: "/grundlagen/grammar",
    label: "Artikel (der/die/das)",
    cta: "Artikel tekrarı",
  },
  hoeren: {
    href: "/exam/hoeren",
    label: "Hören",
    cta: "Dinleme oturumu",
  },
  lesen: {
    href: "/exam/lesen",
    label: "Lesen",
    cta: "Okuma metni",
  },
  schreiben: {
    href: "/exam/schreiben/gercek",
    label: "Schreiben",
    cta: "Yazma rehberi",
  },
  sprechen: {
    href: "/exam/sprechen",
    label: "Sprechen",
    cta: "Konuşma kartları",
  },
};

function bump(counts: Partial<Record<ErrorTag, number>>, tag: ErrorTag, n = 1) {
  counts[tag] = (counts[tag] ?? 0) + n;
}

/** Yanlış cevaplar ve düşük puanlardan zayıf konu önerisi üretir */
export function analyzeWeakTopics(progress: UserProgress): WeakTopicSuggestion | null {
  const counts: Partial<Record<ErrorTag, number>> = {};

  const hoerenWrong = Object.values(progress.goethe.hoeren).filter((v) => v === false).length;
  if (hoerenWrong >= 3) bump(counts, "hoeren", hoerenWrong);

  const lesenWrong = Object.values(progress.goethe.lesen).filter((v) => v === false).length;
  if (lesenWrong >= 3) bump(counts, "lesen", lesenWrong);

  for (const score of Object.values(progress.goethe.sprechenScores)) {
    if (score < 60) bump(counts, "sprechen");
  }

  for (const result of Object.values(progress.goethe.realExamResults)) {
    if ((result.points?.schreiben ?? 25) < 15) bump(counts, "schreiben", 2);
    if ((result.points?.sprechen ?? 25) < 15) bump(counts, "sprechen", 2);
  }

  const grammarPack = progress.grundlagen.grammarPack;
  if ((grammarPack["akkusativ"] ?? 100) < 3) bump(counts, "akkusativ", 3);
  if ((grammarPack["jaNein"] ?? 100) < 3) bump(counts, "jaNein", 3);
  if ((grammarPack["trennbar"] ?? 100) < 3) bump(counts, "trennbar", 3);

  const satzDone = progress.grundlagen.satzCompleted.length;
  if (satzDone < 10) bump(counts, "artikel", 2);

  const entries = Object.entries(counts) as [ErrorTag, number][];
  if (entries.length === 0) return null;

  entries.sort((a, b) => b[1] - a[1]);
  const [tag, count] = entries[0];
  const route = TAG_ROUTES[tag];
  return {
    tag,
    label: route.label,
    href: route.href,
    cta: route.cta,
    count,
    reason: `${route.label} alanında ${count} zayıf sinyal`,
  };
}

export function getTodayFocusSuggestion(progress: UserProgress): WeakTopicSuggestion | null {
  return analyzeWeakTopics(progress);
}
