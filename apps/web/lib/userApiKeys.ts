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

/** Anahtar önekine göre arka planda sağlayıcı seçer — kullanıcıya marka gösterilmez */
export function inferProviderFromApiKey(key: string): ChatProviderId {
  const k = key.trim();
  if (k.startsWith("sk-ant-")) return "anthropic";
  if (k.startsWith("AIza")) return "gemini";
  return "deepseek";
}

/** Gelişmiş seçim — kullanıcıya markasız etiketler */
export const PROVIDER_MODE_LABELS: Record<ChatProviderId, string> = {
  deepseek: "Standart (önerilen)",
  gemini: "Alternatif 1",
  anthropic: "Alternatif 2",
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

export function hasUserApiKey(): boolean {
  return Boolean(loadUserApiCredentials()?.apiKey);
}
