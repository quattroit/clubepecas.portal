import type { TrackAnalyticsEventRequest } from "@/contracts/analytics/requests";
import { api } from "@/lib/api";
import { getAnalyticsSessionId } from "@/lib/analytics/session";

/**
 * Debounce in-memory para evitar duplicata de StrictMode / re-renders.
 * Janela curta: permite recontar ao revisitar após alguns segundos.
 */
const recentKeys = new Map<string, number>();
const DEDUPE_WINDOW_MS = 2000;

function shouldSkip(key: string): boolean {
  const now = Date.now();
  const last = recentKeys.get(key);
  if (last !== undefined && now - last < DEDUPE_WINDOW_MS) {
    return true;
  }
  recentKeys.set(key, now);
  return false;
}

function getDocumentReferrer(): string | null {
  if (typeof document === "undefined") return null;
  const value = document.referrer?.trim();
  return value && value.length > 0 ? value : null;
}

/**
 * Dispara um evento de analytics sem bloquear a UI.
 * Falhas são engolidas — o marketplace nunca depende disso.
 */
export function trackAnalyticsEvent(
  payload: Omit<TrackAnalyticsEventRequest, "sessionId" | "referer"> & {
    sessionId?: string | null;
    referer?: string | null;
    /** Chave opcional para dedupe (ex.: view por slug). */
    dedupeKey?: string;
  },
): void {
  if (typeof window === "undefined") return;

  const { dedupeKey, ...body } = payload;
  if (dedupeKey && shouldSkip(dedupeKey)) {
    return;
  }

  const request: TrackAnalyticsEventRequest = {
    eventType: body.eventType,
    listingSlug: body.listingSlug ?? null,
    storeSlug: body.storeSlug ?? null,
    sessionId: body.sessionId ?? getAnalyticsSessionId(),
    referer: body.referer ?? getDocumentReferrer(),
  };

  void api
    .post("/api/v1/analytics/events", request, {
      timeout: 5_000,
      // Não dispara fluxo de toast/redirect em falhas de analytics
      validateStatus: () => true,
    })
    .catch(() => {
      // Ignora — analytics nunca deve quebrar a UX
    });
}
