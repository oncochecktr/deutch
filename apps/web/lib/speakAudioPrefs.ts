export const PROFESSOR_AUDIO_KEY = "german-coach-professor-audio";

export function loadProfessorAudioEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(PROFESSOR_AUDIO_KEY) !== "0";
  } catch {
    return true;
  }
}

export function saveProfessorAudioEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFESSOR_AUDIO_KEY, enabled ? "1" : "0");
  } catch {
    /* ignore */
  }
}
