import type { ElKitabiChapter } from "../types";

export const CH04: ElKitabiChapter = {
  id: "bolum-4",
  number: 4,
  title: "Hal Sistemi (Kasus)",
  practiceHref: "/grundlagen/dativ",
  practiceLabel: "Dativ modulunu ac",
  subsections: [
    {
      id: "ch04-1",
      title: "4.1 Dort hal — genel bakis",
      blocks: [
        {
          type: "table",
          headers: ["Hal", "Soru", "Rol"],
          rows: [
            ["Nominativ", "wer? / was?", "ozne"],
            ["Akkusativ", "wen? / was?", "duz nesne"],
            ["Dativ", "wem?", "dolayli nesne"],
            ["Genitiv", "wessen?", "iyelik"],
          ],
        },
        {
          type: "callout",
          kind: "ornek",
          text: "Der Mann gibt dem Kind den Ball. = Adam cocuga topu veriyor.",
          de: "Der Mann gibt dem Kind den Ball.",
        },
      ],
    },
    {
      id: "ch04-2",
      title: "4.2-4.3 Artikel tablolari",
      blocks: [
        {
          type: "table",
          headers: ["", "eril", "disil", "notr", "cogul"],
          rows: [
            ["Nom", "der", "die", "das", "die"],
            ["Akk", "den", "die", "das", "die"],
            ["Dat", "dem", "der", "dem", "den (+n)"],
            ["Gen", "des", "der", "des", "der"],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "Akkusativ'de yalnizca eril der → den olur. Tek surpriz bu.",
        },
        {
          type: "table",
          headers: ["", "eril", "disil", "notr", "cogul"],
          caption: "ein/kein/mein ayni eklerle cekilir",
          rows: [
            ["Nom", "(k)ein", "(k)eine", "(k)ein", "keine"],
            ["Akk", "(k)einen", "(k)eine", "(k)ein", "keine"],
            ["Dat", "(k)einem", "(k)einer", "(k)einem", "keinen"],
          ],
        },
      ],
    },
    {
      id: "ch04-3",
      title: "4.4 Sahis zamirleri dort halde",
      blocks: [
        {
          type: "table",
          headers: ["Nom", "Akk", "Dat", "Nom", "Akk", "Dat"],
          rows: [
            ["ich", "mich", "mir", "wir", "uns", "uns"],
            ["du", "dich", "dir", "ihr", "euch", "euch"],
            ["er", "ihn", "ihm", "sie", "sie", "ihnen"],
          ],
        },
      ],
    },
    {
      id: "ch04-4",
      title: "4.5 Genitiv",
      blocks: [
        {
          type: "callout",
          kind: "ipucu",
          text: "Gunluk dilde von + Dativ: das Auto vom Mann. Yazida Genitiv tercih edilir.",
        },
        {
          type: "callout",
          kind: "ornek",
          text: "das Auto des Mannes = adamin arabasi",
          de: "das Auto des Mannes",
        },
      ],
    },
    {
      id: "ch04-5",
      title: "4.6 N-Deklination",
      blocks: [
        {
          type: "p",
          text: "Zayif eril isimler Nom disinda -(e)n alir: der Student → den Studenten, dem Studenten.",
        },
        {
          type: "list",
          items: [
            "der Student, der Junge, der Mensch, der Herr, der Name, der Tourist",
          ],
        },
      ],
    },
    {
      id: "ch04-6",
      title: "4.7 Sadece Dativ alan fiiller",
      blocks: [
        {
          type: "table",
          headers: ["Fiil", "Anlam", "Ornek"],
          rows: [
            ["helfen", "yardim etmek", "Ich helfe dir."],
            ["danken", "tesekkur", "Ich danke Ihnen."],
            ["gefallen", "hosa gitmek", "Das Buch gefallt mir."],
            ["gehoren", "ait olmak", "Das gehort mir."],
            ["passen", "uymak", "Die Hose passt dir."],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "Turkcede kime? diyebiliyorsan buyuk ihtimalle Dativ. Tam liste Ek B.",
        },
      ],
    },
    {
      id: "ch04-7",
      title: "4.8 Iki nesneli fiiller",
      blocks: [
        {
          type: "table",
          headers: ["Fiil", "Ornek (Dat + Akk)"],
          rows: [
            ["geben", "Ich gebe dem Kind den Ball."],
            ["zeigen", "Zeig mir das Foto!"],
            ["schicken", "Sie schickt mir eine E-Mail."],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "Iki isim → Dativ once. Zamir varsa → Akkusativ once. Iki zamir → Akk + Dat.",
        },
      ],
    },
  ],
};
