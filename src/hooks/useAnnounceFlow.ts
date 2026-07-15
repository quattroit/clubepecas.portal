"use client";

import { useCallback, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";
import {
  getAnnounceLoginPath,
  resolveAuthenticatedAnnouncePath,
} from "@/lib/announce-flow";
import { NotFoundError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { mapSellerMeToSeller } from "@/mappers/seller.mapper";
import { sellerService } from "@/services/seller.service";

function isSellerNotFound(error: unknown): boolean {
  if (!(error instanceof NotFoundError)) return false;
  if (error.code === "seller.not_found") return true;
  return error.errors.some((item) => item.code === "seller.not_found");
}

/**
 * Navegação do CTA "Anunciar Peça" — autenticação + perfil de vendedor.
 */
export function useAnnounceFlow() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigatingRef = useRef(false);

  const goToAnnounce = useCallback(async () => {
    if (isAuthLoading || navigatingRef.current) return;

    if (!isAuthenticated) {
      router.push(getAnnounceLoginPath());
      return;
    }

    navigatingRef.current = true;
    setIsNavigating(true);
    try {
      const cached = queryClient.getQueryData(queryKeys.seller.me);
      let hasSeller: boolean;

      if (cached !== undefined) {
        hasSeller = cached !== null;
      } else {
        const seller = await queryClient.fetchQuery({
          queryKey: queryKeys.seller.me,
          queryFn: async () => {
            try {
              const dto = await sellerService.getMe();
              return mapSellerMeToSeller(dto);
            } catch (error) {
              if (isSellerNotFound(error)) return null;
              throw error;
            }
          },
        });
        hasSeller = seller !== null;
      }

      router.push(resolveAuthenticatedAnnouncePath(hasSeller));
    } catch {
      router.push(resolveAuthenticatedAnnouncePath(false));
    } finally {
      navigatingRef.current = false;
      setIsNavigating(false);
    }
  }, [isAuthLoading, isAuthenticated, queryClient, router]);

  return {
    goToAnnounce,
    isPending: isAuthLoading || isNavigating,
  };
}
