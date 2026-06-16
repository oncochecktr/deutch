/**
 * Timur Modu — Depo / Lojistik / Almanya iş hayatı kelimeleri
 * node scripts/build-timur.mjs
 */
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, "../data/timur/vocabulary.json");

const CATEGORIES = [
  "Depo",
  "Lojistik",
  "Kommissionierung",
  "Vardiya & Mesai",
  "Maaş & Sözleşme",
  "İş güvenliği",
  "Forklift & Ekipman",
  "Şefle iletişim",
];

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

/** [word, article, plural, tr, ru, example_de, example_tr, tags[]] */
const SEED = {
  Depo: [
    ["Lager", "das", "Lager", "depo", "склад", "Ich arbeite im Lager.", "Depoda çalışıyorum.", ["warehouse"]],
    ["Wareneingang", "der", "Wareneingänge", "mal girişi", "приёмка", "Der Wareneingang ist heute voll.", "Bugün mal girişi yoğun.", ["warehouse"]],
    ["Warenausgang", "der", "Warenausgänge", "mal çıkışı", "отгрузка", "Der Warenausgang ist um zehn Uhr.", "Mal çıkışı saat onda.", ["warehouse"]],
    ["Lagerhalle", "die", "Lagerhallen", "depo holu", "складской зал", "Die Lagerhalle ist groß.", "Depo holu büyük.", ["warehouse"]],
    ["Regal", "das", "Regale", "raf", "стеллаж", "Das Regal ist voll.", "Raf dolu.", ["warehouse"]],
    ["Gang", "der", "Gänge", "koridor", "проход", "Gehen Sie den Gang entlang.", "Koridordan gidin.", ["warehouse"]],
    ["Boden", "der", "Böden", "zemin", "пол", "Der Boden ist sauber.", "Zemin temiz.", ["warehouse"]],
    ["Inventur", "die", "Inventuren", "envanter sayımı", "инвентаризация", "Heute ist Inventur.", "Bugün envanter sayımı var.", ["warehouse"]],
    ["Bestand", "der", "Bestände", "stok", "запас", "Der Bestand ist niedrig.", "Stok düşük.", ["warehouse"]],
    ["Umlagerung", "die", "Umlagerungen", "transfer", "перемещение", "Die Umlagerung dauert zwei Stunden.", "Transfer iki saat sürer.", ["warehouse"]],
    ["Lagerraum", "der", "Lagerräume", "depo alanı", "складское помещение", "Der Lagerraum ist kalt.", "Depo alanı soğuk.", ["warehouse"]],
    ["Halle", "die", "Hallens", "hangar/hol", "ангар", "In der Halle ist es laut.", "Hol gürültülü.", ["warehouse"]],
  ],
  Lojistik: [
    ["Logistik", "die", null, "lojistik", "логистика", "Ich arbeite in der Logistik.", "Lojistikte çalışıyorum.", ["logistics"]],
    ["Lieferung", "die", "Lieferungen", "teslimat", "доставка", "Die Lieferung kommt morgen.", "Teslimat yarın geliyor.", ["logistics"]],
    ["Spedition", "die", "Speditionen", "nakliye firması", "экспедиция", "Die Spedition liefert pünktlich.", "Nakliye firması zamanında teslim eder.", ["logistics"]],
    ["Transport", "der", "Transporte", "nakliye", "транспорт", "Der Transport ist organisiert.", "Nakliye organize edildi.", ["logistics"]],
    ["LKW", "der", "LKWs", "kamyon", "грузовик", "Der LKW wartet am Tor.", "Kamyon kapıda bekliyor.", ["logistics"]],
    ["Anlieferung", "die", "Anlieferungen", "teslim alma", "поставка", "Die Anlieferung ist um acht.", "Teslim alma saat sekizde.", ["logistics"]],
    ["Versand", "der", null, "sevkiyat", "отправка", "Der Versand beginnt um neun.", "Sevkiyat dokuzda başlar.", ["logistics"]],
    ["Fracht", "die", "Frachten", "yük", "груз", "Die Fracht ist schwer.", "Yük ağır.", ["logistics"]],
    ["Strecke", "die", "Strecken", "rota", "маршрут", "Meine Strecke ist lang.", "Rotam uzun.", ["logistics"]],
    ["Sendung", "die", "Sendungen", "gönderi", "отправление", "Die Sendung ist unterwegs.", "Gönderi yolda.", ["logistics"]],
    ["Zoll", "der", null, "gümrük", "таможня", "Der Zoll kontrolliert die Ware.", "Gümrük malları kontrol eder.", ["logistics"]],
    ["Einfuhr", "die", "Einfuhren", "ithalat", "импорт", "Die Einfuhr dauert lange.", "İthalat uzun sürer.", ["logistics"]],
  ],
  Kommissionierung: [
    ["Kommissionierung", "die", null, "sipariş toplama", "комплектация", "Die Kommissionierung ist meine Aufgabe.", "Sipariş toplama benim görevim.", ["picking"]],
    ["Kommissionierliste", "die", "Kommissionierlisten", "toplama listesi", "лист комплектации", "Hier ist die Kommissionierliste.", "İşte toplama listesi.", ["picking"]],
    ["Bestellung", "die", "Bestellungen", "sipariş", "заказ", "Die Bestellung ist fertig.", "Sipariş hazır.", ["picking"]],
    ["Artikel", "der", "Artikel", "ürün/kalem", "артикул", "Der Artikel ist im Regal B3.", "Ürün B3 rafında.", ["picking"]],
    ["Artikelnummer", "die", "Artikelnummern", "ürün numarası", "номер артикула", "Die Artikelnummer ist 12345.", "Ürün numarası 12345.", ["picking"]],
    ["Strichcode", "der", "Strichcodes", "barkod", "штрихкод", "Scannen Sie den Strichcode.", "Barkodu tarayın.", ["picking"]],
    ["Lesegerät", "das", "Lesegeräte", "tarayıcı", "сканер", "Das Lesegerät funktioniert nicht.", "Tarayıcı çalışmıyor.", ["picking"]],
    ["Packliste", "die", "Packlisten", "paket listesi", "упаковочный лист", "Die Packliste ist dabei.", "Paket listesi eklendi.", ["picking"]],
    ["Karton", "der", "Kartons", "karton", "картон", "Der Karton ist schwer.", "Karton ağır.", ["picking"]],
    ["Paket", "das", "Pakete", "paket", "посылка", "Das Paket ist kaputt.", "Paket hasarlı.", ["picking"]],
    ["verpacken", null, null, "paketlemek", "упаковывать", "Ich verpacke die Ware.", "Malı paketliyorum.", ["picking"]],
    ["etikettieren", null, null, "etiketlemek", "маркировать", "Bitte etikettieren.", "Lütfen etiketleyin.", ["picking"]],
    ["sortieren", null, null, "ayırmak/sınıflamak", "сортировать", "Wir sortieren die Pakete.", "Paketleri ayırıyoruz.", ["picking"]],
    ["Stück", "das", "Stücke", "adet", "штука", "Zehn Stück, bitte.", "On adet lütfen.", ["picking"]],
  ],
  "Vardiya & Mesai": [
    ["Schicht", "die", "Schichten", "vardiya", "смена", "Meine Schicht beginnt um sechs.", "Vardiyam altıda başlıyor.", ["shift"]],
    ["Frühschicht", "die", "Frühschichten", "sabah vardiyası", "утренняя смена", "Ich habe Frühschicht.", "Sabah vardiyam var.", ["shift"]],
    ["Spätschicht", "die", "Spätschichten", "akşam vardiyası", "вечерняя смена", "Die Spätschicht endet um Mitternacht.", "Akşam vardiyası gece yarısında biter.", ["shift"]],
    ["Nachtschicht", "die", "Nachtschichten", "gece vardiyası", "ночная смена", "Die Nachtschicht ist anstrengend.", "Gece vardiyası yorucu.", ["shift"]],
    ["Arbeitszeit", "die", "Arbeitszeiten", "çalışma saati", "рабочее время", "Meine Arbeitszeit ist acht Stunden.", "Çalışma saatim sekiz.", ["shift"]],
    ["Überstunden", "die", null, "fazla mesai", "сверхурочные", "Ich mache Überstunden.", "Fazla mesai yapıyorum.", ["shift"]],
    ["Pause", "die", "Pausen", "mola", "перерыв", "Die Pause ist um zwölf.", "Mola saat on iki.", ["shift"]],
    ["Feierabend", "der", null, "iş bitimi", "конец работы", "Um fünf ist Feierabend.", "Beşte iş bitiyor.", ["shift"]],
    ["Schichtplan", "der", "Schichtpläne", "vardiya planı", "график смен", "Der Schichtplan hängt an der Wand.", "Vardiya planı duvarda.", ["shift"]],
    ["einstempeln", null, null, "giriş kart basmak", "отметиться о приходе", "Ich stempel um sechs ein.", "Altıda giriş yapıyorum.", ["shift"]],
    ["ausstempeln", null, null, "çıkış kart basmak", "отметиться об уходе", "Ich stempel um zwei aus.", "İkide çıkış yapıyorum.", ["shift"]],
    ["pünktlich", null, null, "dakik", "вовремя", "Sei pünktlich zur Schicht!", "Vardiyaya dakik ol!", ["shift"]],
  ],
  "Maaş & Sözleşme": [
    ["Lohn", "der", "Löhne", "maaş (saatlik)", "зарплата", "Mein Lohn ist 14 Euro pro Stunde.", "Saatlik maaşım 14 euro.", ["contract"]],
    ["Gehalt", "das", "Gehälter", "maaş (aylık)", "оклад", "Das Gehalt kommt am Monatsende.", "Maaş ay sonunda gelir.", ["contract"]],
    ["Vertrag", "der", "Verträge", "sözleşme", "контракт", "Ich unterschreibe den Vertrag.", "Sözleşmeyi imzalıyorum.", ["contract"]],
    ["Arbeitsvertrag", "der", "Arbeitsverträge", "iş sözleşmesi", "трудовой договор", "Der Arbeitsvertrag ist befristet.", "İş sözleşmesi belirli süreli.", ["contract"]],
    ["Probezeit", "die", "Probezeiten", "deneme süresi", "испытательный срок", "Die Probezeit dauert sechs Monate.", "Deneme süresi altı ay.", ["contract"]],
    ["Kündigung", "die", "Kündigungen", "fesih/ihbar", "увольнение", "Die Kündigungsfrist ist zwei Wochen.", "İhbar süresi iki hafta.", ["contract"]],
    ["Urlaub", "der", "Urlaube", "izin", "отпуск", "Ich habe Urlaub im August.", "Ağustos'ta iznim var.", ["contract"]],
    ["Krankmeldung", "die", "Krankmeldungen", "rapor", "больничный", "Ich brauche eine Krankmeldung.", "Rapor lazım.", ["contract"]],
    ["Steuer", "die", "Steuern", "vergi", "налог", "Die Steuer wird abgezogen.", "Vergi kesilir.", ["contract"]],
    ["Netto", null, null, "net maaş", "нетто", "Mein Netto ist 1800 Euro.", "Net maaşım 1800 euro.", ["contract"]],
    ["Brutto", null, null, "brüt maaş", "брутто", "Das Brutto ist höher.", "Brüt daha yüksek.", ["contract"]],
    ["Sozialversicherung", "die", "Sozialversicherungen", "sosyal sigorta", "соцстрахование", "Die Sozialversicherung ist Pflicht.", "Sosyal sigorta zorunlu.", ["contract"]],
  ],
  "İş güvenliği": [
    ["Sicherheit", "die", null, "güvenlik", "безопасность", "Sicherheit geht vor.", "Güvenlik önce gelir.", ["safety"]],
    ["Arbeitsschutz", "der", null, "iş güvenliği", "охрана труда", "Arbeitsschutz ist wichtig.", "İş güvenliği önemli.", ["safety"]],
    ["Helm", "der", "Helme", "kask", "каска", "Tragen Sie einen Helm!", "Kask takın!", ["safety"]],
    ["Schutzweste", "die", "Schutzwesten", "yelek", "жилет", "Die Schutzweste ist gelb.", "Yelek sarı.", ["safety"]],
    ["Sicherheitsschuhe", "die", null, "güvenlik ayakkabısı", "защитная обувь", "Sicherheitsschuhe sind Pflicht.", "Güvenlik ayakkabısı zorunlu.", ["safety"]],
    ["Handschuhe", "die", null, "eldiven", "перчатки", "Tragen Sie Handschuhe.", "Eldiven takın.", ["safety"]],
    ["Warnung", "die", "Warnungen", "uyarı", "предупреждение", "Achtung! Warnung beachten.", "Dikkat! Uyarıya dikkat.", ["safety"]],
    ["Gefahr", "die", "Gefahren", "tehlike", "опасность", "Vorsicht, Gefahr!", "Dikkat, tehlike!", ["safety"]],
    ["Unfall", "der", "Unfälle", "kaza", "несчастный случай", "Es gab einen Unfall.", "Kaza oldu.", ["safety"]],
    ["Erste Hilfe", "die", null, "ilk yardım", "первая помощь", "Erste Hilfe ist dort.", "İlk yardım orada.", ["safety"]],
    ["Notausgang", "der", "Notausgänge", "acil çıkış", "запасной выход", "Der Notausgang ist links.", "Acil çıkış solda.", ["safety"]],
    ["vorsichtig", null, null, "dikkatli", "осторожный", "Sei vorsichtig!", "Dikkatli ol!", ["safety"]],
  ],
  "Forklift & Ekipman": [
    ["Gabelstapler", "der", "Gabelstapler", "forklift", "погрузчик", "Der Gabelstapler fährt langsam.", "Forklift yavaş gider.", ["equipment"]],
    ["Stapler", "der", "Stapler", "forklift (kısa)", "погрузчик", "Ich fahre Stapler.", "Forklift kullanıyorum.", ["equipment"]],
    ["Staplerschein", "der", "Staplerscheine", "forklift ehliyeti", "удостоверение", "Ich habe einen Staplerschein.", "Forklift ehliyetim var.", ["equipment"]],
    ["Palette", "die", "Paletten", "palet", "паллета", "Bringen Sie die Palette nach hinten.", "Paleti arkaya götürün.", ["equipment"]],
    ["Hubwagen", "der", "Hubwagen", "transpalet", "рохля", "Der Hubwagen ist kaputt.", "Transpalet bozuk.", ["equipment"]],
    ["Gabel", "die", "Gabeln", "çatal (forklift)", "вилы", "Die Gabel ist hoch.", "Çatal yukarıda.", ["equipment"]],
    ["heben", null, null, "kaldırmak", "поднимать", "Heben Sie die Palette vorsichtig.", "Paleti dikkatli kaldırın.", ["equipment"]],
    ["senken", null, null, "indirmek", "опускать", "Senken Sie die Gabel.", "Çatalı indirin.", ["equipment"]],
    ["laden", null, null, "yüklemek", "грузить", "Wir laden den LKW.", "Kamyonu yüklüyoruz.", ["equipment"]],
    ["entladen", null, null, "boşaltmak", "разгружать", "Wir entladen die Ware.", "Malı boşaltıyoruz.", ["equipment"]],
    ["stapeln", null, null, "istiflemek", "штабелировать", "Stapeln Sie die Kartons.", "Kartonları istifleyin.", ["equipment"]],
    ["Rollcontainer", "der", "Rollcontainer", "roll konteyner", "контейнер", "Der Rollcontainer ist voll.", "Roll konteyner dolu.", ["equipment"]],
    ["Förderband", "das", "Förderbänder", "konveyör bant", "конвейер", "Das Förderband läuft.", "Konveyör bant çalışıyor.", ["equipment"]],
  ],
  "Şefle iletişim": [
    ["Chef", "der", "Chefs", "patron/şef", "начальник", "Mein Chef ist streng.", "Patronum katı.", ["communication"]],
    ["Vorgesetzter", "der", "Vorgesetzten", "amir", "руководитель", "Mein Vorgesetzter ruft mich.", "Amirim beni çağırıyor.", ["communication"]],
    ["Kollege", "der", "Kollegen", "iş arkadaşı", "коллега", "Mein Kollege hilft mir.", "İş arkadaşım yardım ediyor.", ["communication"]],
    ["Gruppenleiter", "der", "Gruppenleiter", "grup lideri", "бригадир", "Der Gruppenleiter gibt Anweisungen.", "Grup lideri talimat veriyor.", ["communication"]],
    ["Anweisung", "die", "Anweisungen", "talimat", "указание", "Folgen Sie der Anweisung.", "Talimata uyun.", ["communication"]],
    ["sofort", null, null, "hemen", "сразу", "Machen Sie das sofort!", "Bunu hemen yapın!", ["communication"]],
    ["langsam", null, null, "yavaş", "медленно", "Fahren Sie langsam!", "Yavaş gidin!", ["communication"]],
    ["schnell", null, null, "hızlı", "быстро", "Arbeiten Sie schneller!", "Daha hızlı çalışın!", ["communication"]],
    ["fertig", null, null, "hazır/bitti", "готово", "Ich bin fertig.", "Bitirdim.", ["communication"]],
    ["Problem", "das", "Probleme", "problem", "проблема", "Ich habe ein Problem.", "Bir problemim var.", ["communication"]],
    ["Hilfe", "die", null, "yardım", "помощь", "Ich brauche Hilfe!", "Yardım lazım!", ["communication"]],
    ["verstanden", null, null, "anladım", "понял", "Verstanden!", "Anladım!", ["communication"]],
    ["nach hinten", null, null, "arkaya", "назад", "Bringen Sie es nach hinten.", "Arkaya götürün.", ["communication"]],
    ["nach vorne", null, null, "öne", "вперёд", "Stellen Sie es nach vorne.", "Öne koyun.", ["communication"]],
    ["Achtung", null, null, "dikkat", "внимание", "Achtung! Palette kommt!", "Dikkat! Palet geliyor!", ["communication"]],
  ],
};

let id = 1;
const words = [];

for (const cat of CATEGORIES) {
  for (const [word, article, plural, tr, ru, exDe, exTr, tags] of SEED[cat]) {
    const base = slug(word.split(" ")[0]);
    words.push({
      id: `timur_${String(id).padStart(4, "0")}`,
      level: "A1",
      category: cat,
      word,
      article: article ?? null,
      plural: plural ?? null,
      translation_tr: tr,
      translation_ru: ru,
      example_de: exDe,
      example_tr: exTr,
      audio_word: `/audio/timur/${base}.mp3`,
      audio_example: `/audio/timur/${slug(exDe.slice(0, 40))}.mp3`,
      tags: [...tags, "timur", "work"],
    });
    id++;
  }
}

const pack = {
  level: "A1",
  mode: "timur",
  version: "1.0.0",
  total: words.length,
  categories: CATEGORIES,
  words,
};

writeFileSync(OUT, JSON.stringify(pack, null, 2), "utf8");
console.log(`✓ Timur Modu: ${words.length} kelime → ${OUT}`);
