export type AdminVehicleBrandStatusFilter = "all" | "active" | "inactive";

export type AdminVehicleBrandSortParam =
  | "name"
  | "order"
  | "advertisementCount";

export type AdminVehicleBrandSortDir = "asc" | "desc";

/** Query params de GET /api/v1/admin/vehicle-brands */
export type AdminVehicleBrandsListParams = {
  q?: string;
  status?: AdminVehicleBrandStatusFilter;
  sort?: AdminVehicleBrandSortParam;
  sortDir?: AdminVehicleBrandSortDir;
};

export type AdminVehicleBrandListItemDto = {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  advertisementCount: number;
  updatedAt: string;
};

export type GetAdminVehicleBrandsResponse = {
  items: AdminVehicleBrandListItemDto[];
};

/** POST /api/v1/admin/vehicle-brands */
export type CreateAdminVehicleBrandRequest = {
  name: string;
  slug?: string;
  displayOrder?: number;
  isActive: boolean;
};

/** PUT /api/v1/admin/vehicle-brands/{id} */
export type UpdateAdminVehicleBrandRequest = {
  name: string;
  slug?: string;
  displayOrder?: number;
};

/** PUT /api/v1/admin/vehicle-brands/{id}/status */
export type UpdateAdminVehicleBrandStatusRequest = {
  isActive: boolean;
};

export type UpdateAdminVehicleBrandStatusResponse = {
  id: number;
  isActive: boolean;
  name: string;
};

/** PUT /api/v1/admin/vehicle-brands/reorder */
export type ReorderAdminVehicleBrandsRequest = {
  orderedIds: number[];
};

export type ReorderAdminVehicleBrandsResponse = {
  items: AdminVehicleBrandListItemDto[];
};
