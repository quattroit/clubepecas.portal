import type {
  AdminAdvertisementDetailResponse,
  AdminAdvertisementsListParams,
  AdminAdvertisementsListResponse,
  UpdateAdminAdvertisementStatusRequest,
  UpdateAdminAdvertisementStatusResponse,
} from "@/contracts/admin/advertisements";
import type { AdminAnalyticsResponse } from "@/contracts/admin/analytics";
import type {
  AdminAuditListParams,
  AdminAuditListResponse,
} from "@/contracts/admin/audit";
import type {
  FileCleanupResultDto,
  FileIntegrityReportDto,
} from "@/contracts/admin/files";
import type {
  AdminCategoriesListParams,
  CreateAdminCategoryRequest,
  GetAdminCategoriesResponse,
  ReorderAdminCategoriesRequest,
  ReorderAdminCategoriesResponse,
  UpdateAdminCategoryRequest,
  UpdateAdminCategoryStatusRequest,
  UpdateAdminCategoryStatusResponse,
} from "@/contracts/admin/categories";
import type {
  AdminCitiesListParams,
  CreateAdminCityRequest,
  GetAdminCitiesResponse,
  ReorderAdminCitiesRequest,
  ReorderAdminCitiesResponse,
  UpdateAdminCityRequest,
  UpdateAdminCityStatusRequest,
  UpdateAdminCityStatusResponse,
} from "@/contracts/admin/cities";
import type {
  AdminRepresentativeDetailDto,
  AdminRepresentativesListParams,
  AdminRepresentativesListResponse,
  CreateAdminRepresentativeRequest,
  UpdateAdminRepresentativeRequest,
} from "@/contracts/admin/representatives";
import type {
  AdminVehicleBrandsListParams,
  CreateAdminVehicleBrandRequest,
  GetAdminVehicleBrandsResponse,
  ReorderAdminVehicleBrandsRequest,
  ReorderAdminVehicleBrandsResponse,
  UpdateAdminVehicleBrandRequest,
  UpdateAdminVehicleBrandStatusRequest,
  UpdateAdminVehicleBrandStatusResponse,
} from "@/contracts/admin/vehicle-brands";
import type {
  AdminVehicleModelsListParams,
  CreateAdminVehicleModelRequest,
  GetAdminVehicleModelsResponse,
  ReorderAdminVehicleModelsRequest,
  ReorderAdminVehicleModelsResponse,
  UpdateAdminVehicleModelRequest,
  UpdateAdminVehicleModelStatusRequest,
  UpdateAdminVehicleModelStatusResponse,
} from "@/contracts/admin/vehicle-models";
import type {
  AdminDashboardResponse,
  MetricsPeriodParam,
} from "@/contracts/admin/dashboard";
import type {
  AdminSellerDetailResponse,
  AdminSellersListParams,
  AdminSellersListResponse,
  UpdateAdminSellerRepresentativeRequest,
  UpdateAdminSellerRepresentativeResponse,
  UpdateAdminSellerStatusRequest,
  UpdateAdminSellerStatusResponse,
} from "@/contracts/admin/sellers";
import type {
  PlatformSettingsResponse,
  UpdatePlatformSettingsRequest,
} from "@/contracts/admin/settings";
import type {
  AdminFinancialDashboardResponse,
} from "@/contracts/admin/financial";
import type {
  ListAdminPaymentsParams,
  ListAdminPaymentsResponse,
  SyncAdminPaymentResponse,
} from "@/contracts/admin/payments";
import type {
  AdminSubscriptionPlanDetailDto,
  CreateAdminSubscriptionPlanRequest,
  GetAdminSubscriptionPlansResponse,
  UpdateAdminSubscriptionPlanRequest,
} from "@/contracts/admin/subscription-plans";
import { api } from "@/lib/api";

/**
 * Serviços da área administrativa.
 */
export const adminService = {
  getDashboard(period: MetricsPeriodParam = "all") {
    return api
      .get<AdminDashboardResponse>("/api/v1/admin/dashboard", {
        params: { period },
      })
      .then((response) => response.data);
  },

  getAnalytics(period: MetricsPeriodParam = "all") {
    return api
      .get<AdminAnalyticsResponse>("/api/v1/admin/analytics", {
        params: { period },
      })
      .then((response) => response.data);
  },

  getPlatformSettings() {
    return api
      .get<PlatformSettingsResponse>("/api/v1/admin/platform-settings")
      .then((response) => response.data);
  },

  updatePlatformSettings(payload: UpdatePlatformSettingsRequest) {
    return api
      .put<PlatformSettingsResponse>(
        "/api/v1/admin/platform-settings",
        payload,
      )
      .then((response) => response.data);
  },

  listSellers(params: AdminSellersListParams = {}) {
    return api
      .get<AdminSellersListResponse>("/api/v1/admin/sellers", { params })
      .then((response) => response.data);
  },

  getSeller(id: number, period: MetricsPeriodParam = "all") {
    return api
      .get<AdminSellerDetailResponse>(`/api/v1/admin/sellers/${id}`, {
        params: { period },
      })
      .then((response) => response.data);
  },

  updateSellerStatus(id: number, payload: UpdateAdminSellerStatusRequest) {
    return api
      .put<UpdateAdminSellerStatusResponse>(
        `/api/v1/admin/sellers/${id}/status`,
        payload,
      )
      .then((response) => response.data);
  },

  updateSellerRepresentative(
    sellerId: number,
    payload: UpdateAdminSellerRepresentativeRequest,
  ) {
    return api
      .put<UpdateAdminSellerRepresentativeResponse>(
        `/api/v1/admin/sellers/${sellerId}/representative`,
        payload,
      )
      .then((response) => response.data);
  },

  listAdvertisements(params: AdminAdvertisementsListParams = {}) {
    return api
      .get<AdminAdvertisementsListResponse>("/api/v1/admin/advertisements", {
        params,
      })
      .then((response) => response.data);
  },

  getAdvertisement(id: number, period: MetricsPeriodParam = "all") {
    return api
      .get<AdminAdvertisementDetailResponse>(
        `/api/v1/admin/advertisements/${id}`,
        { params: { period } },
      )
      .then((response) => response.data);
  },

  updateAdvertisementStatus(
    id: number,
    payload: UpdateAdminAdvertisementStatusRequest,
  ) {
    return api
      .put<UpdateAdminAdvertisementStatusResponse>(
        `/api/v1/admin/advertisements/${id}/status`,
        payload,
      )
      .then((response) => response.data);
  },

  listCategories(params: AdminCategoriesListParams = {}) {
    return api
      .get<GetAdminCategoriesResponse>("/api/v1/admin/categories", {
        params,
      })
      .then((response) => response.data);
  },

  createCategory(payload: CreateAdminCategoryRequest) {
    return api
      .post<GetAdminCategoriesResponse["items"][number]>(
        "/api/v1/admin/categories",
        payload,
      )
      .then((response) => response.data);
  },

  updateCategory(id: number, payload: UpdateAdminCategoryRequest) {
    return api
      .put<GetAdminCategoriesResponse["items"][number]>(
        `/api/v1/admin/categories/${id}`,
        payload,
      )
      .then((response) => response.data);
  },

  updateCategoryStatus(
    id: number,
    payload: UpdateAdminCategoryStatusRequest,
  ) {
    return api
      .put<UpdateAdminCategoryStatusResponse>(
        `/api/v1/admin/categories/${id}/status`,
        payload,
      )
      .then((response) => response.data);
  },

  reorderCategories(payload: ReorderAdminCategoriesRequest) {
    return api
      .put<ReorderAdminCategoriesResponse>(
        "/api/v1/admin/categories/reorder",
        payload,
      )
      .then((response) => response.data);
  },

  listCities(params: AdminCitiesListParams = {}) {
    return api
      .get<GetAdminCitiesResponse>("/api/v1/admin/cities", {
        params,
      })
      .then((response) => response.data);
  },

  createCity(payload: CreateAdminCityRequest) {
    return api
      .post<GetAdminCitiesResponse["items"][number]>(
        "/api/v1/admin/cities",
        payload,
      )
      .then((response) => response.data);
  },

  updateCity(id: number, payload: UpdateAdminCityRequest) {
    return api
      .put<GetAdminCitiesResponse["items"][number]>(
        `/api/v1/admin/cities/${id}`,
        payload,
      )
      .then((response) => response.data);
  },

  updateCityStatus(id: number, payload: UpdateAdminCityStatusRequest) {
    return api
      .put<UpdateAdminCityStatusResponse>(
        `/api/v1/admin/cities/${id}/status`,
        payload,
      )
      .then((response) => response.data);
  },

  reorderCities(payload: ReorderAdminCitiesRequest) {
    return api
      .put<ReorderAdminCitiesResponse>(
        "/api/v1/admin/cities/reorder",
        payload,
      )
      .then((response) => response.data);
  },

  listRepresentatives(params: AdminRepresentativesListParams = {}) {
    return api
      .get<AdminRepresentativesListResponse>(
        "/api/v1/admin/representatives",
        { params },
      )
      .then((response) => response.data);
  },

  getRepresentative(
    id: number,
    params: { sellersPage?: number; sellersPageSize?: number } = {},
  ) {
    return api
      .get<AdminRepresentativeDetailDto>(
        `/api/v1/admin/representatives/${id}`,
        { params },
      )
      .then((response) => response.data);
  },

  createRepresentative(payload: CreateAdminRepresentativeRequest) {
    return api
      .post<AdminRepresentativeDetailDto>(
        "/api/v1/admin/representatives",
        payload,
      )
      .then((response) => response.data);
  },

  updateRepresentative(id: number, payload: UpdateAdminRepresentativeRequest) {
    return api
      .put<AdminRepresentativeDetailDto>(
        `/api/v1/admin/representatives/${id}`,
        payload,
      )
      .then((response) => response.data);
  },

  activateRepresentative(id: number) {
    return api
      .patch<AdminRepresentativeDetailDto>(
        `/api/v1/admin/representatives/${id}/activate`,
      )
      .then((response) => response.data);
  },

  deactivateRepresentative(id: number) {
    return api
      .patch<AdminRepresentativeDetailDto>(
        `/api/v1/admin/representatives/${id}/deactivate`,
      )
      .then((response) => response.data);
  },

  listVehicleBrands(params: AdminVehicleBrandsListParams = {}) {
    return api
      .get<GetAdminVehicleBrandsResponse>("/api/v1/admin/vehicle-brands", {
        params,
      })
      .then((response) => response.data);
  },

  createVehicleBrand(payload: CreateAdminVehicleBrandRequest) {
    return api
      .post<GetAdminVehicleBrandsResponse["items"][number]>(
        "/api/v1/admin/vehicle-brands",
        payload,
      )
      .then((response) => response.data);
  },

  updateVehicleBrand(id: number, payload: UpdateAdminVehicleBrandRequest) {
    return api
      .put<GetAdminVehicleBrandsResponse["items"][number]>(
        `/api/v1/admin/vehicle-brands/${id}`,
        payload,
      )
      .then((response) => response.data);
  },

  updateVehicleBrandStatus(
    id: number,
    payload: UpdateAdminVehicleBrandStatusRequest,
  ) {
    return api
      .put<UpdateAdminVehicleBrandStatusResponse>(
        `/api/v1/admin/vehicle-brands/${id}/status`,
        payload,
      )
      .then((response) => response.data);
  },

  reorderVehicleBrands(payload: ReorderAdminVehicleBrandsRequest) {
    return api
      .put<ReorderAdminVehicleBrandsResponse>(
        "/api/v1/admin/vehicle-brands/reorder",
        payload,
      )
      .then((response) => response.data);
  },

  listVehicleModels(params: AdminVehicleModelsListParams = {}) {
    return api
      .get<GetAdminVehicleModelsResponse>("/api/v1/admin/vehicle-models", {
        params,
      })
      .then((response) => response.data);
  },

  listVehicleModelsByBrand(brandId: number) {
    return api
      .get<GetAdminVehicleModelsResponse>(
        `/api/v1/admin/vehicle-models/by-brand/${brandId}`,
      )
      .then((response) => response.data);
  },

  createVehicleModel(payload: CreateAdminVehicleModelRequest) {
    return api
      .post<GetAdminVehicleModelsResponse["items"][number]>(
        "/api/v1/admin/vehicle-models",
        payload,
      )
      .then((response) => response.data);
  },

  updateVehicleModel(id: number, payload: UpdateAdminVehicleModelRequest) {
    return api
      .put<GetAdminVehicleModelsResponse["items"][number]>(
        `/api/v1/admin/vehicle-models/${id}`,
        payload,
      )
      .then((response) => response.data);
  },

  updateVehicleModelStatus(
    id: number,
    payload: UpdateAdminVehicleModelStatusRequest,
  ) {
    return api
      .put<UpdateAdminVehicleModelStatusResponse>(
        `/api/v1/admin/vehicle-models/${id}/status`,
        payload,
      )
      .then((response) => response.data);
  },

  reorderVehicleModels(payload: ReorderAdminVehicleModelsRequest) {
    return api
      .put<ReorderAdminVehicleModelsResponse>(
        "/api/v1/admin/vehicle-models/reorder",
        payload,
      )
      .then((response) => response.data);
  },

  listSubscriptionPlans() {
    return api
      .get<GetAdminSubscriptionPlansResponse>(
        "/api/v1/admin/subscription-plans",
      )
      .then((response) => response.data);
  },

  getSubscriptionPlan(id: number) {
    return api
      .get<AdminSubscriptionPlanDetailDto>(
        `/api/v1/admin/subscription-plans/${id}`,
      )
      .then((response) => response.data);
  },

  createSubscriptionPlan(payload: CreateAdminSubscriptionPlanRequest) {
    return api
      .post<AdminSubscriptionPlanDetailDto>(
        "/api/v1/admin/subscription-plans",
        payload,
      )
      .then((response) => response.data);
  },

  updateSubscriptionPlan(
    id: number,
    payload: UpdateAdminSubscriptionPlanRequest,
  ) {
    return api
      .put<AdminSubscriptionPlanDetailDto>(
        `/api/v1/admin/subscription-plans/${id}`,
        payload,
      )
      .then((response) => response.data);
  },

  deleteSubscriptionPlan(id: number) {
    return api
      .delete(`/api/v1/admin/subscription-plans/${id}`)
      .then((response) => response.data);
  },

  listPayments(params: ListAdminPaymentsParams = {}) {
    return api
      .get<ListAdminPaymentsResponse>("/api/v1/admin/payments", { params })
      .then((response) => response.data);
  },

  syncPayment(paymentId: number) {
    return api
      .post<SyncAdminPaymentResponse>(`/api/v1/admin/payments/${paymentId}/sync`)
      .then((response) => response.data);
  },

  /** GET /api/v1/admin/financial/dashboard */
  getFinancialDashboard() {
    return api
      .get<AdminFinancialDashboardResponse>(
        "/api/v1/admin/financial/dashboard",
      )
      .then((response) => response.data);
  },

  listAuditLogs(params: AdminAuditListParams = {}) {
    return api
      .get<AdminAuditListResponse>("/api/v1/admin/audit", { params })
      .then((response) => response.data);
  },

  checkFileIntegrity() {
    return api
      .get<FileIntegrityReportDto>("/api/v1/admin/files/integrity")
      .then((response) => response.data);
  },

  cleanupOrphanFiles(dryRun: boolean) {
    return api
      .post<FileCleanupResultDto>("/api/v1/admin/files/cleanup", null, {
        params: { dryRun },
      })
      .then((response) => response.data);
  },
};
