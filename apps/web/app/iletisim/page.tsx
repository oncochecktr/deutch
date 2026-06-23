import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SITE_EMAIL } from "@/lib/site";

const CONTACTS = [
  {
    label: "Genel iletişim",
    email: SITE_EMAIL,
    subject: "German Coach — Genel",
  },
  {
    label: "Öneri ve geri bildirim",
    email: SITE_EMAIL,
    subject: "German Coach — Öneri",
  },
  {
    label: "İş birliği",
    email: SITE_EMAIL,
    subject: "German Coach — İş birliği",
  },
  {
    label: "Bağış / destek",
    email: SITE_EMAIL,
    subject: "German Coach — Bağış",
  },
];

export default function IletisimPage() {
  return (
    <PageShell
      title="İletişim"
      subtitle="Sorularınız, önerileriniz ve iş birlikleri"
      backHref="/"
      maxWidth="md"
    >
      <p className="mb-6 text-sm text-sage-600">
        German Coach açık kaynaklı bir öğrenme platformudur. Aşağıdaki konularda bize
        yazabilirsiniz.
      </p>
      <ul className="space-y-3">
        {CONTACTS.map((c) => (
          <li key={c.label}>
            <a
              href={`mailto:${c.email}?subject=${encodeURIComponent(c.subject)}`}
              className="card-soft flex items-center justify-between p-4 transition hover:border-goethe-blue/30"
            >
              <span className="font-semibold text-goethe-blue">{c.label}</span>
              <span className="text-sm text-sage-500">{c.email}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-sm text-sage-500">
        <Link href="/grundlagen/roadmap" className="text-goethe-blue underline">
          Gramer yol haritası
        </Link>
        {" · "}
        <Link href="/blog" className="text-goethe-blue underline">
          Blog
        </Link>
      </p>
    </PageShell>
  );
}
