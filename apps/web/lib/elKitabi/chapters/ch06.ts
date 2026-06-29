import type { ElKitabiChapter } from "../types";

export const CH06: ElKitabiChapter = {
  id: "bolum-6",
  number: 6,
  title: "Edatlar (Prapositionen)",
  practiceHref: "/grundlagen/prepositions",
  practiceLabel: "Edatlar modulunu ac",
  subsections: [
    {
      id: "ch06-1",
      title: "6.1 Akkusativ edatlar",
      blocks: [
        {
          type: "table",
          headers: ["Edat", "Anlam", "Ornek"],
          rows: [
            ["durch", "icinden", "durch den Park"],
            ["fur", "icin", "fur meinen Freund"],
            ["gegen", "karsi", "gegen die Wand"],
            ["ohne", "siz", "ohne dich"],
            ["um", "etrafinda / saat", "um 8 Uhr"],
            ["bis", "kadar", "bis Montag"],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "DOGFUB: Durch, Ohne, Gegen, Fur, Um, Bis → hepsi Akkusativ.",
        },
      ],
    },
    {
      id: "ch06-2",
      title: "6.2 Dativ edatlar",
      blocks: [
        {
          type: "table",
          headers: ["Edat", "Anlam", "Ornek"],
          rows: [
            ["aus", "den", "aus der Turkei"],
            ["bei", "yaninda", "bei meinem Vater"],
            ["mit", "ile", "mit dem Bus"],
            ["nach", "e", "nach Berlin"],
            ["von", "den", "von meiner Mutter"],
            ["zu", "e", "zum Arzt"],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "aus-bei-mit-nach-seit-von-zu — klasik tekerleme, hepsi Dativ.",
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "Kaynasmalar: zum, zur, beim, vom, im, am, ins, ans.",
        },
      ],
    },
    {
      id: "ch06-3",
      title: "6.3 Wechselprapositionen",
      blocks: [
        {
          type: "p",
          text: "Wohin? (hareket) → Akkusativ. Wo? (konum) → Dativ.",
        },
        {
          type: "table",
          headers: ["Edat", "Wohin? (Akk)", "Wo? (Dat)"],
          rows: [
            ["in", "in den Park", "in dem Park"],
            ["an", "an die Wand", "an der Wand"],
            ["auf", "auf den Tisch", "auf dem Tisch"],
          ],
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "Ich gehe in der Schule yanlis → Ich gehe in die Schule dogru.",
        },
      ],
    },
    {
      id: "ch06-4",
      title: "6.4-6.5 Genitiv edatlar ve edatli fiiller",
      blocks: [
        {
          type: "list",
          items: ["wegen, wahrend, trotz, statt → Genitiv (yazida)"],
        },
        {
          type: "table",
          headers: ["Fiil + edat", "Kasus", "Ornek"],
          rows: [
            ["warten auf", "Akk", "Ich warte auf den Bus."],
            ["sich freuen auf", "Akk", "Ich freue mich auf das Wochenende."],
            ["helfen bei", "Dat", "Er hilft mir bei der Arbeit."],
            ["Angst haben vor", "Dat", "Ich habe Angst vor dem Hund."],
          ],
        },
      ],
    },
  ],
};
