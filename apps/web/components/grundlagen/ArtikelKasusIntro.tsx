"use client";

import {
  TrainerLessonIntro,
  TrainerLessonRulesTable,
} from "@/components/grundlagen/TrainerLessonIntro";

const CASE_TABLE = [
  { label: "Nominativ (yalın)", tr: "der · die · das — özne: Der Mann kommt." },
  { label: "Akkusativ (belirtme)", tr: "den · die · das — nesne: Ich sehe den Mann." },
  { label: "Dativ (yönelme)", tr: "dem · der · dem — mit/bei/in/zu: Ich helfe dem Mann." },
  { label: "Genitiv (tamlayan)", tr: "des · der · des — A2'de; A1'de nadiren" },
];

const NOM_DAT_DEF = [
  { label: "der Mann", tr: "Nominativ → dem Mann (Dativ)" },
  { label: "die Frau", tr: "Nominativ → der Frau (Dativ)" },
  { label: "das Kind", tr: "Nominativ → dem Kind (Dativ)" },
];

const NOM_DAT_INDEF = [
  { label: "ein Mann", tr: "Nominativ → einem Mann (Dativ)" },
  { label: "eine Frau", tr: "Nominativ → einer Frau (Dativ)" },
  { label: "ein Kind", tr: "Nominativ → einem Kind (Dativ)" },
];

const CONTRACTIONS = [
  { label: "in + dem = im", tr: "im Haus (evde / evin içinde)" },
  { label: "an + dem = am", tr: "am Montag (Pazartesi'de)" },
  { label: "zu + dem = zum", tr: "zum Arzt (doktora)" },
  { label: "zu + der = zur", tr: "zur Arbeit (işe)" },
  { label: "bei + dem = beim", tr: "beim Arzt (doktorda)" },
];

export function ArtikelKasusIntro() {
  return (
    <TrainerLessonIntro
      badge="Temel mantık"
      title="Artikel göreve göre değişir"
      summary="Artikeller birbirine karışmaz. İsim aynı kalır; cümledeki görev (Nominativ, Akkusativ, Dativ …) değişince artikel de şekil alır — tıpkı kıyafet değiştirmek gibi."
      sections={[
        {
          id: "not-random",
          title: "Şunu düşünme",
          body: '"Der artık dem oldu" değil. der Mann → Dativ olunca dem Mann. İsim hâlâ Mann; sadece cümledeki rolü değişti.',
          variant: "callout",
        },
        {
          id: "mann-frau-kind",
          title: "Belirli artikel: Mann · Frau · Kind",
          body: "A1'de önce der Mann, die Frau, das Kind (Nominativ) öğrenilir. Dativ gelince: dem Mann, der Frau, dem Kind.",
        },
        {
          id: "ein-eine",
          title: "Belirsiz artikel",
          body: "Aynı mantık: ein Mann → einem Mann, eine Frau → einer Frau, ein Kind → einem Kind.",
        },
        {
          id: "contractions",
          title: "Birleşmeler (im, am, zum …)",
          body: "Almancada edat + artikel sık birleşir: in dem Haus yerine im Haus, zu dem Arzt yerine zum Arzt derler. Aşağıdaki tabloya bak.",
        },
      ]}
    >
      <TrainerLessonRulesTable title="4 hal — belirli artikel (der / die / das)" rules={CASE_TABLE} />
      <TrainerLessonRulesTable title="Nominativ → Dativ (belirli)" rules={NOM_DAT_DEF} />
      <TrainerLessonRulesTable title="Nominativ → Dativ (belirsiz)" rules={NOM_DAT_INDEF} />
      <TrainerLessonRulesTable title="Edat birleşmeleri" rules={CONTRACTIONS} />
    </TrainerLessonIntro>
  );
}
