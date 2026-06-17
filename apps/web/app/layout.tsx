import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { BottomNav } from "@/components/BottomNav";
import { BreakReminder } from "@/components/BreakReminder";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { ScrollRestoration } from "@/components/ScrollRestoration";
import { WelcomeIntro } from "@/components/WelcomeIntro";
import { APP_NAME, APP_TAGLINE, EXAM_LABEL_DESC } from "@/lib/brand";
import { ProgressProvider } from "@/lib/ProgressContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1a3a5c",
};

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description: `${EXAM_LABEL_DESC} — kelime, gramer, sınav simülasyonu`,
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
            <BreakReminder />
            <WelcomeIntro />
          </AppErrorBoundary>
        </ProgressProvider>
      </body>
    </html>
  );
}
