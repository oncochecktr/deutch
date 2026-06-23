import { ChatProviderError } from "@/lib/chat/types";
import {
  buildDialogueUserMessage,
  getDialogueSystemPrompt,
  isValidDialogueGenerateBody,
  parseDialogueStory,
} from "@/lib/dialoguePrompts";
import type { DialogueGenerateRequest, DialogueStory } from "@/lib/dialogueTypes";

const DEFAULT_MODEL = "deepseek-chat";
const API_BASE = "https://api.deepseek.com";
const MAX_ATTEMPTS = 2;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callDeepseekDialogue(
  apiKey: string,
  baseUrl: string,
  model: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
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
      max_tokens: 4096,
      temperature: 0.75,
    }),
  });

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new ChatProviderError(
      data.error?.message ?? "DeepSeek isteği reddedildi.",
      response.status === 429 ? 429 : 502,
      "deepseek"
    );
  }

  const text = (data.choices?.[0]?.message?.content ?? "").trim();
  if (!text) throw new ChatProviderError("Model yanıt vermedi.", 502, "deepseek");
  return text;
}

export async function generateDialogueStory(req: DialogueGenerateRequest): Promise<DialogueStory> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new ChatProviderError("DEEPSEEK_API_KEY yapılandırılmamış.", 503, "deepseek");
  }

  const model = process.env.DEEPSEEK_MODEL?.trim() || DEFAULT_MODEL;
  const baseUrl = process.env.DEEPSEEK_API_BASE?.trim() || API_BASE;
  const systemPrompt = getDialogueSystemPrompt(req.level);
  const userMessage = buildDialogueUserMessage(req);

  let lastErr = "parse failed";
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const text = await callDeepseekDialogue(
        apiKey,
        baseUrl,
        model,
        attempt > 0 ? `${systemPrompt}\n\n[ZORUNLU: Sadece JSON]` : systemPrompt,
        userMessage
      );
      const parsed = parseDialogueStory(text);
      return {
        ...parsed,
        source: "ai",
        createdAt: new Date().toISOString(),
        readCount: 0,
      };
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
      if (attempt < MAX_ATTEMPTS - 1) await sleep(1000);
    }
  }

  throw new ChatProviderError("Hikaye üretilemedi.", 502, "deepseek", lastErr);
}

export { isValidDialogueGenerateBody };
