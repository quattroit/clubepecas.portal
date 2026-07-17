"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";

/**
 * Destino dos CTAs de planos (sem checkout nesta sprint).
 * Autenticado → Meu Plano; visitante → Cadastro.
 */
export function usePlanCtaHref(): string {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? ROUTES.MY_PLAN : ROUTES.REGISTER;
}
