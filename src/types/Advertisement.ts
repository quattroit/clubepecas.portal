/**
 * Modelos de UI do marketplace.
 * Diferentes dos DTOs em `src/contracts/` — use mappers para converter.
 */

/** Modelo de anúncio usado por cards, grids e páginas públicas. */
export type Advertisement = {
  id: string;
  title: string;
  price: number;
  city: string;
  state: string;
  category: string;
  /** Imagem principal (listagens / cards) */
  imageUrl?: string | null;
  /** Galeria completa (detalhe). Se vazio, usar imageUrl. */
  images?: string[];
  isNew: boolean;
  description?: string;
  /** ISO date string */
  publishedAt?: string;
  /** Label amigável do status (ex.: Publicado) — mapeado no mapper */
  statusLabel?: string;
  /** ISO date string — só quando o DTO fornece */
  updatedAt?: string | null;
  sellerId?: string;
  slug?: string;
  compatibilityDescription?: string;
};
