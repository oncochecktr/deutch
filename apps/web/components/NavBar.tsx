"use client";



import Link from "next/link";

import { usePathname } from "next/navigation";

import { IconLinkedIn, NavIcon, type NavIconKey } from "@/components/icons";
import { SITE_LINKEDIN_URL } from "@/lib/site";



const links: { href: string; label: string; icon: NavIconKey }[] = [

  { href: "/", label: "Panel", icon: "panel" },

  { href: "/cards", label: "Kart", icon: "cards" },

  { href: "/review", label: "Tekrar", icon: "review" },

  { href: "/listen", label: "Dinle", icon: "listen" },

  { href: "/konus-dinle", label: "Konuş-Dinle", icon: "konusDinle" },

  { href: "/speak", label: "Sınıf", icon: "speak" },

  { href: "/exam", label: "Sınav", icon: "exam" },

  { href: "/harita", label: "Harita", icon: "list" },

  { href: "/mesleki", label: "Mesleki", icon: "mesleki" },

  { href: "/words", label: "Liste", icon: "list" },

];



export function NavBar() {

  const pathname = usePathname();



  return (

    <header
      className="sticky top-0 z-40 border-b border-sage-100 bg-cream-50/95 backdrop-blur"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >

      <div className="mx-auto flex max-w-5xl items-center justify-between px-3 py-3 sm:px-4">

        <Link href="/" className="flex items-center gap-2">

          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-goethe-blue text-sm font-bold text-white">

            GC

          </span>

          <div className="hidden sm:block">

            <p className="text-base font-semibold leading-tight text-goethe-blue">German Coach</p>

            <p className="text-label uppercase text-sage-500">A1 Hazırlık v0.8</p>

          </div>

        </Link>

        <nav className="hidden gap-1 lg:flex">

          {links.map((l) => {

            const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));

            return (

              <Link

                key={l.href}

                href={l.href}

                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-base transition ${

                  active

                    ? "bg-sage-100 font-medium text-sage-600"

                    : "text-sage-400 hover:bg-sage-50 hover:text-sage-600"

                }`}

              >

                <NavIcon name={l.icon} size={15} />

                {l.label}

              </Link>

            );

          })}

        </nav>

        <div className="flex items-center gap-2">
          <a
            href={SITE_LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Timur Sadullayev — LinkedIn profili"
            title="LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sage-500 transition hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
          >
            <IconLinkedIn size={18} />
          </a>

          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-goethe-blue lg:hidden"
          >
            Panel
          </Link>
        </div>

      </div>

    </header>

  );

}

