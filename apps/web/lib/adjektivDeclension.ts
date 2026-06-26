import { getA1Vocabulary, type VocabularyWord } from "@german-coach/vocabulary";
import { getWoIstPlaces, type WoIstPlace } from "@/lib/woIstLego";

export type EngineAdjectiveDeck =
  | "intro"
  | "groesse"
  | "neuheit"
  | "qualitaet"
  | "farbe"
  | "alter"
  | "charakter"
  | "motor";

export interface EngineAdjective {
  id: string;
  lemma: string;
  attributive: string;
  translation_tr: string;
  deck: EngineAdjectiveDeck;
  vocabId?: string;
}

/**
 * Belirli artikel (der/die/das) + nominativ: zayıf çekim → sıfat -e alır.
 * A1 motoru için attributive form önceden tanımlı (groß → große vb.).
 */
export const ENGINE_ADJECTIVES: EngineAdjective[] = [
  {
    id: "naechste",
    lemma: "nächste",
    attributive: "nächste",
    translation_tr: "en yakın",
    deck: "intro",
  },
  {
    id: "gross",
    lemma: "groß",
    attributive: "große",
    translation_tr: "büyük",
    deck: "groesse",
    vocabId: "a1_0845",
  },
  {
    id: "klein",
    lemma: "klein",
    attributive: "kleine",
    translation_tr: "küçük",
    deck: "groesse",
  },
  {
    id: "neu",
    lemma: "neu",
    attributive: "neue",
    translation_tr: "yeni",
    deck: "neuheit",
  },
  {
    id: "alt",
    lemma: "alt",
    attributive: "alte",
    translation_tr: "eski",
    deck: "neuheit",
  },
  {
    id: "gut",
    lemma: "gut",
    attributive: "gute",
    translation_tr: "iyi",
    deck: "qualitaet",
  },
  {
    id: "schoen",
    lemma: "schön",
    attributive: "schöne",
    translation_tr: "güzel",
    deck: "qualitaet",
  },
  {
    id: "rot",
    lemma: "rot",
    attributive: "rote",
    translation_tr: "kırmızı",
    deck: "farbe",
  },
  {
    id: "schwarz",
    lemma: "schwarz",
    attributive: "schwarze",
    translation_tr: "siyah",
    deck: "farbe",
  },
  {
    id: "weiss",
    lemma: "weiß",
    attributive: "weiße",
    translation_tr: "beyaz",
    deck: "farbe",
  },
  {
    id: "jung",
    lemma: "jung",
    attributive: "junge",
    translation_tr: "genç",
    deck: "alter",
    vocabId: "a1_0743",
  },
  {
    id: "freundlich",
    lemma: "freundlich",
    attributive: "freundliche",
    translation_tr: "nazik",
    deck: "charakter",
    vocabId: "a1_0844",
  },
];

export const ADJEKTIV_DECK_META: {
  id: EngineAdjectiveDeck;
  title: string;
  titleTr: string;
  desc: string;
}[] = [
  {
    id: "intro",
    title: "Yeni parça",
    titleTr: "Artikel + Sıfat + İsim",
    desc: "nächste ile kalıbı keşfet",
  },
  {
    id: "groesse",
    title: "Boyut",
    titleTr: "groß · klein",
    desc: "der große Park · das kleine Hotel",
  },
  {
    id: "neuheit",
    title: "Yenilik",
    titleTr: "neu · alt",
    desc: "der neue Bahnhof · die alte Schule",
  },
  {
    id: "qualitaet",
    title: "Kalite",
    titleTr: "gut · schön",
    desc: "das gute Restaurant · die schöne Stadt",
  },
  {
    id: "farbe",
    title: "Renk",
    titleTr: "rot · schwarz · weiß",
    desc: "der rote Ball · das weiße Auto",
  },
  {
    id: "alter",
    title: "Yaş",
    titleTr: "jung · alt",
    desc: "der junge Mann · das alte Haus",
  },
  {
    id: "charakter",
    title: "Karakter",
    titleTr: "freundlich",
    desc: "der freundliche Lehrer",
  },
  {
    id: "motor",
    title: "Motor — karışık",
    titleTr: "Tüm sıfatlar",
    desc: "Engine otomatik üretir",
  },
];

export function getEngineAdjectives(deck?: EngineAdjectiveDeck): EngineAdjective[] {
  if (!deck) return ENGINE_ADJECTIVES;
  if (deck === "motor") return ENGINE_ADJECTIVES.filter((a) => a.id !== "naechste");
  return ENGINE_ADJECTIVES.filter((a) => a.deck === deck);
}

export function getEngineAdjective(id: string): EngineAdjective | undefined {
  return ENGINE_ADJECTIVES.find((a) => a.id === id);
}

/** der große Bahnhof */
export function attributivePhrase(
  article: "der" | "die" | "das",
  adj: EngineAdjective,
  noun: string
): string {
  return `${article} ${adj.attributive} ${noun}`;
}

export function woIstWithAdj(place: WoIstPlace, adj: EngineAdjective): string {
  return `Wo ist ${attributivePhrase(place.article, adj, place.word)}?`;
}

export interface Pattern02Example {
  de: string;
  tr: string;
  article: "der" | "die" | "das";
  noun: string;
}

/** Sıfat + tüm uygun yer isimleri → otomatik örnek üret */
export function generatePattern02Examples(
  adj: EngineAdjective,
  limit = 6,
  seed = 0
): Pattern02Example[] {
  const places = getWoIstPlaces();
  let s = seed || adj.id.length * 997;
  const order = shuffleIndices(places.length, s);
  const out: Pattern02Example[] = [];

  for (let i = 0; i < Math.min(limit, places.length); i++) {
    const place = places[order[i]];
    const de = attributivePhrase(place.article, adj, place.word);
    out.push({
      de,
      tr: `${adj.translation_tr} ${place.translation_tr}`,
      article: place.article,
      noun: place.word,
    });
  }
  return out;
}

/** Wo ist der große Bahnhof? vb. */
export function generateWoIstAdjExamples(
  adj: EngineAdjective,
  limit = 4,
  seed = 0
): { de: string; tr: string }[] {
  return generatePattern02Examples(adj, limit, seed).map((ex) => {
    const place = getWoIstPlaces().find((p) => p.word === ex.noun);
    if (!place) return { de: `Wo ist ${ex.de}?`, tr: `${ex.tr} nerede?` };
    return {
      de: woIstWithAdj(place, adj),
      tr: `${adj.translation_tr} ${place.translation_tr} nerede?`,
    };
  });
}

/** A1 kelime bankasından sıfat etiketli kelimeler + engine listesi */
export function getVocabAdjectives(): VocabularyWord[] {
  return getA1Vocabulary().words.filter((w) => w.tags?.includes("adjective"));
}

/** Bir kelime Pattern 02 ile kullanılabilir mi? */
export function pattern02ForLemma(lemma: string): EngineAdjective | undefined {
  const lower = lemma.toLowerCase();
  return ENGINE_ADJECTIVES.find(
    (a) => a.lemma.toLowerCase() === lower || a.attributive.toLowerCase() === lower
  );
}

function shuffleIndices(n: number, seed: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  let s = seed;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export const PATTERN02_FORMULA = [
  { de: "Wo", tr: "nerede", role: "question" as const },
  { de: "ist", tr: "dır / dir", role: "verb" as const },
  { de: "der / die / das", tr: "artikel", role: "slot" as const },
  { de: "große / nächste / gute …", tr: "sıfat (-e)", role: "slot" as const },
  { de: "Bahnhof / Hotel …", tr: "isim", role: "slot" as const },
  { de: "?", tr: "soru", role: "question" as const },
];

export const PATTERN02_RULES = [
  { label: "Kalıp", tr: "Artikel + Sıfat + İsim (isimden ÖNCE sıfat)" },
  { label: "-e", tr: "der/die/das sonrası: groß→große, gut→gute, klein→kleine" },
  { label: "nächste", tr: "Özel sıfat — hepsinde nächste (en yakın)" },
  { label: "Motor", tr: "Yeni sıfat öğrenince aynı kalıp, sadece orta blok değişir" },
];
