import {
  getA1Core,
  getArtikelTrainer,
  getConjugationMatrix,
  getDativTrainer,
  getNegationTrainer,
  getPatternTrainer,
  getPossessiveTrainer,
  getPrepositionsTrainer,
  getWordOrderTrainer,
  type A1CoreData,
  type GrammarReferenceBlock,
  type GrundlagenItem,
} from "../grundlagen";
import { getA2Core } from "../grundlagen/a2Core";
import type { GrammarRuleRef, GrammarSource } from "./types";

const MODAL_IDS = new Set(["koennen", "muessen", "moechten", "wollen", "duerfen"]);

function firstExample(
  items: GrundlagenItem[] | { de: string; tr: string }[] | undefined
): { de: string; tr: string } | null {
  if (!items?.length) return null;
  const ex = items[0];
  return { de: ex.de, tr: ex.tr };
}

function fromRefBlock(block: GrammarReferenceBlock | undefined): {
  summary: string;
  example: { de: string; tr: string } | null;
} {
  if (!block) return { summary: "", example: null };
  const summary = block.items[0]?.tr ?? block.titleTr ?? block.title;
  const example = firstExample(block.examples) ?? firstExample(block.items);
  return { summary, example };
}

function grammarPackSection(sectionId: string) {
  return getA1Core().grammarPack.sections.find((s) => s.id === sectionId);
}

function grammarBlock(block: string, grammar: A1CoreData["grammar"]) {
  switch (block) {
    case "pronouns":
      return {
        summary: grammar.pronouns.items[0]?.tr ?? "Şahıs zamirleri",
        example: firstExample(grammar.pronouns.items),
      };
    case "sein":
      return {
        summary: grammar.sein.conjugation[0]?.tr ?? "olmak",
        example: firstExample(grammar.sein.examples),
      };
    case "haben":
      return {
        summary: grammar.haben.conjugation[0]?.tr ?? "sahip olmak",
        example: firstExample(grammar.haben.examples),
      };
    case "modals":
      return {
        summary: grammar.modals[0]?.tr ?? "Modal fiiller",
        example: grammar.modals[0]?.examples[0] ?? null,
      };
    case "patterns":
      return {
        summary: grammar.patterns.items[0]?.tr ?? "Cümle kalıpları",
        example: grammar.patterns.items[0]
          ? {
              de: grammar.patterns.items[0].example_de ?? grammar.patterns.items[0].de,
              tr: grammar.patterns.items[0].example_tr ?? grammar.patterns.items[0].tr,
            }
          : null,
      };
    case "trennbareVerben": {
      const v = grammar.trennbareVerben.verbs[0];
      return {
        summary: grammar.trennbareVerben.titleTr,
        example: v ? { de: v.example_de, tr: v.example_tr } : null,
      };
    }
    default: {
      const b = grammar[block as keyof typeof grammar] as GrammarReferenceBlock | undefined;
      if (b && "items" in b) return fromRefBlock(b);
      return { summary: "", example: null };
    }
  }
}

function a2Section(sectionId: string) {
  const sec = getA2Core().grammarPack.sections.find((s) => s.id === sectionId);
  if (!sec) return { summary: "", example: null };
  const exDe = sec.examples[0] ?? "";
  return {
    summary: sec.summary_tr,
    example: exDe ? { de: exDe, tr: "" } : null,
  };
}

export function extractRuleContent(ref: GrammarRuleRef): {
  title: string;
  titleDe?: string;
  summary: string;
  exampleDe: string;
  exampleTr: string;
} {
  const core = getA1Core();
  let summary = "";
  let example: { de: string; tr: string } | null = null;

  for (const src of ref.sources) {
    const extracted = extractFromSource(src, core);
    if (!summary && extracted.summary) summary = extracted.summary;
    if (!example && extracted.example) example = extracted.example;
    if (summary && example) break;
  }

  if (ref.level === "A2" && ref.sources[0]?.kind === "a2-section") {
    const a2 = a2Section(ref.sources[0].sectionId);
    summary = a2.summary;
    example = a2.example;
  }

  const wo = getWordOrderTrainer();
  if (ref.id === "word-order-svo") {
    const sec = wo.sections.find((s) => s.id === "statement");
    if (sec) {
      summary = sec.rule_tr;
      example = sec.examples[0] ?? null;
    }
  }

  if (!summary) summary = ref.titleTr;
  if (!example) example = { de: "—", tr: "Örnek modülde" };

  return {
    title: ref.titleTr,
    titleDe: ref.titleDe,
    summary,
    exampleDe: example.de,
    exampleTr: example.tr,
  };
}

function extractFromSource(
  src: GrammarSource,
  core: A1CoreData
): { summary: string; example: { de: string; tr: string } | null } {
  switch (src.kind) {
    case "grammar-pack": {
      const sec = grammarPackSection(src.sectionId);
      if (!sec) return { summary: "", example: null };
      const summary = sec.reference.items[0]?.tr ?? sec.titleTr;
      const example =
        firstExample(sec.reference.examples) ?? firstExample(sec.reference.items);
      return { summary, example };
    }
    case "grammar-block":
      return grammarBlock(src.block, core.grammar);
    case "fragewoerter":
      return {
        summary: core.fragewoerter.items[0]?.tr ?? "Soru kelimeleri",
        example: firstExample(core.fragewoerter.items),
      };
    case "conjugation": {
      const verbs = getConjugationMatrix().verbs.filter((v) => {
        if (src.verbIds?.length) return src.verbIds.includes(v.id);
        return v.id !== "sein" && v.id !== "haben" && !MODAL_IDS.has(v.id);
      });
      const v = verbs[0];
      return {
        summary: v ? `${v.infinitive} — ${v.tr}` : "Fiil çekimi",
        example: v?.examples[0] ? { de: v.examples[0].de, tr: v.examples[0].tr } : null,
      };
    }
    case "trainer-set": {
      if (src.trainer === "possessives") {
        const trainer = getPossessiveTrainer();
        const sets = src.setIds?.length
          ? trainer.sets.filter((s) => src.setIds!.includes(s.id))
          : trainer.sets;
        const set = sets[0];
        const rule = trainer.rules[0];
        return {
          summary: rule?.owner_tr ?? set?.owner_tr ?? "",
          example: set?.examples[0]
            ? { de: set.examples[0].de, tr: set.examples[0].tr }
            : null,
        };
      }
      const trainer = getTrainer(src.trainer);
      const sets = src.setIds?.length
        ? trainer.sets.filter((s) => src.setIds!.includes(s.id))
        : trainer.sets;
      const set = sets[0];
      const rule = trainer.rules[0];
      return {
        summary: rule?.tr ?? set?.title_tr ?? "",
        example: set?.examples[0]
          ? { de: set.examples[0].de, tr: set.examples[0].tr }
          : null,
      };
    }
    case "word-order": {
      const wo = getWordOrderTrainer();
      const sec = wo.sections.find((s) => src.sectionIds?.includes(s.id));
      if (!sec) return { summary: "", example: null };
      return { summary: sec.rule_tr, example: sec.examples[0] ?? null };
    }
    case "patterns": {
      const p = getPatternTrainer().patterns[0];
      const ex = p?.examples[0];
      return {
        summary: p?.template_tr ?? "",
        example: ex ? { de: ex.de, tr: ex.tr } : null,
      };
    }
    case "satz":
      return {
        summary: core.sentenceBuilder.titleTr,
        example: null,
      };
    case "a2-section":
      return a2Section(src.sectionId);
    default:
      return { summary: "", example: null };
  }
}

function getTrainer(trainer: "artikel" | "dativ" | "negation" | "prepositions") {
  switch (trainer) {
    case "artikel":
      return getArtikelTrainer();
    case "dativ":
      return getDativTrainer();
    case "negation":
      return getNegationTrainer();
    case "prepositions":
      return getPrepositionsTrainer();
  }
}
