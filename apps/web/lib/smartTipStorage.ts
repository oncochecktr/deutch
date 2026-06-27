const PREFIX = "german-coach-smart-tip-";

export function isSmartTipDismissed(id: string): boolean {
  try {
    return localStorage.getItem(PREFIX + id) === "1";
  } catch {
    return false;
  }
}

export function dismissSmartTip(id: string): void {
  try {
    localStorage.setItem(PREFIX + id, "1");
  } catch {
    /* ignore */
  }
}
