"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/components/providers/AuthProvider";
import { UserRole } from "@/contracts/common/enums";
import { NotFoundError } from "@/lib/errors";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { mapSellerMeToSeller } from "@/mappers/seller.mapper";
import { sellerService } from "@/services/seller.service";

function isSellerNotFound(error: unknown): boolean {
  if (!(error instanceof NotFoundError)) return false;

  if (error.code === "seller.not_found") return true;

  return error.errors.some((item) => item.code === "seller.not_found");
}

/**
 * Perfil de vendedor do usuário autenticado.
 * Só consulta a API quando o role é Seller (evita 403 para comprador/admin).
 * `seller.not_found` → data: null (fluxo normal, sem ErrorMessage).
 */
export function useSeller() {
  const authReady = useAuthQueryEnabled();
  const { user } = useAuth();
  const isSeller = user?.role === UserRole.Seller;

  return useQuery({
    queryKey: queryKeys.seller.me,
    enabled: authReady && isSeller,
    queryFn: async () => {
      try {
        const dto = await sellerService.getMe();
        return mapSellerMeToSeller(dto);
      } catch (error) {
        if (isSellerNotFound(error)) {
          return null;
        }
        throw error;
      }
    },
  });
}
