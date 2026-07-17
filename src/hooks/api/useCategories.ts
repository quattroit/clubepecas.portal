"use client";

import { useQuery } from "@tanstack/react-query";

import { mapCategoryItemsToCategories } from "@/mappers/category.mapper";
import { queryKeys } from "@/lib/queryKeys";
import { categoryService } from "@/services/category.service";

/**
 * Catálogo público de categorias (GET /api/v1/categories).
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const response = await categoryService.listCategories();
      return mapCategoryItemsToCategories(response.items);
    },
    staleTime: 60_000,
  });
}
