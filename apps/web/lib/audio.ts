"use client";

let currentAudio: HTMLAudioElement | null = null;
let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null;

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

function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  const lang = v.lang.toLowerCase();
  let score = 0;
  if (lang === "de-de") score += 40;
  else if (lang.startsWith("de")) score += 20;
  if (/katja|hedda|stefan|conrad|amala|killian|ingrid|jan|klara|german|deutsch/.test(name)) {
    score += 30;
  }
  if (/google/.test(name) && lang.startsWith("de")) score += 10;
  if (/english|en-us|en-gb|zira|david|mark|samantha/.test(name)) score -= 100;
  return score;
}

function pickGermanVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const de = voices.filter((v) => v.lang.toLowerCase().startsWith("de"));
  if (!de.length) return undefined;
  return de.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
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

async function playServerGermanTts(text: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);
    if (!res.ok) return false;
    await playBlobAudio(await res.blob());
    return true;
  } catch {
    return false;
  }
}

async function speakGermanBrowser(text: string, rate = 0.88): Promise<void> {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const voices = await loadVoices();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = rate;
  const german = pickGermanVoice(voices);
  if (german) {
    utterance.voice = german;
    utterance.lang = german.lang;
  }
  await new Promise<void>((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

/** 1) MP3  2) Sunucu Almanca Edge TTS  3) Tarayıcı (son çare) */
export async function playGermanAudio(
  text: string,
  audioSrc?: string | null
): Promise<"mp3" | "server" | "browser"> {
  stopAudio();

  if (audioSrc && typeof window !== "undefined") {
    try {
      await playMp3Url(audioSrc);
      return "mp3";
    } catch {
      /* 404 → sunucu TTS */
    }
  }

  if (await playServerGermanTts(text)) {
    return "server";
  }

  await speakGermanBrowser(text);
  return "browser";
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
