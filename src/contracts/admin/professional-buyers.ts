/**
 * Reexports dos contratos de compradores profissionais usados na área admin.
 * Endpoints admin compartilham `/api/v1/professional-buyers`.
 */
export type {
  CreateProfessionalBuyerRequest,
  ListProfessionalBuyersParams,
  ListProfessionalBuyersResponse,
  ProfessionalBuyerDto,
  ProfessionalBuyerSortParam,
  ProfessionalBuyerStatusFilter,
} from "@/contracts/professional-buyers";

export {
  PROFESSIONAL_BUYER_SEGMENT_OPTIONS,
  isProfessionalBuyerActive,
  isProfessionalBuyerPending,
  isProfessionalBuyerSuspended,
} from "@/contracts/professional-buyers";
