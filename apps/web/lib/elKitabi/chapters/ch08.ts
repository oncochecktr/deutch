import type { ElKitabiChapter } from "../types";

export const CH08: ElKitabiChapter = {
  id: "bolum-8",
  number: 8,
  title: "Sifatlar ve Zarflar",
  practiceHref: "/cards",
  practiceLabel: "Kelime kartlari",
  subsections: [
    {
      id: "ch08-1",
      title: "8.1 Sifat cekimi (Adjektivdeklination)",
      blocks: [
        {
          type: "p",
          text: "Sifat isimden once gelince cekilir. Yuklemde cekilmez: Das Auto ist neu.",
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "der'in isaretini biri tasimak zorunda. Artikel cinsiyeti gosteriyorsa sifat -e/-en alir.",
        },
        {
          type: "table",
          headers: ["", "eril Nom", "disil Nom", "notr Nom"],
          rows: [
            ["Belirli artikel", "der gute Mann", "die gute Frau", "das gute Kind"],
            ["Belirsiz", "ein guter Mann", "eine gute Frau", "ein gutes Kind"],
          ],
        },
      ],
    },
    {
      id: "ch08-2",
      title: "8.2 Komparativ ve Superlativ",
      blocks: [
        {
          type: "table",
          headers: ["Derece", "Yapi", "Ornek"],
          rows: [
            ["Olumlu", "sifat", "schnell"],
            ["Komparativ", "-er", "schneller"],
            ["Superlativ", "am -sten", "am schnellsten"],
          ],
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "Duzensiz: gut → besser → am besten; viel → mehr → am meisten.",
        },
      ],
    },
    {
      id: "ch08-3",
      title: "8.3-8.4 Zarflar ve zit ciftler",
      blocks: [
        {
          type: "callout",
          kind: "ipucu",
          text: "Siklik merdiveni: immer > meistens > oft > manchmal > selten > nie.",
        },
        {
          type: "table",
          headers: ["Almanca", "Turkce", "Almanca", "Turkce"],
          rows: [
            ["gross / klein", "buyuk / kucuk", "gut / schlecht", "iyi / kotu"],
            ["schnell / langsam", "hizli / yavas", "warm / kalt", "sicak / soguk"],
            ["billig / teuer", "ucuz / pahali", "hell / dunkel", "aydinlik / karanlik"],
          ],
        },
      ],
    },
  ],
};
