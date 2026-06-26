import { getA1Vocabulary, type VocabularyWord } from "@german-coach/vocabulary";
import type { PatternBreakdownPart } from "@/lib/grundlagen";

export type WoIstDeckId = "starter" | "stadt" | "mixed";

export type WoIstExerciseKind = "build" | "artikel" | "wo-pick";

export interface WoIstPlace {
  id: string;
  word: string;
  article: "der" | "die" | "das";
  translation_tr: string;
  deck: WoIstDeckId[];
  vocabId?: string;
}

export interface LegoBlock {
  de: string;
  tr: string;
  role: PatternBreakdownPart["role"];
  fixed?: boolean;
}

export interface WoIstExercise {
  id: string;
  kind: WoIstExerciseKind;
  place: WoIstPlace;
  prompt_tr: string;
  answer_de: string;
  tokens: string[];
  distractors: string[];
  blocks: LegoBlock[];
  hint_tr?: string;
}

/** A1'de henüz kelime bankasında olmayan ama kalıpta kullanılan yerler */
const EXTRA_PLACES: Omit<WoIstPlace, "deck">[] = [
  { id: "markt", word: "Markt", article: "der", translation_tr: "pazar" },
  { id: "strand", word: "Strand", article: "der", translation_tr: "sahil" },
  { id: "zoo", word: "Zoo", article: "der", translation_tr: "hayvanat bahçesi" },
  { id: "hotel", word: "Hotel", article: "das", translation_tr: "otel" },
  {
    id: "fitnessstudio",
    word: "Fitnessstudio",
    article: "das",
    translation_tr: "spor salonu",
  },
];

const STARTER_WORDS = [
  "Bahnhof",
  "Flughafen",
  "Markt",
  "Park",
  "See",
  "Strand",
  "Supermarkt",
  "Zoo",
  "Café",
  "Fitnessstudio",
  "Hotel",
  "Krankenhaus",
];

const STADT_WORDS = [
  "Apotheke",
  "Bank",
  "Bahnhof",
  "Büro",
  "Café",
  "Kino",
  "Krankenhaus",
  "Post",
  "Restaurant",
  "Supermarkt",
  "Toilette",
  "Universität",
  "U-Bahnhof",
];

export const WO_IST_FORMULA: LegoBlock[] = [
  { de: "Wo", tr: "nerede (yer sorusu)", role: "question", fixed: true },
  { de: "ist", tr: "dır / dir (3. tekil: er/sie/es)", role: "verb", fixed: true },
  { de: "der / die / das", tr: "artikel — ismin cinsiyeti", role: "slot" },
  { de: "…", tr: "isim (Bahnhof, Park …)", role: "slot" },
  { de: "?", tr: "soru işareti — fiil başa gider", role: "question", fixed: true },
];

export const WO_IST_RULES = [
  { label: "Wo", tr: "Nerede? — W-Frage (yer sorusu)" },
  { label: "ist", tr: "sein fiili · 3. tekil: er/sie/es ist" },
  { label: "der / die / das", tr: "Her ismin artikeli var — ezberle" },
  { label: "Sıra", tr: "Wo + ist + Artikel + İsim + ?" },
  { label: "?", tr: "Soru cümlesinde fiil (ist) hemen Wo'dan sonra gelir" },
];

function vocabToPlace(w: VocabularyWord, decks: WoIstDeckId[]): WoIstPlace | null {
  if (!w.article || (w.article !== "der" && w.article !== "die" && w.article !== "das")) {
    return null;
  }
  return {
    id: w.id,
    word: w.word,
    article: w.article,
    translation_tr: w.translation_tr,
    deck: decks,
    vocabId: w.id,
  };
}

function findVocabWord(name: string): VocabularyWord | undefined {
  return getA1Vocabulary().words.find(
    (w) => w.word.toLowerCase() === name.toLowerCase()
  );
}

function buildPlaceList(): WoIstPlace[] {
  const byId = new Map<string, WoIstPlace>();

  for (const name of STARTER_WORDS) {
    const w = findVocabWord(name);
    if (w) {
      const p = vocabToPlace(w, ["starter", "mixed"]);
      if (p) byId.set(p.id, p);
      continue;
    }
    const extra = EXTRA_PLACES.find((e) => e.word.toLowerCase() === name.toLowerCase());
    if (extra) {
      byId.set(extra.id, { ...extra, deck: ["starter", "mixed"] });
    }
  }

  for (const name of STADT_WORDS) {
    const w = findVocabWord(name);
    if (!w) continue;
    const existing = byId.get(w.id);
    if (existing) {
      if (!existing.deck.includes("stadt")) existing.deck.push("stadt");
      continue;
    }
    const p = vocabToPlace(w, ["stadt", "mixed"]);
    if (p) byId.set(p.id, p);
  }

  return [...byId.values()];
}

let _places: WoIstPlace[] | null = null;

export function getWoIstPlaces(deck?: WoIstDeckId): WoIstPlace[] {
  if (!_places) _places = buildPlaceList();
  if (!deck) return _places;
  return _places.filter((p) => p.deck.includes(deck));
}

export function sentenceFor(place: WoIstPlace): string {
  return `Wo ist ${place.article} ${place.word}?`;
}

export function breakdownFor(place: WoIstPlace): LegoBlock[] {
  return [
    { de: "Wo", tr: "nerede", role: "question" },
    { de: "ist", tr: "dır / dir", role: "verb" },
    { de: `${place.article} ${place.word}`, tr: place.translation_tr, role: "slot" },
    { de: "?", tr: "soru", role: "question" },
  ];
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function articleDistractors(correct: WoIstPlace["article"]): string[] {
  const all: WoIstPlace["article"][] = ["der", "die", "das"];
  return all.filter((a) => a !== correct);
}

function woDistractors(): string[] {
  return ["Was", "Wie", "Wer"];
}

export function buildBuildExercise(place: WoIstPlace, seed: number): WoIstExercise {
  const answer = sentenceFor(place);
  const tokens = ["Wo", "ist", place.article, place.word, "?"];
  const distractors = shuffle(
    [
      ...articleDistractors(place.article),
      ...woDistractors(),
      "sind",
      "bist",
      "bin",
      place.article === "der" ? "die" : "der",
    ],
    seed
  ).slice(0, 4);

  return {
    id: `build-${place.id}-${seed}`,
    kind: "build",
    place,
    prompt_tr: `${place.translation_tr} nerede? — cümleyi kur`,
    answer_de: answer,
    tokens,
    distractors,
    blocks: breakdownFor(place),
    hint_tr: "Wo + ist + Artikel + İsim + ?",
  };
}

export function buildArtikelExercise(place: WoIstPlace, seed: number): WoIstExercise {
  const answer = place.article;
  return {
    id: `artikel-${place.id}-${seed}`,
    kind: "artikel",
    place,
    prompt_tr: `${place.translation_tr} (${place.word}) — doğru artikel?`,
    answer_de: answer,
    tokens: [answer],
    distractors: articleDistractors(place.article),
    blocks: breakdownFor(place),
    hint_tr: `${place.word} → ${place.article}`,
  };
}

export function buildWoPickExercise(place: WoIstPlace, seed: number): WoIstExercise {
  return {
    id: `wo-${place.id}-${seed}`,
    kind: "wo-pick",
    place,
    prompt_tr: `"${place.translation_tr} nerede?" sorusu hangisi?`,
    answer_de: "Wo",
    tokens: ["Wo"],
    distractors: shuffle(woDistractors(), seed),
    blocks: breakdownFor(place),
    hint_tr: "Yer sorusu = Wo (Was = ne, Wie = nasıl)",
  };
}

export function buildDeckExercises(deckId: WoIstDeckId, count = 12, seed = Date.now()): WoIstExercise[] {
  const places = getWoIstPlaces(deckId);
  if (places.length === 0) return [];

  const kinds: WoIstExerciseKind[] = ["build", "artikel", "wo-pick"];
  const out: WoIstExercise[] = [];
  let s = seed;

  for (let i = 0; i < count; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const place = places[s % places.length];
    const kind = kinds[i % kinds.length];
    if (kind === "build") out.push(buildBuildExercise(place, s));
    else if (kind === "artikel") out.push(buildArtikelExercise(place, s + 1));
    else out.push(buildWoPickExercise(place, s + 2));
  }

  return out;
}

export const WO_IST_DECKS: { id: WoIstDeckId; title: string; titleTr: string; desc: string }[] = [
  {
    id: "starter",
    title: "Wo ist …?",
    titleTr: "Başlangıç — 12 yer",
    desc: "Bahnhof · Park · Café · Krankenhaus …",
  },
  {
    id: "stadt",
    title: "In der Stadt",
    titleTr: "Şehirde",
    desc: "Apotheke · Post · Kino · Restaurant …",
  },
  {
    id: "mixed",
    title: "Karışık",
    titleTr: "Tüm yerler",
    desc: "der · die · das — hepsi bir arada",
  },
];

export const WO_IST_PASS_SCORE = 8;
