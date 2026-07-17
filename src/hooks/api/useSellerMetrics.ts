"use client";

import { useQuery } from "@tanstack/react-query";

import type { MetricsPeriodParam } from "@/contracts/seller/metrics";
import { useAuthQueryEnabled } from "@/hooks/useAuthQueryEnabled";
import { queryKeys } from "@/lib/queryKeys";
import { sellerService } from "@/services/seller.service";

/**
 * Métricas consolidadas do painel do vendedor (uma requisição).
 */
export function useSellerMetrics(period: MetricsPeriodParam = "all") {
  const authReady = useAuthQueryEnabled();

  return useQuery({
    queryKey: queryKeys.seller.metrics(period),
    queryFn: () => sellerService.getMyMetrics(period),
    enabled: authReady,
    retry: false,
    refetchOnMount: "always",
  });
}
