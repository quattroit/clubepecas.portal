import type {
  ValidateRepresentativeCodeRequest,
  ValidateRepresentativeCodeResponse,
} from "@/contracts/admin/representatives";
import { api } from "@/lib/api";

export const representativesService = {
  validateCode(payload: ValidateRepresentativeCodeRequest) {
    return api
      .post<ValidateRepresentativeCodeResponse>(
        "/api/v1/representatives/validate-code",
        payload,
      )
      .then((response) => response.data);
  },
};
