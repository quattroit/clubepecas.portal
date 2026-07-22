/** Status do representante (espelha RepresentativeStatus do backend). */
export type RepresentativeStatus = "Active" | "Inactive" | 1 | 2;

export type AdminRepresentativeStatusFilter = "all" | "active" | "inactive";

export type AdminRepresentativeSortParam =
  | "createdAt"
  | "name"
  | "email"
  | "code"
  | "status";

export type AdminRepresentativeSortDir = "asc" | "desc";

/** Query params de GET /api/v1/admin/representatives */
export type AdminRepresentativesListParams = {
  page?: number;
  pageSize?: number;
  name?: string;
  email?: string;
  code?: string;
  status?: AdminRepresentativeStatusFilter;
  sort?: AdminRepresentativeSortParam;
  sortDir?: AdminRepresentativeSortDir;
};

export type AdminRepresentativeListItemDto = {
  id: number;
  representativeCode: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  status: RepresentativeStatus;
  statusLabel: string;
  createdAt: string;
};

export type AdminRepresentativesListResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  items: AdminRepresentativeListItemDto[];
};

export type AdminRepresentativeDetailDto = {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: string;
  representativeCode: string;
  status: RepresentativeStatus;
  statusLabel: string;
  zipCode: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  createdAt: string;
  updatedAt: string | null;
};

export type CreateAdminRepresentativeRequest = {
  name: string;
  email: string;
  phone: string;
  document: string;
  zipCode: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  status?: number;
};

export type UpdateAdminRepresentativeRequest = {
  name: string;
  email: string;
  phone: string;
  zipCode: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  status: number;
};

export function isRepresentativeActive(
  status: RepresentativeStatus,
): boolean {
  return status === "Active" || status === 1;
}
