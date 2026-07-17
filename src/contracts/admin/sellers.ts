import type { AdvertisementStatus } from "@/contracts/common/enums";
import type { MetricsPeriodParam } from "@/contracts/seller/metrics";

export type { MetricsPeriodParam };

/** Planos — alinhados ao enum AdminSellerPlan do backend. */
export const AdminSellerPlan = {
  Basic: 1,
  Intermediate: 2,
  Premium: 3,
} as const;

export type AdminSellerPlanValue =
  (typeof AdminSellerPlan)[keyof typeof AdminSellerPlan];

export type AdminSellerStatusFilter = "all" | "active" | "inactive";
export type AdminSellerPlanFilter =
  | "all"
  | "basic"
  | "intermediate"
  | "premium";

export type AdminSellerSortParam =
  | "name"
  | "createdAt"
  | "lastAccess"
  | "advertisementCount"
  | "views"
  | "conversion";

export type AdminSellerSortDir = "asc" | "desc";

export type AdminSellersListParams = {
  q?: string;
  status?: AdminSellerStatusFilter;
  plan?: AdminSellerPlanFilter;
  city?: string;
  state?: string;
  createdFrom?: string;
  createdTo?: string;
  lastAccessFrom?: string;
  lastAccessTo?: string;
  sort?: AdminSellerSortParam;
  sortDir?: AdminSellerSortDir;
  page?: number;
  pageSize?: number;
};

export type AdminSellersListResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  items: AdminSellerListItemDto[];
};

export type AdminSellerListItemDto = {
  id: string;
  displayName: string;
  storeName: string;
  slug: string;
  city: string;
  state: string;
  email: string;
  whatsApp: string;
  createdAt: string;
  lastAccessAt: string | null;
  advertisementCount: number;
  views: number;
  whatsappClicks: number;
  conversionRate: number | null;
  plan: AdminSellerPlanValue;
  planLabel: string;
  isActive: boolean;
};

export type AdminSellerDetailResponse = {
  id: string;
  userId: string;
  displayName: string;
  storeName: string;
  description: string | null;
  city: string;
  state: string;
  email: string;
  whatsApp: string;
  instagram: string | null;
  photoUrl: string | null;
  slug: string;
  createdAt: string;
  lastAccessAt: string | null;
  isActive: boolean;
  plan: AdminSellerPlanValue;
  planLabel: string;
  period: number;
  fromUtc: string | null;
  toUtc: string;
  advertisementCount: number;
  views: number;
  whatsappClicks: number;
  conversionRate: number | null;
  advertisements: AdminSellerAdvertisementDto[];
};

export type AdminSellerAdvertisementDto = {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  categoryId: string;
  categoryName: string;
  stockQuantity: number;
  status: AdvertisementStatus;
  views: number;
  whatsappClicks: number;
  conversionRate: number | null;
};

export type UpdateAdminSellerStatusRequest = {
  isActive: boolean;
};

export type UpdateAdminSellerStatusResponse = {
  id: string;
  isActive: boolean;
  storeName: string;
};
