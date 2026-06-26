import type { PatternBreakdownPart } from "@/lib/grundlagen";
import {
  type EngineAdjective,
  type EngineAdjectiveDeck,
  getEngineAdjectives,
  woIstWithAdj,
  attributivePhrase,
  generatePattern02Examples,
} from "@/lib/adjektivDeclension";
import { getWoIstPlaces, type WoIstPlace } from "@/lib/woIstLego";

export type AdjektivExerciseKind = "build" | "adj-form" | "lego-swap";

export interface AdjektivExercise {
  id: string;
  kind: AdjektivExerciseKind;
  place: WoIstPlace;
  adjective: EngineAdjective;
  prompt_tr: string;
  answer_de: string;
  tokens: string[];
  distractors: string[];
  blocks: { de: string; tr: string; role?: PatternBreakdownPart["role"] }[];
  hint_tr?: string;
  revealPattern?: boolean;
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

function breakdown(place: WoIstPlace, adj: EngineAdjective) {
  return [
    { de: "Wo", tr: "nerede", role: "question" as const },
    { de: "ist", tr: "dır / dir", role: "verb" as const },
    { de: place.article, tr: "artikel", role: "slot" as const },
    { de: adj.attributive, tr: adj.translation_tr, role: "slot" as const },
    { de: place.word, tr: place.translation_tr, role: "slot" as const },
    { de: "?", tr: "soru", role: "question" as const },
  ];
}

function adjDistractors(correct: EngineAdjective, seed: number): string[] {
  const wrong = [
    correct.lemma,
    correct.lemma + "er",
    correct.lemma + "es",
    correct.attributive.replace(/e$/, ""),
    "groß",
    "gut",
    "nächster",
  ].filter((w) => w !== correct.attributive);
  return shuffle([...new Set(wrong)], seed).slice(0, 4);
}

export function buildAdjBuildExercise(
  place: WoIstPlace,
  adj: EngineAdjective,
  seed: number,
  revealPattern = false
): AdjektivExercise {
  const answer = woIstWithAdj(place, adj);
  const tokens = ["Wo", "ist", place.article, adj.attributive, place.word, "?"];

  return {
    id: `adj-build-${place.id}-${adj.id}-${seed}`,
    kind: "build",
    place,
    adjective: adj,
    prompt_tr: `${adj.translation_tr} ${place.translation_tr} nerede?`,
    answer_de: answer,
    tokens,
    distractors: shuffle(
      [
        ...adjDistractors(adj, seed),
        "Was",
        "sind",
        place.article === "der" ? "die" : "der",
      ],
      seed + 1
    ).slice(0, 5),
    blocks: breakdown(place, adj),
    hint_tr: "Wo + ist + Artikel + Sıfat + İsim + ?",
    revealPattern,
  };
}

export function buildAdjFormExercise(
  place: WoIstPlace,
  adj: EngineAdjective,
  seed: number
): AdjektivExercise {
  const phrase = attributivePhrase(place.article, adj, place.word);
  return {
    id: `adj-form-${place.id}-${adj.id}-${seed}`,
    kind: "adj-form",
    place,
    adjective: adj,
    prompt_tr: `${place.article} ___ ${place.word} — doğru sıfat formu?`,
    answer_de: adj.attributive,
    tokens: [adj.attributive],
    distractors: adjDistractors(adj, seed),
    blocks: breakdown(place, adj),
    hint_tr: `${place.article} + ${adj.lemma} → ${adj.attributive}`,
  };
}

export function buildLegoSwapExercise(
  place: WoIstPlace,
  adj: EngineAdjective,
  seed: number
): AdjektivExercise {
  const alts = getEngineAdjectives("motor").filter((a) => a.id !== adj.id);
  const wrong = alts[seed % alts.length] ?? getEngineAdjectives("groesse")[0];
  return {
    id: `adj-swap-${place.id}-${adj.id}-${seed}`,
    kind: "lego-swap",
    place,
    adjective: adj,
    prompt_tr: `Orta bloğu değiştir: ${wrong.translation_tr} değil, ${adj.translation_tr}`,
    answer_de: adj.attributive,
    tokens: [adj.attributive],
    distractors: [wrong.attributive, wrong.lemma, "groß", "gut"].filter(
      (x) => x !== adj.attributive
    ),
    blocks: breakdown(place, adj),
    hint_tr: "Sadece sıfat bloğu değişir — artikel ve isim sabit",
  };
}

export function buildAdjDeckExercises(
  deckId: EngineAdjectiveDeck,
  count = 10,
  seed = Date.now()
): AdjektivExercise[] {
  const adjs = getEngineAdjectives(deckId);
  const places = getWoIstPlaces(deckId === "intro" ? "starter" : "mixed");
  if (adjs.length === 0 || places.length === 0) return [];

  const kinds: AdjektivExerciseKind[] =
    deckId === "intro"
      ? ["build", "adj-form", "build"]
      : ["build", "adj-form", "lego-swap"];

  const out: AdjektivExercise[] = [];
  let s = seed;

  for (let i = 0; i < count; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const adj = adjs[s % adjs.length];
    const place = places[(s >> 4) % places.length];
    const kind = kinds[i % kinds.length];
    const reveal = deckId === "intro" && i === 0;

    if (kind === "build") out.push(buildAdjBuildExercise(place, adj, s, reveal));
    else if (kind === "adj-form") out.push(buildAdjFormExercise(place, adj, s));
    else out.push(buildLegoSwapExercise(place, adj, s));
  }

  return out;
}

export { generatePattern02Examples, generateWoIstAdjExamples } from "@/lib/adjektivDeclension";

export const ADJEKTIV_PASS_SCORE = 8;
