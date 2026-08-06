"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CreateQuotationRequest } from "@/contracts/quotations";
import { queryKeys } from "@/lib/queryKeys";
import { quotationService } from "@/services/quotation.service";

/** POST /api/v1/quotations */
export function useCreateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateQuotationRequest) =>
      quotationService.create(request),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.quotations.all });
      toast.success(`Cotação ${data.number} enviada para ${data.storeName}!`);
    },
  });
}
