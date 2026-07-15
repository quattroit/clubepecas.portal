"use client";

import { useQuery } from "@tanstack/react-query";

import { mapCategoryEnumToCategory } from "@/mappers/category.mapper";
import { queryKeys } from "@/lib/queryKeys";
import { categoryService } from "@/services/category.service";

/**
 * Catálogo de categorias (enum AdvertisementCategory via categoryService).
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const categories = await categoryService.listCategories();
      return categories.map((category) => mapCategoryEnumToCategory(category));
    },
    staleTime: Infinity,
  });
}
