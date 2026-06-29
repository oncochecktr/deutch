import type { ElKitabiChapter } from "../types";

export const CH11: ElKitabiChapter = {
  id: "bolum-11",
  number: 11,
  title: "Yazma ve Konusma Becerileri",
  practiceHref: "/exam/schreiben",
  practiceLabel: "Yazma sinav modulu",
  subsections: [
    {
      id: "ch11-1",
      title: "11.1 E-Mail / Mektup",
      blocks: [
        {
          type: "table",
          headers: ["Resmi (Sie)", "Samimi (du)"],
          rows: [
            ["Sehr geehrte Frau …,", "Liebe …, / Hallo …,"],
            ["Mit freundlichen Grussen", "Liebe Grusse / Viele Grusse"],
          ],
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Anrede + giris",
            "Hauptteil — sorulari cevapla",
            "Schluss — rica/dilek",
            "Gruss + isim",
          ],
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "Hitaptan sonra virgul, sonraki satir kucuk harf (ozel isim haric).",
        },
        {
          type: "link",
          label: "Gercek sinav yazma rehberi",
          href: "/exam/schreiben/gercek",
        },
      ],
    },
    {
      id: "ch11-2",
      title: "11.2 Resim tasviri (Bildbeschreibung)",
      blocks: [
        {
          type: "table",
          headers: ["Adim", "Kalip"],
          rows: [
            ["Genel", "Auf dem Bild sieht man …"],
            ["Yer", "Im Vordergrund … / Im Hintergrund …"],
            ["Tahmin", "Ich glaube, dass … / Es konnte … sein."],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "links, rechts, neben, vor, hinter — konum edatlari puan kazandirir.",
        },
      ],
    },
    {
      id: "ch11-3",
      title: "11.3 Kisi ve mekan tasviri",
      blocks: [
        {
          type: "callout",
          kind: "ipucu",
          text: "Es gibt + Akkusativ: Es gibt einen Supermarkt.",
        },
        {
          type: "callout",
          kind: "ornek",
          text: "Mein bester Freund heisst Ali. Er ist gross und hat kurze, schwarze Haare.",
          de: "Mein bester Freund heisst Ali.",
        },
      ],
    },
    {
      id: "ch11-4",
      title: "11.4 Yol tarifi (Wegbeschreibung)",
      blocks: [
        {
          type: "table",
          headers: ["Islev", "Kalip"],
          rows: [
            ["Sorma", "Entschuldigung, wie komme ich zum Bahnhof?"],
            ["Duz git", "Gehen Sie geradeaus."],
            ["Don", "Biegen Sie nach links ab."],
            ["Konum", "Es ist auf der linken Seite."],
          ],
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "zu dem → zum, zu der → zur.",
        },
      ],
    },
    {
      id: "ch11-5",
      title: "11.5 Konusma kalıplari (Redemittel)",
      blocks: [
        {
          type: "table",
          headers: ["Islev", "Kalip"],
          rows: [
            ["Fikir", "Meiner Meinung nach …"],
            ["Katilma", "Da stimme ich dir zu."],
            ["Ornek", "Zum Beispiel …"],
            ["Sonuc", "Zusammenfassend …"],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "Meiner Meinung nach … , weil … . Zum Beispiel … . Deshalb finde ich, dass … .",
        },
        {
          type: "link",
          label: "Konusma sinavi",
          href: "/exam/sprechen",
        },
        {
          type: "link",
          label: "Konus-Dinle",
          href: "/konus-dinle",
        },
      ],
    },
  ],
};
