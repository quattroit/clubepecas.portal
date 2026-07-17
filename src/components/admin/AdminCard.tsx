import type { ReactNode } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AdminCardProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  size?: "default" | "sm";
};

/**
 * Card genérico da área administrativa — sem regra de negócio.
 */
function AdminCard({
  title,
  description,
  actions,
  footer,
  children,
  className,
  size = "default",
}: AdminCardProps) {
  const hasHeader = Boolean(title || description || actions);

  return (
    <Card
      data-slot="admin-card"
      size={size}
      className={cn("h-full", className)}
    >
      {hasHeader ? (
        <CardHeader className={cn(actions && "has-data-[slot=card-action]")}>
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? <CardDescription>{description}</CardDescription> : null}
          {actions ? <CardAction>{actions}</CardAction> : null}
        </CardHeader>
      ) : null}
      {children ? <CardContent>{children}</CardContent> : null}
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
}

export { AdminCard };
export type { AdminCardProps };
