"use client";

import { useMemo } from "react";

import type { AdvertisementCategory } from "@/contracts/common/enums";
import { useAdvertisements } from "@/hooks/api/useAdvertisements";
import { useCategories } from "@/hooks/api/useCategories";
import {
  getCategoryBySlug,
  getCategoryEnumBySlug,
} from "@/mappers/category.mapper";

/**
 * Detalhe de categoria por slug + anúncios filtrados na API.
 * Reutiliza useCategories (cache enum) e useAdvertisements (marketplace.list).
 */
export function useCategory(slug: string) {
  const categoryEnum = useMemo(
    () => (slug ? getCategoryEnumBySlug(slug) : undefined),
    [slug],
  );

  const category = useMemo(
    () => (slug ? getCategoryBySlug(slug) : undefined),
    [slug],
  );

  const categoriesQuery = useCategories();
  const advertisementsQuery = useAdvertisements(
    categoryEnum !== undefined
      ? { category: categoryEnum as AdvertisementCategory, page: 1 }
      : { page: 1 },
    { enabled: categoryEnum !== undefined },
  );

  return {
    category,
    categoryExists: categoryEnum !== undefined,
    advertisements: advertisementsQuery.data?.items ?? [],
    total: advertisementsQuery.data?.total ?? 0,
    page: advertisementsQuery.data?.page ?? 1,
    totalPages: advertisementsQuery.data?.totalPages ?? 1,
    categories: categoriesQuery.data ?? [],
    isLoading:
      (categoryEnum !== undefined && advertisementsQuery.isLoading) ||
      categoriesQuery.isLoading,
    isError: categoriesQuery.isError || advertisementsQuery.isError,
    error: categoriesQuery.error ?? advertisementsQuery.error,
  };
}
