import type {
  ProfessionalBuyerDto,
  UpdateMyProfessionalBuyerRequest,
} from "@/contracts/professional-buyers";
import { api } from "@/lib/api";

/**
 * Perfil do comprador profissional autenticado.
 * GET/PUT /api/v1/professional-buyers/me
 */
export const professionalBuyerService = {
  getMe() {
    return api
      .get<ProfessionalBuyerDto>("/api/v1/professional-buyers/me")
      .then((response) => response.data);
  },

  updateMe(payload: UpdateMyProfessionalBuyerRequest) {
    return api
      .put<ProfessionalBuyerDto>("/api/v1/professional-buyers/me", payload)
      .then((response) => response.data);
  },
};
