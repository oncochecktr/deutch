import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { BottomNav } from "@/components/BottomNav";
import { BreakReminder } from "@/components/BreakReminder";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { ScrollRestoration } from "@/components/ScrollRestoration";
import { WelcomeIntro } from "@/components/WelcomeIntro";
import { APP_NAME, APP_TAGLINE, EXAM_LABEL_DESC } from "@/lib/brand";
import { SITE_KEYWORDS, SITE_URL, SITE_TAGLINE } from "@/lib/site";
import { ProgressProvider } from "@/lib/ProgressContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1a3a5c",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description: `${SITE_TAGLINE}. ${EXAM_LABEL_DESC} — kelime, gramer yol haritası, sınav simülasyonu. 3–6 ayda A1 hedefi.`,
  keywords: SITE_KEYWORDS,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — ${SITE_TAGLINE}`,
    description: EXAM_LABEL_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: SITE_TAGLINE,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "German Coach",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <ProgressProvider>
          <AppErrorBoundary>
            <ScrollRestoration />
            <NavBar />
            <main className="app-main mx-auto w-full max-w-5xl px-3 py-4 sm:px-4 sm:py-5">{children}</main>
            <BottomNav />
            <footer className="border-t border-sage-100 bg-cream-50 py-6 text-center text-xs text-sage-500">
              <p className="font-semibold text-goethe-blue">German Coach · germancoach.app</p>
              <p className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
                <a href="/grundlagen/roadmap" className="hover:text-goethe-blue">
                  Gramer haritası
                </a>
                <a href="/blog" className="hover:text-goethe-blue">
                  Blog
                </a>
                <a href="/iletisim" className="hover:text-goethe-blue">
                  İletişim
                </a>
                <a href="/ayarlar" className="hover:text-goethe-blue">
                  API ayarları
                </a>
              </p>
            </footer>
            <BreakReminder />
            <WelcomeIntro />
          </AppErrorBoundary>
        </ProgressProvider>
      </body>
    </html>
  );
}
