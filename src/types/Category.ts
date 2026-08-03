import type { VehicleRequirement } from "@/contracts/common/enums";

/**
 * Modelo de UI de categoria.
 * Backend: CRUD administrativo — hierarquia via `parentId`.
 * Configuração de campos (veículo/compatibilidade) está na raiz; filhas herdam.
 */
export type Category = {
  id: number;
  slug: string;
  name: string;
  advertisementCount: number;
  /** Valor do ícone (ex.: nome Lucide "Cog") — vem de `iconValue` da API. */
  iconName: string;
  description?: string;
  parentId: number | null;
  vehicleRequirement: VehicleRequirement;
  showCompatibility: boolean;
  allowProfessionalRequest: boolean;
  searchKeywords?: string | null;
};
