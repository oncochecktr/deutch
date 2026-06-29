import type { ElKitabiChapter } from "../types";

export const CH01: ElKitabiChapter = {
  id: "bolum-1",
  number: 1,
  title: "Alfabe, Telaffuz ve Sayilar",
  practiceHref: "/grundlagen/zahlen",
  practiceLabel: "Sayilar modulunu ac",
  subsections: [
    {
      id: "ch01-1",
      title: "1.1 Alfabe (Das Alphabet)",
      blocks: [
        {
          type: "link",
          label: "Sayilar ve zaman modulleri",
          href: "/grundlagen/zahlen",
          note: "Alfabe ve sayilar icin uygulamada pratik yap.",
        },
        {
          type: "p",
          text: "Almanca alfabe 26 harf + 3 umlaut (a, o, u) + ozel harf (ss) icerir. Turkceden en onemli farklar telaffuzdadir.",
        },
        {
          type: "table",
          headers: ["Harf", "Okunusu", "Harf", "Okunusu", "Harf", "Okunusu"],
          rows: [
            ["A", "aa", "J", "yot", "S", "es"],
            ["B", "be", "K", "ka", "T", "te"],
            ["E", "ee", "R", "er", "Z", "tset"],
          ],
        },
        {
          type: "p",
          text: "Ozel harfler: a (e/a arasi), o (Turkce o), u (Turkce u), ss = sert s (Strasse = sokak).",
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "Ismini hecelerken Almanlar Doppel der: Anna yerine A - Doppel-N - A. Telefonda ve sinavda ise yarar.",
        },
      ],
    },
    {
      id: "ch01-2",
      title: "1.2 Telaffuz kurallari (Aussprache)",
      blocks: [
        {
          type: "table",
          headers: ["Yazilis", "Ses", "Ornek"],
          rows: [
            ["ei", "ay", "mein (mayn)"],
            ["ie", "uzun ii", "Liebe (liibe)"],
            ["eu / au", "oy", "heute; Hauser"],
            ["ch (a/o/u sonrasi)", "girtlaktan h", "Buch"],
            ["ch (e/i sonrasi)", "yumusak s/h", "ich"],
            ["sch", "s", "Schule"],
            ["sp- / st-", "sp / st", "Sport; Stadt"],
            ["v", "f", "Vater"],
            ["w", "v", "Wasser"],
            ["z", "ts", "Zeit"],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "V f, W v, Z ts — Volkswagen = Folks-Vaagen. Bu tek kelime ucunu birden hatirlatir.",
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "Almancada tum isimler buyuk harfle baslar: der Tisch, die Katze. Yazim kuralidir.",
        },
      ],
    },
    {
      id: "ch01-3",
      title: "1.3 Sayilar (Die Zahlen)",
      blocks: [
        {
          type: "link",
          label: "Zahlen trainer",
          href: "/grundlagen/zahlen",
        },
        {
          type: "table",
          headers: ["0-10", "", "11-20", "", "Onluklar", ""],
          rows: [
            ["0 null", "1 eins", "11 elf", "12 zwolf", "10 zehn", "20 zwanzig"],
            ["2 zwei", "3 drei", "13 dreizehn", "14 vierzehn", "30 dreissig", "100 hundert"],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "Iki haneli sayilar tersten okunur: 21 = einundzwanzig (bir-ve-yirmi). Turkcedeki yirmi bir sirasinin tersi.",
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "16 ve 17'de kok kisalir: sechzehn, siebzehn. Onluklarda: sechzig, siebzig.",
        },
        {
          type: "h3",
          text: "Saat (Die Uhrzeit)",
        },
        {
          type: "list",
          items: [
            "Resmi: Es ist 14:30 Uhr — vierzehn Uhr dreissig.",
            "halb on = 9:30 (onun yarisi — Turkcedeki uc bucuk mantigiyla karistirma).",
            "Viertel nach = ceyrek gec; Viertel vor = ceyrek var.",
          ],
        },
        {
          type: "link",
          label: "Zaman ve tarih",
          href: "/grundlagen/zeit",
        },
      ],
    },
  ],
};
