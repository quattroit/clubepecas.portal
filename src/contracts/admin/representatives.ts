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
  totalSellers: number;
};

export type AdminRepresentativesListResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  items: AdminRepresentativeListItemDto[];
};

export type AdminRepresentativeLinkedSellerDto = {
  id: number;
  storeName: string;
  displayName: string;
  email: string;
  planLabel: string;
  isActive: boolean;
  createdAt: string;
  subscriptionStatus?: number | null;
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
  totalSellers: number;
  sellersTotalPages: number;
  sellersCurrentPage: number;
  sellersPageSize: number;
  sellers: AdminRepresentativeLinkedSellerDto[];
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
  /** Senha inicial opcional para acesso ao portal do representante. */
  password?: string | null;
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

/** POST /api/v1/representatives/validate-code */
export type ValidateRepresentativeCodeRequest = {
  representativeCode: string;
};

export type ValidateRepresentativeCodeResponse = {
  name: string;
  representativeCode: string;
  status: RepresentativeStatus;
  statusLabel: string;
};

/** GET /api/v1/representatives/{code} — dados públicos (link de indicação) */
export type PublicRepresentativeResponse = ValidateRepresentativeCodeResponse;
