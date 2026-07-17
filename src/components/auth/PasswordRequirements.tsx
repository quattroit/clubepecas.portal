"use client";

import { Check, Circle } from "lucide-react";

import {
  evaluatePasswordRules,
  PASSWORD_RULES,
} from "@/lib/auth/passwordPolicy";
import { cn } from "@/lib/utils";

type PasswordRequirementsProps = {
  password: string;
  id?: string;
  className?: string;
};

/**
 * Indicadores visuais da política de senha — atualizados enquanto o usuário digita.
 */
function PasswordRequirements({
  password,
  id,
  className,
}: PasswordRequirementsProps) {
  const rules = evaluatePasswordRules(password);
  const hasInput = password.length > 0;

  return (
    <ul
      id={id}
      className={cn("flex flex-col gap-1", className)}
      aria-live="polite"
      aria-label="Requisitos da senha"
    >
      {PASSWORD_RULES.map((rule) => {
        const met = rules[rule.key];

        return (
          <li
            key={rule.key}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors",
              !hasInput && "text-muted-foreground",
              hasInput && met && "text-emerald-600 dark:text-emerald-400",
              hasInput && !met && "text-muted-foreground",
            )}
          >
            {met ? (
              <Check className="size-3.5 shrink-0" aria-hidden />
            ) : (
              <Circle className="size-3.5 shrink-0 opacity-40" aria-hidden />
            )}
            <span>{rule.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

export { PasswordRequirements };
export type { PasswordRequirementsProps };
