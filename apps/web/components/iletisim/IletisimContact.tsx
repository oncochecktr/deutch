"use client";

import { IconLinkedIn, IconMail, IconWhatsApp } from "@/components/icons";
import {
  SITE_EMAIL,
  SITE_LINKEDIN_URL,
  SITE_WHATSAPP_URL,
} from "@/lib/site";

const TOPICS = [
  {
    label: "Genel soru",
    subject: "German Coach — Genel",
    desc: "Platform, hesap ve teknik konular",
  },
  {
    label: "Öneri",
    subject: "German Coach — Öneri",
    desc: "Geri bildirim ve iyileştirme fikirleri",
  },
  {
    label: "İş birliği",
    subject: "German Coach — İş birliği",
    desc: "Kurumsal ve ortaklık talepleri",
  },
] as const;

export function IletisimContact() {
  const whatsappText = encodeURIComponent("Merhaba, German Coach hakkında yazmak istiyorum.");

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-goethe-blue/15 bg-white shadow-sm">
        <div className="bg-goethe-blue px-6 py-8 text-white sm:px-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-gold">
            German Coach
          </p>
          <h2 className="mt-2 text-2xl font-bold">İletişim</h2>
          <p className="mt-2 max-w-lg text-sm text-white/80">
            Almanca öğrenme platformu ile ilgili sorularınız, önerileriniz ve iş birliği
            talepleriniz için aşağıdaki kanallardan bize ulaşabilirsiniz.
          </p>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-6">
          {TOPICS.map((topic) => (
            <a
              key={topic.subject}
              href={`mailto:${SITE_EMAIL}?subject=${encodeURIComponent(topic.subject)}`}
              className="group rounded-xl border border-sage-100 bg-cream-50/50 p-4 transition hover:border-goethe-blue/25 hover:bg-white hover:shadow-sm"
            >
              <p className="font-semibold text-goethe-blue group-hover:underline">{topic.label}</p>
              <p className="mt-1 text-sm leading-snug text-sage-500">{topic.desc}</p>
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-sage-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sage-400">
              Doğrudan kanallar
            </p>
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="mt-1 block text-sm font-medium text-goethe-blue hover:underline"
            >
              {SITE_EMAIL}
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-lg bg-goethe-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <IconMail size={16} />
              E-posta gönder
            </a>
            <a
              href={`${SITE_WHATSAPP_URL}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-sage-200 bg-white px-4 py-2.5 text-sm font-semibold text-sage-700 transition hover:border-emerald-300 hover:text-emerald-800"
            >
              <IconWhatsApp size={16} />
              WhatsApp
            </a>
            <a
              href={SITE_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-sage-200 bg-white px-4 py-2.5 text-sm font-semibold text-sage-700 transition hover:border-[#0A66C2]/40 hover:text-[#0A66C2]"
            >
              <IconLinkedIn size={16} />
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-sage-400">
        Yanıt süresi genelde 1–2 iş günüdür. Türkçe veya Almanca yazabilirsiniz.
      </p>
    </div>
  );
}
