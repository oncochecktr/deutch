import type { ElKitabiChapter } from "../types";

export const CH02: ElKitabiChapter = {
  id: "bolum-2",
  number: 2,
  title: "Fiil, Cumle Dizilimi ve Modalverben",
  practiceHref: "/grundlagen/conjugation",
  practiceLabel: "Fiil cekimi modulunu ac",
  subsections: [
    {
      id: "ch02-1",
      title: "2.1 Sahis zamirleri (Nominativ)",
      blocks: [
        {
          type: "table",
          headers: ["Tekil", "Turkce", "Cogul", "Turkce"],
          rows: [
            ["ich", "ben", "wir", "biz"],
            ["du", "sen", "ihr", "siz (samimi)"],
            ["er / sie / es", "o", "sie", "onlar"],
            ["Sie", "siz (resmi)", "", ""],
          ],
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "Uc farkli sie: sie ist (o), sie sind (onlar), Sie sind (siz-resmi). Karistirmamak icin fiile bak.",
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "Suphedeysen Sie ile basla; karsi taraf Wir konnen uns duzen derse du'ya gec.",
        },
      ],
    },
    {
      id: "ch02-2",
      title: "2.2 Fiil cekimi — Prasens",
      blocks: [
        {
          type: "table",
          headers: ["Sahis", "Ek", "lernen", "wohnen"],
          rows: [
            ["ich", "-e", "lerne", "wohne"],
            ["du", "-st", "lernst", "wohnst"],
            ["er/sie/es", "-t", "lernt", "wohnt"],
            ["wir/sie/Sie", "-en", "lernen", "wohnen"],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "wir = sie = Sie = her zaman mastarin aynisi (-en).",
        },
        {
          type: "table",
          headers: ["Sahis", "sein", "haben", "werden"],
          rows: [
            ["ich", "bin", "habe", "werde"],
            ["du", "bist", "hast", "wirst"],
            ["er/sie/es", "ist", "hat", "wird"],
            ["wir", "sind", "haben", "werden"],
          ],
        },
      ],
    },
    {
      id: "ch02-3",
      title: "2.3 Duzenli ve duzensiz fiiller",
      blocks: [
        {
          type: "table",
          headers: ["Degisim", "Fiil", "du", "er/sie/es"],
          rows: [
            ["e → i", "sprechen", "sprichst", "spricht"],
            ["e → i", "essen", "isst", "isst"],
            ["e → ie", "sehen", "siehst", "sieht"],
            ["a → a", "fahren", "fahrst", "fahrt"],
          ],
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "Kok degisimi yalnizca du ve er/sie/es'te olur.",
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "Uc temel hal: Infinitiv — Prateritum — Partizip II. Tam liste Ek A'da.",
        },
      ],
    },
    {
      id: "ch02-4",
      title: "2.4 Cumle dizilimi (V2)",
      blocks: [
        {
          type: "p",
          text: "Duz cumlede cekimli fiil her zaman 2. pozisyonda (Verbzweit).",
        },
        {
          type: "table",
          headers: ["Poz 1", "Poz 2 (fiil)", "Orta", "Son"],
          rows: [
            ["Ich", "lerne", "heute", "Deutsch."],
            ["Heute", "lerne", "ich", "Deutsch."],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "Fiil ikinci, ozne kaygan. TeKaMoLo: Temporal → Kausal → Modal → Lokal.",
        },
        {
          type: "link",
          label: "Kelime sirasi trainer",
          href: "/grundlagen/word-order",
        },
      ],
    },
    {
      id: "ch02-5",
      title: "2.5 Olumsuzluk: nicht ve kein",
      blocks: [
        {
          type: "table",
          headers: ["Olumlu", "Olumsuz", "Kural"],
          rows: [
            ["Ich habe ein Auto.", "Ich habe kein Auto.", "belirsiz → kein"],
            ["Ich komme heute.", "Ich komme heute nicht.", "fiil → nicht"],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "Bir / hic diyebiliyorsan → kein. Geri kalan → nicht.",
        },
        {
          type: "link",
          label: "Olumsuzluk modulu",
          href: "/grundlagen/negation",
        },
      ],
    },
    {
      id: "ch02-6",
      title: "2.6 Modal fiiller",
      blocks: [
        {
          type: "table",
          headers: ["", "konnen", "mussen", "wollen", "durfen", "mogen"],
          rows: [
            ["ich", "kann", "muss", "will", "darf", "mag"],
            ["du", "kannst", "musst", "willst", "darfst", "magst"],
            ["er/sie/es", "kann", "muss", "will", "darf", "mag"],
          ],
        },
        {
          type: "callout",
          kind: "ornek",
          text: "Ich kann heute nicht kommen. = Bugun gelemem.",
          de: "Ich kann heute nicht kommen.",
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "mochte = kibar istek. Restoranda wollen yerine mochte kullan.",
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "mussen olumsuzu zorunda degil demektir. Yasak icin nicht durfen: Du darfst nicht rauchen.",
        },
      ],
    },
  ],
};
