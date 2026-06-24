export const STUDY_NUDGES = [
  "Devam et.",
  "Kelimeyi sesle tekrarla.",
  "Yazarak pekiştir.",
  "Her kelime bir adım.",
  "Tekrar et, unutma.",
  "Kartı çevir, İleri de.",
  "10 kelime = daha rahat sınav.",
  "Dinle, yaz, kontrol et.",
] as const;

export function pickStudyNudge(seed: number): string {
  return STUDY_NUDGES[Math.abs(seed) % STUDY_NUDGES.length];
}
