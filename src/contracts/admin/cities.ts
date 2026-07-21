export type AdminCityStatusFilter = "all" | "active" | "inactive";

export type AdminCitySortParam = "name" | "order" | "sellerCount";

export type AdminCitySortDir = "asc" | "desc";

/** Query params de GET /api/v1/admin/cities */
export type AdminCitiesListParams = {
  q?: string;
  status?: AdminCityStatusFilter;
  sort?: AdminCitySortParam;
  sortDir?: AdminCitySortDir;
};

export type AdminCityListItemDto = {
  id: number;
  name: string;
  slug: string;
  state: string;
  displayOrder: number;
  isActive: boolean;
  sellerCount: number;
  updatedAt: string;
};

export type GetAdminCitiesResponse = {
  items: AdminCityListItemDto[];
};

/** POST /api/v1/admin/cities */
export type CreateAdminCityRequest = {
  name: string;
  state: string;
  slug?: string;
  displayOrder?: number;
  isActive: boolean;
};

/** PUT /api/v1/admin/cities/{id} */
export type UpdateAdminCityRequest = {
  name: string;
  state: string;
  slug?: string;
  displayOrder?: number;
};

/** PUT /api/v1/admin/cities/{id}/status */
export type UpdateAdminCityStatusRequest = {
  isActive: boolean;
};

export type UpdateAdminCityStatusResponse = {
  id: number;
  isActive: boolean;
  name: string;
};

/** PUT /api/v1/admin/cities/reorder */
export type ReorderAdminCitiesRequest = {
  orderedIds: number[];
};

export type ReorderAdminCitiesResponse = {
  items: AdminCityListItemDto[];
};
