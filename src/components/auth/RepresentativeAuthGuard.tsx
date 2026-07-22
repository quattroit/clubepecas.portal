"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageLoader } from "@/components/feedback/PageLoader";
import { useRepresentativeAuth } from "@/components/providers/RepresentativeAuthProvider";
import { ROUTES } from "@/constants/routes";

type RepresentativeAuthGuardProps = {
  children: React.ReactNode;
};

/**
 * Protege o portal do representante — sessão própria, independente de
 * vendedor/admin (Sprint 10.6).
 */
function RepresentativeAuthGuard({ children }: RepresentativeAuthGuardProps) {
  const { isAuthenticated, isLoading } = useRepresentativeAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const currentPath =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "";
      const next = currentPath
        ? `?next=${encodeURIComponent(currentPath)}`
        : "";
      router.replace(`${ROUTES.REPRESENTATIVE_LOGIN}${next}`);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <PageLoader label="Verificando sessão…" />;
  }

  return children;
}

export { RepresentativeAuthGuard };
