/**
 * Modelo de UI do vendedor/loja.
 * Diferente dos DTOs em `src/contracts/seller`.
 */
export type Seller = {
  id: string;
  slug: string;
  name: string;
  cityId?: string;
  city: string;
  state: string;
  citySlug?: string;
  advertisementCount: number;
  avatarUrl?: string | null;
  description?: string;
  /** ISO date string — data de cadastro */
  registeredAt?: string;
  displayName?: string;
  personType?: number | null;
  document?: string | null;
  whatsApp?: string | null;
  instagram?: string | null;
};
