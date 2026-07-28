"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { loadPublicStores } from "@/lib/loadPublicStores";

/**
 * Listagem pública de lojas (GET /api/v1/sellers).
 */
export function useStores() {
  return useQuery({
    queryKey: queryKeys.marketplace.stores,
    queryFn: loadPublicStores,
    staleTime: 60_000,
  });
}
