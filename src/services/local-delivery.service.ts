import type {
  EstimateLocalDeliveryRequest,
  EstimateLocalDeliveryResponse,
} from "@/contracts/local-delivery";
import { api } from "@/lib/api";

/**
 * Estimativa pública de Frete Local.
 */
export const localDeliveryService = {
  estimate(payload: EstimateLocalDeliveryRequest) {
    return api
      .post<EstimateLocalDeliveryResponse>(
        "/api/v1/local-delivery/estimate",
        payload,
      )
      .then((response) => response.data);
  },
};
