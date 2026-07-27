import type {
  ContactPartRequestSupplierResponse,
  CreatePartRequestRequest,
  ListMyPartRequestsParams,
  ListMyPartRequestsResponse,
  PartRequestDto,
  PartRequestSuppliersDto,
  SkipPartRequestSupplierResponse,
  UpdatePartRequestRequest,
} from "@/contracts/part-requests";
import { api } from "@/lib/api";

/**
 * Solicitações de peças do comprador profissional.
 * GET/POST /api/v1/part-requests
 */
export const partRequestService = {
  create(payload: CreatePartRequestRequest) {
    return api
      .post<PartRequestDto>("/api/v1/part-requests", payload)
      .then((response) => response.data);
  },

  getMine(params: ListMyPartRequestsParams = {}) {
    return api
      .get<ListMyPartRequestsResponse>("/api/v1/part-requests/me", { params })
      .then((response) => response.data);
  },

  getById(id: number) {
    return api
      .get<PartRequestDto>(`/api/v1/part-requests/${id}`)
      .then((response) => response.data);
  },

  update(id: number, payload: UpdatePartRequestRequest) {
    return api
      .put<PartRequestDto>(`/api/v1/part-requests/${id}`, payload)
      .then((response) => response.data);
  },

  cancel(id: number) {
    return api
      .delete<PartRequestDto>(`/api/v1/part-requests/${id}`)
      .then((response) => response.data);
  },

  getSuppliers(id: number) {
    return api
      .get<PartRequestSuppliersDto>(`/api/v1/part-requests/${id}/suppliers`)
      .then((response) => response.data);
  },

  updateSuppliers(id: number, selectedSellerIds: number[]) {
    return api
      .put<PartRequestSuppliersDto>(`/api/v1/part-requests/${id}/suppliers`, {
        selectedSellerIds,
      })
      .then((response) => response.data);
  },

  contactSupplier(id: number, sellerId: number) {
    return api
      .post<ContactPartRequestSupplierResponse>(
        `/api/v1/part-requests/${id}/suppliers/${sellerId}/contact`,
      )
      .then((response) => response.data);
  },

  skipSupplier(id: number, sellerId: number) {
    return api
      .post<SkipPartRequestSupplierResponse>(
        `/api/v1/part-requests/${id}/suppliers/${sellerId}/skip`,
      )
      .then((response) => response.data);
  },
};
