"use client";

import Link from "next/link";

const GUIDE_CARDS = [
  {
    label: "Eğitim",
    title: "Öğrenime devam et",
    body: "Almanca ilerledikçe Ausbildung, üniversite ve Weiterbildung rotaları daha net görünür.",
    note: "A1 bugün, rota yarın.",
    href: "/ogrenime-devam",
    badge: null,
  },
  {
    label: "Plan",
    title: "Öğrenci yol haritası",
    body: "Seviye, belge, başvuru, finans ve konaklama adımlarını sıraya koy.",
    note: "İlk taslağı gör.",
    href: "/rehber/ogrenci-yol-haritasi",
    badge: "Yakında",
  },
  {
    label: "Uyum",
    title: "Göçün yol haritası",
    body: "Dil, meslek, denklik, şehir seçimi ve ilk resmi kayıtları küçük adımlara böl.",
    note: "İlk taslağı gör.",
    href: "/rehber/goc-yol-haritasi",
    badge: "Yakında",
  },
];

export function HomeGermanyGuideCards() {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2 px-1">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-goethe-gold">
            Almanya rehberi
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-goethe-blue">Dil çalışırken yolunu da netleştir</h2>
        </div>
        <p className="max-w-sm text-sm text-sage-500">
          Koçluk kartları bilgiyi parçalara böler; önce dili, sonra hedefi büyütür.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {GUIDE_CARDS.map((card, index) => (
          <Link
            key={card.title}
            href={card.href}
            className="card-soft group flex min-h-[170px] flex-col justify-between border border-white/10 p-4 shadow-[0_14px_40px_rgba(3,24,28,0.22)] transition hover:-translate-y-0.5 hover:border-goethe-gold/45"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-goethe-gold/18 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-goethe-blue">
                    {card.label}
                  </span>
                  {card.badge && (
                    <span className="rounded-full bg-[#ddf4ff] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#0f5f8f]">
                      {card.badge}
                    </span>
                  )}
                </div>
                <span className="grid size-8 place-items-center rounded-full bg-sage-100 text-sm font-extrabold text-goethe-blue">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-goethe-blue">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-sage-600">{card.body}</p>
            </div>
            <p className="mt-4 text-sm font-bold text-goethe-blue">{card.note} →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
