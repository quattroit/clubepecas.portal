"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdminCategoriesListParams } from "@/contracts/admin/categories";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { adminService } from "@/services/admin.service";

/**
 * Listagem administrativa de categorias (uma requisição — sem paginação).
 */
export function useAdminCategories(params: AdminCategoriesListParams = {}) {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.admin.categories.list(
      params as Record<string, unknown>,
    ),
    queryFn: () => adminService.listCategories(params),
    enabled: authReady,
    retry: false,
    placeholderData: (previous) => previous,
  });
}
