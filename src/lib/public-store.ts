import type { SellerPublicProfileResponse } from "@/contracts/seller/responses";
import { mapPublicSellerAdvertisementToAdvertisement } from "@/mappers/advertisement.mapper";
import { mapSellerPublicProfileToSeller } from "@/mappers/seller.mapper";
import { sellerService } from "@/services/seller.service";
import type { Advertisement } from "@/types/Advertisement";
import type { Seller } from "@/types/Seller";

/** Modelo já mapeado do detalhe público da loja, compartilhado pelo servidor e pelo hook. */
export type PublicStoreDetail = {
  seller: Seller;
  advertisements: Advertisement[];
  categoriesCount: number;
};

export function buildPublicStoreDetail(
  dto: SellerPublicProfileResponse,
): PublicStoreDetail {
  const seller = mapSellerPublicProfileToSeller(dto);
  const advertisements = dto.advertisements.map((item) =>
    mapPublicSellerAdvertisementToAdvertisement(item, {
      city: dto.city,
      state: dto.state,
      offersLocalDelivery: Boolean(dto.offersLocalDelivery),
      localDeliveryMaxRadiusKm: dto.localDeliveryMaxRadiusKm ?? null,
    }),
  );
  const categoriesCount = new Set(
    advertisements.map((item) => item.category),
  ).size;

  return {
    seller,
    advertisements,
    categoriesCount,
  };
}

/** Refetch do cliente. O servidor usa o loader em cache de `public-record`. */
export async function loadPublicStoreDetail(
  slug: string,
): Promise<PublicStoreDetail> {
  const dto = await sellerService.getPublicBySlug(slug);
  return buildPublicStoreDetail(dto);
}
