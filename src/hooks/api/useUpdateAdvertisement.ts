"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { UpdateAdvertisementRequest } from "@/contracts/advertisements/requests";
import { ROUTES } from "@/constants/routes";
import { queryKeys } from "@/lib/queryKeys";
import { advertisementService } from "@/services/advertisement.service";

type UpdateAdvertisementInput = {
  id: string;
  request: UpdateAdvertisementRequest;
};

/**
 * Atualiza dados do anúncio. Fotos são gerenciadas em endpoint dedicado.
 */
export function useUpdateAdvertisement() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, request }: UpdateAdvertisementInput) => {
      return advertisementService.update(id, request);
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.advertisements.me,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.advertisements.detail(variables.id),
      });
      toast.success("Anúncio atualizado com sucesso!");
      router.replace(ROUTES.MY_ADVERTISEMENTS);
    },
  });
}
