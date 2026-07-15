import type { MarketplaceItemDto } from "@/contracts/categories/responses";
import type { AdvertisementBySlugResponse } from "@/contracts/advertisements/responses";
import { mapAdvertisementBySlugSeller } from "@/mappers/seller.mapper";
import type { Seller } from "@/types/Seller";

/**
 * Agrupa itens do marketplace por loja (nome + localização).
 */
export function groupMarketplaceItemsByStore(
  items: MarketplaceItemDto[],
): MarketplaceItemDto[][] {
  const groups = new Map<string, MarketplaceItemDto[]>();

  for (const item of items) {
    const key = `${item.storeName}\0${item.city}\0${item.state}`;
    const current = groups.get(key) ?? [];
    current.push(item);
    groups.set(key, current);
  }

  return [...groups.values()];
}

/**
 * Resumo de loja a partir do seller embutido no anúncio público.
 */
export function mapStoreSummaryFromAdvertisementBySlug(
  dto: AdvertisementBySlugResponse,
  advertisementCount: number,
): Seller {
  return {
    ...mapAdvertisementBySlugSeller(dto),
    advertisementCount,
  };
}
