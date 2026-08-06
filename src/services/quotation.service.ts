import type {
  CreateQuotationRequest,
  CreateQuotationResponse,
  ListMyQuotationsParams,
  ListMyQuotationsResponse,
  ListSellerQuotationsParams,
  ListSellerQuotationsResponse,
  SellerQuotationDetailDto,
} from "@/contracts/quotations";
import { api } from "@/lib/api";

/**
 * Central de Cotações — envio (comprador profissional) e recebimento (vendedor).
 * GET/POST /api/v1/quotations, GET /api/v1/seller/quotations
 */
export const quotationService = {
  create(payload: CreateQuotationRequest) {
    return api
      .post<CreateQuotationResponse>("/api/v1/quotations", payload)
      .then((response) => response.data);
  },

  getMine(params: ListMyQuotationsParams = {}) {
    return api
      .get<ListMyQuotationsResponse>("/api/v1/quotations/me", { params })
      .then((response) => response.data);
  },

  getSellerQuotations(params: ListSellerQuotationsParams = {}) {
    return api
      .get<ListSellerQuotationsResponse>("/api/v1/seller/quotations", {
        params,
      })
      .then((response) => response.data);
  },

  getSellerQuotationById(id: number) {
    return api
      .get<SellerQuotationDetailDto>(`/api/v1/seller/quotations/${id}`)
      .then((response) => response.data);
  },
};
