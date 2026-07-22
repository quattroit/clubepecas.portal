"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { UpdateRepresentativeMeRequest } from "@/contracts/representative/portal";
import { queryKeys } from "@/lib/queryKeys";
import { representativePortalService } from "@/services/representative-portal.service";

/**
 * Atualiza perfil do representante. Invalida apenas queryKeys.representative.me.
 */
export function useUpdateRepresentativeMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRepresentativeMeRequest) =>
      representativePortalService.updateMe(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.representative.me });
      toast.success("Perfil atualizado com sucesso!");
    },
  });
}
