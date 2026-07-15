import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type FilterOption = {
  id: string;
  label: string;
};

type FilterSidebarProps = {
  categories?: FilterOption[];
  states?: FilterOption[];
  className?: string;
  /** Exibe título interno do card (ocultar no drawer se o Sheet já tiver título) */
  showTitle?: boolean;
};

const DEFAULT_CATEGORIES: FilterOption[] = [
  { id: "all", label: "Todas" },
  { id: "motor", label: "Motor" },
  { id: "freios", label: "Freios" },
  { id: "suspensao", label: "Suspensão" },
  { id: "eletrica", label: "Elétrica" },
];

const DEFAULT_STATES: FilterOption[] = [
  { id: "all", label: "Todos" },
  { id: "PR", label: "Paraná" },
  { id: "SP", label: "São Paulo" },
  { id: "MG", label: "Minas Gerais" },
  { id: "SC", label: "Santa Catarina" },
];

const selectClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border px-2.5 text-sm outline-none focus-visible:ring-3";

/**
 * Card lateral de filtros — apenas estrutura visual.
 * Pronto para receber valores controlados da API no futuro.
 */
function FilterSidebar({
  categories = DEFAULT_CATEGORIES,
  states = DEFAULT_STATES,
  className,
  showTitle = true,
}: FilterSidebarProps) {
  return (
    <Card className={cn("h-fit shadow-xs", className)}>
      {showTitle ? (
        <CardHeader className="pb-0">
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
      ) : null}

      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-category">Categoria</Label>
          <select
            id="filter-category"
            name="category"
            defaultValue="all"
            className={selectClassName}
            aria-label="Filtrar por categoria"
          >
            {categories.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-state">Estado</Label>
          <select
            id="filter-state"
            name="state"
            defaultValue="all"
            className={selectClassName}
            aria-label="Filtrar por estado"
          >
            {states.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-city">Cidade</Label>
          <Input
            id="filter-city"
            name="city"
            type="text"
            placeholder="Digite a cidade"
            aria-label="Filtrar por cidade"
          />
        </div>

        <Separator />

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">Faixa de preço</legend>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="filter-price-min"
                className="text-muted-foreground font-normal"
              >
                Mínimo
              </Label>
              <Input
                id="filter-price-min"
                name="priceMin"
                type="number"
                inputMode="decimal"
                placeholder="R$ 0"
                aria-label="Preço mínimo"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="filter-price-max"
                className="text-muted-foreground font-normal"
              >
                Máximo
              </Label>
              <Input
                id="filter-price-max"
                name="priceMax"
                type="number"
                inputMode="decimal"
                placeholder="R$ 9999"
                aria-label="Preço máximo"
              />
            </div>
          </div>
        </fieldset>

        <Separator />

        <div className="flex items-center gap-2">
          <input
            id="filter-new-only"
            name="newOnly"
            type="checkbox"
            className="border-input size-4 rounded border accent-[var(--primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          />
          <Label htmlFor="filter-new-only" className="font-normal">
            Somente anúncios novos
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}

export { FilterSidebar };
export type { FilterSidebarProps, FilterOption };
