/**
 * Cümle Motoru — iletişim omurgası: söylem, soru, yanıt
 */
import { getA1Vocabulary } from "@german-coach/vocabulary";
import { getConjugationMatrix, type ConjugationVerb } from "@/lib/grundlagen";

export type AspectId = "statement" | "question" | "answer";
export type SpinePersonId = "ich" | "du" | "wir" | "er";

export const ASPECTS: {
  id: AspectId;
  label: string;
  labelDe: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "statement",
    label: "Söylem",
    labelDe: "Aussage",
    description: "Bir şey söylemek — ich mache, du willst, wir können…",
    icon: "A",
  },
  {
    id: "question",
    label: "Soru",
    labelDe: "Frage",
    description: "Sormak — Möchtest du…? Was machst du?",
    icon: "?",
  },
  {
    id: "answer",
    label: "Yanıt",
    labelDe: "Antwort",
    description: "Cevap vermek — Ja, ich möchte. / Nein, danke.",
    icon: "+",
  },
];

/** Omurga fiilleri — çekim matrisinden yüklenir */
export const SPINE_VERB_IDS = [
  "machen",
  "wollen",
  "moechten",
  "koennen",
  "muessen",
  "haben",
  "sein",
] as const;

export type SpineVerbId = (typeof SPINE_VERB_IDS)[number];

export const SPINE_PERSONS: { id: SpinePersonId; de: string; tr: string }[] = [
  { id: "ich", de: "ich", tr: "ben" },
  { id: "du", de: "du", tr: "sen" },
  { id: "wir", de: "wir", tr: "biz" },
  { id: "er", de: "er", tr: "o" },
];

export interface BuiltSentence {
  de: string;
  tr: string;
  breakdown: string;
  pronoun: string;
  verbForm: string;
}

export interface FormQuiz {
  id: string;
  kind: "form";
  prompt_tr: string;
  prompt_de: string;
  options: string[];
  correctIndex: number;
  explanation_tr: string;
}

export interface ReorderQuiz {
  id: string;
  kind: "reorder";
  prompt_tr: string;
  tokens: string[];
  distractors: string[];
  answer_de: string;
  hint_tr: string;
}

export type MotorQuiz = FormQuiz | ReorderQuiz;

const ANSWER_TEMPLATES: Record<
  string,
  { ja: { de: string; tr: string }; nein: { de: string; tr: string } }
> = {
  moechten: {
    ja: { de: "Ja, ich möchte.", tr: "Evet, isterim." },
    nein: { de: "Nein, danke.", tr: "Hayır, teşekkürler." },
  },
  wollen: {
    ja: { de: "Ja, ich will.", tr: "Evet, istiyorum." },
    nein: { de: "Nein, ich will nicht.", tr: "Hayır, istemiyorum." },
  },
  koennen: {
    ja: { de: "Ja, ich kann.", tr: "Evet, yapabilirim." },
    nein: { de: "Nein, ich kann nicht.", tr: "Hayır, yapamam." },
  },
  machen: {
    ja: { de: "Ja, das mache ich.", tr: "Evet, yapıyorum." },
    nein: { de: "Nein, das mache ich nicht.", tr: "Hayır, yapmıyorum." },
  },
  default: {
    ja: { de: "Ja.", tr: "Evet." },
    nein: { de: "Nein.", tr: "Hayır." },
  },
};

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getVerb(verbId: string): ConjugationVerb | undefined {
  return getConjugationMatrix().verbs.find((v) => v.id === verbId);
}

function getRow(verb: ConjugationVerb, personId: SpinePersonId) {
  return verb.rows.find((r) => r.personId === personId);
}

function pickVocabComplement(verbId: string): { de: string; tr: string } | null {
  const words = getA1Vocabulary().words;
  if (verbId === "sein") {
    const w = words.find((x) => x.word === "Student") ?? words.find((x) => x.category === "Tanışma");
    return w ? { de: w.word, tr: w.translation_tr } : { de: "müde", tr: "yorgun" };
  }
  if (verbId === "haben") {
    const w = words.find((x) => x.word === "Hunger") ?? words.find((x) => x.tags.includes("food"));
    return w ? { de: w.word, tr: w.translation_tr } : { de: "Zeit", tr: "zaman" };
  }
  const w = words[Math.floor(Math.random() * Math.min(words.length, 200))];
  if (!w) return null;
  if (["wollen", "koennen", "muessen"].includes(verbId)) {
    const inf = w.word.match(/^[a-zäöüß]+en$/) ? w.word : "lernen";
    return { de: inf, tr: `${w.translation_tr} (fiil)` };
  }
  if (verbId === "moechten" || verbId === "wollen") {
    const n = w.article ? `${w.article === "der" ? "einen" : w.article === "die" ? "eine" : "ein"} ${w.word}` : w.word;
    return { de: n, tr: w.translation_tr };
  }
  return { de: w.word, tr: w.translation_tr };
}

export function getSpineVerbs(): ConjugationVerb[] {
  const all = getConjugationMatrix().verbs;
  return SPINE_VERB_IDS.map((id) => all.find((v) => v.id === id)).filter(
    Boolean
  ) as ConjugationVerb[];
}

export function buildSentence(
  aspect: AspectId,
  personId: SpinePersonId,
  verbId: string,
  complement?: { de: string; tr: string } | null
): BuiltSentence | null {
  const verb = getVerb(verbId);
  if (!verb) return null;
  const row = getRow(verb, personId);
  if (!row) return null;

  const pronoun = row.pronoun_de;
  const form = row.form;
  const comp = complement ?? pickVocabComplement(verbId);
  const personTr = row.pronoun_tr;

  if (aspect === "statement") {
    const ex = verb.examples.find((e) => e.personId === personId);
    if (ex) {
      return {
        de: ex.de,
        tr: ex.tr,
        breakdown: `${personTr} → ${form}`,
        pronoun,
        verbForm: form,
      };
    }
    let de = `${cap(pronoun)} ${form}`;
    let tr = `${personTr} …`;
    if (comp) {
      if (["wollen", "koennen", "muessen"].includes(verbId)) {
        de = `${cap(pronoun)} ${form} ${comp.de}.`;
        tr = `${personTr} ${comp.de} ${verb.tr}.`;
      } else if (verbId === "sein") {
        de = `${cap(pronoun)} ${form} ${comp.de}.`;
        tr = `${personTr} ${comp.tr}.`;
      } else if (verbId === "haben") {
        de = `${cap(pronoun)} ${form} ${comp.de}.`;
        tr = `${personTr} ${comp.tr} var.`;
      } else {
        de = `${cap(pronoun)} ${form} ${comp.de}.`;
        tr = `${personTr} ${comp.tr} ${verb.tr}.`;
      }
    } else {
      de += ".";
    }
    return { de, tr, breakdown: `${personTr} → ${form}`, pronoun, verbForm: form };
  }

  if (aspect === "question") {
    if (personId === "du") {
      const qForm =
        verbId === "sein"
          ? "bist"
          : verbId === "haben"
            ? "hast"
            : form.endsWith("e")
              ? form + "st"
              : form + "st";
      if (verbId === "machen") {
        return {
          de: "Was machst du?",
          tr: "Ne yapıyorsun?",
          breakdown: "Was + fiil (2. sıra) + du",
          pronoun: "du",
          verbForm: qForm,
        };
      }
      if (verbId === "moechten" && comp) {
        return {
          de: `Möchtest du ${comp.de}?`,
          tr: `${comp.tr} ister misin?`,
          breakdown: "Fiil başta + du",
          pronoun: "du",
          verbForm: "möchtest",
        };
      }
      return {
        de: `${cap(qForm === "bist" ? "Bist" : qForm.charAt(0).toUpperCase() + qForm.slice(1))} du${comp ? ` ${comp.de}` : ""}?`,
        tr: comp ? `${comp.tr} … misin?` : "… misin?",
        breakdown: "Ja/Nein sorusu — fiil 1. sırada",
        pronoun: "du",
        verbForm: qForm,
      };
    }
    return {
      de: `Was ${form} ${pronoun}?`,
      tr: `${personTr} ne ${verb.tr}?`,
      breakdown: "W-Frage: Was + fiil + özne",
      pronoun,
      verbForm: form,
    };
  }

  // answer
  const tmpl = ANSWER_TEMPLATES[verbId] ?? ANSWER_TEMPLATES.default;
  const pick = Math.random() > 0.5 ? tmpl.ja : tmpl.nein;
  return {
    de: pick.de,
    tr: pick.tr,
    breakdown: "Kısa cevap kalıbı",
    pronoun: "ich",
    verbForm: getRow(verb, "ich")?.form ?? "",
  };
}

export function conjugationTableForVerb(verbId: string, persons = SPINE_PERSONS) {
  const verb = getVerb(verbId);
  if (!verb) return [];
  return persons.map((p) => {
    const row = getRow(verb, p.id);
    return {
      person: p,
      form: row?.form ?? "—",
      example: verb.examples.find((e) => e.personId === p.id),
    };
  });
}

function shuffle<T>(arr: T[], seed = 0): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateMotorQuizzes(count = 8, seed = Date.now()): MotorQuiz[] {
  const verbs = getSpineVerbs();
  const quizzes: MotorQuiz[] = [];
  let s = seed;

  for (let i = 0; i < count; i++) {
    const verb = verbs[i % verbs.length];
    const person = SPINE_PERSONS[i % SPINE_PERSONS.length];
    const row = getRow(verb, person.id);
    if (!row) continue;

    const wrongForms = verb.rows
      .filter((r) => r.personId !== person.id && r.form !== row.form)
      .map((r) => r.form);
    const options = shuffle(
      [row.form, ...wrongForms.slice(0, 3)],
      s++
    ).slice(0, 4);
    while (options.length < 4 && wrongForms.length) {
      const extra = wrongForms[options.length];
      if (extra && !options.includes(extra)) options.push(extra);
      else break;
    }

    quizzes.push({
      id: `form-${verb.id}-${person.id}-${i}`,
      kind: "form",
      prompt_tr: `${person.tr} için doğru fiil formu (${verb.tr}):`,
      prompt_de: `${cap(person.de)} ___ .`,
      options,
      correctIndex: options.indexOf(row.form),
      explanation_tr: `${person.tr} → ${row.form} (${verb.infinitive})`,
    });

    const built = buildSentence("statement", person.id, verb.id);
    if (built && built.de.includes(" ")) {
      const tokens = built.de.replace(/\.$/, "").split(/\s+/);
      if (tokens.length >= 3 && tokens.length <= 7) {
        const distractor =
          person.id === "ich"
            ? "du"
            : person.id === "du"
              ? "ich"
              : "du";
        quizzes.push({
          id: `reorder-${verb.id}-${person.id}-${i}`,
          kind: "reorder",
          prompt_tr: built.tr,
          tokens,
          distractors: [distractor],
          answer_de: built.de.endsWith(".") ? built.de : `${built.de}.`,
          hint_tr: built.breakdown,
        });
      }
    }
  }

  return shuffle(quizzes, seed).slice(0, count);
}

export const MOTOR_LINKS = [
  { href: "/grundlagen/patterns", label: "Kalıp ezberleme", desc: "52 kalıp × kelime" },
  { href: "/grundlagen/conjugation", label: "Fiil çekim matrisi", desc: "9 kişi drill" },
  { href: "/grundlagen/satz", label: "Cümle kur", desc: "Kelime dizme" },
  { href: "/grundlagen/word-order", label: "Kelime sırası", desc: "Soru & SVO" },
  { href: "/cards", label: "Kelime kartları", desc: "852 A1 kelime" },
];
