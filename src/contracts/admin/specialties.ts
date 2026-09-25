export type AdminSpecialtyStatusFilter = "all" | "active" | "inactive";

export type AdminSpecialtySortParam = "name" | "order" | "sellerCount";

export type AdminSpecialtySortDir = "asc" | "desc";

/** Query params de GET /api/v1/admin/specialties */
export type AdminSpecialtiesListParams = {
  q?: string;
  status?: AdminSpecialtyStatusFilter;
  sort?: AdminSpecialtySortParam;
  sortDir?: AdminSpecialtySortDir;
};

export type AdminSpecialtyListItemDto = {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  sellerCount: number;
  createdAt: string;
  updatedAt: string | null;
};

export type GetAdminSpecialtiesResponse = {
  items: AdminSpecialtyListItemDto[];
};

/** POST /api/v1/admin/specialties */
export type CreateAdminSpecialtyRequest = {
  name: string;
  slug?: string;
  displayOrder?: number;
  isActive: boolean;
};

/** PUT /api/v1/admin/specialties/{id} */
export type UpdateAdminSpecialtyRequest = {
  name: string;
  slug?: string;
  displayOrder?: number;
};

/** PATCH /api/v1/admin/specialties/{id}/status */
export type UpdateAdminSpecialtyStatusRequest = {
  isActive: boolean;
};

export type UpdateAdminSpecialtyStatusResponse = {
  id: number;
  isActive: boolean;
  name: string;
};
