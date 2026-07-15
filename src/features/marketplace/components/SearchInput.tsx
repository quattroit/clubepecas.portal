"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  /** Chamado ao submeter (Enter ou botão). Sem busca nesta sprint. */
  onSubmit?: (value: string) => void;
  className?: string;
  id?: string;
};

/**
 * Campo de busca reutilizável — estrutura preparada, sem pesquisa real.
 */
function SearchInput({
  placeholder = "Buscar peças, marcas ou códigos…",
  value,
  onChange,
  onSubmit,
  className,
  id = "search-input",
}: SearchInputProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("q") ?? value ?? "");
    onSubmit?.(query);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative w-full", className)}
    >
      <button
        type="submit"
        aria-label="Buscar"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-1/2 left-1 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-md outline-none focus-visible:ring-2"
      >
        <Search className="size-4" aria-hidden />
      </button>
      <Input
        id={id}
        name="q"
        type="search"
        aria-label="Buscar no marketplace"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-10 pr-3 pl-9"
      />
    </form>
  );
}

export { SearchInput };
export type { SearchInputProps };
