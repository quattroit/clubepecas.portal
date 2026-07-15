"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { loadPublicStores } from "@/lib/loadPublicStores";

/**
 * Listagem pública de lojas.
 * Backend não expõe GET /sellers — composição via marketplace + sellerService.
 */
export function useStores() {
  return useQuery({
    queryKey: queryKeys.marketplace.stores,
    queryFn: loadPublicStores,
  });
}
