import type {
  RepresentativeCommissionDetailDto,
  RepresentativeCommissionsListParams,
  RepresentativeCommissionsListResponse,
  RepresentativeDashboardResponse,
  RepresentativeMeDto,
  RepresentativePayoutDetailDto,
  RepresentativePayoutsListParams,
  RepresentativePayoutsListResponse,
  RepresentativeReferralLinkResponse,
  RepresentativeSellerDetailDto,
  RepresentativeSellersListParams,
  RepresentativeSellersListResponse,
  RepresentativeStatementResponse,
  UpdateRepresentativeMePasswordRequest,
  UpdateRepresentativeMePasswordResponse,
  UpdateRepresentativeMeRequest,
  UpdateRepresentativeMeResponse,
} from "@/contracts/representative/portal";
import { api } from "@/lib/api";

/**
 * Portal autenticado do representante comercial (Sprint 10.6).
 */
export const representativePortalService = {
  getMe() {
    return api
      .get<RepresentativeMeDto>("/api/v1/representative/me")
      .then((response) => response.data);
  },

  updateMe(payload: UpdateRepresentativeMeRequest) {
    return api
      .put<UpdateRepresentativeMeResponse>("/api/v1/representative/me", payload)
      .then((response) => response.data);
  },

  changePassword(payload: UpdateRepresentativeMePasswordRequest) {
    return api
      .put<UpdateRepresentativeMePasswordResponse>(
        "/api/v1/representative/me/password",
        payload,
      )
      .then((response) => response.data);
  },

  getDashboard() {
    return api
      .get<RepresentativeDashboardResponse>("/api/v1/representative/dashboard")
      .then((response) => response.data);
  },

  listSellers(params: RepresentativeSellersListParams = {}) {
    return api
      .get<RepresentativeSellersListResponse>("/api/v1/representative/sellers", {
        params,
      })
      .then((response) => response.data);
  },

  getSeller(id: number) {
    return api
      .get<RepresentativeSellerDetailDto>(`/api/v1/representative/sellers/${id}`)
      .then((response) => response.data);
  },

  listCommissions(params: RepresentativeCommissionsListParams = {}) {
    return api
      .get<RepresentativeCommissionsListResponse>(
        "/api/v1/representative/commissions",
        { params },
      )
      .then((response) => response.data);
  },

  getCommission(id: number) {
    return api
      .get<RepresentativeCommissionDetailDto>(
        `/api/v1/representative/commissions/${id}`,
      )
      .then((response) => response.data);
  },

  getStatement() {
    return api
      .get<RepresentativeStatementResponse>("/api/v1/representative/statement")
      .then((response) => response.data);
  },

  getReferralLink() {
    return api
      .get<RepresentativeReferralLinkResponse>(
        "/api/v1/representative/referral-link",
      )
      .then((response) => response.data);
  },

  /** GET /api/v1/representative/payouts (Sprint 10.7) */
  listPayouts(params: RepresentativePayoutsListParams = {}) {
    return api
      .get<RepresentativePayoutsListResponse>(
        "/api/v1/representative/payouts",
        { params },
      )
      .then((response) => response.data);
  },

  getPayout(id: number) {
    return api
      .get<RepresentativePayoutDetailDto>(
        `/api/v1/representative/payouts/${id}`,
      )
      .then((response) => response.data);
  },
};
