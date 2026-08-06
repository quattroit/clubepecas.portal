"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/components/providers/AuthProvider";
import { UserRole } from "@/contracts/common/enums";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/**
 * Configuração de Frete Local do vendedor autenticado.
 */
export function useSellerLocalDelivery() {
  const authReady = useAuthQueryEnabled();
  const { user } = useAuth();
  const isSeller = user?.role === UserRole.Seller;

  return useQuery({
    queryKey: queryKeys.seller.localDelivery,
    enabled: authReady && isSeller,
    queryFn: () => sellerService.getLocalDelivery(),
  });
}
