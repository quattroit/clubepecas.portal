"use client";

import { useMemo } from "react";

import {
  SearchableCombobox,
} from "@/components/ui/searchable-combobox";
import { formatCityLabel } from "@/mappers/city.mapper";
import type { City } from "@/types/City";

type CityComboboxProps = {
  id?: string;
  cities: City[];
  value: number | null | undefined;
  onChange: (cityId: number | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
  "aria-describedby"?: string;
};

/**
 * Combobox de cidade — mesmo comportamento do SearchableCombobox do filtro de lojas.
 */
function CityCombobox({
  id,
  cities,
  value,
  onChange,
  onBlur,
  disabled = false,
  invalid = false,
  placeholder = "Selecione a cidade",
  "aria-describedby": ariaDescribedBy,
}: CityComboboxProps) {
  const options = useMemo(
    () =>
      cities.map((city) => ({
        id: String(city.id),
        label: formatCityLabel(city),
      })),
    [cities],
  );

  return (
    <SearchableCombobox
      id={id}
      options={options}
      value={value != null && value > 0 ? String(value) : null}
      onChange={(next) => onChange(next ? Number(next) : null)}
      onBlur={onBlur}
      disabled={disabled}
      invalid={invalid}
      placeholder={placeholder}
      clearLabel="Limpar cidade"
      triggerLabel="Abrir lista de cidades"
      emptyMessage="Digite o nome da cidade para buscar."
      showOptionsWhenEmpty={false}
      maxResults={120}
      aria-describedby={ariaDescribedBy}
    />
  );
}

export { CityCombobox };
export type { CityComboboxProps };
