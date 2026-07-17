/**
 * Modelo de UI de modelo de veículo.
 * Backend: CRUD administrativo (Sprint 4.3.9) — `id` é Guid.
 */
export type VehicleModel = {
  id: string;
  slug: string;
  name: string;
  vehicleBrandId: string;
  vehicleBrandName: string;
  vehicleBrandSlug: string;
  advertisementCount: number;
};
