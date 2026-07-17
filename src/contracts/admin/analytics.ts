import type {
  AdminActivityItemDto,
  MetricsPeriodParam,
} from "@/contracts/admin/dashboard";

export type { MetricsPeriodParam };

/** TrafficSource enum (backend) — LinkedIn agregado em Other na API. */
export const TrafficSource = {
  Direct: 1,
  Google: 2,
  Bing: 3,
  Instagram: 4,
  Facebook: 5,
  WhatsApp: 6,
  LinkedIn: 7,
  Other: 8,
} as const;

export type TrafficSourceValue =
  (typeof TrafficSource)[keyof typeof TrafficSource];

export type AdminAnalyticsResponse = {
  period: number;
  fromUtc: string | null;
  toUtc: string;
  previousFromUtc: string | null;
  previousToUtc: string | null;
  hasData: boolean;
  hasComparison: boolean;
  summary: AdminAnalyticsSummaryDto;
  topStores: AdminAnalyticsStoreRankDto[];
  topListings: AdminAnalyticsListingRankDto[];
  topCategories: AdminAnalyticsCategoryRankDto[];
  topCities: AdminAnalyticsCityRankDto[];
  trafficSources: AdminAnalyticsTrafficSourceDto[];
  conversion: AdminAnalyticsConversionDto;
  recentActivity: AdminActivityItemDto[];
};

export type AdminAnalyticsSummaryDto = {
  newSellers: number;
  newSellersChangePercent: number | null;
  newAdvertisements: number;
  newAdvertisementsChangePercent: number | null;
  views: number;
  viewsChangePercent: number | null;
  whatsappClicks: number;
  whatsappClicksChangePercent: number | null;
  conversionRate: number | null;
  /** Diferença em pontos percentuais vs período anterior. */
  conversionRateChangePercent: number | null;
  onlineSellers: number;
  activeStores: number;
  citiesServed: number;
};

export type AdminAnalyticsStoreRankDto = {
  id: string;
  storeName: string;
  slug: string;
  city: string;
  state: string;
  advertisementCount: number;
  views: number;
  whatsappClicks: number;
  conversionRate: number | null;
};

export type AdminAnalyticsListingRankDto = {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  sellerId: string;
  storeName: string;
  categoryId: string;
  categoryName: string;
  views: number;
  whatsappClicks: number;
  conversionRate: number | null;
};

export type AdminAnalyticsCategoryRankDto = {
  categoryId: string;
  categoryName: string;
  advertisementCount: number;
  views: number;
  whatsappClicks: number;
  conversionRate: number | null;
};

export type AdminAnalyticsCityRankDto = {
  city: string;
  state: string;
  storeCount: number;
  advertisementCount: number;
  views: number;
  whatsappClicks: number;
  conversionRate: number | null;
};

export type AdminAnalyticsTrafficSourceDto = {
  source: TrafficSourceValue;
  label: string;
  events: number;
  percent: number;
};

export type AdminAnalyticsConversionDto = {
  overallRate: number | null;
  byStore: AdminAnalyticsStoreRankDto[];
  byCategory: AdminAnalyticsCategoryRankDto[];
  byCity: AdminAnalyticsCityRankDto[];
};
