"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage?: number;
  totalPages?: number;
  /** Preparado para integração futura — não utilizado nesta sprint */
  onPageChange?: (page: number) => void;
  className?: string;
};

function getVisiblePages(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push("ellipsis");

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) pages.push("ellipsis");

  pages.push(totalPages);
  return pages;
}

/**
 * Paginação visual — estrutura pronta para dados reais.
 */
function Pagination({
  currentPage = 1,
  totalPages = 5,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label="Paginação"
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
    >
      <p className="text-small text-muted-foreground mr-1 hidden sm:block">
        Página {currentPage} de {totalPages}
      </p>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Página anterior"
        disabled={currentPage <= 1}
        onClick={() => onPageChange?.(currentPage - 1)}
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="text-muted-foreground px-1 text-sm"
              aria-hidden
            >
              …
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <Button
            key={page}
            type="button"
            variant={isActive ? "primary" : "outline"}
            size="icon-sm"
            aria-label={`Página ${page}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              !isActive && "hover:border-primary/30 hover:text-primary",
            )}
            onClick={() => onPageChange?.(page)}
          >
            {page}
          </Button>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Próxima página"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}

export { Pagination };
export type { PaginationProps };
