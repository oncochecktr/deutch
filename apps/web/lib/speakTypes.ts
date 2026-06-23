export type SpeakLevel = "A1" | "A2" | "B1";

/** de = Almanca pratik, tr = Türkçe soru/anlama */
export type SpeakInputLanguage = "de" | "tr";

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export interface StudentProfileContext {
  weaknesses: string[];
  currentAssignment: string | null;
  recentNotes: string[];
  levelProgressPercent: number;
  levelRemainingPercent: number;
  nextMilestone: string;
  hintLevel: 1 | 2 | 3;
  consecutiveCorrect: number;
  /** Bu adımda konu tanıtıldı mı — false ise önce öğret, soru sorma */
  stepConceptReady: boolean;
}

export interface TeachingExample {
  german: string;
  turkish: string;
}

export type BoardPhase = "teach" | "practice" | "question";

export interface ApiUsageInfo {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  model: string;
}

export interface ChatResponse {
  reply: string;
  correction: string | null;
  correctionExplanation: string | null;
  stepComplete?: boolean;
  lessonComplete?: boolean;
  assessedLevel?: SpeakLevel | null;
  lessonNotes?: string[] | null;
  assignment?: string | null;
  weaknesses?: string[] | null;
  expectsWrittenAnswer?: boolean;
  /** Dil profesörü tavsiyesi — çalışma alışkanlığı, sıradaki adım */
  professorAdvice?: string | null;
  /** Seslendirme metni — kısa, doğal (tahtadan ayrı) */
  speakText?: string | null;
  /** Profesörün sesli okuyacağı Almanca (selamlama + soru/kalıp) */
  speakTextGerman?: string | null;
  /** Tahtadaki Almanca soru */
  germanQuestion?: string | null;
  /** Seviye 1: tam Türkçe çeviri (toggle ile) */
  turkishTranslation?: string | null;
  /** Seviye 2: kısmi ipucu */
  partialHint?: string | null;
  /** Kısa övgü: Sehr gut vb. */
  praise?: string | null;
  /** Öğretim: konu tanıtımı (Türkçe) */
  teachingIntro?: string | null;
  /** Öğretilen kalıp Almanca */
  teachingTopicGerman?: string | null;
  /** Toggle ile gösterilecek Türkçe anlam */
  teachingTopicTurkish?: string | null;
  /** 2–4 örnek cümle */
  teachingExamples?: TeachingExample[] | null;
  /** teach | practice | question */
  boardPhase?: BoardPhase | null;
  /** true → adım tanıtıldı, artık soru sorulabilir */
  conceptIntroduced?: boolean;
  usage?: ApiUsageInfo;
  /** Sunucunun kullandığı LLM sağlayıcısı */
  provider?: "gemini" | "anthropic" | "deepseek";
}

export interface ChatRequestBody {
  message: string;
  level: SpeakLevel;
  history: ChatHistoryItem[];
  inputLanguage?: SpeakInputLanguage;
  lessonId?: string;
  lessonStepIndex?: number;
  studentProfile?: StudentProfileContext;
  userApiKey?: string;
  userProvider?: "gemini" | "anthropic" | "deepseek";
}

export interface ChatErrorResponse {
  error: string;
  detail?: string;
  code?: string;
}

export const WRITTEN_ANSWER_PREFIX = "[YAZILI CEVAP]";

export function isWrittenAnswerMessage(message: string): boolean {
  return message.startsWith(WRITTEN_ANSWER_PREFIX);
}

export function formatWrittenAnswer(text: string): string {
  return `${WRITTEN_ANSWER_PREFIX} ${text.trim()}`;
}
