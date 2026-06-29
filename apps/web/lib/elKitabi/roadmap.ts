import type { ElKitabiRoadmap } from "./types";

export const EL_KITABI_ROADMAP: ElKitabiRoadmap = {
  intro: [
    {
      type: "p",
      text: "German Coach'ta uc seviye, Avrupa Dil Cercevesi'nin (CEFR) A1, A2 ve B1 karsiligina gelir. Asagidaki harita her seviyede hangi dilbilgisi konularinin islendigini ve bu rehberin hangi bolumunun o konuyu karsiladigini gosterir.",
    },
  ],
  levels: [
    {
      id: "A1",
      title: "Temel kullanici: kendini ve cevreni anlatma",
      goal: "Kendini tanitmak, ailen/isin/yasadigin yer hakkinda konusmak, basit gecmis zamani (Perfekt) kullanmak.",
      rows: [
        {
          module: "Adim 1",
          topics: "Alfabe, sayilar, zamirler, fiil ve cekim",
          bookRef: "Bolum 1, 2.1-2.3",
          href: "/grundlagen/conjugation",
        },
        {
          module: "Adim 2",
          topics: "Isim, artikel",
          bookRef: "Bolum 3",
          href: "/grundlagen/artikel",
        },
        {
          module: "Adim 3",
          topics: "Cumle dizilimi, modal fiiller",
          bookRef: "Bolum 2.4, 2.6",
          href: "/grundlagen/word-order",
        },
        {
          module: "Adim 4",
          topics: "Kasus, Prafixverben, Perfekt",
          bookRef: "Bolum 4, 5.2-5.3",
          href: "/grundlagen/dativ",
        },
        {
          module: "Adim 5",
          topics: "Imperativ, Futur I",
          bookRef: "Bolum 5.6-5.7",
          href: "/grundlagen/grammar-pack",
          status: "reference-only",
        },
        {
          module: "Adim 6-8",
          topics: "Tema tekrari ve sinav hazirligi",
          bookRef: "Bolum 10, 11",
          href: "/exam",
        },
      ],
    },
    {
      id: "A2",
      title: "Gunluk hayatin dili",
      goal: "Alisveris, saglik, seyahat gibi gunluk durumlari anlatmak; basit yan cumleler kurmak.",
      rows: [
        {
          module: "Adim 1",
          topics: "Wechselprapositionen, e-posta yazimi",
          bookRef: "Bolum 6.3, 11.1",
          href: "/grundlagen/prepositions",
        },
        {
          module: "Adim 2",
          topics: "Akk/Dativ edatlar, sifat cekimi",
          bookRef: "Bolum 6.1-6.2, 8.1",
          href: "/grundlagen/prepositions",
          status: "reference-only",
        },
        {
          module: "Adim 3",
          topics: "Edatli fiiller",
          bookRef: "Bolum 6.5",
          status: "reference-only",
        },
        {
          module: "Adim 4",
          topics: "Donuslu fiiller",
          bookRef: "Bolum 7",
          status: "reference-only",
        },
        {
          module: "Adim 5",
          topics: "Kasus tekrari",
          bookRef: "Bolum 4",
          href: "/grundlagen/dativ",
        },
        {
          module: "Adim 6",
          topics: "Ergänzungssatze, dolayli sorular",
          bookRef: "Bolum 9.7",
          status: "reference-only",
        },
        {
          module: "Adim 7-8",
          topics: "N-Deklination, Genitiv, Prateritum, Relativsatze",
          bookRef: "Bolum 4.6, 4.5, 5.4, 9.5",
          status: "reference-only",
        },
      ],
    },
    {
      id: "B1",
      title: "Bagimsiz kullanici: gorus, tartisma, anlati",
      goal: "Bir konuda fikir belirtmek, gecmis-simdi-gelecek arasinda gecis yapmak, neden-sonuc baglaclarla uzun cumleler kurmak.",
      rows: [
        {
          module: "Adim 1",
          topics: "Kasus ve N-Deklination tekrari",
          bookRef: "Bolum 4",
          status: "reference-only",
        },
        {
          module: "Adim 2",
          topics: "Relativsatze, Infinitivsatze, Prateritum",
          bookRef: "Bolum 9.5-9.6, 5.4",
          status: "reference-only",
        },
        {
          module: "Adim 3",
          topics: "Futur I ve II, sifatlar",
          bookRef: "Bolum 5.6, 8",
          status: "reference-only",
        },
        {
          module: "Adim 4",
          topics: "Genitiv, Plusquamperfekt",
          bookRef: "Bolum 4.5, 5.5",
          status: "reference-only",
        },
        {
          module: "Adim 5",
          topics: "Konnektoren, Temporalsatze",
          bookRef: "Bolum 9",
          status: "reference-only",
        },
        {
          module: "Adim 6-8",
          topics: "Tema tekrari ve sinav hazirligi",
          bookRef: "Bolum 10, 11",
          href: "/exam",
        },
      ],
    },
  ],
  threeGates: [
    {
      title: "Cinsiyet ve artikel (der/die/das)",
      ref: "Bolum 3",
      text: "Her ismi artikeliyle ogrenmek, sonraki her seyi kolaylastirir.",
    },
    {
      title: "Hal sistemi (Kasus)",
      ref: "Bolum 4",
      text: "Nominativ-Akkusativ-Dativ-Genitiv. Edatlar, sifat cekimi ve fiil tamlamalari hep buna baglanir.",
    },
    {
      title: "Cumle dizilimi (fiilin yeri)",
      ref: "Bolum 2.4 ve 9",
      text: "Ana cumlede fiil ikinci, yan cumlede sonda. Bu uc kapiyi gectikten sonra geri kalan detaydir.",
    },
  ],
};
