import type {
  AdvertisementCondition,
  AdvertisementStatus,
} from "@/contracts/common/enums";
import type { MetricsPeriodParam } from "@/contracts/seller/metrics";

export type { MetricsPeriodParam };

export type AdminAdvertisementStatusFilter = "all" | "active" | "inactive";

export type AdminAdvertisementSortParam =
  | "newest"
  | "oldest"
  | "title"
  | "store"
  | "views"
  | "whatsappClicks"
  | "conversion"
  | "stock";

export type AdminAdvertisementSortDir = "asc" | "desc";

export type AdminAdvertisementsListParams = {
  q?: string;
  status?: AdminAdvertisementStatusFilter;
  /** Guid da categoria. */
  categoryId?: number;
  city?: string;
  state?: string;
  store?: string;
  sellerId?: number;
  publishedFrom?: string;
  publishedTo?: string;
  stockMin?: number;
  stockMax?: number;
  sort?: AdminAdvertisementSortParam;
  sortDir?: AdminAdvertisementSortDir;
  page?: number;
  pageSize?: number;
};

export type AdminAdvertisementsListResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  items: AdminAdvertisementListItemDto[];
};

export type AdminAdvertisementListItemDto = {
  id: number;
  slug: string;
  thumbnailUrl: string | null;
  title: string;
  sellerId: number;
  storeName: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  vehicleBrandId?: number | null;
  vehicleBrandName?: string | null;
  vehicleBrandSlug?: string | null;
  vehicleModelId?: number | null;
  vehicleModelName?: string | null;
  vehicleModelSlug?: string | null;
  manufacturingYear?: number | null;
  modelYear?: number | null;
  city: string;
  state: string;
  stockQuantity: number;
  views: number;
  whatsappClicks: number;
  conversionRate: number | null;
  status: AdvertisementStatus;
  isActive: boolean;
  publishedAt: string;
  /** Reservado para moderação — V1 sempre 0. */
  reportCount: number;
};

export type AdminAdvertisementDetailResponse = {
  id: number;
  slug: string;
  title: string;
  description: string;
  compatibilityDescription?: string | null;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  vehicleBrandId?: number | null;
  vehicleBrandName?: string | null;
  vehicleBrandSlug?: string | null;
  vehicleModelId?: number | null;
  vehicleModelName?: string | null;
  vehicleModelSlug?: string | null;
  manufacturingYear?: number | null;
  modelYear?: number | null;
  condition: AdvertisementCondition;
  price: number;
  stockQuantity: number;
  status: AdvertisementStatus;
  isActive: boolean;
  publishedAt: string;
  imageUrls: string[];
  sellerId: number;
  storeName: string;
  ownerName: string;
  city: string;
  state: string;
  whatsApp: string;
  storeSlug: string | null;
  period: number;
  fromUtc: string | null;
  toUtc: string;
  views: number;
  whatsappClicks: number;
  conversionRate: number | null;
  reportCount: number;
};

export type UpdateAdminAdvertisementStatusRequest = {
  isActive: boolean;
};

export type UpdateAdminAdvertisementStatusResponse = {
  id: number;
  isActive: boolean;
  status: AdvertisementStatus;
  title: string;
};
