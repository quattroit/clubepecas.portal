"use client";

import { usePathname } from "next/navigation";

import { ActiveReferralBanner } from "@/components/representatives/ActiveReferralBanner";
import { ROUTES } from "@/constants/routes";

/**
 * Exibe o banner "Indicado por" apenas na escolha de plano (/planos).
 * Em demais telas públicas o banner fica oculto.
 */
function PublicReferralSlot() {
  const pathname = usePathname();

  if (pathname !== ROUTES.PLANS) {
    return null;
  }

  return <ActiveReferralBanner className="mb-6" />;
}

export { PublicReferralSlot };
