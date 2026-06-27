# German Coach — UI metni ve sürüm özeti

Bu dosya hem geliştiriciler hem de Cursor/AI ajanları için kalıcı referanstır.  
Amaç: arayüzde tutarlı, profesyonel Türkçe; renkli/AI emojisi kullanılmaması; sürüm notlarının tekrarlanabilir biçimde yazılması.

---

## UI metni kuralları

### Emojiler

- **Kullanma:** Renkli emoji (🔊, 📱, ✍️, 💡, 🎤, ⭐, 🚀 vb.) arayüz metninde, banner’larda, butonlarda, ipuçlarında.
- **Kullanma:** “AI slop” hissi veren süsleme (dekoratif emoji listeleri).
- **İzinli:** Metin okları (`→`, `←`) navigasyon/CTA için — projede zaten kullanılıyor.
- **İzinli:** Basit ASCII işaretler gerekiyorsa: `—`, `·`, `*`, `+`, `!` (tek karakter, renksiz).
- **Onay işareti:** `✓` yerine mümkünse metin: “Tamam”, “Doğru”, “Okundu” veya mevcut `Icon`/CSS ile gösterim.

### Ses / ikon

- Ses, mikrofon, uyarı gibi anlamlar için **emoji değil** `@/components/icons` veya kısa Türkçe etiket kullan (`Dinle`, `Dur`, `Dikkat`).

### Banner / kart listeleri

Kötü:

```tsx
<li>🔊 Önce Almanca, sonra Türkçe</li>
```

İyi:

```tsx
<li>Önce Almanca, sonra Türkçe (kadın ses)</li>
// veya
<li>— Ekran kilitli dinleme · kulaklık düğmeleri</li>
```

### Ton

- Türkçe arayüz: net, kısa, eğitim uygulaması tonu.
- Abartılı pazarlama dili ve emoji ile dikkat çekme yok.

---

## Sürüm / özellik özeti şablonu

Yeni özellik veya kullanıcıya görünen değişiklik bitince **commit mesajından önce** kısa özet yaz (emoji yok).

```markdown
## [kısa başlık — ne değişti]

Seviye / modül: (ör. A2 · Hikayeler · Diktat)

Ne:
- Madde 1 — kullanıcı ne görür / ne yapabilir
- Madde 2

Teknik (isteğe bağlı, kısa):
- Dosya veya modül adı

Test:
- [ ] Masaüstü
- [ ] Mobil
- [ ] Ekran kilitli dinleme (varsa)
```

### Commit mesajı

- İngilizce, emojisiz, imperative: `Add story listen mode with DE-TR playback.`
- Gövde: 1–2 cümle “neden”.

### PR / deploy notu (kullanıcıya)

- 3–5 madde, emoji yok.
- Link ver: `/dialogues?id=…` gibi tam yol.

---

## Yeni hikaye / ses içeriği eklerken

1. Ham transkripti temizle (marka/reklam satırlarını çıkar, isimleri düzelt).
2. `data/dialogues/*.json` — `text_de` + `text_tr`, isteğe bağlı `audio_de` / `audio_tr`.
3. Almanca ses: `de-DE-KatjaNeural` · Türkçe: **yalnızca kadın** (`tr-TR-EmelNeural`, yedek `FilizNeural`).
4. `node scripts/generate-story-audio.mjs --story <id> --resume`
5. Ana sayfada banner: **emoji listesi yok**; `HomeStoryBanner` stiline uy.

---

## Kontrol listesi (PR öncesi)

- [ ] Yeni UI metninde emoji yok
- [ ] Türkçe TTS erkek ses fallback yok (`ttsConfig.ts`)
- [ ] `npm run build` (apps/web) geçiyor
- [ ] Mobil dokunma hedefleri yeterli (buton yüksekliği)

---

## Sürüm geçmişi (kısa)

| Tarih | Özet |
|-------|------|
| 2026-06 | Hikaye dinle: Easy German market A2, DE→TR MP3, ekran kilitli, dinle-yaz |
| 2026-06 | Diktat: Akıllı tekrar düzeltmeleri, Kelime sekmesi, otomatik ses kaldırıldı |

Yeni satır ekle — emoji kullanma.
