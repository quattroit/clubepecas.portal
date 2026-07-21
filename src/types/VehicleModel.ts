/**
 * Modelo de UI de modelo de veículo.
 * Backend: CRUD administrativo (Sprint 4.3.9) — `id` é Guid.
 */
export type VehicleModel = {
  id: number;
  slug: string;
  name: string;
  vehicleBrandId: number;
  vehicleBrandName: string;
  vehicleBrandSlug: string;
  advertisementCount: number;
};
