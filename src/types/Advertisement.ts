/**
 * Modelos de UI do marketplace.
 * Diferentes dos DTOs em `src/contracts/` — use mappers para converter.
 */

/** Modelo de anúncio usado por cards, grids e páginas públicas. */
export type Advertisement = {
  id: number;
  title: string;
  price: number;
  cityId?: number;
  citySlug?: string;
  city: string;
  state: string;
  /** Nome da categoria (categoryName da API). */
  category: string;
  categoryId?: number;
  categorySlug?: string;
  /** Nome da marca de veículo (vehicleBrandName da API). */
  vehicleBrand?: string;
  vehicleBrandId?: number;
  vehicleBrandSlug?: string;
  /** Nome do modelo de veículo (vehicleModelName da API). */
  vehicleModel?: string;
  vehicleModelId?: number;
  vehicleModelSlug?: string;
  /** Ano de fabricação do veículo. */
  manufacturingYear?: number;
  /** Ano/modelo do veículo. */
  modelYear?: number;
  /** Imagem principal (listagens / cards) */
  imageUrl?: string | null;
  /** Galeria completa (detalhe). Se vazio, usar imageUrl. */
  images?: string[];
  /** Miniaturas da galeria (detalhe) — fallback para images. */
  thumbnails?: string[];
  isNew: boolean;
  description?: string;
  /** Quantidade em estoque (painel do vendedor). */
  stockQuantity?: number;
  /** ISO date string */
  publishedAt?: string;
  /** Label amigável do status (ex.: Publicado) — mapeado no mapper */
  statusLabel?: string;
  /** ISO date string — só quando o DTO fornece */
  updatedAt?: string | null;
  sellerId?: number;
  slug?: string;
  compatibilityDescription?: string;
  /** Loja oferece Frete Local (motoboy / veículo próprio). */
  offersLocalDelivery?: boolean;
  /** Raio máximo de Frete Local em km, quando habilitado. */
  localDeliveryMaxRadiusKm?: number | null;
};
