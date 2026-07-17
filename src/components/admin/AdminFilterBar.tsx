"use client";

import type { ReactNode } from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AdminSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  onClear?: () => void;
  /** Reservado para debounce futuro nas features. */
  debounceMs?: number;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

/**
 * Campo de busca administrativo — estrutura pronta para debounce/atalhos.
 */
function AdminSearch({
  value,
  onChange,
  placeholder = "Buscar…",
  loading = false,
  disabled = false,
  onClear,
  className,
  id = "admin-search",
  "aria-label": ariaLabel = "Buscar",
}: AdminSearchProps) {
  const showClear = value.length > 0;

  return (
    <div
      data-slot="admin-search"
      className={cn("relative w-full max-w-sm", className)}
    >
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden
      />
      <Input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        autoComplete="off"
        className={cn(
          "pl-9 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
          showClear && "pr-9",
        )}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && value) {
            event.preventDefault();
            onClear?.() ?? onChange("");
          }
        }}
      />
      {showClear ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground absolute top-1/2 right-1.5 -translate-y-1/2"
          aria-label="Limpar busca"
          disabled={disabled || loading}
          onClick={() => {
            onClear?.() ?? onChange("");
          }}
        >
          <X className="size-3.5" aria-hidden />
        </Button>
      ) : null}
    </div>
  );
}

type AdminFilterBarProps = {
  search?: ReactNode;
  filters?: ReactNode;
  period?: ReactNode;
  sort?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/**
 * Barra de filtros administrativa — slots genéricos sem regra de negócio.
 */
function AdminFilterBar({
  search,
  filters,
  period,
  sort,
  actions,
  className,
}: AdminFilterBarProps) {
  return (
    <div
      data-slot="admin-filter-bar"
      className={cn(
        "border-border bg-card flex flex-col gap-3 rounded-xl border p-3 shadow-xs sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {search}
        {period}
        {filters}
        {sort}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export { AdminSearch, AdminFilterBar };
export type { AdminSearchProps, AdminFilterBarProps };
