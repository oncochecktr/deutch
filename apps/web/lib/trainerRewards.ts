export interface TrainerReward {
  title: string;
  subtitle?: string;
}

export interface PickCorrectRewardContext {
  sessionStreak: number;
  isFirstEver: boolean;
  totalCompleted: number;
}

const MILESTONES = [10, 25, 50, 70] as const;

export function pickCorrectReward(ctx: PickCorrectRewardContext): TrainerReward | null {
  const { sessionStreak, isFirstEver, totalCompleted } = ctx;

  if (sessionStreak >= 3 && sessionStreak % 3 === 0) {
    return {
      title: `Seri: ${sessionStreak}`,
      subtitle: "Devam et!",
    };
  }

  const milestone = MILESTONES.find((m) => m === totalCompleted);
  if (milestone) {
    if (milestone === 10) return { title: "10 cümle!", subtitle: "İyi gidiyorsun" };
    if (milestone === 25) return { title: "25 cümle!", subtitle: "Yarı yoldasın" };
    if (milestone === 50) return { title: "50 cümle!", subtitle: "Harika ilerleme" };
    if (milestone === 70) return { title: "Tamamlandı!", subtitle: "Tüm cümleler bitti" };
  }

  if (isFirstEver) {
    return { title: "+1 tamamlandı" };
  }

  return null;
}

/** Genel antrenmanlar için kısa ödül (drill, quiz vb.) */
export function pickSessionReward(sessionStreak: number, isCorrect: boolean): TrainerReward | null {
  if (!isCorrect) return null;
  if (sessionStreak >= 3 && sessionStreak % 3 === 0) {
    return { title: `Seri: ${sessionStreak}`, subtitle: "Devam et!" };
  }
  if (sessionStreak === 1) return { title: "Doğru!" };
  return null;
}
