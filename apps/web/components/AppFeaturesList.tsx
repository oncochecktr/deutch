"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { NavIcon } from "@/components/icons";
import {
  APP_FEATURE_CATEGORIES,
  APP_FEATURES,
  type AppFeatureCategory,
} from "@/lib/appFeatures";

interface AppFeaturesListProps {
  /** Başlangıçta seçili kategori; boş = tümü */
  initialCategory?: AppFeatureCategory | "all";
  compact?: boolean;
}

export function AppFeaturesList({
  initialCategory = "all",
  compact = false,
}: AppFeaturesListProps) {
  const [category, setCategory] = useState<AppFeatureCategory | "all">(initialCategory);

  const filtered = useMemo(() => {
    if (category === "all") return APP_FEATURES;
    return APP_FEATURES.filter((f) => f.category === category);
  }, [category]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={category === "all"}
          onClick={() => setCategory("all")}
          label={`Tümü (${APP_FEATURES.length})`}
        />
        {APP_FEATURE_CATEGORIES.map((c) => {
          const count = APP_FEATURES.filter((f) => f.category === c.id).length;
          return (
            <FilterChip
              key={c.id}
              active={category === c.id}
              onClick={() => setCategory(c.id)}
              label={`${c.label} (${count})`}
            />
          );
        })}
      </div>

      {category !== "all" && (
        <p className="text-sm text-sage-600">
          {APP_FEATURE_CATEGORIES.find((c) => c.id === category)?.description}
        </p>
      )}

      <div className={compact ? "space-y-2" : "space-y-6"}>
        {category === "all"
          ? APP_FEATURE_CATEGORIES.map((cat) => {
              const items = APP_FEATURES.filter((f) => f.category === cat.id);
              if (items.length === 0) return null;
              return (
                <section key={cat.id}>
                  <h2 className="mb-2 text-sm font-bold text-goethe-blue">{cat.label}</h2>
                  <FeatureGrid items={items} compact={compact} />
                </section>
              );
            })
          : (
              <FeatureGrid items={filtered} compact={compact} />
            )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-goethe-blue bg-goethe-blue text-white"
          : "border-sage-200 bg-white text-sage-600 hover:border-goethe-blue/40"
      }`}
    >
      {label}
    </button>
  );
}

function FeatureGrid({
  items,
  compact,
}: {
  items: typeof APP_FEATURES;
  compact?: boolean;
}) {
  return (
    <ul className={`grid gap-2 ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}>
      {items.map((feature) => (
        <li key={feature.id}>
          <Link
            href={feature.href}
            className="card-soft group flex items-start gap-3 border border-sage-100 p-4 transition hover:border-goethe-blue/35 hover:shadow-sm"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-goethe-blue/10 text-goethe-blue transition group-hover:bg-goethe-blue group-hover:text-white">
              <NavIcon name={feature.icon} size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-goethe-blue">{feature.title}</p>
                {feature.badge && (
                  <span className="rounded-full bg-goethe-gold/20 px-2 py-0.5 text-[10px] font-bold text-goethe-blue">
                    {feature.badge}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-sage-600">{feature.description}</p>
            </div>
            <span className="shrink-0 self-center text-sage-300 transition group-hover:text-goethe-blue">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
