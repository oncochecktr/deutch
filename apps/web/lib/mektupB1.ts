/**
 * Goethe B1 Schreiben — Brief / E-Mail (~80 Wörter, 4 Inhaltspunkte)
 */
import type { MektupExample, MektupSection, MektupStructureResult } from "./mektupTypes";

export const MEKTUP_B1_OVERVIEW = {
  exam: "Goethe B1 — Brief / E-Mail",
  rule:
    "Önce neden: ich schreibe Ihnen, weil … · Deshalb tek başına yetmez · Außerdem ile ikinci maddeyi bağla.",
};

export interface MektupB1Template {
  label: string;
  greeting: string;
  opening: string;
  body: string;
  closing: string[];
  note?: string;
}

export const MEKTUP_B1_TEMPLATES: Record<string, MektupB1Template> = {
  formal: {
    label: "Resmi e-posta / mektup (kurum, otel, iş)",
    greeting: "Sehr geehrte Damen und Herren,",
    opening: "ich schreibe Ihnen, weil …",
    body: "Außerdem möchte ich Sie fragen, ob … . Deshalb bitte ich Sie um …",
    closing: [
      "Ich wäre Ihnen dankbar, wenn Sie mir bald antworten könnten.",
      "Mit freundlichen Grüßen",
    ],
    note: "Tek erkek: Sehr geehrter Herr [Name], · Tek kadın: Sehr geehrte Frau [Name],",
  },
  complaint: {
    label: "Şikâyet (otel, komşu, hizmet)",
    greeting: "Sehr geehrte Damen und Herren,",
    opening: "ich möchte mich über … beschweren, weil …",
    body: "Leider war … . Außerdem … . Trotzdem …",
    closing: [
      "Ich bitte Sie, das Problem zu lösen.",
      "Mit freundlichen Grüßen",
    ],
  },
  informal: {
    label: "Samimi e-posta (arkadaş)",
    greeting: "Liebe/r …,",
    opening: "ich schreibe dir, weil …",
    body: "Außerdem wollte ich dir sagen, dass … . Deshalb …",
    closing: ["Ich freue mich auf deine Antwort.", "Viele Grüße"],
  },
};

export const MEKTUP_B1_CONNECTORS = [
  { de: "weil", tr: "çünkü (neden yan cümlesi)", level: "A1+" },
  { de: "deshalb / deswegen", tr: "bu yüzden (önce neden gerekir)", level: "A1+" },
  { de: "außerdem", tr: "ayrıca, bunun dışında", level: "B1" },
  { de: "trotzdem", tr: "yine de, buna rağmen", level: "B1" },
  { de: "jedoch", tr: "ancak (resmi)", level: "B1" },
  { de: "denn", tr: "çünkü (ana cümle sonrası)", level: "B1" },
  { de: "obwohl", tr: "rağmen (-e rağmen)", level: "B1" },
  { de: "dass", tr: "ki (Nebensatz)", level: "B1" },
] as const;

export const MEKTUP_B1_PHRASE_BANK = [
  {
    de: "Ich möchte Sie darauf hinweisen, dass …",
    tr: "… konusuna dikkatinizi çekmek istiyorum",
    tag: "resmi",
  },
  {
    de: "Könnten Sie mir bitte mitteilen, ob …?",
    tr: "… olup olmadığını bildirir misiniz? (Konjunktiv II)",
    tag: "resmi",
  },
  {
    de: "Ich wäre Ihnen dankbar, wenn Sie … könnten.",
    tr: "… yaparsanız minnettar olurum",
    tag: "resmi",
  },
  {
    de: "Leider muss ich Ihnen mitteilen, dass …",
    tr: "Maalesef size … bildirmek zorundayım",
    tag: "olumsuz",
  },
  {
    de: "Ich kann leider nicht kommen, weil …",
    tr: "Maalesef gelemiyorum, çünkü …",
    tag: "olumsuz",
  },
  {
    de: "Für Rückfragen stehe ich Ihnen gerne zur Verfügung.",
    tr: "Sorularınız için her zaman ulaşılabilirim",
    tag: "kapanış",
  },
  {
    de: "Ich hoffe, dass Sie mein Anliegen verstehen.",
    tr: "Talebimin anlaşılacağını umuyorum",
    tag: "kapanış",
  },
  {
    de: "Könnten wir einen anderen Termin vereinbaren?",
    tr: "Başka bir randevu ayarlayabilir miyiz?",
    tag: "soru",
  },
  {
    de: "Es tut mir leid, dass …",
    tr: "… için üzgünüm",
    tag: "özür",
  },
  {
    de: "Ich freue mich auf Ihre Antwort.",
    tr: "Cevabınızı bekliyorum",
    tag: "kapanış",
  },
] as const;

export const MEKTUP_B1_RUBRIC = [
  { id: "inhalt", label: "4 maddeye cevap", weight: 30 },
  { id: "wortzahl", label: "80+ kelime", weight: 20 },
  { id: "register", label: "Resmi Sie / doğru hitap", weight: 20 },
  { id: "konnektoren", label: "2+ bağlaç (weil, außerdem…)", weight: 15 },
  { id: "struktur", label: "Anrede + kapanış", weight: 15 },
] as const;

const B1_CLOSING: MektupSection["phrases"] = [
  {
    de: "Ich wäre Ihnen dankbar, wenn Sie mir bald antworten könnten.",
    tr: "En kısa sürede cevap verirseniz minnettar olurum.",
  },
  { de: "Ich freue mich auf Ihre Antwort.", tr: "Cevabınızı bekliyorum." },
];

export const MEKTUP_B1_EXAMPLES: MektupExample[] = [
  {
    id: "b1_mektup_001",
    level: "B1",
    titleTr: "Otel şikâyeti (gürültü + ısıtma)",
    register: "formal",
    promptDe:
      "Sie waren im Hotel „Stadtmitte“ in München. Die Heizung funktionierte nicht und es war sehr laut. Schreiben Sie an das Hotel:",
    promptTr:
      "Münih’teki Stadtmitte otelinde kaldınız. Isıtma çalışmadı ve çok gürültü vardı. Otele yazın:",
    minWords: 80,
    maxWords: 120,
    bullets: [
      { de: "Warum schreiben Sie?", tr: "Neden yazıyorsunuz?", hints: ["beschwer", "hotel", "übernacht"] },
      { de: "Problem: Heizung?", tr: "Isıtma sorunu", hints: ["heizung", "kalt", "funktion"] },
      { de: "Problem: Lärm?", tr: "Gürültü", hints: ["lärm", "laut", "nacht"] },
      { de: "Was erwarten Sie?", tr: "Ne istiyorsunuz?", hints: ["lös", "entschuld", "rückerstatt", "antwort"] },
    ],
    sections: [
      {
        id: "anrede",
        labelDe: "Anrede",
        labelTr: "Hitap",
        hintTr: "Resmi: Sehr geehrte Damen und Herren,",
        placeholder: "Sehr geehrte Damen und Herren,",
        phrases: [{ de: "Sehr geehrte Damen und Herren,", tr: "Sayın yetkililer," }],
      },
      {
        id: "einleitung",
        labelDe: "Einleitung",
        labelTr: "Giriş + neden",
        hintTr: "ich schreibe Ihnen, weil ich … übernachtet habe",
        placeholder:
          "ich schreibe Ihnen, weil ich vom 12. bis 14. März in Ihrem Hotel übernachtet habe.",
        phrases: [
          {
            de: "ich schreibe Ihnen, weil ich letzte Woche in Ihrem Hotel übernachtet habe.",
            tr: "Geçen hafta otelinizde kaldığım için yazıyorum.",
          },
          {
            de: "ich möchte mich über meinen Aufenthalt beschweren.",
            tr: "Konaklamam hakkında şikâyet etmek istiyorum.",
          },
        ],
      },
      {
        id: "hauptteil",
        labelDe: "Hauptteil",
        labelTr: "Ana bölüm (2 sorun)",
        hintTr: "Leider … . Außerdem … . Trotzdem …",
        placeholder:
          "Leider hat die Heizung in meinem Zimmer nicht funktioniert, deshalb war es sehr kalt. Außerdem war es nachts sehr laut, weil Gäste im Flur gesprochen haben. Trotzdem habe ich keine ruhige Nacht gehabt.",
        phrases: [
          {
            de: "Leider hat die Heizung nicht funktioniert, deshalb war es sehr kalt.",
            tr: "Maalesef ısıtma çalışmadı, bu yüzden çok soğuktu.",
          },
          {
            de: "Außerdem war es nachts sehr laut.",
            tr: "Ayrıca geceleri çok gürültülüydü.",
          },
        ],
      },
      {
        id: "forderung",
        labelDe: "Bitte / Erwartung",
        labelTr: "Talep",
        hintTr: "Ich bitte Sie um … / eine Lösung",
        placeholder:
          "Ich bitte Sie, das Problem zu prüfen und mir eine Antwort zu geben. Vielleicht können Sie mir einen Teil des Preises erstatten.",
        phrases: [
          {
            de: "Ich bitte Sie, das Problem zu lösen.",
            tr: "Sorunu çözmenizi rica ediyorum.",
          },
          {
            de: "Könnten Sie mir bitte mitteilen, was Sie unternehmen werden?",
            tr: "Ne yapacağınızı bildirir misiniz?",
          },
        ],
      },
      {
        id: "schluss",
        labelDe: "Schluss",
        labelTr: "Kapanış",
        hintTr: "Ich wäre Ihnen dankbar …",
        placeholder: "Ich wäre Ihnen dankbar, wenn Sie mir bis Freitag antworten könnten.",
        phrases: B1_CLOSING,
      },
      {
        id: "gruss",
        labelDe: "Gruß",
        labelTr: "İmza",
        hintTr: "Mit freundlichen Grüßen + ad soyad",
        placeholder: "Mit freundlichen Grüßen\nTimur Yilmaz",
        phrases: [{ de: "Mit freundlichen Grüßen", tr: "Saygılarımla" }],
      },
    ],
    sampleLetter: `Sehr geehrte Damen und Herren,

ich schreibe Ihnen, weil ich vom 12. bis 14. März in Ihrem Hotel übernachtet habe. Leider möchte ich mich über meinen Aufenthalt beschweren.

Die Heizung in meinem Zimmer hat nicht funktioniert, deshalb war es sehr kalt. Außerdem war es nachts sehr laut, weil Gäste im Flur lange gesprochen haben. Trotzdem konnte ich nicht schlafen.

Ich bitte Sie, das Problem zu prüfen. Könnten Sie mir bitte mitteilen, ob eine Rückerstattung möglich ist? Ich wäre Ihnen dankbar, wenn Sie mir bis Freitag antworten könnten.

Mit freundlichen Grüßen
Timur Yilmaz`,
  },
  {
    id: "b1_mektup_002",
    level: "B1",
    titleTr: "Dil kursu — seviye değişikliği",
    register: "formal",
    promptDe:
      "Sie besuchen einen Deutschkurs. Der Kurs ist zu schwer. Schreiben Sie an die Sprachschule:",
    promptTr: "Almanca kursuna gidiyorsunuz. Kurs çok zor. Dil okuluna yazın:",
    minWords: 80,
    bullets: [
      { de: "Welcher Kurs?", tr: "Hangi kurs?", hints: ["kurs", "b1", "niveau"] },
      { de: "Problem?", tr: "Sorun ne?", hints: ["schwer", "schnell", "versteh"] },
      { de: "Wunsch?", tr: "Ne istiyorsunuz?", hints: ["leichter", "andere", "gruppe", "a2"] },
      { de: "Termin?", tr: "Randevu / ne zaman?", hints: ["termin", "wann", "besprechen"] },
    ],
    sections: [
      {
        id: "anrede",
        labelDe: "Anrede",
        labelTr: "Hitap",
        hintTr: "Sehr geehrte Damen und Herren,",
        placeholder: "Sehr geehrte Damen und Herren,",
        phrases: [{ de: "Sehr geehrte Damen und Herren,", tr: "Sayın yetkililer," }],
      },
      {
        id: "einleitung",
        labelDe: "Einleitung",
        labelTr: "Giriş",
        hintTr: "ich schreibe Ihnen, weil …",
        placeholder:
          "ich schreibe Ihnen, weil ich seit Januar den B1-Kurs bei Ihnen besuche.",
        phrases: [
          {
            de: "ich schreibe Ihnen, weil ich einen Deutschkurs bei Ihnen besuche.",
            tr: "Sizde Almanca kursuna gittiğim için yazıyorum.",
          },
        ],
      },
      {
        id: "hauptteil",
        labelDe: "Hauptteil",
        labelTr: "Sorun + istek",
        hintTr: "Leider ist … . Außerdem … . Deshalb möchte ich …",
        placeholder:
          "Leider ist der Kurs für mich zu schwer, weil die Grammatik sehr schnell erklärt wird. Außerdem verstehe ich nicht alles. Deshalb möchte ich in eine leichtere Gruppe wechseln.",
        phrases: [
          { de: "Leider ist der Kurs für mich zu schwer.", tr: "Maalesef kurs benim için çok zor." },
          {
            de: "Deshalb möchte ich in eine andere Gruppe wechseln.",
            tr: "Bu yüzden başka bir gruba geçmek istiyorum.",
          },
        ],
      },
      {
        id: "fragen",
        labelDe: "Fragen",
        labelTr: "Sorular",
        hintTr: "Könnten Sie …? Wann …?",
        placeholder:
          "Könnten Sie mir bitte sagen, ob ein A2-Kurs Platz hat? Wann können wir einen Termin vereinbaren?",
        phrases: [
          {
            de: "Könnten Sie mir bitte mitteilen, ob ein Platz frei ist?",
            tr: "Yer olup olmadığını bildirir misiniz?",
          },
          { de: "Wann können wir einen Termin vereinbaren?", tr: "Ne zaman randevu ayarlayabiliriz?" },
        ],
      },
      {
        id: "schluss",
        labelDe: "Schluss",
        labelTr: "Kapanış",
        hintTr: "Ich wäre Ihnen dankbar …",
        placeholder: "Ich wäre Ihnen dankbar, wenn Sie mir bald antworten könnten.",
        phrases: B1_CLOSING,
      },
      {
        id: "gruss",
        labelDe: "Gruß",
        labelTr: "İmza",
        hintTr: "Mit freundlichen Grüßen",
        placeholder: "Mit freundlichen Grüßen\nTimur Yilmaz",
        phrases: [{ de: "Mit freundlichen Grüßen", tr: "Saygılarımla" }],
      },
    ],
    sampleLetter: `Sehr geehrte Damen und Herren,

ich schreibe Ihnen, weil ich seit Januar den B1-Kurs in Ihrer Sprachschule besuche. Leider ist der Kurs für mich zu schwer, weil die Grammatik sehr schnell erklärt wird.

Außerdem verstehe ich nicht alles im Unterricht. Deshalb möchte ich in eine leichtere Gruppe wechseln, zum Beispiel A2.

Könnten Sie mir bitte mitteilen, ob ein Platz frei ist? Wann können wir einen Termin vereinbaren? Ich wäre Ihnen dankbar, wenn Sie mir diese Woche antworten könnten.

Mit freundlichen Grüßen
Timur Yilmaz`,
  },
  {
    id: "b1_mektup_003",
    level: "B1",
    titleTr: "Kayıp eşya — tren / Deutsche Bahn",
    register: "formal",
    promptDe:
      "Sie haben Ihre Tasche im Zug vergessen. Schreiben Sie an das Fundbüro der Bahn:",
    promptTr: "Trende çantanızı unuttunuz. Bahn kayıp eşya bürosuna yazın:",
    minWords: 80,
    bullets: [
      { de: "Was vergessen?", tr: "Ne unuttunuz?", hints: ["tasche", "täsch", "vergess"] },
      { de: "Wann / welche Strecke?", tr: "Ne zaman / hangi hat?", hints: ["zug", "fahrt", "münchen", "datum"] },
      { de: "Beschreibung?", tr: "Tanım", hints: ["schwarz", "inhalt", "handy"] },
      { de: "Bitte?", tr: "Ne istiyorsunuz?", hints: ["finden", "schicken", "abhol"] },
    ],
    sections: [
      {
        id: "anrede",
        labelDe: "Anrede",
        labelTr: "Hitap",
        hintTr: "Sehr geehrte Damen und Herren,",
        placeholder: "Sehr geehrte Damen und Herren,",
        phrases: [{ de: "Sehr geehrte Damen und Herren,", tr: "Sayın yetkililer," }],
      },
      {
        id: "einleitung",
        labelDe: "Einleitung",
        labelTr: "Giriş",
        hintTr: "ich schreibe Ihnen, weil ich … vergessen habe",
        placeholder:
          "ich schreibe Ihnen, weil ich gestern meine Tasche im Zug vergessen habe.",
        phrases: [
          {
            de: "ich schreibe Ihnen, weil ich meine Tasche im Zug vergessen habe.",
            tr: "Trende çantamı unuttuğum için yazıyorum.",
          },
        ],
      },
      {
        id: "hauptteil",
        labelDe: "Details",
        labelTr: "Detaylar",
        hintTr: "Am … fuhr ich mit dem Zug … . Die Tasche ist …",
        placeholder:
          "Am Montag fuhr ich mit dem Zug von München nach Nürnberg. Die Tasche ist schwarz und klein. Außerdem war mein Handy und mein Portemonnaie darin.",
        phrases: [
          { de: "Am Montag fuhr ich mit dem Zug von München nach Nürnberg.", tr: "Pazartesi Münih–Nürnberg trenine bindim." },
          { de: "Die Tasche ist schwarz und enthält mein Handy.", tr: "Çanta siyah ve içinde telefonum var." },
        ],
      },
      {
        id: "bitte",
        labelDe: "Bitte",
        labelTr: "Rica",
        hintTr: "Könnten Sie …? Ich wäre Ihnen dankbar …",
        placeholder:
          "Könnten Sie mir bitte mitteilen, ob Sie die Tasche gefunden haben? Ich wäre Ihnen dankbar, wenn Sie mir Bescheid geben könnten.",
        phrases: [
          {
            de: "Könnten Sie mir bitte mitteilen, ob Sie die Tasche gefunden haben?",
            tr: "Çantayı bulup bulmadığınızı bildirir misiniz?",
          },
        ],
      },
      {
        id: "schluss",
        labelDe: "Schluss",
        labelTr: "Kapanış",
        hintTr: "Für Rückfragen …",
        placeholder: "Für Rückfragen stehe ich Ihnen gerne zur Verfügung.",
        phrases: [
          {
            de: "Für Rückfragen stehe ich Ihnen gerne zur Verfügung.",
            tr: "Sorularınız için ulaşılabilirim.",
          },
        ],
      },
      {
        id: "gruss",
        labelDe: "Gruß",
        labelTr: "İmza",
        hintTr: "Mit freundlichen Grüßen",
        placeholder: "Mit freundlichen Grüßen\nTimur Yilmaz",
        phrases: [{ de: "Mit freundlichen Grüßen", tr: "Saygılarımla" }],
      },
    ],
    sampleLetter: `Sehr geehrte Damen und Herren,

ich schreibe Ihnen, weil ich am Montag meine Tasche im Zug vergessen habe. Ich fuhr mit dem Regionalzug von München nach Nürnberg, gegen 18 Uhr.

Die Tasche ist schwarz und klein. Außerdem waren mein Handy, mein Portemonnaie und meine Schlüssel darin. Deshalb bitte ich Sie um Hilfe.

Könnten Sie mir bitte mitteilen, ob Sie die Tasche im Fundbüro haben? Ich wäre Ihnen dankbar, wenn Sie mir bald Bescheid geben könnten. Für Rückfragen stehe ich Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Timur Yilmaz`,
  },
];

const B1_CONNECTOR_PATTERN =
  /\b(weil|deshalb|deswegen|außerdem|trotzdem|jedoch|denn|obwohl|dass)\b/i;

export function countConnectors(text: string): number {
  const matches = text.toLowerCase().match(new RegExp(B1_CONNECTOR_PATTERN.source, "gi"));
  return matches ? new Set(matches.map((m) => m.toLowerCase())).size : 0;
}

export function checkB1Structure(text: string, minWords = 80): MektupStructureResult {
  const lower = text.toLowerCase();
  const missing: string[] = [];
  const hints: string[] = [];

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  if (words < minWords) {
    missing.push(`Kelime sayısı (${words}/${minWords})`);
  }

  const hasWeilOpening =
    lower.includes("weil") && /schreibe (ich|ihnen|dir|euch)/.test(lower);
  const hasBeschweren = lower.includes("beschwer") || lower.includes("hinweisen");
  const deshalbIdx = lower.indexOf("deshalb");
  const hasDeshalbWithReason =
    deshalbIdx > 0 && lower.slice(0, deshalbIdx).includes(".");
  const hasWhy = hasWeilOpening || hasBeschweren || hasDeshalbWithReason;

  if (!hasWhy) {
    missing.push("Neden (ich schreibe …, weil … / beschweren / Deshalb öncesi neden)");
  }

  const hasAnrede =
    lower.includes("sehr geehrte") ||
    lower.includes("sehr geehrter") ||
    lower.includes("liebe ") ||
    lower.includes("lieber ");
  if (!hasAnrede) missing.push("Anrede (Sehr geehrte … / Liebe …)");

  const hasClosing =
    lower.includes("mit freundlichen grüßen") || lower.includes("viele grüße");
  if (!hasClosing) missing.push("Grußformel (Mit freundlichen Grüßen)");

  const connectors = countConnectors(text);
  if (connectors < 2) {
    missing.push("En az 2 bağlaç (weil, außerdem, deshalb, trotzdem…)");
    hints.push("Außerdem ve weil aynı mektupta kullan — B1 puanı artar.");
  }

  if (!lower.includes("bitte") && !lower.includes("könnten") && !lower.includes("dankbar")) {
    hints.push("Resmi rica: Könnten Sie …? / Ich wäre Ihnen dankbar …");
  }

  const score = Math.max(
    0,
    100 -
      missing.length * 18 -
      (words < minWords ? 15 : 0) +
      (connectors >= 3 ? 5 : 0)
  );

  return {
    ok: missing.length === 0,
    missing,
    score: Math.min(100, score),
    hints,
  };
}

export function scoreB1Rubric(
  text: string,
  bulletsOk: boolean,
  minWords: number
): { total: number; items: { id: string; label: string; pct: number }[] } {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lower = text.toLowerCase();
  const connectors = countConnectors(text);
  const struct = checkB1Structure(text, minWords);

  const items = [
    {
      id: "inhalt",
      label: "4 maddeye cevap",
      pct: bulletsOk ? 100 : Math.round((lower.split("?").length - 1) * 25),
    },
    {
      id: "wortzahl",
      label: "80+ kelime",
      pct: words >= minWords ? 100 : Math.round((words / minWords) * 100),
    },
    {
      id: "register",
      label: "Resmi hitap",
      pct: lower.includes("sehr geehrte") || lower.includes("ihnen") ? 100 : 50,
    },
    {
      id: "konnektoren",
      label: "Bağlaçlar",
      pct: Math.min(100, connectors * 40),
    },
    {
      id: "struktur",
      label: "Yapı",
      pct: struct.ok ? 100 : Math.max(0, 100 - struct.missing.length * 25),
    },
  ];

  const total = Math.round(
    items.reduce((sum, item, i) => sum + item.pct * MEKTUP_B1_RUBRIC[i]!.weight, 0) / 100
  );

  return { total, items };
}
