/** Query params de GET /api/v1/admin/subscription-plans (opcional — filtro pode ser client-side). */
export type AdminSubscriptionPlansListParams = {
  q?: string;
};

export type AdminSubscriptionPlanListItemDto = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  advertisementLimit: number;
  displayOrder: number;
  isActive: boolean;
  slug?: string | null;
};

/** GET /api/v1/admin/subscription-plans/{id} */
export type AdminSubscriptionPlanDetailDto = AdminSubscriptionPlanListItemDto & {
  description?: string | null;
};

export type GetAdminSubscriptionPlansResponse = {
  items: AdminSubscriptionPlanListItemDto[];
};

/** POST /api/v1/admin/subscription-plans */
export type CreateAdminSubscriptionPlanRequest = {
  name: string;
  description?: string;
  price: number;
  advertisementLimit: number;
  displayOrder?: number;
  isActive: boolean;
};

/** PUT /api/v1/admin/subscription-plans/{id} */
export type UpdateAdminSubscriptionPlanRequest = {
  name: string;
  description?: string;
  price: number;
  advertisementLimit: number;
  displayOrder: number;
  isActive: boolean;
};
