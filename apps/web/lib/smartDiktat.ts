import { getA1Vocabulary, type VocabularyWord } from "@german-coach/vocabulary";

export type DiktatPatternId = "habe" | "sehe";

export interface DiktatDrill {
  id: string;
  pattern: DiktatPatternId;
  wordId: string;
  de: string;
  tr: string;
  grammarTip: string;
  audioText: string;
}

const ADJECTIVES: { de: string; tr: string }[] = [
  { de: "neu", tr: "yeni" },
  { de: "groß", tr: "büyük" },
  { de: "klein", tr: "küçük" },
  { de: "schön", tr: "güzel" },
  { de: "schwarz", tr: "siyah" },
  { de: "weiß", tr: "beyaz" },
  { de: "interessant", tr: "ilginç" },
  { de: "beliebt", tr: "popüler" },
  { de: "schwer", tr: "ağır" },
  { de: "stylisch", tr: "şık" },
];

const PATTERN_META: Record<
  DiktatPatternId,
  { label: string; verb: string; tip: string }
> = {
  habe: {
    label: "haben — sahip olmak",
    verb: "habe",
    tip: "ich habe · du hast · er/sie hat · wir haben",
  },
  sehe: {
    label: "sehen — görmek",
    verb: "sehe",
    tip: "ich sehe · du siehst · er/sie sieht · wir sehen",
  },
};

function indefiniteAcc(word: VocabularyWord): string {
  if (word.article === "der") return "einen";
  if (word.article === "die") return "eine";
  return "ein";
}

function definite(word: VocabularyWord): string {
  return word.article ?? "das";
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pickAdj(word: VocabularyWord, seed: number) {
  const a = ADJECTIVES[seed % ADJECTIVES.length];
  const sehr = seed % 3 === 0 ? "sehr " : "";
  return { de: `${sehr}${a.de}`, tr: `${sehr ? "çok " : ""}${a.tr}` };
}

export function buildDrill(
  word: VocabularyWord,
  pattern: DiktatPatternId,
  seed = 0
): DiktatDrill {
  const indef = indefiniteAcc(word);
  const def = definite(word);
  const noun = cap(word.word);
  const adj = pickAdj(word, seed + word.id.length);

  const line1 =
    pattern === "habe"
      ? `Ich habe ${indef} ${word.word}.`
      : `Ich sehe ${indef} ${word.word}.`;
  const line2 = `${def} ${noun} ist ${adj.de}.`;

  const tr1 =
    pattern === "habe"
      ? `Bende bir ${word.translation_tr} var.`
      : `Bir ${word.translation_tr} görüyorum.`;
  const tr2 = `${noun} ${adj.tr}.`;

  const artTip =
    word.article === "der"
      ? "der → einen (akkusativ) / ein"
      : word.article === "die"
        ? "die → eine"
        : "das → ein";

  return {
    id: `${pattern}-${word.id}-${seed}`,
    pattern,
    wordId: word.id,
    de: `${line1} ${line2}`,
    tr: `${tr1} ${tr2}`,
    grammarTip: `${PATTERN_META[pattern].tip} · ${artTip}`,
    audioText: `${line1} ${line2}`,
  };
}

/** Akıllı kuyruk: doğru geç, yanlışı 2–4 kart sonra tekrar (artan aralık) */
export interface SmartQueueItem {
  drill: DiktatDrill;
  attempts: number;
  mastered: boolean;
}

export function buildSmartQueue(count = 8, seed = Date.now()): SmartQueueItem[] {
  const words = getA1Vocabulary().words.filter((w) => w.word.length >= 3);
  const patterns: DiktatPatternId[] = ["habe", "sehe"];
  const items: SmartQueueItem[] = [];
  let s = seed;

  for (let i = 0; i < count; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const w = words[s % words.length];
    const pattern = patterns[i % patterns.length];
    items.push({
      drill: buildDrill(w, pattern, i + s),
      attempts: 0,
      mastered: false,
    });
  }

  return shuffleQueue(items, seed);
}

export function patternLabel(id: DiktatPatternId): string {
  return PATTERN_META[id].label;
}

export function requeueOnWrong(
  queue: SmartQueueItem[],
  index: number
): SmartQueueItem[] {
  const item = queue[index];
  if (!item) return queue;

  const attempts = item.attempts + 1;
  const updated: SmartQueueItem = { ...item, attempts };

  if (attempts >= 3) {
    return queue.filter((_, i) => i !== index);
  }

  const spacing = attempts === 1 ? 2 : 3;
  const next = queue.filter((_, i) => i !== index);
  const insertAt = Math.min(index + spacing, next.length);
  next.splice(insertAt, 0, updated);
  return next;
}

export function markMastered(queue: SmartQueueItem[], index: number): SmartQueueItem[] {
  return queue.map((q, i) =>
    i === index ? { ...q, mastered: true } : q
  );
}

export function hintForAttempt(
  drill: DiktatDrill,
  attempts: number,
  showTurkish: boolean
): string | null {
  if (attempts <= 0) return null;
  if (attempts === 1) return `Kalıp: ${drill.pattern === "habe" ? "Ich habe …" : "Ich sehe …"} · ${drill.grammarTip}`;
  if (attempts === 2 && showTurkish) return drill.tr;
  if (attempts === 3) {
    const first = drill.de.split(".")[0];
    return `İlk cümle: ${first}…`;
  }
  return null;
}

function shuffleQueue<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const GRAMMAR_CHEATSHEET = [
  { de: "ich habe", tr: "bende var" },
  { de: "du hast", tr: "sende var" },
  { de: "er/sie hat", tr: "onda var" },
  { de: "ich sehe", tr: "görüyorum" },
  { de: "du siehst", tr: "görüyorsun" },
  { de: "ein (m/n)", tr: "bir" },
  { de: "eine (f)", tr: "bir" },
  { de: "einen (m akk.)", tr: "bir (eril nesne)" },
];
