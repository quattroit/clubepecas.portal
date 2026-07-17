"use client";

import type { LucideIcon } from "lucide-react";
import { createElement } from "react";
import { FolderOpen, Package, Store } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useHomeStats } from "@/hooks/api/useHomeStats";
import { formatHomeStatValue } from "@/mappers/home-stats.mapper";

const HERO_STAT_META: {
  key: "activeListings" | "activeStores" | "categories";
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "activeListings", label: "Peças anunciadas", icon: Package },
  { key: "activeStores", label: "Lojas ativas", icon: Store },
  { key: "categories", label: "Categorias", icon: FolderOpen },
];

/**
 * Faixa de indicadores do Hero — dados via GET /api/v1/home/stats.
 * Em erro: mantém layout com "—" (não quebra a Home).
 */
function HeroStats() {
  const statsQuery = useHomeStats();

  if (statsQuery.isLoading) {
    return (
      <ul
        className="grid grid-cols-3 gap-5 px-6 py-7 sm:gap-6 sm:px-10 sm:py-8 md:px-12 lg:px-14"
        aria-busy="true"
        aria-label="Carregando indicadores"
      >
        {HERO_STAT_META.map(({ label }) => (
          <li key={label} className="flex items-center gap-3 text-left">
            <Skeleton className="bg-brand-foreground/15 size-10 shrink-0 rounded-xl" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="bg-brand-foreground/20 h-4 w-16" />
              <Skeleton className="bg-brand-foreground/10 h-3 w-24" />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  const stats = statsQuery.data;
  const showPlaceholder = statsQuery.isError || !stats;

  return (
    <ul
      className="grid grid-cols-3 gap-5 px-6 py-7 sm:gap-6 sm:px-10 sm:py-8 md:px-12 lg:px-14"
      aria-label="Indicadores do marketplace"
    >
      {HERO_STAT_META.map(({ key, label, icon }) => {
        const raw = showPlaceholder ? null : stats[key];
        const value =
          raw === null || raw === undefined ? "—" : formatHomeStatValue(raw);

        return (
          <li key={label} className="flex items-center gap-3 text-left">
            <span
              className="border-primary/40 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl border"
              aria-hidden
            >
              {createElement(icon, { className: "size-5" })}
            </span>
            <div className="min-w-0">
              <p className="text-base font-semibold text-brand-foreground tabular-nums">
                {value}
              </p>
              <p className="text-brand-muted text-xs sm:text-sm">{label}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export { HeroStats };
