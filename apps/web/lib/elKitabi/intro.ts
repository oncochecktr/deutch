import type { ElKitabiIntro } from "./types";

export const EL_KITABI_INTRO: ElKitabiIntro = {
  title: "Kullanim Kilavuzu",
  blocks: [
    {
      type: "p",
      text: "Bu rehber, German Coach uygulamasindaki A1, A2 ve B1 seviyelerinin tum dilbilgisi konularini, sirasini ve sinav becerilerini tek bir basvuru kaynaginda toplar. Amaci bir ders kitabinin yerini almak degil; uygulamada ogrendigin her konuyu hizlica bulup tekrar edebilecegin, yaninda tasidigin bir harita olmaktir.",
    },
    {
      type: "h3",
      text: "Bu rehber nasil kurgulandi?",
    },
    {
      type: "p",
      text: "Konu sirasi German Coach akisini takip eder. Once temel taslar (fiil, isim, artikel), sonra Almancanin kalbi olan hal sistemi (Kasus), ardindan zamanlar, edatlar, donuslu fiiller, sifatlar, baglaclar; en sonda kelime hazinesi, yazma-konusma becerileri ve listeler (Ekler) gelir.",
    },
    {
      type: "list",
      items: [
        "Almanca kural — yapinin kendisi, tablolarla.",
        "Turkce aciklama — kuralin Turkce mantigi; Turk ogrencinin nerede zorlandigi.",
        "Kullanim — gercek cumlelerle ornekler, sik yapilan hatalar ve puf noktalari.",
      ],
    },
    {
      type: "h3",
      text: "Sayfadaki isaretler",
    },
    {
      type: "list",
      items: [
        "Ipucu: Ezberi azaltan, mantigi yakalatan puf noktasi.",
        "Dikkat: Turk ogrencilerin en sik yaptigi hata.",
        "Ornek: Kuralin gercek bir cumlede nasil yasadigini gosterir.",
        "German Coach'ta: Konunun uygulamadaki hangi modulle eslestigini soyler.",
      ],
    },
    {
      type: "p",
      text: "Tablolarda artikeller kisaltmayla verilir: r = der (eril), e = die (disil), s = das (notr), pl = cogul.",
    },
    {
      type: "h3",
      text: "En verimli kullanim",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Modul oncesi / sonrasi: Ilgili bolumu oku, calistiktan sonra tablolari tekrar et.",
        "Takildigin an: Icindekilerden konuyu bul, sadece o kutuyu oku.",
        "Sinav oncesi: Bolum 11 (Yazma ve Konusma) ve Ekler'deki fiil/edat listeleri hizli tekrar sayfalaridir.",
        "Listeleri biriktir: Ek A ve Ek B ezberlenecek degil, defalarca donulecek listelerdir. Her hafta 10 fiil hedefle.",
      ],
    },
    {
      type: "callout",
      kind: "ipucu",
      text: "Almanca mantik dilidir. Ezber degil, sistemi gor. Bu rehber o sistemi sana en kisa yoldan gostermek icin yazildi.",
    },
  ],
  rhythmTable: [
    {
      stage: "A1 basi",
      focus: "Bolum 1 Alfabe/Telaffuz, Bolum 2 Fiil ve Cumle, Bolum 3 Isim ve Artikel",
      goal: "Kendini tanitma, basit cumle",
    },
    {
      stage: "A1 sonu",
      focus: "Bolum 4 Kasus, Bolum 5.1-5.2 Prasens/Perfekt, Bolum 2.6 Modalverben",
      goal: "Gecmisten bahsetme",
    },
    {
      stage: "A2",
      focus: "Bolum 6 Edatlar, Bolum 7 Donuslu fiiller, Bolum 8 Sifatlar, Bolum 5.4 Prateritum",
      goal: "Gunluk hayati anlatma",
    },
    {
      stage: "B1",
      focus: "Bolum 9 Baglaclar ve yan cumleler, Bolum 5.5-5.6 Plusquam./Futur, Bolum 4.6 N-Deklination",
      goal: "Gorus bildirme, tartisma",
    },
  ],
};
