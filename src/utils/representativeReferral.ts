/**
 * Persistência temporária da indicação via LocalStorage (Sprint 10.3).
 * Cookies entram na Sprint 10.4.
 */

export const REPRESENTATIVE_REFERRAL_STORAGE_KEY = "representativeCode";

export const REPRESENTATIVE_REFERRAL_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type RepresentativeReferral = {
  representativeCode: string;
  /** ISO date string da captura/atualização */
  capturedAt: string;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function saveRepresentativeReferral(code: string): RepresentativeReferral {
  const normalized = code.trim().toUpperCase();
  const referral: RepresentativeReferral = {
    representativeCode: normalized,
    capturedAt: new Date().toISOString(),
  };

  if (canUseStorage()) {
    window.localStorage.setItem(
      REPRESENTATIVE_REFERRAL_STORAGE_KEY,
      JSON.stringify(referral),
    );
  }

  return referral;
}

export function clearRepresentativeReferral(): void {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(REPRESENTATIVE_REFERRAL_STORAGE_KEY);
}

/**
 * Lê a indicação salva. Remove automaticamente se expirada ou inválida.
 */
export function getRepresentativeReferral(): RepresentativeReferral | null {
  if (!canUseStorage()) return null;

  const raw = window.localStorage.getItem(REPRESENTATIVE_REFERRAL_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<RepresentativeReferral>;
    const code = parsed.representativeCode?.trim().toUpperCase();
    const capturedAt = parsed.capturedAt;

    if (!code || !capturedAt) {
      clearRepresentativeReferral();
      return null;
    }

    const capturedMs = Date.parse(capturedAt);
    if (Number.isNaN(capturedMs)) {
      clearRepresentativeReferral();
      return null;
    }

    if (Date.now() - capturedMs > REPRESENTATIVE_REFERRAL_TTL_MS) {
      clearRepresentativeReferral();
      return null;
    }

    return {
      representativeCode: code,
      capturedAt,
    };
  } catch {
    clearRepresentativeReferral();
    return null;
  }
}

export function buildRepresentativePublicPath(code: string): string {
  return `/r/${encodeURIComponent(code.trim().toUpperCase())}`;
}

export function buildRepresentativePublicUrl(code: string, siteUrl?: string): string {
  const base =
    (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${buildRepresentativePublicPath(code)}`;
}
