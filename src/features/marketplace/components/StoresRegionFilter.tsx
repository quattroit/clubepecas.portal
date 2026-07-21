"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { BRAZILIAN_STATE_OPTIONS } from "@/constants/brazilian-states";
import { cn } from "@/lib/utils";
import type { City } from "@/types/City";
import type { StoresListingFilters } from "@/utils/stores-search";

type StoresRegionFilterProps = {
  cities: City[];
  values?: StoresListingFilters;
  onApply?: (filters: StoresListingFilters) => void;
  className?: string;
};

/**
 * Filtro de lojas por nome e região (estado / cidade).
 */
function StoresRegionFilter({
  cities,
  values = {},
  onApply,
  className,
}: StoresRegionFilterProps) {
  const reactId = useId();
  const id = (name: string) => `${reactId}-${name}`;

  const [queryName, setQueryName] = useState(values.q ?? "");
  const [selectedState, setSelectedState] = useState<string | null>(
    values.state ?? null,
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(
    values.city ?? null,
  );

  useEffect(() => {
    setQueryName(values.q ?? "");
    setSelectedState(values.state ?? null);
    setSelectedCity(values.city ?? null);
  }, [values.q, values.state, values.city]);

  const stateOptions = useMemo(
    () =>
      BRAZILIAN_STATE_OPTIONS.filter((option) => option.id !== "all").map(
        (option) => ({ id: option.id, label: option.label }),
      ),
    [],
  );

  const cityOptions = useMemo(() => {
    const filtered = selectedState
      ? cities.filter(
          (city) => city.state.toUpperCase() === selectedState.toUpperCase(),
        )
      : cities;

    return filtered.map((city) => ({
      id: city.slug,
      label: `${city.name} — ${city.state}`,
    }));
  }, [cities, selectedState]);

  return (
    <Card className={cn("shadow-xs", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Buscar lojas</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const q = queryName.trim();

            onApply?.({
              ...(q ? { q } : {}),
              ...(selectedState ? { state: selectedState } : {}),
              ...(selectedCity ? { city: selectedCity } : {}),
            });
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor={id("q")}>Nome da loja</Label>
            <Input
              id={id("q")}
              type="search"
              placeholder="Ex.: Auto Peças Centro"
              value={queryName}
              onChange={(event) => setQueryName(event.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor={id("state")}>Estado</Label>
              <SearchableCombobox
                id={id("state")}
                options={stateOptions}
                value={selectedState}
                onChange={(next) => {
                  setSelectedState(next);
                  setSelectedCity(null);
                }}
                placeholder="Selecione o estado"
                allOptionLabel="Todos os estados"
                clearLabel="Limpar estado"
                triggerLabel="Abrir lista de estados"
                emptyMessage="Digite ou abra a lista para escolher o estado."
                showOptionsWhenEmpty
                maxResults={30}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={id("city")}>Cidade</Label>
              <SearchableCombobox
                id={id("city")}
                options={cityOptions}
                value={selectedCity}
                onChange={setSelectedCity}
                placeholder={
                  selectedState
                    ? "Selecione a cidade"
                    : "Digite o nome da cidade"
                }
                allOptionLabel="Todas as cidades"
                clearLabel="Limpar cidade"
                triggerLabel="Abrir lista de cidades"
                emptyMessage={
                  selectedState
                    ? "Digite ou abra a lista para escolher a cidade."
                    : "Digite o nome da cidade para buscar."
                }
                showOptionsWhenEmpty={Boolean(selectedState)}
                maxResults={120}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full sm:w-auto">
            <Search className="size-4" aria-hidden />
            Filtrar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export { StoresRegionFilter };
export type { StoresRegionFilterProps };
