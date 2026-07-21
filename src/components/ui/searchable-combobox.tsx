"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { Combobox } from "@base-ui/react/combobox";

import { cn } from "@/lib/utils";

export type SearchableComboboxOption = {
  id: string;
  label: string;
};

type SearchableComboboxProps = {
  id?: string;
  options: SearchableComboboxOption[];
  value: string | null | undefined;
  onChange: (id: string | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
  /** Opção sintética no topo (ex.: "Todos"). `id` null no onChange. */
  allOptionLabel?: string;
  clearLabel?: string;
  triggerLabel?: string;
  emptyMessage?: string;
  /** Quantidade máxima exibida ao filtrar / listar. */
  maxResults?: number;
  /**
   * Se true, com campo vazio já lista opções (bom para listas curtas).
   * Se false, pede digitação antes de listar (bom para catálogos grandes).
   */
  showOptionsWhenEmpty?: boolean;
  "aria-describedby"?: string;
};

/**
 * Combobox com digitação + lista filtrada (estado, cidade, etc.).
 */
function SearchableCombobox({
  id,
  options,
  value,
  onChange,
  onBlur,
  disabled = false,
  invalid = false,
  placeholder = "Digite ou selecione",
  allOptionLabel,
  clearLabel = "Limpar",
  triggerLabel = "Abrir lista",
  emptyMessage = "Nenhum resultado encontrado.",
  maxResults = 120,
  showOptionsWhenEmpty = true,
  "aria-describedby": ariaDescribedBy,
}: SearchableComboboxProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const { contains } = Combobox.useFilter({ sensitivity: "base" });

  const allOption = useMemo<SearchableComboboxOption | null>(() => {
    if (!allOptionLabel) return null;
    return { id: "__all__", label: allOptionLabel };
  }, [allOptionLabel]);

  const selected = useMemo(() => {
    if (value == null || value === "" || value === "all") {
      return null;
    }
    return options.find((option) => option.id === value) ?? null;
  }, [options, value]);

  const filtered = useMemo(() => {
    const trimmed = deferredQuery.trim();
    const source = allOption ? [allOption, ...options] : options;

    if (!trimmed) {
      if (!showOptionsWhenEmpty) {
        return selected ? [selected] : allOption ? [allOption] : [];
      }
      return source.slice(0, maxResults);
    }

    const results: SearchableComboboxOption[] = [];
    for (const option of source) {
      if (contains(option.label, trimmed) || contains(option.id, trimmed)) {
        results.push(option);
        if (results.length >= maxResults) break;
      }
    }
    return results;
  }, [
    allOption,
    contains,
    deferredQuery,
    maxResults,
    options,
    selected,
    showOptionsWhenEmpty,
  ]);

  const trimmedQuery = query.trim();
  const isFiltering = trimmedQuery.length > 0;
  const truncated =
    isFiltering &&
    filtered.length >= maxResults &&
    options.length + (allOption ? 1 : 0) > maxResults;

  return (
    <Combobox.Root<SearchableComboboxOption>
      items={filtered}
      value={selected}
      filter={null}
      disabled={disabled}
      itemToStringLabel={(option) => option?.label ?? ""}
      isItemEqualToValue={(a, b) => a.id === b.id}
      onValueChange={(next) => {
        if (!next || next.id === "__all__") {
          onChange(null);
        } else {
          onChange(next.id);
        }
        setQuery("");
      }}
      onInputValueChange={(next, { reason }) => {
        if (reason === "item-press" || reason === "clear-press") {
          setQuery("");
          return;
        }
        setQuery(next);
      }}
    >
      <Combobox.InputGroup
        className={cn(
          "border-input bg-surface focus-within:border-ring focus-within:ring-ring/50 relative flex h-10 w-full items-center rounded-xl border transition-colors focus-within:ring-3",
          "has-disabled:cursor-not-allowed has-disabled:opacity-50",
          invalid &&
            "border-destructive ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/20 aria-invalid:ring-3",
        )}
      >
        <Combobox.Input
          id={id}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={ariaDescribedBy}
          onBlur={onBlur}
          className="placeholder:text-muted-foreground h-full w-full min-w-0 rounded-xl border-0 bg-transparent px-3.5 pr-16 text-sm outline-none"
        />
        <div className="absolute top-0 right-0 flex h-full items-center gap-0.5 pr-1.5">
          <Combobox.Clear
            aria-label={clearLabel}
            className="text-muted-foreground hover:text-foreground flex size-7 items-center justify-center rounded-lg outline-none"
          >
            <XIcon className="size-3.5" />
          </Combobox.Clear>
          <Combobox.Trigger
            aria-label={triggerLabel}
            className="text-muted-foreground hover:text-foreground flex size-7 items-center justify-center rounded-lg outline-none"
          >
            <ChevronDownIcon className="size-4" />
          </Combobox.Trigger>
        </div>
      </Combobox.InputGroup>

      <Combobox.Portal>
        <Combobox.Positioner className="outline-none" sideOffset={4}>
          <Combobox.Popup
            className={cn(
              "border-border bg-popover text-popover-foreground z-50 w-[var(--anchor-width)] max-w-[var(--available-width)] overflow-hidden rounded-xl border shadow-md outline-none",
              "origin-[var(--transform-origin)] transition-[transform,opacity] duration-100",
              "data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
            )}
          >
            <Combobox.Status className="text-muted-foreground data-empty:hidden px-3 py-2 text-xs empty:hidden">
              {truncated
                ? `Mostrando os primeiros ${maxResults} resultados. Refine a busca.`
                : null}
            </Combobox.Status>
            <Combobox.Empty className="text-muted-foreground px-3 py-3 text-sm">
              {isFiltering
                ? `Nenhum resultado para “${trimmedQuery}”.`
                : emptyMessage}
            </Combobox.Empty>
            <Combobox.List className="max-h-[min(18rem,var(--available-height))] scroll-py-1 overflow-y-auto overscroll-contain p-1 outline-none data-empty:p-0">
              {(option: SearchableComboboxOption) => (
                <Combobox.Item
                  key={option.id}
                  value={option}
                  className={cn(
                    "data-highlighted:bg-muted data-highlighted:text-foreground flex cursor-default items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none select-none",
                    "data-selected:font-medium",
                  )}
                >
                  <Combobox.ItemIndicator className="text-primary flex size-4 shrink-0 items-center justify-center">
                    <CheckIcon className="size-3.5" />
                  </Combobox.ItemIndicator>
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

export { SearchableCombobox };
export type { SearchableComboboxProps };
