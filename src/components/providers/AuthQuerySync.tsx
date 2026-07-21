"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useAuth } from "@/components/providers/AuthProvider";
import {
  invalidateAuthenticatedQueries,
  removeAuthenticatedQueries,
} from "@/lib/auth/authenticatedQueries";

/**
 * Sincroniza o cache do TanStack Query com mudanças de autenticação.
 */
function AuthQuerySync() {
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const previousUserIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const userId = user?.userId ?? null;
    const previousUserId = previousUserIdRef.current;

    if (userId === previousUserId) return;

    if (userId) {
      void invalidateAuthenticatedQueries(queryClient);
    } else if (previousUserId) {
      removeAuthenticatedQueries(queryClient);
    }

    previousUserIdRef.current = userId;
  }, [user?.userId, isLoading, queryClient]);

  return null;
}

export { AuthQuerySync };
