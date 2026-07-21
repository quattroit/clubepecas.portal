/**
 * Item do catálogo público de cidades.
 * GET /api/v1/cities — apenas ativas por padrão (Sprint 4.3.7).
 */
export type PublicCityListItemDto = {
  id: number;
  name: string;
  slug: string;
  state: string;
  displayOrder: number;
  isActive: boolean;
  sellerCount: number;
};

export type GetCitiesResponse = {
  items: PublicCityListItemDto[];
};
