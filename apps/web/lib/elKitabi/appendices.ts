import type { ElKitabiAppendix } from "./types";

const IRREGULAR_VERBS: string[][] = [
  ["gehen", "geht", "ging", "gegangen", "gitmek"],
  ["kommen", "kommt", "kam", "gekommen", "gelmek"],
  ["sehen", "sieht", "sah", "gesehen", "gormek"],
  ["sprechen", "spricht", "sprach", "gesprochen", "konusmak"],
  ["essen", "isst", "ass", "gegessen", "yemek"],
  ["fahren", "fahrt", "fuhr", "gefahren", "gitmek"],
  ["geben", "gibt", "gab", "gegeben", "vermek"],
  ["nehmen", "nimmt", "nahm", "genommen", "almak"],
  ["schreiben", "schreibt", "schrieb", "geschrieben", "yazmak"],
  ["lesen", "liest", "las", "gelesen", "okumak"],
  ["finden", "findet", "fand", "gefunden", "bulmak"],
  ["sein", "ist", "war", "gewesen", "olmak"],
  ["haben", "hat", "hatte", "gehabt", "sahip olmak"],
  ["werden", "wird", "wurde", "geworden", "olmak"],
  ["konnen", "kann", "konnte", "gekonnt", "ebilmek"],
  ["mussen", "muss", "musste", "gemusst", "zorunda"],
  ["wollen", "will", "wollte", "gewollt", "istemek"],
  ["durfen", "darf", "durfte", "gedurft", "izin"],
  ["mogen", "mag", "mochte", "gemocht", "sevmek"],
  ["verstehen", "versteht", "verstand", "verstanden", "anlamak"],
  ["anrufen", "ruft an", "rief an", "angerufen", "telefon"],
  ["aufstehen", "steht auf", "stand auf", "aufgestanden", "kalkmak"],
  ["einladen", "ladt ein", "lud ein", "eingeladen", "davet"],
  ["empfehlen", "empfiehlt", "empfahl", "empfohlen", "tavsiye"],
  ["vergessen", "vergisst", "vergass", "vergessen", "unutmak"],
  ["trinken", "trinkt", "trank", "getrunken", "icmek"],
  ["schlafen", "schlaft", "schlief", "geschlafen", "uyumak"],
  ["bleiben", "bleibt", "blieb", "geblieben", "kalmak"],
  ["bringen", "bringt", "brachte", "gebracht", "getirmek"],
  ["helfen", "hilft", "half", "geholfen", "yardim"],
];

const REGULAR_VERBS: string[][] = [
  ["machen", "yapmak", "sagen", "soylemek", "fragen", "sormak"],
  ["spielen", "oynamak", "lernen", "ogrenmek", "arbeiten", "calismak"],
  ["wohnen", "oturmak", "kaufen", "satin almak", "brauchen", "ihtiyac"],
  ["horen", "duymak", "leben", "yasamak", "kochen", "pisirmek"],
  ["offnen", "acmak", "bezahlen", "odemek", "studieren", "okumak"],
];

export const EL_KITABI_APPENDICES: ElKitabiAppendix[] = [
  {
    id: "ek-a",
    title: "Ek A — Duzensiz Fiiller Tablosu",
    blocks: [
      {
        type: "p",
        text: "Uc temel hal: Infinitiv — Prateritum — Partizip II. (ist) = Perfekt sein ile kurulur.",
      },
      {
        type: "table",
        headers: ["Infinitiv", "er/sie/es", "Prateritum", "Partizip II", "Turkce"],
        rows: IRREGULAR_VERBS,
      },
      {
        type: "callout",
        kind: "ipucu",
        text: "Ayni ses degisimini paylasan fiilleri grup olarak calis: trinken-trank-getrunken.",
      },
    ],
  },
  {
    id: "ek-b",
    title: "Ek B — Dativ ve Iki Nesneli Fiiller",
    blocks: [
      {
        type: "h3",
        text: "Sadece Dativ",
      },
      {
        type: "p",
        text: "antworten, danken, gefallen, gehoren, glauben, gratulieren, helfen, passen, schmecken, folgen, begegnen, zuhoren, fehlen, schaden, vertrauen.",
      },
      {
        type: "h3",
        text: "Dativ + Akkusativ",
      },
      {
        type: "p",
        text: "geben, schenken, zeigen, schicken, bringen, erklaren, empfehlen, leihen, kaufen, sagen, anbieten, erzahlen, wunschen, erlauben.",
      },
      {
        type: "callout",
        kind: "ipucu",
        text: "Iki isim → Dativ once. Zamir → Akk once. Iki zamir → Akk + Dat.",
      },
    ],
  },
  {
    id: "ek-c",
    title: "Ek C — Sik Kullanilan Duzenli Fiiller",
    blocks: [
      {
        type: "table",
        headers: ["Fiil", "Turkce", "Fiil", "Turkce", "Fiil", "Turkce"],
        rows: REGULAR_VERBS,
      },
      {
        type: "callout",
        kind: "dikkat",
        text: "-ieren fiilleri ge- almaz: studiert, telefoniert.",
      },
    ],
  },
  {
    id: "ek-d",
    title: "Ek D — Pratik Kaynaklar",
    blocks: [
      {
        type: "table",
        headers: ["Kaynak", "Ne icin"],
        rows: [
          ["Goethe-Institut Deutsch uben", "Seviye alistirmalari ve ornek sinavlar"],
          ["Deutsche Welle — Nicos Weg", "A1-B1 video dizisi"],
          ["DWDS / Verbformen.de", "Fiil cekimi sozlugu"],
          ["Lingolia Deutsch", "Konu anlatimi ve alistirma"],
          ["telc / OSD ornek sinavlar", "Sinav formatina alisma"],
        ],
      },
      {
        type: "callout",
        kind: "ipucu",
        text: "Her gun 3 cumle yaz ve bir duzensiz fiili uc haliyle sesli tekrarla.",
      },
    ],
  },
  {
    id: "ek-e",
    title: "Ek E — German Coach Modul-Konu Haritasi",
    blocks: [
      {
        type: "table",
        headers: ["Konu", "German Coach", "Rehber"],
        rows: [
          ["Alfabe, sayilar", "/grundlagen/zahlen", "Bolum 1"],
          ["Fiil cekimi, zamirler", "/grundlagen/conjugation", "Bolum 2.1-2.3"],
          ["Artikel", "/grundlagen/artikel", "Bolum 3"],
          ["Cumle dizilimi, modal", "/grundlagen/word-order", "Bolum 2.4, 2.6"],
          ["Kasus", "/grundlagen/dativ", "Bolum 4"],
          ["Edatlar", "/grundlagen/prepositions", "Bolum 6"],
          ["Kelime", "/cards", "Bolum 10"],
          ["Yazma / Konusma", "/exam", "Bolum 11"],
          ["Gramer yol haritasi", "/grundlagen/roadmap", "Tum bolumler"],
        ],
      },
      {
        type: "link",
        label: "Ogrenme haritasi",
        href: "/harita",
      },
    ],
  },
];
