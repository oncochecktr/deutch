import type { ChatProviderId, ChatAuthOverride } from "./types";

export function parseChatAuth(body: Record<string, unknown>): ChatAuthOverride | undefined {
  const apiKey = typeof body.userApiKey === "string" ? body.userApiKey.trim() : "";
  const provider = body.userProvider;
  if (
    provider !== "gemini" &&
    provider !== "anthropic" &&
    provider !== "deepseek"
  ) {
    if (!apiKey) return undefined;
    return { apiKey };
  }
  if (!apiKey && !provider) return undefined;
  return { provider, apiKey: apiKey || undefined };
}

export function resolveChatProviderWithAuth(auth?: ChatAuthOverride): ChatProviderId {
  if (auth?.provider) return auth.provider;

  const explicit = process.env.CHAT_PROVIDER?.trim().toLowerCase();
  if (explicit === "gemini" || explicit === "anthropic" || explicit === "deepseek") {
    return explicit;
  }

  if (auth?.apiKey) {
    throw new Error("userProvider gerekli");
  }

  const hasDeepseek = Boolean(process.env.DEEPSEEK_API_KEY?.trim());
  const hasGemini = Boolean(process.env.GEMINI_API_KEY?.trim());
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY?.trim());

  if (hasDeepseek) return "deepseek";
  if (hasGemini) return "gemini";
  if (hasAnthropic) return "anthropic";

  return "deepseek";
}

export function resolveApiKeyForProvider(
  provider: ChatProviderId,
  auth?: ChatAuthOverride
): string | undefined {
  const userKey = auth?.apiKey?.trim();
  if (userKey) return userKey;

  switch (provider) {
    case "deepseek":
      return process.env.DEEPSEEK_API_KEY?.trim();
    case "gemini":
      return process.env.GEMINI_API_KEY?.trim();
    case "anthropic":
      return process.env.ANTHROPIC_API_KEY?.trim();
  }
}
