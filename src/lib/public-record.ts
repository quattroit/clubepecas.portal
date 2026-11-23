import { cache } from "react";
import { notFound, unstable_rethrow } from "next/navigation";

import type { PublicCategoryListItemDto } from "@/contracts/categories/responses";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { buildPublicAdvertisementDetail } from "@/lib/public-advertisement";
import { loadPublicMarketplaceList } from "@/lib/public-marketplace";
import { buildPublicStoreDetail } from "@/lib/public-store";
import {
  findCategoryBySlug,
  mapCategoryItemsToCategories,
} from "@/mappers/category.mapper";
import { advertisementService } from "@/services/advertisement.service";
import { categoryService } from "@/services/category.service";
import { sellerService } from "@/services/seller.service";
import type { Category } from "@/types/Category";
import { PUBLIC_LISTING_DEFAULT_PAGE_SIZE } from "@/utils/public-listing-pagination";

/**
 * Consulta pública compartilhada por `generateMetadata` e pela página.
 * `cache()` deduplica as duas chamadas no mesmo request do servidor.
 */
export const getPublicAdvertisementBySlug = cache((slug: string) =>
  advertisementService.getBySlug(slug),
);

/**
 * Detalhe público para metadata, 404 e HTML inicial.
 * Reusa `getPublicAdvertisementBySlug` no mesmo request.
 * `fetchedAt` marca o dado como fresco para o TanStack Query sem chamar
 * `Date.now` durante o render da página.
 */
export const getCachedPublicAdvertisementDetail = cache(
  async (slug: string) => {
    const dto = await getPublicAdvertisementBySlug(slug);
    const detail = await buildPublicAdvertisementDetail(dto);

    return {
      detail,
      fetchedAt: Date.now(),
    };
  },
);

export const getPublicStoreBySlug = cache((slug: string) =>
  sellerService.getPublicBySlug(slug),
);

/**
 * Detalhe público da loja para metadata, 404 e HTML inicial.
 * Reusa `getPublicStoreBySlug` no mesmo request.
 * `fetchedAt` marca o dado como fresco para o TanStack Query sem chamar
 * `Date.now` durante o render da página.
 */
export const getCachedPublicStoreDetail = cache(async (slug: string) => {
  const dto = await getPublicStoreBySlug(slug);

  return {
    detail: buildPublicStoreDetail(dto),
    fetchedAt: Date.now(),
  };
});

const getPublicCategoryTree = cache(() => categoryService.listCategories());

function onlyActiveCategories(
  items: PublicCategoryListItemDto[],
): PublicCategoryListItemDto[] {
  return items
    .filter((item) => item.isActive)
    .map((item) => ({
      ...item,
      children: (item.children ?? []).filter((child) => child.isActive),
    }));
}

/**
 * `null` só quando a árvore pública foi carregada e o slug não está nela.
 * Falha de rede, timeout ou erro da API continuam sendo exceção.
 */
export async function getPublicCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const response = await getPublicCategoryTree();

  if (!response || !Array.isArray(response.items)) {
    throw new Error("Resposta inválida ao listar categorias públicas.");
  }

  const categories = mapCategoryItemsToCategories(
    onlyActiveCategories(response.items),
  );

  return findCategoryBySlug(categories, slug) ?? null;
}

/**
 * Categoria ativa, catálogo público e primeira página de anúncios.
 * A árvore reusa `getPublicCategoryTree`. Falha do marketplace segue sem captura.
 * `fetchedAt` marca os dados como frescos sem chamar `Date.now` no render.
 */
export const getCachedPublicCategoryDetail = cache(async (slug: string) => {
  const category = await getPublicCategoryBySlug(slug);
  const response = await getPublicCategoryTree();
  const categories = mapCategoryItemsToCategories(response.items);
  const listingFilters = {
    categorySlug: slug,
    page: 1,
    pageSize: PUBLIC_LISTING_DEFAULT_PAGE_SIZE,
    sort: "recent" as const,
  };

  if (!category) {
    return {
      categories,
      category: null,
      advertisements: null,
      listingFilters,
      fetchedAt: Date.now(),
    };
  }

  const advertisements = await loadPublicMarketplaceList(listingFilters);

  return {
    categories,
    category,
    advertisements,
    listingFilters,
    fetchedAt: Date.now(),
  };
});

/**
 * Ausência pública vira HTTP 404.
 * HTTP 400 permanece na página atual.
 * Timeout, rede, HTTP 5xx e resposta inválida seguem sem captura para o Next responder 500.
 */
export function throwUnlessMissingOrInvalid(error: unknown): void {
  unstable_rethrow(error);

  if (error instanceof NotFoundError) {
    notFound();
  }

  if (error instanceof ValidationError && error.statusCode === 400) {
    return;
  }

  throw error;
}
