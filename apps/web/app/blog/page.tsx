import Link from "next/link";
import { PageShell } from "@/components/PageShell";

const POSTS = [
  {
    slug: "sifirdan-goethe-a1",
    title: "Sıfırdan Goethe A1: 3–6 ayda mümkün mü?",
    excerpt:
      "Hiç Almanca bilmeyen biri günde 30–60 dakika ile 3–6 ayda A1 sınavına hazırlanabilir mi? Gerçekçi bir yol haritası.",
  },
  {
    slug: "der-die-das-rehber",
    title: "Der, die, das: Türk öğrenciler için rehber",
    excerpt:
      "Almancanın en çok kullanılan kuralı artikeller. İlk gün öğrenmeniz gereken der/die/das mantığı.",
  },
  {
    slug: "almanya-3-6-ay",
    title: "Almanya'ya gitmeden önce: 3–6 ay planı",
    excerpt:
      "İş, eğitim veya göç için Almanya hedefleyenler için A1 hazırlık takvimi ve günlük rutin.",
  },
];

export default function BlogIndexPage() {
  return (
    <PageShell
      title="Blog"
      subtitle="Almanca öğrenme rehberleri — sıfırdan A1"
      backHref="/"
      maxWidth="lg"
    >
      <ul className="space-y-4">
        {POSTS.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="card-soft block p-5 transition hover:border-goethe-blue/30"
            >
              <h2 className="text-lg font-bold text-goethe-blue">{post.title}</h2>
              <p className="mt-2 text-sm text-sage-600">{post.excerpt}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-goethe-blue">
                Oku →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-sm text-sage-500">
        <Link href="/grundlagen/roadmap" className="font-semibold text-goethe-blue underline">
          Gramer yol haritasına git →
        </Link>
      </p>
    </PageShell>
  );
}
