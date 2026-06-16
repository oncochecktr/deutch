export const STUDY_NUDGES = [
  "Hadi! Nerede kaldın — öğrenmeye devam et.",
  "Duyduğun kelimeyi sesle tekrarla — ağzın alışsın.",
  "Kalem kağıda yaz: hem akılda kalır hem yazılı öğrenirsin.",
  "Almanca zor ama öğrenirsin — her kelime bir adım.",
  "Öğrendiğin kelimeyi tekrar tekrar gör — unutma.",
  "Kartı çevir, cümleyi oku, İleri de — acele etme.",
  "Bugün 10 kelime = yarın sınavda daha rahat.",
  "Duyduğunu yaz — dinle, Almanca yaz, kontrol et. Hata böyle ayıklanır.",
] as const;

export function pickStudyNudge(seed: number): string {
  return STUDY_NUDGES[Math.abs(seed) % STUDY_NUDGES.length];
}
