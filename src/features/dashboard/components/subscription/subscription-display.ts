import type { SubscriptionStatusColor } from "@/contracts/seller/subscription";

/** Mapeia cor semântica da API para variante visual do Badge (sem regra de negócio). */
export function statusColorToBadgeVariant(
  color?: SubscriptionStatusColor | string | null,
): "success" | "secondary" | "warning" | "outline" | "destructive" {
  switch (color) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "danger":
      return "destructive";
    case "info":
      return "outline";
    case "muted":
      return "secondary";
    default:
      return "outline";
  }
}
