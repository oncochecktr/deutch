import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearAllStudyStorage } from "./studyReset";
import { STORAGE_BACKUP_KEY, STORAGE_KEY } from "./progress";
import { CARDS_SETTINGS_KEY } from "./cardsSettings";

describe("clearAllStudyStorage", () => {
  const local: Record<string, string> = {};
  const session: Record<string, string> = {};

  beforeEach(() => {
    for (const key of Object.keys(local)) delete local[key];
    for (const key of Object.keys(session)) delete session[key];

    vi.stubGlobal("localStorage", {
      get length() {
        return Object.keys(local).length;
      },
      key: (i: number) => Object.keys(local)[i] ?? null,
      getItem: (key: string) => local[key] ?? null,
      setItem: (key: string, value: string) => {
        local[key] = value;
      },
      removeItem: (key: string) => {
        delete local[key];
      },
    });

    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => session[key] ?? null,
      setItem: (key: string, value: string) => {
        session[key] = value;
      },
      removeItem: (key: string) => {
        delete session[key];
      },
    });
  });

  it("removes progress and study keys from local and session storage", () => {
    local[STORAGE_KEY] = "{}";
    local[CARDS_SETTINGS_KEY] = "{}";
    local["german-coach-smart-tip-home"] = "1";
    session[STORAGE_BACKUP_KEY] = "{}";

    clearAllStudyStorage();

    expect(local[STORAGE_KEY]).toBeUndefined();
    expect(local[CARDS_SETTINGS_KEY]).toBeUndefined();
    expect(local["german-coach-smart-tip-home"]).toBeUndefined();
    expect(session[STORAGE_BACKUP_KEY]).toBeUndefined();
  });
});
