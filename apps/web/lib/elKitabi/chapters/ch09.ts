import type { ElKitabiChapter } from "../types";

export const CH09: ElKitabiChapter = {
  id: "bolum-9",
  number: 9,
  title: "Baglaclar ve Yan Cumleler",
  practiceHref: "/grundlagen/grammar-pack",
  practiceLabel: "Gramer paketi",
  subsections: [
    {
      id: "ch09-1",
      title: "9.1 Genel bakis — fiil nereye gider?",
      blocks: [
        {
          type: "table",
          headers: ["Grup", "Ornek", "Fiilin yeri"],
          rows: [
            ["Esgudumlu", "und, aber, oder", "normal V2"],
            ["Zarf-baglac", "deshalb, trotzdem", "baglac 1., fiil 2."],
            ["Alt-baglac", "weil, dass, wenn", "yan cumlede fiil EN SONA"],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "weil/dass/wenn gorursen fiili sona at. Yan cumle = fiil sonda.",
        },
      ],
    },
    {
      id: "ch09-2",
      title: "9.2 Esgudumlu baglaclar",
      blocks: [
        {
          type: "table",
          headers: ["Baglac", "Anlam", "Ornek"],
          rows: [
            ["und", "ve", "Ich lerne und ich arbeite."],
            ["aber", "ama", "Ich bin mude, aber ich komme."],
            ["denn", "cunku", "Ich bleibe, denn ich bin krank."],
            ["sondern", "aksine", "nicht rot, sondern blau"],
          ],
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "denn fiili yerinde tutar; weil fiili sona atar.",
        },
      ],
    },
    {
      id: "ch09-3",
      title: "9.3 Alt-baglaclar (Nebensatze)",
      blocks: [
        {
          type: "table",
          headers: ["Baglac", "Anlam", "Ornek"],
          rows: [
            ["weil", "cunku", "weil ich krank bin"],
            ["dass", "-digi", "dass du Recht hast"],
            ["wenn", "eger / -diginda", "Wenn es regnet, ..."],
            ["obwohl", "ragmen", "Obwohl es regnet, gehe ich raus."],
            ["bevor", "once", "Bevor ich gehe, esse ich."],
            ["nachdem", "sonra", "Nachdem ich gegessen hatte, ..."],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "als = gecmiste tek olay; wenn = tekrar eden veya simdi/gelecek.",
        },
      ],
    },
    {
      id: "ch09-4",
      title: "9.4 Iki parcali baglaclar",
      blocks: [
        {
          type: "table",
          headers: ["Baglac", "Anlam"],
          rows: [
            ["entweder … oder", "ya … ya da"],
            ["sowohl … als auch", "hem … hem de"],
            ["weder … noch", "ne … ne de"],
            ["je … desto", "ne kadar … o kadar"],
          ],
        },
      ],
    },
    {
      id: "ch09-5",
      title: "9.5 Relativsatze",
      blocks: [
        {
          type: "p",
          text: "Ilgi zamirinin cinsiyeti niteledigi isimden, hali yan cumledeki rolunden gelir.",
        },
        {
          type: "callout",
          kind: "ornek",
          text: "Der Mann, den ich kenne. Der Mann, dem ich helfe.",
          de: "Der Mann, den ich kenne.",
        },
      ],
    },
    {
      id: "ch09-6",
      title: "9.6-9.7 Infinitiv ve dolayli sorular",
      blocks: [
        {
          type: "callout",
          kind: "ornek",
          text: "Ich habe vor, nach Deutschland zu fahren.",
          de: "Ich habe vor, nach Deutschland zu fahren.",
        },
        {
          type: "list",
          items: [
            "um … zu = amac",
            "ohne … zu = -meden",
            "statt … zu = -ecek yerde",
            "ob = -ip -medigi; W-soru kelimesi + fiil sonda",
          ],
        },
      ],
    },
  ],
};
