"use client";

import { useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryIcon } from "@/features/marketplace/components/CategoryIcon";

/** Nomes Lucide sugeridos — mapeados em `category-icons.ts`. */
export const CATEGORY_ICON_SUGGESTIONS = [
  "Cog",
  "Workflow",
  "MoveVertical",
  "CarFront",
  "Zap",
  "Armchair",
  "CircleDot",
  "PackageOpen",
  "Boxes",
] as const;

type CategoryIconPickerProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string;
  id?: string;
};

/**
 * Seletor de ícone de categoria — sugestões Lucide + campo livre para digitar.
 */
function CategoryIconPicker({
  value,
  onChange,
  onBlur,
  disabled,
  error,
  id = "category-icon",
}: CategoryIconPickerProps) {
  const reactId = useId();
  const listId = `${reactId}-icon-options`;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Ícone (Lucide)</Label>
      <div className="flex items-center gap-3">
        <span
          className="border-border bg-muted/40 flex size-11 shrink-0 items-center justify-center rounded-xl border"
          aria-hidden
        >
          <CategoryIcon iconName={value || "Boxes"} iconClassName="size-5" />
        </span>
        <Input
          id={id}
          list={listId}
          value={value}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : `${id}-hint`}
          placeholder="Ex.: Cog"
          autoComplete="off"
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
        <datalist id={listId}>
          {CATEGORY_ICON_SUGGESTIONS.map((icon) => (
            <option key={icon} value={icon} />
          ))}
        </datalist>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : (
        <p id={`${id}-hint`} className="text-muted-foreground text-xs">
          Escolha uma sugestão ou digite o nome de um ícone da biblioteca
          Lucide.
        </p>
      )}
    </div>
  );
}

export { CategoryIconPicker };
export type { CategoryIconPickerProps };
