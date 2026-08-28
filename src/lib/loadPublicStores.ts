import { mapSellerPublicListItemToSeller } from "@/mappers/seller.mapper";
import { sellerService } from "@/services/seller.service";
import type { Seller } from "@/types/Seller";
import type { ListPublicSellersRequest } from "@/contracts/seller/responses";

/**
 * Lista lojas públicas via GET /api/v1/sellers (payload leve).
 */
export async function loadPublicStores(
  params: ListPublicSellersRequest = {},
): Promise<Seller[]> {
  const response = await sellerService.listPublic(params);
  return response.items.map(mapSellerPublicListItemToSeller);
}

/**
 * Lista apenas os slugs das lojas públicas (SEO / generateStaticParams).
 */
export async function loadPublicStoreSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  const pageSize = 30;

  while (true) {
    const response = await sellerService.listPublic({ page, pageSize });
    slugs.push(...response.items.map((store) => store.slug));

    const loaded = page * pageSize;
    if (
      response.items.length < pageSize ||
      loaded >= response.totalCount ||
      page >= 100
    ) {
      break;
    }

    page += 1;
  }

  return slugs;
}
