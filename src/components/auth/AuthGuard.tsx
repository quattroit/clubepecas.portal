"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageLoader } from "@/components/feedback/PageLoader";
import { useAuth } from "@/components/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";

type AuthGuardProps = {
  children: React.ReactNode;
};

/**
 * Protege rotas autenticadas — redireciona para /login.
 */
function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <PageLoader label="Verificando sessão…" />;
  }

  return children;
}

export { AuthGuard };
