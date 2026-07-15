import type { GetMarketplaceRequest } from "@/contracts/categories/requests";
import type { GetMarketplaceResponse } from "@/contracts/categories/responses";
import { AdvertisementCategory } from "@/contracts/common/enums";
import { api } from "@/lib/api";

/**
 * Marketplace / categorias.
 * No backend não há CRUD de categorias — o catálogo é o enum AdvertisementCategory.
 */
export const categoryService = {
  /**
   * Lista as categorias disponíveis (enum do backend — sem endpoint HTTP).
   */
  listCategories(): Promise<AdvertisementCategory[]> {
    return Promise.resolve(
      Object.values(AdvertisementCategory).filter(
        (value): value is AdvertisementCategory => typeof value === "number",
      ),
    );
  },

  getMarketplace(params?: GetMarketplaceRequest) {
    return api
      .get<GetMarketplaceResponse>("/api/v1/marketplace", { params })
      .then((response) => response.data);
  },
};
