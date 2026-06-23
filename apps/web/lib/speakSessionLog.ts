export type SessionLogLevel = "info" | "ok" | "warn" | "error";

export interface SessionLogEntry {
  id: string;
  at: string;
  level: SessionLogLevel;
  message: string;
  detail?: string;
}

const MAX_LOGS = 40;

export function createLogEntry(
  level: SessionLogLevel,
  message: string,
  detail?: string
): SessionLogEntry {
  return {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
    level,
    message,
    detail,
  };
}

export function appendSessionLogs(
  logs: SessionLogEntry[],
  entry: SessionLogEntry
): SessionLogEntry[] {
  return [entry, ...logs].slice(0, MAX_LOGS);
}

export function formatLogTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
