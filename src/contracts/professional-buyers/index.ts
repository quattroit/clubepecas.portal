import {
  ProfessionalBuyerSegment,
  ProfessionalBuyerStatus,
} from "@/contracts/common/enums";

export type ProfessionalBuyerDto = {
  id: number;
  userId: number;
  companyName: string;
  corporateName: string;
  document: string;
  contactName: string;
  email: string;
  phone: string;
  whatsApp: string;
  cityId: number;
  city: string;
  state: string;
  address: string;
  number: string;
  neighborhood: string;
  zipCode: string;
  segment: ProfessionalBuyerSegment;
  segmentLabel: string;
  status: ProfessionalBuyerStatus;
  statusLabel: string;
  createdAt: string;
  updatedAt: string | null;
};

/** POST /api/v1/professional-buyers (admin) */
export type CreateProfessionalBuyerRequest = {
  companyName: string;
  corporateName: string;
  document: string;
  contactName: string;
  email: string;
  phone: string;
  whatsApp: string;
  cityId: number;
  address: string;
  number: string;
  neighborhood: string;
  zipCode: string;
  segment: ProfessionalBuyerSegment;
  temporaryPassword: string;
};

/** PUT /api/v1/professional-buyers/me */
export type UpdateMyProfessionalBuyerRequest = {
  companyName: string;
  corporateName: string;
  contactName: string;
  email: string;
  phone: string;
  whatsApp: string;
  cityId: number;
  address: string;
  number: string;
  neighborhood: string;
  zipCode: string;
  segment: ProfessionalBuyerSegment;
};

export type ProfessionalBuyerStatusFilter =
  | "all"
  | "pending"
  | "active"
  | "suspended";

export type ProfessionalBuyerSortParam =
  | "companyName"
  | "corporateName"
  | "contactName"
  | "email"
  | "status"
  | "createdAt";

/** Query params de GET /api/v1/professional-buyers */
export type ListProfessionalBuyersParams = {
  q?: string;
  status?: Exclude<ProfessionalBuyerStatusFilter, "all">;
  page?: number;
  pageSize?: number;
  sort?: ProfessionalBuyerSortParam;
  sortDescending?: boolean;
};

export type ListProfessionalBuyersResponse = {
  items: ProfessionalBuyerDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export const PROFESSIONAL_BUYER_SEGMENT_OPTIONS: {
  value: ProfessionalBuyerSegment;
  label: string;
}[] = [
  {
    value: ProfessionalBuyerSegment.MechanicalWorkshop,
    label: "Oficina mecânica",
  },
  { value: ProfessionalBuyerSegment.BodyShop, label: "Funilaria" },
  { value: ProfessionalBuyerSegment.AutoElectric, label: "Auto elétrica" },
  {
    value: ProfessionalBuyerSegment.AutomotiveCenter,
    label: "Centro automotivo",
  },
  { value: ProfessionalBuyerSegment.Dealership, label: "Concessionária" },
  {
    value: ProfessionalBuyerSegment.Fleet,
    label: "Frota / transportadora",
  },
  { value: ProfessionalBuyerSegment.RentalCompany, label: "Locadora" },
  { value: ProfessionalBuyerSegment.Other, label: "Outro" },
];

export function isProfessionalBuyerActive(
  status: ProfessionalBuyerStatus,
): boolean {
  return status === ProfessionalBuyerStatus.Active;
}

export function isProfessionalBuyerPending(
  status: ProfessionalBuyerStatus,
): boolean {
  return status === ProfessionalBuyerStatus.Pending;
}

export function isProfessionalBuyerSuspended(
  status: ProfessionalBuyerStatus,
): boolean {
  return status === ProfessionalBuyerStatus.Suspended;
}
