import raw from "../../../data/grundlagen/a1-core.json";
import patternsRaw from "../../../data/grundlagen/a1-patterns.json";
import conjugationRaw from "../../../data/grundlagen/a1-conjugation.json";
import possessivesRaw from "../../../data/grundlagen/a1-possessives.json";
import wordOrderRaw from "../../../data/grundlagen/a1-word-order.json";
import articlesRaw from "../../../data/grundlagen/a1-articles.json";
import dativRaw from "../../../data/grundlagen/a1-dativ.json";
import negationRaw from "../../../data/grundlagen/a1-negation.json";
import prepositionsRaw from "../../../data/grundlagen/a1-prepositions.json";

export interface GrundlagenItem {
  de: string;
  tr: string;
  example_de?: string;
  example_tr?: string;
}

export interface GrundlagenSection {
  id: string;
  title: string;
  items: GrundlagenItem[];
}

export interface VerbConjugation {
  infinitive: string;
  tr: string;
  forms: GrundlagenItem[];
}

export interface ModalBlock {
  verb: string;
  tr: string;
  conjugation?: GrundlagenItem[];
  examples: GrundlagenItem[];
}

export interface TrennbarVerb {
  infinitive: string;
  prefix: string;
  tr: string;
  example_de: string;
  example_tr: string;
}

export interface GrammarReferenceBlock {
  title: string;
  titleTr?: string;
  items: GrundlagenItem[];
  examples: GrundlagenItem[];
}

export interface FormField {
  de: string;
  tr: string;
  hint: string;
  label_de: string;
}

export type WordOrderTier = 1 | 2 | 3 | 4;

export interface SentenceExercise {
  id: string;
  prompt_tr: string;
  tokens: string[];
  distractors: string[];
  answer_de: string;
  hint: string;
  /** Yanlış cevapta öncelikli Türkçe açıklama */
  explanation_tr?: string;
  /** Satzstellung zorluk: 1 kolay … 4 zor */
  tier?: WordOrderTier;
}

export interface GrammarPackQuizItem {
  id: string;
  question_tr: string;
  options: string[];
  correct_index: number;
}

export interface GrammarPackSection {
  id: string;
  title: string;
  titleTr: string;
  reference: { items: GrundlagenItem[]; examples: GrundlagenItem[] };
  quiz: GrammarPackQuizItem[];
}

export interface PatternBreakdownPart {
  de: string;
  tr: string;
  role?: "verb" | "slot" | "question";
}

export interface PatternQuiz {
  type: "conjugation" | "completion";
  prompt_tr: string;
  blank: string;
  options: string[];
  correct_index: number;
}

export interface PatternExample {
  id: string;
  de: string;
  tr: string;
  breakdown: PatternBreakdownPart[];
  quiz: PatternQuiz;
  /** Kelime bankası kökeni (build:patterns) */
  wordId?: string;
  word?: string;
}

export interface PatternAnchor {
  infinitive: string;
  tr: string;
  conjugation: GrundlagenItem[];
}

export interface A1Pattern {
  id: string;
  order: number;
  template_de: string;
  template_tr: string;
  category: "statement" | "question" | "modal" | "location" | "time" | "price";
  anchor?: PatternAnchor;
  /** Kelime bankasında bu kalıba uyan kelime sayısı */
  eligibleWordCount?: number;
  examples: PatternExample[];
}

export interface PatternTrainerData {
  version: string;
  level: string;
  title: string;
  titleTr: string;
  description: string;
  patterns: A1Pattern[];
}

export type ConjugationPersonId =
  | "ich"
  | "du"
  | "er"
  | "sie_she"
  | "es"
  | "wir"
  | "ihr"
  | "Sie"
  | "sie_pl";

export interface ConjugationRow {
  personId: ConjugationPersonId;
  pronoun_de: string;
  pronoun_tr: string;
  form: string;
  form_tr: string;
}

export interface ConjugationExample {
  personId: ConjugationPersonId;
  de: string;
  tr: string;
}

export interface ConjugationDrill {
  id: string;
  verbId: string;
  personId: ConjugationPersonId;
  prompt_tr: string;
  prompt_de: string;
  blank: string;
  options: string[];
  correct_index: number;
}

export interface ConjugationVerb {
  id: string;
  infinitive: string;
  tr: string;
  order: number;
  rows: ConjugationRow[];
  examples: ConjugationExample[];
  drills: ConjugationDrill[];
}

export interface ConjugationMatrixData {
  version: string;
  level: string;
  title: string;
  titleTr: string;
  description: string;
  passThreshold: number;
  drillsPerVerb: number;
  verbs: ConjugationVerb[];
  drills: ConjugationDrill[];
}

export type PossessiveOwnerId = "mein" | "dein" | "sein" | "ihr" | "unser" | "euer" | "Ihr";

export interface PossessiveRule {
  owner: PossessiveOwnerId;
  owner_tr: string;
  masc_neut: string;
  fem_pl: string;
}

export interface PossessiveBreakdownPart {
  de: string;
  tr: string;
  role?: "name" | "verb" | "possessive" | "noun" | "job";
}

export interface PossessiveExample {
  id: string;
  de: string;
  tr: string;
  breakdown: PossessiveBreakdownPart[];
  noun: string;
  article: "der" | "die" | "das";
  owner: PossessiveOwnerId;
  possessive_form: string;
}

export interface PossessiveDrill {
  id: string;
  type: "pick_form" | "sentence_gap" | "article_match";
  prompt_tr: string;
  context_de: string;
  options: string[];
  correct_index: number;
  explanation_tr: string;
}

export interface PossessiveSet {
  id: PossessiveOwnerId;
  owner: PossessiveOwnerId;
  owner_tr: string;
  masc_neut: string;
  fem_pl: string;
  order: number;
  examples: PossessiveExample[];
  drills: PossessiveDrill[];
}

export interface PossessiveTrainerData {
  version: string;
  level: string;
  title: string;
  titleTr: string;
  description: string;
  passThreshold: number;
  drillsPerSet: number;
  rules: PossessiveRule[];
  sets: PossessiveSet[];
}

export interface TrainerBreakdownPart {
  de: string;
  tr: string;
  role?: string;
}

export interface TrainerExample {
  id: string;
  de: string;
  tr: string;
  breakdown: TrainerBreakdownPart[];
  noun: string;
  article: string;
  plural: string | null;
}

export interface TrainerDrill {
  id: string;
  type: string;
  prompt_tr: string;
  context_de: string;
  options: string[];
  correct_index: number;
  explanation_tr: string;
}

export interface TrainerSet {
  id: string;
  title: string;
  title_tr: string;
  order: number;
  examples: TrainerExample[];
  drills: TrainerDrill[];
}

export interface TrainerRule {
  label: string;
  tr: string;
}

export interface SetTrainerData {
  version: string;
  level: string;
  title: string;
  titleTr: string;
  description: string;
  passThreshold: number;
  drillsPerSet: number;
  rules: TrainerRule[];
  sets: TrainerSet[];
}

export type WordOrderCategory = "statement" | "yes_no" | "w_question" | "compare" | "mixed";
export type WordOrderExerciseType = "reorder" | "transform" | "gap" | "compare" | "spot_verb";

export interface WordOrderExercise {
  id: string;
  type: WordOrderExerciseType;
  category: WordOrderCategory;
  tier?: WordOrderTier;
  prompt_tr: string;
  hint_tr?: string;
  tokens?: string[];
  distractors?: string[];
  answer_de?: string;
  statement_de?: string;
  question_de?: string;
  context_de?: string;
  options?: string[];
  correct_index?: number;
  explanation_tr?: string;
  /** spot_verb: kelime havuzu + doğru fiil */
  word_pool?: string[];
  verb?: string;
  verb_hint_tr?: string;
}

export interface WordOrderSection {
  id: string;
  order: number;
  tier?: WordOrderTier;
  tierLabel?: string;
  title: string;
  titleTr: string;
  rule_de: string;
  rule_tr: string;
  examples: { de: string; tr: string }[];
  drill: WordOrderExercise[];
}

export const WORD_ORDER_STUFE: Record<
  WordOrderTier,
  { label: string; subtitle: string }
> = {
  1: { label: "Stufe 1 · Kolay", subtitle: "Düz cümle — özne + fiil + …" },
  2: { label: "Stufe 2 · Orta", subtitle: "Ja/Nein — fiil başa geçer" },
  3: { label: "Stufe 3 · Orta-Zor", subtitle: "W-Frage + fiil + özne" },
  4: { label: "Stufe 4 · Zor", subtitle: "Karışık kalıp + bağlaç" },
};

export function wordOrderTierForSection(sectionId: string): WordOrderTier {
  switch (sectionId) {
    case "statement":
      return 1;
    case "yes_no":
      return 2;
    case "w_question":
    case "compare":
      return 3;
    default:
      return 4;
  }
}

export interface WordOrderTrainerData {
  version: string;
  level: string;
  title: string;
  titleTr: string;
  description: string;
  passThreshold: number;
  drillsPerSection: number;
  sections: WordOrderSection[];
  megaDrill: WordOrderExercise[];
}

export interface A1CoreData {
  version: string;
  level: string;
  fragewoerter: { title: string; titleTr: string; items: GrundlagenItem[] };
  zeit: { title: string; titleTr: string; sections: GrundlagenSection[] };
  zahlen: { title: string; titleTr: string; sections: GrundlagenSection[] };
  grammar: {
    title: string;
    titleTr: string;
    pronouns: { title: string; items: GrundlagenItem[] };
    sein: { title: string; conjugation: GrundlagenItem[]; examples: GrundlagenItem[] };
    haben: { title: string; conjugation: GrundlagenItem[]; examples: GrundlagenItem[] };
    verbs: VerbConjugation[];
    modals: ModalBlock[];
    patterns: { title: string; items: GrundlagenItem[] };
    jaNein: GrammarReferenceBlock;
    akkusativ: GrammarReferenceBlock;
    trennbareVerben: { title: string; titleTr: string; verbs: TrennbarVerb[] };
    imperativ?: GrammarReferenceBlock;
    negation?: GrammarReferenceBlock;
    dativBasics?: GrammarReferenceBlock;
    plural?: GrammarReferenceBlock;
    konjunktionen?: GrammarReferenceBlock;
    perfektIntro?: GrammarReferenceBlock;
    regularRule?: GrammarReferenceBlock;
    irregularRule?: GrammarReferenceBlock;
  };
  goetheForm: { title: string; titleTr: string; fields: FormField[] };
  sentenceBuilder: { title: string; titleTr: string; exercises: SentenceExercise[] };
  grammarPack: { title: string; titleTr: string; sections: GrammarPackSection[] };
}

const data = raw as A1CoreData;
const patternData = patternsRaw as PatternTrainerData;
const conjugationData = conjugationRaw as ConjugationMatrixData;
const possessivesData = possessivesRaw as PossessiveTrainerData;
const wordOrderData = wordOrderRaw as WordOrderTrainerData;
const articlesData = normalizeSetTrainer(articlesRaw);
const dativData = normalizeSetTrainer(dativRaw);
const negationData = normalizeSetTrainer(negationRaw);
const prepositionsData = normalizeSetTrainer(prepositionsRaw);

function normalizeSetTrainer(rawData: unknown): SetTrainerData {
  const d = rawData as SetTrainerData;
  const rules = (rawData as { rules?: { article?: string; owner?: string; tr: string }[] }).rules;
  if (rules?.length && !("label" in (rules[0] ?? {}))) {
    d.rules = rules.map((r) => ({
      label: r.article ?? r.owner ?? "",
      tr: r.tr,
    }));
  }
  return d;
}

export function getA1Core(): A1CoreData {
  return data;
}

export function getPatternTrainer(): PatternTrainerData {
  return patternData;
}

export function getPatterns(): A1Pattern[] {
  return patternData.patterns;
}

export function getConjugationMatrix(): ConjugationMatrixData {
  return conjugationData;
}

export function getConjugationVerbs(): ConjugationVerb[] {
  return conjugationData.verbs;
}

export function getPossessiveTrainer(): PossessiveTrainerData {
  return possessivesData;
}

export function getPossessiveSets(): PossessiveSet[] {
  return possessivesData.sets;
}

export function getWordOrderTrainer(): WordOrderTrainerData {
  return wordOrderData;
}

export function getSentenceExercises(): SentenceExercise[] {
  return data.sentenceBuilder.exercises;
}

export function getGrammarPackSections(): GrammarPackSection[] {
  return data.grammarPack.sections;
}

export function getArtikelTrainer(): SetTrainerData {
  return articlesData;
}

export function getDativTrainer(): SetTrainerData {
  return dativData;
}

export function getNegationTrainer(): SetTrainerData {
  return negationData;
}

export function getPrepositionsTrainer(): SetTrainerData {
  return prepositionsData;
}

export const GRUNDLAGEN_MODULES = [
  {
    id: "cumle-motoru",
    href: "/grundlagen/cumle-motoru",
    de: "Kelime Oyunu",
    tr: "852 kelime · cümle",
    desc: "Gerçek cümle + okunuş + puan — sıkılmadan öğren",
    sections: 852,
  },
  {
    id: "word-order",
    href: "/grundlagen/word-order",
    de: "Word Order Trainer",
    tr: "Kelime sırası",
    desc: "Stufe 1→4: SVO · Ja/Nein · W-Fragen · 100+ drill",
    sections: wordOrderData.sections.length + 1,
  },
  {
    id: "satz",
    href: "/grundlagen/satz",
    de: "Satz Builder",
    tr: "Cümle kur",
    desc: "Kelime parçalarından A1 cümlesi oluştur",
    sections: data.sentenceBuilder.exercises.length,
  },
  {
    id: "conjugation",
    href: "/grundlagen/conjugation",
    de: "Conjugation Matrix",
    tr: "Fiil çekim matrisi",
    desc: "A1 fiilleri + Modalverben × 9 kişi drill",
    sections: conjugationData.verbs.length,
  },
  {
    id: "artikel",
    href: "/grundlagen/artikel",
    de: "Artikel Trainer",
    tr: "Artikel (der/die/das)",
    desc: "der · die · das · ein/eine · çoğul drill",
    sections: articlesData.sets.length,
  },
  {
    id: "sentence-engine",
    href: "/grundlagen/sentence-engine",
    de: "Sentence Engine",
    tr: "12 cümle kalıbı",
    desc: "Pattern 01–12 · kelime değil motor",
    sections: 12,
  },
  {
    id: "wo-ist",
    href: "/grundlagen/wo-ist",
    de: "Wo ist …?",
    tr: "Lego kalıp · yer sorusu",
    desc: "Wo · ist · der/die/das · ? — Bahnhof, Park, Café …",
    sections: 3,
  },
  {
    id: "possessives",
    href: "/grundlagen/possessives",
    de: "Possessive Trainer",
    tr: "Sahiplik zamirleri",
    desc: "der/die/das → mein/deine — 7 sahip × drill",
    sections: possessivesData.sets.length,
  },
  {
    id: "patterns",
    href: "/grundlagen/patterns",
    de: "Pattern Trainer",
    tr: "Kalıp ezberleme",
    desc: "52 A1 kalıbı × 20 örnek — fiil çekimi + sahiplik + kelime kelime",
    sections: patternData.patterns.length,
  },
  {
    id: "dativ",
    href: "/grundlagen/dativ",
    de: "Dativ Trainer",
    tr: "Dativ kalıplar",
    desc: "mit · bei · in · zu/nach — A1 sabit kalıplar",
    sections: dativData.sets.length,
  },
  {
    id: "negation",
    href: "/grundlagen/negation",
    de: "Negation Trainer",
    tr: "Olumsuzluk",
    desc: "kein/keine/keinen + nicht pozisyonu",
    sections: negationData.sets.length,
  },
  {
    id: "prepositions",
    href: "/grundlagen/prepositions",
    de: "Prepositions",
    tr: "Yer edatları",
    desc: "in · auf · an · bei · mit kalıpları",
    sections: prepositionsData.sets.length,
  },
  {
    id: "grammar-pack",
    href: "/grundlagen/grammar-pack",
    de: "Grammar Pack",
    tr: "A1 Gramer Paketi",
    desc: "16 bölüm — referans + mini quiz",
    sections: data.grammarPack.sections.length,
  },
  {
    id: "zeit",
    href: "/grundlagen/zeit",
    de: "Zeit",
    tr: "Zaman",
    desc: "Saat, günler, aylar, bugün/yarın, tarih",
    sections: data.zeit.sections.length,
  },
  {
    id: "zahlen",
    href: "/grundlagen/zahlen",
    de: "Zahlen",
    tr: "Sayılar",
    desc: "0–1000, telefon, adres, tarih",
    sections: data.zahlen.sections.length,
  },
  {
    id: "grammar",
    href: "/grundlagen/grammar",
    de: "Grammar",
    tr: "A1 Gramer",
    desc: "sein, haben, zamirler, fiiller, modal, kalıplar",
    sections: 10,
  },
  {
    id: "form",
    href: "/grundlagen/form",
    de: "Formular",
    tr: "Resmi form",
    desc: "Ad, adres, telefon, doğum tarihi, ülke",
    sections: data.goetheForm.fields.length,
  },
] as const;

/** Sayı → Almanca (0–999 basit) */
export function numberToGerman(n: number): string {
  if (n < 0 || n > 999) return String(n);
  if (n === 0) return "null";
  const ones = [
    "",
    "eins",
    "zwei",
    "drei",
    "vier",
    "fünf",
    "sechs",
    "sieben",
    "acht",
    "neun",
    "zehn",
    "elf",
    "zwölf",
    "dreizehn",
    "vierzehn",
    "fünfzehn",
    "sechzehn",
    "siebzehn",
    "achtzehn",
    "neunzehn",
  ];
  const tens = ["", "", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"];
  if (n < 20) return ones[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    if (o === 0) return tens[t];
    const one = o === 1 ? "ein" : ones[o];
    return `${one}und${tens[t]}`;
  }
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const hWord = h === 1 ? "einhundert" : `${ones[h]}hundert`;
  if (rest === 0) return hWord;
  return `${hWord}${numberToGerman(rest)}`;
}

/** Sayı → Türkçe (0–999) */
export function numberToTurkish(n: number): string {
  if (n < 0 || n > 999) return String(n);
  if (n === 0) return "sıfır";
  const ones = [
    "",
    "bir",
    "iki",
    "üç",
    "dört",
    "beş",
    "altı",
    "yedi",
    "sekiz",
    "dokuz",
    "on",
    "on bir",
    "on iki",
    "on üç",
    "on dört",
    "on beş",
    "on altı",
    "on yedi",
    "on sekiz",
    "on dokuz",
  ];
  const tens = ["", "", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
  if (n < 20) return ones[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    if (o === 0) return tens[t];
    return `${tens[t]} ${ones[o]}`;
  }
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const hWord = h === 1 ? "yüz" : `${ones[h]} yüz`;
  if (rest === 0) return hWord;
  return `${hWord} ${numberToTurkish(rest)}`;
}

export function isNumericTr(tr: string): boolean {
  return /^\d+$/.test(tr.trim());
}
