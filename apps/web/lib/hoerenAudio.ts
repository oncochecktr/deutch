import { getA1Vocabulary } from "@german-coach/vocabulary";
import { formatWord } from "@/lib/audio";

let audioByText: Map<string, string> | null = null;

function normalizeGermanKey(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function buildAudioMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const w of getA1Vocabulary().words) {
    if (!w.audio_word) continue;
    const display = formatWord(w.word, w.article);
    map.set(normalizeGermanKey(display), w.audio_word);
    map.set(normalizeGermanKey(w.word), w.audio_word);
  }
  return map;
}

/** Hören kelime sorularında MP3 yolu (varsa) */
export function resolveHoerenAudioSrc(audioText: string): string | null {
  if (!audioByText) audioByText = buildAudioMap();
  return audioByText.get(normalizeGermanKey(audioText)) ?? null;
}
