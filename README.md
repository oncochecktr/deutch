# German Coach

Goethe A1/A2/B1 sınav hazırlık platformu — local MVP.

## Hızlı Başlangıç

Windows'ta çift tıkla:

```
start.bat          → uygulama (localhost:3000)
generate-audio.bat → MP3 ses dosyaları (Edge TTS)
```

Tarayıcı: http://localhost:3000

## Yapı

- `apps/web` — Next.js + Tailwind arayüz
- `packages/vocabulary` — kelime paketi
- `data/a1/vocabulary.json` — 510 A1 kelime
- `data/timur/vocabulary.json` — 102 depo/lojistik kelime (Timur Modu)
- `apps/web/public/audio/` — MP3 dosyaları
- `data/schema/` — JSON şema

## Hafıza

İlerleme `localStorage` (`german-coach-progress`) içinde saklanır:
- Son açılan sayfa
- Kart/quiz indeksi
- Bilinen kelimeler
- Doğru/yanlış istatistikleri
- Günlük çalışma süresi
- Mola ayarları

## Modüller

| Sayfa | Açıklama |
|-------|----------|
| Timur | 102 depo/lojistik kelime + ustabaşı cümleleri |
| Dinle | Yürüyüş MP3 modu (Timur / A1 / SRS) |
| Tekrar | SRS motoru — 1/3/7/14/30 gün |
| Kelime | 510 A1 kelime listesi |
| Quiz | Goethe tarzı test |
| Goethe | Soru bankası — 4 modül + 20 deneme |

## Ses (MP3)

```bash
npm run audio -- --pack timur   # 204 dosya (~2 dk)
npm run audio -- --pack a1      # ~1020 dosya (~15-20 dk)
npm run audio -- --pack all
```

Ses: Edge TTS `de-DE-KatjaNeural`. MP3 yoksa tarayıcı TTS devreye girer.

## Goethe A1 Soru Bankası

```bash
npm run goethe   # bankayı yeniden üret
```

| Modül | Adet |
|-------|------|
| Hören | 100 |
| Lesen | 100 soru (25 metin) |
| Schreiben | 50 |
| Sprechen | 100 |
| Deneme | 20 |

Veri: `data/goethe/a1/` · UI: `/exam`
