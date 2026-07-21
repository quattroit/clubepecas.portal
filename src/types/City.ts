/**
 * Modelo de UI de cidade.
 * Backend: CRUD administrativo (Sprint 4.3.7) — `id` é Guid.
 */
export type City = {
  id: number;
  slug: string;
  name: string;
  state: string;
  sellerCount: number;
};
