import type { AdvertisementStatus } from "@/contracts/common/enums";
import type { MetricsPeriodParam } from "@/contracts/seller/metrics";

/** Reexport — mesmo contrato de período do painel do vendedor. */
export type { MetricsPeriodParam };

/** Tipos de atividade recente (alinhados ao enum do backend). */
export const AdminActivityType = {
  NewSeller: 1,
  NewAdvertisement: 2,
  ProfileUpdated: 3,
  PasswordChanged: 4,
  StoreShared: 5,
  WhatsappClicked: 6,
  PasswordResetRequested: 7,
  ListingViewed: 8,
  StoreViewed: 9,
} as const;

export type AdminActivityTypeValue =
  (typeof AdminActivityType)[keyof typeof AdminActivityType];

export type AdminDashboardResponse = {
  period: number;
  fromUtc: string | null;
  toUtc: string;
  hasData: boolean;
  summary: AdminDashboardSummaryDto;
  bestStore: AdminBestStoreDto | null;
  bestListing: AdminBestListingDto | null;
  recentSellers: AdminRecentSellerDto[];
  recentAdvertisements: AdminRecentAdvertisementDto[];
  recentActivity: AdminActivityItemDto[];
};

export type AdminDashboardSummaryDto = {
  totalSellers: number;
  activeStores: number;
  totalAdvertisements: number;
  categories: number;
  views: number;
  whatsappClicks: number;
  /** Percentual 0–100; null quando não há visualizações. */
  conversionRate: number | null;
  citiesServed: number;
  onlineSellers: number;
};

export type AdminBestStoreDto = {
  id: number;
  storeName: string;
  slug: string;
  city: string;
  state: string;
  advertisementCount: number;
  views: number;
  whatsappClicks: number;
  conversionRate: number | null;
};

export type AdminBestListingDto = {
  id: number;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  storeName: string;
  storeSlug: string;
  categoryId: number;
  categoryName: string;
  views: number;
  whatsappClicks: number;
  conversionRate: number | null;
};

export type AdminRecentSellerDto = {
  id: number;
  storeName: string;
  slug: string;
  city: string;
  state: string;
  createdAt: string;
  isActive: boolean;
  /** Placeholder até monetização — sempre "Básico" na V1. */
  plan: string;
};

export type AdminRecentAdvertisementDto = {
  id: number;
  slug: string;
  title: string;
  storeName: string;
  categoryId: number;
  categoryName: string;
  status: AdvertisementStatus;
  publishedAt: string;
};

export type AdminActivityItemDto = {
  type: AdminActivityTypeValue;
  title: string;
  description: string;
  occurredAt: string;
  entityId: number | null;
  href: string | null;
};
