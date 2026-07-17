"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMarketplaceSearchNavigate } from "@/hooks/useMarketplaceSearchNavigate";
import { cn } from "@/lib/utils";
import { normalizeSearchQuery } from "@/utils/marketplace-search";

type SearchInputProps = {
  placeholder?: string;
  /** Valor controlado (opcional). */
  value?: string;
  /** Valor inicial não controlado (ex.: sync com `?q=`). */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /**
   * Callback após submit. Se omitido, navega para `/anuncios?q=…`.
   * Enter e clique na lupa/Pesquisar disparam o mesmo fluxo.
   */
  onSubmit?: (value: string) => void;
  className?: string;
  id?: string;
  /** Visual — default / sobre brand / destaque no hero */
  tone?: "default" | "on-brand" | "hero";
  /**
   * `icon` — só lupa (Header).
   * `button` — botão "Pesquisar" ao lado do campo (/anuncios).
   */
  submitVariant?: "icon" | "button";
};

/**
 * Busca global reutilizável (Header, Hero e listagem).
 * Estado local garante digitação estável (Input Base UI).
 * Não dispara requisições ao digitar — apenas no submit.
 */
function SearchInput({
  placeholder = "Buscar peças, marcas ou códigos…",
  value: valueProp,
  defaultValue = "",
  onChange,
  onSubmit,
  className,
  id = "search-input",
  tone = "default",
  submitVariant = "icon",
}: SearchInputProps) {
  const navigateSearch = useMarketplaceSearchNavigate();
  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = isControlled ? valueProp : uncontrolledValue;

  const setValue = (next: string) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = normalizeSearchQuery(value);

    if (onSubmit) {
      onSubmit(query);
      return;
    }

    navigateSearch(query);
  };

  const inputClassName =
    tone === "hero"
      ? "text-foreground placeholder:text-muted-foreground h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-1 text-base shadow-none focus-visible:ring-0 sm:px-2"
      : cn(
          "h-10 pr-3 pl-10",
          tone === "default" && "bg-surface",
          tone === "on-brand" &&
            "border-brand-border bg-brand-foreground/8 text-brand-foreground placeholder:text-brand-muted focus-visible:border-primary focus-visible:ring-primary/40",
        );

  const field = (
    <Input
      id={id}
      name="q"
      type="search"
      aria-label="Buscar no marketplace"
      autoComplete="off"
      enterKeyHint="search"
      placeholder={placeholder}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className={inputClassName}
    />
  );

  if (tone === "hero") {
    return (
      <form
        role="search"
        onSubmit={handleSubmit}
        className={cn(
          "bg-surface text-foreground relative z-20 flex h-12 w-full items-center overflow-hidden rounded-full shadow-md sm:h-14",
          className,
        )}
      >
        <span
          className="text-primary pointer-events-none flex size-10 shrink-0 items-center justify-center pl-2 sm:size-12 sm:pl-3"
          aria-hidden
        >
          <Search className="size-5" />
        </span>
        {field}
        <Button
          type="submit"
          variant="primary"
          size="icon-lg"
          aria-label="Buscar"
          className="m-1.5 size-9 shrink-0 rounded-xl sm:size-11"
        >
          <Search className="size-5" aria-hidden />
        </Button>
      </form>
    );
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "relative z-20 w-full",
        submitVariant === "button" && "flex items-center gap-2",
        className,
      )}
    >
      <div
        className={cn(
          "relative",
          submitVariant === "button" ? "min-w-0 flex-1" : "w-full",
        )}
      >
        {submitVariant === "icon" ? (
          <button
            type="submit"
            aria-label="Buscar"
            className={cn(
              "focus-visible:ring-ring absolute top-1/2 left-1.5 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-md outline-none focus-visible:ring-2",
              tone === "on-brand"
                ? "text-brand-muted hover:text-brand-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Search className="size-4" aria-hidden />
          </button>
        ) : (
          <span
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-1.5 z-10 flex size-8 -translate-y-1/2 items-center justify-center"
            aria-hidden
          >
            <Search className="size-4" />
          </span>
        )}
        {field}
      </div>

      {submitVariant === "button" ? (
        <Button
          type="submit"
          variant="primary"
          className="shrink-0"
          aria-label="Pesquisar"
        >
          <Search className="size-4" aria-hidden />
          Pesquisar
        </Button>
      ) : null}
    </form>
  );
}

/** Alias semântico — mesmo componente da busca global. */
const SearchBar = SearchInput;

export { SearchInput, SearchBar };
export type { SearchInputProps };
export type SearchBarProps = SearchInputProps;
