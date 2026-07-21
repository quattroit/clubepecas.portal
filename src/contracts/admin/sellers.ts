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
  id: number;
  displayName: string;
  storeName: string;
  slug: string;
  city: string;
  state: string;
  email: string;
  whatsApp: string;
  personType: number | null;
  document: string | null;
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
  id: number;
  userId: number;
  displayName: string;
  storeName: string;
  description: string | null;
  city: string;
  state: string;
  email: string;
  whatsApp: string;
  personType: number | null;
  document: string | null;
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
  id: number;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  categoryId: number;
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
  id: number;
  isActive: boolean;
  storeName: string;
};
