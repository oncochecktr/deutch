"use client";

import type { VocabularyWord } from "@german-coach/vocabulary";
import { formatWord, playGermanAudio, playTurkishAudio } from "@/lib/audio";
import {
  type CardsListenSettings,
  SPEECH_RATE,
} from "@/lib/cardsSettings";
import { splitExamples, splitMeanings } from "@/lib/vocabMeta";

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function primaryTranslation(word: VocabularyWord): string {
  const meanings = splitMeanings(word.translation_tr);
  return meanings[0] ?? word.translation_tr;
}

function primaryExample(word: VocabularyWord): { de: string; tr: string } | null {
  const examples = splitExamples(word.example_de, word.example_tr);
  const ex = examples[0];
  if (!ex?.de || ex.de === "—") return null;
  return ex;
}

/** Kelime karti: Almanca → Turkce anlam → (istege bagli) ornek cumle DE + TR */
export async function playCardWordAudio(
  word: VocabularyWord,
  settings: Pick<
    CardsListenSettings,
    "speechSpeed" | "repeatCount" | "playTranslation" | "playContext"
  >
): Promise<void> {
  const display = formatWord(word.word, word.article);
  const rate = SPEECH_RATE[settings.speechSpeed];

  for (let i = 0; i < settings.repeatCount; i++) {
    await playGermanAudio(display, word.audio_word, { playbackRate: rate });
    if (i < settings.repeatCount - 1) await sleep(350);
  }

  if (settings.playTranslation) {
    const tr = primaryTranslation(word);
    if (tr && tr !== "—") {
      await sleep(280);
      await playTurkishAudio(tr, null, { playbackRate: rate });
    }
  }

  if (settings.playContext) {
    const ex = primaryExample(word);
    if (ex) {
      await sleep(320);
      await playGermanAudio(ex.de, word.audio_example, { playbackRate: rate });
      if (settings.playTranslation && ex.tr && ex.tr !== "—") {
        await sleep(280);
        await playTurkishAudio(ex.tr, null, { playbackRate: rate });
      }
    }
  }
}

export async function playCardSentenceAudio(
  word: VocabularyWord,
  settings: Pick<CardsListenSettings, "speechSpeed" | "repeatCount">
): Promise<void> {
  const rate = SPEECH_RATE[settings.speechSpeed];
  const ex = primaryExample(word);
  const text = ex?.de ?? word.example_de;
  if (!text || text === "—") return;

  for (let i = 0; i < settings.repeatCount; i++) {
    await playGermanAudio(text, word.audio_example, { playbackRate: rate });
    if (i < settings.repeatCount - 1) await sleep(400);
  }
}
