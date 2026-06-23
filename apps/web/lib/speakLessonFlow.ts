import type { BoardPhase, ChatResponse, TeachingExample } from "./speakTypes";
import { isWrittenAnswerMessage } from "./speakTypes";

const READY_RE =
  /^(?:\[YAZILI CEVAP\]\s*)?(?:hazirim|hazırım|hazir|hazır|anladim|anladım|devam(?:\s+ed(?:elim|eriz))?|ok(?:ey)?|tamam|ogrendim|öğrendim|simdi\s+deneyelim|şimdi\s+deneyelim|hazir(?:im|)?\s+hocam|tamam\s+hocam)\b/i;

/** Öğrenci örnekleri okudu, alıştırmaya geçmek istiyor. */
export function isReadyToPracticeSignal(message: string): boolean {
  return READY_RE.test(message.trim());
}

function pickPracticeQuestion(
  teachingTopicGerman: string | null | undefined,
  teachingExamples: ChatResponse["teachingExamples"]
): string | null {
  if (teachingTopicGerman?.includes("?")) return teachingTopicGerman.trim();
  const fromExamples = teachingExamples?.[0]?.german?.trim();
  if (fromExamples) {
    if (fromExamples.endsWith("?")) return fromExamples;
    if (/^(Was|Wie|Wo|Wer|Haben|Bist|Kommst)/i.test(fromExamples)) return fromExamples;
  }
  if (teachingTopicGerman?.trim()) return `${teachingTopicGerman.trim()}?`;
  return null;
}

/**
 * Model öğretim döngüsünde takılırsa: hazır sinyali + örnekler varken alıştırmaya zorla.
 */
export function coercePracticeIfReady(
  chatData: ChatResponse,
  userMessage: string,
  stepConceptReady: boolean,
  fallbackTopicGerman: string | null | undefined,
  fallbackExamples: TeachingExample[] = []
): ChatResponse {
  if (!stepConceptReady || !isReadyToPracticeSignal(userMessage)) return chatData;
  if (chatData.germanQuestion) return chatData;
  if (chatData.boardPhase === "practice" || chatData.boardPhase === "question") return chatData;

  const topic = chatData.teachingTopicGerman ?? fallbackTopicGerman;
  const examples =
    chatData.teachingExamples && chatData.teachingExamples.length > 0
      ? chatData.teachingExamples
      : fallbackExamples;
  const germanQuestion = pickPracticeQuestion(topic, examples);
  if (!germanQuestion) return chatData;

  return {
    ...chatData,
    boardPhase: "practice",
    conceptIntroduced: true,
    germanQuestion,
    assignment: null,
    expectsWrittenAnswer: false,
    reply: chatData.reply?.includes("deneyelim") ? chatData.reply : "Şimdi deneyelim.",
    turkishTranslation:
      chatData.turkishTranslation ??
      chatData.teachingTopicTurkish ??
      null,
    speakTextGerman:
      chatData.speakTextGerman ??
      (germanQuestion.startsWith("Guten") ? germanQuestion : `Guten Tag. ${germanQuestion}`),
  };
}

export function buildReadyPracticeHint(stepConceptReady: boolean, userMessage: string): string | null {
  if (!stepConceptReady || !isReadyToPracticeSignal(userMessage)) return null;
  return (
    "[SISTEM: Ogrenci hazir dedi. Tekrar ogretme YASAK. boardPhase=practice, germanQuestion sor, " +
    "assignment=null, conceptIntroduced=true, reply kisa: Simdi deneyelim.]"
  );
}

function wasAnsweringQuestion(
  userMessage: string,
  lastGermanQuestion: string | null | undefined,
  lastBoardPhase: BoardPhase | null | undefined
): boolean {
  if (isReadyToPracticeSignal(userMessage)) return false;
  if (lastGermanQuestion) return true;
  return lastBoardPhase === "practice" || lastBoardPhase === "question";
}

function modelOpenedNewTeach(chatData: ChatResponse): boolean {
  if (chatData.stepComplete) return false;
  if (chatData.boardPhase !== "teach") return false;
  return Boolean(
    chatData.teachingIntro ||
      (chatData.teachingExamples && chatData.teachingExamples.length > 0) ||
      chatData.teachingTopicGerman
  );
}

/**
 * Model doğru cevapta stepComplete set etmezse veya yeni konu açarsa adımı kapat.
 */
export function coerceStepCompleteIfAnswered(
  chatData: ChatResponse,
  userMessage: string,
  lastGermanQuestion: string | null | undefined,
  lastBoardPhase: BoardPhase | null | undefined,
  isLastStepInLesson: boolean
): ChatResponse {
  if (!wasAnsweringQuestion(userMessage, lastGermanQuestion, lastBoardPhase)) {
    return chatData;
  }
  if (chatData.correction) return chatData;
  if (chatData.stepComplete && !modelOpenedNewTeach(chatData)) return chatData;

  const needsCoerce =
    !chatData.stepComplete || modelOpenedNewTeach(chatData) || chatData.boardPhase === "teach";
  if (!needsCoerce) return chatData;

  const isWritten = isWrittenAnswerMessage(userMessage);
  const praise =
    chatData.praise ??
    (isWritten || lastGermanQuestion ? "Sehr gut!" : null);

  return {
    ...chatData,
    stepComplete: true,
    lessonComplete: isLastStepInLesson ? true : chatData.lessonComplete ?? false,
    boardPhase: "question",
    conceptIntroduced: true,
    praise,
    assignment: null,
    expectsWrittenAnswer: false,
    germanQuestion: null,
    teachingIntro: null,
    teachingTopicGerman: null,
    teachingTopicTurkish: null,
    teachingExamples: [],
    reply: chatData.correction
      ? chatData.reply
      : chatData.reply?.includes("Sehr gut") || chatData.reply?.includes("Harika")
        ? chatData.reply
        : "Sehr gut! Adım tamam — bir sonraki konuya geçiyoruz.",
    speakTextGerman:
      chatData.speakTextGerman ??
      (praise ? `${praise} Gut gemacht.` : "Sehr gut! Gut gemacht."),
  };
}
