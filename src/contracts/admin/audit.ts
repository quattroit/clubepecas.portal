export type AdminAuditListParams = {
  from?: string;
  to?: string;
  userId?: number;
  action?: string;
  success?: boolean;
  page?: number;
  pageSize?: number;
};

export type AdminAuditListItemDto = {
  id: number;
  occurredAtUtc: string;
  userId: number | null;
  userEmail: string | null;
  userFullName: string | null;
  sellerId: number | null;
  action: string;
  entityName: string | null;
  entityId: number | null;
  description: string;
  ipAddress: string | null;
  userAgent: string | null;
  success: boolean;
};

export type AdminAuditListResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  items: AdminAuditListItemDto[];
};
