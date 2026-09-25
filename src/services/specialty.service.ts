import type { GetSpecialtiesResponse } from "@/contracts/specialties/responses";
import { api } from "@/lib/api";

/**
 * Catálogo público de especialidades de vendedor.
 * GET /api/v1/specialties — apenas ativas por padrão.
 */
export const specialtyService = {
  listSpecialties() {
    return api
      .get<GetSpecialtiesResponse>("/api/v1/specialties")
      .then((response) => response.data);
  },
};
