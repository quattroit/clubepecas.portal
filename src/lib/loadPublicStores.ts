import { mapSellerPublicListItemToSeller } from "@/mappers/seller.mapper";
import { sellerService } from "@/services/seller.service";
import type { Seller } from "@/types/Seller";

/**
 * Lista lojas públicas via GET /api/v1/sellers (payload leve).
 */
export async function loadPublicStores(): Promise<Seller[]> {
  const response = await sellerService.listPublic();
  return response.items.map(mapSellerPublicListItemToSeller);
}

/**
 * Lista apenas os slugs das lojas públicas (SEO / generateStaticParams).
 */
export async function loadPublicStoreSlugs(): Promise<string[]> {
  const stores = await loadPublicStores();
  return stores.map((store) => store.slug);
}
