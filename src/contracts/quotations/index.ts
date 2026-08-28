import { QuotationStatus } from "@/contracts/common/enums";

/** POST /api/v1/quotations */
export type CreateQuotationItemRequest = {
  advertisementId: number;
  quantity: number;
  itemNotes?: string | null;
};

export type CreateQuotationRequest = {
  sellerId: number;
  generalNotes?: string | null;
  items: CreateQuotationItemRequest[];
};

export type CreateQuotationResponse = {
  id: number;
  number: string;
  sellerId: number;
  storeName: string;
  status: QuotationStatus;
  submittedAtUtc: string;
  generalNotes: string | null;
  itemCount: number;
  sellerWhatsApp: string | null;
  /** URL wa.me montada no backend após o envio. */
  whatsAppUrl: string | null;
};

/** GET /api/v1/quotations/me */
export type ListMyQuotationsParams = {
  page?: number;
  pageSize?: number;
  number?: string;
  seller?: string;
  status?: string;
  submittedFrom?: string;
  submittedTo?: string;
};

export type MyQuotationListItemDto = {
  id: number;
  number: string;
  submittedAtUtc: string;
  sellerId: number;
  storeName: string;
  itemCount: number;
  status: QuotationStatus;
};

export type ListMyQuotationsResponse = {
  items: MyQuotationListItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
};

/** GET /api/v1/seller/quotations */
export type ListSellerQuotationsParams = {
  page?: number;
  pageSize?: number;
  number?: string;
  buyer?: string;
  status?: string;
  submittedFrom?: string;
  submittedTo?: string;
};

export type SellerQuotationListItemDto = {
  id: number;
  number: string;
  submittedAtUtc: string;
  buyerName: string;
  buyerCompanyName: string | null;
  itemCount: number;
  status: QuotationStatus;
};

export type ListSellerQuotationsResponse = {
  items: SellerQuotationListItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
};

/** GET /api/v1/seller/quotations/{id} */
export type SellerQuotationItemDto = {
  id: number;
  advertisementId: number;
  title: string;
  advertisementCode: string;
  thumbnailUrl: string | null;
  quantity: number;
  itemNotes: string | null;
  unitPriceSnapshot: number | null;
  advertisementSlug: string | null;
};

export type SellerQuotationDetailDto = {
  id: number;
  number: string;
  submittedAtUtc: string;
  status: QuotationStatus;
  generalNotes: string | null;
  buyerName: string;
  buyerCompanyName: string | null;
  buyerWhatsApp: string | null;
  items: SellerQuotationItemDto[];
};

/** GET /api/v1/quotations/{id} — detalhe do comprador */
export type MyQuotationItemDto = {
  id: number;
  advertisementId: number;
  title: string;
  advertisementCode: string;
  thumbnailUrl: string | null;
  quantity: number;
  itemNotes: string | null;
  unitPriceSnapshot: number | null;
  advertisementSlug: string | null;
};

export type MyQuotationDetailDto = {
  id: number;
  number: string;
  submittedAtUtc: string;
  status: QuotationStatus;
  generalNotes: string | null;
  sellerId: number;
  storeName: string;
  sellerWhatsApp: string | null;
  items: MyQuotationItemDto[];
};

export function getQuotationStatusLabel(status: QuotationStatus): string {
  switch (status) {
    case QuotationStatus.Submitted:
      return "Enviada";
    case QuotationStatus.Quoted:
      return "Orçada";
    case QuotationStatus.Accepted:
      return "Aceita";
    case QuotationStatus.Closed:
      return "Encerrada";
    default:
      return "—";
  }
}
