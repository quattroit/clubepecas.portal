import type {
  CategoryIconType,
  VehicleRequirement,
} from "@/contracts/common/enums";

export type AdminCategoryStatusFilter = "all" | "active" | "inactive";

export type AdminCategorySortParam = "name" | "order" | "advertisementCount";

export type AdminCategorySortDir = "asc" | "desc";

/** Query params de GET /api/v1/admin/categories */
export type AdminCategoriesListParams = {
  q?: string;
  status?: AdminCategoryStatusFilter;
  sort?: AdminCategorySortParam;
  sortDir?: AdminCategorySortDir;
};

export type AdminCategoryListItemDto = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  iconType: CategoryIconType;
  iconValue: string;
  advertisementCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  parentId: number | null;
  vehicleRequirement: VehicleRequirement;
  showCompatibility: boolean;
  allowProfessionalRequest: boolean;
  searchKeywords: string | null;
  updatedAt: string;
};

export type GetAdminCategoriesResponse = {
  items: AdminCategoryListItemDto[];
};

/** POST /api/v1/admin/categories */
export type CreateAdminCategoryRequest = {
  name: string;
  slug?: string;
  description?: string;
  displayOrder?: number;
  iconType: CategoryIconType;
  iconValue: string;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  parentId?: number | null;
  vehicleRequirement?: VehicleRequirement;
  showCompatibility?: boolean;
  allowProfessionalRequest?: boolean;
  searchKeywords?: string | null;
};

/** PUT /api/v1/admin/categories/{id} */
export type UpdateAdminCategoryRequest = {
  name: string;
  slug?: string;
  description?: string;
  displayOrder?: number;
  iconType: CategoryIconType;
  iconValue: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  parentId?: number | null;
  vehicleRequirement?: VehicleRequirement;
  showCompatibility?: boolean;
  allowProfessionalRequest?: boolean;
  searchKeywords?: string | null;
};

/** PUT /api/v1/admin/categories/{id}/status */
export type UpdateAdminCategoryStatusRequest = {
  isActive: boolean;
};

export type UpdateAdminCategoryStatusResponse = {
  id: number;
  isActive: boolean;
  name: string;
};

/** PUT /api/v1/admin/categories/reorder */
export type ReorderAdminCategoriesRequest = {
  orderedIds: number[];
};

export type ReorderAdminCategoriesResponse = {
  items: AdminCategoryListItemDto[];
};
