"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { clearAnalyticsSessionId } from "@/lib/analytics/session";
import {
  DEFAULT_COOKIE_PREFERENCES,
  OPEN_COOKIE_PREFERENCES_EVENT,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentPreferences,
  type CookieConsentState,
} from "@/lib/cookie-consent";

type CookieConsentContextValue = {
  /** False até ler o localStorage no cliente (evita flash SSR). */
  ready: boolean;
  /** Null enquanto o usuário não decidiu. */
  consent: CookieConsentState | null;
  preferencesOpen: boolean;
  setPreferencesOpen: (open: boolean) => void;
  acceptAll: () => void;
  acceptEssentialOnly: () => void;
  savePreferences: (preferences: CookieConsentPreferences) => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

function applyConsentSideEffects(preferences: CookieConsentPreferences) {
  if (!preferences.analytics) {
    clearAnalyticsSessionId();
  }
}

function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<CookieConsentState | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    setConsent(readCookieConsent());
    setReady(true);
  }, []);

  useEffect(() => {
    const onOpen = () => setPreferencesOpen(true);
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, onOpen);
    return () => {
      window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, onOpen);
    };
  }, []);

  const persist = useCallback((preferences: CookieConsentPreferences) => {
    const next = writeCookieConsent(preferences);
    applyConsentSideEffects(preferences);
    setConsent(next);
    setPreferencesOpen(false);
  }, []);

  const acceptAll = useCallback(() => {
    persist({ analytics: true, marketing: true });
  }, [persist]);

  const acceptEssentialOnly = useCallback(() => {
    persist({ ...DEFAULT_COOKIE_PREFERENCES });
  }, [persist]);

  const savePreferences = useCallback(
    (preferences: CookieConsentPreferences) => {
      persist(preferences);
    },
    [persist],
  );

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      ready,
      consent,
      preferencesOpen,
      setPreferencesOpen,
      acceptAll,
      acceptEssentialOnly,
      savePreferences,
    }),
    [
      ready,
      consent,
      preferencesOpen,
      acceptAll,
      acceptEssentialOnly,
      savePreferences,
    ],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

function useCookieConsent(): CookieConsentContextValue {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsent deve ser usado dentro de CookieConsentProvider.",
    );
  }
  return context;
}

export { CookieConsentProvider, useCookieConsent };
