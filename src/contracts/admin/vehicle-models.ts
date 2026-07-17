export type AdminVehicleModelStatusFilter = "all" | "active" | "inactive";

export type AdminVehicleModelSortParam =
  | "name"
  | "order"
  | "advertisementCount";

export type AdminVehicleModelSortDir = "asc" | "desc";

/** Query params de GET /api/v1/admin/vehicle-models */
export type AdminVehicleModelsListParams = {
  q?: string;
  status?: AdminVehicleModelStatusFilter;
  sort?: AdminVehicleModelSortParam;
  sortDir?: AdminVehicleModelSortDir;
  brandId?: string;
};

export type AdminVehicleModelListItemDto = {
  id: string;
  vehicleBrandId: string;
  vehicleBrandName: string;
  vehicleBrandSlug: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  advertisementCount: number;
  updatedAt: string;
};

export type GetAdminVehicleModelsResponse = {
  items: AdminVehicleModelListItemDto[];
};

/** POST /api/v1/admin/vehicle-models */
export type CreateAdminVehicleModelRequest = {
  vehicleBrandId: string;
  name: string;
  slug?: string;
  displayOrder?: number;
  isActive: boolean;
};

/** PUT /api/v1/admin/vehicle-models/{id} */
export type UpdateAdminVehicleModelRequest = {
  vehicleBrandId: string;
  name: string;
  slug?: string;
  displayOrder?: number;
};

/** PUT /api/v1/admin/vehicle-models/{id}/status */
export type UpdateAdminVehicleModelStatusRequest = {
  isActive: boolean;
};

export type UpdateAdminVehicleModelStatusResponse = {
  id: string;
  isActive: boolean;
  name: string;
};

/** PUT /api/v1/admin/vehicle-models/reorder */
export type ReorderAdminVehicleModelsRequest = {
  orderedIds: string[];
};

export type ReorderAdminVehicleModelsResponse = {
  items: AdminVehicleModelListItemDto[];
};
