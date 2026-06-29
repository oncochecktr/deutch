import type { ElKitabiChapter } from "../types";

export const CH10: ElKitabiChapter = {
  id: "bolum-10",
  number: 10,
  title: "Tematik Kelime Hazinesi",
  practiceHref: "/cards",
  practiceLabel: "Kelime kartlarini ac",
  subsections: [
    {
      id: "ch10-1",
      title: "10.1 Aile ve Kisiler",
      blocks: [
        {
          type: "table",
          headers: ["Almanca", "Cogul", "Turkce"],
          rows: [
            ["r Vater", "Vater", "baba"],
            ["e Mutter", "Mutter", "anne"],
            ["r Bruder", "Bruder", "erkek kardes"],
            ["e Schwester", "-n", "kiz kardes"],
            ["s Kind", "-er", "cocuk"],
          ],
        },
      ],
    },
    {
      id: "ch10-2",
      title: "10.2 Vucut ve Saglik",
      blocks: [
        {
          type: "table",
          headers: ["Almanca", "Turkce", "Almanca", "Turkce"],
          rows: [
            ["r Kopf", "bas", "s Auge", "goz"],
            ["e Hand", "el", "r Fuss", "ayak"],
            ["r Arzt", "doktor", "e Krankheit", "hastalik"],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "Kopfschmerzen, Bauchschmerzen — vucut + -schmerzen.",
        },
      ],
    },
    {
      id: "ch10-3",
      title: "10.3 Yeme ve Iceme",
      blocks: [
        {
          type: "table",
          headers: ["Almanca", "Turkce", "Almanca", "Turkce"],
          rows: [
            ["s Brot", "ekmek", "r Kaffee", "kahve"],
            ["s Wasser", "su", "r Apfel", "elma"],
            ["s Gemuse", "sebze", "s Obst", "meyve"],
          ],
        },
      ],
    },
    {
      id: "ch10-4",
      title: "10.4-10.5 Alisveris ve Ev",
      blocks: [
        {
          type: "table",
          headers: ["Almanca", "Turkce", "Almanca", "Turkce"],
          rows: [
            ["r Supermarkt", "supermarket", "s Haus", "ev"],
            ["r Preis", "fiyat", "e Wohnung", "daire"],
            ["r Tisch", "masa", "s Bett", "yatak"],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "Was kostet das? / Das macht 5 Euro.",
        },
      ],
    },
    {
      id: "ch10-5",
      title: "10.6-10.8 Sehir, Is, Giysi",
      blocks: [
        {
          type: "table",
          headers: ["Almanca", "Turkce", "Almanca", "Turkce"],
          rows: [
            ["e Stadt", "sehir", "r Bahnhof", "tren gari"],
            ["s Auto", "araba", "e Arbeit", "is"],
            ["e Hose", "pantolon", "r Schuh", "ayakkabi"],
          ],
        },
        {
          type: "link",
          label: "Kelime listesi",
          href: "/words",
        },
      ],
    },
    {
      id: "ch10-6",
      title: "10.9-10.10 Hava ve Zaman",
      blocks: [
        {
          type: "callout",
          kind: "ipucu",
          text: "Es regnet / Es schneit. im Sommer, am Montag, um 8 Uhr.",
        },
        {
          type: "link",
          label: "Zaman modulu",
          href: "/grundlagen/zeit",
        },
      ],
    },
  ],
};
