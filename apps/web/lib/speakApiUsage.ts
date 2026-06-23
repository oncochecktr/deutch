import type { ChatProviderId } from "./chat/types";

export interface ApiUsageSnapshot {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  model: string;
  provider: ChatProviderId;
}

export interface SpeakApiUsageTotals {
  totalRequests: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  estimatedCostUsd: number;
  lastRequestAt: string | null;
  dayKey: string;
  dayRequests: number;
  dayCostUsd: number;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function emptyApiUsage(): SpeakApiUsageTotals {
  return {
    totalRequests: 0,
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    estimatedCostUsd: 0,
    lastRequestAt: null,
    dayKey: todayKey(),
    dayRequests: 0,
    dayCostUsd: 0,
  };
}

/** USD / 1M token — yaklaşık */
const PRICE_PER_MILLION: Record<string, { in: number; out: number }> = {
  "gemini-2.5-pro": { in: 1.25, out: 10 },
  "gemini-2.5-flash": { in: 0.15, out: 0.6 },
  "gemini-2.0-flash": { in: 0.1, out: 0.4 },
  "deepseek-chat": { in: 0.14, out: 0.28 },
  "deepseek-reasoner": { in: 0.55, out: 2.19 },
  default: { in: 1.25, out: 10 },
};

function resolveRates(model: string) {
  if (PRICE_PER_MILLION[model]) return PRICE_PER_MILLION[model];
  for (const key of Object.keys(PRICE_PER_MILLION)) {
    if (key !== "default" && model.includes(key)) return PRICE_PER_MILLION[key];
  }
  return PRICE_PER_MILLION.default;
}

export function estimateTokenCostUsd(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const rates = resolveRates(model);
  const cost =
    (promptTokens / 1_000_000) * rates.in + (completionTokens / 1_000_000) * rates.out;
  return Math.round(cost * 1_000_000) / 1_000_000;
}

export function estimateTokensFromText(
  model: string,
  input: string,
  output: string,
  provider: ChatProviderId = "gemini"
): ApiUsageSnapshot {
  const promptTokens = Math.ceil(input.length / 4);
  const completionTokens = Math.ceil(output.length / 4);
  return {
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    estimatedCostUsd: estimateTokenCostUsd(model, promptTokens, completionTokens),
    model,
    provider,
  };
}

export function recordApiUsage(
  current: SpeakApiUsageTotals,
  snapshot: ApiUsageSnapshot
): SpeakApiUsageTotals {
  const dayKey = todayKey();
  const dayReset = current.dayKey !== dayKey;

  return {
    totalRequests: current.totalRequests + 1,
    totalPromptTokens: current.totalPromptTokens + snapshot.promptTokens,
    totalCompletionTokens: current.totalCompletionTokens + snapshot.completionTokens,
    estimatedCostUsd: current.estimatedCostUsd + snapshot.estimatedCostUsd,
    lastRequestAt: new Date().toISOString(),
    dayKey,
    dayRequests: dayReset ? 1 : current.dayRequests + 1,
    dayCostUsd: dayReset ? snapshot.estimatedCostUsd : current.dayCostUsd + snapshot.estimatedCostUsd,
  };
}

export function normalizeApiUsage(raw: Partial<SpeakApiUsageTotals> | undefined): SpeakApiUsageTotals {
  const base = emptyApiUsage();
  if (!raw) return base;
  const staleDay = raw.dayKey !== todayKey();
  return {
    totalRequests: typeof raw.totalRequests === "number" ? raw.totalRequests : 0,
    totalPromptTokens: typeof raw.totalPromptTokens === "number" ? raw.totalPromptTokens : 0,
    totalCompletionTokens:
      typeof raw.totalCompletionTokens === "number" ? raw.totalCompletionTokens : 0,
    estimatedCostUsd: typeof raw.estimatedCostUsd === "number" ? raw.estimatedCostUsd : 0,
    lastRequestAt: typeof raw.lastRequestAt === "string" ? raw.lastRequestAt : null,
    dayKey: todayKey(),
    dayRequests: staleDay ? 0 : typeof raw.dayRequests === "number" ? raw.dayRequests : 0,
    dayCostUsd: staleDay ? 0 : typeof raw.dayCostUsd === "number" ? raw.dayCostUsd : 0,
  };
}

export function formatCostUsd(usd: number): string {
  if (usd < 0.0001) return "$0.00";
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(3)}`;
}

export function formatTokenCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export const MIN_MS_BETWEEN_CHAT_REQUESTS = 2500;

export function shouldBlockChatRequest(
  lastAt: number | null
): { blocked: boolean; reason?: string } {
  const now = Date.now();
  if (lastAt && now - lastAt < MIN_MS_BETWEEN_CHAT_REQUESTS) {
    return {
      blocked: true,
      reason: `Çok hızlı — ${Math.ceil((MIN_MS_BETWEEN_CHAT_REQUESTS - (now - lastAt)) / 1000)} sn bekle (API tasarrufu).`,
    };
  }
  return { blocked: false };
}
