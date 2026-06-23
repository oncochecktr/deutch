import type { ChatProviderId } from "@/lib/chat/types";

export const USER_API_STORAGE_KEY = "german-coach-user-api";

export interface UserApiCredentials {
  provider: ChatProviderId;
  apiKey: string;
  savedAt: string;
}

export function loadUserApiCredentials(): UserApiCredentials | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_API_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserApiCredentials;
    if (
      !parsed ||
      typeof parsed.apiKey !== "string" ||
      !parsed.apiKey.trim() ||
      (parsed.provider !== "deepseek" &&
        parsed.provider !== "gemini" &&
        parsed.provider !== "anthropic")
    ) {
      return null;
    }
    return { ...parsed, apiKey: parsed.apiKey.trim() };
  } catch {
    return null;
  }
}

export function saveUserApiCredentials(provider: ChatProviderId, apiKey: string): void {
  const creds: UserApiCredentials = {
    provider,
    apiKey: apiKey.trim(),
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(USER_API_STORAGE_KEY, JSON.stringify(creds));
}

export function clearUserApiCredentials(): void {
  localStorage.removeItem(USER_API_STORAGE_KEY);
}

export function maskApiKey(key: string): string {
  if (key.length <= 8) return "••••••••";
  return `${key.slice(0, 4)}••••${key.slice(-4)}`;
}

export const PROVIDER_LABELS: Record<ChatProviderId, string> = {
  deepseek: "Ekonomik",
  gemini: "Google",
  anthropic: "Claude",
};

export const PROVIDER_KEY_URLS: Record<ChatProviderId, string> = {
  deepseek: "https://platform.deepseek.com/api_keys",
  gemini: "https://aistudio.google.com/apikey",
  anthropic: "https://console.anthropic.com/settings/keys",
};

export interface ClientChatAuth {
  userApiKey?: string;
  userProvider?: ChatProviderId;
}

export function clientChatAuthPayload(): ClientChatAuth {
  const creds = loadUserApiCredentials();
  if (!creds) return {};
  return { userApiKey: creds.apiKey, userProvider: creds.provider };
}
