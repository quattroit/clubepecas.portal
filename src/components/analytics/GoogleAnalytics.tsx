"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";

/** ID de medição GA4 de produção. */
export const GA_MEASUREMENT_ID = "G-QCBE95RH8G";

const GA_DISABLE_PROPERTY = `ga-disable-${GA_MEASUREMENT_ID}`;
const GTAG_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

type GtagFn = (...args: unknown[]) => void;

type GaWindow = Window & {
  dataLayer?: unknown[];
  gtag?: GtagFn;
} & Record<string, unknown>;

/** Sobrevive ao remount do Strict Mode — evita config/pageview duplicados. */
let gaConfigured = false;
let lastSentPath: string | null = null;

function getGaWindow(): GaWindow {
  return window as unknown as GaWindow;
}

function isLocalHostname(hostname: string): boolean {
  return (
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"
  );
}

/**
 * GA4 só sobe em build de produção e fora de hosts locais.
 */
export function shouldEnableGoogleAnalytics(hostname: string): boolean {
  if (process.env.NODE_ENV !== "production") {
    return false;
  }
  return !isLocalHostname(hostname);
}

function subscribeNoop(): () => void {
  return () => {};
}

function getRuntimeEnabledSnapshot(): boolean {
  return shouldEnableGoogleAnalytics(window.location.hostname);
}

function getServerRuntimeEnabledSnapshot(): boolean {
  return false;
}

function ensureGtagQueue(): GtagFn {
  const w = getGaWindow();
  w.dataLayer = w.dataLayer ?? [];
  if (typeof w.gtag !== "function") {
    w.gtag = function gtag(...args: unknown[]) {
      w.dataLayer!.push(args);
    };
  }
  return w.gtag;
}

function setCollectionDisabled(disabled: boolean): void {
  getGaWindow()[GA_DISABLE_PROPERTY] = disabled;
}

function revokeGoogleAnalytics(): void {
  lastSentPath = null;
  setCollectionDisabled(true);
  const w = getGaWindow();
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", { analytics_storage: "denied" });
  }
}

function grantGoogleAnalytics(): void {
  setCollectionDisabled(false);
  const gtag = ensureGtagQueue();
  gtag("consent", "update", { analytics_storage: "granted" });

  if (!gaConfigured) {
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false,
    });
    gaConfigured = true;
  }
}

/**
 * Mantém só origem + pathname. Remove query, fragment e tokens.
 */
function toOriginAndPath(url: string): string | null {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return null;
  }
}

function sanitizeDocumentReferrer(): string | null {
  const raw = document.referrer?.trim();
  if (!raw) {
    return null;
  }
  return toOriginAndPath(raw);
}

function trackPageView(pathname: string): void {
  if (!pathname || lastSentPath === pathname) {
    return;
  }
  lastSentPath = pathname;

  const pagePath = window.location.pathname || pathname;
  const payload: Record<string, string> = {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: document.title,
  };

  const pageReferrer = sanitizeDocumentReferrer();
  if (pageReferrer) {
    payload.page_referrer = pageReferrer;
  }

  ensureGtagQueue()("event", "page_view", payload);
}

/**
 * Carrega gtag.js e pageviews somente com consentimento de analytics,
 * em produção fora de localhost. Independente do analytics próprio.
 */
function GoogleAnalytics() {
  const { ready, consent } = useCookieConsent();
  const pathname = usePathname();
  const runtimeEnabled = useSyncExternalStore(
    subscribeNoop,
    getRuntimeEnabledSnapshot,
    getServerRuntimeEnabledSnapshot,
  );

  const analyticsAllowed = ready && consent?.analytics === true;
  const active = runtimeEnabled && analyticsAllowed;

  useEffect(() => {
    if (!ready || !runtimeEnabled) {
      return;
    }

    if (!analyticsAllowed) {
      revokeGoogleAnalytics();
      return;
    }

    // Fila dataLayer/gtag antes do script remoto — pageviews não dependem do onLoad.
    grantGoogleAnalytics();
    if (pathname) {
      trackPageView(pathname);
    }
  }, [ready, runtimeEnabled, analyticsAllowed, pathname]);

  if (!active) {
    return null;
  }

  return (
    <Script
      id="google-analytics-gtag"
      src={GTAG_SCRIPT_SRC}
      strategy="afterInteractive"
    />
  );
}

export { GoogleAnalytics };
