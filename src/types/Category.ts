/**
 * Modelo de UI de categoria.
 * Backend: CRUD administrativo (Sprint 4.3.6) — `id` é Guid.
 */
export type Category = {
  id: string;
  slug: string;
  name: string;
  advertisementCount: number;
  /** Valor do ícone (ex.: nome Lucide "Cog") — vem de `iconValue` da API. */
  iconName: string;
  description?: string;
};
