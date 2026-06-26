"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconLinkedIn, NavIcon, type NavIconKey } from "@/components/icons";
import { APP_NAME, APP_VERSION } from "@/lib/brand";
import { SITE_LINKEDIN_URL } from "@/lib/site";

type NavItem = {
  href: string;
  label: string;
  icon: NavIconKey;
  title?: string;
};

const PRIMARY_LINKS: NavItem[] = [
  { href: "/", label: "Panel", icon: "panel" },
  { href: "/cards", label: "Kart", icon: "cards" },
  { href: "/review", label: "Tekrar", icon: "review" },
  { href: "/listen", label: "Dinle", icon: "listen" },
  { href: "/konus-dinle", label: "Konuş", icon: "konusDinle", title: "Konuş-Dinle" },
  { href: "/speak", label: "Sınıf", icon: "speak" },
  { href: "/exam", label: "Sınav", icon: "exam" },
];

const MORE_LINKS: NavItem[] = [
  { href: "/ozellikler", label: "Özellikler", icon: "list" },
  { href: "/harita", label: "Harita", icon: "list" },
  { href: "/mesleki", label: "Mesleki", icon: "mesleki" },
  { href: "/words", label: "Liste", icon: "list" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      title={item.title}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-goethe-blue text-white shadow-sm"
          : "text-sage-600 hover:bg-white hover:text-goethe-blue"
      }`}
    >
      <NavIcon name={item.icon} size={16} className={active ? "text-white" : undefined} />
      {item.label}
    </Link>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const moreActive = MORE_LINKS.some((l) => isActive(pathname, l.href));

  useEffect(() => {
    if (!moreOpen) return;
    const close = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [moreOpen]);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-40 border-b border-goethe-blue/10 bg-cream-50/98 shadow-sm backdrop-blur-md"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2.5 sm:px-4 lg:gap-4 lg:py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/brand/logo-mark.svg"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg"
            priority
          />
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-bold leading-tight text-goethe-blue">{APP_NAME}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-sage-500">
              A1 Hazırlık · {APP_VERSION}
            </p>
          </div>
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex"
          aria-label="Ana menü"
        >
          {PRIMARY_LINKS.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}

          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition ${
                moreActive || moreOpen
                  ? "bg-goethe-blue/10 text-goethe-blue"
                  : "text-sage-600 hover:bg-white hover:text-goethe-blue"
              }`}
            >
              <NavIcon name="list" size={16} />
              Daha fazla
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-[calc(100%+0.35rem)] z-50 min-w-[11rem] rounded-xl border border-sage-100 bg-white p-1.5 shadow-lg">
                {MORE_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive(pathname, item.href)
                        ? "bg-goethe-blue text-white"
                        : "text-sage-700 hover:bg-sage-50"
                    }`}
                  >
                    <NavIcon
                      name={item.icon}
                      size={16}
                      className={isActive(pathname, item.href) ? "text-white" : undefined}
                    />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <a
            href={SITE_LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-full text-sage-500 transition hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
          >
            <IconLinkedIn size={18} />
          </a>

          <Link
            href="/"
            className="rounded-full bg-goethe-blue px-3.5 py-2 text-sm font-semibold text-white lg:hidden"
          >
            Panel
          </Link>
        </div>
      </div>
    </header>
  );
}
