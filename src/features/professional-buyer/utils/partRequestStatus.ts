import { badgeVariants } from "@/components/ui/badge";
import { PartRequestStatus } from "@/contracts/common/enums";
import type { VariantProps } from "class-variance-authority";

export function getPartRequestStatusLabel(status: PartRequestStatus): string {
  switch (status) {
    case PartRequestStatus.Draft:
      return "Rascunho";
    case PartRequestStatus.Open:
      return "Aberta";
    case PartRequestStatus.Cancelled:
      return "Cancelada";
    case PartRequestStatus.Completed:
      return "Concluída";
    default:
      return "Desconhecido";
  }
}

export function getPartRequestStatusBadgeVariant(
  status: PartRequestStatus,
): NonNullable<VariantProps<typeof badgeVariants>["variant"]> {
  switch (status) {
    case PartRequestStatus.Open:
      return "success";
    case PartRequestStatus.Cancelled:
      return "destructive";
    case PartRequestStatus.Completed:
      return "secondary";
    case PartRequestStatus.Draft:
    default:
      return "outline";
  }
}

export const PART_REQUEST_STATUS_FILTER_OPTIONS: {
  value: import("@/contracts/part-requests").PartRequestStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "Todos" },
  { value: "Open", label: "Abertas" },
  { value: "Draft", label: "Rascunho" },
  { value: "Cancelled", label: "Canceladas" },
  { value: "Completed", label: "Concluídas" },
];
