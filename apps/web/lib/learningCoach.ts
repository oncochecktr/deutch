import { LEARNING_METHOD_STEPS } from "@/lib/homeLearningPath";
import type { CoachMilestones } from "@/lib/coachMilestones";
import { DAILY_COACH } from "@/lib/dailyGoals";
import { countStudiedA1Words, type UserProgress } from "@/lib/progress";

export type MethodStepId = "cards" | "diktat" | "speak" | "grammar";

const STEP_IDS: MethodStepId[] = ["cards", "diktat", "speak", "grammar"];

const STEP_META: Record<
  MethodStepId,
  { title: string; body: string; href: string; cta: string; completeHint: string }
> = {
  cards: {
    title: "Cümle ezberle",
    body: "Kalıp cümleler — liste değil.",
    href: "/cards",
    cta: "Kartlara git",
    completeHint: `${DAILY_COACH.beginnerWordsStudied} kelime kartı yeterli — harika başlangıç!`,
  },
  diktat: {
    title: "Dikte yaz",
    body: "Dinle, yaz, kontrol et.",
    href: "/diktat",
    cta: "Diktata git",
    completeHint: "Diktat modunu denedin — yazarak pekiştir.",
  },
  speak: {
    title: "Beyin kası",
    body: "Konuş, tekrar et.",
    href: "/konus-dinle",
    cta: "Konuş-Dinle",
    completeHint: "Konuşma pratiği tamam — devam!",
  },
  grammar: {
    title: "Gramer",
    body: "Kuralı en sona bırak.",
    href: "/grundlagen/roadmap",
    cta: "Gramer haritası",
    completeHint: "Gramer yoluna girdin — sırayla ilerle.",
  },
};

export interface MethodStepState {
  id: MethodStepId;
  order: number;
  title: string;
  body: string;
  href: string;
  cta: string;
  status: "done" | "active" | "upcoming";
  progressLabel: string;
  progressPct: number;
}

export interface LearningCoachState {
  steps: MethodStepState[];
  activeStep: MethodStepState;
  nextStep: MethodStepState | null;
  headline: string;
  advice: string;
  cardsSessionGoal: number;
}

function stepProgress(
  id: MethodStepId,
  progress: UserProgress,
  milestones: CoachMilestones
): { pct: number; label: string; done: boolean } {
  const studied = countStudiedA1Words(progress);
  const ds = progress.dailyStats;

  switch (id) {
    case "cards": {
      const target = DAILY_COACH.beginnerWordsStudied;
      const pct = Math.min(100, Math.round((studied / target) * 100));
      return {
        pct,
        label: `${studied}/${target} kelime`,
        done: studied >= target,
      };
    }
    case "diktat": {
      const visited =
        milestones.diktatVisited ||
        progress.lastRoute === "/diktat" ||
        typeof progress.scrollPositions["/diktat"] === "number";
      return {
        pct: visited ? 100 : studied >= DAILY_COACH.beginnerWordsStudied ? 40 : 0,
        label: visited ? "Denendi" : "Henüz denemedin",
        done: visited,
      };
    }
    case "speak": {
      const turns = ds.konusDinleTurns ?? 0;
      const visited = milestones.konusDinleVisited || turns > 0;
      const target = DAILY_COACH.konusDinleTurns;
      const pct = Math.min(100, Math.round((turns / target) * 100));
      return {
        pct: visited ? pct : 0,
        label: `${turns}/${target} tur`,
        done: turns >= target,
      };
    }
    case "grammar": {
      const doneCount =
        progress.grundlagen.satzCompleted.length +
        progress.grundlagen.patternsCompleted.length;
      const target = DAILY_COACH.grammarExercises;
      const pct = Math.min(100, Math.round((doneCount / target) * 100));
      return {
        pct,
        label: `${doneCount}/${target} alıştırma`,
        done: doneCount >= target,
      };
    }
  }
}

export function computeLearningCoach(
  progress: UserProgress,
  milestones: CoachMilestones = { diktatVisited: false, konusDinleVisited: false }
): LearningCoachState {
  const steps: MethodStepState[] = STEP_IDS.map((id, i) => {
    const meta = STEP_META[id];
    const fromMethod = LEARNING_METHOD_STEPS[i];
    const { pct, label, done } = stepProgress(id, progress, milestones);
    return {
      id,
      order: i + 1,
      title: fromMethod?.title ?? meta.title,
      body: fromMethod?.body ?? meta.body,
      href: fromMethod?.href ?? meta.href,
      cta: fromMethod?.cta ?? meta.cta,
      status: "upcoming",
      progressLabel: label,
      progressPct: pct,
      _done: done,
    } as MethodStepState & { _done: boolean };
  });

  let activeIdx = steps.findIndex((s) => !(s as MethodStepState & { _done: boolean })._done);
  if (activeIdx < 0) activeIdx = steps.length - 1;

  const finalized = steps.map((s, i) => {
    const done = (s as MethodStepState & { _done: boolean })._done;
    let status: MethodStepState["status"] = "upcoming";
    if (done) status = "done";
    else if (i === activeIdx) status = "active";
    const { _done: _, ...rest } = s as MethodStepState & { _done?: boolean };
    return { ...rest, status };
  });

  const activeStep = finalized[activeIdx]!;
  const nextStep = finalized.find((s, i) => i > activeIdx && s.status !== "done") ?? null;

  let headline = "Bugün buradan başla";
  let advice = `${activeStep.title}: ${activeStep.body}`;

  if (activeStep.id === "cards") {
    headline = "Önce kartlarla başla";
    advice = `${DAILY_COACH.cardsSessionNudge}–${DAILY_COACH.beginnerWordsStudied} kelime aç; cümle örneklerini sesle dinle.`;
  } else if (activeStep.id === "diktat") {
    headline = "Sırada diktat var";
    advice = "Öğrendiğin kelimeleri dinle-yaz-kontrol et.";
  } else if (activeStep.id === "speak") {
    headline = "Konuşma zamanı";
    advice = "Konuş-Dinle ile yüksek sesle tekrarla.";
  } else if (activeStep.id === "grammar" && !nextStep) {
    headline = "Gramer yol haritası";
    advice = "Kuralları sırayla tamamla.";
  } else if (finalized.every((s) => s.status === "done")) {
    headline = "Günlük rutin tamam";
    advice = "Tekrar, quiz veya sınav modülüne geçebilirsin.";
  }

  return {
    steps: finalized,
    activeStep,
    nextStep,
    headline,
    advice,
    cardsSessionGoal: DAILY_COACH.cardsSessionNudge,
  };
}

/** Kart oturumunda kaç kelime sonra sıradaki modül önerilsin */
export function shouldShowCardsCoachBanner(
  sessionCardCount: number,
  coach: LearningCoachState
): boolean {
  return (
    coach.activeStep.id === "cards" &&
    sessionCardCount >= coach.cardsSessionGoal &&
    coach.nextStep !== null
  );
}

export function cardsCoachMessage(coach: LearningCoachState): {
  title: string;
  body: string;
  href: string;
  cta: string;
} {
  const next = coach.nextStep ?? coach.activeStep;
  return {
    title: "Güzel gidiyorsun!",
    body: `${coach.activeStep.title} için iyi bir oturum. Sırada: ${next.title} — ${next.body}`,
    href: next.href,
    cta: `${next.cta} →`,
  };
}
