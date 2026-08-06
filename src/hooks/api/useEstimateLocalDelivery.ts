"use client";

import { useMutation } from "@tanstack/react-query";

import type { EstimateLocalDeliveryRequest } from "@/contracts/local-delivery";
import { localDeliveryService } from "@/services/local-delivery.service";

/**
 * Calcula estimativa de Frete Local (público).
 */
export function useEstimateLocalDelivery() {
  return useMutation({
    mutationFn: (payload: EstimateLocalDeliveryRequest) =>
      localDeliveryService.estimate(payload),
  });
}
