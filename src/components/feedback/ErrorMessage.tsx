import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type ErrorMessageProps = {
  title?: string;
  message: string;
  className?: string;
};

/**
 * Mensagem de erro genérica — sem regra de negócio.
 */
function ErrorMessage({
  title = "Algo deu errado",
  message,
  className,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn(
        "border-destructive/30 bg-destructive/5 text-destructive flex gap-3 rounded-lg border p-4",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="flex flex-col gap-1">
        <p className="text-foreground text-sm font-medium">{title}</p>
        <p className="text-small">{message}</p>
      </div>
    </div>
  );
}

export { ErrorMessage };
export type { ErrorMessageProps };
