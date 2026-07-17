"use client";

import { Search } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useVehicleModels } from "@/hooks/api/useVehicleModels";
import { cn } from "@/lib/utils";
import type { MarketplaceListingFilters } from "@/utils/marketplace-search";

type FilterOption = {
  id: string;
  label: string;
};

type FilterSidebarProps = {
  categories?: FilterOption[];
  brands?: FilterOption[];
  cities?: FilterOption[];
  states?: FilterOption[];
  className?: string;
  /** Exibe título interno do card (ocultar no drawer se o Sheet já tiver título) */
  showTitle?: boolean;
  /** Valores atuais (ex.: vindos da URL). */
  values?: MarketplaceListingFilters;
  /** Aplica os filtros do formulário (Pesquisar). */
  onApply?: (filters: MarketplaceListingFilters) => void;
};

const DEFAULT_CATEGORIES: FilterOption[] = [{ id: "all", label: "Todas" }];

const DEFAULT_BRANDS: FilterOption[] = [{ id: "all", label: "Todas" }];

const DEFAULT_CITIES: FilterOption[] = [{ id: "all", label: "Todas" }];

const DEFAULT_STATES: FilterOption[] = [
  { id: "all", label: "Todos" },
  { id: "AC", label: "Acre" },
  { id: "AL", label: "Alagoas" },
  { id: "AP", label: "Amapá" },
  { id: "AM", label: "Amazonas" },
  { id: "BA", label: "Bahia" },
  { id: "CE", label: "Ceará" },
  { id: "DF", label: "Distrito Federal" },
  { id: "ES", label: "Espírito Santo" },
  { id: "GO", label: "Goiás" },
  { id: "MA", label: "Maranhão" },
  { id: "MT", label: "Mato Grosso" },
  { id: "MS", label: "Mato Grosso do Sul" },
  { id: "MG", label: "Minas Gerais" },
  { id: "PA", label: "Pará" },
  { id: "PB", label: "Paraíba" },
  { id: "PR", label: "Paraná" },
  { id: "PE", label: "Pernambuco" },
  { id: "PI", label: "Piauí" },
  { id: "RJ", label: "Rio de Janeiro" },
  { id: "RN", label: "Rio Grande do Norte" },
  { id: "RS", label: "Rio Grande do Sul" },
  { id: "RO", label: "Rondônia" },
  { id: "RR", label: "Roraima" },
  { id: "SC", label: "Santa Catarina" },
  { id: "SP", label: "São Paulo" },
  { id: "SE", label: "Sergipe" },
  { id: "TO", label: "Tocantins" },
];

const selectClassName =
  "border-input bg-surface focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border px-3.5 text-sm outline-none transition-colors focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted";

/**
 * Card lateral de filtros — aplica via URL / API no submit de Pesquisar.
 */
function FilterSidebar({
  categories = DEFAULT_CATEGORIES,
  brands = DEFAULT_BRANDS,
  cities = DEFAULT_CITIES,
  states = DEFAULT_STATES,
  className,
  showTitle = true,
  values = {},
  onApply,
}: FilterSidebarProps) {
  const reactId = useId();
  const id = (name: string) => `${reactId}-${name}`;

  const [selectedBrand, setSelectedBrand] = useState(values.brand ?? "all");
  const [selectedModel, setSelectedModel] = useState(values.model ?? "all");
  const [lastValuesBrand, setLastValuesBrand] = useState(values.brand);
  const [lastValuesModel, setLastValuesModel] = useState(values.model);

  if (values.brand !== lastValuesBrand) {
    setLastValuesBrand(values.brand);
    setSelectedBrand(values.brand ?? "all");
  }
  if (values.model !== lastValuesModel) {
    setLastValuesModel(values.model);
    setSelectedModel(values.model ?? "all");
  }

  const hasBrandSelected = selectedBrand !== "all" && Boolean(selectedBrand);
  const modelsQuery = useVehicleModels({
    brandSlug: hasBrandSelected ? selectedBrand : undefined,
  });
  const models = modelsQuery.data ?? [];
  const modelsLoading = modelsQuery.isFetching;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const category = String(formData.get("category") ?? "all");
    const brand = String(formData.get("brand") ?? "all");
    const model = String(formData.get("model") ?? "all");
    const state = String(formData.get("state") ?? "all");
    const city = String(formData.get("city") ?? "all");
    const priceMin = String(formData.get("priceMin") ?? "").trim();
    const priceMax = String(formData.get("priceMax") ?? "").trim();
    const newOnly = formData.get("newOnly") === "on";

    onApply?.({
      ...(category && category !== "all" ? { category } : {}),
      ...(brand && brand !== "all" ? { brand } : {}),
      ...(model && model !== "all" ? { model } : {}),
      ...(state && state !== "all" ? { state } : {}),
      ...(city && city !== "all" ? { city } : {}),
      ...(priceMin ? { priceMin } : {}),
      ...(priceMax ? { priceMax } : {}),
      ...(newOnly ? { newOnly: true } : {}),
    });
  };

  // Remonta o form quando os valores da URL mudam.
  const formKey = [
    values.category ?? "all",
    values.brand ?? "all",
    values.model ?? "all",
    values.state ?? "all",
    values.city ?? "all",
    values.priceMin ?? "",
    values.priceMax ?? "",
    values.newOnly ? "1" : "0",
  ].join("|");

  return (
    <Card className={cn("h-fit shadow-xs", className)}>
      {showTitle ? (
        <CardHeader className="pb-0">
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
      ) : null}

      <CardContent className="flex flex-col gap-5">
        <form
          key={formKey}
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor={id("category")}>Categoria</Label>
            <select
              id={id("category")}
              name="category"
              defaultValue={values.category ?? "all"}
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
            <Label htmlFor={id("brand")}>Marca</Label>
            <select
              id={id("brand")}
              name="brand"
              value={selectedBrand}
              onChange={(event) => {
                const nextBrand = event.target.value;
                setSelectedBrand(nextBrand);
                setSelectedModel("all");
              }}
              className={selectClassName}
              aria-label="Filtrar por marca"
            >
              {brands.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={id("model")}>Modelo</Label>
            <select
              id={id("model")}
              name="model"
              value={selectedModel}
              onChange={(event) => setSelectedModel(event.target.value)}
              disabled={!hasBrandSelected || modelsLoading}
              className={selectClassName}
              aria-label="Filtrar por modelo"
            >
              {!hasBrandSelected ? (
                <option value="all">Selecione uma marca</option>
              ) : modelsLoading ? (
                <option value="all">Carregando…</option>
              ) : models.length === 0 ? (
                <option value="all">Nenhum modelo cadastrado</option>
              ) : (
                <>
                  <option value="all">Todos</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.slug}>
                      {model.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={id("state")}>Estado</Label>
            <select
              id={id("state")}
              name="state"
              defaultValue={values.state ?? "all"}
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
            <Label htmlFor={id("city")}>Cidade</Label>
            <select
              id={id("city")}
              name="city"
              defaultValue={values.city ?? "all"}
              className={selectClassName}
              aria-label="Filtrar por cidade"
            >
              {cities.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Separator />

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium">Faixa de preço</legend>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor={id("price-min")}
                  className="text-muted-foreground font-normal"
                >
                  Mínimo
                </Label>
                <Input
                  id={id("price-min")}
                  name="priceMin"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  placeholder="R$ 0"
                  defaultValue={values.priceMin ?? ""}
                  aria-label="Preço mínimo"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor={id("price-max")}
                  className="text-muted-foreground font-normal"
                >
                  Máximo
                </Label>
                <Input
                  id={id("price-max")}
                  name="priceMax"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  placeholder="R$ 9999"
                  defaultValue={values.priceMax ?? ""}
                  aria-label="Preço máximo"
                />
              </div>
            </div>
          </fieldset>

          <Separator />

          <div className="flex items-center gap-2">
            <input
              id={id("new-only")}
              name="newOnly"
              type="checkbox"
              defaultChecked={Boolean(values.newOnly)}
              className="border-input size-4 rounded border accent-[var(--primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            />
            <Label htmlFor={id("new-only")} className="font-normal">
              Somente anúncios novos
            </Label>
          </div>

          <Button type="submit" variant="primary" className="w-full">
            <Search className="size-4" aria-hidden />
            Pesquisar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export { FilterSidebar };
export type { FilterSidebarProps, FilterOption };
