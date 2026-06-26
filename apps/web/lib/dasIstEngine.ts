import { getA1Vocabulary, type VocabularyWord } from "@german-coach/vocabulary";

export type DasIstDeckId = "es" | "er" | "sie" | "mixed";

export interface DasIstNoun {
  id: string;
  word: string;
  article: "der" | "die" | "das";
  translation_tr: string;
  deck: DasIstDeckId[];
  vocabId?: string;
}

export interface DasIstAdj {
  id: string;
  lemma: string;
  translation_tr: string;
}

export interface DasIstPair {
  noun: DasIstNoun;
  adjective: DasIstAdj;
  line1_de: string;
  line1_tr: string;
  line2_de: string;
  line2_tr: string;
  pronoun: "Er" | "Sie" | "Es";
  indefinite: "ein" | "eine";
}

const EXTRA_NOUNS: Omit<DasIstNoun, "deck">[] = [
  { id: "hotel", word: "Hotel", article: "das", translation_tr: "otel" },
  { id: "markt", word: "Markt", article: "der", translation_tr: "pazar" },
  { id: "strand", word: "Strand", article: "der", translation_tr: "sahil" },
  { id: "zoo", word: "Zoo", article: "der", translation_tr: "hayvanat bahçesi" },
];

const NOUN_LIST: { name: string; deck: DasIstDeckId }[] = [
  { name: "Hotel", deck: "es" },
  { name: "Café", deck: "es" },
  { name: "Restaurant", deck: "es" },
  { name: "Krankenhaus", deck: "es" },
  { name: "Kino", deck: "es" },
  { name: "Supermarkt", deck: "er" },
  { name: "Bahnhof", deck: "er" },
  { name: "Park", deck: "er" },
  { name: "Strand", deck: "er" },
  { name: "Markt", deck: "er" },
  { name: "Zoo", deck: "er" },
  { name: "Apotheke", deck: "sie" },
  { name: "Bank", deck: "sie" },
  { name: "Universität", deck: "sie" },
  { name: "Post", deck: "sie" },
  { name: "Toilette", deck: "sie" },
];

export const PRONOUN_BRIDGE = [
  { article: "der", indef: "ein", pronoun: "Er", tr: "o (eril)" },
  { article: "die", indef: "eine", pronoun: "Sie", tr: "o (dişil)" },
  { article: "das", indef: "ein", pronoun: "Es", tr: "o (nötr)" },
] as const;

export const DAS_IST_RULES = [
  { label: "Satır 1", tr: "Das ist + ein/eine + İsim — ilk tanıtım (belirsiz artikel)" },
  { label: "Satır 2", tr: "Er / Sie / Es + ist + sıfat — artık bildiğin şey hakkında yorum" },
  { label: "der → Er", tr: "der Supermarkt → Er ist sehr gut." },
  { label: "die → Sie", tr: "die Apotheke → Sie ist geöffnet." },
  { label: "das → Es", tr: "das Hotel → Es ist sehr schön." },
];

export const DAS_IST_LESSON = {
  badge: "Pattern 03 · İki satır",
  title: "Das ist … → Er / Es / Sie",
  summary:
    "Önce tanıt, sonra yorum yap. Bu kalıp A1'in en önemli motor parçalarından biri — öğrenince yüzlerce cümleyi aynı mantıkla kurarsın.",
  sections: [
    {
      id: "ein",
      title: "1. cümlede neden ein / eine?",
      body: "İlk defa tanıtıyorsun: Das ist ein Hotel = Bu bir otel. ein/eine belirsiz artikeldir — henüz «o otel» demiyorsun, «bir otel» diyorsun.",
      variant: "default" as const,
    },
    {
      id: "es",
      title: "2. cümlede neden Es / Er / Sie?",
      body: "Artık hangi şeyden bahsettiğini biliyoruz. Es ist sehr schön = O çok güzel. Buradaki zamir, ismin artikelinden gelir — das Hotel → Es, der Supermarkt → Er, die Apotheke → Sie.",
      variant: "default" as const,
    },
    {
      id: "two-das",
      title: "İki farklı «Das» — çoğu öğrenciyi şaşırtır",
      body: "Das ist… cümle başında «Bu…» demektir (This is…). das Hotel içindeki das ise artikeldir. Aynı yazılır, görevleri farklıdır.",
      variant: "callout" as const,
    },
    {
      id: "steps",
      title: "Nasıl çalışacaksın?",
      body: "Önce sadece Es, sonra Er, sonra Sie, en son karışık. Her adımda tek zamir — kafa karışmasın. Anlatımı oku → örneği dinle → 8 soru.",
      variant: "tip" as const,
    },
  ],
  twoDas: {
    left: {
      label: "Das = Bu (tanıtım)",
      de: "Das ist ein Hotel.",
      tr: "Cümlenin başında — «Bu bir otel»",
    },
    right: {
      label: "das = artikel",
      de: "das Hotel → Es",
      tr: "İsmin cinsiyeti — nötr → zamir es",
    },
  },
};

export const DAS_IST_ADJECTIVES: DasIstAdj[] = [
  { id: "schoen", lemma: "schön", translation_tr: "güzel" },
  { id: "gut", lemma: "gut", translation_tr: "iyi" },
  { id: "gross", lemma: "groß", translation_tr: "büyük" },
  { id: "klein", lemma: "klein", translation_tr: "küçük" },
  { id: "neu", lemma: "neu", translation_tr: "yeni" },
  { id: "seltsam", lemma: "seltsam", translation_tr: "garip" },
];

export const DAS_IST_DECKS: {
  id: DasIstDeckId;
  title: string;
  titleTr: string;
  desc: string;
  pronounOnly: "Er" | "Sie" | "Es" | null;
}[] = [
  {
    id: "es",
    title: "Adım 1 — Es",
    titleTr: "das → Es",
    desc: "Hotel · Café · Restaurant — sadece Es",
    pronounOnly: "Es",
  },
  {
    id: "er",
    title: "Adım 2 — Er",
    titleTr: "der → Er",
    desc: "Supermarkt · Bahnhof · Park",
    pronounOnly: "Er",
  },
  {
    id: "sie",
    title: "Adım 3 — Sie",
    titleTr: "die → Sie",
    desc: "Apotheke · Bank · Post",
    pronounOnly: "Sie",
  },
  {
    id: "mixed",
    title: "Adım 4 — Karışık",
    titleTr: "Er · Sie · Es",
    desc: "Artikel → zamir köprüsü",
    pronounOnly: null,
  },
];

function findVocab(name: string): VocabularyWord | undefined {
  return getA1Vocabulary().words.find(
    (w) => w.word.toLowerCase() === name.toLowerCase()
  );
}

function buildNouns(): DasIstNoun[] {
  const out: DasIstNoun[] = [];
  for (const { name, deck } of NOUN_LIST) {
    const w = findVocab(name);
    if (w?.article && (w.article === "der" || w.article === "die" || w.article === "das")) {
      const decks: DasIstDeckId[] = [deck, "mixed"];
      const existing = out.find((n) => n.id === w.id);
      if (existing) {
        if (!existing.deck.includes(deck)) existing.deck.push(deck);
        continue;
      }
      out.push({
        id: w.id,
        word: w.word,
        article: w.article,
        translation_tr: w.translation_tr,
        deck: decks,
        vocabId: w.id,
      });
      continue;
    }
    const extra = EXTRA_NOUNS.find((e) => e.word.toLowerCase() === name.toLowerCase());
    if (extra) {
      out.push({ ...extra, deck: [deck, "mixed"] });
    }
  }
  return out;
}

let _nouns: DasIstNoun[] | null = null;

export function getDasIstNouns(deck?: DasIstDeckId): DasIstNoun[] {
  if (!_nouns) _nouns = buildNouns();
  if (!deck) return _nouns;
  return _nouns.filter((n) => n.deck.includes(deck));
}

export function indefiniteFor(article: DasIstNoun["article"]): "ein" | "eine" {
  return article === "die" ? "eine" : "ein";
}

export function pronounFor(article: DasIstNoun["article"]): "Er" | "Sie" | "Es" {
  if (article === "der") return "Er";
  if (article === "die") return "Sie";
  return "Es";
}

export function buildPair(noun: DasIstNoun, adj: DasIstAdj): DasIstPair {
  const indef = indefiniteFor(noun.article);
  const pro = pronounFor(noun.article);
  const line1 = `Das ist ${indef} ${noun.word}.`;
  const line2 = `${pro} ist sehr ${adj.lemma}.`;
  return {
    noun,
    adjective: adj,
    line1_de: line1,
    line1_tr: `Bu bir ${noun.translation_tr}.`,
    line2_de: line2,
    line2_tr: `Çok ${adj.translation_tr}.`,
    pronoun: pro,
    indefinite: indef,
  };
}

export function pairFullDe(pair: DasIstPair): string {
  return `${pair.line1_de} ${pair.line2_de}`;
}

export function pairFullTr(pair: DasIstPair): string {
  return `${pair.line1_tr} ${pair.line2_tr}`;
}

export type DasIstExerciseKind = "pronoun" | "line2" | "ein" | "both";

export interface DasIstExercise {
  id: string;
  kind: DasIstExerciseKind;
  pair: DasIstPair;
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

export function buildPronounExercise(pair: DasIstPair, seed: number): DasIstExercise {
  const wrong = (["Er", "Sie", "Es"] as const).filter((p) => p !== pair.pronoun);
  return {
    id: `pro-${pair.noun.id}-${seed}`,
    kind: "pronoun",
    pair,
    prompt_tr: `"${pair.line1_tr}" dedin. İkinci cümle hangi zamirle başlar?`,
    answer_de: pair.pronoun,
    tokens: [pair.pronoun],
    distractors: shuffle([...wrong], seed),
    hint_tr: `${pair.noun.article} ${pair.noun.word} → ${pair.pronoun}`,
  };
}

export function buildLine2Exercise(pair: DasIstPair, seed: number): DasIstExercise {
  const tokens = pair.line2_de.replace(/\.$/, "").split(/\s+/);
  return {
    id: `l2-${pair.noun.id}-${seed}`,
    kind: "line2",
    pair,
    prompt_tr: `${pair.pronoun} … — ikinci cümleyi kur`,
    answer_de: pair.line2_de,
    tokens,
    distractors: shuffle(
      ["Das", "ist", "ein", "eine", "der", "die", "das", "bin", "sehr", "schön", "gut"],
      seed
    ).filter((t) => !tokens.includes(t)).slice(0, 4),
    hint_tr: `${pair.pronoun} ist sehr ${pair.adjective.lemma}`,
  };
}

export function buildEinExercise(pair: DasIstPair, seed: number): DasIstExercise {
  return {
    id: `ein-${pair.noun.id}-${seed}`,
    kind: "ein",
    pair,
    prompt_tr: `Das ist ___ ${pair.noun.word} — ein mi eine mi?`,
    answer_de: pair.indefinite,
    tokens: [pair.indefinite],
    distractors: pair.indefinite === "ein" ? ["eine", "der", "das"] : ["ein", "der", "die"],
    hint_tr: `${pair.noun.article} → ${pair.indefinite}`,
  };
}

export function buildBothExercise(pair: DasIstPair, seed: number): DasIstExercise {
  const t1 = pair.line1_de.replace(/\.$/, "").split(/\s+/);
  const t2 = pair.line2_de.replace(/\.$/, "").split(/\s+/);
  const tokens = [...t1, ...t2];
  return {
    id: `both-${pair.noun.id}-${seed}`,
    kind: "both",
    pair,
    prompt_tr: `Tanıştır + yorum: ${pair.line1_tr} ${pair.line2_tr}`,
    answer_de: pairFullDe(pair),
    tokens,
    distractors: shuffle(
      ["Er", "Sie", "Wo", "der", "die", "einen", "einer"],
      seed
    ).slice(0, 4),
    hint_tr: "Satır 1: Das ist … · Satır 2: Er/Sie/Es ist sehr …",
  };
}

export function buildDasIstDeckExercises(
  deckId: DasIstDeckId,
  count = 8,
  seed = Date.now()
): DasIstExercise[] {
  const nouns = getDasIstNouns(deckId);
  if (nouns.length === 0) return [];

  const kinds: DasIstExerciseKind[] =
    deckId === "mixed"
      ? ["pronoun", "line2", "both"]
      : deckId === "es"
        ? ["ein", "line2", "pronoun"]
        : ["pronoun", "ein", "line2"];

  const out: DasIstExercise[] = [];
  let s = seed;

  for (let i = 0; i < count; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const noun = nouns[s % nouns.length];
    const adj = DAS_IST_ADJECTIVES[(s >> 3) % DAS_IST_ADJECTIVES.length];
    const pair = buildPair(noun, adj);
    const kind = kinds[i % kinds.length];

    if (kind === "pronoun") out.push(buildPronounExercise(pair, s));
    else if (kind === "line2") out.push(buildLine2Exercise(pair, s + 1));
    else if (kind === "ein") out.push(buildEinExercise(pair, s + 2));
    else out.push(buildBothExercise(pair, s + 3));
  }

  return out;
}

export const DAS_IST_PASS_SCORE = 6;
