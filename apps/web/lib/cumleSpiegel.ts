import spiegelData from "../../../data/grundlagen/cumle-spiegel.json";
import type { AspectId } from "@/lib/cumleMotoru";
import {
  learnerBerufForm,
  type LearnerLevel,
  type LearnerProfile,
} from "@/lib/learnerProfileStorage";
import { approxGermanIpa } from "@/lib/germanIpa";

export interface SpiegelCardRaw {
  id: string;
  level: string[];
  aspect: AspectId;
  de: string;
  tr: string;
  ipa: string;
  tags?: string[];
}

export interface SpiegelCard {
  id: string;
  aspect: AspectId;
  de: string;
  tr: string;
  ipa: string;
}

const ASPECT_LABELS: Record<AspectId, string> = {
  statement: "Söylem",
  question: "Soru",
  answer: "Yanıt",
};

export function aspectLabel(aspect: AspectId): string {
  return ASPECT_LABELS[aspect];
}

function substitute(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? "…");
}

function personalizeCard(raw: SpiegelCardRaw, profile: LearnerProfile): SpiegelCard | null {
  const beruf = learnerBerufForm(profile);
  const vars: Record<string, string> = {
    firstName: profile.firstName || "…",
    lastName: profile.lastName || "",
    beruf: beruf.de,
    berufTr: beruf.tr,
  };

  if (raw.id.startsWith("intro-") && !profile.firstName && raw.id !== "intro-hobby") {
    if (raw.id === "intro-student") {
      /* beruf kartı isim gerektirmez */
    } else {
      return null;
    }
  }

  const de = substitute(raw.de, vars).replace(/\s+/g, " ").trim();
  const tr = substitute(raw.tr, vars).replace(/\s+/g, " ").trim();
  const ipa = raw.ipa.includes("…") && profile.firstName
    ? raw.ipa.replace("…", profile.firstName.toLowerCase())
    : raw.ipa;

  return {
    id: raw.id,
    aspect: raw.aspect,
    de: de.endsWith(".") || raw.aspect === "question" ? de : `${de}.`,
    tr,
    ipa: ipa.startsWith("[") ? ipa : approxGermanIpa(de),
  };
}

function levelMatches(cardLevels: string[], userLevel: LearnerLevel): boolean {
  if (userLevel === "unsure") return cardLevels.includes("unsure") || cardLevels.includes("a1");
  return cardLevels.includes(userLevel);
}

export function buildSpiegelDeck(profile: LearnerProfile): SpiegelCard[] {
  const raws = (spiegelData as { cards: SpiegelCardRaw[] }).cards;
  const deck: SpiegelCard[] = [];
  for (const raw of raws) {
    if (!levelMatches(raw.level, profile.level)) continue;
    const card = personalizeCard(raw, profile);
    if (card) deck.push(card);
  }
  return deck;
}

export function getSpiegelData() {
  return spiegelData as { version: string; title: string; cards: SpiegelCardRaw[] };
}
