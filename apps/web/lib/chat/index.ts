import { completeWithAnthropic, getAnthropicConfig } from "./anthropicProvider";
import { resolveApiKeyForProvider, resolveChatProviderWithAuth, parseChatAuth } from "./auth";
import { completeWithDeepseek, getDeepseekConfig } from "./deepseekProvider";
import { completeWithGemini, getGeminiConfig } from "./geminiProvider";
import {
  ChatProviderError,
  type ChatAuthOverride,
  type ChatCompletionInput,
  type ChatProviderConfig,
  type ChatProviderId,
} from "./types";

export { CHAT_HISTORY_LIMIT, ChatProviderError } from "./types";
export type { ChatAuthOverride } from "./types";
export { isValidChatBody } from "./validate";
export { parseChatAuth } from "./auth";

/** Aktif provider: CHAT_PROVIDER env → yoksa anahtarı olan ilk provider */
export function resolveChatProvider(auth?: ChatAuthOverride): ChatProviderId {
  try {
    return resolveChatProviderWithAuth(auth);
  } catch {
    throw new ChatProviderError(
      "API anahtarı için sağlayıcı seçin (Ayarlar).",
      503,
      "deepseek"
    );
  }
}

export function getChatProviderConfig(
  provider = resolveChatProvider(),
  auth?: ChatAuthOverride
): ChatProviderConfig {
  if (provider === "anthropic") return getAnthropicConfig(auth);
  if (provider === "deepseek") return getDeepseekConfig(auth);
  return getGeminiConfig(auth);
}

export async function completeChat(
  input: ChatCompletionInput,
  auth?: ChatAuthOverride
) {
  let provider: ChatProviderId;
  try {
    provider = resolveChatProviderWithAuth(auth);
  } catch {
    throw new ChatProviderError(
      "API anahtarı için sağlayıcı seçin (Ayarlar).",
      503,
      "deepseek"
    );
  }

  if (!resolveApiKeyForProvider(provider, auth)) {
    throw new ChatProviderError(
      "LLM anahtarı yok. Ayarlar sayfasından kendi API anahtarınızı ekleyin veya sunucu yapılandırmasını kontrol edin.",
      503,
      provider
    );
  }

  if (provider === "anthropic") return completeWithAnthropic(input, auth);
  if (provider === "deepseek") return completeWithDeepseek(input, auth);
  return completeWithGemini(input, auth);
}
