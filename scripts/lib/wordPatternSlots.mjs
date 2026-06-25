/**
 * Kelime × kalıp motoru — build-a1-patterns.mjs ve test scriptleri tarafından kullanılır.
 */

const SKIP_WORDS = new Set([
  "sein",
  "haben",
  "werden",
  "und",
  "oder",
  "aber",
  "ja",
  "nein",
  "danke",
  "bitte",
  "hallo",
  "tschüss",
  "guten morgen",
  "guten tag",
  "guten abend",
  "gute nacht",
]);

const LANGUAGE_WORDS = new Set([
  "deutsch",
  "türkisch",
  "englisch",
  "russisch",
  "arabisch",
  "französisch",
  "spanisch",
  "italienisch",
  "polnisch",
  "kurdisch",
]);

const DRINK_WORDS = new Set([
  "wasser",
  "kaffee",
  "tee",
  "milch",
  "saft",
  "cola",
  "bier",
  "wein",
  "orangensaft",
  "apfelsaft",
]);

const UNCOUNTABLE_HABEN = new Set(["zeit", "geld", "hunger", "durst", "angst", "lust", "arbeit"]);

const PLACE_CATEGORIES = new Set(["Tanışma", "Ulaşım", "Basit yön tarifleri"]);
const FOOD_CATEGORIES = new Set(["Market", "Restoran"]);
const WORK_CATEGORIES = new Set(["İş"]);

/** Kalıp kimlikleri — kelime bankasından örnek üretilebilenler */
export const VOCAB_PATTERN_IDS = [
  "ich-bin",
  "ich-habe",
  "ich-moechte",
  "ich-kann",
  "ich-muss",
  "ich-will",
  "ich-brauche",
  "ich-esse",
  "ich-trinke",
  "ich-kaufe",
  "ich-lerne",
  "ich-arbeite",
  "ich-wohne-in",
  "ich-komme-aus",
  "ich-arbeite-als",
  "ich-spreche",
  "ich-verstehe",
  "das-ist",
  "ich-habe-keine",
  "wo-ist",
  "hast-du",
  "gibt-es",
  "was-ist",
  "wie-viel-kostet",
];

export function akk(de, article) {
  if (!article) return de;
  if (article === "der") return `einen ${de}`;
  if (article === "die") return `eine ${de}`;
  return `ein ${de}`;
}

export function nom(de, article) {
  if (!article) return de;
  if (article === "der") return `ein ${de}`;
  if (article === "die") return `eine ${de}`;
  return `ein ${de}`;
}

export function defArt(de, article) {
  if (!article) return de;
  return `${article} ${de}`;
}

export function keine(de, article) {
  if (!article) return `kein ${de}`;
  if (article === "der") return `keinen ${de}`;
  if (article === "die") return `keine ${de}`;
  return `kein ${de}`;
}

function firstTr(translationTr) {
  return translationTr.split("/")[0].trim();
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function classifyWord(word) {
  const w = word.word.toLowerCase();
  if (SKIP_WORDS.has(w)) return "skip";
  if (word.tags?.includes("greeting")) return "skip";
  if (word.word.split(" ").length > 2) return "skip";

  if (word.tags?.includes("verb")) return "verb";
  if (word.tags?.includes("adjective")) return "adjective";
  if (LANGUAGE_WORDS.has(w) || word.tags?.includes("language")) return "language";

  if (word.article) {
    if (FOOD_CATEGORIES.has(word.category) || word.tags?.includes("food")) {
      return DRINK_WORDS.has(w) ? "drink" : "food";
    }
    if (WORK_CATEGORIES.has(word.category)) return "work_noun";
    if (PLACE_CATEGORIES.has(word.category) && word.tags?.includes("place")) return "place";
    return "noun";
  }

  if (WORK_CATEGORIES.has(word.category)) return "profession";
  if (word.category === "Tanışma" && /^[A-ZÄÖÜ][a-zäöüß]+$/.test(word.word)) return "name";

  return "other";
}

export function isEligible(word, patternId) {
  const kind = classifyWord(word);
  if (kind === "skip") return false;

  switch (patternId) {
    case "ich-bin":
      return kind === "profession";
    case "ich-habe":
      return (
        kind === "noun" ||
        kind === "food" ||
        kind === "work_noun" ||
        UNCOUNTABLE_HABEN.has(word.word.toLowerCase())
      );
    case "ich-moechte":
      return kind === "food" || kind === "drink" || kind === "noun" || kind === "verb";
    case "ich-kann":
    case "ich-muss":
    case "ich-will":
      return kind === "verb";
    case "ich-brauche":
    case "ich-kaufe":
      return kind === "noun" || kind === "food" || kind === "work_noun";
    case "ich-esse":
      return kind === "food";
    case "ich-trinke":
      return kind === "drink" || (kind === "food" && DRINK_WORDS.has(word.word.toLowerCase()));
    case "ich-lerne":
    case "ich-spreche":
    case "ich-verstehe":
      return kind === "language";
    case "ich-arbeite":
    case "ich-wohne-in":
      return kind === "place" || (kind === "noun" && PLACE_CATEGORIES.has(word.category));
    case "ich-komme-aus":
      return kind === "place" || word.category === "Tanışma";
    case "ich-arbeite-als":
      return kind === "profession" || kind === "work_noun";
    case "das-ist":
      return kind === "noun" || kind === "food" || kind === "work_noun";
    case "ich-habe-keine":
      return kind === "noun" || kind === "food" || kind === "work_noun";
    case "wo-ist":
      return kind === "noun" || kind === "place" || kind === "work_noun";
    case "hast-du":
      return kind === "noun" || kind === "food" || UNCOUNTABLE_HABEN.has(word.word.toLowerCase());
    case "gibt-es":
      return kind === "noun" || kind === "food";
    case "was-ist":
      return kind === "noun" || kind === "food" || kind === "work_noun";
    case "wie-viel-kostet":
      return kind === "noun" || kind === "food";
    default:
      return false;
  }
}

function slotPart(de, tr, role = "slot") {
  return { de, tr, role };
}

function verbModalTr(tr, kind) {
  const stem = tr.replace(/(mek|mak)$/i, "");
  if (kind === "kann") return `${capitalize(stem)}ebilirim.`;
  if (kind === "muss") return `${capitalize(stem)}mek zorundayım.`;
  if (kind === "will") return `${capitalize(stem)}mek istiyorum.`;
  return `${capitalize(tr)}.`;
}

export function buildSentence(word, patternId) {
  const tr = firstTr(word.translation_tr);
  const w = word.word;
  const kind = classifyWord(word);

  switch (patternId) {
    case "ich-bin": {
      const de = `Ich bin ${w}.`;
      return {
        de,
        tr: `Ben ${tr}im/yim.`,
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: "bin", tr: "…ım", role: "verb" },
          slotPart(w, tr),
        ],
      };
    }
    case "ich-habe": {
      const slot =
        UNCOUNTABLE_HABEN.has(w.toLowerCase()) || !word.article
          ? w
          : akk(w, word.article);
      const de = `Ich habe ${slot}.`;
      let trSent = `Benim ${tr} var.`;
      if (w.toLowerCase() === "hunger") trSent = "Açım var.";
      if (w.toLowerCase() === "durst") trSent = "Susuzum.";
      if (w.toLowerCase() === "zeit") trSent = "Vaktim var.";
      return {
        de,
        tr: trSent,
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: "habe", tr: "var (benim)", role: "verb" },
          slotPart(slot, tr),
        ],
      };
    }
    case "ich-moechte": {
      const slot =
        kind === "verb" ? w : word.article ? akk(w, word.article) : w;
      const de = `Ich möchte ${slot}.`;
      return {
        de,
        tr: `${capitalize(tr)} istiyorum.`,
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: "möchte", tr: "isterim", role: "verb" },
          slotPart(slot, tr),
        ],
      };
    }
    case "ich-kann":
    case "ich-muss":
    case "ich-will": {
      const verbMap = {
        "ich-kann": { de: "kann", tr: "yapabilirim" },
        "ich-muss": { de: "muss", tr: "zorundayım" },
        "ich-will": { de: "will", tr: "istiyorum" },
      };
      const v = verbMap[patternId];
      const de = `Ich ${v.de} ${w}.`;
      const modalKind = patternId === "ich-kann" ? "kann" : patternId === "ich-muss" ? "muss" : "will";
      return {
        de,
        tr: verbModalTr(tr, modalKind),
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: v.de, tr: v.tr, role: "verb" },
          slotPart(w, tr),
        ],
      };
    }
    case "ich-brauche": {
      const slot = word.article ? akk(w, word.article) : w;
      const de = `Ich brauche ${slot}.`;
      return {
        de,
        tr: `${capitalize(tr)} lazım.`,
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: "brauche", tr: "ihtiyacım var", role: "verb" },
          slotPart(slot, tr),
        ],
      };
    }
    case "ich-esse": {
      const slot = word.article ? akk(w, word.article) : w;
      const de = `Ich esse ${slot}.`;
      return {
        de,
        tr: `${tr} yiyorum.`,
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: "esse", tr: "yiyorum", role: "verb" },
          slotPart(slot, tr),
        ],
      };
    }
    case "ich-trinke": {
      const de = `Ich trinke ${w}.`;
      return {
        de,
        tr: `${tr} içiyorum.`,
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: "trinke", tr: "içiyorum", role: "verb" },
          slotPart(w, tr),
        ],
      };
    }
    case "ich-kaufe": {
      const slot = word.article ? akk(w, word.article) : w;
      const de = `Ich kaufe ${slot}.`;
      return {
        de,
        tr: `${tr} satın alıyorum.`,
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: "kaufe", tr: "satın alıyorum", role: "verb" },
          slotPart(slot, tr),
        ],
      };
    }
    case "ich-lerne": {
      const de = `Ich lerne ${w}.`;
      return {
        de,
        tr: `${tr} öğreniyorum.`,
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: "lerne", tr: "öğreniyorum", role: "verb" },
          slotPart(w, tr),
        ],
      };
    }
    case "ich-arbeite": {
      const de = `Ich arbeite in ${w}.`;
      return {
        de,
        tr: `${tr}'de çalışıyorum.`,
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: "arbeite", tr: "çalışıyorum", role: "verb" },
          { de: "in", tr: "-de" },
          slotPart(w, tr),
        ],
      };
    }
    case "ich-wohne-in": {
      const de = `Ich wohne in ${w}.`;
      return {
        de,
        tr: `${tr}'de oturuyorum.`,
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: "wohne", tr: "oturuyorum", role: "verb" },
          { de: "in", tr: "-de" },
          slotPart(w, tr),
        ],
      };
    }
    case "ich-komme-aus": {
      const de = `Ich komme aus ${w}.`;
      return {
        de,
        tr: `${tr}'den geliyorum.`,
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: "komme", tr: "geliyorum", role: "verb" },
          { de: "aus", tr: "-den" },
          slotPart(w, tr),
        ],
      };
    }
    case "ich-arbeite-als": {
      const de = `Ich arbeite als ${w}.`;
      return {
        de,
        tr: `${tr} olarak çalışıyorum.`,
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: "arbeite", tr: "çalışıyorum", role: "verb" },
          { de: "als", tr: "olarak" },
          slotPart(w, tr),
        ],
      };
    }
    case "ich-spreche":
    case "ich-verstehe": {
      const verb = patternId === "ich-spreche" ? "spreche" : "verstehe";
      const verbTr = patternId === "ich-spreche" ? "konuşuyorum" : "anlıyorum";
      const de = `Ich ${verb} ${w}.`;
      return {
        de,
        tr: `${tr} ${verbTr}.`,
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: verb, tr: verbTr, role: "verb" },
          slotPart(w, tr),
        ],
      };
    }
    case "das-ist": {
      const slot = word.article ? nom(w, word.article) : w;
      const de = `Das ist ${slot}.`;
      return {
        de,
        tr: `Bu bir ${tr}.`,
        breakdown: [
          { de: "Das", tr: "Bu" },
          { de: "ist", tr: "…dır", role: "verb" },
          slotPart(slot, tr),
        ],
      };
    }
    case "ich-habe-keine": {
      if (!word.article) return null;
      const slot = keine(w, word.article);
      const de = `Ich habe ${slot}.`;
      return {
        de,
        tr: `Benim ${tr} yok.`,
        breakdown: [
          { de: "Ich", tr: "Ben" },
          { de: "habe", tr: "var", role: "verb" },
          slotPart(slot, tr),
        ],
      };
    }
    case "wo-ist": {
      if (!word.article) return null;
      const slot = defArt(w, word.article);
      const de = `Wo ist ${slot}?`;
      return {
        de,
        tr: `${capitalize(tr)} nerede?`,
        breakdown: [
          { de: "Wo", tr: "Nerede", role: "question" },
          { de: "ist", tr: "…", role: "verb" },
          slotPart(slot, tr),
        ],
      };
    }
    case "hast-du": {
      const slot =
        UNCOUNTABLE_HABEN.has(w.toLowerCase()) || !word.article
          ? w
          : akk(w, word.article);
      const de = `Hast du ${slot}?`;
      return {
        de,
        tr: `${capitalize(tr)} var mı (sende)?`,
        breakdown: [
          { de: "Hast", tr: "var mı", role: "verb" },
          { de: "du", tr: "sen" },
          slotPart(slot, tr),
        ],
      };
    }
    case "gibt-es": {
      const slot = word.article ? akk(w, word.article) : w;
      const de = `Gibt es ${slot}?`;
      return {
        de,
        tr: `${capitalize(tr)} var mı?`,
        breakdown: [
          { de: "Gibt es", tr: "var mı", role: "verb" },
          slotPart(slot, tr),
        ],
      };
    }
    case "was-ist": {
      const neuter = word.article === "die" ? "die" : "das";
      const slot = word.article ? `${neuter} ${w}` : w;
      const de = `Was ist ${slot}?`;
      return {
        de,
        tr: `${capitalize(tr)} nedir?`,
        breakdown: [
          { de: "Was", tr: "Ne", role: "question" },
          { de: "ist", tr: "…dır", role: "verb" },
          slotPart(slot, tr),
        ],
      };
    }
    case "wie-viel-kostet": {
      if (!word.article) return null;
      const slot = defArt(w, word.article);
      const de = `Wie viel kostet ${slot}?`;
      return {
        de,
        tr: `${capitalize(tr)} ne kadar?`,
        breakdown: [
          { de: "Wie viel", tr: "Ne kadar", role: "question" },
          { de: "kostet", tr: "tutar", role: "verb" },
          slotPart(slot, tr),
        ],
      };
    }
    default:
      return null;
  }
}

export function shuffle(arr, seed = 0) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createWordPatternEngine(vocabWords) {
  const words = vocabWords.filter((w) => classifyWord(w) !== "skip");

  function getEligibleWords(patternId) {
    return words.filter((w) => isEligible(w, patternId));
  }

  function pickWordsForPattern(patternId, count, seed) {
    const pool = getEligibleWords(patternId);
    const byCategory = new Map();
    for (const w of pool) {
      const list = byCategory.get(w.category) ?? [];
      list.push(w);
      byCategory.set(w.category, list);
    }
    const diversified = [];
    const cats = shuffle([...byCategory.keys()], seed);
    let round = 0;
    while (diversified.length < count && round < 50) {
      for (const cat of cats) {
        const list = byCategory.get(cat);
        if (list && list[round]) diversified.push(list[round]);
        if (diversified.length >= count) break;
      }
      round++;
    }
    const rest = shuffle(pool.filter((w) => !diversified.includes(w)), seed + 1);
    return shuffle([...diversified, ...rest], seed).slice(0, count);
  }

  function patternCoverage() {
    const coverage = {};
    for (const id of VOCAB_PATTERN_IDS) {
      coverage[id] = getEligibleWords(id).length;
    }
    return coverage;
  }

  function buildWordPatternMap(maxPerWord = 8) {
    const map = {};
    for (const word of words) {
      const patterns = [];
      for (const patternId of VOCAB_PATTERN_IDS) {
        if (!isEligible(word, patternId)) continue;
        const sent = buildSentence(word, patternId);
        if (!sent) continue;
        patterns.push({
          patternId,
          de: sent.de,
          tr: sent.tr,
          breakdown: sent.breakdown,
        });
        if (patterns.length >= maxPerWord) break;
      }
      if (patterns.length > 0) {
        map[word.id] = {
          word: word.word,
          translation_tr: firstTr(word.translation_tr),
          patterns,
        };
      }
    }
    return map;
  }

  return {
    getEligibleWords,
    pickWordsForPattern,
    buildSentence,
    patternCoverage,
    buildWordPatternMap,
    isEligible,
    classifyWord,
  };
}
