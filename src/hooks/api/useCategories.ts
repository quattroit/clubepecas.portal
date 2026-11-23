"use client";

import { useQuery } from "@tanstack/react-query";

import { mapCategoryItemsToCategories } from "@/mappers/category.mapper";
import { queryKeys } from "@/lib/queryKeys";
import { categoryService } from "@/services/category.service";
import type { Category } from "@/types/Category";

type UseCategoriesOptions = {
  initialData?: Category[];
  initialDataUpdatedAt?: number;
};

/**
 * Catálogo público de categorias (GET /api/v1/categories).
 * `initialData` só é usado pela página de categoria. Os demais chamadores
 * continuam sem semente.
 */
export function useCategories(options?: UseCategoriesOptions) {
  const initialData = options?.initialData;

  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const response = await categoryService.listCategories();
      return mapCategoryItemsToCategories(response.items);
    },
    staleTime: 60_000,
    initialData,
    initialDataUpdatedAt: initialData
      ? options?.initialDataUpdatedAt
      : undefined,
  });
}
