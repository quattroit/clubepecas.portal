/**
 * Item do catálogo público de modelos de veículo.
 * GET /api/v1/vehicle-models — apenas ativos por padrão (Sprint 4.3.9).
 */
export type PublicVehicleModelListItemDto = {
  id: number;
  vehicleBrandId: number;
  vehicleBrandName: string;
  vehicleBrandSlug: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  advertisementCount: number;
};

export type GetVehicleModelsResponse = {
  items: PublicVehicleModelListItemDto[];
};

/** Query params de GET /api/v1/vehicle-models */
export type GetVehicleModelsParams = {
  brandId?: number;
  brandSlug?: string;
  includeInactive?: boolean;
};
