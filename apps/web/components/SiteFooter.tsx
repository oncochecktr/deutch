import Link from "next/link";
import { SiteSocialLinks } from "@/components/SiteSocialLinks";
import { SITE_TAGLINE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-sage-100 bg-cream-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-5 text-center">
        <div>
          <p className="text-sm font-bold text-goethe-blue">German Coach</p>
          <p className="mt-1 text-sm text-sage-500">germancoach.app · {SITE_TAGLINE}</p>
        </div>

        <SiteSocialLinks variant="buttons" />

        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-sage-500">
          <Link href="/ozellikler" className="hover:text-goethe-blue">
            Tüm özellikler
          </Link>
          <Link href="/grundlagen/roadmap" className="hover:text-goethe-blue">
            Gramer haritası
          </Link>
          <Link href="/blog" className="hover:text-goethe-blue">
            Blog
          </Link>
          <Link href="/sitemap.xml" className="hover:text-goethe-blue">
            Site haritası
          </Link>
          <Link href="/iletisim" className="hover:text-goethe-blue">
            İletişim
          </Link>
          <Link href="/ayarlar" className="hover:text-goethe-blue">
            AI API ayarları
          </Link>
        </nav>

        <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-sage-400">
          <Link href="/gizlilik" className="hover:text-goethe-blue">
            Gizlilik
          </Link>
          <Link href="/kvkk" className="hover:text-goethe-blue">
            KVKK
          </Link>
          <Link href="/cerez" className="hover:text-goethe-blue">
            Çerez
          </Link>
          <Link href="/kullanim-kosullari" className="hover:text-goethe-blue">
            Kullanım koşulları
          </Link>
        </nav>

        <p className="text-xs text-sage-400">
          Timur Sadullayev · Almanca eğitim platformu
        </p>
      </div>
    </footer>
  );
}
