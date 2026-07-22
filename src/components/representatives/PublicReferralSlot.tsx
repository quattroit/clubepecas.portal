"use client";

import { usePathname } from "next/navigation";

import { ActiveReferralBanner } from "@/components/representatives/ActiveReferralBanner";

function PublicReferralSlot() {
  const pathname = usePathname();
  const hideOnReferralLanding = pathname?.startsWith("/r/");

  if (hideOnReferralLanding) return null;

  return <ActiveReferralBanner className="mb-6" />;
}

export { PublicReferralSlot };
