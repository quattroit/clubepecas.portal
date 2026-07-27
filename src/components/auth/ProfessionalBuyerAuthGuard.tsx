"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageLoader } from "@/components/feedback/PageLoader";
import { useAuth } from "@/components/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";
import { UserRole } from "@/contracts/common/enums";
import { buildLoginPathWithNext } from "@/lib/announce-flow";

type ProfessionalBuyerAuthGuardProps = {
  children: React.ReactNode;
};

/**
 * Protege a área do comprador profissional — exige Role = ProfessionalBuyer.
 */
function ProfessionalBuyerAuthGuard({
  children,
}: ProfessionalBuyerAuthGuardProps) {
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
      return;
    }

    if (user?.role === UserRole.Seller) {
      toast.message("Acesse o painel do vendedor para continuar.");
      router.replace(ROUTES.DASHBOARD);
      return;
    }

    if (user?.role !== UserRole.ProfessionalBuyer) {
      toast.error("Acesso restrito a compradores profissionais.");
      router.replace(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router, user?.role]);

  if (isLoading || !isAuthenticated) {
    return <PageLoader label="Verificando sessão…" />;
  }

  if (user?.role !== UserRole.ProfessionalBuyer) {
    return <PageLoader label="Redirecionando…" />;
  }

  return children;
}

export { ProfessionalBuyerAuthGuard };
