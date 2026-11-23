"use client";

import { useMemo } from "react";

import { useAdvertisements } from "@/hooks/api/useAdvertisements";
import { useCategories } from "@/hooks/api/useCategories";
import type {
  MarketplaceListFilters,
  PublicMarketplaceList,
} from "@/lib/public-marketplace";
import { findCategoryBySlug } from "@/mappers/category.mapper";
import type { Category } from "@/types/Category";
import { PUBLIC_LISTING_DEFAULT_PAGE_SIZE } from "@/utils/public-listing-pagination";

type UseCategoryOptions = {
  initialCategories?: Category[];
  initialCategoriesUpdatedAt?: number;
  initialAdvertisements?: PublicMarketplaceList;
  initialAdvertisementsUpdatedAt?: number;
  initialListingFilters?: MarketplaceListFilters;
};

/**
 * Detalhe de categoria por slug + anúncios filtrados na API (categorySlug).
 * Reutiliza useCategories (catálogo) e useAdvertisements (marketplace.list).
 */
export function useCategory(slug: string, options?: UseCategoryOptions) {
  const categoriesQuery = useCategories({
    initialData: options?.initialCategories,
    initialDataUpdatedAt: options?.initialCategoriesUpdatedAt,
  });

  const category = useMemo(
    () =>
      slug && categoriesQuery.data
        ? findCategoryBySlug(categoriesQuery.data, slug)
        : undefined,
    [categoriesQuery.data, slug],
  );

  const categoryExists = Boolean(category);
  const listingFilters: MarketplaceListFilters = slug
    ? {
        categorySlug: slug,
        page: 1,
        pageSize: PUBLIC_LISTING_DEFAULT_PAGE_SIZE,
        sort: "recent",
      }
    : {
        page: 1,
        pageSize: PUBLIC_LISTING_DEFAULT_PAGE_SIZE,
        sort: "recent",
      };

  const advertisementsQuery = useAdvertisements(listingFilters, {
    enabled: Boolean(slug) && categoryExists,
    initialData: options?.initialAdvertisements,
    initialDataUpdatedAt: options?.initialAdvertisementsUpdatedAt,
    initialDataFilters: options?.initialListingFilters,
  });

  return {
    category,
    categoryExists,
    advertisements: advertisementsQuery.data?.items ?? [],
    total: advertisementsQuery.data?.total ?? 0,
    page: advertisementsQuery.data?.page ?? 1,
    totalPages: advertisementsQuery.data?.totalPages ?? 1,
    categories: categoriesQuery.data ?? [],
    isLoading:
      categoriesQuery.isLoading ||
      (categoryExists && advertisementsQuery.isLoading),
    isError: categoriesQuery.isError || advertisementsQuery.isError,
    error: categoriesQuery.error ?? advertisementsQuery.error,
  };
}
