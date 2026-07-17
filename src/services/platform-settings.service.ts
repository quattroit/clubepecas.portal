import type { PublicPlatformSettings } from "@/contracts/platform-settings";
import { api } from "@/lib/api";

/**
 * Configurações públicas de marca e contato da plataforma.
 */
export const platformSettingsService = {
  getPublic() {
    return api
      .get<PublicPlatformSettings>("/api/v1/platform-settings")
      .then((response) => response.data);
  },
};
