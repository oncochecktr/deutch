import { checkDictation } from "@/lib/germanTextCompare";

export type KonusDinleGradeTier = "perfect" | "great" | "good" | "retry" | "unclear";

export interface KonusDinleGradeResult {
  score: number;
  tier: KonusDinleGradeTier;
  isGood: boolean;
  message: string;
  shortVoice: string;
  expected: string;
  userHeard: string;
  xp: number;
}

const MIN_SCORE_GOOD = 70;
const MIN_SCORE_RETRY = 50;

export function gradeKonusDinleAttempt(
  userInput: string,
  expected: string
): KonusDinleGradeResult {
  const dictation = checkDictation(userInput, expected, {
    allowArticleOmit: true,
    minScore: MIN_SCORE_GOOD,
  });

  const score = dictation.score;
  const userHeard = userInput.trim() || "—";
  const expectedDisplay = expected.trim();

  if (score >= 100) {
    return {
      score,
      tier: "perfect",
      isGood: true,
      message: "Harika! Tam isabet. Devam et.",
      shortVoice: "Harika!",
      expected: expectedDisplay,
      userHeard,
      xp: 10,
    };
  }

  if (score >= 85) {
    return {
      score,
      tier: "great",
      isGood: true,
      message: "Çok güzel! Neredeyse aynı — devam et.",
      shortVoice: "Çok güzel!",
      expected: expectedDisplay,
      userHeard,
      xp: 8,
    };
  }

  if (score >= MIN_SCORE_GOOD) {
    return {
      score,
      tier: "good",
      isGood: true,
      message: `İyi deneme! Olması gereken: «${expectedDisplay}» — sen yine de devam edebilirsin.`,
      shortVoice: "İyi deneme!",
      expected: expectedDisplay,
      userHeard,
      xp: 5,
    };
  }

  if (score >= MIN_SCORE_RETRY) {
    return {
      score,
      tier: "retry",
      isGood: false,
      message: `Duydum seni. Bir kez daha dinle, acele etme. Doğrusu: «${expectedDisplay}»`,
      shortVoice: "Bir kez daha dene.",
      expected: expectedDisplay,
      userHeard,
      xp: 3,
    };
  }

  return {
    score,
    tier: "unclear",
    isGood: false,
    message: "Net duyamadım — Tekrar dinle'ye bas, sonra bir kez daha dene.",
    shortVoice: "Tekrar dinle.",
    expected: expectedDisplay,
    userHeard,
    xp: 1,
  };
}

export function tierLabelTr(tier: KonusDinleGradeTier): string {
  switch (tier) {
    case "perfect":
      return "Mükemmel";
    case "great":
      return "Çok iyi";
    case "good":
      return "İyi";
    case "retry":
      return "Tekrar dene";
    case "unclear":
      return "Net duyamadım";
  }
}
