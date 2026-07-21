/**
 * Modelo de UI de marca de veículo.
 * Backend: CRUD administrativo (Sprint 4.3.8) — `id` é Guid.
 */
export type VehicleBrand = {
  id: number;
  slug: string;
  name: string;
  advertisementCount: number;
};
