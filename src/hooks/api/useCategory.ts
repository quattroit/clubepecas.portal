"use client";

import { useMemo } from "react";

import { useAdvertisements } from "@/hooks/api/useAdvertisements";
import { useCategories } from "@/hooks/api/useCategories";
import { findCategoryBySlug } from "@/mappers/category.mapper";
import { PUBLIC_LISTING_DEFAULT_PAGE_SIZE } from "@/utils/public-listing-pagination";

/**
 * Detalhe de categoria por slug + anúncios filtrados na API (categorySlug).
 * Reutiliza useCategories (catálogo) e useAdvertisements (marketplace.list).
 */
export function useCategory(slug: string) {
  const categoriesQuery = useCategories();

  const category = useMemo(
    () =>
      slug && categoriesQuery.data
        ? findCategoryBySlug(categoriesQuery.data, slug)
        : undefined,
    [categoriesQuery.data, slug],
  );

  const categoryExists = Boolean(category);

  const advertisementsQuery = useAdvertisements(
    slug
      ? { categorySlug: slug, page: 1, pageSize: PUBLIC_LISTING_DEFAULT_PAGE_SIZE, sort: "recent" }
      : { page: 1, pageSize: PUBLIC_LISTING_DEFAULT_PAGE_SIZE, sort: "recent" },
    { enabled: Boolean(slug) && categoryExists },
  );

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
