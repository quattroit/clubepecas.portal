import type { AdvertisementBySlugResponse } from "@/contracts/advertisements/responses";
import {
  mapAdvertisementBySlugToAdvertisement,
  mapRelatedMarketplaceItems,
} from "@/mappers/advertisement.mapper";
import { mapAdvertisementBySlugSeller } from "@/mappers/seller.mapper";
import { advertisementService } from "@/services/advertisement.service";
import { categoryService } from "@/services/category.service";
import type { Advertisement } from "@/types/Advertisement";
import type { Seller } from "@/types/Seller";

/** Modelo já mapeado do detalhe público, compartilhado pelo servidor e pelo hook. */
export type PublicAdvertisementDetail = {
  advertisement: Advertisement;
  seller: Seller;
  related: Advertisement[];
  images: string[];
  thumbnails: string[];
};

const RELATED_LIMIT = 4;

/**
 * Mesma consulta de relacionados do detalhe: marketplace da categoria,
 * excluindo o anúncio atual, no máximo quatro itens.
 * Falha aqui não impede o anúncio principal.
 */
async function loadRelatedAdvertisements(
  categorySlug: string,
  currentSlug: string,
): Promise<Advertisement[]> {
  try {
    const marketplace = await categoryService.getMarketplace({
      categorySlug: categorySlug || undefined,
    });

    return mapRelatedMarketplaceItems(
      marketplace.items ?? [],
      currentSlug,
      RELATED_LIMIT,
    );
  } catch (error) {
    console.error(
      "[anuncio] Não foi possível carregar anúncios relacionados.",
      error,
    );
    return [];
  }
}

export async function buildPublicAdvertisementDetail(
  dto: AdvertisementBySlugResponse,
): Promise<PublicAdvertisementDetail> {
  const advertisement = mapAdvertisementBySlugToAdvertisement(dto);
  const seller = mapAdvertisementBySlugSeller(dto);
  const related = await loadRelatedAdvertisements(dto.categorySlug, dto.slug);

  return {
    advertisement,
    seller,
    related,
    images: advertisement.images ?? [],
    thumbnails: advertisement.thumbnails ?? advertisement.images ?? [],
  };
}

/** Refetch do cliente. O servidor usa o loader em cache de `public-record`. */
export async function loadPublicAdvertisementDetail(
  slug: string,
): Promise<PublicAdvertisementDetail> {
  const dto = await advertisementService.getBySlug(slug);
  return buildPublicAdvertisementDetail(dto);
}
