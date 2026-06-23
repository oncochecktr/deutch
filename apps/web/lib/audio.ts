"use client";

import { buildTeacherSpeakText, sanitizeForTts, trimGermanProfessorText } from "@/lib/speakTts";
import { TTS_MAX_CHARS, TTS_MAX_CHARS_TR } from "@/lib/ttsConfig";

let currentAudio: HTMLAudioElement | null = null;
let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null;

export type TtsLang = "de" | "tr";

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return Promise.resolve([]);
  }
  if (voicesReady) return voicesReady;

  voicesReady = new Promise((resolve) => {
    const pick = () => {
      const list = window.speechSynthesis.getVoices();
      if (list.length) resolve(list);
    };
    pick();
    window.speechSynthesis.onvoiceschanged = () => pick();
    setTimeout(pick, 300);
    setTimeout(pick, 800);
  });

  return voicesReady;
}

function scoreVoice(v: SpeechSynthesisVoice, lang: TtsLang): number {
  const name = v.name.toLowerCase();
  const voiceLang = v.lang.toLowerCase();
  let score = 0;

  if (lang === "de") {
    if (voiceLang === "de-de") score += 40;
    else if (voiceLang.startsWith("de")) score += 20;
    if (/katja|hedda|stefan|conrad|amala|killian|ingrid|jan|klara|german|deutsch/.test(name)) {
      score += 30;
    }
    if (/google/.test(name) && voiceLang.startsWith("de")) score += 10;
  } else {
    if (voiceLang === "tr-tr") score += 40;
    else if (voiceLang.startsWith("tr")) score += 20;
    if (/ahmet|emel|turk|türk|turkish|tolga|ayşe|aysel|filiz/.test(name)) score += 30;
    if (/google/.test(name) && voiceLang.startsWith("tr")) score += 10;
  }

  if (/english|en-us|en-gb|zira|david|mark|samantha/.test(name)) score -= 100;
  return score;
}

function pickVoice(voices: SpeechSynthesisVoice[], lang: TtsLang): SpeechSynthesisVoice | undefined {
  const prefix = lang === "de" ? "de" : "tr";
  const filtered = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix));
  if (!filtered.length) return undefined;
  return filtered.sort((a, b) => scoreVoice(b, lang) - scoreVoice(a, lang))[0];
}

export function stopAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    if (currentAudio.src.startsWith("blob:")) {
      URL.revokeObjectURL(currentAudio.src);
    }
    currentAudio = null;
  }
  if (typeof window !== "undefined") {
    window.speechSynthesis?.cancel();
  }
}

async function playBlobAudio(blob: Blob): Promise<void> {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  currentAudio = audio;
  await new Promise<void>((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("audio play failed"));
    };
    audio.play().catch(reject);
  });
}

async function playMp3Url(src: string): Promise<boolean> {
  const audio = new Audio(src);
  currentAudio = audio;
  await new Promise<void>((resolve, reject) => {
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error("mp3 load failed"));
    audio.play().catch(reject);
  });
  return true;
}

async function playServerTts(text: string, lang: TtsLang): Promise<boolean> {
  const max = lang === "tr" ? TTS_MAX_CHARS_TR : TTS_MAX_CHARS;
  const trimmed = sanitizeForTts(text.trim(), lang).slice(0, max);
  if (!trimmed) return false;
  try {
    const res = await fetch(
      `/api/tts?lang=${lang}&text=${encodeURIComponent(trimmed)}`
    );
    if (!res.ok) return false;
    await playBlobAudio(await res.blob());
    return true;
  } catch {
    return false;
  }
}

async function speakBrowser(text: string, lang: TtsLang, rate?: number): Promise<void> {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const voices = await loadVoices();
  const cleaned = sanitizeForTts(text, lang);
  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.lang = lang === "de" ? "de-DE" : "tr-TR";
  utterance.rate = rate ?? (lang === "tr" ? 0.94 : 0.88);
  utterance.pitch = lang === "tr" ? 1.02 : 1;
  const voice = pickVoice(voices, lang);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }
  await new Promise<void>((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

async function playLangAudio(
  text: string,
  lang: TtsLang,
  audioSrc?: string | null
): Promise<"mp3" | "server" | "browser"> {
  stopAudio();

  if (audioSrc && typeof window !== "undefined") {
    try {
      await playMp3Url(audioSrc);
      return "mp3";
    } catch {
      /* fallback */
    }
  }

  if (await playServerTts(text, lang)) {
    return "server";
  }

  await speakBrowser(text, lang);
  return "browser";
}

/** Almanca TTS — MP3 → sunucu Edge → tarayıcı */
export async function playGermanAudio(
  text: string,
  audioSrc?: string | null
): Promise<"mp3" | "server" | "browser"> {
  return playLangAudio(text, "de", audioSrc);
}

/** Türkçe TTS — sunucu Edge → tarayıcı */
export async function playTurkishAudio(text: string): Promise<"mp3" | "server" | "browser"> {
  return playLangAudio(text, "tr");
}

/** Profesör turu: önce Almanca, sonra Türkçe açıklama, sonra düzeltme modeli */
export async function playProfessorTurn(options: {
  speakTextGerman?: string | null;
  germanQuestion?: string | null;
  teachingTopicGerman?: string | null;
  teachingTopicTurkish?: string | null;
  turkishTranslation?: string | null;
  speakText?: string | null;
  reply?: string;
  correction?: string | null;
  praise?: string | null;
  inputLanguage: "de" | "tr";
  boardPhase?: "teach" | "practice" | "question" | null;
}): Promise<void> {
  const {
    speakTextGerman,
    germanQuestion,
    teachingTopicGerman,
    teachingTopicTurkish,
    turkishTranslation,
    speakText,
    reply = "",
    correction,
    praise,
    inputLanguage,
    boardPhase,
  } = options;

  stopAudio();

  const germanRaw =
    speakTextGerman?.trim() ||
    germanQuestion?.trim() ||
    (boardPhase === "teach" ? teachingTopicGerman?.trim() : null) ||
    praise?.trim() ||
    null;

  const germanMain = germanRaw ? trimGermanProfessorText(germanRaw) : null;

  if (germanMain) {
    await playGermanAudio(germanMain);
  }

  if (inputLanguage === "tr") {
    const trSource =
      speakText?.trim() ||
      teachingTopicTurkish?.trim() ||
      turkishTranslation?.trim() ||
      null;
    const trText = buildTeacherSpeakText(reply, trSource, "tr");
    if (trText) {
      await playTurkishAudio(trText);
    }
  } else if (!germanMain && reply.trim()) {
    await playGermanAudio(trimGermanProfessorText(reply));
  }

  if (correction?.trim() && correction.trim() !== germanMain) {
    await playGermanAudio(trimGermanProfessorText(correction));
  }
}

/** Öğretmen yanıtı: kısa speakText + Almanca kalıp (Edge TTS) — geriye dönük */
export async function playTeacherResponse(
  reply: string,
  correction: string | null,
  inputLanguage: "de" | "tr",
  speakText?: string | null
): Promise<void> {
  const toSpeak = buildTeacherSpeakText(reply, speakText, inputLanguage);

  if (inputLanguage === "tr") {
    await playTurkishAudio(toSpeak);
    if (correction) {
      await playGermanAudio(correction);
    }
  } else {
    await playGermanAudio(toSpeak || reply);
    if (correction && correction !== toSpeak) {
      await playGermanAudio(correction);
    }
  }
}

export function formatWord(word: string, article: string | null): string {
  return article ? `${article} ${word}` : word;
}

export function speakWord(
  word: string,
  article: string | null,
  audioSrc?: string | null
): Promise<"mp3" | "server" | "browser"> {
  return playGermanAudio(formatWord(word, article), audioSrc);
}

export function speakGerman(text: string): void {
  void playGermanAudio(text);
}

export function speakTurkish(text: string): void {
  void playTurkishAudio(text);
}
