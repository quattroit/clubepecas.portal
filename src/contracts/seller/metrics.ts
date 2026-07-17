/** Período de métricas — query `period` em GET /api/v1/seller/me/metrics */
export type MetricsPeriodParam = "7d" | "30d" | "90d" | "all";

export type SellerDashboardMetricsResponse = {
  period: number;
  fromUtc: string | null;
  toUtc: string;
  hasData: boolean;
  store: MetricGroupDto;
  listings: MetricGroupDto;
  topListings: ListingMetricItemDto[];
  bestListing: ListingMetricItemDto | null;
};

export type MetricGroupDto = {
  views: number;
  whatsappClicks: number;
  /** Percentual 0–100; null quando não há visualizações. */
  conversionRate: number | null;
};

export type ListingMetricItemDto = {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  views: number;
  whatsappClicks: number;
  conversionRate: number | null;
};
