import type { ElKitabiChapter } from "../types";

export const CH07: ElKitabiChapter = {
  id: "bolum-7",
  number: 7,
  title: "Donuslu Fiiller (Reflexive Verben)",
  practiceHref: "/konus-dinle",
  practiceLabel: "Konus-Dinle ile pratik",
  subsections: [
    {
      id: "ch07-1",
      title: "7.1 Donuslu zamirler",
      blocks: [
        {
          type: "table",
          headers: ["Sahis", "Akk", "Dat"],
          rows: [
            ["ich", "mich", "mir"],
            ["du", "dich", "dir"],
            ["er/sie/es", "sich", "sich"],
            ["wir", "uns", "uns"],
            ["sie/Sie", "sich", "sich"],
          ],
        },
        {
          type: "callout",
          kind: "ornek",
          text: "Ich wasche mich. Wir treffen uns um 8.",
          de: "Ich wasche mich.",
        },
      ],
    },
    {
      id: "ch07-2",
      title: "7.2 Akkusativ mi Dativ mi?",
      blocks: [
        {
          type: "callout",
          kind: "ipucu",
          text: "Baska nesne varsa zamir Dativ: Ich wasche mir die Hande. Yoksa Akk: Ich wasche mich.",
        },
      ],
    },
    {
      id: "ch07-3",
      title: "7.3 Sik kullanilan donuslu fiiller",
      blocks: [
        {
          type: "table",
          headers: ["Fiil", "Anlam", "Ornek"],
          rows: [
            ["sich freuen", "sevinmek", "Ich freue mich auf den Urlaub."],
            ["sich beeilen", "acele etmek", "Beeil dich!"],
            ["sich treffen", "bulusmak", "Wir treffen uns morgen."],
            ["sich vorstellen", "tanitmak", "Darf ich mich vorstellen?"],
            ["sich setzen", "oturmak", "Setzen Sie sich!"],
            ["sich kummern um", "ilgilenmek", "Sie kümmert sich um die Kinder."],
          ],
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "sich vorstellen: mich vor (tanitmak) vs mir etwas vor (hayal etmek).",
        },
      ],
    },
  ],
};
