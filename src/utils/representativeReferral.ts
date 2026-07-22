import { ReferralService } from "@/services/referral.service";

/**
 * Helpers de URL pública + compatibilidade com APIs da Sprint 10.3.
 * Persistência: usar apenas ReferralService / useReferral.
 */

export function buildRepresentativePublicPath(code: string): string {
  return `/r/${encodeURIComponent(code.trim().toUpperCase())}`;
}

export function buildRepresentativePublicUrl(code: string, siteUrl?: string): string {
  const base =
    (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${buildRepresentativePublicPath(code)}`;
}

/** @deprecated Use ReferralService via useReferral */
export function saveRepresentativeReferral(code: string) {
  const result = ReferralService.save(code, { force: true });
  return {
    representativeCode: result.payload.representativeCode,
    capturedAt: result.payload.capturedAt,
  };
}

/** @deprecated Use ReferralService via useReferral */
export function clearRepresentativeReferral(): void {
  ReferralService.clear();
}

/** @deprecated Use ReferralService via useReferral */
export function getRepresentativeReferral(): {
  representativeCode: string;
  capturedAt: string;
} | null {
  const payload = ReferralService.peek();
  if (!payload) return null;
  return {
    representativeCode: payload.representativeCode,
    capturedAt: payload.capturedAt,
  };
}

export { ReferralSettings } from "@/config/referralSettings";
export {
  ReferralService,
  type ReferralStoragePayload,
} from "@/services/referral.service";
