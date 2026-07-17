import type { ListSubscriptionPlansResponse } from "@/contracts/seller/subscription";
import { api } from "@/lib/api";

/**
 * Catálogo público de planos de assinatura.
 * GET /api/v1/subscription-plans — apenas ativos.
 */
export const subscriptionPlanService = {
  listActive() {
    return api
      .get<ListSubscriptionPlansResponse>("/api/v1/subscription-plans")
      .then((response) => response.data);
  },
};
