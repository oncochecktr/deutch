import type { ExerciseScore, ExerciseType } from "./speakExercise";
import type { SpeakLevel } from "./speakTypes";
import { takeSentences } from "./speakTts";
export interface ExerciseCheckRequest {
  level: SpeakLevel;
  exerciseType: ExerciseType;
  promptDe: string;
  expectedHint?: string | null;
  studentAnswer: string;
  hintLevel: number;
  weaknesses: string[];
  isCorrect?: boolean;
  localScore?: ExerciseScore;
  correctOptionId?: string;
  correctTrueFalse?: boolean;
  blankWord?: string;
}

export interface ExerciseCheckResponse {
  score: ExerciseScore;
  isCorrect: boolean;
  boardReply: string;
  speakText: string | null;
  speakTextGerman: string | null;
  correction: string | null;
  correctionExplanation: string | null;
  praise: string | null;
  tip: string | null;
  strengths: string[];
  weaknesses: string[];
  nextSuggestion: string | null;
}

const EXERCISE_JSON_SCHEMA = `{
  "score": "poor|ok|good|excellent",
  "isCorrect": true/false,
  "boardReply": "Tahtada kısa Türkçe mesaj",
  "speakText": "ZORUNLU — TTS için max 2 kısa Türkçe cümle (konuşma dili)",
  "speakTextGerman": "Varsa Almanca model/praise (TTS) veya null",
  "correction": "Almanca model cevap veya null",
  "correctionExplanation": "Türkçe açıklama veya null",
  "praise": "Olumlu geri bildirim veya null",
  "tip": "Tekrar/unutma tavsiyesi veya null",
  "strengths": ["Güçlü yön"],
  "weaknesses": ["Eksik: ..."],
  "nextSuggestion": "Sonraki adım tavsiyesi veya null"
}`;

export function getExerciseSystemPrompt(level: SpeakLevel): string {
  return `Sen Prof. German Coach'sun — egzersiz değerlendirmesi yapıyorsun (ders değil).
Seviye: ${level}. Öğrenciye Türkçe konuş; Almanca örnekleri tahtaya yaz.
Yanıt YALNIZCA geçerli JSON: ${EXERCISE_JSON_SCHEMA}
score: poor=yanlış/zayıf, ok=kısmen doğru, good=doğru, excellent=mükemmel.
Kısa ve net ol; tahta mesajı 2-3 cümleyi geçmesin.`;
}

export function buildExerciseUserMessage(req: ExerciseCheckRequest): string {
  const parts = [
    `Görev türü: ${req.exerciseType}`,
    `Soru (DE): ${req.promptDe}`,
    req.expectedHint ? `Beklenen ipucu: ${req.expectedHint}` : null,
    `Öğrenci cevabı: ${req.studentAnswer}`,
    `İpucu seviyesi: ${req.hintLevel}/3`,
    req.weaknesses.length ? `Bilinen eksikler: ${req.weaknesses.join("; ")}` : null,
    req.isCorrect !== undefined ? `Yerel kontrol: ${req.isCorrect ? "doğru" : "yanlış"}` : null,
    req.localScore ? `Yerel skor: ${req.localScore}` : null,
    "Değerlendir, düzelt, tavsiye ver, eksik/güçlü yönleri güncelle.",
  ];
  return parts.filter(Boolean).join("\n");
}

export function parseExerciseCheckResponse(text: string): ExerciseCheckResponse {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new SyntaxError("Invalid JSON");
  }

  const scores: ExerciseScore[] = ["poor", "ok", "good", "excellent"];
  const score = scores.includes(parsed.score as ExerciseScore)
    ? (parsed.score as ExerciseScore)
    : "ok";

  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  const strArr = (v: unknown, max: number) =>
    Array.isArray(v)
      ? v
          .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
          .slice(0, max)
      : [];

  return {
    score,
    isCorrect: parsed.isCorrect === true || score === "good" || score === "excellent",
    boardReply: str(parsed.boardReply) ?? "Devam edelim.",
    speakText: str(parsed.speakText) ?? takeSentences(str(parsed.boardReply) ?? "Devam edelim.", 2),    speakTextGerman: str(parsed.speakTextGerman),
    correction: str(parsed.correction),
    correctionExplanation: str(parsed.correctionExplanation),
    praise: str(parsed.praise),
    tip: str(parsed.tip),
    strengths: strArr(parsed.strengths, 3),
    weaknesses: strArr(parsed.weaknesses, 3),
    nextSuggestion: str(parsed.nextSuggestion),
  };
}

export function buildLocalExerciseFeedback(
  req: ExerciseCheckRequest,
  local: { isCorrect: boolean; score: ExerciseScore }
): ExerciseCheckResponse {
  const { isCorrect, score } = local;
  if (isCorrect) {
    return {
      score,
      isCorrect: true,
      boardReply: "Doğru! Devam edelim — bir sonraki göreve geç.",
      speakText: "Harika, doğru cevap! Sonraki egzersize geçelim.",
      speakTextGerman: score === "good" ? "Sehr gut!" : "Ausgezeichnet!",
      correction: null,
      correctionExplanation: null,
      praise: score === "good" ? "Güzel!" : "Mükemmel!",
      tip: req.expectedHint ? `Tekrar et: ${req.expectedHint}` : null,
      strengths: [`${req.exerciseType} iyi gidiyor`],
      weaknesses: [],
      nextSuggestion: "Sonraki egzersize hazırsın.",
    };
  }
  return {
    score: "poor",
    isCorrect: false,
    boardReply: "Tam değil — model cevaba bak ve tekrar dene.",
    speakText: takeSentences("Tam değil. Model cevaba bak ve bir kez daha dene.", 2),
    speakTextGerman: req.expectedHint ?? null,
    correction: req.expectedHint ?? null,
    correctionExplanation: req.expectedHint
      ? `Doğru cevap: ${req.expectedHint}`
      : "Bir kez daha dene.",
    praise: null,
    tip: "Bu kelimeyi kartlarda tekrar et.",
    strengths: [],
    weaknesses: [`${req.exerciseType}: tekrar gerekli`],
    nextSuggestion: "İpucu butonunu kullanabilirsin.",
  };
}
