import { mapSellerPublicProfileToSeller } from "@/mappers/seller.mapper";
import {
  groupMarketplaceItemsByStore,
  mapStoreSummaryFromAdvertisementBySlug,
} from "@/mappers/store.mapper";
import { advertisementService } from "@/services/advertisement.service";
import { categoryService } from "@/services/category.service";
import { sellerService } from "@/services/seller.service";
import type { Seller } from "@/types/Seller";

/**
 * Descobre lojas públicas (sem endpoint de listagem no backend).
 * 1) marketplace → agrupamento
 * 2) getBySlug do 1º anúncio → slug do vendedor
 * 3) sellerService.getPublicBySlug → perfil completo
 */
export async function loadPublicStores(): Promise<Seller[]> {
  const marketplace = await categoryService.getMarketplace();
  const groups = groupMarketplaceItemsByStore(marketplace.items);

  if (groups.length === 0) {
    return [];
  }

  const summaries = await Promise.all(
    groups.map(async (items) => {
      const first = items[0];
      if (!first) {
        throw new Error("Grupo de marketplace sem itens");
      }

      const advertisement = await advertisementService.getBySlug(first.slug);
      return mapStoreSummaryFromAdvertisementBySlug(
        advertisement,
        items.length,
      );
    }),
  );

  const uniqueSlugs = [
    ...new Set(summaries.map((seller) => seller.slug).filter(Boolean)),
  ];

  const profiles = await Promise.all(
    uniqueSlugs.map((slug) => sellerService.getPublicBySlug(slug)),
  );

  return profiles.map(mapSellerPublicProfileToSeller);
}

/**
 * Lista apenas os slugs das lojas públicas (SEO / generateStaticParams).
 */
export async function loadPublicStoreSlugs(): Promise<string[]> {
  const stores = await loadPublicStores();
  return stores.map((store) => store.slug);
}
