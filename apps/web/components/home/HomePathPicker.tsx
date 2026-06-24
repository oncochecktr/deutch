"use client";

import Link from "next/link";
import { NavIcon } from "@/components/icons";
import { HOME_INTENTS, type RecommendedIntent } from "@/lib/homeLearningPath";
import type { UserProgress } from "@/lib/progress";
import { nextGrammarHref } from "@/lib/learningPathGrammar";

interface HomePathPickerProps {
  recommended: RecommendedIntent;
  progress: UserProgress;
}

export function HomePathPicker({ recommended, progress }: HomePathPickerProps) {
  return (
    <section>
      <h2 className="text-lg font-bold text-goethe-blue sm:text-xl">Bugün ne yaparsın?</h2>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {HOME_INTENTS.map((intent) => {
          const isRecommended = intent.id === recommended.id;
          const href =
            intent.id === "grammar" ? nextGrammarHref(progress) : intent.href;

          return (
            <Link
              key={intent.id}
              href={href}
              title={isRecommended ? recommended.reason : undefined}
              className={`relative flex flex-col gap-1.5 rounded-xl border p-3 transition active:scale-[0.98] sm:p-3.5 ${
                isRecommended
                  ? "border-goethe-gold/50 bg-goethe-gold/10 shadow-sm"
                  : "border-sage-100 bg-white hover:border-goethe-blue/20 hover:shadow-sm"
              }`}
            >
              {isRecommended && (
                <div className="absolute right-2 top-2 text-right">
                  <span className="block rounded-full bg-goethe-gold px-2 py-0.5 text-[9px] font-bold uppercase text-goethe-blue">
                    Önerilen
                  </span>
                </div>
              )}
              <NavIcon
                name={intent.icon}
                size={22}
                className={isRecommended ? "text-goethe-blue" : "text-sage-500"}
              />
              <div className={isRecommended ? "pr-14" : undefined}>
                <p className="text-sm font-semibold text-goethe-blue">{intent.label}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-sage-500">
                  {isRecommended ? recommended.reason : intent.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
