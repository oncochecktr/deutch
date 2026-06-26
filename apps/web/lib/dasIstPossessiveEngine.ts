import { getA1Vocabulary, type VocabularyWord } from "@german-coach/vocabulary";
import type { DasIstAdj } from "@/lib/dasIstEngine";
import { DAS_IST_ADJECTIVES, pronounFor } from "@/lib/dasIstEngine";

export type PossessiveOwnerId = "mein" | "dein" | "sein" | "ihr" | "unser" | "euer" | "Ihr";

export type DasIstPossessiveDeckId = "mein" | "dein" | "unser" | "onlar" | "euer" | "mixed";

export interface PossessiveNoun {
  id: string;
  word: string;
  article: "der" | "die" | "das";
  translation_tr: string;
}

const EXTRA_NOUNS: PossessiveNoun[] = [
  { id: "lieblingsort", word: "Lieblingsort", article: "der", translation_tr: "favori yer" },
];

const NOUN_NAMES = ["Zimmer", "Familie", "Park", "Küche", "Büro"] as const;

export const POSSESSIVE_OWNERS: {
  id: PossessiveOwnerId;
  tr: string;
  mascNeut: string;
  fem: string;
  deck: DasIstPossessiveDeckId[];
}[] = [
  { id: "mein", tr: "benim", mascNeut: "mein", fem: "meine", deck: ["mein", "mixed"] },
  { id: "dein", tr: "senin", mascNeut: "dein", fem: "deine", deck: ["dein", "mixed"] },
  { id: "unser", tr: "bizim", mascNeut: "unser", fem: "unsere", deck: ["unser", "mixed"] },
  { id: "sein", tr: "onun (eril)", mascNeut: "sein", fem: "seine", deck: ["onlar", "mixed"] },
  { id: "ihr", tr: "onun (dişil)", mascNeut: "ihr", fem: "ihre", deck: ["onlar", "mixed"] },
  { id: "euer", tr: "sizin", mascNeut: "euer", fem: "eure", deck: ["euer", "mixed"] },
  { id: "Ihr", tr: "Sizin (resmi)", mascNeut: "Ihr", fem: "Ihre", deck: ["euer", "mixed"] },
];

export const POSSESSIVE_BRIDGE = [
  { article: "der", form: "mein / dein / unser …", pronoun: "Er", tr: "eril isim" },
  { article: "die", form: "meine / deine / unsere …", pronoun: "Sie", tr: "dişil isim" },
  { article: "das", form: "mein / dein / unser …", pronoun: "Es", tr: "nötr isim" },
] as const;

export const DAS_IST_MEIN_RULES = [
  { label: "Satır 1", tr: "Das ist + mein/dein/unser + İsim — «Bu benim/senin/bizim …»" },
  { label: "Satır 2", tr: "Er / Sie / Es + ist + sıfat — Pattern 03 ile aynı köprü" },
  { label: "der/das", tr: "mein · dein · unser · sein · ihr · euer · Ihr" },
  { label: "die", tr: "meine · deine · unsere · seine · ihre · eure · Ihre" },
  { label: "Hack", tr: "Artikel → zamir değişmez: das Zimmer → Es, die Familie → Sie" },
];

export const DAS_IST_MEIN_LESSON = {
  badge: "Pattern 03+ · Sahiplik",
  title: "Das ist mein … → Er / Es / Sie",
  summary:
    "Pattern 03'ün devamı: artık ein değil — mein, dein, unser. İkinci satır aynı: der→Er, die→Sie, das→Es. Kursun öğreteceği şey burada — ama sen önce motoru kap.",
  sections: [
    {
      id: "mein",
      title: "Neden mein / meine?",
      body: "Das ist mein Zimmer = Bu benim odam. Sahiplik ismin artikelına uyum sağlar: das Zimmer → mein, die Küche → meine.",
      variant: "default" as const,
    },
    {
      id: "unser",
      title: "bizim · sizin · onların",
      body: "unser Zimmer (bizim), euer Büro (sizin), sein Park (onun). Aynı kalıp — sadece sahiplik kelimesi değişir.",
      variant: "default" as const,
    },
    {
      id: "bridge",
      title: "Pattern 03 köprüsü hâlâ geçerli",
      body: "Das ist unser Zimmer. Es ist sehr klein. — das → Es. Tanıtım satırında sahiplik, yorum satırında zamir.",
      variant: "callout" as const,
    },
    {
      id: "order",
      title: "Sıra",
      body: "mein → dein → unser → onun (sein/ihr) → sizin (euer/Ihr) → karışık. Pattern 03 (ein/eine) bitince başla.",
      variant: "tip" as const,
    },
  ],
  examples: [
    { de: "Das ist mein Zimmer. Es ist sehr groß.", tr: "Bu benim odam. Çok büyük." },
    { de: "Das ist unser Zimmer. Es ist sehr klein.", tr: "Bu bizim odamız. Çok küçük." },
    { de: "Das ist mein Lieblingsort.", tr: "Bu benim favori yerim." },
  ],
};

export const DAS_IST_POSSESSIVE_DECKS: {
  id: DasIstPossessiveDeckId;
  title: string;
  titleTr: string;
  desc: string;
  owners: PossessiveOwnerId[] | null;
}[] = [
  {
    id: "mein",
    title: "Adım 1 — mein",
    titleTr: "benim",
    desc: "mein Zimmer · meine Familie",
    owners: ["mein"],
  },
  {
    id: "dein",
    title: "Adım 2 — dein",
    titleTr: "senin",
    desc: "dein Park · deine Küche",
    owners: ["dein"],
  },
  {
    id: "unser",
    title: "Adım 3 — unser",
    titleTr: "bizim",
    desc: "unser Zimmer · unsere Schule",
    owners: ["unser"],
  },
  {
    id: "onlar",
    title: "Adım 4 — onun",
    titleTr: "sein · ihr",
    desc: "onun (eril/dişil) — sein Park, ihre Familie",
    owners: ["sein", "ihr"],
  },
  {
    id: "euer",
    title: "Adım 5 — sizin",
    titleTr: "euer · Ihr",
    desc: "euer Büro · Ihre Adresse",
    owners: ["euer", "Ihr"],
  },
  {
    id: "mixed",
    title: "Adım 6 — Karışık",
    titleTr: "7 sahip",
    desc: "mein · dein · unser · sein · ihr · euer · Ihr",
    owners: null,
  },
];

function findVocab(name: string): VocabularyWord | undefined {
  return getA1Vocabulary().words.find(
    (w) => w.word.toLowerCase() === name.toLowerCase()
  );
}

function buildNouns(): PossessiveNoun[] {
  const out: PossessiveNoun[] = [...EXTRA_NOUNS];
  for (const name of NOUN_NAMES) {
    const w = findVocab(name);
    if (w?.article && (w.article === "der" || w.article === "die" || w.article === "das")) {
      out.push({
        id: w.id,
        word: w.word,
        article: w.article,
        translation_tr: w.translation_tr,
      });
    }
  }
  return out;
}

let _nouns: PossessiveNoun[] | null = null;

export function getPossessiveNouns(): PossessiveNoun[] {
  if (!_nouns) _nouns = buildNouns();
  return _nouns;
}

export function possessiveForm(
  owner: PossessiveOwnerId,
  article: PossessiveNoun["article"]
): string {
  const row = POSSESSIVE_OWNERS.find((o) => o.id === owner);
  if (!row) return owner;
  return article === "die" ? row.fem : row.mascNeut;
}

export function ownerTr(owner: PossessiveOwnerId): string {
  return POSSESSIVE_OWNERS.find((o) => o.id === owner)?.tr ?? owner;
}

export interface DasIstPossessivePair {
  noun: PossessiveNoun;
  owner: PossessiveOwnerId;
  possessive: string;
  adjective: DasIstAdj;
  line1_de: string;
  line1_tr: string;
  line2_de: string;
  line2_tr: string;
  pronoun: "Er" | "Sie" | "Es";
}

export function buildPossessivePair(
  noun: PossessiveNoun,
  owner: PossessiveOwnerId,
  adj: DasIstAdj
): DasIstPossessivePair {
  const poss = possessiveForm(owner, noun.article);
  const pro = pronounFor(noun.article);
  const ot = ownerTr(owner);
  const line1 = `Das ist ${poss} ${noun.word}.`;
  const line2 = `${pro} ist sehr ${adj.lemma}.`;
  return {
    noun,
    owner,
    possessive: poss,
    adjective: adj,
    line1_de: line1,
    line1_tr: `Bu ${ot} ${noun.translation_tr}.`,
    line2_de: line2,
    line2_tr: `Çok ${adj.translation_tr}.`,
    pronoun: pro,
  };
}

export function pairFullDe(pair: DasIstPossessivePair): string {
  return `${pair.line1_de} ${pair.line2_de}`;
}

export type PossessiveExerciseKind = "possessive" | "pronoun" | "line2" | "both";

export interface PossessiveExercise {
  id: string;
  kind: PossessiveExerciseKind;
  pair: DasIstPossessivePair;
  prompt_tr: string;
  answer_de: string;
  tokens: string[];
  distractors: string[];
  hint_tr?: string;
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

function ownersForDeck(deckId: DasIstPossessiveDeckId): PossessiveOwnerId[] {
  const deck = DAS_IST_POSSESSIVE_DECKS.find((d) => d.id === deckId);
  if (!deck?.owners) return POSSESSIVE_OWNERS.map((o) => o.id);
  return deck.owners;
}

export function buildPossessiveDeckExercises(
  deckId: DasIstPossessiveDeckId,
  count = 8,
  seed = Date.now()
): PossessiveExercise[] {
  const nouns = getPossessiveNouns();
  const owners = ownersForDeck(deckId);
  if (!nouns.length || !owners.length) return [];

  const kinds: PossessiveExerciseKind[] =
    deckId === "mixed"
      ? ["possessive", "pronoun", "both"]
      : deckId === "mein"
        ? ["possessive", "line2", "pronoun"]
        : ["pronoun", "possessive", "line2"];

  const out: PossessiveExercise[] = [];
  let s = seed;

  for (let i = 0; i < count; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const noun = nouns[s % nouns.length];
    const owner = owners[(s >> 2) % owners.length];
    const adj = DAS_IST_ADJECTIVES[(s >> 4) % DAS_IST_ADJECTIVES.length];
    const pair = buildPossessivePair(noun, owner, adj);
    const kind = kinds[i % kinds.length];

    if (kind === "possessive") {
      const wrong = POSSESSIVE_OWNERS.filter((o) => o.id !== owner)
        .map((o) => possessiveForm(o.id, noun.article))
        .filter((f) => f !== pair.possessive)
        .slice(0, 2);
      out.push({
        id: `pos-${pair.noun.id}-${owner}-${s}`,
        kind,
        pair,
        prompt_tr: `Das ist ___ ${noun.word} — ${ownerTr(owner)}`,
        answer_de: pair.possessive,
        tokens: [pair.possessive],
        distractors: shuffle(
          [...wrong, noun.article === "die" ? "ein" : "eine", "der"],
          s
        ).slice(0, 3),
        hint_tr: `${noun.article} → ${pair.possessive}`,
      });
    } else if (kind === "pronoun") {
      const wrong = (["Er", "Sie", "Es"] as const).filter((p) => p !== pair.pronoun);
      out.push({
        id: `pro-${pair.noun.id}-${owner}-${s}`,
        kind,
        pair,
        prompt_tr: `"${pair.line1_tr}" — ikinci cümle hangi zamirle başlar?`,
        answer_de: pair.pronoun,
        tokens: [pair.pronoun],
        distractors: shuffle([...wrong], s),
        hint_tr: `${pair.noun.article} ${pair.noun.word} → ${pair.pronoun}`,
      });
    } else if (kind === "line2") {
      const tokens = pair.line2_de.replace(/\.$/, "").split(/\s+/);
      out.push({
        id: `l2-${pair.noun.id}-${owner}-${s}`,
        kind,
        pair,
        prompt_tr: `${pair.pronoun} … — ikinci cümleyi kur`,
        answer_de: pair.line2_de,
        tokens,
        distractors: shuffle(["Das", "ist", "mein", "dein", "ein", "der"], s).slice(0, 4),
        hint_tr: `${pair.pronoun} ist sehr ${adj.lemma}`,
      });
    } else {
      const t1 = pair.line1_de.replace(/\.$/, "").split(/\s+/);
      const t2 = pair.line2_de.replace(/\.$/, "").split(/\s+/);
      out.push({
        id: `both-${pair.noun.id}-${owner}-${s}`,
        kind,
        pair,
        prompt_tr: `Tanıştır + yorum: ${pair.line1_tr} ${pair.line2_tr}`,
        answer_de: pairFullDe(pair),
        tokens: [...t1, ...t2],
        distractors: shuffle(["Wo", "der", "die", "einen"], s).slice(0, 4),
        hint_tr: "Satır 1: Das ist mein … · Satır 2: Es/Er/Sie ist sehr …",
      });
    }
  }

  return out;
}

export const DAS_IST_MEIN_PASS_SCORE = 6;
