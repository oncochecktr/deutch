import Link from "next/link";
import { SiteSocialLinks } from "@/components/SiteSocialLinks";
import { SITE_TAGLINE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-sage-100 bg-cream-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-5 text-center">
        <div>
          <p className="text-sm font-bold text-goethe-blue">German Coach</p>
          <p className="mt-1 text-xs text-sage-500">germancoach.app · {SITE_TAGLINE}</p>
        </div>

        <SiteSocialLinks variant="buttons" />

        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-sage-500">
          <Link href="/grundlagen/roadmap" className="hover:text-goethe-blue">
            Gramer haritası
          </Link>
          <Link href="/blog" className="hover:text-goethe-blue">
            Blog
          </Link>
          <Link href="/iletisim" className="hover:text-goethe-blue">
            İletişim
          </Link>
          <Link href="/ayarlar" className="hover:text-goethe-blue">
            AI API ayarları
          </Link>
        </nav>

        <p className="text-[10px] text-sage-400">
          Timur Sadullayev · Almanca eğitim platformu
        </p>
      </div>
    </footer>
  );
}
