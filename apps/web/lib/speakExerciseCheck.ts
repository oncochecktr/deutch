import { estimateTokenCostUsd } from "@/lib/speakApiUsage";
import {
  buildExerciseUserMessage,
  buildLocalExerciseFeedback,
  getExerciseSystemPrompt,
  parseExerciseCheckResponse,
  type ExerciseCheckRequest,
  type ExerciseCheckResponse,
} from "@/lib/speakExercisePrompts";
import { gradeExerciseLocally } from "@/lib/speakExercise";
import { ChatProviderError } from "@/lib/chat/types";

const DEFAULT_MODEL = "deepseek-chat";
const API_BASE = "https://api.deepseek.com";
const MAX_ATTEMPTS = 2;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callDeepseekExercise(
  apiKey: string,
  baseUrl: string,
  model: string,
  systemPrompt: string,
  userMessage: string
): Promise<{ text: string; usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } }> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1024,
      temperature: 0.4,
    }),
  });

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new ChatProviderError(
      data.error?.message ?? "DeepSeek egzersiz isteği reddedildi.",
      response.status === 429 ? 429 : 502,
      "deepseek"
    );
  }

  const text = (data.choices?.[0]?.message?.content ?? "").trim();
  if (!text) {
    throw new ChatProviderError("Model yanıt vermedi.", 502, "deepseek");
  }
  return { text, usage: data.usage };
}

export function isValidExerciseCheckBody(body: unknown): body is ExerciseCheckRequest {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.studentAnswer === "string" &&
    b.studentAnswer.trim().length > 0 &&
    typeof b.promptDe === "string" &&
    typeof b.exerciseType === "string" &&
    (b.level === "A1" || b.level === "A2" || b.level === "B1")
  );
}

export async function completeExerciseCheck(
  req: ExerciseCheckRequest,
  userApiKey?: string
): Promise<ExerciseCheckResponse & { usage?: { totalTokens: number; estimatedCostUsd: number; model: string } }> {
  const exerciseForGrade = {
    id: "",
    type: req.exerciseType,
    level: req.level,
    index: 0,
    total: 5,
    promptDe: req.promptDe,
    expectedAnswer: req.expectedHint ?? undefined,
    correctOptionId: req.correctOptionId,
    correctTrueFalse: req.correctTrueFalse,
    blankWord: req.blankWord ?? req.expectedHint ?? undefined,
  };

  const localGrade = gradeExerciseLocally(exerciseForGrade, req.studentAnswer);

  const needsFullAi =
    req.exerciseType === "short_write" || req.exerciseType === "speak_prompt";

  if (!needsFullAi && localGrade) {
    return buildLocalExerciseFeedback(
      { ...req, isCorrect: localGrade.isCorrect, localScore: localGrade.score },
      localGrade
    );
  }

  const apiKey = userApiKey?.trim() || process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    if (localGrade) {
      return buildLocalExerciseFeedback(
        { ...req, isCorrect: localGrade.isCorrect, localScore: localGrade.score },
        localGrade
      );
    }
    throw new ChatProviderError(
      "DEEPSEEK_API_KEY yapılandırılmamış. Ayarlar sayfasından API anahtarı ekleyin.",
      503,
      "deepseek"
    );
  }

  const model = process.env.DEEPSEEK_MODEL?.trim() || DEFAULT_MODEL;
  const baseUrl = process.env.DEEPSEEK_API_BASE?.trim() || API_BASE;
  const systemPrompt = getExerciseSystemPrompt(req.level);
  const userMessage = buildExerciseUserMessage({
    ...req,
    isCorrect: localGrade?.isCorrect,
    localScore: localGrade?.score,
  });

  let lastError = "JSON parse failed";
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const { text, usage } = await callDeepseekExercise(
        apiKey,
        baseUrl,
        model,
        attempt > 0 ? `${systemPrompt}\n\n[ZORUNLU: Sadece JSON]` : systemPrompt,
        userMessage
      );
      const parsed = parseExerciseCheckResponse(text);
      const promptTokens = usage?.prompt_tokens ?? 0;
      const completionTokens = usage?.completion_tokens ?? 0;
      return {
        ...parsed,
        usage: {
          totalTokens: usage?.total_tokens ?? promptTokens + completionTokens,
          estimatedCostUsd: estimateTokenCostUsd(model, promptTokens, completionTokens),
          model,
        },
      };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (attempt < MAX_ATTEMPTS - 1) await sleep(800);
    }
  }

  if (localGrade) {
    return buildLocalExerciseFeedback(
      { ...req, isCorrect: localGrade.isCorrect, localScore: localGrade.score },
      localGrade
    );
  }

  throw new ChatProviderError("Egzersiz değerlendirmesi işlenemedi.", 502, "deepseek", lastError);
}
