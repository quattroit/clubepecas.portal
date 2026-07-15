import { createElement } from "react";
import {
  CalendarDays,
  FolderOpen,
  MapPin,
  Package,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StoreStatsProps = {
  advertisementCount: number;
  categoriesCount: number;
  city: string;
  registeredAt?: string;
  className?: string;
};

function formatRegisteredAt(value?: string) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

/**
 * Cards de estatísticas da loja — apenas apresentação.
 */
function StoreStats({
  advertisementCount,
  categoriesCount,
  city,
  registeredAt,
  className,
}: StoreStatsProps) {
  const items: {
    label: string;
    value: string;
    icon: LucideIcon;
  }[] = [
    {
      label: "Anúncios",
      value:
        advertisementCount === 1
          ? "1 anúncio"
          : `${advertisementCount} anúncios`,
      icon: Package,
    },
    {
      label: "Categorias",
      value:
        categoriesCount === 1 ? "1 categoria" : `${categoriesCount} categorias`,
      icon: FolderOpen,
    },
    {
      label: "Cidade",
      value: city,
      icon: MapPin,
    },
    {
      label: "Cadastro",
      value: formatRegisteredAt(registeredAt),
      icon: CalendarDays,
    },
  ];

  return (
    <ul
      className={cn(
        "grid list-none grid-cols-2 gap-3 lg:grid-cols-4",
        className,
      )}
      aria-label="Estatísticas da loja"
    >
      {items.map(({ label, value, icon }) => (
        <li key={label}>
          <Card size="sm" className="h-full shadow-xs">
            <CardContent className="flex items-start gap-3 py-1">
              <div
                className="bg-secondary text-secondary-foreground flex size-9 shrink-0 items-center justify-center rounded-lg"
                aria-hidden
              >
                {createElement(icon, { className: "size-4" })}
              </div>
              <div className="min-w-0">
                <p className="text-small text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export { StoreStats };
export type { StoreStatsProps };
