import { SellerSubscriptionStatus } from "@/contracts/common/enums";

/** Rótulos de badge conforme Sprint 5.5 (Ativo / Cancelado / Expirado). */
export function subscriptionStatusLabel(
  status: SellerSubscriptionStatus,
): string {
  switch (status) {
    case SellerSubscriptionStatus.Active:
      return "Ativo";
    case SellerSubscriptionStatus.Cancelled:
      return "Cancelado";
    case SellerSubscriptionStatus.Expired:
      return "Expirado";
    default:
      return "—";
  }
}

export function subscriptionStatusBadgeVariant(
  status: SellerSubscriptionStatus,
): "success" | "secondary" | "warning" | "outline" {
  switch (status) {
    case SellerSubscriptionStatus.Active:
      return "success";
    case SellerSubscriptionStatus.Cancelled:
      return "secondary";
    case SellerSubscriptionStatus.Expired:
      return "warning";
    default:
      return "outline";
  }
}

/** Percentual a partir dos valores já calculados pelo backend. */
export function subscriptionUsagePercent(used: number, limit: number): number {
  if (limit <= 0) return 100;
  return Math.min(100, Math.round((used / limit) * 100));
}
