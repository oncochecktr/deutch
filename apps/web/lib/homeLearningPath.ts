import type { NavIconKey } from "@/components/icons";
import type { LearningStageId } from "@/lib/learningPath";

export interface LearningMethodStep {
  order: number;
  title: string;
  body: string;
  href: string;
  cta: string;
}

export type HomeIntentId = "new" | "words" | "speak" | "grammar" | "exam";

export interface HomeIntent {
  id: HomeIntentId;
  label: string;
  description: string;
  href: string;
  icon: NavIconKey;
}

export interface RecommendedIntent {
  id: HomeIntentId;
  /** Kısa gerekçe — rozet altında veya title'da */
  reason: string;
}

export interface RecommendIntentInput {
  activeStageId: LearningStageId;
  a1Studied: number;
  srsDue: number;
  primaryHref: string;
}

export const LEARNING_METHOD_STEPS: LearningMethodStep[] = [
  {
    order: 1,
    title: "Cümle ezberle",
    body: "Kalıp cümleler — liste değil.",
    href: "/cards",
    cta: "Kartlar",
  },
  {
    order: 2,
    title: "Dikte yaz",
    body: "Dinle, yaz, kontrol et.",
    href: "/cards",
    cta: "Dikte",
  },
  {
    order: 3,
    title: "Beyin kası",
    body: "Konuş, tekrar et.",
    href: "/konus-dinle",
    cta: "Konuş-Dinle",
  },
  {
    order: 4,
    title: "Gramer",
    body: "Kuralı en sona bırak.",
    href: "/grundlagen/roadmap",
    cta: "Gramer haritası",
  },
];

export const HOME_INTENTS: HomeIntent[] = [
  {
    id: "new",
    label: "Yeni başlıyorum",
    description: "5 dk kart",
    href: "/cards",
    icon: "cards",
  },
  {
    id: "words",
    label: "Tekrar",
    description: "SRS + quiz",
    href: "/review",
    icon: "review",
  },
  {
    id: "speak",
    label: "Konuş",
    description: "Dinle, tekrarla",
    href: "/konus-dinle",
    icon: "konusDinle",
  },
  {
    id: "grammar",
    label: "Gramer",
    description: "Satz, sıra",
    href: "/grundlagen/roadmap",
    icon: "exam",
  },
  {
    id: "exam",
    label: "Sınav",
    description: "4 modül",
    href: "/exam",
    icon: "exam",
  },
];

const SRS_REVIEW_THRESHOLD = 5;

/** Öğrenme yolu + pedagoji + SRS kuyruğuna göre ana sayfa rozeti */
export function resolveRecommendedIntent(input: RecommendIntentInput): RecommendedIntent {
  const { activeStageId, a1Studied, srsDue, primaryHref } = input;

  if (activeStageId === "words") {
    if (a1Studied < 12) {
      return { id: "new", reason: "Önce birkaç kart aç" };
    }
    if (srsDue >= SRS_REVIEW_THRESHOLD) {
      return {
        id: "words",
        reason: srsDue >= 10 ? `${srsDue} tekrar bekliyor` : "Tekrar zamanı",
      };
    }
    if (a1Studied < 40) {
      return { id: "new", reason: "Kelime havuzunu büyüt" };
    }
    return { id: "words", reason: "Ezberi pekiştir" };
  }

  if (activeStageId === "grammar") {
    return { id: "grammar", reason: "Gramer sırası geldi" };
  }

  // goethe = sınav modülleri (Hören/Lesen…), Konuş-Dinle değil
  if (activeStageId === "goethe") {
    return { id: "exam", reason: "Sınav modülü sırası" };
  }

  if (activeStageId === "exam") {
    return { id: "exam", reason: "Deneme sınavı zamanı" };
  }

  return { id: intentFromHref(primaryHref), reason: "Sıradaki adım" };
}

function intentFromHref(href: string): HomeIntentId {
  if (href.startsWith("/review")) return "words";
  if (href.startsWith("/konus-dinle") || href.startsWith("/speak")) return "speak";
  if (href.startsWith("/grundlagen")) return "grammar";
  if (href.startsWith("/exam")) return "exam";
  return "new";
}

export function isEarlyLearner(overallPercent: number, a1Studied: number): boolean {
  return overallPercent < 15 || a1Studied < 30;
}
