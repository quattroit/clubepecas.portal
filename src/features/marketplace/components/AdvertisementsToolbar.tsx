"use client";

import { SlidersHorizontal } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  FilterSidebar,
  type FilterOption,
} from "@/features/marketplace/components/FilterSidebar";
import { SearchInput } from "@/features/marketplace/components/SearchInput";
import { cn } from "@/lib/utils";
import type { MarketplaceListingFilters } from "@/utils/marketplace-search";

const SORT_OPTIONS = [
  { value: "recent", label: "Mais recentes" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
] as const;

type AdvertisementsToolbarProps = {
  className?: string;
  /** Valor atual de `?q=` para preencher o campo. */
  searchQuery?: string;
  sort?: string;
  onSortChange?: (sort: string) => void;
  filterValues?: MarketplaceListingFilters;
  filterCategories?: FilterOption[];
  filterBrands?: FilterOption[];
  filterCities?: FilterOption[];
  onApplyFilters?: (filters: MarketplaceListingFilters) => void;
};

/**
 * Barra superior da listagem — busca, filtros (mobile) e ordenação.
 */
function AdvertisementsToolbar({
  className,
  searchQuery = "",
  sort = "recent",
  onSortChange,
  filterValues = {},
  filterCategories,
  filterBrands,
  filterCities,
  onApplyFilters,
}: AdvertisementsToolbarProps) {
  const [open, setOpen] = useState(false);
  const sortId = useId();

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <SearchInput
          key={searchQuery}
          id="advertisements-search"
          defaultValue={searchQuery}
          submitVariant="button"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="default"
                className="lg:hidden"
                aria-label="Abrir filtros"
              />
            }
          >
            <SlidersHorizontal className="size-4" />
            Filtros
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full max-w-sm overflow-y-auto p-0"
          >
            <SheetHeader className="border-border border-b">
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <FilterSidebar
                showTitle={false}
                className="border-0 shadow-none ring-0"
                categories={filterCategories}
                brands={filterBrands}
                cities={filterCities}
                values={filterValues}
                onApply={(next) => {
                  setOpen(false);
                  onApplyFilters?.(next);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial">
          <label
            htmlFor={sortId}
            className="text-small sr-only sm:not-sr-only sm:shrink-0"
          >
            Ordenar por
          </label>
          <select
            id={sortId}
            name="sort"
            value={sort}
            onChange={(event) => onSortChange?.(event.target.value)}
            aria-label="Ordenar anúncios"
            className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 min-w-0 flex-1 rounded-lg border px-2.5 text-sm outline-none focus-visible:ring-3 sm:w-44 sm:flex-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export { AdvertisementsToolbar };
