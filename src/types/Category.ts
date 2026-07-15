/**
 * Modelo de UI de categoria.
 * No backend, categorias = enum AdvertisementCategory (sem CRUD).
 */
export type Category = {
  id: string;
  slug: string;
  name: string;
  advertisementCount: number;
  /** Nome do ícone Lucide (ex.: "Cog", "Car") */
  iconName: string;
  description?: string;
};
