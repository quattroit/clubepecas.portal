/**
 * Modelo de UI do vendedor/loja.
 * Diferente dos DTOs em `src/contracts/seller`.
 */
export type Seller = {
  id: number;
  slug: string;
  name: string;
  cityId?: number;
  city: string;
  state: string;
  citySlug?: string;
  advertisementCount: number;
  avatarUrl?: string | null;
  /** Imagem de capa do cabeçalho público da loja. */
  coverUrl?: string | null;
  description?: string;
  /** ISO date string — data de cadastro */
  registeredAt?: string;
  displayName?: string;
  personType?: number | null;
  document?: string | null;
  whatsApp?: string | null;
  instagram?: string | null;
  zipCode?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  representativeId?: number | null;
  representativeCode?: string | null;
  representativeName?: string | null;
  representativeStatus?: number | null;
  representativeStatusLabel?: string | null;
  /** Loja oferece Frete Local (motoboy / veículo próprio). */
  offersLocalDelivery?: boolean;
  /** Raio máximo de Frete Local em km, quando habilitado. */
  localDeliveryMaxRadiusKm?: number | null;
  /** True se o vendedor já ativou algum plano demonstração. */
  demoAlreadyUsed?: boolean;
};
