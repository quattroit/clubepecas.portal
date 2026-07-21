import type { AnalyticsEventType } from "@/contracts/analytics/enums";

/** POST /api/v1/analytics/events */
export type TrackAnalyticsEventRequest = {
  eventType: AnalyticsEventType;
  listingSlug?: string | null;
  storeSlug?: string | null;
  sessionId?: string | null;
  referer?: string | null;
};

export type TrackAnalyticsEventResponse = {
  id: number;
  occurredAt: string;
};
