export const COOKIE_CONSENT_STORAGE_KEY = "cp_cookie_consent";
export const COOKIE_CONSENT_VERSION = 1;
export const OPEN_COOKIE_PREFERENCES_EVENT = "cp:open-cookie-preferences";

export type CookieConsentPreferences = {
  analytics: boolean;
  marketing: boolean;
};

export type CookieConsentState = CookieConsentPreferences & {
  version: number;
  decidedAt: string;
};

export const DEFAULT_COOKIE_PREFERENCES: CookieConsentPreferences = {
  analytics: false,
  marketing: false,
};

export function readCookieConsent(): CookieConsentState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<CookieConsentState>;
    if (
      typeof parsed.version !== "number" ||
      parsed.version !== COOKIE_CONSENT_VERSION ||
      typeof parsed.decidedAt !== "string" ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.marketing !== "boolean"
    ) {
      return null;
    }

    return {
      version: COOKIE_CONSENT_VERSION,
      decidedAt: parsed.decidedAt,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
    };
  } catch {
    return null;
  }
}

export function writeCookieConsent(
  preferences: CookieConsentPreferences,
): CookieConsentState {
  const next: CookieConsentState = {
    version: COOKIE_CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    analytics: preferences.analytics,
    marketing: preferences.marketing,
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        COOKIE_CONSENT_STORAGE_KEY,
        JSON.stringify(next),
      );
    } catch {
      // Ignora falha de storage (modo privado / quota).
    }
  }

  return next;
}

export function hasAnalyticsConsent(): boolean {
  return readCookieConsent()?.analytics === true;
}

export function hasMarketingConsent(): boolean {
  return readCookieConsent()?.marketing === true;
}

export function openCookiePreferences(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
}
