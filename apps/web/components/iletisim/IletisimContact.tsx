"use client";

import { useState } from "react";
import { IconMail, IconWhatsApp } from "@/components/icons";
import {
  SITE_EMAIL,
  SITE_WHATSAPP_DISPLAY,
  SITE_WHATSAPP_URL,
} from "@/lib/site";

const CONTACTS = [
  { label: "Genel iletişim", subject: "German Coach — Genel" },
  { label: "Öneri ve geri bildirim", subject: "German Coach — Öneri" },
  { label: "İş birliği", subject: "German Coach — İş birliği" },
  { label: "Bağış / destek", subject: "German Coach — Bağış" },
] as const;

type Channel = "email" | "whatsapp";

export function IletisimContact() {
  const [channel, setChannel] = useState<Channel>("email");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_17rem] lg:items-start">
      <div>
        {channel === "email" ? (
          <ul className="space-y-3">
            {CONTACTS.map((c) => (
              <li key={c.label}>
                <a
                  href={`mailto:${SITE_EMAIL}?subject=${encodeURIComponent(c.subject)}`}
                  className="card-soft flex items-center justify-between gap-3 p-4 transition hover:border-goethe-blue/30"
                >
                  <span className="font-semibold text-goethe-blue">{c.label}</span>
                  <span className="text-right text-sm text-sage-500">{SITE_EMAIL}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="card-soft space-y-4 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <IconWhatsApp size={24} />
              </span>
              <div>
                <p className="font-semibold text-goethe-blue">WhatsApp ile yazın</p>
                <p className="text-sm text-sage-500">{SITE_WHATSAPP_DISPLAY}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-sage-600">
              Sorularınız, önerileriniz veya iş birliği teklifleriniz için doğrudan mesaj
              gönderebilirsiniz. Türkçe veya Almanca yazabilirsiniz.
            </p>
            <a
              href={`${SITE_WHATSAPP_URL}?text=${encodeURIComponent("Merhaba, German Coach hakkında yazmak istiyorum.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <IconWhatsApp size={18} />
              WhatsApp&apos;ta aç
            </a>
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-24">
        <div className="card-soft p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-sage-400">
            İletişim kanalı
          </p>
          <div className="mt-3 flex rounded-xl border border-sage-200 bg-sage-50 p-1">
            <button
              type="button"
              onClick={() => setChannel("email")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-semibold transition ${
                channel === "email"
                  ? "bg-white text-goethe-blue shadow-sm"
                  : "text-sage-500 hover:text-sage-700"
              }`}
            >
              <IconMail size={14} />
              E-posta
            </button>
            <button
              type="button"
              onClick={() => setChannel("whatsapp")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-semibold transition ${
                channel === "whatsapp"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-sage-500 hover:text-sage-700"
              }`}
            >
              <IconWhatsApp size={14} />
              WhatsApp
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-sage-500">
            {channel === "email"
              ? "Konuya göre e-posta şablonu seçin."
              : "Hızlı yanıt için WhatsApp tercih edin."}
          </p>
        </div>
      </aside>
    </div>
  );
}
