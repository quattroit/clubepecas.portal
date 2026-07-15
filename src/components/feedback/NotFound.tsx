import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type NotFoundProps = {
  title?: string;
  description?: string;
  homeHref?: string;
};

/**
 * Estado 404 reutilizável.
 */
function NotFound({
  title = "Página não encontrada",
  description = "O endereço acessado não existe ou foi movido.",
  homeHref = ROUTES.HOME,
}: NotFoundProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={
        <Link
          href={homeHref}
          className={cn(buttonVariants({ variant: "primary" }))}
        >
          Voltar ao início
        </Link>
      }
    />
  );
}

export { NotFound };
export type { NotFoundProps };
