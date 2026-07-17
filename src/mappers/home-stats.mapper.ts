import type { GetHomeStatsResponse } from "@/contracts/home/responses";
import type { HomeStats } from "@/types/HomeStats";

export function mapHomeStatsDto(dto: GetHomeStatsResponse): HomeStats {
  return {
    activeListings: dto.activeListings,
    activeStores: dto.activeStores,
    categories: dto.categories,
  };
}

/**
 * Formata contador do Hero: +2.500 (acima de zero) ou 0.
 */
export function formatHomeStatValue(value: number): string {
  const formatted = new Intl.NumberFormat("pt-BR").format(Math.max(0, value));
  if (value > 0) {
    return `+${formatted}`;
  }
  return formatted;
}
