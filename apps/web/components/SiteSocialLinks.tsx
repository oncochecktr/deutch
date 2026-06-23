import { IconLinkedIn, IconMail, IconWhatsApp } from "@/components/icons";
import {
  SITE_EMAIL,
  SITE_LINKEDIN_URL,
  SITE_WHATSAPP_DISPLAY,
  SITE_WHATSAPP_URL,
} from "@/lib/site";

type Variant = "inline" | "buttons";

export function SiteSocialLinks({
  variant = "inline",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  if (variant === "buttons") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
        <a
          href={`mailto:${SITE_EMAIL}`}
          className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-medium text-sage-700 transition hover:border-goethe-blue/30 hover:text-goethe-blue"
        >
          <IconMail size={16} />
          E-posta
        </a>
        <a
          href={SITE_LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-medium text-sage-700 transition hover:border-[#0A66C2]/40 hover:text-[#0A66C2]"
        >
          <IconLinkedIn size={16} />
          LinkedIn
        </a>
        <a
          href={SITE_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
        >
          <IconWhatsApp size={16} />
          WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 ${className}`}>
      <a
        href={`mailto:${SITE_EMAIL}`}
        className="inline-flex items-center gap-1.5 transition hover:text-goethe-blue"
      >
        <IconMail size={14} className="opacity-70" />
        {SITE_EMAIL}
      </a>
      <a
        href={SITE_LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 transition hover:text-[#0A66C2]"
      >
        <IconLinkedIn size={14} />
        LinkedIn
      </a>
      <a
        href={SITE_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 transition hover:text-emerald-700"
      >
        <IconWhatsApp size={14} />
        {SITE_WHATSAPP_DISPLAY}
      </a>
    </div>
  );
}
