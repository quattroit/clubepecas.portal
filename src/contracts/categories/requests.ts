/** Query params de GET /api/v1/marketplace */
export type GetMarketplaceRequest = {
  /** Busca livre (título, descrição, compatibilidade). */
  q?: string;
  /** Filtro legado só no título — preferir `q`. */
  title?: string;
  /** Guid da categoria. */
  categoryId?: string;
  /** Slug da categoria — alternativa ao `categoryId`. */
  categorySlug?: string;
  /** Guid da marca de veículo. */
  vehicleBrandId?: string;
  /** Slug da marca — alternativa ao `vehicleBrandId`. */
  vehicleBrandSlug?: string;
  /** Alias de `vehicleBrandSlug` (querystring pública `?brand=`). */
  brand?: string;
  /** Guid do modelo de veículo. */
  vehicleModelId?: string;
  /** Slug do modelo — alternativa ao `vehicleModelId`. */
  vehicleModelSlug?: string;
  /** Alias de `vehicleModelSlug` (querystring pública `?model=`). */
  model?: string;
  city?: string;
  state?: string;
  priceMin?: number;
  priceMax?: number;
  newOnly?: boolean;
  /** recent | price-asc | price-desc */
  sort?: string;
};
