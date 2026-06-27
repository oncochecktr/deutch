# German Coach — UI metni ve sürüm özeti

Bu dosya hem geliştiriciler hem de Cursor/AI ajanları için kalıcı referanstır.  
Amaç: arayüzde tutarlı, profesyonel Türkçe; renkli/AI emojisi kullanılmaması; sürüm notlarının tekrarlanabilir biçimde yazılması.

---

## UI metni kuralları

### Emojiler

- **Kullanma:** Renkli emoji (🔊, 📱, ✍️, 💡, 🎤, ⭐, 🚀 vb.) arayüz metninde, banner’larda, butonlarda, ipuçlarında.
- **Kullanma:** “AI slop” hissi veren süsleme (dekoratif emoji listeleri).
- **Kullanma:** Cinsiyet vurgusu: “kadın ses”, “erkek ses”, “bay/bayan seslendirme” vb. Arayüzde ses tanımı yapma — sadece **Dinle · Yaz · Öğren** gibi eylem odaklı metin.
- **İzinli:** Basit ASCII işaretler gerekiyorsa: `—`, `·`, `*`, `+`, `!` (tek karakter, renksiz).
- **İzinli:** Metin okları (`→`, `←`) navigasyon/CTA için — projede zaten kullanılıyor.

### Ses / ikon

- Ses, mikrofon, uyarı gibi anlamlar için **emoji değil** `@/components/icons` veya kısa Türkçe etiket kullan (`Dinle`, `Dur`, `Dikkat`).

### Banner / kart listeleri

Kötü:

```tsx
<li>🔊 Önce Almanca, sonra Türkçe</li>
```

İyi:

```tsx
<li><strong>Dinle</strong> — önce Almanca, sonra Türkçe</li>
<li><strong>Yaz</strong> — duyduğunu kontrol et</li>
<li><strong>Öğren</strong> — ekran kilitli dinleme</li>
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
3. `node scripts/generate-story-audio.mjs --story <id> --resume` (ses profili teknik ayardır — arayüzde belirtme).
4. Ana sayfada banner: emoji yok, cinsiyet etiketi yok; `HomeStoryBanner` (Dinle · Yaz · Öğren).

---

## Kontrol listesi (PR öncesi)

- [ ] Yeni UI metninde emoji ve cinsiyet/ses tipi etiketi yok
- [ ] `npm run build` (apps/web) geçiyor
- [ ] Mobil dokunma hedefleri yeterli (buton yüksekliği)

---

## Sürüm geçmişi (kısa)

| Tarih | Özet |
|-------|------|
| 2026-06 | Hikaye dinle: Easy German market A2, DE→TR MP3, ekran kilitli, dinle-yaz |
| 2026-06 | Diktat: Akıllı tekrar düzeltmeleri, Kelime sekmesi, otomatik ses kaldırıldı |

Yeni satır ekle — emoji kullanma.
