import type { Metadata, Viewport } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { BottomNav } from "@/components/BottomNav";
import { BreakReminder } from "@/components/BreakReminder";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { ScrollRestoration } from "@/components/ScrollRestoration";
import { WelcomeIntro } from "@/components/WelcomeIntro";
import { APP_NAME, APP_TAGLINE, EXAM_LABEL_DESC } from "@/lib/brand";
import { SITE_KEYWORDS, SITE_URL, SITE_TAGLINE } from "@/lib/site";
import { SiteFooter } from "@/components/SiteFooter";
import { ProgressProvider } from "@/lib/ProgressContext";

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-source-sans",
});

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
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${APP_NAME} — ${SITE_TAGLINE}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: SITE_TAGLINE,
    images: ["/opengraph-image"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "German Coach",
  },
  formatDetection: {
    telephone: false,
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={sourceSans.variable}>
      <body className={sourceSans.className}>
        <ProgressProvider>
          <AppErrorBoundary>
            <ScrollRestoration />
            <NavBar />
            <main className="app-main mx-auto w-full max-w-5xl px-3 py-4 sm:px-4 sm:py-5">{children}</main>
            <BottomNav />
            <SiteFooter />
            <BreakReminder />
            <WelcomeIntro />
          </AppErrorBoundary>
        </ProgressProvider>
      </body>
    </html>
  );
}
