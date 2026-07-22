import type {
  PublicRepresentativeResponse,
  ValidateRepresentativeCodeRequest,
  ValidateRepresentativeCodeResponse,
} from "@/contracts/admin/representatives";
import { api } from "@/lib/api";

export const representativesService = {
  getByCode(code: string) {
    const normalized = encodeURIComponent(code.trim().toUpperCase());
    return api
      .get<PublicRepresentativeResponse>(
        `/api/v1/representatives/${normalized}`,
      )
      .then((response) => response.data);
  },

  validateCode(payload: ValidateRepresentativeCodeRequest) {
    return api
      .post<ValidateRepresentativeCodeResponse>(
        "/api/v1/representatives/validate-code",
        payload,
      )
      .then((response) => response.data);
  },
};
