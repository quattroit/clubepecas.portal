"use client";

import { useEffect } from "react";

import { AnalyticsEventType } from "@/contracts/analytics/enums";
import { trackAnalyticsEvent } from "@/lib/analytics/track";

/**
 * Registra visualização uma vez por carregamento (com dedupe anti-StrictMode).
 */
export function useTrackListingView(listingSlug: string | undefined | null) {
  useEffect(() => {
    const slug = listingSlug?.trim();
    if (!slug) return;

    trackAnalyticsEvent({
      eventType: AnalyticsEventType.ListingViewed,
      listingSlug: slug,
      dedupeKey: `listing-view:${slug}`,
    });
  }, [listingSlug]);
}

/**
 * Registra visualização da loja uma vez por carregamento.
 */
export function useTrackStoreView(storeSlug: string | undefined | null) {
  useEffect(() => {
    const slug = storeSlug?.trim();
    if (!slug) return;

    trackAnalyticsEvent({
      eventType: AnalyticsEventType.StoreViewed,
      storeSlug: slug,
      dedupeKey: `store-view:${slug}`,
    });
  }, [storeSlug]);
}
