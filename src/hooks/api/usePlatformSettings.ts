"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { platformSettingsService } from "@/services/platform-settings.service";

export function usePlatformSettings() {
  return useQuery({
    queryKey: queryKeys.platformSettings,
    queryFn: () => platformSettingsService.getPublic(),
    staleTime: 5 * 60 * 1000,
  });
}
