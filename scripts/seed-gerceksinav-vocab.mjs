/**
 * gerceksinav.md (Extra · Sam aus Amerika) eksik kelimeleri A1/A2'ye ekler
 * node scripts/seed-gerceksinav-vocab.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const A1_PATH = join(__dir, "../data/a1/vocabulary.json");
const A2_PATH = join(__dir, "../data/a2/vocabulary.json");

const CATEGORY = "Extra · Sam aus Amerika";

function slug(s) {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildWord(id, level, entry) {
  const [word, article, plural, tr, ru, exDe, exTr, tags] = entry;
  const lv = level.toLowerCase();
  return {
    id: `${lv}_${String(id).padStart(4, "0")}`,
    level,
    category: CATEGORY,
    word,
    article: article ?? null,
    plural: plural ?? null,
    translation_tr: tr,
    translation_ru: ru,
    example_de: exDe,
    example_tr: exTr,
    audio_word: `/audio/${lv}/${slug(word)}.mp3`,
    audio_example: `/audio/${lv}/${slug(exDe)}.mp3`,
    tags: [...tags, lv, "extra"],
  };
}

/** [word, article, plural, tr, ru, example_de, example_tr, tags[]] */
const A1_WORDS = [
  ["gut", null, null, "iyi", "хороший", "Das Essen ist gut.", "Yemek iyi.", ["adjective", "daily"]],
  ["Geschichte", "die", "Geschichten", "hikaye", "история", "Das ist die Geschichte von Sascha und Anna.", "Bu Sascha ve Anna'nın hikayesi.", ["noun", "daily"]],
  ["Nachbar", "der", "Nachbarn", "komşu", "сосед", "Wir haben einen Nachbarn.", "Bir komşumuz var.", ["noun", "family"]],
  ["Freund", "der", "Freunde", "arkadaş", "друг", "Sam ist mein Freund.", "Sam benim arkadaşım.", ["noun", "family"]],
  ["Freundin", "die", "Freundinnen", "kız arkadaş", "подруга", "Anna ist meine Freundin.", "Anna benim kız arkadaşım.", ["noun", "family"]],
  ["Freunde", null, null, "arkadaşlar", "друзья", "Ich will echte Freunde.", "Gerçek arkadaşlar istiyorum.", ["noun", "family"]],
  ["Kissen", "das", "Kissen", "yastık", "подушка", "Hier ist ein Kissen für dich.", "İşte senin için bir yastık.", ["noun", "home"]],
  ["vorbei", null, null, "bitti", "кончилось", "Aber es ist vorbei!", "Ama bitti!", ["adverb", "daily"]],
  ["heulen", null, null, "ağlamak", "плакать", "Und jetzt heul bitte nicht!", "Ve şimdi lütfen ağlama!", ["verb", "daily"]],
  ["Männer", null, null, "adamlar", "мужчины", "Männer!", "Adamlar!", ["noun", "family"]],
  ["Pickel", "der", "Pickel", "sivilce", "прыщ", "Hast du immer noch so viele Pickel?", "Hâlâ bu kadar çok sivilcen var mı?", ["noun", "health"]],
  ["Amerika", null, null, "Amerika", "Америка", "Der Brief ist aus Amerika.", "Mektup Amerika'dan.", ["noun", "travel"]],
  ["Deutsch", null, null, "Almanca", "немецкий", "Ich spreche jetzt gut Deutsch.", "Artık iyi Almanca konuşuyorum.", ["noun", "language"]],
  ["Deutschland", null, null, "Almanya", "Германия", "Ich komme nach Deutschland.", "Almanya'ya geliyorum.", ["noun", "travel"]],
  ["Amerikaner", "der", "Amerikaner", "Amerikalı", "американец", "Ein Amerikaner kommt heute.", "Bugün bir Amerikalı geliyor.", ["noun", "travel"]],
  ["übernachten", null, null, "gece kalmak", "ночевать", "Er will hier übernachten.", "Burada gece kalmak istiyor.", ["verb", "travel"]],
  ["Cola", "die", "Colas", "kola", "кола", "Eine Cola, bitte.", "Bir kola lütfen.", ["noun", "restaurant"]],
  ["cool", null, null, "havalı", "крутой", "Ein cooler Ami, ja?", "Havalı bir Amerikalı, değil mi?", ["adjective", "daily"]],
  ["anfassen", null, null, "dokunmak", "трогать", "Niemand darf mein Fahrrad anfassen!", "Kimse bisikletime dokunamaz!", ["verb", "daily"]],
  ["Spielzeug", "das", "Spielzeuge", "oyuncak", "игрушка", "Er spielt mit Spielzeug-Autos.", "Oyuncak arabalarla oynuyor.", ["noun", "daily"]],
  ["Buch", "das", "Bücher", "kitap", "книга", "Ich lese ein Buch.", "Bir kitap okuyorum.", ["noun", "daily"]],
  ["Bücherei", "die", "Büchereien", "kütüphane", "библиотека", "Ich liebe die Bücherei!", "Kütüphaneyi seviyorum!", ["noun", "daily"]],
  ["Museum", "das", "Museen", "müze", "музей", "Ich wohne in einem Museum.", "Bir müzede yaşıyorum.", ["noun", "travel"]],
  ["Ofen", "der", "Öfen", "fırın", "духовка", "Der Hund ist im Ofen!", "Köpek fırında!", ["noun", "home"]],
  ["Hund", "der", "Hunde", "köpek", "собака", "Louis ist ein guter Hund.", "Louis iyi bir köpek.", ["noun", "home"]],
  ["stark", null, null, "güçlü", "сильный", "Sascha steht auf starke Männer.", "Sascha güçlü erkeklerden hoşlanır.", ["adjective", "daily"]],
  ["blau", null, null, "mavi", "синий", "Rot oder blau?", "Kırmızı mı mavi mi?", ["adjective", "daily"]],
  ["rot", null, null, "kırmızı", "красный", "Blau finde ich besser.", "Maviyi daha iyi buluyorum.", ["adjective", "daily"]],
  ["Ordnung", "die", null, "durum / sorun yok", "порядок", "Alles in Ordnung?", "Her şey yolunda mı?", ["noun", "daily"]],
  ["nett", null, null, "nazik", "милый", "Er ist so nett.", "O çok nazik.", ["adjective", "daily"]],
  ["Witz", "der", "Witze", "şaka", "шутка", "So ein blöder Witz.", "Ne aptal bir şaka.", ["noun", "daily"]],
  ["böse", null, null, "kötü", "злой", "So ein böser Junge!", "Ne kötü çocuk!", ["adjective", "daily"]],
  ["Junge", "der", "Jungen", "çocuk / oğlan", "мальчик", "Louis ist ein böser Junge.", "Louis kötü bir çocuk.", ["noun", "family"]],
  ["frei", null, null, "boş / serbest", "свободный", "Du hast doch ein freies Zimmer!", "Boş bir odan var!", ["adjective", "home"]],
  ["Leute", null, null, "insanlar", "люди", "Hey Leute!", "Selam millet!", ["noun", "daily"]],
  ["Party", "die", "Partys", "parti", "вечеринка", "Heute ist die Love Parade — eine Party!", "Bugün Love Parade — bir parti!", ["noun", "daily"]],
  ["verstecken", null, null, "saklanmak", "прятаться", "Schnell, versteck dich!", "Çabuk, saklan!", ["verb", "daily"]],
  ["bekommen", null, null, "almak", "получать", "Sascha bekommt Post aus Amerika.", "Sascha Amerika'dan posta alıyor.", ["verb", "daily"]],
  ["Lehrer", "der", "Lehrer", "öğretmen", "учитель", "Nic ist ein guter Lehrer.", "Nic iyi bir öğretmen.", ["noun", "work"]],
  ["Lehrerin", "die", "Lehrerinnen", "öğretmen (kadın)", "учительница", "Die Lehrerin ist nett.", "Öğretmen nazik.", ["noun", "work"]],
  ["Couch", "die", "Couches", "kanepe", "диван", "Das ist eine Klapp-Couch.", "Bu bir açılır kanepe.", ["noun", "home"]],
  ["zeigen", null, null, "göstermek", "показывать", "Wir zeigen dir die Wohnung.", "Sana daireyi gösteriyoruz.", ["verb", "daily"]],
  ["spielen", null, null, "oynamak", "играть", "Ich spiele mit Autos.", "Arabalarla oynuyorum.", ["verb", "daily"]],
  ["interessant", null, null, "ilginç", "интересный", "Oh, wie interessant.", "Ah, ne kadar ilginç.", ["adjective", "daily"]],
  ["tot", null, null, "ölü", "мёртвый", "Jetzt bin ich tot!", "Şimdi öldüm!", ["adjective", "daily"]],
  ["Chance", "die", "Chancen", "şans", "шанс", "Keine Chance.", "Şans yok.", ["noun", "daily"]],
  ["Wort", "das", "Wörter", "söz / kelime", "слово", "Kein Wort zu den Mädchen!", "Kızlara tek kelime etme!", ["noun", "daily"]],
  ["Ahnung", "die", null, "fikir / bilmek", "понятие", "Keine Ahnung.", "Hiç fikrim yok.", ["noun", "daily"]],
  ["wieso", null, null, "neden", "почему", "Aber wieso?", "Ama neden?", ["adverb", "daily"]],
  ["egal", null, null, "fark etmez", "всё равно", "Das ist mir egal!", "Umurumda değil!", ["adverb", "daily"]],
  ["niemals", null, null, "asla", "никогда", "Ich vergesse nie etwas!", "Asla bir şey unutmam!", ["adverb", "daily"]],
  ["selber", null, null, "kendi / bizzat", "сам", "Sam geht selber einkaufen.", "Sam kendi alışverişine gidiyor.", ["adverb", "daily"]],
  ["wahr", null, null, "doğru", "правда", "Nicht wahr, Sam?", "Değil mi Sam?", ["adjective", "daily"]],
  ["Spaß", "der", null, "eğlence", "веселье", "Ihr habt bestimmt viel Spaß miteinander!", "Kesin birlikte çok eğlenirsiniz!", ["noun", "daily"]],
];

const A2_WORDS = [
  ["Telefonrechnung", "die", "Telefonrechnungen", "telefon faturası", "счёт за телефон", "Telefonrechnung, Gasrechnung, Stromrechnung.", "Telefon, doğalgaz, elektrik faturası.", ["noun", "home"]],
  ["Gasrechnung", "die", "Gasrechnungen", "doğalgaz faturası", "счёт за газ", "Die Gasrechnung ist hoch.", "Doğalgaz faturası yüksek.", ["noun", "home"]],
  ["Stromrechnung", "die", "Stromrechnungen", "elektrik faturası", "счёт за электричество", "Die Stromrechnung kommt jeden Monat.", "Elektrik faturası her ay gelir.", ["noun", "home"]],
  ["Tarantel", "die", "Taranteln", "tarantula", "тарантул", "Was? Die Tarantel?", "Ne? Tarantula mı?", ["noun", "daily"]],
  ["sportlich", null, null, "atletik", "спортивный", "Groß, sportlich und reich!", "Uzun, atletik ve zengin!", ["adjective", "daily"]],
  ["reich", null, null, "zengin", "богатый", "Du bist total reich.", "Tamamen zenginsin.", ["adjective", "daily"]],
  ["Kontrolle", "die", "Kontrollen", "kontrol", "контроль", "Alles unter Kontrolle.", "Her şey kontrol altında.", ["noun", "daily"]],
  ["Muskel", "der", "Muskeln", "kas", "мышца", "Hey, du hast aber Muskeln!", "Hey, kasların var!", ["noun", "health"]],
  ["begründen", null, null, "gerekçelendirmek", "обосновывать", "Muss ich das begründen?", "Bunu gerekçelendirmem mi gerekiyor?", ["verb", "daily"]],
  ["Klappcouch", "die", "Klappcouches", "açılır kanepe", "раскладной диван", "Das ist eine Klapp-Couch.", "Bu bir açılır kanepe.", ["noun", "home"]],
  ["Fernbedienung", "die", "Fernbedienungen", "kumanda", "пульт", "Und das ist die Fernbedienung.", "Ve bu kumanda.", ["noun", "home"]],
  ["Klamotten", null, null, "kıyafetler", "одежда", "Aber seine Klamotten!", "Ama kıyafetleri!", ["noun", "daily"]],
  ["altmodisch", null, null, "modası geçmiş", "старомодный", "Er ist so altmodisch!", "O çok modası geçmiş!", ["adjective", "daily"]],
  ["süß", null, null, "tatlı / sevimli", "милый", "Aber er ist süß.", "Ama o sevimli.", ["adjective", "daily"]],
  ["höflich", null, null, "nazik / kibar", "вежливый", "Und er ist höflich.", "Ve o kibar.", ["adjective", "daily"]],
  ["sexy", null, null, "seksi", "сексуальный", "Und besonders sexy ist er auch nicht!", "Ve özellikle seksi de değil!", ["adjective", "daily"]],
  ["Gepäck", "das", null, "bagaj", "багаж", "Bitte bringen Sie mir mein Gepäck.", "Lütfen bagajımı getirin.", ["noun", "travel"]],
  ["Portier", "der", "Portiers", "kapıcı", "портье", "Du bist der Portier, right?", "Sen kapıcısın, değil mi?", ["noun", "work"]],
  ["nebenan", null, null, "yan tarafta / komşu", "рядом", "Ich wohne nebenan.", "Yan tarafta oturuyorum.", ["adverb", "home"]],
  ["Lieblingsessen", "das", "Lieblingsessen", "favori yemek", "любимая еда", "Was ist dein Lieblingsessen?", "Favori yemeğin ne?", ["noun", "restaurant"]],
  ["Currywurst", "die", "Currywürste", "currywurst", "карри-колбаса", "Currywurst, okay.", "Currywurst, tamam.", ["noun", "restaurant"]],
  ["Shopping", null, null, "alışveriş", "шопинг", "Viel Shopping?", "Çok alışveriş mi?", ["noun", "daily"]],
  ["Dienstboten", null, null, "hizmetkârlar", "слуги", "Meine Dienstboten.", "Hizmetkârlarım.", ["noun", "family"]],
  ["schrecklich", null, null, "korkunç", "ужасный", "Mensch, das ist ja schrecklich!", "Vay be, bu korkunç!", ["adjective", "daily"]],
  ["Vermieterin", "die", "Vermieterinnen", "ev sahibi (kadın)", "хозяйка", "Hilfe, es ist die Vermieterin!", "Yardım, ev sahibi geldi!", ["noun", "home"]],
  ["Zeitschrift", "die", "Zeitschriften", "dergi", "журнал", "Hat jemand meine neue Zeitschrift gesehen?", "Kimse yeni dergimi gördü mü?", ["noun", "daily"]],
  ["Make-up", null, null, "makyaj", "макияж", "Mein Make-up.", "Makyajım.", ["noun", "daily"]],
  ["Love Parade", "die", null, "Love Parade", "Love Parade", "Heute ist die Love Parade!", "Bugün Love Parade!", ["noun", "daily"]],
  ["verpassen", null, null, "kaçırmak", "пропустить", "Das dürft ihr nicht verpassen!", "Bunu kaçırmamalısınız!", ["verb", "daily"]],
  ["Schwesterherz", null, null, "canım kardeşim", "сестрёнка", "Schwesterherz, ich heiße Anna.", "Canım kardeşim, adım Anna.", ["noun", "family"]],
];

function nextId(words, prefix) {
  let max = 0;
  for (const w of words) {
    const m = w.id.match(new RegExp(`^${prefix}_(\\d+)$`));
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return max + 1;
}

function seedPack(path, level, newEntries) {
  const data = JSON.parse(readFileSync(path, "utf8"));
  const prefix = level.toLowerCase();
  const existing = new Set(data.words.map((w) => w.word.toLowerCase()));
  let id = nextId(data.words, prefix);
  const added = [];

  for (const entry of newEntries) {
    const word = entry[0];
    if (existing.has(word.toLowerCase())) continue;
    const built = buildWord(id++, level, entry);
    data.words.push(built);
    existing.add(word.toLowerCase());
    added.push(built.word);
  }

  if (!data.categories.includes(CATEGORY)) {
    data.categories.push(CATEGORY);
  }
  data.total = data.words.length;
  data.version = level === "A1" ? "2.2.0" : "1.1.0";

  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
  return added;
}

const a1Added = seedPack(A1_PATH, "A1", A1_WORDS);
const a2Added = seedPack(A2_PATH, "A2", A2_WORDS);

console.log("Extra · Sam aus Amerika — kelime ekleme");
console.log("─".repeat(40));
console.log(`A1: +${a1Added.length} kelime (toplam kontrol için dosyaya bakın)`);
console.log(`A2: +${a2Added.length} kelime`);
console.log("");
if (a1Added.length) console.log("A1:", a1Added.join(", "));
if (a2Added.length) console.log("A2:", a2Added.join(", "));
