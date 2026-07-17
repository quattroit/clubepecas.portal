"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageLoader } from "@/components/feedback/PageLoader";
import { useAuth } from "@/components/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";
import { UserRole } from "@/contracts/common/enums";
import { buildLoginPathWithNext } from "@/lib/announce-flow";

type AuthGuardProps = {
  children: React.ReactNode;
};

/**
 * Protege a área do vendedor — exige autenticação e Role = Seller.
 */
function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const currentPath =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "";
      router.replace(buildLoginPathWithNext(currentPath));
      return;
    }

    if (user?.role === UserRole.Administrator) {
      toast.message("Acesse a área administrativa para continuar.");
      router.replace(ROUTES.ADMIN);
    }
  }, [isAuthenticated, isLoading, router, user?.role]);

  if (isLoading || !isAuthenticated) {
    return <PageLoader label="Verificando sessão…" />;
  }

  if (user?.role === UserRole.Administrator) {
    return <PageLoader label="Redirecionando…" />;
  }

  return children;
}

export { AuthGuard };
