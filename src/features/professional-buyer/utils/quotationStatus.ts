import type { VariantProps } from "class-variance-authority";

import { badgeVariants } from "@/components/ui/badge";
import { QuotationStatus } from "@/contracts/common/enums";
import { getQuotationStatusLabel } from "@/contracts/quotations";

export { getQuotationStatusLabel };

export type QuotationStatusFilter =
  | "all"
  | "Submitted"
  | "Quoted"
  | "Accepted"
  | "Closed";

export function getQuotationStatusBadgeVariant(
  status: QuotationStatus,
): NonNullable<VariantProps<typeof badgeVariants>["variant"]> {
  switch (status) {
    case QuotationStatus.Submitted:
      return "secondary";
    case QuotationStatus.Quoted:
      return "warning";
    case QuotationStatus.Accepted:
      return "success";
    case QuotationStatus.Closed:
      return "outline";
    default:
      return "outline";
  }
}

export const QUOTATION_STATUS_FILTER_OPTIONS: {
  value: QuotationStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "Todos" },
  { value: "Submitted", label: "Enviada" },
  { value: "Quoted", label: "Orçada" },
  { value: "Accepted", label: "Aceita" },
  { value: "Closed", label: "Encerrada" },
];
