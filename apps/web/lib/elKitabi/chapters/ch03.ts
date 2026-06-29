import type { ElKitabiChapter } from "../types";

export const CH03: ElKitabiChapter = {
  id: "bolum-3",
  number: 3,
  title: "Isim, Artikel ve Cogul",
  practiceHref: "/grundlagen/artikel",
  practiceLabel: "Artikel trainerini ac",
  subsections: [
    {
      id: "ch03-1",
      title: "3.1 Artikel trikleri",
      blocks: [
        {
          type: "p",
          text: "Bir ismi asla yalniz degil, artikeliyle ezberle. Tisch degil, der Tisch.",
        },
        {
          type: "h3",
          text: "DER (eril) ipuclari",
        },
        {
          type: "list",
          items: [
            "Erkek kisiler: der Mann, der Vater",
            "-er, -ling, -ismus: der Computer, der Fruhling",
            "Gunler, aylar: der Montag, der Sommer",
          ],
        },
        {
          type: "h3",
          text: "DIE (disil) ipuclari",
        },
        {
          type: "list",
          items: [
            "-ung, -heit, -keit, -schaft, -tion: die Zeitung, die Freiheit",
            "-e ile bitenlerin cogu: die Lampe, die Blume",
          ],
        },
        {
          type: "h3",
          text: "DAS (notr) ipuclari",
        },
        {
          type: "list",
          items: [
            "-chen, -lein: das Madchen, das Brotchen",
            "Mastardan yapilan isimler: das Essen, das Leben",
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "-ung, -heit, -keit → her zaman DIE. -chen, -lein → her zaman DAS (das Madchen!).",
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "Birlesik isimlerde artikel son kelimeden gelir: das Haus + die Tur → die Haustur.",
        },
      ],
    },
    {
      id: "ch03-2",
      title: "3.2 Artikel turleri",
      blocks: [
        {
          type: "table",
          headers: ["Tur", "der", "die", "das", "cogul"],
          rows: [
            ["Belirli", "der", "die", "das", "die"],
            ["Belirsiz", "ein", "eine", "ein", "—"],
            ["Olumsuz", "kein", "keine", "kein", "keine"],
            ["Iyelik", "mein", "meine", "mein", "meine"],
          ],
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "Meslek/uyruk: Ich bin Lehrer. Somut nesne: Ich habe ein Auto.",
        },
        {
          type: "link",
          label: "Artikel drill",
          href: "/grundlagen/artikel",
        },
      ],
    },
    {
      id: "ch03-3",
      title: "3.3 Cogul (Plural)",
      blocks: [
        {
          type: "table",
          headers: ["Tip", "Ek", "Ornek"],
          rows: [
            ["1", "-e", "der Tisch → die Tische"],
            ["2", "-(e)n", "die Frau → die Frauen"],
            ["3", "-er", "das Kind → die Kinder"],
            ["4", "-s", "das Auto → die Autos"],
            ["5", "ek yok", "der Lehrer → die Lehrer"],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "Tum cogullarda artikel DIE olur — cinsiyet cogulda kaybolur.",
        },
      ],
    },
    {
      id: "ch03-4",
      title: "3.4-3.5 Iyelik",
      blocks: [
        {
          type: "callout",
          kind: "ipucu",
          text: "Yeni kelimeyi artikel + kelime + cogul ile yaz: der Tisch, -e.",
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "sein mi ihr mi? Sahip erkekse sein, kadinsa ihr: Peters Auto → sein Auto.",
        },
        {
          type: "link",
          label: "Iyelik modulu",
          href: "/grundlagen/possessives",
        },
      ],
    },
  ],
};
