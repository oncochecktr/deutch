/**
 * Goethe A1 — 500 kelime üretici
 * Çalıştır: node scripts/build-a1-500.mjs
 */
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, "../data/a1/vocabulary.json");

const CATEGORIES = [
  "Selamlama", "Tanışma", "Aile", "Ev", "Market", "İş", "Ulaşım",
  "Saat", "Tarih", "Doktor", "Restoran", "Telefon", "Form doldurma",
  "Günlük ihtiyaçlar", "Basit yön tarifleri",
];

function slug(s) {
  return s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function cap(s) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** [word, article, plural, tr, ru, example_de, example_tr, tags[]] */
const SEED = {
  Selamlama: [
    ["Hallo", null, null, "merhaba", "привет", "Hallo! Wie geht es dir?", "Merhaba! Nasılsın?", ["greeting"]],
    ["Guten Morgen", null, null, "günaydın", "доброе утро", "Guten Morgen! Schönen Tag!", "Günaydın! İyi günler!", ["greeting"]],
    ["Guten Tag", null, null, "iyi günler", "добрый день", "Guten Tag, Frau Müller!", "İyi günler, Bayan Müller!", ["greeting"]],
    ["Guten Abend", null, null, "iyi akşamlar", "добрый вечер", "Guten Abend! Wie geht es?", "İyi akşamlar! Nasılsınız?", ["greeting"]],
    ["Gute Nacht", null, null, "iyi geceler", "спокойной ночи", "Gute Nacht und schlaf gut!", "İyi geceler ve iyi uyu!", ["greeting"]],
    ["Tschüss", null, null, "hoşça kal", "пока", "Tschüss! Bis morgen!", "Hoşça kal! Yarın görüşürüz!", ["greeting"]],
    ["Auf Wiedersehen", null, null, "güle güle", "до свидания", "Auf Wiedersehen, Herr Schmidt!", "Güle güle, Bay Schmidt!", ["greeting"]],
    ["Danke", null, null, "teşekkürler", "спасибо", "Danke schön!", "Çok teşekkürler!", ["greeting"]],
    ["Bitte", null, null, "lütfen / rica ederim", "пожалуйста", "Bitte schön!", "Buyrun / Rica ederim!", ["greeting"]],
    ["Entschuldigung", null, null, "affedersiniz", "извините", "Entschuldigung, wo ist die Toilette?", "Affedersiniz, tuvalet nerede?", ["greeting"]],
    ["Willkommen", null, null, "hoş geldiniz", "добро пожаловать", "Willkommen in Deutschland!", "Almanya'ya hoş geldiniz!", ["greeting"]],
    ["Servus", null, null, "selam (Güney Almanca)", "привет", "Servus! Alles klar?", "Selam! Her şey yolunda mı?", ["greeting"]],
    ["Grüß Gott", null, null, "selam (Bavyera)", "привет", "Grüß Gott! Schönen Tag!", "Selam! İyi günler!", ["greeting"]],
    ["Morgen", null, null, "sabah", "утро", "Am Morgen trinke ich Kaffee.", "Sabah kahve içerim.", ["greeting", "time"]],
    ["Abend", "der", "Abende", "akşam", "вечер", "Am Abend bin ich müde.", "Akşam yorgunum.", ["greeting", "time"]],
    ["Wie geht es?", null, null, "nasılsın?", "как дела?", "Wie geht es Ihnen?", "Nasılsınız?", ["greeting"]],
    ["Alles klar", null, null, "her şey yolunda", "всё в порядке", "Alles klar? — Ja, alles klar!", "Her şey yolunda mı? — Evet!", ["greeting"]],
    ["Schön", null, null, "güzel", "красивый", "Schön, dich zu sehen!", "Seni görmek güzel!", ["greeting"]],
    ["Freut mich", null, null, "memnun oldum", "приятно познакомиться", "Freut mich, Sie kennenzulernen.", "Tanıştığımıza memnun oldum.", ["greeting"]],
    ["Bis bald", null, null, "görüşürüz", "до скорого", "Bis bald!", "Yakında görüşürüz!", ["greeting"]],
    ["Bis später", null, null, "sonra görüşürüz", "до later", "Bis später!", "Sonra görüşürüz!", ["greeting"]],
    ["Guten Appetit", null, null, "afiyet olsun", "приятного аппетита", "Guten Appetit!", "Afiyet olsun!", ["greeting"]],
    ["Prost", null, null, "şerefe", "за здоровье", "Prost!", "Şerefe!", ["greeting"]],
    ["Herzlichen Glückwunsch", null, null, "tebrikler", "поздравляю", "Herzlichen Glückwunsch zum Geburtstag!", "Doğum günün kutlu olsun!", ["greeting"]],
    ["Viel Glück", null, null, "bol şans", "удачи", "Viel Glück bei der Prüfung!", "Sınavda bol şans!", ["greeting"]],
    ["Gute Besserung", null, null, "geçmiş olsun", "выздоравливай", "Gute Besserung!", "Geçmiş olsun!", ["greeting"]],
    ["Schönes Wochenende", null, null, "iyi hafta sonları", "хороших выходных", "Schönes Wochenende!", "İyi hafta sonları!", ["greeting"]],
    ["Frohe Weihnachten", null, null, "mutlu Noel", "с Рождеством", "Frohe Weihnachten!", "Mutlu Noel!", ["greeting"]],
    ["Frohes neues Jahr", null, null, "mutlu yıllar", "с Новым годом", "Frohes neues Jahr!", "Mutlu yıllar!", ["greeting"]],
    ["Ja", null, null, "evet", "да", "Ja, natürlich!", "Evet, tabii ki!", ["greeting", "basic"]],
    ["Nein", null, null, "hayır", "нет", "Nein, danke.", "Hayır, teşekkürler.", ["greeting", "basic"]],
    ["Vielleicht", null, null, "belki", "может быть", "Vielleicht morgen.", "Belki yarın.", ["greeting", "basic"]],
    ["Natürlich", null, null, "tabii ki", "конечно", "Natürlich!", "Tabii ki!", ["greeting", "basic"]],
  ],
  Tanışma: [
    ["Name", "der", "Namen", "isim", "имя", "Mein Name ist Timur.", "Benim adım Timur.", ["introduction"]],
    ["Vorname", "der", "Vornamen", "ad", "имя", "Mein Vorname ist Ali.", "Adım Ali.", ["introduction"]],
    ["Nachname", "der", "Nachnamen", "soyad", "фамилия", "Mein Nachname ist Yilmaz.", "Soyadım Yılmaz.", ["introduction"]],
    ["kommen", null, null, "gelmek", "приходить", "Ich komme aus der Türkei.", "Türkiye'den geliyorum.", ["verb", "introduction"]],
    ["wohnen", null, null, "yaşamak", "жить", "Ich wohne in Berlin.", "Berlin'de yaşıyorum.", ["verb", "introduction"]],
    ["Sprache", "die", "Sprachen", "dil", "язык", "Ich spreche Deutsch und Türkisch.", "Almanca ve Türkçe konuşuyorum.", ["noun", "introduction"]],
    ["sprechen", null, null, "konuşmak", "говорить", "Ich spreche ein bisschen Deutsch.", "Biraz Almanca konuşuyorum.", ["verb", "introduction"]],
    ["verstehen", null, null, "anlamak", "понимать", "Ich verstehe nicht.", "Anlamıyorum.", ["verb", "introduction"]],
    ["lernen", null, null, "öğrenmek", "учить", "Ich lerne Deutsch.", "Almanca öğreniyorum.", ["verb", "introduction"]],
    ["Land", "das", "Länder", "ülke", "страна", "Mein Land ist die Türkei.", "Ülkem Türkiye.", ["noun", "introduction"]],
    ["Stadt", "die", "Städte", "şehir", "город", "Ich wohne in einer großen Stadt.", "Büyük bir şehirde yaşıyorum.", ["noun", "introduction"]],
    ["Adresse", "die", "Adressen", "adres", "адрес", "Meine Adresse ist Hauptstraße 5.", "Adresim Hauptstraße 5.", ["noun", "introduction"]],
    ["Alter", "das", null, "yaş", "возраст", "Mein Alter ist 25.", "Yaşım 25.", ["noun", "introduction"]],
    ["Jahre alt", null, null, "yaşında", "лет", "Ich bin 25 Jahre alt.", "25 yaşındayım.", ["introduction"]],
    ["Beruf", "der", "Berufe", "meslek", "профессия", "Mein Beruf ist Lagerarbeiter.", "Mesleğim depo işçisi.", ["noun", "introduction"]],
    ["arbeiten als", null, null, "olarak çalışmak", "работать как", "Ich arbeite als Fahrer.", "Şoför olarak çalışıyorum.", ["introduction"]],
    ["ledig", null, null, "bekar", "холост", "Ich bin ledig.", "Bekarım.", ["introduction"]],
    ["verheiratet", null, null, "evli", "женат", "Ich bin verheiratet.", "Evliyim.", ["introduction"]],
    ["Nationalität", "die", "Nationalitäten", "uyruk", "национальность", "Meine Nationalität ist türkisch.", "Uyruğum Türk.", ["noun", "introduction"]],
    ["Pass", "der", "Pässe", "pasaport", "паспорт", "Mein Pass ist gültig.", "Pasaportum geçerli.", ["noun", "introduction"]],
    ["Ausweis", "der", "Ausweise", "kimlik", "удостоверение", "Hier ist mein Ausweis.", "İşte kimliğim.", ["noun", "introduction"]],
    ["Telefonnummer", "die", "Telefonnummern", "telefon numarası", "номер телефона", "Meine Telefonnummer ist 0176...", "Telefon numaram 0176...", ["noun", "introduction"]],
    ["E-Mail", "die", "E-Mails", "e-posta", "электронная почта", "Meine E-Mail ist timur@mail.de.", "E-postam timur@mail.de.", ["noun", "introduction"]],
    ["kennenlernen", null, null, "tanışmak", "знакомиться", "Schön, dich kennenzulernen.", "Tanıştığıma memnun oldum.", ["verb", "introduction"]],
    ["heißen", null, null, "adlandırılmak", "называться", "Ich heiße Timur.", "Adım Timur.", ["verb", "introduction"]],
    ["sein", null, null, "olmak", "быть", "Ich bin Student.", "Öğrenciyim.", ["verb", "introduction"]],
    ["haben", null, null, "sahip olmak", "иметь", "Ich habe einen Bruder.", "Bir erkek kardeşim var.", ["verb", "introduction"]],
    ["Frage", "die", "Fragen", "soru", "вопрос", "Ich habe eine Frage.", "Bir sorum var.", ["noun", "introduction"]],
    ["Antwort", "die", "Antworten", "cevap", "ответ", "Das ist meine Antwort.", "Bu benim cevabım.", ["noun", "introduction"]],
    ["Information", "die", "Informationen", "bilgi", "информация", "Ich brauche Information.", "Bilgiye ihtiyacım var.", ["noun", "introduction"]],
    ["Formular", "das", "Formulare", "form", "форма", "Ich fülle das Formular aus.", "Formu dolduruyorum.", ["noun", "introduction"]],
    ["Unterschrift", "die", "Unterschriften", "imza", "подпись", "Hier ist meine Unterschrift.", "İşte imzam.", ["noun", "introduction"]],
    ["Datum", "das", "Daten", "tarih", "дата", "Das Datum ist der 1. März.", "Tarih 1 Mart.", ["noun", "introduction"]],
    ["Geburtsdatum", "das", "Geburtsdaten", "doğum tarihi", "дата рождения", "Mein Geburtsdatum ist der 1. Januar.", "Doğum tarihim 1 Ocak.", ["noun", "introduction"]],
  ],
  Aile: [
    ["Mutter", "die", "Mütter", "anne", "мать", "Meine Mutter ist nett.", "Annem nazik.", ["family"]],
    ["Vater", "der", "Väter", "baba", "отец", "Mein Vater arbeitet viel.", "Babam çok çalışıyor.", ["family"]],
    ["Kind", "das", "Kinder", "çocuk", "ребёнок", "Das Kind spielt im Garten.", "Çocuk bahçede oynuyor.", ["family"]],
    ["Sohn", "der", "Söhne", "oğul", "сын", "Mein Sohn ist fünf Jahre alt.", "Oğlum beş yaşında.", ["family"]],
    ["Tochter", "die", "Töchter", "kız evlat", "дочь", "Meine Tochter geht in die Schule.", "Kızım okula gidiyor.", ["family"]],
    ["Bruder", "der", "Brüder", "erkek kardeş", "брат", "Mein Bruder wohnt in Hamburg.", "Erkek kardeşim Hamburg'da.", ["family"]],
    ["Schwester", "die", "Schwestern", "kız kardeş", "сестра", "Meine Schwester ist Ärztin.", "Kız kardeşim doktor.", ["family"]],
    ["Großmutter", "die", "Großmütter", "büyükanne", "бабушка", "Meine Großmutter kocht gut.", "Büyükannem iyi yemek yapar.", ["family"]],
    ["Großvater", "der", "Großväter", "büyükbaba", "дедушка", "Mein Großvater ist 80.", "Büyükbabam 80 yaşında.", ["family"]],
    ["Eltern", "die", null, "ebeveynler", "родители", "Meine Eltern leben in der Türkei.", "Ebeveynlerim Türkiye'de.", ["family"]],
    ["Familie", "die", "Familien", "aile", "семья", "Meine Familie ist groß.", "Ailem büyük.", ["family"]],
    ["Ehemann", "der", "Ehemänner", "koca", "муж", "Mein Ehemann arbeitet im Lager.", "Kocam depoda çalışıyor.", ["family"]],
    ["Ehefrau", "die", "Ehefrauen", "eş (kadın)", "жена", "Meine Ehefrau ist zu Hause.", "Eşim evde.", ["family"]],
    ["Baby", "das", "Babys", "bebek", "малыш", "Das Baby schläft.", "Bebek uyuyor.", ["family"]],
    ["Enkel", "der", "Enkel", "torun (erkek)", "внук", "Mein Enkel ist süß.", "Torunum tatlı.", ["family"]],
    ["Enkelin", "die", "Enkelinnen", "torun (kız)", "внучка", "Meine Enkelin spielt Klavier.", "Kız torunum piyano çalıyor.", ["family"]],
    ["Onkel", "der", "Onkel", "amca/dayı", "дядя", "Mein Onkel wohnt in Ankara.", "Amcam Ankara'da.", ["family"]],
    ["Tante", "die", "Tanten", "hala/teyze", "тётя", "Meine Tante ist nett.", "Hala teyzem nazik.", ["family"]],
    ["Cousin", "der", "Cousins", "kuzen (erkek)", "кузен", "Mein Cousin studiert.", "Kuzenim okuyor.", ["family"]],
    ["Cousine", "die", "Cousinen", "kuzen (kız)", "кузина", "Meine Cousine arbeitet.", "Kız kuzenim çalışıyor.", ["family"]],
    ["Schwiegermutter", "die", "Schwiegermütter", "kayınvalide", "тёща", "Meine Schwiegermutter wohnt bei uns.", "Kayınvalidem bizde kalıyor.", ["family"]],
    ["Schwiegervater", "der", "Schwiegerväter", "kayın baba", "тесть", "Mein Schwiegervater ist Rentner.", "Kayınpederim emekli.", ["family"]],
    ["Schwager", "der", "Schwäger", "enişte/bacanak", "шурин", "Mein Schwager ist Mechaniker.", "Enişte bacanağım tamirci.", ["family"]],
    ["Schwägerin", "die", "Schwägerinnen", "baldız/gelin", "невестка", "Meine Schwägerin ist Lehrerin.", "Baldız gelinim öğretmen.", ["family"]],
    ["Neffe", "der", "Neffen", "yeğen (erkek)", "племянник", "Mein Neffe ist zehn.", "Yeğenim on yaşında.", ["family"]],
    ["Nichte", "die", "Nichten", "yeğen (kız)", "племянница", "Meine Nichte tanzt gern.", "Kız yeğenim dans etmeyi sever.", ["family"]],
    ["Verwandte", "der", "Verwandten", "akraba", "родственник", "Ich besuche Verwandte.", "Akrabaları ziyaret ediyorum.", ["family"]],
    ["Paar", "das", "Paare", "çift", "пара", "Das Paar ist verheiratet.", "Çift evli.", ["family"]],
    ["lieben", null, null, "sevmek", "любить", "Ich liebe meine Familie.", "Ailemi seviyorum.", ["verb", "family"]],
    ["heiraten", null, null, "evlenmek", "жениться", "Wir heiraten im Sommer.", "Yazın evleniyoruz.", ["verb", "family"]],
    ["geboren", null, null, "doğmuş", "родился", "Ich bin in Istanbul geboren.", "İstanbul'da doğdum.", ["family"]],
    ["Zusammenleben", null, null, "birlikte yaşamak", "жить вместе", "Wir leben zusammen.", "Birlikte yaşıyoruz.", ["family"]],
    ["allein", null, null, "yalnız", "один", "Ich wohne allein.", "Yalnız yaşıyorum.", ["family"]],
    ["zusammen", null, null, "birlikte", "вместе", "Wir essen zusammen.", "Birlikte yemek yiyoruz.", ["family"]],
  ],
};

// Continue with remaining categories - I'll append via second part
export { SEED, CATEGORIES, slug, cap, slug as slugFn };
