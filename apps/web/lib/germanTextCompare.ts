/** Almanca yazı karşılaştırma — dinle-yaz (Diktat) için */

const ARTICLES = new Set(["der", "die", "das", "ein", "eine"]);

export function checkSentenceBuilt(selected: string[], expected: string): boolean {
  const user = normalizeGermanText(selected.join(" "));
  const answer = normalizeGermanText(expected);
  return user.length > 0 && user === answer;
}

export function normalizeGermanText(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[.,!?;:"„""''«»()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expectedVariants(expected: string, allowArticleOmit: boolean): string[] {
  const n = normalizeGermanText(expected);
  const set = new Set<string>([n]);
  if (allowArticleOmit) {
    const parts = n.split(" ");
    if (parts.length >= 2 && ARTICLES.has(parts[0])) {
      set.add(parts.slice(1).join(" "));
    }
  }
  return [...set];
}

export interface DictationResult {
  ok: boolean;
  score: number;
  normalizedUser: string;
  normalizedExpected: string;
  matchedVariant: string | null;
}

export function checkDictation(
  userInput: string,
  expected: string,
  options?: { allowArticleOmit?: boolean; minScore?: number }
): DictationResult {
  const allowArticleOmit = options?.allowArticleOmit ?? true;
  const minScore = options?.minScore ?? 92;
  const user = normalizeGermanText(userInput);
  const variants = expectedVariants(expected, allowArticleOmit);

  if (!user) {
    return {
      ok: false,
      score: 0,
      normalizedUser: user,
      normalizedExpected: normalizeGermanText(expected),
      matchedVariant: null,
    };
  }

  for (const variant of variants) {
    if (user === variant) {
      return {
        ok: true,
        score: 100,
        normalizedUser: user,
        normalizedExpected: variant,
        matchedVariant: variant,
      };
    }
  }

  let best = variants[0];
  let bestScore = similarity(user, best);
  for (const v of variants.slice(1)) {
    const s = similarity(user, v);
    if (s > bestScore) {
      bestScore = s;
      best = v;
    }
  }

  return {
    ok: bestScore >= minScore,
    score: bestScore,
    normalizedUser: user,
    normalizedExpected: best,
    matchedVariant: bestScore >= minScore ? best : null,
  };
}

function similarity(a: string, b: string): number {
  if (a === b) return 100;
  if (!a.length || !b.length) return 0;
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return Math.round((1 - dist / maxLen) * 100);
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i);

  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] =
        a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[n];
}
