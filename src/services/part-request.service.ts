import type {
  CreatePartRequestRequest,
  ListMyPartRequestsParams,
  ListMyPartRequestsResponse,
  PartRequestDto,
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
};
