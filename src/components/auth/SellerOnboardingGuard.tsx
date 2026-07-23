"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { PageLoader } from "@/components/feedback/PageLoader";
import { useCurrentSellerSubscription } from "@/hooks/api/useCurrentSellerSubscription";
import { useSeller } from "@/hooks/api/useSeller";
import { resolveSellerOnboardingRedirect } from "@/lib/seller-onboarding";

type SellerOnboardingGuardProps = {
  children: React.ReactNode;
};

/**
 * Exige perfil de loja antes de qualquer outra tela do painel,
 * e plano (ACTIVE/PENDING) antes do restante (exceto perfil e meu plano).
 */
function SellerOnboardingGuard({ children }: SellerOnboardingGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const sellerQuery = useSeller();
  const subscriptionQuery = useCurrentSellerSubscription();

  const sellerFailed = sellerQuery.isError;
  const hasSeller = sellerFailed
    ? null
    : sellerQuery.isPending || sellerQuery.isLoading
      ? null
      : sellerQuery.data != null;

  const hasPlan =
    sellerFailed || hasSeller === false
      ? false
      : hasSeller === null ||
          subscriptionQuery.isPending ||
          subscriptionQuery.isLoading
        ? null
        : subscriptionQuery.isError
          ? false
          : subscriptionQuery.data != null;

  const redirectTo = sellerFailed
    ? null
    : resolveSellerOnboardingRedirect({
        pathname,
        hasSeller,
        hasPlan,
      });

  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);

  if (sellerFailed) {
    return children;
  }

  if (hasSeller === null || (hasSeller && hasPlan === null) || redirectTo) {
    return <PageLoader label="Preparando seu painel…" />;
  }

  return children;
}

export { SellerOnboardingGuard };
