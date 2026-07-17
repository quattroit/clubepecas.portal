import type { GetMarketplaceRequest } from "@/contracts/categories/requests";
import type {
  GetCategoriesResponse,
  GetMarketplaceResponse,
} from "@/contracts/categories/responses";
import { api } from "@/lib/api";

/**
 * Marketplace / categorias públicas.
 * Categorias agora têm CRUD administrativo — catálogo público via GET /categories.
 */
export const categoryService = {
  listCategories() {
    return api
      .get<GetCategoriesResponse>("/api/v1/categories")
      .then((response) => response.data);
  },

  getMarketplace(params?: GetMarketplaceRequest) {
    return api
      .get<GetMarketplaceResponse>("/api/v1/marketplace", { params })
      .then((response) => response.data);
  },
};
