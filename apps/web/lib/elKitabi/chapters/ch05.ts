import type { ElKitabiChapter } from "../types";

export const CH05: ElKitabiChapter = {
  id: "bolum-5",
  number: 5,
  title: "Zamanlar (Tempora)",
  practiceHref: "/grundlagen/conjugation",
  practiceLabel: "Fiil ve zaman modulu",
  subsections: [
    {
      id: "ch05-1",
      title: "5.1 Prasens",
      blocks: [
        {
          type: "p",
          text: "ich lerne hem ogreniyorum hem ogrenirim demektir. Gelecek icin de kullanilir.",
        },
        {
          type: "callout",
          kind: "ornek",
          text: "Morgen fahre ich nach Berlin. = Yarin Berlin'e gidecegim.",
          de: "Morgen fahre ich nach Berlin.",
        },
      ],
    },
    {
      id: "ch05-2",
      title: "5.2 Perfekt — Partizip II",
      blocks: [
        {
          type: "p",
          text: "haben/sein (2. poz.) + Partizip II (sonda). Gunluk gecmis anlatimin standart yolu.",
        },
        {
          type: "table",
          headers: ["Tur", "Kural", "Ornek"],
          rows: [
            ["Duzenli", "ge- + kok + -t", "gemacht"],
            ["Duzensiz", "ge- + kok + -en", "gegangen"],
            ["-ieren", "ge- yok", "studiert"],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "A noktasindan B'ye gittim mi veya halim degisti mi? → sein. Geri kalan → haben.",
        },
      ],
    },
    {
      id: "ch05-3",
      title: "5.3 Prafixverben",
      blocks: [
        {
          type: "table",
          headers: ["", "Trennbar (aufstehen)", "Untrennbar (verstehen)"],
          rows: [
            ["Prasens", "Ich stehe um 7 Uhr auf.", "Ich verstehe dich."],
            ["Perfekt", "Ich bin aufgestanden.", "Ich habe verstanden."],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "Ayrilan fiil ge'yi ortada saklar; ayrilmaz fiil ge'yi hic almaz.",
        },
      ],
    },
    {
      id: "ch05-4",
      title: "5.4 Prateritum",
      blocks: [
        {
          type: "table",
          headers: ["", "sein", "haben", "konnen", "machen"],
          rows: [
            ["ich", "war", "hatte", "konnte", "machte"],
            ["er/sie/es", "war", "hatte", "konnte", "machte"],
            ["wir", "waren", "hatten", "konnten", "machten"],
          ],
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "Gunluk konusmada gecmis icin Perfekt; ama war, hatte, konnte icin Prateritum daha dogal.",
        },
      ],
    },
    {
      id: "ch05-5",
      title: "5.5-5.6 Plusquamperfekt ve Futur",
      blocks: [
        {
          type: "callout",
          kind: "ornek",
          text: "Nachdem ich gegessen hatte, ging ich ins Bett.",
          de: "Nachdem ich gegessen hatte, ging ich ins Bett.",
        },
        {
          type: "p",
          text: "Futur I: werden + mastar. Konusmada genelde Prasens + zaman zarfi yeter.",
        },
        {
          type: "callout",
          kind: "ipucu",
          text: "werden: (1) olmak, (2) gelecek yardimcisi, (3) edilgen yardimcisi (B1+).",
        },
      ],
    },
    {
      id: "ch05-6",
      title: "5.7 Imperativ",
      blocks: [
        {
          type: "table",
          headers: ["Muhatap", "Yapi", "Ornek"],
          rows: [
            ["du", "kok, zamir duser", "Komm!"],
            ["ihr", "ihr cekimi", "Kommt!"],
            ["Sie", "mastar + Sie", "Kommen Sie!"],
          ],
        },
        {
          type: "callout",
          kind: "dikkat",
          text: "geben → Gib!, nehmen → Nimm! sein: Sei ruhig!",
        },
      ],
    },
  ],
};
