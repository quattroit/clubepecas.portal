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
import type {
  CancelSellerSubscriptionRenewalRequest,
  CancelSellerSubscriptionRenewalResponse,
  ChangeSellerSubscriptionCheckoutRequest,
  ChangeSellerSubscriptionCheckoutResponse,
  CreateSellerSubscriptionCheckoutRequest,
  CreateSellerSubscriptionCheckoutResponse,
  CreateSellerSubscriptionRequest,
  DowngradeSellerSubscriptionRequest,
  DowngradeSellerSubscriptionResponse,
  ListSellerSubscriptionHistoryResponse,
  ListSellerSubscriptionPaymentsResponse,
  ListSellerSubscriptionsResponse,
  PaymentRecoveryResponse,
  ReactivateSellerSubscriptionResponse,
  SellerSubscriptionDto,
  SyncSellerSubscriptionPaymentResponse,
} from "@/contracts/seller/subscription";
import type { ListSellerPaymentsResponse } from "@/contracts/seller/payments";
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

  /** GET /api/v1/seller/subscription — Central de Gestão da Assinatura (Sprint 8.4). */
  getCurrentSubscription() {
    return api
      .get<SellerSubscriptionDto>("/api/v1/seller/subscription")
      .then((response) => response.data);
  },

  /** GET /api/v1/seller/subscriptions — histórico de vínculos com planos. */
  listSubscriptions() {
    return api
      .get<ListSellerSubscriptionsResponse>("/api/v1/seller/subscriptions")
      .then((response) => response.data);
  },

  /** GET /api/v1/seller/subscription/payments — histórico financeiro da assinatura. */
  listSubscriptionPayments() {
    return api
      .get<ListSellerSubscriptionPaymentsResponse>(
        "/api/v1/seller/subscription/payments",
      )
      .then((response) => response.data);
  },

  /** GET /api/v1/seller/subscription/history — eventos (audit + webhooks). */
  listSubscriptionHistory() {
    return api
      .get<ListSellerSubscriptionHistoryResponse>(
        "/api/v1/seller/subscription/history",
      )
      .then((response) => response.data);
  },

  /** POST /api/v1/seller/subscription */
  createSubscription(payload: CreateSellerSubscriptionRequest) {
    return api
      .post<SellerSubscriptionDto>("/api/v1/seller/subscription", payload)
      .then((response) => response.data);
  },

  /** POST /api/v1/seller/subscription/checkout — Hosted Checkout Asaas */
  createSubscriptionCheckout(payload: CreateSellerSubscriptionCheckoutRequest) {
    return api
      .post<CreateSellerSubscriptionCheckoutResponse>(
        "/api/v1/seller/subscription/checkout",
        payload,
      )
      .then((response) => response.data);
  },

  /** PUT /api/v1/seller/subscription/upgrade */
  upgradeSubscription(payload: ChangeSellerSubscriptionCheckoutRequest) {
    return api
      .put<ChangeSellerSubscriptionCheckoutResponse>(
        "/api/v1/seller/subscription/upgrade",
        payload,
      )
      .then((response) => response.data);
  },

  /** PUT /api/v1/seller/subscription/downgrade */
  downgradeSubscription(payload: DowngradeSellerSubscriptionRequest) {
    return api
      .put<DowngradeSellerSubscriptionResponse>(
        "/api/v1/seller/subscription/downgrade",
        payload,
      )
      .then((response) => response.data);
  },

  /** PUT /api/v1/seller/subscription/change-billing-cycle */
  changeSubscriptionBillingCycle(
    payload: ChangeSellerSubscriptionCheckoutRequest,
  ) {
    return api
      .put<ChangeSellerSubscriptionCheckoutResponse>(
        "/api/v1/seller/subscription/change-billing-cycle",
        payload,
      )
      .then((response) => response.data);
  },

  /** PUT /api/v1/seller/subscription/cancel — soft cancel da renovação */
  cancelSubscriptionRenewal(payload?: CancelSellerSubscriptionRenewalRequest) {
    return api
      .put<CancelSellerSubscriptionRenewalResponse>(
        "/api/v1/seller/subscription/cancel",
        payload ?? {},
      )
      .then((response) => response.data);
  },

  /** PUT /api/v1/seller/subscription/reactivate */
  reactivateSubscription() {
    return api
      .put<ReactivateSellerSubscriptionResponse>(
        "/api/v1/seller/subscription/reactivate",
      )
      .then((response) => response.data);
  },

  /** POST /api/v1/seller/subscription/retry-payment */
  retrySubscriptionPayment() {
    return api
      .post<PaymentRecoveryResponse>(
        "/api/v1/seller/subscription/retry-payment",
      )
      .then((response) => response.data);
  },

  /** POST /api/v1/seller/subscription/new-charge */
  createSubscriptionNewCharge() {
    return api
      .post<PaymentRecoveryResponse>(
        "/api/v1/seller/subscription/new-charge",
      )
      .then((response) => response.data);
  },

  /** POST /api/v1/seller/subscription/sync-payment — sincroniza com Asaas após checkout. */
  syncSubscriptionPayment() {
    return api
      .post<SyncSellerSubscriptionPaymentResponse>(
        "/api/v1/seller/subscription/sync-payment",
      )
      .then((response) => response.data);
  },

  /** DELETE /api/v1/seller/subscription — alias soft-cancel (Sprint 8.5). */
  cancelSubscription() {
    return api
      .delete<SellerSubscriptionDto>("/api/v1/seller/subscription")
      .then((response) => response.data);
  },

  /** GET /api/v1/seller/payments — histórico financeiro legado. */
  listPayments() {
    return api
      .get<ListSellerPaymentsResponse>("/api/v1/seller/payments")
      .then((response) => response.data);
  },

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return api
      .post<{ photoUrl: string; thumbnailPublicUrl?: string | null }>(
        "/api/v1/seller/me/photo/upload",
        formData,
        { timeout: 120_000 },
      )
      .then((response) => response.data);
  },

  deletePhoto() {
    return api
      .delete<{ sellerId: number }>("/api/v1/seller/me/photo")
      .then((response) => response.data);
  },
};
