/** Almanca yazı karşılaştırma — dinle-yaz (Diktat) + İngilizce klavye toleransı */

const ARTICLES = new Set(["der", "die", "das", "ein", "eine"]);

/** Kanonik form (doğru cevap) */
export function normalizeGermanText(s: string): string {
  return canonicalGerman(s);
}

function canonicalGerman(s: string): string {
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

/**
 * İngilizce klavyede yazılan kullanıcı girdisi için olası formlar:
 * - ü/ä/ö → u/a/o (veya ue/ae/oe)
 * - ß → ss, tek s, veya b (Grub → Gruss)
 */
export function germanUserVariants(input: string): string[] {
  const variants = new Set<string>();
  const push = (raw: string) => {
    const n = canonicalGerman(raw);
    if (n) variants.add(n);
  };

  push(input);

  const lower = input.trim().toLowerCase();
  const withDigraphs = lower
    .replace(/ae(?=[^aeiou])/g, "a")
    .replace(/oe(?=[^aeiou])/g, "o")
    .replace(/ue(?=[^aeiou])/g, "u");
  push(withDigraphs);

  for (const base of [...variants]) {
    variants.add(base.replace(/([aeiouy])b(?=\s|$|[^aeiouy])/g, "$1ss"));
    variants.add(base.replace(/([aeiouy])s(?=\s|$|[^aeiouy])/g, "$1ss"));
  }

  return [...variants];
}

export function germanTextsMatch(userInput: string, expected: string): boolean {
  const targets = new Set([canonicalGerman(expected)]);
  const users = germanUserVariants(userInput);
  for (const u of users) {
    if (targets.has(u)) return true;
  }
  return false;
}

export function checkSentenceBuilt(selected: string[], expected: string): boolean {
  const answer = canonicalGerman(expected);
  if (!answer) return false;
  return germanUserVariants(selected.join(" ")).some((u) => u === answer);
}

function expectedVariants(expected: string, allowArticleOmit: boolean): string[] {
  const n = canonicalGerman(expected);
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
  const userForms = germanUserVariants(userInput);
  const user = userForms[0] ?? "";
  const variants = expectedVariants(expected, allowArticleOmit);

  if (!user) {
    return {
      ok: false,
      score: 0,
      normalizedUser: user,
      normalizedExpected: canonicalGerman(expected),
      matchedVariant: null,
    };
  }

  for (const u of userForms) {
    for (const variant of variants) {
      if (u === variant) {
        return {
          ok: true,
          score: 100,
          normalizedUser: u,
          normalizedExpected: variant,
          matchedVariant: variant,
        };
      }
    }
  }

  let best = variants[0];
  let bestScore = 0;
  for (const u of userForms) {
    for (const v of variants) {
      const s = similarity(u, v);
      if (s > bestScore) {
        bestScore = s;
        best = v;
      }
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
