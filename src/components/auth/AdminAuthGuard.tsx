"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageLoader } from "@/components/feedback/PageLoader";
import { useAuth } from "@/components/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";
import { UserRole } from "@/contracts/common/enums";
import { buildAdminLoginPathWithNext } from "@/lib/announce-flow";

type AdminAuthGuardProps = {
  children: React.ReactNode;
};

/**
 * Protege a área administrativa — exige autenticação e Role = Administrator.
 */
function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const warnedRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const currentPath =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "";
      router.replace(buildAdminLoginPathWithNext(currentPath));
      return;
    }

    if (user?.role !== UserRole.Administrator) {
      if (!warnedRef.current) {
        warnedRef.current = true;
        toast.error(
          "Acesso restrito a administradores. Faça login na área administrativa.",
        );
      }
      router.replace(ROUTES.LOGIN_ADMIN);
    }
  }, [isAuthenticated, isLoading, router, user?.role]);

  if (isLoading || !isAuthenticated) {
    return <PageLoader label="Verificando sessão…" />;
  }

  if (user?.role !== UserRole.Administrator) {
    return <PageLoader label="Redirecionando…" />;
  }

  return children;
}

export { AdminAuthGuard };
