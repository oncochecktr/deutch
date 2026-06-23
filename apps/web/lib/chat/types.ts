import type {
  ChatHistoryItem,
  ChatResponse,
  SpeakInputLanguage,
  SpeakLevel,
  StudentProfileContext,
} from "@/lib/speakTypes";

export type ChatProviderId = "gemini" | "anthropic" | "deepseek";

export const CHAT_HISTORY_LIMIT = 10;

export interface ChatAuthOverride {
  provider?: ChatProviderId;
  apiKey?: string;
}

export interface ChatCompletionInput {
  message: string;
  level: SpeakLevel;
  history: ChatHistoryItem[];
  inputLanguage: SpeakInputLanguage;
  lessonId?: string;
  lessonStepIndex?: number;
  studentProfile?: StudentProfileContext;
}

export interface ChatProviderConfig {
  id: ChatProviderId;
  model: string;
}

export class ChatProviderError extends Error {
  readonly status: number;
  readonly provider: ChatProviderId;
  readonly detail?: string;

  constructor(message: string, status: number, provider: ChatProviderId, detail?: string) {
    super(message);
    this.name = "ChatProviderError";
    this.status = status;
    this.provider = provider;
    this.detail = detail;
  }
}

export type ChatCompletionResult = ChatResponse;
