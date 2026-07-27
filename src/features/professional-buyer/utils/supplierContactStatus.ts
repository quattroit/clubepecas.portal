import { badgeVariants } from "@/components/ui/badge";
import { PartRequestSupplierContactStatus } from "@/contracts/common/enums";
import type { VariantProps } from "class-variance-authority";

export function getSupplierContactStatusBadgeVariant(
  status: PartRequestSupplierContactStatus,
): NonNullable<VariantProps<typeof badgeVariants>["variant"]> {
  switch (status) {
    case PartRequestSupplierContactStatus.Contacted:
    case PartRequestSupplierContactStatus.Completed:
      return "success";
    case PartRequestSupplierContactStatus.Skipped:
      return "secondary";
    case PartRequestSupplierContactStatus.Pending:
    default:
      return "warning";
  }
}

export function isSupplierContactPending(
  status: PartRequestSupplierContactStatus,
): boolean {
  return status === PartRequestSupplierContactStatus.Pending;
}
