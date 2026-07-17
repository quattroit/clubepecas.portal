import { Badge, badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type AdminStatusVariant =
  | "active"
  | "inactive"
  | "blocked"
  | "pending"
  | "premium"
  | "basic"
  | "featured"
  | "default";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const STATUS_MAP: Record<
  AdminStatusVariant,
  { label: string; badge: BadgeVariant }
> = {
  active: { label: "Ativo", badge: "success" },
  inactive: { label: "Inativo", badge: "secondary" },
  blocked: { label: "Bloqueado", badge: "destructive" },
  pending: { label: "Pendente", badge: "warning" },
  premium: { label: "Premium", badge: "default" },
  basic: { label: "Básico", badge: "outline" },
  featured: { label: "Destaque", badge: "default" },
  default: { label: "—", badge: "secondary" },
};

type AdminStatusBadgeProps = {
  status: AdminStatusVariant;
  /** Sobrescreve o rótulo padrão da variante. */
  label?: string;
  className?: string;
};

/**
 * Badge de status padronizado para a área administrativa.
 */
function AdminStatusBadge({ status, label, className }: AdminStatusBadgeProps) {
  const config = STATUS_MAP[status] ?? STATUS_MAP.default;

  return (
    <Badge
      data-slot="admin-status-badge"
      variant={config.badge}
      className={cn(
        status === "featured" && "bg-amber-500/15 text-amber-700 border-amber-500/20",
        status === "premium" && "bg-primary/15 text-primary border-primary/20",
        className,
      )}
    >
      {label ?? config.label}
    </Badge>
  );
}

export { AdminStatusBadge, STATUS_MAP };
export type { AdminStatusBadgeProps, AdminStatusVariant };
