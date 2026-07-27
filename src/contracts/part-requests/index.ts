import {
  PartRequestStatus,
  PartRequestSupplierContactStatus,
} from "@/contracts/common/enums";

export type PartRequestDto = {
  id: number;
  professionalBuyerId: number;
  title: string;
  description: string | null;
  vehicleBrandId: number;
  vehicleBrandName: string;
  vehicleModelId: number;
  vehicleModelName: string;
  manufacturingYear: number;
  modelYear: number | null;
  engine: string | null;
  categoryId: number;
  categoryName: string;
  requestedQuantity: number;
  cityId: number;
  cityName: string;
  cityState: string;
  maximumSuppliers: number;
  status: PartRequestStatus;
  statusLabel: string;
  createdAt: string;
  updatedAt: string | null;
};

export type CreatePartRequestRequest = {
  title: string;
  description?: string | null;
  vehicleBrandId: number;
  vehicleModelId: number;
  manufacturingYear: number;
  modelYear?: number | null;
  engine?: string | null;
  categoryId: number;
  requestedQuantity: number;
  cityId: number;
  maximumSuppliers: number;
};

export type UpdatePartRequestRequest = CreatePartRequestRequest;

export type PartRequestStatusFilter =
  | "all"
  | "Draft"
  | "Open"
  | "Cancelled"
  | "Completed";

export type ListMyPartRequestsParams = {
  q?: string;
  status?: Exclude<PartRequestStatusFilter, "all">;
  page?: number;
  pageSize?: number;
};

export type PartRequestsSummaryDto = {
  total: number;
  open: number;
  cancelled: number;
  completed: number;
  draft: number;
  suppliersFound: number;
  suppliersContacted: number;
  suppliersPending: number;
};

export type PartRequestSupplierContactSummaryDto = {
  selected: number;
  contacted: number;
  pending: number;
  skipped: number;
};

export type PartRequestSupplierDto = {
  id: number;
  sellerId: number;
  storeName: string;
  cityName: string;
  cityState: string;
  compatibleAdvertisementCount: number;
  phone: string | null;
  whatsApp: string;
  photoUrl: string | null;
  selected: boolean;
  sameCityAsRequest: boolean;
  displayOrder: number;
  contactStatus: PartRequestSupplierContactStatus;
  contactStatusLabel: string;
  contactedAt: string | null;
  contactMessage: string | null;
};

export type PartRequestSuppliersDto = {
  partRequestId: number;
  maximumSuppliers: number;
  selectedCount: number;
  contactSummary: PartRequestSupplierContactSummaryDto;
  nextPendingSellerId: number | null;
  items: PartRequestSupplierDto[];
};

export type ContactPartRequestSupplierResponse = {
  partRequestId: number;
  sellerId: number;
  storeName: string;
  whatsApp: string;
  message: string;
  whatsAppUrl: string;
  contactStatus: PartRequestSupplierContactStatus;
  contactedAt: string;
  nextPendingSellerId: number | null;
};

export type SkipPartRequestSupplierResponse = {
  partRequestId: number;
  sellerId: number;
  contactStatus: PartRequestSupplierContactStatus;
  nextPendingSellerId: number | null;
  allProcessed: boolean;
};

export type UpdatePartRequestSuppliersRequest = {
  selectedSellerIds: number[];
};

export type ListMyPartRequestsResponse = {
  items: PartRequestDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  summary: PartRequestsSummaryDto;
};

export function isPartRequestOpen(status: PartRequestStatus): boolean {
  return status === PartRequestStatus.Open;
}

export function isPartRequestEditable(status: PartRequestStatus): boolean {
  return status === PartRequestStatus.Open;
}

export function isPartRequestCancellable(status: PartRequestStatus): boolean {
  return status === PartRequestStatus.Open;
}
