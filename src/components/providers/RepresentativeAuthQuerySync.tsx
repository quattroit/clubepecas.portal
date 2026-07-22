"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useRepresentativeAuth } from "@/components/providers/RepresentativeAuthProvider";
import {
  invalidateRepresentativeAuthenticatedQueries,
  removeRepresentativeAuthenticatedQueries,
} from "@/lib/auth/authenticatedQueries";

/**
 * Sincroniza o cache do TanStack Query com mudanças de autenticação
 * do representante (sessão independente de vendedor/admin).
 */
function RepresentativeAuthQuerySync() {
  const { representative, isLoading } = useRepresentativeAuth();
  const queryClient = useQueryClient();
  const previousRepresentativeIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const representativeId = representative?.representativeId ?? null;
    const previousRepresentativeId = previousRepresentativeIdRef.current;

    if (representativeId === previousRepresentativeId) return;

    if (representativeId) {
      void invalidateRepresentativeAuthenticatedQueries(queryClient);
    } else if (previousRepresentativeId) {
      removeRepresentativeAuthenticatedQueries(queryClient);
    }

    previousRepresentativeIdRef.current = representativeId;
  }, [representative?.representativeId, isLoading, queryClient]);

  return null;
}

export { RepresentativeAuthQuerySync };
