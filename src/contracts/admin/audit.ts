export type AdminAuditListParams = {
  from?: string;
  to?: string;
  userId?: string;
  action?: string;
  success?: boolean;
  page?: number;
  pageSize?: number;
};

export type AdminAuditListItemDto = {
  id: string;
  occurredAtUtc: string;
  userId: string | null;
  userEmail: string | null;
  userFullName: string | null;
  sellerId: string | null;
  action: string;
  entityName: string | null;
  entityId: string | null;
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
