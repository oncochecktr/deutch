import { getA1Vocabulary } from "@german-coach/vocabulary";
import { calcReadiness, type UserProgress } from "./progress";
import type { SpeakLevel } from "./speakTypes";

export function suggestSpeakLevel(progress: UserProgress): SpeakLevel {
  const totalWords = getA1Vocabulary().words.length;
  const readiness = calcReadiness(progress, totalWords);

  if (readiness < 35) return "A1";
  if (readiness < 65) return "A2";
  return "B1";
}
