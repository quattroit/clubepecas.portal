import { SellerSubscriptionStatus } from "@/contracts/common/enums";
import type { SellerSubscriptionDto } from "@/contracts/seller/subscription";

/** Rótulos de badge (Sprint 8.3). */
export function subscriptionStatusLabel(
  status: SellerSubscriptionStatus,
  gracePeriodUntilUtc?: string | null,
): string {
  if (
    gracePeriodUntilUtc &&
    new Date(gracePeriodUntilUtc).getTime() > Date.now() &&
    (status === SellerSubscriptionStatus.Active ||
      status === SellerSubscriptionStatus.Pending)
  ) {
    return "Período de carência";
  }

  switch (status) {
    case SellerSubscriptionStatus.Active:
      return "Ativo";
    case SellerSubscriptionStatus.Cancelled:
      return "Cancelado";
    case SellerSubscriptionStatus.Expired:
      return "Expirado";
    case SellerSubscriptionStatus.Pending:
      return "Pendente";
    default:
      return "—";
  }
}

export function subscriptionStatusBadgeVariant(
  status: SellerSubscriptionStatus,
  gracePeriodUntilUtc?: string | null,
): "success" | "secondary" | "warning" | "outline" | "destructive" {
  if (
    gracePeriodUntilUtc &&
    new Date(gracePeriodUntilUtc).getTime() > Date.now() &&
    (status === SellerSubscriptionStatus.Active ||
      status === SellerSubscriptionStatus.Pending)
  ) {
    return "warning";
  }

  switch (status) {
    case SellerSubscriptionStatus.Active:
      return "success";
    case SellerSubscriptionStatus.Cancelled:
      return "secondary";
    case SellerSubscriptionStatus.Expired:
      return "destructive";
    case SellerSubscriptionStatus.Pending:
      return "warning";
    default:
      return "outline";
  }
}

export function isInGracePeriod(
  subscription: Pick<SellerSubscriptionDto, "gracePeriodUntilUtc" | "status">,
): boolean {
  if (!subscription.gracePeriodUntilUtc) return false;
  if (
    subscription.status !== SellerSubscriptionStatus.Active &&
    subscription.status !== SellerSubscriptionStatus.Pending
  ) {
    return false;
  }
  return new Date(subscription.gracePeriodUntilUtc).getTime() > Date.now();
}

/** Percentual a partir dos valores já calculados pelo backend. */
export function subscriptionUsagePercent(used: number, limit: number): number {
  if (limit <= 0) return 100;
  return Math.min(100, Math.round((used / limit) * 100));
}
