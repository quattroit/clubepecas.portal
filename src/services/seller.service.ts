import type {
  CreateSellerRequest,
  UpdateSellerRequest,
} from "@/contracts/seller/requests";
import type {
  MetricsPeriodParam,
  SellerDashboardMetricsResponse,
} from "@/contracts/seller/metrics";
import type {
  CreateSellerResponse,
  SellerMeDto,
  SellerPublicProfileResponse,
} from "@/contracts/seller/responses";
import { api } from "@/lib/api";

/**
 * Serviços de vendedor/loja.
 * Perfil autenticado: getMe / create / update.
 */
export const sellerService = {
  create(payload: CreateSellerRequest) {
    return api
      .post<CreateSellerResponse>("/api/v1/seller", payload)
      .then((response) => response.data);
  },

  getMe() {
    return api
      .get<SellerMeDto>("/api/v1/seller/me")
      .then((response) => response.data);
  },

  update(payload: UpdateSellerRequest) {
    return api
      .put<SellerMeDto>("/api/v1/seller/me", payload)
      .then((response) => response.data);
  },

  /** GET /api/v1/seller/me/metrics — métricas consolidadas do painel. */
  getMyMetrics(period: MetricsPeriodParam = "all") {
    return api
      .get<SellerDashboardMetricsResponse>("/api/v1/seller/me/metrics", {
        params: { period },
      })
      .then((response) => response.data);
  },

  getPublicBySlug(slug: string) {
    return api
      .get<SellerPublicProfileResponse>(`/api/v1/sellers/${slug}`)
      .then((response) => response.data);
  },
};
