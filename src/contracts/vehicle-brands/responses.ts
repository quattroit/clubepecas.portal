/**
 * Item do catálogo público de marcas de veículo.
 * GET /api/v1/vehicle-brands — apenas ativas por padrão (Sprint 4.3.8).
 */
export type PublicVehicleBrandListItemDto = {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  advertisementCount: number;
};

export type GetVehicleBrandsResponse = {
  items: PublicVehicleBrandListItemDto[];
};
